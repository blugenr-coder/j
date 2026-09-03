/* The generated catalogue.
   Every (topic, level) pair that makes curricular sense produces a few
   worksheets, each with its own focus. Questions are NOT built here: a
   blueprint carries only what the library needs to list and filter, and the
   questions are materialised from its seed the moment the worksheet is opened.
   That keeps a thousand-worksheet library instant to browse. */

import { GRADES } from './catalog.js';
import { build, seedFrom } from './gen-core.js';
import { MATH_GENERATORS } from './gen-math.js';
import { SCIENCE_GENERATORS } from './gen-science.js';
import { VERBAL_GENERATORS } from './gen-verbal.js';
import { WORLD_GENERATORS } from './gen-world.js';
import { LIFE_GENERATORS } from './gen-life.js';
import { APPLIED_GENERATORS } from './gen-applied.js';
import { POOL_GENERATORS } from './gen-pools.js';

const BASE_GENERATORS = {
  ...MATH_GENERATORS, ...SCIENCE_GENERATORS, ...VERBAL_GENERATORS, ...WORLD_GENERATORS,
  ...LIFE_GENERATORS, ...APPLIED_GENERATORS
};

/* Pool generators sample from large lists, so they extend a topic rather than
   replacing it: the authored items stay, and the pool supplies the variety. */
export const GENERATORS = (() => {
  const out = { ...BASE_GENERATORS };
  for (const [topic, pool] of Object.entries(POOL_GENERATORS)) {
    out[topic] = [...pool, ...(out[topic] ?? [])];
  }
  return out;
})();

/**
 * How much genuinely different content a topic can produce, measured rather
 * than declared. A generator counts only if changing the seed changes the
 * question itself — shuffling the options of a fixed item is not new content,
 * and an earlier hand-written list of "procedural" topics got this wrong,
 * giving Business & Finance more worksheets than Science.
 */
const VARIETY = (() => {
  const out = {};
  for (const [topic, gens] of Object.entries(GENERATORS)) {
    let varied = 0;
    for (let i = 0; i < gens.length; i++) {
      const seen = new Set();
      for (const tag of ['a', 'b', 'c', 'd', 'e']) {
        try {
          const q = gens[i](probeRng(`${topic}${i}${tag}`), 2);
          if (q) seen.add(`${q.prompt ?? ''}|${q.math ?? ''}`);
        } catch { /* a generator that rejects a seed contributes nothing */ }
      }
      if (seen.size > 1) varied++;
    }
    out[topic] = varied;
  }
  return out;
})();

function probeRng(key) {
  let a = seedFrom(key) >>> 0;
  return () => { a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

/* A topic needs several varying generators before a multi-page pack can be
   filled without repeating itself. */
const PROCEDURAL = new Set(Object.keys(VARIETY).filter(t => VARIETY[t] >= 4));

/* Roughly ten questions fit on a printed page with room to work. */
const PAGE_SIZES = { 1: 10, 2: 20, 3: 30, 4: 40 };

/* Every level in curricular order, so a topic can name a range. */
export const LEVELS = GRADES.flatMap(g => g.levels.map(l => ({ level: l, grade: g.id })));
const LEVEL_INDEX = Object.fromEntries(LEVELS.map((l, i) => [l.level, i]));
const idx = name => LEVEL_INDEX[name];

/**
 * Where each topic is taught, and the angles a worksheet can take on it.
 *
 * A focus is either a plain name — meaning "draw from the whole bank" — or a
 * [name, indices, minLevel] triple naming the exact generators it may use and,
 * optionally, the earliest level it belongs at. Specific titles are only
 * allowed where that form pins them down, because a worksheet called "Loops"
 * that asks about dictionaries is worse than one honestly called "Core
 * Practice" — and quadratics have no business appearing in Grade 7.
 *
 * Level ranges are deliberately conservative: a bank pitched at secondary
 * level does not get offered to Grade 1.
 */
const PLAN = {
  /* ------------------------------- maths ------------------------------- */
  arithmetic:  ['Pre-K', 'Grade 8', [
    ['Addition and Subtraction', [0, 1, 4]], ['Times Tables', [2, 3]],
    ['Multiplication and Division', [2, 3, 7]], ['Word Problems', [7, 4, 0]],
    ['Place Value and Rounding', [5, 6]], ['Order of Operations', [8, 2, 0], 'Grade 4'],
    ['Factors and Multiples', [9, 3], 'Grade 4'], 'Mixed Practice']],
  fractions:   ['Grade 2', 'Grade 9', [
    ['Naming Fractions', [0, 5]], ['Equivalent Fractions', [1, 2]],
    ['Simplifying', [2, 1]], ['Adding and Subtracting', [3, 4]],
    ['Comparing and Ordering', [5, 7]], ['Fractions of a Quantity', [6, 0]],
    ['Fractions to Decimals', [8, 5], 'Grade 4'], 'Mixed Practice']],
  decimals:    ['Grade 3', 'Grade 9', [
    ['Adding and Subtracting', [0, 1]], ['Multiplying', [2, 6]],
    ['Rounding', [3]], ['Ordering Decimals', [4, 3, 0]],
    ['Decimals and Money', [6, 2]], ['Converting to Fractions', [5, 3]], 'Mixed Practice']],
  percentages: ['Grade 5', 'Grade 11', [
    ['Percentages of Amounts', [0, 1]], ['Discounts and Sales', [2, 4]],
    ['Percentage Change', [3, 1], 'Grade 7'], ['Reverse Percentages', [4, 2], 'Grade 8'],
    ['Percentages, Decimals and Fractions', [5, 1]], 'Mixed Practice']],
  algebra:     ['Grade 6', 'College', [
    ['Substitution', [4, 8]], ['One-Step Equations', [0, 1]],
    ['Two-Step Equations', [0, 1, 9]], ['Brackets and Expanding', [2, 5]],
    ['Equations With Both Sides', [3, 2], 'Grade 7'], ['Straight-Line Graphs', [8, 4], 'Grade 8'],
    ['Quadratic Equations', [6, 7], 'Grade 9'], 'Mixed Practice']],
  geometry:    ['Grade 2', 'Grade 12', [
    ['Shapes and Properties', [7, 8]], ['Angles in Triangles', [0, 3]],
    ['Angles and Lines', [3, 8]], ['Perimeter and Area', [1, 2]],
    ['Circles', [5, 1], 'Grade 6'], ['Volume and Surface Area', [6, 1], 'Grade 5'],
    ['Pythagoras', [4, 0], 'Grade 8'], ['Polygons', [9, 7], 'Grade 5'], 'Mixed Practice']],
  trigonometry:['Grade 9', 'College', [
    ['SOH-CAH-TOA', [0, 4]], ['Finding Missing Sides', [1, 3]],
    ['Exact Values', [2, 5]], ['Applied Problems', [6, 3]], 'Mixed Practice']],
  statistics:  ['Grade 4', 'College', [
    ['Mean, Median and Mode', [0, 1]], ['Range and Spread', [2, 5]],
    ['Probability Basics', [3]], ['Combined Events', [4, 6], 'Grade 8'],
    ['Sampling and Bias', [7, 5], 'Grade 9'], 'Mixed Practice']],
  calculus:    ['Grade 11', 'Advanced', [
    ['Differentiation Basics', [0, 1, 3]], ['The Power Rule', [0, 7]],
    ['Gradients and Tangents', [2, 4]], ['Turning Points', [5, 2], 'Grade 12'],
    ['Integration Basics', [6, 0], 'Grade 12'], 'Mixed Practice']],

  /* ------------------------------ science ------------------------------ */
  biology:     ['Grade 6', 'College', ['Core Practice', 'Review and Recall', 'Applied Questions', 'Mixed Practice']],
  chemistry:   ['Grade 7', 'College', ['Core Practice', 'Review and Recall', 'Applied Questions', 'Mixed Practice']],
  physics:     ['Grade 7', 'College', [
    ['Calculations', [0, 1, 2, 3]], 'Core Practice', 'Review and Recall', 'Mixed Practice']],
  earth:       ['Grade 4', 'Grade 10', ['Core Practice', 'Review and Recall', 'Mixed Practice']],
  astronomy:   ['Grade 4', 'Grade 12', ['Core Practice', 'Review and Recall', 'Mixed Practice']],

  /* -------------------------------- ELA -------------------------------- */
  grammar:     ['Grade 2', 'Grade 10', ['Core Practice', 'Review and Recall', 'Applied Questions', 'Mixed Practice']],
  vocabulary:  ['Grade 4', 'Grade 12', ['Core Practice', 'Words in Context', 'Review and Recall', 'Mixed Practice']],
  spelling:    ['Grade 1', 'Grade 8', ['Core Practice', 'Review and Recall', 'Mixed Practice']],
  reading:     ['Grade 5', 'Grade 12', ['Core Practice', 'Review and Recall', 'Mixed Practice']],
  writing:     ['Grade 6', 'College', ['Core Practice', 'Review and Recall', 'Applied Questions', 'Mixed Practice']],
  literature:  ['Grade 6', 'College', ['Core Practice', 'Review and Recall', 'Applied Questions', 'Mixed Practice']],

  /* --------------------------- social studies --------------------------- */
  history:     ['Grade 6', 'College', ['Core Practice', 'Review and Recall', 'Applied Questions', 'Mixed Practice']],
  geography:   ['Grade 4', 'Grade 12', ['Core Practice', 'Review and Recall', 'Applied Questions', 'Mixed Practice']],
  civics:      ['Grade 6', 'College', ['Core Practice', 'Review and Recall', 'Mixed Practice']],
  economics:   ['Grade 8', 'College', ['Core Practice', 'Review and Recall', 'Mixed Practice']],

  /* ----------------------------- languages ----------------------------- */
  spanish:     ['Grade 4', 'College', ['Vocabulary', 'Phrases and Translation', 'Review and Recall', 'Mixed Practice']],
  french:      ['Grade 4', 'College', ['Vocabulary', 'Phrases and Translation', 'Review and Recall', 'Mixed Practice']],
  german:      ['Grade 5', 'College', ['Vocabulary', 'Phrases and Translation', 'Review and Recall', 'Mixed Practice']],
  esl:         ['Grade 4', 'College', ['Core Practice', 'Review and Recall', 'Mixed Practice']],

  /* ------------------------- computer science ------------------------- */
  programming: ['Grade 6', 'College', [
    ['Reading Code', [0, 1, 2, 3]], 'Core Practice', 'Review and Recall', 'Mixed Practice']],
  algorithms:  ['Grade 8', 'College', ['Core Practice', 'Review and Recall', 'Mixed Practice']],
  data:        ['Grade 6', 'College', ['Core Practice', 'Review and Recall', 'Mixed Practice']],

  /* ---------------------------- study skills ---------------------------- */
  notes:       ['Grade 6', 'College', ['Core Practice', 'Review and Recall', 'Mixed Practice']],
  revision:    ['Grade 6', 'College', ['Core Practice', 'Review and Recall', 'Mixed Practice']],
  exams:       ['Grade 6', 'College', ['Core Practice', 'Review and Recall', 'Mixed Practice']],

  /* ------------------------ beyond the core subjects ------------------------ */
  nutrition:   ['Grade 4', 'College', ['Core Practice', 'Review and Recall', 'Applied Questions', 'Mixed Practice']],
  anatomy:     ['Grade 6', 'College', ['Core Practice', 'Review and Recall', 'Mixed Practice']],
  fitness:     ['Grade 5', 'College', ['Core Practice', 'Review and Recall', 'Mixed Practice']],
  finance:     ['Grade 6', 'College', [
    ['Calculations', [0, 1, 8]], 'Core Practice', 'Budgeting and Borrowing', 'Mixed Practice']],
  accounting:  ['Grade 9', 'College', ['Core Practice', 'Review and Recall', 'Mixed Practice']],
  marketing:   ['Grade 8', 'College', ['Core Practice', 'Review and Recall', 'Mixed Practice']],
  psychology:  ['Grade 9', 'College', ['Core Practice', 'Review and Recall', 'Research Methods', 'Mixed Practice']],
  sociology:   ['Grade 9', 'College', ['Core Practice', 'Review and Recall', 'Mixed Practice']],
  philosophy:  ['Grade 9', 'College', ['Core Practice', 'Argument and Fallacies', 'Ethics', 'Mixed Practice']],
  religions:   ['Grade 5', 'College', ['Core Practice', 'Review and Recall', 'Mixed Practice']],
  design:      ['Grade 5', 'College', ['Core Practice', 'The Design Process', 'Materials', 'Mixed Practice']],
  electronics: ['Grade 7', 'College', [
    ['Ohm’s Law Calculations', [4, 5]], 'Core Practice', 'Components', 'Mixed Practice']],
  robotics:    ['Grade 6', 'College', ['Core Practice', 'Sensors and Control', 'Mixed Practice']],
  climate:     ['Grade 4', 'College', ['Core Practice', 'Energy and Emissions', 'Review and Recall', 'Mixed Practice']],
  conservation:['Grade 4', 'College', ['Core Practice', 'Ecosystems', 'Mixed Practice']],
  media:       ['Grade 6', 'College', ['Core Practice', 'Reading the News', 'Film Language', 'Mixed Practice']],
  measurement: ['Grade 2', 'Grade 9', [
    ['Converting Units', [0, 1, 2, 3]], 'Core Practice', 'Applied Questions', 'Mixed Practice']],
  discrete:    ['Grade 9', 'College', ['Core Practice', 'Counting and Arrangements', 'Mixed Practice']],
  web:         ['Grade 7', 'College', ['Core Practice', 'HTML and CSS', 'Mixed Practice']],
  cyber:       ['Grade 6', 'College', ['Core Practice', 'Staying Safe Online', 'Mixed Practice']],
  drama:       ['Grade 4', 'Grade 12', ['Core Practice', 'Staging and Performance', 'Mixed Practice']],

  /* -------------------------------- arts -------------------------------- */
  'art-history':  ['Grade 6', 'College', ['Core Practice', 'Review and Recall', 'Mixed Practice']],
  'music-theory': ['Grade 4', 'Grade 12', ['Core Practice', 'Review and Recall', 'Mixed Practice']]
};

const TOPIC_SUBJECT = {
  arithmetic: 'math', fractions: 'math', decimals: 'math', percentages: 'math', algebra: 'math',
  geometry: 'math', trigonometry: 'math', statistics: 'math', calculus: 'math',
  biology: 'science', chemistry: 'science', physics: 'science', earth: 'science', astronomy: 'science',
  grammar: 'ela', vocabulary: 'ela', spelling: 'ela', reading: 'ela', writing: 'ela', literature: 'ela',
  history: 'social', geography: 'social', civics: 'social', economics: 'social',
  spanish: 'languages', french: 'languages', german: 'languages', esl: 'languages',
  programming: 'cs', algorithms: 'cs', data: 'cs',
  notes: 'study', revision: 'study', exams: 'study',
  'art-history': 'arts', 'music-theory': 'arts', drama: 'arts',
  measurement: 'math', discrete: 'math',
  web: 'cs', cyber: 'cs',
  nutrition: 'health', anatomy: 'health', fitness: 'health',
  finance: 'business', accounting: 'business', marketing: 'business',
  design: 'engineering', electronics: 'engineering', robotics: 'engineering',
  climate: 'environment', conservation: 'environment',
  psychology: 'mind', sociology: 'mind',
  philosophy: 'humanities', religions: 'humanities',
  media: 'media'
};

const VARIANTS_PER_LEVEL = 4;

/* Difficulty rises with how far through a topic's own range the level sits. */
function difficultyFor(pos, total, variant) {
  const p = total <= 1 ? 0.5 : pos / (total - 1);
  const bumped = p + (variant - 1) * 0.06;
  return bumped < 0.34 ? 'easy' : bumped < 0.72 ? 'medium' : 'hard';
}
const tierOf = d => d === 'easy' ? 1 : d === 'medium' ? 2 : 3;

function questionCount(level, difficulty) {
  const i = idx(level);
  if (i <= 1) return 6;                       // Pre-K and Kindergarten
  if (i <= 6) return difficulty === 'easy' ? 8 : 10;
  return difficulty === 'hard' ? 14 : 12;
}

const SUMMARY = (focus, topicName, level) =>
  `${focus} at ${level} level — ${topicName.toLowerCase()} practice you can work through online or print.`;

const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/* Question types a topic can produce, sampled once per topic at load. */
const typeCache = {};
function typesFor(topic) {
  if (typeCache[topic]) return typeCache[topic];
  const gens = GENERATORS[topic] ?? [];
  const seen = new Set();
  for (let i = 0; i < gens.length; i++) {
    try {
      const q = gens[i](rngFor(topic, i), 2);
      if (q?.type) seen.add(q.type);
    } catch { /* a generator that rejects this seed contributes nothing */ }
  }
  return (typeCache[topic] = [...seen]);
}
const rngFor = (topic, i) => {
  const seed = seedFrom(`${topic}:type:${i}`);
  let a = seed >>> 0;
  return () => { a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
};

/**
 * Generators a focus has gated behind a minimum level, as {topic: {index: level}}.
 * Packs draw on the whole topic, so without this a Grade 6 revision booklet
 * happily served up quadratic discriminants.
 */
const GATES = (() => {
  const out = {};
  for (const [topic, [, , focuses]] of Object.entries(PLAN)) {
    for (const entry of focuses) {
      if (!Array.isArray(entry) || !entry[2]) continue;
      out[topic] ??= {};
      for (const i of entry[1]) {
        const existing = out[topic][i];
        /* If several focuses gate the same generator, the lowest gate wins —
           it is evidently acceptable at that level. */
        if (existing === undefined || idx(entry[2]) < idx(existing)) out[topic][i] = entry[2];
      }
    }
  }
  return out;
})();

/** Generator indexes usable for a topic at a given level. */
function allowedAt(topic, level) {
  const all = GENERATORS[topic] ?? [];
  const gates = GATES[topic] ?? {};
  return all.map((_, i) => i).filter(i => !gates[i] || idx(level) >= idx(gates[i]));
}

/**
 * A blueprint holds only what cannot be derived — eight numbers and two
 * references — and computes its id, title, summary and seed the first time
 * anything asks. At a few thousand worksheets an object literal per sheet was
 * fine; at tens of thousands it is half a second of parsing and megabytes of
 * strings nobody has looked at yet.
 */
class Blueprint {
  constructor(topic, levelIdx, focus, only, pages, difficulty, count, set) {
    this.topic = topic;
    this._level = levelIdx;
    this._focus = focus;
    this.only = only;
    this.pages = pages;
    this.difficulty = difficulty;
    this.count = count;
    this._set = set;               // 0 for the first, 1+ for "Set B", "Set C"…
  }

  get level()   { return LEVELS[this._level].level; }
  get grade()   { return LEVELS[this._level].grade; }
  get band()    { return GRADE_BAND[this.grade] ?? 'mid'; }
  get subject() { return TOPIC_SUBJECT[this.topic]; }
  get types()   { return typesFor(this.topic); }
  get minutes() { return Math.max(6, Math.round(this.count * 1.4)); }
  get generated() { return true; }
  get printable() { return true; }
  get online()    { return true; }
  get featured()  { return false; }
  get autoMarked() { return Math.max(1, this.count - 1); }

  get title() {
    return this._set ? `${this._focus} — Set ${setLabel(this._set)}` : this._focus;
  }

  get id() {
    return `${this.topic}-${slug(this.level)}-${slug(this._focus)}` +
           (this._set ? `-set-${setLabel(this._set).toLowerCase()}` : '');
  }

  get seed() { return seedFrom(this.id); }

  get summary() {
    const topicName = this.topic.replace(/-/g, ' ');
    if (this.pages > 1) {
      return `A ${this.pages}-page ${this._focus.toLowerCase()} covering ${topicName} at ` +
             `${this.level} level, with ${this.count} questions and an answer key.`;
    }
    return `${this._focus} at ${this.level} level — ${topicName} practice you can ` +
           `work through online or print.`;
  }
}

/* Set labels run A…Z then AA, AB… like spreadsheet columns, so a topic can
   carry more than twenty-six sets without the naming falling over. */
function setLabel(n) {
  let out = '', i = n;
  do { out = String.fromCharCode(65 + (i % 26)) + out; i = Math.floor(i / 26) - 1; } while (i >= 0);
  return out;
}
const GRADE_BAND = Object.fromEntries(GRADES.map(g => [g.id, g.band]));

/** Expand the plan into blueprints. */

/* How many differently-seeded sets a topic can carry without repeating itself.
   A procedural topic composes fresh numbers every time; a bank topic would
   just deal the same cards again, so it gets one set only. */
/* Sets are allocated in proportion to measured variety: a topic that can
   compose fresh questions carries many, one that deals from a small fixed bank
   carries one, because re-dealing the same items is padding, not content. */
const SETS_PER_VARIETY = 8;
const MAX_SETS = 34;
const setsFor = topic =>
  Math.max(1, Math.min(MAX_SETS, (VARIETY[topic] ?? 0) * SETS_PER_VARIETY));

/* Single sheets come in a few lengths, and packs run to four printed pages.
   35 questions is the longest single assignment most teachers set at once. */
const PACK_SHAPES = [
  [2, 15, 'Practice Pack'],
  [2, 20, 'Extended Practice'],
  [3, 25, 'Problem Set'],
  [3, 30, 'Consolidation Pack'],
  [4, 35, 'Revision Booklet'],
  [4, 40, 'Full Review']
];

export function buildBlueprints() {
  const out = [];
  const seenIds = new Set();
  const push = bp => { const id = bp.id; if (!seenIds.has(id)) { seenIds.add(id); out.push(bp); } };

  for (const [topic, [from, to, focuses]] of Object.entries(PLAN)) {
    const start = idx(from), end = idx(to);
    if (start === undefined || end === undefined) continue;
    const levels = LEVELS.slice(start, end + 1);
    const sets = setsFor(topic);

    levels.forEach((lv, pos) => {
      for (let v = 0; v < VARIANTS_PER_LEVEL; v++) {
        const entry = focuses[(pos * VARIANTS_PER_LEVEL + v) % focuses.length];
        const focus = Array.isArray(entry) ? entry[0] : entry;
        const only = Array.isArray(entry) ? entry[1] : null;
        const minLevel = Array.isArray(entry) ? entry[2] : null;
        if (minLevel && idx(lv.level) < idx(minLevel)) continue;

        const difficulty = difficultyFor(pos, levels.length, v);
        const pool = only?.length || (GENERATORS[topic] ?? []).length;
        const count = Math.min(questionCount(lv.level, difficulty), Math.max(6, pool * 2));

        for (let set = 0; set < sets; set++) {
          push(new Blueprint(topic, start + pos, focus, only, 1, difficulty, count, set));
        }
      }

      /* Packs: the same topic and level, several pages long. */
      if (!PROCEDURAL.has(topic) || idx(lv.level) < idx('Grade 2')) return;
      const usable = allowedAt(topic, lv.level);
      const difficulty = difficultyFor(pos, levels.length, 1);
      for (const [pages, count, label] of PACK_SHAPES) {
        if (pages >= 3 && idx(lv.level) < idx('Grade 4')) continue;
        if (pages === 4 && idx(lv.level) < idx('Grade 5')) continue;
        for (let set = 0; set < Math.min(sets, 6); set++) {
          push(new Blueprint(topic, start + pos, label, usable, pages, difficulty, count, set));
        }
      }
    });
  }
  return out;
}

/** Materialise the questions for one blueprint. Same blueprint, same sheet. */
export function generateQuestions(blueprint) {
  const all = GENERATORS[blueprint.topic] ?? [];
  if (!all.length) return [];
  /* A focused worksheet draws only from the generators that match its title. */
  const chosen = blueprint.only?.length
    ? blueprint.only.map(i => all[i]).filter(Boolean)
    : all;
  const gens = chosen.length ? chosen : all;
  const tier = tierOf(blueprint.difficulty);
  return build(blueprint.seed, blueprint.count, gens.map(g => r => g(r, tier)));
}
