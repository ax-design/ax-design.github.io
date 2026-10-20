import { expect, test } from 'bun:test';
import { specAt } from '../src/lib/site/morph';

// The Start screen draws this shape itself (see #lib/site/morph.ts), so its reading of the surface's
// custom properties has to keep matching the surface: the schema is the source of truth, and this is
// the guard against the copy drifting away from it.
async function surfaceSchema(): Promise<{ shapeSpecFrom: (v: unknown, w: number, h: number) => unknown }> {
    try {
        const sibling = new URL('../../surface/src/schema.ts', import.meta.url).href;
        const local = await import(sibling);
        if (typeof local.shapeSpecFrom === 'function') return local;
    } catch {
        // A checkout without the sibling falls back to the released package, the public contract.
    }
    return (await import('@ax-design/surface')) as unknown as { shapeSpecFrom: (v: unknown, w: number, h: number) => unknown };
}

const SIZE = 120;
const SIDE: Record<string, number> = { top: 0, right: 1, bottom: 2, left: 3 };
const CORNER: Record<string, number> = { 'top-left': 0, 'top-right': 1, 'bottom-right': 2, 'bottom-left': 3 };

// What the stylesheet held at a phase, in the shape the surface's Values hands to shapeSpecFrom.
function valuesAt(t: number) {
    const spec = specAt(t);
    const edge = (name: string) => {
        const m = /^--ax-edge-(top|right|bottom|left)-(.+)$/.exec(name);
        return m ? { e: spec.edges[SIDE[m[1]]], param: m[2] } : null;
    };
    return {
        lp(name: string) {
            if (name === '--ax-radius') return spec.corners[0].radius;
            const c = /^--ax-corner-(top|right|bottom|left)-(top|right|bottom|left)-shift-([xy])$/.exec(name);
            if (c) {
                const corner = spec.corners[CORNER[`${c[1]}-${c[2]}`]];
                return c[3] === 'x' ? corner.shiftX : corner.shiftY;
            }
            const e = edge(name);
            if (e && e.param === 'span') return e.e.span;
            if (e && e.param === 'at') return e.e.at * 100;
            throw new Error(`lp ${name}`);
        },
        keyword(name: string) {
            if (name === '--ax-corner-shape') return 'round';
            if (/^--ax-corner-(top|right|bottom|left)-(top|right|bottom|left)-shape$/.test(name)) return 'auto';
            const e = edge(name);
            if (e && e.param === 'kind') return 'triangle';
            throw new Error(`keyword ${name}`);
        },
        unset(name: string) {
            if (/^--ax-(top|right|bottom|left)-(top|right|bottom|left)-radius$/.test(name)) return true;
            if (name.startsWith('--ax-border-')) return true;
            throw new Error(`unset ${name}`);
        },
        length(name: string) {
            if (name === '--ax-border-width') return 0;
            if (/--ax-corner-(top|right|bottom|left)-(top|right|bottom|left)-shoulder-radius$/.test(name)) return 0;
            const e = edge(name);
            if (e && e.param === 'depth') return e.e.depth;
            if (e && e.param === 'tip-radius') return 5;
            if (e && e.param === 'shoulder-radius') return 5;
            throw new Error(`length ${name}`);
        },
        number(name: string) {
            const e = edge(name);
            if (e && e.param === 'ratio') return 0.5;
            throw new Error(`number ${name}`);
        }
    };
}

test('the shape the site draws is the one the surface schema builds', async () => {
    const { shapeSpecFrom } = await surfaceSchema();
    for (let i = 0; i <= 64; i++) {
        const t = i / 64;
        expect(specAt(t)).toEqual(shapeSpecFrom(valuesAt(t), SIZE, SIZE));
    }
});
