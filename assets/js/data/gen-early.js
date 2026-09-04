/* Procedural makers for the early years.
   A unit like "Counting to 10" has exactly ten facts in it, and no amount of
   rearranging turns ten facts into a term's worth of worksheets. But counting
   is not a fact bank — it is a procedure, and a procedure composes a fresh
   question every time: count these seven circles, what comes after twelve, one
   less than nine. These makers do that, and a unit opts into the ones that
   suit it by naming them in its `procedural` list. */

import { int, pick, sample, choice, blankQ, nearMisses } from './gen-core.js';

/* Countable marks that print and read cleanly at any size. */
const MARKS = ['●', '★', '▲', '■', '♥', '◆'];
const row = (mark, n) => Array.from({ length: n }, () => mark).join(' ');

const WORD = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight',
              'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen',
              'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];

/* The largest number a unit works with, taken from its own facts so
   "Counting to 10" never asks about seventeen. */
function ceiling(unit, fallback = 10) {
  const nums = (unit.facts ?? []).map(f => Number(f[0])).filter(Number.isFinite);
  return nums.length ? Math.max(...nums, 5) : fallback;
}

export const EARLY_MAKERS = {
  /* ------------------------------- counting ------------------------------- */
  'count-objects': unit => {
    const max = Math.min(ceiling(unit), 20);
    return { kind: 'count', type: 'blank', minTier: 1, capacity: 120, make: r => {
      const n = int(r, 1, max);
      const mark = pick(r, MARKS);
      return blankQ(`Count them and write the number:  ${row(mark, n)}`, String(n),
        { hint: 'Touch each one as you count.', explanation: `There are ${n}.` });
    } };
  },

  'count-choose': unit => {
    const max = Math.min(ceiling(unit), 20);
    return { kind: 'count', type: 'choice', minTier: 1, capacity: 120, make: r => {
      const n = int(r, 1, max);
      const mark = pick(r, MARKS);
      return choice(r, {
        prompt: `How many are there?  ${row(mark, n)}`,
        correct: String(n),
        distractors: sample(r, [n + 1, n - 1, n + 2, Math.max(1, n - 2)].filter(x => x > 0 && x !== n), 3).map(String),
        explanation: `There are ${n}.`
      });
    } };
  },

  'what-comes-next': unit => {
    const max = Math.min(ceiling(unit), 100);
    return { kind: 'count', type: 'blank', minTier: 1, capacity: 90, make: r => {
      const n = int(r, 1, Math.max(2, max - 1));
      return blankQ(`What number comes after ${n}?`, String(n + 1),
        { hint: 'Count on one more.', explanation: `${n + 1} comes after ${n}.` });
    } };
  },

  'what-came-before': unit => {
    const max = Math.min(ceiling(unit), 100);
    return { kind: 'count', type: 'blank', minTier: 1, capacity: 90, make: r => {
      const n = int(r, 2, Math.max(3, max));
      return blankQ(`What number comes just before ${n}?`, String(n - 1),
        { hint: 'Count back one.', explanation: `${n - 1} comes before ${n}.` });
    } };
  },

  'one-more': unit => {
    const max = Math.min(ceiling(unit), 100);
    return { kind: 'count', type: 'choice', minTier: 1, capacity: 90, make: r => {
      const n = int(r, 1, Math.max(2, max - 1));
      return choice(r, {
        prompt: `What is one more than ${n}?`, correct: String(n + 1),
        distractors: nearMisses(n + 1, r).map(String),
        explanation: `One more than ${n} is ${n + 1}.`
      });
    } };
  },

  'one-less': unit => {
    const max = Math.min(ceiling(unit), 100);
    return { kind: 'count', type: 'choice', minTier: 1, capacity: 90, make: r => {
      const n = int(r, 2, Math.max(3, max));
      return choice(r, {
        prompt: `What is one less than ${n}?`, correct: String(n - 1),
        distractors: nearMisses(n - 1, r).map(String),
        explanation: `One less than ${n} is ${n - 1}.`
      });
    } };
  },

  'number-word': () => ({ kind: 'count', type: 'choice', minTier: 1, capacity: 60, make: r => {
    const n = int(r, 0, 20);
    return choice(r, {
      prompt: `Which word means ${n}?`, correct: WORD[n],
      distractors: sample(r, WORD.filter(w => w !== WORD[n]), 3),
      explanation: `${n} is written “${WORD[n]}”.`
    });
  } }),

  'bigger-number': unit => {
    const max = Math.min(ceiling(unit), 100);
    return { kind: 'count', type: 'choice', minTier: 1, capacity: 90, make: r => {
      const a = int(r, 1, max), b = int(r, 1, max);
      if (a === b) return null;
      const big = Math.max(a, b);
      return choice(r, {
        prompt: `Which number is bigger: ${a} or ${b}?`, correct: String(big),
        distractors: [String(Math.min(a, b))],
        explanation: `${big} is bigger than ${Math.min(a, b)}.`
      });
    } };
  },

  /* -------------------------------- adding -------------------------------- */
  'add-pictures': unit => {
    const max = Math.min(ceiling(unit), 10);
    return { kind: 'count', type: 'blank', minTier: 1, capacity: 120, make: r => {
      const a = int(r, 1, Math.max(2, max - 1));
      const b = int(r, 1, Math.max(1, max - a));
      const mark = pick(r, MARKS);
      return blankQ(`${row(mark, a)}   and   ${row(mark, b)}   — how many altogether?`,
        String(a + b),
        { hint: 'Count them all together.', explanation: `${a} + ${b} = ${a + b}.` });
    } };
  },

  'add-numbers': unit => {
    const max = Math.min(ceiling(unit), 20);
    return { kind: 'count', type: 'blank', minTier: 1, capacity: 120, make: r => {
      const a = int(r, 1, Math.max(2, max - 1));
      const b = int(r, 1, Math.max(1, max - a));
      return blankQ(`${a} + ${b} = ?`, String(a + b),
        { hint: `Start at ${a} and count on ${b}.`, explanation: `${a} + ${b} = ${a + b}.` });
    } };
  },

  'take-away': unit => {
    const max = Math.min(ceiling(unit), 20);
    return { kind: 'count', type: 'blank', minTier: 1, capacity: 120, make: r => {
      const a = int(r, 2, Math.max(3, max));
      const b = int(r, 1, a);
      return blankQ(`${a} − ${b} = ?`, String(a - b),
        { hint: `Start at ${a} and count back ${b}.`, explanation: `${a} − ${b} = ${a - b}.` });
    } };
  },

  'number-bond': unit => {
    const total = Math.min(ceiling(unit), 20);
    return { kind: 'count', type: 'blank', minTier: 1, capacity: 60, make: r => {
      const a = int(r, 1, total - 1);
      return blankQ(`${a} + ___ = ${total}`, String(total - a),
        { hint: `How many more to reach ${total}?`, explanation: `${a} + ${total - a} = ${total}.` });
    } };
  },

  'doubles': () => ({ kind: 'count', type: 'blank', minTier: 1, capacity: 40, make: r => {
    const n = int(r, 1, 10);
    return blankQ(`Double ${n} is ___`, String(n * 2),
      { hint: `${n} and another ${n}.`, explanation: `Double ${n} is ${n * 2}.` });
  } }),

  'skip-count': () => ({ kind: 'count', type: 'blank', minTier: 1, capacity: 90, make: r => {
    const step = pick(r, [2, 3, 4, 5, 10]);
    const start = step * int(r, 1, 6);
    return blankQ(`Counting in ${step}s: ${start}, ${start + step}, ${start + step * 2}, ___`,
      String(start + step * 3),
      { hint: `Add ${step} each time.`, explanation: `${start + step * 2} + ${step} = ${start + step * 3}.` });
  } }),

  /* -------------------------------- letters -------------------------------- */
  'first-letter': unit => {
    const words = (unit.facts ?? []).map(f => String(f[0])).filter(w => /^[a-z]{3,}$/i.test(w));
    if (words.length < 4) return null;
    return { kind: 'letters', type: 'choice', minTier: 1, capacity: words.length * 2, make: r => {
      const w = pick(r, words);
      const first = w[0].toLowerCase();
      const others = [...new Set(words.map(x => x[0].toLowerCase()))].filter(l => l !== first);
      if (others.length < 3) return null;
      return choice(r, {
        prompt: `Which letter does “${w}” start with?`, correct: first,
        distractors: sample(r, others, 3),
        explanation: `“${w}” starts with ${first}.`
      });
    } };
  },

  'last-letter': unit => {
    const words = (unit.facts ?? []).map(f => String(f[0])).filter(w => /^[a-z]{3,}$/i.test(w));
    if (words.length < 4) return null;
    return { kind: 'letters', type: 'choice', minTier: 1, capacity: words.length * 2, make: r => {
      const w = pick(r, words);
      const last = w[w.length - 1].toLowerCase();
      const others = [...new Set(words.map(x => x[x.length - 1].toLowerCase()))].filter(l => l !== last);
      if (others.length < 3) return null;
      return choice(r, {
        prompt: `Which letter does “${w}” end with?`, correct: last,
        distractors: sample(r, others, 3),
        explanation: `“${w}” ends with ${last}.`
      });
    } };
  },

  'count-letters': unit => {
    const words = (unit.facts ?? []).map(f => String(f[0])).filter(w => /^[a-z]{2,}$/i.test(w));
    if (words.length < 4) return null;
    return { kind: 'letters', type: 'blank', minTier: 1, capacity: words.length * 2, make: r => {
      const w = pick(r, words);
      return blankQ(`How many letters are in “${w}”?`, String(w.length),
        { hint: 'Point to each letter as you count.', explanation: `“${w}” has ${w.length} letters.` });
    } };
  },

  /* -------------------------------- shapes -------------------------------- */
  'shape-sides': () => {
    const SHAPES = [['triangle', 3], ['square', 4], ['rectangle', 4], ['pentagon', 5],
                    ['hexagon', 6], ['octagon', 8]];
    return { kind: 'shapes', type: 'blank', minTier: 1, capacity: 40, make: r => {
      const [name, sides] = pick(r, SHAPES);
      return blankQ(`How many sides does a ${name} have?`, String(sides),
        { hint: 'Count around the edge.', explanation: `A ${name} has ${sides} sides.` });
    } };
  },

  'shape-from-sides': () => {
    const SHAPES = [['triangle', 3], ['square', 4], ['pentagon', 5], ['hexagon', 6], ['octagon', 8]];
    return { kind: 'shapes', type: 'choice', minTier: 1, capacity: 30, make: r => {
      const [name, sides] = pick(r, SHAPES);
      return choice(r, {
        prompt: `Which shape has ${sides} sides?`, correct: name,
        distractors: sample(r, SHAPES.filter(s => s[0] !== name).map(s => s[0]), 3),
        explanation: `A ${name} has ${sides} sides.`
      });
    } };
  }
};

/**
 * Build the procedural makers a unit has opted into.
 * A maker that cannot work with this unit's items returns null and is dropped,
 * so a unit never advertises an activity it cannot actually produce.
 */
export function proceduralMakers(unit) {
  const out = [];
  for (const id of unit.procedural ?? []) {
    const factory = EARLY_MAKERS[id];
    if (!factory) continue;
    const spec = factory(unit);
    if (!spec) continue;
    const fn = (r, tier = 1) => spec.make(r, tier);
    Object.assign(fn, { id, kind: spec.kind, type: spec.type, minTier: spec.minTier, capacity: spec.capacity });
    out.push(fn);
  }
  return out;
}
