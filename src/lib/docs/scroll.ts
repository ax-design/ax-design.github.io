import type { DocPage } from './types';

const items = (n = 8) =>
  Array.from({ length: n }, (_, i) => `<div class="item"><span>${i + 1}</span></div>`).join('');

const style = `
.stage { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; gap: 12px; }
ax-scroll, .native { width: 360px; height: 200px; --item-width: 140px; }
.strip { display: flex; gap: 8px; width: max-content; padding: 0 12px; height: 100%; align-items: center; }
.item { flex: none; width: var(--item-width); height: 160px; background: rgba(255, 255, 255, 0.16); display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 300; scroll-snap-align: start; scroll-margin-left: 12px; }
`;

const page: DocPage = {
  slug: 'scroll',
  name: 'Scroll',
  package: '@ax-design/scroll',
  globalName: 'AxScroll',
  tagline: 'A horizontal scroller that the mouse wheel, the touchpad and the arrow keys scroll sideways.',
  intro: [
    'ax-scroll is a native horizontal scroller (overflow-x: auto) like the Start screen of Windows 8. A vertical mouse wheel, a touchpad swiped up and down, the up and down keys, Page Up and Page Down scroll it sideways.',
    'Touch, horizontal touchpad swipes, the scrollbar, the left and right keys, scroll snapping and assistive technology work as usual. At either end, a wheel gesture goes on to the page. The scroller is as tall as you make it, so give it a height.'
  ],
  setup: "import { register } from '@ax-design/scroll';\nregister();",
  examples: [
    {
      id: 'wheel',
      title: 'Wheel',
      description: [
        'Put a wide element inside ax-scroll and turn your mouse wheel over it. The content scrolls sideways, with the smooth scrolling of the browser. Quick notches add up.',
        'A touchpad swiped up and down scrolls it 1:1 with its own momentum. A wheel over something inside that scrolls vertically and can still move, or over a form field, is left alone.'
      ],
      preview: `<div class="stage"><ax-scroll><div class="strip">${items(8)}</div></ax-scroll></div>`,
      style,
      controls: [{ key: 'width', label: 'Item width', type: 'range', min: 60, max: 280, step: 10, unit: 'px', default: 140, target: { kind: 'css', property: '--item-width', selector: 'ax-scroll' } }],
      code: [
        { language: 'html', source: '<ax-scroll style="height: 200px">\n  <div style="display: flex; width: max-content">\n    <div class="item">1</div>\n    <div class="item">2</div>\n    ...\n  </div>\n</ax-scroll>' },
        { language: 'css', source: '.item {\n  flex: none;\n  width: {{width}};\n}' }
      ]
    },
    {
      id: 'snap',
      title: 'Scroll snapping',
      description: [
        'Because the scroller is native, CSS scroll snapping works on it. Snap the items to the start edge and each wheel notch stops on an item.',
        'Turn snapping off to scroll freely.'
      ],
      preview: `<div class="stage"><ax-scroll class="snap"><div class="strip">${items(8)}</div></ax-scroll></div>`,
      style,
      controls: [{ key: 'snap', label: 'Snap', type: 'toggle', default: true, on: 'x mandatory', off: 'none', target: { kind: 'css', property: 'scroll-snap-type', selector: 'ax-scroll' } }],
      code: [
        { language: 'html', source: '<ax-scroll>\n  <div class="strip">...</div>\n</ax-scroll>' },
        { language: 'css', source: 'ax-scroll {\n  scroll-snap-type: {{snap}};\n}\n\n.item {\n  scroll-snap-align: start;\n}' }
      ]
    },
    {
      id: 'cross-slide',
      title: 'With a tile group',
      description: [
        'A finger drag on a touch screen scrolls the page vertically over the scroller by default. Add cross-slide and touch drags only pan sideways, so vertical drags go to the content.',
        'Together with drag="cross-slide" on a tile group, this is the gesture of Windows 8: a finger that starts moving up or down drags the tile, one that starts sideways scrolls. A mouse drags as with press.'
      ],
      preview: `<div class="stage"><ax-scroll cross-slide class="tiles"><ax-tile-group drag="cross-slide">${Array.from({ length: 8 }, () => '<ax-tile columns="3" rows="3" layers="fill reveal"></ax-tile>').join('')}</ax-tile-group></ax-scroll></div>`,
      style: `
.stage { position: absolute; inset: 0; display: flex; align-items: center; }
ax-scroll { width: 360px; height: 190px; }
ax-tile-group { margin: 12px; --tile-cell-width: 20px; --tile-cell-height: 20px; --tile-gap: 4px; --tile-rows: 6; }
ax-tile { --ax-fill-color: rgba(255, 255, 255, 0.2); --reveal-color: rgb(255, 255, 255); --reveal-opacity: 0.35; }
`,
      controls: [
        { key: 'cross', label: 'Cross-slide', type: 'toggle', default: true, target: { kind: 'attribute', attribute: 'cross-slide', selector: 'ax-scroll' } }
      ],
      code: [
        {
          language: 'html',
          source: '<ax-scroll {{cross}}>\n  <ax-tile-group drag="cross-slide">\n    <ax-tile columns="3" rows="3" layers="fill reveal"></ax-tile>\n    ...\n  </ax-tile-group>\n</ax-scroll>'
        }
      ]
    },
    {
      id: 'bind',
      title: 'bindScroll',
      description: [
        'bindScroll gives the same scrolling to a scroller of your own, or to the whole page. In the preview, the top scroller is a plain overflow-x: auto element: the wheel does not move it. The bottom one is ax-scroll, which calls bindScroll for itself.',
        'Pass an element that scrolls horizontally, or window for a page laid out sideways. It returns an object with unbind() and scrollAlong(delta, smooth). With { keys: false } the up and down keys and Page Up and Page Down are left alone.'
      ],
      preview: `<div class="stage"><div class="native" style="overflow-x: auto; overflow-y: hidden; height: 120px"><div class="strip" style="height: 100px">${items(8)}</div></div><ax-scroll style="height: 120px"><div class="strip" style="height: 100px">${items(8)}</div></ax-scroll></div>`,
      style,
      controls: [{ key: 'width', label: 'Item width', type: 'range', min: 60, max: 280, step: 10, unit: 'px', default: 140, target: { kind: 'css', property: '--item-width' } }],
      code: [
        { language: 'js', source: "import { bindScroll } from '@ax-design/scroll';\n\n// A scroller of your own:\nconst binding = bindScroll(document.querySelector('.my-scroller'));\n\n// A page laid out sideways: body { overflow-x: auto; overflow-y: hidden; }\nbindScroll(window);\n\n// Later:\nbinding.unbind();" },
        { language: 'js', source: "// Keep the up and down keys for the page.\nbindScroll(element, { keys: false });\n\n// Scroll by 200px toward the end, smoothly.\nbinding.scrollAlong(200, true);" }
      ]
    }
  ],
  reference: [
    { name: 'cross-slide', kind: 'attribute', type: 'boolean', default: 'off', description: 'Touch drags only pan sideways; vertical drags go to the content, for example a tile group that drags a tile on a vertical swipe.' },
    { name: 'scrollAlong(delta, smooth)', kind: 'method', type: '(delta: number, smooth: boolean) => void', description: 'Scrolls by delta px toward the end (negative: toward the start). smooth uses the browser\'s smooth scrolling and adds up with a smooth scroll that is still running.' },
    { name: 'bindScroll(target, options)', kind: 'method', type: '(target: HTMLElement | Window, options?: { keys?: boolean }) => { scrollAlong, unbind }', default: '{ keys: true }', description: 'The same scrolling for a scroller of your own, or for the whole page. Exported by the package.' },
    { name: 'WheelSwap', kind: 'method', type: 'class', description: 'The class that decides what a wheel event does. It is exported and has no DOM dependency.' }
  ]
};

export default page;
