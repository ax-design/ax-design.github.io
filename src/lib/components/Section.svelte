<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    id?: string;
    title?: string;
    class?: string;
    children?: Snippet;
  }

  let { id = '', title = '', class: className = '', children }: Props = $props();
</script>

<section class="h_section {className}" {id}>
  {#if title}
    <h1 class="main_title">{title}</h1>
  {/if}
  {#if children}
    {@render children()}
  {/if}
</section>

<style>
  .h_section {
    width: 95vw;
    height: 100%;
    overflow-y: auto;
    max-width: 1000px;
    min-width: 800px;
    flex-shrink: 0;
    box-sizing: border-box;
    padding: 2em;
  }

  .main_title {
    margin: 1.5em 0 1em 0;
    font-weight: 400;
    font-size: 2.5em;
    letter-spacing: 0.03em;
  }
</style>
