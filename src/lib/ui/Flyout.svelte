<script lang="ts">
  import type { Snippet } from 'svelte';
  import BackButton from '#lib/site/BackButton.svelte';
  import { noFlyout } from '#lib/site/query';

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

  // ?noflyout (see #lib/site/query): the switch that keeps every flyout of the site closed. The
  // page keeps `open` as it set it; only the dialog is held back, so a press of a tile still
  // presses and the page still knows it asked. A flyout already open when the parameter comes is
  // closed, and one the parameter held back opens again once it is gone.
  const suppressed = $derived(noFlyout());

  // Keep the native dialog in sync with `open`, as far as the URL lets it.
  $effect(() => {
    if (!dialog) return;
    const shown = open && !suppressed;
    if (shown && !dialog.open) {
      dialog.showModal();
    } else if (!shown && dialog.open) {
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
      <BackButton label="Close" onclick={() => dialog?.close()} />
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
