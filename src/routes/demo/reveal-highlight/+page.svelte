<script lang="ts">
  import { onMount } from 'svelte';
  import { registerRevealHighlight } from '#lib/utils/register';
  import DemoHeader from '#lib/components/DemoHeader.svelte';
  import InstallGuide from '#lib/components/InstallGuide.svelte';
  import DemoBlock from '#lib/components/DemoBlock.svelte';

  const benchmarkIcons = ['🥩', '🥚', '🥛', '👀', '📎'];
  const benchmarkItems = Array.from({ length: 100 }, (_, i) => benchmarkIcons[i % benchmarkIcons.length]);

  const snippets = {
    general: `<ax-reveal-provider>\n  <ax-reveal-bound>\n    <div class="ax-reveal-container">\n      <ax-reveal>\n        <button class="ax-reveal-button">Welcome</button>\n      </ax-reveal>\n      <ax-reveal>\n        <button class="ax-reveal-button">To</button>\n      </ax-reveal>\n    </div>\n  </ax-reveal-bound>\n</ax-reveal-provider>`,
    colored: `.colored-button {\n  --reveal-color: red;\n}`,
    borderWidth: `.border-width {\n  --reveal-border-width: 3px;\n}`,
    fillRadius: `.fill-radius {\n  --reveal-fill-radius: 0.2;\n}`,
    holdAnimation: `.hold-animation {\n  --reveal-animate-speed: 8000;\n  --reveal-released-accelerate-rate: 20;\n}`,
    longList: `.long-list {\n  --reveal-border-style: half;\n  height: 200px;\n  overflow-y: scroll;\n}`,
    noDiffuse: `.no-diffuse {\n  --reveal-diffuse: false;\n}`
  };

  onMount(async () => {
    await registerRevealHighlight({
      compat: true,
      borderDetectionMode: 'experimentalAutoFit'
    });
  });
</script>

<svelte:head>
  <title>AxRevealHighlight Demo - Axiom Design System</title>
</svelte:head>

<div class="demo-page-container">
  <DemoHeader
    title="AxRevealHighlight Demo"
    componentName="Reveal Highlight"
    description="This demo showcases the Reveal Highlight effect of the Fluent Design System."
  />

  <InstallGuide
    packageName="@ax-design/reveal-highlight"
    globalVar="AxRevealHighlight"
  />

  <ax-reveal-provider>
    <!-- 1. General Button -->
    <DemoBlock
      title="General Button"
      description="Basic reveal highlight with adjacent boundary detection:"
      codeSnippet={snippets.general}
    >
      {#snippet demo()}
        <ax-reveal-bound>
          <div class="ax-reveal-container">
            <ax-reveal>
              <button class="ax-reveal-button">Welcome</button>
            </ax-reveal>
            <ax-reveal>
              <button class="ax-reveal-button">To</button>
            </ax-reveal>
          </div>
          <div class="ax-reveal-container" style="margin-top: 10px;">
            <ax-reveal>
              <button class="ax-reveal-button">Project</button>
            </ax-reveal>
            <ax-reveal>
              <button class="ax-reveal-button">Axiom!</button>
            </ax-reveal>
          </div>
        </ax-reveal-bound>
      {/snippet}
    </DemoBlock>

    <!-- 2. Colored Button -->
    <DemoBlock
      title="Colored Button"
      description="Customize highlight halo and border color:"
      codeSnippet={snippets.colored}
      codeLanguage="css"
    >
      {#snippet demo()}
        <ax-reveal-bound class="colored-button">
          <div class="ax-reveal-container">
            <ax-reveal>
              <button class="ax-reveal-button">Welcome</button>
            </ax-reveal>
            <ax-reveal>
              <button class="ax-reveal-button">To</button>
            </ax-reveal>
          </div>
          <div class="ax-reveal-container" style="margin-top: 10px;">
            <ax-reveal>
              <button class="ax-reveal-button">Project</button>
            </ax-reveal>
            <ax-reveal>
              <button class="ax-reveal-button">Axiom!</button>
            </ax-reveal>
          </div>
        </ax-reveal-bound>
      {/snippet}
    </DemoBlock>

    <!-- 3. Border Width -->
    <DemoBlock
      title="Border Width"
      description="Configure reveal border thickness:"
      codeSnippet={snippets.borderWidth}
      codeLanguage="css"
    >
      {#snippet demo()}
        <ax-reveal-bound class="border-width">
          <div class="ax-reveal-container">
            <ax-reveal>
              <button class="ax-reveal-button">Welcome</button>
            </ax-reveal>
            <ax-reveal>
              <button class="ax-reveal-button">To</button>
            </ax-reveal>
          </div>
          <div class="ax-reveal-container" style="margin-top: 10px;">
            <ax-reveal>
              <button class="ax-reveal-button">Project</button>
            </ax-reveal>
            <ax-reveal>
              <button class="ax-reveal-button">Axiom!</button>
            </ax-reveal>
          </div>
        </ax-reveal-bound>
      {/snippet}
    </DemoBlock>

    <!-- 4. Fill Radius -->
    <DemoBlock
      title="Fill Radius"
      description="Control highlight gradient radius ratio:"
      codeSnippet={snippets.fillRadius}
      codeLanguage="css"
    >
      {#snippet demo()}
        <ax-reveal-bound class="fill-radius">
          <div class="ax-reveal-container">
            <ax-reveal>
              <button class="ax-reveal-button">Welcome</button>
            </ax-reveal>
            <ax-reveal>
              <button class="ax-reveal-button">To</button>
            </ax-reveal>
          </div>
          <div class="ax-reveal-container" style="margin-top: 10px;">
            <ax-reveal>
              <button class="ax-reveal-button">Project</button>
            </ax-reveal>
            <ax-reveal>
              <button class="ax-reveal-button">Axiom!</button>
            </ax-reveal>
          </div>
        </ax-reveal-bound>
      {/snippet}
    </DemoBlock>

    <!-- 5. Hold & Release Animation -->
    <DemoBlock
      title="Hold Animation & Release Speed"
      description="Configure press animation and release acceleration:"
      codeSnippet={snippets.holdAnimation}
      codeLanguage="css"
    >
      {#snippet demo()}
        <ax-reveal-bound class="hold-animation release-animation">
          <div class="ax-reveal-container">
            <ax-reveal>
              <button class="ax-reveal-button">Hold Me</button>
            </ax-reveal>
            <ax-reveal>
              <button class="ax-reveal-button">Click Me</button>
            </ax-reveal>
          </div>
        </ax-reveal-bound>
      {/snippet}
    </DemoBlock>

    <!-- 6. Long List -->
    <DemoBlock
      title="Long List with Half Border"
      description="Scrollable list using half border style:"
      codeSnippet={snippets.longList}
      codeLanguage="css"
    >
      {#snippet demo()}
        <ax-reveal-bound class="long-list">
          <div class="ax-reveal-container">
            {#each ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6', 'Item 7', 'Item 8'] as text}
              <ax-reveal>
                <button class="ax-reveal-button">{text}</button>
              </ax-reveal>
            {/each}
          </div>
        </ax-reveal-bound>
      {/snippet}
    </DemoBlock>

    <!-- 7. No diffuse -->
    <DemoBlock
      title="No Diffuse"
      description="Disable highlight diffusion for sharp borders:"
      codeSnippet={snippets.noDiffuse}
      codeLanguage="css"
    >
      {#snippet demo()}
        <ax-reveal-bound class="no-diffuse">
          <div class="ax-reveal-container">
            <ax-reveal>
              <button class="ax-reveal-button">Crisp Border</button>
            </ax-reveal>
            <ax-reveal>
              <button class="ax-reveal-button">No Diffuse</button>
            </ax-reveal>
          </div>
        </ax-reveal-bound>
      {/snippet}
    </DemoBlock>

    <!-- 8. Benchmark (100 Items) -->
    <section class="benchmark-section">
      <h2>Benchmark (100 Items)</h2>
      <p class="benchmark-desc">Stress testing Reveal Highlight with 100 simultaneous tracked elements:</p>
      <ax-reveal-bound>
        <div class="benchmark-grid">
          {#each benchmarkItems as icon, i}
            <ax-reveal class="benchmark-tile">{icon}</ax-reveal>
          {/each}
        </div>
      </ax-reveal-bound>
    </section>
  </ax-reveal-provider>
</div>

<style>
  .demo-page-container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 30px 20px;
    box-sizing: border-box;
  }

  .ax-reveal-container {
    display: flex;
    gap: 10px;
  }

  .ax-reveal-button {
    min-width: 120px;
    padding: 15px 25px;
    border: none;
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    color: #1e293b;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    user-select: none;
    display: block;
    width: 100%;
    box-sizing: border-box;
  }

  .colored-button {
    --reveal-color: red;
  }

  .border-width {
    --reveal-border-width: 3px;
  }

  .fill-radius {
    --reveal-fill-radius: 0.2;
  }

  .hold-animation {
    --reveal-animate-speed: 8000;
  }

  .release-animation {
    --reveal-released-accelerate-rate: 20;
  }

  .long-list {
    --reveal-border-style: half;
    height: 220px;
    width: 250px;
    overflow-y: scroll;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    padding: 4px;
  }

  .long-list .ax-reveal-container {
    flex-direction: column;
    gap: 4px;
  }

  .no-diffuse {
    --reveal-diffuse: false;
  }

  .benchmark-section {
    margin-top: 40px;
    padding-top: 24px;
    border-top: 1px solid #e2e8f0;
  }

  .benchmark-section h2 {
    margin: 0 0 8px 0;
    font-size: 1.3em;
  }

  .benchmark-desc {
    margin: 0 0 16px 0;
    font-size: 14px;
    color: #64748b;
  }

  .benchmark-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    max-width: 500px;
  }

  .benchmark-tile {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    border: 1px solid #e2e8f0;
    background: #fff;
    cursor: default;
  }
</style>
