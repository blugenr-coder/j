/* Minimal pub/sub. Simulation code emits; rendering, audio and UI listen.
   That one-way flow is what lets the match run headless in tests. */
export class EventBus {
  constructor() { this.map = new Map(); }
  on(type, fn) {
    if (!this.map.has(type)) this.map.set(type, new Set());
    this.map.get(type).add(fn);
    return () => this.off(type, fn);
  }
  off(type, fn) { this.map.get(type)?.delete(fn); }
  emit(type, payload) {
    const set = this.map.get(type);
    if (set) for (const fn of set) fn(payload);
  }
  clear() { this.map.clear(); }
}

/* The app-wide bus (UI, menus, save). Each match also owns its own bus. */
export const bus = new EventBus();
