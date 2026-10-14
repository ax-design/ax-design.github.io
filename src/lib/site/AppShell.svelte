<script lang="ts">
  // The frame of a page inside the site, laid out like a Windows 8 app: a header with a back
  // button and the title, then columns read left to right, set on paper like a magazine spread.
  // The page scrolls sideways, and the wheel and the keys scroll it through @ax-design/scroll.
  import { onMount } from 'svelte';
  import type { Snippet } from 'svelte';
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
    let unbind = () => {};
    registerAll().then(async () => {
      const { bindScroll } = await import('@ax-design/scroll');
      unbind = bindScroll(window).unbind;
    });
    return () => {
      unbind();
      root.style.background = before;
    };
  });
</script>

<div class="app" class:wallpaper={!!wallpaper} style:--page-accent={accent} style:--ui-accent={accent} style:--wallpaper={wallpaper ? `url(${wallpaper})` : undefined}>
  <header class="bar">
    <a class="back" href="/" aria-label="Back to Start">
      <svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="18" /><path d="M22 13l-7 7 7 7M15 20h12" /></svg>
    </a>
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
  .back {
    display: block;
    width: 40px;
    height: 40px;
    color: inherit;
    border-radius: 50%;
  }
  .back svg {
    width: 40px;
    height: 40px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
  }
  .back:hover svg circle {
    fill: rgba(0, 0, 0, 0.08);
  }
  .back:focus-visible {
    outline: 2px solid var(--page-accent);
    outline-offset: 2px;
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
  .spread {
    --flow-height: calc(100vh - 144px);
    flex: 1;
    min-height: 0;
    display: flex;
    /* The flows end with their own gap. */
    padding: 24px 80px 0 120px;
  }
</style>
