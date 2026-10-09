/* The loading manager.

   Progress on this screen means work that has actually finished. Each task
   carries a weight (its share of the bar) and may report partial progress
   while it runs, so a large download can move the bar smoothly instead of
   jumping when it ends. The bar is never told the game is ready until every
   task has resolved.

   Anything the game needs before play — models, audio, level data — is
   registered here with add(). The loading screen does not know or care what
   the tasks are. */

export class LoadingManager extends EventTarget {
  #tasks = [];
  #started = false;

  /** Register a task. `run(report)` may call report(0..1) as it goes, and
      must return a promise (or a value) when finished. */
  add(label, run, { weight = 1 } = {}) {
    if (this.#started) throw new Error(`Task "${label}" added after loading started`);
    this.#tasks.push({ label, run, weight: Math.max(0, weight), done: 0 });
    return this;
  }

  /** Fraction of the total weight that has really completed, 0..1. */
  get progress() {
    const total = this.#tasks.reduce((sum, t) => sum + t.weight, 0);
    if (total === 0) return this.#started ? 1 : 0;
    return this.#tasks.reduce((sum, t) => sum + t.weight * t.done, 0) / total;
  }

  /** Runs tasks in order. Sequential on purpose: several tasks build canvases
      on the main thread, and running them together would only make the frame
      that draws the bar wait longer. Downloads can still overlap inside a
      single task with Promise.all. */
  async start() {
    if (this.#started) return;
    this.#started = true;
    for (const task of this.#tasks) {
      this.#emit('task', { label: task.label });
      const report = (f) => {
        const v = Math.min(1, Math.max(0, Number(f) || 0));
        /* Never let a task move its own progress backwards. */
        if (v > task.done) { task.done = Math.min(v, 0.999); this.#emit('progress'); }
      };
      try {
        await task.run(report);
      } catch (error) {
        /* A failed task is reported, not swallowed: the screen shows an error
           rather than a full bar for a game that cannot start. */
        this.#emit('error', { label: task.label, error });
        throw error;
      }
      task.done = 1;
      this.#emit('progress');
      /* Give the browser a frame between tasks so the bar can paint. */
      await nextFrame();
    }
    this.#emit('complete');
  }

  #emit(type, detail = {}) {
    this.dispatchEvent(new CustomEvent(type, { detail: { ...detail, progress: this.progress } }));
  }
}

export const nextFrame = () => new Promise((r) => requestAnimationFrame(() => r()));

/** Fetch a file and report download progress from the byte stream, when the
    server says how large it is. Future game assets go through this. */
export async function fetchWithProgress(url, report) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  const total = Number(res.headers.get('content-length')) || 0;
  if (!res.body || !total) { const buf = await res.arrayBuffer(); report(1); return buf; }
  const reader = res.body.getReader();
  const chunks = [];
  let received = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.length;
    report(received / total);
  }
  const out = new Uint8Array(received);
  let at = 0;
  for (const c of chunks) { out.set(c, at); at += c.length; }
  return out.buffer;
}
