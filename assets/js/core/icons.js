/* WorksheetHub — icon set.
   Line icons on a 24×24 grid, drawn with currentColor so they inherit type
   colour and weight from whatever they sit in. No emoji anywhere in the
   product: emoji render differently on every platform, carry a toy-like tone,
   and cannot be styled. */

const P = {
  /* ---------------------------- navigation ---------------------------- */
  home:        '<path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9.5V20a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V9.5"/><path d="M9.5 21v-6h5v6"/>',
  library:     '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  progress:    '<path d="M4 20V4"/><path d="M4 20h16"/><path d="m7.5 15 3.5-4 3 2.5L20 7"/>',
  star:        '<path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.7l5.9-.8z"/>',
  trophy:      '<path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4.5v1.5A3.5 3.5 0 0 0 8 11"/><path d="M17 6h2.5v1.5A3.5 3.5 0 0 1 16 11"/><path d="M12 14v3.5"/><path d="M8.5 21h7l-.8-3.5h-5.4z"/>',
  subjects:    '<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H10a2 2 0 0 1 2 2v13a1.8 1.8 0 0 0-1.8-1.5H5.5A1.5 1.5 0 0 1 4 16z"/><path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H14a2 2 0 0 0-2 2v13a1.8 1.8 0 0 1 1.8-1.5h4.7A1.5 1.5 0 0 0 20 16z"/>',
  grades:      '<path d="m12 4 9 4.5-9 4.5-9-4.5z"/><path d="M6.5 10.7V16c0 1.4 2.5 2.6 5.5 2.6s5.5-1.2 5.5-2.6v-5.3"/><path d="M21 8.5V14"/>',
  key:         '<circle cx="8" cy="12" r="3.5"/><path d="M11.5 12H21"/><path d="M17.5 12v3"/><path d="M20.5 12v2.2"/>',
  teacher:     '<path d="M3 20V6.5A1.5 1.5 0 0 1 4.5 5H19a1 1 0 0 1 1 1v10.5"/><path d="M3 20h18"/><path d="M8 9h8M8 13h5"/>',
  settings:    '<circle cx="12" cy="12" r="2.9"/><path d="M19.1 14.4a1.5 1.5 0 0 0 .3 1.65l.05.06a1.8 1.8 0 1 1-2.55 2.55l-.06-.06a1.5 1.5 0 0 0-1.65-.3 1.5 1.5 0 0 0-.9 1.37V20a1.8 1.8 0 0 1-3.6 0v-.1a1.5 1.5 0 0 0-.98-1.37 1.5 1.5 0 0 0-1.65.3l-.06.06a1.8 1.8 0 1 1-2.55-2.55l.06-.06a1.5 1.5 0 0 0 .3-1.65 1.5 1.5 0 0 0-1.37-.9H4a1.8 1.8 0 0 1 0-3.6h.1a1.5 1.5 0 0 0 1.37-.98 1.5 1.5 0 0 0-.3-1.65l-.06-.06a1.8 1.8 0 1 1 2.55-2.55l.06.06a1.5 1.5 0 0 0 1.65.3H9.5a1.5 1.5 0 0 0 .9-1.37V4a1.8 1.8 0 0 1 3.6 0v.1a1.5 1.5 0 0 0 .9 1.37 1.5 1.5 0 0 0 1.65-.3l.06-.06a1.8 1.8 0 1 1 2.55 2.55l-.06.06a1.5 1.5 0 0 0-.3 1.65v.08a1.5 1.5 0 0 0 1.37.9H20a1.8 1.8 0 0 1 0 3.6h-.1a1.5 1.5 0 0 0-1.37.9z"/>',
  user:        '<circle cx="12" cy="8" r="3.6"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/>',
  search:      '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
  menu:        '<path d="M4 7h16M4 12h16M4 17h16"/>',
  moon:        '<path d="M20 14.5A8.2 8.2 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z"/>',
  sun:         '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M5.2 18.8l1.4-1.4M17.4 6.6l1.4-1.4"/>',

  /* ------------------------------ actions ------------------------------ */
  'arrow-left':  '<path d="M19 12H5"/><path d="m11 6-6 6 6 6"/>',
  'arrow-right': '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  'chevron-left':  '<path d="m14.5 5-7 7 7 7"/>',
  'chevron-right': '<path d="m9.5 5 7 7-7 7"/>',
  'chevron-down':  '<path d="m5 9.5 7 7 7-7"/>',
  'chevron-up':    '<path d="m5 14.5 7-7 7 7"/>',
  'arrow-up':      '<path d="M12 19V5"/><path d="m6 11 6-6 6 6"/>',
  'arrow-down':    '<path d="M12 5v14"/><path d="m6 13 6 6 6-6"/>',
  plus:        '<path d="M12 5v14M5 12h14"/>',
  close:       '<path d="m6 6 12 12M18 6 6 18"/>',
  check:       '<path d="m5 12.5 4.5 4.5L19 7"/>',
  'check-circle': '<circle cx="12" cy="12" r="8.5"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
  'x-circle':  '<circle cx="12" cy="12" r="8.5"/><path d="m9.5 9.5 5 5M14.5 9.5l-5 5"/>',
  refresh:     '<path d="M20 11a8 8 0 1 0-.6 4"/><path d="M20 4.5V11h-6.5"/>',
  printer:     '<path d="M7 9V4h10v5"/><path d="M6.5 18H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-1.5"/><rect x="7" y="14" width="10" height="7" rx="1"/>',
  monitor:     '<rect x="2.5" y="4" width="19" height="12.5" rx="2"/><path d="M9 20.5h6M12 16.5v4"/>',
  bookmark:    '<path d="M6.5 3.5h11a1 1 0 0 1 1 1V21l-6.5-4-6.5 4V4.5a1 1 0 0 1 1-1z"/>',
  lightbulb:   '<path d="M9.5 17.5h5"/><path d="M10 20.5h4"/><path d="M12 3a6 6 0 0 1 3.5 10.9c-.6.4-1 1-1 1.7h-5c0-.7-.4-1.3-1-1.7A6 6 0 0 1 12 3z"/>',
  help:        '<circle cx="12" cy="12" r="8.5"/><path d="M9.7 9.4a2.4 2.4 0 1 1 3.3 2.2c-.6.3-1 .9-1 1.6v.4"/><path d="M12 16.8h.01"/>',
  info:        '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5"/><path d="M12 7.6h.01"/>',
  alert:       '<path d="M10.6 4.3 2.8 17.5a1.6 1.6 0 0 0 1.4 2.4h15.6a1.6 1.6 0 0 0 1.4-2.4L13.4 4.3a1.6 1.6 0 0 0-2.8 0z"/><path d="M12 9.5v4"/><path d="M12 17h.01"/>',
  lock:        '<rect x="4.5" y="10.5" width="15" height="10" rx="2"/><path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7"/>',
  clock:       '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 1.8"/>',
  calendar:    '<rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M3.5 10h17M8 3.5v3M16 3.5v3"/>',
  flame:       '<path d="M12 3s5 4 5 8.5a5 5 0 0 1-10 0C7 9 9 7.5 9 7.5s.5 2 1.5 2.5c1 .5 1.5-.5 1.5-2 0-1.5 0-3 0-5z"/>',
  target:      '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r=".8" fill="currentColor" stroke="none"/>',
  download:    '<path d="M12 3.5v11"/><path d="m7.5 10.5 4.5 4.5 4.5-4.5"/><path d="M4.5 19.5h15"/>',
  copy:        '<rect x="8.5" y="8.5" width="12" height="12" rx="2"/><path d="M15.5 5.5v-1a1 1 0 0 0-1-1h-10a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h1"/>',
  trash:       '<path d="M4.5 6.5h15"/><path d="M9 6.5V4.8a1.3 1.3 0 0 1 1.3-1.3h3.4A1.3 1.3 0 0 1 15 4.8v1.7"/><path d="M6.5 6.5 7.4 20a1 1 0 0 0 1 .9h7.2a1 1 0 0 0 1-.9l.9-13.5"/>',
  external:    '<path d="M14 4.5h5.5V10"/><path d="m19.5 4.5-8 8"/><path d="M18 14v5a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19V7.5A1.5 1.5 0 0 1 5 6h5"/>',
  send:        '<path d="M21 3 10.5 13.5"/><path d="M21 3 14.5 21l-4-7.5L3 9.5z"/>',
  sparkle:     '<path d="M12 3.5 13.7 9l5.5 1.7-5.5 1.7L12 18l-1.7-5.6L4.8 10.7 10.3 9z"/><path d="M18.5 16.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/>',

  /* ------------------------------ subjects ------------------------------ */
  math:        '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M7.5 7.5h9"/><path d="M8 12.2h2.6M9.3 10.9v2.6"/><path d="M13.4 11.5h3M13.4 13.5h3"/><path d="M8 17h2.6"/><path d="M14 16 16.5 18.5M16.5 16 14 18.5"/>',
  science:     '<path d="M10 3.5h4"/><path d="M10.5 3.5v5.2L5.4 17.9A2 2 0 0 0 7.1 21h9.8a2 2 0 0 0 1.7-3.1L13.5 8.7V3.5"/><path d="M8.2 14h7.6"/>',
  ela:         '<path d="M12 6.5C10.5 5 8.4 4.3 4.5 4.5v13c3.9-.2 6 .5 7.5 2 1.5-1.5 3.6-2.2 7.5-2v-13c-3.9-.2-6 .5-7.5 2z"/><path d="M12 6.5V20.5"/>',
  social:      '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17"/><path d="M12 3.5a13 13 0 0 1 0 17 13 13 0 0 1 0-17z"/>',
  languages:   '<path d="M3.5 6h8"/><path d="M7.5 4v2"/><path d="M9.8 6c0 3.4-2.6 6.8-6.3 8.4"/><path d="M5 10.4c1.4 2.2 3.4 3.8 5.6 4.6"/><path d="m12.5 21 4-9.5 4 9.5"/><path d="M13.9 17.8h5.2"/>',
  cs:          '<path d="m8.5 8.5-4 3.5 4 3.5"/><path d="m15.5 8.5 4 3.5-4 3.5"/><path d="m13.5 5-3 14"/>',
  study:       '<rect x="4.5" y="4" width="15" height="17" rx="2"/><path d="M9 4V2.8h6V4"/><path d="m8.8 12.5 2.2 2.2 4.2-4.6"/>',
  arts:        '<path d="M12 3.5a8.5 8.5 0 0 0 0 17c1.2 0 1.8-.8 1.8-1.7 0-1.5-1.3-1.6-1.3-2.8 0-.9.7-1.5 1.7-1.5h1.3a4.9 4.9 0 0 0 5-4.9c0-3.4-3.7-6.1-8.5-6.1z"/><circle cx="8" cy="10" r="1.1" fill="currentColor" stroke="none"/><circle cx="12" cy="7.6" r="1.1" fill="currentColor" stroke="none"/><circle cx="15.8" cy="10" r="1.1" fill="currentColor" stroke="none"/>',

  /* ---------------------------- grade bands ---------------------------- */
  'band-early':      '<circle cx="7" cy="7.5" r="3.6"/><rect x="13.4" y="4" width="7" height="7" rx="1.4"/><path d="m12 13.5 4.4 7.5H7.6z"/>',
  'band-elementary': '<path d="M5 4.5h10a2 2 0 0 1 2 2v13H7a2 2 0 0 1-2-2z"/><path d="M17 6.5h2v13H7a2 2 0 0 0-2 2"/><path d="M8.5 9h5"/>',
  'band-middle':     '<path d="M12 7.5C10.7 6.3 8.9 5.7 5.5 5.8v11c3.4-.1 5.2.5 6.5 1.7 1.3-1.2 3.1-1.8 6.5-1.7v-11c-3.4-.1-5.2.5-6.5 1.7z"/><path d="M12 7.5v10"/>',
  'band-high':       '<path d="m12 4 9 4.5-9 4.5-9-4.5z"/><path d="M6.5 10.7V16c0 1.4 2.5 2.6 5.5 2.6s5.5-1.2 5.5-2.6v-5.3"/>',
  'band-advanced':   '<circle cx="12" cy="9" r="5.5"/><path d="m8.5 13.6-1 7.4 4.5-2.6 4.5 2.6-1-7.4"/>',

  /* -------------------------- question types -------------------------- */
  'q-blank':   '<path d="M4 19.5h16"/><path d="M6 15.5 15.5 6a2.1 2.1 0 0 1 3 3L9 18.5l-4 1z"/>',
  'q-math':    '<rect x="4.5" y="3.5" width="15" height="17" rx="2"/><path d="M8 8h8"/><path d="M8 12.5h3M9.5 11v3"/><path d="M13.5 12.5h3"/><path d="M8 17h8"/>',
  'q-choice':  '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3.4" fill="currentColor" stroke="none"/>',
  'q-multi':   '<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="m8 12 2.8 2.8L16 9.5"/>',
  'q-match':   '<rect x="3.5" y="4.5" width="6.5" height="6" rx="1.5"/><rect x="14" y="13.5" width="6.5" height="6" rx="1.5"/><path d="M10 7.5h4.5a2.5 2.5 0 0 1 2.5 2.5v3.5"/>',
  'q-order':   '<path d="M7 4.5v15"/><path d="m3.8 8 3.2-3.5L10.2 8"/><path d="M13 7h8M13 12h6M13 17h4"/>',
  'q-graph':   '<path d="M4 20V4"/><path d="M4 20h16"/><circle cx="9" cy="15" r="1.4"/><circle cx="13.5" cy="10.5" r="1.4"/><circle cx="18" cy="7" r="1.4"/>',
  'q-written': '<path d="M5 20.5h14"/><path d="M7 16.8 16 7.8a2 2 0 0 0-2.8-2.8l-9 9V16h2.8z"/><path d="M13 6.5 16.5 10"/>',

  /* ------------------------------ statuses ------------------------------ */
  'level-1':   '<rect x="4" y="14" width="4" height="6" rx="1" fill="currentColor" stroke="none"/><rect x="10" y="14" width="4" height="6" rx="1" opacity=".28"/><rect x="16" y="14" width="4" height="6" rx="1" opacity=".28"/>',
  'level-2':   '<rect x="4" y="14" width="4" height="6" rx="1" fill="currentColor" stroke="none"/><rect x="10" y="10" width="4" height="10" rx="1" fill="currentColor" stroke="none"/><rect x="16" y="10" width="4" height="10" rx="1" opacity=".28"/>',
  'level-3':   '<rect x="4" y="14" width="4" height="6" rx="1" fill="currentColor" stroke="none"/><rect x="10" y="10" width="4" height="10" rx="1" fill="currentColor" stroke="none"/><rect x="16" y="5" width="4" height="15" rx="1" fill="currentColor" stroke="none"/>',
  document:    '<path d="M13.5 3.5H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9z"/><path d="M13.5 3.5V9H19"/><path d="M8.5 13h7M8.5 16.5h4.5"/>',
  layers:      '<path d="m12 3.5 8.5 4.3-8.5 4.4-8.5-4.4z"/><path d="m3.5 12.2 8.5 4.3 8.5-4.3"/><path d="m3.5 16.4 8.5 4.3 8.5-4.3"/>',
  users:       '<circle cx="9" cy="8" r="3.4"/><path d="M2.8 20a6.2 6.2 0 0 1 12.4 0"/><path d="M16 5a3.4 3.4 0 0 1 0 6.6"/><path d="M17.5 14.4A6.2 6.2 0 0 1 21.2 20"/>',
  compass:     '<circle cx="12" cy="12" r="8.5"/><path d="m15.5 8.5-2 5.2-5.2 2 2-5.2z"/>',
  hash:        '<path d="M9.5 3.5 8 20.5M16 3.5l-1.5 17M4 8.5h16M3.5 15.5h16"/>',
  filter:      '<path d="M3.5 5.5h17M6.5 12h11M10 18.5h4"/>',
  sunrise:     '<path d="M12 3.5v5"/><path d="m8.5 6.5 3.5-3 3.5 3"/><path d="M3.5 17.5h17"/><path d="M6.5 14a5.5 5.5 0 0 1 11 0"/><path d="M2.5 20.5h19"/>'
};

export const ICON_NAMES = Object.keys(P);

/** Icon markup, for template strings and innerHTML. */
export function iconHtml(name, { size = 20, cls = '', stroke = 1.75 } = {}) {
  const body = P[name];
  if (!body) return '';
  return `<svg class="ico-svg ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" stroke-width="${stroke}" stroke-linecap="round"
    stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;
}

/** Icon element, for the DOM helpers. */
export function icon(name, opts = {}) {
  const span = document.createElement('span');
  span.className = 'ico';
  span.innerHTML = iconHtml(name, opts);
  span.setAttribute('aria-hidden', 'true');
  return span.firstElementChild ?? span;
}

export const hasIcon = name => Boolean(P[name]);
