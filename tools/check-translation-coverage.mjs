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
const { FAMILIES, getExercise } = await import('../assets/js/data/exercises.js');
const { SUBJECTS } = await import('../assets/js/data/catalog.js');

/* The floors. Raise them as content lands; never lower them to make a run
   pass. Prompts are near-complete; options wait on the unit content banks. */
const FLOOR = { prompt: 0.95, option: 0.00, overall: 0.25 };

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

  for (let i = 0; i < FAMILIES.length; i += step) {
    const ex = getExercise(FAMILIES[i].at(0).id);
    if (!ex?.questions) continue;
    for (const q of ex.questions) {
      seen.prompt++;
      if (t(q.prompt) !== q.prompt) hit.prompt++;
      else {
        const shape = q.prompt.replace(/[“"][^”"]*[”"]/g, '“X”').replace(/\d+/g, 'N').slice(0, 60);
        misses.set(shape, (misses.get(shape) ?? 0) + 1);
      }
      for (const o of q.options ?? []) {
        const s = typeof o === 'string' ? o : (o?.text ?? '');
        if (!s) continue;
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

  for (const [key, floor] of Object.entries(FLOOR)) {
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
