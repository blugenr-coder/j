/* Micro-unit quizzes.
   A topic like Biology is not one thing you practise; it is thirty. This file
   turns one curriculum unit — "Cell Structure", "Photosynthesis", "Plate
   Tectonics" — into a set of question makers that draw on that unit's own
   item bank, so a worksheet titled "Photosynthesis" asks about photosynthesis
   and nothing else.

   A unit supplies:
     facts   [term, meaning]   the recall spine of the unit
     truths  statements that are correct
     myths   statements that are plausible and wrong
   Truths and myths are what turn a vocabulary list into a quiz: they test
   whether the idea is understood, not whether the label was memorised.
   Distractors are drawn from inside the unit, so a wrong answer is always a
   near miss rather than an obviously foreign option. */

import { pick, sample, choice, blankQ, multiQ, matchQ } from './gen-core.js';

const other = (r, list, exclude, n) => sample(r, list.filter(x => x !== exclude), n);

/**
 * Question makers for one unit, in curricular order: recognise, then describe,
 * then recall unaided, then judge a claim.
 *
 * A maker may return null for a difficulty tier it does not suit — unaided
 * recall is not an entry-level task, and `build` simply moves on. That is what
 * makes an easy sheet on a unit read differently from a hard one.
 */
export function unitGenerators(unit) {
  const facts = unit.facts ?? [];
  const truths = unit.truths ?? [];
  const myths = unit.myths ?? [];
  const lexicon = unit.kind === 'lexicon';
  const lang = unit.lang ?? '';
  const terms = facts.map(f => f[0]);
  const meanings = facts.map(f => f[1]);
  const gens = [];

  if (facts.length >= 4) {
    /* Recognise the term from what it describes. */
    gens.push(r => {
      const [term, meaning] = pick(r, facts);
      return choice(r, {
        prompt: lexicon
          ? `How do you say “${meaning}” in ${lang}?`
          : `Which term matches this description? “${meaning}”`,
        correct: term,
        distractors: other(r, terms, term, 3),
        explanation: lexicon
          ? `“${meaning}” is ${term}.`
          : `${term} — ${meaning}.`
      });
    });

    /* Recognise what a term means. */
    gens.push(r => {
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

    /* Recall it unaided. Not an entry-level task. */
    gens.push((r, tier = 2) => {
      if (tier < 2) return null;
      const [term, meaning] = pick(r, facts);
      return blankQ(
        lexicon ? `Write the ${lang} for “${meaning}”.` : `Name the term: ${meaning}.`,
        term,
        { hint: `It begins with “${String(term)[0]}”.`, explanation: `${term} — ${meaning}.` });
    });

    gens.push(r => matchQ(r, {
      prompt: lexicon ? `Match each ${lang} word to its meaning.` : 'Match each term to its meaning.',
      pairs: sample(r, facts, 4).map(([term, meaning]) => ({ left: term, right: meaning })),
      explanation: `${unit.name}: the pairs above are the ones to know.`
    }));
  }

  /* Judge a claim: the questions that separate understanding from recall. */
  if (truths.length >= 1 && myths.length >= 3) {
    gens.push(r => {
      const t = pick(r, truths);
      return choice(r, {
        prompt: `Which statement about ${unit.name.toLowerCase()} is correct?`,
        correct: t,
        distractors: sample(r, myths, 3),
        explanation: t
      });
    });
  }

  if (myths.length >= 1 && truths.length >= 3) {
    gens.push(r => {
      const m = pick(r, myths);
      return choice(r, {
        prompt: `Which statement about ${unit.name.toLowerCase()} is NOT correct?`,
        correct: m,
        distractors: sample(r, truths, 3),
        explanation: `That claim is false. The other three are accurate.`
      });
    });
  }

  if (truths.length >= 2 && myths.length >= 2) {
    gens.push((r, tier = 2) => {
      if (tier < 2) return null;
      return multiQ(r, {
        prompt: `Select every statement about ${unit.name.toLowerCase()} that is true.`,
        correct: sample(r, truths, 2),
        wrong: sample(r, myths, 2),
        explanation: 'Two of the four statements are accurate.'
      });
    });
  }

  /* Weighting, not just membership. `build` cycles the makers in order, so an
     even list gives a twelve-question sheet four judgement questions drawn
     from four truths — which reads as the same question asked over and over.
     Listing the recall shapes twice puts the sheet at roughly two-thirds
     recall, one-third judgement, which is also the balance a real quiz has. */
  /* The three single-item recall shapes are doubled; matching is not, because
     one matching exercise covers four items at once and three of them on a
     twelve-question sheet is a lot of the same activity. */
  const recall = gens.slice(0, Math.min(3, gens.length));
  return gens.length > 4 ? [...gens, ...recall] : gens;
}

/** How many genuinely different sheets a unit can carry (see generated.js). */
export const unitDepth = unit =>
  (unit.facts?.length ?? 0) + (unit.truths?.length ?? 0) + (unit.myths?.length ?? 0);
