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
import { PK_CAPACITY, PK_CEILING } from './gen-pk-capacity.js';

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

/* How to name each kind of page. `any` works for every theme; `place` is for
   the twenty-seven themes that are somewhere you can be, so a title can say
   "at the Bakery" without also producing "Pencils Out at the Bedtime". {s} is
   the skill, {t} the theme. */
const TITLES = {
  choose:  { any: ['{t} Choices: {s}', 'Which One? {s} — {t}', '{t} Picks: {s}', '{s} — {t} Edition'],
                place: ['{s} at the {t}', 'Spot It: {s} in the {t}'] },
  find:    { any: ['{t} Hunt: {s}', 'Find and Circle: {s} — {t}', '{t} Search: {s}', 'Circle Them All: {s} — {t}'],
                place: ['Search the {t}: {s}', 'Circle Every One at the {t}: {s}'] },
  dab:     { any: ['{t} Dabbing Page: {s}', 'Dab It: {s} — {t}', '{t} Dot Markers: {s}', 'Stamp Every One: {s} — {t}'],
                place: ['Dab It at the {t}: {s}', 'Dot Markers at the {t}: {s}'] },
  ispy:    { any: ['{t} I-Spy: {s}', 'I Spy: {s} — {t}', 'Look and Count: {s} — {t}', 'Hidden in the Picture: {s} — {t}'],
                place: ['I Spy at the {t}: {s}', 'Hidden at the {t}: {s}'] },
  count:   { any: ['{t} Counting Page: {s}', 'Count Them: {s} — {t}', 'How Many? {s} — {t}', '{t} Count and Write: {s}'],
                place: ['Counting at the {t}: {s}', 'Count What You See at the {t}: {s}'] },
  tenf:    { any: ['{t} Ten-Frame Page: {s}', 'Ten Frames: {s} — {t}', 'Fill the Ten Frame: {s} — {t}', 'Five and Some More: {s} — {t}'],
                place: ['Ten Frames at the {t}: {s}', 'Fill the Frame at the {t}: {s}'] },
  match:   { any: ['{t} Matching: {s}', 'Match Them Up: {s} — {t}', 'Draw a Line: {s} — {t}', 'Which Goes With Which? {s} — {t}'],
                place: ['Partners at the {t}: {s}', 'Matching at the {t}: {s}'] },
  shadow:  { any: ['{t} Shadows: {s}', 'Shadow Match: {s} — {t}', 'Find the Shadow: {s} — {t}', 'Light and Shadow: {s} — {t}'],
                place: ['Shadow Match at the {t}: {s}', 'Shadows at the {t}: {s}'] },
  sort:    { any: ['{t} Sorting: {s}', 'Sort It Out: {s} — {t}', 'Two Boxes: {s} — {t}', '{t} Groups: {s}'],
                place: ['Sorting at the {t}: {s}', 'Tidy the {t}: {s}'] },
  cut:     { any: ['{t} Cut-and-Paste: {s}', 'Cut and Paste: {s} — {t}', 'Snip and Stick: {s} — {t}', 'Scissors and Glue: {s} — {t}'],
                place: ['Cut and Paste at the {t}: {s}', 'Snip and Stick at the {t}: {s}'] },
  seq:     { any: ['{t} Sequencing: {s}', 'Put It In Order: {s} — {t}', 'What Comes First? {s} — {t}', 'First, Next, Last: {s} — {t}'],
                place: ['In Order at the {t}: {s}', 'What Happens First at the {t}? {s}'] },
  pattern: { any: ['{t} Patterns: {s}', 'What Comes Next? {s} — {t}', 'Finish the Pattern: {s} — {t}', 'Pattern Strips: {s} — {t}'],
                place: ['Patterns at the {t}: {s}', 'Finish the Pattern at the {t}: {s}'] },
  graph:   { any: ['{t} Picture Graph: {s}', 'Read the Graph: {s} — {t}', 'Count and Graph: {s} — {t}', '{t} Graphing Page: {s}'],
                place: ['Graphing at the {t}: {s}', 'The {t} Graph: {s}'] },
  roll:    { any: ['{t} Dice Page: {s}', 'Roll and Draw: {s} — {t}', 'Roll It: {s} — {t}', 'Shake, Roll, Count: {s} — {t}'],
                place: ['Roll and Draw at the {t}: {s}', 'Dice at the {t}: {s}'] },
  code:    { any: ['Colour-Key {t} Mystery: {s}', 'Secret {t} Picture: {s}', '{t} Colour by Code: {s}', 'Crack the Code: {s} — {t}'],
                place: ['Colour by Code at the {t}: {s}', 'The Hidden {t} Picture: {s}'] },
  draw:    { any: ['{t} Drawing Page: {s}', 'Draw It: {s} — {t}', 'Show Me: {s} — {t}', '{t} Pencils Out: {s}'],
                place: ['Drawing at the {t}: {s}', 'Draw What You See at the {t}: {s}'] },
  trace:   { any: ['{t} Tracing Page: {s}', 'Trace It: {s} — {t}', 'Follow the Dots: {s} — {t}', 'Warm-Up Tracing: {s} — {t}'],
                place: ['Tracing at the {t}: {s}', 'Trace It at the {t}: {s}'] },
  tw:      { any: ['{t} Handwriting: {s}', 'Trace and Write: {s} — {t}', 'Trace, Then Write: {s} — {t}', 'Pencil Practice: {s} — {t}'],
                place: ['Handwriting at the {t}: {s}', 'Trace and Write at the {t}: {s}'] },
  maze:    { any: ['{t} Maze: {s}', 'Find the Way: {s} — {t}', 'Follow the Path: {s} — {t}', '{t} Puzzle Path: {s}'],
                place: ['Through the {t}: {s}', 'Find the Way at the {t}: {s}'] },
  dot:     { any: ['{t} Join the Dots: {s}', 'Dot-to-Dot: {s} — {t}', 'Connect the Dots: {s} — {t}', 'Hidden Picture: {s} — {t}'],
                place: ['Dot-to-Dot at the {t}: {s}', 'Join the Dots at the {t}: {s}'] },
  snip:    { any: ['{t} Cutting Page: {s}', 'Scissor Skills: {s} — {t}', 'Snip Along: {s} — {t}', 'Cutting Practice: {s} — {t}'],
                place: ['Scissor Skills at the {t}: {s}', 'Cutting at the {t}: {s}'] },
  odd:     { any: ['{t} Odd One Out: {s}', 'Odd One Out: {s} — {t}', 'Which Does Not Belong? {s} — {t}', 'Spot the Stranger: {s} — {t}'],
                place: ['Odd One Out at the {t}: {s}', 'Spot the Stranger at the {t}: {s}'] },
  diff:    { any: ['{t} Differences: {s}', 'Spot the Difference: {s} — {t}', 'What Changed? {s} — {t}', 'Two Pictures: {s} — {t}'],
                place: ['Spot the Difference at the {t}: {s}', 'What Changed at the {t}? {s}'] },
  label:   { any: ['{t} Word Match: {s}', 'Name the Picture: {s} — {t}', 'Which Word? {s} — {t}', 'Picture and Word: {s} — {t}'],
                place: ['Name the Picture at the {t}: {s}', 'Words at the {t}: {s}'] }
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
  const themed = TITLES[format] ?? TITLES.choose;
  const bank = theme
    ? (theme.place ? [...themed.any, ...themed.place] : themed.any)
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
  /* Capacity is read from the generated table rather than measured here.
     It has to be measured per skill — the -at rhyme family has nine words and
     the -it family three, so the same "sort into two boxes" page fills ten
     questions for one and runs dry at six for the other — and measuring two
     thousand pairs takes two seconds, which is fine in a build step and far
     too slow on every page load. */
  const cap = PK_CAPACITY[`${skill.id}|${format}`] ?? PK_CEILING;

  /* Theme sensitivity is cheap and genuinely a property of the kind, so it is
     still measured live, once per kind and format. */
  const key = `${skill.kind}|${format}`;
  const hit = probes.get(key);
  if (hit) return { cap, themed: hit.themed };

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

  probes.set(key, { themed });
  return { cap, themed };
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
/* One, not four. A tracing page for the letter S is a tracing page for the
   letter S: four of them differing only in the sentence above the rules is
   four copies of one worksheet, and two of the four came out byte-identical
   anyway. */
const ONE_TASK_SETS = 1;
/* An unthemed family gets one sheet per name it can honestly carry. */
const PLAIN_SETS = 4;

const THEMED_SETS = PK_THEMES.length;

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
          /* Never title a sheet longer than the family can fill — and leave
             margin, because the probe ran on one theme with one seed and
             another draw can come up shorter. A card that promises ten
             questions and delivers seven is a card that lies. */
          const count = oneTask ? ONE_TASK_ROWS[levelPos] : shape.count;
          if (oneTask && shape.label) continue;   // no booklet of one tracing row
          if (!oneTask && count * 1.3 > cap) continue;
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
  const maker = r => {
    const content = contentFor(sk, theme, PK_THEMES, r);
    return questionFor(format, content, { r, level: levelPos });
  };

  /* A handwriting sheet is six rows of the same letter, and a cutting sheet is
     the same line five times. `build` refuses to put the same question on a
     sheet twice — right for every other worksheet in the library, wrong here,
     where it silently returned a five-row sheet whose card promised six. So
     these rows are filled directly and repetition is allowed, because on these
     pages repetition is the exercise. */
  if (ONE_TASK.has(format)) {
    const out = [];
    for (let i = 0; i < count; i++) {
      const q = maker(rng(seed + i * 7919));
      if (!q) break;
      q.id = `q${out.length + 1}`;
      out.push(q);
    }
    return out;
  }

  /* Everywhere else, one maker called `count` times with different seeds, and
     `build` keeps the sheet from asking the same thing twice. */
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
