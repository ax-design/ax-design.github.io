import type { DocPage } from './types';

// Four buttons in a grid, the base of most examples on this page.
const buttons = (attributes = '') => `<div class="grid">
  <ax-reveal${attributes}><button>Welcome</button></ax-reveal>
  <ax-reveal${attributes}><button>To</button></ax-reveal>
  <ax-reveal${attributes}><button>Project</button></ax-reveal>
  <ax-reveal${attributes}><button>Axiom</button></ax-reveal>
</div>`;

const buttonStyle = `
.grid { position: absolute; inset: 0; display: grid; grid-template-columns: repeat(2, 132px); grid-auto-rows: 56px; gap: 8px; align-content: center; justify-content: center; }
ax-reveal { display: block; --reveal-color: rgb(255, 255, 255); --reveal-opacity: 0.4; }
button { width: 100%; height: 100%; border: 0; background: rgba(255, 255, 255, 0.08); color: #fff; font: inherit; font-size: 15px; cursor: pointer; }
`;

const page: DocPage = {
  slug: 'reveal-highlight',
  name: 'Reveal Highlight',
  package: '@ax-design/reveal-highlight',
  globalName: 'AxRevealHighlight',
  tagline: 'A light that follows your pointer and shows which parts of the page you can interact with.',
  intro: [
    'Wrap a component with ax-reveal and it lights up when your pointer comes close: its border catches the light first, then its inside when the pointer is over it. Press it and a ripple spreads from your finger.',
    'Reveal Highlight runs on Surface, so it only works for components on the screen, and draws much less while you move your pointer. Every look is a custom property: you style it in CSS, together with the rest of your component.'
  ],
  setup: "import { register } from '@ax-design/reveal-highlight';\nregister();",
  examples: [
    {
      id: 'buttons',
      title: 'Buttons',
      description: [
        'The basic use: wrap each button with ax-reveal. Move your pointer between the buttons and the borders around it light up, the closer the brighter.',
        'Give the light a color that stands out from the background. On a dark background white works best.'
      ],
      preview: buttons(),
      style: buttonStyle,
      controls: [
        { key: 'color', label: 'Color', type: 'color', default: 'rgb(255, 255, 255)', target: { kind: 'css', property: '--reveal-color', selector: 'ax-reveal' } },
        { key: 'opacity', label: 'Opacity', type: 'range', min: 0, max: 1, step: 0.01, unit: '', default: 0.4, target: { kind: 'css', property: '--reveal-opacity', selector: 'ax-reveal' } },
        { key: 'border', label: 'Border width', type: 'range', min: 0, max: 6, step: 1, unit: 'px', default: 1, target: { kind: 'css', property: '--reveal-border-width', selector: 'ax-reveal' } }
      ],
      code: [
        { language: 'html', source: '<ax-reveal>\n  <button class="my-button">Welcome</button>\n</ax-reveal>' },
        { language: 'css', source: 'ax-reveal {\n  --reveal-color: {{color}};\n  --reveal-opacity: {{opacity}};\n  --reveal-border-width: {{border}};\n}' }
      ]
    },
    {
      id: 'hover-light',
      title: 'Hover light',
      description: [
        'While your pointer is over a component, a soft light fills its inside. The fill radius is relative to the size of the component: 1.5 lights a bit more than the component itself.',
        'Turn it off when only the borders should react, for example on a busy list.'
      ],
      preview: buttons(),
      style: buttonStyle,
      controls: [
        { key: 'hover', label: 'Hover light', type: 'toggle', default: true, on: 'true', off: 'false', target: { kind: 'css', property: '--reveal-hover-light', selector: 'ax-reveal' } },
        { key: 'radius', label: 'Fill radius', type: 'range', min: 0.2, max: 4, step: 0.1, unit: '', default: 1.5, target: { kind: 'css', property: '--reveal-hover-light-fill-radius', selector: 'ax-reveal' } }
      ],
      code: [{ language: 'css', source: 'ax-reveal {\n  --reveal-hover-light: {{hover}};\n  --reveal-hover-light-fill-radius: {{radius}};\n}' }]
    },
    {
      id: 'press',
      title: 'Press',
      description: [
        'Press a button and hold it: a ripple spreads from where you pressed, and speeds up when you let go.',
        'The speed is in milliseconds for the ripple to cover the component; the accelerate rate is how much faster it finishes after the release.'
      ],
      preview: buttons(),
      style: buttonStyle,
      controls: [
        { key: 'press', label: 'Press animation', type: 'toggle', default: true, on: 'true', off: 'false', target: { kind: 'css', property: '--reveal-press-animation', selector: 'ax-reveal' } },
        { key: 'speed', label: 'Speed', type: 'range', min: 200, max: 8000, step: 100, unit: '', default: 2000, target: { kind: 'css', property: '--reveal-press-animation-speed', selector: 'ax-reveal' } },
        { key: 'rate', label: 'Accelerate rate', type: 'range', min: 1, max: 30, step: 1, unit: '', default: 6, target: { kind: 'css', property: '--reveal-release-animation-accelerate-rate', selector: 'ax-reveal' } }
      ],
      code: [
        {
          language: 'css',
          source: 'ax-reveal {\n  --reveal-press-animation: {{press}};\n  --reveal-press-animation-speed: {{speed}};\n  --reveal-release-animation-accelerate-rate: {{rate}};\n}'
        }
      ]
    },
    {
      id: 'diffuse',
      title: 'Borders far away',
      description: [
        'By default the borders of every component near your pointer light up, also when the pointer is outside of them. Turn diffuse off and only the component under your pointer lights its border.'
      ],
      preview: buttons(),
      style: buttonStyle,
      controls: [
        { key: 'diffuse', label: 'Diffuse', type: 'toggle', default: true, on: 'true', off: 'false', target: { kind: 'css', property: '--reveal-diffuse', selector: 'ax-reveal' } }
      ],
      code: [{ language: 'css', source: 'ax-reveal {\n  --reveal-diffuse: {{diffuse}};\n}' }]
    },
    {
      id: 'surface',
      title: 'With Surface',
      description: [
        'Reveal Highlight is also a layer of ax-surface. The light then follows the shape of the surface, corners and bites included, and stays under your pointer while the surface tilts.',
        'Press the shape: it tilts toward your finger, and the border keeps the same width all around.'
      ],
      preview: `<div class="stage"><ax-surface class="shape" layers="fill reveal"><span>Press me</span></ax-surface></div>`,
      style: `
.stage { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
.shape { width: 200px; height: 140px; color: #fff; --ax-fill-color: rgba(255, 255, 255, 0.1); --ax-border-width: 2px; --ax-tilt-mode: absolute; --ax-tilt-depth: 2px; --reveal-color: rgb(255, 255, 255); --reveal-opacity: 0.45; }
.shape span { display: flex; height: 100%; align-items: center; justify-content: center; font-size: 15px; }
`,
      controls: [
        { key: 'radius', label: 'Corner radius', type: 'range', min: 0, max: 50, step: 1, unit: '%', default: 24, target: { kind: 'css', property: '--ax-radius', selector: '.shape' } },
        { key: 'corner', label: 'Corner shape', type: 'select', options: ['round', 'bevel', 'scoop', 'notch'], default: 'round', target: { kind: 'css', property: '--ax-corner-shape', selector: '.shape' } }
      ],
      code: [
        {
          language: 'js',
          source: "import { register } from '@ax-design/surface';\nimport { registerRevealLayer } from '@ax-design/reveal-highlight';\n\nregisterRevealLayer();\nregister();"
        },
        { language: 'html', source: '<ax-surface class="my-shape" layers="fill reveal">...</ax-surface>' },
        { language: 'css', source: '.my-shape {\n  --ax-radius: {{radius}};\n  --ax-corner-shape: {{corner}};\n  --ax-tilt-mode: absolute;\n}' }
      ]
    }
  ],
  reference: [
    { name: '--reveal-color', kind: 'property', type: '<color>', default: 'rgb(0, 0, 0)', description: 'The color of the light, for the border, the hover light and the ripple unless they have colors of their own.' },
    { name: '--reveal-opacity', kind: 'property', type: '<number>', default: '0.26', description: 'How bright the light is at its center.' },
    { name: '--reveal-border-width', kind: 'property', type: '<length>', default: '1px', description: 'The width of the border light. Set --ax-border-width instead on ax-surface.' },
    { name: '--reveal-border-color', kind: 'property', type: '<color>', description: 'The color of the border light, when it differs from --reveal-color.' },
    { name: '--reveal-border-fill-radius', kind: 'property', type: '<number>', default: '1.5', description: 'How far the border light reaches, relative to the size of the component.' },
    { name: '--reveal-hover-light', kind: 'property', type: 'true | false', default: 'true', description: 'Fill the component with light while the pointer is over it.' },
    { name: '--reveal-hover-light-color', kind: 'property', type: '<color>', description: 'The color of the hover light, when it differs from --reveal-color.' },
    { name: '--reveal-hover-light-fill-radius', kind: 'property', type: '<number>', default: '1.5', description: 'How far the hover light reaches.' },
    { name: '--reveal-hover-light-fill-radius-mode', kind: 'property', type: 'relative | absolute', default: 'relative', description: 'relative: the fill radii are relative to the size of the component. absolute: they are in px.' },
    { name: '--reveal-diffuse', kind: 'property', type: 'true | false', default: 'true', description: 'Light the borders of components near the pointer, not only the one under it.' },
    { name: '--reveal-press-animation', kind: 'property', type: 'true | false', default: 'true', description: 'Spread a ripple from where the component is pressed.' },
    { name: '--reveal-press-animation-color', kind: 'property', type: '<color>', description: 'The color of the ripple, when it differs from --reveal-color.' },
    { name: '--reveal-press-animation-radius-mode', kind: 'property', type: 'cover | constrained', default: 'cover', description: 'cover: the ripple grows until it covers the component. constrained: it stops at the hover light radius.' },
    { name: '--reveal-press-animation-speed', kind: 'property', type: '<number>', default: '2000', description: 'Milliseconds for the ripple to cover the component.' },
    { name: '--reveal-release-animation-accelerate-rate', kind: 'property', type: '<number>', default: '6', description: 'How much faster the ripple finishes after the release.' },
    { name: 'borderDetectionMode', kind: 'method', type: "register({ borderDetectionMode: 'strictEdge' | 'experimentalAutoFit' })", default: "'strictEdge'", description: 'strictEdge lights the components only while your pointer is inside their ax-reveal-bound. experimentalAutoFit also lights them while your pointer is close to the boundary.' }
  ]
};

export default page;
