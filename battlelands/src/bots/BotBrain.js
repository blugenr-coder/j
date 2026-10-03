/* The bot decision loop:
     1 state  2 zone  3 loot  4 enemies  5 danger  6 destination  7 move  8 re-evaluate
   Bots do not home in on the human. They pick targets by what they can see,
   how close it is and how hurt it looks — the human is just another body. */
import { CONFIG } from '../core/config.js';
import { dist, dist2, angleTo, clamp } from '../core/math.js';
import { ITEMS } from '../world/LootManager.js';
import { startHeal, useUtility } from '../player/PlayerController.js';
import { chooseWeapon, preferredDistance, maintenance } from './BotCombat.js';

export const BotState = Object.freeze({
  SEARCHING: 'SEARCHING', LOOTING: 'LOOTING', ROTATING: 'ROTATING', FIGHTING: 'FIGHTING',
  RETREATING: 'RETREATING', HEALING: 'HEALING', EXPLORING: 'EXPLORING', ENDGAME: 'ENDGAME',
});

export const PERSONALITIES = {
  LOOTER:     { aggression: 0.42, lootDesire: 1.0, retreatHp: 0.42, explore: 0.3, zoneEarly: 0.55, lootRange: 520 },
  AGGRESSIVE: { aggression: 1.0,  lootDesire: 0.45, retreatHp: 0.16, explore: 0.6, zoneEarly: 0.35, lootRange: 320, chase: true },
  CAUTIOUS:   { aggression: 0.38, lootDesire: 0.7, retreatHp: 0.6,  explore: 0.25, zoneEarly: 1.0, lootRange: 380, cover: true },
  EXPLORER:   { aggression: 0.6,  lootDesire: 0.6, retreatHp: 0.35, explore: 1.0, zoneEarly: 0.6, lootRange: 420 },
  SNIPER:     { aggression: 0.62, lootDesire: 0.65, retreatHp: 0.4,  explore: 0.35, zoneEarly: 0.8, lootRange: 420, keepDistance: true, cover: true, preferred: ['longshot', 'needle', 'burst'] },
  ROAMER:     { aggression: 0.78, lootDesire: 0.45, retreatHp: 0.28, explore: 0.85, zoneEarly: 0.45, lootRange: 340, chase: true },
};
export const PERSONALITY_LIST = Object.keys(PERSONALITIES);

export function createBrain(rng, personality, skill) {
  return {
    personality, p: PERSONALITIES[personality],
    state: BotState.SEARCHING,
    seed: rng.range(0, 100),
    // skill 0..1 shapes every imperfection
    aimError: 0.42 - skill * 0.24,
    leadSkill: 0.2 + skill * 0.55,
    reaction: 0.75 - skill * 0.4,
    mistakeRate: 0.12 - skill * 0.09,
    speedFactor: 0.92 + skill * 0.08,
    thinkT: rng.range(0, CONFIG.bots.thinkInterval),
    target: null, targetVisible: false, targetLostT: 0, reactT: 0,
    lastSeen: null,
    dest: null, destKind: null, destItem: null,
    path: null, pathIdx: 0, repathT: 0,
    strafeDir: rng.chance(0.5) ? 1 : -1, strafeT: 0,
    stuckT: 0, lastX: 0, lastY: 0, unstickT: 0, unstickA: 0,
    wobblePhase: rng.range(0, 6),
    lazyZone: rng.chance(0.15 + (1 - skill) * 0.15), // makes the classic late-rotation mistake
    exploreGoal: null,
    heard: null, heardT: 0,
    decisions: new Map(),
  };
}

const VIEW = CONFIG.bots.viewRange;

function canSee(match, bot, other, d) {
  if (d > VIEW) return false;
  // Bushes hide you unless you are close or just fired.
  if (other.inBush && d > 150 && match.time - other.lastShotT > 0.8) return false;
  // Inside a building you are hidden from outside unless at the door / close.
  if (other.inBuilding && other.inBuilding !== bot.inBuilding && d > 220 && match.time - other.lastShotT > 0.8) return false;
  return match.map.hasLineOfSight(bot.x, bot.y, other.x, other.y);
}

export function think(match, bot) {
  const b = bot.brain;
  const p = b.p;
  const zone = match.zone;
  const ents = match.entities;

  /* 4. enemies --------------------------------------------------------- */
  let best = null, bestScore = Infinity;
  let threatsNear = 0;
  for (const o of ents) {
    if (o === bot || !o.alive || o.airborne) continue;
    const d = dist(bot.x, bot.y, o.x, o.y);
    if (d > VIEW) continue;
    if (!canSee(match, bot, o, d)) continue;
    if (d < 380) threatsNear++;
    let s = d;
    s -= (1 - (o.hp + o.armor) / 200) * 160 * p.aggression;   // hurt targets look tempting
    if (o === b.target) s -= 120;                                 // stickiness
    if (o === bot.lastAttacker && match.time - bot.lastAttackT < 3) s -= 250;
    if (s < bestScore) { bestScore = s; best = o; }
  }
  // Someone shooting us that we cannot see: turn towards them.
  if (!best && bot.lastAttacker && bot.lastAttacker.alive && match.time - bot.lastAttackT < 1.5) {
    b.heard = { x: bot.lastAttacker.x, y: bot.lastAttacker.y }; b.heardT = match.time;
  }
  if (best !== b.target) {
    b.reactT = b.reaction * (best && best.isPlayer && match.time - match.landTime < 20 ? 1.6 : 1);
  }
  b.target = best;
  b.targetVisible = !!best;
  if (best) b.lastSeen = { x: best.x, y: best.y, t: match.time };

  /* 2. zone ------------------------------------------------------------ */
  const safe = zone.safeTarget();
  const dSafe = dist(bot.x, bot.y, safe.x, safe.y);
  const outsideNow = zone.isOutside(bot.x, bot.y, 20);
  const outsideSafe = dSafe > safe.r * (0.85 - p.zoneEarly * 0.25);
  const zoneUrgent = outsideNow || (zone.stage !== 'wait' && outsideSafe && !(b.lazyZone && zone.stage === 'warning'));

  /* 5. danger --------------------------------------------------------- */
  const hpFrac = (bot.hp + bot.armor * 0.5) / bot.maxHp;
  const weak = bot.hp < bot.maxHp * p.retreatHp;
  const armed = !!(bot.weapons[0] || bot.weapons[1]);
  const endgame = match.aliveCount() <= 5;
  const aggression = clamp(p.aggression + (endgame ? 0.3 : 0) + (armed ? 0 : -0.5), 0, 1.3);

  /* 1+6. pick state and destination ---------------------------------- */
  let state = BotState.SEARCHING;
  if (best && weak && dist(bot.x, bot.y, best.x, best.y) < 420 && !outsideNow) {
    state = BotState.RETREATING;
  } else if (!best && bot.heal && needsHeal(bot) && !outsideNow && match.time - bot.lastHitT > 1.2) {
    state = BotState.HEALING;
  } else if (best && wantsFight(match, bot, best, aggression, armed, endgame)) {
    state = BotState.FIGHTING;
  } else if (zoneUrgent) {
    state = BotState.ROTATING;
  } else if (endgame) {
    state = BotState.ENDGAME;
  } else {
    const item = findLoot(match, bot);
    if (item) { state = BotState.LOOTING; b.destItem = item; }
    else if (b.heard && match.time - b.heardT < 4 && aggression > 0.5) state = BotState.SEARCHING;
    else state = BotState.EXPLORING;
  }
  // Mistake: sometimes keep doing the last thing a little too long.
  const sticky = b.state === BotState.EXPLORING || b.state === BotState.ROTATING || b.state === BotState.ENDGAME;
  if (state !== b.state && sticky && state !== BotState.FIGHTING && match.rng.chance(b.mistakeRate * 0.5)) state = b.state;
  b.state = state;
  b.engaged = state === BotState.FIGHTING || state === BotState.RETREATING;

  if (best) chooseWeapon(match, bot, dist(bot.x, bot.y, best.x, best.y));
  else maintenance(match, bot);

  switch (state) {
    case BotState.FIGHTING: {
      const d = dist(bot.x, bot.y, best.x, best.y);
      const want = preferredDistance(bot);
      const a = angleTo(best.x, best.y, bot.x, bot.y); // away from target
      b.strafeT -= CONFIG.bots.thinkInterval;
      if (b.strafeT <= 0) { b.strafeDir *= -1; b.strafeT = match.rng.range(0.5, 1.3); }
      let r = want;
      if (p.chase && best.hp < 45) r = Math.min(want, 90);
      if (d > want * 1.3 && !p.chase && p.keepDistance) r = d; // happy to hold range
      const sa = a + b.strafeDir * 0.75;
      let tx = best.x + Math.cos(sa) * r, ty = best.y + Math.sin(sa) * r;
      if (p.cover && match.rng.chance(0.5)) {
        const c = coverPoint(match, bot, best);
        if (c) { tx = c[0]; ty = c[1]; }
      }
      // Never fight our way out of the zone.
      if (zone.isOutside(tx, ty, 40)) { tx = (tx + safe.x) / 2; ty = (ty + safe.y) / 2; }
      setDest(match, bot, tx, ty, 'fight', true);
      if (bot.util && bot.util.key === 'soda' && d > 300 && p.chase) useUtility(match, bot);
      break;
    }
    case BotState.RETREATING: {
      const c = coverPoint(match, bot, best);
      let tx, ty;
      if (c) [tx, ty] = c;
      else {
        const a = angleTo(best.x, best.y, bot.x, bot.y);
        tx = bot.x + Math.cos(a) * 300; ty = bot.y + Math.sin(a) * 300;
        // Bias retreat towards the safe zone.
        tx = tx * 0.7 + safe.x * 0.3; ty = ty * 0.7 + safe.y * 0.3;
      }
      setDest(match, bot, tx, ty, 'retreat', true);
      if (bot.util && (bot.util.key === 'smoke' || bot.util.key === 'soda') && match.rng.chance(0.25)) useUtility(match, bot);
      if (bot.heal && match.time - bot.lastHitT > 1.4) startHeal(match, bot);
      break;
    }
    case BotState.HEALING:
      b.dest = null; b.path = null;
      startHeal(match, bot);
      break;
    case BotState.ROTATING: {
      const a = match.rng.range(0, Math.PI * 2), rr = safe.r * match.rng.range(0.2, 0.55);
      if (!b.dest || b.destKind !== 'zone' || dist(b.dest[0], b.dest[1], safe.x, safe.y) > safe.r * 0.7)
        setDest(match, bot, safe.x + Math.cos(a) * rr, safe.y + Math.sin(a) * rr, 'zone');
      if (bot.util && bot.util.key === 'soda' && zone.isOutside(bot.x, bot.y, -60)) useUtility(match, bot);
      break;
    }
    case BotState.LOOTING: {
      const it = b.destItem;
      setDest(match, bot, it.x, it.y, 'loot');
      break;
    }
    case BotState.ENDGAME: {
      const a = match.rng.range(0, Math.PI * 2), rr = safe.r * 0.4 * match.rng.next();
      if (!b.dest || b.destKind !== 'end' || match.rng.chance(0.08)) setDest(match, bot, safe.x + Math.cos(a) * rr, safe.y + Math.sin(a) * rr, 'end');
      break;
    }
    case BotState.SEARCHING:
      if (b.heard) setDest(match, bot, b.heard.x, b.heard.y, 'search');
      break;
    case BotState.EXPLORING:
    default: {
      if (!b.dest || b.destKind !== 'explore' || dist(bot.x, bot.y, b.dest[0], b.dest[1]) < 60 || !zone.insideNext(b.dest[0], b.dest[1], 50)) {
        const g = pickExploreGoal(match, bot, safe);
        setDest(match, bot, g[0], g[1], 'explore');
      }
    }
  }

  // Top up between fights.
  if (!best && bot.util && bot.util.key === 'soda' && zoneUrgent && dSafe > safe.r + 300) useUtility(match, bot);
  void hpFrac;
}

/* Seeing someone is not the same as picking a fight. Early on most bots only
   fight what is close or what shot them; as the match tightens they commit. */
function wantsFight(match, bot, o, aggression, armed, endgame) {
  const d = dist(bot.x, bot.y, o.x, o.y);
  const liveT = match.time - match.landTime;
  if (liveT < 7) return false;                              // grab a gun first
  if (o === bot.lastAttacker && match.time - bot.lastAttackT < 4) return true;
  if (!armed) return d < 70 && aggression > 0.7;
  if (endgame) return true;
  const progress = clamp((liveT - 30) / 300, 0, 1);
  const engage = liveT < 40 ? 60 + 110 * aggression : 140 + (VIEW - 140) * Math.min(1, aggression * (0.2 + progress) * 1.1);
  if (d > engage) return false;
  // Decide once per opponent and stick with it for a while: early on, most
  // bots would rather keep looting than start a fight.
  const memo = bot.brain.decisions;
  const prev = memo.get(o.id);
  if (prev && prev.until > match.time) return prev.fight;
  const pFight = clamp(aggression * (0.12 + 0.88 * progress), 0.04, 0.95);
  const fight = match.rng.chance(pFight);
  memo.set(o.id, { fight, until: match.time + (fight ? 12 : 7) });
  return fight;
}

function needsHeal(bot) {
  const def = ITEMS[bot.heal.key];
  if (def.heal) return bot.hp < bot.maxHp - def.heal * 0.6;
  return bot.armor < bot.maxArmor - def.armor * 0.6;
}

function findLoot(match, bot) {
  const b = bot.brain;
  const range = b.p.lootRange * (0.6 + b.p.lootDesire * 0.6);
  let best = null, bestS = Infinity;
  match.loot.query(bot.x, bot.y, range, it => {
    if (!match.loot.isBetter(bot, it)) return;
    if (match.zone.isOutside(it.x, it.y, 20) && match.zone.stage !== 'wait') return;
    const d = dist(bot.x, bot.y, it.x, it.y);
    let s = d;
    if (it.type === 'weapon' && !bot.weapons[0]) s -= 300;
    if (it.type === 'armor' && bot.armor < 30) s -= 120;
    s -= { common: 0, rare: 40, epic: 90, legendary: 160 }[it.rarity];
    // Several bots shouldn't all queue for the same pistol.
    if (it._claimT > match.time && it._claim !== bot) s += 260;
    if (s < bestS) { bestS = s; best = it; }
  });
  if (best) { best._claim = bot; best._claimT = match.time + 1.5; }
  return best;
}

function pickExploreGoal(match, bot, safe) {
  const rng = match.rng;
  const p = bot.brain.p;
  const pois = match.map.pois.filter(q => dist(q.x, q.y, safe.x, safe.y) < safe.r * 0.85 + 60);
  if (pois.length && rng.chance(0.35 + p.explore * 0.45)) {
    const q = rng.pick(pois);
    const a = rng.range(0, Math.PI * 2), r = rng.range(0, q.r * 0.6);
    return [q.x + Math.cos(a) * r, q.y + Math.sin(a) * r];
  }
  const a = rng.range(0, Math.PI * 2), r = Math.sqrt(rng.next()) * safe.r * 0.8;
  return match.map.clampToLand(safe.x + Math.cos(a) * r, safe.y + Math.sin(a) * r);
}

/* The far side of a nearby solid prop, relative to the threat. */
function coverPoint(match, bot, threat) {
  let best = null, bd = Infinity;
  // Collect first: circleBlocked queries the same grid, and grid queries don't nest.
  const near = [];
  match.map.grid.query(bot.x - 220, bot.y - 220, bot.x + 220, bot.y + 220, ob => { near.push(ob); });
  for (const ob of near) {
    if (!ob.blocksShots || ob.kind === 'tree' || ob.kind === 'pole') continue;
    const cx = ob.type === 'circle' ? ob.x : ob.x + ob.w / 2;
    const cy = ob.type === 'circle' ? ob.y : ob.y + ob.h / 2;
    const size = ob.type === 'circle' ? ob.r : Math.min(ob.w, ob.h) / 2 + 6;
    if (size < 14) continue;
    const a = angleTo(threat.x, threat.y, cx, cy);
    const off = size + bot.radius + 10;
    const px = cx + Math.cos(a) * off, py = cy + Math.sin(a) * off;
    const d = dist2(bot.x, bot.y, px, py);
    if (d < bd && !match.map.circleBlocked(px, py, bot.radius)) { bd = d; best = [px, py]; }
  }
  return best;
}

export function setDest(match, bot, x, y, kind, quick = false) {
  const b = bot.brain;
  [x, y] = match.map.clampToLand(x, y);
  const changed = !b.dest || dist2(b.dest[0], b.dest[1], x, y) > 70 * 70 || b.destKind !== kind;
  b.dest = [x, y];
  b.destKind = kind;
  if (changed || !b.path) {
    // Short, clear hops skip A*.
    if (quick && dist(bot.x, bot.y, x, y) < 260 && match.map.hasLineOfSight(bot.x, bot.y, x, y)) {
      b.path = [[x, y]]; b.pathIdx = 0;
    } else {
      b.needPath = true;
    }
  }
}
