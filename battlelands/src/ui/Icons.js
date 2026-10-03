/* One icon language for the whole game: 24×24, thick rounded strokes,
   simple silhouettes. Used as inline SVG in the UI and rasterised onto the
   canvas for loot on the ground, so the HUD and the world look like one game. */

const S = 'stroke';   // stroked path
const F = 'fill';     // filled silhouette (+ thin rounded outline)

const P = {
  // weapons
  pistol:   [F, 'M3 8h15.5a1.5 1.5 0 0 1 1.5 1.5V12H10.5l-1.3 6.5H5.4l1.2-6.5H3z'],
  burst:    [F, 'M2 9h14l2.5-2H21v4.5h-2.6L17 13h-6l-1.2 5.5H6.4L7.6 13H2z M6 8.2V6.5h3v1.7'],
  smg:      [F, 'M3 8h14v5h-3.5l-.9 5.5H9.4l.9-5.5H8L7.3 16H4.2l.6-3H3z M17 9.5h3.5v2H17z'],
  shotgun:  [F, 'M1.5 8.5h18.5l2.5 2.2v1.3H9.5l-3.2 6H2.7l2.8-6H1.5z'],
  dmr:      [F, 'M1 10.5h15.5l2-2H23v3.3H11.2l-2 6H5.9l1.6-6H1z M7.5 6h6v2.5h-6z'],
  sniper:   [F, 'M1 11h21.5v2.2H11l-1.8 5H6.1l1.5-5H1z M6.5 7h7v2.6h-7z'],
  launcher: [F, 'M2 8h15.5l4 2.8-4 2.7H2z M8 13.5h3.6l-1.2 5.5H6.9z'],
  fist:     [F, 'M5.5 10a3 3 0 0 1 3-3h7.5a3 3 0 0 1 3 3v5.5a4.5 4.5 0 0 1-4.5 4.5H10a4.5 4.5 0 0 1-4.5-4.5z'],
  // items
  heart:    [F, 'M12 20.5s-7.5-4.6-7.5-10.4A4.2 4.2 0 0 1 12 7.4a4.2 4.2 0 0 1 7.5 2.7c0 5.8-7.5 10.4-7.5 10.4z'],
  armor:    [F, 'M12 2.8l7.5 3v5.4c0 4.7-3.2 8.4-7.5 10.4-4.3-2-7.5-5.7-7.5-10.4V5.8z'],
  bandage:  [F, 'M4.2 15.6l11.4-11.4a3 3 0 0 1 4.2 4.2L8.4 19.8a3 3 0 0 1-4.2-4.2z'],
  medkit:   [F, 'M3.5 8h17v12h-17z M8.5 8V5.5a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1V8'],
  shieldcell:[F, 'M7.5 5h9v16h-9z M10 2.5h4V5h-4z'],
  frag:     [F, 'M12 21a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13z M10 8.5V5.5h4v3'],
  smoke:    [F, 'M7 19a4.2 4.2 0 0 1-.6-8.4A5.5 5.5 0 0 1 17 9a4 4 0 0 1 .5 8v2z'],
  soda:     [F, 'M7.5 5.5h9l-1.2 15h-6.6z M9 2.5h6v3H9z'],
  // ui
  map:      [S, 'M3 6.5l6-2.5 6 2.5 6-2.5v13.5l-6 2.5-6-2.5-6 2.5z M9 4v13.5 M15 6.5V20'],
  gear:     [S, 'M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z M12 2.5v3 M12 18.5v3 M2.5 12h3 M18.5 12h3 M5.3 5.3l2.1 2.1 M16.6 16.6l2.1 2.1 M5.3 18.7l2.1-2.1 M16.6 7.4l2.1-2.1'],
  shop:     [S, 'M4.5 8h15l-1.2 12.5H5.7z M8.8 8V7a3.2 3.2 0 0 1 6.4 0v1'],
  collection:[S, 'M3.5 7.5h11v13h-11z M8 4h12.5v12.5'],
  missions: [S, 'M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17z M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M12 12h.01'],
  star:     [F, 'M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2 6.4 20.2l1.1-6.3L2.9 9.5l6.3-.9z'],
  coin:     [F, 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z'],
  play:     [F, 'M8 4.5l12 7.5-12 7.5z'],
  back:     [S, 'M15 4.5L7.5 12l7.5 7.5'],
  close:    [S, 'M6 6l12 12 M18 6L6 18'],
  lock:     [F, 'M5.5 11h13v9.5h-13z M8.5 11V8a3.5 3.5 0 0 1 7 0v3'],
  check:    [S, 'M4.5 12.5l5 5L19.5 7'],
  warning:  [S, 'M12 3.5l9.5 16.5h-19z M12 10v4.5 M12 17.3h.01'],
  crown:    [F, 'M3 7.5l4.8 4.2L12 4.5l4.2 7.2L21 7.5l-2.2 11.5H5.2z'],
  trophy:   [S, 'M7 3.5h10v5.5a5 5 0 0 1-10 0z M7 5.5H4.2a3 3 0 0 0 3.3 4.2 M17 5.5h2.8a3 3 0 0 1-3.3 4.2 M12 14v4 M7.5 20.5h9'],
  users:    [S, 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M2.5 20.5a6.5 6.5 0 0 1 13 0 M16 4.3a3.5 3.5 0 0 1 0 6.6 M18 14.2a6 6 0 0 1 3.5 6.3'],
  home:     [S, 'M3.5 11L12 4l8.5 7v9.5h-5.5V15h-6v5.5H3.5z'],
  pause:    [S, 'M8.5 5v14 M15.5 5v14'],
  smile:    [S, 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M8 14.5a4.8 4.8 0 0 0 8 0 M9 9.5h.01 M15 9.5h.01'],
  target:   [S, 'M12 19a7 7 0 1 0 0-14 7 7 0 0 0 0 14z M12 2v5 M12 17v5 M2 12h5 M17 12h5'],
  bolt:     [F, 'M13.5 2L4.5 13.5h6.5l-1 8.5 9-11.5h-6.5z'],
  reload:   [S, 'M19.5 12a7.5 7.5 0 1 1-2.2-5.3 M19.5 4v5h-5'],
  sound:    [S, 'M4 9h4l5-4v14l-5-4H4z M16.5 9a4 4 0 0 1 0 6 M19 6.5a7.5 7.5 0 0 1 0 11'],
  music:    [S, 'M9 17.5V6l11-2v11.5 M9 17.5a2.8 2.8 0 1 1-5.6 0 2.8 2.8 0 0 1 5.6 0z M20 15.5a2.8 2.8 0 1 1-5.6 0 2.8 2.8 0 0 1 5.6 0z'],
  vibrate:  [S, 'M8.5 3.5h7v17h-7z M4.5 8v8 M19.5 8v8 M2 10v4 M22 10v4'],
  globe:    [S, 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M3 12h18 M12 3c3 3.2 3 14.8 0 18 M12 3c-3 3.2-3 14.8 0 18'],
  user:     [S, 'M12 11.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4.5 20.5a7.5 7.5 0 0 1 15 0'],
  eye:      [S, 'M2 12s3.8-6.5 10-6.5S22 12 22 12s-3.8 6.5-10 6.5S2 12 2 12z M12 14.8a2.8 2.8 0 1 0 0-5.6 2.8 2.8 0 0 0 0 5.6z'],
  sliders:  [S, 'M4 6.5h16 M4 12h16 M4 17.5h16 M8.5 4.5v4 M15.5 10v4 M10.5 15.5v4'],
  gamepad:  [S, 'M7 8h10a4.5 4.5 0 0 1 4.4 5.5l-.8 3.6a2 2 0 0 1-3.4.9L15 15.5H9L6.8 18a2 2 0 0 1-3.4-.9l-.8-3.6A4.5 4.5 0 0 1 7 8z M8 11v3 M6.5 12.5h3 M15.5 12h.01 M17.5 13.5h.01'],
  wave:     [S, 'M8 13V6.2a1.5 1.5 0 0 1 3 0V11 M11 11V4.8a1.5 1.5 0 0 1 3 0V11 M14 11V6.3a1.5 1.5 0 0 1 3 0V14a6.5 6.5 0 0 1-6.5 6.5h-.3a6.4 6.4 0 0 1-5.6-3.3L3 13.4a1.5 1.5 0 0 1 2.6-1.5L8 14'],
  laugh:    [S, 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M7.5 10l2-1.2 M16.5 10l-2-1.2 M7.5 13.5h9a4.5 4.5 0 0 1-9 0z'],
  fire:     [F, 'M12 22a7 7 0 0 0 7-7c0-4.2-3-6.3-4.2-10.5C12.6 6.7 11.8 8.6 12 10.7 10.6 9.6 9.9 8.3 9.6 6.6 6.8 9.4 5 11.6 5 15a7 7 0 0 0 7 7z'],
  clock:    [S, 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 7.5V12l3 2'],
  plus:     [S, 'M12 5v14 M5 12h14'],
  info:     [S, 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 11v5.5 M12 7.8h.01'],
  gift:     [S, 'M4 10h16v10.5H4z M3 7h18v3H3z M12 7v13.5 M12 7c-1.5-3.5-5.5-3.5-5.5-1S10 7 12 7z M12 7c1.5-3.5 5.5-3.5 5.5-1S14 7 12 7z'],
  sparkle:  [F, 'M12 2.5l2 6.5 6.5 2-6.5 2-2 6.5-2-6.5-6.5-2 6.5-2z'],
  emote:    [S, 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M8 14a4.8 4.8 0 0 0 8 0 M9 9.5h.01 M15 9.5h.01'],
  trail:    [S, 'M4 18c4 0 4-4 8-4s4 4 8 4 M4 12c4 0 4-4 8-4s4 4 8 4 M4 6c4 0 4-2 8-2'],
  firework: [S, 'M12 12v9 M12 12L6 6 M12 12l6-6 M12 12V3 M12 12l-8 1 M12 12l8 1'],
  arrowup:  [F, 'M12 4l7 8h-4.5v7h-5v-7H5z'],
  swap:     [S, 'M4 8h13l-3-3 M20 16H7l3 3'],
  gg:       ['text', 'GG'],
};

/* Small detail strokes drawn on top of filled silhouettes so they read at 20px. */
const DETAIL = {
  medkit: 'M12 11v6 M9 14h6',
  shieldcell: 'M13 8.5l-2.5 4h3l-2.5 4',
  bandage: 'M10 10h.01 M14 14h.01 M12 12h.01',
  soda: 'M13 9.5l-2.2 3.4h2.6l-2.2 3.4',
  coin: 'M12 7.5v9 M9.5 9.5h3.7a1.6 1.6 0 0 1 0 3.2h-2.4a1.6 1.6 0 0 0 0 3.2h3.7',
  fist: 'M9.5 7v4 M12.5 7v4 M15.5 7v4',
  frag: 'M14 5.5l3-2',
};

export const ICON_NAMES = Object.keys(P);

/* SVG markup for an icon. color drives both stroke and fill. */
export function icon(name, { size = 24, color = 'currentColor', detail = null, cls = '' } = {}) {
  const def = P[name] || P.info;
  const [mode, d] = def;
  const det = detail || (mode === F ? 'rgba(16,22,42,0.85)' : color);
  let inner;
  if (mode === 'text') {
    inner = `<text x="12" y="16.5" text-anchor="middle" font-family="Nunito, Arial Rounded MT Bold, Arial, sans-serif" font-weight="900" font-size="12" fill="${color}">${d}</text>`;
  } else if (mode === S) {
    inner = `<path d="${d}" fill="none" stroke="${color}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`;
  } else {
    inner = `<path d="${d}" fill="${color}" stroke="${color}" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>`;
    if (DETAIL[name]) inner += `<path d="${DETAIL[name]}" fill="none" stroke="${det}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  return `<svg class="ico ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${inner}</svg>`;
}

/* Rasterised icons for the canvas, cached by name+colour. */
const imgCache = new Map();
export function iconImage(name, color, px = 48) {
  const key = `${name}|${color}|${px}`;
  let img = imgCache.get(key);
  if (img) return img;
  if (typeof Image === 'undefined') return null;
  img = new Image();
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
    icon(name, { size: px, color }).replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ')
  );
  imgCache.set(key, img);
  return img;
}
