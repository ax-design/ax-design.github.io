<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    title,
    open = $bindable(false),
    summary,
    children
  }: {
    title: string;
    open?: boolean;
    summary?: string;
    children: Snippet;
  } = $props();

  const uid = $props.id();
  const headerId = `${uid}-header`;
  const regionId = `${uid}-region`;

  function toggle() {
    open = !open;
  }
</script>

<div class="expander">
  <button
    type="button"
    class="header"
    id={headerId}
    aria-expanded={open}
    aria-controls={regionId}
    onclick={toggle}
  >
    <span class="title">{title}</span>
    {#if summary}
      <span class="summary">{summary}</span>
    {/if}
    <svg
      class="chevron"
      class:open
      viewBox="0 0 12 12"
      width="12"
      height="12"
      aria-hidden="true"
    >
      <path
        d="M 2 4 L 6 8 L 10 4"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="square"
      />
    </svg>
  </button>
  <div
    class="content"
    id={regionId}
    role="region"
    aria-labelledby={headerId}
    hidden={!open}
  >
    <div class="stack">
      {@render children()}
    </div>
  </div>
</div>

<style>
  .expander {
    box-sizing: border-box;
    width: 100%;
    font-family: 'Segoe UI', system-ui, sans-serif;
    color: #000;
  }

  .header {
    display: flex;
    box-sizing: border-box;
    align-items: center;
    gap: 8px;
    width: 100%;
    height: 40px;
    margin: 0;
    padding: 0;
    border: 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    background: transparent;
    color: #333;
    font: inherit;
    text-align: left;
    cursor: pointer;
  }

  .header:hover {
    background: rgba(0, 0, 0, 0.04);
  }

  .header:focus {
    outline: none;
  }

  .header:focus-visible {
    outline: 2px solid var(--ui-accent, #2b5797);
    outline-offset: -2px;
  }

  .title {
    flex: 1;
    min-width: 0;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #333;
  }

  .summary {
    flex-shrink: 0;
    font-size: 12px;
    color: #767676;
  }

  .chevron {
    flex-shrink: 0;
    margin-right: 4px;
    transition: transform 167ms ease;
  }

  .chevron.open {
    transform: rotate(180deg);
  }

  .content {
    padding: 4px 0 12px;
  }

  .content[hidden] {
    display: none;
  }

  .content:not([hidden]) {
    animation: expander-open 167ms cubic-bezier(0.1, 0.9, 0.2, 1);
  }

  .stack {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  @keyframes expander-open {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .chevron {
      transition: none;
    }

    .content:not([hidden]) {
      animation: none;
    }
  }
</style>
