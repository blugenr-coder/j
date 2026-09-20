/* Computing drills: convert it, trace it, or work out how long it takes.

   Computer science has the same hole the other subjects had. "Programming"
   was one topic with twelve makers, and a teacher wanting twenty binary
   conversions, or twenty truth tables, had to open it and hope. These are the
   narrow sheets: binary, hexadecimal, units of data, logic gates, boolean
   expressions, complexity, character codes, addressing, tracing and sorting.

   Everything here is computed from the numbers that render the question, so
   tools/check-drill.mjs can re-evaluate it. Where the answer is a word — the
   name of a gate, a SQL keyword — it comes from a bank and the options are
   checked for structure instead.                                          */

import { int, pick, sample, choice, blankQ } from './gen-core.js';

/* Three ways of asking for a conversion. A sheet of twenty conversions is
   twenty of the same question by design, but it does not have to open with
   the same six words twenty times. */
const ask = (r, ...ways) => pick(r, ways);

const bin = (n, width = 8) => n.toString(2).padStart(width, '0');
const hex = n => n.toString(16).toUpperCase();

/* ========================= BINARY AND DENARY ========================= */
export const binary = [
  (r) => { const n = int(r, 1, 255);
    return blankQ(ask(r, `Convert ${n} to an 8-bit binary number.`, `Write ${n} as an 8-bit binary number.`, `What is ${n} in 8-bit binary?`), bin(n),
      { hint: 'Work down the place values: 128, 64, 32, 16, 8, 4, 2, 1.',
        explanation: `${n} = ${bin(n)}.` }); },

  (r) => { const n = int(r, 1, 255);
    return blankQ(ask(r, `Convert the binary number ${bin(n)} to denary.`, `What is the binary number ${bin(n)} in denary?`, `Write ${bin(n)} as a denary number.`), n,
      { hint: 'Add up the place values wherever there is a 1.',
        explanation: `${bin(n)} = ${n}.` }); },

  (r) => { const n = int(r, 1, 15);
    return blankQ(ask(r, `Convert ${n} to a 4-bit binary number.`, `Write ${n} as a 4-bit binary number.`, `What is ${n} in 4-bit binary?`), bin(n, 4),
      { hint: 'Four bits carry 8, 4, 2 and 1.',
        explanation: `${n} = ${bin(n, 4)}.` }); },

  (r) => { const n = int(r, 1, 15);
    return blankQ(ask(r, `Convert the binary number ${bin(n, 4)} to denary.`, `What is ${bin(n, 4)} in denary?`, `Write the 4-bit number ${bin(n, 4)} in denary.`), n,
      { hint: 'Add the place values that carry a 1.',
        explanation: `${bin(n, 4)} = ${n}.` }); },

  (r) => { const a = int(r, 1, 120), b = int(r, 1, 255 - a);
    return blankQ(`Add these binary numbers and give the answer in binary: ${bin(a)} + ${bin(b)}`,
      bin(a + b),
      { hint: 'Add column by column from the right, carrying when you reach two.',
        explanation: `${a} + ${b} = ${a + b}, which is ${bin(a + b)}.` }); },

  (r) => { const p = int(r, 1, 7);
    return blankQ(`What is the place value of bit ${p + 1} from the right in a binary number?`,
      Math.pow(2, p),
      { hint: 'The place values double from the right: 1, 2, 4, 8…',
        explanation: `Bit ${p + 1} is worth 2^${p} = ${Math.pow(2, p)}.` }); },

  (r) => { const bits = int(r, 2, 10);
    return blankQ(`How many different values can ${bits} bits represent?`, Math.pow(2, bits),
      { hint: 'Each extra bit doubles the number of values.',
        explanation: `2^${bits} = ${Math.pow(2, bits)}.` }); },

  (r) => { const bits = int(r, 2, 10);
    return blankQ(`What is the largest denary number ${bits} bits can hold?`, Math.pow(2, bits) - 1,
      { hint: 'One less than the number of values, because counting starts at zero.',
        explanation: `2^${bits} − 1 = ${Math.pow(2, bits) - 1}.` }); },

  (r) => { const n = int(r, 1, 127);
    return blankQ(`Shift ${bin(n)} one place to the left. Write the result in binary.`,
      bin(n * 2),
      { hint: 'A left shift of one place doubles the number.',
        explanation: `${n} × 2 = ${n * 2}, which is ${bin(n * 2)}.` }); },

  (r) => { const n = int(r, 1, 127) * 2;
    return blankQ(`Shift ${bin(n)} one place to the right. Write the result in binary.`,
      bin(n / 2),
      { hint: 'A right shift of one place halves the number.',
        explanation: `${n} ÷ 2 = ${n / 2}, which is ${bin(n / 2)}.` }); },

  (r) => { const n = int(r, 1, 255);
    return blankQ(`How many 1s are there in the binary number ${bin(n)}?`,
      bin(n).split('').filter(c => c === '1').length,
      { hint: 'Count them one column at a time.',
        explanation: `${bin(n)} has ${bin(n).split('').filter(c => c === '1').length} ones.` }); },

  (r) => { const n = int(r, 1, 255);
    return choice(r, {
      prompt: `Is the binary number ${bin(n)} odd or even?`,
      correct: n % 2 === 0 ? 'even' : 'odd', distractors: [n % 2 === 0 ? 'odd' : 'even'],
      hint: 'Only the last bit decides it.',
      explanation: `The last bit is ${bin(n).slice(-1)}, so the number is ${n % 2 === 0 ? 'even' : 'odd'}.`
    }); },

  (r) => { const a = int(r, 1, 255); let b = int(r, 1, 255); if (b === a) b = a === 255 ? 1 : a + 1;
    return blankQ(`Which is larger, the binary number ${bin(a)} or ${bin(b)}? Write it in binary.`,
      bin(Math.max(a, b)),
      { hint: 'Compare from the left: the first column where they differ decides it.',
        explanation: `${bin(a)} is ${a} and ${bin(b)} is ${b}.` }); },

  (r) => { const b = int(r, 1, 120), a = int(r, b + 1, 255);
    return blankQ(`Work out ${bin(a)} − ${bin(b)} and give the answer in binary.`, bin(a - b),
      { hint: 'Convert to denary, subtract, then convert back.',
        explanation: `${a} − ${b} = ${a - b}, which is ${bin(a - b)}.` }); },

  (r) => { const n = int(r, 3, 255);
    const parts = bin(n).split('').map((c, i) => (c === '1' ? Math.pow(2, 7 - i) : 0)).filter(Boolean);
    return blankQ(`Write ${n} as a sum of powers of two, largest first. Separate them with plus signs.`,
      parts.join(' + '),
      { accept: [parts.join('+')],
        hint: 'Take the largest power of two that fits, then repeat with what is left.',
        explanation: `${parts.join(' + ')} = ${n}.` }); },

  (r) => { const n = int(r, 1, 127);
    return blankQ(`Write −${n} as an 8-bit two's complement binary number.`,
      bin(256 - n),
      { hint: 'Write the positive number, flip every bit, then add one.',
        explanation: `256 − ${n} = ${256 - n}, which is ${bin(256 - n)}.` }); }
];

/* ============================= HEXADECIMAL ============================= */
export const hexadecimal = [
  (r) => { const n = int(r, 10, 255);
    return blankQ(ask(r, `Convert ${n} to hexadecimal.`, `Write ${n} in hexadecimal.`, `What is ${n} in hexadecimal?`), hex(n),
      { hint: 'Divide by 16: the quotient is the first digit and the remainder the second.',
        explanation: `${n} ÷ 16 = ${Math.floor(n / 16)} remainder ${n % 16}, so it is ${hex(n)}.` }); },

  (r) => { const n = int(r, 10, 255);
    return blankQ(ask(r, `Convert the hexadecimal number ${hex(n)} to denary.`, `What is the hexadecimal number ${hex(n)} in denary?`, `Write ${hex(n)} as a denary number.`), n,
      { hint: 'The first digit counts sixteens and the second counts units.',
        explanation: `${Math.floor(n / 16)} × 16 + ${n % 16} = ${n}.` }); },

  (r) => { const n = int(r, 10, 15);
    return blankQ(`What is the denary value of the hexadecimal digit ${hex(n)}?`, n,
      { hint: 'After 9 the digits run A, B, C, D, E, F.',
        explanation: `${hex(n)} = ${n}.` }); },

  (r) => { const n = int(r, 10, 15);
    return blankQ(`Which hexadecimal digit has the denary value ${n}?`, hex(n),
      { hint: 'A is ten, and they run on from there.',
        explanation: `${n} = ${hex(n)}.` }); },

  (r) => { const n = int(r, 16, 255);
    return blankQ(`Convert the hexadecimal number ${hex(n)} to 8-bit binary.`, bin(n),
      { hint: 'Each hexadecimal digit becomes four bits.',
        explanation: `${hex(n)} = ${bin(n)}.` }); },

  (r) => { const n = int(r, 16, 255);
    return blankQ(`Convert the binary number ${bin(n)} to hexadecimal.`, hex(n),
      { hint: 'Split the eight bits into two groups of four.',
        explanation: `${bin(n).slice(0, 4)} ${bin(n).slice(4)} = ${hex(n)}.` }); },

  (r) => { const digits = int(r, 1, 4);
    return blankQ(`How many different values can ${digits} hexadecimal digit${digits === 1 ? '' : 's'} represent?`,
      Math.pow(16, digits),
      { hint: 'Each digit multiplies the count by sixteen.',
        explanation: `16^${digits} = ${Math.pow(16, digits)}.` }); },

  (r) => { const n = int(r, 10, 254);
    return blankQ(`What is the next hexadecimal number after ${hex(n)}?`, hex(n + 1),
      { hint: 'After F the count rolls over and the next digit goes up.',
        explanation: `${hex(n)} + 1 = ${hex(n + 1)}.` }); },

  (r) => { const a = int(r, 10, 120), b = int(r, 10, 120);
    return blankQ(`Work out ${hex(a)} + ${hex(b)} and give the answer in hexadecimal.`, hex(a + b),
      { hint: 'Convert to denary, add, then convert back.',
        explanation: `${a} + ${b} = ${a + b}, which is ${hex(a + b)}.` }); },

  (r) => { const bits = pick(r, [4, 8, 12, 16]);
    return blankQ(`How many hexadecimal digits are needed to write a ${bits}-bit number?`, bits / 4,
      { hint: 'Four bits fit in one hexadecimal digit.',
        explanation: `${bits} ÷ 4 = ${bits / 4} digits.` }); }
];

/* =========================== UNITS OF DATA =========================== */
export const datasizes = [
  (r) => { const n = int(r, 2, 64);
    return blankQ(ask(r, `How many bits are there in ${n} bytes?`, `Convert ${n} bytes to bits.`, `Write ${n} bytes as a number of bits.`), n * 8,
      { hint: 'A byte is 8 bits.', explanation: `${n} × 8 = ${n * 8} bits.` }); },

  (r) => { const n = int(r, 2, 64);
    return blankQ(ask(r, `How many bytes are there in ${n * 8} bits?`, `Convert ${n * 8} bits to bytes.`, `Write ${n * 8} bits as a number of bytes.`), n,
      { hint: 'Divide by 8.', explanation: `${n * 8} ÷ 8 = ${n} bytes.` }); },

  (r) => { const n = int(r, 2, 32);
    return blankQ(ask(r, `How many bytes are there in ${n} kibibytes, where 1 KiB is 1024 bytes?`, `Convert ${n} KiB to bytes, taking 1 KiB as 1024 bytes.`, `Write ${n} KiB as a number of bytes, where 1 KiB is 1024 bytes.`),
      n * 1024,
      { hint: 'Multiply by 1024.', explanation: `${n} × 1024 = ${n * 1024} bytes.` }); },

  (r) => { const n = int(r, 2, 32);
    return blankQ(ask(r, `How many kibibytes are there in ${n} mebibytes, where 1 MiB is 1024 KiB?`, `Convert ${n} MiB to KiB, taking 1 MiB as 1024 KiB.`, `Write ${n} MiB as a number of KiB, where 1 MiB is 1024 KiB.`),
      n * 1024,
      { hint: 'Multiply by 1024.', explanation: `${n} × 1024 = ${n * 1024} KiB.` }); },

  (r) => { const n = int(r, 2, 16);
    return blankQ(ask(r, `How many mebibytes are there in ${n} gibibytes?`, `Convert ${n} GiB to MiB.`, `Write ${n} GiB as a number of MiB.`), n * 1024,
      { hint: 'Each step up is a factor of 1024.',
        explanation: `${n} × 1024 = ${n * 1024} MiB.` }); },

  (r) => { const w = int(r, 10, 200), h = int(r, 10, 200), bpp = pick(r, [1, 2, 4, 8]);
    return blankQ(`An image is ${w} by ${h} pixels with ${bpp} bit${bpp === 1 ? '' : 's'} per pixel. What is its size in bits?`,
      w * h * bpp,
      { hint: 'Multiply the pixels by the bits each one takes.',
        explanation: `${w} × ${h} × ${bpp} = ${w * h * bpp} bits.` }); },

  (r) => { const w = int(r, 10, 100), h = int(r, 10, 100), bpp = 8;
    return blankQ(`An image is ${w} by ${h} pixels with ${bpp} bits per pixel. What is its size in bytes?`,
      w * h,
      { hint: 'Work out the bits first, then divide by 8.',
        explanation: `${w} × ${h} × 8 = ${w * h * 8} bits, which is ${w * h} bytes.` }); },

  (r) => { const rate = pick(r, [8000, 16000, 44100]), secs = int(r, 2, 30), depth = pick(r, [8, 16]);
    return blankQ(`A sound is sampled ${rate} times a second for ${secs} seconds at ${depth} bits a sample. What is its size in bits?`,
      rate * secs * depth,
      { hint: 'Sample rate times duration times bit depth.',
        explanation: `${rate} × ${secs} × ${depth} = ${rate * secs * depth} bits.` }); },

  (r) => { const chars = int(r, 20, 500);
    return blankQ(`A text file holds ${chars} characters, each stored in one byte. What is its size in bytes?`,
      chars,
      { hint: 'One byte each.', explanation: `${chars} characters × 1 byte = ${chars} bytes.` }); },

  (r) => { const colours = pick(r, [2, 4, 8, 16, 32, 64, 128, 256]);
    return blankQ(`How many bits per pixel are needed for ${colours} colours?`,
      Math.log2(colours),
      { hint: 'Ask what power of two gives that many colours.',
        explanation: `2^${Math.log2(colours)} = ${colours}.` }); }
];

/* ==================== LOGIC GATES AND TRUTH TABLES ==================== */
const GATES = {
  AND: (a, b) => (a && b ? 1 : 0),
  OR: (a, b) => (a || b ? 1 : 0),
  XOR: (a, b) => (a !== b ? 1 : 0),
  NAND: (a, b) => (a && b ? 0 : 1),
  NOR: (a, b) => (a || b ? 0 : 1)
};
const GATE_NAMES = Object.keys(GATES);
/* "an AND gate" but "a NAND gate": the article follows how the name is said,
   not how it is spelled. */
const gateArticle = g => (['AND', 'OR', 'XOR'].includes(g) ? 'an' : 'a');

export const logicgates = [
  (r) => { const g = pick(r, GATE_NAMES), a = int(r, 0, 1), b = int(r, 0, 1);
    return blankQ(`What is the output of ${gateArticle(g)} ${g} gate when A = ${a} and B = ${b}?`,
      GATES[g](a, b),
      { hint: `Recall the row of the ${g} truth table where A is ${a} and B is ${b}.`,
        explanation: `${a} ${g} ${b} = ${GATES[g](a, b)}.` }); },

  (r) => { const a = int(r, 0, 1);
    return blankQ(`What is the output of a NOT gate when the input is ${a}?`, a === 0 ? 1 : 0,
      { hint: 'A NOT gate reverses its input.',
        explanation: `NOT ${a} = ${a === 0 ? 1 : 0}.` }); },

  (r) => { const g = pick(r, GATE_NAMES);
    const rows = [[0, 0], [0, 1], [1, 0], [1, 1]];
    return blankQ(`Write the output column of ${gateArticle(g)} ${g} truth table, in the order 00, 01, 10, 11. Separate the values with commas.`,
      rows.map(([a, b]) => GATES[g](a, b)).join(', '),
      { accept: [rows.map(([a, b]) => GATES[g](a, b)).join(''), rows.map(([a, b]) => GATES[g](a, b)).join(',')],
        hint: `Take the four input pairs in turn.`,
        explanation: `${g}: ${rows.map(([a, b]) => `${a}${b}→${GATES[g](a, b)}`).join(', ')}.` }); },

  (r) => { const inputs = int(r, 2, 6);
    return blankQ(`How many rows does a truth table with ${inputs} inputs have?`, Math.pow(2, inputs),
      { hint: 'Each input doubles the number of combinations.',
        explanation: `2^${inputs} = ${Math.pow(2, inputs)} rows.` }); },

  (r) => { const g = pick(r, GATE_NAMES);
    const rows = [[0, 0], [0, 1], [1, 0], [1, 1]];
    const column = rows.map(([a, b]) => GATES[g](a, b)).join('');
    return choice(r, {
      prompt: `Which gate has the output column ${column} for inputs 00, 01, 10, 11?`,
      correct: g,
      distractors: GATE_NAMES.filter(x => x !== g &&
        rows.map(([a, b]) => GATES[x](a, b)).join('') !== column),
      hint: 'Check the first and last rows: they separate most of the gates.',
      explanation: `${column} is the ${g} column.`
    }); },

  (r) => { const a = int(r, 0, 1), b = int(r, 0, 1), c = int(r, 0, 1);
    return blankQ(`What is the output of (A AND B) OR C when A = ${a}, B = ${b} and C = ${c}?`,
      GATES.OR(GATES.AND(a, b), c),
      { hint: 'Work out the bracket first.',
        explanation: `${a} AND ${b} = ${GATES.AND(a, b)}, then OR ${c} = ${GATES.OR(GATES.AND(a, b), c)}.` }); },

  (r) => { const a = int(r, 0, 1), b = int(r, 0, 1);
    return blankQ(`What is the output of NOT (A OR B) when A = ${a} and B = ${b}?`,
      GATES.NOR(a, b),
      { hint: 'This is the same as a NOR gate.',
        explanation: `${a} OR ${b} = ${GATES.OR(a, b)}, and NOT that is ${GATES.NOR(a, b)}.` }); },

  (r) => { const a = int(r, 0, 1), b = int(r, 0, 1);
    return blankQ(`What is the output of NOT (A AND B) when A = ${a} and B = ${b}?`,
      GATES.NAND(a, b),
      { hint: 'This is the same as a NAND gate.',
        explanation: `${a} AND ${b} = ${GATES.AND(a, b)}, and NOT that is ${GATES.NAND(a, b)}.` }); },

  (r) => { const g = pick(r, ['AND', 'OR']);
    const rows = [[0, 0], [0, 1], [1, 0], [1, 1]];
    const ones = rows.filter(([a, b]) => GATES[g](a, b) === 1).length;
    return blankQ(`How many rows of ${gateArticle(g)} ${g} truth table give an output of 1?`, ones,
      { hint: 'Write the four rows out and count.',
        explanation: `${g} gives 1 on ${ones} of the four rows.` }); },

  (r) => { const a = int(r, 0, 1), b = int(r, 0, 1), c = int(r, 0, 1);
    return blankQ(`What is the output of A AND (B OR C) when A = ${a}, B = ${b} and C = ${c}?`,
      GATES.AND(a, GATES.OR(b, c)),
      { hint: 'The bracket goes first.',
        explanation: `${b} OR ${c} = ${GATES.OR(b, c)}, then ${a} AND that is ${GATES.AND(a, GATES.OR(b, c))}.` }); }
];

/* ========================= BOOLEAN EXPRESSIONS ========================= */
export const booleanalgebra = [
  (r) => { const a = int(r, 0, 1);
    return blankQ(ask(r, `What is the value of A AND A when A = ${a}?`, `Evaluate A AND A for A = ${a}.`, `A = ${a}. What is A AND A?`), a,
      { hint: 'A term ANDed with itself does not change.',
        explanation: `${a} AND ${a} = ${a}.` }); },

  (r) => { const a = int(r, 0, 1);
    return blankQ(ask(r, `What is the value of A OR NOT A when A = ${a}?`, `Evaluate A OR NOT A for A = ${a}.`, `A = ${a}. What is A OR NOT A?`), 1,
      { hint: 'One side of the OR is always true.',
        explanation: `Whatever A is, A OR NOT A is 1.` }); },

  (r) => { const a = int(r, 0, 1);
    return blankQ(ask(r, `What is the value of A AND NOT A when A = ${a}?`, `Evaluate A AND NOT A for A = ${a}.`, `A = ${a}. What is A AND NOT A?`), 0,
      { hint: 'Both sides can never be true at once.',
        explanation: `Whatever A is, A AND NOT A is 0.` }); },

  (r) => { const a = int(r, 0, 1), b = int(r, 0, 1);
    return blankQ(ask(r, `What is the value of NOT A OR NOT B when A = ${a} and B = ${b}?`, `Evaluate NOT A OR NOT B for A = ${a}, B = ${b}.`, `A = ${a} and B = ${b}. What is NOT A OR NOT B?`),
      GATES.NAND(a, b),
      { hint: 'By De Morgan this is the same as NOT (A AND B).',
        explanation: `NOT ${a} = ${a ? 0 : 1}, NOT ${b} = ${b ? 0 : 1}, and their OR is ${GATES.NAND(a, b)}.` }); },

  (r) => { const a = int(r, 0, 1), b = int(r, 0, 1);
    return blankQ(ask(r, `What is the value of NOT A AND NOT B when A = ${a} and B = ${b}?`, `Evaluate NOT A AND NOT B for A = ${a}, B = ${b}.`, `A = ${a} and B = ${b}. What is NOT A AND NOT B?`),
      GATES.NOR(a, b),
      { hint: 'By De Morgan this is the same as NOT (A OR B).',
        explanation: `NOT ${a} = ${a ? 0 : 1}, NOT ${b} = ${b ? 0 : 1}, and their AND is ${GATES.NOR(a, b)}.` }); },

  (r) => { const a = int(r, 0, 1), b = int(r, 0, 1), c = int(r, 0, 1);
    return blankQ(`What is the value of (A OR B) AND NOT C when A = ${a}, B = ${b} and C = ${c}?`,
      GATES.AND(GATES.OR(a, b), c ? 0 : 1),
      { hint: 'Bracket first, then the NOT, then the AND.',
        explanation: `${a} OR ${b} = ${GATES.OR(a, b)}, NOT ${c} = ${c ? 0 : 1}, and their AND is ${GATES.AND(GATES.OR(a, b), c ? 0 : 1)}.` }); },

  (r) => { const a = int(r, 0, 1);
    return blankQ(`What is the value of A OR 1 when A = ${a}?`, 1,
      { hint: 'Anything ORed with 1 is 1.',
        explanation: `${a} OR 1 = 1.` }); },

  (r) => { const a = int(r, 0, 1);
    return blankQ(`What is the value of A AND 0 when A = ${a}?`, 0,
      { hint: 'Anything ANDed with 0 is 0.',
        explanation: `${a} AND 0 = 0.` }); },

  (r) => { const inputs = int(r, 2, 5);
    return blankQ(`An expression has ${inputs} inputs. How many combinations must a truth table cover?`,
      Math.pow(2, inputs),
      { hint: 'Two choices per input, multiplied together.',
        explanation: `2^${inputs} = ${Math.pow(2, inputs)}.` }); },

  (r) => { const a = int(r, 0, 1), b = int(r, 0, 1);
    return blankQ(`What is the value of NOT (A XOR B) when A = ${a} and B = ${b}?`,
      GATES.XOR(a, b) ? 0 : 1,
      { hint: 'XOR is 1 only when the inputs differ.',
        explanation: `${a} XOR ${b} = ${GATES.XOR(a, b)}, and NOT that is ${GATES.XOR(a, b) ? 0 : 1}.` }); }
];

/* ======================= ALGORITHM COMPLEXITY ======================= */
export const bigo = [
  (r) => { const n = pick(r, [8, 16, 32, 64, 128, 256, 512, 1024]);
    return blankQ(`A linear search checks one item at a time. At most how many comparisons does it need for ${n} items?`,
      n,
      { hint: 'In the worst case it looks at every item.',
        explanation: `A linear search over ${n} items takes at most ${n} comparisons.` }); },

  (r) => { const n = pick(r, [8, 16, 32, 64, 128, 256, 512, 1024]);
    return blankQ(`A binary search halves the list each time. At most how many comparisons does it need for ${n} sorted items?`,
      Math.log2(n),
      { hint: 'Ask how many times you can halve the list before one item is left.',
        explanation: `log₂(${n}) = ${Math.log2(n)} comparisons.` }); },

  (r) => { const n = int(r, 4, 40);
    return blankQ(`An algorithm is O(n²). How many operations does it take for n = ${n}?`, n * n,
      { hint: 'Square the number of items.',
        explanation: `${n}² = ${n * n}.` }); },

  (r) => { const n = int(r, 4, 30);
    return blankQ(`A bubble sort compares every pair once. How many comparisons is that for ${n} items?`,
      n * (n - 1) / 2,
      { hint: 'Each of the n items pairs with the others, and each pair is counted once.',
        explanation: `${n} × ${n - 1} ÷ 2 = ${n * (n - 1) / 2}.` }); },

  (r) => { const k = int(r, 2, 5);
    return blankQ(`An O(n²) algorithm is given ${k} times as many items. How many times longer does it take?`,
      k * k,
      { hint: 'Squaring the growth in n squares the growth in work.',
        explanation: `${k}² = ${k * k} times longer.` }); },

  (r) => { const n = pick(r, [16, 64, 256, 1024]);
    return choice(r, {
      prompt: `Which is faster on ${n} sorted items, a linear search or a binary search?`,
      correct: 'binary search', distractors: ['linear search', 'they take the same time'],
      hint: 'One halves the list each step; the other does not.',
      explanation: `Binary search needs ${Math.log2(n)} comparisons where linear search needs up to ${n}.`
    }); },

  (r) => { const pairs = [['linear search', 'O(n)'], ['binary search', 'O(log n)'],
      ['bubble sort', 'O(n²)'], ['reading one array element', 'O(1)'],
      ['merge sort', 'O(n log n)'], ['insertion sort', 'O(n²)']];
    const [name, order] = pick(r, pairs);
    return choice(r, {
      prompt: `What is the time complexity of ${name}?`,
      correct: order,
      distractors: [...new Set(pairs.map(p => p[1]))].filter(o => o !== order),
      hint: 'Ask how the work grows when the list doubles.',
      explanation: `${name} is ${order}.`
    }); },

  (r) => { const n = pick(r, [8, 16, 32, 64]);
    return blankQ(`A merge sort splits the list in half until each part holds one item. How many splits deep is that for ${n} items?`,
      Math.log2(n),
      { hint: 'Count the halvings.',
        explanation: `log₂(${n}) = ${Math.log2(n)} levels.` }); },

  (r) => { const n = int(r, 3, 12);
    return blankQ(`A nested loop runs ${n} times inside ${n} times. How many iterations is that altogether?`,
      n * n,
      { hint: 'The inner loop runs in full for every turn of the outer one.',
        explanation: `${n} × ${n} = ${n * n}.` }); },

  (r) => { const a = int(r, 3, 12), b = int(r, 3, 12);
    return blankQ(`A loop of ${a} contains a loop of ${b}. How many times does the inner body run?`,
      a * b,
      { hint: 'Multiply the two counts.',
        explanation: `${a} × ${b} = ${a * b}.` }); }
];

/* ======================== CHARACTERS AND CODES ======================== */
export const charencoding = [
  (r) => { const i = int(r, 0, 25);
    return blankQ(`In ASCII, capital A is 65. What is the code for the capital letter ${String.fromCharCode(65 + i)}?`,
      65 + i,
      { hint: 'The capitals run in order from A.',
        explanation: `65 + ${i} = ${65 + i}.` }); },

  (r) => { const i = int(r, 0, 25);
    return blankQ(`In ASCII, lower-case a is 97. What is the code for the letter ${String.fromCharCode(97 + i)}?`,
      97 + i,
      { hint: 'The lower-case letters run in order from a.',
        explanation: `97 + ${i} = ${97 + i}.` }); },

  (r) => { const i = int(r, 0, 25);
    return blankQ(`Which capital letter has the ASCII code ${65 + i}?`, String.fromCharCode(65 + i),
      { hint: 'Count on from A, which is 65.',
        explanation: `${65 + i} − 65 = ${i}, so it is ${String.fromCharCode(65 + i)}.` }); },

  (r) => { const d = int(r, 1, 9);
    return blankQ(`In ASCII, the digit 0 is 48. What is the code for the digit ${d}?`, 48 + d,
      { hint: 'The digits run in order from 0.',
        explanation: `48 + ${d} = ${48 + d}.` }); },

  (r) => { const i = int(r, 0, 25);
    return blankQ(`The capital letter ${String.fromCharCode(65 + i)} is ${65 + i} in ASCII. What is the code for its lower-case form?`,
      97 + i,
      { hint: 'Lower case sits 32 above upper case.',
        explanation: `${65 + i} + 32 = ${97 + i}.` }); },

  (r) => { const bits = 7;
    return blankQ(`How many different characters can ${bits}-bit ASCII represent?`, Math.pow(2, bits),
      { hint: 'Each bit doubles the count.',
        explanation: `2^${bits} = ${Math.pow(2, bits)}.` }); },

  (r) => { const n = int(r, 5, 80);
    return blankQ(`A string holds ${n} characters in 8-bit ASCII. How many bits does it take?`, n * 8,
      { hint: 'Eight bits per character.',
        explanation: `${n} × 8 = ${n * 8} bits.` }); },

  (r) => { const n = int(r, 5, 80);
    return blankQ(`A string holds ${n} characters in 8-bit ASCII. How many bytes does it take?`, n,
      { hint: 'Eight bits is one byte, so one character is one byte.',
        explanation: `${n} characters is ${n} bytes.` }); },

  (r) => { const bits = pick(r, [8, 16]);
    return blankQ(`How many different characters can a ${bits}-bit code represent?`, Math.pow(2, bits),
      { hint: 'Two to the power of the number of bits.',
        explanation: `2^${bits} = ${Math.pow(2, bits)}.` }); },

  () => blankQ(`How much bigger is the ASCII code for a lower-case letter than for the same capital?`,
      32,
      { hint: 'Compare A with a, or B with b.',
        explanation: `97 − 65 = 32.` })
];

/* ====================== ADDRESSES AND NETWORKING ====================== */
export const networking = [
  (r) => { const n = int(r, 0, 255);
    return blankQ(ask(r, `Convert the IP address octet ${n} to 8-bit binary.`, `Write the IP address octet ${n} in 8-bit binary.`, `What is the octet ${n} in binary?`), bin(n),
      { hint: 'An octet holds eight bits, from 128 down to 1.',
        explanation: `${n} = ${bin(n)}.` }); },

  (r) => { const n = int(r, 0, 255);
    return blankQ(ask(r, `Convert the binary octet ${bin(n)} to denary.`, `What is the binary octet ${bin(n)} in denary?`, `Write the octet ${bin(n)} as a denary number.`), n,
      { hint: 'Add the place values that carry a 1.',
        explanation: `${bin(n)} = ${n}.` }); },

  (r) => { return blankQ('How many bits are there in an IPv4 address?', 32,
      { hint: 'Four octets, eight bits each.',
        explanation: '4 × 8 = 32 bits.' }); },

  (r) => { return blankQ('How many bits are there in a MAC address?', 48,
      { hint: 'Six pairs of hexadecimal digits, eight bits each.',
        explanation: '6 × 8 = 48 bits.' }); },

  (r) => { const host = int(r, 2, 16);
    return blankQ(`A network has ${host} bits for the host part of the address. How many addresses is that?`,
      Math.pow(2, host),
      { hint: 'Each host bit doubles the range.',
        explanation: `2^${host} = ${Math.pow(2, host)} addresses.` }); },

  (r) => { const prefix = pick(r, [8, 16, 24, 26, 28]);
    return blankQ(`An IPv4 address has a /${prefix} prefix. How many bits are left for the host part?`,
      32 - prefix,
      { hint: 'An IPv4 address is 32 bits altogether.',
        explanation: `32 − ${prefix} = ${32 - prefix} bits.` }); },

  (r) => { const prefix = pick(r, [24, 25, 26, 27, 28]);
    return blankQ(`How many addresses does a /${prefix} network hold?`, Math.pow(2, 32 - prefix),
      { hint: 'Work out the host bits first.',
        explanation: `32 − ${prefix} = ${32 - prefix} host bits, so 2^${32 - prefix} = ${Math.pow(2, 32 - prefix)} addresses.` }); },

  (r) => { const n = int(r, 0, 255);
    return blankQ(`Convert the IP address octet ${n} to hexadecimal.`, hex(n),
      { hint: 'Split it into sixteens and units.',
        explanation: `${n} = ${hex(n)}.` }); },

  (r) => { const bad = pick(r, [256, 300, 512, 999]);
    return choice(r, {
      prompt: `Can ${bad} appear as an octet in an IPv4 address?`,
      correct: 'no', distractors: ['yes'],
      hint: 'An octet holds eight bits.',
      explanation: `Eight bits reach only 255, so ${bad} is too large.`
    }); },

  (r) => { const bits = pick(r, [4, 8, 16]);
    return blankQ(`A protocol numbers its ports with ${bits} bits. How many ports is that?`,
      Math.pow(2, bits),
      { hint: 'Two to the power of the bits.',
        explanation: `2^${bits} = ${Math.pow(2, bits)}.` }); },

  (r) => { const o = [int(r, 1, 255), int(r, 0, 255), int(r, 0, 255), int(r, 1, 254)];
    return blankQ(`Write the IP address ${o.join('.')} in binary. Separate the octets with full stops.`,
      o.map(x => bin(x)).join('.'),
      { hint: 'Convert each octet on its own.',
        explanation: `${o.join('.')} = ${o.map(x => bin(x)).join('.')}.` }); },

  (r) => { const prefix = pick(r, [24, 25, 26, 27, 28]);
    const total = Math.pow(2, 32 - prefix);
    return blankQ(`A /${prefix} network has ${total} addresses, but two are reserved. How many are usable by hosts?`,
      total - 2,
      { hint: 'The network address and the broadcast address are not available.',
        explanation: `${total} − 2 = ${total - 2}.` }); },

  (r) => { const prefix = pick(r, [8, 16, 24]);
    const mask = [0, 1, 2, 3].map(i => (prefix >= (i + 1) * 8 ? 255 : 0)).join('.');
    return blankQ(`Write the subnet mask for a /${prefix} network in dotted denary.`, mask,
      { hint: 'Each full octet of network bits is 255.',
        explanation: `/${prefix} is ${prefix} network bits, which is ${mask}.` }); },

  (r) => { const prefix = pick(r, [8, 16, 24]);
    const mask = [0, 1, 2, 3].map(i => (prefix >= (i + 1) * 8 ? 255 : 0)).join('.');
    return blankQ(`A subnet mask is ${mask}. What is its prefix length? Write the number.`, prefix,
      { hint: 'Count the bits set to 1.',
        explanation: `${mask} has ${prefix} bits set, so it is a /${prefix}.` }); }
];

/* ============================ TRACING CODE ============================ */
/* The snippets are written in the neutral pseudo-code a syllabus uses, and
   each one is traced here by the same arithmetic the learner does by hand. */
export const tracingcode = [
  (r) => { const n = int(r, 3, 12);
    return blankQ(`Trace this and write the final value of total.\n\ntotal = 0\nFOR i = 1 TO ${n}\n    total = total + i\nNEXT i`,
      n * (n + 1) / 2,
      { hint: 'It adds every number from 1 up to the limit.',
        explanation: `1 + 2 + … + ${n} = ${n * (n + 1) / 2}.` }); },

  (r) => { const n = int(r, 3, 12), k = int(r, 2, 5);
    return blankQ(`Trace this and write the final value of total.\n\ntotal = 0\nFOR i = 1 TO ${n}\n    total = total + ${k}\nNEXT i`,
      n * k,
      { hint: 'The same amount is added on every turn of the loop.',
        explanation: `${n} × ${k} = ${n * k}.` }); },

  (r) => { const start = int(r, 1, 5), k = int(r, 2, 4), times = int(r, 2, 5);
    return blankQ(`Trace this and write the final value of x.\n\nx = ${start}\nFOR i = 1 TO ${times}\n    x = x * ${k}\nNEXT i`,
      start * Math.pow(k, times),
      { hint: 'Multiply by the same number once for each turn.',
        explanation: `${start} × ${k}^${times} = ${start * Math.pow(k, times)}.` }); },

  (r) => { const n = int(r, 10, 60), k = int(r, 2, 6);
    const count = Math.floor(n / k);
    return blankQ(`Trace this and write the final value of count.\n\ncount = 0\nFOR i = 1 TO ${n}\n    IF i MOD ${k} = 0 THEN\n        count = count + 1\n    END IF\nNEXT i`,
      count,
      { hint: `It counts the multiples of ${k} up to ${n}.`,
        explanation: `There are ${count} multiples of ${k} up to ${n}.` }); },

  (r) => { const a = int(r, 2, 20), b = int(r, 2, 20);
    return blankQ(`Trace this and write the final value of a.\n\na = ${a}\nb = ${b}\ntemp = a\na = b\nb = temp`,
      b,
      { hint: 'The two values are swapped.',
        explanation: `After the swap a holds ${b} and b holds ${a}.` }); },

  (r) => { const outer = int(r, 2, 8), inner = int(r, 2, 8);
    return blankQ(`How many times does the line inside run?\n\nFOR i = 1 TO ${outer}\n    FOR j = 1 TO ${inner}\n        PRINT i, j\n    NEXT j\nNEXT i`,
      outer * inner,
      { hint: 'The inner loop runs in full for every turn of the outer one.',
        explanation: `${outer} × ${inner} = ${outer * inner}.` }); },

  (r) => { const start = int(r, 20, 80), step = pick(r, [2, 4, 5, 10]);
    const times = Math.floor(start / step);
    return blankQ(`How many times does this loop run?\n\nx = ${start}\nWHILE x >= ${step}\n    x = x − ${step}\nEND WHILE`,
      times,
      { hint: 'Each turn takes the same amount away.',
        explanation: `It takes ${times} turns of ${step} before x drops below ${step}.` }); },

  (r) => { const n = pick(r, [8, 16, 32, 64, 128]);
    return blankQ(`How many times does this loop run?\n\nx = ${n}\nWHILE x > 1\n    x = x / 2\nEND WHILE`,
      Math.log2(n),
      { hint: 'Count the halvings.',
        explanation: `log₂(${n}) = ${Math.log2(n)} turns.` }); },

  (r) => { const list = sample(r, [3, 7, 11, 14, 19, 22, 26, 31, 38, 45], 5);
    return blankQ(`The list is [${list.join(', ')}] with the first item at index 0. What does index ${2} hold?`,
      list[2],
      { hint: 'Counting starts at zero, so index 2 is the third item.',
        explanation: `Index 0 is ${list[0]}, index 1 is ${list[1]}, index 2 is ${list[2]}.` }); },

  (r) => { const list = sample(r, [3, 7, 11, 14, 19, 22, 26, 31, 38, 45], 5);
    return blankQ(`Trace this and write the final value of total.\n\ntotal = 0\nFOR EACH n IN [${list.join(', ')}]\n    total = total + n\nNEXT n`,
      list.reduce((a, b) => a + b, 0),
      { hint: 'Add every item in the list.',
        explanation: `${list.join(' + ')} = ${list.reduce((a, b) => a + b, 0)}.` }); },

  (r) => { const list = sample(r, [3, 7, 11, 14, 19, 22, 26, 31, 38, 45], 5);
    const biggest = Math.max(...list);
    return blankQ(`Trace this and write the final value of best.\n\nbest = 0\nFOR EACH n IN [${list.join(', ')}]\n    IF n > best THEN best = n\nNEXT n`,
      biggest,
      { hint: 'It keeps the largest value it has seen.',
        explanation: `The largest item is ${biggest}.` }); },

  (r) => { const start = int(r, 5, 30);
    return blankQ(`How many times does this loop run?\n\nFOR i = ${start} DOWNTO 1\n    PRINT i\nNEXT i`,
      start,
      { hint: 'It counts down to one, taking in every number on the way.',
        explanation: `From ${start} down to 1 is ${start} turns.` }); },

  (r) => { const n = int(r, 3, 12), word = pick(r, ['ab', 'xy', 'go', 'no', 'hi']);
    return blankQ(`Trace this and write the length of s at the end.\n\ns = ""\nFOR i = 1 TO ${n}\n    s = s + "${word}"\nNEXT i`,
      n * word.length,
      { hint: 'Each turn adds the same number of characters.',
        explanation: `${n} × ${word.length} = ${n * word.length} characters.` }); },

  (r) => { const a = int(r, 2, 20), b = int(r, 2, 20), n = int(r, 2, 8);
    return blankQ(`Trace this and write the final value of total.\n\ntotal = ${a}\nFOR i = 1 TO ${n}\n    total = total + ${b}\nNEXT i`,
      a + b * n,
      { hint: 'It starts part-way and adds the same amount each turn.',
        explanation: `${a} + ${b} × ${n} = ${a + b * n}.` }); },

  (r) => { const x = int(r, 1, 40), limit = int(r, 1, 40);
    return blankQ(`Trace this and write the value printed.\n\nx = ${x}\nIF x > ${limit} THEN\n    PRINT ${x + limit}\nELSE\n    PRINT ${Math.abs(x - limit)}\nEND IF`,
      x > limit ? x + limit : Math.abs(x - limit),
      { hint: 'Test the condition first, then take the branch it chooses.',
        explanation: `${x} ${x > limit ? 'is' : 'is not'} greater than ${limit}, so it prints ${x > limit ? x + limit : Math.abs(x - limit)}.` }); }
];

/* ======================= SORTING AND SEARCHING ======================= */
/* One pass of a bubble sort, done here the way a learner does it on paper. */
function bubblePass(list) {
  const out = [...list];
  for (let i = 0; i < out.length - 1; i++)
    if (out[i] > out[i + 1]) { const t = out[i]; out[i] = out[i + 1]; out[i + 1] = t; }
  return out;
}

export const sorting = [
  (r) => { const list = sample(r, [9, 4, 7, 2, 8, 5, 1, 6, 3], 5);
    return blankQ(`Write the list after one pass of a bubble sort: [${list.join(', ')}]. Separate the numbers with commas.`,
      bubblePass(list).join(', '),
      { accept: [bubblePass(list).join(',')],
        hint: 'Compare each neighbouring pair once, left to right, swapping when they are out of order.',
        explanation: `After one pass: ${bubblePass(list).join(', ')}.` }); },

  (r) => { const n = int(r, 4, 12);
    return blankQ(`A bubble sort works on ${n} items. At most how many passes does it need?`, n - 1,
      { hint: 'Each pass settles one more item at the end.',
        explanation: `${n} − 1 = ${n - 1} passes.` }); },

  (r) => { const list = sample(r, [2, 5, 8, 11, 14, 17, 20, 23, 26], 7).sort((a, b) => a - b);
    return blankQ(`A binary search runs on [${list.join(', ')}]. Which value does it check first?`,
      list[Math.floor(list.length / 2)],
      { hint: 'It starts in the middle of the list.',
        explanation: `The middle of ${list.length} items is position ${Math.floor(list.length / 2) + 1}, which holds ${list[Math.floor(list.length / 2)]}.` }); },

  (r) => { const list = sample(r, [4, 9, 12, 15, 18, 21, 25, 30], 6);
    const target = pick(r, list), at = list.indexOf(target) + 1;
    return blankQ(`A linear search looks for ${target} in [${list.join(', ')}], starting at the left. How many comparisons does it make?`,
      at,
      { hint: 'Count the items it looks at, including the one it finds.',
        explanation: `${target} is the ${at}${at === 1 ? 'st' : at === 2 ? 'nd' : at === 3 ? 'rd' : 'th'} item, so it takes ${at} comparisons.` }); },

  (r) => { const list = sample(r, [9, 4, 7, 2, 8, 5, 1, 6, 3], 5);
    return blankQ(`Write [${list.join(', ')}] in order, smallest first. Separate the numbers with commas.`,
      [...list].sort((a, b) => a - b).join(', '),
      { accept: [[...list].sort((a, b) => a - b).join(',')],
        hint: 'Find the smallest, then the next smallest.',
        explanation: `In order: ${[...list].sort((a, b) => a - b).join(', ')}.` }); },

  (r) => { const n = pick(r, [4, 8, 16, 32]);
    return blankQ(`A merge sort splits ${n} items until each part holds one. How many parts are there at the deepest level?`,
      n,
      { hint: 'Every item ends up on its own.',
        explanation: `${n} items become ${n} parts of one.` }); },

  (r) => { const n = int(r, 4, 12);
    return blankQ(`How many comparisons does a bubble sort make on its first pass over ${n} items?`, n - 1,
      { hint: 'It compares each neighbouring pair once.',
        explanation: `${n} items have ${n - 1} neighbouring pairs.` }); },

  (r) => { const list = sample(r, [3, 6, 10, 13, 16, 19, 24], 5).sort((a, b) => a - b);
    const mid = Math.floor(list.length / 2), target = list[list.length - 1];
    return choice(r, {
      prompt: `A binary search on [${list.join(', ')}] is looking for ${target}. After checking the middle, which half does it search?`,
      correct: 'the right half', distractors: ['the left half', 'the whole list again'],
      hint: 'Compare the target with the middle value.',
      explanation: `${target} is larger than ${list[mid]}, so the search moves right.`
    }); },

  (r) => { const n = int(r, 4, 10);
    return blankQ(`An insertion sort places each item into the sorted part on its left. How many items does it insert for a list of ${n}?`,
      n - 1,
      { hint: 'The first item is already a sorted list of one.',
        explanation: `${n} − 1 = ${n - 1} insertions.` }); },

  (r) => { const list = sample(r, [9, 4, 7, 2, 8, 5, 1, 6, 3], 5);
    return blankQ(`After one pass of a bubble sort on [${list.join(', ')}], which number is in the last position?`,
      Math.max(...list),
      { hint: 'The largest value is pushed along on every comparison.',
        explanation: `The largest item, ${Math.max(...list)}, ends the pass at the end of the list.` }); },

  (r) => { const list = sample(r, [9, 4, 7, 2, 8, 5, 1, 6, 3], 5);
    return blankQ(`A selection sort looks for the smallest item first. Which number does it move to the front of [${list.join(', ')}]?`,
      Math.min(...list),
      { hint: 'Scan the whole list for the smallest value.',
        explanation: `The smallest item is ${Math.min(...list)}.` }); },

  (r) => { const list = sample(r, [9, 4, 7, 2, 8, 5, 1, 6, 3], 5);
    let swaps = 0; const work = [...list];
    for (let i = 0; i < work.length - 1; i++)
      if (work[i] > work[i + 1]) { const t = work[i]; work[i] = work[i + 1]; work[i + 1] = t; swaps++; }
    return blankQ(`How many swaps does one pass of a bubble sort make on [${list.join(', ')}]?`, swaps,
      { hint: 'Compare each neighbouring pair once and count the swaps.',
        explanation: `One pass makes ${swaps} swap${swaps === 1 ? '' : 's'}, leaving ${work.join(', ')}.` }); },

  (r) => { const list = sample(r, [9, 4, 7, 2, 8, 5, 1, 6, 3], 5);
    return blankQ(`Which two numbers does a bubble sort compare first in [${list.join(', ')}]? Write them separated by a comma.`,
      `${list[0]}, ${list[1]}`,
      { accept: [`${list[0]},${list[1]}`],
        hint: 'It starts at the left-hand end.',
        explanation: `It compares ${list[0]} with ${list[1]}.` }); },

  (r) => { const list = sample(r, [2, 5, 8, 11, 14, 17, 20], 7).sort((a, b) => a - b);
    const mid = Math.floor(list.length / 2), right = list.slice(mid + 1);
    return blankQ(`A binary search on [${list.join(', ')}] has checked the middle and moved right. Which value does it check next?`,
      right[Math.floor(right.length / 2)],
      { hint: 'It takes the middle of what is left.',
        explanation: `The right half is [${right.join(', ')}], whose middle is ${right[Math.floor(right.length / 2)]}.` }); }
];

/* ============================= SQL QUERIES ============================= */
const SQL_KEYWORDS = [
  ['SELECT', 'chooses which columns to return'],
  ['FROM', 'names the table to read'],
  ['WHERE', 'filters which rows are returned'],
  ['ORDER BY', 'sorts the rows'],
  ['GROUP BY', 'gathers rows that share a value'],
  ['INSERT INTO', 'adds a new row'],
  ['UPDATE', 'changes values in existing rows'],
  ['DELETE', 'removes rows'],
  ['COUNT', 'returns how many rows there are'],
  ['JOIN', 'combines rows from two tables'],
  ['DISTINCT', 'removes repeated values'],
  ['LIKE', 'matches text against a pattern']
];
/* Table, a text column, and a column worth comparing with a number. Keeping
   them apart matters: "WHERE Item > 2" over a column of product names is a
   query no one would write. */
const TABLES = [['Pupils', 'Name', 'Year', 7, 13], ['Books', 'Title', 'Pages', 100, 500],
                ['Orders', 'Item', 'Price', 5, 60], ['Staff', 'Surname', 'Salary', 20000, 60000],
                ['Films', 'Title', 'Year', 1950, 2020], ['Stock', 'Product', 'Quantity', 5, 80]];

export const sql = [
  (r) => { const [word, job] = pick(r, SQL_KEYWORDS);
    return choice(r, {
      prompt: `Which SQL keyword ${job}?`,
      correct: word,
      distractors: sample(r, SQL_KEYWORDS.filter(k => k[0] !== word).map(k => k[0]), 3),
      hint: 'Read the query aloud in the order the keywords appear.',
      explanation: `${word} ${job}.`
    }); },

  (r) => { const [word, job] = pick(r, SQL_KEYWORDS);
    return blankQ(`What does the SQL keyword ${word} do? Answer in a few words.`, job,
      { hint: 'Say what changes about the rows or columns you get back.',
        explanation: `${word} ${job}.` }); },

  (r) => { const [table, col] = pick(r, TABLES);
    return blankQ(`Write a query that returns the ${col} column from the ${table} table.`,
      `SELECT ${col} FROM ${table}`,
      { accept: [`SELECT ${col} FROM ${table};`, `select ${col} from ${table}`],
        hint: 'Name the columns first, then the table.',
        explanation: `SELECT ${col} FROM ${table}.` }); },

  (r) => { const [table] = pick(r, TABLES);
    return blankQ(`Write a query that returns every column from the ${table} table.`,
      `SELECT * FROM ${table}`,
      { accept: [`SELECT * FROM ${table};`, `select * from ${table}`],
        hint: 'One character stands for every column.',
        explanation: `SELECT * FROM ${table}.` }); },

  (r) => { const [table, , col, lo, hi] = pick(r, TABLES), n = int(r, lo, hi);
    return blankQ(`Write a query that returns the rows of ${table} where ${col} is greater than ${n}. Use SELECT *.`,
      `SELECT * FROM ${table} WHERE ${col} > ${n}`,
      { accept: [`SELECT * FROM ${table} WHERE ${col} > ${n};`],
        hint: 'The filter goes after the table name.',
        explanation: `SELECT * FROM ${table} WHERE ${col} > ${n}.` }); },

  (r) => { return blankQ('Which SQL keyword sorts the rows a query returns?', 'ORDER BY',
      { accept: ['order by'],
        hint: 'Two words.', explanation: 'ORDER BY sorts the rows.' }); },

  (r) => { return blankQ('Which character stands for “every column” in a SELECT?', '*',
      { hint: 'It is a single symbol.', explanation: 'SELECT * returns every column.' }); },

  (r) => { const rows = int(r, 3, 40);
    return blankQ(`A table holds ${rows} rows. What does SELECT COUNT(*) return for it?`, rows,
      { hint: 'COUNT(*) counts the rows.',
        explanation: `The table has ${rows} rows, so COUNT(*) returns ${rows}.` }); },

  (r) => { const [table, col] = pick(r, TABLES);
    return blankQ(`Write a query that returns the rows of ${table} sorted by ${col}. Use SELECT *.`,
      `SELECT * FROM ${table} ORDER BY ${col}`,
      { accept: [`SELECT * FROM ${table} ORDER BY ${col};`],
        hint: 'The sort goes last.',
        explanation: `SELECT * FROM ${table} ORDER BY ${col}.` }); },

  (r) => { const total = int(r, 10, 60), distinct = int(r, 2, 9);
    return blankQ(`A column holds ${total} values, of which ${distinct} are different. How many rows does SELECT DISTINCT on that column return?`,
      distinct,
      { hint: 'DISTINCT keeps one of each.',
        explanation: `${distinct} different values means ${distinct} rows.` }); }
];

/* Every computing drill family, keyed the way the generator table expects. */
export const CS_DRILL_GENERATORS = {
  binary, hexadecimal, datasizes, logicgates, booleanalgebra,
  bigo, charencoding, networking, tracingcode, sorting, sql
};
