// What a press of a tile of this site does: it acts once its ripple has played, so the press is
// seen. One place for every tile of the site: the links of the start screen, the ideas, the
// playground. The clicks that keep what the browser does with them are decided here too.

// A released press finishes its ripple six times faster: about this long after a quick click.
const RIPPLE_MS = 320;

let pending = false;

// Runs `action` after the ripple of a pointer click, at once for a click from the keyboard
// (no ripple) or when the visitor asks for less motion. Clicks while one waits are dropped.
function afterRipple(event: MouseEvent, action: () => void) {
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

export interface PressOptions {
  // The handler is on a link of this site: a plain click on it is held back for the action, and a
  // click that asks for another tab or window is left to the browser.
  link?: boolean;
  // A link that leaves this site, which the browser keeps whole.
  external?: boolean;
}

// The click handler of a tile: `action` runs once the ripple has played, and only for a click
// that is a press of this tile. The middle button is never one; on a link, a click with a
// modifier asks for another tab or window and is left alone, while a button is pressed whatever
// is held down, as it is without this.
export function pressed(action: () => void, options: PressOptions = {}): (event: MouseEvent) => void {
  const { link = false, external = false } = options;
  return (event: MouseEvent) => {
    if (external || event.defaultPrevented || event.button !== 0) return;
    if (link && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) return;
    if (link) event.preventDefault();
    afterRipple(event, action);
  };
}
