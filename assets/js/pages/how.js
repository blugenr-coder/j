/* How it works — the marketing explainer, with the question-type list built
   from the same catalogue the player uses so it can never drift. */
import { $, el } from '../core/util.js';
import { mountShell } from '../core/shell.js';
import { QUESTION_TYPES } from '../data/catalog.js';
import { EXERCISES } from '../data/exercises.js';

mountShell({ page: 'how', nav: 'public' });

const EXAMPLES = {
  blank:   'The capital of France is ______',
  choice:  'One correct option out of four',
  multi:   'Every correct option, and no wrong ones',
  math:    'A maths keypad for x, ÷, √ and powers',
  match:   'Pair each term with its definition',
  order:   'Put the steps of a method in sequence',
  graph:   'Click a point on a coordinate grid',
  written: 'A few sentences, marked against a sample'
};

$('#type-list').replaceChildren(...QUESTION_TYPES.map(t => {
  const n = EXERCISES.filter(e => e.types.includes(t.id)).length;
  return el('div', { class: 'row', style: 'gap:12px;align-items:flex-start' },
    el('span', { class: 'tile-icon', style: 'width:34px;height:34px;font-size:16px', 'aria-hidden': 'true', text: t.emoji }),
    el('div', {},
      el('strong', { class: 'small', text: t.name }),
      el('div', { class: 'small muted', text: `${EXAMPLES[t.id]} · used in ${n} exercise${n === 1 ? '' : 's'}` })));
}));
