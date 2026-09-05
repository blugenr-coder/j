/* Keeping the browser and the server in step.

   The store writes locally and announces what changed; this listens and tells
   the server. That order matters: a student who answers a question sees it
   saved immediately, whether or not the network is having a good day, and the
   round trip happens behind them.

   Three things it has to get right:

   - A dropped write must not be a lost write. Failed calls go back in an
     outbox and are retried, and the outbox survives a reload in localStorage.
   - It must never make the page wait. Nothing here is awaited by a render.
   - With no backend it must do nothing at all, silently. The site was static
     before this existed and still runs that way.
*/

import * as api from './api.js';
import {
  onEvent, hydrate, hydrateTeacher, hydrateAssignedWork, hydrateResults,
  currentUser, sharedState, getState, signOut
} from './store.js';

const OUTBOX_KEY = 'wh-outbox-v1';
let outbox = loadOutbox();
let flushing = false;
let ready = null;
let live = false;

/** Has this page got a server behind it, with somebody signed in to it? */
export const syncing = () => live;

/**
 * Called once per page, from the shell. Resolves to what the server says,
 * which pages can use to decide whether to show account-only affordances.
 */
export function startSync() {
  ready ??= begin();
  return ready;
}

/**
 * Run the whole handshake again from scratch.
 * The probe is memoised for the life of the page, which is right for a page
 * load and wrong the moment somebody signs in on it: without this, the sign-in
 * page would resolve the promise it made before anybody was signed in, pull
 * nothing, and send the person on to an empty dashboard.
 */
export function restartSync() {
  ready = null;
  live = false;
  return startSync();
}

async function begin() {
  if (!await api.backendAvailable()) return { online: false, user: null };

  const me = await api.whoami();
  const user = me.ok ? me.data?.user ?? null : null;
  if (!user) {
    /* A server is there but nobody is signed in to it. Anything this device
       did while signed out stays local until an account claims it. */
    return { online: true, user: null };
  }

  live = true;
  listen();

  const data = await api.myData();
  if (data.ok) {
    hydrate({ ...data.data, stateUpdated: data.data.stateUpdated });
    /* Whatever this device knows that the server does not, send up now. The
       common case is a person who practised signed out and has just made an
       account: their work should follow them, not be thrown away. */
    await pushLocalExtras(data.data.progress ?? {});
  }

  await refreshClasses(user);
  flush();
  return { online: true, user };
}

/** Pull classes: the teacher's own, and the work set to this student. */
export async function refreshClasses(user = currentUser()) {
  if (!live) return;
  if (user?.role === 'teacher') {
    const res = await api.teacherClasses();
    if (res.ok) hydrateTeacher(res.data);
  }
  const mine = await api.myClasses();
  if (mine.ok) hydrateAssignedWork(mine.data);
}

/** Pull one class's results, so the grid and analytics show real students. */
export async function refreshResults(classId) {
  /* Callers reach for this as the page loads, before the handshake has had
     time to finish. Waiting on the memoised promise costs nothing when it is
     already resolved and is the difference between a populated grid and an
     empty one when it is not. */
  await startSync();
  if (!live) return false;
  const res = await api.classResultsApi(classId);
  if (!res.ok) return false;
  hydrateResults(res.data);
  return true;
}

/* --------------------------- listening to writes --------------------------- */
let stop = null;
function listen() {
  stop?.();
  stop = onEvent((kind, detail) => {
    switch (kind) {
      case 'answer':
        enqueue(['PUT', `/me/answers/${enc(detail.exerciseId)}/${enc(detail.qid)}`,
                 { value: detail.value, correct: detail.correct, revealed: detail.revealed }]);
        break;
      case 'clear-answer':
        enqueue(['DELETE', `/me/answers/${enc(detail.exerciseId)}/${enc(detail.qid)}`]);
        break;
      case 'run':
        enqueue(['PATCH', `/me/runs/${enc(detail.exerciseId)}`,
                 { addSeconds: detail.addSeconds, flags: detail.flags, reset: detail.reset }]);
        break;
      case 'score':
        enqueue(['POST', '/me/scores', detail]);
        break;
      case 'state':
        /* Coalesced: the shared document is written on every favourite, every
           answer and every minute of practice. Sending each one would be a
           request a second for a document nobody is racing us for. */
        scheduleState();
        break;
      case 'custom':
        enqueue(['PUT', `/me/custom/${enc(detail.id)}`, { exercise: detail.exercise }]);
        break;
      case 'custom-delete':
        enqueue(['DELETE', `/me/custom/${enc(detail.id)}`]);
        break;
    }
  });
}

let stateTimer = null;
function scheduleState() {
  clearTimeout(stateTimer);
  stateTimer = setTimeout(() => {
    enqueue(['PUT', '/me/state', { state: sharedState(), updatedAt: getState().stateUpdated }]);
  }, 1500);
}

/* -------------------------------- the outbox -------------------------------- */
function loadOutbox() {
  try { return JSON.parse(localStorage.getItem(OUTBOX_KEY) ?? '[]'); }
  catch { return []; }
}

function saveOutbox() {
  try { localStorage.setItem(OUTBOX_KEY, JSON.stringify(outbox.slice(-200))); }
  catch { /* private mode, or full */ }
}

function enqueue(call) {
  if (!live) return;
  outbox.push(call);
  saveOutbox();
  flush();
}

let retryTimer = null;
async function flush() {
  if (flushing || !live || !outbox.length) return;
  flushing = true;
  try {
    while (outbox.length) {
      const [method, path, body] = outbox[0];
      const res = await api.request(method, path, body);

      if (res.ok) { outbox.shift(); saveOutbox(); continue; }

      /* 401 means the session ended somewhere else. Nothing queued will ever
         succeed, and pretending otherwise leaves a student thinking their
         work is saved. Stop, clear, and let the page show them as signed out. */
      if (res.status === 401) {
        outbox = []; saveOutbox(); live = false;
        signOut();
        break;
      }
      /* A request the server will never accept is dropped rather than
         retried forever; anything else is the network, so wait and retry. */
      if (res.status >= 400 && res.status < 500) { outbox.shift(); saveOutbox(); continue; }

      clearTimeout(retryTimer);
      retryTimer = setTimeout(flush, 5000);
      break;
    }
  } finally {
    flushing = false;
  }
}

/** Runs this device has that the server has never seen. */
async function pushLocalExtras(remoteProgress) {
  const local = getState().progress ?? {};
  for (const [exerciseId, run] of Object.entries(local)) {
    const remote = remoteProgress[exerciseId];
    for (const [qid, a] of Object.entries(run.answers ?? {})) {
      if (remote?.answers?.[qid] && (remote.answers[qid].at ?? 0) >= (a.at ?? 0)) continue;
      enqueue(['PUT', `/me/answers/${enc(exerciseId)}/${enc(qid)}`,
               { value: a.value, correct: a.correct, revealed: a.revealed }]);
    }
    if (run.seconds && !remote?.seconds) {
      enqueue(['PATCH', `/me/runs/${enc(exerciseId)}`, { addSeconds: run.seconds }]);
    }
  }
  if ((getState().stateUpdated ?? 0) > 0) scheduleState();
}

/* Anything still queued when the tab goes away gets one last chance. */
if (typeof addEventListener === 'function') {
  addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(); });
  addEventListener('online', flush);
}

const enc = encodeURIComponent;
