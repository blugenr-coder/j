/* Shorts Studio — shared helpers and the procedural audio engine.
   Plain scripts on a global namespace so the page opens straight from disk. */
(function () {
  const WI = (window.WI = window.WI || {});

  WI.W = 1080;
  WI.H = 1920;
  WI.GY = 1500; // world y of the ground line
  WI.TAU = Math.PI * 2;

  const clamp = (WI.clamp = (v, a, b) => (v < a ? a : v > b ? b : v));
  WI.lerp = (a, b, t) => a + (b - a) * t;
  WI.smooth = (a, b, v) => {
    const t = clamp((v - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
  };
  WI.ease = {
    linear: (t) => t,
    in: (t) => t * t * t,
    out: (t) => 1 - Math.pow(1 - t, 3),
    inOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    outBack: (t) => {
      const c1 = 1.70158, c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    },
    outElastic: (t) =>
      t === 0 || t === 1 ? t : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (WI.TAU / 3)) + 1,
  };

  // Seeded generator so the same idea always animates the same way.
  WI.RNG = function (seed) {
    let s = seed >>> 0;
    const r = () => {
      s = (s + 0x6d2b79f5) >>> 0;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    r.range = (a, b) => a + (b - a) * r();
    r.int = (a, b) => Math.floor(a + (b - a + 1) * r());
    r.pick = (arr) => arr[Math.floor(r() * arr.length)];
    r.chance = (p) => r() < p;
    r.sign = () => (r() < 0.5 ? -1 : 1);
    return r;
  };
  WI.hash = function (str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  };

  // Colours are kept as hex strings; mixing goes through a parse cache.
  const rgbCache = new Map();
  const toRGB = (WI.toRGB = (c) => {
    let v = rgbCache.get(c);
    if (v) return v;
    let h = c.replace('#', '');
    if (h.length === 3) h = h.split('').map((x) => x + x).join('');
    v = [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
    rgbCache.set(c, v);
    return v;
  });
  const hx = (n) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0');
  WI.mix = (a, b, t) => {
    const A = toRGB(a), B = toRGB(b);
    t = clamp(t, 0, 1);
    return '#' + hx(A[0] + (B[0] - A[0]) * t) + hx(A[1] + (B[1] - A[1]) * t) + hx(A[2] + (B[2] - A[2]) * t);
  };
  WI.rgba = (c, a) => {
    const v = toRGB(c);
    return `rgba(${v[0]},${v[1]},${v[2]},${a})`;
  };
  WI.lum = (c) => {
    const v = toRGB(c);
    return (0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]) / 255;
  };
  WI.fmt = (n) => Math.round(n).toLocaleString('en-US');
  WI.big = function (n) {
    // Readable huge numbers: 1.2 million, 3.4 trillion, 2^90 beyond that.
    const names = [[1e21, 'sextillion'], [1e18, 'quintillion'], [1e15, 'quadrillion'], [1e12, 'trillion'], [1e9, 'billion'], [1e6, 'million']];
    if (n >= 1e24) return '10^' + Math.floor(Math.log10(n));
    for (const [v, w] of names) if (n >= v) return (n / v).toFixed(n / v < 10 ? 1 : 0).replace(/\.0$/, '') + ' ' + w;
    return WI.fmt(n);
  };

  /* ---------------------------------------------------------------------------
     Audio: everything is synthesised, so there is nothing to license and the
     soundtrack is captured straight into the recording through a
     MediaStreamDestination.
  --------------------------------------------------------------------------- */
  class AudioEngine {
    constructor() {
      this.ctx = null;
      this.volume = 0.8;
      this.musicVol = 0.55;
      this.last = {};
    }
    init() {
      if (this.live) return;
      const C = window.AudioContext || window.webkitAudioContext;
      this.live = new C();
      this.build(this.live, true);
    }
    // Builds the mixing graph on a context: the live one for previews, or an
    // OfflineAudioContext when a video is rendered frame by frame.
    build(ctx, live) {
      this.ctx = ctx;
      this.offline = !live;
      this.last = {};
      this.master = ctx.createGain();
      this.master.gain.value = this.volume;
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -16;
      comp.knee.value = 10;
      comp.ratio.value = 5;
      comp.attack.value = 0.004;
      comp.release.value = 0.2;
      this.master.connect(comp);
      comp.connect(ctx.destination);
      if (live) {
        this.dest = ctx.createMediaStreamDestination();
        comp.connect(this.dest);
      }

      this.musicBus = ctx.createGain();
      this.musicBus.gain.value = this.musicVol;
      this.musicBus.connect(this.master);
      this.sfx = ctx.createGain();
      this.sfx.connect(this.master);

      // Generated impulse response: a cheap, convincing "big space" reverb.
      const len = ctx.sampleRate * 2.6;
      const ir = ctx.createBuffer(2, len, ctx.sampleRate);
      for (let ch = 0; ch < 2; ch++) {
        const d = ir.getChannelData(ch);
        for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
      }
      this.verb = ctx.createConvolver();
      this.verb.buffer = ir;
      this.verbIn = ctx.createGain();
      this.verbIn.gain.value = 0.5;
      this.verbIn.connect(this.verb);
      this.verb.connect(this.master);

      const nl = ctx.sampleRate * 2;
      this.noise = ctx.createBuffer(1, nl, ctx.sampleRate);
      const nd = this.noise.getChannelData(0);
      for (let i = 0; i < nl; i++) nd[i] = Math.random() * 2 - 1;
    }
    setVolume(v) {
      this.volume = v;
      if (this.master) this.master.gain.value = v;
    }
    setMusicVolume(v) {
      this.musicVol = v;
      if (this.musicBus) this.musicBus.gain.value = v;
    }
    get t() {
      return this.offline ? this.clock : this.ctx.currentTime;
    }
    beginOffline(seconds, rate = 48000) {
      this.stopMusic(0);
      this.init();
      this.clock = 0;
      this.build(new OfflineAudioContext(2, Math.ceil(seconds * rate), rate), false);
    }
    // Called by the scene each frame: the offline clock is the scene clock.
    tickOffline(t) {
      this.clock = t;
      this.schedule();
    }
    async endOffline() {
      this.stopMusic(0.05);
      const buf = await this.ctx.startRendering();
      this.build(this.live, true);
      return buf;
    }
    // Rate-limit noisy repeated sounds (battle hits, pops in a crowd).
    gate(name, gap) {
      if (!this.ctx) return false;
      const now = this.t;
      if (this.last[name] && now - this.last[name] < gap) return false;
      this.last[name] = now;
      return true;
    }
    env(g, t, a, peak, d) {
      g.gain.cancelScheduledValues(t);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), t + a);
      g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
    }
    noiseSrc(t, dur) {
      const s = this.ctx.createBufferSource();
      s.buffer = this.noise;
      s.loop = true;
      s.start(t, Math.random() * 1.5);
      s.stop(t + dur + 0.1);
      return s;
    }
    osc(type, f, t, dur) {
      const o = this.ctx.createOscillator();
      o.type = type;
      o.frequency.setValueAtTime(f, t);
      o.start(t);
      o.stop(t + dur + 0.1);
      return o;
    }
    out(node, wet = 0) {
      node.connect(this.sfx);
      if (wet) {
        const g = this.ctx.createGain();
        g.gain.value = wet;
        node.connect(g);
        g.connect(this.verbIn);
      }
    }

    // --- sound effects -------------------------------------------------------
    boom(p = 1) {
      if (!this.ctx) return;
      const t = this.t, ctx = this.ctx;
      const dur = 1.4 + p * 2.2;
      const n = this.noiseSrc(t, dur);
      const f = ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.setValueAtTime(900 + 1600 * p, t);
      f.frequency.exponentialRampToValueAtTime(40, t + dur);
      const g = ctx.createGain();
      this.env(g, t, 0.01, 0.9 + 0.5 * p, dur);
      n.connect(f).connect(g);
      this.out(g, 0.6);
      const o = this.osc('sine', 90, t, dur);
      o.frequency.exponentialRampToValueAtTime(22, t + dur * 0.8);
      const g2 = ctx.createGain();
      this.env(g2, t, 0.005, 1.1, dur * 0.7);
      o.connect(g2);
      this.out(g2, 0.2);
    }
    thud(p = 0.5) {
      if (!this.gate('thud', 0.05)) return;
      const t = this.t, ctx = this.ctx;
      const o = this.osc('sine', 120, t, 0.4);
      o.frequency.exponentialRampToValueAtTime(35, t + 0.3);
      const g = ctx.createGain();
      this.env(g, t, 0.003, 0.7 * p, 0.35);
      o.connect(g);
      this.out(g, 0.15);
      const n = this.noiseSrc(t, 0.2);
      const f = ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.value = 700;
      const g2 = ctx.createGain();
      this.env(g2, t, 0.002, 0.4 * p, 0.15);
      n.connect(f).connect(g2);
      this.out(g2);
    }
    whoosh(dur = 0.6, up = true, vol = 0.35) {
      if (!this.gate('whoosh', 0.08)) return;
      const t = this.t, ctx = this.ctx;
      const n = this.noiseSrc(t, dur);
      const f = ctx.createBiquadFilter();
      f.type = 'bandpass';
      f.Q.value = 1.2;
      f.frequency.setValueAtTime(up ? 250 : 3500, t);
      f.frequency.exponentialRampToValueAtTime(up ? 3500 : 250, t + dur);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol, t + dur * 0.6);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      n.connect(f).connect(g);
      this.out(g, 0.3);
    }
    riser(dur = 3, vol = 0.3) {
      if (!this.ctx) return;
      const t = this.t, ctx = this.ctx;
      const n = this.noiseSrc(t, dur);
      const f = ctx.createBiquadFilter();
      f.type = 'bandpass';
      f.Q.value = 3;
      f.frequency.setValueAtTime(200, t);
      f.frequency.exponentialRampToValueAtTime(6000, t + dur);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol, t + dur);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.05);
      n.connect(f).connect(g);
      this.out(g, 0.4);
      const o = this.osc('sawtooth', 80, t, dur);
      o.frequency.exponentialRampToValueAtTime(900, t + dur);
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 1800;
      const g2 = ctx.createGain();
      g2.gain.setValueAtTime(0.0001, t);
      g2.gain.exponentialRampToValueAtTime(vol * 0.25, t + dur);
      g2.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.05);
      o.connect(lp).connect(g2);
      this.out(g2, 0.3);
    }
    pop(pitch = 1, vol = 0.22) {
      if (!this.gate('pop', 0.035)) return;
      const t = this.t, ctx = this.ctx;
      const o = this.osc('sine', 500 * pitch, t, 0.12);
      o.frequency.exponentialRampToValueAtTime(1100 * pitch, t + 0.05);
      const g = ctx.createGain();
      this.env(g, t, 0.003, vol, 0.1);
      o.connect(g);
      this.out(g, 0.1);
    }
    tick(vol = 0.12) {
      if (!this.gate('tick', 0.03)) return;
      const t = this.t, ctx = this.ctx;
      const o = this.osc('square', 2400, t, 0.03);
      const g = ctx.createGain();
      this.env(g, t, 0.001, vol, 0.025);
      o.connect(g);
      this.out(g);
    }
    hit(vol = 0.25) {
      if (!this.gate('hit', 0.045)) return;
      const t = this.t, ctx = this.ctx;
      const n = this.noiseSrc(t, 0.12);
      const f = ctx.createBiquadFilter();
      f.type = 'bandpass';
      f.frequency.value = 900 + Math.random() * 900;
      f.Q.value = 1.5;
      const g = ctx.createGain();
      this.env(g, t, 0.001, vol, 0.09);
      n.connect(f).connect(g);
      this.out(g, 0.1);
      const o = this.osc('triangle', 180 + Math.random() * 60, t, 0.1);
      const g2 = ctx.createGain();
      this.env(g2, t, 0.001, vol * 0.6, 0.08);
      o.connect(g2);
      this.out(g2);
    }
    zap(vol = 0.12) {
      if (!this.gate('zap', 0.06)) return;
      const t = this.t, ctx = this.ctx;
      const o = this.osc('square', 1500, t, 0.2);
      o.frequency.exponentialRampToValueAtTime(160, t + 0.18);
      const g = ctx.createGain();
      this.env(g, t, 0.002, vol, 0.18);
      o.connect(g);
      this.out(g, 0.3);
    }
    alarm(dur = 3, vol = 0.06) {
      if (!this.ctx) return;
      const t = this.t, ctx = this.ctx;
      const o = this.osc('square', 660, t, dur);
      for (let i = 0; i < dur / 0.45; i++) o.frequency.setValueAtTime(i % 2 ? 880 : 660, t + i * 0.45);
      const f = ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.value = 1800;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol, t + 0.2);
      g.gain.setValueAtTime(vol, t + dur - 0.3);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(f).connect(g);
      this.out(g, 0.5);
    }
    rumble(dur = 3, vol = 0.5) {
      if (!this.ctx) return;
      const t = this.t, ctx = this.ctx;
      const n = this.noiseSrc(t, dur);
      const f = ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.value = 110;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol, t + dur * 0.3);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      n.connect(f).connect(g);
      this.out(g);
    }
    shimmer(down = true, vol = 0.12) {
      if (!this.ctx) return;
      const t = this.t, ctx = this.ctx;
      [1, 1.5, 2.01].forEach((m, i) => {
        const o = this.osc('sine', (down ? 2200 : 500) * m, t + i * 0.04, 1.6);
        o.frequency.exponentialRampToValueAtTime((down ? 300 : 2400) * m, t + 1.5);
        const g = ctx.createGain();
        this.env(g, t + i * 0.04, 0.02, vol / (i + 1), 1.4);
        o.connect(g);
        this.out(g, 0.8);
      });
    }
    splash(vol = 0.3) {
      if (!this.gate('splash', 0.08)) return;
      const t = this.t, ctx = this.ctx;
      const n = this.noiseSrc(t, 0.6);
      const f = ctx.createBiquadFilter();
      f.type = 'highpass';
      f.frequency.setValueAtTime(400, t);
      f.frequency.exponentialRampToValueAtTime(2500, t + 0.5);
      const g = ctx.createGain();
      this.env(g, t, 0.005, vol, 0.5);
      n.connect(f).connect(g);
      this.out(g, 0.3);
    }
    growl(dur = 1.5, vol = 0.3) {
      if (!this.ctx) return;
      const t = this.t, ctx = this.ctx;
      const o = this.osc('sawtooth', 70, t, dur);
      o.frequency.linearRampToValueAtTime(52, t + dur);
      const lfo = this.osc('sine', 23, t, dur);
      const lg = ctx.createGain();
      lg.gain.value = 18;
      lfo.connect(lg).connect(o.frequency);
      const f = ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.value = 600;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol, t + 0.15);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(f).connect(g);
      this.out(g, 0.5);
    }
    heartbeat() {
      if (!this.ctx) return;
      [0, 0.22].forEach((d, i) => {
        const t = this.t + d, ctx = this.ctx;
        const o = this.osc('sine', 70, t, 0.25);
        o.frequency.exponentialRampToValueAtTime(40, t + 0.2);
        const g = ctx.createGain();
        this.env(g, t, 0.005, i ? 0.45 : 0.6, 0.2);
        o.connect(g);
        this.out(g);
      });
    }

    // --- music ---------------------------------------------------------------
    // A tension bed whose layers enter as intensity rises: drone, then hats,
    // then kick, then bass line, then snare. Scenarios only steer intensity.
    startMusic(rng) {
      if (!this.ctx) return;
      this.stopMusic(0);
      const ctx = this.ctx, t = this.t;
      const roots = [41.2, 43.65, 46.25, 49.0, 51.91, 55.0];
      const root = rng.pick(roots);
      const m = (this.music = { root, step: 0, next: t + 0.05, bpm: rng.pick([96, 100, 104, 110]), intensity: 0.15, nodes: [] });
      m.pattern = rng.pick([[0, 0, 12, 0, 3, 0, 12, 7], [0, 12, 0, 10, 0, 12, 7, 3], [0, 0, 3, 0, 0, 7, 5, 3], [0, 7, 12, 7, 0, 3, 5, 7]]);
      const filt = (m.filter = ctx.createBiquadFilter());
      filt.type = 'lowpass';
      filt.Q.value = 7;
      filt.frequency.value = 220;
      const dg = (m.drone = ctx.createGain());
      dg.gain.setValueAtTime(0.0001, t);
      dg.gain.exponentialRampToValueAtTime(0.16, t + 1.2);
      filt.connect(dg).connect(this.musicBus);
      [[root, 'sawtooth', 0], [root * 1.4983, 'sawtooth', 4], [root * 2, 'triangle', -3], [root / 2, 'sine', 0]].forEach(([f, type, det]) => {
        const o = ctx.createOscillator();
        o.type = type;
        o.frequency.value = f;
        o.detune.value = det;
        o.connect(filt);
        o.start(t);
        m.nodes.push(o);
      });
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.13;
      const lg = ctx.createGain();
      lg.gain.value = 90;
      lfo.connect(lg).connect(filt.frequency);
      lfo.start(t);
      m.nodes.push(lfo);
      if (!this.offline) this.musicTimer = setInterval(() => this.schedule(), 25);
    }
    setIntensity(x) {
      if (!this.music) return;
      this.music.intensity = clamp(x, 0, 1);
      const f = 200 + 2600 * x * x;
      this.music.filter.frequency.setTargetAtTime(f, this.t, 0.4);
    }
    schedule() {
      const m = this.music;
      if (!m) return;
      const spb = 60 / m.bpm / 4; // sixteenth notes
      while (m.next < this.t + 0.12) {
        this.musicStep(m, m.step, m.next);
        m.step++;
        m.next += spb;
      }
    }
    musicStep(m, step, t) {
      const ctx = this.ctx, I = m.intensity, s16 = step % 16;
      const bus = this.musicBus;
      const fire = (node, g) => {
        node.connect(g);
        g.connect(bus);
      };
      if (I > 0.3 && step % 2 === 1) {
        const n = this.noiseSrc(t, 0.05);
        const f = ctx.createBiquadFilter();
        f.type = 'highpass';
        f.frequency.value = 7500;
        const g = ctx.createGain();
        this.env(g, t, 0.001, 0.05 + 0.05 * I, 0.04);
        n.connect(f);
        fire(f, g);
      }
      const kickEvery = I > 0.75 ? 4 : 8;
      if (I > 0.42 && s16 % kickEvery === 0) {
        const o = this.osc('sine', 150, t, 0.4);
        o.frequency.exponentialRampToValueAtTime(42, t + 0.14);
        const g = ctx.createGain();
        this.env(g, t, 0.002, 0.75, 0.32);
        fire(o, g);
      }
      if (I > 0.55 && step % 2 === 0) {
        const semi = m.pattern[(step / 2) % 8];
        const o = this.osc('sawtooth', m.root * 2 * Math.pow(2, semi / 12), t, 0.2);
        const f = ctx.createBiquadFilter();
        f.type = 'lowpass';
        f.frequency.setValueAtTime(1400, t);
        f.frequency.exponentialRampToValueAtTime(200, t + 0.16);
        const g = ctx.createGain();
        this.env(g, t, 0.003, 0.16, 0.17);
        o.connect(f);
        fire(f, g);
      }
      if (I > 0.8 && (s16 === 4 || s16 === 12)) {
        const n = this.noiseSrc(t, 0.2);
        const f = ctx.createBiquadFilter();
        f.type = 'bandpass';
        f.frequency.value = 1900;
        const g = ctx.createGain();
        this.env(g, t, 0.002, 0.3, 0.16);
        n.connect(f);
        fire(f, g);
      }
    }
    stopMusic(fade = 1.2) {
      clearInterval(this.musicTimer);
      const m = this.music;
      this.music = null;
      if (!m || !this.ctx) return;
      const t = this.t;
      m.drone.gain.cancelScheduledValues(t);
      m.drone.gain.setValueAtTime(m.drone.gain.value || 0.0001, t);
      m.drone.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(fade, 0.02));
      m.nodes.forEach((o) => o.stop(t + fade + 0.1));
    }
  }
  WI.AudioEngine = AudioEngine;
})();
