/* Health, business, psychology and philosophy item banks. */

import { int, pick, choice, blankQ, multiQ, matchQ, orderQ, writtenQ, mathQ, num, money } from './gen-core.js';

const C = (prompt, correct, distractors, explanation, hint) =>
  r => choice(r, { prompt, correct, distractors, explanation, hint });
const B = (prompt, answer, explanation, accept = []) =>
  () => ({ type: 'blank', prompt, answer, accept, explanation });

/* ------------------------------- NUTRITION ------------------------------- */
export const nutrition = [
  C('Which nutrient group is the body’s main source of quick energy?', 'Carbohydrates',
    ['Proteins', 'Fats', 'Vitamins'], 'Carbohydrates break down into glucose, the body’s readiest fuel.'),
  C('What is the main role of protein in the diet?', 'Growth and repair of tissue',
    ['Fast energy', 'Insulating the body', 'Preventing scurvy'],
    'Proteins supply the amino acids used to build and repair muscle and other tissue.'),
  C('Which vitamin does the body make from sunlight?', 'Vitamin D',
    ['Vitamin A', 'Vitamin C', 'Vitamin K'], 'Skin synthesises vitamin D from UVB light; it supports calcium absorption.'),
  C('Which of these is a good source of dietary fibre?', 'Wholegrain bread',
    ['Butter', 'White sugar', 'Chicken breast'], 'Fibre comes from plant cell walls — wholegrains, fruit, vegetables and pulses.'),
  C('Why does the body need iron?', 'To carry oxygen in the blood',
    ['To build bone', 'To digest fat', 'To regulate temperature'],
    'Iron is part of haemoglobin, the molecule that binds oxygen in red blood cells.'),
  C('A balanced meal should have the largest share of the plate given to…', 'Vegetables and starchy foods',
    ['Meat', 'Dairy', 'Oils and spreads'], 'Most national guidance puts vegetables plus starchy carbohydrates at roughly half to two thirds of the plate.'),
  B('Which mineral is most associated with strong bones and teeth?', 'calcium',
    'Calcium, with vitamin D to help absorb it, builds and maintains bone.'),
  B('Roughly how many millilitres are in a litre of water?', '1000',
    'One litre is 1,000 millilitres.', ['1,000']),
  r => {
    const per = int(r, 60, 250), n = int(r, 2, 5);
    return mathQ('A snack bar contains this many calories per bar. Work out the total.',
      `${per} × ${n} = ?`, per * n, { explanation: `${per} × ${n} = ${per * n} calories.` });
  },
  r => matchQ(r, { prompt: 'Match each nutrient to its main job.', pairs: [
    { left: 'Carbohydrate', right: 'Energy' }, { left: 'Protein', right: 'Growth and repair' },
    { left: 'Fat', right: 'Energy store and insulation' }, { left: 'Fibre', right: 'Healthy digestion' },
    { left: 'Water', right: 'Transport and temperature' }
  ], explanation: 'Each group does a distinct job; a balanced diet needs all of them.' }),
  r => multiQ(r, { prompt: 'Which are whole foods rather than ultra-processed? Choose all that apply.',
    correct: ['Oats', 'Lentils', 'Apples'], wrong: ['Instant noodles', 'Fizzy drinks'],
    explanation: 'Whole foods are close to how they grew; ultra-processed foods are industrially reformulated.' }),
  () => writtenQ('Explain why "low fat" on a label does not automatically mean a food is healthy.',
    'Fat is often replaced with sugar or refined starch to keep the product palatable, so a low-fat item can carry as many calories and more sugar than the original. The label describes one nutrient, not the whole food.',
    'Look for reformulation and the limits of a single-nutrient claim.')
];

/* --------------------------------- ANATOMY --------------------------------- */
export const anatomy = [
  C('Which organ pumps blood around the body?', 'The heart', ['The liver', 'The lungs', 'The kidneys'],
    'The heart is a muscular pump with four chambers.'),
  C('Where does gas exchange take place in the lungs?', 'The alveoli',
    ['The trachea', 'The bronchi', 'The diaphragm'], 'Alveoli are thin-walled air sacs surrounded by capillaries.'),
  C('What is the largest organ of the human body?', 'The skin',
    ['The liver', 'The brain', 'The intestine'], 'Skin is the body’s largest organ by surface area and mass.'),
  C('Which system includes the spinal cord?', 'The nervous system',
    ['The endocrine system', 'The lymphatic system', 'The muscular system'],
    'The brain and spinal cord form the central nervous system.'),
  C('What joins muscle to bone?', 'A tendon', ['A ligament', 'Cartilage', 'A nerve'],
    'Tendons attach muscle to bone; ligaments join bone to bone.'),
  C('Which type of joint is the elbow?', 'A hinge joint',
    ['A ball-and-socket joint', 'A pivot joint', 'A fixed joint'],
    'A hinge joint allows movement in one plane, like a door.'),
  B('How many chambers does the human heart have?', '4',
    'Two atria and two ventricles.', ['four']),
  B('What is the name of the large muscle below the lungs that drives breathing?', 'diaphragm',
    'The diaphragm contracts and flattens to draw air in.', ['the diaphragm']),
  r => matchQ(r, { prompt: 'Match each organ to its system.', pairs: [
    { left: 'Stomach', right: 'Digestive' }, { left: 'Lungs', right: 'Respiratory' },
    { left: 'Kidney', right: 'Urinary' }, { left: 'Brain', right: 'Nervous' },
    { left: 'Heart', right: 'Circulatory' }
  ], explanation: 'Organs group into systems by the job they share.' }),
  () => orderQ('Order the path of blood, starting as it leaves the heart for the body.',
    ['Left ventricle', 'Aorta', 'Body capillaries', 'Vena cava', 'Right atrium'],
    'Systemic circulation: out through the aorta, back through the vena cava.'),
  () => writtenQ('Explain why arteries have thicker walls than veins.',
    'Arteries carry blood directly from the heart at high pressure, so they need thick muscular and elastic walls to withstand and smooth out each surge. Veins carry blood at low pressure and rely on valves and surrounding muscle instead.',
    'Look for pressure as the reason, and ideally valves in veins.')
];

/* --------------------------------- FITNESS --------------------------------- */
export const fitness = [
  C('Which activity mainly develops cardiovascular endurance?', 'Long-distance running',
    ['Heavy weight lifting', 'Static stretching', 'Sprint starts'],
    'Sustained aerobic work trains the heart and lungs.'),
  C('What is the purpose of a warm-up?', 'Raise muscle temperature and prepare the body for effort',
    ['Burn the most calories', 'Build maximum strength', 'Replace training'],
    'A warm-up increases blood flow and joint mobility, reducing injury risk.'),
  C('Which component of fitness does a sit-and-reach test measure?', 'Flexibility',
    ['Strength', 'Speed', 'Power'], 'It measures the range of motion at the hips and lower back.'),
  C('What does "progressive overload" mean?', 'Gradually increasing demand so the body keeps adapting',
    ['Training to failure every session', 'Doing the same workout forever', 'Training twice a day'],
    'Adaptation stops if the stimulus never increases — but increasing it too fast causes injury.'),
  B('What does the abbreviation BPM stand for when measuring the heart?', 'beats per minute',
    'Resting BPM is a rough indicator of cardiovascular fitness.'),
  r => {
    const age = int(r, 12, 60);
    return mathQ('Estimate maximum heart rate using the common rule of thumb.',
      `220 − ${age} = ? bpm`, 220 - age,
      { explanation: `220 − ${age} = ${220 - age} bpm. It is an estimate, not a measurement.` });
  },
  r => matchQ(r, { prompt: 'Match each component of fitness to a test.', pairs: [
    { left: 'Endurance', right: 'Bleep test' }, { left: 'Flexibility', right: 'Sit and reach' },
    { left: 'Strength', right: 'One-rep max' }, { left: 'Speed', right: '30 m sprint' },
    { left: 'Balance', right: 'Stork stand' }
  ], explanation: 'Each component needs its own test.' }),
  r => multiQ(r, { prompt: 'Which help recovery after hard training? Choose all that apply.',
    correct: ['Sleep', 'Rehydration', 'Rest days'], wrong: ['Training harder the next day', 'Skipping meals'],
    explanation: 'Adaptation happens during recovery, not during the session itself.' }),
  () => writtenQ('Why can rest days make an athlete faster rather than slower?',
    'Training creates the stimulus, but the adaptation — repairing muscle, restocking fuel, strengthening tissue — happens while resting. Without recovery the damage accumulates faster than the repair, and performance falls.',
    'Look for adaptation occurring during recovery.')
];

/* ---------------------------- PERSONAL FINANCE ---------------------------- */
export const finance = [
  r => {
    const p = int(r, 4, 40) * 50, rate = pick(r, [2, 3, 4, 5]), y = int(r, 1, 4);
    return mathQ('Work out the simple interest.',
      `$${p} × ${rate}% × ${y} years = ?`, num(p * rate * y / 100),
      { hint: 'Simple interest is principal × rate × time.',
        explanation: `${p} × ${rate / 100} × ${y} = $${num(p * rate * y / 100)}.` });
  },
  r => {
    const income = int(r, 12, 60) * 100, saved = pick(r, [10, 15, 20, 25]);
    return mathQ('How much is saved each month?', `${saved}% of $${income} = ?`, num(income * saved / 100),
      { explanation: `${income} × ${saved / 100} = $${num(income * saved / 100)}.` });
  },
  C('What is a budget?', 'A plan for income and spending over a period',
    ['A type of savings account', 'A loan from a bank', 'A record of past taxes'],
    'A budget assigns every unit of income a job before it is spent.'),
  C('What does APR measure on a loan or credit card?', 'The yearly cost of borrowing, including fees',
    ['The monthly minimum payment', 'The credit limit', 'The lender’s profit margin'],
    'APR is the annual percentage rate — the yearly cost of the debt expressed as a percentage.'),
  C('Why does compound interest grow savings faster than simple interest?', 'Interest itself earns interest',
    ['The rate is always higher', 'It is paid daily', 'Banks add a bonus'],
    'Compound interest is calculated on the balance including previously earned interest.'),
  C('An emergency fund is best described as…', 'Accessible savings covering several months of essentials',
    ['A long-term stock investment', 'A credit card with a high limit', 'A pension'],
    'It must be liquid — the point is reaching it quickly without penalty.'),
  C('Which of these is an asset rather than a liability?', 'Money in a savings account',
    ['A car loan', 'An overdraft', 'Credit card debt'],
    'Assets are things you own that hold value; liabilities are what you owe.'),
  B('What is the term for the money you owe on a credit card at the end of a month?', 'balance',
    'Carrying a balance past the due date is what triggers interest.', ['the balance', 'outstanding balance']),
  r => matchQ(r, { prompt: 'Match each term to its meaning.', pairs: [
    { left: 'Principal', right: 'The amount originally borrowed or invested' },
    { left: 'Interest', right: 'The cost of borrowing, or the return on saving' },
    { left: 'Gross pay', right: 'Pay before deductions' },
    { left: 'Net pay', right: 'Pay after deductions' },
    { left: 'Deductible', right: 'What you pay before insurance contributes' }
  ], explanation: 'The vocabulary of everyday money.' }),
  r => multiQ(r, { prompt: 'Which are fixed monthly costs rather than variable? Choose all that apply.',
    correct: ['Rent', 'Insurance premium', 'Loan repayment'], wrong: ['Groceries', 'Fuel'],
    explanation: 'Fixed costs stay the same each month; variable costs move with use.' }),
  () => writtenQ('Explain why paying only the minimum on a credit card is expensive.',
    'The minimum barely covers the interest, so the balance falls very slowly while interest keeps accruing on what is left. A debt that could clear in months can instead run for years and cost more in interest than the original purchase.',
    'Look for interest accruing on a slowly falling balance.')
];

/* -------------------------------- ACCOUNTING -------------------------------- */
export const accounting = [
  C('What does the accounting equation state?', 'Assets = Liabilities + Equity',
    ['Assets = Revenue − Costs', 'Profit = Cash in − Cash out', 'Equity = Assets + Liabilities'],
    'Everything a business owns is financed either by debt or by owners’ equity.'),
  C('Revenue minus cost of goods sold gives…', 'Gross profit',
    ['Net profit', 'Operating cash flow', 'Equity'],
    'Gross profit is before operating expenses, interest and tax.'),
  C('Which statement shows a business’s position at a single moment?', 'The balance sheet',
    ['The income statement', 'The cash flow statement', 'The budget'],
    'A balance sheet is a snapshot; the income statement covers a period.'),
  C('What is depreciation?', 'Spreading an asset’s cost over its useful life',
    ['A fall in the market price of shares', 'Money lost to theft', 'A discount to customers'],
    'It matches the cost of a long-lived asset to the periods that benefit from it.'),
  C('A business is profitable but keeps running out of cash. The likely cause is…',
    'Customers paying slower than suppliers must be paid',
    ['Prices being too high', 'Too much equity', 'Paying tax'],
    'Profit is accrual-based; cash flow depends on timing. This is why the two statements both exist.'),
  r => {
    const rev = int(r, 20, 90) * 1000, cogs = int(r, 8, 15) * 1000;
    return mathQ('Calculate the gross profit.', `$${rev} − $${cogs} = ?`, rev - cogs,
      { explanation: `${rev} − ${cogs} = $${rev - cogs}.` });
  },
  r => {
    const rev = int(r, 20, 60) * 1000, profit = int(r, 2, 12) * 1000;
    return mathQ('Calculate the profit margin as a percentage, to one decimal place.',
      `(${profit} ÷ ${rev}) × 100 = ? %`, num(Math.round((profit / rev) * 1000) / 10),
      { explanation: `${profit} ÷ ${rev} = ${num(profit / rev)}, which is ${num(Math.round((profit / rev) * 1000) / 10)}%.` });
  },
  r => matchQ(r, { prompt: 'Match each item to where it appears.', pairs: [
    { left: 'Inventory', right: 'Balance sheet — asset' },
    { left: 'Bank loan', right: 'Balance sheet — liability' },
    { left: 'Sales', right: 'Income statement — revenue' },
    { left: 'Wages', right: 'Income statement — expense' }
  ], explanation: 'Position items sit on the balance sheet; performance items on the income statement.' }),
  () => writtenQ('Why do accountants insist that profit and cash are not the same thing?',
    'Profit records a sale when it is earned, not when the money arrives, and spreads big purchases over years. A business can therefore report profit while its bank balance falls — and it is the bank balance that pays wages.',
    'Look for accruals versus timing of cash.')
];

/* --------------------------------- MARKETING --------------------------------- */
export const marketing = [
  C('What do the "four Ps" of the marketing mix stand for?', 'Product, price, place, promotion',
    ['Plan, produce, publish, profit', 'People, process, product, price', 'Position, package, price, push'],
    'The classic mix: what you sell, for how much, where, and how you tell people.'),
  C('What is a target market?', 'The specific group a product is aimed at',
    ['Everyone who could afford it', 'The sales figure for the year', 'The largest competitor'],
    'Defining who the product is not for is what makes positioning possible.'),
  C('What does a USP describe?', 'What makes an offer different from its competitors',
    ['The unit shipping price', 'The upper sales projection', 'The usual selling period'],
    'Unique selling proposition — the reason to choose this over the alternatives.'),
  C('Market research that gathers numbers you can count is…', 'Quantitative',
    ['Qualitative', 'Secondary', 'Anecdotal'], 'Quantitative data measures how many; qualitative explores why.'),
  C('Which is an example of secondary research?', 'Reading an industry report someone else published',
    ['Running your own survey', 'Interviewing customers', 'A focus group'],
    'Primary research is collected by you; secondary already exists.'),
  B('What is the term for how a brand is perceived relative to competitors?', 'positioning',
    'Positioning is the space a brand occupies in the customer’s mind.'),
  r => matchQ(r, { prompt: 'Match each stage to the customer journey.', pairs: [
    { left: 'Awareness', right: 'Learns the product exists' },
    { left: 'Consideration', right: 'Compares the options' },
    { left: 'Purchase', right: 'Buys' },
    { left: 'Retention', right: 'Buys again' },
    { left: 'Advocacy', right: 'Recommends to others' }
  ], explanation: 'Each stage needs different messaging.' }),
  r => multiQ(r, { prompt: 'Which are ways to segment a market? Choose all that apply.',
    correct: ['By age', 'By location', 'By behaviour'], wrong: ['By share price', 'By office size'],
    explanation: 'Segments group customers by something that changes what they want.' }),
  () => writtenQ('A product aimed at "everyone" usually sells badly. Explain why.',
    'Messaging that must suit everyone cannot say anything specific, so it fails to feel relevant to anyone. Naming a narrow audience lets you use their language, choose the channels they actually use, and be their obvious first choice rather than a vague option.',
    'Look for relevance and message specificity.')
];

/* -------------------------------- PSYCHOLOGY -------------------------------- */
export const psychology = [
  C('What does short-term memory hold?', 'A small amount of information for a few seconds',
    ['Everything you have ever learned', 'Only visual images', 'Skills such as riding a bike'],
    'Its capacity is limited — famously around seven items, and less for unfamiliar material.'),
  C('Classical conditioning was demonstrated by…', 'Pavlov, with dogs and a bell',
    ['Skinner, with a puzzle box', 'Milgram, with obedience', 'Piaget, with children'],
    'Pavlov paired a neutral stimulus with food until the stimulus alone produced salivation.'),
  C('In an experiment, the variable the researcher changes is the…', 'Independent variable',
    ['Dependent variable', 'Control variable', 'Confounding variable'],
    'The dependent variable is what you measure in response.'),
  C('Confirmation bias is the tendency to…', 'Favour evidence that supports what you already believe',
    ['Remember the first thing you heard', 'Copy the majority', 'Blame the situation, not the person'],
    'It is why deliberately looking for disconfirming evidence is part of good method.'),
  C('What is a placebo?', 'An inert treatment given to test expectation effects',
    ['A very strong drug', 'The control group’s illness', 'A statistical test'],
    'Comparing against a placebo separates the drug’s effect from the effect of being treated.'),
  C('Which of Piaget’s stages involves abstract reasoning?', 'Formal operational',
    ['Sensorimotor', 'Preoperational', 'Concrete operational'],
    'Formal operational thinking, from roughly age 11, handles hypotheticals and abstractions.'),
  B('What is the term for a study that follows the same people over years?', 'longitudinal',
    'Longitudinal studies track change within individuals over time.', ['longitudinal study']),
  r => matchQ(r, { prompt: 'Match each term to its meaning.', pairs: [
    { left: 'Reinforcement', right: 'Consequence that makes a behaviour more likely' },
    { left: 'Extinction', right: 'A learned response fading when unrewarded' },
    { left: 'Sample', right: 'The people actually studied' },
    { left: 'Population', right: 'The wider group being generalised to' }
  ], explanation: 'Core vocabulary for learning and method.' }),
  () => writtenQ('Why does correlation between two behaviours not prove one causes the other?',
    'Two things can move together because a third factor drives both, or because the causation runs the other way. Only an experiment that manipulates one variable while controlling others can support a causal claim.',
    'Look for third variables and reverse causation.')
];

/* --------------------------------- PHILOSOPHY --------------------------------- */
export const philosophy = [
  C('What is a valid deductive argument?', 'One where the conclusion must follow if the premises are true',
    ['One with true premises', 'One most people accept', 'One with a persuasive conclusion'],
    'Validity is about structure. A valid argument with false premises can still reach a false conclusion.'),
  C('What is the difference between a valid and a sound argument?', 'A sound argument is valid AND has true premises',
    ['They mean the same thing', 'Sound arguments are shorter', 'Valid arguments must be about facts'],
    'Soundness adds the requirement that the premises are actually true.'),
  C('An ad hominem fallacy attacks…', 'The person making the argument rather than the argument',
    ['A straw version of the argument', 'The evidence', 'The conclusion only'],
    'Whether the speaker is likeable has no bearing on whether their reasoning holds.'),
  C('Utilitarianism judges an action by…', 'Its consequences for overall wellbeing',
    ['Whether it follows a rule', 'The character it expresses', 'Whether it was intended'],
    'Consequentialist: the right act is the one producing the best outcomes overall.'),
  C('Deontological ethics judges an action by…', 'Whether it conforms to a duty or rule',
    ['Its consequences', 'Its popularity', 'Its cost'],
    'Some acts are held to be wrong regardless of how well they turn out.'),
  C('What question does epistemology ask?', 'What can we know, and how?',
    ['What exists?', 'What is beautiful?', 'What is just?'],
    'Epistemology is the theory of knowledge; metaphysics asks what exists.'),
  B('What is the term for an argument that assumes what it sets out to prove?', 'circular reasoning',
    'Also called begging the question.', ['begging the question', 'circular argument']),
  r => matchQ(r, { prompt: 'Match each fallacy to its description.', pairs: [
    { left: 'Straw man', right: 'Attacking a weaker version of the argument' },
    { left: 'False dilemma', right: 'Presenting only two options when more exist' },
    { left: 'Slippery slope', right: 'Claiming one step must lead to an extreme' },
    { left: 'Appeal to authority', right: 'Treating who said it as proof' }
  ], explanation: 'Naming a fallacy is only useful if you can also say why the reasoning fails.' }),
  () => writtenQ('An argument can be valid and still lead you to a false conclusion. Explain how.',
    'Validity only guarantees that IF the premises are true the conclusion follows. If a premise is false the guarantee is empty: "All birds can fly; a penguin is a bird; therefore a penguin can fly" is perfectly valid and plainly wrong.',
    'Look for the distinction between validity and truth of premises, ideally with an example.')
];

export const LIFE_GENERATORS = {
  nutrition, anatomy, fitness, finance, accounting, marketing, psychology, philosophy
};
