<script lang="ts">
  interface Props {
    code: string;
    language?: string;
  }

  let { code, language = 'html' }: Props = $props();

  let copied = $state(false);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      copied = true;
      setTimeout(() => {
        copied = false;
      }, 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  }
</script>

<div class="code-block-container">
  <div class="code-header">
    <span class="language-tag">{language}</span>
    <button class="copy-button" onclick={copyCode} title="Copy code">
      {copied ? 'Copied!' : 'Copy'}
    </button>
  </div>
  <pre class="code-pre"><code>{code}</code></pre>
</div>

<style>
  .code-block-container {
    position: relative;
    background: #1e1e1e;
    color: #d4d4d4;
    border-radius: 6px;
    margin: 8px 0 16px 0;
    overflow: hidden;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
    font-size: 13px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .code-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 12px;
    background: #2d2d2d;
    border-bottom: 1px solid #3d3d3d;
  }

  .language-tag {
    font-size: 11px;
    text-transform: uppercase;
    color: #888;
    font-weight: 600;
  }

  .copy-button {
    background: rgba(255, 255, 255, 0.1);
    color: #eee;
    border: none;
    border-radius: 4px;
    padding: 2px 8px;
    font-size: 11px;
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .copy-button:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .code-pre {
    margin: 0;
    padding: 12px;
    overflow-x: auto;
    line-height: 1.45;
  }

  code {
    font-family: inherit;
    white-space: pre;
  }
</style>
