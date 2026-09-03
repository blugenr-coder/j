/* Grade selection — section 3 of the plan. */
import { $, el } from '../core/util.js';
import { mountShell, href } from '../core/shell.js';
import { gradeCard } from '../core/cards.js';
import { icon } from '../core/icons.js';
import { GRADES } from '../data/catalog.js';
import { EXERCISES } from '../data/exercises.js';

mountShell({ page: 'grades', nav: 'public' });

$('#grade-cards').replaceChildren(...GRADES.map(gradeCard));

$('#level-groups').replaceChildren(...GRADES.map(g => {
  const chips = g.levels.map(level => {
    const n = EXERCISES.filter(e => e.level === level).length;
    return el('a', {
      class: 'chip',
      href: href(`library.html?grade=${g.id}&level=${encodeURIComponent(level)}`),
      title: `${n} worksheet${n === 1 ? '' : 's'}`
    }, `${level}`, el('span', { class: 'badge', style: 'padding:0 6px', text: String(n) }));
  });
  return el('div', { class: 'card' },
    el('div', { class: 'row', style: 'margin-bottom:12px' },
      el('span', { class: 'tile-icon', style: 'width:32px;height:32px' }, icon(g.icon, { size: 17 })),
      el('strong', { style: 'font-family:var(--font-head)', text: g.name }),
      el('span', { class: 'small muted', text: g.range })),
    el('div', { class: 'row', style: 'gap:8px;flex-wrap:wrap' }, chips)
  );
}));
