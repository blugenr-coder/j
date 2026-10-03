/* Local persistence. Everything the player earns or sets lives in one JSON
   blob in localStorage. Storage can be unavailable (private mode, blocked
   site data), so every access is guarded and the game keeps working from
   memory if it has to. */

const KEY = 'battlelands-remake/save/v1';

export function defaultSettings() {
  let lang = 'en';
  let reduced = false;
  try { lang = (navigator.language || 'en').toLowerCase().startsWith('es') ? 'es' : 'en'; } catch { /* no navigator */ }
  try { reduced = !!(globalThis.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); } catch { /* ignore */ }
  return {
    graphics: 'high',      // high | low
    sound: 0.8,
    music: 0.45,
    vibration: true,
    sensitivity: 1,        // 0.6 .. 1.6
    aimAssist: 0.6,        // 0 .. 1
    joystickSize: 1,       // 0.8 .. 1.3
    joystickMode: 'floating', // floating | fixed
    joystickX: 1,          // fixed joystick: 0.6 (towards the edge) .. 1.8 (towards the centre)
    joystickY: 1,          // fixed joystick: 0.6 (lower) .. 1.8 (higher)
    buttonSize: 1,         // 0.8 .. 1.3
    language: lang,
    highContrast: false,
    largeUi: false,
    reducedMotion: reduced,
    showFps: false,
  };
}

export function defaultSave() {
  return {
    version: 1,
    name: 'PLAYER',
    level: 1,
    xp: 0,
    coins: 600,
    owned: [],
    equipped: { character: 'scout', emote: 'wave', trail: 'dust', victory: 'confetti', icon: 'bolt' },
    settings: defaultSettings(),
    stats: { matches: 0, wins: 0, kills: 0, top10: 0, top3: 0, bestPlace: 0, survival: 0, damage: 0 },
    missions: { day: '', list: [] },
    achievements: {},
    giftDay: '',
    tutorialDone: false,
  };
}

function merge(base, over) {
  if (!over || typeof over !== 'object') return base;
  const out = Array.isArray(base) ? [...(Array.isArray(over) ? over : base)] : { ...base };
  if (Array.isArray(base)) return out;
  for (const k of Object.keys(over)) {
    if (base[k] && typeof base[k] === 'object' && !Array.isArray(base[k])) out[k] = merge(base[k], over[k]);
    else if (base[k] !== undefined && typeof base[k] === typeof over[k]) out[k] = over[k];
    else if (base[k] === undefined) out[k] = over[k];
  }
  return out;
}

export const SaveManager = {
  data: defaultSave(),
  available: false,

  load() {
    try {
      const raw = localStorage.getItem(KEY);
      this.available = true;
      if (raw) this.data = merge(defaultSave(), JSON.parse(raw));
    } catch {
      this.available = false;
      this.data = defaultSave();
    }
    return this.data;
  },

  save() {
    try { localStorage.setItem(KEY, JSON.stringify(this.data)); this.available = true; }
    catch { this.available = false; }
  },

  resetSettings() { this.data.settings = defaultSettings(); this.save(); },

  resetProgress() {
    const settings = this.data.settings;
    this.data = defaultSave();
    this.data.settings = settings;
    this.save();
  },
};
