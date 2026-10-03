/* Who lands where. Bots pick landing spots by personality: looters and
   aggressive bots dive the high-value towns, cautious ones and snipers take a
   quiet shed at the edge, explorers and roamers scatter. */
import { dist2 } from '../core/math.js';

export function findLandingSpot(map, x, y, rng, spread = 0) {
  for (let i = 0; i < 30; i++) {
    const a = rng.range(0, Math.PI * 2), r = spread * Math.sqrt(rng.next()) + i * 6;
    const [px, py] = map.clampToLand(x + Math.cos(a) * r, y + Math.sin(a) * r);
    if (!map.isWater(px, py, 10) && !map.circleBlocked(px, py, 24)) return [px, py];
  }
  return map.clampToLand(x, y);
}

/* POIs fill up: a crowded town sends late deciders elsewhere, so hot drops
   stay hot without wiping out a third of the lobby in the first minute. */
const CAPACITY = { 1: 3, 2: 3, 3: 4 };

export function chooseBotLanding(map, rng, personality, counts = new Map()) {
  const open = p => (counts.get(p.id) || 0) < CAPACITY[p.tier];
  let pois = map.pois.filter(open);
  if (!pois.length) pois = map.pois;
  let hot = pois.filter(p => p.tier === 3);
  let mid = pois.filter(p => p.tier === 2);
  if (!hot.length) hot = pois;
  if (!mid.length) mid = pois;
  const pick = base => {
    counts.set(base.id, (counts.get(base.id) || 0) + 1);
    return findLandingSpot(map, base.x, base.y, rng, base.r * 0.75);
  };
  const minor = map.lootSpots.filter(s => !s.poi);
  let base;
  switch (personality) {
    case 'LOOTER': base = rng.chance(0.6) ? rng.pick(hot) : rng.pick(mid); break;
    case 'AGGRESSIVE': base = rng.chance(0.75) ? rng.pick(hot) : rng.pick(pois); break;
    case 'CAUTIOUS':
    case 'SNIPER': {
      const s = rng.pick(minor);
      return findLandingSpot(map, s.x, s.y, rng, 60);
    }
    case 'EXPLORER': base = rng.pick(pois); break;
    default: {
      if (rng.chance(0.5)) { const s = rng.pick(minor); return findLandingSpot(map, s.x, s.y, rng, 80); }
      base = rng.pick(pois);
    }
  }
  return pick(base);
}

/* Keep bots from stacking on the exact same pixel. */
export function separateLandings(map, rng, ents) {
  for (let i = 0; i < ents.length; i++) for (let j = 0; j < i; j++) {
    const a = ents[i], b = ents[j];
    for (let k = 0; k < 6 && dist2(a.landX, a.landY, b.landX, b.landY) < 200 * 200; k++) {
      [a.landX, a.landY] = findLandingSpot(map, a.landX, a.landY, rng, 160 + k * 40);
    }
  }
}

const SYL_A = ['Zip', 'Mo', 'Pix', 'Bo', 'Ka', 'Lu', 'Dex', 'Fi', 'Gus', 'Ri', 'To', 'Ve', 'Nu', 'Ja', 'Qui', 'Sa', 'Wi', 'Yo', 'Cro', 'Ble'];
const SYL_B = ['bo', 'chi', 'zz', 'ka', 'ny', 'per', 'lo', 'mo', 'rex', 'ttle', 'dle', 'po', 'ki', 'xo', 'ra', 'mp'];
export function botName(rng) {
  const n = rng.pick(SYL_A) + rng.pick(SYL_B);
  return rng.chance(0.45) ? n + rng.int(1, 99) : n;
}
