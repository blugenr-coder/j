/* Weapon archetypes and the firing state machine (cooldown, burst, magazine,
   reload). Each archetype is tuned to feel different in the hand, not just
   to have different numbers: the Spark Cannon deletes up close and is useless
   at range, the Longshot is the opposite, the Launcher punishes groups. */

export const RARITIES = ['common', 'rare', 'epic', 'legendary'];
export const RARITY_INFO = {
  common:    { label: 'COMMON',    color: '#94A3B8', dmg: 1.00, mag: 1.00, reload: 1.00, rank: 0 },
  rare:      { label: 'RARE',      color: '#3B82F6', dmg: 1.12, mag: 1.15, reload: 0.92, rank: 1 },
  epic:      { label: 'EPIC',      color: '#A78BFA', dmg: 1.25, mag: 1.30, reload: 0.85, rank: 2 },
  legendary: { label: 'LEGENDARY', color: '#FF9F43', dmg: 1.40, mag: 1.45, reload: 0.78, rank: 3 },
};

/* fireRate: shots per second (for bursts: bursts per second).
   range: max travel distance. spread: radians of random cone. */
export const WEAPONS = {
  fists: {
    name: 'FISTS', icon: 'fist', melee: true,
    damage: 14, range: 52, fireRate: 2.6, projectileSpeed: 0, spread: 0,
    magazine: Infinity, reloadTime: 0, color: '#FFFFFF', auto: true, minRarity: 'common',
  },
  pebble: {
    name: 'PEBBLE BLASTER', icon: 'pistol',
    damage: 10, range: 380, fireRate: 5.2, projectileSpeed: 1050, spread: 0.07,
    magazine: 14, reloadTime: 1.15, color: '#FFD43B', auto: true, closeBonus: 1.2, minRarity: 'common',
  },
  burst: {
    name: 'BURST CASTER', icon: 'burst',
    damage: 13, range: 560, fireRate: 1.7, burst: 3, burstGap: 0.065, projectileSpeed: 1350, spread: 0.035,
    magazine: 18, reloadTime: 1.6, color: '#7DD3FC', auto: true, minRarity: 'common',
  },
  rapid: {
    name: 'RAPID POPPER', icon: 'smg',
    damage: 6.5, range: 440, fireRate: 11, projectileSpeed: 1150, spread: 0.13,
    magazine: 32, reloadTime: 1.75, color: '#4ADE80', auto: true, minRarity: 'common',
  },
  spark: {
    name: 'SPARK CANNON', icon: 'shotgun',
    damage: 9, pellets: 7, range: 290, fireRate: 1.05, projectileSpeed: 1100, spread: 0.5,
    magazine: 5, reloadTime: 2.0, color: '#FF9F43', auto: false, falloff: true, minRarity: 'common',
  },
  needle: {
    name: 'FROST NEEDLE', icon: 'dmr',
    damage: 25, range: 780, fireRate: 2.1, projectileSpeed: 1700, spread: 0.012,
    magazine: 10, reloadTime: 1.9, color: '#2DD4BF', auto: false, minRarity: 'rare',
  },
  longshot: {
    name: 'LONGSHOT', icon: 'sniper',
    damage: 52, range: 1050, fireRate: 0.85, projectileSpeed: 2300, spread: 0.004,
    magazine: 4, reloadTime: 2.3, color: '#F472B6', auto: false, longCrit: 520, minRarity: 'rare',
  },
  launcher: {
    name: 'ENERGY LAUNCHER', icon: 'launcher',
    damage: 48, range: 620, fireRate: 0.75, projectileSpeed: 560, spread: 0.02,
    magazine: 3, reloadTime: 2.4, color: '#A78BFA', auto: false, aoe: 95, minRarity: 'epic',
  },
};

export const WEAPON_SPAWN_WEIGHTS = [
  ['pebble', 22], ['burst', 18], ['rapid', 18], ['spark', 16], ['needle', 11], ['longshot', 8], ['launcher', 6],
];

export function bumpRarity(rarity, min) {
  return RARITY_INFO[rarity].rank < RARITY_INFO[min].rank ? min : rarity;
}

/* A concrete gun: a definition plus rarity scaling plus its own ammo state. */
export function makeWeapon(id, rarity = 'common') {
  const def = WEAPONS[id];
  rarity = bumpRarity(rarity, def.minRarity);
  const r = RARITY_INFO[rarity];
  const mag = def.magazine === Infinity ? Infinity : Math.round(def.magazine * r.mag);
  return {
    id, rarity, def,
    damage: def.damage * r.dmg,
    magazine: mag,
    ammo: mag,
    reloadTime: def.reloadTime * r.reload,
    cooldown: 0,
    reloadT: 0,
    burstLeft: 0,
    burstT: 0,
    triggerHeld: false,
  };
}

/* Rough "how good is this gun" for auto-highlighting better loot and for bots. */
export function weaponScore(w) {
  if (!w) return 0;
  const d = w.def;
  if (d.melee) return 5;
  const shots = (d.pellets || 1) * (d.burst || 1);
  const dps = w.damage * shots * d.fireRate * (d.pellets ? 0.6 : 1) * (d.aoe ? 1.5 : 1);
  const rangeF = Math.min(1.35, 0.6 + d.range / 900);
  return dps * rangeF;
}

/* Called every frame for every live combatant. Handles cooldown, reload and
   burst sequencing, and asks the projectile system to spawn shots. */
export function updateWeapon(match, ent, dt) {
  const w = ent.weapons[ent.activeSlot] || ent.fists;
  w.cooldown = Math.max(0, w.cooldown - dt);

  if (w.reloadT > 0) {
    w.reloadT -= dt;
    if (w.reloadT <= 0) {
      w.reloadT = 0; w.ammo = w.magazine;
      match.bus.emit('reloadDone', { ent });
    }
    if (!ent.wantFire) return;
    // Firing an empty gun while reloading just waits.
    return;
  }

  // Burst continuation
  if (w.burstLeft > 0) {
    w.burstT -= dt;
    if (w.burstT <= 0 && w.ammo > 0) {
      fireOne(match, ent, w);
      w.burstLeft--; w.burstT = w.def.burstGap;
      if (w.ammo <= 0) { w.burstLeft = 0; startReload(match, ent, w); }
    }
    return;
  }

  if (!ent.wantFire) { w.triggerHeld = false; return; }
  if (ent.healing) cancelHeal(match, ent);
  if (w.cooldown > 0) return;
  // Semi-auto weapons need the trigger released between shots — except for
  // bots and touch "hold" which re-press on their own cadence.
  if (!w.def.auto && w.triggerHeld && !ent.autoTrigger) return;
  if (w.ammo <= 0) { startReload(match, ent, w); return; }

  w.triggerHeld = true;
  w.cooldown = 1 / w.def.fireRate;
  if (w.def.burst) {
    fireOne(match, ent, w);
    w.burstLeft = w.def.burst - 1; w.burstT = w.def.burstGap;
  } else {
    fireOne(match, ent, w);
  }
  if (w.ammo <= 0 && w.burstLeft === 0) startReload(match, ent, w);
}

export function startReload(match, ent, w) {
  if (w.def.melee || w.reloadT > 0 || w.ammo >= w.magazine) return;
  w.reloadT = w.reloadTime;
  match.bus.emit('reloadStart', { ent, weapon: w });
}

function cancelHeal(match, ent) {
  ent.healing = null;
  match.bus.emit('healCancel', { ent });
}

function fireOne(match, ent, w) {
  const d = w.def;
  const a = ent.aimAngle;
  ent.attackAnim = 1;
  if (d.melee) {
    match.combat.melee(ent, w);
    match.bus.emit('shot', { ent, weapon: w, angle: a });
    return;
  }
  w.ammo--;
  const pellets = d.pellets || 1;
  const muzzle = ent.radius + 14;
  const mx = ent.x + Math.cos(a) * muzzle, my = ent.y + Math.sin(a) * muzzle;
  for (let i = 0; i < pellets; i++) {
    const spread = pellets > 1
      ? (i / (pellets - 1) - 0.5) * d.spread + match.rng.range(-0.04, 0.04)
      : match.rng.range(-d.spread, d.spread) * (ent.moving ? 1.25 : 0.8);
    match.projectiles.spawn(ent, w, mx, my, a + spread);
  }
  // Recoil nudge: small, readable, arcade.
  ent.vx -= Math.cos(a) * (d.pellets ? 90 : 20);
  ent.vy -= Math.sin(a) * (d.pellets ? 90 : 20);
  match.bus.emit('shot', { ent, weapon: w, angle: a, x: mx, y: my });
}
