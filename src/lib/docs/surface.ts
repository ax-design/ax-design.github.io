import type { DocPage } from './types';

// One surface in the middle of the preview.
const stage = (label: string, attributes = '') =>
  `<div class="stage"><ax-surface class="shape" layers="fill reveal"${attributes}><span>${label}</span></ax-surface></div>`;

const stageStyle = `
.stage { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
.shape { width: 200px; height: 140px; color: #fff; --ax-fill-color: rgba(255, 255, 255, 0.14); --ax-border-color: rgba(255, 255, 255, 0.7); --ax-border-width: 2px; --reveal-color: rgb(255, 255, 255); --reveal-opacity: 0.35; }
.shape span { display: flex; height: 100%; align-items: center; justify-content: center; font-size: 15px; }
`;

// The state of the motion preview, by preview box: update() writes it, and the frame loop of
// setup() plays it. A motion lasts one frame, so it is given again on every frame.
const motionStates = new WeakMap<HTMLElement, { rotateY: number; opacity: number }>();

const page: DocPage = {
  slug: 'surface',
  name: 'Surface',
  package: '@ax-design/surface',
  tagline: 'The box every effect of Axiom draws on: it owns the shape, the tilt and the frame scheduler, and it paints its content with layers.',
  intro: [
    'A surface is the box that every visual effect of Axiom Design System draws on. Wrap your element with ax-surface, pick the layers you need in the layers attribute, and give it a shape: your content always stays on top of the layers.',
    'The geometry (corners, side features, the border ring and what a tilt does to it) is the Shape language, documented on the Shape page at /components/shape. This page is about the element itself: the layers, the tilt, the clip and the one frame scheduler that every surface on the page shares.',
    'Surfaces only work while they are visible, read their styles only after something changed, and lower the frame rate of far and small surfaces when the page starts dropping frames. Shape properties are not inherited, so set them on the ax-surface element itself. The Playground (/playground) has every property with live controls.'
  ],
  setup: "import { register } from '@ax-design/surface';\nregister();",
  examples: [
    {
      id: 'layers',
      title: 'Layers',
      description: [
        'The layers attribute lists what the surface draws, in order. Your content is on top of all of them. Fill comes with Surface; the other layers come from their own packages: elevation (a shadow that follows the shape), reveal and acrylic.',
        'Put elevation first, so the other layers paint on top of it. Pick a list below. The background of this preview is an image, so the acrylic has something to blur.'
      ],
      preview: '<div class="stage"><ax-surface class="shape" layers="acrylic reveal"><span>Layers</span></ax-surface></div>',
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
          source:
            "import { register } from '@ax-design/surface';\n" +
            "import { registerAcrylicLayer } from '@ax-design/acrylic';\n" +
            "import { registerElevationLayer } from '@ax-design/elevation';\n" +
            "import { registerRevealLayer } from '@ax-design/reveal-highlight';\n\n" +
            'registerAcrylicLayer();\n' +
            'registerElevationLayer();\n' +
            'registerRevealLayer();\n' +
            'register();'
        },
        { language: 'html', source: '<ax-surface class="shape" layers="{{layers}}">...</ax-surface>' },
        { language: 'css', source: '.shape {\n  --elevation-depth: {{depth}};\n}' }
      ]
    },
    {
      id: 'fill-border',
      title: 'Fill and border',
      description: [
        'The fill layer paints the inside of the shape with --ax-fill-color and its edge with --ax-border-color. The edge is the border ring the Shape page describes: an outer and an inner contour, filled with the even-odd rule.',
        'The border is as wide on every side as --ax-border-width says, or per side with --ax-border-top-width and its siblings. While the surface tilts, the border keeps the same thickness on screen; that work is described with the tilt on the Shape page.'
      ],
      preview: stage('Card', ' layers="fill"'),
      style: `${stageStyle}.shape { --ax-radius: 18px; }`,
      controls: [
        { key: 'fill', label: 'Fill color', type: 'color', alpha: true, default: 'rgba(255, 255, 255, 0.14)', target: { kind: 'css', property: '--ax-fill-color', selector: '.shape' } },
        { key: 'border', label: 'Border width', type: 'range', min: 0, max: 14, step: 1, unit: '', default: 2, target: { kind: 'css', property: '--ax-border-width', selector: '.shape' } },
        { key: 'bottom', label: 'Bottom width', type: 'range', min: 0, max: 14, step: 1, unit: '', default: 2, target: { kind: 'css', property: '--ax-border-bottom-width', selector: '.shape' } }
      ],
      code: [
        { language: 'html', source: '<ax-surface class="card" layers="fill">...</ax-surface>' },
        {
          language: 'css',
          source: '.card {\n  --ax-fill-color: {{fill}};\n  --ax-border-color: white;\n  --ax-border-width: {{border}}px;\n  --ax-border-bottom-width: {{bottom}}px;\n}'
        }
      ]
    },
    {
      id: 'tilt',
      title: 'Tilt',
      description: [
        'Set --ax-tilt-mode and the surface tilts toward the point you press. Absolute sinks the pressed side by --ax-tilt-depth, relative tilts it by --ax-tilt-factor degrees. --ax-tilt-zoom drops the whole surface when you press its center, and --ax-tilt-perspective gives the effect its depth. Press the shape to try it.',
        'The tilt properties inherit, so set them once on a container and every surface inside tilts the same way. --ax-tilt-direction: inverted lifts the pressed side instead of sinking it.'
      ],
      preview: stage('Press me'),
      style: `${stageStyle}.shape { --ax-radius: 24px; --ax-tilt-depth: 3px; --ax-tilt-factor: 8; }`,
      controls: [
        { key: 'mode', label: 'Tilt mode', type: 'select', options: ['off', 'absolute', 'relative'], default: 'absolute', target: { kind: 'css', property: '--ax-tilt-mode', selector: '.shape' } },
        { key: 'depth', label: 'Depth', type: 'range', min: 0, max: 12, step: 1, unit: '', default: 3, target: { kind: 'css', property: '--ax-tilt-depth', selector: '.shape' } },
        { key: 'direction', label: 'Direction', type: 'select', options: ['normal', 'inverted'], default: 'normal', target: { kind: 'css', property: '--ax-tilt-direction', selector: '.shape' } }
      ],
      code: [
        { language: 'html', source: '<ax-surface class="shape" layers="fill">...</ax-surface>' },
        {
          language: 'css',
          source: '.shape {\n  --ax-tilt-mode: {{mode}};\n  --ax-tilt-depth: {{depth}}px;    /* absolute */\n  --ax-tilt-factor: 8;         /* relative, in degrees */\n  --ax-tilt-direction: {{direction}};\n}'
        }
      ]
    },
    {
      id: 'clip',
      title: 'Clip',
      description: [
        'Add the clip attribute and the content of the surface is cut to its shape, so an image or a video fills a tile of any shape. The cut follows the shape when it changes, and tilts with the content when the surface is pressed.',
        'Without clip the content keeps its own box, and the shape only draws around it.'
      ],
      preview: '<div class="stage"><ax-surface class="shape" clip layers="reveal"><img src="/demo/images/background.jpg" alt=""></ax-surface></div>',
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
    },
    {
      id: 'nested',
      title: 'Surfaces inside surfaces',
      description: [
        'A surface inside a tilted surface follows the tilt above it: the pointer is mapped through every tilt on the way down, so the inner surface still tilts toward the point you press, and a reveal highlight stays under your pointer. Press the inner shape and watch both lean.',
        'This is how the components compose: ax-reveal inside ax-pressure, a button inside a card. Each surface keeps its own shape and its own layers, and they still share the one scheduler.'
      ],
      preview: `<div class="stage"><ax-surface class="card" layers="fill"><ax-surface class="inner" layers="fill reveal"><span>Press</span></ax-surface></ax-surface></div>`,
      style: `
.stage { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
.card { width: 250px; height: 170px; --ax-radius: 26px; --ax-fill-color: rgba(255, 255, 255, 0.12); --ax-border-color: rgba(255, 255, 255, 0.55); --ax-border-width: 2px; --ax-tilt-mode: absolute; --ax-tilt-depth: 4px; }
.inner { position: absolute; inset: 0; margin: auto; display: flex; align-items: center; justify-content: center; width: 150px; height: 52px; color: #fff; font-size: 15px; --ax-radius: 14px; --ax-fill-color: rgba(255, 255, 255, 0.22); --ax-border-color: rgba(255, 255, 255, 0.8); --ax-border-width: 2px; --ax-tilt-mode: absolute; --ax-tilt-depth: 3px; --reveal-color: rgb(255, 255, 255); --reveal-opacity: 0.4; }
.inner span { display: flex; height: 100%; align-items: center; justify-content: center; }
`,
      controls: [
        { key: 'depth', label: 'Outer tilt depth', type: 'range', min: 0, max: 12, step: 1, unit: '', default: 4, target: { kind: 'css', property: '--ax-tilt-depth', selector: '.card' } }
      ],
      code: [
        { language: 'html', source: '<ax-surface class="card" layers="fill">\n  <ax-surface class="button" layers="fill reveal">\n    <button>Press</button>\n  </ax-surface>\n</ax-surface>' },
        {
          language: 'css',
          source: '.card {\n  --ax-radius: 26px;\n  --ax-tilt-mode: absolute;\n  --ax-tilt-depth: {{depth}}px;\n}\n\n.button {\n  position: absolute;\n  inset: 0;\n  margin: auto; /* centers the inner surface in the card */\n  --ax-radius: 14px;\n  --ax-tilt-mode: absolute;\n  --ax-tilt-depth: 3px;\n}'
        }
      ]
    },
    {
      id: 'motion',
      title: 'Motion',
      description: [
        'motion() turns the surface in 3D and fades it. It lasts one frame: call it on every frame of an animation, and with null to end it. The preview gives the surface a new state on every frame, from the two sliders: rotateY turns it about its vertical axis, opacity fades it.',
        'The layers follow the motion: the reveal light turns with the surface, and the fade is set on the layer itself, never on an ancestor, so the backdrop of acrylic and reveal stays right.'
      ],
      preview: stage('Turn me'),
      style: `${stageStyle}.shape { --ax-radius: 18px; }`,
      setup: (root) => {
        const surface = root.querySelector<HTMLElement & { motion(state: { rotateY: number; opacity: number } | null): void }>('.shape');
        if (!surface) return;
        let frame = 0;
        const play = () => {
          surface.motion(motionStates.get(root) ?? null);
          frame = requestAnimationFrame(play);
        };
        play();
        return () => {
          cancelAnimationFrame(frame);
          surface.motion(null);
        };
      },
      update: (root, values) => {
        motionStates.set(root, { rotateY: Number(values.rotate), opacity: Number(values.opacity) });
      },
      controls: [
        { key: 'rotate', label: 'Rotate Y', type: 'range', min: -80, max: 80, step: 1, unit: '', default: 30, target: { kind: 'attribute', attribute: 'data-rotate', selector: '.shape' } },
        { key: 'opacity', label: 'Opacity', type: 'range', min: 0, max: 1, step: 0.05, unit: '', default: 1, target: { kind: 'attribute', attribute: 'data-opacity', selector: '.shape' } }
      ],
      code: [
        {
          language: 'js',
          source:
            "const surface = document.querySelector('ax-surface');\n\n// Every frame, with the state of that frame.\nconst frame = () => {\n  surface.motion({ rotateY: {{rotate}}, opacity: {{opacity}} });\n  requestAnimationFrame(frame);\n};\nrequestAnimationFrame(frame);\n\n// Later: surface.motion(null) ends the motion."
        }
      ]
    },
    {
      id: 'press',
      title: 'Press from code',
      description: [
        'press() presses the surface as a pointer press does, for a keyboard activation: the tilt leans and the layers see a pressed pointer. release() ends the press. Use them to show a press from code, such as a button that a keyboard user has activated.',
        'pressRemaining() tells how many milliseconds the press feedback still plays, so that an action can wait for it, as a tile does before it runs its action.'
      ],
      preview: `<div class="stage"><ax-surface class="shape" layers="fill reveal"><span>Press</span></ax-surface><div class="row"><button type="button" data-press>Press</button><button type="button" data-release>Release</button></div></div>`,
      style: `${stageStyle}.shape { --ax-radius: 18px; --ax-tilt-mode: absolute; --ax-tilt-depth: 4px; }
.stage { flex-direction: column; gap: 18px; }
.row { display: flex; gap: 8px; }
.stage button { padding: 6px 14px; font: inherit; font-size: 13px; color: #fff; background: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.5); border-radius: 4px; cursor: pointer; }`,
      setup: (root) => {
        const surface = root.querySelector<HTMLElement & { press(): void; release(): void }>('.shape');
        const press = root.querySelector<HTMLButtonElement>('[data-press]');
        const release = root.querySelector<HTMLButtonElement>('[data-release]');
        if (!surface || !press || !release) return;
        const onPress = () => surface.press();
        const onRelease = () => surface.release();
        press.addEventListener('click', onPress);
        release.addEventListener('click', onRelease);
        return () => {
          press.removeEventListener('click', onPress);
          release.removeEventListener('click', onRelease);
        };
      },
      controls: [],
      code: [
        { language: 'html', source: '<ax-surface class="shape" layers="fill reveal">...</ax-surface>' },
        {
          language: 'js',
          source:
            "const surface = document.querySelector('.shape');\n\nsurface.press();      // the tilt leans, the layers see a pressed pointer\nsurface.release();    // the press ends\n\n// Or let an action wait for the press feedback:\nsurface.press();\nrequestAnimationFrame(() => setTimeout(activate, surface.pressRemaining()));"
        }
      ]
    }
  ],
  reference: [
    { name: 'layers', kind: 'attribute', type: 'space separated names', description: 'The layers the surface draws, in order. fill comes with Surface; elevation, reveal, acrylic and your own registered layers add to it.' },
    { name: 'clip', kind: 'attribute', type: 'boolean', default: 'off', description: 'Cuts the content to the shape. The cut follows the shape and the tilt.' },
    { name: 'observe', kind: 'attribute', type: 'precise', description: 'Use it when a style of yours depends on something a surface cannot see, such as an element inside another component\'s shadow root. Then call refresh() after the change, or let the precise detector watch every style of the page.' },
    { name: '--ax-radius, --ax-corner-*, --ax-edge-*', kind: 'property', type: 'as on the Shape page', description: 'The shape of the surface. Every corner, corner shape, shoulder, shift and side feature is documented on the Shape page (/components/shape).' },
    { name: '--ax-border-width', kind: 'property', type: '<length>', default: '1px', description: 'The width of the border on every side. It stays equally thick on screen while the surface tilts.' },
    { name: '--ax-border-{side}-width', kind: 'property', type: '<length>', default: '-1px', description: 'The width of the border on one side (top, right, bottom, left). A negative value means use --ax-border-width.' },
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
    { name: 'registerLayer(name, create)', kind: 'method', type: '(name: string, create: () => SurfaceLayer) => void', description: 'Registers a layer you wrote, to use in the layers attribute. The name must be new on the page.' },
    { name: 'hasLayer(name)', kind: 'method', type: '(name: string) => boolean', description: 'True when a layer with that name is registered. register() uses it, so two packages may both claim fill.' },
    { name: 'SurfaceLayer', kind: 'property', type: '{ schema?, static?, tracksPointer?, tiltsItself?, reach?, overflow?, attach, detach, write }', description: 'What a layer is. attach gets a container to draw in; write(frame) draws one frame and returns true to ask for another; overflow tells the surface how far outside the shape the layer paints.' },
    { name: 'SurfaceFrame', kind: 'property', type: '{ width, height, paint, shape, borderWidths, uniformBorder, borderInner, ringInner(), tilt, tiltTransform, pointer, values, changed, quality, now }', description: 'What write receives: the resolved shape, the border ring (as an exact stroke when uniformBorder is set, otherwise as inner points), the current tilt, the pointer and the properties, plus a quality hint from the scheduler.' },
    { name: 'AxSurface', kind: 'method', type: 'class', description: 'The element class. Subclass it to make your own element with its own property names: layerNames_() picks the layers, shapeFor() and borderWidthsFor() read the shape, tiltParams() and tiltPerspective() read the tilt, and a unique static schemaKey keeps its schema apart.' },
    { name: 'SHAPE_SCHEMA, BORDER_SCHEMA, TILT_SCHEMA', kind: 'property', type: 'PropertySpec[]', description: 'The three groups of the property contract, exported from the @ax-design/surface/schema subpath: shape, border and tilt. They carry the names, syntax and initial values without the element, for a tool that only needs the contract.' },
    { name: 'SHAPE, BORDER, TILT', kind: 'property', type: '{ read }', description: 'The groups of the property contract, each with the properties to read. A per-side or per-corner property left at its auto initial is resolved to the shared value in JavaScript, so a consumer needs no CSS fallback to reach each side or corner.' },
    { name: 'focus', kind: 'attribute', type: 'layer name', description: 'A layer in the layers attribute: a focus ring that follows the shape, for keyboard focus only (:focus-visible; :-moz-focusring before Firefox 85). The rings are drawn outside the element, so an ancestor with overflow: hidden cuts them.' },
    { name: '--ax-focus-ring-width, --ax-focus-ring-secondary-width', kind: 'property', type: '<length>', default: '2px, 1px', description: 'For the focus layer: the width of the outer (primary) ring and of the inner (secondary) ring.' },
    { name: '--ax-focus-ring-offset', kind: 'property', type: '<length>', default: '0px', description: 'For the focus layer: the gap between the shape and the inner ring.' },
    { name: '--ax-focus-ring-color, --ax-focus-ring-secondary-color', kind: 'property', type: '<color>', default: 'black, rgba(255, 255, 255, 0.6)', description: 'For the focus layer: the colors of the outer and the inner ring. In forced colors mode they are CanvasText and Canvas.' },
    { name: 'motion(state)', kind: 'method', type: '(state: { rotateX?, rotateY?, translateZ?, perspective?, originX?, originY?, scale?, x?, y?, opacity? } | null) => void', description: 'Moves the surface in 3D and fades it, for one frame. rotateX and rotateY (degrees), translateZ (px) and perspective (px, default 1000) turn it about originX and originY (local px, default its center). scale (default 1), x and y (px) enlarge and move it outside the perspective. opacity (0 to 1) fades it. Call it on every frame; null ends the motion.' },
    { name: 'press(point?)', kind: 'method', type: "(point?: 'center' | { x: number; y: number }) => void", description: 'Presses the surface as a pointer press does, for a keyboard activation or from code. Without an argument, or with center, it presses the center of the layout box; with { x, y }, that point in local px. A pointer press in progress wins over it.' },
    { name: 'pressTakenOver', kind: 'property', type: 'boolean', description: 'True after release() ended a pointer press early, until the next press starts. It lets the click after a drag be swallowed.' },
    { name: 'pressRemaining()', kind: 'method', type: '() => number', description: 'The milliseconds until the press feedback has finished: the longest of the layers and the tilt. 0 with reduced motion. Read it after a frame has drawn the press.' },
    { name: 'appearance()', kind: 'method', type: '() => { forcedColors, reducedTransparency, reducedMotion, alwaysUseFallback }', description: 'The display preferences of the user, as the layers see them.' },
    { name: 'setAlwaysUseFallback(on)', kind: 'method', type: '(on: boolean) => void', description: 'Makes the effects with a solid fallback (acrylic, reveal, elevation) use it, as Windows does on battery saver or slow hardware.' },
    { name: 'windowsEasing(id)', kind: 'method', type: '(id: number) => string', description: 'The timing function of the Windows 8 and 8.1 animation theme as CSS. windowsEasing(54) is the Start screen coming in.' },
    { name: 'WINDOWS_EASINGS', kind: 'property', type: 'table', description: 'All twenty curves of the Windows animation theme, by number.' },
    { name: 'parseEasing(value)', kind: 'method', type: '(value: string) => curve', description: 'Reads a CSS timing function (a keyword or cubic-bezier()) for a script animation with requestAnimationFrame.' },
    { name: 'bezierAt(curve, t)', kind: 'method', type: '(curve, t: number) => number', description: 'The progress of a curve from parseEasing() at t, from 0 to 1.' }
  ]
};

export default page;
