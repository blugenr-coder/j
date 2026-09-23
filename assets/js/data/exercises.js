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
import { STANDARDS } from './standards.js';
import { STORAGE_KEY } from '../core/storage-key.js';
import { buildFamilies, generateQuestions } from './generated.js';
import { withHint } from './gen-core.js';

/* Everything the UI needs but a content author should not have to repeat. */
function decorate(ex) {
  const types = ex.types ?? [...new Set(ex.questions.map(q => q.type))];
  /* Every question reaches the player with a hint, authored or derived. The
     alternative is a Show hint button that is greyed out on most of the
     library, which reads as a broken feature rather than a missing one. */
  const questions = ex.questions.map(withHint);
  return {
    printable: true, online: true, featured: false, generated: false,
    /* Authored worksheets predate the page count; derive one from their length. */
    pages: Math.max(1, Math.min(4, Math.round((ex.count ?? ex.questions?.length ?? 10) / 10) || 1)),
    ...ex,
    questions,
    types,
    framework: STANDARDS[ex.topic]?.framework ?? null,
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
export const CUSTOM = loadCustom().map(decorate);

/* Families, not sheets. Every worksheet in a family shares each attribute the
   library filters on and differs only in which items its seed deals, so the
   catalogue holds thirty-odd thousand families rather than a million sheets.
   Filtering runs over the families; only the page being rendered is expanded.
   Families are NOT passed through decorate: they already answer every field it
   would add, and spreading one evaluates every getter — the eager string
   building the lazy type exists to avoid. */
export const FAMILIES = buildFamilies();

/* Authored and custom worksheets are one-sheet families. */
const SINGLES = [...AUTHORED, ...CUSTOM];

/** How many worksheets the library actually holds. */
export const TOTAL = SINGLES.length + FAMILIES.reduce((n, f) => n + f.sets, 0);

/* -------------------------------- traversal -------------------------------- */
/**
 * Every worksheet matching a predicate, lazily.
 * The predicate is applied to the family — which is safe, because a family's
 * members differ only in id, title and seed — so filtering a million sheets
 * costs thirty thousand tests, not a million.
 */
export function* iterate(pred = null) {
  for (const ex of SINGLES) if (!pred || pred(ex)) yield ex;
  for (const f of FAMILIES) {
    if (pred && !pred(f)) continue;
    for (let i = 0; i < f.sets; i++) yield f.at(i);
  }
}

/** How many worksheets match, without building any of them. */
export function countWhere(pred = null) {
  let n = 0;
  for (const ex of SINGLES) if (!pred || pred(ex)) n++;
  for (const f of FAMILIES) if (!pred || pred(f)) n += f.sets;
  return n;
}

/* ------------------------------- spreading -------------------------------
   Worksheets come out of the catalogue in the order they were built: every
   sheet of one family, then every sheet of the next. That is the right order
   for building and the wrong one for looking at. A shelf of twelve filled
   itself with twelve ways to practise uppercase A, and the first page of
   Early Learning was fifty variations on one skill, because one family holds
   up to sixty-two worksheets and a page holds twenty-four.

   So anything a person browses is spread first: neighbours are made to differ
   in topic, and within a topic in what they actually teach. */

/** How to tell "more of the same" apart. */
export const spreadKeyOf = ex => ex.spreadKey ?? ex.unit ?? ex.title ?? '';

/**
 * Reorder a list so that neighbours differ, by the keys given, most important
 * first. Each level is dealt round-robin: one from every group, then a second
 * from every group, and so on. Ordering inside a group is preserved, so a
 * sort applied before this still decides which sheet leads its group.
 */
export function spreadOut(items, keyFns) {
  if (!keyFns.length || items.length < 2) return items;
  const [head, ...rest] = keyFns;
  const groups = new Map();
  for (const it of items) {
    const k = head(it);
    const g = groups.get(k);
    if (g) g.push(it); else groups.set(k, [it]);
  }
  if (groups.size < 2) return spreadOut(items, rest);
  const lists = [...groups.values()].map(g => spreadOut(g, rest));
  const out = [];
  for (let round = 0; out.length < items.length; round++) {
    let dealt = false;
    for (const g of lists) if (round < g.length) { out.push(g[round]); dealt = true; }
    if (!dealt) break;
  }
  return out;
}

/** The keys a browsing surface spreads by: topic first, then what it teaches. */
export const SPREAD_KEYS = [ex => ex.topic ?? '', spreadKeyOf];

/**
 * The first n matching worksheets, laid out for a shelf rather than for a
 * build: no two neighbours from the same topic while other topics are still
 * waiting, and no two from the same skill while other skills are.
 *
 * Only the first sheet of each family is offered until every family has been
 * offered once, which is what stops one family from filling the shelf.
 */
export function takeSpread(pred = null, n = 12, offset = 0) {
  const want = n + offset;
  /* At most a couple of candidates per skill. Without this cap the shelf is
     decided by whichever topic the catalogue happens to build first: a scan
     that stops after the first few hundred families never reaches Feelings
     and Friends, and the "spread" shelf comes out as twelve letters. */
  const PER_KEY = 2;
  const kept = new Map();
  const heads = [];
  const consider = ex => {
    const key = `${ex.topic ?? ''}|${spreadKeyOf(ex)}`;
    const seen = kept.get(key) ?? 0;
    if (seen >= PER_KEY) return;
    kept.set(key, seen + 1);
    heads.push(ex);
  };
  for (const ex of SINGLES) if (!pred || pred(ex)) consider(ex);
  for (const f of FAMILIES) if (!pred || pred(f)) consider(f);

  const spread = spreadOut(heads, SPREAD_KEYS);
  return spread.slice(offset, want).map(f => (f.at ? f.at(0) : f));
}

/** The first n matching worksheets, skipping the first `offset`. */
export function takeWhere(pred = null, n = 24, offset = 0) {
  const out = [];
  let skipped = 0;
  for (const ex of iterate(pred)) {
    if (skipped < offset) { skipped++; continue; }
    out.push(ex);
    if (out.length >= n) break;
  }
  return out;
}

/** The first matching worksheet, or null. */
export const findWhere = pred => takeWhere(pred, 1)[0] ?? null;

/* --------------------------------- lookup --------------------------------- */
/* Ids are structured: `<topic>-<level>-<focus>[-set-<label>]`. The index maps a
   family's base id to the family, so looking a worksheet up means one map hit
   and one small object — not an index of a million strings. */
let familyIndex = null;
function index() {
  if (familyIndex) return familyIndex;
  familyIndex = new Map();
  for (const ex of SINGLES) familyIndex.set(ex.id, ex);
  for (const f of FAMILIES) familyIndex.set(f.baseId, f);
  return familyIndex;
}

/** Set labels run A…Z then AA, AB…, matching generated.js. */
function setNumber(label) {
  let n = 0;
  for (const ch of label.toUpperCase()) {
    const v = ch.charCodeAt(0) - 65;
    if (v < 0 || v > 25) return -1;
    n = n * 26 + v + 1;
  }
  return n - 1;
}

/** Look one worksheet up by id. Metadata only — see getExercise for questions. */
export function byId(id) {
  if (typeof id !== 'string') return null;
  const map = index();
  const direct = map.get(id);
  if (direct) return direct.sets === undefined ? direct : direct.at(0);

  const m = id.match(/^(.*)-set-([a-z]+)$/);
  if (!m) return null;
  const family = map.get(m[1]);
  if (!family || family.sets === undefined) return null;
  const n = setNumber(m[2]);
  return n >= 1 && n < family.sets ? family.at(n) : null;
}

/* Kept as a Proxy so `EXERCISE_MAP[id]` still reads naturally at the call
   sites, while nothing is materialised until something is asked for. */
export const EXERCISE_MAP = new Proxy({}, {
  get: (_, id) => typeof id === 'string' ? (byId(id) ?? undefined) : undefined,
  has: (_, id) => typeof id === 'string' && byId(id) !== null
});

/* --------------------------------- access --------------------------------- */
const hydrated = new Map();

/** An exercise with its questions present, building them on first request. */
export function getExercise(id) {
  const ex = byId(id);
  if (!ex) return null;
  if (ex.questions) return ex;
  if (hydrated.has(id)) return hydrated.get(id);

  /* Hydrating is the one place a blueprint is flattened, because the caller is
     about to read all of it anyway. */
  const questions = generateQuestions(ex).map(withHint);
  const full = {
    id: ex.id, title: ex.title, subject: ex.subject, topic: ex.topic,
    grade: ex.grade, level: ex.level, difficulty: ex.difficulty,
    minutes: ex.minutes, summary: ex.summary, types: ex.types,
    band: ex.band, pages: ex.pages, generated: true, printable: true, online: true,
    framework: ex.framework, unit: ex.unit ?? null,
    questions,
    count: questions.length,
    autoMarked: questions.filter(q => q.type !== 'written').length
  };
  hydrated.set(id, full);
  return full;
}

/** Metadata only — safe to call for every card in a list. */
export const getMeta = id => byId(id);

export const exercisesBy = pred => takeWhere(pred, 48);

/* Counts by grade, subject, level, topic and question type, tallied in one
   pass. Twenty cards on the home page each running their own predicate over
   thirty-four thousand families was six hundred thousand tests to render a
   handful of numbers, and it showed: half a second before anything appeared. */
const TALLY = (() => {
  const t = { grade: {}, subject: {}, level: {}, topic: {}, type: {} };
  const add = (bucket, key, n) => { if (key != null) bucket[key] = (bucket[key] ?? 0) + n; };
  const count = (ex, n) => {
    add(t.grade, ex.grade, n);
    add(t.subject, ex.subject, n);
    add(t.level, ex.level, n);
    add(t.topic, ex.topic, n);
    for (const ty of ex.types ?? []) add(t.type, ty, n);
  };
  for (const ex of SINGLES) count(ex, 1);
  for (const f of FAMILIES) count(f, f.sets);
  return t;
})();

export const countByGrade = grade => TALLY.grade[grade] ?? 0;
export const countBySubject = subject => TALLY.subject[subject] ?? 0;
export const countByLevel = level => TALLY.level[level] ?? 0;
export const countByTopic = topic => TALLY.topic[topic] ?? 0;
export const countByType = type => TALLY.type[type] ?? 0;
export const topicsInUse = subject => {
  const seen = new Set();
  for (const ex of SINGLES) if (ex.subject === subject) seen.add(ex.topic);
  for (const f of FAMILIES) if (f.subject === subject) seen.add(f.topic);
  return [...seen];
};

/** Total questions across the library, counted from the families. */
export const TOTAL_QUESTIONS =
  SINGLES.reduce((n, e) => n + e.count, 0) +
  FAMILIES.reduce((n, f) => n + f.count * f.sets, 0);

/** Featured shelf: the flagship first, then a spread across bands. */
export function featuredExercises(n = 6) {
  const seen = new Set();
  const picked = [];
  for (const ex of AUTHORED.filter(e => e.featured)) { picked.push(ex); seen.add(ex.id); }
  for (const band of ['early', 'mid', 'upper', 'mid', 'upper', 'early']) {
    const next = AUTHORED.find(e => e.band === band && !seen.has(e.id));
    if (next) { picked.push(next); seen.add(next.id); }
  }
  for (const ex of iterate()) {
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
