/* Game feel: particles, floating numbers, shake, flashes. Everything is
   pooled and capped so a big fight can't tank the frame rate. The effects
   layer only listens to the match bus — gameplay never calls it directly. */
import { Pool } from '../core/Pool.js';
import { CONFIG } from '../core/config.js';
import { RARITY_INFO } from '../combat/WeaponManager.js';
import { itemName, itemColor } from '../world/LootManager.js';
import { characterById, trailById } from '../progression/Cosmetics.js';

export class Effects {
  constructor(camera, settings) {
    this.camera = camera;
    this.settings = settings;
    this.parts = new Pool(CONFIG.perf.maxParticles, () => ({}));
    this.floaters = new Pool(CONFIG.perf.maxFloaters, () => ({}));
    this.rings = new Pool(24, () => ({}));
    this.flashes = new Pool(40, () => ({}));
    this.trailT = 0;
    this.offs = [];
    this.onPlayerHit = null;
  }

  get quality() { return this.settings.graphics === 'low' ? 0.5 : 1; }

  attach(match) {
    this.detach();
    this.match = match;
    const b = match.bus, cam = this.camera;
    const near = (x, y, r = 700) => Math.abs(x - cam.x) < r && Math.abs(y - cam.y) < r;
    const P = () => match.player;
    this.offs = [
      b.on('shot', e => {
        if (!near(e.ent.x, e.ent.y)) return;
        if (e.weapon.def.melee) return;
        const f = this.flashes.spawn();
        f.x = e.x; f.y = e.y; f.a = e.angle; f.life = f.max = 0.06; f.color = e.weapon.def.color;
        f.size = e.weapon.def.pellets ? 16 : e.weapon.def.aoe ? 18 : 11;
        if (e.ent === P()) cam.addShake(e.weapon.def.pellets ? 3 : e.weapon.id === 'longshot' ? 4 : 0.8);
      }),
      b.on('impact', e => {
        if (!near(e.x, e.y)) return;
        this.burst(e.x, e.y, e.body ? '#FFFFFF' : e.color, e.body ? 5 : 4, 160, 0.25, 3, e.angle + Math.PI, 1.6);
      }),
      b.on('damage', e => {
        const p = P();
        if (e.kind === 'zone') {
          if (e.target === p) { this.text(p.x, p.y - 34, `-${e.amount}`, '#A78BFA', 18); this.onPlayerHit?.(e); }
          return;
        }
        if (e.source === p) {
          this.text(e.target.x + (Math.random() - 0.5) * 16, e.target.y - 30, String(e.amount), e.crit ? '#FFD43B' : e.armor ? '#7DD3FC' : '#FFFFFF', e.crit ? 26 : 20, e.crit);
          if (e.broke) this.text(e.target.x, e.target.y - 54, 'ARMOR BROKEN', '#7DD3FC', 14);
        }
        if (e.target === p) {
          this.text(p.x + (Math.random() - 0.5) * 16, p.y - 30, `-${e.amount}`, '#FF6B6B', 18);
          cam.addShake(Math.min(7, 2 + e.amount / 8));
          this.onPlayerHit?.(e);
        }
        if (near(e.target.x, e.target.y)) this.burst(e.target.x, e.target.y, e.armor ? '#60A5FA' : '#FFD43B', 4, 140, 0.3, 3.5);
      }),
      b.on('elimination', e => {
        const t = e.target;
        if (!near(t.x, t.y, 900)) return;
        const col = characterById(t.skin).body;
        this.burst(t.x, t.y, col, 18, 260, 0.7, 6, null, 1, 'star');
        this.burst(t.x, t.y, '#FFFFFF', 10, 200, 0.5, 4);
        this.ring(t.x, t.y, 70, '#FFFFFF', 0.35);
        if (e.killer === P()) { this.text(t.x, t.y - 44, 'ELIMINATED', '#FFD43B', 22, true); cam.addShake(5); }
      }),
      b.on('explosion', e => {
        if (!near(e.x, e.y, 900)) return;
        this.ring(e.x, e.y, e.r * 1.1, e.color, 0.4);
        this.burst(e.x, e.y, e.color, 22, 360, 0.55, 7);
        this.burst(e.x, e.y, '#FFFFFF', 10, 240, 0.35, 5);
        this.burst(e.x, e.y, 'rgba(71,85,105,0.6)', 10, 90, 1.0, 14, null, 0.6, 'smoke');
        const d = Math.hypot(e.x - cam.x, e.y - cam.y);
        cam.addShake(Math.max(0, 10 - d / 60));
      }),
      b.on('pickup', e => {
        if (e.ent !== P()) return;
        const it = e.item;
        this.text(e.ent.x, e.ent.y - 40, `+ ${itemName(it)}`, itemColor(it), 17, RARITY_INFO[it.rarity].rank >= 2);
        this.burst(it.x, it.y, itemColor(it), 10, 150, 0.4, 4, null, 1, 'star');
      }),
      b.on('healDone', e => {
        if (!near(e.ent.x, e.ent.y)) return;
        this.burst(e.ent.x, e.ent.y, e.key === 'shieldcell' ? '#60A5FA' : '#4ADE80', 12, 90, 0.7, 4, -Math.PI / 2, 0.8, 'plus');
        if (e.ent === P()) this.text(e.ent.x, e.ent.y - 40, e.key === 'shieldcell' ? 'ARMOR UP' : 'HEALED', e.key === 'shieldcell' ? '#60A5FA' : '#4ADE80', 17);
      }),
      b.on('landed', e => { if (near(e.ent.x, e.ent.y)) this.burst(e.ent.x, e.ent.y, 'rgba(203,213,225,0.8)', 10, 120, 0.5, 6, null, 1, 'smoke'); }),
      b.on('reloadStart', e => { if (e.ent === P()) this.text(e.ent.x, e.ent.y - 38, 'RELOADING', '#CBD5E1', 13); }),
      b.on('utility', e => { if (e.key === 'soda' && near(e.ent.x, e.ent.y)) this.burst(e.ent.x, e.ent.y, '#FFD43B', 14, 160, 0.5, 4, null, 1, 'star'); }),
      b.on('smoke', e => this.burst(e.x, e.y, 'rgba(226,232,240,0.7)', 14, 120, 1.2, 18, null, 0.4, 'smoke')),
    ];
  }

  detach() { for (const off of this.offs) off(); this.offs = []; this.parts.clear(); this.floaters.clear(); this.rings.clear(); this.flashes.clear(); }

  burst(x, y, color, n, speed, life, size, dir = null, spread = 1, kind = 'dot') {
    n = Math.max(1, Math.round(n * this.quality));
    for (let i = 0; i < n; i++) {
      const p = this.parts.spawn();
      const a = dir === null ? Math.random() * Math.PI * 2 : dir + (Math.random() - 0.5) * spread;
      const s = speed * (0.4 + Math.random() * 0.6);
      p.x = x; p.y = y; p.vx = Math.cos(a) * s; p.vy = Math.sin(a) * s;
      p.life = p.max = life * (0.6 + Math.random() * 0.5);
      p.size = size * (0.6 + Math.random() * 0.6); p.color = color; p.kind = kind;
      p.rot = Math.random() * 6;
    }
  }

  ring(x, y, r, color, life) {
    const g = this.rings.spawn();
    g.x = x; g.y = y; g.r = r; g.color = color; g.life = g.max = life;
  }

  text(x, y, str, color, size = 18, bold = false) {
    const f = this.floaters.spawn();
    f.x = x; f.y = y; f.str = str; f.color = color; f.size = size; f.bold = bold;
    f.life = f.max = 0.95; f.vy = -55;
  }

  update(dt, match) {
    this.parts.forEach(p => {
      p.life -= dt;
      if (p.life <= 0) { p.active = false; return; }
      const drag = p.kind === 'smoke' ? 2.5 : 5;
      p.vx -= p.vx * drag * dt; p.vy -= p.vy * drag * dt;
      p.x += p.vx * dt; p.y += p.vy * dt;
      p.rot += dt * 4;
    });
    this.floaters.forEach(f => { f.life -= dt; if (f.life <= 0) { f.active = false; return; } f.y += f.vy * dt; f.vy *= 1 - 2.2 * dt; });
    this.rings.forEach(g => { g.life -= dt; if (g.life <= 0) g.active = false; });
    this.flashes.forEach(f => { f.life -= dt; if (f.life <= 0) f.active = false; });

    // Movement trail for the human (cosmetic).
    const p = match && match.player;
    if (p && p.alive && !p.airborne && p.moving && p.trail && p.trail !== 'none' && !p.inBush) {
      this.trailT -= dt;
      if (this.trailT <= 0) {
        this.trailT = 0.05;
        const t = trailById(p.trail);
        const color = t.color === 'rainbow' ? `hsl(${(match.time * 360) % 360},90%,65%)` : t.color;
        const q = this.parts.spawn();
        q.x = p.x - Math.cos(p.moveAngle) * 14 + (Math.random() - 0.5) * 8; q.y = p.y - Math.sin(p.moveAngle) * 14 + (Math.random() - 0.5) * 8;
        q.vx = 0; q.vy = 0; q.life = q.max = 0.5; q.size = p.trail === 'dust' ? 6 : 5; q.color = color;
        q.kind = p.trail === 'hearts' ? 'heart' : p.trail === 'sparks' ? 'star' : p.trail === 'dust' ? 'smoke' : 'dot'; q.rot = 0;
      }
    }
  }

  /* World space (camera transform already applied). */
  draw(ctx) {
    this.rings.forEach(g => {
      const t = 1 - g.life / g.max;
      ctx.globalAlpha = (1 - t) * 0.9;
      ctx.strokeStyle = g.color; ctx.lineWidth = 6 * (1 - t) + 1;
      ctx.beginPath(); ctx.arc(g.x, g.y, g.r * (0.3 + t * 0.7), 0, Math.PI * 2); ctx.stroke();
    });
    this.flashes.forEach(f => {
      ctx.globalAlpha = f.life / f.max;
      ctx.save(); ctx.translate(f.x, f.y); ctx.rotate(f.a);
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath(); ctx.ellipse(f.size * 0.6, 0, f.size, f.size * 0.45, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = f.color;
      ctx.beginPath(); ctx.ellipse(f.size * 0.5, 0, f.size * 0.6, f.size * 0.28, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    });
    this.parts.forEach(p => {
      const t = p.life / p.max;
      ctx.globalAlpha = p.kind === 'smoke' ? t * 0.6 : Math.min(1, t * 1.6);
      ctx.fillStyle = p.color;
      const s = p.kind === 'smoke' ? p.size * (1.6 - t * 0.6) : p.size * (0.5 + t * 0.5);
      if (p.kind === 'star') drawStar(ctx, p.x, p.y, s, p.rot);
      else if (p.kind === 'plus') { ctx.fillRect(p.x - s, p.y - s * 0.3, s * 2, s * 0.6); ctx.fillRect(p.x - s * 0.3, p.y - s, s * 0.6, s * 2); }
      else if (p.kind === 'heart') drawHeart(ctx, p.x, p.y, s);
      else { ctx.beginPath(); ctx.arc(p.x, p.y, s, 0, Math.PI * 2); ctx.fill(); }
    });
    ctx.globalAlpha = 1;
  }

  /* Screen space: floating text stays crisp regardless of zoom. */
  drawText(ctx, camera, dpr, scale = 1) {
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    this.floaters.forEach(f => {
      const t = f.life / f.max;
      const [sx, sy] = camera.worldToScreen(f.x, f.y);
      const pop = t > 0.85 ? 1 + (t - 0.85) * 3 : 1;
      ctx.globalAlpha = Math.min(1, t * 2.5);
      const size = f.size * pop * scale;
      ctx.font = `900 ${size * dpr}px Nunito, "Arial Rounded MT Bold", Arial, sans-serif`;
      ctx.lineWidth = 4 * dpr; ctx.strokeStyle = 'rgba(16,22,42,0.9)'; ctx.lineJoin = 'round';
      ctx.strokeText(f.str, sx * dpr, sy * dpr);
      ctx.fillStyle = f.color; ctx.fillText(f.str, sx * dpr, sy * dpr);
    });
    ctx.globalAlpha = 1;
  }
}

function drawStar(ctx, x, y, r, rot) {
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = rot + (i * Math.PI) / 4, rr = i % 2 ? r * 0.4 : r;
    ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
  }
  ctx.closePath(); ctx.fill();
}

function drawHeart(ctx, x, y, s) {
  ctx.beginPath();
  ctx.moveTo(x, y + s * 0.8);
  ctx.bezierCurveTo(x - s * 1.4, y - s * 0.2, x - s * 0.6, y - s * 1.2, x, y - s * 0.4);
  ctx.bezierCurveTo(x + s * 0.6, y - s * 1.2, x + s * 1.4, y - s * 0.2, x, y + s * 0.8);
  ctx.fill();
}
