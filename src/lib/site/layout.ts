// The width at which a page of the site stops being a sideways spread of columns and becomes
// one column going down.
//
// A flow steps 400px per column: a column is 360px and the 40px gap its flow leaves after every
// block of it, the last block of a column included, is where the next column starts. A page of
// two columns therefore reaches as far as the margin at its left edge (120), the whole first
// column group (400), the whole second one (400), and the margin a page keeps at its right edge
// (80): 920px. Wider, both columns are whole and the sideways scroll the site is built on has
// something to show; narrower, the second column is only part of itself at the right edge, and
// the page stacks instead.
//
// The CSS that lays the pages out (Flow.svelte, AppShell.svelte, assets/css/main.css) holds the
// same number in its media queries, where it cannot be read from here: keep the three in step.
export const SPREAD_MIN_WIDTH = 920;

// Whether a page of this width is a sideways spread of columns rather than one column going
// down. The scroll binding of a page follows this: sideways, the wheel glides the page; stacked,
// the wheel is the browser's own vertical scroll.
export const isWide = (): boolean => window.innerWidth >= SPREAD_MIN_WIDTH;

// Calls `run` with the current answer of isWide(), and again whenever the page crosses the
// width. The answer is false without a window, where the site is rendered to static files.
export function watchWidth(run: (wide: boolean) => void): () => void {
  if (typeof window === 'undefined') {
    run(false);
    return () => {};
  }
  const narrow = window.matchMedia(`(max-width: ${SPREAD_MIN_WIDTH - 1}px)`);
  const update = () => run(!narrow.matches);
  update();
  narrow.addEventListener('change', update);
  return () => narrow.removeEventListener('change', update);
}