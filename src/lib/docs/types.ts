// The content of a component page. A page is a row of columns, read left to right like a
// magazine spread: every example is one column with a large preview on top, then its text, its
// controls and the code that the controls produce.

export interface DocPage {
    // URL segment: /components/<slug>.
    slug: string;
    // Display name, e.g. "Reveal Highlight".
    name: string;
    // npm package, e.g. "@ax-design/reveal-highlight".
    package: string;
    // The global of the UMD build (build/main.js), for the script tag. Leave it out for a
    // package without one: the page then shows no script tag.
    globalName?: string;
    // One sentence for the start screen tile and the page header.
    tagline: string;
    // Paragraphs before the first example (plain text, one string per paragraph).
    intro: string[];
    // How a page registers the package, as shown in the "Getting started" column, e.g.
    // "import { register } from '@ax-design/reveal-highlight';\nregister();".
    setup: string;
    examples: Example[];
    // Reference of the custom properties and attributes, shown as the last columns.
    reference: ReferenceEntry[];
    // A package that is no longer developed, shown with a note.
    legacy?: boolean;
}

export interface Example {
    id: string;
    title: string;
    // Paragraphs (plain text).
    description: string[];
    // HTML of the preview. It is put into the preview box as is. The controls apply to it (see
    // Control). Keep it small: the box is about 360 x 360 px.
    preview: string;
    // CSS for the preview, scoped by the page to this example's box (write selectors as if the
    // preview were the whole page, e.g. ".tile { ... }").
    style?: string;
    controls: Control[];
    // The code the reader copies. {{key}} is replaced with the current value of the control with
    // that key (with its unit). Use one code block per language.
    code: CodeBlock[];
    // For examples of script libraries: runs once the preview is in the page (after every
    // custom element is registered); may return a function that undoes it.
    setup?: (root: HTMLElement) => (() => void) | void;
    // Runs after the controls were applied to the preview, with the text of every control by
    // key (as it appears in the code).
    update?: (root: HTMLElement, values: Record<string, string>) => void;
}

export interface CodeBlock {
    language: 'html' | 'css' | 'js';
    source: string;
    // Shown only while the control with this key has this value, for a code that depends on a select.
    when?: { key: string; value: string };
}

export type Control = RangeControl | ToggleControl | SelectControl | ColorControl | TextControl;

interface BaseControl {
    // Name in the code templates: {{key}}.
    key: string;
    label: string;
    // What the control changes in the preview:
    //   css:       sets a custom property (or any property) on the preview box; it inherits into
    //              the preview unless the property is not inherited, then use selector
    //   attribute: sets (or, for a false toggle, removes) an attribute on the elements matching
    //              selector inside the preview box
    target: { kind: 'css'; property: string; selector?: string } | { kind: 'attribute'; attribute: string; selector: string };
}

export interface RangeControl extends BaseControl {
    type: 'range';
    min: number;
    max: number;
    step: number;
    default: number;
    // Appended to the value in the preview and in the code, e.g. "px", "%", "" for numbers.
    unit: string;
}

export interface ToggleControl extends BaseControl {
    type: 'toggle';
    default: boolean;
    // Values written for on and off (css), e.g. "true" / "false". Attributes are added or removed.
    on?: string;
    off?: string;
}

export interface SelectControl extends BaseControl {
    type: 'select';
    options: string[];
    default: string;
    // What a choice gives to the other controls (by key) when the reader makes it, so that a choice
    // such as a style comes with its own defaults.
    sets?: Record<string, Record<string, string | number | boolean>>;
}

export interface ColorControl extends BaseControl {
    type: 'color';
    // Offer an opacity too; the value is then rgba(). Default false.
    alpha?: boolean;
    // A CSS color, e.g. "rgb(255, 255, 255)" or "#3d5afe".
    default: string;
}

export interface TextControl extends BaseControl {
    type: 'text';
    default: string;
}

export interface ReferenceEntry {
    // e.g. "--reveal-color" or "drag".
    name: string;
    kind: 'property' | 'attribute' | 'event' | 'method';
    type: string;
    default?: string;
    description: string;
}
