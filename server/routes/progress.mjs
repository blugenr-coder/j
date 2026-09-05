/* Saved answers, run progress, scores, and the personal state document.

   The shapes here mirror what the browser already keeps in localStorage, so
   the client can hand over what it has and get back something it can merge
   without translating. Where they differ is that answers and scores are rows,
   not a blob: a teacher's question-level view has to be able to ask which
   students got question 7 wrong, and a JSON document cannot answer that. */

import { readJson, json, badRequest, unauthorised, forbidden, notFound } from '../http.mjs';

const MAX_ID = 200;
const clampInt = (v, lo, hi, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(hi, Math.max(lo, Math.round(n))) : fallback;
};

const exerciseId = v => {
  const id = String(v ?? '').trim();
  if (!id || id.length > MAX_ID) throw badRequest('That is not a worksheet id.');
  return id;
};

/** A run row, in the shape the client's own progress record uses. */
function runOut(row, answers) {
  return {
    started: row.started,
    updated: row.updated,
    completedAt: row.completed_at,
    seconds: row.seconds,
    flags: JSON.parse(row.flags || '[]'),
    answers
  };
}

function answersFor(db, userId, ids) {
  if (!ids.length) return {};
  const marks = ids.map(() => '?').join(',');
  const rows = db.prepare(
    `SELECT exercise_id, qid, value, correct, revealed, attempts, at
       FROM answers WHERE user_id = ? AND exercise_id IN (${marks})`).all(userId, ...ids);
  const out = {};
  for (const r of rows) {
    (out[r.exercise_id] ??= {})[r.qid] = {
      value: r.value === null ? null : JSON.parse(r.value),
      correct: Boolean(r.correct),
      revealed: Boolean(r.revealed),
      attempts: r.attempts,
      at: r.at
    };
  }
  return out;
}

export function register(router) {
  /* ------------------------------ everything ------------------------------
     One call on sign-in that returns the whole account: the personal
     document, every run with its answers, and the score history. A page load
     should cost one round trip, not one per worksheet ever opened. */
  router.get('/api/me/data', async ctx => {
    if (!ctx.user) throw unauthorised();
    const uid = ctx.user.id;

    const stateRow = ctx.db.prepare('SELECT doc, updated_at FROM user_state WHERE user_id = ?').get(uid);
    const runRows = ctx.db.prepare('SELECT * FROM runs WHERE user_id = ? ORDER BY updated DESC').all(uid);
    const answers = answersFor(ctx.db, uid, runRows.map(r => r.exercise_id));

    const progress = {};
    for (const row of runRows) {
      progress[row.exercise_id] = runOut(row, answers[row.exercise_id] ?? {});
    }

    const scores = ctx.db.prepare(
      `SELECT exercise_id, correct, total, percent, seconds, at
         FROM scores WHERE user_id = ? ORDER BY at DESC LIMIT 500`).all(uid);

    const custom = ctx.db.prepare(
      'SELECT doc FROM custom_exercises WHERE user_id = ?').all(uid)
      .map(r => JSON.parse(r.doc));

    json(ctx.res, 200, {
      user: ctx.user,
      state: stateRow ? JSON.parse(stateRow.doc) : {},
      stateUpdated: stateRow?.updated_at ?? 0,
      progress,
      scores,
      customExercises: custom
    });
  });

  /* --------------------------- the personal blob ---------------------------
     Theme, favourites, achievements, day totals, the activity feed. Written
     whole. `updatedAt` is the client's own timestamp: a stale tab that has
     been open for an hour must not be able to overwrite what a phone saved
     five minutes ago. */
  router.put('/api/me/state', async ctx => {
    if (!ctx.user) throw unauthorised();
    const body = await readJson(ctx.req);
    const doc = body.state ?? body.doc;
    if (!doc || typeof doc !== 'object' || Array.isArray(doc)) {
      throw badRequest('Send the state document as an object.');
    }
    const text = JSON.stringify(doc);
    if (text.length > 512 * 1024) throw badRequest('That state document is too large.');

    const stamp = clampInt(body.updatedAt, 0, Number.MAX_SAFE_INTEGER, Date.now());
    const existing = ctx.db.prepare('SELECT updated_at FROM user_state WHERE user_id = ?').get(ctx.user.id);
    if (existing && existing.updated_at > stamp) {
      /* Not an error: the newer copy simply wins, and the client is told so it
         can take what the server has instead of retrying forever. */
      const row = ctx.db.prepare('SELECT doc, updated_at FROM user_state WHERE user_id = ?').get(ctx.user.id);
      return json(ctx.res, 200, { stale: true, state: JSON.parse(row.doc), updatedAt: row.updated_at });
    }

    ctx.db.prepare(
      `INSERT INTO user_state (user_id, doc, updated_at) VALUES (?, ?, ?)
       ON CONFLICT(user_id) DO UPDATE SET doc = excluded.doc, updated_at = excluded.updated_at`)
      .run(ctx.user.id, text, stamp);
    json(ctx.res, 200, { ok: true, updatedAt: stamp });
  });

  /* -------------------------------- answers --------------------------------
     Saving one answer is the most frequent write in the product, so it is one
     statement with no read first. Attempts accumulate on the server, and
     `revealed` never goes back to false — a hint taken is a hint taken. */
  router.put('/api/me/answers/:exerciseId/:qid', async ctx => {
    if (!ctx.user) throw unauthorised();
    const body = await readJson(ctx.req);
    const ex = exerciseId(ctx.params.exerciseId);
    const qid = String(ctx.params.qid).slice(0, MAX_ID);
    const now = Date.now();

    const value = body.value === undefined ? null : JSON.stringify(body.value);
    if (value !== null && value.length > 20000) throw badRequest('That answer is too long.');

    ctx.db.exec('BEGIN');
    try {
      ctx.db.prepare(
        `INSERT INTO runs (user_id, exercise_id, started, updated, seconds)
         VALUES (?, ?, ?, ?, 0)
         ON CONFLICT(user_id, exercise_id) DO UPDATE SET updated = excluded.updated`)
        .run(ctx.user.id, ex, now, now);

      ctx.db.prepare(
        `INSERT INTO answers (user_id, exercise_id, qid, value, correct, revealed, attempts, at)
         VALUES (?, ?, ?, ?, ?, ?, 1, ?)
         ON CONFLICT(user_id, exercise_id, qid) DO UPDATE SET
           value    = excluded.value,
           correct  = excluded.correct,
           revealed = CASE WHEN answers.revealed = 1 THEN 1 ELSE excluded.revealed END,
           attempts = answers.attempts + 1,
           at       = excluded.at`)
        .run(ctx.user.id, ex, qid, value, body.correct ? 1 : 0, body.revealed ? 1 : 0, now);
      ctx.db.exec('COMMIT');
    } catch (err) {
      ctx.db.exec('ROLLBACK');
      throw err;
    }

    const row = ctx.db.prepare(
      'SELECT attempts, revealed FROM answers WHERE user_id = ? AND exercise_id = ? AND qid = ?')
      .get(ctx.user.id, ex, qid);
    json(ctx.res, 200, { ok: true, attempts: row.attempts, revealed: Boolean(row.revealed), at: now });
  });

  router.delete('/api/me/answers/:exerciseId/:qid', async ctx => {
    if (!ctx.user) throw unauthorised();
    ctx.db.prepare('DELETE FROM answers WHERE user_id = ? AND exercise_id = ? AND qid = ?')
      .run(ctx.user.id, exerciseId(ctx.params.exerciseId), String(ctx.params.qid).slice(0, MAX_ID));
    json(ctx.res, 200, { ok: true });
  });

  /* ---------------------------------- runs ---------------------------------- */
  router.get('/api/me/runs/:exerciseId', async ctx => {
    if (!ctx.user) throw unauthorised();
    const ex = exerciseId(ctx.params.exerciseId);
    const row = ctx.db.prepare('SELECT * FROM runs WHERE user_id = ? AND exercise_id = ?')
      .get(ctx.user.id, ex);
    if (!row) throw notFound('Nothing saved for that worksheet yet.');
    json(ctx.res, 200, { run: runOut(row, answersFor(ctx.db, ctx.user.id, [ex])[ex] ?? {}) });
  });

  router.patch('/api/me/runs/:exerciseId', async ctx => {
    if (!ctx.user) throw unauthorised();
    const body = await readJson(ctx.req);
    const ex = exerciseId(ctx.params.exerciseId);
    const now = Date.now();

    ctx.db.prepare(
      `INSERT INTO runs (user_id, exercise_id, started, updated, seconds, flags)
       VALUES (?, ?, ?, ?, 0, '[]')
       ON CONFLICT(user_id, exercise_id) DO NOTHING`)
      .run(ctx.user.id, ex, now, now);

    const sets = ['updated = ?'];
    const values = [now];
    if (body.addSeconds !== undefined) {
      sets.push('seconds = seconds + ?');
      values.push(clampInt(body.addSeconds, 0, 86400));
    }
    if (body.flags !== undefined) {
      if (!Array.isArray(body.flags)) throw badRequest('Flags must be a list.');
      sets.push('flags = ?');
      values.push(JSON.stringify(body.flags.slice(0, 500).map(String)));
    }
    if (body.reset) {
      sets.push('completed_at = NULL', 'seconds = 0', "flags = '[]'");
      ctx.db.prepare('DELETE FROM answers WHERE user_id = ? AND exercise_id = ?')
        .run(ctx.user.id, ex);
    }
    ctx.db.prepare(`UPDATE runs SET ${sets.join(', ')} WHERE user_id = ? AND exercise_id = ?`)
      .run(...values, ctx.user.id, ex);

    const row = ctx.db.prepare('SELECT * FROM runs WHERE user_id = ? AND exercise_id = ?')
      .get(ctx.user.id, ex);
    json(ctx.res, 200, { run: runOut(row, answersFor(ctx.db, ctx.user.id, [ex])[ex] ?? {}) });
  });

  /* --------------------------------- scores ---------------------------------
     Finishing a worksheet writes a score and stamps the run complete. It also
     files a submission against every assignment that set this worksheet to a
     class this student is in — which is the whole point of having a server:
     the teacher sees the result without the student sending them anything. */
  router.post('/api/me/scores', async ctx => {
    if (!ctx.user) throw unauthorised();
    const body = await readJson(ctx.req);
    const ex = exerciseId(body.exerciseId);
    const total = clampInt(body.total, 0, 1000);
    const correct = clampInt(body.correct, 0, total);
    const percent = total ? Math.round((correct / total) * 100) : 0;
    const seconds = clampInt(body.seconds, 0, 86400);
    const now = Date.now();

    const detail = body.answers && typeof body.answers === 'object' ? body.answers : {};
    const detailText = JSON.stringify(detail);
    if (detailText.length > 200000) throw badRequest('That result is too large.');

    ctx.db.exec('BEGIN');
    try {
      ctx.db.prepare(
        `INSERT INTO runs (user_id, exercise_id, started, updated, completed_at, seconds)
         VALUES (?, ?, ?, ?, ?, ?)
         ON CONFLICT(user_id, exercise_id) DO UPDATE SET
           updated = excluded.updated, completed_at = excluded.completed_at`)
        .run(ctx.user.id, ex, now, now, now, seconds);

      ctx.db.prepare(
        `INSERT INTO scores (user_id, exercise_id, correct, total, percent, seconds, at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`)
        .run(ctx.user.id, ex, correct, total, percent, seconds, now);

      /* Every live assignment of this worksheet to a class this student is
         enrolled in. One finished worksheet, one submission per assignment. */
      const targets = ctx.db.prepare(
        `SELECT a.id FROM assignments a
           JOIN classes c ON c.id = a.class_id
           JOIN class_students cs ON cs.class_id = c.id
          WHERE cs.user_id = ? AND c.archived = 0`).all(ctx.user.id);

      const filed = [];
      for (const t of targets) {
        const row = ctx.db.prepare('SELECT worksheet_ids FROM assignments WHERE id = ?').get(t.id);
        if (!JSON.parse(row.worksheet_ids).includes(ex)) continue;
        ctx.db.prepare(
          `INSERT INTO submissions (assignment_id, user_id, exercise_id, correct, total, percent, answers, at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(assignment_id, user_id, exercise_id) DO UPDATE SET
             correct = excluded.correct, total = excluded.total, percent = excluded.percent,
             answers = excluded.answers, at = excluded.at`)
          .run(t.id, ctx.user.id, ex, correct, total, percent, detailText, now);
        filed.push(t.id);
      }
      ctx.db.exec('COMMIT');
      json(ctx.res, 201, { score: { exerciseId: ex, correct, total, percent, at: now }, submittedTo: filed });
    } catch (err) {
      ctx.db.exec('ROLLBACK');
      throw err;
    }
  });

  router.get('/api/me/scores', async ctx => {
    if (!ctx.user) throw unauthorised();
    const limit = clampInt(ctx.query.get('limit'), 1, 500, 100);
    const rows = ctx.db.prepare(
      `SELECT exercise_id, correct, total, percent, seconds, at
         FROM scores WHERE user_id = ? ORDER BY at DESC LIMIT ?`).all(ctx.user.id, limit);
    json(ctx.res, 200, { scores: rows });
  });

  /* ------------------------------- custom work ------------------------------- */
  router.put('/api/me/custom/:id', async ctx => {
    if (!ctx.user) throw unauthorised();
    const body = await readJson(ctx.req);
    const doc = body.exercise ?? body.doc;
    if (!doc || typeof doc !== 'object') throw badRequest('Send the worksheet as an object.');
    const text = JSON.stringify(doc);
    if (text.length > 512 * 1024) throw badRequest('That worksheet is too large.');

    const id = String(ctx.params.id).slice(0, MAX_ID);
    /* Ids are minted in the browser, so two people can pick the same one.
       Refusing out loud beats an UPSERT with an ownership clause that
       silently does nothing and reports success. */
    const owner = ctx.db.prepare('SELECT user_id FROM custom_exercises WHERE id = ?').get(id);
    if (owner && owner.user_id !== ctx.user.id) {
      throw forbidden('A worksheet with that id belongs to somebody else.');
    }

    ctx.db.prepare(
      `INSERT INTO custom_exercises (id, user_id, doc, updated_at) VALUES (?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET doc = excluded.doc, updated_at = excluded.updated_at`)
      .run(id, ctx.user.id, text, Date.now());
    json(ctx.res, 200, { ok: true });
  });

  /* ------------------------------ erase it all ------------------------------
     Settings offers this, and before the backend existed it meant clearing
     localStorage. With an account behind it, clearing the browser alone is
     worse than doing nothing: the next sync pulls everything straight back
     and the person believes it is gone. So this deletes the work on the
     server, and the account keeps only its name and password. */
  router.delete('/api/me/data', async ctx => {
    if (!ctx.user) throw unauthorised();
    const uid = ctx.user.id;
    ctx.db.exec('BEGIN');
    try {
      for (const table of ['answers', 'runs', 'scores', 'user_state', 'custom_exercises', 'submissions']) {
        ctx.db.prepare(`DELETE FROM ${table} WHERE user_id = ?`).run(uid);
      }
      /* Leaving every class, and — for a teacher — taking their classes with
         them, which cascades to assignments and everyone's submissions. */
      ctx.db.prepare('DELETE FROM class_students WHERE user_id = ?').run(uid);
      ctx.db.prepare('DELETE FROM classes WHERE teacher_id = ?').run(uid);
      ctx.db.exec('COMMIT');
    } catch (err) {
      ctx.db.exec('ROLLBACK');
      throw err;
    }
    json(ctx.res, 200, { ok: true });
  });

  router.delete('/api/me/custom/:id', async ctx => {
    if (!ctx.user) throw unauthorised();
    ctx.db.prepare('DELETE FROM custom_exercises WHERE id = ? AND user_id = ?')
      .run(String(ctx.params.id).slice(0, MAX_ID), ctx.user.id);
    json(ctx.res, 200, { ok: true });
  });
}
