/* What a pre-K sheet is about, separated from what the page looks like.

   The catalogue crosses 518 skills with 24 page formats. Written as one maker
   per pair that is twelve thousand makers, which is not a thing anyone should
   write or read. But the two halves are independent: the skill decides what
   the child is looking for, the format decides what the page asks them to do
   with it. "Circle every picture that starts with /b/" and "sort the pictures
   into starts-with-/b/ and does not" want the same content and different
   furniture.

   So this file answers one question per skill kind — what matches, what does
   not, what pairs with what, what order it goes in — and gen-pk-formats.js
   turns that answer into a page. Thirty-seven providers and twenty-four
   formats instead of twelve thousand makers, and the content is written once
   so a fix lands everywhere at once.

   Every provider is handed the live theme, so the same skill asks about
   dinosaurs on one sheet and the bakery on the next. That is where the
   variety comes from: not from more skills, but from the same skill never
   dressing the same way twice.                                              */

import { int, pick, sample } from './gen-core.js';
import { PK_WORDS, PK_BY_START, PK_BY_END, PK_BY_RHYME, PK_BY_SYL } from './gen-pk-words.js';

/* An item is a thing the child can see: a word for the answer key and a
   picture for the page. A letter's picture is the letter. */
export const G = (label, glyph) => ({ label, glyph });

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const w2g = w => G(w.word, w.pic);

/* Colours are named by a picture that really is that colour, so the page
   works in colour and still reads in black and white. */
export const COLOUR_PICS = {
  red: '🔴', blue: '🔵', green: '🟢', yellow: '🟡', purple: '🟣', orange: '🟠',
  brown: '🟤', black: '⚫', white: '⚪', pink: '🌸', gray: '🐘'
};
export const COLOUR_HEX = {
  red: '#e02b2b', blue: '#2b6ee0', green: '#2faa4a', yellow: '#f2c218', purple: '#8b4fd0',
  orange: '#f08020', brown: '#8a5a2b', black: '#222222', white: '#ffffff',
  pink: '#f07ab0', gray: '#8d939b'
};

export const SHAPE_SIDES = {
  triangle: 3, square: 4, rectangle: 4, diamond: 4, pentagon: 5, hexagon: 6, octagon: 8,
  circle: 0, oval: 0, semicircle: 0, star: 5, heart: 0
};

const THREE_D = {
  cone:     ['party hat', '🎉', 'ice-cream cone', '🍦', 'traffic cone', '🚧'],
  cube:     ['dice', '🎲', 'a box', '📦', 'a sugar lump', '🧊'],
  cylinder: ['a tin', '🥫', 'a drum', '🥁', 'a candle', '🕯️'],
  pyramid:  ['a pyramid', '🔺', 'a tent', '⛺', 'a roof', '🏠'],
  sphere:   ['a ball', '⚽', 'an orange', '🍊', 'the Earth', '🌍']
};

const FEELING_FACES = {
  angry: '😠', calm: '😌', excited: '🤩', happy: '😀', proud: '😊',
  sad: '😢', scared: '😨', shy: '😳', surprised: '😲', worried: '😟'
};

const POSITION_PICS = {
  above: '⬆️', behind: '🫥', below: '⬇️', between: '↔️', 'in front of': '👀',
  in: '📥', 'next to': '➡️', on: '🔝', under: '⬇️'
};

const SIZE_PICS = {
  big: '🐘', small: '🐭', full: '🥛', empty: '🥛', heavy: '🪨', light: '🪶',
  long: '🚂', short: '🚗', tall: '🦒', thick: '📚', thin: '📄', wide: '🚌', narrow: '🚲'
};

const ORDINALS = ['first', 'second', 'third', 'fourth', 'fifth'];

/* --------------------------- theme prop helpers --------------------------- */

const props = theme => theme.props.map(([label, glyph]) => G(label, glyph));
const prop  = (r, theme) => pick(r, props(theme));

/** Props from other themes, for when a question needs things that do not belong. */
const foreign = (r, theme, themes, n) => {
  const others = themes.filter(t => t.id !== theme.id);
  return sample(r, others, n).map(t => pick(r, props(t)));
};

/* ------------------------------- providers ------------------------------- */

/* Each provider is handed { skill, theme, themes, r } and answers with the
   fields its formats need. Nothing here knows what a page looks like. */
const P = {};

/* --- letters --- */

const letterContent = (letter, other, r, kind) => {
  const wrong = sample(r, ALPHABET.filter(L => L.toUpperCase() !== letter.toUpperCase()), 8)
    .map(L => (kind === 'lower' ? L.toLowerCase() : L));
  return {
    about: `the ${kind === 'lower' ? 'lowercase' : 'uppercase'} letter ${letter}`,
    say: `is the letter ${letter}`,
    target: G(letter, letter),
    yes: [G(letter, letter), G(letter, letter), G(letter, letter)],
    no: wrong.map(L => G(L, L)),
    other
  };
};

P.letterUpper = ({ skill, r }) => letterContent(skill.target, skill.target.toLowerCase(), r, 'upper');
P.letterLower = ({ skill, r }) => letterContent(skill.target, skill.target.toUpperCase(), r, 'lower');

P.letterMatch = ({ skill, r }) => {
  const U = skill.target, l = U.toLowerCase();
  const others = sample(r, ALPHABET.filter(L => L !== U), 3);
  return {
    about: `uppercase ${U} and lowercase ${l}`,
    say: `matches uppercase ${U}`,
    target: G(l, l),
    yes: [G(l, l)],
    no: others.map(L => G(L.toLowerCase(), L.toLowerCase())),
    pairs: [{ a: G(U, U), b: G(l, l) },
            ...others.map(L => ({ a: G(L, L), b: G(L.toLowerCase(), L.toLowerCase()) }))]
  };
};

const formContent = (glyph, name) => ({
  about: name, say: `is ${name}`, target: G(name, glyph),
  trace: glyph, yes: [G(name, glyph)], no: []
});

P.formUpper    = ({ skill }) => formContent(skill.target, `uppercase ${skill.target}`);
P.formLower    = ({ skill }) => formContent(skill.target, `lowercase ${skill.target}`);
P.numeralWrite = ({ skill }) => formContent(String(skill.target), `the numeral ${skill.target}`);

/* --- sounds and words --- */

P.soundStart = ({ skill, r }) => {
  const s = skill.target;
  const yes = sample(r, PK_BY_START[s] || [], 5).map(w2g);
  const no  = sample(r, PK_WORDS.filter(w => w.start !== s), 8).map(w2g);
  return {
    about: `the sound /${s}/ at the start of a word`,
    say: `starts with /${s}/`,
    target: G(s, s.toUpperCase()),
    yes, no,
    groups: [{ name: `starts with /${s}/`, items: yes }, { name: `does not`, items: no }],
    pairs: yes.slice(0, 4).map(g => ({ a: g, b: G(s, s.toUpperCase()) }))
  };
};

P.soundEnd = ({ skill, r }) => {
  const s = skill.target;
  const yes = sample(r, PK_BY_END[s] || [], 5).map(w2g);
  const no  = sample(r, PK_WORDS.filter(w => w.end !== s), 8).map(w2g);
  return {
    about: `the sound /${s}/ at the end of a word`,
    say: `ends with /${s}/`,
    target: G(s, s.toUpperCase()),
    yes, no,
    groups: [{ name: `ends with /${s}/`, items: yes }, { name: `does not`, items: no }]
  };
};

P.sightWord = ({ skill, r }) => {
  const word = skill.target;
  const others = sample(r, ['the', 'and', 'see', 'you', 'we', 'go', 'is', 'my', 'me', 'it',
    'at', 'in', 'up', 'no', 'big', 'can', 'look', 'play', 'like', 'here']
    .filter(w => w !== word), 8);
  return {
    about: `the word "${word}"`,
    say: `is the word "${word}"`,
    target: G(word, word),
    trace: word,
    yes: [G(word, word), G(word, word), G(word, word)],
    no: others.map(w => G(w, w))
  };
};

P.rhyme = ({ skill, r }) => {
  const fam = skill.target;
  const yes = sample(r, PK_BY_RHYME[fam] || [], 4).map(w2g);
  const no  = sample(r, PK_WORDS.filter(w => w.rhyme !== fam), 8).map(w2g);
  return {
    about: `the -${fam} word family`,
    say: `rhymes with "${(PK_BY_RHYME[fam] || [])[0]?.word ?? fam}"`,
    target: G(`-${fam}`, `-${fam}`),
    yes, no,
    groups: [{ name: `rhymes with -${fam}`, items: yes }, { name: 'does not rhyme', items: no }],
    pairs: (() => {
      const fams = sample(r, Object.keys(PK_BY_RHYME).filter(f => PK_BY_RHYME[f].length >= 2), 4);
      return fams.map(f => {
        const two = sample(r, PK_BY_RHYME[f], 2);
        return { a: w2g(two[0]), b: w2g(two[1]) };
      });
    })()
  };
};

P.cvc = ({ skill, r }) => {
  const v = skill.target;
  const withVowel = PK_WORDS.filter(w => w.syl === 1 && w.rhyme && w.rhyme[0] === v);
  const yes = sample(r, withVowel.length >= 3 ? withVowel : PK_WORDS.filter(w => w.syl === 1), 5).map(w2g);
  const no  = sample(r, PK_WORDS.filter(w => w.syl > 1), 8).map(w2g);
  return {
    about: `words with the short ${v} sound`,
    say: `has the short ${v} sound`,
    target: G(v, v),
    yes, no,
    spell: yes,
    pairs: yes.slice(0, 4).map(g => ({ a: g, b: G(g.label, g.label) }))
  };
};

P.syllables = ({ skill, r }) => {
  const n = skill.target;
  const yes = sample(r, PK_BY_SYL[n] || [], 5).map(w2g);
  const no  = sample(r, PK_WORDS.filter(w => w.syl !== n), 8).map(w2g);
  return {
    about: `words with ${n} ${n === 1 ? 'clap' : 'claps'}`,
    say: `has ${n} ${n === 1 ? 'clap' : 'claps'}`,
    target: G(String(n), String(n)),
    n, yes, no,
    groups: [{ name: `${n} ${n === 1 ? 'clap' : 'claps'}`, items: yes }, { name: 'a different number', items: no }]
  };
};

/* --- numbers --- */

P.numeral = ({ skill, r }) => {
  const n = skill.target;
  const wrong = sample(r, [...Array(21).keys()].filter(m => m !== n), 8);
  return {
    about: `the numeral ${n}`,
    say: `is the number ${n}`,
    target: G(String(n), String(n)),
    n,
    yes: [G(String(n), String(n)), G(String(n), String(n)), G(String(n), String(n))],
    no: wrong.map(m => G(String(m), String(m)))
  };
};

P.countSet = ({ skill, theme, r }) => {
  const n = skill.target;
  const p = prop(r, theme);
  return {
    about: `counting ${p.label}`,
    say: `there are ${n}`,
    target: p, n, count: n, item: p,
    yes: [G(String(n), String(n))],
    no: sample(r, [n - 1, n + 1, n - 2, n + 2, n + 3].filter(m => m > 0 && m !== n), 3)
          .map(m => G(String(m), String(m)))
  };
};

P.subitize = ({ skill, theme, r }) => {
  const n = skill.target;
  const p = prop(r, theme);
  return {
    about: `seeing ${n} at a glance`,
    say: `shows ${n}`,
    target: G(String(n), String(n)), n, count: n, item: p,
    dots: n,
    yes: [G(String(n), String(n))],
    no: sample(r, [1, 2, 3, 4, 5, 6].filter(m => m !== n), 3).map(m => G(String(m), String(m))),
    pairs: sample(r, [1, 2, 3, 4, 5, 6], 4).map(m => ({ a: G(`${m} dots`, '•'.repeat(m)), b: G(String(m), String(m)) }))
  };
};

P.bond = ({ skill, theme, r }) => {
  const n = skill.target;
  const a = int(r, 1, n - 1), b = n - a;
  const p = prop(r, theme);
  return {
    about: `the ways to make ${n}`,
    say: `makes ${n}`,
    target: G(String(n), String(n)),
    n, a, b, item: p, count: n,
    yes: [G(String(b), String(b))],
    no: sample(r, [...Array(n + 3).keys()].filter(m => m !== b && m >= 0), 3).map(m => G(String(m), String(m))),
    pairs: sample(r, [...Array(n - 1).keys()].map(i => i + 1), 4)
             .map(x => ({ a: G(String(x), String(x)), b: G(String(n - x), String(n - x)) }))
  };
};

P.oneMoreLess = ({ skill, theme, r }) => {
  const n = skill.target;
  const more = r() < 0.5;
  const from = more ? n - 1 : n + 1;
  const p = prop(r, theme);
  return {
    about: `one more and one less than ${n}`,
    say: more ? `is one more than ${from}` : `is one less than ${from}`,
    target: G(String(n), String(n)),
    n, from, more, item: p, count: n,
    yes: [G(String(n), String(n))],
    no: sample(r, [n - 1, n + 1, n + 2, from].filter(m => m >= 0 && m !== n), 3).map(m => G(String(m), String(m))),
    pairs: sample(r, [1, 2, 3, 4, 5, 6, 7, 8, 9], 4).map(x => ({
      a: G(String(x), String(x)), b: G(String(x + 1), String(x + 1))
    }))
  };
};

P.orderNumbers = ({ skill, r }) => {
  const [lo, hi] = skill.target;
  const span = Math.min(5, hi - lo + 1);
  const start = int(r, lo, hi - span + 1);
  const run = Array.from({ length: span }, (_, i) => start + i);
  return {
    about: `putting numbers ${lo}–${hi} in order`,
    say: 'comes next',
    target: G(String(run[run.length - 1]), String(run[run.length - 1])),
    lo, hi, run,
    steps: run.map(m => G(String(m), String(m))),
    dots: run,
    yes: [G(String(run[run.length - 1]), String(run[run.length - 1]))],
    no: sample(r, [start - 1, start + span, start + span + 1, hi].filter(m => m >= 0 && !run.includes(m)), 3)
          .map(m => G(String(m), String(m)))
  };
};

P.count100 = ({ r }) => {
  const start = int(r, 1, 9) * 10;
  const run = Array.from({ length: 5 }, (_, i) => start + i);
  return {
    about: 'counting on to 100',
    say: 'comes next when we count by ones',
    target: G(String(run[4]), String(run[4])),
    run, steps: run.map(m => G(String(m), String(m))), dots: run,
    yes: [G(String(run[4]), String(run[4]))],
    no: [run[0], run[4] + 2, run[4] + 10].map(m => G(String(m), String(m)))
  };
};

P.skipCount = ({ skill, r }) => {
  const [step, top] = skill.target;
  const start = step * int(r, 1, Math.max(1, top / step - 4));
  const run = Array.from({ length: 5 }, (_, i) => start + i * step);
  return {
    about: `counting by ${step}s to ${top}`,
    say: `comes next when we count by ${step}s`,
    target: G(String(run[4]), String(run[4])),
    step, run, steps: run.map(m => G(String(m), String(m))), dots: run,
    yes: [G(String(run[4]), String(run[4]))],
    no: [run[3] + 1, run[4] + 1, run[4] + step].map(m => G(String(m), String(m)))
  };
};

P.numQuantity = ({ theme, r }) => {
  const ns = sample(r, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 4);
  const p = prop(r, theme);
  const n = ns[0];
  return {
    about: 'matching a numeral to a number of things',
    say: `shows ${n}`,
    target: G(String(n), String(n)), n, count: n, item: p, dots: n,
    yes: [G(String(n), String(n))],
    no: ns.slice(1).map(m => G(String(m), String(m))),
    pairs: ns.map(m => ({ a: G(String(m), String(m)), b: G(`${m} ${p.label}`, p.glyph.repeat(m)) }))
  };
};

const picSum = (skill, theme, r, sub) => {
  const cap = skill.target;
  const a = int(r, sub ? 2 : 1, cap - 1);
  const b = sub ? int(r, 1, a - 1 >= 1 ? a - 1 : 1) : int(r, 1, cap - a);
  const p = prop(r, theme);
  const ans = sub ? a - b : a + b;
  return {
    about: sub ? `taking away up to ${cap}` : `adding up to ${cap}`,
    say: sub ? `is ${a} take away ${b}` : `is ${a} and ${b} together`,
    target: G(String(ans), String(ans)),
    a, b, sub, n: ans, count: ans, item: p,
    yes: [G(String(ans), String(ans))],
    no: sample(r, [ans - 1, ans + 1, ans + 2, a, b].filter(m => m >= 0 && m !== ans), 3)
          .map(m => G(String(m), String(m))),
    pairs: sample(r, [...Array(cap).keys()].map(i => i + 1), 4).map(x => ({
      a: G(sub ? `${x + 1} - 1` : `${x} + 1`, sub ? `${x + 1} − 1` : `${x} + 1`),
      b: G(String(x), String(x))
    }))
  };
};
P.addPics = ({ skill, theme, r }) => picSum(skill, theme, r, false);
P.subPics = ({ skill, theme, r }) => picSum(skill, theme, r, true);

P.compareGroups = ({ skill, theme, r }) => {
  const want = skill.target;                    // 'more' | 'fewer' | 'same'
  const a = int(r, 2, 8);
  const b = want === 'same' ? a : (want === 'more' ? a + int(r, 1, 3) : a - int(r, 1, Math.min(2, a - 1)));
  const [p, q] = sample(r, props(theme), 2);
  const left = { item: p, n: a }, right = { item: q, n: b };
  const answer = want === 'same' ? 'the same' : (b > a ? q.label : p.label);
  return {
    about: `which group has ${want === 'same' ? 'the same number' : want}`,
    say: `has ${want === 'same' ? 'the same number' : want}`,
    target: G(answer, answer),
    left, right, want,
    graphRows: [{ label: p.label, glyph: p.glyph, n: a }, { label: q.label, glyph: q.glyph, n: b }],
    yes: [G(answer, answer)],
    no: [p.label, q.label, 'the same'].filter(x => x !== answer).map(x => G(x, x)),
    pairs: sample(r, props(theme), 4).map((x, i) => ({
      a: G(`${i + 2} ${x.label}`, x.glyph.repeat(i + 2)), b: G(String(i + 2), String(i + 2))
    }))
  };
};

P.measureLength = ({ theme, r }) => {
  const unit = pick(r, [G('paper clips', '📎'), G('blocks', '🧱'), G('cubes', '🟦'), G('leaves', '🍃')]);
  const p = prop(r, theme);
  const n = int(r, 3, 8);
  return {
    about: 'measuring with things instead of a ruler',
    say: `is ${n} ${unit.label} long`,
    target: G(String(n), String(n)),
    n, count: n, item: unit, thing: p,
    yes: [G(String(n), String(n))],
    no: sample(r, [n - 1, n + 1, n + 2].filter(m => m > 0), 3).map(m => G(String(m), String(m)))
  };
};

P.pictureGraph = ({ theme, r }) => {
  const rows = sample(r, props(theme), 3).map(p => ({ label: p.label, glyph: p.glyph, n: int(r, 1, 6) }));
  const most = rows.reduce((x, y) => (y.n > x.n ? y : x));
  return {
    about: 'reading a picture graph',
    say: 'has the most',
    target: G(most.label, most.glyph),
    graphRows: rows, n: most.n,
    yes: [G(most.label, most.label)],
    no: rows.filter(x => x !== most).map(x => G(x.label, x.label))
           .concat([G('none of them', 'none of them')])
  };
};

P.timeHour = ({ r }) => {
  const h = int(r, 1, 12);
  return {
    about: 'telling the time to the hour',
    say: `says ${h} o'clock`,
    target: G(`${h} o'clock`, `${h}:00`),
    hour: h, clock: h,
    yes: [G(`${h} o'clock`, `${h} o'clock`)],
    no: sample(r, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter(x => x !== h), 3)
          .map(x => G(`${x} o'clock`, `${x} o'clock`)),
    pairs: sample(r, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 4)
             .map(x => ({ a: G(`${x}:00`, `${x}:00`), b: G(`${x} o'clock`, `${x} o'clock`) }))
  };
};

P.halves = ({ theme, r }) => {
  const p = prop(r, theme);
  const n = int(r, 1, 5) * 2;
  return {
    about: 'halves',
    say: 'is half',
    target: G(String(n / 2), String(n / 2)),
    n: n / 2, whole: n, item: p, count: n,
    yes: [G(String(n / 2), String(n / 2))],
    no: sample(r, [n, n / 2 + 1, n / 2 - 1, n + 1].filter(m => m > 0 && m !== n / 2), 3)
          .map(m => G(String(m), String(m)))
  };
};

P.equalGroups = ({ theme, r }) => {
  const groups = int(r, 2, 4), each = int(r, 2, 4);
  const p = prop(r, theme);
  return {
    about: 'sharing fairly',
    say: 'gets the same number',
    target: G(String(each), String(each)),
    groups: null, n: each, total: groups * each, per: each, howMany: groups, item: p, count: groups * each,
    yes: [G(String(each), String(each))],
    no: sample(r, [each + 1, each - 1, groups * each, groups].filter(m => m > 0 && m !== each), 3)
          .map(m => G(String(m), String(m)))
  };
};

P.wordProblems = ({ theme, r }) => {
  const a = int(r, 1, 5), b = int(r, 1, 4);
  const p = prop(r, theme);
  const away = r() < 0.4 && a > b;
  const ans = away ? a - b : a + b;
  return {
    about: 'a story with a number in it',
    say: away ? `are left` : `are there now`,
    story: away
      ? `There were ${a} ${p.label}. ${b} went away.`
      : `There were ${a} ${p.label}. ${b} more came.`,
    target: G(String(ans), String(ans)),
    n: ans, a, b, away, item: p, count: ans,
    yes: [G(String(ans), String(ans))],
    no: sample(r, [ans + 1, ans - 1, a, b].filter(m => m >= 0 && m !== ans), 3).map(m => G(String(m), String(m)))
  };
};

P.tally = ({ theme, r }) => {
  const rows = sample(r, props(theme), 3).map(p => ({ label: p.label, glyph: p.glyph, n: int(r, 3, 12) }));
  const row = rows[0];
  return {
    about: 'counting in fives with tally marks',
    say: `is ${row.n}`,
    target: G(String(row.n), String(row.n)),
    n: row.n, item: G(row.label, row.glyph), count: row.n, graphRows: rows,
    yes: [G(String(row.n), String(row.n))],
    no: sample(r, [row.n + 1, row.n - 1, row.n + 5].filter(m => m > 0), 3).map(m => G(String(m), String(m)))
  };
};

/* --- shape, size, space --- */

P.shape2d = ({ skill, r }) => {
  const s = skill.target;
  const others = sample(r, Object.keys(SHAPE_SIDES).filter(x => x !== s), 8);
  return {
    about: `the ${s}`,
    say: `is a ${s}`,
    target: G(s, s),
    shape: s, trace: s,
    yes: [G(s, s), G(s, s), G(s, s)],
    no: others.map(x => G(x, x)),
    groups: [{ name: `${s}s`, items: [G(s, s), G(s, s), G(s, s)] },
             { name: 'other shapes', items: others.map(x => G(x, x)) }]
  };
};

P.shape3d = ({ skill, r }) => {
  const s = skill.target;
  const mine = THREE_D[s];
  const objs = [];
  for (let i = 0; i < mine.length; i += 2) objs.push(G(mine[i], mine[i + 1]));
  const otherKeys = Object.keys(THREE_D).filter(k => k !== s);
  const no = otherKeys.flatMap(k => {
    const l = THREE_D[k];
    return [G(l[0], l[1])];
  });
  return {
    about: `${s}s in real things`,
    say: `is shaped like a ${s}`,
    target: G(s, s),
    shape: s,
    yes: objs, no,
    groups: [{ name: `${s}s`, items: objs }, { name: 'not a ' + s, items: no }],
    pairs: [...objs.slice(0, 2).map(o => ({ a: o, b: G(s, s) })),
            ...sample(r, otherKeys, 2).map(k => ({ a: G(THREE_D[k][0], THREE_D[k][1]), b: G(k, k) }))]
  };
};

P.sizeCompare = ({ skill, theme, r }) => {
  const [a, b] = skill.target;
  const which = r() < 0.5 ? a : b;
  return {
    about: `${a} and ${b}`,
    say: `is ${which}`,
    target: G(which, SIZE_PICS[which] ?? '🔍'),
    pair: [a, b], which,
    steps: [G(a, SIZE_PICS[a] ?? '🔍'), G(b, SIZE_PICS[b] ?? '🔍')],
    yes: [G(which, which)],
    no: [G(which === a ? b : a, which === a ? b : a),
         G('both the same', 'both the same'), G('neither', 'neither')],
    groups: [{ name: a, items: [G(a, SIZE_PICS[a] ?? '🔍')] },
             { name: b, items: [G(b, SIZE_PICS[b] ?? '🔍')] }],
    item: prop(r, theme)
  };
};

P.orderSize = ({ theme, r }) => {
  const p = prop(r, theme);
  return {
    about: 'putting three things in size order',
    say: 'is the biggest',
    target: G('biggest', p.glyph),
    item: p,
    steps: [G('smallest', p.glyph), G('middle', p.glyph), G('biggest', p.glyph)],
    sizes: [0.6, 0.9, 1.3],
    yes: [G('biggest', 'biggest')],
    no: [G('smallest', 'smallest'), G('middle', 'middle'), G('all the same', 'all the same')]
  };
};

P.symmetry = ({ r }) => {
  const s = pick(r, ['heart', 'butterfly', 'star', 'tree', 'leaf']);
  const pics = { heart: '❤️', butterfly: '🦋', star: '⭐', tree: '🌳', leaf: '🍃' };
  return {
    about: 'both sides matching',
    say: 'has two matching halves',
    target: G(s, pics[s]),
    item: G(s, pics[s]),
    yes: [G(s, pics[s])],
    no: [G('a shoe', '👟'), G('a hand', '✋'), G('a flag', '🚩')],
    pairs: sample(r, Object.keys(pics), 4).map(k => ({ a: G(k, pics[k]), b: G(`half a ${k}`, pics[k]) }))
  };
};

P.halfPicture = ({ theme, r }) => {
  const p = prop(r, theme);
  return {
    about: 'finishing a picture so both halves match',
    say: 'finishes the picture',
    target: p, item: p,
    yes: [p],
    no: sample(r, props(theme).filter(x => x.label !== p.label), 3),
    pairs: sample(r, props(theme), 4).map(x => ({ a: G(`half a ${x.label}`, x.glyph), b: x }))
  };
};

P.pattern = ({ skill, theme, r }) => {
  const code = skill.target;                                  // 'AB', 'AAB', ...
  const letters = [...new Set(code.split(''))];
  const chosen = sample(r, props(theme), letters.length);
  const map = Object.fromEntries(letters.map((L, i) => [L, chosen[i]]));
  const full = (code + code + code).split('').map(L => map[L]);
  const shown = full.slice(0, code.length * 2 + 1);
  const next = full[shown.length];
  return {
    about: `an ${code} pattern`,
    say: 'comes next in the pattern',
    target: next,
    code, shown, next,
    yes: [next],
    no: chosen.filter(x => x.label !== next.label)
          .concat(sample(r, props(theme).filter(x => !chosen.some(c => c.label === x.label)), 3))
          .slice(0, 3)
  };
};

P.texturePattern = P.pattern;

P.ordinal = ({ skill, theme, r }) => {
  const word = skill.target;
  const idx = word === 'last' ? 4 : ORDINALS.indexOf(word);
  const line = sample(r, props(theme), 5);
  return {
    about: `the ${word} one in a line`,
    say: `is ${word}`,
    target: line[idx],
    word, idx, line,
    steps: line,
    yes: [G(line[idx].label, line[idx].label)],
    no: line.filter((_, i) => i !== idx).slice(0, 3).map(x => G(x.label, x.label))
  };
};

P.position = ({ skill, theme, r }) => {
  const word = skill.target;
  const [a, b] = sample(r, props(theme), 2);
  return {
    about: `the word "${word}"`,
    say: `is ${word}`,
    target: G(word, POSITION_PICS[word] ?? '📍'),
    word, a, b,
    yes: [G(word, word)],
    no: sample(r, Object.keys(POSITION_PICS).filter(x => x !== word), 3).map(x => G(x, x))
  };
};

P.gridCoords = ({ theme, r }) => {
  const cols = ['A', 'B', 'C'], rows = ['1', '2', '3'];
  const cells = [];
  const chosen = sample(r, props(theme), 4);
  let k = 0;
  for (const c of cols) for (const n of rows) cells.push({ ref: c + n, item: k < 4 && r() < 0.5 ? chosen[k++] : null });
  const filled = cells.filter(c => c.item);
  const one = filled.length ? pick(r, filled) : (cells[0].item = chosen[0], cells[0]);
  return {
    about: 'finding a square on a grid',
    say: `is in square ${one.ref}`,
    target: one.item,
    gridCells: cells, cols, rows, ref: one.ref,
    yes: [G(one.item.label, one.item.label)],
    no: sample(r, props(theme).filter(x => x.label !== one.item.label), 3).map(x => G(x.label, x.label))
  };
};

/* --- colour --- */

P.colour = ({ skill, r }) => {
  const c = skill.target;
  const others = sample(r, Object.keys(COLOUR_PICS).filter(x => x !== c), 8);
  return {
    about: `the colour ${c}`,
    say: `is ${c}`,
    target: G(c, COLOUR_PICS[c]),
    colour: c,
    yes: [G(c, COLOUR_PICS[c]), G(c, COLOUR_PICS[c]), G(c, COLOUR_PICS[c])],
    no: others.map(x => G(x, COLOUR_PICS[x])),
    groups: [{ name: c, items: [G(c, COLOUR_PICS[c])] },
             { name: 'not ' + c, items: others.map(x => G(x, COLOUR_PICS[x])) }]
  };
};

P.colourMix = ({ skill, r }) => {
  const [a, b, c] = skill.target;
  return {
    about: `mixing ${a} and ${b}`,
    say: `you get when you mix ${a} and ${b}`,
    target: G(c, COLOUR_PICS[c]),
    mix: [a, b, c], colour: c,
    yes: [G(c, c)],
    no: sample(r, Object.keys(COLOUR_PICS).filter(x => x !== c), 3).map(x => G(x, x))
  };
};

P.insideLines = ({ theme, r }) => {
  const p = prop(r, theme);
  const c = pick(r, Object.keys(COLOUR_PICS));
  return {
    about: 'colouring neatly inside the outline',
    say: `is coloured ${c}`,
    target: G(c, COLOUR_PICS[c]),
    item: p, colour: c,
    yes: [G(c, c)],
    no: sample(r, Object.keys(COLOUR_PICS).filter(x => x !== c), 3).map(x => G(x, x))
  };
};

/* --- feelings and people --- */

P.feeling = ({ skill, r }) => {
  const f = skill.target;
  const others = sample(r, Object.keys(FEELING_FACES).filter(x => x !== f), 6);
  return {
    about: `feeling ${f}`,
    say: `looks ${f}`,
    target: G(f, FEELING_FACES[f]),
    yes: [G(f, FEELING_FACES[f])],
    no: others.map(x => G(x, FEELING_FACES[x])),
    pairs: [{ a: G(f, FEELING_FACES[f]), b: G(f, f) },
            ...sample(r, others, 3).map(x => ({ a: G(x, FEELING_FACES[x]), b: G(x, x) }))]
  };
};

/* --- sorting --- */

P.sortBy = ({ skill, theme, themes, r }) => {
  const by = skill.target;
  if (by === 'color') {
    const [c1, c2] = sample(r, Object.keys(COLOUR_PICS), 2);
    return {
      about: 'sorting by colour', say: `is ${c1}`,
      target: G(c1, COLOUR_PICS[c1]),
      groups: [{ name: c1, items: [G(c1, COLOUR_PICS[c1])] }, { name: c2, items: [G(c2, COLOUR_PICS[c2])] }],
      yes: [G(c1, COLOUR_PICS[c1])], no: [G(c2, COLOUR_PICS[c2]),
        ...sample(r, Object.keys(COLOUR_PICS).filter(x => x !== c1), 3).map(x => G(x, COLOUR_PICS[x]))]
    };
  }
  if (by === 'shape') {
    const [s1, s2] = sample(r, Object.keys(SHAPE_SIDES), 2);
    return {
      about: 'sorting by shape', say: `is a ${s1}`,
      target: G(s1, s1), shape: s1,
      groups: [{ name: `${s1}s`, items: [G(s1, s1)] }, { name: `${s2}s`, items: [G(s2, s2)] }],
      yes: [G(s1, s1)], no: [G(s2, s2), ...sample(r, Object.keys(SHAPE_SIDES).filter(x => x !== s1), 3).map(x => G(x, x))]
    };
  }
  if (by === 'number of legs') {
    const two = [G('bird', '🐦'), G('hen', '🐔'), G('penguin', '🐧'), G('duck', '🦆')];
    const four = [G('cat', '🐱'), G('dog', '🐶'), G('cow', '🐄'), G('horse', '🐴')];
    return {
      about: 'sorting animals by how many legs', say: 'has two legs',
      target: G('two legs', '🐦'),
      groups: [{ name: 'two legs', items: two }, { name: 'four legs', items: four }],
      yes: two, no: four
    };
  }
  if (by === 'size') {
    const big = [G('elephant', '🐘'), G('whale', '🐋'), G('bus', '🚌'), G('house', '🏠')];
    const small = [G('ant', '🐜'), G('bee', '🐝'), G('mouse', '🐭'), G('button', '🔘')];
    return {
      about: 'sorting by size', say: 'is big',
      target: G('big', '🐘'),
      groups: [{ name: 'big', items: big }, { name: 'small', items: small }],
      yes: big, no: small
    };
  }
  /* by type: things from this theme against things from another */
  const mine = sample(r, props(theme), 4);
  const other = foreign(r, theme, themes, 4);
  return {
    about: `sorting ${theme.name.toLowerCase()} things from the rest`,
    say: `belongs at the ${theme.name.toLowerCase()}`,
    target: mine[0],
    groups: [{ name: theme.name, items: mine }, { name: 'somewhere else', items: other }],
    yes: mine, no: other
  };
};

P.oddOneOut = ({ theme, themes, r }) => {
  const mine = sample(r, props(theme), 3);
  const odd = foreign(r, theme, themes, 1)[0];
  return {
    about: 'the one that does not belong',
    say: 'does not belong',
    target: odd,
    set: mine, odd,
    yes: [G(odd.label, odd.label)],
    no: mine.map(x => G(x.label, x.label))
  };
};

P.sameDifferent = ({ theme, r }) => {
  const p = prop(r, theme);
  const other = pick(r, props(theme).filter(x => x.label !== p.label));
  return {
    about: 'same and different',
    say: 'is the same',
    target: p, item: p, other,
    set: [p, p, other],
    yes: [G(p.label, p.label)],
    no: [G(other.label, other.label), G('none of them', 'none of them'), G('all of them', 'all of them')],
    pairs: sample(r, props(theme), 4).map(x => ({ a: x, b: x }))
  };
};

P.whatsMissing = ({ theme, r }) => {
  const set = sample(r, props(theme), 4);
  const gone = set[set.length - 1];
  return {
    about: 'noticing what has gone',
    say: 'has gone',
    target: gone,
    set: set.slice(0, -1), gone,
    yes: [G(gone.label, gone.label)],
    no: set.slice(0, -1).map(x => G(x.label, x.label))
  };
};

P.spotDiff = ({ skill, theme, themes, r }) => {
  const n = skill.target;
  /* A spot-the-difference needs more pictures than differences, or there is
     nothing left to compare against. A five-prop theme cannot hold five
     changes on its own, so the scene is padded from the other themes. */
  const base = sample(r, [...props(theme), ...foreign(r, theme, themes, 4)], 8);
  const changed = sample(r, base, Math.min(n, Math.max(1, base.length - 3)));
  /* A five-prop theme has nothing spare once five props are on the page, so
     the replacements come from the other themes — which is fine, because a
     thing that does not belong is exactly what the child is hunting for. */
  const spare = props(theme).filter(x => !base.some(b => b.label === x.label));
  const pool = spare.length >= changed.length
    ? spare : [...spare, ...foreign(r, theme, themes, changed.length)];
  const swapped = sample(r, pool, changed.length);
  const after = base.map(x => {
    const i = changed.findIndex(c => c.label === x.label);
    return i >= 0 && swapped[i] ? swapped[i] : x;
  });
  return {
    about: `spotting ${n} changes`,
    say: 'changed',
    target: changed[0],
    sceneA: base, sceneB: after, n,
    yes: swapped.filter(Boolean).map(x => G(x.label, x.glyph)),
    no: base.filter(b => !changed.some(c => c.label === b.label)).map(x => G(x.label, x.glyph))
  };
};

/* --- fine motor --- */

const STROKE_PATHS = {
  arches: 'M4 26 Q12 6 20 26 Q28 6 36 26', 'castle (square) lines': 'M4 26 V10 H14 V26 H24 V10 H34 V26',
  circles: 'M12 18 a7 7 0 1 0 0.1 0 M30 18 a7 7 0 1 0 0.1 0', crosses: 'M6 8 L18 26 M18 8 L6 26 M24 8 L36 26 M36 8 L24 26',
  'curved lines': 'M4 22 Q14 4 24 22 Q34 30 38 16', 'diagonal lines': 'M4 26 L14 8 M18 26 L28 8 M32 26 L40 12',
  'horizontal lines': 'M4 10 H38 M4 18 H38 M4 26 H38', loops: 'M4 22 q6 -16 12 0 q6 16 12 0 q6 -16 12 0',
  spirals: 'M20 18 m0 0 a3 3 0 1 1 -3 3 a7 7 0 1 1 7 -7 a11 11 0 1 1 -11 11',
  'vertical lines': 'M8 6 V28 M18 6 V28 M28 6 V28 M38 6 V28',
  'wavy lines': 'M4 18 q5 -10 10 0 t10 0 t10 0 t8 0', 'zigzag lines': 'M4 26 L11 8 L18 26 L25 8 L32 26 L39 8'
};
export const CUT_PATHS = {
  corners: 'M4 6 H36 V18 H20 V30 H4 Z', 'curvy lines': 'M4 18 q8 -14 16 0 t16 0',
  'simple shapes': 'M20 4 L36 16 L30 30 H10 L4 16 Z', spirals: 'M20 18 a4 4 0 1 1 -4 4 a9 9 0 1 1 9 -9 a14 14 0 1 1 -14 14',
  'straight lines': 'M4 18 H36', 'zigzag lines': 'M4 26 L12 8 L20 26 L28 8 L36 26'
};

P.stroke = ({ skill }) => ({
  about: `the ${skill.target} stroke`,
  say: `is the ${skill.target} stroke`,
  target: G(skill.target, skill.target),
  path: STROKE_PATHS[skill.target], strokeName: skill.target,
  yes: [G(skill.target, skill.target)], no: []
});

P.cutting = ({ skill }) => ({
  about: `cutting along ${skill.target}`,
  say: `is cut along ${skill.target}`,
  target: G(skill.target, skill.target),
  path: CUT_PATHS[skill.target], cutName: skill.target,
  yes: [G(skill.target, skill.target)], no: []
});

P.pencilPaths = ({ theme, r }) => {
  const [from, to] = sample(r, props(theme), 2);
  return {
    about: 'keeping the pencil inside a narrow path',
    say: 'gets there without touching the sides',
    target: to, from, to,
    path: 'M4 18 q8 -12 16 0 t16 0',
    yes: [G(to.label, to.label)], no: []
  };
};

P.copyGrid = ({ theme, r }) => {
  const p = prop(r, theme);
  return { about: 'copying a picture square by square', say: 'matches the picture',
           target: p, item: p, yes: [p], no: sample(r, props(theme).filter(x => x.label !== p.label), 3) };
};

P.tearGlue = ({ theme, r }) => {
  const p = prop(r, theme);
  const c = pick(r, Object.keys(COLOUR_PICS));
  return { about: 'tearing paper and gluing it inside a shape', say: `fills the ${p.label}`,
           target: p, item: p, colour: c, yes: [p], no: sample(r, props(theme).filter(x => x.label !== p.label), 3) };
};

P.dotToDot = ({ skill, r }) => {
  const kind = skill.target;
  const run = kind === 'a-z'
    ? ALPHABET.slice(0, 10)
    : Array.from({ length: kind === '1-10' ? 10 : 20 }, (_, i) => String(i + 1));
  return {
    about: kind === 'a-z' ? 'joining the letters A to Z' : `joining the numbers ${run[0]} to ${run[run.length - 1]}`,
    say: 'comes next',
    target: G(run[1], run[1]),
    dots: run, steps: run.slice(0, 5).map(x => G(x, x)),
    yes: [G(run[1], run[1])],
    no: sample(r, run.slice(2), 3).map(x => G(x, x))
  };
};

P.alphaOrder = ({ r }) => {
  const start = int(r, 0, 20);
  const run = ALPHABET.slice(start, start + 5);
  return {
    about: 'putting letters in ABC order',
    say: 'comes next in the alphabet',
    target: G(run[4], run[4]),
    dots: run, run, steps: run.map(x => G(x, x)),
    yes: [G(run[4], run[4])],
    no: sample(r, ALPHABET.filter(L => !run.includes(L)), 3).map(L => G(L, L))
  };
};

P.simpleMaze = ({ theme, r }) => {
  const [from, to] = sample(r, props(theme), 2);
  return { about: 'finding the way through', say: 'is at the end of the path',
           target: to, from, to, yes: [G(to.label, to.label)],
           no: sample(r, props(theme).filter(x => x.label !== to.label), 3).map(x => G(x.label, x.label)) };
};

/* --- the banked skills --- */

P.sequence = ({ skill, r }) => {
  const b = skill.target;
  const steps = b.steps.map(([label, glyph]) => G(label, glyph));
  const i = int(r, 0, steps.length - 1);
  return {
    about: b.name.toLowerCase(),
    say: i === steps.length - 1 ? 'comes last' : `comes after ${steps[Math.max(0, i - 1)].label}`,
    target: steps[i],
    steps, at: i,
    yes: [G(steps[i].label, steps[i].label)],
    no: steps.filter((_, j) => j !== i).map(s => G(s.label, s.label)),
    pairs: steps.slice(0, 4).map((s, j) => ({ a: s, b: G(`step ${j + 1}`, String(j + 1)) })),
    dots: steps.map((_, j) => String(j + 1))
  };
};

P.binarySort = ({ skill, r }) => {
  const b = skill.target;
  const [[n1, i1], [n2, i2]] = b.groups;
  const yes = i1.map(([l, g]) => G(l, g)), no = i2.map(([l, g]) => G(l, g));
  const flip = r() < 0.5;
  return {
    about: b.name.toLowerCase(),
    say: flip ? `is ${n2}` : `is ${n1}`,
    target: flip ? no[0] : yes[0],
    yes: flip ? no : yes, no: flip ? yes : no,
    groups: [{ name: n1, items: yes }, { name: n2, items: no }],
    steps: [...yes.slice(0, 2), ...no.slice(0, 2)],
    pairs: [...yes.slice(0, 2).map(x => ({ a: x, b: G(n1, n1) })),
            ...no.slice(0, 2).map(x => ({ a: x, b: G(n2, n2) }))],
    dots: yes.map((_, j) => String(j + 1))
  };
};

P.pairs = ({ skill, r }) => {
  const b = skill.target;
  const all = b.items.map(([a, c]) => ({ a: G(a[0], a[1]), b: G(c[0], c[1]) }));
  const four = sample(r, all, Math.min(4, all.length));
  const one = four[0];
  return {
    about: b.name.toLowerCase(),
    say: `goes with ${one.a.label}`,
    target: one.b,
    pairs: four, one,
    yes: [one.b],
    no: four.slice(1).map(p => p.b),
    steps: four.map(p => p.a),
    groups: four.slice(0, 2).map(p => ({ name: p.b.label, items: [p.a] })),
    graphRows: four.map((p, i) => ({ label: p.a.label, glyph: p.a.glyph, n: i + 2 })),
    item: one.a, count: 3,
    dots: four.map((_, j) => String(j + 1))
  };
};

P.pickSet = ({ skill, theme, themes, r }) => {
  const b = skill.target;
  const yes = b.items.map(([l, g]) => G(l, g));
  const no = foreign(r, theme, themes, 4);
  const one = pick(r, yes);
  return {
    about: b.name.toLowerCase(),
    say: `is ${b.noun ? `a ${b.noun}` : 'part of it'}`,
    target: one, noun: b.noun,
    yes, no,
    groups: [{ name: b.noun ?? b.name, items: yes }, { name: 'something else', items: no }],
    pairs: sample(r, yes, Math.min(4, yes.length)).map(x => ({ a: x, b: G(x.label, x.label) })),
    steps: sample(r, yes, Math.min(4, yes.length)),
    graphRows: sample(r, yes, Math.min(3, yes.length)).map((x, i) => ({ label: x.label, glyph: x.glyph, n: i + 2 })),
    item: one, count: 4, trace: one.label,
    shown: yes.slice(0, 3), next: yes[0], code: 'AB',
    dots: yes.map((_, j) => String(j + 1))
  };
};

P.opposites = ({ skill, r }) => {
  const b = skill.target;
  const a = G(b.a[0], b.a[1]), z = G(b.b[0], b.b[1]);
  const first = r() < 0.5 ? a : z;
  const second = first === a ? z : a;
  return {
    about: `${a.label} and ${z.label}`,
    say: `is the opposite of ${first.label}`,
    target: second,
    yes: [second],
    no: [first, G('the same', '🟰'), G('neither', '❔')],
    pairs: [{ a, b: z }],
    item: first, other: second,
    groups: [{ name: a.label, items: [a] }, { name: z.label, items: [z] }]
  };
};

export const PK_CONTENT = P;

/* A letter is a letter at the zoo and at the bakery, so a letter skill looks
   untouched by the theme — and a library that multiplies it out by sixty-two
   themes anyway is padding.

   The catalogue does not do that. It says: "children use a dot marker to dab
   every guitars that shows the right answer". The letter is printed ON a
   theme picture, and the theme is what the child sees first. So a skill whose
   content is a bare symbol picks up a carrier from the theme, and the symbol
   rides on it. The sheet is then genuinely themed, the instruction names what
   the child is looking at, and the variety is real rather than claimed. */
const isSymbol = item =>
  Boolean(item) && item.glyph === item.label && /^[\p{L}\p{N}'"-]{1,6}$/u.test(String(item.glyph));

/* "lions" is the prop's name; a single one of them is a lion. Only the plural
   -s is worth undoing — the prop lists are written in the plural and nothing
   in them is irregular. */
const oneOf = name => (/[^s]s$/.test(name) ? name.slice(0, -1) : name);

/** The content for one question, or null when a skill kind has no provider. */
export function contentFor(skill, theme, themes, r) {
  const make = P[skill.kind];
  if (!make) return null;
  const c = make({ skill, theme, themes, r });
  if (!c) return null;
  c.theme = theme;
  if (isSymbol(c.target)) {
    /* One carrier when the question has one right answer — "which guitar shows
       the letter B?" is the catalogue's own phrasing and it reads well. A
       spread of them when the question has several, because three options that
       are all "🎸B" are one option as far as the page is concerned, and a
       "circle every one" with a single right answer is not what it says. */
    const carriers = sample(r, props(theme), 5);
    c.carrier = carriers[0].glyph;
    c.carrierName = oneOf(carriers[0].label);
    c.carriers = carriers.map(x => x.glyph);
  }
  return c;
}
