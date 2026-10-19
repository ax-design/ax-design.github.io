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
        layers="reveal"
        label="hidden"
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
