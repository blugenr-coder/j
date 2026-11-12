// All static game content: parts catalog, categories, levels and quest pools.
// Units: mass kg, fuel kg, thrust kN (vacuum), isp seconds, sizes metres, price dollars.

export const CATS = [
  { id: 'core', name: 'Command' },
  { id: 'tank', name: 'Fuel Tanks' },
  { id: 'engine', name: 'Engines' },
  { id: 'aero', name: 'Aerodynamics' },
  { id: 'util', name: 'Structure' },
  { id: 'recovery', name: 'Recovery' },
  { id: 'science', name: 'Science' },
  { id: 'payload', name: 'Payload' },
];

export const PARTS = [
  // ---------- command ----------
  { id: 'core_probe', name: 'Pip Probe Core', cat: 'core', price: 3000, mass: 50, h: 0.6, r: 0.45, shape: 'probe', color: 0xd6dbe1, core: { sas: 1 }, hp: 60, desc: 'Tiny unmanned flight computer with weak gyros. Every rocket needs a command part.' },
  { id: 'core_avionics', name: 'Avionics Hub', cat: 'core', price: 9500, mass: 120, h: 0.7, r: 0.6, shape: 'probe', color: 0x475569, core: { sas: 2.2 }, hp: 90, resist: { elec: 0.5 }, desc: 'Stronger gyros, redundant computers. Halves electrical failures.' },
  { id: 'core_kestrel', name: 'Kestrel Crew Pod', cat: 'core', price: 42000, mass: 850, h: 1.5, r: 0.9, shape: 'capsule', color: 0xe5e7eb, core: { sas: 2 }, crew: 1, hp: 200, desc: 'One-seat capsule. Required for crewed contracts.' },
  { id: 'core_atlas', name: 'Atlas Crew Pod', cat: 'core', price: 95000, mass: 2100, h: 2.0, r: 1.25, shape: 'capsule', color: 0xf3f4f6, core: { sas: 3.5 }, crew: 3, hp: 320, desc: 'Three-seat command module with heavy gyros.' },

  // ---------- tanks ----------
  { id: 'tank_s', name: 'T-100 Fuel Tank', cat: 'tank', price: 1500, mass: 60, fuel: 250, h: 1.0, r: 0.6, shape: 'tank', color: 0xeef2f6, hp: 60, desc: 'Small and cheap.' },
  { id: 'tank_m', name: 'T-400 Fuel Tank', cat: 'tank', price: 4800, mass: 180, fuel: 1100, h: 2.2, r: 0.6, shape: 'tank', color: 0xeef2f6, hp: 90, desc: 'The workhorse tank.' },
  { id: 'tank_carbon', name: 'Carbon-Lite Tank', cat: 'tank', price: 21000, mass: 70, fuel: 1100, h: 2.2, r: 0.6, shape: 'tank', color: 0x1f2937, hp: 70, desc: 'Same fuel as a T-400 at a third of the dry mass. Pricey.' },
  { id: 'tank_l', name: 'T-1600 Fuel Tank', cat: 'tank', price: 22000, mass: 600, fuel: 4800, h: 3.0, r: 1.0, shape: 'tank', color: 0xf5efe3, hp: 150, desc: 'Wide body tank for real lifters.' },
  { id: 'tank_xl', name: 'T-6400 Fuel Tank', cat: 'tank', price: 52000, mass: 2200, fuel: 19000, h: 4.6, r: 1.4, shape: 'tank', color: 0xf5efe3, hp: 260, desc: 'Enormous. Needs an enormous engine.' },

  // ---------- engines ----------
  { id: 'eng_sparrow', name: 'Sparrow Engine', cat: 'engine', price: 3500, mass: 110, h: 0.8, r: 0.5, shape: 'engine', color: 0x9ca3af, engine: { thrust: 26, ispSL: 200, ispVac: 235, gimbal: 1 }, hp: 60, desc: 'Small liquid engine. Throttleable, restartable.' },
  { id: 'eng_hornet', name: 'Hornet Engine', cat: 'engine', price: 20000, mass: 420, h: 1.2, r: 0.8, shape: 'engine', color: 0x6b7280, engine: { thrust: 150, ispSL: 245, ispVac: 285, gimbal: 1.2 }, hp: 100, desc: 'Solid all-rounder for first stages.' },
  { id: 'eng_wisp', name: 'Wisp Vacuum Engine', cat: 'engine', price: 30000, mass: 250, h: 1.6, r: 0.7, shape: 'vacengine', color: 0x78716c, engine: { thrust: 55, ispSL: 110, ispVac: 345, gimbal: 1 }, hp: 70, desc: 'Superb in space, useless at sea level. Upper stages only.' },
  { id: 'eng_titan', name: 'Titan Engine', cat: 'engine', price: 48000, mass: 1500, h: 2.0, r: 1.2, shape: 'engine', color: 0x4b5563, engine: { thrust: 650, ispSL: 265, ispVac: 305, gimbal: 1.5 }, hp: 200, desc: 'Heavy lift.' },
  { id: 'eng_mammoth', name: 'Mammoth Engine', cat: 'engine', price: 125000, mass: 4800, h: 2.6, r: 1.6, shape: 'engine', color: 0x374151, engine: { thrust: 2100, ispSL: 275, ispVac: 312, gimbal: 2 }, hp: 320, desc: 'The biggest thing money can buy.' },
  { id: 'srb_s', name: 'Firecracker SRB', cat: 'engine', price: 1900, mass: 70, fuel: 330, h: 2.0, r: 0.4, shape: 'srb', color: 0xfafafa, engine: { thrust: 60, ispSL: 175, ispVac: 195, srb: true }, hp: 60, desc: 'Solid booster with its own fuel. Cannot throttle or shut down.' },
  { id: 'srb_l', name: 'Thumper SRB', cat: 'engine', price: 7500, mass: 350, fuel: 2600, h: 4.0, r: 0.7, shape: 'srb', color: 0xfafafa, engine: { thrust: 380, ispSL: 185, ispVac: 205, srb: true }, hp: 120, desc: 'Big dumb kick. Once lit, it burns to the end.' },

  // ---------- aero ----------
  { id: 'nose_cone', name: 'Aero Nose Cone', cat: 'aero', price: 1200, mass: 25, h: 0.8, r: 0.6, shape: 'cone', color: 0xfafafa, aero: { cd: -0.25 }, hp: 40, desc: 'Cuts drag by a third. Goes on top.' },
  { id: 'fins', name: 'Stabilizer Fins', cat: 'aero', price: 1100, mass: 60, h: 0.6, r: 0.6, shape: 'fins', color: 0xdc2626, aero: { stab: 1 }, hp: 50, desc: 'Keeps the nose pointed into the wind. Put it low on the rocket.' },
  { id: 'fins_grid', name: 'Grid Fins', cat: 'aero', price: 6500, mass: 140, h: 0.5, r: 1.0, shape: 'gridfins', color: 0x6b7280, aero: { stab: 1.6, steer: 1.2 }, hp: 80, desc: 'Stability plus extra steering authority in the air.' },

  // ---------- structure / utility ----------
  { id: 'decoupler', name: 'Stage Separator', cat: 'util', price: 900, mass: 40, h: 0.3, r: 0.7, shape: 'decoupler', color: 0x27272a, decoupler: true, hp: 50, desc: 'Splits the rocket into stages. Everything below it drops when you stage.' },
  { id: 'decoupler_l', name: 'Heavy Separator', cat: 'util', price: 2600, mass: 120, h: 0.4, r: 1.4, shape: 'decoupler', color: 0x27272a, decoupler: true, hp: 90, desc: 'Separator for wide stages.' },
  { id: 'ring', name: 'Reinforced Ring', cat: 'util', price: 2000, mass: 120, h: 0.4, r: 0.8, shape: 'ring', color: 0x52525b, hp: 260, armor: 0.2, desc: 'Absorbs 20% of all damage taken by the rocket.' },
  { id: 'battery', name: 'Battery Bank', cat: 'util', price: 1600, mass: 50, h: 0.3, r: 0.6, shape: 'battery', color: 0x16a34a, resist: { elec: 0.5 }, hp: 40, desc: 'Backup power. Halves electrical failures.' },
  { id: 'repair_kit', name: 'Onboard Repair Kit', cat: 'util', price: 4500, mass: 40, h: 0.4, r: 0.5, shape: 'box', color: 0xf59e0b, repair: 1, hp: 40, desc: 'Auto-fixes one in-flight failure.' },
  { id: 'robo_mech', name: 'Robo-Mechanic', cat: 'util', price: 15000, mass: 90, h: 0.5, r: 0.6, shape: 'box', color: 0x0ea5e9, repair: 3, hp: 60, desc: 'Auto-fixes three in-flight failures.' },

  // ---------- recovery ----------
  { id: 'chute_s', name: 'Mk1 Parachute', cat: 'recovery', price: 1800, mass: 50, h: 0.5, r: 0.45, shape: 'chute', color: 0xef4444, chute: { area: 230 }, hp: 40, desc: 'Lands about 400 kg gently. Do not open above 300 m/s.' },
  { id: 'chute_m', name: 'Mk2 Parachute', cat: 'recovery', price: 5200, mass: 130, h: 0.6, r: 0.7, shape: 'chute', color: 0xf97316, chute: { area: 650 }, hp: 60, desc: 'Lands about 1.4 t gently.' },
  { id: 'chute_l', name: 'Mk3 Heavy Parachute', cat: 'recovery', price: 14000, mass: 320, h: 0.8, r: 1.1, shape: 'chute', color: 0xeab308, chute: { area: 2200 }, hp: 90, desc: 'Lands about 5 t gently.' },
  { id: 'legs', name: 'Landing Legs', cat: 'recovery', price: 2500, mass: 90, h: 0.6, r: 0.7, shape: 'legs', color: 0x9ca3af, legs: { limit: 11 }, hp: 70, desc: 'Survive touchdowns up to 11 m/s (6 m/s without). Put at the bottom.' },
  { id: 'legs_h', name: 'Heavy Landing Legs', cat: 'recovery', price: 8500, mass: 280, h: 0.8, r: 1.2, shape: 'legs', color: 0x6b7280, legs: { limit: 17 }, hp: 120, desc: 'Survive touchdowns up to 17 m/s.' },
  { id: 'shield_s', name: 'Heat Shield S', cat: 'recovery', price: 3200, mass: 150, h: 0.3, r: 0.8, shape: 'shield', color: 0x44403c, shield: { abl: 100 }, hp: 80, desc: 'Absorbs 90% of re-entry heating until the ablator runs out.' },
  { id: 'shield_l', name: 'Heat Shield L', cat: 'recovery', price: 9800, mass: 450, h: 0.4, r: 1.3, shape: 'shield', color: 0x44403c, shield: { abl: 240 }, hp: 140, desc: 'Big ablator for fast, heavy returns.' },

  // ---------- science ----------
  { id: 'sci_baro', name: 'Barometer Pod', cat: 'science', price: 2200, mass: 20, h: 0.35, r: 0.45, shape: 'pod', color: 0x2563eb, sci: 'baro', hp: 30, desc: 'Takes pressure readings. Press BARO in the right altitude band.' },
  { id: 'sci_thermo', name: 'Thermometer Pod', cat: 'science', price: 2200, mass: 20, h: 0.35, r: 0.45, shape: 'pod', color: 0xdb2777, sci: 'thermo', hp: 30, desc: 'Measures temperature. Press THERMO in the right band.' },
  { id: 'sci_cam', name: 'Survey Camera', cat: 'science', price: 6500, mass: 60, h: 0.5, r: 0.55, shape: 'pod', color: 0x7c3aed, sci: 'photo', hp: 40, desc: 'High-altitude photography. Press PHOTO when conditions are met.' },
  { id: 'sci_sampler', name: 'Air Sampler', cat: 'science', price: 5200, mass: 80, h: 0.5, r: 0.55, shape: 'pod', color: 0x059669, sci: 'sample', hp: 40, desc: 'Scoops upper-air samples. Press SAMPLE in the right band.' },

  // ---------- payload ----------
  { id: 'sat_cube', name: 'CubeSat Dispenser', cat: 'payload', price: 12000, mass: 40, payload: 110, h: 0.7, r: 0.6, shape: 'sat', color: 0xd4af37, sat: 'cube', hp: 40, desc: 'Deploys a small satellite. 110 kg leaves the rocket when deployed.' },
  { id: 'sat_com', name: 'ComSat Payload', cat: 'payload', price: 42000, mass: 150, payload: 1300, h: 2.2, r: 1.1, shape: 'sat', color: 0xd4af37, sat: 'com', hp: 80, desc: 'Big communications satellite. 1.3 t leaves when deployed.' },
];

export const PART = Object.fromEntries(PARTS.map(p => [p.id, p]));

export const SCI_LABEL = { baro: 'BARO', thermo: 'THERMO', photo: 'PHOTO', sample: 'SAMPLE' };
export const SAT_LABEL = { cube: 'CubeSat', com: 'ComSat' };

// ---------- planet (used by quests text) ----------
export const SPACE_ALT = 45000;

// ---------- quests ----------
// Every quest is a small descriptor; flight.js evaluates them.
//   alt v       reach altitude v (m)
//   speed v     reach speed v (m/s)
//   apo v       reach an apoapsis of v (m)
//   orbit v     reach a periapsis above v (m) -> stable orbit
//   sci k,min,max   run experiment k while in [min,max] m  (orbit:true => must be in orbit)
//   deploy k,min,orbit  deploy satellite k above min / in orbit
//   air v       stay airborne v seconds
//   crew        a crewed pod must be aboard and land
//   near v      land within v m of the pad
//   hull v      land with hull >= v %
//   fuel v      land with >= v % of starting fuel
//   events v    resolve v in-flight failures
const km = m => (m >= 1000 ? (m / 1000).toFixed(m % 1000 ? 1 : 0) + ' km' : m + ' m');

export function questLabel(q) {
  switch (q.type) {
    case 'alt': return `Reach ${km(q.v)} altitude`;
    case 'speed': return `Reach ${q.v} m/s`;
    case 'apo': return `Raise apoapsis above ${km(q.v)}`;
    case 'orbit': return q.v > SPACE_ALT ? `Orbit with periapsis above ${km(q.v)}` : 'Reach a stable orbit';
    case 'sci': return q.orbit ? `${SCI_LABEL[q.k]} reading in orbit` : `${SCI_LABEL[q.k]} reading between ${km(q.min)} and ${km(q.max)}`;
    case 'deploy': return q.orbit ? `Deploy ${SAT_LABEL[q.k]} in stable orbit` : `Deploy ${SAT_LABEL[q.k]} above ${km(q.min)}`;
    case 'air': return `Stay airborne ${q.v} s`;
    case 'crew': return 'Fly crewed and bring them home';
    case 'near': return `Land within ${km(q.v)} of the pad`;
    case 'hull': return `Land with hull above ${q.v}%`;
    case 'fuel': return `Land with ${q.v}% fuel left`;
    case 'events': return `Resolve ${q.v} in-flight failures`;
    default: return q.type;
  }
}

// Parts a quest needs aboard (shown as hints and checked before launch).
export function questNeeds(q) {
  if (q.type === 'sci') return { sci: q.k };
  if (q.type === 'deploy') return { sat: q.k };
  if (q.type === 'crew') return { crew: true };
  return null;
}

const LEVELS = [
  { name: 'First Hop', grant: 15000, brief: 'The ministry wants proof you can build something that flies. Get it off the ground, then bring it back in one piece.',
    quests: [{ type: 'alt', v: 1000 }], bonus: [{ type: 'alt', v: 5000, reward: 3000 }] },
  { name: 'Sound Barrier', grant: 22000, brief: 'Go supersonic and climb. A good landing near the pad earns a little extra.',
    quests: [{ type: 'speed', v: 343 }, { type: 'alt', v: 8000 }], bonus: [{ type: 'near', v: 3000, reward: 5000 }] },
  { name: 'Weather Watch', grant: 34000, brief: 'The weather service is paying for pressure data from the mid atmosphere.',
    quests: [{ type: 'sci', k: 'baro', min: 5000, max: 12000 }, { type: 'alt', v: 20000 }], bonus: [{ type: 'sci', k: 'thermo', min: 18000, max: 30000, reward: 6000 }] },
  { name: 'Edge of Space', grant: 52000, brief: 'Cross the 45 km line into space and photograph the planet on the way.',
    quests: [{ type: 'alt', v: 45000 }, { type: 'sci', k: 'photo', min: 35000, max: 1e9 }], bonus: [{ type: 'air', v: 240, reward: 8000 }] },
  { name: 'Payload Courier', grant: 74000, brief: 'A university has a satellite. It only needs a sub-orbital release above 55 km.',
    quests: [{ type: 'deploy', k: 'cube', min: 55000 }, { type: 'speed', v: 1000 }], bonus: [{ type: 'hull', v: 80, reward: 10000 }] },
  { name: 'First Orbit', grant: 105000, brief: 'Orbit. Then come home. Re-entry from orbit is hot: plan for it.',
    quests: [{ type: 'orbit', v: SPACE_ALT }], bonus: [{ type: 'apo', v: 100000, reward: 15000 }] },
  { name: 'Eyes in the Sky', grant: 150000, brief: 'Put a CubeSat into a stable orbit and send back orbital photos.',
    quests: [{ type: 'deploy', k: 'cube', orbit: true }, { type: 'sci', k: 'photo', orbit: true }], bonus: [{ type: 'near', v: 20000, reward: 20000 }] },
  { name: 'Crewed Flight', grant: 210000, brief: 'A human goes up. A human comes back. Nothing else matters.',
    quests: [{ type: 'crew' }, { type: 'orbit', v: SPACE_ALT }], bonus: [{ type: 'sci', k: 'sample', min: 20000, max: 35000, reward: 25000 }] },
  { name: 'High Ground', grant: 290000, brief: 'The telecom consortium wants a ComSat in a high, clean orbit.',
    quests: [{ type: 'deploy', k: 'com', orbit: true }, { type: 'apo', v: 300000 }], bonus: [{ type: 'events', v: 3, reward: 30000 }] },
  { name: 'Moonshot Rehearsal', grant: 400000, brief: 'Crewed flight to 1,500 km and back. This is the dress rehearsal for leaving the planet.',
    quests: [{ type: 'crew' }, { type: 'alt', v: 1500000 }], bonus: [{ type: 'fuel', v: 5, reward: 50000 }] },
];

// Seeded RNG so a generated contract stays identical when you retry it.
export function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

const GEN_NAMES = ['Deep Survey', 'Polar Relay', 'Night Watch', 'Iron Courier', 'Long Arc', 'Silver Thread', 'Storm Chaser', 'High Wire', 'Twin Lantern', 'Far Shore', 'Quiet Thunder', 'Glass Horizon'];

export function getLevel(n) {
  if (n < LEVELS.length) return { ...LEVELS[n], n, generated: false };
  const k = n - LEVELS.length + 1; // 1, 2, 3...
  const R = rng(n * 7919 + 13);
  const pick = a => a[Math.floor(R() * a.length)];
  const scale = 1 + k * 0.25;
  const pool = [
    () => ({ type: 'apo', v: Math.round((300000 + 200000 * k * R()) / 10000) * 10000 }),
    () => ({ type: 'orbit', v: Math.round((60000 + 30000 * k * R()) / 5000) * 5000 }),
    () => ({ type: 'deploy', k: R() < 0.5 ? 'cube' : 'com', orbit: true }),
    () => ({ type: 'sci', k: pick(['baro', 'thermo', 'sample']), min: 10000 + Math.round(R() * 15) * 1000, max: 0 }),
    () => ({ type: 'sci', k: 'photo', orbit: true }),
    () => ({ type: 'crew' }),
    () => ({ type: 'alt', v: Math.round((800000 + 600000 * k * R()) / 50000) * 50000 }),
    () => ({ type: 'events', v: 2 + Math.floor(k / 2) }),
  ];
  const used = new Set();
  const quests = [];
  const count = Math.min(4, 2 + Math.floor(k / 2));
  while (quests.length < count) {
    const i = Math.floor(R() * pool.length);
    if (used.has(i)) continue;
    used.add(i);
    const q = pool[i]();
    if (q.type === 'sci' && q.k !== 'photo') q.max = q.min + 8000;
    quests.push(q);
  }
  const bonusPool = [
    { type: 'near', v: Math.max(2000, 30000 - k * 3000) },
    { type: 'hull', v: Math.min(95, 70 + k * 3) },
    { type: 'fuel', v: Math.min(15, 3 + k) },
    { type: 'air', v: 600 + k * 120 },
  ];
  const b = bonusPool[Math.floor(R() * bonusPool.length)];
  return {
    n, generated: true,
    name: `Contract ${n + 1}: ${GEN_NAMES[(n * 5) % GEN_NAMES.length]}`,
    grant: Math.round(400000 * Math.pow(1.3, k) / 1000) * 1000,
    brief: `Government contract tier ${n + 1}. Harder targets, bigger budget. Failures are noticed.`,
    quests, bonus: [{ ...b, reward: Math.round(40000 * scale / 1000) * 1000 }],
  };
}

export const MAX_HANDCRAFTED = LEVELS.length;

export function fmtMoney(v) {
  const neg = v < 0; v = Math.abs(Math.round(v));
  const s = v >= 1e6 ? (v / 1e6).toFixed(v >= 1e7 ? 1 : 2) + 'M' : v >= 1e4 ? (v / 1e3).toFixed(1).replace(/\.0$/, '') + 'k' : v.toLocaleString('en-US');
  return (neg ? '-$' : '$') + s;
}
export { km as fmtDist };
