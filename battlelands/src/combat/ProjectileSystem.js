/* Pooled projectiles. Each frame a shot sweeps the segment it travels and
   stops at the first wall or body it crosses, so fast bullets never tunnel
   through thin walls regardless of frame rate. */
import { Pool } from '../core/Pool.js';
import { CONFIG } from '../core/config.js';
import { segmentVsBodies, bodiesInRadius } from './HitDetection.js';

export class ProjectileSystem {
  constructor(match) {
    this.match = match;
    this.pool = new Pool(CONFIG.perf.maxProjectiles, () => ({}));
  }

  spawn(owner, weapon, x, y, angle) {
    const d = weapon.def;
    const p = this.pool.spawn();
    p.owner = owner; p.weapon = weapon;
    p.x = x; p.y = y; p.px = x; p.py = y;
    p.sx = x; p.sy = y;
    p.vx = Math.cos(angle) * d.projectileSpeed;
    p.vy = Math.sin(angle) * d.projectileSpeed;
    p.angle = angle;
    p.travel = 0;
    p.range = d.range;
    p.damage = weapon.damage;
    p.color = d.color;
    p.aoe = d.aoe || 0;
    p.size = d.aoe ? 9 : d.pellets ? 3.5 : weapon.id === 'longshot' ? 5 : 4.2;
    p.kind = weapon.id;
    return p;
  }

  update(dt) {
    const m = this.match;
    this.pool.forEach(p => {
      p.px = p.x; p.py = p.y;
      const nx = p.x + p.vx * dt, ny = p.y + p.vy * dt;
      const step = Math.hypot(nx - p.x, ny - p.y);
      const wallT = m.map.raycast(p.x, p.y, nx, ny, true);
      const hit = segmentVsBodies(m.entities, p.x, p.y, nx, ny, p.owner, 2);
      if (hit && hit.t <= wallT) {
        p.x += (nx - p.x) * hit.t; p.y += (ny - p.y) * hit.t;
        this._hitBody(p, hit.body);
        p.active = false;
        return;
      }
      if (wallT < 1) {
        p.x += (nx - p.x) * wallT; p.y += (ny - p.y) * wallT;
        if (p.aoe) this._explode(p);
        else m.bus.emit('impact', { x: p.x, y: p.y, color: p.color, angle: p.angle });
        p.active = false;
        return;
      }
      p.x = nx; p.y = ny;
      p.travel += step;
      if (p.travel >= p.range) {
        if (p.aoe) this._explode(p);
        p.active = false;
      }
    });
  }

  _hitBody(p, body) {
    const m = this.match;
    if (p.aoe) { this._explode(p); return; }
    const d = p.weapon.def;
    let dmg = p.damage;
    let crit = false;
    const traveled = p.travel;
    if (d.falloff) dmg *= traveled < d.range * 0.45 ? 1 : 1 - 0.55 * ((traveled - d.range * 0.45) / (d.range * 0.55));
    if (d.closeBonus && traveled < 140) dmg *= d.closeBonus;
    if (d.longCrit && traveled > d.longCrit) crit = true;
    const sp = Math.hypot(p.vx, p.vy) || 1;
    m.damage.applyDamage(body, dmg, p.owner, {
      weapon: p.weapon, crit, dirX: p.vx / sp, dirY: p.vy / sp,
      knock: d.pellets ? 60 : p.weapon.id === 'longshot' ? 260 : 90,
    });
    m.bus.emit('impact', { x: p.x, y: p.y, color: p.color, angle: p.angle, body: true });
  }

  _explode(p) {
    const m = this.match;
    const r = p.aoe;
    bodiesInRadius(m.entities, p.x, p.y, r, (b, d) => {
      if (!m.map.hasLineOfSight(p.x, p.y, b.x, b.y)) return;
      const f = 1 - Math.min(1, d / (r + b.radius)) * 0.6;
      const dx = b.x - p.x, dy = b.y - p.y, l = Math.hypot(dx, dy) || 1;
      m.damage.applyDamage(b, p.damage * f * (b === p.owner ? 0.4 : 1), p.owner, { weapon: p.weapon, dirX: dx / l, dirY: dy / l, knock: 380, kind: 'blast' });
    });
    m.bus.emit('explosion', { x: p.x, y: p.y, r, color: p.color });
  }

  clear() { this.pool.clear(); }
}
