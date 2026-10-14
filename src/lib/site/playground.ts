// The presets and the controls of the Surface playground, taken from the Surface demo
// (surface/demo/demo.ts): shapes after the Material 3 shape set for a 100px reference size,
// whose px values scale with the size they are shown at, and the controls grouped by part.

// Shapes after the Material 3 shape set, for a 100px reference size. Values in px scale with
// the size they are shown at.
export interface Preset {
    name: string;
    size?: [number, number];
    props: Record<string, string>;
}

export const PRESETS: Preset[] = [
    { name: 'Circle', props: { '--ax-radius': '50%' } },
    { name: 'Square', props: { '--ax-radius': '28%' } },
    { name: 'Slanted', props: { '--ax-radius': '18%', '--ax-corner-top-left-shift-x': '14%', '--ax-corner-bottom-right-shift-x': '14%' } },
    {
        name: 'Arch',
        props: { '--ax-top-left-radius': '50%', '--ax-top-right-radius': '50%', '--ax-bottom-right-radius': '14%', '--ax-bottom-left-radius': '14%' },
    },
    { name: 'Fan', props: { '--ax-radius': '14%', '--ax-bottom-right-radius': '100%' } },
    {
        name: 'Arrow',
        props: {
            '--ax-radius': '14%',
            '--ax-corner-top-left-shift-x': '50%',
            '--ax-corner-top-right-shift-x': '50%',
            '--ax-edge-bottom-kind': 'triangle',
            '--ax-edge-bottom-depth': '-24px',
            '--ax-edge-bottom-span': '64%',
            '--ax-edge-bottom-tip-radius': '6px',
            '--ax-edge-bottom-shoulder-radius': '8px',
        },
    },
    { name: 'Semicircle', size: [100, 50], props: { '--ax-top-left-radius': '50px', '--ax-top-right-radius': '50px', '--ax-bottom-right-radius': '8px', '--ax-bottom-left-radius': '8px' } },
    { name: 'Pill', size: [100, 56], props: { '--ax-radius': '50%' } },
    { name: 'Triangle', props: { '--ax-radius': '16%', '--ax-corner-top-left-shift-x': '50%', '--ax-corner-top-right-shift-x': '50%' } },
    {
        name: 'Diamond',
        props: {
            '--ax-radius': '12%',
            '--ax-corner-top-left-shift-y': '50%',
            '--ax-corner-top-right-shift-x': '50%',
            '--ax-corner-bottom-right-shift-y': '50%',
            '--ax-corner-bottom-left-shift-x': '50%',
        },
    },
    {
        name: 'Puffy diamond',
        props: {
            '--ax-radius': '30%',
            '--ax-corner-top-left-shift-y': '50%',
            '--ax-corner-top-right-shift-x': '50%',
            '--ax-corner-bottom-right-shift-y': '50%',
            '--ax-corner-bottom-left-shift-x': '50%',
        },
    },
    { name: 'Clamshell', props: { '--ax-radius': '30%', '--ax-corner-shape': 'bevel' } },
    {
        // A shallow cusp on every side with a wide tip: a wave.
        name: '4-sided cookie',
        props: {
            '--ax-radius': '30%',
            '--ax-edge-kind': 'cusp',
            '--ax-edge-depth': '-6px',
            '--ax-edge-span': '100%',
            '--ax-edge-tip-radius': '20px',
        },
    },
    {
        // Four round leaves: a deep cusp on every side.
        name: '4-leaf clover',
        props: {
            '--ax-radius': '30%',
            '--ax-edge-kind': 'cusp',
            '--ax-edge-depth': '-18px',
            '--ax-edge-span': '100%',
            '--ax-edge-tip-radius': '4px',
        },
    },
    {
        name: 'Ghost-ish',
        props: {
            '--ax-top-left-radius': '50%',
            '--ax-top-right-radius': '50%',
            '--ax-bottom-right-radius': '12%',
            '--ax-bottom-left-radius': '12%',
            '--ax-edge-bottom-kind': 'arc',
            '--ax-edge-bottom-depth': '-12px',
            '--ax-edge-bottom-span': '32%',
            '--ax-edge-bottom-shoulder-radius': '5px',
        },
    },
    { name: 'Pixel circle', props: { '--ax-radius': '18%', '--ax-corner-shape': 'notch' } },
    {
        name: 'Ticket',
        size: [100, 76],
        props: {
            '--ax-radius': '12px',
            '--ax-edge-left-kind': 'arc',
            '--ax-edge-left-depth': '-9px',
            '--ax-edge-left-span': '42%',
            '--ax-edge-right-kind': 'arc',
            '--ax-edge-right-depth': '-9px',
            '--ax-edge-right-span': '42%',
        },
    },
    {
        // Two pills on top of each other: the left and right sides pinch in the middle.
        name: 'Bun',
        size: [100, 104],
        props: Object.assign(
            { '--ax-radius': '26%' },
            ...['left', 'right'].map((s) => ({
                [`--ax-edge-${s}-kind`]: 'cusp',
                [`--ax-edge-${s}-depth`]: '-14px',
                [`--ax-edge-${s}-span`]: '100%',
                [`--ax-edge-${s}-tip-radius`]: '3px',
            }))
        ),
    },
    {
        // Full scoops meet in the middle of every side; the shoulders round the points.
        name: 'Soft star',
        props: { '--ax-radius': '50%', '--ax-corner-shape': 'scoop', '--ax-corner-shoulder-radius': '8px' },
    },
    {
        // A square with a triangle out of every side; the triangles go out of the box.
        name: 'Sun',
        size: [64, 64],
        props: {
            '--ax-radius': '12px',
            '--ax-edge-kind': 'triangle',
            '--ax-edge-depth': '12px',
            '--ax-edge-span': '44%',
            '--ax-edge-tip-radius': '3px',
            '--ax-edge-shoulder-radius': '3px',
        },
    },
];

export const scalePx = (value: string, factor: number) => value.replace(/(-?\d*\.?\d+)px/g, (_, n) => `${Math.round(parseFloat(n) * factor * 10) / 10}px`);

export const CORNERS = ['top-left', 'top-right', 'bottom-right', 'bottom-left'];
export const CORNER_LABELS = ['Top left', 'Top right', 'Bottom right', 'Bottom left'];
export const SIDES = ['top', 'right', 'bottom', 'left'];
export const SIDE_LABELS = ['Top', 'Right', 'Bottom', 'Left'];

export type Control =
    | { kind: 'range'; label: string; prop: string; min: number; max: number; step: number; unit: string; initial: string; auto?: string }
    | { kind: 'select'; label: string; prop: string; options: string[]; initial: string }
    | { kind: 'color'; label: string; prop: string; initial: string; alpha?: boolean };

const range = (label: string, prop: string, min: number, max: number, step: number, unit: string, initial: string, auto?: string): Control => ({
    kind: 'range',
    label,
    prop,
    min,
    max,
    step,
    unit,
    initial,
    auto,
});
const select = (label: string, prop: string, options: string[], initial: string): Control => ({ kind: 'select', label, prop, options, initial });
const color = (label: string, prop: string, initial: string, alpha = false): Control => ({ kind: 'color', label, prop, initial, alpha });

// Controls of one group; {corner} and {side} stand for the selected corner or side.
export interface Group {
    title: string;
    layer?: string;
    pick?: { key: 'corner' | 'side'; labels: string[] };
    controls: Control[];
}

export const GROUPS: Group[] = [
    {
        title: 'Shape',
        controls: [
            range('Radius', '--ax-radius', 0, 50, 1, '%', '0px'),
            select('Corners', '--ax-corner-shape', ['round', 'bevel', 'scoop', 'notch'], 'round'),
            range('Shoulder', '--ax-corner-shoulder-radius', 0, 60, 1, 'px', '0px'),
        ],
    },
    {
        title: 'Corner',
        pick: { key: 'corner', labels: CORNER_LABELS },
        controls: [
            range('Radius', '--ax-{corner}-radius', -1, 50, 1, '%', '-1px', 'auto'),
            select('Shape', '--ax-corner-{corner}-shape', ['auto', 'round', 'bevel', 'scoop', 'notch'], 'auto'),
            range('Shift x', '--ax-corner-{corner}-shift-x', -20, 50, 1, '%', '0px'),
            range('Shift y', '--ax-corner-{corner}-shift-y', -20, 50, 1, '%', '0px'),
            range('Shoulder', '--ax-corner-{corner}-shoulder-radius', 0, 60, 1, 'px', '0px'),
        ],
    },
    {
        title: 'Edges',
        controls: [
            select('Kind', '--ax-edge-kind', ['flat', 'arc', 'rect', 'triangle', 'trapezoid', 'cusp'], 'flat'),
            range('Depth', '--ax-edge-depth', -80, 80, 1, 'px', '0px'),
            range('Span', '--ax-edge-span', 0, 100, 1, '%', '33%'),
            range('At', '--ax-edge-at', 0, 100, 1, '%', '50%'),
            range('Ratio', '--ax-edge-ratio', 0, 1, 0.05, '', '0.5'),
            range('Tip radius', '--ax-edge-tip-radius', 0, 40, 1, 'px', '0px'),
            range('Shoulder', '--ax-edge-shoulder-radius', 0, 40, 1, 'px', '0px'),
        ],
    },
    {
        title: 'One edge',
        pick: { key: 'side', labels: SIDE_LABELS },
        controls: [
            select('Kind', '--ax-edge-{side}-kind', ['flat', 'arc', 'rect', 'triangle', 'trapezoid', 'cusp'], 'flat'),
            range('Depth', '--ax-edge-{side}-depth', -80, 80, 1, 'px', '0px'),
            range('Span', '--ax-edge-{side}-span', 0, 100, 1, '%', '33%'),
            range('At', '--ax-edge-{side}-at', 0, 100, 1, '%', '50%'),
            range('Ratio', '--ax-edge-{side}-ratio', 0, 1, 0.05, '', '0.5'),
            range('Tip radius', '--ax-edge-{side}-tip-radius', 0, 40, 1, 'px', '0px'),
            range('Shoulder', '--ax-edge-{side}-shoulder-radius', 0, 40, 1, 'px', '0px'),
        ],
    },
    {
        title: 'Border',
        controls: [range('Width', '--ax-border-width', 0, 10, 0.5, 'px', '1px'), color('Color', '--ax-border-color', 'rgba(0, 0, 0, 0)', true)],
    },
    {
        title: 'Tilt',
        controls: [
            select('Mode', '--ax-tilt-mode', ['off', 'absolute', 'relative'], 'off'),
            range('Depth', '--ax-tilt-depth', 0, 20, 0.5, 'px', '1px'),
            range('Factor', '--ax-tilt-factor', 0, 20, 0.5, '', '2'),
            range('Perspective', '--ax-tilt-perspective', 25, 1500, 5, 'px', '25px'),
        ],
    },
    { title: 'Fill', layer: 'fill', controls: [color('Color', '--ax-fill-color', 'rgba(0, 0, 0, 0)', true)] },
    {
        title: 'Elevation',
        layer: 'elevation',
        controls: [range('Depth', '--elevation-depth', 0, 64, 1, '', '0')],
    },
    {
        title: 'Acrylic',
        layer: 'acrylic',
        controls: [
            color('Tint', '--acrylic-tint-color', 'rgb(0, 0, 0)'),
            range('Tint opacity', '--acrylic-tint-opacity', 0, 1, 0.01, '', '0.6'),
            range('Blur', '--acrylic-blur', 0, 80, 1, 'px', '20px'),
        ],
    },
    {
        title: 'Reveal',
        layer: 'reveal',
        controls: [color('Color', '--reveal-color', 'rgb(0, 0, 0)'), range('Opacity', '--reveal-opacity', 0, 1, 0.01, '', '0.26')],
    },
];

export const LAYERS = ['elevation', 'fill', 'acrylic', 'reveal'];

export const INITIAL: Record<string, string> = {
    '--ax-radius': '16%',
    '--ax-border-width': '1px',
    '--ax-tilt-mode': 'absolute',
    '--ax-tilt-depth': '3px',
    '--ax-tilt-perspective': '600px',
    '--ax-fill-color': 'rgba(255, 255, 255, 0.85)',
    '--elevation-depth': '32',
    '--acrylic-tint-color': 'rgb(255, 255, 255)',
    '--acrylic-tint-opacity': '0.18',
    '--acrylic-blur': '24px',
    '--reveal-color': 'rgb(255, 255, 255)',
    '--reveal-opacity': '0.3',
};

// The CSS of a state: the custom properties set, in the order of the controls.
export function cssOf(selector: string, size: [number, number], props: Record<string, string>): string {
    const lines = [`  width: ${size[0]}px;`, `  height: ${size[1]}px;`];
    for (const name in props) lines.push(`  ${name}: ${props[name]};`);
    return `${selector} {\n${lines.join('\n')}\n}`;
}
