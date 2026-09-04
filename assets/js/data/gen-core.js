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
 * A diagram-labelling question.
 * `parts` are the figure's parts to point at, in the order the markers are
 * numbered. Distractor labels come from the figure's remaining parts, so a
 * wrong option is always a part of the same diagram rather than a word that
 * obviously belongs elsewhere.
 */
export const labelQ = (r, { figure, parts, extras = [], prompt, hint, explanation }) => {
  const options = sample(r, [...parts.map(p => p.label), ...extras],
                         parts.length + extras.length);
  return {
    type: 'label', prompt, figure,
    markers: parts.map(p => ({ x: p.x, y: p.y, to: p.to ?? null })),
    options,
    answer: parts.map(p => options.indexOf(p.label)),
    hint, explanation
  };
};

/**
 * Assemble a worksheet from a weighted list of question makers.
 * Each maker gets its own derived seed so adding a question type later does
 * not reshuffle every existing worksheet.
 */
/* What makes two questions the same question: what is asked, and what the
   answer is. Not which distractors happened to be dealt alongside it — a sheet
   that asks "how do you say breakfast" twice with different wrong options has
   still asked it twice. */
const answerIdentity = q => {
  switch (q.type) {
    case 'choice': return String(q.options?.[q.answer] ?? q.answer);
    case 'multi':  return (q.answer ?? []).map(i => q.options?.[i]).sort().join('\u0001');
    case 'match':  return (q.pairs ?? []).map(p => p.left).sort().join('\u0001');
    case 'order':  return [...(q.items ?? [])].sort().join('\u0001');
    case 'graph':  return JSON.stringify(q.answer ?? '');
    case 'label':  return (q.answer ?? []).map(i => q.options?.[i]).join('\u0001');
    default:       return String(q.answer ?? '');
  }
};
const keyOf = q => [q.type, q.prompt, q.math ?? '', answerIdentity(q)].join('\u0000');

export function build(seed, count, makers) {
  const out = [];
  /* Visit every maker once before repeating any of it. Cycling by index and
     skipping on failure sounds equivalent and is not: a maker that declines a
     difficulty tier shifts the phase, and a twelve-question sheet ended up with
     four matching exercises and one of everything else. A shuffled round-robin
     keeps the mix even however many makers decline. */
  const order = rng(seed ^ 0x9e3779b9);
  const queue = [];
  const rounds = Math.ceil((count * 3) / Math.max(1, makers.length)) + 1;
  for (let i = 0; i < rounds; i++) queue.push(...sample(order, makers.map((_, j) => j), makers.length));

  let guard = 0, at = 0;
  while (out.length < count && at < queue.length && guard < count * 12) {
    const maker = makers[queue[at++]];
    const r = rng(seed + out.length * 7919 + guard * 104729);
    guard++;
    let q;
    try { q = maker(r); } catch { continue; }
    if (!q || !q.prompt) continue;
    /* Reject a question identical to one already on the sheet. The key is
       canonical — options, pairs and items are sorted before comparison —
       because two questions that differ only in the order their options were
       shuffled are the same question, and a sheet that asks it twice looks
       exactly as careless as it is. */
    const key = keyOf(q);
    if (out.some(o => keyOf(o) === key)) continue;
    q.id = `q${out.length + 1}`;
    out.push(q);
  }
  return out;
}
