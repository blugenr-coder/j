/* The API client.

   One rule shapes this file: the site must still work with no backend behind
   it. It was a folder of static files for its whole life, the tests run it
   that way, and somebody opening index.html from a disk should still get a
   working library. So the client probes once for a server, remembers the
   answer, and every call returns a plain result the caller can ignore.

   Nothing here throws at a page. A failed write is reported, queued and
   retried; it never takes the interface down with it. */

const BASE = '/api';
let probed = null;          // Promise<boolean>, resolved once per page load
let online = false;

/** Is a backend answering? Probed once; every later caller gets the answer. */
export function backendAvailable() {
  probed ??= (async () => {
    try {
      const res = await fetch(`${BASE}/auth/me`, { credentials: 'same-origin' });
      online = res.ok;
      return online;
    } catch {
      online = false;
      return false;
    }
  })();
  return probed;
}

export const isOnline = () => online;

/**
 * One request.
 * @returns {Promise<{ok: boolean, status: number, data: object|null, error: string|null}>}
 *          Never rejects. A caller that wants to know checks `ok`.
 */
export async function request(method, path, body) {
  if (!await backendAvailable()) {
    return { ok: false, status: 0, data: null, error: 'offline' };
  }
  try {
    const headers = {};
    /* Every mutation declares JSON, body or no body: the server refuses a
       POST that does not, because a POST without it can be forged from
       another site without the browser ever asking permission. */
    if (method !== 'GET') headers['Content-Type'] = 'application/json';

    const res = await fetch(`${BASE}${path}`, {
      method, headers,
      credentials: 'same-origin',
      body: body === undefined ? undefined : JSON.stringify(body)
    });

    let data = null;
    const text = await res.text();
    if (text) { try { data = JSON.parse(text); } catch { /* not json */ } }

    return {
      ok: res.ok,
      status: res.status,
      data,
      error: res.ok ? null : (data?.error ?? `Request failed (${res.status})`)
    };
  } catch {
    /* The network went away mid-request. Not an application error. */
    online = false;
    return { ok: false, status: 0, data: null, error: 'offline' };
  }
}

export const get    = (path)       => request('GET', path);
export const post   = (path, body) => request('POST', path, body);
export const put    = (path, body) => request('PUT', path, body);
export const patch  = (path, body) => request('PATCH', path, body);
export const del    = (path)       => request('DELETE', path);

/* --------------------------------- auth --------------------------------- */
export const whoami       = ()     => get('/auth/me');
export const login        = (b)    => post('/auth/login', b);
export const registerUser = (b)    => post('/auth/register', b);
export const logout       = ()     => post('/auth/logout');
export const updateMe     = (b)    => patch('/auth/me', b);

/* ------------------------------ my own work ------------------------------ */
export const myData    = ()                    => get('/me/data');
export const putState  = (state, updatedAt)    => put('/me/state', { state, updatedAt });
export const putAnswer = (ex, qid, body)       => put(`/me/answers/${enc(ex)}/${enc(qid)}`, body);
export const dropAnswer = (ex, qid)            => del(`/me/answers/${enc(ex)}/${enc(qid)}`);
export const patchRun  = (ex, body)            => patch(`/me/runs/${enc(ex)}`, body);
export const postScore = (body)                => post('/me/scores', body);
export const eraseMyData = ()                  => del('/me/data');
export const putCustom = (id, exercise)        => put(`/me/custom/${enc(id)}`, { exercise });
export const dropCustom = (id)                 => del(`/me/custom/${enc(id)}`);

/* ----------------------------- classes, work ----------------------------- */
export const myClasses     = ()          => get('/me/classes');
export const teacherClasses = ()         => get('/classes');
export const createClassApi = (b)        => post('/classes', b);
export const patchClassApi  = (id, b)    => patch(`/classes/${enc(id)}`, b);
export const deleteClassApi = (id)       => del(`/classes/${enc(id)}`);
export const addStudentApi  = (id, name) => post(`/classes/${enc(id)}/students`, { name });
export const removeStudentApi = (id, sid) => del(`/classes/${enc(id)}/students/${enc(sid)}`);
export const lookupClass    = (code)     => get(`/classes/lookup/${enc(code)}`);
export const joinClassApi   = (code, name) => post('/classes/join', { code, name });
export const leaveClassApi  = (code)     => del(`/classes/join/${enc(code)}`);
export const classResultsApi = (id)      => get(`/classes/${enc(id)}/results`);
export const createAssignmentApi = (b)   => post('/assignments', b);
export const deleteAssignmentApi = (id)  => del(`/assignments/${enc(id)}`);
export const assignmentByCode = (code)   => get(`/assignments/code/${enc(code)}`);

const enc = encodeURIComponent;
