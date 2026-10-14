<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    variant = 'standard',
    onclick,
    type = 'button',
    disabled = false,
    children
  }: {
    variant?: 'standard' | 'accent';
    onclick?: () => void;
    type?: 'button' | 'submit';
    disabled?: boolean;
    children?: Snippet;
  } = $props();
</script>

<button class="button {variant}" {type} {disabled} {onclick}>
  {@render children?.()}
</button>

<style>
  .button {
    box-sizing: border-box;
    min-width: 120px;
    height: 32px;
    margin: 0;
    padding: 0 16px;
    border: 2px solid transparent;
    border-radius: 0;
    font-family: 'Segoe UI', system-ui, sans-serif;
    font-size: 14px;
    cursor: pointer;
  }

  .standard {
    background: rgba(0, 0, 0, 0.2);
    color: #000;
  }

  .standard:hover {
    border-color: rgba(0, 0, 0, 0.4);
  }

  .standard:active {
    background: rgba(0, 0, 0, 0.3);
  }

  .accent {
    background: var(--ui-accent, #0078d7);
    color: #fff;
  }

  .accent:hover {
    border-color: rgba(0, 0, 0, 0.4);
  }

  .accent:active {
    filter: brightness(0.85);
  }

  .button:focus {
    outline: none;
  }

  .button:focus-visible {
    outline: 2px solid var(--ui-accent, #0078d7);
    outline-offset: 2px;
  }

  .button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .button:disabled:hover {
    border-color: transparent;
  }
</style>
