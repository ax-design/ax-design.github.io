<script lang="ts">
  // One example of a component page, as a column: the preview on top, then the text, the
  // controls and the code they produce.
  import { onMount, untrack } from 'svelte';
  import type { Control, Example } from '#lib/docs/types';
  import { CheckBox, ColorPicker, ComboBox, ControlGroup, Slider, TextBox, ToggleSwitch } from '#lib/ui/index.ts';
  import Code from './Code.svelte';
  import Flow from './Flow.svelte';
  import { registerAll } from './register';
  import { scopeCss } from './scope';

  interface Props {
    example: Example;
  }

  let { example }: Props = $props();

  type Value = number | boolean | string;
  const initial = (c: Control): Value => c.default;
  // The controls start from the defaults of the example; a column is keyed by its example.
  let values: Record<string, Value> = $state(untrack(() => Object.fromEntries(example.controls.map((c) => [c.key, initial(c)]))));

  // The text a control writes into the preview and the code.
  function text(c: Control, value: Value): string {
    switch (c.type) {
      case 'range':
        return `${value}${c.unit}`;
      case 'toggle':
        if (c.target.kind === 'attribute') return value ? c.target.attribute : '';
        return String(value ? (c.on ?? 'true') : (c.off ?? 'false'));
      default:
        return String(value);
    }
  }

  let box: HTMLElement | undefined = $state();

  // Write every control into the preview.
  $effect(() => {
    if (!box) return;
    for (const c of example.controls) {
      const value = values[c.key];
      const t = c.target;
      if (t.kind === 'css') {
        const targets = t.selector ? Array.from(box.querySelectorAll<HTMLElement>(t.selector)) : [box];
        for (const el of targets) el.style.setProperty(t.property, text(c, value));
      } else {
        for (const el of box.querySelectorAll(t.selector)) {
          if (c.type === 'toggle') el.toggleAttribute(t.attribute, !!value);
          else el.setAttribute(t.attribute, text(c, value));
        }
      }
    }
  });

  // Examples of script libraries run their own code once every element is registered.
  let ready = $state(false);
  onMount(() => {
    let stop: (() => void) | void;
    let gone = false;
    registerAll().then(() => {
      if (gone || !box) return;
      stop = example.setup?.(box);
      ready = true;
    });
    return () => {
      gone = true;
      stop?.();
    };
  });

  $effect(() => {
    if (!ready || !box || !example.update) return;
    const texts: Record<string, string> = {};
    for (const c of example.controls) texts[c.key] = text(c, values[c.key]);
    example.update(box, texts);
  });

  const code = $derived(
    example.code.map((block) => ({
      language: block.language,
      source: block.source.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
        const c = example.controls.find((control) => control.key === key);
        return c ? text(c, values[key]) : '';
      })
    }))
  );

  // div and the attribute outrank the box's own rules, so an example can restyle its box.
  const scope = $derived(`div.preview[data-example="${example.id}"]`);
  const style = $derived(example.style ? `<style>${scopeCss(example.style, scope)}</style>` : '');
</script>

<Flow label={example.title}>
  <div>
    <div class="preview" data-example={example.id} bind:this={box}>
      {@html style}
      {@html example.preview}
    </div>
    <h3>{example.title}</h3>
  </div>
  {#each example.description as paragraph, i (i)}
    <p>{paragraph}</p>
  {/each}

  {#if example.controls.length}
    <div class="controls">
      <ControlGroup title="Try it">
        {#each example.controls as c (c.key)}
          {#if c.type === 'range'}
            <Slider label={c.label} min={c.min} max={c.max} step={c.step} unit={c.unit} bind:value={values[c.key] as number} />
          {:else if c.type === 'toggle'}
            <ToggleSwitch label={c.label} bind:checked={values[c.key] as boolean} />
          {:else if c.type === 'select'}
            <ComboBox label={c.label} options={c.options} bind:value={values[c.key] as string} />
          {:else if c.type === 'color'}
            <ColorPicker label={c.label} alpha={c.alpha ?? false} bind:value={values[c.key] as string} />
          {:else if c.type === 'text'}
            <TextBox label={c.label} bind:value={values[c.key] as string} />
          {/if}
        {/each}
      </ControlGroup>
    </div>
  {/if}

  {#each code as block, i (i)}
    <div class="listing"><Code code={block.source} language={block.language} /></div>
  {/each}
</Flow>

<style>
  .preview {
    position: relative;
    width: 360px;
    height: 360px;
    margin-bottom: 16px;
    background: var(--page-accent, #2b5797);
    color: #fff;
    overflow: hidden;
    isolation: isolate;
  }
  h3 {
    margin: 0;
    font-size: 24px;
    font-weight: 300;
    line-height: 1.2;
  }
  p {
    margin-top: 0;
    font-size: 15px;
    line-height: 1.55;
    color: #2b2925;
  }
  .controls {
    padding: 4px 0 8px;
  }
  /* The listings keep their own spacing out of the flow. */
  .listing > :global(.code) {
    margin: 0;
  }
</style>
