/* Social studies, computer science, study skills and arts item banks. */

import { int, pick, choice, blankQ, multiQ, matchQ, orderQ, writtenQ, mathQ, num } from './gen-core.js';

const C = (prompt, correct, distractors, explanation, hint) =>
  r => choice(r, { prompt, correct, distractors, explanation, hint });
const B = (prompt, answer, explanation, accept = []) =>
  () => ({ type: 'blank', prompt, answer, accept, explanation });

/* -------------------------------- HISTORY -------------------------------- */
export const history = [
  C('Rome changed from a republic to an empire under…', 'Augustus',
    ['Julius Caesar', 'Nero', 'Constantine'],
    'Augustus became the first emperor in 27 BCE; Caesar was assassinated before the change was complete.'),
  C('The Industrial Revolution began in which country?', 'Britain',
    ['France', 'Germany', 'The United States'],
    'It began in Britain in the late eighteenth century, driven by coal, iron and textile machinery.'),
  C('What was the immediate trigger of the First World War?', 'The assassination of Archduke Franz Ferdinand',
    ['The invasion of Poland', 'The sinking of the Lusitania', 'The Treaty of Versailles'],
    'The assassination in Sarajevo in June 1914 set the alliance system in motion.'),
  C('The Renaissance is best described as…', 'A rebirth of interest in classical learning and art',
    ['A religious war', 'A trade agreement', 'A period of plague'],
    'Beginning in Italy in the fourteenth century, it revived classical ideas in art, science and thought.'),
  C('What was the Silk Road?', 'A network of trade routes linking Asia and Europe',
    ['A single paved road in China', 'A sea route around Africa', 'A canal in Persia'],
    'It carried goods, technology, religion and disease across Eurasia for centuries.'),
  C('Which document limited the power of the English monarch in 1215?', 'Magna Carta',
    ['The Bill of Rights', 'The Domesday Book', 'The Act of Union'],
    'Magna Carta established that the king was subject to law.'),
  B('What was the Roman governing council called?', 'senate',
    'The Senate advised, and in the Republic held great power.', ['the senate']),
  B('Which ancient civilisation built along the river Nile?', 'Egypt',
    'The Nile’s annual flood made intensive farming possible.', ['ancient egypt', 'egyptian']),
  r => orderQ('Put these events in chronological order.',
    ['Founding of the Roman Republic', 'Punic Wars with Carthage', 'Assassination of Julius Caesar', 'Fall of the Western Roman Empire'],
    '509 BCE, then 264–146 BCE, then 44 BCE, then 476 CE.'),
  r => orderQ('Put these periods in chronological order.',
    ['Ancient Egypt', 'Classical Greece', 'The Roman Empire', 'The Middle Ages', 'The Renaissance'],
    'Each follows the last across roughly three thousand years.'),
  r => matchQ(r, { prompt: 'Match each term to its meaning.', pairs: [
    { left: 'Patrician', right: 'Member of the noble class' },
    { left: 'Plebeian', right: 'Ordinary citizen' },
    { left: 'Legion', right: 'Large army unit' },
    { left: 'Forum', right: 'Public meeting place' },
    { left: 'Aqueduct', right: 'Channel carrying water' }
  ], explanation: 'Roman civic, military and engineering vocabulary.' }),
  r => multiQ(r, { prompt: 'Which of these are Roman engineering achievements? Choose all that apply.',
    correct: ['Aqueducts', 'Concrete domes', 'Paved road networks'],
    wrong: ['The printing press', 'The steam engine'],
    explanation: 'The printing press is fifteenth-century and the steam engine eighteenth-century.' }),
  () => writtenQ('Give one reason historians suggest for the fall of the Western Roman Empire, and explain it.',
    'Overextension: the empire had become too large to defend, so money and soldiers were stretched along enormous frontiers at the same time as pressure from migrating groups increased.',
    'Accept any well-explained cause: economic strain, political instability, military pressure, plague, or the division of the empire.'),
  () => writtenQ('Why do historians prefer primary sources, and what caution do they still apply?',
    'Primary sources come from the time being studied, so they are closer to events than later accounts. Historians still ask who wrote it, for whom and why, because a source can be honest and still be partial, mistaken or deliberately shaped.',
    'Look for proximity to events plus awareness of bias and purpose.')
];

/* ------------------------------- GEOGRAPHY ------------------------------- */
export const geography = [
  C('Which is the largest ocean?', 'The Pacific', ['The Atlantic', 'The Indian', 'The Arctic'],
    'The Pacific is the largest and deepest ocean.'),
  C('What does a compass rose on a map show?', 'Direction', ['Distance', 'Height above sea level', 'Population'],
    'It shows the cardinal directions.'),
  C('Lines of latitude run…', 'East to west, measuring distance north or south',
    ['North to south, measuring east or west', 'Only across oceans', 'Through the poles only'],
    'Latitude lines are parallel to the equator.'),
  C('Which climate would you expect at the equator?', 'Hot and wet all year',
    ['Cold and dry', 'Four distinct seasons', 'Hot summers and freezing winters'],
    'Direct sunlight year-round produces high temperatures and heavy convectional rain.'),
  C('What is a delta?', 'A landform where a river deposits sediment at its mouth',
    ['A deep ocean trench', 'A desert basin', 'A mountain pass'],
    'The river slows as it meets the sea and drops its load.'),
  C('Which is a renewable energy source?', 'Wind', ['Coal', 'Natural gas', 'Oil'],
    'Wind is replenished continuously; fossil fuels are not.'),
  B('How many continents are there?', '7',
    'Africa, Antarctica, Asia, Australia, Europe, North America and South America.', ['seven']),
  B('The imaginary line around the middle of the Earth is called the ___.', 'equator',
    'The equator sits at 0° latitude, halfway between the poles.'),
  B('What is the capital of Japan?', 'Tokyo', 'Tokyo has been the capital since 1868.'),
  r => matchQ(r, { prompt: 'Match each country to its continent.', pairs: [
    { left: 'Egypt', right: 'Africa' }, { left: 'Brazil', right: 'South America' },
    { left: 'Japan', right: 'Asia' }, { left: 'Spain', right: 'Europe' },
    { left: 'Peru', right: 'South America' }
  ], explanation: 'Basic continental geography.' }),
  r => matchQ(r, { prompt: 'Match each country to its capital.', pairs: [
    { left: 'France', right: 'Paris' }, { left: 'Kenya', right: 'Nairobi' },
    { left: 'Canada', right: 'Ottawa' }, { left: 'Australia', right: 'Canberra' },
    { left: 'Norway', right: 'Oslo' }
  ], explanation: 'Note that the capital is not always the largest city.' }),
  r => multiQ(r, { prompt: 'Which of these are physical features rather than human-made? Choose all that apply.',
    correct: ['Mountain', 'River', 'Valley'], wrong: ['Bridge', 'Motorway'],
    explanation: 'Physical features form naturally; human features are built.' }),
  () => writtenQ('Explain one way rivers shape the landscape.',
    'A river erodes its bed and banks in its upper course, cutting a steep V-shaped valley, then transports that material downstream and deposits it where it slows, building flood plains and deltas.',
    'Look for erosion, transport and deposition.')
];

/* --------------------------------- CIVICS --------------------------------- */
export const civics = [
  C('What is the main purpose of a constitution?', 'To set out how power is held and limited',
    ['To list all a country’s laws', 'To record its history', 'To set tax rates'],
    'A constitution defines institutions and the limits on their power.'),
  C('In a democracy, ultimate authority rests with…', 'The people',
    ['The head of state', 'The courts', 'The army'],
    'Democratic legitimacy comes from the consent of the governed, expressed through elections.'),
  C('What does the separation of powers mean?', 'Legislative, executive and judicial power are held separately',
    ['Each region governs itself', 'Church and state are separate', 'Parties take turns in office'],
    'Splitting power between branches lets each check the others.'),
  C('What is the role of an independent judiciary?', 'To interpret and apply the law free from political pressure',
    ['To write new laws', 'To run elections', 'To set the budget'],
    'Independence is what allows courts to rule against the government of the day.'),
  C('A referendum is…', 'A direct public vote on a single question',
    ['An election for representatives', 'A parliamentary debate', 'A court ruling'],
    'Referendums put one question directly to voters.'),
  B('What is the term for the right to vote?', 'suffrage',
    'Universal suffrage means all adult citizens may vote.', ['the franchise', 'franchise']),
  r => matchQ(r, { prompt: 'Match each branch of government to its role.', pairs: [
    { left: 'Legislature', right: 'Makes laws' },
    { left: 'Executive', right: 'Carries out laws' },
    { left: 'Judiciary', right: 'Interprets laws' },
    { left: 'Civil service', right: 'Administers public services' }
  ], explanation: 'The three classical branches plus the permanent administration.' }),
  r => multiQ(r, { prompt: 'Which are responsibilities of citizens in most democracies? Choose all that apply.',
    correct: ['Obeying the law', 'Serving on a jury when called', 'Paying taxes'],
    wrong: ['Joining a political party', 'Standing for election'],
    explanation: 'The last two are rights available to citizens, not duties.' }),
  () => writtenQ('Why does a free press matter in a democracy?',
    'A free press lets citizens find out what those in power are actually doing, which is the information they need to vote meaningfully. It also deters abuses, because officials know their decisions may be scrutinised and published.',
    'Look for informed voting and accountability.')
];

/* -------------------------------- ECONOMICS -------------------------------- */
export const economics = [
  C('If the price of a good rises, the quantity demanded usually…', 'Falls',
    ['Rises', 'Stays the same', 'Becomes zero'],
    'The law of demand: higher price, lower quantity demanded, all else equal.'),
  C('A price set below the equilibrium creates…', 'A shortage',
    ['A surplus', 'No effect', 'Inflation'],
    'At a low price buyers want more than sellers will supply.'),
  C('Demand for insulin is highly inelastic. That means…', 'Quantity demanded barely changes when the price rises',
    ['Buyers stop buying when the price rises', 'Supply cannot be increased', 'The price is fixed by law'],
    'Inelastic demand responds weakly to price, which is typical of necessities.'),
  C('What is opportunity cost?', 'The value of the next best alternative given up',
    ['The money price of a good', 'The cost of production', 'A tax on imports'],
    'Every choice forgoes something; that forgone option is the opportunity cost.'),
  C('Inflation means…', 'A general rise in the price level',
    ['A rise in one product’s price', 'A fall in employment', 'A rise in exports'],
    'Inflation is a sustained increase in the general price level, reducing purchasing power.'),
  B('The price at which supply equals demand is called the ___ price.', 'equilibrium',
    'At equilibrium there is neither shortage nor surplus.', ['market clearing']),
  r => matchQ(r, { prompt: 'Match each term to its meaning.', pairs: [
    { left: 'Substitute good', right: 'Bought instead of another good' },
    { left: 'Complement good', right: 'Bought alongside another good' },
    { left: 'Surplus', right: 'Supply exceeds demand' },
    { left: 'Elasticity', right: 'How responsive quantity is to price' },
    { left: 'Subsidy', right: 'Government payment lowering a producer’s costs' }
  ], explanation: 'Core market vocabulary.' }),
  r => multiQ(r, { prompt: 'Which would shift the demand curve for coffee to the right? Choose all that apply.',
    correct: ['A rise in consumer income', 'A study showing coffee is healthy', 'A rise in the price of tea'],
    wrong: ['A fall in the price of coffee', 'A fall in the cost of coffee beans'],
    explanation: 'A change in coffee’s own price moves along the curve; a change in production costs shifts supply, not demand.' }),
  () => writtenQ('A drought destroys half a country’s wheat crop. Describe the effect on the wheat market.',
    'Supply shifts left, because less wheat is available at every price. With demand unchanged, the equilibrium price rises and the equilibrium quantity falls.',
    'Look for a leftward supply shift, higher price and lower quantity.')
];

/* ------------------------------- PROGRAMMING ------------------------------- */
export const programming = [
  (r) => {
    const n = int(r, 3, 12);
    return blankQ(`How many times does this loop run?\nfor i in range(${n}):`, String(n),
      { explanation: `range(${n}) yields 0 to ${n - 1}, which is ${n} iterations.` });
  },
  (r) => {
    const start = int(r, 1, 5), step = int(r, 2, 4), stop = start + step * int(r, 2, 4) + 1;
    const vals = []; for (let v = start; v < stop; v += step) vals.push(v);
    return blankQ(`What is the last number produced by range(${start}, ${stop}, ${step})?`, String(vals[vals.length - 1]),
      { hint: 'Start, stop (exclusive), step.', explanation: `It yields ${vals.join(', ')}.` });
  },
  (r) => {
    const nums = Array.from({ length: 4 }, () => int(r, 1, 20));
    return blankQ(`What is printed?\ntotal = 0\nfor n in [${nums.join(', ')}]:\n    total += n\nprint(total)`,
      String(nums.reduce((a, b) => a + b, 0)),
      { explanation: `${nums.join(' + ')} = ${nums.reduce((a, b) => a + b, 0)}.` });
  },
  (r) => {
    const a = int(r, 10, 40), b = int(r, 2, 9);
    return blankQ(`What is printed?\nprint(${a} % ${b})`, String(a % b),
      { hint: '% gives the remainder after division.', explanation: `${a} ÷ ${b} leaves a remainder of ${a % b}.` });
  },
  C('Which operator tests equality in Python?', '==', ['=', '===', ':='],
    'A single = assigns a value; == compares two values.'),
  C('A while loop whose condition never becomes false will…', 'Loop forever',
    ['Skip the body', 'Run exactly once', 'Raise a SyntaxError'],
    'That is an infinite loop, usually caused by forgetting to update the counter.'),
  C('What does a function’s return statement do?', 'Sends a value back to the caller and ends the function',
    ['Prints a value', 'Restarts the function', 'Declares a variable'],
    'Return hands a value back and stops execution of that call.'),
  C('Which data structure stores key–value pairs?', 'Dictionary', ['List', 'Tuple', 'Set'],
    'A dictionary maps keys to values; a list is indexed by position.'),
  C('What is the value of len("worksheet")?', '9', ['8', '10', '7'],
    'Count the characters: w-o-r-k-s-h-e-e-t is 9.'),
  r => multiQ(r, { prompt: 'Which expressions evaluate to True? Choose all that apply.',
    correct: ['3 > 2', '5 % 2 == 1', 'not False'], wrong: ['"a" == "A"', '10 / 2 == 6'],
    explanation: 'String comparison is case-sensitive, so "a" == "A" is False.' }),
  () => orderQ('Order these steps to sum the even numbers from 1 to 100.',
    ['Set total = 0', 'Loop n over range(1, 101)', 'Check if n % 2 == 0', 'Add n to total when the check passes', 'Print total after the loop'],
    'Initialise, iterate, test, accumulate, report.'),
  () => writtenQ('Explain what an off-by-one error is and give an example.',
    'It is a bug where a loop runs one time too many or too few, usually from confusing inclusive and exclusive bounds. For example, range(1, 10) stops at 9, so using it when you meant to include 10 quietly loses the last item.',
    'Look for boundary confusion with a concrete example.')
];

/* -------------------------------- ALGORITHMS -------------------------------- */
export const algorithms = [
  C('What is an algorithm?', 'A precise sequence of steps that solves a problem',
    ['A programming language', 'A type of computer', 'A kind of database'],
    'An algorithm is the method; code is one expression of it.'),
  C('Binary search requires the data to be…', 'Sorted', ['Numeric', 'Unique', 'Stored in a database'],
    'Each step discards half the data, which only works if the order is known.'),
  C('Roughly how many steps does binary search need on a sorted list of 1000 items?', 'About 10',
    ['About 1000', 'About 500', 'About 100'],
    'Each step halves the list, and 2¹⁰ = 1024, so about 10 steps.'),
  C('Which describes a linear search?', 'Check each item in turn until you find the target',
    ['Halve the list each time', 'Sort first, then jump to the middle', 'Use a hash table'],
    'Linear search is simple and works on unsorted data, but is slow on large inputs.'),
  C('What does O(n) describe?', 'Work that grows in proportion to the input size',
    ['Work that stays constant', 'Work that doubles with each extra item', 'Memory used'],
    'Big-O describes how running time scales as input grows.'),
  B('What is the term for a step in an algorithm that repeats?', 'iteration',
    'Iteration repeats steps; recursion is a function calling itself.', ['a loop', 'loop']),
  r => orderQ('Put these steps of a bubble sort pass in order.',
    ['Compare the first two items', 'Swap them if they are out of order', 'Move one position along', 'Repeat to the end of the list'],
    'Each pass bubbles the largest remaining value to the end.'),
  r => matchQ(r, { prompt: 'Match each algorithm to its typical use.', pairs: [
    { left: 'Binary search', right: 'Finding an item in sorted data' },
    { left: 'Bubble sort', right: 'Teaching how sorting works' },
    { left: 'Dijkstra', right: 'Finding a shortest route' },
    { left: 'Hashing', right: 'Fast lookup by key' }
  ], explanation: 'Each solves a different class of problem.' }),
  () => writtenQ('Why is an algorithm that takes 2ⁿ steps impractical for large n?',
    'The work doubles with every extra item, so adding just ten items multiplies the running time by about a thousand. Even a fast computer runs out of time within a few dozen items.',
    'Look for the idea of exponential growth outrunning hardware.')
];

/* ----------------------------------- DATA ----------------------------------- */
export const data = [
  C('What is a primary key in a database table?', 'A column whose value uniquely identifies each row',
    ['The first column', 'The largest column', 'A column that cannot be edited'],
    'A primary key must be unique and present for every row.'),
  C('What does CSV stand for?', 'Comma-separated values',
    ['Column-sorted values', 'Computed system variables', 'Compressed set values'],
    'A plain-text table format where commas separate fields.'),
  C('Which is structured data?', 'A spreadsheet of dated sales figures',
    ['A folder of photographs', 'A recorded interview', 'A free-text email'],
    'Structured data fits rows and columns with defined types.'),
  C('Why normalise a database?', 'To reduce duplication and keep data consistent',
    ['To make queries longer', 'To compress files', 'To encrypt records'],
    'Storing each fact once means an update cannot leave contradictory copies.'),
  B('What kind of chart is best for showing a share of a whole at one moment?', 'pie chart',
    'Pie charts show composition; line charts show change over time.', ['pie', 'a pie chart']),
  r => matchQ(r, { prompt: 'Match each chart to what it shows best.', pairs: [
    { left: 'Line chart', right: 'Change over time' },
    { left: 'Bar chart', right: 'Comparing categories' },
    { left: 'Scatter plot', right: 'Relationship between two variables' },
    { left: 'Histogram', right: 'Distribution of one variable' }
  ], explanation: 'Choose the form from the question you are asking.' }),
  () => writtenQ('A chart shows ice cream sales and drowning incidents rising together. Why is "ice cream causes drowning" a bad conclusion?',
    'Correlation is not causation. Both rise in hot weather, which is a third factor driving each independently. Without controlling for temperature the chart says nothing about cause.',
    'Look for the confounding variable.')
];

/* ------------------------------- STUDY SKILLS ------------------------------- */
export const notes = [
  C('What makes notes more useful weeks later?', 'Writing them in your own words',
    ['Copying the slides exactly', 'Using as many colours as possible', 'Writing everything down'],
    'Rephrasing forces understanding, which is what makes notes readable later.'),
  C('The Cornell method divides a page into…', 'Cues, notes and a summary',
    ['Three equal columns', 'Questions and answers only', 'A mind map'],
    'A narrow cue column, a wide notes area, and a summary strip at the bottom.'),
  C('What is the point of leaving white space in notes?', 'Room to add connections and corrections later',
    ['To use more paper', 'To make them look neat', 'To slow you down'],
    'Notes get revisited; space lets you build on them.'),
  B('What is the technique of turning notes into questions and testing yourself called?', 'active recall',
    'Retrieving information strengthens memory far more than rereading.', ['retrieval practice', 'self-testing']),
  () => writtenQ('Why is copying a slide word for word usually a poor note-taking strategy?',
    'Copying is a mechanical task that can be done without understanding, so nothing is processed. The notes then just duplicate a document you already have, instead of capturing what you did not yet grasp.',
    'Look for lack of processing and duplicated material.')
];

export const revision = [
  C('Which is more effective for long-term memory?', 'Spaced practice over several days',
    ['One long session the night before', 'Rereading notes repeatedly', 'Highlighting the textbook'],
    'Spacing forces retrieval after partial forgetting, which strengthens memory.'),
  C('What is interleaving?', 'Mixing different topics within one revision session',
    ['Revising one topic until perfect', 'Revising with a partner', 'Alternating study and sleep'],
    'Mixing topics improves the ability to tell problem types apart.'),
  C('Why is self-testing better than rereading?', 'Retrieving information strengthens the memory of it',
    ['It takes less time', 'It feels easier', 'It covers more material'],
    'Rereading feels productive because it feels fluent, but fluency is not learning.'),
  B('What is the name for revising material at increasing intervals?', 'spaced repetition',
    'Each successful recall lets the next gap grow longer.', ['spacing', 'distributed practice']),
  r => orderQ('Order these revision steps most effectively.',
    ['Make a topic list from the syllabus', 'Test yourself on each topic', 'Focus on the weakest topics', 'Retest after a few days'],
    'Find gaps first, then spend time where it counts, then re-check.'),
  () => writtenQ('Why does highlighting a textbook feel productive but often achieve little?',
    'Highlighting is a recognition task: it marks text without requiring you to retrieve or explain anything. It creates a sense of fluency and coverage while leaving the material no better stored than before.',
    'Look for the distinction between recognition and retrieval.')
];

export const exams = [
  C('What should you do first in a written exam?', 'Read the whole paper and plan your time',
    ['Start question one immediately', 'Answer the longest question first', 'Write an introduction'],
    'A minute spent planning saves far more later.'),
  C('A question worth 12 marks in a 90-minute, 60-mark paper deserves roughly…', 'About 18 minutes',
    ['About 5 minutes', 'About 30 minutes', 'As long as it takes'],
    'Allocate time in proportion to marks: 12/60 of 90 minutes is 18.'),
  C('What does the command word "evaluate" ask for?', 'A judgement supported by evidence on both sides',
    ['A list of facts', 'A definition', 'A description of a process'],
    'Evaluate means weigh up and reach a supported conclusion.'),
  C('If you run short of time on the last question, the best move is…', 'Write a clear plan or bullet points',
    ['Leave it blank', 'Write a long introduction', 'Repeat an earlier answer'],
    'Structured notes can still earn marks; a blank page cannot.'),
  r => matchQ(r, { prompt: 'Match each command word to what it asks for.', pairs: [
    { left: 'Describe', right: 'Say what something is like' },
    { left: 'Explain', right: 'Give reasons why' },
    { left: 'Compare', right: 'Identify similarities and differences' },
    { left: 'Evaluate', right: 'Weigh evidence and judge' }
  ], explanation: 'Command words tell you what kind of answer earns marks.' }),
  () => writtenQ('You have 10 minutes left and two questions unanswered. What do you do and why?',
    'Split the time and write a structured plan for each rather than a full answer to one. Marks are usually spread across points made, so two partial answers covering several points each will score more than one polished answer and one blank.',
    'Look for reasoning about mark distribution, not just "work faster".')
];

/* ---------------------------------- ARTS ---------------------------------- */
export const artHistory = [
  C('Which movement is Claude Monet associated with?', 'Impressionism',
    ['Cubism', 'Surrealism', 'Baroque'],
    'Impressionists worked with visible brushwork and changing light.'),
  C('What distinguishes Cubism?', 'Objects shown from several viewpoints at once',
    ['Photographic realism', 'Dreamlike imagery', 'Religious subjects only'],
    'Braque and Picasso fractured form into simultaneous viewpoints.'),
  C('Which period is characterised by dramatic light and shadow and strong emotion?', 'Baroque',
    ['Renaissance', 'Minimalism', 'Impressionism'],
    'Baroque artists such as Caravaggio used sharp chiaroscuro for drama.'),
  C('What is chiaroscuro?', 'Strong contrast between light and dark',
    ['Painting on wet plaster', 'A type of frame', 'Layering of glazes'],
    'Chiaroscuro models form through light and shadow.'),
  B('What are the three primary colours in pigment?', 'red, yellow, blue',
    'Mixing these produces the secondary colours orange, green and purple.', ['red yellow blue']),
  r => matchQ(r, { prompt: 'Match each artist to a movement.', pairs: [
    { left: 'Monet', right: 'Impressionism' }, { left: 'Picasso', right: 'Cubism' },
    { left: 'Dalí', right: 'Surrealism' }, { left: 'Michelangelo', right: 'Renaissance' },
    { left: 'Warhol', right: 'Pop art' }
  ], explanation: 'Each artist is strongly identified with one movement.' }),
  () => writtenQ('Explain how an artist can use colour to create mood.',
    'Cool blues and greys tend to read as calm or bleak, while warm reds and oranges read as energetic or urgent. Limiting the palette and using strong contrast can also raise tension, while closely related colours feel settled.',
    'Look for specific colour choices linked to specific feelings.')
];

export const musicTheory = [
  C('How many beats does a semibreve (whole note) last in 4/4 time?', 'Four',
    ['One', 'Two', 'Eight'], 'A semibreve fills a whole 4/4 bar.'),
  C('What does the top number of a time signature tell you?', 'Beats per bar',
    ['The tempo', 'The key', 'Which note gets the beat'],
    'The top number is beats per bar; the bottom says which note value gets one beat.'),
  C('An interval of eight notes is called…', 'An octave', ['A fifth', 'A third', 'A tone'],
    'An octave spans eight letter names and doubles the frequency.'),
  C('What does "forte" mean?', 'Loud', ['Soft', 'Fast', 'Slow'],
    'Forte means loud; piano means soft.'),
  B('How many semitones are there in an octave?', '12',
    'Twelve equal semitones make up an octave in equal temperament.', ['twelve']),
  r => matchQ(r, { prompt: 'Match each term to its meaning.', pairs: [
    { left: 'Tempo', right: 'Speed of the music' },
    { left: 'Dynamics', right: 'How loud or soft' },
    { left: 'Pitch', right: 'How high or low' },
    { left: 'Timbre', right: 'The quality of the sound' }
  ], explanation: 'The basic elements of music.' }),
  r => orderQ('Order these dynamics from quietest to loudest.',
    ['pianissimo', 'piano', 'mezzo-forte', 'forte', 'fortissimo'],
    'pp, p, mf, f, ff.'),
  () => writtenQ('Explain the difference between a major and a minor key in terms of how they sound.',
    'A major key is built on a third that is four semitones above the root and generally sounds bright or settled. A minor key lowers that third by a semitone, which most listeners hear as darker or sadder.',
    'Look for the lowered third and its effect on mood.')
];

export const WORLD_GENERATORS = {
  history, geography, civics, economics,
  programming, algorithms, data,
  notes, revision, exams,
  'art-history': artHistory, 'music-theory': musicTheory
};
