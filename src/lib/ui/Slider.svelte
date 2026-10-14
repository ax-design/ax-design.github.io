<script lang="ts">
  let {
    value = $bindable(0),
    min = 0,
    max = 100,
    step = 1,
    unit,
    label,
    disabled = false,
    onchange
  }: {
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    label: string;
    disabled?: boolean;
    onchange?: (value: number) => void;
  } = $props();

  const uid = $props.id();

  let pct = $derived(
    max > min ? Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100)) : 0
  );
</script>

<div class="slider" class:disabled>
  <div class="header">
    <label for={uid}>{label}</label>
    <output for={uid}>{value}{unit ? ` ${unit}` : ''}</output>
  </div>
  <input
    id={uid}
    type="range"
    bind:value
    {min}
    {max}
    {step}
    {disabled}
    style="--pct: {pct}%"
    oninput={() => onchange?.(value)}
  />
</div>

<style>
  .slider {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
    max-width: 320px;
    font-family: 'Segoe UI', system-ui, sans-serif;
    font-size: 14px;
    color: #000;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }

  output {
    color: #333;
    font-variant-numeric: tabular-nums;
  }

  input[type='range'] {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 24px;
    margin: 0;
    padding: 0;
    background: transparent;
    cursor: pointer;
  }

  input[type='range']::-webkit-slider-runnable-track {
    height: 2px;
    border: none;
    background: linear-gradient(
      to right,
      var(--ui-accent, #0078d7) var(--pct),
      #8a8a8a var(--pct)
    );
  }

  input[type='range']::-moz-range-track {
    height: 2px;
    border: none;
    background: #8a8a8a;
  }

  input[type='range']::-moz-range-progress {
    height: 2px;
    background: var(--ui-accent, #0078d7);
  }

  input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 8px;
    height: 24px;
    margin-top: -11px;
    border: none;
    border-radius: 4px;
    background: var(--ui-accent, #0078d7);
  }

  input[type='range']::-moz-range-thumb {
    width: 8px;
    height: 24px;
    border: none;
    border-radius: 4px;
    background: var(--ui-accent, #0078d7);
  }

  input[type='range']:focus {
    outline: none;
  }

  input[type='range']:focus-visible {
    outline: 2px solid var(--ui-accent, #0078d7);
    outline-offset: 2px;
  }

  .disabled {
    opacity: 0.4;
  }

  .disabled input {
    cursor: not-allowed;
  }
</style>
