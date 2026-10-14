import { apply, borderInner, innerToSvgPath, resolve, tiltHomography, toSvgPath } from '@ax-design/shape';
import type { Clamp, ClampKind, Contour, CornerShape, CornerSpec, EdgeKind, EdgeSpec, Homography, Point, Quad, ShapeSpec } from '@ax-design/shape';
import type { DocPage } from './types';

// The Shape page draws with the library itself: every preview resolves a ShapeSpec and paints the
// outline it returns as an SVG path. The library has no DOM dependency, so this is exactly what a
// canvas, a server or Surface does with the same call.

const NS = 'http://www.w3.org/2000/svg';
const TAU = Math.PI * 2;

// One cartoon size for every preview, in the preview's own pixels.
const VIEW = { width: 200, height: 140, pad: 44 };

const flatEdge = (): EdgeSpec => ({ kind: 'flat', depth: 0, span: 0, at: 0.5, ratio: 0.5, tipRadius: 0, shoulderRadius: 0 });
const corner = (over: Partial<CornerSpec> = {}): CornerSpec => ({ radius: 0, shape: 'round', shiftX: 0, shiftY: 0, shoulderRadius: 0, ...over });
const four = <T>(value: T): Quad<T> => [value, value, value, value];
const num = (text: string, fallback = 0): number => {
  const value = Number.parseFloat(text);
  return Number.isFinite(value) ? value : fallback;
};
const round2 = (value: number): number => Math.round(value * 100) / 100;

const stage = `
.stage { position: absolute; inset: 0; }
.board { display: block; width: 100%; height: 100%; }
.out { position: absolute; left: 14px; right: 14px; bottom: 12px; margin: 0; color: #fff; font: 12px/1.5 ui-monospace, Consolas, Menlo, monospace; white-space: pre-wrap; }
`;

const CORNERS = ['top left', 'top right', 'bottom right', 'bottom left'];
const SIDES = ['top', 'right', 'bottom', 'left'];
const CLAMP_NAMES: Record<ClampKind, string> = {
  'corner-shift': 'corner shift',
  'corner-radius': 'corner radius',
  'edge-span': 'edge span',
  'edge-depth': 'edge depth',
  'vertex-radius': 'rounding'
};

function describeClamp(clamp: Clamp): string {
  const where = clamp.kind.startsWith('edge') ? SIDES[clamp.index] : clamp.kind === 'vertex-radius' ? '' : CORNERS[clamp.index];
  return `${CLAMP_NAMES[clamp.kind]}${where ? ` (${where})` : ''} x${round2(clamp.factor)}`;
}

// --- Drawing ---------------------------------------------------------------------------------

function board(root: HTMLElement, width: number, height: number, pad: number): SVGSVGElement {
  const svg = root.querySelector<SVGSVGElement>('svg.board');
  if (!svg) throw new Error('the shape board is missing');
  svg.setAttribute('viewBox', `${-pad} ${-pad} ${width + pad * 2} ${height + pad * 2}`);
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  svg.replaceChildren();
  return svg;
}

function group(svg: SVGSVGElement, dx = 0, dy = 0): SVGGElement {
  const node = document.createElementNS(NS, 'g');
  if (dx !== 0 || dy !== 0) node.setAttribute('transform', `translate(${dx} ${dy})`);
  svg.appendChild(node);
  return node;
}

function draw(g: SVGGElement, d: string, attributes: Record<string, string>): void {
  const path = document.createElementNS(NS, 'path');
  path.setAttribute('d', d);
  for (const name in attributes) path.setAttribute(name, attributes[name]);
  g.appendChild(path);
}

function dot(g: SVGGElement, p: Point, radius: number, fill: string): void {
  const node = document.createElementNS(NS, 'circle');
  node.setAttribute('cx', `${p.x}`);
  node.setAttribute('cy', `${p.y}`);
  node.setAttribute('r', `${radius}`);
  node.setAttribute('fill', fill);
  g.appendChild(node);
}

function label(g: SVGGElement, x: number, y: number, text: string): void {
  const node = document.createElementNS(NS, 'text');
  node.setAttribute('x', `${x}`);
  node.setAttribute('y', `${y}`);
  node.setAttribute('fill', 'rgba(255, 255, 255, 0.75)');
  node.setAttribute('font-size', '11');
  node.setAttribute('text-anchor', 'middle');
  node.textContent = text;
  g.appendChild(node);
}

// A homography maps points, not arcs, so a contour is sampled into a polygon to draw it tilted.
function sweepOf(start: number, end: number, anticlockwise: boolean): number {
  let sweep = end - start;
  if (anticlockwise) {
    while (sweep > 0) sweep -= TAU;
  } else {
    while (sweep < 0) sweep += TAU;
  }
  return sweep;
}

function points(contour: Contour): Point[] {
  const out: Point[] = [];
  for (const segment of contour.segments) {
    if (segment.type === 'line') {
      out.push({ x: segment.x0, y: segment.y0 });
      continue;
    }
    const sweep = sweepOf(segment.start, segment.end, segment.anticlockwise);
    const steps = Math.max(2, Math.ceil(Math.abs(sweep) / (Math.PI / 24)));
    for (let i = 0; i < steps; i++) {
      const angle = segment.start + (sweep * i) / steps;
      out.push({ x: segment.cx + segment.r * Math.cos(angle), y: segment.cy + segment.r * Math.sin(angle) });
    }
  }
  return out;
}

function polygon(list: Point[], transform?: Homography): string {
  const mapped = transform ? list.map((p) => apply(transform, p)) : list;
  if (mapped.length < 3) return '';
  return `M${mapped.map((p) => `${round2(p.x)} ${round2(p.y)}`).join(' L')} Z`;
}

// The outline filled the way the examples show it.
function fillOutline(g: SVGGElement, shape: { outline: Contour }, attributes: Record<string, string> = {}): void {
  draw(g, toSvgPath(shape.outline), { fill: 'rgba(255, 255, 255, 0.92)', ...attributes });
}

function borderRing(g: SVGGElement, outline: Contour, widths: Quad<number>, attributes: Record<string, string> = {}): void {
  const { inner } = borderInner(outline, { widths });
  draw(g, `${toSvgPath(outline)} ${innerToSvgPath(inner)}`, { 'fill-rule': 'evenodd', fill: 'rgba(255, 255, 255, 0.92)', ...attributes });
}

const page: DocPage = {
  slug: 'shape',
  name: 'Shape',
  package: '@ax-design/shape',
  tagline: 'The shape language of Axiom: a rectangle with four corners and one feature per side, described as numbers and resolved into lines and arcs.',
  intro: [
    'A shape is a rectangle with decorations. Its four corners can be round, beveled, scooped, notched, and they can move into the box; each side can carry one feature, a bump or a notch. You describe all of that as numbers, and resolve turns the description into an outline of straight lines and circular arcs.',
    'This is the geometry under every surface. @ax-design/surface reads the same values from its --ax-* custom properties and calls the library for you, so most of the time you write only CSS; the examples here use the library directly, so you can see what each value does to the outline, and the last one animates a surface with the same values written as CSS. The Playground has every property with live controls.',
    'Shape has no DOM dependency. The same outline becomes an SVG path, traces on a canvas, or computes a border ring and a tilt on the server.'
  ],
  setup: "import { resolve, toSvgPath, traceContour, borderInner, tiltHomography } from '@ax-design/shape';",
  examples: [
    {
      id: 'outline',
      title: 'From numbers to an outline',
      description: [
        'You hand resolve a box, four corners and four sides. It answers with an outline: a closed path of line and arc segments. The dotted frame in the preview is the sharp contour before any rounding, with a dot at every vertex; the white shape is what the outline draws.',
        'Nothing is measured from the page, so the same call runs anywhere: toSvgPath writes the contour as an SVG path, traceContour traces it on a canvas context or a Path2D.'
      ],
      preview: '<div class="stage"><svg class="board"></svg></div>',
      style: stage,
      controls: [
        { key: 'radius', label: 'Corner radius', type: 'range', min: 0, max: 70, step: 1, unit: '', default: 30, target: { kind: 'css', property: '--shape-radius', selector: '.stage' } },
        { key: 'shape', label: 'Corner shape', type: 'select', options: ['round', 'bevel', 'scoop', 'notch'], default: 'scoop', target: { kind: 'css', property: '--shape-corner', selector: '.stage' } }
      ],
      code: [
        {
          language: 'js',
          source:
            "import { resolve, toSvgPath, traceContour } from '@ax-design/shape';\n\n" +
            "const corner = { radius: {{radius}}, shape: '{{shape}}', shiftX: 0, shiftY: 0 };\n" +
            'const flat = { kind: \'flat\', depth: 0, span: 0, at: 0.5, ratio: 0.5, tipRadius: 0, shoulderRadius: 0 };\n\n' +
            'const shape = resolve({\n' +
            '  width: 200,\n' +
            '  height: 140,\n' +
            '  corners: [corner, corner, corner, corner],\n' +
            '  edges: [flat, flat, flat, flat],\n' +
            '});\n\n' +
            'toSvgPath(shape.outline);          // SVG\n' +
            'traceContour(ctx, shape.outline);  // Canvas'
        },
        { language: 'css', source: '.shape {\n  --ax-radius: {{radius}}px;\n  --ax-corner-shape: {{shape}};\n}' }
      ],
      update(root, values) {
        const shape = resolve({
          width: VIEW.width,
          height: VIEW.height,
          corners: four(corner({ radius: num(values.radius), shape: values.shape as CornerShape })),
          edges: four(flatEdge())
        });
        const svg = board(root, VIEW.width, VIEW.height, VIEW.pad);
        const g = group(svg);
        fillOutline(g, shape);
        draw(g, polygon(shape.vertices), { fill: 'none', stroke: 'rgba(30, 20, 0, 0.55)', 'stroke-width': '1.5', 'stroke-dasharray': '5 5' });
        for (const vertex of shape.vertices) dot(g, vertex, 3, 'rgba(30, 20, 0, 0.6)');
      }
    },
    {
      id: 'corners',
      title: 'Corners',
      description: [
        'The radius is a fillet: a circle that touches both sides, so the corner leaves them smoothly. The library takes px; Surface also accepts percentages, measured against the shorter side. Like border-radius, radii that do not fit are scaled down rather than overflowing.',
        'The corner shape draws a different curve between those two same tangent points. round is the fillet, bevel cuts straight across, scoop bends the other way and notch cuts in with sharp points. Because the tangent points stay put, changing the shape never changes where the corner meets the sides.'
      ],
      preview: '<div class="stage"><svg class="board"></svg></div>',
      style: stage,
      controls: [
        { key: 'radius', label: 'Radius', type: 'range', min: 0, max: 70, step: 1, unit: '', default: 34, target: { kind: 'css', property: '--shape-radius', selector: '.stage' } },
        { key: 'shape', label: 'Shape', type: 'select', options: ['round', 'bevel', 'scoop', 'notch'], default: 'round', target: { kind: 'css', property: '--shape-corner', selector: '.stage' } }
      ],
      code: [
        {
          language: 'js',
          source:
            "const flat = { kind: 'flat', depth: 0, span: 0, at: 0.5, ratio: 0.5, tipRadius: 0, shoulderRadius: 0 };\n" +
            "const corner = { radius: {{radius}}, shape: '{{shape}}', shiftX: 0, shiftY: 0 };\n\n" +
            'resolve({ width: 200, height: 140, corners: [corner, corner, corner, corner], edges: [flat, flat, flat, flat] });'
        },
        { language: 'css', source: '.shape {\n  --ax-radius: {{radius}}px;\n  --ax-corner-shape: {{shape}};\n}' }
      ],
      update(root, values) {
        const shape = resolve({
          width: VIEW.width,
          height: VIEW.height,
          corners: four(corner({ radius: num(values.radius), shape: values.shape as CornerShape })),
          edges: four(flatEdge())
        });
        const g = group(board(root, VIEW.width, VIEW.height, VIEW.pad));
        fillOutline(g, shape);
      }
    },
    {
      id: 'shoulders',
      title: 'Shoulders',
      description: [
        'A bevel, scoop or notch meets the side in a point, so the corner enters the side at an angle. The shoulder radius rounds that meeting: the corner leaves the side smoothly, as a fillet would. A round corner is already smooth and ignores it.',
        'Turn the radius up to half the side and the scoop corners of a square meet in the middle of every edge. Rounding those four points turns the square into a soft star; a large enough shoulder closes the star into a circle.'
      ],
      preview: '<div class="stage"><svg class="board"></svg></div>',
      style: stage,
      controls: [
        { key: 'radius', label: 'Radius', type: 'range', min: 0, max: 90, step: 1, unit: '', default: 90, target: { kind: 'css', property: '--shape-radius', selector: '.stage' } },
        { key: 'shape', label: 'Shape', type: 'select', options: ['scoop', 'bevel', 'notch'], default: 'scoop', target: { kind: 'css', property: '--shape-corner', selector: '.stage' } },
        { key: 'shoulder', label: 'Shoulder radius', type: 'range', min: 0, max: 40, step: 1, unit: '', default: 12, target: { kind: 'css', property: '--shape-shoulder', selector: '.stage' } }
      ],
      code: [
        {
          language: 'js',
          source:
            "const flat = { kind: 'flat', depth: 0, span: 0, at: 0.5, ratio: 0.5, tipRadius: 0, shoulderRadius: 0 };\n" +
            "const corner = { radius: {{radius}}, shape: '{{shape}}', shiftX: 0, shiftY: 0, shoulderRadius: {{shoulder}} };\n\n" +
            'resolve({ width: 180, height: 180, corners: [corner, corner, corner, corner], edges: [flat, flat, flat, flat] });'
        },
        {
          language: 'css',
          source: '.shape {\n  --ax-radius: {{radius}}px;\n  --ax-corner-shape: {{shape}};\n  --ax-corner-shoulder-radius: {{shoulder}}px;\n}'
        }
      ],
      update(root, values) {
        const shape = resolve({
          width: 180,
          height: 180,
          corners: four(corner({ radius: num(values.radius), shape: values.shape as CornerShape, shoulderRadius: num(values.shoulder) })),
          edges: four(flatEdge())
        });
        const g = group(board(root, 180, 180, 40));
        fillOutline(g, shape);
      }
    },
    {
      id: 'shifts',
      title: 'Moved corners',
      description: [
        'shiftX and shiftY move a corner point: positive values point into the shape, negative values out of it. Every corner moves on its own, and the two sides that meet there follow it.',
        'Move the top left and the bottom right corner the same way and the rectangle slants into a parallelogram. Move all four toward the middle for a diamond, or only the two top corners for a trapezoid. Two corners that land on the same point merge into one.'
      ],
      preview: '<div class="stage"><svg class="board"></svg></div>',
      style: stage,
      controls: [
        { key: 'tlx', label: 'Top left, shift x', type: 'range', min: -40, max: 100, step: 1, unit: '', default: 36, target: { kind: 'css', property: '--shape-tlx', selector: '.stage' } },
        { key: 'tly', label: 'Top left, shift y', type: 'range', min: -40, max: 100, step: 1, unit: '', default: 0, target: { kind: 'css', property: '--shape-tly', selector: '.stage' } },
        { key: 'brx', label: 'Bottom right, shift x', type: 'range', min: -40, max: 100, step: 1, unit: '', default: 36, target: { kind: 'css', property: '--shape-brx', selector: '.stage' } }
      ],
      code: [
        {
          language: 'js',
          source:
            "const flat = { kind: 'flat', depth: 0, span: 0, at: 0.5, ratio: 0.5, tipRadius: 0, shoulderRadius: 0 };\n" +
            'const corner = (shiftX, shiftY) => ({ radius: 12, shape: \'round\', shiftX, shiftY });\n\n' +
            'resolve({\n' +
            '  width: 200,\n' +
            '  height: 140,\n' +
            '  corners: [\n' +
            '    corner({{tlx}}, {{tly}}),  // top left\n' +
            '    corner(0, 0),           // top right\n' +
            '    corner({{brx}}, 0),       // bottom right\n' +
            '    corner(0, 0),           // bottom left\n' +
            '  ],\n' +
            '  edges: [flat, flat, flat, flat],\n' +
            '});'
        },
        {
          language: 'css',
          source:
            '.shape {\n  --ax-corner-top-left-shift-x: {{tlx}}px;\n  --ax-corner-top-left-shift-y: {{tly}}px;\n  --ax-corner-bottom-right-shift-x: {{brx}}px;\n}'
        }
      ],
      update(root, values) {
        const shape = resolve({
          width: VIEW.width,
          height: VIEW.height,
          corners: [
            corner({ radius: 12, shiftX: num(values.tlx), shiftY: num(values.tly) }),
            corner({ radius: 12 }),
            corner({ radius: 12, shiftX: num(values.brx) }),
            corner({ radius: 12 })
          ],
          edges: four(flatEdge())
        });
        const g = group(board(root, VIEW.width, VIEW.height, VIEW.pad + 16));
        fillOutline(g, shape);
      }
    },
    {
      id: 'edges',
      title: 'Side features',
      description: [
        'Each side can carry one feature. kind picks what it is: arc is a circular bump or notch, rect, triangle and trapezoid are straight, and cusp is the two-arc one on the next column. depth says how far it goes, positive out of the shape and negative into it. span is the width of its base in px, and at places its middle along the side, from 0 to 1.',
        'Sides run clockwise: top, right, bottom, left. Put the same feature on every side and the same at turns each one the same way around the box, so the result has rotational symmetry rather than mirror symmetry.'
      ],
      preview: '<div class="stage"><svg class="board"></svg></div>',
      style: stage,
      controls: [
        { key: 'side', label: 'Side', type: 'select', options: ['top', 'right', 'bottom', 'left', 'every side'], default: 'top', target: { kind: 'css', property: '--shape-side', selector: '.stage' } },
        { key: 'kind', label: 'Kind', type: 'select', options: ['flat', 'arc', 'rect', 'triangle', 'trapezoid'], default: 'arc', target: { kind: 'css', property: '--shape-kind', selector: '.stage' } },
        { key: 'depth', label: 'Depth', type: 'range', min: -50, max: 50, step: 1, unit: '', default: -24, target: { kind: 'css', property: '--shape-depth', selector: '.stage' } },
        { key: 'span', label: 'Span', type: 'range', min: 0, max: 220, step: 1, unit: '', default: 90, target: { kind: 'css', property: '--shape-span', selector: '.stage' } },
        { key: 'at', label: 'At', type: 'range', min: 0, max: 1, step: 0.05, unit: '', default: 0.5, target: { kind: 'css', property: '--shape-at', selector: '.stage' } }
      ],
      code: [
        {
          language: 'js',
          source:
            "const flat = { kind: 'flat', depth: 0, span: 0, at: 0.5, ratio: 0.5, tipRadius: 0, shoulderRadius: 0 };\n" +
            "const feature = { kind: '{{kind}}', depth: {{depth}}, span: {{span}}, at: {{at}}, ratio: 0.5, tipRadius: 0, shoulderRadius: 0 };\n\n" +
            'resolve({\n' +
            '  width: 200,\n' +
            '  height: 140,\n' +
            '  corners: [corner, corner, corner, corner],\n' +
            '  // top, right, bottom, left\n' +
            '  edges: [feature, flat, flat, flat],\n' +
            '});'
        },
        {
          language: 'css',
          source:
            '.shape {\n  --ax-edge-top-kind: {{kind}};\n  --ax-edge-top-depth: {{depth}}px;\n  --ax-edge-top-span: {{span}}px;\n  --ax-edge-top-at: calc({{at}} * 100%);\n}'
        }
      ],
      update(root, values) {
        const feature: EdgeSpec = { ...flatEdge(), kind: values.kind as EdgeKind, depth: num(values.depth), span: num(values.span), at: num(values.at, 0.5) };
        const edges: Quad<EdgeSpec> = [flatEdge(), flatEdge(), flatEdge(), flatEdge()];
        const chosen = values.side === 'every side' ? [0, 1, 2, 3] : [Math.max(0, SIDES.indexOf(values.side))];
        for (const index of chosen) edges[index] = feature;
        const shape = resolve({ width: VIEW.width, height: VIEW.height, corners: four(corner({ radius: 20 })), edges });
        const g = group(board(root, VIEW.width, VIEW.height, 60));
        fillOutline(g, shape);
      }
    },
    {
      id: 'cusp',
      title: 'The cusp',
      description: [
        'A cusp is two arcs, each leaving the side smoothly at one end of the span, meeting in a point. It is the one kind that needs no shoulder radius: the arcs already leave the side tangentially.',
        'Pointing into the shape it pinches the side, like the waist of the bun or the gaps between the leaves of a clover. Pointing out it makes a pointed arch. The tip radius rounds the meeting point, and at zero the point stays sharp.'
      ],
      preview: '<div class="stage"><svg class="board"></svg></div>',
      style: stage,
      controls: [
        { key: 'depth', label: 'Depth', type: 'range', min: -45, max: 45, step: 1, unit: '', default: -22, target: { kind: 'css', property: '--shape-depth', selector: '.stage' } },
        { key: 'span', label: 'Span', type: 'range', min: 0, max: 180, step: 1, unit: '', default: 180, target: { kind: 'css', property: '--shape-span', selector: '.stage' } },
        { key: 'tip', label: 'Tip radius', type: 'range', min: 0, max: 30, step: 1, unit: '', default: 10, target: { kind: 'css', property: '--shape-tip', selector: '.stage' } }
      ],
      code: [
        {
          language: 'js',
          source:
            "const flat = { kind: 'flat', depth: 0, span: 0, at: 0.5, ratio: 0.5, tipRadius: 0, shoulderRadius: 0 };\n" +
            "const cusp = { kind: 'cusp', depth: {{depth}}, span: {{span}}, at: 0.5, ratio: 0.5, tipRadius: {{tip}}, shoulderRadius: 0 };\n\n" +
            'resolve({\n' +
            '  width: 180,\n' +
            '  height: 160,\n' +
            '  corners: [corner, corner, corner, corner],\n' +
            '  edges: [flat, cusp, flat, cusp],  // top, right, bottom, left\n' +
            '});'
        },
        {
          language: 'css',
          source:
            '.shape {\n  --ax-edge-right-kind: cusp;\n  --ax-edge-right-depth: {{depth}}px;\n  --ax-edge-right-span: {{span}}px;\n  --ax-edge-right-tip-radius: {{tip}}px;\n}'
        }
      ],
      update(root, values) {
        const cusp: EdgeSpec = { ...flatEdge(), kind: 'cusp', depth: num(values.depth), span: num(values.span), tipRadius: num(values.tip) };
        const shape = resolve({
          width: 180,
          height: 160,
          corners: four(corner({ radius: 40 })),
          edges: [flatEdge(), cusp, flatEdge(), cusp]
        });
        const g = group(board(root, 180, 160, 52));
        fillOutline(g, shape);
      }
    },
    {
      id: 'clamps',
      title: 'When values do not fit',
      description: [
        'A radius larger than the side, a feature wider than the space left between two corners: none of it overflows or throws. Values are scaled down until they fit, the same way CSS does with border-radius, and a corner and the feature next to it share the straight part of the side and shrink together.',
        'shape.clamps lists every value that was scaled and by how much, so a tool can tell the reader what it had to do. Push the radius and the span until the readout fills up.'
      ],
      preview: '<div class="stage"><svg class="board"></svg><pre class="out"></pre></div>',
      style: stage,
      controls: [
        { key: 'radius', label: 'Corner radius', type: 'range', min: 0, max: 100, step: 1, unit: '', default: 24, target: { kind: 'css', property: '--shape-radius', selector: '.stage' } },
        { key: 'span', label: 'Feature span', type: 'range', min: 0, max: 240, step: 1, unit: '', default: 90, target: { kind: 'css', property: '--shape-span', selector: '.stage' } }
      ],
      code: [
        {
          language: 'js',
          source:
            "const feature = { kind: 'arc', depth: -20, span: {{span}}, at: 0.5, ratio: 0.5, tipRadius: 0, shoulderRadius: 0 };\n\n" +
            'const shape = resolve({\n' +
            '  width: 200,\n' +
            '  height: 70,\n' +
            '  corners: [corner, corner, corner, corner],\n' +
            '  edges: [feature, flat, flat, flat],\n' +
            '});\n\n' +
            'shape.clamps; // [{ kind: \'corner-radius\', index: 1, factor: 0.62 }, ...]'
        },
        { language: 'css', source: '.shape {\n  --ax-radius: {{radius}}px;\n  --ax-edge-top-span: {{span}}px;\n}' }
      ],
      update(root, values) {
        const feature: EdgeSpec = { ...flatEdge(), kind: 'arc', depth: -20, span: num(values.span) };
        const shape = resolve({
          width: 200,
          height: 70,
          corners: four(corner({ radius: num(values.radius) })),
          edges: [feature, flatEdge(), flatEdge(), flatEdge()]
        });
        const g = group(board(root, 200, 70, VIEW.pad + 12));
        fillOutline(g, shape);
        const out = root.querySelector<HTMLElement>('.out');
        if (out) {
          out.textContent = shape.clamps.length ? `scaled down:\n${shape.clamps.map((clamp) => `  ${describeClamp(clamp)}`).join('\n')}` : 'nothing was scaled: every value fits.';
        }
      }
    },
    {
      id: 'borders',
      title: 'Borders',
      description: [
        'A border is a ring: the outline, and an inner edge at the same distance inside. borderInner offsets every segment by its own width, joins neighbours where the offset lines cross, and drops segments that turned around in a narrow place, so a ring works on a shape of any complexity. Fill the two contours with the even-odd rule and the ring is what stays between them.',
        'The widths are per side, so one side can be thicker than the others. Pass the tilt of the element and the width is kept as it appears on screen (next column).'
      ],
      preview: '<div class="stage"><svg class="board"></svg></div>',
      style: stage,
      controls: [
        { key: 'width', label: 'Border width', type: 'range', min: 0, max: 20, step: 1, unit: '', default: 6, target: { kind: 'css', property: '--shape-border', selector: '.stage' } },
        { key: 'radius', label: 'Corner radius', type: 'range', min: 0, max: 70, step: 1, unit: '', default: 30, target: { kind: 'css', property: '--shape-radius', selector: '.stage' } }
      ],
      code: [
        {
          language: 'js',
          source:
            "import { borderInner, traceInner } from '@ax-design/shape';\n\n" +
            'const { inner } = borderInner(shape.outline, { widths: [{{width}}, {{width}}, {{width}}, {{width}}] });\n\n' +
            'ctx.beginPath();\n' +
            'traceContour(ctx, shape.outline);\n' +
            'traceInner(ctx, inner);\n' +
            'ctx.fill(\'evenodd\');'
        },
        { language: 'css', source: '.shape {\n  --ax-border-width: {{width}}px;\n  --ax-radius: {{radius}}px;\n}' }
      ],
      update(root, values) {
        const shape = resolve({
          width: VIEW.width,
          height: VIEW.height,
          corners: four(corner({ radius: num(values.radius) })),
          edges: four(flatEdge())
        });
        const g = group(board(root, VIEW.width, VIEW.height, VIEW.pad));
        const width = num(values.width);
        borderRing(g, shape.outline, [width, width, width, width]);
      }
    },
    {
      id: 'tilt',
      title: 'Tilt',
      description: [
        'When the element is tilted with perspective() and rotateX() / rotateY(), a border taken from the untilted outline would thin on the far side. Pass the tilt as a homography and borderInner offsets in screen space instead: the inner edge comes back in local coordinates, so the ring keeps the same thickness everywhere on screen.',
        'Both shapes below share one outline and one homography. The left one ignored the tilt, the right one passed it. The readout is the thickness borderInner reports for the right one.'
      ],
      preview: '<div class="stage"><svg class="board"></svg><pre class="out"></pre></div>',
      style: stage,
      controls: [
        { key: 'rotateX', label: 'rotateX', type: 'range', min: -60, max: 60, step: 1, unit: '', default: 18, target: { kind: 'css', property: '--shape-rx', selector: '.stage' } },
        { key: 'rotateY', label: 'rotateY', type: 'range', min: -60, max: 60, step: 1, unit: '', default: 30, target: { kind: 'css', property: '--shape-ry', selector: '.stage' } },
        { key: 'perspective', label: 'Perspective', type: 'range', min: 25, max: 1500, step: 5, unit: '', default: 400, target: { kind: 'css', property: '--shape-perspective', selector: '.stage' } }
      ],
      code: [
        {
          language: 'js',
          source:
            "import { borderInner, tiltHomography } from '@ax-design/shape';\n\n" +
            'const transform = tiltHomography({\n' +
            '  width: 140,\n' +
            '  height: 100,\n' +
            '  perspective: {{perspective}},\n' +
            '  rotateX: {{rotateX}},\n' +
            '  rotateY: {{rotateY}},\n' +
            '  translateZ: 0,\n' +
            '});\n\n' +
            'const { inner, thickness } = borderInner(shape.outline, { widths: [8, 8, 8, 8], transform });\n' +
            '// thickness: the same on every side, as seen on screen'
        }
      ],
      update(root, values) {
        const size = { width: 140, height: 100 };
        const transform = tiltHomography({
          ...size,
          perspective: num(values.perspective, 400),
          rotateX: num(values.rotateX),
          rotateY: num(values.rotateY),
          translateZ: 0
        });
        const shape = resolve({
          width: size.width,
          height: size.height,
          corners: four(corner({ radius: 16 })),
          edges: four(flatEdge())
        });
        const outer = points(shape.outline);
        const naive = borderInner(shape.outline, { widths: [8, 8, 8, 8] });
        const passed = borderInner(shape.outline, { widths: [8, 8, 8, 8], transform });
        const svg = board(root, 320, 100, VIEW.pad);
        const left = group(svg);
        draw(left, `${polygon(outer, transform)} ${polygon(naive.inner, transform)}`, { 'fill-rule': 'evenodd', fill: 'rgba(255, 255, 255, 0.92)' });
        label(left, 70, -18, 'tilt ignored');
        const right = group(svg, 180);
        draw(right, `${polygon(outer, transform)} ${polygon(passed.inner, transform)}`, { 'fill-rule': 'evenodd', fill: 'rgba(255, 255, 255, 0.92)' });
        label(right, 70, -18, 'tilt passed');
        const out = root.querySelector<HTMLElement>('.out');
        if (out) out.textContent = `on screen: ${round2(passed.thickness[0])}px on every side`;
      }
    },
    {
      id: 'motion',
      title: 'A shape in motion',
      description: [
        'A shape is numbers, so a shape can move. Give the properties a transition or an animation and the outline follows: Surface registers every shape property with CSS.registerProperty, so the browser interpolates the numbers. Without registration, an animation of a custom property is applied in steps, and the shape would jump from one value to the next.',
        'The keyframes below move the radius, the four shifts and the shared edge depth together, so a circle becomes a square, then a diamond, then a star and back. A frame whose values do not fit is scaled down on the way, exactly like a shape at rest, so an animation cannot break the outline.',
        'Each frame resolves the shape again. The same call runs whether the numbers came from a stylesheet, from a spring or from your own code.'
      ],
      preview: '<div class="stage"><ax-surface class="morph" layers="fill"></ax-surface></div>',
      style: `
.stage { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
.morph {
  width: 190px;
  height: 190px;
  --ax-fill-color: rgba(255, 255, 255, 0.92);
  --ax-border-width: 0px;
  --ax-edge-kind: triangle;
  --ax-edge-span: 44%;
  --ax-edge-tip-radius: 5px;
  --ax-edge-shoulder-radius: 5px;
  animation: shape-morph 8s cubic-bezier(0.6, 0, 0.3, 1) infinite;
}
@keyframes shape-morph {
  0%, 100% { --ax-radius: 50%; --ax-corner-top-left-shift-y: 0%; --ax-corner-top-right-shift-x: 0%; --ax-corner-bottom-right-shift-y: 0%; --ax-corner-bottom-left-shift-x: 0%; --ax-edge-depth: 0px; }
  25% { --ax-radius: 28%; --ax-corner-top-left-shift-y: 0%; --ax-corner-top-right-shift-x: 0%; --ax-corner-bottom-right-shift-y: 0%; --ax-corner-bottom-left-shift-x: 0%; --ax-edge-depth: 0px; }
  50% { --ax-radius: 14%; --ax-corner-top-left-shift-y: 50%; --ax-corner-top-right-shift-x: 50%; --ax-corner-bottom-right-shift-y: 50%; --ax-corner-bottom-left-shift-x: 50%; --ax-edge-depth: 0px; }
  75% { --ax-radius: 19%; --ax-corner-top-left-shift-y: 0%; --ax-corner-top-right-shift-x: 0%; --ax-corner-bottom-right-shift-y: 0%; --ax-corner-bottom-left-shift-x: 0%; --ax-edge-depth: 22px; }
}
`,
      controls: [
        { key: 'duration', label: 'Duration', type: 'range', min: 1000, max: 12000, step: 250, unit: 'ms', default: 8000, target: { kind: 'css', property: 'animation-duration', selector: '.morph' } },
        { key: 'play', label: 'Play', type: 'toggle', default: true, on: 'running', off: 'paused', target: { kind: 'css', property: 'animation-play-state', selector: '.morph' } }
      ],
      code: [
        { language: 'html', source: '<ax-surface class="morph" layers="fill"></ax-surface>' },
        {
          language: 'css',
          source:
            '.morph {\n  animation: shape-morph 8s cubic-bezier(0.6, 0, 0.3, 1) infinite;\n}\n\n' +
            '@keyframes shape-morph {\n' +
            '  0%, 100% { --ax-radius: 50%; --ax-edge-depth: 0px; }\n' +
            '  25%      { --ax-radius: 28%; --ax-edge-depth: 0px; }\n' +
            '  50%      { --ax-radius: 14%; --ax-corner-top-left-shift-y: 50%; --ax-corner-top-right-shift-x: 50%; --ax-corner-bottom-right-shift-y: 50%; --ax-corner-bottom-left-shift-x: 50%; --ax-edge-depth: 0px; }\n' +
            '  75%      { --ax-radius: 19%; --ax-edge-depth: 22px; }\n' +
            '}'
        },
        {
          language: 'js',
          source:
            "import { borderWidthsFrom, shapeSpecFrom } from '@ax-design/surface';\n\n" +
            '// Surface runs this on every frame, from the values it just read: a shape in motion is a\n' +
            '// shape resolved again.\n' +
            'resolve(shapeSpecFrom(values, width, height), { borderWidths: borderWidthsFrom(values) });'
        }
      ]
    }
  ],
  reference: [
    {
      name: 'resolve(spec, options?)',
      kind: 'method',
      type: '(spec: ShapeSpec, options?: ResolveOptions) => ResolvedShape',
      description: 'Turns a description into lines and arcs. It never throws over values that do not fit: it scales them down and reports them in clamps.'
    },
    {
      name: 'ShapeSpec',
      kind: 'property',
      type: '{ width, height, corners, edges }',
      description: 'The description: the box in px, four CornerSpec (top left, top right, bottom right, bottom left) and four EdgeSpec (top, right, bottom, left).'
    },
    {
      name: 'CornerSpec',
      kind: 'property',
      type: '{ radius, shape, shiftX, shiftY, shoulderRadius? }',
      description: 'One corner: the fillet radius in px, the curve, how far the point moved into the shape in px, and the radius that rounds where the curve meets the sides.'
    },
    {
      name: 'EdgeSpec',
      kind: 'property',
      type: '{ kind, depth, span, at, ratio, tipRadius, shoulderRadius }',
      description: 'One side feature: what it is, its depth in px (positive out, negative in), its base width in px, the middle of that base as a fraction of the side (0 to 1), the far-end ratio for trapezoid, and the two corner rounds in px.'
    },
    { name: 'CornerShape', kind: 'property', type: "'round' | 'bevel' | 'scoop' | 'notch'", description: 'The curve of a corner, with the same meaning as the CSS corner-shape keywords.' },
    { name: 'EdgeKind', kind: 'property', type: "'flat' | 'arc' | 'rect' | 'triangle' | 'trapezoid' | 'cusp'", description: 'The feature of a side. A flat edge ignores the other EdgeSpec values.' },
    {
      name: 'ResolvedShape',
      kind: 'property',
      type: '{ outline, vertices, bounds, clamps }',
      description: 'outline is the closed contour; vertices is the sharp contour with a radius per vertex, kept for debugging and for borders; bounds wraps every point; clamps lists what did not fit.'
    },
    { name: 'Contour, Segment', kind: 'property', type: '{ segments: Segment[] }', description: 'A closed path. Consecutive segments share their endpoints; each is a line or an arc with its center, radius, start and end angle and direction.' },
    {
      name: 'Clamp',
      kind: 'property',
      type: "{ kind: 'corner-shift' | 'corner-radius' | 'edge-span' | 'edge-depth' | 'vertex-radius', index, factor }",
      description: 'One value that did not fit, the corner or side it belongs to, and the factor below 1 that was applied to it. vertex-radius is the rounding at a single vertex, such as the tip of a cusp.'
    },
    { name: 'ResolveOptions', kind: 'property', type: '{ borderWidths?, minNeck? }', description: 'borderWidths per side keeps inward features clear of the border; minNeck is the thickness kept between opposite inward features and defaults to two border widths.' },
    { name: 'toSvgPath(contour, precision?)', kind: 'method', type: '(contour: Contour, precision?: number) => string', default: 'precision = 3', description: 'The contour as SVG path data, ready for a d attribute.' },
    { name: 'traceContour(sink, contour)', kind: 'method', type: '(sink: PathSink, contour: Contour) => void', description: 'Traces the contour on anything with moveTo, lineTo, arc and closePath: a canvas context or a Path2D.' },
    { name: 'PathSink', kind: 'property', type: '{ moveTo, lineTo, arc, closePath }', description: 'The four methods traceContour uses, as in CanvasRenderingContext2D.' },
    { name: 'borderInner(outline, options)', kind: 'method', type: '(outline: Contour, options: BorderOptions) => BorderResult', description: 'The inner edge of a border ring in local coordinates, with the thickness it has on screen per side. Offsets every segment, joins neighbours at the intersection of their offset lines, and removes segments that turned around.' },
    { name: 'BorderOptions', kind: 'property', type: '{ widths, transform?, center?, tolerance? }', description: 'Widths per side in local px; the tilt as a Homography to keep the thickness even on screen; the center used for that scale (the outline center by default); and the maximum chord error of the arc sampling (0.1 px).' },
    { name: 'borderInner().inner, .thickness', kind: 'property', type: '{ inner: Point[], thickness: Quad<number> }', description: 'inner is a closed polyline in local coordinates; thickness is what each side of the border measures on screen.' },
    { name: 'traceInner(sink, inner)', kind: 'method', type: '(sink: RingSink, inner: Point[]) => void', description: 'Traces the inner edge as a second subpath. Fill it together with the outline using the even-odd rule.' },
    { name: 'innerToSvgPath(inner, precision?)', kind: 'method', type: '(inner: Point[], precision?: number) => string', default: 'precision = 3', description: 'The inner edge as SVG path data, to append to the outline path.' },
    { name: 'tiltHomography(params)', kind: 'method', type: '(params: TiltParams) => Homography', description: 'The matrix of perspective() rotateX() rotateY() translateZ() around the center of a box, as it acts on the untilted plane. Pass it to borderInner as transform.' },
    { name: 'TiltParams', kind: 'property', type: '{ width, height, perspective, rotateX, rotateY, translateZ }', description: 'The box and the angles in degrees, as in CSS. perspective is the distance in px; 0 or Infinity means no perspective.' },
    { name: 'apply(h, point), invert(h)', kind: 'method', type: '(h: Homography, point: Point) => Point', description: 'Maps a point through a homography, and the inverse of one. apply divides by w, so it projects the tilted point back onto the plane of the screen.' },
    { name: 'scaleAt(h, point)', kind: 'method', type: '(h: Homography, point: Point) => number', description: 'How much one local px grows on screen at that point. It is what makes a border keep its on-screen width.' },
    { name: 'IDENTITY', kind: 'property', type: 'Homography', description: 'The matrix that changes nothing, used when the element is flat.' },
    { name: 'Homography', kind: 'property', type: '[number, number, number, number, number, number, number, number, number]', description: 'A 3x3 matrix in row-major order that maps local (x, y, 1) to screen coordinates.' },
    { name: 'Quad<T>', kind: 'property', type: '[T, T, T, T]', description: 'Four values, in the order of the corners (top left, top right, bottom right, bottom left) or of the sides (top, right, bottom, left).' },

    { name: '--ax-radius', kind: 'property', type: '<length-percentage>', default: '0px', description: 'Surface: the radius of every corner. Percentages are relative to the shorter side; Surface resolves them and passes px on.' },
    { name: '--ax-{corner}-radius', kind: 'property', type: '<length-percentage>', default: '-1px', description: 'Surface: the radius of one corner. A negative value means use --ax-radius.' },
    { name: '--ax-corner-shape', kind: 'property', type: 'round | bevel | scoop | notch', default: 'round', description: 'Surface: the shape of every corner.' },
    { name: '--ax-corner-{corner}-shape', kind: 'property', type: 'round | bevel | scoop | notch | auto', default: 'auto', description: 'Surface: the shape of one corner. auto means use --ax-corner-shape.' },
    { name: '--ax-corner-shoulder-radius, --ax-corner-{corner}-shoulder-radius', kind: 'property', type: '<length>', default: '0px', description: 'Surface: rounds where a bevel, scoop or notch corner meets the sides. Round corners ignore it.' },
    { name: '--ax-corner-{corner}-shift-x, --ax-corner-{corner}-shift-y', kind: 'property', type: '<length-percentage>', default: '0px', description: 'Surface: moves one corner point into the shape, x against the width and y against the height. Negative values move it out of the box.' },
    { name: '--ax-edge-{side}-kind', kind: 'property', type: 'flat | arc | rect | triangle | trapezoid | cusp', default: 'flat', description: 'Surface: the feature on one side, with the same meaning as EdgeKind. The side names are top, right, bottom, left.' },
    { name: '--ax-edge-{side}-depth', kind: 'property', type: '<length>', default: '0px', description: 'Surface: how far the feature goes, positive out of the shape and negative into it.' },
    { name: '--ax-edge-{side}-span', kind: 'property', type: '<length-percentage>', default: '33%', description: 'Surface: the width of the base, in px or as a share of the side.' },
    { name: '--ax-edge-{side}-at', kind: 'property', type: '<length-percentage>', default: '50%', description: 'Surface: where the middle of the feature sits along the side. Sides run clockwise, so 20% on the bottom is near the bottom right corner.' },
    { name: '--ax-edge-{side}-ratio', kind: 'property', type: '<number>', default: '0.5', description: 'Surface: for trapezoid, the width of the far end compared to the base. 1 gives a rectangle, 0 a triangle.' },
    { name: '--ax-edge-{side}-tip-radius, --ax-edge-{side}-shoulder-radius', kind: 'property', type: '<length>', default: '0px', description: 'Surface: rounds the far corners of a feature and the corners where it meets the side.' },
    {
      name: '--ax-edge-kind, --ax-edge-depth, --ax-edge-span, --ax-edge-at, --ax-edge-ratio, --ax-edge-tip-radius, --ax-edge-shoulder-radius',
      kind: 'property',
      type: 'as the side properties',
      description: 'Surface: the feature of all four sides at once. A side that sets its own value wins over the shared one.'
    }
  ]
};

export default page;
