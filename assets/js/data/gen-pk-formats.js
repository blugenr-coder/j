/* What a pre-K page asks the child to do.

   gen-pk-content.js decides what the question is about. This file decides what
   it looks like: circle it, dab it, cut it out, trace it, follow it through a
   maze. The catalogue names 24 such formats and pairs each skill with the ones
   that suit it, so a ten frame lands on "count a set of 7" and never on
   "cutting practice: spirals".

   Every format ends in one of the question types the player and the printer
   already understand — choose, select-all, type-the-answer, match, order,
   write — plus an `art` field carrying the picture. One new field instead of
   nine new question types: the marking, the answer key, the progress tracking
   and the translation all keep working, and the only new code downstream is
   the drawing itself.

   The wording lists are not decoration. A child meeting the same skill on
   Tuesday should not meet Monday's sentence, so every instruction is drawn
   from a list and every list is written in the register a four-year-old is
   read aloud.                                                               */

import { choice, multiQ, matchQ, orderQ, writtenQ, blankQ, pick, sample, int } from './gen-core.js';
import { COLOUR_PICS, COLOUR_HEX, G } from './gen-pk-content.js';

/* ------------------------------ the wording ------------------------------ */

const CIRCLE_WAYS = ['Circle every', 'Draw a ring around every', 'Put a circle around every',
  'Find and circle every', 'Colour in every'];
const DAB_WAYS = ['Dab every', 'Put a dot on every', 'Press a sticker on every',
  'Stamp every', 'Mark every'];
/* Counting sentences are whole sentences with a slot, not fragments to glue
   together: "Count the" plus "are there?" reads as "Count the bats are there?",
   which is how a generator quietly teaches broken English. */
const COUNT_WAYS = ['How many {} are there?', 'Count the {}. Write how many.',
  'Write how many {} you can see.', 'Count the {} and write the number.'];
const SPY_WAYS = ['How many can you find?', 'Count them and write how many.',
  'How many are hiding?', 'Find them all and write how many.'];
const fill = (template, x) => template.replace('{}', x);
const WHICH_WAYS = ['Which one', 'Point to the one that', 'Find the one that', 'Choose the one that'];
const MATCH_WAYS = ['Draw a line to join', 'Match', 'Join', 'Draw a line from'];
const CUT_WAYS = ['Cut out the pictures and paste', 'Snip out each picture and glue',
  'Cut and paste', 'Cut out and stick'];
const ORDER_WAYS = ['Put these in order.', 'Number these 1, 2, 3.',
  'Which comes first? Put them all in order.', 'Put the pictures in the right order.',
  'Start with the first one and put them all in order.', 'Which one happens first, and what comes after?'];
const DRAW_WAYS = ['Draw', 'Make a picture of', 'Show with a drawing'];
const TRACE_WAYS = ['Trace', 'Go over', 'Follow the dots to write'];

/* Every one of these is a whole instruction, because a page that repeats one
   sentence forty thousand times is forty thousand copies of the same
   worksheet however many pictures it changes. The shape of the sentence is
   what a child and a teacher actually notice. */
const SORT_WAYS = [
  'Sort the pictures. Which ones go in the "{a}" box?',
  'Two boxes: "{a}" and "{b}". Which pictures belong in "{a}"?',
  'Put each picture where it belongs. Tick the ones for "{a}".',
  'Some of these are "{a}" and some are "{b}". Find all the "{a}" ones.',
  'Tidy these into two groups. Which ones are "{a}"?',
  'Help sort them out: which pictures belong with "{a}" rather than "{b}"?'
];
const TRACE_SAY = [
  'Trace it three times, then write it on your own.',
  'Go over the dotted ones, then have a go on your own.',
  'Trace, trace, trace — then write it by yourself in the last box.',
  'Follow the dots, then write one all by yourself.',
  'Warm up on the dotted ones, then write your own at the end.'
];
const TRACE_ASK = [
  '{t} it, then write which one it is.',
  '{t} the dotted shape. What is it called?',
  'Follow the shape with your finger first, then your pencil. What is it?',
  '{t} it carefully. Write its name underneath.'
];
const CODE_WAYS = [
  'Colour by code. Which colour goes where {s}?',
  'Use the key. What colour is the part where {s}?',
  'Look at the colour key. Which colour is for the one that {s}?',
  'Find it in the key: the one that {s} is coloured what?',
  'Colour the picture by the key. What colour belongs where {s}?'
];
const MAZE_WAYS = [
  'Follow the path. Only step on the ones that {s}. What do you reach?',
  'Find the way through by stepping only where {s}. Where do you come out?',
  'Take the path that {s} all the way along. What is at the end?',
  'Hop along the ones that {s}. What do you land on?'
];
const JOIN_WAYS = [
  '{m} each one to its partner.',
  '{m} the pictures that belong together.',
  'Which goes with which? {m} them up.',
  '{m} every picture to the one it belongs with.'
];
const ODD_WAYS = [
  'Which one does not belong?',
  'Three of these go together. Which one is the odd one out?',
  'One of these is not like the others. Which one?',
  'Cross out the one that does not fit.',
  'Which one should not be here?'
];
const LABEL_WAYS = [
  'Which word names this picture?',
  'Look at the picture. Which word says it?',
  'Say the picture out loud. Which word is it?',
  'Choose the word that goes under this picture.'
];
const ROLL_WAYS = [
  'Roll the die. It shows {n}. How many {x} should you draw?',
  'The die landed on {n}. Draw that many {x} — how many is that?',
  'Roll and count: the die shows {n}. Write how many {x} to draw.',
  'Your roll is {n}. How many {x} does that mean?'
];
const SNIP_WAYS = [
  'Cut along the {c}. Stay on the line all the way.',
  'Snip along the {c}. Try not to wobble off the line.',
  'Follow the {c} with your scissors from one end to the other.',
  'Cut carefully along the {c}. Slow hands cut best.'
];
const GRAPH_MOST = [
  'Which row has the most? Write how many.',
  'Look at the graph. The longest row — how many is it?',
  'Which row is longest? Write the number.',
  'Count the longest row and write how many.'
];

const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const an  = w => (/^[aeiou]/i.test(w) ? 'an' : 'a');

/* Options have to be distinct strings or the choice shell folds them together,
   and two pictures that fold into one make a question with two right answers.
   So options are built from distinct glyphs, and the label goes in the key. */
const glyphOptions = (r, correct, wrong) => {
  const seen = new Set([correct.glyph]);
  const out = [];
  for (const w of wrong) {
    if (seen.has(w.glyph)) continue;
    seen.add(w.glyph); out.push(w.glyph);
    if (out.length === 3) break;
  }
  return out;
};

const labelOptions = (correct, wrong) => {
  const seen = new Set([correct.label]);
  const out = [];
  for (const w of wrong) {
    if (seen.has(w.label)) continue;
    seen.add(w.label); out.push(w.label);
    if (out.length === 3) break;
  }
  return out;
};

/* A picture question is only fair if the wrong pictures are really wrong, so
   anything that shares a glyph with the answer is dropped rather than shown. */
const cleanWrong = (c) => (c.no || []).filter(x => x && x.glyph !== c.target?.glyph);

const art = (kind, extra) => ({ kind, ...extra });

/* ------------------------------ the formats ------------------------------ */

const F = {};

/* choose — one right picture among three wrong ones. */
F.choose = (c, { r, level }) => {
  const correct = c.yes?.[0] ?? c.target;
  const wrong = cleanWrong(c);
  const byGlyph = wrong.some(w => w.glyph !== w.label);
  const opts = byGlyph ? glyphOptions(r, correct, wrong) : labelOptions(correct, wrong);
  const q = choice(r, {
    prompt: `${pick(r, WHICH_WAYS)} ${c.say}?`,
    correct: byGlyph ? correct.glyph : correct.label,
    distractors: opts,
    hint: `Look at each one in turn and say it out loud.`,
    explanation: `${cap(correct.label)} ${c.say}.`
  });
  if (c.story) q.prompt = `${c.story} ${pick(r, WHICH_WAYS).replace(/^Which one$/, 'Which number')} ${c.say}?`;
  q.art = c.shown ? art('row', { items: [...c.shown, { label: '?', glyph: '?' }] })
        : c.graphRows ? art('graph', { rows: c.graphRows })
        : c.clock ? art('clock', { hour: c.clock })
        : c.set ? art('row', { items: c.set })
        : c.item ? art('row', { items: [c.item] }) : null;
  if (level === 0) q.options = q.options.slice(0, Math.max(2, Math.min(3, q.options.length)));
  if (level === 0 && q.answer >= q.options.length) { q.options = q.options.concat([byGlyph ? correct.glyph : correct.label]); q.answer = q.options.length - 1; }
  return q;
};

/* find — circle every one that fits, among ones that do not. */
F.find = (c, { r }) => {
  const yes = sample(r, c.yes ?? [], Math.min(3, (c.yes ?? []).length)).map(x => x.glyph);
  const no  = sample(r, cleanWrong(c), 4).map(x => x.glyph).filter(g => !yes.includes(g));
  const q = multiQ(r, {
    prompt: `${pick(r, CIRCLE_WAYS)} one that ${c.say}.`,
    correct: [...new Set(yes)], wrong: [...new Set(no)],
    hint: 'Check them one at a time. There is more than one.',
    explanation: `There ${yes.length === 1 ? 'is' : 'are'} ${yes.length} that ${c.say}.`
  });
  return q;
};

/* dab — the same hunt, but with a dot marker and bigger targets. */
F.dab = (c, opts) => {
  const q = F.find(c, opts);
  q.prompt = `${pick(opts.r, DAB_WAYS)} one that ${c.say}.`;
  q.art = art('targets', { n: q.options.length });
  return q;
};

/* ispy — how many of the picture are hiding in the scene. */
F.ispy = (c, { r }) => {
  const target = c.target ?? c.yes?.[0];
  const n = int(r, 3, 7);
  const clutter = sample(r, cleanWrong(c).length ? cleanWrong(c) : [G('star', '⭐'), G('dot', '🔵')], 3);
  const cells = [];
  for (let i = 0; i < n; i++) cells.push({ glyph: target.glyph, label: target.label });
  for (let i = 0; i < 10; i++) { const x = pick(r, clutter); cells.push({ glyph: x.glyph, label: x.label }); }
  /* A letter or a numeral is named in quotes; anything else gets an article. */
  const named = /^[A-Za-z0-9]{1,2}$/.test(target.label)
    ? `"${target.label}"` : `${an(target.label)} ${target.label}`;
  return blankQ(
    `I spy ${named}. ${pick(r, SPY_WAYS)}`,
    n,
    {
      art: art('grid', { cols: 5, cells: sample(r, cells, cells.length) }),
      hint: 'Touch each one as you count so you do not count it twice.',
      explanation: `There are ${n}.`
    }
  );
};

/* count — count the row and write the number. */
F.count = (c, { r }) => {
  const item = c.item ?? c.target;
  const n = c.count ?? c.n ?? 5;
  return blankQ(
    fill(pick(r, COUNT_WAYS), item.label),
    n,
    {
      art: art('row', { items: Array.from({ length: n }, () => item) }),
      hint: 'Touch each picture as you count.',
      explanation: `There are ${n} ${item.label}.`
    }
  );
};

/* tenf — a ten frame, the standard picture of a number under ten. */
F.tenf = (c, { r }) => {
  const n = c.count ?? c.n ?? 5;
  const shown = Math.min(10, n);
  return blankQ(
    fill(pick(r, COUNT_WAYS), 'counters in the ten frame'),
    shown,
    {
      art: art('tenframe', { n: shown }),
      hint: 'A full row is five.',
      explanation: `${shown} counters: ${shown > 5 ? `a full row of five and ${shown - 5} more` : `${shown} in the top row`}.`
    }
  );
};

/* match — join each picture to the one it belongs with. */
F.match = (c, { r }) => {
  /* A right-hand item can only serve one left-hand item, and the marker wants
     each left paired with the right authored beside it, so two lefts must never
     share a right. Anything that would repeat is dropped instead. */
  const seen = new Set(), seenLeft = new Set();
  const pairs = (c.pairs ?? []).filter(p => {
    if (!p?.a?.glyph || !p?.b?.glyph) return false;
    if (seen.has(p.b.glyph) || seenLeft.has(p.a.glyph)) return false;
    seen.add(p.b.glyph); seenLeft.add(p.a.glyph); return true;
  }).map(p => ({ left: p.a.glyph, right: p.b.glyph }));
  if (pairs.length < 2) return F.choose(c, { r, level: 1 });
  const q = matchQ(r, {
    prompt: pick(r, JOIN_WAYS).replace('{m}', pick(r, MATCH_WAYS)),
    pairs,
    hint: 'Start with the one you are surest of.',
    explanation: (c.pairs ?? []).filter(p => p?.a?.glyph && seenLeft.has(p.a.glyph))
      .slice(0, 4).map(p => `${p.a.label} → ${p.b.label}`).join('; ')
  });
  return q;
};

/* shadow — join the picture to its own black shape. */
F.shadow = (c, { r }) => {
  const pool = (c.pairs ?? []).map(p => p?.a).concat(c.yes ?? [], c.steps ?? [])
    .filter(x => x && x.glyph && x.label);
  const uniq = []; const seen = new Set();
  for (const x of pool) { if (!seen.has(x.glyph)) { seen.add(x.glyph); uniq.push(x); } }
  const four = uniq.slice(0, 4);
  if (four.length < 2) return F.choose(c, { r, level: 1 });
  const q = matchQ(r, {
    prompt: 'Draw a line from each picture to its shadow.',
    pairs: four.map(x => ({ left: x.glyph, right: x.glyph })),
    hint: 'Look at the outline, not the colour.',
    explanation: four.map(x => `${x.label} → its own shadow`).join('; ')
  });
  /* The right-hand column is the same picture drawn in black, which is what a
     shadow is. The renderer blacks it out rather than shipping a second set of
     pictures that would have to be kept in step with the first. */
  q.shadowRight = true;
  q.art = art('shadow', { items: four });
  return q;
};

/* sort — two labelled boxes, and everything goes in one of them. */
F.sort = (c, { r }) => {
  const groups = c.groups ?? [];
  if (groups.length < 2) return F.find(c, { r });
  const [a, b] = groups;
  /* Sorting is select-all rather than matching: four pictures into two boxes
     means two of them want the same box, and the matcher gives each right-hand
     item to one left-hand item only. */
  const mine  = sample(r, a.items, Math.min(3, a.items.length)).map(x => x.glyph);
  const theirs = sample(r, b.items, Math.min(3, b.items.length)).map(x => x.glyph)
    .filter(g => !mine.includes(g));
  if (!mine.length || !theirs.length || mine.length + theirs.length < 3)
    return F.choose(c, { r, level: 1 });
  const q = multiQ(r, {
    prompt: pick(r, SORT_WAYS).replace('{a}', a.name).replace('{b}', b.name),
    correct: [...new Set(mine)], wrong: [...new Set(theirs)],
    hint: 'Say the picture out loud, then decide which box it goes in.',
    explanation: `${cap(a.name)}: ${a.items.slice(0, 3).map(x => x.label).join(', ')}. The rest go in "${b.name}".`
  });
  q.art = art('boxes', { names: [a.name, b.name] });
  return q;
};

/* cut — the same thinking, done with scissors and glue. */
F.cut = (c, o) => {
  const q = (c.pairs?.length >= 2) ? F.match(c, o)
          : (c.groups?.length >= 2) ? F.sort(c, o)
          : (c.steps?.length >= 3)  ? F.seq(c, o)
          : F.choose(c, o);
  q.prompt = `${pick(o.r, CUT_WAYS)} them in the right place. ${q.prompt}`;
  q.paper = 'cut';
  return q;
};

/* seq — put the pictures in the order they happen. */
F.seq = (c, { r }) => {
  /* Two identical pictures cannot be put in an order anyone could mark, so a
     repeat is dropped rather than shown. */
  const seenStep = new Set();
  const steps = (c.steps ?? []).filter(x => {
    if (!x?.glyph || seenStep.has(x.glyph)) return false;
    seenStep.add(x.glyph); return true;
  }).slice(0, 5);
  if (steps.length < 3) return F.choose(c, { r, level: 1 });
  const q = orderQ(
    `${pick(r, ORDER_WAYS)}`,
    steps.map(s => s.glyph),
    steps.map((s, i) => `${i + 1}. ${s.label}`).join(' '),
    'Which one happens first? Start there.'
  );
  q.art = art('row', { items: steps, numbered: true });
  return q;
};

/* pattern — say what comes next. */
F.pattern = (c, { r }) => {
  const shown = c.shown ?? (c.steps ?? []).slice(0, 4);
  const next = c.next ?? c.target;
  const wrong = cleanWrong(c);
  const q = choice(r, {
    prompt: 'What comes next in the pattern?',
    correct: next.glyph,
    distractors: glyphOptions(r, next, wrong),
    hint: 'Say the pattern out loud from the start.',
    explanation: `The pattern is ${c.code ?? 'repeating'}, so ${next.label} comes next.`
  });
  q.art = art('row', { items: [...shown, { label: '?', glyph: '?' }] });
  return q;
};

/* graph — read a graph made of pictures. */
F.graph = (c, { r }) => {
  const rows = c.graphRows ?? [];
  if (!rows.length) return F.count(c, { r });
  const most = rows.reduce((x, y) => (y.n > x.n ? y : x));
  const askMost = r() < 0.5;
  return blankQ(
    askMost ? pick(r, GRAPH_MOST) : fill(pick(r, COUNT_WAYS), rows[0].label),
    askMost ? most.n : rows[0].n,
    {
      art: art('graph', { rows }),
      hint: 'The longest row has the most.',
      explanation: askMost
        ? `${cap(most.label)} has the most, with ${most.n}.`
        : `There are ${rows[0].n} ${rows[0].label}.`
    }
  );
};

/* roll — roll a die, then do what the number says. */
F.roll = (c, { r }) => {
  const n = int(r, 1, 6);
  const item = c.item ?? c.target;
  return blankQ(
    pick(r, ROLL_WAYS).replace('{n}', n).replace('{x}', item.label),
    n,
    {
      art: art('die', { n }),
      hint: 'Count the dots on the die.',
      explanation: `The die shows ${n}, so draw ${n}.`
    }
  );
};

/* code — colour by code: every answer has a colour. */
F.code = (c, { r }) => {
  const correct = c.yes?.[0] ?? c.target;
  const wrong = cleanWrong(c);
  const names = sample(r, Object.keys(COLOUR_PICS), 4);
  const entries = [correct, ...wrong.slice(0, 3)].filter(Boolean)
    .map((x, i) => ({ code: x.label, colour: names[i], hex: COLOUR_HEX[names[i]] }));
  const q = choice(r, {
    prompt: pick(r, CODE_WAYS).replace('{s}', c.say),
    correct: entries[0].colour,
    distractors: entries.slice(1).map(e => e.colour),
    hint: 'Find the answer in the key first, then read across.',
    explanation: `${cap(correct.label)} is ${entries[0].colour} in the key.`
  });
  q.art = art('key', { entries });
  return q;
};

/* draw — the child answers with a pencil, not a word. */
F.draw = (c, { r }) => {
  const item = c.item ?? c.target;
  const n = c.count ?? c.n ?? null;
  const prompt = n != null
    ? `${pick(r, DRAW_WAYS)} ${n} ${item.label} in the box.`
    : `${pick(r, DRAW_WAYS)} ${an(item.label)} ${item.label} in the box.`;
  const q = writtenQ(
    c.story ? `${c.story} ${prompt}` : prompt,
    n != null ? `${n} ${item.label} drawn in the box` : `a drawing of ${an(item.label)} ${item.label}`,
    n != null ? `Count as you draw, and stop at ${n}.` : `Any clear drawing of ${an(item.label)} ${item.label} is right.`,
    'Draw slowly. Neat is better than fast.'
  );
  q.art = art('box', { hint: item.glyph });
  return q;
};

/* trace — go over the shape of the letter, number or stroke. */
F.trace = (c, { r }) => {
  const text = c.trace ?? c.target?.glyph ?? '';
  if (c.path) {
    const q = writtenQ(
      `${pick(r, TRACE_WAYS)} the ${c.strokeName ?? c.cutName ?? 'line'} from left to right.`,
      `the ${c.strokeName ?? 'line'} traced`,
      'Start at the dot and keep the pencil on the line.',
      'Rest your other hand on the paper to hold it still.'
    );
    q.art = art('path', { d: c.path, name: c.strokeName ?? c.cutName });
    return q;
  }
  return blankQ(
    pick(r, TRACE_ASK).replace('{t}', pick(r, TRACE_WAYS)),
    text,
    {
      art: art('trace', { text, repeats: 4 }),
      hint: 'Start at the top.',
      explanation: `This is ${text}.`
    }
  );
};

/* tw — trace it, then write it on your own. */
F.tw = (c, o) => {
  const q = F.trace(c, o);
  if (q.art?.kind === 'trace') { q.art.repeats = 3; q.art.blanks = 3; }
  q.prompt = pick(o.r, TRACE_SAY);
  return q;
};

/* maze — follow the path, but only through the right ones. */
F.maze = (c, { r }) => {
  const correct = c.yes?.[0] ?? c.target;
  const wrong = cleanWrong(c);
  /* A pre-writing stroke has nothing to choose between: its maze is a path to
     keep the pencil inside, so it is a doing task, not a question. */
  if (c.path || wrong.length < 2) {
    const q = writtenQ(
      `Find the way through. Keep your pencil on the path all the way to the end.`,
      `a line drawn from the start to the end without leaving the path`,
      'Any line that stays inside the path is right.',
      'Look ahead to the end before you start drawing.'
    );
    q.art = art('maze', { from: c.from ?? c.item ?? G('start', '\u{1F3C1}'),
                          to: c.to ?? c.target ?? G('end', '\u{1F3AF}'),
                          d: c.path ?? null });
    return q;
  }
  const from = c.from ?? c.item ?? G('start', '🏁');
  const to = c.to ?? c.target ?? G('end', '🎯');
  const q = choice(r, {
    prompt: pick(r, MAZE_WAYS).replace('{s}', c.say),
    correct: to.glyph === from.glyph ? to.label : to.glyph,
    distractors: to.glyph === from.glyph ? labelOptions(to, wrong) : glyphOptions(r, to, wrong),
    hint: 'Try one step at a time. If it does not fit, go back.',
    explanation: `The path goes through ${correct.label} and reaches ${to.label}.`
  });
  q.art = art('maze', { from, to, step: correct.glyph, blockers: wrong.slice(0, 4).map(x => x.glyph) });
  return q;
};

/* dot — join the dots in order and a picture appears. */
F.dot = (c, { r }) => {
  const labels = (c.dots ?? []).map(String);
  if (labels.length < 4) return F.seq(c, { r });
  const shown = labels.slice(0, Math.min(10, labels.length));
  const q = orderQ(
    'Join the dots in order. Write the order here.',
    sample(r, shown, shown.length),
    shown.join(' → '),
    `Start at ${shown[0]} and look for the next one.`
  );
  q.answer = shown;
  q.art = art('dots', { labels: shown });
  return q;
};

/* snip — scissor practice, which is a doing task, not a thinking one. */
F.snip = (c, { r }) => {
  const q = writtenQ(
    pick(r, SNIP_WAYS).replace('{c}', c.cutName ?? 'line'),
    `cut along the ${c.cutName ?? 'line'}`,
    'Open the scissors wide and turn the paper, not the scissors.',
    'Hold the paper with your other hand and turn it as you cut.'
  );
  q.art = art('path', { d: c.path, name: c.cutName, dashed: true });
  q.paper = 'cut';
  return q;
};

/* odd — three that belong and one that does not. */
F.odd = (c, { r }) => {
  const odd = c.odd ?? c.target;
  const set = c.set ?? (c.yes ?? []).slice(0, 3);
  const q = choice(r, {
    prompt: pick(r, ODD_WAYS),
    correct: odd.glyph,
    distractors: glyphOptions(r, odd, set.length ? set : cleanWrong(c)),
    hint: 'Three of them go together. Which is the stranger?',
    explanation: `${set.map(x => x.label).join(', ')} go together. ${cap(odd.label)} does not.`
  });
  q.art = art('row', { items: [...set, odd] });
  return q;
};

/* diff — two pictures, almost the same. */
F.diff = (c, { r }) => {
  const a = c.sceneA ?? [], b = c.sceneB ?? [];
  const changed = (c.yes ?? []).map(x => x.glyph);
  const same = (c.no ?? []).map(x => x.glyph).filter(g => !changed.includes(g));
  if (!changed.length || !same.length || changed.length + same.length < 3)
    return F.choose(c, { r, level: 1 });
  const q = multiQ(r, {
    prompt: `Look at both pictures. ${pick(r, CIRCLE_WAYS)} thing that changed.`,
    correct: [...new Set(changed)], wrong: [...new Set(same)].slice(0, 4),
    hint: 'Go row by row and compare the same spot in each picture.',
    explanation: `${c.n ?? changed.length} things changed.`
  });
  q.art = art('scene', { a, b });
  return q;
};

/* label — write the word under the picture, with a word bank to choose from. */
F.label = (c, { r }) => {
  const item = c.spell?.[0] ?? c.item ?? c.target;
  const wrong = (c.spell ?? []).slice(1).concat(cleanWrong(c));
  const q = choice(r, {
    prompt: pick(r, LABEL_WAYS),
    correct: item.label,
    distractors: labelOptions(item, wrong),
    hint: 'Say the picture out loud, then look for the first sound.',
    explanation: `The picture is ${an(item.label)} ${item.label}.`
  });
  q.art = art('row', { items: [item], big: true });
  return q;
};

export const PK_FORMATS = F;

/** Build one question for a skill in a given format, or null if unsupported. */
export function questionFor(format, content, opts) {
  const make = F[format];
  if (!make || !content) return null;
  return make(content, opts);
}
