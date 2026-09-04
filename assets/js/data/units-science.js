/* Science micro-units.
   Each entry is one unit of a normal science scheme of work, with the item
   bank that unit is actually assessed on. Level ranges follow where the unit
   sits in a typical sequence: cells before genetics, atoms before bonding,
   forces before energy — and nothing is offered below the level at which the
   idea is normally introduced. */

export const SCIENCE_UNITS = {
  /* ================================ BIOLOGY ================================ */
  biology: [
    {
      name: 'Cell Structure and Function', from: 'Grade 6', to: 'Grade 12',
      figures: ['animal-cell', 'plant-cell'],
      facts: [
        ['nucleus', 'the organelle that holds the cell’s DNA and controls its activities'],
        ['mitochondrion', 'the organelle where aerobic respiration releases energy'],
        ['ribosome', 'the site where proteins are assembled from amino acids'],
        ['cell membrane', 'the partially permeable layer controlling what enters and leaves'],
        ['cytoplasm', 'the jelly-like fluid where most chemical reactions happen'],
        ['chloroplast', 'the organelle containing chlorophyll, where photosynthesis occurs'],
        ['cell wall', 'the rigid outer layer of plant cells, made of cellulose'],
        ['vacuole', 'the sap-filled space that keeps a plant cell firm'],
        ['prokaryote', 'a cell with no nucleus, such as a bacterium'],
        ['eukaryote', 'a cell with a true nucleus and membrane-bound organelles'],
        ['diffusion', 'the net movement of particles from high to low concentration'],
        ['osmosis', 'the movement of water across a partially permeable membrane'],
        ['active transport', 'movement against a concentration gradient, using energy'],
        ['organelle', 'a specialised structure inside a cell with its own job'],
        ['stem cell', 'an undifferentiated cell that can become other cell types'],
        ['differentiation', 'the process by which a cell becomes specialised']
      ],
      truths: [
        'Plant cells have a cell wall, chloroplasts and a permanent vacuole; animal cells do not.',
        'Diffusion and osmosis are passive: they need no energy from the cell.',
        'Bacteria are prokaryotes, so their DNA is not enclosed in a nucleus.',
        'Active transport requires energy released by respiration.'
      ],
      myths: [
        'Animal cells have a cell wall made of cellulose.',
        'Osmosis moves water from a dilute to a concentrated solution using energy from the mitochondria.',
        'The nucleus is where respiration releases energy.',
        'Only plant cells contain mitochondria.'
      ]
    },
    {
      name: 'Photosynthesis', from: 'Grade 6', to: 'Grade 12',
      figures: ['leaf', 'plant-cell'],
      facts: [
        ['photosynthesis', 'the process making glucose from carbon dioxide and water using light'],
        ['chlorophyll', 'the green pigment that absorbs light energy'],
        ['glucose', 'the sugar produced by photosynthesis'],
        ['stomata', 'pores in a leaf that let gases in and out'],
        ['palisade layer', 'the packed upper leaf cells where most photosynthesis happens'],
        ['limiting factor', 'the condition in shortest supply, which caps the rate'],
        ['xylem', 'the tissue carrying water up from the roots'],
        ['phloem', 'the tissue carrying dissolved sugars around the plant'],
        ['starch', 'the storage form of glucose, tested for with iodine'],
        ['transpiration', 'the loss of water vapour from a leaf’s surface'],
        ['root hair cell', 'a cell with a large surface area for absorbing water'],
        ['guard cell', 'the cell pair that opens and closes a stoma'],
        ['chloroplast', 'the organelle in which photosynthesis takes place'],
        ['light intensity', 'a factor that increases the rate until another factor limits it']
      ],
      truths: [
        'Photosynthesis uses carbon dioxide and water and releases oxygen.',
        'Increasing light intensity raises the rate only until some other factor becomes limiting.',
        'Glucose made in a leaf is stored as starch, which is insoluble.',
        'Plants respire all the time, including while photosynthesising.'
      ],
      myths: [
        'Plants take in oxygen and give out carbon dioxide during photosynthesis.',
        'Plants stop respiring during the day because they are photosynthesising.',
        'Chlorophyll is the gas produced by a leaf in sunlight.',
        'A plant gets most of its mass from the soil it grows in.'
      ]
    },
    {
      name: 'Respiration and Energy', from: 'Grade 7', to: 'College',
      figures: ['animal-cell'],
      facts: [
        ['aerobic respiration', 'the release of energy from glucose using oxygen'],
        ['anaerobic respiration', 'the release of energy from glucose without oxygen'],
        ['lactic acid', 'the product of anaerobic respiration in human muscle'],
        ['oxygen debt', 'the extra oxygen needed after exercise to clear lactic acid'],
        ['fermentation', 'anaerobic respiration in yeast, producing ethanol and carbon dioxide'],
        ['metabolism', 'the sum of all chemical reactions in an organism'],
        ['ATP', 'the molecule cells use to carry energy for immediate use'],
        ['enzyme', 'a protein that speeds up a reaction without being used up'],
        ['substrate', 'the molecule an enzyme acts on'],
        ['denature', 'to change an enzyme’s shape so it no longer works'],
        ['optimum temperature', 'the temperature at which an enzyme works fastest'],
        ['glycogen', 'the storage carbohydrate of the liver and muscles'],
        ['breathing rate', 'a measure that rises during exercise to supply more oxygen'],
        ['mitochondrion', 'the organelle where aerobic respiration takes place']
      ],
      truths: [
        'Aerobic respiration releases far more energy per glucose molecule than anaerobic respiration.',
        'Enzymes are denatured, not killed, by high temperatures.',
        'Respiration happens in every living cell, all the time.',
        'Yeast produces ethanol and carbon dioxide when it respires anaerobically.'
      ],
      myths: [
        'Respiration and breathing are two words for the same process.',
        'Anaerobic respiration in muscle produces carbon dioxide and water.',
        'Enzymes are used up in the reactions they speed up.',
        'Only animals respire; plants only photosynthesise.'
      ]
    },
    {
      name: 'Genetics and Inheritance', from: 'Grade 8', to: 'College',
      figures: ['dna'],
      facts: [
        ['gene', 'a section of DNA coding for one protein'],
        ['allele', 'one of the different versions of a gene'],
        ['chromosome', 'a long coiled molecule of DNA carrying many genes'],
        ['dominant', 'an allele that shows in the phenotype even with one copy'],
        ['recessive', 'an allele that shows only when two copies are present'],
        ['genotype', 'the alleles an organism carries'],
        ['phenotype', 'the characteristics an organism actually shows'],
        ['homozygous', 'having two identical alleles for a gene'],
        ['heterozygous', 'having two different alleles for a gene'],
        ['mitosis', 'cell division producing two genetically identical cells'],
        ['meiosis', 'cell division producing four genetically different gametes'],
        ['gamete', 'a sex cell carrying half the normal number of chromosomes'],
        ['Punnett square', 'a grid used to predict the offspring of a cross'],
        ['mutation', 'a random change in the sequence of DNA bases'],
        ['DNA', 'the double-helix molecule that stores genetic information'],
        ['carrier', 'someone who has a recessive allele but does not show the condition']
      ],
      truths: [
        'A human body cell has 46 chromosomes; a gamete has 23.',
        'Two carriers of a recessive condition have a one-in-four chance of an affected child.',
        'Mitosis produces identical cells; meiosis produces genetically varied gametes.',
        'Most mutations have no effect on the phenotype at all.'
      ],
      myths: [
        'Dominant alleles are always the most common allele in a population.',
        'Meiosis produces two identical cells with the full number of chromosomes.',
        'A carrier of a recessive condition always shows mild symptoms.',
        'Every mutation causes a disease.'
      ]
    },
    {
      name: 'Evolution and Natural Selection', from: 'Grade 8', to: 'College',
      facts: [
        ['natural selection', 'the survival and reproduction of the better-adapted individuals'],
        ['variation', 'the differences between individuals of the same species'],
        ['adaptation', 'a feature that helps an organism survive in its environment'],
        ['species', 'a group whose members can breed to give fertile offspring'],
        ['extinction', 'the permanent loss of every member of a species'],
        ['fossil', 'the preserved remains or traces of an ancient organism'],
        ['selective breeding', 'choosing which organisms reproduce to develop a wanted feature'],
        ['antibiotic resistance', 'an example of natural selection acting on bacteria'],
        ['common ancestor', 'a species from which two later species both descend'],
        ['speciation', 'the formation of a new species from an existing one'],
        ['Charles Darwin', 'the naturalist who set out the theory of natural selection in 1859'],
        ['Alfred Russel Wallace', 'the naturalist who reached the same theory independently'],
        ['genetic drift', 'a change in allele frequency due to chance alone'],
        ['isolation', 'the separation of populations that can lead to speciation']
      ],
      truths: [
        'Individuals do not evolve; populations do, over generations.',
        'Antibiotic resistance spreads because resistant bacteria survive and reproduce.',
        'Natural selection acts on variation that already exists in a population.',
        'Fossils give evidence of evolution but the fossil record is incomplete.'
      ],
      myths: [
        'Organisms develop the features they need during their own lifetime and pass them on.',
        'Evolution has a goal, and species are trying to become more advanced.',
        'Bacteria become resistant because individual bacteria decide to change.',
        'Humans evolved from chimpanzees that are alive today.'
      ]
    },
    {
      name: 'The Human Digestive System', from: 'Grade 6', to: 'Grade 12',
      figures: ['digestive'],
      facts: [
        ['oesophagus', 'the muscular tube carrying food from the mouth to the stomach'],
        ['peristalsis', 'the wave of muscle contraction that pushes food along the gut'],
        ['stomach', 'the organ where acid and protease begin protein digestion'],
        ['small intestine', 'the organ where most digestion and absorption take place'],
        ['large intestine', 'the organ where water is absorbed from the remaining material'],
        ['villus', 'a finger-like fold that increases the surface area for absorption'],
        ['bile', 'the liquid made in the liver that emulsifies fats'],
        ['amylase', 'the enzyme that breaks starch into sugars'],
        ['protease', 'the enzyme that breaks proteins into amino acids'],
        ['lipase', 'the enzyme that breaks fats into fatty acids and glycerol'],
        ['pancreas', 'the organ that releases digestive enzymes into the small intestine'],
        ['liver', 'the organ that produces bile and processes absorbed nutrients'],
        ['absorption', 'the passage of digested food molecules into the blood'],
        ['fibre', 'indigestible plant material that keeps food moving through the gut']
      ],
      truths: [
        'Bile emulsifies fat, increasing its surface area for lipase to work on.',
        'Most absorption of digested food happens in the small intestine.',
        'Digestion breaks large insoluble molecules into small soluble ones.',
        'Stomach acid provides the low pH at which protease works best.'
      ],
      myths: [
        'Bile is an enzyme that chemically digests fat into fatty acids.',
        'Most nutrients are absorbed in the stomach.',
        'The large intestine is where most digestion happens.',
        'Fibre is digested and absorbed to provide energy.'
      ]
    },
    {
      name: 'Circulation and the Heart', from: 'Grade 7', to: 'College',
      figures: ['heart'],
      facts: [
        ['atrium', 'an upper heart chamber that receives blood'],
        ['ventricle', 'a lower heart chamber that pumps blood out'],
        ['artery', 'a thick-walled vessel carrying blood away from the heart'],
        ['vein', 'a vessel with valves carrying blood back to the heart'],
        ['capillary', 'a one-cell-thick vessel where exchange with tissues happens'],
        ['aorta', 'the main artery carrying oxygenated blood to the body'],
        ['vena cava', 'the main vein returning deoxygenated blood to the heart'],
        ['pulmonary artery', 'the vessel carrying deoxygenated blood to the lungs'],
        ['red blood cell', 'a cell with no nucleus, packed with haemoglobin'],
        ['haemoglobin', 'the protein that binds oxygen in the blood'],
        ['plasma', 'the liquid part of blood that carries dissolved substances'],
        ['platelet', 'a cell fragment involved in clotting'],
        ['double circulation', 'a system in which blood passes through the heart twice per circuit'],
        ['valve', 'a structure that stops blood flowing backwards']
      ],
      truths: [
        'The left ventricle has the thickest wall because it pumps blood to the whole body.',
        'The pulmonary artery is an artery even though it carries deoxygenated blood.',
        'Capillaries are one cell thick so diffusion distances are short.',
        'Humans have a double circulation: one loop to the lungs, one to the body.'
      ],
      myths: [
        'All arteries carry oxygenated blood and all veins carry deoxygenated blood.',
        'The right ventricle has the thickest muscle wall.',
        'Red blood cells contain a nucleus packed with haemoglobin.',
        'Blood passes through the heart once per complete circuit of the body.'
      ]
    },
    {
      name: 'Nervous System and Response', from: 'Grade 8', to: 'College',
      figures: ['neuron'],
      facts: [
        ['neurone', 'a nerve cell that carries electrical impulses'],
        ['synapse', 'the gap between two neurones, crossed by chemicals'],
        ['reflex arc', 'the pathway of a response that does not involve the conscious brain'],
        ['receptor', 'a cell that detects a stimulus'],
        ['effector', 'a muscle or gland that carries out a response'],
        ['stimulus', 'a change in the environment that is detected'],
        ['central nervous system', 'the brain and spinal cord'],
        ['sensory neurone', 'the neurone carrying impulses from receptor to CNS'],
        ['motor neurone', 'the neurone carrying impulses from CNS to effector'],
        ['relay neurone', 'the neurone connecting sensory and motor neurones in the CNS'],
        ['homeostasis', 'keeping internal conditions constant despite external change'],
        ['hormone', 'a chemical messenger carried in the blood'],
        ['insulin', 'the hormone that lowers blood glucose concentration'],
        ['negative feedback', 'a control mechanism that reverses a change from the norm']
      ],
      truths: [
        'Reflex actions are fast because they do not involve conscious thought.',
        'Impulses cross a synapse as chemicals, not as an electrical current.',
        'Nervous responses are fast and short-lived; hormonal responses are slower and longer-lasting.',
        'Insulin lowers blood glucose by making cells take glucose up.'
      ],
      myths: [
        'Electrical impulses jump directly across a synapse from one neurone to the next.',
        'Reflex actions are controlled by conscious decisions in the brain.',
        'Hormones travel along nerves to reach their target organs.',
        'Insulin raises blood glucose after a meal.'
      ]
    },
    {
      name: 'Ecosystems and Food Chains', from: 'Grade 6', to: 'Grade 12',
      facts: [
        ['producer', 'an organism that makes its own food by photosynthesis'],
        ['consumer', 'an organism that eats other organisms'],
        ['decomposer', 'an organism that breaks down dead material and returns nutrients'],
        ['herbivore', 'an animal that eats only plants'],
        ['carnivore', 'an animal that eats only other animals'],
        ['food web', 'a set of interlinked food chains in a habitat'],
        ['trophic level', 'a feeding position in a food chain'],
        ['biodiversity', 'the variety of living species in an area'],
        ['habitat', 'the place where an organism lives'],
        ['population', 'all the individuals of one species in an area'],
        ['community', 'all the populations of different species in an area'],
        ['competition', 'the struggle between organisms for the same limited resource'],
        ['predator', 'an animal that hunts and eats other animals'],
        ['quadrat', 'a square frame used to sample the abundance of organisms'],
        ['carbon cycle', 'the movement of carbon between the air, living things and the ground'],
        ['nitrogen cycle', 'the movement of nitrogen through soil, plants, animals and the air']
      ],
      truths: [
        'Arrows in a food chain point in the direction that energy is transferred.',
        'Roughly ten per cent of the energy at one trophic level passes to the next.',
        'Removing one species from a food web can affect species it never eats.',
        'Decomposers return nutrients from dead organisms to the soil.'
      ],
      myths: [
        'Arrows in a food chain point from the predator to what it eats.',
        'Energy is recycled around an ecosystem in the same way that nutrients are.',
        'Almost all the energy at one trophic level is passed on to the next.',
        'A habitat and a population mean the same thing.'
      ]
    },
    {
      name: 'Microbes, Disease and Immunity', from: 'Grade 7', to: 'College',
      facts: [
        ['pathogen', 'a microorganism that causes disease'],
        ['bacterium', 'a single-celled prokaryote, some of which cause disease'],
        ['virus', 'a non-living particle that reproduces only inside a host cell'],
        ['antibiotic', 'a medicine that kills bacteria but has no effect on viruses'],
        ['antibody', 'a protein made by white blood cells that binds a specific pathogen'],
        ['antigen', 'a marker on a pathogen’s surface that the immune system recognises'],
        ['vaccine', 'a preparation of dead or weakened pathogen that triggers immunity'],
        ['white blood cell', 'a blood cell that engulfs pathogens or makes antibodies'],
        ['phagocytosis', 'the engulfing and digestion of a pathogen by a white blood cell'],
        ['immunity', 'the ability to respond rapidly to a pathogen met before'],
        ['herd immunity', 'protection of a whole population when enough of it is vaccinated'],
        ['sterile technique', 'working in a way that stops unwanted microbes contaminating a culture'],
        ['communicable disease', 'a disease that can be passed from one person to another'],
        ['antiseptic', 'a chemical that kills microbes on living skin']
      ],
      truths: [
        'Antibiotics kill bacteria and have no effect on viruses.',
        'A vaccine works by causing the body to make memory cells without causing the disease.',
        'Antibodies are specific: each one fits one antigen.',
        'Viruses can only reproduce inside a living host cell.'
      ],
      myths: [
        'Antibiotics are the correct treatment for a cold or flu.',
        'A vaccine contains antibodies that are injected directly into the blood.',
        'One antibody will work against any pathogen.',
        'Viruses reproduce by dividing in two like bacteria do.'
      ]
    },
    {
      name: 'Plants and Transport', from: 'Grade 7', to: 'Grade 12',
      figures: ['flower', 'leaf'],
      facts: [
        ['xylem', 'dead hollow tubes carrying water and minerals upwards'],
        ['phloem', 'living tubes carrying dissolved sugars in both directions'],
        ['translocation', 'the movement of sugars through the phloem'],
        ['transpiration stream', 'the flow of water from roots to leaves and out through stomata'],
        ['root hair cell', 'a cell adapted with a large surface area to absorb water'],
        ['stomata', 'the pores through which water vapour and gases leave a leaf'],
        ['guard cell', 'a cell that changes shape to open or close a stoma'],
        ['turgor', 'the firmness of a plant cell when its vacuole is full of water'],
        ['plasmolysis', 'the pulling away of the membrane when a plant cell loses water'],
        ['wilting', 'the drooping that follows when water loss exceeds uptake'],
        ['auxin', 'the plant hormone controlling growth towards light'],
        ['phototropism', 'growth of a shoot in response to the direction of light'],
        ['geotropism', 'growth in response to gravity'],
        ['pollination', 'the transfer of pollen from anther to stigma']
      ],
      truths: [
        'Transpiration is faster in warm, dry, windy conditions.',
        'Xylem vessels are made of dead cells with no end walls.',
        'Auxin collects on the shaded side of a shoot, making it bend towards light.',
        'Most water lost by a plant leaves through the stomata on the lower leaf surface.'
      ],
      myths: [
        'Phloem carries water and xylem carries sugars.',
        'Transpiration is slowest on a hot, windy day.',
        'Auxin gathers on the sunny side of a shoot.',
        'Stomata are found only on the upper surface of a leaf.'
      ]
    }
  ],

  /* =============================== CHEMISTRY =============================== */
  chemistry: [
    {
      name: 'Atomic Structure', from: 'Grade 7', to: 'College',
      figures: ['atom-carbon', 'atom-sodium', 'atom-oxygen'],
      facts: [
        ['proton', 'a positive particle in the nucleus, relative mass 1'],
        ['neutron', 'a neutral particle in the nucleus, relative mass 1'],
        ['electron', 'a negative particle in shells around the nucleus, almost no mass'],
        ['atomic number', 'the number of protons in an atom'],
        ['mass number', 'the total number of protons and neutrons'],
        ['isotope', 'an atom of the same element with a different number of neutrons'],
        ['ion', 'an atom that has gained or lost electrons and so carries a charge'],
        ['electron shell', 'an energy level holding a limited number of electrons'],
        ['nucleus', 'the tiny dense centre of an atom containing almost all its mass'],
        ['element', 'a substance made of only one kind of atom'],
        ['relative atomic mass', 'the average mass of an element’s atoms allowing for isotopes'],
        ['electron configuration', 'the arrangement of electrons in an atom’s shells'],
        ['plum pudding model', 'the pre-1911 model of a positive sphere with embedded electrons'],
        ['nuclear model', 'the model of a small positive nucleus surrounded by electrons']
      ],
      truths: [
        'Atoms have no overall charge because protons and electrons are equal in number.',
        'Isotopes of an element have identical chemical properties.',
        'Almost all of an atom’s mass is concentrated in its nucleus.',
        'The first electron shell holds a maximum of two electrons.'
      ],
      myths: [
        'Isotopes of an element differ in their number of protons.',
        'Electrons make up most of an atom’s mass.',
        'An ion is an atom that has gained or lost protons.',
        'The atomic number tells you the number of neutrons.'
      ]
    },
    {
      name: 'The Periodic Table', from: 'Grade 7', to: 'College',
      facts: [
        ['group', 'a vertical column of the periodic table'],
        ['period', 'a horizontal row of the periodic table'],
        ['alkali metal', 'a Group 1 element that reacts vigorously with water'],
        ['halogen', 'a Group 7 element that forms salts with metals'],
        ['noble gas', 'a Group 0 element with a full outer shell and almost no reactivity'],
        ['transition metal', 'a middle-block metal, often coloured and catalytic'],
        ['Dmitri Mendeleev', 'the chemist who left gaps for undiscovered elements'],
        ['metalloid', 'an element with properties between a metal and a non-metal'],
        ['valence electrons', 'the electrons in the outer shell, which set the group'],
        ['reactivity series', 'metals ordered by how readily they react'],
        ['sodium', 'the Group 1 metal stored under oil, symbol Na'],
        ['chlorine', 'the green Group 7 gas, symbol Cl'],
        ['helium', 'the Group 0 gas with two outer electrons, symbol He'],
        ['iron', 'the transition metal with symbol Fe']
      ],
      truths: [
        'Elements in the same group have the same number of outer electrons.',
        'Reactivity increases down Group 1 and decreases down Group 7.',
        'Noble gases are unreactive because their outer shell is full.',
        'Mendeleev ordered elements by atomic mass and left gaps for undiscovered ones.'
      ],
      myths: [
        'Elements in the same period have the same number of outer electrons.',
        'Group 7 elements get more reactive as you go down the group.',
        'Noble gases are unreactive because they have no electrons.',
        'The modern table is ordered by atomic mass rather than atomic number.'
      ]
    },
    {
      name: 'Bonding and Structure', from: 'Grade 8', to: 'College',
      figures: ['ionic-bond', 'covalent-bond'],
      facts: [
        ['ionic bond', 'the electrostatic attraction between oppositely charged ions'],
        ['covalent bond', 'a shared pair of electrons between two atoms'],
        ['metallic bond', 'attraction between positive ions and a sea of delocalised electrons'],
        ['giant ionic lattice', 'a regular repeating structure of alternating ions'],
        ['simple molecular', 'a structure of small molecules with weak forces between them'],
        ['giant covalent', 'a structure in which every atom is covalently bonded throughout'],
        ['diamond', 'a giant covalent form of carbon with four bonds per atom'],
        ['graphite', 'a giant covalent form of carbon with layers and free electrons'],
        ['delocalised electron', 'an electron free to move through a structure'],
        ['intermolecular force', 'the weak attraction between separate molecules'],
        ['alloy', 'a mixture of a metal with another element, harder than the pure metal'],
        ['polymer', 'a long molecule made of many repeating units'],
        ['electrostatic attraction', 'the force holding oppositely charged particles together'],
        ['malleable', 'able to be hammered into shape without breaking']
      ],
      truths: [
        'Ionic compounds conduct electricity when molten or dissolved, but not as solids.',
        'Graphite conducts electricity because each carbon has a delocalised electron.',
        'Simple molecular substances have low melting points because the forces between molecules are weak.',
        'Alloys are harder than pure metals because different-sized atoms disrupt the layers.'
      ],
      myths: [
        'Ionic compounds conduct electricity as solids because they contain ions.',
        'Melting a simple molecular substance breaks its covalent bonds.',
        'Diamond conducts electricity because it is a form of carbon.',
        'Metals are malleable because their bonds are weak.'
      ]
    },
    {
      name: 'Chemical Reactions and Equations', from: 'Grade 8', to: 'College',
      facts: [
        ['reactant', 'a substance present at the start of a reaction'],
        ['product', 'a substance formed by a reaction'],
        ['conservation of mass', 'the principle that total mass is unchanged by a reaction'],
        ['balanced equation', 'an equation with equal numbers of each atom on both sides'],
        ['combustion', 'a reaction with oxygen that releases heat'],
        ['thermal decomposition', 'the breaking down of a compound by heating'],
        ['displacement', 'a reaction in which a more reactive metal takes the place of a less reactive one'],
        ['neutralisation', 'the reaction of an acid with a base to give a salt and water'],
        ['oxidation', 'the loss of electrons, or gain of oxygen'],
        ['reduction', 'the gain of electrons, or loss of oxygen'],
        ['catalyst', 'a substance that speeds up a reaction without being used up'],
        ['exothermic', 'a reaction that transfers energy to the surroundings'],
        ['endothermic', 'a reaction that takes in energy from the surroundings'],
        ['precipitate', 'an insoluble solid formed when two solutions react']
      ],
      truths: [
        'Mass is conserved: the total mass of products equals the total mass of reactants.',
        'A catalyst lowers the activation energy without being used up.',
        'Combustion and neutralisation are both exothermic.',
        'Balancing an equation changes the big numbers in front, never the small subscripts.'
      ],
      myths: [
        'Balancing an equation means changing the small numbers inside a formula.',
        'A catalyst is used up gradually as the reaction proceeds.',
        'Mass is lost in any reaction that produces a gas.',
        'All reactions that take in heat are called exothermic.'
      ]
    },
    {
      name: 'Acids, Bases and Salts', from: 'Grade 8', to: 'College',
      facts: [
        ['acid', 'a substance that releases hydrogen ions in solution'],
        ['alkali', 'a soluble base that releases hydroxide ions in solution'],
        ['pH scale', 'a scale from 0 to 14 measuring how acidic or alkaline a solution is'],
        ['neutral', 'a solution with a pH of exactly 7'],
        ['indicator', 'a substance that changes colour with pH'],
        ['universal indicator', 'a mixture giving a range of colours across the pH scale'],
        ['litmus', 'an indicator that is red in acid and blue in alkali'],
        ['salt', 'the compound formed when an acid’s hydrogen is replaced by a metal'],
        ['titration', 'a technique for finding the exact volume needed to neutralise'],
        ['hydrochloric acid', 'the acid that produces chloride salts'],
        ['sulfuric acid', 'the acid that produces sulfate salts'],
        ['nitric acid', 'the acid that produces nitrate salts'],
        ['base', 'a substance that neutralises an acid'],
        ['strong acid', 'an acid that fully ionises in solution']
      ],
      truths: [
        'Acid plus metal carbonate gives a salt, water and carbon dioxide.',
        'A pH of 3 is ten times more acidic than a pH of 4.',
        'Sulfuric acid produces sulfate salts; nitric acid produces nitrates.',
        'A strong acid is one that fully ionises, which is different from a concentrated one.'
      ],
      myths: [
        'A concentrated acid and a strong acid mean the same thing.',
        'All acids have a pH of 0.',
        'Acid plus metal carbonate produces hydrogen gas.',
        'Litmus turns blue in acid and red in alkali.'
      ]
    },
    {
      name: 'States of Matter and Separation', from: 'Grade 7', to: 'Grade 12',
      facts: [
        ['sublimation', 'the change directly from solid to gas'],
        ['condensation', 'the change from gas to liquid'],
        ['evaporation', 'the escape of particles from the surface of a liquid'],
        ['melting point', 'the temperature at which a solid becomes a liquid'],
        ['boiling point', 'the temperature at which a liquid boils throughout'],
        ['filtration', 'separating an insoluble solid from a liquid'],
        ['crystallisation', 'obtaining a solid from a solution by evaporating the solvent'],
        ['simple distillation', 'separating a solvent from a solution by boiling and condensing'],
        ['fractional distillation', 'separating liquids with different boiling points'],
        ['chromatography', 'separating a mixture by how far its parts travel on paper'],
        ['solute', 'the substance that dissolves in a solvent'],
        ['solvent', 'the liquid in which a solute dissolves'],
        ['pure substance', 'a substance that melts and boils at a single fixed temperature'],
        ['formulation', 'a mixture designed with each component in a measured quantity']
      ],
      truths: [
        'A pure substance melts at one fixed temperature; a mixture melts over a range.',
        'Evaporation happens at any temperature; boiling happens at one.',
        'Fractional distillation separates liquids by their different boiling points.',
        'Changing state does not change the particles themselves, only their arrangement and energy.'
      ],
      myths: [
        'Melting a substance changes the particles into a different substance.',
        'Boiling and evaporation are exactly the same process.',
        'Filtration separates a dissolved salt from water.',
        'A mixture always melts at one sharp temperature.'
      ]
    },
    {
      name: 'Moles and Calculations', from: 'Grade 10', to: 'College',
      facts: [
        ['mole', 'the amount of substance containing 6.02 × 10²³ particles'],
        ['Avogadro constant', 'the number of particles in one mole, 6.02 × 10²³'],
        ['relative formula mass', 'the sum of the relative atomic masses in a formula'],
        ['molar mass', 'the mass of one mole of a substance, in grams'],
        ['concentration', 'the amount of solute per unit volume of solution'],
        ['limiting reactant', 'the reactant that runs out and caps the amount of product'],
        ['excess reactant', 'the reactant that is left over when the reaction stops'],
        ['percentage yield', 'the actual yield as a percentage of the theoretical yield'],
        ['atom economy', 'the mass of the wanted product as a percentage of all products'],
        ['empirical formula', 'the simplest whole-number ratio of atoms in a compound'],
        ['molecular formula', 'the actual number of each type of atom in a molecule'],
        ['molar volume', 'the volume occupied by one mole of any gas at room conditions'],
        ['stoichiometry', 'the fixed ratios in which substances react'],
        ['titre', 'the volume delivered from a burette in a titration']
      ],
      truths: [
        'Moles equal mass divided by relative formula mass.',
        'The limiting reactant is the one that determines how much product forms.',
        'A high atom economy means less waste, even if the yield is low.',
        'One mole of any gas occupies the same volume at the same temperature and pressure.'
      ],
      myths: [
        'Moles equal relative formula mass divided by mass.',
        'The reactant present in the greatest mass is always the limiting reactant.',
        'Percentage yield and atom economy measure the same thing.',
        'A mole of hydrogen and a mole of oxygen have the same mass.'
      ]
    },
    {
      name: 'Rates and Equilibrium', from: 'Grade 10', to: 'College',
      facts: [
        ['rate of reaction', 'how quickly reactants are used up or products are formed'],
        ['activation energy', 'the minimum energy particles need to react on collision'],
        ['collision theory', 'the idea that reactions need collisions of sufficient energy'],
        ['surface area', 'a factor increased by using smaller pieces, raising the rate'],
        ['catalyst', 'a substance providing an alternative pathway of lower activation energy'],
        ['reversible reaction', 'a reaction that can proceed in both directions'],
        ['dynamic equilibrium', 'the state where forward and reverse rates are equal'],
        ['Le Chatelier’s principle', 'the rule that a system at equilibrium opposes an imposed change'],
        ['closed system', 'a system from which nothing can enter or escape'],
        ['concentration', 'a factor that raises the rate by making collisions more frequent'],
        ['temperature', 'a factor that raises the rate by making collisions harder and more frequent'],
        ['exothermic direction', 'the direction favoured by lowering the temperature'],
        ['yield', 'the amount of product obtained'],
        ['tangent', 'the line drawn to find the rate at one instant on a graph']
      ],
      truths: [
        'At dynamic equilibrium both reactions continue at equal rates.',
        'Raising the temperature increases the rate mainly by giving particles more energy.',
        'A catalyst speeds up the forward and reverse reactions equally, so the position of equilibrium is unchanged.',
        'Increasing pressure shifts a gaseous equilibrium towards the side with fewer molecules.'
      ],
      myths: [
        'At equilibrium both reactions have stopped.',
        'A catalyst shifts the position of equilibrium towards the products.',
        'Raising the concentration of a reactant lowers the activation energy.',
        'Equilibrium means the amounts of reactants and products are equal.'
      ]
    },
    {
      name: 'Organic Chemistry Basics', from: 'Grade 10', to: 'College',
      facts: [
        ['hydrocarbon', 'a compound containing hydrogen and carbon only'],
        ['alkane', 'a saturated hydrocarbon with only single carbon–carbon bonds'],
        ['alkene', 'an unsaturated hydrocarbon containing a carbon–carbon double bond'],
        ['methane', 'the simplest alkane, CH₄'],
        ['ethene', 'the simplest alkene, C₂H₄'],
        ['crude oil', 'a mixture of hydrocarbons formed from ancient marine organisms'],
        ['fractional distillation', 'the process separating crude oil by boiling point'],
        ['cracking', 'breaking long hydrocarbons into shorter, more useful ones'],
        ['polymerisation', 'joining many small molecules into one long chain'],
        ['monomer', 'the small repeating unit of a polymer'],
        ['alcohol', 'a compound containing the –OH functional group'],
        ['carboxylic acid', 'a compound containing the –COOH functional group'],
        ['functional group', 'the atoms that give a family its characteristic reactions'],
        ['homologous series', 'a family of compounds with the same general formula']
      ],
      truths: [
        'Alkenes decolourise bromine water; alkanes do not.',
        'Cracking produces shorter alkanes and alkenes from long-chain hydrocarbons.',
        'Members of a homologous series differ by one CH₂ unit.',
        'Longer hydrocarbon molecules have higher boiling points and are more viscous.'
      ],
      myths: [
        'Alkanes decolourise bromine water because they are saturated.',
        'Crude oil is a single compound rather than a mixture.',
        'Cracking joins short hydrocarbons into longer ones.',
        'Shorter hydrocarbon chains have the highest boiling points.'
      ]
    }
  ],

  /* ================================ PHYSICS ================================ */
  physics: [
    {
      name: 'Forces and Motion', from: 'Grade 7', to: 'College',
      figures: ['forces'],
      facts: [
        ['speed', 'distance travelled divided by time taken'],
        ['velocity', 'speed in a stated direction'],
        ['acceleration', 'the rate of change of velocity'],
        ['resultant force', 'the single force with the same effect as all the forces acting'],
        ['friction', 'the force opposing motion between surfaces in contact'],
        ['weight', 'the force of gravity on a mass, measured in newtons'],
        ['mass', 'the amount of matter in an object, measured in kilograms'],
        ['terminal velocity', 'the steady speed reached when drag equals weight'],
        ['inertia', 'the tendency of an object to resist a change in its motion'],
        ['newton', 'the SI unit of force'],
        ['scalar', 'a quantity with size but no direction'],
        ['vector', 'a quantity with both size and direction'],
        ['momentum', 'mass multiplied by velocity'],
        ['equilibrium', 'the state when the resultant force on an object is zero']
      ],
      truths: [
        'An object with zero resultant force keeps moving at constant velocity.',
        'Weight is a force in newtons; mass is a quantity of matter in kilograms.',
        'At terminal velocity the drag force equals the weight and acceleration is zero.',
        'Acceleration is a change in velocity, so a change in direction is an acceleration.'
      ],
      myths: [
        'An object needs a constant force acting on it just to keep moving at a steady speed.',
        'Weight and mass are the same quantity in different units.',
        'At terminal velocity the object is no longer moving.',
        'Speed and velocity mean exactly the same thing.'
      ]
    },
    {
      name: 'Energy and Power', from: 'Grade 7', to: 'College',
      facts: [
        ['kinetic energy', 'the energy an object has because it is moving'],
        ['gravitational potential energy', 'the energy an object has because of its height'],
        ['elastic potential energy', 'the energy stored in a stretched or compressed spring'],
        ['work done', 'force multiplied by distance moved in the direction of the force'],
        ['power', 'the rate at which energy is transferred'],
        ['joule', 'the SI unit of energy'],
        ['watt', 'the SI unit of power, one joule per second'],
        ['efficiency', 'the fraction of energy input that is usefully transferred'],
        ['dissipation', 'the spreading of energy to the surroundings, usually as heat'],
        ['conservation of energy', 'the principle that energy is never created or destroyed'],
        ['renewable resource', 'an energy resource that is replenished as it is used'],
        ['specific heat capacity', 'the energy needed to raise 1 kg of a substance by 1 °C'],
        ['insulation', 'a way of reducing the rate of unwanted energy transfer'],
        ['thermal conductivity', 'a measure of how quickly a material transfers heat']
      ],
      truths: [
        'Energy is never used up; it is transferred and often dissipated as heat.',
        'Power is energy transferred divided by time.',
        'No device can be 100% efficient in practice.',
        'Doubling an object’s speed multiplies its kinetic energy by four.'
      ],
      myths: [
        'Energy is used up whenever a device is switched on.',
        'Power and energy are the same quantity.',
        'A more efficient machine transfers more total energy.',
        'Doubling an object’s speed doubles its kinetic energy.'
      ]
    },
    {
      name: 'Waves', from: 'Grade 8', to: 'College',
      figures: ['wave'],
      facts: [
        ['wavelength', 'the distance from one point on a wave to the same point on the next'],
        ['frequency', 'the number of waves passing a point each second'],
        ['amplitude', 'the maximum displacement from the rest position'],
        ['transverse wave', 'a wave whose vibrations are at right angles to its direction of travel'],
        ['longitudinal wave', 'a wave whose vibrations are along its direction of travel'],
        ['hertz', 'the unit of frequency, one wave per second'],
        ['period', 'the time for one complete wave to pass'],
        ['reflection', 'the bouncing of a wave off a surface'],
        ['refraction', 'the change of direction when a wave changes speed'],
        ['diffraction', 'the spreading of a wave as it passes an edge or gap'],
        ['echo', 'a sound heard again after reflecting off a surface'],
        ['ultrasound', 'sound above the range of human hearing'],
        ['electromagnetic spectrum', 'the family of waves from radio to gamma'],
        ['wave speed', 'frequency multiplied by wavelength']
      ],
      truths: [
        'All electromagnetic waves travel at the same speed in a vacuum.',
        'Sound is a longitudinal wave and cannot travel through a vacuum.',
        'Refraction happens because a wave changes speed when it enters a new medium.',
        'Wave speed equals frequency multiplied by wavelength.'
      ],
      myths: [
        'Sound travels faster in a vacuum than in air.',
        'Light is a longitudinal wave.',
        'A wave carries matter along with it from one place to another.',
        'Radio waves travel more slowly than visible light in a vacuum.'
      ]
    },
    {
      name: 'Light and Optics', from: 'Grade 7', to: 'Grade 12',
      figures: ['wave'],
      facts: [
        ['angle of incidence', 'the angle between the incoming ray and the normal'],
        ['angle of reflection', 'the angle between the reflected ray and the normal'],
        ['normal', 'the line drawn at right angles to a surface at the point of contact'],
        ['refraction', 'the bending of light as it passes between materials'],
        ['total internal reflection', 'what happens beyond the critical angle inside a dense material'],
        ['critical angle', 'the angle of incidence above which light is totally internally reflected'],
        ['converging lens', 'a lens that brings parallel rays to a focus'],
        ['diverging lens', 'a lens that spreads parallel rays apart'],
        ['focal length', 'the distance from a lens to its principal focus'],
        ['dispersion', 'the splitting of white light into a spectrum'],
        ['opaque', 'not letting any light through'],
        ['translucent', 'letting light through but scattering it'],
        ['specular reflection', 'reflection from a smooth surface, giving a clear image'],
        ['diffuse reflection', 'reflection from a rough surface, scattering the light']
      ],
      truths: [
        'The angle of incidence equals the angle of reflection, measured from the normal.',
        'Light slows down and bends towards the normal when it enters glass from air.',
        'Optical fibres work by total internal reflection.',
        'A red object looks red because it reflects red light and absorbs the rest.'
      ],
      myths: [
        'Angles in ray diagrams are measured from the surface, not the normal.',
        'Light speeds up when it enters glass from air.',
        'A red object looks red because it produces red light of its own.',
        'A rough surface reflects no light at all.'
      ]
    },
    {
      name: 'Electricity and Circuits', from: 'Grade 7', to: 'College',
      figures: ['circuit'],
      facts: [
        ['current', 'the rate of flow of charge, measured in amperes'],
        ['potential difference', 'the energy transferred per unit charge, measured in volts'],
        ['resistance', 'the opposition to current, measured in ohms'],
        ['series circuit', 'a circuit with a single loop and one path for the current'],
        ['parallel circuit', 'a circuit with branches, each with the same potential difference'],
        ['ammeter', 'the meter connected in series to measure current'],
        ['voltmeter', 'the meter connected in parallel to measure potential difference'],
        ['ohm', 'the unit of resistance'],
        ['charge', 'the quantity measured in coulombs, equal to current times time'],
        ['fuse', 'a component that melts to break a circuit carrying too much current'],
        ['earth wire', 'the safety wire connected to the metal case of an appliance'],
        ['diode', 'a component that allows current in one direction only'],
        ['LDR', 'a component whose resistance falls as light intensity rises'],
        ['thermistor', 'a component whose resistance falls as temperature rises']
      ],
      truths: [
        'Current is the same at every point in a series circuit.',
        'Adding resistors in parallel decreases the total resistance.',
        'An ammeter is connected in series; a voltmeter is connected in parallel.',
        'A thermistor’s resistance falls as it gets hotter.'
      ],
      myths: [
        'Current is used up as it passes through each component in a series circuit.',
        'Adding a resistor in parallel increases the total resistance.',
        'A voltmeter must be connected in series with the component it measures.',
        'Current flows out of both terminals of a cell and meets in the middle.'
      ]
    },
    {
      name: 'Magnetism and Electromagnetism', from: 'Grade 8', to: 'College',
      facts: [
        ['magnetic field', 'the region where a magnetic material experiences a force'],
        ['field line', 'a line drawn from north to south showing field direction'],
        ['permanent magnet', 'a magnet that produces its own field all the time'],
        ['induced magnet', 'a material that becomes magnetic only while in a field'],
        ['solenoid', 'a coil of wire that produces a uniform field inside it'],
        ['electromagnet', 'a solenoid with an iron core, magnetic only while current flows'],
        ['motor effect', 'the force on a current-carrying wire in a magnetic field'],
        ['Fleming’s left-hand rule', 'the rule giving the direction of the force on a wire'],
        ['generator effect', 'the inducing of a potential difference by relative movement'],
        ['transformer', 'a device that changes the size of an alternating potential difference'],
        ['step-up transformer', 'a transformer with more turns on the secondary coil'],
        ['alternating current', 'current that repeatedly reverses direction'],
        ['direct current', 'current that flows in one direction only'],
        ['National Grid', 'the network transmitting electricity at high voltage and low current']
      ],
      truths: [
        'Transformers only work with alternating current.',
        'The National Grid transmits at high voltage to reduce heating losses in the cables.',
        'Reversing the current reverses the direction of the force on a wire in a field.',
        'An electromagnet can be switched off; a permanent magnet cannot.'
      ],
      myths: [
        'A transformer works equally well with direct current.',
        'Electricity is transmitted at high current to reduce energy losses.',
        'Magnetic field lines run from south to north outside a magnet.',
        'All metals are attracted to magnets.'
      ]
    },
    {
      name: 'Heat and Thermal Physics', from: 'Grade 7', to: 'Grade 12',
      facts: [
        ['conduction', 'energy transfer through a solid by vibrating particles'],
        ['convection', 'energy transfer by the movement of a heated fluid'],
        ['radiation', 'energy transfer by infrared waves, needing no medium'],
        ['insulator', 'a material that transfers heat slowly'],
        ['specific heat capacity', 'the energy to raise one kilogram by one degree'],
        ['latent heat', 'the energy needed to change state without changing temperature'],
        ['internal energy', 'the total kinetic and potential energy of the particles'],
        ['thermal equilibrium', 'the state reached when two bodies are at the same temperature'],
        ['absolute zero', 'the temperature at which particles have minimum energy, −273 °C'],
        ['expansion', 'the increase in volume of a material when heated'],
        ['emissivity', 'how good a surface is at emitting infrared radiation'],
        ['vacuum flask', 'a container designed to reduce all three transfer processes'],
        ['density', 'mass per unit volume, which falls as a fluid is heated'],
        ['convection current', 'the circulation set up as warm fluid rises and cool fluid sinks']
      ],
      truths: [
        'Convection cannot happen in a solid because the particles cannot move past one another.',
        'Temperature stays constant while a substance changes state.',
        'Matt black surfaces are the best emitters and absorbers of infrared radiation.',
        'Warm fluid rises because heating makes it less dense.'
      ],
      myths: [
        'Heat rises, so a hot solid bar transfers energy upwards by convection.',
        'A substance keeps getting hotter while it melts.',
        'Shiny white surfaces are the best emitters of infrared radiation.',
        'Cold is a substance that flows into warm objects.'
      ]
    },
    {
      name: 'Pressure, Density and Moments', from: 'Grade 8', to: 'College',
      facts: [
        ['pressure', 'force divided by the area it acts on'],
        ['pascal', 'the SI unit of pressure, one newton per square metre'],
        ['density', 'mass divided by volume'],
        ['upthrust', 'the upward force a fluid exerts on an object in it'],
        ['moment', 'the turning effect of a force, force times perpendicular distance'],
        ['pivot', 'the point about which an object turns'],
        ['lever', 'a simple machine that uses a pivot to multiply force'],
        ['principle of moments', 'the rule that clockwise and anticlockwise moments balance'],
        ['centre of mass', 'the point at which an object’s whole weight can be taken to act'],
        ['atmospheric pressure', 'the pressure caused by the weight of air above'],
        ['hydraulic system', 'a system using a liquid to transmit pressure and multiply force'],
        ['manometer', 'an instrument measuring pressure with a column of liquid'],
        ['floating', 'what happens when upthrust equals weight'],
        ['incompressible', 'a property of liquids that makes hydraulics possible']
      ],
      truths: [
        'A smaller area under the same force gives a greater pressure.',
        'Pressure in a liquid increases with depth.',
        'An object floats when the upthrust equals its weight.',
        'Hydraulics work because liquids are almost incompressible.'
      ],
      myths: [
        'A larger contact area under the same force gives a greater pressure.',
        'Pressure in a liquid is the same at every depth.',
        'Heavy objects always sink and light objects always float.',
        'Gases are used in hydraulic systems because they transmit pressure best.'
      ]
    },
    {
      name: 'Atomic and Nuclear Physics', from: 'Grade 9', to: 'College',
      facts: [
        ['alpha particle', 'a helium nucleus, stopped by paper, strongly ionising'],
        ['beta particle', 'a fast electron from the nucleus, stopped by aluminium'],
        ['gamma ray', 'a high-energy electromagnetic wave, reduced by thick lead'],
        ['half-life', 'the time for half the unstable nuclei in a sample to decay'],
        ['radioactive decay', 'the random breakdown of an unstable nucleus'],
        ['isotope', 'an atom with the same protons but a different number of neutrons'],
        ['ionising radiation', 'radiation able to knock electrons out of atoms'],
        ['background radiation', 'the low-level radiation present everywhere all the time'],
        ['nuclear fission', 'the splitting of a large nucleus into two smaller ones'],
        ['nuclear fusion', 'the joining of two small nuclei to form a larger one'],
        ['chain reaction', 'a self-sustaining sequence of fissions'],
        ['irradiation', 'being exposed to radiation without becoming radioactive'],
        ['contamination', 'having radioactive material on or inside you'],
        ['Geiger–Müller tube', 'the detector used to measure count rate']
      ],
      truths: [
        'Radioactive decay is random: you cannot predict which nucleus decays next.',
        'Alpha is the most ionising and the least penetrating of the three radiations.',
        'Irradiation does not make an object radioactive; contamination does.',
        'Fusion powers the Sun; fission powers current nuclear reactors.'
      ],
      myths: [
        'After two half-lives no radioactive nuclei are left.',
        'Gamma radiation is the most ionising of the three types.',
        'Anything that has been irradiated becomes radioactive itself.',
        'Nuclear power stations release energy by fusing hydrogen nuclei.'
      ]
    },
    {
      name: 'Space Physics', from: 'Grade 8', to: 'Grade 12',
      facts: [
        ['orbit', 'the curved path of one body around another under gravity'],
        ['satellite', 'any object in orbit around a planet'],
        ['geostationary orbit', 'an orbit that keeps a satellite above the same point on Earth'],
        ['red shift', 'the lengthening of light’s wavelength from a receding object'],
        ['Big Bang', 'the theory that the universe expanded from a hot dense state'],
        ['main sequence', 'the long stable stage of a star’s life'],
        ['red giant', 'the swollen stage a star enters as its hydrogen runs out'],
        ['white dwarf', 'the dense remnant left by a low-mass star'],
        ['supernova', 'the explosion ending the life of a massive star'],
        ['black hole', 'the remnant of the most massive stars, from which light cannot escape'],
        ['protostar', 'a cloud of gas and dust collapsing to form a star'],
        ['nebula', 'a cloud of gas and dust in space'],
        ['light year', 'the distance light travels in a year'],
        ['centripetal force', 'the force directed towards the centre that keeps a body in orbit']
      ],
      truths: [
        'A satellite in a stable orbit is accelerating even though its speed is constant.',
        'Red shift in distant galaxies is evidence that the universe is expanding.',
        'The more massive a star, the shorter its main-sequence life.',
        'A light year measures distance, not time.'
      ],
      myths: [
        'There is no gravity in orbit, which is why astronauts float.',
        'A light year is a very long period of time.',
        'The Big Bang was an explosion that happened at one point in existing space.',
        'All stars end their lives as black holes.'
      ]
    }
  ],

  /* ============================== EARTH SCIENCE ============================== */
  earth: [
    {
      name: 'Rocks and the Rock Cycle', from: 'Grade 4', to: 'Grade 10',
      figures: ['volcano'],
      facts: [
        ['igneous rock', 'rock formed when molten magma or lava cools and solidifies'],
        ['sedimentary rock', 'rock formed from compressed layers of sediment'],
        ['metamorphic rock', 'rock changed by heat and pressure without melting'],
        ['weathering', 'the breaking down of rock in place by water, ice or chemicals'],
        ['erosion', 'the carrying away of broken rock by water, wind or ice'],
        ['deposition', 'the dropping of transported sediment'],
        ['magma', 'molten rock beneath the surface'],
        ['lava', 'molten rock that has reached the surface'],
        ['granite', 'a coarse-grained igneous rock formed by slow underground cooling'],
        ['basalt', 'a fine-grained igneous rock formed by fast surface cooling'],
        ['limestone', 'a sedimentary rock made largely of calcium carbonate'],
        ['marble', 'the metamorphic rock formed from limestone'],
        ['fossil', 'the preserved trace of an organism, found in sedimentary rock'],
        ['mineral', 'a naturally occurring solid with a definite chemical composition']
      ],
      truths: [
        'Slowly cooled igneous rock has larger crystals than quickly cooled rock.',
        'Fossils are found in sedimentary rock, not igneous rock.',
        'Weathering breaks rock down in place; erosion carries the pieces away.',
        'Metamorphic rock forms without the rock melting completely.'
      ],
      myths: [
        'Weathering and erosion are two words for the same process.',
        'Fossils are most commonly found in igneous rock.',
        'Fast-cooling lava produces the largest crystals.',
        'Metamorphic rock forms when rock melts and cools again.'
      ]
    },
    {
      name: 'Plate Tectonics', from: 'Grade 5', to: 'Grade 10',
      figures: ['earth-layers'],
      facts: [
        ['tectonic plate', 'a large slab of the Earth’s outer layer that moves slowly'],
        ['crust', 'the thin rocky outer layer of the Earth'],
        ['mantle', 'the thick semi-molten layer beneath the crust'],
        ['core', 'the iron-rich centre of the Earth'],
        ['convergent boundary', 'a boundary where two plates move towards each other'],
        ['divergent boundary', 'a boundary where two plates move apart'],
        ['transform boundary', 'a boundary where two plates slide past each other'],
        ['subduction', 'the sinking of one plate beneath another'],
        ['earthquake', 'the shaking caused by a sudden release of stress in the crust'],
        ['epicentre', 'the point on the surface directly above an earthquake’s focus'],
        ['seismic wave', 'the wave that travels out from an earthquake'],
        ['volcano', 'an opening through which magma reaches the surface'],
        ['continental drift', 'Wegener’s idea that continents have moved over time'],
        ['Richter scale', 'a logarithmic scale of earthquake magnitude']
      ],
      truths: [
        'Plates move because of convection currents in the mantle.',
        'Most earthquakes and volcanoes occur along plate boundaries.',
        'Wegener’s continental drift was rejected for decades because he had no mechanism.',
        'Ocean trenches form where one plate is subducted beneath another.'
      ],
      myths: [
        'Tectonic plates float on a completely liquid mantle.',
        'Earthquakes happen randomly all over the Earth’s surface.',
        'The epicentre is the point underground where an earthquake starts.',
        'Continents are fixed in place and have never moved.'
      ]
    },
    {
      name: 'Weather and Climate', from: 'Grade 4', to: 'Grade 10',
      figures: ['water-cycle'],
      facts: [
        ['weather', 'the state of the atmosphere over hours or days'],
        ['climate', 'the average pattern of weather over decades'],
        ['air pressure', 'the force of the atmosphere pressing on a surface'],
        ['front', 'the boundary between two air masses'],
        ['humidity', 'the amount of water vapour in the air'],
        ['precipitation', 'water falling from clouds as rain, snow, sleet or hail'],
        ['barometer', 'the instrument that measures air pressure'],
        ['anemometer', 'the instrument that measures wind speed'],
        ['cumulonimbus', 'the tall cloud associated with thunderstorms'],
        ['cirrus', 'the high wispy cloud made of ice crystals'],
        ['convection', 'the rising of warm air that drives many weather systems'],
        ['jet stream', 'a fast high-altitude wind that steers weather systems'],
        ['relief rainfall', 'rain caused by air being forced up over high ground'],
        ['isobar', 'a line on a weather map joining points of equal pressure']
      ],
      truths: [
        'Weather describes short-term conditions; climate describes long-term averages.',
        'Low pressure is generally associated with cloud and rain.',
        'Warm air can hold more water vapour than cold air.',
        'Closely spaced isobars indicate strong winds.'
      ],
      myths: [
        'Weather and climate are the same thing measured with different instruments.',
        'High pressure usually brings heavy rain.',
        'Cold air can hold more water vapour than warm air.',
        'Widely spaced isobars indicate the strongest winds.'
      ]
    },
    {
      name: 'The Water Cycle', from: 'Grade 4', to: 'Grade 9',
      figures: ['water-cycle'],
      facts: [
        ['evaporation', 'the change of liquid water into vapour at the surface'],
        ['transpiration', 'the release of water vapour from plant leaves'],
        ['condensation', 'the change of water vapour into liquid droplets'],
        ['precipitation', 'water falling from the atmosphere to the ground'],
        ['infiltration', 'the soaking of water into the ground'],
        ['run-off', 'water flowing over the surface into rivers'],
        ['groundwater', 'water stored in the spaces in rock beneath the surface'],
        ['aquifer', 'a rock layer that holds and transmits groundwater'],
        ['watershed', 'the area of land drained by one river system'],
        ['reservoir', 'an artificial lake storing water for supply'],
        ['desalination', 'the removal of salt from seawater to make it drinkable'],
        ['potable water', 'water that is safe to drink'],
        ['water table', 'the upper level of saturated ground'],
        ['catchment', 'the area collecting rainfall for a river']
      ],
      truths: [
        'The total amount of water on Earth stays roughly constant.',
        'Condensation forms clouds when rising air cools.',
        'Potable water need not be chemically pure — only safe to drink.',
        'Most of Earth’s fresh water is locked up in ice caps and glaciers.'
      ],
      myths: [
        'New water is created by rainfall and destroyed by evaporation.',
        'Clouds form when water vapour evaporates high in the atmosphere.',
        'Potable water means chemically pure water.',
        'Most of the world’s fresh water is in rivers and lakes.'
      ]
    },
    {
      name: 'Soil, Rivers and Landforms', from: 'Grade 5', to: 'Grade 10',
      figures: ['river'],
      facts: [
        ['humus', 'the dark decayed organic matter in soil'],
        ['topsoil', 'the upper fertile soil layer where most roots grow'],
        ['leaching', 'the washing of nutrients down through the soil'],
        ['meander', 'a bend in the course of a river'],
        ['ox-bow lake', 'the curved lake left when a meander is cut off'],
        ['delta', 'the deposit of sediment where a river meets a still body of water'],
        ['floodplain', 'the flat land beside a river that floods'],
        ['tributary', 'a smaller river joining a larger one'],
        ['source', 'the place where a river begins'],
        ['mouth', 'the place where a river enters the sea'],
        ['waterfall', 'the feature formed where a river crosses from hard to soft rock'],
        ['V-shaped valley', 'the valley shape cut by a river in its upper course'],
        ['U-shaped valley', 'the valley shape carved by a glacier'],
        ['moraine', 'the rock debris carried and dropped by a glacier']
      ],
      truths: [
        'Erosion is greatest on the outside of a meander bend.',
        'Rivers deposit sediment where their speed drops.',
        'Glaciers carve U-shaped valleys; rivers cut V-shaped ones.',
        'Deltas form where a river loses energy as it meets standing water.'
      ],
      myths: [
        'Erosion is greatest on the inside of a meander bend.',
        'Rivers deposit most sediment where they flow fastest.',
        'A tributary is the point where a river reaches the sea.',
        'Glaciers cut V-shaped valleys.'
      ]
    },
    {
      name: 'Geological Time and Earth’s History', from: 'Grade 6', to: 'Grade 10',
      facts: [
        ['stratum', 'a single layer of sedimentary rock'],
        ['superposition', 'the principle that lower layers are older than those above'],
        ['index fossil', 'a widespread short-lived fossil used to date rock'],
        ['radiometric dating', 'dating rock by the decay of radioactive isotopes'],
        ['era', 'a major division of geological time'],
        ['Mesozoic', 'the era of the dinosaurs'],
        ['Palaeozoic', 'the era in which complex life diversified in the oceans'],
        ['Cenozoic', 'the era following the extinction of the dinosaurs'],
        ['mass extinction', 'an event in which a large fraction of species dies out'],
        ['unconformity', 'a gap in the rock record where erosion removed layers'],
        ['Pangaea', 'the supercontinent that existed about 250 million years ago'],
        ['half-life', 'the quantity used to convert isotope ratios into an age'],
        ['relative dating', 'placing rocks in order without giving an exact age'],
        ['absolute dating', 'giving a rock a numerical age in years']
      ],
      truths: [
        'In undisturbed layers, the deepest rock is the oldest.',
        'Radiometric dating gives an absolute age; fossil sequence gives a relative one.',
        'Earth is about 4.5 billion years old.',
        'Dinosaurs and humans are separated by roughly 65 million years.'
      ],
      myths: [
        'Humans lived alongside the non-bird dinosaurs.',
        'In undisturbed rock the topmost layer is the oldest.',
        'Index fossils are useful because the species lived for hundreds of millions of years.',
        'Earth is a few tens of thousands of years old.'
      ]
    }
  ],

  /* ================================ ASTRONOMY ================================ */
  astronomy: [
    {
      name: 'The Solar System', from: 'Grade 4', to: 'Grade 10',
      facts: [
        ['Mercury', 'the smallest planet and the closest to the Sun'],
        ['Venus', 'the hottest planet, wrapped in thick carbon dioxide cloud'],
        ['Mars', 'the red planet, home to the tallest volcano in the solar system'],
        ['Jupiter', 'the largest planet, with a centuries-old storm'],
        ['Saturn', 'the planet best known for its bright ring system'],
        ['Uranus', 'the ice giant that rotates on its side'],
        ['Neptune', 'the furthest planet from the Sun, with the fastest winds'],
        ['asteroid belt', 'the band of rocky bodies between Mars and Jupiter'],
        ['comet', 'an icy body that grows a tail as it nears the Sun'],
        ['dwarf planet', 'a body like Pluto that has not cleared its orbit'],
        ['moon', 'a natural satellite in orbit around a planet'],
        ['orbit', 'the elliptical path a planet takes around the Sun'],
        ['astronomical unit', 'the average distance from the Earth to the Sun'],
        ['gas giant', 'a large planet made mostly of hydrogen and helium']
      ],
      truths: [
        'The four inner planets are rocky; the four outer planets are gas or ice giants.',
        'Venus is hotter than Mercury because of its thick atmosphere.',
        'Pluto is classified as a dwarf planet because it has not cleared its orbit.',
        'A comet’s tail always points away from the Sun.'
      ],
      myths: [
        'Mercury is the hottest planet because it is nearest the Sun.',
        'A comet’s tail streams out behind its direction of travel.',
        'Jupiter is a rocky planet like Earth, only larger.',
        'The asteroid belt lies between Earth and Mars.'
      ]
    },
    {
      name: 'Earth, Moon and Seasons', from: 'Grade 4', to: 'Grade 9',
      facts: [
        ['rotation', 'the spin of the Earth on its axis, giving day and night'],
        ['revolution', 'the orbit of the Earth around the Sun, taking a year'],
        ['axial tilt', 'the 23.5° lean that causes the seasons'],
        ['solstice', 'the day of longest or shortest daylight'],
        ['equinox', 'the day when daylight and darkness are nearly equal'],
        ['lunar phase', 'the changing lit portion of the Moon as seen from Earth'],
        ['new moon', 'the phase when the lit side faces away from Earth'],
        ['full moon', 'the phase when the whole lit side faces Earth'],
        ['solar eclipse', 'the event when the Moon passes between Earth and Sun'],
        ['lunar eclipse', 'the event when Earth’s shadow falls on the Moon'],
        ['tide', 'the rise and fall of sea level caused mainly by the Moon’s gravity'],
        ['spring tide', 'the largest tidal range, at new and full moon'],
        ['synchronous rotation', 'why the same face of the Moon always points at Earth'],
        ['waxing', 'the period when the lit portion of the Moon is growing']
      ],
      truths: [
        'Seasons are caused by the tilt of Earth’s axis, not by distance from the Sun.',
        'The Moon keeps the same face towards Earth because it rotates once per orbit.',
        'A solar eclipse happens at new moon; a lunar eclipse at full moon.',
        'Moon phases are caused by the changing angle of view, not by Earth’s shadow.'
      ],
      myths: [
        'It is summer when the Earth is closest to the Sun.',
        'Moon phases are caused by Earth casting its shadow on the Moon.',
        'The Moon does not rotate at all.',
        'The dark side of the Moon never receives sunlight.'
      ]
    },
    {
      name: 'Stars and Stellar Life Cycles', from: 'Grade 6', to: 'Grade 12',
      facts: [
        ['nebula', 'the cloud of gas and dust in which stars form'],
        ['protostar', 'the collapsing cloud before nuclear fusion begins'],
        ['main sequence star', 'a star fusing hydrogen into helium in its core'],
        ['red giant', 'the swollen late stage of a low-mass star'],
        ['red supergiant', 'the late stage of a high-mass star'],
        ['white dwarf', 'the hot dense remnant of a low-mass star'],
        ['supernova', 'the explosion that ends a massive star’s life'],
        ['neutron star', 'the extremely dense remnant left by some supernovae'],
        ['black hole', 'the remnant whose gravity prevents even light escaping'],
        ['nuclear fusion', 'the joining of light nuclei that powers a star'],
        ['luminosity', 'the total energy a star radiates each second'],
        ['apparent magnitude', 'how bright a star looks from Earth'],
        ['parallax', 'the apparent shift of a nearby star used to measure distance'],
        ['spectral class', 'the classification of a star by its temperature and colour']
      ],
      truths: [
        'Blue stars are hotter than red stars.',
        'Elements heavier than iron are formed in supernovae.',
        'The more massive a star, the faster it burns its fuel and the shorter its life.',
        'Our Sun will end as a white dwarf, not as a black hole.'
      ],
      myths: [
        'Red stars are the hottest stars.',
        'Every star ends its life as a black hole.',
        'Massive stars live longest because they have the most fuel.',
        'Stars produce energy by burning gas chemically.'
      ]
    },
    {
      name: 'Galaxies and the Universe', from: 'Grade 7', to: 'Grade 12',
      facts: [
        ['galaxy', 'a gravitationally bound system of billions of stars'],
        ['Milky Way', 'the barred spiral galaxy containing our solar system'],
        ['Andromeda', 'the nearest large spiral galaxy to our own'],
        ['spiral galaxy', 'a galaxy with a central bulge and winding arms'],
        ['elliptical galaxy', 'a galaxy shaped like a smooth featureless ellipse'],
        ['red shift', 'the stretching of light from a receding source'],
        ['Hubble’s law', 'the finding that more distant galaxies recede faster'],
        ['Big Bang', 'the model of a universe expanding from a hot dense beginning'],
        ['cosmic microwave background', 'the faint radiation left over from the early universe'],
        ['dark matter', 'unseen mass inferred from how fast galaxies rotate'],
        ['dark energy', 'the name given to whatever is accelerating the expansion'],
        ['light year', 'the distance light travels in one year'],
        ['supercluster', 'a group of clusters of galaxies'],
        ['observable universe', 'the part of the universe whose light has had time to reach us']
      ],
      truths: [
        'The cosmic microwave background is strong evidence for the Big Bang.',
        'Space itself expands: galaxies are not flying through space away from a centre.',
        'Dark matter is inferred from its gravitational effects, not seen directly.',
        'Looking further away means looking further back in time.'
      ],
      myths: [
        'The Big Bang happened at one point in space that we could travel to.',
        'Red shift shows that galaxies are moving through space away from the Milky Way’s centre.',
        'Dark matter has been directly observed with telescopes.',
        'The Milky Way is the only galaxy in the universe.'
      ]
    },
    {
      name: 'Space Exploration', from: 'Grade 4', to: 'Grade 12',
      facts: [
        ['Sputnik 1', 'the first artificial satellite, launched in 1957'],
        ['Yuri Gagarin', 'the first human in space, in 1961'],
        ['Apollo 11', 'the mission that first landed humans on the Moon in 1969'],
        ['International Space Station', 'the crewed laboratory in low Earth orbit'],
        ['rover', 'a wheeled robot that explores a planetary surface'],
        ['Voyager 1', 'the probe that has travelled furthest from Earth'],
        ['Hubble Space Telescope', 'the optical telescope launched into orbit in 1990'],
        ['James Webb Space Telescope', 'the infrared observatory launched in 2021'],
        ['orbital velocity', 'the speed needed to stay in a stable orbit'],
        ['escape velocity', 'the speed needed to break free of a body’s gravity'],
        ['microgravity', 'the near-weightless condition experienced in orbit'],
        ['probe', 'an uncrewed spacecraft sent to study a distant target'],
        ['launch window', 'the limited period when a mission can be launched efficiently'],
        ['re-entry', 'the return of a spacecraft through the atmosphere']
      ],
      truths: [
        'Astronauts float in orbit because they are in continuous free fall, not because gravity is absent.',
        'Uncrewed probes have visited every planet in the solar system.',
        'Space telescopes avoid the blurring and absorption caused by the atmosphere.',
        'Launch windows exist because the relative positions of planets change.'
      ],
      myths: [
        'There is no gravity in low Earth orbit.',
        'The Hubble Space Telescope orbits the Moon.',
        'Humans have walked on Mars.',
        'A spacecraft needs to keep its engines firing to stay in orbit.'
      ]
    },
    {
      name: 'Telescopes and Observing', from: 'Grade 6', to: 'Grade 12',
      facts: [
        ['refracting telescope', 'a telescope that gathers light with a lens'],
        ['reflecting telescope', 'a telescope that gathers light with a mirror'],
        ['aperture', 'the diameter of the light-gathering lens or mirror'],
        ['magnification', 'how much larger an object appears through the instrument'],
        ['resolution', 'the ability to distinguish two close objects as separate'],
        ['light pollution', 'the sky brightness from artificial lighting that hides faint stars'],
        ['radio telescope', 'a dish that collects radio waves from space'],
        ['spectroscopy', 'the study of an object’s light split into its wavelengths'],
        ['constellation', 'a recognised pattern of stars in the sky'],
        ['celestial sphere', 'the imagined sphere on which the stars appear fixed'],
        ['zenith', 'the point directly overhead'],
        ['seeing', 'the steadiness of the atmosphere on a given night'],
        ['infrared astronomy', 'observing at wavelengths that reveal cool dust and distant galaxies'],
        ['adaptive optics', 'a system that corrects for atmospheric blurring in real time']
      ],
      truths: [
        'A larger aperture collects more light and shows fainter objects.',
        'Most large modern telescopes use mirrors rather than lenses.',
        'Spectroscopy reveals what a distant star is made of.',
        'Stars in a constellation are usually at very different distances from Earth.'
      ],
      myths: [
        'Magnification is the most important property of a telescope.',
        'Stars in a constellation are all the same distance from Earth and physically grouped.',
        'Radio telescopes can only be used at night.',
        'Large research telescopes use lenses because mirrors distort the image.'
      ]
    }
  ]
};
