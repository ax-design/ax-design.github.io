<script lang="ts">
  import { onMount } from 'svelte';
  import { registerNavigation } from '#lib/utils/register';
  import DemoHeader from '#lib/components/DemoHeader.svelte';
  import InstallGuide from '#lib/components/InstallGuide.svelte';
  import DemoBlock from '#lib/components/DemoBlock.svelte';

  let switchInfo = $state('Try to click the navigation items above.');

  const snippets = {
    general: `<ax-navigation>\n  <ax-navigation-item>Home</ax-navigation-item>\n  <ax-navigation-item>Apps</ax-navigation-item>\n  <ax-navigation-item>Games</ax-navigation-item>\n</ax-navigation>`,
    vertical: `<ax-navigation vertical>\n  <ax-navigation-item>Home</ax-navigation-item>\n  <ax-navigation-item>Apps</ax-navigation-item>\n  <ax-navigation-item>Games</ax-navigation-item>\n</ax-navigation>`,
    defaultItem: `<ax-navigation>\n  <ax-navigation-item>Home</ax-navigation-item>\n  <ax-navigation-item default>Apps</ax-navigation-item>\n  <ax-navigation-item>Games</ax-navigation-item>\n</ax-navigation>`,
    colored: `ax-navigation {\n  --navigation-indicator-color: red;\n}`,
    width: `ax-navigation {\n  --navigation-indicator-width: 10px;\n}`,
    speed: `ax-navigation {\n  --navigation-indicator-speed: 2000ms;\n}`,
    switchEvent: `element.addEventListener('switch', (event) => {\n  console.log(event.detail.from.innerText, event.detail.to.innerText);\n});`
  };

  function handleSwitch(event: Event) {
    const customEvent = event as CustomEvent<{ from: HTMLElement; to: HTMLElement }>;
    if (customEvent.detail && customEvent.detail.from && customEvent.detail.to) {
      switchInfo = `You've switched from ${customEvent.detail.from.innerText} to ${customEvent.detail.to.innerText}`;
    }
  }

  onMount(async () => {
    await registerNavigation();
  });
</script>

<svelte:head>
  <title>AxNavigation Demo - Axiom Design System</title>
</svelte:head>

<div class="demo-page-container">
  <DemoHeader
    title="AxNavigation Demo"
    componentName="Navigation"
    description="This demo showcases the Navigation Indicator animation of the Fluent Design System."
  />

  <InstallGuide
    packageName="@ax-design/navigation"
    globalVar="AxNavigation"
  />

  <!-- 1. General Navigation -->
  <DemoBlock
    title="General Navigation"
    description="Horizontal navigation indicator bar:"
    codeSnippet={snippets.general}
  >
    {#snippet demo()}
      <ax-navigation>
        <ax-navigation-item>Home</ax-navigation-item>
        <ax-navigation-item>Apps</ax-navigation-item>
        <ax-navigation-item>Games</ax-navigation-item>
      </ax-navigation>
    {/snippet}
  </DemoBlock>

  <!-- 2. Vertical Navigation -->
  <DemoBlock
    title="Vertical Navigation"
    description="Add vertical attribute for vertical tabs:"
    codeSnippet={snippets.vertical}
  >
    {#snippet demo()}
      <ax-navigation vertical>
        <ax-navigation-item>Home</ax-navigation-item>
        <ax-navigation-item>Apps</ax-navigation-item>
        <ax-navigation-item>Games</ax-navigation-item>
      </ax-navigation>
    {/snippet}
  </DemoBlock>

  <!-- 3. Default Item -->
  <DemoBlock
    title="Default Item"
    description="To change the default item, simply add a default attribute to the navigation item:"
    codeSnippet={snippets.defaultItem}
  >
    {#snippet demo()}
      <ax-navigation>
        <ax-navigation-item>Home</ax-navigation-item>
        <ax-navigation-item default>Apps</ax-navigation-item>
        <ax-navigation-item>Games</ax-navigation-item>
      </ax-navigation>
    {/snippet}
  </DemoBlock>

  <!-- 4. Colored Indicator -->
  <DemoBlock
    title="Colored Indicator"
    description="Customize indicator color via CSS variable:"
    codeSnippet={snippets.colored}
    codeLanguage="css"
  >
    {#snippet demo()}
      <ax-navigation class="colored-indicator">
        <ax-navigation-item>Home</ax-navigation-item>
        <ax-navigation-item>Apps</ax-navigation-item>
        <ax-navigation-item>Games</ax-navigation-item>
      </ax-navigation>
    {/snippet}
  </DemoBlock>

  <!-- 5. Indicator Width -->
  <DemoBlock
    title="Indicator Width"
    description="Customize indicator line thickness:"
    codeSnippet={snippets.width}
    codeLanguage="css"
  >
    {#snippet demo()}
      <ax-navigation class="indicator-width">
        <ax-navigation-item>Home</ax-navigation-item>
        <ax-navigation-item>Apps</ax-navigation-item>
        <ax-navigation-item>Games</ax-navigation-item>
      </ax-navigation>
    {/snippet}
  </DemoBlock>

  <!-- 6. Animation Speed -->
  <DemoBlock
    title="Animation Speed"
    description="Customize animation transition duration:"
    codeSnippet={snippets.speed}
    codeLanguage="css"
  >
    {#snippet demo()}
      <ax-navigation class="indicator-speed">
        <ax-navigation-item>Home</ax-navigation-item>
        <ax-navigation-item>Apps</ax-navigation-item>
        <ax-navigation-item>Games</ax-navigation-item>
      </ax-navigation>
    {/snippet}
  </DemoBlock>

  <!-- 7. Switch Event -->
  <DemoBlock
    title="Switch Event"
    description="Listen for the 'switch' event dispatched when selecting a tab:"
    codeSnippet={snippets.switchEvent}
    codeLanguage="javascript"
  >
    {#snippet demo()}
      <ax-navigation onswitch={handleSwitch}>
        <ax-navigation-item>Home</ax-navigation-item>
        <ax-navigation-item>Apps</ax-navigation-item>
        <ax-navigation-item>Games</ax-navigation-item>
      </ax-navigation>
      <div class="switch-information">{switchInfo}</div>
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

  .colored-indicator {
    --navigation-indicator-color: red;
  }

  .indicator-width {
    --navigation-indicator-width: 10px;
  }

  .indicator-speed {
    --navigation-indicator-speed: 2000ms;
  }

  .switch-information {
    margin-top: 14px;
    padding: 10px 14px;
    background: #f1f5f9;
    border-radius: 6px;
    font-size: 14px;
    color: #334155;
  }
</style>
