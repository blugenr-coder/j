/* English/Language Arts and modern language item banks. */

import { int, pick, sample, choice, blankQ, multiQ, matchQ, orderQ, writtenQ } from './gen-core.js';

const C = (prompt, correct, distractors, explanation, hint) =>
  r => choice(r, { prompt, correct, distractors, explanation, hint });
const B = (prompt, answer, explanation, accept = []) =>
  () => ({ type: 'blank', prompt, answer, accept, explanation });

/* -------------------------------- GRAMMAR -------------------------------- */
export const grammar = [
  C('In "The tall boy ran quickly", which word is the verb?', 'ran', ['tall', 'boy', 'quickly'],
    'A verb is the action word, and "ran" is the action.'),
  C('In "The tall boy ran quickly", which word is the adverb?', 'quickly', ['tall', 'boy', 'ran'],
    'An adverb describes how the verb happens.'),
  C('Which sentence is punctuated correctly?', 'Where is my book?',
    ['where is my book', 'Where is my book', 'where is my book?'],
    'A question starts with a capital letter and ends with a question mark.'),
  C('Which sentence uses the apostrophe correctly?', 'The dog’s bowl is empty.',
    ['The dogs bowl is empty.', 'The dogs’ bowl is empty for one dog.', 'The dog’s are barking.'],
    'A singular possessive takes apostrophe-s.'),
  C('Choose the correct word: "They’re / Their / There going home."', 'They’re',
    ['Their', 'There', 'Theyre'], '"They’re" is short for "they are".'),
  C('Which is the past tense of "bring"?', 'brought', ['bringed', 'brang', 'brung'],
    '"Bring" is irregular: bring, brought, brought.'),
  C('Which sentence is in the passive voice?', 'The window was broken by the storm.',
    ['The storm broke the window.', 'The storm is breaking windows.', 'Break the window.'],
    'In the passive the subject receives the action rather than performing it.'),
  C('Which word is a conjunction?', 'because', ['quickly', 'garden', 'bright'],
    'Conjunctions join clauses: and, but, because, although.'),
  C('A group of words with a subject and a verb that makes sense alone is a…', 'Main clause',
    ['Phrase', 'Subordinate clause', 'Preposition'],
    'A main clause can stand as a sentence on its own.'),
  B('Write the plural of "child".', 'children', '"Child" has an irregular plural.'),
  B('Write the plural of "knife".', 'knives', 'Words ending -fe usually change to -ves.'),
  B('A word that describes a noun is called a(n) ___.', 'adjective',
    'Adjectives describe nouns; adverbs describe verbs.'),
  B('Fill the gap with the right verb form: She ___ to school every day.', 'walks',
    'A singular subject in the present simple takes an -s ending.', ['goes', 'runs', 'cycles']),
  r => matchQ(r, { prompt: 'Match each word to its part of speech.', pairs: [
    { left: 'river', right: 'Noun' }, { left: 'jump', right: 'Verb' },
    { left: 'bright', right: 'Adjective' }, { left: 'slowly', right: 'Adverb' },
    { left: 'under', right: 'Preposition' }, { left: 'she', right: 'Pronoun' }
  ], explanation: 'Parts of speech describe a word’s job in a sentence.' }),
  r => multiQ(r, { prompt: 'Which of these are nouns? Choose all that apply.',
    correct: ['teacher', 'city', 'freedom'], wrong: ['sing', 'happy', 'quickly'],
    explanation: 'Nouns name people, places, things and ideas.' }),
  () => orderQ('Put these words in order to make a correct sentence.',
    ['The', 'small', 'dog', 'chased', 'the ball'], 'Determiner, adjective, noun, verb, object.'),
  () => writtenQ('Rewrite this sentence correctly: "me and him goes to the park on tuesday"',
    'He and I go to the park on Tuesday.',
    'Look for subject pronouns, subject–verb agreement, and a capital on the weekday.')
];

/* ------------------------------- VOCABULARY ------------------------------- */
export const vocabulary = [
  C('The root "bio" means…', 'Life', ['Earth', 'Light', 'Sound'],
    '"Bio" means life: biology, biography, antibiotic.'),
  C('The prefix "trans-" means…', 'Across', ['Before', 'Under', 'Again'],
    'Transport, translate, transatlantic all carry the sense of across.'),
  C('Choose the best synonym for "reluctant".', 'Unwilling', ['Eager', 'Careless', 'Exhausted'],
    'Reluctant means hesitant or unwilling.'),
  C('Choose the best synonym for "meticulous".', 'Painstaking', ['Hasty', 'Generous', 'Vague'],
    'Meticulous means showing great attention to detail.'),
  C('Choose the antonym of "scarce".', 'Abundant', ['Rare', 'Limited', 'Sparse'],
    'Scarce means in short supply; abundant is its opposite.'),
  C('In "The evidence was irrefutable, so nobody argued", "irrefutable" means…',
    'Impossible to disprove', ['Confusing', 'Easily ignored', 'Very old'],
    'The clue "so nobody argued" tells you it could not be argued against.'),
  C('In "Her explanation was succinct — three sentences and done", "succinct" means…',
    'Briefly and clearly expressed', ['Long-winded', 'Confusing', 'Angry'],
    'The dash gives the definition: three sentences and done.'),
  C('What does "ambiguous" mean?', 'Open to more than one interpretation',
    ['Obviously true', 'Extremely large', 'Repeated often'],
    'Ambiguous language can be read in more than one way.'),
  B('A word meaning the opposite of another is called a(n) ___.', 'antonym',
    'Antonyms are opposites; synonyms are similar.'),
  B('Words that sound the same but are spelled differently are called ___.', 'homophones',
    'Their, there and they’re are homophones.', ['homophone']),
  r => matchQ(r, { prompt: 'Match each prefix to its meaning.', pairs: [
    { left: 're-', right: 'again' }, { left: 'pre-', right: 'before' },
    { left: 'sub-', right: 'under' }, { left: 'anti-', right: 'against' },
    { left: 'mis-', right: 'wrongly' }
  ], explanation: 'Prefixes change a word’s meaning.' }),
  r => matchQ(r, { prompt: 'Match each root to its meaning.', pairs: [
    { left: 'graph', right: 'to write' }, { left: 'aud', right: 'to hear' },
    { left: 'port', right: 'to carry' }, { left: 'dict', right: 'to say' },
    { left: 'spect', right: 'to look' }
  ], explanation: 'Greek and Latin roots unlock unfamiliar words.' }),
  r => multiQ(r, { prompt: 'Which words share the root "graph" meaning "to write"? Choose all that apply.',
    correct: ['autograph', 'paragraph', 'calligraphy'], wrong: ['gravity', 'grateful'],
    explanation: '"Gravity" and "grateful" come from different roots.' }),
  () => writtenQ('Use the word "tenacious" in a sentence that makes its meaning clear.',
    'Despite three rejections she remained tenacious, sending the proposal out a fourth time.',
    'A strong answer shows the meaning (persistent, not giving up) through context, not just placement.')
];

/* -------------------------------- SPELLING -------------------------------- */
export const spelling = [
  C('Which spelling is correct?', 'necessary', ['neccessary', 'necesary', 'neccesary'],
    'One c, two s: ne-ces-sary.'),
  C('Which spelling is correct?', 'separate', ['seperate', 'seperete', 'separete'],
    'There is "a rat" in sep-a-rate.'),
  C('Which spelling is correct?', 'definitely', ['definately', 'definatly', 'definitley'],
    'It contains the word "finite".'),
  C('Which spelling is correct?', 'accommodate', ['acommodate', 'accomodate', 'acomodate'],
    'Double c and double m.'),
  C('Which spelling is correct?', 'rhythm', ['rythm', 'rhythem', 'rhytm'],
    'Two h’s and no vowel between the th and m.'),
  C('Which spelling is correct?', 'embarrass', ['embarass', 'embarras', 'emberrass'],
    'Double r and double s.'),
  B('Add the suffix -ing to "run".', 'running', 'Double the final consonant after a short vowel.'),
  B('Add the suffix -ed to "carry".', 'carried', 'Change the y to i before adding -ed.'),
  B('Write the correct spelling: recieve or receive?', 'receive', 'i before e except after c.'),
  r => multiQ(r, { prompt: 'Which words are spelled correctly? Choose all that apply.',
    correct: ['occurred', 'beginning', 'privilege'], wrong: ['occured', 'begining'],
    explanation: 'Each of these doubles a consonant before the suffix.' })
];

/* -------------------------------- READING -------------------------------- */
export const reading = [
  C('What is the main idea of a paragraph?', 'The single most important point it makes',
    ['The first sentence, always', 'The longest sentence', 'Any interesting detail'],
    'The main idea is the central point; details support it.'),
  C('An inference is…', 'A conclusion drawn from evidence in the text',
    ['A direct quotation', 'The author’s biography', 'A guess with no basis'],
    'Inference combines what the text says with what you already know.'),
  C('Reading a text quickly to find one specific fact is called…', 'Scanning',
    ['Skimming', 'Annotating', 'Summarising'],
    'Scanning hunts for a detail; skimming gets the gist.'),
  C('Which is a primary source?', 'A soldier’s diary from the war',
    ['A textbook about the war', 'A documentary made in 2020', 'An encyclopaedia entry'],
    'Primary sources come from the time and place being studied.'),
  C('If a writer uses loaded, one-sided language, the text is probably…', 'Persuasive',
    ['Neutral reporting', 'A dictionary entry', 'A recipe'],
    'Persuasive writing selects language to move the reader towards a view.'),
  B('What is a short restatement of a text in your own words called?', 'summary',
    'A summary keeps the main ideas and drops the detail.', ['a summary', 'summarising']),
  () => orderQ('Put these reading steps in a sensible order.',
    ['Skim the whole text', 'Read it closely', 'Underline key evidence', 'Write your answer'],
    'Get the shape first, then the detail, then the evidence, then the response.'),
  () => writtenQ('A text says "the policy was, at best, poorly judged". What does the phrase "at best" tell you about the writer’s view?',
    'It signals that this is the kindest possible reading. The writer thinks the policy was poorly judged and is hinting it may have been considerably worse.',
    'Look for recognition of understatement and implied criticism.')
];

/* -------------------------------- WRITING -------------------------------- */
export const writing = [
  C('What belongs in the opening of a persuasive essay?', 'A clear statement of your position',
    ['Your strongest evidence', 'A counter-argument', 'The conclusion'],
    'State the claim early so the reader knows what you are arguing.'),
  C('What is a topic sentence?', 'The sentence that states a paragraph’s main point',
    ['The last sentence of an essay', 'A quotation', 'The essay title'],
    'It tells the reader what the paragraph will do.'),
  C('Which is the strongest piece of evidence in an argument?', 'A specific, sourced example',
    ['A strongly worded opinion', 'A rhetorical question', 'A personal feeling'],
    'Specific, verifiable evidence persuades; assertion does not.'),
  C('What does it mean to "show, not tell" in narrative writing?', 'Convey feeling through action and detail',
    ['Use longer words', 'Explain the moral', 'Write in the first person'],
    '"Her hands shook" shows fear; "she was afraid" tells it.'),
  B('What is the final stage of the writing process, after revising?', 'proofreading',
    'Proofreading catches spelling, punctuation and grammar errors.', ['editing', 'proof reading']),
  () => orderQ('Put the stages of the writing process in order.',
    ['Plan', 'Draft', 'Revise', 'Proofread', 'Publish'],
    'Planning before drafting saves rewriting later.'),
  () => writtenQ('Write a topic sentence for a paragraph arguing that homework should be limited on weeknights.',
    'Limiting weeknight homework would protect the sleep and family time that students need in order to learn well in the first place.',
    'A good topic sentence states a clear, arguable position in one sentence.'),
  () => writtenQ('Rewrite this so it shows rather than tells: "He was nervous before the exam."',
    'He read the same first question four times, and the pen slipped twice in his damp fingers before he wrote anything.',
    'Look for concrete physical detail replacing the abstract label.')
];

/* ------------------------------- LITERATURE ------------------------------- */
export const literature = [
  C('"The wind whispered through the trees" is an example of…', 'Personification',
    ['Simile', 'Hyperbole', 'Onomatopoeia'],
    'Giving a human action to a non-human thing is personification.'),
  C('"As brave as a lion" is a…', 'Simile', ['Metaphor', 'Alliteration', 'Symbol'],
    'A comparison using "as" or "like" is a simile.'),
  C('Dramatic irony occurs when…', 'The audience knows something a character does not',
    ['A character says the opposite of what they mean', 'The ending is unexpected', 'Two characters argue'],
    'It depends on the gap between audience knowledge and character knowledge.'),
  C('The atmosphere a text creates in the reader is its…', 'Mood', ['Tone', 'Plot', 'Genre'],
    'Mood is what the reader feels; tone is the writer’s attitude.'),
  C('A recurring idea explored across a whole text is a…', 'Theme', ['Motif', 'Setting', 'Climax'],
    'A theme is the underlying idea; a motif is a repeated image that supports it.'),
  C('Who tells the story in a first-person narrative?', 'A character within the story',
    ['An all-knowing outsider', 'The author directly', 'The reader'],
    'First person uses "I" and is limited to that character’s knowledge.'),
  B('What is the turning point of a plot called?', 'climax',
    'The climax is the moment of greatest tension, after which the action falls.', ['the climax']),
  r => matchQ(r, { prompt: 'Match each device to an example.', pairs: [
    { left: 'Alliteration', right: 'Silent shadows softly stir' },
    { left: 'Hyperbole', right: 'I have told you a million times' },
    { left: 'Metaphor', right: 'Her voice was velvet' },
    { left: 'Onomatopoeia', right: 'The bacon sizzled' },
    { left: 'Simile', right: 'Cold as a stone' }
  ], explanation: 'Each example demonstrates its own device.' }),
  r => multiQ(r, { prompt: 'Which of these are figurative language? Choose all that apply.',
    correct: ['Metaphor', 'Simile', 'Personification'], wrong: ['Bibliography', 'Index'],
    explanation: 'A bibliography and an index are parts of a book, not figures of speech.' }),
  () => orderQ('Put the stages of a conventional plot in order.',
    ['Exposition', 'Rising action', 'Climax', 'Falling action', 'Resolution'],
    'Freytag’s pyramid.'),
  () => writtenQ('Choose one literary device and explain what it adds to a piece of writing.',
    'Personification makes a setting feel alive and carries mood: describing wind as "whispering" suggests secrecy and unease rather than plain weather.',
    'Look for a named device plus a specific effect on the reader, not just a definition.')
];

/* ------------------------------- LANGUAGES ------------------------------- */
const langBank = (name, words, phrases, notes) => [
  ...words.slice(0, 6).map(([foreign, english]) =>
    C(`What does "${foreign}" mean?`, english, words.filter(w => w[1] !== english).slice(0, 3).map(w => w[1]),
      `"${foreign}" means "${english}".`)),
  ...phrases.slice(0, 4).map(([en, fo]) =>
    B(`Translate into ${name}: "${en}"`, fo, `"${en}" is "${fo}".`)),
  r => matchQ(r, { prompt: `Match each ${name} word to its English meaning.`,
    pairs: words.slice(0, 6).map(([l, rt]) => ({ left: l, right: rt })),
    explanation: 'Core vocabulary.' }),
  ...notes
];

export const spanish = langBank('Spanish',
  [['perro', 'dog'], ['ciudad', 'city'], ['verde', 'green'], ['hablar', 'to speak'],
   ['libro', 'book'], ['agua', 'water'], ['tiempo', 'time'], ['comer', 'to eat']],
  [['Good morning', 'buenos días'], ['Thank you', 'gracias'], ['How are you?', '¿cómo estás?'], ['My name is', 'me llamo']],
  [
    C('Which is the correct present-tense form: "Yo ___ español"?', 'hablo',
      ['hablas', 'habla', 'hablamos'], 'The "yo" form of -ar verbs ends in -o.'),
    C('What does "biblioteca" mean?', 'Library', ['Bookshop', 'Bible', 'Office'],
      'A classic false friend: a bookshop is "librería".'),
    B('Complete the article: ___ mesa (the table)', 'la', '"Mesa" is feminine, so it takes "la".'),
    () => orderQ('Put these days in order, starting with Monday.',
      ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'], 'Monday to Friday.')
  ]);

export const french = langBank('French',
  [['chien', 'dog'], ['ville', 'city'], ['vert', 'green'], ['parler', 'to speak'],
   ['livre', 'book'], ['eau', 'water'], ['temps', 'time'], ['manger', 'to eat']],
  [['Good morning', 'bonjour'], ['Thank you', 'merci'], ['How are you?', 'comment ça va ?'], ['My name is', 'je m’appelle']],
  [
    C('Which is correct: "Je ___ français"?', 'parle', ['parles', 'parlons', 'parlez'],
      'The "je" form of -er verbs ends in -e.'),
    B('Complete the article: ___ table (the table)', 'la', '"Table" is feminine.'),
    () => orderQ('Put these days in order, starting with Monday.',
      ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'], 'Monday to Friday.')
  ]);

export const german = langBank('German',
  [['Hund', 'dog'], ['Stadt', 'city'], ['grün', 'green'], ['sprechen', 'to speak'],
   ['Buch', 'book'], ['Wasser', 'water'], ['Zeit', 'time'], ['essen', 'to eat']],
  [['Good morning', 'guten Morgen'], ['Thank you', 'danke'], ['How are you?', 'wie geht es dir?'], ['My name is', 'ich heiße']],
  [
    C('Which article goes with "Buch"?', 'das', ['der', 'die', 'den'],
      '"Buch" is neuter, so it takes "das".'),
    C('Which is correct: "Ich ___ Deutsch"?', 'spreche', ['sprichst', 'spricht', 'sprechen'],
      'The "ich" form of this verb is "spreche".'),
    () => orderQ('Put these days in order, starting with Monday.',
      ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'], 'Monday to Friday.')
  ]);

export const esl = [
  C('Choose the correct form: "She ___ here since 2019."', 'has lived',
    ['lives', 'is living', 'lived'], 'The present perfect links a past start to the present.'),
  C('Choose the correct preposition: "I am good ___ maths."', 'at', ['in', 'on', 'with'],
    'We are good "at" a subject or a skill.'),
  C('Which sentence is correct?', 'I have been waiting for an hour.',
    ['I am waiting since an hour.', 'I wait since one hour.', 'I have waited since an hour.'],
    'Use "for" with a length of time and "since" with a point in time.'),
  C('Choose the correct article: "She is ___ engineer."', 'an', ['a', 'the', 'no article'],
    '"An" comes before a vowel sound.'),
  B('Write the past tense of "go".', 'went', '"Go" is irregular: go, went, gone.'),
  B('Write the comparative of "good".', 'better', '"Good" is irregular: good, better, best.'),
  r => matchQ(r, { prompt: 'Match each verb to its past simple form.', pairs: [
    { left: 'go', right: 'went' }, { left: 'buy', right: 'bought' },
    { left: 'take', right: 'took' }, { left: 'write', right: 'wrote' },
    { left: 'come', right: 'came' }
  ], explanation: 'Common irregular verbs.' }),
  () => writtenQ('Describe your usual morning routine in four or five sentences, using the present simple.',
    'I usually wake up at seven o’clock. I make coffee and read the news for twenty minutes. Then I take the bus to work, which takes half an hour. I start work at nine.',
    'Look for consistent present simple and third-person -s where needed.')
];

export const VERBAL_GENERATORS = {
  grammar, vocabulary, spelling, reading, writing, literature,
  spanish, french, german, esl
};
