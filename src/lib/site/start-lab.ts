// The tiles of the start lab (/lab/start): the two groups of the Start screen and the app each
// tile opens. The start page and the app page read the same list, so a tile names the same app
// on both.

export interface LabTile {
  slug: string;
  title: string;
  color: string;
  columns: number;
  rows: number;
  // A monochrome SVG drawn white on the tile and on its splash.
  icon?: string;
  // A picture that fills the tile, instead of an icon.
  image?: string;
  // Acrylic glass over the page instead of a colored fill.
  acrylic?: boolean;
}

const icon = (name: string) => `/assets/img/icons/${name}.svg`;

export const back: LabTile[] = [
  { slug: 'playground', title: 'Playground', color: '#603cba', columns: 2, rows: 2, icon: icon('ax-playground') },
  { slug: 'ideas', title: 'Ideas', color: '#00a300', columns: 2, rows: 2, icon: icon('ax-ideas') },
  { slug: 'elevation', title: 'Elevation', color: '#7e3878', columns: 1, rows: 1, icon: icon('ax-elevation') },
  { slug: 'shape', title: 'Shape', color: '#b45309', columns: 1, rows: 1, icon: icon('ax-shape') },
  { slug: 'surface', title: 'Surface', color: '#2b5797', columns: 2, rows: 1, icon: icon('ax-surface') },
  { slug: 'navigation', title: 'Navigation', color: '#525e75', columns: 1, rows: 1, icon: icon('ax-navigation') },
];

export const front: LabTile[] = [
  { slug: 'tile-group', title: 'Tile Group', color: '#da532c', columns: 2, rows: 2, icon: icon('ax-tile-group') },
  { slug: 'scroll', title: 'Scroll', color: '#00aba9', columns: 1, rows: 1, icon: icon('ax-scroll') },
  { slug: 'reveal-highlight', title: 'Reveal Highlight', color: '#1e7145', columns: 2, rows: 1, icon: icon('ax-reveal-highlight') },
  { slug: 'acrylic', title: 'Acrylic', color: '#2d89ef', columns: 2, rows: 2, icon: icon('ax-acrylic'), acrylic: true },
  { slug: 'photo', title: 'Photo', color: '#000000', columns: 2, rows: 2, image: '/demo/images/acrylic-background.jpg' },
  { slug: 'github', title: 'GitHub', color: '#333a45', columns: 1, rows: 1, icon: icon('github') }
];

export function findTile(slug: string | null): LabTile | undefined {
  return [...back, ...front].find((tile) => tile.slug === slug);
}
