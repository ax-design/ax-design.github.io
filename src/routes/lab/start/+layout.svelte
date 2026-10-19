<script lang="ts">
  import { onMount } from 'svelte';
  import type { Snippet } from 'svelte';
  import { afterNavigate, preloadData } from '$app/navigation';

  let { children }: { children: Snippet } = $props();

  // The splash of a launch stays until the page it leads to has arrived: the navigation it
  // starts is done once afterNavigate runs. This layout outlives the start page and the app page,
  // so the listener is still here when the navigation ends.
  let arrived: (() => void) | null = null;
  afterNavigate(() => {
    arrived?.();
    arrived = null;
  });

  onMount(() => {
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

{@render children()}
