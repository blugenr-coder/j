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

/* Shown while the island is built on first launch. */
export function bootScreen(root) {
  const n = el(`<div class="screen loading">
    <div class="logo"><span class="l1">Battlelands</span><span class="l2">REMAKE</span></div>
    <div class="progress"><i id="bootBar"></i></div>
    <div class="status small">${t('LOADING...')}</div>
  </div>`);
  root.appendChild(n);
  return {
    progress: p => { $('#bootBar', n).style.width = `${Math.round(p * 100)}%`; },
    close: () => { n.classList.add('out'); setTimeout(() => n.remove(), 200); },
  };
}

/* PLAY → finding players → preparing battlefield → deploying. */
export function matchmakingScreen(root, skin, onDone) {
  const tip = TIPS[Math.floor(Math.random() * TIPS.length)];
  const art = Math.random() < 0.5 ? skin : CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)].id;
  const n = el(`<div class="screen loading">
    <div class="logo"><span class="l1">Battlelands</span><span class="l2">REMAKE</span></div>
    <canvas class="portrait"></canvas>
    <div class="tip-card card"><div><span class="tag">${t('TIP')}</span><p>${t(tip)}</p></div></div>
    <div class="progress"><i></i></div>
    <div class="status"></div>
  </div>`);
  root.appendChild(n);
  const stop = portraitLoop($('canvas', n), art);
  const bar = $('.progress i', n), status = $('.status', n);
  const steps = [
    [0, 0.45, () => t('FINDING PLAYERS...')],
    [0.45, 0.8, () => t('PREPARING BATTLEFIELD...')],
    [0.8, 1, () => t('DEPLOYING...')],
  ];
  const total = 2000;
  const t0 = performance.now();
  let found = 1;
  let raf = 0;
  const tick = now => {
    const k = Math.min(1, (now - t0) / total);
    bar.style.width = `${k * 100}%`;
    const s = steps.find(st => k >= st[0] && k <= st[1]) || steps[2];
    if (k < 0.45) found = Math.max(found, Math.min(32, Math.round(1 + (k / 0.45) * 31 + Math.random())));
    status.innerHTML = k < 0.45 ? `${s[2]} <span class="num">${found}/32</span>` : s[2]();
    if (k < 1) raf = requestAnimationFrame(tick);
    else { stop(); onDone(); setTimeout(() => { n.classList.add('out'); setTimeout(() => n.remove(), 200); }, 60); }
  };
  raf = requestAnimationFrame(tick);
  return { cancel: () => { cancelAnimationFrame(raf); stop(); n.remove(); } };
}

export { portraitLoop };
