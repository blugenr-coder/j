// A Fighter is any participant: the local player or a bot. It only reacts to
// an "intent" object ({ mx, mz, aimX, aimZ, fire, reload, slot, heal,
// grenade, soda, jump, pickup }) produced by a controller. That seam is what
// lets a network controller drive remote players later without touching
// gameplay code.
import * as THREE from '../vendor/three.module.min.js';
import { WEAPONS, weaponStats, ITEMS, ARMOR_TIERS } from './config.js';
import { makeCharacter, setCharacterWeapon, makeParachute, makeHealthBar } from './models.js';
import { lerpAngle, clamp } from './util.js';
import { audio } from './audio.js';

export const RADIUS = 0.55;
const BASE_SPEED = 6.4;

export class Fighter {
  constructor(match, opts) {
    this.match = match;
    this.id = opts.id;
    this.name = opts.name;
    this.character = opts.character;
    this.isPlayer = !!opts.isPlayer;
    this.x = 0; this.z = 0; this.y = 0;
    this.vx = 0; this.vz = 0;
    this.angle = 0;
    this.health = 100; this.armor = 0; this.armorTier = 0;
    this.slots = [null, null, null, null];
    this.active = 0;
    this.ammo = { light: 0, medium: 0, shells: 0, heavy: 0 };
    this.medkit = 0; this.grenade = 0; this.soda = 0;
    this.state = 'plane';
    this.cooldown = 0; this.reloading = 0; this.healing = 0; this.boost = 0;
    this.bloom = 0; this.triggerLatch = false;
    this.kills = 0; this.damageDealt = 0; this.shotsFired = 0; this.shotsHit = 0;
    this.lastDamager = null; this.lastHurt = -10; this.hurtFlash = 0;
    this.placement = 0; this.deathTime = 0; this.surviveTime = 0;
    this.walkPhase = 0; this.kick = 0; this.stepTimer = 0;
    this.grenadeCd = 0;

    this.model = makeCharacter(opts.character);
    this.chute = makeParachute(opts.character.shirt);
    this.chute.visible = false;
    this.model.add(this.chute);
    match.scene.add(this.model);
    if (!this.isPlayer) {
      this.bar = makeHealthBar();
      this.bar.visible = false;
      match.scene.add(this.bar);
    }
    this.model.visible = false;
    if (this.isPlayer) addSilhouette(this.model);
  }

  dispose() {
    this.match.scene.remove(this.model);
    if (this.bar) this.match.scene.remove(this.bar);
    this.model.traverse((o) => { if (o.material && o.material.dispose && this.model.userData.mats.includes(o.material)) o.material.dispose(); });
  }

  get alive() { return this.state === 'alive' || this.state === 'air' || this.state === 'plane'; }
  get onGround() { return this.state === 'alive'; }

  weapon() {
    const s = this.slots[this.active];
    if (!s) return { ...WEAPONS.fists, slot: null };
    const w = weaponStats(s.id, s.rarity);
    w.slot = s;
    return w;
  }

  hasGun() { return this.slots.some((s) => s); }

  bestSlotFor(range) {
    let best = -1, bestScore = -Infinity;
    this.slots.forEach((s, i) => {
      if (!s) return;
      const w = WEAPONS[s.id];
      const ammoLeft = s.mag + this.ammo[w.ammo];
      if (ammoLeft <= 0) return;
      const fit = -Math.abs(w.prefRange - range) / Math.max(4, w.prefRange) + s.rarity * 0.15 + (s.mag > 0 ? 0.3 : 0);
      if (fit > bestScore) { bestScore = fit; best = i; }
    });
    return best;
  }

  switchTo(i) {
    if (i === this.active || i < 0 || i > 3) return;
    this.active = i;
    this.reloading = 0;
    this.cooldown = Math.max(this.cooldown, 0.28);
    this.triggerLatch = true;
    if (this.isPlayer) audio.click();
  }

  startReload() {
    const w = this.weapon();
    if (!w.slot || w.melee || this.reloading > 0 || this.healing > 0) return false;
    if (w.slot.mag >= w.mag || this.ammo[w.ammo] <= 0) return false;
    this.reloading = w.reload;
    audio.reload(this.x, this.z);
    return true;
  }

  startHeal() {
    if (this.medkit <= 0 || this.health >= 100 || this.healing > 0) return false;
    this.healing = ITEMS.medkit.time;
    this.reloading = 0;
    return true;
  }

  drinkSoda() {
    if (this.soda <= 0 || this.boost > 0) return false;
    this.soda--;
    this.boost = ITEMS.soda.dur;
    this.health = Math.min(100, this.health + ITEMS.soda.heal);
    if (this.isPlayer) audio.gulp();
    return true;
  }

  speed() {
    const w = this.weapon();
    let s = BASE_SPEED * (w.moveMul || 1);
    if (this.boost > 0) s *= ITEMS.soda.boost;
    if (this.healing > 0) s *= 0.5;
    return s;
  }

  // Simulation step for a grounded fighter.
  update(dt, it) {
    const m = this.match;
    this.surviveTime += dt;
    this.cooldown -= dt;
    this.grenadeCd -= dt;
    this.bloom = Math.max(0, this.bloom - dt * 0.3);
    if (this.boost > 0) this.boost -= dt;
    this.hurtFlash = Math.max(0, this.hurtFlash - dt * 4);

    // aim
    const ax = it.aimX - this.x, az = it.aimZ - this.z;
    if (ax * ax + az * az > 0.01) this.angle = Math.atan2(ax, az);

    // move
    let mx = it.mx || 0, mz = it.mz || 0;
    const ml = Math.hypot(mx, mz);
    if (ml > 1) { mx /= ml; mz /= ml; }
    const sp = this.speed();
    const tvx = mx * sp, tvz = mz * sp;
    const acc = Math.min(1, dt * 14);
    this.vx += (tvx - this.vx) * acc;
    this.vz += (tvz - this.vz) * acc;
    const pos = { x: this.x, z: this.z };
    m.physics.move(pos, RADIUS, this.vx * dt, this.vz * dt);
    const realV = Math.hypot(pos.x - this.x, pos.z - this.z) / Math.max(dt, 1e-4);
    this.x = pos.x; this.z = pos.z;
    this.moveSpeed = realV;
    if (realV > 1) {
      this.stepTimer -= dt * realV;
      if (this.stepTimer <= 0) {
        this.stepTimer = 2.6;
        audio.step(this.x, this.z);
        if (realV > 5) m.fx.dust(this.x, this.z);
      }
    }

    // slot switching
    if (it.slot !== undefined && it.slot !== null && it.slot >= 0) this.switchTo(it.slot);

    // healing
    if (this.healing > 0) {
      this.healing -= dt;
      if (this.healing <= 0) {
        this.healing = 0;
        this.medkit--;
        this.health = Math.min(100, this.health + ITEMS.medkit.heal);
        if (this.isPlayer) audio.heal();
        m.fx.burst(this.x, 1.2, this.z, 10, '#5ef07a', 3, 0.12, 0.7, 2);
      }
    } else if (it.heal) this.startHeal();

    if (it.soda) this.drinkSoda();
    if (it.grenade && this.grenade > 0 && this.grenadeCd <= 0 && this.healing <= 0) {
      this.grenade--;
      this.grenadeCd = 0.8;
      m.throwGrenade(this, it.aimX, it.aimZ);
    }

    // reload
    const w = this.weapon();
    if (this.reloading > 0) {
      this.reloading -= dt;
      if (this.reloading <= 0) {
        this.reloading = 0;
        const need = w.mag - w.slot.mag;
        const take = Math.min(need, this.ammo[w.ammo]);
        w.slot.mag += take;
        this.ammo[w.ammo] -= take;
        audio.reloadDone(this.x, this.z);
      }
    } else if (it.reload) this.startReload();

    // fire
    if (!it.fire) this.triggerLatch = false;
    if (it.fire && this.cooldown <= 0 && this.reloading <= 0 && this.healing <= 0 && !(this.triggerLatch && !w.auto)) {
      this.triggerLatch = true;
      if (w.melee) {
        this.cooldown = 1 / w.rate;
        this.kick = 1;
        m.melee(this, w);
      } else if (w.slot.mag > 0) {
        this.cooldown = 1 / w.rate;
        w.slot.mag--;
        this.shotsFired++;
        const dirA = this.angle;
        for (let p = 0; p < w.pellets; p++) {
          const spread = (w.spread + this.bloom) * (Math.random() * 2 - 1);
          const a = dirA + spread;
          const dx = Math.sin(a), dz = Math.cos(a);
          m.spawnBullet(this, this.x + Math.sin(dirA) * 0.9, this.z + Math.cos(dirA) * 0.9, dx, dz, w);
        }
        this.bloom = Math.min(0.14, this.bloom + w.recoil * 0.6);
        this.kick = 1;
        this.flash = 0.06;
        audio.shot(w.id, this.x, this.z);
        m.fx.muzzle(this.x + Math.sin(dirA) * 1.3, this.z + Math.cos(dirA) * 1.3, Math.sin(dirA), Math.cos(dirA));
        if (this.isPlayer) m.fx.addShake(w.recoil * 2.2);
        if (w.slot.mag === 0) this.startReload();
      } else {
        if (!this.startReload()) {
          this.cooldown = 0.25;
          if (this.isPlayer) audio.empty();
          // auto-switch to something that can shoot
          const alt = this.slots.findIndex((s) => s && (s.mag > 0 || this.ammo[WEAPONS[s.id].ammo] > 0));
          if (alt >= 0 && alt !== this.active) this.switchTo(alt);
        }
      }
    }
  }

  // ---------------------------------------------------------------- visuals
  updateVisual(dt, camera, now) {
    const mdl = this.model;
    const ud = mdl.userData;
    if (this.state === 'plane') { mdl.visible = false; if (this.bar) this.bar.visible = false; return; }
    mdl.visible = true;
    mdl.position.set(this.x, this.y, this.z);
    mdl.rotation.y = lerpAngle(mdl.rotation.y, this.angle, Math.min(1, dt * 20));
    const s = this.slots[this.active];
    setCharacterWeapon(mdl, s ? s.id : null, s ? s.rarity : 0);

    if (this.state === 'dead') {
      const t = now - this.deathTime;
      ud.body.rotation.x = -Math.min(Math.PI / 2, t * 6);
      ud.body.position.y = Math.min(0.2, t);
      if (t > 1.2) mdl.position.y = -(t - 1.2) * 1.2;
      if (t > 2.4) mdl.visible = false;
      if (this.bar) this.bar.visible = false;
      ud.flash.visible = false;
      return;
    }
    ud.body.rotation.x = 0;
    ud.body.position.y = 0;

    this.chute.visible = this.state === 'air' && this.y < 26;
    if (this.state === 'air') {
      ud.legL.rotation.x = 0.4; ud.legR.rotation.x = -0.2;
      ud.armL.rotation.x = -2.6; ud.armR.rotation.x = -2.6;
      ud.torso.rotation.x = this.chute.visible ? 0 : 0.9;
    } else {
      ud.torso.rotation.x = 0;
      const sp = this.moveSpeed || 0;
      if (sp > 0.5) this.walkPhase += dt * sp * 1.7;
      const amp = Math.min(1, sp / 6) * 0.7;
      // legs swing relative to body facing vs move direction
      ud.legL.rotation.x = Math.sin(this.walkPhase) * amp;
      ud.legR.rotation.x = -Math.sin(this.walkPhase) * amp;
      ud.body.position.y = Math.abs(Math.cos(this.walkPhase)) * amp * 0.12;
      this.kick = Math.max(0, this.kick - dt * 9);
      const reload = this.reloading > 0 ? Math.sin(now * 14) * 0.15 - 0.5 : 0;
      const heal = this.healing > 0 ? -0.9 : 0;
      const melee = WEAPONS[s ? s.id : 'fists'].melee;
      ud.armR.rotation.x = -this.kick * (melee ? 0 : 0.35) + reload + heal;
      ud.armL.rotation.x = reload * 1.4 + heal;
      ud.armR.position.z = melee ? this.kick * 0.35 : 0;
      ud.gunMount.position.z = 0.45 - this.kick * 0.12;
      ud.head.rotation.y = 0;
      // idle breathing
      ud.torso.scale.y = 1 + Math.sin(now * 3 + this.id) * 0.015;
    }

    // hurt flash
    const flash = this.hurtFlash;
    for (const mt of ud.mats) mt.emissive.setRGB(flash, flash * 0.25, flash * 0.25);

    // muzzle flash
    if (this.flash > 0) {
      this.flash -= dt;
      ud.flash.visible = true;
      const w = WEAPONS[s ? s.id : 'fists'];
      const len = w.shape.length ? Math.max(...w.shape.map((b) => b[0] + b[2])) * 0.9 : 0.5;
      ud.flash.position.set(Math.sin(0) * 0, 1.42 + ud.body.position.y, 0.45 + len + 0.2);
      ud.flash.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), 0);
      ud.flash.position.x = 0.12;
      ud.flash.scale.setScalar(0.18 + Math.random() * 0.14);
    } else ud.flash.visible = false;

    // overhead bar for bots
    if (this.bar) {
      const recently = now - this.lastHurt < 3;
      this.bar.visible = this.state === 'alive' && recently;
      if (this.bar.visible) {
        this.bar.position.set(this.x, 2.6, this.z);
        this.bar.quaternion.copy(camera.quaternion);
        const hp = clamp(this.health / 100, 0, 1), ar = clamp(this.armor / 80, 0, 1);
        this.bar.userData.fill.scale.x = Math.max(0.001, hp);
        this.bar.userData.fill.position.x = -(1 - hp) * 0.56;
        this.bar.userData.armor.scale.x = Math.max(0.001, ar);
        this.bar.userData.armor.position.x = -(1 - ar) * 0.56;
        this.bar.userData.armor.visible = this.armor > 0;
      }
    }
  }
}

// Flat silhouette drawn only where the player is hidden behind something
// (depthFunc GreaterDepth), so you never lose yourself behind a building.
// Order matters: world (0) -> silhouette (1) -> player body (2), so the
// body's own parts never count as occluders for its silhouette.
const silMat = new THREE.MeshBasicMaterial({ color: '#ffd23f', depthFunc: THREE.GreaterDepth, depthWrite: false });
function addSilhouette(model) {
  const meshes = [];
  model.traverse((o) => { if (o.isMesh && o !== model.userData.flash) meshes.push(o); });
  for (const m of meshes) {
    m.renderOrder = 2;
    const sil = new THREE.Mesh(m.geometry, silMat);
    sil.renderOrder = 1;
    m.add(sil);
  }
}

export { ARMOR_TIERS };
