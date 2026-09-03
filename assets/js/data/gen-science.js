/* Science item banks and generators.
   Knowledge subjects cannot be generated from arithmetic, so each topic has a
   bank of authored items; a worksheet draws a distinct seeded subset. Physics
   also gets true generators, since its questions are computational. */

import { int, pick, choice, mathQ, blankQ, multiQ, matchQ, orderQ, writtenQ, num } from './gen-core.js';

const C = (prompt, correct, distractors, explanation, hint) =>
  r => choice(r, { prompt, correct, distractors, explanation, hint });
const B = (prompt, answer, explanation, accept = []) =>
  () => ({ type: 'blank', prompt, answer, accept, explanation });

/* ------------------------------- BIOLOGY ------------------------------- */
export const biology = [
  C('Which organelle releases energy from glucose?', 'Mitochondria', ['Nucleus', 'Ribosome', 'Chloroplast'],
    'Mitochondria carry out aerobic respiration, releasing energy as ATP.'),
  C('Which structure is found in plant cells but not animal cells?', 'Cell wall', ['Nucleus', 'Cell membrane', 'Cytoplasm'],
    'Plant cells have a rigid cellulose cell wall outside the membrane.'),
  C('What is the basic unit of heredity?', 'The gene', ['The cell', 'The protein', 'The enzyme'],
    'A gene is a length of DNA coding for a characteristic.'),
  C('Which blood vessel carries blood away from the heart?', 'Artery', ['Vein', 'Capillary', 'Venule'],
    'Arteries carry blood away from the heart; veins return it.'),
  C('Which process do plants use to make glucose?', 'Photosynthesis', ['Respiration', 'Transpiration', 'Digestion'],
    'Photosynthesis uses light energy to convert carbon dioxide and water into glucose and oxygen.'),
  C('An animal that eats only plants is a…', 'Herbivore', ['Carnivore', 'Omnivore', 'Decomposer'],
    'Herbivores eat plants; carnivores eat meat; omnivores eat both.'),
  C('Which system transports oxygen around the human body?', 'The circulatory system',
    ['The nervous system', 'The digestive system', 'The skeletal system'],
    'Blood in the circulatory system carries oxygen from the lungs to the tissues.'),
  C('What is the role of enzymes in digestion?', 'They speed up the breakdown of large molecules',
    ['They absorb nutrients', 'They store energy', 'They kill bacteria'],
    'Enzymes are biological catalysts: they lower activation energy so reactions happen fast enough at body temperature.'),
  C('Natural selection acts on…', 'Inherited variation within a population',
    ['Habits learned in one lifetime', 'The strongest individual only', 'Random mutation alone'],
    'Individuals with advantageous inherited traits survive and reproduce more, so those alleles become more common.'),
  B('Which gas do plants take in from the air for photosynthesis?', 'carbon dioxide',
    'Plants take in carbon dioxide and release oxygen.', ['co2', 'carbon-dioxide']),
  B('What is the green pigment in plants that absorbs light called?', 'chlorophyll',
    'Chlorophyll sits inside chloroplasts and captures light energy.'),
  B('What name is given to an organism that breaks down dead material?', 'decomposer',
    'Decomposers such as fungi and bacteria recycle nutrients back into the soil.', ['decomposers', 'detritivore']),
  r => matchQ(r, { prompt: 'Match each organelle to its function.', pairs: [
    { left: 'Nucleus', right: 'Stores genetic information' },
    { left: 'Mitochondria', right: 'Releases energy from glucose' },
    { left: 'Cell membrane', right: 'Controls what enters and leaves' },
    { left: 'Chloroplast', right: 'Absorbs light for photosynthesis' },
    { left: 'Ribosome', right: 'Builds proteins' }
  ], explanation: 'Each organelle is specialised for one main job.' }),
  r => matchQ(r, { prompt: 'Match each animal group to an example.', pairs: [
    { left: 'Mammal', right: 'Dolphin' }, { left: 'Bird', right: 'Penguin' },
    { left: 'Reptile', right: 'Crocodile' }, { left: 'Amphibian', right: 'Frog' },
    { left: 'Fish', right: 'Salmon' }
  ], explanation: 'Vertebrates fall into five classes.' }),
  r => multiQ(r, { prompt: 'What do all living things need? Choose all that apply.',
    correct: ['Water', 'A source of energy', 'Gas exchange'],
    wrong: ['Sunlight directly', 'A backbone'],
    explanation: 'Every organism needs water, energy and gas exchange. Only plants need light directly, and most animals have no backbone.' }),
  () => orderQ('Put the levels of biological organisation in order, smallest first.',
    ['Organelle', 'Cell', 'Tissue', 'Organ', 'Organ system'],
    'Organelles make cells, which make tissues, which make organs, which make systems.'),
  () => orderQ('Put the stages of a butterfly life cycle in order.',
    ['Egg', 'Caterpillar', 'Chrysalis', 'Adult butterfly'],
    'Complete metamorphosis: egg, larva, pupa, adult.'),
  () => writtenQ('Explain why leaves are usually broad and flat.',
    'A broad flat leaf gives a large surface area, so it captures as much light as possible and gives carbon dioxide a big area to diffuse through, which lets photosynthesis run faster.',
    'Look for maximising light absorption and gas exchange.'),
  () => writtenQ('Explain why antibiotics do not work against a cold.',
    'Colds are caused by viruses, and antibiotics only affect bacteria. Viruses reproduce inside our own cells and lack the structures antibiotics target, so the drug has nothing to act on.',
    'Look for the bacteria/virus distinction.')
];

/* ------------------------------ CHEMISTRY ------------------------------ */
export const chemistry = [
  C('Balancing equations is required because of which law?', 'Conservation of mass',
    ['Conservation of energy', 'Boyle’s law', 'Avogadro’s law'],
    'Atoms are neither created nor destroyed, so each element must balance on both sides.'),
  C('What type of reaction is 2Na + Cl₂ → 2NaCl?', 'Synthesis',
    ['Decomposition', 'Single replacement', 'Combustion'],
    'Two reactants combine into one product, which is a synthesis reaction.'),
  C('Which particle has no electric charge?', 'Neutron', ['Proton', 'Electron', 'Ion'],
    'Protons are positive, electrons negative, neutrons neutral.'),
  C('What does the atomic number of an element tell you?', 'The number of protons',
    ['The number of neutrons', 'The total mass', 'The number of shells'],
    'The atomic number is the proton count, and it defines which element an atom is.'),
  C('A solution with pH 3 is…', 'Acidic', ['Alkaline', 'Neutral', 'A pure solvent'],
    'Below 7 is acidic, 7 is neutral, above 7 is alkaline.'),
  C('What holds atoms together in a covalent bond?', 'Shared pairs of electrons',
    ['Transferred electrons', 'Attraction between nuclei', 'Neutrons'],
    'Covalent bonds share electron pairs; ionic bonds transfer electrons.'),
  C('Which state of matter has a fixed volume but no fixed shape?', 'Liquid',
    ['Solid', 'Gas', 'Plasma'], 'Liquids keep their volume but take the shape of the container.'),
  B('Balance this equation: H₂ + O₂ → H₂O. What coefficient goes in front of H₂O?', '2',
    '2H₂ + O₂ → 2H₂O balances four hydrogen atoms and two oxygen atoms on each side.'),
  B('Balance this equation: CH₄ + ___ O₂ → CO₂ + 2H₂O', '2',
    'CH₄ + 2O₂ → CO₂ + 2H₂O gives four oxygen atoms on each side.'),
  B('What is the chemical symbol for sodium?', 'Na', 'Sodium takes its symbol from the Latin natrium.'),
  B('How many oxygen atoms are on the right-hand side of 2KClO₃ → 2KCl + 3O₂?', '6',
    '3 × O₂ is 6 oxygen atoms, matching the 6 in 2KClO₃.'),
  r => matchQ(r, { prompt: 'Match each formula to its name.', pairs: [
    { left: 'NaCl', right: 'Sodium chloride' }, { left: 'H₂SO₄', right: 'Sulfuric acid' },
    { left: 'CaCO₃', right: 'Calcium carbonate' }, { left: 'NH₃', right: 'Ammonia' },
    { left: 'CO₂', right: 'Carbon dioxide' }
  ], explanation: 'Formulas worth recognising on sight.' }),
  r => multiQ(r, { prompt: 'Which are signs that a chemical reaction has taken place? Choose all that apply.',
    correct: ['A gas is produced', 'A permanent colour change', 'A precipitate forms'],
    wrong: ['The substance changes shape', 'The substance is cut in half'],
    explanation: 'Changing shape or size is a physical change, not a chemical one.' }),
  () => orderQ('Order these states by increasing particle energy.',
    ['Solid', 'Liquid', 'Gas'], 'Particles gain energy and move more freely as a substance melts and then boils.'),
  () => writtenQ('Explain why you may change coefficients but never subscripts when balancing an equation.',
    'Coefficients change how many molecules there are, which is allowed. Changing a subscript changes the substance itself — H₂O and H₂O₂ are different compounds — so the equation would describe a different reaction.',
    'Look for: subscripts define identity, coefficients define quantity.')
];

/* -------------------------------- PHYSICS -------------------------------- */
export const physics = [
  (r) => {
    const d = int(r, 20, 900), t = int(r, 2, 30);
    return mathQ('Calculate the speed.', `speed = ${d} m ÷ ${t} s = ? m/s`,
      num(Math.round((d / t) * 100) / 100),
      { hint: 'Speed is distance divided by time.', explanation: `${d} ÷ ${t} = ${num(Math.round((d / t) * 100) / 100)} m/s.` });
  },
  (r) => {
    const m = int(r, 2, 60), a = int(r, 2, 12);
    return mathQ('Calculate the force.', `F = ${m} kg × ${a} m/s² = ? N`, m * a,
      { hint: 'F = ma.', explanation: `${m} × ${a} = ${m * a} N.` });
  },
  (r) => {
    const m = int(r, 10, 500), v = int(r, 2, 30);
    return mathQ('Calculate the density.', `density = ${m} g ÷ ${v} cm³ = ? g/cm³`,
      num(Math.round((m / v) * 100) / 100),
      { explanation: `${m} ÷ ${v} = ${num(Math.round((m / v) * 100) / 100)} g/cm³.` });
  },
  (r) => {
    const m = int(r, 2, 80);
    return mathQ('Calculate the weight on Earth, where g = 10 N/kg.', `W = ${m} kg × 10 = ? N`, m * 10,
      { explanation: `${m} × 10 = ${m * 10} N. Mass is in kilograms; weight is a force in newtons.` });
  },
  C('Which of these is a vector quantity?', 'Velocity', ['Speed', 'Mass', 'Temperature'],
    'A vector has both size and direction. Velocity does; speed is just the size.'),
  C('What happens to a moving object with no resultant force acting on it?', 'It continues at constant velocity',
    ['It slows to a stop', 'It accelerates', 'It changes direction'],
    'Newton’s first law: with no resultant force, velocity does not change.'),
  C('Which energy transfer happens in a working electric kettle?', 'Electrical to thermal',
    ['Thermal to electrical', 'Chemical to kinetic', 'Kinetic to electrical'],
    'The heating element converts electrical energy into thermal energy in the water.'),
  C('Sound cannot travel through…', 'A vacuum', ['Air', 'Water', 'Steel'],
    'Sound needs particles to vibrate, so it cannot cross a vacuum.'),
  B('What is the unit of electrical resistance?', 'ohm', 'Resistance is measured in ohms (Ω).', ['ohms', 'Ω']),
  B('State the equation linking voltage, current and resistance.', 'V = IR',
    'Voltage equals current multiplied by resistance.', ['V=IR', 'v = i r', 'voltage = current x resistance']),
  r => matchQ(r, { prompt: 'Match each quantity to its unit.', pairs: [
    { left: 'Force', right: 'Newton' }, { left: 'Energy', right: 'Joule' },
    { left: 'Power', right: 'Watt' }, { left: 'Current', right: 'Ampere' },
    { left: 'Frequency', right: 'Hertz' }
  ], explanation: 'Standard SI units.' }),
  r => multiQ(r, { prompt: 'Which are forms of energy? Choose all that apply.',
    correct: ['Kinetic', 'Thermal', 'Chemical'], wrong: ['Velocity', 'Density'],
    explanation: 'Velocity and density are properties, not stores of energy.' }),
  () => writtenQ('A ball is dropped and speeds up as it falls. Explain this using forces.',
    'Gravity pulls the ball down with a constant weight, and at first air resistance is small, so there is a resultant downward force. A resultant force causes acceleration, so the ball speeds up. As it gets faster air resistance grows, reducing the resultant force.',
    'Look for a resultant force producing acceleration.')
];

/* ------------------------------ EARTH SCIENCE ------------------------------ */
export const earth = [
  C('Which rock type forms from cooled magma?', 'Igneous', ['Sedimentary', 'Metamorphic', 'Fossil'],
    'Igneous rock crystallises from molten rock as it cools.'),
  C('What drives the movement of tectonic plates?', 'Convection currents in the mantle',
    ['The Earth’s rotation', 'Ocean tides', 'The Moon’s gravity'],
    'Heat from the core drives convection in the mantle, dragging the plates above.'),
  C('Which layer of the Earth is liquid?', 'The outer core', ['The crust', 'The inner core', 'The mantle'],
    'The outer core is liquid iron and nickel; the inner core is solid despite being hotter, because of pressure.'),
  C('What causes the seasons?', 'The tilt of the Earth’s axis',
    ['The Earth’s distance from the Sun', 'Sunspot cycles', 'Ocean currents'],
    'The 23.5° axial tilt changes how directly sunlight strikes each hemisphere through the year.'),
  C('Which process turns water vapour back into liquid?', 'Condensation',
    ['Evaporation', 'Precipitation', 'Transpiration'],
    'Cooling vapour condenses into droplets, forming clouds.'),
  B('What is the name for the boundary where two tectonic plates meet?', 'plate boundary',
    'Plate boundaries are where most earthquakes and volcanoes occur.', ['fault', 'plate margin']),
  B('What instrument measures the magnitude of an earthquake?', 'seismometer',
    'A seismometer records ground motion; magnitude is calculated from the trace.', ['seismograph']),
  r => orderQ('Put the stages of the water cycle in order, starting from the ocean.',
    ['Evaporation', 'Condensation', 'Precipitation', 'Collection'],
    'Water evaporates, condenses into cloud, falls as precipitation and collects again.'),
  r => matchQ(r, { prompt: 'Match each rock to its type.', pairs: [
    { left: 'Granite', right: 'Igneous' }, { left: 'Limestone', right: 'Sedimentary' },
    { left: 'Marble', right: 'Metamorphic' }, { left: 'Sandstone', right: 'Sedimentary' },
    { left: 'Basalt', right: 'Igneous' }
  ], explanation: 'Rocks are classified by how they formed.' }),
  () => writtenQ('Explain how a fossil forms in sedimentary rock.',
    'An organism is buried quickly by sediment before it decays. Over time more layers pile on, pressure compacts the sediment into rock, and minerals gradually replace the hard parts, leaving a fossil in the rock.',
    'Look for rapid burial, compaction and mineral replacement.')
];

/* -------------------------------- ASTRONOMY -------------------------------- */
export const astronomy = [
  C('Which planet is closest to the Sun?', 'Mercury', ['Venus', 'Earth', 'Mars'],
    'Mercury orbits closest, at about 58 million km.'),
  C('What is a light year a measure of?', 'Distance', ['Time', 'Brightness', 'Mass'],
    'A light year is the distance light travels in one year, about 9.5 trillion km.'),
  C('What force keeps planets in orbit around the Sun?', 'Gravity',
    ['Magnetism', 'Friction', 'The solar wind'],
    'The Sun’s gravity continuously pulls each planet away from a straight line, curving it into an orbit.'),
  C('Why does the Moon appear to change shape through the month?', 'We see different amounts of its lit half',
    ['The Earth’s shadow covers it', 'It physically changes shape', 'Clouds block part of it'],
    'Half the Moon is always lit; the phase is how much of that lit half faces us.'),
  C('What is the Sun mostly made of?', 'Hydrogen and helium',
    ['Oxygen and carbon', 'Iron and nickel', 'Rock and dust'],
    'About three quarters hydrogen and a quarter helium by mass.'),
  B('How long does light from the Sun take to reach Earth, to the nearest minute?', '8',
    'About 8 minutes and 20 seconds.', ['8 minutes', 'eight']),
  r => orderQ('Order these by distance from the Sun, closest first.',
    ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter'], 'The inner rocky planets come before the gas giants.'),
  r => matchQ(r, { prompt: 'Match each object to its description.', pairs: [
    { left: 'Star', right: 'Fuses hydrogen in its core' },
    { left: 'Planet', right: 'Orbits a star and has cleared its orbit' },
    { left: 'Moon', right: 'Orbits a planet' },
    { left: 'Comet', right: 'Icy body that grows a tail near the Sun' },
    { left: 'Galaxy', right: 'Billions of stars bound by gravity' }
  ], explanation: 'Scale increases from moon to galaxy.' }),
  () => writtenQ('Explain why astronauts appear weightless on the Space Station.',
    'They are not beyond gravity — gravity is nearly as strong there as on the ground. They appear weightless because the station and everyone in it are in free fall around the Earth together, so nothing pushes back on them.',
    'Look for continuous free fall rather than "no gravity".')
];

export const SCIENCE_GENERATORS = { biology, chemistry, physics, earth, astronomy };
