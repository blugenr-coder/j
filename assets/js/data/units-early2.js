/* More early-years units.

   Early Learning had five topics and eight or so units each, which is a term
   rather than the two years the band covers. These are the rest of a Pre-K to
   Grade 1 scheme: the phonics sequence past first sounds, number to twenty and
   beyond, measurement and position before either has a formula, and the
   knowledge-of-the-world units that a five-year-old is genuinely taught.

   The wording follows the `early` convention already in the engine: short
   prompts naming the kind of thing being asked for ("Which letter…", "Which
   animal…"), because "Which term matches this description?" is not a question
   you can put to a five-year-old. */

export const EARLY2_UNITS = {
  phonics: [
    {
      name: 'Digraphs: sh, ch, th and wh', from: 'Kindergarten', to: 'Grade 2',
      kind: 'early', noun: 'sound',
      facts: [
        ['sh', 'the sound at the start of ship'],
        ['ch', 'the sound at the start of chip'],
        ['th', 'the sound at the start of thin'],
        ['wh', 'the sound at the start of whale'],
        ['ng', 'the sound at the end of ring'],
        ['ck', 'the sound at the end of duck'],
        ['qu', 'the sound at the start of queen'],
        ['ph', 'the sound at the start of phone'],
        ['shop', 'a word that starts with sh'],
        ['chin', 'a word that starts with ch'],
        ['thumb', 'a word that starts with th'],
        ['wheel', 'a word that starts with wh'],
        ['fish', 'a word that ends with sh'],
        ['lunch', 'a word that ends with ch'],
        ['bath', 'a word that ends with th'],
        ['song', 'a word that ends with ng'],
        ['sock', 'a word that ends with ck'],
        ['quick', 'a word that starts with qu']
      ],
      truths: [
        'Two letters can work together to make one sound.',
        'The word ship starts with the sh sound.',
        'The word ring ends with the ng sound.',
        'The letters ck usually come at the end of a word, not the start.',
        'The letter q is nearly always followed by u.'
      ],
      myths: [
        'The word ship starts with the s sound on its own.',
        'The letters ch make two separate sounds when you read them.',
        'The word ring ends with the g sound on its own.',
        'The letters ck are found at the start of English words.',
        'The letter q usually appears without a u after it.'
      ]
    },
    {
      name: 'Long Vowel Sounds', from: 'Kindergarten', to: 'Grade 2',
      kind: 'early', noun: 'word',
      facts: [
        ['cake', 'a word with the long a sound'],
        ['rain', 'a word with the long a sound spelled ai'],
        ['tree', 'a word with the long e sound spelled ee'],
        ['leaf', 'a word with the long e sound spelled ea'],
        ['bike', 'a word with the long i sound'],
        ['night', 'a word with the long i sound spelled igh'],
        ['boat', 'a word with the long o sound spelled oa'],
        ['rope', 'a word with the long o sound and a silent e'],
        ['tune', 'a word with the long u sound'],
        ['blue', 'a word with the long u sound spelled ue'],
        ['a silent e', 'the letter at the end that makes the vowel say its name'],
        ['a short vowel', 'the quick vowel sound in cat, bed and pig'],
        ['a long vowel', 'the vowel sound that says the letter name'],
        ['hat', 'a word with a short a sound'],
        ['hate', 'the word hat with a silent e, which changes the vowel'],
        ['kit', 'a word with a short i sound'],
        ['kite', 'the word kit with a silent e, which changes the vowel']
      ],
      truths: [
        'A silent e at the end of a word makes the vowel say its name.',
        'The word cake has a long a sound.',
        'Adding an e to hat makes hate, and the a changes.',
        'The letters ee and ea can both make the long e sound.',
        'The word cat has a short a sound.'
      ],
      myths: [
        'The e at the end of cake is read out loud.',
        'The word cat has a long a sound.',
        'Only one spelling can make the long e sound.',
        'Adding an e to the end of a word never changes how it sounds.',
        'Every vowel always says its own name.'
      ]
    },
    {
      name: 'Rhyming and Word Families', from: 'Pre-K', to: 'Grade 1',
      kind: 'early', noun: 'word',
      facts: [
        ['cat', 'a word that rhymes with hat'],
        ['dog', 'a word that rhymes with log'],
        ['sun', 'a word that rhymes with run'],
        ['bed', 'a word that rhymes with red'],
        ['pig', 'a word that rhymes with big'],
        ['cake', 'a word that rhymes with lake'],
        ['tree', 'a word that rhymes with bee'],
        ['star', 'a word that rhymes with car'],
        ['moon', 'a word that rhymes with spoon'],
        ['boat', 'a word that rhymes with coat'],
        ['a rhyme', 'two words that end with the same sound'],
        ['a word family', 'a group of words that end the same way'],
        ['the -at family', 'cat, hat, bat and mat'],
        ['the -op family', 'hop, top, mop and stop'],
        ['the -ig family', 'big, pig, dig and wig'],
        ['a syllable', 'one beat in a word']
      ],
      truths: [
        'Cat and hat rhyme because they end with the same sound.',
        'Words in a word family end the same way.',
        'The word elephant has three beats.',
        'Rhyming words do not have to be spelled the same way.',
        'Words that start with the same sound do not always rhyme.'
      ],
      myths: [
        'Cat and cup rhyme because they both start with c.',
        'Rhyming words must be spelled exactly the same at the end.',
        'Every word has only one beat.',
        'Words that start alike always rhyme.',
        'Only short words can rhyme.'
      ]
    }
  ],

  earlynumber: [
    {
      name: 'Counting to 50', from: 'Kindergarten', to: 'Grade 1',
      kind: 'early', noun: 'number',
      procedural: ['count-objects', 'what-comes-next', 'what-came-before', 'one-more', 'one-less', 'number-word'],
      facts: [
        ['thirty', 'the number written 30'],
        ['forty', 'the number written 40'],
        ['fifty', 'the number written 50'],
        ['twenty-five', 'the number written 25'],
        ['thirty-two', 'the number written 32'],
        ['forty-seven', 'the number written 47'],
        ['a ten', 'a group of ten ones'],
        ['a one', 'a single unit'],
        ['counting on', 'carrying on from a number instead of starting again'],
        ['counting back', 'going down the number line one step at a time'],
        ['a number line', 'a line with the numbers in order'],
        ['a hundred square', 'a grid with the numbers 1 to 100'],
        ['odd', 'a number that cannot be shared into two equal groups'],
        ['even', 'a number that can be shared into two equal groups'],
        ['the tens digit', 'the digit that says how many tens'],
        ['the ones digit', 'the digit that says how many ones']
      ],
      truths: [
        'The number after 29 is 30.',
        'The number 34 is made of three tens and four ones.',
        'Counting on from 20 is quicker than starting at 1.',
        '40 is bigger than 14.',
        'Even numbers end in 0, 2, 4, 6 or 8.'
      ],
      myths: [
        'The number after 29 is 20.',
        '14 is bigger than 40 because it has a 4 in it.',
        'The number 34 is made of four tens and three ones.',
        'All numbers ending in 5 are even.',
        'You have to start at 1 every time you count.'
      ]
    },
    {
      name: 'Sharing and Grouping', from: 'Kindergarten', to: 'Grade 2',
      kind: 'early', noun: 'answer',
      facts: [
        ['sharing', 'splitting a group into equal parts'],
        ['grouping', 'making equal groups from a set'],
        ['equal', 'exactly the same amount'],
        ['a group', 'a set of things counted together'],
        ['a pair', 'two things together'],
        ['half', 'one of two equal parts'],
        ['a quarter', 'one of four equal parts'],
        ['double', 'twice as many'],
        ['a remainder', 'what is left over when things cannot be shared equally'],
        ['a set', 'a collection of objects'],
        ['sharing 10 between 2', 'gives 5 each'],
        ['sharing 12 between 3', 'gives 4 each'],
        ['sharing 8 between 4', 'gives 2 each'],
        ['double 5', 'is 10'],
        ['half of 8', 'is 4'],
        ['half of 20', 'is 10']
      ],
      truths: [
        'Sharing 10 sweets between 2 children gives 5 each.',
        'Half of 8 is 4.',
        'Double 6 is 12.',
        'When things are shared equally, every group has the same amount.',
        'Sometimes there is something left over when you share.'
      ],
      myths: [
        'Sharing 10 between 2 gives 2 each.',
        'Half of 8 is 8.',
        'Equal groups can have different amounts as long as they are close.',
        'Double 6 is 8.',
        'Sharing always works out exactly, with nothing left over.'
      ]
    },
    {
      name: 'Measuring: Longer, Heavier, Fuller', from: 'Pre-K', to: 'Grade 1',
      kind: 'early', noun: 'word',
      facts: [
        ['longer', 'the word for something with more length'],
        ['shorter', 'the word for something with less length'],
        ['taller', 'the word for something with more height'],
        ['heavier', 'the word for something with more weight'],
        ['lighter', 'the word for something with less weight'],
        ['fuller', 'the word for a container with more in it'],
        ['emptier', 'the word for a container with less in it'],
        ['a ruler', 'the tool used to measure length'],
        ['a balance', 'the tool used to compare weight'],
        ['a jug', 'the container used to measure liquid'],
        ['a metre', 'a unit used to measure long lengths'],
        ['a centimetre', 'a small unit used to measure length'],
        ['a kilogram', 'a unit used to measure weight'],
        ['a litre', 'a unit used to measure liquid'],
        ['first', 'the one that comes at the start'],
        ['last', 'the one that comes at the end']
      ],
      truths: [
        'An elephant is heavier than a mouse.',
        'A pencil is shorter than a metre.',
        'You use a jug to measure how much juice there is.',
        'Two things can be the same length as each other.',
        'A big box is not always the heaviest one.'
      ],
      myths: [
        'A mouse is heavier than an elephant.',
        'The biggest thing is always the heaviest.',
        'You measure how heavy something is with a ruler.',
        'A pencil is longer than a metre.',
        'The tallest person is always the oldest.'
      ]
    },
    {
      name: 'Position, Direction and Turns', from: 'Pre-K', to: 'Grade 1',
      kind: 'early', noun: 'word',
      facts: [
        ['on', 'the word for something resting on top'],
        ['under', 'the word for something below'],
        ['in', 'the word for something inside'],
        ['next to', 'the word for something beside'],
        ['behind', 'the word for something at the back'],
        ['in front of', 'the word for something at the front'],
        ['between', 'the word for something with one on each side'],
        ['above', 'the word for something higher up'],
        ['below', 'the word for something lower down'],
        ['left', 'the side your left hand is on'],
        ['right', 'the side your right hand is on'],
        ['forwards', 'the direction you face when you walk ahead'],
        ['backwards', 'the direction behind you'],
        ['a turn', 'moving around to face a new way'],
        ['a half turn', 'turning all the way around to face the other way'],
        ['a quarter turn', 'turning to face the side']
      ],
      truths: [
        'If a cat is under the table, the table is above the cat.',
        'Something between two things has one on each side.',
        'A half turn makes you face the opposite way.',
        'Left and right swap over when you turn around.',
        'A quarter turn makes you face the side.'
      ],
      myths: [
        'Under and above mean the same thing.',
        'A half turn brings you back to facing the same way.',
        'Left and right stay the same no matter which way you face.',
        'Something between two things is on top of them.',
        'You have to turn all the way round to face the side.'
      ]
    }
  ],

  shapescolour: [
    {
      name: '3D Shapes Around Us', from: 'Kindergarten', to: 'Grade 2',
      kind: 'early', noun: 'shape',
      facts: [
        ['a cube', 'a shape with six square faces, like a dice'],
        ['a sphere', 'a round shape like a ball'],
        ['a cylinder', 'a shape like a tin of beans'],
        ['a cone', 'a shape like a party hat'],
        ['a cuboid', 'a box shape with six rectangle faces'],
        ['a pyramid', 'a shape with a flat base and a point at the top'],
        ['a face', 'a flat side of a 3D shape'],
        ['an edge', 'the line where two faces meet'],
        ['a corner', 'the point where edges meet'],
        ['a ball', 'an everyday sphere'],
        ['a dice', 'an everyday cube'],
        ['a tin', 'an everyday cylinder'],
        ['a party hat', 'an everyday cone'],
        ['a cereal box', 'an everyday cuboid'],
        ['rolling', 'what a sphere and a cylinder can do'],
        ['stacking', 'what a cube and a cuboid can do well']
      ],
      truths: [
        'A cube has six faces.',
        'A sphere can roll in any direction.',
        'A cylinder has two flat circles and one curved surface.',
        'A cube is easier to stack than a sphere.',
        'A cone has one point at the top.'
      ],
      myths: [
        'A cube has four faces.',
        'A cube rolls as easily as a ball.',
        'A sphere has flat faces you can stack.',
        'A cylinder has six flat faces.',
        'A cone and a cylinder are the same shape.'
      ]
    },
    {
      name: 'Symmetry and Repeating Patterns', from: 'Kindergarten', to: 'Grade 2',
      kind: 'early', noun: 'word',
      facts: [
        ['symmetry', 'when both halves of a shape match'],
        ['a line of symmetry', 'the line where a shape folds into matching halves'],
        ['a pattern', 'something that repeats in the same order'],
        ['a repeating pattern', 'a pattern where the same part comes again and again'],
        ['an AB pattern', 'a pattern like red, blue, red, blue'],
        ['an ABC pattern', 'a pattern like red, blue, green, red, blue, green'],
        ['a unit of repeat', 'the part of a pattern that repeats'],
        ['the next in the pattern', 'what comes after, following the rule'],
        ['a butterfly', 'a symmetrical living thing'],
        ['a circle', 'a shape with many lines of symmetry'],
        ['a square', 'a shape with four lines of symmetry'],
        ['a rectangle', 'a shape with two lines of symmetry'],
        ['a mirror', 'the object that shows a matching half'],
        ['sorting', 'putting things into groups that go together'],
        ['a rule', 'the thing that decides what comes next']
      ],
      truths: [
        'A butterfly has a line of symmetry down the middle.',
        'A square has four lines of symmetry.',
        'In an AB pattern, the colours take turns.',
        'A pattern repeats the same part again and again.',
        'You can find what comes next by finding the rule.'
      ],
      myths: [
        'Every shape has a line of symmetry.',
        'A pattern can change its rule halfway and still be a repeating pattern.',
        'A rectangle has four lines of symmetry.',
        'Symmetry means a shape is round.',
        'A pattern is just any group of colours.'
      ]
    }
  ],

  worldaround: [
    {
      name: 'Animals and Their Homes', from: 'Pre-K', to: 'Grade 2',
      kind: 'early', noun: 'animal',
      facts: [
        ['a bird', 'an animal that lives in a nest'],
        ['a rabbit', 'an animal that lives in a burrow'],
        ['a bee', 'an animal that lives in a hive'],
        ['a spider', 'an animal that lives in a web'],
        ['a fish', 'an animal that lives in water'],
        ['a bear', 'an animal that sleeps in a den'],
        ['a horse', 'an animal that lives in a stable'],
        ['a cow', 'an animal that lives in a field'],
        ['a mouse', 'an animal that lives in a hole'],
        ['a penguin', 'an animal that lives where it is very cold'],
        ['a camel', 'an animal that lives in the desert'],
        ['a monkey', 'an animal that lives in the forest'],
        ['a nest', 'a home made of twigs and grass'],
        ['a burrow', 'a home dug under the ground'],
        ['a hive', 'a home where bees make honey'],
        ['a habitat', 'the place where an animal lives']
      ],
      truths: [
        'Birds build nests to keep their eggs safe.',
        'A fish needs water to breathe.',
        'A camel can live in a very dry place.',
        'Animals live where they can find food and shelter.',
        'A penguin lives where it is very cold.'
      ],
      myths: [
        'A fish can live out of water for a long time.',
        'All animals live in nests.',
        'A polar bear lives in the desert.',
        'Animals can live anywhere at all.',
        'Bees live in burrows under the ground.'
      ]
    },
    {
      name: 'Seasons and Weather', from: 'Pre-K', to: 'Grade 2',
      kind: 'early', noun: 'word',
      facts: [
        ['spring', 'the season when plants start to grow'],
        ['summer', 'the warmest season'],
        ['autumn', 'the season when leaves fall'],
        ['winter', 'the coldest season'],
        ['sunny', 'weather with clear skies and sunshine'],
        ['rainy', 'weather with water falling from the clouds'],
        ['windy', 'weather with air moving quickly'],
        ['snowy', 'weather with white flakes falling'],
        ['cloudy', 'weather with the sky covered'],
        ['foggy', 'weather where it is hard to see far'],
        ['a coat', 'what you wear when it is cold'],
        ['an umbrella', 'what you use when it is raining'],
        ['a thermometer', 'the tool that measures how hot or cold it is'],
        ['a puddle', 'what is left after the rain'],
        ['a rainbow', 'what you see when there is sun and rain together'],
        ['a season', 'one of the four parts of the year']
      ],
      truths: [
        'There are four seasons in a year.',
        'Leaves fall from many trees in autumn.',
        'You need a coat when it is cold.',
        'A rainbow appears when there is sun and rain together.',
        'Snow falls when it is very cold.'
      ],
      myths: [
        'There are two seasons in a year.',
        'Leaves fall from trees in spring.',
        'It snows when the weather is hot.',
        'A rainbow appears at night.',
        'The weather is the same every day of the year.'
      ]
    },
    {
      name: 'People Who Help Us', from: 'Pre-K', to: 'Grade 1',
      kind: 'early', noun: 'person',
      facts: [
        ['a doctor', 'the person who helps you when you are ill'],
        ['a nurse', 'the person who looks after you in hospital'],
        ['a firefighter', 'the person who puts out fires'],
        ['a police officer', 'the person who keeps people safe'],
        ['a teacher', 'the person who helps you learn'],
        ['a dentist', 'the person who looks after your teeth'],
        ['a vet', 'the person who looks after animals'],
        ['a farmer', 'the person who grows food and looks after animals'],
        ['a postal worker', 'the person who brings the letters'],
        ['a bus driver', 'the person who drives people to places'],
        ['a librarian', 'the person who looks after the books'],
        ['a chef', 'the person who cooks the food'],
        ['a builder', 'the person who makes houses'],
        ['a paramedic', 'the person who comes in the ambulance'],
        ['a lifeguard', 'the person who keeps people safe in the water']
      ],
      truths: [
        'A vet looks after animals, not people.',
        'A dentist looks after your teeth.',
        'A firefighter helps in an emergency.',
        'A librarian helps you find a book.',
        'You call for an ambulance in an emergency.'
      ],
      myths: [
        'A vet looks after people.',
        'A dentist puts out fires.',
        'A librarian drives the bus.',
        'A farmer works in a hospital.',
        'You should call an ambulance if you cannot find your book.'
      ]
    },
    {
      name: 'My Body and Staying Healthy', from: 'Pre-K', to: 'Grade 2',
      kind: 'early', noun: 'part',
      facts: [
        ['the head', 'the part on top with your face on it'],
        ['an arm', 'the part with a hand at the end'],
        ['a leg', 'the part you walk on'],
        ['a hand', 'the part with five fingers'],
        ['a foot', 'the part with five toes'],
        ['the eyes', 'the parts you see with'],
        ['the ears', 'the parts you hear with'],
        ['the nose', 'the part you smell with'],
        ['the mouth', 'the part you eat and speak with'],
        ['the heart', 'the part that beats inside your chest'],
        ['the lungs', 'the parts you breathe with'],
        ['the brain', 'the part you think with'],
        ['washing your hands', 'what keeps germs away'],
        ['brushing your teeth', 'what keeps your teeth healthy'],
        ['sleeping', 'what helps your body grow and rest'],
        ['exercise', 'moving your body to keep it strong']
      ],
      truths: [
        'You have five fingers on each hand.',
        'You breathe with your lungs.',
        'Washing your hands helps stop germs spreading.',
        'You should brush your teeth twice a day.',
        'Your heart beats faster when you run.'
      ],
      myths: [
        'You breathe with your heart.',
        'You have six fingers on each hand.',
        'You only need to brush your teeth once a week.',
        'Your heart beats slower when you run.',
        'You think with your stomach.'
      ]
    }
  ],

  readiness: [
    {
      name: 'Days, Months and the Calendar', from: 'Kindergarten', to: 'Grade 2',
      kind: 'early', noun: 'word',
      facts: [
        ['Monday', 'the day after Sunday'],
        ['Friday', 'the last school day of the week'],
        ['Saturday', 'the day after Friday'],
        ['January', 'the first month of the year'],
        ['December', 'the last month of the year'],
        ['a week', 'seven days'],
        ['a month', 'about four weeks'],
        ['a year', 'twelve months'],
        ['yesterday', 'the day before today'],
        ['tomorrow', 'the day after today'],
        ['a calendar', 'the chart showing the days and months'],
        ['a weekend', 'Saturday and Sunday'],
        ['a birthday', 'the day you were born, each year'],
        ['morning', 'the part of the day before noon'],
        ['afternoon', 'the part of the day after noon'],
        ['night', 'the dark part of the day']
      ],
      truths: [
        'There are seven days in a week.',
        'There are twelve months in a year.',
        'The day after Friday is Saturday.',
        'January comes before February.',
        'The weekend is Saturday and Sunday.'
      ],
      myths: [
        'There are five days in a week.',
        'There are ten months in a year.',
        'The day after Friday is Thursday.',
        'December comes before January in the same year.',
        'Every month has exactly thirty days.'
      ]
    },
    {
      name: 'Listening, Sharing and Taking Turns', from: 'Pre-K', to: 'Grade 1',
      kind: 'early', noun: 'thing to do',
      facts: [
        ['listening', 'paying attention to what someone is saying'],
        ['taking turns', 'waiting for your go'],
        ['sharing', 'letting someone else use something too'],
        ['tidying up', 'putting things back where they belong'],
        ['putting up your hand', 'the way to ask a question in class'],
        ['saying please', 'the polite way to ask for something'],
        ['saying thank you', 'the polite thing to say when someone helps'],
        ['saying sorry', 'what to say when you have upset someone'],
        ['lining up', 'standing one behind the other'],
        ['walking inside', 'how to move safely in a corridor'],
        ['asking for help', 'what to do when you are stuck'],
        ['being kind', 'thinking about how someone else feels'],
        ['looking after your things', 'keeping your own belongings safe'],
        ['a rule', 'something everyone agrees to do'],
        ['a friend', 'someone you get along with and are kind to']
      ],
      truths: [
        'Putting up your hand is the way to ask a question in class.',
        'Taking turns means everyone gets a go.',
        'You say sorry when you have upset someone.',
        'It is safer to walk than to run inside.',
        'Asking for help when you are stuck is a good thing to do.'
      ],
      myths: [
        'Shouting out is the best way to be heard in class.',
        'Taking turns means going first every time.',
        'Running inside is fine if you are careful.',
        'Asking for help means you are not clever.',
        'You only have to be kind to your best friend.'
      ]
    }
  ]
};
