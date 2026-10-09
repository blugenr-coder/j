/* The painted parts of the scene: sky, sun, clouds, far ridges and the dirt
   floor. These are 2D because they are either infinitely far away or a flat
   plane — geometry would add cost and nothing visible. All drawing is in the
   1920×1080 design space. */

import { hex, mix, rgb } from '../render/lowpoly.js';

export const SUN = { x: 1460, y: 300 };

export function drawSky(ctx, cam, rng, W, H, pad) {
  const hy = cam.horizonY;
  const g = ctx.createLinearGradient(0, -pad, 0, hy + 20);
  g.addColorStop(0.00, '#1d5aa6');
  g.addColorStop(0.30, '#3d86cf');
  g.addColorStop(0.58, '#83bde3');
  g.addColorStop(0.80, '#e8c39a');
  g.addColorStop(0.93, '#f3a866');
  g.addColorStop(1.00, '#f19a55');
  ctx.fillStyle = g;
  ctx.fillRect(-pad, -pad, W + pad * 2, hy + pad + 40);

  /* sun: a hot core inside a wide warm bloom */
  const s = ctx.createRadialGradient(SUN.x, SUN.y, 0, SUN.x, SUN.y, 760);
  s.addColorStop(0.00, 'rgba(255,248,220,1)');
  s.addColorStop(0.05, 'rgba(255,232,170,0.95)');
  s.addColorStop(0.16, 'rgba(255,190,110,0.45)');
  s.addColorStop(0.45, 'rgba(255,160,90,0.16)');
  s.addColorStop(1.00, 'rgba(255,150,80,0)');
  ctx.fillStyle = s;
  ctx.fillRect(-pad, -pad, W + pad * 2, hy + pad + 40);

  drawClouds(ctx, rng, hy);
}

/* Stylised clouds: clusters of soft discs, lit warm on the side facing the
   sun and shaded cool underneath. */
function drawClouds(ctx, rng, hy) {
  const banks = [
    { x: 260, y: 150, w: 520, s: 1.0 }, { x: 760, y: 70, w: 380, s: 0.7 },
    { x: 1820, y: 190, w: 460, s: 0.9 }, { x: 1180, y: 210, w: 300, s: 0.55 },
    { x: 120, y: 330, w: 420, s: 0.6 }, { x: 1700, y: 380, w: 520, s: 0.55 },
    { x: 560, y: 360, w: 560, s: 0.5 }
  ];
  for (const b of banks) {
    const puffs = 7 + Math.round(b.w / 60);
    const pts = [];
    for (let i = 0; i < puffs; i++) {
      const t = i / (puffs - 1);
      const r = (34 + rng.next() * 46) * b.s * (1 - Math.abs(t - 0.5) * 0.9);
      pts.push({ x: b.x - b.w / 2 + t * b.w + rng.range(-20, 20), y: b.y - r * 0.4 + rng.range(-10, 10), r });
    }
    const near = Math.max(0, 1 - Math.hypot(b.x - SUN.x, b.y - SUN.y) / 900);
    /* shadow side */
    ctx.fillStyle = rgb(mix(hex('#9fb6cf'), hex('#e3a57b'), (b.y / hy) * 0.8), 0.75);
    for (const p of pts) { ctx.beginPath(); ctx.arc(p.x, p.y + p.r * 0.25, p.r, 0, Math.PI * 2); ctx.fill(); }
    /* lit side */
    ctx.fillStyle = rgb(mix(hex('#f4ede4'), hex('#ffd29a'), 0.3 + near * 0.6), 0.9);
    for (const p of pts) {
      ctx.beginPath();
      ctx.arc(p.x + p.r * 0.12, p.y - p.r * 0.08, p.r * 0.86, 0, Math.PI * 2);
      ctx.fill();
    }
    /* flat base, so clouds sit on a level like real cumulus */
    ctx.fillStyle = rgb(mix(hex('#a9bcd2'), hex('#eaaa7e'), (b.y / hy) * 0.9), 0.55);
    ctx.fillRect(b.x - b.w / 2 - 20, b.y + 6 * b.s, b.w + 40, 16 * b.s);
  }
}

/** Distant scrap mountains: jagged ridges that fade into the dust. */
export function drawRidges(ctx, cam, rng, W, pad) {
  const hy = cam.horizonY;
  const ridge = (base, amp, color, step, jag) => {
    ctx.beginPath();
    ctx.moveTo(-pad, hy + 10);
    let y = base;
    for (let x = -pad; x <= W + pad; x += step) {
      /* broad heaps with jagged junk on top */
      const heap = Math.sin(x * 0.0042 + base) * 0.5 + Math.sin(x * 0.011 + base * 2) * 0.3;
      y = hy - base - heap * amp - rng.next() * jag;
      ctx.lineTo(x, y);
      if (rng.chance(0.08)) { ctx.lineTo(x + 2, y - rng.range(8, 26)); ctx.lineTo(x + 7, y - rng.range(4, 18)); }
    }
    ctx.lineTo(W + pad, hy + 10);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  };
  ridge(70, 46, '#d9a27a', 14, 10);
  ridge(42, 34, '#c98b63', 11, 9);
  ridge(18, 22, '#b9774f', 9, 7);
}

/** The arena floor: warm dirt with perspective-correct detail. */
export function drawGround(ctx, cam, rng, W, H, pad) {
  const hy = cam.horizonY;
  const g = ctx.createLinearGradient(0, hy - 2, 0, H + pad);
  g.addColorStop(0.00, '#e6a473');
  g.addColorStop(0.08, '#d48f5c');
  g.addColorStop(0.35, '#b8703f');
  g.addColorStop(0.70, '#8f5230');
  g.addColorStop(1.00, '#5e321c');
  ctx.fillStyle = g;
  ctx.fillRect(-pad, hy - 2, W + pad * 2, H - hy + pad + 2);

  /* a broad sunlit patch across the middle of the arena */
  ctx.save();
  ctx.translate(1180, hy + 120);
  ctx.scale(1, 0.16);
  const p = ctx.createRadialGradient(0, 0, 0, 0, 0, 1100);
  p.addColorStop(0, 'rgba(255,200,140,0.40)');
  p.addColorStop(1, 'rgba(255,200,140,0)');
  ctx.fillStyle = p;
  ctx.beginPath(); ctx.arc(0, 0, 1100, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  const toScreen = (x, z) => cam.project([x, 0, z]);

  /* oil stains and darker patches */
  for (let i = 0; i < 26; i++) {
    const x = rng.range(-30, 30), z = rng.range(5, 70), r = rng.range(0.8, 3.2);
    const c = toScreen(x, z), e = toScreen(x + r, z), f = toScreen(x, z + r);
    const rx = Math.abs(e[0] - c[0]), ry = Math.max(0.5, Math.abs(c[1] - f[1]));
    ctx.save();
    ctx.translate(c[0], c[1]);
    ctx.scale(1, ry / rx);
    const s = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
    s.addColorStop(0, `rgba(60,28,12,${rng.range(0.10, 0.28)})`);
    s.addColorStop(1, 'rgba(60,28,12,0)');
    ctx.fillStyle = s;
    ctx.beginPath(); ctx.arc(0, 0, rx, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  /* tyre tracks: curves on the ground plane, projected so they foreshorten */
  ctx.lineCap = 'round';
  for (let i = 0; i < 9; i++) {
    const cx = rng.range(-12, 12), cz = rng.range(10, 40), R = rng.range(6, 18);
    const a0 = rng.range(0, Math.PI * 2), sweep = rng.range(1.2, 2.6);
    for (const off of [-0.9, 0.9]) {
      ctx.beginPath();
      let first = true;
      for (let k = 0; k <= 40; k++) {
        const a = a0 + (k / 40) * sweep;
        const x = cx + Math.cos(a) * (R + off), z = cz + Math.sin(a) * (R + off);
        if (z < 4) { first = true; continue; }
        const s = toScreen(x, z);
        ctx.lineWidth = Math.max(0.6, 0.35 * cam.focal / s[2]);
        if (first) { ctx.moveTo(s[0], s[1]); first = false; } else ctx.lineTo(s[0], s[1]);
      }
      ctx.strokeStyle = 'rgba(70,35,16,0.18)';
      ctx.stroke();
    }
  }

  /* grit: pebbles and bolts, denser and larger toward the camera */
  for (let i = 0; i < 2600; i++) {
    const z = 3 + Math.pow(rng.next(), 1.8) * 80;
    const x = rng.range(-1, 1) * z * 0.75;
    const s = toScreen(x, z);
    if (s[0] < -pad || s[0] > W + pad || s[1] > H + pad) continue;
    const r = Math.min(2.6, Math.max(0.5, rng.range(0.02, 0.06) * cam.focal / s[2]));
    const light = rng.chance(0.5);
    ctx.fillStyle = light ? `rgba(255,214,170,${rng.range(0.15, 0.4)})` : `rgba(60,30,14,${rng.range(0.15, 0.45)})`;
    ctx.fillRect(s[0], s[1], r * 1.6, r);
  }
}

/** Soft contact shadow under an object, cast away from the sun. */
export function drawShadow(ctx, cam, x, z, s) {
  const lean = Math.min(2.5, s.h * 0.45);
  const cx = x - lean * 0.7, cz = z - lean * 0.35;
  const c = cam.project([cx, 0, cz]);
  if (c[2] <= 0.5) return;
  const e = cam.project([cx + s.rx, 0, cz]);
  const f = cam.project([cx, 0, cz + s.rz]);
  const rx = Math.max(1, Math.abs(e[0] - c[0]) * 1.15);
  const ry = Math.max(1, Math.abs(f[1] - c[1]) * 1.25);
  ctx.save();
  ctx.translate(c[0], c[1]);
  ctx.scale(1, ry / rx);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
  g.addColorStop(0, `rgba(48,20,8,${s.strength ?? 0.55})`);
  g.addColorStop(0.6, `rgba(48,20,8,${(s.strength ?? 0.55) * 0.5})`);
  g.addColorStop(1, 'rgba(48,20,8,0)');
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(0, 0, rx, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
