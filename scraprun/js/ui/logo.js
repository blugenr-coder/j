/* The SCRAPRUN logo, built as SVG.

   Vector rather than an image so it is sharp at any window size, and
   generated so its rough edges and wear are part of the brand rather than a
   texture we do not have. The randomness is seeded: the logo is identical on
   every launch. */

import { createRng } from '../core/rng.js';

const VB_W = 1000, VB_H = 360;

/** Roughens a polygon: subdivides each edge and nudges points off the line,
    with the occasional deeper chip, like torn sheet metal. */
function roughen(points, rng, { step = 14, jitter = 2.2, chip = 0.06, chipDepth = 7 } = {}) {
  const out = [];
  for (let i = 0; i < points.length; i++) {
    const [x1, y1] = points[i], [x2, y2] = points[(i + 1) % points.length];
    const len = Math.hypot(x2 - x1, y2 - y1);
    const nx = -(y2 - y1) / len, ny = (x2 - x1) / len;   // inward normal for clockwise points
    const n = Math.max(1, Math.round(len / step));
    for (let k = 0; k < n; k++) {
      const t = k / n;
      let off = k === 0 ? 0 : rng.range(-jitter, jitter);
      if (k > 0 && rng.chance(chip)) off = rng.range(chipDepth * 0.5, chipDepth);
      out.push([x1 + (x2 - x1) * t + nx * off, y1 + (y2 - y1) * t + ny * off]);
    }
  }
  return out.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
}

function gearPath(cx, cy, r, teeth, depth = 0.16, hole = 0.38) {
  const pts = [];
  const N = teeth * 4;
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const phase = i % 4;
    const rr = phase === 1 || phase === 2 ? r : r * (1 - depth);
    pts.push(`${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`);
  }
  const h = r * hole;
  /* outer ring, then the hole drawn the other way so evenodd cuts it out */
  return `M${pts.join('L')}Z M${cx + h},${cy} A${h},${h} 0 1 0 ${cx - h},${cy} A${h},${h} 0 1 0 ${cx + h},${cy}Z`;
}

/** Specks and scratches for the worn-paint mask on the lettering. */
function wear(rng) {
  let s = '';
  for (let i = 0; i < 170; i++) {
    const x = rng.range(90, 910), y = rng.range(70, 250), r = rng.range(0.8, 3.6);
    const pts = Array.from({ length: 5 }, (_, k) => {
      const a = (k / 5) * Math.PI * 2 + rng.range(-0.4, 0.4), rr = r * rng.range(0.6, 1.3);
      return `${(x + Math.cos(a) * rr).toFixed(1)},${(y + Math.sin(a) * rr).toFixed(1)}`;
    });
    s += `<polygon points="${pts.join(' ')}"/>`;
  }
  for (let i = 0; i < 16; i++) {
    const x = rng.range(100, 900), y = rng.range(80, 240), len = rng.range(20, 70), a = rng.range(-0.5, 0.5);
    s += `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${(x + Math.cos(a) * len).toFixed(1)}" y2="${(y + Math.sin(a) * len).toFixed(1)}" stroke="#000" stroke-width="${rng.range(0.8, 2).toFixed(1)}" stroke-linecap="round"/>`;
  }
  return s;
}

export function createLogo() {
  const rng = createRng(2024);
  const plate = roughen([[70, 30], [930, 30], [980, 100], [945, 262], [55, 262], [20, 192]], rng);
  const inner = [[92, 50], [908, 50], [952, 104], [922, 244], [78, 244], [44, 186]]
    .map(([x, y]) => `${x},${y}`).join(' ');
  const tab = roughen([[200, 255], [800, 255], [762, 324], [238, 324]], rng, { step: 12, jitter: 1.6, chip: 0.04, chipDepth: 5 });

  const el = document.createElement('div');
  el.className = 'logo';
  el.innerHTML = `
<svg class="logo__svg" viewBox="0 0 ${VB_W} ${VB_H}" role="img" aria-labelledby="logo-title">
  <title id="logo-title">SCRAPRUN — Build, Fight, Survive</title>
  <defs>
    <linearGradient id="lg-plate" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1e1e21"/><stop offset="0.55" stop-color="#0d0d0f"/><stop offset="1" stop-color="#050506"/>
    </linearGradient>
    <linearGradient id="lg-scrap" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff"/><stop offset="0.6" stop-color="#ebe7df"/><stop offset="1" stop-color="#bdb6aa"/>
    </linearGradient>
    <linearGradient id="lg-run" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffe45c"/><stop offset="0.45" stop-color="#ffb81c"/><stop offset="1" stop-color="#ff7a00"/>
    </linearGradient>
    <linearGradient id="lg-sheen" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.5" stop-color="#fff" stop-opacity="0.85"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <pattern id="pt-hazard" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="22" height="22" fill="#111"/><rect width="11" height="22" fill="#ff9f1a"/>
    </pattern>
    <clipPath id="cp-plate"><polygon points="${plate}"/></clipPath>
    <mask id="mk-wear" maskUnits="userSpaceOnUse" x="0" y="0" width="${VB_W}" height="${VB_H}">
      <rect width="${VB_W}" height="${VB_H}" fill="#fff"/>
      <g fill="#000">${wear(rng)}</g>
    </mask>
    <clipPath id="cp-run"><text class="logo__word" x="604" y="214" textLength="306" lengthAdjust="spacingAndGlyphs">RUN</text></clipPath>
  </defs>

  <!-- backing plate -->
  <polygon points="${plate}" fill="url(#lg-plate)"/>
  <g clip-path="url(#cp-plate)">
    <g class="logo__gear logo__gear--a"><path d="${gearPath(150, 150, 150, 12)}" fill="#1b1b1e" fill-rule="evenodd"/></g>
    <g class="logo__gear logo__gear--b"><path d="${gearPath(880, 205, 105, 10)}" fill="#18181b" fill-rule="evenodd"/></g>
    <rect x="0" y="246" width="${VB_W}" height="18" fill="url(#pt-hazard)" opacity="0.85"/>
  </g>
  <polygon points="${inner}" fill="none" stroke="#2c2c31" stroke-width="2"/>
  ${[[96, 62], [904, 62], [92, 232], [908, 232]].map(([x, y]) =>
    `<circle cx="${x}" cy="${y}" r="5" fill="#34343a"/><circle cx="${x - 1.2}" cy="${y - 1.4}" r="2" fill="#5a5a62"/>`).join('')}

  <!-- lettering: a dark extrusion under each word gives it weight -->
  <g transform="skewX(-7) translate(22 0)">
    <g mask="url(#mk-wear)">
      <text class="logo__word" x="94" y="222" textLength="490" lengthAdjust="spacingAndGlyphs" fill="#000" opacity="0.85">SCRAP</text>
      <text class="logo__word" x="604" y="222" textLength="306" lengthAdjust="spacingAndGlyphs" fill="#6b2a00">RUN</text>
      <text class="logo__word" x="94" y="214" textLength="490" lengthAdjust="spacingAndGlyphs" fill="url(#lg-scrap)" stroke="#2a2a2a" stroke-width="1.5">SCRAP</text>
      <text class="logo__word" x="604" y="214" textLength="306" lengthAdjust="spacingAndGlyphs" fill="url(#lg-run)" stroke="#5a2400" stroke-width="1.5">RUN</text>
    </g>
    <g clip-path="url(#cp-run)">
      <rect class="logo__sheen" x="520" y="60" width="90" height="200" fill="url(#lg-sheen)"/>
    </g>
  </g>

  <!-- tagline tab -->
  <g class="logo__tab">
    <polygon points="${tab}" fill="#0b0b0c"/>
    <polygon points="218,262 782,262 750,317 250,317" fill="none" stroke="#26262b" stroke-width="1.5"/>
    <text class="logo__tagline" x="500" y="300" text-anchor="middle">BUILD <tspan class="logo__dot">•</tspan> FIGHT <tspan class="logo__dot">•</tspan> SURVIVE</text>
  </g>
</svg>`;
  return el;
}
