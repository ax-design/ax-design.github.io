<script lang="ts">
  import type { Snippet } from 'svelte';
  import CodeBlock from './CodeBlock.svelte';

  interface Props {
    title?: string;
    description?: string;
    codeSnippet?: string;
    codeLanguage?: string;
    demo?: Snippet;
    code?: Snippet;
    children?: Snippet;
  }

  let {
    title = '',
    description = '',
    codeSnippet = '',
    codeLanguage = 'html',
    demo,
    code,
    children
  }: Props = $props();
</script>

<section class="demo-block">
  <div class="demo-preview">
    {#if demo}
      {@render demo()}
    {:else if children}
      {@render children()}
    {/if}
  </div>

  <div class="demo-code-pane">
    {#if title}
      <h2 class="block-title">{title}</h2>
    {/if}
    {#if description}
      <p class="block-desc">{description}</p>
    {/if}
    {#if codeSnippet}
      <CodeBlock code={codeSnippet} language={codeLanguage} />
    {/if}
    {#if code}
      {@render code()}
    {/if}
  </div>
</section>

<style>
  .demo-block {
    display: flex;
    border-bottom: #ddd dashed 1px;
    padding: 24px 0;
    gap: 24px;
    align-items: flex-start;
  }

  @media (max-width: 900px) {
    .demo-block {
      flex-direction: column;
    }
  }

  .demo-preview {
    width: 480px;
    max-width: 100%;
    flex-shrink: 0;
    position: relative;
    box-sizing: border-box;
  }

  .demo-code-pane {
    flex: 1;
    min-width: 0;
    box-sizing: border-box;
  }

  .block-title {
    margin: 0 0 8px 0;
    font-size: 1.25em;
    font-weight: 600;
  }

  .block-desc {
    margin: 0 0 10px 0;
    font-size: 14px;
    color: #555;
    line-height: 1.5;
  }
</style>
