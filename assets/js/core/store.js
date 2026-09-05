/* WorksheetHub — client state, and the seam the backend plugs into.

   Everything a signed-in user accumulates lives in localStorage under one
   key. That is still true and still matters: with no server reachable the
   site works exactly as it always has, which is how it is tested and how it
   can be served from a folder of files.

   When a backend *is* reachable, this file is where the two meet. Local
   writes happen first, so nothing waits on a network round trip; each one
   emits an event that sync.js turns into an API call; and hydrate() takes
   what the server knows and merges it in. Class and assignment writes are
   the exception — they go to the server first, because an id and a join code
   have to be unique across every device, not just this one. */

import { todayKey, hashCode } from './util.js';
import { ACHIEVEMENTS, GRADES } from '../data/catalog.js';
import { EXERCISE_MAP, getExercise } from '../data/exercises.js';
import { STORAGE_KEY as KEY } from './storage-key.js';
/* api.js has no dependencies of its own and answers { ok: false } when there
   is no server, so importing it here costs nothing offline. */
import * as api from './api.js';

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
  customExercises: [],
  assignedWork: [],    // set to this student, as the server reports it
  stateUpdated: 0      // when the shared part of this document last changed
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

/* Events are the seam. The store never imports the API client — it announces
   what happened and sync.js decides whether there is a server to tell. That
   keeps this file working untouched when there is not. */
const watchers = new Set();
export const onEvent = fn => { watchers.add(fn); return () => watchers.delete(fn); };
function emit(kind, detail) {
  for (const fn of watchers) {
    try { fn(kind, detail); } catch { /* a broken listener must not break a write */ }
  }
}

export function update(mutator) {
  mutator(state);
  persist();
  return state;
}

/* The parts of the document that belong to the person rather than to this
   device. Sent up whole; small enough that diffing it would cost more than
   sending it. */
export const sharedState = () => ({
  theme: state.theme,
  favorites: state.favorites,
  achievements: state.achievements,
  days: state.days,
  activity: state.activity.slice(0, 60)
});
/* Deliberately not enrolments. The server knows which classes somebody is in
   from the roster table, which is the answer that survives them leaving a
   class on another device. Sending a second copy up in this document would
   give the same fact two sources and let the stale one win. */

function touchShared() {
  update(s => { s.stateUpdated = Date.now(); });
  emit('state', { state: sharedState(), updatedAt: state.stateUpdated });
}

/**
 * Merge what the server knows into what this device has.
 * Newer wins, field by field: a phone that answered five minutes ago must not
 * be overwritten by a tab that has been open since this morning.
 */
export function hydrate(data) {
  update(s => {
    if (data.user) s.user = { ...data.user };

    /* The shared document, whole, if the server's copy is the newer one. */
    if (data.state && (data.stateUpdated ?? 0) >= (s.stateUpdated ?? 0)) {
      const d = data.state;
      if (d.theme !== undefined) s.theme = d.theme;
      if (Array.isArray(d.favorites)) s.favorites = d.favorites;
      if (Array.isArray(d.achievements)) s.achievements = d.achievements;
      if (d.days && typeof d.days === 'object') s.days = d.days;
      if (Array.isArray(d.activity)) s.activity = d.activity;
      s.stateUpdated = data.stateUpdated ?? Date.now();
    }

    /* Runs, one at a time, keeping whichever side moved last. */
    for (const [id, remote] of Object.entries(data.progress ?? {})) {
      const local = s.progress[id];
      if (!local) { s.progress[id] = remote; continue; }
      const merged = (remote.updated ?? 0) > (local.updated ?? 0) ? { ...local, ...remote } : { ...remote, ...local };
      merged.answers = {};
      for (const qid of new Set([...Object.keys(local.answers ?? {}), ...Object.keys(remote.answers ?? {})])) {
        const a = local.answers?.[qid], b = remote.answers?.[qid];
        merged.answers[qid] = !a ? b : !b ? a : ((b.at ?? 0) > (a.at ?? 0) ? b : a);
      }
      merged.seconds = Math.max(local.seconds ?? 0, remote.seconds ?? 0);
      merged.completedAt = local.completedAt ?? remote.completedAt ?? null;
      s.progress[id] = merged;
    }

    if (Array.isArray(data.customExercises) && data.customExercises.length) {
      const byId = new Map(s.customExercises.map(e => [e.id, e]));
      for (const ex of data.customExercises) byId.set(ex.id, ex);
      s.customExercises = [...byId.values()];
    }
  });
  return state;
}

/** Replace the teacher's classes and assignments with the server's copy. */
export function hydrateTeacher({ classes, assignments }) {
  update(s => {
    s.teacher = {
      classes: (classes ?? []).map(c => ({ ...c, exerciseIds: c.exerciseIds ?? [] })),
      assignments: assignments ?? []
    };
  });
  return state.teacher;
}

/**
 * Replace this student's enrolments, the work set to them, and what they have
 * already handed in, with the server's copy. This is what makes a class join
 * work across devices: the assignments come from the teacher's account, not
 * from a teacher blob that happens to sit in this browser.
 */
export function hydrateAssignedWork({ enrolments, assignments, submissions }) {
  update(s => {
    s.enrollments = enrolments ?? [];
    s.assignedWork = (assignments ?? []).map(a => ({
      ...a,
      class: a.class ?? (enrolments ?? []).find(e => e.classId === a.classId) ?? null
    }));
    for (const sub of submissions ?? []) {
      s.submissions[sub.assignmentId] ??= {};
      s.submissions[sub.assignmentId].me ??= {};
      s.submissions[sub.assignmentId].me[sub.exerciseId] = {
        correct: sub.correct, total: sub.total, percent: sub.percent, at: sub.at
      };
    }
  });
  return state.assignedWork;
}

/**
 * Fold a class's results, as the server reports them, into the shape the
 * teacher pages already read. The analytics screen keeps working unchanged;
 * the difference is that the students in it are real people on other devices.
 */
export function hydrateResults({ class: cls, assignments, submissions }) {
  update(s => {
    s.teacher ??= emptyTeacher();
    const i = s.teacher.classes.findIndex(c => c.id === cls.id);
    /* Merged into the existing object rather than replacing it, so a page
       that took a reference before the server answered sees the update. */
    if (i >= 0) Object.assign(s.teacher.classes[i], cls);
    else s.teacher.classes.unshift(cls);

    for (const a of assignments ?? []) {
      const j = s.teacher.assignments.findIndex(x => x.id === a.id);
      if (j >= 0) s.teacher.assignments[j] = a; else s.teacher.assignments.push(a);
    }
    for (const sub of submissions ?? []) {
      /* Keyed by roster id, which is what the grid looks up. */
      const student = cls.students?.find(st => st.userId === sub.userId);
      const key = student?.id ?? sub.userId;
      s.submissions[sub.assignmentId] ??= {};
      s.submissions[sub.assignmentId][key] ??= {};
      s.submissions[sub.assignmentId][key][sub.exerciseId] = {
        correct: sub.correct, total: sub.total, percent: sub.percent,
        answers: sub.answers, at: sub.at
      };
    }
  });
}

export function resetAll() {
  state = structuredClone(BLANK);
  persist();
}

/* --------------------------------- user --------------------------------- */
export function signIn({ name, role = 'student', grade = 'middle' }) {
  return update(s => {
    /* Spread the existing user rather than replacing it: with a backend the
       account also carries an id and an email, and rebuilding the object from
       three fields threw both away every time somebody edited their name. */
    s.user = {
      ...s.user,
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
  touchShared();
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
  touchShared();
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
  emit('answer', { exerciseId, qid, value, correct, revealed });
  unlockAchievements();
  touchShared();
}

export function toggleFlag(exerciseId, qid) {
  update(s => {
    const run = s.progress[exerciseId] ??= { started: Date.now(), answers: {}, flags: [], completedAt: null, seconds: 0 };
    run.flags ??= [];
    const i = run.flags.indexOf(qid);
    if (i >= 0) run.flags.splice(i, 1); else run.flags.push(qid);
  });
  emit('run', { exerciseId, flags: state.progress[exerciseId].flags ?? [] });
  return (state.progress[exerciseId].flags ?? []).includes(qid);
}

export function clearAnswer(exerciseId, qid) {
  update(s => { delete s.progress[exerciseId]?.answers?.[qid]; });
  emit('clear-answer', { exerciseId, qid });
}

export function resetRun(exerciseId) {
  update(s => { delete s.progress[exerciseId]; });
  emit('run', { exerciseId, reset: true });
}

export function addPracticeTime(exerciseId, seconds) {
  if (!seconds) return;
  update(s => {
    const run = s.progress[exerciseId];
    if (run) run.seconds = (run.seconds ?? 0) + seconds;
    const k = todayKey();
    s.days[k] = (s.days[k] ?? 0) + seconds / 60;
  });
  emit('run', { exerciseId, addSeconds: seconds });
  touchShared();
}

export function completeRun(exerciseId) {
  update(s => {
    const run = s.progress[exerciseId];
    if (run && !run.completedAt) run.completedAt = Date.now();
    s.days[todayKey()] ??= 0;
  });
  /* A finished worksheet is the one write a teacher is waiting on, so the
     score goes up with the per-question detail attached. The server files it
     against every assignment that set this worksheet — the student does not
     have to send anything to anybody. */
  const score = scoreFor(exerciseId);
  const run = state.progress[exerciseId];
  emit('score', {
    exerciseId,
    correct: score.correct,
    total: score.gradable || score.total,
    seconds: run?.seconds ?? 0,
    answers: run?.answers ?? {}
  });
  unlockAchievements();
  touchShared();
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

/* Classes and assignments are the writes that go to the server first.
   Everything else can be written locally and pushed afterwards, because it
   belongs to one person. An id and a join code cannot: two teachers on two
   devices would mint the same six characters soon enough, and a student
   typing a code has to reach exactly one class. So when a backend is there,
   the server allocates and this mirrors what it says. With no backend the
   local path runs exactly as it always did. */
export async function createClass({ name, level, subject = null }) {
  /* Store the band as well as the level: "Set work" filters the library by
     band, and without it a Grade 8 class was offered Pre-K worksheets. */
  const band = GRADES.find(g => g.levels.includes(level))?.id ?? 'middle';

  const res = await api.createClassApi({ name: name.trim(), level, grade: band, subject });
  const cls = res.ok && res.data?.class
    ? { ...res.data.class, exerciseIds: [] }
    : {
        id: `c-${Date.now().toString(36)}`,
        name: name.trim(),
        level, grade: band, subject,
        code: makeAssignmentCode(),
        created: Date.now(),
        archived: false,
        students: [],
        exerciseIds: []
      };

  update(s => {
    s.teacher ??= emptyTeacher();
    s.teacher.classes.unshift(cls);
  });
  return cls;
}

export async function updateClass(classId, patch) {
  update(s => {
    const cls = s.teacher?.classes.find(c => c.id === classId);
    if (cls) Object.assign(cls, patch);
  });
  await api.patchClassApi(classId, patch);
  return findClass(classId);
}

export const archiveClass = classId => updateClass(classId, { archived: true });

export async function deleteClass(classId) {
  update(s => {
    if (!s.teacher) return;
    s.teacher.classes = s.teacher.classes.filter(c => c.id !== classId);
    s.teacher.assignments = s.teacher.assignments.filter(a => a.classId !== classId);
  });
  await api.deleteClassApi(classId);
}

export const findClass = classId =>
  (state.teacher?.classes ?? []).find(c => c.id === classId) ?? null;

export function findClassByCode(code) {
  const clean = String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!clean) return null;
  return (state.teacher?.classes ?? [])
    .find(c => c.code && c.code.replace('-', '') === clean) ?? null;
}

export async function addStudent(classId, name) {
  const res = await api.addStudentApi(classId, name.trim());
  const student = res.ok && res.data?.student ? res.data.student : {
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

export async function removeStudent(classId, studentId) {
  update(s => {
    const cls = s.teacher?.classes.find(c => c.id === classId);
    if (cls) cls.students = cls.students.filter(st => st.id !== studentId);
  });
  await api.removeStudentApi(classId, studentId);
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

export async function joinClass({ name, level, code, subject = null, studentName }) {
  if (isEnrolled(code)) return enrollments().find(e => e.code === code);
  const enrolment = {
    classId: null,
    className: name,
    level, subject, code,
    studentName: studentName || state.user?.name || 'Student',
    studentId: null,
    joinedAt: Date.now()
  };

  /* With a server, joining reaches the teacher wherever they are — which is
     the whole reason this backend exists. The invite link used to be able to
     carry a class to another device and nothing could carry a result back. */
  const res = await api.joinClassApi(code, enrolment.studentName);
  if (res.ok && res.data?.enrolment) {
    Object.assign(enrolment, res.data.enrolment);
  } else if (!res.ok && res.status === 409) {
    /* Already on the roster from another device. Not a failure. */
  } else {
    /* No server, or it refused: fall back to the local roster if this device
       happens to be the one the class was made on. */
    const local = findClassByCode(code);
    if (local) {
      const student = await addStudent(local.id, enrolment.studentName);
      enrolment.classId = local.id;
      enrolment.studentId = student.id;
      update(s => {
        const cls = s.teacher.classes.find(c => c.id === local.id);
        const st = cls?.students.find(x => x.id === student.id);
        if (st) st.source = 'joined';
      });
    }
  }
  update(s => { s.enrollments.push(enrolment); });
  touchShared();
  return enrolment;
}

export async function leaveClass(code) {
  const e = enrollments().find(x => x.code === code);
  update(s => { s.enrollments = s.enrollments.filter(x => x.code !== code); });
  const res = await api.leaveClassApi(code);
  if (!res.ok && e?.classId && e?.studentId) await removeStudent(e.classId, e.studentId);
  touchShared();
}

/* ----------------------------- assignments ----------------------------- */
/** Worksheets set to the classes this student has joined, newest first. */
export function assignedToMe() {
  /* With a server, the work comes from the teacher's account. Without one,
     it can only be work set on this same device, which is the limit the
     interface used to have to state out loud. */
  if (state.assignedWork?.length) return state.assignedWork;
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
/* A teacher account starts empty. It used to start with two sample classes of
   invented students and pseudo-random results, so the analytics screen had
   something to show — which meant every number on it was fiction. A launched
   product reports what actually happened, and shows an empty state until it
   has. */
export function teacherData() {
  if (!state.teacher) update(s => { s.teacher = { classes: [], assignments: [] }; });
  return state.teacher;
}

const emptyTeacher = () => ({ classes: [], assignments: [] });

/**
 * Results for one worksheet in one class, from what students actually
 * submitted. Returns null when nobody has handed anything in — the caller is
 * expected to say so rather than draw a chart of nothing.
 */
export function classResults(classId, exerciseId) {
  const t = teacherData();
  const cls = t.classes.find(c => c.id === classId);
  const ex = EXERCISE_MAP[exerciseId] ? getExercise(exerciseId) : null;
  if (!cls || !ex?.questions?.length) return null;

  /* Every assignment of this worksheet to this class, and what came back. */
  const assignments = (t.assignments ?? []).filter(
    a => a.classId === classId && (a.worksheetIds ?? [a.exerciseId]).includes(exerciseId));
  const submitted = new Map();          // studentId -> result
  for (const a of assignments) {
    for (const [studentId, sheets] of Object.entries(state.submissions?.[a.id] ?? {})) {
      const r = sheets?.[exerciseId];
      if (r) submitted.set(studentId, r);
    }
  }
  if (!submitted.size) return null;

  const rows = [...submitted.entries()].map(([studentId, r]) => {
    const student = cls.students.find(s2 => s2.id === studentId)
      ?? { id: studentId, name: studentId === 'me' ? 'You' : 'Student' };
    const answers = ex.questions.map(q => Boolean(r.answers?.[q.id]?.correct));
    const correct = r.correct ?? answers.filter(Boolean).length;
    const total = r.total ?? ex.questions.length;
    return { student, answers, correct, total, percent: Math.round((correct / Math.max(1, total)) * 100) };
  });

  const perQuestion = ex.questions.map((q, i) => {
    const got = rows.filter(r2 => r2.answers[i]).length;
    return { question: q, index: i, correct: got, total: rows.length,
             percent: Math.round((got / Math.max(1, rows.length)) * 100) };
  });

  return {
    class: cls, exercise: ex, rows, perQuestion,
    average: Math.round(rows.reduce((a, r2) => a + r2.percent, 0) / rows.length),
    answered: rows.reduce((a, r2) => a + r2.total, 0),
    hardest: [...perQuestion].sort((a, b) => a.percent - b.percent).slice(0, 3)
  };
}

/* ------------------------------ assignments ------------------------------ */
export async function createAssignment({ exerciseId, worksheetIds, classId, title, due, note }) {
  const ids = worksheetIds?.length ? worksheetIds : (exerciseId ? [exerciseId] : []);

  const res = await api.createAssignmentApi({ classId, title, worksheetIds: ids, due, note });
  const assignment = res.ok && res.data?.assignment ? res.data.assignment : {
    id: `a-${Date.now().toString(36)}`,
    code: makeAssignmentCode(),
    exerciseId: ids[0] ?? null,   // kept for links that name a single worksheet
    worksheetIds: ids,
    classId, title, due, note,
    created: Date.now()
  };
  update(s => {
    s.teacher ??= emptyTeacher();
    s.teacher.assignments.unshift(assignment);
  });
  return assignment;
}

export function findAssignment(code) {
  const clean = String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  return (state.teacher?.assignments ?? []).find(
    a => a.code.replace('-', '') === clean) ?? null;
}

export async function deleteAssignment(code) {
  const doomed = (state.teacher?.assignments ?? []).find(a => a.code === code);
  update(s => {
    if (!s.teacher) return;
    s.teacher.assignments = s.teacher.assignments.filter(a => a.code !== code);
  });
  if (doomed) await api.deleteAssignmentApi(doomed.id);
}

/* --------------------------- custom exercises --------------------------- */
export function saveCustomExercise(ex) {
  update(s => {
    const i = s.customExercises.findIndex(e => e.id === ex.id);
    if (i >= 0) s.customExercises[i] = ex; else s.customExercises.push(ex);
  });
  emit('custom', { id: ex.id, exercise: ex });
  return ex;
}
export const customExercises = () => state.customExercises;
export function deleteCustomExercise(id) {
  update(s => { s.customExercises = s.customExercises.filter(e => e.id !== id); });
  emit('custom-delete', { id });
}
