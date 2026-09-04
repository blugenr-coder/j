/* Subject selection — section 4. One page handles both the index and the
   per-subject view so the URL stays shareable: subjects.html?subject=math */
import { $, el, qs, fill } from '../core/util.js';
import { mountShell, href, breadcrumb } from '../core/shell.js';
import { subjectCard, exerciseCard, emptyState } from '../core/cards.js';
import { icon } from '../core/icons.js';
import { SUBJECTS, SUBJECT_MAP } from '../data/catalog.js';
import { countByTopic, takeWhere } from '../data/exercises.js';

mountShell({ page: 'subjects', nav: 'public' });

const id = qs('subject');
const subject = SUBJECT_MAP[id];

if (!subject) {
  $('#subject-cards').replaceChildren(...SUBJECTS.map(subjectCard));
} else {
  document.title = `${subject.name} — WorksheetHub`;
  $('#subject-index').classList.add('hidden');
  $('#subject-detail').classList.remove('hidden');

  $('#subject-crumb').replaceChildren(breadcrumb([
    { label: 'Home', path: 'index.html' },
    { label: 'Subjects', path: 'subjects.html' },
    { label: subject.name }
  ]));

  $('#subject-title').textContent = subject.name;
  $('#subject-blurb').textContent = subject.blurb;
  $('#subject-all-link').href = href(`library.html?subject=${subject.id}`);

  $('#topic-cards').replaceChildren(...subject.topics.map(t => {
    const n = countByTopic(t.id);
    return el('a', {
      class: 'card card-pad-sm',
      href: href(`library.html?subject=${subject.id}&topic=${t.id}`),
      style: 'display:grid;gap:4px'
    },
      el('strong', { style: 'font-family:var(--font-head)', text: t.name }),
      el('span', { class: 'small muted', text: n ? `${n} worksheet${n === 1 ? '' : 's'}` : 'Coming soon' })
    );
  }));

  const shelf = takeWhere(e => e.subject === subject.id, 12);
  fill($('#subject-exercises'),
    shelf.length
      ? shelf.map(ex => exerciseCard(ex, { showProgress: false }))
      : emptyState('compass', 'Nothing here yet',
          'This subject is in the taxonomy but has no worksheets written for it yet.',
          el('a', { class: 'btn btn-secondary', href: href('library.html'), text: 'Browse the whole library' }))
  );
}
