/* More science, named by the thing being studied.

   Each of these is a unit a syllabus lists by name and a student revises as a
   block — "Waves and the Electromagnetic Spectrum", "Inheritance and Genetic
   Diagrams", "Rates and Collision Theory" — rather than a slice of a subject.
   That matters for finding them as much as for studying them: nobody searches
   for "biology practice". */

export const SCI2_UNITS = {
  biology: [
    {
      name: 'Inheritance and Genetic Diagrams', from: 'Grade 9', to: 'College',
      figures: ['dna'],
      facts: [
        ['a gene', 'a length of DNA coding for a characteristic'],
        ['an allele', 'one version of a gene'],
        ['a genotype', 'the alleles an organism carries'],
        ['a phenotype', 'the characteristics an organism actually shows'],
        ['dominant', 'an allele expressed even when only one copy is present'],
        ['recessive', 'an allele expressed only when two copies are present'],
        ['homozygous', 'carrying two identical alleles'],
        ['heterozygous', 'carrying two different alleles'],
        ['a Punnett square', 'the grid used to predict the offspring of a cross'],
        ['a gamete', 'a sex cell carrying one allele of each gene'],
        ['fertilisation', 'the fusion of two gametes'],
        ['a chromosome', 'a long DNA molecule carrying many genes'],
        ['a carrier', 'someone heterozygous for a recessive condition, showing no symptoms'],
        ['a sex chromosome', 'the X or Y chromosome that determines sex'],
        ['a family tree', 'the diagram tracing a characteristic through generations'],
        ['a mutation', 'a change in the base sequence of DNA'],
        ['cystic fibrosis', 'a condition caused by a recessive allele'],
        ['a probability', 'the chance of an outcome, often expressed as a ratio'],
        ['variation', 'the differences between individuals of a species'],
        ['inherited variation', 'differences passed on from parents']
      ],
      truths: [
        'A carrier is heterozygous and shows no symptoms of a recessive condition.',
        'Two carriers of a recessive condition have a one in four chance of an affected child, each pregnancy.',
        'A Punnett square gives probabilities, not guarantees.',
        'Genotype is the alleles carried; phenotype is what is shown.',
        'Every gamete carries one allele of each gene, not two.'
      ],
      myths: [
        'A one in four chance means exactly one child in four will be affected.',
        'A carrier shows mild symptoms of the condition.',
        'Dominant alleles are always the more common ones in a population.',
        'Genotype and phenotype are two words for the same thing.',
        'A gamete carries a full pair of alleles.'
      ],
      applications: [
        ['Two parents carry a recessive allele and show no symptoms. What are they?', 'a carrier'],
        ['A grid is drawn to predict the offspring of a cross. What is it?', 'a Punnett square'],
        ['An organism has two different alleles of a gene. What is it?', 'heterozygous'],
        ['An allele shows up only when two copies are present. What kind is it?', 'recessive'],
        ['A diagram traces a condition through three generations. What is it?', 'a family tree']
      ]
    },
    {
      name: 'Cell Division: Mitosis and Meiosis', from: 'Grade 9', to: 'College',
      figures: ['animal-cell', 'dna'],
      facts: [
        ['mitosis', 'division producing two identical daughter cells'],
        ['meiosis', 'division producing four gametes with half the chromosomes'],
        ['the cell cycle', 'the sequence of growth, DNA replication and division'],
        ['interphase', 'the stage of growth and DNA replication before division'],
        ['a chromatid', 'one of the two identical copies of a replicated chromosome'],
        ['a centromere', 'the point joining the two chromatids'],
        ['the spindle', 'the fibres that pull chromosomes apart'],
        ['cytokinesis', 'the splitting of the cytoplasm into two cells'],
        ['a diploid cell', 'a cell with two sets of chromosomes'],
        ['a haploid cell', 'a cell with one set of chromosomes'],
        ['a gamete', 'a haploid sex cell'],
        ['a zygote', 'the diploid cell formed at fertilisation'],
        ['crossing over', 'the exchange of sections between paired chromosomes in meiosis'],
        ['independent assortment', 'the random way chromosome pairs line up in meiosis'],
        ['genetic variation', 'the differences meiosis and fertilisation produce'],
        ['a stem cell', 'an undifferentiated cell that can become other cell types'],
        ['differentiation', 'the process by which a cell becomes specialised'],
        ['cancer', 'uncontrolled cell division'],
        ['growth', 'the increase in cell number and size'],
        ['repair', 'the replacement of damaged cells by mitosis']
      ],
      truths: [
        'Mitosis makes two identical cells; meiosis makes four different gametes.',
        'DNA is copied during interphase, before division begins.',
        'Crossing over and independent assortment are why no two gametes are alike.',
        'A zygote is diploid because two haploid gametes fused.',
        'Cancer is uncontrolled mitosis.'
      ],
      myths: [
        'Mitosis produces gametes.',
        'Meiosis makes two identical cells.',
        'DNA is copied during the division itself rather than before it.',
        'Gametes are diploid.',
        'All the cells produced by meiosis are genetically identical.'
      ],
      sequences: [
        ['The cell cycle', [
          'The cell grows and organelles are copied',
          'DNA replicates, making each chromosome two chromatids',
          'Chromosomes line up along the middle of the cell',
          'The spindle pulls the chromatids to opposite ends',
          'The cytoplasm divides, giving two identical cells'
        ]]
      ],
      applications: [
        ['A cell divides to replace damaged skin. Which process is this?', 'mitosis'],
        ['Four cells are produced, each with half the chromosomes. Which process?', 'meiosis'],
        ['Sections are swapped between paired chromosomes. What is this?', 'crossing over'],
        ['Two gametes fuse and the result has a full set of chromosomes. What is it?', 'a zygote'],
        ['Cells divide without the normal controls. What has occurred?', 'cancer']
      ]
    },
    {
      name: 'Disease, Drugs and Drug Development', from: 'Grade 9', to: 'College',
      facts: [
        ['a communicable disease', 'a disease that can be passed between people'],
        ['a non-communicable disease', 'a disease that cannot be caught'],
        ['a risk factor', 'something that increases the chance of a disease'],
        ['a pathogen', 'an organism that causes disease'],
        ['an antibiotic', 'a drug that kills bacteria'],
        ['an antiviral', 'a drug that acts against a virus'],
        ['a painkiller', 'a drug that treats a symptom rather than the cause'],
        ['a vaccine', 'a preparation that produces immunity without the disease'],
        ['a clinical trial', 'the staged testing of a new drug in people'],
        ['a preclinical trial', 'testing on cells and animals before people'],
        ['a placebo', 'an inactive treatment used for comparison'],
        ['a double-blind trial', 'a trial where neither patient nor doctor knows the treatment'],
        ['efficacy', 'whether a drug works'],
        ['toxicity', 'whether a drug does harm'],
        ['dosage', 'the amount of a drug given'],
        ['a side effect', 'an unwanted effect of a treatment'],
        ['peer review', 'the checking of results by other scientists before publication'],
        ['a monoclonal antibody', 'an antibody produced from identical cells to bind one target'],
        ['antibiotic resistance', 'the survival of bacteria that antibiotics no longer kill'],
        ['a lifestyle factor', 'a habit such as diet or smoking that affects disease risk']
      ],
      truths: [
        'Antibiotics kill bacteria and do nothing to viruses.',
        'A new drug is tested for toxicity and dosage before efficacy in patients.',
        'A double-blind trial controls for the expectations of both patient and doctor.',
        'A painkiller treats the symptom, not the cause.',
        'Peer review checks work before publication; it does not guarantee it is right.'
      ],
      myths: [
        'Antibiotics cure the common cold if the dose is high enough.',
        'A new drug is tested on patients first.',
        'A placebo has no measurable effect at all.',
        'A non-communicable disease has no risk factors.',
        'Peer review guarantees a result is correct.'
      ],
      sequences: [
        ['Testing a new drug', [
          'The drug is tested on cells and tissues',
          'It is tested on animals for toxicity and dosage',
          'A small group of healthy volunteers checks safety',
          'A larger group of patients tests whether it works',
          'Results are peer reviewed and published',
          'The drug is licensed and monitored in use'
        ]]
      ],
      applications: [
        ['A patient with flu is given antibiotics and does not improve. Why not?', 'an antibiotic'],
        ['Neither the doctor nor the patient knows who got the real drug. What trial is this?', 'a double-blind trial'],
        ['A drug is tested on cells before any person takes it. What stage is this?', 'a preclinical trial'],
        ['Smoking raises the chance of lung disease. What is smoking here?', 'a risk factor'],
        ['Antibodies are made from identical cells to bind one target. What are they?', 'a monoclonal antibody']
      ]
    }
  ],

  physics: [
    {
      name: 'Waves and the Electromagnetic Spectrum', from: 'Grade 8', to: 'College',
      figures: ['wave'],
      facts: [
        ['the electromagnetic spectrum', 'the family of transverse waves from radio to gamma'],
        ['radio waves', 'the longest wavelength, used for broadcasting'],
        ['microwaves', 'used for cooking and mobile phone signals'],
        ['infrared', 'the radiation felt as heat, used in remote controls'],
        ['visible light', 'the narrow band the eye detects'],
        ['ultraviolet', 'the radiation that causes tanning and skin damage'],
        ['X-rays', 'the radiation used to image bone'],
        ['gamma rays', 'the shortest wavelength, emitted by unstable nuclei'],
        ['wavelength', 'the distance between one wave and the next'],
        ['frequency', 'the number of waves per second'],
        ['the speed of light', 'the speed of all electromagnetic waves in a vacuum'],
        ['ionising radiation', 'radiation energetic enough to knock electrons off atoms'],
        ['absorption', 'the taking in of radiation by a material'],
        ['transmission', 'radiation passing through a material'],
        ['emission', 'the giving out of radiation'],
        ['a black body', 'an object that absorbs and emits radiation perfectly'],
        ['refraction', 'the bending of a wave as it changes speed'],
        ['dispersion', 'the splitting of white light into a spectrum'],
        ['a prism', 'the block that disperses light'],
        ['total internal reflection', 'the effect that keeps light inside an optical fibre']
      ],
      truths: [
        'All electromagnetic waves travel at the same speed in a vacuum.',
        'Shorter wavelength means higher frequency and more energy.',
        'Ultraviolet, X-rays and gamma rays are ionising; visible light is not.',
        'Visible light occupies a very narrow part of the spectrum.',
        'Total internal reflection is what makes optical fibres work.'
      ],
      myths: [
        'Different parts of the electromagnetic spectrum travel at different speeds in a vacuum.',
        'Microwaves work by making food radioactive.',
        'Radio waves are a kind of sound.',
        'Longer wavelength means more energy.',
        'Infrared is the same thing as heat itself.'
      ],
      applications: [
        ['A remote control sends a signal you cannot see. Which radiation?', 'infrared'],
        ['Light stays inside a fibre and follows it round a bend. What effect is this?', 'total internal reflection'],
        ['White light splits into colours through a glass block. What is that block?', 'a prism'],
        ['Radiation knocks electrons off atoms and damages cells. What kind is it?', 'ionising radiation'],
        ['A shorter wavelength carries more energy. Which quantity has risen?', 'frequency']
      ]
    },
    {
      name: 'Electricity at Home and the National Grid', from: 'Grade 9', to: 'College',
      figures: ['circuit'],
      facts: [
        ['mains electricity', 'the alternating supply delivered to homes'],
        ['alternating current', 'current that repeatedly reverses direction'],
        ['direct current', 'current that flows one way only'],
        ['the live wire', 'the wire carrying the alternating potential difference'],
        ['the neutral wire', 'the wire completing the circuit back to the supply'],
        ['the earth wire', 'the safety wire that carries fault current away'],
        ['a fuse', 'the component that melts if the current is too high'],
        ['a circuit breaker', 'the switch that trips on a fault and can be reset'],
        ['double insulation', 'the design that removes the need for an earth wire'],
        ['power', 'the rate of energy transfer, in watts'],
        ['the kilowatt-hour', 'the unit energy is billed in'],
        ['a transformer', 'the device that changes the potential difference of an ac supply'],
        ['a step-up transformer', 'the transformer raising voltage for transmission'],
        ['a step-down transformer', 'the transformer lowering voltage for use'],
        ['the national grid', 'the network of cables and transformers distributing electricity'],
        ['transmission loss', 'the energy wasted heating the transmission cables'],
        ['efficiency', 'the fraction of energy transferred usefully'],
        ['a generator', 'the machine that converts movement into electricity'],
        ['a renewable resource', 'an energy source replaced as fast as it is used'],
        ['base load', 'the minimum demand a grid must always meet']
      ],
      truths: [
        'Electricity is transmitted at high voltage to reduce the current and so the heating loss.',
        'The earth wire and the fuse work together: the fuse melts because the earth wire allows a large current.',
        'A kilowatt-hour is a unit of energy, not of power.',
        'A circuit breaker can be reset; a fuse has to be replaced.',
        'Double-insulated appliances need no earth wire.'
      ],
      myths: [
        'Electricity is transmitted at high voltage because that delivers more power.',
        'A kilowatt-hour measures power.',
        'The earth wire carries current in normal use.',
        'A fuse protects the person using the appliance.',
        'Transformers work on direct current.'
      ],
      applications: [
        ['Voltage is raised before long-distance transmission. Which device?', 'a step-up transformer'],
        ['A fault makes a metal case live and a large current flows away. Which wire?', 'the earth wire'],
        ['An appliance has a plastic case and no earth pin. What design is this?', 'double insulation'],
        ['A bill charges for energy used. Which unit?', 'the kilowatt-hour'],
        ['A safety device trips and is switched back on. What is it?', 'a circuit breaker']
      ]
    },
    {
      name: 'Space, Stars and the Universe', from: 'Grade 8', to: 'College',
      facts: [
        ['a star', 'a ball of gas held together by gravity, fusing hydrogen'],
        ['nuclear fusion', 'the joining of small nuclei that powers a star'],
        ['a protostar', 'the collapsing cloud of gas and dust that becomes a star'],
        ['a main sequence star', 'a star in the stable phase of fusing hydrogen'],
        ['a red giant', 'the swollen phase after hydrogen runs out'],
        ['a white dwarf', 'the dense remnant of a small star'],
        ['a supernova', 'the explosion of a massive star'],
        ['a neutron star', 'the extremely dense remnant of a supernova'],
        ['a black hole', 'a region whose gravity nothing escapes, including light'],
        ['a galaxy', 'a vast collection of stars, gas and dust'],
        ['the Milky Way', 'the galaxy containing the Sun'],
        ['a light year', 'the distance light travels in a year'],
        ['red shift', 'the stretching of light from a receding object'],
        ['the Big Bang', 'the theory that the universe expanded from a hot dense state'],
        ['cosmic microwave background', 'the faint radiation left over from the early universe'],
        ['the expanding universe', 'the observation that galaxies are moving apart'],
        ['a nebula', 'a cloud of gas and dust where stars form'],
        ['gravity', 'the force that pulls matter together and holds orbits'],
        ['an orbit', 'the path of one body around another'],
        ['a satellite', 'an object orbiting a planet']
      ],
      truths: [
        'A light year is a distance, not a time.',
        'Red shift shows that distant galaxies are moving away from us.',
        'The cosmic microwave background is evidence for the Big Bang.',
        'Stars form in nebulae and end differently depending on their mass.',
        'The Sun is a main sequence star and will become a red giant, not a supernova.'
      ],
      myths: [
        'A light year is a very long time.',
        'The Big Bang was an explosion in space rather than an expansion of it.',
        'Every star ends as a black hole.',
        'Red shift means galaxies are getting redder in colour.',
        'The Sun will explode as a supernova.'
      ],
      sequences: [
        ['The life cycle of a star like the Sun', [
          'A nebula of gas and dust collapses under gravity',
          'A protostar forms and heats up',
          'Fusion begins and it becomes a main sequence star',
          'Hydrogen runs low and it swells into a red giant',
          'The outer layers drift away',
          'A white dwarf is left behind'
        ]]
      ],
      applications: [
        ['Light from a distant galaxy is stretched towards the red end. What is this?', 'red shift'],
        ['Faint radiation fills the sky in every direction. What is it?', 'cosmic microwave background'],
        ['A massive star explodes at the end of its life. What is this?', 'a supernova'],
        ['A distance is given as 4.2 of these. What unit is it?', 'a light year'],
        ['A cloud of gas and dust is where new stars form. What is it?', 'a nebula']
      ]
    }
  ],

  chemistry: [
    {
      name: 'Metals, Alloys and Extraction', from: 'Grade 9', to: 'College',
      facts: [
        ['a metal', 'an element that loses electrons to form positive ions'],
        ['metallic bonding', 'the attraction between positive ions and delocalised electrons'],
        ['a delocalised electron', 'the free electron that lets a metal conduct'],
        ['malleable', 'able to be hammered into shape without breaking'],
        ['ductile', 'able to be drawn into a wire'],
        ['an alloy', 'a mixture of a metal with another element'],
        ['steel', 'the alloy of iron with a small amount of carbon'],
        ['brass', 'the alloy of copper and zinc'],
        ['bronze', 'the alloy of copper and tin'],
        ['an ore', 'a rock containing enough of a metal to be worth extracting'],
        ['reduction', 'the removal of oxygen, or the gain of electrons'],
        ['a blast furnace', 'the furnace that reduces iron ore with carbon'],
        ['electrolysis', 'the extraction of a reactive metal using electricity'],
        ['the reactivity series', 'the order of metals by how readily they react'],
        ['a displacement reaction', 'a more reactive metal taking the place of a less reactive one'],
        ['corrosion', 'the gradual destruction of a metal by reaction with its surroundings'],
        ['rusting', 'the corrosion of iron, which needs both water and oxygen'],
        ['galvanising', 'coating iron with zinc to protect it'],
        ['sacrificial protection', 'attaching a more reactive metal so it corrodes instead'],
        ['recycling', 'reprocessing a metal rather than extracting more ore']
      ],
      truths: [
        'Metals are malleable because layers of ions can slide over one another.',
        'Alloys are harder than pure metals because different sized atoms disrupt the layers.',
        'A metal more reactive than carbon must be extracted by electrolysis.',
        'Rusting needs both water and oxygen; either alone will not do it.',
        'Sacrificial protection works because the attached metal is more reactive.'
      ],
      myths: [
        'An alloy is a compound.',
        'Alloys are softer than the pure metal.',
        'Iron rusts in dry air.',
        'Every metal can be extracted by heating its ore with carbon.',
        'Metals conduct because electricity flows through the gaps between atoms.'
      ],
      applications: [
        ['Iron is coated with zinc to stop it rusting. What is this called?', 'galvanising'],
        ['A metal above carbon in the reactivity series must be extracted electrically. Which method?', 'electrolysis'],
        ['Copper and zinc are mixed to make a harder material. What is it?', 'brass'],
        ['A block of magnesium is bolted to a ship’s hull. What is this?', 'sacrificial protection'],
        ['A rock contains enough metal to be worth mining. What is it?', 'an ore']
      ]
    },
    {
      name: 'Energy Changes and Reaction Profiles', from: 'Grade 9', to: 'College',
      facts: [
        ['an exothermic reaction', 'a reaction that transfers energy out, warming the surroundings'],
        ['an endothermic reaction', 'a reaction that takes energy in, cooling the surroundings'],
        ['activation energy', 'the minimum energy a collision needs to react'],
        ['a reaction profile', 'the diagram of energy against progress of reaction'],
        ['bond breaking', 'the endothermic step that requires energy'],
        ['bond making', 'the exothermic step that releases energy'],
        ['bond energy', 'the energy needed to break one mole of a particular bond'],
        ['the overall energy change', 'the difference between energy in and energy out'],
        ['combustion', 'the exothermic reaction of a fuel with oxygen'],
        ['neutralisation', 'the exothermic reaction of an acid with a base'],
        ['thermal decomposition', 'the endothermic breakdown of a compound by heat'],
        ['a catalyst', 'a substance that lowers the activation energy'],
        ['a fuel cell', 'the cell producing electricity from a fuel and oxygen'],
        ['a chemical cell', 'the arrangement producing electricity from a reaction'],
        ['a temperature change', 'the measurable sign of energy transferred'],
        ['a calorimeter', 'the apparatus used to measure energy change'],
        ['an ice pack', 'the everyday use of an endothermic process'],
        ['a hand warmer', 'the everyday use of an exothermic process']
      ],
      truths: [
        'Breaking bonds takes energy in; making bonds gives energy out.',
        'A reaction is exothermic when more energy is released making bonds than used breaking them.',
        'A catalyst lowers the activation energy without changing the overall energy change.',
        'Combustion and neutralisation are both exothermic.',
        'The temperature of the surroundings falls in an endothermic reaction.'
      ],
      myths: [
        'Breaking bonds releases energy.',
        'A catalyst changes how much energy a reaction releases overall.',
        'All reactions are exothermic.',
        'An endothermic reaction feels warm.',
        'Activation energy is the energy a reaction gives out.'
      ],
      applications: [
        ['A pack goes cold when squeezed and mixed. What kind of reaction?', 'an endothermic reaction'],
        ['A substance lowers the energy barrier without being used up. What is it?', 'a catalyst'],
        ['Energy is required to pull two atoms apart. Which step is this?', 'bond breaking'],
        ['A diagram plots energy against progress of reaction. What is it?', 'a reaction profile'],
        ['An acid and an alkali are mixed and the beaker warms. What kind of reaction?', 'an exothermic reaction']
      ]
    }
  ],

  earth: [
    {
      name: 'Weather Systems and Forecasting', from: 'Grade 6', to: 'College',
      figures: ['water-cycle'],
      facts: [
        ['air pressure', 'the weight of the atmosphere pressing down'],
        ['a low pressure system', 'a depression, bringing cloud, rain and wind'],
        ['a high pressure system', 'an anticyclone, bringing settled weather'],
        ['a front', 'the boundary between two air masses'],
        ['a warm front', 'the boundary where warm air rises over cold, bringing steady rain'],
        ['a cold front', 'the boundary where cold air undercuts warm, bringing heavy showers'],
        ['an isobar', 'a line on a chart joining places of equal pressure'],
        ['a millibar', 'the unit of atmospheric pressure'],
        ['humidity', 'the amount of water vapour in the air'],
        ['condensation', 'water vapour turning back to liquid, forming cloud'],
        ['precipitation', 'water falling from cloud as rain, snow or hail'],
        ['relief rainfall', 'rain caused by air being forced over high ground'],
        ['convectional rainfall', 'rain caused by warm ground heating rising air'],
        ['frontal rainfall', 'rain caused by warm air rising over cold at a front'],
        ['a synoptic chart', 'the weather map showing pressure, fronts and winds'],
        ['a forecast', 'a prediction of what the weather will do'],
        ['a weather station', 'the site where conditions are measured'],
        ['a Stevenson screen', 'the louvred box housing thermometers'],
        ['prevailing wind', 'the direction wind most often comes from'],
        ['the jet stream', 'the fast high-altitude wind that steers weather systems']
      ],
      truths: [
        'Isobars close together mean strong winds.',
        'Low pressure brings unsettled weather and high pressure settled weather.',
        'Relief, convectional and frontal rainfall are three different causes of the same result.',
        'A forecast is a probability, so it can be right in method and wrong in outcome.',
        'The jet stream steers weather systems across the Atlantic.'
      ],
      myths: [
        'Isobars close together mean heavy rain.',
        'High pressure always means hot weather.',
        'All rain has the same cause.',
        'A wrong forecast means the science is wrong.',
        'A Stevenson screen is there to keep the thermometer warm.'
      ],
      applications: [
        ['Lines on a chart are packed closely together. What does that mean?', 'an isobar'],
        ['Warm air is forced up over a mountain and it rains on the near side. What kind of rainfall?', 'relief rainfall'],
        ['A boundary brings heavy showers as cold air undercuts warm. Which front?', 'a cold front'],
        ['Settled, dry weather sits over a region for a week. Which system?', 'a high pressure system'],
        ['A fast wind high in the atmosphere steers storms eastwards. What is it?', 'the jet stream']
      ]
    }
  ],

  method: [
    {
      name: 'Practical Skills and Required Experiments', from: 'Grade 7', to: 'College',
      facts: [
        ['an independent variable', 'the variable the experimenter changes'],
        ['a dependent variable', 'the variable measured'],
        ['a control variable', 'a variable deliberately kept the same'],
        ['a fair test', 'a test where only the independent variable changes'],
        ['a hypothesis', 'a testable prediction with a reason'],
        ['accuracy', 'how close a measurement is to the true value'],
        ['precision', 'how close repeated measurements are to each other'],
        ['resolution', 'the smallest change an instrument can show'],
        ['repeatability', 'getting the same result yourself with the same method'],
        ['reproducibility', 'someone else getting the same result with a different method'],
        ['an anomalous result', 'a measurement that does not fit the pattern'],
        ['a systematic error', 'an error that shifts every reading the same way'],
        ['a random error', 'an error that scatters readings either side of the true value'],
        ['zero error', 'the systematic error of an instrument that does not read zero'],
        ['a range', 'the span of values tested'],
        ['an interval', 'the gap between values tested'],
        ['a line of best fit', 'the line drawn through the trend of the points'],
        ['a risk assessment', 'the identification of hazards and how to reduce them'],
        ['a hazard', 'something with the potential to cause harm'],
        ['a control experiment', 'the run without the factor being tested']
      ],
      truths: [
        'Accuracy and precision are different: readings can be precise and consistently wrong.',
        'A systematic error shifts every reading the same way and repeating will not reveal it.',
        'An anomalous result should be investigated, not silently dropped.',
        'Repeatability is you getting the same answer; reproducibility is someone else doing so.',
        'A control experiment is what makes the comparison meaningful.'
      ],
      myths: [
        'Accurate and precise mean the same thing.',
        'Repeating a measurement removes a systematic error.',
        'An anomalous result should always be deleted.',
        'A line of best fit must pass through every point.',
        'A risk assessment is paperwork with no effect on how you work.'
      ],
      applications: [
        ['A balance reads 0.2 g with nothing on it. What kind of error is that?', 'zero error'],
        ['Five readings agree closely with each other but not with the true value. What is high?', 'precision'],
        ['One point lies far off the trend. What is it?', 'an anomalous result'],
        ['A second team repeats the work with different apparatus and agrees. What has been shown?', 'reproducibility'],
        ['A run is done without the enzyme, for comparison. What is it?', 'a control experiment']
      ]
    }
  ]
};
