<script lang="ts">
  // A code block on the paper of a component page: set like a printed listing, with a copy
  // button.
  import { fit } from './fit';

  interface Props {
    code: string;
    language?: string;
  }

  let { code, language = 'html' }: Props = $props();
  let copied = $state(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      copied = true;
      setTimeout(() => (copied = false), 1600);
    } catch {
      // Clipboard access denied: nothing to do.
    }
  }
</script>

<figure class="code">
  <figcaption>
    <span class="language">{language}</span>
    <button type="button" class="copy" onclick={copy}>{copied ? 'Copied' : 'Copy'}</button>
  </figcaption>
  <!-- A scroll view as tall as the listing: the sideways bar of a long line is drawn over the
       padding under it. -->
  <ax-scroll-view vertical="hidden" snap use:fit>
    <pre><code>{code}</code></pre>
  </ax-scroll-view>
</figure>

<style>
  .code {
    margin: 0 0 16px;
    background: #ebe6dc;
    border-left: 3px solid var(--page-accent, #2b5797);
  }
  figcaption {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 12px 0;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #6b645a;
  }
  .copy {
    font: inherit;
    border: 0;
    background: none;
    color: inherit;
    cursor: pointer;
    padding: 2px 0;
  }
  .copy:hover,
  .copy:focus-visible {
    color: #1b1b1b;
  }
  /* Before the element is defined it is a block that scrolls by itself. */
  ax-scroll-view {
    display: block;
  }
  ax-scroll-view:not(:defined) {
    overflow-x: auto;
  }
  pre {
    margin: 0;
    padding: 8px 12px 20px;
    width: max-content;
    min-width: 100%;
    box-sizing: border-box;
    font: 12.5px/1.55 ui-monospace, 'Cascadia Code', Consolas, Menlo, monospace;
    color: #22201c;
  }
  code {
    font: inherit;
    white-space: pre;
  }
</style>
