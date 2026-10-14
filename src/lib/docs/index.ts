// Every component page, in the order of the start screen, with the color of its tile.
import type { DocPage } from './types';
import surface from './surface';
import typedOm from './typed-om';
import revealHighlight from './reveal-highlight';
import acrylic from './acrylic';
import elevation from './elevation';
import pressure from './pressure';
import tileGroup from './tile-group';
import scroll from './scroll';
import navigation from './navigation';

export interface PageEntry {
  page: DocPage;
  accent: string;
}

export const pages: PageEntry[] = [
  { page: surface, accent: '#2b5797' },
  { page: typedOm, accent: '#9f00a7' },
  { page: revealHighlight, accent: '#1e7145' },
  { page: acrylic, accent: '#2d89ef' },
  { page: elevation, accent: '#7e3878' },
  { page: pressure, accent: '#b91d47' },
  { page: tileGroup, accent: '#da532c' },
  { page: scroll, accent: '#00aba9' },
  { page: navigation, accent: '#525e75' }
];

export function findPage(slug: string): PageEntry | undefined {
  return pages.find((entry) => entry.page.slug === slug);
}
