/* Content integrity check. Run with: node tools/validate-content.mjs
   Catches the mistakes that are easy to make when authoring exercises by hand:
   dangling answer indexes, missing answers, unknown subjects or topics. */

import { AUTHORED, GENERATED, getExercise } from '../assets/js/data/exercises.js';
import { SUBJECT_MAP, TOPIC_MAP, GRADE_MAP, DIFF_MAP, QTYPE_MAP } from '../assets/js/data/catalog.js';

const errors = [];
const warn = [];
const seen = new Set();
let genNoExplain = 0;


/* Every generated worksheet has its metadata checked; a large deterministic
   sample also has its questions materialised. Building all 25,000 sheets takes
   minutes, and sheets from the same focus differ only by seed, so sampling
   across every (topic, focus, page-count) combination catches the same faults
   for a fraction of the time. Pass --full to check every one. */
const FULL = process.argv.includes('--full');
const seenCombo = new Set();
const sample = GENERATED.filter(b => {
  if (FULL) return true;
  const key = `${b.topic}|${b.title.replace(/ — Set .*/, '')}|${b.pages}|${b.level}`;
  if (seenCombo.has(key)) return false;
  seenCombo.add(key);
  return true;
});

/* Ids must be unique across the whole library: the runtime index is a Map
   built from them, so a collision silently hides a worksheet. Checked here
   rather than at load, where it would cost a tenth of a second every time. */
const allIds = new Set();
for (const b of [...AUTHORED, ...GENERATED]) {
  if (allIds.has(b.id)) errors.push(`${b.id}: duplicate worksheet id`);
  allIds.add(b.id);
}

/* Metadata on every blueprint, questions on the sample. */
for (const b of GENERATED) {
  if (!SUBJECT_MAP[b.subject]) errors.push(`${b.id}: unknown subject "${b.subject}"`);
  if (!TOPIC_MAP[b.topic])     errors.push(`${b.id}: unknown topic "${b.topic}"`);
  if (!GRADE_MAP[b.grade])     errors.push(`${b.id}: unknown grade band "${b.grade}"`);
  if (!DIFF_MAP[b.difficulty]) errors.push(`${b.id}: unknown difficulty "${b.difficulty}"`);
  if (!(b.pages >= 1 && b.pages <= 10)) errors.push(`${b.id}: page count ${b.pages} out of range`);
  if (!b.count || b.count < 4) errors.push(`${b.id}: implausible question count ${b.count}`);
}

const EXERCISES = [...AUTHORED, ...sample.map(b => getExercise(b.id))];

for (const ex of EXERCISES) {
  const at = (extra = '') => `${ex.id}${extra}`;

  if (seen.has(ex.id)) errors.push(`${at()}: duplicate exercise id`);
  seen.add(ex.id);

  if (!SUBJECT_MAP[ex.subject])           errors.push(`${at()}: unknown subject "${ex.subject}"`);
  if (!TOPIC_MAP[ex.topic])               errors.push(`${at()}: unknown topic "${ex.topic}"`);
  else if (TOPIC_MAP[ex.topic].subject !== ex.subject)
    errors.push(`${at()}: topic "${ex.topic}" does not belong to subject "${ex.subject}"`);
  if (!GRADE_MAP[ex.grade])               errors.push(`${at()}: unknown grade band "${ex.grade}"`);
  else if (!GRADE_MAP[ex.grade].levels.includes(ex.level))
    errors.push(`${at()}: level "${ex.level}" is not in band "${ex.grade}"`);
  if (!DIFF_MAP[ex.difficulty])           errors.push(`${at()}: unknown difficulty "${ex.difficulty}"`);
  if (!ex.summary)                        warn.push(`${at()}: no summary`);
  if (ex.generated && ex.questions.length !== ex.count)
    errors.push(`${at()}: generated ${ex.questions.length} questions but declares ${ex.count}`);
  if (!ex.questions?.length)              errors.push(`${at()}: no questions`);

  const qids = new Set();
  for (const q of ex.questions ?? []) {
    const w = at(` / ${q.id}`);
    if (qids.has(q.id)) errors.push(`${w}: duplicate question id`);
    qids.add(q.id);
    if (!QTYPE_MAP[q.type]) { errors.push(`${w}: unknown question type "${q.type}"`); continue; }
    if (!q.prompt) errors.push(`${w}: missing prompt`);

    switch (q.type) {
      case 'choice':
        if (!Array.isArray(q.options) || q.options.length < 2) errors.push(`${w}: needs at least 2 options`);
        if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= (q.options?.length ?? 0))
          errors.push(`${w}: answer index ${q.answer} is out of range`);
        break;
      case 'multi':
        if (!Array.isArray(q.answer) || !q.answer.length) errors.push(`${w}: multi needs an answer array`);
        else for (const i of q.answer)
          if (!Number.isInteger(i) || i < 0 || i >= (q.options?.length ?? 0))
            errors.push(`${w}: answer index ${i} is out of range`);
        break;
      case 'blank':
      case 'math':
        if (typeof q.answer !== 'string' || !q.answer.trim()) errors.push(`${w}: needs a string answer`);
        break;
      case 'match':
        if (!Array.isArray(q.pairs) || q.pairs.length < 2) errors.push(`${w}: needs at least 2 pairs`);
        else for (const p of q.pairs) if (!p.left || !p.right) errors.push(`${w}: incomplete pair`);
        break;
      case 'order':
        if (!Array.isArray(q.items) || q.items.length < 2) errors.push(`${w}: needs at least 2 items`);
        break;
      case 'graph':
        if (!q.answer || typeof q.answer.x !== 'number' || typeof q.answer.y !== 'number')
          errors.push(`${w}: graph answer needs numeric x and y`);
        if (!q.grid) errors.push(`${w}: graph needs a grid range`);
        break;
      case 'written':
        if (!q.sample) warn.push(`${w}: no sample answer for the key`);
        break;
    }
    if (!q.explanation && !ex.generated) warn.push(`${w}: no explanation (the answer key will be thin)`);
    if (!q.explanation && ex.generated) genNoExplain++;
  }
}

const totalQ = EXERCISES.reduce((a, e) => a + e.questions.length, 0);
console.log(`Library: ${(AUTHORED.length + GENERATED.length).toLocaleString()} worksheets ` +
  `(${AUTHORED.length} authored, ${GENERATED.length.toLocaleString()} generated).`);
console.log(`Metadata checked on all of them; questions materialised and checked on ` +
  `${EXERCISES.length.toLocaleString()} (${totalQ.toLocaleString()} questions).`);
if (genNoExplain) warn.push(`${genNoExplain} generated question(s) have no explanation`);
if (warn.length)   console.log(`\n${warn.length} warning(s):\n  ` + warn.join('\n  '));
if (errors.length) { console.error(`\n${errors.length} error(s):\n  ` + errors.join('\n  ')); process.exit(1); }
console.log('\nNo errors.');
