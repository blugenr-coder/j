// 2D collision on the ground plane (x, z), a spatial hash for colliders,
// segment raycasts for bullets / line of sight, and a navigation grid with A*
// so bots can walk through doorways and around buildings.

import { clamp } from './util.js';

const CELL = 8;

export class Physics {
  constructor(world) {
    this.world = world;
    this.half = world.half;
    this.dim = Math.ceil((this.half * 2) / CELL);
    this.cells = new Array(this.dim * this.dim);
    for (let i = 0; i < this.cells.length; i++) this.cells[i] = [];
    this.stamp = 1;
    this.all = [];
  }

  cellIndex(x, z) {
    const cx = clamp(Math.floor((x + this.half) / CELL), 0, this.dim - 1);
    const cz = clamp(Math.floor((z + this.half) / CELL), 0, this.dim - 1);
    return cz * this.dim + cx;
  }

  _insert(c) {
    const x0 = clamp(Math.floor((c.minX + this.half) / CELL), 0, this.dim - 1);
    const x1 = clamp(Math.floor((c.maxX + this.half) / CELL), 0, this.dim - 1);
    const z0 = clamp(Math.floor((c.minZ + this.half) / CELL), 0, this.dim - 1);
    const z1 = clamp(Math.floor((c.maxZ + this.half) / CELL), 0, this.dim - 1);
    for (let z = z0; z <= z1; z++) for (let x = x0; x <= x1; x++) this.cells[z * this.dim + x].push(c);
    this.all.push(c);
    return c;
  }

  // opts: { bullets: blocks bullets (default true), move: blocks movement (default true), tag, data }
  addBox(minX, minZ, maxX, maxZ, opts = {}) {
    return this._insert({
      kind: 'box', minX, minZ, maxX, maxZ,
      bullets: opts.bullets !== false, move: opts.move !== false,
      tag: opts.tag || 'solid', data: opts.data || null, dead: false, stamp: 0,
    });
  }

  addCircle(x, z, r, opts = {}) {
    return this._insert({
      kind: 'circle', x, z, r, minX: x - r, minZ: z - r, maxX: x + r, maxZ: z + r,
      bullets: opts.bullets !== false, move: opts.move !== false,
      tag: opts.tag || 'solid', data: opts.data || null, dead: false, stamp: 0,
    });
  }

  remove(c) { c.dead = true; }

  // Remove dead colliders for good (between matches).
  compact() {
    for (const cell of this.cells) {
      for (let i = cell.length - 1; i >= 0; i--) if (cell[i].dead) cell.splice(i, 1);
    }
    this.all = this.all.filter((c) => !c.dead);
  }

  query(minX, minZ, maxX, maxZ, fn) {
    const s = ++this.stamp;
    const x0 = clamp(Math.floor((minX + this.half) / CELL), 0, this.dim - 1);
    const x1 = clamp(Math.floor((maxX + this.half) / CELL), 0, this.dim - 1);
    const z0 = clamp(Math.floor((minZ + this.half) / CELL), 0, this.dim - 1);
    const z1 = clamp(Math.floor((maxZ + this.half) / CELL), 0, this.dim - 1);
    for (let z = z0; z <= z1; z++) {
      for (let x = x0; x <= x1; x++) {
        const cell = this.cells[z * this.dim + x];
        for (let i = 0; i < cell.length; i++) {
          const c = cell[i];
          if (c.dead || c.stamp === s) continue;
          c.stamp = s;
          if (c.maxX < minX || c.minX > maxX || c.maxZ < minZ || c.minZ > maxZ) continue;
          if (fn(c) === false) return;
        }
      }
    }
  }

  // Push a circle out of every movement-blocking collider. Mutates pos.
  resolveCircle(pos, r) {
    for (let iter = 0; iter < 3; iter++) {
      let moved = false;
      this.query(pos.x - r, pos.z - r, pos.x + r, pos.z + r, (c) => {
        if (!c.move) return;
        if (c.kind === 'box') {
          const cx = clamp(pos.x, c.minX, c.maxX), cz = clamp(pos.z, c.minZ, c.maxZ);
          const dx = pos.x - cx, dz = pos.z - cz;
          const d2 = dx * dx + dz * dz;
          if (d2 >= r * r) return;
          if (d2 > 1e-9) {
            const d = Math.sqrt(d2);
            pos.x += (dx / d) * (r - d);
            pos.z += (dz / d) * (r - d);
          } else {
            const l = pos.x - c.minX, rr = c.maxX - pos.x, t = pos.z - c.minZ, b = c.maxZ - pos.z;
            const m = Math.min(l, rr, t, b);
            if (m === l) pos.x = c.minX - r; else if (m === rr) pos.x = c.maxX + r;
            else if (m === t) pos.z = c.minZ - r; else pos.z = c.maxZ + r;
          }
          moved = true;
        } else {
          const dx = pos.x - c.x, dz = pos.z - c.z;
          const rr = r + c.r;
          const d2 = dx * dx + dz * dz;
          if (d2 >= rr * rr) return;
          const d = Math.sqrt(d2) || 1e-4;
          pos.x = c.x + (dx / d) * rr;
          pos.z = c.z + (dz / d) * rr;
          moved = true;
        }
      });
      if (!moved) break;
    }
  }

  // Move a circle by (dx, dz) with sliding against colliders and terrain.
  move(pos, r, dx, dz) {
    const ox = pos.x, oz = pos.z;
    // Sub-step long moves so fast movers cannot tunnel through thin walls.
    const len = Math.hypot(dx, dz);
    const steps = Math.max(1, Math.ceil(len / (r * 0.8)));
    for (let i = 0; i < steps; i++) {
      pos.x += dx / steps;
      pos.z += dz / steps;
      this.resolveCircle(pos, r);
    }
    if (!this.world.isWalkable(pos.x, pos.z)) {
      // Slide along terrain edges (shore, river) one axis at a time.
      const nx = pos.x, nz = pos.z;
      if (this.world.isWalkable(nx, oz)) { pos.x = nx; pos.z = oz; }
      else if (this.world.isWalkable(ox, nz)) { pos.x = ox; pos.z = nz; }
      else { pos.x = ox; pos.z = oz; }
    }
  }

  // Nearest hit along segment. filter(c) -> bool chooses which colliders count.
  // Returns { t (0..1), c, nx, nz } or null.
  raycast(x0, z0, x1, z1, filter) {
    const dx = x1 - x0, dz = z1 - z0;
    let best = null, bestT = 1;
    const s = ++this.stamp;
    // Amanatides–Woo traversal of the grid cells the segment crosses.
    let cx = clamp(Math.floor((x0 + this.half) / CELL), 0, this.dim - 1);
    let cz = clamp(Math.floor((z0 + this.half) / CELL), 0, this.dim - 1);
    const ex = clamp(Math.floor((x1 + this.half) / CELL), 0, this.dim - 1);
    const ez = clamp(Math.floor((z1 + this.half) / CELL), 0, this.dim - 1);
    const stepX = dx > 0 ? 1 : -1, stepZ = dz > 0 ? 1 : -1;
    const tDX = dx !== 0 ? Math.abs(CELL / dx) : Infinity;
    const tDZ = dz !== 0 ? Math.abs(CELL / dz) : Infinity;
    const bx = (cx + (dx > 0 ? 1 : 0)) * CELL - this.half;
    const bz = (cz + (dz > 0 ? 1 : 0)) * CELL - this.half;
    let tMX = dx !== 0 ? (bx - x0) / dx : Infinity;
    let tMZ = dz !== 0 ? (bz - z0) / dz : Infinity;
    let guard = 0;
    for (;;) {
      const cell = this.cells[cz * this.dim + cx];
      for (let i = 0; i < cell.length; i++) {
        const c = cell[i];
        if (c.dead || c.stamp === s) continue;
        c.stamp = s;
        if (filter && !filter(c)) continue;
        const h = c.kind === 'box' ? segBox(x0, z0, dx, dz, c) : segCircle(x0, z0, dx, dz, c.x, c.z, c.r);
        if (h && h.t < bestT) { bestT = h.t; best = h; best.c = c; }
      }
      if (best && Math.min(tMX, tMZ) > bestT) break;
      if ((cx === ex && cz === ez) || ++guard > 400) break;
      if (tMX < tMZ) { if (tMX > 1) break; cx += stepX; tMX += tDX; }
      else { if (tMZ > 1) break; cz += stepZ; tMZ += tDZ; }
      if (cx < 0 || cz < 0 || cx >= this.dim || cz >= this.dim) break;
    }
    return best;
  }

  lineOfSight(x0, z0, x1, z1) {
    return !this.raycast(x0, z0, x1, z1, (c) => c.bullets);
  }
}

export function segBox(x0, z0, dx, dz, b) {
  let tmin = 0, tmax = 1, nx = 0, nz = 0;
  if (Math.abs(dx) < 1e-9) { if (x0 < b.minX || x0 > b.maxX) return null; }
  else {
    let t1 = (b.minX - x0) / dx, t2 = (b.maxX - x0) / dx, n = -1;
    if (t1 > t2) { const t = t1; t1 = t2; t2 = t; n = 1; }
    if (t1 > tmin) { tmin = t1; nx = n; nz = 0; }
    tmax = Math.min(tmax, t2);
    if (tmin > tmax) return null;
  }
  if (Math.abs(dz) < 1e-9) { if (z0 < b.minZ || z0 > b.maxZ) return null; }
  else {
    let t1 = (b.minZ - z0) / dz, t2 = (b.maxZ - z0) / dz, n = -1;
    if (t1 > t2) { const t = t1; t1 = t2; t2 = t; n = 1; }
    if (t1 > tmin) { tmin = t1; nz = n; nx = 0; }
    tmax = Math.min(tmax, t2);
    if (tmin > tmax) return null;
  }
  return { t: tmin, nx, nz };
}

export function segCircle(x0, z0, dx, dz, cx, cz, r) {
  const fx = x0 - cx, fz = z0 - cz;
  const a = dx * dx + dz * dz;
  if (a < 1e-12) return null;
  const b = 2 * (fx * dx + fz * dz);
  const c = fx * fx + fz * fz - r * r;
  let disc = b * b - 4 * a * c;
  if (disc < 0) return null;
  disc = Math.sqrt(disc);
  const t = (-b - disc) / (2 * a);
  if (t < 0 || t > 1) {
    if (c < 0) return { t: 0, nx: fx, nz: fz }; // started inside
    return null;
  }
  const hx = fx + dx * t, hz = fz + dz * t;
  const l = Math.hypot(hx, hz) || 1;
  return { t, nx: hx / l, nz: hz / l };
}

// ---------------------------------------------------------------------------
// Navigation grid + A*

export class NavGrid {
  constructor(world, physics, cell = 1.5, agentR = 0.55) {
    this.cell = cell;
    this.half = world.half;
    this.dim = Math.ceil((this.half * 2) / cell);
    const n = this.dim * this.dim;
    this.blocked = new Uint8Array(n);
    this.g = new Float32Array(n);
    this.parent = new Int32Array(n);
    this.seen = new Uint32Array(n);
    this.closed = new Uint32Array(n);
    this.gen = 0;
    this.heap = new BinaryHeap(n);
    this.world = world;
    this.physics = physics;
    this.agentR = agentR;
    this.rebuild();
  }

  rebuild() {
    const { dim, cell, half } = this;
    for (let z = 0; z < dim; z++) {
      for (let x = 0; x < dim; x++) {
        const wx = -half + (x + 0.5) * cell, wz = -half + (z + 0.5) * cell;
        this.blocked[z * dim + x] = this.world.isWalkable(wx, wz) ? 0 : 1;
      }
    }
    const r = this.agentR;
    for (const c of this.physics.all) {
      if (c.dead || !c.move) continue;
      const x0 = Math.floor((c.minX - r + half) / cell), x1 = Math.floor((c.maxX + r + half) / cell);
      const z0 = Math.floor((c.minZ - r + half) / cell), z1 = Math.floor((c.maxZ + r + half) / cell);
      for (let z = Math.max(0, z0); z <= Math.min(dim - 1, z1); z++) {
        for (let x = Math.max(0, x0); x <= Math.min(dim - 1, x1); x++) {
          const wx = -half + (x + 0.5) * cell, wz = -half + (z + 0.5) * cell;
          let inside;
          if (c.kind === 'box') {
            const px = clamp(wx, c.minX, c.maxX), pz = clamp(wz, c.minZ, c.maxZ);
            inside = (wx - px) ** 2 + (wz - pz) ** 2 < (r + 0.12) ** 2;
          } else {
            inside = (wx - c.x) ** 2 + (wz - c.z) ** 2 < (c.r + r + 0.1) ** 2;
          }
          if (inside) this.blocked[z * dim + x] = 1;
        }
      }
    }
  }

  toCell(x, z) {
    return [clamp(Math.floor((x + this.half) / this.cell), 0, this.dim - 1), clamp(Math.floor((z + this.half) / this.cell), 0, this.dim - 1)];
  }
  toWorld(cx, cz) { return [-this.half + (cx + 0.5) * this.cell, -this.half + (cz + 0.5) * this.cell]; }
  isFree(x, z) { const [cx, cz] = this.toCell(x, z); return !this.blocked[cz * this.dim + cx]; }

  nearestFree(x, z, maxR = 12) {
    const [cx, cz] = this.toCell(x, z);
    if (!this.blocked[cz * this.dim + cx]) return this.toWorld(cx, cz);
    for (let r = 1; r <= maxR; r++) {
      for (let dz = -r; dz <= r; dz++) {
        for (let dx = -r; dx <= r; dx++) {
          if (Math.abs(dx) !== r && Math.abs(dz) !== r) continue;
          const nx = cx + dx, nz = cz + dz;
          if (nx < 0 || nz < 0 || nx >= this.dim || nz >= this.dim) continue;
          if (!this.blocked[nz * this.dim + nx]) return this.toWorld(nx, nz);
        }
      }
    }
    return null;
  }

  // Straight walkable line between two world points on the grid?
  clearLine(x0, z0, x1, z1) {
    const d = Math.hypot(x1 - x0, z1 - z0);
    const steps = Math.ceil(d / (this.cell * 0.5));
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      if (!this.isFree(x0 + (x1 - x0) * t, z0 + (z1 - z0) * t)) return false;
    }
    return true;
  }

  findPath(sx, sz, tx, tz, maxExpand = 7000) {
    const start = this.nearestFree(sx, sz, 4);
    const goal = this.nearestFree(tx, tz, 10);
    if (!start || !goal) return null;
    if (this.clearLine(sx, sz, goal[0], goal[1])) return [[goal[0], goal[1]]];
    const dim = this.dim;
    const [scx, scz] = this.toCell(start[0], start[1]);
    const [gcx, gcz] = this.toCell(goal[0], goal[1]);
    const gen = ++this.gen;
    const heap = this.heap;
    heap.clear();
    const si = scz * dim + scx, gi = gcz * dim + gcx;
    this.g[si] = 0; this.parent[si] = -1; this.seen[si] = gen;
    heap.push(si, octile(scx, scz, gcx, gcz));
    let expanded = 0, found = false, bestI = si, bestH = Infinity;
    while (heap.size) {
      const cur = heap.pop();
      if (cur === gi) { found = true; break; }
      if (this.closed[cur] === gen) continue;
      this.closed[cur] = gen;
      if (++expanded > maxExpand) break;
      const cx = cur % dim, cz = (cur / dim) | 0;
      const h = octile(cx, cz, gcx, gcz);
      if (h < bestH) { bestH = h; bestI = cur; }
      for (let dz = -1; dz <= 1; dz++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (!dx && !dz) continue;
          const nx = cx + dx, nz = cz + dz;
          if (nx < 0 || nz < 0 || nx >= dim || nz >= dim) continue;
          const ni = nz * dim + nx;
          if (this.blocked[ni] || this.closed[ni] === gen) continue;
          if (dx && dz && (this.blocked[cz * dim + nx] || this.blocked[nz * dim + cx])) continue;
          const ng = this.g[cur] + (dx && dz ? 1.4142 : 1);
          if (this.seen[ni] !== gen || ng < this.g[ni]) {
            this.seen[ni] = gen; this.g[ni] = ng; this.parent[ni] = cur;
            heap.push(ni, ng + octile(nx, nz, gcx, gcz));
          }
        }
      }
    }
    let end = found ? gi : bestI;
    const cells = [];
    while (end !== -1 && cells.length < 2000) { cells.push(end); end = this.parent[end]; }
    cells.reverse();
    const pts = cells.map((i) => this.toWorld(i % dim, (i / dim) | 0));
    if (found) pts[pts.length - 1] = goal;
    // String-pull: keep only waypoints needed to stay on free cells.
    const out = [];
    let ax = sx, az = sz, i = 0;
    while (i < pts.length) {
      let j = pts.length - 1;
      while (j > i && !this.clearLine(ax, az, pts[j][0], pts[j][1])) j--;
      out.push(pts[j]);
      ax = pts[j][0]; az = pts[j][1];
      i = j + 1;
    }
    return out.length ? out : null;
  }
}

function octile(ax, az, bx, bz) {
  const dx = Math.abs(ax - bx), dz = Math.abs(az - bz);
  return dx + dz + (1.4142 - 2) * Math.min(dx, dz);
}

class BinaryHeap {
  constructor(cap) { this.items = new Int32Array(cap * 2); this.prio = new Float32Array(cap * 2); this.size = 0; }
  clear() { this.size = 0; }
  push(item, p) {
    if (this.size >= this.items.length) return;
    let i = this.size++;
    this.items[i] = item; this.prio[i] = p;
    while (i > 0) {
      const par = (i - 1) >> 1;
      if (this.prio[par] <= this.prio[i]) break;
      this._swap(i, par); i = par;
    }
  }
  pop() {
    const top = this.items[0];
    const last = --this.size;
    if (last > 0) {
      this.items[0] = this.items[last]; this.prio[0] = this.prio[last];
      let i = 0;
      for (;;) {
        const l = i * 2 + 1, r = l + 1;
        let m = i;
        if (l < last && this.prio[l] < this.prio[m]) m = l;
        if (r < last && this.prio[r] < this.prio[m]) m = r;
        if (m === i) break;
        this._swap(i, m); i = m;
      }
    }
    return top;
  }
  _swap(a, b) {
    const ti = this.items[a]; this.items[a] = this.items[b]; this.items[b] = ti;
    const tp = this.prio[a]; this.prio[a] = this.prio[b]; this.prio[b] = tp;
  }
}
