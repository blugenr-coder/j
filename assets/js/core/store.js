/* WorksheetHub — client-side state.
   Everything a signed-in user accumulates (progress, favourites, streak,
   teacher classes) lives in localStorage under one key. This is the seam
   where a real API would slot in: swap read()/write() for fetch calls and
   the rest of the app is unchanged. */

import { todayKey, hashCode } from './util.js';
import { ACHIEVEMENTS, GRADES } from '../data/catalog.js';
import { EXERCISE_MAP, getExercise } from '../data/exercises.js';
import { STORAGE_KEY as KEY } from './storage-key.js';

const BLANK = {
  user: null,
  theme: null,
  progress: {},        // exerciseId -> run record
  favorites: [],
  activity: [],        // newest first, capped
  days: {},            // 'YYYY-MM-DD' -> minutes practised
  achievements: [],
  teacher: null,       // { classes, assignments } — created on first use
  enrollments: [],     // classes this student has joined
  submissions: {},     // assignmentId -> studentId -> worksheetId -> result
  customExercises: []
};

let state = load();
const listeners = new Set();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(BLANK);
    return { ...structuredClone(BLANK), ...JSON.parse(raw) };
  } catch {
    /* Corrupted or unavailable storage (private mode, cleared site data)
       must never break the page — fall back to a clean in-memory state. */
    return structuredClone(BLANK);
  }
}

function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* quota or private mode */ }
  for (const fn of listeners) fn(state);
}

export const getState = () => state;
export const subscribe = fn => { listeners.add(fn); return () => listeners.delete(fn); };

export function update(mutator) {
  mutator(state);
  persist();
  return state;
}

export function resetAll() {
  state = structuredClone(BLANK);
  persist();
}

/* --------------------------------- user --------------------------------- */
export function signIn({ name, role = 'student', grade = 'middle' }) {
  return update(s => {
    s.user = {
      name: name?.trim() || 'Student',
      role,
      grade,
      initials: (name || 'S').trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase(),
      since: s.user?.since ?? Date.now()
    };
  });
}
export function signOut() { return update(s => { s.user = null; }); }
export const currentUser = () => state.user;
export const isTeacher = () => state.user?.role === 'teacher';

/* -------------------------------- theme -------------------------------- */
export function setTheme(theme) {
  update(s => { s.theme = theme; });
  applyTheme();
}
export function applyTheme() {
  const t = state.theme ??
    (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.dataset.theme = t;
  return t;
}

/* ------------------------------ favourites ------------------------------ */
export const isFavorite = id => state.favorites.includes(id);
export function toggleFavorite(id) {
  update(s => {
    const i = s.favorites.indexOf(id);
    if (i >= 0) s.favorites.splice(i, 1); else s.favorites.push(id);
  });
  return isFavorite(id);
}

/* -------------------------------- runs -------------------------------- */
/** Fetch (creating if needed) the progress record for one exercise. */
export function runFor(exerciseId) {
  if (!state.progress[exerciseId]) {
    update(s => {
      s.progress[exerciseId] = {
        started: Date.now(), updated: Date.now(),
        answers: {}, flags: [], completedAt: null, seconds: 0
      };
    });
  }
  return state.progress[exerciseId];
}

export function recordAnswer(exerciseId, qid, { value, correct, revealed = false }) {
  update(s => {
    const run = s.progress[exerciseId] ??= { started: Date.now(), answers: {}, flags: [], completedAt: null, seconds: 0 };
    const prev = run.answers[qid] ?? { attempts: 0 };
    run.answers[qid] = {
      value,
      correct,
      revealed: revealed || prev.revealed || false,
      attempts: prev.attempts + 1,
      at: Date.now()
    };
    run.updated = Date.now();
    s.activity.unshift({ ts: Date.now(), exerciseId, qid, correct });
    s.activity = s.activity.slice(0, 60);
  });
  unlockAchievements();
}

export function toggleFlag(exerciseId, qid) {
  update(s => {
    const run = s.progress[exerciseId] ??= { started: Date.now(), answers: {}, flags: [], completedAt: null, seconds: 0 };
    run.flags ??= [];
    const i = run.flags.indexOf(qid);
    if (i >= 0) run.flags.splice(i, 1); else run.flags.push(qid);
  });
  return (state.progress[exerciseId].flags ?? []).includes(qid);
}

export function clearAnswer(exerciseId, qid) {
  update(s => { delete s.progress[exerciseId]?.answers?.[qid]; });
}

export function resetRun(exerciseId) {
  update(s => { delete s.progress[exerciseId]; });
}

export function addPracticeTime(exerciseId, seconds) {
  if (!seconds) return;
  update(s => {
    const run = s.progress[exerciseId];
    if (run) run.seconds = (run.seconds ?? 0) + seconds;
    const k = todayKey();
    s.days[k] = (s.days[k] ?? 0) + seconds / 60;
  });
}

export function completeRun(exerciseId) {
  update(s => {
    const run = s.progress[exerciseId];
    if (run && !run.completedAt) run.completedAt = Date.now();
    s.days[todayKey()] ??= 0;
  });
  unlockAchievements();
}

/* ------------------------------- scoring ------------------------------- */
/** Correct / answered / total for one exercise, ignoring self-marked writing. */
export function scoreFor(exerciseId) {
  const meta = EXERCISE_MAP[exerciseId];
  if (!meta) return { correct: 0, answered: 0, total: 0, gradable: 0, percent: 0, done: false };

  const run = state.progress[exerciseId];
  /* Nothing has been answered, so metadata is enough. This matters: a library
     page renders hundreds of cards, and hydrating every worksheet just to say
     "0 of 12" would build thousands of questions nobody asked to see. */
  if (!run || !Object.keys(run.answers ?? {}).length) {
    return {
      correct: 0, answered: 0, total: meta.count,
      gradable: meta.autoMarked ?? meta.count, percent: 0,
      done: Boolean(run?.completedAt), seconds: run?.seconds ?? 0,
      startedAt: run?.started ?? null
    };
  }

  const ex = getExercise(exerciseId);
  const answers = run.answers ?? {};
  const gradableQs = ex.questions.filter(q => q.type !== 'written');
  const correct = gradableQs.filter(q => answers[q.id]?.correct).length;
  const answered = ex.questions.filter(q => answers[q.id] !== undefined).length;
  return {
    correct,
    answered,
    total: ex.questions.length,
    gradable: gradableQs.length,
    percent: gradableQs.length ? Math.round((correct / gradableQs.length) * 100) : 0,
    done: Boolean(run?.completedAt) || answered === ex.questions.length,
    seconds: run?.seconds ?? 0,
    startedAt: run?.started ?? null
  };
}

export function statusFor(exerciseId) {
  const run = state.progress[exerciseId];
  if (!run) return 'not-started';
  const s = scoreFor(exerciseId);
  if (s.done) return 'completed';
  return s.answered ? 'in-progress' : 'not-started';
}

/* -------------------------------- streak -------------------------------- */
export function streak() {
  const days = Object.keys(state.days).sort().reverse();
  if (!days.length) return 0;
  let count = 0;
  const cursor = new Date();
  /* A streak survives "today not practised yet" — it only breaks once a
     whole day has been skipped, otherwise the counter would read 0 every
     morning and punish the user for waking up. */
  if (!state.days[todayKey(cursor)]) cursor.setDate(cursor.getDate() - 1);
  for (;;) {
    if (state.days[todayKey(cursor)] === undefined) break;
    count++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}

/* ------------------------------ aggregates ------------------------------ */
export function summary() {
  const runs = Object.entries(state.progress);
  let correct = 0, answered = 0, completed = 0, perfectRuns = 0, mathHighScores = 0, minutes = 0;
  const subjects = {};
  for (const [id] of runs) {
    const ex = EXERCISE_MAP[id];
    if (!ex) continue;
    const s = scoreFor(id);
    correct += s.correct; answered += s.answered; minutes += (s.seconds ?? 0) / 60;
    if (s.done) {
      completed++;
      if (s.percent === 100 && s.gradable > 0) perfectRuns++;
      if (ex.subject === 'math' && s.percent >= 90) mathHighScores++;
    }
    const bucket = subjects[ex.subject] ??= { correct: 0, gradable: 0, exercises: 0, completed: 0 };
    bucket.correct += s.correct;
    bucket.gradable += Math.min(s.answered, s.gradable);
    bucket.exercises++;
    if (s.done) bucket.completed++;
  }
  for (const b of Object.values(subjects)) b.percent = b.gradable ? Math.round((b.correct / b.gradable) * 100) : 0;

  /* Practice time is tracked twice — per exercise and per day — because the
     progress page needs both. Report the per-day total, which is the one that
     survives a run being reset. */
  const dayMinutes = Object.values(state.days).reduce((a, b) => a + b, 0);

  return {
    completed, correct, answered,
    accuracy: answered ? Math.round((correct / Math.max(1, answered)) * 100) : 0,
    /* Left unrounded — the formatter decides whether to show seconds. */
    minutes: Math.max(minutes, dayMinutes),
    streak: streak(),
    perfectRuns, mathHighScores,
    subjects,
    subjectsTouched: Object.keys(subjects).length,
    earlyBird: Object.values(state.progress).some(r => r.completedAt && new Date(r.completedAt).getHours() < 9)
  };
}

/** The exercise to offer in "Continue working" — most recently touched, unfinished. */
export function continueTarget() {
  const open = Object.entries(state.progress)
    .filter(([id, r]) => EXERCISE_MAP[id] && !r.completedAt && Object.keys(r.answers ?? {}).length)
    .sort((a, b) => (b[1].updated ?? 0) - (a[1].updated ?? 0));
  return open.length ? open[0][0] : null;
}

export function recentExercises(n = 5) {
  return Object.entries(state.progress)
    .filter(([id]) => EXERCISE_MAP[id])
    .sort((a, b) => (b[1].updated ?? b[1].started) - (a[1].updated ?? a[1].started))
    .slice(0, n)
    .map(([id]) => id);
}

/* ----------------------------- achievements ----------------------------- */
export function unlockAchievements() {
  const s = summary();
  const newly = [];
  update(st => {
    for (const a of ACHIEVEMENTS) {
      if (st.achievements.includes(a.id)) continue;
      if (a.test(s)) { st.achievements.push(a.id); newly.push(a); }
    }
  });
  return newly;
}
export const hasAchievement = id => state.achievements.includes(id);

/* Join codes avoid 0/O and 1/I, which get misread off a whiteboard. */
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function makeAssignmentCode() {
  const pick = n => Array.from({ length: n }, () =>
    CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)]).join('');
  return `${pick(3)}-${pick(3)}`;
}

/* ================================ CLASSES ================================
   A class is a roster plus a code. A teacher creates one and shares either the
   six-character code (which resolves on this device) or a join link, which
   carries the class details in the URL and therefore works on any device.
   What a link cannot do is send results back without a server — that boundary
   is stated in the interface rather than papered over. */

export function createClass({ name, level, subject = null }) {
  /* Store the band as well as the level: "Set work" filters the library by
     band, and without it a Grade 8 class was offered Pre-K worksheets. */
  const band = GRADES.find(g => g.levels.includes(level))?.id ?? 'middle';
  const cls = {
    id: `c-${Date.now().toString(36)}`,
    name: name.trim(),
    level, grade: band, subject,
    code: makeAssignmentCode(),
    created: Date.now(),
    archived: false,
    sample: false,
    students: [],
    exerciseIds: []
  };
  update(s => {
    s.teacher ??= seedTeacher();
    s.teacher.classes.unshift(cls);
  });
  return cls;
}

export function updateClass(classId, patch) {
  update(s => {
    const cls = s.teacher?.classes.find(c => c.id === classId);
    if (cls) Object.assign(cls, patch);
  });
  return findClass(classId);
}

export function archiveClass(classId) { return updateClass(classId, { archived: true }); }

export function deleteClass(classId) {
  update(s => {
    if (!s.teacher) return;
    s.teacher.classes = s.teacher.classes.filter(c => c.id !== classId);
    s.teacher.assignments = s.teacher.assignments.filter(a => a.classId !== classId);
  });
}

export const findClass = classId =>
  (state.teacher?.classes ?? []).find(c => c.id === classId) ?? null;

export function findClassByCode(code) {
  const clean = String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!clean) return null;
  return (state.teacher?.classes ?? [])
    .find(c => c.code && c.code.replace('-', '') === clean) ?? null;
}

export function addStudent(classId, name) {
  const student = {
    id: `s-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e4)}`,
    name: name.trim(),
    joinedAt: Date.now(),
    source: 'added'
  };
  update(s => {
    const cls = s.teacher?.classes.find(c => c.id === classId);
    if (cls) cls.students.push(student);
  });
  return student;
}

export function removeStudent(classId, studentId) {
  update(s => {
    const cls = s.teacher?.classes.find(c => c.id === classId);
    if (cls) cls.students = cls.students.filter(st => st.id !== studentId);
  });
}

/* ------------------------------ join links ------------------------------ */
/** Pack a class into a URL-safe token so a join link works on any device. */
export function encodeClass(cls) {
  const payload = JSON.stringify({ n: cls.name, l: cls.level, c: cls.code, s: cls.subject ?? null });
  return btoa(unescape(encodeURIComponent(payload))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeClass(token) {
  try {
    const b64 = token.replace(/-/g, '+').replace(/_/g, '/');
    const obj = JSON.parse(decodeURIComponent(escape(atob(b64))));
    if (!obj?.n || !obj?.c) return null;
    return { name: obj.n, level: obj.l ?? null, code: obj.c, subject: obj.s ?? null };
  } catch {
    return null;
  }
}

/* ----------------------------- student side ----------------------------- */
export const enrollments = () => state.enrollments ?? [];
export const isEnrolled = code => {
  const clean = String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  return Boolean(clean) && enrollments()
    .some(e => e.code && e.code.replace('-', '') === clean);
};

export function joinClass({ name, level, code, subject = null, studentName }) {
  if (isEnrolled(code)) return enrollments().find(e => e.code === code);
  const enrolment = {
    classId: null,
    className: name,
    level, subject, code,
    studentName: studentName || state.user?.name || 'Student',
    studentId: null,
    joinedAt: Date.now()
  };
  /* If the class lives on this device, attach to the real roster so the
     teacher sees the student appear. */
  const local = findClassByCode(code);
  if (local) {
    const student = addStudent(local.id, enrolment.studentName);
    enrolment.classId = local.id;
    enrolment.studentId = student.id;
    update(s => {
      const cls = s.teacher.classes.find(c => c.id === local.id);
      const st = cls?.students.find(x => x.id === student.id);
      if (st) st.source = 'joined';
    });
  }
  update(s => { s.enrollments.push(enrolment); });
  return enrolment;
}

export function leaveClass(code) {
  const e = enrollments().find(x => x.code === code);
  update(s => { s.enrollments = s.enrollments.filter(x => x.code !== code); });
  if (e?.classId && e?.studentId) removeStudent(e.classId, e.studentId);
}

/* ----------------------------- assignments ----------------------------- */
/** Worksheets set to the classes this student has joined, newest first. */
export function assignedToMe() {
  const codes = new Set(enrollments().map(e => e.code));
  const classes = (state.teacher?.classes ?? []).filter(c => codes.has(c.code));
  const byId = Object.fromEntries(classes.map(c => [c.id, c]));
  return (state.teacher?.assignments ?? [])
    .filter(a => byId[a.classId])
    .map(a => ({ ...a, class: byId[a.classId] }))
    .sort((x, y) => (y.created ?? 0) - (x.created ?? 0));
}

/** Record a finished worksheet against every assignment that set it. */
export function recordSubmission(exerciseId, result) {
  const mine = assignedToMe().filter(a => (a.worksheetIds ?? [a.exerciseId]).includes(exerciseId));
  if (!mine.length) return;
  update(s => {
    for (const a of mine) {
      const enrolment = s.enrollments.find(e => e.classId === a.classId);
      const studentId = enrolment?.studentId ?? 'me';
      s.submissions[a.id] ??= {};
      s.submissions[a.id][studentId] ??= {};
      s.submissions[a.id][studentId][exerciseId] = { ...result, at: Date.now() };
    }
  });
}

export const submissionsFor = assignmentId => state.submissions?.[assignmentId] ?? {};

/* ------------------------------- teacher ------------------------------- */
/* Teacher mode needs a class with results in it to be worth looking at.
   On first use we seed two sample classes with deterministic pseudo-results
   so the analytics view demonstrates real behaviour. Sample rows are marked
   so nothing here is mistaken for live student data. */
export function teacherData() {
  if (!state.teacher) update(s => { s.teacher = seedTeacher(); });
  return state.teacher;
}

function seedTeacher() {
  const names = ['Ana Ruiz', 'Marcus Bell', 'Leila Haddad', 'Tom Novak', 'Sara Lindqvist',
                 'Diego Peña', 'Mei Chen', 'Jonas Weber', 'Priya Nair', 'Owen Clarke',
                 'Zoe Martin', 'Ibrahim Sy', 'Hanna Koch', 'Luca Rossi', 'Nina Petrova'];
  const mk = (id, name, grade, level, size, exerciseIds) => ({
    id, name, grade, level,
    subject: 'math',
    code: makeAssignmentCode(),
    created: Date.now(),
    archived: false,
    sample: true,
    students: names.slice(0, size).map((n, i) => ({
      id: `${id}-s${i}`, name: n, joinedAt: Date.now(), source: 'added'
    })),
    exerciseIds
  });
  const classes = [
    mk('c-7a', 'Grade 7A — Mathematics', 'middle', 'Grade 7', 12, ['percentages-real-life', 'angles-and-triangles']),
    mk('c-8b', 'Grade 8B — Mathematics', 'middle', 'Grade 8', 15, ['linear-equations'])
  ];
  return { classes, assignments: [], results: {} };
}

/** Deterministic sample results so analytics is reproducible across reloads. */
export function classResults(classId, exerciseId) {
  const t = teacherData();
  const cls = t.classes.find(c => c.id === classId);
  const ex = EXERCISE_MAP[exerciseId];
  if (!cls || !ex) return null;

  const rows = cls.students.map(stu => {
    const answers = ex.questions.map((q, qi) => {
      const seed = hashCode(`${stu.id}:${q.id}`);
      /* Ability varies by student, difficulty varies by question position —
         later questions are harder, which is what makes the "most difficult
         questions" panel meaningful. */
      const ability = 0.55 + ((hashCode(stu.id) % 40) / 100);
      const qDifficulty = 0.12 + (qi / Math.max(1, ex.questions.length)) * 0.35;
      const roll = (seed % 1000) / 1000;
      return roll < (ability - qDifficulty + 0.25);
    });
    const correct = answers.filter(Boolean).length;
    return {
      student: stu,
      answers,
      correct,
      total: ex.questions.length,
      percent: Math.round((correct / ex.questions.length) * 100)
    };
  });

  const perQuestion = ex.questions.map((q, i) => {
    const got = rows.filter(r => r.answers[i]).length;
    return { question: q, index: i, correct: got, total: rows.length, percent: Math.round((got / rows.length) * 100) };
  });

  return {
    class: cls, exercise: ex, rows, perQuestion,
    average: Math.round(rows.reduce((a, r) => a + r.percent, 0) / rows.length),
    answered: rows.reduce((a, r) => a + r.total, 0),
    hardest: [...perQuestion].sort((a, b) => a.percent - b.percent).slice(0, 3)
  };
}

/* ------------------------------ assignments ------------------------------ */
export function createAssignment({ exerciseId, worksheetIds, classId, title, due, note }) {
  const ids = worksheetIds?.length ? worksheetIds : (exerciseId ? [exerciseId] : []);
  const assignment = {
    id: `a-${Date.now().toString(36)}`,
    code: makeAssignmentCode(),
    exerciseId: ids[0] ?? null,   // kept for links that name a single worksheet
    worksheetIds: ids,
    classId, title, due, note,
    created: Date.now()
  };
  update(s => {
    s.teacher ??= seedTeacher();
    s.teacher.assignments.unshift(assignment);
  });
  return assignment;
}

export function findAssignment(code) {
  const clean = String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  return (state.teacher?.assignments ?? []).find(
    a => a.code.replace('-', '') === clean) ?? null;
}

export function deleteAssignment(code) {
  update(s => {
    if (!s.teacher) return;
    s.teacher.assignments = s.teacher.assignments.filter(a => a.code !== code);
  });
}

/* --------------------------- custom exercises --------------------------- */
export function saveCustomExercise(ex) {
  update(s => {
    const i = s.customExercises.findIndex(e => e.id === ex.id);
    if (i >= 0) s.customExercises[i] = ex; else s.customExercises.push(ex);
  });
  return ex;
}
export const customExercises = () => state.customExercises;
export function deleteCustomExercise(id) {
  update(s => { s.customExercises = s.customExercises.filter(e => e.id !== id); });
}
