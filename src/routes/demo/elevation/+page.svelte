<script lang="ts">
  import { onMount } from 'svelte';
  import { registerElevation } from '#lib/utils/register';
  import DemoHeader from '#lib/components/DemoHeader.svelte';
  import InstallGuide from '#lib/components/InstallGuide.svelte';
  import DemoBlock from '#lib/components/DemoBlock.svelte';

  const snippets = {
    dp4: `<ax-elevation class="dp4">\n  <p>Elevation!</p>\n</ax-elevation>\n\n<style>\n  .dp4 {\n    --elevation-depth: 4;\n  }\n</style>`,
    dp128: `<ax-elevation class="dp128">\n  <p>Elevation!</p>\n</ax-elevation>\n\n<style>\n  .dp128 {\n    --elevation-depth: 128;\n  }\n</style>`
  };

  onMount(async () => {
    await registerElevation();
  });
</script>

<svelte:head>
  <title>AxElevation Demo - Axiom Design System</title>
</svelte:head>

<div class="demo-page-container">
  <DemoHeader
    title="AxElevation Demo"
    componentName="Elevation"
    description="This demo showcases the Elevation shadow effect of the Fluent Design System."
  />

  <InstallGuide
    packageName="@ax-design/elevation"
    globalVar="AxElevation"
  />

  <!-- 1. Using the element (dp4) -->
  <DemoBlock
    title="Using the element"
    description="In order to use this component, specify depth via --elevation-depth:"
    codeSnippet={snippets.dp4}
  >
    {#snippet demo()}
      <div class="ax-elevation-container">
        <ax-elevation class="dp4">
          <p>Elevation!</p>
        </ax-elevation>
      </div>
    {/snippet}
  </DemoBlock>

  <!-- 2. Change the depth (dp128) -->
  <DemoBlock
    title="Change the depth"
    description="Higher elevation depth values produce larger blurred shadows:"
    codeSnippet={snippets.dp128}
  >
    {#snippet demo()}
      <div class="ax-elevation-container">
        <ax-elevation class="dp128">
          <p>Elevation!</p>
        </ax-elevation>
      </div>
    {/snippet}
  </DemoBlock>
</div>

<style>
  .demo-page-container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 30px 20px;
    box-sizing: border-box;
  }

  .ax-elevation-container {
    width: 100%;
    height: 200px;
    position: relative;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
  }

  ax-elevation {
    --a: 100px;
    top: 50%;
    left: 50%;
    width: var(--a);
    height: var(--a);
    margin-top: calc(-0.5 * var(--a));
    margin-left: calc(-0.5 * var(--a));
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    background: white;
    border-radius: 4px;
    user-select: none;
  }

  ax-elevation p {
    margin: 0;
    font-weight: 500;
  }

  .dp4 {
    --elevation-depth: 4;
  }

  .dp128 {
    --elevation-depth: 128;
  }
</style>
