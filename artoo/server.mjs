// Artoo — image-to-3D studio. One file, no dependencies: node:http serves the
// site and a small JSON API, and talks to the 3D engine on the user's behalf so
// the API key never reaches the browser.
//
//   MESHY_API_KEY=msy_... node artoo/server.mjs      → http://127.0.0.1:8100
//
// Without a key the "demo" engine still works: public/js/engine.js builds the
// model in the browser from the outline (and guesses the hidden sides).

import http from 'node:http';
import { readFile, writeFile, mkdir, rename, unlink, stat } from 'node:fs/promises';
import { createReadStream, existsSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(ROOT, 'public');
const DATA = process.env.ARTOO_DATA || path.join(ROOT, 'data');
const FILES = path.join(DATA, 'files');
const DB_FILE = path.join(DATA, 'db.json');
const PORT = Number(process.env.PORT || 8100);
const HOST = process.env.HOST || '127.0.0.1';
const MESHY_KEY = process.env.MESHY_API_KEY || '';
// Overridable so tests can point at a stand-in instead of spending credits.
const MESHY = process.env.MESHY_API_URL || 'https://api.meshy.ai/openapi/v1/image-to-3d';
const MAX_BODY = 25 * 1024 * 1024;

// ---------------------------------------------------------------------------
// Variants ("arms"). A model is a set of candidate settings for one engine.
// Training is choosing between them from ratings, so these are the hypotheses
// the model can learn between.

const PRESETS = {
  meshy: [
    { label: 'Detailed (7.1, no remesh)', settings: { model_type: 'standard', ai_model: 'latest', should_remesh: false, enable_pbr: true } },
    { label: 'Ultra geometry (7.1, 2k)', settings: { model_type: 'standard', ai_model: 'latest', geometry_resolution: '2k', should_remesh: false, enable_pbr: true } },
    { label: 'Game-ready 30k tris', settings: { model_type: 'standard', ai_model: 'latest', should_remesh: true, topology: 'triangle', target_polycount: 30000 } },
    { label: 'Clean quads 10k', settings: { model_type: 'standard', ai_model: 'latest', should_remesh: true, topology: 'quad', target_polycount: 10000 } },
    { label: 'Smart topology (T2)', settings: { model_type: 'smart-topology', ai_model: 'meshy-t2', target_polycount: 20000 } },
    { label: 'Meshy 6', settings: { model_type: 'standard', ai_model: 'meshy-6', should_remesh: false } },
  ],
  // Browser engine (public/js/engine.js): shape recipes and styles.
  demo: [
    { label: 'Round', settings: { style: 'textured', inflate: 1.0, smooth: 6, detail: 0.04 } },
    { label: 'Balanced', settings: { style: 'textured', inflate: 0.85, smooth: 4, detail: 0.08 } },
    { label: 'Puffy', settings: { style: 'textured', inflate: 1.25, smooth: 8, detail: 0.02 } },
    { label: 'Relief', settings: { style: 'textured', inflate: 0.5, smooth: 3, detail: 0.16 } },
    { label: 'Low-poly', settings: { style: 'lowpoly', inflate: 0.9, smooth: 2, detail: 0.06 } },
  ],
};

// ---------------------------------------------------------------------------
// Storage: one JSON file, written atomically. Plenty for one person's studio;
// swap for a database before many people share an instance.

let db = { models: [], generations: [] };
let saving = Promise.resolve();

async function load() {
  await mkdir(FILES, { recursive: true });
  if (existsSync(DB_FILE)) db = JSON.parse(await readFile(DB_FILE, 'utf8'));
}

function save() {
  saving = saving.then(async () => {
    const tmp = DB_FILE + '.tmp';
    await writeFile(tmp, JSON.stringify(db, null, 1));
    await rename(tmp, DB_FILE);
  });
  return saving;
}

const now = () => Date.now();
const findModel = id => db.models.find(m => m.id === id);
const findGen = id => db.generations.find(g => g.id === id);

function newModel({ name, description = '', engine }) {
  const presets = PRESETS[engine];
  return {
    id: randomUUID(),
    name: String(name || 'Untitled model').slice(0, 80),
    description: String(description).slice(0, 400),
    engine,
    createdAt: now(),
    arms: presets.map((p, i) => ({ id: `a${i}`, label: p.label, settings: p.settings, n: 0, sum: 0 })),
  };
}

// ---------------------------------------------------------------------------
// Learning. Each rating (1–5 stars) becomes a reward in [0,1]. Thompson
// sampling on a Beta posterior: untried variants still get explored, and once
// one keeps winning it is picked almost every time. That is the "best model".

function gammaSample(k) {
  if (k < 1) return gammaSample(k + 1) * Math.random() ** (1 / k);
  const d = k - 1 / 3, c = 1 / Math.sqrt(9 * d);
  for (;;) {
    let x, v;
    do {
      const u1 = Math.random(), u2 = Math.random();
      x = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      v = 1 + c * x;
    } while (v <= 0);
    v = v ** 3;
    const u = Math.random();
    if (Math.log(u) < 0.5 * x * x + d - d * v + d * Math.log(v)) return d * v;
  }
}
const betaSample = (a, b) => { const x = gammaSample(a); return x / (x + gammaSample(b)); };

const posterior = arm => ({ a: 1 + arm.sum, b: 1 + (arm.n - arm.sum) });

function pickArms(model, count) {
  const scored = model.arms.map(arm => {
    const { a, b } = posterior(arm);
    return { arm, draw: betaSample(a, b) };
  }).sort((x, y) => y.draw - x.draw);
  // Several candidates at once: the top distinct draws, so a "best of N"
  // compares different settings instead of the same one N times.
  return scored.slice(0, Math.min(count, scored.length)).map(s => s.arm);
}

function armStats(arm) {
  const { a, b } = posterior(arm);
  return { ...arm, mean: a / (a + b) };
}

function bestArm(model) {
  return model.arms.map(armStats).sort((x, y) => y.mean - x.mean || y.n - x.n)[0];
}

const reward = stars => (stars - 1) / 4;

function applyRating(gen, stars) {
  const model = findModel(gen.modelId);
  const arm = model?.arms.find(a => a.id === gen.armId);
  if (arm && gen.rating) { arm.n -= 1; arm.sum -= reward(gen.rating); }
  gen.rating = stars || null;
  if (arm && gen.rating) { arm.n += 1; arm.sum += reward(gen.rating); }
}

// ---------------------------------------------------------------------------
// Meshy

async function meshy(method, url, body) {
  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${MESHY_KEY}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json; try { json = JSON.parse(text); } catch { json = { message: text }; }
  if (!res.ok) throw new Error(`Meshy ${res.status}: ${json.message || text}`.slice(0, 300));
  return json;
}

async function startMeshy(gen, dataUri) {
  const { result } = await meshy('POST', MESHY, { image_url: dataUri, should_texture: true, ...gen.settings });
  gen.taskId = result;
  gen.status = 'running';
}

// Called whenever a client polls a running task. Downloads the GLB as soon as
// it is ready: Meshy's links are signed and expire, and serving the file from
// here also avoids cross-origin loading in the viewer.
const refreshing = new Map();
function refreshMeshy(gen) {
  if (!refreshing.has(gen.id)) {
    refreshing.set(gen.id, (async () => {
      try {
        const t = await meshy('GET', `${MESHY}/${gen.taskId}`);
        gen.progress = t.progress ?? gen.progress;
        if (t.status === 'SUCCEEDED') {
          const glb = await fetch(t.model_urls.glb);
          if (!glb.ok) throw new Error(`GLB download failed (${glb.status})`);
          await writeFile(path.join(FILES, `${gen.id}.glb`), Buffer.from(await glb.arrayBuffer()));
          gen.glb = `/files/${gen.id}.glb`;
          gen.status = 'done';
          gen.progress = 100;
          gen.finishedAt = now();
        } else if (['FAILED', 'CANCELED', 'EXPIRED'].includes(t.status)) {
          gen.status = 'failed';
          gen.error = t.task_error?.message || t.status;
        }
      } catch (e) {
        gen.error = e.message; // transient: keep running, report on next poll
      }
      await save();
    })().finally(() => refreshing.delete(gen.id)));
  }
  return refreshing.get(gen.id);
}

// ---------------------------------------------------------------------------
// HTTP helpers

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.glb': 'model/gltf-binary', '.wasm': 'application/wasm', '.mjs': 'text/javascript; charset=utf-8', '.ico': 'image/x-icon',
};

function send(res, status, body, type = 'application/json') {
  const payload = type === 'application/json' ? JSON.stringify(body) : body;
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  res.end(payload);
}
const fail = (res, status, message) => send(res, status, { error: message });

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []; let size = 0;
    req.on('data', c => {
      size += c.length;
      if (size > MAX_BODY) { reject(Object.assign(new Error('Upload too large (25 MB max)'), { status: 413 })); req.destroy(); }
      else chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}
const readJson = async req => JSON.parse((await readBody(req)).toString('utf8') || '{}');

async function serveFile(res, file) {
  try {
    const s = await stat(file);
    if (!s.isFile()) return fail(res, 404, 'Not found');
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Content-Length': s.size });
    createReadStream(file).pipe(res);
  } catch { fail(res, 404, 'Not found'); }
}

// Resolve inside a root only — no ../ escapes.
function safeJoin(root, urlPath) {
  const p = path.normalize(path.join(root, decodeURIComponent(urlPath)));
  return p.startsWith(root + path.sep) || p === root ? p : null;
}

const publicGen = g => ({ ...g });
const publicModel = m => ({
  ...m,
  arms: m.arms.map(armStats),
  best: bestArm(m),
  generations: db.generations.filter(g => g.modelId === m.id).length,
  rated: db.generations.filter(g => g.modelId === m.id && g.rating).length,
});

// ---------------------------------------------------------------------------
// Routes

async function api(req, res, url) {
  const parts = url.pathname.split('/').filter(Boolean).slice(1); // drop "api"
  const [resource, id, action] = parts;
  const m = req.method;

  if (resource === 'config' && m === 'GET') {
    return send(res, 200, { engines: { meshy: Boolean(MESHY_KEY), demo: true } });
  }

  if (resource === 'models') {
    if (!id && m === 'GET') return send(res, 200, db.models.map(publicModel));
    if (!id && m === 'POST') {
      const body = await readJson(req);
      const engine = body.engine === 'meshy' ? 'meshy' : 'demo';
      const model = newModel({ ...body, engine });
      db.models.push(model); await save();
      return send(res, 201, publicModel(model));
    }
    const model = findModel(id);
    if (!model) return fail(res, 404, 'Model not found');
    if (!action && m === 'GET') return send(res, 200, publicModel(model));
    if (!action && m === 'PATCH') {
      const body = await readJson(req);
      if (body.name) model.name = String(body.name).slice(0, 80);
      if (body.description !== undefined) model.description = String(body.description).slice(0, 400);
      await save(); return send(res, 200, publicModel(model));
    }
    if (!action && m === 'DELETE') {
      const gone = db.generations.filter(g => g.modelId === model.id);
      db.models = db.models.filter(x => x !== model);
      db.generations = db.generations.filter(g => g.modelId !== model.id);
      await Promise.all(gone.map(g => unlink(path.join(FILES, `${g.id}.glb`)).catch(() => {})));
      await save(); return send(res, 200, { ok: true });
    }
    if (action === 'reset' && m === 'POST') {
      for (const arm of model.arms) { arm.n = 0; arm.sum = 0; }
      for (const g of db.generations) if (g.modelId === model.id) g.rating = null;
      await save(); return send(res, 200, publicModel(model));
    }
    // Training data for an eventual real fine-tune: every rated pair.
    if (action === 'dataset.jsonl' && m === 'GET') {
      const lines = db.generations
        .filter(g => g.modelId === model.id && g.rating && g.glb)
        .map(g => JSON.stringify({ image: g.image, model: g.glb, rating: g.rating, engine: g.engine, settings: g.settings }));
      res.writeHead(200, { 'Content-Type': 'application/x-ndjson', 'Content-Disposition': `attachment; filename="${model.id}.jsonl"` });
      return res.end(lines.join('\n') + (lines.length ? '\n' : ''));
    }
  }

  if (resource === 'generate' && m === 'POST') {
    const body = await readJson(req);
    const model = findModel(body.modelId);
    if (!model) return fail(res, 404, 'Model not found');
    if (model.engine === 'meshy' && !MESHY_KEY) return fail(res, 400, 'This model uses Meshy but MESHY_API_KEY is not set on the server.');
    const match = /^data:image\/(png|jpe?g);base64,(.+)$/.exec(body.image || '');
    if (!match) return fail(res, 400, 'Send a PNG or JPEG image.');
    const imageId = randomUUID();
    const ext = match[1] === 'png' ? 'png' : 'jpg';
    await writeFile(path.join(FILES, `${imageId}.${ext}`), Buffer.from(match[2], 'base64'));

    const count = Math.max(1, Math.min(4, Number(body.candidates) || 1));
    const batch = randomUUID();
    const gens = pickArms(model, count).map(arm => ({
      id: randomUUID(), batch, modelId: model.id, engine: model.engine,
      armId: arm.id, armLabel: arm.label, settings: arm.settings,
      image: `/files/${imageId}.${ext}`, status: model.engine === 'demo' ? 'client' : 'queued',
      progress: 0, rating: null, createdAt: now(), name: String(body.name || '').slice(0, 80),
    }));
    db.generations.push(...gens);
    if (model.engine === 'meshy') {
      await Promise.all(gens.map(g => startMeshy(g, body.image).catch(e => { g.status = 'failed'; g.error = e.message; })));
    }
    await save();
    return send(res, 201, gens.map(publicGen));
  }

  if (resource === 'generations') {
    if (!id && m === 'GET') {
      const modelId = url.searchParams.get('modelId');
      const list = db.generations.filter(g => !modelId || g.modelId === modelId).sort((a, b) => b.createdAt - a.createdAt);
      return send(res, 200, list.map(publicGen));
    }
    const gen = findGen(id);
    if (!gen) return fail(res, 404, 'Generation not found');
    if (!action && m === 'GET') {
      if (gen.status === 'running' && gen.engine === 'meshy') await refreshMeshy(gen);
      return send(res, 200, publicGen(gen));
    }
    if (!action && m === 'DELETE') {
      applyRating(gen, null);
      db.generations = db.generations.filter(g => g !== gen);
      if (gen.glb) await unlink(path.join(FILES, `${gen.id}.glb`)).catch(() => {});
      await save(); return send(res, 200, { ok: true });
    }
    // The demo engine builds its mesh in the browser and hands back the GLB.
    if (action === 'glb' && m === 'PUT') {
      if (gen.engine !== 'demo') return fail(res, 400, 'Only demo generations are uploaded');
      const buf = await readBody(req);
      if (buf.subarray(0, 4).toString('latin1') !== 'glTF') return fail(res, 400, 'Not a GLB file');
      await writeFile(path.join(FILES, `${gen.id}.glb`), buf);
      Object.assign(gen, { glb: `/files/${gen.id}.glb`, status: 'done', progress: 100, finishedAt: now() });
      await save(); return send(res, 200, publicGen(gen));
    }
    if (action === 'rate' && m === 'POST') {
      const { rating } = await readJson(req);
      const stars = rating === null ? null : Math.round(Number(rating));
      if (stars !== null && !(stars >= 1 && stars <= 5)) return fail(res, 400, 'Rating is 1–5');
      applyRating(gen, stars);
      await save();
      return send(res, 200, { generation: publicGen(gen), model: publicModel(findModel(gen.modelId)) });
    }
  }

  return fail(res, 404, 'Unknown endpoint');
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  try {
    if (url.pathname.startsWith('/api/')) return await api(req, res, url);
    if (url.pathname.startsWith('/files/')) {
      const file = safeJoin(FILES, url.pathname.slice('/files/'.length));
      return file ? serveFile(res, file) : fail(res, 404, 'Not found');
    }
    let p = url.pathname === '/' ? '/index.html' : url.pathname;
    if (!path.extname(p)) p += '.html';
    const file = safeJoin(PUBLIC, p.slice(1));
    return file ? serveFile(res, file) : fail(res, 404, 'Not found');
  } catch (e) {
    console.error(e);
    fail(res, e.status || 500, e.status ? e.message : 'Server error');
  }
});

await load();
server.listen(PORT, HOST, () => {
  console.log(`Artoo on http://${HOST}:${PORT}  (Meshy: ${MESHY_KEY ? 'on' : 'off — demo engine only'})`);
});
