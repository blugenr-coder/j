/* Content integrity check. Run with: node tools/validate-content.mjs
   Catches the mistakes that are easy to make when authoring exercises by hand:
   dangling answer indexes, missing answers, unknown subjects or topics. */

import { EXERCISES } from '../assets/js/data/exercises.js';
import { SUBJECT_MAP, TOPIC_MAP, GRADE_MAP, DIFF_MAP, QTYPE_MAP } from '../assets/js/data/catalog.js';

const errors = [];
const warn = [];
const seen = new Set();

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
    if (!q.explanation) warn.push(`${w}: no explanation (the answer key will be thin)`);
  }
}

const totalQ = EXERCISES.reduce((a, e) => a + e.questions.length, 0);
console.log(`Checked ${EXERCISES.length} exercises / ${totalQ} questions.`);
if (warn.length)   console.log(`\n${warn.length} warning(s):\n  ` + warn.join('\n  '));
if (errors.length) { console.error(`\n${errors.length} error(s):\n  ` + errors.join('\n  ')); process.exit(1); }
console.log('\nNo errors.');
