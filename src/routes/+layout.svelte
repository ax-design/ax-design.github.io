<script lang="ts">
  import { onMount } from 'svelte';
  import type { Snippet } from 'svelte';
  import { registerAll } from '#lib/site/register';

  let { children }: { children: Snippet } = $props();

  // Every page lifts the welcome curtain, also the ones without components.
  onMount(() => {
    registerAll();
  });
</script>

<svelte:head>
  <title>AXIOM DESIGN SYSTEM</title>
</svelte:head>

{@render children()}
