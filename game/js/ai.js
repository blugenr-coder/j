// Bot brains. Each bot perceives (sight with line of sight, hearing gunshots,
// feeling damage), decides (drop, loot, fight, retreat, heal, flee storm,
// roam) and moves along A* paths. It returns the same intent object the
// player's input produces.
import { WEAPONS, AMMO, ITEMS, ARMOR_TIERS, DIFFICULTY } from './config.js';
import { POIS } from './world.js';
import { dist, clamp } from './util.js';

function weaponScore(s) {
  if (!s) return -1;
  const base = { pistol: 1, smg: 2.2, shotgun: 2.4, ar: 2.8, hmg: 2.6, sniper: 2.3 }[s.id] || 0;
  return base + s.rarity * 0.6;
}

export class BotBrain {
  constructor(f, match, diffKey, rng) {
    this.f = f;
    this.m = match;
    this.d = DIFFICULTY[diffKey];
    this.diffKey = diffKey;
    this.rng = rng;
    this.intent = { mx: 0, mz: 0, aimX: 0, aimZ: 0 };
    // drop: pick a landing spot (a POI most of the time)
    const poi = POIS[Math.floor(rng() * POIS.length)];
    const spread = 22;
    this.landX = poi.x + (rng() * 2 - 1) * spread;
    this.landZ = poi.z + (rng() * 2 - 1) * spread;
    this.jumpAt = -1;
    this.target = null; this.seenAt = 0; this.lastSeenX = 0; this.lastSeenZ = 0; this.lastSeenT = -99;
    this.perceiveT = rng() * 0.3;
    this.thinkT = rng() * 0.5;
    this.path = null; this.pathGoal = null; this.repathT = 0;
    this.strafeDir = rng() < 0.5 ? 1 : -1; this.strafeT = 0;
    this.aimErrA = 0; this.aimErrV = 0;
    this.goal = null; this.goalKind = null; this.goalT = 0;
    this.stuckT = 0; this.stuckX = 0; this.stuckZ = 0; this.jitter = 0; this.jitterA = 0;
    this.lootTarget = null; this.crateTarget = null;
    this.fireToggle = false;
    this.investigate = null;
    this.slotT = 0;
    this.brawler = rng() < 0.2;
    this.ignore = new Set();
    this.ignoreCrates = new Set();
    this.lootDeadline = 0; this.crateDeadline = 0;
  }

  // Called by the match when this bot takes damage.
  onDamaged(src) {
    if (!src || src === this.f || !src.alive) return;
    if (!this.target || !this.target.alive || dist(this.f.x, this.f.z, src.x, src.z) < dist(this.f.x, this.f.z, this.target.x, this.target.z)) {
      this.investigate = { x: src.x, z: src.z, t: this.m.now };
      this.lastSeenX = src.x; this.lastSeenZ = src.z; this.lastSeenT = this.m.now;
      this.alertSrc = src;
    }
  }

  hear(x, z) {
    if (this.target || this.investigate) return;
    if (this.rng() < 0.5) this.investigate = { x, z, t: this.m.now };
  }

  planeIntent() {
    const it = this.intent;
    it.jump = false;
    const p = this.m.plane;
    if (this.jumpAt < 0) {
      // jump when the plane is closest to the landing spot (+ some variance)
      const t = clamp(((this.landX - p.sx) * p.dx + (this.landZ - p.sz) * p.dz) / p.len, 0.05, 0.92);
      this.jumpAt = clamp(t - 0.04 + (this.rng() - 0.5) * 0.06, 0.03, 0.95);
    }
    if (p.progress >= this.jumpAt) it.jump = true;
    return it;
  }

  airIntent() {
    const it = this.intent;
    const dx = this.landX - this.f.x, dz = this.landZ - this.f.z;
    const l = Math.hypot(dx, dz);
    it.mx = l > 1 ? dx / l : 0; it.mz = l > 1 ? dz / l : 0;
    it.aimX = this.f.x + it.mx; it.aimZ = this.f.z + it.mz;
    return it;
  }

  // ---------------------------------------------------------------- path
  setGoal(x, z, force = false) {
    const g = this.pathGoal;
    if (!force && g && Math.abs(g[0] - x) < 2.5 && Math.abs(g[1] - z) < 2.5 && this.path && this.path.length) return;
    if (this.repathT > 0 && !force && this.path && this.path.length) return;
    this.repathT = 0.7 + this.rng() * 0.4;
    this.pathGoal = [x, z];
    this.path = this.m.nav.findPath(this.f.x, this.f.z, x, z) || [[x, z]];
  }

  followPath() {
    const f = this.f;
    let wp = this.path && this.path[0];
    while (wp && Math.hypot(wp[0] - f.x, wp[1] - f.z) < 0.9) {
      this.path.shift();
      wp = this.path[0];
    }
    if (!wp) {
      // Path ran out short of the goal (goal sits in a blocked cell, e.g.
      // loot beside furniture): steer straight at it for the last metres.
      const g = this.pathGoal;
      if (g) {
        const d = Math.hypot(g[0] - f.x, g[1] - f.z);
        if (d > 0.5 && d < 5) return [(g[0] - f.x) / d, (g[1] - f.z) / d];
      }
      return [0, 0];
    }
    const dx = wp[0] - f.x, dz = wp[1] - f.z, l = Math.hypot(dx, dz) || 1;
    return [dx / l, dz / l];
  }

  // ---------------------------------------------------------------- wants
  wantItem(it) {
    const f = this.f;
    switch (it.type) {
      case 'weapon': {
        if (f.slots.some((s) => !s)) return !f.slots.some((s) => s && s.id === it.id && s.rarity >= it.rarity);
        const worst = Math.min(...f.slots.map(weaponScore));
        return weaponScore(it) > worst + 0.3;
      }
      case 'ammo': return f.slots.some((s) => s && WEAPONS[s.id].ammo === it.id) && f.ammo[it.id] < AMMO[it.id].max * 0.6;
      case 'armor': return ARMOR_TIERS[it.tier] > f.armor + 5;
      case 'medkit': return f.medkit < ITEMS.medkit.max;
      case 'grenade': return f.grenade < 2;
      case 'soda': return f.soda < 1;
    }
    return false;
  }

  // ---------------------------------------------------------------- main
  update(dt) {
    const f = this.f, m = this.m, it = this.intent;
    it.fire = false; it.reload = false; it.heal = false; it.grenade = false; it.soda = false; it.slot = -1; it.pickup = null; it.jump = false;
    this.repathT -= dt; this.perceiveT -= dt; this.thinkT -= dt; this.strafeT -= dt; this.slotT -= dt;

    // ---- perception
    if (this.perceiveT <= 0) {
      this.perceiveT = 0.22 + this.rng() * 0.12;
      this.perceive();
    }
    let tgt = this.target && this.target.alive && this.target.onGround ? this.target : null;
    if (!tgt) this.target = null;
    // Without a gun, only brawl when cornered; otherwise keep looting.
    if (tgt && !f.hasGun()) {
      const d = dist(f.x, f.z, tgt.x, tgt.z);
      const retaliate = tgt === this.alertSrc && m.now - f.lastHurt < 3;
      if (!(d < 3 && (retaliate || (this.brawler && !tgt.hasGun())))) tgt = null;
    }

    // ---- zone pressure
    const z = m.zone;
    let zoneGoal = null;
    if (z.active) {
      const outNow = z.outside(f.x, f.z, 2);
      const soon = z.state === 'shrink' || z.timeLeft() < 18;
      if (outNow || (soon && z.outsideNext(f.x, f.z, 3))) {
        const tx = z.state === 'shrink' || outNow ? z.nx : z.nx, tz = z.nz;
        const rr = Math.max(0, z.nr * 0.55);
        const a = Math.atan2(f.z - tz, f.x - tx);
        zoneGoal = [tx + Math.cos(a) * rr, tz + Math.sin(a) * rr];
      }
    }

    let moveX = 0, moveZ = 0;
    let aimX = f.x + Math.sin(f.angle) * 5, aimZ = f.z + Math.cos(f.angle) * 5;

    if (tgt) {
      // ---- combat
      const d = dist(f.x, f.z, tgt.x, tgt.z);
      if (this.slotT <= 0) {
        this.slotT = 0.8;
        const best = f.bestSlotFor(d);
        if (best >= 0 && best !== f.active) it.slot = best;
      }
      const w = f.weapon();
      const canFight = !w.melee || !tgt.hasGun() || d < 6;
      // aim with lead + error that shrinks while tracking
      const tracked = Math.min(1, (m.now - this.seenAt) / 2.5) * this.d.accuracyGain;
      this.aimErrV += (this.rng() - 0.5) * dt * 6;
      this.aimErrV *= 0.9;
      this.aimErrA = clamp(this.aimErrA + this.aimErrV * dt, -1, 1);
      const err = this.aimErrA * this.d.aimError * (1 - tracked) * 2.2;
      const flight = w.speed ? d / w.speed : 0;
      let px = tgt.x + tgt.vx * flight * this.d.lead, pz = tgt.z + tgt.vz * flight * this.d.lead;
      const ang = Math.atan2(px - f.x, pz - f.z) + err;
      aimX = f.x + Math.sin(ang) * d; aimZ = f.z + Math.cos(ang) * d;

      const reacted = m.now - this.seenAt > this.d.reaction;
      const inRange = d < (w.melee ? w.range + 0.4 : w.range * 0.95);
      const facing = Math.abs(((f.angle - ang + Math.PI * 3) % (Math.PI * 2)) - Math.PI) < 0.35;
      if (reacted && inRange && facing && canFight && this.visible) {
        if (w.auto) it.fire = true;
        else { this.fireToggle = !this.fireToggle; it.fire = this.fireToggle; }
      }
      if (!w.melee && w.slot && w.slot.mag === 0) it.reload = true;

      // movement: keep preferred range and strafe
      const pref = canFight ? w.prefRange : 26;
      const dx = (tgt.x - f.x) / (d || 1), dz = (tgt.z - f.z) / (d || 1);
      let radial = clamp((d - pref) / Math.max(3, pref * 0.5), -1, 1);
      const lowHp = f.health < 100 * this.d.heal && f.medkit > 0;
      if (lowHp || !canFight) radial = -1;
      if (this.strafeT <= 0) { this.strafeT = 0.5 + this.rng() * 1.1; if (this.rng() < 0.6) this.strafeDir *= -1; }
      const st = this.d.strafe * (lowHp ? 0.4 : 1);
      moveX = dx * radial + -dz * this.strafeDir * st;
      moveZ = dz * radial + dx * this.strafeDir * st;
      if (lowHp && d > 14 && !this.visible) { it.heal = true; moveX *= 0.3; moveZ *= 0.3; }
      // grenade at enemies hiding behind cover
      if (!this.visible && f.grenade > 0 && d > 7 && d < 18 && this.rng() < dt * 0.6) {
        it.grenade = true; aimX = this.lastSeenX; aimZ = this.lastSeenZ;
      }
      // chase when target broke line of sight
      if (!this.visible && !lowHp && canFight) {
        this.setGoal(this.lastSeenX, this.lastSeenZ);
        [moveX, moveZ] = this.followPath();
      }
      // walls: if the desired move is blocked, try the path route instead
      if (!m.nav.isFree(f.x + moveX * 1.2, f.z + moveZ * 1.2)) { moveX = -dz * this.strafeDir; moveZ = dx * this.strafeDir; this.strafeDir *= this.rng() < 0.1 ? -1 : 1; }
      if (zoneGoal) {
        this.setGoal(zoneGoal[0], zoneGoal[1]);
        const [zx, zz] = this.followPath();
        moveX = zx * 0.8 + moveX * 0.35; moveZ = zz * 0.8 + moveZ * 0.35;
      }
      this.lootTarget = null; this.crateTarget = null;
    } else {
      // ---- out of combat
      if (f.health < 75 && f.medkit > 0 && m.now - this.lastSeenT > 2.5 && !zoneGoal) it.heal = true;
      if (f.health < 60 && f.soda > 0 && m.now - this.lastSeenT > 2) it.soda = true;
      // reload while safe
      const w = f.weapon();
      if (!w.melee && w.slot && w.slot.mag < w.mag * 0.5 && f.ammo[w.ammo] > 0) it.reload = true;
      if (this.slotT <= 0) {
        this.slotT = 1.5;
        const best = f.bestSlotFor(16);
        if (best >= 0 && best !== f.active) it.slot = best;
      }
      if (this.thinkT <= 0) { this.thinkT = 0.5 + this.rng() * 0.3; this.think(); }
      let goal = null;
      if (zoneGoal) goal = zoneGoal;
      else if (this.lootTarget) goal = [this.lootTarget.x, this.lootTarget.z];
      else if (this.crateTarget) goal = [this.crateTarget.x, this.crateTarget.z];
      else if (this.investigate && m.now - this.investigate.t < 8) goal = [this.investigate.x, this.investigate.z];
      else {
        this.investigate = null;
        if (!this.goal || this.goalT < m.now || dist(f.x, f.z, this.goal[0], this.goal[1]) < 3) this.pickRoam();
        goal = this.goal;
      }
      if (it.heal && f.healing > 0) goal = null;
      if (goal) {
        this.setGoal(goal[0], goal[1]);
        [moveX, moveZ] = this.followPath();
        if (moveX || moveZ) { aimX = f.x + moveX * 5; aimZ = f.z + moveZ * 5; }
      }
      // loot pickup
      if (this.lootTarget) {
        const lt = this.lootTarget;
        if (!m.loot.items.includes(lt)) this.lootTarget = null;
        else if (dist(f.x, f.z, lt.x, lt.z) < 2.1) { it.pickup = lt; this.ignore.add(lt.uid); this.lootTarget = null; }
        else if (m.now > this.lootDeadline) { this.ignore.add(lt.uid); this.lootTarget = null; }
      }
      if (this.crateTarget && m.now > this.crateDeadline) { this.ignoreCrates.add(this.crateTarget); this.crateTarget = null; }
      // break crates
      if (this.crateTarget) {
        const c = this.crateTarget;
        if (!c.alive) this.crateTarget = null;
        else {
          const d = dist(f.x, f.z, c.x, c.z);
          const w2 = f.weapon();
          const reach = w2.melee ? 1.9 : 9;
          if (d < reach) {
            aimX = c.x; aimZ = c.z;
            if (w2.melee) { moveX *= 0.2; moveZ *= 0.2; }
            else { moveX = 0; moveZ = 0; }
            if (w2.auto) it.fire = true; else { this.fireToggle = !this.fireToggle; it.fire = this.fireToggle; }
          }
        }
      }
    }

    // ---- stuck detection
    this.stuckT -= dt;
    if (this.stuckT <= 0) {
      const moved = dist(f.x, f.z, this.stuckX, this.stuckZ);
      const wantsToMove = (Math.abs(moveX) + Math.abs(moveZ)) > 0.3 || (!tgt && f.healing <= 0 && (this.lootTarget || this.goal));
      if (moved < 0.6 && wantsToMove) {
        if (this.lootTarget) this.ignore.add(this.lootTarget.uid);
        this.jitter = 0.6; this.jitterA = this.rng() * Math.PI * 2;
        this.path = null; this.repathT = 0;
        this.lootTarget = null;
        if (this.goal && this.rng() < 0.6) this.goal = null;
      }
      this.stuckX = f.x; this.stuckZ = f.z; this.stuckT = 1;
    }
    if (this.jitter > 0) { this.jitter -= dt; moveX = Math.cos(this.jitterA); moveZ = Math.sin(this.jitterA); }

    it.mx = moveX; it.mz = moveZ;
    it.aimX = aimX; it.aimZ = aimZ;
    return it;
  }

  perceive() {
    const f = this.f, m = this.m;
    const view = this.d.view;
    let best = null, bestD = view * view;
    // keep current target if still visible (stickiness)
    if (this.target && this.target.alive && this.target.onGround) {
      const d2 = (this.target.x - f.x) ** 2 + (this.target.z - f.z) ** 2;
      if (d2 < (view * 1.3) ** 2 && m.physics.lineOfSight(f.x, f.z, this.target.x, this.target.z)) {
        this.visible = true;
        this.lastSeenX = this.target.x; this.lastSeenZ = this.target.z; this.lastSeenT = m.now;
        return;
      }
    }
    for (const o of m.fighters) {
      if (o === f || !o.alive || !o.onGround) continue;
      const d2 = (o.x - f.x) ** 2 + (o.z - f.z) ** 2;
      // the alert source counts even from a bit further away
      const lim = o === this.alertSrc ? bestD * 1.6 : bestD;
      if (d2 >= lim) continue;
      // ignore enemies hiding in bushes is not modelled; LOS through walls blocks
      if (!m.physics.lineOfSight(f.x, f.z, o.x, o.z)) continue;
      best = o; bestD = Math.min(bestD, d2);
    }
    if (best) {
      if (best !== this.target) this.seenAt = m.now;
      this.target = best;
      this.visible = true;
      this.lastSeenX = best.x; this.lastSeenZ = best.z; this.lastSeenT = m.now;
      this.investigate = null;
    } else {
      this.visible = false;
      // remember a target that just vanished for a few seconds
      if (this.target && m.now - this.lastSeenT > 4) this.target = null;
    }
  }

  think() {
    const f = this.f, m = this.m;
    if (this.lootTarget && !m.loot.items.includes(this.lootTarget)) this.lootTarget = null;
    if (!this.lootTarget) {
      this.lootTarget = m.loot.nearest(f.x, f.z, f.hasGun() ? 24 : 36, (it) => !this.ignore.has(it.uid) && this.wantItem(it) && !m.zone.outside(it.x, it.z, 4));
      if (this.lootTarget) this.lootDeadline = m.now + 6 + dist(f.x, f.z, this.lootTarget.x, this.lootTarget.z) * 0.3;
    }
    const needs = !f.hasGun() || f.slots.filter((s) => s).length < 2 || f.armor < 30;
    if (!this.lootTarget && needs && (!this.crateTarget || !this.crateTarget.alive)) {
      let best = null, bd = 22 * 22;
      for (const c of m.world.crates) {
        if (!c.alive || this.ignoreCrates.has(c)) continue;
        const d = (c.x - f.x) ** 2 + (c.z - f.z) ** 2;
        if (d < bd) { bd = d; best = c; }
      }
      this.crateTarget = best;
      if (best) this.crateDeadline = m.now + 12;
    }
  }

  pickRoam() {
    const m = this.m, f = this.f, z = m.zone;
    for (let i = 0; i < 12; i++) {
      let x, zz;
      if (this.rng() < 0.5) {
        const p = POIS[Math.floor(this.rng() * POIS.length)];
        x = p.x + (this.rng() - 0.5) * 30; zz = p.z + (this.rng() - 0.5) * 30;
      } else {
        const a = this.rng() * Math.PI * 2, d = 15 + this.rng() * 40;
        x = f.x + Math.cos(a) * d; zz = f.z + Math.sin(a) * d;
      }
      if (z.active && z.outsideNext(x, zz, 6) && z.nr > 10) continue;
      if (!m.nav.isFree(x, zz)) continue;
      this.goal = [x, zz];
      this.goalT = m.now + 15 + this.rng() * 10;
      return;
    }
    this.goal = [z.nx + (this.rng() - 0.5) * z.nr, z.nz + (this.rng() - 0.5) * z.nr];
    this.goalT = m.now + 8;
  }
}
