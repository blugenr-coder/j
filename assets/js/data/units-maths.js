/* Mathematics micro-units.

   Maths was the one subject with no units at all: its worksheets came entirely
   from procedural generators that compose fresh numbers. That covers practice
   and misses everything else a maths lesson does — the vocabulary, the
   statements a student has to judge true or false, the misconceptions that
   survive years of correct arithmetic ("multiplying always makes it bigger",
   "a fraction is two numbers"), and the diagrams that have to be read before
   anything can be calculated.

   These units sit alongside the generators rather than replacing them: the
   generators still produce the sums, and these produce the understanding the
   sums are supposed to demonstrate. */

export const MATHS_UNITS = {
  arithmetic: [
    {
      name: 'Place Value and the Number System', from: 'Grade 2', to: 'Grade 8',
      facts: [
        ['a digit', 'one of the ten symbols 0 to 9'],
        ['place value', 'the value a digit has because of its position'],
        ['the units column', 'the column holding the ones'],
        ['the tens column', 'the column immediately left of the units'],
        ['a decimal point', 'the mark separating whole numbers from parts of one'],
        ['a tenth', 'the first place after the decimal point'],
        ['a hundredth', 'the second place after the decimal point'],
        ['rounding', 'replacing a number with a nearby simpler one'],
        ['a significant figure', 'a digit that carries information about size'],
        ['an estimate', 'a rough answer found with simplified numbers'],
        ['a negative number', 'a number less than zero'],
        ['an integer', 'a whole number, positive, negative or zero'],
        ['a natural number', 'a counting number: 1, 2, 3 and so on'],
        ['a rational number', 'a number that can be written as one integer over another'],
        ['an irrational number', 'a number that cannot be written as a fraction, such as π'],
        ['standard form', 'writing a number as a value between 1 and 10 times a power of ten'],
        ['a power of ten', 'ten multiplied by itself a given number of times'],
        ['ordering', 'arranging numbers by size'],
        ['the number line', 'the line on which every number has a position'],
        ['absolute value', 'the distance of a number from zero, ignoring sign']
      ],
      truths: [
        'Moving a digit one column to the left multiplies its value by ten.',
        'Adding a zero to the end of a decimal does not change its value.',
        '−7 is smaller than −3, because it is further left on the number line.',
        'Every integer is a rational number, because it can be written over 1.',
        'Rounding 4.5 to the nearest whole number gives 5 by the usual convention.',
        '0.7 is larger than 0.65, even though 65 is larger than 7.'
      ],
      myths: [
        'A decimal with more digits is always larger.',
        '−7 is larger than −3 because 7 is larger than 3.',
        'Adding a zero to the end of any number makes it ten times bigger.',
        'π can be written exactly as 22/7.',
        'Zero is a natural number in every convention, so counting starts at zero.',
        'The digit 5 always has the value five.'
      ],
      applications: [
        ['In 4,382 the digit 3 stands for three hundred. Which idea explains this?', 'place value'],
        ['Which is larger, 0.4 or 0.35? The answer needs a comparison by column, not by digit count.', 'a tenth'],
        ['A shop price of £19.99 is described as "about £20". What has been done?', 'rounding'],
        ['A distance is written 3 × 10⁸ metres. What notation is this?', 'standard form'],
        ['A temperature of −6°C is colder than −2°C. Which model makes this clear?', 'the number line']
      ]
    },
    {
      name: 'The Four Operations and Their Properties', from: 'Grade 3', to: 'Grade 9',
      facts: [
        ['the sum', 'the result of an addition'],
        ['the difference', 'the result of a subtraction'],
        ['the product', 'the result of a multiplication'],
        ['the quotient', 'the result of a division'],
        ['a factor', 'a number that divides exactly into another'],
        ['a multiple', 'the result of multiplying a number by an integer'],
        ['a prime number', 'a number with exactly two factors, itself and one'],
        ['a composite number', 'a number with more than two factors'],
        ['the highest common factor', 'the largest number dividing exactly into two numbers'],
        ['the lowest common multiple', 'the smallest number that both numbers divide into'],
        ['the commutative property', 'the rule that a + b = b + a and a × b = b × a'],
        ['the associative property', 'the rule that grouping does not change a sum or product'],
        ['the distributive property', 'the rule that a(b + c) = ab + ac'],
        ['the order of operations', 'the convention of brackets, indices, then multiply and divide, then add and subtract'],
        ['an inverse operation', 'the operation that undoes another'],
        ['a remainder', 'what is left over after a division that does not go exactly'],
        ['prime factorisation', 'writing a number as a product of primes'],
        ['a square number', 'the result of multiplying an integer by itself'],
        ['a cube number', 'the result of multiplying an integer by itself twice'],
        ['a square root', 'the number that multiplies by itself to give a given value']
      ],
      truths: [
        'Addition and multiplication are commutative; subtraction and division are not.',
        'Multiplying by a number between 0 and 1 gives a smaller result.',
        'One is neither prime nor composite: it has exactly one factor.',
        'Every whole number greater than one has exactly one prime factorisation.',
        'Division by zero is undefined, not zero.',
        'Two is the only even prime number.'
      ],
      myths: [
        'Multiplying two numbers always gives a bigger answer.',
        'Dividing always makes a number smaller.',
        'One is a prime number.',
        'Subtraction is commutative, so 5 − 3 is the same as 3 − 5.',
        'Any number divided by zero is zero.',
        'All prime numbers are odd.'
      ],
      applications: [
        ['8 × 0.5 gives 4, which is smaller than 8. Which fact explains this?', 'the product'],
        ['A number divides exactly into both 12 and 18, and it is the largest that does. What is being found?', 'the highest common factor'],
        ['Working out 3 + 4 × 2 gives 11, not 14. Which convention decides this?', 'the order of operations'],
        ['Writing 60 as 2 × 2 × 3 × 5. What has been done?', 'prime factorisation'],
        ['Subtracting 7 undoes adding 7. What relationship is this?', 'an inverse operation']
      ]
    }
  ],

  fractions: [
    {
      name: 'Understanding Fractions', from: 'Grade 3', to: 'Grade 9',
      facts: [
        ['a fraction', 'a number written as one whole divided into equal parts'],
        ['the numerator', 'the top number, counting how many parts are taken'],
        ['the denominator', 'the bottom number, saying how many equal parts the whole is split into'],
        ['a proper fraction', 'a fraction less than one'],
        ['an improper fraction', 'a fraction whose numerator is at least its denominator'],
        ['a mixed number', 'a whole number written beside a proper fraction'],
        ['an equivalent fraction', 'a different-looking fraction of the same value'],
        ['simplifying', 'dividing numerator and denominator by a common factor'],
        ['the lowest terms', 'the form of a fraction with no common factor left'],
        ['a common denominator', 'a shared denominator that lets two fractions be compared or added'],
        ['a unit fraction', 'a fraction with a numerator of one'],
        ['the reciprocal', 'the fraction turned upside down'],
        ['a whole', 'the quantity a fraction is a part of'],
        ['a half', 'one of two equal parts'],
        ['a quarter', 'one of four equal parts'],
        ['a third', 'one of three equal parts'],
        ['a fraction of an amount', 'the result of dividing by the denominator and multiplying by the numerator'],
        ['a terminating decimal', 'the decimal form of a fraction that stops']
      ],
      truths: [
        'A fraction is one number, not two numbers written above each other.',
        'The larger the denominator, the smaller each part is.',
        'To add fractions you need a common denominator; to multiply them you do not.',
        'Multiplying by a fraction less than one makes a quantity smaller.',
        'Dividing by a fraction is the same as multiplying by its reciprocal.',
        '1/3 is larger than 1/4, even though 4 is larger than 3.'
      ],
      myths: [
        'To add two fractions you add the numerators and add the denominators.',
        'A fraction with a larger denominator is always a larger fraction.',
        'A fraction is two separate numbers.',
        'Multiplying by a fraction always makes the answer bigger.',
        'Every fraction can be written as a decimal that stops.',
        'You need a common denominator before you can multiply two fractions.'
      ],
      applications: [
        ['A pizza is cut into eight and three slices are taken. Which number is the 8?', 'the denominator'],
        ['4/6 and 2/3 have the same value. What are they?', 'an equivalent fraction'],
        ['Dividing by 2/3 gives the same answer as multiplying by 3/2. What was used?', 'the reciprocal'],
        ['1/4 + 1/3 requires rewriting both as twelfths first. What was needed?', 'a common denominator'],
        ['Half of 3/4 of a cake is being calculated. Which fact explains the result being smaller?', 'a fraction']
      ]
    }
  ],

  percentages: [
    {
      name: 'Percentages, Ratio and Proportion', from: 'Grade 5', to: 'Grade 12',
      facts: [
        ['a percentage', 'a proportion expressed out of one hundred'],
        ['a ratio', 'a comparison of two or more quantities'],
        ['a proportion', 'a statement that two ratios are equal'],
        ['percentage increase', 'the rise expressed as a percentage of the original'],
        ['percentage decrease', 'the fall expressed as a percentage of the original'],
        ['a multiplier', 'the single number a quantity is multiplied by to apply a percentage change'],
        ['simple interest', 'interest calculated on the original amount only'],
        ['compound interest', 'interest calculated on the amount including previous interest'],
        ['the original value', 'the amount a percentage change is measured against'],
        ['a reverse percentage', 'finding the original amount after a percentage change'],
        ['direct proportion', 'the relationship where doubling one quantity doubles the other'],
        ['inverse proportion', 'the relationship where doubling one quantity halves the other'],
        ['a unit rate', 'the amount per one unit of another quantity'],
        ['scaling up', 'multiplying every part of a ratio by the same number'],
        ['a part-to-whole ratio', 'a comparison of one share to the total'],
        ['a part-to-part ratio', 'a comparison of one share to another'],
        ['depreciation', 'the fall in value of an item over time'],
        ['VAT', 'a tax added as a percentage of the price'],
        ['profit', 'the amount by which the selling price exceeds the cost'],
        ['a discount', 'a reduction expressed as a percentage of the original price']
      ],
      truths: [
        'A 20% rise followed by a 20% fall does not return you to the original amount.',
        'To increase by 15%, multiply by 1.15.',
        'Compound interest earns more than simple interest over the same period.',
        'A ratio of 2:3 means the whole is split into five parts, not three.',
        'Percentage change is always measured against the original value.',
        'In inverse proportion, doubling one quantity halves the other.'
      ],
      myths: [
        'A 20% increase followed by a 20% decrease returns you to where you started.',
        'To increase something by 15% you multiply by 0.15.',
        'A ratio of 2:3 means two parts out of three.',
        'Percentage change is worked out against the new value.',
        'Simple and compound interest give the same result over one year — and over five.',
        'A 50% discount followed by another 50% discount makes something free.'
      ],
      applications: [
        ['A £40 coat is reduced by 25%. Which number do you multiply by?', 'a multiplier'],
        ['After a 20% rise, a price is £60. Finding the original price requires which method?', 'a reverse percentage'],
        ['Sharing £45 in the ratio 2:3 means splitting into how many parts?', 'a part-to-whole ratio'],
        ['A car worth £12,000 loses value every year. What is this called?', 'depreciation'],
        ['Four workers take six days; eight workers take three. What relationship is this?', 'inverse proportion']
      ]
    }
  ],

  algebra: [
    {
      name: 'Algebraic Language and Manipulation', from: 'Grade 6', to: 'Grade 12',
      facts: [
        ['a variable', 'a letter standing for a number that can change'],
        ['a constant', 'a fixed number in an expression'],
        ['a coefficient', 'the number multiplying a variable'],
        ['a term', 'a single part of an expression, separated by plus or minus'],
        ['an expression', 'a collection of terms with no equals sign'],
        ['an equation', 'a statement that two expressions are equal'],
        ['an identity', 'an equation true for every value of the variable'],
        ['a formula', 'a rule connecting quantities, written with symbols'],
        ['like terms', 'terms with exactly the same letters and powers'],
        ['collecting like terms', 'adding or subtracting terms of the same kind'],
        ['expanding', 'multiplying out brackets'],
        ['factorising', 'writing an expression as a product of factors'],
        ['substitution', 'replacing a letter with a number'],
        ['the subject of a formula', 'the variable on its own, on one side'],
        ['rearranging', 'changing which variable is the subject'],
        ['an index', 'the small raised number showing a power'],
        ['an inequality', 'a statement that one expression is larger or smaller than another'],
        ['a linear expression', 'an expression whose highest power of the variable is one'],
        ['a quadratic expression', 'an expression whose highest power of the variable is two'],
        ['the difference of two squares', 'the pattern a² − b² = (a + b)(a − b)']
      ],
      truths: [
        '3a and 3a² are not like terms and cannot be added together.',
        'An identity is true for every value; an equation may be true for only some.',
        'Expanding and factorising are inverse processes.',
        'a² × a³ = a⁵: multiplying powers of the same base adds the indices.',
        'Multiplying or dividing an inequality by a negative number reverses it.',
        '(a + b)² is not a² + b².'
      ],
      myths: [
        '3a and 3a² are like terms because they both involve a.',
        '(a + b)² equals a² + b².',
        'a² × a³ equals a⁶.',
        'Multiplying both sides of an inequality by −1 leaves it unchanged.',
        '2a means "two then a", so 2a with a = 3 is 23.',
        'An expression and an equation are the same thing.'
      ],
      applications: [
        ['5x + 3x simplifies to 8x. What has been done?', 'collecting like terms'],
        ['x² − 9 is rewritten as (x + 3)(x − 3). Which pattern was used?', 'the difference of two squares'],
        ['A formula for area is rearranged to make the height the subject. What was done?', 'rearranging'],
        ['Replacing x with 4 in 3x + 1 gives 13. What was performed?', 'substitution'],
        ['3(x + 2) becomes 3x + 6. What was done?', 'expanding']
      ]
    },
    {
      name: 'Equations, Inequalities and Graphs', from: 'Grade 7', to: 'College',
      facts: [
        ['a linear equation', 'an equation whose graph is a straight line'],
        ['a solution', 'the value that makes an equation true'],
        ['the gradient', 'the steepness of a line: change in y over change in x'],
        ['the y-intercept', 'the value of y where a line crosses the y-axis'],
        ['y = mx + c', 'the standard form of a straight-line equation'],
        ['a quadratic equation', 'an equation with a squared term as its highest power'],
        ['a parabola', 'the U-shaped curve of a quadratic'],
        ['a root', 'a value where a function equals zero'],
        ['the discriminant', 'the part of the quadratic formula that tells you how many roots there are'],
        ['the quadratic formula', 'the formula giving the roots of ax² + bx + c = 0'],
        ['completing the square', 'rewriting a quadratic to reveal its turning point'],
        ['simultaneous equations', 'two equations solved together for two unknowns'],
        ['elimination', 'solving simultaneous equations by removing one variable'],
        ['a turning point', 'the maximum or minimum of a curve'],
        ['parallel lines', 'lines with the same gradient'],
        ['perpendicular lines', 'lines whose gradients multiply to −1'],
        ['an inequality', 'a statement comparing two expressions with < or >'],
        ['a region', 'the set of points on a graph satisfying an inequality'],
        ['the point of intersection', 'the point where two graphs meet, which solves them simultaneously'],
        ['a cubic', 'a function whose highest power is three']
      ],
      truths: [
        'The gradient of a line is the change in y divided by the change in x.',
        'Parallel lines have equal gradients; perpendicular gradients multiply to −1.',
        'The point where two lines cross is the solution of the two equations together.',
        'A quadratic can have two roots, one root, or none, according to the discriminant.',
        'Whatever you do to one side of an equation you must do to the other.',
        'A negative coefficient of x² gives a parabola that opens downwards.'
      ],
      myths: [
        'The gradient of a line is the change in x over the change in y.',
        'Every quadratic equation has two different real solutions.',
        'Perpendicular lines have gradients that add to zero.',
        'A steeper line always has a larger y-intercept.',
        'You can add a number to one side of an equation without touching the other.',
        'The graph of y = x² is a straight line because x is squared evenly.'
      ],
      applications: [
        ['A line rises 6 for every 2 across. What is 3?', 'the gradient'],
        ['Two lines cross at (2, 5). What does that point represent?', 'the point of intersection'],
        ['b² − 4ac is negative, so the curve never touches the x-axis. What was calculated?', 'the discriminant'],
        ['Adding two equations removes y entirely. Which method is this?', 'elimination'],
        ['A quadratic is written as (x − 3)² − 4 to find its minimum. What was done?', 'completing the square']
      ]
    },
    {
      name: 'Sequences and Functions', from: 'Grade 7', to: 'College',
      facts: [
        ['a sequence', 'an ordered list of numbers following a rule'],
        ['a term', 'one number in a sequence'],
        ['the common difference', 'the constant gap between terms of an arithmetic sequence'],
        ['an arithmetic sequence', 'a sequence with a constant difference between terms'],
        ['a geometric sequence', 'a sequence with a constant ratio between terms'],
        ['the common ratio', 'the constant multiplier of a geometric sequence'],
        ['the nth term', 'the rule giving any term from its position'],
        ['a term-to-term rule', 'the rule getting from one term to the next'],
        ['a position-to-term rule', 'the rule getting from a position number straight to the term'],
        ['a triangular number', 'a number in the sequence 1, 3, 6, 10, …'],
        ['a Fibonacci sequence', 'a sequence where each term is the sum of the two before it'],
        ['a function', 'a rule assigning exactly one output to each input'],
        ['the domain', 'the set of allowed inputs of a function'],
        ['the range', 'the set of outputs a function produces'],
        ['an inverse function', 'the function that undoes another'],
        ['a composite function', 'the result of applying one function then another'],
        ['a linear sequence', 'a sequence whose nth term is a linear expression'],
        ['a quadratic sequence', 'a sequence whose second differences are constant'],
        ['exponential growth', 'growth by a constant multiplier each step'],
        ['a limit', 'the value a sequence or function approaches']
      ],
      truths: [
        'An arithmetic sequence has a constant difference; a geometric one has a constant ratio.',
        'A quadratic sequence has constant second differences, not constant first differences.',
        'A function assigns exactly one output to each input.',
        'The nth term rule lets you find the 100th term without listing the first 99.',
        'Exponential growth eventually outgrows any linear growth.',
        'An inverse function reverses the effect of the original.'
      ],
      myths: [
        'Every sequence that increases is arithmetic.',
        'A quadratic sequence has a constant first difference.',
        'A function can give two different outputs for the same input.',
        'To find the 50th term you must write out all the previous terms.',
        'Linear growth catches up with exponential growth eventually.',
        'The Fibonacci sequence has a common difference.'
      ],
      applications: [
        ['2, 5, 8, 11 rises by 3 each time. What is 3?', 'the common difference'],
        ['3, 6, 12, 24 doubles each time. What is 2?', 'the common ratio'],
        ['A rule 4n − 1 gives any term directly from its position. What kind of rule is it?', 'a position-to-term rule'],
        ['A sequence has second differences all equal to 2. What kind of sequence is it?', 'a quadratic sequence'],
        ['A population multiplies by 1.05 every year. What kind of growth is this?', 'exponential growth']
      ]
    }
  ],

  geometry: [
    {
      name: 'Angles and Angle Rules', from: 'Grade 5', to: 'Grade 11',
      figures: ['parallel-lines', 'triangle'],
      facts: [
        ['an acute angle', 'an angle less than 90°'],
        ['a right angle', 'an angle of exactly 90°'],
        ['an obtuse angle', 'an angle between 90° and 180°'],
        ['a reflex angle', 'an angle greater than 180°'],
        ['angles on a straight line', 'the angles that add to 180°'],
        ['angles at a point', 'the angles that add to 360°'],
        ['vertically opposite angles', 'the equal angles formed opposite each other where two lines cross'],
        ['corresponding angles', 'the equal angles in matching positions on parallel lines'],
        ['alternate angles', 'the equal angles on opposite sides of a transversal between parallel lines'],
        ['co-interior angles', 'the angles between parallel lines on the same side, adding to 180°'],
        ['a transversal', 'a line crossing two or more other lines'],
        ['parallel lines', 'lines that never meet and stay the same distance apart'],
        ['perpendicular lines', 'lines meeting at a right angle'],
        ['the interior angle sum of a triangle', '180°'],
        ['the interior angle sum of a quadrilateral', '360°'],
        ['an exterior angle', 'the angle between a side and the extension of the next side'],
        ['a polygon', 'a closed shape with straight sides'],
        ['a regular polygon', 'a polygon with all sides and all angles equal'],
        ['bearing', 'a direction measured clockwise from north in three figures'],
        ['the bisector', 'the line that cuts an angle exactly in half']
      ],
      truths: [
        'The angles in any triangle add to 180°.',
        'The exterior angles of any polygon add to 360°, however many sides it has.',
        'Alternate angles on parallel lines are equal; co-interior angles add to 180°.',
        'Vertically opposite angles are always equal.',
        'A bearing is always written with three figures, so due east is 090°.',
        'An exterior angle of a triangle equals the sum of the two opposite interior angles.'
      ],
      myths: [
        'The angles in a triangle add to 360°.',
        'Co-interior angles on parallel lines are equal.',
        'The interior angles of every polygon add to 360°.',
        'A bearing can be written with one or two figures.',
        'Angles look equal on a diagram, so they are equal.',
        'A reflex angle is any angle bigger than a right angle.'
      ],
      applications: [
        ['Two angles sit opposite each other where two lines cross and are equal. What are they?', 'vertically opposite angles'],
        ['Two angles between parallel lines on the same side add to 180°. What are they?', 'co-interior angles'],
        ['A shape has all sides and angles equal. What kind of polygon is it?', 'a regular polygon'],
        ['A direction is given as 135°, measured clockwise from north. What is this?', 'bearing'],
        ['Two angles on a straight line are 110° and x. Which rule finds x?', 'angles on a straight line']
      ]
    },
    {
      name: 'Triangles, Congruence and Similarity', from: 'Grade 7', to: 'College',
      figures: ['triangle', 'right-triangle'],
      facts: [
        ['an equilateral triangle', 'a triangle with three equal sides and three 60° angles'],
        ['an isosceles triangle', 'a triangle with two equal sides and two equal angles'],
        ['a scalene triangle', 'a triangle with no equal sides'],
        ['a right-angled triangle', 'a triangle containing a 90° angle'],
        ['the hypotenuse', 'the longest side of a right-angled triangle, opposite the right angle'],
        ['congruent shapes', 'shapes identical in size and shape'],
        ['similar shapes', 'shapes of the same shape but different size'],
        ['the scale factor', 'the number every length is multiplied by in an enlargement'],
        ['SSS', 'the congruence condition of three equal sides'],
        ['SAS', 'the congruence condition of two sides and the angle between them'],
        ['ASA', 'the congruence condition of two angles and the side between them'],
        ['RHS', 'the congruence condition of a right angle, hypotenuse and one side'],
        ['Pythagoras’ theorem', 'the rule a² + b² = c² for a right-angled triangle'],
        ['the vertex', 'a corner of a shape'],
        ['the base', 'the side a triangle’s height is measured from'],
        ['the perpendicular height', 'the height measured at right angles to the base'],
        ['the area of a triangle', 'half the base times the perpendicular height'],
        ['the perimeter', 'the total distance around a shape'],
        ['an included angle', 'the angle between two named sides'],
        ['a bisector', 'a line cutting a side or an angle in half']
      ],
      truths: [
        'Pythagoras’ theorem applies only to right-angled triangles.',
        'Congruent shapes are the same size; similar shapes need not be.',
        'The hypotenuse is always the longest side of a right-angled triangle.',
        'The area of a triangle uses the perpendicular height, not the slant side.',
        'Two triangles with three equal angles are similar but not necessarily congruent.',
        'An isosceles triangle has two equal angles as well as two equal sides.'
      ],
      myths: [
        'Pythagoras’ theorem works in any triangle.',
        'Similar shapes are the same size.',
        'The area of a triangle is base times the sloping side, halved.',
        'Three equal angles prove two triangles are congruent.',
        'The hypotenuse is whichever side is drawn at the bottom.',
        'Every triangle with two equal angles is equilateral.'
      ],
      applications: [
        ['A triangle has sides 3, 4 and 5. Which theorem confirms the right angle?', 'Pythagoras’ theorem'],
        ['Two shapes have the same angles and one is twice the size. What are they?', 'similar shapes'],
        ['A triangle is drawn with a base of 10 and a height of 6 at right angles to it. Which formula applies?', 'the area of a triangle'],
        ['Two triangles share three equal sides. Which condition proves congruence?', 'SSS'],
        ['A photograph is enlarged so every length triples. What is 3?', 'the scale factor']
      ]
    },
    {
      name: 'Circles: Parts, Area and Theorems', from: 'Grade 7', to: 'College',
      figures: ['circle'],
      facts: [
        ['the radius', 'the distance from the centre to the edge'],
        ['the diameter', 'the distance across a circle through the centre'],
        ['the circumference', 'the distance around a circle'],
        ['a chord', 'a straight line joining two points on the circle'],
        ['a tangent', 'a line touching a circle at exactly one point'],
        ['an arc', 'part of the circumference'],
        ['a sector', 'the region between two radii and an arc'],
        ['a segment', 'the region between a chord and an arc'],
        ['π', 'the ratio of a circle’s circumference to its diameter'],
        ['the area of a circle', 'πr²'],
        ['the circumference formula', '2πr, or πd'],
        ['a semicircle', 'half a circle'],
        ['the centre', 'the point equidistant from every point on the circle'],
        ['a concentric circle', 'a circle sharing the same centre as another'],
        ['the angle in a semicircle', 'the 90° angle formed by a diameter and a point on the circle'],
        ['the tangent–radius property', 'the fact that a tangent meets the radius at 90°'],
        ['an arc length', 'the fraction of the circumference an angle cuts off'],
        ['a sector area', 'the fraction of the circle’s area an angle cuts off']
      ],
      truths: [
        'The diameter is twice the radius.',
        'A tangent meets the radius at a right angle at the point of contact.',
        'The angle in a semicircle is always 90°.',
        'The area of a circle is πr², not 2πr.',
        'π is the same for every circle, whatever its size.',
        'A chord that passes through the centre is a diameter.'
      ],
      myths: [
        'The area of a circle is 2πr.',
        'The radius is twice the diameter.',
        'A tangent crosses the circle at two points.',
        'π is exactly 3.14.',
        'A larger circle has a larger value of π.',
        'The circumference of a circle is πr².'
      ],
      applications: [
        ['A line touches the circle once and meets the radius at 90°. What is it?', 'a tangent'],
        ['A slice of a circle bounded by two radii is shaded. What is it?', 'a sector'],
        ['A triangle drawn from the ends of a diameter to the edge has a right angle. Which fact is this?', 'the angle in a semicircle'],
        ['A circle has radius 5 and its area is needed. Which formula applies?', 'the area of a circle'],
        ['The distance around a circular pond is measured. What is being found?', 'the circumference']
      ]
    },
    {
      name: 'Area, Surface Area and Volume', from: 'Grade 6', to: 'College',
      figures: ['cube', 'circle', 'triangle'],
      facts: [
        ['area', 'the space inside a two-dimensional shape'],
        ['perimeter', 'the distance around a two-dimensional shape'],
        ['volume', 'the space inside a three-dimensional solid'],
        ['surface area', 'the total area of every face of a solid'],
        ['a face', 'a flat surface of a solid'],
        ['an edge', 'the line where two faces meet'],
        ['a vertex', 'the point where edges meet'],
        ['a prism', 'a solid with the same cross-section along its length'],
        ['a cross-section', 'the shape revealed by a straight cut through a solid'],
        ['a cylinder', 'a prism with a circular cross-section'],
        ['a net', 'the flat pattern that folds into a solid'],
        ['a cuboid', 'a box-shaped solid with six rectangular faces'],
        ['a pyramid', 'a solid with a base and triangular faces meeting at a point'],
        ['a sphere', 'a solid whose every surface point is the same distance from the centre'],
        ['the volume of a prism', 'the cross-sectional area times the length'],
        ['a compound shape', 'a shape made by joining simpler shapes'],
        ['a square unit', 'the unit of area, such as cm²'],
        ['a cubic unit', 'the unit of volume, such as cm³'],
        ['a trapezium', 'a quadrilateral with one pair of parallel sides'],
        ['a parallelogram', 'a quadrilateral with two pairs of parallel sides']
      ],
      truths: [
        'The volume of any prism is its cross-sectional area times its length.',
        'Area is measured in square units and volume in cubic units.',
        'Doubling every length of a solid multiplies its volume by eight.',
        'Two shapes can have the same perimeter and different areas.',
        'The surface area of a solid is found by adding the areas of its faces.',
        'A cylinder is a prism, because its cross-section is the same all the way along.'
      ],
      myths: [
        'Shapes with the same perimeter must have the same area.',
        'Doubling every length of a cube doubles its volume.',
        'Volume is measured in square units.',
        'A cylinder is not a prism because its faces are curved.',
        'The area of a parallelogram is base times slant side.',
        'Surface area and volume are measured in the same units.'
      ],
      applications: [
        ['A tin of soup has the same circular cross-section all the way up. Which formula applies?', 'the volume of a prism'],
        ['A shape is cut into a rectangle and a triangle to find its area. What kind of shape is it?', 'a compound shape'],
        ['A flat pattern of six squares folds into a cube. What is it?', 'a net'],
        ['The total area of a cuboid’s six faces is needed. What is being found?', 'surface area'],
        ['A cube’s side is doubled and its capacity increases eight times. Which quantity changed?', 'volume']
      ]
    },
    {
      name: 'Transformations and Coordinates', from: 'Grade 6', to: 'Grade 12',
      facts: [
        ['a translation', 'a movement of a shape without turning or reflecting it'],
        ['a reflection', 'a mirror image of a shape across a line'],
        ['a rotation', 'a turn of a shape about a fixed point'],
        ['an enlargement', 'a change of size by a scale factor from a centre'],
        ['the centre of rotation', 'the fixed point a shape turns about'],
        ['the centre of enlargement', 'the point an enlargement is measured from'],
        ['the mirror line', 'the line a shape is reflected across'],
        ['a vector', 'the pair of numbers describing a translation'],
        ['a coordinate', 'a pair of numbers fixing a point on a grid'],
        ['the x-axis', 'the horizontal axis of a coordinate grid'],
        ['the y-axis', 'the vertical axis of a coordinate grid'],
        ['the origin', 'the point (0, 0) where the axes cross'],
        ['a quadrant', 'one of the four regions of a coordinate grid'],
        ['the midpoint', 'the point exactly halfway between two others'],
        ['line symmetry', 'the property of matching either side of a mirror line'],
        ['rotational symmetry', 'the property of looking the same more than once in a full turn'],
        ['the order of rotational symmetry', 'how many times a shape matches itself in one full turn'],
        ['a congruent image', 'the result of a translation, reflection or rotation, which is the same size'],
        ['a negative scale factor', 'an enlargement that also turns the shape through 180°'],
        ['invariant', 'describing a point that does not move under a transformation']
      ],
      truths: [
        'Translations, reflections and rotations produce congruent images; enlargements do not.',
        'A coordinate is written with x first, then y.',
        'A shape with rotational symmetry of order 1 has no rotational symmetry in practice.',
        'An enlargement with a scale factor between 0 and 1 makes a shape smaller.',
        'The centre of rotation is the only point that does not move under a rotation.',
        'A negative scale factor turns the image upside down as well as changing its size.'
      ],
      myths: [
        'An enlargement always makes a shape bigger.',
        'A coordinate is written with y first.',
        'Reflections change the size of a shape.',
        'Every point moves under a rotation.',
        'A shape with four lines of symmetry must be a square — no other shape has four.',
        'A translation can turn a shape as well as move it.'
      ],
      applications: [
        ['A shape slides three right and two up without turning. What transformation is this?', 'a translation'],
        ['A shape is turned 90° about a fixed point. What is that point called?', 'the centre of rotation'],
        ['A shape is enlarged by scale factor 1/2. What happens to it?', 'an enlargement'],
        ['A point stays exactly where it is throughout a transformation. What is it?', 'invariant'],
        ['A square looks identical four times in one full turn. What is 4?', 'the order of rotational symmetry']
      ]
    },
    {
      name: 'Trigonometry', from: 'Grade 9', to: 'College',
      figures: ['right-triangle', 'triangle'],
      facts: [
        ['sine', 'the ratio of the opposite side to the hypotenuse'],
        ['cosine', 'the ratio of the adjacent side to the hypotenuse'],
        ['tangent', 'the ratio of the opposite side to the adjacent side'],
        ['the opposite side', 'the side across from the angle being used'],
        ['the adjacent side', 'the side next to the angle, other than the hypotenuse'],
        ['the hypotenuse', 'the longest side, opposite the right angle'],
        ['SOHCAHTOA', 'the mnemonic for the three ratios'],
        ['an angle of elevation', 'the angle looking up from the horizontal'],
        ['an angle of depression', 'the angle looking down from the horizontal'],
        ['the sine rule', 'the rule relating sides to the sines of opposite angles in any triangle'],
        ['the cosine rule', 'the rule for a side or angle in a triangle with no right angle'],
        ['an inverse trigonometric function', 'the function that gives the angle from a ratio'],
        ['an exact value', 'a trigonometric value written as a surd or fraction rather than a decimal'],
        ['a radian', 'the angle unit for which a full turn is 2π'],
        ['a periodic function', 'a function repeating at regular intervals'],
        ['the amplitude of a sine curve', 'the maximum height above the centre line'],
        ['a bearing', 'a direction measured clockwise from north'],
        ['the area of a triangle using sine', 'half ab sin C']
      ],
      truths: [
        'Sine, cosine and tangent are ratios, so they have no units.',
        'The sine and cosine rules work in any triangle; SOHCAHTOA needs a right angle.',
        'An angle of elevation and the corresponding angle of depression are equal.',
        'The inverse function is used to find the angle when the ratio is known.',
        'sin 30° is exactly 1/2.',
        'A full turn is 2π radians.'
      ],
      myths: [
        'SOHCAHTOA works in any triangle.',
        'Sine and cosine are measured in degrees.',
        'The hypotenuse is the side opposite the angle you are using.',
        'The sine rule needs a right angle.',
        'An angle of elevation is always larger than the angle of depression.',
        'tan 90° is a very large finite number.'
      ],
      applications: [
        ['The opposite and hypotenuse are known and the angle is wanted. Which ratio applies?', 'sine'],
        ['A triangle has no right angle and two sides with the angle between them. Which rule applies?', 'the cosine rule'],
        ['Someone looks up at the top of a tower from the ground. Which angle is measured?', 'an angle of elevation'],
        ['A ratio of 0.5 needs converting back to an angle. What is used?', 'an inverse trigonometric function'],
        ['The area of a triangle is found from two sides and the angle between. Which formula applies?', 'the area of a triangle using sine']
      ]
    }
  ],

  statistics: [
    {
      name: 'Averages, Spread and Charts', from: 'Grade 5', to: 'College',
      facts: [
        ['the mean', 'the total divided by how many values there are'],
        ['the median', 'the middle value when the data is put in order'],
        ['the mode', 'the value that occurs most often'],
        ['the range', 'the difference between the largest and smallest values'],
        ['an outlier', 'a value far away from the rest of the data'],
        ['the interquartile range', 'the spread of the middle half of the data'],
        ['a quartile', 'a value splitting ordered data into quarters'],
        ['discrete data', 'data that can only take particular values, usually counts'],
        ['continuous data', 'data that can take any value in a range, usually measurements'],
        ['a frequency table', 'a table recording how often each value occurs'],
        ['a bar chart', 'the chart with separated bars, used for categories'],
        ['a histogram', 'the chart with touching bars, used for continuous grouped data'],
        ['a pie chart', 'the chart showing proportions as sectors of a circle'],
        ['a scatter graph', 'the graph plotting two variables against each other'],
        ['correlation', 'the tendency of two variables to change together'],
        ['a line of best fit', 'the straight line drawn through the trend of a scatter graph'],
        ['a population', 'the whole group being studied'],
        ['a sample', 'a smaller group chosen to represent the population'],
        ['bias', 'a systematic error making a sample unrepresentative'],
        ['a box plot', 'the diagram showing median, quartiles and extremes']
      ],
      truths: [
        'The mean is affected by outliers; the median is not.',
        'A bar chart has gaps between bars; a histogram does not.',
        'Correlation does not prove that one variable causes the other.',
        'The mode is the only average that can be used for non-numerical data.',
        'The range uses only two values, so it says nothing about the middle of the data.',
        'A larger sample is not automatically representative if the way it was chosen is biased.'
      ],
      myths: [
        'The mean is always the best average to use.',
        'A strong correlation proves that one variable causes the other.',
        'Bar charts and histograms are the same thing.',
        'The median is affected by extreme values as much as the mean.',
        'A bigger sample removes bias.',
        'Every data set has exactly one mode.'
      ],
      applications: [
        ['One salary of £2m sits among nine of £20k. Which average is misleading?', 'the mean'],
        ['Ice cream sales and drownings rise together in summer. What does this show — and not show?', 'correlation'],
        ['Data is grouped into continuous intervals and drawn with touching bars. Which chart is it?', 'a histogram'],
        ['A survey conducted only outside a gym asks about exercise habits. What is the problem?', 'bias'],
        ['The middle half of the data is described, ignoring the extremes. What measure is this?', 'the interquartile range']
      ]
    },
    {
      name: 'Probability', from: 'Grade 5', to: 'College',
      facts: [
        ['probability', 'a measure of how likely an event is, from 0 to 1'],
        ['an outcome', 'one possible result of a trial'],
        ['an event', 'a set of outcomes being considered'],
        ['the sample space', 'the set of all possible outcomes'],
        ['a fair die', 'a die where every face is equally likely'],
        ['mutually exclusive events', 'events that cannot both happen'],
        ['independent events', 'events where one does not affect the probability of the other'],
        ['relative frequency', 'the proportion of trials in which an event happened'],
        ['a theoretical probability', 'a probability worked out from the structure of the situation'],
        ['an experimental probability', 'a probability estimated by repeating a trial'],
        ['a tree diagram', 'the diagram showing successive events and their probabilities'],
        ['the complement', 'the event of something not happening'],
        ['conditional probability', 'the probability of one event given that another has happened'],
        ['expected frequency', 'the number of times an event is expected in a set number of trials'],
        ['a Venn diagram', 'the diagram showing overlapping sets of outcomes'],
        ['exhaustive events', 'events that between them cover every outcome'],
        ['a biased spinner', 'a spinner whose outcomes are not equally likely'],
        ['replacement', 'putting an item back before the next selection']
      ],
      truths: [
        'The probabilities of all possible outcomes add to 1.',
        'A probability can never be greater than 1 or less than 0.',
        'A coin has no memory: after five heads, the next toss is still even.',
        'Relative frequency gets closer to the theoretical probability as the number of trials increases.',
        'For independent events, multiply the probabilities to find the chance of both.',
        'Removing an item without replacement changes the probabilities for the next selection.'
      ],
      myths: [
        'After five heads in a row, tails is more likely on the next toss.',
        'A probability of 1.5 means something is very likely indeed.',
        'Two events that can both happen are mutually exclusive.',
        'Experimental and theoretical probability must be identical.',
        'Selecting without replacement leaves the probabilities unchanged.',
        'Every event has probability 1/2 because it either happens or it does not.'
      ],
      applications: [
        ['A bag has 3 red and 7 blue counters and one is drawn. What is the set of all possible results called?', 'the sample space'],
        ['A counter is drawn and not put back, changing the next chance. What is missing?', 'replacement'],
        ['A spinner lands on red far more often than a fair spinner would. What is it?', 'a biased spinner'],
        ['The chance of rain given that the sky is already cloudy is wanted. What kind of probability is this?', 'conditional probability'],
        ['A die is rolled 60 times and a six is expected about 10 times. What was calculated?', 'expected frequency']
      ]
    }
  ],

  calculus: [
    {
      name: 'Limits, Derivatives and Integrals', from: 'Grade 11', to: 'College',
      facts: [
        ['a limit', 'the value a function approaches as the input approaches something'],
        ['a derivative', 'the rate of change of a function'],
        ['differentiation', 'the process of finding a derivative'],
        ['the gradient of a curve', 'the gradient of the tangent at a point'],
        ['a tangent', 'the line touching a curve at one point with the same gradient'],
        ['a stationary point', 'a point where the derivative is zero'],
        ['a maximum', 'a stationary point where the curve turns from rising to falling'],
        ['a minimum', 'a stationary point where the curve turns from falling to rising'],
        ['the second derivative', 'the derivative of the derivative, showing how the gradient changes'],
        ['a point of inflection', 'a point where the curve changes which way it bends'],
        ['integration', 'the reverse of differentiation'],
        ['an indefinite integral', 'an integral with no limits, needing a constant of integration'],
        ['a definite integral', 'an integral between two values, giving a number'],
        ['the constant of integration', 'the +c added because differentiation loses constants'],
        ['the area under a curve', 'what a definite integral calculates'],
        ['the chain rule', 'the rule for differentiating a function of a function'],
        ['the product rule', 'the rule for differentiating two functions multiplied together'],
        ['the quotient rule', 'the rule for differentiating one function divided by another'],
        ['a rate of change', 'how quickly one quantity changes with respect to another'],
        ['velocity', 'the derivative of displacement with respect to time'],
        ['acceleration', 'the derivative of velocity with respect to time']
      ],
      truths: [
        'The derivative gives the gradient of the tangent at a point, not the gradient of a chord.',
        'A stationary point has a derivative of zero, but need not be a maximum or minimum.',
        'Integration reverses differentiation, which is why an indefinite integral needs +c.',
        'A definite integral gives a number; an indefinite one gives a family of functions.',
        'If the second derivative is positive at a stationary point, that point is a minimum.',
        'Velocity is the derivative of displacement and acceleration the derivative of velocity.'
      ],
      myths: [
        'Every point where the derivative is zero is a maximum or a minimum.',
        'The derivative gives the value of the function at a point.',
        'The constant of integration can be ignored in an indefinite integral.',
        'A positive second derivative at a stationary point means a maximum.',
        'Integration and differentiation are unrelated operations.',
        'The area under a curve is always positive.'
      ],
      applications: [
        ['The gradient of a curve at a single point is wanted. What is calculated?', 'a derivative'],
        ['A curve has zero gradient and the second derivative is positive there. What kind of point is it?', 'a minimum'],
        ['The area between a curve and the x-axis from 1 to 4 is required. What is used?', 'a definite integral'],
        ['A function of a function is differentiated. Which rule applies?', 'the chain rule'],
        ['Displacement is differentiated with respect to time. What is obtained?', 'velocity']
      ]
    }
  ]
};
