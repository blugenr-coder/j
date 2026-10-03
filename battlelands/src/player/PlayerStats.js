/* A combatant: the human and the bots share exactly this shape, so every
   system (movement, weapons, loot, damage) treats them the same. */
import { CONFIG } from '../core/config.js';
import { makeWeapon } from '../combat/WeaponManager.js';

export function createCombatant({ id, name, isPlayer = false, skin = 'scout', trail = null }) {
  const P = CONFIG.player;
  return {
    id, name, isPlayer, skin, trail,
    x: 0, y: 0, vx: 0, vy: 0, z: 0,
    radius: P.collisionRadius,
    facing: 0, aimAngle: 0, moveAngle: 0,
    moving: false, speedNow: 0,
    hp: P.maxHealth, maxHp: P.maxHealth,
    armor: 0, maxArmor: P.maxArmor,
    alive: true, airborne: true,
    weapons: [null, null], activeSlot: 0,
    fists: makeWeapon('fists'),
    heal: null, util: null,
    healing: null,           // { key, t, total }
    speedBoostT: 0,
    spawnShield: 0,
    wantFire: false, autoTrigger: true,
    inBush: null, inWater: false, inBuilding: null,
    kills: 0, damageDealt: 0, healed: 0, epicPickups: 0,
    place: 0, deathT: 0,
    hitFlash: 0, attackAnim: 0, walkCycle: 0,
    lastHitT: -99, lastAttacker: null, lastAttackT: -99,
    lastShotT: -99,
    emote: null,
    landX: 0, landY: 0,
    brain: null,
  };
}

export const activeWeapon = ent => ent.weapons[ent.activeSlot] || ent.fists;
