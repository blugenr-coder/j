// Unified input: keyboard + mouse (pointer lock) on desktop, twin-zone touch on mobile.
export const isTouch = matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;

export const Input = {
  keys: new Set(), pressed: new Set(),
  move: { x: 0, y: 0 },       // -1..1 strafe / forward
  look: { x: 0, y: 0 },       // accumulated pixels since last frame
  locked: false,
  enabled: true,
  stick: null, lookTouch: null,

  init(canvas) {
    addEventListener('keydown', e => {
      if (e.target.closest && e.target.closest('input,textarea')) return;
      if (!this.keys.has(e.code)) this.pressed.add(e.code);
      this.keys.add(e.code);
      if (['Space', 'ArrowUp', 'ArrowDown'].includes(e.code)) e.preventDefault();
    });
    addEventListener('keyup', e => this.keys.delete(e.code));
    addEventListener('blur', () => this.keys.clear());
    addEventListener('mousemove', e => { if (this.locked) { this.look.x += e.movementX; this.look.y += e.movementY; } });
    canvas.addEventListener('mousedown', e => {
      if (isTouch) return;
      if (!this.locked && this.wantLock) { canvas.requestPointerLock?.(); return; }
      if (this.locked) this.pressed.add(e.button === 2 ? 'Mouse2' : 'Mouse0');
    });
    canvas.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('pointerlockchange', () => { this.locked = document.pointerLockElement === canvas; this.onLock?.(this.locked); });

    // touch: left half = movement stick, right half = look
    const stickEl = document.getElementById('stick'), knob = document.getElementById('knob');
    canvas.addEventListener('touchstart', e => {
      for (const t of e.changedTouches) {
        if (t.clientX < innerWidth * 0.45 && !this.stick && this.mode === 'hangar') {
          this.stick = { id: t.identifier, x: t.clientX, y: t.clientY };
          stickEl.style.left = t.clientX + 'px'; stickEl.style.top = t.clientY + 'px'; stickEl.classList.add('on');
        } else if (!this.lookTouch) this.lookTouch = { id: t.identifier, x: t.clientX, y: t.clientY };
      }
      e.preventDefault();
    }, { passive: false });
    canvas.addEventListener('touchmove', e => {
      for (const t of e.changedTouches) {
        if (this.stick && t.identifier === this.stick.id) {
          let dx = t.clientX - this.stick.x, dy = t.clientY - this.stick.y;
          const l = Math.hypot(dx, dy), m = 55; if (l > m) { dx *= m / l; dy *= m / l; }
          this.move.x = dx / m; this.move.y = -dy / m;
          knob.style.transform = `translate(${dx}px,${dy}px)`;
        } else if (this.lookTouch && t.identifier === this.lookTouch.id) {
          this.look.x += (t.clientX - this.lookTouch.x) * 1.6; this.look.y += (t.clientY - this.lookTouch.y) * 1.6;
          this.lookTouch.x = t.clientX; this.lookTouch.y = t.clientY;
        }
      }
      e.preventDefault();
    }, { passive: false });
    const end = e => {
      for (const t of e.changedTouches) {
        if (this.stick && t.identifier === this.stick.id) { this.stick = null; this.move.x = this.move.y = 0; knob.style.transform = ''; stickEl.classList.remove('on'); }
        if (this.lookTouch && t.identifier === this.lookTouch.id) this.lookTouch = null;
      }
    };
    canvas.addEventListener('touchend', end); canvas.addEventListener('touchcancel', end);
  },
  axis() {
    if (isTouch) return this.move;
    const k = this.keys;
    return { x: (k.has('KeyD') || k.has('ArrowRight') ? 1 : 0) - (k.has('KeyA') || k.has('ArrowLeft') ? 1 : 0), y: (k.has('KeyW') || k.has('ArrowUp') ? 1 : 0) - (k.has('KeyS') || k.has('ArrowDown') ? 1 : 0) };
  },
  hit(code) { return this.pressed.has(code); },
  endFrame() { this.pressed.clear(); this.look.x = this.look.y = 0; },
  release() { if (document.pointerLockElement) document.exitPointerLock(); },
};
