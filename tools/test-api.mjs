/* The backend, end to end.

   Runs the real server against an in-memory database on an ephemeral port and
   drives it over HTTP the way the browser does — cookies and all. No mocks:
   if this passes, the API works.

     node tools/test-api.mjs
*/

import { createApp } from '../server/index.mjs';

let pass = 0, fail = 0;
const ok = (label, cond, detail) => {
  cond ? pass++ : fail++;
  console.log(`${cond ? '✓' : '✗'} ${label}`);
  if (!cond && detail !== undefined) console.log('   got:', JSON.stringify(detail));
};

const app = createApp({ dbFile: ':memory:', secureCookies: false });
await new Promise(r => app.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${app.address().port}`;

/** A browser-ish client: one cookie jar, JSON in and out. */
function client() {
  let cookie = null;
  return async function call(method, path, body, options = {}) {
    const headers = { ...(options.headers ?? {}) };
    /* Exactly what the browser client does: every mutation declares JSON,
       body or no body. A POST that omits it is refused, by design. */
    if (method !== 'GET' && method !== 'HEAD' && !('Content-Type' in headers)) {
      headers['Content-Type'] = 'application/json';
    }
    if (cookie) headers.Cookie = cookie;

    const res = await fetch(`${BASE}${path}`, {
      method, headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      redirect: 'manual'
    });
    const set = res.headers.get('set-cookie');
    if (set) {
      const value = set.split(';')[0];
      cookie = value.endsWith('=') ? null : value;
    }
    const text = await res.text();
    let json = null;
    try { json = text ? JSON.parse(text) : null; } catch { /* not json */ }
    return { status: res.status, body: json, text, headers: res.headers };
  };
}

const teacher = client();
const student = client();
const intruder = client();
const anon = client();

/* =============================== accounts =============================== */
let r = await anon('GET', '/api/auth/me');
ok('a visitor with no session is nobody, not an error', r.status === 200 && r.body.user === null, r.body);

r = await teacher('POST', '/api/auth/register',
  { email: 'Sam@School.org', password: 'chalkdust7', name: 'Sam Ortega', role: 'teacher' });
ok('a teacher can register', r.status === 201 && r.body.user.role === 'teacher', r.body);
ok('the email is stored folded to lower case', r.body?.user?.email === 'sam@school.org', r.body?.user);
ok('registering sets an HttpOnly SameSite cookie',
  /HttpOnly/i.test(r.headers.get('set-cookie') ?? '') &&
  /SameSite=Lax/i.test(r.headers.get('set-cookie') ?? ''), r.headers.get('set-cookie'));
ok('the password never comes back', !JSON.stringify(r.body).match(/password|hash|salt/i), r.body);

r = await anon('POST', '/api/auth/register',
  { email: 'sam@school.org', password: 'another99', name: 'Impostor' });
ok('a duplicate email is refused', r.status === 409, r.body);

r = await anon('POST', '/api/auth/register', { email: 'weak@school.org', password: 'short', name: 'W' });
ok('a short password is refused with a reason', r.status === 400 && /8 characters/.test(r.body.error), r.body);

r = await anon('POST', '/api/auth/register', { email: 'weak@school.org', password: 'alllettersonly', name: 'W' });
ok('a password with no digit is refused', r.status === 400 && /letter and one number/.test(r.body.error), r.body);

r = await anon('POST', '/api/auth/register', { email: 'not-an-email', password: 'gooddog42', name: 'W' });
ok('a malformed email is refused', r.status === 400, r.body);

r = await student('POST', '/api/auth/register',
  { email: 'ana@school.org', password: 'riverbank3', name: 'Ana Ruiz', role: 'student', grade: 'middle' });
ok('a student can register', r.status === 201 && r.body.user.role === 'student', r.body);
const anaId = r.body.user.id;

r = await anon('POST', '/api/auth/login', { email: 'ana@school.org', password: 'wrongpassword1' });
ok('a wrong password is rejected', r.status === 401, r.body);
r = await anon('POST', '/api/auth/login', { email: 'nobody@school.org', password: 'riverbank3' });
ok('an unknown email gives the same answer as a wrong password',
  r.status === 401 && /do not match an account/.test(r.body.error), r.body);

r = await intruder('POST', '/api/auth/register',
  { email: 'rival@school.org', password: 'otherclass8', name: 'Rival Teacher', role: 'teacher' });
ok('a second teacher can register', r.status === 201, r.body);

/* ============================== cross-site ============================== */
r = await teacher('POST', '/api/classes', { name: 'X' }, { headers: { 'Content-Type': 'text/plain' } });
ok('a mutation that does not declare JSON is refused', r.status === 403, r.body);

r = await teacher('POST', '/api/classes', { name: 'X' }, { headers: { Origin: 'https://evil.example' } });
ok('a mutation from another origin is refused', r.status === 403, r.body);

r = await anon('GET', '/api/nope');
ok('an unknown endpoint is a 404', r.status === 404, r.body);
r = await anon('DELETE', '/api/auth/me');
ok('a known path with the wrong verb is a 405, not a 404', r.status === 405, r.body);

/* ================================ classes ================================ */
r = await student('POST', '/api/classes', { name: 'Not allowed' });
ok('a student account cannot create a class', r.status === 403, r.body);

r = await teacher('POST', '/api/classes',
  { name: 'Grade 8 Science', level: 'Grade 8', grade: 'middle', subject: 'science' });
ok('a teacher can create a class', r.status === 201, r.body);
const cls = r.body.class;
ok('the class gets a join code in XXX-XXX form', /^[A-Z0-9]{3}-[A-Z0-9]{3}$/.test(cls.code), cls.code);

r = await teacher('POST', `/api/classes/${cls.id}/students`, { name: 'Tom Novak' });
ok('a teacher can add a student to the roster by hand', r.status === 201, r.body);

r = await intruder('GET', `/api/classes/${cls.id}/results`);
ok('another teacher cannot read the class', r.status === 403, r.body);
r = await intruder('PATCH', `/api/classes/${cls.id}`, { name: 'Mine now' });
ok('another teacher cannot rename the class', r.status === 403, r.body);
r = await intruder('DELETE', `/api/classes/${cls.id}`);
ok('another teacher cannot delete the class', r.status === 403, r.body);

r = await anon('GET', `/api/classes/lookup/${cls.code}`);
ok('a join code can be looked up before joining', r.status === 200 && r.body.class.name === 'Grade 8 Science', r.body);
ok('the lookup does not leak the roster', r.body?.class?.students === undefined, r.body?.class);

r = await anon('POST', '/api/classes/join', { code: cls.code });
ok('joining requires an account', r.status === 401, r.body);

r = await student('POST', '/api/classes/join', { code: cls.code.toLowerCase().replace('-', '') });
ok('a student joins with the code, however it is typed', r.status === 201, r.body);
r = await student('POST', '/api/classes/join', { code: cls.code });
ok('joining twice is refused rather than duplicated', r.status === 409, r.body);

r = await teacher('GET', '/api/classes');
const roster = r.body.classes[0].students;
ok('the student appears on the teacher’s roster',
  roster.some(s => s.userId === anaId && s.source === 'joined'), roster);
ok('the hand-added student is still there', roster.some(s => s.name === 'Tom Novak'), roster);

/* A teacher who writes a name onto the roster first should not end up with
   two rows for the same person once that person joins. */
r = await teacher('POST', `/api/classes/${cls.id}/students`, { name: 'Priya Shah' });
const priya = client();
await priya('POST', '/api/auth/register',
  { email: 'priya@school.org', password: 'notebook5', name: 'Priya Shah' });
await priya('POST', '/api/classes/join', { code: cls.code });
r = await teacher('GET', '/api/classes');
const priyas = r.body.classes[0].students.filter(s => s.name === 'Priya Shah');
ok('a student who was on the roster already claims that row, not a second one',
  priyas.length === 1 && priyas[0].source === 'joined', priyas);

/* ============================== assignments ============================== */
r = await teacher('POST', '/api/assignments',
  { classId: cls.id, title: 'Cells homework', worksheetIds: ['gen-biology-1', 'gen-biology-2'], due: '2026-10-01' });
ok('a teacher can set an assignment of several worksheets',
  r.status === 201 && r.body.assignment.worksheetIds.length === 2, r.body);
const assignment = r.body.assignment;

r = await intruder('POST', '/api/assignments', { classId: cls.id, title: 'Nope', worksheetIds: ['x'] });
ok('another teacher cannot set work to this class', r.status === 403, r.body);

r = await teacher('POST', '/api/assignments', { classId: cls.id, title: 'Empty', worksheetIds: [] });
ok('an assignment with no worksheets is refused', r.status === 400, r.body);

r = await student('GET', '/api/me/classes');
ok('the student sees the class they joined', r.body.enrolments.length === 1, r.body.enrolments);
ok('the student sees the work that was set',
  r.body.assignments.some(a => a.id === assignment.id), r.body.assignments);
ok('the assignment carries its class', r.body.assignments[0].class?.className === 'Grade 8 Science', r.body.assignments[0]);

r = await anon('GET', `/api/assignments/code/${assignment.code}`);
ok('an assignment can be opened by its code', r.status === 200 && r.body.assignment.title === 'Cells homework', r.body);

/* ========================= answers, runs, scores ========================= */
r = await student('PUT', '/api/me/answers/gen-biology-1/q1', { value: 2, correct: true });
ok('an answer saves', r.status === 200 && r.body.attempts === 1, r.body);
r = await student('PUT', '/api/me/answers/gen-biology-1/q1', { value: 3, correct: false });
ok('answering again counts a second attempt', r.body.attempts === 2, r.body);
r = await student('PUT', '/api/me/answers/gen-biology-1/q2', { value: 'mitosis', correct: false, revealed: true });
ok('a revealed answer is recorded as revealed', r.body.revealed === true, r.body);
r = await student('PUT', '/api/me/answers/gen-biology-1/q2', { value: 'mitosis', correct: true });
ok('a hint once taken stays taken', r.body.revealed === true, r.body);

r = await student('PATCH', '/api/me/runs/gen-biology-1', { addSeconds: 90, flags: ['q3'] });
ok('practice time accumulates on the run', r.body.run.seconds === 90, r.body.run);
ok('flags are kept on the run', r.body.run.flags[0] === 'q3', r.body.run);
r = await student('PATCH', '/api/me/runs/gen-biology-1', { addSeconds: 30 });
ok('more time adds rather than replaces', r.body.run.seconds === 120, r.body.run);

r = await anon('PUT', '/api/me/answers/gen-biology-1/q1', { value: 1, correct: true });
ok('a signed-out visitor cannot write answers', r.status === 401, r.body);

r = await student('POST', '/api/me/scores', {
  exerciseId: 'gen-biology-1', correct: 8, total: 10, seconds: 120,
  answers: { q1: { correct: false }, q2: { correct: true } }
});
ok('finishing a worksheet records a score', r.status === 201 && r.body.score.percent === 80, r.body);
ok('the score is filed against the assignment that set it',
  r.body.submittedTo.includes(assignment.id), r.body);

r = await student('GET', '/api/me/data');
ok('one call returns the whole account', r.status === 200, r.body?.error);
ok('the run came back with its answers', Object.keys(r.body.progress['gen-biology-1'].answers).length === 2,
  r.body.progress['gen-biology-1']);
ok('the run is marked complete', Boolean(r.body.progress['gen-biology-1'].completedAt), r.body.progress['gen-biology-1']);
ok('the answer value round-trips as the type it was', r.body.progress['gen-biology-1'].answers.q2.value === 'mitosis',
  r.body.progress['gen-biology-1'].answers.q2);
ok('the score history is there', r.body.scores[0].percent === 80, r.body.scores);

/* =============================== the grid =============================== */
r = await teacher('GET', `/api/classes/${cls.id}/results`);
ok('the teacher sees the submission, from a different session', r.status === 200 && r.body.submissions.length === 1, r.body);
const sub = r.body.submissions[0];
ok('the submission names the student', sub.studentName === 'Ana Ruiz', sub);
ok('the submission carries its percentage', sub.percent === 80, sub);
ok('the per-question detail survives', sub.answers?.q2?.correct === true, sub.answers);

/* Redoing the worksheet updates the submission rather than adding a second. */
await student('POST', '/api/me/scores', { exerciseId: 'gen-biology-1', correct: 10, total: 10, seconds: 60 });
r = await teacher('GET', `/api/classes/${cls.id}/results`);
ok('a second attempt replaces the submission rather than duplicating it', r.body.submissions.length === 1, r.body.submissions);
ok('the replacement carries the new mark', r.body.submissions[0].percent === 100, r.body.submissions[0]);

r = await student('GET', '/api/me/classes');
ok('the student can see what they have handed in', r.body.submissions.length === 1, r.body.submissions);

/* Work done for no assignment is still saved, and files nothing. */
r = await student('POST', '/api/me/scores', { exerciseId: 'gen-history-9', correct: 5, total: 5 });
ok('unassigned practice still records a score', r.status === 201, r.body);
ok('unassigned practice is filed against nothing', r.body.submittedTo.length === 0, r.body);

/* ============================= the state doc ============================= */
r = await student('PUT', '/api/me/state', { state: { theme: 'dark', favorites: ['a-1'] }, updatedAt: 2000 });
ok('the personal state document saves', r.status === 200 && r.body.ok, r.body);
r = await student('PUT', '/api/me/state', { state: { theme: 'light' }, updatedAt: 1000 });
ok('an older copy does not overwrite a newer one', r.body.stale === true, r.body);
ok('the newer copy is handed back instead', r.body.state.theme === 'dark', r.body.state);
r = await student('GET', '/api/me/data');
ok('the state survives', r.body.state.theme === 'dark' && r.body.state.favorites[0] === 'a-1', r.body.state);

r = await student('PUT', '/api/me/state', { state: 'not an object' });
ok('a state document that is not an object is refused', r.status === 400, r.body);

/* ============================== leaving, out ============================== */
r = await student('DELETE', `/api/classes/join/${cls.code}`);
ok('a student can leave a class', r.status === 200, r.body);
r = await student('GET', '/api/me/classes');
ok('the class is gone from their list', r.body.enrolments.length === 0, r.body.enrolments);

r = await student('POST', '/api/auth/logout');
ok('signing out clears the cookie', r.status === 200, r.body);
r = await student('GET', '/api/auth/me');
ok('the session is dead afterwards', r.body.user === null, r.body);
r = await student('GET', '/api/me/data');
ok('and the data behind it is no longer readable', r.status === 401, r.body);

/* A deleted class takes its assignments and submissions with it. */
r = await teacher('DELETE', `/api/classes/${cls.id}`);
ok('a teacher can delete their class', r.status === 200, r.body);
r = await teacher('GET', '/api/classes');
ok('the class and its assignments are gone',
  r.body.classes.length === 0 && r.body.assignments.length === 0, r.body);
const leftovers = app.db.prepare('SELECT COUNT(*) AS n FROM submissions').get().n;
ok('the submissions cascade away with it', leftovers === 0, leftovers);

/* ------------------------------ erasing it all ------------------------------ */
const quitter = client();
await quitter('POST', '/api/auth/register',
  { email: 'quitter@school.org', password: 'goodbye77', name: 'Quitter', role: 'teacher' });
await quitter('POST', '/api/me/scores', { exerciseId: 'gen-x-1', correct: 3, total: 4 });
await quitter('PUT', '/api/me/state', { state: { theme: 'dark' }, updatedAt: Date.now() });
r = await quitter('POST', '/api/classes', { name: 'Doomed class', level: 'Grade 7' });
const doomed = r.body.class.id;
await quitter('POST', '/api/assignments', { classId: doomed, title: 'Doomed work', worksheetIds: ['gen-x-1'] });

r = await quitter('DELETE', '/api/me/data');
ok('a person can erase everything they have', r.status === 200, r.body);
r = await quitter('GET', '/api/me/data');
ok('the progress is gone', Object.keys(r.body.progress).length === 0, r.body.progress);
ok('the scores are gone', r.body.scores.length === 0, r.body.scores);
ok('the state document is gone', Object.keys(r.body.state).length === 0, r.body.state);
r = await quitter('GET', '/api/classes');
ok('their classes and assignments are gone',
  r.body.classes.length === 0 && r.body.assignments.length === 0, r.body);
r = await quitter('GET', '/api/auth/me');
ok('but the account itself is still there', r.body.user?.email === 'quitter@school.org', r.body);

/* ------------------------------ rate limits ------------------------------ */
/* Ten wrong passwords in a row locks the account for a while. Checked here
   because a login form with no limit is an offline password cracker with a
   network round trip. */
const target = client();
await target('POST', '/api/auth/register',
  { email: 'locked@school.org', password: 'seashell4', name: 'Locked Out' });
let limited = null;
for (let i = 0; i < 12; i++) {
  const attempt = await anon('POST', '/api/auth/login',
    { email: 'locked@school.org', password: `wrongone${i}` });
  if (attempt.status === 429) { limited = i; break; }
}
ok('repeated wrong passwords are rate limited', limited !== null && limited <= 11, limited);
r = await anon('POST', '/api/auth/login', { email: 'locked@school.org', password: 'seashell4' });
ok('and the right password is refused while the limit holds', r.status === 429, r.status);

/* ------------------------------ static site ------------------------------ */
const page = await fetch(`${BASE}/library.html`);
ok('the site is served from the same origin as the API', page.status === 200, page.status);
const missing = await fetch(`${BASE}/no-such-page.html`);
ok('a missing page gets the site’s own 404', missing.status === 404, missing.status);
const escape = await fetch(`${BASE}/../../etc/passwd`);
ok('path traversal does not escape the site root', escape.status === 404 || escape.status === 403, escape.status);

await new Promise(r2 => app.close(r2));
console.log(`\n${pass} passed, ${fail} failed.`);
process.exit(fail ? 1 : 0);
