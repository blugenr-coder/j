/* Printable worksheet generation — section 7.
   The same authored exercise renders to paper: a worksheet with room to work
   and, on its own page, a separate answer key so a student cannot glance at
   the answers while working. */

import { $, $$, el, qs, esc, shuffle, hashCode } from '../core/util.js';
import { mountShell, href } from '../core/shell.js';
import { emptyState } from '../core/cards.js';
import { getExercise } from '../data/exercises.js';
import { SUBJECT_MAP, TOPIC_MAP, DIFF_MAP, GRADE_MAP } from '../data/catalog.js';
import { answerText } from '../core/marking.js';
import { STANDARDS } from '../data/standards.js';

mountShell({ page: 'library', nav: 'app', footer: false });

const ex = getExercise(qs('id'));

if (!ex) {
  $('.paper-toolbar').hidden = true;
  $('#not-found').hidden = false;
  $('#not-found').append(emptyState('printer', 'Nothing to print',
    'That link points at a worksheet that is not in the library.',
    el('a', { class: 'btn btn-primary', href: href('library.html'), text: 'Browse worksheets' })));
} else {
  document.title = `${ex.title} — printable worksheet`;
  document.body.dataset.band = GRADE_MAP[ex.grade]?.band ?? 'mid';
  $('#doc-title').textContent = ex.title;
  $('#doc-meta').textContent =
    `${ex.level} · ${SUBJECT_MAP[ex.subject]?.name} · ${ex.count} questions · ` +
    `${ex.pages ?? 1} page${(ex.pages ?? 1) === 1 ? '' : 's'}`;
  $('#back-link').href = href(`exercise.html?id=${ex.id}`);
  $('#online-link').href = href(`exercise.html?id=${ex.id}&mode=online`);
  $('#print-btn').addEventListener('click', () => window.print());
  for (const id of ['#opt-key', '#opt-work', '#opt-hints', '#opt-copies']) {
    $(id).addEventListener('change', render);
  }
  render();
}

function render() {
  const withKey = $('#opt-key').checked;
  const withWork = $('#opt-work').checked;
  const withHints = $('#opt-hints').checked;
  const copies = Number($('#opt-copies').value);

  const sheets = [];
  for (let c = 0; c < copies; c++) sheets.push(...worksheet({ withWork, withHints, copy: c + 1, copies }));
  if (withKey) sheets.push(answerKey());
  $('#sheets').replaceChildren(...sheets);
}

/* --------------------------------- header --------------------------------- */
function sheetHead({ key = false, page = 1, pages = 1 } = {}) {
  const head = el('header', { class: 'sheet-head' },
    el('div', { class: 'sheet-brand' },
      el('span', { class: 'sheet-logo', text: 'WorksheetHub' }),
      el('span', { class: 'sheet-meta' },
        el('div', { text: `${DIFF_MAP[ex.difficulty]?.name ?? ex.difficulty} · ${ex.count} questions` }),
        el('div', { text: pages > 1 ? `Page ${page} of ${pages}` : `About ${ex.minutes} minutes` }))
    ),
    el('h2', { text: ex.title }),
    el('p', { class: 'sheet-sub', text: `${ex.level} ${SUBJECT_MAP[ex.subject]?.name} · ${TOPIC_MAP[ex.topic]?.name}` }),
    /* Teachers file worksheets against a framework, so the printed sheet
       carries the alignment too. Domain level, and labelled as indicative. */
    STANDARDS[ex.topic] && page === 1
      ? el('p', { class: 'sheet-std', text:
          `${STANDARDS[ex.topic].framework} ${STANDARDS[ex.topic].codes.join(', ')} · indicative alignment` })
      : null
  );

  if (key) {
    head.append(el('p', { style: 'margin-top:6mm' }, el('span', { class: 'key-badge', text: 'Answer key' })));
  } else if (page === 1) {
    head.append(el('div', { class: 'sheet-fields' },
      el('span', { class: 'fld' }, 'Name:', el('span', { class: 'line' })),
      el('span', { class: 'fld' }, 'Date:', el('span', { class: 'line' })),
      el('span', { class: 'fld', style: 'flex:0 0 32mm' }, 'Score:', el('span', { class: 'line' }))
    ));
  }
  return head;
}

/* ------------------------------- worksheet ------------------------------- */
/**
 * The worksheet, split across the number of pages it declares. Each page is
 * its own sheet with its own header, so a booklet handed out in class still
 * makes sense if the staple comes out.
 */
function worksheet({ withWork, withHints, copy, copies }) {
  const pages = Math.max(1, ex.pages ?? 1);
  const perPage = Math.ceil(ex.questions.length / pages);
  const out = [];

  for (let page = 0; page < pages; page++) {
    const slice = ex.questions.slice(page * perPage, (page + 1) * perPage);
    if (!slice.length) continue;
    const sheet = el('section', { class: 'sheet' });
    sheet.append(sheetHead({ page: page + 1, pages }));

    if (page === 0) {
      sheet.append(el('div', { class: 'sheet-instructions' },
        el('strong', { text: 'Instructions: ' }),
        'Answer every question, showing your working where there is space. ' +
        'Write your final answer on the line provided.' +
        (pages > 1 ? ` This worksheet runs to ${pages} pages.` : '')
      ));
    }

    slice.forEach((q, i) => sheet.append(printQuestion(q, page * perPage + i, { withWork, withHints })));

    sheet.append(el('footer', { class: 'sheet-foot' },
      el('span', { text: `worksheethub · ${ex.title}` }),
      el('span', { text: pages > 1 ? `Page ${page + 1} of ${pages}` :
        copies > 1 ? `Copy ${copy} of ${copies}` : 'Answer key available separately' })
    ));
    out.push(sheet);
  }
  return out;
}

function printQuestion(q, i, { withWork, withHints }) {
  const wrap = el('div', { class: 'q-print' });
  wrap.append(el('div', { class: 'q-head' },
    el('span', { class: 'q-num', text: `${i + 1}.` }),
    el('span', { class: 'q-text', text: q.prompt })
  ));

  if (q.math) wrap.append(el('div', { class: 'q-math', text: q.math }));

  switch (q.type) {
    case 'choice':
    case 'multi': {
      const opts = el('div', { class: `q-options ${q.type === 'multi' ? 'multi' : ''}` });
      q.options.forEach((o, oi) => opts.append(el('span', { class: 'opt-print' },
        el('span', { class: 'box' }),
        el('span', { text: `${'ABCDEFGH'[oi]}.  ${o}` }))));
      wrap.append(opts);
      if (q.type === 'multi') wrap.append(el('div', { class: 'q-answer' }, 'Tick every correct answer.'));
      break;
    }
    case 'match': {
      const grid = el('div', { class: 'q-match' });
      const rights = q.pairs.map(p => p.right).slice().sort();
      q.pairs.forEach((p, pi) => grid.append(
        el('span', {}, `${pi + 1}. ${p.left}  ______`),
        el('span', {}, `${'ABCDEFGH'[pi]}. ${rights[pi]}`)
      ));
      wrap.append(grid);
      break;
    }
    case 'order': {
      const list = el('div', { class: 'q-order' });
      /* Scramble with the same seed the online version uses, so a class
         working half on paper and half online sees the same arrangement. */
      const scrambled = shuffle(q.items, hashCode((q.id ?? q.prompt) + 'o'));
      scrambled.forEach(item => list.append(el('span', { class: 'oline' },
        el('span', { class: 'obox' }), el('span', { text: item }))));
      wrap.append(el('div', { class: 'q-answer' }, 'Number these 1 to ' + q.items.length + ' in the correct order.'));
      wrap.append(list);
      break;
    }
    case 'graph': {
      wrap.append(el('div', { class: 'q-work', style: 'height:60mm', html: gridSvg(q) }));
      wrap.append(el('div', { class: 'q-answer' }, 'Point: ( ______ , ______ )'));
      break;
    }
    case 'written': {
      const lines = el('div', { class: 'q-lines' });
      for (let n = 0; n < 4; n++) lines.append(el('div', { class: 'wline' }));
      wrap.append(lines);
      break;
    }
    default: {
      if (withWork && (q.type === 'math')) wrap.append(el('div', { class: 'q-work' }));
      wrap.append(el('div', { class: 'q-answer' }, 'Answer:', el('span', { class: 'line' })));
    }
  }

  if (q.type === 'blank' && !wrap.querySelector('.q-answer')) {
    wrap.append(el('div', { class: 'q-answer' }, 'Answer:', el('span', { class: 'line' })));
  }
  if (withHints && q.hint) {
    wrap.append(el('div', { class: 'q-answer', style: 'font-style:italic' }, `Hint: ${q.hint}`));
  }
  return wrap;
}

/** A printed coordinate grid for graph questions. */
function gridSvg(q) {
  const { min = -5, max = 5 } = q.grid ?? {};
  const size = 150, pad = 10, span = max - min, step = (size - pad * 2) / span;
  const lines = [];
  for (let v = min; v <= max; v++) {
    const axis = v === 0;
    const x = pad + (v - min) * step, y = size - pad - (v - min) * step;
    lines.push(`<line x1="${x}" y1="${pad}" x2="${x}" y2="${size - pad}" stroke="${axis ? '#334155' : '#CBD5E1'}" stroke-width="${axis ? 0.9 : 0.4}"/>`);
    lines.push(`<line x1="${pad}" y1="${y}" x2="${size - pad}" y2="${y}" stroke="${axis ? '#334155' : '#CBD5E1'}" stroke-width="${axis ? 0.9 : 0.4}"/>`);
  }
  return `<svg viewBox="0 0 ${size} ${size}" width="55mm" height="55mm" role="img" aria-label="Blank coordinate grid">${lines.join('')}</svg>`;
}

/* ------------------------------- answer key ------------------------------- */
function answerKey() {
  const sheet = el('section', { class: 'sheet key-sheet' });
  sheet.append(sheetHead({ key: true }));
  sheet.append(el('div', { class: 'sheet-instructions', style: 'border-left-color:#10B981' },
    el('strong', { text: 'For the teacher or marker. ' }),
    'Keep this page separate from the worksheet.'
  ));

  ex.questions.forEach((q, i) => {
    sheet.append(el('div', { class: 'key-item' },
      el('span', { class: 'key-num', text: `${i + 1}.` }),
      el('span', {},
        el('div', { class: 'key-ans', text: q.type === 'written' ? 'Open response — see the sample below.' : answerText(q) }),
        q.type === 'written' && q.sample
          ? el('div', { class: 'key-exp' }, el('em', { text: 'Sample: ' }), q.sample)
          : null,
        q.explanation ? el('div', { class: 'key-exp', text: q.explanation }) : null
      )
    ));
  });

  const gradable = ex.questions.filter(q => q.type !== 'written').length;
  sheet.append(el('footer', { class: 'sheet-foot' },
    el('span', { text: `worksheethub · ${ex.title} — answer key` }),
    el('span', { text: `${gradable} of ${ex.count} questions are auto-markable` })
  ));
  return sheet;
}
