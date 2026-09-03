/* Achievements — section 12. Kept on its own page so gamification never
   intrudes on the practice screens. */
import { $, el, donut } from '../core/util.js';
import { mountShell, mountSideNav, requireUser } from '../core/shell.js';
import { ACHIEVEMENTS } from '../data/catalog.js';
import { icon } from '../core/icons.js';
import { getState, summary } from '../core/store.js';

mountShell({ page: 'achievements', nav: 'app', footer: false });
if (requireUser('achievements.html')) render();

function render() {
  mountSideNav($('#side-nav-host'), 'achievements');
  const unlocked = new Set(getState().achievements);
  const s = summary();

  $('#ach-progress').replaceChildren(el('div', { class: 'row', style: 'gap:16px' },
    donut(Math.round((unlocked.size / ACHIEVEMENTS.length) * 100), { size: 76 }),
    el('div', {},
      el('strong', { style: 'font-family:var(--font-head);font-size:var(--step-2)',
        text: `${unlocked.size} / ${ACHIEVEMENTS.length}` }),
      el('div', { class: 'small muted', text: 'unlocked' }))
  ));

  /* A short, honest progress line for the ones still locked. */
  const towards = {
    'first-sheet':  () => `${s.completed} of 1 exercise completed`,
    'streak-7':     () => `${s.streak} of 7 days`,
    'bookworm':     () => `${s.completed} of 50 completed`,
    'math-master':  () => `${s.mathHighScores} of 20 maths exercises at 90%+`,
    'perfect':      () => `${s.perfectRuns} of 1 perfect run`,
    'explorer':     () => `${s.subjectsTouched} of 4 subjects`,
    'century':      () => `${s.correct} of 100 correct answers`,
    'early-bird':   () => 'Finish an exercise before 9am'
  };

  $('#ach-grid').replaceChildren(...ACHIEVEMENTS.map(a => {
    const on = unlocked.has(a.id);
    return el('div', { class: `achievement ${on ? '' : 'locked'}` },
      el('span', { class: 'ach-ico' }, icon(a.icon, { size: 22 })),
      el('div', { class: 'grow' },
        el('strong', { style: 'font-family:var(--font-head)', text: a.name }),
        el('div', { class: 'small muted', text: a.desc }),
        !on ? el('div', { class: 'small', style: 'margin-top:4px;color:var(--primary)', text: towards[a.id]?.() ?? '' }) : null),
      el('span', { class: `badge ${on ? 'badge-success' : ''}`, text: on ? 'Unlocked' : 'Locked' })
    );
  }));
}
