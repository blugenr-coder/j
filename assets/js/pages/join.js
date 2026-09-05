/* Student: join a class by code, or by a link that carries the class details.
   A code resolves only against classes created on this device; a link works
   anywhere, because the class travels inside it. */

import { $, el, qs, toast, timeAgo, plural } from '../core/util.js';
import { mountShell, href } from '../core/shell.js';
import { emptyState } from '../core/cards.js';
import { icon } from '../core/icons.js';
import { getMeta } from '../data/exercises.js';
import {
  findClassByCode, decodeClass, joinClass, leaveClass, enrollments,
  isEnrolled, assignedToMe, currentUser
} from '../core/store.js';
import { lookupClass } from '../core/api.js';
import { startSync } from '../core/sync.js';

mountShell({ page: 'join', nav: 'public' });

const input = $('#code');
const nameInput = $('#student-name');
if (currentUser()) nameInput.value = currentUser().name;

input.addEventListener('input', () => {
  const raw = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
  input.value = raw.length > 3 ? `${raw.slice(0, 3)}-${raw.slice(3)}` : raw;
  $('#join-error').hidden = true;
});

/* ------------------------------ invite link ------------------------------ */
const invited = qs('c') ? decodeClass(qs('c')) : null;
if (invited) {
  input.value = invited.code;
  const box = $('#invite');
  box.hidden = false;
  box.replaceChildren(el('div', { class: 'banner' },
    icon('send', { size: 18 }),
    el('p', {},
      el('strong', { text: `You have been invited to ${invited.name}. ` }),
      invited.level ? `${invited.level}. ` : '',
      'Enter your name above and join.')));
}

/* --------------------------------- join --------------------------------- */
$('#join-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const code = input.value.trim();
  const studentName = nameInput.value.trim() || currentUser()?.name;

  if (!studentName) { nameInput.focus(); return fail('Enter the name your teacher will recognise.'); }
  if (isEnrolled(code)) return fail('You have already joined that class.');

  /* Three places a code can resolve, in order of how much they know.
     The server is first: it is the only one that knows about a class made on
     somebody else's laptop, which is the ordinary case. Then this device's own
     classes, then the invite link, which carries the class inside the URL and
     is what made joining possible at all before there was a backend. */
  const remote = await lookupClass(code);
  const local = findClassByCode(code);
  const cls = remote.ok && remote.data?.class
    ? remote.data.class
    : local
      ? { name: local.name, level: local.level, code: local.code, subject: local.subject }
      : (invited && invited.code.replace('-', '') === code.replace('-', '') ? invited : null);

  if (!cls) {
    return fail(remote.error === 'offline'
      ? 'No class found with that code. Without a server, codes only work on the device the class was created on — otherwise ask your teacher for the join link.'
      : 'No class found with that code. Check it with your teacher.');
  }

  await joinClass({ ...cls, studentName });
  toast(`Joined ${cls.name}`);
  input.value = ''; $('#invite').hidden = true;
  drawMine();
});

function fail(message) {
  const err = $('#join-error');
  err.hidden = false;
  err.textContent = message;
}

/* ------------------------------ my classes ------------------------------ */
function drawMine() {
  const mine = enrollments();
  const work = assignedToMe();

  if (!mine.length) {
    $('#my-classes').replaceChildren(emptyState('users', 'You have not joined a class yet',
      'Once you join, everything your teacher sets shows up here and on your dashboard. ' +
      'Teaching rather than studying? Create a class and share its join code.',
      el('a', { class: 'btn btn-secondary', href: href('teacher/classes.html'), text: 'Create a class' })));
    return;
  }

  $('#my-classes').replaceChildren(
    el('h2', { style: 'font-size:var(--step-2)', text: 'Your classes' }),
    ...mine.map(e => {
      const set = work.filter(a => a.class?.code === e.code);
      return el('div', { class: 'card', style: 'margin-bottom:16px' },
        el('div', { class: 'row-between', style: 'align-items:flex-start' },
          el('div', {},
            el('h3', { style: 'margin:0 0 2px;font-size:var(--step-1)', text: e.className }),
            el('div', { class: 'small muted',
              text: `${e.level ?? ''}${e.level ? ' · ' : ''}joined as ${e.studentName} ${timeAgo(e.joinedAt)}` })),
          el('button', { class: 'btn btn-ghost btn-sm', type: 'button', text: 'Leave',
            onclick: async () => {
              if (!confirm(`Leave ${e.className}?`)) return;
              await leaveClass(e.code); drawMine(); toast('Left the class');
            } })),
        set.length
          ? el('div', { class: 'list list-divided', style: 'margin-top:12px' },
              set.flatMap(a => (a.worksheetIds ?? [a.exerciseId]).filter(Boolean).map(getMeta).filter(Boolean)
                .map(w => el('a', { class: 'list-item', href: href(`exercise.html?id=${w.id}&mode=online&code=${a.code}`) },
                  el('span', { class: 'tile-icon', style: 'width:30px;height:30px' }, icon('library', { size: 15 })),
                  el('span', { class: 'grow' },
                    el('span', { class: 'list-title', style: 'display:block', text: w.title }),
                    el('span', { class: 'list-sub', text: `${a.title}${a.due ? ` · due ${a.due}` : ''}` })),
                  el('span', { class: 'small muted', text: `${w.count} q` })))))
          : el('p', { class: 'small muted', style: 'margin:12px 0 0', text: 'No work set yet.' }));
    }));
}
drawMine();
/* And again once the server has said which classes this account is in — a
   class joined on another device belongs on this list too. */
startSync().then(drawMine);
