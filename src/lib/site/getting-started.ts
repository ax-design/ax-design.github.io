// The listings of the Getting Started page. Every package name, register call, element and
// attribute here is the one the README of that package documents.

export const INSTALL_APP = `# with npm
npm install @ax-design/tile-group @ax-design/tile @ax-design/navigation @ax-design/scroll @ax-design/scrollbar

# with bun
bun add @ax-design/tile-group @ax-design/tile @ax-design/navigation @ax-design/scroll @ax-design/scrollbar`;

export const REGISTER_APP = `import { register as registerTile } from '@ax-design/tile';
import { register as registerTileGroup } from '@ax-design/tile-group';
import { register as registerNavigation } from '@ax-design/navigation';
import { register as registerScroll } from '@ax-design/scroll';
import { register as registerScrollbar } from '@ax-design/scrollbar';

registerTile();       // also defines <ax-surface>
registerTileGroup();
registerNavigation();
registerScroll();
registerScrollbar();  // <ax-scroll-view> and <ax-scrollbar>`;

export const MARKUP_APP = `<body>
  <ax-scrollbar></ax-scrollbar>

  <ax-navigation>
    <ax-navigation-item>Home</ax-navigation-item>
    <ax-navigation-item>Apps</ax-navigation-item>
    <ax-navigation-item>Games</ax-navigation-item>
  </ax-navigation>

  <ax-scroll style="height: 330px">
    <div style="display: flex; width: max-content">
      <ax-tile-group style="--tile-rows: 4">
        <ax-tile columns="4" rows="2" layers="fill" style="--ax-fill-color: #2b5797">
          <a slot="action" href="/mail">Mail</a>
        </ax-tile>
        <ax-tile columns="2" rows="2" layers="fill" style="--ax-fill-color: #da532c">
          <a slot="action" href="/photos">Photos</a>
        </ax-tile>
        <ax-tile columns="2" rows="2" layers="fill" style="--ax-fill-color: #00aba9">
          <a slot="action" href="/music">Music</a>
        </ax-tile>
      </ax-tile-group>
    </div>
  </ax-scroll>

  <ax-scroll-view style="height: 240px">
    <article>...</article>
  </ax-scroll-view>
</body>`;

export const REVEAL_NOTE = `import { registerRevealLayer } from '@ax-design/reveal-highlight';

registerRevealLayer();  // before the tiles are used, then layers="fill reveal"`;

export const INSTALL_FOUNDATIONS = `# with npm
npm install @ax-design/surface @ax-design/elevation @ax-design/reveal-highlight

# with bun
bun add @ax-design/surface @ax-design/elevation @ax-design/reveal-highlight`;

export const REGISTER_FOUNDATIONS = `import { register } from '@ax-design/surface';
import { registerElevationLayer } from '@ax-design/elevation';
import { registerRevealLayer } from '@ax-design/reveal-highlight';

// The layers first, then the element that uses them.
registerElevationLayer();
registerRevealLayer();
register();`;

export const MARKUP_FOUNDATIONS = `<ax-surface layers="elevation fill reveal">
  <button class="my-button">Hello</button>
</ax-surface>`;

export const STYLE_FOUNDATIONS = `ax-surface {
  --ax-radius: 12px;
  --ax-fill-color: white;
  --ax-border-color: #3b4252;
  --ax-tilt-mode: absolute;  /* the surface tilts toward the point you press */
}`;

export const CDN = `<script src="https://unpkg.com/@ax-design/tile/build/main.js"></` + `script>
<script src="https://unpkg.com/@ax-design/tile-group/build/main.js"></` + `script>
<script src="https://unpkg.com/@ax-design/navigation/build/main.js"></` + `script>
<script src="https://unpkg.com/@ax-design/scroll/build/main.js"></` + `script>
<script src="https://unpkg.com/@ax-design/scrollbar/build/main.js"></` + `script>
<script>
  AxTile.register();
  AxTileGroup.register();
  AxNavigation.register();
  AxScroll.register();
  AxScrollbar.register();
</` + `script>`;

// The packages with a page of their own, in the order the page names them.
export const LINKS: { name: string; href: string; global?: string }[] = [
  { name: 'Tile Group', href: '/components/tile-group/', global: 'AxTileGroup' },
  { name: 'Tile', href: '/components/tile/', global: 'AxTile' },
  { name: 'Navigation', href: '/components/navigation/', global: 'AxNavigation' },
  { name: 'Scroll', href: '/components/scroll/', global: 'AxScroll' },
  { name: 'Scrollbar', href: '/components/scrollbar/', global: 'AxScrollbar' },
  { name: 'Surface', href: '/components/surface/' },
  { name: 'Shape', href: '/components/shape/' },
  { name: 'Typed OM', href: '/components/typed-om/' },
  { name: 'Elevation', href: '/components/elevation/', global: 'AxElevation' },
  { name: 'Acrylic', href: '/components/acrylic/', global: 'AxAcrylic' },
  { name: 'Reveal Highlight', href: '/components/reveal-highlight/', global: 'AxRevealHighlight' },
  { name: 'Pressure', href: '/components/pressure/', global: 'AxPressure' }
];
