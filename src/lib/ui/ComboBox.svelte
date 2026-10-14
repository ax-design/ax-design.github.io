<script lang="ts">
  type Option = { value: string; label: string };

  let {
    value = $bindable(''),
    options,
    label,
    disabled = false,
    onchange
  }: {
    value?: string;
    options: string[] | Option[];
    label: string;
    disabled?: boolean;
    onchange?: (value: string) => void;
  } = $props();

  const uid = $props.id();

  let items = $derived<Option[]>(
    options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o))
  );
</script>

<div class="combo" class:disabled>
  <label for={uid}>{label}</label>
  <div class="field">
    <select id={uid} bind:value {disabled} onchange={() => onchange?.(value)}>
      {#each items as item (item.value)}
        <option value={item.value}>{item.label}</option>
      {/each}
    </select>
    <svg class="chevron" viewBox="0 0 10 6" width="10" height="6" aria-hidden="true">
      <path d="M0 0 L5 6 L10 0 Z" fill="currentColor" />
    </svg>
  </div>
</div>

<style>
  .combo {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
    max-width: 280px;
    font-family: 'Segoe UI', system-ui, sans-serif;
    font-size: 14px;
    color: #000;
  }

  .field {
    position: relative;
  }

  select {
    -webkit-appearance: none;
    appearance: none;
    display: block;
    box-sizing: border-box;
    width: 100%;
    height: 32px;
    margin: 0;
    padding: 0 30px 0 10px;
    border: 2px solid rgba(0, 0, 0, 0.4);
    border-radius: 0;
    background: #fff;
    color: #000;
    font: inherit;
    cursor: pointer;
  }

  select:focus {
    outline: none;
    border-color: var(--ui-accent, #0078d7);
  }

  select:focus-visible {
    outline: 2px solid var(--ui-accent, #0078d7);
    outline-offset: 2px;
  }

  .chevron {
    position: absolute;
    top: 50%;
    right: 12px;
    transform: translateY(-50%);
    color: #000;
    pointer-events: none;
  }

  .disabled {
    opacity: 0.4;
  }

  .disabled select {
    cursor: not-allowed;
  }
</style>
