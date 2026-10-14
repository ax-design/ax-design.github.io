import type { DocPage } from './types';

const tiles = (extra = '') => `<ax-tile columns="4" rows="2" layers="fill reveal" class="first"${extra}><img class="icon" src="/demo/images/apple.svg" alt=""><span class="label">Apple</span></ax-tile>
  <ax-tile columns="2" rows="2" layers="fill reveal"><img class="icon" src="/demo/images/tea.svg" alt=""></ax-tile>
  <ax-tile columns="2" rows="2" layers="fill reveal"><img class="icon" src="/demo/images/fish.svg" alt=""></ax-tile>
  <ax-tile columns="2" rows="2" layers="fill reveal"><img class="icon" src="/demo/images/donut.svg" alt=""></ax-tile>
  <ax-tile columns="1" rows="1" layers="fill reveal"></ax-tile>
  <ax-tile columns="1" rows="1" layers="fill reveal"></ax-tile>
  <ax-tile columns="1" rows="1" layers="fill reveal"></ax-tile>
  <ax-tile columns="1" rows="1" layers="fill reveal"></ax-tile>
  <ax-tile columns="2" rows="2" layers="fill reveal"><img class="icon" src="/demo/images/apple.svg" alt=""></ax-tile>`;

const group = (attributes = '', extra = '') => `<div class="stage"><ax-tile-group${attributes}>
  ${tiles(extra)}
</ax-tile-group></div>`;

const style = (extra = '') => `
.stage { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; overflow: hidden; }
ax-tile-group { --tile-cell-width: 24px; --tile-cell-height: 24px; --tile-gap: 4px; --tile-rows: 4; ${extra} }
ax-tile { color: #fff; --ax-fill-color: rgba(255, 255, 255, 0.2); --reveal-color: rgb(255, 255, 255); --reveal-opacity: 0.35; }
.icon { position: absolute; left: 50%; top: 50%; width: 60%; height: 60%; transform: translate(-50%, -50%); pointer-events: none; }
.label { position: absolute; left: 6px; bottom: 3px; font-size: 11px; }
`;

const page: DocPage = {
  slug: 'tile-group',
  name: 'Tile Group',
  package: '@ax-design/tile-group',
  globalName: 'AxTileGroup',
  tagline: 'Tiles of any size on a grid, reordered by dragging while the others make room.',
  intro: [
    'Tile Group follows the Start screen of Windows 8. Tiles of any size sit on a grid of cells. You drag a tile to a new place and the other tiles move out of its way.',
    'ax-tile is an ax-surface, so the layers, shapes and tilt of Surface work on it. Tiles tilt when pressed and have a 2px border for the reveal light out of the box; any style of yours wins over both. In the examples below the cells are small, so a group fits next to this text.'
  ],
  setup: "import { register } from '@ax-design/tile-group';\nregister();",
  examples: [
    {
      id: 'sizes',
      title: 'Tile sizes',
      description: [
        'The columns and rows attributes give the size of a tile in cells. A medium tile is two by two cells, which is also the size of any other element in the group that has no attributes.',
        'Change the size of the first tile and the other tiles move. The order of the children is the order of the tiles: each tile takes the first free place after the one before it.'
      ],
      preview: group(),
      style: style(),
      controls: [
        { key: 'columns', label: 'Columns of the first tile', type: 'select', options: ['1', '2', '4'], default: '4', target: { kind: 'attribute', attribute: 'columns', selector: '.first' } },
        { key: 'rows', label: 'Rows of the first tile', type: 'select', options: ['1', '2', '4'], default: '2', target: { kind: 'attribute', attribute: 'rows', selector: '.first' } }
      ],
      code: [
        { language: 'html', source: '<ax-tile-group>\n  <ax-tile columns="{{columns}}" rows="{{rows}}" layers="fill reveal">Apple</ax-tile>\n  <ax-tile columns="2" rows="2" layers="fill reveal">Tea</ax-tile>\n  <ax-tile columns="1" rows="1" layers="fill reveal"></ax-tile>\n</ax-tile-group>' }
      ]
    },
    {
      id: 'cells',
      title: 'Cell size and gap',
      description: [
        'A cell is a small tile. Its size and the gap between cells are custom properties. The defaults are 70px and 10px; the group here uses much less.',
        'The size of a tile is its cells plus the gaps between them, so a medium tile is two cells and one gap wide.'
      ],
      preview: group(),
      style: style(),
      controls: [
        { key: 'width', label: 'Cell width', type: 'range', min: 12, max: 32, step: 1, unit: 'px', default: 24, target: { kind: 'css', property: '--tile-cell-width', selector: 'ax-tile-group' } },
        { key: 'height', label: 'Cell height', type: 'range', min: 12, max: 32, step: 1, unit: 'px', default: 24, target: { kind: 'css', property: '--tile-cell-height', selector: 'ax-tile-group' } },
        { key: 'gap', label: 'Gap', type: 'range', min: 0, max: 12, step: 1, unit: 'px', default: 4, target: { kind: 'css', property: '--tile-gap', selector: 'ax-tile-group' } }
      ],
      code: [{ language: 'css', source: 'ax-tile-group {\n  --tile-cell-width: {{width}};\n  --tile-cell-height: {{height}};\n  --tile-gap: {{gap}};\n}' }]
    },
    {
      id: 'rows',
      title: 'Rows and strips',
      description: [
        'A horizontal group has a fixed number of rows and grows to the right, like the Start screen. Fewer rows make a longer group.',
        'The strip decides the order in which tiles fill the group. 4 fills columns four cells wide, row by row, so two medium tiles sit side by side. 1 fills column by column, top to bottom, as WinJS does; tiles jump around much more while you drag.'
      ],
      preview: group(' strip="4"'),
      style: style(),
      controls: [
        { key: 'rows', label: 'Rows', type: 'range', min: 2, max: 8, step: 1, unit: '', default: 4, target: { kind: 'css', property: '--tile-rows', selector: 'ax-tile-group' } },
        { key: 'strip', label: 'Strip', type: 'select', options: ['4', '1'], default: '4', target: { kind: 'attribute', attribute: 'strip', selector: 'ax-tile-group' } }
      ],
      code: [
        { language: 'html', source: '<ax-tile-group strip="{{strip}}">...</ax-tile-group>' },
        { language: 'css', source: 'ax-tile-group {\n  --tile-rows: {{rows}};\n}' }
      ]
    },
    {
      id: 'drag',
      title: 'Dragging',
      description: [
        'The drag attribute turns dragging on. With press, a tile follows the pointer as soon as it moves. With hold, it lifts after a press of hold-delay milliseconds, and a quick move scrolls the page instead. With cross-slide, it is the touch gesture of Windows 8 for a group in a horizontal scroller (see Scroll). Press Escape during a drag to put everything back.',
        'The group fires events on the tile. Cancel tiledragstart to keep a tile in place, or cancel tilereorder to put it back.'
      ],
      preview: group(' drag="press"'),
      style: style(),
      controls: [
        { key: 'drag', label: 'Drag', type: 'select', options: ['press', 'hold', 'none'], default: 'press', target: { kind: 'attribute', attribute: 'drag', selector: 'ax-tile-group' } },
        { key: 'delay', label: 'Hold delay', type: 'range', min: 100, max: 1500, step: 50, unit: '', default: 500, target: { kind: 'attribute', attribute: 'hold-delay', selector: 'ax-tile-group' } }
      ],
      code: [
        { language: 'html', source: '<ax-tile-group drag="{{drag}}" hold-delay="{{delay}}" contextmenu>\n  ...\n</ax-tile-group>' },
        {
          language: 'js',
          source: "group.addEventListener('tilereorder', (event) => {\n  console.log(event.detail.from, event.detail.to);\n});\n\ngroup.addEventListener('tilecontextmenu', (event) => {\n  // Show your own menu at event.detail.clientX, clientY.\n});"
        }
      ]
    },
    {
      id: 'vertical',
      title: 'Vertical group',
      description: [
        'With orientation="vertical" the group has a fixed number of columns and grows downward, like the groups of the Windows 10 Start menu. Use --tile-columns instead of --tile-rows. Everything else, dragging included, works the same.',
        'In a vertical group the default strip is 2: it fills rows one medium tile tall, left to right.'
      ],
      preview: `<div class="stage vertical"><ax-tile-group orientation="vertical" drag="press">
  ${tiles()}
</ax-tile-group></div>`,
      style: style('--tile-columns: 6;') + '.vertical ax-tile-group { align-self: flex-start; margin-top: 16px; }',
      controls: [
        { key: 'columns', label: 'Columns', type: 'range', min: 2, max: 10, step: 1, unit: '', default: 6, target: { kind: 'css', property: '--tile-columns', selector: 'ax-tile-group' } }
      ],
      code: [
        { language: 'html', source: '<ax-tile-group orientation="vertical" drag="press">...</ax-tile-group>' },
        { language: 'css', source: 'ax-tile-group {\n  --tile-columns: {{columns}};\n}' }
      ]
    }
  ],
  reference: [
    { name: 'columns', kind: 'attribute', type: '<integer>', default: '2', description: 'On a tile: its width in cells. Change it and the other tiles move.' },
    { name: 'rows', kind: 'attribute', type: '<integer>', default: '2', description: 'On a tile: its height in cells.' },
    { name: 'drag', kind: 'attribute', type: 'press | hold | cross-slide | none', default: 'none', description: 'On the group: how tiles are dragged. press follows the pointer at once, hold lifts after hold-delay, cross-slide is the Windows 8 touch gesture for a horizontal scroller.' },
    { name: 'hold-delay', kind: 'attribute', type: '<number>', default: '500', description: 'Milliseconds of a press before it counts as held.' },
    { name: 'contextmenu', kind: 'attribute', type: 'boolean', description: 'Fire tilecontextmenu on a right click, the context menu key, and a touch or pen press held for hold-delay milliseconds and released without moving. The group shows no menu.' },
    { name: 'orientation', kind: 'attribute', type: 'horizontal | vertical', default: 'horizontal', description: 'horizontal: a fixed number of rows, the group grows to the right. vertical: a fixed number of columns, the group grows downward.' },
    { name: 'strip', kind: 'attribute', type: '<integer>', default: '4 (vertical: 2)', description: 'The order in which tiles fill the group. 4 fills columns four cells wide row by row, 1 fills column by column (WinJS). In a vertical group strips are rows.' },
    { name: 'grouping', kind: 'attribute', type: 'string', description: 'Reserved for dragging tiles onto each other to form groups. It fires no events yet.' },
    { name: '--tile-cell-width, --tile-cell-height', kind: 'property', type: '<length>', default: '70px', description: 'The size of a cell, a small tile. A medium tile is two by two cells.' },
    { name: '--tile-gap', kind: 'property', type: '<length>', default: '10px', description: 'The space between cells.' },
    { name: '--tile-rows', kind: 'property', type: '<number> | auto', default: '6', description: 'The rows of cells in a horizontal group. With auto, the group takes as many rows as its height holds.' },
    { name: '--tile-columns', kind: 'property', type: '<number> | auto', default: '6', description: 'The columns of cells in a vertical group. With auto, the group takes as many columns as its width holds.' },
    { name: '--tile-drag-opacity', kind: 'property', type: '<number>', default: '0.65', description: 'The opacity of a dragged tile. It is inherited, so set it on the group or on one tile. Set it to 1 for tiles with acrylic or another backdrop-filter: an element with an opacity below 1 is a backdrop root, so the filter inside it sees nothing behind the tile and the glass turns clear while the tile is dragged.' },
    { name: 'tiledragstart', kind: 'event', type: 'CustomEvent', description: 'A drag starts. Fired on the tile, bubbles. Cancel it to keep the tile in place.' },
    { name: 'tilereorder', kind: 'event', type: 'CustomEvent<{ from, to }>', description: 'A tile was dropped at a new place. Cancel it to put the tile back.' },
    { name: 'tiledragend', kind: 'event', type: 'CustomEvent<{ from, to }>', description: 'The drag is over. from and to are equal when nothing moved.' },
    { name: 'tilecontextmenu', kind: 'event', type: 'CustomEvent<{ clientX, clientY, pointerType }>', description: 'pointerType is mouse, touch, pen or keyboard.' },
    { name: 'refresh()', kind: 'method', type: '() => void', description: 'Reads the custom properties again, for changes nothing reports.' }
  ]
};

export default page;
