<script lang="ts">
  // The scrollbars of the page: one <ax-scrollbar> for the document, drawn over it in the
  // Windows 8 look of @ax-design/scrollbar. The page still scrolls natively; the element hides the
  // native bars only while it is shown, and the browser brings them back with forced colors.
  //
  // Client only. The element is not in the prerendered HTML: it is added after the packages are
  // registered, so nothing here touches window or a custom element while the site is rendered.
  //
  // The columns of a component page are its markers, ticks on the track with the title of the
  // column as the card: along the horizontal bar of a spread, along the vertical one once the
  // page stacks (see #lib/site/layout.ts).
  import { onMount, tick } from 'svelte';
  import { afterNavigate } from '$app/navigation';
  import { watchWidth } from './layout';
  import { registerAll } from './register';

  interface PageBar extends HTMLElement {
    markers: unknown;
  }

  let ready = $state(false);
  let bar: PageBar | undefined = $state();
  // The page scrolls sideways only while it is a spread; its body keeps the vertical axis hidden
  // then (assets/css/main.css), so the bar of that axis would be one that moves nothing.
  let wide = $state(true);

  function mark() {
    if (!bar) return;
    // Elements, named by their aria-label, on the axis the marker-axis attribute names.
    const columns = document.querySelectorAll<HTMLElement>('main.spread > section[aria-label]');
    bar.markers = columns.length ? Array.from(columns) : null;
  }

  async function settle() {
    await tick();
    requestAnimationFrame(mark);
  }

  afterNavigate(() => {
    if (ready) settle();
  });

  onMount(() => {
    let gone = false;
    const stop = watchWidth((value) => {
      wide = value;
      if (ready) settle();
    });
    registerAll().then(() => {
      if (gone) return;
      ready = true;
      settle();
    });
    return () => {
      gone = true;
      stop();
    };
  });
</script>

{#if ready}
  <ax-scrollbar bind:this={bar} snap vertical={wide ? 'hidden' : 'auto'} marker-axis={wide ? 'horizontal' : 'vertical'}></ax-scrollbar>
{/if}
