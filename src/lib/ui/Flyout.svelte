<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    open = $bindable(false),
    title,
    width = 460,
    onclose,
    children
  }: {
    open?: boolean;
    title: string;
    width?: number;
    onclose?: () => void;
    children: Snippet;
  } = $props();

  const uid = $props.id();

  let dialog = $state<HTMLDialogElement>();

  // Keep the native dialog in sync with `open`.
  $effect(() => {
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  });

  // Fires for Esc (native cancel), the back button and backdrop clicks.
  // A programmatic close (open set to false) has already cleared `open`,
  // so onclose only runs for user-initiated dismissal.
  function handleClose() {
    if (!open) return;
    open = false;
    onclose?.();
  }

  // Light dismiss: a click whose target is the dialog itself is outside the panel.
  function handleBackdropClick(event: MouseEvent) {
    if (event.target === dialog) dialog?.close();
  }
</script>

<dialog
  bind:this={dialog}
  class="flyout"
  aria-labelledby="{uid}-title"
  onclose={handleClose}
  onclick={handleBackdropClick}
  style:--width="{width}px"
>
  <div class="panel">
    <header class="header">
      <button type="button" class="back" aria-label="Close" onclick={() => dialog?.close()}>
        <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
          <circle cx="20" cy="20" r="19" fill="none" stroke="currentColor" stroke-width="1.5" />
          <path
            d="M 23 20 H 13 M 18 15 L 13 20 L 18 25"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="square"
          />
        </svg>
      </button>
      <h2 class="title" id="{uid}-title">{title}</h2>
    </header>
    <div class="body">
      {@render children()}
    </div>
  </div>
</dialog>

<style>
  .flyout {
    position: fixed;
    inset: 0;
    box-sizing: border-box;
    width: 100vw;
    height: 100vh;
    max-width: none;
    max-height: none;
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    color: #1b1b1b;
    font-family: 'Segoe UI', system-ui, sans-serif;
  }

  .flyout::backdrop {
    background: rgba(0, 0, 0, 0);
  }

  .flyout[open]::backdrop {
    animation: flyout-fade 367ms cubic-bezier(0.1, 0.9, 0.2, 1) forwards;
  }

  .panel {
    position: fixed;
    top: 0;
    right: 0;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    width: min(var(--width), 100vw);
    height: 100vh;
    background: #f6f3ec;
    color: #1b1b1b;
  }

  .flyout[open] .panel {
    animation: flyout-slide 367ms cubic-bezier(0.1, 0.9, 0.2, 1);
  }

  .header {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    gap: 12px;
    padding: 24px 40px 0 24px;
  }

  .back {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 40px;
    height: 40px;
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: #1b1b1b;
    cursor: pointer;
  }

  .back:hover {
    background: rgba(0, 0, 0, 0.08);
  }

  .back:focus {
    outline: none;
  }

  .back:focus-visible {
    outline: 2px solid var(--ui-accent, #2b5797);
    outline-offset: 2px;
  }

  .title {
    margin: 0;
    overflow: hidden;
    font-size: 28px;
    font-weight: 300;
    line-height: 1.2;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #1b1b1b;
  }

  .body {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    padding: 24px 40px;
  }

  @keyframes flyout-slide {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }

  @keyframes flyout-fade {
    from {
      background: rgba(0, 0, 0, 0);
    }
    to {
      background: rgba(0, 0, 0, 0.4);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .flyout[open] .panel {
      animation: none;
    }
  }
</style>
