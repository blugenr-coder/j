/* Micro-unit worksheets.
   A topic like Biology is not one thing you practise; it is thirty. This file
   turns one curriculum unit — "Cell Structure", "Photosynthesis", "Plate
   Tectonics" — into the question makers a worksheet on that unit can use, all
   drawing on that unit's own item bank, so a sheet titled "Photosynthesis"
   asks about photosynthesis and nothing else.

   A unit supplies:
     facts        [term, meaning]      the recall spine of the unit
     truths       statements that are correct
     myths        statements that are plausible and wrong
     sequences    [label, [ordered steps]]   optional, where order is the point
     applications [scenario, term]           optional, where transfer is the point

   Truths and myths are what turn a vocabulary list into a quiz: they test
   whether the idea is understood, not whether the label was memorised.
   Distractors come from inside the unit, so a wrong answer is a near miss
   rather than an obviously foreign option — except in the sorting questions,
   where a foreign option is exactly the point.

   Every maker is named and tagged with a kind, because a worksheet is not
   always a mixed quiz: a matching activity, a cloze exercise and a written
   response are different sheets a teacher prints for different lessons, and
   generated.js builds each of them by selecting kinds. */

import { pick, sample, choice, blankQ, multiQ, matchQ, orderQ, writtenQ } from './gen-core.js';

const other = (r, list, exclude, n) => sample(r, list.filter(x => x !== exclude), n);
const lower = s => String(s).charAt(0).toLowerCase() + String(s).slice(1);

/** Escape a term for use inside a regular expression. */
const rx = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Sentences in which one of the unit's own terms appears, so a cloze question
 * can take the term out and ask for it back. Computed once per unit: scanning
 * every truth for every term on each call would be the same work repeated a
 * hundred thousand times.
 */
function clozePairs(facts, truths) {
  const out = [];
  for (const sentence of truths) {
    for (const [term] of facts) {
      if (String(term).length < 4) continue;
      const re = new RegExp(`\\b${rx(term)}\\b`, 'i');
      if (re.test(sentence)) out.push([sentence.replace(re, '______'), term]);
    }
  }
  return out;
}

/**
 * Question makers for one unit.
 *
 * @param unit    the curriculum unit
 * @param foreign { near, far } terms from elsewhere, for the sorting questions:
 *                `near` from another topic in the same subject, `far` from a
 *                different subject entirely. Which one is used depends on the
 *                difficulty tier — telling a biology term from a chemistry one
 *                is a warm-up; telling it from another biology unit is not.
 *
 * A maker may return null for a tier it does not suit — unaided recall is not
 * an entry-level task, and `build` simply moves on. That is what makes an easy
 * sheet on a unit read differently from a hard one.
 */
export function unitGenerators(unit, foreign = { near: [], far: [] }) {
  const facts = unit.facts ?? [];
  const truths = unit.truths ?? [];
  const myths = unit.myths ?? [];
  const sequences = unit.sequences ?? [];
  const applications = unit.applications ?? [];
  const lexicon = unit.kind === 'lexicon';
  const lang = unit.lang ?? '';
  const terms = facts.map(f => f[0]);
  const meanings = facts.map(f => f[1]);
  const name = unit.name;
  const cloze = clozePairs(facts, truths);
  const gens = [];
  /* Each maker declares what it produces and the lowest difficulty tier it
     will run at. Declaring it beats probing it: working the types out by
     calling every maker of every format at every tier cost half a second on
     page load, and a try/catch around a guess is not knowledge. */
  const add = (id, kind, type, minTier, make) =>
    gens.push(Object.assign(make, { id, kind, type, minTier }));

  /* ------------------------------ recognise ------------------------------ */
  if (facts.length >= 4) {
    add('term-from-meaning', 'recognise', 'choice', 1, r => {
      const [term, meaning] = pick(r, facts);
      return choice(r, {
        prompt: lexicon
          ? `How do you say “${meaning}” in ${lang}?`
          : `Which term matches this description? “${meaning}”`,
        correct: term,
        distractors: other(r, terms, term, 3),
        explanation: lexicon ? `“${meaning}” is ${term}.` : `${term} — ${meaning}.`
      });
    });

    add('meaning-from-term', 'recognise', 'choice', 1, r => {
      const [term, meaning] = pick(r, facts);
      return choice(r, {
        prompt: lexicon
          ? `What does “${term}” mean in English?`
          : `Which of these best describes “${term}”?`,
        correct: meaning,
        distractors: other(r, meanings, meaning, 3),
        explanation: `${term} — ${meaning}.`
      });
    });
  }

  /* -------------------------------- recall -------------------------------- */
  if (facts.length >= 4) {
    add('recall-term', 'recall', 'blank', 2, (r, tier = 2) => {
      if (tier < 2) return null;
      const [term, meaning] = pick(r, facts);
      return blankQ(
        lexicon ? `Write the ${lang} for “${meaning}”.` : `Name the term: ${meaning}.`,
        term,
        { hint: `It begins with “${String(term)[0]}”.`, explanation: `${term} — ${meaning}.` });
    });

    /* First-letter recall: the same knowledge, a gentler ask, so an easy sheet
       can still practise unaided recall instead of only recognition. */
    add('recall-hinted', 'recall', 'blank', 1, r => {
      const [term, meaning] = pick(r, facts);
      const t = String(term);
      const shown = t.slice(0, Math.max(1, Math.round(t.length / 3)));
      return blankQ(
        lexicon
          ? `Finish the ${lang} for “${meaning}”: ${shown}…`
          : `Finish the term: ${shown}… — ${meaning}`,
        term,
        { hint: `${t.length} letters, starting “${shown}”.`, explanation: `${term} — ${meaning}.` });
    });
  }

  if (cloze.length) {
    add('cloze', 'cloze', 'blank', 2, (r, tier = 2) => {
      if (tier < 2) return null;
      const [sentence, term] = pick(r, cloze);
      return blankQ(`Complete the sentence: ${sentence}`, term,
        { hint: `It begins with “${String(term)[0]}”.`,
          explanation: sentence.replace('______', term) });
    });
  }

  /* -------------------------------- match -------------------------------- */
  if (facts.length >= 4) {
    add('match-term-meaning', 'match', 'match', 1, r => matchQ(r, {
      prompt: lexicon ? `Match each ${lang} word to its meaning.` : 'Match each term to its meaning.',
      pairs: sample(r, facts, 4).map(([term, meaning]) => ({ left: term, right: meaning })),
      explanation: `${name}: the pairs above are the ones to know.`
    }));

    add('match-meaning-term', 'match', 'match', 2, (r, tier = 2) => {
      if (tier < 2) return null;
      return matchQ(r, {
        prompt: lexicon
          ? `Match each English meaning to its ${lang} word.`
          : 'Match each description to the term it defines.',
        pairs: sample(r, facts, 4).map(([term, meaning]) => ({ left: meaning, right: term })),
        explanation: `${name}: the pairs above are the ones to know.`
      });
    });
  }

  /* -------------------------------- judge -------------------------------- */
  if (truths.length >= 1 && myths.length >= 3) {
    add('pick-truth', 'judge', 'choice', 1, r => {
      const t = pick(r, truths);
      return choice(r, {
        prompt: `Which statement about ${lower(name)} is correct?`,
        correct: t, distractors: sample(r, myths, 3), explanation: t
      });
    });
  }

  if (myths.length >= 1 && truths.length >= 3) {
    add('pick-myth', 'judge', 'choice', 1, r => {
      const m = pick(r, myths);
      return choice(r, {
        prompt: `Which statement about ${lower(name)} is NOT correct?`,
        correct: m, distractors: sample(r, truths, 3),
        explanation: 'That claim is false. The other three are accurate.'
      });
    });
  }

  if (truths.length >= 2 && myths.length >= 2) {
    add('audit-2', 'judge', 'multi', 2, (r, tier = 2) => {
      if (tier < 2) return null;
      return multiQ(r, {
        prompt: `Select every statement about ${lower(name)} that is true.`,
        correct: sample(r, truths, 2), wrong: sample(r, myths, 2),
        explanation: 'Two of the four statements are accurate.'
      });
    });
  }

  if (truths.length >= 3 && myths.length >= 3) {
    add('audit-3', 'judge', 'multi', 3, (r, tier = 2) => {
      if (tier < 3) return null;
      return multiQ(r, {
        prompt: `Three of these six statements about ${lower(name)} are true. Select them.`,
        correct: sample(r, truths, 3), wrong: sample(r, myths, 3),
        explanation: 'Three of the six statements are accurate.'
      });
    });
  }

  /* --------------------------------- sort --------------------------------- */
  if (facts.length >= 3 && (foreign.near.length >= 1 || foreign.far.length >= 1)) {
    add('odd-one-out', 'sort', 'choice', 1, (r, tier = 2) => {
      /* An easy sheet contrasts this unit with a different subject; a harder
         one contrasts it with a neighbouring topic, which is a real judgement
         rather than a spot-the-odd-word puzzle. */
      const pool = tier >= 2 && foreign.near.length ? foreign.near : (foreign.far.length ? foreign.far : foreign.near);
      if (!pool.length) return null;
      const outsider = pick(r, pool);
      const mine = sample(r, terms, 3);
      if (mine.includes(outsider)) return null;
      return choice(r, {
        prompt: `Three of these belong to ${lower(name)}. Which one does not?`,
        correct: outsider, distractors: mine,
        explanation: `${mine.join(', ')} all belong to ${lower(name)}; ${outsider} does not.`
      });
    });
  }

  if (facts.length >= 2 && (foreign.near.length >= 2 || foreign.far.length >= 2)) {
    add('belongs', 'sort', 'multi', 1, (r, tier = 2) => {
      const pool = tier >= 2 && foreign.near.length >= 2 ? foreign.near : foreign.far;
      if (pool.length < 2) return null;
      const mine = sample(r, terms, 2);
      const theirs = sample(r, pool.filter(t => !mine.includes(t)), 2);
      if (theirs.length < 2) return null;
      return multiQ(r, {
        prompt: `Select every term that belongs to ${lower(name)}.`,
        correct: mine, wrong: theirs,
        explanation: `${mine.join(' and ')} belong to this unit; the others do not.`
      });
    });
  }

  /* ------------------------------- sequence ------------------------------- */
  if (sequences.length) {
    add('sequence', 'sequence', 'order', 1, r => {
      const [label, steps] = pick(r, sequences);
      return orderQ(`Put these in the right order: ${label}.`, steps,
        `The correct order is: ${steps.join(' → ')}.`);
    });
  }

  /* --------------------------------- apply --------------------------------- */
  if (applications.length >= 4) {
    add('apply', 'apply', 'choice', 1, r => {
      const [scenario, answer] = pick(r, applications);
      const wrong = applications.filter(a => a[1] !== answer).map(a => a[1]);
      return choice(r, {
        prompt: scenario,
        correct: answer,
        distractors: sample(r, [...new Set([...wrong, ...terms])].filter(t => t !== answer), 3),
        explanation: `${answer} — ${facts.find(f => f[0] === answer)?.[1] ?? 'the term that fits this case'}.`
      });
    });
  }

  /* --------------------------------- write --------------------------------- */
  if (facts.length >= 4) {
    add('define', 'write', 'written', 2, (r, tier = 2) => {
      if (tier < 2) return null;
      const [term, meaning] = pick(r, facts);
      return writtenQ(
        lexicon
          ? `Write a short sentence in ${lang} using “${term}”.`
          : `Define “${term}” in your own words.`,
        lexicon ? `Any correct sentence using ${term} (${meaning}).` : meaning,
        'Marked by you against the key.');
    });
  }

  if (truths.length >= 1) {
    add('explain', 'write', 'written', 3, (r, tier = 2) => {
      if (tier < 3) return null;
      const t = pick(r, truths);
      const key = sample(r, terms, Math.min(3, terms.length));
      return writtenQ(
        `Explain why this is the case: “${t}”`,
        `${t} A full answer uses the key terms: ${key.join(', ')}.`,
        'Marked by you against the key.');
    });
  }

  if (myths.length >= 1) {
    add('correct-the-error', 'write', 'written', 3, (r, tier = 2) => {
      if (tier < 3) return null;
      const m = pick(r, myths);
      return writtenQ(
        `This statement is wrong. Write the correct version: “${m}”`,
        `The statement is false. A correct version contradicts it directly and explains why.`,
        'Marked by you against the key.');
    });
  }

  return gens;
}

const choose = (n, k) => {
  if (k > n || k < 0) return 0;
  let out = 1;
  for (let i = 0; i < k; i++) out = (out * (n - i)) / (i + 1);
  return Math.round(out);
};

/**
 * How many genuinely different questions one maker can pose for a unit.
 * A single-item shape is bounded by the item count. A combinatorial one —
 * matching four of sixteen, selecting three true statements of six — is bounded
 * by the combinations, but only partly: a matching exercise sharing three of
 * its four pairs with another is not really a second question, so the raw
 * combinations are capped well below their arithmetic value.
 */
export function capacityOf(unit, makerId) {
  const f = unit.facts?.length ?? 0;
  const t = unit.truths?.length ?? 0;
  const m = unit.myths?.length ?? 0;
  switch (makerId) {
    case 'term-from-meaning':
    case 'meaning-from-term':
    case 'recall-term':
    case 'recall-hinted':
    case 'define':            return f;
    case 'cloze':             return Math.min(clozePairs(unit.facts ?? [], unit.truths ?? []).length, f);
    case 'match-term-meaning':
    case 'match-meaning-term': return Math.min(choose(f, 4), f * 6);
    case 'pick-truth':        return t;
    case 'pick-myth':
    case 'correct-the-error': return m;
    case 'explain':           return t;
    case 'audit-2':           return Math.min(choose(t, 2) * choose(m, 2), (t + m) * 4);
    case 'audit-3':           return Math.min(choose(t, 3) * choose(m, 3), (t + m) * 4);
    case 'odd-one-out':       return f * 3;
    case 'belongs':           return Math.min(choose(f, 2) * 4, f * 4);
    case 'sequence':          return (unit.sequences ?? []).length * 2;
    case 'apply':             return (unit.applications ?? []).length;
    default:                  return f;
  }
}

/** The kinds a unit can actually produce, for building format-restricted sheets. */
export const kindsOf = gens => [...new Set(gens.map(g => g.kind))];

/**
 * How many genuinely different questions a unit can pose.
 * Single-item shapes are bounded by the item count; the combinatorial ones —
 * matching four of sixteen, selecting three true statements of six — are
 * bounded by the combinations, which is a much larger and equally real number.
 * Counting them as one-per-item, as the first version did, understated a
 * unit's depth by an order of magnitude.
 */
export function unitCapacity(unit, gens) {
  return (gens ?? []).reduce((n, g) => n + capacityOf(unit, g.id), 0);
}
