/* WorksheetHub — the mark.
   A stacked pair of sheets whose top rule finishes as a check: the product is
   a worksheet, and the point of it is getting it right. Drawn rather than
   lettered so it reads at 20px in a browser tab and at 200px on a poster. */

/**
 * @param {object} opts
 *   size   – px, the mark is square
 *   solid  – true for the filled brand tile, false for a line mark on any ground
 */
export function logoMark({ size = 34, solid = true, cls = '' } = {}) {
  /* The back sheet is offset and dimmed; the front sheet carries the rules. */
  const inner = `
    <rect x="7.5" y="4" width="17" height="22" rx="3"
          fill="${solid ? 'rgba(255,255,255,.28)' : 'none'}"
          stroke="${solid ? 'none' : 'currentColor'}" stroke-width="2" opacity="${solid ? 1 : .38}"/>
    <rect x="3.5" y="7" width="17" height="22" rx="3"
          fill="${solid ? '#fff' : 'none'}"
          stroke="${solid ? 'none' : 'currentColor'}" stroke-width="2"/>
    <path d="M7.5 13.5h6M7.5 18h9M7.5 22.5h5"
          stroke="${solid ? 'var(--primary, #6366F1)' : 'currentColor'}"
          stroke-width="2" stroke-linecap="round" opacity="${solid ? .55 : .55}"/>
    <path d="m14 18.5 3.2 3.2L24 14.5"
          fill="none" stroke="${solid ? 'var(--primary, #6366F1)' : 'currentColor'}"
          stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`;

  return `<svg class="logo-mark ${cls}" width="${size}" height="${size}" viewBox="0 0 32 32"
     role="img" aria-label="WorksheetHub" focusable="false">${inner}</svg>`;
}

/** The mark inside its brand tile, as used in the header and footer. */
export function logoTile({ size = 34 } = {}) {
  return `<span class="brand-mark" aria-hidden="true">${logoMark({ size: Math.round(size * 0.72), solid: true })}</span>`;
}

/** Wordmark plus mark, for places that need the full lockup. */
export function logoLockup({ size = 34 } = {}) {
  return `${logoTile({ size })}<span class="brand-word">Worksheet<span class="brand-word-accent">Hub</span></span>`;
}

/* The favicon is the same drawing, flattened to fixed colours because a data
   URI cannot reach the page's custom properties. */
export const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
<rect width="32" height="32" rx="7" fill="#6366F1"/>
<rect x="9" y="5.5" width="15" height="19" rx="2.6" fill="#fff" opacity=".32"/>
<rect x="5.5" y="8" width="15" height="19" rx="2.6" fill="#fff"/>
<path d="M9 13.5h5.5M9 17.6h8M9 21.7h4.5" stroke="#6366F1" stroke-width="1.9" stroke-linecap="round" opacity=".5"/>
<path d="m14.2 18.4 3 3 6.3-6.9" fill="none" stroke="#4F46E5" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
