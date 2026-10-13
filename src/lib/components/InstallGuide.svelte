<script lang="ts">
  import CodeBlock from './CodeBlock.svelte';

  interface Props {
    packageName: string;
    globalVar: string;
  }

  let { packageName, globalVar }: Props = $props();

  let activeTab = $state<'bun' | 'npm' | 'direct' | 'esm'>('bun');

  let directCode = $derived(`<script src="https://unpkg.com/${packageName}"><\/script>
<script>
  ${globalVar}.register();
<\/script>`);

  let esmScriptCode = $derived(`<script type="module">
  import { register } from 'https://unpkg.com/${packageName}/es/index.js';
  register();
<\/script>`);

  let bundlerEsmCode = $derived(`// ESModule
import { register } from '${packageName}';
register();`);

  let bundlerCjsCode = $derived(`// CommonJS
require('${packageName}').register();`);
</script>

<div class="install-guide">
  <h3>Installation & Usage</h3>
  <div class="tabs">
    <button
      class="tab-btn"
      class:active={activeTab === 'bun'}
      onclick={() => (activeTab = 'bun')}
    >
      Bun / Bundler
    </button>
    <button
      class="tab-btn"
      class:active={activeTab === 'npm'}
      onclick={() => (activeTab = 'npm')}
    >
      NPM / Yarn
    </button>
    <button
      class="tab-btn"
      class:active={activeTab === 'esm'}
      onclick={() => (activeTab = 'esm')}
    >
      Browser ESModule
    </button>
    <button
      class="tab-btn"
      class:active={activeTab === 'direct'}
      onclick={() => (activeTab = 'direct')}
    >
      Direct Script
    </button>
  </div>

  <div class="tab-content">
    {#if activeTab === 'bun'}
      <p class="desc">Install using Bun package manager:</p>
      <CodeBlock code="bun add {packageName}" language="bash" />
      <p class="desc">Then register the component in your project:</p>
      <CodeBlock code={bundlerEsmCode} language="javascript" />
    {:else if activeTab === 'npm'}
      <p class="desc">Install via npm or yarn:</p>
      <CodeBlock code="npm install {packageName} # or yarn add {packageName}" language="bash" />
      <CodeBlock code={bundlerEsmCode} language="javascript" />
      <CodeBlock code={bundlerCjsCode} language="javascript" />
    {:else if activeTab === 'esm'}
      <p class="desc">Load directly using ES module in HTML:</p>
      <CodeBlock code={esmScriptCode} language="html" />
    {:else if activeTab === 'direct'}
      <p class="desc">Load traditional UMD / direct script:</p>
      <CodeBlock code={directCode} language="html" />
    {/if}
  </div>
</div>

<style>
  .install-guide {
    background: #f8f9fa;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 18px 20px;
    margin: 20px 0 30px 0;
  }

  h3 {
    margin: 0 0 12px 0;
    font-size: 1.1em;
    font-weight: 600;
  }

  .tabs {
    display: flex;
    gap: 8px;
    border-bottom: 2px solid #e2e8f0;
    margin-bottom: 14px;
    overflow-x: auto;
  }

  .tab-btn {
    background: none;
    border: none;
    padding: 8px 12px;
    font-size: 13px;
    font-weight: 500;
    color: #64748b;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -2px;
    transition: all 0.15s ease;
  }

  .tab-btn:hover {
    color: #0f172a;
  }

  .tab-btn.active {
    color: #0284c7;
    border-bottom-color: #0284c7;
    font-weight: 600;
  }

  .desc {
    margin: 6px 0;
    font-size: 13px;
    color: #475569;
  }
</style>
