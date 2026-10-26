// A small orthographic projection for the architecture diagram: a point of the scene, with x to
// the right, y toward the viewer and z up, turned by `yaw` about the vertical axis and tipped by
// `pitch` toward the viewer, onto the screen. Everything it draws is plain SVG: no bitmaps and
// no transforms of the browser, so a plane keeps its own outline at any angle.

export interface View {
  // Degrees: the turn about the vertical axis.
  yaw: number;
  // Degrees: 90 looks straight down, 0 along the planes.
  pitch: number;
  // Pixels per unit of the scene.
  scale: number;
  // Where the origin of the scene lands on the screen.
  cx: number;
  cy: number;
}

export type Point = [number, number];

const rad = (degrees: number) => (degrees * Math.PI) / 180;

export function project(view: View, x: number, y: number, z: number): Point {
  const yaw = rad(view.yaw);
  const pitch = rad(view.pitch);
  const turnedX = x * Math.cos(yaw) - y * Math.sin(yaw);
  const turnedY = x * Math.sin(yaw) + y * Math.cos(yaw);
  return [view.cx + turnedX * view.scale, view.cy + (turnedY * Math.sin(pitch) - z * Math.cos(pitch)) * view.scale];
}

export interface Slab {
  top: string;
  // The side faces turned toward the viewer, with the opacity of the black laid over each, to shade it.
  sides: { points: string; shade: number }[];
}

const pts = (list: Point[]) => list.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

// A box of width w (x) and depth d (y) centered on (x, y), standing on z, `height` thick: the
// outline of its top face and the side faces that face the viewer.
export function slab(view: View, x: number, y: number, z: number, w: number, d: number, height: number): Slab {
  const x0 = x - w / 2;
  const x1 = x + w / 2;
  const y0 = y - d / 2;
  const y1 = y + d / 2;
  const top = z + height;
  const corner = (cx: number, cy: number, cz: number) => project(view, cx, cy, cz);
  const yaw = rad(view.yaw);
  // [from, to, outward normal]: the four sides, as they go around the box.
  const edges: [Point, Point, Point][] = [
    [[x0, y0], [x1, y0], [0, -1]],
    [[x1, y0], [x1, y1], [1, 0]],
    [[x1, y1], [x0, y1], [0, 1]],
    [[x0, y1], [x0, y0], [-1, 0]]
  ];
  const sides: Slab['sides'] = [];
  for (const [from, to, [nx, ny]] of edges) {
    // The normal turned by the yaw: a side faces the viewer when it points down the screen.
    const facing = nx * Math.sin(yaw) + ny * Math.cos(yaw);
    if (facing <= 0.01) continue;
    sides.push({
      points: pts([corner(from[0], from[1], top), corner(to[0], to[1], top), corner(to[0], to[1], z), corner(from[0], from[1], z)]),
      // A side that turns to the right of the screen takes the light; one to the left is in shade.
      shade: nx * Math.cos(yaw) - ny * Math.sin(yaw) > 0 ? 0.3 : 0.5
    });
  }
  return {
    top: pts([corner(x0, y0, top), corner(x1, y0, top), corner(x1, y1, top), corner(x0, y1, top)]),
    sides
  };
}
