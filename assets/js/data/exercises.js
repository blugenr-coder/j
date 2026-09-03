/* WorksheetHub — the exercise library.
   Content lives in per-band files; this module merges them, derives the
   metadata the UI filters on, and exposes the lookup helpers. */

import early  from './exercises-early.js';
import middle from './exercises-middle.js';
import upper  from './exercises-upper.js';
import { GRADE_MAP, SUBJECT_MAP, TOPIC_MAP, DIFF_MAP } from './catalog.js';
import { STORAGE_KEY } from '../core/storage-key.js';

/* Everything an exercise page needs but content authors should not have to
   repeat: question count, the set of question types used, whether it can be
   printed, and the grade band it belongs to. */
function decorate(ex) {
  const types = [...new Set(ex.questions.map(q => q.type))];
  return {
    printable: true,
    online: true,
    featured: false,
    ...ex,
    types,
    count: ex.questions.length,
    band: GRADE_MAP[ex.grade]?.band ?? 'mid',
    /* Written and graph answers cannot be auto-marked on paper, but they
       still print perfectly well as lined space. */
    autoMarked: ex.questions.filter(q => q.type !== 'written').length
  };
}

/* Exercises written in the builder live in local storage rather than in a
   content file. They are read once at load and merged into the library so they
   search, play and print through exactly the same code as authored content.
   Anything malformed is skipped rather than allowed to break the library. */
function loadCustom() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw).customExercises ?? [];
    return list.filter(ex =>
      ex && typeof ex.id === 'string' &&
      Array.isArray(ex.questions) && ex.questions.length &&
      GRADE_MAP[ex.grade] && SUBJECT_MAP[ex.subject] && TOPIC_MAP[ex.topic] && DIFF_MAP[ex.difficulty]
    );
  } catch {
    return [];
  }
}

export const AUTHORED = [...early, ...middle, ...upper].map(decorate);

export const EXERCISES = [...AUTHORED, ...loadCustom().map(decorate)];

export const EXERCISE_MAP = Object.fromEntries(EXERCISES.map(e => [e.id, e]));

export const getExercise = id => EXERCISE_MAP[id] ?? null;

export const exercisesBy = (pred) => EXERCISES.filter(pred);

export const countByGrade = grade => EXERCISES.filter(e => e.grade === grade).length;

export const countBySubject = subject => EXERCISES.filter(e => e.subject === subject).length;

export const topicsInUse = (subject) =>
  [...new Set(EXERCISES.filter(e => e.subject === subject).map(e => e.topic))];

/* Featured selection for the home page: the flagship exercise first, then a
   spread across bands so the shelf never looks like one subject. */
export function featuredExercises(n = 6) {
  const seen = new Set();
  const picked = [];
  for (const ex of EXERCISES.filter(e => e.featured)) { picked.push(ex); seen.add(ex.id); }
  for (const band of ['early', 'mid', 'upper', 'mid', 'upper', 'early']) {
    const next = EXERCISES.find(e => e.band === band && !seen.has(e.id));
    if (next) { picked.push(next); seen.add(next.id); }
  }
  for (const ex of EXERCISES) {
    if (picked.length >= n) break;
    if (!seen.has(ex.id)) { picked.push(ex); seen.add(ex.id); }
  }
  return picked.slice(0, n);
}
