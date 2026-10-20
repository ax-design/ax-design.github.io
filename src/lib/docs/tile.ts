import type { DocPage } from './types';

// One tile in the middle of the preview. Its action is a button, so that a click in the preview
// runs nothing that leaves the page.
const tile = (attributes = '', extra = '') =>
  `<div class="stage"><ax-tile class="tile"${attributes} layers="fill reveal"><button slot="action" type="button">Mail</button>${extra}</ax-tile></div>`;

const style = `
.stage { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
.tile { display: block; width: 200px; height: 200px; color: #fff; --ax-fill-color: rgba(255, 255, 255, 0.2); --reveal-color: rgb(255, 255, 255); --reveal-opacity: 0.35; }
.tile [slot="action"] { font: inherit; font-size: 15px; color: inherit; background: none; border: 0; padding: 0; }
`;

const splash = '<template slot="splash"><img src="/demo/images/apple.svg" alt="" width="96"></template>';

const page: DocPage = {
  slug: 'tile',
  name: 'Tile',
  package: '@ax-design/tile',
  globalName: 'AxTile',
  tagline: 'A tile with one action: it shows the press before the action runs, and it can launch its app with the flip of Windows 8.',
  intro: [
    'A tile is the box of the Start screen of Windows 8. It has one action, a link or a button with slot="action". The action covers the whole tile and its text is the name of the tile. Anything else in the tile tilts with it.',
    'A tile with an action is pressed: it tilts and lights up, and the action runs once that press has been seen. A tile with --ax-tile-launch set to flip launches its app instead, with the splash of the app, as Windows 8 does. The Start screen of the lab (/lab/start/) puts tiles and groups together.',
    'ax-tile is an ax-surface from @ax-design/surface, so the layers, shapes and tilt of Surface work on it. Put the tiles in an ax-tile-group from @ax-design/tile-group to lay them out and drag them.'
  ],
  setup: "import { register } from '@ax-design/tile';\nregister();",
  examples: [
    {
      id: 'action',
      title: 'Press and activation',
      description: [
        'Press the tile. It tilts and lights up, and the button runs its action after the press has been seen. A link works the same way: it navigates once the press is over, so it does not leave under the finger.',
        'The longest wait is capped by --ax-tile-activation-delay-max. It is none by default, which means no cap; here it is set to a value you can change.'
      ],
      preview: tile(),
      style,
      controls: [
        { key: 'delay', label: 'Longest wait', type: 'range', min: 0, max: 400, step: 20, unit: 'ms', default: 400, target: { kind: 'css', property: '--ax-tile-activation-delay-max', selector: '.tile' } }
      ],
      code: [
        { language: 'html', source: '<ax-tile layers="fill reveal">\n  <a slot="action" href="/mail">Mail</a>\n</ax-tile>' },
        { language: 'css', source: '.tile {\n  --ax-tile-activation-delay-max: {{delay}};\n}' }
      ]
    },
    {
      id: 'launch',
      title: 'Launch with the flip',
      description: [
        'With --ax-tile-launch set to flip, a click launches the app: the tile turns edge-on and grows to the whole page, and the splash of the app turns to face the viewer. The splash is the content of the splash template, on the color of the tile or the color you set.',
        'This example waits 1.2 seconds, as an app does while it loads, and then the splash goes. Click again once it is gone. The action is a button here, so nothing navigates away.'
      ],
      preview: tile(' class="app"', splash),
      style: `${style}.app { --ax-tile-launch: flip; }`,
      setup: (root) => {
        const app = root.querySelector<HTMLElement>('.app');
        if (!app) return;
        // The app is ready after 1.2 s: the splash stays until the promise settles.
        const onActivate = (event: Event) => {
          (event as CustomEvent<{ hold: (promise: Promise<void>) => void }>).detail.hold(
            new Promise((resolve) => setTimeout(resolve, 1200))
          );
        };
        app.addEventListener('tilelaunchactivate', onActivate);
        return () => app.removeEventListener('tilelaunchactivate', onActivate);
      },
      controls: [
        { key: 'color', label: 'Splash color', type: 'color', default: '#0078d7', target: { kind: 'css', property: '--ax-tile-splash-color', selector: '.app' } },
        { key: 'hold', label: 'Splash hold', type: 'range', min: 0, max: 2000, step: 100, unit: 'ms', default: 500, target: { kind: 'css', property: '--ax-tile-splash-hold', selector: '.app' } },
        { key: 'fade', label: 'Splash fade', type: 'range', min: 0, max: 1000, step: 20, unit: 'ms', default: 167, target: { kind: 'css', property: '--ax-tile-splash-fade', selector: '.app' } },
        { key: 'timeout', label: 'Splash timeout', type: 'range', min: 1000, max: 10000, step: 500, unit: 'ms', default: 5000, target: { kind: 'css', property: '--ax-tile-splash-timeout', selector: '.app' } }
      ],
      code: [
        {
          language: 'html',
          source: '<ax-tile class="app" layers="fill reveal">\n  <a slot="action" href="/mail">Mail</a>\n  <template slot="splash"><img src="mail-logo.svg" alt="" width="96"></template>\n</ax-tile>'
        },
        {
          language: 'css',
          source: '.app {\n  --ax-tile-launch: flip;\n  --ax-tile-splash-color: {{color}};\n  --ax-tile-splash-hold: {{hold}};\n  --ax-tile-splash-fade: {{fade}};\n  --ax-tile-splash-timeout: {{timeout}};\n}'
        },
        {
          language: 'js',
          source: "tile.addEventListener('tilelaunchactivate', (event) => {\n  // A promise of your app, settled when its first screen is ready.\n  event.detail.hold(appReady);\n});"
        }
      ]
    },
    {
      id: 'routers',
      title: 'Routers and the splash',
      description: [
        'A launch sends the click of the link as a real click, so the router of the page handles it as it handles any link. The splash can wait for the page the link leads to: the tile holds it with hold(promise) from the tilelaunchstart or tilelaunchactivate event, and the promise settles when the page is ready.',
        'tile.launch(ready) runs the same launch from code, whatever --ax-tile-launch says. The first block is that call. The second is a sketch for SvelteKit: it is not tested with the framework, so check it against the version you use. The README has the same sketches for Next.js, React Router and Vue Router.'
      ],
      preview: tile(' class="app"', splash),
      style: `${style}.app { --ax-tile-launch: flip; }`,
      controls: [],
      code: [
        {
          language: 'js',
          source: "const ready = fetch('/api/mail/summary').then((r) => r.json());\ntile.launch(ready);"
        },
        {
          language: 'js',
          source:
            "import { afterNavigate, preloadData } from '$app/navigation';\n\nlet arrived = null;\nafterNavigate(() => arrived && arrived());\n\ndocument.addEventListener('tilelaunchstart', (event) => {\n  const { url, hold } = event.detail;\n  if (!url) return;\n  hold(new Promise((resolve) => (arrived = resolve)));\n  preloadData(url);\n});"
        }
      ]
    }
  ],
  reference: [
    { name: 'slot="action"', kind: 'attribute', type: 'a | button', description: 'The link or the button of the tile. It covers the tile, and its text is the name of the tile at the bottom left. A tile without an action is static: it has no press and no keyboard handling.' },
    { name: 'slot="splash"', kind: 'attribute', type: 'template', description: 'The content of the splash of an app, shown centered on the splash color while the tile launches.' },
    { name: 'label', kind: 'attribute', type: 'hidden', description: 'The name is not shown, but it stays the accessible name of the action.' },
    { name: 'focus-ring', kind: 'attribute', type: 'native', default: 'the focus ring of Surface', description: 'The browser draws the keyboard focus outline of the action, instead of the focus ring that follows the shape.' },
    { name: 'activation', kind: 'attribute', type: 'immediate', default: 'delayed', description: 'The action runs as soon as it is clicked, with no wait for the press feedback.' },
    { name: '--ax-border-width', kind: 'property', type: '<length>', default: '2px', description: 'On a tile, so that the reveal light has a border. Any style of yours wins.' },
    { name: '--ax-tile-activation-delay-max', kind: 'property', type: '<time> | none', default: 'none', description: 'The longest wait of a delayed activation, in ms or s. none is no cap.' },
    { name: '--ax-tile-launch', kind: 'property', type: 'none | flip', default: 'none', description: 'flip turns the launch on: the tile turns, grows to the page and shows its splash. Read at each launch.' },
    { name: '--ax-tile-launch-duration', kind: 'property', type: '<time>', default: '620ms', description: 'The length of the launch, from the tile to the whole page. The tile turns in its first 30%; the splash takes the rest.' },
    { name: '--ax-tile-launch-easing', kind: 'property', type: '<timing function>', default: 'cubic-bezier(0.17, 0.55, 0.3, 0.95)', description: 'The timing function of the growth from the tile to the page. The growth starts after the first 16% of the duration.' },
    { name: '--ax-tile-splash-color', kind: 'property', type: '<color>', default: 'the fill color of the tile', description: 'The color of the splash. A transparent color gives a black splash.' },
    { name: '--ax-tile-splash-hold', kind: 'property', type: '<time>', default: '500ms', description: 'How long the splash stays once the launch has nothing left to wait for. Without it a fast router would take the splash away the moment the page arrives.' },
    { name: '--ax-tile-splash-fade', kind: 'property', type: '<time>', default: '167ms', description: 'The fade of the splash once the app is ready. Linear.' },
    { name: '--ax-tile-splash-timeout', kind: 'property', type: '<time> | none', default: '5s', description: 'The longest the splash waits for the promises held, or for a full-page navigation. none waits for as long as it takes.' },
    { name: 'tilelaunchstart', kind: 'event', type: 'CustomEvent<{ tile, action, url, hold(promise), preventPrefetch() }>', description: 'The click starts a launch. It bubbles and is cancelable: a canceled launch falls back to the delayed activation. url is the href of a link, null for a button.' },
    { name: 'tilelaunchactivate', kind: 'event', type: 'CustomEvent<{ tile, action, url, hold(promise) }>', description: 'The flip is over, and the click is sent on. Not cancelable. Hold the splash here while the page is not ready.' },
    { name: 'tilelaunchend', kind: 'event', type: 'CustomEvent<{ tile, action, url, reason: done | restore }>', description: 'The launch is over: the splash has gone (done), or the page was restored from the back/forward cache (restore).' },
    { name: 'hold(promise)', kind: 'method', type: '(promise: Promise<unknown>) => void', description: 'In the detail of tilelaunchstart and tilelaunchactivate. Keeps the splash until the promise settles, or until the timeout is over.' },
    { name: 'preventPrefetch()', kind: 'method', type: '() => void', description: 'In the detail of tilelaunchstart. Turns off the default prefetch of a link to the same origin for this launch.' },
    { name: 'launch(ready?)', kind: 'method', type: '(ready?: Promise<unknown>) => Promise<void>', description: 'Runs the launch as a click does, whatever --ax-tile-launch says. ready is held as hold() would hold it. The promise resolves when the splash is gone; it rejects without doing anything when the tile has no action, the action is disabled, or a launch is already running.' }
  ]
};

export default page;
