/* Exercise builder — section 17.
   Produces the same shape as the authored content, so a teacher's exercise
   plays and prints through exactly the same code paths. */

import { $, el, toast, plural } from '../core/util.js';
import { mountShell, mountSideNav, href } from '../core/shell.js';
import { emptyState } from '../core/cards.js';
import { GRADES, SUBJECTS, SUBJECT_MAP, DIFFICULTIES, TOPIC_MAP } from '../data/catalog.js';
import { saveCustomExercise, customExercises, deleteCustomExercise } from '../core/store.js';

mountShell({ page: 'teachers', nav: 'app', mode: 'teacher', footer: false });
mountSideNav($('#side-nav-host'), 't-builder');

/* Types the builder supports. Matching, ordering and graphs are authored in
   content files rather than here — the editing UI they need is a separate
   piece of work, and pretending otherwise would produce broken exercises. */
const BUILDABLE = [
  { id: 'math',   label: '🔢 Math input' },
  { id: 'blank',  label: '✏️ Fill in the blank' },
  { id: 'choice', label: '🔘 Multiple choice' },
  { id: 'multi',  label: '☑️ Multiple answers' },
  { id: 'written',label: '✍️ Written response' }
];

let questions = [];

/* -------------------------------- selects -------------------------------- */
const opt = (v, l) => el('option', { value: v, text: l });
$('#e-level').replaceChildren(...GRADES.flatMap(g => g.levels.map(l => opt(l, `${l} (${g.name})`))));
$('#e-subject').replaceChildren(...SUBJECTS.map(s => opt(s.id, s.name)));
$('#e-difficulty').replaceChildren(...DIFFICULTIES.map(d => opt(d.id, d.name)));
$('#e-level').value = 'Grade 8';
$('#e-subject').value = 'math';

function refreshTopics() {
  const s = SUBJECT_MAP[$('#e-subject').value];
  $('#e-topic').replaceChildren(...s.topics.map(t => opt(t.id, t.name)));
}
refreshTopics();
$('#e-subject').addEventListener('change', refreshTopics);

/* ------------------------------ question rows ------------------------------ */
$('#add-buttons').replaceChildren(...BUILDABLE.map(t =>
  el('button', { class: 'chip', type: 'button', text: `+ ${t.label}`, onclick: () => addQuestion(t.id) })));

function addQuestion(type) {
  questions.push({
    id: `q${questions.length + 1}`, type,
    prompt: '', math: '', answer: type === 'multi' ? [] : '',
    options: (type === 'choice' || type === 'multi') ? ['', '', '', ''] : undefined,
    hint: '', explanation: '', sample: ''
  });
  drawQuestions();
}

function drawQuestions() {
  $('#q-count').textContent = questions.length ? plural(questions.length, 'question') : 'No questions yet';

  if (!questions.length) {
    $('#question-editors').replaceChildren(emptyState('➕', 'Start with one question',
      'Choose a question type below. You can mix types in a single exercise.'));
    return;
  }

  $('#question-editors').replaceChildren(...questions.map((q, i) => {
    const card = el('div', { class: 'card' });
    const meta = BUILDABLE.find(b => b.id === q.type);

    card.append(el('div', { class: 'row-between', style: 'margin-bottom:12px' },
      el('div', { class: 'row', style: 'gap:8px' },
        el('span', { class: 'badge badge-primary', text: `Question ${i + 1}` }),
        el('span', { class: 'badge', text: meta?.label ?? q.type })),
      el('div', { class: 'row', style: 'gap:4px' },
        el('button', { class: 'icon-btn', type: 'button', text: '↑', 'aria-label': 'Move up',
          disabled: i === 0 || null, onclick: () => { swap(i, i - 1); } }),
        el('button', { class: 'icon-btn', type: 'button', text: '↓', 'aria-label': 'Move down',
          disabled: i === questions.length - 1 || null, onclick: () => { swap(i, i + 1); } }),
        el('button', { class: 'icon-btn', type: 'button', text: '✕', 'aria-label': 'Delete question',
          onclick: () => { questions.splice(i, 1); renumber(); drawQuestions(); } }))
    ));

    card.append(field('Question', q.prompt, v => q.prompt = v, 'What is being asked?'));

    if (q.type === 'math') {
      card.append(field('Equation to display (optional)', q.math, v => q.math = v, 'e.g. 2x + 5 = 15'));
    }

    if (q.type === 'choice' || q.type === 'multi') {
      const wrap = el('div', { class: 'field' }, el('span', { class: 'label', text: 'Options' }));
      q.options.forEach((o, oi) => {
        const isAnswer = q.type === 'multi' ? q.answer.includes(oi) : q.answer === oi;
        wrap.append(el('div', { class: 'row', style: 'gap:8px;margin-bottom:6px' },
          el('button', {
            class: `chip ${isAnswer ? 'is-active' : ''}`, type: 'button',
            style: 'flex:none', 'aria-label': `Mark option ${oi + 1} as correct`,
            text: isAnswer ? '✓ correct' : 'mark correct',
            onclick: () => {
              if (q.type === 'multi') {
                const at = q.answer.indexOf(oi);
                at >= 0 ? q.answer.splice(at, 1) : q.answer.push(oi);
              } else q.answer = oi;
              drawQuestions();
            }
          }),
          el('input', {
            class: 'input', type: 'text', value: o, placeholder: `Option ${'ABCD'[oi] ?? oi + 1}`,
            oninput: e => q.options[oi] = e.target.value
          })));
      });
      wrap.append(el('button', { class: 'btn btn-ghost btn-sm', type: 'button', text: '+ Add option',
        onclick: () => { q.options.push(''); drawQuestions(); } }));
      card.append(wrap);
    } else if (q.type === 'written') {
      card.append(field('Sample answer (shown after they respond)', q.sample, v => q.sample = v, '', true));
    } else {
      card.append(field('Correct answer', q.answer, v => q.answer = v, 'Accepted flexibly: 0.5 = 1/2 = 50%'));
      card.append(field('Also accept (comma separated)', (q.accept ?? []).join(', '),
        v => q.accept = v.split(',').map(x => x.trim()).filter(Boolean), 'x=5, five'));
    }

    card.append(field('Hint (optional)', q.hint, v => q.hint = v, 'Unsticks without giving it away'));
    card.append(field('Explanation (optional)', q.explanation, v => q.explanation = v,
      'Shown on request and printed on the answer key', true));
    return card;
  }));
}

function field(label, value, onChange, placeholder = '', multiline = false) {
  const control = multiline
    ? el('textarea', { class: 'textarea', style: 'min-height:70px', placeholder, oninput: e => onChange(e.target.value) })
    : el('input', { class: 'input', type: 'text', value: value ?? '', placeholder, oninput: e => onChange(e.target.value) });
  if (multiline) control.value = value ?? '';
  return el('label', { class: 'field' }, el('span', { class: 'label', text: label }), control);
}

const swap = (a, b) => { [questions[a], questions[b]] = [questions[b], questions[a]]; renumber(); drawQuestions(); };
const renumber = () => questions.forEach((q, i) => q.id = `q${i + 1}`);

drawQuestions();

/* --------------------------------- saving --------------------------------- */
function collect() {
  const title = $('#e-title').value.trim();
  const problems = [];
  if (!title) problems.push('the exercise needs a title');
  if (!questions.length) problems.push('add at least one question');
  questions.forEach((q, i) => {
    if (!q.prompt.trim()) problems.push(`question ${i + 1} has no prompt`);
    if (q.type === 'choice' && typeof q.answer !== 'number') problems.push(`question ${i + 1} has no correct option marked`);
    if (q.type === 'multi' && !q.answer.length) problems.push(`question ${i + 1} has no correct options marked`);
    if ((q.type === 'math' || q.type === 'blank') && !String(q.answer).trim()) problems.push(`question ${i + 1} has no answer`);
    if ((q.type === 'choice' || q.type === 'multi') && q.options.some(o => !o.trim()))
      problems.push(`question ${i + 1} has an empty option`);
  });
  if (problems.length) return { problems };

  const level = $('#e-level').value;
  return {
    exercise: {
      id: `custom-${Date.now().toString(36)}`,
      title,
      subject: $('#e-subject').value,
      topic: $('#e-topic').value,
      grade: GRADES.find(g => g.levels.includes(level)).id,
      level,
      difficulty: $('#e-difficulty').value,
      minutes: Number($('#e-minutes').value) || 15,
      summary: $('#e-summary').value.trim() || `Custom exercise: ${title}.`,
      custom: true,
      questions: questions.map(q => {
        const out = { id: q.id, type: q.type, prompt: q.prompt.trim() };
        if (q.math?.trim()) out.math = q.math.trim();
        if (q.options) out.options = q.options.map(o => o.trim());
        if (q.type !== 'written') out.answer = q.answer;
        if (q.accept?.length) out.accept = q.accept;
        if (q.hint?.trim()) out.hint = q.hint.trim();
        if (q.explanation?.trim()) out.explanation = q.explanation.trim();
        if (q.sample?.trim()) out.sample = q.sample.trim();
        return out;
      })
    }
  };
}

$('#save-btn').addEventListener('click', () => {
  const { exercise, problems } = collect();
  if (problems) { toast(`Not saved — ${problems[0]}`, 4200); return; }
  saveCustomExercise(exercise);
  toast('Exercise saved — it is now in the library on this device');
  drawSaved();
});

$('#preview-btn').addEventListener('click', () => {
  const { exercise, problems } = collect();
  if (problems) { toast(`Cannot preview — ${problems[0]}`, 4200); return; }
  toast(`Looks valid: ${plural(exercise.questions.length, 'question')}, ${exercise.level}. Save it to practise or print it.`, 4500);
});

/* ------------------------------ saved exercises ------------------------------ */
function drawSaved() {
  const saved = customExercises();
  $('#saved-list').replaceChildren(...(saved.length
    ? saved.map(ex => el('div', { class: 'list-item' },
        el('span', { class: 'tile-icon', style: 'width:30px;height:30px;font-size:14px', 'aria-hidden': 'true', text: '📝' }),
        el('span', { class: 'grow' },
          el('span', { class: 'list-title', style: 'display:block', text: ex.title }),
          el('span', { class: 'list-sub', text: `${ex.level} · ${plural(ex.questions.length, 'question')}` })),
        el('a', { class: 'btn btn-ghost btn-sm', href: href(`exercise.html?id=${ex.id}&mode=online`), text: 'Practise' }),
        el('a', { class: 'btn btn-ghost btn-sm', href: href(`print.html?id=${ex.id}`), text: 'Print' }),
        el('button', { class: 'btn btn-ghost btn-sm', type: 'button', text: 'Delete',
          onclick: () => { deleteCustomExercise(ex.id); drawSaved(); } })))
    : [el('p', { class: 'small muted', style: 'margin:0' },
        'Nothing saved yet. Saved exercises join the library on this device — they search, ' +
        'play and print like the rest. A server is what would let you share them with a class.')]));
}
drawSaved();
