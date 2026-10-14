import { StyleBinding, StyleSchema, canRegister } from '@ax-design/typed-om';
import type { PropertySpec, PropertyValue } from '@ax-design/typed-om';
import type { DocPage } from './types';

// The examples run the package against the preview. Each one has a host element with a shadow
// root (StyleBinding reads through a shadow root), the controls set custom properties on the
// host, and the code below reads them back and writes the result as text.

const round = (n: number) => Math.round(n * 1000) / 1000;

// A value the way you would write it in JavaScript.
function show(value: PropertyValue | undefined): string {
  if (value === undefined) return '(not read yet)';
  if (value === null) return 'null';
  if (typeof value === 'number') return String(round(value));
  if (typeof value === 'string') return `'${value}'`;
  if (Array.isArray(value)) return `[${value.map(round).join(', ')}]`;
  return `{ px: ${round(value.px)}, percent: ${round(value.percent)} }`;
}

function bind(root: HTMLElement, selector: string, schema: StyleSchema): StyleBinding {
  const host = root.querySelector<HTMLElement>(selector)!;
  const shadow = host.shadowRoot ?? host.attachShadow({ mode: 'open' });
  // The host's own children are shown through a slot.
  if (!shadow.firstChild) shadow.innerHTML = '<slot></slot>';
  return new StyleBinding(schema, host, shadow);
}

const find = <T extends HTMLElement = HTMLElement>(root: HTMLElement, selector: string) => root.querySelector<T>(selector)!;

const readoutStyle = `
.wrap { position: absolute; inset: 0; box-sizing: border-box; padding: 24px; display: flex; flex-direction: column; gap: 16px; justify-content: center; color: #fff; font: 13px/1.5 ui-monospace, 'SFMono-Regular', Consolas, monospace; }
.host { position: relative; display: block; height: 40px; background: rgba(255, 255, 255, 0.2); }
.out { margin: 0; white-space: pre-wrap; word-break: break-all; font: inherit; }
.dim { opacity: 0.7; white-space: pre-wrap; }
`;

// 1. Lengths

const lengthSchema = () => new StyleSchema([{ name: '--my-size', syntax: { type: 'length-percentage' }, initial: '0px', inherits: true }]);
const lengthStates = new WeakMap<HTMLElement, StyleBinding>();

// 2. Colors

const colorSchema = () => new StyleSchema([{ name: '--my-color', syntax: { type: 'color' }, initial: 'black', inherits: true }]);
const colorStates = new WeakMap<HTMLElement, StyleBinding>();

// 3. Keywords

const keywordSchema = () =>
  new StyleSchema([
    { name: '--my-mode', syntax: { type: 'keyword', values: ['soft', 'hard'] }, initial: 'soft', inherits: false },
    { name: '--my-depth', syntax: { type: 'length' }, initial: '0px', inherits: false, skipWhen: { property: '--my-mode', values: ['soft'] } }
  ]);
const keywordStates = new WeakMap<HTMLElement, StyleBinding>();

// 4. Watching changes

interface WatchState {
  binding: StyleBinding;
  calls: number;
  reads: number;
  frame: number;
  render: () => void;
}
const watchStates = new WeakMap<HTMLElement, WatchState>();

// 5. Registered properties

interface CompareState {
  registered: StyleBinding;
  plain: StyleBinding;
  frame: number;
  stop: () => void;
}
const compareStates = new WeakMap<HTMLElement, CompareState>();

const page: DocPage = {
  slug: 'typed-om',
  name: 'Typed OM',
  package: '@ax-design/typed-om',
  tagline: 'Typed reads and change detection for CSS custom properties, in browsers with or without CSS Typed OM and @property.',
  intro: [
    'Typed OM is the engine under Surface. It reads every --ax-* property of a surface as numbers, colors and keywords, and tells the surface when one of them changed. You need it only to build your own elements.',
    'Describe your custom properties once in a schema, bind the schema to an element and read. Common forms such as 12px, 50%, calc(50% + 4px), rgb() and hex are parsed directly. Everything else, such as calc(1em + 2px) or red, goes through a hidden probe element, so the browser does the math.',
    'Every example on this page is live. The controls set custom properties on an element, and the code of the package reads them back. The text in the preview is what the package returned.'
  ],
  setup: "import { StyleSchema, StyleBinding } from '@ax-design/typed-om';",
  examples: [
    {
      id: 'lengths',
      title: 'Lengths and calc()',
      description: [
        'A length-percentage property is read as an object: px is the pixel part and percent is the percentage part, where 50 means 50%. Type a value into the box and the text shows what binding.get returns.',
        'Try 12px, 50%, calc(10% + 4px) and calc(100% - 2px). Values with em, rem or vw have no fixed form, so the package asks the browser: the last line counts how many properties needed the probe.'
      ],
      preview: `<div class="wrap"><div class="host"><div class="bar"></div></div><pre class="out"></pre></div>`,
      style: `${readoutStyle}
.bar { height: 100%; width: var(--my-size); max-width: 100%; background: #fff; }
`,
      controls: [{ key: 'size', label: 'Value', type: 'text', default: 'calc(10% + 4px)', target: { kind: 'css', property: '--my-size', selector: '.host' } }],
      code: [
        {
          language: 'js',
          source:
            "const schema = new StyleSchema([\n  { name: '--my-size', syntax: { type: 'length-percentage' }, initial: '0px', inherits: true }\n]);\n\n// host is your element, root its shadow root.\nconst binding = new StyleBinding(schema, host, root);\nbinding.read();\nbinding.get('--my-size');"
        },
        { language: 'css', source: '.my-element {\n  --my-size: {{size}};\n}' }
      ],
      setup(root) {
        lengthStates.set(root, bind(root, '.host', lengthSchema()));
      },
      update(root, values) {
        const binding = lengthStates.get(root);
        if (!binding) return;
        binding.read();
        find(root, '.out').textContent = `--my-size: ${values.size}\n\nbinding.get('--my-size')\n${show(binding.get('--my-size'))}\n\n` + `probe reads: ${binding.stats.slow}`;
      }
    },
    {
      id: 'colors',
      title: 'Colors',
      description: [
        'A color property is read as [r, g, b, a]: red, green and blue from 0 to 255, and alpha from 0 to 1. A value that is not a color gives the initial color of the schema.',
        'rgb() and hex are parsed directly. Named colors, hsl() and anything else go through the probe, so try rebeccapurple, hsl(200 80% 50%) or color-mix(in srgb, red, blue).'
      ],
      preview: `<div class="wrap"><div class="host"><div class="swatch"></div></div><pre class="out"></pre></div>`,
      style: `${readoutStyle}
.host { height: 80px; }
.swatch { position: absolute; inset: 0; background: var(--my-color); }
`,
      controls: [{ key: 'color', label: 'Color', type: 'text', default: 'rgb(255 200 0 / 60%)', target: { kind: 'css', property: '--my-color', selector: '.host' } }],
      code: [
        {
          language: 'js',
          source:
            "const schema = new StyleSchema([\n  { name: '--my-color', syntax: { type: 'color' }, initial: 'black', inherits: true }\n]);\n\nconst binding = new StyleBinding(schema, host, root);\nbinding.read();\nbinding.get('--my-color');"
        },
        { language: 'css', source: '.my-element {\n  --my-color: {{color}};\n}' }
      ],
      setup(root) {
        colorStates.set(root, bind(root, '.host', colorSchema()));
      },
      update(root, values) {
        const binding = colorStates.get(root);
        if (!binding) return;
        binding.read();
        find(root, '.out').textContent = `--my-color: ${values.color}\n\nbinding.get('--my-color')\n${show(binding.get('--my-color'))}\n\n` + `probe reads: ${binding.stats.slow}`;
      }
    },
    {
      id: 'keywords',
      title: 'Keywords and skipped properties',
      description: [
        'A keyword property returns one of the values you allowed, as a string. Any other word gives the initial value, so the property is always one of your keywords.',
        'A property can be skipped when another one makes it irrelevant. Here the depth is only read while the mode is hard. While the mode is soft, the schema keeps the initial depth and the browser is not asked at all, which saves work on every read.'
      ],
      preview: `<div class="wrap"><div class="host"><div class="tile"></div></div><pre class="out"></pre></div>`,
      style: `${readoutStyle}
.host { height: 56px; }
.tile { position: absolute; left: 0; top: 8px; width: 60px; height: 40px; background: #fff; }
`,
      controls: [
        { key: 'mode', label: 'Mode', type: 'text', default: 'hard', target: { kind: 'css', property: '--my-mode', selector: '.host' } },
        { key: 'depth', label: 'Depth', type: 'range', min: 0, max: 200, step: 1, unit: 'px', default: 80, target: { kind: 'css', property: '--my-depth', selector: '.host' } }
      ],
      code: [
        {
          language: 'js',
          source:
            "const schema = new StyleSchema([\n  { name: '--my-mode', syntax: { type: 'keyword', values: ['soft', 'hard'] }, initial: 'soft', inherits: false },\n  {\n    name: '--my-depth',\n    syntax: { type: 'length' },\n    initial: '0px',\n    inherits: false,\n    skipWhen: { property: '--my-mode', values: ['soft'] }\n  }\n]);\n\nconst binding = new StyleBinding(schema, host, root);\nbinding.read();\nbinding.get('--my-mode');\nbinding.get('--my-depth');"
        },
        { language: 'css', source: '.my-element {\n  --my-mode: {{mode}};\n  --my-depth: {{depth}};\n}' }
      ],
      setup(root) {
        keywordStates.set(root, bind(root, '.host', keywordSchema()));
      },
      update(root, values) {
        const binding = keywordStates.get(root);
        if (!binding) return;
        binding.read();
        const depth = binding.get('--my-depth') as number;
        find(root, '.tile').style.transform = `translateX(${Math.min(depth, 200)}px)`;
        find(root, '.out').textContent =
          `--my-mode: ${values.mode}\n--my-depth: ${values.depth}\n\n` +
          `get('--my-mode')\n${show(binding.get('--my-mode'))}\nget('--my-depth')\n${show(depth)}` +
          (binding.get('--my-mode') === 'soft' ? '\n\nskipped: not read while soft' : '');
      }
    },
    {
      id: 'observe',
      title: 'Watching changes',
      description: [
        'binding.observe tells you when something in the schema changed, whatever the cause: a class, a media query, a transition. It does not tell you the new values. Read them on the next frame, once, however many times the callback ran.',
        'Move the slider. The bar follows the CSS transition, the text is read only from the callback. Turn Watch off and the package stops: the callback does not run and nothing is read. The detector costs a little on every style change of the page, so watch only while your element is visible.'
      ],
      preview: `<div class="wrap"><div class="host"><div class="bar"></div></div><pre class="out"></pre></div>`,
      style: `${readoutStyle}
.host { --my-level: 0; transition-property: --my-level; transition-timing-function: ease-in-out; }
.bar { height: 100%; width: calc(var(--my-level) * 1%); background: #fff; }
`,
      controls: [
        { key: 'level', label: 'Level', type: 'range', min: 0, max: 100, step: 1, unit: '', default: 0, target: { kind: 'css', property: '--my-level', selector: '.host' } },
        { key: 'duration', label: 'Duration', type: 'range', min: 200, max: 3000, step: 100, unit: 'ms', default: 1500, target: { kind: 'css', property: 'transition-duration', selector: '.host' } },
        { key: 'watch', label: 'Watch', type: 'toggle', default: true, on: 'true', off: 'false', target: { kind: 'css', property: '--my-watch', selector: '.host' } }
      ],
      code: [
        {
          language: 'js',
          source:
            "const schema = new StyleSchema([\n  { name: '--my-level', syntax: { type: 'number' }, initial: '0', inherits: true, register: true }\n]);\nconst binding = new StyleBinding(schema, host, root);\n\nlet frame = 0;\nbinding.observe(() => {\n  if (frame) return;\n  frame = requestAnimationFrame(() => {\n    frame = 0;\n    binding.read();\n    draw(binding.get('--my-level'));\n  });\n});\n\n// Watch: {{watch}}\nbinding.unobserve();"
        },
        {
          language: 'css',
          source: '.my-element {\n  --my-level: {{level}};\n  transition: --my-level {{duration}};\n}'
        }
      ],
      setup(root) {
        const schema = new StyleSchema([{ name: '--my-level', syntax: { type: 'number' }, initial: '0', inherits: true, register: true }]);
        const binding = bind(root, '.host', schema);
        const out = find(root, '.out');
        const state: WatchState = {
          binding,
          calls: 0,
          reads: 0,
          frame: 0,
          render: () => {
            out.textContent = `observing: ${binding.observing}\ncallbacks: ${state.calls}\nreads: ${state.reads}\n\nget('--my-level')\n${show(binding.get('--my-level'))}`;
          }
        };
        watchStates.set(root, state);
        return () => {
          cancelAnimationFrame(state.frame);
          binding.unobserve();
        };
      },
      update(root, values) {
        const state = watchStates.get(root);
        if (!state) return;
        const { binding } = state;
        if (values.watch === 'true' && !binding.observing) {
          // A first read, as onChange only runs for later changes.
          binding.read();
          state.reads++;
          binding.observe(() => {
            state.calls++;
            if (state.frame) return;
            state.frame = requestAnimationFrame(() => {
              state.frame = 0;
              state.reads++;
              binding.read();
              state.render();
            });
          });
        } else if (values.watch !== 'true' && binding.observing) {
          binding.unobserve();
          cancelAnimationFrame(state.frame);
          state.frame = 0;
        }
        state.render();
      }
    },
    {
      id: 'register',
      title: 'Registered properties',
      description: [
        'An unregistered custom property is text to the browser, so a transition on it jumps from the start to the end. With register: true the package calls CSS.registerProperty for you, and the transition passes through every value in between.',
        'Move the slider. Both bars are drawn from values read with the package: the registered one follows the transition, the plain one jumps. Where CSS.registerProperty does not exist, both jump and everything else still works.'
      ],
      preview: `<div class="wrap"><div class="dim note"></div><div class="col"><span>register: true</span><div class="host a"><div class="bar"></div></div></div><div class="col"><span>register: false</span><div class="host b"><div class="bar"></div></div></div><pre class="out"></pre></div>`,
      style: `${readoutStyle}
.wrap { gap: 10px; }
.col { display: flex; flex-direction: column; gap: 4px; }
.host { height: 28px; transition-timing-function: ease-in-out; }
.a { --my-registered: var(--my-target); transition-property: --my-registered; }
.b { --my-plain: var(--my-target); transition-property: --my-plain; }
.bar { height: 100%; width: 0; background: #fff; }
.out { margin-top: 6px; }
`,
      controls: [
        { key: 'target', label: 'Target', type: 'range', min: 0, max: 100, step: 1, unit: '', default: 0, target: { kind: 'css', property: '--my-target' } },
        { key: 'duration', label: 'Duration', type: 'range', min: 200, max: 3000, step: 100, unit: 'ms', default: 1500, target: { kind: 'css', property: 'transition-duration', selector: '.a, .b' } }
      ],
      code: [
        {
          language: 'js',
          source:
            "const schema = new StyleSchema([\n  { name: '--my-registered', syntax: { type: 'number' }, initial: '0', inherits: false, register: true },\n  { name: '--my-plain', syntax: { type: 'number' }, initial: '0', inherits: true }\n]);\n\nschema.registered.has('--my-registered'); // true where CSS.registerProperty exists\nschema.registered.has('--my-plain'); // false"
        },
        {
          language: 'css',
          source: '.my-element {\n  --my-registered: {{target}};\n  transition: --my-registered {{duration}};\n}'
        }
      ],
      setup(root) {
        const schema = new StyleSchema([
          { name: '--my-registered', syntax: { type: 'number' }, initial: '0', inherits: false, register: true },
          { name: '--my-plain', syntax: { type: 'number' }, initial: '0', inherits: true }
        ]);
        const registered = bind(root, '.a', schema);
        const plain = bind(root, '.b', schema);
        const state: CompareState = { registered, plain, frame: 0, stop: () => {} };
        const draw = () => {
          state.frame = 0;
          registered.read();
          plain.read();
          const a = registered.get('--my-registered') as number;
          const b = plain.get('--my-plain') as number;
          find(root, '.a .bar').style.width = `${a}%`;
          find(root, '.b .bar').style.width = `${b}%`;
          find(root, '.out').textContent = `registered: ${show(a)}\nplain:      ${show(b)}`;
        };
        const onChange = () => {
          if (!state.frame) state.frame = requestAnimationFrame(draw);
        };
        registered.observe(onChange);
        plain.observe(onChange);
        find(root, '.note').textContent = `CSS.registerProperty: ${canRegister() ? 'available' : 'not available'}\nregistered: ${[...schema.registered].join(', ') || 'none'}`;
        state.stop = () => {
          cancelAnimationFrame(state.frame);
          registered.unobserve();
          plain.unobserve();
        };
        compareStates.set(root, state);
        return state.stop;
      }
    }
  ],
  reference: [
    { name: 'StyleSchema', kind: 'method', type: 'new StyleSchema(specs: PropertySpec[])', description: 'Describes the properties you read. Validates the specs, registers the ones with register: true, and compiles the reader and the detector once. Share one schema between all elements of the same kind. Throws when a name does not start with --, when a keyword is a CSS-wide keyword or not an identifier, or when skipWhen names a property that is not earlier in the list.' },
    { name: 'schema.specs', kind: 'property', type: 'PropertySpec[]', description: 'The specs you passed, in order.' },
    { name: 'schema.registered', kind: 'property', type: 'Set<string>', description: 'The names that are registered after the constructor, including names another copy of the package registered before. Empty where CSS.registerProperty does not exist.' },
    { name: 'schema.reader', kind: 'property', type: 'StyleReader', description: 'The reader that StyleBinding.read uses.' },
    { name: 'schema.detector', kind: 'property', type: 'DetectorTemplate', description: 'The compiled detector that StyleBinding.observe attaches.' },
    { name: 'schema.indexOf', kind: 'method', type: '(name: string) => number', description: 'The position of a property in the schema, and in binding.values. Throws when the name is not in the schema.' },
    { name: 'StyleBinding', kind: 'method', type: 'new StyleBinding(schema: StyleSchema, host: Element, root: ShadowRoot)', description: 'The state of one element: its latest values and its detector. The host is the element whose computed style is read, root is the shadow root the probe and the detector live in. The root must be a shadow root of the host or inherit its custom properties.' },
    { name: 'binding.read', kind: 'method', type: '() => PropertyValue[]', description: 'Reads every property of the schema from the host and returns binding.values. Run it after something changed, not on every frame.' },
    { name: 'binding.get', kind: 'method', type: '(name: string) => PropertyValue', description: 'The value of one property from the last read. Throws when the name is not in the schema.' },
    { name: 'binding.values', kind: 'property', type: 'PropertyValue[]', description: 'The values of the last read, in the order of the schema.' },
    { name: 'binding.stats', kind: 'property', type: '{ slow: number }', default: '{ slow: 0 }', description: 'slow is the number of properties that needed the probe in the last read.' },
    { name: 'binding.observe', kind: 'method', type: '(onChange: () => void) => void', description: 'Attaches the detector to the shadow root. onChange runs once right after attaching and after every later change of a property in the schema. It runs possibly several times per frame, so coalesce it with requestAnimationFrame. Does nothing when already observing.' },
    { name: 'binding.unobserve', kind: 'method', type: '() => void', description: 'Removes the detector. Call it while your element is not visible. Does nothing when not observing.' },
    { name: 'binding.observing', kind: 'property', type: 'boolean', default: 'false', description: 'True while the detector is attached.' },
    { name: 'binding.schema, binding.host, binding.root', kind: 'property', type: 'StyleSchema, Element, ShadowRoot', description: 'The arguments of the constructor.' },
    { name: 'name', kind: 'property', type: 'string', description: 'PropertySpec: the custom property, including the leading --.' },
    { name: 'syntax', kind: 'property', type: "{ type: 'length' } | { type: 'length-percentage' } | { type: 'number' } | { type: 'color'; keywords?: string[] } | { type: 'keyword'; values: string[] }", description: 'PropertySpec: what the property holds, and so what binding.get returns. length gives a number of pixels, length-percentage gives { px, percent }, number gives a number, color gives [r, g, b, a] or one of the extra keywords as a string, keyword gives one of the values. CSS-wide keywords are rejected. Avoid none as a keyword: a change to none is not seen by the detector.' },
    { name: 'initial', kind: 'property', type: 'string', description: 'PropertySpec: the CSS text of the initial value. It is the value when the property is not set or not valid, and the var() fallback when the property is not registered.' },
    { name: 'inherits', kind: 'property', type: 'boolean', description: 'PropertySpec: whether the property inherits. Used for registering. For properties you do not register, set it to what the property does in your CSS.' },
    { name: 'register', kind: 'property', type: 'boolean', default: 'false', description: 'PropertySpec: register the property with CSS.registerProperty where it exists, so transitions on it interpolate. Where it does not exist, transitions jump to the end value and nothing else changes. The first registration of a name wins, so never change the definition of a registered property between versions.' },
    { name: 'skipWhen', kind: 'property', type: '{ property: string; values: string[] }', description: 'PropertySpec: do not read this property, and keep its initial value, while the earlier property named here holds one of the values. The other property must be earlier in the schema.' },
    { name: 'PropertyValue', kind: 'property', type: 'LengthPercentage | number | string | Rgba | null', description: 'What binding.get returns. LengthPercentage is { px: number; percent: number } with percent as 50 for 50%. Rgba is [number, number, number, number] with alpha from 0 to 1.' },
    { name: 'canRegister', kind: 'method', type: '() => boolean', description: 'True when CSS.registerProperty exists.' },
    { name: 'registerProperties', kind: 'method', type: '(specs: PropertySpec[]) => Set<string>', description: 'Registers the specs with register: true and returns the names registered afterwards. StyleSchema calls it for you.' },
    { name: 'validateSchema', kind: 'method', type: '(specs: PropertySpec[]) => void', description: 'Throws the errors of the StyleSchema constructor. StyleSchema calls it for you.' },
    { name: 'cssSyntax', kind: 'method', type: '(syntax: PropertySyntax) => string', description: 'The CSS syntax string of a syntax, e.g. <length-percentage> or soft | hard. It is what register passes to CSS.registerProperty.' },
    { name: 'StyleReader', kind: 'method', type: 'new StyleReader(specs: PropertySpec[])', description: 'The reader behind binding.read. Its method read(element, probeParent, out = [], stats?) parses getComputedStyle of the element and falls back to the probe, which is put into probeParent. Use StyleBinding unless you need the reader alone.' },
    { name: 'ReadStats', kind: 'property', type: '{ slow: number }', description: 'The type of binding.stats.' },
    { name: 'parseNumber', kind: 'method', type: '(text: string) => number | null', description: 'A plain number such as 1.5 or 2e3. Null for anything else.' },
    { name: 'parseLength', kind: 'method', type: '(text: string) => number | null', description: 'The pixels of 0 or a value in px. Null for anything else.' },
    { name: 'parseLengthPercentage', kind: 'method', type: '(text: string) => LengthPercentage | null', description: '0, a value in px, a value in %, or the calc() of a percentage and px as computed styles serialize it, such as calc(50% + 4px). Null for anything else.' },
    { name: 'parseColor', kind: 'method', type: '(text: string) => Rgba | null', description: 'rgb(), rgba() and hex with 3, 4, 6 or 8 digits. Null for named colors and other color spaces.' },
    { name: 'parseKeyword', kind: 'method', type: '(text: string, values: string[]) => string | null', description: 'The text when it is one of the values, null otherwise.' },
    { name: 'probeLengthPercentage', kind: 'method', type: '(parent: Node, name: string) => LengthPercentage', description: 'Asks the browser for the value of a property in any length form, such as calc(1em + 2px). The probe is added to parent for the read and removed again.' },
    { name: 'probeNumber', kind: 'method', type: '(parent: Node, name: string) => number', description: 'Asks the browser for the value of a number property, such as calc(1 + 1).' },
    { name: 'probeColor', kind: 'method', type: '(parent: Node, name: string) => Rgba | null', description: 'Asks the browser for the value of a color property, in any color syntax. Null when the value is not a color.' },
    { name: 'buildDetector', kind: 'method', type: '(specs: PropertySpec[], registered?: Set<string>) => DetectorTemplate', default: 'registered = new Set()', description: 'Compiles the CSS of the detector as { css, elementCount }. Pass the names that are registered, so the detector can reach non-inherited ones. StyleSchema calls it for you.' },
    { name: 'attachDetector', kind: 'method', type: '(root: ShadowRoot, template: DetectorTemplate, onChange: () => void) => DetectorHandle', description: 'Puts the detector into the shadow root. Returns { detach(): void }. StyleBinding.observe calls it for you.' }
  ]
};

export default page;
