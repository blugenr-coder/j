/* English drills: one rule, one answer, twenty times.

   The maths and science drills are computation. English has the same shape of
   worksheet and none of the arithmetic: a column of sentences with one comma
   missing, twenty plurals, twenty past tenses. That sheet is the commonest
   thing printed in a primary classroom and the library had no way to make one.

   What replaces "the answer is computed" here is "the answer is in the bank".
   Every maker draws from an authored list of pairs — a contraction and its
   full form, a singular and its plural, a sentence and the mark it needs — so
   a question and its key always come from the same row. tools/check-words.mjs
   then checks the structural half: exactly one option is right, the options
   are distinct, and the answer is not sitting in the prompt already.        */

import { int, pick, sample, choice, blankQ, PEOPLE } from './gen-core.js';

/* --------------------------------- banks --------------------------------- */

/* A sentence, and the mark it should end with. */
export const END_MARKS = [
  ['What time does the bus leave', '?'], ['Please close the door', '.'],
  ['How amazing that was', '!'], ['The library opens at nine', '.'],
  ['Where did you put my coat', '?'], ['Watch out', '!'],
  ['We walked home in the rain', '.'], ['Are you coming with us', '?'],
  ['That is the loudest noise I have ever heard', '!'], ['She reads every evening', '.'],
  ['Who left the tap running', '?'], ['Stop right there', '!'],
  ['The train was late again', '.'], ['Can I borrow your pen', '?'],
  ['What a beautiful morning', '!'], ['He plays the trumpet on Tuesdays', '.'],
  ['Why is the light still on', '?'], ['Come here at once', '!'],
  ['The cat slept on the windowsill', '.'], ['Did you finish your homework', '?']
];

export const MARK_NAMES = [
  ['.', 'full stop'], ['?', 'question mark'], ['!', 'exclamation mark'],
  [',', 'comma'], [';', 'semicolon'], [':', 'colon'],
  ["'", 'apostrophe'], ['"', 'speech marks'], ['-', 'hyphen'], ['…', 'ellipsis']
];

export const CONTRACTIONS = [
  ['do not', "don't"], ['cannot', "can't"], ['is not', "isn't"], ['are not', "aren't"],
  ['was not', "wasn't"], ['were not', "weren't"], ['has not', "hasn't"],
  ['have not', "haven't"], ['had not', "hadn't"], ['will not', "won't"],
  ['would not', "wouldn't"], ['should not', "shouldn't"], ['could not', "couldn't"],
  ['I am', "I'm"], ['you are', "you're"], ['he is', "he's"], ['she is', "she's"],
  ['it is', "it's"], ['we are', "we're"], ['they are', "they're"],
  ['I have', "I've"], ['you have', "you've"], ['we have', "we've"],
  ['I will', "I'll"], ['you will', "you'll"], ['she will', "she'll"],
  ['I would', "I'd"], ['they will', "they'll"], ['let us', "let's"], ['did not', "didn't"]
];

/* Owner, thing owned, and the possessive form. The plural owners are the point:
   "the girls' coats" is the one everyone gets wrong. */
export const POSSESSIVES = [
  ['the dog', 'lead', "the dog's lead"], ['the dogs', 'leads', "the dogs' leads"],
  ['the girl', 'coat', "the girl's coat"], ['the girls', 'coats', "the girls' coats"],
  ['the teacher', 'desk', "the teacher's desk"], ['the teachers', 'desks', "the teachers' desks"],
  ['the child', 'book', "the child's book"], ['the children', 'books', "the children's books"],
  ['the man', 'hat', "the man's hat"], ['the men', 'hats', "the men's hats"],
  ['the baby', 'bottle', "the baby's bottle"], ['the babies', 'bottles', "the babies' bottles"],
  ['James', 'bicycle', "James's bicycle"], ['the class', 'project', "the class's project"],
  ['the school', 'gates', "the school's gates"], ['the schools', 'gates', "the schools' gates"],
  ['the woman', 'bag', "the woman's bag"], ['the women', 'bags', "the women's bags"],
  ['the bird', 'nest', "the bird's nest"], ['the birds', 'nests', "the birds' nests"]
];

/* A sentence with a gap, the word that fills it, and the words that do not.
   Not all of these are strict homophones — affect and effect, lend and borrow,
   moral and morale — but they are the pairs learners actually mix up, which is
   what the sheet is for. */
export const HOMOPHONES = [
  ['___ going to be late for the train.', "They're", ['There', 'Their']],
  ['Put the box over ___.', 'there', ["they're", 'their']],
  ['The children collected ___ coats.', 'their', ['there', "they're"]],
  ['___ car is parked outside.', 'Your', ["You're"]],
  ['___ the fastest runner in the school.', "You're", ['Your']],
  ['The dog wagged ___ tail.', 'its', ["it's"]],
  ['___ raining again.', "It's", ['Its']],
  ['We walked ___ the tunnel.', 'through', ['threw']],
  ['He ___ the ball across the yard.', 'threw', ['through']],
  ['I bought two apples ___.', 'too', ['to', 'two']],
  ['She went ___ the shop.', 'to', ['too', 'two']],
  ['There are ___ cats on the wall.', 'two', ['to', 'too']],
  ['The wind ___ all night.', 'blew', ['blue']],
  ['The sky was a deep ___.', 'blue', ['blew']],
  ['I could ___ the bells ringing.', 'hear', ['here']],
  ['Come and sit over ___.', 'here', ['hear']],
  ['We ate the ___ bag of crisps.', 'whole', ['hole']],
  ['There was a ___ in the fence.', 'hole', ['whole']],
  ['Which ___ did you take?', 'route', ['root']],
  ['The ___ of the tree was rotten.', 'root', ['route']],
  ['They stood in a long ___.', 'queue', ['cue']],
  ['He waited for his ___ to speak.', 'cue', ['queue']],
  ['The knight wore ___ armour.', 'steel', ['steal']],
  ['Do not ___ from the shop.', 'steal', ['steel']],
  ['She has a ___ voice.', 'hoarse', ['horse']],
  ['The ___ galloped across the field.', 'horse', ['hoarse']],
  ['We watched the ___ set.', 'sun', ['son']],
  ['Their ___ is at university.', 'son', ['sun']],
  ['Write your name on this ___ of paper.', 'piece', ['peace']],
  ['The treaty brought ___ at last.', 'peace', ['piece']],
  ['The ___ of the story was clear.', 'moral', ['morale']],
  ['I will ___ you the money.', 'lend', ['borrow']],
  ['May I ___ your ruler?', 'borrow', ['lend']],
  ['The weather had an ___ on the crops.', 'effect', ['affect']],
  ['Cold weather can ___ the crops.', 'affect', ['effect']]
];

const cap = w => `${w[0].toUpperCase()}${w.slice(1)}`;
/* "a exclamation" is the kind of slip that makes a teacher distrust the whole
   sheet, and it happens the moment a word is dropped into a fixed frame. */
const an = w => `${/^[aeiou]/i.test(w) ? 'an' : 'a'} ${w}`;

/* ============================= PUNCTUATION ============================= */
export const punctuation = [
  (r) => { const [text, mark] = pick(r, END_MARKS);
    return choice(r, {
      prompt: `Which mark should end this sentence? “${text}”`,
      correct: mark, distractors: ['.', '?', '!', ','].filter(m => m !== mark),
      hint: mark === '?' ? 'It is asking something.' : mark === '!' ? 'It is said with force.' : 'It simply tells you something.',
      explanation: `“${text}${mark}” is ${mark === '?' ? 'a question' : mark === '!' ? 'an exclamation' : 'a statement'}.`
    }); },

  (r) => { const [mark, name] = pick(r, MARK_NAMES);
    return choice(r, {
      prompt: `What is this punctuation mark called?  ${mark}`,
      correct: name, distractors: MARK_NAMES.filter(([m]) => m !== mark).map(([, n]) => n),
      hint: 'Say what it does in a sentence, then name it.',
      explanation: `That mark is a ${name}.`
    }); },

  (r) => { const items = sample(r, ['apples', 'pears', 'bread', 'milk', 'cheese', 'rice',
                                    'onions', 'flour', 'eggs', 'butter', 'lemons', 'pasta'], 4);
    const correct = `We bought ${items[0]}, ${items[1]}, ${items[2]} and ${items[3]}.`;
    return choice(r, {
      prompt: 'Which sentence uses commas correctly?',
      correct,
      distractors: [
        `We bought ${items[0]} ${items[1]}, ${items[2]}, and ${items[3]}.`,
        `We bought, ${items[0]}, ${items[1]}, ${items[2]} and ${items[3]}.`,
        `We bought ${items[0]}, ${items[1]}, ${items[2]}, and, ${items[3]}.`
      ],
      hint: 'A list takes a comma between the items, not before the first one.',
      explanation: 'The commas separate the items, and the last two are joined by "and".'
    }); },

  (r) => { const who = pick(r, PEOPLE);
    const words = pick(r, ['I am ready', 'We are leaving now', 'It is your turn',
                           'The gate is open', 'Nobody is at home', 'The bus is here']);
    return choice(r, {
      prompt: 'Which sentence uses speech marks correctly?',
      correct: `“${words},” said ${who}.`,
      distractors: [`“${words}” said ${who}.`, `“${words},” Said ${who}.`, `${words}, “said ${who}.”`],
      hint: 'The comma goes inside the speech marks, and the word after them is not a new sentence.',
      explanation: `The spoken words sit inside the marks, the comma with them, and "said" stays lower case.`
    }); },

  (r) => { const clause = pick(r, [
      ['we missed the bus', 'we walked home'], ['it was raining', 'we stayed inside'],
      ['the shop was shut', 'we tried the next one'], ['she was tired', 'she kept going'],
      ['the power failed', 'the lights went out']]);
    return choice(r, {
      prompt: `Which joins these correctly? “${cap(clause[0])}” and “${clause[1]}”`,
      correct: `${cap(clause[0])}, so ${clause[1]}.`,
      distractors: [`${cap(clause[0])} so, ${clause[1]}.`, `${cap(clause[0])}, ${clause[1]}.`,
                    `${cap(clause[0])} ${clause[1]}.`],
      hint: 'Two complete sentences need a joining word, and the comma goes before it.',
      explanation: 'A comma alone cannot join two sentences; a joining word can.'
    }); },

  (r) => { const [text, mark] = pick(r, END_MARKS);
    return blankQ(`Copy this sentence and add the missing mark at the end: “${text}”`,
      `${text}${mark}`,
      { accept: [`${text}${mark}`.toLowerCase()],
        hint: 'Decide whether it tells, asks or exclaims.',
        explanation: `It ends with ${mark === '?' ? 'a question mark' : mark === '!' ? 'an exclamation mark' : 'a full stop'}.` }); },

  (r) => { const noun = pick(r, ['Monday', 'Paris', 'Sarah', 'October', 'Everest', 'Spain',
                                 'Diwali', 'Thursday', 'Cairo', 'Amazon']);
    const common = pick(r, ['mountain', 'river', 'city', 'day', 'month', 'festival', 'teacher', 'street']);
    return choice(r, {
      prompt: `Which word needs a capital letter?`,
      correct: noun, distractors: [common, 'and', 'quickly'],
      hint: 'A name of a particular person, place or day takes a capital.',
      explanation: `${noun} is a proper noun, so it always takes a capital letter.`
    }); },

  (r) => { const pairs = [[';', 'joins two closely linked sentences'],
                          [':', 'introduces a list or an explanation'],
                          [',', 'separates items or marks a pause'],
                          ['-', 'joins two words into one idea']];
    const [mark, job] = pick(r, pairs);
    return choice(r, {
      prompt: `Which mark ${job}?`,
      correct: mark, distractors: pairs.filter(([m]) => m !== mark).map(([m]) => m),
      hint: 'Think about what each mark does between words rather than what it looks like.',
      explanation: `A ${MARK_NAMES.find(([m]) => m === mark)[1]} ${job}.`
    }); },

  (r) => { const s = pick(r, [
      'the concert starts at seven', 'my birthday is in april', 'we visited london last summer',
      'the dog chased the postman', 'she plays hockey on saturdays', 'our teacher is mr patel']);
    const fixed = s.replace(/\b(april|london|saturdays|mr patel)\b/g,
      m => m.split(' ').map(cap).join(' '));
    return blankQ(`Rewrite this sentence with the capital letters and full stop it needs: “${s}”`,
      `${cap(fixed)}.`,
      { accept: [`${cap(fixed)}`],
        hint: 'The first word takes a capital, and so does every name.',
        explanation: `It should read “${cap(fixed)}.”` }); },

  (r) => { const n = int(r, 2, 4);
    const items = sample(r, ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'silver', 'gold'], n);
    return blankQ(`How many commas does this list need? “The flags were ${items.join(', ').replace(/, ([^,]*)$/, ' and $1')}.”`,
      n - 2 < 0 ? 0 : n - 2,
      { hint: 'Count the gaps between items, but not the one filled by "and".',
        explanation: `${n} items need ${n - 2 < 0 ? 0 : n - 2} comma${n - 2 === 1 ? '' : 's'}, because the last gap takes "and".` }); }
];

/* ============================== APOSTROPHES ============================== */
export const apostrophes = [
  (r) => { const [full, short] = pick(r, CONTRACTIONS);
    return blankQ(`Write “${full}” as a contraction.`, short,
      { hint: 'The apostrophe stands in for the missing letters.',
        explanation: `${full} → ${short}.` }); },

  (r) => { const [full, short] = pick(r, CONTRACTIONS);
    return blankQ(`Write “${short}” out in full.`, full,
      { hint: 'Put back the letters the apostrophe replaced.',
        explanation: `${short} → ${full}.` }); },

  (r) => { const [owner, thing, correct] = pick(r, POSSESSIVES);
    return blankQ(`Rewrite “the ${thing} belonging to ${owner}” using an apostrophe.`, correct,
      { hint: owner.endsWith('s') && !['the children', 'the men', 'the women'].includes(owner)
          ? 'A plural already ending in s takes the apostrophe after the s.'
          : 'Add an apostrophe and an s to the owner.',
        explanation: `It is written “${correct}”.` }); },

  (r) => { const [owner, thing, correct] = pick(r, POSSESSIVES);
    const wrong = correct.includes("s'") ? correct.replace("s'", "'s") : correct.replace("'s", "s'");
    return choice(r, {
      prompt: 'Which is written correctly?',
      correct, distractors: [wrong, correct.replace(/'/g, ''), correct.replace(/'s|s'/, "'s's")],
      hint: 'Decide first whether the owner is one or more than one.',
      explanation: `“${correct}” is right: ${owner.endsWith('s') && owner !== 'James' ? 'the owner is plural, so the apostrophe comes after the s' : 'the owner is singular, so it takes an apostrophe and an s'}.`
    }); },

  (r) => { const useIts = r() < 0.5;
    const sentence = useIts ? 'The cat washed ___ paws.' : '___ time to go home.';
    return choice(r, {
      prompt: `Which word fills the gap? “${sentence}”`,
      correct: useIts ? 'its' : "It's",
      distractors: useIts ? ["it's", "its'"] : ['Its', "Its'"],
      hint: "If you can say “it is” instead, it takes an apostrophe.",
      explanation: useIts ? '"Its" shows belonging and takes no apostrophe.' : '"It\'s" is short for "it is".'
    }); },

  /* The apostrophe stands in for letters dropped from the *second* word:
     "do not" keeps "do" and "nt", so the o is what went. Two forms do not
     follow from their spelling at all and are named outright. */
  (r) => { const [full, short] = pick(r, CONTRACTIONS);
    const dropped = (() => {
      const IRREGULAR_DROPS = { "won't": 'o', "can't": 'no' };
      if (IRREGULAR_DROPS[short]) return IRREGULAR_DROPS[short];
      const bare = short.replace(/'/g, '');
      const [w1, w2] = full.split(' ');
      if (!w2 || !bare.toLowerCase().startsWith(w1.toLowerCase())) return 'o';
      /* The kept letters are a subsequence of the second word, not a prefix of
         it: "not" keeps the n and the t and drops the o between them. */
      const kept = bare.slice(w1.length).toLowerCase();
      let j = 0, out = '';
      for (const ch of w2.toLowerCase()) { if (j < kept.length && ch === kept[j]) j++; else out += ch; }
      return out || 'o';
    })();
    return blankQ(`Which letter or letters does the apostrophe replace in “${short}”?`,
      dropped,
      { hint: 'Write out the full form and see which letters are missing from the short one.',
        explanation: `${full} becomes ${short}, so the apostrophe stands in for “${dropped}”.` }); },

  (r) => { const n = int(r, 1, 3);
    const bits = sample(r, ["don't", "it's", "she'll", "we've", "they're", "hasn't", "I'm", "you'd"], n);
    return blankQ(`How many apostrophes are in this sentence? “${cap(bits.join(' and '))} ready.”`,
      n,
      { hint: 'Count the shortened words.',
        explanation: `There ${n === 1 ? 'is' : 'are'} ${n} shortened word${n === 1 ? '' : 's'}, so ${n} apostrophe${n === 1 ? '' : 's'}.` }); },

  (r) => { const plural = pick(r, [['the boys', 'boots'], ['the players', 'shirts'],
      ['the neighbours', 'gardens'], ['the singers', 'voices'], ['the visitors', 'tickets']]);
    return blankQ(`Rewrite “the ${plural[1]} belonging to ${plural[0]}” using an apostrophe.`,
      `${plural[0]}' ${plural[1]}`,
      { hint: 'The owner is plural and already ends in s.',
        explanation: `A plural ending in s takes the apostrophe after the s: ${plural[0]}' ${plural[1]}.` }); },

  (r) => { const [full, short] = pick(r, CONTRACTIONS);
    return choice(r, {
      prompt: `Which is the correct contraction of “${full}”?`,
      correct: short,
      distractors: [short.replace("'", ''), short.replace("'", "' "), `${short.replace("'", '')}'`],
      hint: 'The apostrophe goes exactly where the letters were removed.',
      explanation: `${full} contracts to ${short}.`
    }); },

  (r) => { const words = pick(r, [['cats', 'more than one cat'], ["cat's", 'belonging to one cat'],
      ["cats'", 'belonging to more than one cat']]);
    return choice(r, {
      prompt: `What does “${words[0]}” mean?`,
      correct: words[1],
      distractors: ['more than one cat', 'belonging to one cat', 'belonging to more than one cat']
        .filter(d => d !== words[1]),
      hint: 'An apostrophe never makes a plural.',
      explanation: `“${words[0]}” means ${words[1]}.`
    }); }
];

/* =============================== HOMOPHONES =============================== */
export const homophones = [
  (r) => { const [gap, right, wrong] = pick(r, HOMOPHONES);
    return choice(r, {
      prompt: `Which word fills the gap? “${gap}”`,
      correct: right, distractors: wrong,
      hint: 'Read the sentence with each word in turn and listen for the one that makes sense.',
      explanation: `“${gap.replace('___', right)}”`
    }); },

  (r) => { const [gap, right] = pick(r, HOMOPHONES);
    return blankQ(`Fill the gap with the right word: “${gap}”`, right,
      { hint: 'The words sound the same, so the meaning has to decide it.',
        explanation: `“${gap.replace('___', right)}”` }); },

  (r) => { const [gap, right, wrong] = pick(r, HOMOPHONES);
    const bad = wrong[0];
    return blankQ(`This sentence uses the wrong word. Write the right one: “${gap.replace('___', bad)}”`,
      right,
      { hint: `“${bad}” sounds right but means something else.`,
        explanation: `It should be “${right}”: ${gap.replace('___', right)}` }); },

  (r) => { const pairs = [['their', 'belonging to them'], ['there', 'in that place'],
      ["they're", 'they are'], ['your', 'belonging to you'], ["you're", 'you are'],
      ['its', 'belonging to it'], ["it's", 'it is'], ['to', 'towards'], ['too', 'as well'],
      ['two', 'the number 2'], ['hear', 'to listen'], ['here', 'in this place'],
      ['whole', 'complete'], ['hole', 'a gap'], ['piece', 'a part'], ['peace', 'calm']];
    const [word, meaning] = pick(r, pairs);
    return choice(r, {
      prompt: `What does “${word}” mean?`,
      correct: meaning,
      distractors: sample(r, pairs.filter(([w]) => w !== word).map(([, m]) => m), 3),
      hint: 'Say the word in a sentence of your own first.',
      explanation: `“${word}” means ${meaning}.`
    }); },

  (r) => { const sets = [['their', 'there', "they're"], ['your', "you're"], ['its', "it's"],
      ['to', 'too', 'two'], ['hear', 'here'], ['whole', 'hole'], ['piece', 'peace'],
      ['blue', 'blew'], ['threw', 'through'], ['horse', 'hoarse'], ['steal', 'steel'],
      ['sun', 'son'], ['route', 'root'], ['queue', 'cue']];
    const set = pick(r, sets);
    return blankQ(`How many words sound like “${set[0]}” in this group: ${set.join(', ')}?`,
      set.length - 1,
      { hint: 'Count the others, not the word itself.',
        explanation: `The group has ${set.length} words, so ${set.length - 1} sound${set.length - 1 === 1 ? 's' : ''} like it.` }); },

  (r) => { const [gap, right, wrong] = pick(r, HOMOPHONES);
    return choice(r, {
      prompt: 'Which sentence is written correctly?',
      correct: gap.replace('___', right),
      distractors: wrong.map(w => gap.replace('___', w)),
      hint: 'Only one spelling carries the meaning the sentence needs.',
      explanation: `“${gap.replace('___', right)}” is the one that makes sense.`
    }); }
];

/* ========================= PREFIXES AND SUFFIXES ========================= */
export const PREFIXES = [
  ['un', 'not', 'unhappy'], ['re', 'again', 'rewrite'], ['dis', 'not or opposite', 'disagree'],
  ['pre', 'before', 'preview'], ['mis', 'wrongly', 'misread'], ['sub', 'under', 'submarine'],
  ['inter', 'between', 'international'], ['super', 'above or beyond', 'supermarket'],
  ['anti', 'against', 'antifreeze'], ['auto', 'self', 'autograph'], ['tele', 'far off', 'telephone'],
  ['non', 'not', 'nonsense'], ['over', 'too much', 'overcook'], ['under', 'too little', 'undercook'],
  ['bi', 'two', 'bicycle'], ['tri', 'three', 'triangle'], ['micro', 'very small', 'microscope'],
  ['trans', 'across', 'transport'], ['ex', 'out of or former', 'exit'], ['co', 'together', 'cooperate']
];
export const SUFFIXES = [
  ['ful', 'full of', 'hopeful'], ['less', 'without', 'hopeless'], ['ly', 'in that way', 'quickly'],
  ['ness', 'the state of being', 'kindness'], ['ment', 'the result of', 'enjoyment'],
  ['able', 'able to be', 'readable'], ['er', 'a person who', 'teacher'],
  ['tion', 'the act of', 'creation'], ['ous', 'full of', 'dangerous'], ['ish', 'somewhat', 'reddish'],
  ['est', 'the most', 'tallest'], ['ing', 'happening now', 'running'], ['ed', 'happened before', 'walked'],
  ['ist', 'a person who', 'artist'], ['ology', 'the study of', 'biology'], ['hood', 'the state of', 'childhood']
];
export const OPPOSITES = [
  ['happy', 'unhappy'], ['kind', 'unkind'], ['fair', 'unfair'], ['agree', 'disagree'],
  ['appear', 'disappear'], ['possible', 'impossible'], ['polite', 'impolite'],
  ['correct', 'incorrect'], ['visible', 'invisible'], ['legal', 'illegal'],
  ['regular', 'irregular'], ['responsible', 'irresponsible'], ['patient', 'impatient'],
  ['comfortable', 'uncomfortable'], ['honest', 'dishonest'], ['loyal', 'disloyal']
];

export const prefixsuffix = [
  (r) => { const [p, meaning] = pick(r, PREFIXES);
    return choice(r, {
      prompt: `What does the prefix “${p}-” mean?`,
      correct: meaning,
      distractors: sample(r, PREFIXES.filter(([q]) => q !== p).map(([, m]) => m), 3),
      hint: 'Think of a word that starts with it and what that word means.',
      explanation: `“${p}-” means ${meaning}, as in ${PREFIXES.find(([q]) => q === p)[2]}.`
    }); },

  (r) => { const [suf, meaning] = pick(r, SUFFIXES);
    return choice(r, {
      prompt: `What does the suffix “-${suf}” mean?`,
      correct: meaning,
      distractors: sample(r, SUFFIXES.filter(([q]) => q !== suf).map(([, m]) => m), 3),
      hint: 'Think of a word that ends with it.',
      explanation: `“-${suf}” means ${meaning}, as in ${SUFFIXES.find(([q]) => q === suf)[2]}.`
    }); },

  (r) => { const [word, opposite] = pick(r, OPPOSITES);
    return blankQ(`Add a prefix to “${word}” to make its opposite.`, opposite,
      { hint: 'Try un-, dis-, in-, im- or ir- and listen for the one that sounds right.',
        explanation: `${word} → ${opposite}.` }); },

  (r) => { const [word, opposite] = pick(r, OPPOSITES);
    return blankQ(`What is the root word inside “${opposite}”?`, word,
      { hint: 'Take the prefix off the front.',
        explanation: `${opposite} is ${opposite.slice(0, opposite.length - word.length)} + ${word}.` }); },

  (r) => { const [suf, , example] = pick(r, SUFFIXES);
    const root = example.slice(0, example.length - suf.length);
    return blankQ(`What is the root word inside “${example}”?`, root,
      { hint: 'Take the ending off.',
        explanation: `${example} is ${root} + -${suf}.` }); },

  (r) => { const [p, meaning] = pick(r, PREFIXES);
    return choice(r, {
      prompt: `Which prefix means “${meaning}”?`,
      correct: `${p}-`,
      distractors: sample(r, PREFIXES.filter(([q, m]) => q !== p && m !== meaning).map(([q]) => `${q}-`), 3),
      hint: 'Say each one at the front of a word you know.',
      explanation: `“${p}-” means ${meaning}.`
    }); },

  (r) => { const [suf, meaning, example] = pick(r, SUFFIXES);
    return choice(r, {
      prompt: `Which word uses the suffix “-${suf}”?`,
      correct: example,
      distractors: sample(r, SUFFIXES.filter(([q]) => q !== suf).map(([, , e]) => e), 3),
      hint: 'Look at the last few letters of each word.',
      explanation: `${example} ends in -${suf}, meaning ${meaning}.`
    }); },

  (r) => { const [word] = pick(r, [['hope'], ['care'], ['use'], ['help'], ['power'], ['thought'],
      ['harm'], ['fear'], ['pain'], ['taste'], ['colour'], ['rest']]);
    const full = r() < 0.5;
    return blankQ(`Add ${full ? '“-ful”' : '“-less”'} to “${word}” and write the new word.`,
      `${word}${full ? 'ful' : 'less'}`,
      { hint: full ? '"-ful" means full of it.' : '"-less" means without it.',
        explanation: `${word} + -${full ? 'ful' : 'less'} = ${word}${full ? 'ful' : 'less'}.` }); },

  (r) => { const [p, , example] = pick(r, PREFIXES);
    return blankQ(`Which prefix is at the start of “${example}”?`, `${p}-`,
      { accept: [p],
        hint: 'Split the word where the root begins.',
        explanation: `${example} starts with the prefix ${p}-.` }); },

  (r) => { const words = [['teach', 'teacher'], ['paint', 'painter'], ['sing', 'singer'],
      ['farm', 'farmer'], ['write', 'writer'], ['drive', 'driver'], ['bake', 'baker'],
      ['build', 'builder'], ['climb', 'climber'], ['dance', 'dancer']];
    const [verb, person] = pick(r, words);
    return blankQ(`Add “-er” to “${verb}” to name the person who does it.`, person,
      { hint: 'A silent e at the end is dropped before -er.',
        explanation: `${verb} → ${person}.` }); }
];

/* ============================== WORD CLASSES ============================== */
export const CLASSES = {
  noun: ['bridge', 'lantern', 'harbour', 'garden', 'thunder', 'kitchen', 'forest', 'letter',
         'window', 'village', 'ladder', 'basket', 'tiger', 'castle', 'river', 'pencil'],
  verb: ['sprint', 'whisper', 'gather', 'stumble', 'polish', 'wander', 'shiver', 'scatter',
         'imagine', 'balance', 'rescue', 'tumble', 'search', 'invent', 'follow', 'climb'],
  adjective: ['brittle', 'gentle', 'enormous', 'silent', 'golden', 'clumsy', 'ancient',
              'fierce', 'narrow', 'bitter', 'cheerful', 'hollow', 'sudden', 'polite'],
  adverb: ['quickly', 'silently', 'often', 'nearly', 'boldly', 'rarely', 'gently', 'soon',
           'carefully', 'always', 'suddenly', 'quietly', 'hardly', 'loudly'],
  preposition: ['under', 'beside', 'through', 'between', 'above', 'towards', 'behind',
                'during', 'across', 'within', 'beneath', 'against'],
  pronoun: ['she', 'they', 'him', 'ours', 'itself', 'we', 'yours', 'them', 'hers', 'us'],
  conjunction: ['because', 'although', 'unless', 'while', 'whereas', 'since', 'but', 'yet']
};
const CLASS_NAMES = Object.keys(CLASSES);

/* Sentences written out, not assembled from the lists above. Picking one word
   from each list gave "The golden kitchen tumbles hardly", and a question
   about word classes has to be asked about a sentence that means something. */
export const LABELLED = [
  ['The nervous rider mounted carefully.',
    { adjective: 'nervous', noun: 'rider', verb: 'mounted', adverb: 'carefully' }],
  ['The ancient bridge creaked loudly.',
    { adjective: 'ancient', noun: 'bridge', verb: 'creaked', adverb: 'loudly' }],
  ['A hungry fox crept silently.',
    { adjective: 'hungry', noun: 'fox', verb: 'crept', adverb: 'silently' }],
  ['The narrow river flowed quickly.',
    { adjective: 'narrow', noun: 'river', verb: 'flowed', adverb: 'quickly' }],
  ['The cheerful gardener worked steadily.',
    { adjective: 'cheerful', noun: 'gardener', verb: 'worked', adverb: 'steadily' }],
  ['A sudden storm arrived early.',
    { adjective: 'sudden', noun: 'storm', verb: 'arrived', adverb: 'early' }],
  ['The clumsy waiter dropped everything.',
    { adjective: 'clumsy', noun: 'waiter', verb: 'dropped', adverb: 'everything' }],
  ['The silent library closed suddenly.',
    { adjective: 'silent', noun: 'library', verb: 'closed', adverb: 'suddenly' }],
  ['A golden eagle circled slowly.',
    { adjective: 'golden', noun: 'eagle', verb: 'circled', adverb: 'slowly' }],
  ['The bitter wind blew fiercely.',
    { adjective: 'bitter', noun: 'wind', verb: 'blew', adverb: 'fiercely' }],
  ['The polite visitor waited patiently.',
    { adjective: 'polite', noun: 'visitor', verb: 'waited', adverb: 'patiently' }],
  ['A fierce dog barked constantly.',
    { adjective: 'fierce', noun: 'dog', verb: 'barked', adverb: 'constantly' }],
  ['The enormous lorry reversed carefully.',
    { adjective: 'enormous', noun: 'lorry', verb: 'reversed', adverb: 'carefully' }],
  ['The hollow drum sounded strangely.',
    { adjective: 'hollow', noun: 'drum', verb: 'sounded', adverb: 'strangely' }],
  ['A gentle rain fell softly.',
    { adjective: 'gentle', noun: 'rain', verb: 'fell', adverb: 'softly' }],
  ['The brittle branch snapped instantly.',
    { adjective: 'brittle', noun: 'branch', verb: 'snapped', adverb: 'instantly' }]
];
const PLACES = ['the table', 'the bridge', 'the window', 'the fence', 'the wall',
                'the box', 'the door', 'the gate', 'the hedge', 'the shelf'];
/* Each joining word with a sentence it actually fits. */
export const CONJ_FRAMES = [
  ['because', 'We stayed inside because it was raining.'],
  ['although', 'We went out although it was raining.'],
  ['unless', 'We will go out unless it rains.'],
  ['while', 'She read a book while the kettle boiled.'],
  ['whereas', 'He likes cycling whereas his brother prefers running.'],
  ['since', 'They have been waiting since the bell rang.'],
  ['but', 'The shop was open but the bakery was shut.'],
  ['yet', 'It was cold yet nobody wore a coat.']
];

export const wordclasses = [
  (r) => { const cls = pick(r, CLASS_NAMES), word = pick(r, CLASSES[cls]);
    return choice(r, {
      prompt: `What kind of word is “${word}”?`,
      correct: cls, distractors: sample(r, CLASS_NAMES.filter(c => c !== cls), 3),
      hint: 'Ask what job it does in a sentence: names, does, describes or joins.',
      explanation: `“${word}” is a ${cls}.`
    }); },

  (r) => { const cls = pick(r, CLASS_NAMES), word = pick(r, CLASSES[cls]);
    const others = sample(r, CLASS_NAMES.filter(c => c !== cls), 3).map(c => pick(r, CLASSES[c]));
    return choice(r, {
      prompt: `Which of these is a ${cls}?`,
      correct: word, distractors: others,
      hint: `A ${cls} ${cls === 'noun' ? 'names something' : cls === 'verb' ? 'is something you do' : cls === 'adjective' ? 'describes a noun' : cls === 'adverb' ? 'describes how something is done' : cls === 'preposition' ? 'shows where or when' : cls === 'pronoun' ? 'stands in for a noun' : 'joins two parts of a sentence'}.`,
      explanation: `“${word}” is the ${cls}.`
    }); },

  (r) => { const [sentence, parts] = pick(r, LABELLED);
    const want = pick(r, ['adjective', 'noun', 'verb', 'adverb']);
    const answer = parts[want];
    return blankQ(`Write the ${want} in this sentence: “${sentence}”`, answer,
      { hint: `The ${want} ${want === 'noun' ? 'names the thing' : want === 'verb' ? 'says what happens' : want === 'adjective' ? 'describes the noun' : 'says how it happens'}.`,
        explanation: `The ${want} is “${answer}”.` }); },

  (r) => { const adj = pick(r, CLASSES.adjective);
    return blankQ(`“${cap(adj)}” describes a noun. What kind of word is it?`, 'adjective',
      { hint: 'A word that describes a noun has one name.',
        explanation: `A word that describes a noun is an adjective.` }); },

  (r) => { const cls = pick(r, ['noun', 'verb', 'adjective', 'adverb']);
    const three = sample(r, CLASSES[cls], 3);
    const odd = pick(r, CLASSES[pick(r, CLASS_NAMES.filter(c => c !== cls))]);
    return choice(r, {
      prompt: `Three of these are ${cls}s. Which one is not?`,
      correct: odd, distractors: three,
      hint: `Test each one: can it be used as a ${cls}?`,
      explanation: `${three.join(', ')} are ${cls}s; “${odd}” is not.`
    }); },

  (r) => { const [sentence, parts] = pick(r, LABELLED);
    return blankQ(`Which word in “${sentence}” is the adverb?`, parts.adverb,
      { hint: 'The adverb says how the action was done.',
        explanation: `“${parts.adverb}” tells you how it happened.` }); },

  (r) => { const prep = pick(r, CLASSES.preposition), place = pick(r, PLACES);
    return blankQ(`In “the cat sat ${prep} ${place}”, which word is the preposition?`, prep,
      { hint: 'A preposition tells you where or when.',
        explanation: `“${prep}” tells you where the cat sat.` }); },

  (r) => { const [conj, sentence] = pick(r, CONJ_FRAMES);
    return blankQ(`Which word joins the two halves of this sentence? “${sentence}”`, conj,
      { hint: 'The joining word sits between the two halves.',
        explanation: `“${conj}” joins the two halves.` }); },

  (r) => { const noun = pick(r, CLASSES.noun);
    return choice(r, {
      prompt: `Which pronoun could replace “the ${noun}” in a sentence?`,
      correct: 'it', distractors: ['they', 'we', 'you'],
      hint: 'A single thing, not a person, takes one particular pronoun.',
      explanation: `A single object is replaced by “it”.`
    }); },

  (r) => { const adj = pick(r, CLASSES.adjective);
    const adv = `${adj.endsWith('le') ? `${adj.slice(0, -1)}y` : adj.endsWith('y') ? `${adj.slice(0, -1)}ily` : `${adj}ly`}`;
    return blankQ(`Turn the adjective “${adj}” into an adverb.`, adv,
      { hint: 'Most adverbs end in -ly, but a word ending in -le or -y changes first.',
        explanation: `${adj} → ${adv}.` }); }
];

/* ================================ TENSES ================================ */
/* Base form, simple past, past participle. */
export const IRREGULAR = [
  ['go', 'went', 'gone'], ['see', 'saw', 'seen'], ['take', 'took', 'taken'],
  ['write', 'wrote', 'written'], ['eat', 'ate', 'eaten'], ['give', 'gave', 'given'],
  ['break', 'broke', 'broken'], ['speak', 'spoke', 'spoken'], ['choose', 'chose', 'chosen'],
  ['drive', 'drove', 'driven'], ['ride', 'rode', 'ridden'], ['rise', 'rose', 'risen'],
  ['begin', 'began', 'begun'], ['drink', 'drank', 'drunk'], ['swim', 'swam', 'swum'],
  ['sing', 'sang', 'sung'], ['ring', 'rang', 'rung'], ['run', 'ran', 'run'],
  ['come', 'came', 'come'], ['become', 'became', 'become'], ['bring', 'brought', 'brought'],
  ['buy', 'bought', 'bought'], ['catch', 'caught', 'caught'], ['teach', 'taught', 'taught'],
  ['think', 'thought', 'thought'], ['keep', 'kept', 'kept'], ['sleep', 'slept', 'slept'],
  ['leave', 'left', 'left'], ['feel', 'felt', 'felt'], ['find', 'found', 'found'],
  ['hold', 'held', 'held'], ['stand', 'stood', 'stood'], ['understand', 'understood', 'understood'],
  ['make', 'made', 'made'], ['say', 'said', 'said'], ['tell', 'told', 'told'],
  ['fly', 'flew', 'flown'], ['grow', 'grew', 'grown'], ['know', 'knew', 'known'],
  ['throw', 'threw', 'thrown'], ['wear', 'wore', 'worn'], ['tear', 'tore', 'torn']
];
const REGULAR = ['walk', 'jump', 'play', 'watch', 'paint', 'clean', 'open', 'call',
                 'help', 'talk', 'work', 'listen', 'answer', 'follow', 'plant'];

export const tenses = [
  (r) => { const [base, past] = pick(r, IRREGULAR);
    return blankQ(`Write the past tense of “${base}”.`, past,
      { hint: 'This verb does not simply add -ed.',
        explanation: `${base} → ${past}.` }); },

  (r) => { const [base, past, part] = pick(r, IRREGULAR);
    return blankQ(`Complete the sentence: “I have ___ it.” Use the verb “${base}”.`, part,
      { hint: 'After "have" a verb takes its past participle.',
        explanation: `${base} → ${past} → have ${part}.` }); },

  (r) => { const base = pick(r, REGULAR);
    return blankQ(`Write the past tense of “${base}”.`, `${base}ed`,
      { hint: 'A regular verb adds -ed.',
        explanation: `${base} + -ed = ${base}ed.` }); },

  (r) => { const base = pick(r, REGULAR);
    return blankQ(`Write “${base}” in the present continuous, as in “is ___”.`,
      `${base}ing`,
      { hint: 'Add -ing to the base form.',
        explanation: `${base} + -ing = ${base}ing.` }); },

  (r) => { const [base, past] = pick(r, IRREGULAR);
    return choice(r, {
      prompt: `Which is the past tense of “${base}”?`,
      correct: past,
      distractors: [`${base}ed`, `${base}d`, sample(r, IRREGULAR.filter(([b]) => b !== base), 1)[0][1]],
      hint: 'Irregular verbs change their spelling instead of adding -ed.',
      explanation: `The past tense of ${base} is ${past}.`
    }); },

  (r) => { const who = pick(r, PEOPLE);
    const frames = [
      [`${who} walks to school every day.`, 'present'],
      [`${who} walked to school yesterday.`, 'past'],
      [`${who} will walk to school tomorrow.`, 'future'],
      [`${who} is walking to school now.`, 'present'],
      [`${who} had walked to school before the bell.`, 'past'],
      [`${who} is going to walk to school later.`, 'future']];
    const [sentence, tense] = pick(r, frames);
    return choice(r, {
      prompt: `What tense is this sentence in? “${sentence}”`,
      correct: tense, distractors: ['past', 'present', 'future'].filter(t => t !== tense),
      hint: 'Look for a time word and at the form of the verb.',
      explanation: `“${sentence}” is in the ${tense}.`
    }); },

  (r) => { const [base, past] = pick(r, IRREGULAR);
    return blankQ(`This sentence is in the present. Rewrite the verb in the past: “They ${base} every week.”`,
      past,
      { hint: 'Only the verb changes.',
        explanation: `They ${past} every week.` }); },

  (r) => { const base = pick(r, REGULAR);
    return blankQ(`Write “${base}” in the future, as in “will ___”.`, base,
      { hint: 'After "will" the verb keeps its base form.',
        explanation: `will ${base}.` }); },

  (r) => { const [base, past, part] = pick(r, IRREGULAR);
    return choice(r, {
      prompt: `Which form goes after “have”? “I have ___.”`,
      correct: part, distractors: [base, past, `${base}ed`].filter(f => f !== part),
      hint: 'The form after "have" is the past participle.',
      explanation: `I have ${part}.`
    }); },

  (r) => { const [base, past, part] = pick(r, IRREGULAR);
    return blankQ(`Write the three forms of “${base}”: base, past, past participle. Separate them with commas.`,
      `${base}, ${past}, ${part}`,
      { accept: [`${base},${past},${part}`, `${base} ${past} ${part}`],
        hint: 'Say "today I …, yesterday I …, I have …".',
        explanation: `${base}, ${past}, ${part}.` }); },

  (r) => { const base = pick(r, ['stop', 'plan', 'drop', 'chat', 'grab', 'hop', 'rub', 'clap']);
    return blankQ(`Write the past tense of “${base}”.`, `${base}${base[base.length - 1]}ed`,
      { hint: 'A short word ending in one vowel and one consonant doubles the last letter.',
        explanation: `${base} → ${base}${base[base.length - 1]}ed.` }); }
];

/* =============================== PLURALS =============================== */
export const PLURALS = [
  ['cat', 'cats', 'add -s'], ['dog', 'dogs', 'add -s'], ['book', 'books', 'add -s'],
  ['box', 'boxes', 'add -es after x'], ['bus', 'buses', 'add -es after s'],
  ['brush', 'brushes', 'add -es after sh'], ['church', 'churches', 'add -es after ch'],
  ['glass', 'glasses', 'add -es after ss'], ['fox', 'foxes', 'add -es after x'],
  ['baby', 'babies', 'change y to ies'], ['city', 'cities', 'change y to ies'],
  ['story', 'stories', 'change y to ies'], ['party', 'parties', 'change y to ies'],
  ['leaf', 'leaves', 'change f to ves'], ['knife', 'knives', 'change fe to ves'],
  ['wolf', 'wolves', 'change f to ves'], ['shelf', 'shelves', 'change f to ves'],
  ['child', 'children', 'irregular'], ['man', 'men', 'irregular'], ['woman', 'women', 'irregular'],
  ['tooth', 'teeth', 'irregular'], ['foot', 'feet', 'irregular'], ['mouse', 'mice', 'irregular'],
  ['goose', 'geese', 'irregular'], ['person', 'people', 'irregular'],
  ['sheep', 'sheep', 'no change'], ['deer', 'deer', 'no change'], ['fish', 'fish', 'no change'],
  ['tomato', 'tomatoes', 'add -es after o'], ['potato', 'potatoes', 'add -es after o'],
  ['piano', 'pianos', 'add -s after o'], ['photo', 'photos', 'add -s after o']
];
const PLURAL_RULES = [...new Set(PLURALS.map(p => p[2]))];

export const plurals = [
  (r) => { const [one, many] = pick(r, PLURALS);
    return blankQ(`Write the plural of “${one}”.`, many,
      { hint: 'Look at the last letter or two before you decide.',
        explanation: `${one} → ${many}.` }); },

  (r) => { const [one, many] = pick(r, PLURALS);
    return blankQ(`Write the singular of “${many}”.`, one,
      { hint: 'Work backwards from the plural.',
        explanation: `${many} → ${one}.` }); },

  (r) => { const [one, many, rule] = pick(r, PLURALS);
    return choice(r, {
      prompt: `Which rule makes the plural of “${one}”?`,
      correct: rule, distractors: sample(r, PLURAL_RULES.filter(x => x !== rule), 3),
      hint: 'The ending of the singular decides the rule.',
      explanation: `${one} → ${many}: ${rule}.`
    }); },

  (r) => { const [one, many] = pick(r, PLURALS);
    return choice(r, {
      prompt: `Which is the correct plural of “${one}”?`,
      correct: many,
      distractors: [`${one}s`, `${one}es`, `${one}'s`].filter(d => d !== many),
      hint: 'An apostrophe never makes a plural.',
      explanation: `The plural of ${one} is ${many}.`
    }); },

  (r) => { const rule = pick(r, PLURAL_RULES);
    const match = PLURALS.filter(p => p[2] === rule);
    const [one, many] = pick(r, match);
    return choice(r, {
      prompt: `Which word makes its plural by this rule: ${rule}?`,
      correct: one,
      distractors: sample(r, PLURALS.filter(p => p[2] !== rule).map(p => p[0]), 3),
      hint: 'Try the rule on each word and see which one it fits.',
      explanation: `${one} → ${many}, which is “${rule}”.`
    }); },

  (r) => { const irregular = PLURALS.filter(p => p[2] === 'irregular');
    const [one, many] = pick(r, irregular);
    return blankQ(`“${cap(one)}” has an irregular plural. Write it.`, many,
      { hint: 'This one does not follow any rule; it has to be learned.',
        explanation: `${one} → ${many}.` }); },

  (r) => { const unchanged = PLURALS.filter(p => p[2] === 'no change');
    const [one] = pick(r, unchanged);
    return blankQ(`Write the plural of “${one}”.`, one,
      { hint: 'Some words look the same whether there is one or many.',
        explanation: `The plural of ${one} is ${one}.` }); },

  (r) => { const [one, many] = pick(r, PLURALS.filter(p => p[2].includes('y to ies')));
    return blankQ(`Write the plural of “${one}”.`, many,
      { hint: 'A word ending in a consonant then y drops the y and adds -ies.',
        explanation: `${one} → ${many}.` }); },

  /* The count is worked out from the same choices that render the list. The
     first version of this maker printed a random list and answered zero. */
  (r) => { const n = int(r, 3, 5);
    /* Words whose plural differs from the singular, or the question has no
       answer: "fish" is both. */
    const words = sample(r, PLURALS.filter(p => p[0] !== p[1]), n);
    const shown = words.map(([one, many]) => (r() < 0.5 ? { word: one, plural: false }
                                                        : { word: many, plural: true }));
    const count = shown.filter(w => w.plural).length;
    return blankQ(`How many of these words are plural: ${shown.map(w => w.word).join(', ')}?`,
      count,
      { hint: 'Read each one and decide whether it names one thing or more than one.',
        explanation: `${count === 0 ? 'None of them are' : `${shown.filter(w => w.plural).map(w => w.word).join(', ')} ${count === 1 ? 'is' : 'are'}`} plural.` }); },

  (r) => { const [one, many, rule] = pick(r, PLURALS);
    return blankQ(`Complete the sentence: “One ${one}, two ___.”`, many,
      { hint: `The rule here is: ${rule}.`,
        explanation: `One ${one}, two ${many}.` }); }
];

/* ============================ SENTENCE TYPES ============================ */
export const SENTENCE_TYPES = [
  ['The bus leaves at six.', 'statement'], ['Where are my keys?', 'question'],
  ['Shut the gate behind you.', 'command'], ['What a mess this is!', 'exclamation'],
  ['She plays the violin.', 'statement'], ['Who took the last biscuit?', 'question'],
  ['Pass me the salt.', 'command'], ['How cold it is today!', 'exclamation'],
  ['The library closes at five.', 'statement'], ['Did you lock the door?', 'question'],
  ['Stand behind the line.', 'command'], ['What a strange noise that was!', 'exclamation'],
  ['They arrived before dawn.', 'statement'], ['Why is the window open?', 'question'],
  ['Turn left at the bridge.', 'command'], ['How quickly the summer went!', 'exclamation']
];
export const STRUCTURES = [
  ['The dog barked.', 'simple'], ['The dog barked and the cat ran.', 'compound'],
  ['The dog barked because a stranger passed.', 'complex'],
  ['She read the letter.', 'simple'], ['She read the letter and then folded it.', 'compound'],
  ['She read the letter although it upset her.', 'complex'],
  ['The rain stopped.', 'simple'], ['The rain stopped but the wind stayed.', 'compound'],
  ['The rain stopped when the sun came out.', 'complex'],
  ['We waited outside.', 'simple'], ['We waited outside and the bus never came.', 'compound'],
  ['We waited outside until the doors opened.', 'complex']
];

export const sentencetypes = [
  (r) => { const [text, type] = pick(r, SENTENCE_TYPES);
    return choice(r, {
      prompt: `What kind of sentence is this? “${text}”`,
      correct: type,
      distractors: ['statement', 'question', 'command', 'exclamation'].filter(t => t !== type),
      hint: 'Look at what it does: tells, asks, orders or exclaims.',
      explanation: `“${text}” is a ${type}.`
    }); },

  (r) => { const [text, structure] = pick(r, STRUCTURES);
    return choice(r, {
      prompt: `Is this sentence simple, compound or complex? “${text}”`,
      correct: structure,
      distractors: ['simple', 'compound', 'complex'].filter(t => t !== structure),
      hint: 'Count the clauses, then look at the joining word.',
      explanation: `“${text}” is ${structure}: ${structure === 'simple' ? 'one clause' : structure === 'compound' ? 'two equal clauses joined by and, but or or' : 'a main clause and a clause that depends on it'}.`
    }); },

  (r) => { const type = pick(r, ['statement', 'question', 'command', 'exclamation']);
    const match = SENTENCE_TYPES.filter(([, t]) => t === type);
    const [text] = pick(r, match);
    return choice(r, {
      prompt: `Which of these is ${an(type)}?`,
      correct: text,
      distractors: sample(r, SENTENCE_TYPES.filter(([, t]) => t !== type).map(([s]) => s), 3),
      hint: `${cap(an(type))} ${type === 'statement' ? 'tells you something' : type === 'question' ? 'asks something' : type === 'command' ? 'tells you to do something' : 'shows strong feeling'}.`,
      explanation: `“${text}” is the ${type}.`
    }); },

  (r) => { const [text] = pick(r, STRUCTURES.filter(([, s]) => s === 'compound'));
    const conj = text.match(/\b(and|but|or)\b/)[1];
    return blankQ(`Which word joins the two clauses in this sentence? “${text}”`, conj,
      { hint: 'A compound sentence is joined by and, but or or.',
        explanation: `“${conj}” joins the two halves.` }); },

  (r) => { const [text, structure] = pick(r, STRUCTURES);
    const clauses = structure === 'simple' ? 1 : 2;
    return blankQ(`How many clauses does this sentence have? “${text}”`, clauses,
      { hint: 'Count the verbs: each clause has one.',
        explanation: `“${text}” has ${clauses} clause${clauses === 1 ? '' : 's'}.` }); },

  (r) => { const [text, type] = pick(r, SENTENCE_TYPES);
    const mark = type === 'question' ? '?' : type === 'exclamation' ? '!' : '.';
    return blankQ(`Which mark ends ${an(type)}?`, mark,
      { hint: 'Say the sentence aloud and hear how it ends.',
        explanation: `${cap(an(type))} ends with ${mark === '?' ? 'a question mark' : mark === '!' ? 'an exclamation mark' : 'a full stop'}.` }); },

  (r) => { const subjects = ['The postman', 'My sister', 'The old clock', 'That grey cat',
                             'Our neighbour', 'The last train', 'A stray dog', 'The head teacher'];
    const predicates = ['delivered the parcel', 'plays the piano', 'stopped at midnight',
                        'sleeps on the wall', 'grows tomatoes', 'left without us',
                        'followed us home', 'announced the results'];
    const i = int(r, 0, subjects.length - 1);
    return blankQ(`Write the subject of this sentence: “${subjects[i]} ${predicates[i]}.”`,
      subjects[i],
      { hint: 'The subject is who or what the sentence is about.',
        explanation: `The sentence is about ${subjects[i].toLowerCase()}.` }); },

  (r) => { const [text] = pick(r, STRUCTURES.filter(([, s]) => s === 'complex'));
    const conj = text.match(/\b(because|although|when|until|while|since|if)\b/)[1];
    return blankQ(`Which word begins the dependent clause? “${text}”`, conj,
      { hint: 'The dependent clause cannot stand alone as a sentence.',
        explanation: `“${conj}” starts the clause that depends on the rest.` }); },

  (r) => { const [text, type] = pick(r, SENTENCE_TYPES);
    const stripped = text.replace(/[.?!]$/, '');
    return blankQ(`Add the right mark to the end: “${stripped}”`, `${stripped}${text.slice(-1)}`,
      { accept: [text],
        hint: `It is a ${type}.`,
        explanation: `“${text}”` }); },

  (r) => { const a = pick(r, ['The kettle boiled', 'The lights went out', 'The door opened',
                              'The music stopped', 'The bell rang']);
    const b = pick(r, ['nobody moved', 'the room fell silent', 'the dog barked',
                       'everyone looked up', 'the cat ran outside']);
    return blankQ(`Join these into one compound sentence using “and”: “${a}.” and “${b}.”`,
      `${a} and ${b}.`,
      { accept: [`${a} and ${b}`],
        hint: 'Drop the first full stop and put "and" in its place.',
        explanation: `“${a} and ${b}.”` }); }
];

/* ========================= SYNONYMS AND ANTONYMS ========================= */
export const SYNONYMS = [
  ['big', 'large'], ['small', 'tiny'], ['happy', 'glad'], ['sad', 'unhappy'],
  ['fast', 'quick'], ['slow', 'sluggish'], ['cold', 'chilly'], ['hot', 'warm'],
  ['begin', 'start'], ['end', 'finish'], ['brave', 'courageous'], ['afraid', 'frightened'],
  ['angry', 'furious'], ['calm', 'peaceful'], ['strange', 'odd'], ['clever', 'intelligent'],
  ['tired', 'weary'], ['difficult', 'hard'], ['easy', 'simple'], ['quiet', 'silent'],
  ['rich', 'wealthy'], ['ancient', 'old'], ['huge', 'enormous'], ['shout', 'yell']
];
export const ANTONYMS = [
  ['big', 'small'], ['hot', 'cold'], ['fast', 'slow'], ['happy', 'sad'],
  ['open', 'shut'], ['begin', 'end'], ['above', 'below'], ['early', 'late'],
  ['light', 'dark'], ['hard', 'soft'], ['wet', 'dry'], ['full', 'empty'],
  ['near', 'far'], ['loud', 'quiet'], ['brave', 'cowardly'], ['rich', 'poor'],
  ['young', 'old'], ['tall', 'short'], ['clean', 'dirty'], ['strong', 'weak'],
  ['first', 'last'], ['rough', 'smooth'], ['tight', 'loose'], ['heavy', 'light']
];

export const synonymsantonyms = [
  (r) => { const [a, b] = pick(r, SYNONYMS);
    return choice(r, {
      prompt: `Which word means the same as “${a}”?`,
      correct: b, distractors: sample(r, ANTONYMS.flat().filter(w => w !== a && w !== b), 3),
      hint: 'A synonym could swap places with the word and leave the meaning alone.',
      explanation: `“${a}” and “${b}” mean the same.`
    }); },

  (r) => { const [a, b] = pick(r, ANTONYMS);
    return choice(r, {
      prompt: `Which word means the opposite of “${a}”?`,
      correct: b, distractors: sample(r, SYNONYMS.flat().filter(w => w !== a && w !== b), 3),
      hint: 'An antonym is the far end of the same idea.',
      explanation: `The opposite of “${a}” is “${b}”.`
    }); },

  (r) => { const [a, b] = pick(r, SYNONYMS);
    return blankQ(`Write a word that means the same as “${a}”.`, b,
      { accept: [a === 'big' ? 'huge' : b],
        hint: 'Think of a word you could put in its place.',
        explanation: `“${b}” means the same as “${a}”.` }); },

  (r) => { const [a, b] = pick(r, ANTONYMS);
    return blankQ(`Write the opposite of “${a}”.`, b,
      { hint: 'Think of the far end of the same idea.',
        explanation: `The opposite of “${a}” is “${b}”.` }); },

  (r) => { const syn = r() < 0.5;
    const [a, b] = pick(r, syn ? SYNONYMS : ANTONYMS);
    return choice(r, {
      prompt: `Are “${a}” and “${b}” synonyms or antonyms?`,
      correct: syn ? 'synonyms' : 'antonyms', distractors: [syn ? 'antonyms' : 'synonyms'],
      hint: 'Decide whether the two words could swap places in a sentence or pull in opposite directions.',
      explanation: `They mean the ${syn ? 'same' : 'opposite'}, so they are ${syn ? 'synonyms' : 'antonyms'}.`
    }); },

  (r) => { const [a, b] = pick(r, SYNONYMS);
    const [c, d] = pick(r, ANTONYMS.filter(([x]) => x !== a));
    return choice(r, {
      prompt: 'Which pair are synonyms?',
      correct: `${a} and ${b}`,
      distractors: [`${c} and ${d}`, ...sample(r, ANTONYMS.filter(([x]) => x !== c), 2).map(([x, y]) => `${x} and ${y}`)],
      hint: 'Only one pair means the same thing twice.',
      explanation: `“${a}” and “${b}” mean the same.`
    }); },

  (r) => { const [a, b] = pick(r, ANTONYMS);
    const [c, d] = pick(r, SYNONYMS.filter(([x]) => x !== a));
    return choice(r, {
      prompt: 'Which pair are opposites?',
      correct: `${a} and ${b}`,
      distractors: [`${c} and ${d}`, ...sample(r, SYNONYMS.filter(([x]) => x !== c), 2).map(([x, y]) => `${x} and ${y}`)],
      hint: 'Only one pair pulls in two directions.',
      explanation: `“${a}” and “${b}” are opposites.`
    }); },

  (r) => { const [a, b] = pick(r, SYNONYMS);
    return blankQ(`Replace “${a}” with a word that means the same.`, b,
      { hint: 'Pick a word you could swap in without changing the meaning.',
        explanation: `“${b}” means the same as “${a}”.` }); },

  (r) => { const [a, b] = pick(r, ANTONYMS);
    return blankQ(`Complete the sentence with an opposite: “It was not ${a}; it was ___.”`, b,
      { hint: 'The second word undoes the first.',
        explanation: `The opposite of “${a}” is “${b}”.` }); },

  (r) => { const [a, b] = pick(r, SYNONYMS);
    const others = sample(r, SYNONYMS.filter(([x]) => x !== a).map(([, y]) => y), 3);
    return choice(r, {
      prompt: `Three of these do not mean “${a}”. Which one does?`,
      correct: b, distractors: others,
      hint: 'Try each word in a sentence where the first word would fit.',
      explanation: `“${b}” means the same as “${a}”.`
    }); }
];

/* ========================= FIGURATIVE LANGUAGE ========================= */
export const DEVICES = [
  ['as quiet as a mouse', 'simile'], ['the sea is a hungry dog', 'metaphor'],
  ['the wind whispered through the trees', 'personification'],
  ['Peter picked a peck of peppers', 'alliteration'],
  ['the bees buzzed and the door banged', 'onomatopoeia'],
  ['I have told you a million times', 'hyperbole'],
  ['as brave as a lion', 'simile'], ['her voice was music', 'metaphor'],
  ['the old house groaned in the storm', 'personification'],
  ['silly snakes slithered silently', 'alliteration'],
  ['the clock ticked and the tap dripped', 'onomatopoeia'],
  ['this bag weighs a tonne', 'hyperbole'],
  ['as white as snow', 'simile'], ['time is a thief', 'metaphor'],
  ['the sun smiled down on the field', 'personification'],
  ['brave boys built a boat', 'alliteration'],
  ['the fire crackled and the kettle hissed', 'onomatopoeia'],
  ['I could sleep for a year', 'hyperbole'],
  ['as light as a feather', 'simile'], ['the classroom was a zoo', 'metaphor'],
  ['the leaves danced along the path', 'personification'],
  ['five funny frogs found food', 'alliteration']
];
const DEVICE_NAMES = [...new Set(DEVICES.map(d => d[1]))];
export const DEVICE_DEFS = [
  ['simile', 'compares one thing to another using "like" or "as"'],
  ['metaphor', 'says one thing is another'],
  ['personification', 'gives human qualities to something that is not human'],
  ['alliteration', 'repeats the same sound at the start of nearby words'],
  ['onomatopoeia', 'uses words that sound like the noise they describe'],
  ['hyperbole', 'exaggerates far beyond what is true']
];

export const figurative = [
  (r) => { const [example, device] = pick(r, DEVICES);
    return choice(r, {
      prompt: `Which device is this? “${example}”`,
      correct: device, distractors: sample(r, DEVICE_NAMES.filter(d => d !== device), 3),
      hint: 'Ask what the words are doing, not what they are about.',
      explanation: `“${example}” is ${an(device)}: it ${DEVICE_DEFS.find(([d]) => d === device)[1]}.`
    }); },

  (r) => { const [device, definition] = pick(r, DEVICE_DEFS);
    return choice(r, {
      prompt: `Which device ${definition}?`,
      correct: device, distractors: sample(r, DEVICE_NAMES.filter(d => d !== device), 3),
      hint: 'Match the description to a name you already know.',
      explanation: `${cap(device)} ${definition}.`
    }); },

  (r) => { const device = pick(r, DEVICE_NAMES);
    const [example] = pick(r, DEVICES.filter(([, d]) => d === device));
    return choice(r, {
      prompt: `Which of these is ${an(device)}?`,
      correct: example,
      distractors: sample(r, DEVICES.filter(([, d]) => d !== device).map(([e]) => e), 3),
      hint: `${cap(an(device))} ${DEVICE_DEFS.find(([d]) => d === device)[1]}.`,
      explanation: `“${example}” is the ${device}.`
    }); },

  (r) => { const [example, device] = pick(r, DEVICES);
    return blankQ(`Name the device used here: “${example}”`, device,
      { hint: 'Ask what the words are doing: comparing, exaggerating, repeating a sound, or lending human life to something.',
        explanation: `It is ${an(device)}.` }); },

  (r) => { const [example] = pick(r, DEVICES.filter(([, d]) => d === 'simile'));
    const word = example.startsWith('as') ? 'as' : 'like';
    return blankQ(`Which word makes this a simile? “${example}”`, word,
      { hint: 'A simile always carries one of two little words.',
        explanation: `The word “${word}” makes the comparison.` }); },

  (r) => { const [example] = pick(r, DEVICES.filter(([, d]) => d === 'alliteration'));
    const letter = example.replace(/[^a-z ]/gi, '').split(' ').find(w => w.length > 2)[0];
    return blankQ(`Which sound is repeated in this line? “${example}” Write the letter.`, letter,
      { hint: 'Listen to the start of each word.',
        explanation: `The line repeats the “${letter}” sound.` }); },

  (r) => { const [device, definition] = pick(r, DEVICE_DEFS);
    return blankQ(`What does ${device} mean? Complete: “It ___.” Use one of: compares, says, gives, repeats, uses, exaggerates.`,
      definition.split(' ')[0],
      { hint: 'The first word of the definition is the verb.',
        explanation: `${cap(device)} ${definition}.` }); },

  (r) => { const nouns = [['the moon', 'a silver coin'], ['his temper', 'a storm'],
      ['the city', 'a machine'], ['her memory', 'a sieve'], ['the crowd', 'a wave'],
      ['the road', 'a ribbon'], ['the night', 'a blanket'], ['fear', 'a shadow']];
    const [a, b] = pick(r, nouns);
    return blankQ(`Turn this simile into a metaphor: “${cap(a)} was like ${b}.”`,
      `${cap(a)} was ${b}.`,
      { accept: [`${cap(a)} was ${b}`],
        hint: 'A metaphor drops the "like" and says it simply is.',
        explanation: `“${cap(a)} was ${b}.”` }); },

  (r) => { const nouns = [['the moon', 'a silver coin'], ['his temper', 'a storm'],
      ['the city', 'a machine'], ['her memory', 'a sieve'], ['the crowd', 'a wave']];
    const [a, b] = pick(r, nouns);
    return blankQ(`Turn this metaphor into a simile: “${cap(a)} was ${b}.”`,
      `${cap(a)} was like ${b}.`,
      { accept: [`${cap(a)} was like ${b}`],
        hint: 'A simile puts "like" or "as" back in.',
        explanation: `“${cap(a)} was like ${b}.”` }); },

  (r) => { const device = pick(r, DEVICE_NAMES);
    const three = sample(r, DEVICES.filter(([, d]) => d === device).map(([e]) => e), 2);
    const [odd] = pick(r, DEVICES.filter(([, d]) => d !== device));
    return choice(r, {
      prompt: `Two of these are ${device}. Which one is not?`,
      correct: odd, distractors: three,
      hint: `${cap(an(device))} ${DEVICE_DEFS.find(([d]) => d === device)[1]}.`,
      explanation: `“${odd}” is not ${an(device)}.`
    }); }
];

/* ============================ SPELLING RULES ============================ */
export const IE_EI = [
  ['believe', 'i before e'], ['achieve', 'i before e'], ['field', 'i before e'],
  ['piece', 'i before e'], ['thief', 'i before e'], ['relief', 'i before e'],
  ['receive', 'e before i after c'], ['deceive', 'e before i after c'],
  ['ceiling', 'e before i after c'], ['perceive', 'e before i after c']
];
export const DROP_E = [['make', 'making'], ['hope', 'hoping'], ['write', 'writing'],
  ['drive', 'driving'], ['come', 'coming'], ['take', 'taking'], ['bake', 'baking'],
  ['shine', 'shining'], ['use', 'using'], ['dance', 'dancing']];
export const DOUBLE = [['run', 'running'], ['sit', 'sitting'], ['swim', 'swimming'],
  ['stop', 'stopping'], ['plan', 'planning'], ['begin', 'beginning'], ['put', 'putting'],
  ['shop', 'shopping'], ['travel', 'travelling'], ['forget', 'forgetting']];
export const Y_TO_I = [['happy', 'happier'], ['easy', 'easier'], ['heavy', 'heavier'],
  ['funny', 'funnier'], ['busy', 'busier'], ['pretty', 'prettier'], ['angry', 'angrier'],
  ['early', 'earlier'], ['tidy', 'tidier'], ['lucky', 'luckier']];
export const MISSPELT = [['necessary', 'neccessary'], ['separate', 'seperate'],
  ['definitely', 'definately'], ['occurred', 'occured'], ['embarrass', 'embarass'],
  ['accommodate', 'accomodate'], ['beginning', 'begining'], ['rhythm', 'rythm'],
  ['argument', 'arguement'], ['grateful', 'greatful'], ['calendar', 'calender'],
  ['committee', 'commitee'], ['tomorrow', 'tommorow'], ['restaurant', 'restaraunt'],
  ['surprise', 'suprise'], ['believe', 'beleive'], ['friend', 'freind'],
  ['because', 'becuase'], ['weird', 'wierd'], ['library', 'libary']];

export const spellingrules = [
  (r) => { const [word] = pick(r, IE_EI);
    return blankQ(`Fill in the missing letters: “${word.replace(/ie|ei/, '__')}”`, word,
      { hint: 'i before e, except after c.',
        explanation: `It is spelt “${word}”.` }); },

  (r) => { const [base, ing] = pick(r, DROP_E);
    return blankQ(`Add “-ing” to “${base}”.`, ing,
      { hint: 'A silent e at the end is dropped before -ing.',
        explanation: `${base} → ${ing}.` }); },

  (r) => { const [base, ing] = pick(r, DOUBLE);
    return blankQ(`Add “-ing” to “${base}”.`, ing,
      { hint: 'A short word ending in one vowel and one consonant doubles the last letter.',
        explanation: `${base} → ${ing}.` }); },

  (r) => { const [base, more] = pick(r, Y_TO_I);
    return blankQ(`Add “-er” to “${base}”.`, more,
      { hint: 'A word ending in a consonant then y changes the y to i.',
        explanation: `${base} → ${more}.` }); },

  (r) => { const [right, wrong] = pick(r, MISSPELT);
    return choice(r, {
      prompt: 'Which spelling is correct?',
      correct: right, distractors: [wrong, `${right}e`, right.replace(/([a-z])\1/, '$1')]
        .filter(d => d !== right),
      hint: 'Say the word slowly and listen for the double letters.',
      explanation: `The correct spelling is “${right}”.`
    }); },

  (r) => { const [right, wrong] = pick(r, MISSPELT);
    return blankQ(`This word is spelt wrongly. Write it correctly: “${wrong}”`, right,
      { hint: 'One letter is missing, doubled or in the wrong order.',
        explanation: `It should be “${right}”.` }); },

  (r) => { const [word, rule] = pick(r, IE_EI);
    return choice(r, {
      prompt: `Which rule spells “${word}”?`,
      correct: rule, distractors: ['i before e', 'e before i after c'].filter(x => x !== rule),
      hint: 'Look at the letter just before the pair.',
      explanation: `“${word}” follows the rule: ${rule}.`
    }); },

  (r) => { const which = pick(r, ['drop the e', 'double the last letter', 'change y to i']);
    const bank = { 'drop the e': DROP_E, 'double the last letter': DOUBLE, 'change y to i': Y_TO_I };
    const [base, changed] = pick(r, bank[which]);
    return choice(r, {
      prompt: `Which rule turns “${base}” into “${changed}”?`,
      correct: which,
      distractors: ['drop the e', 'double the last letter', 'change y to i', 'add the ending as it is']
        .filter(x => x !== which),
      hint: 'Compare the two spellings letter by letter.',
      explanation: `${base} → ${changed}: ${which}.`
    }); },

  (r) => { const [base, ing] = pick(r, [...DROP_E, ...DOUBLE]);
    return choice(r, {
      prompt: `Which is the correct spelling with “-ing”?`,
      correct: ing, distractors: [`${base}ing`, `${base}eing`, `${base}${base.slice(-1)}ing`]
        .filter(d => d !== ing),
      hint: 'Decide whether the ending needs a letter dropped or doubled.',
      explanation: `${base} → ${ing}.`
    }); },

  (r) => { const [right] = pick(r, MISSPELT);
    return blankQ(`How many letters are in the word “${right}”?`, right.length,
      { hint: 'Count them one at a time, including any double letters twice.',
        explanation: `“${right}” has ${right.length} letters.` }); }
];

/* Every English drill family, keyed the way the generator table expects. */
export const ENGLISH_DRILL_GENERATORS = {
  punctuation, apostrophes, homophones, prefixsuffix, wordclasses,
  tenses, plurals, sentencetypes, synonymsantonyms, figurative, spellingrules
};
