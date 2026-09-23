/* The preschool worksheets themselves: which sheets exist, what each is
   called, and how its questions are built.

   A preschool family is one skill, in one format, at one level, in one
   length. Its members are the same activity dressed in different themes —
   the same "circle every picture that starts with /b/" at the zoo, the
   bakery, the building site — and because the theme supplies every picture
   on the page, two members of a family are two different worksheets, not one
   worksheet printed twice.

   How many members a family gets is measured, not assumed. A skill whose
   content comes from the theme (counting hamsters, sorting fruit) genuinely
   changes with all sixty-two; a skill that does not (tracing the letter E)
   changes only in what the seed deals, so it gets far fewer. Handing every
   family sixty-two would be exactly the padding this rebuild exists to
   remove.                                                                   */

import { PK_SKILLS, PK_SKILL_MAP } from './gen-pk-skills.js';
import { PK_THEMES } from './gen-pk-themes.js';
import { contentFor } from './gen-pk-content.js';
import { questionFor } from './gen-pk-formats.js';
import { rng, seedFrom, build } from './gen-core.js';

/* --------------------------- the eight topics --------------------------- */

/* The catalogue's own curriculum areas, in the words a parent would search
   for rather than the words a ministry would file them under. */
export const PK_TOPICS = [
  { id: 'pkliteracy', name: 'Letters, Sounds and Words', area: 'Literacy' },
  { id: 'pknumber',   name: 'Numbers, Shapes and Patterns', area: 'Mathematics' },
  { id: 'pkworld',    name: 'Our World and Nature', area: 'Understanding the World' },
  { id: 'pkfeelings', name: 'Feelings and Friends', area: 'Social-Emotional' },
  { id: 'pkmotor',    name: 'Pencil and Scissor Skills', area: 'Fine Motor' },
  { id: 'pkcolour',   name: 'Colour, Art and Music', area: 'Arts & Music' },
  { id: 'pkthinking', name: 'Thinking and Noticing', area: 'Thinking Skills' },
  { id: 'pkhealth',   name: 'Health and Safety', area: 'Health & Safety' }
];

const TOPIC_FOR_AREA = Object.fromEntries(PK_TOPICS.map(t => [t.area, t.id]));
export const PK_TOPIC_IDS = PK_TOPICS.map(t => t.id);

/* ------------------------------ the levels ------------------------------ */

/* The catalogue teaches three ages; the library has two early levels. Pre-K
   carries both pre-school years, told apart by difficulty — which is a filter
   the library already has and a distinction a parent already understands.
   The item counts are the catalogue's own rules for each age. */
export const PK_LEVELS = [
  /* `key` goes in the worksheet id. Pre-K carries two of the catalogue's three
     ages, so the level alone does not tell them apart and two families would
     claim the same id. */
  { age: 'Age 3 (Pre-K 3)', key: 'age-3', level: 'Pre-K',        difficulty: 'easy',
    shapes: [{ pages: 1, count: 4, label: null }] },
  { age: 'Age 4 (Pre-K 4)', key: 'age-4', level: 'Pre-K',        difficulty: 'medium',
    shapes: [{ pages: 1, count: 7, label: null },
             { pages: 2, count: 12, label: 'Double Sheet' }] },
  { age: 'Age 5 (Kindergarten)', key: 'age-5', level: 'Kindergarten', difficulty: 'medium',
    shapes: [{ pages: 1, count: 10, label: null },
             { pages: 2, count: 16, label: 'Double Sheet' },
             { pages: 4, count: 28, label: 'Activity Booklet' }] }
];

/* ------------------------------ short names ------------------------------ */

const cap = s => String(s).charAt(0).toUpperCase() + String(s).slice(1);
const titleCase = s => String(s).split(' ').map(cap).join(' ');

/* What to call the skill on the cover of a worksheet. "Recognize uppercase
   letter B" is a curriculum line; "Uppercase B" is a worksheet title. */
export function shortName(skill) {
  const t = skill.target;
  switch (skill.kind) {
    case 'letterUpper':  return `Uppercase ${t}`;
    case 'letterLower':  return `Lowercase ${t}`;
    case 'letterMatch':  return `${t} and ${String(t).toLowerCase()}`;
    case 'formUpper':    return `Writing ${t}`;
    case 'formLower':    return `Writing ${t}`;
    case 'numeralWrite': return `Writing ${t}`;
    case 'soundStart':   return `The /${t}/ Sound`;
    case 'soundEnd':     return `Ending in /${t}/`;
    case 'sightWord':    return `The Word "${t}"`;
    case 'rhyme':        return `The -${t} Family`;
    case 'cvc':          return `Short ${t} Words`;
    case 'syllables':    return `${t}-Clap Words`;
    case 'numeral':      return `The Number ${t}`;
    case 'countSet':     return `Counting ${t}`;
    case 'subitize':     return `${t} at a Glance`;
    case 'bond':         return `Ways to Make ${t}`;
    case 'oneMoreLess':  return `One More, One Less than ${t}`;
    case 'orderNumbers': return `Numbers ${t[0]}–${t[1]} in Order`;
    case 'shape2d':      return `${titleCase(t)}s`;
    case 'shape3d':      return `${titleCase(t)}s Around Us`;
    case 'sizeCompare':  return `${cap(t[0])} and ${cap(t[1])}`;
    case 'compareGroups': return t === 'same' ? 'The Same Number' : `Which Has ${cap(t)}`;
    case 'pattern':      return `${t} Patterns`;
    case 'ordinal':      return `${cap(t)} in the Line`;
    case 'position':     return `The Word "${t}"`;
    case 'sortBy':       return `Sorting by ${titleCase(t)}`;
    case 'colour':       return `The Colour ${cap(t)}`;
    case 'colourMix':    return `${cap(t[0])} and ${cap(t[1])} Make ${cap(t[2])}`;
    case 'feeling':      return `Feeling ${cap(t)}`;
    case 'addPics':      return `Adding to ${t}`;
    case 'subPics':      return `Taking Away from ${t}`;
    case 'skipCount':    return `Counting by ${t[0]}s`;
    case 'stroke':       return titleCase(t);
    case 'cutting':      return `Cutting ${titleCase(t)}`;
    case 'dotToDot':     return skill.name;
    case 'sequence': case 'binarySort': case 'pairs': case 'pickSet': case 'opposites':
      return skill.target.name;
    default:             return skill.name;
  }
}

/* ------------------------------- the titles ------------------------------- */

/* Four ways to name each kind of page, so a shelf of preschool worksheets
   does not read like a spreadsheet column. {s} is the skill, {t} the theme. */
const TITLES = {
  choose:  ['{s} at the {t}', 'Which One? {s} — {t}', 'Spot It: {s} in the {t}', '{t} Choices: {s}'],
  find:    ['Find and Circle: {s} — {t}', '{t} Hunt: {s}', 'Circle Them All: {s} at the {t}', 'Search the {t}: {s}'],
  dab:     ['Dab It: {s} in the {t}', 'Stamp the {t}: {s}', 'Dot Markers at the {t}: {s}', '{t} Dabbing Page: {s}'],
  ispy:    ['I Spy at the {t}: {s}', '{t} I-Spy: {s}', 'Look and Count: {s} — {t}', 'Hidden in the {t}: {s}'],
  count:   ['Count the {t}: {s}', '{s} Counting at the {t}', 'How Many? {s} — {t}', '{t} Counting Page: {s}'],
  tenf:    ['Ten Frames at the {t}: {s}', '{t} Ten-Frame Page: {s}', 'Fill the Ten Frame: {s} — {t}', 'Five and Some More: {s} — {t}'],
  match:   ['Match Them Up: {s} — {t}', '{t} Matching: {s}', 'Draw a Line: {s} at the {t}', 'Partners at the {t}: {s}'],
  shadow:  ['Shadow Match at the {t}: {s}', '{t} Shadows: {s}', 'Find the Shadow: {s} — {t}', 'Light and Shadow at the {t}: {s}'],
  sort:    ['Sort It Out: {s} — {t}', '{t} Sorting: {s}', 'Two Boxes at the {t}: {s}', 'Tidy the {t}: {s}'],
  cut:     ['Cut and Paste: {s} — {t}', 'Snip and Stick at the {t}: {s}', 'Scissors and Glue: {s} — {t}', '{t} Cut-and-Paste: {s}'],
  seq:     ['Put It In Order: {s} — {t}', 'What Comes First? {s} at the {t}', '{t} Sequencing: {s}', 'First, Next, Last: {s} — {t}'],
  pattern: ['{t} Patterns: {s}', 'What Comes Next? {s} — {t}', 'Finish the Pattern at the {t}: {s}', 'Pattern Strips: {s} — {t}'],
  graph:   ['{t} Picture Graph: {s}', 'Read the Graph: {s} — {t}', 'Graphing at the {t}: {s}', 'Count and Graph: {s} — {t}'],
  roll:    ['Roll and Draw at the {t}: {s}', '{t} Dice Page: {s}', 'Roll It: {s} — {t}', 'Shake, Roll, Count: {s} — {t}'],
  code:    ['Colour-Key {t} Mystery: {s}', 'Secret {t} Picture: {s}', '{t} Colour by Code: {s}', 'Crack the Code at the {t}: {s}'],
  draw:    ['Draw It: {s} — {t}', '{t} Drawing Page: {s}', 'Pencils Out at the {t}: {s}', 'Show Me: {s} — {t}'],
  trace:   ['Trace It: {s} — {t}', '{t} Tracing Page: {s}', 'Follow the Dots: {s} — {t}', 'Warm-Up Tracing at the {t}: {s}'],
  tw:      ['Trace and Write: {s} — {t}', '{t} Handwriting: {s}', 'Trace, Then Write: {s} — {t}', 'Pencil Practice at the {t}: {s}'],
  maze:    ['{t} Maze: {s}', 'Find the Way at the {t}: {s}', 'Through the {t}: {s}', 'Follow the Path: {s} — {t}'],
  dot:     ['Dot-to-Dot at the {t}: {s}', '{t} Join the Dots: {s}', 'Connect the Dots: {s} — {t}', 'Hidden Picture at the {t}: {s}'],
  snip:    ['Scissor Skills at the {t}: {s}', '{t} Cutting Page: {s}', 'Snip Along: {s} — {t}', 'Cutting Practice at the {t}: {s}'],
  odd:     ['Odd One Out at the {t}: {s}', '{t} Odd One Out: {s}', 'Which Does Not Belong? {s} — {t}', 'Spot the Stranger at the {t}: {s}'],
  diff:    ['Spot the Difference at the {t}: {s}', '{t} Differences: {s}', 'What Changed at the {t}? {s}', 'Two Pictures at the {t}: {s}'],
  label:   ['Name the Picture at the {t}: {s}', '{t} Word Match: {s}', 'Which Word? {s} — {t}', 'Picture and Word at the {t}: {s}']
};

/* Some families the theme does not reach: which pictures are on a /b/ sound
   sheet comes from the picture-word bank, not from the zoo. Calling one of
   those "The /b/ Sound at the Zoo" would be a promise the page does not keep,
   so those sheets are named for what they are. There are four of them per
   family, one per name, rather than sixty-two of the same sheet under sixty-
   two place names. */
const PLAIN_TITLES = {
  choose:  ['{s}: Which One?', 'Pick It Out: {s}', '{s} — Choose Carefully', 'Point to It: {s}'],
  find:    ['Find and Circle: {s}', 'Circle Them All: {s}', '{s} — Search and Circle', 'Hunt for It: {s}'],
  dab:     ['Dab It: {s}', 'Dot Markers: {s}', '{s} — Stamp Every One', 'Press and Mark: {s}'],
  ispy:    ['I Spy: {s}', 'Look and Count: {s}', '{s} — How Many Can You Find?', 'Hidden Everywhere: {s}'],
  count:   ['Count Them: {s}', 'How Many? {s}', '{s} — Counting Page', 'Count and Write: {s}'],
  tenf:    ['Ten Frames: {s}', 'Fill the Ten Frame: {s}', '{s} — Five and Some More', 'Ten-Frame Page: {s}'],
  match:   ['Match Them Up: {s}', 'Draw a Line: {s}', '{s} — Find the Partner', 'Which Goes With Which? {s}'],
  shadow:  ['Shadow Match: {s}', 'Find the Shadow: {s}', '{s} — Light and Shadow', 'Match the Outline: {s}'],
  sort:    ['Sort It Out: {s}', 'Two Boxes: {s}', '{s} — Sorting Page', 'Put Them in Groups: {s}'],
  cut:     ['Cut and Paste: {s}', 'Snip and Stick: {s}', '{s} — Scissors and Glue', 'Cut It Out: {s}'],
  seq:     ['Put It In Order: {s}', 'What Comes First? {s}', '{s} — First, Next, Last', 'Number Them 1, 2, 3: {s}'],
  pattern: ['Finish the Pattern: {s}', 'What Comes Next? {s}', '{s} — Pattern Strips', 'Keep It Going: {s}'],
  graph:   ['Picture Graph: {s}', 'Read the Graph: {s}', '{s} — Count and Graph', 'Graphing Page: {s}'],
  roll:    ['Roll and Draw: {s}', 'Dice Page: {s}', '{s} — Roll It', 'Shake, Roll, Count: {s}'],
  code:    ['Colour-Key Mystery: {s}', 'Secret Picture: {s}', '{s} — Colour by Code', 'Crack the Code: {s}'],
  draw:    ['Draw It: {s}', 'Drawing Page: {s}', '{s} — Pencils Out', 'Show Me: {s}'],
  trace:   ['Trace It: {s}', 'Tracing Page: {s}', '{s} — Follow the Dots', 'Warm-Up Tracing: {s}'],
  tw:      ['Trace and Write: {s}', 'Handwriting Page: {s}', '{s} — Trace, Then Write', 'Pencil Practice: {s}'],
  maze:    ['Maze: {s}', 'Find the Way: {s}', '{s} — Follow the Path', 'Through the Maze: {s}'],
  dot:     ['Dot-to-Dot: {s}', 'Join the Dots: {s}', '{s} — Connect the Dots', 'Hidden Picture: {s}'],
  snip:    ['Scissor Skills: {s}', 'Cutting Page: {s}', '{s} — Snip Along', 'Cutting Practice: {s}'],
  odd:     ['Odd One Out: {s}', 'Which Does Not Belong? {s}', '{s} — Spot the Stranger', 'Cross Out the Odd One: {s}'],
  diff:    ['Spot the Difference: {s}', 'What Changed? {s}', '{s} — Two Pictures', 'Find the Differences: {s}'],
  label:   ['Name the Picture: {s}', 'Which Word? {s}', '{s} — Picture and Word', 'Read the Label: {s}']
};

/**
 * The title for one sheet.
 * A themed sheet is named for its theme, because the theme is every picture on
 * it. An unthemed one is named for the activity, because claiming a theme it
 * does not have is how a library ends up with forty thousand worksheets and
 * four hundred worksheets' worth of content.
 */
export function pkTitle(skill, format, theme, shapeLabel, set = 0) {
  const bank = theme ? (TITLES[format] ?? TITLES.choose)
                     : (PLAIN_TITLES[format] ?? PLAIN_TITLES.choose);
  const at = theme ? seedFrom(`${skill.id}|${format}|${theme.id}`) % bank.length
                   : set % bank.length;
  const base = bank[at].replace('{s}', shortName(skill))
                       .replace('{t}', theme ? theme.name : '');
  return shapeLabel ? `${base} — ${shapeLabel}` : base;
}

/* ------------------------------ the families ------------------------------ */

/* Two things decide how many worksheets a family is worth, and both are
   measured rather than declared.

   How much one sheet can hold. `build` refuses to put the same question on a
   sheet twice, so a family asked for more questions than it has to give
   returns a short sheet and a blueprint that lied about its length. Probing
   with a long build says what each family can actually fill.

   Whether the theme reaches it. Build the same question twice from the same
   seed under two different themes and see whether anything on the page moved.
   A counting sheet changes completely; recognising the letter B does not.
   Sixty-two identical letter sheets with different names on them is the
   padding this rebuild exists to remove.

   Both run once per kind and format — a couple of hundred probes, not five
   hundred and eighteen. Per format matters: "ways to make eight" is untouched
   by the theme as a colour-by-code page and completely themed as a drawing
   page, and measuring only the first format got that wrong for a third of the
   maths skills. */
const probes = new Map();
function probe(skill, format) {
  const key = `${skill.kind}|${format}`;
  const hit = probes.get(key);
  if (hit) return hit;

  const theme = PK_THEMES[seedFrom(key) % PK_THEMES.length];
  const maker = th => r => questionFor(format, contentFor(skill, th, PK_THEMES, r), { r, level: 1 });

  let cap = 0;
  try { cap = build(seedFrom(key + 'cap'), PROBE_DEPTH, [maker(theme)]).length; } catch { cap = 0; }

  let themed = false;
  try {
    const shot = th => {
      const r = rng(1234567);
      const c = contentFor(skill, th, PK_THEMES, r);
      const r2 = rng(1234567);
      const q = questionFor(format, c, { r: r2, level: 1 });
      return JSON.stringify([q?.prompt, q?.options, q?.pairs, q?.items, q?.art]);
    };
    themed = shot(PK_THEMES[0]) !== shot(PK_THEMES[31])
          && shot(PK_THEMES[7]) !== shot(PK_THEMES[44]);
  } catch { themed = false; }

  const out = { cap, themed };
  probes.set(key, out);
  return out;
}

/* Tracing, trace-and-write and scissor practice are one task repeated down
   the page: that is what a handwriting sheet is. Repetition there is the
   exercise rather than a fault, so the row count is fixed by age and the
   family is not multiplied out — twelve tracing sheets for the same letter,
   differing only in the sentence above them, would be twelve of the same
   worksheet. */
const ONE_TASK = new Set(['trace', 'tw', 'snip']);
/* Four rows at three, rising to six at five. The catalogue allows three at
   age three; the library's own floor is four questions on any sheet, and a
   fourth tracing row is no hardship. */
const ONE_TASK_ROWS = [4, 5, 6];
const ONE_TASK_SETS = 4;
/* An unthemed family gets one sheet per name it can honestly carry. */
const PLAIN_SETS = 4;

const THEMED_SETS = PK_THEMES.length;
/* The capacity probe stops at 28 questions: no shape in the catalogue asks
   for more, so there is nothing to learn by looking further. */
const PROBE_DEPTH = 28;
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

/**
 * Every preschool worksheet family: one skill, one format, one level, one
 * length, and how many themed members it holds.
 */
export function pkFamilyPlan() {
  const out = [];
  for (const skill of PK_SKILLS) {
    const topic = TOPIC_FOR_AREA[skill.area];
    if (!topic) continue;
    for (const format of skill.formats) {
      const oneTask = ONE_TASK.has(format);
      const { cap, themed } = probe(skill, format);
      if (!oneTask && cap < 3) continue;          // nothing here to make a sheet from
      const sets = oneTask ? ONE_TASK_SETS
                 : themed ? THEMED_SETS
                 : clamp(cap, 1, PLAIN_SETS);

      PK_LEVELS.forEach((lv, levelPos) => {
        for (const shape of lv.shapes) {
          /* Never title a sheet longer than the family can fill. */
          const count = oneTask ? ONE_TASK_ROWS[levelPos] : shape.count;
          if (oneTask && shape.label) continue;   // no booklet of one tracing row
          if (!oneTask && count > cap) continue;
          out.push({
            skill: skill.id, skillRef: skill, skillName: shortName(skill),
            topic, format, levelPos, ageKey: lv.key,
            level: lv.level, difficulty: lv.difficulty,
            pages: oneTask ? 1 : shape.pages, count,
            shapeLabel: shape.label,
            shapeKey: shape.label ? shape.label.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'single',
            sets, themed
          });
        }
      });
    }
  }
  return out;
}

/** Which theme the nth member of a family wears. */
export function pkTheme(skillId, format, set) {
  const start = seedFrom(`${skillId}|${format}`) % PK_THEMES.length;
  return PK_THEMES[(start + set) % PK_THEMES.length];
}

/* ----------------------------- the questions ----------------------------- */

/** The questions for one preschool sheet. Same inputs, same sheet, always. */
export function pkQuestions({ skill, format, theme, count, levelPos, seed }) {
  const sk = PK_SKILL_MAP[skill];
  if (!sk) return [];
  /* One maker, called `count` times with different seeds. `build` handles the
     de-duplication that keeps a sheet from asking the same thing twice. */
  const maker = r => {
    const content = contentFor(sk, theme, PK_THEMES, r);
    return questionFor(format, content, { r, level: levelPos });
  };
  return build(seed, count, [maker]);
}

/** Which question types a preschool family produces, for the library filters. */
const typeCache = new Map();
export function pkTypes(skillId, format) {
  const key = `${skillId}|${format}`;
  if (typeCache.has(key)) return typeCache.get(key);
  const sk = PK_SKILL_MAP[skillId];
  const seen = new Set();
  for (let i = 0; i < 3; i++) {
    try {
      const r = rng(seedFrom(key + i));
      const q = questionFor(format, contentFor(sk, PK_THEMES[i * 7 % PK_THEMES.length], PK_THEMES, r), { r, level: 1 });
      if (q?.type) seen.add(q.type);
    } catch { /* a combination that rejects this seed contributes nothing */ }
  }
  const out = [...seen];
  typeCache.set(key, out);
  return out;
}
