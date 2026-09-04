/* Grades 3 to 5.

   After the first elementary pass, a coverage check showed Grade 3 sitting
   below Grade 2: the early-years units mostly finish by Grade 2 and the
   secondary units mostly start at Grade 6, so the upper primary years were
   being served by whatever happened to overlap them from either side.

   These units are pitched squarely at that band — the year a child meets
   written methods, the Romans, playscripts and the digestive system — and
   they run to Grade 6 or 7 where the topic genuinely continues. */

export const ELEM2_UNITS = {
  /* ================================= science ================================= */
  earth: [
    {
      name: 'Rocks, Soils and Fossils', from: 'Grade 3', to: 'Grade 7',
      figures: ['volcano', 'earth-layers'],
      facts: [
        ['a rock', 'a naturally formed solid made of minerals'],
        ['a mineral', 'the substance a rock is made from'],
        ['an igneous rock', 'a rock formed when molten rock cools'],
        ['a sedimentary rock', 'a rock formed from layers pressed together'],
        ['a metamorphic rock', 'a rock changed by heat and pressure'],
        ['granite', 'a hard igneous rock with visible crystals'],
        ['sandstone', 'a sedimentary rock made from grains of sand'],
        ['limestone', 'a sedimentary rock that fizzes in acid'],
        ['marble', 'the metamorphic rock that limestone becomes'],
        ['slate', 'a metamorphic rock that splits into flat sheets'],
        ['permeable', 'letting water soak through'],
        ['impermeable', 'not letting water through'],
        ['soil', 'the mixture of broken rock, water, air and dead material'],
        ['humus', 'the decayed plant and animal material in soil'],
        ['a fossil', 'the preserved remains or trace of a living thing'],
        ['a palaeontologist', 'a scientist who studies fossils'],
        ['weathering', 'the breaking down of rock where it lies'],
        ['erosion', 'the carrying away of broken rock'],
        ['a crystal', 'a solid with a regular shape, formed as a mineral cools'],
        ['the rock cycle', 'the way rock changes from one type to another over time']
      ],
      truths: [
        'A fossil forms over a very long time, usually in sedimentary rock.',
        'Marble is limestone that has been changed by heat and pressure.',
        'Soil contains broken rock as well as decayed plant and animal material.',
        'Igneous rocks form when molten rock cools and sets.',
        'Weathering breaks rock down where it is; erosion carries it away.'
      ],
      myths: [
        'A fossil is the actual bone of an animal, unchanged.',
        'All rocks are the same hardness.',
        'Soil is just dirt with nothing living in it.',
        'Fossils are usually found in igneous rock.',
        'Weathering and erosion are the same process.'
      ],
      sequences: [
        ['How a fossil forms', [
          'An animal dies and is quickly covered by mud or sand',
          'The soft parts rot away and the hard parts remain',
          'Layers of sediment build up on top and press down',
          'Minerals seep in and slowly replace the remains',
          'Movement of the rock brings the fossil back to the surface'
        ]]
      ],
      applications: [
        ['A rock fizzes when acid is dropped on it. Which rock is it likely to be?', 'limestone'],
        ['A rock splits neatly into flat sheets for roofing. What is it?', 'slate'],
        ['A rock has large crystals because it cooled slowly underground. What kind is it?', 'an igneous rock'],
        ['Water soaks straight through a rock. What property is that?', 'permeable'],
        ['A scientist digs up and studies ancient remains in rock. What is their job?', 'a palaeontologist']
      ]
    },
    {
      name: 'Rivers, Mountains and the Land', from: 'Grade 3', to: 'Grade 7',
      figures: ['river'],
      facts: [
        ['a source', 'where a river begins'],
        ['a mouth', 'where a river reaches the sea'],
        ['a tributary', 'a smaller river joining a bigger one'],
        ['a valley', 'the low ground between hills'],
        ['a mountain', 'land much higher than the ground around it'],
        ['a hill', 'raised ground, lower than a mountain'],
        ['a plain', 'a large area of flat land'],
        ['a cliff', 'a steep rock face, often by the sea'],
        ['a beach', 'the sand or pebbles where the land meets the sea'],
        ['a lake', 'a large area of water surrounded by land'],
        ['a waterfall', 'where a river falls over a step of hard rock'],
        ['a meander', 'a bend in a river'],
        ['a flood', 'when a river overflows onto the land'],
        ['a delta', 'the flat land of mud and sand where a river meets the sea'],
        ['contour lines', 'the lines on a map joining places of equal height'],
        ['altitude', 'height above sea level'],
        ['a glacier', 'a slow-moving river of ice'],
        ['a volcano', 'an opening in the Earth where molten rock reaches the surface'],
        ['an earthquake', 'a shaking of the ground'],
        ['a landform', 'a natural feature of the land’s shape']
      ],
      truths: [
        'A river starts at its source and ends at its mouth.',
        'Contour lines close together mean steep ground.',
        'A tributary joins a larger river, not the sea.',
        'Rivers wear away the land and carry material downstream.',
        'A waterfall forms where a river crosses from hard rock to softer rock.'
      ],
      myths: [
        'A river starts at the sea and flows inland.',
        'Contour lines show where the roads are.',
        'Mountains are made by rivers piling up soil.',
        'Rivers always flow south.',
        'A delta forms at the source of a river.'
      ],
      applications: [
        ['A stream joins the main river halfway along. What is it?', 'a tributary'],
        ['Lines on a map are packed close together. What does that show?', 'contour lines'],
        ['A river bends in a wide curve across flat land. What is that bend?', 'a meander'],
        ['A river drops over a step of hard rock. What forms there?', 'a waterfall'],
        ['A slow-moving mass of ice carves out a valley. What is it?', 'a glacier']
      ]
    }
  ],

  biology: [
    {
      name: 'Teeth, Digestion and Healthy Eating', from: 'Grade 3', to: 'Grade 6',
      figures: ['digestive'],
      facts: [
        ['an incisor', 'a flat front tooth used for cutting'],
        ['a canine', 'a pointed tooth used for tearing'],
        ['a molar', 'a broad back tooth used for grinding'],
        ['a premolar', 'the tooth between the canine and the molars'],
        ['enamel', 'the hard outer surface of a tooth'],
        ['plaque', 'the sticky layer of bacteria on teeth'],
        ['decay', 'the damage caused when acid attacks enamel'],
        ['the mouth', 'where digestion begins'],
        ['saliva', 'the liquid that starts to break food down'],
        ['the oesophagus', 'the tube from the mouth to the stomach'],
        ['the stomach', 'where food is churned with acid'],
        ['the small intestine', 'where nutrients pass into the blood'],
        ['the large intestine', 'where water is taken back into the body'],
        ['a nutrient', 'a substance in food the body needs'],
        ['carbohydrate', 'the nutrient that gives energy'],
        ['protein', 'the nutrient used for growth and repair'],
        ['fat', 'the nutrient that stores energy and keeps you warm'],
        ['a vitamin', 'a nutrient needed in small amounts to stay healthy'],
        ['fibre', 'the part of food that keeps the gut working'],
        ['a balanced diet', 'eating the right amounts of different foods']
      ],
      truths: [
        'Molars are at the back and are shaped for grinding.',
        'Digestion begins in the mouth, not in the stomach.',
        'Nutrients pass into the blood in the small intestine.',
        'Sugar feeds the bacteria in plaque, which make the acid that causes decay.',
        'Protein is used for growth and repair.'
      ],
      myths: [
        'All teeth are the same shape and do the same job.',
        'Digestion starts in the stomach.',
        'Sugar attacks teeth directly.',
        'The large intestine is where food is absorbed into the blood.',
        'Fat is always bad for you and should be avoided completely.'
      ],
      sequences: [
        ['The journey of food through the body', [
          'Teeth break the food up and saliva starts to digest it',
          'The food is swallowed and travels down the oesophagus',
          'The stomach churns it with acid',
          'Nutrients pass into the blood in the small intestine',
          'Water is absorbed in the large intestine',
          'What is left leaves the body'
        ]]
      ],
      applications: [
        ['A tooth is pointed and used for tearing. What is it?', 'a canine'],
        ['Bacteria on teeth produce acid after a sugary drink. What is that layer?', 'plaque'],
        ['A nutrient is needed to build new muscle. Which is it?', 'protein'],
        ['Water is taken back into the body here. Which organ?', 'the large intestine'],
        ['Food is broken down as soon as it is chewed. What starts this?', 'saliva']
      ]
    },
    {
      name: 'Classification and Grouping Living Things', from: 'Grade 4', to: 'Grade 7',
      facts: [
        ['classification', 'sorting living things into groups'],
        ['a vertebrate', 'an animal with a backbone'],
        ['an invertebrate', 'an animal without a backbone'],
        ['a mammal', 'a vertebrate with fur that feeds its young on milk'],
        ['a bird', 'a vertebrate with feathers that lays eggs'],
        ['a reptile', 'a vertebrate with dry scaly skin'],
        ['an amphibian', 'a vertebrate that lives in water and on land'],
        ['a fish', 'a vertebrate with gills and scales'],
        ['an insect', 'an invertebrate with six legs and three body parts'],
        ['an arachnid', 'an invertebrate with eight legs, such as a spider'],
        ['a mollusc', 'a soft-bodied invertebrate, often with a shell'],
        ['a flowering plant', 'a plant that makes seeds inside flowers'],
        ['a fungus', 'a living thing that feeds on dead or living material and is not a plant'],
        ['a micro-organism', 'a living thing too small to see without a microscope'],
        ['a species', 'a group of living things that can breed together'],
        ['a classification key', 'a series of questions used to identify a living thing'],
        ['a characteristic', 'a feature used to sort living things'],
        ['a habitat', 'the place where a living thing lives']
      ],
      truths: [
        'A vertebrate has a backbone and an invertebrate does not.',
        'A spider is an arachnid, not an insect, because it has eight legs.',
        'A fungus is not a plant: it cannot make its own food from light.',
        'A classification key works by asking questions with two possible answers.',
        'Whales and bats are both mammals despite where they live and how they move.'
      ],
      myths: [
        'A spider is an insect.',
        'All animals that live in water are fish.',
        'Mushrooms are plants.',
        'An invertebrate is any small animal.',
        'A penguin is not a bird because it cannot fly.'
      ],
      applications: [
        ['An animal has eight legs and no antennae. What group is it in?', 'an arachnid'],
        ['An animal has a backbone, fur and feeds its young milk. What is it?', 'a mammal'],
        ['A living thing feeds on dead wood and is not a plant or an animal. What is it?', 'a fungus'],
        ['You answer a series of yes-or-no questions to name a creature. What are you using?', 'a classification key'],
        ['An animal is too small to see without magnifying it. What is it?', 'a micro-organism']
      ]
    }
  ],

  /* ================================== maths ================================== */
  arithmetic: [
    {
      name: 'Place Value to 10,000 and Written Methods', from: 'Grade 3', to: 'Grade 6',
      procedural: ['add-numbers', 'take-away'],
      facts: [
        ['a digit', 'one of the symbols 0 to 9'],
        ['the ones column', 'the column on the right'],
        ['the tens column', 'the column to the left of the ones'],
        ['the hundreds column', 'the column to the left of the tens'],
        ['the thousands column', 'the column to the left of the hundreds'],
        ['place value', 'the value a digit has because of its column'],
        ['partitioning', 'splitting a number into its columns'],
        ['the column method', 'setting numbers out in columns to calculate'],
        ['carrying', 'moving a ten to the next column when adding'],
        ['exchanging', 'swapping one ten for ten ones when subtracting'],
        ['rounding', 'replacing a number with a nearby simpler one'],
        ['an estimate', 'a rough answer used to check'],
        ['a comparison', 'deciding which number is larger'],
        ['ascending order', 'from smallest to largest'],
        ['descending order', 'from largest to smallest'],
        ['a Roman numeral', 'a number written with letters such as I, V and X'],
        ['a negative number', 'a number below zero'],
        ['zero as a placeholder', 'the zero that keeps other digits in the right column']
      ],
      truths: [
        'In 4,507 the zero holds the tens column so the 5 means five hundred.',
        'Moving a digit one column to the left multiplies its value by ten.',
        'Rounding to the nearest hundred, 1,250 becomes 1,300 by the usual convention.',
        'An estimate made by rounding first is a useful check on a calculation.',
        'X means ten in Roman numerals and IX means nine.'
      ],
      myths: [
        'The zero in 4,507 does not do anything.',
        'The digit on the left is always the largest digit.',
        'A longer number is always a larger number.',
        'Rounding always makes a number smaller.',
        'IX means eleven.'
      ],
      applications: [
        ['In 3,806 the 8 stands for eight hundred. Which idea explains this?', 'place value'],
        ['5,000 + 300 + 20 + 7 is written as 5,327. What has been reversed?', 'partitioning'],
        ['A ten is moved into the next column while adding. What is that called?', 'carrying'],
        ['482 becomes 500 to check an answer quickly. What was done?', 'rounding'],
        ['XIV is read as fourteen. What kind of number is it?', 'a Roman numeral']
      ]
    },
    {
      name: 'Fractions, Decimals and Percentages: First Steps', from: 'Grade 3', to: 'Grade 6',
      facts: [
        ['a fraction', 'a number showing part of a whole'],
        ['a numerator', 'the top number of a fraction'],
        ['a denominator', 'the bottom number of a fraction'],
        ['a half', 'one of two equal parts'],
        ['a third', 'one of three equal parts'],
        ['a quarter', 'one of four equal parts'],
        ['a tenth', 'one of ten equal parts'],
        ['an equivalent fraction', 'a fraction with a different look and the same value'],
        ['simplifying', 'writing a fraction in its lowest terms'],
        ['a mixed number', 'a whole number and a fraction together'],
        ['an improper fraction', 'a fraction where the top is at least the bottom'],
        ['a decimal', 'a number written with a decimal point'],
        ['a decimal point', 'the mark separating whole numbers from parts'],
        ['a percentage', 'a number out of a hundred'],
        ['a whole', 'the amount a fraction is part of'],
        ['a unit fraction', 'a fraction with 1 on top'],
        ['comparing fractions', 'deciding which fraction is larger'],
        ['a fraction of an amount', 'the result of dividing then multiplying']
      ],
      truths: [
        'One half, 0.5 and 50% are three ways of writing the same amount.',
        'A bigger denominator means smaller parts, so 1/8 is less than 1/4.',
        '2/4 and 1/2 are equivalent fractions.',
        'To find a quarter of a number you divide it by four.',
        'A fraction is one number, not two numbers stacked up.'
      ],
      myths: [
        '1/8 is bigger than 1/4 because 8 is bigger than 4.',
        'To add two fractions you add the tops and add the bottoms.',
        'A fraction is two separate numbers.',
        '0.5 and 5% are the same amount.',
        'Simplifying a fraction makes it smaller in value.'
      ],
      applications: [
        ['A pizza is cut into eight and three are taken. What is 8?', 'a denominator'],
        ['2/4 and 1/2 cover the same amount of a shape. What are they?', 'an equivalent fraction'],
        ['A quarter of 20 is worked out by dividing by four. What is being found?', 'a fraction of an amount'],
        ['0.5 written out of a hundred is 50. What has it become?', 'a percentage'],
        ['1 3/4 has a whole number and a fraction. What is it called?', 'a mixed number']
      ]
    }
  ],

  measurement: [
    {
      name: 'Perimeter, Area and Volume for Primary', from: 'Grade 3', to: 'Grade 6',
      figures: ['cube', 'triangle'],
      facts: [
        ['perimeter', 'the distance all the way round a shape'],
        ['area', 'the amount of surface a shape covers'],
        ['volume', 'the amount of space a solid takes up'],
        ['a square centimetre', 'the unit of area written cm²'],
        ['a cubic centimetre', 'the unit of volume written cm³'],
        ['length', 'how long something is'],
        ['width', 'how wide something is'],
        ['height', 'how tall something is'],
        ['a rectangle', 'a four-sided shape with right angles'],
        ['counting squares', 'a way of finding area by counting'],
        ['length times width', 'the quick way to find the area of a rectangle'],
        ['a compound shape', 'a shape made by joining simpler ones'],
        ['a net', 'the flat pattern that folds into a solid'],
        ['a face', 'a flat surface of a solid'],
        ['an edge', 'where two faces meet'],
        ['a vertex', 'a corner of a solid'],
        ['capacity', 'how much a container can hold'],
        ['a millilitre', 'a small unit of capacity, equal to one cubic centimetre']
      ],
      truths: [
        'Perimeter is measured in centimetres and area in square centimetres.',
        'Two shapes can have the same perimeter and different areas.',
        'The area of a rectangle is its length times its width.',
        'A net folds up to make a solid.',
        'One millilitre is the same as one cubic centimetre.'
      ],
      myths: [
        'Perimeter and area are measured in the same units.',
        'Shapes with the same perimeter must have the same area.',
        'Area is found by adding the length and the width.',
        'A cube has four faces.',
        'Volume and capacity can never be compared.'
      ],
      applications: [
        ['A fence is put all the way round a field. What is measured?', 'perimeter'],
        ['Carpet is bought to cover a floor. What is measured?', 'area'],
        ['A rectangle is 6 cm by 4 cm and covers 24 squares. Which rule was used?', 'length times width'],
        ['Six squares are drawn flat and folded into a box. What was drawn?', 'a net'],
        ['A jug holds 500 ml. What property is that?', 'capacity']
      ]
    }
  ],

  /* ================================ english ================================ */
  writing: [
    {
      name: 'Playscripts, Letters and Instructions', from: 'Grade 3', to: 'Grade 6',
      facts: [
        ['a playscript', 'writing set out for actors to perform'],
        ['a character name', 'the name written before each spoken line'],
        ['a stage direction', 'an instruction in a script, usually in brackets'],
        ['a scene', 'one part of a play in one place'],
        ['a letter', 'a written message to a particular person'],
        ['a formal letter', 'a letter to someone you do not know well'],
        ['an informal letter', 'a letter to a friend or family member'],
        ['an address', 'where a letter is going'],
        ['a greeting', 'the opening line of a letter'],
        ['a sign-off', 'the closing line of a letter'],
        ['instructions', 'writing that tells someone how to do something'],
        ['an imperative verb', 'a bossy verb that gives a command'],
        ['a numbered step', 'one instruction in a sequence'],
        ['a subheading', 'a small heading dividing a text'],
        ['a bullet point', 'one item in a list marked with a dot'],
        ['a time connective', 'a word like first, next or finally'],
        ['a purpose', 'what a piece of writing is for'],
        ['an audience', 'who a piece of writing is for']
      ],
      truths: [
        'A playscript has no speech marks, because the character name shows who speaks.',
        'Instructions use imperative verbs like "cut" and "stir".',
        'A formal letter and an informal letter use different greetings.',
        'Stage directions tell the actors what to do and are not spoken aloud.',
        'Who you are writing to changes how you write.'
      ],
      myths: [
        'A playscript uses speech marks like a story.',
        'Instructions should be written as a long paragraph.',
        'You can start a formal letter "Hi there".',
        'Stage directions are read out during the performance.',
        'The audience makes no difference to how you write.'
      ],
      applications: [
        ['"Stir the mixture." Which kind of verb is "stir"?', 'an imperative verb'],
        ['A name appears before every spoken line. What kind of writing is this?', 'a playscript'],
        ['A letter begins "Dear Sir or Madam". What kind of letter is it?', 'a formal letter'],
        ['"(Enters, looking worried)" is in brackets in a script. What is it?', 'a stage direction'],
        ['"First… next… finally…" organise a set of steps. What are these words?', 'a time connective']
      ]
    }
  ],

  spelling: [
    {
      name: 'Prefixes, Suffixes and Word Building', from: 'Grade 3', to: 'Grade 6',
      facts: [
        ['a prefix', 'a part added to the beginning of a word'],
        ['a suffix', 'a part added to the end of a word'],
        ['a root word', 'the word a prefix or suffix is added to'],
        ['un-', 'the prefix meaning not'],
        ['dis-', 'the prefix meaning not or opposite'],
        ['re-', 'the prefix meaning again'],
        ['pre-', 'the prefix meaning before'],
        ['mis-', 'the prefix meaning wrongly'],
        ['sub-', 'the prefix meaning under'],
        ['-ful', 'the suffix meaning full of'],
        ['-less', 'the suffix meaning without'],
        ['-ly', 'the suffix that usually makes an adverb'],
        ['-ness', 'the suffix that makes a noun from an adjective'],
        ['-ment', 'the suffix that makes a noun from a verb'],
        ['-ing', 'the suffix showing an action in progress'],
        ['-ed', 'the suffix showing an action in the past'],
        ['a syllable', 'one beat of a word'],
        ['a homophone', 'a word that sounds the same but is spelled differently'],
        ['a plural', 'the form for more than one'],
        ['a compound word', 'a word made from two smaller words']
      ],
      truths: [
        '"Un-" added to "happy" makes "unhappy", which means not happy.',
        '"-ful" means full of, so "careful" means full of care.',
        '"-less" means without, so "careless" means without care.',
        'A prefix goes at the front and a suffix at the end.',
        '"Football" is a compound word made from two smaller words.'
      ],
      myths: [
        'A prefix goes at the end of a word.',
        '"-ful" is spelled with two l’s in "careful".',
        'Adding a prefix always makes a word mean the opposite.',
        'Every word can take any suffix.',
        'A compound word must have a hyphen in it.'
      ],
      applications: [
        ['"Unkind" means not kind. Which prefix did that?', 'un-'],
        ['"Hopeless" means without hope. Which suffix did that?', '-less'],
        ['"Rebuild" means to build again. Which prefix is this?', 're-'],
        ['"Kindness" is a noun made from an adjective. Which suffix?', '-ness'],
        ['"Playground" is made from two words. What kind of word is it?', 'a compound word']
      ]
    }
  ],

  literature: [
    {
      name: 'Poems, Myths and Traditional Tales', from: 'Grade 3', to: 'Grade 6',
      facts: [
        ['a poem', 'writing arranged in lines, often with rhythm'],
        ['a verse', 'a group of lines in a poem'],
        ['a rhyme', 'words that end with the same sound'],
        ['a rhyming couplet', 'two lines next to each other that rhyme'],
        ['a simile', 'a comparison using like or as'],
        ['a metaphor', 'saying one thing is another'],
        ['alliteration', 'words next to each other starting with the same sound'],
        ['onomatopoeia', 'a word that sounds like the noise it describes'],
        ['a myth', 'an old story explaining something about the world'],
        ['a legend', 'an old story about a hero, based loosely on real events'],
        ['a fable', 'a short story with a lesson, often with animals'],
        ['a fairy tale', 'a traditional story with magic in it'],
        ['a moral', 'the lesson a story teaches'],
        ['a hero', 'the main good character'],
        ['a villain', 'the character who opposes the hero'],
        ['a narrator', 'the voice telling the story'],
        ['a setting', 'where and when a story happens'],
        ['a quest', 'a journey with a purpose in a story']
      ],
      truths: [
        'A simile uses "like" or "as"; a metaphor does not.',
        'A fable usually ends with a moral.',
        'A myth often explains something about the natural world.',
        'Alliteration is about the sound at the start of words, not the letter.',
        '"Bang" and "splash" are examples of onomatopoeia.'
      ],
      myths: [
        'A simile and a metaphor are the same thing.',
        'All poems must rhyme.',
        'A myth is just another word for a lie.',
        'A fable and a fairy tale are the same kind of story.',
        'Alliteration means every word starts with the same letter on the page.'
      ],
      applications: [
        ['"As quiet as a mouse." Which technique is this?', 'a simile'],
        ['"The classroom was a zoo." Which technique is this?', 'a metaphor'],
        ['"Slippery snakes slither." Which technique is this?', 'alliteration'],
        ['A story explains why the seasons change. What kind of story is it?', 'a myth'],
        ['A short animal story ends with a lesson. What is it?', 'a fable']
      ]
    }
  ],

  /* ============================= social studies ============================= */
  history: [
    {
      name: 'Ancient Egypt for Primary', from: 'Grade 3', to: 'Grade 6',
      facts: [
        ['the Nile', 'the river Egyptian life depended on'],
        ['a pharaoh', 'the ruler of ancient Egypt'],
        ['a pyramid', 'a huge stone tomb built for a pharaoh'],
        ['a tomb', 'a place where a body is buried'],
        ['mummification', 'preserving a body for the afterlife'],
        ['a mummy', 'a preserved body wrapped in linen'],
        ['a sarcophagus', 'the stone coffin a mummy was placed in'],
        ['hieroglyphs', 'the picture writing of ancient Egypt'],
        ['the Rosetta Stone', 'the stone that let hieroglyphs be read again'],
        ['a scribe', 'someone trained to read and write'],
        ['papyrus', 'the material Egyptians wrote on, made from a reed'],
        ['a god', 'a being the Egyptians worshipped'],
        ['the afterlife', 'the life Egyptians believed came after death'],
        ['an archaeologist', 'a person who studies the past through objects'],
        ['irrigation', 'channelling river water to farmland'],
        ['the flood season', 'the time the Nile spread silt over the fields'],
        ['a canopic jar', 'a jar holding an organ removed during mummification'],
        ['Tutankhamun', 'the pharaoh whose tomb was found nearly untouched']
      ],
      truths: [
        'Egyptian farming depended on the Nile flooding each year.',
        'Hieroglyphs are picture writing, not an alphabet like ours.',
        'The Rosetta Stone made it possible to read hieroglyphs again.',
        'Bodies were mummified because Egyptians believed in an afterlife.',
        'Pyramids were tombs, not palaces.'
      ],
      myths: [
        'The pyramids were built as palaces for the pharaohs to live in.',
        'Hieroglyphs are an alphabet where each picture is a letter.',
        'Everyone in ancient Egypt could read and write.',
        'Egypt would have been just as fertile without the Nile.',
        'Mummies were wrapped up to stop them escaping.'
      ],
      sequences: [
        ['Preparing a mummy', [
          'The body is washed',
          'The internal organs are removed and placed in jars',
          'The body is dried out with natron salt',
          'It is wrapped in layers of linen',
          'It is placed inside a decorated coffin'
        ]]
      ],
      applications: [
        ['A stone with the same text in three scripts unlocked a lost writing system. What is it?', 'the Rosetta Stone'],
        ['A jar holds an organ removed before wrapping. What is it?', 'a canopic jar'],
        ['River water is channelled onto fields to grow crops. What is this?', 'irrigation'],
        ['A trained writer records the harvest. What is their job?', 'a scribe'],
        ['A body is preserved so it will last for the afterlife. What is the process?', 'mummification']
      ]
    },
    {
      name: 'The Romans and Ancient Greece for Primary', from: 'Grade 3', to: 'Grade 6',
      facts: [
        ['an empire', 'many lands ruled by one country'],
        ['an emperor', 'the ruler of an empire'],
        ['a legion', 'a large unit of the Roman army'],
        ['a centurion', 'the officer in charge of a group of Roman soldiers'],
        ['a shield', 'the equipment Roman soldiers locked together for protection'],
        ['a Roman road', 'a straight, well-built road for moving armies and goods'],
        ['an aqueduct', 'a structure carrying water into a town'],
        ['a villa', 'a large Roman country house'],
        ['a mosaic', 'a picture made from small coloured tiles'],
        ['the Colosseum', 'the great Roman amphitheatre'],
        ['a gladiator', 'a fighter who performed in the arena'],
        ['a city-state', 'an independent Greek city with its own rules'],
        ['Athens', 'the Greek city known for democracy and learning'],
        ['Sparta', 'the Greek city known for its soldiers'],
        ['democracy', 'a system where citizens vote on decisions'],
        ['a philosopher', 'a Greek thinker who asked big questions'],
        ['the Olympic Games', 'the athletic festival begun in ancient Greece'],
        ['a myth', 'a Greek story about gods and heroes'],
        ['a theatre', 'the open-air place where Greek plays were performed']
      ],
      truths: [
        'Roman roads were built straight to move armies quickly.',
        'Aqueducts carried water into towns using a very gentle slope.',
        'Athens is remembered for democracy and Sparta for its soldiers.',
        'Only some people could vote in Athenian democracy.',
        'The Olympic Games began in ancient Greece.'
      ],
      myths: [
        'Everyone in Athens could vote, including women and enslaved people.',
        'Roman roads curved to follow the landscape.',
        'Aqueducts used pumps to push water uphill.',
        'The Romans and the ancient Greeks lived at exactly the same time.',
        'Gladiators were all volunteers who fought for fun.'
      ],
      applications: [
        ['A structure carries water gently downhill into a town. What is it?', 'an aqueduct'],
        ['A picture is made from thousands of small coloured tiles. What is it?', 'a mosaic'],
        ['An independent Greek city makes its own laws. What is it?', 'a city-state'],
        ['Citizens gather to vote on a decision in Athens. What system is this?', 'democracy'],
        ['A Roman officer commands a group of soldiers. What is his title?', 'a centurion']
      ]
    }
  ],

  geography: [
    {
      name: 'Settlements, Land Use and Fieldwork', from: 'Grade 3', to: 'Grade 6',
      facts: [
        ['a settlement', 'a place where people live'],
        ['a hamlet', 'a very small settlement'],
        ['a village', 'a small settlement with a few services'],
        ['a town', 'a settlement larger than a village'],
        ['a city', 'a very large settlement'],
        ['land use', 'what an area of land is used for'],
        ['residential', 'land used for housing'],
        ['industrial', 'land used for factories'],
        ['commercial', 'land used for shops and offices'],
        ['agricultural', 'land used for farming'],
        ['a service', 'something provided for people, like a shop or a school'],
        ['transport links', 'the roads, railways and paths connecting places'],
        ['fieldwork', 'collecting information outside the classroom'],
        ['a survey', 'asking people the same questions'],
        ['a tally chart', 'a way of counting observations'],
        ['a sketch map', 'a rough map drawn by hand'],
        ['a grid reference', 'numbers used to find a place on a map'],
        ['an ordnance survey map', 'a detailed map showing symbols and contours'],
        ['a compass point', 'north, south, east or west'],
        ['the environment', 'the surroundings people live in']
      ],
      truths: [
        'A settlement grows where there is water, food and shelter.',
        'A grid reference gives the position of a place on a map.',
        'Land can be used for housing, farming, industry or shops.',
        'Fieldwork means collecting your own information outside.',
        'A village is smaller than a town, which is smaller than a city.'
      ],
      myths: [
        'Settlements grow in random places for no reason.',
        'A grid reference tells you how high the land is.',
        'All land in a town is used for housing.',
        'Fieldwork means reading about a place in a book.',
        'A city is just a town with more shops.'
      ],
      applications: [
        ['People count passing cars using marks in fives. What are they using?', 'a tally chart'],
        ['Numbers on a map are used to find a farm. What are they?', 'a grid reference'],
        ['A field is used to grow wheat. What kind of land use is that?', 'agricultural'],
        ['Pupils walk round the village recording what buildings are used for. What are they doing?', 'fieldwork'],
        ['A small group of houses with no shop. What kind of settlement is it?', 'a hamlet']
      ]
    }
  ],

  /* ================================== arts ================================== */
  'art-history': [
    {
      name: 'Colour, Line and Making Art', from: 'Grade 2', to: 'Grade 6',
      facts: [
        ['a primary colour', 'red, blue or yellow, which cannot be mixed from others'],
        ['a secondary colour', 'a colour made by mixing two primaries'],
        ['a tint', 'a colour with white added'],
        ['a shade', 'a colour with black added'],
        ['a warm colour', 'a colour like red, orange or yellow'],
        ['a cool colour', 'a colour like blue, green or purple'],
        ['a colour wheel', 'the circle showing how colours relate'],
        ['a line', 'a mark made by a moving point'],
        ['a shape', 'a flat enclosed area'],
        ['a form', 'a three-dimensional shape'],
        ['texture', 'how a surface feels or looks like it would feel'],
        ['a pattern', 'a design that repeats'],
        ['tone', 'how light or dark something is'],
        ['shading', 'making a drawing look solid by varying tone'],
        ['a sketch', 'a quick rough drawing'],
        ['a portrait', 'a picture of a person'],
        ['a landscape', 'a picture of the countryside'],
        ['a still life', 'a picture of objects arranged on a surface'],
        ['a collage', 'a picture made by sticking materials down'],
        ['a sculpture', 'a work of art you can walk around']
      ],
      truths: [
        'Red, blue and yellow are primary colours.',
        'Mixing blue and yellow makes green.',
        'Adding white to a colour makes a tint.',
        'Shading makes a flat drawing look solid.',
        'A still life shows arranged objects rather than people or scenery.'
      ],
      myths: [
        'Green is a primary colour.',
        'Adding black to a colour makes a tint.',
        'A portrait is a picture of scenery.',
        'You can mix red from other colours.',
        'Texture only matters in sculpture, not in drawing.'
      ],
      applications: [
        ['Blue and yellow are mixed. What kind of colour results?', 'a secondary colour'],
        ['White is added to red to make pink. What is pink here?', 'a tint'],
        ['A drawing is made to look solid by varying darkness. What is this?', 'shading'],
        ['A picture shows a bowl of fruit on a table. What kind of picture?', 'a still life'],
        ['Torn paper and fabric are stuck down to make a picture. What is it?', 'a collage']
      ]
    }
  ],

  fitness: [
    {
      name: 'Physical Education and Keeping Active', from: 'Grade 2', to: 'Grade 6',
      facts: [
        ['exercise', 'activity that makes the body work harder'],
        ['a warm-up', 'gentle activity before exercise'],
        ['a cool-down', 'gentle activity after exercise'],
        ['stamina', 'being able to keep going for a long time'],
        ['strength', 'how much force a muscle can produce'],
        ['flexibility', 'how far a joint can move'],
        ['a pulse', 'the beat you can feel as blood is pumped'],
        ['heart rate', 'how many times the heart beats each minute'],
        ['breathing rate', 'how many breaths you take each minute'],
        ['a muscle', 'the part of the body that pulls a bone'],
        ['coordination', 'making parts of the body work together'],
        ['balance', 'staying steady'],
        ['agility', 'changing direction quickly'],
        ['teamwork', 'working together towards the same goal'],
        ['a rule', 'something everyone in a game follows'],
        ['fair play', 'playing honestly and respecting others'],
        ['hydration', 'drinking enough water'],
        ['a sedentary lifestyle', 'a way of living with very little activity']
      ],
      truths: [
        'A warm-up prepares the muscles and reduces the chance of injury.',
        'Your heart rate goes up during exercise because muscles need more oxygen.',
        'Stamina, strength and flexibility are different kinds of fitness.',
        'Drinking water matters more when you exercise.',
        'Exercise strengthens the heart as well as the other muscles.'
      ],
      myths: [
        'Warming up is a waste of time if you feel fine.',
        'Your heart rate goes down when you exercise.',
        'Being good at one sport means being fit in every way.',
        'You only need to drink when you feel thirsty.',
        'Only running counts as real exercise.'
      ],
      applications: [
        ['Gentle jogging and stretching before a match. What is this?', 'a warm-up'],
        ['A runner can keep going for a long time. Which kind of fitness is that?', 'stamina'],
        ['You feel a beat in your wrist after running. What is it?', 'a pulse'],
        ['A gymnast can bend further than most people. Which kind of fitness?', 'flexibility'],
        ['Players pass to each other rather than keeping the ball. What is this?', 'teamwork']
      ]
    }
  ]
};
