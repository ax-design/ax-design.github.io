<script lang="ts">
  // The site's one back button: a round arrow on the page's chrome, taken from the header of
  // AppShell. Render it as a link with href, or as a button with onclick, so every surface
  // that goes back (a page, a slide-out panel) looks and behaves the same. It is pressed like a
  // tile of the start screen, with the parameters those tiles are pressed with.
  interface Props {
    // When set, the button is a link to this address.
    href?: string;
    // The accessible name: 'Back' for a page, 'Close' for a panel.
    label?: string;
    onclick?: (event: MouseEvent) => void;
  }

  let { href, label = 'Back', onclick }: Props = $props();
</script>

{#snippet arrow()}
  <svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="18" /><path d="M22 13l-7 7 7 7M15 20h12" /></svg>
{/snippet}

<!-- ax-pressure is a Surface that draws no layers of its own: it only leans what is inside it
     away from the point that is pressed, as a tile of the start screen leans. The link or the
     button fills it and keeps the press, the keyboard and the hover it always had. -->
<ax-pressure class="pressure">
  {#if href !== undefined}
    <a class="back" {href} aria-label={label} onclick={onclick}>{@render arrow()}</a>
  {:else}
    <button type="button" class="back" aria-label={label} {onclick}>{@render arrow()}</button>
  {/if}
</ax-pressure>

<style>
  /* A tile's parameters: the absolute mode the tile group turns on, and the depth, factor,
     perspective and zoom Surface presses a tile with. Absolute depth is a length, not an angle,
     so a button 40px across leans a little further than a tile five times its size does. */
  .pressure {
    display: block;
    flex: none;
    width: 40px;
    height: 40px;
    --pressure-tilt-mode: absolute;
    --pressure-tilt-depth: 1px;
    --pressure-tilt-factor: 2;
    --pressure-perspective: 25px;
    --pressure-zoom: 0.8px;
  }
  .back {
    display: block;
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
