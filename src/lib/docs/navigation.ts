import type { DocPage } from './types';

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
  legacy: true,
  tagline: 'A sliding indicator that shows the selected item of a row or a column of tabs.',
  intro: [
    'ax-navigation marks the selected one of its ax-navigation-item children with a line. When you pick another item, the line stretches toward it and then shrinks onto it.',
    'This package is no longer developed. It does not run on Surface and stays as it is.'
  ],
  setup: "import { register } from '@ax-design/navigation';\nregister();",
  examples: [
    {
      id: 'horizontal',
      title: 'Horizontal',
      description: [
        'The default is a row of items with the line below the selected one. Click an item to move the line.',
        'The color and the width of the line are custom properties. The width is its thickness.'
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
        'Add the vertical attribute and the items stack in a column, with the line on the left.',
        'The speed is the time the line takes to move from one item to another.'
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
        'The ax-navigation element fires a switch event when the line goes from one item to another. The detail has the item before (from) and the item after (to). The event does not bubble.'
      ],
      preview: nav(),
      style,
      controls: [
        { key: 'width', label: 'Width', type: 'range', min: 1, max: 10, step: 1, unit: 'px', default: 2, target: { kind: 'css', property: '--navigation-indicator-width', selector: 'ax-navigation' } }
      ],
      code: [
        { language: 'js', source: "const navigation = document.querySelector('ax-navigation');\n\nnavigation.addEventListener('switch', (event) => {\n  console.log(event.detail.from.innerText, event.detail.to.innerText);\n});" }
      ]
    }
  ],
  reference: [
    { name: 'vertical', kind: 'attribute', type: 'boolean', default: 'off', description: 'On ax-navigation: a column of items with the line on the left. Without it (or with horizontal) the items are in a row.' },
    { name: 'default', kind: 'attribute', type: 'boolean', description: 'On ax-navigation-item: the item that is selected at the start. Without it, the first item.' },
    { name: '--navigation-indicator-speed', kind: 'property', type: '<time>', default: '600ms', description: 'How long the line takes to move to another item.' },
    { name: '--navigation-indicator-color', kind: 'property', type: '<color>', default: 'black', description: 'The color of the line.' },
    { name: '--navigation-indicator-width', kind: 'property', type: '<length>', default: '2px', description: 'The thickness of the line.' },
    { name: 'switch', kind: 'event', type: 'CustomEvent<{ from, to }>', description: 'Fired on ax-navigation when the line goes to another item. Does not bubble, is not cancelable. from and to are the items.' }
  ]
};

export default page;
