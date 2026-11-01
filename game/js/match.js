// One battle royale match: plane, drop, loot, combat, storm, eliminations,
// victory/defeat. Rendering helpers live in the modules it calls; this file is
// the rules.
import * as THREE from '../vendor/three.module.min.js';
import { Fighter, RADIUS } from './fighter.js';
import { BotBrain } from './ai.js';
import { LootManager, rollItem, rollWeapon, itemLabel } from './loot.js';
import { Zone } from './zone.js';
import { makePlane } from './models.js';
import { CHARACTERS, WEAPONS, AMMO, ITEMS, ARMOR_TIERS, botName, MODES } from './config.js';
import { segCircle } from './physics.js';
import { mulberry32, dist } from './util.js';
import { audio } from './audio.js';

const PLANE_Y = 48;

export class Match {
  constructor(ctx) {
    this.scene = ctx.scene;
    this.world = ctx.world;
    this.physics = ctx.world.physics;
    this.nav = ctx.nav;
    this.fx = ctx.fx;
    this.hud = ctx.hud;
    this.mode = MODES[ctx.mode] || MODES.classic;
    this.settings = ctx.settings;
    this.profile = ctx.profile;
    this.onEnd = ctx.onEnd;
    this.seed = (Math.random() * 1e9) | 0;
    this.rng = mulberry32(this.seed);
    this.now = 0;
    this.phase = 'plane';
    this.fighters = [];
    this.brains = new Map();
    this.bullets = [];
    this.grenades = [];
    this.loot = new LootManager(this.scene);
    this.zoneTickT = 0;
    this.ended = false;
    this.result = null;
    this.autoPickT = 0;

    this.world.resetCrates();
    this.fx.clear();
    this.spawnLoot();
    this.zone = new Zone(this.scene, this.mode.phases, this.rng);
    this.makePlane();
    this.makeFighters();
  }

  dispose() {
    this.disposed = true;
    for (const f of this.fighters) f.dispose();
    this.loot.clear();
    this.zone.dispose();
    this.scene.remove(this.plane.mesh);
    for (const g of this.grenades) this.scene.remove(g.mesh);
  }

  // ---------------------------------------------------------------- setup
  spawnLoot() {
    const rng = this.rng;
    const mul = this.mode.lootMul;
    for (const s of this.world.lootSpots) {
      if (rng() > Math.min(0.97, 0.86 * mul)) continue;
      const item = rollItem(rng, s.tier && rng() < 0.4 ? 1 : 0);
      this.loot.spawn(item, s.x, s.z);
      if (item.type === 'weapon') {
        const ammo = WEAPONS[item.id].ammo;
        this.loot.spawn({ type: 'ammo', id: ammo, amount: AMMO[ammo].pickup }, s.x + 1.1, s.z + 0.4);
      }
    }
  }

  makePlane() {
    const a = this.rng() * Math.PI * 2;
    const off = (this.rng() - 0.5) * 90;
    const px = -Math.sin(a) * off, pz = Math.cos(a) * off;
    const dx = Math.cos(a), dz = Math.sin(a);
    const sx = px - dx * 230, sz = pz - dz * 230;
    const mesh = makePlane();
    mesh.position.set(sx, PLANE_Y, sz);
    mesh.rotation.y = Math.atan2(dx, dz);
    this.scene.add(mesh);
    this.plane = { mesh, sx, sz, dx, dz, len: 460, speed: 30, progress: 0, x: sx, z: sz };
  }

  makeFighters() {
    const n = this.mode.players;
    const diff = this.settings.botDifficulty || 'normal';
    const pchar = CHARACTERS.find((c) => c.id === this.profile.character) || CHARACTERS[0];
    const player = new Fighter(this, { id: 0, name: this.profile.name || 'You', character: pchar, isPlayer: true });
    this.player = player;
    this.fighters.push(player);
    const used = new Set([player.name]);
    for (let i = 1; i < n; i++) {
      let name = botName(this.rng);
      while (used.has(name)) name = botName(this.rng);
      used.add(name);
      const base = CHARACTERS[Math.floor(this.rng() * CHARACTERS.length)];
      // tint bots so the lobby does not look like clones
      const shirtHue = Math.floor(this.rng() * 360);
      const character = { ...base, shirt: `hsl(${shirtHue},70%,55%)`, hatColor: `hsl(${(shirtHue + 160) % 360},75%,58%)` };
      const f = new Fighter(this, { id: i, name, character });
      this.fighters.push(f);
      let d = diff;
      if (diff === 'mixed') { const r = this.rng(); d = r < 0.4 ? 'easy' : r < 0.8 ? 'normal' : 'hard'; }
      this.brains.set(f, new BotBrain(f, this, d, mulberry32(this.seed + i * 977)));
    }
    for (const f of this.fighters) { f.x = this.plane.x; f.z = this.plane.z; }
  }

  get aliveCount() { let n = 0; for (const f of this.fighters) if (f.alive) n++; return n; }

  // ---------------------------------------------------------------- loop
  update(dt, playerIntent) {
    this.now += dt;
    const p = this.plane;
    if (p.progress < 1) {
      p.progress = Math.min(1, p.progress + (p.speed * dt) / p.len);
      p.x = p.sx + p.dx * p.len * p.progress;
      p.z = p.sz + p.dz * p.len * p.progress;
      p.mesh.position.set(p.x, PLANE_Y, p.z);
      p.mesh.children.forEach((c) => { if (c.name === 'prop') c.rotation.z += dt * 40; });
      if (p.progress >= 1) { p.mesh.visible = false; }
    }
    if (this.phase === 'plane' && p.progress > 0.02 && !this.zone.active) {
      this.phase = 'play';
    }
    if (!this.zone.active && p.progress >= 1) { this.zone.start(); this.hud.banner('The storm is forming!', 'Stay inside the white circle'); }

    // controllers
    for (const f of this.fighters) {
      if (!f.alive) continue;
      const it = f.isPlayer ? playerIntent : this.botIntent(f, dt);
      if (f.state === 'plane') this.updatePlane(f, it);
      else if (f.state === 'air') this.updateAir(f, it, dt);
      else {
        f.update(dt, it);
        if (it.pickup) this.pickup(f, it.pickup);
      }
    }
    this.separate();
    this.updateBullets(dt);
    this.updateGrenades(dt);
    this.updateZone(dt);
    this.autoPickT -= dt;
    if (this.autoPickT <= 0) { this.autoPickT = 0.2; this.autoPickup(); }
    this.loot.update(dt, this.camX ?? 0, this.camZ ?? 0, this.world);
    this.checkEnd();
  }

  updatePlane(f, it) {
    f.x = this.plane.x; f.z = this.plane.z; f.y = PLANE_Y;
    if ((it && it.jump && this.plane.progress > 0.02) || this.plane.progress >= 0.8) {
      // don't drop into the sea when forced out
      f.state = 'air';
      f.y = PLANE_Y - 3;
      f.vy = -16;
      f.chuteOpen = false;
      if (f.isPlayer) { audio.whoosh(); this.hud.banner('Skydiving!', 'Steer with WASD · land near loot'); }
    }
  }

  updateAir(f, it, dt) {
    const speed = f.chuteOpen ? 9 : 13;
    let mx = it.mx || 0, mz = it.mz || 0;
    const l = Math.hypot(mx, mz); if (l > 1) { mx /= l; mz /= l; }
    f.vx += (mx * speed - f.vx) * Math.min(1, dt * 3);
    f.vz += (mz * speed - f.vz) * Math.min(1, dt * 3);
    f.x += f.vx * dt; f.z += f.vz * dt;
    const r = Math.hypot(f.x, f.z);
    if (r > 175) { f.x *= 175 / r; f.z *= 175 / r; }
    if (!f.chuteOpen && f.y < 26) { f.chuteOpen = true; if (f.isPlayer) audio.chute(); }
    const vy = f.chuteOpen ? -6.5 : -17;
    f.y += vy * dt;
    if (Math.hypot(f.vx, f.vz) > 0.5) f.angle = Math.atan2(f.vx, f.vz);
    if (f.y <= 0) {
      f.y = 0;
      f.state = 'alive';
      f.vx = 0; f.vz = 0;
      if (!this.world.isWalkable(f.x, f.z) || !this.nav.isFree(f.x, f.z)) {
        let p = this.nav.nearestFree(f.x, f.z, 30);
        // still nothing (deep sea): walk the point toward the island centre
        for (let k = 0; k < 60 && !p; k++) {
          f.x *= 0.95; f.z *= 0.95;
          if (this.nav.isFree(f.x, f.z)) p = [f.x, f.z];
        }
        if (p) { f.x = p[0]; f.z = p[1]; }
      }
      this.fx.burst(f.x, 0.2, f.z, 10, '#e8e0cf', 3, 0.15, 0.6, -4);
      if (f.isPlayer) this.hud.banner('Landed!', 'Grab a weapon fast');
    }
  }

  separate() {
    const fs = this.fighters;
    for (let i = 0; i < fs.length; i++) {
      const a = fs[i];
      if (a.state !== 'alive') continue;
      for (let j = i + 1; j < fs.length; j++) {
        const b = fs[j];
        if (b.state !== 'alive') continue;
        const dx = b.x - a.x, dz = b.z - a.z, d2 = dx * dx + dz * dz;
        const min = RADIUS * 2;
        if (d2 < min * min && d2 > 1e-6) {
          const d = Math.sqrt(d2), push = (min - d) / 2;
          const nx = dx / d, nz = dz / d;
          const pa = { x: a.x - nx * push, z: a.z - nz * push }, pb = { x: b.x + nx * push, z: b.z + nz * push };
          if (this.world.isWalkable(pa.x, pa.z)) { a.x = pa.x; a.z = pa.z; }
          if (this.world.isWalkable(pb.x, pb.z)) { b.x = pb.x; b.z = pb.z; }
        }
      }
    }
  }

  // ---------------------------------------------------------------- combat
  spawnBullet(owner, x, z, dx, dz, w) {
    // Do not spawn the bullet inside a wall the shooter is hugging.
    const hit = this.physics.raycast(owner.x, owner.z, x, z, (c) => c.bullets);
    if (hit) { x = owner.x + (x - owner.x) * Math.max(0, hit.t - 0.05); z = owner.z + (z - owner.z) * Math.max(0, hit.t - 0.05); }
    this.bullets.push({
      x, z, dx, dz, speed: w.speed, travelled: 0, range: w.range, dmg: w.dmg, owner, weapon: w.id,
      len: w.id === 'sniper' ? 4 : 1.6, w: w.id === 'sniper' ? 0.12 : w.id === 'hmg' ? 0.09 : 0.07,
      color: owner.isPlayer ? '#fff27a' : '#ffb37a',
    });
    // let nearby bots hear the shot
    if (Math.random() < 0.35) {
      for (const [f, b] of this.brains) {
        if (f !== owner && f.state === 'alive' && Math.abs(f.x - x) < 38 && Math.abs(f.z - z) < 38) b.hear(owner.x, owner.z);
      }
    }
  }

  updateBullets(dt) {
    const fs = this.fighters;
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      let step = b.speed * dt;
      if (b.travelled + step > b.range) step = b.range - b.travelled;
      const ex = b.x + b.dx * step, ez = b.z + b.dz * step;
      let bestT = 1, hitF = null, hitC = null, nx = 0, nz = 0;
      const wallHit = this.physics.raycast(b.x, b.z, ex, ez, (c) => c.bullets);
      if (wallHit) { bestT = wallHit.t; hitC = wallHit.c; nx = wallHit.nx; nz = wallHit.nz; }
      for (const f of fs) {
        if (f === b.owner || f.state !== 'alive') continue;
        if (Math.abs(f.x - b.x) > step + 2 && Math.abs(f.z - b.z) > step + 2) continue;
        const h = segCircle(b.x, b.z, ex - b.x, ez - b.z, f.x, f.z, RADIUS + 0.12);
        if (h && h.t < bestT) { bestT = h.t; hitF = f; hitC = null; }
      }
      const hx = b.x + (ex - b.x) * bestT, hz = b.z + (ez - b.z) * bestT;
      b.travelled += step * bestT;
      b.x = hx; b.z = hz;
      if (hitF) {
        // damage falls off a little at long range
        const fall = 1 - Math.max(0, b.travelled / b.range - 0.6) * 0.5;
        this.damage(hitF, b.dmg * fall, b.owner, { weapon: b.weapon });
        b.owner.shotsHit++;
        this.bullets.splice(i, 1);
      } else if (hitC) {
        if (hitC.tag === 'crate') this.damageCrate(hitC.data, b.dmg, b.owner);
        else this.fx.impact(hx, hz, nx, nz, hitC.tag === 'tree' || hitC.tag === 'log' ? '#8a6a42' : '#d8d2c4');
        this.bullets.splice(i, 1);
      } else if (b.travelled >= b.range - 1e-3) {
        this.bullets.splice(i, 1);
      }
    }
  }

  melee(f, w) {
    const reach = w.range;
    const fx = Math.sin(f.angle), fz = Math.cos(f.angle);
    let best = null, bd = Infinity;
    for (const o of this.fighters) {
      if (o === f || o.state !== 'alive') continue;
      const dx = o.x - f.x, dz = o.z - f.z, d = Math.hypot(dx, dz);
      if (d > reach + RADIUS) continue;
      if ((dx * fx + dz * fz) / (d || 1) < 0.45) continue;
      if (d < bd) { bd = d; best = o; }
    }
    audio.punch(f.x, f.z);
    if (best) { this.damage(best, w.dmg, f, { weapon: 'fists' }); return; }
    // punch crates
    const tx = f.x + fx * 1.4, tz = f.z + fz * 1.4;
    for (const c of this.world.crates) {
      if (c.alive && Math.abs(c.x - tx) < 1.3 && Math.abs(c.z - tz) < 1.3) { this.damageCrate(c, w.dmg, f); break; }
    }
  }

  damageCrate(c, dmg, src) {
    if (!c.alive) return;
    c.hp -= dmg;
    audio.woodHit(c.x, c.z);
    this.fx.burst(c.x, 0.8, c.z, 4, c.gold ? '#ffcf3f' : '#c8924f', 3, 0.1, 0.4);
    this.world.setCrateMatrix(c, c.size * 0.92, (Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1);
    clearTimeout(c._t);
    c._t = setTimeout(() => { if (c.alive) this.world.setCrateMatrix(c, c.size); }, 70);
    if (c.hp > 0) return;
    c.alive = false;
    this.physics.remove(c.collider);
    this.world.setCrateMatrix(c, 0.0001);
    audio.crate(c.x, c.z);
    this.fx.burst(c.x, 0.8, c.z, 18, c.gold ? '#ffcf3f' : '#c8924f', 6, 0.18, 0.8);
    const n = c.gold ? 3 : 2;
    for (let i = 0; i < n; i++) {
      const item = i === 0 && c.gold ? rollWeapon(this.rng, 2) : rollItem(this.rng, c.gold ? 1 : 0);
      this.loot.spawn(item, c.x, c.z, true);
      if (item.type === 'weapon') this.loot.spawn({ type: 'ammo', id: WEAPONS[item.id].ammo, amount: AMMO[WEAPONS[item.id].ammo].pickup }, c.x, c.z, true);
    }
  }

  throwGrenade(f, ax, az) {
    const dx = ax - f.x, dz = az - f.z;
    const d = Math.min(18, Math.hypot(dx, dz)) || 1;
    const a = Math.atan2(dx, dz);
    const T = 0.9;
    const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(0.22, 1), new THREE.MeshStandardMaterial({ color: '#3e7a3a', flatShading: true }));
    mesh.castShadow = true;
    this.scene.add(mesh);
    this.grenades.push({ x: f.x, z: f.z, y: 1.4, vx: Math.sin(a) * d / T, vz: Math.cos(a) * d / T, vy: 9, t: 0, owner: f, mesh });
    audio.whoosh();
  }

  updateGrenades(dt) {
    const G = ITEMS.grenade;
    for (let i = this.grenades.length - 1; i >= 0; i--) {
      const g = this.grenades[i];
      g.t += dt;
      const nx = g.x + g.vx * dt, nz = g.z + g.vz * dt;
      const hit = this.physics.raycast(g.x, g.z, nx, nz, (c) => c.move);
      if (hit && g.y < 3) { if (hit.nx) g.vx *= -0.5; if (hit.nz) g.vz *= -0.5; }
      else { g.x = nx; g.z = nz; }
      g.vy -= 22 * dt;
      g.y += g.vy * dt;
      if (g.y < 0.22) { g.y = 0.22; g.vy *= -0.35; g.vx *= 0.6; g.vz *= 0.6; }
      g.mesh.position.set(g.x, g.y, g.z);
      g.mesh.rotation.x += dt * 8;
      if (g.t >= G.fuse) {
        this.scene.remove(g.mesh);
        this.grenades.splice(i, 1);
        this.explode(g.x, g.z, G.radius, G.dmg, g.owner);
      }
    }
  }

  explode(x, z, radius, dmg, owner) {
    this.fx.explosion(x, z, radius);
    audio.explosion(x, z);
    if (this.player.state === 'alive') {
      const d = dist(x, z, this.player.x, this.player.z);
      if (d < 30) this.fx.addShake(0.9 * (1 - d / 30));
    }
    for (const f of this.fighters) {
      if (f.state !== 'alive') continue;
      const d = dist(x, z, f.x, f.z);
      if (d > radius) continue;
      if (!this.physics.lineOfSight(x, z, f.x, f.z)) continue;
      this.damage(f, dmg * (1 - (d / radius) * 0.6), owner, { weapon: 'grenade' });
    }
    for (const c of this.world.crates) if (c.alive && dist(x, z, c.x, c.z) < radius) this.damageCrate(c, dmg, owner);
  }

  damage(target, amount, src, opts = {}) {
    if (target.state !== 'alive' || amount <= 0) return;
    let toHealth = amount, absorbed = 0;
    if (!opts.zone && target.armor > 0) {
      absorbed = Math.min(target.armor, amount);
      target.armor -= absorbed;
      toHealth = amount - absorbed;
      if (target.armor <= 0) { target.armor = 0; target.armorTier = 0; }
    }
    target.health -= toHealth;
    target.lastHurt = this.now;
    target.hurtFlash = 1;
    target.healing = 0;
    if (src && src !== target) target.lastDamager = src;
    if (!opts.zone) {
      this.fx.hitPuff(target.x, target.z, absorbed > toHealth);
      if (src && src !== target) src.damageDealt += amount;
      const b = this.brains.get(target);
      if (b) b.onDamaged(src);
    }
    if (src && src.isPlayer && src !== target) {
      this.fx.damageNumber(target.x, target.z, amount, amount >= 50, absorbed > toHealth);
      this.hud.hitMarker(target.health <= 0);
      if (absorbed > toHealth) audio.armorHit(); else audio.hit();
    }
    if (target.isPlayer) {
      if (opts.zone) this.hud.zoneDamage(); else this.hud.damageFrom(src ? src.x : null, src ? src.z : null);
      audio.hurt();
      this.fx.addShake(0.25);
    }
    if (target.health <= 0) this.kill(target, src, opts);
  }

  kill(target, src, opts) {
    target.health = 0;
    target.placement = this.aliveCount;
    target.state = 'dead';
    target.deathTime = this.now;
    this.fx.confetti(target.x, target.z);
    this.dropAll(target);
    const killer = src && src !== target ? src : (opts.zone && target.lastDamager && target.lastDamager.alive ? target.lastDamager : null);
    if (killer) killer.kills++;
    this.hud.killfeed(killer ? killer.name : null, target.name, opts.zone ? 'storm' : (opts.weapon || 'fists'), killer === this.player, target === this.player);
    if (killer === this.player) {
      audio.eliminate();
      this.hud.eliminated(target.name, this.player.kills);
    }
    if (target === this.player) {
      this.spectate = killer && killer.alive ? killer : null;
      audio.jingle(false);
      setTimeout(() => this.finish(false), 1400);
    }
  }

  dropAll(f) {
    const x = f.x, z = f.z;
    for (const s of f.slots) if (s) this.loot.spawn({ type: 'weapon', id: s.id, rarity: s.rarity, mag: s.mag }, x, z, true);
    for (const k of Object.keys(f.ammo)) if (f.ammo[k] > 0) this.loot.spawn({ type: 'ammo', id: k, amount: f.ammo[k] }, x, z, true);
    if (f.medkit) this.loot.spawn({ type: 'medkit', amount: f.medkit }, x, z, true);
    if (f.grenade) this.loot.spawn({ type: 'grenade', amount: f.grenade }, x, z, true);
    if (f.soda) this.loot.spawn({ type: 'soda', amount: f.soda }, x, z, true);
    if (f.armorTier > 0 && f.armor > 10) this.loot.spawn({ type: 'armor', tier: f.armorTier }, x, z, true);
    f.slots = [null, null, null, null];
    f.ammo = { light: 0, medium: 0, shells: 0, heavy: 0 };
  }

  // ---------------------------------------------------------------- loot
  canTake(f, it) {
    switch (it.type) {
      case 'ammo': return f.ammo[it.id] < AMMO[it.id].max;
      case 'medkit': return f.medkit < ITEMS.medkit.max;
      case 'grenade': return f.grenade < ITEMS.grenade.max;
      case 'soda': return f.soda < ITEMS.soda.max;
      case 'armor': return ARMOR_TIERS[it.tier] > f.armor;
      default: return true;
    }
  }

  pickup(f, it) {
    if (!this.loot.items.includes(it) || f.state !== 'alive') return false;
    if (dist(f.x, f.z, it.x, it.z) > 2.6) return false;
    if (!this.canTake(f, it)) { if (f.isPlayer) this.hud.toast('Full!'); return false; }
    switch (it.type) {
      case 'weapon': {
        let slot = f.slots.findIndex((s) => !s);
        if (slot < 0) {
          if (f.isPlayer) slot = f.active;
          else {
            // bots replace their worst gun
            let worst = 0, ws = Infinity;
            f.slots.forEach((s, i) => { const sc = { pistol: 1, smg: 2.2, shotgun: 2.4, ar: 2.8, hmg: 2.6, sniper: 2.3 }[s.id] + s.rarity * 0.6; if (sc < ws) { ws = sc; worst = i; } });
            slot = worst;
          }
          const old = f.slots[slot];
          this.loot.spawn({ type: 'weapon', id: old.id, rarity: old.rarity, mag: old.mag }, f.x, f.z, true);
        }
        f.slots[slot] = { id: it.id, rarity: it.rarity, mag: it.mag };
        if (!f.slots[f.active] || f.isPlayer || slot === f.active) { f.active = slot; f.reloading = 0; f.cooldown = Math.max(f.cooldown, 0.25); }
        break;
      }
      case 'ammo': {
        const take = Math.min(it.amount, AMMO[it.id].max - f.ammo[it.id]);
        f.ammo[it.id] += take;
        if (take < it.amount) {
          it.amount -= take;
          if (f.isPlayer) { audio.pickup(); this.hud.toast(`+${take} ${AMMO[it.id].name}`); }
          return true;
        }
        break;
      }
      case 'armor': f.armor = ARMOR_TIERS[it.tier]; f.armorTier = it.tier; break;
      case 'medkit': {
        const take = Math.min(it.amount || 1, ITEMS.medkit.max - f.medkit);
        f.medkit += take; break;
      }
      case 'grenade': f.grenade = Math.min(ITEMS.grenade.max, f.grenade + (it.amount || 1)); break;
      case 'soda': f.soda = Math.min(ITEMS.soda.max, f.soda + (it.amount || 1)); break;
    }
    this.loot.remove(it, f);
    if (f.isPlayer) { audio.pickup(); this.hud.toast('+ ' + itemLabel(it)); }
    return true;
  }

  // Walk-over pickup for ammo and consumables we have room for.
  autoPickup() {
    for (const f of this.fighters) {
      if (f.state !== 'alive') continue;
      const it = this.loot.nearest(f.x, f.z, 1.3, (i) => (i.type === 'ammo' || (f.isPlayer ? false : i.type !== 'weapon')) && this.canTake(f, i));
      if (it) this.pickup(f, it);
    }
  }

  // Item the player could pick up with E right now.
  playerPrompt() {
    const f = this.player;
    if (f.state !== 'alive') return null;
    return this.loot.nearest(f.x, f.z, 2.2, (i) => i.type !== 'ammo' || this.canTake(f, i));
  }

  // ---------------------------------------------------------------- storm
  updateZone(dt) {
    const ev = this.zone.update(dt);
    if (ev === 'shrink') { this.hud.banner('The storm is closing in!', 'Move to the safe zone'); audio.warn(); }
    else if (ev === 'wait') this.hud.banner('Storm paused', 'Next circle marked on your map');
    else if (ev === 'final') this.hud.banner('Final circle!', 'Last one standing wins');
    if (!this.zone.active) return;
    this.zoneTickT -= dt;
    if (this.zoneTickT > 0) return;
    this.zoneTickT = 1;
    for (const f of this.fighters) {
      if (f.state !== 'alive') continue;
      if (this.zone.outside(f.x, f.z)) this.damage(f, this.zone.dps, null, { zone: true });
    }
  }

  checkEnd() {
    if (this.ended) return;
    const alive = this.fighters.filter((f) => f.alive);
    if (alive.length <= 1) {
      const w = alive[0];
      if (w) w.placement = 1;
      if (w === this.player) {
        this.ended = true;
        audio.jingle(true);
        this.fx.confetti(w.x, w.z);
        setTimeout(() => this.finish(true), 1600);
      } else if (this.player.state === 'dead') {
        this.ended = true;
      }
    }
  }

  finish(won) {
    if (this.result || this.disposed) return;
    const p = this.player;
    this.result = {
      won,
      placement: won ? 1 : p.placement,
      players: this.fighters.length,
      kills: p.kills,
      damage: Math.round(p.damageDealt),
      accuracy: p.shotsFired ? Math.round((p.shotsHit / p.shotsFired) * 100) : 0,
      survived: p.surviveTime,
      killer: p.lastDamager ? p.lastDamager.name : null,
      stormKill: p.state === 'dead' && this.zone.outside(p.x, p.z),
      mode: this.mode.id,
    };
    this.onEnd(this.result);
  }

  botIntent(f, dt) {
    const b = this.brains.get(f);
    if (f.state === 'plane') return b.planeIntent();
    if (f.state === 'air') return b.airIntent();
    return b.update(dt);
  }

  // What the camera should look at.
  cameraTarget() {
    const p = this.player;
    if (p.state === 'plane') return { x: this.plane.x, z: this.plane.z, y: 38, air: true, plane: true };
    if (p.state === 'air') return { x: p.x, z: p.z, y: p.y * 0.6, air: true };
    if (p.state === 'dead' && this.spectate) {
      if (!this.spectate.alive) {
        // follow whoever finished our killer, or any survivor
        this.spectate = this.spectate.lastDamager && this.spectate.lastDamager.alive ? this.spectate.lastDamager : this.fighters.find((f) => f.state === 'alive') || null;
      }
      if (this.spectate) return { x: this.spectate.x, z: this.spectate.z, y: 0, spect: this.spectate };
    }
    return { x: p.x, z: p.z, y: 0 };
  }
}

