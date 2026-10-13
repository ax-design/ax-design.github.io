<script lang="ts">
  import { onMount } from 'svelte';
  import { registerPressure, registerRevealHighlight } from '#lib/utils/register';
  import Tile from '#lib/components/Tile.svelte';

  onMount(async () => {
    await Promise.all([
      registerPressure(),
      registerRevealHighlight()
    ]);
  });

  const tiles = [
    { title: 'Apple', icon: '/demo/images/apple.svg' },
    { title: 'Tea', icon: '/demo/images/tea.svg' },
    { title: 'Fish', icon: '/demo/images/fish.svg' },
    { title: 'Donut', icon: '/demo/images/donut.svg' }
  ];
</script>

<svelte:head>
  <title>Demo - Axiom Design System</title>
</svelte:head>

<div class="demo-bg">
  <nav class="back-nav">
    <a href="/components">← Back to Components</a>
  </nav>

  <ax-reveal-provider>
    <ax-reveal-bound>
      <div class="tile-container">
        {#each tiles as tile (tile.title)}
          <Tile title={tile.title} icon={tile.icon} />
        {/each}
      </div>
    </ax-reveal-bound>
  </ax-reveal-provider>
</div>

<style>
  .demo-bg {
    width: 100vw;
    height: 100vh;
    background: url('/demo/images/background.jpg') center/cover no-repeat;
    position: relative;
    overflow: hidden;
  }

  .back-nav {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 10;
  }

  .back-nav a {
    color: white;
    text-decoration: none;
    background: rgba(0, 0, 0, 0.4);
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    backdrop-filter: blur(10px);
    transition: background 0.2s ease;
  }

  .back-nav a:hover {
    background: rgba(0, 0, 0, 0.7);
  }

  .tile-container {
    width: 320px;
    height: 320px;
    top: 50%;
    left: 50%;
    margin: -160px 0 0 -160px;
    position: absolute;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
</style>
