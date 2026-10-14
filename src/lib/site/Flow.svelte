<script lang="ts">
  // A run of blocks that fills a column from the top and goes on in the next column to the
  // right when the height runs out, so a page only ever scrolls sideways. Every child is a
  // block that is never split.
  //
  // The browser lays it out by itself, with no measuring in script: the flow is written
  // vertically (writing-mode: vertical-lr), so its children are inline blocks set from top to
  // bottom that wrap into a new line, a column, at the bottom; and the flow grows as wide as
  // its columns, which CSS columns do not.
  import type { Snippet } from 'svelte';

  interface Props {
    // Width of a column, in px.
    width?: number;
    // Space between two columns, in px; also after the last one.
    gap?: number;
    // Space between two blocks of a column, in px.
    space?: number;
    label?: string;
    children: Snippet;
  }

  let { width = 360, gap = 40, space = 16, label, children }: Props = $props();
</script>

<section class="flow" aria-label={label} style:--flow-width="{width}px" style:--flow-gap="{gap}px" style:--flow-space="{space}px">
  {@render children()}
</section>

<style>
  /* A definite height (the page sets --flow-height), not a percentage: the width of the flow
     as content of the page is worked out before percentages resolve. */
  .flow {
    flex: none;
    height: var(--flow-height, 100%);
    writing-mode: vertical-lr;
    /* No text between the blocks: they sit on lines with no strut. */
    font-size: 0;
    line-height: 0;
  }
  .flow > :global(*) {
    writing-mode: horizontal-tb;
    display: inline-block;
    vertical-align: top;
    box-sizing: border-box;
    width: var(--flow-width);
    /* The blocks of a column line up at their right margin edge: a block must not change
       its right or bottom margin, only its top one. */
    margin: 0 var(--flow-gap) var(--flow-space) 0;
    font-size: 15px;
    line-height: 1.55;
    white-space: normal;
  }
</style>
