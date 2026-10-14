<script lang="ts">
  import DocPage from '#lib/site/DocPage.svelte';

  let { data } = $props();
</script>

<DocPage page={data.page} accent={data.accent} />
