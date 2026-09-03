/* WorksheetHub — content engine foundations.
   The hand-written library is deep but small. To cover every topic at every
   level the rest of the catalogue is generated from templates: seeded, so a
   given worksheet always contains the same questions, and checked, so the
   answers are computed rather than typed. */

/** Deterministic PRNG (mulberry32). Same seed, same worksheet, forever. */
export function rng(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seedFrom(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

/* ------------------------------ pick helpers ------------------------------ */
export const int = (r, lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
export const pick = (r, list) => list[Math.floor(r() * list.length)];

/** n distinct members of a list, in a stable shuffled order. */
export function sample(r, list, n) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, Math.min(n, arr.length));
}

/* ------------------------- multiple-choice helpers ------------------------- */
/**
 * Build a choice question from a correct answer and a set of plausible
 * distractors. Options are shuffled deterministically and the answer index is
 * derived afterwards, so the right answer is never in a predictable slot.
 */
export function choice(r, { prompt, math, correct, distractors, hint, explanation }) {
  const seen = new Set([String(correct)]);
  const opts = [String(correct)];
  for (const d of distractors) {
    const s = String(d);
    if (!seen.has(s)) { seen.add(s); opts.push(s); }
    if (opts.length === 4) break;
  }
  const shuffled = sample(r, opts, opts.length);
  return {
    type: 'choice', prompt, math,
    options: shuffled,
    answer: shuffled.indexOf(String(correct)),
    hint, explanation
  };
}

/** Numeric distractors that look like real mistakes, not random noise. */
export function nearMisses(value, r) {
  const v = Number(value);
  const out = [v + 1, v - 1, v + 2, v - 2, v * 2, Math.round(v / 2), v + 10, v - 10];
  return sample(r, out.filter(x => Number.isFinite(x) && x !== v && x > -1000), 6);
}

/* ----------------------------- number helpers ----------------------------- */
export const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);

export function simplify(n, d) {
  const g = gcd(n, d) || 1;
  return [n / g, d / g];
}

export const frac = (n, d) => `${n}/${d}`;

/** Trim floating-point noise: 0.30000000000000004 → "0.3" */
export const num = v => {
  const rounded = Math.round(v * 1e6) / 1e6;
  return String(rounded);
};

export const money = v => v.toFixed(2).replace(/\.00$/, '');

export const ordinal = n => {
  const s = ['th', 'st', 'nd', 'rd'], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

/* ----------------------------- question shells ----------------------------- */
export const mathQ = (prompt, math, answer, extra = {}) =>
  ({ type: 'math', prompt, math, answer: String(answer), ...extra });

export const blankQ = (prompt, answer, extra = {}) =>
  ({ type: 'blank', prompt, answer: String(answer), ...extra });

export const multiQ = (r, { prompt, correct, wrong, hint, explanation }) => {
  const opts = sample(r, [...correct, ...wrong], correct.length + wrong.length);
  return {
    type: 'multi', prompt, options: opts,
    answer: correct.map(c => opts.indexOf(c)).sort((a, b) => a - b),
    hint, explanation
  };
};

export const matchQ = (r, { prompt, pairs, explanation }) =>
  ({ type: 'match', prompt, pairs: sample(r, pairs, Math.min(4, pairs.length)), explanation });

export const orderQ = (prompt, items, explanation) =>
  ({ type: 'order', prompt, items, explanation });

export const writtenQ = (prompt, sample_, explanation) =>
  ({ type: 'written', prompt, sample: sample_, explanation });

/**
 * Assemble a worksheet from a weighted list of question makers.
 * Each maker gets its own derived seed so adding a question type later does
 * not reshuffle every existing worksheet.
 */
export function build(seed, count, makers) {
  const out = [];
  let guard = 0;
  while (out.length < count && guard < count * 12) {
    const r = rng(seed + out.length * 7919 + guard * 104729);
    const maker = makers[(out.length + guard) % makers.length];
    guard++;
    let q;
    try { q = maker(r); } catch { continue; }
    if (!q || !q.prompt) continue;
    /* Reject a question identical to one already on the sheet. */
    const key = `${q.type}|${q.prompt}|${q.math ?? ''}|${JSON.stringify(q.options ?? '')}`;
    if (out.some(o => `${o.type}|${o.prompt}|${o.math ?? ''}|${JSON.stringify(o.options ?? '')}` === key)) continue;
    q.id = `q${out.length + 1}`;
    out.push(q);
  }
  return out;
}
