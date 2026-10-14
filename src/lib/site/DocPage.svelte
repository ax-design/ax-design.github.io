<script lang="ts">
  // A component page: the getting started column, one column per example, and the reference.
  import type { DocPage } from '#lib/docs/types';
  import AppShell from './AppShell.svelte';
  import Code from './Code.svelte';
  import ExampleColumn from './ExampleColumn.svelte';
  import Flow from './Flow.svelte';

  interface Props {
    page: DocPage;
    // The color of the component's tile on the start screen.
    accent: string;
  }

  let { page, accent }: Props = $props();

  const install = $derived(`npm install ${page.package}`);
  const script = $derived(`<script src="https://unpkg.com/${page.package}/build/main.js"></` + `script>\n<script>${page.globalName}.register();</` + `script>`);
</script>

<svelte:head>
  <title>{page.name} - Axiom Design System</title>
  <meta name="description" content={page.tagline} />
</svelte:head>

<AppShell title={page.name} {accent} legacy={page.legacy}>
  <Flow label="Getting started">
    <p class="tagline">{page.tagline}</p>
    {#each page.intro as paragraph, i (i)}
      <p>{paragraph}</p>
    {/each}
    <div>
      <h2>Installation</h2>
      <Code code={install} language="shell" />
    </div>
    <div>
      <p>and import it:</p>
      <Code code={page.setup} language="js" />
    </div>
    {#if page.globalName}
      <div>
        <p>If you don't use a bundler, load the script instead:</p>
        <Code code={script} language="html" />
      </div>
    {/if}
  </Flow>

  {#each page.examples as example (example.id)}
    <ExampleColumn {example} />
  {/each}

  {#if page.reference.length}
    <Flow label="Reference" width={320}>
      <h2 class="reference-title">Reference</h2>
      {#each page.reference as entry (entry.name)}
        <div class="entry">
          <h3><code>{entry.name}</code> <span class="kind">{entry.kind}</span></h3>
          <p class="type"><code>{entry.type}</code>{#if entry.default !== undefined}, default <code>{entry.default}</code>{/if}</p>
          <p>{entry.description}</p>
        </div>
      {/each}
    </Flow>
  {/if}
</AppShell>

<style>
  .tagline {
    margin-top: 0;
    font-size: 22px;
    font-weight: 300;
    line-height: 1.35;
    color: #1b1b1b;
  }
  p {
    margin-top: 0;
    font-size: 15px;
    line-height: 1.55;
    color: #2b2925;
  }
  div > p {
    margin: 0 0 8px;
  }
  div > h2 {
    margin: 12px 0;
  }
  h2 {
    margin-top: 0;
    font-size: 20px;
    font-weight: 400;
    line-height: 1.3;
  }
  .reference-title {
    margin-top: 0;
  }
  div > :global(.code) {
    margin: 0;
  }
  .entry h3 {
    margin: 0 0 4px;
    font-size: 15px;
    font-weight: 600;
    line-height: 1.4;
  }
  .kind {
    font-weight: 400;
    font-size: 12px;
    color: #6b645a;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .entry p {
    margin: 0 0 4px;
    font-size: 14px;
    line-height: 1.5;
  }
  .entry .type {
    color: #6b645a;
  }
  code {
    font-family: ui-monospace, 'Cascadia Code', Consolas, Menlo, monospace;
    font-size: 0.92em;
  }
</style>
