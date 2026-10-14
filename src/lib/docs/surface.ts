import type { DocPage } from './types';

// One surface in the middle of the preview.
const stage = (label: string, attributes = '') =>
  `<div class="stage"><ax-surface class="shape" layers="fill reveal"${attributes}><span>${label}</span></ax-surface></div>`;

const stageStyle = `
.stage { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
.shape { width: 200px; height: 140px; color: #fff; --ax-fill-color: rgba(255, 255, 255, 0.14); --ax-border-color: rgba(255, 255, 255, 0.7); --ax-border-width: 2px; --reveal-color: rgb(255, 255, 255); --reveal-opacity: 0.35; }
.shape span { display: flex; height: 100%; align-items: center; justify-content: center; font-size: 15px; }
`;

const page: DocPage = {
  slug: 'surface',
  name: 'Surface',
  package: '@ax-design/surface',
  globalName: 'AxSurface',
  tagline: 'The box every effect of Axiom draws on: it owns the shape, the tilt and the frame scheduler.',
  intro: [
    'A surface is the box that every visual effect of Axiom Design System draws on. Wrap your element with ax-surface, pick the layers you need in the layers attribute, and shape it with custom properties: corners, edge features, border and tilt. Your content is always on top of the layers.',
    'The Playground (/playground) has every property and many ready-made shapes. Underneath, Shape computes the outline and Typed OM reads the custom properties. This page shows the properties one idea at a time.',
    'Shape properties are not inherited, so set them on the ax-surface element itself. Surfaces only work while they are visible and read their styles only after something changed.'
  ],
  setup: "import { register } from '@ax-design/surface';\nregister();",
  examples: [
    {
      id: 'corners',
      title: 'Corners',
      description: [
        'The radius sets every corner. Percentages are relative to the shorter side, and like border-radius, radii that do not fit are scaled down.',
        'The corner shape has the same keywords as the CSS corner-shape property: round, bevel, scoop and notch. Bevel, scoop and notch corners meet the sides in sharp points; the shoulder radius rounds those points.'
      ],
      preview: stage('Corners'),
      style: stageStyle,
      controls: [
        { key: 'radius', label: 'Radius', type: 'range', min: 0, max: 50, step: 1, unit: '%', default: 30, target: { kind: 'css', property: '--ax-radius', selector: '.shape' } },
        { key: 'shape', label: 'Corner shape', type: 'select', options: ['round', 'bevel', 'scoop', 'notch'], default: 'scoop', target: { kind: 'css', property: '--ax-corner-shape', selector: '.shape' } },
        { key: 'shoulder', label: 'Shoulder radius', type: 'range', min: 0, max: 30, step: 1, unit: 'px', default: 0, target: { kind: 'css', property: '--ax-corner-shoulder-radius', selector: '.shape' } }
      ],
      code: [
        { language: 'html', source: '<ax-surface class="shape" layers="fill">...</ax-surface>' },
        { language: 'css', source: '.shape {\n  --ax-radius: {{radius}};\n  --ax-corner-shape: {{shape}};\n  --ax-corner-shoulder-radius: {{shoulder}};\n}' }
      ]
    },
    {
      id: 'single-corners',
      title: 'Moved corners',
      description: [
        'Every corner can have its own radius, shape and shoulder radius, for example --ax-top-left-radius and --ax-corner-top-left-shape. A corner that sets nothing uses the general value.',
        'A corner can also move into the shape. Positive shifts move the corner toward the middle of the shape: shift the top left and the bottom right corners on x and you get a trapezoid or a parallelogram, depending on the two values. Percentages are relative to the width for x and to the height for y. Negative values move the corner out of the box.'
      ],
      preview: stage('Parallelogram'),
      style: stageStyle,
      controls: [
        { key: 'tl', label: 'Top left, shift x', type: 'range', min: -30, max: 40, step: 1, unit: '%', default: 20, target: { kind: 'css', property: '--ax-corner-top-left-shift-x', selector: '.shape' } },
        { key: 'br', label: 'Bottom right, shift x', type: 'range', min: -30, max: 40, step: 1, unit: '%', default: 20, target: { kind: 'css', property: '--ax-corner-bottom-right-shift-x', selector: '.shape' } },
        { key: 'tr', label: 'Top right, radius', type: 'range', min: 0, max: 70, step: 1, unit: 'px', default: 0, target: { kind: 'css', property: '--ax-top-right-radius', selector: '.shape' } }
      ],
      code: [
        {
          language: 'css',
          source: '.shape {\n  --ax-corner-top-left-shift-x: {{tl}};\n  --ax-corner-bottom-right-shift-x: {{br}};\n  --ax-top-right-radius: {{tr}};\n}'
        }
      ]
    },
    {
      id: 'edges',
      title: 'Edge features',
      description: [
        'Each side can carry a feature: a bump or a notch. The kind is arc (circular), rect, triangle, trapezoid or cusp. Cusp is two arcs that meet in a point: pointing in it pinches the side, pointing out it makes a pointed arch.',
        'Depth is how far the feature goes: positive values go out of the shape, negative values go into it. Span is its width along the side. At is where its middle sits; sides run clockwise, so the top goes from left to right. This example uses the top side.'
      ],
      preview: stage('Top edge'),
      style: stageStyle,
      controls: [
        { key: 'kind', label: 'Kind', type: 'select', options: ['flat', 'arc', 'rect', 'triangle', 'trapezoid', 'cusp'], default: 'arc', target: { kind: 'css', property: '--ax-edge-top-kind', selector: '.shape' } },
        { key: 'depth', label: 'Depth', type: 'range', min: -40, max: 40, step: 1, unit: 'px', default: -20, target: { kind: 'css', property: '--ax-edge-top-depth', selector: '.shape' } },
        { key: 'span', label: 'Span', type: 'range', min: 5, max: 100, step: 1, unit: '%', default: 40, target: { kind: 'css', property: '--ax-edge-top-span', selector: '.shape' } }
      ],
      code: [
        { language: 'css', source: '.shape {\n  --ax-edge-top-kind: {{kind}};\n  --ax-edge-top-depth: {{depth}};\n  --ax-edge-top-span: {{span}};\n  --ax-edge-top-at: 50%;\n}' }
      ]
    },
    {
      id: 'shared-edges',
      title: 'All sides at once',
      description: [
        'The --ax-edge-* properties without a side set the feature of all four sides. A side that sets its own value, like --ax-edge-top-depth, wins over them.',
        'Sides run clockwise, so the same --ax-edge-at on every side turns each feature the same way around the shape. The result has rotational symmetry, not mirror symmetry. The tip radius rounds the point of a cusp.'
      ],
      preview: stage('Cookie'),
      style: `${stageStyle}.shape { width: 180px; height: 180px; --ax-radius: 30%; --ax-edge-span: 100%; }`,
      controls: [
        { key: 'kind', label: 'Kind', type: 'select', options: ['cusp', 'arc', 'triangle', 'trapezoid', 'rect'], default: 'cusp', target: { kind: 'css', property: '--ax-edge-kind', selector: '.shape' } },
        { key: 'depth', label: 'Depth', type: 'range', min: -24, max: 24, step: 1, unit: 'px', default: -8, target: { kind: 'css', property: '--ax-edge-depth', selector: '.shape' } },
        { key: 'tip', label: 'Tip radius', type: 'range', min: 0, max: 40, step: 1, unit: 'px', default: 20, target: { kind: 'css', property: '--ax-edge-tip-radius', selector: '.shape' } }
      ],
      code: [
        {
          language: 'css',
          source: '.shape {\n  --ax-radius: 30%;\n  --ax-edge-kind: {{kind}};\n  --ax-edge-depth: {{depth}};\n  --ax-edge-span: 100%;\n  --ax-edge-tip-radius: {{tip}};\n  /* A side can still go its own way. */\n  --ax-edge-top-depth: -12px;\n}'
        }
      ]
    },
    {
      id: 'border-tilt',
      title: 'Border, fill and tilt',
      description: [
        'The fill layer paints the inside of the shape with --ax-fill-color and the border with --ax-border-color. The border is as wide on every side as --ax-border-width says, or per side with --ax-border-top-width and its siblings.',
        'Set --ax-tilt-mode and the surface tilts toward the point you press. Absolute sinks the pressed side by the tilt depth, relative tilts it by a number of degrees. The border keeps the same width on screen while the surface tilts. Press the shape to try it.'
      ],
      preview: stage('Press me'),
      style: `${stageStyle}.shape { --ax-radius: 24px; --ax-tilt-depth: 3px; --ax-tilt-factor: 8; }`,
      controls: [
        { key: 'fill', label: 'Fill color', type: 'color', alpha: true, default: 'rgba(255, 255, 255, 0.14)', target: { kind: 'css', property: '--ax-fill-color', selector: '.shape' } },
        { key: 'border', label: 'Border width', type: 'range', min: 0, max: 12, step: 1, unit: 'px', default: 2, target: { kind: 'css', property: '--ax-border-width', selector: '.shape' } },
        { key: 'tilt', label: 'Tilt mode', type: 'select', options: ['off', 'absolute', 'relative'], default: 'absolute', target: { kind: 'css', property: '--ax-tilt-mode', selector: '.shape' } }
      ],
      code: [
        {
          language: 'css',
          source: '.shape {\n  --ax-fill-color: {{fill}};\n  --ax-border-color: white;\n  --ax-border-width: {{border}};\n  --ax-tilt-mode: {{tilt}};\n  --ax-tilt-depth: 3px;   /* absolute */\n  --ax-tilt-factor: 8;    /* relative, in degrees */\n}'
        }
      ]
    },
    {
      id: 'layers',
      title: 'Layers together',
      description: [
        'The layers attribute lists what the surface draws, in order. Your content is on top of all of them. Fill comes with Surface, the others come from their packages: elevation (a shadow that follows the shape), reveal and acrylic.',
        'Put elevation first, so the other layers paint on top of it. Pick a list below. The background of this preview is an image, so the acrylic has something to blur.'
      ],
      preview: `<div class="stage"><ax-surface class="shape" layers="acrylic reveal"><span>Layers</span></ax-surface></div>`,
      style: `
.stage { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: url(/assets/img/header.jpg) center / cover; }
.shape { width: 200px; height: 140px; color: #fff; --ax-radius: 20px; --ax-fill-color: rgba(255, 255, 255, 0.16); --ax-border-width: 1px; --acrylic-tint-opacity: 0.35; --reveal-color: rgb(255, 255, 255); --reveal-opacity: 0.4; --elevation-depth: 16; }
.shape span { display: flex; height: 100%; align-items: center; justify-content: center; font-size: 15px; }
`,
      controls: [
        { key: 'layers', label: 'Layers', type: 'select', options: ['acrylic reveal', 'elevation fill reveal', 'elevation acrylic reveal', 'fill'], default: 'acrylic reveal', target: { kind: 'attribute', attribute: 'layers', selector: '.shape' } },
        { key: 'depth', label: 'Elevation depth', type: 'range', min: 0, max: 64, step: 1, unit: '', default: 16, target: { kind: 'css', property: '--elevation-depth', selector: '.shape' } }
      ],
      code: [
        {
          language: 'js',
          source: "import { register } from '@ax-design/surface';\nimport { registerAcrylicLayer } from '@ax-design/acrylic';\nimport { registerElevationLayer } from '@ax-design/elevation';\nimport { registerRevealLayer } from '@ax-design/reveal-highlight';\n\nregisterAcrylicLayer();\nregisterElevationLayer();\nregisterRevealLayer();\nregister();"
        },
        { language: 'html', source: '<ax-surface class="shape" layers="{{layers}}">...</ax-surface>' },
        { language: 'css', source: '.shape {\n  --elevation-depth: {{depth}};\n}' }
      ]
    },
    {
      id: 'clip',
      title: 'Clip',
      description: [
        'Add the clip attribute and the content of the surface is cut to its shape, so an image or a video fills a tile of any shape. The cut follows the shape when it changes, and tilts with the content when the surface is pressed.',
        'Without clip the content keeps its own box, and the shape only draws around it.'
      ],
      preview: `<div class="stage"><ax-surface class="shape" clip layers="reveal"><img src="/demo/images/background.jpg" alt=""></ax-surface></div>`,
      style: `
.stage { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
.shape { width: 220px; height: 220px; --ax-radius: 24%; --ax-corner-shape: scoop; --ax-border-width: 0px; --ax-tilt-mode: absolute; --ax-tilt-depth: 4px; --reveal-color: rgb(255, 255, 255); --reveal-opacity: 0.35; }
.shape img { display: block; width: 100%; height: 100%; object-fit: cover; }
`,
      controls: [
        { key: 'clip', label: 'Clip', type: 'toggle', default: true, target: { kind: 'attribute', attribute: 'clip', selector: '.shape' } },
        { key: 'radius', label: 'Radius', type: 'range', min: 0, max: 50, step: 1, unit: '%', default: 24, target: { kind: 'css', property: '--ax-radius', selector: '.shape' } },
        { key: 'shape', label: 'Corner shape', type: 'select', options: ['round', 'bevel', 'scoop', 'notch'], default: 'scoop', target: { kind: 'css', property: '--ax-corner-shape', selector: '.shape' } }
      ],
      code: [
        {
          language: 'html',
          source: '<ax-surface class="tile" clip layers="reveal">\n  <img src="cover.jpg" alt="" style="display: block; width: 100%; height: 100%; object-fit: cover">\n</ax-surface>'
        },
        { language: 'css', source: '.tile {\n  width: 220px;\n  height: 220px;\n  --ax-radius: {{radius}};\n  --ax-corner-shape: {{shape}};\n}' }
      ]
    }
  ],
  reference: [
    { name: 'layers', kind: 'attribute', type: 'space separated names', description: 'The layers the surface draws, in order: fill, reveal, acrylic, elevation or one you registered.' },
    { name: 'clip', kind: 'attribute', type: 'boolean', default: 'off', description: 'Cuts the content to the shape. The cut follows the shape and the tilt.' },
    { name: 'observe', kind: 'attribute', type: 'precise', description: 'Use it when a style of yours depends on something a surface cannot see, such as an element inside another component\'s shadow root.' },
    { name: '--ax-radius', kind: 'property', type: '<length-percentage>', default: '0px', description: 'The radius of every corner. Percentages are relative to the shorter side.' },
    { name: '--ax-{corner}-radius', kind: 'property', type: '<length-percentage>', default: '-1px', description: 'The radius of one corner (top-left, top-right, bottom-right, bottom-left). A negative value means use --ax-radius.' },
    { name: '--ax-corner-shape', kind: 'property', type: 'round | bevel | scoop | notch', default: 'round', description: 'The shape of every corner.' },
    { name: '--ax-corner-{corner}-shape', kind: 'property', type: 'round | bevel | scoop | notch | auto', default: 'auto', description: 'The shape of one corner. auto means use --ax-corner-shape.' },
    { name: '--ax-corner-shoulder-radius', kind: 'property', type: '<length>', default: '0px', description: 'Rounds the two points where a bevel, scoop or notch corner meets the sides. Round corners ignore it.' },
    { name: '--ax-corner-{corner}-shoulder-radius', kind: 'property', type: '<length>', default: '0px', description: 'The shoulder radius of one corner. Wins over the general property.' },
    { name: '--ax-corner-{corner}-shift-x', kind: 'property', type: '<length-percentage>', default: '0px', description: 'Moves one corner point along x. Percentages are relative to the width. Negative values move it out of the box.' },
    { name: '--ax-corner-{corner}-shift-y', kind: 'property', type: '<length-percentage>', default: '0px', description: 'Moves one corner point along y. Percentages are relative to the height.' },
    { name: '--ax-edge-{side}-kind', kind: 'property', type: 'flat | arc | rect | triangle | trapezoid | cusp', default: 'flat', description: 'The feature on one side (top, right, bottom, left). Arc is a circular bump or notch, cusp is two arcs that meet in a point.' },
    { name: '--ax-edge-{side}-depth', kind: 'property', type: '<length>', default: '0px', description: 'How far the feature goes. Positive values go out of the shape, negative values go into it.' },
    { name: '--ax-edge-{side}-span', kind: 'property', type: '<length-percentage>', default: '33%', description: 'The width of the feature along the side. Percentages are relative to the length of the side.' },
    { name: '--ax-edge-{side}-at', kind: 'property', type: '<length-percentage>', default: '50%', description: 'Where the middle of the feature sits. Sides run clockwise: top left to right, right top to bottom, bottom right to left, left bottom to top.' },
    { name: '--ax-edge-{side}-ratio', kind: 'property', type: '<number>', default: '0.5', description: 'For trapezoid only: the width of the far end compared to the base. 1 gives a rectangle, 0 a triangle.' },
    { name: '--ax-edge-{side}-tip-radius', kind: 'property', type: '<length>', default: '0px', description: 'Rounds the far corners of the feature, or the point of a cusp.' },
    { name: '--ax-edge-{side}-shoulder-radius', kind: 'property', type: '<length>', default: '0px', description: 'Rounds the corners where the feature meets the side.' },
    { name: '--ax-edge-kind, --ax-edge-depth, --ax-edge-span, --ax-edge-at, --ax-edge-ratio, --ax-edge-tip-radius, --ax-edge-shoulder-radius', kind: 'property', type: 'as the side properties', description: 'The feature of all four sides at once. Each is the default of the side property with the same name; a side that sets its own value wins.' },
    { name: '--ax-border-width', kind: 'property', type: '<length>', default: '1px', description: 'The width of the border on every side. It stays equally thick on screen while the surface tilts.' },
    { name: '--ax-border-{side}-width', kind: 'property', type: '<length>', default: '-1px', description: 'The width of the border on one side. A negative value means use --ax-border-width.' },
    { name: '--ax-tilt-mode', kind: 'property', type: 'off | absolute | relative', default: 'off', description: 'Tilts the surface toward the point you press. Inherited.' },
    { name: '--ax-tilt-depth', kind: 'property', type: '<length>', default: '1px', description: 'For absolute mode: how far the pressed side sinks.' },
    { name: '--ax-tilt-factor', kind: 'property', type: '<number>', default: '2', description: 'For relative mode: the angle in degrees.' },
    { name: '--ax-tilt-zoom', kind: 'property', type: '<length>', default: '0.8px', description: 'How far the whole surface falls when you press its center.' },
    { name: '--ax-tilt-perspective', kind: 'property', type: '<length>', default: '25px', description: 'The perspective of the tilt.' },
    { name: '--ax-tilt-direction', kind: 'property', type: 'normal | inverted', default: 'normal', description: 'Inverted lifts the pressed side instead of sinking it.' },
    { name: '--ax-fill-color', kind: 'property', type: '<color>', default: 'transparent', description: 'For the fill layer: the color inside the shape.' },
    { name: '--ax-border-color', kind: 'property', type: '<color>', default: 'transparent', description: 'For the fill layer: the color of the border.' },
    { name: 'refresh()', kind: 'method', type: '() => void', description: 'Reads the styles of this surface again. Use it after a change the surface cannot notice.' },
    { name: 'refreshAll()', kind: 'method', type: '() => void', description: 'Reads the styles of every surface again. Exported by the package.' },
    { name: 'release()', kind: 'method', type: '() => void', description: 'Ends a press before the pointer is up, for containers that take the gesture over (a tile drag). Since 0.2.1.' },
    { name: 'registerLayer(name, create)', kind: 'method', type: '(name: string, create: () => Layer) => void', description: 'Registers a layer you wrote, to use in the layers attribute.' }
  ]
};

export default page;
