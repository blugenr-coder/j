/* Puts the junkyard on screen.

   The world is rendered into cached layer canvases once (and again only if
   the window changes size a lot). Each frame then composites those layers
   with a slow camera drift — each layer moved in proportion to its depth —
   and draws the moving atmosphere between them. */

import { DESIGN_W as W, DESIGN_H as H, fitCover } from '../core/viewport.js';
import { createRng } from '../core/rng.js';
import { Atmosphere } from './atmosphere.js';
import { PARALLAX } from './junkyard.js';

const PAD = 64;               // overscan around the design frame, in design px
const MAX_RENDER_SCALE = 1.5; // layer resolution cap: 2880 px wide is plenty for flat-shaded art
const GROUND_FEATHER = 10;    // px over which a nearer ground strip fades in

export class SceneView {
  constructor(canvas, world, { reducedMotion = false } = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.world = world;
    this.reducedMotion = reducedMotion;
    this.layers = new Map();
    this.renderScale = 0;
    this.atmo = new Atmosphere(world, createRng(99), { W, H, pad: PAD, reducedMotion });
    this.time = 0;
    this.revealed = false;
  }

  /* ---------- building (called by loading tasks) ---------- */

  #canvasForScale(scale) {
    const c = document.createElement('canvas');
    c.width = Math.ceil((W + PAD * 2) * scale);
    c.height = Math.ceil((H + PAD * 2) * scale);
    const ctx = c.getContext('2d');
    ctx.setTransform(scale, 0, 0, scale, PAD * scale, PAD * scale);
    return { c, ctx };
  }

  buildGround() {
    const { c, ctx } = this.#canvasForScale(this.renderScale);
    this.world.paintGround(ctx, W, H, PAD);
    this.ground = c;
  }

  buildLayer(id) {
    const spec = this.world.layers.find((l) => l.id === id);
    const s = this.renderScale;
    const { c, ctx } = this.#canvasForScale(s);
    if (spec.ground && this.ground) {
      /* Copy this layer's strip of floor, feathering its top edge in thin
         slices so the seam with the layer behind never shows as a line. */
      const top = spec.ground.fromY;
      const copy = (y0, y1, alpha) => {
        const sy = (y0 + PAD) * s, sh = (y1 - y0) * s;
        if (sh <= 0) return;
        ctx.globalAlpha = alpha;
        ctx.drawImage(this.ground, 0, sy, this.ground.width, sh, -PAD, y0, W + PAD * 2, y1 - y0);
      };
      const steps = 5, step = GROUND_FEATHER / steps;
      for (let i = 0; i < steps; i++) copy(top - GROUND_FEATHER + i * step, top - GROUND_FEATHER + (i + 1) * step, (i + 1) / (steps + 1));
      copy(top, H + PAD, 1);
      ctx.globalAlpha = 1;
    }
    spec.paint(ctx, W, H, PAD);
    this.layers.set(id, { canvas: c, parallax: spec.parallax });
  }

  prepareAtmosphere() { this.atmo.prepare(); }

  /** Rebuilds every layer at the current resolution — after a big resize. */
  rebuildAll() {
    this.buildGround();
    for (const l of this.world.layers) this.buildLayer(l.id);
  }

  /* ---------- sizing ---------- */

  resize(w, h) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    this.fit = fitCover(w, h);
    this.dpr = dpr;
    const wanted = Math.min(MAX_RENDER_SCALE, Math.max(0.5, this.fit.scale * dpr));
    if (!this.renderScale) { this.renderScale = wanted; return; }
    /* Re-render only when the change would visibly soften or waste detail;
       until then the existing layers are simply scaled. */
    const ratio = wanted / this.renderScale;
    if (this.layers.size && (ratio > 1.25 || ratio < 0.6)) {
      clearTimeout(this.rebuildTimer);
      this.rebuildTimer = setTimeout(() => { this.renderScale = wanted; this.rebuildAll(); }, 300);
    }
  }

  /* ---------- running ---------- */

  start() {
    let last = performance.now();
    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      this.time += dt;
      this.draw(dt);
      this.raf = requestAnimationFrame(frame);
    };
    this.raf = requestAnimationFrame(frame);
  }

  reveal() {
    this.revealed = true;
    this.canvas.classList.add('is-ready');
  }

  /** Camera drift: a slow figure-of-eight pan with a gentle breathing push-in.
      Returns the transform for a layer at the given parallax. */
  #cameraFor(parallax) {
    if (this.reducedMotion) return { x: 0, y: 0, s: 1 };
    const t = this.time;
    const x = Math.sin((t * Math.PI * 2) / 40) * 16;
    const y = Math.sin((t * Math.PI * 2) / 29 + 1) * 5;
    const zoom = 0.012 * (0.5 - 0.5 * Math.cos((t * Math.PI * 2) / 52));
    return { x: x * parallax, y: y * parallax, s: 1 + zoom * parallax };
  }

  #apply(parallax) {
    const { ctx, fit, dpr } = this;
    const cam = this.#cameraFor(parallax);
    const k = fit.scale * dpr;
    /* design space → screen, then scale about the frame centre */
    ctx.setTransform(k, 0, 0, k, fit.x * dpr, fit.y * dpr);
    ctx.translate(W / 2 + cam.x, H / 2 + cam.y);
    ctx.scale(cam.s, cam.s);
    ctx.translate(-W / 2, -H / 2);
  }

  #layer(id) {
    const l = this.layers.get(id);
    if (!l) return;
    this.#apply(l.parallax);
    this.ctx.drawImage(l.canvas, -PAD, -PAD, W + PAD * 2, H + PAD * 2);
  }

  draw(dt) {
    if (!this.revealed || !this.fit) return;
    const { ctx } = this;
    this.atmo.update(dt);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';

    this.#layer('sky');
    this.#apply(PARALLAX.sky);
    this.atmo.drawRays(ctx);

    this.#layer('far');
    this.#apply(PARALLAX.far);
    this.atmo.drawSmoke(ctx, 'far');
    this.atmo.drawLamps(ctx);
    this.atmo.drawHaze(ctx);

    this.#layer('mid');
    this.#apply(PARALLAX.mid);
    this.atmo.drawSmoke(ctx, 'mid');

    this.#layer('near');
    this.#apply(PARALLAX.near * 1.3);
    this.atmo.drawMotes(ctx);
  }
}
