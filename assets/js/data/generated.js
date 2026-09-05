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
import { UNITS } from './units.js';
import { STANDARDS } from './standards.js';
import { unitGenerators, unitCapacity, capacityOf } from './unit-engine.js';

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

/* Memoised: an id is built from a level and a focus, and there are a few
   hundred distinct values of each across a hundred thousand worksheets. */
const slugCache = new Map();
const slug = s => {
  let v = slugCache.get(s);
  if (v === undefined) {
    v = s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    slugCache.set(s, v);
  }
  return v;
};

const TOPIC_SUBJECT = {
  phonics: 'foundation', earlynumber: 'foundation', shapescolour: 'foundation',
  worldaround: 'foundation', readiness: 'foundation',
  careers: 'life', safety: 'life', household: 'life', communication: 'life',
  method: 'science', cultures: 'social', italian: 'languages', mandarin: 'languages',
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

/* ------------------------------- micro-units -------------------------------
   Every curriculum unit becomes its own family of worksheets, with its own
   question makers drawing on its own item bank. This is what lets a worksheet
   be called "Photosynthesis" and actually be about photosynthesis, instead of
   "Science — Core Practice". */
export const UNIT_GENERATORS = {};
export const UNIT_META = {};

/* Terms from elsewhere, for the sorting questions. `far` is a different
   subject entirely and `near` a different topic in the same one, because
   telling a biology term from a chemistry one is a warm-up and telling it from
   a neighbouring biology unit is not. */
const TERMS_BY_TOPIC = {};
for (const [topic, units] of Object.entries(UNITS)) {
  TERMS_BY_TOPIC[topic] = units.flatMap(u => (u.facts ?? []).map(f => f[0]));
}

function foreignFor(topic) {
  const subject = TOPIC_SUBJECT[topic];
  const near = [], far = [];
  for (const [other, terms] of Object.entries(TERMS_BY_TOPIC)) {
    if (other === topic) continue;
    (TOPIC_SUBJECT[other] === subject ? near : far).push(...terms.slice(0, 6));
  }
  /* A bounded, deterministic slice: the whole library's vocabulary would be
     tens of thousands of strings held for one question shape. */
  return { near: near.slice(0, 90), far: far.slice(0, 90) };
}

/**
 * Worksheet formats. A unit is not one worksheet repeated: a matching
 * activity, a cloze exercise, a misconception check and a written response are
 * different sheets a teacher prints for different lessons, and each is built
 * by restricting which question makers may run.
 *
 * `only` names makers by id. `tier` raises the difficulty floor, so an
 * exam-style paper is genuinely harder than a starter and not just longer.
 */
export const UNIT_FORMATS = [
  { id: 'quiz',      label: null,                   only: null, weight: 1 },
  { id: 'vocab',     label: 'Vocabulary Check',     only: ['term-from-meaning', 'meaning-from-term', 'match-term-meaning'] },
  { id: 'define',    label: 'Definitions Drill',    only: ['recall-term', 'recall-hinted', 'define'], tier: 2 },
  { id: 'match',     label: 'Matching Activity',    only: ['match-term-meaning', 'match-meaning-term'] },
  { id: 'cloze',     label: 'Cloze Exercise',       only: ['cloze', 'recall-hinted'], tier: 2 },
  { id: 'truefalse', label: 'True or False',        only: ['pick-truth', 'pick-myth', 'audit-2', 'audit-3'] },
  { id: 'myths',     label: 'Misconception Check',  only: ['pick-myth', 'audit-2', 'correct-the-error'], tier: 2 },
  { id: 'sorting',   label: 'Odd One Out',          only: ['odd-one-out', 'belongs'] },
  { id: 'retrieval', label: 'Retrieval Practice',   only: ['recall-term', 'cloze', 'term-from-meaning', 'pick-truth'], tier: 2 },
  { id: 'starter',   label: 'Starter Activity',     only: ['term-from-meaning', 'meaning-from-term', 'match-term-meaning'], short: true },
  { id: 'written',   label: 'Written Response',     only: ['define', 'explain', 'correct-the-error'], tier: 3 },
  { id: 'exam',      label: 'Exam-Style Questions', only: null, tier: 3 },
  { id: 'homework',  label: 'Homework Sheet',       only: null },
  { id: 'mixed',     label: 'Mixed Practice',       only: null },
  { id: 'practice',  label: 'Practice Sheet',       only: ['count-objects', 'count-choose', 'what-comes-next', 'what-came-before', 'one-more', 'one-less', 'number-word', 'bigger-number', 'add-pictures', 'add-numbers', 'take-away', 'number-bond', 'doubles', 'skip-count', 'first-letter', 'last-letter', 'count-letters', 'shape-sides', 'shape-from-sides'] },
  { id: 'counting',  label: 'Counting and Writing',  only: ['count-objects', 'count-choose', 'count-letters', 'what-comes-next', 'what-came-before'] },
  { id: 'numberwork', label: 'Number Work',          only: ['add-pictures', 'add-numbers', 'take-away', 'number-bond', 'doubles', 'one-more', 'one-less'] },
  { id: 'sequence',  label: 'Sequencing Activity',  only: ['sequence'] },
  { id: 'applied',   label: 'Applied Questions',    only: ['apply'] },
  { id: 'diagram',   label: 'Label the Diagram',    only: ['label-diagram'] },
  { id: 'annotated', label: 'Annotated Diagram',    only: ['label-diagram', 'term-from-meaning', 'meaning-from-term', 'cloze'] }
];

/** Makers a format may use for a unit, or null if the unit cannot fill it. */
export function makersFor(unitKey, formatId) {
  const gens = UNIT_GENERATORS[unitKey] ?? [];
  const format = UNIT_FORMATS.find(f => f.id === formatId);
  if (!format) return null;
  if (!format.only) return gens;
  const kept = gens.filter(g => format.only.includes(g.id));
  return kept.length ? kept : null;
}

for (const [topic, units] of Object.entries(UNITS)) {
  const foreign = foreignFor(topic);
  for (const unit of units) {
    const key = `${topic}::${slug(unit.name)}`;
    const gens = unitGenerators(unit, foreign);
    if (!gens.length) continue;
    UNIT_GENERATORS[key] = gens;
    UNIT_META[key] = {
      key, topic, name: unit.name, from: unit.from, to: unit.to,
      unit,
      capacity: unitCapacity(unit, gens),
      formatCapacity: Object.fromEntries(UNIT_FORMATS.map(f => [f.id,
        (f.only ? gens.filter(g => f.only.includes(g.id)) : gens)
          .reduce((n, g) => n + capacityOf(unit, g.id, g), 0)])),
      kinds: new Set(gens.map(g => g.kind)),
      ids: new Set(gens.map(g => g.id)),
      /* What this unit is actually about, for search. A worksheet's title and
         summary name the unit — "Cell Structure and Function" — and say nothing
         about osmosis, ribosomes or active transport, which is what somebody
         is far more likely to type. The question text would carry it, but that
         only exists once a sheet has been opened, so searching for a term
         found only inside the questions returned nothing at all. One string per
         unit, built once, shared by every family that uses it. */
      keywords: [
        unit.name,
        ...(unit.facts ?? []).flatMap(f => f),
        ...(unit.truths ?? []),
        ...(unit.myths ?? []),
        ...(unit.sequences ?? []).map(sq => sq[0]),
        ...(unit.applications ?? []).map(a => a[1])
      ].join(' ').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    };
  }
}

/**
 * How much genuinely different content a topic can produce, measured rather
 * than declared. A generator counts only if changing the seed changes the
 * question itself — shuffling the options of a fixed item is not new content,
 * and an earlier hand-written list of "procedural" topics got this wrong,
 * giving Business & Finance more worksheets than Science.
 */
export const VARIED_GENS = {};
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
      if (seen.size > 1) { varied++; (VARIED_GENS[topic] ??= new Set()).add(i); }
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
  biology:     ['Grade 6', 'College', [
    ['Cells and Organelles', [3, 4, 15, 18]], ['Photosynthesis and Plants', [7, 12, 13, 20]],
    ['The Human Body', [6, 9, 10, 21]], ['Food Chains and Habitats', [0, 1, 8, 14, 17]],
    ['Genetics and Evolution', [5, 11, 2]], ['Classification and Life Cycles', [16, 19, 2, 17]],
    'Mixed Practice']],
  chemistry:   ['Grade 7', 'College', [
    ['Elements and the Periodic Table', [0, 1, 2, 3, 13]], ['Atoms and Bonding', [6, 7, 9, 17]],
    ['Balancing Equations', [4, 11, 12, 14, 18]], ['Reactions and Acids', [5, 8, 15, 16]],
    ['States of Matter', [10, 17, 16]], 'Mixed Practice']],
  physics:     ['Grade 7', 'College', [
    ['Calculations', [0, 1, 2, 3]], ['Forces and Movement', [0, 1, 2]],
    ['Energy Calculations', [1, 3]], ['Waves and Light', [2, 3]], 'Mixed Practice']],
  earth:       ['Grade 4', 'Grade 10', [
    ['Rocks and Fossils', [0, 8, 9]], ['Plate Tectonics and Earthquakes', [1, 5, 6, 2]],
    ['The Water Cycle and Weather', [4, 7, 3]], 'Mixed Practice']],
  astronomy:   ['Grade 4', 'Grade 12', [
    ['Planets and Orbits', [0, 2, 6, 7]], ['Stars and Distances', [1, 4, 5]],
    ['The Moon, Gravity and Seasons', [3, 8, 2]], 'Mixed Practice']],

  /* -------------------------------- ELA -------------------------------- */
  grammar:     ['Grade 2', 'Grade 10', [
    ['Word Classes', [0, 5, 6, 12, 16, 18, 19]], ['Plurals and Verb Forms', [1, 2, 3, 4, 10, 14, 15, 17]],
    ['Punctuation Practice', [7, 8, 21]], ['Homophones and Common Errors', [9, 21, 8]],
    ['Sentences and Voice', [11, 13, 20]], 'Mixed Practice']],
  vocabulary:  ['Grade 4', 'Grade 12', [
    ['Synonyms and Antonyms', [1, 2, 7, 9, 13]], ['Words in Context', [10, 11, 12, 18]],
    ['Word Roots and Prefixes', [5, 6, 15, 16, 17]],
    ['Definitions and Meaning', [0, 3, 4, 8, 14]], 'Mixed Practice']],
  spelling:    ['Grade 1', 'Grade 8', [
    ['Common Misspellings', [0, 1, 3, 4, 5, 6, 7, 8, 11]], ['Suffix Rules', [9, 10]],
    ['Spot the Correct Spelling', [2, 12, 0]], 'Mixed Practice']],
  reading:     ['Grade 5', 'Grade 12', [
    ['Comprehension Skills', [0, 1, 5, 7]], ['Reading Strategies', [2, 6, 3]],
    ['Bias and Sources', [3, 4, 7]], 'Mixed Practice']],
  writing:     ['Grade 6', 'College', [
    ['Building an Argument', [0, 1, 2, 6]], ['Narrative Craft', [3, 7]],
    ['The Writing Process', [4, 5, 1]], 'Mixed Practice']],
  literature:  ['Grade 6', 'College', [
    ['Figurative Language', [0, 1, 7, 8]], ['Narrative and Plot', [5, 6, 9]],
    ['Themes, Mood and Analysis', [3, 4, 10, 2]], 'Mixed Practice']],

  /* --------------------------- social studies --------------------------- */
  history:     ['Grade 6', 'College', [
    ['Rome: Republic and Empire', [4, 10, 15, 16]], ['Early Civilisations', [8, 11, 13, 14]],
    ['Medieval and Renaissance', [7, 9, 14, 2]], ['Revolutions and the Modern World', [1, 5, 6, 0]],
    ['Chronology and Timelines', [0, 2, 3, 12, 13]], ['Sources and Evidence', [14, 17, 3]],
    'Mixed Practice']],
  geography:   ['Grade 4', 'Grade 12', [
    ['Countries and Capitals', [0, 4, 2, 13, 15]], ['Continents and Oceans', [1, 3, 5, 11, 14]],
    ['Using Maps and Compasses', [6, 7, 12, 16]], ['Climate and Biomes', [8, 10, 12]],
    ['Rivers and Landforms', [9, 16, 17]], 'Mixed Practice']],
  civics:      ['Grade 6', 'College', [
    ['How Government Works', [0, 2, 6, 3]], ['Democracy and Voting', [1, 4, 5]],
    ['Rights and Responsibilities', [7, 8, 5]], 'Mixed Practice']],
  economics:   ['Grade 8', 'College', [
    ['Supply and Demand', [0, 1, 5, 7]], ['Elasticity and Choice', [2, 3, 6]],
    ['Inflation and the Economy', [4, 6, 8]], 'Mixed Practice']],

  /* ----------------------------- languages ----------------------------- */
  spanish:     ['Grade 4', 'College', [
    ['Everyday Words', [0, 4, 5, 6, 8, 9, 16]], ['Greetings and Phrases', [10, 11, 12, 13]],
    ['Verbs and Grammar', [7, 15, 3]], ['Articles and Gender', [17, 2]],
    ['Days and Numbers', [18, 14]], ['Translation Practice', [1, 10, 11]], 'Mixed Practice']],
  french:      ['Grade 4', 'College', [
    ['Everyday Words', [0, 4, 5, 6, 8, 9]], ['Greetings and Phrases', [10, 11, 12, 13]],
    ['Verbs and Grammar', [7, 15, 3]], ['Articles and Gender', [16, 2]],
    ['Days and Numbers', [17, 14]], ['Translation Practice', [1, 10, 11]], 'Mixed Practice']],
  german:      ['Grade 5', 'College', [
    ['Everyday Words', [0, 4, 5, 6, 8, 9]], ['Greetings and Phrases', [10, 11, 12, 13]],
    ['Verbs and Grammar', [7, 16, 3]], ['Articles and Cases', [15, 2]],
    ['Days and Numbers', [17, 14]], ['Translation Practice', [1, 10, 11]], 'Mixed Practice']],
  esl:         ['Grade 4', 'College', [
    ['Tenses and Verb Forms', [0, 4, 5, 6]], ['Prepositions and Articles', [1, 3, 2]],
    ['Everyday English', [7, 2, 1]], 'Mixed Practice']],

  /* ------------------------- computer science ------------------------- */
  programming: ['Grade 6', 'College', [
    ['Reading Code', [0, 1, 2, 3]], ['Loops and Ranges', [0, 1, 5, 10]],
    ['Functions and Data Structures', [6, 7, 8]], ['Operators and Expressions', [3, 4, 9]],
    ['Debugging', [5, 11, 9]], 'Mixed Practice']],
  algorithms:  ['Grade 8', 'College', [
    ['Search and Complexity', [1, 2, 3]], ['Sorting and Efficiency', [6, 4, 8]],
    ['Algorithm Basics', [0, 5, 7]], 'Mixed Practice']],
  data:        ['Grade 6', 'College', [
    ['Databases', [0, 3, 2]], ['Data Formats and Charts', [1, 4, 5]],
    ['Reading Data Critically', [6, 4, 5]], 'Mixed Practice']],

  /* ---------------------------- study skills ---------------------------- */
  notes:       ['Grade 6', 'College', [
    ['Taking Better Notes', [1, 0, 2]], ['Making Notes Useful', [3, 4, 0]], 'Mixed Practice']],
  revision:    ['Grade 6', 'College', [
    ['Effective Revision', [0, 2, 5]], ['Spacing and Interleaving', [1, 3, 4]], 'Mixed Practice']],
  exams:       ['Grade 6', 'College', [
    ['Command Words', [2, 4]], ['Exam Timing and Strategy', [0, 1, 3, 5]], 'Mixed Practice']],

  /* ------------------------ beyond the core subjects ------------------------ */
  nutrition:   ['Grade 4', 'College', [
    ['Nutrients and Their Jobs', [0, 1, 4, 6, 9]], ['Vitamins and Minerals', [2, 4, 6]],
    ['A Balanced Diet', [3, 5, 10, 11]], ['Food Labels and Calculations', [7, 8, 11]],
    'Mixed Practice']],
  anatomy:     ['Grade 6', 'College', [
    ['Organs and Systems', [0, 1, 2, 6, 11]], ['The Heart and Circulation', [3, 9, 12, 13]],
    ['Breathing and the Lungs', [4, 10]], ['Bones, Muscles and Joints', [7, 8, 5]],
    'Mixed Practice']],
  fitness:     ['Grade 5', 'College', [
    ['Fitness and Testing', [0, 2, 6]], ['Warming Up and Overload', [1, 3]],
    ['Heart Rate and Measurement', [4, 5]], 'Mixed Practice']],
  finance:     ['Grade 6', 'College', [
    ['Interest and Saving', [0, 4, 8]], ['Budgeting and Borrowing', [1, 2, 9]],
    ['Credit and Debt', [3, 7, 10]], ['Assets and Liabilities', [5, 6, 8]], 'Mixed Practice']],
  accounting:  ['Grade 9', 'College', [
    ['Balance Sheet Basics', [0, 2, 7]], ['Profit and Margins', [1, 5, 6]],
    ['Cash Flow and Depreciation', [3, 4, 8]], 'Mixed Practice']],
  marketing:   ['Grade 8', 'College', [
    ['The Four Ps', [0, 2, 5]], ['Researching a Market', [3, 4, 6]],
    ['Segmentation and Targeting', [1, 7, 8]], 'Mixed Practice']],
  psychology:  ['Grade 9', 'College', [
    ['Memory and Cognition', [0, 3, 7]], ['Learning and Development', [1, 5, 7]],
    ['Research Methods', [2, 4, 6, 8]], 'Mixed Practice']],
  sociology:   ['Grade 9', 'College', [
    ['Socialisation and Norms', [0, 1, 5]], ['Class and Social Mobility', [2, 4]],
    ['Sociological Research', [3, 6]], 'Mixed Practice']],
  philosophy:  ['Grade 9', 'College', [
    ['Argument and Fallacies', [0, 1, 2, 6, 7, 8]], ['Ethics', [3, 4]],
    ['What Can We Know?', [5, 0]], 'Mixed Practice']],
  religions:   ['Grade 5', 'College', [
    ['Beliefs and Sacred Texts', [0, 1, 6, 3]], ['Festivals and Practice', [2, 5, 4]],
    ['Places of Worship', [4, 6, 7]], 'Mixed Practice']],
  design:      ['Grade 5', 'College', [
    ['Designing and Iterating', [0, 3, 6]], ['Prototyping and Testing', [1, 8]],
    ['Choosing Materials', [7, 5]], ['Structures and Tolerance', [2, 4, 8]], 'Mixed Practice']],
  electronics: ['Grade 7', 'College', [
    ['Ohm’s Law Calculations', [4, 5]], ['Components and Symbols', [0, 1, 2, 7]],
    ['Series and Parallel Circuits', [3, 8]], ['Units and Measurement', [6, 4, 5]], 'Mixed Practice']],
  robotics:    ['Grade 6', 'College', [
    ['Sensing and Acting', [0, 1, 6]], ['Control Loops and Feedback', [2, 5, 7]],
    ['Programming a Robot', [4, 3]], 'Mixed Practice']],
  climate:     ['Grade 4', 'College', [
    ['Greenhouse Gases and Warming', [0, 1, 4, 9]], ['Energy and Emissions', [2, 3, 5, 7]],
    ['Deforestation and Biodiversity', [6, 8]], 'Mixed Practice']],
  conservation:['Grade 4', 'College', [
    ['Endangered and Invasive Species', [0, 1, 2]], ['Ecosystems and Habitats', [4, 5]],
    ['Conservation Strategies', [3, 6, 7]], 'Mixed Practice']],
  media:       ['Grade 6', 'College', [
    ['News and Sources', [0, 1, 2, 3, 8]], ['Film Language', [4, 5, 6, 7]],
    ['Bias and Framing', [0, 1, 8]], 'Mixed Practice']],
  measurement: ['Grade 2', 'Grade 9', [
    ['Converting Units', [0, 1, 2, 3]], ['Choosing the Right Unit', [5, 6, 7]],
    ['Speed, Distance and Time', [4, 3]], 'Mixed Practice']],
  discrete:    ['Grade 9', 'College', [
    ['Counting and Arrangements', [0, 1, 2, 7]], ['Sets and Notation', [3, 6]],
    ['Primes and Factors', [4, 5, 6]], 'Mixed Practice']],
  web:         ['Grade 7', 'College', [
    ['HTML and Structure', [0, 2, 6]], ['CSS and Styling', [1, 3, 6]],
    ['Accessibility and Good Practice', [4, 7]], ['URLs and the Web', [5, 3]], 'Mixed Practice']],
  cyber:       ['Grade 6', 'College', [
    ['Passwords and Accounts', [0, 2, 4]], ['Spotting a Phishing Email', [1, 6, 7]],
    ['Malware and Encryption', [3, 5]], 'Mixed Practice']],
  drama:       ['Grade 4', 'Grade 12', [
    ['Staging and Performance', [1, 2, 5]], ['Script and Text', [0, 3]],
    ['Theatre Conventions', [4, 6]], 'Mixed Practice']],

  /* -------------------------------- arts -------------------------------- */
  'art-history':  ['Grade 6', 'College', [
    ['Movements and Artists', [0, 1, 2, 3, 7]], ['Technique and Light', [4, 5, 8]],
    ['Colour Theory', [6, 8]], 'Mixed Practice']],
  'music-theory': ['Grade 4', 'Grade 12', [
    ['Rhythm and Time Signatures', [0, 1]], ['Pitch and Intervals', [2, 4]],
    ['Dynamics and Expression', [3, 5, 6]], ['Keys and Scales', [7, 5]], 'Mixed Practice']]
};



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
/**
 * A worksheet family: one topic or micro-unit, at one level, in one format.
 * Every sheet in a family shares every attribute the library can filter on —
 * subject, level, difficulty, length, question types — and differs only in
 * which items its seed deals. So the catalogue stores families, not sheets:
 * twenty-four thousand small objects instead of six hundred thousand, which is
 * the difference between a page that loads and a page that does not.
 *
 * `sets` is how many sheets the family holds. `at(n)` produces the nth.
 */
class Blueprint {
  constructor(topic, levelIdx, focus, only, pages, difficulty, count, set, unit = null, format = null) {
    this.topic = topic;
    this._level = levelIdx;
    this._focus = focus;
    this.only = only;
    this.pages = pages;
    this.difficulty = difficulty;
    this.count = count;
    this._set = set;               // 0 for the first, 1+ for "Set B", "Set C"…
    this.unit = unit;              // a micro-unit key, or null for a topic-wide sheet
    this.format = format;          // which worksheet format, for unit sheets
    this.sets = 1;                 // how many sheets this family holds
  }

  /** The nth sheet of this family. Same class, one field different. */
  at(n) {
    if (n === this._set) return this;
    const bp = new Blueprint(this.topic, this._level, this._focus, this.only, this.pages,
                             this.difficulty, this.count, n, this.unit, this.format);
    bp.sets = 1;
    return bp;
  }

  get level()   { return LEVELS[this._level].level; }
  get grade()   { return LEVELS[this._level].grade; }
  get band()    { return GRADE_BAND[this.grade] ?? 'mid'; }
  get subject() { return TOPIC_SUBJECT[this.topic]; }
  get framework() { return STANDARDS[this.topic]?.framework ?? null; }
  get types()   {
    return this.unit ? unitTypes(this.unit, this.format, tierOf(this.difficulty))
                     : typesFor(this.topic);
  }
  get minutes() { return Math.max(6, Math.round(this.count * 1.4)); }
  get generated() { return true; }
  get printable() { return true; }
  get online()    { return true; }
  get featured()  { return false; }
  /* How many questions the app can mark itself. Guessing "all but one" was
     close enough when every sheet drew on a bank that included a written
     prompt; a micro-unit quiz has none, and reported 11 of 12 before a single
     answer. The question types are already known without building the sheet. */
  get autoMarked() {
    return this.types.includes('written') ? Math.max(1, this.count - 1) : this.count;
  }

  /* The name a teacher would write on the sheet. Set 0 keeps the family name;
     later sets take another name for the same kind of sheet, because "Set B"
     next to "Set C" is not a distinction anyone can act on. */
  get title() {
    if (!this._set) return this._focus;
    const cut = this._focus.lastIndexOf(' — ');
    const base = cut > 0 ? this._focus.slice(0, cut) : this._focus;
    const label = cut > 0 ? this._focus.slice(cut + 3) : 'Quick Quiz';
    return `${base} — ${setName(label, this._set)}`;
  }

  /** The id of the family's first sheet: every id in the family plus a suffix. */
  get baseId() {
    return `${this.topic}-${slug(this.level)}-${slug(this._focus)}`;
  }

  get id() {
    return this.baseId + (this._set ? `-set-${setLabel(this._set).toLowerCase()}` : '');
  }

  get seed() { return seedFrom(this.id); }

  get summary() {
    const topicName = this.topic.replace(/-/g, ' ');
    if (this.unit) {
      const meta = UNIT_META[this.unit];
      const what = FORMAT_BLURB[this.format] ?? 'A quiz';
      const pages = this.pages > 1 ? ` Printed over ${this.pages} pages.` : '';
      /* Unit names are title-cased and stay that way. Lower-casing the first
         letter turned "Cell Structure and Function" into "cell Structure and
         Function", which reads like a typo because it is one. */
      return `${what} on ${meta?.name ?? topicName} for ${this.level}, ` +
             `with ${this.count} questions and a separate answer key.${pages}`;
    }
    if (this.pages > 1) {
      return `A ${this.pages}-page ${this._focus.toLowerCase()} covering ${topicName} at ` +
             `${this.level} level, with ${this.count} questions and an answer key.`;
    }
    return `${this._focus} at ${this.level} level — ${topicName} practice you can ` +
           `work through online or print.`;
  }
}

/* ------------------------------- set names -------------------------------
   Sets are the same unit at the same level with different questions drawn from
   the bank. Numbering them "Set B", "Set C" … was accurate and useless: a
   shelf of worksheets whose names differ by one letter tells a teacher nothing
   and reads as filler. Each set now takes a name a teacher would actually
   write on a sheet, from a pool per format. Ids still use the letter — they
   have to stay stable — but nobody sees them. */
const SET_NAMES = {
  'Quick Quiz': ['Quick Quiz', 'Knowledge Check', 'Topic Quiz', 'Recall Quiz', 'Lesson Quiz',
    'Ten-Minute Quiz', 'Class Quiz', 'Rapid Check', 'Low-Stakes Quiz', 'Do Now Quiz',
    'Bell-Ringer Quiz', 'End-of-Lesson Quiz', 'Pop Quiz', 'Confidence Check'],
  'Vocabulary Check': ['Vocabulary Check', 'Key Terms Check', 'Word Bank Check', 'Terminology Quiz',
    'Glossary Check', 'Key Vocabulary Review', 'Term Recognition', 'Language of the Unit',
    'Subject Vocabulary', 'Word Work', 'Terminology Audit', 'Key Words Recall'],
  'Definitions Drill': ['Definitions Drill', 'Define the Term', 'Unaided Recall', 'Say What It Means',
    'Definition Practice', 'Term to Meaning', 'Closed-Book Definitions', 'Meaning Recall',
    'Definitions Under Pressure', 'Explain the Term', 'Precise Definitions'],
  'Matching Activity': ['Matching Activity', 'Pair Them Up', 'Term and Meaning Match', 'Link the Pairs',
    'Match and Check', 'Connect the Terms', 'Sorting and Matching', 'Find the Partner',
    'Two-Column Match', 'Card Sort'],
  'Cloze Exercise': ['Cloze Exercise', 'Fill the Gaps', 'Missing Word Practice', 'Complete the Statement',
    'Gap Fill', 'Sentence Completion', 'Blanked Statements', 'Fill in the Missing Term',
    'Close Reading Gaps', 'Supply the Word'],
  'True or False': ['True or False', 'Fact or Fiction', 'Right or Wrong', 'Statement Audit',
    'Agree or Disagree', 'True, False, Explain', 'Verify the Claim', 'Claim Check',
    'Sort the Statements', 'Judgement Check'],
  'Misconception Check': ['Misconception Check', 'Spot the Error', 'Common Mistakes', 'Myth Buster',
    'What Went Wrong', 'Find the Fault', 'Correct the Claim', 'Error Analysis',
    'Diagnose the Mistake', 'Frequent Errors Check', 'Put It Right'],
  'Odd One Out': ['Odd One Out', 'Which Does Not Belong', 'Sort and Justify', 'Group and Explain',
    'Belongs or Not', 'Classification Check', 'Find the Intruder', 'Categorise It',
    'In or Out', 'Sorting Challenge'],
  'Retrieval Practice': ['Retrieval Practice', 'Brain Dump', 'No-Notes Recall', 'Last Lesson, Last Week',
    'Cold Recall', 'Retrieval Starter', 'Memory Check', 'Recall Without Prompts',
    'Spaced Retrieval', 'Free Recall'],
  'Starter Activity': ['Starter Activity', 'Do Now', 'Bell Work', 'Five-Minute Starter',
    'Settler', 'Entry Task', 'Warm-Up', 'Quick Start', 'Opening Task', 'First Five'],
  'Written Response': ['Written Response', 'Extended Writing', 'Explain in Full', 'Long Answer Practice',
    'Structured Response', 'Write It Out', 'Explanation Task', 'Six-Mark Practice',
    'Justify Your Answer', 'Discursive Response'],
  'Exam-Style Questions': ['Exam-Style Questions', 'Exam Practice', 'Past-Paper Style', 'Assessment Practice',
    'Mock Questions', 'Exam Preparation', 'Test Conditions', 'Graded Questions',
    'Formal Assessment', 'Paper-Style Practice', 'Timed Questions'],
  'Homework Sheet': ['Homework Sheet', 'Take-Home Practice', 'Independent Work', 'Prep Sheet',
    'Home Learning', 'Overnight Practice', 'Set Work', 'Study Sheet',
    'Practice at Home', 'Weekly Homework'],
  'Mixed Practice': ['Mixed Practice', 'Interleaved Practice', 'Everything So Far', 'Mixed Review',
    'Full Range Practice', 'All Question Types', 'Varied Practice', 'Combined Review',
    'Whole-Unit Mix', 'Broad Practice'],
  'Practice Sheet': ['Practice Sheet', 'Skills Practice', 'Drill Sheet', 'Fluency Practice',
    'Routine Practice', 'Repetition Set', 'Method Practice', 'Guided Practice',
    'Independent Practice', 'Daily Practice'],
  'Counting and Writing': ['Counting and Writing', 'Count and Write', 'Number Formation', 'Counting Practice',
    'How Many?', 'Count the Objects', 'Writing Numbers', 'Counting Fun',
    'Numbers to Write', 'Count Together'],
  'Number Work': ['Number Work', 'Adding and Taking Away', 'Number Bonds Practice', 'Sums Practice',
    'Number Facts', 'Add and Subtract', 'Number Games', 'Working with Numbers',
    'Calculation Practice', 'Number Skills'],
  'Sequencing Activity': ['Sequencing Activity', 'Put It in Order', 'Order the Steps', 'Sequence Check',
    'What Comes First', 'Ordering Task', 'Step Order', 'Arrange in Sequence',
    'Timeline Task', 'Correct Order'],
  'Label the Diagram': ['Label the Diagram', 'Diagram Practice', 'Name the Parts', 'Labelling Task',
    'Annotate the Figure', 'Identify the Parts', 'Diagram Check', 'Parts and Labels',
    'Anatomy of the Diagram', 'Figure Recall'],
  'Annotated Diagram': ['Annotated Diagram', 'Diagram and Terms', 'Figure with Vocabulary',
    'Labelled Notes', 'Diagram Study Sheet', 'Annotate and Explain', 'Visual Glossary',
    'Diagram Workbook'],
  'Applied Questions': ['Applied Questions', 'Apply It', 'In Context', 'Transfer Task',
    'Real Situations', 'Use What You Know', 'Applied Problems', 'New Contexts',
    'Problem Solving', 'Beyond the Textbook'],
  'Extended Practice': ['Extended Practice', 'Longer Practice', 'Deep Practice', 'Extended Set',
    'Sustained Practice', 'Long-Form Practice', 'Full Session', 'Double Lesson Set'],
  /* multi-page packs */
  'Practice Pack': ['Practice Pack', 'Two-Page Practice', 'Practice Bundle', 'Paired Sheets'],
  'Problem Set': ['Problem Set', 'Question Bank', 'Problem Bundle', 'Set of Problems'],
  'Consolidation Pack': ['Consolidation Pack', 'Bringing It Together', 'Consolidation Set', 'Secure the Learning'],
  'Revision Booklet': ['Revision Booklet', 'Revision Pack', 'Study Booklet', 'Review Booklet'],
  'Full Review': ['Full Review', 'Complete Review', 'Whole-Unit Review', 'Comprehensive Review'],
  'Half-Term Review': ['Half-Term Review', 'Mid-Unit Review', 'Term Review', 'Progress Review'],
  'Topic Mastery Pack': ['Topic Mastery Pack', 'Mastery Set', 'Master the Topic', 'Mastery Bundle'],
  'End-of-Unit Booklet': ['End-of-Unit Booklet', 'Unit Finale', 'Closing Booklet', 'End-of-Unit Review'],
  'Complete Revision Booklet': ['Complete Revision Booklet', 'Everything Booklet', 'Full Revision Pack', 'The Whole Unit'],
  'Revision Pack': ['Revision Pack', 'Revision Set', 'Review Pack', 'Study Pack'],
  'Extended Set': ['Extended Set', 'Longer Set', 'Extended Question Set', 'Wider Practice'],
  'Long Practice Paper': ['Long Practice Paper', 'Extended Paper', 'Full-Length Practice', 'Long Paper'],
  'Unit Assessment': ['Unit Assessment', 'End-of-Unit Test', 'Unit Check', 'Assessment Paper'],
  'Half-Term Booklet': ['Half-Term Booklet', 'Mid-Term Booklet', 'Half-Term Pack', 'Term Booklet'],
  'Full Unit Paper': ['Full Unit Paper', 'Whole-Unit Paper', 'Complete Paper', 'Full Paper'],
  'Consolidation Booklet': ['Consolidation Booklet', 'Consolidation Pack', 'Secure It Booklet', 'Embedding Booklet'],
  'Topic Mastery Booklet': ['Topic Mastery Booklet', 'Mastery Booklet', 'Master the Unit', 'Depth Booklet']
};

/* When a pool runs out, the sheet is qualified rather than numbered — a
   teacher setting the eleventh quiz on a unit is setting a second round of it,
   and that is what the name should say. */
const SET_ROUNDS = ['Second Round', 'Third Round', 'Fourth Round', 'Fifth Round',
  'Sixth Round', 'Seventh Round', 'Eighth Round', 'Ninth Round', 'Tenth Round'];

/** The display name of set `n` of a family whose first sheet is labelled `label`. */
function setName(label, n) {
  const pool = SET_NAMES[label] ?? SET_NAMES['Practice Sheet'];
  const name = pool[n % pool.length];
  const round = Math.floor(n / pool.length);
  if (!round) return name;
  const suffix = SET_ROUNDS[round - 1];
  return suffix ? `${name} · ${suffix}` : `${name} · Round ${round + 1}`;
}

/* Set labels run A…Z then AA, AB… like spreadsheet columns, so a family can
   carry more than twenty-six sheets without the naming falling over. */
function setLabel(n) {
  let out = '', i = n;
  do { out = String.fromCharCode(65 + (i % 26)) + out; i = Math.floor(i / 26) - 1; } while (i >= 0);
  return out;
}


/* What each format actually asks a student to do, for the summary line. */
const FORMAT_BLURB = {
  quiz:      'A quiz',
  vocab:     'A vocabulary check',
  define:    'A definitions drill — recall each term unaided',
  match:     'A matching activity',
  cloze:     'A cloze exercise — the missing word is the point',
  truefalse: 'A true-or-false audit',
  myths:     'A misconception check built from the errors students actually make',
  sorting:   'A sorting exercise — what belongs here and what does not',
  retrieval: 'Retrieval practice — no prompts, no options to lean on',
  starter:   'A short starter activity',
  written:   'Written response questions, marked against a key',
  exam:      'Exam-style questions at full difficulty',
  homework:  'A homework sheet',
  mixed:     'Mixed practice across every question type this unit supports',
  sequence:  'A sequencing activity',
  diagram:   'A diagram-labelling sheet',
  annotated: 'An annotated diagram, with the terms that go around it',
  applied:   'Applied questions — the idea in an unfamiliar situation',
  practice:  'A practice sheet with a fresh set of questions every time',
  counting:  'Counting and writing numbers',
  numberwork: 'Number work — adding, taking away and number bonds'
};

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

/* Packs run from two pages up to a ten-page booklet. The longest are only
   offered where the content can genuinely fill them: `build` refuses to repeat
   a question, so asking a small item bank for a hundred questions produces a
   short sheet with a misleading title. Capacity is checked before each shape. */
const PACK_SHAPES = [
  [2, 15,  'Practice Pack'],
  [2, 20,  'Extended Practice'],
  [3, 25,  'Problem Set'],
  [3, 30,  'Consolidation Pack'],
  [4, 35,  'Revision Booklet'],
  [4, 40,  'Full Review'],
  [5, 50,  'Half-Term Review'],
  [6, 60,  'Topic Mastery Pack'],
  [8, 75,  'End-of-Unit Booklet'],
  [10, 100, 'Complete Revision Booklet']
];

/* Question makers for one unit, and the question types they produce. */
const unitTypeCache = {};
function unitTypes(key, format, tier = 2) {
  const cacheKey = `${key}|${format ?? ''}|${tier}`;
  let hit = unitTypeCache[cacheKey];
  if (hit) return hit;
  const gens = makersFor(key, format ?? 'quiz') ?? UNIT_GENERATORS[key] ?? [];
  const seen = new Set();
  for (const g of gens) if ((g.minTier ?? 1) <= tier) seen.add(g.type);
  return (unitTypeCache[cacheKey] = [...seen]);
}


/* How long each format's sheet is, and how many printed pages it takes.
   A starter is six questions on one side; an exam paper is twenty over two. */
const FORMAT_SHAPE = {
  quiz:      { count: null, pages: 1 },
  vocab:     { count: 10, pages: 1 },
  define:    { count: 10, pages: 1 },
  match:     { count: 6,  pages: 1 },
  cloze:     { count: 10, pages: 1 },
  truefalse: { count: 10, pages: 1 },
  myths:     { count: 8,  pages: 1 },
  sorting:   { count: 8,  pages: 1 },
  retrieval: { count: 12, pages: 1 },
  starter:   { count: 6,  pages: 1 },
  written:   { count: 6,  pages: 1 },
  exam:      { count: 20, pages: 2 },
  homework:  { count: 15, pages: 2 },
  mixed:     { count: 12, pages: 1 },
  sequence:  { count: 6,  pages: 1 },
  applied:   { count: 10, pages: 1 },
  practice:  { count: 12, pages: 1 },
  counting:  { count: 10, pages: 1 },
  numberwork:{ count: 12, pages: 1 },
  /* A labelling question fills a lot of page, so these sheets are short by
     design: six diagrams is already two printed sides. */
  diagram:   { count: 6,  pages: 1 },
  annotated: { count: 10, pages: 2 }
};

/* Topic sheets get formats too. A procedural topic composes fresh numbers
   every time, so the same focus at the same level can honestly be a quick
   quiz, a homework sheet or an exam-style paper — different lengths and
   difficulty floors, not the same sheet relabelled. */
const TOPIC_FORMATS = [
  { label: null,                   count: null, pages: 1 },
  { label: 'Quick Quiz',           count: 8,    pages: 1 },
  { label: 'Practice Sheet',       count: 15,   pages: 1 },
  { label: 'Homework Sheet',       count: 12,   pages: 1 },
  { label: 'Extended Practice',    count: 20,   pages: 2 },
  { label: 'Exam-Style Questions', count: 20,   pages: 2, tier: 'hard' }
];

/* Longer booklets, built from every maker a unit has. Only offered where the
   unit can fill them: `build` refuses to repeat a question on one sheet, so
   asking a small bank for sixty questions yields a short sheet with a
   misleading title. */
const UNIT_PACKS = [
  [2, 25,  'Revision Pack'],
  [3, 30,  'Extended Set'],
  [3, 35,  'Long Practice Paper'],
  [4, 40,  'Consolidation Booklet'],
  [4, 45,  'Unit Assessment'],
  [5, 50,  'Half-Term Booklet'],
  [6, 60,  'Topic Mastery Booklet'],
  [7, 75,  'Full Unit Paper'],
  [10, 100, 'Complete Revision Booklet']
];

/* The level a booklet of a given length is reasonable at. Forty questions is a
   homework for a Grade 9 class and an unkind afternoon for a Grade 3 one, so
   the longer shapes start higher up rather than being offered everywhere the
   bank happens to be deep enough. */
const PACK_FLOOR = count => count >= 75 ? 'Grade 8'
                          : count >= 50 ? 'Grade 6'
                          : count >= 35 ? 'Grade 5'
                          : 'Grade 4';

/**
 * How many sheets a family carries.
 *
 * Sets × questions is how many question slots the family has to fill; capacity
 * is how many genuinely different questions exist to fill them. The ratio is
 * how often a given question comes round again across the family.
 *
 * This was three, with a ceiling of 140, and it was the wrong trade. It bought
 * a very large number by putting a hundred and forty near-identical sheets
 * behind one unit — an alphabet of quizzes, differing in which twelve of the
 * same eighty questions each happened to deal. A teacher scrolling that list
 * cannot tell them apart, because there is nothing to tell apart.
 *
 * At one repeat the sheets in a family are close to disjoint: the family holds
 * about as many sheets as its bank can fill without re-dealing. The library
 * gets smaller and every sheet in it is worth opening. Growth now has to come
 * from where it should — more units, more formats, more levels — rather than
 * from re-dealing the same bank.
 */
const REPEATS_ALLOWED = 1;
const setsFrom = (capacity, count) => {
  /* The ceiling still rises with the bank, because a family whose makers
     compose fresh numbers every time has nothing to re-deal. It is far lower
     than it was: past a couple of dozen sheets on one unit at one level in one
     format, nobody is choosing between them. */
  const ceiling = Math.min(32, Math.max(6, Math.round(capacity / 12)));
  return Math.max(3, Math.min(ceiling, Math.round((capacity * REPEATS_ALLOWED) / Math.max(1, count))));
};

/* The tiers a unit sheet is offered at. The unnamed one is the sheet as the
   level would normally pitch it; the other two are the differentiated
   versions, and each is only emitted where it produces a different set of
   question shapes. */
const DIFFICULTY_VARIANTS = [
  { label: null,         difficulty: null },
  { label: 'Foundation', difficulty: 'easy' },
  { label: 'Higher',     difficulty: 'hard' }
];

/** Which makers the untiered version of this sheet would use. */
function baseFingerprint(gens, difficulty, format) {
  const tier = Math.max(tierOf(difficulty), format.tier ?? 1);
  return gens.filter(g => (g.minTier ?? 1) <= tier).map(g => g.id).join(',');
}

/**
 * Expand the plan into worksheet families.
 * A family is one topic or unit, at one level, in one format; `sets` is how
 * many sheets it holds. Nothing here builds a sheet — see `Blueprint.at`.
 */
export function buildFamilies() {
  const out = [];
  const push = bp => out.push(bp);
  const family = (bp, sets) => { bp.sets = Math.max(1, sets); push(bp); };

  /* ------------------------------ topic sheets ------------------------------ */
  for (const [topic, [from, to, focuses]] of Object.entries(PLAN)) {
    const start = idx(from), end = idx(to);
    if (start === undefined || end === undefined) continue;
    /* A topic with no procedural or pool generators has nothing to put on a
       topic-wide sheet; its worksheets all come from its micro-units. */
    if (!(GENERATORS[topic] ?? []).length) continue;
    const levels = LEVELS.slice(start, end + 1);
    const sets = setsFor(topic);

    levels.forEach((lv, pos) => {
      /* Every focus, at every level it suits.
         This used to rotate four of them per level, which was right when the
         focuses were "Core Practice" and "Review and Recall" — four helpings of
         the same undifferentiated sheet is three too many. Now that each focus
         names a real topic and is pinned to the generators that cover it,
         Ancient Rome and Sources and Evidence are two different Grade 8
         worksheets and both should exist. */
      focuses.forEach((entry, v) => {
        const focus = Array.isArray(entry) ? entry[0] : entry;
        const only = Array.isArray(entry) ? entry[1] : null;
        const minLevel = Array.isArray(entry) ? entry[2] : null;
        if (minLevel && idx(lv.level) < idx(minLevel)) return;

        const difficulty = difficultyFor(pos, levels.length, v);
        const pool = only?.length || (GENERATORS[topic] ?? []).length;
        /* A generator that composes fresh values has no fixed bank to exhaust;
           one that deals from a list does. That is what caps the sets. */
        const varied = (only ?? GENERATORS[topic].map((_, i) => i))
          .filter(i => VARIED_GENS[topic]?.has(i)).length;
        const capacity = varied * 260 + (pool - varied) * 6;

        for (const shape of TOPIC_FORMATS) {
          const count = shape.count
            ?? Math.min(questionCount(lv.level, difficulty), Math.max(6, pool * 2));
          if (count > Math.max(6, pool * 2) && !varied) continue;
          if (shape.pages > 1 && idx(lv.level) < idx('Grade 3')) continue;
          if (shape.tier === 'hard' && idx(lv.level) < idx('Grade 4')) continue;
          const title = shape.label ? `${focus} — ${shape.label}` : focus;
          const diff = shape.tier ?? difficulty;
          family(new Blueprint(topic, start + pos, title, only, shape.pages, diff, count, 0),
                 shape.label ? setsFrom(capacity, count) : Math.max(sets, setsFrom(capacity, count)));
        }
      });

      /* Packs: the same topic and level, several pages long. A procedural
         topic composes fresh numbers every time, so it can fill any length. */
      if (!PROCEDURAL.has(topic) || idx(lv.level) < idx('Grade 2')) return;
      const usable = allowedAt(topic, lv.level);
      const difficulty = difficultyFor(pos, levels.length, 1);
      for (const [pages, count, label] of PACK_SHAPES) {
        if (pages >= 3 && idx(lv.level) < idx('Grade 4')) continue;
        if (pages >= 4 && idx(lv.level) < idx('Grade 5')) continue;
        if (pages >= 6 && idx(lv.level) < idx('Grade 7')) continue;
        family(new Blueprint(topic, start + pos, label, usable, pages, difficulty, count, 0),
               Math.min(sets, 6));
      }
    });
  }

  /* ------------------------------ unit sheets ------------------------------ */
  for (const meta of Object.values(UNIT_META)) {
    const start = idx(meta.from), end = idx(meta.to);
    if (start === undefined || end === undefined) continue;
    const span = end - start;

    for (let pos = 0; pos <= span; pos++) {
      const lv = LEVELS[start + pos];
      const difficulty = difficultyFor(pos, span + 1, 1);

      for (const format of UNIT_FORMATS) {
        const capacity = meta.formatCapacity[format.id] ?? 0;
        if (!capacity) continue;
        const gens = makersFor(meta.key, format.id);
        /* Two makers, or one that is varied enough to carry a sheet on its own.
           The flat "at least two" rule was written for text formats, where one
           maker means the same question shape twenty times; a diagram maker
           picks a different figure and a different set of parts each time, so
           the honest test is capacity, not how many makers there happen to be. */
        if (!gens?.length) continue;
        if (gens.length < 2 && capacity < 40) continue;

        const shape = FORMAT_SHAPE[format.id] ?? { count: 10, pages: 1 };

        /* Differentiated versions of the same sheet.
           A maker declares the tier it refuses to run below, so a foundation
           sheet on a unit draws on nine question shapes and a higher sheet on
           sixteen — the higher one asks for unaided recall and written
           explanation, the foundation one does not. That is a genuinely
           different worksheet and the thing a teacher with a mixed class
           actually needs, so both are offered. A tier that yields the same
           makers as the one already emitted is not offered: relabelling an
           identical sheet is padding. */
        for (const variant of DIFFICULTY_VARIANTS) {
          const diff = variant.difficulty ?? difficulty;
          /* A format can raise the floor: an exam paper is higher tier
             wherever it sits, so it has no foundation version. */
          const tier = Math.max(tierOf(diff), format.tier ?? 1);
          const usable = gens.filter(g => (g.minTier ?? 1) <= tier);
          if (usable.length < 2 && capacity < 40) continue;
          const fingerprint = usable.map(g => g.id).join(',');
          if (variant.label && fingerprint === baseFingerprint(gens, difficulty, format)) continue;

          const count = shape.count ?? questionCount(lv.level, diff);
          /* Never title a sheet longer than its makers can fill. */
          if (count * 1.4 > capacity) continue;

          const named = format.label ? `${meta.name} — ${format.label}` : meta.name;
          const title = variant.label ? `${named} (${variant.label})` : named;
          const bp = new Blueprint(meta.topic, start + pos, title, null, shape.pages,
                                   diff, count, 0, meta.key, format.id);
          family(bp, setsFrom(capacity, count));
        }
      }

      /* Long booklets, only where the bank can fill them and the level suits. */
      for (const [pages, count, label] of UNIT_PACKS) {
        if (idx(lv.level) < idx(PACK_FLOOR(count))) continue;
        if (count * 1.6 > meta.capacity) break;
        const bp = new Blueprint(meta.topic, start + pos, `${meta.name} — ${label}`, null,
                                 pages, difficulty, count, 0, meta.key, 'mixed');
        family(bp, Math.max(2, Math.min(12, Math.round(meta.capacity / count))));
      }
    }
  }

  return out;
}

/* Weighting, not just membership. Single-item recall shapes are listed twice
   and the combinatorial ones once, so a mixed sheet lands at roughly two-thirds
   recall and one-third judgement — the balance a real quiz has — instead of
   asking four judgement questions drawn from four true statements. */
function weightMakers(gens) {
  if (gens.length <= 2) return gens;
  const light = gens.filter(g => g.kind === 'recognise' || g.kind === 'recall');
  return light.length ? [...gens, ...light] : gens;
}

/** Materialise the questions for one blueprint. Same blueprint, same sheet. */
export function generateQuestions(blueprint) {
  if (blueprint.unit) {
    const gens = makersFor(blueprint.unit, blueprint.format ?? 'quiz') ?? [];
    if (!gens.length) return [];
    const format = UNIT_FORMATS.find(f => f.id === blueprint.format);
    /* A format can raise the difficulty floor: an exam-style paper asks for
       unaided recall and written answers whatever level it sits at. */
    const tier = Math.max(tierOf(blueprint.difficulty), format?.tier ?? 1);
    const weighted = weightMakers(gens);
    return build(blueprint.seed, blueprint.count, weighted.map(g => r => g(r, tier)));
  }
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
