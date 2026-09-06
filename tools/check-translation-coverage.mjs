/* How much of a worksheet is actually in the reader's language.

   This exists because I quoted the wrong number. Measuring the share of
   question *templates* translated gave 92%, which sounded like success and
   described almost nothing: a prompt is about 30% of the text on a worksheet
   and the answer options are most of the rest. Weighted by what is on the
   screen the real figure was 27%, and a Spanish reader saw a Spanish question
   followed by four English answers.

   So this counts every string a reader sees, weighted the way the page
   weights it, and prints the breakdown that makes an overstatement obvious.
   It fails below a floor, so the number can go up and never quietly down.

     node tools/check-translation-coverage.mjs
*/

globalThis.document = {
  documentElement: { lang: '', dataset: {} },
  createTreeWalker: () => ({ nextNode: () => null }),
  body: null
};
globalThis.MutationObserver = class { observe() {} disconnect() {} };
globalThis.localStorage = { getItem: () => null, setItem() {} };

const { LANGUAGES, setLanguage, loadContent, t } = await import('../assets/js/core/i18n.js');
const { FAMILIES, AUTHORED, getExercise } = await import('../assets/js/data/exercises.js');
const { SUBJECTS } = await import('../assets/js/data/catalog.js');

/* The floors. Raise them as content lands; never lower them to make a run
   pass.

   The prompt floor was 0.95 and now reads 0.92. That is a rebase, not a
   retreat: the twenty-six authored worksheets used to be almost entirely
   outside the sample and are now counted in full, which added several hundred
   untranslated prompts to the denominator in every language. 93.0% is what
   the four languages without content packs were worth all along. */
const FLOOR = { prompt: 0.92, option: 0.00, overall: 0.25 };
/* Spanish has content packs for every subject, so it is held to its own,
   much higher marks. */
const ES_FLOOR = { prompt: 0.95, option: 0.32, overall: 0.51 };

const SAMPLE = 400;
const step = Math.max(1, Math.floor(FAMILIES.length / SAMPLE));

let fail = 0;
const pct = (a, b) => b ? a / b : 1;
const show = (a, b) => `${a}/${b} (${(100 * pct(a, b)).toFixed(1)}%)`;

for (const { code, name } of LANGUAGES.filter(l => l.code !== 'en')) {
  await setLanguage(code, { reload: false });
  /* Load every content pack that exists, because that is what a reader gets:
     the exercise page fetches the pack for the subject it is showing. */
  for (const s of SUBJECTS) await loadContent(s.id);

  const seen = { prompt: 0, option: 0 };
  const hit = { prompt: 0, option: 0 };
  const misses = new Map();

  /* The twenty-six authored worksheets are counted in full rather than
     sampled: they are what the home page features and what the library lists
     first, so leaving them to a one-in-eighty sample lets the average look
     healthy while the first sheet a reader opens is untouched. */
  const ids = [];
  for (let i = 0; i < FAMILIES.length; i += step) ids.push(FAMILIES[i].at(0).id);
  for (const a of AUTHORED) ids.push(a.id);

  for (const id of ids) {
    const ex = getExercise(id);
    if (!ex?.questions) continue;
    for (const q of ex.questions) {
      seen.prompt++;
      if (t(q.prompt) !== q.prompt) hit.prompt++;
      else {
        const shape = q.prompt.replace(/[“"][^”"]*[”"]/g, '“X”').replace(/\d+/g, 'N').slice(0, 60);
        misses.set(shape, (misses.get(shape) ?? 0) + 1);
      }
      /* A language unit's options are the foreign words themselves. Counting
         them as untranslated reports a gap that closing would be a bug. */
      if (q.foreign) continue;
      for (const o of q.options ?? []) {
        const s = typeof o === 'string' ? o : (o?.text ?? '');
        if (!s) continue;
        /* "3/8", "145\u00b0", "2 + 8", "\u25cf". An option with no letter in it
           has no language, so counting it as untranslated invents a gap. */
        if (!/\p{L}/u.test(s)) continue;
        seen.option++;
        if (t(s) !== s) hit.option++;
      }
    }
  }

  const total = seen.prompt + seen.option;
  const done = hit.prompt + hit.option;

  console.log(`\n${name} (${code})`);
  console.log(`  prompts : ${show(hit.prompt, seen.prompt)}`);
  console.log(`  options : ${show(hit.option, seen.option)}`);
  console.log(`  ON SCREEN: ${show(done, total)}`);

  const floors = { ...FLOOR, ...(code === 'es' ? ES_FLOOR : {}) };
  for (const [key, floor] of Object.entries(floors)) {
    const got = key === 'overall' ? pct(done, total) : pct(hit[key], seen[key]);
    if (got < floor) {
      console.log(`  ✗ ${key} below the floor of ${(100 * floor).toFixed(0)}%`);
      fail++;
    }
  }

  if (code === 'es' && misses.size) {
    console.log('  commonest untranslated prompt shapes:');
    [...misses.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6)
      .forEach(([s, n]) => console.log(`    ${String(n).padStart(4)}  ${s}`));
  }
}

console.log(fail
  ? `\n${fail} coverage floor(s) missed.`
  : `\nEvery language is at or above its coverage floor.`);
process.exit(fail ? 1 : 0);
