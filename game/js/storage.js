// Profile, settings and lifetime statistics, kept in localStorage.
// Every access is guarded: private windows or blocked storage must not
// break the game, they only lose persistence.
import { xpForLevel } from './config.js';

const KEY = 'skybrawl.v1';

const DEFAULTS = {
  profile: { name: 'Player', character: 'pip', xp: 0, level: 1 },
  settings: { master: 0.8, music: 0.5, sfx: 0.8, quality: 'high', botDifficulty: 'normal', shake: true, fps: false, mode: 'classic' },
  stats: { matches: 0, wins: 0, top5: 0, kills: 0, deaths: 0, damage: 0, bestKills: 0, bestPlace: 0, timePlayed: 0, shots: 0 },
};

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(DEFAULTS);
    const d = JSON.parse(raw);
    return {
      profile: { ...DEFAULTS.profile, ...d.profile },
      settings: { ...DEFAULTS.settings, ...d.settings },
      stats: { ...DEFAULTS.stats, ...d.stats },
    };
  } catch { return structuredClone(DEFAULTS); }
}

export const store = load();

export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(store)); } catch { /* storage unavailable */ }
}

// Apply a finished match to stats and XP. Returns { xpGained, levelUps }.
export function recordMatch(r) {
  const s = store.stats;
  s.matches++;
  if (r.won) s.wins++;
  if (r.placement <= 5) s.top5++;
  if (!r.won) s.deaths++;
  s.kills += r.kills;
  s.damage += r.damage;
  s.bestKills = Math.max(s.bestKills, r.kills);
  s.bestPlace = s.bestPlace ? Math.min(s.bestPlace, r.placement) : r.placement;
  s.timePlayed += Math.round(r.survived);
  const xp = 50 + r.kills * 60 + Math.max(0, (r.players - r.placement)) * 6 + (r.won ? 300 : 0) + Math.round(r.damage / 10);
  const p = store.profile;
  p.xp += xp;
  let ups = 0;
  while (p.xp >= xpForLevel(p.level)) { p.xp -= xpForLevel(p.level); p.level++; ups++; }
  save();
  return { xpGained: xp, levelUps: ups };
}

export function resetStats() {
  store.stats = structuredClone(DEFAULTS.stats);
  store.profile.xp = 0; store.profile.level = 1;
  save();
}
