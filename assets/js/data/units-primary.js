/* Grades 1 to 3, by name.

   The level grid showed the first three school years thinner than the years
   either side of them: the Pre-K and Kindergarten units stop at Grade 2, the
   secondary units start at Grade 6, and Grades 1 to 3 were living on whatever
   overlapped from both ends.

   These are the units those years are actually taught as, named the way a
   teacher names them on a plan — "Times Tables: 2, 5 and 10", "Light, Shadows
   and Reflection" — not "Grade 2 maths". */

export const PRIMARY_UNITS = {
  /* ================================== maths ================================== */
  arithmetic: [
    {
      name: 'Addition and Subtraction to 100', from: 'Grade 1', to: 'Grade 4',
      facts: [
        ['a sum', 'the answer when numbers are added'],
        ['a difference', 'the answer when one number is taken from another'],
        ['an addend', 'a number being added'],
        ['a total', 'how many there are altogether'],
        ['to partition', 'to split a number into tens and ones'],
        ['a number bond', 'a pair of numbers that add to a given total'],
        ['to bridge ten', 'to add by making the next ten first'],
        ['an exchange', 'swapping one ten for ten ones, or the other way round'],
        ['a column method', 'writing numbers one above the other in place-value columns'],
        ['a number line', 'a line marked with numbers, used to count on or back'],
        ['to count on', 'to add by counting forwards from a number'],
        ['to count back', 'to subtract by counting backwards from a number'],
        ['the inverse', 'the operation that undoes another'],
        ['a fact family', 'the four addition and subtraction facts linking three numbers'],
        ['near doubles', 'a double with one more or one less'],
        ['to estimate', 'to work out roughly what the answer should be'],
        ['place value', 'what each digit is worth because of where it sits'],
        ['a missing number', 'the unknown value that makes a calculation true'],
        ['commutative', 'giving the same answer whichever way round you add'],
        ['a word problem', 'a calculation described in a sentence']
      ],
      truths: [
        'Addition can be done in any order; subtraction cannot.',
        'Subtraction is the inverse of addition, so it can be used to check an answer.',
        'Bridging ten means adding to the next multiple of ten first, then adding the rest.',
        'Three numbers in a fact family make two additions and two subtractions.',
        'Estimating first tells you whether an answer is sensible.'
      ],
      myths: [
        'You can swap the numbers round in a subtraction and get the same answer.',
        'The bigger number always goes first in every calculation.',
        'Adding always makes a number bigger, even when adding zero.',
        'You must always start a column method from the left.',
        'Counting back and counting on give different answers to the same subtraction.'
      ],
      sequences: [
        ['Adding 47 and 25 by partitioning', [
          'Split both numbers into tens and ones',
          'Add the tens: 40 and 20 make 60',
          'Add the ones: 7 and 5 make 12',
          'Add the two parts together: 60 and 12',
          'Write the total: 72'
        ]]
      ],
      applications: [
        ['You have 34 stickers and are given 28 more. How many altogether?', '62'],
        ['A book has 80 pages and you have read 45. How many are left?', '35'],
        ['Which calculation checks that 63 minus 29 is 34?', '34 plus 29'],
        ['You add 8 to 27 by making 30 first. What do you add after the 3?', '5'],
        ['What is the missing number: 56 plus ? equals 90', '34']
      ]
    },
    {
      name: 'Times Tables: 2, 5 and 10', from: 'Grade 1', to: 'Grade 4',
      facts: [
        ['a multiple', 'a number you reach by counting in steps of another number'],
        ['a factor', 'a number that divides exactly into another'],
        ['a product', 'the answer when numbers are multiplied'],
        ['a multiplication', 'repeated addition of equal groups'],
        ['an array', 'objects arranged in equal rows and columns'],
        ['a group', 'one of the equal sets in a multiplication'],
        ['sharing', 'splitting a total into equal groups'],
        ['grouping', 'finding how many equal groups fit into a total'],
        ['a remainder', 'what is left over after equal sharing'],
        ['skip counting', 'counting on in equal steps'],
        ['double', 'twice as many'],
        ['half', 'one of two equal parts'],
        ['an even number', 'a number that divides exactly by two'],
        ['an odd number', 'a number that leaves one over when divided by two'],
        ['a times table', 'the list of multiples of one number'],
        ['a multiplication sign', 'the symbol meaning lots of'],
        ['a division sign', 'the symbol meaning shared between'],
        ['a square number', 'the answer when a number is multiplied by itself'],
        ['commutative', 'giving the same product whichever way round you multiply'],
        ['the inverse', 'division, which undoes multiplication']
      ],
      truths: [
        'Every multiple of ten ends in a zero.',
        'Every multiple of five ends in a five or a zero.',
        'Every multiple of two is an even number.',
        'Four times three and three times four give the same product.',
        'Division undoes multiplication, so it can check the answer.'
      ],
      myths: [
        'Multiplying always makes a number bigger.',
        'Six lots of two is a different amount from two lots of six.',
        'Any number ending in five is a multiple of ten.',
        'Sharing and grouping give different answers.',
        'Zero times a number is that number.'
      ],
      applications: [
        ['Five bags hold two apples each. How many apples?', '10'],
        ['Thirty sweets shared between five children. How many each?', '6'],
        ['How many fives make forty-five?', '9'],
        ['A number ends in a zero. Which table is it definitely in?', 'the ten times table'],
        ['Seven rows of two counters. How many counters?', '14']
      ]
    }
  ],
  measurement: [
    {
      name: 'Telling the Time to Five Minutes', from: 'Grade 1', to: 'Grade 4',
      facts: [
        ['an hour hand', 'the short hand, which shows the hour'],
        ['a minute hand', 'the long hand, which shows the minutes'],
        ['an analogue clock', 'a clock with hands and a round face'],
        ['a digital clock', 'a clock that shows the time in numbers'],
        ['o clock', 'the time when the minute hand points to twelve'],
        ['half past', 'thirty minutes after the hour'],
        ['quarter past', 'fifteen minutes after the hour'],
        ['quarter to', 'fifteen minutes before the next hour'],
        ['a.m.', 'the hours from midnight to midday'],
        ['p.m.', 'the hours from midday to midnight'],
        ['midday', 'twelve o clock in the middle of the day'],
        ['midnight', 'twelve o clock in the middle of the night'],
        ['a duration', 'how long something lasts'],
        ['a minute', 'sixty seconds'],
        ['an hour', 'sixty minutes'],
        ['a day', 'twenty-four hours'],
        ['a week', 'seven days'],
        ['a leap year', 'a year with 366 days, every fourth year'],
        ['a timetable', 'a list of times things happen'],
        ['to elapse', 'to pass, said of time between two clock readings']
      ],
      truths: [
        'The minute hand moves all the way round once every hour.',
        'Each number on the clock face is five minutes apart for the minute hand.',
        'Quarter to three is 2:45 on a digital clock.',
        'There are sixty minutes in an hour and sixty seconds in a minute.',
        'Half past four means the hour hand sits between four and five.'
      ],
      myths: [
        'The long hand shows the hour.',
        'Quarter past four means 4:25.',
        'There are one hundred minutes in an hour.',
        'A digital clock showing 15:00 means three in the morning.',
        'The hour hand stays exactly on the number all hour.'
      ],
      applications: [
        ['A film starts at 2:15 and lasts an hour. When does it end?', '3:15'],
        ['The minute hand points to the 3. How many minutes past?', '15'],
        ['What is quarter to seven on a digital clock?', '6:45'],
        ['Break starts at 10:30 and lasts twenty minutes. When does it end?', '10:50'],
        ['How many minutes between 1:20 and 2:00?', '40']
      ]
    },
    {
      name: 'Money: Coins, Change and Totals', from: 'Grade 1', to: 'Grade 4',
      facts: [
        ['a coin', 'a piece of metal money'],
        ['a note', 'a piece of paper money'],
        ['change', 'the money given back when you pay too much'],
        ['a total', 'the cost of everything added together'],
        ['a price', 'what one item costs'],
        ['to spend', 'to give money in exchange for something'],
        ['to save', 'to keep money instead of spending it'],
        ['value', 'how much a coin or note is worth'],
        ['a decimal point', 'the dot separating whole units from parts'],
        ['a discount', 'money taken off the usual price'],
        ['a receipt', 'the printed record of what was paid'],
        ['a budget', 'a plan for how money will be spent'],
        ['an exact amount', 'the right money, needing no change'],
        ['equivalent coins', 'different coins adding to the same value'],
        ['to estimate a cost', 'to work out roughly what shopping will come to'],
        ['cheaper', 'costing less'],
        ['more expensive', 'costing more'],
        ['a difference in price', 'how much more one item costs than another'],
        ['to round to the nearest', 'to replace a price with a close, simpler one'],
        ['affordable', 'costing no more than the money you have']
      ],
      truths: [
        'Change is the amount paid minus the amount owed.',
        'Different sets of coins can make the same total.',
        'A discount makes the final price lower than the ticket price.',
        'Two digits after the decimal point stand for the smaller units.',
        'If you have less money than the total, you cannot afford it.'
      ],
      myths: [
        'A bigger coin is always worth more.',
        'More coins always means more money.',
        'Change is the same as the price.',
        'You can only pay with the exact coins shown on the price label.',
        'A discount makes the price go up.'
      ],
      applications: [
        ['A toy costs 65p and you pay with one pound. What change?', '35p'],
        ['Two items cost 40p and 35p. What is the total?', '75p'],
        ['You have 50p and want a 60p drink. Can you afford it?', 'no'],
        ['A 200p item has 50p off. What is the new price?', '150p'],
        ['Which is cheaper: 89p or 98p?', '89p']
      ]
    }
  ],
  geometry: [
    {
      name: '2D and 3D Shapes and Their Properties', from: 'Grade 1', to: 'Grade 5',
      figures: ['cube'],
      facts: [
        ['a side', 'one straight edge of a flat shape'],
        ['a vertex', 'a corner where edges meet'],
        ['an edge', 'the line where two faces of a solid meet'],
        ['a face', 'one flat surface of a solid'],
        ['a square', 'a shape with four equal sides and four right angles'],
        ['a rectangle', 'a shape with four right angles and opposite sides equal'],
        ['a triangle', 'a shape with three straight sides'],
        ['a pentagon', 'a shape with five straight sides'],
        ['a hexagon', 'a shape with six straight sides'],
        ['a circle', 'a round shape with every point the same distance from the centre'],
        ['a cube', 'a solid with six square faces'],
        ['a cuboid', 'a solid with six rectangular faces'],
        ['a sphere', 'a perfectly round solid'],
        ['a cylinder', 'a solid with two circular ends and a curved surface'],
        ['a cone', 'a solid with a circular base narrowing to a point'],
        ['a pyramid', 'a solid with a flat base and triangular faces meeting at a point'],
        ['symmetry', 'a shape matching itself when folded along a line'],
        ['a line of symmetry', 'the fold line that makes two matching halves'],
        ['a right angle', 'a square corner, a quarter turn'],
        ['a net', 'the flat shape that folds up into a solid']
      ],
      truths: [
        'A cube has six faces, twelve edges and eight vertices.',
        'A square is a rectangle with all four sides the same length.',
        'A circle has no straight sides and no vertices.',
        'A triangular prism has five faces, two of them triangles.',
        'A shape can have more than one line of symmetry.'
      ],
      myths: [
        'A shape turned on its point stops being a square.',
        'A cube and a cuboid are the same solid.',
        'A circle has one side.',
        'A pyramid always has a square base.',
        'Every four-sided shape is a square.'
      ],
      applications: [
        ['How many faces does a cube have?', '6'],
        ['A solid has two circular ends. What is it?', 'a cylinder'],
        ['A flat shape has six straight sides. What is it?', 'a hexagon'],
        ['How many lines of symmetry does a square have?', '4'],
        ['Which solid has a circular base and a point at the top?', 'a cone']
      ]
    }
  ],
  /* ================================= science ================================= */
  biology: [
    {
      name: 'Plants: Parts, Growth and What They Need', from: 'Grade 1', to: 'Grade 5',
      figures: ['flower', 'plant-cell'],
      facts: [
        ['a root', 'the part that anchors a plant and takes in water'],
        ['a stem', 'the part that holds the plant up and carries water'],
        ['a leaf', 'the part that makes food using light'],
        ['a flower', 'the part that makes seeds'],
        ['a petal', 'the coloured part of a flower that attracts insects'],
        ['a seed', 'the part a new plant grows from'],
        ['a bulb', 'an underground store some plants grow from'],
        ['germination', 'the moment a seed starts to grow'],
        ['pollination', 'the moving of pollen from one flower to another'],
        ['a pollinator', 'an animal that carries pollen between flowers'],
        ['seed dispersal', 'the spreading of seeds away from the parent plant'],
        ['sunlight', 'the energy source a plant uses to make food'],
        ['a nutrient', 'a substance in soil that a plant needs to grow well'],
        ['a deciduous tree', 'a tree that loses its leaves in autumn'],
        ['an evergreen tree', 'a tree that keeps its leaves all year'],
        ['a life cycle', 'the stages a living thing passes through'],
        ['a shoot', 'the first stem to appear above ground'],
        ['a fruit', 'the part that forms round a seed'],
        ['a habitat', 'the place a plant or animal lives'],
        ['water', 'the substance roots take up from the soil']
      ],
      truths: [
        'A plant needs light, water, air and space to grow well.',
        'Roots take in water; leaves make food.',
        'A seed can germinate without light but cannot keep growing without it.',
        'Flowers make seeds, and fruit forms around them.',
        'Deciduous trees lose their leaves in autumn; evergreens do not.'
      ],
      myths: [
        'Plants take their food in through the roots.',
        'A plant kept in the dark will grow just as well.',
        'Seeds need soil to germinate.',
        'All plants have flowers.',
        'Watering a plant more always makes it grow faster.'
      ],
      sequences: [
        ['The life cycle of a flowering plant', [
          'A seed lands somewhere with water and warmth',
          'The seed germinates and a root grows down',
          'A shoot grows up and the first leaves open',
          'The plant grows taller and produces flowers',
          'Pollination happens and new seeds form',
          'The seeds are dispersed and the cycle begins again'
        ]]
      ],
      applications: [
        ['Which part of a plant takes in water?', 'the root'],
        ['A plant on a dark shelf goes pale and thin. What is missing?', 'sunlight'],
        ['Which part of a flower attracts insects?', 'the petal'],
        ['What is it called when a seed starts to grow?', 'germination'],
        ['A tree loses all its leaves in autumn. What kind is it?', 'deciduous']
      ]
    },
    {
      name: 'Animals, Habitats and Food Chains', from: 'Grade 1', to: 'Grade 5',
      facts: [
        ['a habitat', 'the place an animal lives'],
        ['a micro-habitat', 'a very small habitat, such as under a log'],
        ['a mammal', 'an animal with fur that feeds its young on milk'],
        ['a bird', 'an animal with feathers, a beak and two legs'],
        ['a reptile', 'a scaly animal that lays eggs on land'],
        ['an amphibian', 'an animal that lives partly in water and partly on land'],
        ['a fish', 'an animal with gills and fins that lives in water'],
        ['an insect', 'a small animal with six legs and three body parts'],
        ['a herbivore', 'an animal that eats only plants'],
        ['a carnivore', 'an animal that eats other animals'],
        ['an omnivore', 'an animal that eats both plants and animals'],
        ['a predator', 'an animal that hunts other animals'],
        ['prey', 'an animal that is hunted'],
        ['a producer', 'a plant, which makes its own food'],
        ['a consumer', 'an animal, which eats other living things'],
        ['a food chain', 'the order in which living things eat one another'],
        ['an adaptation', 'a feature that helps an animal survive where it lives'],
        ['camouflage', 'colouring that helps an animal hide'],
        ['hibernation', 'a deep winter sleep some animals use to survive the cold'],
        ['migration', 'a long seasonal journey to find food or warmth']
      ],
      truths: [
        'Every food chain begins with a producer, which is a plant.',
        'The arrows in a food chain show the direction energy travels.',
        'A predator can also be prey for a larger animal.',
        'Mammals feed their young on milk.',
        'Camouflage helps both predators and prey.'
      ],
      myths: [
        'Food chain arrows point from the eater to the eaten.',
        'All animals that live in water are fish.',
        'A whale is a fish because it swims in the sea.',
        'Every food chain starts with a small animal.',
        'Hibernating animals are simply asleep for a few nights.'
      ],
      applications: [
        ['Grass, rabbit, fox. Which is the producer?', 'grass'],
        ['An animal eats only plants. What is it called?', 'a herbivore'],
        ['A frog begins life in water and later lives on land. What group?', 'an amphibian'],
        ['A stick insect looks like a twig. What adaptation is that?', 'camouflage'],
        ['Swallows fly south each autumn. What is that behaviour called?', 'migration']
      ]
    }
  ],
  physics: [
    {
      name: 'Light, Shadows and Reflection', from: 'Grade 2', to: 'Grade 6',
      facts: [
        ['a light source', 'something that makes its own light'],
        ['the Sun', 'the natural light source that lights the Earth'],
        ['a shadow', 'the dark shape made when light is blocked'],
        ['opaque', 'letting no light through'],
        ['translucent', 'letting some light through, but scattered'],
        ['transparent', 'letting light through clearly'],
        ['reflection', 'light bouncing off a surface'],
        ['a mirror', 'a smooth surface that reflects light clearly'],
        ['a ray', 'a straight line showing the path light takes'],
        ['to travel in straight lines', 'the way light moves until something changes it'],
        ['refraction', 'the bending of light as it passes into water or glass'],
        ['a prism', 'a glass block that splits white light into colours'],
        ['the spectrum', 'the band of colours white light contains'],
        ['a reflective surface', 'a shiny surface that bounces light back'],
        ['a light beam', 'a stream of light travelling from a source'],
        ['darkness', 'the absence of light'],
        ['a periscope', 'a tube using two mirrors to see over things'],
        ['ultraviolet', 'light beyond violet that we cannot see'],
        ['a lens', 'a curved piece of glass that bends light to a point'],
        ['glare', 'uncomfortably bright reflected light']
      ],
      truths: [
        'Light travels in straight lines until it is reflected or refracted.',
        'A shadow forms when an opaque object blocks light.',
        'A shadow gets longer as the light source moves lower.',
        'We see objects because light reflects off them into our eyes.',
        'A mirror reflects light without scattering it, so the image stays clear.'
      ],
      myths: [
        'The Moon makes its own light.',
        'Our eyes send out rays that let us see.',
        'A shadow is a reflection of an object.',
        'Light bends round corners on its own.',
        'A transparent object cannot cast any shadow at all.'
      ],
      sequences: [
        ['How a shadow changes through the day', [
          'The Sun rises low in the sky and shadows are long',
          'The Sun climbs higher through the morning',
          'At midday the Sun is highest and shadows are shortest',
          'Through the afternoon the Sun sinks again',
          'Shadows stretch out long once more before sunset'
        ]]
      ],
      applications: [
        ['Which material makes the darkest shadow: opaque, translucent or transparent?', 'opaque'],
        ['A torch is moved closer to the floor. What happens to the shadow?', 'it gets longer'],
        ['Why can you see a book that makes no light?', 'light reflects off it into your eyes'],
        ['White light passes through a prism. What appears?', 'the spectrum'],
        ['Which object is a natural light source: a mirror, the Sun or the Moon?', 'the Sun']
      ]
    },
    {
      name: 'Forces: Pushes, Pulls and Magnets', from: 'Grade 1', to: 'Grade 5',
      figures: ['forces'],
      facts: [
        ['a force', 'a push or a pull'],
        ['a push', 'a force that moves something away'],
        ['a pull', 'a force that moves something towards you'],
        ['friction', 'the force that slows things sliding over each other'],
        ['gravity', 'the force that pulls everything towards the Earth'],
        ['water resistance', 'the force water applies against a moving object'],
        ['air resistance', 'the force air applies against a moving object'],
        ['a magnet', 'an object that attracts iron and steel'],
        ['a magnetic pole', 'one of the two ends of a magnet'],
        ['a north pole', 'the end of a magnet that points north'],
        ['a south pole', 'the opposite end of a magnet'],
        ['attraction', 'the pulling together of two objects'],
        ['repulsion', 'the pushing apart of two objects'],
        ['a magnetic material', 'a material a magnet attracts'],
        ['iron', 'the common metal magnets attract'],
        ['a contact force', 'a force that needs the objects to touch'],
        ['a non-contact force', 'a force that acts at a distance'],
        ['a newton', 'the unit forces are measured in'],
        ['a force meter', 'the spring device used to measure a force'],
        ['a streamlined shape', 'a shape that cuts down air or water resistance']
      ],
      truths: [
        'Magnetism and gravity act without the objects touching.',
        'Like poles repel and unlike poles attract.',
        'Friction acts against the direction of movement.',
        'A rough surface produces more friction than a smooth one.',
        'Forces are measured in newtons with a force meter.'
      ],
      myths: [
        'All metals are attracted to magnets.',
        'A magnet has to touch an object to pull it.',
        'Two north poles will snap together.',
        'Friction is always a nuisance and never useful.',
        'Heavier objects always fall noticeably faster.'
      ],
      applications: [
        ['Two north poles are brought together. What happens?', 'they repel'],
        ['A sledge slides further on ice than on grass. Why?', 'less friction'],
        ['Which force pulls a dropped ball to the ground?', 'gravity'],
        ['Is a magnet attracted to an aluminium can?', 'no'],
        ['What unit is a force measured in?', 'newtons']
      ]
    }
  ],
  /* =================================== ela =================================== */
  grammar: [
    {
      name: 'Sentences, Capital Letters and Full Stops', from: 'Grade 1', to: 'Grade 4',
      facts: [
        ['a sentence', 'a group of words that makes complete sense on its own'],
        ['a capital letter', 'the large letter that starts a sentence or a name'],
        ['a full stop', 'the mark that ends a statement'],
        ['a question mark', 'the mark that ends a question'],
        ['an exclamation mark', 'the mark that ends an exclamation'],
        ['a statement', 'a sentence that tells you something'],
        ['a question', 'a sentence that asks something'],
        ['a command', 'a sentence that tells someone to do something'],
        ['an exclamation', 'a sentence showing strong feeling'],
        ['a proper noun', 'the name of a particular person, place or day'],
        ['a common noun', 'an ordinary naming word'],
        ['a verb', 'a word for what someone or something does'],
        ['a subject', 'who or what the sentence is about'],
        ['a comma', 'the mark that separates items in a list'],
        ['a conjunction', 'a word that joins two parts of a sentence'],
        ['and', 'the conjunction that adds one idea to another'],
        ['but', 'the conjunction that shows a contrast'],
        ['because', 'the conjunction that gives a reason'],
        ['a finger space', 'the gap left between written words'],
        ['spacing', 'the separation that makes words readable']
      ],
      truths: [
        'Every sentence begins with a capital letter.',
        'Names of people and places always take a capital letter, wherever they sit.',
        'A question ends with a question mark, not a full stop.',
        'A sentence needs a verb to be complete.',
        'Commas separate the items in a list, and "and" comes before the last one.'
      ],
      myths: [
        'Capital letters are only needed at the start of a sentence.',
        'A long group of words is automatically a sentence.',
        'The word "i" does not need a capital in the middle of a sentence.',
        'You can end a question with a full stop if it sounds calm.',
        'Every sentence needs an exclamation mark to sound interesting.'
      ],
      applications: [
        ['Where is the missing capital: "we went to paris"?', 'paris'],
        ['Which mark ends "Are you coming"?', 'a question mark'],
        ['"Ran to the shop." Why is this not a sentence?', 'it has no subject'],
        ['Which conjunction gives a reason?', 'because'],
        ['Which word needs a capital: monday, table, chair?', 'monday']
      ]
    }
  ],
  writing: [
    {
      name: 'Writing a Story: Beginning, Middle and End', from: 'Grade 1', to: 'Grade 5',
      facts: [
        ['an opening', 'the first part of a story, which sets the scene'],
        ['a build-up', 'the part where the story starts to develop'],
        ['a problem', 'the trouble the main character runs into'],
        ['a resolution', 'the part where the problem is sorted out'],
        ['an ending', 'the last part, which rounds the story off'],
        ['a character', 'a person or animal in a story'],
        ['a setting', 'where and when a story happens'],
        ['a plot', 'the events of a story in order'],
        ['a narrator', 'the voice telling the story'],
        ['first person', 'a story told using I'],
        ['third person', 'a story told using he, she or they'],
        ['a description', 'writing that helps a reader picture something'],
        ['an adjective', 'a word that describes a noun'],
        ['dialogue', 'the words characters say'],
        ['speech marks', 'the marks that go round spoken words'],
        ['a paragraph', 'a block of sentences about one part of the story'],
        ['a time connective', 'a word such as "later" that moves the story on'],
        ['a story map', 'a plan showing the events in order'],
        ['to edit', 'to improve writing after drafting it'],
        ['to proofread', 'to check writing for spelling and punctuation mistakes']
      ],
      truths: [
        'A story needs a problem, or nothing happens in it.',
        'A new paragraph is started when the time, place or speaker changes.',
        'Speech marks go round the spoken words only.',
        'Planning a story first makes the middle easier to write.',
        'Editing and proofreading are different jobs done in that order.'
      ],
      myths: [
        'A story is finished as soon as the first draft is written.',
        'Longer stories are always better stories.',
        'You should use as many adjectives as possible in every sentence.',
        'Speech marks go round the whole sentence including "he said".',
        'A story does not need a setting if it has good characters.'
      ],
      sequences: [
        ['Planning and writing a short story', [
          'Decide on a character and a setting',
          'Choose the problem the character will face',
          'Map the events in order on a story map',
          'Write the opening to set the scene',
          'Write the build-up, problem and resolution',
          'Edit for sense, then proofread for spelling and punctuation'
        ]]
      ],
      applications: [
        ['Which part of a story introduces the setting?', 'the opening'],
        ['A story is told using "I". What person is it in?', 'first person'],
        ['When do you start a new paragraph in a story?', 'when the time, place or speaker changes'],
        ['What goes round the words a character says?', 'speech marks'],
        ['Checking for spelling mistakes at the end is called what?', 'proofreading']
      ]
    }
  ],
  /* ================================== social ================================= */
  history: [
    {
      name: 'Then and Now: Life a Hundred Years Ago', from: 'Grade 1', to: 'Grade 5',
      facts: [
        ['the past', 'time that has already happened'],
        ['the present', 'now'],
        ['a century', 'a hundred years'],
        ['a decade', 'ten years'],
        ['a generation', 'the people born around the same time'],
        ['a timeline', 'a line showing events in the order they happened'],
        ['chronological order', 'the order in which things happened'],
        ['a source', 'something from the past that tells us about it'],
        ['a photograph', 'a picture source showing how things looked'],
        ['an artefact', 'an object kept from the past'],
        ['an eyewitness', 'someone who was there at the time'],
        ['an oral history', 'the memories of the past told out loud'],
        ['a museum', 'a place where objects from the past are kept'],
        ['change', 'a way life is different from before'],
        ['continuity', 'a way life has stayed the same'],
        ['a washboard', 'the ridged board once used for washing clothes by hand'],
        ['a mangle', 'the roller machine once used to squeeze water from washing'],
        ['gas lighting', 'the way homes were lit before electricity was common'],
        ['a horse and cart', 'the everyday transport before motor cars'],
        ['a school slate', 'the small writing board children once used instead of paper']
      ],
      truths: [
        'A century is a hundred years and a decade is ten.',
        'A photograph is a source about the moment it was taken.',
        'Some things change over a century and others stay the same.',
        'Two sources about the same event can disagree.',
        'An artefact tells us how something was used, not always who used it.'
      ],
      myths: [
        'Everyone in the past lived exactly the same way.',
        'A hundred years ago everything was black and white, because the photographs are.',
        'Nothing about daily life has stayed the same since then.',
        'A source from the time is always completely reliable.',
        'A century is a thousand years.'
      ],
      applications: [
        ['How many years are in a century?', '100'],
        ['A washboard was used for what job?', 'washing clothes'],
        ['Someone who was there at the time is called what?', 'an eyewitness'],
        ['A line showing events in order is called what?', 'a timeline'],
        ['Homes were lit by gas before what arrived?', 'electricity']
      ]
    }
  ],
  geography: [
    {
      name: 'Maps, Globes and the Continents', from: 'Grade 1', to: 'Grade 5',
      facts: [
        ['a map', 'a drawing of a place seen from above'],
        ['a globe', 'a model of the Earth'],
        ['an atlas', 'a book of maps'],
        ['a key', 'the list explaining what the symbols on a map mean'],
        ['a symbol', 'a small picture standing for a real feature'],
        ['a compass', 'the instrument that shows direction'],
        ['north', 'the direction at the top of most maps'],
        ['a continent', 'one of the seven great land masses'],
        ['an ocean', 'one of the great bodies of salt water'],
        ['the equator', 'the imaginary line round the middle of the Earth'],
        ['a hemisphere', 'half of the Earth, north or south of the equator'],
        ['the North Pole', 'the point at the very top of the Earth'],
        ['the South Pole', 'the point at the very bottom of the Earth'],
        ['a country', 'a land with its own government'],
        ['a capital city', 'the city where a country is governed from'],
        ['a physical feature', 'a natural feature such as a river or mountain'],
        ['a human feature', 'a feature built by people, such as a road'],
        ['a bird’s eye view', 'the view of a place looking straight down'],
        ['a grid reference', 'the letters and numbers locating a square on a map'],
        ['a scale', 'what a distance on the map stands for on the ground']
      ],
      truths: [
        'There are seven continents and five oceans.',
        'The equator runs round the middle of the Earth.',
        'A map key explains what each symbol stands for.',
        'North is at the top of most maps by convention.',
        'A river is a physical feature; a bridge is a human feature.'
      ],
      myths: [
        'A globe and a map show different planets.',
        'The equator is a line you could see from a boat.',
        'Every map has north at the top by law.',
        'Australia is a country but not a continent.',
        'A capital city is always the biggest city in the country.'
      ],
      applications: [
        ['How many continents are there?', '7'],
        ['What explains the symbols on a map?', 'the key'],
        ['Which imaginary line runs round the middle of the Earth?', 'the equator'],
        ['Is a motorway a physical or a human feature?', 'a human feature'],
        ['Which instrument shows you which way is north?', 'a compass']
      ]
    }
  ],
  civics: [
    {
      name: 'Rules, Classrooms and Communities', from: 'Grade 1', to: 'Grade 5',
      facts: [
        ['a rule', 'something you are expected to do or not do'],
        ['a law', 'a rule made by a government for everyone'],
        ['a right', 'something everyone is entitled to'],
        ['a responsibility', 'something you are expected to take care of'],
        ['a community', 'the people who live or work in a place together'],
        ['a citizen', 'a member of a country or community'],
        ['fairness', 'treating people in a way they all deserve'],
        ['a consequence', 'what follows when a rule is broken'],
        ['a vote', 'a choice made by counting what people want'],
        ['a majority', 'more than half of the people voting'],
        ['a school council', 'the group of pupils chosen to speak for the others'],
        ['a representative', 'someone chosen to speak for a group'],
        ['co-operation', 'working together towards the same goal'],
        ['respect', 'treating people and property with care'],
        ['a volunteer', 'someone who helps without being paid'],
        ['a public service', 'something provided for everyone, such as a library'],
        ['an emergency service', 'the police, fire or ambulance service'],
        ['a neighbour', 'someone who lives near you'],
        ['a decision', 'a choice made after thinking it through'],
        ['a compromise', 'an agreement where each side gives something up']
      ],
      truths: [
        'Rules are made to keep people safe and treat them fairly.',
        'A vote is decided by the majority.',
        'Rights come with responsibilities.',
        'A representative speaks for a group, not only for themselves.',
        'A compromise means neither side gets everything they wanted.'
      ],
      myths: [
        'Rules only exist to stop people enjoying themselves.',
        'The loudest person in a vote wins.',
        'Only adults are part of a community.',
        'A law and a classroom rule are the same thing.',
        'Being fair means treating everyone in an identical way in every situation.'
      ],
      applications: [
        ['A class vote is 18 to 12. Which side wins?', 'the 18'],
        ['Who speaks for a class on the school council?', 'a representative'],
        ['A rule made by a government for everyone is called what?', 'a law'],
        ['Someone who helps without being paid is called what?', 'a volunteer'],
        ['Both sides give something up to agree. What is that called?', 'a compromise']
      ]
    }
  ]
};
