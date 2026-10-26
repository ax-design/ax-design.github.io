import type { CodeBlock, DocPage } from './types';
// The looks of the package demo, as they are shipped there. The examples apply them as they are and
// the listings show them without their comments.
import cyberCss from './scrollbar-looks/cyberpunk.css?raw';
import minimalCss from './scrollbar-looks/minimal.css?raw';
import win11Css from './scrollbar-looks/win11.css?raw';

// A look without its comments and empty lines, cut into listings of at most `lines` lines at a rule
// boundary: a column of the page holds about forty lines beside a preview.
function listing(css: string, lines = 26): CodeBlock[] {
  const bare = css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{2,}/g, '\n')
    .trim()
    .split(/\n(?=\S)/);
  const blocks: CodeBlock[] = [];
  let current: string[] = [];
  let size = 0;
  for (const rule of bare) {
    const n = rule.split('\n').length;
    if (size && size + n > lines) {
      blocks.push({ language: 'css', source: current.join('\n') });
      current = [];
      size = 0;
    }
    current.push(rule);
    size += n;
  }
  if (current.length) blocks.push({ language: 'css', source: current.join('\n') });
  return blocks;
}

const paragraphs = [
  'Scrolling stays native: the wheel, the touch and the keys scroll the view, and find in page reaches the content.',
  'The bars are an overlay. They never take room from the content, and they show while the pointer moves over the view.',
  'Every part of a bar is a shadow part: you style it with ::part(), or replace it with a kit.'
];

// Sections with a heading each, long enough to scroll in the preview box. `count` paragraphs follow
// a heading.
const article = (headings: string[], count = 2) =>
  headings.map((heading, i) => `<h2>${heading}</h2>` + Array.from({ length: count }, (_, k) => `<p>${paragraphs[(i + k) % paragraphs.length]}</p>`).join('')).join('');

const headings = ['Introduction', 'Setup', 'Usage', 'Styling', 'Markers', 'Reference'];

// The white stage of the Windows 8 looks: the scroll view fills the preview box, and the content
// keeps clear of the bar with the size the component writes on the view.
const lightStyle = `
.stage { position: absolute; inset: 0; background: #fff; color: #1b1b1b; }
ax-scroll-view { position: absolute; inset: 0; }
.body { padding: 16px calc(var(--ax-scrollbar-vertical-size, 0px) + 14px) 16px 16px; font: 13px/1.5 "Segoe UI", system-ui, sans-serif; }
.body h2 { margin: 0 0 6px; font-size: 18px; font-weight: 300; }
.body p { margin: 0 0 16px; }
`;

const light = (attributes = '', headingList = headings, count = 2) =>
  `<div class="stage"><ax-scroll-view${attributes}><div class="body">${article(headingList, count)}</div></ax-scroll-view></div>`;

// Windows 11: a pale page whose swatches pass under the track, so the acrylic has something to blur.
const swatches = '<div class="swatches"><span></span><span></span><span></span><span></span><span></span><span></span></div>';
const win11Preview = `<div class="stage"><ax-scroll-view class="win11" data-variant="default" track-layers="scrollbar-fill acrylic" touch="indicator" indicator="auto" marker-selector="h2" marker-align="center"><div class="body">
<h2>Acrylic track</h2><p>The track blurs what scrolls under it. The swatches pass under the bar to show it.</p>${swatches}
<h2>Fluent</h2><p>One layer is added by configuration. The rest is the default parts, styled with ::part().</p>
<h2>Variants</h2><p>Default hides the bar until the pointer is over it. Minimal is the thumb alone. Full never hides.</p>${swatches}
<h2>Markers</h2><p>Dashes on the track mark the headings. Rest the pointer on one to read it.</p>${swatches}
<h2>Done</h2><p>Scroll a little more.</p>
</div></ax-scroll-view></div>`;

const win11Style = `
.stage { position: absolute; inset: 0; background: #f3f3f3; }
ax-scroll-view { position: absolute; inset: 16px 0 16px 20px; }
.body { font: 13px/1.5 "Segoe UI Variable", "Segoe UI", system-ui, sans-serif; color: #1b1b1b; }
.body h2 { margin: 22px 0 4px; font-size: 18px; font-weight: 600; }
.body h2:first-child { margin-top: 0; }
.body p { margin: 0 34px 10px 0; }
.swatches { display: grid; grid-template-columns: repeat(6, 1fr); height: 64px; margin: 4px 0 12px; }
.swatches span:nth-child(1) { background: #0078d4; }
.swatches span:nth-child(2) { background: #107c10; }
.swatches span:nth-child(3) { background: #ffb900; }
.swatches span:nth-child(4) { background: #d13438; }
.swatches span:nth-child(5) { background: #8764b8; }
.swatches span:nth-child(6) { background: #2d2d2d; }
${win11Css}`;

const cyberPreview = `<div class="stage"><ax-scroll-view class="cyber" snap touch="bar" hide="button" marker-selector="h2" marker-align="center"><div class="body">
<h2>Shape</h2><p>Every part takes its outline from the Shape system: a corner shape and a radius, set on the part.</p>
<h2>Bevel</h2><p>A bevel of radius r cuts r off along both sides of a corner. Two opposite corners are cut, the others stay square.</p>
<h2>Diamonds</h2><p>The markers are squares with all four corners bevelled at the midpoint of their sides.</p>
<h2>Glow</h2><p>The card is lit by the elevation layer, in a magenta <b>--elevation-color</b>.</p>
<h2>Night</h2><p>Scroll on, and rest the pointer on a diamond.</p>
</div></ax-scroll-view></div>`;

const cyberStyle = `
.stage { position: absolute; inset: 0; background: #07070f; }
ax-scroll-view { position: absolute; inset: 16px 0 16px 20px; }
.body { padding: 0 34px 0 0; font: 12px/1.65 ui-monospace, "Cascadia Mono", Menlo, Consolas, monospace; color: #9fd8de; }
.body h2 { margin: 22px 0 6px; font-size: 15px; font-weight: 400; letter-spacing: 0.08em; text-transform: uppercase; color: #3df0ff; text-shadow: 0 0 8px rgba(61, 240, 255, 0.5); }
.body h2:first-child { margin-top: 0; }
.body p { margin: 0 0 10px; }
.body b { color: #ff4fe0; font-weight: 400; }
${cyberCss}
.cyber::part(thumb) { --ax-radius: var(--cyber-cut, 4px); }
.cyber::part(card) { --elevation-color: var(--cyber-glow, rgba(255, 43, 214, 0.35)); }
`;

// A Windows XP window client: Tahoma on white, a table that is wider than the view so that both
// bars and the corner show.
const lunaPreview = (scheme: string, attributes = '') => `<div data-stage${attributes} class="${scheme}"><ax-scroll-view kit="luna" snap touch="bar" vertical="always" horizontal="always" marker-selector="h3" marker-align="center"><div class="notes">
<h3>Version 2.4</h3><p>The list view keeps its place when the window is resized. Selected rows stay selected.</p>
<h3>Version 2.3</h3><p>Search results can be sorted by date or by name. The choice is remembered.</p>
<h3>Table of values</h3>
<pre>name          region    count  unit    owner
north-depot   eastern    1204  crates  warehouse-a
south-depot   western     877  crates  warehouse-b
harbour-store coastal      56  pallets warehouse-c</pre>
<h3>Version 2.2</h3><p>Fixed a case where the first row hid under the header after a scroll.</p>
<h3>Version 2.1</h3><p>New option to keep the header row visible while the body scrolls.</p>
<h3>Earlier versions</h3><p>Earlier notes are kept in the archive.</p>
</div></ax-scroll-view></div>`;

const lunaStyle = `
[data-stage] { position: absolute; inset: 0; background: #fff; }
ax-scroll-view { position: absolute; inset: 0; --ax-scrollbar-card-delay: 500ms; }
.notes { padding: 20px calc(var(--ax-scrollbar-vertical-size, 0px) + 6px) calc(var(--ax-scrollbar-horizontal-size, 0px) + 8px) 22px; font: 11px/1.5 Tahoma, Verdana, sans-serif; color: #000; }
.notes h3 { margin: 12px 0 4px; font: bold 11px Tahoma, Verdana, sans-serif; }
.notes h3:first-child { margin-top: 0; }
.notes p { margin: 0 0 8px; }
.notes pre { margin: 0 0 8px; width: max-content; padding-right: calc(var(--ax-scrollbar-vertical-size, 0px) + 6px); font: 11px/1.4 "Courier New", monospace; }
`;

// A scheme of the page's own, written as the README of the package does. Its Style picks the numbers:
// Blue's with the light from the top left, or Silver's with the light from above, and the colour is
// --luna-accent-light alone, from which the accent, the deep tone and the arrows follow.
const customStyle = `
.luna-custom { --luna-disabled: #f0f0e6; }
.luna-custom[data-style="Luna"] {
  --luna-light: top-left; --luna-diagonal: 1; --luna-glint: 0;
  --luna-face: #e4e6d4;
  --luna-highlight: 1; --luna-shade: 0.72; --luna-hot: 0.624; --luna-press: 0.675; --luna-etch: 0; --luna-relief: 1;
}
.luna-custom[data-style="Metallic"] {
  --luna-light: top; --luna-diagonal: 0; --luna-glint: 0;
  --luna-face: #e0dfe3; --luna-text: #0e1010;
  --luna-highlight: 0.731; --luna-shade: 0.913; --luna-hot: 1; --luna-press: 0; --luna-etch: 1; --luna-relief: 0.686;
}
`;

// Whether the readout of the accessibility example speaks of the tab stop of a viewport.
const stop = (view: Element | null) => ((view as (HTMLElement & { viewport?: HTMLElement }) | null)?.viewport?.hasAttribute('tabindex') ? 'a tab stop (tabindex="0")' : 'not a tab stop, focus goes into the content');

// The markers of the script example: a list of objects (and an element), which wins over the selector.
const rulerStops = [
  { id: 'start', label: 'Start', position: 0 },
  { id: 'a', label: 'Result 1 (4 hits)', position: 320, data: { hits: 4 } },
  { id: 'b', label: 'Result 2 (1 hit)', position: 640, data: { hits: 1 } },
  { id: 'c', label: 'Result 3 (9 hits)', position: 900, data: { hits: 9 } },
  { id: 'end', label: 'End', position: 1170 }
];

const page: DocPage = {
  slug: 'scrollbar',
  name: 'Scrollbar',
  package: '@ax-design/scrollbar',
  globalName: 'AxScrollbar',
  tagline: 'Scrollbars that you style with CSS, for a container or for the whole page, with markers for places in the content.',
  intro: [
    'ax-scroll-view is a scroll container and ax-scrollbar draws the scrollbars of the page. The bars are an overlay over the content, and scrolling stays native, so the wheel, touch, the keys, find in page and scrollIntoView work as usual. The bars take no pointer events of their own. The component finds the bar under the pointer by geometry, so the content under a hidden bar keeps its hover and clicks.',
    'The default look is the Windows 8 (Modern UI) scrollbar, drawn from the numbers of the Windows 8.1 XAML templates and scaled by one token, the thickness. Every part of it is a shadow part, including the thumb, the buttons, the track, the markers and the hover card. This page has an example of each way to change it. You can style the parts with ::part() (Minimal, Windows 11, Cyber Punk), add a layer by configuration (the acrylic track of Windows 11), or replace the parts with classes of your own, a kit (Windows XP).',
    'Markers are ticks on the track for places in the content, such as headings or search hits, and a card lists their labels when the pointer comes near. Move the pointer over a preview to show its bars. They fade out after a moment. Every look on this page is a stylesheet from the package demo, so each preview shows what the package draws.'
  ],
  setup: "import { register } from '@ax-design/scrollbar';\nregister();",
  examples: [
    {
      id: 'windows-8',
      title: 'Windows 8',
      description: [
        'With no style at all the bars are the Windows 8 scrollbar. It has a 17px bar, a square thumb, 33px buttons with a chevron, a pale track, flat ticks for markers and a square card. Wrap the content in ax-scroll-view and give the element a height. Put padding on the content and keep it clear of the bar with --ax-scrollbar-vertical-size, which the component writes on the view.',
        'The drawing is sized from --ax-scrollbar-thickness. The thumb and the hovered marker fill the bar, and the buttons, the arrows and the markers are the same numbers scaled by thickness / 17px. Drag the slider to 8px, 17px and 24px and the whole bar follows.',
        'The hide attribute is a list of the parts a look never shows. A hidden part takes no room and no input, and each switch below adds one part to the list. The corner is the square where the two bars meet, so this example scrolls both ways. The markers are the headings, and a hover over one opens the card.'
      ],
      preview: light(' marker-selector="h2" marker-align="center" snap'),
      style: `${lightStyle}\n.body { width: 520px; box-sizing: border-box; }`,
      controls: [
        { key: 'thickness', label: 'Thickness', type: 'range', min: 8, max: 24, step: 1, unit: 'px', default: 17, target: { kind: 'css', property: '--ax-scrollbar-thickness', selector: 'ax-scroll-view' } },
        { key: 'hideButton', label: 'Hide the buttons', type: 'toggle', default: false, on: 'button ', off: '', target: { kind: 'css', property: '--hide-button', selector: 'ax-scroll-view' } },
        { key: 'hideTrack', label: 'Hide the track', type: 'toggle', default: false, on: 'track ', off: '', target: { kind: 'css', property: '--hide-track', selector: 'ax-scroll-view' } },
        { key: 'hideTrackPiece', label: 'Hide the track pieces', type: 'toggle', default: false, on: 'track-piece ', off: '', target: { kind: 'css', property: '--hide-track-piece', selector: 'ax-scroll-view' } },
        { key: 'hideCorner', label: 'Hide the corner', type: 'toggle', default: false, on: 'corner ', off: '', target: { kind: 'css', property: '--hide-corner', selector: 'ax-scroll-view' } },
        { key: 'hideMarker', label: 'Hide the markers', type: 'toggle', default: false, on: 'marker ', off: '', target: { kind: 'css', property: '--hide-marker', selector: 'ax-scroll-view' } },
        { key: 'hideCard', label: 'Hide the card', type: 'toggle', default: false, on: 'card ', off: '', target: { kind: 'css', property: '--hide-card', selector: 'ax-scroll-view' } },
        { key: 'click', label: 'Press on the track', type: 'select', options: ['page', 'jump'], default: 'page', target: { kind: 'attribute', attribute: 'track-click', selector: 'ax-scroll-view' } }
      ],
      // One switch per kind of part; together they are the value of hide.
      update: (root, values) => {
        const list = ['hideButton', 'hideTrack', 'hideTrackPiece', 'hideCorner', 'hideMarker', 'hideCard'].map((key) => values[key]).join('').trim();
        for (const view of root.querySelectorAll('ax-scroll-view')) view.setAttribute('hide', list);
      },
      code: [
        { language: 'html', source: '<ax-scroll-view marker-selector="h2" hide="{{hideButton}}{{hideTrack}}{{hideTrackPiece}}{{hideCorner}}{{hideMarker}}{{hideCard}}" track-click="{{click}}" style="height: 420px">\n  <article>\n    <h2>Introduction</h2>\n    ...\n  </article>\n</ax-scroll-view>' },
        { language: 'css', source: 'ax-scroll-view {\n  --ax-scrollbar-thickness: {{thickness}};\n}\n\nax-scroll-view > article {\n  padding-right: var(--ax-scrollbar-vertical-size);\n}' }
      ]
    },
    {
      id: 'minimal',
      title: 'Minimal',
      description: [
        'A whole look made of CSS on the default parts. It has a thumb that is 4 units thick at rest and widens to 10 while the bar is engaged, round markers, no track and no buttons. A unit is a fourteenth of the bar thickness, so the slider scales the whole bar. Each part of the bar is a shadow part, and ::part(thumb) matches the thumb of both bars. Host tokens such as --ax-scrollbar-thickness go on the element or an ancestor, and look inputs such as --ax-scrollbar-part-color and the shape properties of Surface go on the part.',
        "A rule of the page on ::part(x) wins over the part's own CSS whatever its specificity, and it replaces the default value of every property it sets, in every state of x. The state rules of the default theme for that property stop applying, so the states that should differ are written again after the rule, in the order rest, current, on thumb, hover, pressed. That is why the thumb rule below is followed by thumb-engaged, thumb-hover and thumb-pressed. What a rule does not set keeps the default value.",
        'The hot zone is the band along the outer edge of a bar where the pointer already counts as near the bar. Its depth is --ax-scrollbar-hotzone, and a percentage is a share of the thickness. While the slider is not at 0, the band is drawn in red over the example.'
      ],
      preview: `<div class="stage"><ax-scroll-view class="minimal" hide="button" touch="bar" marker-selector="h2" marker-align="center"><div class="body">${article(headings, 2)}</div></ax-scroll-view><div class="hotzone" data-axis="vertical"></div><div class="hotzone" data-axis="horizontal"></div></div>`,
      style: `${lightStyle}\n${minimalCss}\n.hotzone { position: absolute; display: none; z-index: 5; pointer-events: none; background: rgba(255, 0, 0, 0.3); }`,
      controls: [
        { key: 'thickness', label: 'Bar thickness', type: 'range', min: 8, max: 24, step: 1, unit: 'px', default: 14, target: { kind: 'css', property: '--ax-scrollbar-thickness', selector: 'ax-scroll-view' } },
        { key: 'hotzone', label: 'Hot zone', type: 'range', min: 0, max: 400, step: 25, unit: '%', default: 200, target: { kind: 'css', property: '--ax-scrollbar-hotzone', selector: 'ax-scroll-view' } }
      ],
      // The band the package uses: from the outer edge of the bar inward, max(0, px + percent / 100 *
      // thickness) deep, along the span of the bar. The view fills the example, so the bands are
      // placed from the tokens alone (no layout is read); whether a bar is there is the view's own
      // state attribute.
      update: (root, values) => {
        const view = root.querySelector('ax-scroll-view') as HTMLElement;
        const thickness = parseFloat(values.thickness) || 0;
        const match = /^(-?[\d.]+)(px|%)$/.exec(values.hotzone);
        const px = match && match[2] === 'px' ? Number(match[1]) : 0;
        const percent = match && match[2] === '%' ? Number(match[1]) : 0;
        const depth = Math.max(0, px + (percent / 100) * thickness);
        const place = () => {
          for (const band of root.querySelectorAll<HTMLElement>('.hotzone')) {
            const axis = band.dataset.axis as 'vertical' | 'horizontal';
            const shown = (view.getAttribute(`${axis}-state`) ?? '').split(' ').includes('visible');
            const box = band.style;
            box.display = shown && depth > 0 ? 'block' : 'none';
            if (axis === 'vertical') {
              box.right = '0';
              box.top = '0';
              box.bottom = '0';
              box.width = `${depth}px`;
            } else {
              box.left = '0';
              box.right = '0';
              box.bottom = '0';
              box.height = `${depth}px`;
            }
          }
        };
        place();
        // The state of the bars is written in the next frame.
        requestAnimationFrame(place);
      },
      code: [
        { language: 'html', source: '<ax-scroll-view class="minimal" hide="button" touch="bar" marker-selector="h2">\n  ...\n</ax-scroll-view>' },
        ...listing(minimalCss.replace('--ax-scrollbar-thickness: 14px;', '--ax-scrollbar-thickness: {{thickness}};').replace('--ax-scrollbar-hotzone: 200%;', '--ax-scrollbar-hotzone: {{hotzone}};'))
      ]
    },
    {
      id: 'windows-11',
      title: 'Windows 11',
      description: [
        'The WinUI 3 scrollbar. It is a 2px line at rest that grows into a 6px thumb, an acrylic track and arrow buttons under the pointer. It is the default parts styled with ::part() plus one layer added by configuration. track-layers="scrollbar-fill acrylic" names the layers the track draws with, in paint order, and the acrylic layer comes from @ax-design/acrylic. Naming layers replaces the list, so scrollbar-fill stays in it. The swatches pass under the track so that you can see the acrylic blur them.',
        'The three variants differ in attributes, and the stylesheet reads data-variant for what attributes cannot set. Default draws the track and the buttons only while the bar is engaged. Minimal is the thumb alone with touch="bar", shown by the pointer at the bar or by scrolling (indicator="near"). Full is the always expanded bar of Settings, Accessibility (indicator="pinned").'
      ],
      preview: win11Preview,
      style: win11Style,
      controls: [
        { key: 'variant', label: 'Variant', type: 'select', options: ['default', 'minimal', 'full'], default: 'default', target: { kind: 'attribute', attribute: 'data-variant', selector: 'ax-scroll-view' } }
      ],
      update: (root, values) => {
        const variants: Record<string, { hide: string; touch: string; indicator: string }> = {
          default: { hide: '', touch: 'indicator', indicator: 'auto' },
          minimal: { hide: 'button track corner', touch: 'bar', indicator: 'near' },
          full: { hide: '', touch: 'indicator', indicator: 'pinned' }
        };
        const variant = variants[values.variant] ?? variants.default;
        for (const view of root.querySelectorAll('ax-scroll-view')) {
          view.setAttribute('hide', variant.hide);
          view.setAttribute('indicator', variant.indicator);
          view.setAttribute('touch', variant.touch);
        }
      },
      code: [
        { language: 'html', source: '<ax-scroll-view class="win11"\n  data-variant="{{variant}}"\n  track-layers="scrollbar-fill acrylic"\n  hide="..." indicator="..." touch="...">\n  ...\n</ax-scroll-view>' },
        {
          language: 'js',
          source:
            "import { registerAcrylicLayer } from '@ax-design/acrylic';\nregisterAcrylicLayer();\n\n" +
            '// What a variant sets as attributes; the rest is CSS.\n' +
            'const variants = {\n' +
            "  default: { hide: '', indicator: 'auto', touch: 'indicator' },\n" +
            "  minimal: { hide: 'button track corner', indicator: 'near', touch: 'bar' },\n" +
            "  full: { hide: '', indicator: 'pinned', touch: 'indicator' }\n" +
            '};\n\n' +
            "const view = document.querySelector('.win11');\n" +
            "const variant = variants['{{variant}}'];\n" +
            "view.dataset.variant = '{{variant}}';\n" +
            "view.setAttribute('hide', variant.hide);\n" +
            "view.setAttribute('indicator', variant.indicator);\n" +
            "view.setAttribute('touch', variant.touch);"
        },
        {
          language: 'css',
          source:
            '.win11 {\n  --ax-scrollbar-thickness: 12px;\n  --ax-scrollbar-button-length: 15px;\n  --ax-scrollbar-expand-delay: 400ms;\n  --ax-scrollbar-contract-delay: 500ms;\n  /* the acrylic of the track */\n  --acrylic-tint-color: #fcfcfc;\n  --acrylic-tint-opacity: 0.85;\n  --acrylic-blur: 30px;\n}\n\n' +
            '/* 2px at rest, 6px engaged, hovered or pressed */\n.win11::part(thumb) {\n  --ax-radius: 50%;\n  --ax-scrollbar-part-size: 2px;\n  --ax-scrollbar-part-color: rgba(0, 0, 0, 0.447);\n}\n.win11::part(thumb-engaged),\n.win11::part(thumb-hover),\n.win11::part(thumb-pressed) {\n  --ax-scrollbar-part-size: 6px;\n}\n\n' +
            '/* invisible until the bar is engaged */\n.win11::part(track) {\n  --ax-radius: 6px;\n  --ax-scrollbar-part-color: transparent;\n  --ax-scrollbar-part-opacity: 0;\n}\n.win11::part(track-engaged) {\n  --ax-scrollbar-part-opacity: 1;\n}'
        }
      ]
    },
    {
      id: 'cyber-punk',
      title: 'Cyber Punk',
      description: [
        'Every part takes its outline from the Shape system of @ax-design/shape, which gives it a corner shape and a radius set on the part. Here the thumb, the track, the corner and the card use --ax-corner-shape: bevel, which cuts the radius off along both sides of a corner. Only two opposite corners are cut, and the other two are made square with the per-corner radii --ax-top-right-radius and --ax-bottom-left-radius.',
        'The markers are diamonds. A bevel whose radius is 50% cuts each corner at the midpoint of its sides at any size, and a part thickness of auto keeps the marker square as it grows. The glow of the card is the elevation layer, where --elevation-depth is its reach and --elevation-color its colour, here magenta. There is no kit and no subclass, and the bar is the default parts.'
      ],
      preview: cyberPreview,
      style: cyberStyle,
      controls: [
        { key: 'cut', label: 'Cut of the thumb', type: 'range', min: 0, max: 8, step: 1, unit: 'px', default: 4, target: { kind: 'css', property: '--cyber-cut', selector: 'ax-scroll-view' } },
        { key: 'glow', label: 'Glow of the card', type: 'color', alpha: true, default: 'rgba(255, 43, 214, 0.35)', target: { kind: 'css', property: '--cyber-glow', selector: 'ax-scroll-view' } }
      ],
      code: [
        { language: 'html', source: '<ax-scroll-view class="cyber" snap touch="bar" hide="button" marker-selector="h2">\n  ...\n</ax-scroll-view>' },
        ...listing(cyberCss.replace('--ax-radius: 4px;', '--ax-radius: {{cut}};').replace('--elevation-color: rgba(255, 43, 214, 0.35);', '--elevation-color: {{glow}};'))
      ]
    },
    {
      id: 'windows-xp',
      title: 'Windows XP',
      description: [
        'A kit replaces the parts themselves with classes of your own. Each kind has a contract class that draws nothing, and a kit class extends it and carries its look in its own shadow CSS, so nothing of the default look has to be switched off. The Windows XP (Luna) scrollbar ships with the package as such a kit. It has a raised thumb and arrow buttons with grip lines, an etched track, XP info tips and no fades.',
        'Import it from the subpath, define it once and pick it with kit="luna". Its colours come from a scheme, which is a class on the scroll view or on any ancestor, because custom properties inherit into the parts. adoptLunaSchemes() adds the stylesheet of the seven schemes to the document once. Blue, Olive Green and Silver are the schemes of Windows XP.'
      ],
      preview: lunaPreview('luna-blue'),
      style: lunaStyle,
      controls: [
        { key: 'scheme', label: 'Scheme', type: 'select', options: ['luna-blue', 'luna-olive', 'luna-silver', 'luna-purple', 'luna-orange', 'luna-pink', 'luna-gold'], default: 'luna-blue', target: { kind: 'attribute', attribute: 'class', selector: '[data-stage]' } }
      ],
      code: [
        {
          language: 'js',
          source:
            "import { register } from '@ax-design/scrollbar';\nimport { defineLunaKit, adoptLunaSchemes } from '@ax-design/scrollbar/kits/luna';\n\nregister();\ndefineLunaKit(); // defines the kit \"luna\"\nadoptLunaSchemes(); // adds the scheme classes to the document"
        },
        { language: 'html', source: '<div class="{{scheme}}">\n  <ax-scroll-view kit="luna" snap touch="bar" vertical="always" style="height: 420px">\n    ...\n  </ax-scroll-view>\n</div>' }
      ]
    },
    {
      id: 'luna-scheme',
      title: 'Custom Luna scheme',
      description: [
        'A scheme is a class of custom properties, so a scheme of your own is a class that sets them. --luna-accent-light is the colour of the thumb and the buttons at rest, and one colour recolours the whole scheme. The accent, the deep tone and the arrows are --luna-accent, --luna-accent-deep and --luna-glyph. A scheme that does not set them gets them from that colour. They keep its hue, and the arrows and the grip lines are a dark tone of it on a light colour and white on a dark one.',
        'The kit has two constructions. A Luna scheme is lit from the top left and takes the numbers of Blue. A Metallic scheme sets --luna-light to top and takes the numbers of Silver, a strong --luna-gloss and --luna-depth and a dark etched ring from --luna-etch. The numbers are contrast values from 0 to 1 and every colour of the parts is a tone with white and black laid over it by them. Choose a Style, then a colour, and change the gloss and the depth. The controls write onto the stage, over the class.'
      ],
      preview: lunaPreview('luna-custom', ' data-style="Luna"'),
      style: `${lunaStyle}\n${customStyle}`,
      controls: [
        {
          key: 'style',
          label: 'Style',
          type: 'select',
          options: ['Luna', 'Metallic'],
          default: 'Luna',
          target: { kind: 'attribute', attribute: 'data-style', selector: '[data-stage]' },
          sets: {
            Luna: { light: '#d3e6bf', gloss: 0.18, depth: 0.2 },
            Metallic: { light: '#d5dde8', gloss: 1, depth: 1 }
          }
        },
        { key: 'light', label: 'Light accent', type: 'color', default: '#d3e6bf', target: { kind: 'css', property: '--luna-accent-light', selector: '[data-stage]' } },
        { key: 'gloss', label: 'Gloss', type: 'range', min: 0, max: 1, step: 0.01, unit: '', default: 0.18, target: { kind: 'css', property: '--luna-gloss', selector: '[data-stage]' } },
        { key: 'depth', label: 'Depth', type: 'range', min: 0, max: 1, step: 0.01, unit: '', default: 0.2, target: { kind: 'css', property: '--luna-depth', selector: '[data-stage]' } }
      ],
      code: [
        {
          language: 'css',
          when: { key: 'style', value: 'Luna' },
          source:
            '.luna-custom {\n  --luna-light: top-left; --luna-diagonal: 1; --luna-glint: 0;\n  --luna-face: #e4e6d4; --luna-disabled: #f0f0e6;\n  --luna-highlight: 1; --luna-shade: 0.72; --luna-gloss: {{gloss}};\n  --luna-depth: {{depth}}; --luna-hot: 0.624; --luna-press: 0.675;\n  --luna-etch: 0; --luna-relief: 1;\n  /* the accent, the deep tone and the arrows follow from this */\n  --luna-accent-light: {{light}};\n}'
        },
        {
          language: 'css',
          when: { key: 'style', value: 'Metallic' },
          source:
            '.luna-custom {\n  --luna-light: top; --luna-diagonal: 0; --luna-glint: 0;\n  --luna-face: #e0dfe3; --luna-text: #0e1010; --luna-disabled: #f0f0e6;\n  --luna-highlight: 0.731; --luna-shade: 0.913; --luna-gloss: {{gloss}};\n  --luna-depth: {{depth}}; --luna-hot: 1; --luna-press: 0;\n  --luna-etch: 1; --luna-relief: 0.686;\n  /* the accent, the deep tone and the arrows follow from this */\n  --luna-accent-light: {{light}};\n}'
        },
        { language: 'html', source: '<div class="luna-custom">\n  <ax-scroll-view kit="luna" snap touch="bar">...</ax-scroll-view>\n</div>' }
      ]
    },
    {
      id: 'markers',
      title: 'Markers',
      description: [
        'With marker-selector, every matching element becomes a marker on the track, here each heading. Its id is the id of the element and its label is its text. The matches are read again when the content adds or removes nodes, and refreshMarkers() reads them after any other change. Press a marker to scroll it into the view, or rest the pointer on it and after --ax-scrollbar-card-delay a card opens with the labels.',
        'Markers closer than --ax-scrollbar-marker-spacing share one mark, and its card lists all of them, one per line. Raise the spacing and the nearest headings join. marker-align decides where a marker scrolls to and sits, either its center or its start edge, and marker-axis puts the markers on the horizontal bar. Style the card on ::part(card) with real CSS for its text.'
      ],
      preview: `<div class="stage"><ax-scroll-view marker-selector="h2" marker-align="center" snap><div class="body">${article(['Introduction', 'Setup', 'Install', 'Usage', 'Notes'], 1)}<h2>Tips</h2><h2>Tricks</h2>${article(['Reference'], 3)}</div></ax-scroll-view></div>`,
      style: lightStyle,
      controls: [
        { key: 'align', label: 'Marker alignment', type: 'select', options: ['center', 'start'], default: 'center', target: { kind: 'attribute', attribute: 'marker-align', selector: 'ax-scroll-view' } },
        { key: 'spacing', label: 'Marker spacing', type: 'range', min: 0, max: 80, step: 2, unit: 'px', default: 6, target: { kind: 'css', property: '--ax-scrollbar-marker-spacing', selector: 'ax-scroll-view' } },
        { key: 'delay', label: 'Card delay', type: 'range', min: 0, max: 1000, step: 50, unit: 'ms', default: 400, target: { kind: 'css', property: '--ax-scrollbar-card-delay', selector: 'ax-scroll-view' } }
      ],
      code: [
        { language: 'html', source: '<ax-scroll-view marker-selector="h2" marker-align="{{align}}" style="height: 420px">\n  <h2>Introduction</h2>\n  ...\n</ax-scroll-view>' },
        { language: 'css', source: 'ax-scroll-view {\n  --ax-scrollbar-marker-spacing: {{spacing}};\n  --ax-scrollbar-card-delay: {{delay}};\n}\n\nax-scroll-view::part(card) {\n  --ax-scrollbar-part-color: #fff;\n  --ax-scrollbar-part-border-color: #ccc;\n  --ax-border-width: 1px;\n  --elevation-depth: 8;\n  color: #222;\n  font: 12px/1.4 system-ui;\n  padding: 6px 10px;\n}' }
      ]
    },
    {
      id: 'markers-property',
      title: 'Markers from script',
      description: [
        'The markers property takes elements, a NodeList, marker objects or a mix, and it wins over marker-selector while it holds a list, even an empty one. null gives control back to the selector. A marker object has an id, a label, a position in scroll coordinates (or an element, whose start edge is the position), an axis and data of your own for the card of a kit. Use it for places that are not elements, such as search hits.',
        'The component dispatches markerenter, markerleave and markeractivate on the element. They bubble, and detail has the marker of the mark and all the markers that share it. Cancel markeractivate with preventDefault() to do the jump yourself. The line under the view shows the last event.'
      ],
      preview: `<div class="stage"><ax-scroll-view class="ruler" marker-selector="h2"><div class="body"><h2 style="top: 0">Heading A</h2><h2 style="top: 410px">Heading B</h2><h2 style="top: 800px">Heading C</h2></div></ax-scroll-view><output class="log">no marker event yet</output></div>`,
      style: `${lightStyle}
ax-scroll-view { inset: 0 0 28px 0; }
.body { position: relative; height: 1200px; padding: 0; background: repeating-linear-gradient(#f2f2f2 0 100px, #fff 100px 200px); }
.body h2 { position: absolute; left: 16px; margin: 0; }
.log { position: absolute; left: 0; right: 0; bottom: 0; height: 28px; padding: 0 12px; display: flex; align-items: center; background: #1b1b1b; color: #fff; font: 12px "Segoe UI", system-ui, sans-serif; }
`,
      controls: [
        { key: 'source', label: 'Markers from', type: 'select', options: ['markers property', 'marker-selector'], default: 'markers property', target: { kind: 'attribute', attribute: 'data-source', selector: 'ax-scroll-view' } }
      ],
      setup: (root) => {
        const view = root.querySelector('ax-scroll-view') as HTMLElement & { markers: unknown };
        const log = root.querySelector('.log') as HTMLElement;
        const show = (event: Event) => {
          const { marker, markers } = (event as CustomEvent<{ marker: { label: string }; markers: unknown[] }>).detail;
          log.textContent = `${event.type}: ${marker.label}${markers.length > 1 ? ` (+${markers.length - 1})` : ''}`;
        };
        const events = ['markerenter', 'markerleave', 'markeractivate'];
        for (const name of events) view.addEventListener(name, show);
        return () => {
          for (const name of events) view.removeEventListener(name, show);
        };
      },
      update: (root, values) => {
        const view = root.querySelector('ax-scroll-view') as HTMLElement & { markers: unknown };
        view.markers = values.source === 'markers property' ? rulerStops : null;
      },
      code: [
        {
          language: 'js',
          source:
            "const view = document.querySelector('ax-scroll-view');\n\n" +
            "// '{{source}}' is in charge.\n" +
            'view.markers = [\n' +
            "  { id: 'start', label: 'Start', position: 0 },\n" +
            "  { id: 'a', label: 'Result 1 (4 hits)', position: 320, data: { hits: 4 } },\n" +
            "  { id: 'setup', label: 'Setup', element: document.getElementById('setup') },\n" +
            "  document.getElementById('summary')\n" +
            '];\n' +
            'view.markers = null; // back to marker-selector'
        },
        {
          language: 'js',
          source:
            "view.addEventListener('markeractivate', (event) => {\n  // Cancel the jump and scroll to it yourself.\n  event.preventDefault();\n  const { marker, markers } = event.detail;\n  view.scrollTo({ top: marker.position, behavior: 'smooth' });\n});"
        }
      ]
    },
    {
      id: 'touch',
      title: 'Touch',
      description: [
        'touch="indicator", the default, shows the thumb alone as a panning indicator that takes no touch input.',
        'touch="bar" makes the bars look and work on touch as they do with a mouse.',
        'With the indicator the buttons, the track and the corner are left out while it shows and while it fades out, and the page scrolls under a finger as usual. With the bar, a finger that comes down on a bar or in its hot zone belongs to the bar and decides after 5px. Steeply along the bar it drags, relative to where it is, and across it nothing more happens. A quick tap glides to the tapped place or activates the marker under it.',
        'The hovered marker and its card stay for --ax-scrollbar-touch-idle-delay after the finger lifts. Style the touch indicator on its own with the attribute the component writes, ax-scroll-view[last-indicator="touch"]::part(thumb), which stays set while the bars fade out. Try it with a finger. With a pointer this example behaves as it does with the mouse.'
      ],
      preview: light(' touch="indicator" marker-selector="h2" indicator="auto"'),
      style: lightStyle,
      controls: [{ key: 'touch', label: 'Touch', type: 'select', options: ['indicator', 'bar'], default: 'indicator', target: { kind: 'attribute', attribute: 'touch', selector: 'ax-scroll-view' } }],
      code: [
        { language: 'html', source: '<ax-scroll-view touch="{{touch}}" marker-selector="h2">\n  ...\n</ax-scroll-view>' },
        { language: 'css', source: 'ax-scroll-view {\n  --ax-scrollbar-touch-idle-delay: 500ms;\n}\n\n/* the panning indicator, a thin thumb */\nax-scroll-view[last-indicator="touch"]::part(thumb) {\n  --ax-scrollbar-part-size: 2px;\n}' }
      ]
    },
    {
      id: 'focus',
      title: 'Keyboard focus',
      description: [
        'The bars are for the pointer. They and the cards are aria-hidden, have no role and are not in the tab order, so the accessibility tree shows only the content. Give links or buttons for the same destinations as the markers. The element has no role or label of its own, so add them as for any element, as role="region" and aria-label below.',
        'The viewport is a real scroll container and takes focus (tabindex="0") only while nothing inside it can. A text-only region stays scrollable by keys, and a region with links, buttons or fields adds no tab stop of its own, because focus goes into the content and the arrow and page keys scroll from there. The choice follows changes of the content and of the attributes that decide focus. Disable the button and the second view becomes a tab stop.',
        'With forced colors (forced-colors: active) the overlay is hidden and the native scrollbars come back, and so they do when printing. With prefers-reduced-motion: reduce there is no glide and no thumb lag, parts change look at once, and the default card drops its movement and closes by itself. The Accessibility column of this page shows both.'
      ],
      preview: `<div class="stage"><div class="pane"><ax-scroll-view role="region" aria-label="Text only"><div class="body"><h2>Text only</h2>${article(['A'], 3)}</div></ax-scroll-view><output class="one"></output></div><div class="pane"><ax-scroll-view role="region" aria-label="With a button"><div class="body"><h2>With a button</h2><p><button>Open</button></p>${article(['B'], 2)}</div></ax-scroll-view><output class="two"></output></div></div>`,
      style: `${lightStyle}
.stage { display: grid; grid-template-rows: 1fr 1fr; }
.pane { position: relative; border-bottom: 1px solid #ddd; }
.pane ax-scroll-view { inset: 0 0 24px 0; }
output { position: absolute; left: 0; right: 0; bottom: 0; height: 24px; padding: 0 12px; display: flex; align-items: center; background: #1b1b1b; color: #fff; font: 11px "Segoe UI", system-ui, sans-serif; }
.body h2 { font-size: 15px; }
.body p { margin-bottom: 10px; }
`,
      controls: [{ key: 'disabled', label: 'Disable the button', type: 'toggle', default: false, target: { kind: 'attribute', attribute: 'disabled', selector: 'button' } }],
      setup: (root) => {
        const views = root.querySelectorAll('ax-scroll-view');
        const report = () => {
          (root.querySelector('.one') as HTMLElement).textContent = `Text only: ${stop(views[0])}`;
          (root.querySelector('.two') as HTMLElement).textContent = `With a button: ${stop(views[1])}`;
        };
        report();
        const observer = new MutationObserver(() => requestAnimationFrame(report));
        for (const view of views) {
          const viewport = (view as HTMLElement & { viewport?: HTMLElement }).viewport;
          if (viewport) observer.observe(viewport, { attributes: true, attributeFilter: ['tabindex'] });
        }
        return () => observer.disconnect();
      },
      code: [
        { language: 'html', source: '<ax-scroll-view role="region" aria-label="Release notes" style="height: 420px">\n  <article>...</article>\n</ax-scroll-view>' },
        {
          language: 'css',
          source:
            '/* Forced colors and print bring the native bars back, so keep\n   no extra room for the overlay then. */\n@media (forced-colors: active) {\n  ax-scroll-view > article {\n    padding-right: 0;\n  }\n}\n\n/* Reduced motion: the component drops its own motion; drop yours. */\n@media (prefers-reduced-motion: reduce) {\n  ax-scroll-view::part(card) {\n    transition: none;\n  }\n}'
        }
      ]
    },
    {
      id: 'own-kit',
      title: 'Writing a kit',
      description: [
        'A kit is a named set of part classes. defineScrollbarKit(name, kit) takes a class for any of thumb, button, track, trackPiece, corner, marker and card, and a default for hide. Each class extends the contract class of its kind, which draws nothing (AxScrollbarThumb and the others), or the default class of the kind (AxScrollbarDefaultThumb), and carries its look in its own shadow root as static styles. The bars keep deciding where a part sits along the bar and how long it is. The kinds a kit leaves out are the default classes.',
        'A class reads its state in the CSS as attributes of the host, such as :host([hover]), :host([pressed]), :host([axis="horizontal"]), :host([direction="start"]), :host([disabled]) and :host([rtl]), or in script as partState with stateChanged(). The thumb below is one class, and the colour and the inset are custom properties that inherit into it. An author\'s ::part() rules still win over the CSS of a kit.',
        'A class that does not extend the contract class of its kind throws a TypeError before anything is defined, so a bad kit leaves nothing behind, and defining a name twice throws as well. In TypeScript the fields of ScrollbarKit are typed as PartClass, so a wrong class does not compile. The line under the view is the error the page got when it defined a kit with a thumb that is not a thumb.'
      ],
      preview: `<div class="stage"><ax-scroll-view kit="slab" snap marker-selector="h2"><div class="body">${article(['Slab', 'Kit', 'Thumb'], 2)}</div></ax-scroll-view><output class="log"></output></div>`,
      style: `${lightStyle}
ax-scroll-view { inset: 0 0 40px 0; }
.log { position: absolute; left: 0; right: 0; bottom: 0; height: 40px; padding: 0 12px; display: flex; align-items: center; background: #1b1b1b; color: #fff; font: 11px/1.3 "Segoe UI", system-ui, sans-serif; }
`,
      controls: [
        { key: 'color', label: 'Thumb colour', type: 'color', default: 'rgb(136, 136, 136)', target: { kind: 'css', property: '--slab-color', selector: 'ax-scroll-view' } },
        { key: 'inset', label: 'Thumb inset', type: 'range', min: 0, max: 7, step: 1, unit: 'px', default: 3, target: { kind: 'css', property: '--slab-inset', selector: 'ax-scroll-view' } }
      ],
      setup: (root) => {
        const log = root.querySelector('.log') as HTMLElement;
        let gone = false;
        import('@ax-design/scrollbar').then(({ AxScrollbarThumb, defineScrollbarKit, hasScrollbarKit }) => {
          if (gone) return;
          if (!hasScrollbarKit('slab')) {
            class SlabThumb extends AxScrollbarThumb {
              static styles = `
                :host { background: var(--slab-color, #888); margin: 0 var(--slab-inset, 3px); }
                :host([axis="horizontal"]) { margin: var(--slab-inset, 3px) 0; }
                :host([pressed]) { background: rgb(0, 120, 215); }
              `;
            }
            defineScrollbarKit('slab', { thumb: SlabThumb, hide: '' });
          }
          try {
            defineScrollbarKit('slab-bad', { thumb: class {} as never });
          } catch (error) {
            log.textContent = `${(error as Error).name}: ${(error as Error).message}`;
          }
        });
        return () => {
          gone = true;
        };
      },
      code: [
        {
          language: 'js',
          source:
            "import { AxScrollbarThumb, defineScrollbarKit } from '@ax-design/scrollbar';\n\nclass SlabThumb extends AxScrollbarThumb {\n  static styles = `\n    :host { background: {{color}}; margin: 0 {{inset}}; }\n    :host([axis=\"horizontal\"]) { margin: {{inset}} 0; }\n    :host([pressed]) { background: rgb(0, 120, 215); }\n  `;\n}\n\ndefineScrollbarKit('slab', { thumb: SlabThumb, hide: '' });"
        },
        { language: 'html', source: '<ax-scroll-view kit="slab" style="height: 420px">...</ax-scroll-view>' },
        {
          language: 'js',
          source:
            "import { isPartClass } from '@ax-design/scrollbar';\n\nisPartClass(SlabThumb, 'thumb'); // true\n\n// The type check: not a thumb.\ndefineScrollbarKit('bad', { thumb: class {} });\n// TypeError, and nothing is defined"
        }
      ]
    }
  ],
  reference: [
    { name: 'vertical', kind: 'attribute', type: 'auto | always | hidden', default: 'auto', description: 'auto: the bar shows while there is something to scroll. always: it always shows, disabled when nothing scrolls. hidden: it never shows.' },
    { name: 'horizontal', kind: 'attribute', type: 'auto | always | hidden', default: 'auto', description: 'As vertical, for the horizontal bar.' },
    { name: 'hide', kind: 'attribute', type: 'list of parts', default: '(empty)', description: 'The parts a look never shows, as a space-separated list of thumb, button, track (with its pieces), track-piece, corner, marker and card. A hidden part takes no room and no input. Unknown names are ignored. Even an empty value overrides the default, and a kit gives its own default.' },
    { name: 'indicator', kind: 'attribute', type: 'auto | near | pinned', default: 'auto', description: 'auto: the bars show on every move over the scroller. near: only for a pointer at a bar, or while scrolling (always so on ax-scrollbar). pinned: the bars always show.' },
    { name: 'track-click', kind: 'attribute', type: 'page | jump', default: 'page', description: 'A press on the track pages toward the pointer, repeating while held, or with jump scrolls to the pointer.' },
    { name: 'touch', kind: 'attribute', type: 'indicator | bar', default: 'indicator', description: 'What the bars are on touch. indicator shows the thumb alone as a panning indicator that takes no input and leaves out the buttons, the track and the corner. bar makes the bars look and work as they do with a mouse, so a finger on a bar drags it and a tap on the track glides to the tapped place.' },
    { name: 'snap', kind: 'attribute', type: 'boolean', default: 'false', description: 'Thumb edges and markers on whole device pixels, for looks that reproduce a desktop control. Leave it off for vector looks.' },
    { name: 'suspended', kind: 'attribute', type: 'boolean', default: 'false', description: 'Fades the bars out and makes them ignore input, for a lightbox over the page. Remove it and they show again.' },
    { name: 'kit', kind: 'attribute', type: 'kit name', description: 'Builds the parts with the kit of that name, made with defineScrollbarKit() or defineLunaKit(). A change of kit rebuilds the bars, and a kit may be defined after the element.' },
    { name: 'marker-selector', kind: 'attribute', type: 'CSS selector', description: 'Makes a marker for each matching element, with the id of the element and its text as the label.' },
    { name: 'marker-axis', kind: 'attribute', type: 'vertical | horizontal', default: 'vertical', description: 'The axis of the markers made from elements.' },
    { name: 'marker-align', kind: 'attribute', type: 'center | start', default: 'center', description: 'Where a marker scrolls to, and where it sits on the track.' },
    { name: 'thumb-layers', kind: 'attribute', type: 'layer names', description: 'The layers a kind of part draws with, in paint order. Likewise button-layers, track-layers, track-piece-layers, corner-layers, marker-layers and card-layers. Defaults: scrollbar-fill, scrollbar-fill scrollbar-glyph for a button, scrollbar-fill elevation for a card. Naming layers replaces the list.' },
    { name: 'indicator-state', kind: 'attribute', type: 'none | mouse | touch', description: 'Written by the component, for you to select on: the indicator that shows.' },
    { name: 'last-indicator', kind: 'attribute', type: 'mouse | touch', description: 'Written by the component: the indicator shown, or shown last while the bars fade out. Style per indicator with this, so the look stays during the fade.' },
    { name: 'vertical-state', kind: 'attribute', type: 'list of states', description: 'Written by the component, also horizontal-state: a list of visible, disabled, hover, near, engaged and pressed. Select with ~=.' },
    { name: '--ax-scrollbar-thickness', kind: 'property', type: '<length>', default: '17px', description: 'The thickness of a bar. The default look is sized from it: the thumb and the hovered marker fill the bar, the rest scales with thickness / 17px.' },
    { name: '--ax-scrollbar-padding', kind: 'property', type: '<length>', default: '0px', description: 'Space between the edges of the bar and its buttons and track.' },
    { name: '--ax-scrollbar-thumb-min-length', kind: 'property', type: '<length>', default: '48px', description: 'The shortest thumb (17px while the touch indicator shows).' },
    { name: '--ax-scrollbar-button-length', kind: 'property', type: '<length> | auto', default: '33/17 of the thickness', description: 'The length of a button along the axis; auto is a square. Not registered: unset, it is the proportion.' },
    { name: '--ax-scrollbar-hotzone', kind: 'property', type: '<length> | <percentage>', default: '0px', description: 'The depth of the hot zone inside the outer edge of a bar; percentages are of the thickness. A bar with a hot zone shows when the pointer comes near it, and takes the near state.' },
    { name: '--ax-scrollbar-line', kind: 'property', type: '<length>', default: '40px', description: 'The scroll of a button press. A track page is the view minus one line.' },
    { name: '--ax-scrollbar-idle-delay', kind: 'property', type: '<time>', default: '3s', description: 'How long the mouse indicator lingers before it fades out.' },
    { name: '--ax-scrollbar-touch-idle-delay', kind: 'property', type: '<time>', default: '500ms', description: 'How long the touch indicator, its hovered marker and its card linger.' },
    { name: '--ax-scrollbar-scroll-smoothing', kind: 'property', type: '<time>', default: '50ms', description: 'The glide of the scrolls the bars start. A wheel, touch, key or script scroll stops it.' },
    { name: '--ax-scrollbar-thumb-smoothing', kind: 'property', type: '<time>', default: '100ms', description: 'The lag of the drawn thumb, track pieces and markers behind the scroll.' },
    { name: '--ax-scrollbar-repeat-delay', kind: 'property', type: '<time>', default: '250ms', description: 'The wait before a held press repeats. --ax-scrollbar-repeat-interval (50ms) is the time between repeats.' },
    { name: '--ax-scrollbar-expand-delay', kind: 'property', type: '<time>', default: '0s', description: 'How long the bar must be engaged before parts take engaged. --ax-scrollbar-contract-delay (0s) is how long it must be idle before they leave it.' },
    { name: '--ax-scrollbar-state-smoothing', kind: 'property', type: '<time>', default: '0s', description: 'Colour and size change on hover, press and engaged. A time constant: 63% of the way after one.' },
    { name: '--ax-scrollbar-fade-smoothing', kind: 'property', type: '<time>', default: '75ms', description: 'The fade of the parts when the bars show or hide.' },
    { name: '--ax-scrollbar-fade-in-duration', kind: 'property', type: '<time>', default: '250ms', description: 'A linear fade in, and --ax-scrollbar-fade-out-duration (167ms) out; a card fades with them. 0s leaves it to the fade smoothing.' },
    { name: '--ax-scrollbar-slide-smoothing', kind: 'property', type: '<time>', default: '160ms', description: 'The slide of parts in from the outer edge.' },
    { name: '--ax-scrollbar-slide-distance', kind: 'property', type: '<length>', default: '0px', description: 'How far a hidden part sits toward the outer edge; negative slides from the content side.' },
    { name: '--ax-scrollbar-marker-spacing', kind: 'property', type: '<length>', default: '6px', description: 'Markers closer than this share one mark.' },
    { name: '--ax-scrollbar-marker-reach', kind: 'property', type: '<length>', default: '12px', description: 'How far from the center of a marker the pointer still hits it.' },
    { name: '--ax-scrollbar-card-gap', kind: 'property', type: '<length>', default: '12px', description: 'The distance between a card and the bar.' },
    { name: '--ax-scrollbar-card-delay', kind: 'property', type: '<time>', default: '400ms', description: 'The wait on a marker before the first card opens.' },
    { name: '--ax-scrollbar-card-slide-duration', kind: 'property', type: '<time>', default: '367ms', description: 'The slide of an opening card. --ax-scrollbar-card-slide-distance (12px) is how far it slides; 0px for none.' },
    { name: '--ax-scrollbar-vertical-size', kind: 'property', type: '<length>', default: '0px', description: 'Written by the component on the host, read-only, with --ax-scrollbar-horizontal-size: the thickness of the bar that is shown, 0px while it is not. Use it to keep the content clear of the bar.' },
    { name: '--ax-scrollbar-z-index', kind: 'property', type: '<integer>', default: '2147483000', description: 'The stacking of ax-scrollbar. Not registered, read with var(); a page with modals can put the bars under them.' },
    { name: '::part(thumb)', kind: 'property', type: 'shadow part', description: 'The part you drag. The others are scrollbar, scrollbar-vertical, scrollbar-horizontal, button (-start, -end), track, track-piece (-start, -end), corner, marker, card and card-content, and viewport and content on ax-scroll-view. ::part(thumb) matches both axes, ::part(thumb-vertical) one, and a list matches a part with all the names: ::part(marker-on-thumb marker-hover).' },
    { name: '::part(thumb-hover)', kind: 'property', type: 'state part', description: 'States of every kind, as <kind>-hover, -pressed, -engaged and -disabled, plus marker-current, marker-on-thumb and for the card card-enter, card-open, card-exit, card-forward, card-backward, card-first and card-swap. Also set as attributes on the part element: hover, pressed, engaged, disabled, rtl, on-thumb, current, axis, direction.' },
    { name: '--ax-scrollbar-part-color', kind: 'property', type: '<color>', default: 'transparent', description: 'The fill colour of a part. Set it on ::part(), where it is registered, typed and not inherited. --ax-scrollbar-part-border-color (transparent) is its border and --ax-scrollbar-part-glyph-color (transparent) the arrow of a button.' },
    { name: '--ax-scrollbar-part-size', kind: 'property', type: '<length>', default: '0px', description: 'The size across the bar: the thickness of the thumb, the width of a marker. --ax-scrollbar-part-thickness (auto, a dot) is the size of a marker along the bar.' },
    { name: '--ax-scrollbar-part-opacity', kind: 'property', type: '<number>', default: '1', description: 'The opacity of a part while the bars are shown.' },
    { name: '--ax-scrollbar-part-align', kind: 'property', type: '<number>', default: '0.5', description: 'Where the thumb sits across the bar: 0 the inner edge, 1 the outer edge. Not animated.' },
    { name: '--ax-scrollbar-part-fill-clip', kind: 'property', type: 'border-box | padding-box', default: 'border-box', description: 'Whether the fill stops at the inner edge of the border.' },
    { name: '--ax-scrollbar-part-lines', kind: 'property', type: '<number>', default: '2', description: 'The lines a label of the card may take.' },
    { name: '--ax-scrollbar-glyph-shape', kind: 'property', type: 'chevron | triangle', description: 'The arrow of a button, set on ::part(button) with --ax-scrollbar-part-glyph-scale (1), --ax-scrollbar-glyph-width, -height, -thickness, -offset and -corner-radius.' },
    { name: 'markers', kind: 'property', type: 'ScrollMarker[] | null', default: 'null', description: 'Markers set from script: elements, a NodeList, marker objects (id, label, axis, position, element, data), or a mix. They win over marker-selector while they hold a list; null gives control back to the selector.' },
    { name: 'viewport', kind: 'property', type: 'HTMLElement', description: 'ax-scroll-view only: the element that really scrolls. The view has the scroll API of an element, scrollTop, scrollLeft, scrollHeight, scrollWidth, scrollTo(), scrollBy() and scroll(), acting on it, and dispatches scroll and scrollend itself.' },
    { name: 'refresh()', kind: 'method', type: '() => void', description: 'Lays the bars out on the next frame. A change of a token applies without it; call it for other changes you made from script.' },
    { name: 'refreshMarkers()', kind: 'method', type: '() => void', description: 'Collects and measures the markers again on the next frame, after a change the component cannot see.' },
    { name: 'register()', kind: 'method', type: '() => void', description: 'Defines ax-scroll-view, ax-scrollbar, the default parts, the scrollbar-fill, scrollbar-glyph and elevation layers and ax-surface. Safe to call more than once.' },
    { name: 'defineScrollbarKit()', kind: 'method', type: '(name: string, kit: ScrollbarKit) => void', description: 'Defines a kit by name, used with the kit attribute. A class that does not extend the contract class of its kind throws a TypeError; defining a name twice throws. hasScrollbarKit(name) looks one up.' },
    { name: 'AxScrollbarThumb', kind: 'method', type: 'contract class', description: 'Contract classes draw nothing: AxScrollbarThumb, AxScrollbarButton, AxScrollbarTrack, AxScrollbarTrackPiece, AxScrollbarCorner, AxScrollbarMarker and AxScrollbarCard. Default classes are AxScrollbarDefault plus the kind, the Windows 8 look. AxScrollbarPart is the base of all, and isPartClass(cls, kind) tests a class.' },
    { name: 'static styles', kind: 'property', type: 'string', description: 'On a part class: CSS in the shadow root of the part, reading its state as :host([hover]), :host([pressed]), :host([axis="vertical"]), :host([direction="start"]), :host([disabled]) and :host([rtl]). partState and stateChanged(prev, next) are the same in script.' },
    { name: 'defineLunaKit()', kind: 'method', type: '() => void', description: 'From @ax-design/scrollbar/kits/luna: defines the kit "luna", the Windows XP scrollbar. adoptLunaSchemes(root = document) adopts the stylesheet of the schemes once into a document or a shadow root, and lunaSchemes is that stylesheet as a string.' },
    { name: '.luna-blue', kind: 'property', type: 'scheme class', description: 'The schemes: luna-blue, luna-olive, luna-silver, luna-purple, luna-orange, luna-pink and luna-gold, on the scroll view or any ancestor. A scheme sets the tones --luna-accent-light, --luna-face and --luna-disabled, the numbers --luna-highlight, -shade, -gloss, -depth, -hot, -press and -etch, --luna-light (top-left, or top for a metallic scheme), and --luna-diagonal and --luna-glint (0 or 1). --luna-accent, -accent-deep and --luna-glyph may be auto, which is what they are when a scheme leaves them out, and are then derived from --luna-accent-light.' },
    { name: '--ax-scrollbar-thumb-nudge', kind: 'property', type: '<length>', description: 'Set on the thumb while snap is set. The distance that something drawn inside the thumb adds to its place along the bar to land on whole device pixels, which the grip lines of the Luna kit use at a zoom of 110%, 125% or 150%.' },
    { name: 'markeractivate', kind: 'event', type: 'CustomEvent', description: 'A press on a marker released with under 4px of movement. Cancelable: preventDefault() stops the jump to the marker. detail is { marker, markers }.' },
    { name: 'markerenter', kind: 'event', type: 'CustomEvent', description: 'The pointer moves onto a marker. detail is { marker, markers }, the markers sharing the mark.' },
    { name: 'markerleave', kind: 'event', type: 'CustomEvent', description: 'The pointer leaves the last marker it was on; moving straight to another fires markerenter only.' }
  ]
};

export default page;
