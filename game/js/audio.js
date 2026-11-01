// Every sound is synthesised with WebAudio: no audio files to download.
import { WEAPONS } from './config.js';

class Audio {
  constructor() {
    this.ctx = null;
    this.vol = { master: 0.8, music: 0.5, sfx: 0.8 };
    this.listener = { x: 0, z: 0 };
    this.musicTimer = null;
    this.musicMode = null;
    this.lastStep = 0;
  }

  // Must be called from a user gesture.
  unlock() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.connect(this.ctx.destination);
    this.sfx = this.ctx.createGain();
    this.sfx.connect(this.master);
    this.musicBus = this.ctx.createGain();
    this.musicBus.connect(this.master);
    this.ambBus = this.ctx.createGain();
    this.ambBus.connect(this.sfx);
    this.ambBus.gain.value = 0;
    // noise buffer reused by every noisy sound
    const len = this.ctx.sampleRate * 2;
    this.noise = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = this.noise.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    this.applyVolumes();
    this.startAmbience();
    if (this.pendingMusic) { this.music(this.pendingMusic); this.pendingMusic = null; }
  }

  setVolumes(v) { Object.assign(this.vol, v); this.applyVolumes(); }
  applyVolumes() {
    if (!this.ctx) return;
    this.master.gain.value = this.vol.master;
    this.sfx.gain.value = this.vol.sfx;
    this.musicBus.gain.value = this.vol.music * 0.55;
  }

  // Distance attenuation + stereo pan relative to the listener.
  spatial(x, z, range = 60) {
    if (x === undefined) return { gain: 1, pan: 0 };
    const dx = x - this.listener.x, dz = z - this.listener.z;
    const d = Math.hypot(dx, dz);
    if (d > range) return null;
    return { gain: Math.pow(1 - d / range, 1.6), pan: Math.max(-1, Math.min(1, dx / 25)) };
  }

  out(sp) {
    const g = this.ctx.createGain();
    g.gain.value = sp.gain;
    if (this.ctx.createStereoPanner) {
      const p = this.ctx.createStereoPanner();
      p.pan.value = sp.pan;
      g.connect(p); p.connect(this.sfx);
    } else g.connect(this.sfx);
    return g;
  }

  noiseBurst(dest, t, dur, freq, q = 1, type = 'lowpass', vol = 1) {
    const src = this.ctx.createBufferSource();
    src.buffer = this.noise;
    src.playbackRate.value = 0.8 + Math.random() * 0.4;
    const f = this.ctx.createBiquadFilter();
    f.type = type; f.frequency.value = freq; f.Q.value = q;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(f); f.connect(g); g.connect(dest);
    src.start(t, Math.random() * 1.5); src.stop(t + dur + 0.05);
  }

  tone(dest, t, dur, f0, f1, type = 'sine', vol = 0.5, attack = 0.005) {
    const o = this.ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(dest);
    o.start(t); o.stop(t + dur + 0.05);
  }

  shot(weaponId, x, z) {
    if (!this.ctx) return;
    const sp = this.spatial(x, z, weaponId === 'sniper' ? 120 : 70);
    if (!sp) return;
    const w = WEAPONS[weaponId];
    const s = w.sound;
    const t = this.ctx.currentTime;
    const o = this.out(sp);
    this.noiseBurst(o, t, s.decay, s.freq * 3, 0.7, 'lowpass', s.noise * 0.9);
    this.tone(o, t, s.decay * 1.2, s.freq * 0.3 + 60, 40, 'triangle', s.boom * 0.7);
    this.noiseBurst(o, t, 0.03, 4000, 1, 'highpass', 0.4);
  }

  punch(x, z) {
    if (!this.ctx) return;
    const sp = this.spatial(x, z, 30); if (!sp) return;
    const t = this.ctx.currentTime, o = this.out(sp);
    this.noiseBurst(o, t, 0.08, 900, 1, 'lowpass', 0.6);
    this.tone(o, t, 0.1, 160, 60, 'sine', 0.5);
  }

  reload(x, z) {
    if (!this.ctx) return;
    const sp = this.spatial(x, z, 25); if (!sp) return;
    const t = this.ctx.currentTime, o = this.out(sp);
    this.noiseBurst(o, t, 0.04, 3000, 4, 'bandpass', 0.5);
    this.noiseBurst(o, t + 0.25, 0.05, 2200, 4, 'bandpass', 0.6);
    this.tone(o, t + 0.25, 0.05, 1200, 800, 'square', 0.08);
  }

  reloadDone(x, z) {
    if (!this.ctx) return;
    const sp = this.spatial(x, z, 25); if (!sp) return;
    const t = this.ctx.currentTime, o = this.out(sp);
    this.noiseBurst(o, t, 0.05, 2600, 5, 'bandpass', 0.7);
    this.tone(o, t, 0.06, 1500, 1000, 'square', 0.08);
  }

  step(x, z) {
    if (!this.ctx) return;
    const sp = this.spatial(x, z, 18); if (!sp) return;
    const t = this.ctx.currentTime, o = this.out(sp);
    this.noiseBurst(o, t, 0.06, 500 + Math.random() * 200, 1, 'lowpass', 0.22);
  }

  pickup() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.tone(this.sfx, t, 0.09, 660, 660, 'triangle', 0.25);
    this.tone(this.sfx, t + 0.07, 0.14, 990, 990, 'triangle', 0.25);
  }

  hit() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.tone(this.sfx, t, 0.06, 1800, 1400, 'square', 0.07);
  }

  hurt() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.tone(this.sfx, t, 0.18, 220, 110, 'sawtooth', 0.12);
    this.noiseBurst(this.sfx, t, 0.12, 700, 1, 'lowpass', 0.35);
  }

  armorHit() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.tone(this.sfx, t, 0.12, 2400, 1600, 'triangle', 0.12);
  }

  eliminate() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    [784, 988, 1319].forEach((f, i) => this.tone(this.sfx, t + i * 0.07, 0.25, f, f, 'triangle', 0.22));
  }

  crate(x, z) {
    if (!this.ctx) return;
    const sp = this.spatial(x, z, 40); if (!sp) return;
    const t = this.ctx.currentTime, o = this.out(sp);
    this.noiseBurst(o, t, 0.25, 1200, 1, 'lowpass', 0.8);
    this.tone(o, t, 0.2, 180, 70, 'triangle', 0.4);
  }

  woodHit(x, z) {
    if (!this.ctx) return;
    const sp = this.spatial(x, z, 25); if (!sp) return;
    const t = this.ctx.currentTime, o = this.out(sp);
    this.tone(o, t, 0.06, 420, 260, 'triangle', 0.2);
  }

  explosion(x, z) {
    if (!this.ctx) return;
    const sp = this.spatial(x, z, 110); if (!sp) return;
    const t = this.ctx.currentTime, o = this.out(sp);
    this.noiseBurst(o, t, 0.9, 600, 0.7, 'lowpass', 1.2);
    this.tone(o, t, 0.8, 90, 30, 'sine', 1.0);
  }

  heal() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    [523, 659, 784].forEach((f, i) => this.tone(this.sfx, t + i * 0.08, 0.3, f, f, 'sine', 0.18));
  }

  gulp() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    for (let i = 0; i < 3; i++) this.tone(this.sfx, t + i * 0.12, 0.1, 300, 520, 'sine', 0.25);
  }

  click() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.tone(this.sfx, t, 0.05, 900, 700, 'triangle', 0.15);
  }

  empty() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.tone(this.sfx, t, 0.03, 2000, 2000, 'square', 0.05);
  }

  whoosh() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.noiseBurst(this.sfx, t, 1.2, 800, 0.5, 'bandpass', 0.5);
  }

  chute() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.noiseBurst(this.sfx, t, 0.35, 1500, 0.8, 'bandpass', 0.8);
  }

  warn() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.tone(this.sfx, t, 0.25, 440, 440, 'square', 0.08);
    this.tone(this.sfx, t + 0.3, 0.35, 330, 330, 'square', 0.08);
  }

  jingle(win) {
    if (!this.ctx) return;
    this.music(null);
    const t = this.ctx.currentTime + 0.05;
    const notes = win ? [523, 659, 784, 1047, 784, 1047, 1319] : [392, 370, 349, 262];
    const durs = win ? [0.14, 0.14, 0.14, 0.3, 0.14, 0.14, 0.7] : [0.3, 0.3, 0.3, 0.9];
    let tt = t;
    notes.forEach((f, i) => {
      this.tone(this.musicBus, tt, durs[i] + 0.1, f, f, win ? 'square' : 'triangle', 0.18);
      this.tone(this.musicBus, tt, durs[i] + 0.1, f / 2, f / 2, 'triangle', 0.18);
      tt += durs[i];
    });
  }

  // ---------------------------------------------------------------- ambience
  startAmbience() {
    const src = this.ctx.createBufferSource();
    src.buffer = this.noise; src.loop = true;
    const f = this.ctx.createBiquadFilter();
    f.type = 'lowpass'; f.frequency.value = 420;
    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 0.12;
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 180;
    lfo.connect(lfoGain); lfoGain.connect(f.frequency);
    const g = this.ctx.createGain(); g.gain.value = 0.22;
    src.connect(f); f.connect(g); g.connect(this.ambBus);
    src.start(); lfo.start();
    // birds
    this.birdTimer = setInterval(() => {
      if (!this.ctx || this.ambBus.gain.value < 0.05 || Math.random() < 0.5) return;
      const t = this.ctx.currentTime;
      const base = 2200 + Math.random() * 1500;
      for (let i = 0; i < 2 + Math.floor(Math.random() * 3); i++) this.tone(this.ambBus, t + i * 0.11, 0.08, base, base * 1.25, 'sine', 0.05);
    }, 2200);
  }

  ambience(on) {
    if (!this.ctx) return;
    this.ambBus.gain.setTargetAtTime(on ? 1 : 0, this.ctx.currentTime, 0.5);
  }

  // ---------------------------------------------------------------- music
  // A tiny step sequencer: chords, bass, lead arpeggio and drums.
  music(mode) {
    if (!this.ctx) { this.pendingMusic = mode; return; }
    if (this.musicMode === mode) return;
    this.musicMode = mode;
    if (this.musicTimer) { clearInterval(this.musicTimer); this.musicTimer = null; }
    if (!mode) return;
    const bpm = mode === 'menu' ? 112 : 132;
    const stepDur = 60 / bpm / 4;
    const prog = mode === 'menu'
      ? [[261.6, 329.6, 392], [220, 261.6, 329.6], [174.6, 220, 261.6], [196, 246.9, 293.7]]
      : [[220, 261.6, 329.6], [174.6, 220, 261.6], [196, 246.9, 293.7], [164.8, 207.7, 246.9]];
    let step = 0;
    let next = this.ctx.currentTime + 0.1;
    const vol = mode === 'menu' ? 1 : 0.5;
    const schedule = () => {
      while (next < this.ctx.currentTime + 0.25) {
        const bar = Math.floor(step / 16) % 4;
        const s = step % 16;
        const chord = prog[bar];
        const b = this.musicBus;
        if (s === 0 || s === 8) chord.forEach((f) => this.tone(b, next, stepDur * 7, f, f, 'triangle', 0.05 * vol, 0.02));
        if (s % 4 === 0) this.tone(b, next, stepDur * 3, chord[0] / 2, chord[0] / 2, 'sawtooth', 0.06 * vol);
        if (s % 2 === 0) {
          const arp = chord[(s / 2) % 3] * 2;
          this.tone(b, next, stepDur * 1.5, arp, arp, 'square', 0.025 * vol);
        }
        if (s % 8 === 0) this.tone(b, next, 0.18, 140, 45, 'sine', 0.35 * vol);
        if (s % 8 === 4) this.noiseBurst(b, next, 0.12, 2500, 0.8, 'bandpass', 0.18 * vol);
        if (s % 2 === 1) this.noiseBurst(b, next, 0.03, 8000, 1, 'highpass', 0.05 * vol);
        next += stepDur;
        step++;
      }
    };
    schedule();
    this.musicTimer = setInterval(schedule, 60);
  }
}

export const audio = new Audio();
