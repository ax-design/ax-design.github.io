<script lang="ts">
  // The start screen of the lab: two groups of tiles that launch with the flip. The launch
  // bridge of the route layout holds the splash until the app page has arrived.
  import { onMount } from 'svelte';
  import { registerAll } from '#lib/site/register';
  import { back, front, type LabTile } from '#lib/site/start-lab';

  // Stacked below 600px: the groups become columns going down, with the turnstile entrance.
  let stacked = $state(false);

  onMount(() => {
    registerAll();
    const root = document.documentElement;
    const background = root.style.background;
    root.style.background = '#1d1d1d';
    const narrow = window.matchMedia('(max-width: 600px)');
    const update = () => (stacked = narrow.matches);
    update();
    narrow.addEventListener('change', update);
    return () => {
      narrow.removeEventListener('change', update);
      root.style.background = background;
    };
  });
</script>

<svelte:head>
  <title>Start | Lab</title>
</svelte:head>

<main class="screen">
  <h1>Start</h1>
  <div class="glow" aria-hidden="true"></div>
  <div class="groups" class:stacked>
    <ax-tile-group class="back" orientation={stacked ? 'vertical' : 'horizontal'}>
      {#each back as t (t.slug)}
        {@render tile(t)}
      {/each}
    </ax-tile-group>
    <ax-tile-group class="front" orientation={stacked ? 'vertical' : 'horizontal'}>
      {#each front as t (t.slug)}
        {@render tile(t)}
      {/each}
    </ax-tile-group>
  </div>
  <p class="note">Tiles open their app with the flip. <a href="/lab/">Back to the lab</a></p>
</main>

{#snippet tile(t: LabTile)}
  <ax-tile
    layers={t.acrylic ? 'acrylic reveal' : t.image ? 'fill' : 'fill reveal'}
    columns={t.columns}
    rows={t.rows}
    style:--ax-fill-color={t.color}
    style:--ax-tile-splash-color={t.color}
  >
    {#if t.image}
      <img class="picture" src={t.image} alt="" />
      <span class="shade"></span>
    {:else if t.icon}
      <span class="icon" style:--icon="url({t.icon})"></span>
    {/if}
    <a slot="action" href="/lab/start/app/?tile={t.slug}">{t.title}</a>
    <template slot="splash">
      {#if t.image}
        <img class="splash-picture" src={t.image} alt="" />
      {:else if t.icon}
        <span class="splash-icon" style:--icon="url({t.icon})"></span>
      {/if}
    </template>
  </ax-tile>
{/snippet}

<style>
  .screen {
    position: fixed;
    inset: 0;
    overflow: auto;
    background: #1d1d1d;
    color: #fff;
  }
  h1 {
    position: absolute;
    left: 40px;
    top: 28px;
    margin: 0;
    font-size: 72px;
    font-weight: 300;
    line-height: 1;
    color: #fff;
  }
  /* A glow of color behind the second group, for the acrylic tile to blur. */
  .glow {
    position: absolute;
    right: -10%;
    bottom: -10%;
    width: 70%;
    height: 80%;
    background:
      radial-gradient(ellipse 35% 45% at 30% 35%, #ff7a18 0%, #af002d 45%, transparent 100%),
      radial-gradient(ellipse 30% 40% at 75% 75%, #2d89ef 0%, transparent 100%),
      radial-gradient(ellipse 25% 30% at 55% 15%, #00a300 0%, transparent 100%);
    opacity: 0.85;
    pointer-events: none;
  }
  .groups {
    position: absolute;
    left: 40px;
    top: 150px;
    display: flex;
    align-items: flex-start;
    gap: 50px;
    --tile-cell-width: 100px;
    --tile-cell-height: 100px;
    --tile-gap: 10px;
    --tile-rows: 4;
  }
  ax-tile-group {
    display: block;
    --ax-tile-launch: flip;
    --tile-entrance: desktop;
  }
  .back {
    --tile-enter-delay: 0ms;
    --tile-enter-offset: 225px;
  }
  .front {
    --tile-enter-delay: 300ms;
    --tile-enter-offset: 90px;
    margin-top: 60px;
  }
  ax-tile {
    color: #fff;
    --reveal-color: rgb(255, 255, 255);
    --reveal-opacity: 0.3;
  }
  .icon {
    position: absolute;
    left: 50%;
    top: 46%;
    width: 44px;
    height: 44px;
    transform: translate(-50%, -50%);
    background: currentColor;
    -webkit-mask: var(--icon) center / contain no-repeat;
    mask: var(--icon) center / contain no-repeat;
  }
  .picture {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    -webkit-user-drag: none;
  }
  .shade {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 40px;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.55));
  }
  .splash-icon {
    display: block;
    width: 160px;
    height: 160px;
    background: #fff;
    -webkit-mask: var(--icon) center / contain no-repeat;
    mask: var(--icon) center / contain no-repeat;
  }
  .splash-picture {
    display: block;
    width: 200px;
    height: 200px;
    object-fit: cover;
  }
  .note {
    position: absolute;
    left: 40px;
    bottom: 16px;
    margin: 0;
    font-size: 14px;
    opacity: 0.7;
  }
  .note a {
    color: inherit;
  }
  /* Phones: one column going down, each tile smaller. */
  @media (max-width: 600px) {
    h1 {
      left: 16px;
      top: 20px;
      font-size: 48px;
    }
    ax-tile-group {
      --tile-entrance: mobile;
    }
    .groups {
      position: relative;
      left: 0;
      top: 0;
      flex-direction: column;
      gap: 24px;
      padding: 120px 16px 56px;
      --tile-cell-width: 80px;
      --tile-cell-height: 80px;
      --tile-gap: 10px;
      --tile-columns: 4;
    }
    .front {
      margin-top: 0;
    }
    .note {
      left: 16px;
    }
  }
</style>
