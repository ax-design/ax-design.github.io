<script lang="ts">
  import { onMount } from 'svelte';
  import AppShell from '#lib/site/AppShell.svelte';
  import Code from '#lib/site/Code.svelte';
  import Flow from '#lib/site/Flow.svelte';
  import { IDEAS, type Idea } from '#lib/site/ideas';
  import { watchWidth } from '#lib/site/layout';
  import { keepOrder, restoreOrder } from '#lib/site/order';
  import { scopeCss } from '#lib/site/scope';
  import { Flyout } from '#lib/ui/index.ts';

  const ACCENT = '#00a300';

  // Every idea's CSS, each kept to its own tile.
  const styles = `<style>${IDEAS.map((idea) => scopeCss(idea.css, `[data-idea="${idea.id}"]`)).join('\n')}</style>`;

  // The size of a tile, in cells: attributes the tile group reads on any element.
  const span = (idea: Idea): Record<string, number> => ({ columns: idea.columns, rows: idea.rows });

  let shown: Idea | null = $state(null);
  let open = $state(false);

  function show(idea: Idea) {
    shown = idea;
    open = true;
  }

  // The hidden action still names the tile for the keyboard and AT, but it must not take the
  // pointer: the example receives hover, active and its own pointer scripts. A click on the
  // example is handed to the action, which keeps the tile's gate and its delay. The player's
  // play button is its own control: pressing it deforms the player and does not open the code.
  function forward(event: MouseEvent) {
    const tile = event.currentTarget as HTMLElement;
    const action = tile.querySelector(':scope > [slot="action"]') as HTMLElement | null;
    if (!action || event.target === action) return;
    const target = event.target as Element | null;
    if (target?.closest?.('a,button,input,select,textarea,[role="button"],[contenteditable],.play')) return;
    action.click();
  }

  // The surfaces inside the tile receive the pointer themselves, so a lift has to release them:
  // otherwise their press, tilt and reveal light stay until the pointer is up.
  function releaseInner(event: Event) {
    const tile = event.target as HTMLElement | null;
    if (!tile) return;
    const all = tile.querySelectorAll('*');
    for (let i = 0; i < all.length; i++) {
      const surface = all[i] as HTMLElement & { release?: () => void };
      if (typeof surface.release === 'function') surface.release();
    }
  }

  // A held touch or pen lifts the tile, and the click that follows the release is not a tap. The
  // page guards this itself so it also works with the published tile-group, which has no lift
  // event: a drag releases at tiledragstart, a hold releases after hold-delay.
  let holdTimer = 0;
  let clickTimer = 0;
  let holdPointer: number | null = null;
  let held = false;

  function tileOf(event: PointerEvent): HTMLElement | null {
    if (!group) return null;
    const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
    for (const node of path) if (node instanceof HTMLElement && node.parentElement === group) return node;
    return null;
  }

  function holdDelay(): number {
    const n = parseFloat(group?.getAttribute('hold-delay') || '');
    return n >= 0 ? n : 500;
  }

  function suppressClick() {
    const stop = (event: Event) => {
      event.stopPropagation();
      event.preventDefault();
      window.removeEventListener('click', stop, true);
    };
    window.addEventListener('click', stop, true);
    clickTimer = window.setTimeout(() => window.removeEventListener('click', stop, true), 400);
  }

  function onPointerDown(event: PointerEvent) {
    if (!event.isPrimary || event.pointerType === 'mouse' || event.button !== 0) return;
    const tile = tileOf(event);
    if (!tile) return;
    held = false;
    holdPointer = event.pointerId;
    window.clearTimeout(holdTimer);
    holdTimer = window.setTimeout(() => {
      if (holdPointer !== event.pointerId) return;
      held = true;
      releaseInner({ target: tile } as unknown as Event);
    }, holdDelay());
  }

  function onPointerUp(event: PointerEvent) {
    if (event.pointerId !== holdPointer) return;
    window.clearTimeout(holdTimer);
    holdPointer = null;
    if (held) {
      held = false;
      suppressClick();
    }
  }

  function onPointerCancel(event: PointerEvent) {
    if (event.pointerId !== holdPointer) return;
    window.clearTimeout(holdTimer);
    holdPointer = null;
    held = false;
  }

  function onDragStart(event: Event) {
    // A drag takes the gesture over: release the surfaces of the example at once.
    window.clearTimeout(holdTimer);
    holdPointer = null;
    held = false;
    releaseInner(event);
  }

  let group: HTMLElement | undefined = $state();
  // Wide, the ideas are a sideways spread like every other page: a strip of tiles eight rows
  // tall, reordered by the cross-slide drag of a horizontal scroller. Narrower than a spread,
  // the page is one column going down: the description stands above the group, the group grows
  // downward with as many columns as its width holds, and a tile is reordered by pressing and
  // holding it, the hold drag.
  let wide = $state(false);
  // Temporary, for finding a Firefox bug: ?only=weather,note shows only those ideas, and
  // leaves the stored order alone.
  let only: string[] | null = $state(null);
  const shownIdeas = $derived(only ? IDEAS.filter((idea) => only!.includes(idea.id)) : IDEAS);

  onMount(() => {
    const param = new URLSearchParams(location.search).get('only');
    if (param) only = param.split(',');
    const keep = !param;
    if (keep) restoreOrder(group!, 'ax-site:order:ideas');
    const stopKeeping = keep ? keepOrder(group!, 'ax-site:order:ideas') : () => {};
    group!.addEventListener('pointerdown', onPointerDown);
    group!.addEventListener('tiledragstart', onDragStart);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerCancel);
    const stops = IDEAS.filter((idea) => idea.js && (!only || only.includes(idea.id))).map((idea) => idea.js!.run(group!.querySelector(`[data-idea="${idea.id}"]`) as HTMLElement));
    // The group lays its cells out again when the custom properties change; a change of
    // orientation is one of those nothing reports, so the group is told to read them again.
    const stopWidth = watchWidth((value) => {
      wide = value;
      (group as (HTMLElement & { refresh?: () => void }) | undefined)?.refresh?.();
    });
    return () => {
      stopWidth();
      stopKeeping();
      group!.removeEventListener('pointerdown', onPointerDown);
      group!.removeEventListener('tiledragstart', onDragStart);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerCancel);
      window.clearTimeout(holdTimer);
      window.clearTimeout(clickTimer);
      stops.forEach((stop) => stop());
    };
  });
</script>

<svelte:head>
  <title>Ideas - Axiom Design System</title>
  {@html styles}
</svelte:head>

<AppShell title="Ideas" accent={ACCENT} wallpaper="/demo/images/background.jpg">
  <Flow label="About" width={300}>
    <p class="lead">Small things made of Surface and its layers: corners, bites and tails, light, glass and shadow.</p>
    <p>Point at them and press them. Drag them around to put them in another order; on a touch screen, press and hold one first. Click one to see the code that makes it.</p>
  </Flow>

  <ax-tile-group
    bind:this={group}
    drag={wide ? 'cross-slide' : 'hold'}
    orientation={wide ? 'horizontal' : 'vertical'}
    class="ideas"
    class:narrow={!wide}
    aria-label="Ideas"
  >
    {#each shownIdeas as idea (idea.id)}
      <ax-tile
        class="idea"
        data-idea={idea.id}
        data-id={idea.id}
        {...span(idea)}
        label="hidden"
        onclick={forward}
      >
        <div class="body">{@html idea.html}</div>
        <button slot="action" type="button" onclick={() => show(idea)}>{idea.title}</button>
      </ax-tile>
    {/each}
  </ax-tile-group>
</AppShell>

<Flyout bind:open title={shown?.title ?? ''} width={520}>
  {#if shown}
    <p class="description">{shown.description}</p>
    <Code code={shown.html} language="html" />
    <Code code={shown.css} language="css" />
    {#if shown.js}<Code code={shown.js.code} language="js" />{/if}
  {/if}
</Flyout>

<style>
  .lead {
    margin-top: 0;
    font-size: 22px;
    font-weight: 300;
    line-height: 1.35;
  }
  p {
    margin-top: 0;
    font-size: 15px;
    line-height: 1.55;
  }
  /* Cells of 56px with 12px gaps: two cells are 124px, four 260px. Eight rows make the ideas a
     block of twelve by eight cells. */
  .ideas {
    flex: none;
    height: var(--flow-height);
    margin-right: 40px;
    --tile-cell-width: 56px;
    --tile-cell-height: 56px;
    --tile-gap: 12px;
    --tile-rows: 8;
    /* Glass tiles stay glass while dragged: a faded tile would be a backdrop root. */
    --tile-drag-opacity: 1;
  }
  /* The name of an idea is its button: label="hidden" keeps it as the name, and the text is hidden
     here, as the tile's own rule for it does not match in Chromium. The button takes no pointer,
     so the example under it keeps its hover, active and scripts; a click on the example is
     forwarded to the button. The tile itself does not tilt: the examples tilt as their code says. */
  .idea {
    cursor: pointer;
    --ax-tilt-mode: off;
  }
  .idea button {
    font-size: 0;
    line-height: 0;
  }
  .idea > button[slot='action'] {
    pointer-events: none;
  }
  /* The idea's own markup, laid out as it was in a plain cell. */
  .body {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    height: 100%;
  }
  .description {
    margin: 0 0 20px;
    color: #2b2925;
  }
  /* Narrower than a spread (see #lib/site/layout.ts): the group lets its height go, keeps the
     margins a page keeps at both sides, and takes as many columns of cells as its width holds. */
  @media (max-width: 919px) {
    .ideas.narrow {
      height: auto;
      margin: 0 40px;
      --tile-rows: auto;
      --tile-columns: auto;
    }
  }
</style>
