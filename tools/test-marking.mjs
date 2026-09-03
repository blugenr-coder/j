/* Marking engine and formatting tests. Run with: node tools/test-marking.mjs */
import { mark, answerText, normalise } from '../assets/js/core/marking.js';
import { formatMinutes } from '../assets/js/core/util.js';

let pass = 0, fail = 0;
const check = (label, actual, expected) => {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  ok ? pass++ : fail++;
  if (!ok) console.error(`FAIL  ${label}\n      expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
};
const marks = (label, q, given, expected) => check(label, mark(q, given).correct, expected);

/* Free text is forgiving about how an answer is written… */
marks('math: x = 5 accepted for 5',      { type: 'math', answer: '5', accept: ['x=5'] }, 'x = 5', true);
marks('math: surrounding whitespace',     { type: 'math', answer: '5' }, '  5  ', true);
marks('math: 0.5 equals 1/2',             { type: 'math', answer: '1/2' }, '0.5', true);
marks('math: 3/6 equals 1/2',             { type: 'math', answer: '1/2' }, '3/6', true);
marks('blank: currency symbols ignored',  { type: 'blank', answer: '53.10' }, '$53.10', true);
marks('blank: case insensitive',          { type: 'blank', answer: 'carbon dioxide', accept: ['co2'] }, 'CO2', true);
marks('math: superscript normalised',     { type: 'math', answer: '3x^2', accept: ['3x²'] }, '3x²', true);
marks('math: unicode minus normalised',   { type: 'math', answer: '-5' }, '−5', true);
/* …and strict about being right. */
marks('math: wrong value rejected',       { type: 'math', answer: '5' }, '6', false);
marks('blank: empty answer rejected',     { type: 'blank', answer: '5' }, '', false);

marks('choice: correct index',            { type: 'choice', answer: 2 }, 2, true);
marks('choice: wrong index',              { type: 'choice', answer: 2 }, 1, false);
marks('multi: order does not matter',     { type: 'multi', answer: [0, 2] }, [2, 0], true);
marks('multi: partial selection fails',   { type: 'multi', answer: [0, 2] }, [0], false);
marks('multi: extra selection fails',     { type: 'multi', answer: [0, 2] }, [0, 1, 2], false);

marks('order: correct sequence',          { type: 'order', items: ['a', 'b', 'c'] }, [0, 1, 2], true);
marks('order: swapped sequence',          { type: 'order', items: ['a', 'b', 'c'] }, [1, 0, 2], false);

const pairs = [{ left: 'a', right: '1' }, { left: 'b', right: '2' }];
marks('match: all pairs correct',         { type: 'match', pairs }, { 0: 0, 1: 1 }, true);
marks('match: crossed pairs',             { type: 'match', pairs }, { 0: 1, 1: 0 }, false);
marks('match: incomplete',                { type: 'match', pairs }, { 0: 0 }, false);

marks('graph: exact point',               { type: 'graph', answer: { x: 3, y: 2 } }, { x: 3, y: 2 }, true);
marks('graph: wrong point',               { type: 'graph', answer: { x: 3, y: 2 } }, { x: 2, y: 3 }, false);

marks('written: never auto-marked',       { type: 'written' }, 'any prose', null);

check('normalise strips x=',              normalise('x = 12'), '12');
check('answerText for order',             answerText({ type: 'order', items: ['Egg', 'Larva'] }), 'Egg → Larva');
check('answerText for choice',            answerText({ type: 'choice', options: ['a', 'b'], answer: 1 }), 'b');

/* Practice time: a real 45-second session must not read as "0m". */
check('formatMinutes: nothing',        formatMinutes(0), '0m');
check('formatMinutes: under a second', formatMinutes(0.008), '0m');
check('formatMinutes: 11 seconds',     formatMinutes(0.18), '11s');
check('formatMinutes: 45 seconds',     formatMinutes(0.75), '45s');
check('formatMinutes: one minute',     formatMinutes(1), '1m');
check('formatMinutes: under an hour',  formatMinutes(45), '45m');
check('formatMinutes: over an hour',   formatMinutes(62.5), '1h 3m');

console.log(`${pass} passed, ${fail} failed.`);
process.exit(fail ? 1 : 0);
