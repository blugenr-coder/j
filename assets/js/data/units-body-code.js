/* Health & Physical Education, Computer Science and Early Learning.

   The last three subjects still leaning on broad titles. A PE student revises
   "Components of Fitness and Testing"; a computing student revises "SQL Joins
   and Relational Design"; a five-year-old's worksheet is about rhyming words,
   not about "phonics". Named that way, each is findable and each is a
   different worksheet from its neighbours. */

export const BODY_CODE_UNITS = {
  /* ================================= health ================================== */
  anatomy: [
    {
      name: 'The Heart, Blood and Circulation in Sport', from: 'Grade 8', to: 'College',
      figures: ['heart'],
      facts: [
        ['the heart', 'the muscular pump driving blood around the body'],
        ['an atrium', 'an upper chamber of the heart receiving blood'],
        ['a ventricle', 'a lower chamber of the heart pumping blood out'],
        ['the aorta', 'the main artery leaving the left ventricle'],
        ['the vena cava', 'the main vein returning blood to the heart'],
        ['the pulmonary artery', 'the vessel carrying blood from the heart to the lungs'],
        ['an artery', 'a vessel carrying blood away from the heart'],
        ['a vein', 'a vessel carrying blood back to the heart'],
        ['a capillary', 'the tiny vessel where exchange with tissue happens'],
        ['a valve', 'the structure preventing backflow of blood'],
        ['heart rate', 'beats per minute'],
        ['stroke volume', 'the blood pumped out per beat'],
        ['cardiac output', 'heart rate multiplied by stroke volume'],
        ['a resting heart rate', 'heart rate at rest, lower in trained athletes'],
        ['a maximum heart rate', 'the highest rate the heart can reach'],
        ['a target heart rate zone', 'the range in which training is effective'],
        ['blood pressure', 'the pressure of blood against vessel walls'],
        ['a red blood cell', 'the cell carrying oxygen as oxyhaemoglobin'],
        ['haemoglobin', 'the protein in red blood cells that binds oxygen'],
        ['vasoconstriction', 'the narrowing of blood vessels']
      ],
      truths: [
        'Cardiac output is heart rate multiplied by stroke volume.',
        'Arteries carry blood away from the heart, whatever it is carrying.',
        'Training lowers resting heart rate because stroke volume rises.',
        'Exchange between blood and tissue happens in capillaries, not arteries.',
        'The pulmonary artery carries deoxygenated blood, and is still an artery.'
      ],
      myths: [
        'All arteries carry oxygenated blood.',
        'A lower resting heart rate means a weaker heart.',
        'The heart has two chambers.',
        'Blood pressure and heart rate are the same measurement.',
        'Veins carry blood away from the heart.'
      ],
      applications: [
        ['Heart rate 60, stroke volume 80 ml. What is cardiac output?', '4800 ml per minute'],
        ['Which vessel carries blood from the heart to the lungs?', 'the pulmonary artery'],
        ['Where does exchange with tissue take place?', 'in the capillaries'],
        ['Which protein binds oxygen in red blood cells?', 'haemoglobin'],
        ['What happens to resting heart rate with training?', 'it falls']
      ]
    },
    {
      name: 'The Respiratory System and Aerobic Fitness', from: 'Grade 8', to: 'College',
      figures: ['respiratory'],
      facts: [
        ['the trachea', 'the windpipe carrying air towards the lungs'],
        ['a bronchus', 'one of the two main airways into the lungs'],
        ['a bronchiole', 'a small airway inside the lung'],
        ['an alveolus', 'the tiny air sac where gas exchange happens'],
        ['the diaphragm', 'the muscle below the lungs that drives breathing'],
        ['an intercostal muscle', 'a muscle between the ribs used in breathing'],
        ['inhalation', 'breathing in'],
        ['exhalation', 'breathing out'],
        ['tidal volume', 'the air moved in one normal breath'],
        ['vital capacity', 'the greatest volume that can be exhaled after full inhalation'],
        ['breathing rate', 'breaths per minute'],
        ['minute ventilation', 'tidal volume multiplied by breathing rate'],
        ['gas exchange', 'the movement of oxygen and carbon dioxide across the alveoli'],
        ['diffusion', 'movement from high to low concentration'],
        ['aerobic exercise', 'exercise using oxygen to release energy'],
        ['anaerobic exercise', 'exercise releasing energy without enough oxygen'],
        ['VO2 max', 'the maximum rate of oxygen use during exercise'],
        ['oxygen debt', 'the extra oxygen needed after intense exercise'],
        ['lactic acid', 'the substance accumulating during anaerobic work'],
        ['aerobic endurance', 'the ability to keep going at moderate intensity']
      ],
      truths: [
        'Gas exchange happens by diffusion across the alveolar walls.',
        'The diaphragm contracts and flattens to draw air in.',
        'VO2 max is a measure of aerobic capacity and improves with training.',
        'Anaerobic work produces lactic acid and cannot be sustained.',
        'Minute ventilation is tidal volume multiplied by breathing rate.'
      ],
      myths: [
        'The lungs pull air in by their own muscle.',
        'Aerobic and anaerobic exercise use completely separate energy systems at all times.',
        'Deeper breathing always means more oxygen reaches the muscles.',
        'Lactic acid causes soreness days later.',
        'Vital capacity and tidal volume are the same measurement.'
      ],
      applications: [
        ['Where does gas exchange take place?', 'in the alveoli'],
        ['Which muscle flattens to draw air in?', 'the diaphragm'],
        ['The maximum rate of oxygen use is called what?', 'VO2 max'],
        ['Tidal volume times breathing rate gives what?', 'minute ventilation'],
        ['Which substance builds up during anaerobic work?', 'lactic acid']
      ]
    }
  ],
  fitness: [
    {
      name: 'Components of Fitness and Testing', from: 'Grade 7', to: 'College',
      facts: [
        ['physical fitness', 'the ability to meet the demands of an activity'],
        ['aerobic endurance', 'the ability to keep working at moderate intensity'],
        ['muscular endurance', 'the ability to repeat contractions without tiring'],
        ['muscular strength', 'the greatest force a muscle can produce'],
        ['power', 'strength applied quickly'],
        ['speed', 'how quickly the body can move'],
        ['agility', 'the ability to change direction quickly and under control'],
        ['balance', 'keeping the centre of mass over the base of support'],
        ['coordination', 'moving two or more body parts together smoothly'],
        ['reaction time', 'the time between a stimulus and a response'],
        ['flexibility', 'the range of movement at a joint'],
        ['body composition', 'the proportion of fat, muscle and bone'],
        ['the multi-stage fitness test', 'the shuttle run test of aerobic endurance'],
        ['the sit and reach test', 'the test of flexibility at the hip and hamstring'],
        ['the Illinois agility run', 'the standard agility test'],
        ['the vertical jump test', 'the standard test of leg power'],
        ['the ruler drop test', 'the simple test of reaction time'],
        ['a grip dynamometer', 'the device measuring grip strength'],
        ['a normative table', 'the table comparing a score with a population'],
        ['test validity', 'whether a test measures the component it claims to']
      ],
      truths: [
        'Fitness is specific: being fit for one sport does not mean being fit for another.',
        'A test is only useful if it measures the component the sport actually needs.',
        'Normative tables give meaning to a raw score.',
        'Power combines strength and speed; it is not the same as strength.',
        'The multi-stage fitness test estimates aerobic capacity rather than measuring it directly.'
      ],
      myths: [
        'Fitness is one single quality a person has more or less of.',
        'Strength and power are the same component.',
        'Any test can be used for any sport.',
        'A good score on one test predicts every other.',
        'Flexibility matters only to gymnasts.'
      ],
      applications: [
        ['Which test measures leg power?', 'the vertical jump test'],
        ['Strength applied quickly is called what?', 'power'],
        ['Which test measures flexibility at the hip?', 'the sit and reach test'],
        ['Which component is the ability to change direction quickly?', 'agility'],
        ['Which device measures grip strength?', 'a grip dynamometer']
      ]
    },
    {
      name: 'Training Methods and Programme Design', from: 'Grade 8', to: 'College',
      facts: [
        ['continuous training', 'steady work at a constant intensity'],
        ['fartlek training', 'continuous work with varied speeds'],
        ['interval training', 'periods of work alternating with recovery'],
        ['circuit training', 'a series of stations worked in turn'],
        ['weight training', 'training against resistance'],
        ['plyometric training', 'jumping work that develops power'],
        ['flexibility training', 'work that increases range of movement'],
        ['the FITT principle', 'frequency, intensity, time and type'],
        ['frequency', 'how often training happens'],
        ['intensity', 'how hard the training is'],
        ['progressive overload', 'gradually increasing demand so the body adapts'],
        ['specificity', 'training in the way the activity demands'],
        ['reversibility', 'the loss of adaptation when training stops'],
        ['a rest day', 'a planned day without training'],
        ['periodisation', 'the division of a year into training phases'],
        ['a macrocycle', 'the longest training phase, often a year'],
        ['a mesocycle', 'a block of several weeks within a macrocycle'],
        ['a microcycle', 'a week of training'],
        ['a repetition', 'one complete movement in a set'],
        ['a set', 'a group of repetitions performed together']
      ],
      truths: [
        'FITT stands for frequency, intensity, time and type.',
        'Adaptation requires overload followed by recovery.',
        'Reversibility means gains are lost faster than they were made.',
        'Periodisation exists so peak condition arrives at the right time.',
        'Specificity means a swimmer trains differently from a sprinter.'
      ],
      myths: [
        'Training harder every session is the fastest route to improvement.',
        'Rest days waste training time.',
        'One programme suits every athlete.',
        'Weight training makes an athlete slow.',
        'Fitness gains last indefinitely once achieved.'
      ],
      applications: [
        ['What does the second T in FITT stand for?', 'type'],
        ['Which method alternates work with recovery?', 'interval training'],
        ['Gradually increasing demand is called what?', 'progressive overload'],
        ['A week of training is called what?', 'a microcycle'],
        ['Which method uses jumping to develop power?', 'plyometric training']
      ]
    },
    {
      name: 'Drugs in Sport, Ethics and Fair Play', from: 'Grade 9', to: 'College',
      facts: [
        ['a performance-enhancing drug', 'a substance taken to improve sporting performance'],
        ['an anabolic steroid', 'a drug that increases muscle growth'],
        ['a stimulant', 'a drug that increases alertness and heart rate'],
        ['a beta blocker', 'a drug that lowers heart rate and steadies the hands'],
        ['a diuretic', 'a drug increasing urine output, used to lose weight or mask others'],
        ['erythropoietin', 'a hormone raising red blood cell count'],
        ['blood doping', 'raising red cell count to carry more oxygen'],
        ['a masking agent', 'a substance taken to hide another'],
        ['a banned list', 'the published list of prohibited substances and methods'],
        ['a therapeutic use exemption', 'permission to use a banned drug for a medical condition'],
        ['drug testing', 'the process of sampling and analysis'],
        ['an out-of-competition test', 'a test carried out away from an event'],
        ['a whereabouts requirement', 'the duty to say where an athlete can be found'],
        ['a sanction', 'the penalty imposed for a doping offence'],
        ['strict liability', 'the rule that an athlete is responsible for what is in their body'],
        ['sportsmanship', 'playing within the spirit as well as the rules'],
        ['gamesmanship', 'bending the spirit of the game while keeping to the rules'],
        ['a deviant behaviour', 'conduct breaking the norms of a sport'],
        ['integrity', 'the honesty on which competition depends'],
        ['a level playing field', 'conditions that are fair to all competitors']
      ],
      truths: [
        'Strict liability means an athlete is responsible for what is in their body, whatever the explanation.',
        'A therapeutic use exemption must be granted in advance, not claimed afterwards.',
        'Out-of-competition testing exists because many drugs are taken in training.',
        'Gamesmanship keeps to the rules while breaking the spirit of the game.',
        'Beta blockers are banned in precision sports because they steady the hands.'
      ],
      myths: [
        'A drug is only banned if it improves performance directly.',
        'An athlete cannot be sanctioned if they did not know what they took.',
        'Testing happens only at competitions.',
        'Blood doping requires a drug.',
        'Gamesmanship and sportsmanship are the same thing.'
      ],
      applications: [
        ['The rule that an athlete is responsible for what is in their body is called what?', 'strict liability'],
        ['Which drug class steadies the hands in precision sports?', 'beta blockers'],
        ['Raising red cell count to carry more oxygen is called what?', 'blood doping'],
        ['Permission to use a banned drug for a medical reason is called what?', 'a therapeutic use exemption'],
        ['Bending the spirit of the game while keeping the rules is called what?', 'gamesmanship']
      ]
    }
  ],
  nutrition: [
    {
      name: 'Energy Balance, Metabolism and Weight', from: 'Grade 8', to: 'College',
      facts: [
        ['energy balance', 'the relationship between energy taken in and energy used'],
        ['a calorie', 'a unit of food energy'],
        ['a kilojoule', 'the metric unit of energy used on food labels'],
        ['basal metabolic rate', 'the energy used at complete rest'],
        ['metabolism', 'the chemical processes that keep the body running'],
        ['a macronutrient', 'a nutrient needed in large amounts'],
        ['a micronutrient', 'a nutrient needed in small amounts'],
        ['energy density', 'the energy in a food per unit of mass'],
        ['satiety', 'the feeling of fullness after eating'],
        ['a glycaemic index', 'the measure of how quickly a food raises blood glucose'],
        ['glycogen', 'the storage form of glucose in muscle and liver'],
        ['a deficit', 'using more energy than is taken in'],
        ['a surplus', 'taking in more energy than is used'],
        ['lean mass', 'body mass that is not fat'],
        ['body mass index', 'a ratio of mass to height squared, used as a crude screen'],
        ['hydration', 'having enough water in the body'],
        ['an electrolyte', 'a mineral salt lost in sweat and needed for function'],
        ['carbohydrate loading', 'raising glycogen stores before endurance events'],
        ['a protein requirement', 'the daily protein an individual needs'],
        ['a recommended intake', 'the published guideline amount of a nutrient']
      ],
      truths: [
        'Weight change follows from energy balance over time, not from any single meal.',
        'Basal metabolic rate is the largest part of most people’s daily energy use.',
        'Body mass index is a screening tool and misclassifies muscular people.',
        'Glycogen stores are limited, which is why endurance events need fuelling.',
        'Energy density and portion size together decide the energy in a meal.'
      ],
      myths: [
        'Some foods burn more energy than they contain.',
        'Eating after a set hour causes weight gain in itself.',
        'Body mass index measures body fat directly.',
        'Protein alone builds muscle without training.',
        'Sweating heavily means fat is being lost.'
      ],
      applications: [
        ['Energy used at complete rest is called what?', 'basal metabolic rate'],
        ['The storage form of glucose in muscle is called what?', 'glycogen'],
        ['Taking in more energy than is used is called what?', 'a surplus'],
        ['Which measure ranks how quickly a food raises blood glucose?', 'the glycaemic index'],
        ['Which minerals are lost in sweat?', 'electrolytes']
      ]
    }
  ],
  /* ================================ computing ================================ */
  programming: [
    {
      name: 'Functions, Parameters and Scope', from: 'Grade 8', to: 'College',
      facts: [
        ['a function', 'a named block of code that can be called'],
        ['a procedure', 'a function that performs an action without returning a value'],
        ['a parameter', 'a named input in a function definition'],
        ['an argument', 'the actual value passed when a function is called'],
        ['a return value', 'the value a function gives back'],
        ['a call', 'the act of running a function'],
        ['a signature', 'the name and parameters of a function'],
        ['scope', 'the region of a program where a name is visible'],
        ['a local variable', 'a variable visible only inside a function'],
        ['a global variable', 'a variable visible throughout a program'],
        ['a side effect', 'a change a function makes beyond its return value'],
        ['a pure function', 'a function with no side effects, whose output depends only on its input'],
        ['a default parameter', 'a parameter with a value used when no argument is given'],
        ['pass by value', 'passing a copy of a value into a function'],
        ['pass by reference', 'passing a reference so the original can be changed'],
        ['a stack frame', 'the record of one function call in memory'],
        ['recursion', 'a function that calls itself'],
        ['a base case', 'the case at which a recursive function stops'],
        ['decomposition', 'breaking a problem into smaller parts'],
        ['abstraction', 'hiding detail behind a simple interface']
      ],
      truths: [
        'A parameter is in the definition; an argument is in the call.',
        'A local variable disappears when the function returns.',
        'A recursive function without a base case will not terminate.',
        'Pure functions are easier to test because the same input always gives the same output.',
        'Decomposition into functions is what makes a large program readable.'
      ],
      myths: [
        'Parameters and arguments are two words for the same thing.',
        'A global variable is simpler because it works everywhere.',
        'A function must return a value to be useful.',
        'Recursion is always more efficient than a loop.',
        'Two variables with the same name always refer to the same thing.'
      ],
      applications: [
        ['A named input in a function definition is called what?', 'a parameter'],
        ['A variable visible only inside a function is called what?', 'local'],
        ['What stops a recursive function running forever?', 'the base case'],
        ['A function with no side effects is called what?', 'a pure function'],
        ['Breaking a problem into smaller parts is called what?', 'decomposition']
      ]
    },
    {
      name: 'Debugging, Testing and Error Handling', from: 'Grade 8', to: 'College',
      facts: [
        ['a bug', 'a defect causing a program to behave wrongly'],
        ['debugging', 'the process of finding and fixing defects'],
        ['a syntax error', 'code that breaks the rules of the language'],
        ['a runtime error', 'a failure that occurs while the program runs'],
        ['a logic error', 'code that runs but gives the wrong result'],
        ['a stack trace', 'the printed record of where an error occurred'],
        ['a breakpoint', 'a marked line where execution pauses for inspection'],
        ['stepping', 'running a program one line at a time'],
        ['a watch', 'a variable whose value is displayed while stepping'],
        ['a trace table', 'a table recording variable values line by line'],
        ['a test case', 'one input with its expected output'],
        ['normal data', 'input a program should accept'],
        ['boundary data', 'input at the edge of what is accepted'],
        ['erroneous data', 'input a program should reject'],
        ['unit testing', 'testing one function in isolation'],
        ['integration testing', 'testing that parts work together'],
        ['a regression', 'a bug reintroduced by a later change'],
        ['exception handling', 'catching an error so a program can recover'],
        ['a try block', 'the code whose errors are being caught'],
        ['validation', 'checking input before using it']
      ],
      truths: [
        'A program with no syntax errors can still be entirely wrong.',
        'Boundary data catches more defects than typical data does.',
        'A stack trace names where an error surfaced, not always where it was caused.',
        'A trace table finds logic errors without running a debugger.',
        'Exception handling should catch what you can respond to, not everything.'
      ],
      myths: [
        'If it compiles, it works.',
        'Testing means running the program once and seeing that it looks right.',
        'A bug that cannot be reproduced does not exist.',
        'Catching every exception makes a program robust.',
        'Debugging is guessing until the error stops appearing.'
      ],
      applications: [
        ['Code that runs but gives the wrong result contains which error?', 'a logic error'],
        ['Input at the edge of what is accepted is called what?', 'boundary data'],
        ['A table recording variable values line by line is called what?', 'a trace table'],
        ['A bug reintroduced by a later change is called what?', 'a regression'],
        ['Testing one function in isolation is called what?', 'unit testing']
      ]
    }
  ],
  algorithms: [
    {
      name: 'Big O and Algorithm Efficiency', from: 'Grade 10', to: 'College',
      facts: [
        ['an algorithm', 'a finite sequence of steps solving a problem'],
        ['efficiency', 'how much time or space an algorithm needs'],
        ['time complexity', 'how running time grows with input size'],
        ['space complexity', 'how memory use grows with input size'],
        ['Big O notation', 'the notation describing growth in the worst case'],
        ['constant time', 'O(1), independent of input size'],
        ['logarithmic time', 'O(log n), as in binary search'],
        ['linear time', 'O(n), proportional to input size'],
        ['linearithmic time', 'O(n log n), as in merge sort'],
        ['quadratic time', 'O(n squared), as in bubble sort'],
        ['exponential time', 'O(2 to the n), impractical beyond small inputs'],
        ['a worst case', 'the input producing the most work'],
        ['a best case', 'the input producing the least work'],
        ['an average case', 'the typical amount of work over expected inputs'],
        ['a linear search', 'checking each item in turn'],
        ['a binary search', 'repeatedly halving a sorted list'],
        ['a bubble sort', 'repeatedly swapping adjacent items out of order'],
        ['a merge sort', 'sorting by dividing, sorting halves and merging'],
        ['a trade-off', 'accepting more of one cost to reduce another'],
        ['a benchmark', 'a measured comparison of implementations']
      ],
      truths: [
        'Binary search requires the list to be sorted first.',
        'Big O describes growth, so constants and lower terms are dropped.',
        'An O(n log n) sort beats an O(n squared) sort as n grows, not necessarily when n is tiny.',
        'Time and space can be traded against each other.',
        'Worst case, best case and average case can differ sharply for the same algorithm.'
      ],
      myths: [
        'A lower Big O always means faster on every input.',
        'Binary search works on any list.',
        'Big O measures the exact number of operations.',
        'Doubling the processor speed changes an algorithm’s complexity.',
        'The best case is what Big O usually describes.'
      ],
      applications: [
        ['What is the time complexity of binary search?', 'O(log n)'],
        ['What is the time complexity of bubble sort in the worst case?', 'O(n squared)'],
        ['Which search requires a sorted list?', 'binary search'],
        ['Which complexity is independent of input size?', 'constant time'],
        ['Which sort runs in O(n log n)?', 'merge sort']
      ]
    },
    {
      name: 'Graphs, Trees and Traversals', from: 'Grade 10', to: 'College',
      facts: [
        ['a graph', 'a set of nodes joined by edges'],
        ['a node', 'one point in a graph or tree'],
        ['an edge', 'a connection between two nodes'],
        ['a directed graph', 'a graph whose edges have a direction'],
        ['an undirected graph', 'a graph whose edges have no direction'],
        ['a weighted graph', 'a graph whose edges carry values'],
        ['an adjacency list', 'a representation storing each node’s neighbours'],
        ['an adjacency matrix', 'a grid marking which nodes are connected'],
        ['a tree', 'a connected graph with no cycles'],
        ['a root', 'the top node of a tree'],
        ['a leaf', 'a node with no children'],
        ['a binary tree', 'a tree where each node has at most two children'],
        ['a binary search tree', 'a binary tree ordered so left is smaller and right is larger'],
        ['a traversal', 'a systematic visit to every node'],
        ['a depth-first search', 'a traversal following one path as far as it goes'],
        ['a breadth-first search', 'a traversal visiting all neighbours before going deeper'],
        ['an in-order traversal', 'left subtree, node, right subtree'],
        ['a pre-order traversal', 'node, left subtree, right subtree'],
        ['a post-order traversal', 'left subtree, right subtree, node'],
        ['Dijkstra’s algorithm', 'the shortest-path algorithm for weighted graphs']
      ],
      truths: [
        'A tree is a graph with no cycles and one path between any two nodes.',
        'An in-order traversal of a binary search tree returns the values in order.',
        'Breadth-first search uses a queue; depth-first search uses a stack.',
        'An adjacency matrix wastes space on a sparse graph.',
        'Dijkstra’s algorithm needs non-negative edge weights.'
      ],
      myths: [
        'Every graph is a tree.',
        'Depth-first search always finds the shortest path.',
        'Adjacency lists and matrices are interchangeable at any size.',
        'A binary tree and a binary search tree are the same structure.',
        'A traversal visits some nodes more than once by design.'
      ],
      applications: [
        ['Which traversal of a binary search tree gives sorted order?', 'in-order'],
        ['Which data structure does breadth-first search use?', 'a queue'],
        ['A connected graph with no cycles is called what?', 'a tree'],
        ['A node with no children is called what?', 'a leaf'],
        ['Which algorithm finds shortest paths in a weighted graph?', 'Dijkstra’s algorithm']
      ]
    }
  ],
  data: [
    {
      name: 'SQL Joins and Relational Design', from: 'Grade 9', to: 'College',
      facts: [
        ['a relational database', 'data organised into linked tables'],
        ['a table', 'a set of records with the same fields'],
        ['a record', 'one row of a table'],
        ['a field', 'one column of a table'],
        ['a primary key', 'the field uniquely identifying each record'],
        ['a foreign key', 'a field referring to the primary key of another table'],
        ['a composite key', 'a key made from more than one field'],
        ['a relationship', 'a link between two tables'],
        ['a one-to-many relationship', 'one record linked to many in another table'],
        ['a many-to-many relationship', 'a link needing a linking table between two tables'],
        ['a linking table', 'the table resolving a many-to-many relationship'],
        ['normalisation', 'organising tables to remove redundancy'],
        ['redundancy', 'the same data stored in more than one place'],
        ['an update anomaly', 'an inconsistency caused by redundant data'],
        ['a SELECT statement', 'the query that retrieves data'],
        ['a WHERE clause', 'the condition filtering which records are returned'],
        ['an INNER JOIN', 'a join returning only matching rows from both tables'],
        ['a LEFT JOIN', 'a join returning all rows from the left table'],
        ['an aggregate function', 'a function such as COUNT or SUM over many rows'],
        ['a GROUP BY clause', 'the clause grouping rows before aggregating']
      ],
      truths: [
        'A foreign key in one table refers to a primary key in another.',
        'An INNER JOIN drops rows with no match; a LEFT JOIN keeps them.',
        'A many-to-many relationship needs a linking table.',
        'Normalisation removes redundancy, which is what prevents update anomalies.',
        'GROUP BY is what makes an aggregate return one row per group.'
      ],
      myths: [
        'A primary key can be repeated if the records differ elsewhere.',
        'INNER JOIN and LEFT JOIN return the same rows.',
        'Normalisation always makes queries faster.',
        'Two tables can be linked directly in a many-to-many relationship.',
        'A WHERE clause and a GROUP BY clause do the same filtering job.'
      ],
      applications: [
        ['Which field uniquely identifies a record?', 'the primary key'],
        ['Which join keeps rows with no match in the second table?', 'a LEFT JOIN'],
        ['What resolves a many-to-many relationship?', 'a linking table'],
        ['Which clause groups rows before aggregating?', 'GROUP BY'],
        ['Storing the same data in two places is called what?', 'redundancy']
      ]
    }
  ],
  web: [
    {
      name: 'HTTP, APIs and the Client–Server Model', from: 'Grade 9', to: 'College',
      facts: [
        ['a client', 'the program requesting a resource'],
        ['a server', 'the program providing a resource'],
        ['HTTP', 'the protocol carrying web requests and responses'],
        ['HTTPS', 'HTTP encrypted with TLS'],
        ['a request', 'the message a client sends'],
        ['a response', 'the message a server sends back'],
        ['a URL', 'the address identifying a resource'],
        ['a GET request', 'a request that retrieves a resource'],
        ['a POST request', 'a request that submits data'],
        ['a status code', 'the number reporting the result of a request'],
        ['a 200 response', 'the code meaning the request succeeded'],
        ['a 404 response', 'the code meaning the resource was not found'],
        ['a 500 response', 'the code meaning the server failed'],
        ['a header', 'metadata sent with a request or response'],
        ['a cookie', 'a small stored value returned with later requests'],
        ['an API', 'a defined interface another program can call'],
        ['a REST API', 'an API using HTTP methods on addressable resources'],
        ['JSON', 'the common text format for structured data'],
        ['an endpoint', 'one addressable URL of an API'],
        ['rate limiting', 'the cap on how often a client may call an API']
      ],
      truths: [
        'HTTP is stateless: each request stands alone unless state is carried explicitly.',
        'A 4xx status blames the request; a 5xx status blames the server.',
        'GET retrieves and should not change anything; POST submits.',
        'HTTPS encrypts the content of a request, not the fact that it was made.',
        'An API is a contract: the shape of the response is part of it.'
      ],
      myths: [
        'The server remembers a client between requests by default.',
        'A 404 means the whole website is down.',
        'HTTPS hides which site you visited from everyone.',
        'GET and POST are interchangeable.',
        'JSON and JavaScript are the same thing.'
      ],
      applications: [
        ['Which status code means the resource was not found?', '404'],
        ['Which request method submits data?', 'POST'],
        ['One addressable URL of an API is called what?', 'an endpoint'],
        ['Which protocol is HTTP encrypted with TLS?', 'HTTPS'],
        ['A 5xx status blames which side?', 'the server']
      ]
    },
    {
      name: 'Accessibility and Responsive Web Design', from: 'Grade 8', to: 'College',
      facts: [
        ['accessibility', 'designing so people with disabilities can use a site'],
        ['alt text', 'the text alternative describing an image'],
        ['a screen reader', 'software reading a page aloud'],
        ['semantic HTML', 'markup that describes what content is, not how it looks'],
        ['a heading level', 'the rank of a heading, used for navigation'],
        ['a landmark', 'a region such as navigation or main content'],
        ['keyboard navigation', 'operating a page without a mouse'],
        ['focus', 'the element that will receive keyboard input'],
        ['a focus indicator', 'the visible outline showing what has focus'],
        ['colour contrast', 'the difference in luminance between text and background'],
        ['WCAG', 'the Web Content Accessibility Guidelines'],
        ['a captions track', 'the synchronised text of spoken audio'],
        ['a transcript', 'the full written version of audio or video'],
        ['responsive design', 'a layout that adapts to the size of the screen'],
        ['a viewport', 'the visible area of a page on a device'],
        ['a media query', 'the CSS rule applying styles at certain widths'],
        ['a breakpoint', 'the width at which a layout changes'],
        ['a relative unit', 'a size expressed relative to something else'],
        ['a mobile-first approach', 'designing for small screens first and adding from there'],
        ['a touch target', 'the area a finger has to hit to activate a control']
      ],
      truths: [
        'Alt text describes the purpose of an image, and decorative images take empty alt text.',
        'A visible focus indicator is what makes keyboard navigation usable.',
        'Semantic HTML gives a screen reader the structure it needs.',
        'Colour alone must not be the only way information is conveyed.',
        'Responsive design uses relative units and breakpoints, not one layout per device.'
      ],
      myths: [
        'Accessibility only matters to a very small number of users.',
        'Every image needs a long description.',
        'A separate mobile site is the same as responsive design.',
        'Removing the focus outline improves the design at no cost.',
        'Accessibility can be added at the end of a project.'
      ],
      applications: [
        ['What describes an image for a screen reader?', 'alt text'],
        ['Which CSS rule applies styles at certain widths?', 'a media query'],
        ['The width at which a layout changes is called what?', 'a breakpoint'],
        ['What must never be the only way information is conveyed?', 'colour'],
        ['Which guidelines govern web accessibility?', 'WCAG']
      ]
    }
  ],
  cyber: [
    {
      name: 'Social Engineering and Human Factors', from: 'Grade 8', to: 'College',
      facts: [
        ['social engineering', 'manipulating people rather than systems to gain access'],
        ['phishing', 'a fraudulent message designed to obtain credentials or money'],
        ['spear phishing', 'phishing aimed at one named person'],
        ['whaling', 'phishing aimed at a senior executive'],
        ['vishing', 'social engineering by voice call'],
        ['smishing', 'social engineering by text message'],
        ['pretexting', 'inventing a scenario to justify a request'],
        ['baiting', 'leaving something tempting for a victim to use'],
        ['tailgating', 'following an authorised person through a secure door'],
        ['shoulder surfing', 'reading credentials over someone’s shoulder'],
        ['authority', 'the pressure used when an attacker claims seniority'],
        ['urgency', 'the pressure used to prevent careful checking'],
        ['a spoofed address', 'a sender address made to look genuine'],
        ['a lookalike domain', 'a domain resembling a real one'],
        ['multi-factor authentication', 'requiring more than one kind of proof'],
        ['a security awareness training', 'staff training on recognising attacks'],
        ['a reporting process', 'the route by which a suspicious message is escalated'],
        ['an insider threat', 'a risk coming from someone with legitimate access'],
        ['least privilege', 'giving each account only the access it needs'],
        ['a clean desk policy', 'the rule that sensitive material is not left visible']
      ],
      truths: [
        'Social engineering targets people because people are reachable without breaking anything.',
        'Urgency and authority are the two pressures most attacks rely on.',
        'Multi-factor authentication defeats most stolen-credential attacks.',
        'A sender address can be spoofed, so it proves nothing on its own.',
        'Reporting a suspicious message matters even when you did not fall for it.'
      ],
      myths: [
        'Only technically ignorant people fall for social engineering.',
        'A message from a colleague’s address is certainly from them.',
        'Antivirus software prevents phishing.',
        'An attack has to involve code to be a cyber attack.',
        'Senior staff are less likely to be targeted.'
      ],
      applications: [
        ['Phishing aimed at one named person is called what?', 'spear phishing'],
        ['Following someone through a secure door is called what?', 'tailgating'],
        ['Inventing a scenario to justify a request is called what?', 'pretexting'],
        ['Which defence stops most stolen-credential attacks?', 'multi-factor authentication'],
        ['Giving an account only the access it needs is called what?', 'least privilege']
      ]
    },
    {
      name: 'Encryption, Keys and Certificates', from: 'Grade 9', to: 'College',
      facts: [
        ['encryption', 'converting data so only an authorised party can read it'],
        ['plaintext', 'the readable original data'],
        ['ciphertext', 'the encrypted form of data'],
        ['a key', 'the value that controls encryption and decryption'],
        ['symmetric encryption', 'encryption using one shared key'],
        ['asymmetric encryption', 'encryption using a public and a private key'],
        ['a public key', 'the key that may be shared freely'],
        ['a private key', 'the key that must be kept secret'],
        ['a key exchange', 'the process of agreeing a shared key securely'],
        ['a hash function', 'a one-way function producing a fixed-length digest'],
        ['a digest', 'the output of a hash function'],
        ['a collision', 'two inputs producing the same hash'],
        ['a salt', 'random data added before hashing a password'],
        ['a digital signature', 'a value proving who sent a message and that it is unaltered'],
        ['a certificate', 'a signed statement binding a public key to an identity'],
        ['a certificate authority', 'the body that issues and vouches for certificates'],
        ['TLS', 'the protocol securing traffic on the modern web'],
        ['end-to-end encryption', 'encryption where only the endpoints can read the content'],
        ['a brute force attack', 'trying every possible key'],
        ['key length', 'the size of a key, which sets how hard brute force is']
      ],
      truths: [
        'Hashing is one way; encryption is reversible with the key.',
        'A public key encrypts and the matching private key decrypts.',
        'A salt stops identical passwords producing identical hashes.',
        'A certificate is trusted because a certificate authority signed it.',
        'Longer keys make brute force harder, not impossible in principle.'
      ],
      myths: [
        'Hashing is a kind of encryption you can reverse with the right tool.',
        'A private key can be shared as long as it is sent over HTTPS.',
        'Encryption on its own proves who sent a message.',
        'A padlock icon means a site is trustworthy.',
        'End-to-end encryption means the service provider can still read messages when required.'
      ],
      applications: [
        ['Which encryption uses one shared key?', 'symmetric'],
        ['Random data added before hashing a password is called what?', 'a salt'],
        ['Two inputs producing the same hash is called what?', 'a collision'],
        ['Who issues and vouches for certificates?', 'a certificate authority'],
        ['Which key may be shared freely?', 'the public key']
      ]
    }
  ],
  /* =============================== early years =============================== */
  phonics: [
    {
      name: 'Rhyming Words and Syllables', from: 'Pre-K', to: 'Grade 2',
      kind: 'early', noun: 'word',
      facts: [
        ['a rhyme', 'words that end with the same sound'],
        ['cat', 'a word that rhymes with hat'],
        ['dog', 'a word that rhymes with log'],
        ['sun', 'a word that rhymes with run'],
        ['tree', 'a word that rhymes with bee'],
        ['star', 'a word that rhymes with car'],
        ['a syllable', 'a beat in a word'],
        ['one syllable', 'the number of beats in cat'],
        ['two syllables', 'the number of beats in rabbit'],
        ['three syllables', 'the number of beats in elephant'],
        ['clapping', 'the way we count the beats in a word'],
        ['a beginning sound', 'the first sound in a word'],
        ['an ending sound', 'the last sound in a word'],
        ['alliteration', 'words starting with the same sound'],
        ['a nursery rhyme', 'a short rhyming song for young children'],
        ['a rhyming pair', 'two words that rhyme'],
        ['an odd one out', 'the word that does not rhyme with the others'],
        ['a word family', 'words sharing the same ending pattern'],
        ['sounding out', 'saying each sound in a word in turn'],
        ['blending', 'joining sounds together to make a word']
      ],
      truths: [
        'Rhyming words end with the same sound, even when they are spelt differently.',
        'Clapping a word helps you count its syllables.',
        'Alliteration is about the first sound, not the first letter.',
        'Cat, hat and mat are all in the same word family.',
        'A word can rhyme with more than one other word.'
      ],
      myths: [
        'Words only rhyme if they are spelt the same way.',
        'Every word has one syllable.',
        'Rhyming and alliteration are the same thing.',
        'Longer words always have more syllables than shorter ones.',
        'Two words that start alike must rhyme.'
      ],
      applications: [
        ['Which word rhymes with cat?', 'hat'],
        ['How many syllables are in rabbit?', '2'],
        ['Which word rhymes with sun?', 'run'],
        ['How many syllables are in elephant?', '3'],
        ['What do we clap to count in a word?', 'syllables']
      ]
    }
  ],
  earlynumber: [
    {
      name: 'Counting to 20 and Writing Numbers', from: 'Pre-K', to: 'Grade 1',
      kind: 'early', noun: 'number',
      facts: [
        ['one', 'the number after zero'],
        ['two', 'the number after one'],
        ['five', 'the number of fingers on one hand'],
        ['ten', 'the number of fingers on two hands'],
        ['eleven', 'the number after ten'],
        ['twelve', 'the number after eleven'],
        ['fifteen', 'the number between fourteen and sixteen'],
        ['twenty', 'the number after nineteen'],
        ['zero', 'the number meaning none'],
        ['counting on', 'saying the next numbers in order'],
        ['counting back', 'saying numbers in reverse order'],
        ['more', 'a bigger amount'],
        ['fewer', 'a smaller amount'],
        ['the same', 'an equal amount'],
        ['first', 'the one at the front'],
        ['last', 'the one at the end'],
        ['a number line', 'a line with the numbers in order'],
        ['a tally', 'a mark made for each thing counted'],
        ['a pair', 'two things together'],
        ['a group', 'things counted together']
      ],
      truths: [
        'Counting says one number for each thing.',
        'The last number you say is how many there are.',
        'Zero means there are none.',
        'Ten comes before eleven.',
        'Counting back means the numbers get smaller.'
      ],
      myths: [
        'You can count the same thing twice and still be right.',
        'Zero is the same as one.',
        'Numbers can be counted in any order.',
        'Twenty comes before nineteen.',
        'A bigger group always has bigger things in it.'
      ],
      applications: [
        ['What number comes after ten?', 'eleven'],
        ['How many fingers are on two hands?', '10'],
        ['What number comes before twenty?', 'nineteen'],
        ['Which number means none?', 'zero'],
        ['What number comes between fourteen and sixteen?', 'fifteen']
      ]
    }
  ],
  shapescolour: [
    {
      name: 'Sorting, Matching and Making Patterns', from: 'Pre-K', to: 'Grade 1',
      kind: 'early', noun: 'answer',
      facts: [
        ['sorting', 'putting things into groups'],
        ['matching', 'finding two things that go together'],
        ['a pattern', 'something that repeats in order'],
        ['a repeat', 'the part of a pattern that happens again'],
        ['the same', 'alike in some way'],
        ['different', 'not alike'],
        ['a colour', 'red, blue, yellow and the rest'],
        ['a size', 'how big or small something is'],
        ['a shape', 'the outline of something'],
        ['big', 'larger than the others'],
        ['small', 'less big than the others'],
        ['a circle', 'a round shape'],
        ['a square', 'a shape with four equal sides'],
        ['a triangle', 'a shape with three sides'],
        ['a set', 'a group of things that belong together'],
        ['an odd one out', 'the one that does not belong'],
        ['a rule', 'the reason things are in a group'],
        ['order', 'the way things are arranged'],
        ['next', 'the one that comes after'],
        ['a sequence', 'things in a set order']
      ],
      truths: [
        'Things can be sorted by colour, by size or by shape.',
        'A pattern repeats, so you can say what comes next.',
        'The same things can be sorted in more than one way.',
        'The odd one out is the one that breaks the rule.',
        'A circle is round and a square has four equal sides.'
      ],
      myths: [
        'There is only one right way to sort a set of things.',
        'A pattern can never repeat more than twice.',
        'Two shapes of different colours cannot be the same shape.',
        'Bigger things always come first in a pattern.',
        'A triangle has four sides.'
      ],
      applications: [
        ['Red, blue, red, blue, what comes next?', 'red'],
        ['How many sides does a triangle have?', '3'],
        ['Which shape is round?', 'a circle'],
        ['Putting things into groups is called what?', 'sorting'],
        ['The one that does not belong is called what?', 'the odd one out']
      ]
    }
  ],
  worldaround: [
    {
      name: 'Seasons, Weather and the Days of the Week', from: 'Pre-K', to: 'Grade 2',
      kind: 'early', noun: 'answer',
      facts: [
        ['spring', 'the season when plants start to grow'],
        ['summer', 'the warmest season'],
        ['autumn', 'the season when leaves fall'],
        ['winter', 'the coldest season'],
        ['sunny', 'weather with bright sunshine'],
        ['rainy', 'weather with rain falling'],
        ['cloudy', 'weather with clouds covering the sky'],
        ['windy', 'weather with strong moving air'],
        ['snowy', 'weather with snow falling'],
        ['a thermometer', 'the tool that measures how warm it is'],
        ['Monday', 'the first day of the school week'],
        ['Friday', 'the last day of the school week'],
        ['Saturday', 'a day of the weekend'],
        ['Sunday', 'the other day of the weekend'],
        ['today', 'the day it is now'],
        ['yesterday', 'the day before today'],
        ['tomorrow', 'the day after today'],
        ['morning', 'the early part of the day'],
        ['afternoon', 'the part of the day after midday'],
        ['night', 'the dark part of the day']
      ],
      truths: [
        'There are four seasons in a year.',
        'There are seven days in a week.',
        'Winter is the coldest season and summer the warmest.',
        'Tomorrow comes after today.',
        'A thermometer tells us how warm or cold it is.'
      ],
      myths: [
        'There are five seasons in a year.',
        'Every day of the week is a school day.',
        'It is always sunny in summer.',
        'Yesterday comes after today.',
        'Leaves fall in spring.'
      ],
      applications: [
        ['How many seasons are in a year?', '4'],
        ['Which season is the coldest?', 'winter'],
        ['How many days are in a week?', '7'],
        ['Which day comes after today?', 'tomorrow'],
        ['Which tool measures how warm it is?', 'a thermometer']
      ]
    }
  ],
  readiness: [
    {
      name: 'Feelings, Sharing and Taking Turns', from: 'Pre-K', to: 'Grade 2',
      kind: 'early', noun: 'answer',
      facts: [
        ['happy', 'the feeling when something is good'],
        ['sad', 'the feeling when something is upsetting'],
        ['angry', 'the feeling when something is unfair'],
        ['worried', 'the feeling when something might go wrong'],
        ['excited', 'the feeling when something good is coming'],
        ['calm', 'feeling settled and steady'],
        ['sharing', 'letting someone else have some too'],
        ['taking turns', 'each having a go one after the other'],
        ['waiting', 'staying patient until it is your turn'],
        ['helping', 'doing something to make things easier for someone'],
        ['listening', 'paying attention to what someone says'],
        ['a please', 'the word used when asking for something'],
        ['a thank you', 'the words used when someone helps'],
        ['sorry', 'the word used when you have upset someone'],
        ['a friend', 'someone you like to be with'],
        ['kindness', 'doing something good for someone else'],
        ['a rule', 'something we all agree to do'],
        ['a trusted adult', 'a grown-up you can tell if something is wrong'],
        ['tidying up', 'putting things back where they belong'],
        ['deep breaths', 'the slow breathing that helps you feel calmer']
      ],
      truths: [
        'It is fine to feel angry, and it is not fine to hurt someone.',
        'Taking turns means everyone gets a go.',
        'Telling a trusted adult is the right thing when something is wrong.',
        'Deep breaths help when a feeling is very big.',
        'Saying sorry helps put something right.'
      ],
      myths: [
        'Big feelings are something to hide.',
        'Sharing means giving everything away.',
        'Only children who are upset need help.',
        'Being kind means always agreeing.',
        'Waiting your turn means you have been forgotten.'
      ],
      applications: [
        ['What do you say when someone helps you?', 'thank you'],
        ['What is it called when each person has a go?', 'taking turns'],
        ['Who should you tell if something is wrong?', 'a trusted adult'],
        ['What helps when a feeling is very big?', 'deep breaths'],
        ['What do you say when you have upset someone?', 'sorry']
      ]
    }
  ]
};
