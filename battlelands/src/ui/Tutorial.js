/* First-match coaching: one short instruction at a time, pointing at the
   control it's about, gone as soon as the player does the thing. */
import { el, press } from './dom.js';
import { t } from './i18n.js';

export class Tutorial {
  constructor(root, onFinish) {
    this.root = root;
    this.onFinish = onFinish;
    this.cur = null;
    this.doneSet = new Set();
    this.step = 'move';
    this.stepT = 0;
    this.moved = 0;
    this.skipBtn = null;
  }

  point(id, target, text, where = 'above') {
    if (this.doneSet.has(id)) return;
    this.clear();
    const r = target.getBoundingClientRect();
    const n = el(`<div class="coach"><div class="bubble">${text}</div><div class="hand"></div></div>`);
    this.root.appendChild(n);
    const w = n.offsetWidth, h = n.offsetHeight;
    let x = r.left + r.width / 2 - w / 2, y = r.top - h - 6;
    if (where === 'center') { x = r.left + r.width / 2 - w / 2; y = r.top + r.height / 2 - h / 2; }
    if (where === 'below') { x = r.right - w; y = r.bottom + 10; }
    x = Math.max(8, Math.min(window.innerWidth - w - 8, x));
    y = Math.max(8, y);
    n.style.left = x + 'px'; n.style.top = y + 'px';
    this.cur = { id, n };
  }

  done(id) {
    this.doneSet.add(id);
    if (this.cur && this.cur.id === id) this.clear();
  }

  clear() { this.cur?.n.remove(); this.cur = null; }

  mountSkip(host) {
    this.skipBtn = el(`<button class="btn btn-secondary btn-sm coach-skip">${t('SKIP')}</button>`);
    host.appendChild(this.skipBtn);
    press(this.skipBtn, () => this.finish(), { sound: 'back' });
  }

  finish() {
    this.clear();
    this.skipBtn?.remove();
    this.step = 'done';
    this.onFinish?.();
  }

  /* Called every frame while the match runs. */
  update(dt, match, hud) {
    if (this.step === 'done' || !hud.node) return;
    const p = match.player;
    if (!p.alive) { this.finish(); return; }
    this.stepT += dt;
    const q = s => hud.node.querySelector(s);
    if (this.step === 'move') {
      this.moved += p.speedNow * dt;
      if (!this.cur) {
        const kb = matchMedia('(pointer: fine)').matches;
        this.point('move', q('#joyZone'), kb ? t('WASD to move • Mouse to aim • Click to shoot') : t('DRAG HERE TO MOVE'), 'center');
      }
      if (this.moved > 220) { this.done('move'); this.step = 'shoot'; this.stepT = 0; }
    } else if (this.step === 'shoot') {
      if (!this.cur) this.point('shoot', q('#fireBtn'), t('TAP TO SHOOT • DRAG TO AIM'));
      if (p.wantFire || this.stepT > 9) { this.done('shoot'); this.step = 'loot'; this.stepT = 0; }
    } else if (this.step === 'loot') {
      if (!this.cur) this.point('loot', q('#slots'), t('WALK OVER LOOT TO GRAB IT'));
      if (p.weapons[0] || this.stepT > 12) { this.done('loot'); this.step = 'zone'; this.stepT = 0; }
    } else if (this.step === 'zone') {
      if (match.zone.stage === 'warning' || match.zone.stage === 'shrinking') {
        if (!this.cur) this.point('zone', q('#mini'), t('STAY INSIDE THE SAFE ZONE'), 'below');
        if (this.stepT > 6) this.finish();
      } else this.stepT = 0;
    }
  }
}
