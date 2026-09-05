/* The exercise player — sections 6, 8 and 9 of the plan.
   Owns navigation between questions, the check/feedback cycle, and writing
   progress to the store. Question rendering lives in core/question.js and
   marking in core/marking.js, so this file stays about flow. */

import { $, $$, el, qs, setQs, donut, toast, timeAgo, pct, clamp } from '../core/util.js';
import { mountShell, href, breadcrumb } from '../core/shell.js';
import { favButton, difficultyBadge, emptyState } from '../core/cards.js';
import { icon } from '../core/icons.js';
import { getExercise } from '../data/exercises.js';
import { STANDARDS, codesFor } from '../data/standards.js';
import { SUBJECT_MAP, TOPIC_MAP, QTYPE_MAP, GRADE_MAP } from '../data/catalog.js';
import { renderQuestion, mathNode } from '../core/question.js';
import { mark, answerText, isAutoMarked } from '../core/marking.js';
import {
  runFor, recordAnswer, clearAnswer, resetRun, completeRun, scoreFor,
  addPracticeTime, toggleFlag, getState, unlockAchievements, currentUser, findAssignment,
  recordSubmission
} from '../core/store.js';

mountShell({ page: 'library', nav: 'app', footer: false });

const ex = getExercise(qs('id'));

/* One worksheet, one indexable URL. The same sheet is reachable as
   ?id=x, ?id=x&mode=online, ?id=x&mode=printable and ?id=x&q=7, and without
   this each of those is a separate page as far as a crawler is concerned —
   four copies of identical content competing with each other. A worksheet
   that is not in the library gets no canonical at all rather than one
   pointing at a page that does not exist. */
const canonical = document.getElementById('canonical-link');
if (canonical) {
  if (ex) canonical.href = `exercise.html?id=${encodeURIComponent(ex.id)}`;
  else canonical.remove();
}

if (!ex) {
  $('#not-found').hidden = false;
  $('#not-found').append(emptyState('help', 'Worksheet not found',
    'That link points at a worksheet that is not in the library.',
    el('a', { class: 'btn btn-primary', href: href('library.html'), text: 'Browse worksheets' })));
} else {
  start();
}

function start() {
  document.title = `${ex.title} — WorksheetHub`;

  /* Section 1: the interface grows up with the student. The band only nudges
     type size and corner radius — the brand and palette never change. */
  document.body.dataset.band = GRADE_MAP[ex.grade]?.band ?? 'mid';

  const run = runFor(ex.id);
  const assignment = findAssignment(qs('code') ?? '');

  /* ------------------------------ mode gate ------------------------------ */
  const answered = Object.keys(run.answers ?? {}).length;
  const skipGate = qs('mode') === 'online' || answered > 0;

  const gate = $('#mode-gate');
  $('#gate-crumb').replaceChildren(breadcrumb([
    { label: 'Worksheets', path: 'library.html' },
    { label: SUBJECT_MAP[ex.subject]?.name ?? ex.subject, path: `subjects.html?subject=${ex.subject}` },
    { label: ex.title }
  ]));
  $('#gate-title').textContent = ex.title;
  $('#gate-meta').textContent = `${ex.level} · ${SUBJECT_MAP[ex.subject]?.name} · ${TOPIC_MAP[ex.topic]?.name}`;
  $('#gate-summary').textContent = ex.summary;
  $('#gate-fav').replaceChildren(favButton(ex.id));
  $('#gate-tags').replaceChildren(
    difficultyBadge(ex.difficulty),
    el('span', { class: 'badge', text: `${ex.count} questions` }),
    el('span', { class: 'badge', text: `About ${ex.minutes} min` }),
    ...ex.types.map(t => el('span', { class: 'badge' }, icon(QTYPE_MAP[t].icon, { size: 13 }), QTYPE_MAP[t].name))
  );
  $('#gate-print').href = href(`print.html?id=${ex.id}`);

  /* Curriculum alignment, at framework and domain level. Labelled indicative
     because it maps the topic to its domain, not the sheet to one lettered
     statement — a claim this library could not actually verify. */
  const std = STANDARDS[ex.topic];
  const align = $('#gate-alignment');
  if (std && align) {
    align.hidden = false;
    align.replaceChildren(
      el('span', { class: 'small muted', text: 'Curriculum alignment (indicative)' }),
      el('div', { class: 'align-row' },
        el('span', { class: 'badge badge-primary', text: std.framework }),
        el('span', { class: 'small', text: std.name }),
        ...codesFor(ex.topic, ex.grade).map(c => el('code', { class: 'std-code', text: c }))));
  }

  if (assignment && assignment.exerciseId === ex.id) {
    const banner = () => el('div', { class: 'banner', style: 'margin-bottom:20px;grid-column:1/-1' },
      icon('send', { size: 18 }),
      el('p', {},
        el('strong', { text: `Set as an assignment (${assignment.code}). ` }),
        assignment.due ? `Due ${assignment.due}. ` : '',
        assignment.note ?? ''));
    $('#gate-summary').before(banner());
    /* Inside the player grid, so it hides and shows with the player itself. */
    $('#player').prepend(banner());
  }
  $('#gate-online').addEventListener('click', () => { setQs({ mode: 'online' }); openPlayer(); });

  /* ------------------------------- player ------------------------------- */
  let index = clamp(Number(qs('q') ?? 0) || indexOfFirstUnanswered(), 0, ex.count - 1);
  let current = null;         // active renderer
  let checked = false;        // has this question been marked this visit?
  let sessionStart = Date.now();

  function indexOfFirstUnanswered() {
    const i = ex.questions.findIndex(q => !(getState().progress[ex.id]?.answers?.[q.id]));
    return i === -1 ? 0 : i;
  }

  function openPlayer() {
    gate.hidden = true;
    /* The number grid is a drawer on phones and an always-open panel above. */
    const narrow = window.matchMedia('(max-width: 1100px)');
    const syncDrawer = () => { $('#qnav-drawer').open = !narrow.matches; };
    syncDrawer();
    narrow.addEventListener('change', syncDrawer);
    $('#player').hidden = false;
    $('#ex-topbar').hidden = false;
    $('#ex-name').textContent = ex.title;
    $('#back-link').href = href('library.html');
    $('#print-link').href = href(`print.html?id=${ex.id}`);
    $('#side-print').href = href(`print.html?id=${ex.id}`);
    wire();
    draw();
  }

  /* --------------------------------- draw --------------------------------- */
  function draw() {
    const q = ex.questions[index];
    const stored = getState().progress[ex.id]?.answers?.[q.id];
    checked = Boolean(stored);
    setQs({ q: index || null, mode: 'online' });

    const card = $('#question-card');
    card.replaceChildren();

    card.append(el('div', { class: 'row-between', style: 'margin-bottom:12px' },
      el('span', { class: 'badge badge-primary', text: `Question ${index + 1}` }),
      el('span', { class: 'badge' }, icon(QTYPE_MAP[q.type].icon, { size: 13 }), QTYPE_MAP[q.type].name)
    ));
    card.append(el('h2', { class: 'question-prompt', text: q.prompt }));

    const body = el('div', { class: 'question-body' });
    current = renderQuestion(q, {
      value: stored?.value,
      disabled: checked,
      onInput: () => { if (!checked) feedbackHost.replaceChildren(); }
    });
    body.append(current.node);

    const feedbackHost = el('div', { id: 'feedback-host' });
    body.append(feedbackHost);
    card.append(body);

    /* ------------------------------ actions ------------------------------ */
    const actions = el('div', { class: 'question-actions' });
    const clearBtn = el('button', {
      class: 'btn btn-ghost', type: 'button', text: 'Clear answer',
      onclick: () => { clearAnswer(ex.id, q.id); draw(); }
    });

    const checkBtn = el('button', {
      class: 'btn btn-primary', type: 'button',
      text: q.type === 'written' ? 'Save answer' : 'Check answer',
      onclick: () => submit()
    });

    const nextBtn = el('button', {
      class: 'btn btn-primary', type: 'button', text: 'Next question ›',
      onclick: () => go(index + 1)
    });

    actions.append(clearBtn, checked ? nextBtn : checkBtn);
    if (checked && index === ex.count - 1) {
      nextBtn.textContent = 'See results';
      nextBtn.onclick = finish;
    }
    card.append(actions);

    if (checked) showFeedback(q, stored, feedbackHost, { restored: true });

    /* Tips panel: the hint plus the type-specific nudge. */
    $('#tips-list').replaceChildren(
      ...(q.hint ? [el('li', { text: q.hint })] : []),
      ...(tipFor(q.type) ? [el('li', { text: tipFor(q.type) })] : [])
    );

    $('#hint-btn').disabled = !q.hint;
    $('#explain-btn').disabled = !q.explanation;
    $('#flag-btn').setAttribute('aria-pressed',
      String((getState().progress[ex.id]?.flags ?? []).includes(q.id)));

    drawNav();
    drawSidebar();
    if (!checked) current.focus?.();
  }

  const tipFor = type => ({
    math: 'Answers are marked flexibly: 0.5, 1/2 and 50% all count as the same value.',
    blank: 'Spelling and capitalisation are forgiven; meaning is not.',
    choice: 'Rule out the options you know are wrong before choosing.',
    multi: 'More than one option is correct — check every one before submitting.',
    match: 'Start with the pairs you are sure of; the rest narrow down.',
    order: 'Place the first and last items first, then fill the middle.',
    graph: 'Read along the x-axis first, then up the y-axis.',
    label: 'Every label is used exactly once, so placing the ones you are sure of narrows the rest.',
    written: 'Write in full sentences, then compare against the sample answer.'
  }[type] ?? '');

  /* -------------------------------- submit -------------------------------- */
  function submit() {
    const q = ex.questions[index];
    const value = current.getValue();
    const empty = value === null || value === undefined || value === '' ||
                  (Array.isArray(value) && !value.length);
    if (empty) { toast('Enter an answer first'); current.focus?.(); return; }

    const result = mark(q, value);
    recordAnswer(ex.id, q.id, { value, correct: result.correct });
    checked = true;

    current.showResult?.(result);
    showFeedback(q, { value, correct: result.correct }, $('#feedback-host'), { restored: false });

    /* Swap the check button for next, in place, so focus order stays sane. */
    const actions = $('#question-card .question-actions');
    actions.replaceChildren(
      el('button', { class: 'btn btn-ghost', type: 'button', text: 'Try again',
        onclick: () => { clearAnswer(ex.id, q.id); draw(); } }),
      el('button', {
        class: 'btn btn-primary', type: 'button',
        text: index === ex.count - 1 ? 'See results' : 'Next question',
        onclick: () => index === ex.count - 1 ? finish() : go(index + 1)
      })
    );

    drawNav();
    drawSidebar();
    trackTime();

    const unlocked = unlockAchievements();
    for (const a of unlocked) toast(`${a.emoji} Achievement unlocked: ${a.name}`);
  }

  /**
   * Section 9: never dump the answer on a wrong attempt. Offer another go,
   * a hint, or — only if asked — the worked explanation.
   */
  function showFeedback(q, stored, host, { restored }) {
    host.replaceChildren();
    if (!isAutoMarked(q)) {
      host.append(el('div', { class: 'feedback info' },
        el('h4', { text: 'Saved' }),
        el('p', { text: 'Written answers are marked by you. Compare yours with the sample below and be honest — it is the comparison that teaches.' }),
        el('div', { class: 'explain' },
          el('strong', { text: 'Sample answer: ' }),
          el('span', { text: q.sample ?? '' }))
      ));
      return;
    }

    if (stored.correct) {
      host.append(el('div', { class: 'feedback ok' },
        el('h4', { text: 'Correct' }),
        el('p', { text: restored ? 'You answered this one correctly.' : 'Nice work — that is right.' }),
        q.explanation ? el('div', { class: 'explain', text: q.explanation }) : null
      ));
      return;
    }

    const panel = el('div', { class: 'feedback no' },
      el('h4', { text: 'Almost!' }),
      el('p', { text: 'That is not quite right. Try again, or take a hint before you look at the working.' })
    );
    const row = el('div', { class: 'row', style: 'gap:8px;margin-top:12px;flex-wrap:wrap' });
    row.append(el('button', { class: 'btn btn-ghost btn-sm', type: 'button', text: 'Try again',
      onclick: () => { clearAnswer(ex.id, q.id); draw(); } }));
    if (q.hint) row.append(el('button', { class: 'btn btn-ghost btn-sm', type: 'button', text: 'Show hint',
      onclick: (e) => { e.target.replaceWith(el('span', { class: 'small', text: q.hint })); } }));
    row.append(el('button', { class: 'btn btn-ghost btn-sm', type: 'button', text: 'See explanation',
      onclick: (e) => {
        e.target.disabled = true;
        panel.append(el('div', { class: 'explain' },
          el('div', {}, el('strong', { text: 'Answer: ' }), el('span', { text: answerText(q) })),
          q.explanation ? el('div', { style: 'margin-top:6px', text: q.explanation }) : null));
      } }));
    panel.append(row);
    host.append(panel);
  }

  /* ------------------------------ navigation ------------------------------ */
  function go(to) {
    if (to < 0 || to >= ex.count) return;
    trackTime();
    index = to;
    draw();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function drawNav() {
    const answers = getState().progress[ex.id]?.answers ?? {};
    const flags = getState().progress[ex.id]?.flags ?? [];
    const nav = $('#qnav');
    nav.replaceChildren(...ex.questions.map((q, i) => {
      const a = answers[q.id];
      const btn = el('button', {
        type: 'button', text: String(i + 1),
        'aria-label': `Question ${i + 1}${a ? (a.correct === null ? ', answered' : a.correct ? ', correct' : ', incorrect') : ', not answered'}`,
        'aria-current': i === index ? 'true' : null,
        onclick: () => go(i)
      });
      if (i === index) btn.classList.add('is-current');
      else if (a?.correct === true) btn.classList.add('is-correct');
      else if (a?.correct === false) btn.classList.add('is-wrong');
      else if (a) btn.classList.add('is-correct');   // written answers count as done
      if (flags.includes(q.id)) btn.classList.add('is-flagged');
      return btn;
    }));

    const s = scoreFor(ex.id);
    const percent = pct(s.answered, s.total);
    $('#ex-count').textContent = `Question ${index + 1} of ${ex.count}`;
    $('#ex-bar').querySelector('span').style.width = `${percent}%`;
    $('#ex-bar').setAttribute('aria-valuenow', String(percent));
    $('#ex-percent').textContent = `${percent}%`;
    $('#qnav-summary-count').textContent = `Question ${index + 1} of ${ex.count}`;
    $('#prev-btn').disabled = index === 0;
    $('#next-btn').textContent = index === ex.count - 1 ? 'Finish' : 'Next ›';
  }

  function drawSidebar() {
    const s = scoreFor(ex.id);
    $('#progress-donut').replaceChildren(donut(pct(s.answered, s.total), { size: 84 }));
    $('#progress-answered').textContent = `${s.answered} of ${s.total}`;
    $('#score-value').textContent = `${s.correct} / ${s.gradable}`;

    const recent = getState().activity.filter(a => a.exerciseId === ex.id).slice(0, 4);
    $('#activity-list').replaceChildren(...(recent.length ? recent.map(a => {
      const qi = ex.questions.findIndex(q => q.id === a.qid);
      return el('div', { class: 'list-item', style: 'padding:6px 0' },
        el('span', { class: `tile-icon ${a.correct === false ? 'red' : 'green'}`,
          style: 'width:26px;height:26px;font-size:13px', 'aria-hidden': 'true',
          }, icon(a.correct === false ? 'close' : 'check', { size: 13 })),
        el('span', { class: 'grow' },
          el('span', { class: 'list-title small', style: 'display:block', text: `Question ${qi + 1}` }),
          el('span', { class: 'list-sub', text: a.correct === false ? 'Incorrect' : a.correct === null ? 'Saved' : 'Correct' })),
        el('span', { class: 'small muted', text: timeAgo(a.ts) }));
    }) : [el('p', { class: 'small muted', style: 'margin:0', text: 'Your answers will appear here.' })]));
  }

  /* -------------------------------- finish -------------------------------- */
  function finish() {
    trackTime();
    completeRun(ex.id);
    const s = scoreFor(ex.id);
    /* If this worksheet was set to a class the student has joined, the result
       belongs to that assignment as well as to their own progress. */
    recordSubmission(ex.id, { percent: s.percent, correct: s.correct, total: s.gradable });
    const unlocked = unlockAchievements();

    $('#player').hidden = true;
    $('#ex-topbar').hidden = true;
    const host = $('#results');
    host.hidden = false;

    const written = ex.questions.filter(q => q.type === 'written').length;
    const verdict = s.percent >= 90 ? 'Outstanding.' : s.percent >= 70 ? 'Solid work.'
      : s.percent >= 50 ? 'A decent start — worth another pass.' : 'This one needs another go.';

    host.replaceChildren(el('div', { class: 'card result-hero', style: 'max-width:760px;margin-inline:auto' },
      el('span', { class: `tile-icon lg ${s.percent >= 70 ? 'green' : 'orange'}`, style: 'margin-inline:auto' },
        icon(s.percent >= 70 ? 'trophy' : 'target', { size: 26 })),
      el('h1', { style: 'margin:8px 0' }, `${ex.title} complete`),
      el('div', { class: 'result-score', text: `${s.percent}%` }),
      el('p', { style: 'margin-top:8px' },
        `${s.correct} of ${s.gradable} auto-marked questions correct. ${verdict}`),
      written ? el('p', { class: 'small muted' },
        `${written} written response${written === 1 ? '' : 's'} were saved for you to mark against the sample answers.`) : null,
      unlocked.length ? el('div', { class: 'banner', style: 'margin:16px 0;justify-content:center' },
        el('p', { text: `Unlocked: ${unlocked.map(a => `${a.emoji} ${a.name}`).join(', ')}` })) : null,
      el('div', { class: 'row', style: 'justify-content:center;gap:12px;flex-wrap:wrap;margin-top:24px' },
        el('button', { class: 'btn btn-secondary', type: 'button', text: 'Try again',
          onclick: () => { resetRun(ex.id); location.href = href(`exercise.html?id=${ex.id}&mode=online`); } }),
        el('a', { class: 'btn btn-ghost', href: href(`print.html?id=${ex.id}`), text: 'Print this worksheet' }),
        el('a', { class: 'btn btn-primary', href: href(currentUser() ? 'dashboard.html' : 'library.html'),
          text: currentUser() ? 'Back to dashboard' : 'Find another exercise' })
      ),
      !currentUser() ? el('p', { class: 'hint', style: 'margin-top:20px' },
        'You are practising as a guest — progress is saved in this browser only. Create an account to keep it.') : null
    ));

    /* Review list: what to look at again. */
    const wrong = ex.questions
      .map((q, i) => ({ q, i, a: getState().progress[ex.id]?.answers?.[q.id] }))
      .filter(r => r.a?.correct === false);
    if (wrong.length) {
      host.append(el('div', { class: 'card', style: 'max-width:760px;margin:24px auto 0' },
        el('h3', { text: 'Worth another look' }),
        el('div', { class: 'list list-divided' }, wrong.map(r =>
          el('button', {
            class: 'list-item', type: 'button',
            style: 'border:0;background:none;cursor:pointer;font:inherit;text-align:left;width:100%',
            onclick: () => {
              host.hidden = true;
              $('#player').hidden = false;
              $('#ex-topbar').hidden = false;
              go(r.i);
            }
          },
            el('span', { class: 'tile-icon red', style: 'width:30px;height:30px' }, icon('close', { size: 15 })),
            el('span', { class: 'grow' },
              el('span', { class: 'list-title', style: 'display:block', text: `Question ${r.i + 1}` }),
              el('span', { class: 'list-sub', text: r.q.prompt.slice(0, 78) })),
            el('span', { class: 'small muted', text: 'Review' })
          ))))
      );
    }
    window.scrollTo({ top: 0 });
  }

  /* ------------------------------ time & keys ------------------------------ */
  function trackTime() {
    const seconds = Math.round((Date.now() - sessionStart) / 1000);
    sessionStart = Date.now();
    /* Ignore idle gaps: nobody spends 40 minutes on one question. */
    addPracticeTime(ex.id, Math.min(seconds, 300));
  }
  window.addEventListener('beforeunload', trackTime);
  document.addEventListener('visibilitychange', () => { if (document.hidden) trackTime(); else sessionStart = Date.now(); });

  function wire() {
    $('#prev-btn').addEventListener('click', () => go(index - 1));
    $('#next-btn').addEventListener('click', () => index === ex.count - 1 ? finish() : go(index + 1));
    $('#hint-btn').addEventListener('click', () => {
      const q = ex.questions[index];
      if (q.hint) toast(q.hint, 6000);
    });
    $('#explain-btn').addEventListener('click', () => {
      const q = ex.questions[index];
      const host = $('#feedback-host');
      host.replaceChildren(el('div', { class: 'feedback info' },
        el('h4', { text: 'Explanation' }),
        el('p', {}, el('strong', { text: 'Answer: ' }), answerText(q)),
        q.explanation ? el('div', { class: 'explain', text: q.explanation }) : null));
    });
    $('#flag-btn').addEventListener('click', (e) => {
      const on = toggleFlag(ex.id, ex.questions[index].id);
      e.currentTarget.setAttribute('aria-pressed', String(on));
      drawNav();
      toast(on ? 'Marked for review' : 'Removed from review');
    });
    $('#restart-btn').addEventListener('click', () => {
      resetRun(ex.id);
      location.href = href(`exercise.html?id=${ex.id}&mode=online`);
    });

    document.addEventListener('keydown', (e) => {
      if (e.target.matches('input, textarea, select')) {
        if (e.key === 'Enter' && !checked && e.target.matches('input')) { e.preventDefault(); submit(); }
        return;
      }
      if (e.key === 'ArrowLeft') go(index - 1);
      if (e.key === 'ArrowRight') go(index + 1);
    });
  }

  /* Opening the player is the last thing to run: everything it touches —
     index, draw(), wire() — must already be initialised. */
  if (skipGate) openPlayer(); else gate.hidden = false;
}
