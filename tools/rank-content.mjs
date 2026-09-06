/* Which strings are worth translating first.

   A content pack holds every string in a subject, alphabetically, and there
   is no reason to think the first one matters more than the last. On screen
   they are not equal at all: the commonest few hundred terms account for a
   fifth of every answer option a reader sees, and the long tail of five
   thousand accounts for the last tenth. Translating alphabetically spends the
   same effort for a fraction of the result.

   So this counts how often each string is actually rendered — across a sample
   of the whole library, in the formats a reader gets — and prints what is
   still in English, commonest first.

     node tools/rank-content.mjs            # every subject, by weight
     node tools/rank-content.mjs es science 300

   The counts are from a sample, so treat them as an ordering rather than as
   a measurement of how many times a word appears in the library.
*/

globalThis.document = {
  documentElement: { lang: '', dataset: {} },
  createTreeWalker: () => ({ nextNode: () => null }),
  body: null
};
globalThis.MutationObserver = class { observe() {} disconnect() {} };
globalThis.localStorage = { getItem: () => null, setItem() {} };

const { setLanguage, loadContent, t } = await import('../assets/js/core/i18n.js');
const { FAMILIES, getExercise } = await import('../assets/js/data/exercises.js');
const { SUBJECTS } = await import('../assets/js/data/catalog.js');

const [lang = 'es', only = '', topN = '200'] = process.argv.slice(2);

const subjectOf = new Map();
for (const s of SUBJECTS) for (const topic of s.topics) subjectOf.set(topic.id, s.id);

await setLanguage(lang, { reload: false });
for (const s of SUBJECTS) await loadContent(s.id);

/* Sampled, not exhaustive: the library is two million worksheets and the
   ordering is stable long before the count is. */
const SAMPLE = 600;
const step = Math.max(1, Math.floor(FAMILIES.length / SAMPLE));

const freq = new Map();     // subject -> Map(string -> times seen)
const slots = new Map();    // subject -> total option slots

for (let i = 0; i < FAMILIES.length; i += step) {
  const family = FAMILIES[i];
  const subject = subjectOf.get(family.topic);
  if (!subject || (only && subject !== only)) continue;
  const ex = getExercise(family.at(0).id);
  if (!ex?.questions) continue;
  const counts = freq.get(subject) ?? freq.set(subject, new Map()).get(subject);
  for (const q of ex.questions) {
    for (const o of q.options ?? []) {
      const s = typeof o === 'string' ? o : (o?.text ?? '');
      if (!s) continue;
      slots.set(subject, (slots.get(subject) ?? 0) + 1);
      if (t(s) !== s) continue;
      counts.set(s, (counts.get(s) ?? 0) + 1);
    }
  }
}

if (!only) {
  console.log('Subjects by how much English is left on screen:\n');
  const rows = [...slots.entries()].map(([subject, total]) => {
    const counts = freq.get(subject) ?? new Map();
    const left = [...counts.values()].reduce((a, b) => a + b, 0);
    return { subject, total, left, distinct: counts.size };
  }).sort((a, b) => b.left - a.left);
  const grand = rows.reduce((a, r) => a + r.total, 0);
  for (const r of rows) {
    console.log(`  ${r.subject.padEnd(12)} ${String(r.left).padStart(5)} English of ${String(r.total).padStart(5)} slots` +
                ` (${(100 * r.left / r.total).toFixed(0)}% English, ${(100 * r.total / grand).toFixed(1)}% of the library)` +
                ` — ${r.distinct} strings to write`);
  }
  console.log('\nThen: node tools/rank-content.mjs ' + lang + ' <subject> <n>');
} else {
  const counts = freq.get(only) ?? new Map();
  const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const total = slots.get(only) ?? 0;
  const n = Number(topN);
  const covered = ranked.slice(0, n).reduce((a, [, c]) => a + c, 0);
  console.log(`# ${only} in ${lang}: ${ranked.length} strings still English.`);
  console.log(`# The first ${n} of them cover ${covered} of ${total} option slots (${(100 * covered / total).toFixed(0)}%).\n`);
  for (const [s] of ranked.slice(0, n)) console.log(JSON.stringify(s));
}
