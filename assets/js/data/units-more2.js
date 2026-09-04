/* The last of the thin topics.

   Every topic in this file had fewer worksheets than any other in its subject,
   because it had three or four units where its neighbours had ten. Calculus,
   trigonometry and discrete maths get a second and third unit; study skills,
   marketing, robotics, web development and the practical subjects get the
   units a real course spends a term on. */

export const MORE2_UNITS = {
  calculus: [
    {
      name: 'Differentiation Techniques', from: 'Grade 11', to: 'College',
      facts: [
        ['the power rule', 'the rule that the derivative of xⁿ is nxⁿ⁻¹'],
        ['the chain rule', 'the rule for differentiating a function of a function'],
        ['the product rule', 'the rule for differentiating two functions multiplied'],
        ['the quotient rule', 'the rule for differentiating one function over another'],
        ['implicit differentiation', 'differentiating an equation not solved for y'],
        ['a derivative', 'the rate of change of a function'],
        ['notation dy/dx', 'the Leibniz way of writing a derivative'],
        ['notation f′(x)', 'the Lagrange way of writing a derivative'],
        ['a tangent line', 'the line touching a curve with the same gradient at that point'],
        ['a normal line', 'the line perpendicular to the tangent at a point'],
        ['a stationary point', 'a point where the derivative is zero'],
        ['the second derivative', 'the derivative of the derivative'],
        ['concavity', 'which way a curve bends'],
        ['a point of inflection', 'a point where concavity changes'],
        ['an optimisation problem', 'a problem asking for a maximum or minimum'],
        ['a related rate', 'a rate found from another rate through a shared variable'],
        ['a differentiable function', 'a function with a derivative at every point of interest'],
        ['a discontinuity', 'a point where a function is not continuous'],
        ['the gradient function', 'the derivative seen as a function in its own right']
      ],
      truths: [
        'The chain rule is needed whenever one function sits inside another.',
        'A function must be continuous at a point to be differentiable there.',
        'The second derivative tells you which way a curve bends, and so which kind of stationary point you have.',
        'The normal is perpendicular to the tangent, so their gradients multiply to −1.',
        'Optimisation problems are solved by setting the derivative to zero and checking the nature of the point.',
        'A point of inflection is where concavity changes, whether or not the gradient is zero there.'
      ],
      myths: [
        'The derivative of a product is the product of the derivatives.',
        'Every continuous function is differentiable.',
        'Setting the derivative to zero always gives a maximum.',
        'The chain rule is only needed for trigonometric functions.',
        'A point of inflection must be a stationary point.',
        'dy/dx is a fraction that can be split apart freely.'
      ],
      applications: [
        ['y = (3x + 1)⁵ is differentiated. Which rule is needed?', 'the chain rule'],
        ['A box of fixed surface area is to have maximum volume. What kind of problem is this?', 'an optimisation problem'],
        ['The gradient is zero and the second derivative is negative. What kind of point is it?', 'a stationary point'],
        ['A balloon’s radius grows and its volume is wanted. What is being found?', 'a related rate'],
        ['A line perpendicular to the tangent is required. What is it?', 'a normal line']
      ]
    },
    {
      name: 'Integration and Its Applications', from: 'Grade 12', to: 'College',
      facts: [
        ['integration', 'the reverse of differentiation'],
        ['an antiderivative', 'a function whose derivative is the one given'],
        ['the constant of integration', 'the +c that differentiation loses'],
        ['a definite integral', 'an integral between two limits, giving a number'],
        ['an indefinite integral', 'an integral with no limits, giving a family of functions'],
        ['the fundamental theorem of calculus', 'the theorem linking differentiation and integration'],
        ['the area under a curve', 'what a definite integral measures'],
        ['integration by substitution', 'the technique reversing the chain rule'],
        ['integration by parts', 'the technique reversing the product rule'],
        ['a limit of integration', 'one of the two values a definite integral runs between'],
        ['the trapezium rule', 'the numerical method estimating an area with trapezia'],
        ['a volume of revolution', 'the solid formed by rotating a curve about an axis'],
        ['a differential equation', 'an equation involving a derivative'],
        ['separating the variables', 'the technique for solving certain differential equations'],
        ['an initial condition', 'the extra information that fixes the constant of integration'],
        ['a signed area', 'an area counted as negative below the axis'],
        ['displacement', 'the integral of velocity with respect to time']
      ],
      truths: [
        'An indefinite integral needs +c because differentiation destroys constants.',
        'A definite integral between limits gives a number, not a function.',
        'Area below the x-axis counts as negative in a definite integral.',
        'Integration by substitution reverses the chain rule.',
        'An initial condition is what fixes the constant of integration.',
        'The trapezium rule estimates an area and does not give it exactly.'
      ],
      myths: [
        'The constant of integration can be left out if you are careful.',
        'A definite integral always gives the total area, regardless of sign.',
        'Integration by parts reverses the chain rule.',
        'The trapezium rule gives the exact area under any curve.',
        'A differential equation has a single answer without extra information.',
        'Integrating a velocity gives acceleration.'
      ],
      applications: [
        ['The area between a curve and the axis from 0 to 3 is required. What is used?', 'a definite integral'],
        ['A substitution u = 2x + 1 simplifies an integral. Which technique is this?', 'integration by substitution'],
        ['A curve is rotated about the x-axis and the solid’s size is wanted. What is this?', 'a volume of revolution'],
        ['A general solution has an unknown constant until one data point is given. What is that point?', 'an initial condition'],
        ['Velocity is integrated with respect to time. What is obtained?', 'displacement']
      ]
    }
  ],

  trigonometry: [
    {
      name: 'Trigonometric Identities and Equations', from: 'Grade 11', to: 'College',
      facts: [
        ['a trigonometric identity', 'an equation true for every value of the angle'],
        ['the Pythagorean identity', 'sin²θ + cos²θ = 1'],
        ['the tangent identity', 'tan θ = sin θ / cos θ'],
        ['a double angle formula', 'a formula for sin 2θ or cos 2θ'],
        ['an addition formula', 'a formula for sin(A + B) or cos(A + B)'],
        ['the reciprocal functions', 'cosec, sec and cot'],
        ['cosec θ', 'the reciprocal of sin θ'],
        ['sec θ', 'the reciprocal of cos θ'],
        ['cot θ', 'the reciprocal of tan θ'],
        ['a general solution', 'every angle satisfying an equation, not just one'],
        ['a principal value', 'the value a calculator returns for an inverse function'],
        ['the unit circle', 'the circle of radius one used to define the ratios for any angle'],
        ['a quadrant', 'one of the four regions of the coordinate plane'],
        ['the CAST diagram', 'the diagram showing which ratios are positive in each quadrant'],
        ['a radian', 'the angle unit in which a full turn is 2π'],
        ['an amplitude', 'half the distance between maximum and minimum of a wave'],
        ['a phase shift', 'a horizontal translation of a trigonometric graph'],
        ['a period', 'the interval after which a function repeats']
      ],
      truths: [
        'sin²θ + cos²θ = 1 holds for every angle.',
        'A calculator gives one solution; a trigonometric equation usually has infinitely many.',
        'The CAST diagram shows which ratio is positive in each quadrant.',
        'tan θ is undefined where cos θ is zero.',
        'Converting between degrees and radians is necessary before using most calculus results.',
        'A phase shift moves a graph sideways without changing its period.'
      ],
      myths: [
        'sin²θ means sin(θ²).',
        'A trigonometric equation has exactly the number of solutions the calculator gives.',
        'sec θ is the inverse function of cos θ.',
        'tan θ is defined for every angle.',
        'Radians and degrees can be mixed in the same calculation.',
        'A phase shift changes the amplitude of a wave.'
      ],
      applications: [
        ['sin θ = 0.5 has solutions at 30° and 150° and more beyond. What is wanted?', 'a general solution'],
        ['A calculator returns 30° for arcsin 0.5. What is that value?', 'a principal value'],
        ['Which quadrant has only tangent positive? Which diagram tells you?', 'the CAST diagram'],
        ['1/cos θ appears in a formula. What is that function?', 'sec θ'],
        ['A graph of y = sin(x − 30°) is shifted right. What has been applied?', 'a phase shift']
      ]
    }
  ],

  discrete: [
    {
      name: 'Number Theory and Proof', from: 'Grade 10', to: 'College',
      facts: [
        ['a proof', 'an argument establishing a statement beyond doubt'],
        ['a conjecture', 'a statement believed true but not yet proved'],
        ['a theorem', 'a statement that has been proved'],
        ['proof by exhaustion', 'checking every case when there are finitely many'],
        ['proof by counterexample', 'disproving a claim with a single case'],
        ['proof by contradiction', 'assuming the opposite and deriving an impossibility'],
        ['direct proof', 'reasoning from the assumptions straight to the conclusion'],
        ['proof by induction', 'proving a base case and that each case implies the next'],
        ['a base case', 'the first case in an inductive proof'],
        ['the inductive step', 'the argument that one case implies the next'],
        ['a prime number', 'a number with exactly two factors'],
        ['a composite number', 'a number with more than two factors'],
        ['the fundamental theorem of arithmetic', 'every integer above one has a unique prime factorisation'],
        ['a divisor', 'a number that divides another exactly'],
        ['modular arithmetic', 'arithmetic where numbers wrap around at a modulus'],
        ['a remainder', 'what is left after a division'],
        ['coprime', 'sharing no common factor other than one'],
        ['a rational number', 'a number expressible as one integer over another'],
        ['an irrational number', 'a number that is not'],
        ['a parity argument', 'an argument based on whether numbers are odd or even']
      ],
      truths: [
        'One counterexample disproves a universal claim; no number of examples proves one.',
        'Proof by induction needs both a base case and an inductive step.',
        'The proof that √2 is irrational is a proof by contradiction.',
        'Every integer above one has exactly one prime factorisation.',
        'Two numbers are coprime if their only common factor is one.',
        'Checking every case is a valid proof only when the cases are finite.'
      ],
      myths: [
        'Enough examples constitute a proof.',
        'Induction only needs the inductive step if the pattern is obvious.',
        'A counterexample only weakens a claim rather than disproving it.',
        'Every number has several different prime factorisations.',
        'A conjecture and a theorem are the same thing.',
        'Coprime numbers must both be prime.'
      ],
      applications: [
        ['A claim about all integers is refuted by n = 4. What kind of proof is this?', 'proof by counterexample'],
        ['√2 is assumed rational and an impossibility follows. Which method is this?', 'proof by contradiction'],
        ['A statement is proved for n = 1 and then for n + 1 given n. Which method?', 'proof by induction'],
        ['Clock arithmetic wraps around at 12. What kind of arithmetic is this?', 'modular arithmetic'],
        ['8 and 15 share no factor but one. What are they?', 'coprime']
      ]
    }
  ],

  notes: [
    {
      name: 'Note-Taking Systems That Work', from: 'Grade 7', to: 'College',
      facts: [
        ['the Cornell system', 'notes split into cues, notes and a summary'],
        ['a cue column', 'the narrow column holding questions and keywords'],
        ['a summary line', 'the sentence capturing a page of notes'],
        ['mind mapping', 'a branching diagram from a central idea'],
        ['linear notes', 'notes written in order down the page'],
        ['the outline method', 'notes indented to show what belongs under what'],
        ['abbreviation', 'a shortened form used to write faster'],
        ['selective note-taking', 'writing what matters rather than everything'],
        ['a keyword', 'the word that carries a point’s meaning'],
        ['paraphrasing', 'putting an idea into your own words'],
        ['verbatim notes', 'notes copying the words exactly'],
        ['dual coding', 'pairing words with a diagram'],
        ['reviewing', 'going back over notes shortly after making them'],
        ['the forgetting curve', 'the pattern by which unreviewed material is lost'],
        ['a knowledge organiser', 'a single page of the essential facts for a topic'],
        ['annotation', 'adding notes onto a text itself'],
        ['a margin note', 'a comment written beside the text'],
        ['colour coding', 'using colour to mark categories consistently'],
        ['a heading hierarchy', 'the levels of heading showing structure']
      ],
      truths: [
        'Paraphrasing in your own words forces understanding; copying verbatim does not.',
        'Reviewing notes within a day dramatically slows forgetting.',
        'The Cornell system builds the review questions into the page as you write.',
        'Pairing a diagram with words helps because they are processed differently.',
        'Writing everything down usually means understanding less, not more.',
        'Colour coding helps only if the same colour means the same thing every time.'
      ],
      myths: [
        'The best notes are the ones that capture every word.',
        'Notes only need reviewing before the exam.',
        'Neat notes and useful notes are the same thing.',
        'Highlighting a textbook is an effective way to learn it.',
        'Mind maps suit every kind of material equally.',
        'Copying out notes again is the most efficient way to revise.'
      ],
      applications: [
        ['A page is split into a narrow question column and a wide notes column. Which system?', 'the Cornell system'],
        ['A student writes "b/c" instead of "because". What is being used?', 'abbreviation'],
        ['Material not revisited is largely lost within a week. Which pattern is this?', 'the forgetting curve'],
        ['A diagram is drawn beside a written explanation. Which principle is this?', 'dual coding'],
        ['One page holds every essential fact for a topic. What is it?', 'a knowledge organiser']
      ]
    }
  ],

  revision: [
    {
      name: 'Revision Techniques and the Evidence', from: 'Grade 8', to: 'College',
      facts: [
        ['retrieval practice', 'testing yourself instead of re-reading'],
        ['spaced practice', 'spreading study across days rather than massing it'],
        ['massed practice', 'cramming everything into one session'],
        ['interleaving', 'mixing topics within a session rather than blocking them'],
        ['blocking', 'studying one topic to completion before starting the next'],
        ['elaboration', 'explaining how and why something works'],
        ['self-explanation', 'talking through your reasoning as you work'],
        ['a flashcard', 'a card with a prompt on one side and the answer on the other'],
        ['the Leitner system', 'the flashcard scheme that reviews weak cards more often'],
        ['a past paper', 'a previous exam used for practice'],
        ['a mark scheme', 'the document showing how marks are awarded'],
        ['a revision timetable', 'a plan allocating time to topics'],
        ['a weak topic', 'a topic where accuracy is lowest'],
        ['the illusion of fluency', 'feeling you know material because it looks familiar'],
        ['highlighting', 'marking text, which feels productive and rarely helps'],
        ['re-reading', 'reading again, which produces familiarity rather than recall'],
        ['a practice question', 'a question attempted under exam conditions'],
        ['feedback', 'information about what was wrong and why'],
        ['a study group', 'a group revising together'],
        ['sleep', 'the state in which memories are consolidated']
      ],
      truths: [
        'Retrieval practice produces more durable learning than re-reading the same material.',
        'Spacing the same total study time across days beats one long session.',
        'Interleaving feels harder than blocking and produces better long-term recall.',
        'Highlighting and re-reading create familiarity, which is easily mistaken for knowledge.',
        'Sleep is part of learning, not time taken away from it.',
        'Feedback is what makes a practice question useful.'
      ],
      myths: [
        'Re-reading your notes is the most effective revision method.',
        'If revision feels easy it is working.',
        'Cramming the night before is as good as spaced study.',
        'Highlighting a page helps you remember it.',
        'Staying up all night to revise is a reasonable trade.',
        'Doing past papers without checking the mark scheme is enough.'
      ],
      applications: [
        ['A student covers their notes and writes what they remember. Which technique is this?', 'retrieval practice'],
        ['Topics are mixed within one session rather than done in blocks. What is this?', 'interleaving'],
        ['Material feels familiar but cannot be recalled unaided. What has happened?', 'the illusion of fluency'],
        ['Weak flashcards come round more often than strong ones. Which scheme?', 'the Leitner system'],
        ['A past paper is marked against the official criteria. What was used?', 'a mark scheme']
      ]
    }
  ],

  exams: [
    {
      name: 'Exam Technique and Command Words', from: 'Grade 8', to: 'College',
      facts: [
        ['a command word', 'the verb telling you what kind of answer is wanted'],
        ['describe', 'say what something is like, without explaining why'],
        ['explain', 'give reasons or say how something works'],
        ['evaluate', 'weigh strengths against weaknesses and reach a judgement'],
        ['compare', 'give similarities and differences between two things'],
        ['analyse', 'break something down and show how the parts relate'],
        ['justify', 'give reasons for a choice or conclusion'],
        ['calculate', 'work out a numerical answer, showing method'],
        ['state', 'give a short factual answer with no explanation'],
        ['discuss', 'present more than one view before concluding'],
        ['mark allocation', 'how many marks a question is worth'],
        ['timing', 'dividing the available time by the marks available'],
        ['a rubric', 'the instructions at the start of a paper'],
        ['showing working', 'writing the method so method marks can be given'],
        ['a mark scheme', 'the document setting out how marks are awarded'],
        ['an examiner report', 'the document describing what candidates got wrong'],
        ['reading time', 'the minutes spent planning before writing'],
        ['a planning paragraph', 'a short plan written before a long answer'],
        ['checking', 'the final read-through for errors'],
        ['an unanswered question', 'the guaranteed zero']
      ],
      truths: [
        'The command word tells you what kind of answer earns the marks.',
        '"Describe" asks what; "explain" asks why or how.',
        'Marks are a guide to how long an answer should be and how long to spend.',
        'Showing your method earns marks even when the final answer is wrong.',
        'An unanswered question scores zero, so a partial attempt is always better.',
        '"Evaluate" requires a judgement, not just two lists.'
      ],
      myths: [
        '"Describe" and "explain" ask for the same thing.',
        'Writing more always earns more marks.',
        'Only the final answer is marked in a calculation.',
        'Leaving a hard question blank is safer than guessing.',
        'The number of marks has nothing to do with how long to spend.',
        '"Evaluate" means give your opinion without evidence.'
      ],
      applications: [
        ['A question says "Evaluate the use of…". What must the answer reach?', 'evaluate'],
        ['A six-mark question in a 90-minute, 90-mark paper. Roughly how long?', 'timing'],
        ['A calculation gets the wrong answer but the method is shown. What can still be earned?', 'showing working'],
        ['A question says "State two reasons". What kind of answer is wanted?', 'state'],
        ['A question asks what happened without asking why. Which command word is it?', 'describe']
      ]
    }
  ],

  marketing: [
    {
      name: 'Market Research and Segmentation', from: 'Grade 9', to: 'College',
      facts: [
        ['market research', 'gathering information about customers and competitors'],
        ['primary research', 'data collected first-hand for this purpose'],
        ['secondary research', 'data collected by someone else for another purpose'],
        ['quantitative data', 'data in numbers'],
        ['qualitative data', 'data in words and opinions'],
        ['a focus group', 'a small guided discussion with customers'],
        ['a survey', 'a set of questions put to a sample'],
        ['a sample', 'the group actually asked'],
        ['sampling bias', 'a sample that does not represent the market'],
        ['market segmentation', 'dividing a market into groups with shared needs'],
        ['a demographic', 'a segment defined by age, income or similar'],
        ['a psychographic', 'a segment defined by attitudes and lifestyle'],
        ['a target market', 'the segment a product is aimed at'],
        ['a niche market', 'a small, specific segment'],
        ['a mass market', 'a large, general segment'],
        ['a unique selling point', 'what distinguishes a product from its competitors'],
        ['positioning', 'where a product sits in customers’ minds relative to rivals'],
        ['a competitor analysis', 'the study of rival offerings'],
        ['market share', 'a firm’s sales as a proportion of the whole market'],
        ['a trend', 'a direction of change over time']
      ],
      truths: [
        'Primary research is collected for this purpose; secondary research already exists.',
        'A large sample chosen badly is still biased.',
        'Qualitative research explains why; quantitative research measures how many.',
        'A niche market can be more profitable than a mass market despite being smaller.',
        'Positioning is about perception, not just about price.',
        'Market share is relative, so it can fall while sales rise.'
      ],
      myths: [
        'Secondary research is always cheaper and better.',
        'A big enough sample removes bias.',
        'Qualitative data is just opinion and has no value.',
        'A mass market is always more profitable than a niche.',
        'Rising sales always mean rising market share.',
        'A unique selling point has to be a lower price.'
      ],
      applications: [
        ['A company runs its own survey of customers. What kind of research is this?', 'primary research'],
        ['Only gym members are asked about exercise habits. What is the problem?', 'sampling bias'],
        ['A market is split by attitudes and lifestyle rather than age. Which basis is this?', 'a psychographic'],
        ['Sales rise 5% while the market grows 15%. What has happened?', 'market share'],
        ['A small group discusses a product with a moderator. What is this?', 'a focus group']
      ]
    },
    {
      name: 'The Marketing Mix and Branding', from: 'Grade 9', to: 'College',
      facts: [
        ['the marketing mix', 'product, price, place and promotion'],
        ['product', 'what is being sold, including its features and quality'],
        ['price', 'what the customer pays'],
        ['place', 'how and where the product reaches the customer'],
        ['promotion', 'how the product is communicated to customers'],
        ['penetration pricing', 'setting a low price to gain market share'],
        ['skimming', 'setting a high price initially and lowering it later'],
        ['cost-plus pricing', 'adding a margin to the cost of production'],
        ['competitive pricing', 'setting price in line with rivals'],
        ['a brand', 'the identity and associations attached to a product'],
        ['brand loyalty', 'the tendency of customers to buy the same brand again'],
        ['a logo', 'the visual mark identifying a brand'],
        ['advertising', 'paid communication to promote a product'],
        ['public relations', 'managing how an organisation is seen'],
        ['a distribution channel', 'the route a product takes to the customer'],
        ['e-commerce', 'selling online'],
        ['a product life cycle', 'the stages from launch to decline'],
        ['an extension strategy', 'an action that prolongs a product’s life'],
        ['a loss leader', 'a product priced below cost to draw customers in'],
        ['ethical marketing', 'promotion that does not mislead or exploit']
      ],
      truths: [
        'The four elements of the mix have to work together, not just individually.',
        'Skimming starts high and comes down; penetration starts low.',
        'A brand is what customers believe about a product, not just its logo.',
        'A loss leader is priced below cost deliberately, to sell other things.',
        'An extension strategy is used when a product enters decline.',
        'Cost-plus pricing ignores what customers are willing to pay.'
      ],
      myths: [
        'Price is the only part of the marketing mix that matters.',
        'A brand is the same thing as a logo.',
        'Skimming means setting a low price to gain share.',
        'A loss leader is a pricing mistake.',
        'Advertising and public relations are the same activity.',
        'Every product follows the life cycle at the same speed.'
      ],
      applications: [
        ['A new phone launches expensive and falls in price over a year. Which strategy?', 'skimming'],
        ['Milk is sold below cost at the back of a supermarket. What is it?', 'a loss leader'],
        ['Sales decline and the company launches a new flavour. What is this?', 'an extension strategy'],
        ['A product reaches customers through wholesalers and shops. What is that route?', 'a distribution channel'],
        ['Customers buy the same brand without comparing. What is this?', 'brand loyalty']
      ]
    }
  ],

  web: [
    {
      name: 'HTML, CSS and How a Page Is Built', from: 'Grade 7', to: 'College',
      facts: [
        ['HTML', 'the language describing the structure of a page'],
        ['CSS', 'the language describing how a page looks'],
        ['JavaScript', 'the language that makes a page behave'],
        ['an element', 'a piece of a page marked by tags'],
        ['a tag', 'the marker opening or closing an element'],
        ['an attribute', 'extra information given on an opening tag'],
        ['a selector', 'the part of a CSS rule choosing what to style'],
        ['a class', 'a reusable label used to style many elements'],
        ['an id', 'a unique label for one element'],
        ['the box model', 'content, padding, border and margin'],
        ['padding', 'the space inside an element, between content and border'],
        ['a margin', 'the space outside an element'],
        ['semantic HTML', 'using elements that describe meaning, such as header and nav'],
        ['accessibility', 'making a page usable by people with disabilities'],
        ['alt text', 'the description of an image for people who cannot see it'],
        ['responsive design', 'a layout that adapts to the size of the screen'],
        ['a media query', 'the CSS rule applying styles at particular screen sizes'],
        ['the DOM', 'the browser’s in-memory representation of the page'],
        ['a hyperlink', 'a link from one page to another'],
        ['a stylesheet', 'a file of CSS rules'],
        ['validation', 'checking that markup follows the rules of the language']
      ],
      truths: [
        'HTML describes structure and CSS describes appearance; keeping them separate is the point.',
        'Semantic elements help screen readers and search engines understand a page.',
        'Alt text is what someone hears in place of an image.',
        'Padding is inside the border and margin is outside it.',
        'A media query applies styles conditionally on screen size.',
        'An id must be unique on a page; a class can be reused.'
      ],
      myths: [
        'CSS is used to add content to a page.',
        'Alt text is only there to help search engines.',
        'Padding and margin are two words for the same space.',
        'Any element can be used for any purpose as long as it is styled correctly.',
        'An id can be reused as often as a class.',
        'A page that looks right in one browser will look right everywhere.'
      ],
      applications: [
        ['An image cannot be seen and its description is read aloud instead. What is that?', 'alt text'],
        ['A layout changes at 768 pixels wide. What made it change?', 'a media query'],
        ['Space is added between an element’s text and its border. What was changed?', 'padding'],
        ['A label is used to style twenty buttons the same way. What kind of label?', 'a class'],
        ['A page uses header, nav and main rather than generic containers. What is this?', 'semantic HTML']
      ]
    }
  ],

  robotics: [
    {
      name: 'Sensors, Control and Feedback', from: 'Grade 7', to: 'College',
      facts: [
        ['a sensor', 'a component that detects a physical quantity'],
        ['an actuator', 'a component that produces movement or change'],
        ['an input', 'a signal coming into a control system'],
        ['an output', 'a signal the system produces'],
        ['a microcontroller', 'the small computer running a control program'],
        ['an analogue signal', 'a signal that varies continuously'],
        ['a digital signal', 'a signal with discrete values'],
        ['a light sensor', 'a component detecting light level'],
        ['a temperature sensor', 'a component detecting heat'],
        ['an ultrasonic sensor', 'a component measuring distance with sound'],
        ['a motor', 'an actuator producing rotation'],
        ['a servo', 'a motor that can be commanded to a specific angle'],
        ['a control loop', 'the repeated cycle of sensing, deciding and acting'],
        ['open loop control', 'control with no feedback from the result'],
        ['closed loop control', 'control that adjusts using feedback'],
        ['feedback', 'information about the result fed back into the decision'],
        ['a threshold', 'the value at which a control decision changes'],
        ['calibration', 'adjusting a sensor so its readings are accurate'],
        ['latency', 'the delay between an input and a response'],
        ['an algorithm', 'the sequence of steps a controller follows']
      ],
      truths: [
        'A closed loop system uses feedback; an open loop system does not.',
        'A sensor detects and an actuator acts — they are opposite ends of the system.',
        'A servo can be commanded to an angle; an ordinary motor cannot.',
        'Calibration is what makes a sensor reading mean something.',
        'A control loop repeats: sense, decide, act, sense again.',
        'Latency limits how fast a control system can safely respond.'
      ],
      myths: [
        'A sensor and an actuator do the same job.',
        'Open loop control is closed loop control without a sensor.',
        'A motor and a servo are interchangeable.',
        'Sensors are accurate straight out of the box.',
        'A faster processor removes all latency.',
        'Feedback always makes a system more stable.'
      ],
      applications: [
        ['A thermostat measures the room and adjusts the heating. What kind of control is this?', 'closed loop control'],
        ['A robot measures distance by timing a returning pulse. Which sensor?', 'an ultrasonic sensor'],
        ['An arm must move to exactly 45 degrees. Which actuator?', 'a servo'],
        ['A light sensor reads differently in a new room until adjusted. What is needed?', 'calibration'],
        ['A system acts only when the reading passes a set value. What is that value?', 'a threshold']
      ]
    }
  ],

  household: [
    {
      name: 'Budgeting, Bills and Running a Home', from: 'Grade 9', to: 'College',
      facts: [
        ['a budget', 'a plan for income and spending'],
        ['income', 'money coming in'],
        ['an expense', 'money going out'],
        ['a fixed cost', 'a cost that is the same each month'],
        ['a variable cost', 'a cost that changes month to month'],
        ['rent', 'the payment for living in a property you do not own'],
        ['a mortgage', 'a loan secured against a property'],
        ['a utility bill', 'a bill for gas, electricity or water'],
        ['a standing order', 'a fixed regular payment you set up'],
        ['a direct debit', 'a payment the recipient collects, which can vary'],
        ['a tenancy agreement', 'the contract between tenant and landlord'],
        ['a deposit', 'money held against damage, returnable at the end'],
        ['insurance', 'a payment that covers a defined risk'],
        ['an excess', 'the part of a claim you pay yourself'],
        ['interest', 'the cost of borrowing or the reward for saving'],
        ['APR', 'the yearly cost of a loan including fees'],
        ['a credit score', 'a lender’s assessment of how reliably you repay'],
        ['an emergency fund', 'savings held for unexpected costs'],
        ['a meter reading', 'the figure that makes an energy bill accurate'],
        ['a standing charge', 'the daily fee on an energy bill regardless of use']
      ],
      truths: [
        'A standing order is set by you; a direct debit is collected by the recipient.',
        'APR includes fees, so it is the honest way to compare loans.',
        'An energy bill has a standing charge that is payable even if you use nothing.',
        'A deposit is returnable, minus any agreed deductions.',
        'An emergency fund is what stops an unexpected cost becoming a debt.',
        'Fixed costs are the same each month; variable costs are not.'
      ],
      myths: [
        'A standing order and a direct debit are the same thing.',
        'The advertised interest rate is the full cost of a loan.',
        'You pay nothing on an energy bill if you use no energy.',
        'A deposit is a fee you never get back.',
        'A credit score is a single number set by the government.',
        'Insurance covers everything once you have paid the premium.'
      ],
      applications: [
        ['A payment varies each month and the company collects it. What is it?', 'a direct debit'],
        ['Two loans are compared including all fees. Which figure is used?', 'APR'],
        ['A claim is made and the first £250 is paid by the customer. What is that?', 'an excess'],
        ['A daily fee appears on a bill even with no usage. What is it?', 'a standing charge'],
        ['Three months of expenses are saved for the unexpected. What is that?', 'an emergency fund']
      ]
    }
  ],

  communication: [
    {
      name: 'Speaking, Listening and Presenting', from: 'Grade 6', to: 'College',
      facts: [
        ['active listening', 'listening in a way that shows attention and checks understanding'],
        ['paraphrasing', 'restating what someone said to confirm you understood'],
        ['a clarifying question', 'a question asked to make something clearer'],
        ['an open question', 'a question inviting a full answer'],
        ['a closed question', 'a question answerable with yes or no'],
        ['body language', 'what posture and gesture communicate'],
        ['eye contact', 'looking at the person you are speaking to'],
        ['tone of voice', 'how something is said rather than what is said'],
        ['pace', 'the speed at which you speak'],
        ['a pause', 'a silence used deliberately'],
        ['projection', 'speaking so you can be heard clearly'],
        ['a filler', 'a word like "um" used while thinking'],
        ['a signpost', 'a phrase telling listeners where you are going'],
        ['an audience', 'the people you are speaking to'],
        ['formal register', 'the language used in a formal setting'],
        ['informal register', 'the language used with friends'],
        ['turn-taking', 'the alternation of speakers in a conversation'],
        ['interrupting', 'speaking before the other person has finished'],
        ['a summary', 'a short restatement of the main points'],
        ['constructive disagreement', 'disagreeing with the point rather than the person']
      ],
      truths: [
        'Active listening includes checking you have understood, not just staying quiet.',
        'An open question invites more than a yes or no.',
        'A pause is a tool, not a mistake.',
        'Tone can contradict the words entirely.',
        'Disagreeing with an idea is not the same as attacking a person.',
        'Adjusting register to your audience is a skill, not dishonesty.'
      ],
      myths: [
        'Listening means saying nothing.',
        'A good speaker never pauses.',
        'Speaking loudly is the same as projecting.',
        'Formal language is always more effective.',
        'Interrupting shows enthusiasm.',
        'A closed question is always the wrong choice.'
      ],
      applications: [
        ['"What did you think of it?" invites a full answer. What kind of question is it?', 'an open question'],
        ['"So you mean the deadline moved?" checks understanding. What is this?', 'paraphrasing'],
        ['A speaker says "Now I will turn to…". What is that phrase?', 'a signpost'],
        ['A speaker challenges the argument without criticising the person. What is this?', 'constructive disagreement'],
        ['The words are polite but the delivery is sharp. What carries that?', 'tone of voice']
      ]
    }
  ],

  drama: [
    {
      name: 'Devising, Genre and Theatre History', from: 'Grade 8', to: 'College',
      facts: [
        ['devising', 'creating a piece from scratch as a company'],
        ['a stimulus', 'the starting point for a devised piece'],
        ['improvisation', 'performing without a script'],
        ['a genre', 'a category of drama with shared conventions'],
        ['naturalism', 'a style aiming to reproduce life as it is'],
        ['physical theatre', 'a style where the body carries the storytelling'],
        ['Brechtian theatre', 'a style that reminds the audience they are watching a play'],
        ['the fourth wall', 'the imaginary wall between actors and audience'],
        ['breaking the fourth wall', 'addressing the audience directly'],
        ['epic theatre', 'Brecht’s style, aimed at thought rather than emotion'],
        ['the alienation effect', 'a technique keeping the audience critically distant'],
        ['commedia dell’arte', 'the Italian tradition of masked stock characters'],
        ['a stock character', 'a recognisable type appearing across many plays'],
        ['melodrama', 'a style of heightened emotion and clear moral types'],
        ['a Greek chorus', 'the group commenting on the action in Greek tragedy'],
        ['an amphitheatre', 'the open-air Greek performance space'],
        ['a mask', 'the object used to fix a character type or amplify expression'],
        ['a rehearsal technique', 'a method used in the room to develop performance'],
        ['hot-seating', 'questioning an actor in role to develop a character'],
        ['a still image', 'a frozen picture used to explore a moment']
      ],
      truths: [
        'Brecht wanted the audience to think rather than to be swept along.',
        'The fourth wall is a convention, and breaking it is a deliberate choice.',
        'Commedia dell’arte used stock characters recognisable across every performance.',
        'Devised work usually starts from a stimulus rather than a script.',
        'Naturalism aims at the appearance of ordinary life on stage.',
        'Hot-seating develops a character by questioning the actor in role.'
      ],
      myths: [
        'Improvisation means there has been no preparation.',
        'Breaking the fourth wall is a mistake.',
        'Brecht wanted audiences to become emotionally lost in the story.',
        'Devised theatre has no structure.',
        'Every mask in theatre is used to hide the actor.',
        'Naturalism and melodrama are the same style.'
      ],
      applications: [
        ['An actor speaks directly to the audience mid-scene. What has happened?', 'breaking the fourth wall'],
        ['A company begins with a photograph and builds a piece from it. What is the photograph?', 'a stimulus'],
        ['An actor answers questions as their character. Which technique is this?', 'hot-seating'],
        ['A style keeps the audience thinking rather than absorbed. What is this?', 'the alienation effect'],
        ['A recognisable type appears in play after play. What is it?', 'a stock character']
      ]
    }
  ]
};
