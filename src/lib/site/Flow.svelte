<script lang="ts">
  // A run of blocks that fills a column from the top and goes on in the next column to the
  // right when the height runs out, so a page only ever scrolls sideways. Every child is a
  // block that is never split. Narrower than a spread, the same blocks go down one page instead
  // of sideways (see #lib/site/layout.ts).
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
    /* The flow's own writing mode is the one that sets the block off from the next one in the
       column; a block holds text, and the text is set normally. */
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
  /* Narrower than a spread of columns (see #lib/site/layout.ts): the flow drops its sideways
     writing mode and its blocks go down the page instead of across it, the page scrolling down
     rather than sideways. The flow keeps the margin a column has at the two ends of the page,
     and a block fills what is left between them: the column width a flow is given only starts a
     spread, and the page it now stacks on is as wide as the window. */
  @media (max-width: 919px) {
    .flow {
      /* Back to the normal axis, or the blocks are inline blocks set top to bottom and still
         make columns. */
      writing-mode: horizontal-tb;
      display: block;
      width: 100%;
      height: auto;
      padding: 0 var(--flow-gap);
      font-size: 15px;
      line-height: 1.55;
    }
    .flow > :global(*) {
      display: block;
      width: auto;
      max-width: 100%;
      margin: 0 auto var(--flow-space);
    }
    /* A block that holds to a fixed width (a 360px preview, a scroll demo) keeps its size down to
       a column, and is capped rather than run off a narrower page. */
    .flow > :global(*) :global(*) {
      max-width: 100%;
    }
  }
</style>
