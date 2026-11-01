// Keyboard + mouse and touch (virtual joysticks, buttons) into one intent.

export class Input {
  constructor(canvas) {
    this.canvas = canvas;
    this.keys = new Set();
    this.edges = new Set();
    this.mouse = { x: innerWidth / 2, y: innerHeight / 2, down: false, inside: true };
    this.wheel = 0;
    this.touchMode = matchMedia('(pointer: coarse)').matches;
    this.move = { id: null, ox: 0, oy: 0, x: 0, y: 0 };
    this.aim = { id: null, ox: 0, oy: 0, x: 0, y: 0, mag: 0, angle: 0 };
    this.fireBtn = false;
    this.lastTouchAngle = 0;
    this.enabled = false;

    addEventListener('keydown', (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT')) return;
      const k = e.key.toLowerCase();
      if (!this.keys.has(k)) this.edges.add(k);
      this.keys.add(k);
      if (this.enabled && [' ', 'tab'].includes(k)) e.preventDefault();
    });
    addEventListener('keyup', (e) => this.keys.delete(e.key.toLowerCase()));
    addEventListener('blur', () => { this.keys.clear(); this.mouse.down = false; });
    canvas.addEventListener('mousemove', (e) => { this.mouse.x = e.clientX; this.mouse.y = e.clientY; });
    addEventListener('mousemove', (e) => { this.mouse.x = e.clientX; this.mouse.y = e.clientY; });
    canvas.addEventListener('mousedown', (e) => { if (e.button === 0) this.mouse.down = true; this.touchMode = false; this.onMode && this.onMode(); });
    addEventListener('mouseup', (e) => { if (e.button === 0) this.mouse.down = false; });
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    canvas.addEventListener('wheel', (e) => { this.wheel += Math.sign(e.deltaY); e.preventDefault(); }, { passive: false });

    // touch joysticks live on a transparent layer above the canvas
    const layer = document.getElementById('touch-layer');
    layer.addEventListener('touchstart', (e) => this.touchStart(e), { passive: false });
    layer.addEventListener('touchmove', (e) => this.touchMove(e), { passive: false });
    layer.addEventListener('touchend', (e) => this.touchEnd(e), { passive: false });
    layer.addEventListener('touchcancel', (e) => this.touchEnd(e), { passive: false });
    addEventListener('touchstart', () => { if (!this.touchMode) { this.touchMode = true; this.onMode && this.onMode(); } }, { passive: true });

    // touch buttons
    document.querySelectorAll('[data-act]').forEach((b) => {
      const act = b.dataset.act;
      const down = (e) => {
        e.preventDefault(); e.stopPropagation();
        if (act === 'fire') this.fireBtn = true;
        else this.edges.add('act:' + act);
        b.classList.add('pressed');
      };
      const up = (e) => {
        e.preventDefault();
        if (act === 'fire') this.fireBtn = false;
        b.classList.remove('pressed');
      };
      b.addEventListener('touchstart', down, { passive: false });
      b.addEventListener('touchend', up, { passive: false });
      b.addEventListener('touchcancel', up, { passive: false });
      b.addEventListener('mousedown', down);
      b.addEventListener('mouseup', up);
      b.addEventListener('mouseleave', up);
    });
  }

  touchStart(e) {
    e.preventDefault();
    for (const t of e.changedTouches) {
      const left = t.clientX < innerWidth / 2;
      const s = left ? this.move : this.aim;
      if (s.id !== null) continue;
      s.id = t.identifier; s.ox = t.clientX; s.oy = t.clientY; s.x = 0; s.y = 0;
      this.drawStick(left ? 'move' : 'aim', s, true);
    }
  }
  touchMove(e) {
    e.preventDefault();
    for (const t of e.changedTouches) {
      for (const [name, s] of [['move', this.move], ['aim', this.aim]]) {
        if (s.id !== t.identifier) continue;
        const R = 55;
        let dx = t.clientX - s.ox, dy = t.clientY - s.oy;
        const l = Math.hypot(dx, dy);
        if (l > R) { dx *= R / l; dy *= R / l; }
        s.x = dx / R; s.y = dy / R;
        if (name === 'aim') { s.mag = Math.hypot(s.x, s.y); if (s.mag > 0.2) s.angle = Math.atan2(s.x, s.y); }
        this.drawStick(name, s, true);
      }
    }
  }
  touchEnd(e) {
    for (const t of e.changedTouches) {
      for (const [name, s] of [['move', this.move], ['aim', this.aim]]) {
        if (s.id !== t.identifier) continue;
        s.id = null; s.x = 0; s.y = 0; s.mag = 0;
        this.drawStick(name, s, false);
      }
    }
  }
  drawStick(name, s, on) {
    const base = document.getElementById('stick-' + name);
    if (!base) return;
    base.classList.toggle('active', on);
    if (on) { base.style.left = s.ox + 'px'; base.style.top = s.oy + 'px'; }
    base.querySelector('.knob').style.transform = `translate(${s.x * 55}px, ${s.y * 55}px)`;
  }

  pressed(k) { return this.edges.has(k); }
  endFrame() { this.edges.clear(); this.wheel = 0; }

  // Build the player's intent. aimAt(mx,my) -> {x,z} world point under cursor.
  // autoAim(range) -> enemy fighter or null (touch fire button).
  intent(player, aimAt, autoAim, camYaw = 0) {
    const k = this.keys;
    const it = { mx: 0, mz: 0, aimX: player.x, aimZ: player.z + 1, fire: false };
    if (k.has('w') || k.has('arrowup')) it.mz -= 1;
    if (k.has('s') || k.has('arrowdown')) it.mz += 1;
    if (k.has('a') || k.has('arrowleft')) it.mx -= 1;
    if (k.has('d') || k.has('arrowright')) it.mx += 1;
    if (this.move.id !== null) { it.mx += this.move.x; it.mz += this.move.y; }

    if (this.touchMode) {
      let a = this.lastTouchAngle;
      let fire = false;
      if (this.aim.id !== null && this.aim.mag > 0.2) { a = this.aim.angle; fire = this.aim.mag > 0.55; }
      else if (this.fireBtn) {
        const t = autoAim();
        if (t) a = Math.atan2(t.x - player.x, t.z - player.z);
        fire = true;
      } else if (Math.hypot(it.mx, it.mz) > 0.2) a = Math.atan2(it.mx, it.mz);
      this.lastTouchAngle = a;
      it.aimX = player.x + Math.sin(a) * 10; it.aimZ = player.z + Math.cos(a) * 10;
      it.fire = fire;
    } else {
      const p = aimAt(this.mouse.x, this.mouse.y);
      if (p) { it.aimX = p.x; it.aimZ = p.z; }
      it.fire = this.mouse.down;
    }
    it.reload = this.pressed('r') || this.pressed('act:reload');
    it.pickupKey = this.pressed('e') || this.pressed('act:pickup');
    it.heal = this.pressed('q') || this.pressed('act:heal');
    it.grenade = this.pressed('g') || this.pressed('act:grenade');
    it.soda = this.pressed('c') || this.pressed('act:soda');
    it.jump = this.pressed(' ') || this.pressed('act:jump') || (this.mouse.down && player.state === 'plane');
    it.slot = -1;
    for (let i = 1; i <= 4; i++) if (this.pressed(String(i)) || this.pressed('act:slot' + i)) it.slot = i - 1;
    if (this.wheel && player.state === 'alive' && (k.has('shift'))) {
      it.slot = (player.active + (this.wheel > 0 ? 1 : 3)) % 4;
    }
    return it;
  }
}
