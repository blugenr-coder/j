/* Every cosmetic in the game. Purely visual: nothing here changes stats.
   unlock: 'default' | { level: n } | { price: coins } | { mission } */

export const CHARACTERS = [
  { id: 'scout',  name: 'SCOUT',  rarity: 'common',    body: '#3B82F6', belly: '#93C5FD', visor: '#FFD43B', acc: 'none',    unlock: 'default' },
  { id: 'tango',  name: 'TANGO',  rarity: 'common',    body: '#FF9F43', belly: '#FFD8A8', visor: '#17213D', acc: 'band',    accColor: '#FF6B6B', unlock: 'default' },
  { id: 'mossy',  name: 'MOSSY',  rarity: 'common',    body: '#4ADE80', belly: '#BBF7D0', visor: '#17213D', acc: 'sprout',  accColor: '#15803D', unlock: { level: 2 } },
  { id: 'pip',    name: 'PIP',    rarity: 'rare',      body: '#F472B6', belly: '#FBCFE8', visor: '#FFFFFF', acc: 'ears',    accColor: '#F9A8D4', unlock: { price: 600 } },
  { id: 'bolt',   name: 'BOLT',   rarity: 'rare',      body: '#FFD43B', belly: '#FEF3C7', visor: '#17213D', acc: 'antenna', accColor: '#3B82F6', unlock: { level: 4 } },
  { id: 'frost',  name: 'FROST',  rarity: 'rare',      body: '#7DD3FC', belly: '#E0F2FE', visor: '#1E3A8A', acc: 'beanie',  accColor: '#2563EB', unlock: { price: 700 } },
  { id: 'ember',  name: 'EMBER',  rarity: 'epic',      body: '#FF6B6B', belly: '#FECACA', visor: '#FFD43B', acc: 'flame',   accColor: '#FF9F43', unlock: { price: 1200 } },
  { id: 'nova',   name: 'NOVA',   rarity: 'epic',      body: '#A78BFA', belly: '#DDD6FE', visor: '#7DD3FC', acc: 'star',    accColor: '#FFD43B', unlock: { level: 7 } },
  { id: 'koi',    name: 'KOI',    rarity: 'epic',      body: '#F8FAFC', belly: '#FFEDD5', visor: '#17213D', acc: 'fin',     accColor: '#FF9F43', unlock: { price: 1400 } },
  { id: 'rex',    name: 'REX',    rarity: 'legendary', body: '#22C55E', belly: '#FDE68A', visor: '#FFFFFF', acc: 'spikes',  accColor: '#FFD43B', unlock: { price: 2400 } },
  { id: 'luna',   name: 'LUNA',   rarity: 'legendary', body: '#1E3A8A', belly: '#BFDBFE', visor: '#F8FAFC', acc: 'horns',   accColor: '#FFD43B', unlock: { level: 10 } },
  { id: 'baron',  name: 'BARON',  rarity: 'legendary', body: '#2DD4BF', belly: '#CCFBF1', visor: '#17213D', acc: 'crown',   accColor: '#FFD43B', unlock: { price: 3000 } },
];

export const EMOTES = [
  { id: 'wave',  name: 'WAVE',  glyph: 'wave',  rarity: 'common', unlock: 'default' },
  { id: 'gg',    name: 'GG',    glyph: 'gg',    rarity: 'common', unlock: 'default' },
  { id: 'heart', name: 'LOVE',  glyph: 'heart', rarity: 'rare',   unlock: { price: 300 } },
  { id: 'laugh', name: 'HA HA', glyph: 'laugh', rarity: 'rare',   unlock: { level: 3 } },
  { id: 'crown', name: 'BOSS',  glyph: 'crown', rarity: 'epic',   unlock: { price: 650 } },
  { id: 'fire',  name: 'ON FIRE', glyph: 'fire', rarity: 'epic',  unlock: { level: 6 } },
];

export const TRAILS = [
  { id: 'none',    name: 'NONE',     color: null,      rarity: 'common',    unlock: 'default' },
  { id: 'dust',    name: 'DUST',     color: '#CBD5E1', rarity: 'common',    unlock: 'default' },
  { id: 'bubbles', name: 'BUBBLES',  color: '#7DD3FC', rarity: 'rare',      unlock: { price: 400 } },
  { id: 'sparks',  name: 'SPARKS',   color: '#FFD43B', rarity: 'epic',      unlock: { level: 5 } },
  { id: 'hearts',  name: 'HEARTS',   color: '#F472B6', rarity: 'epic',      unlock: { price: 900 } },
  { id: 'rainbow', name: 'RAINBOW',  color: 'rainbow', rarity: 'legendary', unlock: { price: 1800 } },
];

export const VICTORY_EFFECTS = [
  { id: 'confetti',  name: 'CONFETTI',  rarity: 'common',    unlock: 'default' },
  { id: 'fireworks', name: 'FIREWORKS', rarity: 'epic',      unlock: { price: 1000 } },
  { id: 'stars',     name: 'STARFALL',  rarity: 'rare',      unlock: { level: 4 } },
  { id: 'gold',      name: 'GOLD RAIN', rarity: 'legendary', unlock: { price: 2000 } },
];

export const PROFILE_ICONS = [
  { id: 'bolt',   name: 'BOLT',   glyph: 'bolt',   color: '#FFD43B', rarity: 'common', unlock: 'default' },
  { id: 'star',   name: 'STAR',   glyph: 'star',   color: '#60A5FA', rarity: 'common', unlock: 'default' },
  { id: 'skull',  name: 'TARGET', glyph: 'target', color: '#FF6B6B', rarity: 'rare',   unlock: { level: 3 } },
  { id: 'crown',  name: 'CROWN',  glyph: 'crown',  color: '#FFD43B', rarity: 'epic',   unlock: { mission: 'win' } },
  { id: 'heart',  name: 'HEART',  glyph: 'heart',  color: '#F472B6', rarity: 'rare',   unlock: { price: 250 } },
  { id: 'trophy', name: 'TROPHY', glyph: 'trophy', color: '#FF9F43', rarity: 'epic',   unlock: { level: 8 } },
];

export const CATEGORIES = {
  characters: { label: 'CHARACTERS', items: CHARACTERS, slot: 'character' },
  emotes:     { label: 'EMOTES', items: EMOTES, slot: 'emote' },
  trails:     { label: 'TRAILS', items: TRAILS, slot: 'trail' },
  victory:    { label: 'VICTORY', items: VICTORY_EFFECTS, slot: 'victory' },
  icons:      { label: 'ICONS', items: PROFILE_ICONS, slot: 'icon' },
};

/* Bundles in the shop: several items for less than their sum. */
export const BUNDLES = [
  { id: 'starter', name: 'STARTER PACK', price: 900, items: [['characters', 'pip'], ['emotes', 'heart'], ['trails', 'bubbles']], color: '#3B82F6' },
  { id: 'blaze', name: 'BLAZE BUNDLE', price: 2000, items: [['characters', 'ember'], ['trails', 'hearts'], ['victory', 'fireworks']], color: '#FF6B6B' },
];

export const characterById = id => CHARACTERS.find(c => c.id === id) || CHARACTERS[0];
export const trailById = id => TRAILS.find(t => t.id === id) || TRAILS[0];
export const findItem = (cat, id) => CATEGORIES[cat].items.find(i => i.id === id);

export function isOwned(save, cat, id) {
  const item = findItem(cat, id);
  if (!item) return false;
  if (item.unlock === 'default') return true;
  if (item.unlock.level && save.level >= item.unlock.level) return true;
  return save.owned.includes(`${cat}:${id}`);
}

export function priceOf(cat, id) {
  const item = findItem(cat, id);
  return item && item.unlock && item.unlock.price ? item.unlock.price : null;
}
