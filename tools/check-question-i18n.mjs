/* Are the generated questions actually translated?

   The interface has been translatable for a while; the questions on the
   worksheets were not, and a Spanish student got a Spanish menu wrapped round
   an English quiz. This checks the templates every generated question is
   built from, in every language, by pushing real prompts through the real
   translator.

   It also checks the thing that is easy to get wrong: that a pattern with a
   capture group actually puts the captured text back. A pattern that matches
   and then drops its subject is worse than no pattern at all — it produces a
   fluent sentence about nothing.

     node tools/check-question-i18n.mjs
*/

/* i18n is a browser module: it stamps <html lang> and walks the document. The
   translation itself is pure, so a minimal stand-in for the two things it
   touches lets this run in Node in a second rather than in a browser in
   thirty. tools/e2e-language.mjs covers it in a real page. */
globalThis.document = {
  documentElement: { lang: '', dataset: {} },
  createTreeWalker: () => ({ nextNode: () => null }),
  body: null
};
globalThis.MutationObserver = class { observe() {} disconnect() {} };
globalThis.localStorage = { getItem: () => null, setItem() {} };

const { LANGUAGES, setLanguage, t } = await import('../assets/js/core/i18n.js');

let pass = 0, fail = 0;
const ok = (label, cond, detail) => {
  cond ? pass++ : fail++;
  console.log(`${cond ? '✓' : '✗'} ${label}`);
  if (!cond && detail !== undefined) console.log('   got:', String(detail).slice(0, 160));
};

/* Real prompts, exactly as unit-engine.js builds them. */
const PROMPTS = [
  'Which statement about cell structure is correct?',
  'Which statement about cell structure is NOT correct?',
  'Select every statement about contract law that is true.',
  'Three of these six statements about the Roman Empire are true. Select them.',
  'Three of these belong to offer and acceptance. Which one does not?',
  'Select every term that belongs to thermodynamics.',
  'Which term matches this description? “the organelle that releases energy”',
  'Which of these best describes “consideration”?',
  'Label the numbered parts of the diagram: the human heart.',
  'Define “mens rea” in your own words.',
  'Explain why this is the case: “Water expands when it freezes.”',
  'This statement is wrong. Write the correct version: “Light travels instantly.”',
  'Complete the sentence: The capital of France is ___.',
  'Name the term: the study of bodies in equilibrium.',
  'Put these in the right order: how a bill becomes an Act.',
  'It begins with “m”.',
  'The correct order is: first → second → third.',
  'How do you say “the house” in Spanish?',
  'What does “la casa” mean in English?',
  'Match each Spanish word to its meaning.',
  'Match each English meaning to its Spanish word.',
  'Pick the one that matches “cat”.',
  'Match each term to its meaning.',
  'Match each description to the term it defines.',
  'Which one is true?',
  'Which one is NOT true?',
  'Three of these go together. Which one does not?'
];

/* The words a capture must carry through, so a pattern that matches but drops
   its subject is caught rather than admired. */
const SUBJECTS = {
  'Which statement about cell structure is correct?': 'cell structure',
  'Select every statement about contract law that is true.': 'contract law',
  'Which of these best describes “consideration”?': 'consideration',
  'Define “mens rea” in your own words.': 'mens rea',
  'Label the numbered parts of the diagram: the human heart.': 'human heart',
  'Name the term: the study of bodies in equilibrium.': 'equilibrium',
  'What does “la casa” mean in English?': 'la casa'
};

const codes = LANGUAGES.map(l => l.code).filter(c => c !== 'en');
ok('there is more than one language to check', codes.length >= 5, codes);

for (const code of codes) {
  await setLanguage(code, { reload: false });
  const untranslated = [];
  const dropped = [];

  for (const prompt of PROMPTS) {
    const out = t(prompt);
    if (out === prompt) untranslated.push(prompt);
    const subject = SUBJECTS[prompt];
    if (subject && !out.includes(subject)) dropped.push(`${prompt} -> ${out}`);
  }

  ok(`${code}: every question template is translated`, untranslated.length === 0,
    untranslated.slice(0, 2).join(' | '));
  ok(`${code}: captured subjects survive the substitution`, dropped.length === 0,
    dropped.slice(0, 2).join(' | '));
}

/* English must be left exactly alone: it is the source language, and a
   dictionary that "translates" it would corrupt every prompt. */
await setLanguage('en', { reload: false });
const unchanged = PROMPTS.every(p => t(p) === p);
ok('English is passed through untouched', unchanged);

/* A prompt with no template must survive rather than being mangled by a
   pattern that half-matches. */
await setLanguage('es', { reload: false });
const odd = 'A box holds 4 apples. How many apples are in 3 boxes?';
ok('a prompt with no template is returned unchanged, not mangled', t(odd) === odd, t(odd));

console.log(`\n${pass} passed, ${fail} failed.`);
process.exit(fail ? 1 : 0);
