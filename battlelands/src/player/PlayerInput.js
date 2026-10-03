/* Touch-first input with zero smoothing on the read side: whatever the thumb
   does this frame is what the player does this frame.
   - left: virtual joystick (floating or fixed)
   - right: big attack button — tap = auto-aim shot, hold = keep firing,
     drag = aim yourself (twin-stick)
   - desktop fallback: WASD + mouse aim + click, number keys, E/Q/F/R */

import { clamp } from '../core/math.js';

export class PlayerInput {
  constructor(settings) {
    this.settings = settings;
    this.move = { x: 0, y: 0 };
    this.keys = new Set();
    this.joy = null;          // { id, bx, by, x, y }
    this.fireTouch = null;    // { id, cx, cy, angle|null }
    this.mouse = { x: 0, y: 0, down: false, active: false };
    this.onAction = () => {};
    this.enabled = false;
    this._offs = [];
  }

  on(target, type, fn, opts) {
    target.addEventListener(type, fn, opts);
    this._offs.push(() => target.removeEventListener(type, fn, opts));
  }

  bind({ joyZone, joyEl, thumbEl, fireEl, canvas }) {
    this.unbind();
    this.enabled = true;
    this.els = { joyZone, joyEl, thumbEl, fireEl };
    this.placeFixedJoystick();

    // --- joystick ---
    this.on(joyZone, 'pointerdown', e => {
      if (this.joy) return;
      e.preventDefault();
      joyZone.setPointerCapture?.(e.pointerId);
      const r = joyZone.getBoundingClientRect();
      let bx = e.clientX, by = e.clientY;
      if (this.settings.joystickMode === 'fixed') { bx = this.fixedX + r.left; by = this.fixedY + r.top; }
      this.joy = { id: e.pointerId, bx, by, x: e.clientX, y: e.clientY };
      joyEl.style.left = (bx - r.left) + 'px'; joyEl.style.top = (by - r.top) + 'px';
      joyEl.classList.remove('idle');
      this._updateJoy();
    });
    this.on(joyZone, 'pointermove', e => {
      if (!this.joy || e.pointerId !== this.joy.id) return;
      this.joy.x = e.clientX; this.joy.y = e.clientY;
      this._updateJoy();
    });
    const endJoy = e => {
      if (!this.joy || e.pointerId !== this.joy.id) return;
      this.joy = null; this.move.x = this.move.y = 0;
      thumbEl.style.transform = 'translate(-50%, -50%)';
      joyEl.classList.add('idle');
      this.placeFixedJoystick();
    };
    this.on(joyZone, 'pointerup', endJoy);
    this.on(joyZone, 'pointercancel', endJoy);

    // --- fire / aim stick ---
    this.on(fireEl, 'pointerdown', e => {
      e.preventDefault();
      fireEl.setPointerCapture?.(e.pointerId);
      const r = fireEl.getBoundingClientRect();
      this.fireTouch = { id: e.pointerId, cx: r.left + r.width / 2, cy: r.top + r.height / 2, angle: null };
      fireEl.classList.add('down');
      this.onAction('fireDown');
    });
    this.on(fireEl, 'pointermove', e => {
      const f = this.fireTouch;
      if (!f || e.pointerId !== f.id) return;
      const dx = e.clientX - f.cx, dy = e.clientY - f.cy;
      const dead = 16 / clamp(this.settings.sensitivity, 0.5, 2);
      f.angle = Math.hypot(dx, dy) > dead ? Math.atan2(dy, dx) : f.angle;
    });
    const endFire = e => {
      if (!this.fireTouch || e.pointerId !== this.fireTouch.id) return;
      this.fireTouch = null;
      fireEl.classList.remove('down');
    };
    this.on(fireEl, 'pointerup', endFire);
    this.on(fireEl, 'pointercancel', endFire);

    // --- keyboard + mouse ---
    this.on(window, 'keydown', e => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT')) return;
      const k = e.key.toLowerCase();
      this.keys.add(k);
      if (k === '1') this.onAction('switch', 0);
      else if (k === '2') this.onAction('switch', 1);
      else if (k === 'e') this.onAction('pickup');
      else if (k === 'q') this.onAction('heal');
      else if (k === 'f' || k === 'g') this.onAction('util');
      else if (k === 'r') this.onAction('reload');
      else if (k === 't' || k === 'b') this.onAction('emote');
      else if (k === 'm') this.onAction('map');
      else if (k === 'escape' || k === 'p') this.onAction('pause');
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(k)) e.preventDefault();
    });
    this.on(window, 'keyup', e => this.keys.delete(e.key.toLowerCase()));
    this.on(window, 'blur', () => { this.keys.clear(); this.mouse.down = false; });
    this.on(canvas, 'pointerdown', e => {
      if (e.pointerType !== 'mouse') return;
      this.mouse.down = e.button === 0; this.mouse.active = true;
      this.mouse.x = e.clientX; this.mouse.y = e.clientY;
    });
    this.on(window, 'pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      this.mouse.x = e.clientX; this.mouse.y = e.clientY; this.mouse.active = true;
    });
    this.on(window, 'pointerup', e => { if (e.pointerType === 'mouse' && e.button === 0) this.mouse.down = false; });
    this.on(canvas, 'contextmenu', e => e.preventDefault());
  }

  unbind() {
    for (const off of this._offs) off();
    this._offs = [];
    this.enabled = false;
    this.joy = null; this.fireTouch = null; this.keys.clear();
    this.move.x = this.move.y = 0; this.mouse.down = false;
  }

  placeFixedJoystick() {
    const { joyZone, joyEl } = this.els || {};
    if (!joyZone) return;
    const r = joyZone.getBoundingClientRect();
    const s = this.settings.joystickSize;
    this.fixedX = Math.min(r.width - 80 * s, Math.max(30 + 75 * s, 100 * s * (this.settings.joystickX ?? 1)));
    this.fixedY = Math.max(80 * s, r.height - 110 * s * (this.settings.joystickY ?? 1));
    joyEl.style.left = this.fixedX + 'px'; joyEl.style.top = this.fixedY + 'px';
  }

  _updateJoy() {
    const j = this.joy;
    const R = 75 * this.settings.joystickSize;
    let dx = j.x - j.bx, dy = j.y - j.by;
    const len = Math.hypot(dx, dy);
    // Floating mode: drag past the rim and the base follows the thumb.
    if (this.settings.joystickMode !== 'fixed' && len > R * 1.25) {
      const k = (len - R * 1.25) / len;
      j.bx += dx * k; j.by += dy * k;
      const r = this.els.joyZone.getBoundingClientRect();
      this.els.joyEl.style.left = (j.bx - r.left) + 'px'; this.els.joyEl.style.top = (j.by - r.top) + 'px';
      dx = j.x - j.bx; dy = j.y - j.by;
    }
    const l2 = Math.hypot(dx, dy);
    const vis = Math.min(l2, R);
    const nx = l2 ? dx / l2 : 0, ny = l2 ? dy / l2 : 0;
    this.els.thumbEl.style.transform = `translate(calc(-50% + ${nx * vis}px), calc(-50% + ${ny * vis}px))`;
    // Sensitivity: reach full speed with less thumb travel. Small deadzone.
    let m = clamp((l2 / R) * this.settings.sensitivity, 0, 1);
    m = m < 0.12 ? 0 : (m - 0.12) / 0.88;
    m = Math.min(1, m * 1.15);
    this.move.x = nx * m; this.move.y = ny * m;
  }

  /* Snapshot for MatchManager.update(). */
  read(match, camera) {
    let mx = this.move.x, my = this.move.y;
    const k = this.keys;
    const kx = (k.has('d') || k.has('arrowright') ? 1 : 0) - (k.has('a') || k.has('arrowleft') ? 1 : 0);
    const ky = (k.has('s') || k.has('arrowdown') ? 1 : 0) - (k.has('w') || k.has('arrowup') ? 1 : 0);
    if (kx || ky) { const l = Math.hypot(kx, ky); mx = kx / l; my = ky / l; }

    let aimAngle = null, fire = false;
    if (this.fireTouch) {
      fire = true;
      aimAngle = this.fireTouch.angle;
    } else if (this.mouse.active && match && camera) {
      const p = match.player;
      const [sx, sy] = camera.worldToScreen(p.x, p.y);
      aimAngle = Math.atan2(this.mouse.y - sy, this.mouse.x - sx);
      fire = this.mouse.down || k.has(' ');
    } else if (k.has(' ')) {
      fire = true;
    }
    return { mx, my, aimAngle, fire, aiming: aimAngle !== null, assist: this.settings.aimAssist };
  }
}
