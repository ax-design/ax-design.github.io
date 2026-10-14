import type { DocPage } from './types';

// The three items most examples use; the second one says what to pass to select it at the start.
const nav = (attributes = '', second = '<ax-navigation-item>Apps</ax-navigation-item>') =>
  `<div class="stage"><ax-navigation${attributes}>
  <ax-navigation-item>Home</ax-navigation-item>
  ${second}
  <ax-navigation-item>Games</ax-navigation-item>
</ax-navigation></div>`;

const style = `
.stage { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
ax-navigation { font-size: 16px; --navigation-indicator-color: #fff; }
ax-navigation-item { cursor: pointer; }
`;

const page: DocPage = {
  slug: 'navigation',
  name: 'Navigation',
  package: '@ax-design/navigation',
  globalName: 'AxNavigation',
  tagline: 'The selected item of a row or a column of tabs, marked by an indicator that moves like a shape.',
  intro: [
    'ax-navigation marks the selected one of its ax-navigation-item children with an indicator. When you pick another item the indicator stretches toward it and then shrinks onto it, and the two ends move as damped springs, so one can lead while the other follows.',
    'The indicator is a shape of @ax-design/surface, drawn on a canvas. It reads the shape contract (--ax-radius, --ax-corner-* and --ax-edge-{top,right,bottom,left}-*), so any shape of the Shape page (/components/shape) works as an indicator, and a feature can be driven by the movement itself with calc() and the spring values the element writes.',
    'The shape is drawn into a frame that does not depend on the direction: --navigation-indicator-width goes across the bar and the item supplies the length along it. In a vertical navigation top and bottom are still the long sides, top facing the content, and right and left are still the end the indicator moves toward and the end it starts from.'
  ],
  setup: "import { register } from '@ax-design/navigation';\nregister();",
  examples: [
    {
      id: 'horizontal',
      title: 'Horizontal',
      description: [
        'The default is a row of items with the indicator below the selected one. Click an item to move the indicator. --navigation-indicator-color paints it, and --navigation-indicator-width is its thickness.',
        'Without either the vertical or the horizontal attribute the element adds horizontal itself, so a plain ax-navigation is a row.'
      ],
      preview: nav(),
      style,
      controls: [
        { key: 'color', label: 'Color', type: 'color', default: 'rgb(255, 255, 255)', target: { kind: 'css', property: '--navigation-indicator-color', selector: 'ax-navigation' } },
        { key: 'width', label: 'Width', type: 'range', min: 1, max: 10, step: 1, unit: 'px', default: 2, target: { kind: 'css', property: '--navigation-indicator-width', selector: 'ax-navigation' } }
      ],
      code: [
        { language: 'html', source: '<ax-navigation>\n  <ax-navigation-item>Home</ax-navigation-item>\n  <ax-navigation-item>Apps</ax-navigation-item>\n  <ax-navigation-item>Games</ax-navigation-item>\n</ax-navigation>' },
        { language: 'css', source: 'ax-navigation {\n  --navigation-indicator-color: {{color}};\n  --navigation-indicator-width: {{width}};\n}' }
      ]
    },
    {
      id: 'vertical',
      title: 'Vertical',
      description: [
        'Add the vertical attribute and the items stack in a column, with the indicator beside them. --navigation-indicator-speed is the time the indicator takes to travel from one item to another.',
        'The frame turns with the direction, but the shape does not: top and bottom stay the long sides, and top stays the side facing the content.'
      ],
      preview: nav(' vertical'),
      style,
      controls: [
        { key: 'speed', label: 'Speed', type: 'range', min: 100, max: 2000, step: 50, unit: 'ms', default: 600, target: { kind: 'css', property: '--navigation-indicator-speed', selector: 'ax-navigation' } }
      ],
      code: [
        { language: 'html', source: '<ax-navigation vertical>\n  <ax-navigation-item>Home</ax-navigation-item>\n  <ax-navigation-item>Apps</ax-navigation-item>\n  <ax-navigation-item>Games</ax-navigation-item>\n</ax-navigation>' },
        { language: 'css', source: 'ax-navigation {\n  --navigation-indicator-speed: {{speed}};\n}' }
      ]
    },
    {
      id: 'shape',
      title: 'Shape',
      description: [
        'The indicator is a Surface shape, so it takes the same custom properties that a surface takes. Give it a width worth shaping and it can be a pill, a parallelogram or anything else: shift the top left and the bottom right corner on x and the bar slants.',
        'Only the border and the tilt properties of Surface are not read. The frame is --navigation-indicator-width across the bar and the item long, so corners and side features follow the size of the item. The shape is drawn on one canvas at rest and while it moves, so the two always agree.',
        'The layout keeps free the space an outward feature takes on the side away from the content; on the side facing the content the feature draws over the items.'
      ],
      preview: nav(),
      style: `${style}ax-navigation { --navigation-indicator-width: 12px; }`,
      controls: [
        { key: 'shape', label: 'Corner shape', type: 'select', options: ['round', 'bevel', 'scoop', 'notch'], default: 'bevel', target: { kind: 'css', property: '--ax-corner-shape', selector: 'ax-navigation' } },
        { key: 'radius', label: 'Radius', type: 'range', min: 0, max: 6, step: 1, unit: 'px', default: 0, target: { kind: 'css', property: '--ax-radius', selector: 'ax-navigation' } },
        { key: 'shift', label: 'Slant', type: 'range', min: 0, max: 16, step: 1, unit: 'px', default: 8, target: { kind: 'css', property: '--ax-corner-top-left-shift-x', selector: 'ax-navigation' } }
      ],
      code: [
        { language: 'html', source: '<ax-navigation>\n  <ax-navigation-item>Home</ax-navigation-item>\n  <ax-navigation-item>Apps</ax-navigation-item>\n  <ax-navigation-item>Games</ax-navigation-item>\n</ax-navigation>' },
        {
          language: 'css',
          source:
            'ax-navigation {\n  --navigation-indicator-width: 12px;\n  --ax-radius: {{radius}};\n  --ax-corner-shape: {{shape}};\n  --ax-corner-top-left-shift-x: {{shift}};\n  --ax-corner-bottom-right-shift-x: {{shift}};  /* a parallelogram */\n}'
        }
      ],
      update(root, values) {
        // The second control writes the same slant on the opposite corner.
        for (const element of root.querySelectorAll<HTMLElement>('ax-navigation')) {
          element.style.setProperty('--ax-corner-bottom-right-shift-x', values.shift);
        }
      }
    },
    {
      id: 'moving',
      title: 'Moving',
      description: [
        'While the indicator travels, the element carries the moving attribute, forward or backward: forward is toward the end of the item order, right in a row and down in a column. The attribute goes away when the indicator arrives, and an interrupted movement starts over.',
        'The element also writes what each part of the movement is doing. --navigation-indicator-arrival and --navigation-indicator-follow are the times the leading end and the trailing end take. --navigation-indicator-lead and --navigation-indicator-trail are how deformed each end is, as numbers, driven by a spring of its own. The general --navigation-indicator-deform-stiffness and --navigation-indicator-deform-damping set both springs; the lead and trail properties override them for one end.',
        'A feature is shaped from a deformation with calc(), and the shape is read on every frame, which also keeps it working where CSS.registerProperty is missing. Click back and forth: the leading end grows a triangle, the trailing end pulls one in, and the rule for moving="backward" swaps which side is which.'
      ],
      preview: nav(),
      style: `
${style}
ax-navigation { --navigation-indicator-width: 12px; --navigation-indicator-speed: 600ms; }
ax-navigation { --ax-edge-right-kind: triangle; --ax-edge-right-span: 100%; --ax-edge-left-kind: triangle; --ax-edge-left-span: 100%; }
ax-navigation { --ax-edge-right-depth: calc(var(--navigation-indicator-lead, 0) * 9px); --ax-edge-left-depth: calc(var(--navigation-indicator-trail, 0) * -7px); }
ax-navigation[moving="backward"] { --ax-edge-right-depth: calc(var(--navigation-indicator-trail, 0) * -7px); --ax-edge-left-depth: calc(var(--navigation-indicator-lead, 0) * 9px); }
`,
      controls: [
        { key: 'speed', label: 'Speed', type: 'range', min: 100, max: 2000, step: 50, unit: 'ms', default: 600, target: { kind: 'css', property: '--navigation-indicator-speed', selector: 'ax-navigation' } },
        { key: 'stiffness', label: 'Spring stiffness', type: 'range', min: 50, max: 1200, step: 10, unit: '', default: 400, target: { kind: 'css', property: '--navigation-indicator-deform-stiffness', selector: 'ax-navigation' } },
        { key: 'damping', label: 'Damping', type: 'range', min: 5, max: 80, step: 1, unit: '', default: 32, target: { kind: 'css', property: '--navigation-indicator-deform-damping', selector: 'ax-navigation' } }
      ],
      code: [
        {
          language: 'css',
          source:
            'ax-navigation {\n  --navigation-indicator-width: 12px;\n  --navigation-indicator-speed: {{speed}};\n  --navigation-indicator-deform-stiffness: {{stiffness}};\n  --navigation-indicator-deform-damping: {{damping}};\n\n  --ax-edge-right-kind: triangle;\n  --ax-edge-right-span: 100%;\n  --ax-edge-left-kind: triangle;\n  --ax-edge-left-span: 100%;\n  --ax-edge-right-depth: calc(var(--navigation-indicator-lead, 0) * 9px);\n  --ax-edge-left-depth: calc(var(--navigation-indicator-trail, 0) * -7px);\n}\n\n/* Backward, the leading end is the left one. */\nax-navigation[moving="backward"] {\n  --ax-edge-right-depth: calc(var(--navigation-indicator-trail, 0) * -7px);\n  --ax-edge-left-depth: calc(var(--navigation-indicator-lead, 0) * 9px);\n}'
        },
        {
          language: 'js',
          source: "navigation.addEventListener('switch', (event) => {\n  // forward or backward: the way the indicator just went.\n  navigation.getAttribute('moving');\n});"
        }
      ]
    },
    {
      id: 'default',
      title: 'Default item',
      description: [
        'The first item is selected at the start. Add the default attribute to another item to select that one instead.'
      ],
      preview: nav('', '<ax-navigation-item default>Apps</ax-navigation-item>'),
      style,
      controls: [
        { key: 'color', label: 'Color', type: 'color', default: 'rgb(255, 255, 255)', target: { kind: 'css', property: '--navigation-indicator-color', selector: 'ax-navigation' } }
      ],
      code: [
        { language: 'html', source: '<ax-navigation>\n  <ax-navigation-item>Home</ax-navigation-item>\n  <ax-navigation-item default>Apps</ax-navigation-item>\n  <ax-navigation-item>Games</ax-navigation-item>\n</ax-navigation>' },
        { language: 'css', source: 'ax-navigation {\n  --navigation-indicator-color: {{color}};\n}' }
      ]
    },
    {
      id: 'switch',
      title: 'Switch event',
      description: [
        'The ax-navigation element fires a switch event when the indicator goes from one item to another. The detail holds the item before (from) and the item after (to). The event does not bubble and is not cancelable.',
        'Click an item in the preview; the text below shows the last event.'
      ],
      preview: `<div class="stage column"><ax-navigation>
  <ax-navigation-item>Home</ax-navigation-item>
  <ax-navigation-item>Apps</ax-navigation-item>
  <ax-navigation-item>Games</ax-navigation-item>
</ax-navigation><pre class="out">click an item</pre></div>`,
      style: `${style}.column { flex-direction: column; gap: 24px; }
.out { margin: 0; color: #fff; font: 12px/1.5 ui-monospace, Consolas, Menlo, monospace; }`,
      controls: [
        { key: 'width', label: 'Width', type: 'range', min: 1, max: 10, step: 1, unit: 'px', default: 2, target: { kind: 'css', property: '--navigation-indicator-width', selector: 'ax-navigation' } }
      ],
      code: [
        { language: 'js', source: "const navigation = document.querySelector('ax-navigation');\n\nnavigation.addEventListener('switch', (event) => {\n  console.log(event.detail.from.textContent, event.detail.to.textContent);\n});" }
      ],
      setup(root) {
        const navigation = root.querySelector('ax-navigation');
        const out = root.querySelector<HTMLElement>('.out');
        if (!navigation || !out) return;
        const onSwitch = (event: Event) => {
          const detail = (event as CustomEvent<{ from: Element; to: Element }>).detail;
          out.textContent = `switch: ${detail.from.textContent?.trim()} -> ${detail.to.textContent?.trim()}`;
        };
        navigation.addEventListener('switch', onSwitch);
        return () => navigation.removeEventListener('switch', onSwitch);
      }
    }
  ],
  reference: [
    { name: 'horizontal, vertical', kind: 'attribute', type: 'boolean', description: 'On ax-navigation: the direction of the items and of the indicator. Without either the element adds horizontal.' },
    { name: 'default', kind: 'attribute', type: 'boolean', description: 'On ax-navigation-item: the item that is selected at the start. Without it, the first item.' },
    { name: 'moving', kind: 'attribute', type: 'forward | backward', description: 'Written by the element while the indicator travels: forward is toward the end of the item order (right in a row, down in a column), backward the other way. Removed when the indicator arrives. Read it to style the two directions apart.' },
    { name: 'block, inline-block, flex, inline-flex, grid, inline-grid', kind: 'attribute', type: 'boolean', description: 'On ax-navigation or ax-navigation-item: how the element is displayed. A shortcut for a display rule, which an author rule cannot reach into the shadow root.' },
    { name: '--navigation-indicator-speed', kind: 'property', type: '<time>', default: '600ms', description: 'How long the indicator takes to travel from one item to another. The two ends keep their own springs on top of it.' },
    { name: '--navigation-indicator-color', kind: 'property', type: '<color>', default: 'rgb(0, 0, 0)', description: 'The color of the indicator shape.' },
    { name: '--navigation-indicator-width', kind: 'property', type: '<length>', default: '2px', description: 'The thickness of the indicator, across the bar. The length along the bar is the item.' },
    { name: '--ax-radius, --ax-corner-*, --ax-edge-*', kind: 'property', type: 'as on the Shape page', description: 'The shape of the indicator, with the names of the Shape page (/components/shape). The general edge properties set every side at once. The border and tilt properties of Surface are not read.' },
    { name: '--navigation-indicator-arrival, --navigation-indicator-follow', kind: 'property', type: '<time>', default: '0ms', description: 'Written by the element: the time the leading end takes to reach the item, and the time the trailing end takes to follow it. Give an animation the length of the part whose end carries it.' },
    { name: '--navigation-indicator-lead, --navigation-indicator-trail', kind: 'property', type: '<number>', default: '0', description: 'Written by the element: how deformed the leading end and the trailing end are. Shape a feature from them with calc(); the numbers are read on every frame.' },
    { name: '--navigation-indicator-deform-stiffness, --navigation-indicator-deform-damping', kind: 'property', type: '<number>', default: '400, 32', description: 'How hard both springs follow. A larger stiffness makes an end answer sooner; a larger damping makes it settle without overshooting.' },
    { name: '--navigation-indicator-{lead,trail}-stiffness, --navigation-indicator-{lead,trail}-damping', kind: 'property', type: '<number>', default: '-1 (use the general value)', description: 'The spring of one end, overriding the general pair. The trailing end is only asked to follow while the leading end is more than half deformed, so the two overlap.' },
    { name: 'switch', kind: 'event', type: 'CustomEvent<{ from, to }>', description: 'Fired on ax-navigation when the indicator goes to another item. Does not bubble, is not cancelable. from and to are the items.' },
    { name: 'currentItem', kind: 'property', type: 'AxNavigationItem | undefined', description: 'The item the indicator marks. It starts as the item with default, or the first one, and follows the clicks.' },
    { name: 'register()', kind: 'method', type: '() => void', description: 'Defines ax-navigation and ax-navigation-item and registers the shape and spring properties. Safe to call more than once.' },
    { name: 'AxNavigation, AxNavigationItem', kind: 'property', type: 'class', description: 'The two element classes. AxNavigation holds the canvas and the indicator manager; AxNavigationItem knows its container and reports clicks to it.' },
    { name: 'NAVIGATION_PROPERTIES, SPEED_PROPERTY, WINDOW_PROPERTIES', kind: 'property', type: 'PropertySpec[]', description: 'The property contract, for a tool: the properties the element reads, the speed property registered as a <time>, and the arrival, follow, lead and trail properties it writes.' }
  ]
};

export default page;
