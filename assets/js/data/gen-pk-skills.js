/* Every skill the pre-K catalogue asks for, 518 of them, with the page formats
   the catalogue pairs each one with.

   The catalogue is mostly systematic — twenty-six uppercase letters, twenty-one
   numerals, twelve rhyme families — so most of this file is loops over the lists
   the catalogue actually contains. Writing out 518 literals would only invite
   typos, and a loop cannot misspell "Recognize uppercase letter Q".

   The awkward ones are kept honest instead of tidied: the catalogue really does
   say "Identify a octagon" and "Identify a oval", so this file says that too.
   check-preschool.mjs holds every name here against the catalogue row by row,
   and a silent "correction" would show up there as a mismatch.

   Each skill carries:
     id       a short stable key, used in worksheet ids and seeds
     name     the catalogue's own wording, exactly
     kind     which generator builds items for it
     area     the catalogue's curriculum area
     target   what the skill is about: a letter, a number, a word, a bank entry
     formats  the page formats the catalogue pairs with this skill             */

import { PK_BANKS } from './gen-pk-banks.js';

/* The format sets, read off the catalogue. A skill is never given a format the
   catalogue did not pair it with: a ten frame belongs on "count a set of 7",
   not on "count a set of 17", and the catalogue knows that. */
const F = {
  letterUpper:  ['choose', 'code', 'dab', 'find', 'ispy', 'maze'],
  letterLower:  ['choose', 'code', 'dab', 'find', 'maze'],
  letterMatch:  ['choose', 'code', 'cut', 'match'],
  formUpper:    ['trace', 'tw'],
  formLower:    ['trace', 'tw'],
  soundStart:   ['choose', 'cut', 'find', 'match', 'sort'],
  soundEnd:     ['choose', 'cut', 'sort'],
  sightWord:    ['code', 'cut', 'dab', 'find', 'maze', 'tw'],
  rhyme:        ['choose', 'cut', 'match', 'odd', 'sort'],
  cvc:          ['choose', 'cut', 'label', 'match', 'maze'],
  syllables:    ['choose', 'cut', 'dab', 'sort'],
  numeral:      ['choose', 'code', 'dab', 'find', 'ispy', 'maze'],
  numeralWrite: ['trace', 'tw'],
  countSet:     ['count', 'cut', 'dab', 'draw'],
  countSetTen:  ['count', 'cut', 'dab', 'draw', 'tenf'],
  subitize:     ['choose', 'dab', 'match', 'roll'],
  bond:         ['code', 'cut', 'draw', 'match', 'tenf'],
  oneMoreLess:  ['choose', 'draw', 'match', 'tenf'],
  orderNumbers: ['cut', 'dot', 'maze', 'seq'],
  shape2d:      ['code', 'draw', 'find', 'ispy', 'sort', 'trace'],
  shape3d:      ['choose', 'find', 'match', 'sort'],
  sizeCompare:  ['choose', 'draw', 'seq', 'sort'],
  compareGroups:['choose', 'draw', 'graph', 'match'],
  pattern:      ['cut', 'pattern'],
  ordinal:      ['choose', 'code', 'seq'],
  position:     ['choose', 'cut', 'draw'],
  sortBy:       ['code', 'cut', 'sort'],
  colour:       ['choose', 'code', 'dab', 'find', 'sort'],
  colourMix:    ['choose', 'code', 'draw'],
  feeling:      ['choose', 'draw', 'find', 'match'],
  addPics:      ['code', 'count', 'cut', 'draw', 'match', 'maze'],
  subPics:      ['code', 'count', 'cut', 'draw', 'match', 'maze'],
  stroke:       ['maze', 'trace'],
  cutting:      ['snip'],
  dotToDot:     ['dot'],
  opposites:    ['choose', 'cut', 'draw', 'match']
};

const LIT = 'Literacy', MAT = 'Mathematics', ART = 'Arts & Music', FIN = 'Fine Motor',
      THK = 'Thinking Skills', SEL = 'Social-Emotional',
      WRL = 'Understanding the World', HEA = 'Health & Safety';

const skills = [];
const add = (id, name, kind, area, target, formats) =>
  skills.push({ id, name, kind, area, target, formats });

const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const range = (lo, hi) => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);

/* ------------------------------- literacy ------------------------------- */

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
for (const U of ALPHABET) {
  const l = U.toLowerCase();
  add(`upper-${l}`,  `Recognize uppercase letter ${U}`, 'letterUpper', LIT, U, F.letterUpper);
  add(`lower-${l}`,  `Recognize lowercase letter ${l}`, 'letterLower', LIT, l, F.letterLower);
  add(`match-${l}`,  `Match uppercase ${U} to lowercase ${l}`, 'letterMatch', LIT, U, F.letterMatch);
  add(`formup-${l}`, `Form uppercase ${U} correctly`, 'formUpper', LIT, U, F.formUpper);
  add(`formlo-${l}`, `Form lowercase ${l} correctly`, 'formLower', LIT, l, F.formLower);
}

/* /x/ never begins an English word a four-year-old knows, so the catalogue
   leaves it out of the beginning sounds and puts it in the ending sounds. */
const START_SOUNDS = 'abcdefghijklmnopqrstuvwyz'.split('');
for (const s of START_SOUNDS)
  add(`start-${s}`, `Identify words beginning with /${s}/`, 'soundStart', LIT, s, F.soundStart);

const END_SOUNDS = ['b', 'd', 'g', 'k', 'm', 'n', 'p', 's', 't', 'x'];
for (const s of END_SOUNDS)
  add(`end-${s}`, `Identify words ending with /${s}/`, 'soundEnd', LIT, s, F.soundEnd);

const SIGHT_WORDS = ['I', 'a', 'am', 'and', 'at', 'big', 'can', 'come', 'for', 'go',
  'he', 'here', 'in', 'is', 'it', 'like', 'look', 'me', 'my', 'no',
  'play', 'said', 'see', 'she', 'the', 'to', 'up', 'we', 'yes', 'you'];
for (const w of SIGHT_WORDS)
  add(`sight-${slug(w)}${w === 'I' ? '-cap' : ''}`, `Read the sight word '${w}'`,
      'sightWord', LIT, w, F.sightWord);

const RHYME_FAMILIES = ['an', 'ap', 'at', 'ed', 'en', 'ig', 'in', 'it', 'op', 'ot', 'ug', 'un'];
for (const r of RHYME_FAMILIES)
  add(`rhyme-${r}`, `Recognize and produce rhymes in the -${r} family`, 'rhyme', LIT, r, F.rhyme);

for (const v of ['a', 'e', 'i', 'o', 'u'])
  add(`cvc-${v}`, `Blend CVC words with short ${v}`, 'cvc', LIT, v, F.cvc);

for (const n of [1, 2, 3])
  add(`syl-${n}`, `Clap and count ${n}-syllable words`, 'syllables', LIT, n, F.syllables);

/* ------------------------------ mathematics ------------------------------ */

for (const n of range(0, 20))
  add(`numeral-${n}`, `Recognize the numeral ${n}`, 'numeral', MAT, n, F.numeral);

for (const n of range(0, 10))
  add(`writenum-${n}`, `Write the numeral ${n}`, 'numeralWrite', MAT, n, F.numeralWrite);

/* A ten frame holds ten counters, so the catalogue offers one up to ten and
   not beyond. */
for (const n of range(2, 20))
  add(`count-${n}`, `Count a set of ${n} objects`, 'countSet', MAT, n,
      n <= 10 ? F.countSetTen : F.countSet);

for (const n of range(1, 6))
  add(`subitize-${n}`, `Subitize ${n} dots without counting`, 'subitize', MAT, n, F.subitize);

for (const n of range(3, 10))
  add(`bond-${n}`, `Number bonds (ways to make ${n})`, 'bond', MAT, n, F.bond);

for (const n of range(1, 9))
  add(`moreless-${n}`, `Find one more than ${n} and one less than ${n + 2}`,
      'oneMoreLess', MAT, n + 1, F.oneMoreLess);

for (const [lo, hi] of [[1, 5], [1, 10], [10, 20], [1, 20]])
  add(`order-${lo}-${hi}`, `Order numbers ${lo}–${hi}`, 'orderNumbers', MAT, [lo, hi], F.orderNumbers);

const SHAPES_2D = ['circle', 'diamond', 'heart', 'hexagon', 'octagon', 'oval',
  'pentagon', 'rectangle', 'semicircle', 'square', 'star', 'triangle'];
for (const s of SHAPES_2D)
  add(`shape-${s}`, `Identify a ${s}`, 'shape2d', MAT, s, F.shape2d);

for (const s of ['cone', 'cube', 'cylinder', 'pyramid', 'sphere'])
  add(`solid-${s}`, `Identify a 3D ${s} in real objects`, 'shape3d', MAT, s, F.shape3d);

const SIZE_PAIRS = [['big', 'small'], ['full', 'empty'], ['heavy', 'light'], ['long', 'short'],
  ['tall', 'short'], ['thick', 'thin'], ['wide', 'narrow']];
for (const [a, b] of SIZE_PAIRS)
  add(`size-${a}-${b}`, `Compare size: ${a} vs ${b}`, 'sizeCompare', MAT, [a, b], F.sizeCompare);

for (const [key, word] of [['more', 'more'], ['fewer', 'fewer'], ['same', 'the same number']])
  add(`groups-${key}`, `Compare groups: which has ${word}`, 'compareGroups', MAT, key, F.compareGroups);

for (const p of ['AAB', 'AABB', 'AB', 'ABB', 'ABC'])
  add(`pattern-${slug(p)}`, `Continue an ${p} pattern`, 'pattern', MAT, p, F.pattern);

for (const o of ['fifth', 'first', 'fourth', 'last', 'second', 'third'])
  add(`ordinal-${o}`, `Use ordinal position: ${o}`, 'ordinal', MAT, o, F.ordinal);

const POSITIONS = ['above', 'behind', 'below', 'between', 'in front of', 'in',
  'next to', 'on', 'under'];
for (const p of POSITIONS)
  add(`pos-${slug(p)}`, `Use the position word '${p}'`, 'position', MAT, p, F.position);

for (const s of ['color', 'number of legs', 'shape', 'size', 'type'])
  add(`sortby-${slug(s)}`, `Sort objects by ${s}`, 'sortBy', MAT, s, F.sortBy);

for (const n of [5, 10]) {
  add(`add-${n}`, `Add within ${n} with pictures`, 'addPics', MAT, n, F.addPics);
  add(`sub-${n}`, `Subtract within ${n} with pictures`, 'subPics', MAT, n, F.subPics);
}

/* The catalogue offers cut-and-paste on the tens but not on the fives. */
add('skip-5',  'Count by fives to 50',  'skipCount', MAT, [5, 50],   ['dot', 'maze']);
add('skip-10', 'Count by tens to 100',  'skipCount', MAT, [10, 100], ['cut', 'dot', 'maze']);

/* ----------------------------- arts and music ----------------------------- */

const COLOURS = ['black', 'blue', 'brown', 'gray', 'green', 'orange', 'pink',
  'purple', 'red', 'white', 'yellow'];
for (const c of COLOURS)
  add(`colour-${c}`, `Recognize the color ${c}`, 'colour', ART, c, F.colour);

const MIXES = [['black', 'white', 'gray'], ['blue', 'yellow', 'green'],
  ['red', 'blue', 'purple'], ['red', 'white', 'pink'], ['red', 'yellow', 'orange']];
for (const [a, b, c] of MIXES)
  add(`mix-${a}-${b}`, `Color mixing: ${a} + ${b} = ${c}`, 'colourMix', ART, [a, b, c], F.colourMix);

/* --------------------------- social and emotional --------------------------- */

const FEELINGS = ['angry', 'calm', 'excited', 'happy', 'proud', 'sad', 'scared',
  'shy', 'surprised', 'worried'];
for (const f of FEELINGS)
  add(`feel-${f}`, `Recognize the feeling '${f}'`, 'feeling', SEL, f, F.feeling);

/* ------------------------------- fine motor ------------------------------- */

const STROKES = ['arches', 'castle (square) lines', 'circles', 'crosses', 'curved lines',
  'diagonal lines', 'horizontal lines', 'loops', 'spirals', 'vertical lines',
  'wavy lines', 'zigzag lines'];
for (const s of STROKES)
  add(`stroke-${slug(s)}`, `Pre-writing stroke: ${s}`, 'stroke', FIN, s, F.stroke);

for (const s of ['corners', 'curvy lines', 'simple shapes', 'spirals', 'straight lines', 'zigzag lines'])
  add(`cut-${slug(s)}`, `Cutting practice: ${s}`, 'cutting', FIN, s, F.cutting);

for (const [key, label] of [['1-10', '1–10'], ['1-20', '1–20'], ['a-z', 'A–Z']])
  add(`dots-${key}`, `Dot-to-dot ${label}`, 'dotToDot', FIN, key, F.dotToDot);

/* ----------------------------- the banked skills ----------------------------- */

/* Sequences, sorts, pairs, sets and opposites all draw their content from
   gen-pk-banks.js. The formats come from the catalogue: a life cycle is cut,
   label and sequence; a feeling word is not. */
const BANK_FORMATS = {
  'lifecycle-butterfly': ['cut', 'label', 'seq'],
  'lifecycle-chicken':   ['label', 'seq'],
  'lifecycle-frog':      ['cut', 'label', 'seq'],
  'lifecycle-plant':     ['cut', 'label', 'seq'],
  seasons:        ['match', 'seq', 'sort'],
  timesofday:     ['match', 'seq'],
  handwashing:    ['cut', 'seq'],
  toothbrushing:  ['choose', 'draw', 'seq'],
  bedtime:        ['draw', 'seq'],
  dressing:       ['cut', 'seq'],
  roadsafety:     ['choose', 'draw', 'seq'],
  retell3:        ['draw', 'seq'],
  retell5:        ['draw', 'seq'],
  recycle:        ['cut', 'sort'],
  days:           ['cut', 'dot', 'seq'],

  'insect-or-not': ['choose', 'label', 'sort'],
  'dino-diet':     ['match', 'sort'],
  living:          ['code', 'cut', 'sort'],
  magnetic:        ['choose', 'sort'],
  sinkfloat:       ['choose', 'cut', 'sort'],
  hotcold:         ['choose', 'sort'],
  healthyfoods:    ['choose', 'cut', 'sort'],
  safeunsafe:      ['choose', 'sort'],
  kindunkind:      ['choose', 'draw', 'match', 'sort'],
  'letters-numbers': ['code', 'find', 'sort'],
  vowels:          ['code', 'find', 'sort'],
  loudquiet:       ['choose', 'sort'],
  lightdark:       ['code', 'seq', 'sort'],
  warmcool:        ['code', 'sort'],
  greatersmaller:  ['choose', 'code', 'maze'],

  'animal-coverings': ['match', 'sort'],
  helpers:      ['cut', 'label', 'match'],
  babyanimals:  ['cut', 'match'],
  habitats:     ['cut', 'match', 'sort'],
  animaleats:   ['cut', 'match'],
  foodsource:   ['cut', 'match', 'seq'],
  materials:    ['label', 'match', 'sort'],
  transport:    ['cut', 'match', 'sort'],
  senses:       ['choose', 'label', 'match', 'sort'],
  bodyparts:    ['draw', 'label', 'match'],
  weather:      ['draw', 'graph', 'match', 'sort'],
  dressweather: ['choose', 'cut', 'match'],
  instruments:  ['find', 'label', 'match'],
  family:       ['draw', 'label', 'match'],
  daynight:     ['match', 'sort'],
  plantparts:   ['label', 'match'],
  oceanzones:   ['match', 'sort'],
  planets:      ['label', 'match', 'seq'],
  celebrations: ['draw', 'label', 'match'],
  coins:        ['count', 'match', 'sort'],
  shadows:      ['shadow'],
  goestogether: ['cut', 'match'],
  causeeffect:  ['choose', 'match', 'seq'],
  categorise:   ['cut', 'match', 'sort'],

  'feelings-others': ['choose', 'draw', 'match', 'sort'],
  goodfriend:     ['choose', 'draw', 'match', 'sort'],
  calmdown:       ['choose', 'draw', 'match', 'sort'],
  classroomrules: ['choose', 'draw', 'match', 'sort'],
  gratitude:      ['choose', 'draw', 'match', 'sort'],
  growthmindset:  ['choose', 'draw', 'match', 'sort'],
  helpingathome:  ['choose', 'draw', 'match', 'sort'],
  personalspace:  ['choose', 'draw', 'match', 'sort'],
  sorry:          ['choose', 'draw', 'match', 'sort'],
  sharing:        ['choose', 'draw', 'match', 'sort'],
  conflict:       ['choose', 'draw', 'match', 'sort'],
  takingturns:    ['choose', 'draw', 'match', 'sort'],
  canbymyself:    ['choose', 'draw', 'match', 'sort'],
  politewords:    ['choose', 'draw', 'match', 'sort'],
  drinkwater:     ['choose', 'count', 'graph'],
  firesafety:     ['choose', 'seq'],
  germs:          ['choose', 'seq', 'sort'],
  sunsafety:      ['choose', 'draw', 'sort'],
  waystomove:     ['choose', 'draw', 'match'],
  shadowslight:   ['choose', 'draw', 'shadow'],
  pushpull:       ['choose', 'sort'],
  maps:           ['draw', 'label', 'maze'],
  selfportrait:   ['draw'],
  texturepattern: ['draw', 'pattern'],
  vocabulary:     ['ispy', 'label', 'match'],
  writename:      ['draw', 'tw'],
  labelcaption:   ['draw', 'label'],
  trackprint:     ['dab', 'maze', 'trace'],
  visualmemory:   ['choose', 'draw'],
  logicpuzzles:   ['cut', 'draw']
};

for (const b of PK_BANKS)
  add(b.id, b.name, b.kind, b.area, b,
      b.kind === 'opposites' ? F.opposites : BANK_FORMATS[b.id]);

/* ---------------------------- the one-off skills ---------------------------- */

/* Twenty-four skills that are their own activity: each needs its own maker
   rather than a bank of content. */
add('count100',      'Count to 100 by ones',                    'count100',      MAT, 100, ['code', 'dot', 'maze']);
add('numquantity',   'Match numeral to quantity',               'numQuantity',   MAT, 10,  ['cut', 'dab', 'match', 'roll']);
add('measurelength', 'Measure length with non-standard units',  'measureLength', MAT, null, ['choose', 'count', 'draw']);
add('picturegraph',  'Read a picture graph',                    'pictureGraph',  MAT, null, ['choose', 'graph']);
add('timehour',      'Read time to the hour',                   'timeHour',      MAT, null, ['choose', 'draw', 'match']);
add('halves',        'Recognize halves',                        'halves',        MAT, null, ['choose', 'code', 'draw']);
add('symmetry',      'Recognize symmetry',                      'symmetry',      MAT, null, ['draw', 'match']);
add('equalgroups',   'Make equal groups (sharing fairly)',      'equalGroups',   MAT, null, ['cut', 'draw']);
add('ordersize',     'Order three objects by size',             'orderSize',     MAT, 3,    ['cut', 'seq']);
add('wordproblems',  'Solve simple word problems with pictures','wordProblems',  MAT, null, ['choose', 'count', 'draw']);
add('tally',         'Tally objects in fives',                  'tally',         MAT, 5,    ['graph', 'ispy']);
add('alphaorder',    'Put letters in alphabetical order',       'alphaOrder',    LIT, null, ['cut', 'dot', 'maze']);
add('insidelines',   'Color inside the lines',                  'insideLines',   FIN, null, ['code', 'draw']);
add('copygrid',      'Copy a simple drawing on a grid',         'copyGrid',      FIN, null, ['draw']);
add('pencilpaths',   'Pencil control through narrow paths',     'pencilPaths',   FIN, null, ['maze', 'trace']);
add('tearglue',      'Tearing and gluing paper pieces',         'tearGlue',      FIN, null, ['cut', 'draw']);
add('oddoneout',     'Find the odd one out',                    'oddOneOut',     THK, null, ['odd']);
add('samediff',      'Same and different',                      'sameDifferent', THK, null, ['choose', 'match', 'odd']);
add('spotdiff',      'Spot the differences',                    'spotDiff',      THK, 3,    ['diff']);
add('spotdiff5',     'Spot 5 differences',                      'spotDiff',      THK, 5,    ['diff']);
add('halfpicture',   'Complete the picture half',               'halfPicture',   THK, null, ['draw', 'match']);
add('whatsmissing',  "What's missing from the picture",         'whatsMissing',  THK, null, ['choose', 'draw']);
add('gridcoords',    'Grid coordinates',                        'gridCoords',    THK, null, ['code', 'draw']);
add('simplemaze',    'Solve a simple maze',                     'simpleMaze',    THK, null, ['maze']);

export const PK_SKILLS = skills;
export const PK_SKILL_MAP = Object.fromEntries(skills.map(s => [s.id, s]));

/* Every format any skill uses, for the generator table to key off. */
export const PK_FORMATS = [...new Set(skills.flatMap(s => s.formats))].sort();
