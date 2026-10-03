/* The island. One handcrafted layout — rivers, roads, bridges, ten points of
   interest and two dozen minor loot spots — plus the scatter (trees, rocks,
   bushes) laid down from a fixed seed so the map is identical every match.

   This module is pure data + geometry. Drawing lives in render/. */

import { CONFIG } from '../core/config.js';
import { SpatialGrid } from '../core/SpatialGrid.js';
import { makeRng } from '../core/rng.js';
import { clamp, pointSegDist2, dist2 } from '../core/math.js';

const S = CONFIG.map.size;
const WALL = 12;
const DOOR = 74;

/* ---------- Handcrafted layout ---------------------------------------- */

const RIVERS = [
  { width: 110, points: [[1250, -80], [1190, 300], [1260, 620], [1150, 900], [1010, 1110], [880, 1250]] },
  { width: 104, points: [[880, 1250], [760, 1390], [640, 1600], [610, 1900], [690, 2200], [640, 2500], [580, 2900]] },
];
const LAKES = [{ x: 880, y: 1250, r: 185 }];

const ROADS = [
  { width: 56, points: [[360, 480], [800, 470], [1227, 470], [1700, 520], [2250, 560]] },
  { width: 56, points: [[1700, 520], [1780, 1000], [1600, 1350], [1500, 1600], [1450, 2050], [1200, 2450]] },
  { width: 56, points: [[330, 1820], [621, 1790], [1000, 1800], [1450, 2050], [1900, 2100], [2350, 2350]] },
  { width: 50, points: [[1500, 1600], [1900, 1580], [2200, 1600]] },
  { width: 46, points: [[450, 520], [520, 900], [560, 1060]] },
  { width: 46, points: [[560, 1060], [420, 1450], [330, 1820], [360, 2050]] },
  { width: 50, points: [[560, 1060], [900, 960], [1110, 960], [1300, 1000], [1780, 1000], [2000, 1080]] },
];

/* Bridges are where roads cross water: the choke points. */
const BRIDGES = [
  { x: 1227, y: 470, w: 190, h: 66 },
  { x: 1110, y: 962, w: 200, h: 62 },
  { x: 621, y: 1790, w: 66, h: 190, vertical: true },
];

/* tier: 1 normal, 2 good, 3 high value (legendary-weighted) */
const POIS = [
  { id: 'pinecrest', name: 'PINECREST', x: 470, y: 560, r: 270, tier: 1 },
  { id: 'mill',      name: 'MILL CROSSING', x: 1390, y: 360, r: 210, tier: 2 },
  { id: 'farm',      name: 'SUNPEAK FARM', x: 2250, y: 600, r: 300, tier: 2 },
  { id: 'radio',     name: 'RADIO HILL', x: 2080, y: 1120, r: 220, tier: 2 },
  { id: 'town',      name: 'BRIGHTMOOR', x: 1480, y: 1680, r: 340, tier: 3 },
  { id: 'fort',      name: 'OLD FORT', x: 2380, y: 1650, r: 260, tier: 3 },
  { id: 'lodge',     name: 'LAKESIDE LODGE', x: 470, y: 1150, r: 200, tier: 1 },
  { id: 'quarry',    name: 'STONEBITE QUARRY', x: 360, y: 2200, r: 240, tier: 2 },
  { id: 'docks',     name: 'RUSTY DOCKS', x: 1150, y: 2470, r: 270, tier: 2 },
  { id: 'lighthouse',name: 'LIGHTHOUSE POINT', x: 2400, y: 2420, r: 230, tier: 1 },
];

/* x,y is the top-left corner. doors: 's', 'n:0.3', 'e,w' ... */
const BUILDINGS = [
  // Pinecrest cabins
  { x: 330, y: 400, w: 150, h: 120, doors: 's', poi: 'pinecrest', roof: '#8B5A3C' },
  { x: 530, y: 380, w: 140, h: 110, doors: 's', poi: 'pinecrest', roof: '#7A4E35' },
  { x: 340, y: 600, w: 160, h: 120, doors: 'n,e', poi: 'pinecrest', roof: '#8B5A3C' },
  { x: 560, y: 610, w: 130, h: 110, doors: 'w', poi: 'pinecrest', roof: '#6E4630' },
  // Mill
  { x: 1340, y: 260, w: 210, h: 160, doors: 's:0.3,w', poi: 'mill', roof: '#B5523B', divider: 'v' },
  { x: 1420, y: 520, w: 110, h: 90, doors: 'n', poi: 'mill', roof: '#9C4632' },
  // Farm
  { x: 2060, y: 390, w: 280, h: 190, doors: 's:0.25,s:0.75,e', poi: 'farm', roof: '#C0392B', divider: 'v' },
  { x: 2330, y: 660, w: 190, h: 140, doors: 'w,n', poi: 'farm', roof: '#D9822B' },
  // Radio hill bunker
  { x: 1990, y: 1190, w: 170, h: 120, doors: 'n,w', poi: 'radio', roof: '#5B6B7A' },
  // Brightmoor town
  { x: 1220, y: 1420, w: 190, h: 150, doors: 's,e', poi: 'town', roof: '#3B82F6', divider: 'h' },
  { x: 1640, y: 1420, w: 180, h: 140, doors: 's,w', poi: 'town', roof: '#E05D5D' },
  { x: 1050, y: 1600, w: 150, h: 130, doors: 'e', poi: 'town', roof: '#2DD4BF' },
  { x: 1220, y: 1730, w: 200, h: 150, doors: 'n,e', poi: 'town', roof: '#F59E0B', divider: 'v' },
  { x: 1630, y: 1720, w: 190, h: 160, doors: 'n,w', poi: 'town', roof: '#8B5CF6', divider: 'h' },
  { x: 1200, y: 2080, w: 140, h: 100, doors: 'n,e', poi: 'town', roof: '#64748B' },
  { x: 1630, y: 1910, w: 170, h: 100, doors: 'n,w', poi: 'town', roof: '#EC4899' },
  // Fort keep (walls added separately)
  { x: 2310, y: 1590, w: 160, h: 130, doors: 'w,s', poi: 'fort', roof: '#6B7280', divider: 'v' },
  // Lodge + boathouse
  { x: 360, y: 1070, w: 230, h: 160, doors: 's:0.3,e', poi: 'lodge', roof: '#7C5A3A', divider: 'v' },
  { x: 420, y: 1290, w: 120, h: 90, doors: 'n', poi: 'lodge', roof: '#6B4A2E' },
  // Quarry office
  { x: 295, y: 2150, w: 130, h: 100, doors: 's,e', poi: 'quarry', roof: '#A16207' },
  // Docks warehouse + office
  { x: 1010, y: 2380, w: 300, h: 160, doors: 'n:0.25,n:0.75,e', poi: 'docks', roof: '#475569', divider: 'v' },
  { x: 1700, y: 2440, w: 110, h: 90, doors: 'w,n', poi: 'docks', roof: '#B45309' },
  // Lighthouse keeper
  { x: 2280, y: 2330, w: 150, h: 110, doors: 'n,w', poi: 'lighthouse', roof: '#DC2626' },
];

/* Minor loot areas: a shed, a crate pile, a camp or a wreck. */
const MINOR = [
  [820, 250, 'shed'], [1650, 230, 'crates'], [2000, 260, 'shed'], [2580, 260, 'camp'],
  [2600, 1120, 'shed'], [2420, 1260, 'crates'], [1500, 850, 'wreck'], [1260, 1240, 'shed'],
  [1050, 1440, 'crates'], [950, 1960, 'shed'], [860, 2260, 'camp'], [880, 2560, 'wreck'],
  [1850, 2300, 'shed'], [2020, 2560, 'crates'], [2560, 2040, 'shed'], [1960, 1880, 'crates'],
  [1900, 1400, 'wreck'], [260, 1500, 'shed'], [230, 820, 'camp'], [780, 700, 'crates'],
  [1850, 820, 'shed'], [2420, 2150, 'crates'], [2180, 2070, 'shed'], [430, 2560, 'camp'],
  [1020, 640, 'shed'],
];

/* ---------- Map class ---------------------------------------------------- */

export class GameMap {
  constructor() {
    this.size = S;
    this.border = CONFIG.map.border;
    this.rivers = RIVERS;
    this.lakes = LAKES;
    this.roads = ROADS;
    this.bridges = BRIDGES.map(b => ({ ...b, x0: b.x - b.w / 2, y0: b.y - b.h / 2, x1: b.x + b.w / 2, y1: b.y + b.h / 2 }));
    this.pois = POIS;
    this.buildings = [];
    this.obstacles = [];
    this.bushes = [];
    this.fields = [];
    this.decor = [];
    this.lootSpots = [];
    this.grid = new SpatialGrid(S, 160);
    this.bushGrid = new SpatialGrid(S, 160);
    this.buildingGrid = new SpatialGrid(S, 200);
    this._build();
  }

  /* ---------- construction ---------- */

  _rect(x, y, w, h, kind, o = {}) {
    const ob = {
      type: 'rect', x, y, w, h, kind,
      blocksMove: o.blocksMove ?? true,
      blocksShots: o.blocksShots ?? true,
      height: o.height ?? 40,
      color: o.color, building: o.building ?? null,
    };
    this.obstacles.push(ob);
    this.grid.insert(ob, x, y, x + w, y + h);
    return ob;
  }

  _circle(x, y, r, kind, o = {}) {
    const ob = {
      type: 'circle', x, y, r, kind,
      blocksMove: o.blocksMove ?? true,
      blocksShots: o.blocksShots ?? true,
      height: o.height ?? 30,
      color: o.color, canopy: o.canopy ?? 0,
    };
    this.obstacles.push(ob);
    this.grid.insert(ob, x - r, y - r, x + r, y + r);
    return ob;
  }

  _building(def, idx) {
    const b = { ...def, id: idx, doorList: [], walls: [] };
    const doors = def.doors.split(',').map(s => {
      const [side, at] = s.split(':');
      return { side, at: at ? parseFloat(at) : 0.5 };
    });
    b.doorList = doors;
    const { x, y, w, h } = b;
    const H = 66;
    const side = (sd, x0, y0, len, horiz) => {
      const gaps = doors.filter(d => d.side === sd).map(d => {
        const c = d.at * len;
        return [c - DOOR / 2, c + DOOR / 2];
      }).sort((a, c) => a[0] - c[0]);
      let cur = 0;
      const pieces = [];
      for (const [g0, g1] of gaps) { if (g0 > cur) pieces.push([cur, g0]); cur = g1; }
      if (cur < len) pieces.push([cur, len]);
      for (const [a, c] of pieces) {
        const wall = horiz
          ? this._rect(x0 + a, y0, c - a, WALL, 'wall', { height: H, building: b })
          : this._rect(x0, y0 + a, WALL, c - a, 'wall', { height: H, building: b });
        b.walls.push(wall);
      }
    };
    side('n', x, y, w, true);
    side('s', x, y + h - WALL, w, true);
    side('w', x, y, h, false);
    side('e', x + w - WALL, y, h, false);
    // An interior divider with a gap in the middle, so big buildings have rooms.
    if (def.divider === 'v') {
      const mx = x + w / 2 - WALL / 2;
      const seg = (h - 84) / 2;
      b.walls.push(this._rect(mx, y, WALL, seg, 'wall', { height: H, building: b }));
      b.walls.push(this._rect(mx, y + h - seg, WALL, seg, 'wall', { height: H, building: b }));
    } else if (def.divider === 'h') {
      const my = y + h / 2 - WALL / 2;
      const seg = (w - 84) / 2;
      b.walls.push(this._rect(x, my, seg, WALL, 'wall', { height: H, building: b }));
      b.walls.push(this._rect(x + w - seg, my, seg, WALL, 'wall', { height: H, building: b }));
    }
    this.buildings.push(b);
    this.buildingGrid.insert(b, x, y, x + w, y + h);
    return b;
  }

  _build() {
    const rng = makeRng(20240611); // fixed: the map is handcrafted, not rolled per match

    BUILDINGS.forEach((d, i) => this._building(d, i));

    const poi = id => this.pois.find(p => p.id === id);

    /* Old Fort perimeter: thick walls, gates west and south. */
    {
      const x0 = 2170, y0 = 1470, x1 = 2600, y1 = 1830, T = 22, H = 58;
      const o = { height: H, color: '#8C8F99' };
      this._rect(x0, y0, x1 - x0, T, 'fortwall', o);
      this._rect(x0, y1 - T, (x1 - x0) / 2 - 50, T, 'fortwall', o);
      this._rect(x0 + (x1 - x0) / 2 + 50, y1 - T, (x1 - x0) / 2 - 50, T, 'fortwall', o);
      this._rect(x0, y0, T, (y1 - y0) / 2 - 50, 'fortwall', o);
      this._rect(x0, y0 + (y1 - y0) / 2 + 50, T, (y1 - y0) / 2 - 50, 'fortwall', o);
      this._rect(x1 - T, y0, T, y1 - y0, 'fortwall', o);
      for (const [cx, cy] of [[x0, y0], [x1, y0], [x0, y1], [x1, y1]]) this._circle(cx, cy, 30, 'tower', { height: 80, color: '#7C808C' });
      this._rect(2220, 1520, 44, 44, 'crate'); this._rect(2520, 1760, 44, 44, 'crate');
      this._rect(2500, 1520, 56, 120, 'container', { color: '#4B5563', height: 50 });
      this.lootSpots.push({ x: 2250, y: 1760, tier: 3, poi: 'fort' }, { x: 2540, y: 1700, tier: 3, poi: 'fort' }, { x: 2290, y: 1530, tier: 3, poi: 'fort' });
    }

    /* Radio tower: four legs and sandbags around the hill. */
    {
      const cx = 2140, cy = 1040;
      for (const [dx, dy] of [[-40, -40], [40, -40], [-40, 40], [40, 40]]) this._circle(cx + dx, cy + dy, 9, 'pole', { height: 120, color: '#9CA3AF' });
      this._rect(1950, 1090, 90, 18, 'sandbag', { height: 22, color: '#B9A37A' });
      this._rect(2220, 1120, 18, 90, 'sandbag', { height: 22, color: '#B9A37A' });
      this._rect(2050, 960, 80, 18, 'sandbag', { height: 22, color: '#B9A37A' });
      this._rect(2190, 980, 44, 44, 'crate');
      this.lootSpots.push({ x: cx, y: cy, tier: 3, poi: 'radio' }, { x: 2000, y: 1020, tier: 2, poi: 'radio' });
    }

    /* Farm: fences, silo, hay bales, crop fields. */
    {
      this._circle(2420, 470, 46, 'silo', { height: 110, color: '#CBD5E1' });
      this.fields.push({ x: 1980, y: 680, w: 300, h: 170, color: '#C9B458' }, { x: 2390, y: 890, w: 220, h: 140, color: '#9BBF4F' });
      const fo = { blocksShots: false, height: 18, color: '#A47148' };
      this._rect(1960, 662, 140, 8, 'fence', fo);
      this._rect(2190, 662, 110, 8, 'fence', fo);
      this._rect(1960, 662, 8, 130, 'fence', fo);
      this._rect(2380, 876, 120, 8, 'fence', fo);
      this._rect(2604, 876, 8, 160, 'fence', fo);
      for (const [hx, hy] of [[2080, 760], [2200, 800], [2470, 960], [2540, 1000]]) this._circle(hx, hy, 20, 'hay', { height: 20, color: '#E3C565' });
      this.lootSpots.push({ x: 2140, y: 730, tier: 1, poi: 'farm' }, { x: 2490, y: 560, tier: 2, poi: 'farm' });
    }

    /* Docks: rows of containers. */
    {
      const cols = ['#C2410C', '#1D4ED8', '#15803D', '#B91C1C', '#7C3AED', '#0E7490'];
      let k = 0;
      for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) {
        this._rect(1350 + i * 120, 2190 + j * 210, 56, 130, 'container', { color: cols[k++ % cols.length], height: 54 });
      }
      for (let i = 0; i < 2; i++) this._rect(1000 + i * 160, 2265, 130, 56, 'container', { color: cols[(k++) % cols.length], height: 54 });
      this._rect(1040, 2600, 260, 20, 'pier', { blocksMove: false, blocksShots: false, height: 4, color: '#8D6E4C' });
      this.lootSpots.push({ x: 1438, y: 2290, tier: 2, poi: 'docks' }, { x: 1558, y: 2360, tier: 2, poi: 'docks' }, { x: 960, y: 2330, tier: 2, poi: 'docks' });
    }

    /* Quarry: a ring of boulders and some machinery. */
    {
      const q = poi('quarry');
      for (let i = 0; i < 9; i++) {
        const a = (i / 9) * Math.PI * 2 + rng.range(-0.12, 0.12);
        const rr = rng.range(150, 215);
        this._circle(q.x + Math.cos(a) * rr, q.y + Math.sin(a) * rr, rng.range(28, 46), 'rock', { height: 34 });
      }
      this._rect(560, 2010, 56, 130, 'container', { color: '#CA8A04', height: 54 });
      this._rect(330, 2275, 44, 44, 'crate');
      this.lootSpots.push({ x: 450, y: 2290, tier: 2, poi: 'quarry' }, { x: 270, y: 2290, tier: 2, poi: 'quarry' });
    }

    /* Lighthouse: tall tower and rocky shore. */
    {
      this._circle(2520, 2510, 48, 'lighthouse', { height: 160, color: '#F8FAFC' });
      for (const [rx, ry, rr] of [[2600, 2350, 34], [2450, 2600, 30], [2620, 2620, 40], [2200, 2520, 28]]) this._circle(rx, ry, rr, 'rock', { height: 30 });
      this.lootSpots.push({ x: 2450, y: 2490, tier: 2, poi: 'lighthouse' });
    }

    /* Town plaza fountain + benches + cars. */
    {
      this._circle(1500, 1650, 40, 'fountain', { height: 18, color: '#7DD3FC' });
      this._rect(1080, 1800, 64, 34, 'car', { color: '#EF4444', height: 26 });
      this._rect(1880, 1500, 34, 64, 'car', { color: '#3B82F6', height: 26 });
      this._rect(1420, 1520, 44, 44, 'crate');
      this.lootSpots.push({ x: 1560, y: 1590, tier: 3, poi: 'town' }, { x: 1440, y: 1760, tier: 2, poi: 'town' });
    }

    /* Pinecrest campfire, lodge dock, mill crates. */
    this._circle(470, 560, 18, 'campfire', { blocksShots: false, height: 6 });
    this._rect(640, 1220, 120, 24, 'pier', { blocksMove: false, blocksShots: false, height: 4, color: '#8D6E4C' });
    this._rect(1300, 450, 44, 44, 'crate'); this._rect(1600, 330, 44, 44, 'crate');
    this.lootSpots.push({ x: 520, y: 545, tier: 1, poi: 'pinecrest' }, { x: 660, y: 1180, tier: 1, poi: 'lodge' }, { x: 1580, y: 420, tier: 2, poi: 'mill' });

    /* Minor areas. */
    MINOR.forEach(([x, y, type], i) => {
      if (type === 'shed') {
        const b = this._building({ x: x - 50, y: y - 40, w: 100, h: 80, doors: ['s', 'n', 'e', 'w'][i % 4], poi: null, roof: ['#78716C', '#6B7280', '#92400E'][i % 3] }, this.buildings.length);
        b.minor = true;
      } else if (type === 'crates') {
        this._rect(x - 50, y - 30, 44, 44, 'crate'); this._rect(x + 10, y - 10, 44, 44, 'crate');
        this._rect(x - 30, y + 30, 44, 44, 'crate');
        this.lootSpots.push({ x: x + 40, y: y + 62, tier: 1, poi: null });
      } else if (type === 'camp') {
        this._circle(x, y, 14, 'campfire', { blocksShots: false, height: 6 });
        this._rect(x - 70, y - 60, 60, 46, 'tent', { color: '#F97316', height: 34, blocksShots: false });
        this._rect(x + 20, y + 20, 60, 46, 'tent', { color: '#22C55E', height: 34, blocksShots: false });
        this.lootSpots.push({ x: x + 40, y: y - 40, tier: 1, poi: null });
      } else if (type === 'wreck') {
        this._rect(x - 40, y - 20, 80, 40, 'car', { color: '#57534E', height: 26 });
        this._circle(x + 60, y + 30, 16, 'barrel', { height: 26, color: '#DC2626' });
        this.lootSpots.push({ x: x, y: y + 45, tier: 1, poi: null });
      }
      this.lootSpots.push({ x: x + (i % 2 ? 90 : -90), y: y + (i % 3 ? -80 : 90), tier: 1, poi: null });
    });

    /* Hand-placed spots can graze a prop; nudge each to the nearest clear ground. */
    for (const sp of this.lootSpots) {
      if (!this.circleBlocked(sp.x, sp.y, 26)) continue;
      outer: for (let r = 10; r <= 90; r += 10) for (let a = 0; a < 16; a++) {
        const nx = sp.x + Math.cos(a / 16 * Math.PI * 2) * r, ny = sp.y + Math.sin(a / 16 * Math.PI * 2) * r;
        if (!this.circleBlocked(nx, ny, 26) && !this.isWater(nx, ny)) { sp.x = nx; sp.y = ny; break outer; }
      }
    }

    /* Loot inside every building. */
    for (const b of this.buildings) {
      const tier = b.poi ? this.pois.find(p => p.id === b.poi).tier : 1;
      const n = clamp(Math.floor((b.w * b.h) / 11000) + 1, 1, 4);
      for (let i = 0; i < n; i++) {
        const m = 34;
        let px, py, tries = 0;
        do {
          px = rng.range(b.x + m, b.x + b.w - m);
          py = rng.range(b.y + m, b.y + b.h - m);
        } while (this.circleBlocked(px, py, 20) && ++tries < 20);
        this.lootSpots.push({ x: px, y: py, tier, poi: b.poi, indoor: true });
      }
    }

    /* Extra outdoor loot around each POI. */
    for (const p of this.pois) {
      for (let i = 0; i < 3 + p.tier; i++) {
        const pt = this._freePoint(rng, p.x, p.y, p.r * 0.9, 22);
        if (pt) this.lootSpots.push({ x: pt[0], y: pt[1], tier: p.tier, poi: p.id });
      }
    }

    /* Scatter: forests, rocks, bushes. Clustered so there are open fields
       AND cover, never a uniform carpet. */
    const forests = [
      [470, 560, 380, 50], [250, 1000, 200, 18], [900, 700, 260, 20], [1700, 760, 200, 14],
      [2600, 1300, 200, 16], [1950, 2350, 260, 20], [700, 2050, 220, 16], [2580, 300, 180, 12],
      [1050, 1350, 160, 10], [1800, 230, 200, 12], [250, 2500, 180, 12], [1350, 2700, 260, 8],
    ];
    for (const [fx, fy, fr, n] of forests) {
      for (let i = 0; i < n; i++) {
        const pt = this._freePoint(rng, fx, fy, fr, 40, true);
        if (pt) this._circle(pt[0], pt[1], 13, 'tree', { height: 90, canopy: rng.range(40, 56), blocksShots: true });
      }
    }
    for (let i = 0; i < 70; i++) {
      const pt = this._freePoint(rng, S / 2, S / 2, S * 0.7, 46, true);
      if (pt) this._circle(pt[0], pt[1], 13, 'tree', { height: 90, canopy: rng.range(40, 54) });
    }
    for (let i = 0; i < 55; i++) {
      const pt = this._freePoint(rng, S / 2, S / 2, S * 0.7, 40, true);
      if (pt) this._circle(pt[0], pt[1], rng.range(20, 36), 'rock', { height: 26 });
    }
    for (let i = 0; i < 190; i++) {
      const clusterPoi = i % 3 === 0 ? rng.pick(this.pois) : null;
      const pt = clusterPoi
        ? this._freePoint(rng, clusterPoi.x, clusterPoi.y, clusterPoi.r * 1.3, 40, true, true)
        : this._freePoint(rng, S / 2, S / 2, S * 0.7, 40, true, true);
      if (!pt) continue;
      const bsh = { x: pt[0], y: pt[1], r: rng.range(30, 46), tint: rng.range(0, 1) };
      this.bushes.push(bsh);
      this.bushGrid.insert(bsh, bsh.x - bsh.r, bsh.y - bsh.r, bsh.x + bsh.r, bsh.y + bsh.r);
    }

    /* Flowers and stones: ground decor only, never collide. */
    for (let i = 0; i < 260; i++) {
      const x = rng.range(this.border + 80, S - this.border - 80), y = rng.range(this.border + 80, S - this.border - 80);
      if (this.isWater(x, y) || this.onRoad(x, y)) continue;
      this.decor.push({ x, y, kind: rng.chance(0.6) ? 'flower' : 'pebble', c: rng.int(0, 3) });
    }
  }

  /* A random spot near (cx,cy) clear of walls, water, roads and buildings. */
  _freePoint(rng, cx, cy, r, clearance, avoidPois = false, allowNearPoi = false) {
    for (let t = 0; t < 30; t++) {
      const a = rng.range(0, Math.PI * 2), d = Math.sqrt(rng.next()) * r;
      const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d;
      const m = this.border + 70;
      if (x < m || y < m || x > S - m || y > S - m) continue;
      if (this.isWater(x, y, 30) || this.onRoad(x, y, 18)) continue;
      if (this.circleBlocked(x, y, clearance)) continue;
      if (this.buildingNear(x, y, clearance + 45)) continue;
      if (avoidPois && !allowNearPoi && this.pois.some(p => dist2(x, y, p.x, p.y) < (p.r * 0.55) ** 2)) continue;
      if (this.lootSpots.some(s => dist2(x, y, s.x, s.y) < (clearance + 34) ** 2)) continue;
      return [x, y];
    }
    return null;
  }

  /* ---------- queries ---------- */

  isWater(x, y, pad = 0) {
    for (const b of this.bridges) if (x > b.x0 && x < b.x1 && y > b.y0 && y < b.y1) return false;
    for (const l of this.lakes) if (dist2(x, y, l.x, l.y) < (l.r + pad) ** 2) return true;
    for (const rv of this.rivers) {
      const hw = rv.width / 2 + pad, p = rv.points;
      for (let i = 0; i < p.length - 1; i++) {
        if (pointSegDist2(x, y, p[i][0], p[i][1], p[i + 1][0], p[i + 1][1]) < hw * hw) return true;
      }
    }
    return false;
  }

  onBridge(x, y) {
    for (const b of this.bridges) if (x > b.x0 && x < b.x1 && y > b.y0 && y < b.y1) return true;
    return false;
  }

  onRoad(x, y, pad = 0) {
    for (const rd of this.roads) {
      const hw = rd.width / 2 + pad, p = rd.points;
      for (let i = 0; i < p.length - 1; i++) {
        if (pointSegDist2(x, y, p[i][0], p[i][1], p[i + 1][0], p[i + 1][1]) < hw * hw) return true;
      }
    }
    return false;
  }

  circleBlocked(x, y, r) {
    let hit = false;
    this.grid.query(x - r, y - r, x + r, y + r, ob => {
      if (!ob.blocksMove) return;
      if (circleHitsObstacle(x, y, r, ob)) { hit = true; return false; }
    });
    return hit;
  }

  buildingNear(x, y, pad) {
    let hit = false;
    this.buildingGrid.query(x - pad, y - pad, x + pad, y + pad, b => {
      if (x > b.x - pad && x < b.x + b.w + pad && y > b.y - pad && y < b.y + b.h + pad) { hit = true; return false; }
    });
    return hit;
  }

  buildingAt(x, y) {
    let found = null;
    this.buildingGrid.query(x, y, x, y, b => {
      if (x > b.x && x < b.x + b.w && y > b.y && y < b.y + b.h) { found = b; return false; }
    });
    return found;
  }

  inBush(x, y) {
    let hit = null;
    this.bushGrid.query(x, y, x, y, b => {
      if (dist2(x, y, b.x, b.y) < (b.r * 0.85) ** 2) { hit = b; return false; }
    });
    return hit;
  }

  /* Push a moving circle out of everything solid. Returns true on contact. */
  resolveCircle(ent) {
    const r = ent.radius;
    let touched = false;
    this.grid.query(ent.x - r, ent.y - r, ent.x + r, ent.y + r, ob => {
      if (!ob.blocksMove) return;
      if (ob.type === 'circle') {
        const dx = ent.x - ob.x, dy = ent.y - ob.y;
        const min = r + ob.r, d2 = dx * dx + dy * dy;
        if (d2 < min * min) {
          const d = Math.sqrt(d2) || 0.0001;
          ent.x = ob.x + (dx / d) * min; ent.y = ob.y + (dy / d) * min;
          touched = true;
        }
      } else {
        const cx = clamp(ent.x, ob.x, ob.x + ob.w), cy = clamp(ent.y, ob.y, ob.y + ob.h);
        const dx = ent.x - cx, dy = ent.y - cy, d2 = dx * dx + dy * dy;
        if (d2 < r * r) {
          if (d2 > 0.0001) {
            const d = Math.sqrt(d2);
            ent.x = cx + (dx / d) * r; ent.y = cy + (dy / d) * r;
          } else {
            // Centre is inside the box: leave by the shortest side.
            const l = ent.x - ob.x, rr = ob.x + ob.w - ent.x, t = ent.y - ob.y, b = ob.y + ob.h - ent.y;
            const m = Math.min(l, rr, t, b);
            if (m === l) ent.x = ob.x - r; else if (m === rr) ent.x = ob.x + ob.w + r;
            else if (m === t) ent.y = ob.y - r; else ent.y = ob.y + ob.h + r;
          }
          touched = true;
        }
      }
    });
    const lo = this.border + r, hi = S - this.border - r;
    if (ent.x < lo) { ent.x = lo; touched = true; } else if (ent.x > hi) { ent.x = hi; touched = true; }
    if (ent.y < lo) { ent.y = lo; touched = true; } else if (ent.y > hi) { ent.y = hi; touched = true; }
    return touched;
  }

  /* First shot-blocking obstacle along a segment: returns t in [0,1] or 1. */
  raycast(x1, y1, x2, y2, forShots = true) {
    let best = 1, bestOb = null;
    const minX = Math.min(x1, x2), minY = Math.min(y1, y2), maxX = Math.max(x1, x2), maxY = Math.max(y1, y2);
    const dx = x2 - x1, dy = y2 - y1;
    this.grid.query(minX, minY, maxX, maxY, ob => {
      if (forShots ? !ob.blocksShots : !ob.blocksMove) return;
      const t = ob.type === 'circle'
        ? segCircle(x1, y1, dx, dy, ob.x, ob.y, ob.r)
        : segRect(x1, y1, dx, dy, ob.x, ob.y, ob.x + ob.w, ob.y + ob.h);
      if (t !== null && t < best) { best = t; bestOb = ob; }
    });
    this._lastHit = bestOb;
    return best;
  }

  hasLineOfSight(x1, y1, x2, y2) { return this.raycast(x1, y1, x2, y2, true) >= 1; }

  clampToLand(x, y) {
    const m = this.border + 40;
    return [clamp(x, m, S - m), clamp(y, m, S - m)];
  }
}

export function circleHitsObstacle(x, y, r, ob) {
  if (ob.type === 'circle') return dist2(x, y, ob.x, ob.y) < (r + ob.r) ** 2;
  const cx = clamp(x, ob.x, ob.x + ob.w), cy = clamp(y, ob.y, ob.y + ob.h);
  return dist2(x, y, cx, cy) < r * r;
}

/* Segment (origin + t*d) vs circle; returns smallest t in [0,1] or null. */
export function segCircle(x, y, dx, dy, cx, cy, r) {
  const fx = x - cx, fy = y - cy;
  const a = dx * dx + dy * dy;
  if (a === 0) return null;
  const b = 2 * (fx * dx + fy * dy);
  const c = fx * fx + fy * fy - r * r;
  if (c < 0) return 0;
  const disc = b * b - 4 * a * c;
  if (disc < 0) return null;
  const t = (-b - Math.sqrt(disc)) / (2 * a);
  return t >= 0 && t <= 1 ? t : null;
}

/* Slab test, segment vs AABB. */
export function segRect(x, y, dx, dy, x0, y0, x1, y1) {
  let tmin = 0, tmax = 1;
  if (Math.abs(dx) < 1e-9) { if (x < x0 || x > x1) return null; }
  else {
    let t1 = (x0 - x) / dx, t2 = (x1 - x) / dx;
    if (t1 > t2) [t1, t2] = [t2, t1];
    tmin = Math.max(tmin, t1); tmax = Math.min(tmax, t2);
    if (tmin > tmax) return null;
  }
  if (Math.abs(dy) < 1e-9) { if (y < y0 || y > y1) return null; }
  else {
    let t1 = (y0 - y) / dy, t2 = (y1 - y) / dy;
    if (t1 > t2) [t1, t2] = [t2, t1];
    tmin = Math.max(tmin, t1); tmax = Math.min(tmax, t2);
    if (tmin > tmax) return null;
  }
  return tmin;
}

let _shared = null;
/* The map never changes, so it is built once and shared across matches. */
export function getMap() { return _shared || (_shared = new GameMap()); }
