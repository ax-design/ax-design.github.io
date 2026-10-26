<script lang="ts">
  // The exploded view of the design system: four planes one above the other, a tile on a plane
  // for each package, and a line for each dependency. It is drawn as SVG through a small
  // orthographic projection (see iso.ts), turned by the pointer, a drag or the buttons. A
  // package that is hovered or focused lights its dependencies and its dependents.
  //
  // Narrow, the planes are flattened into four stacked rows with the same tiles (the 3D view is
  // hidden by CSS, not removed, so both are server-rendered).
  import { onMount } from 'svelte';
  import { EDGES, PACKAGES, PLANES, byId, onPlane, usedBy } from './architecture';
  import { project, slab } from './iso';
  import type { View } from './iso';

  // The scene, in its own units: the size of a plane, of a tile and their thickness.
  const PLANE_W = 640;
  const PLANE_D = 150;
  const PLANE_T = 5;
  const TILE_W = 100;
  const TILE_D = 80;
  const TILE_T = 10;

  // Where a tile stands on its plane, along x. Scrollbar is next to Elevation and Scroll, which it
  // uses, to keep its lines short.
  const SPOT: Record<string, number> = {
    'typed-om': -110,
    shape: 110,
    surface: 0,
    elevation: -195,
    acrylic: -65,
    'reveal-highlight': 65,
    pressure: 195,
    scrollbar: -240,
    scroll: -120,
    tile: 0,
    'tile-group': 120,
    navigation: 240
  };

  const REST = { yaw: -20, pitch: 50, gap: 130 };
  const EXPLODED_GAP = 190;
  const WIDTH = 760;
  const HEIGHT = 720;

  // What the view is heading for, and what it shows now: the pointer and the drag turn it, and
  // every frame closes part of the distance.
  let yawPointer = $state(0);
  let pitchPointer = $state(0);
  let yawTurn = $state(0);
  let exploded = $state(false);
  let yaw = $state(REST.yaw);
  let pitch = $state(REST.pitch);
  let gap = $state(REST.gap);
  let reduced = $state(false);

  const target = $derived({
    yaw: REST.yaw + yawPointer + yawTurn,
    pitch: REST.pitch + pitchPointer,
    gap: exploded ? EXPLODED_GAP : REST.gap
  });

  let frame = 0;
  function chase() {
    frame = 0;
    const next = (now: number, goal: number) => (reduced || Math.abs(goal - now) < 0.05 ? goal : now + (goal - now) * 0.14);
    yaw = next(yaw, target.yaw);
    pitch = next(pitch, target.pitch);
    gap = next(gap, target.gap);
    if (yaw !== target.yaw || pitch !== target.pitch || gap !== target.gap) frame = requestAnimationFrame(chase);
  }
  function go() {
    if (typeof window === 'undefined') return;
    if (!frame) frame = requestAnimationFrame(chase);
  }
  $effect(() => {
    // Any change of the target sets the view moving.
    void target.yaw;
    void target.pitch;
    void target.gap;
    go();
  });

  const view = $derived<View>({
    yaw,
    pitch,
    scale: 1,
    cx: WIDTH / 2 + 40,
    cy: HEIGHT / 2 + 1.5 * gap * Math.cos((pitch * Math.PI) / 180)
  });

  // The hovered or focused package, and what it relates to.
  let active: string | null = $state(null);
  let pointerOver = false;
  const related = $derived.by(() => {
    if (!active) return null;
    const pkg = byId.get(active)!;
    return new Set([active, ...pkg.needs, ...usedBy(active).map((p) => p.id)]);
  });
  const selected = $derived(active ? byId.get(active)! : null);
  const needs = $derived(selected ? selected.needs.map((id) => byId.get(id)!.name) : []);
  const users = $derived(selected ? usedBy(selected.id).map((p) => p.name) : []);

  const dim = (id: string) => related !== null && !related.has(id);
  const edgeState = (from: string, to: string): 'on' | 'off' | 'rest' =>
    active === null ? 'rest' : from === active || to === active ? 'on' : 'off';

  // A name in lines of about fourteen letters.
  function wrap(text: string): string[] {
    const lines: string[] = [];
    for (const word of text.split(' ')) {
      const last = lines[lines.length - 1];
      if (last !== undefined && last.length + word.length < 15) lines[lines.length - 1] = `${last} ${word}`;
      else lines.push(word);
    }
    return lines;
  }

  // Every plane and its tiles, as the projection draws them.
  const scene = $derived(
    PLANES.map((plane, index) => {
      const z = index * gap;
      const base = slab(view, 0, 0, z, PLANE_W, PLANE_D, PLANE_T);
      const tiles = onPlane(index)
        .map((pkg) => {
          const x = SPOT[pkg.id];
          const box = slab(view, x, 0, z + PLANE_T, TILE_W, TILE_D, TILE_T);
          const [cx, cy] = project(view, x, 0, z + PLANE_T + TILE_T);
          // Depth along the turned view, to draw the farther tiles first.
          const depth = x * Math.sin((view.yaw * Math.PI) / 180);
          return { pkg, box, cx, cy, depth, lines: pkg.name.length > 11 ? pkg.name.split(' ') : [pkg.name] };
        })
        .sort((a, b) => a.depth - b.depth);
      // The name stands in the gutter at the left of the plane, by its front corner.
      const [lx, ly] = project(view, -PLANE_W / 2, PLANE_D / 2 - 20, z + PLANE_T);
      return { plane, index, base, tiles, label: { x: lx - 14, y: ly, lines: wrap(`${index + 1}. ${plane.name}`) } };
    })
  );

  // A line from the underside of a package to the top of what it uses.
  const wires = $derived(
    EDGES.map(([from, to]) => {
      const a = byId.get(from)!;
      const b = byId.get(to)!;
      const [x1, y1] = project(view, SPOT[from], 0, a.plane * gap + PLANE_T);
      const [x2, y2] = project(view, SPOT[to], 0, b.plane * gap + PLANE_T + TILE_T);
      return { from, to, x1, y1, x2, y2 };
    })
  );

  // Dragging and the pointer turn the view; neither does anything when motion is reduced.
  let drag: { x: number; turn: number; id: number } | null = null;
  function onMove(event: PointerEvent) {
    if (reduced) return;
    const box = (event.currentTarget as Element).getBoundingClientRect();
    if (drag && event.pointerId === drag.id) {
      yawTurn = drag.turn + (event.clientX - drag.x) * 0.4;
      return;
    }
    if (pointerOver || event.pointerType === 'touch') return;
    yawPointer = ((event.clientX - box.left) / box.width - 0.5) * 24;
    pitchPointer = (0.5 - (event.clientY - box.top) / box.height) * 10;
  }
  function onDown(event: PointerEvent) {
    if (reduced || !event.isPrimary || (event.target as Element).closest('a')) return;
    drag = { x: event.clientX, turn: yawTurn, id: event.pointerId };
    (event.currentTarget as Element).setPointerCapture(event.pointerId);
  }
  function onUp(event: PointerEvent) {
    if (drag && event.pointerId === drag.id) drag = null;
  }
  function onLeave() {
    yawPointer = 0;
    pitchPointer = 0;
  }
  const turn = (by: number) => (yawTurn += by);
  function reset() {
    yawTurn = 0;
    yawPointer = 0;
    pitchPointer = 0;
    exploded = false;
  }

  function enter(id: string, event?: Event) {
    active = id;
    if (event && event.type === 'pointerenter') pointerOver = true;
  }
  function leave(event?: Event) {
    active = null;
    if (event && event.type === 'pointerleave') pointerOver = false;
  }

  onMount(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      reduced = query.matches;
      if (reduced) {
        yawPointer = 0;
        pitchPointer = 0;
        drag = null;
        // Static: the view takes its place now.
        yaw = target.yaw;
        pitch = target.pitch;
        gap = target.gap;
      }
    };
    sync();
    query.addEventListener('change', sync);
    return () => {
      query.removeEventListener('change', sync);
      cancelAnimationFrame(frame);
    };
  });

  // Plane label: the rows of the flat view run from the top plane down.
  const flatPlanes = PLANES.map((plane, index) => ({ plane, index, tiles: onPlane(index) })).reverse();
</script>

<figure class="arch">
  <div class="stage" class:reduced>
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <svg
      class="solid"
      viewBox="0 0 {WIDTH} {HEIGHT}"
      role="group"
      aria-labelledby="arch-title"
      aria-describedby="arch-desc"
      onpointermove={onMove}
      onpointerdown={onDown}
      onpointerup={onUp}
      onpointercancel={onUp}
      onpointerleave={onLeave}
    >
      <title id="arch-title">The packages of the design system, in four layers</title>
      <desc id="arch-desc">
        An exploded view: one plane for each layer, a tile for each package, and a line for each dependency. The same
        layers and dependencies are listed as text beside it.
      </desc>

      {#each scene as { plane, index, base, label } (plane.name)}
        <g class="plane">
          {#each base.sides as side}
            <polygon class="side" points={side.points} />
          {/each}
          <polygon class="floor" points={base.top} />
        </g>
      {/each}

      <g class="wires" aria-hidden="true">
        {#each wires as wire (wire.from + wire.to)}
          <line class="wire {edgeState(wire.from, wire.to)}" x1={wire.x1} y1={wire.y1} x2={wire.x2} y2={wire.y2} />
          {#if edgeState(wire.from, wire.to) === 'on'}
            <circle class="end" cx={wire.x2} cy={wire.y2} r="3.5" />
          {/if}
        {/each}
      </g>

      {#each scene as { index, tiles } (index)}
        {#each tiles as { pkg, box, cx, cy, lines } (pkg.id)}
          <a
            href={pkg.href}
            class="tile"
            class:dim={dim(pkg.id)}
            class:chosen={active === pkg.id}
            style:--tile={pkg.color}
            aria-label={pkg.name}
            onpointerenter={(event) => enter(pkg.id, event)}
            onpointerleave={(event) => leave(event)}
            onfocus={() => enter(pkg.id)}
            onblur={() => leave()}
          >
            {#each box.sides as side}
              <polygon class="rim" points={side.points} />
              <polygon class="shade" points={side.points} style:opacity={side.shade} />
            {/each}
            <polygon class="top" points={box.top} />
            <text class="name" x={cx} y={cy - (lines.length - 1) * 8 + 5} text-anchor="middle" aria-hidden="true">
              {#each lines as line, i (i)}<tspan x={cx} dy={i === 0 ? 0 : 16}>{line}</tspan>{/each}
            </text>
          </a>
        {/each}
      {/each}

      <g aria-hidden="true">
        {#each scene as { plane, label } (plane.name)}
          <text class="plane-name" x={label.x} y={label.y - (label.lines.length - 1) * 7} text-anchor="end">
            {#each label.lines as line, i (i)}<tspan x={label.x} dy={i === 0 ? 0 : 15}>{line}</tspan>{/each}
          </text>
        {/each}
      </g>
    </svg>

    <!-- The flat view of a narrow page: the same planes as four rows. -->
    <div class="flat">
      {#each flatPlanes as { plane, index, tiles } (plane.name)}
        <section class="row">
          <h3>{index + 1}. {plane.name}</h3>
          <div class="cells">
            {#each tiles as pkg (pkg.id)}
              <a
                href={pkg.href}
                class="cell"
                class:dim={dim(pkg.id)}
                style:--tile={pkg.color}
                onpointerenter={(event) => enter(pkg.id, event)}
                onpointerleave={(event) => leave(event)}
                onfocus={() => enter(pkg.id)}
                onblur={() => leave()}>{pkg.name}</a
              >
            {/each}
          </div>
        </section>
      {/each}
    </div>
  </div>

  <div class="tools">
    <button type="button" aria-pressed={exploded} onclick={() => (exploded = !exploded)}>Explode</button>
    <button type="button" class="turn" onclick={() => turn(-20)}>Rotate left</button>
    <button type="button" class="turn" onclick={() => turn(20)}>Rotate right</button>
    <button type="button" class="turn" onclick={reset}>Reset</button>
  </div>

  <figcaption aria-live="polite">
    {#if selected}
      <strong style:--tile={selected.color}>{selected.name}</strong>
      <span class="about">{selected.about}</span>
      <span class="relations">
        Depends on: {needs.length ? needs.join(', ') : 'nothing'}.
        Used directly by: {users.length ? users.join(', ') : 'nothing'}.
      </span>
    {:else}
      <span class="about">Hover or focus a package to light its dependencies and its dependents. A tile opens its page.</span>
    {/if}
  </figcaption>
</figure>

<style>
  .arch {
    margin: 0;
  }
  /* The Start screen's deep blue: the tile colors read as they do there. */
  .stage {
    background: linear-gradient(160deg, #0d2238, #10233d 40%, #142a4a);
    color: #fff;
    border-radius: 0;
  }
  svg {
    display: block;
    width: 100%;
    height: clamp(400px, calc(100vh - 330px), 720px);
    touch-action: pan-y;
    cursor: grab;
    user-select: none;
  }
  .reduced svg {
    cursor: auto;
  }
  .flat {
    display: none;
  }

  .floor {
    fill: rgba(255, 255, 255, 0.07);
    stroke: rgba(255, 255, 255, 0.4);
    stroke-width: 1.5;
    stroke-linejoin: round;
  }
  .side {
    fill: rgba(255, 255, 255, 0.12);
  }
  .plane-name {
    fill: rgba(255, 255, 255, 0.78);
    font-size: 13px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    pointer-events: none;
  }

  .wire {
    stroke: rgba(255, 255, 255, 0.2);
    stroke-width: 1.25;
  }
  .wire.off {
    stroke: rgba(255, 255, 255, 0.07);
  }
  .wire.on {
    stroke: #fff;
    stroke-width: 2.5;
  }
  .end {
    fill: #fff;
  }

  .tile {
    outline: none;
    cursor: pointer;
  }
  .tile .top {
    fill: var(--tile);
    stroke: rgba(255, 255, 255, 0.35);
    stroke-width: 1;
    stroke-linejoin: round;
  }
  .tile .rim {
    fill: var(--tile);
  }
  .tile .shade {
    fill: #000;
  }
  .tile .name {
    fill: #fff;
    font-size: 14px;
    font-weight: 600;
    pointer-events: none;
    paint-order: stroke;
    stroke: rgba(0, 0, 0, 0.25);
    stroke-width: 2px;
  }
  .tile.dim,
  .cell.dim {
    opacity: 0.4;
  }
  .tile.chosen .top,
  .tile:hover .top,
  .tile:focus-visible .top {
    stroke: #fff;
    stroke-width: 2.5;
  }
  .tile:focus-visible .rim {
    stroke: #fff;
    stroke-width: 2;
  }

  .tools {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 12px 0;
  }
  .tools button {
    height: 32px;
    padding: 0 16px;
    border: 2px solid transparent;
    border-radius: 0;
    background: rgba(0, 0, 0, 0.15);
    color: #1b1b1b;
    font: inherit;
    font-size: 14px;
    cursor: pointer;
  }
  .tools button:hover {
    background: rgba(0, 0, 0, 0.25);
  }
  .tools button[aria-pressed='true'] {
    background: var(--page-accent, #647687);
    color: #fff;
  }
  .tools button:focus-visible {
    outline: 2px solid #1b1b1b;
    outline-offset: 2px;
  }
  figcaption {
    min-height: 4.6em;
    font-size: 15px;
    line-height: 1.5;
    color: #2b2925;
  }
  figcaption strong {
    display: inline-block;
    margin-right: 8px;
    padding: 0 8px;
    background: var(--tile);
    color: #fff;
    font-weight: 600;
  }
  .relations {
    display: block;
    font-size: 13px;
    color: #6b645a;
  }

  /* Narrow: the planes flatten into rows, with no lines. */
  @media (max-width: 640px) {
    svg,
    .tools {
      display: none;
    }
    .flat {
      display: block;
      padding: 16px;
    }
    .row + .row {
      margin-top: 14px;
    }
    h3 {
      margin: 0 0 6px;
      font-size: 12px;
      font-weight: 400;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.78);
    }
    .cells {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      padding: 8px;
      background: rgba(255, 255, 255, 0.07);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
    .cell {
      display: flex;
      align-items: flex-end;
      min-width: 92px;
      min-height: 64px;
      padding: 6px 8px;
      flex: 1 1 92px;
      background: var(--tile);
      color: #fff;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
    }
    .cell:focus-visible {
      outline: 3px solid #fff;
      outline-offset: 1px;
    }
  }
</style>
