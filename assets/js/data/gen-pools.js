/* Pool-driven generators.
   A bank of fifteen fixed items can make one worksheet. A pool of two hundred
   words sampled eight at a time can make an effectively unlimited number of
   genuinely different ones — which is how a worksheet library actually gets
   large without repeating itself. These generators sample from real pools. */

import { pick, sample, choice, blankQ, multiQ, matchQ, int } from './gen-core.js';

/* ============================== VOCABULARY ============================== */
/* [word, definition, synonym, antonym] */
const WORDS = [
  ['abundant', 'existing in large quantities', 'plentiful', 'scarce'],
  ['adamant', 'refusing to be persuaded', 'unyielding', 'flexible'],
  ['ambiguous', 'open to more than one meaning', 'unclear', 'definite'],
  ['amiable', 'friendly and pleasant', 'genial', 'hostile'],
  ['arduous', 'requiring great effort', 'strenuous', 'effortless'],
  ['audacious', 'showing a willingness to take risks', 'bold', 'timid'],
  ['benevolent', 'well meaning and kindly', 'kind', 'malicious'],
  ['candid', 'truthful and straightforward', 'frank', 'evasive'],
  ['coherent', 'logical and consistent', 'logical', 'disjointed'],
  ['complacent', 'smugly satisfied with oneself', 'smug', 'concerned'],
  ['concise', 'giving much in few words', 'succinct', 'rambling'],
  ['conspicuous', 'clearly visible', 'obvious', 'inconspicuous'],
  ['deter', 'to discourage from acting', 'dissuade', 'encourage'],
  ['diligent', 'showing careful and persistent effort', 'industrious', 'lazy'],
  ['diminish', 'to make or become less', 'decrease', 'increase'],
  ['discreet', 'careful not to attract attention', 'tactful', 'indiscreet'],
  ['elated', 'extremely happy', 'overjoyed', 'despondent'],
  ['eloquent', 'fluent and persuasive in speech', 'articulate', 'inarticulate'],
  ['erratic', 'not even or regular in pattern', 'unpredictable', 'consistent'],
  ['exacerbate', 'to make a problem worse', 'aggravate', 'alleviate'],
  ['fastidious', 'very attentive to detail', 'meticulous', 'careless'],
  ['feasible', 'possible to do easily', 'achievable', 'impossible'],
  ['frugal', 'sparing with money or food', 'thrifty', 'extravagant'],
  ['futile', 'incapable of producing any useful result', 'pointless', 'effective'],
  ['gregarious', 'fond of company', 'sociable', 'reclusive'],
  ['hinder', 'to make something difficult', 'impede', 'assist'],
  ['impartial', 'treating all sides equally', 'unbiased', 'partisan'],
  ['inevitable', 'certain to happen', 'unavoidable', 'avoidable'],
  ['ingenious', 'clever and inventive', 'inventive', 'unimaginative'],
  ['intricate', 'very complicated in detail', 'complex', 'simple'],
  ['lucid', 'expressed clearly and easy to understand', 'clear', 'confusing'],
  ['meticulous', 'showing great attention to detail', 'painstaking', 'sloppy'],
  ['mundane', 'lacking interest or excitement', 'ordinary', 'extraordinary'],
  ['novice', 'a person new to an activity', 'beginner', 'expert'],
  ['obsolete', 'no longer in use', 'outdated', 'current'],
  ['pragmatic', 'dealing with things realistically', 'practical', 'idealistic'],
  ['prudent', 'acting with care for the future', 'sensible', 'reckless'],
  ['reluctant', 'unwilling and hesitant', 'hesitant', 'eager'],
  ['resilient', 'able to recover quickly', 'tough', 'fragile'],
  ['scrutinise', 'to examine closely', 'inspect', 'skim'],
  ['squander', 'to waste in a reckless way', 'waste', 'conserve'],
  ['staunch', 'very loyal and committed', 'steadfast', 'unreliable'],
  ['substantiate', 'to provide evidence for', 'verify', 'disprove'],
  ['tenacious', 'keeping a firm hold; persistent', 'persistent', 'yielding'],
  ['tentative', 'not certain or fixed', 'provisional', 'definite'],
  ['trivial', 'of little value or importance', 'insignificant', 'crucial'],
  ['ubiquitous', 'present everywhere', 'widespread', 'rare'],
  ['vindicate', 'to clear of blame', 'exonerate', 'condemn'],
  ['volatile', 'liable to change rapidly', 'unstable', 'stable'],
  ['zealous', 'showing great energy for a cause', 'fervent', 'apathetic']
];

export const vocabularyPool = [
  r => {
    const [w, def] = pick(r, WORDS);
    const others = sample(r, WORDS.filter(x => x[0] !== w), 3).map(x => x[1]);
    return choice(r, { prompt: `What does "${w}" mean?`, correct: def, distractors: others,
      explanation: `"${w}" means ${def}.` });
  },
  r => {
    const [w, , syn] = pick(r, WORDS);
    const others = sample(r, WORDS.filter(x => x[0] !== w), 3).map(x => x[2]);
    return choice(r, { prompt: `Choose the best synonym for "${w}".`, correct: syn, distractors: others,
      explanation: `"${w}" and "${syn}" carry the same sense.` });
  },
  r => {
    const [w, , , ant] = pick(r, WORDS);
    const others = sample(r, WORDS.filter(x => x[0] !== w), 3).map(x => x[2]);
    return choice(r, { prompt: `Choose the antonym of "${w}".`, correct: ant, distractors: others,
      explanation: `The opposite of "${w}" is "${ant}".` });
  },
  r => matchQ(r, { prompt: 'Match each word to its meaning.',
    pairs: sample(r, WORDS, 4).map(([w, def]) => ({ left: w, right: def })),
    explanation: 'Definitions taken from standard usage.' }),
  r => {
    const [w, def] = pick(r, WORDS);
    return blankQ(`Which word means "${def}"?`, w, { explanation: `That is "${w}".` });
  }
];

/* =============================== SPELLING =============================== */
const SPELLINGS = [
  ['accommodate', 'acommodate'], ['achieve', 'acheive'], ['acquire', 'aquire'],
  ['argument', 'arguement'], ['believe', 'beleive'], ['calendar', 'calender'],
  ['cemetery', 'cemetary'], ['colleague', 'collegue'], ['committee', 'commitee'],
  ['conscience', 'concience'], ['definitely', 'definately'], ['embarrass', 'embarass'],
  ['environment', 'enviroment'], ['existence', 'existance'], ['familiar', 'familar'],
  ['foreign', 'foriegn'], ['government', 'goverment'], ['grateful', 'greatful'],
  ['guarantee', 'garantee'], ['harass', 'harrass'], ['immediately', 'immediatly'],
  ['independent', 'independant'], ['knowledge', 'knowlege'], ['liaison', 'liason'],
  ['maintenance', 'maintainance'], ['necessary', 'neccessary'], ['occasion', 'ocassion'],
  ['occurred', 'occured'], ['parallel', 'paralell'], ['perseverance', 'perseverence'],
  ['possession', 'posession'], ['privilege', 'priviledge'], ['pronunciation', 'pronounciation'],
  ['questionnaire', 'questionaire'], ['receive', 'recieve'], ['recommend', 'recomend'],
  ['relevant', 'relevent'], ['restaurant', 'restaraunt'], ['rhythm', 'rythm'],
  ['separate', 'seperate'], ['sincerely', 'sincerly'], ['successful', 'succesful'],
  ['surprise', 'suprise'], ['thorough', 'thorogh'], ['tomorrow', 'tommorrow'],
  ['unfortunately', 'unfortunatly'], ['until', 'untill'], ['vacuum', 'vacume'],
  ['weird', 'wierd'], ['whether', 'wether']
];

export const spellingPool = [
  r => {
    const [right, wrong] = pick(r, SPELLINGS);
    const others = sample(r, SPELLINGS.filter(x => x[0] !== right), 2).map(x => x[1]);
    return choice(r, { prompt: 'Which spelling is correct?', correct: right, distractors: [wrong, ...others],
      explanation: `"${right}" is correct; "${wrong}" is the common misspelling.` });
  },
  r => {
    const [right, wrong] = pick(r, SPELLINGS);
    return blankQ(`Correct this spelling: "${wrong}"`, right,
      { explanation: `The correct spelling is "${right}".` });
  },
  r => multiQ(r, { prompt: 'Which words are spelled correctly? Choose all that apply.',
    correct: sample(r, SPELLINGS, 3).map(x => x[0]),
    wrong: sample(r, SPELLINGS, 2).map(x => x[1]),
    explanation: 'The incorrect ones are the usual misspellings of common words.' })
];

/* ============================== GEOGRAPHY ============================== */
/* [country, capital, continent] */
const COUNTRIES = [
  ['France', 'Paris', 'Europe'], ['Japan', 'Tokyo', 'Asia'], ['Brazil', 'Brasília', 'South America'],
  ['Kenya', 'Nairobi', 'Africa'], ['Canada', 'Ottawa', 'North America'], ['Norway', 'Oslo', 'Europe'],
  ['Egypt', 'Cairo', 'Africa'], ['India', 'New Delhi', 'Asia'], ['Peru', 'Lima', 'South America'],
  ['Australia', 'Canberra', 'Oceania'], ['Mexico', 'Mexico City', 'North America'],
  ['Spain', 'Madrid', 'Europe'], ['Nigeria', 'Abuja', 'Africa'], ['Vietnam', 'Hanoi', 'Asia'],
  ['Chile', 'Santiago', 'South America'], ['Poland', 'Warsaw', 'Europe'],
  ['Morocco', 'Rabat', 'Africa'], ['Thailand', 'Bangkok', 'Asia'],
  ['Argentina', 'Buenos Aires', 'South America'], ['Sweden', 'Stockholm', 'Europe'],
  ['Ethiopia', 'Addis Ababa', 'Africa'], ['Indonesia', 'Jakarta', 'Asia'],
  ['Colombia', 'Bogotá', 'South America'], ['Portugal', 'Lisbon', 'Europe'],
  ['Ghana', 'Accra', 'Africa'], ['Nepal', 'Kathmandu', 'Asia'],
  ['Uruguay', 'Montevideo', 'South America'], ['Greece', 'Athens', 'Europe'],
  ['Tanzania', 'Dodoma', 'Africa'], ['Malaysia', 'Kuala Lumpur', 'Asia'],
  ['Cuba', 'Havana', 'North America'], ['Ireland', 'Dublin', 'Europe'],
  ['New Zealand', 'Wellington', 'Oceania'], ['Turkey', 'Ankara', 'Asia'],
  ['Finland', 'Helsinki', 'Europe'], ['Senegal', 'Dakar', 'Africa']
];

export const geographyPool = [
  r => {
    const [c, cap] = pick(r, COUNTRIES);
    const others = sample(r, COUNTRIES.filter(x => x[0] !== c), 3).map(x => x[1]);
    return choice(r, { prompt: `What is the capital of ${c}?`, correct: cap, distractors: others,
      explanation: `The capital of ${c} is ${cap}.` });
  },
  r => {
    const [c, , cont] = pick(r, COUNTRIES);
    const others = [...new Set(COUNTRIES.map(x => x[2]))].filter(x => x !== cont);
    return choice(r, { prompt: `Which continent is ${c} in?`, correct: cont, distractors: sample(r, others, 3),
      explanation: `${c} is in ${cont}.` });
  },
  r => matchQ(r, { prompt: 'Match each country to its capital.',
    pairs: sample(r, COUNTRIES, 4).map(([c, cap]) => ({ left: c, right: cap })),
    explanation: 'Note that the capital is not always the largest city.' }),
  r => matchQ(r, { prompt: 'Match each country to its continent.',
    pairs: sample(r, COUNTRIES, 4).map(([c, , cont]) => ({ left: c, right: cont })),
    explanation: 'Continental placement.' }),
  r => {
    const [c, cap] = pick(r, COUNTRIES);
    return blankQ(`${cap} is the capital of which country?`, c, { explanation: `${cap} is the capital of ${c}.` });
  }
];

/* ============================== LANGUAGES ============================== */
const LANG = {
  spanish: [['el perro','the dog'],['la casa','the house'],['el libro','the book'],['la ciudad','the city'],
    ['el agua','the water'],['la mesa','the table'],['el niño','the boy'],['la escuela','the school'],
    ['verde','green'],['rojo','red'],['azul','blue'],['grande','big'],['pequeño','small'],
    ['hablar','to speak'],['comer','to eat'],['vivir','to live'],['leer','to read'],['escribir','to write'],
    ['siempre','always'],['nunca','never'],['ahora','now'],['mañana','tomorrow'],['ayer','yesterday'],
    ['el pan','the bread'],['la leche','the milk'],['el queso','the cheese'],['la ventana','the window'],
    ['el trabajo','the work'],['la familia','the family'],['el amigo','the friend']],
  french: [['le chien','the dog'],['la maison','the house'],['le livre','the book'],['la ville','the city'],
    ["l'eau",'the water'],['la table','the table'],["le garçon",'the boy'],["l'école",'the school'],
    ['vert','green'],['rouge','red'],['bleu','blue'],['grand','big'],['petit','small'],
    ['parler','to speak'],['manger','to eat'],['vivre','to live'],['lire','to read'],['écrire','to write'],
    ['toujours','always'],['jamais','never'],['maintenant','now'],['demain','tomorrow'],['hier','yesterday'],
    ['le pain','the bread'],['le lait','the milk'],['le fromage','the cheese'],['la fenêtre','the window'],
    ['le travail','the work'],['la famille','the family'],["l'ami",'the friend']],
  german: [['der Hund','the dog'],['das Haus','the house'],['das Buch','the book'],['die Stadt','the city'],
    ['das Wasser','the water'],['der Tisch','the table'],['der Junge','the boy'],['die Schule','the school'],
    ['grün','green'],['rot','red'],['blau','blue'],['groß','big'],['klein','small'],
    ['sprechen','to speak'],['essen','to eat'],['leben','to live'],['lesen','to read'],['schreiben','to write'],
    ['immer','always'],['nie','never'],['jetzt','now'],['morgen','tomorrow'],['gestern','yesterday'],
    ['das Brot','the bread'],['die Milch','the milk'],['der Käse','the cheese'],['das Fenster','the window'],
    ['die Arbeit','the work'],['die Familie','the family'],['der Freund','the friend']]
};

const langPool = (lang, name) => [
  r => {
    const [f, e] = pick(r, LANG[lang]);
    const others = sample(r, LANG[lang].filter(x => x[0] !== f), 3).map(x => x[1]);
    return choice(r, { prompt: `What does "${f}" mean?`, correct: e, distractors: others,
      explanation: `"${f}" means "${e}".` });
  },
  r => {
    const [f, e] = pick(r, LANG[lang]);
    return blankQ(`Translate into ${name}: "${e}"`, f, { explanation: `"${e}" is "${f}".` });
  },
  r => matchQ(r, { prompt: `Match each ${name} word to its English meaning.`,
    pairs: sample(r, LANG[lang], 4).map(([f, e]) => ({ left: f, right: e })),
    explanation: 'Core vocabulary.' }),
  r => multiQ(r, { prompt: `Which of these ${name} words are verbs? Choose all that apply.`,
    correct: sample(r, LANG[lang].filter(x => x[1].startsWith('to ')), 2).map(x => x[0]),
    wrong: sample(r, LANG[lang].filter(x => !x[1].startsWith('to ')), 2).map(x => x[0]),
    explanation: 'Verbs are the ones whose English translation starts with "to".' })
];

export const spanishPool = langPool('spanish', 'Spanish');
export const frenchPool  = langPool('french', 'French');
export const germanPool  = langPool('german', 'German');

/* =============================== GRAMMAR =============================== */
const SENTENCES = [
  ['The tired runner finished slowly', 'tired', 'runner', 'finished', 'slowly'],
  ['A curious child opened it carefully', 'curious', 'child', 'opened', 'carefully'],
  ['The old bridge collapsed suddenly', 'old', 'bridge', 'collapsed', 'suddenly'],
  ['Our new teacher explained it clearly', 'new', 'teacher', 'explained', 'clearly'],
  ['The hungry cat waited patiently', 'hungry', 'cat', 'waited', 'patiently'],
  ['A brave firefighter climbed quickly', 'brave', 'firefighter', 'climbed', 'quickly'],
  ['The heavy rain fell steadily', 'heavy', 'rain', 'fell', 'steadily'],
  ['His younger sister sang beautifully', 'younger', 'sister', 'sang', 'beautifully'],
  ['The busy street emptied gradually', 'busy', 'street', 'emptied', 'gradually'],
  ['A quiet student answered confidently', 'quiet', 'student', 'answered', 'confidently']
];
const PLURALS = [['child','children'],['knife','knives'],['leaf','leaves'],['mouse','mice'],
  ['goose','geese'],['tooth','teeth'],['foot','feet'],['person','people'],['cactus','cacti'],
  ['analysis','analyses'],['half','halves'],['loaf','loaves'],['thief','thieves'],['woman','women']];
const PASTS = [['go','went'],['bring','brought'],['catch','caught'],['teach','taught'],['buy','bought'],
  ['think','thought'],['write','wrote'],['drink','drank'],['swim','swam'],['begin','began'],
  ['choose','chose'],['fly','flew'],['speak','spoke'],['break','broke'],['steal','stole']];

export const grammarPool = [
  r => {
    const [s, adj, noun, verb, adv] = pick(r, SENTENCES);
    const which = pick(r, [['verb', verb], ['adjective', adj], ['noun', noun], ['adverb', adv]]);
    return choice(r, { prompt: `In "${s}", which word is the ${which[0]}?`,
      correct: which[1], distractors: [adj, noun, verb, adv].filter(w => w !== which[1]),
      explanation: `"${which[1]}" is the ${which[0]} in that sentence.` });
  },
  r => {
    const [sing, plur] = pick(r, PLURALS);
    return blankQ(`Write the plural of "${sing}".`, plur,
      { explanation: `The plural of "${sing}" is "${plur}".` });
  },
  r => {
    const [inf, past] = pick(r, PASTS);
    return blankQ(`Write the past tense of "${inf}".`, past,
      { explanation: `"${inf}" becomes "${past}" in the past simple.` });
  },
  r => matchQ(r, { prompt: 'Match each verb to its past simple form.',
    pairs: sample(r, PASTS, 4).map(([a, b]) => ({ left: a, right: b })),
    explanation: 'Common irregular verbs.' }),
  r => matchQ(r, { prompt: 'Match each singular noun to its plural.',
    pairs: sample(r, PLURALS, 4).map(([a, b]) => ({ left: a, right: b })),
    explanation: 'Irregular plurals do not simply take -s.' })
];

export const POOL_GENERATORS = {
  vocabulary: vocabularyPool, spelling: spellingPool, geography: geographyPool,
  spanish: spanishPool, french: frenchPool, german: germanPool, grammar: grammarPool
};

/* ============================== CHEMISTRY ============================== */
/* [symbol, name, group] */
const ELEMENTS = [
  ['H','Hydrogen','non-metal'], ['He','Helium','noble gas'], ['Li','Lithium','alkali metal'],
  ['Be','Beryllium','alkaline earth metal'], ['B','Boron','metalloid'], ['C','Carbon','non-metal'],
  ['N','Nitrogen','non-metal'], ['O','Oxygen','non-metal'], ['F','Fluorine','halogen'],
  ['Ne','Neon','noble gas'], ['Na','Sodium','alkali metal'], ['Mg','Magnesium','alkaline earth metal'],
  ['Al','Aluminium','metal'], ['Si','Silicon','metalloid'], ['P','Phosphorus','non-metal'],
  ['S','Sulfur','non-metal'], ['Cl','Chlorine','halogen'], ['Ar','Argon','noble gas'],
  ['K','Potassium','alkali metal'], ['Ca','Calcium','alkaline earth metal'], ['Fe','Iron','transition metal'],
  ['Cu','Copper','transition metal'], ['Zn','Zinc','transition metal'], ['Ag','Silver','transition metal'],
  ['Sn','Tin','metal'], ['I','Iodine','halogen'], ['Au','Gold','transition metal'],
  ['Hg','Mercury','transition metal'], ['Pb','Lead','metal'], ['U','Uranium','actinide'],
  ['Ni','Nickel','transition metal'], ['Kr','Krypton','noble gas'], ['Br','Bromine','halogen'],
  ['Ba','Barium','alkaline earth metal'], ['Ti','Titanium','transition metal']
];

export const chemistryPool = [
  r => {
    const [sym, name] = pick(r, ELEMENTS);
    return choice(r, { prompt: `Which element has the symbol ${sym}?`, correct: name,
      distractors: sample(r, ELEMENTS.filter(e => e[0] !== sym), 3).map(e => e[1]),
      explanation: `${sym} is ${name}.` });
  },
  r => {
    const [sym, name] = pick(r, ELEMENTS);
    return blankQ(`What is the chemical symbol for ${name.toLowerCase()}?`, sym,
      { explanation: `${name} has the symbol ${sym}.` });
  },
  r => {
    const [sym, name, group] = pick(r, ELEMENTS);
    const groups = [...new Set(ELEMENTS.map(e => e[2]))].filter(g => g !== group);
    return choice(r, { prompt: `${name} belongs to which group of elements?`, correct: group,
      distractors: sample(r, groups, 3), explanation: `${name} is classified as a ${group}.` });
  },
  r => matchQ(r, { prompt: 'Match each element to its symbol.',
    pairs: sample(r, ELEMENTS, 4).map(([sym, name]) => ({ left: name, right: sym })),
    explanation: 'Symbols are often from the Latin name — sodium is Na, from natrium.' })
];

/* =============================== BIOLOGY =============================== */
const BIO_TERMS = [
  ['Nucleus','Contains the cell’s genetic material'], ['Mitochondrion','Releases energy from glucose'],
  ['Chloroplast','Absorbs light for photosynthesis'], ['Ribosome','Builds proteins'],
  ['Cell membrane','Controls what enters and leaves the cell'], ['Vacuole','Stores water and keeps the cell firm'],
  ['Enzyme','A biological catalyst'], ['Chromosome','A structure carrying many genes'],
  ['Gene','A length of DNA coding for a characteristic'], ['Allele','A version of a gene'],
  ['Photosynthesis','Making glucose from carbon dioxide and water using light'],
  ['Respiration','Releasing energy from glucose'], ['Diffusion','Movement from high to low concentration'],
  ['Osmosis','Movement of water across a partially permeable membrane'],
  ['Producer','An organism that makes its own food'], ['Consumer','An organism that eats other organisms'],
  ['Decomposer','An organism that breaks down dead material'], ['Habitat','Where an organism lives'],
  ['Species','A group that can breed to produce fertile offspring'],
  ['Adaptation','A feature that helps survival in a habitat'],
  ['Artery','Carries blood away from the heart'], ['Vein','Carries blood back to the heart'],
  ['Capillary','Where exchange with tissue happens'], ['Alveolus','Where gas exchange occurs in the lung'],
  ['Neurone','A cell that carries electrical impulses'], ['Antibody','A protein that binds a specific pathogen'],
  ['Pathogen','A microorganism that causes disease'], ['Vaccine','Trains immunity without causing the disease']
];

export const biologyPool = [
  r => {
    const [term, def] = pick(r, BIO_TERMS);
    return choice(r, { prompt: `What is the role of the ${term.toLowerCase()}?`, correct: def,
      distractors: sample(r, BIO_TERMS.filter(t => t[0] !== term), 3).map(t => t[1]),
      explanation: `${term}: ${def.toLowerCase()}.` });
  },
  r => {
    const [term, def] = pick(r, BIO_TERMS);
    return blankQ(`Which term is described here? "${def}"`, term,
      { explanation: `That describes the ${term.toLowerCase()}.` });
  },
  r => matchQ(r, { prompt: 'Match each term to its description.',
    pairs: sample(r, BIO_TERMS, 4).map(([t, d]) => ({ left: t, right: d })),
    explanation: 'Core biological vocabulary.' })
];

/* ================================ HISTORY ================================ */
/* [event, year, note] */
const EVENTS = [
  ['The signing of Magna Carta', '1215', 'limited the English king’s power'],
  ['The fall of Constantinople', '1453', 'ended the Byzantine Empire'],
  ['Columbus reaches the Americas', '1492', 'began sustained European contact'],
  ['Martin Luther’s Ninety-five Theses', '1517', 'began the Reformation'],
  ['The Spanish Armada', '1588', 'failed to invade England'],
  ['The Declaration of Independence', '1776', 'declared the American colonies independent'],
  ['The storming of the Bastille', '1789', 'began the French Revolution'],
  ['The Battle of Waterloo', '1815', 'ended the Napoleonic Wars'],
  ['The abolition of slavery in the British Empire', '1833', 'freed enslaved people across the empire'],
  ['The publication of On the Origin of Species', '1859', 'set out evolution by natural selection'],
  ['The start of the First World War', '1914', 'followed the assassination in Sarajevo'],
  ['The Russian Revolution', '1917', 'brought the Bolsheviks to power'],
  ['The Wall Street Crash', '1929', 'triggered the Great Depression'],
  ['The start of the Second World War', '1939', 'followed the invasion of Poland'],
  ['The founding of the United Nations', '1945', 'followed the Second World War'],
  ['Indian independence', '1947', 'ended British rule in the subcontinent'],
  ['The first human in space', '1961', 'was Yuri Gagarin'],
  ['The first Moon landing', '1969', 'was Apollo 11'],
  ['The fall of the Berlin Wall', '1989', 'preceded German reunification'],
  ['The end of apartheid in South Africa', '1994', 'brought the first fully free elections']
];

export const historyPool = [
  r => {
    const [ev, year] = pick(r, EVENTS);
    const others = sample(r, EVENTS.filter(e => e[1] !== year), 3).map(e => e[1]);
    return choice(r, { prompt: `In which year did this happen: ${ev.toLowerCase()}?`, correct: year,
      distractors: others, explanation: `${ev} took place in ${year}.` });
  },
  r => {
    const [ev, year, note] = pick(r, EVENTS);
    return blankQ(`Which event of ${year} ${note}?`, ev,
      { explanation: `${ev}, ${year} — it ${note}.` });
  },
  r => {
    const picked = sample(r, EVENTS, 4).sort((a, b) => Number(a[1]) - Number(b[1]));
    return { type: 'order', prompt: 'Put these events in chronological order.',
      items: picked.map(e => e[0]),
      explanation: picked.map(e => `${e[0]} (${e[1]})`).join(', ') + '.' };
  },
  r => matchQ(r, { prompt: 'Match each event to its year.',
    pairs: sample(r, EVENTS, 4).map(([ev, y]) => ({ left: ev, right: y })),
    explanation: 'Dates worth anchoring.' })
];

/* ================================ ANATOMY ================================ */
const BODY = [
  ['Heart','Circulatory','Pumps blood around the body'],
  ['Lungs','Respiratory','Exchange oxygen and carbon dioxide'],
  ['Stomach','Digestive','Breaks food down with acid and enzymes'],
  ['Liver','Digestive','Processes nutrients and filters toxins'],
  ['Kidneys','Urinary','Filter blood and make urine'],
  ['Brain','Nervous','Processes information and controls the body'],
  ['Skin','Integumentary','Protects the body and regulates temperature'],
  ['Pancreas','Endocrine','Releases insulin and digestive enzymes'],
  ['Small intestine','Digestive','Absorbs most nutrients'],
  ['Bladder','Urinary','Stores urine'],
  ['Diaphragm','Respiratory','Drives breathing'],
  ['Spinal cord','Nervous','Carries signals between brain and body'],
  ['Femur','Skeletal','The thigh bone, the longest in the body'],
  ['Biceps','Muscular','Flexes the elbow'],
  ['Trachea','Respiratory','Carries air to the lungs']
];

export const anatomyPool = [
  r => {
    const [organ, system] = pick(r, BODY);
    const systems = [...new Set(BODY.map(b => b[1]))].filter(s => s !== system);
    return choice(r, { prompt: `Which system does the ${organ.toLowerCase()} belong to?`, correct: system,
      distractors: sample(r, systems, 3), explanation: `The ${organ.toLowerCase()} is part of the ${system.toLowerCase()} system.` });
  },
  r => {
    const [organ, , job] = pick(r, BODY);
    return choice(r, { prompt: `What does the ${organ.toLowerCase()} do?`, correct: job,
      distractors: sample(r, BODY.filter(b => b[0] !== organ), 3).map(b => b[2]),
      explanation: `The ${organ.toLowerCase()}: ${job.toLowerCase()}.` });
  },
  r => matchQ(r, { prompt: 'Match each organ to its system.',
    pairs: sample(r, BODY, 4).map(([o, s]) => ({ left: o, right: s })),
    explanation: 'Organs group into systems by the job they share.' })
];

/* ============================== ART HISTORY ============================== */
const ARTISTS = [
  ['Claude Monet','Impressionism'], ['Pablo Picasso','Cubism'], ['Salvador Dalí','Surrealism'],
  ['Michelangelo','Renaissance'], ['Andy Warhol','Pop art'], ['Vincent van Gogh','Post-Impressionism'],
  ['Frida Kahlo','Surrealism'], ['Jackson Pollock','Abstract Expressionism'],
  ['Caravaggio','Baroque'], ['Leonardo da Vinci','Renaissance'], ['Georgia O’Keeffe','Modernism'],
  ['Henri Matisse','Fauvism'], ['Edvard Munch','Expressionism'], ['Rembrandt','Baroque'],
  ['Wassily Kandinsky','Abstract art'], ['Katsushika Hokusai','Ukiyo-e']
];

export const artPool = [
  r => {
    const [artist, movement] = pick(r, ARTISTS);
    const others = [...new Set(ARTISTS.map(a => a[1]))].filter(m => m !== movement);
    return choice(r, { prompt: `Which movement is ${artist} associated with?`, correct: movement,
      distractors: sample(r, others, 3), explanation: `${artist} is identified with ${movement}.` });
  },
  r => matchQ(r, { prompt: 'Match each artist to a movement.',
    pairs: sample(r, ARTISTS, 4).map(([a, m]) => ({ left: a, right: m })),
    explanation: 'Each artist is strongly identified with one movement.' })
];

Object.assign(POOL_GENERATORS, {
  chemistry: chemistryPool, biology: biologyPool, history: historyPool,
  anatomy: anatomyPool, 'art-history': artPool
});
