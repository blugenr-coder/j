/* Elementary school: Grades 1 to 5.

   A coverage check across subject × level showed the real hole in the library.
   Foundation stops at Grade 3 and secondary starts at Grade 6, so Grades 1–5
   had early-years counting and almost nothing else: science, English and
   social studies were close to empty for five whole school years, in the band
   where most children actually are.

   These are the units a primary scheme of work is built from. The wording is
   pitched at the year the unit starts, not the year it ends, and the myth
   banks hold what children of that age genuinely get wrong — that the Sun goes
   round the Earth, that a heavier object falls faster, that a whale is a fish. */

export const ELEM_UNITS = {
  /* ================================= science ================================= */
  biology: [
    {
      name: 'Living Things and Life Processes', from: 'Grade 1', to: 'Grade 5',
      kind: 'early', noun: 'word',
      facts: [
        ['living', 'something that grows, feeds and reproduces'],
        ['non-living', 'something that has never been alive'],
        ['a plant', 'a living thing that makes its own food using light'],
        ['an animal', 'a living thing that has to eat other living things'],
        ['growth', 'getting bigger over time'],
        ['reproduction', 'making more of the same kind of living thing'],
        ['movement', 'changing position, which all living things do in some way'],
        ['feeding', 'taking in what a living thing needs to stay alive'],
        ['breathing', 'taking in air'],
        ['a habitat', 'the place where a living thing lives'],
        ['a mammal', 'an animal with fur that feeds its young on milk'],
        ['a bird', 'an animal with feathers that lays eggs'],
        ['a fish', 'an animal with gills that lives in water'],
        ['a reptile', 'an animal with dry scaly skin'],
        ['an amphibian', 'an animal that lives partly in water and partly on land'],
        ['an insect', 'a small animal with six legs and three body parts'],
        ['a life cycle', 'the stages a living thing goes through from birth to adult'],
        ['a seed', 'the part of a plant that a new plant grows from'],
        ['a root', 'the part of a plant that takes in water'],
        ['a leaf', 'the part of a plant that catches light']
      ],
      truths: [
        'All living things grow, feed and make more of their own kind.',
        'A whale is a mammal, not a fish, because it feeds its young on milk.',
        'Plants are living things even though they do not move about.',
        'A bat is a mammal even though it can fly.',
        'An insect has six legs, so a spider is not an insect.'
      ],
      myths: [
        'A whale is a fish because it lives in the sea.',
        'Plants are not living things because they stay in one place.',
        'A bat is a bird because it flies.',
        'A spider is an insect.',
        'Something that moves must be alive.'
      ],
      sequences: [
        ['The life cycle of a butterfly', [
          'An egg is laid on a leaf',
          'A caterpillar hatches and eats',
          'The caterpillar forms a chrysalis',
          'The butterfly develops inside',
          'The adult butterfly comes out'
        ]],
        ['How a seed becomes a plant', [
          'The seed takes in water',
          'A root grows down into the soil',
          'A shoot grows up towards the light',
          'The first leaves open',
          'The plant grows taller and makes flowers'
        ]]
      ]
    },
    {
      name: 'Plants: Parts, Needs and Growth', from: 'Grade 1', to: 'Grade 5',
      figures: ['flower', 'leaf'],
      kind: 'early', noun: 'part',
      facts: [
        ['a root', 'the part that holds a plant in the soil and takes in water'],
        ['a stem', 'the part that holds the plant up and carries water'],
        ['a leaf', 'the part that catches sunlight to make food'],
        ['a flower', 'the part that makes seeds'],
        ['a petal', 'the coloured part of a flower that attracts insects'],
        ['a seed', 'the part a new plant grows from'],
        ['a bud', 'the part that opens into a leaf or a flower'],
        ['pollen', 'the powder a flower needs to make seeds'],
        ['pollination', 'moving pollen from one flower to another'],
        ['a bee', 'the insect that carries pollen between flowers'],
        ['sunlight', 'what a plant needs to make its food'],
        ['water', 'what a plant takes in through its roots'],
        ['air', 'what a plant takes in through its leaves'],
        ['soil', 'what holds a plant up and provides minerals'],
        ['a fruit', 'the part that grows around a seed'],
        ['germination', 'the moment a seed starts to grow'],
        ['a deciduous tree', 'a tree that loses its leaves in autumn'],
        ['an evergreen tree', 'a tree that keeps its leaves all year']
      ],
      truths: [
        'Plants make their own food using sunlight.',
        'Roots take in water from the soil.',
        'A flower makes seeds so new plants can grow.',
        'Bees help plants by carrying pollen from flower to flower.',
        'A seed needs water and warmth to start growing.'
      ],
      myths: [
        'Plants get their food from the soil through their roots.',
        'A plant will grow just as well in a dark cupboard.',
        'Leaves are only there to make a plant look nice.',
        'A seed needs sunlight before it can start to grow.',
        'All trees lose their leaves in autumn.'
      ]
    },
    {
      name: 'Animals, Food Chains and Habitats', from: 'Grade 2', to: 'Grade 5',
      kind: 'early', noun: 'word',
      facts: [
        ['a habitat', 'the place where an animal lives'],
        ['a food chain', 'the order of who eats what'],
        ['a producer', 'a plant, which makes its own food'],
        ['a consumer', 'an animal, which eats other living things'],
        ['a herbivore', 'an animal that eats only plants'],
        ['a carnivore', 'an animal that eats only other animals'],
        ['an omnivore', 'an animal that eats both plants and animals'],
        ['a predator', 'an animal that hunts other animals'],
        ['prey', 'an animal that is hunted'],
        ['a decomposer', 'a living thing that breaks down dead material'],
        ['a rainforest', 'a hot, wet habitat with many kinds of living thing'],
        ['a desert', 'a very dry habitat'],
        ['the ocean', 'the largest habitat on Earth'],
        ['a pond', 'a small freshwater habitat'],
        ['a woodland', 'a habitat made of trees'],
        ['camouflage', 'colouring that helps an animal hide'],
        ['migration', 'moving to another place for part of the year'],
        ['hibernation', 'sleeping through the winter'],
        ['adaptation', 'a feature that helps a living thing survive where it lives']
      ],
      truths: [
        'A food chain always starts with a plant.',
        'A predator hunts, and its prey is hunted.',
        'A polar bear has thick fur because it lives where it is very cold.',
        'Camouflage helps an animal hide from predators.',
        'Some birds migrate in autumn and come back in spring.'
      ],
      myths: [
        'A food chain starts with the biggest animal.',
        'All animals that eat meat are dangerous to people.',
        'An animal can live in any habitat if it is given food.',
        'Hibernating animals wake up every day to eat.',
        'Camouflage means an animal changes colour whenever it wants.'
      ],
      sequences: [
        ['A food chain in a field', [
          'Grass makes its own food using sunlight',
          'A rabbit eats the grass',
          'A fox eats the rabbit',
          'The fox dies and decomposers break it down',
          'Nutrients go back into the soil for the grass'
        ]]
      ]
    },
    {
      name: 'The Human Body for Younger Learners', from: 'Grade 2', to: 'Grade 5',
      figures: ['heart', 'digestive'],
      kind: 'early', noun: 'part',
      facts: [
        ['the skeleton', 'all the bones in the body'],
        ['a bone', 'a hard part that supports the body'],
        ['a muscle', 'the part that pulls a bone to make it move'],
        ['the skull', 'the bone that protects the brain'],
        ['the ribs', 'the bones that protect the heart and lungs'],
        ['the spine', 'the row of bones down the back'],
        ['the heart', 'the muscle that pumps blood around the body'],
        ['blood', 'the liquid that carries oxygen and food around the body'],
        ['the lungs', 'the parts used for breathing'],
        ['the brain', 'the part that controls the body and lets you think'],
        ['the stomach', 'the part where food is broken down'],
        ['teeth', 'the parts used to bite and chew'],
        ['an incisor', 'a front tooth used for cutting'],
        ['a molar', 'a back tooth used for grinding'],
        ['the senses', 'sight, hearing, smell, taste and touch'],
        ['a joint', 'the place where two bones meet'],
        ['exercise', 'activity that keeps the heart and muscles strong'],
        ['a balanced diet', 'eating the right amounts of different foods']
      ],
      truths: [
        'Muscles pull on bones to make them move.',
        'The ribs protect the heart and lungs.',
        'The heart is a muscle that never stops working.',
        'Molars are at the back and are used for grinding food.',
        'Exercise makes the heart stronger.'
      ],
      myths: [
        'Muscles push bones as well as pulling them.',
        'The heart is on the far left of the chest.',
        'You use your stomach to breathe.',
        'All teeth do the same job.',
        'Bones are completely solid all the way through.'
      ]
    }
  ],

  chemistry: [
    {
      name: 'Materials and Their Properties', from: 'Grade 1', to: 'Grade 5',
      kind: 'early', noun: 'material',
      facts: [
        ['wood', 'a material that comes from trees'],
        ['metal', 'a hard, shiny material that conducts heat'],
        ['plastic', 'a light material that can be moulded into shapes'],
        ['glass', 'a hard, see-through material'],
        ['fabric', 'a material woven from threads'],
        ['rubber', 'a bendy material that grips'],
        ['paper', 'a material made from wood pulp'],
        ['stone', 'a hard natural material'],
        ['hard', 'a material that is difficult to squash'],
        ['soft', 'a material that squashes easily'],
        ['transparent', 'a material you can see straight through'],
        ['opaque', 'a material you cannot see through at all'],
        ['flexible', 'a material that bends without breaking'],
        ['rigid', 'a material that does not bend'],
        ['waterproof', 'a material that does not let water through'],
        ['absorbent', 'a material that soaks up water'],
        ['magnetic', 'a material attracted to a magnet'],
        ['recycling', 'making new things from used materials'],
        ['a property', 'something you can say about what a material is like']
      ],
      truths: [
        'A material is chosen for an object because of its properties.',
        'Glass is used for windows because it is transparent.',
        'Not all metals are magnetic — aluminium is not.',
        'A material can be both hard and brittle.',
        'Recycling turns used materials into new objects.'
      ],
      myths: [
        'All metals are attracted to a magnet.',
        'Every hard material is also heavy.',
        'A material that is see-through must be glass.',
        'Wood is a man-made material.',
        'Something waterproof must also be hard.'
      ]
    },
    {
      name: 'Solids, Liquids and Gases', from: 'Grade 2', to: 'Grade 5',
      kind: 'early', noun: 'word',
      facts: [
        ['a solid', 'something that keeps its own shape'],
        ['a liquid', 'something that flows and takes the shape of its container'],
        ['a gas', 'something that spreads out to fill all the space it can'],
        ['melting', 'a solid turning into a liquid when heated'],
        ['freezing', 'a liquid turning into a solid when cooled'],
        ['evaporation', 'a liquid turning into a gas'],
        ['condensation', 'a gas turning back into a liquid'],
        ['boiling', 'a liquid turning to gas quickly, throughout the liquid'],
        ['a thermometer', 'the tool that measures temperature'],
        ['temperature', 'how hot or cold something is'],
        ['ice', 'the solid form of water'],
        ['steam', 'water in the form of a gas'],
        ['the water cycle', 'the way water moves between the sea, the sky and the land'],
        ['a mixture', 'two or more things stirred together'],
        ['dissolving', 'a solid disappearing into a liquid'],
        ['a solution', 'what you get when something dissolves'],
        ['filtering', 'separating a solid from a liquid using a filter'],
        ['sieving', 'separating pieces by size']
      ],
      truths: [
        'Water freezes at 0°C and boils at 100°C.',
        'A gas spreads out to fill whatever container it is in.',
        'When sugar dissolves it is still there, just spread through the water.',
        'Melting and freezing are opposites.',
        'Condensation is what makes a cold window go misty.'
      ],
      myths: [
        'When sugar dissolves it disappears and is gone.',
        'A gas keeps its own shape like a solid.',
        'Melting and dissolving are the same thing.',
        'Steam is the white cloud you can see above a kettle.',
        'Water freezes at 100°C.'
      ],
      sequences: [
        ['Water going round the water cycle', [
          'The Sun warms water in the sea',
          'The water evaporates and rises as a gas',
          'High up it cools and condenses into clouds',
          'Drops join together and fall as rain',
          'The rain runs back into rivers and the sea'
        ]]
      ]
    }
  ],

  physics: [
    {
      name: 'Forces, Magnets and Movement', from: 'Grade 2', to: 'Grade 5',
      figures: ['forces'],
      kind: 'early', noun: 'word',
      facts: [
        ['a force', 'a push or a pull'],
        ['a push', 'a force that moves something away'],
        ['a pull', 'a force that moves something towards you'],
        ['gravity', 'the force that pulls everything towards the Earth'],
        ['weight', 'the pull of gravity on an object'],
        ['friction', 'the force that slows things down when surfaces rub'],
        ['air resistance', 'the force of air pushing against a moving object'],
        ['water resistance', 'the force of water pushing against a moving object'],
        ['a magnet', 'an object that attracts iron and steel'],
        ['a magnetic pole', 'one of the two ends of a magnet'],
        ['attract', 'to pull towards'],
        ['repel', 'to push away'],
        ['iron', 'a metal that magnets attract'],
        ['a lever', 'a bar that turns on a pivot to make a job easier'],
        ['a pulley', 'a wheel with a rope, used to lift things'],
        ['a gear', 'a toothed wheel that turns another wheel'],
        ['speed', 'how fast something moves'],
        ['a surface', 'the outside of something, which affects how much it grips']
      ],
      truths: [
        'A force is a push or a pull.',
        'Opposite poles of two magnets attract and like poles repel.',
        'Friction is greater on a rough surface than a smooth one.',
        'Gravity pulls everything towards the centre of the Earth.',
        'A heavier object does not fall faster than a lighter one if air resistance is the same.'
      ],
      myths: [
        'A heavier object always falls faster than a lighter one.',
        'Two north poles of a magnet attract each other.',
        'Magnets attract all metals.',
        'There is no gravity in space at all.',
        'Friction is always a nuisance and never useful.'
      ]
    },
    {
      name: 'Light, Sound and Electricity', from: 'Grade 3', to: 'Grade 6',
      figures: ['circuit'],
      kind: 'early', noun: 'word',
      facts: [
        ['light', 'what lets us see'],
        ['a light source', 'something that makes its own light'],
        ['a shadow', 'the dark shape made when light is blocked'],
        ['reflection', 'light bouncing off a surface'],
        ['a mirror', 'a surface that reflects light clearly'],
        ['transparent', 'letting light straight through'],
        ['translucent', 'letting some light through'],
        ['opaque', 'blocking light completely'],
        ['sound', 'what we hear, made by something vibrating'],
        ['a vibration', 'a fast back-and-forth movement'],
        ['pitch', 'how high or low a sound is'],
        ['volume', 'how loud a sound is'],
        ['an ear', 'the part of the body that detects sound'],
        ['a circuit', 'a complete loop that electricity can flow around'],
        ['a cell', 'the part of a circuit that pushes the electricity'],
        ['a bulb', 'the part of a circuit that lights up'],
        ['a switch', 'the part that opens or closes a circuit'],
        ['a wire', 'the part that carries electricity'],
        ['a conductor', 'a material that lets electricity through'],
        ['an insulator', 'a material that does not let electricity through']
      ],
      truths: [
        'A shadow is made when an object blocks the light.',
        'Sound is made by something vibrating.',
        'A circuit must be a complete loop for a bulb to light.',
        'The Moon does not make its own light — it reflects the Sun’s.',
        'Metal is a conductor and plastic is an insulator.'
      ],
      myths: [
        'The Moon makes its own light.',
        'A bulb will light in a circuit with a gap in it.',
        'Sound travels faster than light.',
        'Your eyes send out light so that you can see.',
        'A shadow is a reflection of an object.'
      ]
    },
    {
      name: 'Earth, Sun and Space for Younger Learners', from: 'Grade 3', to: 'Grade 6',
      figures: ['earth-layers'],
      kind: 'early', noun: 'word',
      facts: [
        ['the Sun', 'the star at the centre of our solar system'],
        ['the Earth', 'the planet we live on'],
        ['the Moon', 'the object that orbits the Earth'],
        ['a planet', 'a large object that orbits a star'],
        ['a star', 'a huge ball of hot gas that makes its own light'],
        ['an orbit', 'the path one object takes around another'],
        ['a day', 'the time the Earth takes to spin once'],
        ['a year', 'the time the Earth takes to go round the Sun once'],
        ['rotation', 'spinning on the spot'],
        ['a season', 'one of the four parts of the year'],
        ['the solar system', 'the Sun and everything that orbits it'],
        ['Mercury', 'the planet closest to the Sun'],
        ['Jupiter', 'the largest planet'],
        ['Saturn', 'the planet best known for its rings'],
        ['a satellite', 'an object that orbits a planet'],
        ['an astronaut', 'a person who travels into space'],
        ['a telescope', 'the instrument used to see distant objects'],
        ['a phase of the Moon', 'how much of the lit Moon we can see']
      ],
      truths: [
        'The Earth goes round the Sun once a year.',
        'Day and night happen because the Earth spins.',
        'The Moon orbits the Earth.',
        'The Sun is a star.',
        'The Moon looks different through the month because of how much of its lit side we can see.'
      ],
      myths: [
        'The Sun goes round the Earth.',
        'Day and night happen because the Earth goes round the Sun.',
        'The Moon changes shape as it moves.',
        'The Sun is a planet.',
        'Seasons happen because the Earth gets closer to the Sun in summer.'
      ],
      sequences: [
        ['Why we have day and night', [
          'The Earth spins on its axis',
          'The side facing the Sun is lit',
          'That side has daytime',
          'The Earth keeps turning',
          'That side turns away from the Sun and has night'
        ]]
      ]
    }
  ],

  method: [
    {
      name: 'Working Scientifically in Primary School', from: 'Grade 2', to: 'Grade 6',
      kind: 'early', noun: 'word',
      facts: [
        ['a question', 'what a scientist is trying to find out'],
        ['a prediction', 'what you think will happen, and why'],
        ['a fair test', 'a test where you change only one thing'],
        ['a variable', 'something in a test that could change'],
        ['observing', 'looking carefully and recording what you see'],
        ['measuring', 'finding out how much or how many'],
        ['a result', 'what actually happened'],
        ['a conclusion', 'what the results tell you'],
        ['equipment', 'the things used to carry out a test'],
        ['a ruler', 'the tool used to measure length'],
        ['a stopwatch', 'the tool used to measure time'],
        ['a thermometer', 'the tool used to measure temperature'],
        ['a measuring cylinder', 'the tool used to measure liquid'],
        ['a table', 'a way of recording results in rows and columns'],
        ['a bar chart', 'a way of showing results with bars'],
        ['a repeat', 'doing a test again to check the result'],
        ['an anomaly', 'a result that does not fit the pattern'],
        ['evidence', 'the results used to support a conclusion']
      ],
      truths: [
        'In a fair test you change only one thing and keep everything else the same.',
        'Repeating a test helps you spot a result that went wrong.',
        'A prediction should say what you think will happen and why.',
        'A conclusion has to be based on the results, not on what you hoped.',
        'A result that does not fit the pattern is worth checking, not ignoring.'
      ],
      myths: [
        'A test is fair as long as you are careful.',
        'If a result is surprising you should leave it out.',
        'A prediction is a guess with no reason behind it.',
        'One measurement is enough to be sure.',
        'The conclusion is whatever you expected before you started.'
      ],
      sequences: [
        ['Carrying out a fair test', [
          'Ask a question you can test',
          'Make a prediction and say why',
          'Decide what to change and what to keep the same',
          'Carry out the test and record the results',
          'Repeat the test to check',
          'Write a conclusion based on the results'
        ]]
      ]
    }
  ],

  /* ============================== english / ela ============================== */
  grammar: [
    {
      name: 'Sentences, Capitals and Full Stops', from: 'Grade 1', to: 'Grade 4',
      kind: 'early', noun: 'word',
      facts: [
        ['a sentence', 'a group of words that makes sense on its own'],
        ['a capital letter', 'the big letter that starts a sentence'],
        ['a full stop', 'the mark that ends a sentence'],
        ['a question mark', 'the mark that ends a question'],
        ['an exclamation mark', 'the mark that shows surprise'],
        ['a noun', 'a word for a person, place or thing'],
        ['a verb', 'a word for something you do'],
        ['an adjective', 'a word that describes a noun'],
        ['a proper noun', 'the name of a particular person or place'],
        ['a comma', 'the mark that separates items in a list'],
        ['and', 'the word that joins two ideas'],
        ['but', 'the word that shows a contrast'],
        ['because', 'the word that gives a reason'],
        ['a statement', 'a sentence that tells you something'],
        ['a question', 'a sentence that asks something'],
        ['a command', 'a sentence that tells you to do something'],
        ['a plural', 'the form of a word for more than one'],
        ['a singular', 'the form of a word for just one']
      ],
      truths: [
        'Every sentence starts with a capital letter.',
        'The name of a person or place always starts with a capital letter.',
        'A question ends with a question mark, not a full stop.',
        'A sentence needs a verb.',
        'Commas separate the items in a list.'
      ],
      myths: [
        'Only the first word of a paragraph needs a capital letter.',
        'A sentence can be any group of words at all.',
        'Every sentence ends with a full stop, even a question.',
        'A noun is any long word.',
        'You use a capital letter for every important word.'
      ]
    },
    {
      name: 'Word Classes and Simple Punctuation', from: 'Grade 3', to: 'Grade 6',
      facts: [
        ['a noun', 'a word naming a person, place or thing'],
        ['a common noun', 'an ordinary naming word, such as dog'],
        ['a proper noun', 'the name of a particular person or place'],
        ['a collective noun', 'a word for a group, such as flock'],
        ['a verb', 'a word for an action or a state'],
        ['an adjective', 'a word describing a noun'],
        ['an adverb', 'a word describing a verb, often ending in -ly'],
        ['a pronoun', 'a word used instead of a noun, such as she'],
        ['a preposition', 'a word showing position or time, such as under'],
        ['a conjunction', 'a word joining parts of a sentence'],
        ['a determiner', 'a word before a noun, such as the or some'],
        ['an apostrophe', 'the mark showing possession or a missing letter'],
        ['speech marks', 'the marks around what someone says'],
        ['a comma in a list', 'the mark separating items'],
        ['a subject', 'who or what the sentence is about'],
        ['a compound sentence', 'two sentences joined with and, but or so'],
        ['a prefix', 'a part added to the start of a word'],
        ['a suffix', 'a part added to the end of a word'],
        ['a synonym', 'a word meaning nearly the same'],
        ['an antonym', 'a word meaning the opposite']
      ],
      truths: [
        'An adverb usually describes a verb, and many end in -ly.',
        'A pronoun stands in place of a noun so you do not repeat it.',
        'An apostrophe can show possession or a missing letter, and these are different jobs.',
        'A conjunction joins parts of a sentence together.',
        '"Quick" is an adjective and "quickly" is an adverb.'
      ],
      myths: [
        'Any word ending in -ly is an adverb.',
        'An adjective describes a verb.',
        'An apostrophe is used to make a word plural.',
        'A pronoun is a small noun.',
        'Every long sentence is a compound sentence.'
      ],
      applications: [
        ['"She ran quickly." Which word describes how she ran?', 'an adverb'],
        ['"Paris" needs a capital letter. What kind of noun is it?', 'a proper noun'],
        ['"The dog’s bowl" shows the bowl belongs to the dog. Which mark did that?', 'an apostrophe'],
        ['"I was tired so I went to bed." Which word joins the two parts?', 'a conjunction'],
        ['"Happy" and "cheerful" mean nearly the same. What are they?', 'a synonym']
      ]
    }
  ],

  reading: [
    {
      name: 'Reading Comprehension: Stories', from: 'Grade 2', to: 'Grade 5',
      kind: 'early', noun: 'word',
      facts: [
        ['a character', 'a person or animal in a story'],
        ['a setting', 'where and when a story takes place'],
        ['a plot', 'what happens in a story'],
        ['the beginning', 'the part that introduces the characters and setting'],
        ['the middle', 'the part where a problem happens'],
        ['the ending', 'the part where the problem is sorted out'],
        ['a problem', 'the thing that goes wrong in a story'],
        ['a solution', 'how the problem is solved'],
        ['a title', 'the name of a story or book'],
        ['an author', 'the person who wrote a book'],
        ['an illustrator', 'the person who drew the pictures'],
        ['fiction', 'a story that is made up'],
        ['non-fiction', 'writing about real things'],
        ['a fable', 'a short story with a lesson, often with animals'],
        ['a moral', 'the lesson a story teaches'],
        ['a prediction', 'a guess about what will happen next, based on clues'],
        ['a clue', 'something in the text that helps you work something out'],
        ['a fact', 'something that can be checked and shown to be true'],
        ['an opinion', 'what somebody thinks']
      ],
      truths: [
        'The setting is where and when a story happens.',
        'A prediction about a story should be based on clues in the text.',
        'A fact can be checked; an opinion is what somebody thinks.',
        'A fable usually ends with a lesson.',
        'The author writes the words and the illustrator draws the pictures.'
      ],
      myths: [
        'The setting means the same as the plot.',
        'A prediction is just a wild guess.',
        'If a sentence sounds confident it must be a fact.',
        'Non-fiction books never have pictures.',
        'The author draws the pictures as well as writing the words.'
      ]
    },
    {
      name: 'Reading for Information', from: 'Grade 3', to: 'Grade 6',
      facts: [
        ['a heading', 'the title of a section'],
        ['a subheading', 'a smaller heading inside a section'],
        ['a caption', 'the words that explain a picture'],
        ['a contents page', 'the list at the front showing where things are'],
        ['an index', 'the alphabetical list at the back'],
        ['a glossary', 'the list explaining difficult words'],
        ['a diagram', 'a labelled drawing that explains something'],
        ['a label', 'a word naming part of a diagram'],
        ['skimming', 'reading quickly to get the general idea'],
        ['scanning', 'looking for one particular piece of information'],
        ['a keyword', 'the important word you search for'],
        ['a summary', 'the main points in a few words'],
        ['a fact', 'something that can be checked'],
        ['an opinion', 'what somebody thinks'],
        ['a source', 'where information came from'],
        ['a reliable source', 'a source you have good reason to trust'],
        ['alphabetical order', 'the order used in a dictionary or index'],
        ['a dictionary', 'the book that tells you what a word means'],
        ['a bullet point', 'one item in a list marked with a dot']
      ],
      truths: [
        'The index is at the back and the contents page is at the front.',
        'Scanning means looking for one thing; skimming means getting the gist.',
        'A glossary explains the difficult words used in a book.',
        'Not everything written down is a fact.',
        'A summary keeps the main points and leaves out the detail.'
      ],
      myths: [
        'The contents page and the index are the same thing.',
        'Everything printed in a book is true.',
        'Skimming means reading every word very fast.',
        'A caption is the title of the whole page.',
        'A summary should include everything so nothing is lost.'
      ],
      applications: [
        ['You want to find the one page that mentions volcanoes. Which part of the book?', 'an index'],
        ['You read quickly to see whether a page is useful. What are you doing?', 'skimming'],
        ['"Chocolate is the best food." Can this be checked?', 'an opinion'],
        ['A hard word is explained at the back of the book. Which list is that?', 'a glossary'],
        ['A drawing has words pointing at its parts. What are those words?', 'a label']
      ]
    }
  ],

  writing: [
    {
      name: 'Writing a Paragraph and a Story', from: 'Grade 2', to: 'Grade 5',
      facts: [
        ['a paragraph', 'a group of sentences about one idea'],
        ['a topic sentence', 'the sentence that says what a paragraph is about'],
        ['planning', 'deciding what to write before you write it'],
        ['a draft', 'a first version of a piece of writing'],
        ['editing', 'improving what you have written'],
        ['proofreading', 'checking for mistakes in spelling and punctuation'],
        ['an opening', 'the beginning that makes someone want to read on'],
        ['an ending', 'the part that finishes the piece properly'],
        ['a description', 'writing that says what something is like'],
        ['an adjective', 'a describing word'],
        ['a time connective', 'a word like first, next or finally'],
        ['a story map', 'a plan showing what happens in order'],
        ['dialogue', 'the words characters say'],
        ['speech marks', 'the punctuation around spoken words'],
        ['a new line for a new speaker', 'the rule for setting out dialogue'],
        ['handwriting', 'forming letters clearly'],
        ['a purpose', 'what a piece of writing is for'],
        ['an audience', 'who a piece of writing is for']
      ],
      truths: [
        'A paragraph is about one idea, and a new idea needs a new paragraph.',
        'When a new person speaks, you start a new line.',
        'Editing changes the writing; proofreading only corrects mistakes.',
        'Planning before writing usually makes the writing better.',
        'Who you are writing for changes how you write.'
      ],
      myths: [
        'A paragraph is a fixed number of sentences long.',
        'Longer sentences are always better.',
        'Editing and proofreading are the same thing.',
        'You should never plan because it takes too long.',
        'You keep dialogue on the same line however many people speak.'
      ]
    }
  ],

  /* ============================= social studies ============================= */
  geography: [
    {
      name: 'Maps, Globes and Where We Live', from: 'Grade 1', to: 'Grade 5',
      kind: 'early', noun: 'word',
      facts: [
        ['a map', 'a drawing of a place from above'],
        ['a globe', 'a model of the Earth'],
        ['a key', 'the part of a map that explains the symbols'],
        ['a symbol', 'a small picture standing for something on a map'],
        ['a compass', 'the tool that shows direction'],
        ['north', 'the direction at the top of most maps'],
        ['south', 'the direction opposite north'],
        ['east', 'the direction the Sun rises'],
        ['west', 'the direction the Sun sets'],
        ['a continent', 'one of the seven great land areas'],
        ['an ocean', 'one of the great areas of salt water'],
        ['a country', 'a land with its own government'],
        ['a city', 'a very large town'],
        ['a village', 'a small settlement'],
        ['a river', 'water flowing to the sea'],
        ['a mountain', 'very high ground'],
        ['an island', 'land with water all around it'],
        ['a coast', 'where the land meets the sea'],
        ['an aerial photograph', 'a picture taken from above'],
        ['a scale', 'what tells you how far a distance on a map really is']
      ],
      truths: [
        'North is usually at the top of a map.',
        'A key tells you what the symbols on a map mean.',
        'A globe is a model of the whole Earth.',
        'An island has water all the way around it.',
        'There are seven continents.'
      ],
      myths: [
        'The top of a map is always the way you are facing.',
        'A map shows a place from the side.',
        'There are four continents.',
        'A globe and a map show different planets.',
        'A city and a country mean the same thing.'
      ]
    },
    {
      name: 'Weather, Climate and the Seasons', from: 'Grade 2', to: 'Grade 5',
      figures: ['water-cycle'],
      kind: 'early', noun: 'word',
      facts: [
        ['weather', 'what the sky and air are doing today'],
        ['climate', 'the usual weather of a place over many years'],
        ['temperature', 'how hot or cold it is'],
        ['rainfall', 'how much rain falls'],
        ['a forecast', 'what the weather is expected to do'],
        ['a rain gauge', 'the tool that measures rainfall'],
        ['a thermometer', 'the tool that measures temperature'],
        ['a wind vane', 'the tool that shows wind direction'],
        ['a cloud', 'water droplets floating in the sky'],
        ['a storm', 'weather with strong wind and heavy rain'],
        ['thunder', 'the sound made by lightning'],
        ['lightning', 'a flash of electricity in a storm'],
        ['a drought', 'a long time with no rain'],
        ['a flood', 'water covering land that is usually dry'],
        ['the equator', 'the imaginary line around the middle of the Earth'],
        ['the poles', 'the coldest places, at the top and bottom of the Earth'],
        ['a desert', 'a place with very little rain'],
        ['the seasons', 'spring, summer, autumn and winter']
      ],
      truths: [
        'Weather is what happens today; climate is what usually happens.',
        'Places near the equator are generally hotter than places near the poles.',
        'Thunder is the sound that lightning makes.',
        'A desert is defined by how little rain it gets, not by sand.',
        'A forecast is a prediction, so it can be wrong.'
      ],
      myths: [
        'Weather and climate mean the same thing.',
        'A desert must be covered in sand.',
        'Thunder causes lightning.',
        'Places near the poles are hot because they are at the top of the globe.',
        'A weather forecast is always right.'
      ]
    }
  ],

  history: [
    {
      name: 'Timelines, Then and Now', from: 'Grade 1', to: 'Grade 5',
      kind: 'early', noun: 'word',
      facts: [
        ['the past', 'the time before now'],
        ['the present', 'now'],
        ['the future', 'the time still to come'],
        ['a timeline', 'a line showing events in the order they happened'],
        ['a century', 'a hundred years'],
        ['a decade', 'ten years'],
        ['a generation', 'the people born at about the same time'],
        ['a source', 'something that tells us about the past'],
        ['an artefact', 'an object from the past'],
        ['a photograph', 'a picture that shows what something looked like'],
        ['a museum', 'a place where objects from the past are kept'],
        ['a historian', 'a person who studies the past'],
        ['an ancestor', 'a family member from long ago'],
        ['modern', 'from recent times'],
        ['ancient', 'from very long ago'],
        ['a change', 'something that is different now from before'],
        ['staying the same', 'something that has not changed'],
        ['an eyewitness', 'someone who was there and saw it happen']
      ],
      truths: [
        'A timeline puts events in the order they happened.',
        'A century is a hundred years.',
        'An object from the past can tell us how people lived.',
        'Not everything about the past has changed — some things stayed the same.',
        'Someone who was there can still remember it wrongly.'
      ],
      myths: [
        'A timeline shows events in order of importance.',
        'A century is ten years.',
        'People in the past were less clever than people now.',
        'Everything we know about the past comes from books.',
        'If someone saw it happen, their account must be exactly right.'
      ]
    },
    {
      name: 'Homes, Toys and School Long Ago', from: 'Grade 1', to: 'Grade 4',
      kind: 'early', noun: 'word',
      facts: [
        ['a slate', 'what children wrote on at school long ago'],
        ['a fountain pen', 'a pen filled with ink, used before ballpoints'],
        ['a candle', 'what people used for light before electricity'],
        ['an oil lamp', 'a light that burns oil'],
        ['a washboard', 'what clothes were scrubbed on before washing machines'],
        ['a mangle', 'the machine that squeezed water out of washing'],
        ['a fireplace', 'where a home was heated before central heating'],
        ['a wooden toy', 'the kind of toy made before plastic'],
        ['a spinning top', 'an old toy that spins on a point'],
        ['a hoop and stick', 'an old game played in the street'],
        ['a horse and cart', 'how goods were moved before lorries'],
        ['a steam train', 'the train that ran on coal and water'],
        ['a telegram', 'a short message sent before telephones were common'],
        ['a record player', 'the machine that played music from a disc'],
        ['a chalkboard', 'the board a teacher wrote on'],
        ['an inkwell', 'the pot of ink in an old school desk'],
        ['a chamber pot', 'what was used before indoor toilets'],
        ['a similarity', 'something that is the same then and now'],
        ['a difference', 'something that is not the same']
      ],
      truths: [
        'Children once wrote on slates because paper was expensive.',
        'Homes were lit by candles and oil lamps before electricity.',
        'Washing clothes took a whole day before washing machines.',
        'Some things about school have stayed much the same.',
        'Toys were mostly made of wood or metal before plastic was common.'
      ],
      myths: [
        'Children in the past did not go to school at all.',
        'Everyone had electricity a hundred years ago.',
        'Nothing about school has stayed the same.',
        'Toys have always been made of plastic.',
        'People long ago had no way of sending messages quickly.'
      ]
    }
  ],

  civics: [
    {
      name: 'Rules, Communities and Being a Citizen', from: 'Grade 1', to: 'Grade 5',
      kind: 'early', noun: 'word',
      facts: [
        ['a rule', 'something we agree to do to keep things fair and safe'],
        ['a law', 'a rule made by the government that everyone must follow'],
        ['a community', 'the people who live or work in a place'],
        ['a citizen', 'a member of a country or community'],
        ['a right', 'something everyone should be able to have or do'],
        ['a responsibility', 'something you should do for others'],
        ['fairness', 'treating people in a way that is right'],
        ['a vote', 'a way of choosing that gives everyone a say'],
        ['a majority', 'more than half'],
        ['a government', 'the group that runs a country'],
        ['a mayor', 'the leader of a town or city'],
        ['a council', 'the group that looks after local services'],
        ['a public service', 'something provided for everyone, like a library'],
        ['a tax', 'money paid to the government to pay for services'],
        ['a volunteer', 'someone who helps without being paid'],
        ['respect', 'treating people and property properly'],
        ['a disagreement', 'when people do not think the same thing'],
        ['a compromise', 'when both sides give up something to agree']
      ],
      truths: [
        'Rules are made to keep people safe and to make things fair.',
        'A vote gives everyone a say in a decision.',
        'Rights come with responsibilities.',
        'Taxes pay for public services like schools and libraries.',
        'You can disagree with someone and still be respectful.'
      ],
      myths: [
        'Rules exist to stop people having fun.',
        'The loudest person should decide.',
        'Rights mean you can do whatever you want.',
        'Libraries and parks are free because they cost nothing to run.',
        'Disagreeing with someone means falling out with them.'
      ]
    }
  ],

  /* ================================== maths ================================== */
  arithmetic: [
    {
      name: 'Addition and Subtraction Facts to 100', from: 'Grade 1', to: 'Grade 4',
      kind: 'early', noun: 'answer',
      procedural: ['add-numbers', 'take-away', 'number-bond', 'doubles', 'one-more', 'one-less'],
      facts: [
        ['a number bond', 'a pair of numbers that add to a given total'],
        ['adding', 'putting numbers together'],
        ['subtracting', 'taking one number away from another'],
        ['a sum', 'the answer to an addition'],
        ['a difference', 'the answer to a subtraction'],
        ['a total', 'the amount when everything is added'],
        ['counting on', 'adding by carrying on from a number'],
        ['counting back', 'subtracting by going backwards'],
        ['near doubles', 'sums like 6 + 7, worked out from double 6'],
        ['a fact family', 'the four number sentences made from three numbers'],
        ['an inverse', 'the operation that undoes another'],
        ['bridging ten', 'crossing over a ten when adding'],
        ['partitioning', 'splitting a number into tens and ones'],
        ['a column method', 'writing numbers in columns to add or subtract'],
        ['exchanging', 'swapping a ten for ten ones when subtracting'],
        ['an estimate', 'a rough answer used as a check'],
        ['a missing number', 'the gap in a number sentence'],
        ['a word problem', 'a question written in sentences']
      ],
      truths: [
        'Adding can be done in any order, so 3 + 8 is the same as 8 + 3.',
        'Subtraction cannot be done in any order: 8 − 3 is not 3 − 8.',
        'Addition and subtraction are inverses, so one checks the other.',
        'Knowing 6 + 4 = 10 also tells you 10 − 4 = 6.',
        'An estimate is a useful check on an answer.'
      ],
      myths: [
        'Subtraction can be done in any order like addition.',
        'You must always start counting from one.',
        'The bigger number always goes first in a subtraction, so 3 − 8 is 5.',
        'Adding always makes a number bigger, even when adding zero.',
        'A number sentence with a gap in the middle cannot be solved.'
      ]
    },
    {
      name: 'Times Tables and Division Facts', from: 'Grade 2', to: 'Grade 5',
      kind: 'early', noun: 'answer',
      procedural: ['add-numbers', 'skip-count', 'doubles'],
      facts: [
        ['multiplying', 'adding equal groups'],
        ['dividing', 'sharing into equal groups'],
        ['a product', 'the answer to a multiplication'],
        ['a quotient', 'the answer to a division'],
        ['an array', 'objects arranged in rows and columns'],
        ['a factor', 'a number that divides exactly into another'],
        ['a multiple', 'the answer when you multiply by a whole number'],
        ['skip counting', 'counting in steps of the same size'],
        ['a times table', 'the list of multiples of a number'],
        ['double', 'twice as many'],
        ['half', 'one of two equal parts'],
        ['a remainder', 'what is left over after dividing'],
        ['commutative', 'the fact that 3 × 4 is the same as 4 × 3'],
        ['a fact family', 'the multiplication and division facts from three numbers'],
        ['grouping', 'making equal groups from a set'],
        ['sharing', 'splitting into equal parts'],
        ['a square number', 'the answer when a number is multiplied by itself'],
        ['a repeated addition', 'adding the same number again and again']
      ],
      truths: [
        'Multiplication can be done in either order: 3 × 4 equals 4 × 3.',
        'Division cannot be done in either order.',
        'An array shows why 3 × 4 and 4 × 3 give the same answer.',
        'Knowing 6 × 7 = 42 also tells you 42 ÷ 7 = 6.',
        'Sometimes a division leaves a remainder.'
      ],
      myths: [
        'Division can be done in either order like multiplication.',
        'Multiplying always makes a number bigger, even by 1 or 0.',
        'You have to count every object to find how many are in an array.',
        'A remainder means you have made a mistake.',
        'Times tables only help with multiplication, not division.'
      ]
    },
    {
      name: 'Money, Time and Measures', from: 'Grade 2', to: 'Grade 5',
      kind: 'early', noun: 'word',
      facts: [
        ['a coin', 'a piece of metal money'],
        ['a note', 'paper money'],
        ['change', 'the money you get back'],
        ['a total', 'the amount everything costs together'],
        ['an hour', 'sixty minutes'],
        ['a minute', 'sixty seconds'],
        ['o’clock', 'the time when the minute hand points to twelve'],
        ['half past', 'thirty minutes after the hour'],
        ['quarter past', 'fifteen minutes after the hour'],
        ['quarter to', 'fifteen minutes before the hour'],
        ['am', 'the hours from midnight to noon'],
        ['pm', 'the hours from noon to midnight'],
        ['a centimetre', 'a small unit of length'],
        ['a metre', 'a hundred centimetres'],
        ['a gram', 'a small unit of mass'],
        ['a kilogram', 'a thousand grams'],
        ['a litre', 'a unit for measuring liquid'],
        ['a millilitre', 'a thousandth of a litre'],
        ['a scale', 'the marks on a measuring tool'],
        ['an estimate', 'a sensible guess before measuring']
      ],
      truths: [
        'There are sixty minutes in an hour, not a hundred.',
        'Quarter to three is 2:45.',
        'A metre is a hundred centimetres.',
        'A kilogram is a thousand grams.',
        'You should estimate before you measure, as a check.'
      ],
      myths: [
        'There are a hundred minutes in an hour.',
        'Quarter to three is 3:15.',
        'A metre is a thousand centimetres.',
        'The biggest coin is always worth the most.',
        'A litre and a kilogram measure the same thing.'
      ]
    }
  ],

  geometry: [
    {
      name: '2D Shapes, Angles and Symmetry for Primary', from: 'Grade 2', to: 'Grade 5',
      figures: ['triangle', 'circle'],
      kind: 'early', noun: 'shape',
      facts: [
        ['a square', 'a shape with four equal sides and four right angles'],
        ['a rectangle', 'a shape with four right angles and opposite sides equal'],
        ['a triangle', 'a shape with three sides'],
        ['a circle', 'a round shape with no corners'],
        ['a pentagon', 'a shape with five sides'],
        ['a hexagon', 'a shape with six sides'],
        ['an octagon', 'a shape with eight sides'],
        ['a side', 'one straight edge of a shape'],
        ['a corner', 'where two sides meet'],
        ['a right angle', 'a square corner'],
        ['an acute angle', 'an angle smaller than a right angle'],
        ['an obtuse angle', 'an angle bigger than a right angle'],
        ['a line of symmetry', 'the line where a shape folds into matching halves'],
        ['perimeter', 'the distance all the way round a shape'],
        ['area', 'the amount of space inside a shape'],
        ['parallel lines', 'lines that stay the same distance apart'],
        ['a quadrilateral', 'any shape with four sides'],
        ['a regular shape', 'a shape with all sides and angles the same']
      ],
      truths: [
        'A square is a kind of rectangle, because it has four right angles.',
        'A triangle always has three sides and three corners.',
        'Perimeter is the distance round the outside; area is the space inside.',
        'A circle has no corners and no straight sides.',
        'A shape can have more than one line of symmetry.'
      ],
      myths: [
        'A square is not a rectangle.',
        'A shape turned on its side becomes a different shape.',
        'Perimeter and area mean the same thing.',
        'Every four-sided shape is a square.',
        'A triangle must have a flat side at the bottom.'
      ]
    },
    {
      name: 'Data, Tables and Graphs for Primary', from: 'Grade 2', to: 'Grade 5',
      kind: 'early', noun: 'word',
      facts: [
        ['data', 'information that has been collected'],
        ['a tally chart', 'a way of counting with marks in fives'],
        ['a table', 'information set out in rows and columns'],
        ['a bar chart', 'a chart using bars to show amounts'],
        ['a pictogram', 'a chart using pictures to stand for amounts'],
        ['a line graph', 'a chart showing how something changes over time'],
        ['a pie chart', 'a circle divided to show parts of a whole'],
        ['an axis', 'a line along the side or bottom of a graph'],
        ['a label', 'the words saying what an axis shows'],
        ['a title', 'the words saying what the whole chart is about'],
        ['a key', 'the part explaining what a symbol stands for'],
        ['the most common', 'the answer that came up most often'],
        ['the least common', 'the answer that came up least often'],
        ['a survey', 'asking people the same question'],
        ['a total', 'all the amounts added together'],
        ['a difference', 'how much more one amount is than another'],
        ['sorting', 'putting things into groups'],
        ['a Venn diagram', 'overlapping circles used to sort things']
      ],
      truths: [
        'A pictogram needs a key to say what each picture stands for.',
        'A bar chart needs a title and labels on both axes.',
        'The tallest bar shows the most common answer.',
        'A tally mark across four others makes five.',
        'A line graph is used to show change over time.'
      ],
      myths: [
        'A chart does not need a title if the bars are clear.',
        'In a pictogram, one picture always means one thing.',
        'The tallest bar is always on the left.',
        'A bar chart and a line graph show the same kinds of data.',
        'You can read exact amounts from a pie chart without any numbers.'
      ]
    }
  ]
};
