// The packages of the design system, the plane of the architecture each one sits on, and what
// each one depends on. The dependencies are the `dependencies` of the package.json of every
// package (the direct ones; bezier-easing, an outside library of Navigation, is left out).
// The colors are those of the tiles on the Start screen.

export interface Pkg {
  id: string;
  name: string;
  // The docs page: /components/<id>/.
  href: string;
  color: string;
  // The plane, bottom (0) to top (3).
  plane: number;
  // One line, as the README says it.
  about: string;
  // Direct dependencies, by id.
  needs: string[];
}

export interface Plane {
  name: string;
  about: string;
}

export const PLANES: Plane[] = [
  { name: 'Properties & geometry', about: 'Typed custom properties, and the shapes everything is drawn on.' },
  { name: 'Surface', about: 'One shape, one tilt and one frame scheduler, with a registry of layers.' },
  { name: 'Effects', about: 'What a Surface draws on its shape: shadow, glass, light and tilt.' },
  { name: 'Components', about: 'What an app uses directly.' }
];

export const PACKAGES: Pkg[] = [
  {
    id: 'typed-om',
    name: 'Typed OM',
    href: '/components/typed-om/',
    color: '#9f00a7',
    plane: 0,
    about: 'Typed reads and change detection for CSS custom properties.',
    needs: []
  },
  {
    id: 'shape',
    name: 'Shape',
    href: '/components/shape/',
    color: '#b45309',
    plane: 0,
    about: 'Rectangle-plus-decoration shapes, drawn the same way on SVG and Canvas.',
    needs: []
  },
  {
    id: 'surface',
    name: 'Surface',
    href: '/components/surface/',
    color: '#2b5797',
    plane: 1,
    about: 'The Surface element: one shape, one tilt and one frame scheduler for every visual layer, with a layer registry.',
    needs: ['shape', 'typed-om']
  },
  {
    id: 'elevation',
    name: 'Elevation',
    href: '/components/elevation/',
    color: '#7e3878',
    plane: 2,
    about: 'A shadow that follows the shape.',
    needs: ['surface', 'shape', 'typed-om']
  },
  {
    id: 'acrylic',
    name: 'Acrylic',
    href: '/components/acrylic/',
    color: '#2d89ef',
    plane: 2,
    about: 'The acrylic texture: blur, tint and noise on the shape.',
    needs: ['surface', 'shape', 'typed-om']
  },
  {
    id: 'reveal-highlight',
    name: 'Reveal Highlight',
    href: '/components/reveal-highlight/',
    color: '#1e7145',
    plane: 2,
    about: 'The reveal light that follows the pointer along the border and over the surface.',
    needs: ['surface', 'shape', 'typed-om']
  },
  {
    id: 'pressure',
    name: 'Pressure',
    href: '/components/pressure/',
    color: '#b91d47',
    plane: 2,
    about: 'The tilt effect: the element leans away from the point you press and sinks a little.',
    needs: ['surface', 'shape', 'typed-om']
  },
  {
    id: 'tile',
    name: 'Tile',
    href: '/components/tile/',
    color: '#e3a21a',
    plane: 3,
    about: 'Tiles with one action each, and the press felt before the action runs.',
    needs: ['surface']
  },
  {
    id: 'tile-group',
    name: 'Tile Group',
    href: '/components/tile-group/',
    color: '#da532c',
    plane: 3,
    about: 'Windows 8 tile groups: layout, dragging and reordering of tiles.',
    needs: ['surface', 'shape', 'typed-om']
  },
  {
    id: 'navigation',
    name: 'Navigation',
    href: '/components/navigation/',
    color: '#525e75',
    plane: 3,
    about: 'Horizontal or vertical navigation with a moving indicator.',
    needs: ['surface', 'shape', 'typed-om']
  },
  {
    id: 'scroll',
    name: 'Scroll',
    href: '/components/scroll/',
    color: '#00aba9',
    plane: 3,
    about: 'The horizontal scroller: the wheel scrolls sideways, with a glide.',
    needs: []
  },
  {
    id: 'scrollbar',
    name: 'Scrollbar',
    href: '/components/scrollbar/',
    color: '#99b433',
    plane: 3,
    about: 'Scroll views and page scrollbars, every part styled with ::part() or replaced by a kit.',
    needs: ['elevation', 'scroll', 'surface', 'shape', 'typed-om']
  }
];

export const byId = new Map(PACKAGES.map((pkg) => [pkg.id, pkg]));

// Every dependency as a pair, the dependent first.
export const EDGES: [string, string][] = PACKAGES.flatMap((pkg) => pkg.needs.map((need): [string, string] => [pkg.id, need]));

// The packages that depend directly on this one.
export function usedBy(id: string): Pkg[] {
  return PACKAGES.filter((pkg) => pkg.needs.includes(id));
}

// The packages of one plane, in the order of the diagram.
export function onPlane(plane: number): Pkg[] {
  return PACKAGES.filter((pkg) => pkg.plane === plane);
}
