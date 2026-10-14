<script lang="ts">
  let {
    value = $bindable(0),
    min,
    max,
    step,
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
</script>

<div class="numberbox" class:disabled>
  <label for={uid}>{label}</label>
  <div class="field">
    <input
      id={uid}
      type="number"
      bind:value
      {min}
      {max}
      {step}
      {disabled}
      oninput={() => onchange?.(value)}
    />
    {#if unit}
      <span class="unit">{unit}</span>
    {/if}
  </div>
</div>

<style>
  .numberbox {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
    max-width: 200px;
    font-family: 'Segoe UI', system-ui, sans-serif;
    font-size: 14px;
    color: #000;
  }

  .field {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  input {
    box-sizing: border-box;
    flex: 1;
    min-width: 0;
    width: 100%;
    height: 32px;
    margin: 0;
    padding: 0 10px;
    border: 2px solid rgba(0, 0, 0, 0.4);
    border-radius: 0;
    background: #fff;
    color: #000;
    font: inherit;
    font-variant-numeric: tabular-nums;
  }

  input:focus {
    outline: none;
    border-color: var(--ui-accent, #0078d7);
  }

  input:focus-visible {
    outline: 2px solid var(--ui-accent, #0078d7);
    outline-offset: 2px;
  }

  .unit {
    flex: none;
    color: #333;
  }

  .disabled {
    opacity: 0.4;
  }

  .disabled input {
    cursor: not-allowed;
  }
</style>
