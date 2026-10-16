// A query parameter of the site, read from the URL the visitor asked for. Nothing links to these:
// they are switches for the person looking at the page, and a page rendered to a static file knows
// nothing of them until the browser reads the URL.
import { page } from '$app/state';

// ?noflyout: no flyout of any page opens. The press that would open one still presses and still
// acts, it only keeps the panel off the screen: for looking at a page without the panel covering
// it, and for a browser where the panel's own layers are the thing under test.
export const NO_FLYOUT_PARAM = 'noflyout';

// A parameter is on when it stands alone (?noflyout) or carries anything that is not a plain no
// (?noflyout=1); it is off when it says so itself (?noflyout=0, =off, =no, =false).
function isOn(params: URLSearchParams, name: string): boolean {
  const value = params.get(name);
  return value !== null && !['0', 'no', 'off', 'false'].includes(value.trim().toLowerCase());
}

// Whether the URL of the page asks for its flyouts to stay closed. Reads the live URL rather than
// the one the page was loaded with, so a navigation that drops the parameter brings the flyout
// back without a reload.
export const noFlyout = (): boolean => isOn(new URLSearchParams(page.url.search), NO_FLYOUT_PARAM);
