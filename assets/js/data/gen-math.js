/* Mathematics generators.
   Every generator takes (rng, tier) where tier is 1 easy, 2 medium, 3 hard,
   and returns one question with a computed answer. Nothing here hard-codes an
   answer a human typed, so a worksheet cannot disagree with its own key. */

import {
  int, pick, sample, choice, nearMisses, gcd, simplify, num, money, mathQ,
  blankQ, multiQ, matchQ, orderQ, writtenQ
} from './gen-core.js';

const span = (tier, a, b, c) => [a, b, c][tier - 1];

/* ============================== ARITHMETIC ============================== */
export const arithmetic = [
  (r, t) => {
    const hi = span(t, 20, 200, 2000);
    const a = int(r, 2, hi), b = int(r, 2, hi);
    return mathQ('Add the numbers.', `${a} + ${b} = ?`, a + b,
      { hint: t > 1 ? 'Add the units first, then carry.' : 'Count on from the larger number.',
        explanation: `${a} + ${b} = ${a + b}.` });
  },
  (r, t) => {
    const hi = span(t, 20, 200, 2000);
    const a = int(r, 5, hi), b = int(r, 2, a);
    return mathQ('Subtract.', `${a} − ${b} = ?`, a - b,
      { hint: 'Count back, or line up the columns.', explanation: `${a} − ${b} = ${a - b}.` });
  },
  (r, t) => {
    const [x, y] = t === 1 ? [int(r, 2, 9), int(r, 2, 9)]
                 : t === 2 ? [int(r, 3, 12), int(r, 3, 12)]
                           : [int(r, 12, 40), int(r, 6, 25)];
    return mathQ('Multiply.', `${x} × ${y} = ?`, x * y,
      { hint: t > 2 ? 'Split one factor into tens and units.' : 'Think of it as repeated addition.',
        explanation: `${x} × ${y} = ${x * y}.` });
  },
  (r, t) => {
    const b = int(r, 2, span(t, 9, 12, 25));
    const q = int(r, 2, span(t, 10, 12, 40));
    return mathQ('Divide.', `${b * q} ÷ ${b} = ?`, q,
      { hint: `How many ${b}s fit into ${b * q}?`, explanation: `${b} × ${q} = ${b * q}, so ${b * q} ÷ ${b} = ${q}.` });
  },
  (r, t) => {
    const a = int(r, 2, span(t, 10, 30, 90));
    const res = int(r, a + 1, a + span(t, 15, 60, 300));
    return mathQ('Find the missing number.', `${a} + ? = ${res}`, res - a,
      { hint: 'Subtract to undo the addition.', explanation: `${res} − ${a} = ${res - a}.` });
  },
  (r, t) => {
    const n = int(r, span(t, 100, 1000, 10000), span(t, 999, 9999, 99999));
    const place = pick(r, t === 1 ? ['tens', 'hundreds'] : ['tens', 'hundreds', 'thousands']);
    const digit = { tens: Math.floor(n / 10) % 10, hundreds: Math.floor(n / 100) % 10, thousands: Math.floor(n / 1000) % 10 }[place];
    return blankQ(`In the number ${n}, which digit is in the ${place} place?`, digit,
      { explanation: `Reading ${n} from the right: units, tens, hundreds, thousands. The ${place} digit is ${digit}.` });
  },
  (r, t) => {
    const n = int(r, 120, span(t, 999, 9999, 99999));
    const to = pick(r, t === 1 ? [10] : t === 2 ? [10, 100] : [100, 1000]);
    const ans = Math.round(n / to) * to;
    return choice(r, {
      prompt: `Round ${n} to the nearest ${to}.`, correct: ans,
      distractors: [Math.floor(n / to) * to, Math.ceil(n / to) * to + to, ans + to, ans - to],
      hint: `Look at the digit just below the ${to}s.`,
      explanation: `${n} rounds to ${ans} to the nearest ${to}.`
    });
  },
  (r, t) => {
    const items = pick(r, ['pencils', 'apples', 'stickers', 'books', 'marbles']);
    const boxes = int(r, 3, span(t, 8, 15, 30));
    const per = int(r, 3, span(t, 9, 14, 40));
    return blankQ(`A box holds ${per} ${items}. How many ${items} are in ${boxes} boxes?`, boxes * per,
      { hint: 'This is a multiplication.', explanation: `${per} × ${boxes} = ${boxes * per}.` });
  },
  (r, t) => {
    const a = int(r, 2, 12), b = int(r, 2, 12), c = int(r, 2, 12);
    const ans = a + b * c;
    return choice(r, {
      prompt: 'Work this out, following the order of operations.', math: `${a} + ${b} × ${c}`,
      correct: ans, distractors: [(a + b) * c, a * b + c, ans + b, ans - c],
      hint: 'Multiplication happens before addition.',
      explanation: `${b} × ${c} = ${b * c} first, then ${a} + ${b * c} = ${ans}.`
    });
  },
  (r, t) => {
    const n = int(r, 2, span(t, 10, 20, 40));
    const factors = [];
    for (let i = 1; i <= n; i++) if (n % i === 0) factors.push(String(i));
    const wrong = sample(r, Array.from({ length: n }, (_, i) => String(i + 1)).filter(x => !factors.includes(x)), 2);
    return multiQ(r, {
      prompt: `Which of these are factors of ${n}? Choose all that apply.`,
      correct: sample(r, factors, Math.min(2, factors.length)), wrong,
      explanation: `The factors of ${n} are ${factors.join(', ')}.`
    });
  }
];

/* ============================== FRACTIONS ============================== */
export const fractions = [
  (r, t) => {
    const d = pick(r, span(t, [2, 3, 4, 5, 6, 8], [4, 5, 6, 8, 10, 12], [7, 9, 11, 12, 15, 16]));
    const n = int(r, 1, d - 1);
    const thing = pick(r, ['a pizza', 'a cake', 'a chocolate bar', 'a ribbon']);
    const [sn, sd] = simplify(n, d);
    return blankQ(`${thing[0].toUpperCase() + thing.slice(1)} is cut into ${d} equal parts and ${n} ${n === 1 ? 'part is' : 'parts are'} taken. Write that as a fraction.`,
      `${n}/${d}`, {
        accept: [`${sn}/${sd}`],
        explanation: `${n} out of ${d} parts is ${n}/${d}${sn === n ? '.' : `, which simplifies to ${sn}/${sd}.`}`
      });
  },
  (r, t) => {
    const [n, d] = [int(r, 1, 5), pick(r, [2, 3, 4, 5, 6])];
    const k = int(r, 2, span(t, 4, 6, 9));
    return mathQ('Complete the equivalent fraction.', `${n}/${d} = ? / ${d * k}`, n * k,
      { hint: `The bottom was multiplied by ${k}, so do the same on top.`,
        explanation: `${d} × ${k} = ${d * k}, so ${n} × ${k} = ${n * k}, giving ${n * k}/${d * k}.` });
  },
  (r, t) => {
    const g = int(r, 2, span(t, 4, 6, 12));
    const [sn, sd] = [int(r, 1, 5), int(r, 6, 11)];
    const [n, d] = [sn * g, sd * g];
    const [an, ad] = simplify(n, d);
    return blankQ(`Simplify ${n}/${d} to its simplest form.`, `${an}/${ad}`,
      { hint: `Both numbers divide by ${gcd(n, d)}.`, explanation: `${n} ÷ ${g} = ${an} and ${d} ÷ ${g} = ${ad}, giving ${an}/${ad}.` });
  },
  (r, t) => {
    const d = pick(r, [5, 6, 7, 8, 9, 10, 12]);
    const a = int(r, 1, d - 2), b = int(r, 1, d - a - 1);
    const [sn, sd] = simplify(a + b, d);
    const same = sn === a + b && sd === d;
    return mathQ('Add the fractions. Give your answer in its simplest form.', `${a}/${d} + ${b}/${d} = ?`,
      `${sn}/${sd}`, {
        hint: 'The denominators match, so add the numerators.',
        explanation: `${a} + ${b} = ${a + b}, giving ${a + b}/${d}${same ? '.' : `, which simplifies to ${sn}/${sd}.`}`
      });
  },
  (r, t) => {
    if (t === 1) {
      const d = pick(r, [4, 6, 8]);
      const a = int(r, 2, d - 1), b = int(r, 1, a - 1);
      const [sn, sd] = simplify(a - b, d);
      return mathQ('Subtract the fractions.', `${a}/${d} − ${b}/${d} = ?`, `${sn}/${sd}`,
        { explanation: `${a} − ${b} = ${a - b}, giving ${sn}/${sd}.` });
    }
    const [d1, d2] = sample(r, [2, 3, 4, 5, 6], 2);
    const [n1, n2] = [int(r, 1, d1 - 1), int(r, 1, d2 - 1)];
    const nd = d1 * d2, nn = n1 * d2 + n2 * d1;
    const [sn, sd] = simplify(nn, nd);
    return mathQ('Add the fractions. Give your answer in its simplest form.', `${n1}/${d1} + ${n2}/${d2} = ?`,
      `${sn}/${sd}`, {
        hint: `Use a common denominator of ${nd}.`,
        explanation: `${n1}/${d1} = ${n1 * d2}/${nd} and ${n2}/${d2} = ${n2 * d1}/${nd}. Adding gives ${nn}/${nd} = ${sn}/${sd}.`
      });
  },
  (r, t) => {
    const [d1, d2] = sample(r, [2, 3, 4, 5, 6, 8, 10], 2);
    const [n1, n2] = [int(r, 1, d1 - 1), int(r, 1, d2 - 1)];
    const v1 = n1 / d1, v2 = n2 / d2;
    if (v1 === v2) return null;
    const bigger = v1 > v2 ? `${n1}/${d1}` : `${n2}/${d2}`;
    return choice(r, {
      prompt: `Which fraction is larger?`, correct: bigger,
      distractors: [v1 > v2 ? `${n2}/${d2}` : `${n1}/${d1}`, 'They are equal'],
      hint: 'Convert both to decimals, or use a common denominator.',
      explanation: `${n1}/${d1} = ${num(v1)} and ${n2}/${d2} = ${num(v2)}, so ${bigger} is larger.`
    });
  },
  (r, t) => {
    const d = pick(r, [3, 4, 5, 6, 8]);
    const n = int(r, 1, d - 1);
    const total = d * int(r, 2, span(t, 6, 12, 25));
    return blankQ(`What is ${n}/${d} of ${total}?`, (total / d) * n,
      { hint: `Divide by ${d} first, then multiply by ${n}.`,
        explanation: `${total} ÷ ${d} = ${total / d}, and ${total / d} × ${n} = ${(total / d) * n}.` });
  },
  (r, t) => {
    const items = sample(r, [[1, 2], [1, 3], [1, 4], [2, 3], [3, 4], [1, 5], [2, 5], [3, 5], [5, 8], [1, 8]], 4)
      .sort((a, b) => a[0] / a[1] - b[0] / b[1]);
    return orderQ('Order these fractions from smallest to largest.',
      items.map(([n, d]) => `${n}/${d}`),
      `As decimals: ${items.map(([n, d]) => num(n / d)).join(', ')}.`);
  },
  (r, t) => {
    const d = pick(r, [2, 4, 5, 8, 10]);
    const n = int(r, 1, d - 1);
    return mathQ('Write this fraction as a decimal.', `${n}/${d} = ?`, num(n / d),
      { hint: 'Divide the top by the bottom.', explanation: `${n} ÷ ${d} = ${num(n / d)}.` });
  }
];

/* =============================== DECIMALS =============================== */
export const decimals = [
  (r, t) => {
    const dp = span(t, 1, 2, 3);
    const a = int(r, 10, 999) / 10 ** dp, b = int(r, 10, 999) / 10 ** dp;
    return mathQ('Add the decimals.', `${num(a)} + ${num(b)} = ?`, num(a + b),
      { hint: 'Line up the decimal points.', explanation: `${num(a)} + ${num(b)} = ${num(a + b)}.` });
  },
  (r, t) => {
    const dp = span(t, 1, 2, 2);
    const a = int(r, 100, 999) / 10 ** dp, b = int(r, 10, 99) / 10 ** dp;
    return mathQ('Subtract the decimals.', `${num(a)} − ${num(b)} = ?`, num(a - b),
      { explanation: `${num(a)} − ${num(b)} = ${num(a - b)}.` });
  },
  (r, t) => {
    const a = int(r, 11, 99) / 10;
    const b = int(r, 2, span(t, 6, 12, 25));
    return mathQ('Multiply.', `${num(a)} × ${b} = ?`, num(a * b),
      { hint: 'Multiply as whole numbers, then put the point back.',
        explanation: `${a * 10} × ${b} = ${a * 10 * b}, so ${num(a)} × ${b} = ${num(a * b)}.` });
  },
  (r, t) => {
    const v = int(r, 1000, 99999) / 1000;
    const dp = pick(r, t === 1 ? [1] : [1, 2]);
    const ans = Number(v.toFixed(dp));
    return choice(r, {
      prompt: `Round ${num(v)} to ${dp} decimal place${dp === 1 ? '' : 's'}.`, correct: num(ans),
      distractors: [num(ans + 10 ** -dp), num(ans - 10 ** -dp), num(Math.floor(v * 10 ** dp) / 10 ** dp), num(Math.round(v))],
      explanation: `${num(v)} to ${dp} d.p. is ${num(ans)}.`
    });
  },
  (r, t) => {
    const vals = sample(r, [0.3, 0.25, 0.5, 0.75, 0.08, 0.9, 0.12, 0.45, 0.6, 0.05], 4)
      .sort((a, b) => a - b);
    return orderQ('Order these decimals from smallest to largest.', vals.map(num),
      'Compare the tenths first, then the hundredths.');
  },
  (r, t) => {
    const d = pick(r, [4, 5, 8, 10, 20, 25]);
    const n = int(r, 1, d - 1);
    return mathQ('Write this decimal as a fraction in its simplest form.',
      `${num(n / d)} = ?`, simplify(n, d).join('/'),
      { explanation: `${num(n / d)} is ${n}/${d}, which simplifies to ${simplify(n, d).join('/')}.` });
  },
  (r, t) => {
    const price = int(r, 150, 4999) / 100;
    const qty = int(r, 2, 9);
    return blankQ(`One notebook costs $${money(price)}. What do ${qty} cost, in dollars?`,
      money(price * qty), { explanation: `${money(price)} × ${qty} = ${money(price * qty)}.` });
  }
];

/* ============================= PERCENTAGES ============================= */
export const percentages = [
  (r, t) => {
    const p = pick(r, span(t, [10, 25, 50], [5, 15, 20, 30, 40], [12, 17.5, 35, 65, 85]));
    const base = int(r, 2, span(t, 20, 60, 200)) * span(t, 10, 5, 4);
    return mathQ('Work it out.', `${p}% of ${base} = ?`, num(base * p / 100),
      { hint: `10% of ${base} is ${num(base / 10)}.`,
        explanation: `${p}% of ${base} = ${base} × ${p / 100} = ${num(base * p / 100)}.` });
  },
  (r, t) => {
    const total = int(r, 4, 25) * 4;
    const part = int(r, 1, total - 1);
    const pct = Math.round((part / total) * 1000) / 10;
    return mathQ('What percentage is this? Round to one decimal place if needed.',
      `${part} out of ${total} = ? %`, num(pct),
      { hint: 'Divide, then multiply by 100.', explanation: `${part} ÷ ${total} = ${num(part / total)}, which is ${num(pct)}%.` });
  },
  (r, t) => {
    const base = int(r, 4, 40) * 5;
    const p = pick(r, [10, 15, 20, 25, 30]);
    const dec = base * (1 - p / 100);
    return blankQ(`A jacket costs $${base} and is reduced by ${p}%. What is the new price in dollars?`,
      money(dec), { hint: `${p}% of ${base} is ${num(base * p / 100)}.`,
        explanation: `${p}% of $${base} is $${num(base * p / 100)}, and $${base} − $${num(base * p / 100)} = $${money(dec)}.` });
  },
  (r, t) => {
    const from = int(r, 4, 30) * 5;
    const change = int(r, 1, 8) * 5;
    const to = from + change;
    const pct = Math.round((change / from) * 1000) / 10;
    return choice(r, {
      prompt: `A price rises from ${from} to ${to}. What is the percentage increase?`,
      correct: `${num(pct)}%`,
      distractors: [`${num(Math.round((change / to) * 1000) / 10)}%`, `${change}%`, `${num(pct * 2)}%`],
      hint: 'Divide the change by the original amount.',
      explanation: `The change is ${change}. ${change} ÷ ${from} = ${num(change / from)}, which is ${num(pct)}%.`
    });
  },
  (r, t) => {
    const orig = int(r, 4, 30) * 10;
    const p = pick(r, [20, 25, 40, 50]);
    const paid = orig * (1 - p / 100);
    return blankQ(`After a ${p}% discount an item costs $${money(paid)}. What was the original price in dollars?`,
      money(orig), { hint: `$${money(paid)} represents ${100 - p}% of the original.`,
        explanation: `${money(paid)} ÷ ${num(1 - p / 100)} = $${money(orig)}.` });
  },
  (r, t) => {
    const p = pick(r, [5, 10, 12.5, 20, 25, 50, 75]);
    return matchQ(r, {
      prompt: 'Match each percentage to its decimal.',
      pairs: [
        { left: '5%', right: '0.05' }, { left: '25%', right: '0.25' },
        { left: '50%', right: '0.5' }, { left: '75%', right: '0.75' },
        { left: '12.5%', right: '0.125' }, { left: '110%', right: '1.1' }
      ],
      explanation: 'Divide the percentage by 100 to get the decimal.'
    });
  },
  (r, t) => writtenQ(
    'A shop advertises "40% off, then a further 10% off at the till". Is that the same as 50% off? Explain your reasoning.',
    'No. The second discount applies to the already-reduced price: 0.6 × 0.9 = 0.54, so you pay 54% and the true discount is 46%, not 50%.',
    'Look for the idea that successive discounts multiply rather than add.')
];

/* =============================== ALGEBRA =============================== */
export const algebra = [
  (r, t) => {
    const x = int(r, 2, span(t, 10, 15, 25));
    const a = int(r, 2, span(t, 5, 9, 12));
    const b = int(r, 1, span(t, 12, 30, 60));
    return mathQ('Solve for x:', `${a}x + ${b} = ${a * x + b}`, x,
      { hint: `Subtract ${b} from both sides, then divide by ${a}.`,
        explanation: `${a}x = ${a * x}, so x = ${x}.` });
  },
  (r, t) => {
    const x = int(r, 2, span(t, 10, 15, 25));
    const a = int(r, 2, span(t, 6, 9, 12));
    const b = int(r, 1, span(t, 12, 30, 60));
    return mathQ('Solve for x:', `${a}x − ${b} = ${a * x - b}`, x,
      { hint: `Add ${b} to both sides first.`, explanation: `${a}x = ${a * x}, so x = ${x}.` });
  },
  (r, t) => {
    const x = int(r, 2, 14);
    const a = int(r, 2, 6), b = int(r, 1, 9);
    return mathQ('Solve for x:', `${a}(x + ${b}) = ${a * (x + b)}`, x,
      { hint: `Divide both sides by ${a} first — it is quicker than expanding.`,
        explanation: `x + ${b} = ${x + b}, so x = ${x}.` });
  },
  (r, t) => {
    const x = int(r, 2, 12);
    const a = int(r, 4, 9), b = int(r, 2, a - 1);
    const c = (a - b) * x;
    return mathQ('Solve for x:', `${a}x = ${b}x + ${c}`, x,
      { hint: 'Collect the x terms on one side.',
        explanation: `${a}x − ${b}x = ${c}, so ${a - b}x = ${c} and x = ${x}.` });
  },
  (r, t) => {
    const a = int(r, 2, 8), b = int(r, 1, 9), x = int(r, 2, 9);
    return mathQ(`Substitute x = ${x} into the expression.`, `${a}x + ${b}`, a * x + b,
      { explanation: `${a} × ${x} = ${a * x}, and ${a * x} + ${b} = ${a * x + b}.` });
  },
  (r, t) => {
    const a = int(r, 2, 7), b = int(r, 2, 9);
    return mathQ('Expand the brackets.', `${a}(x + ${b})`, `${a}x+${a * b}`,
      { accept: [`${a}x + ${a * b}`, `${a * b}+${a}x`],
        hint: 'Multiply everything inside by the number outside.',
        explanation: `${a} × x = ${a}x and ${a} × ${b} = ${a * b}, so the answer is ${a}x + ${a * b}.` });
  },
  (r, t) => {
    const p = int(r, 1, span(t, 5, 8, 11)), q = int(r, 1, span(t, 5, 8, 11));
    if (p === q) return null;
    const b = p + q, c = p * q;
    return mathQ('Solve by factorising. Give the larger root.', `x² − ${b}x + ${c} = 0`, Math.max(p, q),
      { hint: `Find two numbers that multiply to ${c} and add to ${b}.`,
        explanation: `(x − ${p})(x − ${q}) = 0, so x = ${p} or x = ${q}. The larger is ${Math.max(p, q)}.` });
  },
  (r, t) => {
    const a = int(r, 1, 4), b = int(r, 2, 9), c = int(r, 1, 9);
    const disc = b * b - 4 * a * c;
    /* "1x²" is not how anyone writes it. */
    const lead = a === 1 ? '' : String(a);
    return choice(r, {
      prompt: `How many real roots does this equation have?`, math: `${lead}x² + ${b}x + ${c} = 0`,
      correct: disc > 0 ? 'Two' : disc === 0 ? 'One (repeated)' : 'None',
      distractors: ['Two', 'One (repeated)', 'None'],
      hint: 'Work out the discriminant, b² − 4ac.',
      explanation: `b² − 4ac = ${b * b} − ${4 * a * c} = ${disc}, which is ${disc > 0 ? 'positive, so there are two real roots' : disc === 0 ? 'zero, so there is one repeated root' : 'negative, so there are no real roots'}.`
    });
  },
  (r, t) => {
    const m = int(r, 2, 6), c = int(r, -6, 8);
    const x = int(r, 1, 6);
    return mathQ(`For the line y = ${m}x ${c < 0 ? '− ' + -c : '+ ' + c}, find y when x = ${x}.`,
      `y = ${m}(${x}) ${c < 0 ? '− ' + -c : '+ ' + c}`, m * x + c,
      { explanation: `${m} × ${x} = ${m * x}, and ${m * x} ${c < 0 ? '− ' + -c : '+ ' + c} = ${m * x + c}.` });
  },
  (r, t) => orderQ('Put the steps for solving 3x + 4 = 19 in the correct order.',
    ['Subtract 4 from both sides', 'Simplify to 3x = 15', 'Divide both sides by 3', 'State x = 5'],
    'Undo the addition, simplify, then undo the multiplication.')
];

/* =============================== GEOMETRY =============================== */
export const geometry = [
  (r, t) => {
    const a = int(r, 25, 85), b = int(r, 25, 175 - a);
    return mathQ('Two angles in a triangle are given. Find the third.',
      `${a}° + ${b}° + ? = 180°`, 180 - a - b,
      { hint: 'The angles in a triangle sum to 180°.', explanation: `180 − ${a} − ${b} = ${180 - a - b}°.` });
  },
  (r, t) => {
    const w = int(r, 3, span(t, 12, 25, 60)), h = int(r, 3, span(t, 12, 25, 60));
    const which = pick(r, ['area', 'perimeter']);
    return which === 'area'
      ? mathQ(`A rectangle measures ${w} by ${h}. Find its area.`, `${w} × ${h} = ?`, w * h,
          { explanation: `Area = length × width = ${w} × ${h} = ${w * h}.` })
      : mathQ(`A rectangle measures ${w} by ${h}. Find its perimeter.`, `2(${w} + ${h}) = ?`, 2 * (w + h),
          { explanation: `Perimeter = 2 × (${w} + ${h}) = ${2 * (w + h)}.` });
  },
  (r, t) => {
    const b = int(r, 4, 24), h = int(r, 3, 20);
    return mathQ(`A triangle has base ${b} and height ${h}. Find its area.`,
      `(${b} × ${h}) ÷ 2 = ?`, (b * h) / 2,
      { hint: 'Half of base times height.', explanation: `${b} × ${h} = ${b * h}, and half of that is ${(b * h) / 2}.` });
  },
  (r, t) => {
    const a = int(r, 20, 160);
    const kind = pick(r, ['complementary', 'supplementary']);
    const total = kind === 'complementary' ? 90 : 180;
    if (a >= total) return null;
    return choice(r, {
      prompt: `Two angles are ${kind}. One is ${a}°. What is the other?`,
      correct: `${total - a}°`, distractors: [`${180 - a}°`, `${90 - a}°`, `${a}°`, `${total + a}°`],
      explanation: `${kind[0].toUpperCase() + kind.slice(1)} angles add to ${total}°, so ${total} − ${a} = ${total - a}°.`
    });
  },
  (r, t) => {
    const [a, b] = pick(r, [[3, 4], [6, 8], [5, 12], [9, 12], [8, 15], [7, 24]]);
    const c = Math.sqrt(a * a + b * b);
    return mathQ(`A right-angled triangle has legs of ${a} and ${b}. Find the hypotenuse.`,
      `√(${a}² + ${b}²) = ?`, num(c),
      { hint: `${a * a} + ${b * b} = ${a * a + b * b}.`, explanation: `√${a * a + b * b} = ${num(c)}.` });
  },
  (r, t) => {
    const rad = int(r, 2, 15);
    const which = pick(r, ['circumference', 'area']);
    const val = which === 'circumference' ? 2 * Math.PI * rad : Math.PI * rad * rad;
    return mathQ(`A circle has radius ${rad}. Find its ${which} to one decimal place. Use π ≈ 3.142.`,
      which === 'circumference' ? `2 × π × ${rad} = ?` : `π × ${rad}² = ?`,
      num(Math.round(val * 10) / 10),
      { explanation: `${which === 'circumference' ? `2 × 3.142 × ${rad}` : `3.142 × ${rad * rad}`} ≈ ${num(Math.round(val * 10) / 10)}.` });
  },
  (r, t) => {
    const s = int(r, 2, 12), w = int(r, 2, 12), h = int(r, 2, 12);
    return mathQ(`A cuboid measures ${s} × ${w} × ${h}. Find its volume.`,
      `${s} × ${w} × ${h} = ?`, s * w * h,
      { explanation: `Volume = ${s} × ${w} × ${h} = ${s * w * h}.` });
  },
  (r, t) => choice(r, {
    prompt: pick(r, [
      'A triangle with all three sides equal is called…',
      'A triangle with exactly two equal sides is called…',
      'A triangle with no equal sides is called…'
    ]).replace(/^A triangle with (all three sides equal|exactly two equal sides|no equal sides)/,
      (m, g) => `A triangle with ${g}`),
    correct: 'Equilateral', distractors: ['Isosceles', 'Scalene', 'Right-angled'],
    explanation: 'Equilateral means all three sides equal; isosceles means two equal; scalene means none equal.'
  }),
  (r, t) => matchQ(r, {
    prompt: 'Match each angle to its name.',
    pairs: [
      { left: '45°', right: 'Acute' }, { left: '90°', right: 'Right' },
      { left: '130°', right: 'Obtuse' }, { left: '200°', right: 'Reflex' },
      { left: '180°', right: 'Straight' }
    ],
    explanation: 'Acute is under 90°, right is exactly 90°, obtuse is between 90° and 180°, reflex is over 180°.'
  }),
  (r, t) => {
    const n = int(r, 3, span(t, 6, 10, 12));
    return blankQ(`What is the sum of the interior angles of a ${n}-sided polygon, in degrees?`,
      (n - 2) * 180, { hint: 'Use (n − 2) × 180.', explanation: `(${n} − 2) × 180 = ${(n - 2) * 180}°.` });
  }
];

/* ============================= TRIGONOMETRY ============================= */
export const trigonometry = [
  (r) => choice(r, {
    prompt: 'In a right-angled triangle, which ratio does sine give?',
    correct: 'opposite ÷ hypotenuse',
    distractors: ['adjacent ÷ hypotenuse', 'opposite ÷ adjacent', 'hypotenuse ÷ opposite'],
    hint: 'Remember SOH-CAH-TOA.', explanation: 'SOH: Sine = Opposite over Hypotenuse.'
  }),
  (r) => {
    const [o, h] = pick(r, [[3, 5], [6, 10], [8, 17], [5, 13], [9, 15]]);
    return mathQ(`A right triangle has opposite ${o} and hypotenuse ${h}. Find sin θ as a decimal.`,
      `sin θ = ${o} / ${h} = ?`, num(Math.round((o / h) * 1000) / 1000),
      { explanation: `${o} ÷ ${h} = ${num(Math.round((o / h) * 1000) / 1000)}.` });
  },
  (r) => {
    const known = pick(r, [
      ['sin 30°', '1/2'], ['cos 60°', '1/2'], ['tan 45°', '1'],
      ['sin 90°', '1'], ['cos 0°', '1'], ['tan 0°', '0'], ['sin 0°', '0'], ['cos 90°', '0']
    ]);
    return blankQ(`What is the exact value of ${known[0]}?`, known[1],
      { explanation: `${known[0]} = ${known[1]}.` });
  },
  (r) => {
    const [a, b] = pick(r, [[3, 4], [6, 8], [5, 12], [8, 15], [7, 24], [9, 40]]);
    return mathQ(`Find the hypotenuse of a right triangle with legs ${a} and ${b}.`,
      `√(${a}² + ${b}²) = ?`, num(Math.sqrt(a * a + b * b)),
      { explanation: `${a * a} + ${b * b} = ${a * a + b * b}, and √${a * a + b * b} = ${num(Math.sqrt(a * a + b * b))}.` });
  },
  (r) => choice(r, {
    prompt: 'You know the opposite and adjacent sides and want the angle. Which do you use?',
    correct: 'tan⁻¹', distractors: ['sin⁻¹', 'cos⁻¹', 'Pythagoras'],
    explanation: 'TOA: tangent relates opposite and adjacent, so the inverse tangent recovers the angle.'
  }),
  (r) => matchQ(r, {
    prompt: 'Match each expression to its exact value.',
    pairs: [
      { left: 'sin 30°', right: '1/2' }, { left: 'cos 0°', right: '1' },
      { left: 'tan 45°', right: '1' }, { left: 'sin 0°', right: '0' },
      { left: 'cos 90°', right: '0' }
    ],
    explanation: 'These are the standard exact values worth memorising.'
  }),
  (r) => writtenQ(
    'A ladder leans against a wall at 65° to the ground and its foot is 2 m from the wall. Describe how you would find the ladder’s length.',
    'The 2 m is adjacent to the 65° angle and the ladder is the hypotenuse, so use cosine: cos 65° = 2 / L, which rearranges to L = 2 ÷ cos 65° ≈ 4.73 m.',
    'Look for: identify adjacent and hypotenuse, choose cosine, rearrange.')
];

/* ============================== STATISTICS ============================== */
export const statistics = [
  (r, t) => {
    const n = span(t, 5, 5, 7);
    const vals = Array.from({ length: n }, () => int(r, 2, span(t, 20, 40, 90)));
    const total = vals.reduce((a, b) => a + b, 0);
    if (total % n !== 0) vals[0] += n - (total % n);
    const fixed = vals.reduce((a, b) => a + b, 0);
    return mathQ(`Find the mean of ${vals.join(', ')}.`,
      `(${vals.join(' + ')}) ÷ ${n} = ?`, fixed / n,
      { explanation: `The total is ${fixed}, and ${fixed} ÷ ${n} = ${fixed / n}.` });
  },
  (r, t) => {
    const n = pick(r, [5, 7]);
    const vals = sample(r, Array.from({ length: 40 }, (_, i) => i + 1), n).sort((a, b) => a - b);
    return blankQ(`Find the median of ${sample(r, vals, n).join(', ')}.`, vals[(n - 1) / 2],
      { hint: 'Put them in order and take the middle one.',
        explanation: `In order: ${vals.join(', ')}. The middle value is ${vals[(n - 1) / 2]}.` });
  },
  (r, t) => {
    const vals = sample(r, Array.from({ length: 50 }, (_, i) => i + 1), 5);
    return blankQ(`Find the range of ${vals.join(', ')}.`, Math.max(...vals) - Math.min(...vals),
      { explanation: `${Math.max(...vals)} − ${Math.min(...vals)} = ${Math.max(...vals) - Math.min(...vals)}.` });
  },
  (r, t) => {
    const sides = pick(r, [6, 10]);
    const cond = pick(r, ['an even number', 'a number greater than 4', 'a multiple of 3']);
    const count = Array.from({ length: sides }, (_, i) => i + 1).filter(v =>
      cond === 'an even number' ? v % 2 === 0 : cond === 'a number greater than 4' ? v > 4 : v % 3 === 0).length;
    return mathQ(`A fair ${sides}-sided die is rolled. What is the probability of rolling ${cond}? Give a fraction in its simplest form.`,
      'P = ?', simplify(count, sides).join('/'),
      { explanation: `${count} of the ${sides} outcomes work, so P = ${count}/${sides} = ${simplify(count, sides).join('/')}.` });
  },
  (r, t) => {
    const [a, b] = [pick(r, [2, 3, 4]), pick(r, [2, 3, 4])];
    return mathQ(`Two independent events have probabilities 1/${a} and 1/${b}. What is the probability that both happen?`,
      `1/${a} × 1/${b} = ?`, `1/${a * b}`,
      { hint: 'Independent events multiply.', explanation: `1/${a} × 1/${b} = 1/${a * b}.` });
  },
  (r, t) => choice(r, {
    prompt: 'Which average is most affected by a single extreme outlier?',
    correct: 'Mean', distractors: ['Median', 'Mode', 'Range'],
    explanation: 'The mean uses every value, so one extreme value pulls it noticeably.'
  }),
  (r, t) => multiQ(r, {
    prompt: 'Which statements about probability are true? Choose all that apply.',
    correct: ['Probabilities lie between 0 and 1', 'The probabilities of all outcomes sum to 1'],
    wrong: ['A probability of 0 means the event is certain', 'Probabilities can be greater than 1'],
    explanation: 'A probability of 0 means impossible and 1 means certain; nothing exceeds 1.'
  }),
  (r, t) => writtenQ(
    'A survey of 20 people leaving a gym claims to represent a whole city’s exercise habits. What is wrong with that?',
    'The sample is both biased and too small. People leaving a gym already exercise, so they are not a random cross-section of the city, and 20 people cannot support a claim about a whole population.',
    'Look for sampling bias and insufficient sample size.')
];

/* =============================== CALCULUS =============================== */
export const calculus = [
  (r) => {
    const n = int(r, 2, 6), a = int(r, 1, 9);
    return mathQ('Differentiate with respect to x.', `y = ${a > 1 ? a : ''}x^${n}`,
      `${a * n}x^${n - 1}`,
      { accept: [`${a * n}x^${n - 1}`, n - 1 === 1 ? `${a * n}x` : null].filter(Boolean),
        hint: 'Power rule: bring the power down, then subtract one from it.',
        explanation: `dy/dx = ${a} × ${n}x^${n - 1} = ${a * n}x^${n - 1}.` });
  },
  (r) => {
    const a = int(r, 2, 9), b = int(r, 2, 9);
    return mathQ('Differentiate with respect to x.', `y = ${a}x² + ${b}x`, `${2 * a}x+${b}`,
      { accept: [`${2 * a}x + ${b}`], explanation: `dy/dx = ${2 * a}x + ${b}.` });
  },
  (r) => {
    const a = int(r, 1, 6), x = int(r, 1, 6);
    return mathQ(`Find the gradient of y = ${a > 1 ? a : ''}x² at x = ${x}.`,
      `dy/dx = ${2 * a}x, at x = ${x} → ?`, 2 * a * x,
      { explanation: `${2 * a} × ${x} = ${2 * a * x}.` });
  },
  (r) => blankQ('What is the derivative of a constant, for example y = 12?', '0',
    { explanation: 'A constant never changes, so its rate of change is 0.' }),
  (r) => choice(r, {
    prompt: 'What does the derivative of a function at a point tell you?',
    correct: 'The gradient of the tangent at that point',
    distractors: ['The area under the curve', 'The y-value at that point', 'The average value of the function'],
    explanation: 'A derivative is an instantaneous rate of change — the gradient of the tangent.'
  }),
  (r) => choice(r, {
    prompt: 'At a turning point of a smooth curve, the first derivative is…',
    correct: 'Zero', distractors: ['Positive', 'Negative', 'Undefined'],
    explanation: 'The tangent is horizontal at a turning point, so f′(x) = 0.'
  }),
  (r) => {
    const n = int(r, 1, 5);
    /* Choose the coefficient so the result is a whole multiple — an answer of
       "6x^6/6 + C" is technically right and horrible to read. */
    const k = int(r, 1, 4);
    const a = k * (n + 1);
    const coef = k === 1 ? '' : String(k);
    return mathQ('Integrate with respect to x. Include the constant of integration as + C.',
      `∫ ${a}x^${n} dx`, `${coef}x^${n + 1}+C`,
      { accept: [`${coef}x^${n + 1} + C`, `${coef}x^${n + 1}`],
        hint: 'Raise the power by one, then divide by the new power.',
        explanation: `∫ ${a}x^${n} dx = ${a}x^${n + 1}/${n + 1} + C = ${coef}x^${n + 1} + C.` });
  },
  (r) => matchQ(r, {
    prompt: 'Match each function to its derivative.',
    pairs: [
      { left: 'x⁴', right: '4x³' }, { left: '2x', right: '2' },
      { left: 'x⁻¹', right: '−x⁻²' }, { left: '√x', right: '1/(2√x)' },
      { left: '5', right: '0' }
    ],
    explanation: 'All follow from the power rule.'
  }),
  (r) => writtenQ(
    'A car’s position over time is s(t). Explain what s′(t) and s″(t) represent physically.',
    's′(t) is velocity — how quickly position changes with time. s″(t) is acceleration — how quickly the velocity itself is changing.',
    'Look for velocity and acceleration, correctly assigned.')
];

export const MATH_GENERATORS = {
  arithmetic, fractions, decimals, percentages, algebra, geometry, trigonometry, statistics, calculus
};
