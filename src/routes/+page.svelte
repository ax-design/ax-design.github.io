<script lang="ts">
  import { onMount } from 'svelte';
  import Header from '#lib/components/Header.svelte';
  import StartTile from '#lib/site/StartTile.svelte';
  import { isWide } from '#lib/site/layout';
  import { curtainGone } from '#lib/site/curtain';
  import { applyOrder, keepOrder, restoreOrder } from '#lib/site/order';
  import { registerAll } from '#lib/site/register';

  const icon = (name: string) => `/assets/img/icons/${name}.svg`;

  const team = [
    { name: 'Balthild', avatar: 'https://avatars3.githubusercontent.com/u/2662758?s=460&v=4', url: 'https://github.com/balthild' },
    { name: 'Jack Works', avatar: 'https://avatars3.githubusercontent.com/u/5390719?s=460&v=4', url: 'https://github.com/Jack-Works' },
    { name: 'Losses Don', avatar: 'https://avatars2.githubusercontent.com/u/1384036?s=460&v=4', url: 'https://github.com/losses' },
    { name: 'UTL_1138', avatar: 'https://avatars1.githubusercontent.com/u/8299251?s=460&v=4', url: 'https://github.com/967018' }
  ];

  // The cells of a tile group, and the medium tile of two by two cells they make: a grid of two,
  // three or four medium tiles across is four, six or eight cells. The margin is the one a page
  // keeps at both sides once it stacks, as on every other page of the site (see AppShell).
  const CELL = 70;
  const GAP = 10;
  const MARGIN = 40;

  // The medium tiles across a stacked page at this width: the widest of two, three and four whose
  // cells still fit it at their own size. Two medium tiles are 4 x 70 + 3 x 10 = 310px wide.
  function mediumsFor(width: number): number {
    const room = width - 2 * MARGIN;
    for (const mediums of [4, 3, 2]) {
      const columns = mediums * 2;
      if (room >= columns * (CELL + GAP) - GAP) return mediums;
    }
    return 2;
  }

  // A cell keeps its size while the page holds it; a phone too narrow for even two medium tiles
  // gets smaller ones, so the grid fills the page instead of running off its right edge.
  function cellFor(width: number, mediums: number): number {
    const columns = mediums * 2;
    return Math.min(CELL, (width - 2 * MARGIN - (columns - 1) * GAP) / columns);
  }

  // A stacked page can need an arrangement of its own. A grid of six cells holds a wide tile and
  // two small ones beside it, and has no room left for the four-cell Ideas tile: in the order of
  // the page, Ideas has nowhere to go but under Playground, and the two cells beside it stay
  // empty. The two small tiles that do fit there come before it instead. Each entry names the
  // tiles to move to just after the first tile of a group, for one shape of it; a shape with no
  // entry keeps the order of the page.
  const STACKED_ORDER: Record<string, string[]> = {
    m3: ['/components/elevation', '/components/shape'],
  };

  // Whether the page is the sideways spread of the site, or one column going down. The groups
  // follow it: a spread lays its tiles out in a strip eight rows tall and is dragged by the
  // cross-slide of a horizontal scroller; stacked, a group is a grid of cells that grows downward
  // and is dragged by the hold of a touch screen (see #lib/site/layout.ts).
  let wide = $state(false);
  // The medium tiles across a stacked group, and the size of one of its cells.
  let mediums = $state(4);
  let cell = $state(CELL);
  const columns = $derived(mediums * 2);
  const shape = $derived(
    wide
      ? { drag: 'cross-slide', orientation: 'horizontal' }
      : { drag: 'hold', orientation: 'vertical' }
  );

  // The groups keep the order the visitor dragged their tiles into.
  let groups: HTMLElement | undefined = $state();
  // The groups come in once the welcome curtain has mostly lifted, all of them as one Start
  // screen (the <ax-tile-bound> around them): until then they are hidden.
  let shown = $state(false);

  onMount(() => {
    // The root gets the color of the page too, as on every page the AppShell draws: nothing
    // beyond the page box, while the page grows or on an overscroll, shows white.
    const root = document.documentElement;
    const background = root.style.background;
    root.style.background = '#10233d';

    const list = Array.from(groups!.querySelectorAll('section.group')).map((section) => ({
      key: `ax-site:order:start:${section.getAttribute('aria-labelledby')}`,
      group: section.querySelector('ax-tile-group') as HTMLElement
    }));
    // The order of the page, before anyone dragged a tile: the one a shape with no order of its
    // own falls back to.
    const start = new Map(
      list.map(({ group }) => [group, Array.from(group.children, (tile) => (tile as HTMLElement).dataset.id!)])
    );

    let stops: (() => void)[] = [];
    let mode = '';
    let unbindScroll = () => {};
    let gone = false;

    // The order a shape falls back to: the order of the page, with the tiles of STACKED_ORDER for
    // that shape moved to just after the first tile of the group.
    const fallback = (group: HTMLElement, next: string): string[] => {
      const source = start.get(group)!;
      const moved = STACKED_ORDER[next];
      if (!moved) return source;
      const [first, ...rest] = source;
      return [first, ...rest.filter((id) => moved.includes(id)), ...rest.filter((id) => !moved.includes(id))];
    };

    // Puts the tiles of every group in the order dragged into this shape. The sideways spread
    // keeps the key it always had; each stacked width has an order of its own, so the same tiles
    // may sit differently at two, three and four medium tiles across.
    const setOrder = (next: string) => {
      stops.forEach((stop) => stop());
      stops = list.map(({ key, group }) => {
        const own = next === 'wide' ? key : `${key}:${next}`;
        if (!restoreOrder(group, own)) applyOrder(group, fallback(group, next));
        return keepOrder(group, own);
      });
    };

    // Reads the width again: whether the page is a spread, and the grid a stacked page lays its
    // tiles out in.
    const apply = () => {
      const nextWide = isWide();
      // The room the page has, not the window: a scrollbar is not room for tiles.
      const viewport = document.documentElement.clientWidth;
      const nextMediums = nextWide ? mediums : mediumsFor(viewport);
      const nextCell = nextWide ? CELL : cellFor(viewport, nextMediums);
      const nextMode = nextWide ? 'wide' : `m${nextMediums}`;
      if (nextMode === mode && nextCell === cell) return;
      mode = nextMode;
      wide = nextWide;
      mediums = nextMediums;
      cell = nextCell;
      setOrder(mode);
      // The cells of a group change with the custom properties the page writes on its groups, and
      // a change of orientation is one of those nothing reports: the group reads them again.
      for (const { group } of list) (group as HTMLElement & { refresh?: () => void }).refresh?.();
      // Sideways, the wheel glides the page; stacked, the wheel is the browser's own vertical
      // scroll (see #lib/site/layout.ts).
      if (nextWide) {
        registerAll().then(async () => {
          if (gone || !isWide()) return;
          const { bindScroll } = await import('@ax-design/scroll');
          if (gone || !isWide()) return;
          unbindScroll();
          unbindScroll = bindScroll(window).unbind;
        });
      } else {
        unbindScroll();
        unbindScroll = () => {};
      }
    };

    apply();
    window.addEventListener('resize', apply);

    // The entrance is played by hand, in the same task for every group so that they make one
    // wave: shown sets --tile-entrance, which the groups read when enter() starts.
    registerAll()
      .then(curtainGone)
      .then(() => {
        if (gone) return;
        shown = true;
        requestAnimationFrame(() => {
          if (gone) return;
          for (const { group } of list) (group as HTMLElement & { enter?: () => Promise<void> }).enter?.();
        });
      });
    return () => {
      gone = true;
      window.removeEventListener('resize', apply);
      stops.forEach((stop) => stop());
      unbindScroll();
      root.style.background = background;
    };
  });
</script>

<svelte:head>
  <title>AXIOM DESIGN SYSTEM</title>
</svelte:head>

<div class="page">
  <Header />

  <main class="start">
    <div class="column">
      <h1 class="start-title">Start</h1>
      <ax-tile-bound
        class="groups"
        class:shown
        bind:this={groups}
        style:--tile-columns={wide ? undefined : String(columns)}
        style:--tile-cell-width={wide || cell === CELL ? undefined : `${cell}px`}
        style:--tile-cell-height={wide || cell === CELL ? undefined : `${cell}px`}
      >
        <section class="group" aria-labelledby="g-components">
          <h2 id="g-components">Components</h2>
          <ax-tile-group {...shape}>
            <StartTile href="/playground" title="Playground" columns={4} rows={4} icon={icon('ax-playground')} color="#603cba">
              <span class="live" aria-hidden="true"><ax-surface class="morph" layers="fill"></ax-surface></span>
            </StartTile>
            <StartTile href="/ideas" title="Ideas" columns={4} icon={icon('ax-ideas')} color="#00a300" />
            <StartTile href="/components/elevation" title="Elevation" icon={icon('ax-elevation')} color="#7e3878" />
            <StartTile href="/components/shape" title="Shape" icon={icon('ax-shape')} color="#b45309" />
            <StartTile href="/components/surface" title="Surface" icon={icon('ax-surface')} color="#2b5797" />
            <StartTile href="/components/navigation" title="Navigation" icon={icon('ax-navigation')} color="#525e75" />
            <StartTile href="/components/acrylic" title="Acrylic" icon={icon('ax-acrylic')} color="#2d89ef" />
            <StartTile href="/components/reveal-highlight" title="Reveal Highlight" icon={icon('ax-reveal-highlight')} color="#1e7145" />
            <StartTile href="/components/pressure" title="Pressure" icon={icon('ax-pressure')} color="#b91d47" />
            <StartTile href="/components/tile-group" title="Tile Group" icon={icon('ax-tile-group')} color="#da532c" />
            <StartTile href="/components/tile" title="Tile" icon={icon('ax-tile')} color="#e3a21a" />
            <StartTile href="/components/scroll" title="Scroll" icon={icon('ax-scroll')} color="#00aba9" />
            <StartTile href="/components/typed-om" title="Typed OM" icon={icon('ax-typed-om')} color="#9f00a7" />
          </ax-tile-group>
        </section>

        <section class="group" aria-labelledby="g-team">
          <h2 id="g-team">Developers</h2>
          <ax-tile-group {...shape}>
            {#each team as member (member.name)}
              <StartTile href={member.url} title={member.name} image={member.avatar} external />
            {/each}
          </ax-tile-group>
        </section>

        <section class="group" aria-labelledby="g-links">
          <h2 id="g-links">Links</h2>
          <ax-tile-group {...shape}>
            <StartTile href="https://github.com/ax-design" title="GitHub" columns={4} icon={icon('github')} color="#333a45" external />
            <StartTile href="https://t.me/axiom_ds" title="Telegram" icon={icon('telegram')} color="#2a8fbd" external />
          </ax-tile-group>
        </section>
      </ax-tile-bound>
    </div>
  </main>
</div>

<style>
  .page {
    display: flex;
    height: 100%;
    width: max-content;
  }

  /* The title and the groups are one column of the page: in the spread they already share a left
     edge (Start over the first group), and a stacked page keeps them together in the middle of
     the page (see the media query below). */
  .column {
    display: contents;
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
    /* The Start screen of Windows 8.1: the columns come in from the right, one after another
       across the groups, and the next one 35 ms after. */
    --tile-enter-delay: 0ms;
  }
  .groups:not(.shown) ax-tile-group {
    visibility: hidden;
  }
  .groups.shown ax-tile-group {
    --tile-entrance: desktop;
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

  /* Narrower than a spread (see #lib/site/layout.ts): the title image stands above the Start
     screen and the three sections go down the page one after another, every group a grid of cells
     that grows downward, as many medium tiles across as the width holds (see the script above).
     The page keeps the 40px margin the site keeps at both sides. */
  @media (max-width: 919px) {
    .page {
      flex-direction: column;
      width: auto;
      min-height: 100%;
      /* Behind and under the Start screen: the page is the same blue below its content. */
      background: linear-gradient(90deg, #0d2238, #10233d 30%, #142a4a);
    }
    .start {
      flex: none;
      height: auto;
      padding: 24px 40px 32px;
      background: none;
    }
    .start-title {
      margin-bottom: 20px;
      font-size: 32px;
    }
    .groups {
      display: block;
    }
    /* The column is as wide as the grid of this width makes it, and a page wider than that has
       it stand in the middle of the page rather than against its left edge: the title, every
       heading and every grid keep the same left edge, as they do in the spread. */
    .column {
      display: block;
      width: fit-content;
      margin: 0 auto;
    }
    .group {
      height: auto;
    }
    .group + .group {
      margin-top: 40px;
    }
    ax-tile-group {
      flex: none;
    }
    /* Stacked, as on a phone: the turnstile of Windows Phone. */
    .groups.shown ax-tile-group {
      --tile-entrance: mobile;
    }
  }
</style>
