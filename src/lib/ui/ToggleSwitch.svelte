<script lang="ts">
  let {
    checked = $bindable(false),
    onText = 'On',
    offText = 'Off',
    label,
    disabled = false,
    onchange
  }: {
    checked?: boolean;
    onText?: string;
    offText?: string;
    label: string;
    disabled?: boolean;
    onchange?: (checked: boolean) => void;
  } = $props();
</script>

<label class="toggle" class:disabled>
  <span class="name">{label}</span>
  <input
    class="native"
    type="checkbox"
    role="switch"
    bind:checked
    {disabled}
    onchange={() => onchange?.(checked)}
  />
  <span class="track" aria-hidden="true"><span class="knob"></span></span>
  <span class="state">{checked ? onText : offText}</span>
</label>

<style>
  .toggle {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 12px;
    font-family: 'Segoe UI', system-ui, sans-serif;
    font-size: 14px;
    color: #000;
    cursor: pointer;
  }

  .name {
    min-width: 0;
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

  .track {
    position: relative;
    display: inline-block;
    flex: none;
    box-sizing: border-box;
    width: 40px;
    height: 20px;
    border: 2px solid #333;
    background: transparent;
    transition:
      background-color 0.1s,
      border-color 0.1s;
  }

  .knob {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #333;
    transition:
      left 0.15s,
      background-color 0.15s;
  }

  .native:checked + .track {
    background: var(--ui-accent, #0078d7);
    border-color: var(--ui-accent, #0078d7);
  }

  .native:checked + .track .knob {
    left: 23px;
    background: #fff;
  }

  .native:focus-visible + .track {
    outline: 2px solid var(--ui-accent, #0078d7);
    outline-offset: 2px;
  }

  .state {
    min-width: 24px;
  }

  .disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
</style>
