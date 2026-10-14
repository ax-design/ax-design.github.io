<script lang="ts">
  type Option = { value: string; label: string };

  let {
    value = $bindable(''),
    options,
    name,
    label,
    horizontal = false,
    disabled = false,
    onchange
  }: {
    value?: string;
    options: string[] | Option[];
    name?: string;
    label: string;
    horizontal?: boolean;
    disabled?: boolean;
    onchange?: (value: string) => void;
  } = $props();

  const uid = $props.id();
  const groupName = $derived(name ?? uid);

  let items = $derived<Option[]>(
    options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o))
  );
</script>

<fieldset class="radios" class:disabled>
  <legend>{label}</legend>
  <div class="list" class:horizontal>
    {#each items as item (item.value)}
      <label class="option">
        <input
          class="native"
          type="radio"
          name={groupName}
          value={item.value}
          bind:group={value}
          {disabled}
          onchange={() => onchange?.(value)}
        />
        <span class="circle" aria-hidden="true"><span class="dot"></span></span>
        <span class="text">{item.label}</span>
      </label>
    {/each}
  </div>
</fieldset>

<style>
  .radios {
    margin: 0;
    padding: 0;
    border: none;
    min-width: 0;
    font-family: 'Segoe UI', system-ui, sans-serif;
    font-size: 14px;
    color: #000;
  }

  legend {
    padding: 0;
    margin-bottom: 8px;
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .list.horizontal {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 16px;
  }

  .option {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
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

  .circle {
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 20px;
    height: 20px;
    border: 2px solid #333;
    border-radius: 50%;
    background: #fff;
    transition: border-color 0.1s;
  }

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--ui-accent, #0078d7);
    opacity: 0;
    transition: opacity 0.1s;
  }

  .native:checked + .circle {
    border-color: var(--ui-accent, #0078d7);
  }

  .native:checked + .circle .dot {
    opacity: 1;
  }

  .native:focus-visible + .circle {
    outline: 2px solid var(--ui-accent, #0078d7);
    outline-offset: 2px;
  }

  .radios.disabled {
    opacity: 0.4;
  }

  .radios.disabled .option {
    cursor: not-allowed;
  }
</style>
