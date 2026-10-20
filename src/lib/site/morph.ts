import { resolve, toSvgPath } from '@ax-design/shape';
import type { ShapeSpec } from '@ax-design/shape';

// The live shape inside the Playground tile: the Surface demo that used to be
// `<ax-surface class="morph" layers="fill">`, drawn on a canvas instead.
//
// An SVG shape rewritten every frame invalidates its own geometry, repaints its elements and makes
// the style engine resolve the animated properties again. Drawing the same outline on a canvas
// costs one path build and one fill, so the Start screen keeps the animation without the per-frame
// pipeline behind it.
//
// The motion is the one the stylesheet declared, moved into JavaScript so that no frame reads a
// computed style: the same four keyframes, the same cubic-bezier between them, the same 50% radius
// and 22px edge depth. The spin stays a CSS animation, where the compositor can carry it.

const SIZE = 120;
const PERIOD = 8000;
const EDGE_SPAN = 0.44;

interface Key {
    at: number;
    radius: number;
    topLeftY: number;
    topRightX: number;
    bottomRightY: number;
    bottomLeftX: number;
    depth: number;
}

// `@keyframes morph`, 0% to 100%, with everything the shape reads.
const KEYS: Key[] = [
    { at: 0, radius: 50, topLeftY: 0, topRightX: 0, bottomRightY: 0, bottomLeftX: 0, depth: 0 },
    { at: 0.25, radius: 28, topLeftY: 0, topRightX: 0, bottomRightY: 0, bottomLeftX: 0, depth: 0 },
    { at: 0.5, radius: 14, topLeftY: 50, topRightX: 50, bottomRightY: 50, bottomLeftX: 50, depth: 0 },
    { at: 0.75, radius: 19, topLeftY: 0, topRightX: 0, bottomRightY: 0, bottomLeftX: 0, depth: 22 },
    { at: 1, radius: 50, topLeftY: 0, topRightX: 0, bottomRightY: 0, bottomLeftX: 0, depth: 0 }
];

// cubic-bezier(0.6, 0, 0.3, 1), the timing function of the animation: x is solved by bisection,
// as the browser does, and y gives the progress of the segment.
function bezier(x1: number, y1: number, x2: number, y2: number): (t: number) => number {
    const cx = 3 * x1;
    const bx = 3 * (x2 - x1) - cx;
    const ax = 1 - cx - bx;
    const cy = 3 * y1;
    const by = 3 * (y2 - y1) - cy;
    const ay = 1 - cy - by;
    const x = (s: number) => ((ax * s + bx) * s + cx) * s;
    const y = (s: number) => ((ay * s + by) * s + cy) * s;
    return (t: number) => {
        if (t <= 0) return 0;
        if (t >= 1) return 1;
        let low = 0;
        let high = 1;
        let s = t;
        for (let i = 0; i < 24; i++) {
            if (x(s) < t) low = s;
            else high = s;
            s = (low + high) / 2;
        }
        return y(s);
    };
}

const ease = bezier(0.6, 0, 0.3, 1);

function keysAt(t: number): Key {
    for (let i = 0; i < KEYS.length - 1; i++) {
        const a = KEYS[i];
        const b = KEYS[i + 1];
        if (t <= b.at) {
            const e = ease((t - a.at) / (b.at - a.at));
            const mix = (x: number, y: number) => x + (y - x) * e;
            return {
                at: t,
                radius: mix(a.radius, b.radius),
                topLeftY: mix(a.topLeftY, b.topLeftY),
                topRightX: mix(a.topRightX, b.topRightX),
                bottomRightY: mix(a.bottomRightY, b.bottomRightY),
                bottomLeftX: mix(a.bottomLeftX, b.bottomLeftX),
                depth: mix(a.depth, b.depth)
            };
        }
    }
    return KEYS[KEYS.length - 1];
}

// The shape the surface's schema would have produced for these values (see schema.ts in
// @ax-design/surface): the radius in px of the shorter side, the shifts in px of their own side,
// and a triangle on every edge.
export function specAt(t: number): ShapeSpec {
    const v = keysAt(t);
    const radius = (v.radius / 100) * SIZE;
    const shiftX = (percent: number) => (percent / 100) * SIZE;
    const shiftY = (percent: number) => (percent / 100) * SIZE;
    return {
        width: SIZE,
        height: SIZE,
        corners: [
            { radius, shape: 'round', shiftX: 0, shiftY: shiftY(v.topLeftY), shoulderRadius: 0 },
            { radius, shape: 'round', shiftX: shiftX(v.topRightX), shiftY: 0, shoulderRadius: 0 },
            { radius, shape: 'round', shiftX: 0, shiftY: shiftY(v.bottomRightY), shoulderRadius: 0 },
            { radius, shape: 'round', shiftX: shiftX(v.bottomLeftX), shiftY: 0, shoulderRadius: 0 }
        ] as ShapeSpec['corners'],
        edges: [0, 1, 2, 3].map(() => ({
            kind: 'triangle' as const,
            depth: v.depth,
            span: EDGE_SPAN * SIZE,
            at: 0.5,
            ratio: 0.5,
            tipRadius: 5,
            shoulderRadius: 5
        })) as ShapeSpec['edges']
    };
}

// --ax-fill-color was rgba(255, 255, 255, 0.92): white at 0.92, and in forced colors the system
// Canvas color at the same alpha, as a forced background keeps it.
const FILL = '#fff';
const ALPHA = 0.92;

function forcedFill(): string | null {
    if (!window.matchMedia || !window.matchMedia('(forced-colors: active)').matches) return null;
    const probe = document.createElement('span');
    probe.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;visibility:hidden;color:Canvas';
    document.body.appendChild(probe);
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
}

export function startMorph(canvas: HTMLCanvasElement): () => void {
    const context = canvas.getContext('2d');
    if (!context) return () => {};

    let dpr = 0;
    let forced: string | null = null;
    let disposes: (() => void)[] = [];

    const resize = () => {
        const next = window.devicePixelRatio || 1;
        if (next === dpr) return;
        dpr = next;
        canvas.width = Math.round(SIZE * dpr);
        canvas.height = Math.round(SIZE * dpr);
        canvas.style.width = `${SIZE}px`;
        canvas.style.height = `${SIZE}px`;
    };

    const color = () => forced ?? FILL;

    // Forced colors can turn on while the page is open, and the fill has to follow it.
    const scheme = window.matchMedia ? window.matchMedia('(forced-colors: active)') : null;
    const onScheme = () => {
        forced = forcedFill();
    };
    scheme?.addEventListener('change', onScheme);
    disposes.push(() => scheme?.removeEventListener('change', onScheme));
    const onResize = () => resize();
    window.addEventListener('resize', onResize);
    disposes.push(() => window.removeEventListener('resize', onResize));

    resize();
    onScheme();

    let raf = 0;
    const start = performance.now();
    const frame = (now: number) => {
        const t = ((now - start) % PERIOD) / PERIOD;
        const shape = resolve(specAt(t), { borderWidths: [0, 0, 0, 0] });
        const path = new Path2D(toSvgPath(shape.outline));
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
        context.clearRect(0, 0, SIZE, SIZE);
        context.globalAlpha = ALPHA;
        context.fillStyle = color();
        context.fill(path);
        raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
        cancelAnimationFrame(raf);
        for (const dispose of disposes) dispose();
        disposes = [];
    };
}
