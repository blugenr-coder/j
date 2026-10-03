/* Results: a big placement number, then stats one by one, then the XP
   breakdown counting up, then reward cards flipping in. A win gets gold and
   the equipped victory effect; a loss gets a calmer, darker screen. */
import { icon } from './Icons.js';
import { el, $, $$, press, formatTime, fmt, sfx, buzz } from './dom.js';
import { t } from './i18n.js';
import { drawPortrait } from '../player/PlayerAnimation.js';
import { xpForLevel } from '../progression/XPManager.js';
import { missionDef, missionText } from '../progression/Missions.js';

export function resultsScreen(root, { result, rewards, before, after, missionsDone, achievements, save, settings, onPlayAgain, onMenu }) {
  const win = result.won;
  const n = el(`<div class="screen results ${win ? 'win' : 'lose'}">
    <canvas class="fx-canvas"></canvas>
    <div class="kicker">${win ? t('LAST ONE STANDING') : t('MATCH COMPLETE')}</div>
    <div class="placement num">#${result.place}<small> ${t('OF')} ${result.total}</small></div>
    <canvas class="portrait"></canvas>
    <div class="res-stats">
      <div class="res-stat card">${icon('clock', { size: 22 })}<b class="num">${formatTime(result.survival)}</b><span>${t('SURVIVAL TIME')}</span></div>
      <div class="res-stat card">${icon('target', { size: 22 })}<b class="num">${result.kills}</b><span>${t('ELIMINATIONS')}</span></div>
      <div class="res-stat card">${icon('bolt', { size: 22 })}<b class="num">${fmt(result.damage)}</b><span>${t('DAMAGE')}</span></div>
    </div>
    <div class="xp-break card">
      <div class="xp-line"><span>${t('MATCH XP')}</span><b class="num">+${rewards.xp.match}</b></div>
      <div class="xp-line"><span>${t('SURVIVAL XP')}</span><b class="num">+${rewards.xp.survival}</b></div>
      <div class="xp-line"><span>${t('ELIMINATION XP')}</span><b class="num">+${rewards.xp.elimination}</b></div>
      <div class="xp-line"><span>${t('PLACEMENT XP')}</span><b class="num">+${rewards.xp.placement}</b></div>
      ${rewards.missionXP ? `<div class="xp-line"><span>${t('MISSION XP')}</span><b class="num">+${rewards.missionXP}</b></div>` : ''}
      <div class="lvl-row"><span class="lv num" id="lv">${before.level}</span><div class="xpbar"><i id="lvbar" style="width:${(before.xp / xpForLevel(before.level)) * 100}%"></i></div></div>
    </div>
    <div class="small caps">${t('REWARDS')}</div>
    <div class="rewards" id="rewards"></div>
    <div class="res-actions">
      <button class="btn btn-play" id="again">${icon('play', { size: 28 })}<span>${t('PLAY AGAIN')}</span></button>
      <button class="btn btn-secondary" id="menu">${icon('home', { size: 22 })}<span>${t('MAIN MENU')}</span></button>
    </div>
  </div>`);
  root.appendChild(n);
  press($('#again', n), onPlayAgain, { sound: 'play', vibrate: 25 });
  press($('#menu', n), onMenu, { sound: 'back' });

  // Character pose: waving if you won, still if not.
  const pc = $('canvas.portrait', n);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let alive = true;
  const t0 = performance.now();
  const drawChar = now => {
    if (!alive || !pc.isConnected) return;
    if (pc.width !== Math.round(pc.clientWidth * dpr)) { pc.width = Math.round(pc.clientWidth * dpr); pc.height = Math.round(pc.clientHeight * dpr); }
    const c = pc.getContext('2d');
    c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, pc.width, pc.height);
    drawPortrait(c, save.equipped.character, pc.width / 2, pc.height * 0.56, pc.height / 165, (now - t0) / 1000, { pose: win ? 'wave' : null, still: settings.reducedMotion });
    requestAnimationFrame(drawChar);
  };
  requestAnimationFrame(drawChar);

  // Reward cards
  const cards = [
    ['xp', `+${rewards.totalXP + (rewards.missionXP || 0)}`, t('XP')],
    ['coins', `+${rewards.coins + (rewards.missionCoins || 0)}`, t('COINS')],
  ];
  for (let i = 0; i < after.level - before.level; i++) cards.push(['level', `${before.level + i + 1}`, t('LEVEL UP!')]);
  for (const m of missionsDone) cards.push(['mission', icon('check', { size: 28 }), missionText(m, t).slice(0, 26)]);
  for (const a of achievements) cards.push(['mission', icon('trophy', { size: 28 }), t(a.text)]);
  const rh = $('#rewards', n);
  for (const [cls, big, small] of cards) {
    rh.insertAdjacentHTML('beforeend', `<div class="reward ${cls}"><div class="face"><b class="num">${big}</b><span>${small}</span></div></div>`);
  }

  // Sequential reveal: stats → XP lines → level bar → reward cards.
  const timers = [];
  const at = (ms, fn) => timers.push(setTimeout(() => { if (n.isConnected) fn(); }, settings.reducedMotion ? 0 : ms));
  sfx(win ? 'victory' : 'defeat');
  if (win) buzz([40, 60, 40, 60, 80]);
  $$('.res-stat', n).forEach((s, i) => at(300 + i * 160, () => { s.classList.add('in'); sfx('tick'); }));
  $$('.xp-line', n).forEach((s, i) => at(850 + i * 140, () => { s.classList.add('in'); sfx('tick'); floatXP(s); }));
  const lvStart = 850 + $$('.xp-line', n).length * 140 + 100;
  // Animate the level bar through each level gained.
  const bar = $('#lvbar', n), lv = $('#lv', n);
  const steps = [];
  for (let L = before.level; L <= after.level; L++) steps.push(L);
  steps.forEach((L, i) => at(lvStart + i * 520, () => {
    lv.textContent = L;
    if (L > before.level) { sfx('level'); lv.classList.remove('bump'); void lv.offsetWidth; lv.classList.add('bump'); bar.style.transition = 'none'; bar.style.width = '0%'; void bar.offsetWidth; bar.style.transition = ''; }
    const target = L === after.level ? (after.xp / xpForLevel(after.level)) * 100 : 100;
    requestAnimationFrame(() => { bar.style.width = target + '%'; });
  }));
  const rStart = lvStart + steps.length * 520;
  $$('.reward', n).forEach((r, i) => at(rStart + i * 220, () => { r.classList.add('in'); sfx('reward'); }));

  // Victory effect (cosmetic) or a slow drift of dark particles.
  const stopFx = runFx($('.fx-canvas', n), win ? save.equipped.victory : 'dim', settings);
  return {
    close() {
      alive = false; stopFx(); timers.forEach(clearTimeout);
      n.classList.add('out'); setTimeout(() => n.remove(), 200);
    },
  };

  function floatXP(line) {
    const v = line.querySelector('b').textContent;
    const f = el(`<span class="float-xp num">${v}</span>`);
    f.style.right = '16px'; f.style.top = '0';
    line.style.position = 'relative';
    line.appendChild(f);
    setTimeout(() => f.remove(), 1000);
  }
}

function runFx(cv, kind, settings) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const ctx = cv.getContext('2d');
  let raf = 0, alive = true;
  const parts = [];
  const W = () => cv.width, H = () => cv.height;
  const resize = () => { cv.width = cv.clientWidth * dpr; cv.height = cv.clientHeight * dpr; };
  resize();
  const colors = ['#FFD43B', '#FF9F43', '#F472B6', '#60A5FA', '#4ADE80', '#A78BFA'];
  const spawn = () => {
    if (kind === 'confetti') parts.push({ x: Math.random() * W(), y: -20, vx: (Math.random() - 0.5) * 60, vy: 120 + Math.random() * 140, r: Math.random() * 6, s: (5 + Math.random() * 6) * dpr, c: colors[(Math.random() * colors.length) | 0], life: 6 });
    else if (kind === 'stars') parts.push({ x: Math.random() * W(), y: -20, vx: -80 - Math.random() * 60, vy: 200 + Math.random() * 120, r: 0, s: (3 + Math.random() * 4) * dpr, c: '#FFFFFF', life: 5, star: true });
    else if (kind === 'gold') parts.push({ x: Math.random() * W(), y: -20, vx: 0, vy: 160 + Math.random() * 160, r: Math.random() * 6, s: (8 + Math.random() * 6) * dpr, c: '#FFD43B', life: 6, coin: true });
    else if (kind === 'fireworks') {
      const cx = W() * (0.15 + Math.random() * 0.7), cy = H() * (0.15 + Math.random() * 0.35), c = colors[(Math.random() * colors.length) | 0];
      for (let i = 0; i < 26; i++) { const a = (i / 26) * Math.PI * 2; parts.push({ x: cx, y: cy, vx: Math.cos(a) * 220, vy: Math.sin(a) * 220, r: 0, s: 3 * dpr, c, life: 1.2, fw: true }); }
    } else if (kind === 'dim') parts.push({ x: Math.random() * W(), y: H() + 10, vx: 0, vy: -20 - Math.random() * 20, r: 0, s: (2 + Math.random() * 3) * dpr, c: 'rgba(125,211,252,0.25)', life: 12 });
  };
  let last = performance.now(), acc = 0, elapsed = 0;
  const frame = now => {
    if (!alive || !cv.isConnected) return;
    const dt = Math.min(0.05, (now - last) / 1000); last = now; elapsed += dt;
    acc += dt;
    const rate = kind === 'fireworks' ? 0.5 : kind === 'dim' ? 0.25 : 0.03;
    if (!settings.reducedMotion && elapsed < (kind === 'dim' ? 999 : 7)) while (acc > rate) { acc -= rate; spawn(); }
    ctx.clearRect(0, 0, W(), H());
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.life -= dt;
      if (p.fw) { p.vy += 140 * dt; p.vx *= 0.98; p.vy *= 0.98; }
      p.x += p.vx * dt * dpr; p.y += p.vy * dt * dpr; p.r += dt * 4;
      if (p.life <= 0 || p.y > H() + 40 || p.y < -60) { parts.splice(i, 1); continue; }
      ctx.globalAlpha = p.fw ? Math.min(1, p.life) : 1;
      ctx.fillStyle = p.c;
      if (p.coin) { ctx.beginPath(); ctx.ellipse(p.x, p.y, p.s * Math.abs(Math.cos(p.r)), p.s, 0, 0, Math.PI * 2); ctx.fill(); }
      else if (p.star) { ctx.fillRect(p.x, p.y, p.s, p.s); ctx.globalAlpha = 0.3; ctx.fillRect(p.x + 8 * dpr, p.y - 12 * dpr, p.s * 0.7, p.s * 0.7); }
      else if (kind === 'confetti') { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); ctx.restore(); }
      else { ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2); ctx.fill(); }
    }
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  window.addEventListener('resize', resize);
  return () => { alive = false; cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
}

export { missionDef };
