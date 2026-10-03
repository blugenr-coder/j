/* Loading screens are never blank: logo, a character, a tip, a bar that
   moves. Matchmaking is faked, but faked convincingly and fast (~2s). */
import { el, $ } from './dom.js';
import { t } from './i18n.js';
import { drawPortrait } from '../player/PlayerAnimation.js';
import { CHARACTERS } from '../progression/Cosmetics.js';

export const TIPS = [
  'Stay inside the safe zone.',
  'Bushes hide you until you shoot.',
  'A green arrow on loot means it beats what you carry.',
  'Armor soaks damage before your health does.',
  'Rooftops hide whoever is inside. Listen for shots.',
  'Bridges are choke points. Cross fast or swim slow.',
  'Spark Cannon wins up close. Longshot wins far away.',
  'Tap to auto-aim. Drag the fire button to aim yourself.',
  'Heal behind cover, not in the open.',
];

function portraitLoop(canvas, skin) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = canvas.clientWidth || 200, h = canvas.clientHeight || 220;
  canvas.width = w * dpr; canvas.height = h * dpr;
  const ctx = canvas.getContext('2d');
  let raf = 0, t0 = performance.now();
  const frame = now => {
    const tt = (now - t0) / 1000;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPortrait(ctx, skin, canvas.width / 2, canvas.height * 0.55, (h * dpr) / 230, tt, { pose: 'wave' });
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(raf);
}

/* The splash: purple stage, big title, three heroes with their guns, and a
   loading line along the bottom that fills and drops you in. Used on launch
   and every time you join a match. */
const SQUAD = [
  { skin: 'luna', weapon: 'minigun', x: 0.2, s: 0.86, y: 0.60, phase: 0.0 },
  { skin: 'frost', weapon: 'rifle', x: 0.8, s: 0.86, y: 0.60, phase: 1.3 },
  { skin: 'tango', weapon: 'blaster', x: 0.5, s: 1.0, y: 0.57, phase: 0.6 },
];

function splash(root, { status = '', tip = null, lead = null } = {}) {
  const squad = SQUAD.map(m => ({ ...m }));
  if (lead) squad[2].skin = lead;
  const n = el(`<div class="screen splash" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-label="${t('LOADING...')}">
    <canvas class="splash-art" aria-hidden="true"></canvas>
    <h1 class="splash-title"><span class="t1">Battlelands</span><span class="t2">Remake</span></h1>
    <div class="splash-foot">
      ${tip ? `<p class="splash-tip"><b>${t('TIP')}</b> ${t(tip)}</p>` : ''}
      <div class="splash-status"><span class="st">${status}</span><span class="pct num">0%</span></div>
      <div class="splash-line"><i></i></div>
    </div>
  </div>`);
  root.appendChild(n);
  const cv = $('.splash-art', n), ctx = cv.getContext('2d');
  const embers = [];
  let raf = 0;
  const t0 = performance.now();
  let last = t0;
  const frame = now => {
    if (!n.isConnected) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = cv.clientWidth, h = cv.clientHeight;
    if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
    const W = cv.width, H = cv.height, tt = (now - t0) / 1000, dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const tall = H > W;
    const unit = Math.min(W / (tall ? 2.15 : 2.5), H * (tall ? 0.3 : 0.36)) / 140;
    const floor = H * (tall ? 0.66 : 0.77);
    // floor glow under the squad
    const g = ctx.createRadialGradient(W / 2, floor, 10, W / 2, floor, Math.max(W, H) * 0.55);
    g.addColorStop(0, 'rgba(196,160,255,0.45)'); g.addColorStop(1, 'rgba(196,160,255,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // a smoke column and rising embers on the left
    const sx = W * 0.1;
    const sg = ctx.createLinearGradient(sx - 40 * dpr, 0, sx + 40 * dpr, 0);
    sg.addColorStop(0, 'rgba(255,255,255,0)'); sg.addColorStop(0.5, 'rgba(255,255,255,0.10)'); sg.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = sg; ctx.fillRect(sx - 40 * dpr, 0, 80 * dpr, floor);
    if (embers.length < 40 && Math.random() < 0.6) embers.push({ x: sx + (Math.random() - 0.5) * 50 * dpr, y: floor - 40 * dpr, vy: -(60 + Math.random() * 90) * dpr, life: 1, s: (1.5 + Math.random() * 2.5) * dpr });
    for (let i = embers.length - 1; i >= 0; i--) {
      const e = embers[i];
      e.y += e.vy * dt; e.x += Math.sin(tt * 3 + i) * 0.4 * dpr; e.life -= dt * 0.45;
      if (e.life <= 0) { embers.splice(i, 1); continue; }
      ctx.globalAlpha = e.life; ctx.fillStyle = i % 3 ? '#FF9F43' : '#FFD43B';
      ctx.beginPath(); ctx.arc(e.x, e.y, e.s, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    // the squad: side heroes slightly smaller and behind the leader
    // Fit the squad in the band between the title and the loading line, feet on the floor glow.
    for (const m of squad) {
      const bob = Math.sin(tt * 2.2 + m.phase) * 3 * dpr;
      const sc = unit * m.s;
      drawPortrait(ctx, m.skin, W * m.x, floor - 52 * sc - (m.s < 1 ? 10 * dpr : 0) + bob, sc, tt + m.phase, { weapon: m.weapon, still: false });
    }
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  const line = $('.splash-line i', n), pct = $('.pct', n), st = $('.st', n);
  return {
    node: n,
    set(p, text) {
      const v = Math.round(Math.max(0, Math.min(1, p)) * 100);
      line.style.width = v + '%';
      pct.textContent = v + '%';
      n.setAttribute('aria-valuenow', v);
      if (text !== undefined) st.innerHTML = text;
    },
    close() { cancelAnimationFrame(raf); n.classList.add('out'); setTimeout(() => n.remove(), 260); },
  };
}

/* Shown while the island is built on first launch. */
export function bootScreen(root) {
  const s = splash(root, { status: t('LOADING...') });
  const shown = performance.now();
  let target = 0, cur = 0, raf = 0, closing = null;
  // Ease the line towards the real progress so it reads as one smooth fill.
  const tick = () => {
    cur += (target - cur) * 0.12;
    if (target >= 1 && cur > 0.995) cur = 1;
    s.set(cur);
    if (cur >= 1 && closing && performance.now() - shown > 1400) { closing(); return; }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return {
    progress: p => { target = p; },
    /* resolves once the line has visibly reached the end */
    close: () => new Promise(res => { target = 1; closing = () => { cancelAnimationFrame(raf); s.close(); res(); }; }),
  };
}

/* PLAY → finding players → preparing battlefield → deploying.
   quick: the PLAY AGAIN version, same screen, shorter. */
export function matchmakingScreen(root, skin, onDone, { quick = false } = {}) {
  const tip = TIPS[Math.floor(Math.random() * TIPS.length)];
  const s = splash(root, { status: t('FINDING PLAYERS...'), tip, lead: skin });
  const steps = [
    [0.45, () => t('FINDING PLAYERS...')],
    [0.8, () => t('PREPARING BATTLEFIELD...')],
    [1.01, () => t('DEPLOYING...')],
  ];
  const total = quick ? 1300 : 2600;
  const t0 = performance.now();
  let found = 1, raf = 0, done = false;
  const tick = now => {
    const lin = Math.min(1, (now - t0) / total);
    const k = 1 - Math.pow(1 - lin, 1.6);
    const step = steps.find(st => k < st[0]) || steps[2];
    if (k < 0.45) found = Math.max(found, Math.min(32, Math.round(1 + (k / 0.45) * 31)));
    s.set(k, k < 0.45 ? `${step[1]()} <span class="num">${found}/32</span>` : step[1]());
    if (lin < 1) raf = requestAnimationFrame(tick);
    else if (!done) { done = true; onDone(); setTimeout(() => s.close(), 40); }
  };
  raf = requestAnimationFrame(tick);
  return { cancel: () => { cancelAnimationFrame(raf); s.close(); } };
}

export { portraitLoop };
