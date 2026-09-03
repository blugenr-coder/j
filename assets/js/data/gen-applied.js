/* Engineering, environment, media, world religions, sociology and the extra
   topics added to existing subjects. */

import { int, pick, choice, blankQ, multiQ, matchQ, orderQ, writtenQ, mathQ, num } from './gen-core.js';

const C = (prompt, correct, distractors, explanation, hint) =>
  r => choice(r, { prompt, correct, distractors, explanation, hint });
const B = (prompt, answer, explanation, accept = []) =>
  () => ({ type: 'blank', prompt, answer, accept, explanation });

/* ------------------------------- ENGINEERING ------------------------------- */
export const design = [
  C('What is the first stage of the design process?', 'Identifying the problem and the user',
    ['Building a prototype', 'Choosing materials', 'Costing the product'],
    'Everything downstream depends on having the right problem.'),
  C('Why build a prototype before manufacturing?', 'To test assumptions cheaply before they get expensive',
    ['To satisfy regulations', 'To finalise the price', 'To train the sales team'],
    'A prototype turns an argument about what will work into an observation.'),
  C('What does "tolerance" mean in engineering drawing?', 'The allowable variation in a dimension',
    ['The strength of a material', 'The weight limit', 'The safety factor'],
    'Nothing is made exactly to size; tolerance states how much variation still works.'),
  C('An iterative design process means…', 'Repeatedly testing and refining',
    ['Designing once, carefully', 'Copying an existing product', 'Building the cheapest version'],
    'Each loop feeds what was learned back into the next version.'),
  B('What is the term for the maximum load a structure can carry before failing?', 'breaking point',
    'Designers work well below it, applying a safety factor.', ['failure load', 'ultimate load']),
  r => {
    const l = int(r, 2, 20), w = int(r, 2, 12);
    return mathQ('Calculate the area of a rectangular sheet of material.', `${l} m × ${w} m = ?`, l * w,
      { explanation: `${l} × ${w} = ${l * w} m².` });
  },
  r => orderQ('Put the design process in order.',
    ['Identify the problem', 'Research and specify', 'Generate ideas', 'Prototype', 'Test and evaluate', 'Refine'],
    'The loop returns to refinement rather than ending.'),
  r => matchQ(r, { prompt: 'Match each material to a property it is chosen for.', pairs: [
    { left: 'Steel', right: 'High tensile strength' }, { left: 'Aluminium', right: 'Light for its strength' },
    { left: 'Rubber', right: 'Elastic and grippy' }, { left: 'Glass', right: 'Transparent and rigid' },
    { left: 'Copper', right: 'Conducts electricity well' }
  ], explanation: 'Material choice follows from the property the job needs.' }),
  () => writtenQ('Why do engineers apply a safety factor rather than designing exactly to the expected load?',
    'Real loads vary, materials have flaws, and manufacturing is imprecise. Designing to the expected load means roughly half of cases exceed it. A safety factor absorbs that variation so failure remains very unlikely rather than a coin flip.',
    'Look for variation and uncertainty, not just caution.')
];

export const electronics = [
  C('What does a resistor do in a circuit?', 'Limits the flow of current',
    ['Stores charge', 'Amplifies voltage', 'Converts AC to DC'],
    'A resistor drops voltage and limits current.'),
  C('Which component stores charge?', 'A capacitor', ['A resistor', 'A diode', 'A switch'],
    'A capacitor stores energy in an electric field between plates.'),
  C('A diode allows current to flow…', 'In one direction only',
    ['In both directions', 'Only above 10 V', 'Only in AC circuits'],
    'That one-way behaviour is what makes rectification possible.'),
  C('In a series circuit, what is the same at every point?', 'The current',
    ['The voltage', 'The resistance', 'The power'],
    'Current is common in series; voltage divides across the components.'),
  r => {
    const i = int(r, 1, 9), res = int(r, 2, 60);
    return mathQ('Use Ohm’s law to find the voltage.', `V = ${i} A × ${res} Ω = ?`, i * res,
      { explanation: `${i} × ${res} = ${i * res} V.` });
  },
  r => {
    const v = int(r, 3, 24), res = pick(r, [2, 3, 4, 6, 8, 12]);
    return mathQ('Use Ohm’s law to find the current.', `I = ${v} V ÷ ${res} Ω = ?`, num(Math.round((v / res) * 100) / 100),
      { explanation: `${v} ÷ ${res} = ${num(Math.round((v / res) * 100) / 100)} A.` });
  },
  B('What is the unit of electrical resistance?', 'ohm', 'Resistance is measured in ohms.', ['ohms']),
  r => matchQ(r, { prompt: 'Match each component to its symbol description.', pairs: [
    { left: 'Resistor', right: 'Rectangle in the line' },
    { left: 'Capacitor', right: 'Two parallel plates' },
    { left: 'Battery', right: 'Long and short lines' },
    { left: 'LED', right: 'Triangle with arrows' }
  ], explanation: 'Circuit symbols are a shared language across every schematic.' }),
  () => writtenQ('Why is a fuse deliberately the weakest part of a circuit?',
    'A fuse is designed to fail first and break the circuit before excess current can overheat wiring or damage components. Making it the weakest link means faults destroy a cheap replaceable part rather than the appliance or the building.',
    'Look for controlled failure protecting the rest.')
];

export const robotics = [
  C('What does a sensor do in a robot?', 'Converts a physical quantity into a signal',
    ['Moves a joint', 'Stores the program', 'Supplies power'],
    'Sensors are the robot’s input; actuators are its output.'),
  C('What is an actuator?', 'A component that produces movement',
    ['A component that measures distance', 'A processor', 'A battery'],
    'Motors and servos are actuators.'),
  C('In a feedback control loop, what is compared?', 'The measured value against the target value',
    ['Two sensors', 'Power in against power out', 'Speed against time'],
    'The difference — the error — is what the controller acts on.'),
  C('Why do autonomous robots need more than one type of sensor?', 'Each sensor fails in different conditions',
    ['To use more power', 'To look more advanced', 'To increase weight'],
    'Cameras struggle in darkness, ultrasonics with soft surfaces; combining them covers the gaps.'),
  B('What is the term for the sequence of instructions a robot follows?', 'program',
    'Written once and executed repeatedly.', ['algorithm', 'code']),
  r => orderQ('Order the stages of a control loop.',
    ['Sense the environment', 'Compare with the target', 'Decide on an action', 'Actuate', 'Sense again'],
    'The loop is continuous — that is what makes it feedback.'),
  r => multiQ(r, { prompt: 'Which are sensors rather than actuators? Choose all that apply.',
    correct: ['Ultrasonic distance sensor', 'Light sensor', 'Temperature probe'],
    wrong: ['Servo motor', 'Solenoid'],
    explanation: 'Sensors measure; actuators act.' }),
  () => writtenQ('Explain why a robot that only moves forward for a fixed time is fragile.',
    'It assumes the world matches the assumption: same battery charge, same friction, no obstacles. Any drift accumulates with nothing to correct it. Sensing the actual position and correcting makes the behaviour robust rather than lucky.',
    'Look for open-loop versus closed-loop control.')
];

/* ------------------------------- ENVIRONMENT ------------------------------- */
export const climate = [
  C('Which gas is the largest human-caused contributor to the greenhouse effect?', 'Carbon dioxide',
    ['Oxygen', 'Nitrogen', 'Argon'], 'CO₂ from burning fossil fuels is the dominant human contribution.'),
  C('What does the greenhouse effect do?', 'Traps outgoing heat in the atmosphere',
    ['Blocks incoming sunlight', 'Cools the upper atmosphere only', 'Destroys ozone'],
    'Greenhouse gases are transparent to incoming light but absorb outgoing infrared.'),
  C('Which is a renewable energy source?', 'Solar', ['Coal', 'Natural gas', 'Oil'],
    'Solar energy is replenished continuously; fossil fuels are finite.'),
  C('What is a carbon footprint?', 'The total greenhouse gas emissions caused by an activity',
    ['The area of forest cleared', 'The weight of waste produced', 'The amount of water used'],
    'Usually expressed as CO₂ equivalent.'),
  C('Why does melting sea ice accelerate warming?', 'Dark water absorbs more heat than bright ice reflects',
    ['It releases trapped CO₂', 'It raises sea level', 'It cools the ocean'],
    'The ice-albedo feedback: less reflective surface, more absorbed energy, more melting.'),
  C('Which action typically cuts a household’s emissions most?', 'Reducing car and air travel',
    ['Switching off standby lights', 'Using paper bags', 'Recycling more'],
    'Transport and home heating dominate a typical household footprint; small habits matter less than the big two.'),
  B('What is the term for the variety of life in an ecosystem?', 'biodiversity',
    'Higher biodiversity generally means a more resilient ecosystem.'),
  r => matchQ(r, { prompt: 'Match each energy source to its type.', pairs: [
    { left: 'Wind', right: 'Renewable' }, { left: 'Coal', right: 'Non-renewable' },
    { left: 'Hydroelectric', right: 'Renewable' }, { left: 'Natural gas', right: 'Non-renewable' },
    { left: 'Geothermal', right: 'Renewable' }
  ], explanation: 'Renewable sources replenish on a human timescale.' }),
  r => multiQ(r, { prompt: 'Which are consequences of deforestation? Choose all that apply.',
    correct: ['Habitat loss', 'Soil erosion', 'Less carbon absorbed'], wrong: ['More rainfall locally', 'Cooler ground temperature'],
    explanation: 'Removing forest usually reduces local rainfall and raises ground temperature.' }),
  () => writtenQ('Explain why planting trees alone will not solve climate change.',
    'Trees absorb carbon slowly and store it only while they stand, and there is not enough suitable land to offset current emissions. Planting helps, but the emissions themselves have to fall — offsetting a growing output is arithmetic that does not close.',
    'Look for scale and the difference between offsetting and reducing.')
];

export const conservation = [
  C('What is an endangered species?', 'One at serious risk of extinction in the wild',
    ['One that only lives in zoos', 'One recently discovered', 'One that migrates'],
    'Classification depends on population size, range and rate of decline.'),
  C('What is a keystone species?', 'One whose removal would change the whole ecosystem disproportionately',
    ['The largest animal present', 'The most numerous species', 'A recently introduced species'],
    'Sea otters and wolves are classic examples: small populations, outsized effect.'),
  C('Why are invasive species a problem?', 'They outcompete natives that never evolved defences against them',
    ['They are always larger', 'They cannot reproduce', 'They only eat plants'],
    'Without co-evolved predators or competitors, an introduced species can expand unchecked.'),
  C('What does "sustainable" mean when applied to a resource?', 'Used no faster than it can be replenished',
    ['Never used at all', 'Cheap to extract', 'Recyclable'],
    'Sustainability is about rate, not abstinence.'),
  B('What is the term for the natural home of an organism?', 'habitat',
    'Habitat loss is the leading driver of species decline.'),
  r => orderQ('Order these levels of ecological organisation, smallest first.',
    ['Organism', 'Population', 'Community', 'Ecosystem', 'Biome'],
    'Each level contains the one before it.'),
  r => multiQ(r, { prompt: 'Which are conservation strategies? Choose all that apply.',
    correct: ['Protected reserves', 'Captive breeding', 'Habitat restoration'],
    wrong: ['Introducing new predators at random', 'Draining wetlands'],
    explanation: 'Introducing predators without study is how invasive-species disasters start.' }),
  () => writtenQ('Why is protecting a habitat usually more effective than protecting a single species?',
    'A species depends on everything around it — its food, its shelter, its pollinators. Protecting the habitat protects that whole web at once, including species nobody has studied, whereas saving one animal in isolation leaves it with nowhere to return to.',
    'Look for interdependence and the breadth of habitat protection.')
];

/* --------------------------------- MEDIA --------------------------------- */
export const media = [
  C('What is media bias?', 'A consistent slant in what is covered and how',
    ['Any factual error', 'Publishing on a schedule', 'Using photographs'],
    'Bias shows in selection and framing as much as in explicit opinion.'),
  C('What is the difference between news and opinion writing?', 'News reports events; opinion argues a position',
    ['News is longer', 'Opinion is always wrong', 'News has no author'],
    'Reputable outlets label the difference; the reader still has to notice.'),
  C('Why check more than one source on a breaking story?', 'Early reports are frequently wrong or incomplete',
    ['To read more words', 'Because sources are all identical', 'To find the shortest version'],
    'Corroboration is the cheapest defence against being confidently misinformed.'),
  C('What is a primary source in journalism?', 'A direct witness, participant or original document',
    ['A summary article', 'Another outlet’s report', 'A press review'],
    'Everything else is at least one step removed.'),
  C('In film, a low-angle shot of a character usually suggests…', 'Power or dominance',
    ['Weakness', 'Confusion', 'Distance'], 'The camera looks up at them, so the audience does too.'),
  C('What does an establishing shot do?', 'Shows where the scene takes place',
    ['Ends a scene', 'Shows a character’s face closely', 'Reveals the villain'],
    'It orients the viewer before the action narrows in.'),
  B('What is the term for the arrangement of everything visible within the frame?', 'mise-en-scène',
    'Set, costume, lighting, blocking — everything placed in the shot.', ['mise en scene', 'composition']),
  r => matchQ(r, { prompt: 'Match each shot to its typical effect.', pairs: [
    { left: 'Close-up', right: 'Emotion and detail' },
    { left: 'Wide shot', right: 'Context and scale' },
    { left: 'Over-the-shoulder', right: 'Conversation and perspective' },
    { left: 'Point of view', right: 'Puts the viewer in the character' }
  ], explanation: 'Shot choice is an argument about where to look.' }),
  () => writtenQ('Two outlets report the same protest with very different headlines. What should a careful reader do?',
    'Read both, separate the facts they agree on from the framing they do not, and notice what each leaves out — crowd size, who spoke, what was damaged. Then look for a primary source such as footage or an official statement before deciding what happened.',
    'Look for separating fact from framing, and going to primary sources.')
];

/* ------------------------------ WORLD RELIGIONS ------------------------------ */
export const religions = [
  C('Which of these is a monotheistic religion?', 'Judaism', ['Ancient Greek religion', 'Shinto', 'Ancient Roman religion'],
    'Monotheism is belief in a single God; Judaism, Christianity and Islam share it.'),
  C('What is the central text of Islam called?', 'The Qur’an', ['The Torah', 'The Vedas', 'The Tripitaka'],
    'Muslims regard the Qur’an as revelation received by the Prophet Muhammad.'),
  C('Which religion observes the festival of Diwali?', 'Hinduism', ['Islam', 'Judaism', 'Sikhism only'],
    'Diwali, the festival of lights, is observed by Hindus and also by Sikhs and Jains.'),
  C('What is the Buddhist term for the end of suffering?', 'Nirvana', ['Karma', 'Dharma', 'Samsara'],
    'Nirvana is release from the cycle of rebirth and craving.'),
  C('What is a synagogue?', 'A Jewish place of worship and study',
    ['A Christian cathedral', 'A Hindu temple', 'A Buddhist monastery'],
    'Synagogue means "assembly"; it is a place of prayer, study and community.'),
  B('What is the Jewish day of rest called?', 'Shabbat',
    'Observed from Friday evening to Saturday evening.', ['sabbath', 'shabbos']),
  r => matchQ(r, { prompt: 'Match each religion to a central text.', pairs: [
    { left: 'Christianity', right: 'The Bible' }, { left: 'Islam', right: 'The Qur’an' },
    { left: 'Judaism', right: 'The Torah' }, { left: 'Hinduism', right: 'The Vedas' },
    { left: 'Sikhism', right: 'The Guru Granth Sahib' }
  ], explanation: 'Scripture is a starting point for understanding a tradition, not the whole of it.' }),
  () => writtenQ('Why do scholars study what believers actually practise, not only what texts say?',
    'A tradition as lived can differ considerably from its texts: practice varies by region, era and community, and much of it is carried by custom rather than scripture. Studying only the text describes an ideal that may match nobody’s actual life.',
    'Look for the gap between prescribed and lived religion.')
];

/* -------------------------------- SOCIOLOGY -------------------------------- */
export const sociology = [
  C('What is socialisation?', 'The process of learning a society’s norms and values',
    ['Meeting new people', 'Moving to a city', 'Joining a political party'],
    'Primary socialisation happens in the family; secondary in school, work and media.'),
  C('What is a social norm?', 'An unwritten expectation about how to behave',
    ['A written law', 'A personal habit', 'A government policy'],
    'Norms are enforced by approval and disapproval rather than by courts.'),
  C('What does "social mobility" measure?', 'Movement between social or economic positions',
    ['Migration between countries', 'How often people move house', 'Commuting distance'],
    'Usually compared across generations.'),
  C('A representative sample is one that…', 'Reflects the wider population’s characteristics',
    ['Is very large', 'Volunteers to take part', 'Is easy to reach'],
    'Convenience samples are quick and frequently misleading.'),
  B('What is the term for a group a person identifies with and measures themselves against?', 'reference group',
    'Reference groups shape aspirations and self-assessment.', ['peer group']),
  r => matchQ(r, { prompt: 'Match each agent of socialisation to its role.', pairs: [
    { left: 'Family', right: 'Earliest norms and language' },
    { left: 'School', right: 'Formal knowledge and routine' },
    { left: 'Peers', right: 'Belonging and identity' },
    { left: 'Media', right: 'Wider models and expectations' }
  ], explanation: 'Each shapes a different slice of behaviour.' }),
  () => writtenQ('Why might two researchers studying the same community reach different conclusions?',
    'They may ask different questions, recruit different people, or interpret the same behaviour through different theoretical lenses. The researcher’s own position also affects what participants are willing to say, so the account is shaped by who is asking.',
    'Look for method, framing and researcher effects.')
];

/* --------------------------- EXTRA MATHS TOPICS --------------------------- */
export const measurement = [
  r => { const cm = int(r, 2, 400); return mathQ('Convert to metres.', `${cm} cm = ? m`, num(cm / 100),
    { explanation: `${cm} ÷ 100 = ${num(cm / 100)} m.` }); },
  r => { const kg = int(r, 1, 40); return mathQ('Convert to grams.', `${kg} kg = ? g`, kg * 1000,
    { explanation: `${kg} × 1000 = ${kg * 1000} g.` }); },
  r => { const ml = int(r, 250, 9000); return mathQ('Convert to litres.', `${ml} ml = ? L`, num(ml / 1000),
    { explanation: `${ml} ÷ 1000 = ${num(ml / 1000)} L.` }); },
  r => { const h = int(r, 1, 9), m = int(r, 5, 55);
    return mathQ('Convert this time to minutes.', `${h} h ${m} min = ? min`, h * 60 + m,
      { explanation: `${h} × 60 = ${h * 60}, plus ${m} = ${h * 60 + m} minutes.` }); },
  r => { const km = int(r, 2, 40), t = pick(r, [2, 4]);
    return mathQ('Work out the average speed.', `${km} km ÷ ${t} h = ? km/h`, num(km / t),
      { explanation: `${km} ÷ ${t} = ${num(km / t)} km/h.` }); },
  C('Which unit would you use to measure the mass of a person?', 'Kilograms',
    ['Millimetres', 'Litres', 'Seconds'], 'Mass is measured in kilograms; length in metres; volume in litres.'),
  r => matchQ(r, { prompt: 'Match each quantity to a sensible unit.', pairs: [
    { left: 'Length of a room', right: 'Metres' }, { left: 'Mass of an apple', right: 'Grams' },
    { left: 'Volume of a bottle', right: 'Millilitres' }, { left: 'Distance between cities', right: 'Kilometres' }
  ], explanation: 'Choosing the right unit keeps the numbers readable.' }),
  () => writtenQ('Why do scientists agree on standard units such as the metre and the kilogram?',
    'Shared units let results be compared and repeated anywhere. Without them a measurement only means something to the person who made it, and engineering across borders becomes guesswork — mismatched units have destroyed spacecraft.',
    'Look for comparability and reproducibility.')
];

export const discrete = [
  r => { const n = int(r, 3, 7);
    const f = Array.from({length: n}, (_, i) => i + 1).reduce((a, b) => a * b, 1);
    return mathQ(`In how many orders can ${n} different books be arranged on a shelf?`, `${n}! = ?`, f,
      { hint: 'This is a factorial.', explanation: `${n}! = ${f}.` }); },
  r => { const n = int(r, 4, 8), k = 2;
    const c = (n * (n - 1)) / 2;
    return mathQ(`How many ways can 2 people be chosen from ${n}?`, `C(${n}, 2) = ?`, c,
      { explanation: `${n} × ${n - 1} ÷ 2 = ${c}.` }); },
  r => { const a = int(r, 2, 9), b = int(r, 2, 9);
    return mathQ(`A menu has ${a} mains and ${b} desserts. How many two-course combinations are there?`,
      `${a} × ${b} = ?`, a * b, { explanation: `Multiply the choices: ${a} × ${b} = ${a * b}.` }); },
  C('In set notation, what does A ∪ B mean?', 'Everything in A or B or both',
    ['Only what is in both', 'Everything not in A', 'A minus B'],
    'Union is "or"; intersection (∩) is "and".'),
  C('What is a prime number?', 'A number with exactly two distinct factors',
    ['Any odd number', 'A number divisible by 3', 'A number ending in 1, 3, 7 or 9'],
    '1 and itself — which is why 1 is not prime, having only one factor.'),
  B('What is the greatest common divisor of 24 and 36?', '12',
    '24 = 2³×3 and 36 = 2²×3², so the GCD is 2²×3 = 12.'),
  r => multiQ(r, { prompt: 'Which of these numbers are prime? Choose all that apply.',
    correct: ['17', '23', '31'], wrong: ['21', '27'],
    explanation: '21 = 3×7 and 27 = 3³, so neither is prime.' }),
  () => writtenQ('Explain the difference between a permutation and a combination.',
    'A permutation counts arrangements, where order matters — first, second and third place in a race. A combination counts selections, where it does not — which three people made the team. Every combination corresponds to several permutations.',
    'Look for order mattering or not, ideally with an example.')
];

/* ------------------------- EXTRA CS AND ARTS TOPICS ------------------------- */
export const web = [
  C('What does HTML provide on a web page?', 'Structure and meaning',
    ['Colour and layout', 'Interactivity', 'Server storage'],
    'HTML marks up content; CSS styles it; JavaScript makes it behave.'),
  C('What is the purpose of a CSS class?', 'To apply the same styling rules to many elements',
    ['To store data', 'To create a link', 'To validate a form'],
    'Classes let one rule serve every element that carries the name.'),
  C('Which HTML element should wrap the main content of a page?', '<main>',
    ['<div>', '<section>', '<article>'],
    'Semantic elements tell assistive technology what the region is for.'),
  C('What does "responsive design" mean?', 'The layout adapts to the size of the screen',
    ['The site loads quickly', 'The server responds fast', 'It works without JavaScript'],
    'Flexible units, flexible grids and media queries do the work.'),
  C('Why does every image need an alt attribute?', 'So people using a screen reader know what it shows',
    ['To make it load faster', 'To improve its resolution', 'To centre it'],
    'Decorative images take an empty alt so they are skipped.'),
  B('What does URL stand for?', 'uniform resource locator',
    'The address of a resource on the web.', ['universal resource locator']),
  r => matchQ(r, { prompt: 'Match each language to its job.', pairs: [
    { left: 'HTML', right: 'Structure' }, { left: 'CSS', right: 'Presentation' },
    { left: 'JavaScript', right: 'Behaviour' }, { left: 'SQL', right: 'Querying data' }
  ], explanation: 'Separating the three keeps a page maintainable.' }),
  () => writtenQ('Why is it a problem if a site only works when JavaScript loads successfully?',
    'Scripts fail — flaky networks, blocked domains, an error in one file. If the content itself depends on the script, the page becomes blank rather than degraded. Serving meaningful HTML first and enhancing it keeps the site usable when something breaks.',
    'Look for graceful degradation and failure modes.')
];

export const cyber = [
  C('What makes a password strong?', 'Length and unpredictability',
    ['Frequent changes', 'Using a symbol at the end', 'Being memorable'],
    'A long passphrase beats a short complex one, and reuse is the real danger.'),
  C('What is phishing?', 'Tricking someone into revealing credentials or installing malware',
    ['Overloading a server', 'Guessing a password by brute force', 'Intercepting Wi-Fi'],
    'It attacks the person rather than the system, which is why it works so well.'),
  C('What does two-factor authentication add?', 'A second, different proof of identity',
    ['A longer password', 'Faster login', 'Encrypted storage'],
    'Something you know plus something you have — a stolen password alone stops being enough.'),
  C('What does encryption do?', 'Makes data unreadable without the key',
    ['Compresses data', 'Deletes data securely', 'Backs data up'],
    'Encryption protects confidentiality; it is not a backup.'),
  C('Why is reusing one password across sites dangerous?', 'One breach exposes every account at once',
    ['It is slower to type', 'Sites forbid it', 'It uses more storage'],
    'Attackers take credentials leaked from one site and try them everywhere else.'),
  B('What is the term for software designed to cause harm?', 'malware',
    'An umbrella term covering viruses, ransomware, spyware and more.'),
  r => multiQ(r, { prompt: 'Which are signs of a likely phishing email? Choose all that apply.',
    correct: ['Urgent threat about your account', 'A link whose address does not match the sender', 'Unexpected attachment'],
    wrong: ['Correct spelling', 'Sent during working hours'],
    explanation: 'Good spelling proves nothing; urgency and mismatched links are the real tells.' }),
  () => writtenQ('Why do security experts say humans are the weakest link, and what follows from that?',
    'Most breaches start with someone being persuaded rather than a system being broken, because deceiving a person is cheaper than defeating encryption. It follows that training, and designing systems that limit the damage one fooled person can do, matter more than adding cryptographic strength.',
    'Look for social engineering plus limiting blast radius.')
];

export const drama = [
  C('What is a soliloquy?', 'A character speaking their thoughts aloud, alone on stage',
    ['A conversation between two characters', 'A song in a musical', 'A stage direction'],
    'It gives the audience access to a character’s private reasoning.'),
  C('What does "blocking" mean in rehearsal?', 'Planning where actors move and stand',
    ['Forgetting lines', 'Building the set', 'Cutting a scene'],
    'Blocking shapes what the audience sees and who holds focus.'),
  C('What is the purpose of a dress rehearsal?', 'To run the whole show under performance conditions',
    ['To choose costumes', 'To rehearse one scene closely', 'To sell tickets'],
    'It is the last chance to find problems that only appear at full speed.'),
  C('In a script, what are stage directions for?', 'Describing action, setting and delivery',
    ['The lines characters speak', 'The interval timing', 'The cast list'],
    'They are instructions to the company, not spoken aloud.'),
  B('What is the term for the imaginary wall between actors and audience?', 'fourth wall',
    'Breaking it means addressing the audience directly.', ['the fourth wall']),
  r => matchQ(r, { prompt: 'Match each role to its responsibility.', pairs: [
    { left: 'Director', right: 'Overall interpretation and staging' },
    { left: 'Stage manager', right: 'Running the show and calling cues' },
    { left: 'Designer', right: 'Set, costume and visual world' },
    { left: 'Playwright', right: 'The script' }
  ], explanation: 'A production is a division of labour.' }),
  () => writtenQ('Why do directors rehearse a scene in different ways before choosing one?',
    'The first reading is only one interpretation, usually the most obvious. Trying alternatives — different pacing, different status between characters, different blocking — reveals what the scene can carry, and the chosen version is then a decision rather than a default.',
    'Look for exploring alternatives before committing.')
];

export const APPLIED_GENERATORS = {
  design, electronics, robotics,
  climate, conservation,
  media, religions, sociology,
  measurement, discrete,
  web, cyber, drama
};
