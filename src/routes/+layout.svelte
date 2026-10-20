<script lang="ts">
  import { onMount } from 'svelte';
  import type { Snippet } from 'svelte';
  import { afterNavigate, preloadData } from '$app/navigation';
  import { registerAll } from '#lib/site/register';

  let { children }: { children: Snippet } = $props();

  // The splash of a tile launch stays until the page it leads to has arrived: the navigation it
  // starts is done once afterNavigate runs. This layout outlives every page, so the listener is
  // still here when the navigation ends. A launch without a url (a button action) is not held.
  let arrived: (() => void) | null = null;
  afterNavigate(() => {
    arrived?.();
    arrived = null;
  });

  // Every page lifts the welcome curtain, also the ones without components.
  onMount(() => {
    registerAll();
    const onStart = (event: Event) => {
      const { url, hold, preventPrefetch } = (event as CustomEvent<{
        url: string | null;
        hold: (promise: Promise<unknown>) => void;
        preventPrefetch: () => void;
      }>).detail;
      if (!url) return;
      preventPrefetch();
      hold(new Promise<void>((resolve) => (arrived = resolve)));
      preloadData(url);
    };
    document.addEventListener('tilelaunchstart', onStart);
    return () => document.removeEventListener('tilelaunchstart', onStart);
  });
</script>

<svelte:head>
  <title>AXIOM DESIGN SYSTEM</title>
</svelte:head>

{@render children()}
