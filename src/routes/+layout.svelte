<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<svelte:head>
  <title>AXIOM DESIGN SYSTEM</title>
</svelte:head>

{@render children()}
