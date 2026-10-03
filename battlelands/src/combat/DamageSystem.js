/* The one place hit points change. Armor soaks first; zone damage skips it.
   Every hit is announced on the match bus so effects, audio, HUD and stats
   can react without the damage code knowing they exist. */
import { clamp } from '../core/math.js';
import { CONFIG } from '../core/config.js';

export class DamageSystem {
  constructor(match) { this.match = match; }

  /* opts: { weapon, crit, dirX, dirY, knock, ignoreArmor, kind } */
  applyDamage(target, amount, source, opts = {}) {
    if (!target.alive || target.airborne || amount <= 0) return 0;
    const m = this.match;
    if (target.spawnShield > 0) return 0;
    let dmg = amount;
    // Bots hit softer than the human: keeps early fights from snowballing and
    // gives a new player time to react. Tuned with tests/simulate.mjs.
    if (source && source.isBot && opts.kind !== 'zone') dmg *= target.isBot ? CONFIG.bots.botVsBotMult : CONFIG.bots.damageMult;
    if (opts.crit) dmg *= 1.5;
    dmg = Math.round(dmg);
    let toArmor = 0;
    if (!opts.ignoreArmor && target.armor > 0) {
      toArmor = Math.min(target.armor, dmg);
      target.armor -= toArmor;
    }
    const toHp = dmg - toArmor;
    target.hp = clamp(target.hp - toHp, 0, target.maxHp);
    target.hitFlash = 1;
    target.lastHitT = m.time;
    if (source && source !== target) {
      target.lastAttacker = source;
      target.lastAttackT = m.time;
      source.damageDealt += dmg;
    }
    if (opts.knock && opts.dirX !== undefined) {
      target.vx += opts.dirX * opts.knock;
      target.vy += opts.dirY * opts.knock;
    }
    if (target.healing) { target.healing = null; m.bus.emit('healCancel', { ent: target }); }

    m.bus.emit('damage', {
      target, source, amount: dmg, armor: toArmor, crit: !!opts.crit,
      kind: opts.kind || 'shot', dirX: opts.dirX || 0, dirY: opts.dirY || 0,
      broke: toArmor > 0 && target.armor <= 0,
    });

    if (target.hp <= 0) this.eliminate(target, opts.kind === 'zone' ? null : source, opts);
    return dmg;
  }

  eliminate(target, killer, opts = {}) {
    const m = this.match;
    if (!target.alive) return;
    target.alive = false;
    target.hp = 0;
    target.deathT = m.time;
    target.place = m.aliveCount() + 1;
    if (killer && killer !== target) killer.kills++;
    m.loot.dropInventory(target);
    m.bus.emit('elimination', { target, killer, weapon: opts.weapon || null, kind: opts.kind || 'shot' });
    m.onElimination(target, killer);
  }
}
