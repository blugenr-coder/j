/* Depth for the topics that had the fewest worksheets.

   Worksheet count per topic is a direct function of how many units a topic
   has, so the thinnest topics were the ones with three or four units: computer
   science beyond "what is a loop", the social sciences, the arts, and the
   practical subjects. Each unit here is a scheme-of-work fortnight in a topic
   that previously had a term's worth in total. */

export const WIDER_UNITS = {
  /* ============================= computer science ============================= */
  programming: [
    {
      name: 'Variables, Types and Control Flow', from: 'Grade 6', to: 'College',
      facts: [
        ['a variable', 'a named place in memory holding a value that can change'],
        ['a constant', 'a named value that must not change once set'],
        ['an integer', 'a whole-number data type'],
        ['a float', 'a data type for numbers with a fractional part'],
        ['a string', 'a data type holding text'],
        ['a boolean', 'a data type holding only true or false'],
        ['assignment', 'giving a variable a value, written with a single equals sign'],
        ['a comparison', 'a test such as == or <, which produces a boolean'],
        ['a conditional', 'a statement that runs code only when a condition is true'],
        ['an else branch', 'the code that runs when the condition is false'],
        ['a loop', 'a structure that repeats a block of code'],
        ['a for loop', 'a loop that repeats a known number of times'],
        ['a while loop', 'a loop that repeats until a condition stops being true'],
        ['an infinite loop', 'a loop whose condition never becomes false'],
        ['a function', 'a named, reusable block of code'],
        ['a parameter', 'a named input a function accepts'],
        ['an argument', 'the actual value passed to a function when it is called'],
        ['a return value', 'the value a function hands back to its caller'],
        ['scope', 'the region of a program where a name is visible'],
        ['casting', 'converting a value from one type to another'],
        ['concatenation', 'joining two strings end to end'],
        ['an off-by-one error', 'the bug where a loop runs one time too many or too few']
      ],
      truths: [
        'A single equals sign assigns; a double equals sign compares.',
        'A while loop may run zero times if its condition is false at the start.',
        'A function without a return statement still runs; it just gives nothing back.',
        'Adding the string "2" to the string "3" gives "23", not 5.',
        'A variable declared inside a function is usually not visible outside it.',
        'A for loop is the right choice when the number of repetitions is known in advance.'
      ],
      myths: [
        'A single equals sign tests whether two values are the same.',
        'A while loop always runs at least once.',
        'Adding "2" and "3" as strings gives 5.',
        'Every function must return a value.',
        'A variable created inside a loop is visible everywhere in the program.',
        'A for loop and a while loop can never do the same job.'
      ],
      sequences: [
        ['How a function call is handled', [
          'The caller evaluates each argument',
          'The arguments are bound to the function’s parameters',
          'The function body runs in its own scope',
          'A return statement produces a value and ends the function',
          'Control passes back to the line that made the call'
        ]]
      ],
      applications: [
        ['A program prints "23" when it should print 5. What went wrong?', 'concatenation'],
        ['A loop is meant to run ten times and runs eleven. What kind of bug is this?', 'an off-by-one error'],
        ['A value must be read as a number after coming from a text box. What is needed?', 'casting'],
        ['A repetition must continue until the user types "quit". Which loop suits?', 'a while loop'],
        ['A variable used inside a function is undefined outside it. Which idea explains this?', 'scope']
      ]
    },
    {
      name: 'Lists, Dictionaries and Files', from: 'Grade 8', to: 'College',
      facts: [
        ['a list', 'an ordered collection accessed by position'],
        ['an index', 'the position of an item in a list, counted from zero'],
        ['a element', 'one item stored in a collection'],
        ['appending', 'adding an item to the end of a list'],
        ['slicing', 'taking a section of a list or string'],
        ['a dictionary', 'a collection of key–value pairs'],
        ['a key', 'the name an item is stored under in a dictionary'],
        ['a value', 'the data stored against a key'],
        ['iteration', 'visiting each item of a collection in turn'],
        ['a nested list', 'a list whose items are themselves lists'],
        ['a tuple', 'an ordered collection that cannot be changed after creation'],
        ['a set', 'a collection with no duplicates and no fixed order'],
        ['a file handle', 'the object a program uses to read from or write to a file'],
        ['reading a file', 'loading data from storage into a program'],
        ['writing a file', 'saving data from a program into storage'],
        ['a CSV file', 'a plain text file with values separated by commas'],
        ['an index error', 'the error raised by asking for a position that does not exist'],
        ['a key error', 'the error raised by asking for a key that is not in a dictionary'],
        ['sorting', 'putting the items of a collection into order'],
        ['a comprehension', 'a compact expression that builds a collection from another']
      ],
      truths: [
        'List indexes start at zero, so the first item of a list of ten is at index 0.',
        'The last item of a list of length n is at index n − 1.',
        'A dictionary is looked up by key, not by position.',
        'A set removes duplicates automatically.',
        'A tuple cannot be changed after it is created.',
        'A file must be closed, or the data written may never reach the disk.'
      ],
      myths: [
        'The first item in a list is at index 1.',
        'A dictionary keeps its items in the order of their keys automatically.',
        'A list and a set behave identically.',
        'A tuple can be edited in place like a list.',
        'Reading a file twice gives the data twice without reopening it.',
        'The last item of a list of ten is at index 10.'
      ],
      applications: [
        ['A program asks for item 10 of a ten-item list and crashes. Which error is raised?', 'an index error'],
        ['Names are stored so each can be found by its identifier rather than its position. What structure is this?', 'a dictionary'],
        ['A collection must never contain the same value twice. What should be used?', 'a set'],
        ['Data is saved as lines of comma-separated values. What kind of file is it?', 'a CSV file'],
        ['A section of a list from index 2 to 5 is taken. What is this?', 'slicing']
      ]
    },
    {
      name: 'Debugging, Testing and Good Code', from: 'Grade 8', to: 'College',
      facts: [
        ['a syntax error', 'an error that stops a program running at all'],
        ['a runtime error', 'an error that stops a program partway through'],
        ['a logic error', 'an error where the program runs but gives the wrong answer'],
        ['debugging', 'finding and removing errors from a program'],
        ['a breakpoint', 'a marked line where a debugger pauses execution'],
        ['tracing', 'following the values of variables step by step'],
        ['a test case', 'an input with its expected output'],
        ['normal data', 'test data inside the range the program expects'],
        ['boundary data', 'test data at the very edge of the accepted range'],
        ['erroneous data', 'test data the program should reject'],
        ['a unit test', 'an automated test of one function'],
        ['a stack trace', 'the list of calls that led to an error'],
        ['refactoring', 'improving the structure of code without changing what it does'],
        ['a comment', 'a note in the source code that the computer ignores'],
        ['a meaningful identifier', 'a name that says what a variable or function is for'],
        ['indentation', 'the leading spaces that show which block a line belongs to'],
        ['decomposition', 'breaking a problem into smaller sub-problems'],
        ['abstraction', 'hiding detail behind a simpler interface'],
        ['a rubber duck', 'the practice of explaining code aloud to find the fault'],
        ['maintainability', 'how easily code can be understood and changed later']
      ],
      truths: [
        'A logic error produces a wrong answer without any error message.',
        'Boundary data is where most off-by-one errors show up.',
        'Refactoring changes the structure of code, not its behaviour.',
        'A program with no error message can still be wrong.',
        'Good identifiers reduce the need for comments.',
        'A test that always passes tells you nothing.'
      ],
      myths: [
        'A program that runs without an error message is correct.',
        'Comments make code run more slowly.',
        'Testing with normal data is enough.',
        'Refactoring means adding new features.',
        'A syntax error can appear halfway through a run.',
        'Short variable names make a program faster.'
      ],
      applications: [
        ['A program runs and prints an answer that is wrong by one. What kind of error is it?', 'a logic error'],
        ['A program is tested with the largest allowed value and the one above it. What data is this?', 'boundary data'],
        ['A function is rewritten to be clearer without changing its output. What has happened?', 'refactoring'],
        ['Execution is paused at a chosen line to inspect variables. What was set?', 'a breakpoint'],
        ['A large problem is split into three smaller ones. Which technique is this?', 'decomposition']
      ]
    }
  ],

  algorithms: [
    {
      name: 'Searching and Sorting Algorithms', from: 'Grade 9', to: 'College',
      facts: [
        ['a linear search', 'checking each item in turn until the target is found'],
        ['a binary search', 'repeatedly halving a sorted list to find the target'],
        ['a bubble sort', 'repeatedly swapping adjacent items that are in the wrong order'],
        ['an insertion sort', 'building a sorted section by inserting each item into place'],
        ['a merge sort', 'splitting a list, sorting the halves and merging them'],
        ['a quicksort', 'partitioning around a pivot and sorting each side'],
        ['a pivot', 'the value a quicksort partitions around'],
        ['time complexity', 'how the running time grows with the size of the input'],
        ['big O notation', 'the notation describing how an algorithm scales'],
        ['O(n)', 'linear time: doubling the input roughly doubles the work'],
        ['O(log n)', 'logarithmic time: doubling the input adds one step'],
        ['O(n²)', 'quadratic time: doubling the input quadruples the work'],
        ['O(n log n)', 'the complexity of the efficient comparison sorts'],
        ['the best case', 'the input on which an algorithm does the least work'],
        ['the worst case', 'the input on which an algorithm does the most work'],
        ['a pass', 'one complete sweep through the data'],
        ['a swap', 'exchanging the positions of two items'],
        ['divide and conquer', 'solving a problem by splitting it into smaller copies of itself'],
        ['a stable sort', 'a sort that keeps equal items in their original order'],
        ['space complexity', 'how much extra memory an algorithm needs']
      ],
      truths: [
        'A binary search only works on data that is already sorted.',
        'Binary search is O(log n); linear search is O(n).',
        'Bubble sort is O(n²) in the worst case, which is why it is not used on large data.',
        'Merge sort is O(n log n) but needs extra memory.',
        'Doubling the size of the input to an O(n²) algorithm roughly quadruples the work.',
        'An algorithm’s best case and worst case can be very different.'
      ],
      myths: [
        'Binary search works on any list.',
        'Bubble sort is faster than merge sort because it is simpler.',
        'Big O notation gives the exact running time in seconds.',
        'An O(n log n) algorithm is always faster than an O(n²) one, for every input.',
        'Merge sort uses no extra memory.',
        'Linear search is always slower than binary search.'
      ],
      sequences: [
        ['A binary search for a value', [
          'Check the middle item of the sorted list',
          'If it matches, stop',
          'If the target is smaller, discard the upper half',
          'If the target is larger, discard the lower half',
          'Repeat on the half that remains until found or nothing is left'
        ]],
        ['A merge sort', [
          'Split the list into two halves',
          'Split each half again, until every piece holds one item',
          'Merge pairs of pieces back together in order',
          'Keep merging larger and larger sorted runs',
          'Finish with one sorted list'
        ]]
      ],
      applications: [
        ['A phone book is searched by repeatedly opening it in the middle. Which algorithm is this?', 'a binary search'],
        ['An algorithm takes four times as long when the data doubles. What is its complexity?', 'O(n²)'],
        ['Sorting works by splitting the list, sorting the halves and combining them. Which strategy is this?', 'divide and conquer'],
        ['Equal items keep their original relative order after sorting. What kind of sort is it?', 'a stable sort'],
        ['A search checks every record one after another. Which algorithm is it?', 'a linear search']
      ]
    },
    {
      name: 'Computational Thinking and Problem Solving', from: 'Grade 7', to: 'College',
      facts: [
        ['decomposition', 'breaking a problem into smaller parts'],
        ['pattern recognition', 'spotting similarities between problems'],
        ['abstraction', 'removing detail that does not matter to the solution'],
        ['algorithmic thinking', 'setting out a solution as a sequence of clear steps'],
        ['an algorithm', 'a precise sequence of steps that solves a problem'],
        ['pseudocode', 'a plain-language description of an algorithm'],
        ['a flowchart', 'a diagram of an algorithm using shapes for each kind of step'],
        ['a trace table', 'the table recording how variables change as an algorithm runs'],
        ['input', 'the data an algorithm starts with'],
        ['output', 'the result an algorithm produces'],
        ['a precondition', 'something that must be true before an algorithm runs'],
        ['a terminating condition', 'the condition that makes an algorithm stop'],
        ['iteration', 'repeating a step or block'],
        ['selection', 'choosing between paths based on a condition'],
        ['sequence', 'carrying out steps one after another'],
        ['recursion', 'a solution that calls itself on a smaller version of the problem'],
        ['a base case', 'the smallest version of a recursive problem, solved directly'],
        ['efficiency', 'how well an algorithm uses time and memory'],
        ['a heuristic', 'a rule of thumb that finds a good answer quickly, not always the best'],
        ['brute force', 'trying every possibility until one works']
      ],
      truths: [
        'Every recursive solution needs a base case, or it never stops.',
        'Sequence, selection and iteration are enough to express any algorithm.',
        'Abstraction means leaving out detail, not simplifying the problem away.',
        'A flowchart and pseudocode can describe the same algorithm.',
        'A heuristic trades guaranteed correctness for speed.',
        'A trace table shows exactly where an algorithm goes wrong.'
      ],
      myths: [
        'Recursion is just another word for iteration.',
        'A recursive function does not need a stopping condition if it is written carefully.',
        'An algorithm must be written in a programming language to count as an algorithm.',
        'Brute force is always the wrong approach.',
        'Abstraction means making a problem easier by ignoring the hard parts.',
        'A flowchart is more precise than pseudocode by definition.'
      ],
      applications: [
        ['A function calls itself on a smaller input and stops at n = 1. What is n = 1?', 'a base case'],
        ['A timetable problem is split into rooms, teachers and times. Which technique is this?', 'decomposition'],
        ['A route planner uses a quick rule that is usually good enough. What is it using?', 'a heuristic'],
        ['Every combination of a four-digit code is tried in turn. What approach is this?', 'brute force'],
        ['Variables are written down line by line as an algorithm runs. What is being built?', 'a trace table']
      ]
    }
  ],

  data: [
    {
      name: 'Databases and Queries', from: 'Grade 9', to: 'College',
      facts: [
        ['a database', 'an organised collection of data that can be searched'],
        ['a table', 'a set of records with the same fields'],
        ['a record', 'one row of a table, holding data about one thing'],
        ['a field', 'one column of a table, holding one kind of value'],
        ['a primary key', 'the field whose value uniquely identifies each record'],
        ['a foreign key', 'a field pointing at the primary key of another table'],
        ['a relational database', 'a database of linked tables'],
        ['a flat file', 'a single table holding all the data, with repetition'],
        ['redundancy', 'the same data stored in more than one place'],
        ['an inconsistency', 'the disagreement that follows when redundant data is updated in one place only'],
        ['normalisation', 'organising tables to remove redundancy'],
        ['a query', 'a request for particular data from a database'],
        ['SQL', 'the language used to query relational databases'],
        ['SELECT', 'the SQL keyword choosing which fields to return'],
        ['WHERE', 'the SQL keyword filtering which records to return'],
        ['ORDER BY', 'the SQL keyword sorting the results'],
        ['a join', 'combining rows from two tables using a shared key'],
        ['a validation rule', 'a check that data is of a sensible form before it is stored'],
        ['a data type', 'the kind of value a field may hold'],
        ['an index', 'a structure that makes searching a field faster']
      ],
      truths: [
        'A primary key must be unique for every record.',
        'A foreign key links a record to a record in another table.',
        'Normalisation reduces redundancy and so reduces inconsistency.',
        'WHERE filters records; SELECT chooses fields.',
        'Validation checks that data is sensible, not that it is true.',
        'An index speeds up searching but takes extra storage.'
      ],
      myths: [
        'A primary key may repeat as long as the records differ.',
        'Validation guarantees the data entered is correct.',
        'SELECT filters which records come back.',
        'A flat file is a relational database with one table.',
        'Normalisation makes every query faster.',
        'A foreign key must have the same name as the primary key it points at.'
      ],
      applications: [
        ['A field guarantees no two records can be confused. What is it?', 'a primary key'],
        ['A customer address is stored in three tables and one copy is updated. What results?', 'an inconsistency'],
        ['Rows from Orders and Customers are combined on a shared id. What operation is this?', 'a join'],
        ['A query returns only records where the mark is above 60. Which keyword did it use?', 'WHERE'],
        ['A date field rejects the entry "banana". What has been applied?', 'a validation rule']
      ]
    },
    {
      name: 'Data Representation and Binary', from: 'Grade 8', to: 'College',
      facts: [
        ['a bit', 'a single binary digit, 0 or 1'],
        ['a byte', 'eight bits'],
        ['binary', 'the base-2 number system'],
        ['denary', 'the ordinary base-10 number system'],
        ['hexadecimal', 'the base-16 system used as shorthand for binary'],
        ['ASCII', 'the character set using seven or eight bits per character'],
        ['Unicode', 'the character set covering the world’s writing systems'],
        ['a character set', 'the agreed mapping between numbers and characters'],
        ['a pixel', 'one dot of a bitmap image'],
        ['colour depth', 'the number of bits used to store the colour of each pixel'],
        ['resolution', 'the number of pixels in an image'],
        ['metadata', 'data about the data, such as an image’s dimensions'],
        ['a sample', 'one measurement of a sound wave’s amplitude'],
        ['sample rate', 'how many samples are taken each second'],
        ['bit depth', 'how many bits record each sound sample'],
        ['compression', 'reducing the number of bits needed to store data'],
        ['lossless compression', 'compression from which the original can be restored exactly'],
        ['lossy compression', 'compression that discards data to save more space'],
        ['a kilobyte', '1000 bytes, or 1024 in the older convention'],
        ['an overflow error', 'the error when a result needs more bits than are available']
      ],
      truths: [
        'Eight bits make one byte, which can hold 256 different values.',
        'Doubling the colour depth of an image doubles its file size.',
        'Lossy compression cannot be reversed to give the original data back.',
        'Hexadecimal is used because one hex digit represents exactly four bits.',
        'Unicode was introduced because ASCII cannot represent most writing systems.',
        'Adding two 8-bit numbers can produce an overflow error.'
      ],
      myths: [
        'A byte is ten bits.',
        'Lossless compression always saves more space than lossy compression.',
        'A higher sample rate reduces the size of a sound file.',
        'Hexadecimal is used because computers work in base 16.',
        'ASCII can represent every character in every language.',
        'Increasing an image’s resolution does not change its file size.'
      ],
      applications: [
        ['A sound is recorded 44,100 times a second. What is that figure?', 'sample rate'],
        ['A photograph is saved smaller and some detail is permanently gone. Which compression was used?', 'lossy compression'],
        ['An 8-bit register cannot hold the result of 200 + 100. What error occurs?', 'an overflow error'],
        ['Each pixel is stored using 24 bits. What is 24?', 'colour depth'],
        ['A file records the camera model and the date a photo was taken. What is that?', 'metadata']
      ]
    }
  ],

  cyber: [
    {
      name: 'Threats, Attacks and Defences', from: 'Grade 8', to: 'College',
      facts: [
        ['malware', 'software written to damage or gain access to a system'],
        ['a virus', 'malware that attaches itself to a file and spreads when the file is run'],
        ['a worm', 'malware that spreads by itself across a network'],
        ['ransomware', 'malware that encrypts files and demands payment'],
        ['spyware', 'malware that records what a user does'],
        ['phishing', 'a message pretending to be from a trusted source, to obtain credentials'],
        ['social engineering', 'manipulating people rather than software to gain access'],
        ['a brute force attack', 'trying every possible password in turn'],
        ['a denial of service attack', 'flooding a system so it cannot serve real users'],
        ['SQL injection', 'an attack that inserts database commands into an input field'],
        ['a firewall', 'the barrier controlling traffic between networks'],
        ['encryption', 'scrambling data so only someone with the key can read it'],
        ['two-factor authentication', 'requiring a second proof of identity as well as a password'],
        ['a patch', 'an update fixing a known vulnerability'],
        ['a vulnerability', 'a weakness that an attack can exploit'],
        ['penetration testing', 'authorised testing that looks for weaknesses before attackers do'],
        ['a strong password', 'a long, unpredictable password not reused elsewhere'],
        ['access control', 'limiting what each user is allowed to do'],
        ['a backup', 'a separate copy of data kept for recovery'],
        ['input validation', 'checking data before it is used, which blocks injection attacks']
      ],
      truths: [
        'Phishing attacks people, not software, which is why technical defences alone do not stop them.',
        'A longer password resists brute force far better than a short complicated one.',
        'Two-factor authentication protects an account even if the password is stolen.',
        'Input validation is the defence against SQL injection.',
        'A backup kept on the same machine does not protect against ransomware.',
        'A worm spreads without anyone opening anything; a virus needs a file to be run.'
      ],
      myths: [
        'Antivirus software stops phishing.',
        'A short password with symbols is safer than a long simple passphrase.',
        'A firewall makes encryption unnecessary.',
        'Ransomware can always be undone by paying.',
        'A virus and a worm are the same thing.',
        'Two-factor authentication is only for banks.'
      ],
      applications: [
        ['An email claims to be from a bank and asks for a login. What kind of attack is this?', 'phishing'],
        ['An attacker types a database command into a login box. What attack is this?', 'SQL injection'],
        ['A site is flooded with traffic until real users cannot reach it. What has happened?', 'a denial of service attack'],
        ['A stolen password is not enough because a code is also required. What is in place?', 'two-factor authentication'],
        ['A known weakness is closed by an update. What was applied?', 'a patch']
      ]
    }
  ],

  /* ================================ psychology ================================ */
  psychology: [
    {
      name: 'Memory and Forgetting', from: 'Grade 10', to: 'College',
      facts: [
        ['sensory memory', 'the very brief store holding raw sensory information'],
        ['short-term memory', 'the limited store holding information for seconds'],
        ['long-term memory', 'the store holding information for hours to a lifetime'],
        ['encoding', 'converting information into a form memory can store'],
        ['storage', 'holding information over time'],
        ['retrieval', 'getting information back out of memory'],
        ['the multi-store model', 'the model of sensory, short-term and long-term stores in sequence'],
        ['working memory', 'the model of short-term memory as several active components'],
        ['rehearsal', 'repeating information to keep or transfer it'],
        ['elaborative rehearsal', 'linking new information to what is already known'],
        ['chunking', 'grouping items so more can be held at once'],
        ['capacity', 'how much a memory store can hold'],
        ['duration', 'how long a memory store holds information'],
        ['interference', 'forgetting caused by other memories competing'],
        ['retrieval failure', 'forgetting because the right cue is missing'],
        ['a cue', 'a prompt that helps information be recalled'],
        ['the spacing effect', 'the finding that spread-out study beats massed study'],
        ['the testing effect', 'the finding that retrieving information strengthens it more than re-reading'],
        ['episodic memory', 'memory for events you experienced'],
        ['semantic memory', 'memory for facts and meanings'],
        ['procedural memory', 'memory for how to do things'],
        ['reconstruction', 'the process by which recall rebuilds rather than replays an event']
      ],
      truths: [
        'Short-term memory holds around seven items, and chunking increases what counts as an item.',
        'Testing yourself strengthens memory more than re-reading the same material.',
        'Spreading study over several sessions beats the same total time in one session.',
        'Recall is reconstructive, so memories can change each time they are retrieved.',
        'Forgetting is often retrieval failure rather than loss of the memory itself.',
        'Elaborative rehearsal transfers information to long-term memory better than simple repetition.'
      ],
      myths: [
        'Memory works like a video recording that plays events back exactly.',
        'Re-reading notes is the most effective way to revise.',
        'Long-term memory has a known, limited capacity.',
        'Cramming the night before is as effective as spaced study.',
        'A forgotten memory has always been erased.',
        'People use only ten per cent of their brain.'
      ],
      applications: [
        ['A phone number is remembered as three groups rather than eleven digits. What was used?', 'chunking'],
        ['A student recalls more after self-quizzing than after re-reading. Which effect is this?', 'the testing effect'],
        ['A word is on the tip of the tongue until a first letter is given. What had failed?', 'retrieval failure'],
        ['Someone remembers riding a bicycle without being able to describe it. Which memory is this?', 'procedural memory'],
        ['Two witnesses give different accounts of the same event. Which property explains this?', 'reconstruction']
      ]
    },
    {
      name: 'Research Methods in Psychology', from: 'Grade 10', to: 'College',
      facts: [
        ['a hypothesis', 'a testable prediction'],
        ['a null hypothesis', 'the prediction that there is no effect'],
        ['an independent variable', 'the variable the researcher changes'],
        ['a dependent variable', 'the variable the researcher measures'],
        ['a control variable', 'a variable deliberately held constant'],
        ['a confounding variable', 'an uncontrolled variable that could explain the result'],
        ['random allocation', 'assigning participants to conditions by chance'],
        ['a control group', 'the group that does not receive the treatment'],
        ['a placebo', 'an inactive treatment used for comparison'],
        ['a double-blind study', 'a study where neither participant nor researcher knows the condition'],
        ['demand characteristics', 'cues that let participants guess the aim and change their behaviour'],
        ['observer bias', 'the distortion caused by a researcher seeing what they expect'],
        ['reliability', 'the consistency of a measure across occasions'],
        ['validity', 'whether a measure captures what it claims to'],
        ['a sample', 'the participants actually studied'],
        ['a representative sample', 'a sample that reflects the population it is drawn from'],
        ['informed consent', 'agreement to take part given with knowledge of what is involved'],
        ['debriefing', 'explaining the study to participants afterwards'],
        ['a correlation', 'a relationship in which two variables change together'],
        ['a laboratory experiment', 'a study in controlled conditions'],
        ['a field experiment', 'a study run in a natural setting'],
        ['a case study', 'a detailed study of one person or group']
      ],
      truths: [
        'A correlation cannot establish that one variable causes the other.',
        'Random allocation is what makes a comparison between groups fair.',
        'A study can be reliable without being valid.',
        'Double-blind designs control for both demand characteristics and observer bias.',
        'A large sample is not representative if it was chosen in a biased way.',
        'The null hypothesis is what a statistical test actually examines.'
      ],
      myths: [
        'A strong correlation shows that one variable causes the other.',
        'A reliable measure must be a valid one.',
        'A large enough sample is automatically representative.',
        'A laboratory experiment always has higher validity than a field experiment.',
        'Random sampling and random allocation mean the same thing.',
        'Debriefing is optional if participants were not harmed.'
      ],
      applications: [
        ['Neither the participant nor the researcher knows who got the real pill. What design is this?', 'a double-blind study'],
        ['Participants guess the aim of a study and behave differently. What has occurred?', 'demand characteristics'],
        ['Sleep and exam marks rise together, but nothing is manipulated. What has been found?', 'a correlation'],
        ['A test gives the same result on Monday and Friday. What property is this?', 'reliability'],
        ['Participants are told what the study involves before agreeing. What has been obtained?', 'informed consent']
      ]
    },
    {
      name: 'Learning, Conditioning and Behaviour', from: 'Grade 10', to: 'College',
      facts: [
        ['classical conditioning', 'learning by association between two stimuli'],
        ['an unconditioned stimulus', 'a stimulus that produces a response without learning'],
        ['a conditioned stimulus', 'a neutral stimulus that comes to produce a response'],
        ['a conditioned response', 'the learned reaction to a conditioned stimulus'],
        ['extinction', 'the fading of a conditioned response when the association stops'],
        ['operant conditioning', 'learning through the consequences of behaviour'],
        ['positive reinforcement', 'adding something desirable to make a behaviour more likely'],
        ['negative reinforcement', 'removing something unpleasant to make a behaviour more likely'],
        ['punishment', 'a consequence that makes a behaviour less likely'],
        ['a schedule of reinforcement', 'the pattern determining when reinforcement is given'],
        ['continuous reinforcement', 'reinforcing every occurrence of a behaviour'],
        ['partial reinforcement', 'reinforcing some occurrences, which resists extinction'],
        ['shaping', 'reinforcing successive approximations to a target behaviour'],
        ['social learning', 'learning by observing and imitating others'],
        ['a model', 'the person whose behaviour is observed and imitated'],
        ['vicarious reinforcement', 'learning from seeing someone else rewarded'],
        ['generalisation', 'responding to stimuli similar to the conditioned one'],
        ['discrimination', 'responding only to the specific conditioned stimulus'],
        ['spontaneous recovery', 'the reappearance of an extinguished response after a pause']
      ],
      truths: [
        'Negative reinforcement increases a behaviour; it is not punishment.',
        'Partial reinforcement produces behaviour that is harder to extinguish.',
        'Classical conditioning links two stimuli; operant conditioning links behaviour to consequences.',
        'Extinction weakens a response but does not always erase it, as spontaneous recovery shows.',
        'Social learning can occur without the learner being reinforced at all.',
        'Shaping builds a complex behaviour by reinforcing steps towards it.'
      ],
      myths: [
        'Negative reinforcement is another name for punishment.',
        'Rewarding every single time produces the most persistent behaviour.',
        'Classical and operant conditioning are the same process.',
        'An extinguished response can never return.',
        'Learning requires direct personal reinforcement.',
        'Punishment is the most reliable way to change behaviour.'
      ],
      applications: [
        ['A dog salivates at a bell that has been paired with food. What is the bell?', 'a conditioned stimulus'],
        ['An alarm stops when a seatbelt is fastened, so fastening increases. What is this?', 'negative reinforcement'],
        ['A gambler keeps playing because wins come unpredictably. Which schedule is this?', 'partial reinforcement'],
        ['A child copies a behaviour after seeing another child praised for it. What has occurred?', 'vicarious reinforcement'],
        ['A response reappears after a rest, having seemingly disappeared. What is this?', 'spontaneous recovery']
      ]
    }
  ],

  sociology: [
    {
      name: 'Socialisation, Culture and Identity', from: 'Grade 10', to: 'College',
      facts: [
        ['socialisation', 'the process of learning the norms and values of a society'],
        ['primary socialisation', 'the learning that happens in the family in early childhood'],
        ['secondary socialisation', 'the learning that happens through school, peers and media'],
        ['a norm', 'an expected way of behaving in a given situation'],
        ['a value', 'a belief about what is important or right'],
        ['culture', 'the shared way of life of a group'],
        ['a subculture', 'a group with values that differ from the wider culture'],
        ['identity', 'a person’s sense of who they are'],
        ['a role', 'the behaviour expected of someone in a given position'],
        ['role conflict', 'the strain of holding two roles with incompatible demands'],
        ['status', 'a position a person holds in society'],
        ['ascribed status', 'a status a person is born with'],
        ['achieved status', 'a status earned through action'],
        ['a sanction', 'a reward or punishment that enforces a norm'],
        ['social control', 'the ways a society keeps behaviour within its norms'],
        ['an agent of socialisation', 'a group or institution that teaches norms and values'],
        ['ethnocentrism', 'judging another culture by the standards of your own'],
        ['cultural relativism', 'understanding a culture on its own terms'],
        ['nature and nurture', 'the debate over how far behaviour is inherited or learned'],
        ['a stereotype', 'a fixed, oversimplified image of a group']
      ],
      truths: [
        'Norms vary between societies; values are broader and change more slowly.',
        'Primary socialisation happens in the family; secondary socialisation continues beyond it.',
        'Ascribed status is given at birth; achieved status is earned.',
        'Feral child cases are used as evidence for the importance of socialisation.',
        'Sanctions can be positive as well as negative.',
        'A subculture differs from the wider culture without necessarily opposing it.'
      ],
      myths: [
        'Norms and values are two words for the same thing.',
        'Socialisation is finished by the end of childhood.',
        'A sanction is always a punishment.',
        'Culture is the same as nationality.',
        'Achieved status is what you are born with.',
        'Every subculture is deviant.'
      ],
      applications: [
        ['A child learns table manners at home before starting school. What kind of socialisation is this?', 'primary socialisation'],
        ['A working parent cannot attend a meeting and a school play at the same time. What is this?', 'role conflict'],
        ['A society is judged by the standards of the observer’s own. What is this?', 'ethnocentrism'],
        ['Someone becomes a doctor after years of training. What kind of status is this?', 'achieved status'],
        ['A group is praised for good behaviour rather than punished. What was applied?', 'a sanction']
      ]
    },
    {
      name: 'Families, Households and Change', from: 'Grade 10', to: 'College',
      facts: [
        ['a nuclear family', 'a household of two parents and their children'],
        ['an extended family', 'a household including relatives beyond parents and children'],
        ['a reconstituted family', 'a family formed when partners with children from previous relationships join'],
        ['a lone-parent family', 'a household with one parent and their children'],
        ['a household', 'a group of people sharing a residence'],
        ['a family', 'a group connected by blood, marriage or adoption'],
        ['the domestic division of labour', 'how household tasks are shared'],
        ['a symmetrical family', 'a family in which roles are shared fairly equally'],
        ['segregated conjugal roles', 'a division in which partners have separate tasks and leisure'],
        ['joint conjugal roles', 'a division in which partners share tasks and leisure'],
        ['the dual burden', 'the load carried by someone doing paid work and most housework'],
        ['emotion work', 'the unpaid labour of managing a household’s feelings'],
        ['secularisation', 'the declining influence of religion on social life'],
        ['divorce rate', 'the number of divorces relative to the number of marriages'],
        ['cohabitation', 'living together as partners without marrying'],
        ['an ageing population', 'a population with a growing proportion of older people'],
        ['the beanpole family', 'a family with several generations but few members in each'],
        ['individualisation', 'the trend towards personal choice over traditional expectation'],
        ['a functionalist view', 'the view that the family performs necessary functions for society'],
        ['a feminist view', 'the view that family arrangements can reproduce inequality']
      ],
      truths: [
        'A household and a family are not the same thing.',
        'Divorce rates rose after divorce law was made less restrictive, which changes what the figures measure.',
        'The dual burden describes paid work plus the majority of domestic work.',
        'Cohabitation has increased alongside a fall in first marriages.',
        'An ageing population changes the shape of families as well as the demand on services.',
        'Family diversity has increased without the nuclear family disappearing.'
      ],
      myths: [
        'Every household is a family.',
        'A rising divorce rate proves that families are less happy than before.',
        'The nuclear family has disappeared.',
        'Sharing childcare means the domestic division of labour is equal.',
        'Cohabiting couples have the same legal position as married ones everywhere.',
        'An extended family always lives under one roof.'
      ],
      applications: [
        ['Two partners with children from earlier relationships form one home. What is this called?', 'a reconstituted family'],
        ['A parent works full time and still does most of the housework. What is this?', 'the dual burden'],
        ['A family has four living generations with two members each. What shape is this?', 'the beanpole family'],
        ['Three students share a flat and are counted together in the census. What are they?', 'a household'],
        ['Partners share tasks and leisure fairly equally. What kind of roles are these?', 'joint conjugal roles']
      ]
    }
  ],

  /* ================================ philosophy ================================ */
  philosophy: [
    {
      name: 'Logic, Argument and Fallacies', from: 'Grade 10', to: 'College',
      facts: [
        ['an argument', 'a set of premises offered in support of a conclusion'],
        ['a premise', 'a statement offered as a reason'],
        ['a conclusion', 'the statement an argument is trying to establish'],
        ['a valid argument', 'an argument whose conclusion follows from its premises'],
        ['a sound argument', 'a valid argument with true premises'],
        ['deduction', 'reasoning where true premises guarantee the conclusion'],
        ['induction', 'reasoning from particular cases to a general claim'],
        ['a counterexample', 'a case that shows a general claim is false'],
        ['a fallacy', 'a pattern of reasoning that seems convincing but is not'],
        ['ad hominem', 'attacking the person instead of the argument'],
        ['a straw man', 'misrepresenting an argument to make it easier to attack'],
        ['a false dilemma', 'presenting two options as if there were no others'],
        ['begging the question', 'assuming in the premises what the conclusion claims'],
        ['a slippery slope', 'claiming without support that one step leads to an extreme outcome'],
        ['appeal to authority', 'treating someone’s status as proof of a claim'],
        ['correlation and causation', 'the distinction between things happening together and one causing the other'],
        ['a necessary condition', 'something that must hold for a claim to be true'],
        ['a sufficient condition', 'something that guarantees a claim is true'],
        ['a syllogism', 'a two-premise deductive argument'],
        ['the burden of proof', 'the obligation on whoever makes a claim to support it']
      ],
      truths: [
        'A valid argument can have a false conclusion, if a premise is false.',
        'A sound argument is valid and has true premises, so its conclusion is true.',
        'One counterexample is enough to refute a universal claim.',
        'Attacking the person leaves their argument untouched.',
        'A necessary condition is not automatically a sufficient one.',
        'The burden of proof falls on whoever makes the claim.'
      ],
      myths: [
        'A valid argument must have a true conclusion.',
        'If an argument is persuasive it is sound.',
        'Being an expert makes a claim true.',
        'A necessary condition is the same as a sufficient one.',
        'Any argument with a false conclusion is invalid.',
        'The burden of proof falls on whoever disagrees.'
      ],
      applications: [
        ['Someone rejects a claim by pointing at the speaker’s job. Which fallacy is this?', 'ad hominem'],
        ['An opponent’s position is exaggerated and then knocked down. Which fallacy is this?', 'a straw man'],
        ['A single black swan refutes "all swans are white". What has been given?', 'a counterexample'],
        ['"You are either with us or against us." Which fallacy is this?', 'a false dilemma'],
        ['An argument’s premises already assume its conclusion. What has happened?', 'begging the question']
      ]
    },
    {
      name: 'Ethics: Theories and Dilemmas', from: 'Grade 10', to: 'College',
      facts: [
        ['ethics', 'the study of what makes actions right or wrong'],
        ['normative ethics', 'the branch asking how we ought to act'],
        ['utilitarianism', 'the view that the right act produces the greatest overall wellbeing'],
        ['consequentialism', 'the view that outcomes determine whether an act is right'],
        ['deontology', 'the view that some acts are right or wrong regardless of outcome'],
        ['a categorical imperative', 'a rule that holds without exception, in Kant’s ethics'],
        ['virtue ethics', 'the view that ethics is about character rather than rules or outcomes'],
        ['a moral dilemma', 'a situation where every option breaks some obligation'],
        ['relativism', 'the view that moral claims are true only relative to a culture'],
        ['absolutism', 'the view that some moral claims hold everywhere'],
        ['autonomy', 'a person’s right to decide for themselves'],
        ['beneficence', 'the duty to act for another’s benefit'],
        ['non-maleficence', 'the duty not to cause harm'],
        ['justice', 'the fair distribution of benefits and burdens'],
        ['the trolley problem', 'the thought experiment contrasting acting and allowing harm'],
        ['a thought experiment', 'an imagined case used to test a principle'],
        ['moral intuition', 'an immediate sense that something is right or wrong'],
        ['the is–ought gap', 'the problem of deriving what ought to be from what is'],
        ['applied ethics', 'the branch applying theory to real fields such as medicine'],
        ['informed consent', 'agreement given with adequate understanding']
      ],
      truths: [
        'Utilitarianism judges an act by its consequences; deontology does not.',
        'Virtue ethics asks what a good person would do rather than which rule applies.',
        'A moral dilemma is a case where no option avoids doing wrong.',
        'The is–ought gap is the claim that facts alone do not establish values.',
        'Relativism and absolutism are answers to whether morality varies between cultures.',
        'A thought experiment tests a principle without claiming the case is realistic.'
      ],
      myths: [
        'Utilitarianism and deontology are two names for the same theory.',
        'Ethics is only a matter of personal opinion, so argument is pointless.',
        'A thought experiment fails if the scenario is unrealistic.',
        'Virtue ethics is a set of rules about which actions are forbidden.',
        'Relativism means no one may ever criticise any practice.',
        'What is natural is therefore right.'
      ],
      applications: [
        ['An action is judged solely by how much wellbeing it produces. Which theory is this?', 'utilitarianism'],
        ['A rule is held to apply without exception whatever the outcome. Which idea is this?', 'a categorical imperative'],
        ['A doctor must not harm a patient even to help another. Which principle is this?', 'non-maleficence'],
        ['A case is invented to test whether acting and allowing differ morally. What is it?', 'a thought experiment'],
        ['Someone argues that because something happens naturally it must be right. Which gap is ignored?', 'the is–ought gap']
      ]
    }
  ],

  /* ================================ economics ================================ */
  economics: [
    {
      name: 'Markets, Prices and Elasticity', from: 'Grade 10', to: 'College',
      facts: [
        ['demand', 'the quantity buyers are willing to buy at each price'],
        ['supply', 'the quantity producers are willing to sell at each price'],
        ['equilibrium price', 'the price at which quantity demanded equals quantity supplied'],
        ['a surplus', 'the excess when supply exceeds demand at the current price'],
        ['a shortage', 'the gap when demand exceeds supply at the current price'],
        ['price elasticity of demand', 'how much quantity demanded responds to a price change'],
        ['elastic demand', 'demand that changes proportionally more than price'],
        ['inelastic demand', 'demand that changes proportionally less than price'],
        ['a substitute', 'a good that can be bought instead of another'],
        ['a complement', 'a good usually bought alongside another'],
        ['a normal good', 'a good demand for which rises as income rises'],
        ['an inferior good', 'a good demand for which falls as income rises'],
        ['opportunity cost', 'the value of the next best alternative given up'],
        ['scarcity', 'the condition of unlimited wants against limited resources'],
        ['a subsidy', 'a payment that lowers the cost of producing a good'],
        ['an indirect tax', 'a tax on spending, which shifts the supply curve'],
        ['a price ceiling', 'a legal maximum price'],
        ['a price floor', 'a legal minimum price'],
        ['market failure', 'the situation where a market allocates resources inefficiently'],
        ['an externality', 'a cost or benefit falling on someone outside the transaction']
      ],
      truths: [
        'A shortage puts upward pressure on price; a surplus puts downward pressure.',
        'Demand for a good with many substitutes tends to be elastic.',
        'Opportunity cost is what you gave up, not what you paid.',
        'A price ceiling set below equilibrium creates a shortage.',
        'An externality means the market price does not reflect the full cost.',
        'A change in price moves along a demand curve; a change in income shifts it.'
      ],
      myths: [
        'A price ceiling below equilibrium makes goods cheaper for everyone who wants them.',
        'Opportunity cost is the money you spent.',
        'Demand and quantity demanded mean the same thing.',
        'A surplus means the good is popular.',
        'All goods have elastic demand if the price rises enough.',
        'A tax on producers is always paid entirely by producers.'
      ],
      applications: [
        ['Rent is capped below the market rate and flats become hard to find. What has been created?', 'a shortage'],
        ['A student chooses study over a shift at work and gives up the wages. What is that?', 'opportunity cost'],
        ['A factory’s pollution imposes costs on nearby residents. What is this?', 'an externality'],
        ['A small price rise causes a large fall in sales. What kind of demand is this?', 'elastic demand'],
        ['Sales of a cheap brand fall as incomes rise. What kind of good is it?', 'an inferior good']
      ]
    },
    {
      name: 'The National Economy and Policy', from: 'Grade 11', to: 'College',
      facts: [
        ['gross domestic product', 'the total value of goods and services produced in a country'],
        ['economic growth', 'an increase in real output over time'],
        ['inflation', 'a sustained rise in the general price level'],
        ['deflation', 'a sustained fall in the general price level'],
        ['the consumer price index', 'the measure tracking the price of a basket of goods'],
        ['unemployment', 'the number of people able and willing to work but without a job'],
        ['the labour force', 'those in work plus those seeking it'],
        ['fiscal policy', 'the use of government spending and taxation to influence the economy'],
        ['monetary policy', 'the use of interest rates and money supply to influence the economy'],
        ['the central bank', 'the institution that sets monetary policy'],
        ['an interest rate', 'the cost of borrowing and the reward for saving'],
        ['a budget deficit', 'the shortfall when government spending exceeds revenue'],
        ['national debt', 'the total the government owes, accumulated over time'],
        ['a recession', 'a sustained fall in output, conventionally two quarters'],
        ['the business cycle', 'the pattern of expansion and contraction over time'],
        ['a balance of payments', 'the record of a country’s transactions with the rest of the world'],
        ['real terms', 'a value adjusted for inflation'],
        ['nominal terms', 'a value at the prices of the day'],
        ['a trade-off', 'a situation where improving one objective worsens another'],
        ['supply-side policy', 'policy aimed at raising the productive capacity of the economy']
      ],
      truths: [
        'Inflation means prices are rising, not that they are high.',
        'A budget deficit is a yearly flow; national debt is the accumulated stock.',
        'Real values are adjusted for inflation; nominal values are not.',
        'Raising interest rates tends to reduce borrowing and slow demand.',
        'Falling inflation still means prices are rising, only more slowly.',
        'Unemployment counts only those seeking work, so it can fall when people give up looking.'
      ],
      myths: [
        'Falling inflation means prices are falling.',
        'A budget deficit and the national debt are the same figure.',
        'A rise in nominal wages always means people are better off.',
        'Unemployment counts everyone without a job.',
        'Cutting interest rates always increases growth immediately.',
        'GDP measures how well off a country’s people are.'
      ],
      applications: [
        ['Inflation falls from 6% to 3% and shoppers complain prices are still rising. Why are both true?', 'inflation'],
        ['A government spends more than it raises in one year. What is this?', 'a budget deficit'],
        ['Wages rose 3% while prices rose 5%. What has happened in real terms?', 'real terms'],
        ['A central bank raises rates to slow spending. Which policy is this?', 'monetary policy'],
        ['Output falls for two consecutive quarters. What is this called?', 'a recession']
      ]
    }
  ],

  /* ================================ accounting ================================ */
  accounting: [
    {
      name: 'The Accounting Equation and Double Entry', from: 'Grade 10', to: 'College',
      facts: [
        ['an asset', 'something the business owns or is owed'],
        ['a liability', 'something the business owes'],
        ['equity', 'the owner’s stake: assets minus liabilities'],
        ['the accounting equation', 'assets equal liabilities plus equity'],
        ['double entry', 'the rule that every transaction is recorded twice'],
        ['a debit', 'the left-hand entry, increasing assets or expenses'],
        ['a credit', 'the right-hand entry, increasing liabilities, equity or income'],
        ['a ledger', 'the book of accounts where entries are recorded'],
        ['a trial balance', 'the list checking that total debits equal total credits'],
        ['revenue', 'income earned from trading'],
        ['an expense', 'a cost incurred in earning revenue'],
        ['profit', 'revenue minus expenses'],
        ['a current asset', 'an asset expected to be turned into cash within a year'],
        ['a non-current asset', 'an asset kept and used for more than a year'],
        ['depreciation', 'spreading the cost of a non-current asset over its useful life'],
        ['a creditor', 'someone the business owes money to'],
        ['a debtor', 'someone who owes the business money'],
        ['capital', 'the money the owner has put into the business'],
        ['drawings', 'money the owner takes out of the business'],
        ['the accruals concept', 'recording income and costs when earned or incurred, not when paid']
      ],
      truths: [
        'Assets always equal liabilities plus equity.',
        'Every transaction affects at least two accounts.',
        'A trial balance that balances can still contain errors.',
        'Depreciation spreads a cost; it is not a movement of cash.',
        'Drawings reduce equity, they are not an expense.',
        'Profit and cash are different: a profitable business can run out of cash.'
      ],
      myths: [
        'A trial balance that balances proves the accounts are correct.',
        'Profit and cash in the bank are the same thing.',
        'Depreciation means money leaving the business.',
        'Drawings are an expense of the business.',
        'A debit always means money going out.',
        'Equity is the amount of cash the business holds.'
      ],
      applications: [
        ['A business buys a van on credit. Which two totals change together?', 'the accounting equation'],
        ['A machine’s cost is spread over five years. What is being applied?', 'depreciation'],
        ['A customer has received goods but not yet paid. What is that customer?', 'a debtor'],
        ['The owner takes £500 out for personal use. What is recorded?', 'drawings'],
        ['A sale made in March is recorded in March although payment arrives in May. Which concept applies?', 'the accruals concept']
      ]
    },
    {
      name: 'Financial Statements and Ratios', from: 'Grade 11', to: 'College',
      facts: [
        ['an income statement', 'the statement showing revenue, costs and profit for a period'],
        ['a balance sheet', 'the statement showing assets, liabilities and equity at one date'],
        ['a cash flow statement', 'the statement showing cash in and out over a period'],
        ['gross profit', 'revenue minus the cost of sales'],
        ['operating profit', 'gross profit minus operating expenses'],
        ['net profit', 'profit after all costs including interest and tax'],
        ['the gross profit margin', 'gross profit as a percentage of revenue'],
        ['the net profit margin', 'net profit as a percentage of revenue'],
        ['return on capital employed', 'operating profit as a percentage of capital employed'],
        ['the current ratio', 'current assets divided by current liabilities'],
        ['the acid test ratio', 'the current ratio with inventory excluded'],
        ['liquidity', 'the ability to meet short-term obligations'],
        ['solvency', 'the ability to meet obligations in the long run'],
        ['inventory turnover', 'how quickly stock is sold and replaced'],
        ['a receivables period', 'the average time customers take to pay'],
        ['a payables period', 'the average time the business takes to pay suppliers'],
        ['gearing', 'the proportion of finance that comes from borrowing'],
        ['working capital', 'current assets minus current liabilities'],
        ['a stakeholder', 'anyone with an interest in the business’s performance'],
        ['comparability', 'the property that allows figures to be compared meaningfully']
      ],
      truths: [
        'A balance sheet describes one moment; an income statement covers a period.',
        'A business can be profitable and still fail through lack of cash.',
        'The acid test excludes inventory because stock cannot always be sold quickly.',
        'A high current ratio is not automatically good: it can mean idle assets.',
        'Ratios are only meaningful compared with something — a previous year or a similar business.',
        'High gearing raises returns when trading is good and risk when it is not.'
      ],
      myths: [
        'A balance sheet shows performance over the year.',
        'A profitable business cannot run out of cash.',
        'A higher current ratio is always better.',
        'A single year’s ratio tells you whether a business is doing well.',
        'Gross profit and net profit differ only by tax.',
        'Cash flow and profit are the same measurement.'
      ],
      applications: [
        ['Current assets are £80k and current liabilities £40k. Which ratio is 2:1?', 'the current ratio'],
        ['A firm is profitable but cannot pay its suppliers this month. What is the problem?', 'liquidity'],
        ['Stock is removed from the calculation to test short-term safety. Which ratio is this?', 'the acid test ratio'],
        ['Most of a company’s finance comes from loans. What is high?', 'gearing'],
        ['Revenue minus cost of sales is calculated first. What is produced?', 'gross profit']
      ]
    }
  ],

  /* ================================= the arts ================================= */
  'music-theory': [
    {
      name: 'Harmony, Chords and Cadences', from: 'Grade 7', to: 'College',
      facts: [
        ['a chord', 'three or more notes sounded together'],
        ['a triad', 'a three-note chord built in thirds'],
        ['a major triad', 'a triad with a major third and a perfect fifth'],
        ['a minor triad', 'a triad with a minor third and a perfect fifth'],
        ['an interval', 'the distance between two pitches'],
        ['the tonic', 'the home note and chord of a key'],
        ['the dominant', 'the fifth degree of the scale, and its chord'],
        ['the subdominant', 'the fourth degree of the scale, and its chord'],
        ['a cadence', 'a two-chord progression that closes a phrase'],
        ['a perfect cadence', 'the dominant to tonic progression, which sounds final'],
        ['a plagal cadence', 'the subdominant to tonic progression, the "amen" ending'],
        ['an imperfect cadence', 'a progression ending on the dominant, which sounds unfinished'],
        ['an interrupted cadence', 'a progression from the dominant to an unexpected chord'],
        ['an inversion', 'a chord with a note other than the root in the bass'],
        ['a key signature', 'the sharps or flats at the start of a stave'],
        ['a scale', 'an ordered sequence of pitches within an octave'],
        ['a modulation', 'a change of key within a piece'],
        ['a seventh chord', 'a triad with a fourth note a seventh above the root'],
        ['harmony', 'the combination of notes sounded together'],
        ['a progression', 'a sequence of chords']
      ],
      truths: [
        'A perfect cadence moves from the dominant to the tonic and sounds conclusive.',
        'A major and a minor triad differ in the third, not the fifth.',
        'An imperfect cadence ends on the dominant, so the phrase sounds unfinished.',
        'An inversion changes which note is in the bass, not which notes are in the chord.',
        'The key signature applies to every octave, not just the line it sits on.',
        'Modulation is a change of key, not a change of tempo.'
      ],
      myths: [
        'A perfect cadence is any pair of chords that sounds nice.',
        'A major and a minor triad differ in their fifth.',
        'An inversion adds a note to a chord.',
        'A key signature affects only the notes on the exact line it is written on.',
        'Modulation means getting louder.',
        'Harmony and melody are the same thing.'
      ],
      applications: [
        ['A phrase ends V–I and sounds finished. Which cadence is this?', 'a perfect cadence'],
        ['A hymn ends IV–I on "amen". Which cadence is this?', 'a plagal cadence'],
        ['A chord has its third in the bass rather than its root. What is this?', 'an inversion'],
        ['A piece begins in C major and settles into G major. What has happened?', 'a modulation'],
        ['Three notes a third apart are sounded together. What has been built?', 'a triad']
      ]
    }
  ],

  drama: [
    {
      name: 'Performance Skills and Stagecraft', from: 'Grade 6', to: 'Grade 12',
      facts: [
        ['blocking', 'the planned movement and positioning of actors'],
        ['upstage', 'the part of the stage furthest from the audience'],
        ['downstage', 'the part of the stage nearest the audience'],
        ['stage left', 'the actor’s left when facing the audience'],
        ['stage right', 'the actor’s right when facing the audience'],
        ['a proscenium stage', 'a stage viewed through a frame from one side'],
        ['theatre in the round', 'a stage with the audience on all sides'],
        ['a thrust stage', 'a stage extending into the audience on three sides'],
        ['projection', 'producing enough vocal power to be heard clearly'],
        ['articulation', 'shaping speech so every word is clear'],
        ['pace', 'the speed at which lines and action are delivered'],
        ['a pause', 'a deliberate silence used for effect'],
        ['subtext', 'the meaning underneath what is actually said'],
        ['an objective', 'what a character wants in a scene'],
        ['an obstacle', 'what stands between a character and their objective'],
        ['a tableau', 'a frozen picture made with bodies'],
        ['a cue', 'the signal for a line, entrance or technical effect'],
        ['a monologue', 'an extended speech by one character'],
        ['an aside', 'a remark to the audience the other characters do not hear'],
        ['a rehearsal', 'a working session to prepare a performance']
      ],
      truths: [
        'Stage left is the actor’s left, not the audience’s.',
        'Projection is about support and clarity, not volume alone.',
        'Subtext is what a character means rather than what they say.',
        'In theatre in the round the actors must keep moving so no section is blocked for long.',
        'An objective needs an obstacle, or a scene has no tension.',
        'A pause can carry more meaning than a line.'
      ],
      myths: [
        'Stage left means the audience’s left.',
        'Projection means shouting.',
        'Upstage means towards the audience.',
        'Subtext is anything the actor invents.',
        'Blocking is decided by the actors on the night.',
        'A monologue and a soliloquy are always the same thing.'
      ],
      applications: [
        ['An actor moves away from the audience during a scene. Which direction is this?', 'upstage'],
        ['A character says "fine" while meaning the opposite. What carries the meaning?', 'subtext'],
        ['The cast freezes into a still image at the end of a scene. What is this?', 'a tableau'],
        ['A line is spoken directly to the audience, unheard by others on stage. What is it?', 'an aside'],
        ['A character wants forgiveness but pride prevents them asking. What is the pride?', 'an obstacle']
      ]
    }
  ],

  /* ============================== life and work ============================== */
  careers: [
    {
      name: 'Applications, Interviews and Workplace Skills', from: 'Grade 9', to: 'College',
      facts: [
        ['a CV', 'a summary of education, experience and skills'],
        ['a covering letter', 'the letter explaining why you suit a particular role'],
        ['a personal statement', 'a short written case for your suitability'],
        ['a referee', 'someone who can confirm your record and character'],
        ['a job description', 'the document setting out a role’s duties'],
        ['a person specification', 'the document setting out the qualities a role requires'],
        ['a transferable skill', 'a skill useful across different jobs'],
        ['a competency question', 'an interview question asking for an example from experience'],
        ['the STAR method', 'answering with situation, task, action and result'],
        ['a probation period', 'the initial period during which employment is reviewed'],
        ['a contract of employment', 'the agreement setting out terms and conditions'],
        ['gross pay', 'pay before deductions'],
        ['net pay', 'pay after tax and other deductions'],
        ['a payslip', 'the statement showing pay and deductions'],
        ['professional conduct', 'behaviour that meets the standards of a workplace'],
        ['constructive feedback', 'comment aimed at improvement rather than judgement'],
        ['an apprenticeship', 'a paid role combining work with structured training'],
        ['continuing professional development', 'ongoing learning through a career'],
        ['networking', 'building professional contacts'],
        ['a portfolio', 'a collection of work shown as evidence of ability']
      ],
      truths: [
        'A person specification tells you what to evidence; a job description tells you what the job involves.',
        'Net pay is what actually reaches your account; gross pay is before deductions.',
        'The STAR method answers a competency question with a specific example and its result.',
        'Transferable skills are what makes a career change possible.',
        'A referee should be asked before being named.',
        'A covering letter should address the specific role, not describe your CV again.'
      ],
      myths: [
        'Gross pay is what you receive.',
        'A CV should be as long as possible to show everything you have done.',
        'A job description and a person specification are the same document.',
        'A competency question wants your opinion rather than an example.',
        'Once you have a contract, the terms cannot be seen until you start.',
        'Networking means asking strangers for jobs.'
      ],
      applications: [
        ['An interviewer asks for a time you resolved a disagreement. What kind of question is this?', 'a competency question'],
        ['A payslip shows £1,800 before deductions and £1,430 after. Which is the £1,430?', 'net pay'],
        ['A document lists the qualities and experience the employer requires. What is it?', 'a person specification'],
        ['A candidate answers with situation, task, action and result. Which method is this?', 'the STAR method'],
        ['Someone works four days and studies one, earning throughout. What is this?', 'an apprenticeship']
      ]
    }
  ],

  safety: [
    {
      name: 'First Aid and Emergency Response', from: 'Grade 7', to: 'College',
      facts: [
        ['DRABC', 'the primary survey: danger, response, airway, breathing, circulation'],
        ['the recovery position', 'the position for an unconscious casualty who is breathing'],
        ['CPR', 'chest compressions and rescue breaths for someone not breathing'],
        ['a defibrillator', 'the device that delivers a shock to restart an effective heartbeat'],
        ['the primary survey', 'the first rapid check for life-threatening problems'],
        ['a casualty', 'the person needing help'],
        ['direct pressure', 'the first treatment for severe bleeding'],
        ['shock', 'the dangerous fall in circulation after severe injury or blood loss'],
        ['a burn', 'an injury caused by heat, chemicals or electricity'],
        ['cooling a burn', 'running cool water over a burn for at least twenty minutes'],
        ['a fracture', 'a broken bone'],
        ['an open fracture', 'a fracture where the bone has broken the skin'],
        ['anaphylaxis', 'a severe, rapid allergic reaction'],
        ['an auto-injector', 'the device delivering adrenaline in anaphylaxis'],
        ['choking', 'an obstruction of the airway'],
        ['back blows', 'the first treatment for a choking adult who cannot cough'],
        ['a hazard', 'something with the potential to cause harm'],
        ['a risk assessment', 'the process of judging how likely and how serious a hazard is'],
        ['the emergency number', 'the number called for an ambulance'],
        ['a bystander', 'someone present who can help or call for help']
      ],
      truths: [
        'Check for danger to yourself before approaching a casualty.',
        'An unconscious casualty who is breathing normally goes into the recovery position.',
        'Severe bleeding is treated first with firm direct pressure.',
        'A burn should be cooled with running water for at least twenty minutes.',
        'Chest compressions alone are better than doing nothing if you cannot give breaths.',
        'Anaphylaxis needs adrenaline and an ambulance, not just an antihistamine.'
      ],
      myths: [
        'You should always move a casualty to a more comfortable place first.',
        'Butter or ice should be put on a burn.',
        'You should give someone with a suspected fracture something to eat and drink.',
        'A tourniquet is the first treatment for any bleeding.',
        'If someone is choking but can cough forcefully, you should slap their back immediately.',
        'You cannot help unless you are trained, so it is better to wait.'
      ],
      sequences: [
        ['The primary survey', [
          'Check for danger to yourself and others',
          'Check for a response from the casualty',
          'Open and check the airway',
          'Check for normal breathing',
          'Check for severe bleeding and treat it',
          'Call for emergency help'
        ]]
      ],
      applications: [
        ['A casualty is unconscious but breathing normally. What position should they be placed in?', 'the recovery position'],
        ['Someone spills boiling water on their arm. What is the treatment?', 'cooling a burn'],
        ['A person collapses after a bee sting with swelling and difficulty breathing. What is happening?', 'anaphylaxis'],
        ['Blood is flowing heavily from a wound. What is applied first?', 'direct pressure'],
        ['A frayed cable lies across a wet floor. What is it?', 'a hazard']
      ]
    }
  ],

  /* =============================== environment =============================== */
  climate: [
    {
      name: 'Climate Change: Causes and Evidence', from: 'Grade 8', to: 'College',
      figures: ['water-cycle', 'earth-layers'],
      facts: [
        ['the greenhouse effect', 'the natural warming caused by gases trapping outgoing radiation'],
        ['the enhanced greenhouse effect', 'the additional warming caused by human emissions'],
        ['a greenhouse gas', 'a gas that absorbs and re-emits infrared radiation'],
        ['carbon dioxide', 'the greenhouse gas released mainly by burning fossil fuels'],
        ['methane', 'a greenhouse gas from livestock, landfill and gas leaks'],
        ['a fossil fuel', 'coal, oil or gas, formed from ancient organisms'],
        ['a carbon sink', 'a store that absorbs more carbon than it releases'],
        ['deforestation', 'the removal of forest, which reduces carbon absorption'],
        ['an ice core', 'a cylinder of ice whose trapped air records past atmospheres'],
        ['a proxy record', 'an indirect record of past climate, such as tree rings'],
        ['a carbon footprint', 'the total greenhouse gas emissions caused by an activity'],
        ['mitigation', 'action to reduce emissions'],
        ['adaptation', 'action to cope with changes that are already happening'],
        ['a renewable resource', 'an energy source replaced as fast as it is used'],
        ['carbon neutrality', 'balancing emissions with removals'],
        ['ocean acidification', 'the fall in ocean pH as it absorbs carbon dioxide'],
        ['sea level rise', 'the rise caused by thermal expansion and melting land ice'],
        ['thermal expansion', 'the increase in volume of water as it warms'],
        ['a feedback loop', 'a process that amplifies or dampens a change'],
        ['albedo', 'the proportion of sunlight a surface reflects']
      ],
      truths: [
        'The greenhouse effect is natural; the problem is the enhanced effect from human emissions.',
        'Sea level rises from both melting land ice and thermal expansion of the water.',
        'Melting sea ice does not itself raise sea level, because it already displaces water.',
        'Ice cores record past atmospheric composition directly, in trapped bubbles.',
        'Losing bright ice lowers albedo, which absorbs more heat and melts more ice.',
        'Mitigation reduces emissions; adaptation deals with impacts already arriving.'
      ],
      myths: [
        'The greenhouse effect is entirely man-made.',
        'Melting sea ice is the main cause of sea level rise.',
        'The ozone hole causes climate change.',
        'Carbon dioxide is the only greenhouse gas that matters.',
        'A cold winter disproves warming.',
        'Adaptation and mitigation are two words for the same policy.'
      ],
      applications: [
        ['Ice melts, exposing dark ocean, which absorbs more heat and melts more ice. What is this?', 'a feedback loop'],
        ['A city builds flood defences for sea levels it expects. Which response is this?', 'adaptation'],
        ['Air bubbles from 100,000 years ago are analysed. What was drilled?', 'an ice core'],
        ['Water expands as it warms, raising the sea. What is this?', 'thermal expansion'],
        ['A forest absorbs more carbon than it releases. What is it?', 'a carbon sink']
      ]
    }
  ],

  /* ================================= media ================================= */
  media: [
    {
      name: 'News, Bias and Verification', from: 'Grade 8', to: 'College',
      facts: [
        ['a source', 'where a piece of information originally came from'],
        ['a primary source', 'a first-hand account or original record'],
        ['a secondary source', 'an account that reports on primary sources'],
        ['corroboration', 'confirming a claim through an independent second source'],
        ['bias', 'a consistent slant in how a story is selected or told'],
        ['a loaded word', 'a word chosen to carry a judgement'],
        ['framing', 'the choice of what to include and emphasise in a story'],
        ['agenda setting', 'influence over which issues the public thinks about'],
        ['gatekeeping', 'the decisions about what becomes news at all'],
        ['misinformation', 'false information spread without intent to deceive'],
        ['disinformation', 'false information spread deliberately'],
        ['a deepfake', 'synthetic audio or video made to look genuine'],
        ['clickbait', 'a headline written to attract clicks rather than inform'],
        ['a correction', 'a published acknowledgement of an error'],
        ['an echo chamber', 'an environment where you meet only views you already hold'],
        ['a filter bubble', 'the narrowing of what you see caused by personalisation'],
        ['reverse image search', 'checking where an image has appeared before'],
        ['a byline', 'the line naming who wrote a piece'],
        ['editorial independence', 'freedom of the newsroom from owners and advertisers'],
        ['a fact-check', 'a published assessment of whether a claim is accurate']
      ],
      truths: [
        'Misinformation is spread without intent to deceive; disinformation is deliberate.',
        'Corroboration means an independent source, not the same story republished.',
        'Framing changes the meaning of a story without any individual sentence being false.',
        'A reverse image search often shows a photograph is old or from elsewhere.',
        'A named byline and a published corrections policy are signals of accountability.',
        'Personalised feeds narrow what you see without you noticing.'
      ],
      myths: [
        'Misinformation and disinformation mean the same thing.',
        'If several websites carry a story it must be corroborated.',
        'A story with no false sentences cannot be biased.',
        'A photograph is proof that an event happened as described.',
        'A publication that never issues corrections is the most accurate.',
        'Search results are the same for everyone.'
      ],
      applications: [
        ['A dramatic photo turns out to be from a different country ten years ago. Which check found it?', 'reverse image search'],
        ['A false claim is shared by someone who believed it. What is it?', 'misinformation'],
        ['Two websites both republish the same agency wire copy. Is that corroboration?', 'corroboration'],
        ['A headline promises more than the article delivers. What is it?', 'clickbait'],
        ['A newsfeed shows only views the reader already agrees with. What has formed?', 'an echo chamber']
      ]
    }
  ]
};
