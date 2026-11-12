// Synthesised sound: no audio files, everything is generated with WebAudio.
let ctx = null, master, engineGain, engineFilter, windGain, windFilter, noiseBuf;

function noise() {
  const b = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate), d = b.getChannelData(0);
  let last = 0; for (let i = 0; i < d.length; i++) { const w = Math.random() * 2 - 1; last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; }
  return b;
}
function loop(buf) { const s = ctx.createBufferSource(); s.buffer = buf; s.loop = true; s.start(); return s; }

export const Audio = {
  muted: false,
  unlock() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch { return; }
    master = ctx.createGain(); master.gain.value = this.muted ? 0 : 0.7; master.connect(ctx.destination);
    noiseBuf = noise();
    engineFilter = ctx.createBiquadFilter(); engineFilter.type = 'lowpass'; engineFilter.frequency.value = 300;
    engineGain = ctx.createGain(); engineGain.gain.value = 0;
    loop(noiseBuf).connect(engineFilter); engineFilter.connect(engineGain); engineGain.connect(master);
    windFilter = ctx.createBiquadFilter(); windFilter.type = 'bandpass'; windFilter.frequency.value = 800; windFilter.Q.value = 0.6;
    windGain = ctx.createGain(); windGain.gain.value = 0;
    const white = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate); const w = white.getChannelData(0); for (let i = 0; i < w.length; i++) w[i] = Math.random() * 2 - 1;
    loop(white).connect(windFilter); windFilter.connect(windGain); windGain.connect(master);
  },
  setMuted(m) { this.muted = m; if (master) master.gain.value = m ? 0 : 0.7; },
  engine(level, pressure) {
    if (!ctx) return;
    engineGain.gain.setTargetAtTime(level * (0.25 + 0.75 * pressure) * 0.9, ctx.currentTime, 0.08);
    engineFilter.frequency.setTargetAtTime(180 + level * 500 * (0.4 + pressure), ctx.currentTime, 0.1);
  },
  wind(level) { if (!ctx) return; windGain.gain.setTargetAtTime(Math.min(0.35, level), ctx.currentTime, 0.2); windFilter.frequency.setTargetAtTime(500 + level * 1500, ctx.currentTime, 0.2); },
  tone(freq, dur = 0.12, type = 'square', vol = 0.12, slide = 0) {
    if (!ctx) return;
    const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime;
    o.type = type; o.frequency.setValueAtTime(freq, t); if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t + dur);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.02);
  },
  burst(dur = 0.6, vol = 0.6, freq = 400) {
    if (!ctx) return;
    const s = ctx.createBufferSource(); s.buffer = noiseBuf; const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = freq;
    const g = ctx.createGain(), t = ctx.currentTime; g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    s.connect(f); f.connect(g); g.connect(master); s.start(t, Math.random()); s.stop(t + dur);
  },
  cue(name) {
    switch (name) {
      case 'click': return this.tone(900, 0.04, 'square', 0.05);
      case 'buy': this.tone(660, 0.07, 'square', 0.06); return setTimeout(() => this.tone(990, 0.09, 'square', 0.06), 70);
      case 'sell': return this.tone(500, 0.1, 'triangle', 0.08, -150);
      case 'error': return this.tone(140, 0.2, 'sawtooth', 0.08);
      case 'grab': return this.tone(260, 0.08, 'sine', 0.15, 120);
      case 'drop': return this.burst(0.15, 0.25, 900);
      case 'clank': this.burst(0.2, 0.5, 2200); return this.tone(180, 0.15, 'triangle', 0.15, -60);
      case 'thud': return this.burst(0.25, 0.6, 300);
      case 'alarm': this.tone(880, 0.12, 'square', 0.08); return setTimeout(() => this.tone(660, 0.12, 'square', 0.08), 140);
      case 'chime': this.tone(784, 0.1, 'sine', 0.12); return setTimeout(() => this.tone(1175, 0.18, 'sine', 0.12), 100);
      case 'ok': return this.tone(1046, 0.12, 'sine', 0.12);
      case 'fail': return this.tone(220, 0.35, 'sawtooth', 0.1, -100);
      case 'tick': return this.tone(1400, 0.025, 'square', 0.04);
      case 'buzz': return this.tone(110, 0.15, 'square', 0.08);
      case 'ignite': return this.burst(1.2, 0.8, 600);
      case 'liftoff': return this.burst(1.5, 0.5, 250);
      case 'stage': this.burst(0.3, 0.8, 3000); return this.tone(90, 0.3, 'sine', 0.3, -40);
      case 'chute': return this.burst(0.5, 0.5, 1500);
      case 'rip': return this.burst(0.4, 0.8, 4000);
      case 'break': return this.burst(0.5, 0.8, 1200);
      case 'explode': this.burst(2.5, 1, 350); return this.burst(1, 1, 2000);
      case 'land': return this.burst(0.5, 0.7, 400);
      case 'clunk': return this.tone(120, 0.2, 'square', 0.15);
      case 'success': [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => this.tone(f, 0.25, 'triangle', 0.1), i * 120)); return;
    }
  },
};
