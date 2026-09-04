/* Chemistry and physics, at second-pass depth.

   The first-pass units cover "Atomic Structure" and "Bonding and Structure" as
   single topics, which is right for a first meeting and much too coarse from
   Grade 9 up: ionic and covalent bonding are a fortnight each, and a student is
   expected to explain why one conducts when molten and the other does not.

   Chemistry misconceptions are unusually stubborn and unusually specific —
   "the atom loses electrons to become stable", "melting breaks covalent bonds",
   "the mole is a mass" — so the myth banks here are the errors that actually
   turn up in marking, not invented wrong answers. */

export const CHEM_UNITS = {
  chemistry: [
    {
      name: 'Atomic Structure and Electron Configuration', from: 'Grade 8', to: 'College',
      figures: ['atom-carbon', 'atom-sodium', 'atom-oxygen'],
      facts: [
        ['a proton', 'the positively charged particle in the nucleus, with a relative mass of 1'],
        ['a neutron', 'the uncharged particle in the nucleus, with a relative mass of 1'],
        ['an electron', 'the negatively charged particle orbiting the nucleus, with almost no mass'],
        ['the nucleus', 'the tiny central region holding almost all of an atom’s mass'],
        ['the atomic number', 'the number of protons, which decides which element an atom is'],
        ['the mass number', 'the total number of protons and neutrons'],
        ['an isotope', 'an atom of the same element with a different number of neutrons'],
        ['relative atomic mass', 'the average mass of an element’s atoms, weighted by isotope abundance'],
        ['an electron shell', 'an energy level that electrons occupy around the nucleus'],
        ['the outer shell', 'the highest occupied energy level, which decides how an atom reacts'],
        ['a valence electron', 'an electron in the outer shell'],
        ['electron configuration', 'the arrangement of electrons across the shells, such as 2,8,1'],
        ['an ion', 'an atom that has gained or lost electrons and so carries a charge'],
        ['a cation', 'a positively charged ion, formed by losing electrons'],
        ['an anion', 'a negatively charged ion, formed by gaining electrons'],
        ['a noble gas', 'an element with a full outer shell, which is why it barely reacts'],
        ['a full outer shell', 'the arrangement an atom’s electrons reach in forming a bond'],
        ['the plum pudding model', 'the superseded model of a positive sphere with electrons embedded'],
        ['the nuclear model', 'the model with a dense positive nucleus and mostly empty space'],
        ['the alpha scattering experiment', 'the experiment that showed the atom is mostly empty space'],
        ['an energy level', 'another name for an electron shell'],
        ['relative charge', 'the charge of a particle compared with a proton: +1, 0 or −1']
      ],
      truths: [
        'The atomic number is the number of protons and identifies the element.',
        'Isotopes of an element have the same number of protons and different numbers of neutrons.',
        'Almost all of an atom’s mass is in the nucleus, which occupies almost none of its volume.',
        'An atom is neutral because it has equal numbers of protons and electrons.',
        'A sodium atom has the configuration 2,8,1 and forms a 1+ ion by losing one electron.',
        'Isotopes of an element have identical chemical properties because they have the same outer shell.'
      ],
      myths: [
        'Isotopes of an element have different numbers of protons.',
        'The mass number is the number of protons.',
        'An atom becomes an ion by gaining or losing protons.',
        'Electrons make up most of an atom’s mass.',
        'Isotopes of an element react differently from each other.',
        'A neutral atom has equal numbers of protons and neutrons.'
      ],
      sequences: [
        ['Filling the electron shells of a sodium atom', [
          'Two electrons fill the first shell',
          'Eight electrons fill the second shell',
          'One electron goes into the third shell',
          'The configuration is written 2,8,1',
          'Losing the outer electron gives a 1+ ion with a full outer shell'
        ]]
      ],
      applications: [
        ['An atom has 17 protons and 18 neutrons. What is its mass number?', 'the mass number'],
        ['Two samples of the same element differ in mass but not in reactions. What are they?', 'an isotope'],
        ['An atom loses one electron and now carries a single positive charge. What has it become?', 'a cation'],
        ['Most alpha particles pass straight through a gold foil. What does this show about the atom?', 'the nuclear model'],
        ['An element barely reacts with anything. What does its outer shell look like?', 'a full outer shell'],
        ['An atom gains two electrons to complete its outer shell. What is formed?', 'an anion']
      ]
    },

    {
      name: 'Ionic Bonding', from: 'Grade 9', to: 'College',
      figures: ['ionic-bond'],
      facts: [
        ['an ionic bond', 'the electrostatic attraction between oppositely charged ions'],
        ['electron transfer', 'the movement of electrons from a metal atom to a non-metal atom'],
        ['a giant ionic lattice', 'the regular three-dimensional arrangement of alternating ions'],
        ['electrostatic attraction', 'the force between opposite charges that holds the lattice together'],
        ['a metal atom', 'the atom that loses electrons in ionic bonding'],
        ['a non-metal atom', 'the atom that gains electrons in ionic bonding'],
        ['a cation', 'the positive ion, formed by the metal'],
        ['an anion', 'the negative ion, formed by the non-metal'],
        ['sodium chloride', 'the ionic compound formed from sodium and chlorine'],
        ['magnesium oxide', 'the ionic compound with 2+ and 2− ions and a very high melting point'],
        ['a high melting point', 'the property that follows from strong forces throughout the lattice'],
        ['brittleness', 'the property of shattering when layers shift and like charges meet'],
        ['a dot and cross diagram', 'the drawing showing where each bonding electron came from'],
        ['an empirical formula', 'the simplest whole-number ratio of ions in a compound'],
        ['a mobile ion', 'the charge carrier that lets molten or dissolved ionic compounds conduct'],
        ['electrolysis', 'the decomposition of an ionic compound by passing electricity through it'],
        ['an electrolyte', 'the molten or dissolved ionic compound that conducts during electrolysis'],
        ['solubility', 'the property that lets many ionic compounds dissolve in water']
      ],
      truths: [
        'Ionic compounds conduct electricity when molten or dissolved, but not when solid.',
        'Ionic bonding involves the complete transfer of electrons, not sharing.',
        'Magnesium oxide has a higher melting point than sodium chloride because its ions carry double the charge.',
        'A solid ionic compound does not conduct because its ions cannot move.',
        'Ionic compounds are brittle: shifting a layer brings like charges together and the crystal splits.',
        'The formula of an ionic compound gives the ratio of ions, not the number in one particle.'
      ],
      myths: [
        'Ionic compounds conduct electricity when solid.',
        'Ionic bonding involves sharing a pair of electrons.',
        'Sodium chloride exists as NaCl molecules.',
        'Melting an ionic compound breaks the ionic bonds completely.',
        'Ionic compounds are soft because the ions can slide past each other.',
        'The electrons in an ionic bond belong to both atoms equally.'
      ],
      applications: [
        ['A solid does not conduct but its molten form does. What kind of bonding does it have?', 'an ionic bond'],
        ['A crystal shatters when struck rather than bending. Which property is this?', 'brittleness'],
        ['Sodium gives one electron to chlorine. What is this process called?', 'electron transfer'],
        ['A compound of 2+ and 2− ions melts at over 2800°C. Which compound is it?', 'magnesium oxide'],
        ['A dissolved salt is decomposed by passing a current through it. What is the process?', 'electrolysis']
      ]
    },

    {
      name: 'Covalent Bonding and Structures', from: 'Grade 9', to: 'College',
      figures: ['covalent-bond'],
      facts: [
        ['a covalent bond', 'a shared pair of electrons between two non-metal atoms'],
        ['a shared pair', 'the two electrons that make up a single covalent bond'],
        ['a lone pair', 'a pair of outer electrons not involved in bonding'],
        ['a double bond', 'two shared pairs between the same two atoms'],
        ['a simple molecular substance', 'a substance made of small molecules with weak forces between them'],
        ['an intermolecular force', 'the weak attraction between separate molecules'],
        ['a giant covalent structure', 'a lattice in which every atom is covalently bonded, such as diamond'],
        ['diamond', 'the form of carbon in which each atom bonds to four others, giving great hardness'],
        ['graphite', 'the form of carbon in layers of atoms bonded to three others, which conducts'],
        ['a delocalised electron', 'the free electron in graphite that allows it to conduct'],
        ['graphene', 'a single layer of graphite, one atom thick'],
        ['a fullerene', 'a hollow carbon molecule such as C60'],
        ['a low boiling point', 'the property of simple molecular substances, caused by weak intermolecular forces'],
        ['a polymer', 'a long molecule made by joining many small repeating units'],
        ['a monomer', 'the small repeating unit a polymer is built from'],
        ['a displayed formula', 'the diagram showing every atom and every bond as a line'],
        ['a dot and cross diagram', 'the diagram showing which atom each bonding electron came from'],
        ['methane', 'the molecule with one carbon sharing four pairs with hydrogen atoms'],
        ['water', 'the molecule with an oxygen sharing two pairs and holding two lone pairs'],
        ['silicon dioxide', 'the giant covalent structure of sand and quartz']
      ],
      truths: [
        'Melting a simple molecular substance overcomes the forces between molecules, not the covalent bonds.',
        'Graphite conducts electricity because each carbon bonds to only three others, leaving one delocalised electron.',
        'Diamond is hard because every carbon atom is covalently bonded to four others in a rigid lattice.',
        'Simple molecular substances have low melting and boiling points because the forces between molecules are weak.',
        'A double bond is two shared pairs between the same two atoms.',
        'Graphite is soft because the layers can slide over one another.'
      ],
      myths: [
        'Melting a simple molecular substance breaks the covalent bonds inside the molecules.',
        'Diamond conducts electricity because it is made of carbon.',
        'Covalent bonds are weak, which is why molecular substances melt easily.',
        'Graphite is soft because its covalent bonds are weak.',
        'A covalent bond involves one atom giving an electron to another.',
        'All covalent substances have low melting points.'
      ],
      applications: [
        ['A substance melts at 25°C and does not conduct. What kind of structure does it have?', 'a simple molecular substance'],
        ['A form of carbon conducts electricity and marks paper. What is it?', 'graphite'],
        ['A substance melts above 3500°C and is the hardest natural material. What is it?', 'diamond'],
        ['Boiling a liquid molecular substance leaves the molecules themselves intact. What was overcome?', 'an intermolecular force'],
        ['Many identical small molecules join into one long chain. What is formed?', 'a polymer']
      ]
    },

    {
      name: 'Moles, Masses and Calculations', from: 'Grade 10', to: 'College',
      facts: [
        ['a mole', 'the amount of substance containing 6.02 × 10²³ particles'],
        ['the Avogadro constant', 'the number of particles in one mole, 6.02 × 10²³'],
        ['relative atomic mass', 'the mass of one mole of atoms of an element, in grams'],
        ['relative formula mass', 'the sum of the relative atomic masses in a formula'],
        ['molar mass', 'the mass of one mole of a substance, in grams per mole'],
        ['concentration', 'the amount of solute in a given volume of solution'],
        ['a limiting reactant', 'the reactant that runs out first and so decides the yield'],
        ['an excess reactant', 'the reactant left over when the reaction stops'],
        ['percentage yield', 'the actual yield as a percentage of the theoretical yield'],
        ['theoretical yield', 'the mass of product a reaction would give if it went to completion'],
        ['atom economy', 'the proportion of reactant mass that ends up in the desired product'],
        ['an empirical formula', 'the simplest whole-number ratio of atoms in a compound'],
        ['a molecular formula', 'the actual number of each kind of atom in one molecule'],
        ['a balanced equation', 'an equation with the same number of each atom on both sides'],
        ['conservation of mass', 'the principle that mass is neither created nor destroyed in a reaction'],
        ['molar volume', 'the volume one mole of any gas occupies, 24 dm³ at room conditions'],
        ['a titration', 'the technique for finding an unknown concentration by careful neutralisation'],
        ['the end point', 'the moment in a titration when the indicator changes colour']
      ],
      truths: [
        'One mole of any substance contains 6.02 × 10²³ particles.',
        'Mass in grams divided by molar mass gives the number of moles.',
        'The limiting reactant decides how much product a reaction can make.',
        'Percentage yield is always 100% or less, because product is lost in practice.',
        'A reaction in a sealed container shows no change in total mass.',
        'One mole of any gas occupies about 24 dm³ at room temperature and pressure.'
      ],
      myths: [
        'A mole is a unit of mass.',
        'The reactant present in the greatest mass is always the limiting one.',
        'Percentage yield can exceed 100% if the reaction goes well.',
        'A reaction that produces a gas loses mass even in a sealed container.',
        'The empirical formula and the molecular formula are always the same.',
        'One mole of a heavy gas occupies more volume than one mole of a light one.'
      ],
      applications: [
        ['48 g of magnesium reacts with plenty of oxygen. Which quantity fixes the mass of product?', 'a limiting reactant'],
        ['A reaction gives 8 g of product where 10 g was expected. What is being calculated?', 'percentage yield'],
        ['A flask is sealed and a gas is produced, yet the balance reading does not change. Which principle is shown?', 'conservation of mass'],
        ['An unknown acid concentration is found by adding alkali until the indicator turns. What technique is this?', 'a titration'],
        ['A compound is found to be 1 carbon to 2 hydrogen by ratio. What has been determined?', 'an empirical formula']
      ]
    },

    {
      name: 'Rates of Reaction and Equilibrium', from: 'Grade 10', to: 'College',
      facts: [
        ['rate of reaction', 'how quickly reactants are used up or products are formed'],
        ['collision theory', 'the idea that particles must collide with enough energy to react'],
        ['activation energy', 'the minimum energy a collision needs for a reaction to happen'],
        ['a successful collision', 'a collision with enough energy and the right orientation'],
        ['a catalyst', 'a substance that speeds a reaction by lowering the activation energy'],
        ['surface area', 'the factor increased by grinding a solid, which raises the rate'],
        ['concentration', 'the factor that raises the rate by making collisions more frequent'],
        ['temperature', 'the factor that raises the rate by making collisions more frequent and more energetic'],
        ['pressure', 'the factor that raises the rate of a gas reaction by crowding the particles'],
        ['a reversible reaction', 'a reaction that can go both forwards and backwards'],
        ['dynamic equilibrium', 'the state where forward and backward rates are equal and concentrations stop changing'],
        ['Le Chatelier’s principle', 'the rule that a system at equilibrium shifts to oppose a change imposed on it'],
        ['a closed system', 'a system that exchanges energy but not matter with its surroundings'],
        ['an exothermic reaction', 'a reaction that transfers energy out, warming the surroundings'],
        ['an endothermic reaction', 'a reaction that takes energy in, cooling the surroundings'],
        ['the Haber process', 'the industrial reaction making ammonia from nitrogen and hydrogen'],
        ['yield', 'the amount of product obtained at equilibrium'],
        ['a compromise condition', 'the temperature or pressure chosen to balance rate against yield'],
        ['a reaction profile', 'the diagram showing energy against progress of reaction']
      ],
      truths: [
        'A catalyst speeds up a reaction by providing a route with lower activation energy.',
        'At dynamic equilibrium the forward and backward reactions are still happening, at equal rates.',
        'Raising the temperature increases the rate because more collisions exceed the activation energy.',
        'Increasing the pressure shifts a gas equilibrium towards the side with fewer molecules.',
        'A catalyst does not change the position of an equilibrium, only how fast it is reached.',
        'The Haber process runs at a compromise temperature: hotter is faster but gives a lower yield.'
      ],
      myths: [
        'A catalyst is used up during the reaction.',
        'At equilibrium both reactions have stopped.',
        'A catalyst increases the yield of a reversible reaction.',
        'Raising the temperature works only by making particles collide more often.',
        'Equilibrium means the concentrations of reactants and products are equal.',
        'A reversible reaction can only go in one direction at a time.'
      ],
      applications: [
        ['Powdered marble reacts faster than the same mass of marble chips. Which factor changed?', 'surface area'],
        ['Adding a substance speeds the reaction and it is recovered unchanged. What is it?', 'a catalyst'],
        ['Increasing the pressure raises the ammonia yield. Which principle predicts this?', 'Le Chatelier’s principle'],
        ['Concentrations stop changing but both reactions continue. What state is this?', 'dynamic equilibrium'],
        ['A reaction vessel warms up as the reaction proceeds. What kind of reaction is it?', 'an exothermic reaction']
      ]
    },

    {
      name: 'Organic Chemistry: Families and Reactions', from: 'Grade 10', to: 'College',
      facts: [
        ['a hydrocarbon', 'a compound of hydrogen and carbon only'],
        ['an alkane', 'a saturated hydrocarbon with only single carbon–carbon bonds'],
        ['an alkene', 'an unsaturated hydrocarbon containing a carbon–carbon double bond'],
        ['an alcohol', 'the family with an −OH functional group'],
        ['a carboxylic acid', 'the family with a −COOH functional group'],
        ['an ester', 'the sweet-smelling product of an alcohol and a carboxylic acid'],
        ['a functional group', 'the atom or group that gives a family its reactions'],
        ['a homologous series', 'a family of compounds with the same functional group and a general formula'],
        ['saturated', 'containing only single carbon–carbon bonds'],
        ['unsaturated', 'containing at least one carbon–carbon double bond'],
        ['methane', 'the simplest alkane, CH₄'],
        ['ethene', 'the simplest alkene, C₂H₄'],
        ['ethanol', 'the alcohol made by fermentation or by hydration of ethene'],
        ['fractional distillation', 'the separation of crude oil by boiling point'],
        ['cracking', 'the breaking of long hydrocarbons into shorter, more useful ones'],
        ['combustion', 'the reaction of a hydrocarbon with oxygen, releasing energy'],
        ['complete combustion', 'burning in plenty of oxygen, giving carbon dioxide and water'],
        ['incomplete combustion', 'burning in limited oxygen, giving carbon monoxide and soot'],
        ['bromine water', 'the reagent that is decolourised by an alkene but not by an alkane'],
        ['an addition reaction', 'the reaction in which a double bond opens and atoms add across it'],
        ['polymerisation', 'the joining of many monomers into a long chain'],
        ['fermentation', 'the anaerobic conversion of sugar to ethanol by yeast']
      ],
      truths: [
        'Bromine water is decolourised by an alkene and stays orange with an alkane.',
        'Alkanes are saturated; alkenes are unsaturated.',
        'Incomplete combustion produces carbon monoxide, which is toxic and has no smell.',
        'Cracking converts long, less useful hydrocarbons into shorter ones and alkenes.',
        'Members of a homologous series differ by CH₂ and show a gradual change in boiling point.',
        'Fractional distillation separates crude oil by boiling point, not by chemical reaction.'
      ],
      myths: [
        'Bromine water is decolourised by alkanes.',
        'Alkenes are saturated hydrocarbons.',
        'Complete combustion of a hydrocarbon produces carbon monoxide.',
        'Cracking joins short hydrocarbons into longer ones.',
        'Fractional distillation separates crude oil by chemical reaction.',
        'All hydrocarbons contain oxygen.'
      ],
      sequences: [
        ['Getting petrol from crude oil', [
          'Crude oil is heated until it vaporises',
          'The vapour enters a fractionating column that is hotter at the bottom',
          'Fractions condense at different heights according to boiling point',
          'Long-chain fractions are collected near the base',
          'Cracking breaks the long chains into shorter, more useful molecules'
        ]]
      ],
      applications: [
        ['A gas decolourises bromine water within seconds. Which family does it belong to?', 'an alkene'],
        ['A flame burns with a yellow, sooty tip in limited air. What is happening?', 'incomplete combustion'],
        ['Yeast converts sugar solution into an alcoholic liquid. What is the process?', 'fermentation'],
        ['A long hydrocarbon is heated with a catalyst and breaks into a short alkane and an alkene. What is this?', 'cracking'],
        ['An alcohol and an acid warm together to give a sweet-smelling liquid. What has formed?', 'an ester']
      ]
    },

    {
      name: 'Acids, Bases and Electrolysis', from: 'Grade 9', to: 'College',
      facts: [
        ['an acid', 'a substance that releases hydrogen ions in solution'],
        ['a base', 'a substance that neutralises an acid'],
        ['an alkali', 'a soluble base, which releases hydroxide ions in solution'],
        ['the pH scale', 'the scale from 0 to 14 measuring acidity'],
        ['neutralisation', 'the reaction of an acid with a base to give a salt and water'],
        ['a salt', 'the compound formed when the hydrogen of an acid is replaced by a metal'],
        ['a strong acid', 'an acid that is fully ionised in solution'],
        ['a weak acid', 'an acid that is only partly ionised in solution'],
        ['universal indicator', 'the indicator giving a range of colours across the pH scale'],
        ['litmus', 'the indicator that is red in acid and blue in alkali'],
        ['electrolysis', 'the decomposition of a compound by passing electricity through it'],
        ['an electrolyte', 'the molten or dissolved ionic compound that conducts during electrolysis'],
        ['the cathode', 'the negative electrode, where positive ions gain electrons'],
        ['the anode', 'the positive electrode, where negative ions lose electrons'],
        ['oxidation', 'the loss of electrons'],
        ['reduction', 'the gain of electrons'],
        ['a half equation', 'the equation showing electrons gained or lost at one electrode'],
        ['the reactivity series', 'the order of metals by how readily they react'],
        ['a displacement reaction', 'the reaction in which a more reactive metal takes the place of a less reactive one'],
        ['a spectator ion', 'an ion present throughout a reaction but not changed by it']
      ],
      truths: [
        'A strong acid is fully ionised; a weak acid is only partly ionised.',
        'At the cathode, positive ions gain electrons and are reduced.',
        'Neutralisation always produces a salt and water.',
        'Oxidation is loss of electrons and reduction is gain of electrons.',
        'A pH of 7 is neutral; below 7 is acidic and above 7 is alkaline.',
        'A more reactive metal will displace a less reactive one from its compound.'
      ],
      myths: [
        'A strong acid and a concentrated acid mean the same thing.',
        'Oxidation is the gain of electrons.',
        'Positive ions are attracted to the positive electrode.',
        'All bases dissolve in water.',
        'Neutralisation always gives a solution of pH exactly 7 regardless of the acid and base used.',
        'A weak acid cannot be dangerous.'
      ],
      applications: [
        ['Copper is deposited on the negative electrode during electrolysis. What has happened to the copper ions?', 'reduction'],
        ['A dilute solution of an acid has a pH of 1. Is it strong or weak?', 'a strong acid'],
        ['Magnesium is added to copper sulfate and the blue colour fades. What kind of reaction is this?', 'a displacement reaction'],
        ['An acid and an alkali are mixed and the products are sodium chloride and water. What has taken place?', 'neutralisation'],
        ['An ion appears unchanged on both sides of an ionic equation. What is it?', 'a spectator ion']
      ]
    }
  ],

  physics: [
    {
      name: 'Waves in Depth', from: 'Grade 9', to: 'College',
      figures: ['wave'],
      facts: [
        ['a transverse wave', 'a wave whose oscillations are at right angles to the direction of travel'],
        ['a longitudinal wave', 'a wave whose oscillations are along the direction of travel'],
        ['amplitude', 'the maximum displacement from the rest position'],
        ['wavelength', 'the distance between one point on a wave and the same point on the next'],
        ['frequency', 'the number of complete waves passing a point each second'],
        ['the period', 'the time for one complete wave to pass a point'],
        ['the wave equation', 'the relationship v = fλ between speed, frequency and wavelength'],
        ['a crest', 'the highest point of a transverse wave'],
        ['a trough', 'the lowest point of a transverse wave'],
        ['a compression', 'the region of a longitudinal wave where particles are close together'],
        ['a rarefaction', 'the region of a longitudinal wave where particles are spread out'],
        ['reflection', 'the bouncing of a wave off a surface'],
        ['refraction', 'the change in direction when a wave changes speed entering a new medium'],
        ['diffraction', 'the spreading of a wave as it passes through a gap or round an edge'],
        ['the electromagnetic spectrum', 'the family of transverse waves from radio to gamma'],
        ['the normal', 'the line drawn at right angles to a surface at the point a ray meets it'],
        ['the angle of incidence', 'the angle between an incoming ray and the normal'],
        ['the angle of reflection', 'the angle between a reflected ray and the normal'],
        ['ultrasound', 'sound above the range of human hearing, used for imaging'],
        ['an oscillation', 'one complete back-and-forth movement']
      ],
      truths: [
        'Sound is a longitudinal wave; light is a transverse wave.',
        'Waves transfer energy without transferring matter.',
        'The wave equation says speed equals frequency times wavelength.',
        'Refraction happens because the wave changes speed, which changes its direction unless it meets the boundary head-on.',
        'The angle of incidence equals the angle of reflection, measured from the normal.',
        'Diffraction is greatest when the gap is about the same size as the wavelength.'
      ],
      myths: [
        'Sound is a transverse wave.',
        'Waves carry matter along with them.',
        'Light travels faster in glass than in air.',
        'The amplitude of a wave is the distance from crest to trough.',
        'Angles in reflection are measured from the surface rather than the normal.',
        'A wave changes frequency when it enters a new medium.'
      ],
      applications: [
        ['A wave has frequency 50 Hz and wavelength 4 m. Which relationship gives its speed?', 'the wave equation'],
        ['A ray bends towards the normal as it enters glass. What has happened?', 'refraction'],
        ['A sound spreads out after passing through a doorway. Which effect is this?', 'diffraction'],
        ['Particles in a wave vibrate along the direction the wave travels. What kind of wave is it?', 'a longitudinal wave'],
        ['A pulse is sent into the body and its echo is timed to build an image. What is being used?', 'ultrasound']
      ]
    },

    {
      name: 'Electricity and Circuits in Depth', from: 'Grade 9', to: 'College',
      figures: ['circuit'],
      facts: [
        ['current', 'the rate of flow of charge, measured in amperes'],
        ['potential difference', 'the energy transferred per unit charge, measured in volts'],
        ['resistance', 'the opposition to current, measured in ohms'],
        ['Ohm’s law', 'the relationship V = IR for a component at constant temperature'],
        ['a series circuit', 'a circuit with one path, in which current is the same everywhere'],
        ['a parallel circuit', 'a circuit with branches, in which each branch has the full potential difference'],
        ['an ammeter', 'the meter connected in series to measure current'],
        ['a voltmeter', 'the meter connected in parallel to measure potential difference'],
        ['a resistor', 'the component that opposes current in a controlled way'],
        ['a variable resistor', 'the component used to change the current in a circuit'],
        ['an LDR', 'the component whose resistance falls as light intensity rises'],
        ['a thermistor', 'the component whose resistance falls as temperature rises'],
        ['a diode', 'the component that allows current in one direction only'],
        ['charge', 'the quantity measured in coulombs, equal to current times time'],
        ['power', 'the rate of energy transfer, measured in watts'],
        ['the national grid', 'the network of cables and transformers distributing electricity'],
        ['a transformer', 'the device that changes the potential difference of an alternating supply'],
        ['direct current', 'current that flows in one direction only'],
        ['alternating current', 'current that repeatedly reverses direction'],
        ['the live wire', 'the wire carrying the alternating potential difference from the supply'],
        ['the earth wire', 'the safety wire that carries current away if a fault makes a case live'],
        ['a fuse', 'the component that melts and breaks a circuit if the current is too high']
      ],
      truths: [
        'In a series circuit the current is the same at every point.',
        'In a parallel circuit each branch has the full potential difference of the supply.',
        'An ammeter is connected in series and a voltmeter in parallel.',
        'Adding resistors in parallel decreases the total resistance.',
        'The resistance of a thermistor falls as it gets hotter.',
        'The earth wire and the fuse work together: the fuse melts because the earth wire allows a large current to flow.'
      ],
      myths: [
        'Current is used up as it flows around a circuit.',
        'A voltmeter is connected in series with the component it measures.',
        'Adding resistors in parallel increases the total resistance.',
        'The resistance of a thermistor rises as it gets hotter.',
        'Current flows out of both terminals of a cell and meets in the lamp.',
        'A fuse protects the person rather than the wiring.'
      ],
      applications: [
        ['A lamp is dim and the current is the same everywhere in the loop. What kind of circuit is it?', 'a series circuit'],
        ['A component’s resistance drops when a torch is shone on it. What is it?', 'an LDR'],
        ['A meter must be connected across a component, not in line with it. What is it?', 'a voltmeter'],
        ['A metal case becomes live and a large current flows to the ground. Which wire carried it?', 'the earth wire'],
        ['A device converts 230 V to 12 V for a doorbell. What is it?', 'a transformer']
      ]
    },

    {
      name: 'Forces, Motion and Newton’s Laws', from: 'Grade 9', to: 'College',
      figures: ['forces'],
      facts: [
        ['a scalar', 'a quantity with size only, such as speed or mass'],
        ['a vector', 'a quantity with size and direction, such as velocity or force'],
        ['speed', 'the distance travelled per unit time'],
        ['velocity', 'the speed of an object in a stated direction'],
        ['acceleration', 'the rate of change of velocity'],
        ['the resultant force', 'the single force with the same effect as all the forces acting'],
        ['Newton’s first law', 'the rule that an object keeps a constant velocity unless a resultant force acts'],
        ['Newton’s second law', 'the rule that resultant force equals mass times acceleration'],
        ['Newton’s third law', 'the rule that every force has an equal and opposite reaction on another object'],
        ['inertia', 'the tendency of an object to keep doing what it is doing'],
        ['weight', 'the force of gravity on a mass, measured in newtons'],
        ['mass', 'the amount of matter in an object, measured in kilograms'],
        ['friction', 'the force opposing motion between surfaces in contact'],
        ['drag', 'the resistive force on an object moving through a fluid'],
        ['terminal velocity', 'the steady speed reached when drag balances weight'],
        ['momentum', 'the product of mass and velocity'],
        ['conservation of momentum', 'the principle that total momentum is unchanged in a collision'],
        ['thinking distance', 'the distance travelled during the driver’s reaction time'],
        ['braking distance', 'the distance travelled while the brakes are applied'],
        ['stopping distance', 'the sum of the thinking and braking distances'],
        ['a free body diagram', 'the drawing showing every force acting on one object'],
        ['work done', 'force times distance moved in the direction of the force']
      ],
      truths: [
        'An object with no resultant force keeps a constant velocity — which may be zero.',
        'Weight is a force in newtons; mass is a quantity of matter in kilograms.',
        'At terminal velocity the resultant force is zero, so the object is not accelerating.',
        'Newton’s third law pairs act on two different objects, never on the same one.',
        'Momentum is conserved in a collision even when kinetic energy is not.',
        'Doubling the speed roughly quadruples the braking distance.'
      ],
      myths: [
        'A moving object needs a constant force to keep moving.',
        'Weight and mass are the same thing measured in different units.',
        'At terminal velocity the forces are unbalanced but the object stops accelerating.',
        'The action and reaction of Newton’s third law act on the same object and cancel out.',
        'Heavier objects always fall faster than lighter ones.',
        'Doubling the speed doubles the braking distance.'
      ],
      applications: [
        ['A skydiver stops accelerating and falls at a steady speed. What has she reached?', 'terminal velocity'],
        ['A trolley of 2 kg accelerates at 3 m/s². Which law gives the resultant force?', 'Newton’s second law'],
        ['A book rests on a table and pushes down while the table pushes up on the book. Which law is this?', 'Newton’s third law'],
        ['A passenger lurches forward when a bus brakes. Which property explains this?', 'inertia'],
        ['Two trolleys collide and stick together; the total mass times velocity is unchanged. Which principle applies?', 'conservation of momentum']
      ]
    },

    {
      name: 'Energy Stores and Transfers', from: 'Grade 8', to: 'College',
      facts: [
        ['a kinetic energy store', 'the store an object has because it is moving'],
        ['a gravitational potential store', 'the store an object has because of its height'],
        ['an elastic potential store', 'the store in a stretched or compressed spring'],
        ['a thermal store', 'the store associated with the temperature of an object'],
        ['a chemical store', 'the store in fuels, foods and batteries'],
        ['conservation of energy', 'the principle that energy is transferred, never created or destroyed'],
        ['dissipation', 'the spreading of energy to the surroundings, where it is less useful'],
        ['efficiency', 'the fraction of energy transferred usefully'],
        ['power', 'the rate of energy transfer, in watts'],
        ['work done', 'the energy transferred when a force moves an object'],
        ['conduction', 'the transfer of thermal energy through a solid by particle vibration'],
        ['convection', 'the transfer of thermal energy by the movement of a fluid'],
        ['radiation', 'the transfer of energy by infrared waves, needing no material'],
        ['insulation', 'the reduction of unwanted thermal transfer'],
        ['a renewable resource', 'an energy resource that is replaced as fast as it is used'],
        ['a non-renewable resource', 'an energy resource that will run out'],
        ['specific heat capacity', 'the energy needed to raise 1 kg of a substance by 1°C'],
        ['a Sankey diagram', 'the diagram whose arrow widths show energy transfers to scale'],
        ['a lubricant', 'the substance that reduces energy dissipated by friction'],
        ['thermal conductivity', 'the measure of how readily a material conducts thermal energy']
      ],
      truths: [
        'Energy is never created or destroyed, only transferred between stores.',
        'Efficiency can never exceed 100%.',
        'Dissipated energy is not lost — it has spread out and become less useful.',
        'Radiation is the only transfer that works through a vacuum.',
        'Convection happens in fluids because warmer, less dense regions rise.',
        'A material with a high specific heat capacity warms up slowly for a given energy input.'
      ],
      myths: [
        'Energy is used up when a device runs.',
        'A very good machine can be more than 100% efficient.',
        'Convection happens in solids as well as fluids.',
        'Heat rises.',
        'Energy that has been dissipated has been destroyed.',
        'A vacuum flask works by stopping conduction only.'
      ],
      applications: [
        ['A lamp gives out 20 J of light for every 100 J supplied. What is being calculated?', 'efficiency'],
        ['A saucepan handle stays cool while the pan is hot. Which property differs?', 'thermal conductivity'],
        ['Energy reaches the Earth from the Sun across empty space. Which transfer is this?', 'radiation'],
        ['Oil is added to a machine and less energy is wasted. What has been added?', 'a lubricant'],
        ['A ball at the top of a slope has energy because of its height. Which store is this?', 'a gravitational potential store']
      ]
    }
  ]
};
