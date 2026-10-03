/* The ground (grass, sand, water, roads, floors) never changes, so it is
   painted once into an offscreen canvas and blitted each frame. */
import { makeRng } from '../core/rng.js';

export const GROUND_SCALE = 0.75;
export const COLORS = {
  ocean: '#2C7DC0', oceanLight: '#3E95D6', sand: '#F3D98B', sandDark: '#E3C373',
  grass: '#79C46A', grassDark: '#68B45B', grassLight: '#8DD27C',
  water: '#46A9E4', waterEdge: '#7DD3FC', road: '#D8C8A6', roadEdge: '#BFAE8A',
  floor: '#E9D7B5', floorAlt: '#D9C49D', bridge: '#B8875A', bridgeDark: '#8D6440',
};

let cached = null;

export function getGround(map) {
  if (cached) return cached;
  const S = map.size, k = GROUND_SCALE;
  const cv = makeCanvas(Math.round(S * k), Math.round(S * k));
  const g = cv.getContext('2d');
  g.scale(k, k);
  const rng = makeRng(77);
  const B = map.border;

  // Ocean with a soft shoreline, then sand, then the grass island.
  g.fillStyle = COLORS.ocean; g.fillRect(0, 0, S, S);
  roundRect(g, B - 30, B - 30, S - 2 * B + 60, S - 2 * B + 60, 120); g.fillStyle = COLORS.oceanLight; g.fill();
  roundRect(g, B, B, S - 2 * B, S - 2 * B, 90); g.fillStyle = COLORS.sand; g.fill();
  roundRect(g, B + 55, B + 55, S - 2 * B - 110, S - 2 * B - 110, 70); g.fillStyle = COLORS.grass; g.fill();

  // Grass texture: big soft patches, then small tufts.
  g.save();
  roundRect(g, B + 55, B + 55, S - 2 * B - 110, S - 2 * B - 110, 70); g.clip();
  for (let i = 0; i < 260; i++) {
    const x = rng.range(B, S - B), y = rng.range(B, S - B), r = rng.range(40, 140);
    g.fillStyle = rng.chance(0.5) ? 'rgba(104,180,91,0.45)' : 'rgba(141,210,124,0.35)';
    g.beginPath(); g.ellipse(x, y, r, r * rng.range(0.5, 1), rng.range(0, 3), 0, Math.PI * 2); g.fill();
  }
  for (let i = 0; i < 2600; i++) {
    const x = rng.range(B, S - B), y = rng.range(B, S - B);
    g.strokeStyle = rng.chance(0.5) ? 'rgba(80,150,70,0.35)' : 'rgba(170,230,150,0.35)';
    g.lineWidth = 2.5; g.lineCap = 'round';
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + rng.range(-3, 3), y - rng.range(5, 9)); g.stroke();
  }
  g.restore();
  // Sand speckles
  for (let i = 0; i < 500; i++) {
    const x = rng.range(B, S - B), y = rng.range(B, S - B);
    if (x > B + 60 && x < S - B - 60 && y > B + 60 && y < S - B - 60) continue;
    g.fillStyle = COLORS.sandDark; g.beginPath(); g.arc(x, y, rng.range(1.5, 4), 0, Math.PI * 2); g.fill();
  }

  // Fields
  for (const f of map.fields) {
    g.fillStyle = f.color; roundRect(g, f.x, f.y, f.w, f.h, 10); g.fill();
    g.strokeStyle = 'rgba(0,0,0,0.12)'; g.lineWidth = 5;
    for (let yy = f.y + 14; yy < f.y + f.h; yy += 18) { g.beginPath(); g.moveTo(f.x + 8, yy); g.lineTo(f.x + f.w - 8, yy); g.stroke(); }
  }

  // Roads: edge then fill then a faint centre dash.
  const strokePoly = (pts, w, color, dash) => {
    g.beginPath(); g.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]);
    g.lineWidth = w; g.strokeStyle = color; g.lineCap = 'round'; g.lineJoin = 'round';
    g.setLineDash(dash || []); g.stroke(); g.setLineDash([]);
  };
  for (const r of map.roads) strokePoly(r.points, r.width + 10, COLORS.roadEdge);
  for (const r of map.roads) strokePoly(r.points, r.width, COLORS.road);
  for (const r of map.roads) strokePoly(r.points, 4, 'rgba(255,255,255,0.45)', [26, 30]);

  // Water: shallow edge, deep middle, a few ripples.
  for (const rv of map.rivers) strokePoly(rv.points, rv.width + 18, COLORS.sandDark);
  for (const l of map.lakes) { g.fillStyle = COLORS.sandDark; g.beginPath(); g.arc(l.x, l.y, l.r + 12, 0, Math.PI * 2); g.fill(); }
  for (const rv of map.rivers) strokePoly(rv.points, rv.width, COLORS.waterEdge);
  for (const l of map.lakes) { g.fillStyle = COLORS.waterEdge; g.beginPath(); g.arc(l.x, l.y, l.r, 0, Math.PI * 2); g.fill(); }
  for (const rv of map.rivers) strokePoly(rv.points, rv.width - 26, COLORS.water);
  for (const l of map.lakes) { g.fillStyle = COLORS.water; g.beginPath(); g.arc(l.x, l.y, l.r - 14, 0, Math.PI * 2); g.fill(); }
  for (let i = 0; i < 160; i++) {
    const x = rng.range(0, S), y = rng.range(0, S);
    if (!map.isWater(x, y, -20)) continue;
    g.strokeStyle = 'rgba(255,255,255,0.35)'; g.lineWidth = 3;
    g.beginPath(); g.arc(x, y, rng.range(8, 16), Math.PI * 1.1, Math.PI * 1.9); g.stroke();
  }

  // Bridges: planks across the water.
  for (const b of map.bridges) {
    g.fillStyle = COLORS.bridgeDark; roundRect(g, b.x0 - 4, b.y0 - 4, b.w + 8, b.h + 8, 8); g.fill();
    g.fillStyle = COLORS.bridge; roundRect(g, b.x0, b.y0, b.w, b.h, 6); g.fill();
    g.strokeStyle = 'rgba(0,0,0,0.18)'; g.lineWidth = 2;
    if (b.vertical) for (let y = b.y0 + 10; y < b.y1; y += 14) { g.beginPath(); g.moveTo(b.x0 + 4, y); g.lineTo(b.x1 - 4, y); g.stroke(); }
    else for (let x = b.x0 + 10; x < b.x1; x += 14) { g.beginPath(); g.moveTo(x, b.y0 + 4); g.lineTo(x, b.y1 - 4); g.stroke(); }
  }

  // Building floors (checker tiles) — visible when the roof fades.
  for (const b of map.buildings) {
    g.fillStyle = COLORS.floor; g.fillRect(b.x, b.y, b.w, b.h);
    g.fillStyle = COLORS.floorAlt;
    for (let y = b.y; y < b.y + b.h; y += 24) for (let x = b.x + (((y - b.y) / 24) % 2) * 24; x < b.x + b.w; x += 48) g.fillRect(x, y, 24, Math.min(24, b.y + b.h - y));
    // door mats
    for (const d of b.doorList) {
      const [dx, dy] = doorPos(b, d);
      g.fillStyle = '#B45309'; g.fillRect(dx - 22, dy - 10, 44, 20);
    }
  }

  // Ground decor
  const fl = ['#FFFFFF', '#FFD43B', '#F472B6', '#A78BFA'];
  for (const d of map.decor) {
    if (d.kind === 'flower') {
      g.fillStyle = fl[d.c]; for (let i = 0; i < 5; i++) { const a = i * 1.26; g.beginPath(); g.arc(d.x + Math.cos(a) * 4, d.y + Math.sin(a) * 4, 3, 0, Math.PI * 2); g.fill(); }
      g.fillStyle = '#FFB703'; g.beginPath(); g.arc(d.x, d.y, 2.5, 0, Math.PI * 2); g.fill();
    } else {
      g.fillStyle = 'rgba(100,116,139,0.55)'; g.beginPath(); g.ellipse(d.x, d.y, 6, 4, 0, 0, Math.PI * 2); g.fill();
    }
  }
  // Piers are flat: paint them into the ground.
  for (const o of map.obstacles) if (o.kind === 'pier') {
    g.fillStyle = '#8D6E4C'; g.fillRect(o.x, o.y, o.w, o.h);
    g.strokeStyle = 'rgba(0,0,0,0.2)'; g.lineWidth = 2;
    for (let x = o.x + 8; x < o.x + o.w; x += 12) { g.beginPath(); g.moveTo(x, o.y); g.lineTo(x, o.y + o.h); g.stroke(); }
  }

  cached = cv;
  return cv;
}

export function doorPos(b, d) {
  if (d.side === 'n') return [b.x + b.w * d.at, b.y];
  if (d.side === 's') return [b.x + b.w * d.at, b.y + b.h];
  if (d.side === 'w') return [b.x, b.y + b.h * d.at];
  return [b.x + b.w, b.y + b.h * d.at];
}

export function makeCanvas(w, h) {
  if (typeof OffscreenCanvas !== 'undefined' && typeof document === 'undefined') return new OffscreenCanvas(w, h);
  const c = document.createElement('canvas'); c.width = w; c.height = h; return c;
}

export function roundRect(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
}
