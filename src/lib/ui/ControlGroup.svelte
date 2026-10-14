<script lang="ts">
  import type { Snippet } from 'svelte';

  let { title, children }: { title?: string; children?: Snippet } = $props();
</script>

<section class="group">
  {#if title}
    <h3 class="title">{title}</h3>
  {/if}
  <div class="stack">
    {@render children?.()}
  </div>
</section>

<style>
  .group {
    font-family: 'Segoe UI', system-ui, sans-serif;
    color: #000;
  }

  .title {
    margin: 0 0 12px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #333;
  }

  .stack {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
</style>
