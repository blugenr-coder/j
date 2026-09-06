/* Every question offers a hint, and no hint gives the answer away.

   This exists because the Show hint button was greyed out on most of the
   library. The mechanism was fine — the player reads `q.hint` and toasts it —
   but only 23% of questions carried one, and on a generated worksheet it was
   nearer zero. A button that is present and disabled reads as broken, not as
   "this question has no hint".

   So the first assertion is coverage: every question, every type. The second
   matters more. A hint that contains its own answer is worse than no hint,
   because it turns a practice question into a reading exercise and nobody
   finds out until the marks do.

     node tools/check-hints.mjs
*/

globalThis.localStorage = { getItem: () => null, setItem() {} };

const { FAMILIES, AUTHORED, getExercise } = await import('../assets/js/data/exercises.js');

const SAMPLE = 500;
const step = Math.max(1, Math.floor(FAMILIES.length / SAMPLE));
const ids = [];
for (let i = 0; i < FAMILIES.length; i += step) ids.push(FAMILIES[i].at(0).id);
for (const a of AUTHORED) ids.push(a.id);

let seen = 0, missing = 0, leaked = 0;
const byType = new Map();
const examples = { missing: [], leaked: [] };

/* Case- and punctuation-insensitive, because "the Nucleus." and "nucleus" are
   the same giveaway. Matching is on whole words and only for answers of four
   characters or more: "the", "of" and "1" turn up inside ordinary English and
   flagging them buries the real leaks in noise. */
const norm = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
/* A unit whose content is common English — Sight Words is the clearest case —
   has answers like "each", "from" and "this". No hint written in English can
   avoid them, so flagging those buries the real leaks in noise. */
const ORDINARY = new Set(('about after again also away back because been before both came'
  + ' come could does down each every first found from give going have here into just know'
  + ' like little made make many more most much must never only other over said same some'
  + ' take than that them then there these they thing think this those took very want well'
  + ' went were what when where which while will with word work would your unit each one').split(' '));

const gives = (hint, answer) => {
  const a = norm(answer);
  if (a.length < 4 || ORDINARY.has(a)) return false;
  return new RegExp(`(^| )${a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}( |$)`).test(norm(hint));
};

function leaks(q) {
  const hint = norm(q.hint);
  if (!hint) return false;
  if (q.type === 'blank' || q.type === 'math') return gives(q.hint, q.answer);
  if (q.type === 'choice') return gives(q.hint, (q.options ?? [])[q.answer]);
  if (q.type === 'multi') {
    return (q.answer ?? []).some(i => gives(q.hint, (q.options ?? [])[i]));
  }
  if (q.type === 'match') {
    /* A matching hint names one pair on purpose — that is what "start with the
       one you know" means. What it must not do is hand over a partner whole
       when a first letter would have pointed at it. */
    return (q.pairs ?? []).some(p => {
      const right = String(p.right).trim();
      if (right.split(/\s+/).length > 2) return false;
      return gives(q.hint, right);
    });
  }
  return false;
}

for (const id of ids) {
  const ex = getExercise(id);
  if (!ex?.questions) continue;
  for (const q of ex.questions) {
    seen++;
    const rec = byType.get(q.type) ?? byType.set(q.type, { n: 0, h: 0 }).get(q.type);
    rec.n++;
    if (!q.hint || !String(q.hint).trim()) {
      missing++;
      if (examples.missing.length < 5) examples.missing.push(`${q.type}: ${q.prompt}`);
      continue;
    }
    rec.h++;
    if (leaks(q)) {
      leaked++;
      if (examples.leaked.length < 5) examples.leaked.push(`${q.type}: ${q.hint}`);
    }
  }
}

for (const [type, r] of [...byType.entries()].sort((a, b) => b[1].n - a[1].n)) {
  console.log(`  ${type.padEnd(9)} ${String(r.h).padStart(5)}/${String(r.n).padStart(5)}`);
}
console.log(`\n${seen} questions, ${missing} without a hint, ${leaked} whose hint contains its own answer.`);
for (const e of examples.missing) console.log(`  no hint  ${e}`);
for (const e of examples.leaked) console.log(`  leaks    ${e}`);

process.exit(missing || leaked ? 1 : 0);
