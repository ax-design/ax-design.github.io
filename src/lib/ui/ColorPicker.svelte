<script lang="ts">
  type RGBA = { r: number; g: number; b: number; a: number };

  let {
    value = $bindable('rgb(0, 0, 0)'),
    alpha = false,
    label,
    disabled = false,
    onchange
  }: {
    value?: string;
    alpha?: boolean;
    label: string;
    disabled?: boolean;
    onchange?: (value: string) => void;
  } = $props();

  const uid = $props.id();

  const BLACK: RGBA = { r: 0, g: 0, b: 0, a: 1 };

  // Parses #rgb, #rgba, #rrggbb, #rrggbbaa, rgb()/rgba() (comma or space syntax).
  // Anything else (named colors, hsl, ...) falls back to opaque black.
  function parseColor(input: string): RGBA {
    const s = input.trim().toLowerCase();

    const hexMatch = s.match(/^#([0-9a-f]+)$/);
    if (hexMatch) {
      let h = hexMatch[1];
      if (h.length === 3 || h.length === 4) {
        h = h
          .split('')
          .map((ch) => ch + ch)
          .join('');
      }
      if (h.length !== 6 && h.length !== 8) return BLACK;
      const r = parseInt(h.slice(0, 2), 16);
      const g = parseInt(h.slice(2, 4), 16);
      const b = parseInt(h.slice(4, 6), 16);
      const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
      return { r, g, b, a };
    }

    const fnMatch = s.match(/^rgba?\((.*)\)$/);
    if (fnMatch) {
      const parts = fnMatch[1].split(/[\s,/]+/).filter(Boolean);
      if (parts.length < 3) return BLACK;
      const channel = (p: string) =>
        p.endsWith('%') ? (parseFloat(p) * 255) / 100 : parseFloat(p);
      const r = Math.min(255, Math.max(0, channel(parts[0])));
      const g = Math.min(255, Math.max(0, channel(parts[1])));
      const b = Math.min(255, Math.max(0, channel(parts[2])));
      let a = 1;
      if (parts.length >= 4) {
        const raw = parts[3];
        a = raw.endsWith('%') ? parseFloat(raw) / 100 : parseFloat(raw);
      }
      a = Math.min(1, Math.max(0, a));
      if (![r, g, b, a].every(Number.isFinite)) return BLACK;
      return { r, g, b, a };
    }

    return BLACK;
  }

  function toHex(c: RGBA): string {
    return (
      '#' +
      [c.r, c.g, c.b]
        .map((n) => Math.round(n).toString(16).padStart(2, '0'))
        .join('')
    );
  }

  function format(c: RGBA): string {
    const r = Math.round(c.r);
    const g = Math.round(c.g);
    const b = Math.round(c.b);
    if (!alpha) return `rgb(${r}, ${g}, ${b})`;
    const a = Math.round(c.a * 100) / 100;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  let c = $derived(parseColor(value));
  let hex = $derived(toHex(c));

  let picker: HTMLInputElement | undefined = $state();

  function openPicker() {
    if (!picker || disabled) return;
    if (typeof picker.showPicker === 'function') {
      picker.showPicker();
    } else {
      picker.click();
    }
  }

  function onColor(e: Event) {
    const input = e.currentTarget as HTMLInputElement;
    const next = parseColor(input.value);
    value = format({ ...next, a: c.a });
    onchange?.(value);
  }

  function onAlpha(e: Event) {
    const a = Number((e.currentTarget as HTMLInputElement).value);
    value = format({ ...c, a });
    onchange?.(value);
  }
</script>

<div class="picker" class:disabled>
  <label for={uid}>{label}</label>
  <div class="row">
    <input
      bind:this={picker}
      id={uid}
      class="native"
      type="color"
      value={hex}
      {disabled}
      oninput={onColor}
    />
    <button
      class="swatch"
      type="button"
      tabindex="-1"
      aria-hidden="true"
      {disabled}
      onclick={openPicker}
    >
      <span class="color" style:background-color={value}></span>
    </button>
    <span class="hex">{hex.toUpperCase()}</span>
  </div>

  {#if alpha}
    <div class="opacity">
      <label for="{uid}-alpha">Opacity</label>
      <input
        id="{uid}-alpha"
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={c.a}
        {disabled}
        oninput={onAlpha}
      />
      <output for="{uid}-alpha">{Math.round(c.a * 100)}%</output>
    </div>
  {/if}
</div>

<style>
  .picker {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    max-width: 280px;
    font-family: 'Segoe UI', system-ui, sans-serif;
    font-size: 14px;
    color: #000;
  }

  .row {
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .native {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    border: 0;
    overflow: hidden;
    clip: rect(0 0 0 0);
    opacity: 0;
  }

  .swatch {
    flex: none;
    width: 32px;
    height: 32px;
    margin: 0;
    padding: 0;
    border: 2px solid rgba(0, 0, 0, 0.4);
    border-radius: 0;
    background-color: #fff;
    background-image:
      linear-gradient(45deg, #bbb 25%, transparent 25%, transparent 75%, #bbb 75%),
      linear-gradient(45deg, #bbb 25%, transparent 25%, transparent 75%, #bbb 75%);
    background-size: 8px 8px;
    background-position: 0 0, 4px 4px;
    cursor: pointer;
  }

  .color {
    display: block;
    width: 100%;
    height: 100%;
  }

  .native:focus-visible + .swatch,
  .swatch:hover {
    border-color: var(--ui-accent, #0078d7);
  }

  .hex {
    font-family: Consolas, 'Courier New', monospace;
    font-size: 13px;
    color: #333;
  }

  .opacity {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .opacity input {
    flex: 1;
    min-width: 0;
    accent-color: var(--ui-accent, #0078d7);
    margin: 0;
  }

  .opacity output {
    min-width: 40px;
    text-align: right;
    color: #333;
    font-variant-numeric: tabular-nums;
  }

  .disabled {
    opacity: 0.4;
  }

  .disabled .swatch {
    cursor: not-allowed;
  }
</style>
