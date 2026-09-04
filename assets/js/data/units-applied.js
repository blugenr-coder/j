/* Applied and elective micro-units.
   Computing, health, business, engineering, the environment, the arts and
   study skills, broken into the units these subjects are actually taught in. */

export const APPLIED_UNITS = {
  /* ============================== PROGRAMMING ============================== */
  programming: [
    {
      name: 'Variables and Data Types', from: 'Grade 6', to: 'College',
      facts: [
        ['variable', 'a named place to store a value'],
        ['integer', 'a whole number type'],
        ['float', 'a number type with a decimal part'],
        ['string', 'a sequence of characters'],
        ['boolean', 'a type with only the values true and false'],
        ['assignment', 'giving a variable a value, usually with ='],
        ['constant', 'a value that must not change once set'],
        ['declaration', 'the statement that brings a variable into existence'],
        ['type conversion', 'changing a value from one type to another'],
        ['concatenation', 'joining two strings end to end'],
        ['scope', 'the region of code where a name is visible'],
        ['null', 'a value meaning “nothing here”'],
        ['identifier', 'the name given to a variable or function'],
        ['literal', 'a value written directly in the code']
      ],
      truths: [
        'A variable name should describe what it holds, not what type it is.',
        'Adding the string "2" to the string "3" gives "23", not 5.',
        'A constant is meant to be set once and never reassigned.',
        'Scope is what stops two functions clashing over the same name.'
      ],
      myths: [
        'A variable can only ever hold a number.',
        'Adding two strings of digits performs arithmetic.',
        'Every variable is visible everywhere in a program.',
        'Changing a variable’s value changes its name.'
      ]
    },
    {
      name: 'Conditionals and Logic', from: 'Grade 6', to: 'College',
      facts: [
        ['if statement', 'code that runs only when a condition is true'],
        ['else', 'the branch taken when the condition is false'],
        ['else if', 'an additional condition tested when the first fails'],
        ['condition', 'an expression that evaluates to true or false'],
        ['comparison operator', 'a symbol such as > or == that compares values'],
        ['equality operator', 'the operator testing whether two values are the same'],
        ['AND', 'a logical operator true only when both sides are true'],
        ['OR', 'a logical operator true when either side is true'],
        ['NOT', 'a logical operator that reverses a truth value'],
        ['nested condition', 'an if statement inside another if statement'],
        ['boolean expression', 'an expression evaluating to true or false'],
        ['truth table', 'a table listing every combination of inputs and the result'],
        ['short-circuit', 'skipping the second operand when the first decides the result'],
        ['switch', 'a structure choosing between many fixed values']
      ],
      truths: [
        'A single = assigns a value while == compares two values in most languages.',
        'An AND is true only when both of its operands are true.',
        'An else branch runs only when every earlier condition was false.',
        'A truth table lists every possible combination of inputs.'
      ],
      myths: [
        'A single = is used to test whether two values are equal.',
        'An OR is true only when both sides are true.',
        'Every if statement must have an else.',
        'Conditions can evaluate to any number rather than true or false.'
      ]
    },
    {
      name: 'Loops and Iteration', from: 'Grade 6', to: 'College',
      facts: [
        ['loop', 'a structure that repeats a block of code'],
        ['for loop', 'a loop repeating a known number of times'],
        ['while loop', 'a loop repeating while a condition stays true'],
        ['counter', 'a variable tracking how many times a loop has run'],
        ['iteration', 'one pass through the body of a loop'],
        ['infinite loop', 'a loop whose condition never becomes false'],
        ['break', 'a statement leaving a loop early'],
        ['continue', 'a statement skipping to the next iteration'],
        ['nested loop', 'a loop inside another loop'],
        ['range', 'the sequence of values a for loop steps through'],
        ['accumulator', 'a variable building up a total across iterations'],
        ['off-by-one error', 'a loop running one time too many or too few'],
        ['loop body', 'the code that repeats'],
        ['condition check', 'the test made before or after each iteration']
      ],
      truths: [
        'A while loop may run zero times if its condition starts false.',
        'An infinite loop happens when nothing inside changes the condition.',
        'Nested loops multiply the number of iterations.',
        'Off-by-one errors usually come from confusing < with <=.'
      ],
      myths: [
        'Every loop runs at least once.',
        'A for loop and a while loop can never do the same job.',
        'Nested loops add their iteration counts together.',
        'Break and continue do the same thing.'
      ]
    },
    {
      name: 'Functions and Parameters', from: 'Grade 7', to: 'College',
      facts: [
        ['function', 'a named block of code that can be called'],
        ['parameter', 'a name a function uses for a value passed in'],
        ['argument', 'the actual value passed into a function'],
        ['return value', 'the result a function hands back'],
        ['call', 'the act of running a function'],
        ['definition', 'the code that says what a function does'],
        ['local variable', 'a variable that exists only inside a function'],
        ['global variable', 'a variable visible throughout a program'],
        ['side effect', 'a change a function makes beyond its return value'],
        ['recursion', 'a function that calls itself'],
        ['base case', 'the condition that stops a recursion'],
        ['default parameter', 'a parameter with a value used when none is given'],
        ['abstraction', 'hiding detail behind a simple interface'],
        ['reuse', 'calling the same function from several places']
      ],
      truths: [
        'A parameter is the name; an argument is the value passed in.',
        'A recursive function without a base case never stops.',
        'Local variables disappear when the function returns.',
        'Functions exist to be called more than once.'
      ],
      myths: [
        'A parameter and an argument are the same thing.',
        'Every function must return a value.',
        'Local variables keep their value after the function ends.',
        'Recursion is always faster than a loop.'
      ]
    },
    {
      name: 'Lists and Data Structures', from: 'Grade 7', to: 'College',
      facts: [
        ['list', 'an ordered collection of values'],
        ['array', 'a fixed-size ordered collection'],
        ['index', 'the position of an item, usually starting at 0'],
        ['length', 'the number of items in a collection'],
        ['append', 'adding an item to the end'],
        ['dictionary', 'a collection of key–value pairs'],
        ['key', 'the label used to look a value up'],
        ['set', 'a collection with no duplicates and no order'],
        ['tuple', 'an ordered collection that cannot be changed'],
        ['nested list', 'a list whose items are themselves lists'],
        ['slice', 'a section taken out of a list'],
        ['iteration over a list', 'visiting each item in turn'],
        ['stack', 'a structure where the last item in is the first out'],
        ['queue', 'a structure where the first item in is the first out']
      ],
      truths: [
        'List indexes usually start at 0, so the last index is length minus one.',
        'A dictionary looks values up by key rather than by position.',
        'A set removes duplicates automatically.',
        'A stack is last-in-first-out; a queue is first-in-first-out.'
      ],
      myths: [
        'The first item in a list is at index 1.',
        'A dictionary keeps its items in the order you inserted them by position number.',
        'A set and a list are the same structure.',
        'A queue is last-in-first-out.'
      ]
    },
    {
      name: 'Debugging and Testing', from: 'Grade 7', to: 'College',
      facts: [
        ['bug', 'an error causing a program to behave wrongly'],
        ['syntax error', 'code the language cannot parse at all'],
        ['runtime error', 'an error that stops the program while it runs'],
        ['logic error', 'code that runs but produces the wrong answer'],
        ['debugging', 'the process of finding and fixing errors'],
        ['breakpoint', 'a marker pausing execution so state can be inspected'],
        ['trace', 'following the values of variables step by step'],
        ['test case', 'an input with its expected output'],
        ['edge case', 'an input at the boundary of what is allowed'],
        ['unit test', 'an automated test of one small piece of code'],
        ['regression', 'a bug reintroduced into code that used to work'],
        ['stack trace', 'the report showing where an error occurred'],
        ['rubber duck debugging', 'explaining code aloud to find the fault'],
        ['reproduce', 'making a bug happen reliably before fixing it']
      ],
      truths: [
        'A logic error produces a wrong answer without crashing.',
        'A bug you cannot reproduce is a bug you cannot confirm you fixed.',
        'Edge cases are where most bugs hide.',
        'A syntax error stops the program before it runs at all.'
      ],
      myths: [
        'If a program runs without crashing it must be correct.',
        'A syntax error and a logic error are the same kind of fault.',
        'Testing is only necessary for large programs.',
        'A stack trace tells you nothing useful about where a fault happened.'
      ]
    }
  ],

  /* =============================== ALGORITHMS =============================== */
  algorithms: [
    {
      name: 'Searching Algorithms', from: 'Grade 8', to: 'College',
      facts: [
        ['linear search', 'checking each item in turn until a match is found'],
        ['binary search', 'repeatedly halving a sorted list to find an item'],
        ['sorted data', 'the precondition binary search depends on'],
        ['worst case', 'the slowest a method can be for a given input size'],
        ['best case', 'the fastest a method can be'],
        ['average case', 'the typical performance over many inputs'],
        ['comparison', 'the basic operation counted when analysing a search'],
        ['midpoint', 'the item binary search checks first'],
        ['O(n)', 'time growing in proportion to the number of items'],
        ['O(log n)', 'time growing with the logarithm of the number of items'],
        ['hash lookup', 'finding an item directly from a computed position'],
        ['index', 'a structure built to make lookups faster'],
        ['search space', 'the set of items still under consideration'],
        ['terminating condition', 'the test that ends a search']
      ],
      truths: [
        'Binary search only works on data that is already sorted.',
        'Binary search halves the search space with each comparison.',
        'Linear search takes time proportional to the number of items.',
        'On a short unsorted list, linear search can be the sensible choice.'
      ],
      myths: [
        'Binary search works on any list, sorted or not.',
        'Binary search is always faster in practice than linear search.',
        'Linear search takes the same time regardless of list length.',
        'Sorting a list is free, so it never affects which search to use.'
      ]
    },
    {
      name: 'Sorting Algorithms', from: 'Grade 9', to: 'College',
      facts: [
        ['bubble sort', 'repeatedly swapping adjacent items that are out of order'],
        ['insertion sort', 'building a sorted section one item at a time'],
        ['selection sort', 'repeatedly moving the smallest remaining item into place'],
        ['merge sort', 'splitting, sorting each half and merging them back'],
        ['quicksort', 'partitioning around a pivot and sorting each side'],
        ['pivot', 'the value quicksort partitions around'],
        ['stable sort', 'a sort that preserves the order of equal items'],
        ['in-place sort', 'a sort needing little extra memory'],
        ['divide and conquer', 'the strategy behind merge sort and quicksort'],
        ['O(n²)', 'the time complexity of the simple comparison sorts'],
        ['O(n log n)', 'the time complexity of merge sort'],
        ['swap', 'exchanging two items’ positions'],
        ['pass', 'one complete sweep through the data'],
        ['already-sorted input', 'the best case for insertion sort']
      ],
      truths: [
        'Merge sort runs in O(n log n) time in every case.',
        'Bubble sort is easy to understand and slow on large inputs.',
        'A stable sort keeps equal items in their original relative order.',
        'Insertion sort is fast on data that is nearly sorted already.'
      ],
      myths: [
        'Bubble sort is the fastest sorting algorithm for large data.',
        'Merge sort sorts in place with no extra memory.',
        'Every sorting algorithm is stable.',
        'Quicksort always runs in O(n log n) whatever the pivot.'
      ]
    },
    {
      name: 'Complexity and Efficiency', from: 'Grade 10', to: 'College',
      facts: [
        ['algorithm', 'a finite sequence of steps solving a problem'],
        ['time complexity', 'how running time grows with input size'],
        ['space complexity', 'how memory use grows with input size'],
        ['Big-O notation', 'a way of describing growth as input size rises'],
        ['constant time', 'O(1) — the same time regardless of input size'],
        ['linear time', 'O(n) — time proportional to input size'],
        ['quadratic time', 'O(n²) — time proportional to the square of input size'],
        ['logarithmic time', 'O(log n) — time growing very slowly with size'],
        ['exponential time', 'O(2ⁿ) — time doubling with each extra item'],
        ['trade-off', 'accepting more memory to gain speed, or the reverse'],
        ['benchmark', 'measuring real performance rather than predicting it'],
        ['scalability', 'whether an approach still works as data grows'],
        ['worst-case analysis', 'assessing the least favourable input'],
        ['optimisation', 'making an algorithm use fewer resources']
      ],
      truths: [
        'Big-O describes growth, not the exact time an algorithm takes.',
        'An O(n²) algorithm can beat an O(n log n) one on small inputs.',
        'Time and space can often be traded against each other.',
        'Constant factors are dropped in Big-O but still matter in practice.'
      ],
      myths: [
        'Big-O tells you exactly how many seconds an algorithm will take.',
        'An algorithm with a lower Big-O is always faster on any input.',
        'Memory use is irrelevant to algorithm choice.',
        'Optimising code always improves the user experience.'
      ]
    },
    {
      name: 'Recursion and Problem Decomposition', from: 'Grade 9', to: 'College',
      facts: [
        ['recursion', 'solving a problem using a smaller version of itself'],
        ['base case', 'the smallest case answered directly'],
        ['recursive case', 'the step reducing the problem towards the base case'],
        ['call stack', 'the record of function calls waiting to finish'],
        ['stack overflow', 'the failure when recursion goes too deep'],
        ['factorial', 'the classic example of a recursive definition'],
        ['Fibonacci sequence', 'a sequence defined by the sum of the two before it'],
        ['decomposition', 'breaking a problem into smaller sub-problems'],
        ['divide and conquer', 'splitting, solving and combining'],
        ['memoisation', 'storing results so they need not be recomputed'],
        ['tail recursion', 'recursion whose call is the last action'],
        ['iterative equivalent', 'a loop that does the same job as a recursion'],
        ['tree traversal', 'a naturally recursive walk over a branching structure'],
        ['depth', 'how many levels of calls are open at once']
      ],
      truths: [
        'Every recursion needs a base case or it never terminates.',
        'Recursion uses the call stack, so deep recursion can exhaust memory.',
        'Any recursion can in principle be rewritten as a loop.',
        'Memoisation turns naive Fibonacci recursion from exponential into linear.'
      ],
      myths: [
        'A recursive function does not need a stopping condition.',
        'Recursion uses no more memory than a loop.',
        'Recursion is always the clearest way to express a solution.',
        'Memoisation changes the answer a function returns.'
      ]
    },
    {
      name: 'Data Structures in Practice', from: 'Grade 10', to: 'College',
      facts: [
        ['array', 'a fixed-size block of items accessed by index'],
        ['linked list', 'items each holding a pointer to the next'],
        ['stack', 'a last-in-first-out structure'],
        ['queue', 'a first-in-first-out structure'],
        ['tree', 'a branching structure with a single root'],
        ['binary tree', 'a tree in which each node has at most two children'],
        ['graph', 'a set of nodes joined by edges'],
        ['hash table', 'a structure mapping keys to values by computed position'],
        ['collision', 'two keys hashing to the same position'],
        ['node', 'one element of a linked structure'],
        ['pointer', 'a reference to where something is stored'],
        ['traversal', 'visiting every element of a structure'],
        ['insertion cost', 'how expensive it is to add an item'],
        ['lookup cost', 'how expensive it is to find an item']
      ],
      truths: [
        'A hash table gives near-constant lookup when collisions are rare.',
        'Inserting into the middle of an array is expensive; into a linked list it is cheap.',
        'A tree is a graph with no cycles and a single root.',
        'Choosing the right structure matters more than micro-optimising the code.'
      ],
      myths: [
        'Arrays and linked lists have identical performance for every operation.',
        'A hash table never has collisions.',
        'Every graph is a tree.',
        'The choice of data structure rarely affects performance.'
      ]
    }
  ],

  /* ================================== DATA ================================== */
  data: [
    {
      name: 'Data Representation', from: 'Grade 6', to: 'College',
      facts: [
        ['binary', 'the base-2 number system of 0 and 1'],
        ['bit', 'a single binary digit'],
        ['byte', 'a group of eight bits'],
        ['denary', 'the everyday base-10 number system'],
        ['hexadecimal', 'the base-16 system used as shorthand for binary'],
        ['ASCII', 'a character encoding using seven or eight bits'],
        ['Unicode', 'the encoding covering the world’s writing systems'],
        ['pixel', 'the smallest element of a bitmap image'],
        ['resolution', 'the number of pixels making up an image'],
        ['colour depth', 'the number of bits used per pixel'],
        ['sample rate', 'how many times a second sound is measured'],
        ['compression', 'reducing the size of a file'],
        ['lossless', 'compression that discards nothing'],
        ['lossy', 'compression that discards data to save space']
      ],
      truths: [
        'A byte is eight bits and can represent 256 different values.',
        'Lossy compression discards information permanently.',
        'Higher colour depth means more bits per pixel and a larger file.',
        'Unicode was created because ASCII could not cover every writing system.'
      ],
      myths: [
        'A byte is ten bits.',
        'Lossless compression throws away detail you cannot see.',
        'Increasing resolution never increases file size.',
        'ASCII can represent every character in every language.'
      ]
    },
    {
      name: 'Databases and Queries', from: 'Grade 8', to: 'College',
      facts: [
        ['database', 'an organised collection of data'],
        ['table', 'a set of records with the same fields'],
        ['record', 'one row of a table'],
        ['field', 'one column of a table'],
        ['primary key', 'a field uniquely identifying each record'],
        ['foreign key', 'a field referring to a key in another table'],
        ['query', 'a request for data matching some criteria'],
        ['SQL', 'the language most databases are queried in'],
        ['SELECT', 'the SQL keyword that retrieves data'],
        ['WHERE', 'the SQL clause that filters rows'],
        ['JOIN', 'combining rows from two tables on a shared value'],
        ['relational database', 'a database of linked tables'],
        ['validation', 'checking data is sensible before it is stored'],
        ['redundancy', 'the same data stored in more than one place']
      ],
      truths: [
        'A primary key must be unique for every record in a table.',
        'A foreign key links a record to a record in another table.',
        'Validation checks that data is reasonable, not that it is true.',
        'Splitting data across linked tables reduces redundancy.'
      ],
      myths: [
        'A primary key can repeat as long as the records differ.',
        'Validation guarantees the data entered is accurate.',
        'A database and a spreadsheet are the same thing.',
        'Storing the same value in several tables is good practice.'
      ]
    },
    {
      name: 'Spreadsheets and Analysis', from: 'Grade 6', to: 'College',
      facts: [
        ['cell', 'the intersection of a row and a column'],
        ['formula', 'an expression calculating a value from other cells'],
        ['function', 'a built-in operation such as SUM or AVERAGE'],
        ['range', 'a block of cells such as A1:A20'],
        ['relative reference', 'a reference that shifts when copied'],
        ['absolute reference', 'a reference fixed with dollar signs'],
        ['SUM', 'the function adding a range of numbers'],
        ['AVERAGE', 'the function finding the mean of a range'],
        ['IF', 'the function returning one value or another on a test'],
        ['COUNTIF', 'the function counting cells that meet a condition'],
        ['sort', 'reordering rows by the values in a column'],
        ['filter', 'showing only the rows meeting a condition'],
        ['chart', 'a visual representation of the values'],
        ['pivot table', 'a summary table grouping and aggregating data']
      ],
      truths: [
        'An absolute reference does not change when a formula is copied.',
        'A formula must begin with an equals sign.',
        'Sorting rearranges the data; filtering only hides rows.',
        'A chart should be chosen to suit the kind of data being shown.'
      ],
      myths: [
        'Relative and absolute references behave identically when copied.',
        'A formula works whether or not it starts with an equals sign.',
        'Filtering deletes the rows that do not match.',
        'Any chart type suits any data set.'
      ]
    },
    {
      name: 'Data Ethics and Privacy', from: 'Grade 7', to: 'College',
      facts: [
        ['personal data', 'information that identifies a living person'],
        ['consent', 'permission freely given for data to be used'],
        ['anonymisation', 'removing identifying details from a dataset'],
        ['data minimisation', 'collecting only what is genuinely needed'],
        ['encryption', 'encoding data so only authorised parties can read it'],
        ['data breach', 'an incident in which data is exposed or stolen'],
        ['retention', 'how long data is kept before deletion'],
        ['profiling', 'building a picture of someone from their data'],
        ['algorithmic bias', 'a system producing unfair outcomes for some groups'],
        ['transparency', 'being clear about what data is used and how'],
        ['data subject', 'the person a piece of personal data is about'],
        ['third party', 'an outside organisation given access to data'],
        ['digital footprint', 'the trail of data a person leaves behind'],
        ['right to erasure', 'the right to have your data deleted']
      ],
      truths: [
        'Algorithmic bias usually comes from biased training data, not malice.',
        'Anonymised data can sometimes be re-identified by combining datasets.',
        'Consent must be informed to be meaningful.',
        'Collecting less data reduces the harm a breach can cause.'
      ],
      myths: [
        'Anonymised data can never be traced back to a person.',
        'An algorithm cannot be biased because it is only mathematics.',
        'Agreeing to terms without reading them counts as informed consent.',
        'Collecting as much data as possible is always the safest approach.'
      ]
    }
  ],

  /* ================================== WEB ================================== */
  web: [
    {
      name: 'HTML Structure', from: 'Grade 7', to: 'College',
      facts: [
        ['HTML', 'the language describing the structure of a web page'],
        ['element', 'a piece of a page marked by tags'],
        ['tag', 'the marker opening or closing an element'],
        ['attribute', 'extra information written inside an opening tag'],
        ['heading', 'the h1 to h6 elements marking sections'],
        ['paragraph', 'the p element holding a block of text'],
        ['anchor', 'the a element that creates a link'],
        ['href', 'the attribute holding a link’s destination'],
        ['image element', 'the img element that places a picture'],
        ['alt text', 'the description read when an image cannot be seen'],
        ['list', 'the ul or ol element holding list items'],
        ['semantic element', 'a tag such as nav or article naming its purpose'],
        ['nesting', 'placing one element inside another'],
        ['doctype', 'the declaration at the top of an HTML document']
      ],
      truths: [
        'Alt text exists so screen readers and failed loads still convey meaning.',
        'Semantic elements describe purpose, not appearance.',
        'There should be one h1 describing the page’s main subject.',
        'Elements must be closed in the reverse order they were opened.'
      ],
      myths: [
        'Alt text is only there to improve search rankings.',
        'HTML controls how a page looks.',
        'Heading levels can be chosen purely for text size.',
        'Elements can overlap as long as every tag is closed somewhere.'
      ]
    },
    {
      name: 'CSS and Layout', from: 'Grade 8', to: 'College',
      facts: [
        ['CSS', 'the language describing how a page looks'],
        ['selector', 'the part of a rule choosing which elements to style'],
        ['declaration', 'a property and value pair inside a rule'],
        ['class', 'a reusable label applied to many elements'],
        ['id', 'a unique label for one element'],
        ['specificity', 'the rule deciding which style wins a conflict'],
        ['cascade', 'the order in which conflicting rules are resolved'],
        ['box model', 'content, padding, border and margin around an element'],
        ['flexbox', 'a one-dimensional layout system'],
        ['grid', 'a two-dimensional layout system'],
        ['media query', 'a rule applying styles at certain screen sizes'],
        ['responsive design', 'a layout that adapts to the screen it is on'],
        ['inheritance', 'the way some properties pass to child elements'],
        ['custom property', 'a reusable value declared with two dashes']
      ],
      truths: [
        'An id selector is more specific than a class selector.',
        'Margin is outside the border; padding is inside it.',
        'Media queries let one stylesheet serve phones and desktops.',
        'When two rules have equal specificity, the later one wins.'
      ],
      myths: [
        'A class selector always beats an id selector.',
        'Padding sits outside the border of an element.',
        'Responsive design means building a separate mobile site.',
        'The first rule written always wins a conflict.'
      ]
    },
    {
      name: 'How the Web Works', from: 'Grade 7', to: 'College',
      facts: [
        ['URL', 'the address of a resource on the web'],
        ['domain name', 'the human-readable name of a site'],
        ['DNS', 'the system translating names into IP addresses'],
        ['IP address', 'the numeric address of a device on a network'],
        ['HTTP', 'the protocol used to request and send web pages'],
        ['HTTPS', 'the encrypted version of HTTP'],
        ['server', 'the computer that stores and sends a website'],
        ['client', 'the browser or app making the request'],
        ['request', 'the message asking a server for something'],
        ['response', 'the message a server sends back'],
        ['status code', 'the number reporting how a request went'],
        ['cache', 'a store of previously fetched resources'],
        ['cookie', 'a small piece of data a site stores in the browser'],
        ['hosting', 'the service that keeps a site available online']
      ],
      truths: [
        'HTTPS encrypts traffic between the browser and the server.',
        'DNS translates a domain name into an IP address.',
        'A 404 status code means the resource was not found.',
        'Caching speeds up a site by avoiding repeated downloads.'
      ],
      myths: [
        'HTTPS guarantees that a website is trustworthy.',
        'A domain name and an IP address are the same thing.',
        'A 404 error means the whole server is down.',
        'Cookies are programs that run on your computer.'
      ]
    },
    {
      name: 'Accessibility and Usability', from: 'Grade 8', to: 'College',
      facts: [
        ['accessibility', 'designing so that people with disabilities can use a site'],
        ['screen reader', 'software that reads a page aloud'],
        ['alt text', 'a written description of an image'],
        ['contrast ratio', 'the measured difference between text and background'],
        ['keyboard navigation', 'using a site without a mouse'],
        ['focus indicator', 'the visible outline showing what is selected'],
        ['ARIA label', 'an attribute naming an element for assistive technology'],
        ['skip link', 'a link letting a user jump past the navigation'],
        ['captions', 'text of the spoken content in a video'],
        ['WCAG', 'the international web accessibility guidelines'],
        ['semantic markup', 'using elements that describe their purpose'],
        ['tab order', 'the sequence keyboard focus moves through'],
        ['colour independence', 'not relying on colour alone to convey meaning'],
        ['usability', 'how easily people can achieve what they came to do']
      ],
      truths: [
        'Colour alone should never be the only way meaning is conveyed.',
        'Removing focus outlines makes a site unusable by keyboard.',
        'Accessible design usually improves usability for everyone.',
        'Captions help far more people than those who cannot hear.'
      ],
      myths: [
        'Accessibility only matters for a tiny minority of users.',
        'Colour is a reliable way to convey meaning on its own.',
        'Accessible sites have to look plain.',
        'Automated checkers can prove a site is fully accessible.'
      ]
    }
  ],

  /* ================================= CYBER ================================= */
  cyber: [
    {
      name: 'Passwords and Authentication', from: 'Grade 6', to: 'College',
      facts: [
        ['password', 'a secret used to prove who you are'],
        ['passphrase', 'a long password made of several words'],
        ['two-factor authentication', 'a second check beyond the password'],
        ['password manager', 'software that stores strong unique passwords'],
        ['brute force attack', 'trying every combination until one works'],
        ['dictionary attack', 'trying common words and known passwords'],
        ['credential stuffing', 'reusing leaked passwords on other sites'],
        ['hashing', 'storing a one-way transformation instead of the password'],
        ['salt', 'random data added before hashing to defeat lookup tables'],
        ['biometrics', 'authentication by fingerprint or face'],
        ['session', 'the period you stay signed in'],
        ['single sign-on', 'using one account to sign in to several services'],
        ['account recovery', 'the process of regaining access to an account'],
        ['breach', 'an incident exposing stored credentials']
      ],
      truths: [
        'Length matters more than symbol substitution for password strength.',
        'Reusing a password means one breach compromises every account.',
        'Two-factor authentication protects an account even if the password leaks.',
        'Well-designed services store a salted hash, never the password itself.'
      ],
      myths: [
        'Replacing letters with symbols makes a short password strong.',
        'Two-factor authentication is unnecessary if the password is long.',
        'A site that can email you your password is storing it securely.',
        'Changing passwords every month is the most important safeguard.'
      ]
    },
    {
      name: 'Phishing and Social Engineering', from: 'Grade 6', to: 'College',
      facts: [
        ['phishing', 'a message impersonating someone to steal information'],
        ['spear phishing', 'a phishing attack aimed at one specific person'],
        ['social engineering', 'manipulating people rather than breaking software'],
        ['pretexting', 'inventing a scenario to gain trust'],
        ['urgency', 'the pressure tactic used to prevent careful thought'],
        ['spoofed address', 'a sender address made to look genuine'],
        ['malicious link', 'a link leading somewhere other than it claims'],
        ['attachment', 'a file that may carry malware'],
        ['smishing', 'phishing carried out by text message'],
        ['vishing', 'phishing carried out by phone call'],
        ['red flag', 'a warning sign that a message is not genuine'],
        ['verification', 'checking through a separate known channel'],
        ['report', 'telling the organisation or platform about an attempt'],
        ['data harvesting', 'collecting details for use in a later attack']
      ],
      truths: [
        'Urgency is the most common pressure tactic in phishing.',
        'A sender address can be forged to look exactly like a real one.',
        'The safe response is to verify through a channel you already trust.',
        'Spear phishing uses real details about you to seem credible.'
      ],
      myths: [
        'Phishing emails always contain obvious spelling mistakes.',
        'A message from a known address is guaranteed to be genuine.',
        'Only careless people fall for phishing.',
        'Clicking a link is safe as long as you do not type anything.'
      ]
    },
    {
      name: 'Malware and Protection', from: 'Grade 7', to: 'College',
      facts: [
        ['malware', 'software written to cause harm'],
        ['virus', 'malware that attaches itself to another file'],
        ['worm', 'malware that spreads by itself across a network'],
        ['trojan', 'malware disguised as something useful'],
        ['ransomware', 'malware that encrypts files and demands payment'],
        ['spyware', 'malware that secretly gathers information'],
        ['antivirus', 'software that detects and removes malware'],
        ['firewall', 'a barrier controlling network traffic'],
        ['patch', 'an update fixing a security flaw'],
        ['zero-day', 'a flaw exploited before a fix exists'],
        ['backup', 'a separate copy of data kept for recovery'],
        ['sandbox', 'an isolated environment for running untrusted code'],
        ['permission', 'the access an app is granted on a device'],
        ['update', 'the routine maintenance that closes known holes']
      ],
      truths: [
        'Keeping software updated closes the flaws most attacks rely on.',
        'A recent offline backup is the most reliable defence against ransomware.',
        'A trojan works by looking like something you wanted to install.',
        'A worm spreads without anyone opening anything.'
      ],
      myths: [
        'Antivirus software makes a device impossible to infect.',
        'Paying a ransom reliably restores your files.',
        'Only Windows computers can be infected by malware.',
        'A virus and a worm spread in exactly the same way.'
      ]
    },
    {
      name: 'Staying Safe Online', from: 'Grade 6', to: 'College',
      facts: [
        ['digital footprint', 'the record of your activity left online'],
        ['privacy settings', 'controls limiting who can see what you post'],
        ['oversharing', 'posting details that could be used against you'],
        ['location data', 'information revealing where you are'],
        ['public Wi-Fi', 'a shared network where traffic may be observed'],
        ['VPN', 'a service encrypting traffic over an untrusted network'],
        ['catfishing', 'pretending to be someone else online'],
        ['cyberbullying', 'harassment carried out through digital means'],
        ['blocking', 'preventing someone from contacting you'],
        ['reporting', 'telling a platform about harmful behaviour'],
        ['screenshot evidence', 'a saved record of harmful messages'],
        ['trusted adult', 'someone to tell when something online goes wrong'],
        ['scam', 'a deception aimed at taking money or data'],
        ['terms of service', 'the rules you agree to when using a platform']
      ],
      truths: [
        'Deleting a post does not guarantee it is gone from the internet.',
        'Photographs can carry location data unless it is stripped.',
        'Blocking and reporting are both worth doing, for different reasons.',
        'Keeping evidence matters before blocking someone who is harassing you.'
      ],
      myths: [
        'Deleting a post removes every copy of it.',
        'Private accounts make anything you post completely safe.',
        'Public Wi-Fi is as safe as a home network.',
        'Nothing posted anonymously can ever be traced.'
      ]
    }
  ],

  /* ================================ NUTRITION ================================ */
  nutrition: [
    {
      name: 'Nutrients and Food Groups', from: 'Grade 4', to: 'College',
      facts: [
        ['carbohydrate', 'the nutrient providing the body’s main energy source'],
        ['protein', 'the nutrient needed for growth and repair'],
        ['fat', 'the nutrient providing concentrated energy and insulation'],
        ['fibre', 'plant material that keeps digestion moving'],
        ['vitamin', 'a micronutrient needed in small amounts'],
        ['mineral', 'an inorganic nutrient such as iron or calcium'],
        ['vitamin C', 'the vitamin needed for healthy connective tissue'],
        ['calcium', 'the mineral needed for bones and teeth'],
        ['iron', 'the mineral needed to carry oxygen in the blood'],
        ['saturated fat', 'the fat type linked to raised cholesterol'],
        ['unsaturated fat', 'the fat type found in oils, nuts and fish'],
        ['balanced diet', 'a diet supplying every nutrient in the right proportion'],
        ['portion size', 'the amount of a food eaten at one time'],
        ['hydration', 'maintaining the body’s water balance']
      ],
      truths: [
        'Carbohydrates are the body’s main source of energy.',
        'Protein is needed for growth and repair, not mainly for energy.',
        'Fat is an essential nutrient, not something to eliminate entirely.',
        'Vitamin C helps the body absorb iron from plant foods.'
      ],
      myths: [
        'All fat is bad and should be removed from the diet.',
        'Protein is the body’s main energy source.',
        'Vitamins provide the body with energy.',
        'A food labelled low-fat is automatically healthy.'
      ]
    },
    {
      name: 'Energy, Labels and Choices', from: 'Grade 5', to: 'College',
      facts: [
        ['calorie', 'a unit of food energy'],
        ['kilojoule', 'the metric unit of energy on food labels'],
        ['energy balance', 'the relationship between energy in and energy used'],
        ['basal metabolic rate', 'the energy used at complete rest'],
        ['nutrition label', 'the panel listing energy and nutrients per serving'],
        ['per 100 g', 'the standard basis for comparing two products'],
        ['ingredient list', 'the components in descending order by weight'],
        ['added sugar', 'sugar put in during processing'],
        ['traffic light labelling', 'colour coding for fat, sugar and salt'],
        ['reference intake', 'the guideline daily amount for an average adult'],
        ['processed food', 'food altered from its natural state'],
        ['ultra-processed food', 'food made largely from industrial ingredients'],
        ['serving size', 'the amount the label’s figures refer to'],
        ['food labelling law', 'the rules requiring allergens to be declared']
      ],
      truths: [
        'Ingredients are listed in descending order by weight.',
        'Comparing two products fairly means comparing per 100 g figures.',
        'A serving size on a label may be smaller than what people actually eat.',
        'Energy needs vary with age, size and activity.'
      ],
      myths: [
        'Ingredients are listed alphabetically.',
        'The reference intake is the correct target for every person.',
        'A serving size on the label is what a typical person eats.',
        'All processed food is unhealthy by definition.'
      ]
    },
    {
      name: 'Food Safety and Preparation', from: 'Grade 5', to: 'College',
      facts: [
        ['cross-contamination', 'transferring bacteria from one food to another'],
        ['danger zone', 'the temperature range where bacteria multiply fastest'],
        ['core temperature', 'the temperature at the centre of cooked food'],
        ['use-by date', 'the date after which food is unsafe to eat'],
        ['best-before date', 'the date after which quality declines'],
        ['chilling', 'keeping food cold to slow bacterial growth'],
        ['defrosting', 'thawing frozen food safely before cooking'],
        ['salmonella', 'a bacterium associated with poultry and eggs'],
        ['listeria', 'a bacterium that can grow at refrigeration temperatures'],
        ['personal hygiene', 'hand washing and clean clothing when handling food'],
        ['allergen', 'a food that can cause a severe reaction'],
        ['food poisoning', 'illness caused by contaminated food'],
        ['reheating', 'heating cooked food thoroughly before eating again'],
        ['separate boards', 'using different surfaces for raw and ready-to-eat food']
      ],
      truths: [
        'Use-by dates concern safety; best-before dates concern quality.',
        'Bacteria multiply fastest between about 5 °C and 63 °C.',
        'Raw and ready-to-eat foods should be kept and prepared separately.',
        'Reheated food should be piping hot all the way through.'
      ],
      myths: [
        'Best-before and use-by dates mean the same thing.',
        'Freezing food kills all bacteria present.',
        'Food that smells fine is always safe to eat.',
        'Washing raw chicken makes it safer to cook.'
      ]
    },
    {
      name: 'Diet, Health and Wellbeing', from: 'Grade 6', to: 'College',
      facts: [
        ['deficiency', 'a shortage of a nutrient causing health problems'],
        ['anaemia', 'the condition caused by too little iron'],
        ['obesity', 'excess body fat linked to long-term health risk'],
        ['type 2 diabetes', 'a condition in which the body cannot control blood glucose'],
        ['cholesterol', 'a fatty substance carried in the blood'],
        ['sodium', 'the mineral in salt, linked to blood pressure'],
        ['vegetarian diet', 'a diet without meat or fish'],
        ['vegan diet', 'a diet without any animal products'],
        ['food intolerance', 'difficulty digesting a food, without an immune reaction'],
        ['food allergy', 'an immune reaction to a food, sometimes severe'],
        ['coeliac disease', 'an autoimmune reaction to gluten'],
        ['eating pattern', 'the timing and regularity of meals'],
        ['nutrient density', 'nutrients supplied relative to energy provided'],
        ['sustainability', 'the environmental cost of what we eat']
      ],
      truths: [
        'A food intolerance and a food allergy involve different mechanisms.',
        'Vegan diets need a reliable source of vitamin B12.',
        'Too much salt is linked to raised blood pressure.',
        'Nutrient density matters as much as total energy.'
      ],
      myths: [
        'A food intolerance is a mild form of a food allergy.',
        'A vegetarian diet automatically lacks protein.',
        'Coeliac disease is a preference rather than a medical condition.',
        'Skipping meals is a reliable way to improve health.'
      ]
    }
  ],

  /* ================================= ANATOMY ================================= */
  anatomy: [
    {
      name: 'Skeleton and Muscles', from: 'Grade 6', to: 'College',
      figures: ['respiratory'],
      facts: [
        ['skeleton', 'the framework of bones supporting the body'],
        ['femur', 'the thigh bone, the longest in the body'],
        ['humerus', 'the upper arm bone'],
        ['cranium', 'the part of the skull enclosing the brain'],
        ['vertebra', 'one of the bones of the spine'],
        ['joint', 'the place where two bones meet'],
        ['hinge joint', 'a joint allowing movement in one plane, like the elbow'],
        ['ball and socket joint', 'a joint allowing movement in many directions'],
        ['ligament', 'tissue joining bone to bone'],
        ['tendon', 'tissue joining muscle to bone'],
        ['cartilage', 'smooth tissue cushioning the ends of bones'],
        ['antagonistic pair', 'two muscles working against each other'],
        ['biceps', 'the muscle that flexes the elbow'],
        ['triceps', 'the muscle that extends the elbow']
      ],
      truths: [
        'Tendons attach muscle to bone; ligaments attach bone to bone.',
        'Muscles work in antagonistic pairs because they can only pull.',
        'The femur is the longest bone in the human body.',
        'Cartilage reduces friction where bones meet.'
      ],
      myths: [
        'Ligaments attach muscle to bone.',
        'A muscle can both push and pull a bone.',
        'The spine is a single solid bone.',
        'The elbow is a ball and socket joint.'
      ]
    },
    {
      name: 'Heart, Lungs and Circulation', from: 'Grade 6', to: 'College',
      figures: ['heart', 'respiratory'],
      facts: [
        ['heart', 'the four-chambered muscular pump'],
        ['lungs', 'the organs where gas exchange takes place'],
        ['alveolus', 'the tiny air sac where oxygen crosses into the blood'],
        ['trachea', 'the windpipe carrying air to the lungs'],
        ['bronchus', 'one of the two tubes entering the lungs'],
        ['diaphragm', 'the muscle beneath the lungs that drives breathing'],
        ['artery', 'a vessel carrying blood away from the heart'],
        ['vein', 'a vessel carrying blood back to the heart'],
        ['capillary', 'the thin vessel where exchange takes place'],
        ['pulse', 'the wave felt as blood is pumped through an artery'],
        ['blood pressure', 'the force of blood against the vessel walls'],
        ['oxygenated blood', 'blood carrying a full load of oxygen'],
        ['gas exchange', 'the swap of oxygen for carbon dioxide'],
        ['cardiac output', 'the volume of blood pumped each minute']
      ],
      truths: [
        'Alveoli give the lungs an enormous surface area for gas exchange.',
        'The diaphragm contracts and flattens to draw air in.',
        'Arteries have thick walls because they carry blood at high pressure.',
        'The pulse is felt in arteries, not veins.'
      ],
      myths: [
        'The lungs actively pull air in by expanding on their own.',
        'The pulse can be felt equally well in a vein.',
        'Gas exchange happens in the trachea.',
        'The heart has two chambers.'
      ]
    },
    {
      name: 'The Nervous System', from: 'Grade 7', to: 'College',
      figures: ['neuron'],
      facts: [
        ['brain', 'the organ coordinating the whole nervous system'],
        ['spinal cord', 'the bundle of nerves running through the spine'],
        ['neuron', 'the cell that carries nerve impulses'],
        ['cerebrum', 'the largest part of the brain, seat of thought'],
        ['cerebellum', 'the region coordinating balance and fine movement'],
        ['medulla', 'the region controlling breathing and heart rate'],
        ['reflex', 'a rapid automatic response'],
        ['sensory neuron', 'a neuron carrying signals towards the CNS'],
        ['motor neuron', 'a neuron carrying signals to muscles'],
        ['synapse', 'the junction between two neurons'],
        ['neurotransmitter', 'the chemical carrying a signal across a synapse'],
        ['grey matter', 'the tissue containing neuron cell bodies'],
        ['white matter', 'the tissue of insulated connecting fibres'],
        ['nerve', 'a bundle of neuron fibres']
      ],
      truths: [
        'Reflexes are processed in the spinal cord, before the brain is involved.',
        'Neurotransmitters carry the signal chemically across a synapse.',
        'The cerebellum coordinates balance and fine movement.',
        'The medulla controls processes you never think about, such as breathing.'
      ],
      myths: [
        'Every response is decided consciously by the brain.',
        'Signals jump electrically straight across a synapse.',
        'The cerebellum is where language and reasoning happen.',
        'Nerves and neurons are two words for the same structure.'
      ]
    },
    {
      name: 'Digestion and Excretion', from: 'Grade 6', to: 'College',
      figures: ['digestive'],
      facts: [
        ['stomach', 'the organ where acid and enzymes begin protein digestion'],
        ['small intestine', 'the organ where most absorption happens'],
        ['large intestine', 'the organ absorbing water from what remains'],
        ['liver', 'the organ producing bile and processing nutrients'],
        ['pancreas', 'the organ releasing digestive enzymes and insulin'],
        ['kidney', 'the organ filtering waste from the blood'],
        ['nephron', 'the filtering unit of the kidney'],
        ['urea', 'the waste product made from excess amino acids'],
        ['bladder', 'the organ storing urine'],
        ['enzyme', 'the protein that speeds up digestion'],
        ['villi', 'the folds increasing absorptive surface area'],
        ['bile', 'the fluid that emulsifies fats'],
        ['peristalsis', 'the muscular wave moving food along'],
        ['excretion', 'the removal of waste made by the body']
      ],
      truths: [
        'The kidneys filter the blood and produce urine.',
        'Urea is made in the liver from excess amino acids.',
        'Villi increase the surface area available for absorption.',
        'Excretion removes waste the body has made; egestion removes undigested food.'
      ],
      myths: [
        'The kidneys produce bile.',
        'Excretion and egestion mean the same thing.',
        'Most absorption happens in the large intestine.',
        'Urea is produced in the kidneys.'
      ]
    },
    {
      name: 'Senses and Skin', from: 'Grade 6', to: 'Grade 12',
      facts: [
        ['retina', 'the light-sensitive layer at the back of the eye'],
        ['cornea', 'the transparent front layer that focuses light'],
        ['lens', 'the structure that fine-focuses light on the retina'],
        ['pupil', 'the opening that lets light into the eye'],
        ['iris', 'the coloured muscle controlling pupil size'],
        ['optic nerve', 'the nerve carrying signals from eye to brain'],
        ['cochlea', 'the spiral structure converting sound to nerve signals'],
        ['eardrum', 'the membrane that vibrates when sound arrives'],
        ['ossicles', 'the three small bones amplifying vibration'],
        ['epidermis', 'the outer layer of the skin'],
        ['dermis', 'the layer beneath, holding nerves and glands'],
        ['sweat gland', 'the structure releasing sweat to cool the body'],
        ['receptor', 'a cell that detects a particular stimulus'],
        ['vasodilation', 'the widening of skin vessels to lose heat']
      ],
      truths: [
        'The iris controls how much light enters through the pupil.',
        'The cochlea converts vibrations into nerve impulses.',
        'Sweating cools the body as the water evaporates.',
        'The skin is the body’s largest organ.'
      ],
      myths: [
        'The pupil is a solid black structure in the eye.',
        'The eardrum converts sound into nerve signals.',
        'Sweat cools the body simply by being cold.',
        'The skin has a single uniform layer.'
      ]
    },
    {
      name: 'Systems of the Body', from: 'Grade 6', to: 'College',
      figures: ['heart', 'digestive', 'respiratory'],
      facts: [
        ['organ', 'a structure of several tissues with a shared function'],
        ['tissue', 'a group of similar cells working together'],
        ['organ system', 'a set of organs working towards one function'],
        ['circulatory system', 'the heart and blood vessels'],
        ['respiratory system', 'the airways and lungs'],
        ['digestive system', 'the organs that break down and absorb food'],
        ['nervous system', 'the brain, spinal cord and nerves'],
        ['endocrine system', 'the glands releasing hormones'],
        ['immune system', 'the defences against infection'],
        ['skeletal system', 'the bones and joints'],
        ['muscular system', 'the muscles that move the body'],
        ['excretory system', 'the kidneys and associated organs'],
        ['homeostasis', 'keeping internal conditions steady'],
        ['hierarchy of organisation', 'cells, tissues, organs, systems, organism']
      ],
      truths: [
        'The order of organisation is cell, tissue, organ, organ system, organism.',
        'Organ systems depend on each other rather than working in isolation.',
        'Homeostasis involves several systems working together.',
        'The pancreas belongs to both the digestive and endocrine systems.'
      ],
      myths: [
        'Organs are made of a single type of cell.',
        'Each organ system works completely independently.',
        'A tissue is larger than an organ.',
        'Homeostasis is controlled by the nervous system alone.'
      ]
    }
  ],

  /* ================================= FITNESS ================================= */
  fitness: [
    {
      name: 'Components of Fitness', from: 'Grade 5', to: 'College',
      facts: [
        ['cardiovascular endurance', 'the ability to keep going with the heart and lungs supplying oxygen'],
        ['muscular strength', 'the greatest force a muscle can exert'],
        ['muscular endurance', 'the ability to repeat contractions without tiring'],
        ['flexibility', 'the range of movement at a joint'],
        ['body composition', 'the proportion of fat to lean tissue'],
        ['agility', 'the ability to change direction quickly'],
        ['balance', 'keeping the centre of mass over the base of support'],
        ['coordination', 'using two or more body parts smoothly together'],
        ['reaction time', 'the delay between a stimulus and a response'],
        ['power', 'strength applied quickly'],
        ['speed', 'how fast a distance can be covered'],
        ['aerobic', 'exercise using oxygen to release energy'],
        ['anaerobic', 'intense exercise outrunning the oxygen supply'],
        ['recovery', 'the time the body needs to restore itself']
      ],
      truths: [
        'Power combines strength and speed.',
        'Aerobic exercise uses oxygen; anaerobic exercise outpaces the oxygen supply.',
        'Flexibility is specific to each joint.',
        'Recovery is part of training, not time away from it.'
      ],
      myths: [
        'Strength and power mean the same thing.',
        'Being flexible in one joint means being flexible everywhere.',
        'Anaerobic exercise uses more oxygen than aerobic exercise.',
        'Rest days waste training time.'
      ]
    },
    {
      name: 'Training Principles', from: 'Grade 6', to: 'College',
      facts: [
        ['overload', 'training beyond what the body is used to'],
        ['progression', 'increasing demand gradually over time'],
        ['specificity', 'training that matches the demands of the activity'],
        ['reversibility', 'losing adaptations when training stops'],
        ['FITT', 'frequency, intensity, time and type'],
        ['frequency', 'how often training takes place'],
        ['intensity', 'how hard the training is'],
        ['duration', 'how long a session lasts'],
        ['interval training', 'alternating work with recovery periods'],
        ['continuous training', 'steady exercise held for a long period'],
        ['circuit training', 'moving between stations exercising different areas'],
        ['warm-up', 'preparation that raises heart rate and mobilises joints'],
        ['cool-down', 'gradual reduction of activity after exercise'],
        ['overtraining', 'training beyond the body’s capacity to recover']
      ],
      truths: [
        'Progressive overload is what causes the body to adapt.',
        'Adaptations are lost if training stops — the reversibility principle.',
        'Training should be specific to the demands of the sport.',
        'A warm-up raises muscle temperature and reduces injury risk.'
      ],
      myths: [
        'Training harder every session always produces faster progress.',
        'Fitness gains last indefinitely once achieved.',
        'Any training improves any sport equally.',
        'Stretching cold muscles is the best way to warm up.'
      ]
    },
    {
      name: 'Health, Injury and Recovery', from: 'Grade 6', to: 'College',
      facts: [
        ['sprain', 'an injury to a ligament'],
        ['strain', 'an injury to a muscle or tendon'],
        ['RICE', 'rest, ice, compression and elevation'],
        ['fracture', 'a break in a bone'],
        ['concussion', 'a brain injury caused by a blow to the head'],
        ['dehydration', 'losing more fluid than is replaced'],
        ['DOMS', 'delayed onset muscle soreness after unfamiliar exercise'],
        ['rest day', 'a planned day without training'],
        ['sleep', 'the period in which most physical recovery happens'],
        ['nutrition timing', 'eating to support training and recovery'],
        ['protective equipment', 'gear reducing injury risk in a sport'],
        ['technique', 'correct movement that lowers injury risk'],
        ['rehabilitation', 'structured recovery after an injury'],
        ['pain', 'a signal that should not simply be trained through']
      ],
      truths: [
        'A sprain injures a ligament and a strain injures a muscle or tendon.',
        'Concussion needs assessment and rest, not a return to play.',
        'Most physical recovery and adaptation happens during sleep.',
        'Delayed soreness after new exercise is normal and not a sign of damage.'
      ],
      myths: [
        'A sprain and a strain are the same injury.',
        'Playing on after a head knock is fine if you feel able.',
        'Muscle soreness means an injury has occurred.',
        'Pain during exercise should always be pushed through.'
      ]
    },
    {
      name: 'Sport, Skill and Participation', from: 'Grade 5', to: 'College',
      facts: [
        ['skill', 'a learned ability performed consistently'],
        ['technique', 'the way a movement is performed'],
        ['tactic', 'a plan for outwitting an opponent'],
        ['feedback', 'information about performance used to improve'],
        ['intrinsic motivation', 'doing something for its own satisfaction'],
        ['extrinsic motivation', 'doing something for an external reward'],
        ['fair play', 'competing within the rules and spirit of a sport'],
        ['sportsmanship', 'respect for opponents, officials and rules'],
        ['barrier to participation', 'something preventing someone taking part'],
        ['inclusion', 'designing activity so everyone can join in'],
        ['official', 'the person applying the rules during a game'],
        ['open skill', 'a skill performed in a changing environment'],
        ['closed skill', 'a skill performed in a stable environment'],
        ['practice type', 'whole, part, massed or distributed practice']
      ],
      truths: [
        'An open skill is performed in an unpredictable environment.',
        'Feedback is what turns practice into improvement.',
        'Intrinsic motivation tends to sustain participation for longer.',
        'Barriers to participation are often practical rather than personal.'
      ],
      myths: [
        'A closed skill is one performed with the eyes closed.',
        'Practice alone improves performance without feedback.',
        'Extrinsic rewards are the strongest long-term motivator.',
        'Everyone faces the same barriers to taking part in sport.'
      ]
    }
  ]
};
