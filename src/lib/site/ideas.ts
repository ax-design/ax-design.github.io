// The ideas page: small things made of Surface and its layers, each with the code that makes
// it. Sizes are in cells of the tile group: two cells are 124px, four are 260px.

export interface Idea {
  id: string;
  title: string;
  description: string;
  columns: number;
  rows: number;
  html: string;
  css: string;
  // Script for ideas that need one: the code shown, and what the page runs on the idea.
  js?: { code: string; run: (root: HTMLElement) => () => void };
}

// Parts several ideas share; each idea lists the ones it uses, so its code is complete.
const text = `.tile-text { display: flex; flex-direction: column; height: 100%; padding: 14px 16px; }
.tile-text .big { font-size: 30px; font-weight: 300; line-height: 1; margin-top: auto; }
.tile-text .small { font-size: 12px; opacity: 0.8; }`;

const glass = `.glass {
  --acrylic-tint-color: #ffffff; --acrylic-tint-opacity: 0.16; --acrylic-blur: 28px;
  --reveal-color: rgb(255, 255, 255); --reveal-opacity: 0.3; --ax-border-width: 1px;
  --ax-tilt-mode: absolute; --ax-tilt-depth: 3px; --ax-tilt-perspective: 600px;
}`;

const ALL: Idea[] = [
  {
    id: 'weather',
    title: 'Weather',
    description: 'A glass tile with one scooped corner. The scoop grows while your pointer is over it: the radius of one corner is a custom property, so it takes a transition.',
    columns: 4,
    rows: 2,
    html: `<ax-surface class="glass weather" layers="acrylic reveal">
  <div class="tile-text"><span class="small">Hangzhou, light rain</span><span class="big">23°</span></div>
</ax-surface>`,
    css: `${text}
${glass}
.weather {
  width: 260px; height: 124px; color: #fff;
  --ax-radius: 20px;
  --ax-corner-bottom-right-shape: scoop; --ax-bottom-right-radius: 26px;
  transition: --ax-bottom-right-radius 0.4s;
}
.weather:hover { --ax-bottom-right-radius: 44px; }`
  },
  {
    id: 'bubble',
    title: 'Chat bubble',
    description: 'The tail is a triangle on the bottom side, rounded at its tip and where it meets the side. The shadow of the elevation layer follows it. Sides run clockwise, so on the bottom side at counts from the right.',
    columns: 4,
    rows: 2,
    html: `<ax-surface class="bubble" layers="elevation fill">
  <div class="tile-text"><strong>Mira</strong><span>The tail is an edge feature, and its shadow follows it.</span></div>
</ax-surface>`,
    css: `${text}
.bubble {
  width: 260px; height: 92px; color: #161a23;
  --ax-radius: 20px; --ax-fill-color: #ffffff; --ax-border-width: 0px;
  --elevation-depth: 16;
  --ax-edge-bottom-kind: triangle; --ax-edge-bottom-at: 82%; --ax-edge-bottom-depth: 14px; --ax-edge-bottom-span: 26px;
  --ax-edge-bottom-tip-radius: 3px; --ax-edge-bottom-shoulder-radius: 6px;
  --ax-tilt-mode: absolute; --ax-tilt-depth: 3px; --ax-tilt-perspective: 600px;
  transition: --ax-edge-bottom-depth 0.3s, --ax-edge-bottom-at 0.3s;
}
.bubble:hover { --ax-edge-bottom-depth: 24px; --ax-edge-bottom-at: 74%; }
.bubble .tile-text { padding: 14px 18px; }`
  },
  {
    id: 'player',
    title: 'Player',
    description: 'The play button sits in a cradle cut into the bottom side: a rect feature with a large tip radius, 8px wider than the button. Press the button and it turns into a rounded square; the cradle follows it.',
    columns: 4,
    rows: 4,
    html: `<div class="player-wrap">
  <ax-surface class="glass player" layers="acrylic reveal">
    <div class="tile-text"><div class="cover"></div><strong>Nightfall</strong><span class="small">Lumen Drift</span></div>
  </ax-surface>
  <ax-surface class="play" layers="elevation fill reveal">
    <svg width="20" height="24" viewBox="0 0 20 24" aria-hidden="true"><path d="M2 2l16 10L2 22z" fill="#3d5afe" stroke="#3d5afe" stroke-width="3" stroke-linejoin="round"/></svg>
  </ax-surface>
</div>`,
    css: `${text}
${glass}
.player-wrap { position: relative; width: 260px; height: 260px; color: #fff; }
.player-wrap .tile-text { padding: 16px 18px; }
.player {
  display: block; width: 100%; height: calc(100% - 34px);
  --ax-radius: 22px;
  --ax-edge-bottom-kind: rect; --ax-edge-bottom-depth: -42px; --ax-edge-bottom-span: 84px;
  --ax-edge-bottom-tip-radius: 37px; --ax-edge-bottom-shoulder-radius: 5px;
  transition: --ax-edge-bottom-tip-radius 0.25s, --ax-edge-bottom-shoulder-radius 0.25s;
}
/* While the button is pressed: 30% of 68px plus the 8px gap. */
.player-wrap.pressed .player { --ax-edge-bottom-tip-radius: 28.4px; --ax-edge-bottom-shoulder-radius: 8px; }
.player .cover { width: 72px; height: 72px; border-radius: 12px; background: linear-gradient(135deg, #ffca28, #ff7a59 60%, #7c4dff); margin-bottom: 12px; }
.play {
  position: absolute; left: 50%; bottom: 0; margin-left: -34px; width: 68px; height: 68px;
  --ax-radius: 50%; --ax-fill-color: #fff; --ax-border-width: 0px; --elevation-depth: 16;
  --reveal-color: rgb(61, 90, 254); --reveal-opacity: 0.35;
  --ax-tilt-mode: absolute; --ax-tilt-depth: 3px; --ax-tilt-perspective: 300px;
  transition: --ax-radius 0.25s;
}
.player-wrap.pressed .play { --ax-radius: 30%; }
.play svg { display: block; margin: 22px auto 0 26px; }`,
    js: {
      code: `const wrap = document.querySelector('.player-wrap');
const release = () => wrap.classList.remove('pressed');
wrap.querySelector('.play').addEventListener('pointerdown', () => wrap.classList.add('pressed'));
window.addEventListener('pointerup', release);
window.addEventListener('pointercancel', release);`,
      run(root) {
        const wrap = root.querySelector('.player-wrap') as HTMLElement;
        const play = root.querySelector('.play') as HTMLElement;
        const press = () => wrap.classList.add('pressed');
        const release = () => wrap.classList.remove('pressed');
        play.addEventListener('pointerdown', press);
        window.addEventListener('pointerup', release);
        window.addEventListener('pointercancel', release);
        return () => {
          play.removeEventListener('pointerdown', press);
          window.removeEventListener('pointerup', release);
          window.removeEventListener('pointercancel', release);
        };
      }
    }
  },
  {
    id: 'inbox',
    title: 'Inbox',
    description: 'A badge in a cradle: the top right corner is a scoop around the badge, 6px wider than it. Point at the tile and the badge grows; the radius of the corner grows with it, in the same transition.',
    columns: 2,
    rows: 2,
    html: `<div class="inbox-wrap">
  <ax-surface class="inbox" layers="elevation fill reveal">
    <div class="tile-text"><span class="small">Inbox</span><span class="big">Mail</span></div>
  </ax-surface>
  <ax-surface class="count" layers="fill"><span>3</span></ax-surface>
</div>`,
    css: `${text}
.inbox-wrap { position: relative; width: 124px; height: 124px; }
.inbox {
  position: absolute; left: 0; bottom: 0; width: 104px; height: 104px; color: #fff;
  --ax-radius: 16px; --ax-fill-color: #0f6cbd; --ax-border-width: 0px; --elevation-depth: 8;
  --ax-corner-top-right-shape: scoop; --ax-top-right-radius: 24px;
  --reveal-color: rgb(255, 255, 255); --reveal-opacity: 0.35;
  --ax-tilt-mode: absolute; --ax-tilt-depth: 2px; --ax-tilt-perspective: 400px;
  transition: --ax-top-right-radius 0.3s cubic-bezier(0.3, 1.4, 0.5, 1);
}
.inbox .big { font-size: 24px; }
/* The badge is centered on the corner of the tile: its radius is the scoop's minus the gap. */
.count {
  position: absolute; right: 2px; top: 2px; width: 36px; height: 36px;
  color: #fff; font-size: 15px; font-weight: 600;
  --ax-radius: 50%; --ax-fill-color: #c50f1f; --ax-border-width: 0px;
  transition: width 0.3s cubic-bezier(0.3, 1.4, 0.5, 1), height 0.3s cubic-bezier(0.3, 1.4, 0.5, 1), right 0.3s cubic-bezier(0.3, 1.4, 0.5, 1), top 0.3s cubic-bezier(0.3, 1.4, 0.5, 1);
}
.count span { display: flex; height: 100%; align-items: center; justify-content: center; }
.inbox-wrap:hover .inbox { --ax-top-right-radius: 32px; }
.inbox-wrap:hover .count { width: 52px; height: 52px; right: -6px; top: -6px; }`
  },
  {
    id: 'folder',
    title: 'Folder',
    description: 'The tab of a folder is a rect feature on the top side, a bit to the left. Its tip radius rounds the top of the tab, its shoulder radius the corners where the tab meets the side.',
    columns: 2,
    rows: 2,
    html: `<ax-surface class="glass folder" layers="acrylic reveal">
  <div class="tile-text"><span class="small">Folder</span><span class="big">Drafts</span></div>
</ax-surface>`,
    css: `${text}
${glass}
.folder {
  width: 124px; height: 112px; margin-top: 12px; color: #fff;
  --ax-radius: 14px;
  --ax-edge-top-kind: rect; --ax-edge-top-at: 26%; --ax-edge-top-span: 44%; --ax-edge-top-depth: 12px;
  --ax-edge-top-tip-radius: 8px; --ax-edge-top-shoulder-radius: 6px;
}
.folder .big { font-size: 22px; }`
  },
  {
    id: 'note',
    title: 'Note',
    description: 'A sticky note with a folded corner: a bevel on the top right corner, and a small radius on the others.',
    columns: 2,
    rows: 2,
    html: `<ax-surface class="note" layers="elevation fill">
  <div class="tile-text">Buy milk.<br>Fold the corner.</div>
</ax-surface>`,
    css: `${text}
.note {
  width: 124px; height: 124px; color: #3b3216;
  --ax-radius: 6px; --ax-fill-color: #ffe082; --ax-border-width: 0px;
  --ax-corner-top-right-shape: bevel; --ax-top-right-radius: 28px;
  --elevation-depth: 8;
  --ax-tilt-mode: absolute; --ax-tilt-depth: 2px; --ax-tilt-perspective: 500px;
}
.note .tile-text { font-family: "Segoe Print", "Bradley Hand", cursive; font-size: 15px; }`
  },
  {
    id: 'ticket',
    title: 'Ticket',
    description: 'Two arcs going into the left and right sides make a ticket. The shadow goes into the bites too.',
    columns: 4,
    rows: 2,
    html: `<ax-surface class="ticket" layers="elevation fill">
  <div class="tile-text"><span class="city">HGH</span><span class="sep"></span><span class="city">KIX</span></div>
  <div class="meta">MU 729 · Gate 12 · 08:40</div>
</ax-surface>`,
    css: `${text}
.ticket {
  width: 260px; height: 124px; color: #161a23;
  --ax-radius: 12px; --ax-fill-color: #fffaf0; --ax-border-width: 0px;
  --elevation-depth: 12;
  --ax-edge-left-kind: arc; --ax-edge-left-depth: -11px; --ax-edge-left-span: 22px; --ax-edge-left-shoulder-radius: 2px;
  --ax-edge-right-kind: arc; --ax-edge-right-depth: -11px; --ax-edge-right-span: 22px; --ax-edge-right-shoulder-radius: 2px;
  --ax-tilt-mode: absolute; --ax-tilt-depth: 3px; --ax-tilt-perspective: 600px;
}
.ticket .tile-text { flex-direction: row; align-items: center; gap: 14px; }
.ticket .city { font-size: 26px; font-weight: 700; letter-spacing: 0.02em; }
.ticket .sep { flex: 1; border-top: 2px dashed #c9c2b2; }
.ticket .meta { position: absolute; left: 0; right: 0; bottom: 14px; text-align: center; font-size: 11px; color: #8a8270; }`
  },
  {
    id: 'press',
    title: 'Press',
    description: 'Press the circle and it becomes a rounded square that sits lower: the radius and the elevation depth change in :active, with a transition that overshoots a little.',
    columns: 2,
    rows: 2,
    html: `<ax-surface class="press" layers="elevation fill reveal">
  <div class="tile-text">Press me</div>
</ax-surface>`,
    css: `${text}
.press {
  width: 124px; height: 124px; color: #fff;
  --ax-radius: 50%; --ax-fill-color: #3d5afe; --ax-border-width: 0px;
  --reveal-color: rgb(255, 255, 255); --reveal-opacity: 0.45;
  --elevation-depth: 20;
  --ax-tilt-mode: absolute; --ax-tilt-depth: 3px; --ax-tilt-perspective: 400px;
  transition: --ax-radius 0.35s cubic-bezier(0.3, 1.6, 0.5, 1), --elevation-depth 0.2s;
}
.press:active { --ax-radius: 22%; --elevation-depth: 6; }
.press .tile-text { align-items: center; justify-content: center; font-weight: 600; }`
  },
  {
    id: 'badge',
    title: 'Badge',
    description: 'An achievement badge: a scoop on every corner, almost as large as half the side, and a shoulder radius that rounds the points into a soft star. Point at it and it puffs up: the scoops get smaller, and it floats higher.',
    columns: 2,
    rows: 2,
    html: `<ax-surface class="star" layers="elevation fill reveal">
  <div class="tile-text"><span class="days">7</span><span class="small">days</span></div>
</ax-surface>`,
    css: `${text}
.star {
  width: 112px; height: 112px; margin: 6px; color: #3b2a00;
  --ax-radius: 46%; --ax-corner-shape: scoop; --ax-corner-shoulder-radius: 6px;
  --ax-fill-color: #ffca28; --ax-border-width: 0px; --elevation-depth: 12;
  --reveal-color: rgb(255, 255, 255); --reveal-opacity: 0.5;
  --ax-tilt-mode: absolute; --ax-tilt-depth: 3px; --ax-tilt-perspective: 300px;
  transition: --ax-radius 0.4s cubic-bezier(0.3, 1.4, 0.5, 1), --elevation-depth 0.4s;
}
.star:hover { --ax-radius: 34%; --elevation-depth: 24; }
.star .tile-text { align-items: center; justify-content: center; padding: 0; gap: 2px; }
.star .days { font-size: 30px; font-weight: 700; line-height: 1; }`
  },
  {
    id: 'tag',
    title: 'Price tag',
    description: 'A triangle as wide as the left side, rounded at its tip. The feature goes out of the box, so the tag keeps a margin on the left for it.',
    columns: 2,
    rows: 2,
    html: `<ax-surface class="glass tag" layers="acrylic reveal">
  <div class="tile-text"><span class="small">Sale</span><span class="big">-30%</span></div>
</ax-surface>`,
    css: `${text}
${glass}
.tag {
  width: 102px; height: 124px; margin-left: 22px; color: #fff;
  --ax-radius: 10px;
  --ax-edge-left-kind: triangle; --ax-edge-left-span: 100%; --ax-edge-left-depth: 22px; --ax-edge-left-tip-radius: 6px;
}
.tag .tile-text { justify-content: center; position: relative; }
.tag .big { font-size: 24px; margin-top: 0; }
.tag .tile-text::before { content: ""; position: absolute; left: -6px; top: 50%; width: 10px; height: 10px; margin-top: -5px; border-radius: 50%; background: rgba(20, 25, 39, 0.85); }`
  },
  {
    id: 'chevron',
    title: 'Step',
    description: 'A step of a breadcrumb: a triangle as wide as the right side goes out of the shape, the same triangle goes into the left side, so the steps fit into each other. A triangle as wide as its side starts at the corners, so the corners are rounded with the shoulder radius, not the corner radius. Point at it and the arrow gets longer.',
    columns: 4,
    rows: 2,
    html: `<ax-surface class="glass chevron" layers="acrylic reveal">
  <div class="tile-text"><span class="small">Step 2 of 3</span><span class="big">Shipping</span></div>
</ax-surface>`,
    css: `${text}
${glass}
.chevron {
  width: 232px; height: 92px; margin-top: 16px; color: #fff;
  /* The triangles are as wide as their sides, so the shoulder radius rounds the corners: a corner
     radius too would round them twice. */
  --ax-radius: 0px;
  --ax-edge-left-kind: triangle; --ax-edge-left-span: 100%; --ax-edge-left-depth: -22px;
  --ax-edge-left-tip-radius: 4px; --ax-edge-left-shoulder-radius: 6px;
  --ax-edge-right-kind: triangle; --ax-edge-right-span: 100%; --ax-edge-right-depth: 22px;
  --ax-edge-right-tip-radius: 4px; --ax-edge-right-shoulder-radius: 6px;
  transition: --ax-edge-right-depth 0.3s cubic-bezier(0.3, 1.4, 0.5, 1);
}
.chevron:hover { --ax-edge-right-depth: 28px; }
.chevron .tile-text { padding-left: 34px; }
.chevron .big { font-size: 24px; }`
  },
  {
    id: 'coupon',
    title: 'Coupon',
    description: 'Every corner is a scoop, the shape of a coupon torn from a sheet. The shadow of the elevation layer follows the bites.',
    columns: 4,
    rows: 2,
    html: `<ax-surface class="coupon" layers="elevation fill reveal">
  <div class="coupon-body"><span class="off">20%</span><span class="rule"></span><span class="what">OFF<br><small>Code AXIOM</small></span></div>
</ax-surface>`,
    css: `.coupon {
  width: 260px; height: 112px; margin-top: 6px; color: #fff;
  --ax-radius: 16px; --ax-corner-shape: scoop;
  --ax-fill-color: #e3008c; --ax-border-width: 0px; --elevation-depth: 12;
  --reveal-color: rgb(255, 255, 255); --reveal-opacity: 0.35;
  --ax-tilt-mode: absolute; --ax-tilt-depth: 3px; --ax-tilt-perspective: 600px;
}
.coupon-body { display: flex; align-items: center; height: 100%; padding: 0 26px; gap: 18px; }
.coupon .off { font-size: 40px; font-weight: 300; }
.coupon .rule { align-self: stretch; margin: 18px 0; border-left: 2px dashed rgba(255, 255, 255, 0.55); }
.coupon .what { font-size: 22px; font-weight: 600; line-height: 1.1; }
.coupon small { font-size: 12px; font-weight: 400; opacity: 0.85; }`
  },
  {
    id: 'shield',
    title: 'Shield',
    description: 'A shield: a triangle as wide as the bottom side. The bottom corners have no radius, so the triangle starts at them and its shoulder radius rounds them, with a large tip radius at the point. Point at it and the point grows.',
    columns: 2,
    rows: 2,
    html: `<ax-surface class="shield" layers="elevation fill reveal">
  <svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
</ax-surface>`,
    css: `.shield {
  width: 88px; height: 62px; margin: 12px 18px 0;
  display: flex; align-items: center; justify-content: center;
  --ax-top-left-radius: 14px; --ax-top-right-radius: 14px; --ax-bottom-left-radius: 0px; --ax-bottom-right-radius: 0px;
  --ax-fill-color: #0f7b0f; --ax-border-width: 0px; --elevation-depth: 10;
  --ax-edge-bottom-kind: triangle; --ax-edge-bottom-span: 100%; --ax-edge-bottom-depth: 36px;
  --ax-edge-bottom-tip-radius: 14px; --ax-edge-bottom-shoulder-radius: 10px;
  --reveal-color: rgb(255, 255, 255); --reveal-opacity: 0.4;
  --ax-tilt-mode: absolute; --ax-tilt-depth: 2px; --ax-tilt-perspective: 300px;
  transition: --ax-edge-bottom-depth 0.35s cubic-bezier(0.3, 1.4, 0.5, 1);
}
.shield:hover { --ax-edge-bottom-depth: 44px; }
.shield svg { display: block; margin: 14px auto 0; }`
  },
  {
    id: 'battery',
    title: 'Battery',
    description: 'A rect feature on the right side is the terminal of the battery. The level inside is plain content, cut to the shape with the clip attribute. Point at it to charge it.',
    columns: 2,
    rows: 2,
    html: `<ax-surface class="battery" layers="fill" clip>
  <span class="level"></span><span class="charge">76%</span>
</ax-surface>`,
    css: `.battery {
  width: 98px; height: 54px; margin: 35px 0 0 8px; color: #fff;
  --ax-radius: 10px; --ax-fill-color: rgba(255, 255, 255, 0.18);
  --ax-border-width: 2px; --ax-border-color: rgba(255, 255, 255, 0.85);
  --ax-edge-right-kind: rect; --ax-edge-right-depth: 7px; --ax-edge-right-span: 34%;
  --ax-edge-right-tip-radius: 3px;
}
.battery .level { position: absolute; left: 0; top: 0; bottom: 0; width: 76%; background: #6ccb5f; transition: width 1.2s ease-in-out; }
.battery:hover .level { width: 100%; }
.battery .charge { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 600; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35); }`
  },
  {
    id: 'hexagon',
    title: 'Hexagon',
    description: 'A rectangle with a triangle as wide as the top side, and one as wide as the bottom side: a cell of a honeycomb. The rectangle has no corner radius. The tip radius rounds the top and bottom corners, and the shoulder radius, where a triangle starts at a corner, rounds the side corners in one arc.',
    columns: 2,
    rows: 2,
    html: `<ax-surface class="hexagon" layers="elevation fill reveal">
  <div class="hex-text"><span class="num">42</span><span>cells</span></div>
</ax-surface>`,
    css: `.hexagon {
  width: 104px; height: 60px; margin: 32px 10px 0; color: #3b2a00;
  /* No corner radius: the triangles start at the corners, and their shoulder radius rounds the
     four side corners of the hexagon in one arc each. */
  --ax-radius: 0px; --ax-fill-color: #ffb900; --ax-border-width: 0px; --elevation-depth: 10;
  --ax-edge-top-kind: triangle; --ax-edge-top-span: 100%; --ax-edge-top-depth: 30px; --ax-edge-top-tip-radius: 6px; --ax-edge-top-shoulder-radius: 6px;
  --ax-edge-bottom-kind: triangle; --ax-edge-bottom-span: 100%; --ax-edge-bottom-depth: 30px; --ax-edge-bottom-tip-radius: 6px; --ax-edge-bottom-shoulder-radius: 6px;
  --reveal-color: rgb(255, 255, 255); --reveal-opacity: 0.5;
  --ax-tilt-mode: absolute; --ax-tilt-depth: 3px; --ax-tilt-perspective: 300px;
}
.hex-text { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; font-size: 12px; line-height: 1.1; }
.hex-text .num { font-size: 26px; font-weight: 700; }`
  },
  {
    id: 'clover',
    title: 'Clover',
    description: 'A deep cusp on every side makes four round leaves. Point at it and the cusps get shallow: the clover turns into a cookie, in one transition of --ax-edge-depth.',
    columns: 2,
    rows: 2,
    html: `<ax-surface class="clover" layers="elevation fill reveal">
  <div class="clover-text">Lucky</div>
</ax-surface>`,
    css: `.clover {
  width: 112px; height: 112px; margin: 6px; color: #fff;
  --ax-radius: 30%; --ax-fill-color: #16a34a; --ax-border-width: 0px; --elevation-depth: 10;
  --ax-edge-kind: cusp; --ax-edge-span: 100%; --ax-edge-depth: -20px; --ax-edge-tip-radius: 4px;
  --reveal-color: rgb(255, 255, 255); --reveal-opacity: 0.4;
  --ax-tilt-mode: absolute; --ax-tilt-depth: 3px; --ax-tilt-perspective: 300px;
  transition: --ax-edge-depth 0.4s cubic-bezier(0.3, 1.4, 0.5, 1), --ax-edge-tip-radius 0.4s;
}
.clover:hover { --ax-edge-depth: -7px; --ax-edge-tip-radius: 22px; }
.clover-text { display: flex; height: 100%; align-items: center; justify-content: center; font-size: 16px; font-weight: 600; }`
  }
];

// The order of the page: twelve by eight cells, with no hole, in strips of four columns.
const ORDER = ['player', 'weather', 'bubble', 'ticket', 'note', 'press', 'badge', 'tag', 'chevron', 'inbox', 'folder', 'coupon', 'shield', 'battery', 'hexagon', 'clover'];

export const IDEAS: Idea[] = ORDER.map((id) => ALL.find((idea) => idea.id === id)!);
