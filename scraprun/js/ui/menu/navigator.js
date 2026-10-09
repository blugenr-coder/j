/* Screen flow and input for the menus.

   Screens sit in a stack: opening one pushes it, Back or Escape pops it.
   Within a screen, every control marked [data-nav] is part of one vertical
   list that Up/Down move through, and the mouse moves the same selection on
   hover, so keyboard and mouse never disagree about what is selected.
   Enter and clicks use the buttons' own native behaviour. */

import { audio } from '../../core/audio.js';

export class Navigator {
  constructor(root) {
    this.root = root;
    this.screens = new Map();
    this.stack = [];
    this.enabled = false;

    window.addEventListener('keydown', (e) => this.#onKey(e));
    root.addEventListener('pointerover', (e) => {
      const el = e.target.closest('[data-nav]');
      if (el && el !== this.selected && this.#items().includes(el)) this.select(el, { sound: true });
    });
    root.addEventListener('click', (e) => {
      const el = e.target.closest('[data-nav]');
      if (!el || el.disabled) return;
      if (el.matches('input')) return;
      (el.dataset.sound === 'back' ? audio.back() : audio.click());
    });
  }

  /** `screen` = { el, onShow?(), back?: false } — back:false makes Escape a no-op. */
  add(id, screen) {
    this.screens.set(id, screen);
    screen.el.classList.add('mscreen');
    screen.el.inert = true;
  }

  get current() { return this.stack[this.stack.length - 1]; }

  open(id) {
    if (this.current === id) return;
    this.stack.push(id);
    this.#show(id);
  }

  back() {
    if (this.stack.length < 2) return false;
    const leaving = this.screens.get(this.current);
    if (leaving.back === false) return false;
    this.stack.pop();
    this.#show(this.current, { returning: true });
    return true;
  }

  /** Replace the whole stack with one screen (e.g. after quitting). */
  reset(id) {
    this.stack = [id];
    this.#show(id);
  }

  #show(id, { returning = false } = {}) {
    for (const [sid, s] of this.screens) {
      const on = sid === id;
      s.el.classList.toggle('is-active', on);
      s.el.inert = !on;
    }
    const s = this.screens.get(id);
    s.onShow?.();
    /* coming back lands on the control that opened the screen we left */
    const items = this.#items();
    const remembered = returning && s.lastSelected && items.includes(s.lastSelected) ? s.lastSelected : null;
    this.select(remembered || items.find((el) => el.dataset.default !== undefined) || items[0]);
  }

  #items() {
    const s = this.screens.get(this.current);
    if (!s) return [];
    return [...s.el.querySelectorAll('[data-nav]')].filter((el) => !el.disabled && el.offsetParent !== null);
  }

  select(el, { sound = false } = {}) {
    if (!el) return;
    if (this.selected) this.selected.classList.remove('is-selected');
    this.selected = el;
    el.classList.add('is-selected');
    el.focus({ preventScroll: true });
    const s = this.screens.get(this.current);
    if (s) s.lastSelected = el;
    if (sound) audio.hover();
  }

  #onKey(e) {
    audio.unlock();
    if (!this.enabled) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();                       // also stops sliders taking Up/Down
      const items = this.#items();
      if (!items.length) return;
      const i = items.indexOf(this.selected);
      const next = e.key === 'ArrowDown' ? (i + 1) % items.length : (i - 1 + items.length) % items.length;
      this.select(items[next], { sound: true });
    } else if (e.key === 'Escape') {
      if (this.back()) { e.preventDefault(); audio.back(); }
    } else if (e.key === 'Enter' && document.activeElement?.matches('input[type="range"]')) {
      /* Enter on a slider moves on to the next control */
      e.preventDefault();
      this.#onKey(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    }
  }
}
