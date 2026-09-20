/* The language drills, checked twice over.

   Regular forms are the checkable half. The generator builds them as stem plus
   ending; this file derives them again from the same published tables without
   looking at the generator, reads the verb and the person back out of the
   printed question, and compares. Every regular present-tense form in the
   file goes through that, which is a real second opinion rather than a
   restatement.

   Irregular forms cannot be derived — that is what makes them irregular — so
   they are held to what a table can promise: six persons, nothing blank, an
   infinitive that ends the way the language's infinitives end. The nouns,
   numbers, days, months and phrases are checked the same way: each row
   against the rule its own column claims.

     node tools/check-lang.mjs
*/

import * as L from '../assets/js/data/gen-drill-lang.js';
import { rng } from '../assets/js/data/gen-core.js';

const problems = [];
let checks = 0;
const check = (ok, where, why) => { checks++; if (!ok) problems.push(`${where}: ${why}`); };

/** Derived here, from the published tables, with no help from the generator. */
function derive(cfg, infinitive, person) {
  for (const [group, endings] of Object.entries(cfg.groups)) {
    if (infinitive.endsWith(group)) return infinitive.slice(0, -group.length) + endings[person];
  }
  return null;
}

for (const cfg of L.LANGUAGES) {
  const where = cfg.name;

  check(cfg.persons.length === 6, where, 'a present tense needs six persons');
  for (const [group, endings] of Object.entries(cfg.groups))
    check(endings.length === 6, where, `-${group} has ${endings.length} endings`);

  const infinitives = new Set();
  for (const [group, list] of Object.entries(cfg.regular)) {
    for (const [inf, en] of list) {
      check(inf.endsWith(group), where, `“${inf}” is filed under -${group}`);
      check(/^to /.test(en), where, `“${inf}” is glossed “${en}”, not as an infinitive`);
      check(!infinitives.has(inf), where, `“${inf}” is listed twice`);
      infinitives.add(inf);
    }
  }

  const endings = Object.keys(cfg.groups);
  for (const [inf, forms] of Object.entries(cfg.irregular)) {
    check(forms.length === 6, where, `irregular “${inf}” has ${forms.length} forms`);
    check(forms.every(f => f && f.trim()), where, `irregular “${inf}” has a blank form`);
    /* German infinitives end in -en or, for a handful, plain -n: sein, tun. */
    check(endings.some(e => inf.endsWith(e)) || (cfg.id === 'german' && inf.endsWith('n')),
      where, `“${inf}” does not end like an infinitive`);
    /* Irregular means at least one person breaks the pattern, not every one:
       German haben is regular in the first person and irregular in the second,
       and French faire looks regular until nous. */
    const pattern = cfg.persons.map((_, p) => derive(cfg, inf, p));
    check(pattern.some(f => f === null) || pattern.some((f, p) => f !== forms[p]), where,
      `“${inf}” is listed as irregular but every form follows the pattern`);
  }

  const seenNouns = new Set();
  for (const [noun, g, en, plural] of cfg.nouns) {
    check(['m', 'f', 'n'].includes(g), where, `“${noun}” has gender “${g}”`);
    check(!!en && !!plural, where, `“${noun}” is missing a gloss or a plural`);
    check(!seenNouns.has(noun), where, `“${noun}” is listed twice`);
    seenNouns.add(noun);
    check(cfg.articles.definite[g] !== undefined, where, `no definite article for ${g}`);
    check(cfg.articles.indefinite[g] !== undefined, where, `no indefinite article for ${g}`);
    /* Vowel-initial nouns are left out on purpose in the languages that elide
       their article; a row that slips back in would print "le arbre". */
    if (['french', 'italian'].includes(cfg.id))
      check(!/^[aeiouéèà]/i.test(noun), where, `“${noun}” starts with a vowel and needs an elided article`);
  }

  const words = Object.values(cfg.numbers);
  check(new Set(words).size === words.length, where, 'two numbers share a word');
  for (let n = 1; n <= 20; n++) check(cfg.numbers[n], where, `no word for ${n}`);
  for (const t of [30, 40, 50, 60, 70, 80, 90, 100]) check(cfg.numbers[t], where, `no word for ${t}`);

  check(cfg.days.length === 7, where, `${cfg.days.length} days in the week`);
  check(cfg.months.length === 12, where, `${cfg.months.length} months in the year`);
  check(new Set(cfg.days.map(d => d[0])).size === 7, where, 'two days share a name');
  check(new Set(cfg.months.map(mo => mo[0])).size === 12, where, 'two months share a name');
  const ENGLISH_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  cfg.days.forEach(([, en], i) => check(en === ENGLISH_DAYS[i], where, `day ${i + 1} is glossed ${en}`));

  check(new Set(cfg.phrases.map(p => p[0])).size === cfg.phrases.length, where, 'a phrase is listed twice');
  for (const [phrase, en] of cfg.phrases) check(!!phrase && !!en, where, `blank phrase row`);

  if (cfg.adjectives) {
    for (const [adj, en] of cfg.adjectives) {
      check(!!en, where, `“${adj}” has no gloss`);
      if (cfg.id === 'spanish') check(adj.endsWith('o'), where, `“${adj}” is filed as changing for gender`);
    }
    for (const [adj] of cfg.neutral)
      check(!/o$/.test(adj) || cfg.id !== 'spanish', where, `“${adj}” would change for gender`);
  }
}

/* ------------------- the questions, and the forms in them ------------------- */

const SEEDS = 300;
let built = 0, derived = 0;
const shapes = new Set();

for (const [topic, makers] of Object.entries(L.LANG_DRILL_GENERATORS)) {
  const cfg = L.LANGUAGES.find(c => topic.startsWith(c.id));
  makers.forEach((maker, i) => {
    for (let s = 0; s < SEEDS; s++) {
      const q = maker(rng(s * 7919 + i * 104729 + topic.length));
      if (!q) continue;                       // a maker may decline a language
      built++;
      shapes.add(q.prompt.replace(/“[^”]*”/g, '“…”').replace(/\d+/g, '#'));
      const at = `${topic}[${i}] seed ${s}`;
      if (!q.hint) problems.push(`${at}: no hint`);
      if (!q.explanation) problems.push(`${at}: no explanation`);
      if (/undefined|NaN|\[object/.test(`${q.prompt} ${q.answer} ${q.hint} ${q.explanation}`))
        problems.push(`${at}: ${q.prompt}`.slice(0, 100));
      if (q.type === 'choice') {
        const opts = q.options ?? [];
        if (opts.length < 2) problems.push(`${at}: fewer than two options`);
        if (new Set(opts).size !== opts.length) problems.push(`${at}: a repeated option`);
        if (q.answer == null || !opts[q.answer]) problems.push(`${at}: the answer is not an option`);
      } else if (!String(q.answer ?? '').trim()) {
        problems.push(`${at}: blank answer`);
      }

      /* Re-derive the regular present tense from the printed question. */
      const m = q.prompt.match(/present tense of “([^”]+)”[^)]*\) for (.+)\.$/);
      if (m && cfg) {
        const person = cfg.persons.indexOf(m[2]);
        const want = person >= 0 ? derive(cfg, m[1], person) : null;
        if (want !== null) {
          derived++;
          if (want !== q.answer) problems.push(`${at}: ${m[1]} for ${m[2]} is ${want}, key says ${q.answer}`);
        }
      }
      const full = q.prompt.match(/full present tense of “([^”]+)”/);
      if (full && cfg && !cfg.irregular[full[1]]) {
        const want = cfg.persons.map((_, p) => derive(cfg, full[1], p));
        if (want.every(Boolean)) {
          derived++;
          if (want.join(', ') !== q.answer)
            problems.push(`${at}: ${full[1]} conjugates to ${want.join(', ')}, key says ${q.answer}`);
        }
      }
    }
  });
}

const topics = Object.keys(L.LANG_DRILL_GENERATORS).length;
const makers = Object.values(L.LANG_DRILL_GENERATORS).reduce((n, a) => n + a.length, 0);
console.log(`Language drills: ${L.LANGUAGES.length} languages, ${topics} topics, ${makers} makers, ${shapes.size} question shapes`);
console.log(`bank rows checked against their own rule: ${checks}`);
console.log(`questions built: ${built}, of which ${derived} had their form derived again independently`);
if (problems.length) {
  console.error(`\n${problems.length} problem${problems.length === 1 ? '' : 's'}:`);
  for (const p of problems.slice(0, 40)) console.error('  ' + p);
  process.exit(1);
}
console.log('every conjugation agrees with the endings it was built from.');
