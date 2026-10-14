import type { DocPage } from './types';

const card = (label: string, tag = 'ax-elevation', attributes = '') =>
  `<div class="stage"><${tag} class="card"${attributes}><span>${label}</span></${tag}></div>`;

// A light background, so the shadows show.
const style = (extra = '') => `
:root { background: #f2f0eb; color: #1b1b1b; }
.stage { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
.card { display: block; width: 200px; height: 140px; ${extra} }
.card span { display: flex; height: 100%; align-items: center; justify-content: center; font-size: 15px; background: #fff; }
.card span.bare { background: none; }
`;

const page: DocPage = {
  slug: 'elevation',
  name: 'Elevation',
  package: '@ax-design/elevation',
  globalName: 'AxElevation',
  tagline: 'A shadow that tells how high an element floats above the page, and follows its shape.',
  intro: [
    'Wrap the content that should float above the page in ax-elevation and set --elevation-depth. The shadow has two layers that grow with the depth: a large, soft one and a small, darker one under the element.',
    'Elevation runs on Surface, so the shadow follows the shape of the element, not only rectangles. It is also a layer of ax-surface. The shadows need room around the element and a light background to show.'
  ],
  setup: "import { register } from '@ax-design/elevation';\nregister();",
  examples: [
    {
      id: 'depth',
      title: 'Depth',
      description: [
        'The depth is a number: the higher it is, the larger and softer the shadow. 0 draws no shadow.',
        'The property is inherited, so you can set it on a container and every ax-elevation inside takes it.'
      ],
      preview: card('Depth'),
      style: style(),
      controls: [{ key: 'depth', label: 'Depth', type: 'range', min: 0, max: 64, step: 1, unit: '', default: 16, target: { kind: 'css', property: '--elevation-depth' } }],
      code: [
        { language: 'html', source: '<ax-elevation class="card">\n  Depth\n</ax-elevation>' },
        { language: 'css', source: '.card {\n  --elevation-depth: {{depth}};\n}' }
      ]
    },
    {
      id: 'shape',
      title: 'Shape',
      description: [
        'The shadow follows the Surface shape properties. A rounded card gets a rounded shadow, and a bevel or scoop corner gets a shadow with the same corner.',
        'The shadow is cut out under the shape, so a translucent card does not look darker. Add the clip attribute to cut the content to the shape too, background included.'
      ],
      preview: card('Shape', 'ax-elevation', ' clip'),
      style: style('--elevation-depth: 16;'),
      controls: [
        { key: 'radius', label: 'Radius', type: 'range', min: 0, max: 50, step: 1, unit: '%', default: 25, target: { kind: 'css', property: '--ax-radius', selector: '.card' } },
        { key: 'shape', label: 'Corner shape', type: 'select', options: ['round', 'bevel', 'scoop', 'notch'], default: 'scoop', target: { kind: 'css', property: '--ax-corner-shape', selector: '.card' } },
        { key: 'shoulder', label: 'Shoulder radius', type: 'range', min: 0, max: 30, step: 1, unit: 'px', default: 8, target: { kind: 'css', property: '--ax-corner-shoulder-radius', selector: '.card' } }
      ],
      code: [
        { language: 'html', source: '<ax-elevation clip>\n  <div class="card-body">Shape</div>\n</ax-elevation>' },
        {
          language: 'css',
          source: 'ax-elevation {\n  --elevation-depth: 16;\n  --ax-radius: {{radius}};\n  --ax-corner-shape: {{shape}};\n  --ax-corner-shoulder-radius: {{shoulder}};\n}'
        }
      ]
    },
    {
      id: 'inherited',
      title: 'Inherited depth',
      description: [
        'Because the depth is inherited, one value on a container sets all cards inside. A card can still set its own depth.',
        'Here the first two cards take the depth of the container, the last one sets its own.'
      ],
      preview: `<div class="stage"><div class="row"><ax-elevation class="card"><span>A</span></ax-elevation><ax-elevation class="card"><span>B</span></ax-elevation><ax-elevation class="card own"><span>C</span></ax-elevation></div></div>`,
      style: `${style()}
.row { display: flex; gap: 22px; }
.card { width: 80px; height: 110px; }
.own { --elevation-depth: 48; }
`,
      controls: [{ key: 'depth', label: 'Depth of the container', type: 'range', min: 0, max: 48, step: 1, unit: '', default: 12, target: { kind: 'css', property: '--elevation-depth' } }],
      code: [
        { language: 'html', source: '<div class="row">\n  <ax-elevation class="card">A</ax-elevation>\n  <ax-elevation class="card">B</ax-elevation>\n  <ax-elevation class="card own">C</ax-elevation>\n</div>' },
        { language: 'css', source: '.row {\n  --elevation-depth: {{depth}};\n}\n\n.own {\n  --elevation-depth: 48;\n}' }
      ]
    },
    {
      id: 'surface',
      title: 'With Surface',
      description: [
        'Elevation is also a layer of ax-surface. List it first, so the other layers paint on top of it.',
        'This surface has a shadow, a fill and a reveal light on one shape, and sinks when you press it.'
      ],
      preview: `<div class="stage"><ax-surface class="card" layers="elevation fill reveal"><span class="bare">Press me</span></ax-surface></div>`,
      style: style('--elevation-depth: 20; --ax-radius: 16px; --ax-border-width: 1px; --ax-fill-color: #fff; --ax-border-color: rgba(0, 0, 0, 0.12); --ax-tilt-mode: absolute; --ax-tilt-depth: 3px; --reveal-color: rgb(0, 0, 0); --reveal-opacity: 0.15;'),
      controls: [
        { key: 'depth', label: 'Depth', type: 'range', min: 0, max: 64, step: 1, unit: '', default: 20, target: { kind: 'css', property: '--elevation-depth', selector: '.card' } },
        { key: 'tilt', label: 'Tilt mode', type: 'select', options: ['off', 'absolute', 'relative'], default: 'absolute', target: { kind: 'css', property: '--ax-tilt-mode', selector: '.card' } }
      ],
      code: [
        { language: 'js', source: "import { register } from '@ax-design/surface';\nimport { registerElevationLayer } from '@ax-design/elevation';\nimport { registerRevealLayer } from '@ax-design/reveal-highlight';\n\nregisterElevationLayer();\nregisterRevealLayer();\nregister();" },
        { language: 'html', source: '<ax-surface class="card" layers="elevation fill reveal">...</ax-surface>' },
        { language: 'css', source: '.card {\n  --elevation-depth: {{depth}};\n  --ax-tilt-mode: {{tilt}};\n}' }
      ]
    }
  ],
  reference: [
    { name: '--elevation-depth', kind: 'property', type: '<number>', default: '0', description: 'How high the element floats. The shadow is a large, soft layer and a small, darker one that grow with the depth. 0 draws no shadow. Inherited.' },
    { name: '--ax-*', kind: 'property', type: 'Surface properties', description: 'ax-elevation takes the shape properties of Surface, for example --ax-radius, --ax-corner-shape and --ax-corner-shoulder-radius.' },
    { name: 'registerElevationLayer()', kind: 'method', type: '() => void', description: 'Registers the elevation layer for ax-surface. register() calls it too.' }
  ]
};

export default page;
