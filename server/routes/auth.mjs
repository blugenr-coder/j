/* Register, sign in, sign out, and "who am I".

   The one rule that shapes all of it: a failed sign-in says the same thing
   whether the email is unknown or the password is wrong. Distinguishing them
   turns the login form into a way of discovering who has an account here. */

import {
  createUser, findUserByEmail, verifyPassword, createSession, destroySession,
  publicUser, passwordProblem, emailProblem, normaliseEmail,
  tooManyAttempts, noteAttempt, REGISTER_LIMIT, cookieHeader, clearCookieHeader
} from '../auth.mjs';
import { readJson, json, badRequest, unauthorised, conflict, HttpError } from '../http.mjs';

const ROLES = new Set(['student', 'teacher']);
const GRADES = new Set(['early', 'elementary', 'middle', 'high', 'advanced']);
const SESSION_SECONDS = 30 * 86400;

export function register(router) {
  router.post('/api/auth/register', async ctx => {
    /* Registration is rate limited too. Without it, one script fills the
       users table overnight and every one of those rows costs a scrypt hash
       on the way in. */
    const address = ctx.address;
    if (tooManyAttempts(`register:${address}`, REGISTER_LIMIT)) {
      throw new HttpError(429, 'Too many accounts created from here. Try again later.');
    }
    noteAttempt(`register:${address}`, false, REGISTER_LIMIT);

    const body = await readJson(ctx.req);
    const name = String(body.name ?? '').trim();
    if (name.length < 1 || name.length > 80) throw badRequest('Enter your name.');

    const emailIssue = emailProblem(body.email);
    if (emailIssue) throw badRequest(emailIssue, { field: 'email' });

    const passwordIssue = passwordProblem(body.password);
    if (passwordIssue) throw badRequest(passwordIssue, { field: 'password' });

    const role = ROLES.has(body.role) ? body.role : 'student';
    const grade = GRADES.has(body.grade) ? body.grade : 'middle';

    if (findUserByEmail(ctx.db, body.email)) {
      throw conflict('There is already an account with that email. Sign in instead.');
    }

    const user = await createUser(ctx.db, { email: body.email, password: body.password, name, role, grade });
    const { token } = createSession(ctx.db, user.id, ctx.req.headers['user-agent'] ?? null);
    json(ctx.res, 201, { user }, {
      'Set-Cookie': cookieHeader(token, { secure: ctx.secure, maxAge: SESSION_SECONDS })
    });
  });

  router.post('/api/auth/login', async ctx => {
    const body = await readJson(ctx.req);
    const email = normaliseEmail(body.email ?? '');
    const address = ctx.address;

    /* Counted twice: once for the account being attacked, once for whoever is
       doing the attacking. Either limit alone leaves the other route open. */
    if (tooManyAttempts(`email:${email}`) || tooManyAttempts(`ip:${address}`)) {
      throw new HttpError(429, 'Too many sign-in attempts. Wait a few minutes and try again.');
    }

    const row = findUserByEmail(ctx.db, email);
    const ok = row
      ? await verifyPassword(String(body.password ?? ''), row.password_hash, row.password_salt)
      /* Still spend the time when the email is unknown, so the response time
         does not answer the question the error message refuses to. */
      : await verifyPassword(String(body.password ?? ''), Buffer.alloc(64), Buffer.alloc(32));

    noteAttempt(`email:${email}`, ok);
    noteAttempt(`ip:${address}`, ok);

    if (!row || !ok) throw unauthorised('That email and password do not match an account.');

    const { token } = createSession(ctx.db, row.id, ctx.req.headers['user-agent'] ?? null);
    json(ctx.res, 200, { user: publicUser(row) }, {
      'Set-Cookie': cookieHeader(token, { secure: ctx.secure, maxAge: SESSION_SECONDS })
    });
  });

  router.post('/api/auth/logout', async ctx => {
    destroySession(ctx.db, ctx.token);
    json(ctx.res, 200, { ok: true }, { 'Set-Cookie': clearCookieHeader({ secure: ctx.secure }) });
  });

  /* The call every page makes on load. It answers with the user or with null,
     never with a 401 — "nobody is signed in" is a normal state here, not an
     error, and treating it as one fills the console with red on every visit. */
  router.get('/api/auth/me', async ctx => {
    json(ctx.res, 200, { user: ctx.user ?? null });
  });

  router.patch('/api/auth/me', async ctx => {
    if (!ctx.user) throw unauthorised();
    const body = await readJson(ctx.req);
    const patch = {};
    if (body.name !== undefined) {
      const name = String(body.name).trim();
      if (!name || name.length > 80) throw badRequest('Enter your name.');
      patch.name = name;
    }
    if (body.grade !== undefined) {
      if (!GRADES.has(body.grade)) throw badRequest('That is not a grade band.');
      patch.grade = body.grade;
    }
    if (body.role !== undefined) {
      if (!ROLES.has(body.role)) throw badRequest('That is not a role.');
      patch.role = body.role;
    }
    if (!Object.keys(patch).length) throw badRequest('Nothing to change.');

    const sets = Object.keys(patch).map(k => `${k} = ?`).join(', ');
    ctx.db.prepare(`UPDATE users SET ${sets} WHERE id = ?`)
      .run(...Object.values(patch), ctx.user.id);

    const row = ctx.db.prepare('SELECT * FROM users WHERE id = ?').get(ctx.user.id);
    json(ctx.res, 200, { user: publicUser(row) });
  });
}
