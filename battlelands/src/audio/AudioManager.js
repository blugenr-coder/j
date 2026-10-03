/* All sound is synthesised with WebAudio: no audio files to license or load.
   Short, punchy, toy-like — every action gets a sound, nothing lingers.
   The context can only start after a user gesture, so unlock() is called from
   the first tap and every play() before that is silently dropped. */

export class AudioManager {
  constructor(settings) {
    this.settings = settings;
    this.ctx = null;
    this.noiseBuf = null;
    this.musicOn = false;
    this.musicMode = 'menu';
    this.step = 0;
    this.nextNoteT = 0;
    this.lastPlay = new Map();
  }

  unlock() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    const AC = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!AC) return;
    try { this.ctx = new AC(); } catch { return; }
    const c = this.ctx;
    this.master = c.createGain(); this.master.connect(c.destination);
    this.sfx = c.createGain(); this.sfx.connect(this.master);
    this.music = c.createGain(); this.music.connect(this.master);
    // A gentle compressor keeps a big fight from clipping.
    this.comp = c.createDynamicsCompressor(); this.comp.threshold.value = -14; this.comp.ratio.value = 6;
    this.sfx.disconnect(); this.sfx.connect(this.comp); this.comp.connect(this.master);
    const len = c.sampleRate * 1;
    this.noiseBuf = c.createBuffer(1, len, c.sampleRate);
    const d = this.noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    this.applyVolumes();
    this._schedTimer = setInterval(() => this._schedule(), 60);
  }

  applyVolumes() {
    if (!this.ctx) return;
    this.sfx.gain.value = this.settings.sound * 0.9;
    this.music.gain.value = this.settings.music * 0.32;
  }

  suspend() { this.ctx?.suspend(); }
  resume() { this.ctx?.resume(); }

  vibrate(pattern) {
    if (!this.settings.vibration) return;
    try { navigator.vibrate?.(pattern); } catch { /* unsupported */ }
  }

  /* ---- building blocks ---- */

  _tone(type, f0, f1, dur, vol, when = 0, dest = this.sfx) {
    const c = this.ctx, t = c.currentTime + when;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(f0, t);
    if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(dest);
    o.start(t); o.stop(t + dur + 0.02);
  }

  _noise(dur, vol, freq, q = 1, type = 'bandpass', when = 0, dest = this.sfx, sweepTo = null) {
    const c = this.ctx, t = c.currentTime + when;
    const s = c.createBufferSource(); s.buffer = this.noiseBuf;
    const f = c.createBiquadFilter(); f.type = type; f.frequency.setValueAtTime(freq, t); f.Q.value = q;
    if (sweepTo) f.frequency.exponentialRampToValueAtTime(sweepTo, t + dur);
    const g = c.createGain();
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(dest);
    s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.02);
  }

  /* gain 0..1 lets distant sounds play quieter */
  play(name, gain = 1) {
    if (!this.ctx || this.ctx.state !== 'running' || this.settings.sound <= 0 || gain <= 0.02) return;
    // Rate limit identical sounds (a shotgun is one sound, not seven).
    const now = this.ctx.currentTime, last = this.lastPlay.get(name) || 0;
    if (now - last < 0.025) return;
    this.lastPlay.set(name, now);
    const v = Math.min(1, gain);
    switch (name) {
      case 'shot_pebble': this._tone('square', 900, 260, 0.07, 0.10 * v); this._noise(0.05, 0.12 * v, 2600, 1.2); break;
      case 'shot_burst': this._tone('sawtooth', 700, 200, 0.06, 0.09 * v); this._noise(0.05, 0.12 * v, 2000, 1); break;
      case 'shot_rapid': this._tone('square', 1200, 500, 0.04, 0.07 * v); this._noise(0.03, 0.08 * v, 3200, 1.4); break;
      case 'shot_spark': this._noise(0.22, 0.32 * v, 1200, 0.7, 'lowpass', 0, this.sfx, 300); this._tone('sawtooth', 220, 60, 0.18, 0.12 * v); break;
      case 'shot_needle': this._tone('triangle', 1800, 600, 0.09, 0.12 * v); this._noise(0.06, 0.1 * v, 4000, 2); break;
      case 'shot_longshot': this._noise(0.35, 0.34 * v, 900, 0.6, 'lowpass', 0, this.sfx, 180); this._tone('sawtooth', 300, 50, 0.3, 0.14 * v); break;
      case 'shot_launcher': this._tone('sine', 180, 520, 0.22, 0.22 * v); this._noise(0.18, 0.12 * v, 600, 1); break;
      case 'shot_fists': this._noise(0.08, 0.18 * v, 500, 1, 'lowpass'); break;
      case 'hit': this._tone('square', 1500, 1500, 0.035, 0.06 * v); break;
      case 'hit_armor': this._tone('triangle', 2400, 1800, 0.06, 0.07 * v); break;
      case 'hurt': this._tone('sawtooth', 220, 110, 0.12, 0.12 * v); this._noise(0.1, 0.12 * v, 400, 1, 'lowpass'); break;
      case 'impact': this._noise(0.04, 0.06 * v, 3000, 2); break;
      case 'explosion': this._noise(0.7, 0.55 * v, 700, 0.5, 'lowpass', 0, this.sfx, 60); this._tone('sine', 120, 35, 0.5, 0.35 * v); break;
      case 'pickup': this._tone('triangle', 660, 660, 0.07, 0.14); this._tone('triangle', 990, 990, 0.1, 0.14, 0.06); break;
      case 'pickup_rare': [660, 880, 1320].forEach((f, i) => this._tone('triangle', f, f, 0.12, 0.13, i * 0.06)); break;
      case 'heal': this._tone('sine', 440, 880, 0.35, 0.12); this._tone('sine', 660, 1320, 0.35, 0.06, 0.05); break;
      case 'reload': this._noise(0.04, 0.16, 2200, 3); this._noise(0.05, 0.18, 1400, 3, 'bandpass', 0.14); break;
      case 'elim': this._tone('square', 520, 520, 0.08, 0.12); this._tone('square', 780, 780, 0.08, 0.12, 0.08); this._tone('square', 1040, 1040, 0.16, 0.12, 0.16); break;
      case 'elim_other': this._tone('triangle', 400, 200, 0.18, 0.08 * v); break;
      case 'zone_warn': [0, 0.28].forEach(w => { this._tone('square', 740, 740, 0.16, 0.09, w); this._tone('square', 554, 554, 0.16, 0.09, w + 0.14); }); break;
      case 'zone_tick': this._tone('sine', 300, 260, 0.12, 0.1); break;
      case 'land': this._noise(0.18, 0.24, 300, 0.8, 'lowpass'); this._tone('sine', 140, 60, 0.15, 0.2); break;
      case 'deploy': this._noise(0.6, 0.12, 800, 0.6, 'bandpass', 0, this.sfx, 3000); break;
      case 'click': this._tone('triangle', 880, 1100, 0.05, 0.12); break;
      case 'back': this._tone('triangle', 700, 500, 0.06, 0.1); break;
      case 'play': this._tone('triangle', 523, 523, 0.08, 0.16); this._tone('triangle', 784, 784, 0.08, 0.16, 0.07); this._tone('triangle', 1046, 1046, 0.16, 0.16, 0.14); break;
      case 'buy': [784, 988, 1175, 1568].forEach((f, i) => this._tone('triangle', f, f, 0.14, 0.14, i * 0.07)); break;
      case 'error': this._tone('square', 200, 160, 0.16, 0.1); this._tone('square', 160, 120, 0.2, 0.1, 0.12); break;
      case 'level': [523, 659, 784, 1046, 1318].forEach((f, i) => this._tone('triangle', f, f, 0.2, 0.15, i * 0.08)); break;
      case 'reward': this._tone('triangle', 988, 1480, 0.18, 0.13); break;
      case 'tick': this._tone('sine', 1200, 1200, 0.03, 0.05); break;
      case 'victory': [523, 659, 784, 1046, 784, 1046, 1318].forEach((f, i) => this._tone('square', f, f, 0.22, 0.1, i * 0.12)); break;
      case 'defeat': [440, 392, 349, 262].forEach((f, i) => this._tone('triangle', f, f * 0.98, 0.3, 0.12, i * 0.16)); break;
      case 'emote': this._tone('sine', 600, 900, 0.12, 0.12); break;
      case 'switch': this._noise(0.04, 0.12, 1800, 2); break;
      case 'empty': this._tone('square', 300, 300, 0.03, 0.06); break;
    }
  }

  /* ---- music: a tiny sequencer, two moods ---- */

  setMusic(mode) {
    this.musicMode = mode;
    this.musicOn = mode !== 'off';
    if (this.ctx) this.nextNoteT = Math.max(this.nextNoteT, this.ctx.currentTime + 0.05);
  }

  _schedule() {
    if (!this.ctx || !this.musicOn || this.settings.music <= 0 || this.ctx.state !== 'running') return;
    const menu = this.musicMode === 'menu';
    const bpm = menu ? 104 : 124;
    const stepDur = 60 / bpm / 2;
    // I–V–vi–IV in C, bright and simple.
    const prog = [[48, 52, 55], [43, 47, 50], [45, 48, 52], [41, 45, 48]];
    const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
    while (this.nextNoteT < this.ctx.currentTime + 0.25) {
      const t = this.nextNoteT - this.ctx.currentTime;
      const bar = Math.floor(this.step / 8) % 4, s = this.step % 8;
      const ch = prog[bar];
      if (s === 0) { this._tone('triangle', mtof(ch[0] - 12), mtof(ch[0] - 12), stepDur * 3.5, 0.16, t, this.music); }
      if (s === 4) { this._tone('triangle', mtof(ch[0] - 12), mtof(ch[0] - 12), stepDur * 1.5, 0.12, t, this.music); }
      if (menu) {
        const arp = [ch[0], ch[1], ch[2], ch[1] + 12, ch[2], ch[1], ch[0] + 12, ch[2]][s];
        this._tone('sine', mtof(arp + 12), mtof(arp + 12), stepDur * 0.9, 0.06, t, this.music);
      } else {
        if (s % 2 === 0) this._noise(0.05, 0.05, 6000, 1, 'highpass', t, this.music);
        if (s === 0 || s === 4) this._tone('sine', 110, 45, 0.16, 0.25, t, this.music);
        if (s === 2 || s === 6) this._noise(0.12, 0.08, 1800, 0.8, 'bandpass', t, this.music);
        if (s === 3 || s === 7) this._tone('square', mtof(ch[2] + 12), mtof(ch[2] + 12), stepDur * 0.5, 0.025, t, this.music);
      }
      this.nextNoteT += stepDur;
      this.step++;
    }
  }
}
