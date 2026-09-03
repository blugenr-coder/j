/* Saved exercises — section 13. */
import { $, el, plural } from '../core/util.js';
import { mountShell, mountSideNav, href, requireUser } from '../core/shell.js';
import { exerciseCard, emptyState } from '../core/cards.js';
import { getExercise } from '../data/exercises.js';
import { getState, subscribe as onChange } from '../core/store.js';

mountShell({ page: 'favorites', nav: 'app', footer: false });
if (requireUser('favorites.html')) { mountSideNav($('#side-nav-host'), 'favorites'); draw(); }

function draw() {
  const ids = getState().favorites.filter(id => getExercise(id));
  $('#fav-count').textContent = ids.length
    ? `${plural(ids.length, 'exercise')} saved for later.`
    : 'Star a worksheet anywhere in the library and it lands here.';

  $('#fav-grid').replaceChildren(...ids.map(id => exerciseCard(getExercise(id))));
  $('#fav-empty').replaceChildren(...(ids.length ? [] : [emptyState('star', 'Nothing saved yet',
    'Use the star on any worksheet to keep it here — useful for building a revision list.',
    el('a', { class: 'btn btn-primary', href: href('library.html'), text: 'Browse worksheets' }))]));
}

/* Un-starring a card on this page should drop it from the list straight away. */
let shownCount = -1;
onChange(() => {
  const count = getState().favorites.filter(id => getExercise(id)).length;
  if (count !== shownCount) { shownCount = count; draw(); }
});
