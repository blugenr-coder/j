/* How a bot aims, which gun it holds, and when it pulls the trigger.
   Bots are deliberately imperfect: they lead targets only partly, their aim
   wobbles more at range and against movers, and they need a moment to react. */
import { angleTo, angleDiff, dist, clamp } from '../core/math.js';
import { weaponScore, startReload } from '../combat/WeaponManager.js';
import { activeWeapon } from '../player/PlayerStats.js';
import { switchWeapon, useUtility } from '../player/PlayerController.js';

/* Best slot for the current fight distance. */
export function chooseWeapon(match, bot, d) {
  let best = -1, bestScore = 0;
  for (let i = 0; i < 2; i++) {
    const w = bot.weapons[i];
    if (!w) continue;
    let s = weaponScore(w);
    if (d > w.def.range * 0.95) s *= 0.15;
    if (w.def.pellets && d > 200) s *= 0.4;
    if (w.def.pellets && d < 160) s *= 1.6;
    if ((w.id === 'longshot' || w.id === 'needle') && d > 400) s *= 1.5;
    if ((w.id === 'longshot') && d < 160) s *= 0.4;
    if (w.ammo <= 0) s *= 0.5;
    const pref = bot.brain.p.preferred;
    if (pref && pref.includes(w.id)) s *= 1.2;
    if (s > bestScore) { bestScore = s; best = i; }
  }
  if (best >= 0 && best !== bot.activeSlot) switchWeapon(match, bot, best);
}

export function effectiveRange(bot) {
  const w = activeWeapon(bot);
  return w.def.range;
}

/* Sets aimAngle and wantFire for this frame. */
export function aimAndFire(match, bot, target, dt) {
  const b = bot.brain;
  bot.wantFire = false;
  if (!target || !target.alive) return;
  const w = activeWeapon(bot);
  const d = dist(bot.x, bot.y, target.x, target.y);

  // Partial target leading
  const speed = w.def.projectileSpeed || 1000;
  const tLead = (d / speed) * b.leadSkill;
  const px = target.x + target.vx * tLead, py = target.y + target.vy * tLead;
  let a = angleTo(bot.x, bot.y, px, py);

  // Aim error: a slowly drifting wobble, bigger at range and vs. movers.
  b.wobblePhase += dt * (2 + b.p.aggression);
  const moveF = Math.min(1, Math.hypot(target.vx, target.vy) / 250);
  const err = b.aimError * (0.6 + d / 700) * (0.7 + moveF * 0.7) * (target.inBush ? 1.4 : 1);
  a += Math.sin(b.wobblePhase) * err + Math.sin(b.wobblePhase * 2.7 + b.seed) * err * 0.5;
  bot.aimAngle = a;
  bot.aiming = true;

  if (b.reactT > 0) { b.reactT -= dt; return; }
  if (d > w.def.range * (w.def.melee ? 1 : 0.97)) return;
  if (Math.abs(angleDiff(bot.facing, a)) > 0.35) return;
  if (!b.targetVisible) return;
  // Don't waste a launcher shell point-blank.
  if (w.def.aoe && d < 110) return;
  bot.wantFire = true;

  // Opportunistic frag at a mid-range target that is hugging cover.
  if (bot.util && bot.util.key === 'frag' && d > 160 && d < 330 && match.rng.chance(0.004 + b.p.aggression * 0.004)) {
    useUtility(match, bot);
  }
}

export function maintenance(match, bot) {
  const w = activeWeapon(bot);
  if (!w.def.melee && w.reloadT <= 0 && w.ammo < w.magazine * 0.5) startReload(match, bot, w);
}

export function preferredDistance(bot) {
  const w = activeWeapon(bot);
  if (w.def.melee) return 20;
  if (w.def.pellets) return 110;
  const p = bot.brain.p;
  return clamp(w.def.range * (p.keepDistance ? 0.75 : 0.5), 120, 650);
}
