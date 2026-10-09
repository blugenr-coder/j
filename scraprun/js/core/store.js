/* Small persistent stores: player settings and player progress.

   Each store holds a plain object, saves it to the browser's localStorage
   when it changes, and tells subscribers. Storage can be unavailable (a
   private window, blocked site data, an embedded preview), so every read and
   write is guarded and the game simply runs on defaults when it is. */

export class Store {
  #value;
  #subs = new Set();

  constructor(key, defaults) {
    this.key = key;
    this.defaults = defaults;
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(key) || '{}') || {}; } catch { saved = {}; }
    /* keep only known keys, so an old save can't inject stray fields */
    this.#value = { ...defaults };
    for (const k of Object.keys(defaults)) {
      if (typeof saved[k] === typeof defaults[k]) this.#value[k] = saved[k];
    }
  }

  get(key) { return this.#value[key]; }
  get all() { return { ...this.#value }; }

  set(patch) {
    let changed = false;
    for (const [k, v] of Object.entries(patch)) {
      if (!(k in this.defaults) || this.#value[k] === v) continue;
      this.#value[k] = v;
      changed = true;
    }
    if (!changed) return;
    try { localStorage.setItem(this.key, JSON.stringify(this.#value)); } catch { /* runs on defaults next time */ }
    for (const fn of this.#subs) fn(this.all);
  }

  /** Calls `fn(values)` now and on every change. Returns an unsubscribe. */
  subscribe(fn) {
    this.#subs.add(fn);
    fn(this.all);
    return () => this.#subs.delete(fn);
  }
}

export const settings = new Store('scraprun.settings', {
  masterVolume: 0.8,
  musicVolume: 0.7,
  sfxVolume: 0.8
});

/* Progression lives here so the HUD, the garage and, later, the arena all
   read and write the same numbers. Scrap is earned in matches (not built
   yet), so it starts at 0. */
export const progress = new Store('scraprun.progress', {
  scrap: 0
});

export function addScrap(amount) {
  progress.set({ scrap: Math.max(0, progress.get('scrap') + Math.round(amount)) });
}
