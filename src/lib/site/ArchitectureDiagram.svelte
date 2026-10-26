<script lang="ts">
  // The design system as a containment diagram, in the Metro look: one block that fills its
  // column, four full-width bands inside it, and the packages as flat tiles that fill their band
  // in a grid (five tiles: three and a wide two; four: two by two). Each band is built on the ones below it. A package that is hovered or focused
  // keeps itself and what it depends on at full color, its dependents a little lighter, and
  // dims the rest. It is HTML and CSS, so it reflows with the column.
  import { PLANES, byId, onPlane, usedBy } from './architecture';

  let active: string | null = $state(null);
  const selected = $derived(active ? byId.get(active)! : null);
  const needs = $derived(selected ? selected.needs.map((id) => byId.get(id)!.name) : []);
  const users = $derived(selected ? usedBy(selected.id).map((p) => p.name) : []);
  const needIds = $derived(new Set(selected?.needs ?? []));
  const userIds = $derived(new Set(selected ? usedBy(selected.id).map((p) => p.id) : []));

  const level = (id: string): 'rest' | 'self' | 'needs' | 'users' | 'dim' =>
    active === null ? 'rest' : id === active ? 'self' : needIds.has(id) ? 'needs' : userIds.has(id) ? 'users' : 'dim';

  // The bands from the top: the last plane is the top one.
  const bands = PLANES.map((plane, index) => ({ plane, tiles: onPlane(index) })).reverse();
</script>

<figure class="arch">
  <div class="block" role="group" aria-label="The packages of the design system, in four bands, each built on the bands below it">
    {#each bands as { plane, tiles } (plane.name)}
      <section class="band">
        <h3>{plane.name}</h3>
        <div class="tiles" style:--cols={tiles.length === 5 ? 3 : tiles.length >= 2 ? 2 : 1}>
          {#each tiles as pkg, i (pkg.id)}
            <a
              href={pkg.href}
              class="tile {level(pkg.id)}"
              class:wide={tiles.length === 5 && i === 4}
              style:--tile={pkg.color}
              onpointerenter={() => (active = pkg.id)}
              onpointerleave={() => (active = null)}
              onfocus={() => (active = pkg.id)}
              onblur={() => (active = null)}>{pkg.name}</a
            >
          {/each}
        </div>
      </section>
    {/each}
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
  /* The flow sets the figure's margins (the gap after the column); it keeps them. */
  .arch {
    min-width: 0;
  }
  /* The Start screen's deep blue; the tile colors read as they do there. */
  .block {
    box-sizing: border-box;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px;
    background: #0d2238;
    color: #fff;
    font-family: 'Segoe UI', 'Segoe UI Variable', system-ui, sans-serif;
  }
  .band {
    min-width: 0;
    padding: 8px;
    background: #1a3556;
  }
  h3 {
    margin: 0 0 6px;
    font-size: 12px;
    font-weight: 400;
    line-height: 1.2;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.78);
  }
  .tiles {
    display: grid;
    grid-template-columns: repeat(var(--cols), minmax(0, 1fr));
    gap: 6px;
  }
  .tile.wide {
    grid-column: span 2;
  }
  .tile {
    min-width: 0;
    box-sizing: border-box;
    display: flex;
    align-items: flex-end;
    /* Short enough that the figure fits a column of a short window (the flow's height). */
    min-height: clamp(30px, 5vh, 64px);
    padding: 6px 8px;
    background: var(--tile);
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    line-height: 1.2;
    text-decoration: none;
    overflow-wrap: anywhere;
    transition: opacity 120ms ease-out;
  }
  .tile:focus-visible {
    outline: 3px solid #fff;
    outline-offset: 2px;
  }
  .tile.dim {
    opacity: 0.3;
  }
  .tile.users {
    opacity: 0.7;
  }
  .tile.needs,
  .tile.self {
    opacity: 1;
  }
  .tile.self {
    outline: 2px solid #fff;
    outline-offset: 1px;
  }
  @media (prefers-reduced-motion: reduce) {
    .tile {
      transition: none;
    }
  }

  figcaption {
    margin-top: 12px;
    min-height: 3em;
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
</style>
