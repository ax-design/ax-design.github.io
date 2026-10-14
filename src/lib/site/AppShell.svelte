<script lang="ts">
  // The frame of a page inside the site, laid out like a Windows 8 app: a header with a back
  // button and the title, then columns read left to right, set on paper like a magazine spread.
  // The page scrolls sideways, and the wheel and the keys scroll it through @ax-design/scroll.
  //
  // Narrower than a spread, the same page is one column going down and scrolls down instead:
  // the wheel is left to the browser, which is what the scroll binding waits for.
  import { onMount } from 'svelte';
  import type { Snippet } from 'svelte';
  import BackButton from './BackButton.svelte';
  import { watchWidth } from './layout';
  import { registerAll } from './register';

  interface Props {
    title: string;
    // The color of the page's tile on the start screen.
    accent: string;
    legacy?: boolean;
    // A picture behind the page, with white text, instead of paper.
    wallpaper?: string;
    children: Snippet;
  }

  let { title, accent, legacy = false, wallpaper, children }: Props = $props();

  onMount(() => {
    // The root gets the color of the page too, so nothing beyond the page, while it grows or on
    // an overscroll, shows white.
    const root = document.documentElement;
    const before = root.style.background;
    root.style.background = wallpaper ? '#06182b' : '#f6f3ec';
    let unbind: () => void = () => {};
    let gone = false;
    const stop = watchWidth((wide) => {
      if (!wide) {
        unbind();
        unbind = () => {};
        return;
      }
      registerAll().then(async () => {
        if (gone) return;
        const { bindScroll } = await import('@ax-design/scroll');
        unbind = bindScroll(window).unbind;
      });
    });
    return () => {
      gone = true;
      stop();
      unbind();
      root.style.background = before;
    };
  });
</script>

<div class="app" class:wallpaper={!!wallpaper} style:--page-accent={accent} style:--ui-accent={accent} style:--wallpaper={wallpaper ? `url(${wallpaper})` : undefined}>
  <header class="bar">
    <BackButton href="/" label="Back to Start" />
    <h1>{title}</h1>
    {#if legacy}<span class="legacy">Legacy</span>{/if}
  </header>

  <main class="spread">
    {@render children()}
  </main>
</div>

<style>
  /* Paper: warm white, dark ink, the component's color as the accent. */
  .app {
    height: 100%;
    width: max-content;
    min-width: 100%;
    display: flex;
    flex-direction: column;
    background: #f6f3ec;
    color: #1b1b1b;
  }
  /* The picture is darkened, most under the text at the start of the page, so the text stays
     readable. It scrolls with the page: a fixed background turned the acrylic of the page off
     in Firefox while anything on it was tilted. */
  .wallpaper {
    background:
      linear-gradient(90deg, rgba(3, 16, 32, 0.86), rgba(3, 16, 32, 0.6) 560px, rgba(3, 16, 32, 0.35) 1200px),
      var(--wallpaper) left top / cover #3d5f60;
    color: #fff;
  }
  .bar {
    flex: none;
    display: flex;
    align-items: center;
    gap: 24px;
    height: 120px;
    padding: 24px 0 0 40px;
  }
  h1 {
    margin: 0;
    font-size: 42px;
    font-weight: 300;
    letter-spacing: 0.01em;
  }
  .legacy {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #6b645a;
    border: 1px solid currentColor;
    padding: 2px 8px;
  }
  /* The height a column has before the flow of it spills into the next one. */
  .spread {
    --flow-height: calc(100vh - 144px);
    flex: 1;
    min-height: 0;
    display: flex;
    /* The columns end with their own gap. */
    padding: 24px 80px 0 120px;
  }
  /* A column already carries its own margin at every edge of the spread (the gap of its flow),
     so the ends of the spread add only what those margins still lack: the 120px a column leaves
     at the left edge and the 80px at the right one, minus the 40px gap a flow holds there. */
  .spread > :global(*:first-child) {
    margin-inline-start: 80px;
  }
  .spread > :global(*:last-child) {
    margin-inline-end: 40px;
  }
  /* Narrower than a spread of columns (see #lib/site/layout.ts): one column going down, full
     width, with a margin at both sides; every gap the columns had is a gap the page does not
     need. The shell grows with the page instead of the viewport. */
  @media (max-width: 999px) {
    .app {
      width: auto;
      min-width: 0;
      height: auto;
      min-height: 100%;
    }
    .spread {
      display: block;
      min-height: 0;
      padding: 0;
    }
    .spread > :global(*) {
      height: auto;
      margin: 0;
      padding: 0;
    }
  }
</style>
