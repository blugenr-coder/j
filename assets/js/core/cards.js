/* Shared renderers: worksheet cards, stat tiles, subject and grade tiles.
   The worksheet card shows two real questions from the sheet rather than
   describing it — a worksheet is its questions, so the card should say so. */

import { el, esc, pct } from './util.js';
import { href } from './shell.js';
import { icon, iconHtml } from './icons.js';
import { DIFF_MAP, SUBJECT_MAP, TOPIC_MAP, QTYPE_MAP, GRADE_MAP } from '../data/catalog.js';
import { EXERCISES, previewQuestions } from '../data/exercises.js';
import { isFavorite, toggleFavorite, scoreFor, statusFor } from './store.js';

const STATUS = {
  'completed':   { text: 'Completed',   cls: 'badge-success' },
  'in-progress': { text: 'In progress', cls: 'badge-warn' },
  'not-started': { text: 'Not started', cls: '' }
};

export function difficultyBadge(id) {
  const d = DIFF_MAP[id];
  return el('span', { class: `badge ${d?.badge ?? ''}` },
    icon(d?.icon ?? 'level-1', { size: 13 }), d?.name ?? id);
}

export function favButton(exerciseId) {
  const btn = el('button', {
    class: 'star-btn', type: 'button',
    'aria-pressed': String(isFavorite(exerciseId)),
    'aria-label': 'Save to favourites', title: 'Save to favourites',
    html: iconHtml('star', { size: 18 }),
    onclick: (e) => {
      e.preventDefault(); e.stopPropagation();
      btn.setAttribute('aria-pressed', String(toggleFavorite(exerciseId)));
    }
  });
  return btn;
}

export const subjectIcon = (subjectId, opts = {}) =>
  icon(SUBJECT_MAP[subjectId]?.icon ?? 'document', opts);

export const subjectTone = subjectId =>
  ({ green: 'green', orange: 'orange' }[SUBJECT_MAP[subjectId]?.accent] ?? '');

/* ---------------------------- question preview ---------------------------- */
/** One question rendered small, as it would actually appear on the sheet. */
function previewLine(q, n) {
  const line = el('li', { class: 'preview-line' });
  line.append(el('span', { class: 'preview-num', text: `${n}.` }));

  const body = el('span', { class: 'preview-body' });
  body.append(el('span', { class: 'preview-prompt', text: q.prompt }));

  if (q.math) {
    body.append(el('span', { class: 'preview-math', text: q.math.replace(/\s*=\s*\?$/, '') }));
  } else if (q.type === 'choice' || q.type === 'multi') {
    body.append(el('span', { class: 'preview-opts' },
      q.options.slice(0, 3).map((o, i) => el('span', { class: 'preview-opt' },
        el('span', { class: 'preview-key', text: 'ABCD'[i] }), o))));
  } else if (q.type === 'match') {
    body.append(el('span', { class: 'preview-opts' },
      q.pairs.slice(0, 2).map(p => el('span', { class: 'preview-opt', text: `${p.left} — ?` }))));
  } else if (q.type === 'order') {
    body.append(el('span', { class: 'preview-opts' },
      q.items.slice(0, 3).map(i => el('span', { class: 'preview-opt' },
        el('span', { class: 'preview-key', text: '—' }), i))));
  } else if (q.type === 'written') {
    body.append(el('span', { class: 'preview-rule' }));
  } else {
    body.append(el('span', { class: 'preview-answer', text: 'Answer:' }),
                el('span', { class: 'preview-rule' }));
  }

  line.append(body);
  return line;
}

export function questionPreview(exerciseId, n = 2) {
  const qs = previewQuestions(exerciseId, n);
  if (!qs.length) return null;
  return el('ol', { class: 'preview-sheet', 'aria-label': 'Sample questions from this worksheet' },
    qs.map((q, i) => previewLine(q, i + 1)));
}

/* ------------------------------ worksheet card ------------------------------ */
export function exerciseCard(ex, { showProgress = true, preview = true } = {}) {
  const status = statusFor(ex.id);
  const score = scoreFor(ex.id);
  const label = STATUS[status];
  const url = href(`exercise.html?id=${ex.id}`);

  const card = el('article', { class: 'card ex-card' });

  card.append(el('div', { class: 'ex-head' },
    el('div', { class: 'ex-head-main' },
      el('div', { class: 'ex-meta' },
        subjectIcon(ex.subject, { size: 14 }),
        el('span', { text: `${ex.level} · ${SUBJECT_MAP[ex.subject]?.name ?? ex.subject}` })),
      el('h3', {}, el('a', { class: 'ex-title-link', href: url, text: ex.title }))),
    favButton(ex.id)
  ));

  card.append(el('p', { class: 'ex-summary', text: ex.summary }));

  if (preview) {
    const p = questionPreview(ex.id, 2);
    if (p) card.append(el('div', { class: 'ex-preview' }, p,
      el('span', { class: 'ex-preview-more', text: `+ ${Math.max(0, ex.count - 2)} more questions` })));
  }

  card.append(el('div', { class: 'ex-tags' },
    difficultyBadge(ex.difficulty),
    el('span', { class: 'badge' }, icon('library', { size: 13 }), `${ex.count} questions`),
    el('span', { class: 'badge' }, icon('clock', { size: 13 }), `${ex.minutes} min`),
    ex.pages > 1
      ? el('span', { class: 'badge badge-primary' }, icon('layers', { size: 13 }), `${ex.pages} pages`)
      : null
  ));

  if (showProgress && status !== 'not-started') {
    const done = pct(score.answered, score.total);
    card.append(el('div', { class: 'ex-progress' },
      el('div', { class: 'row-between small muted', style: 'margin-bottom:6px' },
        el('span', { text: `${score.answered} of ${score.total} answered` }),
        el('span', { class: 'mono', text: `${done}%` })),
      el('div', { class: 'bar' }, el('span', { style: `width:${done}%` }))
    ));
  }

  card.append(el('div', { class: 'ex-foot' },
    el('span', { class: `badge ${label.cls}`, text: label.text }),
    el('span', { class: 'row', style: 'gap:6px;flex-wrap:nowrap' },
      el('a', { class: 'btn btn-ghost btn-sm', href: href(`print.html?id=${ex.id}`),
        title: 'Print this worksheet', 'aria-label': `Print ${ex.title}`, html: iconHtml('printer', { size: 15 }) }),
      el('a', { class: 'btn btn-primary btn-sm', href: url },
        status === 'in-progress' ? 'Continue' : 'Start', icon('arrow-right', { size: 15 })))
  ));

  return card;
}

/** Compact row for lists — recent activity, favourites, class contents. */
export function exerciseRow(ex, { trailing = null } = {}) {
  const score = scoreFor(ex.id);
  const status = statusFor(ex.id);
  return el('a', { class: 'list-item', href: href(`exercise.html?id=${ex.id}`) },
    el('span', { class: `tile-icon ${subjectTone(ex.subject)}` }, subjectIcon(ex.subject, { size: 18 })),
    el('span', { class: 'grow' },
      el('span', { class: 'list-title', text: ex.title, style: 'display:block' }),
      el('span', { class: 'list-sub', text: `${ex.level} · ${TOPIC_MAP[ex.topic]?.name ?? ex.topic}` })),
    trailing ?? el('span', { class: 'small mono muted',
      text: status === 'not-started' ? `${ex.count} q` : `${score.percent}%` })
  );
}

export function statTile({ label, value, foot = null, iconName = null, tone = '' }) {
  return el('div', { class: 'stat' },
    el('div', { class: 'row-between', style: 'flex-wrap:nowrap;align-items:flex-start' },
      el('div', {},
        el('div', { class: 'stat-label', text: label }),
        el('div', { class: 'stat-value', text: value }),
        foot ? el('div', { class: 'stat-foot', text: foot }) : null
      ),
      iconName ? el('span', { class: `tile-icon ${tone}` }, icon(iconName, { size: 18 })) : null
    )
  );
}

export function gradeCard(grade) {
  const count = EXERCISES.filter(e => e.grade === grade.id).length;
  return el('a', { class: 'card grade-card', href: href(`library.html?grade=${grade.id}`) },
    el('span', { class: 'tile-icon lg' }, icon(grade.icon, { size: 24 })),
    el('h3', { text: grade.name }),
    el('span', { class: 'grade-range', text: grade.range }),
    el('span', { class: 'small muted', text: grade.tone }),
    el('span', { class: 'grade-count' }, `${count.toLocaleString()} worksheets`, icon('arrow-right', { size: 14 }))
  );
}

/**
 * Subject entry for the index. Deliberately typographic: no icon, no colour
 * block. A subject is a body of work, and a list of its topics says more about
 * it than any pictogram could.
 */
export function subjectCard(subject) {
  const count = EXERCISES.filter(e => e.subject === subject.id).length;
  const topics = subject.topics.map(t => t.name);
  return el('a', { class: 'subject-row-card', href: href(`subjects.html?subject=${subject.id}`) },
    el('div', { class: 'subject-row-head' },
      el('h3', { class: 'subject-row-title', text: subject.name }),
      el('span', { class: 'subject-row-count mono', text: count.toLocaleString() })),
    el('p', { class: 'subject-row-blurb', text: subject.blurb }),
    el('p', { class: 'subject-row-topics', text: topics.join(' · ') })
  );
}

export function emptyState(iconName, title, message, action = null) {
  return el('div', { class: 'empty' },
    el('span', { class: 'empty-ico' }, icon(iconName, { size: 34 })),
    el('h3', { text: title }),
    el('p', { text: message }),
    action
  );
}

export function questionTypeBadges(types) {
  return el('div', { class: 'row', style: 'gap:6px;flex-wrap:wrap' },
    types.map(t => el('span', { class: 'badge' },
      icon(QTYPE_MAP[t]?.icon ?? 'document', { size: 13 }), QTYPE_MAP[t]?.name ?? t)));
}
