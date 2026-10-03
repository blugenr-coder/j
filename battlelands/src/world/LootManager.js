/* Loot: what can spawn, where, how rare — and the pickup rules.
   Spawning draws only from the match seed, so a seed always produces the same
   island of loot. */

import { SpatialGrid } from '../core/SpatialGrid.js';
import { WEAPONS, RARITY_INFO, WEAPON_SPAWN_WEIGHTS, makeWeapon, weaponScore, bumpRarity } from '../combat/WeaponManager.js';
import { dist2 } from '../core/math.js';
import { CONFIG } from '../core/config.js';

export const ITEMS = {
  vest:       { kind: 'armor', name: 'ARMOR VEST', icon: 'armor', amount: { common: 25, rare: 50, epic: 75, legendary: 100 } },
  bandage:    { kind: 'heal', name: 'BANDAGE', icon: 'bandage', heal: 20, time: 1.0, stack: 5, rarity: 'common' },
  shieldcell: { kind: 'heal', name: 'SHIELD CELL', icon: 'shieldcell', armor: 35, time: 1.4, stack: 3, rarity: 'rare' },
  medkit:     { kind: 'heal', name: 'MEDKIT', icon: 'medkit', heal: 75, time: 2.6, stack: 2, rarity: 'epic' },
  frag:       { kind: 'util', name: 'FRAG BOMB', icon: 'frag', stack: 3, rarity: 'rare' },
  smoke:      { kind: 'util', name: 'SMOKE PUFF', icon: 'smoke', stack: 2, rarity: 'common' },
  soda:       { kind: 'util', name: 'SPEED SODA', icon: 'soda', stack: 2, rarity: 'rare' },
};

/* ---- The four tunables the design asks for ---------------------------- */

export const lootTable = {
  weapon: WEAPON_SPAWN_WEIGHTS,
  armor: [['vest', 1]],
  health: [['bandage', 55], ['shieldcell', 28], ['medkit', 17]],
  utility: [['frag', 40], ['smoke', 30], ['soda', 30]],
};

export const rarityWeights = {
  1: [['common', 58], ['rare', 29], ['epic', 11], ['legendary', 2]],
  2: [['common', 42], ['rare', 33], ['epic', 19], ['legendary', 6]],
  3: [['common', 26], ['rare', 34], ['epic', 27], ['legendary', 13]],
};

export const locationWeights = {
  indoor:  [['weapon', 44], ['armor', 18], ['health', 24], ['utility', 14]],
  outdoor: [['weapon', 34], ['armor', 16], ['health', 32], ['utility', 18]],
};

export const spawnRules = {
  chance: { 1: 0.78, 2: 0.88, 3: 0.97 },   // a spot is empty sometimes
  doubleChance: { 1: 0.05, 2: 0.15, 3: 0.35 }, // high-value spots can hold two
  scatter: 18,
};

/* ----------------------------------------------------------------------- */

let nextItemId = 1;

export function itemName(it) {
  return it.type === 'weapon' ? it.weapon.def.name : ITEMS[it.key].name;
}
export function itemIcon(it) {
  return it.type === 'weapon' ? it.weapon.def.icon : ITEMS[it.key].icon;
}
export function itemColor(it) { return RARITY_INFO[it.rarity].color; }

export class LootManager {
  constructor(match) {
    this.match = match;
    this.items = [];
    this.grid = new SpatialGrid(CONFIG.map.size, 160);
  }

  makeItem(type, key, rarity, x, y, count = 1, weapon = null) {
    const it = {
      id: nextItemId++, type, key, rarity, x, y, count,
      weapon: type === 'weapon' ? (weapon || makeWeapon(key, rarity)) : null,
      bornT: this.match.time, active: true,
    };
    if (it.weapon) it.rarity = it.weapon.rarity;
    this.items.push(it);
    this.grid.insert(it, x - 1, y - 1, x + 1, y + 1);
    return it;
  }

  remove(it) {
    it.active = false;
    this.grid.remove(it);
    const i = this.items.indexOf(it);
    if (i >= 0) { this.items[i] = this.items[this.items.length - 1]; this.items.pop(); }
  }

  rollItem(rng, tier, indoor, x, y) {
    const cat = rng.weighted(locationWeights[indoor ? 'indoor' : 'outdoor']);
    const rarity = rng.weighted(rarityWeights[tier]);
    if (cat === 'weapon') {
      const id = rng.weighted(lootTable.weapon);
      return this.makeItem('weapon', id, bumpRarity(rarity, WEAPONS[id].minRarity), x, y);
    }
    if (cat === 'armor') return this.makeItem('armor', 'vest', rarity, x, y);
    if (cat === 'health') {
      const key = rng.weighted(lootTable.health);
      return this.makeItem('heal', key, ITEMS[key].rarity, x, y, key === 'bandage' ? rng.int(2, 3) : 1);
    }
    const key = rng.weighted(lootTable.utility);
    return this.makeItem('util', key, ITEMS[key].rarity, x, y, key === 'frag' ? rng.int(1, 2) : 1);
  }

  spawnLoot(rng) {
    const map = this.match.map;
    for (const s of map.lootSpots) {
      if (!rng.chance(spawnRules.chance[s.tier])) continue;
      const n = rng.chance(spawnRules.doubleChance[s.tier]) ? 2 : 1;
      for (let i = 0; i < n; i++) {
        const x = s.x + rng.range(-spawnRules.scatter, spawnRules.scatter);
        const y = s.y + rng.range(-spawnRules.scatter, spawnRules.scatter);
        this.rollItem(rng, s.tier, !!s.indoor, x, y);
      }
    }
  }

  query(x, y, r, fn) {
    this.grid.query(x - r, y - r, x + r, y + r, it => {
      if (it.active && dist2(x, y, it.x, it.y) <= r * r) return fn(it);
    });
  }

  nearest(x, y, r, filter) {
    let best = null, bd = Infinity;
    this.query(x, y, r, it => {
      if (filter && !filter(it)) return;
      const d = dist2(x, y, it.x, it.y);
      if (d < bd) { bd = d; best = it; }
    });
    return best;
  }

  /* ---- pickup rules ---------------------------------------------------- */

  /* Is this item an upgrade for this combatant? Drives the ▲ badge and bots. */
  isBetter(ent, it) {
    if (it.type === 'weapon') {
      if (!ent.weapons[0] || !ent.weapons[1]) return !ent.weapons.some(w => w && w.id === it.key && RARITY_INFO[w.rarity].rank >= RARITY_INFO[it.rarity].rank);
      const worst = Math.min(weaponScore(ent.weapons[0]), weaponScore(ent.weapons[1]));
      return weaponScore(it.weapon) > worst * 1.08;
    }
    if (it.type === 'armor') return ent.armor < ITEMS.vest.amount[it.rarity] || ent.armor < ent.maxArmor * 0.5;
    const slot = it.type === 'heal' ? ent.heal : ent.util;
    if (!slot) return true;
    if (slot.key === it.key) return slot.count < ITEMS[it.key].stack;
    return RARITY_INFO[it.rarity].rank > RARITY_INFO[ITEMS[slot.key].rarity].rank;
  }

  /* Picked up without asking: anything that fills an empty slot or tops up. */
  canAutoPickup(ent, it) {
    if (it.type === 'weapon') return !ent.weapons[0] || !ent.weapons[1];
    if (it.type === 'armor') return ent.armor < ent.maxArmor;
    const slot = it.type === 'heal' ? ent.heal : ent.util;
    return !slot || (slot.key === it.key && slot.count < ITEMS[it.key].stack);
  }

  /* Take an item; may swap and drop what it replaces. Returns true if taken. */
  pickup(ent, it) {
    if (!it.active) return false;
    const m = this.match;
    let dropped = null;
    if (it.type === 'weapon') {
      let slot = ent.weapons[0] ? (ent.weapons[1] ? -1 : 1) : 0;
      if (slot === -1) {
        slot = ent.activeSlot;
        dropped = ent.weapons[slot];
      }
      ent.weapons[slot] = it.weapon;
      if (!ent.weapons[ent.activeSlot] || slot === ent.activeSlot || !dropped) ent.activeSlot = slot;
      this.remove(it);
      if (dropped) this.makeItem('weapon', dropped.id, dropped.rarity, it.x, it.y, 1, dropped);
    } else if (it.type === 'armor') {
      if (ent.armor >= ent.maxArmor) return false;
      ent.armor = Math.min(ent.maxArmor, ent.armor + ITEMS.vest.amount[it.rarity]);
      this.remove(it);
    } else {
      const field = it.type === 'heal' ? 'heal' : 'util';
      const slot = ent[field];
      const stack = ITEMS[it.key].stack;
      if (slot && slot.key === it.key) {
        const take = Math.min(stack - slot.count, it.count);
        if (take <= 0) return false;
        slot.count += take; it.count -= take;
        if (it.count <= 0) this.remove(it);
      } else {
        if (slot) dropped = slot;
        ent[field] = { key: it.key, count: Math.min(stack, it.count) };
        this.remove(it);
        if (dropped) this.makeItem(it.type, dropped.key, ITEMS[dropped.key].rarity, it.x, it.y, dropped.count);
      }
    }
    if (RARITY_INFO[it.rarity].rank >= 2) ent.epicPickups++;
    m.bus.emit('pickup', { ent, item: it, dropped });
    return true;
  }

  /* An eliminated combatant leaves everything behind in a small ring. */
  dropInventory(ent) {
    const drops = [];
    for (const w of ent.weapons) if (w) drops.push(['weapon', w.id, w.rarity, 1, w]);
    if (ent.heal) drops.push(['heal', ent.heal.key, ITEMS[ent.heal.key].rarity, ent.heal.count]);
    if (ent.util) drops.push(['util', ent.util.key, ITEMS[ent.util.key].rarity, ent.util.count]);
    if (ent.armor > 20) drops.push(['armor', 'vest', ent.armor >= 75 ? 'epic' : ent.armor >= 50 ? 'rare' : 'common', 1]);
    else drops.push(['heal', 'bandage', 'common', 2]);
    drops.forEach((d, i) => {
      const a = (i / drops.length) * Math.PI * 2 + 0.4;
      let x = ent.x + Math.cos(a) * 30, y = ent.y + Math.sin(a) * 30;
      if (this.match.map.circleBlocked(x, y, 10)) { x = ent.x; y = ent.y; }
      if (d[4]) { d[4].reloadT = 0; d[4].burstLeft = 0; }
      this.makeItem(d[0], d[1], d[2], x, y, d[3], d[4] || null);
    });
    ent.weapons = [null, null];
    ent.heal = null; ent.util = null;
  }
}
