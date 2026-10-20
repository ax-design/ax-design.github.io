// The Accessibility column of each component page. The preview shows the component as it is in
// the reader's own settings, live, and pictures of it in the modes the reader is not in (taken
// by scripts/a11y-shots.ts into static/a11y). Every topic says only what the package does; where
// a package does nothing for a topic, the topic is left out.
import type { CodeBlock, Control, Example } from './types';

interface Picture {
  // File suffix: static/a11y/<slug>-<file>.png.
  file: 'forced-dark' | 'forced-light' | 'fallback';
  caption: string;
}

const forcedDark: Picture = { file: 'forced-dark', caption: 'Forced colors, dark' };
const forcedLight: Picture = { file: 'forced-light', caption: 'Forced colors, light' };
const fallback: Picture = { file: 'fallback', caption: 'Use fallback: on' };

// What each picture shows, for the alt text. Written from the pictures themselves.
const ALT: Record<string, string> = {
  'surface-forced-dark': 'The first example in forced colors, dark: a solid black box with rounded corners and white text, over the water picture.',
  'surface-forced-light': 'The same in forced colors, light: a solid white box with black text, over the water picture.',
  'surface-fallback': 'The first example with the fallback on: the acrylic is a solid blue box with rounded corners, over the water picture.',
  'reveal-highlight-forced-dark': 'The first example in forced colors, dark: four buttons with white text on black, and no light or border around them.',
  'reveal-highlight-forced-light': 'The same in forced colors, light: black text on white, and no light or border around the buttons.',
  'reveal-highlight-fallback': 'The first example with the fallback on: the buttons in their normal colors, with no light under the pointer.',
  'acrylic-forced-dark': 'The glass in forced colors, dark: a solid black box with white text, over the leaves of the picture.',
  'acrylic-forced-light': 'The glass in forced colors, light: a solid white box with black text, over the leaves of the picture.',
  'acrylic-fallback': 'The glass with the fallback on: a solid dark teal box with no blur and no noise, over the leaves of the picture.',
  'elevation-forced-dark': 'The card in forced colors, dark: a black card with white text and no shadow.',
  'elevation-forced-light': 'The card in forced colors, light: a white card with black text and no shadow.',
  'elevation-fallback': 'The card with the fallback on: a white card on a light background, with no shadow under it.',
  'pressure-forced-dark': 'The Apple tile in forced colors, dark: its picture and name in white on black, with the tile background gone.',
  'pressure-forced-light': 'The Apple tile in forced colors, light: the name Apple in black on white. The picture is gone: its white artwork is the same color as the background.',
  'tile-group-forced-dark': 'The tile group in forced colors, dark: black tiles with white outlines, and their pictures in white.',
  'tile-group-forced-light': 'The tile group in forced colors, light: white tiles with black outlines, and their pictures in black.',
  'tile-group-fallback': 'The tile group with the fallback on: tiles of several sizes with their pictures, and no reveal light drawn.',
  'scroll-forced-dark': 'The scroller in forced colors, dark: the numbers of the items in white on black; the item boxes are gone.',
  'scroll-forced-light': 'The scroller in forced colors, light: the numbers of the items in black on white; the item boxes are gone.',
  'navigation-forced-dark': 'The navigation in forced colors, dark: Home, Apps and Games in white on black, and the indicator under Home in the system Highlight color.',
  'navigation-forced-light': 'The navigation in forced colors, light: Home, Apps and Games in black on white, and the indicator under Home in the system Highlight color.',
  'tile-forced-dark': 'The Mail tile in forced colors, dark: a black square with a white outline and its label in white.',
  'tile-forced-light': 'The Mail tile in forced colors, light: a white square with a black outline and its label in black.',
  'tile-fallback': 'The Mail tile with the fallback on: a flat square in a lighter yellow, with no reveal light, and its label at the bottom left.'
};

// The switch of Surface's fallback. Its value is only read in update(); the target is a harmless
// custom property on the box.
const fallbackControl: Control = {
  key: 'fallback',
  label: 'Use fallback',
  type: 'toggle',
  default: false,
  on: 'true',
  off: 'false',
  target: { kind: 'css', property: '--a11y-fallback' }
};

// The fallback is global to the page, so it is set in update() and restored when the reader
// leaves the page. Surface is imported when the column runs in the browser only.
const fallbackSetup = () => () => {
  void import('@ax-design/surface').then((surface) => surface.setAlwaysUseFallback(false));
};
const fallbackUpdate = (_root: HTMLElement, values: Record<string, string>) => {
  void import('@ax-design/surface').then((surface) => surface.setAlwaysUseFallback(values.fallback === 'true'));
};

const fallbackCode: CodeBlock[] = [
  {
    language: 'js',
    source: "import { setAlwaysUseFallback } from '@ax-design/surface';\n\nsetAlwaysUseFallback({{fallback}});"
  }
];

// Shared by every preview: the live part, then the pictures in two columns.
const css = `
.a11y { position: absolute; inset: 0; overflow-y: auto; box-sizing: border-box; padding: 12px; color: #fff; font-size: 12px; line-height: 1.3; }
.a11y h4 { margin: 0 0 6px; font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; }
.live { position: relative; height: 150px; margin-bottom: 12px; overflow: hidden; }
.gallery { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.gallery figure { margin: 0; }
.gallery img { display: block; width: 100%; height: auto; border-radius: 4px; }
.gallery figcaption { margin-top: 3px; font-size: 11px; }
`;

function preview(slug: string, live: string, pictures: Picture[]): string {
  const gallery = pictures.length
    ? `<h4>Other modes</h4><div class="gallery">${pictures
        .map(
          (p) =>
            `<figure><img src="/a11y/${slug}-${p.file}.png" alt="${ALT[`${slug}-${p.file}`] ?? ''}"><figcaption>${p.caption}</figcaption></figure>`
        )
        .join('')}</div>`
    : '';
  return `<div class="a11y"><h4>Live, in your settings</h4><div class="live">${live}</div>${gallery}</div>`;
}

function style(extra: string): string {
  return css + extra;
}

function example(
  description: string[],
  live: string,
  pictures: Picture[],
  extra: string,
  options: { controls?: Control[]; code?: CodeBlock[]; setup?: Example['setup']; update?: Example['update']; slug: string }
): Example {
  return {
    id: 'accessibility',
    title: 'Accessibility',
    description,
    preview: preview(options.slug, live, pictures),
    style: style(extra),
    controls: options.controls ?? [],
    code: options.code ?? [],
    setup: options.setup,
    update: options.update
  };
}

// The buttons of Reveal Highlight, in a grid, as on its own page.
const revealButtons = `<div class="grid">
  <ax-reveal><button>Welcome</button></ax-reveal>
  <ax-reveal><button>To</button></ax-reveal>
  <ax-reveal><button>Project</button></ax-reveal>
  <ax-reveal><button>Axiom</button></ax-reveal>
</div>`;

const revealExtra = `
.grid { position: absolute; inset: 0; display: grid; grid-template-columns: repeat(2, 132px); grid-auto-rows: 56px; gap: 8px; align-content: center; justify-content: center; }
ax-reveal { display: block; --reveal-color: rgb(255, 255, 255); --reveal-opacity: 0.4; }
button { width: 100%; height: 100%; border: 0; background: rgba(255, 255, 255, 0.08); color: #fff; font: inherit; font-size: 15px; cursor: pointer; }
@media (forced-colors: active) {
  ax-reveal button { border: 1px solid ButtonText; }
  ax-reveal button:hover, ax-reveal button:active { border-color: Highlight; }
}
`;

const items = (n = 8) =>
  Array.from({ length: n }, (_, i) => `<div class="item"><span>${i + 1}</span></div>`).join('');

const glassBackground = '/demo/images/acrylic-background.jpg';

// Libraries without UI: one paragraph, a note in the preview, no pictures.
const library = (slug: string, text: string, live: string): Example => ({
  id: 'accessibility',
  title: 'Accessibility',
  description: [text],
  preview: `<div class="a11y"><h4>No UI</h4><div class="live">${live}</div></div>`,
  style: style(`.live { display: flex; align-items: center; justify-content: center; text-align: center; font-size: 14px; }
.shape { width: 180px; height: 110px; color: #fff; --ax-fill-color: rgba(255, 255, 255, 0.16); --ax-border-color: rgba(255, 255, 255, 0.7); --ax-border-width: 2px; --ax-radius: 18px; }
.shape span { display: flex; height: 100%; align-items: center; justify-content: center; }`),
  controls: [],
  code: []
});

export const a11y: Record<string, Example> = {
  shape: library(
    'shape',
    'No UI: Shape is a library of geometry and has no element of its own. The shapes are drawn by Surface, so their accessibility is the accessibility of the surfaces that use them (see the Surface page).',
    '<ax-surface class="shape" layers="fill"><span>Surface</span></ax-surface>'
  ),

  surface: example(
    [
      'Keyboard: Add the focus layer and the surface draws the focus ring of Windows around its shape while an element in it has keyboard focus. Press Tab to reach the button in the preview. Its own browser outline is off, so the ring is the only focus mark.',
      'Screen readers: Surface sets no role and no name, so the content gives them: the button has its own text. The drawings of the layers are hidden from assistive technology.',
      'High contrast (forced colors): The fill turns into Canvas, the border into CanvasText, and the focus rings into CanvasText and Canvas. The browser does not recolor SVG or canvas drawings, so the layers do it themselves.',
      'Reduced motion: The tilt takes its pose at once instead of easing into it. A pressed surface still tilts.',
      'Reduced transparency: Effects with a solid fallback, such as acrylic and reveal, use it. Use the switch below to see it.',
      'More contrast: Surfaces do not change by themselves. The code raises the border and the focus ring for users who ask for more contrast.'
    ],
    '<ax-surface class="shape" layers="fill reveal focus"><button class="btn" type="button">Press me</button></ax-surface>',
    [forcedDark, forcedLight, fallback],
    `.shape { width: 200px; height: 120px; color: #fff; --ax-radius: 20px; --ax-fill-color: rgba(255, 255, 255, 0.14); --ax-border-color: rgba(255, 255, 255, 0.7); --ax-border-width: 2px; --reveal-color: rgb(255, 255, 255); --reveal-opacity: 0.35; margin: 40px auto; }
.live { display: flex; align-items: center; justify-content: center; }
.btn { font: inherit; font-size: 15px; color: #fff; background: none; border: 0; padding: 0 20px; height: 100%; cursor: pointer; }
ax-surface .btn:focus-visible { outline: none; }`,
    {
      slug: 'surface',
      controls: [fallbackControl],
      setup: fallbackSetup,
      update: fallbackUpdate,
      code: [
        {
          language: 'css',
          source: '@media (prefers-contrast: more) {\n  ax-surface {\n    --ax-border-color: rgb(0, 0, 0);\n    --ax-focus-ring-color: rgb(0, 0, 0);\n    --ax-focus-ring-secondary-color: rgb(255, 255, 255);\n  }\n}'
        }
      ]
    }
  ),

  'typed-om': library(
    'typed-om',
    'No UI: Typed OM is a library that reads and watches custom properties. It draws nothing and adds no keys and no roles. The components that use it (Acrylic, Elevation, Pressure and Reveal Highlight) say what their users get.',
    '<p class="note">Reads --ax-radius, --reveal-color and the other custom properties of the components.</p>'
  ),

  'reveal-highlight': example(
    [
      'Keyboard: Reveal adds no keys. Tab moves between the buttons, and Enter or Space press the focused one as a button does. The focus ring of a slotted button stays.',
      'Screen readers: The light is a canvas hidden from assistive technology. The button keeps its own name, so a button with only an icon needs an aria-label.',
      'High contrast (forced colors): The light is not drawn, so a button needs a border of its own. The code gives the rule of Windows: ButtonText at rest, Highlight on hover and press.',
      'Reduced motion: Reduced motion leaves the light on, as Windows does.',
      'Reduced transparency: No highlight is drawn when the effects fall back: in forced colors, with prefers-reduced-transparency, or with setAlwaysUseFallback(true). Use the switch below to see it.',
      'More contrast: Reveal changes nothing by itself, as Windows has no such setting. The code makes the light stronger for users who ask for more contrast.'
    ],
    revealButtons,
    [forcedDark, forcedLight, fallback],
    revealExtra,
    {
      slug: 'reveal-highlight',
      controls: [fallbackControl],
      setup: fallbackSetup,
      update: fallbackUpdate,
      code: [
        {
          language: 'css',
          source: '@media (forced-colors: active) {\n  ax-reveal button { border: 1px solid ButtonText; }\n  ax-reveal button:hover, ax-reveal button:active { border-color: Highlight; }\n}\n\n@media (prefers-contrast: more) {\n  ax-reveal, ax-surface {\n    --reveal-opacity: 0.5;\n    --reveal-border-color: rgb(0, 0, 0);\n  }\n}'
        }
      ]
    }
  ),

  acrylic: example(
    [
      'High contrast (forced colors): The glass is a solid Canvas, and the content on top of it keeps its own colors.',
      'Reduced transparency: The glass falls back to its solid color with prefers-reduced-transparency or with setAlwaysUseFallback(true), cross-fading into and out of it. Use the switch below to see it.'
    ],
    '<div class="glass-stage"><ax-acrylic class="glass"><span>Acrylic</span></ax-acrylic></div>',
    [forcedDark, forcedLight, fallback],
    `.glass-stage { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: url(${glassBackground}) center / cover; }
.glass { display: block; width: 220px; height: 120px; color: #fff; }
.glass span { display: flex; height: 100%; align-items: center; justify-content: center; font-size: 15px; }
.live { position: relative; }`,
    {
      slug: 'acrylic',
      controls: [fallbackControl],
      setup: fallbackSetup,
      update: fallbackUpdate,
      code: fallbackCode
    }
  ),

  elevation: example(
    [
      'Screen readers: The shadow is a canvas hidden from assistive technology. It adds nothing to read.',
      'High contrast (forced colors): The shadow is hidden, as box-shadow was in forced colors.',
      'Reduced transparency: The shadow is dropped when transparency effects are off, and with setAlwaysUseFallback(true), as Windows does on battery saver or slow hardware. Use the switch below to see it.'
    ],
    '<div class="stage"><ax-elevation class="card"><span>Elevation</span></ax-elevation></div>',
    [forcedDark, forcedLight, fallback],
    `.a11y { background: #f2f0eb; color: #1b1b1b; }
.stage { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
.card { display: block; width: 200px; height: 100px; --elevation-depth: 16; }
.card span { display: flex; height: 100%; align-items: center; justify-content: center; font-size: 15px; background: #fff; }`,
    {
      slug: 'elevation',
      controls: [fallbackControl],
      setup: fallbackSetup,
      update: fallbackUpdate,
      code: fallbackCode
    }
  ),

  pressure: example(
    [
      'Keyboard: Pressure tilts with the pointer and adds no keys. A button inside it keeps its own keyboard behaviour: Tab reaches it, and Enter or Space press it.',
      'Screen readers: Pressure adds no role. Give the content what a reader needs: alt text on a picture, the text of a button.',
      'High contrast (forced colors): Pressure draws no color of its own. The tilt is Surface\'s, and the colors of the tile are yours. Check them in forced colors: a picture drawn in one color can vanish on a background of the same color, as the Apple does on white in the picture below.',
      'Reduced motion: The tilt takes its pose at once instead of easing into it, as in Surface. A pressed tile still tilts.'
    ],
    '<ax-pressure class="press"><div class="panel"><ax-reveal><button>Open</button></ax-reveal><ax-reveal><button>Save</button></ax-reveal></div></ax-pressure>',
    [forcedDark, forcedLight],
    `.live { display: flex; align-items: center; justify-content: center; }
.press { display: block; --pressure-tilt-depth: 4px; }
.panel { display: flex; flex-direction: column; gap: 10px; width: 180px; }
ax-reveal { display: block; --reveal-color: rgb(255, 255, 255); --reveal-opacity: 0.4; }
button { width: 100%; height: 48px; border: 0; background: rgba(255, 255, 255, 0.08); color: #fff; font: inherit; font-size: 15px; cursor: pointer; }`,
    { slug: 'pressure', code: [] }
  ),

  'tile-group': example(
    [
      'Keyboard: With drag set, Tab to the button of a tile, then hold Alt and Shift and press an arrow key. The tile moves to the next place in that direction, and holding the keys keeps it moving. Focus stays on the tile. Focus inside a group also ends its entrance at once.',
      'Screen readers: After a move, the group says where the tile is in a live region, such as "Mail, moved to position 2 of 6". Set announce="off" to turn this off, or assign describeMove to word it in another language.',
      'High contrast (forced colors): The group draws no color of its own. Its tiles follow the forced colors rules of Surface.',
      'Reduced motion: enter() and exit() jump to their end state at once, and their promises resolve on the next frame.',
      'Reduced transparency: The tiles are surfaces, so their reveal lights fall back as on the Surface page. Use the switch below to see it.',
      'More contrast: Nothing changes by itself. The tiles follow the prefers-contrast rules of Surface.'
    ],
    `<ax-tile-group drag="press" class="group">
  <ax-tile columns="2" rows="2" layers="fill reveal"><button slot="action" type="button">Mail</button></ax-tile>
  <ax-tile columns="2" rows="2" layers="fill reveal"><button slot="action" type="button">Maps</button></ax-tile>
  <ax-tile columns="1" rows="1" layers="fill reveal"><button slot="action" type="button">Chat</button></ax-tile>
  <ax-tile columns="1" rows="1" layers="fill reveal"><button slot="action" type="button">News</button></ax-tile>
  <ax-tile columns="2" rows="1" layers="fill reveal"><button slot="action" type="button">Music</button></ax-tile>
</ax-tile-group>`,
    [forcedDark, forcedLight, fallback],
    `.live { display: flex; align-items: center; justify-content: center; }
.group { --tile-cell-width: 30px; --tile-cell-height: 30px; --tile-gap: 4px; --tile-rows: 4; }
ax-tile { color: #fff; --ax-fill-color: rgba(255, 255, 255, 0.2); --reveal-color: rgb(255, 255, 255); --reveal-opacity: 0.35; }
ax-tile button { position: absolute; inset: 0; border: 0; background: none; color: inherit; font: inherit; font-size: 11px; text-align: left; padding: 4px; cursor: pointer; }`,
    {
      slug: 'tile-group',
      controls: [fallbackControl],
      setup: fallbackSetup,
      update: fallbackUpdate,
      code: fallbackCode
    }
  ),

  scroll: example(
    [
      'Keyboard: Tab to the scroller. It takes focus by itself when nothing inside it can. The Up and Down keys, Page Up and Page Down scroll it sideways, and the Left and Right keys scroll it as usual.',
      'Screen readers: Give a focusable scroller a role and a name, as in the code. The component adds no role itself.',
      'Reduced motion: When the user asks for reduced motion, scrollAlong() ignores smooth and the scroll jumps to its place.'
    ],
    `<ax-scroll role="region" aria-label="Featured tiles" class="sc"><div class="strip">${items(8)}</div></ax-scroll>`,
    [forcedDark, forcedLight],
    `.live { display: flex; align-items: center; }
ax-scroll.sc { width: 336px; height: 120px; --item-width: 110px; }
.strip { display: flex; gap: 8px; width: max-content; padding: 0 12px; height: 100%; align-items: center; }
.item { flex: none; width: var(--item-width); height: 100px; background: rgba(255, 255, 255, 0.16); display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 300; }`,
    {
      slug: 'scroll',
      code: [
        {
          language: 'html',
          source: '<ax-scroll role="region" aria-label="Featured tiles" style="height: 600px">\n  <div style="display: flex; width: max-content">...</div>\n</ax-scroll>'
        }
      ]
    }
  ),

  navigation: example(
    [
      'Keyboard: Tab enters the navigation on the current item. The Left and Right arrows move between the items (Up and Down in a vertical one), Home and End go to the first and last, and Enter or Space select the focused item. Moving focus does not select.',
      'Screen readers: Items get the roles of a tab list: the element is a tablist, and the items are tabs with aria-selected. Give the element a name with aria-label. A row of links is a navigation, and its current link gets aria-current. The panels are yours: point each tab at its panel with aria-controls.',
      'High contrast (forced colors): The indicator is painted with Highlight, the system color, instead of its indicator color.',
      'Reduced motion: The indicator moves at once, without its springs.'
    ],
    '<ax-navigation aria-label="Sections"><ax-navigation-item>Home</ax-navigation-item><ax-navigation-item>Apps</ax-navigation-item><ax-navigation-item>Games</ax-navigation-item></ax-navigation>',
    [forcedDark, forcedLight],
    `.live { display: flex; align-items: center; justify-content: center; }
ax-navigation { font-size: 16px; --navigation-indicator-color: #fff; }
ax-navigation-item { cursor: pointer; }`,
    {
      slug: 'navigation',
      code: [
        {
          language: 'html',
          source: '<ax-navigation aria-label="Settings">\n  <ax-navigation-item aria-controls="panel-general">General</ax-navigation-item>\n  <ax-navigation-item aria-controls="panel-privacy">Privacy</ax-navigation-item>\n</ax-navigation>'
        }
      ]
    }
  ),

  tile: example(
    [
      'Keyboard: Tab to the action. Enter presses a link or a button, and Space presses a button; Space does not activate a link, it scrolls the page. The press comes from the center of the tile, and the action runs after the ripple.',
      'Screen readers: The tile sets no role. The link or the button of the action gives the role and the name. With label="hidden" the text is not shown, and the name stays.',
      'High contrast (forced colors): The tile is a surface, so its fill and border follow the forced colors rules of Surface.',
      'Reduced motion: The tilt takes its end state at once. A reveal ripple still plays, and the click waits for it. A flip launch is not played.',
      'Reduced transparency: With the fallback the reveal light is not drawn, and the click runs at once, as it does without any feedback. Use the switch below to see it.',
      'More contrast: Nothing changes by itself. The tile follows the prefers-contrast rules of Surface.'
    ],
    '<ax-tile class="t" layers="fill reveal"><button slot="action" type="button">Shuffle</button></ax-tile>',
    [forcedDark, forcedLight, fallback],
    `.live { display: flex; align-items: center; justify-content: center; }
ax-tile.t { display: block; width: 180px; height: 120px; color: #fff; --ax-fill-color: rgba(255, 255, 255, 0.2); --reveal-color: rgb(255, 255, 255); --reveal-opacity: 0.35; }
ax-tile button[slot="action"] { font: inherit; font-size: 15px; color: inherit; background: none; border: 0; padding: 0 16px; height: 100%; cursor: pointer; }`,
    {
      slug: 'tile',
      controls: [fallbackControl],
      setup: fallbackSetup,
      update: fallbackUpdate,
      code: fallbackCode
    }
  )
};
