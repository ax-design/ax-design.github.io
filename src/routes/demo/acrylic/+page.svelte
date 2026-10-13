<script lang="ts">
  import { onMount } from 'svelte';
  import { registerAcrylic } from '#lib/utils/register';
  import DemoHeader from '#lib/components/DemoHeader.svelte';
  import InstallGuide from '#lib/components/InstallGuide.svelte';
  import DemoBlock from '#lib/components/DemoBlock.svelte';

  let isWide = $state(false);

  const snippets = {
    general: `<ax-acrylic>\n  Acrylic!\n</ax-acrylic>`,
    tintColor: `.my-tile-container {\n  --acrylic-tint-color: white;\n}`,
    tintOpacity: `.my-tile-container {\n  --acrylic-tint-opacity: 0.45;\n}`,
    noiseOpacity: `.my-tile-container {\n  --acrylic-noise-opacity: 0.3;\n}`,
    blur: `.my-tile-container {\n  --acrylic-blur: 5px;\n}`
  };

  onMount(async () => {
    await registerAcrylic();
  });
</script>

<svelte:head>
  <title>AxAcrylic Demo - Axiom Design System</title>
</svelte:head>

<div class="demo-page-container">
  <DemoHeader
    title="AxAcrylic Demo"
    componentName="Acrylic"
    description="This demo showcases the Acrylic texture effect of the Fluent Design System."
  />

  <div class="control-panel">
    <label class="control-label">
      <input type="checkbox" bind:checked={isWide} />
      <span>Switch Acrylic width (toggle wide mode)</span>
    </label>
  </div>

  <InstallGuide
    packageName="@ax-design/acrylic"
    globalVar="AxAcrylic"
  />

  <!-- 1. General Button -->
  <DemoBlock
    title="General Button"
    description="In order to use this component, we need to prepare some HTML:"
    codeSnippet={snippets.general}
  >
    {#snippet demo()}
      <div class="ax-acrylic-container">
        <ax-acrylic class:wide={isWide}>
          <p>Acrylic!</p>
        </ax-acrylic>
      </div>
    {/snippet}
  </DemoBlock>

  <!-- 2. Tint Color -->
  <DemoBlock
    title="Tint Color"
    description="Adjust tint color by setting CSS variable --acrylic-tint-color:"
    codeSnippet={snippets.tintColor}
    codeLanguage="css"
  >
    {#snippet demo()}
      <div class="ax-acrylic-container">
        <ax-acrylic class="tint-color" class:wide={isWide}>
          <p>Acrylic!</p>
        </ax-acrylic>
      </div>
    {/snippet}
  </DemoBlock>

  <!-- 3. Tint Opacity -->
  <DemoBlock
    title="Tint Opacity"
    description="Adjust tint opacity with --acrylic-tint-opacity:"
    codeSnippet={snippets.tintOpacity}
    codeLanguage="css"
  >
    {#snippet demo()}
      <div class="ax-acrylic-container">
        <ax-acrylic class="tint-opacity" class:wide={isWide}>
          <p>Acrylic!</p>
        </ax-acrylic>
      </div>
    {/snippet}
  </DemoBlock>

  <!-- 4. Noise Opacity -->
  <DemoBlock
    title="Noise Opacity"
    description="Adjust noise opacity with --acrylic-noise-opacity:"
    codeSnippet={snippets.noiseOpacity}
    codeLanguage="css"
  >
    {#snippet demo()}
      <div class="ax-acrylic-container">
        <ax-acrylic class="noise-opacity" class:wide={isWide}>
          <p>Acrylic!</p>
        </ax-acrylic>
      </div>
    {/snippet}
  </DemoBlock>

  <!-- 5. Blur Radius -->
  <DemoBlock
    title="Blur Radius"
    description="Adjust blur amount with --acrylic-blur:"
    codeSnippet={snippets.blur}
    codeLanguage="css"
  >
    {#snippet demo()}
      <div class="ax-acrylic-container">
        <ax-acrylic class="blur" class:wide={isWide}>
          <p>Acrylic!</p>
        </ax-acrylic>
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

  .control-panel {
    margin: 16px 0;
    padding: 12px 16px;
    background: #eef2f6;
    border-radius: 6px;
  }

  .control-label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-weight: 500;
  }

  .ax-acrylic-container {
    width: 100%;
    height: 200px;
    position: relative;
    background: url('/demo/images/acrylic-background.jpg');
    background-size: cover;
    background-position: center;
    border-radius: 6px;
    overflow: hidden;
  }

  ax-acrylic {
    top: 50%;
    left: 50%;
    margin: -60px 0 0 -60px;
    width: 120px;
    height: 120px;
    color: white;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    transition: width 0.3s ease, margin-left 0.3s ease;
  }

  ax-acrylic.wide {
    margin-left: -90px;
    width: 180px;
  }

  .tint-color {
    --acrylic-tint-color: white;
  }

  .tint-color p {
    color: black;
  }

  .tint-opacity {
    --acrylic-tint-opacity: 0.45;
  }

  .noise-opacity {
    --acrylic-noise-opacity: 0.3;
  }

  .blur {
    --acrylic-blur: 5px;
  }
</style>
