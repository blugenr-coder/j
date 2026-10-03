/* One match, start to finish. Owns every gameplay system and runs them in a
   fixed order each frame. It touches no DOM and no canvas: rendering, audio
   and UI subscribe to this.bus. That is why a whole match can be simulated
   in Node for tests. */

import { CONFIG } from './config.js';
import { EventBus } from './EventBus.js';
import { makeRng } from './rng.js';
import { dist, dist2, angleTo, angleDiff, clamp } from './math.js';
import { Pool } from './Pool.js';
import { getMap } from '../world/MapManager.js';
import { LootManager } from '../world/LootManager.js';
import { ZoneManager } from '../world/ZoneManager.js';
import { chooseBotLanding, findLandingSpot, separateLandings, botName } from '../world/SpawnManager.js';
import { getNav } from '../bots/BotNavigation.js';
import { BotController } from '../bots/BotController.js';
import { createBrain, PERSONALITY_LIST } from '../bots/BotBrain.js';
import { createCombatant, activeWeapon } from '../player/PlayerStats.js';
import { applyMovement, updateHealing, startHeal, useUtility, switchWeapon, reload, emote } from '../player/PlayerController.js';
import { updateWeapon } from '../combat/WeaponManager.js';
import { ProjectileSystem } from '../combat/ProjectileSystem.js';
import { DamageSystem } from '../combat/DamageSystem.js';
import { bodiesInRadius } from '../combat/HitDetection.js';
import { CHARACTERS } from '../progression/Cosmetics.js';

export const MatchPhase = Object.freeze({ DEPLOY: 'deploy', DESCENT: 'descent', LIVE: 'live', OVER: 'over' });

export class MatchManager {
  constructor({ seed = Date.now() >>> 0, playerName = 'YOU', skin = 'scout', trail = null, combatants = CONFIG.match.combatants, autopilot = false, gentle = false } = {}) {
    this.seed = seed >>> 0;
    this.bus = new EventBus();
    this.rng = makeRng(this.seed);
    this.map = getMap();
    this.nav = getNav(this.map);
    this.time = 0;
    this.phase = MatchPhase.DEPLOY;
    this.phaseT = CONFIG.match.deployChooseTime;
    this.landTime = 0;
    this.entities = [];
    this.smokes = [];
    this.result = null;
    this.winner = null;
    this.aliveCache = combatants;
    this.autopilot = autopilot;
    // First (tutorial) match: bots hit the human softer while they learn.
    this.humanDamageMult = gentle ? 0.7 : 1;

    this.damage = new DamageSystem(this);
    this.projectiles = new ProjectileSystem(this);
    this.loot = new LootManager(this);
    this.throwables = new Throwables(this);
    this.combat = { melee: (ent, w) => this._melee(ent, w) };

    this.initializeMap();
    this.spawnLoot();
    this.zone = new ZoneManager(this, this.rng.fork(0x20e));
    this.spawnPlayer(playerName, skin, trail);
    this.spawnBots(combatants - 1);
    this.bots = new BotController(this, this.nav);
  }

  /* ---- setup --------------------------------------------------------- */

  initializeMap() { /* static map is shared; nothing per-match yet */ }

  spawnLoot() { this.loot.spawnLoot(this.rng.fork(0x1007)); }

  spawnPlayer(name, skin, trail) {
    const p = createCombatant({ id: 0, name, isPlayer: true, skin, trail });
    const [x, y] = findLandingSpot(this.map, this.map.size / 2, this.map.size / 2, this.rng, 200);
    p.landX = x; p.landY = y;
    if (this.autopilot) { p.isBot = true; p.brain = createBrain(this.rng, 'EXPLORER', 0.6); }
    this.player = p;
    this.entities.push(p);
  }

  spawnBots(n) {
    const rng = this.rng.fork(0xb07);
    const used = new Set();
    const counts = new Map();
    for (let i = 0; i < n; i++) {
      const personality = PERSONALITY_LIST[i % PERSONALITY_LIST.length];
      let name;
      do { name = botName(rng); } while (used.has(name));
      used.add(name);
      const bot = createCombatant({ id: i + 1, name, skin: rng.pick(CHARACTERS).id });
      bot.isBot = true;
      // Skill spread: most bots are middling, a few are sharp, a few are clumsy.
      const skill = clamp(0.5 + (rng.next() + rng.next() - 1) * 0.55, 0.08, 0.95);
      bot.brain = createBrain(rng, personality, skill);
      [bot.landX, bot.landY] = chooseBotLanding(this.map, rng, personality, counts);
      this.entities.push(bot);
    }
    separateLandings(this.map, rng, this.entities.filter(e => e.isBot && !e.isPlayer));
  }

  /* ---- deployment ---------------------------------------------------- */

  setPlayerLanding(x, y) {
    const [lx, ly] = findLandingSpot(this.map, x, y, this.rng, 30);
    this.player.landX = lx; this.player.landY = ly;
  }

  startDeployment() {
    this.phase = MatchPhase.DEPLOY;
    this.phaseT = CONFIG.match.deployChooseTime;
  }

  deploy() {
    if (this.phase !== MatchPhase.DEPLOY) return;
    this.phase = MatchPhase.DESCENT;
    this.phaseT = CONFIG.match.descentTime;
    for (const e of this.entities) {
      e.x = e.landX; e.y = e.landY; e.z = 1; e.airborne = true;
      e.descentDelay = e.isPlayer ? 0 : this.rng.range(0, 0.6);
    }
    this.bus.emit('deploy', {});
  }

  beginMatch() {
    this.phase = MatchPhase.LIVE;
    this.landTime = this.time;
    for (const e of this.entities) {
      e.airborne = false; e.z = 0;
      this.map.resolveCircle(e);
    }
    this.zone.start();
    this.bus.emit('matchStart', {});
  }

  /* ---- queries ------------------------------------------------------- */

  aliveCount() {
    let n = 0;
    for (const e of this.entities) if (e.alive) n++;
    return n;
  }

  inSmoke(x, y) {
    for (const s of this.smokes) if (dist2(x, y, s.x, s.y) < (s.r * 0.8) ** 2) return s;
    return null;
  }

  addSmoke(x, y) {
    this.smokes.push({ x, y, r: 0, maxR: 120, t: 9 });
    this.bus.emit('smoke', { x, y });
  }

  /* Nearest visible enemy within range of the player's gun, inside a cone
     around `around` (or anywhere if around is null). The auto-aim. */
  findAimTarget(ent, around, cone, range) {
    let best = null, bestS = Infinity;
    for (const o of this.entities) {
      if (o === ent || !o.alive || o.airborne) continue;
      const d = dist(ent.x, ent.y, o.x, o.y);
      if (d > range) continue;
      if (o.inBush && d > 160 && this.time - o.lastShotT > 0.8) continue;
      const a = angleTo(ent.x, ent.y, o.x, o.y);
      const off = around === null ? 0 : Math.abs(angleDiff(around, a));
      if (off > cone) continue;
      if (!this.map.hasLineOfSight(ent.x, ent.y, o.x, o.y)) continue;
      const s = d + off * 400;
      if (s < bestS) { bestS = s; best = o; }
    }
    return best;
  }

  /* The item the PICK UP button would take (one that isn't auto-collected). */
  focusItem() {
    const p = this.player;
    if (!p.alive || p.airborne) return null;
    let best = null, bd = Infinity;
    this.loot.query(p.x, p.y, CONFIG.player.pickupRadius, it => {
      const d = dist2(p.x, p.y, it.x, it.y);
      if (d < bd) { bd = d; best = it; }
    });
    return best;
  }

  /* ---- player actions (called by the UI) ------------------------------ */

  playerAction(action, arg) {
    const p = this.player;
    if (!p.alive || this.phase !== MatchPhase.LIVE) return false;
    switch (action) {
      case 'pickup': { const it = arg || this.focusItem(); return it ? this.loot.pickup(p, it) : false; }
      case 'heal': return startHeal(this, p);
      case 'util': return useUtility(this, p);
      case 'reload': reload(this, p); return true;
      case 'switch': if (p.weapons[arg] || arg === p.activeSlot) switchWeapon(this, p, arg); return true;
      case 'emote': emote(this, p, arg); return true;
    }
    return false;
  }

  /* ---- the frame ------------------------------------------------------ */

  /* input: { mx, my, aimAngle|null, fire, aiming, assist } */
  update(dt, input) {
    this.time += dt;
    switch (this.phase) {
      case MatchPhase.DEPLOY:
        this.phaseT -= dt;
        if (this.phaseT <= 0) this.deploy();
        break;
      case MatchPhase.DESCENT: this._updateDescent(dt, input); break;
      case MatchPhase.LIVE:
      case MatchPhase.OVER:
        this._updateLive(dt, input);
        break;
    }
  }

  _updateDescent(dt, input) {
    this.phaseT -= dt;
    const T = CONFIG.match.descentTime;
    for (const e of this.entities) {
      const t = clamp((T - this.phaseT - (e.descentDelay || 0)) / (T - 0.6), 0, 1);
      e.z = 1 - t;
      if (e.isPlayer && input && !this.autopilot) {
        // Gentle steering while parachuting.
        e.x += input.mx * 150 * dt; e.y += input.my * 150 * dt;
        [e.x, e.y] = this.map.clampToLand(e.x, e.y);
      }
    }
    if (this.phaseT <= 0) {
      for (const e of this.entities) {
        if (this.map.isWater(e.x, e.y) || this.map.circleBlocked(e.x, e.y, e.radius)) {
          [e.x, e.y] = findLandingSpot(this.map, e.x, e.y, this.rng, 40);
        }
        this.bus.emit('landed', { ent: e });
      }
      this.beginMatch();
    }
  }

  updatePlayer(dt, input) {
    const p = this.player;
    if (!p.alive || this.autopilot) return;
    input = input || { mx: 0, my: 0, aimAngle: null, fire: false };
    const w = activeWeapon(p);
    const range = w.def.melee ? 90 : w.def.range;
    if (input.aimAngle !== null && input.aimAngle !== undefined) {
      // Manual aim, nudged onto a nearby target (aim assist).
      p.aimAngle = input.aimAngle;
      const assist = input.assist ?? 0.5;
      if (assist > 0) {
        const t = this.findAimTarget(p, input.aimAngle, 0.12 + assist * 0.22, range);
        if (t) p.aimAngle = input.aimAngle + angleDiff(input.aimAngle, angleTo(p.x, p.y, t.x, t.y)) * (0.4 + assist * 0.6);
      }
      p.aiming = true;
    } else if (input.fire) {
      // Tap-to-fire: shoot the nearest visible enemy in range, else straight ahead.
      const t = this.findAimTarget(p, null, Math.PI, range * 0.98);
      p.aimAngle = t ? angleTo(p.x, p.y, t.x, t.y) : p.facing;
      p.aiming = true;
    } else {
      p.aiming = false;
    }
    p.wantFire = !!input.fire;
    applyMovement(this, p, input.mx || 0, input.my || 0, dt);

    // Auto-collect anything that fills an empty slot or tops one up.
    this.loot.query(p.x, p.y, CONFIG.player.pickupRadius * 0.75, it => {
      if (this.loot.canAutoPickup(p, it)) { this.loot.pickup(p, it); return false; }
    });
  }

  _updateLive(dt, input) {
    // 1. player
    this.updatePlayer(dt, input);
    // 2. bots
    this.bots.update(dt);
    // 3. weapons, healing, timers
    for (const e of this.entities) {
      if (!e.alive) continue;
      updateWeapon(this, e, dt);
      if (e.wantFire) e.lastShotT = this.time;
      updateHealing(this, e, dt);
      if (e.speedBoostT > 0) e.speedBoostT -= dt;
      if (e.hitFlash > 0) e.hitFlash = Math.max(0, e.hitFlash - dt * 6);
      if (e.attackAnim > 0) e.attackAnim = Math.max(0, e.attackAnim - dt * 7);
      if (e.emote) { e.emote.t -= dt; if (e.emote.t <= 0) e.emote = null; }
    }
    // 4. combat
    this.projectiles.update(dt);
    this.throwables.update(dt);
    this._separate();
    // 5. smoke
    for (let i = this.smokes.length - 1; i >= 0; i--) {
      const s = this.smokes[i];
      s.t -= dt;
      s.r = Math.min(s.maxR, s.r + dt * 260);
      if (s.t <= 0) this.smokes.splice(i, 1);
    }
    // 6. zone
    this.zone.update(dt);
    this._zoneDamage(dt);
  }

  _zoneDamage(dt) {
    const z = this.zone;
    for (const e of this.entities) {
      if (!e.alive) continue;
      if (z.isOutside(e.x, e.y)) {
        e.zoneAcc = (e.zoneAcc || 0) + dt;
        e.outsideZone = true;
        if (e.zoneAcc >= 0.5) {
          e.zoneAcc -= 0.5;
          this.damage.applyDamage(e, z.dps * 0.5, null, { ignoreArmor: true, kind: 'zone' });
        }
      } else { e.zoneAcc = 0; e.outsideZone = false; }
    }
  }

  /* Bodies push each other apart so nobody overlaps. */
  _separate() {
    const ents = this.entities;
    for (let i = 0; i < ents.length; i++) {
      const a = ents[i];
      if (!a.alive) continue;
      for (let j = i + 1; j < ents.length; j++) {
        const b = ents[j];
        if (!b.alive) continue;
        const dx = b.x - a.x, dy = b.y - a.y, r = a.radius + b.radius;
        const d2 = dx * dx + dy * dy;
        if (d2 < r * r && d2 > 0.0001) {
          const d = Math.sqrt(d2), push = (r - d) / 2;
          const nx = dx / d, ny = dy / d;
          a.x -= nx * push; a.y -= ny * push; b.x += nx * push; b.y += ny * push;
          this.map.resolveCircle(a); this.map.resolveCircle(b);
        }
      }
    }
  }

  _melee(ent, w) {
    const reach = w.def.range + ent.radius;
    let best = null, bd = Infinity;
    bodiesInRadius(this.entities, ent.x, ent.y, reach, (b, d) => {
      if (b === ent) return;
      const off = Math.abs(angleDiff(ent.aimAngle, angleTo(ent.x, ent.y, b.x, b.y)));
      if (off > 0.9) return;
      if (d < bd) { bd = d; best = b; }
    });
    if (best) {
      const a = angleTo(ent.x, ent.y, best.x, best.y);
      this.damage.applyDamage(best, w.damage, ent, { weapon: w, dirX: Math.cos(a), dirY: Math.sin(a), knock: 220, kind: 'melee' });
      this.bus.emit('impact', { x: best.x, y: best.y, color: '#FFFFFF', angle: a, body: true });
    }
  }

  /* ---- ending -------------------------------------------------------- */

  onElimination(target) {
    const alive = this.aliveCount();
    this.aliveCache = alive;
    if (target.isPlayer && !this.result) this.result = this.calculateResults(false);
    if (alive <= 1) {
      this.winner = this.entities.find(e => e.alive) || target;
      this.winner.place = 1;
      if (this.winner.isPlayer && !this.result) this.result = this.calculateResults(true);
      if (this.phase !== MatchPhase.OVER) {
        this.phase = MatchPhase.OVER;
        this.bus.emit('matchOver', { winner: this.winner });
      }
    }
  }

  calculateResults(won) {
    const p = this.player;
    return {
      won,
      place: won ? 1 : p.place,
      total: this.entities.length,
      kills: p.kills,
      damage: Math.round(p.damageDealt),
      healed: Math.round(p.healed),
      epicPickups: p.epicPickups,
      survival: Math.max(0, (won ? this.time : p.deathT) - this.landTime),
      seed: this.seed,
    };
  }
}

/* Thrown frag bombs: a short arc, a fuse, a bang. */
class Throwables {
  constructor(match) { this.match = match; this.pool = new Pool(24, () => ({})); }
  throwFrag(ent) {
    const m = this.match;
    const dist0 = 270;
    const tx = ent.x + Math.cos(ent.aimAngle) * dist0, ty = ent.y + Math.sin(ent.aimAngle) * dist0;
    const t = m.map.raycast(ent.x, ent.y, tx, ty, true);
    const g = this.pool.spawn();
    g.owner = ent; g.sx = ent.x; g.sy = ent.y;
    g.tx = ent.x + (tx - ent.x) * Math.max(0, t - 0.04); g.ty = ent.y + (ty - ent.y) * Math.max(0, t - 0.04);
    g.x = g.sx; g.y = g.sy; g.z = 0; g.t = 0; g.flight = 0.55; g.fuse = 1.15;
  }
  update(dt) {
    const m = this.match;
    this.pool.forEach(g => {
      g.t += dt;
      const k = Math.min(1, g.t / g.flight);
      g.x = g.sx + (g.tx - g.sx) * k; g.y = g.sy + (g.ty - g.sy) * k;
      g.z = Math.sin(k * Math.PI) * 60;
      if (g.t >= g.fuse) {
        g.active = false;
        const r = 115;
        bodiesInRadius(m.entities, g.x, g.y, r, (b, d) => {
          if (!m.map.hasLineOfSight(g.x, g.y, b.x, b.y)) return;
          const f = 1 - Math.min(1, d / (r + b.radius)) * 0.65;
          const dx = b.x - g.x, dy = b.y - g.y, l = Math.hypot(dx, dy) || 1;
          m.damage.applyDamage(b, 58 * f * (b === g.owner ? 0.5 : 1), g.owner, { dirX: dx / l, dirY: dy / l, knock: 420, kind: 'blast' });
        });
        m.bus.emit('explosion', { x: g.x, y: g.y, r, color: '#FF9F43' });
      }
    });
  }
}
