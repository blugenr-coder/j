/* WorksheetHub — the exercise library.
   Two sources, one shape:
     · authored worksheets, written by hand in exercises-*.js
     · generated worksheets, expanded from the curriculum plan
   A generated worksheet carries only its metadata until it is opened; its
   questions are then built from its seed, identically every time. That is what
   lets the library list a thousand worksheets without loading ten thousand
   questions. */

import early  from './exercises-early.js';
import middle from './exercises-middle.js';
import upper  from './exercises-upper.js';
import { GRADE_MAP } from './catalog.js';
import { STORAGE_KEY } from '../core/storage-key.js';
import { buildBlueprints, generateQuestions } from './generated.js';

/* Everything the UI needs but a content author should not have to repeat. */
function decorate(ex) {
  const types = ex.types ?? [...new Set(ex.questions.map(q => q.type))];
  return {
    printable: true, online: true, featured: false, generated: false,
    /* Authored worksheets predate the page count; derive one from their length. */
    pages: Math.max(1, Math.min(4, Math.round((ex.count ?? ex.questions?.length ?? 10) / 10) || 1)),
    ...ex,
    types,
    count: ex.count ?? ex.questions.length,
    band: GRADE_MAP[ex.grade]?.band ?? 'mid',
    autoMarked: ex.questions
      ? ex.questions.filter(q => q.type !== 'written').length
      : Math.max(1, (ex.count ?? 10) - 1)
  };
}

/* Worksheets written in the builder live in local storage. Anything malformed
   is skipped rather than allowed to break the library. */
function loadCustom() {
  try {
    const raw = typeof localStorage === 'undefined' ? null : localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw).customExercises ?? [];
    return list.filter(ex =>
      ex && typeof ex.id === 'string' && Array.isArray(ex.questions) && ex.questions.length &&
      GRADE_MAP[ex.grade]);
  } catch {
    return [];
  }
}

export const AUTHORED = [...early, ...middle, ...upper].map(decorate);
export const GENERATED = buildBlueprints().map(decorate);
export const CUSTOM = loadCustom().map(decorate);

/* Authored worksheets come first: they are the deepest and set the tone. */
export const EXERCISES = [...AUTHORED, ...CUSTOM, ...GENERATED];

export const EXERCISE_MAP = Object.fromEntries(EXERCISES.map(e => [e.id, e]));

/* --------------------------------- access --------------------------------- */
const hydrated = new Map();

/** An exercise with its questions present, building them on first request. */
export function getExercise(id) {
  const ex = EXERCISE_MAP[id];
  if (!ex) return null;
  if (ex.questions) return ex;
  if (hydrated.has(id)) return hydrated.get(id);

  const questions = generateQuestions(ex);
  const full = {
    ...ex,
    questions,
    count: questions.length,
    autoMarked: questions.filter(q => q.type !== 'written').length
  };
  hydrated.set(id, full);
  return full;
}

/** Metadata only — safe to call for every card in a list. */
export const getMeta = id => EXERCISE_MAP[id] ?? null;

export const exercisesBy = pred => EXERCISES.filter(pred);
export const countByGrade = grade => EXERCISES.filter(e => e.grade === grade).length;
export const countBySubject = subject => EXERCISES.filter(e => e.subject === subject).length;
export const topicsInUse = subject =>
  [...new Set(EXERCISES.filter(e => e.subject === subject).map(e => e.topic))];

/** Featured shelf: the flagship first, then a spread across bands. */
export function featuredExercises(n = 6) {
  const seen = new Set();
  const picked = [];
  for (const ex of AUTHORED.filter(e => e.featured)) { picked.push(ex); seen.add(ex.id); }
  for (const band of ['early', 'mid', 'upper', 'mid', 'upper', 'early']) {
    const next = AUTHORED.find(e => e.band === band && !seen.has(e.id));
    if (next) { picked.push(next); seen.add(next.id); }
  }
  for (const ex of EXERCISES) {
    if (picked.length >= n) break;
    if (!seen.has(ex.id)) { picked.push(ex); seen.add(ex.id); }
  }
  return picked.slice(0, n);
}

/**
 * A couple of real questions from a worksheet, for the preview on its card.
 * Generated worksheets are built on demand here too, so a preview is always
 * the genuine article rather than a mock-up.
 */
export function previewQuestions(id, n = 2) {
  const ex = getExercise(id);
  if (!ex?.questions?.length) return [];
  return ex.questions.slice(0, n);
}
