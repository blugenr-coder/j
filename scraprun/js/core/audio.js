/* Game audio: a master bus with music and sound-effect buses under it.

   The volume settings drive real gain nodes, so they affect everything that
   plays through these buses. The project has no audio files yet, so the UI
   sounds (hover tick, click thunk) are synthesised: short metallic blips made
   from an oscillator and a burst of filtered noise. Music tracks, when they
   exist, connect to `music`.

   Browsers only allow sound after the player has interacted with the page,
   so the audio context is created on the first click or key press. */

import { settings } from './store.js';

class AudioBus {
  constructor() {
    this.ctx = null;
    settings.subscribe((s) => this.#applyVolumes(s));
  }

  /** Creates the context. Safe to call repeatedly; does nothing without
      Web Audio. */
  unlock() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try {
      this.ctx = new AC();
    } catch { return; }
    this.master = this.ctx.createGain();
    this.music = this.ctx.createGain();
    this.sfx = this.ctx.createGain();
    this.music.connect(this.master);
    this.sfx.connect(this.master);
    this.master.connect(this.ctx.destination);
    this.noise = this.#makeNoise();
    this.#applyVolumes(settings.all);
  }

  #applyVolumes(s) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    /* squared, so the slider feels even to the ear */
    this.master.gain.setTargetAtTime(s.masterVolume ** 2, t, 0.02);
    this.music.gain.setTargetAtTime(s.musicVolume ** 2, t, 0.02);
    this.sfx.gain.setTargetAtTime(s.sfxVolume ** 2, t, 0.02);
  }

  #makeNoise() {
    const len = this.ctx.sampleRate * 0.2;
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }

  #blip({ freq, to, dur, type = 'square', gain = 0.2, noise = 0, band = 2400 }) {
    if (!this.ctx || this.ctx.state !== 'running') return;
    const t = this.ctx.currentTime;
    const out = this.ctx.createGain();
    out.gain.setValueAtTime(gain, t);
    out.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    out.connect(this.sfx);
    const o = this.ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    o.frequency.exponentialRampToValueAtTime(to, t + dur);
    o.connect(out);
    o.start(t);
    o.stop(t + dur + 0.02);
    if (noise) {
      const n = this.ctx.createBufferSource();
      n.buffer = this.noise;
      const f = this.ctx.createBiquadFilter();
      f.type = 'bandpass';
      f.frequency.value = band;
      f.Q.value = 3;
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(noise, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur * 0.7);
      n.connect(f); f.connect(g); g.connect(this.sfx);
      n.start(t);
      n.stop(t + dur);
    }
  }

  hover() { this.#blip({ freq: 1400, to: 900, dur: 0.035, type: 'triangle', gain: 0.05 }); }
  click() { this.#blip({ freq: 190, to: 70, dur: 0.12, gain: 0.16, noise: 0.22, band: 2600 }); }
  back() { this.#blip({ freq: 140, to: 60, dur: 0.1, gain: 0.12, noise: 0.12, band: 1400 }); }
  /** A short tick at the new level, so moving a volume slider is audible. */
  tick() { this.#blip({ freq: 880, to: 700, dur: 0.05, type: 'triangle', gain: 0.12 }); }
}

export const audio = new AudioBus();
