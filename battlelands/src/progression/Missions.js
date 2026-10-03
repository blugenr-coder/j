/* Daily missions (three per day, picked from the date so everyone gets the
   same set) and permanent achievements. Progress is fed from match results. */
import { makeRng, hashString } from '../core/rng.js';
import { CHARACTERS, isOwned } from './Cosmetics.js';

export const MISSION_DEFS = [
  { id: 'play',   text: 'PLAY {n} MATCHES', n: 3, xp: 150, coins: 40, stat: r => 1 },
  { id: 'kills',  text: 'GET {n} ELIMINATIONS', n: 5, xp: 200, coins: 60, stat: r => r.kills },
  { id: 'top10',  text: 'FINISH TOP 10 {n} TIMES', n: 2, xp: 180, coins: 50, stat: r => (r.place <= 10 ? 1 : 0) },
  { id: 'survive',text: 'SURVIVE {n}s IN ONE MATCH', n: 150, xp: 160, coins: 40, stat: r => Math.round(r.survival), max: true },
  { id: 'damage', text: 'DEAL {n} DAMAGE', n: 600, xp: 180, coins: 50, stat: r => r.damage },
  { id: 'heal',   text: 'HEAL {n} HEALTH', n: 120, xp: 120, coins: 30, stat: r => r.healed },
  { id: 'epic',   text: 'PICK UP {n} EPIC+ ITEMS', n: 3, xp: 150, coins: 40, stat: r => r.epicPickups },
  { id: 'top3',   text: 'REACH TOP 3', n: 1, xp: 220, coins: 70, stat: r => (r.place <= 3 ? 1 : 0) },
];

export const ACHIEVEMENTS = [
  { id: 'first_blood', text: 'FIRST ELIMINATION', test: s => s.stats.kills >= 1, coins: 100 },
  { id: 'win', text: 'WIN A MATCH', test: s => s.stats.wins >= 1, coins: 300, unlock: 'icons:crown' },
  { id: 'ten_matches', text: 'PLAY 10 MATCHES', test: s => s.stats.matches >= 10, coins: 200 },
  { id: 'sharpshooter', text: '50 ELIMINATIONS', test: s => s.stats.kills >= 50, coins: 400 },
  { id: 'podium', text: 'TOP 3 FIVE TIMES', test: s => s.stats.top3 >= 5, coins: 300 },
  { id: 'collector', text: 'OWN 6 CHARACTERS', test: s => CHARACTERS.filter(c => isOwned(s, 'characters', c.id)).length >= 6, coins: 500 },
];

export const todayKey = (d = new Date()) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

export function missionText(m, t) {
  const def = MISSION_DEFS.find(d => d.id === m.id);
  return t(def.text).replace('{n}', def.n);
}

/* Roll today's set if the day changed. Unclaimed rewards from yesterday are lost. */
export function refreshMissions(save) {
  const day = todayKey();
  if (save.missions.day === day && save.missions.list.length) return false;
  const rng = makeRng(hashString(day));
  const pool = MISSION_DEFS.map(d => d.id);
  rng.shuffle(pool);
  save.missions = { day, list: pool.slice(0, 3).map(id => ({ id, progress: 0, claimed: false })) };
  return true;
}

export function missionDef(id) { return MISSION_DEFS.find(d => d.id === id); }

/* Returns the missions that crossed their goal in this match. */
export function applyMatchToMissions(save, result) {
  const done = [];
  for (const m of save.missions.list) {
    const def = missionDef(m.id);
    if (m.claimed || m.progress >= def.n) continue;
    const v = def.stat(result);
    m.progress = def.max ? Math.max(m.progress, v) : m.progress + v;
    if (m.progress >= def.n) { m.progress = def.n; done.push(m); }
  }
  return done;
}

export function newAchievements(save) {
  const out = [];
  for (const a of ACHIEVEMENTS) {
    if (save.achievements[a.id]) continue;
    if (a.test(save)) out.push(a);
  }
  return out;
}

export function secondsToReset() {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return Math.max(0, Math.round((next - now) / 1000));
}
