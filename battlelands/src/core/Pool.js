/* Fixed-size object pool: no allocation during play, so no GC hitches. */
export class Pool {
  constructor(size, factory) {
    this.items = Array.from({ length: size }, factory);
    for (const it of this.items) it.active = false;
    this.cursor = 0;
  }
  spawn() {
    const n = this.items.length;
    for (let i = 0; i < n; i++) {
      const idx = (this.cursor + i) % n;
      const it = this.items[idx];
      if (!it.active) { this.cursor = (idx + 1) % n; it.active = true; return it; }
    }
    // Pool exhausted: recycle the oldest slot rather than fail.
    const it = this.items[this.cursor];
    this.cursor = (this.cursor + 1) % n;
    it.active = true;
    return it;
  }
  forEach(fn) { for (const it of this.items) if (it.active) fn(it); }
  clear() { for (const it of this.items) it.active = false; }
}
