import type { DocPage } from './types';

const tile = (name: string, image: string) =>
  `<ax-pressure class="press"><div class="tile"><img src="/demo/images/${image}" alt=""><p>${name}</p></div></ax-pressure>`;

const style = `
.stage { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
.press { display: block; --pressure-tilt-depth: 4px; }
.tile { width: 200px; height: 200px; background: rgba(255, 255, 255, 0.16); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; cursor: pointer; }
.tile img { width: 96px; height: 96px; }
.tile p { margin: 0; font-size: 15px; }
`;

const page: DocPage = {
  slug: 'pressure',
  name: 'Pressure',
  package: '@ax-design/pressure',
  globalName: 'AxPressure',
  tagline: 'A tilt that leans an element away from the point you press, like pushing on a tile.',
  intro: [
    'Wrap an element with ax-pressure and it tilts away from the point you press and sinks a little. Press near an edge and that side sinks, press the middle and the whole element falls.',
    'Pressure runs on Surface: it is the tilt of ax-surface. Other surfaces inside ax-pressure, like ax-reveal, follow your pointer correctly while the element is tilted. If you already use ax-surface, you can tilt it directly with --ax-tilt-mode.'
  ],
  setup: "import { register } from '@ax-design/pressure';\nregister();",
  examples: [
    {
      id: 'tilt',
      title: 'Tilt',
      description: [
        'Press the tile near its edge. In absolute mode the pressed side sinks by the tilt depth, a length that does not depend on the size of the element.',
        'The zoom is how far the whole element falls when you press its center.'
      ],
      preview: `<div class="stage">${tile('Apple', 'apple.svg')}</div>`,
      style,
      controls: [
        { key: 'depth', label: 'Tilt depth', type: 'range', min: 0, max: 20, step: 1, unit: 'px', default: 4, target: { kind: 'css', property: '--pressure-tilt-depth', selector: '.press' } },
        { key: 'zoom', label: 'Zoom', type: 'range', min: 0, max: 12, step: 0.2, unit: 'px', default: 0.8, target: { kind: 'css', property: '--pressure-zoom', selector: '.press' } }
      ],
      code: [
        { language: 'html', source: '<ax-pressure>\n  <div class="tile">\n    <img src="apple.svg" alt="">\n    <p>Apple</p>\n  </div>\n</ax-pressure>' },
        { language: 'css', source: 'ax-pressure {\n  --pressure-tilt-depth: {{depth}};\n  --pressure-zoom: {{zoom}};\n}' }
      ]
    },
    {
      id: 'relative',
      title: 'Relative mode',
      description: [
        'In relative mode the element tilts by a number of degrees, so a large element leans as far as a small one. Use it for elements of very different sizes.',
        'Press the tile near a corner to see the angle.'
      ],
      preview: `<div class="stage">${tile('Tea', 'tea.svg')}</div>`,
      style,
      controls: [
        { key: 'mode', label: 'Tilt mode', type: 'select', options: ['absolute', 'relative'], default: 'relative', target: { kind: 'css', property: '--pressure-tilt-mode', selector: '.press' } },
        { key: 'factor', label: 'Tilt factor', type: 'range', min: 0, max: 20, step: 1, unit: '', default: 8, target: { kind: 'css', property: '--pressure-tilt-factor', selector: '.press' } }
      ],
      code: [{ language: 'css', source: 'ax-pressure {\n  --pressure-tilt-mode: {{mode}};\n  --pressure-tilt-factor: {{factor}};\n}' }]
    },
    {
      id: 'perspective',
      title: 'Perspective',
      description: [
        'The perspective is the distance of the viewer. A short distance makes the tilt look strong, a long one makes it look flat.',
        'Invert the tilt and the pressed side lifts toward you instead of sinking.'
      ],
      preview: `<div class="stage">${tile('Donut', 'donut.svg')}</div>`,
      style,
      controls: [
        { key: 'perspective', label: 'Perspective', type: 'range', min: 10, max: 200, step: 5, unit: 'px', default: 25, target: { kind: 'css', property: '--pressure-perspective', selector: '.press' } },
        { key: 'invert', label: 'Invert', type: 'toggle', default: false, on: 'true', off: 'false', target: { kind: 'css', property: '--pressure-invert', selector: '.press' } }
      ],
      code: [{ language: 'css', source: 'ax-pressure {\n  --pressure-perspective: {{perspective}};\n  --pressure-invert: {{invert}};\n}' }]
    },
    {
      id: 'reveal',
      title: 'With Reveal Highlight',
      description: [
        'An ax-reveal inside ax-pressure keeps its light under your pointer while the element is tilted, because the pointer is mapped through the tilt.',
        'Press and move around on the buttons.'
      ],
      preview: `<div class="stage"><ax-pressure class="press"><div class="panel"><ax-reveal><button>Open</button></ax-reveal><ax-reveal><button>Save</button></ax-reveal></div></ax-pressure></div>`,
      style: `
.stage { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
.press { display: block; --pressure-tilt-depth: 6px; }
.panel { display: flex; flex-direction: column; gap: 8px; padding: 16px; background: rgba(255, 255, 255, 0.12); }
ax-reveal { display: block; --reveal-color: rgb(255, 255, 255); --reveal-opacity: 0.4; }
button { width: 180px; height: 50px; border: 0; background: rgba(255, 255, 255, 0.08); color: #fff; font: inherit; font-size: 15px; cursor: pointer; }
`,
      controls: [{ key: 'depth', label: 'Tilt depth', type: 'range', min: 0, max: 20, step: 1, unit: 'px', default: 6, target: { kind: 'css', property: '--pressure-tilt-depth', selector: '.press' } }],
      code: [
        { language: 'html', source: '<ax-pressure>\n  <ax-reveal><button>Open</button></ax-reveal>\n  <ax-reveal><button>Save</button></ax-reveal>\n</ax-pressure>' },
        { language: 'css', source: 'ax-pressure {\n  --pressure-tilt-depth: {{depth}};\n}' }
      ]
    }
  ],
  reference: [
    { name: '--pressure-tilt-depth', kind: 'property', type: '<length>', default: '1px', description: 'The depth at which one side sinks when you press the edge of the element.' },
    { name: '--pressure-zoom', kind: 'property', type: '<length>', default: '0.8px', description: 'How far the entire element falls when you press its center.' },
    { name: '--pressure-perspective', kind: 'property', type: '<length>', default: '25px', description: 'The perspective of the tilt.' },
    { name: '--pressure-tilt-mode', kind: 'property', type: 'absolute | relative', default: 'absolute', description: 'Absolute sinks the pressed side by --pressure-tilt-depth. Relative tilts the element by --pressure-tilt-factor degrees.' },
    { name: '--pressure-tilt-factor', kind: 'property', type: '<number>', default: '2', description: 'The angle in degrees for relative mode.' },
    { name: '--pressure-invert', kind: 'property', type: 'true | false', default: 'false', description: 'true lifts the pressed side instead of sinking it.' }
  ]
};

export default page;
