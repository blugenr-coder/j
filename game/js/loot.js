// Floor loot: spawning, bobbing animation, pickup fly-to-player animation,
// proximity queries for the player prompt and for bots.
import { makeLootModel } from './models.js';
import { RARITY, WEAPONS, AMMO, ITEMS, LOOT_WEAPONS, WEAPON_WEIGHTS, RARITY_WEIGHTS, ARMOR_TIERS } from './config.js';
import { pickWeighted, pickIndexWeighted } from './util.js';

let nextId = 1;

export function itemLabel(it) {
  switch (it.type) {
    case 'weapon': return `${RARITY[it.rarity].name} ${WEAPONS[it.id].name}`;
    case 'ammo': return `${AMMO[it.id].name} ×${it.amount}`;
    case 'armor': return `${RARITY[it.tier].name} Armor (${ARMOR_TIERS[it.tier]})`;
    case 'medkit': return `Medkit ×${it.amount || 1}`;
    case 'grenade': return `Grenade ×${it.amount || 1}`;
    case 'soda': return `Zoom Soda ×${it.amount || 1}`;
  }
  return 'Item';
}
export function itemColor(it) {
  if (it.type === 'weapon') return RARITY[it.rarity].color;
  if (it.type === 'armor') return RARITY[it.tier].color;
  if (it.type === 'ammo') return AMMO[it.id].color;
  return ITEMS[it.type] ? ITEMS[it.type].color : '#fff';
}

export function rollWeapon(rng, bonus = 0) {
  const id = pickWeighted(WEAPON_WEIGHTS, rng);
  const rarity = Math.min(4, pickIndexWeighted(RARITY_WEIGHTS, rng) + bonus);
  return { type: 'weapon', id, rarity, mag: -1 };
}

export function rollItem(rng, bonus = 0) {
  const r = rng();
  if (r < 0.36) return rollWeapon(rng, bonus);
  if (r < 0.62) {
    const id = ['light', 'medium', 'shells', 'heavy'][pickIndexWeighted([34, 32, 22, 12], rng)];
    return { type: 'ammo', id, amount: AMMO[id].pickup };
  }
  if (r < 0.75) return { type: 'medkit', amount: 1 };
  if (r < 0.86) {
    const tier = Math.min(3, 1 + pickIndexWeighted([68, 25, 7], rng) + (bonus > 0 ? 1 : 0));
    return { type: 'armor', tier };
  }
  if (r < 0.94) return { type: 'grenade', amount: 1 };
  return { type: 'soda', amount: 1 };
}

export class LootManager {
  constructor(scene) {
    this.scene = scene;
    this.items = [];
    this.flying = [];
  }

  clear() {
    for (const it of this.items) this.scene.remove(it.model);
    for (const f of this.flying) this.scene.remove(f.model);
    this.items = []; this.flying = [];
  }

  spawn(item, x, z, pop = false) {
    const it = { ...item, uid: nextId++, x, z, t: Math.random() * 6, pop: pop ? 0.5 : 0, vx: 0, vz: 0 };
    if (pop) { const a = Math.random() * Math.PI * 2, s = 2 + Math.random() * 3; it.vx = Math.cos(a) * s; it.vz = Math.sin(a) * s; }
    if (it.type === 'weapon' && it.mag < 0) it.mag = Math.round(WEAPONS[it.id].mag * (1 + 0.1 * it.rarity));
    it.model = makeLootModel(it);
    it.model.position.set(x, 0, z);
    this.scene.add(it.model);
    this.items.push(it);
    return it;
  }

  remove(it, flyTo) {
    const i = this.items.indexOf(it);
    if (i >= 0) this.items.splice(i, 1);
    if (flyTo) this.flying.push({ model: it.model, target: flyTo, t: 0 });
    else this.scene.remove(it.model);
  }

  nearest(x, z, r, filter) {
    let best = null, bd = r * r;
    for (const it of this.items) {
      const d = (it.x - x) ** 2 + (it.z - z) ** 2;
      if (d < bd && (!filter || filter(it))) { bd = d; best = it; }
    }
    return best;
  }

  update(dt, cx, cz, world) {
    for (const it of this.items) {
      if (it.pop > 0) {
        it.pop -= dt;
        const nx = it.x + it.vx * dt, nz = it.z + it.vz * dt;
        if (world.isWalkable(nx, nz)) { it.x = nx; it.z = nz; }
        it.vx *= 0.9; it.vz *= 0.9;
      }
      const near = Math.abs(it.x - cx) < 70 && Math.abs(it.z - cz) < 60;
      it.model.visible = near;
      if (!near) continue;
      it.t += dt;
      it.model.position.set(it.x, it.pop > 0 ? Math.sin((0.5 - it.pop) * Math.PI * 2) * 0.8 : 0, it.z);
      const inner = it.model.userData.inner;
      inner.rotation.y = it.t * 1.6;
      inner.position.y = 0.65 + Math.sin(it.t * 2.4) * 0.12;
      it.model.userData.disc.material.opacity = 0.32 + Math.sin(it.t * 3) * 0.12;
    }
    for (let i = this.flying.length - 1; i >= 0; i--) {
      const f = this.flying[i];
      f.t += dt * 4;
      const k = Math.min(1, f.t);
      f.model.position.x += (f.target.x - f.model.position.x) * k;
      f.model.position.z += (f.target.z - f.model.position.z) * k;
      f.model.position.y = 1 + k;
      f.model.scale.setScalar(Math.max(0.01, 1 - k));
      if (f.t >= 1) { this.scene.remove(f.model); this.flying.splice(i, 1); }
    }
  }
}

export { LOOT_WEAPONS };
