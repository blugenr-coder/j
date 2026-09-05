/* Accounts, passwords and sessions.

   Three decisions worth stating, because each of them is the difference
   between an authentication system and the appearance of one:

   - Passwords are hashed with scrypt and a per-user salt. scrypt is
     deliberately slow and memory-hard, so a stolen table cannot be run
     through a dictionary at speed. Comparison is timing-safe.
   - The session cookie holds a random token; the database holds only its
     SHA-256. Someone who reads the database cannot log in as anybody.
   - The cookie is HttpOnly and SameSite=Lax, so page JavaScript can never
     read it and another site cannot make the browser send it on a POST.
*/

import { randomBytes, scrypt, timingSafeEqual, createHash } from 'node:crypto';
import { promisify } from 'node:util';
import { newId } from './db.mjs';

const scryptAsync = promisify(scrypt);

/* Cost parameters. N is the work factor; 2^15 keeps a single hash around a
   tenth of a second on ordinary hardware, which is slow for an attacker with
   a wordlist and unnoticeable to somebody signing in. */
const SCRYPT = { N: 32768, r: 8, p: 1, keylen: 64, maxmem: 64 * 1024 * 1024 };
const SESSION_DAYS = 30;
export const COOKIE = 'wh_session';

/* ------------------------------- passwords ------------------------------- */
export async function hashPassword(password) {
  const salt = randomBytes(32);
  const hash = await scryptAsync(password.normalize('NFKC'), salt, SCRYPT.keylen, SCRYPT);
  return { hash, salt };
}

export async function verifyPassword(password, hash, salt) {
  const candidate = await scryptAsync(password.normalize('NFKC'), salt, SCRYPT.keylen, SCRYPT);
  const stored = Buffer.from(hash);
  /* timingSafeEqual throws on a length mismatch, which would itself leak. */
  if (candidate.length !== stored.length) return false;
  return timingSafeEqual(candidate, stored);
}

/** What a password has to clear. Short rules, stated to the user verbatim. */
export function passwordProblem(password) {
  if (typeof password !== 'string' || password.length < 8) {
    return 'Use at least 8 characters.';
  }
  if (password.length > 200) return 'That password is too long.';
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return 'Include at least one letter and one number.';
  }
  return null;
}

export function emailProblem(email) {
  if (typeof email !== 'string') return 'Enter an email address.';
  const clean = email.trim();
  if (clean.length < 3 || clean.length > 254) return 'Enter an email address.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) return 'That does not look like an email address.';
  return null;
}

export const normaliseEmail = email => String(email).trim().toLowerCase();

/* -------------------------------- sessions -------------------------------- */
const sha256 = value => createHash('sha256').update(value).digest('hex');

export function createSession(db, userId, userAgent = null) {
  const token = randomBytes(32).toString('base64url');
  const now = Date.now();
  db.prepare(`INSERT INTO sessions (token_hash, user_id, created_at, expires_at, user_agent)
              VALUES (?, ?, ?, ?, ?)`)
    .run(sha256(token), userId, now, now + SESSION_DAYS * 86400_000, userAgent);
  return { token, expires: now + SESSION_DAYS * 86400_000 };
}

export function userForToken(db, token) {
  if (!token) return null;
  const row = db.prepare(
    `SELECT u.id, u.email, u.name, u.role, u.grade, u.created_at, s.expires_at
       FROM sessions s JOIN users u ON u.id = s.user_id
      WHERE s.token_hash = ?`).get(sha256(token));
  if (!row) return null;
  if (row.expires_at < Date.now()) {
    db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(sha256(token));
    return null;
  }
  return publicUser(row);
}

export function destroySession(db, token) {
  if (token) db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(sha256(token));
}

export function pruneSessions(db) {
  db.prepare('DELETE FROM sessions WHERE expires_at < ?').run(Date.now());
}

/* --------------------------------- users --------------------------------- */
export async function createUser(db, { email, password, name, role = 'student', grade = 'middle' }) {
  const { hash, salt } = await hashPassword(password);
  const id = newId('u');
  const now = Date.now();
  db.prepare(`INSERT INTO users (id, email, name, role, grade, password_hash, password_salt, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(id, normaliseEmail(email), name.trim(), role, grade, hash, salt, now);
  return publicUser({ id, email: normaliseEmail(email), name: name.trim(), role, grade, created_at: now });
}

export function findUserByEmail(db, email) {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(normaliseEmail(email)) ?? null;
}

/** The shape the browser is allowed to see. No hash, no salt, ever. */
export function publicUser(row) {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    grade: row.grade ?? null,
    since: row.created_at,
    initials: initialsOf(row.name)
  };
}

const initialsOf = name => (name || 'S').trim().split(/\s+/)
  .map(w => w[0]).slice(0, 2).join('').toUpperCase();

/* ------------------------------ rate limiting ------------------------------
   Without this, a login form is an offline password cracker with a network
   round trip. Counted per email and per address, so neither one account nor
   one attacker can be hammered. Held in memory: a restart forgives, which is
   an acceptable trade for a dependency-free server. */
const attempts = new Map();
const WINDOW = 15 * 60_000;
const MAX_ATTEMPTS = 10;

/* Registration gets its own, far more generous, allowance. A school signs a
   class of thirty up in one lesson from a single public address, and a limit
   tuned for password guessing would lock out the twenty-first student. */
export const REGISTER_LIMIT = { max: 40, window: 60 * 60_000 };

export function tooManyAttempts(key, { max = MAX_ATTEMPTS, window = WINDOW } = {}) {
  const now = Date.now();
  const rec = attempts.get(key);
  if (!rec || now - rec.first > window) return false;
  return rec.count >= max;
}

/* Success clears the counter. That means somebody who holds one valid account
   can reset their own address counter between guesses — but the per-email
   counter is the one protecting the account being guessed at, and that is not
   cleared by signing in as somebody else. */
export function noteAttempt(key, ok, { window = WINDOW } = {}) {
  const now = Date.now();
  if (ok) { attempts.delete(key); return; }
  const rec = attempts.get(key);
  if (!rec || now - rec.first > window) attempts.set(key, { first: now, count: 1 });
  else rec.count++;
  /* Keep the map from growing without bound on a long-running process. */
  if (attempts.size > 5000) {
    for (const [k, v] of attempts) if (now - v.first > REGISTER_LIMIT.window) attempts.delete(k);
  }
}

/* --------------------------------- cookies --------------------------------- */
export function cookieHeader(token, { secure, maxAge }) {
  const parts = [
    `${COOKIE}=${token}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${maxAge}`
  ];
  if (secure) parts.push('Secure');
  return parts.join('; ');
}

export const clearCookieHeader = ({ secure }) =>
  cookieHeader('', { secure, maxAge: 0 });

export function readCookie(header, name) {
  if (!header) return null;
  for (const part of header.split(';')) {
    const eq = part.indexOf('=');
    if (eq < 0) continue;
    if (part.slice(0, eq).trim() === name) return part.slice(eq + 1).trim();
  }
  return null;
}
