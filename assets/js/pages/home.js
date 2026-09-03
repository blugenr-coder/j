/* Landing page behaviour: live counts, featured shelf, and the search box
   that understands "fractions grade 6" without any filters being touched. */

import { $, el, compact } from '../core/util.js';
import { mountShell, href } from '../core/shell.js';
import { gradeCard, subjectCard, exerciseCard, statTile } from '../core/cards.js';
import { GRADES, SUBJECTS, QUESTION_TYPES } from '../data/catalog.js';
import { EXERCISES, featuredExercises } from '../data/exercises.js';
import { parseQuery, suggest } from '../core/search.js';

mountShell({ page: 'home', nav: 'public' });

$('#grade-cards').replaceChildren(...GRADES.map(gradeCard));
$('#subject-cards').replaceChildren(...SUBJECTS.map(subjectCard));
$('#featured-cards').replaceChildren(...featuredExercises(6).map(ex => exerciseCard(ex, { showProgress: false })));

const totalQuestions = EXERCISES.reduce((a, e) => a + e.count, 0);
$('#trust-stats').replaceChildren(
  statTile({ label: 'Worksheets in the library', value: EXERCISES.length.toLocaleString(), foot: `Across ${SUBJECTS.length} subjects`, iconName: 'library' }),
  statTile({ label: 'Questions to practise',    value: compact(totalQuestions),   foot: 'With hints and explanations', iconName: 'help', tone: 'green' }),
  statTile({ label: 'Question types',           value: String(QUESTION_TYPES.length), foot: 'From multiple choice to graphs', iconName: 'q-match', tone: 'orange' }),
  statTile({ label: 'Printable worksheets',     value: '100%',                    foot: 'Every one, with an answer key', iconName: 'printer' })
);

/* ------------------------------- search ------------------------------- */
const form = $('#home-search-form');
const input = $('#home-search');
const suggestions = $('#home-suggestions');

const POPULAR = ['fractions grade 6', 'grade 8 algebra', 'photosynthesis', 'multiplication', 'spanish', 'kindergarten counting'];

function showPopular() {
  suggestions.replaceChildren(
    el('span', { class: 'small muted', style: 'align-self:center;margin-right:4px', text: 'Popular:' }),
    ...POPULAR.map(q => el('a', {
      class: 'chip', href: href(`library.html?q=${encodeURIComponent(q)}`), text: q
    }))
  );
}

function showSuggestions(value) {
  const hits = suggest(value, 5);
  if (!hits.length) { showPopular(); return; }
  suggestions.replaceChildren(...hits.map(h => el('a', {
    class: 'chip',
    href: h.kind === 'exercise' ? href(`exercise.html?id=${h.id}`) : href(`library.html?topic=${h.id}`),
    text: `${h.label} · ${h.sub}`
  })));
}

showPopular();
input.addEventListener('input', () => {
  const v = input.value.trim();
  v.length >= 2 ? showSuggestions(v) : showPopular();
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const q = input.value.trim();
  if (!q) { location.href = href('library.html'); return; }
  /* Send the parsed filters through so the library opens pre-filtered, and
     keep the raw query so the user can see what was understood. */
  const parsed = parseQuery(q);
  const params = new URLSearchParams({ q });
  for (const [k, v] of Object.entries(parsed)) if (v && k !== 'text') params.set(k, v);
  location.href = href(`library.html?${params}`);
});
