/* Drill sheets: solve it and write the answer.

   Everything else in the library asks a learner to recognise, match, judge or
   explain. None of that is what a teacher means by "twenty subtractions for
   Tuesday". A drill sheet is a column of operations and a space to write in,
   and it is the single most printed kind of maths worksheet there is.

   So these generators produce nothing but computation. Every maker returns a
   `math` or `blank` question: an expression, and the answer. No options to
   rule out, no statements to judge, no reading.

   Two rules hold throughout.

   The answer is computed from the same numbers that render the question, never
   written alongside them. A drill sheet whose key disagrees with its own
   questions is worse than no sheet, because the mistake is invisible until it
   is marked, and `tools/check-drill.mjs` re-evaluates every expression
   independently to prove they agree.

   And the numbers are chosen so the answer is the kind a learner is expected
   to write: divisions come out exact, subtractions stay positive where the
   level says they should, and a fraction is reduced before it is asked for. */

import {
  int, pick, mathQ, blankQ, gcd, simplify, frac, num, money,
  WORK_WAYS, ADD_WAYS, SUB_WAYS, MUL_WAYS, DIV_WAYS,
  SOLVE_WAYS, SIMPLIFY_WAYS, EVAL_WAYS, SIMPLEST_WAYS,
  PEOPLE, THINGS, HOLDERS
} from './gen-core.js';

/* An instruction, kept to a small vocabulary on purpose: these strings appear
   on hundreds of thousands of sheets, so every one of them is worth
   translating, and a dozen is a translatable set where fifty is not. */

/* A minus sign, not a hyphen. Marking treats the two as equal, so this is only
   about how the sheet reads — which is reason enough. */
const sn = v => String(v).replace('-', '−');

/* The shared instruction phrasings and everyday nouns live in gen-core.js,
   because gen-math.js needs exactly the same ones and two copies would drift. */

/* ============================== ADDITION ============================== */
export const addition = [
  (r) => { const a = int(r, 1, 9), b = int(r, 1, 9);
    return mathQ(pick(r, ADD_WAYS), `${a} + ${b} = ?`, a + b,
      { hint: 'Count on from the larger number.', explanation: `${a} + ${b} = ${a + b}.` }); },

  (r) => { const a = int(r, 10, 49), b = int(r, 10, 49);
    return mathQ(pick(r, ADD_WAYS), `${a} + ${b} = ?`, a + b,
      { hint: 'Add the tens, then the ones.', explanation: `${a} + ${b} = ${a + b}.` }); },

  /* Deliberately crossing ten, which is the step that actually needs teaching. */
  (r) => { const a = int(r, 2, 9), b = int(r, 11 - a, 9);
    return mathQ(pick(r, ADD_WAYS), `${a} + ${b} = ?`, a + b,
      { hint: 'Make ten first, then add what is left.',
        explanation: `${a} + ${b} = ${a + b}. Bridging ten: ${a} + ${10 - a} = 10, then + ${b - (10 - a)}.` }); },

  (r) => { const a = int(r, 100, 899), b = int(r, 100, 899);
    return mathQ(pick(r, ADD_WAYS), `${a} + ${b} = ?`, a + b,
      { hint: 'Line up the columns and carry where a column passes nine.',
        explanation: `${a} + ${b} = ${a + b}.` }); },

  (r) => { const a = int(r, 3, 9), b = int(r, 3, 9), c = int(r, 3, 9);
    return mathQ(pick(r, ADD_WAYS), `${a} + ${b} + ${c} = ?`, a + b + c,
      { hint: 'Look for a pair that makes ten and add that pair first.',
        explanation: `${a} + ${b} + ${c} = ${a + b + c}.` }); },

  (r) => { const a = int(r, 1000, 8999), b = int(r, 1000, 8999);
    return mathQ(pick(r, ADD_WAYS), `${a} + ${b} = ?`, a + b,
      { hint: 'Ones, tens, hundreds, thousands — one column at a time.',
        explanation: `${a} + ${b} = ${a + b}.` }); },

  /* A missing addend: the same fact, asked backwards. */
  (r) => { const a = int(r, 2, 9), total = a + int(r, 2, 9);
    return mathQ('Find the missing number.', `${a} + ? = ${total}`, total - a,
      { hint: 'What has to be added to get there? Subtract to find out.',
        explanation: `${total} − ${a} = ${total - a}.` }); },

  (r) => { const a = int(r, 20, 89), b = int(r, 20, 89), total = a + b;
    return mathQ('Find the missing number.', `? + ${b} = ${total}`, a,
      { hint: 'Subtract the number you know from the total.',
        explanation: `${total} − ${b} = ${a}.` }); },

  (r) => { const a = int(r, 11, 49) * 10, b = int(r, 11, 49) * 10;
    return mathQ(pick(r, ADD_WAYS), `${a} + ${b} = ?`, a + b,
      { hint: 'Both end in zero, so add the tens and put the zero back.',
        explanation: `${a} + ${b} = ${a + b}.` }); },

  (r) => { const a = int(r, 10000, 89999), b = int(r, 10000, 89999);
    return mathQ(pick(r, ADD_WAYS), `${a} + ${b} = ?`, a + b,
      { hint: 'Column addition. Keep the digits in line and carry as you go.',
        explanation: `${a} + ${b} = ${a + b}.` }); },

  /* Word-framed, but still one operation and one number to write. Two lists
     of everyday nouns turn one maker into a few hundred openings. */
  (r) => { const a = int(r, 11, 89), b = int(r, 11, 89), thing = pick(r, THINGS), who = pick(r, PEOPLE);
    return blankQ(`${who} has ${a} ${thing} and is given ${b} more. How many ${thing} are there now?`, a + b,
      { hint: 'Put the two amounts together.', explanation: `${a} + ${b} = ${a + b}.` }); },

  (r) => { const a = int(r, 21, 79);
    return mathQ('Complete the number bond to 100.', `${a} + ? = 100`, 100 - a,
      { hint: 'Count on to the next ten, then on to 100.',
        explanation: `${a} + ${100 - a} = 100.` }); },

  (r) => { const a = int(r, 11, 49), b = int(r, 11, 49), c = int(r, 11, 49);
    return mathQ(pick(r, ADD_WAYS), `${a} + ${b} + ${c} = ?`, a + b + c,
      { hint: 'Add the first two, then bring in the third.',
        explanation: `${a} + ${b} = ${a + b}, and ${a + b} + ${c} = ${a + b + c}.` }); },

  (r) => { const a = int(r, 12, 60), near = r() < 0.5;
    return blankQ(near ? `What is ${a} + ${a + 1}?` : `Double ${a}.`, near ? a + a + 1 : a + a,
      { hint: near ? 'Double it, then add one more.' : 'Add the number to itself.',
        explanation: near ? `${a} + ${a} = ${a + a}, and one more is ${a + a + 1}.` : `${a} + ${a} = ${a + a}.` }); },

  (r) => { const a = int(r, 5, 40), b = int(r, 5, 40), c = int(r, 5, 40), d = int(r, 5, 40);
    return mathQ(pick(r, ADD_WAYS), `${a} + ${b} + ${c} + ${d} = ?`, a + b + c + d,
      { hint: 'Look for a pair that makes a round number and add those two first.',
        explanation: `The total is ${a + b + c + d}.` }); },

  (r) => { const a = int(r, 20, 400), b = int(r, 6, 90);
    return blankQ(`What is ${b} more than ${a}?`, a + b,
      { hint: '"More than" means add.', explanation: `${a} + ${b} = ${a + b}.` }); }
];

/* ============================= SUBTRACTION ============================= */
export const subtraction = [
  (r) => { const b = int(r, 1, 9), a = b + int(r, 0, 9 - b);
    return mathQ(pick(r, SUB_WAYS), `${a} − ${b} = ?`, a - b,
      { hint: 'Count back from the first number.', explanation: `${a} − ${b} = ${a - b}.` }); },

  (r) => { const b = int(r, 10, 40), a = b + int(r, 5, 55);
    return mathQ(pick(r, SUB_WAYS), `${a} − ${b} = ?`, a - b,
      { hint: 'Take away the tens, then the ones.', explanation: `${a} − ${b} = ${a - b}.` }); },

  /* Forced to need an exchange: the ones digit of the smaller number is bigger. */
  (r) => { const ao = int(r, 0, 4), bo = int(r, ao + 1, 9);
    const a = int(r, 3, 9) * 10 + ao, b = int(r, 1, 2) * 10 + bo;
    return mathQ(pick(r, SUB_WAYS), `${a} − ${b} = ?`, a - b,
      { hint: 'The ones will not go — exchange a ten first.',
        explanation: `${a} − ${b} = ${a - b}.` }); },

  (r) => { const b = int(r, 100, 400), a = b + int(r, 50, 499);
    return mathQ(pick(r, SUB_WAYS), `${a} − ${b} = ?`, a - b,
      { hint: 'Line up the columns and exchange wherever the top digit is smaller.',
        explanation: `${a} − ${b} = ${a - b}.` }); },

  /* Subtracting from a power of ten, where every column needs an exchange. */
  (r) => { const a = pick(r, [100, 200, 500, 1000]), b = int(r, 11, a - 11);
    return mathQ(pick(r, SUB_WAYS), `${a} − ${b} = ?`, a - b,
      { hint: 'Every column needs an exchange. Counting up from the smaller number is quicker.',
        explanation: `${a} − ${b} = ${a - b}.` }); },

  (r) => { const b = int(r, 1000, 4000), a = b + int(r, 500, 4999);
    return mathQ(pick(r, SUB_WAYS), `${a} − ${b} = ?`, a - b,
      { hint: 'Column subtraction, right to left.', explanation: `${a} − ${b} = ${a - b}.` }); },

  (r) => { const a = int(r, 20, 90), diff = int(r, 5, 19);
    return mathQ('Find the missing number.', `${a} − ? = ${a - diff}`, diff,
      { hint: 'The difference between the two numbers you can see.',
        explanation: `${a} − ${a - diff} = ${diff}.` }); },

  (r) => { const b = int(r, 15, 60), result = int(r, 10, 40);
    return mathQ('Find the missing number.', `? − ${b} = ${result}`, b + result,
      { hint: 'Add them back together to undo the subtraction.',
        explanation: `${result} + ${b} = ${b + result}.` }); },

  (r) => { const a = int(r, 11, 49) * 10, b = int(r, 1, 10) * 10;
    return mathQ(pick(r, SUB_WAYS), `${a} − ${b} = ?`, a - b,
      { hint: 'Both end in zero: subtract the tens and put the zero back.',
        explanation: `${a} − ${b} = ${a - b}.` }); },

  (r) => { const b = int(r, 10000, 40000), a = b + int(r, 5000, 49999);
    return mathQ(pick(r, SUB_WAYS), `${a} − ${b} = ?`, a - b,
      { hint: 'Keep the columns in line; exchange where the top digit is smaller.',
        explanation: `${a} − ${b} = ${a - b}.` }); },

  (r) => { const a = int(r, 20, 88), b = int(r, 5, a - 1), thing = pick(r, THINGS), who = pick(r, PEOPLE);
    return blankQ(`${who} had ${a} ${thing} and gave ${b} away. How many are left?`, a - b,
      { hint: 'Take the second number off the first.', explanation: `${a} − ${b} = ${a - b}.` }); },

  (r) => { const a = int(r, 12, 88);
    return mathQ('Complete the number bond to 100.', `100 − ${a} = ?`, 100 - a,
      { hint: 'Count on from the number up to 100.', explanation: `${a} + ${100 - a} = 100.` }); },

  (r) => { const b = int(r, 5, 40), c = int(r, 5, 40), a = int(r, b + c + 1, b + c + 60);
    return mathQ(pick(r, SUB_WAYS), `${a} − ${b} − ${c} = ?`, a - b - c,
      { hint: 'Take them off one at a time, left to right.',
        explanation: `${a} − ${b} = ${a - b}, and ${a - b} − ${c} = ${a - b - c}.` }); },

  (r) => { const a = int(r, 40, 300), b = int(r, 5, 39);
    return blankQ(`What is ${b} less than ${a}?`, a - b,
      { hint: '"Less than" means subtract.', explanation: `${a} − ${b} = ${a - b}.` }); },

  (r) => { const x = int(r, 20, 400), y = int(r, 20, 400);
    const hi = Math.max(x, y), lo = Math.min(x, y);
    return blankQ(`Find the difference between ${x} and ${y}.`, hi - lo,
      { hint: 'Take the smaller number from the larger one.',
        explanation: `${hi} − ${lo} = ${hi - lo}.` }); },

  (r) => { const k = pick(r, [100, 200, 500, 1000]), b = int(r, 11, k - 11);
    return mathQ(pick(r, SUB_WAYS), `${k} − ${b} = ?`, k - b,
      { hint: 'Count on from the smaller number to the round one.',
        explanation: `${k} − ${b} = ${k - b}.` }); }
];

/* ============================ TIMES TABLES ============================ */
export const timestables = [
  (r) => { const a = int(r, 2, 12), b = int(r, 2, 12);
    return mathQ(pick(r, MUL_WAYS), `${a} × ${b} = ?`, a * b,
      { hint: `Count in ${a}s, ${b} times.`, explanation: `${a} × ${b} = ${a * b}.` }); },

  (r) => { const a = pick(r, [2, 5, 10]), b = int(r, 2, 12);
    return mathQ(pick(r, MUL_WAYS), `${a} × ${b} = ?`, a * b,
      { hint: `The ${a} times table.`, explanation: `${a} × ${b} = ${a * b}.` }); },

  (r) => { const a = pick(r, [3, 4, 6, 8]), b = int(r, 2, 12);
    return mathQ(pick(r, MUL_WAYS), `${a} × ${b} = ?`, a * b,
      { hint: `The ${a} times table.`, explanation: `${a} × ${b} = ${a * b}.` }); },

  (r) => { const a = pick(r, [7, 9, 11, 12]), b = int(r, 2, 12);
    return mathQ(pick(r, MUL_WAYS), `${a} × ${b} = ?`, a * b,
      { hint: `The ${a} times table — the one worth over-learning.`,
        explanation: `${a} × ${b} = ${a * b}.` }); },

  /* The division fact from the same pair, which is what makes a table usable. */
  (r) => { const a = int(r, 2, 12), b = int(r, 2, 12);
    return mathQ(pick(r, MUL_WAYS), `${a * b} ÷ ${a} = ?`, b,
      { hint: `How many ${a}s make ${a * b}?`, explanation: `${a} × ${b} = ${a * b}, so ${a * b} ÷ ${a} = ${b}.` }); },

  (r) => { const a = int(r, 2, 12), b = int(r, 2, 12);
    return mathQ('Find the missing number.', `${a} × ? = ${a * b}`, b,
      { hint: 'Divide the answer by the number you can see.',
        explanation: `${a * b} ÷ ${a} = ${b}.` }); },

  (r) => { const a = int(r, 2, 12), b = int(r, 2, 12);
    return mathQ('Find the missing number.', `? × ${b} = ${a * b}`, a,
      { hint: 'Divide the answer by the number you can see.',
        explanation: `${a * b} ÷ ${b} = ${a}.` }); },

  (r) => { const a = int(r, 2, 9);
    return mathQ('Write the square number.', `${a} × ${a} = ?`, a * a,
      { hint: 'A number multiplied by itself.', explanation: `${a} × ${a} = ${a * a}.` }); },

  (r) => { const a = int(r, 2, 12), b = int(r, 2, 12), c = int(r, 2, 5);
    return mathQ(pick(r, MUL_WAYS), `${a} × ${b} × ${c} = ?`, a * b * c,
      { hint: 'Multiply two of them first, then multiply by the third.',
        explanation: `${a} × ${b} = ${a * b}, and ${a * b} × ${c} = ${a * b * c}.` }); },

  (r) => { const a = int(r, 2, 12), b = int(r, 2, 12);
    return mathQ(pick(r, MUL_WAYS), `${a * 10} × ${b} = ?`, a * 10 * b,
      { hint: `${a} × ${b}, then multiply by ten.`,
        explanation: `${a} × ${b} = ${a * b}, so ${a * 10} × ${b} = ${a * 10 * b}.` }); },

  (r) => { const a = int(r, 2, 12), b = int(r, 2, 12);
    return blankQ(`What is ${a} multiplied by ${b}?`, a * b,
      { hint: `Count on in ${a}s, ${b} times.`, explanation: `${a} × ${b} = ${a * b}.` }); },

  (r) => { const a = int(r, 2, 12), b = int(r, 2, 12);
    return blankQ(`What are ${b} lots of ${a}?`, a * b,
      { hint: `That is ${a} added ${b} times.`, explanation: `${a} × ${b} = ${a * b}.` }); },

  (r) => { const per = int(r, 2, 12), n = int(r, 2, 12), thing = pick(r, THINGS), holder = pick(r, HOLDERS);
    return blankQ(`There are ${n} ${holder} with ${per} ${thing} in each. How many ${thing} altogether?`,
      per * n,
      { hint: 'Multiply how many are in one by how many there are.',
        explanation: `${per} × ${n} = ${per * n}.` }); },

  (r) => { const a = int(r, 2, 12);
    return blankQ(`Count in ${a}s: ${a}, ${2 * a}, ${3 * a}, ?`, 4 * a,
      { hint: `Add another ${a}.`, explanation: `${3 * a} + ${a} = ${4 * a}.` }); },

  (r) => { const a = int(r, 2, 12), b = int(r, 2, 12);
    return blankQ(`If ${a} × ${b} = ${a * b}, what is ${a * b} ÷ ${a}?`, b,
      { hint: 'Division undoes multiplication.',
        explanation: `${a * b} ÷ ${a} = ${b}, the other number in the pair.` }); },

  (r) => { const a = pick(r, [11, 12]), b = int(r, 2, 12);
    return mathQ(pick(r, MUL_WAYS), `${a} × ${b} = ?`, a * b,
      { hint: a === 11 ? 'Ten of them, plus one more.' : 'Ten of them, plus two more.',
        explanation: `${10 * b} + ${(a - 10) * b} = ${a * b}.` }); }
];

/* =========================== MULTIPLICATION =========================== */
export const multiplication = [
  (r) => { const a = int(r, 12, 99), b = int(r, 2, 9);
    return mathQ(pick(r, MUL_WAYS), `${a} × ${b} = ?`, a * b,
      { hint: 'Multiply the ones, then the tens, and add the two results.',
        explanation: `${a} × ${b} = ${a * b}.` }); },

  (r) => { const a = int(r, 11, 99), b = int(r, 11, 99);
    return mathQ(pick(r, MUL_WAYS), `${a} × ${b} = ?`, a * b,
      { hint: 'Long multiplication: multiply by the ones, then by the tens, then add.',
        explanation: `${a} × ${b} = ${a * b}.` }); },

  (r) => { const a = int(r, 101, 999), b = int(r, 2, 9);
    return mathQ(pick(r, MUL_WAYS), `${a} × ${b} = ?`, a * b,
      { hint: 'One column at a time, carrying as you go.',
        explanation: `${a} × ${b} = ${a * b}.` }); },

  (r) => { const a = int(r, 2, 99), p = pick(r, [10, 100, 1000]);
    return mathQ(pick(r, MUL_WAYS), `${a} × ${p} = ?`, a * p,
      { hint: 'Multiplying by a power of ten shifts every digit left.',
        explanation: `${a} × ${p} = ${a * p}.` }); },

  (r) => { const a = int(r, 11, 49), b = pick(r, [20, 30, 40, 50, 60]);
    return mathQ(pick(r, MUL_WAYS), `${a} × ${b} = ?`, a * b,
      { hint: `Multiply by ${b / 10}, then by ten.`,
        explanation: `${a} × ${b / 10} = ${a * (b / 10)}, so ${a} × ${b} = ${a * b}.` }); },

  (r) => { const a = int(r, 101, 999), b = int(r, 11, 49);
    return mathQ(pick(r, MUL_WAYS), `${a} × ${b} = ?`, a * b,
      { hint: 'Long multiplication. Remember the placeholder zero on the second row.',
        explanation: `${a} × ${b} = ${a * b}.` }); },

  (r) => { const a = int(r, 3, 15), b = int(r, 3, 15), c = int(r, 2, 6);
    return mathQ(pick(r, MUL_WAYS), `${a} × ${b} × ${c} = ?`, a * b * c,
      { hint: 'Any order you like — pick the easiest pair first.',
        explanation: `${a} × ${b} = ${a * b}, and ${a * b} × ${c} = ${a * b * c}.` }); },

  (r) => { const b = int(r, 3, 12), q = int(r, 11, 60);
    return mathQ('Find the missing number.', `? × ${b} = ${b * q}`, q,
      { hint: 'Divide to undo the multiplication.',
        explanation: `${b * q} ÷ ${b} = ${q}.` }); },

  (r) => { const a = int(r, 21, 99), b = int(r, 3, 9);
    return mathQ(pick(r, MUL_WAYS), `${a} × ${b} = ?`, a * b,
      { hint: 'Split the first number into tens and ones, multiply each, then add.',
        explanation: `${Math.floor(a / 10) * 10} × ${b} = ${Math.floor(a / 10) * 10 * b}, `
          + `${a % 10} × ${b} = ${(a % 10) * b}, and together ${a * b}.` }); },

  (r) => { const a = int(r, 11, 30);
    return mathQ('Write the square number.', `${a}² = ?`, a * a,
      { hint: 'The number multiplied by itself.', explanation: `${a} × ${a} = ${a * a}.` }); },

  (r) => { const per = int(r, 3, 12), rows = int(r, 3, 12), thing = pick(r, THINGS);
    return blankQ(`${rows} rows of ${per} ${thing}. How many altogether?`, per * rows,
      { hint: 'Multiply the number in a row by the number of rows.',
        explanation: `${per} × ${rows} = ${per * rows}.` }); },

  (r) => { const a = int(r, 6, 40);
    return blankQ(`Double ${a}, then double the answer.`, a * 4,
      { hint: 'Doubling twice is the same as multiplying by four.',
        explanation: `${a} × 2 = ${a * 2}, and ${a * 2} × 2 = ${a * 4}.` }); },

  (r) => { const a = int(r, 4, 40), k = pick(r, [5, 25, 50]);
    return mathQ(pick(r, MUL_WAYS), `${a} × ${k} = ?`, a * k,
      { hint: `${k} is ${100 / k === Math.round(100 / k) ? `100 ÷ ${100 / k}` : 'a friendly number'}, so multiply by 100 and divide.`,
        explanation: `${a} × 100 = ${a * 100}, and ${a * 100} ÷ ${100 / k} = ${a * k}.` }); },

  (r) => { const w = int(r, 3, 25), h = int(r, 3, 25);
    return blankQ(`A rectangle is ${w} cm by ${h} cm. What is its area, in square centimetres?`, w * h,
      { hint: 'Area is one side times the other.', explanation: `${w} × ${h} = ${w * h}.` }); },

  (r) => { const a = int(r, 12, 60), b = int(r, 11, 19);
    return mathQ(pick(r, MUL_WAYS), `${a} × ${b} = ?`, a * b,
      { hint: `Split it: ${a} × 10 and then ${a} × ${b - 10}.`,
        explanation: `${a * 10} + ${a * (b - 10)} = ${a * b}.` }); },

  (r) => { const a = int(r, 3, 12), b = int(r, 3, 12);
    return blankQ(`Multiply ${a} by ${b}, then double the answer.`, 2 * a * b,
      { hint: 'Do the multiplication first.',
        explanation: `${a} × ${b} = ${a * b}, and ${a * b} × 2 = ${2 * a * b}.` }); }
];

/* ============================== DIVISION ============================== */
export const division = [
  /* Every division here is exact, because a drill sheet that hands a Grade 4
     a remainder it was never taught to write is a sheet that gets marked
     wrong for the wrong reason. Remainders get their own maker, labelled. */
  (r) => { const b = int(r, 2, 12), q = int(r, 2, 12);
    return mathQ(pick(r, DIV_WAYS), `${b * q} ÷ ${b} = ?`, q,
      { hint: `How many ${b}s fit into ${b * q}?`, explanation: `${b} × ${q} = ${b * q}.` }); },

  (r) => { const b = int(r, 2, 9), q = int(r, 11, 99);
    return mathQ(pick(r, DIV_WAYS), `${b * q} ÷ ${b} = ?`, q,
      { hint: 'Short division: work left to right, carrying the remainder along.',
        explanation: `${b} × ${q} = ${b * q}.` }); },

  (r) => { const b = int(r, 3, 12), q = int(r, 100, 800);
    return mathQ(pick(r, DIV_WAYS), `${b * q} ÷ ${b} = ?`, q,
      { hint: 'Short division, one digit at a time.',
        explanation: `${b} × ${q} = ${b * q}.` }); },

  (r) => { const b = int(r, 11, 40), q = int(r, 11, 90);
    return mathQ(pick(r, DIV_WAYS), `${b * q} ÷ ${b} = ?`, q,
      { hint: 'Long division. Estimate how many times it goes, then subtract.',
        explanation: `${b} × ${q} = ${b * q}.` }); },

  (r) => { const a = int(r, 2, 99), p = pick(r, [10, 100]);
    return mathQ(pick(r, DIV_WAYS), `${a * p} ÷ ${p} = ?`, a,
      { hint: 'Dividing by a power of ten shifts every digit right.',
        explanation: `${a * p} ÷ ${p} = ${a}.` }); },

  /* Remainders, named as such so the expected form is never in doubt. */
  (r) => { const b = int(r, 3, 9), q = int(r, 4, 20), rem = int(r, 1, b - 1);
    return blankQ(`Divide and give the remainder. Write it as "${q} r ${rem}" would be written.`,
      `${q} r ${rem}`,
      { math: `${b * q + rem} ÷ ${b} = ?`,
        accept: [`${q} remainder ${rem}`, `${q}r${rem}`, `${q} r${rem}`],
        hint: `${b} does not go into ${b * q + rem} exactly. How much is left over?`,
        explanation: `${b} × ${q} = ${b * q}, and ${b * q + rem} − ${b * q} = ${rem}.` }); },

  (r) => { const b = int(r, 2, 12), q = int(r, 2, 12);
    return mathQ('Find the missing number.', `? ÷ ${b} = ${q}`, b * q,
      { hint: 'Multiply to undo the division.', explanation: `${q} × ${b} = ${b * q}.` }); },

  (r) => { const b = int(r, 2, 12), q = int(r, 2, 12);
    return mathQ('Find the missing number.', `${b * q} ÷ ? = ${q}`, b,
      { hint: 'Divide the first number by the answer.',
        explanation: `${b * q} ÷ ${q} = ${b}.` }); },

  (r) => { const half = int(r, 6, 60);
    return mathQ('Halve the number.', `${half * 2} ÷ 2 = ?`, half,
      { hint: 'Split it into two equal parts.', explanation: `${half * 2} ÷ 2 = ${half}.` }); },

  (r) => { const q = int(r, 3, 40);
    return mathQ('Find a quarter.', `${q * 4} ÷ 4 = ?`, q,
      { hint: 'Halve it, then halve it again.',
        explanation: `${q * 4} ÷ 2 = ${q * 2}, and ${q * 2} ÷ 2 = ${q}.` }); },

  (r) => { const each = int(r, 2, 12), people = int(r, 2, 9), thing = pick(r, THINGS), who = pick(r, PEOPLE);
    return blankQ(`${who} shares ${each * people} ${thing} equally between ${people} people. How many does each person get?`,
      each,
      { hint: `Divide by ${people}.`, explanation: `${each * people} ÷ ${people} = ${each}.` }); },

  (r) => { const q = int(r, 3, 25);
    return blankQ(`What is a quarter of ${4 * q}?`, q,
      { hint: 'Halve it, then halve it again.',
        explanation: `${4 * q} ÷ 2 = ${2 * q}, and ${2 * q} ÷ 2 = ${q}.` }); },

  (r) => { const b = int(r, 2, 12), q = int(r, 2, 20);
    return blankQ(`How many ${b}s are there in ${b * q}?`, q,
      { hint: `Count up in ${b}s, or divide.`, explanation: `${b * q} ÷ ${b} = ${q}.` }); },

  (r) => { const k = pick(r, [5, 25, 50]), q = int(r, 2, 20);
    return mathQ(pick(r, DIV_WAYS), `${k * q} ÷ ${k} = ?`, q,
      { hint: `There are ${100 / k} lots of ${k} in every 100.`,
        explanation: `${k * q} ÷ ${k} = ${q}.` }); },

  (r) => { const b = int(r, 2, 6), c = int(r, 2, 6), q = int(r, 2, 12);
    return mathQ(pick(r, DIV_WAYS), `${b * c * q} ÷ ${b} ÷ ${c} = ?`, q,
      { hint: 'Divide by the first number, then by the second.',
        explanation: `${b * c * q} ÷ ${b} = ${c * q}, and ${c * q} ÷ ${c} = ${q}.` }); },

  (r) => { const a = int(r, 3, 12), b = int(r, 3, 12);
    return blankQ(`${a} × ${b} = ${a * b}. Use this to work out ${a * b} ÷ ${b}.`, a,
      { hint: 'The division undoes the multiplication you have been given.',
        explanation: `${a * b} ÷ ${b} = ${a}.` }); }
];

/* ========================== NEGATIVE NUMBERS ========================== */
export const negatives = [
  (r) => { const a = int(r, 1, 12), b = int(r, a + 1, 20);
    return mathQ(pick(r, WORK_WAYS), `${a} − ${b} = ?`, a - b,
      { hint: 'The answer goes below zero. Count back past it.',
        explanation: `${a} − ${b} = ${sn(a - b)}.` }); },

  (r) => { const a = -int(r, 2, 15), b = int(r, 2, 15);
    return mathQ(pick(r, WORK_WAYS), `${sn(a)} + ${b} = ?`, a + b,
      { hint: 'Start at the negative number and count up.',
        explanation: `${sn(a)} + ${b} = ${sn(a + b)}.` }); },

  (r) => { const a = -int(r, 2, 15), b = int(r, 2, 15);
    return mathQ(pick(r, WORK_WAYS), `${sn(a)} − ${b} = ?`, a - b,
      { hint: 'Going further down from a negative number.',
        explanation: `${sn(a)} − ${b} = ${sn(a - b)}.` }); },

  /* Two signs together, which is where the marks are actually lost. */
  (r) => { const a = int(r, 2, 15), b = int(r, 2, 15);
    return mathQ(pick(r, WORK_WAYS), `${a} − (−${b}) = ?`, a + b,
      { hint: 'Subtracting a negative is the same as adding.',
        explanation: `${a} − (−${b}) = ${a} + ${b} = ${a + b}.` }); },

  (r) => { const a = int(r, 2, 15), b = int(r, 2, 15);
    return mathQ(pick(r, WORK_WAYS), `${a} + (−${b}) = ?`, a - b,
      { hint: 'Adding a negative is the same as subtracting.',
        explanation: `${a} + (−${b}) = ${a} − ${b} = ${sn(a - b)}.` }); },

  (r) => { const a = -int(r, 2, 12), b = int(r, 2, 12);
    return mathQ(pick(r, WORK_WAYS), `${sn(a)} × ${b} = ?`, a * b,
      { hint: 'One negative and one positive give a negative.',
        explanation: `${sn(a)} × ${b} = ${sn(a * b)}.` }); },

  (r) => { const a = -int(r, 2, 12), b = -int(r, 2, 12);
    return mathQ(pick(r, WORK_WAYS), `${sn(a)} × (${sn(b)}) = ?`, a * b,
      { hint: 'Two negatives multiply to a positive.',
        explanation: `${sn(a)} × (${sn(b)}) = ${a * b}.` }); },

  (r) => { const q = int(r, 2, 12), b = int(r, 2, 12);
    return mathQ(pick(r, WORK_WAYS), `${sn(-b * q)} ÷ ${b} = ?`, -q,
      { hint: 'A negative divided by a positive is negative.',
        explanation: `${sn(-b * q)} ÷ ${b} = ${sn(-q)}.` }); },

  (r) => { const q = int(r, 2, 12), b = int(r, 2, 12);
    return mathQ(pick(r, WORK_WAYS), `${sn(-b * q)} ÷ (−${b}) = ?`, q,
      { hint: 'Two negatives divide to a positive.',
        explanation: `${sn(-b * q)} ÷ (−${b}) = ${q}.` }); },

  /* Temperature, because it is the one place a learner already has intuition
     for numbers below zero. Still a pure calculation. */
  (r) => { const start = -int(r, 3, 14), rise = int(r, 5, 25);
    return mathQ('A temperature rises. Write the new temperature in °C.',
      `${sn(start)}°C + ${rise}°C = ?`, start + rise,
      { hint: 'Count up from the starting temperature, through zero.',
        explanation: `${sn(start)} + ${rise} = ${sn(start + rise)}.` }); },

  (r) => { const a = -int(r, 5, 20), b = -int(r, 5, 20);
    return mathQ('Find the difference between the two temperatures, in °C.',
      `${sn(Math.max(a, b))}°C − (${sn(Math.min(a, b))}°C) = ?`, Math.max(a, b) - Math.min(a, b),
      { hint: 'Difference is always counted as a positive amount.',
        explanation: `${sn(Math.max(a, b))} − (${sn(Math.min(a, b))}) = ${Math.max(a, b) - Math.min(a, b)}.` }); }
];

/* =========================== POWERS AND ROOTS =========================== */
export const powers = [
  (r) => { const a = int(r, 2, 15);
    return mathQ(pick(r, EVAL_WAYS), `${a}² = ?`, a * a,
      { hint: 'The number multiplied by itself.', explanation: `${a} × ${a} = ${a * a}.` }); },

  (r) => { const a = int(r, 2, 10);
    return mathQ(pick(r, EVAL_WAYS), `${a}³ = ?`, a * a * a,
      { hint: 'The number multiplied by itself three times.',
        explanation: `${a} × ${a} × ${a} = ${a * a * a}.` }); },

  (r) => { const a = int(r, 2, 20);
    return mathQ('Write the square root.', `√${a * a} = ?`, a,
      { hint: 'Which number multiplied by itself gives this?',
        explanation: `${a} × ${a} = ${a * a}, so √${a * a} = ${a}.` }); },

  (r) => { const a = int(r, 2, 10);
    return mathQ('Write the cube root.', `∛${a * a * a} = ?`, a,
      { hint: 'Which number multiplied by itself three times gives this?',
        explanation: `${a}³ = ${a * a * a}.` }); },

  (r) => { const a = int(r, 2, 5), m = int(r, 2, 5), n = int(r, 2, 4);
    return mathQ(pick(r, EVAL_WAYS), `${a}^${m} × ${a}^${n} = ?`, Math.pow(a, m + n),
      { hint: 'Same base, so add the powers.',
        explanation: `${a}^${m} × ${a}^${n} = ${a}^${m + n} = ${Math.pow(a, m + n)}.` }); },

  (r) => { const a = int(r, 2, 5), n = int(r, 2, 4), m = n + int(r, 1, 3);
    return mathQ(pick(r, EVAL_WAYS), `${a}^${m} ÷ ${a}^${n} = ?`, Math.pow(a, m - n),
      { hint: 'Same base, so subtract the powers.',
        explanation: `${a}^${m} ÷ ${a}^${n} = ${a}^${m - n} = ${Math.pow(a, m - n)}.` }); },

  (r) => { const a = int(r, 2, 6);
    return mathQ(pick(r, EVAL_WAYS), `${a}^0 = ?`, 1,
      { hint: 'Anything to the power zero.', explanation: `Any non-zero number to the power 0 is 1.` }); },

  (r) => { const a = int(r, 2, 4), m = int(r, 2, 3), n = int(r, 2, 3);
    return mathQ(pick(r, EVAL_WAYS), `(${a}^${m})^${n} = ?`, Math.pow(a, m * n),
      { hint: 'A power raised to a power: multiply the indices.',
        explanation: `(${a}^${m})^${n} = ${a}^${m * n} = ${Math.pow(a, m * n)}.` }); },

  (r) => { const a = int(r, 2, 12), b = int(r, 2, 12);
    return mathQ(pick(r, EVAL_WAYS), `${a}² + ${b}² = ?`, a * a + b * b,
      { hint: 'Square each one first, then add.',
        explanation: `${a * a} + ${b * b} = ${a * a + b * b}.` }); },

  (r) => { const a = int(r, 3, 15), b = int(r, 2, a - 1);
    return mathQ(pick(r, EVAL_WAYS), `${a}² − ${b}² = ?`, a * a - b * b,
      { hint: 'Square each one first, then subtract.',
        explanation: `${a * a} − ${b * b} = ${a * a - b * b}.` }); },

  (r) => { const a = int(r, 2, 12), b = int(r, 2, 12);
    return mathQ(pick(r, EVAL_WAYS), `√${a * a} + √${b * b} = ?`, a + b,
      { hint: 'Take each root first, then add.',
        explanation: `${a} + ${b} = ${a + b}.` }); }
];

/* ========================= ORDER OF OPERATIONS ========================= */
/* Every one of these is built so the wrong order gives a different number.
   `3 + 2 × 4` is a real question; `3 + 2 × 1` teaches nothing. */
export const bodmas = [
  (r) => { const a = int(r, 2, 9), b = int(r, 2, 9), c = int(r, 2, 9);
    return mathQ(pick(r, WORK_WAYS), `${a} + ${b} × ${c} = ?`, a + b * c,
      { hint: 'Multiply before you add.',
        explanation: `${b} × ${c} = ${b * c}, then ${a} + ${b * c} = ${a + b * c}.` }); },

  (r) => { const a = int(r, 2, 9), b = int(r, 2, 9), c = int(r, 2, 9);
    return mathQ(pick(r, WORK_WAYS), `(${a} + ${b}) × ${c} = ?`, (a + b) * c,
      { hint: 'The brackets go first.',
        explanation: `${a} + ${b} = ${a + b}, then ${a + b} × ${c} = ${(a + b) * c}.` }); },

  (r) => { const b = int(r, 2, 9), c = int(r, 2, 6), a = int(r, b * c + 1, b * c + 20);
    return mathQ(pick(r, WORK_WAYS), `${a} − ${b} × ${c} = ?`, a - b * c,
      { hint: 'Multiply first, then subtract.',
        explanation: `${b} × ${c} = ${b * c}, then ${a} − ${b * c} = ${a - b * c}.` }); },

  (r) => { const c = int(r, 2, 9), q = int(r, 2, 9), a = int(r, 2, 20);
    return mathQ(pick(r, WORK_WAYS), `${a} + ${c * q} ÷ ${c} = ?`, a + q,
      { hint: 'Divide before you add.',
        explanation: `${c * q} ÷ ${c} = ${q}, then ${a} + ${q} = ${a + q}.` }); },

  (r) => { const c = int(r, 2, 9), q = int(r, 2, 12), b = int(r, 2, 15);
    return mathQ(pick(r, WORK_WAYS), `(${c * q + b} − ${b}) ÷ ${c} = ?`, q,
      { hint: 'Do the bracket, then divide.',
        explanation: `${c * q + b} − ${b} = ${c * q}, then ${c * q} ÷ ${c} = ${q}.` }); },

  (r) => { const a = int(r, 2, 9), b = int(r, 2, 9), c = int(r, 2, 9);
    return mathQ(pick(r, WORK_WAYS), `${a}² + ${b} × ${c} = ?`, a * a + b * c,
      { hint: 'Powers first, then multiplication, then addition.',
        explanation: `${a}² = ${a * a} and ${b} × ${c} = ${b * c}, so the total is ${a * a + b * c}.` }); },

  (r) => { const a = int(r, 2, 8), b = int(r, 2, 9), c = int(r, 2, 9), d = int(r, 1, a * (b + c) - 1);
    return mathQ(pick(r, WORK_WAYS), `${a} × (${b} + ${c}) − ${d} = ?`, a * (b + c) - d,
      { hint: 'Bracket, then multiply, then subtract.',
        explanation: `${b} + ${c} = ${b + c}; ${a} × ${b + c} = ${a * (b + c)}; minus ${d} leaves ${a * (b + c) - d}.` }); },

  (r) => { const a = int(r, 2, 12), b = int(r, 2, 9), c = int(r, 2, 9), d = int(r, 1, a + b * c - 1);
    return mathQ(pick(r, WORK_WAYS), `${a} + ${b} × ${c} − ${d} = ?`, a + b * c - d,
      { hint: 'The multiplication happens before either the plus or the minus.',
        explanation: `${b} × ${c} = ${b * c}, so ${a} + ${b * c} − ${d} = ${a + b * c - d}.` }); },

  (r) => { const a = int(r, 2, 9), b = int(r, 2, 9), d = int(r, 2, 9), c = int(r, d + 1, d + 9);
    return mathQ(pick(r, WORK_WAYS), `(${a} + ${b}) × (${c} − ${d}) = ?`, (a + b) * (c - d),
      { hint: 'Two brackets: work out both, then multiply the results.',
        explanation: `${a + b} × ${c - d} = ${(a + b) * (c - d)}.` }); },

  (r) => { const c = int(r, 2, 6), q = int(r, 2, 9), a = int(r, 2, 9), b = int(r, 2, 9);
    return mathQ(pick(r, WORK_WAYS), `${c * q} ÷ ${c} + ${a} × ${b} = ?`, q + a * b,
      { hint: 'Division and multiplication both come before the addition.',
        explanation: `${c * q} ÷ ${c} = ${q} and ${a} × ${b} = ${a * b}, so the answer is ${q + a * b}.` }); }
];

/* ============================== ROUNDING ============================== */
const sig = (v, figs) => {
  if (v === 0) return 0;
  const mag = Math.floor(Math.log10(Math.abs(v)));
  const f = Math.pow(10, figs - 1 - mag);
  return Math.round((Math.round(v * f) / f) * 1e9) / 1e9;
};

export const rounding = [
  (r) => { const n = int(r, 21, 989);
    return mathQ('Round to the nearest 10.', `${n} → ?`, Math.round(n / 10) * 10,
      { hint: 'Look at the units digit: 5 or more rounds up.',
        explanation: `The units digit is ${n % 10}, so ${n} rounds to ${Math.round(n / 10) * 10}.` }); },

  (r) => { const n = int(r, 120, 9800);
    return mathQ('Round to the nearest 100.', `${n} → ?`, Math.round(n / 100) * 100,
      { hint: 'The tens digit decides it.',
        explanation: `The tens digit is ${Math.floor(n / 10) % 10}, so ${n} rounds to ${Math.round(n / 100) * 100}.` }); },

  (r) => { const n = int(r, 1200, 98000);
    return mathQ('Round to the nearest 1000.', `${n} → ?`, Math.round(n / 1000) * 1000,
      { hint: 'The hundreds digit decides it.',
        explanation: `The hundreds digit is ${Math.floor(n / 100) % 10}, so ${n} rounds to ${Math.round(n / 1000) * 1000}.` }); },

  (r) => { const c = int(r, 10, 999) * 10 + int(r, 1, 9);
    return mathQ('Round to 1 decimal place.', `${num(c / 100)} → ?`, num(Math.round(c / 10) / 10),
      { hint: 'The second decimal digit decides it.',
        explanation: `${num(c / 100)} rounds to ${num(Math.round(c / 10) / 10)}.` }); },

  (r) => { const c = int(r, 100, 9999) * 10 + int(r, 1, 9);
    return mathQ('Round to 2 decimal places.', `${num(c / 1000)} → ?`, num(Math.round(c / 10) / 100),
      { hint: 'The third decimal digit decides it.',
        explanation: `${num(c / 1000)} rounds to ${num(Math.round(c / 10) / 100)}.` }); },

  (r) => { const c = int(r, 10, 499) * 10 + int(r, 1, 9);
    return mathQ('Round to the nearest whole number.', `${num(c / 10)} → ?`, Math.round(c / 10),
      { hint: 'Half or more rounds up.',
        explanation: `${num(c / 10)} rounds to ${Math.round(c / 10)}.` }); },

  (r) => { const n = int(r, 23, 9870);
    return mathQ('Round to 1 significant figure.', `${n} → ?`, sig(n, 1),
      { hint: 'Keep the first digit and fill the rest with zeros.',
        explanation: `${n} to 1 significant figure is ${sig(n, 1)}.` }); },

  (r) => { const n = int(r, 234, 98700);
    return mathQ('Round to 2 significant figures.', `${n} → ?`, sig(n, 2),
      { hint: 'Keep the first two digits; the third one decides whether the second goes up.',
        explanation: `${n} to 2 significant figures is ${sig(n, 2)}.` }); },

  (r) => { const n = int(r, 2345, 987000);
    return mathQ('Round to 3 significant figures.', `${n} → ?`, sig(n, 3),
      { hint: 'Keep three digits; the fourth decides whether the third goes up.',
        explanation: `${n} to 3 significant figures is ${sig(n, 3)}.` }); },

  (r) => { const c = int(r, 10, 98) * 10 + int(r, 1, 9);
    return mathQ('Round to 2 significant figures.', `${num(c / 1000)} → ?`, num(sig(c / 1000, 2)),
      { hint: 'For a number below 1 the leading zeros do not count as significant.',
        explanation: `${num(c / 1000)} to 2 significant figures is ${num(sig(c / 1000, 2))}.` }); },

  (r) => { const n = int(r, 12, 490) * 2 + int(r, 1, 4) * 2 - 1;
    return mathQ('Round to the nearest 5.', `${n} → ?`, Math.round(n / 5) * 5,
      { hint: 'Which multiple of 5 is it closer to?',
        explanation: `${n} sits between ${Math.floor(n / 5) * 5} and ${Math.ceil(n / 5) * 5}, and rounds to ${Math.round(n / 5) * 5}.` }); },

  (r) => { const n = int(r, 12, 98) * 1000 + int(r, 1, 999);
    return mathQ('Round to the nearest 10 000.', `${n} → ?`, Math.round(n / 10000) * 10000,
      { hint: 'The thousands digit decides it.',
        explanation: `${n} rounds to ${Math.round(n / 10000) * 10000}.` }); },

  (r) => { const a = int(r, 21, 89), b = int(r, 21, 89);
    return blankQ(`Estimate ${a} × ${b} by rounding each number to one significant figure.`,
      sig(a, 1) * sig(b, 1),
      { hint: 'Round first, then multiply the two round numbers.',
        explanation: `${a} ≈ ${sig(a, 1)} and ${b} ≈ ${sig(b, 1)}, so the estimate is ${sig(a, 1) * sig(b, 1)}.` }); },

  (r) => { const a = int(r, 120, 980), b = int(r, 120, 980);
    return blankQ(`Estimate ${a} + ${b} by rounding each number to the nearest 100.`,
      Math.round(a / 100) * 100 + Math.round(b / 100) * 100,
      { hint: 'Round both, then add.',
        explanation: `${Math.round(a / 100) * 100} + ${Math.round(b / 100) * 100} = ${Math.round(a / 100) * 100 + Math.round(b / 100) * 100}.` }); },

  (r) => { const c = int(r, 105, 9995);
    return blankQ(`Round $${money(c / 100)} to the nearest dollar.`, Math.round(c / 100),
      { hint: '50 cents or more rounds up.',
        explanation: `$${money(c / 100)} rounds to $${Math.round(c / 100)}.` }); }
];

/* ======================= FACTORS, MULTIPLES, PRIMES ======================= */
const factorsOf = n => {
  const out = [];
  for (let i = 1; i <= n; i++) if (n % i === 0) out.push(i);
  return out;
};
const isPrime = n => n > 1 && factorsOf(n).length === 2;
const primeFactors = n => {
  const out = [];
  let m = n;
  for (let p = 2; p * p <= m; p++) while (m % p === 0) { out.push(p); m /= p; }
  if (m > 1) out.push(m);
  return out;
};
const lcm = (a, b) => (a * b) / gcd(a, b);

export const factors = [
  (r) => { let n = int(r, 12, 60); while (isPrime(n)) n++;
    const f = factorsOf(n);
    return blankQ(`List all the factors of ${n}, smallest first.`, f.join(', '),
      { accept: [f.join(','), f.join(' ')],
        hint: 'Work in pairs: start at 1 and its partner, then 2 and its partner.',
        explanation: `${n} has ${f.length} factors: ${f.join(', ')}.` }); },

  (r) => { const g = int(r, 2, 9), a = g * int(r, 2, 9), b = g * int(r, 2, 9);
    return blankQ(`Find the highest common factor of ${a} and ${b}.`, gcd(a, b),
      { hint: 'List the factors of the smaller number and look for the largest one that also divides the other.',
        explanation: `The common factors are ${factorsOf(gcd(a, b)).join(', ')}, so the highest is ${gcd(a, b)}.` }); },

  (r) => { const a = int(r, 2, 12), b = int(r, 2, 12);
    return blankQ(`Find the lowest common multiple of ${a} and ${b}.`, lcm(a, b),
      { hint: 'Count up in the larger number until you hit a multiple of the smaller one.',
        explanation: `${lcm(a, b)} is the first number that both ${a} and ${b} divide into.` }); },

  (r) => { const n = int(r, 10, 80); let p = n + 1; while (!isPrime(p)) p++;
    return blankQ(`Write the first prime number after ${n}.`, p,
      { hint: 'Test each number in turn: a prime has no factors except 1 and itself.',
        explanation: `${p} is prime, and nothing between ${n} and ${p} is.` }); },

  (r) => { const n = int(r, 12, 120), pf = primeFactors(n);
    return blankQ(`Write ${n} as a product of prime factors.`, pf.join(' × '),
      { accept: [pf.join('x'), pf.join(' x '), pf.join('*')],
        hint: 'Keep dividing by the smallest prime that goes in, until you are left with 1.',
        explanation: `${n} = ${pf.join(' × ')}.` }); },

  (r) => { const n = int(r, 12, 72);
    return blankQ(`How many factors does ${n} have?`, factorsOf(n).length,
      { hint: 'Find them in pairs, and count a repeated pair only once.',
        explanation: `The factors are ${factorsOf(n).join(', ')} — that is ${factorsOf(n).length} of them.` }); },

  (r) => { const n = int(r, 20, 90), f = factorsOf(n);
    return blankQ(`Write the largest factor of ${n} that is smaller than ${n} itself.`, f[f.length - 2],
      { hint: 'Divide by the smallest factor above 1.',
        explanation: `${n} ÷ ${n / f[f.length - 2]} = ${f[f.length - 2]}.` }); },

  (r) => { const k = int(r, 3, 12), n = int(r, 20, 90), m = (Math.floor(n / k) + 1) * k;
    return blankQ(`Write the first multiple of ${k} that is greater than ${n}.`, m,
      { hint: 'Divide, ignore the remainder, then go up one step.',
        explanation: `${k} × ${m / k} = ${m}, and the multiple before it is ${m - k}.` }); },

  (r) => { const n = int(r, 10, 130), s = Math.floor(Math.sqrt(n)) + 1;
    return blankQ(`Write the smallest square number greater than ${n}.`, s * s,
      { hint: 'Try squaring whole numbers until you pass it.',
        explanation: `${s} × ${s} = ${s * s}, and ${s - 1} × ${s - 1} = ${(s - 1) * (s - 1)} is too small.` }); },

  (r) => { const g = int(r, 4, 12), a = g * int(r, 2, 7), b = g * int(r, 2, 7);
    const cf = factorsOf(gcd(a, b));
    return blankQ(`List all the common factors of ${a} and ${b}.`, cf.join(', '),
      { accept: [cf.join(','), cf.join(' ')],
        hint: 'Every common factor is a factor of their highest common factor.',
        explanation: `Their highest common factor is ${gcd(a, b)}, and its factors are ${cf.join(', ')}.` }); },

  (r) => { const k = int(r, 3, 12), n = int(r, 30, 140);
    return blankQ(`Write the largest multiple of ${k} that is less than ${n}.`,
      (Math.ceil(n / k) - 1) * k,
      { hint: 'Divide, drop the remainder, then multiply back.',
        explanation: `${k} × ${Math.ceil(n / k) - 1} = ${(Math.ceil(n / k) - 1) * k}.` }); },

  (r) => { const n = int(r, 3, 15);
    return blankQ(`Write the first five multiples of ${n}.`,
      [1, 2, 3, 4, 5].map(i => i * n).join(', '),
      { accept: [[1, 2, 3, 4, 5].map(i => i * n).join(',')],
        hint: `Count on in ${n}s from ${n}.`,
        explanation: `${[1, 2, 3, 4, 5].map(i => i * n).join(', ')}.` }); },

  (r) => { const a = int(r, 2, 9), b = int(r, 2, 9), l = lcm(a, b);
    return blankQ(`Write the second number that is a multiple of both ${a} and ${b}.`, 2 * l,
      { hint: 'Find the first one, then double it.',
        explanation: `The first is ${l}, so the second is ${2 * l}.` }); },

  (r) => { const n = int(r, 12, 200);
    return blankQ(`How many different prime numbers divide into ${n}?`,
      new Set(primeFactors(n)).size,
      { hint: 'Break it into primes first, then count the different ones.',
        explanation: `${n} = ${primeFactors(n).join(' × ')}, so there are ${new Set(primeFactors(n)).size} different primes.` }); },

  (r) => { const a = int(r, 10, 60), b = a + int(r, 10, 25);
    const ps = []; for (let n = a; n <= b; n++) if (isPrime(n)) ps.push(n);
    if (!ps.length) return blankQ('Write all the prime numbers between 10 and 20.', '11, 13, 17, 19',
      { hint: 'Test each number for factors.', explanation: '11, 13, 17 and 19 have no factors but 1 and themselves.' });
    return blankQ(`Write all the prime numbers between ${a} and ${b}.`, ps.join(', '),
      { accept: [ps.join(',')],
        hint: 'Cross out the multiples of 2, 3, 5 and 7 first.',
        explanation: `${ps.join(', ')} have no factors except 1 and themselves.` }); }
];

/* ============================== FRACTIONS ============================== */
const fracAns = ([n, d]) => (d === 1 ? String(n) : frac(n, d));

export const fractionops = [
  (r) => { const d = int(r, 4, 12), a = int(r, 1, d - 2), b = int(r, 1, d - a - 1);
    const s = simplify(a + b, d);
    return mathQ(pick(r, SIMPLEST_WAYS), `${frac(a, d)} + ${frac(b, d)} = ?`, fracAns(s),
      { hint: 'The denominator does not change; add the top numbers.',
        explanation: `${a} + ${b} = ${a + b}, so the answer is ${frac(a + b, d)}${s[1] === d && s[0] === a + b ? '' : ` = ${fracAns(s)}`}.` }); },

  (r) => { const b = int(r, 2, 6), d = int(r, b + 1, 9), a = int(r, 1, b - 1), c = int(r, 1, d - 1);
    const s = simplify(a * d + c * b, b * d);
    return mathQ(pick(r, SIMPLEST_WAYS), `${frac(a, b)} + ${frac(c, d)} = ?`, fracAns(s),
      { hint: `Rewrite both over ${b * d} before you add.`,
        explanation: `${frac(a, b)} = ${frac(a * d, b * d)} and ${frac(c, d)} = ${frac(c * b, b * d)}, giving ${frac(a * d + c * b, b * d)} = ${fracAns(s)}.` }); },

  (r) => { const d = int(r, 4, 12), a = int(r, 2, d - 1), b = int(r, 1, a - 1);
    const s = simplify(a - b, d);
    return mathQ(pick(r, SIMPLEST_WAYS), `${frac(a, d)} − ${frac(b, d)} = ?`, fracAns(s),
      { hint: 'Subtract the top numbers and keep the bottom one.',
        explanation: `${a} − ${b} = ${a - b}, so the answer is ${fracAns(s)}.` }); },

  (r) => { const b = int(r, 3, 7), d = int(r, 2, 9);
    let a = int(r, 1, b - 1), c = int(r, 1, d - 1);
    /* Order the two so the difference is positive: a level that has not met
       negative fractions should never be handed one by accident. */
    let [n1, d1, n2, d2] = a * d > c * b ? [a, b, c, d] : [c, d, a, b];
    if (n1 * d2 === n2 * d1) { n1 = 1; d1 = 2; n2 = 1; d2 = 3; }
    const lo = d1 * d2, s = simplify(n1 * d2 - n2 * d1, lo);
    return mathQ(pick(r, SIMPLEST_WAYS), `${frac(n1, d1)} − ${frac(n2, d2)} = ?`, fracAns(s),
      { hint: `Put both over ${lo} first.`,
        explanation: `${frac(n1 * d2, lo)} − ${frac(n2 * d1, lo)} = ${frac(n1 * d2 - n2 * d1, lo)} = ${fracAns(s)}.` }); },

  (r) => { const b = int(r, 2, 9), d = int(r, 2, 9), a = int(r, 1, b - 1), c = int(r, 1, d - 1);
    const s = simplify(a * c, b * d);
    return mathQ(pick(r, SIMPLEST_WAYS), `${frac(a, b)} × ${frac(c, d)} = ?`, fracAns(s),
      { hint: 'Multiply the tops together and the bottoms together.',
        explanation: `${a} × ${c} = ${a * c} over ${b} × ${d} = ${b * d}, which simplifies to ${fracAns(s)}.` }); },

  (r) => { const b = int(r, 2, 9), d = int(r, 2, 9), a = int(r, 1, b - 1), c = int(r, 1, d - 1);
    const s = simplify(a * d, b * c);
    return mathQ(pick(r, SIMPLEST_WAYS), `${frac(a, b)} ÷ ${frac(c, d)} = ?`, fracAns(s),
      { hint: 'Turn the second fraction upside down and multiply.',
        explanation: `${frac(a, b)} × ${frac(d, c)} = ${frac(a * d, b * c)} = ${fracAns(s)}.` }); },

  (r) => { const k = int(r, 2, 8), d = int(r, 2, 9), n = int(r, 1, d - 1);
    return mathQ(pick(r, SIMPLIFY_WAYS), `${frac(n * k, d * k)} = ?`, fracAns(simplify(n * k, d * k)),
      { hint: 'Find the largest number that divides both the top and the bottom.',
        explanation: `Both divide by ${gcd(n * k, d * k)}, leaving ${fracAns(simplify(n * k, d * k))}.` }); },

  (r) => { const d = int(r, 2, 9), a = int(r, 1, d - 1), q = int(r, 2, 12);
    return mathQ(pick(r, WORK_WAYS), `${frac(a, d)} of ${d * q} = ?`, a * q,
      { hint: `Divide by ${d} first, then multiply by ${a}.`,
        explanation: `${d * q} ÷ ${d} = ${q}, and ${q} × ${a} = ${a * q}.` }); },

  (r) => { const w = int(r, 2, 6), d = int(r, 3, 9); let n = int(r, 1, d - 1);
    while (gcd(n, d) !== 1) n--;
    return blankQ(`Write ${w} ${frac(n, d)} as an improper fraction.`, frac(w * d + n, d),
      { hint: `Each whole is ${frac(d, d)}.`,
        explanation: `${w} × ${d} = ${w * d}, plus ${n} gives ${frac(w * d + n, d)}.` }); },

  (r) => { const w = int(r, 2, 6), d = int(r, 3, 9); let n = int(r, 1, d - 1);
    while (gcd(n, d) !== 1) n--;
    return blankQ(`Write ${frac(w * d + n, d)} as a mixed number.`, `${w} ${frac(n, d)}`,
      { accept: [`${w}${frac(n, d)}`, `${w} and ${frac(n, d)}`],
        hint: `How many whole ${d}s fit inside the top number?`,
        explanation: `${w * d + n} ÷ ${d} = ${w} remainder ${n}, so it is ${w} ${frac(n, d)}.` }); },

  (r) => { const b = int(r, 2, 9), a = int(r, 1, b - 1), k = int(r, 2, 9);
    const s = simplify(a * k, b);
    return mathQ(pick(r, SIMPLEST_WAYS), `${frac(a, b)} × ${k} = ?`, fracAns(s),
      { hint: 'Multiply the top by the whole number and leave the bottom alone.',
        explanation: `${a} × ${k} = ${a * k}, so ${frac(a * k, b)} = ${fracAns(s)}.` }); },

  (r) => { const b = int(r, 2, 7), a = int(r, 1, b - 1), k = int(r, 2, 6);
    const s = simplify(a, b * k);
    return mathQ(pick(r, SIMPLEST_WAYS), `${frac(a, b)} ÷ ${k} = ?`, fracAns(s),
      { hint: 'Dividing by a whole number makes the pieces smaller, so the bottom grows.',
        explanation: `${frac(a, b)} ÷ ${k} = ${frac(a, b * k)} = ${fracAns(s)}.` }); }
];

/* ============================== DECIMALS ============================== */
/* Every value here is built as a whole number of hundredths and only divided
   at the moment it is printed, so no answer is ever 0.30000000000000004. */
export const decimalops = [
  (r) => { const a = int(r, 105, 995), b = int(r, 105, 995);
    return mathQ(pick(r, WORK_WAYS), `${num(a / 100)} + ${num(b / 100)} = ?`, num((a + b) / 100),
      { hint: 'Line the decimal points up under each other.',
        explanation: `${num(a / 100)} + ${num(b / 100)} = ${num((a + b) / 100)}.` }); },

  (r) => { const b = int(r, 105, 495), a = int(r, b + 5, 995);
    return mathQ(pick(r, WORK_WAYS), `${num(a / 100)} − ${num(b / 100)} = ?`, num((a - b) / 100),
      { hint: 'Line the decimal points up, and fill any short column with a zero.',
        explanation: `${num(a / 100)} − ${num(b / 100)} = ${num((a - b) / 100)}.` }); },

  (r) => { const a = int(r, 105, 995), k = pick(r, [10, 100, 1000]);
    return mathQ(pick(r, WORK_WAYS), `${num(a / 100)} × ${k} = ?`, num(a * k / 100),
      { hint: `Multiplying by ${k} moves every digit ${String(k).length - 1} place${k === 10 ? '' : 's'} to the left.`,
        explanation: `${num(a / 100)} × ${k} = ${num(a * k / 100)}.` }); },

  (r) => { const a = int(r, 105, 995), k = pick(r, [10, 100]);
    return mathQ(pick(r, WORK_WAYS), `${num(a / 100)} ÷ ${k} = ?`, num(a / 100 / k),
      { hint: `Dividing by ${k} moves every digit ${String(k).length - 1} place${k === 10 ? '' : 's'} to the right.`,
        explanation: `${num(a / 100)} ÷ ${k} = ${num(a / 100 / k)}.` }); },

  (r) => { const a = int(r, 105, 995), k = int(r, 2, 9);
    return mathQ(pick(r, WORK_WAYS), `${num(a / 100)} × ${k} = ?`, num(a * k / 100),
      { hint: 'Multiply as if there were no decimal point, then put it back two places from the right.',
        explanation: `${a} × ${k} = ${a * k}, so ${num(a / 100)} × ${k} = ${num(a * k / 100)}.` }); },

  (r) => { const k = int(r, 2, 9), q = int(r, 12, 200);
    return mathQ(pick(r, WORK_WAYS), `${num(k * q / 100)} ÷ ${k} = ?`, num(q / 100),
      { hint: 'Divide as usual and keep the decimal point where it is.',
        explanation: `${k * q} ÷ ${k} = ${q}, so the answer is ${num(q / 100)}.` }); },

  (r) => { const a = int(r, 11, 99), b = int(r, 11, 99);
    return mathQ(pick(r, WORK_WAYS), `${num(a / 10)} × ${num(b / 10)} = ?`, num(a * b / 100),
      { hint: 'One decimal place times one decimal place gives two decimal places.',
        explanation: `${a} × ${b} = ${a * b}, and two decimal places gives ${num(a * b / 100)}.` }); },

  (r) => { const a = int(r, 11, 99), b = int(r, 11, 99), c = int(r, 11, 99);
    return mathQ(pick(r, WORK_WAYS), `${num(a / 10)} + ${num(b / 10)} + ${num(c / 10)} = ?`, num((a + b + c) / 10),
      { hint: 'Add the tenths first and carry.',
        explanation: `${a} + ${b} + ${c} = ${a + b + c} tenths, which is ${num((a + b + c) / 10)}.` }); },

  (r) => { const w = int(r, 2, 20), b = int(r, 5, 99);
    return mathQ(pick(r, WORK_WAYS), `${w} − ${num(b / 100)} = ?`, num((w * 100 - b) / 100),
      { hint: `Write the whole number as ${w}.00 before you subtract.`,
        explanation: `${w}.00 − ${num(b / 100)} = ${num((w * 100 - b) / 100)}.` }); },

  (r) => { const b = int(r, 2, 25), q = int(r, 2, 40);
    return mathQ(pick(r, WORK_WAYS), `${num(b * q / 10)} ÷ ${num(b / 10)} = ?`, q,
      { hint: 'Move both decimal points the same number of places until the divider is a whole number.',
        explanation: `${b * q} ÷ ${b} = ${q}, and moving both points changes nothing.` }); },

  (r) => { const a = int(r, 105, 995), k = int(r, 11, 25);
    return mathQ(pick(r, WORK_WAYS), `${num(a / 100)} × ${k} = ?`, num(a * k / 100),
      { hint: 'Ignore the point, do the long multiplication, then replace it.',
        explanation: `${a} × ${k} = ${a * k}, so the answer is ${num(a * k / 100)}.` }); },

  (r) => { const a = int(r, 105, 995), half = r() < 0.5;
    return mathQ(pick(r, WORK_WAYS), half ? `Half of ${num(a * 2 / 100)} = ?` : `Double ${num(a / 100)} = ?`,
      half ? num(a / 100) : num(a * 2 / 100),
      { hint: half ? 'Halve the whole part and the decimal part separately.' : 'Double the whole part and the decimal part separately.',
        explanation: half ? `Half of ${num(a * 2 / 100)} is ${num(a / 100)}.` : `${num(a / 100)} doubled is ${num(a * 2 / 100)}.` }); }
];

/* ============================== PERCENTAGES ============================== */
export const percentops = [
  (r) => { const p = pick(r, [10, 20, 25, 50]), n = int(r, 1, 25) * 20;
    return mathQ(pick(r, WORK_WAYS), `${p}% of ${n} = ?`, p * n / 100,
      { hint: `${p}% is ${p === 50 ? 'a half' : p === 25 ? 'a quarter' : p === 20 ? 'a fifth' : 'a tenth'} of the amount.`,
        explanation: `${n} ÷ ${100 / p} = ${p * n / 100}.` }); },

  (r) => { const p = int(r, 1, 19) * 5, n = int(r, 1, 25) * 20;
    return mathQ(pick(r, WORK_WAYS), `${p}% of ${n} = ?`, p * n / 100,
      { hint: 'Find 10% first, then build the percentage you need from it.',
        explanation: `10% of ${n} is ${n / 10}, so ${p}% is ${p * n / 100}.` }); },

  (r) => { const p = int(r, 1, 10) * 5, n = int(r, 1, 25) * 20;
    return blankQ(`Increase ${n} by ${p}%.`, n + p * n / 100,
      { hint: 'Work out the increase, then add it on.',
        explanation: `${p}% of ${n} is ${p * n / 100}, and ${n} + ${p * n / 100} = ${n + p * n / 100}.` }); },

  (r) => { const p = int(r, 1, 10) * 5, n = int(r, 1, 25) * 20;
    return blankQ(`Decrease ${n} by ${p}%.`, n - p * n / 100,
      { hint: 'Work out the reduction, then take it off.',
        explanation: `${p}% of ${n} is ${p * n / 100}, and ${n} − ${p * n / 100} = ${n - p * n / 100}.` }); },

  (r) => { const [a, b] = pick(r, [[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 10], [3, 10], [7, 10], [1, 20], [9, 20], [1, 25]]);
    return blankQ(`Write ${frac(a, b)} as a percentage.`, `${a * 100 / b}%`,
      { accept: [String(a * 100 / b)],
        hint: 'Scale the fraction until the bottom number is 100.',
        explanation: `${frac(a, b)} = ${frac(a * 100 / b, 100)} = ${a * 100 / b}%.` }); },

  (r) => { const p = int(r, 1, 199);
    return blankQ(`Write ${p}% as a decimal.`, num(p / 100),
      { hint: 'Per cent means "out of 100".',
        explanation: `${p} ÷ 100 = ${num(p / 100)}.` }); },

  (r) => { const c = int(r, 1, 199);
    return blankQ(`Write ${num(c / 100)} as a percentage.`, `${c}%`,
      { accept: [String(c)],
        hint: 'Multiply by 100.',
        explanation: `${num(c / 100)} × 100 = ${c}%.` }); },

  (r) => { const p = int(r, 1, 19) * 5, s = simplify(p, 100);
    return blankQ(`Write ${p}% as a fraction in its simplest form.`, fracAns(s),
      { hint: `Start from ${frac(p, 100)} and cancel.`,
        explanation: `${frac(p, 100)} divides by ${gcd(p, 100)}, leaving ${fracAns(s)}.` }); },

  (r) => { const b = pick(r, [20, 25, 40, 50, 200, 400]), a = int(r, 1, b - 1);
    if ((a * 100) % b !== 0) return blankQ(`What percentage of ${b} is ${b / 4}?`, '25%',
      { accept: ['25'], hint: 'A quarter of the whole.', explanation: `${b / 4} out of ${b} is one quarter, which is 25%.` });
    return blankQ(`What percentage of ${b} is ${a}?`, `${a * 100 / b}%`,
      { accept: [String(a * 100 / b)],
        hint: 'Write it as a fraction of the whole, then scale to 100.',
        explanation: `${frac(a, b)} = ${a * 100 / b}%.` }); },

  (r) => { const p = pick(r, [10, 20, 25, 50]), orig = int(r, 2, 40) * 10;
    const after = orig + orig * p / 100;
    return blankQ(`A price rose by ${p}% to ${after}. What was it before the rise?`, orig,
      { hint: `The new price is ${100 + p}% of the old one.`,
        explanation: `${after} ÷ ${num((100 + p) / 100)} = ${orig}.` }); },

  (r) => { const p = pick(r, [5, 10, 20, 25, 50]), c = int(r, 2, 40) * 100;
    return blankQ(`Find ${p}% of $${money(c / 100)}. Give the answer in dollars.`, money(c * p / 100 / 100),
      { hint: `Divide by ${100 / p}.`,
        explanation: `$${money(c / 100)} ÷ ${100 / p} = $${money(c * p / 100 / 100)}.` }); },

  (r) => { const a = int(r, 2, 20) * 10, k = pick(r, [10, 20, 25, 50]), b = a + a * k / 100;
    return blankQ(`A value went from ${a} to ${b}. What was the percentage increase?`, `${k}%`,
      { accept: [String(k)],
        hint: 'Divide the rise by the starting value.',
        explanation: `The rise is ${b - a}, and ${b - a} ÷ ${a} = ${num((b - a) / a)} = ${k}%.` }); },

  (r) => { const b = pick(r, [20, 25, 40, 50]), a = int(r, 1, b - 1), who = pick(r, PEOPLE);
    if ((a * 100) % b !== 0) return blankQ(`${who} scored ${b / 2} out of ${b} in a test. What percentage is that?`,
      '50%', { accept: ['50'], hint: 'Half the marks.', explanation: `${b / 2} out of ${b} is a half, which is 50%.` });
    return blankQ(`${who} scored ${a} out of ${b} in a test. What percentage is that?`, `${a * 100 / b}%`,
      { accept: [String(a * 100 / b)],
        hint: 'Write the score as a fraction, then scale the bottom to 100.',
        explanation: `${frac(a, b)} = ${a * 100 / b}%.` }); },

  (r) => { const p = pick(r, [2, 4, 5, 10]), years = int(r, 2, 6), amount = int(r, 2, 40) * 100;
    return blankQ(`$${amount} is invested at ${p}% simple interest for ${years} years. How much interest is earned, in dollars?`,
      amount * p * years / 100,
      { hint: 'Work out one year first, then multiply by the number of years.',
        explanation: `${p}% of $${amount} is $${amount * p / 100}, and over ${years} years that is $${amount * p * years / 100}.` }); },

  (r) => { const p = pick(r, [10, 20, 25, 50]), n = int(r, 2, 40) * 20;
    return blankQ(`${p}% of a number is ${n * p / 100}. What is the number?`, n,
      { hint: `If ${p}% is that much, 100% is ${100 / p} times as much.`,
        explanation: `${n * p / 100} × ${100 / p} = ${n}.` }); },

  (r) => { const p = pick(r, [5, 10, 20, 25]), n = int(r, 2, 40) * 20, who = pick(r, PEOPLE);
    return blankQ(`${who} earns $${n} a week and ${p}% is deducted. How much is left, in dollars?`, n - n * p / 100,
      { hint: 'Work out the deduction, then take it off.',
        explanation: `${p}% of ${n} is ${n * p / 100}, leaving ${n - n * p / 100}.` }); }
];

/* ================================ RATIO ================================ */
export const ratio = [
  (r) => { const g = int(r, 2, 9), a = g * int(r, 2, 9), b = g * int(r, 2, 9);
    const d = gcd(a, b);
    return blankQ(`Simplify the ratio ${a} : ${b}.`, `${a / d} : ${b / d}`,
      { accept: [`${a / d}:${b / d}`],
        hint: 'Divide both sides by their highest common factor.',
        explanation: `Both divide by ${d}, giving ${a / d} : ${b / d}.` }); },

  (r) => { const g = int(r, 2, 6), a = g * int(r, 1, 6), b = g * int(r, 1, 6), c = g * int(r, 1, 6);
    const d = gcd(gcd(a, b), c);
    return blankQ(`Simplify the ratio ${a} : ${b} : ${c}.`, `${a / d} : ${b / d} : ${c / d}`,
      { accept: [`${a / d}:${b / d}:${c / d}`],
        hint: 'Find a number that divides all three parts.',
        explanation: `All three divide by ${d}, giving ${a / d} : ${b / d} : ${c / d}.` }); },

  (r) => { const a = int(r, 1, 6), b = int(r, 1, 6), unit = int(r, 3, 20);
    const total = (a + b) * unit;
    return blankQ(`Share ${total} in the ratio ${a} : ${b}. Write both shares.`,
      `${a * unit} : ${b * unit}`,
      { accept: [`${a * unit}:${b * unit}`, `${a * unit} and ${b * unit}`, `${a * unit}, ${b * unit}`],
        hint: `There are ${a + b} parts altogether.`,
        explanation: `${total} ÷ ${a + b} = ${unit} per part, so the shares are ${a * unit} and ${b * unit}.` }); },

  (r) => { const a = int(r, 1, 5), b = int(r, 1, 5), c = int(r, 1, 5), unit = int(r, 3, 15);
    const total = (a + b + c) * unit;
    return blankQ(`Share ${total} in the ratio ${a} : ${b} : ${c}. Write all three shares.`,
      `${a * unit} : ${b * unit} : ${c * unit}`,
      { accept: [`${a * unit}:${b * unit}:${c * unit}`, `${a * unit}, ${b * unit}, ${c * unit}`],
        hint: `Divide by the ${a + b + c} parts first.`,
        explanation: `One part is ${unit}, so the shares are ${a * unit}, ${b * unit} and ${c * unit}.` }); },

  (r) => { const a = int(r, 2, 9), b = int(r, 2, 9), k = int(r, 2, 9);
    return blankQ(`Fill in the missing number: ${a} : ${b} = ${a * k} : ?`, b * k,
      { hint: `The first side was multiplied by ${k}.`,
        explanation: `${a} × ${k} = ${a * k}, so ${b} × ${k} = ${b * k}.` }); },

  (r) => { const a = int(r, 2, 7), b = int(r, 2, 7), k = int(r, 2, 12);
    return blankQ(`Two amounts are in the ratio ${a} : ${b}. If the first is ${a * k}, what is the second?`,
      b * k,
      { hint: `Work out what one part is worth first.`,
        explanation: `${a * k} ÷ ${a} = ${k} per part, so the second is ${b} × ${k} = ${b * k}.` }); },

  (r) => { const a = int(r, 1, 7), b = int(r, 1, 7), s = simplify(a, a + b);
    return blankQ(`In the ratio ${a} : ${b}, what fraction of the whole is the first part?`, fracAns(s),
      { hint: `Count all the parts, then ask how many of them are the first share.`,
        explanation: `There are ${a + b} parts and ${a} of them, so ${frac(a, a + b)} = ${fracAns(s)}.` }); },

  (r) => { const a = int(r, 2, 9), n = int(r, 2, 9);
    return blankQ(`Write ${a} : ${a * n} in the form 1 : n.`, `1 : ${n}`,
      { accept: [`1:${n}`, String(n)],
        hint: `Divide both sides by ${a}.`,
        explanation: `${a} ÷ ${a} = 1 and ${a * n} ÷ ${a} = ${n}.` }); },

  (r) => { const a = int(r, 1, 6), b = int(r, a + 1, 9), unit = int(r, 3, 20);
    return blankQ(`${(a + b) * unit} is shared in the ratio ${a} : ${b}. How much bigger is the larger share?`,
      (b - a) * unit,
      { hint: `The difference is ${b - a} part${b - a === 1 ? '' : 's'}.`,
        explanation: `One part is ${unit}, and the shares differ by ${b - a} part${b - a === 1 ? '' : 's'}, so ${(b - a) * unit}.` }); },

  (r) => { const per = int(r, 2, 6), amount = int(r, 2, 12), k = int(r, 2, 5);
    return blankQ(`A recipe for ${per} people uses ${amount * per} grams of flour. How much is needed for ${per * k} people?`,
      amount * per * k,
      { hint: `${per * k} people is ${k} times as many.`,
        explanation: `${amount * per} × ${k} = ${amount * per * k} grams.` }); },

  (r) => { const per = int(r, 2, 9), n = int(r, 2, 6), m = int(r, 2, 9), thing = pick(r, THINGS);
    return blankQ(`${n} ${thing} cost $${per * n}. What do ${n * m} ${thing} cost, in dollars?`, per * n * m,
      { hint: 'Work out the cost of one first.',
        explanation: `One costs $${per}, so ${n * m} cost $${per * n * m}.` }); },

  (r) => { const scale = pick(r, [100, 200, 500, 1000, 2500]), cm = int(r, 2, 30);
    return blankQ(`A map has a scale of 1 : ${scale}. A length of ${cm} cm on the map is how many centimetres in real life?`,
      cm * scale,
      { hint: `Every centimetre on the map is ${scale} in real life.`,
        explanation: `${cm} × ${scale} = ${cm * scale} cm.` }); },

  (r) => { const a = int(r, 1, 5), b = int(r, 1, 5), k = int(r, 2, 12);
    return blankQ(`There are ${a} red ${a === 1 ? 'counter' : 'counters'} for every ${b} blue ${b === 1 ? 'one' : 'ones'}. If there are ${a * k} red counters, how many counters are there altogether?`,
      (a + b) * k,
      { hint: `Find what one part is worth, then count all ${a + b} parts.`,
        explanation: `One part is ${k}, and there are ${a + b} parts, so ${(a + b) * k}.` }); },

  (r) => { const cm = int(r, 2, 90), m = int(r, 1, 8);
    const d = gcd(cm, m * 100);
    return blankQ(`Write ${cm} cm : ${m} m as a ratio in its simplest form.`,
      `${cm / d} : ${m * 100 / d}`,
      { accept: [`${cm / d}:${m * 100 / d}`],
        hint: 'Put both sides in the same unit before you cancel.',
        explanation: `${m} m is ${m * 100} cm, so the ratio is ${cm} : ${m * 100} = ${cm / d} : ${m * 100 / d}.` }); },

  (r) => { const each = int(r, 2, 12), n = int(r, 2, 6), m = int(r, 3, 12);
    return blankQ(`${n} identical boxes weigh ${each * n} kg. What do ${m} of them weigh, in kilograms?`, each * m,
      { hint: 'Find the weight of one box first.',
        explanation: `${each * n} ÷ ${n} = ${each} kg each, so ${m} weigh ${each * m} kg.` }); }
];

/* ============================== PLACE VALUE ============================== */
export const placevalue = [
  (r) => { /* Four different non-zero digits, so "the digit 7" names one column
              and not two. A question with two right answers is a marking row
              waiting to happen. */
    const bag = [1, 2, 3, 4, 5, 6, 7, 8, 9], ds = [];
    while (ds.length < 4) { const i = int(r, 0, bag.length - 1); ds.push(bag.splice(i, 1)[0]); }
    const n = Number(ds.join('')), pos = int(r, 0, 3);
    const digit = ds[3 - pos], val = digit * Math.pow(10, pos);
    const names = ['units', 'tens', 'hundreds', 'thousands'];
    return blankQ(`Write the value of the digit ${digit} in ${n}.`, val,
      { hint: 'Which column is it standing in?',
        explanation: `It sits in the ${names[pos]} column, so it is worth ${val}.` }); },

  (r) => { const n = int(r, 1111, 9999);
    const parts = String(n).split('').map((d, i) => Number(d) * Math.pow(10, 3 - i)).filter(v => v > 0);
    return blankQ(`Write ${n} in expanded form.`, parts.join(' + '),
      { accept: [parts.join('+')],
        hint: 'Split it into thousands, hundreds, tens and units.',
        explanation: `${n} = ${parts.join(' + ')}.` }); },

  (r) => { const parts = [int(r, 1, 9) * 1000, int(r, 1, 9) * 100, int(r, 1, 9) * 10, int(r, 1, 9)];
    return blankQ(`Write this as one number: ${parts.join(' + ')}.`, parts.reduce((a, b) => a + b, 0),
      { hint: 'Each part fills a different column.',
        explanation: `The digits are ${parts.map(v => String(v)[0]).join(', ')}, so the number is ${parts.reduce((a, b) => a + b, 0)}.` }); },

  (r) => { const n = int(r, 1200, 8800), k = pick(r, [10, 100, 1000]);
    return blankQ(`Write the number that is ${k} more than ${n}.`, n + k,
      { hint: `Only the ${k === 10 ? 'tens' : k === 100 ? 'hundreds' : 'thousands'} column changes, unless it carries.`,
        explanation: `${n} + ${k} = ${n + k}.` }); },

  (r) => { const n = int(r, 2200, 9800), k = pick(r, [10, 100, 1000]);
    return blankQ(`Write the number that is ${k} less than ${n}.`, n - k,
      { hint: `Count back one step in the ${k === 10 ? 'tens' : k === 100 ? 'hundreds' : 'thousands'} column.`,
        explanation: `${n} − ${k} = ${n - k}.` }); },

  (r) => { const a = int(r, 1000, 9999); let b = int(r, 1000, 9999); if (b === a) b = a + 1;
    return blankQ(`Which is larger, ${a} or ${b}?`, Math.max(a, b),
      { hint: 'Compare the thousands digits first, then work right.',
        explanation: `${Math.max(a, b)} is larger.` }); },

  (r) => { const xs = [int(r, 100, 9999), int(r, 100, 9999), int(r, 100, 9999)];
    const sorted = [...new Set(xs)].sort((x, y) => x - y);
    if (sorted.length < 3) return blankQ(`Write these in order, smallest first: ${[11, 101, 1001].join(', ')}.`,
      '11, 101, 1001', { hint: 'Count the digits first.', explanation: 'Fewer digits means a smaller number here.' });
    return blankQ(`Write these in order, smallest first: ${xs.join(', ')}.`, sorted.join(', '),
      { accept: [sorted.join(',')],
        hint: 'A number with fewer digits is always smaller.',
        explanation: `In order: ${sorted.join(', ')}.` }); },

  (r) => { const n = int(r, 12, 999), k = pick(r, [10, 100]);
    return mathQ(pick(r, WORK_WAYS), `${n} × ${k} = ?`, n * k,
      { hint: `Every digit shifts ${k === 10 ? 'one place' : 'two places'} to the left and a zero fills the gap.`,
        explanation: `${n} × ${k} = ${n * k}.` }); },

  (r) => { const n = int(r, 120, 9999);
    return blankQ(`How many whole tens are there in ${n}?`, Math.floor(n / 10),
      { hint: 'Ignore the units digit.',
        explanation: `${n} ÷ 10 = ${num(n / 10)}, so there are ${Math.floor(n / 10)} whole tens.` }); },

  (r) => { const n = int(r, 1000, 9998), after = r() < 0.5;
    return blankQ(after ? `Write the number that comes after ${n}.` : `Write the number that comes before ${n}.`,
      after ? n + 1 : n - 1,
      { hint: after ? 'Count on one.' : 'Count back one.',
        explanation: `${after ? `${n} + 1 = ${n + 1}` : `${n} − 1 = ${n - 1}`}.` }); },

  (r) => { const n = int(r, 1200, 9999);
    return blankQ(`How many whole hundreds are there in ${n}?`, Math.floor(n / 100),
      { hint: 'Ignore the last two digits.',
        explanation: `${n} ÷ 100 = ${num(n / 100)}, so there are ${Math.floor(n / 100)} whole hundreds.` }); },

  (r) => { const th = int(r, 1, 9), h = int(r, 0, 9), t = int(r, 0, 9), u = int(r, 0, 9);
    return blankQ(`Write the number with ${th} thousand${th === 1 ? '' : 's'}, ${h} hundred${h === 1 ? '' : 's'}, ${t} ten${t === 1 ? '' : 's'} and ${u} unit${u === 1 ? '' : 's'}.`,
      th * 1000 + h * 100 + t * 10 + u,
      { hint: 'Write one digit per column, left to right.',
        explanation: `That is ${th * 1000 + h * 100 + t * 10 + u}.` }); },

  (r) => { const bag = [1, 2, 3, 4, 5, 6, 7, 8, 9], ds = [];
    while (ds.length < 4) { const i = int(r, 0, bag.length - 1); ds.push(bag.splice(i, 1)[0]); }
    const big = r() < 0.5;
    const sorted = [...ds].sort((a, b) => big ? b - a : a - b);
    return blankQ(`Using the digits ${ds.join(', ')} once each, write the ${big ? 'largest' : 'smallest'} possible number.`,
      Number(sorted.join('')),
      { hint: big ? 'Put the biggest digit in the thousands column.' : 'Put the smallest digit in the thousands column.',
        explanation: `${sorted.join('')} is the ${big ? 'largest' : 'smallest'} arrangement.` }); },

  (r) => { const bag = [1, 2, 3, 4, 5, 6, 7, 8, 9], ds = [];
    while (ds.length < 4) { const i = int(r, 0, bag.length - 1); ds.push(bag.splice(i, 1)[0]); }
    const pos = int(r, 1, 3), names = ['tenths', 'hundredths', 'thousandths'];
    const value = ds[pos] / Math.pow(10, pos);
    return blankQ(`Write the value of the digit ${ds[pos]} in ${ds[0]}.${ds.slice(1).join('')}.`, num(value),
      { hint: 'The first column after the point is tenths.',
        explanation: `It sits in the ${names[pos - 1]} column, so it is worth ${num(value)}.` }); }
];

/* ============================== ALGEBRA ============================== */
/* Two tiny formatters. Without them a maker writes `1x` and `+ -3`, and the
   sheet reads like machine output instead of like algebra. */
const co = (n, v) => (n === 1 ? v : n === -1 ? `−${v}` : `${n < 0 ? '−' : ''}${Math.abs(n)}${v}`);
const trail = n => (n === 0 ? '' : n > 0 ? ` + ${n}` : ` − ${Math.abs(n)}`);

export const expressions = [
  (r) => { const a = int(r, 2, 9), b = int(r, 2, 9), v = pick(r, ['a', 'x', 'y', 'n', 'p']);
    return mathQ(pick(r, SIMPLIFY_WAYS), `${co(a, v)} + ${co(b, v)}`, co(a + b, v),
      { accept: [`${a + b}`], hint: 'They are the same kind of term, so add the numbers in front.',
        explanation: `${a} + ${b} = ${a + b}, so the answer is ${co(a + b, v)}.` }); },

  (r) => { const a = int(r, 5, 12), b = int(r, 2, 4), c = int(r, 2, 6), v = pick(r, ['x', 'y', 'm', 't']);
    return mathQ(pick(r, SIMPLIFY_WAYS), `${co(a, v)} − ${co(b, v)} + ${co(c, v)}`, co(a - b + c, v),
      { accept: [`${a - b + c}`], hint: 'Work left to right on the numbers in front.',
        explanation: `${a} − ${b} + ${c} = ${a - b + c}, so the answer is ${co(a - b + c, v)}.` }); },

  (r) => { const a = int(r, 2, 8), b = int(r, 3, 9), c = int(r, 2, 7), d = int(r, 1, b - 1);
    return mathQ('Collect the like terms.', `${co(a, 'a')} + ${co(b, 'b')} + ${co(c, 'a')} − ${co(d, 'b')}`,
      `${co(a + c, 'a')} + ${co(b - d, 'b')}`,
      { accept: [`${co(b - d, 'b')} + ${co(a + c, 'a')}`],
        hint: 'The a terms go together and the b terms go together; they never mix.',
        explanation: `${a} + ${c} = ${a + c} of the a terms, and ${b} − ${d} = ${b - d} of the b terms.` }); },

  (r) => { const k = int(r, 2, 9), n = int(r, 2, 9), v = pick(r, ['x', 'y', 'n']);
    return mathQ('Expand the brackets.', `${k}(${v} + ${n})`, `${co(k, v)} + ${k * n}`,
      { hint: 'Everything inside the bracket is multiplied by the number outside.',
        explanation: `${k} × ${v} = ${co(k, v)} and ${k} × ${n} = ${k * n}.` }); },

  (r) => { const k = int(r, 2, 9), a = int(r, 2, 6), b = int(r, 2, 9), v = pick(r, ['x', 'y', 'm']);
    return mathQ('Expand the brackets.', `${k}(${co(a, v)} − ${b})`, `${co(k * a, v)} − ${k * b}`,
      { hint: 'Multiply both terms inside, and keep the minus sign.',
        explanation: `${k} × ${co(a, v)} = ${co(k * a, v)} and ${k} × ${b} = ${k * b}.` }); },

  (r) => { const p = int(r, 2, 6), q = int(r, 1, 8), s = int(r, 2, 6), t = int(r, 1, 8);
    return mathQ('Expand and simplify.', `${p}(x + ${q}) + ${s}(x + ${t})`,
      `${co(p + s, 'x')} + ${p * q + s * t}`,
      { hint: 'Expand each bracket first, then collect the x terms.',
        explanation: `${co(p, 'x')} + ${p * q} + ${co(s, 'x')} + ${s * t} = ${co(p + s, 'x')} + ${p * q + s * t}.` }); },

  (r) => { const k = int(r, 2, 9); let a = int(r, 2, 9), b = int(r, 2, 9);
    /* If a and b share a factor the bracket is not fully factorised, and the
       answer key would be marking a half-finished answer as the right one. */
    while (gcd(a, b) !== 1) b = b === 9 ? 2 : b + 1;
    return mathQ('Factorise.', `${co(k * a, 'x')} + ${k * b}`, `${k}(${co(a, 'x')} + ${b})`,
      { hint: `What number divides both ${k * a} and ${k * b}?`,
        explanation: `Both terms divide by ${k}, leaving ${k}(${co(a, 'x')} + ${b}).` }); },

  (r) => { const a = int(r, 2, 9), b = int(r, 1, 12), n = int(r, 2, 9);
    return blankQ(`Work out the value of ${co(a, 'x')} + ${b} when x = ${n}.`, a * n + b,
      { hint: `Replace x with ${n} first, then do the arithmetic.`,
        explanation: `${a} × ${n} = ${a * n}, and ${a * n} + ${b} = ${a * n + b}.` }); },

  (r) => { const a = int(r, 2, 5), b = int(r, 1, 12), n = int(r, 2, 7);
    return blankQ(`Work out the value of ${co(a, 'x²')} − ${b} when x = ${n}.`, a * n * n - b,
      { hint: 'Square before you multiply.',
        explanation: `${n}² = ${n * n}, then ${a} × ${n * n} = ${a * n * n}, minus ${b} leaves ${a * n * n - b}.` }); },

  (r) => { const a = int(r, 2, 9), b = int(r, 2, 9);
    return mathQ(pick(r, SIMPLIFY_WAYS), `${co(a, 'x')} × ${co(b, 'y')}`, `${a * b}xy`,
      { accept: [`${a * b}yx`], hint: 'Multiply the numbers, then write the letters together.',
        explanation: `${a} × ${b} = ${a * b}, so the answer is ${a * b}xy.` }); },

  (r) => { const a = int(r, 2, 6), b = int(r, 2, 6);
    return mathQ(pick(r, SIMPLIFY_WAYS), `x${a > 1 ? `^${a}` : ''} × x^${b}`, `x^${a + b}`,
      { accept: [`x${a + b}`], hint: 'Multiplying powers of the same letter adds the indices.',
        explanation: `${a} + ${b} = ${a + b}, so the answer is x^${a + b}.` }); },

  (r) => { const b = int(r, 2, 5), a = int(r, b + 1, 9);
    return mathQ(pick(r, SIMPLIFY_WAYS), `x^${a} ÷ x^${b}`, `x^${a - b}`,
      { accept: [`x${a - b}`, a - b === 1 ? 'x' : `x^${a - b}`],
        hint: 'Dividing powers of the same letter subtracts the indices.',
        explanation: `${a} − ${b} = ${a - b}, so the answer is x^${a - b}.` }); }
];

export const equations = [
  (r) => { const x = int(r, 1, 20), a = int(r, 1, 20);
    return mathQ(pick(r, SOLVE_WAYS), `x + ${a} = ${x + a}`, x,
      { hint: `Take ${a} off both sides.`, explanation: `${x + a} − ${a} = ${x}.` }); },

  (r) => { const x = int(r, 2, 20), a = int(r, 1, x);
    return mathQ(pick(r, SOLVE_WAYS), `x − ${a} = ${x - a}`, x,
      { hint: `Add ${a} to both sides.`, explanation: `${x - a} + ${a} = ${x}.` }); },

  (r) => { const x = int(r, 1, 20), a = int(r, 1, 20);
    return mathQ(pick(r, SOLVE_WAYS), `${a} + x = ${x + a}`, x,
      { hint: 'It does not matter which side x is written on.', explanation: `${x + a} − ${a} = ${x}.` }); },

  (r) => { const x = int(r, 2, 12), a = int(r, 2, 12);
    return mathQ(pick(r, SOLVE_WAYS), `${co(a, 'x')} = ${a * x}`, x,
      { hint: `Divide both sides by ${a}.`, explanation: `${a * x} ÷ ${a} = ${x}.` }); },

  (r) => { const x = int(r, 2, 15), a = int(r, 2, 9);
    return mathQ(pick(r, SOLVE_WAYS), `x ÷ ${a} = ${x}`, a * x,
      { hint: `Multiply both sides by ${a}.`, explanation: `${x} × ${a} = ${a * x}.` }); },

  (r) => { const x = int(r, 1, 12), a = int(r, 2, 9), b = int(r, 1, 15);
    return mathQ(pick(r, SOLVE_WAYS), `${co(a, 'x')} + ${b} = ${a * x + b}`, x,
      { hint: `Undo the + ${b} first, then the × ${a}.`,
        explanation: `${a * x + b} − ${b} = ${a * x}, and ${a * x} ÷ ${a} = ${x}.` }); },

  (r) => { const x = int(r, 2, 12), a = int(r, 2, 9), b = int(r, 1, Math.min(15, a * x));
    return mathQ(pick(r, SOLVE_WAYS), `${co(a, 'x')} − ${b} = ${a * x - b}`, x,
      { hint: `Add ${b} to both sides first.`,
        explanation: `${a * x - b} + ${b} = ${a * x}, and ${a * x} ÷ ${a} = ${x}.` }); },

  (r) => { const x = int(r, 1, 12), a = int(r, 2, 6), b = int(r, 1, 9);
    return mathQ(pick(r, SOLVE_WAYS), `${a}(x + ${b}) = ${a * (x + b)}`, x,
      { hint: `Divide by ${a} first, or expand the bracket — either works.`,
        explanation: `${a * (x + b)} ÷ ${a} = ${x + b}, and ${x + b} − ${b} = ${x}.` }); },

  (r) => { const x = int(r, 1, 12), a = int(r, 3, 9), c = int(r, 1, a - 1), b = int(r, 1, 12);
    const d = (a - c) * x + b;
    return mathQ(pick(r, SOLVE_WAYS), `${co(a, 'x')} + ${b} = ${co(c, 'x')} + ${d}`, x,
      { hint: `Take ${co(c, 'x')} off both sides so all the x is on one side.`,
        explanation: `${co(a - c, 'x')} + ${b} = ${d}, so ${co(a - c, 'x')} = ${d - b} and x = ${x}.` }); },

  (r) => { const x = int(r, 1, 15), c = int(r, 1, 15);
    return mathQ(pick(r, SOLVE_WAYS), `${x + c} − x = ${c}`, x,
      { hint: 'Move x to the other side so it is positive.',
        explanation: `${x + c} − ${c} = ${x}.` }); },

  (r) => { const a = int(r, 2, 6), x = a * int(r, 1, 8), b = int(r, 1, 12);
    return mathQ(pick(r, SOLVE_WAYS), `x ÷ ${a} + ${b} = ${x / a + b}`, x,
      { hint: `Subtract ${b}, then multiply by ${a}.`,
        explanation: `${x / a + b} − ${b} = ${x / a}, and ${x / a} × ${a} = ${x}.` }); },

  (r) => { const x = -int(r, 1, 12), a = int(r, 2, 6), b = int(r, 1, 20);
    return mathQ(pick(r, SOLVE_WAYS), `${co(a, 'x')} + ${b} = ${sn(a * x + b)}`, x,
      { hint: 'The answer is below zero — keep the sign as you divide.',
        explanation: `${sn(a * x + b)} − ${b} = ${sn(a * x)}, and ${sn(a * x)} ÷ ${a} = ${sn(x)}.` }); }
];

export const sequences = [
  (r) => { const a = int(r, 1, 20), d = int(r, 2, 9);
    const t = [a, a + d, a + 2 * d, a + 3 * d];
    return blankQ(`Write the next term: ${t.join(', ')}, …`, a + 4 * d,
      { hint: 'Find what is added each time.',
        explanation: `The sequence goes up by ${d}, so the next term is ${a + 4 * d}.` }); },

  (r) => { const d = int(r, 2, 9), a = int(r, 5 * d + 1, 5 * d + 60);
    const t = [a, a - d, a - 2 * d, a - 3 * d];
    return blankQ(`Write the next two terms: ${t.join(', ')}, …`, `${a - 4 * d}, ${a - 5 * d}`,
      { accept: [`${a - 4 * d} ${a - 5 * d}`],
        hint: 'The sequence is going down by a fixed amount.',
        explanation: `It falls by ${d} each time, so the next two are ${a - 4 * d} and ${a - 5 * d}.` }); },

  (r) => { const d = int(r, 2, 9), c = int(r, -6, 9);
    const t = [d + c, 2 * d + c, 3 * d + c, 4 * d + c];
    return blankQ(`Write the nth term rule for: ${t.map(sn).join(', ')}, …`, `${co(d, 'n')}${trail(c)}`,
      { accept: [`${d}n${c >= 0 ? '+' : '-'}${Math.abs(c)}`],
        hint: `The common difference tells you the number in front of n.`,
        explanation: `It goes up by ${d}, so start with ${co(d, 'n')}; ${d} × 1 = ${d} and the first term is ${d + c}, so the rule is ${co(d, 'n')}${trail(c)}.` }); },

  (r) => { const d = int(r, 2, 9), c = int(r, -6, 9), k = int(r, 8, 20);
    return blankQ(`The nth term of a sequence is ${co(d, 'n')}${trail(c)}. Find the ${k}th term.`,
      d * k + c,
      { hint: `Put n = ${k} into the rule.`,
        explanation: `${d} × ${k} = ${d * k}, ${c >= 0 ? `plus ${c}` : `minus ${Math.abs(c)}`} gives ${d * k + c}.` }); },

  (r) => { const a = int(r, 1, 15), d = int(r, 2, 12);
    return blankQ(`What is added each time in this sequence: ${[a, a + d, a + 2 * d, a + 3 * d].join(', ')}?`, d,
      { hint: 'Subtract one term from the next.',
        explanation: `${a + d} − ${a} = ${d}.` }); },

  (r) => { const a = int(r, 2, 20), d = int(r, 2, 9);
    return blankQ(`Fill in the gap: ${a}, ${a + d}, __, ${a + 3 * d}, ${a + 4 * d}`, a + 2 * d,
      { hint: 'Work out the step from the terms you can see.',
        explanation: `The step is ${d}, so the missing term is ${a + 2 * d}.` }); },

  (r) => { const a = int(r, 1, 5), k = int(r, 2, 4);
    const t = [a, a * k, a * k * k, a * k * k * k];
    return blankQ(`Write the next term: ${t.join(', ')}, …`, a * Math.pow(k, 4),
      { hint: 'This one multiplies rather than adds.',
        explanation: `Each term is ${k} times the one before, so the next is ${a * Math.pow(k, 4)}.` }); },

  (r) => { const s = int(r, 1, 6);
    const t = [s, s + 1, s + 2, s + 3].map(n => n * n);
    return blankQ(`Write the next term: ${t.join(', ')}, …`, (s + 4) * (s + 4),
      { hint: 'These are square numbers.',
        explanation: `They are ${s}², ${s + 1}², ${s + 2}², ${s + 3}², so the next is ${s + 4}² = ${(s + 4) * (s + 4)}.` }); },

  (r) => { const d = int(r, 2, 9), c = int(r, 0, 9), pos = int(r, 6, 15);
    return blankQ(`The nth term of a sequence is ${co(d, 'n')}${trail(c)}. Which term is equal to ${d * pos + c}?`,
      pos,
      { hint: 'Set the rule equal to the number and solve for n.',
        explanation: `${co(d, 'n')}${trail(c)} = ${d * pos + c} gives ${co(d, 'n')} = ${d * pos}, so n = ${pos}.` }); },

  (r) => { const a = int(r, 30, 90), d = int(r, 2, 9);
    return blankQ(`Write the term before ${a} in a sequence that goes up by ${d} each time.`, a - d,
      { hint: 'Go backwards by one step.',
        explanation: `${a} − ${d} = ${a - d}.` }); },

  (r) => { const a = int(r, 1, 6), k = int(r, 2, 4);
    return blankQ(`What is each term multiplied by in this sequence: ${[a, a * k, a * k * k, a * k * k * k].join(', ')}?`, k,
      { hint: 'Divide one term by the one before it.',
        explanation: `${a * k} ÷ ${a} = ${k}.` }); },

  (r) => { const a = int(r, 1, 6), b = int(r, 2, 9);
    const t = [a, b, a + b, a + 2 * b];
    return blankQ(`Each term is the sum of the two before it. Write the next term: ${t.join(', ')}, …`,
      2 * a + 3 * b,
      { hint: 'Add the last two terms you can see.',
        explanation: `${a + b} + ${a + 2 * b} = ${2 * a + 3 * b}.` }); },

  (r) => { const s = int(r, 1, 6);
    const tri = n => n * (n + 1) / 2;
    const t = [s, s + 1, s + 2, s + 3].map(tri);
    return blankQ(`Write the next term: ${t.join(', ')}, …`, tri(s + 4),
      { hint: 'The gaps between the terms go up by one each time.',
        explanation: `The gaps are ${s + 1}, ${s + 2}, ${s + 3}, so the next gap is ${s + 4} and the term is ${tri(s + 4)}.` }); },

  (r) => { const d = int(r, 2, 9), c = int(r, -8, 9);
    return blankQ(`The nth term of a sequence is ${co(d, 'n')}${trail(c)}. Write the first term.`, d + c,
      { hint: 'Put n = 1 into the rule.',
        explanation: `${d} × 1 = ${d}${c >= 0 ? ` plus ${c}` : ` minus ${Math.abs(c)}`} gives ${sn(d + c)}.` }); },

  (r) => { const d = int(r, 2, 9), first = int(r, 30, 90);
    const t = [first, first - d, first - 2 * d, first - 3 * d];
    return blankQ(`Write the nth term rule for: ${t.join(', ')}, …`,
      `${co(-d, 'n')}${trail(first + d)}`,
      { accept: [`-${d}n+${first + d}`, `${first + d} − ${co(d, 'n')}`],
        hint: 'A falling sequence has a negative number in front of n.',
        explanation: `It falls by ${d}, so the rule starts ${co(-d, 'n')}; at n = 1 that gives ${-d}, and the first term is ${first}, so add ${first + d}.` }); }
];

/* ============================== STANDARD FORM ============================== */
const SF = (a, b) => `${a} × 10^${b}`;

/* Write a standard-form value out longhand from its digits. num() rounds to
   six decimal places, so it turns 3.1 × 10^-6 into 0.000003 — an answer key
   that is simply wrong, and wrong in a way nobody notices until a class has
   been marked on it. */
const plain = (mantissa, pow) => {
  const [w, f = ''] = String(mantissa).split('.');
  const digits = w + f;
  if (pow >= 0) {
    const shift = f.length - pow;
    return shift <= 0
      ? digits + '0'.repeat(-shift)
      : `${digits.slice(0, digits.length - shift)}.${digits.slice(digits.length - shift)}`;
  }
  const zeros = -pow - w.length;
  return zeros >= 0
    ? `0.${'0'.repeat(zeros)}${digits}`
    : `${digits.slice(0, w.length + pow)}.${digits.slice(w.length + pow)}`;
};

export const standardform = [
  (r) => { const m = int(r, 11, 999), b = int(r, 3, 8);
    const mant = m / Math.pow(10, String(m).length - 1);
    const pow = b + String(m).length - 1;
    return blankQ(`Write ${m}${'0'.repeat(b)} in standard form.`, SF(num(mant), pow),
      { accept: [`${num(mant)}x10^${pow}`, `${num(mant)}*10^${pow}`, `${num(mant)}e${pow}`],
        hint: 'Put the decimal point after the first digit, then count how far it moved.',
        explanation: `The point moves ${pow} places, so the number is ${SF(num(mant), pow)}.` }); },

  (r) => { const m = int(r, 11, 99), z = int(r, 2, 6);
    const mant = m / 10, pow = -(z + 1);
    return blankQ(`Write 0.${'0'.repeat(z)}${m} in standard form.`, SF(num(mant), pow),
      { accept: [`${num(mant)}x10^${pow}`, `${num(mant)}*10^${pow}`, `${num(mant)}e${pow}`],
        hint: 'A number below 1 has a negative power of ten.',
        explanation: `The point moves ${z + 1} places to the right, so the power is ${pow}.` }); },

  (r) => { const m = int(r, 10, 99) / 10, b = int(r, 2, 6);
    return blankQ(`Write ${SF(num(m), b)} as an ordinary number.`, plain(num(m), b),
      { hint: `Move the decimal point ${b} places to the right.`,
        explanation: `${num(m)} × ${Math.pow(10, b)} = ${plain(num(m), b)}.` }); },

  (r) => { const m = int(r, 10, 99) / 10, b = int(r, 2, 6);
    return blankQ(`Write ${SF(num(m), -b)} as an ordinary number.`, plain(num(m), -b),
      { hint: `A negative power moves the point ${b} places to the left.`,
        explanation: `${num(m)} ÷ ${Math.pow(10, b)} = ${plain(num(m), -b)}.` }); },

  (r) => { const a = int(r, 2, 4), c = int(r, 2, 4), p = int(r, 2, 7), q = int(r, 2, 7);
    /* The product of the two front numbers can reach 16, and 16 × 10^n is not
       standard form. Carrying the extra ten into the power is the whole point
       of the question, so the key has to do it too. */
    const prod = a * c, over = prod >= 10;
    const mant = over ? num(prod / 10) : String(prod), pow = p + q + (over ? 1 : 0);
    return blankQ(`Work out (${SF(a, p)}) × (${SF(c, q)}). Give your answer in standard form.`,
      SF(mant, pow),
      { accept: [`${mant}x10^${pow}`, `${mant}*10^${pow}`],
        hint: 'Multiply the front numbers and add the powers, then check the front number is below 10.',
        explanation: `${a} × ${c} = ${prod} and ${p} + ${q} = ${p + q}${over ? `; ${prod} = ${mant} × 10, so the power rises to ${pow}` : ''}.` }); },

  (r) => { const c = int(r, 2, 3), k = int(r, 2, 3), q = int(r, 2, 5), p = q + int(r, 1, 4);
    return blankQ(`Work out (${SF(c * k, p)}) ÷ (${SF(c, q)}). Give your answer in standard form.`,
      SF(k, p - q),
      { accept: [`${k}x10^${p - q}`, `${k}*10^${p - q}`],
        hint: 'Divide the front numbers and subtract the powers.',
        explanation: `${c * k} ÷ ${c} = ${k} and ${p} − ${q} = ${p - q}.` }); },

  (r) => { const b = int(r, 2, 9);
    return blankQ(`Write 10^${b} as an ordinary number.`, Math.pow(10, b),
      { hint: `That is 1 followed by ${b} zeros.`,
        explanation: `10^${b} = ${Math.pow(10, b)}.` }); },

  (r) => { const a = int(r, 11, 44) / 10, c = int(r, 11, 44) / 10, p = int(r, 3, 8);
    return blankQ(`Work out (${SF(num(a), p)}) + (${SF(num(c), p)}). Give your answer in standard form.`,
      SF(num(a + c), p),
      { accept: [`${num(a + c)}x10^${p}`, `${num(a + c)}*10^${p}`],
        hint: 'The powers already match, so just add the front numbers.',
        explanation: `${num(a)} + ${num(c)} = ${num(a + c)}, and the power stays at ${p}.` }); },

  (r) => { const m = int(r, 11, 99), p = int(r, 2, 6);
    const mant = m / 10, pow = p + 1;
    return blankQ(`${SF(m, p)} is not in standard form. Write it correctly.`, SF(num(mant), pow),
      { accept: [`${num(mant)}x10^${pow}`, `${num(mant)}*10^${pow}`],
        hint: 'The front number must be at least 1 and less than 10.',
        explanation: `${m} = ${num(mant)} × 10, so the power goes up by one to ${pow}.` }); },

  (r) => { const a = int(r, 2, 3), p = int(r, 2, 6);
    return blankQ(`Work out (${SF(a, p)})². Give your answer in standard form.`, SF(a * a, 2 * p),
      { accept: [`${a * a}x10^${2 * p}`, `${a * a}*10^${2 * p}`],
        hint: 'Square the front number and double the power.',
        explanation: `${a}² = ${a * a} and ${p} × 2 = ${2 * p}.` }); },

  (r) => { const a = int(r, 11, 99) / 10, p = int(r, 2, 6), k = pick(r, [10, 100]);
    const pow = p + String(k).length - 1;
    return blankQ(`A number is ${k} times as big as ${SF(num(a), p)}. Write it in standard form.`,
      SF(num(a), pow),
      { accept: [`${num(a)}x10^${pow}`, `${num(a)}*10^${pow}`],
        hint: `Multiplying by ${k} raises the power by ${String(k).length - 1}.`,
        explanation: `The front number does not change; the power goes from ${p} to ${pow}.` }); },

  (r) => { const c = int(r, 2, 4), k = int(r, 2, 4), p = int(r, 2, 5), q = p + int(r, 1, 4);
    return blankQ(`Work out (${SF(c * k, p)}) ÷ (${SF(c, q)}). Give your answer in standard form.`,
      SF(k, p - q),
      { accept: [`${k}x10^${p - q}`, `${k}*10^${p - q}`],
        hint: 'Dividing by a bigger power gives a negative index.',
        explanation: `${c * k} ÷ ${c} = ${k} and ${p} − ${q} = ${p - q}.` }); },

  (r) => { const a = int(r, 45, 95) / 10, c = int(r, 11, 40) / 10, p = int(r, 3, 8);
    return blankQ(`Work out (${SF(num(a), p)}) − (${SF(num(c), p)}). Give your answer in standard form.`,
      SF(num(Math.round((a - c) * 10) / 10), p),
      { accept: [`${num(Math.round((a - c) * 10) / 10)}x10^${p}`],
        hint: 'The powers match, so subtract the front numbers.',
        explanation: `${num(a)} − ${num(c)} = ${num(Math.round((a - c) * 10) / 10)}, and the power stays at ${p}.` }); },

  (r) => { const k = int(r, 2, 8);
    return blankQ(`Write 1 ÷ 10^${k} as a power of ten.`, `10^-${k}`,
      { accept: [`10^(-${k})`, `1/10^${k}`],
        hint: 'Dividing by a power of ten gives a negative index.',
        explanation: `1 ÷ 10^${k} = 10^-${k}.` }); }
];

/* ================================ SURDS ================================ */
export const surds = [
  (r) => { const k = int(r, 2, 6), m = pick(r, [2, 3, 5, 6, 7, 10, 11]);
    return mathQ(pick(r, SIMPLIFY_WAYS), `√${k * k * m}`, `${k}√${m}`,
      { accept: [`${k}sqrt${m}`, `${k} root ${m}`],
        hint: `Look for the largest square number that divides ${k * k * m}.`,
        explanation: `${k * k * m} = ${k * k} × ${m}, and √${k * k} = ${k}.` }); },

  (r) => { const a = pick(r, [2, 3, 5, 6, 7]), b = pick(r, [2, 3, 5, 6, 7]);
    return mathQ(pick(r, SIMPLIFY_WAYS), `√${a} × √${b}`, a === b ? String(a) : `√${a * b}`,
      { accept: a === b ? [] : [`sqrt${a * b}`],
        hint: 'Two roots multiplied become one root of the product.',
        explanation: a === b ? `√${a} × √${a} = ${a}.` : `√${a} × √${b} = √${a * b}.` }); },

  (r) => { const b = pick(r, [2, 3, 5, 7]); let k = pick(r, [2, 3, 5, 6]);
    /* √25 ÷ √5 is a fair question and a confusing one: the left-hand root is a
       whole number, and the sheet reads as if it had a typo. */
    while (Number.isInteger(Math.sqrt(b * k))) k = k === 6 ? 2 : k + 1;
    return mathQ(pick(r, SIMPLIFY_WAYS), `√${b * k} ÷ √${b}`, `√${k}`,
      { accept: [`sqrt${k}`],
        hint: 'One root divided by another is the root of the quotient.',
        explanation: `${b * k} ÷ ${b} = ${k}, so the answer is √${k}.` }); },

  (r) => { const a = int(r, 2, 9), b = int(r, 2, 9), m = pick(r, [2, 3, 5, 7, 11]);
    return mathQ(pick(r, SIMPLIFY_WAYS), `${a}√${m} + ${b}√${m}`, `${a + b}√${m}`,
      { accept: [`${a + b}sqrt${m}`],
        hint: `They are both lots of √${m}, so add the numbers in front.`,
        explanation: `${a} + ${b} = ${a + b}, giving ${a + b}√${m}.` }); },

  (r) => { const b = int(r, 2, 6), a = int(r, b + 1, 12), m = pick(r, [2, 3, 5, 7, 11]);
    return mathQ(pick(r, SIMPLIFY_WAYS), `${a}√${m} − ${b}√${m}`, a - b === 1 ? `√${m}` : `${a - b}√${m}`,
      { accept: [`${a - b}√${m}`, `${a - b}sqrt${m}`],
        hint: `Subtract the numbers in front and keep √${m}.`,
        explanation: `${a} − ${b} = ${a - b}, giving ${a - b === 1 ? `√${m}` : `${a - b}√${m}`}.` }); },

  (r) => { const m = int(r, 2, 30);
    return mathQ(pick(r, SIMPLIFY_WAYS), `(√${m})²`, m,
      { hint: 'Squaring undoes a square root.', explanation: `(√${m})² = ${m}.` }); },

  (r) => { const m = pick(r, [2, 3, 5, 6, 7, 10, 11, 13]);
    return blankQ(`Rationalise the denominator of 1/√${m}.`, `√${m}/${m}`,
      { accept: [`sqrt${m}/${m}`, `1/${m} √${m}`],
        hint: `Multiply the top and the bottom by √${m}.`,
        explanation: `1/√${m} × √${m}/√${m} = √${m}/${m}.` }); },

  (r) => { const m = pick(r, [2, 3, 5, 6, 7, 10]);
    return mathQ(pick(r, SIMPLIFY_WAYS), `√${m} × √${m}`, m,
      { hint: 'A root multiplied by itself gives the number back.',
        explanation: `√${m} × √${m} = ${m}.` }); },

  (r) => { const m = pick(r, [2, 3, 5, 7]), b = int(r, 2, 9);
    return mathQ('Expand and simplify.', `√${m}(√${m} + ${b})`, `${m} + ${b}√${m}`,
      { accept: [`${m}+${b}sqrt${m}`],
        hint: 'Multiply the outside root into both terms.',
        explanation: `√${m} × √${m} = ${m}, and √${m} × ${b} = ${b}√${m}.` }); },

  (r) => { const k = int(r, 2, 5), m = pick(r, [2, 3, 5, 6, 7]);
    return mathQ(pick(r, SIMPLIFY_WAYS), `(${k}√${m})²`, k * k * m,
      { hint: 'Square the number in front and square the root separately.',
        explanation: `${k}² = ${k * k} and (√${m})² = ${m}, so the answer is ${k * k * m}.` }); }
];

/* ============================== LOGARITHMS ============================== */
export const logarithms = [
  (r) => { const b = pick(r, [2, 3, 5, 10]), k = int(r, 2, 6);
    return mathQ(pick(r, EVAL_WAYS), `log_${b}(${Math.pow(b, k)})`, k,
      { hint: `Ask: ${b} to what power gives ${Math.pow(b, k)}?`,
        explanation: `${b}^${k} = ${Math.pow(b, k)}, so the logarithm is ${k}.` }); },

  (r) => { const k = int(r, 1, 6);
    return mathQ(pick(r, EVAL_WAYS), `log(${Math.pow(10, k)})`, k,
      { hint: 'A log with no base written means base 10.',
        explanation: `10^${k} = ${Math.pow(10, k)}.` }); },

  (r) => { const b = pick(r, [2, 3, 4, 5, 7, 10]);
    return mathQ(pick(r, EVAL_WAYS), `log_${b}(1)`, 0,
      { hint: 'Any number to the power zero is 1.', explanation: `${b}^0 = 1, so the answer is 0.` }); },

  (r) => { const b = pick(r, [2, 3, 4, 5, 7, 10]);
    return mathQ(pick(r, EVAL_WAYS), `log_${b}(${b})`, 1,
      { hint: 'The base to the power one is the base itself.', explanation: `${b}^1 = ${b}, so the answer is 1.` }); },

  (r) => { const b = pick(r, [2, 3, 5]), p = int(r, 1, 4), q = int(r, 1, 4);
    return mathQ(pick(r, EVAL_WAYS), `log_${b}(${Math.pow(b, p)}) + log_${b}(${Math.pow(b, q)})`, p + q,
      { hint: 'Adding two logs of the same base multiplies the numbers inside.',
        explanation: `${p} + ${q} = ${p + q}.` }); },

  (r) => { const b = pick(r, [2, 3, 5]), q = int(r, 1, 3), p = q + int(r, 1, 3);
    return mathQ(pick(r, EVAL_WAYS), `log_${b}(${Math.pow(b, p)}) − log_${b}(${Math.pow(b, q)})`, p - q,
      { hint: 'Subtracting two logs of the same base divides the numbers inside.',
        explanation: `${p} − ${q} = ${p - q}.` }); },

  (r) => { const b = pick(r, [2, 3, 5, 10]), k = int(r, 2, 6);
    return mathQ(pick(r, SOLVE_WAYS), `${b}^x = ${Math.pow(b, k)}`, k,
      { hint: 'Write both sides as a power of the same number.',
        explanation: `${Math.pow(b, k)} = ${b}^${k}, so x = ${k}.` }); },

  (r) => { const b = pick(r, [2, 3, 4, 5]), k = int(r, 2, 5);
    return blankQ(`If log_${b}(x) = ${k}, what is x?`, Math.pow(b, k),
      { hint: 'Rewrite the logarithm as a power.',
        explanation: `x = ${b}^${k} = ${Math.pow(b, k)}.` }); },

  (r) => { const b = pick(r, [2, 3, 5]), k = int(r, 2, 5), p = int(r, 2, 4);
    return mathQ(pick(r, EVAL_WAYS), `log_${b}(${Math.pow(b, k)}^${p})`, k * p,
      { hint: 'A power inside a logarithm comes out in front.',
        explanation: `${p} × ${k} = ${k * p}.` }); },

  (r) => { const k = int(r, 2, 8);
    return mathQ(pick(r, EVAL_WAYS), `ln(e^${k})`, k,
      { hint: 'A natural logarithm undoes a power of e.', explanation: `ln(e^${k}) = ${k}.` }); }
];

/* ============================== CONVERSIONS ============================== */
export const conversions = [
  (r) => { const n = int(r, 2, 40);
    return blankQ(`Convert ${n} km to metres.`, n * 1000,
      { hint: 'There are 1000 metres in a kilometre.', explanation: `${n} × 1000 = ${n * 1000} m.` }); },

  (r) => { const n = int(r, 2, 90);
    return blankQ(`Convert ${n} m to centimetres.`, n * 100,
      { hint: 'There are 100 centimetres in a metre.', explanation: `${n} × 100 = ${n * 100} cm.` }); },

  (r) => { const n = int(r, 2, 90);
    return blankQ(`Convert ${n} cm to millimetres.`, n * 10,
      { hint: 'There are 10 millimetres in a centimetre.', explanation: `${n} × 10 = ${n * 10} mm.` }); },

  (r) => { const n = int(r, 2, 40);
    return blankQ(`Convert ${n} kg to grams.`, n * 1000,
      { hint: 'There are 1000 grams in a kilogram.', explanation: `${n} × 1000 = ${n * 1000} g.` }); },

  (r) => { const n = int(r, 2, 30);
    return blankQ(`Convert ${n} litres to millilitres.`, n * 1000,
      { hint: 'There are 1000 millilitres in a litre.', explanation: `${n} × 1000 = ${n * 1000} ml.` }); },

  (r) => { const n = int(r, 11, 99) * 100;
    return blankQ(`Convert ${n} m to kilometres.`, num(n / 1000),
      { hint: 'Divide by 1000.', explanation: `${n} ÷ 1000 = ${num(n / 1000)} km.` }); },

  (r) => { const n = int(r, 11, 99) * 10;
    return blankQ(`Convert ${n} g to kilograms.`, num(n / 1000),
      { hint: 'Divide by 1000.', explanation: `${n} ÷ 1000 = ${num(n / 1000)} kg.` }); },

  (r) => { const n = int(r, 11, 99) * 10;
    return blankQ(`Convert ${n} ml to litres.`, num(n / 1000),
      { hint: 'Divide by 1000.', explanation: `${n} ÷ 1000 = ${num(n / 1000)} l.` }); },

  (r) => { const n = int(r, 11, 990);
    return blankQ(`Convert ${n} cm to metres.`, num(n / 100),
      { hint: 'Divide by 100.', explanation: `${n} ÷ 100 = ${num(n / 100)} m.` }); },

  (r) => { const n = int(r, 2, 40);
    return blankQ(`Convert ${n} minutes to seconds.`, n * 60,
      { hint: 'A minute is 60 seconds.', explanation: `${n} × 60 = ${n * 60} seconds.` }); },

  (r) => { const n = int(r, 2, 24);
    return blankQ(`Convert ${n} hours to minutes.`, n * 60,
      { hint: 'An hour is 60 minutes.', explanation: `${n} × 60 = ${n * 60} minutes.` }); },

  (r) => { const n = int(r, 2, 12);
    return blankQ(`Convert ${n} tonnes to kilograms.`, n * 1000,
      { hint: 'A tonne is 1000 kilograms.', explanation: `${n} × 1000 = ${n * 1000} kg.` }); },

  (r) => { const n = int(r, 2, 90) * 10;
    return blankQ(`Convert ${n} mm to centimetres.`, n / 10,
      { hint: 'Divide by 10.', explanation: `${n} ÷ 10 = ${n / 10} cm.` }); },

  (r) => { const n = int(r, 2, 40) * 60;
    return blankQ(`Convert ${n} seconds to minutes.`, n / 60,
      { hint: 'Divide by 60.', explanation: `${n} ÷ 60 = ${n / 60} minutes.` }); },

  (r) => { const n = int(r, 2, 30);
    return blankQ(`Convert ${n} days to hours.`, n * 24,
      { hint: 'A day is 24 hours.', explanation: `${n} × 24 = ${n * 24} hours.` }); },

  (r) => { const m = int(r, 1, 9), cm = int(r, 5, 95);
    return blankQ(`Add ${m} m and ${cm} cm. Give the answer in centimetres.`, m * 100 + cm,
      { hint: 'Put both lengths in centimetres first.',
        explanation: `${m} m is ${m * 100} cm, and ${m * 100} + ${cm} = ${m * 100 + cm} cm.` }); }
];

/* ================================= TIME ================================= */
/* The subject of each question is drawn from a list, so a sheet of ten reads
   as ten situations rather than ten copies of one. */
const EVENTS = ['the film', 'the lesson', 'the match', 'the rehearsal', 'the meeting',
                'the swim session', 'the concert', 'the workshop', 'the exam', 'the tour'];
const JOURNEYS = ['the train', 'the bus', 'the flight', 'the ferry', 'the coach',
                  'the night train', 'the tram', 'the shuttle'];
const cap = w => `${w[0].toUpperCase()}${w.slice(1)}`;
const hhmm = m => `${String(Math.floor((m % 1440) / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

export const timemath = [
  (r) => { const start = int(r, 6, 20) * 60 + int(r, 0, 11) * 5, add = int(r, 3, 22) * 5, e = pick(r, EVENTS);
    return blankQ(`${cap(e)} starts at ${hhmm(start)} and lasts ${add} minutes. When does it end?`,
      hhmm(start + add),
      { hint: 'Count on to the next whole hour first.',
        explanation: `${hhmm(start)} plus ${add} minutes is ${hhmm(start + add)}.` }); },

  (r) => { const end = int(r, 8, 22) * 60 + int(r, 0, 11) * 5, back = int(r, 3, 22) * 5, e = pick(r, EVENTS);
    return blankQ(`${cap(e)} ends at ${hhmm(end)} after ${back} minutes. When did it start?`,
      hhmm(end - back),
      { hint: 'Count backwards to the hour, then take off what is left.',
        explanation: `${hhmm(end)} minus ${back} minutes is ${hhmm(end - back)}.` }); },

  (r) => { const start = int(r, 6, 16) * 60 + int(r, 0, 11) * 5, gap = int(r, 5, 40) * 5;
    return blankQ(`How many minutes are there between ${hhmm(start)} and ${hhmm(start + gap)}?`, gap,
      { hint: 'Go up to the next hour, then count the whole hours, then the rest.',
        explanation: `From ${hhmm(start)} to ${hhmm(start + gap)} is ${gap} minutes.` }); },

  (r) => { const total = int(r, 70, 500);
    return blankQ(`Write ${total} minutes as hours and minutes.`,
      `${Math.floor(total / 60)} h ${total % 60} min`,
      { accept: [`${Math.floor(total / 60)}h ${total % 60}m`, `${Math.floor(total / 60)} hours ${total % 60} minutes`,
                 `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`],
        hint: 'How many whole 60s fit inside it?',
        explanation: `${total} ÷ 60 = ${Math.floor(total / 60)} remainder ${total % 60}.` }); },

  (r) => { const h = int(r, 1, 9), m = int(r, 2, 59);
    return blankQ(`Write ${h} hours and ${m} minutes as a number of minutes.`, h * 60 + m,
      { hint: 'Turn the hours into minutes first.',
        explanation: `${h} × 60 = ${h * 60}, plus ${m} gives ${h * 60 + m}.` }); },

  (r) => { const h = int(r, 1, 11), m = int(r, 0, 11) * 5, pm = r() < 0.5;
    const mins = (pm ? h + 12 : h) * 60 + m;
    return blankQ(`Write ${h}:${String(m).padStart(2, '0')} ${pm ? 'pm' : 'am'} using the 24-hour clock.`,
      hhmm(mins),
      { hint: pm ? 'Add 12 to the hours for an afternoon time.' : 'Morning hours keep their number, padded to two digits.',
        explanation: `${h}:${String(m).padStart(2, '0')} ${pm ? 'pm' : 'am'} is ${hhmm(mins)}.` }); },

  (r) => { const h = int(r, 13, 23), m = int(r, 0, 11) * 5;
    return blankQ(`Write ${hhmm(h * 60 + m)} using the 12-hour clock.`,
      `${h - 12}:${String(m).padStart(2, '0')} pm`,
      { accept: [`${h - 12}.${String(m).padStart(2, '0')} pm`, `${h - 12}:${String(m).padStart(2, '0')}pm`],
        hint: 'Take 12 off the hours and add pm.',
        explanation: `${h} − 12 = ${h - 12}, so it is ${h - 12}:${String(m).padStart(2, '0')} pm.` }); },

  (r) => { const start = int(r, 21, 23) * 60 + int(r, 0, 11) * 5, add = int(r, 20, 60) * 5, e = pick(r, JOURNEYS);
    return blankQ(`${cap(e)} leaves at ${hhmm(start)} and takes ${add} minutes. When does it arrive?`,
      hhmm(start + add),
      { hint: 'The clock passes midnight and starts again at 00:00.',
        explanation: `${hhmm(start)} plus ${add} minutes is ${hhmm(start + add)} the next day.` }); },

  (r) => { const w = int(r, 2, 20);
    return blankQ(`How many days are there in ${w} weeks?`, w * 7,
      { hint: 'A week is 7 days.', explanation: `${w} × 7 = ${w * 7} days.` }); },

  (r) => { const total = int(r, 70, 900);
    return blankQ(`Write ${total} seconds as minutes and seconds.`,
      `${Math.floor(total / 60)} min ${total % 60} s`,
      { accept: [`${Math.floor(total / 60)}m ${total % 60}s`, `${Math.floor(total / 60)} minutes ${total % 60} seconds`],
        hint: 'Sixty seconds make a minute.',
        explanation: `${total} ÷ 60 = ${Math.floor(total / 60)} remainder ${total % 60}.` }); }
];

/* ================================= MONEY ================================= */
/* Singular and plural together, because "9 of a paint set" is the kind of
   sentence that tells a teacher no one read the sheet before printing it. */
const ITEMS = [['a notebook', 'notebooks'], ['a pencil case', 'pencil cases'],
               ['a water bottle', 'water bottles'], ['a comic', 'comics'],
               ['a bus ticket', 'bus tickets'], ['a sandwich', 'sandwiches'],
               ['a pack of stickers', 'packs of stickers'], ['a plant pot', 'plant pots'],
               ['a keyring', 'keyrings'], ['a torch', 'torches'],
               ['a puzzle book', 'puzzle books'], ['a bag of apples', 'bags of apples'],
               ['a skipping rope', 'skipping ropes'], ['a paint set', 'paint sets'],
               ['a phone case', 'phone cases']];
const NAMES = ['Maya', 'Omar', 'Priya', 'Ellis', 'Tomas', 'Nadia', 'Kofi', 'Lena',
               'Idris', 'Rosa', 'Hana', 'Jonas', 'Amara', 'Felix', 'Sofia'];

export const moneymath = [
  (r) => { const a = int(r, 105, 995), b = int(r, 105, 995);
    return blankQ(`Add $${money(a / 100)} and $${money(b / 100)}. Give the answer in dollars.`,
      money((a + b) / 100),
      { hint: 'Line up the decimal points.',
        explanation: `$${money(a / 100)} + $${money(b / 100)} = $${money((a + b) / 100)}.` }); },

  (r) => { const note = pick(r, [10, 20, 50]), cost = int(r, note * 35, note * 100 - 5), n = pick(r, NAMES);
    return blankQ(`${n} pays with a $${note} note for something costing $${money(cost / 100)}. What is the change?`,
      money((note * 100 - cost) / 100),
      { hint: 'Count on from the price up to the note.',
        explanation: `$${note}.00 − $${money(cost / 100)} = $${money((note * 100 - cost) / 100)}.` }); },

  (r) => { const price = int(r, 105, 899), qty = int(r, 2, 9), [one, many] = pick(r, ITEMS);
    return blankQ(`${cap(one)} costs $${money(price / 100)}. What do ${qty} ${many} cost?`,
      money(price * qty / 100),
      { hint: 'Multiply as whole cents, then put the point back.',
        explanation: `${price} × ${qty} = ${price * qty} cents, which is $${money(price * qty / 100)}.` }); },

  (r) => { const people = int(r, 2, 8), each = int(r, 105, 950), n = pick(r, NAMES);
    return blankQ(`${n} and ${people - 1} friend${people - 1 === 1 ? '' : 's'} split a bill of $${money(each * people / 100)} equally. What does each pay?`,
      money(each / 100),
      { hint: `There are ${people} people paying.`,
        explanation: `$${money(each * people / 100)} ÷ ${people} = $${money(each / 100)}.` }); },

  (r) => { const a = int(r, 105, 600), b = int(r, 105, 600), c = int(r, 105, 600);
    return blankQ(`Add $${money(a / 100)}, $${money(b / 100)} and $${money(c / 100)}. Give the answer in dollars.`,
      money((a + b + c) / 100),
      { hint: 'Add the cents first, then carry into the dollars.',
        explanation: `The total is $${money((a + b + c) / 100)}.` }); },

  (r) => { const p = pick(r, [10, 20, 25, 50]), price = int(r, 2, 60) * 100, [one] = pick(r, ITEMS);
    return blankQ(`${cap(one)} costs $${money(price / 100)} and is reduced by ${p}%. What is the saving, in dollars?`,
      money(price * p / 100 / 100),
      { hint: `Divide by ${100 / p}.`,
        explanation: `${p}% of $${money(price / 100)} is $${money(price * p / 100 / 100)}.` }); },

  (r) => { const p = pick(r, [10, 20, 25, 50]), price = int(r, 2, 60) * 100, [one] = pick(r, ITEMS);
    return blankQ(`${cap(one)} costs $${money(price / 100)} and is reduced by ${p}%. What is the new price, in dollars?`,
      money(price * (100 - p) / 100 / 100),
      { hint: 'Work out the reduction, then take it off the old price.',
        explanation: `The saving is $${money(price * p / 100 / 100)}, leaving $${money(price * (100 - p) / 100 / 100)}.` }); },

  (r) => { const price = int(r, 2, 9) * 50, budget = int(r, 10, 40) * 100, [one, many] = pick(r, ITEMS);
    return blankQ(`${cap(one)} costs $${money(price / 100)}. How many ${many} can be bought with $${money(budget / 100)}?`,
      Math.floor(budget / price),
      { hint: 'Divide and ignore anything left over — a part of one cannot be bought.',
        explanation: `${budget} ÷ ${price} = ${num(budget / price)}, so ${Math.floor(budget / price)} can be bought.` }); },

  (r) => { const c = int(r, 105, 9995);
    return blankQ(`Write ${c} cents in dollars.`, money(c / 100),
      { hint: 'There are 100 cents in a dollar.',
        explanation: `${c} ÷ 100 = $${money(c / 100)}.` }); },

  (r) => { const each = int(r, 105, 800), qty = int(r, 2, 9), [, many] = pick(r, ITEMS);
    return blankQ(`${qty} ${many} cost $${money(each * qty / 100)} altogether. What does one cost?`,
      money(each / 100),
      { hint: `Divide the total by ${qty}.`,
        explanation: `$${money(each * qty / 100)} ÷ ${qty} = $${money(each / 100)}.` }); },

  (r) => { const p = pick(r, [5, 10, 20]), price = int(r, 2, 60) * 100, n = pick(r, NAMES);
    return blankQ(`${n} buys something for $${money(price / 100)} and pays ${p}% tax on top. What is the total, in dollars?`,
      money(price * (100 + p) / 100 / 100),
      { hint: 'Work out the tax, then add it on.',
        explanation: `The tax is $${money(price * p / 100 / 100)}, so the total is $${money(price * (100 + p) / 100 / 100)}.` }); },

  (r) => { const week = int(r, 2, 12) * 100, weeks = int(r, 3, 12), n = pick(r, NAMES);
    return blankQ(`${n} saves $${money(week / 100)} a week for ${weeks} weeks. How much is saved, in dollars?`,
      money(week * weeks / 100),
      { hint: 'Multiply the weekly amount by the number of weeks.',
        explanation: `$${money(week / 100)} × ${weeks} = $${money(week * weeks / 100)}.` }); }
];

/* Every drill family, keyed the way the generator table expects. */
export const DRILL_GENERATORS = {
  addition, subtraction, timestables, multiplication, division, negatives, powers,
  bodmas, rounding, factors, fractionops, decimalops, percentops, ratio, placevalue,
  expressions, equations, sequences, standardform, surds, logarithms,
  conversions, timemath, moneymath
};
