<script lang="ts">
  // The app a tile of the start lab opens. The title is the name of the tile, in its color.
  import { onMount } from 'svelte';
  import { registerAll } from '#lib/site/register';
  import { findTile } from '#lib/site/start-lab';

  // The query is read in the browser: a prerendered page cannot read its URL.
  let slug = $state<string | null>(null);
  const tile = $derived(findTile(slug));

  onMount(() => {
    slug = new URLSearchParams(location.search).get('tile');
    registerAll();
    const root = document.documentElement;
    const background = root.style.background;
    root.style.background = '#1d1d1d';
    return () => (root.style.background = background);
  });
</script>

<svelte:head>
  <title>{tile ? `${tile.title} | Start lab` : 'App | Start lab'}</title>
</svelte:head>

<main class="app" style:--app-color={tile?.color ?? '#ffffff'}>
  <h1>{tile?.title ?? 'App'}</h1>
  <p>{tile ? 'An app of the start lab.' : 'No tile was named.'}</p>
  <a class="back" href="/lab/start/">Back to Start</a>
</main>

<style>
  .app {
    position: fixed;
    inset: 0;
    overflow: auto;
    padding: 48px 56px;
    background: #1d1d1d;
    color: #fff;
  }
  h1 {
    margin: 0;
    font-size: 128px;
    font-weight: 300;
    line-height: 1.05;
    color: var(--app-color);
  }
  p {
    font-size: 20px;
    opacity: 0.8;
  }
  .back {
    display: inline-block;
    margin-top: 24px;
    padding: 10px 20px;
    background: #fff;
    color: #1d1d1d;
    text-decoration: none;
    font-size: 16px;
  }
  @media (max-width: 600px) {
    .app {
      padding: 32px 16px;
    }
    h1 {
      font-size: 72px;
    }
  }
</style>
