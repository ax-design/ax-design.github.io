import { error } from '@sveltejs/kit';
import { findPage, pages } from '#lib/docs/index';
import { a11y } from '#lib/docs/a11y';

export const prerender = true;

export function entries() {
  return pages.map((entry) => ({ slug: entry.page.slug }));
}

export function load({ params }) {
  const entry = findPage(params.slug);
  if (!entry) error(404, 'No such component');
  const extra = a11y[params.slug];
  if (!extra) return entry;
  // A copy: the imported page object is shared by every load.
  return {
    ...entry,
    page: { ...entry.page, examples: [...entry.page.examples, extra] }
  };
}
