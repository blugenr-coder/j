/* Fixed high-angle camera. It never rotates; it follows the player with
   exponential smoothing, leads a little in the aim direction, shakes on
   impacts, and fakes depth by leaning tall things away from screen centre. */
import { CONFIG } from '../core/config.js';
import { damp, clamp } from '../core/math.js';

export class Camera {
  constructor() {
    const c = CONFIG.camera;
    this.cameraZoom = c.cameraZoom;
    this.cameraHeight = c.cameraHeight;
    this.cameraFollowSpeed = c.cameraFollowSpeed;
    this.cameraSmoothing = c.cameraSmoothing;
    this.cameraBoundary = c.cameraBoundary;
    this.x = CONFIG.map.size / 2; this.y = CONFIG.map.size / 2;
    this.leadX = 0; this.leadY = 0;
    this.zoomMul = 1;         // animated (deploy → ground)
    this.w = 1; this.h = 1; this.dpr = 1;
    this.ppu = 1;
    this.shake = 0; this.sx = 0; this.sy = 0;
  }

  resize(w, h, dpr) { this.w = w; this.h = h; this.dpr = dpr; this._ppu(); }

  _ppu() {
    this.ppu = (Math.sqrt(this.w * this.h) / CONFIG.camera.viewUnits) * this.cameraZoom * this.zoomMul;
    // Never show less than ~470 units across the short side (narrow phones),
    // or more than ~1500 across the long side (wide monitors).
    const short = Math.min(this.w, this.h), long = Math.max(this.w, this.h);
    this.ppu = Math.min(this.ppu, (short / 470) * this.zoomMul * this.cameraZoom);
    this.ppu = Math.max(this.ppu, (long / 1500) * this.zoomMul * this.cameraZoom);
  }

  setZoomMul(z) { this.zoomMul = z; this._ppu(); }

  snap(x, y) { this.x = x; this.y = y; this.leadX = this.leadY = 0; }

  follow(tx, ty, dt, aimX = 0, aimY = 0, reduceMotion = false) {
    const look = CONFIG.camera.lookAhead;
    const ls = damp(3 * (1.2 - this.cameraSmoothing), dt);
    this.leadX += (aimX * look - this.leadX) * ls;
    this.leadY += (aimY * look - this.leadY) * ls;
    const k = damp(this.cameraFollowSpeed * (1 - this.cameraSmoothing * 0.5), dt);
    this.x += (tx + this.leadX - this.x) * k;
    this.y += (ty + this.leadY - this.y) * k;
    this._bound();
    // Shake decays fast: a punch, not a wobble.
    this.shake = Math.max(0, this.shake - dt * 30);
    const s = reduceMotion ? 0 : this.shake;
    this.sx = (Math.random() * 2 - 1) * s;
    this.sy = (Math.random() * 2 - 1) * s;
  }

  _bound() {
    const S = CONFIG.map.size, b = this.cameraBoundary;
    const hw = this.w / 2 / this.ppu, hh = this.h / 2 / this.ppu;
    this.x = hw * 2 > S + 2 * b ? S / 2 : clamp(this.x, hw - b, S - hw + b);
    this.y = hh * 2 > S + 2 * b ? S / 2 : clamp(this.y, hh - b, S - hh + b);
  }

  addShake(a) { this.shake = Math.min(14, this.shake + a); }

  /* Canvas transform for world drawing (device pixels). */
  apply(ctx) {
    const k = this.ppu * this.dpr;
    ctx.setTransform(k, 0, 0, k, (this.w / 2 - (this.x + this.sx) * this.ppu) * this.dpr, (this.h / 2 - (this.y + this.sy) * this.ppu) * this.dpr);
  }

  worldToScreen(x, y) { return [(x - this.x) * this.ppu + this.w / 2, (y - this.y) * this.ppu + this.h / 2]; }
  screenToWorld(sx, sy) { return [(sx - this.w / 2) / this.ppu + this.x, (sy - this.h / 2) / this.ppu + this.y]; }

  view(margin = 0) {
    const hw = this.w / 2 / this.ppu + margin, hh = this.h / 2 / this.ppu + margin;
    return { x0: this.x - hw, y0: this.y - hh, x1: this.x + hw, y1: this.y + hh };
  }

  /* World-unit offset of the top of something `h` tall standing at (x, y). */
  lean(x, y, h) {
    const k = h * this.cameraHeight;
    return [(x - this.x) * k, (y - this.y) * k];
  }
}
