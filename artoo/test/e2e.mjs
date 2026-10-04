// End-to-end: real server, real Chromium, and a stand-in for the Meshy API so
// the paid path is exercised without spending credits.
//
//   node artoo/test/e2e.mjs        (screenshots land in artoo/test/out/)

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { spawn } from 'node:child_process';
import http from 'node:http';
import zlib from 'node:zlib';
import { mkdtemp, mkdir, readFile, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'out');
const PORT = 8198, MOCK = 8199;
const BASE = `http://127.0.0.1:${PORT}`;
await mkdir(OUT, { recursive: true });

let failures = 0;
const check = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) failures++; };

// A 256×256 PNG: grey blob with a dark spot on white — a "subject on a plain background".
function png() {
  const W = 256, H = 256, raw = Buffer.alloc((W * 3 + 1) * H);
  for (let y = 0; y < H; y++) {
    raw[y * (W * 3 + 1)] = 0;
    for (let x = 0; x < W; x++) {
      const inBlob = ((x - 128) / 80) ** 2 + ((y - 140) / 95) ** 2 < 1;
      const spot = (x - 110) ** 2 + (y - 110) ** 2 < 150;
      const c = spot ? 30 : inBlob ? 130 : 255;
      raw.fill(c, y * (W * 3 + 1) + 1 + x * 3, y * (W * 3 + 1) + 4 + x * 3);
    }
  }
  const crcTable = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
  const crc = b => { let c = 0xffffffff; for (const x of b) c = crcTable[(c ^ x) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const chunk = (type, data) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type), data]);
    const c = Buffer.alloc(4); c.writeUInt32BE(crc(td));
    return Buffer.concat([len, td, c]);
  };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4); ihdr[8] = 8; ihdr[9] = 2;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}

// Meshy stand-in: one poll in progress, then done, serving whatever GLB we give it.
let mockGlb = null, polls = 0, lastBody = null;
const mock = http.createServer((req, res) => {
  if (req.method === 'POST') {
    let b = ''; req.on('data', c => (b += c)); req.on('end', () => {
      lastBody = JSON.parse(b);
      res.end(JSON.stringify({ result: `task-${Date.now()}` }));
    });
    return;
  }
  if (req.url === '/model.glb') return res.end(mockGlb);
  polls++;
  const done = polls % 2 === 0;
  res.end(JSON.stringify(done
    ? { status: 'SUCCEEDED', progress: 100, model_urls: { glb: `http://127.0.0.1:${MOCK}/model.glb` } }
    : { status: 'IN_PROGRESS', progress: 42 }));
}).listen(MOCK);

const data = await mkdtemp(path.join(tmpdir(), 'artoo-'));
const server = spawn('node', [path.join(HERE, '..', 'server.mjs')], {
  env: { ...process.env, PORT, ARTOO_DATA: data, MESHY_API_KEY: 'test', MESHY_API_URL: `http://127.0.0.1:${MOCK}/openapi/v1/image-to-3d` },
  stdio: ['ignore', 'pipe', 'inherit'],
});
await new Promise(r => server.stdout.once('data', r));

const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
// Web fonts are cosmetic and this sandbox's proxy can't reach them; serve empty.
await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
const errors = [];
page.on('pageerror', e => errors.push(e.message));
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });

try {
  // Home
  await page.goto(BASE);
  await page.waitForSelector('#stage canvas');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUT, '1-home.png') });
  check(true, 'home renders the hero');

  // Demo model, 2 candidates
  const demo = await (await fetch(`${BASE}/api/models`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'Demo test', engine: 'demo' }) })).json();
  await page.goto(`${BASE}/studio?model=${demo.id}`);
  await page.setInputFiles('#file', { name: 'blob.png', mimeType: 'image/png', buffer: png() });
  await page.click('#count [data-n="2"]');
  await page.click('#go');
  await page.waitForFunction(() => document.querySelectorAll('.card .dl:not([hidden])').length === 2, null, { timeout: 60000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT, '2-studio-demo.png') });
  check(true, 'demo engine produced 2 GLBs');

  await page.locator('.card').nth(0).locator('[data-star="5"]').click();
  await page.locator('.card').nth(1).locator('[data-star="1"]').click();
  await page.waitForTimeout(300);
  const m1 = await (await fetch(`${BASE}/api/models/${demo.id}`)).json();
  check(m1.rated === 2 && m1.best.mean > 0.6, `ratings train the model (best: ${m1.best.label}, ${m1.best.mean.toFixed(2)})`);

  // Meshy path through the stand-in
  const files = await readdir(path.join(data, 'files'));
  mockGlb = await readFile(path.join(data, 'files', files.find(f => f.endsWith('.glb'))));
  const meshy = await (await fetch(`${BASE}/api/models`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'Meshy test', engine: 'meshy' }) })).json();
  await page.goto(`${BASE}/studio?model=${meshy.id}`);
  await page.setInputFiles('#file', { name: 'blob.png', mimeType: 'image/png', buffer: png() });
  await page.click('#go');
  await page.waitForSelector('.card .dl:not([hidden])', { timeout: 30000 });
  check(lastBody?.image_url?.startsWith('data:image/png;base64,') && lastBody.should_texture === true, `Meshy request carries image + settings (${lastBody?.ai_model}, ${lastBody?.model_type})`);

  // Models + gallery
  await page.goto(`${BASE}/models`);
  await page.waitForSelector('.arm');
  await page.screenshot({ path: path.join(OUT, '3-models.png'), fullPage: true });
  await page.goto(`${BASE}/gallery`);
  await page.waitForSelector('.card');
  check(await page.locator('.card').count() === 3, 'gallery lists 3 generations');
  await page.locator('.card .open').first().click();
  await page.waitForSelector('#dlg-viewer canvas');
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(OUT, '4-gallery-dialog.png') });

  const ds = await (await fetch(`${BASE}/api/models/${demo.id}/dataset.jsonl`)).text();
  check(ds.trim().split('\n').length === 2, 'dataset export has both rated pairs');

  // Phone width: no sideways scroll
  await page.setViewportSize({ width: 390, height: 844 });
  for (const p of ['/', '/studio', '/models', '/gallery', '/about']) {
    await page.goto(BASE + p);
    await page.waitForTimeout(400);
    const over = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    check(over <= 0, `${p} fits a phone (overflow ${over}px)`);
  }
  await page.goto(BASE);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(OUT, '5-home-phone.png'), fullPage: true });

  check(errors.length === 0, `no console errors${errors.length ? ': ' + errors.join(' | ') : ''}`);
} catch (e) {
  check(false, e.message);
  await page.screenshot({ path: path.join(OUT, 'error.png') }).catch(() => {});
} finally {
  await browser.close();
  server.kill();
  mock.close();
}
console.log(failures ? `\n${failures} failed` : '\nall passed');
process.exit(failures ? 1 : 0);
