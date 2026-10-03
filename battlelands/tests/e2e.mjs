/* Browser smoke test of the whole loop on a phone-sized touch viewport:
   menu → PLAY → deploy → land → move/shoot → results → PLAY AGAIN → menu.
   Fails on any console error. Screenshots go to $SHOTS if set.
   Run: node battlelands/tests/e2e.mjs [baseUrl]   (serve the repo root first) */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const BASE = process.argv[2] || 'http://127.0.0.1:8123/battlelands/';
const SHOTS = process.env.SHOTS || '';
const errors = [];
let fail = 0;
const check = (ok, msg) => { console.log(ok ? '✓' : '✗', msg); if (!ok) fail++; };

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--autoplay-policy=no-user-gesture-required'] }).catch(() => chromium.launch());
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const page = await ctx.newPage();
// Network failures to third-party hosts (the web font) depend on the sandbox, not the game.
page.on('console', m => { if (m.type() === 'error' && !/^Failed to load resource: net::/.test(m.text())) errors.push(m.text()); });
page.on('response', r => { if (r.status() >= 400 && r.url().startsWith(BASE)) errors.push(`${r.status()} ${r.url()}`); });
page.on('pageerror', e => errors.push(String(e)));
const shot = async name => { if (SHOTS) await page.screenshot({ path: `${SHOTS}/${name}.png` }); };
const state = () => page.evaluate(() => globalThis.__blr?.state);

await page.goto(BASE);
await page.waitForFunction(() => globalThis.__blr?.state === 'menu', null, { timeout: 15000 });
check(true, 'boots to main menu');
await page.waitForTimeout(500);
await shot('01-menu');

// Tabs
for (const tab of ['collection', 'shop', 'missions', 'settings', 'home']) {
  await page.tap(`#nav button[data-tab="${tab}"]`);
  await page.waitForTimeout(350);
  await shot(`02-${tab}`);
  check(await page.$(`#nav button[data-tab="${tab}"].active`) !== null, `tab ${tab} opens`);
}

await page.tap('#playBtn');
await page.waitForTimeout(700);
await shot('03-matchmaking');
await page.waitForFunction(() => globalThis.__blr.state === 'deploy', null, { timeout: 8000 });
check(true, 'matchmaking → deploy');
await page.waitForTimeout(400);
// pick a landing spot near Brightmoor
const box = await (await page.$('.deploy canvas')).boundingBox();
await page.touchscreen.tap(box.x + box.width * (1480 / 2800), box.y + box.height * (1680 / 2800));
await page.waitForTimeout(300);
await shot('04-deploy');
await page.tap('#go');
await page.waitForFunction(() => globalThis.__blr.state === 'playing', null, { timeout: 5000 });
await page.waitForTimeout(1200);
await shot('05-descent');
await page.waitForFunction(() => globalThis.__blr.match?.phase === 'live', null, { timeout: 8000 });
check(true, 'descent → live');
const p0 = await page.evaluate(() => { const p = __blr.match.player; return [p.x, p.y]; });
await page.keyboard.down('d'); await page.waitForTimeout(900); await page.keyboard.up('d');
const p1 = await page.evaluate(() => { const p = __blr.match.player; return [p.x, p.y]; });
check(Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) > 80, `player moves (${Math.round(Math.hypot(p1[0] - p0[0], p1[1] - p0[1]))} units)`);
await shot('06-live');

// Joystick by touch: drag in the left zone
const jz = await (await page.$('#joyZone')).boundingBox();
const cdp = await ctx.newCDPSession(page);
const touch = async (type, pts) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pts.map(([x, y], i) => ({ x, y, id: i })) });
const jx = jz.x + jz.width * 0.4, jy = jz.y + jz.height * 0.7;
const q0 = await page.evaluate(() => { const p = __blr.match.player; return [p.x, p.y]; });
await touch('touchStart', [[jx, jy]]);
for (let i = 1; i <= 6; i++) { await touch('touchMove', [[jx, jy - i * 10]]); await page.waitForTimeout(30); }
await page.waitForTimeout(700);
await shot('07-joystick');
await touch('touchEnd', []);
const q1 = await page.evaluate(() => { const p = __blr.match.player; return [p.x, p.y]; });
check(q0[1] - q1[1] > 60, `joystick moves player up (${Math.round(q0[1] - q1[1])} units)`);

// Give the player a gun and shoot with the attack button
await page.evaluate(() => {
  const m = __blr.match;
  const it = m.loot.makeItem('weapon', 'rapid', 'epic', m.player.x + 10, m.player.y);
  m.playerAction('pickup', it);
});
const fb = await (await page.$('#fireBtn')).boundingBox();
const shotsBefore = await page.evaluate(() => __blr.match.player.weapons[0]?.ammo);
await touch('touchStart', [[fb.x + fb.width / 2, fb.y + fb.height / 2]]);
await page.waitForTimeout(400);
await touch('touchMove', [[fb.x + fb.width / 2 - 40, fb.y + fb.height / 2 - 10]]);
await page.waitForTimeout(250);
await shot('08-shooting');
await touch('touchEnd', []);
const shotsAfter = await page.evaluate(() => __blr.match.player.weapons[0]?.ammo);
check(shotsAfter < shotsBefore, `attack button fires (${shotsBefore} → ${shotsAfter})`);

// Pause menu opens and resumes
await page.tap('#pauseBtn');
await page.waitForTimeout(300);
await shot('09-pause');
check(await page.$('.modal-overlay') !== null, 'pause menu opens');
await page.tap('.modal-actions .btn-play');
await page.waitForTimeout(300);

// Let the zone tick: fast-forward the simulation a bit, then eliminate the player.
await page.evaluate(() => { const m = __blr.match; for (let i = 0; i < 60 * 70; i++) m.update(1 / 60, null); });
await page.waitForTimeout(300);
await shot('10-zone');
await page.evaluate(() => { const m = __blr.match; m.damage.applyDamage(m.player, 999, null, { ignoreArmor: true, kind: 'zone' }); });
await page.waitForTimeout(600);
await shot('11-eliminated');
await page.waitForFunction(() => globalThis.__blr.state === 'results', null, { timeout: 6000 });
check(true, 'elimination → results');
await page.waitForTimeout(3500);
await shot('12-results');
await page.tap('#again');
await page.waitForFunction(() => globalThis.__blr.state === 'deploy', null, { timeout: 4000 });
check(true, 'PLAY AGAIN → straight to deploy');
await page.tap('#go');
await page.waitForFunction(() => globalThis.__blr.match?.phase === 'live', null, { timeout: 8000 });
// Win path: remove every bot
await page.evaluate(() => { const m = __blr.match; for (const e of m.entities) if (e !== m.player) m.damage.eliminate(e, m.player); });
await page.waitForFunction(() => globalThis.__blr.state === 'results', null, { timeout: 6000 });
await page.waitForTimeout(3000);
await shot('13-victory');
check(await page.$('.results.win') !== null, 'last one standing → victory results');
await page.tap('#menu');
await page.waitForFunction(() => globalThis.__blr.state === 'menu', null, { timeout: 4000 });
check(true, 'results → main menu');
const save = await page.evaluate(() => JSON.parse(localStorage.getItem('battlelands-remake/save/v1')));
check(save && save.stats.matches === 2 && save.stats.wins === 1, `progress saved (matches ${save?.stats.matches}, wins ${save?.stats.wins}, level ${save?.level}, coins ${save?.coins})`);
await shot('14-menu-after');

check(errors.length === 0, `no console errors${errors.length ? ': ' + errors.slice(0, 5).join(' | ') : ''}`);
await browser.close();
console.log(fail ? `${fail} e2e failures` : 'e2e OK');
process.exit(fail ? 1 : 0);
