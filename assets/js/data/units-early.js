/* Early-years micro-units, Pre-K to about Grade 2.
   These are written to be read aloud: the clue in each pair completes a short
   question ("Which letter makes the sound at the start of ball?"), and the
   true/false statements are the things four- and five-year-olds actually get
   muddled about. `noun` is what the question asks for, so the wording names
   the kind of thing rather than saying "term". */

const early = (name, from, to, noun, facts, truths, myths, procedural = []) =>
  ({ name, from, to, kind: 'early', noun, facts, truths, myths, procedural });

export const EARLY_UNITS = {
  /* ============================ LETTERS AND SOUNDS ============================ */
  phonics: [
    early('Letter Sounds: A to M', 'Pre-K', 'Grade 2', 'letter', [
      ['a', 'makes the sound at the start of “apple”'],
      ['b', 'makes the sound at the start of “ball”'],
      ['c', 'makes the sound at the start of “cat”'],
      ['d', 'makes the sound at the start of “dog”'],
      ['e', 'makes the sound at the start of “egg”'],
      ['f', 'makes the sound at the start of “fish”'],
      ['g', 'makes the sound at the start of “goat”'],
      ['h', 'makes the sound at the start of “hat”'],
      ['i', 'makes the sound at the start of “igloo”'],
      ['j', 'makes the sound at the start of “jam”'],
      ['k', 'makes the sound at the start of “kite”'],
      ['l', 'makes the sound at the start of “leaf”'],
      ['m', 'makes the sound at the start of “moon”'],
      ['ch', 'is a sound made by two letters'],
      ['capital letter', 'is the big form of a letter'],
      ['lower case', 'is the small form of a letter'],
      ['vowel', 'is a, e, i, o or u'],
      ['consonant', 'is any letter that is not a vowel'],
      ['alphabet', 'is all 26 letters in order'],
      ['first letter', 'is the one a word starts with'],
      ['last letter', 'is the one a word ends with']
    ], [
      'Every letter has a name and a sound, and they are not always the same.',
      'The letters a, e, i, o and u are called vowels.',
      'Words are built by putting letter sounds together.',
      'The same letter can sound different in different words.'
    ], [
      'Every letter says its own name in every word.',
      'The letter b is a vowel.',
      'Letters have names but no sounds.',
      'You can read a word without knowing any letter sounds.'
    ], ['count-letters']),
    early('Letter Sounds: N to Z', 'Pre-K', 'Grade 2', 'letter', [
      ['n', 'makes the sound at the start of “nest”'],
      ['o', 'makes the sound at the start of “orange”'],
      ['p', 'makes the sound at the start of “pig”'],
      ['q', 'makes the sound at the start of “queen”'],
      ['r', 'makes the sound at the start of “rain”'],
      ['s', 'makes the sound at the start of “sun”'],
      ['t', 'makes the sound at the start of “tree”'],
      ['u', 'makes the sound at the start of “umbrella”'],
      ['v', 'makes the sound at the start of “van”'],
      ['w', 'makes the sound at the start of “water”'],
      ['x', 'makes the sound at the end of “box”'],
      ['y', 'makes the sound at the start of “yellow”'],
      ['z', 'makes the sound at the start of “zebra”'],
      ['sh', 'is a sound made by two letters'],
      ['silent letter', 'is one you write but do not say'],
      ['short vowel', 'is the sound in “cat”'],
      ['long vowel', 'is the sound in “cake”'],
      ['letter name', 'is what you call the letter'],
      ['letter sound', 'is the noise the letter makes'],
      ['blend', 'is two letters where you hear both'],
      ['digraph', 'is two letters making one sound']
    ], [
      'The letter x usually makes its sound at the end of a word.',
      'The letter q is almost always followed by u.',
      'The letter y can sound like a vowel, as in “happy”.',
      'There are 26 letters in the English alphabet.'
    ], [
      'The letter x is usually the first sound in a word.',
      'The letter q works on its own without u.',
      'The letter y is never a vowel sound.',
      'There are 20 letters in the English alphabet.'
    ], ['count-letters']),
    early('Beginning Sounds', 'Pre-K', 'Grade 2', 'word', [
      ['sun', 'starts with the sound “s”'],
      ['moon', 'starts with the sound “m”'],
      ['bag', 'starts with the sound “b”'],
      ['dog', 'starts with the sound “d”'],
      ['fan', 'starts with the sound “f”'],
      ['hat', 'starts with the sound “h”'],
      ['leg', 'starts with the sound “l”'],
      ['net', 'starts with the sound “n”'],
      ['pen', 'starts with the sound “p”'],
      ['rug', 'starts with the sound “r”'],
      ['top', 'starts with the sound “t”'],
      ['van', 'starts with the sound “v”'],
      ['cup', 'starts with the sound “c”'],
      ['jam', 'starts with the sound “j”'],
      ['kite', 'starts with the sound “k”'],
      ['gate', 'starts with the sound “g”'],
      ['wind', 'starts with the sound “w”'],
      ['yes', 'starts with the sound “y”'],
      ['zip', 'starts with the sound “z”'],
      ['queen', 'starts with the sound “q”']
    ], [
      'The beginning sound is the first sound you hear in a word.',
      'Two different words can start with the same sound.',
      'Saying a word slowly helps you hear its first sound.',
      'The first letter usually makes the first sound.'
    ], [
      'The beginning sound is the last sound you hear.',
      'No two words can start with the same sound.',
      'You have to know how to spell a word to hear its first sound.',
      'Every word starts with a vowel.'
    ], ['first-letter', 'last-letter', 'count-letters']),
    early('Rhyming Words', 'Pre-K', 'Grade 2', 'word', [
      ['cat', 'rhymes with “hat”'],
      ['dog', 'rhymes with “log”'],
      ['tree', 'rhymes with “bee”'],
      ['star', 'rhymes with “car”'],
      ['moon', 'rhymes with “spoon”'],
      ['cake', 'rhymes with “lake”'],
      ['sing', 'rhymes with “ring”'],
      ['fish', 'rhymes with “wish”'],
      ['boat', 'rhymes with “coat”'],
      ['night', 'rhymes with “light”'],
      ['bell', 'rhymes with “shell”'],
      ['duck', 'rhymes with “truck”'],
      ['hop', 'rhymes with “top”'],
      ['pen', 'rhymes with “ten”'],
      ['mice', 'rhymes with “rice”'],
      ['snow', 'rhymes with “grow”'],
      ['chair', 'rhymes with “bear”'],
      ['blue', 'rhymes with “shoe”'],
      ['run', 'rhymes with “sun”'],
      ['play', 'rhymes with “day”']
    ], [
      'Rhyming words end with the same sound.',
      'Rhyming words do not have to be spelled the same way.',
      'Hearing rhymes helps you read new words.',
      'A word can rhyme with more than one other word.'
    ], [
      'Rhyming words must start with the same sound.',
      'Rhyming words must be spelled exactly the same at the end.',
      'A word can only rhyme with one other word.',
      'Rhyming has nothing to do with reading.'
    ], ['first-letter', 'last-letter', 'count-letters']),
    early('CVC Words', 'Kindergarten', 'Grade 2', 'word', [
      ['cat', 'is c–a–t sounded out'],
      ['pen', 'is p–e–n sounded out'],
      ['pig', 'is p–i–g sounded out'],
      ['dog', 'is d–o–g sounded out'],
      ['bus', 'is b–u–s sounded out'],
      ['hat', 'is h–a–t sounded out'],
      ['bed', 'is b–e–d sounded out'],
      ['fin', 'is f–i–n sounded out'],
      ['hop', 'is h–o–p sounded out'],
      ['mug', 'is m–u–g sounded out'],
      ['run', 'is r–u–n sounded out'],
      ['top', 'is t–o–p sounded out'],
      ['sit', 'is s–i–t sounded out'],
      ['map', 'is m–a–p sounded out'],
      ['net', 'is n–e–t sounded out'],
      ['cup', 'is c–u–p sounded out'],
      ['log', 'is l–o–g sounded out'],
      ['fan', 'is f–a–n sounded out'],
      ['wet', 'is w–e–t sounded out'],
      ['tin', 'is t–i–n sounded out']
    ], [
      'A CVC word has a consonant, then a vowel, then a consonant.',
      'Blending means saying the sounds together to make the word.',
      'Segmenting means breaking a word into its separate sounds.',
      'Changing one sound in a CVC word makes a different word.'
    ], [
      'A CVC word always has three vowels.',
      'Blending and segmenting are the same thing.',
      'Changing the middle sound of a word leaves the word the same.',
      'CVC words cannot be sounded out.'
    ], ['first-letter', 'last-letter', 'count-letters']),
    early('Sight Words', 'Kindergarten', 'Grade 2', 'word', [
      ['the', 'is the most common word in English'],
      ['and', 'joins two things together'],
      ['said', 'is what we write when someone speaks'],
      ['you', 'means the person being spoken to'],
      ['was', 'is the past of “is”'],
      ['they', 'means more than one other person'],
      ['have', 'means to own or hold something'],
      ['come', 'means to move towards'],
      ['some', 'means a few but not all'],
      ['there', 'means in that place'],
      ['what', 'begins a question about a thing'],
      ['where', 'begins a question about a place'],
      ['with', 'means together'],
      ['from', 'tells you where something started'],
      ['about', 'means to do with'],
      ['little', 'means small'],
      ['only', 'means no more than'],
      ['water', 'is what we drink'],
      ['because', 'gives a reason'],
      ['people', 'means more than one person']
    ], [
      'Sight words are learned by remembering, not only by sounding out.',
      'Sight words appear in almost every sentence you read.',
      'Some sight words break the usual spelling rules.',
      'Knowing sight words makes reading faster.'
    ], [
      'Every sight word can be sounded out letter by letter.',
      'Sight words are rare and hardly ever appear.',
      'Sight words all follow the normal spelling rules.',
      'Sight words are only for older readers.'
    ], ['first-letter', 'last-letter', 'count-letters']),
    early('Blends and Digraphs', 'Kindergarten', 'Grade 3', 'sound', [
      ['sh', 'is the sound at the start of “ship”'],
      ['ch', 'is the sound at the start of “chip”'],
      ['th', 'is the sound at the start of “thumb”'],
      ['wh', 'is the sound at the start of “whale”'],
      ['bl', 'is the sound at the start of “blue”'],
      ['cl', 'is the sound at the start of “clock”'],
      ['fl', 'is the sound at the start of “flag”'],
      ['gr', 'is the sound at the start of “grass”'],
      ['st', 'is the sound at the start of “star”'],
      ['tr', 'is the sound at the start of “tree”'],
      ['sn', 'is the sound at the start of “snake”'],
      ['sp', 'is the sound at the start of “spoon”'],
      ['dr', 'is the sound at the start of “drum”'],
      ['pl', 'is the sound at the start of “plant”'],
      ['sw', 'is the sound at the start of “swim”'],
      ['br', 'is the sound at the start of “bread”'],
      ['ck', 'is the sound at the end of “duck”'],
      ['ng', 'is the sound at the end of “ring”'],
      ['sl', 'is the sound at the start of “sleep”'],
      ['cr', 'is the sound at the start of “crab”']
    ], [
      'A digraph is two letters that make one sound, like sh.',
      'A blend is two letters where you hear both sounds, like bl.',
      'The letters th make one sound, not two.',
      'Blends and digraphs can come at the end of a word too.'
    ], [
      'A digraph makes two separate sounds.',
      'In a blend you only hear one of the letters.',
      'Digraphs can only come at the start of a word.',
      'The letters sh make the same sound as s and h said separately.'
    ], ['count-letters']),
    early('Syllables', 'Kindergarten', 'Grade 3', 'word', [
      ['cat', 'has one syllable'],
      ['rabbit', 'has two syllables'],
      ['elephant', 'has three syllables'],
      ['sun', 'has one syllable'],
      ['garden', 'has two syllables'],
      ['banana', 'has three syllables'],
      ['dog', 'has one syllable'],
      ['window', 'has two syllables'],
      ['butterfly', 'has three syllables'],
      ['book', 'has one syllable'],
      ['pencil', 'has two syllables'],
      ['dinosaur', 'has three syllables'],
      ['apple', 'has two syllables'],
      ['computer', 'has three syllables'],
      ['hat', 'has one syllable'],
      ['water', 'has two syllables'],
      ['telephone', 'has three syllables'],
      ['chair', 'has one syllable'],
      ['monkey', 'has two syllables'],
      ['umbrella', 'has three syllables']
    ], [
      'A syllable is a beat in a word.',
      'You can clap the syllables in a word.',
      'Every syllable has one vowel sound.',
      'Longer words usually have more syllables.'
    ], [
      'A syllable is the same as a letter.',
      'Every word has exactly one syllable.',
      'A syllable can have no vowel sound at all.',
      'Short words always have more syllables than long ones.'
    ], ['first-letter', 'count-letters'])
  ],

  /* ================================ EARLY NUMBER ================================ */
  earlynumber: [
    early('Counting to 10', 'Pre-K', 'Grade 1', 'number', [
      ['1', 'comes first when you count'],
      ['2', 'comes after 1'],
      ['3', 'comes after 2'],
      ['4', 'comes after 3'],
      ['5', 'is the number of fingers on one hand'],
      ['6', 'comes after 5'],
      ['7', 'comes after 6'],
      ['8', 'comes after 7'],
      ['9', 'comes just before 10'],
      ['10', 'is the number of fingers on two hands']
    ], [
      'Counting means saying one number for each thing.',
      'The last number you say is how many there are.',
      'It does not matter what order you count things in — the total is the same.',
      'Zero means none at all.'
    ], [
      'You can skip a number and still count correctly.',
      'The first number you say is how many there are.',
      'Counting the same things in a different order gives a different total.',
      'Zero means one.'
    ], ['count-objects', 'count-choose', 'what-comes-next', 'what-came-before', 'one-more', 'one-less', 'bigger-number', 'add-pictures', 'number-bond']),
    early('Counting to 20', 'Pre-K', 'Grade 2', 'number', [
      ['11', 'comes after 10'],
      ['12', 'comes after 11'],
      ['13', 'comes after 12'],
      ['14', 'comes after 13'],
      ['15', 'is halfway between 10 and 20'],
      ['16', 'comes after 15'],
      ['17', 'comes after 16'],
      ['18', 'comes after 17'],
      ['19', 'comes just before 20'],
      ['20', 'is two lots of ten'],
      ['10', 'is one lot of ten'],
      ['0', 'means none']
    ], [
      'The numbers 11 to 19 are ten and some more.',
      'Twenty is two tens.',
      'Numbers keep going on for ever.',
      'Counting backwards is also counting.'
    ], [
      'The number 13 comes before 12.',
      'Twenty is ten tens.',
      'Numbers stop at 20.',
      'You can only count forwards.'
    ], ['count-objects', 'count-choose', 'what-comes-next', 'what-came-before', 'one-more', 'one-less', 'bigger-number', 'add-numbers', 'number-bond']),
    early('Counting to 100', 'Kindergarten', 'Grade 2', 'number', [
      ['30', 'is three tens'],
      ['40', 'is four tens'],
      ['50', 'is halfway to 100'],
      ['60', 'is six tens'],
      ['70', 'is seven tens'],
      ['80', 'is eight tens'],
      ['90', 'comes just before 100'],
      ['100', 'is ten tens'],
      ['25', 'is two tens and five'],
      ['42', 'is four tens and two'],
      ['67', 'is six tens and seven'],
      ['99', 'is the biggest two-digit number']
    ], [
      'A two-digit number is made of tens and ones.',
      'In 42, the 4 means four tens and the 2 means two ones.',
      'One hundred is ten groups of ten.',
      'Counting in tens is faster than counting in ones.'
    ], [
      'In 42, the 4 means four ones.',
      'One hundred is one hundred groups of ten.',
      'Two-digit numbers have no tens in them.',
      'Counting in tens gives a different answer from counting in ones.'
    ], ['what-comes-next', 'what-came-before', 'one-more', 'one-less', 'bigger-number', 'skip-count']),
    early('Number Words', 'Pre-K', 'Grade 2', 'word', [
      ['one', 'is the word for 1'],
      ['two', 'is the word for 2'],
      ['three', 'is the word for 3'],
      ['four', 'is the word for 4'],
      ['five', 'is the word for 5'],
      ['six', 'is the word for 6'],
      ['seven', 'is the word for 7'],
      ['eight', 'is the word for 8'],
      ['nine', 'is the word for 9'],
      ['ten', 'is the word for 10'],
      ['zero', 'is the word for 0'],
      ['twenty', 'is the word for 20']
    ], [
      'Every number can be written as a numeral or as a word.',
      'The word and the numeral mean exactly the same amount.',
      'Number words are used when we write numbers in sentences.',
      'Zero has a word of its own.'
    ], [
      'The word “three” means a different amount from 3.',
      'Only small numbers have words.',
      'Zero has no word for it.',
      'Number words are spelled the same as they sound.'
    ], ['number-word', 'what-comes-next', 'count-letters']),
    early('More, Fewer and the Same', 'Pre-K', 'Grade 2', 'word', [
      ['more', 'means a bigger amount'],
      ['fewer', 'means a smaller amount of things you can count'],
      ['less', 'means a smaller amount of something you cannot count'],
      ['the same', 'means both amounts are equal'],
      ['most', 'means the biggest of all'],
      ['least', 'means the smallest of all'],
      ['bigger', 'means larger in size'],
      ['smaller', 'means less in size'],
      ['equal', 'means exactly the same amount'],
      ['greater than', 'is what the sign > means'],
      ['less than', 'is what the sign < means'],
      ['pair', 'means a group of two']
    ], [
      'To compare two groups you can match them one to one.',
      'The group with things left over has more.',
      'Two groups can have the same number even if they look different.',
      'A bigger object is not always a bigger number of things.'
    ], [
      'The group that takes up more space always has more things.',
      'Two groups that look different can never be equal.',
      'Matching one to one does not help you compare.',
      'More and fewer mean the same thing.'
    ], ['bigger-number', 'one-more', 'one-less', 'count-choose']),
    early('Adding to 10', 'Kindergarten', 'Grade 2', 'answer', [
      ['2', 'is 1 + 1'],
      ['4', 'is 2 + 2'],
      ['5', 'is 3 + 2'],
      ['6', 'is 3 + 3'],
      ['7', 'is 4 + 3'],
      ['8', 'is 4 + 4'],
      ['9', 'is 5 + 4'],
      ['10', 'is 5 + 5'],
      ['3', 'is 2 + 1'],
      ['10', 'is 6 + 4'],
      ['10', 'is 7 + 3'],
      ['10', 'is 8 + 2']
    ], [
      'Adding means putting groups together.',
      'You can add two numbers in either order and get the same answer.',
      'Adding zero to a number leaves it unchanged.',
      'There is more than one pair of numbers that makes 10.'
    ], [
      'Adding always makes a number smaller.',
      'Changing the order of the numbers changes the answer.',
      'Adding zero makes a number bigger.',
      'Only one pair of numbers can make 10.'
    ], ['add-pictures', 'add-numbers', 'number-bond', 'doubles', 'one-more']),
    early('Taking Away', 'Kindergarten', 'Grade 2', 'answer', [
      ['1', 'is 2 − 1'],
      ['2', 'is 4 − 2'],
      ['3', 'is 5 − 2'],
      ['4', 'is 6 − 2'],
      ['5', 'is 10 − 5'],
      ['0', 'is 3 − 3'],
      ['6', 'is 9 − 3'],
      ['7', 'is 10 − 3'],
      ['2', 'is 8 − 6'],
      ['1', 'is 7 − 6'],
      ['4', 'is 9 − 5'],
      ['3', 'is 8 − 5']
    ], [
      'Taking away means finding how many are left.',
      'Subtracting zero leaves the number unchanged.',
      'Taking a number away from itself leaves zero.',
      'Subtraction can also mean finding the difference between two numbers.'
    ], [
      'You can take numbers away in either order and get the same answer.',
      'Subtracting zero makes a number smaller.',
      'Taking a number away from itself leaves that number.',
      'Subtraction always makes a number bigger.'
    ], ['take-away', 'one-less', 'what-came-before', 'count-objects']),
    early('Doubles and Halves', 'Kindergarten', 'Grade 2', 'answer', [
      ['4', 'is double 2'],
      ['6', 'is double 3'],
      ['8', 'is double 4'],
      ['10', 'is double 5'],
      ['12', 'is double 6'],
      ['14', 'is double 7'],
      ['16', 'is double 8'],
      ['18', 'is double 9'],
      ['20', 'is double 10'],
      ['2', 'is half of 4'],
      ['5', 'is half of 10'],
      ['3', 'is half of 6'],
      ['22', 'is double 11'],
      ['24', 'is double 12'],
      ['4', 'is half of 8'],
      ['6', 'is half of 12'],
      ['7', 'is half of 14'],
      ['8', 'is half of 16'],
      ['9', 'is half of 18'],
      ['10', 'is half of 20']
    ], [
      'Doubling means adding a number to itself.',
      'Halving is the opposite of doubling.',
      'Doubling any whole number gives an even number.',
      'Knowing doubles helps you add quickly.'
    ], [
      'Doubling means adding one to a number.',
      'Halving and doubling do the same thing.',
      'Doubling a number can give an odd number.',
      'Doubles are no help with adding.'
    ], ['doubles', 'add-numbers', 'number-bond']),
    early('Ordinal Numbers', 'Pre-K', 'Grade 2', 'word', [
      ['first', 'is the one at the front'],
      ['second', 'comes after first'],
      ['third', 'comes after second'],
      ['fourth', 'comes after third'],
      ['fifth', 'comes after fourth'],
      ['sixth', 'comes after fifth'],
      ['seventh', 'comes after sixth'],
      ['eighth', 'comes after seventh'],
      ['ninth', 'comes after eighth'],
      ['tenth', 'comes after ninth'],
      ['last', 'is the one at the end'],
      ['next', 'is the one that comes after this one']
    ], [
      'Ordinal numbers tell you the position of something.',
      'First, second and third describe order, not how many.',
      'The last one is at the end of the line, however long the line is.',
      'Ordinal numbers depend on which end you start counting from.'
    ], [
      'Ordinal numbers tell you how many things there are.',
      'The third one is always the biggest.',
      'First and last mean the same thing.',
      'Ordinal numbers stop at tenth.'
    ], ['what-comes-next', 'count-objects']),
    early('Skip Counting', 'Kindergarten', 'Grade 3', 'number', [
      ['2', 'comes after 0 when counting in twos'],
      ['4', 'comes after 2 when counting in twos'],
      ['6', 'comes after 4 when counting in twos'],
      ['10', 'comes after 5 when counting in fives'],
      ['15', 'comes after 10 when counting in fives'],
      ['20', 'comes after 15 when counting in fives'],
      ['20', 'comes after 10 when counting in tens'],
      ['30', 'comes after 20 when counting in tens'],
      ['50', 'comes after 40 when counting in tens'],
      ['12', 'comes after 9 when counting in threes'],
      ['16', 'comes after 12 when counting in fours'],
      ['25', 'comes after 20 when counting in fives'],
      ['8', 'comes after 6 when counting in twos'],
      ['14', 'comes after 12 when counting in twos'],
      ['35', 'comes after 30 when counting in fives'],
      ['45', 'comes after 40 when counting in fives'],
      ['60', 'comes after 50 when counting in tens'],
      ['18', 'comes after 15 when counting in threes'],
      ['24', 'comes after 20 when counting in fours'],
      ['70', 'comes after 60 when counting in tens']
    ], [
      'Skip counting means counting in equal jumps.',
      'Counting in twos gives the even numbers.',
      'Skip counting is a quick way to count groups of the same size.',
      'Counting in fives, every number ends in 0 or 5.'
    ], [
      'Skip counting means missing numbers out at random.',
      'Counting in twos gives the odd numbers.',
      'Skip counting takes longer than counting in ones.',
      'Counting in fives, the numbers end in any digit.'
    ], ['skip-count', 'add-numbers', 'what-comes-next'])
  ],

  /* ======================== SHAPES, COLOURS AND PATTERNS ======================== */
  shapescolour: [
    early('2D Shapes', 'Pre-K', 'Grade 2', 'shape', [
      ['circle', 'is round with no corners'],
      ['square', 'has four sides all the same length'],
      ['triangle', 'has three sides'],
      ['rectangle', 'has four sides with two long and two short'],
      ['oval', 'is like a stretched circle'],
      ['star', 'has five points'],
      ['heart', 'has two curves and a point'],
      ['diamond', 'is a square standing on one corner'],
      ['pentagon', 'has five sides'],
      ['hexagon', 'has six sides'],
      ['octagon', 'has eight sides'],
      ['semicircle', 'is half a circle']
    ], [
      'A shape with three sides is a triangle, however it is turned.',
      'A square is a special kind of rectangle.',
      'The number of corners is the same as the number of sides.',
      'A circle has no corners at all.'
    ], [
      'A triangle stops being a triangle when you turn it upside down.',
      'A square and a rectangle have nothing in common.',
      'A shape can have more corners than sides.',
      'A circle has four corners.'
    ], ['shape-sides', 'shape-from-sides', 'count-letters']),
    early('3D Shapes', 'Kindergarten', 'Grade 3', 'shape', [
      ['cube', 'has six square faces'],
      ['sphere', 'is perfectly round like a ball'],
      ['cylinder', 'is round like a tin with flat ends'],
      ['cone', 'has a circle at the bottom and a point at the top'],
      ['pyramid', 'has a flat base and triangle sides meeting at a point'],
      ['cuboid', 'is box-shaped with six rectangle faces'],
      ['face', 'is a flat surface on a solid shape'],
      ['edge', 'is where two faces meet'],
      ['vertex', 'is a corner where edges meet'],
      ['prism', 'has the same shape all the way through'],
      ['solid', 'is a shape you can hold'],
      ['flat', 'is a shape you can draw on paper'],
      ['triangular prism', 'has two triangle ends and three rectangle sides'],
      ['hemisphere', 'is half a sphere'],
      ['net', 'is a flat shape that folds into a solid'],
      ['curved surface', 'is a face that is not flat'],
      ['base', 'is the face a solid stands on'],
      ['apex', 'is the point at the top of a cone or pyramid'],
      ['roll', 'is what round solids do'],
      ['stack', 'is what flat-faced solids do']
    ], [
      'A 3D shape takes up space; a 2D shape is flat.',
      'A cube has six faces, twelve edges and eight corners.',
      'A sphere can roll in any direction.',
      'A cylinder can roll one way but not the other.'
    ], [
      'A cube and a square are the same shape.',
      'A sphere has flat faces.',
      'Every 3D shape can roll.',
      'A cube has four faces.'
    ], ['shape-sides', 'shape-from-sides']),
    early('Colours', 'Pre-K', 'Grade 2', 'colour', [
      ['red', 'is the colour of a strawberry'],
      ['blue', 'is the colour of the sky on a clear day'],
      ['yellow', 'is the colour of a banana'],
      ['green', 'is the colour of grass'],
      ['orange', 'is the colour of a carrot'],
      ['purple', 'is the colour of a plum'],
      ['brown', 'is the colour of a tree trunk'],
      ['black', 'is the colour of night'],
      ['white', 'is the colour of snow'],
      ['pink', 'is the colour you get by adding white to red'],
      ['grey', 'is the colour between black and white'],
      ['gold', 'is the colour of a shiny coin'],
      ['silver', 'is the colour of a shiny spoon'],
      ['turquoise', 'is the colour between blue and green'],
      ['cream', 'is a very pale yellow-white'],
      ['navy', 'is a very dark blue'],
      ['lime', 'is a bright yellow-green'],
      ['maroon', 'is a dark brownish red'],
      ['primary colours', 'are red, blue and yellow'],
      ['secondary colours', 'are orange, green and purple']
    ], [
      'Red, blue and yellow are called primary colours.',
      'Mixing blue and yellow makes green.',
      'Mixing red and yellow makes orange.',
      'Adding white to a colour makes it lighter.'
    ], [
      'Green is a primary colour.',
      'Mixing blue and yellow makes purple.',
      'Adding white to a colour makes it darker.',
      'You can only make new colours with paint, not with light.'
    ], ['first-letter', 'count-letters']),
    early('Patterns', 'Pre-K', 'Grade 2', 'pattern', [
      ['ABAB', 'repeats two things over and over'],
      ['AABB', 'repeats two of each thing'],
      ['ABC', 'repeats three different things'],
      ['repeat', 'means to do the same thing again'],
      ['the core', 'is the part of a pattern that repeats'],
      ['next', 'is what comes after in the pattern'],
      ['growing pattern', 'gets bigger each step'],
      ['shrinking pattern', 'gets smaller each step'],
      ['colour pattern', 'repeats colours in order'],
      ['shape pattern', 'repeats shapes in order'],
      ['sound pattern', 'repeats claps or beats in order'],
      ['rule', 'tells you what happens next in a pattern']
    ], [
      'A pattern repeats in a way you can predict.',
      'Finding the part that repeats tells you what comes next.',
      'Patterns can be made from colours, shapes, sounds or movements.',
      'A growing pattern changes by the same amount each time.'
    ], [
      'A pattern is any group of things in any order.',
      'You cannot tell what comes next in a pattern.',
      'Patterns can only be made from colours.',
      'A growing pattern changes by a different amount each time.'
    ], ['skip-count', 'what-comes-next']),
    early('Sorting and Grouping', 'Pre-K', 'Grade 2', 'word', [
      ['sort', 'means to put things into groups'],
      ['group', 'is a set of things that go together'],
      ['same', 'means alike in some way'],
      ['different', 'means not alike'],
      ['by colour', 'is sorting using what colour things are'],
      ['by size', 'is sorting using how big things are'],
      ['by shape', 'is sorting using what shape things are'],
      ['odd one out', 'is the one that does not belong'],
      ['set', 'is another word for a group'],
      ['label', 'tells you what a group is'],
      ['count', 'tells you how many are in a group'],
      ['compare', 'means to look for what is the same and different']
    ], [
      'The same things can be sorted in more than one way.',
      'A sorting rule says what all the things in a group have in common.',
      'Something can belong to two groups at once.',
      'Counting each group tells you which has the most.'
    ], [
      'There is only one right way to sort a set of things.',
      'Something can only ever belong to one group.',
      'A sorting rule can change halfway through.',
      'You cannot compare two groups without counting.'
    ], ['count-objects', 'count-choose', 'bigger-number']),
    early('Size and Measuring', 'Pre-K', 'Grade 2', 'word', [
      ['long', 'means it goes a long way from end to end'],
      ['short', 'means it does not go far from end to end'],
      ['tall', 'means it goes a long way up'],
      ['heavy', 'means it is hard to lift'],
      ['light', 'means it is easy to lift'],
      ['full', 'means there is no room left'],
      ['empty', 'means there is nothing inside'],
      ['ruler', 'is used to measure how long something is'],
      ['scales', 'are used to measure how heavy something is'],
      ['longer', 'means longer than something else'],
      ['shortest', 'means shorter than all the others'],
      ['about the same', 'means very close in size']
    ], [
      'To compare lengths fairly you line things up at the same end.',
      'A big thing is not always a heavy thing.',
      'You can measure with hands or blocks before you use a ruler.',
      'Measuring the same thing twice should give the same answer.'
    ], [
      'The bigger something looks, the heavier it must be.',
      'It does not matter where you start when measuring length.',
      'Only rulers can be used to measure.',
      'Measuring the same thing twice gives different answers.'
    ], ['bigger-number', 'count-objects'])
  ],

  /* ========================== THE WORLD AROUND US ========================== */
  worldaround: [
    early('Farm and Wild Animals', 'Pre-K', 'Grade 2', 'animal', [
      ['cow', 'gives us milk'],
      ['sheep', 'gives us wool'],
      ['hen', 'lays eggs'],
      ['pig', 'rolls in mud to keep cool'],
      ['horse', 'can be ridden'],
      ['lion', 'is called the king of the jungle'],
      ['elephant', 'is the biggest land animal'],
      ['giraffe', 'has the longest neck'],
      ['monkey', 'swings through the trees'],
      ['penguin', 'is a bird that swims but cannot fly'],
      ['bear', 'sleeps through the winter'],
      ['frog', 'starts life as a tadpole'],
      ['duck', 'swims on the pond'],
      ['goat', 'eats almost anything'],
      ['tiger', 'has orange fur with black stripes'],
      ['zebra', 'has black and white stripes'],
      ['snake', 'has no legs at all'],
      ['owl', 'hunts at night'],
      ['dolphin', 'lives in the sea and breathes air'],
      ['camel', 'stores fat in its hump']
    ], [
      'Farm animals are looked after by people.',
      'Wild animals find their own food.',
      'A penguin is a bird even though it cannot fly.',
      'Different animals need different homes.'
    ], [
      'All animals live on farms.',
      'A penguin is a fish because it swims.',
      'Every bird can fly.',
      'All animals eat the same food.'
    ], ['first-letter', 'count-letters']),
    early('Baby Animals', 'Pre-K', 'Grade 2', 'animal', [
      ['puppy', 'is a baby dog'],
      ['kitten', 'is a baby cat'],
      ['lamb', 'is a baby sheep'],
      ['calf', 'is a baby cow'],
      ['chick', 'is a baby hen'],
      ['foal', 'is a baby horse'],
      ['piglet', 'is a baby pig'],
      ['cub', 'is a baby lion or bear'],
      ['duckling', 'is a baby duck'],
      ['tadpole', 'is a baby frog'],
      ['caterpillar', 'turns into a butterfly'],
      ['joey', 'is a baby kangaroo'],
      ['cygnet', 'is a baby swan'],
      ['gosling', 'is a baby goose'],
      ['fawn', 'is a baby deer'],
      ['kid', 'is a baby goat'],
      ['owlet', 'is a baby owl'],
      ['leveret', 'is a baby hare'],
      ['nymph', 'is a young dragonfly'],
      ['pup', 'is a baby seal']
    ], [
      'Baby animals often have a name of their own.',
      'Some baby animals look very different from their parents.',
      'A tadpole grows legs and becomes a frog.',
      'Baby animals need looking after when they are small.'
    ], [
      'Every baby animal is just called a baby.',
      'Baby animals always look exactly like their parents.',
      'A tadpole grows into a fish.',
      'Baby animals can look after themselves from the first day.'
    ], ['first-letter', 'count-letters']),
    early('Weather', 'Pre-K', 'Grade 2', 'word', [
      ['sunny', 'means the sun is shining'],
      ['rainy', 'means water is falling from the clouds'],
      ['cloudy', 'means the sky is covered'],
      ['windy', 'means the air is moving fast'],
      ['snowy', 'means frozen water is falling'],
      ['foggy', 'means it is hard to see far'],
      ['stormy', 'means there is thunder and heavy rain'],
      ['rainbow', 'appears when sun shines through rain'],
      ['thunder', 'is the sound that follows lightning'],
      ['lightning', 'is a flash of light in a storm'],
      ['puddle', 'is water left on the ground after rain'],
      ['umbrella', 'keeps the rain off you'],
      ['hail', 'is small balls of ice falling'],
      ['breeze', 'is a gentle wind'],
      ['frost', 'is ice on the ground in the morning'],
      ['drizzle', 'is very light rain'],
      ['forecast', 'tells you what weather is coming'],
      ['thermometer', 'measures how warm it is'],
      ['wellies', 'keep your feet dry in the rain'],
      ['sunglasses', 'protect your eyes in bright sun']
    ], [
      'Weather changes from day to day.',
      'You see lightning before you hear thunder.',
      'Rainbows need both sunshine and rain.',
      'What you wear depends on the weather.'
    ], [
      'The weather is the same every day.',
      'You hear thunder before you see lightning.',
      'A rainbow appears when it is only sunny.',
      'It is always warm when the sun is out.'
    ], ['first-letter', 'count-letters']),
    early('The Seasons', 'Pre-K', 'Grade 2', 'season', [
      ['spring', 'is when plants start to grow again'],
      ['summer', 'is the warmest season'],
      ['autumn', 'is when leaves fall from the trees'],
      ['winter', 'is the coldest season'],
      ['blossom', 'appears on trees in spring'],
      ['holiday', 'often happens in the summer'],
      ['harvest', 'is when crops are gathered in autumn'],
      ['snow', 'often falls in winter'],
      ['shorter days', 'happen in winter'],
      ['longer days', 'happen in summer'],
      ['bare trees', 'are seen in winter'],
      ['new leaves', 'grow in spring'],
      ['frost', 'forms on cold winter mornings'],
      ['daffodil', 'is a flower that appears in spring'],
      ['hibernate', 'is what some animals do in winter'],
      ['migrate', 'is what some birds do in autumn'],
      ['sun cream', 'protects you in summer'],
      ['scarf', 'keeps you warm in winter'],
      ['conker', 'falls from a tree in autumn'],
      ['lamb', 'is often born in spring']
    ], [
      'There are four seasons in a year.',
      'The seasons always come round in the same order.',
      'Days are shorter in winter than in summer.',
      'Different places have their seasons at different times of year.'
    ], [
      'There are two seasons in a year.',
      'The seasons come in a different order each year.',
      'Days are longest in winter.',
      'Every country has winter at the same time.'
    ], ['first-letter', 'count-letters']),
    early('Parts of the Body', 'Pre-K', 'Grade 2', 'part', [
      ['head', 'is at the top of your body'],
      ['arm', 'joins your hand to your shoulder'],
      ['leg', 'you use to walk'],
      ['hand', 'has five fingers'],
      ['foot', 'has five toes'],
      ['eye', 'you use to see'],
      ['ear', 'you use to hear'],
      ['nose', 'you use to smell'],
      ['mouth', 'you use to eat and speak'],
      ['knee', 'is the bend in the middle of your leg'],
      ['elbow', 'is the bend in the middle of your arm'],
      ['shoulder', 'is where your arm joins your body'],
      ['finger', 'is one of five on a hand'],
      ['toe', 'is one of five on a foot'],
      ['hair', 'grows on your head'],
      ['tooth', 'you use to chew'],
      ['tongue', 'you use to taste'],
      ['neck', 'joins your head to your body'],
      ['back', 'is behind you'],
      ['tummy', 'is the front of your middle']
    ], [
      'You have two of some body parts and one of others.',
      'Your bones give your body its shape.',
      'Your heart beats faster when you run about.',
      'Everybody’s body is a little bit different.'
    ], [
      'You have two noses.',
      'Your body has no bones inside it.',
      'Your heart beats slower when you run.',
      'Everybody’s body is exactly the same.'
    ], ['first-letter', 'count-letters']),
    early('The Five Senses', 'Pre-K', 'Grade 2', 'sense', [
      ['sight', 'is what you use your eyes for'],
      ['hearing', 'is what you use your ears for'],
      ['smell', 'is what you use your nose for'],
      ['taste', 'is what you use your tongue for'],
      ['touch', 'is what you use your skin for'],
      ['loud', 'is something you hear easily'],
      ['quiet', 'is something you can hardly hear'],
      ['sweet', 'is how sugar tastes'],
      ['sour', 'is how a lemon tastes'],
      ['rough', 'is how sandpaper feels'],
      ['smooth', 'is how glass feels'],
      ['bright', 'is something easy to see'],
      ['salty', 'is how the sea tastes'],
      ['bitter', 'is how coffee tastes'],
      ['soft', 'is how a pillow feels'],
      ['hard', 'is how a stone feels'],
      ['sweet-smelling', 'is how a flower smells'],
      ['dark', 'is when there is no light to see by'],
      ['silent', 'is when there is nothing to hear'],
      ['warm', 'is how a radiator feels']
    ], [
      'We have five main senses.',
      'Senses tell us about the world around us.',
      'Smell and taste work together when you eat.',
      'People who cannot use one sense often use the others more.'
    ], [
      'We have two senses.',
      'Your ears are used for tasting.',
      'Smell and taste have nothing to do with each other.',
      'Everybody senses things in exactly the same way.'
    ], ['first-letter', 'count-letters']),
    early('Food Groups', 'Pre-K', 'Grade 2', 'food', [
      ['apple', 'is a fruit'],
      ['carrot', 'is a vegetable'],
      ['bread', 'gives you energy'],
      ['milk', 'helps build strong bones'],
      ['egg', 'helps you grow'],
      ['fish', 'helps you grow'],
      ['rice', 'gives you energy'],
      ['cheese', 'is made from milk'],
      ['banana', 'is a fruit'],
      ['potato', 'is a vegetable'],
      ['water', 'is the best drink for you'],
      ['cake', 'is a sometimes food'],
      ['orange', 'is a fruit'],
      ['broccoli', 'is a vegetable'],
      ['pasta', 'gives you energy'],
      ['yoghurt', 'is made from milk'],
      ['beans', 'help you grow'],
      ['nuts', 'help you grow'],
      ['butter', 'is a fat'],
      ['sweets', 'are a sometimes food']
    ], [
      'Eating different kinds of food keeps you healthy.',
      'Fruit and vegetables should be eaten every day.',
      'Water is the best thing to drink when you are thirsty.',
      'Some foods are for special occasions rather than every day.'
    ], [
      'Eating only one food keeps you healthy.',
      'Fruit and vegetables are only for grown-ups.',
      'Sugary drinks are better for you than water.',
      'Every food is an everyday food.'
    ], ['first-letter', 'count-letters']),
    early('Plants and Growing', 'Kindergarten', 'Grade 3', 'part', [
      ['seed', 'is what a plant grows from'],
      ['root', 'takes in water from the soil'],
      ['stem', 'holds the plant up'],
      ['leaf', 'catches the sunlight'],
      ['flower', 'is the colourful part that makes seeds'],
      ['soil', 'is what most plants grow in'],
      ['water', 'is what a plant needs to drink'],
      ['sunlight', 'is what a plant needs to make food'],
      ['bud', 'is a flower before it opens'],
      ['fruit', 'grows where the flower was'],
      ['tree', 'is a very big plant with a woody stem'],
      ['grow', 'is what a plant does when it gets bigger'],
      ['petal', 'is one coloured part of a flower'],
      ['stalk', 'is another word for the stem'],
      ['shoot', 'is the first green part to appear'],
      ['pot', 'is what a plant can grow in indoors'],
      ['watering can', 'is used to give plants a drink'],
      ['greenhouse', 'keeps plants warm so they grow'],
      ['weed', 'is a plant growing where it is not wanted'],
      ['compost', 'is rotted material that feeds the soil']
    ], [
      'Plants need water, light and air to grow.',
      'Roots grow downwards and stems grow upwards.',
      'A plant makes its own food using sunlight.',
      'Most plants start life as a seed.'
    ], [
      'Plants grow best in the dark.',
      'Roots grow upwards towards the sun.',
      'Plants get all their food from the soil.',
      'Plants grow from stones.'
    ], ['first-letter', 'count-letters']),
    early('Day and Night', 'Pre-K', 'Grade 2', 'word', [
      ['day', 'is when the sun is up'],
      ['night', 'is when it is dark outside'],
      ['sun', 'gives us light and warmth in the day'],
      ['moon', 'we often see at night'],
      ['stars', 'shine in the night sky'],
      ['morning', 'is the start of the day'],
      ['afternoon', 'comes after lunchtime'],
      ['evening', 'comes at the end of the day'],
      ['sunrise', 'is when the sun comes up'],
      ['sunset', 'is when the sun goes down'],
      ['shadow', 'appears when something blocks the light'],
      ['bedtime', 'is when we go to sleep'],
      ['noon', 'is the middle of the day'],
      ['dawn', 'is when the light first comes'],
      ['dusk', 'is when the light fades'],
      ['nocturnal', 'describes animals that are awake at night'],
      ['torch', 'gives light in the dark'],
      ['curtains', 'are closed when it gets dark'],
      ['alarm clock', 'wakes you in the morning'],
      ['lunchtime', 'is in the middle of the day']
    ], [
      'Day and night happen because the Earth spins.',
      'It is night somewhere else when it is day here.',
      'The moon does not make its own light.',
      'Shadows change during the day as the sun moves across the sky.'
    ], [
      'Day and night happen because the sun switches off.',
      'It is night everywhere at the same time.',
      'The moon makes its own light.',
      'Shadows stay exactly the same all day.'
    ], ['first-letter', 'count-letters']),
    early('People Who Help Us', 'Pre-K', 'Grade 2', 'person', [
      ['doctor', 'helps you when you are ill'],
      ['nurse', 'looks after you in hospital'],
      ['teacher', 'helps you learn at school'],
      ['firefighter', 'puts out fires'],
      ['police officer', 'keeps people safe'],
      ['dentist', 'looks after your teeth'],
      ['vet', 'looks after animals'],
      ['farmer', 'grows food and keeps animals'],
      ['postman', 'brings the letters'],
      ['bus driver', 'takes people where they need to go'],
      ['librarian', 'looks after the books'],
      ['chef', 'cooks food for people'],
      ['paramedic', 'treats people in an emergency'],
      ['lifeguard', 'watches over swimmers'],
      ['builder', 'puts up houses'],
      ['mechanic', 'fixes cars'],
      ['cleaner', 'keeps places tidy'],
      ['shopkeeper', 'sells things in a shop'],
      ['coach', 'helps you get better at a sport'],
      ['engineer', 'designs and builds machines']
    ], [
      'People in the community have jobs that help everyone.',
      'You can ask a person who helps us when you need help.',
      'Different jobs need different training.',
      'Some helpers work at night as well as in the day.'
    ], [
      'Only doctors help people.',
      'You should never ask anyone for help.',
      'All jobs need exactly the same training.',
      'Nobody works at night.'
    ], ['count-letters']),
    early('Getting Around', 'Pre-K', 'Grade 2', 'vehicle', [
      ['car', 'has four wheels and carries a few people'],
      ['bus', 'carries lots of people along a route'],
      ['bicycle', 'has two wheels and you pedal it'],
      ['train', 'runs along tracks'],
      ['aeroplane', 'flies through the sky'],
      ['boat', 'travels on water'],
      ['lorry', 'carries heavy loads by road'],
      ['ambulance', 'takes people to hospital quickly'],
      ['helicopter', 'flies with spinning blades on top'],
      ['scooter', 'you push along with one foot'],
      ['tractor', 'is used on a farm'],
      ['ferry', 'carries cars across water'],
      ['van', 'carries goods around town'],
      ['motorbike', 'has two wheels and an engine'],
      ['tram', 'runs on rails through a city'],
      ['ship', 'carries goods across the sea'],
      ['fire engine', 'carries firefighters and water'],
      ['skateboard', 'has four small wheels'],
      ['taxi', 'takes you where you ask for a fare'],
      ['underground train', 'runs in tunnels below a city']
    ], [
      'Different vehicles travel on land, on water or in the air.',
      'Trains need tracks to run on.',
      'Walking and cycling are good for you and for the air.',
      'Emergency vehicles use flashing lights and sirens.'
    ], [
      'Every vehicle travels on roads.',
      'Trains can drive anywhere without tracks.',
      'Cycling is bad for the air.',
      'Emergency vehicles must wait in traffic like everyone else.'
    ], ['first-letter', 'count-letters'])
  ],

  /* ============================ SCHOOL READINESS ============================ */
  readiness: [
    early('Days of the Week', 'Pre-K', 'Grade 2', 'day', [
      ['Monday', 'is the first day of the school week'],
      ['Tuesday', 'comes after Monday'],
      ['Wednesday', 'is in the middle of the week'],
      ['Thursday', 'comes after Wednesday'],
      ['Friday', 'is the last day of the school week'],
      ['Saturday', 'is part of the weekend'],
      ['Sunday', 'is the other weekend day'],
      ['today', 'is the day it is now'],
      ['tomorrow', 'is the day after today'],
      ['yesterday', 'is the day before today'],
      ['weekend', 'is Saturday and Sunday'],
      ['week', 'is seven days']
    ], [
      'There are seven days in a week.',
      'The days always come in the same order.',
      'After Sunday comes Monday again.',
      'Yesterday, today and tomorrow are three days in a row.'
    ], [
      'There are five days in a week.',
      'The days come in a different order every week.',
      'After Sunday the week stops.',
      'Tomorrow comes before today.'
    ], ['count-letters', 'what-comes-next']),
    early('Months and the Year', 'Kindergarten', 'Grade 3', 'month', [
      ['January', 'is the first month of the year'],
      ['February', 'is the shortest month'],
      ['March', 'comes after February'],
      ['April', 'comes after March'],
      ['May', 'comes after April'],
      ['June', 'comes after May'],
      ['July', 'comes after June'],
      ['August', 'comes after July'],
      ['September', 'is when many schools start'],
      ['October', 'comes after September'],
      ['November', 'comes after October'],
      ['December', 'is the last month of the year'],
      ['spring months', 'are March, April and May'],
      ['summer months', 'are June, July and August'],
      ['autumn months', 'are September, October and November'],
      ['winter months', 'are December, January and February'],
      ['year', 'is twelve months'],
      ['leap year', 'has an extra day in February'],
      ['birthday month', 'is the month you were born in'],
      ['season', 'is a group of three months with similar weather']
    ], [
      'There are twelve months in a year.',
      'February is the shortest month.',
      'The months always come in the same order.',
      'A birthday happens once a year, in the same month.'
    ], [
      'There are ten months in a year.',
      'January is the shortest month.',
      'The months change order each year.',
      'A birthday happens twice a year.'
    ], ['count-letters']),
    early('Opposites', 'Pre-K', 'Grade 2', 'word', [
      ['big', 'is the opposite of small'],
      ['hot', 'is the opposite of cold'],
      ['up', 'is the opposite of down'],
      ['fast', 'is the opposite of slow'],
      ['happy', 'is the opposite of sad'],
      ['open', 'is the opposite of shut'],
      ['day', 'is the opposite of night'],
      ['old', 'is the opposite of new'],
      ['wet', 'is the opposite of dry'],
      ['loud', 'is the opposite of quiet'],
      ['full', 'is the opposite of empty'],
      ['soft', 'is the opposite of hard'],
      ['long', 'is the opposite of short'],
      ['heavy', 'is the opposite of light'],
      ['in', 'is the opposite of out'],
      ['push', 'is the opposite of pull'],
      ['first', 'is the opposite of last'],
      ['above', 'is the opposite of below'],
      ['clean', 'is the opposite of dirty'],
      ['near', 'is the opposite of far']
    ], [
      'Opposites are as different from each other as they can be.',
      'Every word does not have an opposite.',
      'Opposites help you describe things clearly.',
      'Something can be in between two opposites.'
    ], [
      'Opposites mean almost the same thing.',
      'Every single word has an opposite.',
      'Something must be one opposite or the other, never in between.',
      'Opposites are only about size.'
    ], ['first-letter', 'count-letters']),
    early('Where Things Are', 'Pre-K', 'Grade 2', 'word', [
      ['on', 'means resting on top of'],
      ['under', 'means below something'],
      ['in', 'means inside something'],
      ['next to', 'means beside something'],
      ['behind', 'means at the back of'],
      ['in front of', 'means at the front of'],
      ['between', 'means in the middle of two things'],
      ['above', 'means higher up than'],
      ['below', 'means lower down than'],
      ['inside', 'means within'],
      ['outside', 'means not within'],
      ['near', 'means close to'],
      ['on top of', 'means resting above and touching'],
      ['beneath', 'means directly below'],
      ['beside', 'means right next to'],
      ['around', 'means all the way about'],
      ['through', 'means in one side and out the other'],
      ['opposite', 'means facing from across'],
      ['middle', 'means the centre'],
      ['edge', 'means the outside line of something']
    ], [
      'Position words tell you where something is.',
      'Where something is depends on what you compare it to.',
      'Above and below are opposites.',
      'You can be next to more than one thing at once.'
    ], [
      'Position words tell you how big something is.',
      'Where something is never depends on anything else.',
      'Above and below mean the same thing.',
      'You can only ever be next to one thing.'
    ], ['first-letter', 'count-letters']),
    early('Telling the Time — O’Clock', 'Kindergarten', 'Grade 2', 'time', [
      ['o’clock', 'is when the long hand points to 12'],
      ['half past', 'is when the long hand points to 6'],
      ['quarter past', 'is when the long hand points to 3'],
      ['quarter to', 'is when the long hand points to 9'],
      ['hour hand', 'is the short hand'],
      ['minute hand', 'is the long hand'],
      ['clock face', 'has the numbers 1 to 12 on it'],
      ['hour', 'is 60 minutes'],
      ['minute', 'is 60 seconds'],
      ['morning', 'is before 12 o’clock midday'],
      ['midday', 'is 12 o’clock in the middle of the day'],
      ['midnight', 'is 12 o’clock in the middle of the night'],
      ['second', 'is a very short amount of time'],
      ['day', 'is 24 hours'],
      ['week', 'is seven days'],
      ['a.m.', 'means before midday'],
      ['p.m.', 'means after midday'],
      ['digital clock', 'shows the time in numbers'],
      ['analogue clock', 'shows the time with hands'],
      ['timer', 'counts down a set amount of time']
    ], [
      'The short hand tells you the hour.',
      'There are 60 minutes in an hour.',
      'The hands of a clock always go the same way round.',
      'Half past means 30 minutes after the hour.'
    ], [
      'The long hand tells you the hour.',
      'There are 100 minutes in an hour.',
      'Clock hands can go either way round.',
      'Half past means 15 minutes after the hour.'
    ], ['what-comes-next', 'count-objects']),
    early('Coins and Money', 'Kindergarten', 'Grade 2', 'word', [
      ['coin', 'is money made of metal'],
      ['note', 'is money made of paper'],
      ['price', 'is how much something costs'],
      ['change', 'is the money you get back'],
      ['buy', 'means to give money for something'],
      ['save', 'means to keep money for later'],
      ['spend', 'means to use money to buy something'],
      ['cheaper', 'means it costs less'],
      ['more expensive', 'means it costs more'],
      ['total', 'is how much everything costs together'],
      ['purse', 'is where you keep coins'],
      ['shop', 'is where you buy things']
    ], [
      'A bigger coin is not always worth more.',
      'You get change when you pay more than the price.',
      'Saving means not spending money now so you can spend it later.',
      'You can make the same amount with different coins.'
    ], [
      'The biggest coin is always worth the most.',
      'You get change when you pay exactly the right amount.',
      'Saving and spending mean the same thing.',
      'There is only one way to make each amount.'
    ], ['add-numbers', 'take-away', 'count-objects', 'bigger-number']),
    early('Feelings and Manners', 'Pre-K', 'Grade 2', 'word', [
      ['happy', 'is how you feel when something is good'],
      ['sad', 'is how you feel when something is upsetting'],
      ['angry', 'is how you feel when something is unfair'],
      ['scared', 'is how you feel when something is frightening'],
      ['excited', 'is how you feel when something good is coming'],
      ['please', 'is what you say when you ask for something'],
      ['thank you', 'is what you say when someone helps you'],
      ['sorry', 'is what you say when you have upset someone'],
      ['sharing', 'means letting someone else have some too'],
      ['taking turns', 'means waiting for your go'],
      ['listening', 'means paying attention to someone speaking'],
      ['kind', 'means caring about how others feel'],
      ['worried', 'is how you feel when something might go wrong'],
      ['proud', 'is how you feel when you have done well'],
      ['calm', 'is how you feel when nothing is rushing'],
      ['surprised', 'is how you feel when something is unexpected'],
      ['excuse me', 'is what you say to interrupt politely'],
      ['good manners', 'means thinking about other people'],
      ['apology', 'is another word for saying sorry'],
      ['patience', 'means waiting without complaining']
    ], [
      'All feelings are allowed, even the uncomfortable ones.',
      'Telling someone how you feel helps them understand.',
      'Taking turns means everyone gets a go.',
      'Saying sorry means you understand you upset someone.'
    ], [
      'Some feelings are not allowed.',
      'Nobody can tell how you feel unless you shout.',
      'Taking turns means going first every time.',
      'Saying sorry means nothing happened.'
    ], ['first-letter', 'count-letters']),
    early('Left, Right and Directions', 'Kindergarten', 'Grade 3', 'word', [
      ['left', 'is the side your left hand is on'],
      ['right', 'is the side your right hand is on'],
      ['forwards', 'means moving ahead'],
      ['backwards', 'means moving behind you'],
      ['turn', 'means to change the way you are facing'],
      ['straight on', 'means keep going the same way'],
      ['half turn', 'means turning to face the opposite way'],
      ['quarter turn', 'means turning to face sideways'],
      ['clockwise', 'is the way clock hands go round'],
      ['anticlockwise', 'is the other way round'],
      ['up', 'means towards the sky'],
      ['down', 'means towards the ground'],
      ['north', 'is the direction at the top of a map'],
      ['south', 'is the direction at the bottom of a map'],
      ['east', 'is the direction the sun rises from'],
      ['west', 'is the direction the sun sets towards'],
      ['around', 'means all the way past something'],
      ['through', 'means in one side and out the other'],
      ['over', 'means above and across'],
      ['along', 'means following the length of something']
    ], [
      'Left and right depend on which way you are facing.',
      'A half turn leaves you facing the opposite way.',
      'Clockwise is the direction the hands of a clock move.',
      'Giving directions clearly helps someone find the way.'
    ], [
      'Left and right are always the same, whichever way you face.',
      'A half turn leaves you facing exactly the same way.',
      'Clockwise and anticlockwise are the same direction.',
      'Directions do not need to be clear to be useful.'
    ], ['first-letter', 'count-letters'])
  ]
};
