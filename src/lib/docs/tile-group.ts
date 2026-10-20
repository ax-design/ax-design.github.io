import type { DocPage } from './types';

const tiles = (extra = '') => `<ax-tile columns="4" rows="2" layers="fill reveal" class="first"${extra}><span class="icon" style="--icon: url(/demo/images/apple.svg)"></span><span class="label">Apple</span></ax-tile>
  <ax-tile columns="2" rows="2" layers="fill reveal"><span class="icon" style="--icon: url(/demo/images/tea.svg)"></span></ax-tile>
  <ax-tile columns="2" rows="2" layers="fill reveal"><span class="icon" style="--icon: url(/demo/images/fish.svg)"></span></ax-tile>
  <ax-tile columns="2" rows="2" layers="fill reveal"><span class="icon" style="--icon: url(/demo/images/donut.svg)"></span></ax-tile>
  <ax-tile columns="1" rows="1" layers="fill reveal"></ax-tile>
  <ax-tile columns="1" rows="1" layers="fill reveal"></ax-tile>
  <ax-tile columns="1" rows="1" layers="fill reveal"></ax-tile>
  <ax-tile columns="1" rows="1" layers="fill reveal"></ax-tile>
  <ax-tile columns="2" rows="2" layers="fill reveal"><span class="icon" style="--icon: url(/demo/images/apple.svg)"></span></ax-tile>`;

const group = (attributes = '', extra = '') => `<div class="stage"><ax-tile-group${attributes}>
  ${tiles(extra)}
</ax-tile-group></div>`;

const entranceTiles = `<ax-tile columns="4" rows="2" layers="fill reveal" class="first"><span class="icon" style="--icon: url(/demo/images/apple.svg)"></span></ax-tile>
  <ax-tile columns="2" rows="2" layers="fill reveal"><span class="icon" style="--icon: url(/demo/images/tea.svg)"></span></ax-tile>
  <ax-tile columns="2" rows="2" layers="fill reveal"><span class="icon" style="--icon: url(/demo/images/fish.svg)"></span></ax-tile>
  <ax-tile columns="2" rows="2" layers="fill reveal"><span class="icon" style="--icon: url(/demo/images/donut.svg)"></span></ax-tile>
  <ax-tile columns="1" rows="1" layers="fill reveal"></ax-tile>
  <ax-tile columns="1" rows="1" layers="fill reveal"></ax-tile>`;

// Two small groups in one boundary: four cells wide each, so a band is one group.
const smallGroup = (icons: string[]) => `<ax-tile-group>
    <ax-tile columns="2" rows="2" layers="fill reveal"><span class="icon" style="--icon: url(/demo/images/${icons[0]})"></span></ax-tile>
    <ax-tile columns="2" rows="2" layers="fill reveal"><span class="icon" style="--icon: url(/demo/images/${icons[1]})"></span></ax-tile>
    <ax-tile columns="1" rows="1" layers="fill reveal"></ax-tile>
    <ax-tile columns="1" rows="1" layers="fill reveal"></ax-tile>
  </ax-tile-group>`;

const launchTiles = `<ax-tile columns="4" rows="2" layers="fill reveal" class="app"><button slot="action" type="button">Mail</button><template slot="splash"><img src="/demo/images/apple.svg" alt="" width="64"></template></ax-tile>
  <ax-tile columns="2" rows="2" layers="fill reveal"><span class="icon" style="--icon: url(/demo/images/tea.svg)"></span></ax-tile>
  <ax-tile columns="2" rows="2" layers="fill reveal"><span class="icon" style="--icon: url(/demo/images/fish.svg)"></span></ax-tile>
  <ax-tile columns="2" rows="2" layers="fill reveal"><span class="icon" style="--icon: url(/demo/images/donut.svg)"></span></ax-tile>
  <ax-tile columns="1" rows="1" layers="fill reveal"></ax-tile>
  <ax-tile columns="1" rows="1" layers="fill reveal"></ax-tile>`;

const style = (extra = '') => `
.stage { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; overflow: hidden; }
ax-tile-group { --tile-cell-width: 24px; --tile-cell-height: 24px; --tile-gap: 4px; --tile-rows: 4; ${extra} }
ax-tile { color: #fff; --ax-fill-color: rgba(255, 255, 255, 0.2); --reveal-color: rgb(255, 255, 255); --reveal-opacity: 0.35; }
.icon { position: absolute; left: 50%; top: 50%; width: 60%; height: 60%; transform: translate(-50%, -50%); pointer-events: none; background: currentColor; -webkit-mask: var(--icon) center / contain no-repeat; mask: var(--icon) center / contain no-repeat; }
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
    'ax-tile comes from @ax-design/tile, and is an ax-surface, so the layers, shapes and tilt of Surface work on it. A tile has a 2px border for the reveal light out of the box; any style of yours wins over it. A group lays out any children and reads the columns and rows of each one.',
    'A tile is pressed only when it has an action: a link or a button in its light DOM with slot="action". Only then does it tilt and light up, and its action runs once the press has been seen (see the Tile page at /components/tile/). Most examples below have no action, so their tiles are static: they show the layout and the dragging, and nothing more. In the examples the cells are small, so a group fits next to this text.',
    'The group also plays an entrance and a launch. The Start screen of the lab (/lab/start/) is built from tile groups in a boundary, with launches.'
  ],
  setup: "import { register } from '@ax-design/tile-group';\nimport { register as registerTile } from '@ax-design/tile';\nregister();\nregisterTile();",
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
    },
    {
      id: 'entrance',
      title: 'Entrance',
      description: [
        'Set --tile-entrance to desktop or mobile and the group plays an entrance the first time it comes into view. desktop is the entrance of the Windows 8 Start screen: the tiles enter in bands, each band growing and fading in. mobile is the turnstile of Windows Phone: each tile turns to face you.',
        'Press Play to play it again: exit() plays the matching exit, and enter() plays the entrance once the exit is over. The controls below set the desktop entrance.'
      ],
      preview: `<div class="stage"><ax-tile-group class="entrance">
  ${entranceTiles}
</ax-tile-group><button class="play" type="button">Play</button></div>`,
      style: style() + `
.play { position: absolute; left: 8px; bottom: 8px; padding: 4px 10px; font: inherit; font-size: 12px; color: #fff; background: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.5); border-radius: 4px; cursor: pointer; }
`,
      setup: (root) => {
        const group = root.querySelector<HTMLElement & { enter(): Promise<void>; exit(): Promise<void> }>('ax-tile-group');
        const play = root.querySelector<HTMLButtonElement>('.play');
        if (!group || !play) return;
        const replay = () => {
          void group.exit().then(() => group.enter());
        };
        play.addEventListener('click', replay);
        return () => play.removeEventListener('click', replay);
      },
      controls: [
        { key: 'entrance', label: 'Entrance', type: 'select', options: ['desktop', 'mobile'], default: 'desktop', target: { kind: 'css', property: '--tile-entrance', selector: 'ax-tile-group' } },
        { key: 'stagger', label: 'Stagger', type: 'range', min: 0, max: 120, step: 5, unit: 'ms', default: 35, target: { kind: 'css', property: '--tile-enter-stagger', selector: 'ax-tile-group' } },
        { key: 'delay', label: 'Delay', type: 'range', min: 0, max: 600, step: 20, unit: 'ms', default: 0, target: { kind: 'css', property: '--tile-enter-delay', selector: 'ax-tile-group' } },
        { key: 'spread', label: 'Spread', type: 'range', min: 0, max: 2, step: 0.01, unit: '', default: 0.93, target: { kind: 'css', property: '--tile-enter-spread', selector: 'ax-tile-group' } },
        { key: 'band', label: 'Columns in a band', type: 'range', min: 1, max: 8, step: 1, unit: '', default: 4, target: { kind: 'css', property: '--tile-enter-band', selector: 'ax-tile-group' } }
      ],
      code: [
        {
          language: 'css',
          source: 'ax-tile-group {\n  --tile-entrance: {{entrance}};\n  --tile-enter-stagger: {{stagger}};\n  --tile-enter-delay: {{delay}};\n  --tile-enter-spread: {{spread}};\n  --tile-enter-band: {{band}};\n}\n\n@media (max-width: 600px) {\n  ax-tile-group { --tile-entrance: mobile; }\n}'
        },
        { language: 'js', source: 'await group.exit();\nawait group.enter();' }
      ]
    },
    {
      id: 'bound',
      title: 'Start screen boundary',
      description: [
        'Each group enters on its own by default, its bands growing about its own middle. Put groups in an ax-tile-bound and they enter as one: the bands of the second group go on from those of the first, and every band grows about the middle of all the groups.',
        'The two groups here are small. They enter when the preview comes into view, and the boundary draws nothing itself.'
      ],
      preview: `<div class="stage"><ax-tile-bound class="bound">
  ${smallGroup(['apple.svg', 'tea.svg'])}
  ${smallGroup(['fish.svg', 'donut.svg'])}
</ax-tile-bound></div>`,
      style: style() + `
.bound { display: flex; align-items: center; gap: 16px; --tile-entrance: desktop; --tile-enter-delay: 120ms; }
`,
      controls: [],
      code: [
        {
          language: 'html',
          source: '<ax-tile-bound>\n  <ax-tile-group>...</ax-tile-group>\n  <ax-tile-group>...</ax-tile-group>\n</ax-tile-bound>'
        },
        { language: 'css', source: 'ax-tile-bound {\n  display: flex;\n  --tile-entrance: desktop;\n  --tile-enter-delay: 120ms;\n}' }
      ]
    },
    {
      id: 'launch',
      title: 'Launch',
      description: [
        'When a tile is launched, the other tiles of every group shrink toward the middle of the screen and fade, as the Start screen of Windows does. The launched tile is left as it is, and the tiles come back when the launch ends.',
        'The launch is the tile itself: see the Tile page (/components/tile/). This example holds the splash for 1.2 seconds, as an app does while it loads.'
      ],
      preview: `<div class="stage"><ax-tile-group class="launch">
  ${launchTiles}
</ax-tile-group></div>`,
      style: style() + `
.launch [slot="action"] { font: inherit; font-size: 11px; color: inherit; background: none; border: 0; padding: 0; }
.app { --ax-tile-launch: flip; }
`,
      setup: (root) => {
        // The app is ready after 1.2 s: the splash, and the shrinking of the others, last that long.
        const onActivate = (event: Event) => {
          (event as CustomEvent<{ hold: (promise: Promise<void>) => void }>).detail.hold(
            new Promise((resolve) => setTimeout(resolve, 1200))
          );
        };
        root.addEventListener('tilelaunchactivate', onActivate);
        return () => root.removeEventListener('tilelaunchactivate', onActivate);
      },
      controls: [
        { key: 'scale', label: 'Scale of the others', type: 'range', min: 0.5, max: 1, step: 0.05, unit: '', default: 0.9, target: { kind: 'css', property: '--tile-launch-exit-scale', selector: 'ax-tile-group' } },
        { key: 'duration', label: 'Duration', type: 'range', min: 0, max: 600, step: 20, unit: 'ms', default: 100, target: { kind: 'css', property: '--tile-launch-exit-duration', selector: 'ax-tile-group' } }
      ],
      code: [
        { language: 'html', source: '<ax-tile class="app" layers="fill reveal">\n  <a slot="action" href="/mail">Mail</a>\n</ax-tile>' },
        { language: 'css', source: '.app {\n  --ax-tile-launch: flip;\n}\n\nax-tile-group {\n  --tile-launch-exit-scale: {{scale}};\n  --tile-launch-exit-duration: {{duration}};\n}' }
      ]
    }
  ],
  reference: [
    { name: 'columns', kind: 'attribute', type: '<integer>', default: '2', description: 'On a child of the group, usually an ax-tile: its width in cells. Change it and the other tiles move.' },
    { name: 'rows', kind: 'attribute', type: '<integer>', default: '2', description: 'On a child of the group: its height in cells.' },
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
    { name: 'refresh()', kind: 'method', type: '() => void', description: 'Reads the custom properties again, for changes nothing reports.' },
    { name: '--tile-entrance', kind: 'property', type: 'desktop | mobile | none', default: 'none', description: 'The entrance the group plays the first time it is visible, and on a restore after a launch. desktop is the Start screen of Windows 8, mobile the turnstile of Windows Phone. Inherited; a media query may switch it.' },
    { name: '--tile-enter-band', kind: 'property', type: '<integer>', default: '4 (the strip)', description: 'The columns in a band of the desktop entrance. With orientation="vertical" it counts rows.' },
    { name: '--tile-enter-spread', kind: 'property', type: '<number>', default: '0.93', description: 'Where the bands start, as a share of their distance from the middle of the viewport.' },
    { name: '--tile-enter-offset', kind: 'property', type: '<length>', default: '1% of the width of the viewport', description: 'How much further to the right the bands of the desktop entrance start.' },
    { name: '--tile-enter-duration', kind: 'property', type: '<time>', default: '530ms', description: 'The move of a band in the desktop entrance.' },
    { name: '--tile-enter-easing', kind: 'property', type: '<timing function>', default: 'cubic-bezier(0.17, 0.55, 0.3, 0.95)', description: 'The curve of the move of a band.' },
    { name: '--tile-enter-scale', kind: 'property', type: '<number>', default: '0.8', description: 'The scale a band starts at, before it grows to full size.' },
    { name: '--tile-enter-scale-duration', kind: 'property', type: '<time>', default: '450ms', description: 'The growth of a band to its full size.' },
    { name: '--tile-enter-scale-easing', kind: 'property', type: '<timing function>', default: 'cubic-bezier(0.1, 0.9, 0.2, 1)', description: 'The curve of the growth of a band.' },
    { name: '--tile-enter-fade', kind: 'property', type: '<time>', default: '133ms', description: 'The fade in of a band. Linear.' },
    { name: '--tile-enter-stagger', kind: 'property', type: '<time>', default: '35ms', description: 'The delay between two bands.' },
    { name: '--tile-enter-delay', kind: 'property', type: '<time>', default: '0ms', description: 'The delay before the first band. In an ax-tile-bound, set it once on the boundary: it is inherited, and each group reads it as its own.' },
    { name: '--tile-exit-duration', kind: 'property', type: '<time>', default: '200ms', description: 'The fade of the exit of the desktop entrance, which does not move.' },
    { name: '--tile-turnstile-perspective', kind: 'property', type: '<length>', default: '1000px', description: 'The perspective of the turn of a tile in the mobile entrance.' },
    { name: '--tile-turnstile-origin', kind: 'property', type: '<length>', default: '0px', description: 'How far to the left of the viewport\'s left edge the axis of the turn is. WinJS uses 40px.' },
    { name: '--tile-turnstile-duration', kind: 'property', type: '<time>', default: '600ms', description: 'The turn of each tile in the mobile entrance.' },
    { name: '--tile-turnstile-easing', kind: 'property', type: '<timing function>', default: 'cubic-bezier(0.22, 1, 0.36, 1)', description: 'The curve of the turn: easeOutQuint.' },
    { name: '--tile-launch-exit-scale', kind: 'property', type: '<number>', default: '0.9', description: 'The scale the other tiles shrink to when a tile is launched.' },
    { name: '--tile-launch-exit-duration', kind: 'property', type: '<time>', default: '100ms', description: 'The shrink and fade of the other tiles when a tile is launched.' },
    { name: 'enter(options?)', kind: 'method', type: '({ variant?: desktop | mobile }) => Promise<void>', description: 'Plays the entrance by hand. Resolves when the last tile has arrived. variant overrides --tile-entrance; without it the property decides, and desktop is used when it is none.' },
    { name: 'exit(options?)', kind: 'method', type: '({ variant?: desktop | mobile }) => Promise<void>', description: 'Plays the matching exit. Resolves when the last tile has gone. The tiles stay invisible until the next enter() or a re-layout.' },
    { name: 'ax-tile-bound', kind: 'attribute', type: 'element', description: 'Couples the groups inside it, at any depth, so that their desktop entrances run as one wave. It draws nothing and has no styles of its own.' },
    { name: 'tilelaunchstart', kind: 'event', type: 'CustomEvent', description: 'Fired by the launching tile (see the Tile page). The other tiles of every group shrink and fade. Cancel it and the launch stops.' },
    { name: 'tilelaunchend', kind: 'event', type: 'CustomEvent<{ reason }>', description: 'Fired by the launching tile when the launch is over. The groups restore the tiles at once, and play the entrance again when --tile-entrance sets a variant.' }
  ]
};

export default page;
