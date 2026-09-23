/* The pictures on a preschool worksheet.

   A four-year-old cannot read the question, so the picture is the question.
   Every preschool generator hangs an `art` descriptor on its question — a ten
   frame, a row of pictures, a maze, a trace line — and this file draws it.

   One drawing serves both screens: the online player and the printed sheet
   both build DOM with the same `el()`, so both call the same function here
   and get the same picture. A picture that only worked on screen would be
   worse than no picture, because the whole point of a preschool sheet is that
   it ends up on a table with a crayon next to it.

   Everything is either an emoji or an SVG drawn here. No image files, so
   nothing to ship, nothing to license, nothing to go missing behind a slow
   connection, and the pictures scale with the text rather than turning to mush
   on a 300 dpi printer.                                                     */

import { el, esc } from './util.js';

const SVG = 'http://www.w3.org/2000/svg';
const svg = (viewBox, body, cls = '') =>
  `<svg xmlns="${SVG}" viewBox="${viewBox}" class="pk-svg ${cls}" role="img" aria-hidden="true">${body}</svg>`;

const pic = (glyph, cls = '') =>
  `<span class="pk-pic ${cls}" translate="no">${esc(String(glyph ?? ''))}</span>`;

/* A writing box: where the child puts the answer. Printed sheets need it more
   than screens do, but leaving it on screen too keeps the two the same shape
   so a child who does one then the other is not meeting a new page. */
const writeBox = () => `<span class="pk-writebox"></span>`;

/* --------------------------------- the kinds --------------------------------- */

const K = {};

/* row — pictures in a line. The bread and butter: count these, order these,
   which of these, what comes next. */
K.row = a => {
  const items = a.items ?? [];
  const cells = items.map((x, i) => {
    const n = a.numbered ? `<span class="pk-num">${i + 1}</span>` : '';
    const box = a.numbered ? writeBox() : '';
    return `<span class="pk-cell">${n}${pic(x.glyph, a.big ? 'is-big' : '')}${box}</span>`;
  }).join('');
  return `<div class="pk-row ${a.big ? 'is-big' : ''}">${cells}</div>`;
};

/* grid — a jumble to hunt through. */
K.grid = a => {
  const cells = (a.cells ?? []).map(c => `<span class="pk-cell">${pic(c.glyph)}</span>`).join('');
  return `<div class="pk-grid" style="--pk-cols:${a.cols ?? 5}">${cells}</div>`;
};

/* tenframe — five and five, the standard picture of a number under ten. */
K.tenframe = a => {
  const n = Math.max(0, Math.min(10, a.n ?? 0));
  let body = '';
  for (let i = 0; i < 10; i++) {
    const x = (i % 5) * 26 + 3, y = Math.floor(i / 5) * 26 + 3;
    body += `<rect x="${x}" y="${y}" width="26" height="26" class="pk-frame"/>`;
    if (i < n) body += `<circle cx="${x + 13}" cy="${y + 13}" r="9" class="pk-counter"/>`;
  }
  return svg('0 0 136 58', body, 'pk-tenframe');
};

/* trace — dotted letters to go over, then empty rule to write on. */
K.trace = a => {
  const text = String(a.text ?? '');
  const ghosts = Array.from({ length: a.repeats ?? 3 },
    () => `<span class="pk-ghost" translate="no">${esc(text)}</span>`).join('');
  const blanks = Array.from({ length: a.blanks ?? 0 },
    () => `<span class="pk-ghost is-blank"></span>`).join('');
  /* Three rules — top, dashed middle, baseline — is how handwriting is taught
     everywhere the catalogue's twenty countries teach it. */
  return `<div class="pk-trace"><div class="pk-rule">${ghosts}${blanks}</div></div>`;
};

/* dots — join the numbers and a shape appears. The points sit on a circle, so
   joining them in order really does draw something. */
K.dots = a => {
  const labels = (a.labels ?? []).map(String);
  const n = labels.length;
  if (!n) return '';
  let body = '';
  labels.forEach((lab, i) => {
    const t = (i / n) * Math.PI * 2 - Math.PI / 2;
    const x = 60 + Math.cos(t) * 44, y = 52 + Math.sin(t) * 40;
    body += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.6" class="pk-dot"/>`;
    const lx = 60 + Math.cos(t) * 54, ly = 52 + Math.sin(t) * 50;
    body += `<text x="${lx.toFixed(1)}" y="${(ly + 3).toFixed(1)}" class="pk-dot-label">${esc(lab)}</text>`;
  });
  return svg('0 0 120 104', body, 'pk-dots');
};

/* maze — a path to follow with a pencil. */
K.maze = a => {
  const d = a.d ?? 'M8 20 Q30 4 52 20 T96 20 Q118 34 118 52 Q118 70 96 70 T52 70 Q30 86 8 70';
  const step = a.step ? `<span class="pk-maze-step">${esc(String(a.step))}</span>` : '';
  const blockers = (a.blockers ?? []).map(b => `<span class="pk-pic">${esc(String(b))}</span>`).join('');
  const body = `<path d="${esc(d)}" class="pk-path is-wide"/><path d="${esc(d)}" class="pk-path is-inner"/>`;
  return `<div class="pk-maze">
    <span class="pk-pic">${esc(String(a.from?.glyph ?? '\u{1F3C1}'))}</span>
    ${svg('0 0 126 90', body, 'pk-maze-svg')}
    <span class="pk-pic">${esc(String(a.to?.glyph ?? '\u{1F3AF}'))}</span>
  </div>${(step || blockers) ? `<div class="pk-maze-legend">${step}${blockers}</div>` : ''}`;
};

/* key — the colour key a colour-by-code page reads from. */
K.key = a => {
  const rows = (a.entries ?? []).map(e =>
    `<span class="pk-key-row"><span class="pk-swatch" style="background:${esc(e.hex ?? '#ccc')}"></span>` +
    `<span class="pk-key-code">${esc(String(e.code))}</span>` +
    `<span class="pk-key-colour">${esc(String(e.colour))}</span></span>`).join('');
  return `<div class="pk-key">${rows}</div>`;
};

/* graph — a bar chart made of pictures, which is what a bar chart is before a
   child can read an axis. */
K.graph = a => {
  const rows = (a.rows ?? []).map(row =>
    `<span class="pk-graph-row"><span class="pk-graph-label">${esc(String(row.label))}</span>` +
    `<span class="pk-graph-bar">${Array.from({ length: row.n }, () => pic(row.glyph)).join('')}</span></span>`
  ).join('');
  return `<div class="pk-graph">${rows}</div>`;
};

/* die — six faces, drawn rather than described. */
K.die = a => {
  const n = Math.max(1, Math.min(6, a.n ?? 1));
  const spots = {
    1: [[24, 24]], 2: [[14, 14], [34, 34]], 3: [[14, 14], [24, 24], [34, 34]],
    4: [[14, 14], [34, 14], [14, 34], [34, 34]],
    5: [[14, 14], [34, 14], [24, 24], [14, 34], [34, 34]],
    6: [[14, 12], [34, 12], [14, 24], [34, 24], [14, 36], [34, 36]]
  }[n];
  const body = `<rect x="2" y="2" width="44" height="44" rx="8" class="pk-frame"/>` +
    spots.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.5" class="pk-counter"/>`).join('');
  return svg('0 0 48 48', body, 'pk-die');
};

/* path — a pre-writing stroke to trace, or a cutting line to snip. */
K.path = a => {
  if (!a.d) return '';
  const cls = a.dashed ? 'pk-path is-cut' : 'pk-path is-stroke';
  const body = `<path d="${esc(a.d)}" class="${cls}"/>` +
    `<circle cx="6" cy="20" r="2.4" class="pk-start"/>`;
  return svg('0 0 44 36', body, 'pk-stroke');
};

/* scene — two pictures, almost the same. */
K.scene = a => {
  const panel = (items, label) =>
    `<div class="pk-panel"><span class="pk-panel-label">${label}</span>` +
    `<div class="pk-row">${(items ?? []).map(x => pic(x.glyph)).join('')}</div></div>`;
  return `<div class="pk-scenes">${panel(a.a, '1')}${panel(a.b, '2')}</div>`;
};

/* shadow — the picture, and the picture with the light turned off. */
K.shadow = a => {
  const items = a.items ?? [];
  return `<div class="pk-shadow">
    <div class="pk-row">${items.map(x => pic(x.glyph)).join('')}</div>
    <div class="pk-row is-shadow">${items.map(x => pic(x.glyph)).join('')}</div>
  </div>`;
};

/* boxes — the two places a sorted picture can go. */
K.boxes = a => {
  const boxes = (a.names ?? []).map(n =>
    `<span class="pk-box"><span class="pk-box-label">${esc(String(n))}</span></span>`).join('');
  return `<div class="pk-boxes">${boxes}</div>`;
};

/* box — somewhere to draw. */
K.box = a => `<div class="pk-drawbox">${a.hint ? pic(a.hint, 'is-faint') : ''}</div>`;

/* clock — an hour hand pointing at the hour, and a minute hand at twelve. */
K.clock = a => {
  const h = ((a.hour ?? 12) % 12);
  const ang = h * 30 - 90;
  const hx = 30 + Math.cos(ang * Math.PI / 180) * 14;
  const hy = 30 + Math.sin(ang * Math.PI / 180) * 14;
  let ticks = '';
  for (let i = 0; i < 12; i++) {
    const t = i * 30 - 90;
    const x1 = 30 + Math.cos(t * Math.PI / 180) * 23, y1 = 30 + Math.sin(t * Math.PI / 180) * 23;
    const x2 = 30 + Math.cos(t * Math.PI / 180) * 26, y2 = 30 + Math.sin(t * Math.PI / 180) * 26;
    ticks += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" class="pk-tick"/>`;
  }
  const body = `<circle cx="30" cy="30" r="28" class="pk-frame"/>${ticks}` +
    `<line x1="30" y1="30" x2="30" y2="10" class="pk-hand is-minute"/>` +
    `<line x1="30" y1="30" x2="${hx.toFixed(1)}" y2="${hy.toFixed(1)}" class="pk-hand is-hour"/>` +
    `<circle cx="30" cy="30" r="2" class="pk-counter"/>`;
  return svg('0 0 60 60', body, 'pk-clock');
};

/* ------------------------------- the entry points ------------------------------- */

/** The picture as HTML, or '' when this question has no picture. */
export function artHTML(art) {
  if (!art || !art.kind) return '';
  const make = K[art.kind];
  if (!make) return '';
  try { return make(art) || ''; } catch { return ''; }
}

/** The picture as a node, ready to append. Null when there is nothing to draw. */
export function artNode(art) {
  const html = artHTML(art);
  return html ? el('div', { class: 'pk-art', html }) : null;
}

export const ART_KINDS = Object.keys(K);
