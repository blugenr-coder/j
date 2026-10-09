/* Things that move: dust in the air, smoke off the burning heaps, dust kicked
   up in the arena, the floodlight bloom and the sun's rays.

   Everything is drawn from a handful of small pre-rendered sprites, so a
   frame costs a few hundred drawImage calls and nothing else. The amounts
   are kept low on purpose — this is a backdrop for a logo, not a show. */

import { SUN } from './backdrop.js';

function sprite(size, paint) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  paint(c.getContext('2d'), size);
  return c;
}

function softDisc(rgbStr, stops = [[0, 1], [0.45, 0.55], [1, 0]]) {
  return sprite(64, (ctx, s) => {
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    for (const [at, a] of stops) g.addColorStop(at, `rgba(${rgbStr},${a})`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  });
}

/* A smoke puff is several overlapping soft blobs, so it has a lumpy edge
   instead of a perfect circle. */
function puff(rgbStr, rng) {
  return sprite(128, (ctx, s) => {
    for (let i = 0; i < 9; i++) {
      const x = s / 2 + rng.range(-1, 1) * s * 0.18, y = s / 2 + rng.range(-1, 1) * s * 0.14;
      const r = s * rng.range(0.22, 0.36);
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(${rgbStr},0.42)`);
      g.addColorStop(1, `rgba(${rgbStr},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, s, s);
    }
  });
}

function rays(rng) {
  return sprite(1024, (ctx, s) => {
    ctx.translate(s / 2, s / 2);
    for (let i = 0; i < 14; i++) {
      const a = rng.range(0, Math.PI * 2), w = rng.range(0.03, 0.09);
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, s / 2);
      g.addColorStop(0, 'rgba(255,225,170,0.55)');
      g.addColorStop(1, 'rgba(255,200,140,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, s / 2, a - w, a + w);
      ctx.closePath();
      ctx.fill();
    }
  });
}

export class Atmosphere {
  constructor(world, rng, { W, H, pad, reducedMotion }) {
    this.world = world;
    this.rng = rng;
    this.W = W; this.H = H; this.pad = pad;
    this.speed = reducedMotion ? 0.25 : 1;
    this.t = 0;
  }

  /** Builds sprites and seeds particles. Part of the loading work. */
  prepare() {
    const rng = this.rng;
    this.sprites = {
      mote: softDisc('255,232,196'),
      bokeh: softDisc('255,214,160', [[0, 0.5], [0.7, 0.35], [1, 0]]),
      glow: softDisc('255,236,180', [[0, 1], [0.2, 0.6], [1, 0]]),
      smokeDark: puff('92,70,58', rng),
      smokeDust: puff('214,150,98', rng),
      rays: rays(rng)
    };

    const { W, H, pad } = this;
    this.motes = Array.from({ length: 110 }, () => ({
      x: rng.range(-pad, W + pad), y: rng.range(H * 0.25, H + pad),
      depth: rng.range(0.4, 1.4), phase: rng.range(0, Math.PI * 2), a: rng.range(0.2, 0.55)
    }));
    this.bokeh = Array.from({ length: 7 }, () => ({
      x: rng.range(0, W), y: rng.range(H * 0.45, H), r: rng.range(18, 46),
      phase: rng.range(0, Math.PI * 2), a: rng.range(0.05, 0.11)
    }));

    const cam = this.world.camera;
    this.emitters = this.world.smoke.map((e) => {
      const s = cam.project(e.pos);
      return { ...e, sx: s[0], sy: s[1], scale: (cam.focal / s[2]) * 0.9 * e.size, acc: 0, puffs: [] };
    });
    this.lamps = this.world.lamps.map((p) => {
      const s = cam.project(p);
      return { x: s[0], y: s[1], r: Math.max(10, 0.95 * cam.focal / s[2]), phase: rng.range(0, 6) };
    });

    /* Pre-warm so the smoke is already rising when the scene fades in. */
    for (let i = 0; i < 240; i++) this.update(0.05);
  }

  update(dt) {
    dt *= this.speed;
    this.t += dt;
    const { W, H, pad, rng } = this;
    for (const m of this.motes) {
      m.x += (6 + 12 * m.depth) * dt;
      m.y += (Math.sin(this.t * 0.4 + m.phase) * 4 - 2.5 * m.depth) * dt;
      if (m.x > W + pad) m.x = -pad;
      if (m.y < H * 0.2) m.y = H + pad;
    }
    for (const e of this.emitters) {
      e.acc += dt * e.rate;
      while (e.acc >= 1) {
        e.acc -= 1;
        e.puffs.push({
          x: e.sx + rng.range(-0.6, 0.6) * e.scale, y: e.sy, age: 0,
          life: rng.range(9, 14), rot: rng.range(0, 6.28), spin: rng.range(-0.08, 0.08),
          vx: rng.range(0.3, 0.7) * e.scale, vy: -rng.range(0.25, 0.45) * e.scale * (e.tint === 'dust' ? 0.35 : 1)
        });
      }
      for (const p of e.puffs) {
        p.age += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.spin * dt;
      }
      e.puffs = e.puffs.filter((p) => p.age < p.life);
    }
  }

  /** Sun rays, behind everything that stands on the ground. */
  drawRays(ctx) {
    const s = this.sprites.rays, size = 1500;
    const breathe = 0.55 + 0.2 * Math.sin(this.t * 0.25);
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = 0.2 * breathe;
    ctx.translate(SUN.x, SUN.y);
    ctx.rotate(this.t * 0.004);
    ctx.drawImage(s, -size / 2, -size / 2, size, size);
    ctx.restore();
  }

  drawSmoke(ctx, band) {
    for (const e of this.emitters) {
      if (e.band !== band) continue;
      const img = e.tint === 'dust' ? this.sprites.smokeDust : this.sprites.smokeDark;
      for (const p of e.puffs) {
        const k = p.age / p.life;
        const alpha = Math.min(1, p.age / 1.5) * (1 - k) * (e.tint === 'dust' ? 0.55 : 0.7);
        const r = e.scale * (0.8 + k * 3.2);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.drawImage(img, -r, -r, r * 2, r * 2);
        ctx.restore();
      }
    }
  }

  /** Floodlight bloom with the faintest flicker. */
  drawLamps(ctx) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const l of this.lamps) {
      const f = 0.85 + 0.08 * Math.sin(this.t * 3.1 + l.phase) + 0.04 * Math.sin(this.t * 7.3 + l.phase * 2);
      ctx.globalAlpha = 0.3 * f;
      const r = l.r * 1.6;
      ctx.drawImage(this.sprites.glow, l.x - r, l.y - r, r * 2, r * 2);
    }
    ctx.restore();
  }

  /** A band of dust hanging over the far side of the arena. */
  drawHaze(ctx) {
    const hy = this.world.camera.horizonY;
    const drift = Math.sin(this.t * 0.05) * 60;
    ctx.save();
    for (let i = 0; i < 2; i++) {
      const y = hy + 30 + i * 70;
      const g = ctx.createLinearGradient(0, y - 90, 0, y + 90);
      g.addColorStop(0, 'rgba(240,170,110,0)');
      g.addColorStop(0.5, `rgba(240,170,110,${0.20 - i * 0.07 + 0.04 * Math.sin(this.t * 0.2 + i)})`);
      g.addColorStop(1, 'rgba(240,170,110,0)');
      ctx.fillStyle = g;
      ctx.fillRect(-this.pad + drift * (i ? -1 : 1), y - 90, this.W + this.pad * 2, 180);
    }
    ctx.restore();
  }

  /** Dust in front of everything. */
  drawMotes(ctx) {
    const img = this.sprites.mote;
    ctx.save();
    for (const m of this.motes) {
      const r = 1.2 + m.depth * 2.2;
      ctx.globalAlpha = m.a * (0.7 + 0.3 * Math.sin(this.t * 0.9 + m.phase));
      ctx.drawImage(img, m.x - r, m.y - r, r * 2, r * 2);
    }
    for (const b of this.bokeh) {
      ctx.globalAlpha = b.a * (0.6 + 0.4 * Math.sin(this.t * 0.3 + b.phase));
      const x = b.x + Math.sin(this.t * 0.07 + b.phase) * 40;
      const y = b.y + Math.cos(this.t * 0.05 + b.phase) * 20;
      ctx.drawImage(this.sprites.bokeh, x - b.r, y - b.r, b.r * 2, b.r * 2);
    }
    ctx.restore();
  }
}
