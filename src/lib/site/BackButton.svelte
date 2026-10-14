<script lang="ts">
  // The site's one back button: a round arrow on the page's chrome, taken from the header of
  // AppShell. Render it as a link with href, or as a button with onclick, so every surface
  // that goes back (a page, a slide-out panel) looks and behaves the same.
  interface Props {
    // When set, the button is a link to this address.
    href?: string;
    // The accessible name: 'Back' for a page, 'Close' for a panel.
    label?: string;
    onclick?: (event: MouseEvent) => void;
  }

  let { href, label = 'Back', onclick }: Props = $props();
</script>

{#if href !== undefined}
  <a class="back" {href} aria-label={label} onclick={onclick}>
    <svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="18" /><path d="M22 13l-7 7 7 7M15 20h12" /></svg>
  </a>
{:else}
  <button type="button" class="back" aria-label={label} {onclick}>
    <svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="18" /><path d="M22 13l-7 7 7 7M15 20h12" /></svg>
  </button>
{/if}

<style>
  .back {
    display: block;
    flex: none;
    box-sizing: border-box;
    width: 40px;
    height: 40px;
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: inherit;
    font: inherit;
    cursor: pointer;
  }
  .back svg {
    display: block;
    width: 40px;
    height: 40px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
  }
  .back:hover svg circle {
    fill: rgba(0, 0, 0, 0.08);
  }
  .back:focus-visible {
    outline: 2px solid var(--ui-accent, var(--page-accent, #2b5797));
    outline-offset: 2px;
  }
</style>
