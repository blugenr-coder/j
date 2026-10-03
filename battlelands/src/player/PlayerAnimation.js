/* Original character art, drawn procedurally so every skin is crisp at any
   size and costs no image downloads. Two views share one palette per skin:
   - drawTopDown: in-match, seen from the high camera, facing the aim
   - drawPortrait: front view for menus, cards and results */

import { characterById } from '../progression/Cosmetics.js';

const OUTLINE = '#10162A';
const GUN_LEN = { pistol: 17, burst: 25, smg: 21, shotgun: 26, dmr: 31, sniper: 37, launcher: 30 };

function ell(ctx, x, y, rx, ry, fill, stroke = OUTLINE, lw = 2.5) {
  ctx.beginPath();
  ctx.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), 0, 0, Math.PI * 2);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.lineWidth = lw; ctx.strokeStyle = stroke; ctx.stroke(); }
}

function rrect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/* ent-like options: { facing, aim, walk, moving, attack, flash, weapon (def or null), skin, alpha } */
export function drawTopDown(ctx, x, y, o) {
  const c = characterById(o.skin);
  const r = 18;
  const f = o.facing;
  ctx.save();
  ctx.translate(x, y);
  if (o.alpha !== undefined) ctx.globalAlpha = o.alpha;

  // feet: alternate along the facing axis while walking
  const step = o.moving ? Math.sin(o.walk * 2) * 6 : 0;
  ctx.save();
  ctx.rotate(f);
  ell(ctx, 3 + step, -9, 6, 5, c.body, OUTLINE, 2);
  ell(ctx, 3 - step, 9, 6, 5, c.body, OUTLINE, 2);
  ctx.restore();

  // weapon + hands, rotated to the aim
  ctx.save();
  ctx.rotate(o.aim);
  const w = o.weapon;
  const kick = (o.attack || 0) * 5;
  if (!w || w.melee) {
    const punch = (o.attack || 0) * 14;
    ell(ctx, r - 2 + punch, -7, 6, 6, c.body, OUTLINE, 2.2);
    ell(ctx, r - 4, 9, 6, 6, c.body, OUTLINE, 2.2);
  } else {
    const len = GUN_LEN[w.icon] || 22;
    const thick = w.icon === 'launcher' ? 11 : w.icon === 'shotgun' ? 8 : 7;
    ctx.fillStyle = '#2B3350';
    ctx.strokeStyle = OUTLINE;
    ctx.lineWidth = 2.2;
    rrect(ctx, r - 8 - kick, -thick / 2 + 2, len, thick, 3);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = w.color;
    ctx.fillRect(r - 6 - kick + len * 0.45, -thick / 2 + 3.2, len * 0.35, thick - 2.4);
    ell(ctx, r - 6 - kick, 6, 5.5, 5.5, c.body, OUTLINE, 2);
    ell(ctx, r - 1 - kick + len * 0.35, -1, 5, 5, c.body, OUTLINE, 2);
  }
  ctx.restore();

  // body
  const squash = o.moving ? 1 + Math.sin(o.walk * 4) * 0.035 : 1;
  ell(ctx, 0, 0, r * squash, r / squash, c.body, OUTLINE, 3);
  // belly highlight toward facing
  ell(ctx, Math.cos(f) * 5, Math.sin(f) * 5, r * 0.55, r * 0.55, c.belly, null);
  // visor: a band across the front of the head
  ctx.save();
  ctx.rotate(f);
  ctx.beginPath();
  ctx.arc(0, 0, r - 3.5, -0.85, 0.85);
  ctx.lineWidth = 7;
  ctx.strokeStyle = c.visor;
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, r - 3.5, -0.85, 0.85);
  ctx.lineWidth = 1.6;
  ctx.strokeStyle = 'rgba(255,255,255,0.65)';
  ctx.stroke();
  drawAccessoryTop(ctx, c, r);
  ctx.restore();

  // hit flash: white overlay, short
  if (o.flash > 0) {
    ctx.globalAlpha = (o.alpha ?? 1) * o.flash * 0.75;
    ell(ctx, 0, 0, r + 1, r + 1, '#FFFFFF', null);
  }
  ctx.restore();
}

/* Accessory as seen from above, in facing-space (+x is forward). */
function drawAccessoryTop(ctx, c, r) {
  const a = c.accColor || c.body;
  switch (c.acc) {
    case 'band':
      ctx.beginPath(); ctx.arc(0, 0, r - 1, 1.2, Math.PI * 2 - 1.2, false);
      ctx.lineWidth = 4; ctx.strokeStyle = a; ctx.stroke();
      break;
    case 'sprout':
      ell(ctx, -4, -6, 4, 7, a, OUTLINE, 1.8); ell(ctx, -4, 6, 4, 7, a, OUTLINE, 1.8);
      break;
    case 'ears':
      ell(ctx, -10, -9, 9, 4.5, a, OUTLINE, 2); ell(ctx, -10, 9, 9, 4.5, a, OUTLINE, 2);
      break;
    case 'antenna':
      ctx.beginPath(); ctx.moveTo(-2, 0); ctx.lineTo(-14, -10); ctx.lineWidth = 2.5; ctx.strokeStyle = OUTLINE; ctx.stroke();
      ell(ctx, -14, -10, 4, 4, a, OUTLINE, 2);
      break;
    case 'beanie':
      ell(ctx, -3, 0, r * 0.62, r * 0.62, a, OUTLINE, 2);
      ell(ctx, -6, 0, 4, 4, '#FFFFFF', OUTLINE, 1.8);
      break;
    case 'flame':
      ctx.beginPath(); ctx.moveTo(4, -7); ctx.quadraticCurveTo(-20, -12, -22, 0); ctx.quadraticCurveTo(-20, 12, 4, 7); ctx.closePath();
      ctx.fillStyle = a; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = OUTLINE; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, -3); ctx.quadraticCurveTo(-12, -5, -14, 0); ctx.quadraticCurveTo(-12, 5, 0, 3); ctx.fillStyle = '#FFD43B'; ctx.fill();
      break;
    case 'star':
      star(ctx, -2, 0, 8, 3.6, a);
      break;
    case 'fin':
      ctx.beginPath(); ctx.moveTo(6, 0); ctx.quadraticCurveTo(-8, -6, -22, 0); ctx.quadraticCurveTo(-8, 6, 6, 0);
      ctx.fillStyle = a; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = OUTLINE; ctx.stroke();
      break;
    case 'spikes':
      for (let i = 0; i < 4; i++) {
        const sx = 4 - i * 7;
        ctx.beginPath(); ctx.moveTo(sx, -4); ctx.lineTo(sx - 6, 0); ctx.lineTo(sx, 4); ctx.closePath();
        ctx.fillStyle = a; ctx.fill(); ctx.lineWidth = 1.6; ctx.strokeStyle = OUTLINE; ctx.stroke();
      }
      break;
    case 'horns':
      ell(ctx, -6, -12, 6, 3.5, a, OUTLINE, 1.8); ell(ctx, -6, 12, 6, 3.5, a, OUTLINE, 1.8);
      break;
    case 'crown':
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const ang = (i / 5) * Math.PI * 2;
        ctx.lineTo(-2 + Math.cos(ang) * 9, Math.sin(ang) * 9);
        ctx.lineTo(-2 + Math.cos(ang + 0.63) * 5, Math.sin(ang + 0.63) * 5);
      }
      ctx.closePath(); ctx.fillStyle = a; ctx.fill(); ctx.lineWidth = 1.8; ctx.strokeStyle = OUTLINE; ctx.stroke();
      break;
  }
}

function star(ctx, x, y, R, r, fill) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const ang = -Math.PI / 2 + (i * Math.PI) / 5, rad = i % 2 ? r : R;
    ctx.lineTo(x + Math.cos(ang) * rad, y + Math.sin(ang) * rad);
  }
  ctx.closePath();
  ctx.fillStyle = fill; ctx.fill();
  ctx.lineWidth = 1.8; ctx.strokeStyle = OUTLINE; ctx.stroke();
}

/* Front view. (cx, cy) is the centre of the body; s is the scale (1 ≈ 100px tall).
   t drives the idle bob and blink. */
export function drawPortrait(ctx, skinId, cx, cy, s, t = 0, opts = {}) {
  const c = characterById(skinId);
  const bob = opts.still ? 0 : Math.sin(t * 2.4) * 2.2 * s;
  const breathe = opts.still ? 1 : 1 + Math.sin(t * 2.4) * 0.018;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(s, s);
  const lw = 3.2;

  // shadow
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  ctx.beginPath(); ctx.ellipse(0, 52, 34, 7, 0, 0, Math.PI * 2); ctx.fill();

  ctx.translate(0, bob / s);
  // feet
  ell(ctx, -14, 46, 11, 7, c.body, OUTLINE, lw);
  ell(ctx, 14, 46, 11, 7, c.body, OUTLINE, lw);
  // arms (a little wave on 'wave' pose)
  const wave = opts.pose === 'wave' ? Math.sin(t * 9) * 0.35 - 0.9 : 0.25 + Math.sin(t * 2.4) * 0.05;
  ctx.save(); ctx.translate(-32, 8); ctx.rotate(0.25); ell(ctx, 0, 8, 7, 12, c.body, OUTLINE, lw); ctx.restore();
  ctx.save(); ctx.translate(32, 8); ctx.rotate(-wave); ell(ctx, 0, 8, 7, 12, c.body, OUTLINE, lw); ctx.restore();

  // body (bean)
  ctx.save();
  ctx.scale(breathe, 1 / breathe);
  ctx.beginPath();
  ctx.moveTo(0, -48);
  ctx.bezierCurveTo(30, -48, 36, -22, 36, 4);
  ctx.bezierCurveTo(36, 34, 22, 46, 0, 46);
  ctx.bezierCurveTo(-22, 46, -36, 34, -36, 4);
  ctx.bezierCurveTo(-36, -22, -30, -48, 0, -48);
  ctx.closePath();
  ctx.fillStyle = c.body; ctx.fill();
  ctx.lineWidth = lw; ctx.strokeStyle = OUTLINE; ctx.stroke();
  // belly
  ctx.beginPath(); ctx.ellipse(0, 22, 21, 17, 0, 0, Math.PI * 2); ctx.fillStyle = c.belly; ctx.fill();
  // body shine
  ctx.beginPath(); ctx.ellipse(-18, -24, 5, 10, 0.4, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fill();
  ctx.restore();

  // visor
  const blink = !opts.still && (t % 3.6) > 3.45;
  rrect(ctx, -26, -24, 52, 22, 11);
  ctx.fillStyle = c.visor; ctx.fill(); ctx.lineWidth = lw; ctx.strokeStyle = OUTLINE; ctx.stroke();
  // eyes inside the visor
  ctx.fillStyle = c.visor === '#17213D' || c.visor === '#1E3A8A' ? '#FFFFFF' : OUTLINE;
  if (blink) {
    ctx.fillRect(-14, -14, 9, 2.5); ctx.fillRect(5, -14, 9, 2.5);
  } else {
    ctx.beginPath(); ctx.ellipse(-9.5, -13, 3.6, 4.6, 0, 0, Math.PI * 2); ctx.ellipse(9.5, -13, 3.6, 4.6, 0, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  rrect(ctx, -21, -21, 14, 4, 2); ctx.fill();

  drawAccessoryFront(ctx, c, t, lw);
  ctx.restore();
}

function drawAccessoryFront(ctx, c, t, lw) {
  const a = c.accColor || c.body;
  ctx.lineWidth = lw; ctx.strokeStyle = OUTLINE;
  switch (c.acc) {
    case 'band':
      rrect(ctx, -34, -40, 68, 10, 5); ctx.fillStyle = a; ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(30, -36); ctx.lineTo(46, -30); ctx.lineTo(42, -40); ctx.closePath(); ctx.fillStyle = a; ctx.fill(); ctx.stroke();
      break;
    case 'sprout':
      ctx.beginPath(); ctx.moveTo(0, -47); ctx.lineTo(0, -60); ctx.stroke();
      ctx.save(); ctx.translate(-8, -62); ctx.rotate(-0.5); ell(ctx, 0, 0, 9, 5, a, OUTLINE, lw); ctx.restore();
      ctx.save(); ctx.translate(8, -64); ctx.rotate(0.5); ell(ctx, 0, 0, 9, 5, a, OUTLINE, lw); ctx.restore();
      break;
    case 'ears':
      ctx.save(); ctx.translate(-14, -60); ctx.rotate(-0.2 + Math.sin(t * 3) * 0.05); ell(ctx, 0, 0, 7, 18, c.body, OUTLINE, lw); ell(ctx, 0, 2, 3.5, 12, a, null); ctx.restore();
      ctx.save(); ctx.translate(14, -60); ctx.rotate(0.2 - Math.sin(t * 3) * 0.05); ell(ctx, 0, 0, 7, 18, c.body, OUTLINE, lw); ell(ctx, 0, 2, 3.5, 12, a, null); ctx.restore();
      break;
    case 'antenna':
      ctx.beginPath(); ctx.moveTo(0, -47); ctx.quadraticCurveTo(6 + Math.sin(t * 4) * 4, -60, 4 + Math.sin(t * 4) * 6, -70); ctx.stroke();
      ell(ctx, 4 + Math.sin(t * 4) * 6, -72, 6, 6, a, OUTLINE, lw);
      break;
    case 'beanie':
      ctx.beginPath(); ctx.moveTo(-31, -32); ctx.bezierCurveTo(-30, -62, 30, -62, 31, -32); ctx.closePath(); ctx.fillStyle = a; ctx.fill(); ctx.stroke();
      rrect(ctx, -34, -36, 68, 10, 5); ctx.fillStyle = '#FFFFFF'; ctx.fill(); ctx.stroke();
      ell(ctx, 0, -60, 8, 8, '#FFFFFF', OUTLINE, lw);
      break;
    case 'flame': {
      const fl = Math.sin(t * 10) * 2;
      ctx.beginPath(); ctx.moveTo(-22, -40); ctx.quadraticCurveTo(-24, -66, -8, -76 + fl); ctx.quadraticCurveTo(-6, -60, 2, -62); ctx.quadraticCurveTo(6, -80, 18, -84 - fl); ctx.quadraticCurveTo(26, -60, 22, -40); ctx.closePath();
      ctx.fillStyle = a; ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-10, -44); ctx.quadraticCurveTo(-8, -60, 4, -66 + fl); ctx.quadraticCurveTo(12, -56, 10, -44); ctx.fillStyle = '#FFD43B'; ctx.fill();
      break;
    }
    case 'star':
      ctx.beginPath(); ctx.moveTo(-30, -30); ctx.bezierCurveTo(-30, -60, 30, -60, 30, -30); ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.fill(); ctx.stroke();
      star(ctx, 0, -60, 14, 6, a);
      break;
    case 'fin':
      ctx.beginPath(); ctx.moveTo(-8, -46); ctx.quadraticCurveTo(4, -76, 20, -74); ctx.quadraticCurveTo(10, -60, 12, -44); ctx.closePath(); ctx.fillStyle = a; ctx.fill(); ctx.stroke();
      ell(ctx, -20, 12, 6, 4, a, null); ell(ctx, 18, 26, 5, 3, a, null);
      break;
    case 'spikes':
      for (let i = -2; i <= 2; i++) {
        const sx = i * 11, sy = -46 + Math.abs(i) * 4;
        ctx.beginPath(); ctx.moveTo(sx - 6, sy + 3); ctx.lineTo(sx, sy - 13); ctx.lineTo(sx + 6, sy + 3); ctx.closePath();
        ctx.fillStyle = a; ctx.fill(); ctx.stroke();
      }
      break;
    case 'horns':
      ctx.beginPath(); ctx.moveTo(-20, -42); ctx.quadraticCurveTo(-40, -58, -30, -76); ctx.quadraticCurveTo(-28, -58, -10, -46); ctx.closePath(); ctx.fillStyle = a; ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(20, -42); ctx.quadraticCurveTo(40, -58, 30, -76); ctx.quadraticCurveTo(28, -58, 10, -46); ctx.closePath(); ctx.fillStyle = a; ctx.fill(); ctx.stroke();
      break;
    case 'crown':
      ctx.beginPath(); ctx.moveTo(-20, -44); ctx.lineTo(-22, -70); ctx.lineTo(-10, -58); ctx.lineTo(0, -74); ctx.lineTo(10, -58); ctx.lineTo(22, -70); ctx.lineTo(20, -44); ctx.closePath();
      ctx.fillStyle = a; ctx.fill(); ctx.stroke();
      ell(ctx, 0, -52, 3.5, 3.5, '#FF6B6B', null);
      break;
  }
}
