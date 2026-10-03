/* Seeded PRNG (mulberry32). Every random decision inside a match draws from a
   stream seeded by the match seed, so the same seed lays out the same loot,
   zones and bots — which is what makes a match reproducible in tests. */
export function makeRng(seed) {
  let s = (seed >>> 0) || 1;
  const next = () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const rng = {
    next,
    range: (a, b) => a + (b - a) * next(),
    int: (a, b) => a + Math.floor(next() * (b - a + 1)),
    chance: p => next() < p,
    pick: arr => arr[Math.floor(next() * arr.length)],
    weighted(entries) { // [[value, weight], ...]
      let total = 0;
      for (const e of entries) total += e[1];
      let r = next() * total;
      for (const e of entries) { if ((r -= e[1]) <= 0) return e[0]; }
      return entries[entries.length - 1][0];
    },
    shuffle(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    },
    fork: salt => makeRng((Math.floor(next() * 4294967296) ^ salt) >>> 0),
  };
  return rng;
}

export function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
