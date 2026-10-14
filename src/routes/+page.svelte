<script lang="ts">
  import { onMount } from 'svelte';
  import Header from '#lib/components/Header.svelte';
  import StartTile from '#lib/site/StartTile.svelte';
  import { keepOrder, restoreOrder } from '#lib/site/order';
  import { registerAll } from '#lib/site/register';

  const icon = (name: string) => `/assets/img/icons/${name}.svg`;

  const team = [
    { name: 'Balthild', avatar: 'https://avatars3.githubusercontent.com/u/2662758?s=460&v=4', url: 'https://github.com/Jack-Works' },
    { name: 'Jack Works', avatar: 'https://avatars3.githubusercontent.com/u/5390719?s=460&v=4', url: 'https://github.com/Jack-Works' },
    { name: 'Losses Don', avatar: 'https://avatars2.githubusercontent.com/u/1384036?s=460&v=4', url: 'https://github.com/losses' },
    { name: 'UTL_1138', avatar: 'https://avatars1.githubusercontent.com/u/8299251?s=460&v=4', url: 'https://github.com/967018' }
  ];

  // The groups keep the order the visitor dragged their tiles into.
  let groups: HTMLElement | undefined = $state();

  onMount(() => {
    const stops = Array.from(groups!.querySelectorAll('ax-tile-group'), (group) => {
      const key = `ax-site:order:start:${group.closest('section')!.getAttribute('aria-labelledby')}`;
      restoreOrder(group, key);
      return keepOrder(group, key);
    });
    let unbind = () => {};
    registerAll().then(async () => {
      const { bindScroll } = await import('@ax-design/scroll');
      unbind = bindScroll(window).unbind;
    });
    return () => {
      unbind();
      stops.forEach((stop) => stop());
    };
  });
</script>

<svelte:head>
  <title>AXIOM DESIGN SYSTEM</title>
</svelte:head>

<div class="page">
  <Header />

  <main class="start">
    <h1 class="start-title">Start</h1>
    <div class="groups" bind:this={groups}>
      <section class="group" aria-labelledby="g-components">
        <h2 id="g-components">Components</h2>
        <ax-tile-group drag="cross-slide">
          <StartTile href="/playground" title="Playground" columns={4} rows={4} color="#603cba">
            <span class="live" aria-hidden="true"><ax-surface class="morph" layers="fill"></ax-surface></span>
          </StartTile>
          <StartTile href="/ideas" title="Ideas" columns={4} icon={icon('ax-ideas')} color="#00a300" />
          <StartTile href="/components/reveal-highlight" title="Reveal Highlight" icon={icon('ax-reveal-highlight')} color="#1e7145" />
          <StartTile href="/components/shape" title="Shape" icon={icon('ax-shape')} color="#b45309" />
          <StartTile href="/components/surface" title="Surface" icon={icon('ax-surface')} color="#2b5797" />
          <StartTile href="/components/typed-om" title="Typed OM" icon={icon('ax-typed-om')} color="#9f00a7" />
          <StartTile href="/components/acrylic" title="Acrylic" icon={icon('ax-acrylic')} color="#2d89ef" />
          <StartTile href="/components/elevation" title="Elevation" icon={icon('ax-elevation')} color="#7e3878" />
          <StartTile href="/components/pressure" title="Pressure" icon={icon('ax-pressure')} color="#b91d47" />
          <StartTile href="/components/tile-group" title="Tile Group" icon={icon('ax-tile-group')} color="#da532c" />
          <StartTile href="/components/scroll" title="Scroll" icon={icon('ax-scroll')} color="#00aba9" />
          <StartTile href="/components/navigation" title="Navigation" icon={icon('ax-navigation')} color="#525e75" badge="Legacy" />
        </ax-tile-group>
      </section>

      <section class="group" aria-labelledby="g-team">
        <h2 id="g-team">Developers</h2>
        <ax-tile-group drag="cross-slide">
          {#each team as member (member.name)}
            <StartTile href={member.url} title={member.name} image={member.avatar} external />
          {/each}
        </ax-tile-group>
      </section>

      <section class="group" aria-labelledby="g-links">
        <h2 id="g-links">Links</h2>
        <ax-tile-group drag="cross-slide">
          <StartTile href="https://github.com/ax-design" title="GitHub" columns={4} icon={icon('github')} color="#333a45" external />
          <StartTile href="https://t.me/axiom_ds" title="Telegram" icon={icon('telegram')} color="#2a8fbd" external />
        </ax-tile-group>
      </section>
    </div>
  </main>
</div>

<style>
  .page {
    display: flex;
    height: 100%;
    width: max-content;
  }

  /* The Start screen: deep blue after the sea of the title image. */
  .start {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 40px 120px 32px 80px;
    background: linear-gradient(90deg, #0d2238, #10233d 30%, #142a4a);
    color: #fff;
  }
  .start-title {
    flex: none;
    margin: 0 0 32px;
    font-size: 42px;
    font-weight: 300;
    letter-spacing: 0.01em;
  }
  .groups {
    flex: 1;
    min-height: 0;
    display: flex;
    gap: 80px;
  }
  .group {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .group h2 {
    flex: none;
    margin: 0 0 16px;
    font-size: 20px;
    font-weight: 300;
  }
  ax-tile-group {
    flex: 1;
    min-height: 0;
    --tile-rows: auto;
  }

  /* The live content of the Surface tile: a shape that keeps changing. */
  .live {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 24px;
  }
  .morph {
    width: 120px;
    height: 120px;
    --ax-fill-color: rgba(255, 255, 255, 0.92);
    --ax-border-width: 0px;
    --ax-edge-kind: triangle;
    --ax-edge-span: 44%;
    --ax-edge-tip-radius: 5px;
    --ax-edge-shoulder-radius: 5px;
    animation: morph 8s cubic-bezier(0.6, 0, 0.3, 1) infinite, spin 16s linear infinite;
  }
  @keyframes morph {
    0%, 100% { --ax-radius: 50%; --ax-corner-top-left-shift-y: 0%; --ax-corner-top-right-shift-x: 0%; --ax-corner-bottom-right-shift-y: 0%; --ax-corner-bottom-left-shift-x: 0%; --ax-edge-depth: 0px; }
    25% { --ax-radius: 28%; --ax-corner-top-left-shift-y: 0%; --ax-corner-top-right-shift-x: 0%; --ax-corner-bottom-right-shift-y: 0%; --ax-corner-bottom-left-shift-x: 0%; --ax-edge-depth: 0px; }
    50% { --ax-radius: 14%; --ax-corner-top-left-shift-y: 50%; --ax-corner-top-right-shift-x: 50%; --ax-corner-bottom-right-shift-y: 50%; --ax-corner-bottom-left-shift-x: 50%; --ax-edge-depth: 0px; }
    75% { --ax-radius: 19%; --ax-corner-top-left-shift-y: 0%; --ax-corner-top-right-shift-x: 0%; --ax-corner-bottom-right-shift-y: 0%; --ax-corner-bottom-left-shift-x: 0%; --ax-edge-depth: 22px; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
