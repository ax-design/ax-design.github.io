<script lang="ts">
  let {
    checked = $bindable(false),
    label,
    disabled = false,
    onchange
  }: {
    checked?: boolean;
    label: string;
    disabled?: boolean;
    onchange?: (checked: boolean) => void;
  } = $props();
</script>

<label class="check" class:disabled>
  <input
    class="native"
    type="checkbox"
    bind:checked
    {disabled}
    onchange={() => onchange?.(checked)}
  />
  <span class="box" aria-hidden="true">
    {#if checked}
      <svg viewBox="0 0 12 12" width="12" height="12">
        <path d="M2 6.5 L4.8 9 L10 3" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="square" />
      </svg>
    {/if}
  </span>
  <span class="text">{label}</span>
</label>

<style>
  .check {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-family: 'Segoe UI', system-ui, sans-serif;
    font-size: 14px;
    color: #000;
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

  .box {
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 20px;
    height: 20px;
    border: 2px solid #333;
    background: #fff;
    transition:
      background-color 0.1s,
      border-color 0.1s;
  }

  .box svg {
    display: block;
  }

  .native:checked + .box {
    background: var(--ui-accent, #0078d7);
    border-color: var(--ui-accent, #0078d7);
  }

  .native:focus-visible + .box {
    outline: 2px solid var(--ui-accent, #0078d7);
    outline-offset: 2px;
  }

  .disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
</style>
