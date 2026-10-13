<script lang="ts">
  import { onMount } from 'svelte';
  import { registerPressure } from '#lib/utils/register';
  import DemoHeader from '#lib/components/DemoHeader.svelte';
  import InstallGuide from '#lib/components/InstallGuide.svelte';
  import DemoBlock from '#lib/components/DemoBlock.svelte';

  const snippets = {
    general: `<ax-pressure>\n  <button class="ax-pressure-button">Hello</button>\n</ax-pressure>\n<ax-pressure>\n  <button class="ax-pressure-button">World</button>\n</ax-pressure>`,
    zoom: `.my-tile-container {\n  --pressure-zoom: 5px;\n}`,
    tilt: `.my-tile-container {\n  --pressure-tilt-depth: 50px;\n}`,
    perspective: `.my-tile-container {\n  --pressure-perspective: 5px;\n}`
  };

  onMount(async () => {
    await registerPressure();
  });
</script>

<svelte:head>
  <title>AxPressure Demo - Axiom Design System</title>
</svelte:head>

<div class="demo-page-container">
  <DemoHeader
    title="AxPressure Demo"
    componentName="Pressure"
    description="This demo showcases the tilt and pressure depth effect of the Fluent Design System."
  />

  <InstallGuide
    packageName="@ax-design/pressure"
    globalVar="AxPressure"
  />

  <!-- 1. General Button -->
  <DemoBlock
    title="General Button"
    description="In order to use this component, wrap elements with ax-pressure:"
    codeSnippet={snippets.general}
  >
    {#snippet demo()}
      <div class="ax-pressure-container">
        <ax-pressure>
          <button class="ax-pressure-button">Welcome</button>
        </ax-pressure>
        <ax-pressure>
          <button class="ax-pressure-button">To</button>
        </ax-pressure>
      </div>
      <div class="ax-pressure-container" style="margin-top: 10px;">
        <ax-pressure>
          <button class="ax-pressure-button">Project</button>
        </ax-pressure>
        <ax-pressure>
          <button class="ax-pressure-button">Axiom!</button>
        </ax-pressure>
      </div>
    {/snippet}
  </DemoBlock>

  <!-- 2. Zoom Factor -->
  <DemoBlock
    title="Zoom Factor"
    description="Scale effect on pressure press:"
    codeSnippet={snippets.zoom}
    codeLanguage="css"
  >
    {#snippet demo()}
      <ax-pressure-bound class="zoom-factor">
        <div class="ax-pressure-container">
          <ax-pressure>
            <button class="ax-pressure-button">Welcome</button>
          </ax-pressure>
          <ax-pressure>
            <button class="ax-pressure-button">To</button>
          </ax-pressure>
        </div>
        <div class="ax-pressure-container" style="margin-top: 10px;">
          <ax-pressure>
            <button class="ax-pressure-button">Project</button>
          </ax-pressure>
          <ax-pressure>
            <button class="ax-pressure-button">Axiom!</button>
          </ax-pressure>
        </div>
      </ax-pressure-bound>
    {/snippet}
  </DemoBlock>

  <!-- 3. Tilt Depth -->
  <DemoBlock
    title="Tilt Depth"
    description="Angle tilt intensity on hover and cursor movement:"
    codeSnippet={snippets.tilt}
    codeLanguage="css"
  >
    {#snippet demo()}
      <ax-pressure-bound class="tilt-factor">
        <div class="ax-pressure-container">
          <ax-pressure>
            <button class="ax-pressure-button">Welcome</button>
          </ax-pressure>
          <ax-pressure>
            <button class="ax-pressure-button">To</button>
          </ax-pressure>
        </div>
        <div class="ax-pressure-container" style="margin-top: 10px;">
          <ax-pressure>
            <button class="ax-pressure-button">Project</button>
          </ax-pressure>
          <ax-pressure>
            <button class="ax-pressure-button">Axiom!</button>
          </ax-pressure>
        </div>
      </ax-pressure-bound>
    {/snippet}
  </DemoBlock>

  <!-- 4. Perspective -->
  <DemoBlock
    title="Perspective"
    description="3D perspective distance for tilt projection:"
    codeSnippet={snippets.perspective}
    codeLanguage="css"
  >
    {#snippet demo()}
      <ax-pressure-bound class="perspective">
        <div class="ax-pressure-container">
          <ax-pressure>
            <button class="ax-pressure-button">Welcome</button>
          </ax-pressure>
          <ax-pressure>
            <button class="ax-pressure-button">To</button>
          </ax-pressure>
        </div>
        <div class="ax-pressure-container" style="margin-top: 10px;">
          <ax-pressure>
            <button class="ax-pressure-button">Project</button>
          </ax-pressure>
          <ax-pressure>
            <button class="ax-pressure-button">Axiom!</button>
          </ax-pressure>
        </div>
      </ax-pressure-bound>
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

  .ax-pressure-container {
    display: flex;
    gap: 10px;
  }

  ax-pressure {
    border: 1px solid #333;
    display: inline-block;
  }

  .ax-pressure-button {
    min-width: 120px;
    padding: 15px 25px;
    border: none;
    background: #9f353a;
    color: white;
    cursor: pointer;
    font-size: 15px;
    font-weight: 500;
    user-select: none;
  }

  .zoom-factor {
    --pressure-zoom: 5px;
    display: block;
  }

  .tilt-factor {
    --pressure-tilt-depth: 50px;
    display: block;
  }

  .perspective {
    --pressure-perspective: 5px;
    display: block;
  }
</style>
