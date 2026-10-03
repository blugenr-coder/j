/* Uniform spatial hash for static things (obstacles, bushes, loot).
   Queries touch only the cells a shape overlaps, so the cost of a collision
   check does not grow with the size of the map. */
export class SpatialGrid {
  constructor(worldSize, cellSize) {
    this.cell = cellSize;
    this.cols = Math.ceil(worldSize / cellSize) + 2;
    this.cells = Array.from({ length: this.cols * this.cols }, () => []);
    this.stamp = 0;
  }
  _idx(cx, cy) {
    if (cx < 0) cx = 0; else if (cx >= this.cols) cx = this.cols - 1;
    if (cy < 0) cy = 0; else if (cy >= this.cols) cy = this.cols - 1;
    return cy * this.cols + cx;
  }
  insert(item, minX, minY, maxX, maxY) {
    const c = this.cell;
    item._cells = [];
    for (let cy = Math.floor(minY / c); cy <= Math.floor(maxY / c); cy++)
      for (let cx = Math.floor(minX / c); cx <= Math.floor(maxX / c); cx++) {
        const i = this._idx(cx, cy);
        this.cells[i].push(item);
        item._cells.push(i);
      }
    item._stamp = 0;
  }
  remove(item) {
    if (!item._cells) return;
    for (const i of item._cells) {
      const arr = this.cells[i];
      const k = arr.indexOf(item);
      if (k >= 0) { arr[k] = arr[arr.length - 1]; arr.pop(); }
    }
    item._cells = null;
  }
  /* Calls fn(item) once per item whose cells overlap the box. */
  query(minX, minY, maxX, maxY, fn) {
    const c = this.cell;
    const s = ++this.stamp;
    const x0 = Math.floor(minX / c), x1 = Math.floor(maxX / c);
    const y0 = Math.floor(minY / c), y1 = Math.floor(maxY / c);
    for (let cy = y0; cy <= y1; cy++)
      for (let cx = x0; cx <= x1; cx++) {
        const arr = this.cells[this._idx(cx, cy)];
        for (let k = 0; k < arr.length; k++) {
          const it = arr[k];
          if (it._stamp === s) continue;
          it._stamp = s;
          if (fn(it) === false) return;
        }
      }
  }
}
