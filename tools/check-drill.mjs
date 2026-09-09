/* Re-mark every drill question from scratch.

   A drill sheet is a column of sums and an answer key. If the key is wrong the
   mistake is invisible until a class has already been marked on it, which is
   the one failure a worksheet site cannot recover from. So nothing here trusts
   the generator: each expression is parsed back out of the printed question,
   evaluated independently, and compared with the stored answer.

   Questions whose answer is not a number — ratios, mixed numbers, algebra,
   standard form — cannot be checked this way. They are counted and listed, so
   the share of the bank that rests on the generator alone is a number someone
   can look at rather than a hope.                                            */

import { DRILL_GENERATORS } from '../assets/js/data/gen-drill.js';
import { rng } from '../assets/js/data/gen-core.js';

const SEEDS = 400;

/** Turn a printed expression into something JavaScript can evaluate, or null. */
function toJs(text) {
  if (text == null) return null;
  let e = String(text).trim().replace(/\s*=\s*\?\s*$/, '');
  /* Anything with a letter, a colon, an arrow or a blank is not an arithmetic
     expression: algebra, ratios, rounding arrows and missing-number questions
     all land here and are reported as unchecked rather than quietly passed. */
  if (/[?a-zA-Z:→,%$]/.test(e)) return null;
  e = e.replace(/[−–]/g, '-').replace(/×/g, '*').replace(/÷/g, '/').replace(/\s/g, '');
  e = e.replace(/\^/g, '**');
  e = e.replace(/(\d+(?:\.\d+)?|\))²/g, '($1**2)').replace(/(\d+(?:\.\d+)?|\))³/g, '($1**3)');
  e = e.replace(/√(\d+(?:\.\d+)?)/g, 'Math.sqrt($1)').replace(/∛(\d+(?:\.\d+)?)/g, 'Math.cbrt($1)');
  /* Bracket every fraction, or 3/4 ÷ 5/8 evaluates as ((3/4)/5)/8 and the
     check reports a bug that is its own. The lookarounds keep it off the
     indices of a power: in 4**7/4**4 the "7/4" is not a fraction. */
  e = e.replace(/(?<![*\d.])(\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)(?![*\d.])/g, '($1/$2)');
  if (!/^[-+*/().0-9]+$/.test(e.replace(/Math\.(sqrt|cbrt)/g, ''))) return null;
  return e;
}

function evaluate(text) {
  const js = toJs(text);
  if (js === null) return null;
  try {
    const v = Function(`"use strict"; return (${js});`)();
    return Number.isFinite(v) ? v : null;
  } catch { return null; }
}

/* Four families are arithmetic underneath but do not print as an expression.
   Each gets its own reader here — a second implementation of the same rule,
   written from the printed question rather than from the generator, which is
   the only kind of check worth running against an answer key. */

const UNITS = { km: 1000, m: 1, cm: 0.01, mm: 0.001, kg: 1000, g: 1, mg: 0.001,
                tonnes: 1e6, litres: 1000, ml: 1, l: 1000, hours: 3600, minutes: 60, seconds: 1 };

/* Round the digits as they are printed, not the float behind them. 77.615
   stored as a double is a hair below 77.615, so Math.round(v * 100) / 100
   gives 77.61 while every learner and every teacher writes 77.62. */
function roundPrinted(text, dp) {
  const neg = text.startsWith('-') || text.startsWith('−');
  const [whole, frac = ''] = text.replace(/^[-−]/, '').split('.');
  if (frac.length <= dp) return Number(text.replace('−', '-'));
  let n = BigInt(whole + frac.slice(0, dp));
  if (Number(frac[dp]) >= 5) n += 1n;
  const digits = n.toString().padStart(dp + 1, '0');
  const out = dp === 0 ? digits : `${digits.slice(0, -dp)}.${digits.slice(-dp)}`;
  return Number(neg ? `-${out}` : out);
}

function sigfig(v, figs) {
  if (v === 0) return 0;
  const f = Math.pow(10, figs - 1 - Math.floor(Math.log10(Math.abs(v))));
  return Math.round((Math.round(v * f) / f) * 1e9) / 1e9;
}

/** Rounding: "Round to the nearest 100." with math "1383 → ?" */
function readRounding(q) {
  if (!/^Round /.test(q.prompt ?? '')) return null;
  const v = Number(String(q.math ?? '').split('→')[0].trim());
  if (!Number.isFinite(v)) return null;
  let m;
  if ((m = q.prompt.match(/nearest (\d+)/))) { const k = Number(m[1]); return Math.round(v / k) * k; }
  if (/nearest whole number/.test(q.prompt)) return Math.round(v);
  if ((m = q.prompt.match(/(\d+) decimal place/)))
    return roundPrinted(String(q.math ?? '').split('→')[0].trim(), Number(m[1]));
  if ((m = q.prompt.match(/(\d+) significant figure/))) return sigfig(v, Number(m[1]));
  return null;
}

/** Conversions: "Convert 27 kg to grams." */
function readConversion(q) {
  const m = (q.prompt ?? '').match(/^Convert ([\d.]+) (\w+) to (\w+)\.$/);
  if (!m) return null;
  const from = UNITS[m[2]] ?? UNITS[m[2].toLowerCase()];
  const toName = m[3].replace(/^(metres|centimetres|millimetres|grams|kilograms|kilometres|millilitres|litres|minutes|seconds|kilograms)$/,
    x => ({ metres: 'm', centimetres: 'cm', millimetres: 'mm', grams: 'g', kilograms: 'kg',
            kilometres: 'km', millilitres: 'ml', litres: 'litres', minutes: 'minutes', seconds: 'seconds' })[x]);
  const to = UNITS[toName];
  if (!from || !to) return null;
  return Math.round((Number(m[1]) * from / to) * 1e9) / 1e9;
}

/** Percentages: "20% of 340 = ?", "Increase 40 by 10.", "Find 25% of $7." */
function readPercent(q) {
  const text = `${q.prompt ?? ''} ${q.math ?? ''}`;
  let m;
  if ((m = text.match(/(\d+)% of \$?(\d+)/))) return Number(m[1]) * Number(m[2]) / 100;
  if ((m = text.match(/^Increase (\d+) by (\d+)%/))) return Number(m[1]) * (100 + Number(m[2])) / 100;
  if ((m = text.match(/^Decrease (\d+) by (\d+)%/))) return Number(m[1]) * (100 - Number(m[2])) / 100;
  return null;
}

/** Put the answer back where the unknown was and see whether the line holds.

    This covers two families at once: "3x + 4 = 19" and "? + 42 = 124". Both
    are read off the printed question, so a generator that computes its key
    from different numbers than it prints is caught here. */
function checkEquation(q) {
  const math = String(q.math ?? '');
  if (!/^[^=]+=[^=]+$/.test(math)) return null;
  const [left, right] = math.split('=').map(v => v.trim());
  const unknown = /x/.test(math) ? 'x' : ((left.includes('?') || right === '?' && left.includes('?')) ? '?' : null);
  if (!unknown && !(right.includes('?') && right !== '?')) return null;
  if (right === '?' && !/x/.test(math)) return null;   // an ordinary sum, checked elsewhere
  const x = Number(q.answer);
  if (!Number.isFinite(x)) return null;
  const sides = [left, right].map(side => {
    let e = side
      .replace(/[−–]/g, '-').replace(/×/g, '*').replace(/÷/g, '/')
      .replace(/\^/g, '**')
      .replace(/(\d)\s*x/g, '$1*x').replace(/(\d)\s*\(/g, '$1*(')
      .replace(/\bx\b/g, `(${x})`).replace(/\?/g, `(${x})`).replace(/\s/g, '');
    if (/[a-zA-Z]/.test(e)) return null;
    try { const v = Function(`"use strict"; return (${e});`)(); return Number.isFinite(v) ? v : null; }
    catch { return null; }
  });
  if (sides[0] === null || sides[1] === null) return null;
  return Math.abs(sides[0] - sides[1]) < 1e-9;
}

/* Factors, multiples and primes are all recomputable from the printed number,
   so none of this family has to be taken on trust. */
const allFactors = n => { const o = []; for (let i = 1; i <= n; i++) if (n % i === 0) o.push(i); return o; };
const hcf = (a, b) => (b ? hcf(b, a % b) : a);

function readFactors(q) {
  const p = q.prompt ?? '';
  let m;
  if ((m = p.match(/^List all the factors of (\d+)/))) return allFactors(+m[1]).join(', ');
  if ((m = p.match(/^Find the highest common factor of (\d+) and (\d+)/))) return String(hcf(+m[1], +m[2]));
  if ((m = p.match(/^Find the lowest common multiple of (\d+) and (\d+)/)))
    return String(+m[1] * +m[2] / hcf(+m[1], +m[2]));
  if ((m = p.match(/^Write the first prime number after (\d+)/))) {
    let n = +m[1] + 1; while (allFactors(n).length !== 2) n++; return String(n);
  }
  if ((m = p.match(/^Write (\d+) as a product of prime factors/))) {
    const out = []; let v = +m[1];
    for (let d = 2; d * d <= v; d++) while (v % d === 0) { out.push(d); v /= d; }
    if (v > 1) out.push(v);
    return out.join(' × ');
  }
  if ((m = p.match(/^How many factors does (\d+) have/))) return String(allFactors(+m[1]).length);
  if ((m = p.match(/^Write the largest factor of (\d+) that is smaller/))) {
    const f = allFactors(+m[1]); return String(f[f.length - 2]);
  }
  if ((m = p.match(/^Write the first multiple of (\d+) that is greater than (\d+)/)))
    return String((Math.floor(+m[2] / +m[1]) + 1) * +m[1]);
  if ((m = p.match(/^Write the smallest square number greater than (\d+)/))) {
    const s = Math.floor(Math.sqrt(+m[1])) + 1; return String(s * s);
  }
  if ((m = p.match(/^List all the common factors of (\d+) and (\d+)/)))
    return allFactors(hcf(+m[1], +m[2])).join(', ');
  return null;
}

/** Standard form: read the mantissa and the power back and multiply them out. */
function readStandardForm(q) {
  const p = q.prompt ?? '';
  const sf = /^(-?[\d.]+) × 10\^(-?\d+)$/;
  let m;
  if ((m = p.match(/^Write ([\d.]+) in standard form\.$/)) || (m = p.match(/^Write (0\.\d+) in standard form\.$/))) {
    const a = String(q.answer).match(sf);
    return a ? [Number(m[1]), Number(a[1]) * Math.pow(10, Number(a[2]))] : null;
  }
  if ((m = p.match(/^Write ([\d.]+) × 10\^(-?\d+) as an ordinary number\.$/)))
    return [Number(m[1]) * Math.pow(10, Number(m[2])), Number(q.answer)];
  if ((m = p.match(/^Write 10\^(\d+) as an ordinary number\.$/)))
    return [Math.pow(10, Number(m[1])), Number(q.answer)];
  if ((m = p.match(/^([\d.]+) × 10\^(-?\d+) is not in standard form/)))
    { const a = String(q.answer).match(sf);
      return a ? [Number(m[1]) * Math.pow(10, Number(m[2])), Number(a[1]) * Math.pow(10, Number(a[2]))] : null; }
  if ((m = p.match(/^Work out \(([\d.]+) × 10\^(-?\d+)\) ([×÷+]) \(([\d.]+) × 10\^(-?\d+)\)/))) {
    const l = Number(m[1]) * Math.pow(10, Number(m[2])), r = Number(m[4]) * Math.pow(10, Number(m[5]));
    const want = m[3] === '×' ? l * r : m[3] === '÷' ? l / r : l + r;
    const a = String(q.answer).match(sf);
    return a ? [want, Number(a[1]) * Math.pow(10, Number(a[2]))] : null;
  }
  if ((m = p.match(/^Work out \(([\d.]+) × 10\^(-?\d+)\)²/))) {
    const l = Number(m[1]) * Math.pow(10, Number(m[2]));
    const a = String(q.answer).match(sf);
    return a ? [l * l, Number(a[1]) * Math.pow(10, Number(a[2]))] : null;
  }
  return null;
}

let checked = 0, verified = 0, failures = [];
const unverified = new Map();
const skeletons = new Set();

for (const [topic, makers] of Object.entries(DRILL_GENERATORS)) {
  makers.forEach((maker, i) => {
    for (let s = 0; s < SEEDS; s++) {
      const q = maker(rng(s * 7919 + i * 104729 + topic.length));
      checked++;
      const where = `${topic}[${i}] seed ${s}`;
      const text = `${q.prompt ?? ''} ${q.math ?? ''} ${q.answer ?? ''} ${q.hint ?? ''} ${q.explanation ?? ''}`;

      if (!q.prompt) { failures.push(`${where}: no prompt`); continue; }
      if (q.answer === undefined || q.answer === '') { failures.push(`${where}: no answer`); continue; }
      if (!q.hint) { failures.push(`${where}: no hint`); continue; }
      if (!q.explanation) { failures.push(`${where}: no explanation`); continue; }
      if (/NaN|undefined|Infinity/.test(text)) { failures.push(`${where}: ${text.slice(0, 90)}`); continue; }
      if (/\s-\d/.test(`${q.prompt} ${q.math ?? ''}`)) failures.push(`${where}: hyphen where a minus sign belongs — ${q.math ?? q.prompt}`);

      skeletons.add((q.prompt + ' ¶ ' + (q.math ?? '')).replace(/-?\d+(\.\d+)?/g, '#'));

      const holds = checkEquation(q);
      if (holds !== null) {
        verified++;
        if (!holds) failures.push(`${where}: x = ${q.answer} does not satisfy ${q.math}`);
        continue;
      }

      const sf = readStandardForm(q);
      if (sf) {
        verified++;
        if (Math.abs(sf[0] - sf[1]) > Math.abs(sf[0]) * 1e-9) 
          failures.push(`${where}: ${q.prompt} → key ${q.answer}, recomputed ${sf[0]}`);
        continue;
      }

      const fac = readFactors(q);
      if (fac !== null) {
        verified++;
        if (fac !== String(q.answer)) failures.push(`${where}: ${q.prompt} → key ${q.answer}, recomputed ${fac}`);
        continue;
      }

      const expected = readRounding(q) ?? readConversion(q) ?? readPercent(q);
      if (expected !== null && expected !== undefined) {
        const got = Number(String(q.answer).replace(/[$%,]/g, ''));
        verified++;
        if (!Number.isFinite(got) || Math.abs(expected - got) > 1e-9)
          failures.push(`${where}: ${q.prompt} ${q.math ?? ''} → key ${q.answer}, recomputed ${expected}`);
        continue;
      }

      const lhs = evaluate(q.math ?? q.prompt);
      const rhs = evaluate(q.answer);
      if (lhs === null || rhs === null) {
        unverified.set(topic, (unverified.get(topic) ?? 0) + 1);
        continue;
      }
      verified++;
      if (Math.abs(lhs - rhs) > 1e-9) failures.push(`${where}: ${q.math} evaluates to ${lhs}, key says ${q.answer}`);
    }
  });
}

const topics = Object.keys(DRILL_GENERATORS).length;
const makers = Object.values(DRILL_GENERATORS).reduce((n, a) => n + a.length, 0);
console.log(`drill topics ${topics}, makers ${makers}, question skeletons ${skeletons.size}`);
console.log(`questions built ${checked}, re-evaluated independently ${verified} (${(verified / checked * 100).toFixed(1)}%)`);
if (unverified.size) {
  console.log('not numerically checkable (answer is a ratio, surd, expression or mixed number):');
  for (const [t, n] of [...unverified].sort((a, b) => b[1] - a[1])) console.log(`  ${t}: ${n}`);
}
if (failures.length) {
  console.error(`\n${failures.length} problem${failures.length === 1 ? '' : 's'}:`);
  for (const f of failures.slice(0, 40)) console.error('  ' + f);
  process.exit(1);
}
console.log('every checkable answer key agrees with its own question.');
