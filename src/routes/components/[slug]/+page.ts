import { error } from '@sveltejs/kit';
import { findPage, pages } from '#lib/docs/index';

export const prerender = true;

export function entries() {
  return pages.map((entry) => ({ slug: entry.page.slug }));
}

export function load({ params }) {
  const entry = findPage(params.slug);
  if (!entry) error(404, 'No such component');
  return entry;
}
