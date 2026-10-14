// A tile does what it was clicked for once its ripple has played, so the press is seen. One
// place for every tile of the site: links of the start screen, ideas, and anything to come.

// A released press finishes its ripple six times faster: about this long after a quick click.
export const RIPPLE_MS = 320;

let pending = false;

// Runs `action` after the ripple of a pointer click, at once for a click from the keyboard
// (no ripple) or when the visitor asks for less motion. Clicks while one waits are dropped.
export function afterRipple(event: MouseEvent, action: () => void) {
  const keyboard = event.detail === 0;
  if (keyboard || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    action();
    return;
  }
  if (pending) return;
  pending = true;
  setTimeout(() => {
    pending = false;
    action();
  }, RIPPLE_MS);
}
