/* Headless full matches: 1 autopilot "player" + 31 bots, no DOM.
   Checks the loop actually ends, the zone does its job, nothing goes NaN or
   leaves the island, loot is deterministic per seed, and prints the pacing
   so it can be compared with the design targets. */
import { MatchManager, MatchPhase } from '../src/core/MatchManager.js';

const N = Number(process.argv[2] || 6);
const DT = 1 / 60;
let fail = 0;
const bad = m => { console.log('✗', m); fail++; };

// Determinism of loot per seed
{
  const a = new MatchManager({ seed: 1234 }), b = new MatchManager({ seed: 1234 }), c = new MatchManager({ seed: 999 });
  const sig = m => m.loot.items.map(i => `${i.type}:${i.key}:${i.rarity}:${i.x.toFixed(1)}`).join('|');
  if (sig(a) !== sig(b)) bad('same seed produced different loot');
  if (sig(a) === sig(c)) bad('different seeds produced identical loot');
  console.log(`loot items per match: ${a.loot.items.length}`);
}

const durations = [], checkpoints = { 75: [], 120: [], 180: [], 270: [] };
for (let k = 0; k < N; k++) {
  const seed = 1000 + k * 7919;
  const m = new MatchManager({ seed, autopilot: true });
  let shots = 0, kinds = {};
  let hits = 0, firstElim = null;
  m.bus.on('shot', () => shots++);
  m.bus.on('damage', e => { if (e.kind === 'shot') hits++; });
  m.bus.on('elimination', () => { if (firstElim === null) firstElim = m.time - m.landTime; });
  m.bus.on('elimination', e => { kinds[e.kind] = (kinds[e.kind] || 0) + 1; });
  const t0 = performance.now();
  let frames = 0;
  while (m.phase !== MatchPhase.OVER && m.time < 900) {
    m.update(DT, null);
    frames++;
    if (m.phase === MatchPhase.LIVE) {
      const live = m.time - m.landTime;
      for (const c of Object.keys(checkpoints)) if (Math.abs(live - c) < DT / 2 + 1e-9) checkpoints[c].push(m.aliveCount());
    }
    if (frames % 600 === 0) for (const e of m.entities) {
      if (!Number.isFinite(e.x) || !Number.isFinite(e.y)) { bad(`NaN position seed ${seed}`); break; }
      if (e.alive && !e.airborne && (e.x < 100 || e.y < 100 || e.x > 2700 || e.y > 2700)) bad(`entity off island ${e.x},${e.y}`);
    }
  }
  const ms = performance.now() - t0;
  const live = m.time - m.landTime;
  if (m.phase !== MatchPhase.OVER) bad(`seed ${seed}: match did not end (alive ${m.aliveCount()})`);
  durations.push(live);
  const pickups = m.entities.reduce((s, e) => s + e.weapons.filter(Boolean).length, 0);
  console.log(`seed ${seed}: ${live.toFixed(0)}s live, winner ${m.winner?.name} (${m.winner?.brain?.personality}) kills ${m.winner?.kills}, shots ${shots} hit% ${(100 * hits / Math.max(1, shots)).toFixed(0)} first elim ${firstElim?.toFixed(0)}s, elims ${JSON.stringify(kinds)}, zone phase ${m.zone.phaseIndex}, sim ${(ms / frames).toFixed(2)}ms/frame`);
  void pickups;
}
const avg = a => a.length ? (a.reduce((s, x) => s + x, 0) / a.length).toFixed(1) : '-';
console.log(`avg match ${avg(durations)}s | alive at 1:15 ${avg(checkpoints[75])}, 2:00 ${avg(checkpoints[120])}, 3:00 ${avg(checkpoints[180])}, 4:30 ${avg(checkpoints[270])}`);
console.log(fail ? `${fail} problems` : 'simulation OK');
process.exit(fail ? 1 : 0);
