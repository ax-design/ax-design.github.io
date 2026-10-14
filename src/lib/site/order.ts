// Keeps the order the visitor dragged the tiles of a group into, in localStorage, and puts it
// back on the next visit. A stored order is used only when it is exactly a permutation of the
// tiles on the page: when tiles were added, removed or renamed since, it is dropped.

const VERSION = 1;

interface Stored {
  v: typeof VERSION;
  ids: string[];
}

// The id of a tile: the element's data-id.
const idOf = (el: Element): string | null => (el as HTMLElement).dataset?.id ?? null;

function tiles(group: Element): { el: Element; id: string }[] {
  const out: { el: Element; id: string }[] = [];
  for (const el of group.children) {
    const id = idOf(el);
    if (id) out.push({ el, id });
  }
  return out;
}

function read(key: string): unknown {
  try {
    const text = localStorage.getItem(key);
    return text === null ? null : JSON.parse(text);
  } catch {
    return null;
  }
}

function forget(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    // Storage blocked: nothing to forget.
  }
}

function isStored(value: unknown): value is Stored {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  const v = value as Record<string, unknown>;
  return v.v === VERSION && Array.isArray(v.ids) && v.ids.every((id) => typeof id === 'string');
}

// The stored order, when it is a permutation of `current`.
function valid(value: unknown, current: string[]): string[] | null {
  if (!isStored(value)) return null;
  const { ids } = value;
  if (ids.length !== current.length) return null;
  const seen = new Set(ids);
  if (seen.size !== ids.length) return null;
  for (const id of current) if (!seen.has(id)) return null;
  return ids;
}

// Puts the tiles of `group` in the stored order. Call it before the group lays them out.
export function restoreOrder(group: Element, key: string) {
  const list = tiles(group);
  const value = read(key);
  if (value === null) return;
  const ids = valid(value, list.map((t) => t.id));
  if (!ids) {
    forget(key);
    return;
  }
  const byId = new Map(list.map((t) => [t.id, t.el]));
  // Tiles only: anything else in the group stays where it is, after them.
  const after = list.length ? list[list.length - 1].el.nextSibling : null;
  for (const id of ids) group.insertBefore(byId.get(id)!, after);
}

// Stores the order of `group` after every drag. Returns a function that stops it.
export function keepOrder(group: Element, key: string): () => void {
  const save = () => {
    const stored: Stored = { v: VERSION, ids: tiles(group).map((t) => t.id) };
    try {
      localStorage.setItem(key, JSON.stringify(stored));
    } catch {
      // Storage blocked or full: the order lives until the page is left.
    }
  };
  group.addEventListener('tiledragend', save);
  return () => group.removeEventListener('tiledragend', save);
}
