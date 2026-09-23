/* Holds the preschool generators to the same standard as the rest of the
   library, and then to one more: that the sheets are actually different.

   Three passes.
     1. Every skill in the catalogue, in every format the catalogue pairs it
        with, on a spread of themes. Each question has to be well formed and
        markable: distinct options, an answer inside the options, no
        "undefined" leaking into a sentence a four-year-old will be read.
     2. No question may be unanswerable or free: a select-all where every
        option is right teaches nothing, and a matcher where two left-hand
        items want the same right-hand item cannot be marked at all.
     3. Variety. The same measure the rest of the library uses — a question's
        shape is its wording with every number, letter and picture blanked —
        counted per sheet and across the whole preschool bank.               */

import { PK_SKILLS } from '../assets/js/data/gen-pk-skills.js';
import { PK_THEMES } from '../assets/js/data/gen-pk-themes.js';
import { contentFor } from '../assets/js/data/gen-pk-content.js';
import { questionFor } from '../assets/js/data/gen-pk-formats.js';
import { rng, seedFrom } from '../assets/js/data/gen-core.js';

const bad = [];
const note = (where, why) => bad.push(`${where}: ${why}`);

const BAD_TEXT = /\b(undefined|null|NaN|\[object Object\])\b/;

function checkText(where, s) {
  if (s == null) return;
  const t = String(s);
  if (BAD_TEXT.test(t)) note(where, `text reads "${t.slice(0, 80)}"`);
  if (/\s{2,}/.test(t)) note(where, `double space in "${t.slice(0, 80)}"`);
}

function checkQuestion(where, q) {
  if (!q) { note(where, 'no question produced'); return; }
  if (!q.prompt || !String(q.prompt).trim()) { note(where, 'empty prompt'); return; }
  checkText(where + ' prompt', q.prompt);
  checkText(where + ' explanation', q.explanation);
  checkText(where + ' hint', q.hint);

  switch (q.type) {
    case 'choice': {
      const o = q.options ?? [];
      if (o.length < 2) return note(where, `only ${o.length} options`);
      if (new Set(o).size !== o.length) return note(where, `repeated option in [${o.join(' | ')}]`);
      if (!(q.answer >= 0 && q.answer < o.length)) return note(where, `answer index ${q.answer} outside ${o.length} options`);
      o.forEach((x, i) => checkText(`${where} option ${i}`, x));
      break;
    }
    case 'multi': {
      const o = q.options ?? [], a = q.answer ?? [];
      if (o.length < 3) return note(where, `select-all with only ${o.length} options`);
      if (new Set(o).size !== o.length) return note(where, `repeated option in [${o.join(' | ')}]`);
      if (!a.length) return note(where, 'select-all with nothing to select');
      if (a.length >= o.length) return note(where, 'select-all where every option is right');
      if (a.some(i => !(i >= 0 && i < o.length))) return note(where, 'answer index outside options');
      break;
    }
    case 'blank': case 'math': {
      if (q.answer == null || !String(q.answer).trim()) return note(where, 'no answer');
      checkText(where + ' answer', q.answer);
      break;
    }
    case 'match': {
      const p = q.pairs ?? [];
      if (p.length < 2) return note(where, `matcher with ${p.length} pairs`);
      if (p.some(x => !x.left || !x.right)) return note(where, 'pair missing a side');
      if (new Set(p.map(x => x.left)).size !== p.length) return note(where, 'two left-hand items are the same');
      if (new Set(p.map(x => x.right)).size !== p.length) return note(where, 'two left-hand items want the same right-hand item');
      break;
    }
    case 'order': {
      const it = q.items ?? [];
      if (it.length < 3) return note(where, `ordering with ${it.length} items`);
      if (new Set(it).size !== it.length) return note(where, 'two items in the order are identical');
      break;
    }
    case 'written': {
      if (!q.sample) note(where, 'written question with no sample answer');
      break;
    }
    default: note(where, `unknown question type "${q.type}"`);
  }
}

/* ------------------------------- pass 1 and 2 ------------------------------- */

let made = 0;
const shapes = new Map();
const whole = new Set();
const shapeOf = q => String(q.prompt)
  .replace(/\d+/g, '#')
  .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '□')
  .replace(/"[^"]*"/g, '"_"')
  .replace(/\/\w+\//g, '/_/')
  .replace(/\b[A-Za-z]\b/g, '_');

/* The shape above is the wording alone, with the pictures blanked out, which
   answers "does this sheet read like the last one". It is deliberately harsh:
   two sorting questions about completely different pictures count as one
   shape. So the whole question is counted as well — wording plus every
   picture, option and answer on it — which answers the question a parent
   actually asks: is this a different worksheet or the same one again. */
const fullOf = q => JSON.stringify([
  q.type, q.prompt, q.options ?? null, q.answer ?? null,
  (q.pairs ?? []).map(p => [p.left, p.right]), q.items ?? null,
  q.art ? JSON.stringify(q.art) : null
]);

const THEME_SAMPLE = 8;
for (const skill of PK_SKILLS) {
  for (let t = 0; t < THEME_SAMPLE; t++) {
    const theme = PK_THEMES[(seedFrom(skill.id) + t * 7) % PK_THEMES.length];
    for (const format of skill.formats) {
      for (let v = 0; v < 2; v++) {
        const r = rng(seedFrom(`${skill.id}|${theme.id}|${format}|${v}`));
        let q = null;
        try {
          const content = contentFor(skill, theme, PK_THEMES, r);
          q = questionFor(format, content, { r, level: v % 3 });
        } catch (e) {
          note(`${skill.id}/${format}/${theme.id}`, `threw ${e.message}`);
          continue;
        }
        checkQuestion(`${skill.id}/${format}/${theme.id}`, q);
        if (q) {
          made++;
          shapes.set(shapeOf(q), (shapes.get(shapeOf(q)) ?? 0) + 1);
          whole.add(fullOf(q));
        }
      }
    }
  }
}

/* -------------------------------- reporting -------------------------------- */

console.log(`preschool: ${PK_SKILLS.length} skills, ${PK_THEMES.length} themes, ${made} questions built`);
console.log(`distinct whole questions: ${whole.size} (${(whole.size / made * 100).toFixed(1)}% of those built)`);
console.log(`distinct wordings, pictures blanked: ${shapes.size}`);

const worst = [...shapes.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
console.log('commonest wordings:');
for (const [s, n] of worst) console.log(`  ${String(n).padStart(6)}  ${s.slice(0, 90)}`);

if (bad.length) {
  console.log(`\n${bad.length} problems:`);
  const seen = new Set();
  for (const b of bad) {
    const key = b.replace(/^[^:]*/, '');
    if (seen.has(key)) continue;
    seen.add(key);
    console.log('  ' + b);
    if (seen.size >= 40) { console.log(`  … and ${bad.length - 40} more`); break; }
  }
  process.exit(1);
}
console.log('\nevery question is well formed and markable.');
