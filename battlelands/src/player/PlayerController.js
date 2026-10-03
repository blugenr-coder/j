/* Arcade movement and the actions any combatant can take (heal, utility,
   swap, emote). Used verbatim by the human and by bots: bots just feed it
   their own "input". */
import { CONFIG } from '../core/config.js';
import { clamp, rotateTowards, angleDiff } from '../core/math.js';
import { ITEMS } from '../world/LootManager.js';
import { startReload } from '../combat/WeaponManager.js';
import { activeWeapon } from './PlayerStats.js';

const P = CONFIG.player;

/* ix, iy: desired direction, length 0..1 */
export function applyMovement(match, ent, ix, iy, dt) {
  const map = match.map;
  let speed = P.moveSpeed;
  ent.inWater = map.isWater(ent.x, ent.y);
  if (ent.inWater) speed *= P.waterSpeedFactor;
  if (ent.healing) speed *= P.healMoveFactor;
  if (ent.speedBoostT > 0) speed *= 1.3;
  if (ent.isBot) speed *= ent.brain ? ent.brain.speedFactor : 1;

  const tx = ix * speed, ty = iy * speed;
  const hasInput = ix * ix + iy * iy > 0.0025;
  const rate = (hasInput ? P.acceleration : P.deceleration) * dt;
  const dx = tx - ent.vx, dy = ty - ent.vy;
  const dl = Math.hypot(dx, dy);
  if (dl <= rate) { ent.vx = tx; ent.vy = ty; }
  else { ent.vx += (dx / dl) * rate; ent.vy += (dy / dl) * rate; }

  ent.x += ent.vx * dt;
  ent.y += ent.vy * dt;
  map.resolveCircle(ent);

  ent.speedNow = Math.hypot(ent.vx, ent.vy);
  ent.moving = ent.speedNow > 25;
  if (hasInput) ent.moveAngle = Math.atan2(iy, ix);
  if (ent.moving) ent.walkCycle += dt * ent.speedNow * 0.045;

  // Body faces where it shoots; when not shooting, where it walks.
  const target = (ent.wantFire || match.time - ent.lastShotT < 0.5 || ent.aiming) ? ent.aimAngle : (hasInput ? ent.moveAngle : ent.facing);
  ent.facing = rotateTowards(ent.facing, target, P.rotationSpeed * dt);
  if (!ent.aiming && !ent.wantFire && match.time - ent.lastShotT > 0.5 && Math.abs(angleDiff(ent.aimAngle, ent.facing)) > 0.01) {
    ent.aimAngle = ent.facing;
  }

  ent.inBush = map.inBush(ent.x, ent.y) || match.inSmoke(ent.x, ent.y);
  ent.inBuilding = map.buildingAt(ent.x, ent.y);
}

export function startHeal(match, ent) {
  if (!ent.heal || ent.healing || !ent.alive) return false;
  const def = ITEMS[ent.heal.key];
  if (def.heal && ent.hp >= ent.maxHp) return false;
  if (def.armor && ent.armor >= ent.maxArmor) return false;
  ent.healing = { key: ent.heal.key, t: 0, total: def.time };
  match.bus.emit('healStart', { ent });
  return true;
}

export function updateHealing(match, ent, dt) {
  const h = ent.healing;
  if (!h) return;
  h.t += dt;
  if (h.t >= h.total) {
    const def = ITEMS[h.key];
    if (def.heal) { const before = ent.hp; ent.hp = clamp(ent.hp + def.heal, 0, ent.maxHp); ent.healed += ent.hp - before; }
    if (def.armor) ent.armor = clamp(ent.armor + def.armor, 0, ent.maxArmor);
    ent.healing = null;
    if (ent.heal) { ent.heal.count--; if (ent.heal.count <= 0) ent.heal = null; }
    match.bus.emit('healDone', { ent, key: h.key });
  }
}

export function useUtility(match, ent) {
  if (!ent.util || !ent.alive || ent.airborne) return false;
  const key = ent.util.key;
  if (key === 'frag') match.throwables.throwFrag(ent);
  else if (key === 'smoke') match.addSmoke(ent.x + Math.cos(ent.aimAngle) * 90, ent.y + Math.sin(ent.aimAngle) * 90);
  else if (key === 'soda') { ent.speedBoostT = 6; }
  ent.util.count--;
  if (ent.util.count <= 0) ent.util = null;
  match.bus.emit('utility', { ent, key });
  return true;
}

export function switchWeapon(match, ent, slot) {
  if (slot === ent.activeSlot || !ent.alive) return;
  const cur = activeWeapon(ent);
  cur.burstLeft = 0;
  ent.activeSlot = slot;
  const w = activeWeapon(ent);
  w.cooldown = Math.max(w.cooldown, 0.18); // short draw time
  match.bus.emit('switch', { ent, slot });
}

export function reload(match, ent) {
  startReload(match, ent, activeWeapon(ent));
}

export function emote(match, ent, id) {
  ent.emote = { id, t: 2.2 };
  match.bus.emit('emote', { ent, id });
}
