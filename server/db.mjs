/* The database.

   SQLite through Node's own `node:sqlite`, so the backend keeps the promise
   the rest of this project makes: no runtime dependencies. One file on disk,
   no server to install, and the same schema in development, in tests and in
   production.

   Everything a teacher needs to query across people — runs, answers, scores,
   rosters, assignments, submissions — is a real table with real columns. The
   handful of things nobody queries across users (theme, favourites, the
   activity feed) live in one JSON document per user, because giving them
   tables would buy nothing.
*/

import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

/* Bumped whenever the schema below changes. `migrate()` walks from whatever
   version the file is at up to this one, so an existing database is never
   rebuilt from scratch and never silently left behind. */
const SCHEMA_VERSION = 1;

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  role          TEXT NOT NULL CHECK (role IN ('student', 'teacher')),
  grade         TEXT,
  password_hash BLOB NOT NULL,
  password_salt BLOB NOT NULL,
  created_at    INTEGER NOT NULL
);

/* Sessions hold a hash of the token, never the token. A stolen database read
   cannot be replayed as a login. */
CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  user_agent TEXT
);
CREATE INDEX IF NOT EXISTS sessions_user ON sessions(user_id);

/* The personal blob: theme, favourites, achievements, day totals, activity.
   Read and written whole, by one person, and never joined against. */
CREATE TABLE IF NOT EXISTS user_state (
  user_id    TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  doc        TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

/* One row per worksheet a person has opened. */
CREATE TABLE IF NOT EXISTS runs (
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exercise_id  TEXT NOT NULL,
  started      INTEGER NOT NULL,
  updated      INTEGER NOT NULL,
  completed_at INTEGER,
  seconds      INTEGER NOT NULL DEFAULT 0,
  flags        TEXT NOT NULL DEFAULT '[]',
  PRIMARY KEY (user_id, exercise_id)
);
CREATE INDEX IF NOT EXISTS runs_updated ON runs(user_id, updated DESC);

/* One row per question answered. The value is stored as JSON because an
   answer can be a number, a string, or a list of chosen options. */
CREATE TABLE IF NOT EXISTS answers (
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exercise_id TEXT NOT NULL,
  qid         TEXT NOT NULL,
  value       TEXT,
  correct     INTEGER NOT NULL DEFAULT 0,
  revealed    INTEGER NOT NULL DEFAULT 0,
  attempts    INTEGER NOT NULL DEFAULT 1,
  at          INTEGER NOT NULL,
  PRIMARY KEY (user_id, exercise_id, qid)
);

/* A score is the snapshot taken when a run is finished. Kept as history:
   finishing the same worksheet twice records two scores. */
CREATE TABLE IF NOT EXISTS scores (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exercise_id TEXT NOT NULL,
  correct     INTEGER NOT NULL,
  total       INTEGER NOT NULL,
  percent     INTEGER NOT NULL,
  seconds     INTEGER NOT NULL DEFAULT 0,
  at          INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS scores_user ON scores(user_id, at DESC);
CREATE INDEX IF NOT EXISTS scores_exercise ON scores(exercise_id);

CREATE TABLE IF NOT EXISTS classes (
  id         TEXT PRIMARY KEY,
  teacher_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  level      TEXT,
  grade      TEXT,
  subject    TEXT,
  code       TEXT NOT NULL UNIQUE,
  created    INTEGER NOT NULL,
  archived   INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS classes_teacher ON classes(teacher_id);

/* A roster entry. user_id is null for a student the teacher typed in by
   hand and who has not joined with the code yet; when they do join, the row
   is claimed rather than duplicated. */
CREATE TABLE IF NOT EXISTS class_students (
  id        TEXT PRIMARY KEY,
  class_id  TEXT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  user_id   TEXT REFERENCES users(id) ON DELETE SET NULL,
  name      TEXT NOT NULL,
  source    TEXT NOT NULL DEFAULT 'added',
  joined_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS class_students_class ON class_students(class_id);
CREATE UNIQUE INDEX IF NOT EXISTS class_students_member
  ON class_students(class_id, user_id) WHERE user_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS assignments (
  id           TEXT PRIMARY KEY,
  class_id     TEXT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  code         TEXT NOT NULL UNIQUE,
  title        TEXT NOT NULL,
  worksheet_ids TEXT NOT NULL,
  due          TEXT,
  note         TEXT,
  created      INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS assignments_class ON assignments(class_id);

/* What a student handed in for one worksheet of one assignment. The per
   question detail is kept so the teacher's question-level view is real. */
CREATE TABLE IF NOT EXISTS submissions (
  assignment_id TEXT NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exercise_id   TEXT NOT NULL,
  correct       INTEGER NOT NULL,
  total         INTEGER NOT NULL,
  percent       INTEGER NOT NULL,
  answers       TEXT NOT NULL DEFAULT '{}',
  at            INTEGER NOT NULL,
  PRIMARY KEY (assignment_id, user_id, exercise_id)
);
CREATE INDEX IF NOT EXISTS submissions_assignment ON submissions(assignment_id);

/* Worksheets a teacher wrote in the builder, shared with their classes. */
CREATE TABLE IF NOT EXISTS custom_exercises (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  doc        TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS custom_user ON custom_exercises(user_id);
`;

/**
 * Open the database, creating and migrating it as needed.
 * @param {string} file  path, or ':memory:' for a throwaway database in tests
 */
export function openDatabase(file) {
  if (file !== ':memory:') mkdirSync(dirname(file), { recursive: true });
  const db = new DatabaseSync(file);

  /* WAL lets readers run while a write is in flight, which is what keeps a
     class of thirty submitting at once from serialising into a queue.
     Foreign keys are off by default in SQLite; every ON DELETE CASCADE above
     depends on them being on. */
  db.exec('PRAGMA journal_mode = WAL');
  db.exec('PRAGMA foreign_keys = ON');
  db.exec('PRAGMA busy_timeout = 5000');

  db.exec(SCHEMA);
  migrate(db);
  return db;
}

function migrate(db) {
  const at = db.prepare('PRAGMA user_version').get().user_version ?? 0;
  if (at === SCHEMA_VERSION) return;
  /* Version 0 means a database that has just been created from SCHEMA above,
     so there is nothing to move. Later versions add their steps here. */
  db.exec(`PRAGMA user_version = ${SCHEMA_VERSION}`);
}

/** A short, sortable, collision-resistant id. */
export function newId(prefix) {
  const time = Date.now().toString(36);
  const rand = Math.floor(Math.random() * 0xffffff).toString(36).padStart(5, '0');
  return `${prefix}-${time}${rand}`;
}
