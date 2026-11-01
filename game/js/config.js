// Game data: weapons, rarities, items, characters, match modes.
// Everything tunable lives here so balance changes never touch logic code.

export const GAME_NAME = 'SKYBRAWL';

// Side-profile shape of each weapon: [x, y, length, height] boxes, x forward.
// The 3D model extrudes these boxes and the HUD icon draws them flat, so the
// icon always matches the gun in the character's hands.
export const WEAPONS = {
  fists: {
    id: 'fists', name: 'Fists', melee: true, dmg: 13, rate: 2.2, range: 1.9,
    ammo: null, mag: 0, reload: 0, spread: 0, speed: 0, pellets: 1, auto: true,
    recoil: 0, prefRange: 1.4, shape: [],
  },
  pistol: {
    id: 'pistol', name: 'Pip Pistol', ammo: 'light', dmg: 15, rate: 4.2, mag: 12, reload: 1.1,
    spread: 0.035, range: 32, speed: 75, pellets: 1, auto: false, recoil: 0.025, prefRange: 12,
    sound: { freq: 900, decay: 0.09, noise: 0.6, boom: 0.3 },
    shape: [[0, 0, 0.42, 0.16], [0.08, -0.26, 0.1, 0.26], [0.42, 0.04, 0.12, 0.08]],
  },
  smg: {
    id: 'smg', name: 'Buzzsaw SMG', ammo: 'light', dmg: 8.5, rate: 11.5, mag: 30, reload: 1.6,
    spread: 0.085, range: 26, speed: 72, pellets: 1, auto: true, recoil: 0.02, prefRange: 9,
    sound: { freq: 1300, decay: 0.06, noise: 0.7, boom: 0.2 },
    shape: [[0, 0, 0.62, 0.2], [0.18, -0.34, 0.1, 0.34], [-0.2, 0.02, 0.2, 0.12], [0.62, 0.06, 0.18, 0.08]],
  },
  ar: {
    id: 'ar', name: 'Striker AR', ammo: 'medium', dmg: 13, rate: 7.4, mag: 30, reload: 2.0,
    spread: 0.04, range: 44, speed: 90, pellets: 1, auto: true, recoil: 0.03, prefRange: 18,
    sound: { freq: 600, decay: 0.13, noise: 0.8, boom: 0.5 },
    shape: [[0, 0, 0.85, 0.2], [0.85, 0.06, 0.45, 0.08], [-0.36, -0.04, 0.36, 0.2], [0.4, -0.3, 0.13, 0.3], [0.25, 0.2, 0.3, 0.08]],
  },
  shotgun: {
    id: 'shotgun', name: 'Boomstick', ammo: 'shells', dmg: 8, rate: 1.1, mag: 5, reload: 2.3,
    spread: 0.2, range: 15, speed: 60, pellets: 7, auto: false, recoil: 0.09, prefRange: 6,
    sound: { freq: 260, decay: 0.28, noise: 1.0, boom: 1.0 },
    shape: [[0, 0, 0.7, 0.2], [0.7, 0.04, 0.55, 0.12], [-0.4, -0.06, 0.4, 0.22], [0.55, -0.12, 0.35, 0.1]],
  },
  sniper: {
    id: 'sniper', name: 'Longshot', ammo: 'heavy', dmg: 72, rate: 0.75, mag: 5, reload: 2.6,
    spread: 0.004, range: 85, speed: 170, pellets: 1, auto: false, recoil: 0.12, prefRange: 32,
    sound: { freq: 380, decay: 0.35, noise: 0.9, boom: 1.2 },
    shape: [[0, 0, 0.95, 0.18], [0.95, 0.05, 0.8, 0.07], [-0.45, -0.06, 0.45, 0.22], [0.2, 0.2, 0.5, 0.13], [0.35, -0.24, 0.12, 0.24]],
  },
  hmg: {
    id: 'hmg', name: 'Thumper HMG', ammo: 'medium', dmg: 10.5, rate: 12.5, mag: 75, reload: 3.6,
    spread: 0.1, range: 38, speed: 82, pellets: 1, auto: true, recoil: 0.025, prefRange: 15, moveMul: 0.82,
    sound: { freq: 480, decay: 0.12, noise: 0.9, boom: 0.7 },
    shape: [[0, -0.04, 1.0, 0.28], [1.0, 0.04, 0.5, 0.12], [-0.3, -0.06, 0.3, 0.24], [0.3, -0.34, 0.34, 0.3], [0.1, 0.24, 0.5, 0.06]],
  },
};

export const LOOT_WEAPONS = ['pistol', 'smg', 'ar', 'shotgun', 'sniper', 'hmg'];
// Relative spawn weights for floor loot.
export const WEAPON_WEIGHTS = { pistol: 26, smg: 20, ar: 18, shotgun: 18, sniper: 8, hmg: 7 };

export const RARITY = [
  { name: 'Common', color: '#c3cad3', dmg: 1.0 },
  { name: 'Uncommon', color: '#54d36a', dmg: 1.08 },
  { name: 'Rare', color: '#3b9dff', dmg: 1.17 },
  { name: 'Epic', color: '#b766ff', dmg: 1.27 },
  { name: 'Legendary', color: '#ffb320', dmg: 1.4 },
];
export const RARITY_WEIGHTS = [44, 30, 16, 7, 3];

export function weaponStats(id, rarity = 0) {
  const w = WEAPONS[id];
  const r = RARITY[rarity] || RARITY[0];
  return {
    ...w,
    dmg: w.dmg * r.dmg,
    spread: w.spread * (1 - 0.07 * rarity),
    mag: w.mag ? Math.round(w.mag * (1 + 0.1 * rarity)) : 0,
    reload: w.reload * (1 - 0.05 * rarity),
  };
}

export const AMMO = {
  light: { name: 'Light Ammo', color: '#ffd23f', pickup: 36, max: 180 },
  medium: { name: 'Medium Ammo', color: '#3fd1ff', pickup: 30, max: 180 },
  shells: { name: 'Shells', color: '#ff5d5d', pickup: 10, max: 40 },
  heavy: { name: 'Heavy Ammo', color: '#b98cff', pickup: 8, max: 30 },
};

export const ITEMS = {
  medkit: { name: 'Medkit', color: '#ff4f6a', max: 5, heal: 45, time: 2.2 },
  grenade: { name: 'Grenade', color: '#4cc66b', max: 4, dmg: 75, radius: 5.5, fuse: 1.6 },
  soda: { name: 'Zoom Soda', color: '#33c2ff', max: 3, heal: 15, boost: 1.32, dur: 7 },
  armor: { name: 'Armor', color: '#4f8dff' },
};
export const ARMOR_TIERS = [0, 30, 55, 80];

export const CHARACTERS = [
  { id: 'pip', name: 'Pip', bio: 'Fearless courier. Lands first, asks later.', skin: '#ffcfa6', shirt: '#ff8a2a', pants: '#36427a', hat: 'cap', hatColor: '#ffd23f', pack: '#6b4a2b' },
  { id: 'mara', name: 'Mara', bio: 'Ex-lifeguard with a perfect aim.', skin: '#c98e63', shirt: '#22c3b0', pants: '#2c2c44', hat: 'beanie', hatColor: '#ff5ca8', pack: '#3a3a5a' },
  { id: 'brik', name: 'Brik', bio: 'Built like a wall. Moves like one too.', skin: '#8f5a3c', shirt: '#5e8a3a', pants: '#3e4a2a', hat: 'helmet', hatColor: '#4a6b2d', pack: '#4b3a22' },
  { id: 'juno', name: 'Juno', bio: 'Plays to the beat of her headphones.', skin: '#ffe0c4', shirt: '#8c5cff', pants: '#2b2350', hat: 'phones', hatColor: '#ff4f6a', pack: '#ffd23f' },
  { id: 'tako', name: 'Tako', bio: 'Street chef. Brings the heat.', skin: '#e8b48a', shirt: '#e8423f', pants: '#24243a', hat: 'bandana', hatColor: '#1d1d2e', pack: '#2f7fd8' },
  { id: 'nova', name: 'Nova', bio: 'Test pilot. Sky is her lobby.', skin: '#f2c39b', shirt: '#f2f4f8', pants: '#5b6b8c', hat: 'visor', hatColor: '#3fb8ff', pack: '#d9dde6' },
];

export const MODES = {
  classic: {
    id: 'classic', name: 'Classic Solo', desc: '32 players · full island · about 4 minutes',
    players: 32, lootMul: 1,
    // [wait seconds, shrink seconds, target radius, damage per second]
    phases: [[38, 24, 112, 2], [24, 20, 70, 4], [20, 18, 38, 7], [16, 15, 16, 11], [10, 15, 0, 16]],
  },
  rush: {
    id: 'rush', name: 'Rush Solo', desc: '32 players · more loot · faster storm · about 3 minutes',
    players: 32, lootMul: 1.6,
    phases: [[24, 18, 95, 3], [16, 15, 58, 5], [14, 14, 30, 8], [10, 12, 12, 12], [8, 12, 0, 18]],
  },
};

export const DIFFICULTY = {
  easy: { reaction: 0.9, aimError: 0.3, view: 18, strafe: 0.5, lead: 0, heal: 0.3, accuracyGain: 0.25 },
  normal: { reaction: 0.42, aimError: 0.13, view: 22, strafe: 0.8, lead: 0.5, heal: 0.4, accuracyGain: 0.45 },
  hard: { reaction: 0.26, aimError: 0.09, view: 26, strafe: 1, lead: 1, heal: 0.5, accuracyGain: 0.6 },
};

const NAME_A = ['Sneaky', 'Turbo', 'Lucky', 'Fuzzy', 'Crispy', 'Mighty', 'Salty', 'Zippy', 'Grumpy', 'Cosmic', 'Wobbly', 'Rapid', 'Sunny', 'Spicy', 'Frosty', 'Rusty', 'Noisy', 'Silent', 'Jolly', 'Bouncy'];
const NAME_B = ['Otter', 'Waffle', 'Badger', 'Pickle', 'Comet', 'Llama', 'Nugget', 'Gecko', 'Bandit', 'Taco', 'Walrus', 'Pebble', 'Moose', 'Noodle', 'Falcon', 'Biscuit', 'Yeti', 'Panda', 'Muffin', 'Raven'];
export function botName(rng) {
  const a = NAME_A[Math.floor(rng() * NAME_A.length)];
  const b = NAME_B[Math.floor(rng() * NAME_B.length)];
  const n = rng() < 0.5 ? Math.floor(rng() * 99) : '';
  return a + b + n;
}

export function xpForLevel(level) { return 300 + level * 150; }
