// The Accessibility column of each component page. A switch above the preview shows the component
// in one mode at a time: live in the reader's own settings, live with Surface's fallback (a page
// can turn it on, so it is shown for real), or a picture of it in forced colors, which a page
// cannot turn on (taken from this preview by scripts/a11y-shots.ts into static/a11y). Every topic
// says only what the package does; where a package does nothing for a topic, it is left out.
import type { CodeBlock, Control, Example } from './types';

interface Picture {
  // File suffix: static/a11y/<slug>-<file>.png.
  file: 'forced-dark' | 'forced-light';
  // The option of the switch.
  label: string;
  alt: string;
}

const forcedDark: Picture = { file: 'forced-dark', label: 'High contrast, dark', alt: 'The preview in forced colors with a dark theme.' };
const forcedLight: Picture = { file: 'forced-light', label: 'High contrast, light', alt: 'The preview in forced colors with a light theme.' };
// Kept so the entries below read as before: the fallback is now a live mode of the switch.
const fallback = null;

const LIVE = 'Your settings';
const FALLBACK = 'Fallback';

// Marks the entries whose layers have Surface's fallback: their switch gets a live Fallback mode.
const fallbackControl = 'fallback' as const;

// Surface is imported when the column runs in the browser only. The fallback is global to the
// page, so it is turned off again when the reader leaves.
const setFallback = (on: boolean) => {
  void import('@ax-design/surface').then((surface) => surface.setAlwaysUseFallback(on));
};

const fallbackCode: CodeBlock[] = [
  {
    language: 'js',
    source: "import { setAlwaysUseFallback } from '@ax-design/surface';\n\n// Draw every effect with its solid fallback, as when transparency effects are off.\nsetAlwaysUseFallback(true);"
  }
];

// Shared by every preview: the live component fills the box, and a picture covers it when its
// mode is chosen.
const css = `
.a11y { position: absolute; inset: 0; color: #fff; }
.live { position: absolute; inset: 0; }
.shot { position: absolute; inset: 0; width: 100%; height: 100%; display: none; }
.a11y[data-mode="forced-dark"] .shot[data-shot="forced-dark"],
.a11y[data-mode="forced-light"] .shot[data-shot="forced-light"] { display: block; }
.a11y[data-mode="forced-dark"] .live, .a11y[data-mode="forced-light"] .live { visibility: hidden; }
`;

function preview(slug: string, live: string, pictures: Picture[]): string {
  const shots = pictures.map((p) => `<img class="shot" data-shot="${p.file}" src="/a11y/${slug}-${p.file}.png" alt="${p.alt}">`).join('');
  return `<div class="a11y" data-mode="live"><div class="live">${live}</div>${shots}</div>`;
}

function style(extra: string): string {
  return css + extra;
}

// How a reader sees the modes they are not in, on their own machine.
const TRY_IT =
  'Try it: in Chrome or Edge, open DevTools, then Rendering, and emulate the CSS media features prefers-reduced-motion, forced-colors or prefers-reduced-transparency. Or turn on the setting of your system: Show animations, Contrast themes and Transparency effects on Windows; Reduce motion, Increase contrast and Reduce transparency on macOS.';

function example(
  description: string[],
  live: string,
  pictures: (Picture | null)[],
  extra: string,
  options: { controls?: (Control | typeof fallbackControl)[]; code?: CodeBlock[]; setup?: Example['setup']; update?: Example['update']; slug: string }
): Example {
  const shots = pictures.filter((p): p is Picture => p !== null);
  const hasFallback = (options.controls ?? []).includes(fallbackControl);
  const others = (options.controls ?? []).filter((c): c is Control => c !== fallbackControl);
  const modes = [LIVE, ...(hasFallback ? [FALLBACK] : []), ...shots.map((p) => p.label)];
  const mode: Control = { key: 'mode', label: 'Show', type: 'select', options: modes, default: LIVE, target: { kind: 'css', property: '--a11y-mode' } };
  return {
    id: 'accessibility',
    title: 'Accessibility',
    description: [...description, TRY_IT],
    preview: preview(options.slug, live, shots),
    style: style(extra),
    controls: [mode, ...others],
    code: options.code ?? [],
    setup: (root) => {
      const undo = options.setup?.(root);
      return () => {
        if (hasFallback) setFallback(false);
        if (undo) undo();
      };
    },
    update: (root, values) => {
      const shot = shots.find((p) => p.label === values.mode);
      const box = root.querySelector<HTMLElement>('.a11y');
      if (box) box.dataset.mode = shot ? shot.file : values.mode === FALLBACK ? 'fallback' : 'live';
      if (hasFallback) setFallback(values.mode === FALLBACK);
      options.update?.(root, values);
    }
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
      'Reduced transparency: Effects with a solid fallback, such as acrylic and reveal, use it. Choose Fallback in the switch to see it live.',
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
      'Reduced transparency: No highlight is drawn when the effects fall back: in forced colors, with prefers-reduced-transparency, or with setAlwaysUseFallback(true). Choose Fallback in the switch to see it live.',
      'More contrast: Reveal changes nothing by itself, as Windows has no such setting. The code makes the light stronger for users who ask for more contrast.'
    ],
    revealButtons,
    [forcedDark, forcedLight, fallback],
    revealExtra,
    {
      slug: 'reveal-highlight',
      controls: [fallbackControl],
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
      'Reduced transparency: The glass falls back to its solid color with prefers-reduced-transparency or with setAlwaysUseFallback(true), cross-fading into and out of it. Choose Fallback in the switch to see it live.'
    ],
    '<div class="glass-stage"><ax-acrylic class="glass"><span>Acrylic</span></ax-acrylic></div>',
    [forcedDark, forcedLight, fallback],
    `.glass-stage { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: url(${glassBackground}) center / cover; }
.glass { display: block; width: 220px; height: 120px; color: #fff; }
.glass span { display: flex; height: 100%; align-items: center; justify-content: center; font-size: 15px; }`,
    {
      slug: 'acrylic',
      controls: [fallbackControl],
      code: fallbackCode
    }
  ),

  elevation: example(
    [
      'Screen readers: The shadow is a canvas hidden from assistive technology. It adds nothing to read.',
      'High contrast (forced colors): The shadow is hidden, as box-shadow was in forced colors.',
      'Reduced transparency: The shadow is dropped when transparency effects are off, and with setAlwaysUseFallback(true), as Windows does on battery saver or slow hardware. Choose Fallback in the switch to see it live.'
    ],
    '<div class="stage"><ax-elevation class="card"><span>Elevation</span></ax-elevation></div>',
    [forcedDark, forcedLight, fallback],
    `.a11y { background: #f2f0eb; color: #1b1b1b; }
.stage { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
.card { display: block; width: 200px; height: 100px; --elevation-depth: 16; }
.card span { display: flex; height: 100%; align-items: center; justify-content: center; font-size: 15px; background: #fff; }
@media (forced-colors: active) { .card span { border: 1px solid CanvasText; } }`,
    {
      slug: 'elevation',
      controls: [fallbackControl],
      code: fallbackCode
    }
  ),

  pressure: example(
    [
      'Keyboard: Pressure tilts with the pointer and adds no keys. A button inside it keeps its own keyboard behaviour: Tab reaches it, and Enter or Space press it.',
      'Screen readers: Pressure adds no role. Give the content what a reader needs: alt text on a picture, the text of a button.',
      'High contrast (forced colors): Pressure draws no color of its own. The tilt is Surface\'s, and the colors of the tile are yours. Check them in forced colors: a picture drawn in one color can vanish on a background of the same color.',
      'Reduced motion: The tilt takes its pose at once instead of easing into it, as in Surface. A pressed tile still tilts.'
    ],
    '<ax-pressure class="press"><div class="panel"><ax-reveal><button>Open</button></ax-reveal><ax-reveal><button>Save</button></ax-reveal></div></ax-pressure>',
    [forcedDark, forcedLight],
    `.live { display: flex; align-items: center; justify-content: center; }
.press { display: block; --pressure-tilt-depth: 4px; }
.panel { display: flex; flex-direction: column; gap: 10px; width: 180px; }
ax-reveal { display: block; --reveal-color: rgb(255, 255, 255); --reveal-opacity: 0.4; }
button { width: 100%; height: 48px; border: 0; background: rgba(255, 255, 255, 0.08); color: #fff; font: inherit; font-size: 15px; cursor: pointer; }
@media (forced-colors: active) { button { border: 1px solid ButtonText; } }`,
    { slug: 'pressure', code: [] }
  ),

  'tile-group': example(
    [
      'Keyboard: With drag set, Tab to the button of a tile, then hold Alt and Shift and press an arrow key. The tile moves to the next place in that direction, and holding the keys keeps it moving. Focus stays on the tile. Focus inside a group also ends its entrance at once.',
      'Screen readers: After a move, the group says where the tile is in a live region, such as "Mail, moved to position 2 of 6". Set announce="off" to turn this off, or assign describeMove to word it in another language.',
      'High contrast (forced colors): The group draws no color of its own. Its tiles follow the forced colors rules of Surface.',
      'Reduced motion: enter() and exit() jump to their end state at once, and their promises resolve on the next frame.',
      'Reduced transparency: The tiles are surfaces, so their reveal lights fall back as on the Surface page. Choose Fallback in the switch to see it live.',
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
.item { flex: none; width: var(--item-width); height: 100px; background: rgba(255, 255, 255, 0.16); display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 300; }
@media (forced-colors: active) { .item { border: 1px solid CanvasText; } }`,
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

  scrollbar: example(
    [
      'Keyboard: The viewport of ax-scroll-view takes focus with Tab while nothing inside it can take focus, and the arrow, Page Up, Page Down, Home and End keys scroll it. A view with links, buttons or fields adds no tab stop of its own: focus goes into the content, and the keys scroll from there. The bars are not in the tab order: markers are for the pointer, so give links or buttons for the same places.',
      'Screen readers: The bars and the cards are hidden from assistive technology. Name the view as a region, as in the code, so the content has a name when it takes focus.',
      'High contrast (forced colors): The overlay is not drawn, and the native scrollbars of the browser come back, so the bars stay visible.',
      'Reduced motion: The bars take their end state at once: no glide, no lag of the thumb, and the card does not move. The card closes by itself after a short delay.'
    ],
    '<ax-scroll-view role="region" aria-label="Article" class="sc"><div class="body">' + [1, 2, 3].map((n) => `<h2>Section ${n}</h2><p>Scrolling stays native, so the keys, the wheel and find in page work as usual.</p>`).join('') + '</div></ax-scroll-view>',
    [forcedDark, forcedLight],
    `.live { display: flex; align-items: center; justify-content: center; color: #fff; }
ax-scroll-view.sc { width: 300px; height: 200px; }
.body { padding: 12px; font: 13px/1.5 system-ui, sans-serif; }
.body h2 { margin: 0 0 4px; font-size: 15px; font-weight: 600; }
.body p { margin: 0 0 14px; }
@media (forced-colors: active) { ax-scroll-view.sc { border: 1px solid CanvasText; } }`,
    {
      slug: 'scrollbar',
      code: [
        {
          language: 'html',
          source: '<ax-scroll-view role="region" aria-label="Article" style="height: 420px">\n  <article>...</article>\n</ax-scroll-view>'
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
      'Reduced transparency: With the fallback the reveal light is not drawn, and the click runs at once, as it does without any feedback. Choose Fallback in the switch to see it live.',
      'More contrast: Nothing changes by itself. The tile follows the prefers-contrast rules of Surface.'
    ],
    '<ax-tile class="t" layers="fill reveal"><button slot="action" type="button">Mail</button></ax-tile>',
    [forcedDark, forcedLight, fallback],
    `.live { display: flex; align-items: center; justify-content: center; }
ax-tile.t { display: block; width: 180px; height: 120px; color: #fff; --ax-fill-color: rgba(255, 255, 255, 0.2); --reveal-color: rgb(255, 255, 255); --reveal-opacity: 0.35; }
ax-tile button[slot="action"] { font: inherit; font-size: 15px; color: inherit; background: none; border: 0; padding: 0 16px; height: 100%; cursor: pointer; }`,
    {
      slug: 'tile',
      controls: [fallbackControl],
      code: fallbackCode
    }
  )
};
