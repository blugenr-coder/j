// A sample subject drawn in code (front and side), so the studio opens with a
// real model instead of an empty drop zone.

function capsule(ctx, x, y, w, h) {
  const r = Math.min(w, h) / 2;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}

function pot(ctx, cx, top, topW, botW, h) {
  ctx.fillStyle = '#c8643f';
  ctx.beginPath();
  ctx.moveTo(cx - topW / 2, top + 26);
  ctx.lineTo(cx + topW / 2, top + 26);
  ctx.lineTo(cx + botW / 2, top + h);
  ctx.lineTo(cx - botW / 2, top + h);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#d97a52';
  ctx.beginPath();
  ctx.roundRect(cx - topW / 2 - 12, top, topW + 24, 34, 8);
  ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,.12)';
  ctx.fillRect(cx - topW / 2, top + 34, topW, 6);
}

function stripes(ctx, cx, top, h, spread) {
  ctx.strokeStyle = 'rgba(255,255,255,.22)';
  ctx.lineWidth = 4;
  for (const dx of [-spread, 0, spread]) {
    ctx.beginPath();
    ctx.moveTo(cx + dx, top + 28);
    ctx.lineTo(cx + dx * 1.06, top + h - 20);
    ctx.stroke();
  }
}

export function cactusFront(size = 512) {
  const c = Object.assign(document.createElement('canvas'), { width: size, height: size });
  const ctx = c.getContext('2d');
  const k = size / 512;
  ctx.scale(k, k);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 512, 512);

  ctx.fillStyle = '#5f9e5a';
  // arms: elbow out, then up
  capsule(ctx, 120, 222, 90, 46);
  capsule(ctx, 120, 150, 46, 118);
  capsule(ctx, 302, 250, 90, 46);
  capsule(ctx, 346, 186, 46, 110);
  // body
  ctx.fillStyle = '#6aaa63';
  capsule(ctx, 186, 96, 140, 290);
  stripes(ctx, 256, 96, 290, 40);

  // face
  ctx.fillStyle = '#1d2326';
  for (const x of [226, 286]) { ctx.beginPath(); ctx.ellipse(x, 214, 9, 12, 0, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = '#ffffff';
  for (const x of [229, 289]) { ctx.beginPath(); ctx.arc(x, 209, 3.5, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = 'rgba(240,130,140,.55)';
  for (const x of [210, 302]) { ctx.beginPath(); ctx.ellipse(x, 238, 13, 7, 0, 0, Math.PI * 2); ctx.fill(); }
  ctx.strokeStyle = '#1d2326';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(256, 236, 12, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();

  // flower
  ctx.fillStyle = '#f08fb0';
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    ctx.beginPath(); ctx.ellipse(256 + Math.cos(a) * 14, 92 + Math.sin(a) * 10, 11, 9, a, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = '#f6d36b';
  ctx.beginPath(); ctx.arc(256, 92, 7, 0, Math.PI * 2); ctx.fill();

  pot(ctx, 256, 370, 190, 140, 120);
  return c;
}

// Seen from its right side, facing right: the arms hide behind the body.
export function cactusSide(size = 512) {
  const c = Object.assign(document.createElement('canvas'), { width: size, height: size });
  const ctx = c.getContext('2d');
  const k = size / 512;
  ctx.scale(k, k);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 512, 512);
  ctx.fillStyle = '#6aaa63';
  capsule(ctx, 196, 96, 120, 290);
  stripes(ctx, 256, 96, 290, 34);
  ctx.fillStyle = '#f08fb0';
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    ctx.beginPath(); ctx.ellipse(256 + Math.cos(a) * 12, 92 + Math.sin(a) * 9, 10, 8, a, 0, Math.PI * 2); ctx.fill();
  }
  pot(ctx, 256, 370, 190, 140, 120);
  return c;
}
