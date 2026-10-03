/* Grid A* over the static map, computed once. Water costs more than land so
   bots prefer bridges; walls are impassable. Paths are string-pulled so bots
   walk straight lines instead of staircase zig-zags. */

const CELL = 25;
const SQRT2 = Math.SQRT2;

export class NavGrid {
  constructor(map) {
    this.map = map;
    this.cell = CELL;
    this.cols = Math.ceil(map.size / CELL);
    const n = this.cols * this.cols;
    this.blocked = new Uint8Array(n);
    this.cost = new Float32Array(n);
    for (let cy = 0; cy < this.cols; cy++) for (let cx = 0; cx < this.cols; cx++) {
      const i = cy * this.cols + cx;
      const x = (cx + 0.5) * CELL, y = (cy + 0.5) * CELL;
      const m = map.border + 20;
      if (x < m || y < m || x > map.size - m || y > map.size - m) { this.blocked[i] = 1; continue; }
      if (map.circleBlocked(x, y, 15)) { this.blocked[i] = 1; continue; }
      this.cost[i] = map.isWater(x, y) ? 3.2 : 1;
    }
    // Reusable search buffers: no allocation per path.
    this.g = new Float32Array(n);
    this.parent = new Int32Array(n);
    this.seen = new Uint32Array(n);
    this.closed = new Uint32Array(n);
    this.gen = 0;
    this.heap = new MinHeap(n);
  }

  cellOf(x, y) {
    const cx = Math.min(this.cols - 1, Math.max(0, Math.floor(x / CELL)));
    const cy = Math.min(this.cols - 1, Math.max(0, Math.floor(y / CELL)));
    return cy * this.cols + cx;
  }
  center(i) { return [((i % this.cols) + 0.5) * CELL, (Math.floor(i / this.cols) + 0.5) * CELL]; }

  /* Nearest open cell, spiralling out. Used when a goal sits inside a prop. */
  nearestOpen(i) {
    if (!this.blocked[i]) return i;
    const cx = i % this.cols, cy = Math.floor(i / this.cols);
    for (let r = 1; r < 8; r++)
      for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
        if (Math.abs(dx) !== r && Math.abs(dy) !== r) continue;
        const x = cx + dx, y = cy + dy;
        if (x < 0 || y < 0 || x >= this.cols || y >= this.cols) continue;
        const j = y * this.cols + x;
        if (!this.blocked[j]) return j;
      }
    return -1;
  }

  /* Returns an array of [x,y] waypoints (excluding start) or null. */
  findPath(sx, sy, tx, ty, maxExpand = 5000) {
    const cols = this.cols;
    const start = this.nearestOpen(this.cellOf(sx, sy));
    const goal = this.nearestOpen(this.cellOf(tx, ty));
    if (start < 0 || goal < 0) return null;
    if (start === goal) return [[tx, ty]];
    const gen = ++this.gen;
    const { g, parent, seen, closed, heap, blocked, cost } = this;
    const gx = goal % cols, gy = Math.floor(goal / cols);
    const h = i => {
      const dx = Math.abs((i % cols) - gx), dy = Math.abs(Math.floor(i / cols) - gy);
      return (dx + dy) + (SQRT2 - 2) * Math.min(dx, dy);
    };
    heap.clear();
    g[start] = 0; parent[start] = -1; seen[start] = gen;
    heap.push(start, h(start));
    let expanded = 0, best = start, bestH = h(start);
    while (heap.size) {
      const cur = heap.pop();
      if (closed[cur] === gen) continue;
      closed[cur] = gen;
      if (cur === goal) { best = goal; break; }
      const hc = h(cur);
      if (hc < bestH) { bestH = hc; best = cur; }
      if (++expanded > maxExpand) break;
      const cx = cur % cols, cy = Math.floor(cur / cols);
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        const nx = cx + dx, ny = cy + dy;
        if (nx < 0 || ny < 0 || nx >= cols || ny >= cols) continue;
        const ni = ny * cols + nx;
        if (blocked[ni] || closed[ni] === gen) continue;
        // No cutting corners past walls.
        if (dx && dy && (blocked[cy * cols + nx] || blocked[ny * cols + cx])) continue;
        const ng = g[cur] + (dx && dy ? SQRT2 : 1) * cost[ni];
        if (seen[ni] !== gen || ng < g[ni]) {
          seen[ni] = gen; g[ni] = ng; parent[ni] = cur;
          heap.push(ni, ng + h(ni));
        }
      }
    }
    // Partial path to the closest point reached if the budget ran out.
    const cells = [];
    for (let c = best; c !== -1 && c !== start; c = parent[c]) cells.push(c);
    cells.reverse();
    if (!cells.length) return null;
    const pts = cells.map(c => this.center(c));
    if (best === goal) pts[pts.length - 1] = [tx, ty];
    return this.smooth(sx, sy, pts);
  }

  /* Walkable straight line between two points on the grid. */
  clearLine(x1, y1, x2, y2) {
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.hypot(dx, dy);
    const steps = Math.ceil(len / (CELL * 0.5));
    let water = this.cost[this.cellOf(x1, y1)] > 1;
    for (let i = 1; i <= steps; i++) {
      const c = this.cellOf(x1 + (dx * i) / steps, y1 + (dy * i) / steps);
      if (this.blocked[c]) return false;
      // Don't smooth a dry path into a swim.
      if (!water && this.cost[c] > 1) return false;
    }
    return true;
  }

  smooth(sx, sy, pts) {
    const out = [];
    let ax = sx, ay = sy, i = 0;
    while (i < pts.length) {
      let j = Math.min(pts.length - 1, i + 14);
      while (j > i && !this.clearLine(ax, ay, pts[j][0], pts[j][1])) j--;
      out.push(pts[j]);
      [ax, ay] = pts[j];
      i = j + 1;
    }
    return out;
  }

  /* Set of cells reachable from a point (for tests). */
  flood(x, y) {
    const start = this.nearestOpen(this.cellOf(x, y));
    const seen = new Set([start]);
    const q = [start];
    while (q.length) {
      const c = q.pop();
      const cx = c % this.cols, cy = Math.floor(c / this.cols);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = cx + dx, ny = cy + dy;
        if (nx < 0 || ny < 0 || nx >= this.cols || ny >= this.cols) continue;
        const ni = ny * this.cols + nx;
        if (!this.blocked[ni] && !seen.has(ni)) { seen.add(ni); q.push(ni); }
      }
    }
    return seen;
  }
}

class MinHeap {
  constructor(cap) { this.ids = new Int32Array(cap * 4); this.pri = new Float32Array(cap * 4); this.size = 0; }
  clear() { this.size = 0; }
  push(id, p) {
    if (this.size >= this.ids.length) return; // duplicates can overflow; dropping is safe
    let i = this.size++;
    while (i > 0) {
      const par = (i - 1) >> 1;
      if (this.pri[par] <= p) break;
      this.ids[i] = this.ids[par]; this.pri[i] = this.pri[par]; i = par;
    }
    this.ids[i] = id; this.pri[i] = p;
  }
  pop() {
    const top = this.ids[0];
    const lastId = this.ids[--this.size], lastP = this.pri[this.size];
    let i = 0;
    for (;;) {
      let c = 2 * i + 1;
      if (c >= this.size) break;
      if (c + 1 < this.size && this.pri[c + 1] < this.pri[c]) c++;
      if (this.pri[c] >= lastP) break;
      this.ids[i] = this.ids[c]; this.pri[i] = this.pri[c]; i = c;
    }
    this.ids[i] = lastId; this.pri[i] = lastP;
    return top;
  }
}

let _nav = null;
export function getNav(map) { return _nav || (_nav = new NavGrid(map)); }
