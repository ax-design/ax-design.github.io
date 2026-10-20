import type { DocPage } from './types';

const glass = (label: string, attributes = '') =>
  `<div class="stage"><ax-acrylic class="glass"${attributes}><span>${label}</span></ax-acrylic></div>`;

// An image fills the box, the glass sits on top of it.
const glassStyle = (extra = '') => `
.stage { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: url(/demo/images/acrylic-background.jpg) center / cover; }
.glass { display: block; width: 220px; height: 150px; color: #fff; ${extra} }
.glass span { display: flex; height: 100%; align-items: center; justify-content: center; font-size: 15px; }
`;

const page: DocPage = {
  slug: 'acrylic',
  name: 'Acrylic',
  package: '@ax-design/acrylic',
  globalName: 'AxAcrylic',
  tagline: 'A frosted glass texture that blurs, tints and adds noise to what is behind it.',
  intro: [
    'Wrap your content with ax-acrylic and it gets a texture of frosted glass: the background behind it is blurred, tinted and covered with a little noise. It needs something behind it to blur, so place it over an image, a video or a colorful page.',
    'Acrylic runs on Surface, so the texture follows the shape of the element. It is also a layer of ax-surface. In browsers without backdrop-filter, the texture falls back to a plain color.',
    'Acrylic follows motion() of ax-surface: a 3D motion turns the glass with the surface, and the opacity of the motion is set on the acrylic elements themselves, never on an ancestor, so the backdrop stays right.'
  ],
  setup: "import { register } from '@ax-design/acrylic';\nregister();",
  examples: [
    {
      id: 'glass',
      title: 'Glass',
      description: [
        'The tint is a color on top of the blurred background. A lower opacity shows more of the background; a higher one makes the text easier to read.',
        'The blur radius sets how deep the blur is.'
      ],
      preview: glass('Acrylic'),
      style: glassStyle(),
      controls: [
        { key: 'tint', label: 'Tint color', type: 'color', default: 'rgb(0, 0, 0)', target: { kind: 'css', property: '--acrylic-tint-color', selector: '.glass' } },
        { key: 'opacity', label: 'Tint opacity', type: 'range', min: 0, max: 1, step: 0.01, unit: '', default: 0.6, target: { kind: 'css', property: '--acrylic-tint-opacity', selector: '.glass' } },
        { key: 'blur', label: 'Blur', type: 'range', min: 0, max: 60, step: 1, unit: 'px', default: 20, target: { kind: 'css', property: '--acrylic-blur', selector: '.glass' } }
      ],
      code: [
        { language: 'html', source: '<ax-acrylic class="glass">\n  Acrylic\n</ax-acrylic>' },
        { language: 'css', source: '.glass {\n  --acrylic-tint-color: {{tint}};\n  --acrylic-tint-opacity: {{opacity}};\n  --acrylic-blur: {{blur}};\n}' }
      ]
    },
    {
      id: 'color',
      title: 'Saturation and brightness',
      description: [
        'The blurred background is made more saturated and a bit darker before the tint is applied. This is what keeps the colors of the background alive behind the glass.',
        'Lower the saturation to get a gray glass, raise the brightness for a light one.'
      ],
      preview: glass('Colors'),
      style: glassStyle('--acrylic-tint-opacity: 0.2;'),
      controls: [
        { key: 'saturate', label: 'Saturate', type: 'range', min: 0, max: 400, step: 5, unit: '%', default: 200, target: { kind: 'css', property: '--acrylic-saturate', selector: '.glass' } },
        { key: 'brightness', label: 'Brightness', type: 'range', min: 40, max: 200, step: 5, unit: '%', default: 95, target: { kind: 'css', property: '--acrylic-brightness', selector: '.glass' } }
      ],
      code: [{ language: 'css', source: '.glass {\n  --acrylic-saturate: {{saturate}};\n  --acrylic-brightness: {{brightness}};\n}' }]
    },
    {
      id: 'noise',
      title: 'Noise',
      description: [
        'A layer of fine noise sits on top of the tint, like the grain of real acrylic. It is very faint by default. Raise it to see it.',
        'In a browser without backdrop-filter, the noise is removed and the glass becomes the plain fallback color, always fully opaque so text stays readable.'
      ],
      preview: glass('Noise'),
      style: glassStyle('--acrylic-tint-opacity: 0.4;'),
      controls: [
        { key: 'noise', label: 'Noise opacity', type: 'range', min: 0, max: 0.5, step: 0.01, unit: '', default: 0.03, target: { kind: 'css', property: '--acrylic-noise-opacity', selector: '.glass' } },
        { key: 'fallback', label: 'Fallback color', type: 'color', default: 'rgb(30, 30, 30)', target: { kind: 'css', property: '--acrylic-fallback-color', selector: '.glass' } }
      ],
      code: [{ language: 'css', source: '.glass {\n  --acrylic-noise-opacity: {{noise}};\n  --acrylic-fallback-color: {{fallback}};\n}' }]
    },
    {
      id: 'shape',
      title: 'Shape',
      description: [
        'The glass follows the Surface shape properties, like --ax-radius and --ax-corner-shape. The blur is cut to the shape, whatever it is.'
      ],
      preview: glass('Shape'),
      style: glassStyle('--acrylic-tint-opacity: 0.4;'),
      controls: [
        { key: 'radius', label: 'Radius', type: 'range', min: 0, max: 50, step: 1, unit: '%', default: 30, target: { kind: 'css', property: '--ax-radius', selector: '.glass' } },
        { key: 'shape', label: 'Corner shape', type: 'select', options: ['round', 'bevel', 'scoop', 'notch'], default: 'round', target: { kind: 'css', property: '--ax-corner-shape', selector: '.glass' } }
      ],
      code: [{ language: 'css', source: 'ax-acrylic {\n  --ax-radius: {{radius}};\n  --ax-corner-shape: {{shape}};\n}' }]
    },
    {
      id: 'surface',
      title: 'With Surface',
      description: [
        'Acrylic is also a layer of ax-surface, so you can put it together with other layers on the same shape. Here acrylic and reveal highlight share a surface that tilts when you press it.',
        'Move your pointer over the glass and press it.'
      ],
      preview: `<div class="stage"><ax-surface class="glass" layers="acrylic reveal"><span>Press me</span></ax-surface></div>`,
      style: glassStyle('--acrylic-tint-opacity: 0.35; --ax-radius: 16px; --ax-border-width: 1px; --ax-tilt-mode: absolute; --ax-tilt-depth: 3px; --reveal-color: rgb(255, 255, 255); --reveal-opacity: 0.4;'),
      controls: [
        { key: 'tilt', label: 'Tilt depth', type: 'range', min: 0, max: 8, step: 1, unit: 'px', default: 3, target: { kind: 'css', property: '--ax-tilt-depth', selector: '.glass' } },
        { key: 'radius', label: 'Radius', type: 'range', min: 0, max: 60, step: 1, unit: 'px', default: 16, target: { kind: 'css', property: '--ax-radius', selector: '.glass' } }
      ],
      code: [
        { language: 'js', source: "import { register } from '@ax-design/surface';\nimport { registerAcrylicLayer } from '@ax-design/acrylic';\nimport { registerRevealLayer } from '@ax-design/reveal-highlight';\n\nregisterAcrylicLayer();\nregisterRevealLayer();\nregister();" },
        { language: 'html', source: '<ax-surface class="glass" layers="acrylic reveal">Press me</ax-surface>' },
        { language: 'css', source: '.glass {\n  --ax-radius: {{radius}};\n  --ax-tilt-mode: absolute;\n  --ax-tilt-depth: {{tilt}};\n}' }
      ]
    }
  ],
  reference: [
    { name: '--acrylic-tint-color', kind: 'property', type: '<color>', default: 'black', description: 'The base color of the texture when backdrop-filter is available.' },
    { name: '--acrylic-tint-opacity', kind: 'property', type: '<number>', default: '0.6', description: 'The opacity of the tint when backdrop-filter is available.' },
    { name: '--acrylic-fallback-color', kind: 'property', type: '<color>', default: 'black', description: 'The color of the texture when backdrop-filter is not available. It is always opaque, for readability; there is no fallback opacity.' },
    { name: '--acrylic-noise-opacity', kind: 'property', type: '<number>', default: '0.03', description: 'The opacity of the noise layer. The noise is removed in fallback mode.' },
    { name: '--acrylic-blur', kind: 'property', type: '<length>', default: '20px', description: 'The radius of the blur. A greater radius blurs deeper.' },
    { name: '--acrylic-saturate', kind: 'property', type: '<percentage>', default: '200%', description: 'The saturation of the blurred background.' },
    { name: '--acrylic-brightness', kind: 'property', type: '<percentage>', default: '95%', description: 'The brightness of the blurred background.' },
    { name: '--ax-*', kind: 'property', type: 'Surface properties', description: 'ax-acrylic takes the shape and tilt properties of Surface, for example --ax-radius and --ax-corner-shape.' },
    { name: 'registerAcrylicLayer()', kind: 'method', type: '() => void', description: 'Registers the acrylic layer for ax-surface. register() calls it too.' }
  ]
};

export default page;
