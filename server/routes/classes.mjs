/* Classes, rosters, assignments and what came back.

   This is the part a static site could not do. A join link could carry a
   class to another device, but nothing could carry a result home again; the
   interface said so rather than pretending otherwise. With a server behind
   it, a student on their own phone joins with a code and their finished
   worksheet appears in their teacher's grid.

   Ownership is checked on every route, not assumed from the client: a class
   belongs to the teacher who made it, and a submission belongs to the student
   who wrote it. */

import { newId } from '../db.mjs';
import { readJson, json, badRequest, unauthorised, forbidden, notFound, conflict } from '../http.mjs';

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const cleanCode = code => String(code ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '');

/** Codes avoid 0/O and 1/I, which get misread off a whiteboard. */
function makeCode(db) {
  const pick = n => Array.from({ length: n }, () =>
    CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)]).join('');
  /* Unique across classes and assignments alike, because a student typing a
     code into one box should never land in the wrong kind of thing. */
  for (let i = 0; i < 50; i++) {
    const code = `${pick(3)}-${pick(3)}`;
    const taken = db.prepare('SELECT 1 FROM classes WHERE code = ?').get(code)
      ?? db.prepare('SELECT 1 FROM assignments WHERE code = ?').get(code);
    if (!taken) return code;
  }
  throw new Error('Could not allocate an unused join code');
}

const text = (v, max, what) => {
  const s = String(v ?? '').trim();
  if (!s || s.length > max) throw badRequest(`Enter ${what}.`);
  return s;
};

function classOwnedBy(db, classId, teacherId) {
  const cls = db.prepare('SELECT * FROM classes WHERE id = ?').get(classId);
  if (!cls) throw notFound('That class does not exist.');
  if (cls.teacher_id !== teacherId) throw forbidden('That class belongs to another teacher.');
  return cls;
}

function rosterOf(db, classId) {
  return db.prepare(
    `SELECT id, user_id, name, source, joined_at FROM class_students
      WHERE class_id = ? ORDER BY joined_at`).all(classId)
    .map(r => ({ id: r.id, userId: r.user_id, name: r.name, source: r.source, joinedAt: r.joined_at }));
}

const classOut = (row, students = []) => ({
  id: row.id,
  name: row.name,
  level: row.level,
  grade: row.grade,
  subject: row.subject,
  code: row.code,
  created: row.created,
  archived: Boolean(row.archived),
  students
});

const assignmentOut = row => ({
  id: row.id,
  classId: row.class_id,
  code: row.code,
  title: row.title,
  worksheetIds: JSON.parse(row.worksheet_ids),
  exerciseId: JSON.parse(row.worksheet_ids)[0] ?? null,
  due: row.due,
  note: row.note,
  created: row.created
});

export function register(router) {
  /* ================================ teacher ================================ */
  router.get('/api/classes', async ctx => {
    if (!ctx.user) throw unauthorised();
    const rows = ctx.db.prepare(
      'SELECT * FROM classes WHERE teacher_id = ? ORDER BY created DESC').all(ctx.user.id);
    const classes = rows.map(r => classOut(r, rosterOf(ctx.db, r.id)));

    const assignments = rows.length
      ? ctx.db.prepare(
          `SELECT * FROM assignments WHERE class_id IN (${rows.map(() => '?').join(',')})
            ORDER BY created DESC`).all(...rows.map(r => r.id)).map(assignmentOut)
      : [];

    json(ctx.res, 200, { classes, assignments });
  });

  router.post('/api/classes', async ctx => {
    if (!ctx.user) throw unauthorised();
    if (ctx.user.role !== 'teacher') throw forbidden('Only a teacher account can create a class.');
    const body = await readJson(ctx.req);

    const row = {
      id: newId('c'),
      teacher_id: ctx.user.id,
      name: text(body.name, 120, 'a class name'),
      level: body.level ? String(body.level).slice(0, 40) : null,
      grade: body.grade ? String(body.grade).slice(0, 40) : null,
      subject: body.subject ? String(body.subject).slice(0, 40) : null,
      code: makeCode(ctx.db),
      created: Date.now()
    };
    ctx.db.prepare(
      `INSERT INTO classes (id, teacher_id, name, level, grade, subject, code, created, archived)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)`)
      .run(row.id, row.teacher_id, row.name, row.level, row.grade, row.subject, row.code, row.created);
    json(ctx.res, 201, { class: classOut({ ...row, archived: 0 }, []) });
  });

  router.patch('/api/classes/:id', async ctx => {
    if (!ctx.user) throw unauthorised();
    classOwnedBy(ctx.db, ctx.params.id, ctx.user.id);
    const body = await readJson(ctx.req);
    const patch = {};
    if (body.name !== undefined) patch.name = text(body.name, 120, 'a class name');
    if (body.level !== undefined) patch.level = body.level ? String(body.level).slice(0, 40) : null;
    if (body.grade !== undefined) patch.grade = body.grade ? String(body.grade).slice(0, 40) : null;
    if (body.subject !== undefined) patch.subject = body.subject ? String(body.subject).slice(0, 40) : null;
    if (body.archived !== undefined) patch.archived = body.archived ? 1 : 0;
    if (!Object.keys(patch).length) throw badRequest('Nothing to change.');

    ctx.db.prepare(`UPDATE classes SET ${Object.keys(patch).map(k => `${k} = ?`).join(', ')} WHERE id = ?`)
      .run(...Object.values(patch), ctx.params.id);
    const row = ctx.db.prepare('SELECT * FROM classes WHERE id = ?').get(ctx.params.id);
    json(ctx.res, 200, { class: classOut(row, rosterOf(ctx.db, row.id)) });
  });

  router.delete('/api/classes/:id', async ctx => {
    if (!ctx.user) throw unauthorised();
    classOwnedBy(ctx.db, ctx.params.id, ctx.user.id);
    /* The foreign keys cascade: roster, assignments and their submissions all
       go with it. That is why PRAGMA foreign_keys is on. */
    ctx.db.prepare('DELETE FROM classes WHERE id = ?').run(ctx.params.id);
    json(ctx.res, 200, { ok: true });
  });

  /* -------------------------------- roster -------------------------------- */
  router.post('/api/classes/:id/students', async ctx => {
    if (!ctx.user) throw unauthorised();
    classOwnedBy(ctx.db, ctx.params.id, ctx.user.id);
    const body = await readJson(ctx.req);
    const student = {
      id: newId('s'),
      class_id: ctx.params.id,
      name: text(body.name, 80, 'a student name'),
      source: 'added',
      joined_at: Date.now()
    };
    ctx.db.prepare(
      `INSERT INTO class_students (id, class_id, user_id, name, source, joined_at)
       VALUES (?, ?, NULL, ?, ?, ?)`)
      .run(student.id, student.class_id, student.name, student.source, student.joined_at);
    json(ctx.res, 201, { student: { id: student.id, userId: null, name: student.name,
                                    source: student.source, joinedAt: student.joined_at } });
  });

  router.delete('/api/classes/:id/students/:studentId', async ctx => {
    if (!ctx.user) throw unauthorised();
    classOwnedBy(ctx.db, ctx.params.id, ctx.user.id);
    ctx.db.prepare('DELETE FROM class_students WHERE id = ? AND class_id = ?')
      .run(ctx.params.studentId, ctx.params.id);
    json(ctx.res, 200, { ok: true });
  });

  /* ================================ student ================================ */
  /* Look a code up before committing to it, so the join screen can say which
     class it is rather than asking somebody to type a code on faith. */
  router.get('/api/classes/lookup/:code', async ctx => {
    const code = cleanCode(ctx.params.code);
    if (!code) throw badRequest('Enter a join code.');
    const row = ctx.db.prepare(
      `SELECT * FROM classes WHERE REPLACE(code, '-', '') = ? AND archived = 0`).get(code);
    if (!row) throw notFound('No class has that code.');
    /* Deliberately not the roster: a code is not a licence to read the names
       of everyone else in the class. */
    json(ctx.res, 200, { class: { id: row.id, name: row.name, level: row.level,
                                  subject: row.subject, code: row.code } });
  });

  router.post('/api/classes/join', async ctx => {
    if (!ctx.user) throw unauthorised('Sign in to join a class.');
    const body = await readJson(ctx.req);
    const code = cleanCode(body.code);
    if (!code) throw badRequest('Enter a join code.');

    const cls = ctx.db.prepare(
      `SELECT * FROM classes WHERE REPLACE(code, '-', '') = ? AND archived = 0`).get(code);
    if (!cls) throw notFound('No class has that code.');
    if (cls.teacher_id === ctx.user.id) throw badRequest('That is your own class.');

    const already = ctx.db.prepare(
      'SELECT * FROM class_students WHERE class_id = ? AND user_id = ?').get(cls.id, ctx.user.id);
    if (already) throw conflict('You have already joined that class.');

    const name = body.name ? text(body.name, 80, 'your name') : ctx.user.name;

    /* If the teacher typed this student onto the roster before they joined,
       claim that row rather than adding a second one with the same name. */
    const placeholder = ctx.db.prepare(
      `SELECT * FROM class_students
        WHERE class_id = ? AND user_id IS NULL AND LOWER(name) = LOWER(?)
        ORDER BY joined_at LIMIT 1`).get(cls.id, name);

    if (placeholder) {
      ctx.db.prepare(
        `UPDATE class_students SET user_id = ?, source = 'joined' WHERE id = ?`)
        .run(ctx.user.id, placeholder.id);
    } else {
      ctx.db.prepare(
        `INSERT INTO class_students (id, class_id, user_id, name, source, joined_at)
         VALUES (?, ?, ?, ?, 'joined', ?)`)
        .run(newId('s'), cls.id, ctx.user.id, name, Date.now());
    }
    json(ctx.res, 201, { enrolment: enrolmentFor(ctx.db, cls, ctx.user.id) });
  });

  router.delete('/api/classes/join/:code', async ctx => {
    if (!ctx.user) throw unauthorised();
    const code = cleanCode(ctx.params.code);
    const cls = ctx.db.prepare(`SELECT * FROM classes WHERE REPLACE(code, '-', '') = ?`).get(code);
    if (!cls) throw notFound('No class has that code.');
    ctx.db.prepare('DELETE FROM class_students WHERE class_id = ? AND user_id = ?')
      .run(cls.id, ctx.user.id);
    json(ctx.res, 200, { ok: true });
  });

  /* Everything set to the classes this student is in, plus what they have
     already handed in, so the dashboard can mark work done without guessing. */
  router.get('/api/me/classes', async ctx => {
    if (!ctx.user) throw unauthorised();
    const rows = ctx.db.prepare(
      `SELECT c.*, cs.name AS student_name, cs.joined_at
         FROM class_students cs JOIN classes c ON c.id = cs.class_id
        WHERE cs.user_id = ? ORDER BY cs.joined_at DESC`).all(ctx.user.id);

    const enrolments = rows.map(r => ({
      classId: r.id,
      className: r.name,
      level: r.level,
      subject: r.subject,
      code: r.code,
      studentName: r.student_name,
      joinedAt: r.joined_at,
      teacherName: ctx.db.prepare('SELECT name FROM users WHERE id = ?').get(r.teacher_id)?.name ?? null
    }));

    const assignments = rows.length
      ? ctx.db.prepare(
          `SELECT * FROM assignments WHERE class_id IN (${rows.map(() => '?').join(',')})
            ORDER BY created DESC`).all(...rows.map(r => r.id))
          .map(a => ({ ...assignmentOut(a),
                       class: enrolments.find(e => e.classId === a.class_id) ?? null }))
      : [];

    const mine = ctx.db.prepare(
      `SELECT assignment_id, exercise_id, correct, total, percent, at
         FROM submissions WHERE user_id = ?`).all(ctx.user.id);

    json(ctx.res, 200, { enrolments, assignments, submissions: mine });
  });

  /* ============================== assignments ============================== */
  router.post('/api/assignments', async ctx => {
    if (!ctx.user) throw unauthorised();
    const body = await readJson(ctx.req);
    const cls = classOwnedBy(ctx.db, String(body.classId ?? ''), ctx.user.id);

    const ids = Array.isArray(body.worksheetIds) ? body.worksheetIds.map(String).slice(0, 100)
              : body.exerciseId ? [String(body.exerciseId)] : [];
    if (!ids.length) throw badRequest('Choose at least one worksheet.');

    const row = {
      id: newId('a'),
      class_id: cls.id,
      code: makeCode(ctx.db),
      title: text(body.title, 200, 'a title'),
      worksheet_ids: JSON.stringify(ids),
      due: body.due ? String(body.due).slice(0, 40) : null,
      note: body.note ? String(body.note).slice(0, 2000) : null,
      created: Date.now()
    };
    ctx.db.prepare(
      `INSERT INTO assignments (id, class_id, code, title, worksheet_ids, due, note, created)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(row.id, row.class_id, row.code, row.title, row.worksheet_ids, row.due, row.note, row.created);
    json(ctx.res, 201, { assignment: assignmentOut(row) });
  });

  router.delete('/api/assignments/:id', async ctx => {
    if (!ctx.user) throw unauthorised();
    const a = ctx.db.prepare('SELECT * FROM assignments WHERE id = ?').get(ctx.params.id);
    if (!a) throw notFound('That assignment does not exist.');
    classOwnedBy(ctx.db, a.class_id, ctx.user.id);
    ctx.db.prepare('DELETE FROM assignments WHERE id = ?').run(a.id);
    json(ctx.res, 200, { ok: true });
  });

  /* An assignment opened by its code — how a student reaches work from a link
     without having to find it on a dashboard first. */
  router.get('/api/assignments/code/:code', async ctx => {
    const code = cleanCode(ctx.params.code);
    const row = ctx.db.prepare(`SELECT * FROM assignments WHERE REPLACE(code, '-', '') = ?`).get(code);
    if (!row) throw notFound('No assignment has that code.');
    const cls = ctx.db.prepare('SELECT name, code FROM classes WHERE id = ?').get(row.class_id);
    json(ctx.res, 200, { assignment: assignmentOut(row), class: cls ?? null });
  });

  /* ------------------------------- results -------------------------------
     What the teacher's grid and analytics are built from: every student on
     the roster, every submission they made, and the per-question detail. The
     server sends facts; the front end decides how to draw them. */
  router.get('/api/classes/:id/results', async ctx => {
    if (!ctx.user) throw unauthorised();
    const cls = classOwnedBy(ctx.db, ctx.params.id, ctx.user.id);
    const students = rosterOf(ctx.db, cls.id);

    const assignments = ctx.db.prepare(
      'SELECT * FROM assignments WHERE class_id = ? ORDER BY created DESC').all(cls.id);

    const rows = assignments.length
      ? ctx.db.prepare(
          `SELECT s.*, u.name AS student_name FROM submissions s
             JOIN users u ON u.id = s.user_id
            WHERE s.assignment_id IN (${assignments.map(() => '?').join(',')})`)
          .all(...assignments.map(a => a.id))
      : [];

    const submissions = rows.map(r => ({
      assignmentId: r.assignment_id,
      userId: r.user_id,
      studentName: r.student_name,
      exerciseId: r.exercise_id,
      correct: r.correct,
      total: r.total,
      percent: r.percent,
      answers: JSON.parse(r.answers || '{}'),
      at: r.at
    }));

    json(ctx.res, 200, {
      class: classOut(cls, students),
      assignments: assignments.map(assignmentOut),
      submissions
    });
  });
}

function enrolmentFor(db, cls, userId) {
  const row = db.prepare(
    'SELECT name, joined_at FROM class_students WHERE class_id = ? AND user_id = ?')
    .get(cls.id, userId);
  return {
    classId: cls.id,
    className: cls.name,
    level: cls.level,
    subject: cls.subject,
    code: cls.code,
    studentName: row?.name ?? null,
    joinedAt: row?.joined_at ?? Date.now()
  };
}
