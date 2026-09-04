/* WorksheetHub — the mark.
   A worksheet with a folded corner and three ruled lines, with a bold W cut
   across it. Drawn rather than lettered so it reads at 16px in a browser tab
   and at 512px on a store listing, and built as one path set so the tile,
   the header lockup and the favicon are all literally the same drawing. */

/* The tile gradient. Kept as fixed hex rather than tokens because the favicon
   is a data URI and cannot reach the page's custom properties. */
const TILE_FROM = '#4B3FD4';
const TILE_TO   = '#161F8C';
const RULE      = '#A7ACEF';

/* Geometry, in a 64×64 box, shared by every rendering of the mark. */
const SHEET = 'M18 40.5V12.5a4 4 0 0 1 4-4h13l10 10v22';
const FOLD  = 'M35 8.5v8a2 2 0 0 0 2 2h8';
const RULES = 'M24 19.5h14M24 26h14M24 32.5h8';
const WSTEM = 'M12.5 29.5 23 52.5 32 37l9 15.5 10.5-23';
/* The small mark: the W alone, scaled to fill the tile. At sixteen pixels the
   sheet outline and the W overlap into one unreadable blob, and it is the W
   that carries the identity — so the small mark keeps the letter and drops
   the page. */
const WSTEM_SMALL = 'M12 19 24 47 32 29l8 18 12-28';

/**
 * @param {object} opts
 *   size   – px, the mark is square
 *   solid  – true for the filled brand tile, false for a line mark on any ground
 */
export function logoMark({ size = 34, solid = true, cls = '' } = {}) {
  const ink = solid ? '#fff' : 'currentColor';
  const rule = solid ? RULE : 'currentColor';
  /* Below about thirty pixels the ruled lines and the folded corner collapse
     into a smudge, so the small mark drops them and keeps the two shapes that
     survive: the sheet outline and the W. */
  const detail = size >= 30;
  return `<svg class="logo-mark ${cls}" width="${size}" height="${size}" viewBox="0 0 64 64"
     role="img" aria-label="WorksheetHub" focusable="false">
    ${detail ? `<path d="${SHEET}" fill="none" stroke="${ink}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="${FOLD}" fill="none" stroke="${ink}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="${RULES}" fill="none" stroke="${rule}" stroke-width="3.4" stroke-linecap="round" opacity="${solid ? 1 : .5}"/>` : ''}
    <path d="${detail ? WSTEM : WSTEM_SMALL}" fill="none" stroke="${ink}" stroke-width="${detail ? 9 : 11}" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

/** The mark inside its brand tile, as used in the header and footer. */
export function logoTile({ size = 34 } = {}) {
  return `<span class="brand-mark" aria-hidden="true">${logoMark({ size: Math.round(size * 0.78), solid: true })}</span>`;
}

/** Wordmark plus mark, for places that need the full lockup. */
export function logoLockup({ size = 34 } = {}) {
  return `${logoTile({ size })}<span class="brand-word">Worksheet<span class="brand-word-accent">Hub</span></span>`;
}

/** The full app icon: the mark on its own tile, for favicons and store art. */
export const ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<defs><linearGradient id="whg" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="${TILE_FROM}"/><stop offset="1" stop-color="${TILE_TO}"/>
</linearGradient></defs>
<rect width="64" height="64" rx="15" fill="url(#whg)"/>
<path d="${SHEET}" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="${FOLD}" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="${RULES}" fill="none" stroke="${RULE}" stroke-width="3.4" stroke-linecap="round"/>
<path d="${WSTEM}" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

/* The tab icon. Same tile, simplified glyph: at 16 pixels the three ruled
   lines are three grey pixels, which reads as damage rather than as detail. */
export const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<defs><linearGradient id="whf" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="${TILE_FROM}"/><stop offset="1" stop-color="${TILE_TO}"/>
</linearGradient></defs>
<rect width="64" height="64" rx="15" fill="url(#whf)"/>
<path d="${WSTEM_SMALL}" fill="none" stroke="#fff" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
