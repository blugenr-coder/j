/* The maths topics that had no units at all: decimals, trigonometry as its own
   topic, measurement and discrete maths. A topic with no units gets only
   procedurally generated sums, so it had practice and no vocabulary, no
   true-or-false judgement and no misconception work. */

export const MATHS2_UNITS = {
  decimals: [
    {
      name: 'Decimals: Reading, Ordering and Rounding', from: 'Grade 4', to: 'Grade 9',
      facts: [
        ['a decimal', 'a number written with a point separating whole from part'],
        ['the decimal point', 'the mark separating units from tenths'],
        ['a tenth', 'the first column after the decimal point'],
        ['a hundredth', 'the second column after the decimal point'],
        ['a thousandth', 'the third column after the decimal point'],
        ['a terminating decimal', 'a decimal that stops after a finite number of places'],
        ['a recurring decimal', 'a decimal with a digit or block repeating forever'],
        ['the recurring dot', 'the mark placed above a digit that repeats'],
        ['rounding to one decimal place', 'keeping one digit after the point'],
        ['rounding to two decimal places', 'keeping two digits after the point'],
        ['a significant figure', 'a digit counted from the first non-zero one'],
        ['a trailing zero', 'a zero at the end of a decimal, which does not change its value'],
        ['a leading zero', 'the zero written before the point in numbers less than one'],
        ['truncating', 'cutting a decimal off without rounding'],
        ['an upper bound', 'the largest value a rounded measurement could have been'],
        ['a lower bound', 'the smallest value a rounded measurement could have been'],
        ['place value', 'the value a digit has because of its column'],
        ['equivalence', 'the fact that 0.5, 1/2 and 50% are the same number']
      ],
      truths: [
        '0.7 is greater than 0.65, because the tenths column decides it first.',
        'Adding a zero to the end of a decimal does not change its value.',
        'Every fraction is either a terminating or a recurring decimal.',
        '1/3 written as a decimal recurs forever and never terminates.',
        'A length given as 4.6 cm to one decimal place lies between 4.55 and 4.65 cm.',
        'Truncating and rounding give different answers for 3.78 to one decimal place.'
      ],
      myths: [
        'A decimal with more digits after the point is always larger.',
        '0.65 is bigger than 0.7 because 65 is bigger than 7.',
        'Adding a zero to the end of a decimal makes it ten times bigger.',
        'Every fraction can be written as a decimal that terminates.',
        'Rounding and truncating are the same operation.',
        'A measurement written as 4.6 cm is exactly 4.6 cm.'
      ],
      applications: [
        ['Comparing 0.4 and 0.38 needs the first column after the point. Which column is that?', 'a tenth'],
        ['1/3 is written as 0.333… with a dot above the 3. What kind of decimal is it?', 'a recurring decimal'],
        ['A mass is given as 3.2 kg to one decimal place and could be as low as 3.15 kg. What is 3.15?', 'a lower bound'],
        ['3.78 becomes 3.7 when the digits are simply cut off. What was done?', 'truncating'],
        ['0.5, 1/2 and 50% all mean the same amount. What is this?', 'equivalence']
      ]
    },
    {
      name: 'Calculating with Decimals', from: 'Grade 5', to: 'Grade 10',
      facts: [
        ['lining up the decimal points', 'the method for adding and subtracting decimals'],
        ['multiplying decimals', 'multiplying as whole numbers, then placing the point'],
        ['dividing by a decimal', 'multiplying both numbers by a power of ten first'],
        ['an equivalent calculation', 'a rewritten sum with the same answer but easier numbers'],
        ['a power of ten', 'ten, a hundred, a thousand and so on'],
        ['multiplying by ten', 'moving every digit one column to the left'],
        ['dividing by ten', 'moving every digit one column to the right'],
        ['an estimate', 'a rough answer found by rounding first'],
        ['a check by estimation', 'confirming an answer is sensible by comparing with a rough one'],
        ['the total number of decimal places', 'the count used to place the point in a product'],
        ['money notation', 'the convention of writing amounts to two decimal places'],
        ['a percentage as a decimal', 'a percentage divided by one hundred'],
        ['a decimal as a fraction', 'the digits written over the matching power of ten'],
        ['a mixed calculation', 'a calculation involving more than one operation'],
        ['the order of operations', 'the convention deciding which operation comes first'],
        ['a rounding error', 'the difference introduced by rounding partway through']
      ],
      truths: [
        'Multiplying by 10 moves the digits one column left; the decimal point does not move.',
        '0.4 × 0.2 is 0.08, not 0.8: the answer has as many decimal places as the two numbers together.',
        'Dividing by a decimal is easiest after multiplying both numbers by a power of ten.',
        'Multiplying by a number less than one gives a smaller answer.',
        'Rounding partway through a calculation introduces error into the final answer.',
        'An estimate made by rounding first is a good check on a calculated answer.'
      ],
      myths: [
        '0.4 × 0.2 is 0.8.',
        'When you multiply by 10 the decimal point moves to the right.',
        'Multiplying two decimals always gives a bigger answer.',
        'You can round each step of a calculation without affecting the answer.',
        'To add decimals you line up the last digits, like whole numbers.',
        'Dividing by 0.5 gives a smaller answer than the number you started with.'
      ],
      applications: [
        ['12.5 + 3.75 is worked out by aligning the points. Which method is this?', 'lining up the decimal points'],
        ['6 ÷ 0.2 is rewritten as 60 ÷ 2. What was used?', 'dividing by a decimal'],
        ['0.3 × 0.4 has two decimal places in total, so the answer is 0.12. Which rule is this?', 'the total number of decimal places'],
        ['An answer of 480 is checked against a rough calculation of 500. What was done?', 'a check by estimation'],
        ['35% is written as 0.35 before multiplying. What was performed?', 'a percentage as a decimal']
      ]
    }
  ],

  trigonometry: [
    {
      name: 'Right-Angled Trigonometry', from: 'Grade 9', to: 'College',
      figures: ['right-triangle'],
      facts: [
        ['sine', 'opposite divided by hypotenuse'],
        ['cosine', 'adjacent divided by hypotenuse'],
        ['tangent', 'opposite divided by adjacent'],
        ['the hypotenuse', 'the longest side, opposite the right angle'],
        ['the opposite side', 'the side across the triangle from the angle in use'],
        ['the adjacent side', 'the side beside the angle that is not the hypotenuse'],
        ['SOHCAHTOA', 'the mnemonic for the three ratios'],
        ['an inverse sine', 'the function giving the angle whose sine is known'],
        ['an angle of elevation', 'the upward angle from the horizontal'],
        ['an angle of depression', 'the downward angle from the horizontal'],
        ['Pythagoras’ theorem', 'the rule connecting the three sides of a right-angled triangle'],
        ['a bearing', 'a direction measured clockwise from north in three figures'],
        ['an exact value', 'a trigonometric value left as a fraction or surd'],
        ['a scale drawing', 'a diagram in which lengths are in fixed proportion to real ones'],
        ['a 3D problem', 'a question requiring a right-angled triangle to be found inside a solid'],
        ['the included angle', 'the angle between two known sides']
      ],
      truths: [
        'SOHCAHTOA applies only to right-angled triangles.',
        'The hypotenuse is always opposite the right angle, wherever the triangle is drawn.',
        'The inverse function converts a ratio back into an angle.',
        'Which side is "opposite" depends on which angle you are working from.',
        'sin 30° is exactly 1/2 and cos 60° is also exactly 1/2.',
        'An angle of elevation from A to B equals the angle of depression from B to A.'
      ],
      myths: [
        'The opposite side is always the vertical one.',
        'SOHCAHTOA can be used in any triangle.',
        'The hypotenuse is whichever side is longest on the page.',
        'sin, cos and tan are measured in degrees.',
        'Pythagoras’ theorem gives you an angle.',
        'The adjacent side is the same for every angle in the triangle.'
      ],
      applications: [
        ['A ladder’s length and the angle to the ground are known; the height is wanted. Which ratio applies?', 'sine'],
        ['A ratio of 0.7071 has to be turned back into an angle. What is used?', 'an inverse sine'],
        ['Someone at the top of a cliff looks down at a boat. Which angle is measured?', 'an angle of depression'],
        ['Two sides of a right-angled triangle are known and the third is wanted. Which rule applies?', 'Pythagoras’ theorem'],
        ['A direction is recorded as 247°, clockwise from north. What is it?', 'a bearing']
      ]
    },
    {
      name: 'Non-Right-Angled Triangles and Trig Graphs', from: 'Grade 11', to: 'College',
      figures: ['triangle'],
      facts: [
        ['the sine rule', 'a/sin A = b/sin B = c/sin C, for any triangle'],
        ['the cosine rule', 'a² = b² + c² − 2bc cos A, for any triangle'],
        ['the ambiguous case', 'the situation where the sine rule gives two possible angles'],
        ['the area rule', 'the area of a triangle as half ab sin C'],
        ['a radian', 'the angle unit in which a full turn is 2π'],
        ['a periodic function', 'a function that repeats at regular intervals'],
        ['the period', 'the interval after which a function repeats'],
        ['the amplitude', 'half the distance between the maximum and minimum of a wave'],
        ['the sine curve', 'the wave starting at zero and rising'],
        ['the cosine curve', 'the wave starting at its maximum'],
        ['an asymptote', 'a line a curve approaches but never meets'],
        ['a trigonometric identity', 'an equation true for every angle, such as sin²θ + cos²θ = 1'],
        ['a transformation of a graph', 'a stretch or shift applied to a curve'],
        ['a solution in a range', 'the set of angles satisfying an equation within stated limits'],
        ['the unit circle', 'the circle of radius one used to define the ratios for any angle']
      ],
      truths: [
        'The sine and cosine rules work in any triangle, including right-angled ones.',
        'The cosine rule is needed when you know two sides and the angle between them.',
        'sin²θ + cos²θ = 1 for every angle θ.',
        'The tangent curve has asymptotes where cosine is zero.',
        'The sine curve has a period of 360° or 2π radians.',
        'The sine rule can give two valid answers for an angle: the ambiguous case.'
      ],
      myths: [
        'The cosine rule only works in obtuse triangles.',
        'sin²θ + cos²θ equals θ.',
        'The tangent curve is continuous everywhere.',
        'The sine rule always gives exactly one possible angle.',
        'Radians and degrees can be used interchangeably in a formula without converting.',
        'The amplitude of a curve is the distance from maximum to minimum.'
      ],
      applications: [
        ['Two sides and the angle between them are known; the third side is wanted. Which rule applies?', 'the cosine rule'],
        ['A curve approaches a vertical line but never reaches it. What is that line?', 'an asymptote'],
        ['A wave repeats every 360°. What is 360° called?', 'the period'],
        ['A triangle’s area is found from two sides and the angle between. Which rule is used?', 'the area rule'],
        ['An equation gives two valid angles between 0° and 180°. What situation is this?', 'the ambiguous case']
      ]
    }
  ],

  measurement: [
    {
      name: 'Units, Conversion and Estimation', from: 'Grade 3', to: 'Grade 11',
      facts: [
        ['a millimetre', 'a thousandth of a metre'],
        ['a centimetre', 'a hundredth of a metre'],
        ['a metre', 'the base unit of length'],
        ['a kilometre', 'a thousand metres'],
        ['a gram', 'the unit of mass equal to a thousandth of a kilogram'],
        ['a kilogram', 'the base unit of mass'],
        ['a litre', 'the unit of capacity equal to 1000 cm³'],
        ['a millilitre', 'a thousandth of a litre, equal to one cubic centimetre'],
        ['a conversion factor', 'the number one unit is multiplied by to reach another'],
        ['a metric unit', 'a unit in the decimal system based on tens'],
        ['an imperial unit', 'a unit from the older system, such as a mile or a pound'],
        ['a compound unit', 'a unit built from two others, such as metres per second'],
        ['density', 'mass divided by volume'],
        ['speed', 'distance divided by time'],
        ['a rate', 'a comparison of two quantities with different units'],
        ['scale', 'the ratio between a length on a drawing and the real length'],
        ['degree of accuracy', 'how precisely a measurement has been given'],
        ['an appropriate unit', 'the unit whose size suits the quantity being measured']
      ],
      truths: [
        'One millilitre is exactly one cubic centimetre.',
        'To convert metres to centimetres you multiply by 100.',
        'Density is mass divided by volume, so its units are compound.',
        'A map scale of 1:25,000 means 1 cm on the map is 250 m on the ground.',
        'Converting from a smaller unit to a larger one always gives a smaller number.',
        'Area units square the length conversion: 1 m² is 10,000 cm², not 100.'
      ],
      myths: [
        'One square metre is one hundred square centimetres.',
        'To convert centimetres to metres you multiply by 100.',
        'A litre and a kilogram are the same thing for every substance.',
        'Density is volume divided by mass.',
        'A map scale of 1:25,000 means 1 cm represents 25,000 cm² of ground.',
        'Bigger numbers always mean bigger quantities, whatever the unit.'
      ],
      applications: [
        ['A drink is measured in cm³ on one label and ml on another. Which fact explains the match?', 'a millilitre'],
        ['4.2 km is written in metres by multiplying by 1000. What was used?', 'a conversion factor'],
        ['A quantity is measured in kilometres per hour. What kind of unit is that?', 'a compound unit'],
        ['A block’s mass and volume are used to identify the material. What is calculated?', 'density'],
        ['Measuring a room in millimetres gives an unwieldy number. What was chosen badly?', 'an appropriate unit']
      ]
    },
    {
      name: 'Time, Timetables and Money', from: 'Grade 3', to: 'Grade 9',
      facts: [
        ['the 24-hour clock', 'the notation running from 00:00 to 23:59'],
        ['the 12-hour clock', 'the notation using am and pm'],
        ['am', 'the hours from midnight to noon'],
        ['pm', 'the hours from noon to midnight'],
        ['a duration', 'the length of time between two moments'],
        ['a timetable', 'a table of departure and arrival times'],
        ['elapsed time', 'the time that has passed between two events'],
        ['a leap year', 'a year with an extra day in February'],
        ['a time zone', 'a region that keeps the same standard time'],
        ['a decimal hour', 'part of an hour written as a decimal, where 0.5 is thirty minutes'],
        ['a unit price', 'the cost per single item or per unit of measure'],
        ['best value', 'the option with the lowest unit price'],
        ['a bill', 'an itemised statement of amounts owed'],
        ['change', 'the money returned when payment exceeds the price'],
        ['a budget', 'a plan for spending within an amount available'],
        ['currency conversion', 'changing an amount from one currency to another using a rate'],
        ['an exchange rate', 'how much of one currency buys another']
      ],
      truths: [
        'Time is not decimal: 1.5 hours is 90 minutes, but 1.30 on a clock is not.',
        'In the 24-hour clock, 14:00 is 2 pm.',
        'Comparing unit prices is the reliable way to find best value.',
        'A duration crossing midnight has to be worked out in two parts.',
        '0.25 of an hour is 15 minutes.',
        'A leap year occurs every four years, apart from most century years.'
      ],
      myths: [
        '1.5 hours is one hour and fifty minutes.',
        '14:00 is 4 pm.',
        'The cheaper packet is always better value.',
        'There are 100 minutes in an hour.',
        'Every year divisible by four is a leap year, without exception.',
        '0.3 of an hour is 30 minutes.'
      ],
      applications: [
        ['A train leaves at 23:40 and arrives at 00:25. Which calculation is needed?', 'elapsed time'],
        ['A 500 g pack costs £2 and a 750 g pack costs £2.70. Which comparison decides?', 'a unit price'],
        ['A journey of 1.25 hours is converted to 1 hour 15 minutes. Which idea is used?', 'a decimal hour'],
        ['£40 is exchanged at 1.15 euros to the pound. What is applied?', 'an exchange rate'],
        ['A clock shows 18:45 and the equivalent is wanted in am/pm. Which notation is being converted to?', 'the 12-hour clock']
      ]
    }
  ],

  discrete: [
    {
      name: 'Sets, Logic and Counting', from: 'Grade 9', to: 'College',
      facts: [
        ['a set', 'a collection of distinct objects'],
        ['an element', 'a member of a set'],
        ['the union', 'the set of everything in either set'],
        ['the intersection', 'the set of everything in both sets'],
        ['the complement', 'everything in the universal set that is not in the given set'],
        ['a subset', 'a set every element of which is in another set'],
        ['the empty set', 'the set with no elements'],
        ['the universal set', 'the set of everything under consideration'],
        ['a Venn diagram', 'the diagram of overlapping circles showing set relationships'],
        ['a proposition', 'a statement that is either true or false'],
        ['a conjunction', 'the statement "A and B", true only when both are'],
        ['a disjunction', 'the statement "A or B", true when at least one is'],
        ['a negation', 'the statement that reverses the truth of another'],
        ['an implication', 'the statement "if A then B"'],
        ['the converse', 'the implication with the two parts swapped'],
        ['a truth table', 'the table listing every combination of truth values'],
        ['the product rule for counting', 'the rule that choices multiply'],
        ['a permutation', 'an arrangement in which order matters'],
        ['a combination', 'a selection in which order does not matter'],
        ['a factorial', 'the product of all whole numbers up to a given one']
      ],
      truths: [
        'The intersection contains only elements in both sets.',
        'An implication and its converse are different statements with different truth values.',
        'In a permutation the order matters; in a combination it does not.',
        'If there are 4 shirts and 3 ties there are 12 outfits, by the product rule.',
        'The empty set is a subset of every set.',
        '"A or B" in logic is true when both A and B are true.'
      ],
      myths: [
        'The union of two sets contains only what they have in common.',
        'An implication and its converse mean the same thing.',
        'Permutations and combinations are two names for the same count.',
        '"A or B" in logic means exactly one of them.',
        'The empty set is not a set at all.',
        'A set can contain the same element twice.'
      ],
      applications: [
        ['Students taking both maths and physics are counted. Which set operation is this?', 'the intersection'],
        ['The number of ways to arrange five books on a shelf is wanted. What is being counted?', 'a permutation'],
        ['Choosing three pizza toppings from ten, where order does not matter. What is this?', 'a combination'],
        ['"If it rains then the match is cancelled" is reversed. What has been formed?', 'the converse'],
        ['Every combination of true and false is listed for two statements. What has been drawn?', 'a truth table']
      ]
    },
    {
      name: 'Graphs, Networks and Algorithms', from: 'Grade 10', to: 'College',
      facts: [
        ['a graph', 'a set of vertices joined by edges'],
        ['a vertex', 'a point in a network'],
        ['an edge', 'a connection between two vertices'],
        ['the degree of a vertex', 'the number of edges meeting at it'],
        ['a path', 'a route through a graph visiting no vertex twice'],
        ['a cycle', 'a path returning to where it started'],
        ['a connected graph', 'a graph in which every vertex can be reached from every other'],
        ['a weighted graph', 'a graph whose edges carry numbers such as distances'],
        ['a tree', 'a connected graph with no cycles'],
        ['a spanning tree', 'a tree connecting every vertex of a graph'],
        ['a minimum spanning tree', 'the spanning tree of least total weight'],
        ['Kruskal’s algorithm', 'the method that adds the shortest edges that create no cycle'],
        ['Prim’s algorithm', 'the method that grows a tree outwards from one vertex'],
        ['Dijkstra’s algorithm', 'the method that finds the shortest route between two vertices'],
        ['a bipartite graph', 'a graph whose vertices split into two sets with edges only between them'],
        ['the travelling salesman problem', 'the problem of the shortest route visiting every vertex once'],
        ['an adjacency matrix', 'the table recording which vertices are joined'],
        ['a directed graph', 'a graph whose edges have a direction'],
        ['a bridge', 'an edge whose removal disconnects the graph']
      ],
      truths: [
        'A tree with n vertices has exactly n − 1 edges.',
        'Kruskal’s and Prim’s algorithms both find a minimum spanning tree.',
        'Dijkstra’s algorithm finds the shortest path, which need not use the fewest edges.',
        'The sum of all vertex degrees is twice the number of edges.',
        'A graph can have several different minimum spanning trees of the same total weight.',
        'Removing a bridge disconnects a graph.'
      ],
      myths: [
        'A minimum spanning tree is always unique.',
        'The shortest path is always the one with the fewest edges.',
        'A tree can contain a cycle if it is connected.',
        'Kruskal’s algorithm and Dijkstra’s algorithm solve the same problem.',
        'The sum of the vertex degrees equals the number of edges.',
        'Every connected graph is a tree.'
      ],
      applications: [
        ['The cheapest set of cables connecting every office is wanted. What is being found?', 'a minimum spanning tree'],
        ['The quickest route between two stations on a weighted map is needed. Which algorithm applies?', 'Dijkstra’s algorithm'],
        ['Three edges meet at one point in a network. What is 3?', 'the degree of a vertex'],
        ['A single road whose closure cuts a town in two is identified. What is it?', 'a bridge'],
        ['A delivery van must visit every address once and return. Which problem is this?', 'the travelling salesman problem']
      ]
    }
  ]
};
