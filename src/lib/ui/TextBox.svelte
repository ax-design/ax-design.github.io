<script lang="ts">
  let {
    value = $bindable(''),
    placeholder,
    label,
    disabled = false,
    onchange
  }: {
    value?: string;
    placeholder?: string;
    label: string;
    disabled?: boolean;
    onchange?: (value: string) => void;
  } = $props();

  const uid = $props.id();
</script>

<div class="textbox" class:disabled>
  <label for={uid}>{label}</label>
  <input
    id={uid}
    type="text"
    bind:value
    {placeholder}
    {disabled}
    oninput={() => onchange?.(value)}
  />
</div>

<style>
  .textbox {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
    max-width: 280px;
    font-family: 'Segoe UI', system-ui, sans-serif;
    font-size: 14px;
    color: #000;
  }

  input {
    box-sizing: border-box;
    width: 100%;
    height: 32px;
    margin: 0;
    padding: 0 10px;
    border: 2px solid rgba(0, 0, 0, 0.4);
    border-radius: 0;
    background: #fff;
    color: #000;
    font: inherit;
  }

  input::placeholder {
    color: #767676;
  }

  input:focus {
    outline: none;
    border-color: var(--ui-accent, #0078d7);
  }

  input:focus-visible {
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
