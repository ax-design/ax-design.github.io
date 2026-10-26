import type { DocPage } from './types';

const text = 'Scrolling stays native: the wheel, the touch and the keys scroll the view, and find in page reaches the content.';

// Four sections with headings, long enough to scroll in the preview box.
const sections = (headings: string[]) =>
  headings.map((heading) => `<h2>${heading}</h2><p>${text}</p>`).join('');

const headings = ['Introduction', 'Setup', 'Usage', 'Reference'];

const style = `
.stage { position: absolute; inset: 0; background: #fff; color: #1b1b1b; }
ax-scroll-view { position: absolute; inset: 0; --ax-scrollbar-thickness: 17px; }
.body { padding: 16px; font: 13px/1.5 system-ui, sans-serif; }
.body h2 { margin: 0 0 6px; font-size: 16px; font-weight: 600; }
.body p { margin: 0 0 18px; }
`;

const page: DocPage = {
  slug: 'scrollbar',
  name: 'Scrollbar',
  package: '@ax-design/scrollbar',
  globalName: 'AxScrollbar',
  tagline: 'Scrollbars you style with CSS, for a container or for the whole page, with markers for the places in the content.',
  intro: [
    'ax-scroll-view is a scroll container and ax-scrollbar draws the scrollbars of the page. The bars are an overlay over the content, and scrolling stays native: the wheel, touch, the keys, find in page and scrollIntoView work as usual.',
    'The default look is the Windows 8 (Modern UI) scrollbar. Every part of it, the thumb, the buttons, the track, the markers and the hover card, is a shadow part that you style with ::part(), or replace with a kit.',
    'Markers are ticks on the track for the places in the content, such as headings or search hits, and a card lists their labels when the pointer comes near.'
  ],
  setup: "import { register } from '@ax-design/scrollbar';\nregister();",
  examples: [
    {
      id: 'scroll-view',
      title: 'Scroll view',
      description: [
        'Wrap the content in ax-scroll-view and give it a height. The bars show while there is something to scroll, and fade out after a moment.',
        'The thickness is a custom property. The vertical attribute decides when the bar shows: auto, always or hidden.'
      ],
      preview: `<div class="stage"><ax-scroll-view vertical="auto"><div class="body">${sections(headings)}</div></ax-scroll-view></div>`,
      style,
      controls: [
        { key: 'thickness', label: 'Thickness', type: 'range', min: 8, max: 24, step: 1, unit: 'px', default: 17, target: { kind: 'css', property: '--ax-scrollbar-thickness', selector: 'ax-scroll-view' } },
        { key: 'vertical', label: 'Vertical bar', type: 'select', options: ['auto', 'always', 'hidden'], default: 'auto', target: { kind: 'attribute', attribute: 'vertical', selector: 'ax-scroll-view' } }
      ],
      code: [
        { language: 'html', source: '<ax-scroll-view vertical="{{vertical}}" style="height: 420px">\n  <article>...</article>\n</ax-scroll-view>' },
        { language: 'css', source: 'ax-scroll-view {\n  --ax-scrollbar-thickness: {{thickness}};\n}' }
      ]
    },
    {
      id: 'markers',
      title: 'Markers',
      description: [
        'With marker-selector, every matching element becomes a marker on the track: here each heading. Its label is its text. Press a marker to scroll it into the view, or hover it to read the labels.',
        'Markers close to each other share one mark, and the card lists all of them. The alignment decides where a marker scrolls to: its center, or its start edge.'
      ],
      preview: `<div class="stage"><ax-scroll-view marker-selector="h2" marker-align="center"><div class="body">${sections(headings)}</div></ax-scroll-view></div>`,
      style,
      controls: [
        { key: 'align', label: 'Marker alignment', type: 'select', options: ['center', 'start'], default: 'center', target: { kind: 'attribute', attribute: 'marker-align', selector: 'ax-scroll-view' } }
      ],
      code: [
        { language: 'html', source: '<ax-scroll-view marker-selector="h2" marker-align="{{align}}" style="height: 420px">\n  <h2>Introduction</h2>\n  ...\n</ax-scroll-view>' },
        {
          language: 'js',
          source: "const view = document.querySelector('ax-scroll-view');\n\n// Cancel the jump to the marker and scroll to it yourself.\nview.addEventListener('markeractivate', (event) => {\n  event.preventDefault();\n});"
        }
      ]
    },
    {
      id: 'parts',
      title: 'Styled with ::part()',
      description: [
        'Each part of the bar is styled with ::part(). A rule on a part replaces the default value of every property it sets, in every state of that part.',
        'Here the thumb takes a color and a corner radius. The other parts keep the Windows 8 look.'
      ],
      preview: `<div class="stage"><ax-scroll-view><div class="body">${sections(headings)}</div></ax-scroll-view></div>`,
      style: `${style}
ax-scroll-view::part(thumb) {
  --ax-radius: var(--thumb-radius, 4px);
  --ax-scrollbar-part-color: var(--thumb-color, rgb(89, 89, 89));
}
`,
      controls: [
        { key: 'color', label: 'Thumb color', type: 'color', default: 'rgb(89, 89, 89)', target: { kind: 'css', property: '--thumb-color', selector: 'ax-scroll-view' } },
        { key: 'radius', label: 'Thumb radius', type: 'range', min: 0, max: 8, step: 1, unit: 'px', default: 4, target: { kind: 'css', property: '--thumb-radius', selector: 'ax-scroll-view' } }
      ],
      code: [
        { language: 'html', source: '<ax-scroll-view style="height: 420px">...</ax-scroll-view>' },
        {
          language: 'css',
          source: 'ax-scroll-view::part(thumb) {\n  --ax-radius: {{radius}};\n  --ax-scrollbar-part-color: {{color}};\n}'
        }
      ]
    }
  ],
  reference: [
    { name: 'vertical', kind: 'attribute', type: 'auto | always | hidden', default: 'auto', description: 'auto: the bar shows while there is something to scroll. always: it always shows, disabled when nothing scrolls. hidden: it never shows.' },
    { name: 'horizontal', kind: 'attribute', type: 'auto | always | hidden', default: 'auto', description: 'As vertical, for the horizontal bar.' },
    { name: 'hide', kind: 'attribute', type: 'list of parts', default: 'button:touch track:touch corner:touch', description: 'The parts a look leaves out: thumb, button, track, track-piece, corner, marker, card. Add :mouse or :touch to hide a part for one indicator only. Even an empty value overrides the default.' },
    { name: 'indicator', kind: 'attribute', type: 'auto | near | pinned', default: 'auto', description: 'auto: the bars show on every move over the scroller. near: only for a pointer at a bar, or while scrolling. pinned: the bars always show.' },
    { name: 'track-click', kind: 'attribute', type: 'page | jump', default: 'page', description: 'A press on the track pages toward the pointer, or with jump scrolls to the pointer.' },
    { name: 'touch-input', kind: 'attribute', type: 'true | false', default: 'false', description: 'A finger on a bar drags it and a tap on the track glides to the tapped place. Without it touch only shows a panning indicator.' },
    { name: 'suspended', kind: 'attribute', type: 'true | false', default: 'false', description: 'Fades the bars out and makes them ignore input, for a lightbox over the page.' },
    { name: 'kit', kind: 'attribute', type: 'kit name', description: 'Builds the parts with the kit of that name, made with defineScrollbarKit().' },
    { name: 'marker-selector', kind: 'attribute', type: 'CSS selector', description: 'Makes a marker for each matching element, labelled with its text.' },
    { name: 'marker-align', kind: 'attribute', type: 'center | start', default: 'center', description: 'Where a marker scrolls to, and where it sits on the track.' },
    { name: '--ax-scrollbar-thickness', kind: 'property', type: '<length>', default: '17px', description: 'The thickness of a bar.' },
    { name: '--ax-scrollbar-line', kind: 'property', type: '<length>', default: '40px', description: 'The scroll of a button press. A track page is the view minus one line.' },
    { name: '--ax-scrollbar-idle-delay', kind: 'property', type: '<time>', default: '3s', description: 'How long the mouse indicator lingers before it fades out.' },
    { name: '--ax-scrollbar-hotzone', kind: 'property', type: '<length> | <percentage>', default: '0px', description: 'The depth of the hot zone inside the outer edge of a bar. A bar with a hot zone shows when the pointer comes near it.' },
    { name: '--ax-scrollbar-vertical-size', kind: 'property', type: '<length>', default: '0px', description: 'Written by the component on the host, read-only: the thickness of the vertical bar, 0px while it is not shown. Use it to keep the content clear of the bar.' },
    { name: '--ax-scrollbar-z-index', kind: 'property', type: '<integer>', default: '2147483000', description: 'The stacking of ax-scrollbar. Read it with var(); a page with modals can put the bars under them.' },
    { name: '::part(thumb)', kind: 'property', type: 'Shadow part', description: 'The part you drag. The other parts are button, track, track-piece, corner, marker, card and scrollbar-vertical or scrollbar-horizontal, with states such as thumb-hover and thumb-pressed.' },
    { name: '--ax-scrollbar-part-color', kind: 'property', type: '<color>', default: 'transparent', description: 'The fill color of a part. Set it on ::part(), where it is not inherited.' },
    { name: 'markers', kind: 'property', type: 'ScrollMarker[] | null', default: 'null', description: 'Markers set from script, which win over marker-selector while they hold a list. null gives control back to the selector.' },
    { name: 'refresh()', kind: 'method', type: '() => void', description: 'Lays the bars out on the next frame. Call it after you change a token from script.' },
    { name: 'refreshMarkers()', kind: 'method', type: '() => void', description: 'Collects and measures the markers again on the next frame, after a change the component cannot see.' },
    { name: 'defineScrollbarKit()', kind: 'method', type: '(name: string, kit: ScrollbarKit) => void', description: 'Defines a kit that replaces some parts with classes of your own. A kit is used by name with the kit attribute.' },
    { name: 'markeractivate', kind: 'event', type: 'CustomEvent', description: 'A press on a marker released without moving. Cancelable: preventDefault() stops the jump to the marker. detail has marker and markers.' },
    { name: 'markerenter', kind: 'event', type: 'CustomEvent', description: 'The pointer moves onto a marker.' },
    { name: 'markerleave', kind: 'event', type: 'CustomEvent', description: 'The pointer leaves the last marker it was on.' }
  ]
};

export default page;
