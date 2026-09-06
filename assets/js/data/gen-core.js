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

/* These three carry a hint like every other shell. They did not, which is why
   the "Show hint" button was greyed out on every matching, ordering and
   written question in the library — the player asks for `q.hint` and there was
   nowhere to put one. The hint is last and optional, so no existing call site
   changes. */
export const matchQ = (r, { prompt, pairs, hint, explanation }) =>
  ({ type: 'match', prompt, pairs: sample(r, pairs, Math.min(4, pairs.length)), hint, explanation });

export const orderQ = (prompt, items, explanation, hint) =>
  ({ type: 'order', prompt, items, explanation, hint });

export const writtenQ = (prompt, sample_, explanation, hint) =>
  ({ type: 'written', prompt, sample: sample_, explanation, hint });

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

/* ------------------------------- hints ----------------------------------
   Every question shell accepts a hint, and most makers now write one, but
   "most" is not a promise a learner can act on: the Show hint button is either
   there or it is a greyed-out lie. So anything that reaches the player without
   an authored hint gets one derived from the question itself.

   The rule for a derived hint is the same as for a written one — unstick
   without answering. For a choice, that is taking one option off the table.
   For a fill-in, it is the shape of the word rather than the word. For a
   number it is the form the answer takes, not its size: a numeric range is
   tempting and leaks, because "between 4 and 6" is the answer 5. Getting the
   form wrong — a decimal where a fraction was wanted, an unsimplified
   result — is a real and common way to lose the mark, and saying so gives
   nothing away. */
/* Which option to take off the table. Not the first one to hand: the wrong
   option most like the answer is the one the question is really testing —
   ruling out "uncodified constitution" when the answer is "codified
   constitution" removes the whole discrimination. So rule out the option
   least like the answer, and leave the near-miss in play. */
const words = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(' ');
export function farthestFrom(correct, wrongs) {
  const target = new Set(words(correct));
  const flat = words(correct).join(' ');
  /* Scored once each rather than inside the comparator: sort calls it O(n log n)
     times and every call re-splits the string. */
  const scored = wrongs.map(w => {
    const parts = words(w);
    const one = parts.join(' ');
    const shared = parts.filter(x => target.has(x)).length;
    return { w, near: shared + (one.includes(flat) || flat.includes(one) ? 10 : 0) };
  });
  return scored.sort((a, b) => a.near - b.near)[0]?.w;
}

const formOf = (answer) => {
  const str = String(answer).trim();
  if (/^-?\d+\/\d+$/.test(str)) return 'The answer is a fraction. Give it in its simplest form.';
  if (/^-?\d*\.\d+$/.test(str)) return 'The answer is a decimal, not a whole number.';
  if (/%$/.test(str)) return 'The answer is a percentage — remember the % sign.';
  if (/^-?\d+$/.test(str)) return 'The answer is a whole number. If yours has a decimal point, check the working.';
  return null;
};

/* Below four letters the count and the first letter together are the word, so
   the count goes out on its own. */
const shapeOf = (answer) => {
  const str = String(answer).trim();
  if (!str) return null;
  const words = str.split(/\s+/);
  if (words.length > 1) return `${words.length} words, beginning “${str[0]}”.`;
  if (str.length < 4) return `A single short word — ${str.length} letters.`;
  return `${str.length} letters, beginning “${str[0]}”.`;
};

/* The hint for a matching question, shared by the makers that write one and
   by the fallback below.

   Two things it has to avoid. Quoting a partner whole hands over the pair
   rather than pointing at it, so one word becomes its first letter and a
   leading article takes the next word's initial with it. And the item it
   names is quoted in full, so an item that happens to contain another pair's
   answer — "obtaining a solid from a solution by evaporating the solvent",
   sitting in the same question as "solvent" — gives away a pair nobody
   pointed at. Those are skipped, and if every candidate is compromised the
   hint falls back to method. */
const asWords = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(' ');
const pointsAt = value => {
  const str = String(value).trim();
  const w = str.split(/\s+/);
  /* A first word that is most of the answer is the answer — "xīngqīyī (星期一)"
     is one word with a gloss stuck to it, not two. */
  const oneWord = w.length === 1 || w[0].length / str.replace(/\s+/g, '').length > 0.6;
  if (oneWord) return str.length > 3 ? `“${str[0]}”` : null;
  return w[0].length <= 3 && w[1] ? `“${w[0]} ${w[1][0]}…”` : `“${w[0]}…”`;
};

export function matchHint(pairs) {
  const list = pairs ?? [];
  /* Each pair's right normalised once, not once per comparison. */
  const rights = list.map(o => asWords(o.right));
  const safe = list.filter((p, i) => {
    const opens = pointsAt(p.right);
    if (!opens) return false;
    /* The word used to point can itself be another pair's whole answer. */
    const word = asWords(opens.replace(/[“”…]/g, '')).join(' ');
    const inLeft = new Set(asWords(p.left));
    for (let j = 0; j < list.length; j++) {
      if (j === i) continue;
      if (word.length >= 4 && rights[j].join(' ') === word) return false;
      const content = rights[j].filter(w => w.length >= 4);
      if (content.length > 0 && content.every(w => inLeft.has(w))) return false;
    }
    return true;
  });
  const p = [...safe].sort((a, b) => String(b.right).length - String(a.right).length)[0];
  if (!p) return 'Place the pairs you are sure of first — with four pairs, being certain of two leaves only two ways to finish.';
  const left = String(p.left);
  const shown = left.length <= 60 ? left : left.slice(0, 59).replace(/\s+\S*$/, '') + '…';
  return `Start with “${shown}”: it goes with the one beginning ${pointsAt(p.right)}.`;
}

/** Fill in a hint for a question that has none. Idempotent. */
export function withHint(q) {
  if (!q || q.hint) return q;
  const set = hint => hint ? { ...q, hint } : q;
  switch (q.type) {
    case 'choice': {
      const wrong = (q.options ?? []).filter((_, i) => i !== q.answer);
      if (!wrong.length) return q;
      const correct = q.options[q.answer];
      const out = farthestFrom(correct, wrong);
      /* A punctuation question offers the same sentence four times. Naming one
         of them rules out nothing, because they read alike — what the reader
         needs is to be told where to look. */
      return set(words(out).join(' ') === words(correct).join(' ')
        ? 'These options differ only in capital letters and punctuation. Check the first letter and the final mark.'
        : `You can rule out “${out}”.`);
    }
    case 'multi': {
      const n = (q.answer ?? []).length;
      const total = (q.options ?? []).length;
      return set(n && total
        ? `Exactly ${n} of the ${total} are correct, so ${total - n} are not. Rule those out first.`
        : null);
    }
    case 'match':
      return set((q.pairs ?? []).length ? matchHint(q.pairs) : null);
    case 'order':
      return set((q.items ?? [])[0]
        ? `“${q.items[0]}” comes first. Work forwards from there.`
        : null);
    case 'blank':
      return set(shapeOf(q.answer));
    case 'math':
      return set(formOf(q.answer)
        ?? 'Write down what you are solving for before you calculate, then check the answer against the question.');
    case 'graph':
      return set('Read both axes before you place anything, then work out the value the question asks for.');
    case 'written':
      return set('Answer in two parts: what is the case, and why. One clear sentence each is enough.');
    default:
      return q;
  }
}

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

  /* The keys of what is already on the sheet. This was `out.some(o => keyOf(o)
     === key)`, which recomputed — and re-sorted the options of — every question
     already placed, for every candidate: five thousand key builds on a
     hundred-question booklet, to answer a question a Set answers once. */
  const placed = new Set();
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
    if (placed.has(key)) continue;
    placed.add(key);
    q.id = `q${out.length + 1}`;
    out.push(q);
  }
  return out;
}
