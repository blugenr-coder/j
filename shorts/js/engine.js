/* Shorts Studio — the animation engine.
   One Scene renders one idea onto a 1080x1920 canvas. Scenarios (scenarios.js)
   drive it through beats at fixed times; the engine owns the world, the
   physics, the effects and the on-screen text. */
(function () {
  const { W, H, GY, TAU, clamp, lerp, smooth, ease, mix, rgba } = WI;
  const FONT = '"Anton", Impact, "Arial Narrow", sans-serif';

  /* ---------------------------------------------------------------- sprites */
  const softCache = new Map();
  function soft(color) {
    let c = softCache.get(color);
    if (c) return c;
    c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d');
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, rgba(color, 1));
    gr.addColorStop(0.35, rgba(color, 0.6));
    gr.addColorStop(1, rgba(color, 0));
    g.fillStyle = gr;
    g.fillRect(0, 0, 64, 64);
    if (softCache.size > 400) softCache.clear();
    softCache.set(color, c);
    return c;
  }
  function makeGrain() {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const g = c.getContext('2d');
    const img = g.createImageData(256, 256);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.random() * 255;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    return c;
  }
  function makeVignette() {
    const c = document.createElement('canvas');
    c.width = W / 4;
    c.height = H / 4;
    const g = c.getContext('2d');
    const gr = g.createRadialGradient(c.width / 2, c.height * 0.48, c.width * 0.25, c.width / 2, c.height / 2, c.height * 0.62);
    gr.addColorStop(0, 'rgba(0,0,0,0)');
    gr.addColorStop(1, 'rgba(0,0,0,0.75)');
    g.fillStyle = gr;
    g.fillRect(0, 0, c.width, c.height);
    return c;
  }
  WI.FS = 1.3;
  const HEAD = 15.5; // base stick-figure size: big enough to read on a phone
  // "*word*." -> one word drawn in two colours, so punctuation hugs the word.
  function parseMarked(text) {
    const words = [];
    let hi = false, cur = null;
    for (const ch of text) {
      if (ch === '*') {
        hi = !hi;
        continue;
      }
      if (/\s/.test(ch)) {
        cur = null;
        continue;
      }
      if (!cur) words.push((cur = { w: '', parts: [] }));
      cur.w += ch;
      const last = cur.parts[cur.parts.length - 1];
      if (last && last[1] === hi) last[0] += ch;
      else cur.parts.push([ch, hi]);
    }
    words.forEach((w) => (w.hi = w.parts.some((p) => p[1])));
    return words;
  }
  const FIRE = ['#fff6c2', '#ffd25a', '#ff9a2e', '#ff5a1f', '#c0261a', '#4a1410'];

  /* ------------------------------------------------------------ stick figure */
  // Local units: feet at y=0, a standing figure is ~115 tall. Angles are
  // measured from straight down, positive = towards the way it faces.
  function limb(x, y, a1, l1, a2, l2) {
    const kx = x + Math.sin(a1) * l1, ky = y + Math.cos(a1) * l1;
    return [kx, ky, kx + Math.sin(a2) * l2, ky + Math.cos(a2) * l2];
  }

  // Seeded per scene in Scene.load, so a preview and the final render match frame for frame.
  const figRand = () => (WI.figRng ? WI.figRng() : Math.random());
  class Fig {
    constructor(x, o = {}) {
      Object.assign(this, {
        x, y: GY, vx: 0, vy: 0, face: 1, scale: WI.FS, color: null, state: 'idle', mode: 'wander',
        phase: figRand() * TAU, air: false, angle: 0, av: 0, alive: true, visible: true, alpha: 1,
        tx: x, speed: 1, wait: figRand() * 2, squash: 1, lie: 0, lieDir: 1, atk: 0, team: 0, hp: 1,
        eyes: null, gear: null, dieOnLand: false, gmul: 1, hero: false, drag: 0.2, flat: 0,
      }, o);
    }
    pose(t) {
      const p = this.phase, s = Math.sin(p);
      let hipY = -52, lean = 0, bob = 0, headTilt = 0;
      let lt = 0.08, lk = 0.08, rt = -0.08, rk = -0.08; // thigh / shin, left & right
      let la = 0.18, lf = 0.3, ra = -0.18, rf = -0.05; // upper arm / forearm
      switch (this.state) {
        case 'walk': {
          lt = 0.45 * s; rt = -0.45 * s;
          lk = lt - Math.max(0, -s) * 0.7; rk = rt - Math.max(0, s) * 0.7;
          la = -0.4 * s; lf = la + 0.35; ra = 0.4 * s; rf = ra + 0.35;
          bob = -Math.abs(Math.cos(p)) * 3;
          break;
        }
        case 'run':
        case 'panic':
        case 'attack': {
          lt = 0.85 * s; rt = -0.85 * s;
          lk = lt - Math.max(0, -s) * 1.4 - 0.2; rk = rt - Math.max(0, s) * 1.4 - 0.2;
          bob = -Math.abs(Math.cos(p)) * 6;
          lean = 0.22;
          la = -1.0 * s; lf = la + 1.4; ra = 1.0 * s; rf = ra + 1.4;
          if (this.state === 'panic') {
            lean = 0.05;
            la = Math.PI - 0.5 + Math.sin(p * 1.7) * 0.45; lf = la + 0.4;
            ra = -(Math.PI - 0.5) + Math.sin(p * 1.7 + 2) * 0.45; rf = ra - 0.4;
          }
          if (this.state === 'attack') {
            const k = this.atk;
            la = lerp(-0.6, 2.2, k); lf = la + lerp(1.6, 0.1, k);
          }
          break;
        }
        case 'lookup':
          headTilt = -5;
          la = 2.5 + Math.sin(t * 3) * 0.05; lf = 2.75;
          break;
        case 'cheer': {
          bob = -Math.abs(Math.sin(p * 0.8)) * 18;
          la = 2.55; lf = 2.9 + Math.sin(p * 1.6) * 0.3; ra = -2.55; rf = -2.9 - Math.sin(p * 1.6) * 0.3;
          lt = 0.15; rt = -0.15; lk = 0; rk = 0;
          break;
        }
        case 'zombie': {
          lt = 0.3 * s; rt = -0.3 * s; lk = lt - 0.15; rk = rt - 0.15;
          la = 1.45 + Math.sin(p * 0.5) * 0.08; lf = 1.55; ra = 1.35 + Math.sin(p * 0.5 + 1) * 0.08; rf = 1.6;
          lean = 0.12; headTilt = 4; bob = -Math.abs(Math.cos(p)) * 4;
          break;
        }
        case 'climb': {
          lt = 0.6 + 0.5 * s; rt = 0.6 - 0.5 * s; lk = lt - 1.3; rk = rt - 1.3;
          la = 2.7 + 0.3 * s; lf = 2.9; ra = 2.7 - 0.3 * s; rf = 2.9;
          break;
        }
        case 'sit': {
          hipY = -24;
          lt = 1.45; lk = -0.15; rt = 1.35; rk = -0.25;
          la = 1.0; lf = 1.9; ra = 0.8; rf = 1.8;
          lean = 0.1 + Math.sin(t * 2 + p) * 0.03;
          break;
        }
        case 'float':
        case 'air': {
          const k = this.state === 'air' ? 2.2 : 0.7, q = p * k;
          lt = 0.7 * Math.sin(q); rt = -0.7 * Math.sin(q + 1.1); lk = lt - 0.5; rk = rt - 0.5;
          la = 2.1 + Math.sin(q * 1.3) * 0.9; lf = la + 0.5; ra = -2.0 + Math.sin(q * 1.1 + 2) * 0.9; rf = ra - 0.5;
          break;
        }
        case 'dead': {
          lt = 0.25; rt = -0.35; lk = 0.4; rk = -0.2;
          la = 2.4; lf = 2.0; ra = -0.9; rf = -0.4;
          break;
        }
        default: {
          const br = Math.sin(t * 2.2 + p) * 0.04;
          la += br; ra -= br; bob = Math.sin(t * 2.2 + p) * 0.8;
        }
      }
      const hip = [0, hipY + bob];
      const sh = [Math.sin(lean) * 34, hipY + bob - Math.cos(lean) * 34];
      const neck = [Math.sin(lean) * 38, hipY + bob - Math.cos(lean) * 38];
      const head = [Math.sin(lean) * 52 + headTilt * 0.3, hipY + bob - Math.cos(lean) * 52 + (headTilt < 0 ? 2 : 0)];
      return {
        hip, sh, neck, head, headTilt,
        L: limb(hip[0], hip[1], lt, 27, lk, 27),
        R: limb(hip[0], hip[1], rt, 27, rk, 27),
        LA: limb(sh[0], sh[1], la, 21, lf, 21),
        RA: limb(sh[0], sh[1], ra, 21, rf, 21),
      };
    }
    draw(g, t, col, lod = 0) {
      if (!this.visible || this.alpha <= 0) return;
      const P = this.pose(t), c = this.color || col;
      g.save();
      g.translate(this.x, this.y + this.lie * 44 * this.scale);
      g.scale(this.face * this.scale, this.scale * this.squash);
      const ang = this.bodyAngle();
      if (ang) {
        g.translate(0, -50);
        g.rotate(ang);
        g.translate(0, 50);
      }
      if (this.alpha < 1) g.globalAlpha = this.alpha;
      g.strokeStyle = c;
      g.fillStyle = c;
      g.lineWidth = 7.5;
      g.lineCap = 'round';
      g.lineJoin = 'round';
      g.beginPath();
      g.moveTo(P.L[2], P.L[3]); g.lineTo(P.L[0], P.L[1]); g.lineTo(P.hip[0], P.hip[1]);
      g.lineTo(P.R[0], P.R[1]); g.lineTo(P.R[2], P.R[3]);
      g.moveTo(P.hip[0], P.hip[1]); g.lineTo(P.neck[0], P.neck[1]);
      g.moveTo(P.LA[2], P.LA[3]); g.lineTo(P.LA[0], P.LA[1]); g.lineTo(P.sh[0], P.sh[1]);
      g.lineTo(P.RA[0], P.RA[1]); g.lineTo(P.RA[2], P.RA[3]);
      g.stroke();
      g.beginPath();
      g.arc(P.head[0], P.head[1], HEAD, 0, TAU);
      g.fill();
      const gear = this.gear;
      if (gear === 'knight') {
        g.fillStyle = '#b8c2cc';
        g.fillRect(P.head[0] - 15, P.head[1] - 16, 30, 13);
        g.fillStyle = c;
        g.save();
        g.translate(P.RA[2], P.RA[3]);
        g.fillStyle = '#8a96a3';
        g.beginPath();
        g.moveTo(-4, -22); g.lineTo(16, -22); g.lineTo(16, 6); g.quadraticCurveTo(6, 24, -4, 6); g.closePath();
        g.fill();
        g.restore();
        g.strokeStyle = '#d6dde4';
        g.lineWidth = 4;
        g.beginPath();
        g.moveTo(P.LA[2], P.LA[3]);
        g.lineTo(P.LA[2] + Math.sin(this.atk * 2 + 0.6) * 46, P.LA[3] - Math.cos(this.atk * 2 + 0.6) * 46);
        g.stroke();
      } else if (gear === 'ninja') {
        g.strokeStyle = '#e63946';
        g.lineWidth = 4;
        g.beginPath();
        g.moveTo(P.head[0] - 14, P.head[1] - 3); g.lineTo(P.head[0] + 14, P.head[1] - 3);
        g.moveTo(P.head[0] - 13, P.head[1] - 3);
        g.quadraticCurveTo(P.head[0] - 26, P.head[1] - 6 + Math.sin(t * 14) * 4, P.head[0] - 34, P.head[1] + 2 + Math.sin(t * 14 + 1) * 6);
        g.stroke();
      } else if (gear === 'archer') {
        g.strokeStyle = '#8b5a2b';
        g.lineWidth = 4;
        g.beginPath();
        g.arc(P.RA[2] + 4, P.RA[3], 26, -1.2, 1.2);
        g.stroke();
      } else if (gear === 'wizard') {
        g.fillStyle = '#6c4ab6';
        g.beginPath();
        g.moveTo(P.head[0] - 20, P.head[1] - 8); g.lineTo(P.head[0] + 20, P.head[1] - 8); g.lineTo(P.head[0] + 4, P.head[1] - 48); g.closePath();
        g.fill();
      }
      // Faces only where they are big enough on screen to read.
      if (lod > 4.5) this.drawFace(g, P, c, t);
      g.restore();
    }
    bodyAngle() {
      return this.angle + this.lie * this.lieDir * (Math.PI / 2);
    }
    emotion() {
      if (this.emo) return this.emo;
      if (!this.alive || this.state === 'dead') return 'dead';
      if (this.zombie || this.state === 'zombie') return 'zombie';
      switch (this.state) {
        case 'panic': case 'air': case 'climb': case 'float': return 'scared';
        case 'cheer': return 'happy';
        case 'attack': return 'angry';
        case 'lookup': return 'shock';
      }
      return 'neutral';
    }
    // Eyes, brows and mouth in head-local space; +x is the way the figure faces.
    drawFace(g, P, c, t) {
      const [hx, hy] = P.head, e = this.emotion();
      const L = WI.lum(c);
      const ink = '#121418', line = L < 0.22 ? '#f4f6f8' : ink;
      const e1 = hx + 2, e2 = hx + 9.5, ey = hy - 3;
      g.lineCap = 'round';
      g.lineWidth = 1.9;
      g.strokeStyle = line;
      g.fillStyle = line;
      if (e === 'dead') {
        g.beginPath();
        for (const x of [e1, e2]) {
          g.moveTo(x - 2.6, ey - 2.6); g.lineTo(x + 2.6, ey + 2.6);
          g.moveTo(x + 2.6, ey - 2.6); g.lineTo(x - 2.6, ey + 2.6);
        }
        g.moveTo(hx + 3, hy + 7); g.lineTo(hx + 9, hy + 6);
        g.stroke();
        return;
      }
      if (e === 'happy') {
        g.beginPath();
        g.arc(e1, ey + 1.5, 2.8, Math.PI * 1.1, Math.PI * 1.9);
        g.moveTo(e2 + 2.8 * Math.cos(Math.PI * 1.1), ey + 1.5 + 2.8 * Math.sin(Math.PI * 1.1));
        g.arc(e2, ey + 1.5, 2.8, Math.PI * 1.1, Math.PI * 1.9);
        g.stroke();
        g.beginPath();
        g.arc(hx + 6, hy + 4, 5, 0.15 * Math.PI, 0.85 * Math.PI);
        g.closePath();
        g.fill();
        return;
      }
      const wide = e === 'scared' || e === 'shock';
      const blink = !wide && e !== 'zombie' && Math.sin(t * 0.83 + this.phase * 3.1) > 0.985;
      const er = wide ? 4.3 : 3.4;
      g.fillStyle = this.eyes || '#ffffff';
      g.beginPath();
      g.ellipse(e1, ey, er * 0.85, blink ? 0.6 : er, 0, 0, TAU);
      g.ellipse(e2, ey, er * 0.85, blink ? 0.6 : er, 0, 0, TAU);
      g.fill();
      if (!this.eyes && !blink) {
        let px = 0.9, py = 0;
        if (e === 'shock') py = -1.6;
        if (e === 'scared') px = Math.sin(t * 9 + this.phase) * 1.2;
        const pr = wide ? 1.4 : 1.8;
        g.fillStyle = ink;
        g.beginPath();
        g.arc(e1 + px, ey + py, pr, 0, TAU);
        g.arc(e2 + px, ey + py, pr, 0, TAU);
        g.fill();
      }
      g.beginPath();
      if (wide || e === 'sad') {
        // brows lifted at the inner corners
        g.moveTo(e1 - 3, ey - 6.5); g.lineTo(e1 + 2.5, ey - 8);
        g.moveTo(e2 - 2.5, ey - 8); g.lineTo(e2 + 3, ey - 6.5);
      } else if (e === 'angry' || e === 'zombie') {
        g.moveTo(e1 - 3, ey - 7.5); g.lineTo(e1 + 3, ey - 4.5);
        g.moveTo(e2 - 3, ey - 4.5); g.lineTo(e2 + 3, ey - 7.5);
      }
      g.stroke();
      g.fillStyle = line;
      g.beginPath();
      switch (e) {
        case 'scared':
          g.ellipse(hx + 6, hy + 7, 3, 4 + Math.sin(t * 20) * 0.6, 0, 0, TAU);
          g.fill();
          break;
        case 'shock':
          g.ellipse(hx + 6, hy + 7, 2, 2.6, 0, 0, TAU);
          g.fill();
          break;
        case 'sad':
          g.arc(hx + 6, hy + 10, 4, 1.15 * Math.PI, 1.85 * Math.PI);
          g.stroke();
          break;
        case 'angry':
          g.moveTo(hx + 2, hy + 7.5); g.lineTo(hx + 10, hy + 6);
          g.stroke();
          break;
        case 'zombie':
          g.moveTo(hx + 1.5, hy + 6);
          for (let i = 1; i <= 4; i++) g.lineTo(hx + 1.5 + i * 2.2, hy + 6 + (i % 2 ? 2.2 : 0));
          g.stroke();
          break;
        default:
          g.moveTo(hx + 3.5, hy + 6.5); g.lineTo(hx + 8.5, hy + 6.5);
          g.stroke();
      }
    }
    // Head centre in world space, following lean, tumble and lying down.
    headWorld(t) {
      const P = this.pose(t), a = this.bodyAngle();
      let hx = P.head[0], hy = P.head[1];
      if (a) {
        const dy = hy + 50;
        [hx, hy] = [hx * Math.cos(a) - dy * Math.sin(a), hx * Math.sin(a) + dy * Math.cos(a) - 50];
      }
      return [this.x + hx * this.face * this.scale, this.y + this.lie * 44 * this.scale + hy * this.scale * this.squash];
    }
  }
  WI.Fig = Fig;

  /* ------------------------------------------------------------- landmarks */
  // Each draws in local space: base centred on (0,0), growing up (negative y).
  const LANDMARKS = {
    empire: { h: 980, w: 150, draw(g) {
      g.fillRect(-75, -420, 150, 420); g.fillRect(-55, -640, 110, 230); g.fillRect(-38, -800, 76, 170);
      g.fillRect(-24, -880, 48, 90); g.fillRect(-10, -930, 20, 60); g.fillRect(-3, -980, 6, 60);
    } },
    eiffel: { h: 900, w: 380, draw(g) {
      g.beginPath();
      g.moveTo(-190, 0); g.quadraticCurveTo(-90, -280, -48, -560); g.lineTo(-14, -840); g.lineTo(-4, -900); g.lineTo(4, -900);
      g.lineTo(14, -840); g.lineTo(48, -560); g.quadraticCurveTo(90, -280, 190, 0); g.lineTo(120, 0);
      g.quadraticCurveTo(0, -200, -120, 0); g.closePath(); g.fill();
      g.fillRect(-130, -300, 260, 22); g.fillRect(-70, -570, 140, 16);
    } },
    bigben: { h: 880, w: 120, draw(g) {
      g.fillRect(-60, -640, 120, 640); g.fillRect(-70, -700, 140, 70);
      g.beginPath(); g.moveTo(-62, -700); g.lineTo(0, -880); g.lineTo(62, -700); g.closePath(); g.fill();
    }, extra(g, s) {
      g.fillStyle = mix(s.figColor, '#ffffff', 0.85);
      g.beginPath(); g.arc(0, -580, 38, 0, TAU); g.fill();
      g.strokeStyle = s.figColor; g.lineWidth = 5;
      g.beginPath(); g.moveTo(0, -580); g.lineTo(0, -605); g.moveTo(0, -580); g.lineTo(18, -575); g.stroke();
    } },
    burj: { h: 1300, w: 200, draw(g) {
      g.beginPath();
      g.moveTo(-100, 0); g.lineTo(-100, -220); g.lineTo(-70, -220); g.lineTo(-70, -520); g.lineTo(-45, -520);
      g.lineTo(-45, -820); g.lineTo(-25, -820); g.lineTo(-25, -1050); g.lineTo(-6, -1050); g.lineTo(0, -1300);
      g.lineTo(6, -1050); g.lineTo(25, -1050); g.lineTo(25, -900); g.lineTo(45, -900); g.lineTo(45, -620);
      g.lineTo(70, -620); g.lineTo(70, -320); g.lineTo(100, -320); g.lineTo(100, 0); g.closePath(); g.fill();
    } },
    tokyo: { h: 860, w: 300, color: '#e8452c', draw(g) {
      g.beginPath();
      g.moveTo(-150, 0); g.lineTo(-30, -560); g.lineTo(-8, -860); g.lineTo(8, -860); g.lineTo(30, -560); g.lineTo(150, 0);
      g.lineTo(90, 0); g.lineTo(0, -380); g.lineTo(-90, 0); g.closePath(); g.fill();
      g.fillRect(-75, -380, 150, 40); g.fillRect(-40, -620, 80, 30);
    } },
    cn: { h: 1150, w: 110, draw(g) {
      g.beginPath(); g.moveTo(-55, 0); g.lineTo(-14, -700); g.lineTo(14, -700); g.lineTo(55, 0); g.closePath(); g.fill();
      g.beginPath(); g.ellipse(0, -720, 62, 34, 0, 0, TAU); g.fill();
      g.fillRect(-8, -1150, 16, 440); g.fillRect(-20, -900, 40, 26);
    } },
    pyramids: { h: 460, w: 900, draw(g) {
      g.beginPath(); g.moveTo(-450, 0); g.lineTo(-120, -460); g.lineTo(210, 0); g.closePath(); g.fill();
      g.globalAlpha *= 0.85;
      g.beginPath(); g.moveTo(100, 0); g.lineTo(330, -320); g.lineTo(560, 0); g.closePath(); g.fill();
    } },
    liberty: { h: 620, w: 160, draw(g) {
      g.fillRect(-80, -200, 160, 200); g.fillRect(-50, -260, 100, 70);
      g.beginPath(); g.moveTo(-30, -260); g.lineTo(-22, -520); g.lineTo(22, -520); g.lineTo(30, -260); g.closePath(); g.fill();
      g.beginPath(); g.arc(0, -545, 26, 0, TAU); g.fill();
      g.fillRect(14, -640, 12, 120); g.beginPath(); g.moveTo(8, -640); g.lineTo(32, -640); g.lineTo(20, -680); g.closePath(); g.fill();
    } },
  };

  /* ------------------------------------------------------------ environments */
  const ENVS = {
    city:   { sky: ['#3f7fcb', '#bfdcf2'], ground: '#2c3139', bmin: 260, bmax: 760, gap: [8, 26], kind: 'tower', far: 'city' },
    town:   { sky: ['#4a8fd6', '#cfe7f5'], ground: '#3d5e35', bmin: 110, bmax: 230, gap: [30, 90], kind: 'house', far: 'hills', trees: true },
    desert: { sky: ['#4f8fd0', '#f3dcae'], ground: '#b98a4e', bmin: 140, bmax: 520, gap: [30, 110], kind: 'tower', far: 'dunes' },
    arctic: { sky: ['#6aa2d8', '#e6f1fa'], ground: '#dfe8f1', bmin: 70, bmax: 140, gap: [160, 320], kind: 'hut', far: 'peaks' },
  };
  WI.ENVS = ENVS;

  /* ------------------------------------------------------------------ Scene */
  class Scene {
    constructor(canvas) {
      this.canvas = canvas;
      canvas.width = W;
      canvas.height = H;
      this.g = canvas.getContext('2d');
      this.grain = makeGrain();
      this.vig = makeVignette();
      this.opts = { handle: '', cta: 'FOLLOW FOR PART 2', grain: true, bloom: true };
      // A copy of the frame for motion/zoom blur, and an 1/8-size light
      // buffer: only emissive things (fire, sparks, sun) are drawn into it,
      // so the bloom never washes out a bright daytime sky.
      this.tmp = document.createElement('canvas');
      this.tmp.width = W;
      this.tmp.height = H;
      this.tmpG = this.tmp.getContext('2d');
      this.lightC = document.createElement('canvas');
      this.lightC.width = W / 8;
      this.lightC.height = H / 8;
      this.lightG = this.lightC.getContext('2d');
      this.lightB = document.createElement('canvas');
      this.lightB.width = W / 8;
      this.lightB.height = H / 8;
      this.lightBG = this.lightB.getContext('2d');
      this.lightBG.filter = 'blur(3px)';
      this.canBlur = this.lightBG.filter === 'blur(3px)';
      this.baseKeys = new Set(Object.keys(this).concat(['baseKeys']));
    }

    load(idea, audio) {
      const sc = WI.SCENARIOS[idea.arche];
      // Scenarios hang their own flags on the scene; none may leak into the next video.
      for (const k of Object.keys(this)) if (!this.baseKeys.has(k)) delete this[k];
      this.idea = idea;
      this.audio = audio && audio.ctx ? audio : null;
      this.rng = WI.RNG(WI.hash(idea.id));
      WI.figRng = WI.RNG(WI.hash(idea.id) ^ 0x5bd1e995);
      this.t = 0;
      this.wt = 0;
      this.timeScale = 1;
      this.duration = sc.duration || 32;
      this.figs = [];
      this.buildings = [];
      this.props = [];
      this.parts = [];
      this.waves = [];
      this.ents = [];
      this.beats = [];
      this.anims = [];
      this.grav = 2400;
      this.cam = { x: W / 2, y: H / 2, zoom: 1, rot: 0 };
      this.follow = null;
      this.trauma = 0;
      this.flashA = 0;
      this.flashC = '#ffffff';
      this.tint = { c: '#000000', a: 0 };
      this.fadeA = 0;
      this.stars = 0;
      this.lights = 0;
      this.danger = null;
      this.bx0 = -120;
      this.bx1 = W + 120;
      this.caption = null;
      this.stampTx = null;
      this.counters = [];
      this.endCard = null;
      this.onUpdate = null;
      this.onDraw = null;
      this.place = idea.place || WI.PLACES[0];
      const env = (this.envDef = ENVS[this.place.env] || ENVS.city);
      this.sky = { top: env.sky[0], bot: env.sky[1] };
      this.groundBase = env.ground;
      this.sun = { x: 800, y: 470, r: 62, c: '#fff4c8', a: 1 };
      this.chunks = [];
      this.shot = null;
      this.view = this.cam;
      this.zblur = 0;
      this.zfocus = [W / 2, H / 2];
      this.hblur = 0;
      this.impactT = -1;
      this.punchZ = 0;
      this.buildWorld();
      this.birds();
      this.title = { pre: idea.pre || 'WHAT IF', text: idea.title.toUpperCase() };
      sc.build(this, idea.params, this.rng);
      this.beats.sort((a, b) => a.t - b.t);
      if (this.audio) this.audio.startMusic(WI.RNG(WI.hash(idea.id) ^ 0x27d4eb2f));
      this.render();
    }

    /* ---------------------------------------------------------------- world */
    buildWorld() {
      const r = this.rng, env = this.envDef;
      const lm = this.place.lm && LANDMARKS[this.place.lm];
      let x = -700;
      const lmX = lm ? r.pick([300, 780]) : null;
      while (x < W + 700) {
        if (lm && Math.abs(x - lmX) < lm.w / 2 + 40) {
          x = lmX + lm.w / 2 + 40;
          continue;
        }
        const w = env.kind === 'house' ? r.range(110, 170) : env.kind === 'hut' ? r.range(90, 130) : r.range(90, 190);
        const h = r.range(env.bmin, env.bmax) * (Math.abs(x - W / 2) < 260 ? 0.8 : 1);
        this.buildings.push({ x: x + w / 2, w, h, kind: env.kind, k: r(), seed: r.int(1, 1e6), roof: r.int(0, 2), state: 'ok', ft: 0, tilt: 0, tdir: r.sign(), sink: 0 });
        x += w + r.range(env.gap[0], env.gap[1]);
      }
      if (lm) this.buildings.push({ x: lmX, w: lm.w, h: lm.h, kind: 'landmark', lm, k: 0.4, state: 'ok', ft: 0, tilt: 0, tdir: r.sign(), sink: 0, seed: 1 });
      if (env.trees) for (let i = 0; i < 9; i++) this.props.push({ x: r.range(-500, W + 500), s: r.range(0.8, 1.3), y: GY });
      this.clouds = [];
      for (let i = 0; i < 6; i++) this.clouds.push({ x: r.range(-300, W + 300), y: r.range(280, 900), s: r.range(0.6, 1.4), v: r.range(5, 16), seed: r.int(1, 1e6) });
      this.far = [];
      x = -900;
      while (x < W + 900) {
        const w = r.range(70, 160);
        this.far.push({ x, w, h: r.range(env.bmin * 0.7, env.bmax * 1.05), seed: r.int(1, 1e6) });
        x += w + r.range(-10, 30);
      }
    }

    crowd(n, o = {}) {
      const out = [];
      const x0 = o.x0 ?? this.bx0 + 40, x1 = o.x1 ?? this.bx1 - 40;
      for (let i = 0; i < n; i++) {
        const f = new Fig(this.rng.range(x0, x1), {
          face: this.rng.sign(), speed: this.rng.range(0.85, 1.2), phase: this.rng() * TAU, wait: this.rng.range(0, 2.5),
          scale: WI.FS * this.rng.range(0.93, 1.07), ...o.fig,
        });
        f.tx = f.x;
        this.figs.push(f);
        out.push(f);
      }
      return out;
    }
    add(ent) {
      ent.layer = ent.layer || 'mid';
      this.ents.push(ent);
      return ent;
    }

    /* ---------------------------------------------------------------- timing */
    at(t, fn) {
      // Beats can be added while playing; keep the queue ordered.
      let i = this.beats.length;
      while (i > 0 && this.beats[i - 1].t > t) i--;
      this.beats.splice(i, 0, { t, fn });
    }
    every(dt, from, to, fn) {
      for (let t = from; t < to; t += dt) this.at(t, fn);
    }
    anim(dur, step, e = 'inOut', delay = 0, start) {
      this.anims.push({ t0: this.t + delay, dur, step, e: ease[e] || ease.inOut, start, started: false });
    }
    camTo(o, dur = 1.5, e = 'inOut', delay = 0) {
      let from;
      this.anim(dur, (k) => {
        for (const key in o) this.cam[key] = lerp(from[key], o[key], k);
      }, e, delay, () => (from = { ...this.cam }));
    }
    skyTo(top, bot, dur = 2, delay = 0) {
      let a, b;
      this.anim(dur, (k) => {
        this.sky.top = mix(a, top, k);
        this.sky.bot = mix(b, bot, k);
      }, 'inOut', delay, () => ((a = this.sky.top), (b = this.sky.bot)));
    }
    groundTo(c, dur = 2, delay = 0) {
      let a;
      this.anim(dur, (k) => (this.groundBase = mix(a, c, k)), 'inOut', delay, () => (a = this.groundBase));
    }
    tintTo(c, a, dur = 1.5, delay = 0) {
      let fc, fa;
      this.anim(dur, (k) => {
        this.tint.c = mix(fc, c, k);
        this.tint.a = lerp(fa, a, k);
      }, 'inOut', delay, () => ((fc = this.tint.c), (fa = this.tint.a)));
    }
    to(obj, key, val, dur = 1, e = 'inOut', delay = 0) {
      let a;
      this.anim(dur, (k) => (obj[key] = lerp(a, val, k)), e, delay, () => (a = obj[key]));
    }
    slowmo(scale, hold, inT = 0.15, outT = 0.5) {
      this.to(this, 'timeScale', scale, inT, 'out');
      this.to(this, 'timeScale', 1, outT, 'inOut', inT + hold);
    }
    sfx(name, ...a) {
      if (this.audio && this.audio[name]) this.audio[name](...a);
    }
    music(x) {
      if (this.audio) this.audio.setIntensity(x);
    }

    /* --------------------------------------------------------------- effects */
    shake(a) {
      this.trauma = Math.min(1.2, this.trauma + a);
    }
    flash(a = 1, c = '#ffffff') {
      this.flashA = a;
      this.flashC = c;
    }
    part(type, x, y, o = {}) {
      if (this.parts.length > 2600) return;
      const r = this.rng;
      const p = { type, x, y, vx: 0, vy: 0, age: 0, life: 1, size: 10, c: '#ffffff', rot: 0, vr: 0, g: 0, drag: 0, a: 1, add: false, ground: false };
      switch (type) {
        case 'spark': Object.assign(p, { life: r.range(0.35, 0.9), size: r.range(2.5, 5), c: r.pick(['#ffe08a', '#ffb347', '#fff3c4']), add: true, g: 900, drag: 1.2 }); break;
        case 'fire': Object.assign(p, { life: r.range(0.5, 1.3), size: r.range(30, 70), add: true, g: -160, drag: 1.5 }); break;
        case 'smoke': Object.assign(p, { life: r.range(1.5, 3.5), size: r.range(40, 90), c: '#3b3b3f', a: 0.55, g: -40, drag: 0.9 }); break;
        case 'dust': Object.assign(p, { life: r.range(1.2, 2.6), size: r.range(30, 70), c: '#8f8270', a: 0.5, drag: 1.8 }); break;
        case 'debris': Object.assign(p, { life: r.range(1.5, 3), size: r.range(5, 16), c: '#2a2a2e', g: 2200, vr: r.range(-12, 12), ground: true }); break;
        case 'ember': Object.assign(p, { life: r.range(2, 4), size: r.range(2, 4.5), c: r.pick(['#ffb347', '#ff7b39', '#ffd27a']), add: true, drag: 0.4 }); break;
        case 'snow': Object.assign(p, { life: r.range(4, 7), size: r.range(3, 7), c: '#ffffff', a: 0.9, g: 0, drag: 0 }); break;
        case 'ash': Object.assign(p, { life: r.range(4, 7), size: r.range(2.5, 5), c: '#9a948c', a: 0.8, g: 0, drag: 0 }); break;
        case 'drop': Object.assign(p, { life: r.range(0.5, 1.1), size: r.range(3, 6), c: '#bfe6ff', g: 2000, drag: 0.3 }); break;
        case 'puff': Object.assign(p, { life: r.range(0.35, 0.7), size: r.range(30, 55), c: '#ffffff', a: 0.9, drag: 4 }); break;
        case 'streak': Object.assign(p, { life: r.range(0.3, 0.7), size: r.range(80, 260), c: '#ffffff', a: 0.5, drag: 0 }); break;
        case 'glow': Object.assign(p, { life: r.range(0.4, 0.9), size: r.range(120, 260), c: '#ffd27a', add: true, a: 0.8 }); break;
        case 'leaf': Object.assign(p, { life: r.range(2, 4), size: r.range(5, 9), c: '#5fae4f', g: 120, vr: r.range(-4, 4), drag: 1 }); break;
      }
      Object.assign(p, o);
      if (o.life) p.life = o.life;
      this.parts.push(p);
      return p;
    }
    burst(type, x, y, n, speed, o = {}) {
      const r = this.rng;
      for (let i = 0; i < n; i++) {
        const a = o.angle !== undefined ? o.angle + r.range(-o.spread, o.spread) : r() * TAU;
        const v = r.range(speed * 0.3, speed);
        this.part(type, x + r.range(-(o.jx || 0), o.jx || 0), y + r.range(-(o.jy || 0), o.jy || 0), { vx: Math.cos(a) * v, vy: Math.sin(a) * v, ...o.p });
      }
    }
    wave(x, y, o = {}) {
      this.waves.push({ x, y, r: o.r0 || 10, v: o.v || 2600, life: o.life || 1.2, age: 0, c: o.c || '#ffffff', w: o.w || 40 });
    }
    launch(f, vx, vy, o = {}) {
      f.air = true;
      f.state = 'air';
      f.vx = vx;
      f.vy = vy;
      f.av = o.av ?? this.rng.range(-9, 9);
      if (o.kill) f.dieOnLand = true;
      if (o.kill === 'now') f.alive = false;
    }
    // Radial blast: knocks figures, topples nearby buildings, all the effects.
    explode(x, y, power = 1, o = {}) {
      const R = 260 * power;
      this.flash(Math.min(1, 0.45 + power * 0.25), o.flash || '#fff4dc');
      this.shake(0.5 + power * 0.35);
      this.wave(x, y, { v: 1800 + 900 * power, life: 0.9 + power * 0.3, w: 30 + 20 * power });
      this.part('glow', x, y, { size: 300 * power, life: 0.6 });
      this.burst('fire', x, y, 26 + 30 * power, 700 * Math.sqrt(power), { jx: 20 * power });
      this.burst('spark', x, y, 40 + 30 * power, 1600 * Math.sqrt(power));
      this.burst('debris', x, y, 20 + 20 * power, 1300 * Math.sqrt(power), { angle: -Math.PI / 2, spread: 1.3 });
      this.burst('smoke', x, y - 30, 18 + 18 * power, 380 * Math.sqrt(power), { p: { size: 70 * Math.sqrt(power) } });
      if (o.sound !== false) this.sfx('boom', Math.min(1.4, power * 0.7));
      this.zfocus = this.toScreen(x, y);
      this.zblur = Math.max(this.zblur, Math.min(1.2, 0.35 + power * 0.3));
      this.punch(0.03 + 0.03 * power);
      if (power >= 1.5) this.impactT = 0;
      for (const f of this.figs) {
        if (!f.visible || f.air || f.immune) continue;
        const dx = f.x - x, dy = f.y - 50 - y, d = Math.hypot(dx, dy);
        if (d < R) {
          const k = 1 - d / R;
          this.launch(f, Math.sign(dx || 1) * (500 + 1500 * k) * Math.sqrt(power), -(500 + 1300 * k) * Math.sqrt(power), { kill: o.kill !== false });
        }
      }
      if (o.buildings !== false)
        for (const b of this.buildings) {
          const d = Math.abs(b.x - x);
          if (b.state === 'ok' && d < R * 0.9) this.collapse(b, 0, Math.sign(b.x - x) || 1, 600 + 700 * Math.sqrt(power) * (1 - d / R));
        }
    }
    // force > 0 blows the building apart into tumbling chunks; without it
    // the building sags and sinks, like a demolition.
    collapse(b, delay = 0, dir, force = 0) {
      if (!b || b.state !== 'ok') return;
      b.state = 'fall';
      b.ft = -delay;
      b.tdir = dir || b.tdir;
      b.rate = this.rng.range(0.6, 1);
      b.force = force;
    }
    shatter(b) {
      b.state = 'gone';
      const r = this.rng, base = b.lm && b.lm.color ? mix(b.lm.color, this.bldColor, 0.35) : mix(this.bldColor, '#000000', b.k * 0.12);
      const cols = b.w > 150 ? 3 : 2, rows = clamp(Math.round(b.h / 80), 2, 12);
      const cw = b.w / cols, rh = b.h / rows, F = b.force, dir = b.tdir;
      for (let i = 0; i < rows; i++)
        for (let j = 0; j < cols; j++) {
          if (this.chunks.length > 700) break;
          const up = (i + 0.5) / rows;
          this.chunks.push({
            x: b.x - b.w / 2 + (j + 0.5) * cw, y: GY - (i + 0.5) * rh, w: cw * r.range(0.8, 1), h: rh * r.range(0.8, 1),
            vx: dir * F * r.range(0.25, 1) * (0.3 + up * 0.9) + r.range(-90, 90), vy: -F * r.range(0.05, 0.5) * up - r.range(0, 160),
            a: 0, va: r.range(-2.6, 2.6) * Math.min(2, F / 800), c: mix(base, '#000000', r.range(0, 0.18)), win: b.kind === 'tower', rest: false,
          });
        }
      this.burst('dust', b.x, GY - b.h * 0.3, 18, 600, { jy: b.h * 0.3, p: { size: 110, c: '#7d756a' } });
      this.burst('debris', b.x, GY - b.h * 0.5, 30, 900, { jy: b.h * 0.4 });
      this.sfx('boom', 0.45);
      this.shake(0.25);
    }
    updateChunks(dt) {
      const g = this.grav > 0 ? this.grav : 2400;
      for (const c of this.chunks) {
        if (c.rest) continue;
        c.vy += g * dt;
        c.x += c.vx * dt;
        c.y += c.vy * dt;
        c.a += c.va * dt;
        const rr = Math.min(c.w, c.h) * 0.45;
        if (c.y + rr > GY && c.vy > 0) {
          c.y = GY - rr;
          if (c.vy > 500) {
            this.part('dust', c.x, GY - 10, { size: 50, vx: c.vx * 0.2, c: '#7d756a' });
            this.sfx('thud', 0.35);
          }
          c.vy *= -0.22;
          c.vx *= 0.5;
          c.va *= 0.45;
          if (Math.abs(c.vy) < 70 && Math.abs(c.vx) < 50) c.rest = true;
        }
      }
      this.chunks = this.chunks.filter((c) => !c.gone && Math.abs(c.x - this.cam.x) < 5000);
    }
    drawChunks(g) {
      const win = mix(this.bldColor, this.sky.top, 0.35);
      for (const c of this.chunks) {
        g.save();
        g.translate(c.x, c.y);
        g.rotate(c.a);
        g.fillStyle = c.c;
        g.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
        if (c.win && c.w > 34 && c.h > 40) {
          g.fillStyle = win;
          g.fillRect(-c.w / 2 + 8, -c.h / 2 + 10, c.w * 0.3, 20);
          g.fillRect(c.w * 0.05, -c.h / 2 + 10, c.w * 0.3, 20);
        }
        g.restore();
      }
    }

    /* -------------------------------------------------------------- camera */
    toScreen(x, y) {
      const v = this.view || this.cam;
      return [(x - v.x) * v.zoom + W / 2, (y - v.y) * v.zoom + H / 2];
    }
    punch(a) {
      this.punchZ = Math.min(0.18, this.punchZ + a);
    }
    // Cut in to a face for a beat, then cut back to wherever the main camera
    // has got to. r is the head's radius on screen in pixels.
    closeup(f, dur = 1.6, o = {}) {
      if (!f) return;
      const t0 = this.t;
      this.shot = { f, t0, dur, r: o.r || 115, push: o.push ?? 0.14, rot: o.rot ?? 0.035, v: null };
      this.zblur = Math.max(this.zblur, 0.55);
      this.zfocus = [W / 2, 1000];
      this.sfx('whoosh', 0.3, true, 0.16);
      if (o.slow) this.slowmo(o.slow, dur - 0.35, 0.1, 0.3);
      this.at(t0 + dur, () => {
        if (this.shot && this.shot.t0 === t0) {
          this.shot = null;
          this.zblur = Math.max(this.zblur, 0.45);
          this.zfocus = [W / 2, H / 2];
        }
      });
    }
    updateShot(dt) {
      const sh = this.shot;
      if (!sh) return (this.view = this.cam);
      const f = sh.f, [hx, hy] = f.headWorld(this.t);
      const k = clamp((this.t - sh.t0) / sh.dur, 0, 1);
      const zoom = (sh.r / (HEAD * f.scale)) * (1 + sh.push * WI.ease.inOut(k));
      const tx = hx + (f.face * 120) / zoom, ty = hy - 80 / zoom;
      if (!sh.v) sh.v = { x: tx, y: ty, zoom, rot: sh.rot * f.face };
      const q = 1 - Math.exp(-dt * 10);
      sh.v.x += (tx - sh.v.x) * q;
      sh.v.y += (ty - sh.v.y) * q;
      sh.v.zoom = zoom;
      this.view = sh.v;
    }
    birds() {
      const r = this.rng, flock = [];
      const y0 = GY - r.range(950, 1150);
      for (let i = 0; i < 6; i++) flock.push({ x: -300 - i * 50 - r.range(0, 40), y: y0 + r.range(-50, 50) + Math.abs(i - 2.5) * 18, ph: r() * TAU });
      this.add({
        layer: 'back',
        update(dt, s) {
          const fast = s.danger ? 3.2 : 1;
          for (const b of flock) {
            b.x += 120 * fast * dt;
            if (s.danger) b.y -= 120 * dt;
            b.ph += dt * (9 + fast * 3);
          }
          if (flock.every((b) => b.x > s.cam.x + 2000)) this.dead = true;
        },
        draw(g, s) {
          g.strokeStyle = s.figColor;
          g.lineWidth = 4;
          g.lineCap = 'round';
          g.beginPath();
          for (const b of flock) {
            const w = Math.sin(b.ph) * 10;
            g.moveTo(b.x - 16, b.y - w); g.lineTo(b.x, b.y); g.lineTo(b.x + 16, b.y - w);
          }
          g.stroke();
        },
      });
    }

    /* ---------------------------------------------------------------- update */
    step(dt) {
      this.t += dt;
      if (this.audio && this.audio.offline) this.audio.tickOffline(this.t);
      // The end is read from duration every frame: a battle can finish early.
      if (!this.endCard && this.t >= this.duration - 3.3) this.end();
      this.fadeA = clamp((this.t - (this.duration - 0.35)) / 0.35, 0, 1);
      while (this.beats.length && this.beats[0].t <= this.t) this.beats.shift().fn();
      for (let i = this.anims.length - 1; i >= 0; i--) {
        const a = this.anims[i];
        if (this.t < a.t0) continue;
        if (!a.started) {
          a.started = true;
          if (a.start) a.start();
        }
        const k = clamp((this.t - a.t0) / a.dur, 0, 1);
        a.step(a.e(k));
        if (k >= 1) this.anims.splice(i, 1);
      }
      const wdt = dt * this.timeScale;
      this.wt += wdt;
      if (this.onUpdate) this.onUpdate(wdt, this.t);
      for (const f of this.figs) this.updateFig(f, wdt);
      for (const b of this.buildings) this.updateBuilding(b, wdt);
      this.updateChunks(wdt);
      for (const e of this.ents) if (e.update) e.update(wdt, this);
      this.ents = this.ents.filter((e) => !e.dead);
      this.updateParts(wdt);
      for (const w of this.waves) {
        w.age += wdt;
        w.r += w.v * wdt;
      }
      this.waves = this.waves.filter((w) => w.age < w.life);
      if (this.follow) {
        const p = this.follow();
        const k = 1 - Math.exp(-dt * 3);
        this.cam.x += (p.x - this.cam.x) * k;
        this.cam.y += (p.y - this.cam.y) * k;
        if (p.zoom) this.cam.zoom += (p.zoom - this.cam.zoom) * k;
      }
      this.updateShot(dt);
      this.zblur = Math.max(0, this.zblur - dt * 2.6);
      this.hblur = Math.max(0, this.hblur - dt * 4.5);
      this.punchZ = Math.max(0, this.punchZ - dt * 0.35);
      if (this.impactT >= 0) this.impactT += dt;
      this.trauma = Math.max(0, this.trauma - dt * 1.4);
      this.flashA = Math.max(0, this.flashA - dt * 2.2);
      if (this.caption) this.caption.age += dt;
      if (this.stampTx) this.stampTx.age += dt;
      for (const c of this.counters) {
        c.age += dt;
        if (c.anim) {
          const k = clamp((this.t - c.anim.t0) / c.anim.dur, 0, 1);
          c.value = lerp(c.anim.from, c.anim.to, c.anim.e(k));
        }
        c.bump = Math.max(0, c.bump - dt * 3);
      }
    }

    updateFig(f, dt) {
      if (!f.visible) return;
      if (f.lie < 1 && f.state === 'dead' && !f.air && !f.manualLie) f.lie = Math.min(1, f.lie + dt * 4);
      if (f.air) {
        f.vy += this.grav * f.gmul * dt;
        const d = Math.exp(-f.drag * dt);
        f.vx *= d;
        f.x += f.vx * dt;
        f.y += f.vy * dt;
        f.angle += f.av * dt;
        f.phase += dt * 10;
        // remember a few past poses: fast bodies get a motion trail
        if (Math.abs(f.vx) + Math.abs(f.vy) > 1100) {
          (f.trail = f.trail || []).unshift([f.x, f.y, f.angle]);
          if (f.trail.length > 4) f.trail.pop();
        } else f.trail = null;
        const floor = f.floor ?? GY;
        if (f.y >= floor && f.vy >= 0) {
          f.y = floor;
          const sp = f.vy;
          if (sp > 650) {
            if (sp > 1100) {
              this.sfx('thud', Math.min(1, sp / 2500));
              this.burst('dust', f.x, floor - 10, 3, 200, { p: { size: 30 * f.scale } });
            }
            f.vy = -sp * 0.28;
            f.vx *= 0.55;
            f.av *= 0.5;
            if (sp > 2600 && f.fragile !== false) f.dieOnLand = true;
          } else {
            f.air = false;
            f.vy = 0;
            f.vx = 0;
            f.angle = 0;
            f.av = 0;
            if (f.dieOnLand || !f.alive) {
              f.alive = false;
              f.state = 'dead';
              f.lieDir = this.rng.sign();
            } else {
              f.state = f.afterLand || 'panic';
              if (f.mode === 'wander') f.mode = this.danger ? 'flee' : 'wander';
            }
          }
        }
        return;
      }
      if (!f.alive) return;
      if (f.ai) return f.ai(f, dt, this);
      const move = (dir, sp) => {
        f.face = dir;
        f.x += dir * sp * dt;
        f.phase += sp * dt * 0.055;
      };
      switch (f.mode) {
        case 'wander': {
          if (f.wait > 0) {
            f.wait -= dt;
            if (f.state !== 'lookup') f.state = 'idle';
            break;
          }
          const d = f.tx - f.x;
          if (Math.abs(d) < 6) {
            f.wait = this.rng.range(0.4, 3);
            f.tx = clamp(f.x + this.rng.range(-380, 380), this.bx0, this.bx1);
          } else {
            f.state = 'walk';
            move(Math.sign(d), 92 * f.speed);
          }
          break;
        }
        case 'flee': {
          const dx = this.danger ? f.x - this.danger.x : 1;
          let dir = Math.sign(dx) || 1;
          if ((dir < 0 && f.x < this.bx0) || (dir > 0 && f.x > this.bx1)) {
            f.state = 'panic';
            f.phase += dt * 6;
            break;
          }
          f.state = f.fleeState || 'panic';
          move(dir, 255 * f.speed);
          break;
        }
        case 'goto': {
          const d = f.tx - f.x;
          if (Math.abs(d) < 8) {
            f.state = f.arrive || 'idle';
            f.mode = 'still';
          } else {
            f.state = f.gotoState || 'run';
            move(Math.sign(d), (f.gotoSpeed || 240) * f.speed);
          }
          break;
        }
        default:
          if (f.state === 'walk' || f.state === 'run' || f.state === 'panic' || f.state === 'cheer' || f.state === 'climb') f.phase += dt * 6;
      }
    }

    updateBuilding(b, dt) {
      if (b.state !== 'fall') return;
      b.ft += dt;
      if (b.ft < 0) return;
      if (b.force) return this.shatter(b);
      if (!b.rumbled) {
        b.rumbled = true;
        this.sfx('rumble', 2.2, 0.45);
      }
      const k = b.ft * b.rate;
      b.tilt = b.tdir * Math.min(0.5, k * k * 0.18);
      b.sink = Math.min(b.h, b.h * 0.42 * k * k);
      if (this.rng() < dt * 40) this.part('dust', b.x + this.rng.range(-b.w * 0.6, b.w * 0.6), GY - this.rng.range(0, 60), { vx: this.rng.range(-220, 220), vy: this.rng.range(-80, 0), size: this.rng.range(50, 110), c: '#7d756a' });
      if (this.rng() < dt * 18) this.part('debris', b.x + this.rng.range(-b.w / 2, b.w / 2), GY - (b.h - b.sink), { vx: this.rng.range(-300, 300), vy: this.rng.range(-500, -100) });
      if (b.sink >= b.h) {
        b.state = 'gone';
        this.burst('dust', b.x, GY - 30, 14, 500, { angle: -Math.PI / 2, spread: 1.4, p: { size: 120, c: '#7d756a' } });
        this.shake(0.12);
      }
    }

    updateParts(dt) {
      const P = this.parts;
      for (let i = P.length - 1; i >= 0; i--) {
        const p = P[i];
        p.age += dt;
        if (p.age >= p.life) {
          P[i] = P[P.length - 1];
          P.pop();
          continue;
        }
        p.vy += p.g * dt;
        const d = Math.exp(-p.drag * dt);
        p.vx *= d;
        p.vy *= p.g ? 1 : d;
        if (p.type === 'snow' || p.type === 'ash' || p.type === 'leaf') p.vx += Math.sin(p.age * 2 + p.size) * 30 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;
        if (p.ground && p.y > GY) {
          p.y = GY;
          p.vy *= -0.3;
          p.vx *= 0.6;
          p.vr *= 0.5;
        }
      }
    }

    /* ---------------------------------------------------------------- text */
    say(text, dur) {
      this.caption = { words: parseMarked(text), age: 0, dur: dur || 99, layout: null };
      this.sfx('pop', 1.3, 0.12);
    }
    stamp(text) {
      this.stampTx = { text: text.toUpperCase(), age: 0 };
      if (this.t > 3) {
        this.hblur = 1;
        this.flash(Math.max(this.flashA, 0.18));
      }
      this.sfx('whoosh', 0.4, true, 0.25);
      this.sfx('tick', 0.15);
    }
    counter(id, label, value, o = {}) {
      let c = this.counters.find((c) => c.id === id);
      if (!c) {
        c = { id, label, value, age: 0, bump: 0, color: o.color || '#ffd60a', fmt: o.fmt || WI.fmt };
        this.counters.push(c);
      }
      Object.assign(c, { label, value }, o);
      c.anim = null;
      return c;
    }
    countTo(id, to, dur = 2, e = 'out') {
      const c = this.counters.find((c) => c.id === id);
      if (!c) return;
      c.anim = { from: c.value, to, t0: this.t, dur, e: ease[e] };
      c.bump = 1;
    }
    setCount(id, v) {
      const c = this.counters.find((c) => c.id === id);
      if (c && Math.round(c.value) !== Math.round(v)) {
        c.value = v;
        c.anim = null;
        c.bump = Math.min(1, c.bump + 0.35);
      }
    }
    clearCounters() {
      this.counters = [];
    }
    end(text) {
      this.endCard = { text: text || this.endText || 'WHAT WOULD *YOU* DO?', t0: this.t };
      this.caption = null;
      this.sfx('pop', 0.8, 0.2);
    }

    /* ---------------------------------------------------------------- render */
    get figColor() {
      const l = WI.lum(this.sky.bot) * 0.6 + WI.lum(this.sky.top) * 0.4;
      return mix('#121418', '#eef1f5', smooth(0.42, 0.26, l));
    }
    get groundColor() {
      return mix(this.groundBase, this.sky.bot, 0.12);
    }
    get bldColor() {
      return mix(this.sky.bot, this.groundBase === '#dfe8f1' ? '#5d6b7a' : this.groundBase, 0.42);
    }

    render() {
      const g = this.g, t = this.t, v = this.view || this.cam;
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.globalAlpha = 1;
      g.globalCompositeOperation = 'source-over';

      // sky
      const sg = g.createLinearGradient(0, 0, 0, H);
      sg.addColorStop(0, this.sky.top);
      sg.addColorStop(0.72, this.sky.bot);
      sg.addColorStop(1, this.sky.bot);
      g.fillStyle = sg;
      g.fillRect(0, 0, W, H);
      if (this.stars > 0.01) this.drawStars(g);
      if (this.sun.a > 0.01) {
        const [sx, sy] = this.sunPos(v), R = this.sun.r;
        g.globalCompositeOperation = 'lighter';
        g.globalAlpha = 0.55 * this.sun.a;
        g.drawImage(soft(this.sun.c), sx - R * 5, sy - R * 5, R * 10, R * 10);
        g.globalCompositeOperation = 'source-over';
        g.globalAlpha = this.sun.a;
        g.fillStyle = this.sun.c;
        g.beginPath();
        g.arc(sx, sy, R, 0, TAU);
        g.fill();
        g.globalAlpha = 1;
      }
      this.drawClouds(g, v);
      for (const e of this.ents) if (e.layer === 'sky') e.draw(g, this);

      // camera: shake on top of a slow handheld drift
      const tr = this.trauma * this.trauma;
      const sx = (Math.sin(t * 47.3) + Math.sin(t * 91.7) * 0.5) * 38 * tr + Math.sin(t * 1.1) * 4 + Math.sin(t * 2.3) * 2;
      const sy = (Math.cos(t * 53.1) + Math.sin(t * 77.9) * 0.5) * 38 * tr + Math.cos(t * 1.3) * 3;
      const sr = Math.sin(t * 31.3) * 0.025 * tr + Math.sin(t * 0.6) * 0.004;
      const zoom = v.zoom * (1 + this.punchZ);

      // far layer with parallax, then haze so the near city stands in front of it
      const zf = 1 + (zoom - 1) * 0.35;
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.translate(W / 2 + sx * 0.4, H / 2 + sy * 0.4);
      g.scale(zf, zf);
      g.translate(-(W / 2 + (v.x - W / 2) * 0.35), -(H / 2 + (v.y - H / 2) * 0.35) + (GY - 1500));
      this.drawFar(g);
      g.setTransform(1, 0, 0, 1, 0, 0);
      const gy = H / 2 + (GY - v.y) * zoom, fh = 700 * zoom;
      if (gy > 0 && gy - fh < H) {
        const fog = g.createLinearGradient(0, gy - fh, 0, gy);
        fog.addColorStop(0, rgba(this.sky.bot, 0));
        fog.addColorStop(1, rgba(this.sky.bot, 0.45));
        g.fillStyle = fog;
        g.fillRect(0, gy - fh, W, fh + 2);
      }

      // world
      g.translate(W / 2, H / 2);
      g.rotate((v.rot || 0) + sr);
      g.scale(zoom, zoom);
      g.translate(-v.x + sx, -v.y + sy);
      const M = g.getTransform();
      for (const e of this.ents) if (e.layer === 'back') e.draw(g, this);
      this.drawBuildings(g);
      for (const e of this.ents) if (e.layer === 'bld') e.draw(g, this);
      this.drawChunks(g);
      this.drawProps(g);
      g.fillStyle = this.groundColor;
      g.fillRect(v.x - 6000, GY, 12000, 6000);
      g.fillStyle = mix(this.groundColor, this.sky.bot, 0.3);
      g.fillRect(v.x - 6000, GY, 12000, 5);
      this.drawShadows(g);
      this.drawParts(g, false);
      for (const e of this.ents) if (e.layer === 'mid') e.draw(g, this);
      const fc = this.figColor;
      for (const f of this.figs) if (!f.alive) f.draw(g, t, fc, HEAD * f.scale * zoom);
      for (const f of this.figs) {
        if (!f.alive) continue;
        if (f.trail) this.drawTrail(g, f, t, fc);
        f.draw(g, t, fc, HEAD * f.scale * zoom);
      }
      for (const e of this.ents) if (e.layer === 'front') e.draw(g, this);
      this.drawParts(g, true);
      for (const w of this.waves) {
        const k = w.age / w.life;
        g.strokeStyle = rgba(w.c, (1 - k) * 0.8);
        g.lineWidth = w.w * (1 - k) + 2;
        g.beginPath();
        g.arc(w.x, w.y, w.r, 0, TAU);
        g.stroke();
      }
      for (const e of this.ents) if (e.layer === 'top') e.draw(g, this);
      if (this.onDraw) this.onDraw(g);
      if (this.opts.bloom) this.drawBloom(M, v);

      // screen overlays
      g.setTransform(1, 0, 0, 1, 0, 0);
      for (const e of this.ents) if (e.layer === 'screen') e.draw(g, this);
      if (this.tint.a > 0.005) {
        g.fillStyle = rgba(this.tint.c, this.tint.a);
        g.fillRect(0, 0, W, H);
      }
      g.globalAlpha = 0.9;
      g.drawImage(this.vig, 0, 0, W, H);
      g.globalAlpha = 1;
      if (this.flashA > 0.005) {
        g.fillStyle = rgba(this.flashC, Math.min(1, this.flashA));
        g.fillRect(0, 0, W, H);
      }
      this.drawBlur(g);
      // Impact frame: two frames inverted, then a beat of black and white.
      if (this.impactT >= 0 && this.impactT < 0.16) {
        const inv = this.impactT < 0.07;
        g.globalCompositeOperation = inv ? 'difference' : 'saturation';
        g.fillStyle = inv ? '#ffffff' : '#808080';
        g.fillRect(0, 0, W, H);
        g.globalCompositeOperation = 'source-over';
      }
      if (this.opts.grain) {
        g.globalAlpha = 0.05;
        g.globalCompositeOperation = 'overlay';
        const ox = (Math.random() * 256) | 0, oy = (Math.random() * 256) | 0;
        g.translate(-ox, -oy);
        g.fillStyle = g.createPattern(this.grain, 'repeat');
        g.fillRect(0, 0, W + 256, H + 256);
        g.setTransform(1, 0, 0, 1, 0, 0);
        g.globalCompositeOperation = 'source-over';
        g.globalAlpha = 1;
      }
      this.drawHUD(g);
      if (this.fadeA > 0) {
        g.fillStyle = `rgba(0,0,0,${this.fadeA})`;
        g.fillRect(0, 0, W, H);
      }
    }

    sunPos(v) {
      return [this.sun.x - (v.x - W / 2) * 0.05, this.sun.y - (v.y - H / 2) * 0.05];
    }
    drawClouds(g, v) {
      if (!this.clouds.length) return;
      const night = clamp(this.stars, 0, 1);
      g.fillStyle = mix(this.sky.bot, '#ffffff', 0.5 * (1 - night * 0.8));
      g.globalAlpha = 0.72 * (1 - night * 0.65);
      const span = W + 900;
      for (const c of this.clouds) {
        const x = ((((c.x + this.t * c.v - (v.x - W / 2) * 0.12) % span) + span) % span) - 450;
        const y = c.y - (v.y - H / 2) * 0.06, k = c.s;
        g.beginPath();
        g.ellipse(x, y, 125 * k, 34 * k, 0, 0, TAU);
        g.arc(x - 52 * k, y - 14 * k, 42 * k, 0, TAU);
        g.arc(x + 8 * k, y - 32 * k, 54 * k, 0, TAU);
        g.arc(x + 66 * k, y - 12 * k, 36 * k, 0, TAU);
        g.fill();
      }
      g.globalAlpha = 1;
    }
    drawShadows(g) {
      g.fillStyle = '#000000';
      for (const f of this.figs) {
        if (!f.visible || f.alpha <= 0 || f.noShadow) continue;
        const floor = f.floor ?? GY, h = floor - f.y;
        if (h > 900 || h < -20) continue;
        const k = clamp(1 - h / 900, 0, 1);
        const lying = f.lie > 0.5;
        const rx = (lying ? 60 : 30) * f.scale * (0.45 + 0.55 * k);
        g.globalAlpha = 0.24 * k * f.alpha;
        g.beginPath();
        g.ellipse(f.x + (lying ? f.lieDir * f.face * 22 * f.scale : 0), floor + 3, rx, rx * 0.2, 0, 0, TAU);
        g.fill();
      }
      g.globalAlpha = 1;
    }
    drawTrail(g, f, t, fc) {
      const [x, y, a, al] = [f.x, f.y, f.angle, f.alpha];
      f.trail.forEach(([tx, ty, ta], i) => {
        f.x = tx;
        f.y = ty;
        f.angle = ta;
        f.alpha = al * (0.28 - i * 0.06);
        f.draw(g, t, fc, 0);
      });
      [f.x, f.y, f.angle, f.alpha] = [x, y, a, al];
    }
    drawBloom(M, v) {
      const L = this.lightG, lw = W / 8, lh = H / 8;
      L.setTransform(1, 0, 0, 1, 0, 0);
      L.globalCompositeOperation = 'source-over';
      L.globalAlpha = 1;
      L.fillStyle = '#000000';
      L.fillRect(0, 0, lw, lh);
      L.globalCompositeOperation = 'lighter';
      if (this.sun.a > 0.01) {
        const [sx, sy] = this.sunPos(v), R = this.sun.r * 2.6;
        L.setTransform(1 / 8, 0, 0, 1 / 8, 0, 0);
        L.globalAlpha = this.sun.a * 0.7;
        L.drawImage(soft(this.sun.c), sx - R, sy - R, R * 2, R * 2);
      }
      L.setTransform(M.a / 8, M.b / 8, M.c / 8, M.d / 8, M.e / 8, M.f / 8);
      this.drawParts(L, true, true);
      L.globalCompositeOperation = 'lighter';
      for (const e of this.ents) if (e.glow) e.glow(L, this);
      L.globalAlpha = 1;
      let src = this.lightC;
      if (this.canBlur) {
        this.lightBG.clearRect(0, 0, lw, lh);
        this.lightBG.drawImage(this.lightC, 0, 0);
        src = this.lightB;
      }
      const g = this.g;
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.globalCompositeOperation = 'lighter';
      g.globalAlpha = 0.7;
      g.drawImage(src, 0, 0, W, H);
      g.globalAlpha = 1;
      g.globalCompositeOperation = 'source-over';
    }
    // Zoom blur on hits and cuts, a sideways smear on time-jump whips.
    drawBlur(g) {
      if (this.zblur < 0.02 && this.hblur < 0.02) return;
      const T = this.tmpG;
      T.globalCompositeOperation = 'copy';
      T.drawImage(this.canvas, 0, 0);
      T.globalCompositeOperation = 'source-over';
      g.setTransform(1, 0, 0, 1, 0, 0);
      if (this.zblur >= 0.02) {
        const [fx, fy] = this.zfocus;
        for (let i = 1; i <= 4; i++) {
          const k = 1 + this.zblur * 0.045 * i;
          g.globalAlpha = 0.5 / (i + 1);
          g.drawImage(this.tmp, fx - fx * k, fy - fy * k, W * k, H * k);
        }
      }
      if (this.hblur >= 0.02) {
        for (let i = 1; i <= 4; i++) {
          g.globalAlpha = 0.4 / (i + 0.5);
          g.drawImage(this.tmp, -this.hblur * 40 * i, 0);
          g.drawImage(this.tmp, this.hblur * 40 * i, 0);
        }
      }
      g.globalAlpha = 1;
    }

    drawStars(g) {
      const r = WI.RNG(7);
      g.fillStyle = '#ffffff';
      for (let i = 0; i < 160; i++) {
        const x = r() * W, y = r() * H * 0.75, s = r() * 2.4 + 0.6;
        g.globalAlpha = this.stars * (0.4 + 0.6 * Math.abs(Math.sin(this.t * (0.5 + r()) + i)));
        g.fillRect(x, y, s, s);
      }
      g.globalAlpha = 1;
    }

    drawFar(g) {
      const env = this.envDef;
      const c = mix(this.sky.bot, this.sky.top, 0.18);
      const col = mix(c, this.groundBase, 0.22);
      g.fillStyle = col;
      if (env.far === 'city') {
        for (const b of this.far) g.fillRect(b.x, GY - b.h, b.w, b.h + 2600);
        if (this.lights > 0.02) {
          g.fillStyle = rgba('#ffd27a', 0.55 * this.lights);
          for (const b of this.far) {
            const r = WI.RNG(b.seed);
            for (let y = GY - b.h + 20; y < GY - 20; y += 34)
              for (let x = b.x + 12; x < b.x + b.w - 14; x += 26) if (r() < 0.3) g.fillRect(x, y, 9, 13);
          }
        }
      } else if (env.far === 'hills' || env.far === 'dunes') {
        g.beginPath();
        g.moveTo(-1400, GY + 2600);
        for (let x = -1400; x <= W + 1400; x += 40) g.lineTo(x, GY - 120 - Math.sin(x * 0.004) * 90 - Math.sin(x * 0.011 + 2) * 40);
        g.lineTo(W + 1400, GY + 2600);
        g.fill();
      } else {
        g.beginPath();
        g.moveTo(-1400, GY + 2600);
        for (let x = -1400, i = 0; x <= W + 1400; x += 180, i++) g.lineTo(x, GY - (i % 2 ? 520 + ((i * 97) % 300) : 180));
        g.lineTo(W + 1400, GY + 2600);
        g.fill();
        g.fillStyle = mix(col, '#ffffff', 0.55);
        for (let x = -1400 + 180, i = 1; x <= W + 1400; x += 360, i += 2) {
          const h = 520 + ((i * 97) % 300);
          g.beginPath();
          g.moveTo(x, GY - h);
          g.lineTo(x - 90, GY - h + 140);
          g.lineTo(x + 90, GY - h + 140);
          g.fill();
        }
      }
    }

    drawBuildings(g) {
      const base = this.bldColor, lights = this.lights;
      const winDay = mix(base, this.sky.top, 0.35);
      for (const b of this.buildings) {
        if (b.state === 'gone') continue;
        g.save();
        g.translate(b.x, GY);
        if (b.tilt) g.rotate(b.tilt);
        g.translate(0, b.sink);
        const col = mix(base, '#000000', b.k * 0.12);
        g.fillStyle = col;
        if (b.kind === 'landmark') {
          g.fillStyle = b.lm.color ? mix(b.lm.color, col, 0.35) : mix(col, '#000000', 0.08);
          b.lm.draw(g);
          if (b.lm.extra) b.lm.extra(g, this);
          g.restore();
          continue;
        }
        const w = b.w, h = b.h;
        if (b.kind === 'house') {
          g.fillRect(-w / 2, -h, w, h);
          g.fillStyle = mix(col, '#000000', 0.25);
          g.beginPath();
          g.moveTo(-w / 2 - 12, -h);
          g.lineTo(0, -h - w * 0.45);
          g.lineTo(w / 2 + 12, -h);
          g.fill();
          g.fillStyle = lights > 0.1 ? rgba('#ffd27a', 0.3 + 0.7 * lights) : winDay;
          g.fillRect(-w / 2 + 18, -h + 30, 26, 30);
          g.fillRect(w / 2 - 44, -h + 30, 26, 30);
          g.fillStyle = mix(col, '#000000', 0.3);
          g.fillRect(-12, -54, 26, 54);
        } else if (b.kind === 'hut') {
          g.beginPath();
          g.arc(0, 0, w / 2, Math.PI, 0);
          g.fill();
          g.fillStyle = mix(col, '#000000', 0.3);
          g.fillRect(-10, -32, 22, 32);
        } else {
          g.fillRect(-w / 2, -h, w, h);
          if (b.roof === 1) g.fillRect(-w / 4, -h - 24, w / 2, 26);
          if (b.roof === 2) g.fillRect(-3, -h - 70, 6, 72);
          const r = WI.RNG(b.seed);
          const cols = Math.max(2, Math.floor((w - 20) / 30));
          const cw = (w - 20) / cols;
          for (let y = -h + 24; y < -40; y += 42) {
            for (let i = 0; i < cols; i++) {
              const lit = r() < 0.55;
              if (lights > 0.05 && lit) g.fillStyle = rgba('#ffd27a', lights);
              else g.fillStyle = winDay;
              g.fillRect(-w / 2 + 10 + i * cw + 4, y, cw - 10, 22);
            }
          }
        }
        g.restore();
      }
    }

    drawProps(g) {
      const c = mix(this.bldColor, '#1d3b1d', 0.5);
      for (const p of this.props) {
        if (p.gone) continue;
        g.save();
        g.translate(p.x, p.y);
        g.rotate(p.tilt || 0);
        g.scale(p.s, p.s);
        g.fillStyle = mix(c, '#000000', 0.2);
        g.fillRect(-7, -70, 14, 70);
        g.fillStyle = c;
        g.beginPath();
        g.arc(0, -100, 46, 0, TAU);
        g.arc(-28, -78, 30, 0, TAU);
        g.arc(28, -78, 30, 0, TAU);
        g.fill();
        g.restore();
      }
    }

    drawParts(g, front, addOnly) {
      for (const p of this.parts) {
        if (addOnly) {
          if (!p.add) continue;
        } else {
          const isFront = p.type === 'spark' || p.type === 'debris' || p.type === 'ember' || p.type === 'drop' || p.type === 'streak' || p.type === 'glow' || p.type === 'fire' || p.type === 'puff' || p.front;
          if (isFront !== front) continue;
        }
        const k = p.age / p.life;
        g.globalCompositeOperation = p.add ? 'lighter' : 'source-over';
        switch (p.type) {
          case 'spark': {
            g.globalAlpha = 1 - k;
            g.strokeStyle = p.c;
            g.lineWidth = p.size;
            g.beginPath();
            g.moveTo(p.x, p.y);
            g.lineTo(p.x - p.vx * 0.035, p.y - p.vy * 0.035);
            g.stroke();
            break;
          }
          case 'fire': {
            const ci = Math.min(FIRE.length - 1, Math.floor(k * FIRE.length));
            const s = p.size * (1 + k * 1.2);
            g.globalAlpha = (1 - k) * 0.85;
            g.drawImage(soft(FIRE[ci]), p.x - s, p.y - s, s * 2, s * 2);
            break;
          }
          case 'smoke':
          case 'dust':
          case 'puff':
          case 'glow': {
            const s = p.size * (1 + k * (p.type === 'puff' ? 1.5 : 1.6));
            g.globalAlpha = p.a * (p.type === 'glow' ? 1 - k : Math.min(1, (1 - k) * 1.6) * Math.min(1, k * 8 + 0.3));
            g.drawImage(soft(p.c), p.x - s, p.y - s, s * 2, s * 2);
            break;
          }
          case 'debris': {
            g.globalAlpha = Math.min(1, (1 - k) * 3);
            g.fillStyle = p.c;
            g.save();
            g.translate(p.x, p.y);
            g.rotate(p.rot);
            g.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66);
            g.restore();
            break;
          }
          case 'streak': {
            g.globalAlpha = p.a * Math.sin(k * Math.PI);
            g.strokeStyle = p.c;
            g.lineWidth = 3;
            g.beginPath();
            g.moveTo(p.x, p.y);
            g.lineTo(p.x - Math.sign(p.vx || 1) * p.size, p.y - (p.vy / (Math.abs(p.vx) + 1)) * p.size);
            g.stroke();
            break;
          }
          case 'drop': {
            g.globalAlpha = 1 - k;
            g.strokeStyle = p.c;
            g.lineWidth = p.size;
            g.lineCap = 'round';
            g.beginPath();
            g.moveTo(p.x, p.y);
            g.lineTo(p.x - p.vx * 0.02, p.y - p.vy * 0.02);
            g.stroke();
            break;
          }
          default: {
            g.globalAlpha = p.a * Math.min(1, (1 - k) * 3) * Math.min(1, k * 6);
            g.fillStyle = p.c;
            if (p.type === 'leaf') {
              g.save();
              g.translate(p.x, p.y);
              g.rotate(p.rot);
              g.fillRect(-p.size, -p.size / 3, p.size * 2, p.size * 0.7);
              g.restore();
            } else {
              g.beginPath();
              g.arc(p.x, p.y, p.size, 0, TAU);
              g.fill();
            }
          }
        }
      }
      g.globalAlpha = 1;
      g.globalCompositeOperation = 'source-over';
    }

    /* ------------------------------------------------------------------ HUD */
    font(size) {
      return `${size}px ${FONT}`;
    }
    wrap(words, size, maxW) {
      const g = this.g;
      g.font = this.font(size);
      const space = g.measureText(' ').width;
      const lines = [[]];
      let lw = 0;
      for (const w of words) {
        const ww = g.measureText(w.w).width;
        if (lw > 0 && lw + space + ww > maxW) {
          lines.push([]);
          lw = 0;
        }
        lines[lines.length - 1].push({ ...w, width: ww });
        lw += (lw > 0 ? space : 0) + ww;
      }
      return { lines, space };
    }
    outlined(text, x, y, size, fill, stroke = '#000000', sw) {
      const g = this.g;
      g.font = this.font(size);
      g.lineJoin = 'round';
      g.lineWidth = sw ?? size * 0.2;
      g.strokeStyle = 'rgba(0,0,0,0.35)';
      g.strokeText(text, x, y + size * 0.07);
      g.strokeStyle = stroke;
      g.strokeText(text, x, y);
      g.fillStyle = fill;
      g.fillText(text, x, y);
    }
    // Word-by-word pop-in, the caption style Shorts audiences expect.
    drawWords(lines, space, size, cx, y0, age, stagger, lh = 1.12) {
      const g = this.g;
      g.textBaseline = 'middle';
      g.textAlign = 'center';
      let idx = 0;
      lines.forEach((line, li) => {
        const total = line.reduce((s, w) => s + w.width, 0) + space * (line.length - 1);
        let x = cx - total / 2;
        const y = y0 + li * size * lh;
        for (const w of line) {
          const k = clamp((age - idx * stagger) / 0.22, 0, 1);
          idx++;
          if (k <= 0) {
            x += w.width + space;
            continue;
          }
          const sc = ease.outBack(k);
          g.save();
          g.translate(x + w.width / 2, y);
          g.scale(sc, sc);
          g.globalAlpha = Math.min(1, k * 2);
          if (w.parts && w.parts.length > 1) {
            g.textAlign = 'left';
            let px = -w.width / 2;
            for (const [txt, hi] of w.parts) {
              this.outlined(txt, px, 0, size, hi ? '#ffd60a' : '#ffffff');
              px += g.measureText(txt).width;
            }
            g.textAlign = 'center';
          } else this.outlined(w.w, 0, 0, size, w.hi ? '#ffd60a' : '#ffffff');
          g.restore();
          x += w.width + space;
        }
      });
    }

    drawHUD(g) {
      g.textBaseline = 'middle';
      g.textAlign = 'center';
      const t = this.t, title = this.title;
      const HOLD = 2.4;

      // Hook: big title for the first seconds, then a compact header.
      if (t < HOLD + 0.4) {
        const out = clamp((t - HOLD) / 0.4, 0, 1);
        g.globalAlpha = 1 - out;
        g.fillStyle = 'rgba(0,0,0,0.38)';
        g.fillRect(0, 0, W, H);
        if (!title.big) title.big = this.wrap(title.text.split(/\s+/).map((w) => ({ w, hi: false })), 116, 940);
        const L = title.big.lines.length;
        const y0 = 860 - (L * 116 * 1.05) / 2;
        const pk = ease.outBack(clamp(t / 0.3, 0, 1));
        g.save();
        g.translate(W / 2, y0 - 110);
        g.rotate(-0.04);
        g.scale(pk, pk);
        g.font = this.font(76);
        const pw = g.measureText(title.pre).width + 50;
        g.fillStyle = '#ffd60a';
        g.fillRect(-pw / 2, -50, pw, 100);
        g.fillStyle = '#111111';
        g.fillText(title.pre, 0, 4);
        g.restore();
        this.drawWords(title.big.lines, title.big.space, 116, W / 2, y0 + 30, t - 0.12, 0.07, 1.05);
        g.globalAlpha = 1;
      }
      if (t > HOLD) {
        const k = ease.out(clamp((t - HOLD) / 0.45, 0, 1));
        if (!title.small) title.small = this.wrap([{ w: title.pre, hi: true }, ...title.text.split(/\s+/).map((w) => ({ w, hi: false }))], 54, 900);
        const L = title.small.lines.length;
        const hgt = L * 54 * 1.08 + 34;
        g.save();
        g.translate(0, (1 - k) * -220);
        g.fillStyle = 'rgba(0,0,0,0.5)';
        this.rrect(g, 60, 110, W - 120, hgt, 26);
        g.fill();
        this.drawWords(title.small.lines, title.small.space, 54, W / 2, 110 + 17 + 54 * 0.52, 99, 0, 1.08);
        g.restore();
        this.headerBottom = 110 + hgt;
      }

      if (this.endCard) {
        const a = this.t - this.endCard.t0;
        g.fillStyle = `rgba(0,0,0,${0.55 * clamp(a / 0.4, 0, 1)})`;
        g.fillRect(0, 0, W, H);
        if (!this.endCard.layout) {
          this.endCard.layout = this.wrap(parseMarked(this.endCard.text), 120, 920);
        }
        const L = this.endCard.layout;
        this.drawWords(L.lines, L.space, 120, W / 2, 820 - (L.lines.length - 1) * 60, a, 0.09, 1.05);
        if (this.opts.cta && a > 0.6) {
          const k = ease.outBack(clamp((a - 0.6) / 0.3, 0, 1));
          g.save();
          g.translate(W / 2, 1060);
          g.scale(k, k);
          g.font = this.font(60);
          const tw = g.measureText(this.opts.cta).width + 70;
          g.fillStyle = '#e63946';
          this.rrect(g, -tw / 2, -50, tw, 100, 50);
          g.fill();
          g.fillStyle = '#ffffff';
          g.fillText(this.opts.cta, 0, 4);
          g.restore();
        }
      } else {
        const top = this.headerBottom || 260;
        if (this.stampTx && t > HOLD) {
          const s = this.stampTx, k = ease.outBack(clamp(s.age / 0.35, 0, 1));
          g.save();
          g.translate(W / 2, top + 58);
          g.scale(k, k);
          g.font = this.font(50);
          const tw = g.measureText(s.text).width + 60;
          g.fillStyle = '#e63946';
          this.rrect(g, -tw / 2, -38, tw, 76, 14);
          g.fill();
          g.fillStyle = '#ffffff';
          g.fillText(s.text, 0, 3);
          g.restore();
        }
        if (this.counters.length && t > HOLD) {
          const n = this.counters.length;
          this.counters.forEach((c, i) => {
            const cx = n === 1 ? W / 2 : 290 + i * 500;
            const cy = top + 190;
            const k = ease.outBack(clamp(c.age / 0.35, 0, 1)) * (1 + c.bump * 0.08);
            g.save();
            g.translate(cx, cy);
            g.scale(k, k);
            g.fillStyle = 'rgba(0,0,0,0.55)';
            this.rrect(g, -220, -70, 440, 140, 22);
            g.fill();
            g.font = this.font(34);
            g.fillStyle = c.color;
            g.fillText(c.label, 0, -36);
            this.outlined(c.fmt(c.value), 0, 22, 64, '#ffffff', '#000000', 8);
            g.restore();
          });
        }
        if (this.caption && t > HOLD - 0.1) {
          const c = this.caption;
          if (!c.layout) c.layout = this.wrap(c.words, 82, 930);
          const L = c.layout;
          const y = top + (this.counters.length ? 360 : 230);
          let a = 1;
          if (c.age > c.dur) a = 1 - clamp((c.age - c.dur) / 0.25, 0, 1);
          if (a > 0) {
            g.globalAlpha = a;
            this.drawWords(L.lines, L.space, 82, W / 2, y, c.age, 0.075);
            g.globalAlpha = 1;
          }
        }
      }
      if (this.opts.handle) {
        g.globalAlpha = 0.55;
        g.font = this.font(38);
        g.fillStyle = '#ffffff';
        g.fillText(this.opts.handle, W / 2, H - 470);
        g.globalAlpha = 1;
      }
    }
    rrect(g, x, y, w, h, r) {
      g.beginPath();
      g.moveTo(x + r, y);
      g.arcTo(x + w, y, x + w, y + h, r);
      g.arcTo(x + w, y + h, x, y + h, r);
      g.arcTo(x, y + h, x, y, r);
      g.arcTo(x, y, x + w, y, r);
      g.closePath();
    }
  }
  WI.Scene = Scene;
  WI.soft = soft;
  WI.LANDMARKS = LANDMARKS;
})();
