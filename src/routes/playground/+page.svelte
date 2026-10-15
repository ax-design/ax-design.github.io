<script lang="ts">
	import { onMount } from 'svelte';
	import AppShell from '#lib/site/AppShell.svelte';
	import Code from '#lib/site/Code.svelte';
	import Flow from '#lib/site/Flow.svelte';
	import { isWide } from '#lib/site/layout';
	import { CORNERS, CORNER_LABELS, GROUPS, INITIAL, LAYERS, PRESETS, SIDES, SIDE_LABELS, cssOf, scalePx } from '#lib/site/playground';
	import type { Control, Group, Preset } from '#lib/site/playground';
	import { CheckBox, ColorPicker, ComboBox, Expander, Flyout, RadioGroup, Slider } from '#lib/ui/index.ts';

	const ACCENT = '#603cba';

	// One cell and the gap between cells of the tile group. The demo spans all four columns and
	// three rows; every preset is a single cell that follows down the group.
	const CELL = 64;
	const GAP = 12;
	const COLUMNS = 4;
	const DEMO_ROWS = 3;
	// The margin a page keeps at both sides once it stacks (see AppShell), and how much larger than
	// the cell of a column a cell may grow there.
	const MARGIN = 40;
	const CELL_MAX = CELL * 1.5;
	// Every shape fills 75% of its container: the demo surface inside its four-by-three tile and
	// each preset thumb inside its one-cell tile.
	const FILL = 0.75;

	// The size of a cell: the 64px a column of the spread is built on, or what the width of a
	// stacked page allows.
	let cell = $state(CELL);
	let group: HTMLElement | undefined = $state();

	let layers: string[] = $state(['elevation', 'acrylic', 'reveal']);
	// The demo shape fills 75% of its tile, so its size follows the container rather than a number
	// in state.
	const DEMO_W = COLUMNS * (CELL + GAP) - GAP;
	const DEMO_H = DEMO_ROWS * (CELL + GAP) - GAP;
	let size: [number, number] = $state([Math.round(DEMO_W * FILL), Math.round(DEMO_H * FILL)]);
	let props: Record<string, string> = $state({ ...INITIAL });
	let corner = $state(CORNERS[0]);
	let side = $state(SIDES[0]);

	// The flyout that shows the HTML and the CSS, as on the Ideas page.
	let open = $state(false);

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

	// The demo tile.
	let subject: HTMLElement | undefined = $state();
	let applied: string[] = [];
	$effect(() => {
		if (!subject) return;
		for (const name of applied) if (!(name in props)) subject.style.removeProperty(name);
		for (const name in props) subject.style.setProperty(name, props[name]);
		applied = Object.keys(props);
	});

	// The demo follows its container, so the code and the px values of a shape track the size.
	$effect(() => {
		if (!subject) return;
		const el = subject;
		const measure = () => {
			const w = el.offsetWidth;
			const h = el.offsetHeight;
			if (w > 0 && h > 0 && (w !== size[0] || h !== size[1])) size = [w, h];
		};
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(el);
		return () => observer.disconnect();
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
		// The demo keeps the tile's width; px values scale from the shape's reference to it.
		const [w] = p.size || [100, 100];
		const factor = size[0] / w;
		for (const name in p.props) keep[name] = scalePx(p.props[name], factor);
		props = keep;
		// Show the corner and the side the shape changes.
		corner = CORNERS.find((n) => Object.keys(p.props).some((k) => k.includes(`-${n}-`))) ?? CORNERS[0];
		side = SIDES.find((n) => Object.keys(p.props).some((k) => k.startsWith(`--ax-edge-${n}-`))) ?? SIDES[0];
		opened = { Layers: false, ...Object.fromEntries(GROUPS.map((g) => [g.title, setIn(g, p.props) > 0])) };
	}

	function thumb(p: Preset): string {
		const [w, h] = p.size || [100, 100];
		// The thumb fills 75% of its one-cell tile; px values scale from the reference to it.
		const factor = (cell * FILL) / 100;
		const style = Object.entries(p.props).map(([k, v]) => `${k}: ${scalePx(v, factor)}`);
		return [`width: ${Math.round(w * factor)}px`, `height: ${Math.round(h * factor)}px`, ...style].join('; ');
	}

	// A stacked page gives the group the width between its margins and the four columns share it,
	// up to half as large again as the cell of a column; the spread keeps the 64px its geometry is
	// built on.
	onMount(() => {
		const apply = () => {
			const room = document.documentElement.clientWidth - 2 * MARGIN - (COLUMNS - 1) * GAP;
			cell = isWide() ? CELL : Math.min(CELL_MAX, room / COLUMNS);
			(group as (HTMLElement & { refresh?: () => void }) | undefined)?.refresh?.();
		};
		apply();
		window.addEventListener('resize', apply);
		return () => window.removeEventListener('resize', apply);
	});

	const html = $derived(`<ax-surface class="my-surface" layers="${LAYERS.filter((l) => layers.includes(l)).join(' ')}">...</ax-surface>`);
	const css = $derived(cssOf('.my-surface', size, props));
</script>

<svelte:head>
	<title>Playground - Axiom Design System</title>
</svelte:head>

<AppShell title="Playground" accent={ACCENT}>
	<!-- The demo and the presets live in one vertical tile group: four equal columns. -->
	<ax-tile-group
		class="shapes"
		orientation="vertical"
		aria-label="Shapes"
		bind:this={group}
		style:--tile-cell-width={cell + 'px'}
		style:--tile-cell-height={cell + 'px'}
		style:--tile-gap={GAP + 'px'}
		style:--tile-columns={COLUMNS}
	>
		<ax-tile columns={COLUMNS} rows={DEMO_ROWS} class="demo">
			<ax-surface bind:this={subject} class="demo-surface" layers={LAYERS.filter((l) => layers.includes(l)).join(' ')}>
				<button type="button" class="show-code" onclick={() => (open = true)}>Click to show code</button>
			</ax-surface>
		</ax-tile>

		{#each PRESETS as p (p.name)}
			<ax-tile columns="1" rows="1" layers="fill reveal" class="preset-tile">
				<button type="button" class="preset" onclick={() => load(p)} title={p.name} aria-label="Load {p.name}">
					<ax-surface class="thumb" layers="fill" style={thumb(p)}></ax-surface>
				</button>
			</ax-tile>
		{/each}
	</ax-tile-group>

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
</AppShell>

<Flyout bind:open title="Code" width={560}>
	<Code code={html} language="html" />
	<Code code={css} language="css" />
</Flyout>

<style>
	/* The tile group grows downward: four equal columns, the demo four by three at the top and
	   the presets one cell each below. */
	.shapes {
		flex: none;
		margin-right: 40px;
	}
	/* Narrower than a spread, the page keeps its 40px margin at both sides and the group stands in
	   the middle of what is left: the four columns share that width (see the script), so the demo
	   and the presets follow the page instead of standing at the 292px of a column. */
	@media (max-width: 919px) {
		.shapes {
			margin: 0 auto;
		}
	}
	.demo {
		/* The wallpaper fills the whole tile behind the shape. */
		background: url('/assets/img/header.jpg') center / cover;
	}
	.demo-surface {
		/* The shape occupies 75% of the tile, centred. */
		position: absolute;
		inset: 12.5%;
		color: #fff;
	}
	.show-code {
		display: flex;
		width: 100%;
		height: 100%;
		align-items: center;
		justify-content: center;
		border: 0;
		padding: 0;
		background: none;
		color: #fff;
		font: inherit;
		font-size: 16px;
		cursor: pointer;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
	}
	.show-code:focus-visible {
		outline: 2px solid var(--page-accent);
		outline-offset: -4px;
	}
	.preset-tile {
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
