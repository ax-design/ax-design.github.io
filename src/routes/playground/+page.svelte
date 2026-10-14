<script lang="ts">
  import AppShell from '#lib/site/AppShell.svelte';
  import Code from '#lib/site/Code.svelte';
  import Flow from '#lib/site/Flow.svelte';
  import { CORNERS, CORNER_LABELS, GROUPS, INITIAL, LAYERS, PRESETS, SIDES, SIDE_LABELS, cssOf, scalePx } from '#lib/site/playground';
  import type { Control, Group, Preset } from '#lib/site/playground';
  import { CheckBox, ColorPicker, ComboBox, Expander, RadioGroup, Slider } from '#lib/ui/index.ts';
  import { onMount } from 'svelte';
  import { registerAll } from '#lib/site/register';

  // The shapes and the controls scroll sideways in a scroller of their own, not the page: the
  // stage stays put without position: sticky, under which Firefox draws a pressed, tilting
  // acrylic surface clear.
  let scroller: HTMLElement | undefined = $state();
  onMount(() => {
    let unbind = () => {};
    registerAll().then(async () => {
      const { bindScroll } = await import('@ax-design/scroll');
      unbind = bindScroll(scroller!).unbind;
    });
    return () => unbind();
  });

  const ACCENT = '#603cba';

  let layers: string[] = $state(['elevation', 'acrylic', 'reveal']);
  let size: [number, number] = $state([240, 150]);
  let props: Record<string, string> = $state({ ...INITIAL });
  let corner = $state(CORNERS[0]);
  let side = $state(SIDES[0]);

  // Defaults of every control, for the properties not set.
  const defaults: Record<string, string> = {};
  for (const g of GROUPS) {
    for (const c of g.controls) {
      if (g.pick) for (const n of g.pick.key === 'corner' ? CORNERS : SIDES) defaults[c.prop.replace(`{${g.pick.key}}`, n)] = c.initial;
      else defaults[c.prop] = c.initial;
    }
  }

  const resolve = (g: Group, c: Control) => (g.pick ? c.prop.replace(`{${g.pick.key}}`, g.pick.key === 'corner' ? corner : side) : c.prop);

  // A side or corner that sets nothing shows the shared value it follows.
  function current(prop: string): string {
    if (prop in props) return props[prop];
    const one = /^--ax-edge-(top|right|bottom|left)-(.+)$/.exec(prop);
    if (one) return current(`--ax-edge-${one[2]}`);
    if (/^--ax-corner-[a-z]+-[a-z]+-shoulder-radius$/.test(prop)) return current('--ax-corner-shoulder-radius');
    return defaults[prop];
  }

  function set(prop: string, value: string) {
    props = { ...props, [prop]: value };
  }

  // Range controls work on numbers; the property keeps its unit. -1 is "auto" for corner radii.
  const numberOf = (c: Control, prop: string) => {
    const n = parseFloat(current(prop));
    return Number.isFinite(n) ? n : 0;
  };
  const rangeText = (c: Extract<Control, { kind: 'range' }>, n: number) => (c.auto && n < 0 ? '-1px' : `${n}${c.unit}`);

  // The surface on the stage.
  let subject: HTMLElement | undefined = $state();
  let applied: string[] = [];
  $effect(() => {
    if (!subject) return;
    for (const name of applied) if (!(name in props)) subject.style.removeProperty(name);
    for (const name in props) subject.style.setProperty(name, props[name]);
    applied = Object.keys(props);
    subject.style.width = `${size[0]}px`;
    subject.style.height = `${size[1]}px`;
  });

  // The properties of `props` a group of controls sets, for any corner or side.
  function setIn(g: Group, props: Record<string, string>): number {
    const patterns = g.controls.map((c) => new RegExp(`^${c.prop.replace('{corner}', '[a-z]+-[a-z]+').replace('{side}', '[a-z]+')}$`));
    return Object.keys(props).filter((name) => patterns.some((p) => p.test(name))).length;
  }

  // Every group is folded; loading a shape opens the groups it changes.
  let opened: Record<string, boolean> = $state(Object.fromEntries(['Layers', ...GROUPS.map((g) => g.title)].map((t) => [t, false])));

  // A preset replaces the shape and keeps the layers, colors, tilt and effects.
  function load(p: Preset) {
    const keep: Record<string, string> = {};
    for (const name in props) if (!/^--ax-(radius|corner|edge|top-|bottom-)/.test(name)) keep[name] = props[name];
    const [w, h] = p.size || [100, 100];
    const factor = 2.2;
    size = [Math.round(w * factor), Math.round(h * factor)];
    for (const name in p.props) keep[name] = scalePx(p.props[name], factor);
    props = keep;
    // Show the corner and the side the shape changes.
    corner = CORNERS.find((n) => Object.keys(p.props).some((k) => k.includes(`-${n}-`))) ?? CORNERS[0];
    side = SIDES.find((n) => Object.keys(p.props).some((k) => k.startsWith(`--ax-edge-${n}-`))) ?? SIDES[0];
    opened = { Layers: false, ...Object.fromEntries(GROUPS.map((g) => [g.title, setIn(g, p.props) > 0])) };
  }

  function thumb(p: Preset): string {
    const [w, h] = p.size || [100, 100];
    const factor = 0.5;
    const style = Object.entries(p.props).map(([k, v]) => `${k}: ${scalePx(v, factor)}`);
    return [`width: ${Math.round(w * factor)}px`, `height: ${Math.round(h * factor)}px`, ...style].join('; ');
  }

  const html = $derived(`<ax-surface class="my-surface" layers="${LAYERS.filter((l) => layers.includes(l)).join(' ')}">...</ax-surface>`);
  const css = $derived(cssOf('.my-surface', size, props));
</script>

<svelte:head>
  <title>Playground - Axiom Design System</title>
</svelte:head>

<AppShell title="Playground" accent={ACCENT}>
  <!-- The surface and its code stay in view; the shapes and the controls scroll beside them. -->
  <section class="panel" aria-label="Stage and code">
    <div class="stage">
      <ax-surface bind:this={subject} class="subject" layers={LAYERS.filter((l) => layers.includes(l)).join(' ')}>
        <span class="label">Hello, Surface</span>
      </ax-surface>
    </div>
    <div class="code">
      <Code code={html} language="html" />
      <Code code={css} language="css" />
    </div>
  </section>

  <div class="scroller" bind:this={scroller}>
  <section class="presets" aria-labelledby="presets-title">
    <h2 id="presets-title">Shapes</h2>
    <ax-tile-group>
      {#each PRESETS as p (p.name)}
        <ax-tile columns="2" rows="2" layers="fill reveal">
          <button type="button" class="preset" onclick={() => load(p)} title={p.name} aria-label="Load {p.name}">
            <ax-surface class="thumb" layers="fill" style={thumb(p)}></ax-surface>
          </button>
        </ax-tile>
      {/each}
    </ax-tile-group>
  </section>

  <Flow label="Properties" width={300} space={4}>
    <div>
      <Expander title="Layers" summary={layers.join(', ')} bind:open={opened.Layers}>
        {#each LAYERS as layer (layer)}
          <CheckBox
            label={layer}
            checked={layers.includes(layer)}
            onchange={(on: boolean) => (layers = on ? LAYERS.filter((l) => l === layer || layers.includes(l)) : layers.filter((l) => l !== layer))}
          />
        {/each}
      </Expander>
    </div>
    {#each GROUPS as g (g.title)}
      {#if !g.layer || layers.includes(g.layer)}
        {@const count = setIn(g, props)}
        <div>
          <Expander title={g.title} summary={count ? `${count} set` : ''} bind:open={opened[g.title]}>
            {#if g.pick?.key === 'corner'}
              <RadioGroup label="Corner" horizontal options={CORNERS.map((value, i) => ({ value, label: CORNER_LABELS[i] }))} bind:value={corner} />
            {:else if g.pick?.key === 'side'}
              <RadioGroup label="Side" horizontal options={SIDES.map((value, i) => ({ value, label: SIDE_LABELS[i] }))} bind:value={side} />
            {/if}
            {#each g.controls as c (c.prop)}
              {@const prop = resolve(g, c)}
              {#if c.kind === 'range'}
                <Slider label={c.label} min={c.min} max={c.max} step={c.step} unit={c.auto && numberOf(c, prop) < 0 ? '' : c.unit} value={numberOf(c, prop)} onchange={(n: number) => set(prop, rangeText(c, n))} />
              {:else if c.kind === 'select'}
                <ComboBox label={c.label} options={c.options} value={current(prop)} onchange={(v: string) => set(prop, v)} />
              {:else}
                <ColorPicker label={c.label} alpha={c.alpha ?? false} value={current(prop)} onchange={(v: string) => set(prop, v)} />
              {/if}
            {/each}
          </Expander>
        </div>
      {/if}
    {/each}
  </Flow>
  </div>
</AppShell>

<style>
  .panel {
    flex: none;
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 560px;
    height: var(--flow-height);
    margin-right: 40px;
    padding-bottom: 24px;
  }
  /* Takes the rest of the window and no more (width 0 in the page's own width), and scrolls. */
  .scroller {
    flex: 1 1 0;
    width: 0;
    min-width: 0;
    height: var(--flow-height);
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: thin;
  }
  .stage {
    flex: none;
    height: min(420px, 56%);
    display: flex;
    align-items: center;
    justify-content: center;
    /* No overflow: hidden: in Firefox, a clip around a tilting surface turns its acrylic clear. */
    background: url('/assets/img/header.jpg') center / cover;
  }
  .subject {
    color: #fff;
  }
  .label {
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }
  .code {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    scrollbar-width: thin;
  }
  h2 {
    margin-top: 0;
    font-size: 20px;
    font-weight: 400;
    line-height: 1.3;
  }
  /* Small tiles: 32px cells, one preset per two by two. */
  .presets {
    flex: none;
    height: 100%;
    display: flex;
    flex-direction: column;
    margin-right: 40px;
  }
  .presets h2 {
    margin-bottom: 16px;
  }
  .presets ax-tile-group {
    flex: 1;
    min-height: 0;
    --tile-cell-width: 32px;
    --tile-cell-height: 32px;
    --tile-gap: 6px;
    --tile-rows: auto;
  }
  .presets ax-tile {
    --ax-fill-color: #e6e0d4;
    --ax-border-width: 1px;
    --reveal-color: rgb(96, 60, 186);
    --reveal-opacity: 0.35;
  }
  .preset {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0;
    padding: 0;
    background: none;
    cursor: pointer;
  }
  .preset:focus-visible {
    outline: 2px solid var(--page-accent);
    outline-offset: -2px;
  }
  .thumb {
    --ax-fill-color: #603cba;
    --ax-border-width: 0px;
    pointer-events: none;
  }
</style>
