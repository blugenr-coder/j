/* The word drills have no arithmetic to re-do, so this checks the banks.

   A maths key can be wrong by a slip in a formula; a spelling key is wrong
   because someone typed the row wrong. Every bank in gen-drill-english.js is
   authored data, and every row makes a promise the row itself can be held to:
   a contraction contains an apostrophe and drops only letters it had, a
   prefix example starts with its prefix, a plural marked "no change" is the
   same word twice, an end mark matches the sentence type it is filed under.

   Then it builds every question the file can make and checks the structure a
   reader depends on: the options are distinct, the answer is one of them, and
   nothing is empty.

     node tools/check-words.mjs
*/

import * as EN from '../assets/js/data/gen-drill-english.js';
import { rng } from '../assets/js/data/gen-core.js';

const problems = [];
const fail = (where, why) => problems.push(`${where}: ${why}`);
let checks = 0;
const check = (ok, where, why) => { checks++; if (!ok) fail(where, why); };

/* ------------------------------ the banks ------------------------------ */

for (const [text, mark] of EN.END_MARKS) {
  check('.?!'.includes(mark), 'END_MARKS', `“${text}” is filed under “${mark}”`);
  check(!/[.?!]$/.test(text), 'END_MARKS', `“${text}” already ends with a mark`);
}

for (const [mark, name] of EN.MARK_NAMES)
  check(mark.length <= 1 && name.length > 2, 'MARK_NAMES', `${mark} / ${name}`);

for (const [full, short] of EN.CONTRACTIONS) {
  check(short.includes("'"), 'CONTRACTIONS', `“${short}” has no apostrophe`);
  /* The short form's letters must appear in the full form, in order: that is
     what a contraction is, and a typo breaks it. */
  /* "will not" → "won't" is not a subsequence of its own full form; it never
     was. English has two of these and they are named rather than derived. */
  if (!["won't"].includes(short)) {
    const a = full.replace(/\s/g, '').toLowerCase();
    let j = 0;
    for (const ch of short.replace(/'/g, '').toLowerCase()) { j = a.indexOf(ch, j) + 1; if (j === 0) break; }
    check(j > 0, 'CONTRACTIONS', `“${short}” is not a contraction of “${full}”`);
  }
}

for (const [owner, thing, correct] of EN.POSSESSIVES) {
  check(correct.includes("'"), 'POSSESSIVES', `“${correct}” has no apostrophe`);
  check(correct.endsWith(thing), 'POSSESSIVES', `“${correct}” does not end with “${thing}”`);
  check(correct.startsWith(owner.split(' ')[0]) || correct.startsWith(owner),
    'POSSESSIVES', `“${correct}” does not start from “${owner}”`);
}

for (const [gap, right, wrong] of EN.HOMOPHONES) {
  check(gap.includes('___'), 'HOMOPHONES', `“${gap}” has no gap`);
  check(!wrong.includes(right), 'HOMOPHONES', `“${right}” is also listed as wrong`);
  check(new Set(wrong).size === wrong.length, 'HOMOPHONES', `duplicate wrong answers for “${right}”`);
}

for (const [p, meaning, example] of EN.PREFIXES) {
  check(example.startsWith(p), 'PREFIXES', `“${example}” does not start with “${p}”`);
  check(meaning.length > 2, 'PREFIXES', `“${p}” has no meaning`);
}
for (const [suf, meaning, example] of EN.SUFFIXES) {
  check(example.endsWith(suf), 'SUFFIXES', `“${example}” does not end with “${suf}”`);
  check(meaning.length > 2, 'SUFFIXES', `“${suf}” has no meaning`);
}
for (const [word, opposite] of EN.OPPOSITES)
  check(opposite.endsWith(word), 'OPPOSITES', `“${opposite}” is not “${word}” with a prefix`);

for (const [base, past, part] of EN.IRREGULAR) {
  check(base && past && part, 'IRREGULAR', `${base} is missing a form`);
  check(!past.endsWith('ed') || base.endsWith('e'), 'IRREGULAR', `“${past}” looks regular`);
}

const RULES = new Set(EN.PLURALS.map(p => p[2]));
for (const [one, many, rule] of EN.PLURALS) {
  check(RULES.has(rule), 'PLURALS', `${one} has an unknown rule`);
  if (rule === 'no change') check(one === many, 'PLURALS', `${one} → ${many} is not "no change"`);
  else check(one !== many, 'PLURALS', `${one} → ${many} changes nothing but claims “${rule}”`);
  if (rule.includes('y to ies')) check(many.endsWith('ies'), 'PLURALS', `${many} does not end in ies`);
  if (rule.includes('ves')) check(many.endsWith('ves'), 'PLURALS', `${many} does not end in ves`);
  if (rule === 'add -s') check(many === `${one}s`, 'PLURALS', `${one} → ${many} is not just -s`);
}

for (const [text, type] of EN.SENTENCE_TYPES) {
  const mark = type === 'question' ? '?' : type === 'exclamation' ? '!' : '.';
  check(text.endsWith(mark), 'SENTENCE_TYPES', `“${text}” is filed as a ${type}`);
}
for (const [, structure] of EN.STRUCTURES)
  check(['simple', 'compound', 'complex'].includes(structure), 'STRUCTURES', structure);

for (const [a, b] of [...EN.SYNONYMS, ...EN.ANTONYMS])
  check(a !== b && a && b, 'SYNONYMS/ANTONYMS', `${a} / ${b}`);

const DEVICE_NAMES = new Set(EN.DEVICE_DEFS.map(d => d[0]));
for (const [example, device] of EN.DEVICES) {
  check(DEVICE_NAMES.has(device), 'DEVICES', `“${example}” is filed as ${device}`);
  if (device === 'simile') check(/\b(as|like)\b/.test(example), 'DEVICES', `“${example}” has no as or like`);
  if (device === 'alliteration') {
    const initials = example.replace(/[^a-z ]/gi, '').split(' ').filter(w => w.length > 2).map(w => w[0]);
    const top = Math.max(...initials.map(i => initials.filter(x => x === i).length));
    check(top >= 3, 'DEVICES', `“${example}” does not alliterate`);
  }
}

for (const [word, rule] of EN.IE_EI) {
  check(/ie|ei/.test(word), 'IE_EI', `“${word}” has neither ie nor ei`);
  if (rule.startsWith('e before i')) check(/cei/.test(word), 'IE_EI', `“${word}” is not an -cei- word`);
  else check(/ie/.test(word), 'IE_EI', `“${word}” is not an -ie- word`);
}
for (const [base, ing] of EN.DROP_E) {
  check(base.endsWith('e'), 'DROP_E', `“${base}” does not end in e`);
  check(ing === `${base.slice(0, -1)}ing`, 'DROP_E', `${base} → ${ing}`);
}
for (const [base, ing] of EN.DOUBLE)
  check(ing === `${base}${base.slice(-1)}ing`, 'DOUBLE', `${base} → ${ing}`);
for (const [base, more] of EN.Y_TO_I) {
  check(base.endsWith('y'), 'Y_TO_I', `“${base}” does not end in y`);
  check(more === `${base.slice(0, -1)}ier`, 'Y_TO_I', `${base} → ${more}`);
}
for (const [right, wrong] of EN.MISSPELT)
  check(right !== wrong && right.length > 3, 'MISSPELT', `${right} / ${wrong}`);

/* --------------------------- the questions --------------------------- */

const SEEDS = 300;
let built = 0;
const shapes = new Set();

for (const [topic, makers] of Object.entries(EN.ENGLISH_DRILL_GENERATORS)) {
  makers.forEach((maker, i) => {
    for (let s = 0; s < SEEDS; s++) {
      const q = maker(rng(s * 7919 + i * 104729 + topic.length));
      const where = `${topic}[${i}] seed ${s}`;
      built++;
      shapes.add(q.prompt.replace(/“[^”]*”/g, '“…”').replace(/\d+/g, '#'));
      if (!q.prompt) { fail(where, 'no prompt'); continue; }
      if (!q.hint) fail(where, 'no hint');
      if (!q.explanation) fail(where, 'no explanation');
      if (/undefined|NaN|\[object/.test(`${q.prompt} ${q.answer} ${q.hint} ${q.explanation}`))
        fail(where, `${q.prompt}`.slice(0, 80));
      if (q.type === 'choice') {
        const opts = q.options ?? [];
        if (opts.length < 2) fail(where, 'fewer than two options');
        if (new Set(opts).size !== opts.length) fail(where, `repeated option: ${opts.join(' | ')}`);
        if (opts.some(o => !String(o).trim())) fail(where, 'an option is blank');
        if (q.answer == null || !opts[q.answer]) fail(where, 'the answer is not one of the options');
      } else if (!String(q.answer ?? '').trim()) {
        fail(where, 'blank answer');
      }
    }
  });
}

const topics = Object.keys(EN.ENGLISH_DRILL_GENERATORS).length;
const makers = Object.values(EN.ENGLISH_DRILL_GENERATORS).reduce((n, a) => n + a.length, 0);
console.log(`English drills: ${topics} topics, ${makers} makers, ${shapes.size} question shapes`);
console.log(`bank rows checked against their own rule: ${checks}`);
console.log(`questions built and checked for structure: ${built}`);
if (problems.length) {
  console.error(`\n${problems.length} problem${problems.length === 1 ? '' : 's'}:`);
  for (const p of problems.slice(0, 40)) console.error('  ' + p);
  process.exit(1);
}
console.log('every bank row keeps its own promise, and every question is well formed.');
