/* WorksheetHub — shared renderers for the pieces that appear on many pages:
   exercise cards, stat tiles, subject and grade tiles. */

import { el, esc, pct } from './util.js';
import { href } from './shell.js';
import { DIFF_MAP, SUBJECT_MAP, TOPIC_MAP, QTYPE_MAP, GRADE_MAP } from '../data/catalog.js';
import { EXERCISES } from '../data/exercises.js';
import { isFavorite, toggleFavorite, scoreFor, statusFor } from './store.js';

const STATUS_LABEL = {
  'completed':   { text: 'Completed',   cls: 'badge-success' },
  'in-progress': { text: 'In progress', cls: 'badge-warn' },
  'not-started': { text: 'Not started', cls: '' }
};

export function difficultyBadge(id) {
  const d = DIFF_MAP[id];
  return el('span', { class: `badge ${d?.badge ?? ''}` }, `${d?.dot ?? ''} ${d?.name ?? id}`);
}

export function favButton(exerciseId) {
  const btn = el('button', {
    class: 'star-btn', type: 'button',
    'aria-pressed': String(isFavorite(exerciseId)),
    'aria-label': 'Save to favourites', title: 'Save to favourites',
    text: '★',
    onclick: (e) => {
      e.preventDefault(); e.stopPropagation();
      const on = toggleFavorite(exerciseId);
      btn.setAttribute('aria-pressed', String(on));
    }
  });
  return btn;
}

/** The exercise card used across the library, dashboard and subject pages. */
export function exerciseCard(ex, { showProgress = true } = {}) {
  const status = statusFor(ex.id);
  const score = scoreFor(ex.id);
  const label = STATUS_LABEL[status];

  const card = el('article', { class: 'card ex-card' });

  card.append(
    el('div', { class: 'row-between', style: 'align-items:flex-start;flex-wrap:nowrap' },
      el('div', {},
        el('div', { class: 'ex-meta', text: `${ex.level} · ${SUBJECT_MAP[ex.subject]?.name ?? ex.subject}` }),
        el('h3', {}, el('a', { href: href(`exercise.html?id=${ex.id}`), text: ex.title, style: 'color:inherit' }))
      ),
      favButton(ex.id)
    ),
    el('p', { class: 'small', style: 'margin:0', text: ex.summary })
  );

  const tags = el('div', { class: 'ex-tags' },
    difficultyBadge(ex.difficulty),
    el('span', { class: 'badge', text: `${ex.count} questions` }),
    el('span', { class: 'badge', text: `${ex.minutes} min` })
  );
  if (ex.printable) tags.append(el('span', { class: 'badge', text: '🖨️ Printable' }));
  card.append(tags);

  if (showProgress && status !== 'not-started') {
    const done = pct(score.answered, score.total);
    card.append(el('div', {},
      el('div', { class: 'row-between small muted', style: 'margin-bottom:6px' },
        el('span', { text: `${score.answered} of ${score.total} answered` }),
        el('span', { text: `${done}%` })),
      el('div', { class: 'bar' }, el('span', { style: `width:${done}%` }))
    ));
  }

  card.append(el('div', { class: 'ex-foot' },
    el('span', { class: `badge ${label.cls}`, text: label.text }),
    el('a', {
      class: 'btn btn-primary btn-sm',
      href: href(`exercise.html?id=${ex.id}`),
      text: status === 'in-progress' ? 'Continue →' : 'Start →'
    })
  ));

  return card;
}

/** Compact row for lists — recent activity, favourites, class contents. */
export function exerciseRow(ex, { trailing = null } = {}) {
  const score = scoreFor(ex.id);
  const status = statusFor(ex.id);
  const row = el('a', { class: 'list-item', href: href(`exercise.html?id=${ex.id}`) },
    el('span', { class: `tile-icon ${SUBJECT_MAP[ex.subject]?.accent === 'green' ? 'green' : SUBJECT_MAP[ex.subject]?.accent === 'orange' ? 'orange' : ''}`,
                 'aria-hidden': 'true', text: SUBJECT_MAP[ex.subject]?.emoji ?? '📄' }),
    el('span', { class: 'grow' },
      el('span', { class: 'list-title', text: ex.title, style: 'display:block' }),
      el('span', { class: 'list-sub', text: `${ex.level} · ${TOPIC_MAP[ex.topic]?.name ?? ex.topic}` })
    ),
    trailing ?? el('span', { class: 'small mono muted',
      text: status === 'not-started' ? `${ex.count} q` : `${score.percent}%` })
  );
  return row;
}

export function statTile({ label, value, foot = null, icon = null, tone = '' }) {
  return el('div', { class: 'stat' },
    el('div', { class: 'row-between' },
      el('div', {},
        el('div', { class: 'stat-label', text: label }),
        el('div', { class: 'stat-value', text: value }),
        foot ? el('div', { class: 'stat-foot', text: foot }) : null
      ),
      icon ? el('span', { class: `tile-icon ${tone}`, 'aria-hidden': 'true', text: icon }) : null
    )
  );
}

export function gradeCard(grade) {
  const count = EXERCISES.filter(e => e.grade === grade.id).length;
  return el('a', { class: 'card grade-card', href: href(`library.html?grade=${grade.id}`) },
    el('span', { class: 'grade-emoji', 'aria-hidden': 'true', text: grade.emoji }),
    el('h3', { text: grade.name }),
    el('span', { class: 'grade-range', text: grade.range }),
    el('span', { class: 'small muted', text: grade.tone }),
    el('span', { class: 'grade-count', text: `${count} exercise${count === 1 ? '' : 's'}` })
  );
}

export function subjectCard(subject) {
  const count = EXERCISES.filter(e => e.subject === subject.id).length;
  const tone = subject.accent === 'green' ? 'green' : subject.accent === 'orange' ? 'orange' : '';
  return el('a', { class: 'card', href: href(`subjects.html?subject=${subject.id}`), style: 'display:grid;gap:12px' },
    el('span', { class: `tile-icon lg ${tone}`, 'aria-hidden': 'true', text: subject.emoji }),
    el('h3', { style: 'margin:0', text: subject.name }),
    el('p', { class: 'small', style: 'margin:0', text: subject.blurb }),
    el('div', { class: 'row', style: 'gap:6px;flex-wrap:wrap' },
      subject.topics.slice(0, 3).map(t => el('span', { class: 'badge', text: t.name })),
      subject.topics.length > 3 ? el('span', { class: 'badge', text: `+${subject.topics.length - 3}` }) : null
    ),
    el('span', { class: 'small muted', text: `${count} exercise${count === 1 ? '' : 's'} available` })
  );
}

export function emptyState(icon, title, message, action = null) {
  return el('div', { class: 'empty' },
    el('div', { class: 'empty-ico', 'aria-hidden': 'true', text: icon }),
    el('h3', { text: title }),
    el('p', { text: message }),
    action
  );
}

export function questionTypeBadges(types) {
  return el('div', { class: 'row', style: 'gap:6px;flex-wrap:wrap' },
    types.map(t => el('span', { class: 'badge', text: `${QTYPE_MAP[t]?.emoji ?? ''} ${QTYPE_MAP[t]?.name ?? t}` })));
}
