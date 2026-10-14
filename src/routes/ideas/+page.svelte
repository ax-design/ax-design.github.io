<script lang="ts">
  import { onMount } from 'svelte';
  import AppShell from '#lib/site/AppShell.svelte';
  import Code from '#lib/site/Code.svelte';
  import Flow from '#lib/site/Flow.svelte';
  import { IDEAS, type Idea } from '#lib/site/ideas';
  import { keepOrder, restoreOrder } from '#lib/site/order';
  import { afterRipple } from '#lib/site/ripple';
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

  function onkeydown(event: KeyboardEvent, idea: Idea) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    show(idea);
  }

  let group: HTMLElement | undefined = $state();
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
    return () => {
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
    <p>Point at them and press them. Drag them around to put them in another order. Click one to see the code that makes it.</p>
  </Flow>

  <ax-tile-group bind:this={group} drag="cross-slide" class="ideas" aria-label="Ideas">
    {#each shownIdeas as idea (idea.id)}
      <div
        class="idea"
        data-idea={idea.id}
        data-id={idea.id}
        {...span(idea)}
        role="button"
        tabindex="0"
        aria-label="{idea.title}: show the code"
        onclick={(event) => afterRipple(event, () => show(idea))}
        onkeydown={(event) => onkeydown(event, idea)}
      >
        {@html idea.html}
      </div>
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
  .idea {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    cursor: pointer;
    outline: none;
  }
  .idea:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 4px;
  }
  .description {
    margin: 0 0 20px;
    color: #2b2925;
  }
</style>
