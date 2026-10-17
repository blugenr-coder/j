/* Shorts Studio — the scenario library.
   Each archetype is a directed short: hook, setup, escalation, payoff, time
   jumps. Ideas (ideas.js) pick an archetype plus parameters; the archetype
   turns them into beats on the Scene. */
(function () {
  const { W, H, GY, TAU, clamp, lerp, mix, rgba, Fig } = WI;
  const S = (WI.SCENARIOS = {});
  const P = (s) => s.place.name;
  const HERO = '#ff3b3b';

  /* ------------------------------------------------------------ shared kit */
  function hero(s, x = W / 2, o = {}) {
    const f = new Fig(x, { color: HERO, hero: true, immune: true, face: 1, ...o });
    s.figs.push(f);
    return f;
  }
  function frameWide(s, zoom, groundScreenY = 1500, x = W / 2) {
    const y = GY - (groundScreenY - H / 2) / zoom;
    s.cam.x = x;
    s.cam.y = y;
    s.cam.zoom = zoom;
    const half = W / 2 / zoom;
    s.bx0 = x - half + 40;
    s.bx1 = x + half - 40;
    return { x, y, zoom };
  }
  function lookAt(s, x) {
    for (const f of s.figs) {
      if (!f.alive || f.air || f.hero || f.immune || f.ai) continue;
      f.mode = 'still';
      f.state = 'lookup';
      f.face = Math.sign(x - f.x) || 1;
    }
  }
  function flee(s, x) {
    s.danger = { x };
    for (const f of s.figs) if (f.alive && !f.air && !f.ai) f.mode = 'flee';
  }
  function calm(s) {
    s.danger = null;
    for (const f of s.figs) if (f.alive && !f.air && !f.ai) {
      f.mode = 'wander';
      f.tx = f.x;
    }
  }
  function car(s, x, dir, o = {}) {
    const r = s.rng;
    return s.add({
      x, y: GY, vx: dir * r.range(170, 260), vy: 0, angle: 0, av: 0, air: false, dir, wrap: true, layer: 'mid',
      color: r.pick(['#e63946', '#f4a261', '#2a9d8f', '#457b9d', '#e9c46a', '#8d99ae', '#6a4c93']), ...o,
      update(dt, s) {
        if (this.frozen) return;
        if (this.air) {
          this.vy += s.grav * dt;
          this.x += this.vx * dt;
          this.y += this.vy * dt;
          this.angle += this.av * dt;
          if (this.y >= GY && this.vy > 0) {
            if (this.vy > 1000) {
              s.explode(this.x, GY - 20, 0.5, { buildings: false });
              this.wreck = true;
            } else s.sfx('thud', 0.6);
            this.y = GY;
            this.vy = 0;
            this.air = false;
            this.vx *= 0.3;
            this.av = 0;
            this.angle = this.wreck ? 0.12 * this.dir : 0;
          }
          return;
        }
        if (this.wreck) {
          this.vx *= Math.exp(-4 * dt);
          if (s.rng() < dt * 8) s.part('smoke', this.x, this.y - 40, { vy: -60, size: 40, c: '#2b2b2e' });
        }
        this.x += this.vx * dt;
        if (this.wrap && !this.wreck) {
          if (this.x > s.bx1 + 400) this.x = s.bx0 - 300;
          if (this.x < s.bx0 - 400) this.x = s.bx1 + 300;
        }
      },
      draw(g, s) {
        g.save();
        g.translate(this.x, this.y);
        g.rotate(this.angle);
        g.scale(this.dir, 1);
        const c = this.wreck ? mix(this.color, '#222222', 0.6) : this.color;
        g.fillStyle = c;
        s.rrect(g, -64, -46, 128, 30, 10);
        g.fill();
        g.beginPath();
        g.moveTo(-34, -44); g.lineTo(-20, -68); g.lineTo(22, -68); g.lineTo(40, -44);
        g.fill();
        g.fillStyle = mix(s.sky.top, '#ffffff', 0.3);
        g.beginPath();
        g.moveTo(-26, -46); g.lineTo(-16, -62); g.lineTo(0, -62); g.lineTo(0, -46);
        g.moveTo(6, -46); g.lineTo(6, -62); g.lineTo(19, -62); g.lineTo(32, -46);
        g.fill();
        g.fillStyle = '#16171a';
        g.beginPath();
        g.arc(-36, -14, 14, 0, TAU);
        g.arc(38, -14, 14, 0, TAU);
        g.fill();
        g.restore();
      },
    });
  }
  function jet(s, x, y, vx, o = {}) {
    return s.add({
      x, y, vx, vy: 0, layer: 'front', angle: 0, ...o,
      update(dt, s) {
        if (this.frozen) return;
        if (this.falling) {
          this.vy += 900 * dt;
          this.angle = Math.atan2(this.vy, Math.abs(this.vx)) * Math.sign(this.vx);
          if (s.rng() < dt * 30) s.part('smoke', this.x, this.y, { size: 40, c: '#333333', vy: -30 });
          if (s.rng() < dt * 20) s.part('fire', this.x, this.y, { size: 26 });
          if (this.y > GY - 10) {
            s.explode(this.x, GY - 30, this.big || 0.9, { buildings: true });
            this.dead = true;
          }
        } else if (s.rng() < dt * 40) s.part('smoke', this.x - Math.sign(this.vx) * 60, this.y, { size: 18, c: '#e9eef3', a: 0.5, life: 1.2, drag: 3 });
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        if (this.x < s.cam.x - 4000 || this.x > s.cam.x + 4000) this.dead = true;
        if (this.update2) this.update2(dt, s);
      },
      draw(g, s) {
        g.save();
        g.translate(this.x, this.y);
        g.scale(Math.sign(this.vx) * (this.size || 1), this.size || 1);
        g.rotate(this.angle * Math.sign(this.vx));
        g.fillStyle = this.color || mix(s.figColor, '#556070', 0.25);
        g.beginPath();
        g.moveTo(70, 0); g.lineTo(-60, -12); g.lineTo(-70, -34); g.lineTo(-50, -12); g.lineTo(-60, 8); g.closePath();
        g.fill();
        g.beginPath();
        g.moveTo(10, 0); g.lineTo(-30, 34); g.lineTo(-18, 0); g.closePath();
        g.fill();
        g.restore();
      },
    });
  }
  function missile(s, x, y, tx, ty, onHit) {
    return s.add({
      x, y, sx: x, sy: y, tx, ty, k: 0, layer: 'front',
      update(dt, s) {
        this.k += dt * 0.9;
        const k = clamp(this.k, 0, 1);
        const nx = lerp(this.sx, this.tx, k), ny = lerp(this.sy, this.ty, k) - Math.sin(k * Math.PI) * 120;
        this.a = Math.atan2(ny - this.y, nx - this.x);
        this.x = nx;
        this.y = ny;
        s.part('smoke', this.x, this.y, { size: 22, c: '#cfd4da', a: 0.6, life: 1, drag: 2 });
        if (k >= 1) {
          this.dead = true;
          onHit(this.x, this.y);
        }
      },
      draw(g) {
        g.save();
        g.translate(this.x, this.y);
        g.rotate(this.a || 0);
        g.fillStyle = '#e8e8e8';
        g.fillRect(-22, -5, 44, 10);
        g.drawImage(WI.soft('#ffb347'), -60, -20, 40, 40);
        g.restore();
      },
    });
  }
  function campfire(s, x) {
    return s.add({
      x, layer: 'mid',
      update(dt, s) {
        if (s.rng() < dt * 30) s.part('fire', this.x + s.rng.range(-14, 14), GY - 12, { size: s.rng.range(16, 28), vy: -120, life: 0.7 });
        if (s.rng() < dt * 6) s.part('ember', this.x, GY - 30, { vx: s.rng.range(-40, 40), vy: -s.rng.range(80, 200) });
        if (s.rng() < dt * 3) s.part('smoke', this.x, GY - 60, { vy: -80, size: 30, a: 0.25 });
      },
      glow(g, s) {
        g.globalAlpha = 0.8 + Math.sin(s.t * 13) * 0.1;
        g.drawImage(WI.soft('#ff9a2e'), this.x - 160, GY - 180, 320, 320);
      },
      draw(g, s) {
        g.globalCompositeOperation = 'lighter';
        g.globalAlpha = 0.5 + Math.sin(s.t * 13) * 0.08;
        g.drawImage(WI.soft('#ff9a2e'), this.x - 260, GY - 300, 520, 520);
        g.globalAlpha = 1;
        g.globalCompositeOperation = 'source-over';
        g.strokeStyle = '#4a2c17';
        g.lineWidth = 12;
        g.lineCap = 'round';
        g.beginPath();
        g.moveTo(this.x - 36, GY - 4); g.lineTo(this.x + 30, GY - 16);
        g.moveTo(this.x + 36, GY - 4); g.lineTo(this.x - 30, GY - 16);
        g.stroke();
      },
    });
  }
  function weather(s, type, rate, dt) {
    const n = rate * dt;
    const count = Math.floor(n) + (s.rng() < n % 1 ? 1 : 0);
    for (let i = 0; i < count; i++) {
      const x = s.cam.x + s.rng.range(-W / s.cam.zoom, W / s.cam.zoom);
      const y = s.cam.y - H / 2 / s.cam.zoom - 40;
      if (type === 'ember') s.part('ember', x, y, { vx: s.rng.range(-60, 60), vy: s.rng.range(80, 220), life: 6, front: true });
      else s.part(type, x, y, { vx: s.rng.range(-40, 40), vy: s.rng.range(110, 220), life: 9, front: true });
    }
  }
  function crater(s, x, rx) {
    return s.add({
      x, rx, heat: 1, layer: 'mid',
      update(dt) {
        this.heat = Math.max(0.15, this.heat - dt * 0.05);
      },
      glow(g) {
        g.globalAlpha = this.heat;
        g.drawImage(WI.soft('#ff5a1f'), this.x - this.rx, GY - 80, this.rx * 2, 160);
      },
      draw(g) {
        g.fillStyle = '#140c08';
        g.beginPath();
        g.ellipse(this.x, GY + 6, this.rx, 34, 0, 0, TAU);
        g.fill();
        g.globalCompositeOperation = 'lighter';
        g.globalAlpha = this.heat;
        g.drawImage(WI.soft('#ff5a1f'), this.x - this.rx * 1.2, GY - 120, this.rx * 2.4, 240);
        g.globalAlpha = 1;
        g.globalCompositeOperation = 'source-over';
      },
    });
  }
  function fireball(s, x, y, R, dur = 4) {
    return s.add({
      x, y, R, age: 0, layer: 'bld',
      update(dt, s) {
        this.age += dt;
        const k = this.age / dur;
        if (k > 1) return void (this.dead = true);
        const r = this.R * Math.min(1, k * 4);
        if (s.rng() < dt * 60) s.part('fire', this.x + s.rng.range(-r, r) * 0.6, this.y - s.rng.range(0, r) * 0.8, { size: r * 0.25, vy: -s.rng.range(100, 400), life: 1.2 });
        if (s.rng() < dt * 30) s.part('smoke', this.x + s.rng.range(-r, r) * 0.4, this.y - r * (0.6 + k), { size: r * 0.35, vy: -s.rng.range(100, 300), c: '#2d2626', life: 4 });
      },
      glow(g) {
        const k = this.age / dur, r = this.R * Math.min(1, k * 4) * (1 + k * 0.3);
        g.globalAlpha = Math.max(0, 1 - k);
        g.drawImage(WI.soft('#ffd27a'), this.x - r * 1.3, this.y - r * 1.3, r * 2.6, r * 2.6);
      },
      draw(g) {
        const k = this.age / dur, r = this.R * Math.min(1, k * 4) * (1 + k * 0.3);
        g.globalCompositeOperation = 'lighter';
        g.globalAlpha = Math.max(0, 1 - k);
        g.drawImage(WI.soft('#ffb347'), this.x - r * 1.6, this.y - r * 1.6, r * 3.2, r * 3.2);
        g.drawImage(WI.soft('#fff2b0'), this.x - r * 0.8, this.y - r * 0.8, r * 1.6, r * 1.6);
        g.globalAlpha = 1;
        g.globalCompositeOperation = 'source-over';
      },
    });
  }
  function liquid(s, o) {
    return s.add({
      level: GY + 40, layer: 'front', color: '#2f7fd1', top: '#7cc3ff', hot: false, ...o,
      glow(g, s) {
        if (!this.hot) return;
        const x0 = s.view.x - W / s.view.zoom, x1 = s.view.x + W / s.view.zoom;
        g.globalAlpha = 0.7;
        g.drawImage(WI.soft('#ff7b1f'), x0, this.level - 140, x1 - x0, 280);
      },
      draw(g, s) {
        const x0 = s.view.x - W / s.view.zoom, x1 = s.view.x + W / s.view.zoom;
        const gr = g.createLinearGradient(0, this.level, 0, this.level + 900);
        gr.addColorStop(0, rgba(this.top, 0.92));
        gr.addColorStop(1, rgba(this.color, 0.97));
        g.fillStyle = gr;
        g.beginPath();
        g.moveTo(x0, this.level + 4000);
        for (let x = x0; x <= x1; x += 30) g.lineTo(x, this.level + Math.sin(x * 0.012 + s.t * 2.4) * 12 + Math.sin(x * 0.031 - s.t * 3.1) * 6);
        g.lineTo(x1, this.level + 4000);
        g.fill();
        g.strokeStyle = rgba('#ffffff', this.hot ? 0.0 : 0.65);
        g.lineWidth = 6;
        g.beginPath();
        for (let x = x0; x <= x1; x += 30) g.lineTo(x, this.level + Math.sin(x * 0.012 + s.t * 2.4) * 12 + Math.sin(x * 0.031 - s.t * 3.1) * 6);
        g.stroke();
        if (this.hot) {
          g.globalCompositeOperation = 'lighter';
          g.globalAlpha = 0.6;
          g.drawImage(WI.soft('#ff7b1f'), x0, this.level - 260, x1 - x0, 520);
          g.globalAlpha = 1;
          g.globalCompositeOperation = 'source-over';
        }
      },
    });
  }
  // A simple left/right seek used by zombies and soldiers.
  function nearest(f, list, maxD = 1e9) {
    let best = null, bd = maxD;
    for (const o of list) {
      if (o === f || !o.alive || !o.visible) continue;
      const d = Math.abs(o.x - f.x) + Math.abs(o.y - f.y) * 1.5;
      if (d < bd) {
        bd = d;
        best = o;
      }
    }
    return [best, bd];
  }
  WI.kit = { hero, frameWide, lookAt, flee, calm, car, jet, campfire, weather, liquid };

  /* ================================================================ IMPACT */
  WI.IMPACTORS = {
    asteroid10: { name: 'a 10-meter asteroid', look: 'rock', R: 34, power: 0.9, air: true,
      speed: 'Traveling at *40,000 mph*', hit: 'It explodes *in the sky*',
      later: [['1 MINUTE LATER', 'Windows shatter *for miles*'], ['1 WEEK LATER', 'People hunt for *meteorites*']] },
    asteroid100: { name: 'a 100-meter asteroid', look: 'rock', R: 52, power: 1.6,
      speed: 'Traveling at *40,000 mph*', hit: 'The city is *flattened*',
      later: [['1 MINUTE LATER', 'A crater *over a mile wide*'], ['1 YEAR LATER', 'The city starts to *rebuild*']] },
    asteroid1k: { name: 'a 1-kilometer asteroid', look: 'rock', R: 85, power: 2.6,
      speed: 'Traveling at *40,000 mph*', hit: 'A fireball *wider than the city*',
      later: [['1 HOUR LATER', 'Debris *rains down* from space'], ['1 YEAR LATER', 'Crops fail *worldwide*']], winter: true },
    asteroid10k: { name: 'a 10-kilometer asteroid', look: 'rock', R: 130, power: 3.6,
      speed: 'The same size that wiped out the *dinosaurs*', hit: 'The sky *catches fire*',
      later: [['1 DAY LATER', 'Firestorms *everywhere*'], ['1 YEAR LATER', 'An *impact winter* begins']], winter: true },
    comet: { name: 'a comet', look: 'ice', R: 95, power: 2.8,
      speed: 'Ice and rock at *150,000 mph*', hit: 'It *vaporizes* on impact',
      later: [['1 HOUR LATER', 'Steam *blocks out* the sky'], ['1 MONTH LATER', 'It *snows*... in summer']], winter: true },
    moon: { name: 'the Moon', look: 'moon', R: 900, power: 5,
      speed: "It's *3,474 km* wide", hit: "Earth's crust *melts*",
      later: [['1 HOUR LATER', 'The oceans *boil away*'], ['MILLIONS OF YEARS LATER', 'A new world *slowly forms*']], molten: true },
    bowling: { name: 'a 1-mile bowling ball', look: 'ball', R: 120, power: 2.4,
      speed: 'Falling from *space*', hit: '*STRIKE.*',
      later: [['1 MINUTE LATER', 'The city is a *crater*'], ['1 YEAR LATER', 'It becomes a *tourist attraction*']] },
    rod: { name: 'a tungsten rod from space', look: 'rod', R: 70, power: 1.4,
      speed: 'Dropped from orbit at *Mach 10*', hit: 'No explosives. Just *pure speed*',
      later: [['1 MINUTE LATER', 'Everything nearby is *gone*'], ['1 DAY LATER', 'Every country wants *one*']] },
    iss: { name: 'the Space Station', look: 'iss', R: 70, power: 0.8,
      speed: 'Falling at *17,500 mph*', hit: 'Most of it burns up. *Not all.*',
      later: [['1 MINUTE LATER', 'Pieces land *across the city*'], ['1 WEEK LATER', 'Collectors pay *millions* for pieces']] },
    cube: { name: 'a giant metal cube', look: 'cube', R: 110, power: 2.2,
      speed: 'Nobody knows *where it came from*', hit: 'It lands *perfectly flat*',
      later: [['1 HOUR LATER', 'Scientists *can\'t open it*'], ['1 YEAR LATER', 'It starts to *hum*...']] },
    whale: { name: 'a blue whale', look: 'whale', R: 80, power: 0.9, soft: true,
      speed: 'Falling from *the sky*', hit: 'It lands with a *THUD*',
      later: [['1 MINUTE LATER', 'The whole city smells *like fish*'], ['1 WEEK LATER', 'Nobody can explain *why*']] },
    duck: { name: 'a giant rubber duck', look: 'duck', R: 110, power: 1.1, soft: true, bounce: true,
      speed: 'Falling from *space*', hit: '*Squeak.*',
      later: [['1 MINUTE LATER', 'It *bounces*... twice'], ['1 YEAR LATER', 'It becomes the city\'s *mascot*']] },
  };

  function drawImpactor(g, look, R, rng, t, ang) {
    g.save();
    switch (look) {
      case 'rock':
      case 'ice': {
        g.rotate(t * 0.6);
        g.fillStyle = look === 'ice' ? '#bfe3f2' : '#4b4540';
        g.beginPath();
        for (let i = 0; i < 11; i++) {
          const a = (i / 11) * TAU, r = R * (0.8 + 0.2 * Math.sin(i * 2.7 + 1));
          g.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        g.closePath();
        g.fill();
        g.fillStyle = look === 'ice' ? '#8cc3dc' : '#2e2a27';
        [[0.3, 0.2, 0.22], [-0.35, -0.25, 0.16], [-0.1, 0.45, 0.12]].forEach(([x, y, r]) => {
          g.beginPath();
          g.arc(x * R, y * R, r * R, 0, TAU);
          g.fill();
        });
        break;
      }
      case 'moon': {
        g.fillStyle = '#c9c6bf';
        g.beginPath();
        g.arc(0, 0, R, 0, TAU);
        g.fill();
        g.fillStyle = '#a8a49c';
        [[0.3, -0.2, 0.2], [-0.4, 0.1, 0.25], [0.1, 0.5, 0.14], [-0.15, -0.5, 0.12]].forEach(([x, y, r]) => {
          g.beginPath();
          g.arc(x * R, y * R, r * R, 0, TAU);
          g.fill();
        });
        break;
      }
      case 'ball': {
        g.rotate(t * 1.2);
        g.fillStyle = '#1b1d2b';
        g.beginPath();
        g.arc(0, 0, R, 0, TAU);
        g.fill();
        g.fillStyle = '#05050a';
        [[-0.2, -0.35], [0.12, -0.42], [-0.02, -0.12]].forEach(([x, y]) => {
          g.beginPath();
          g.arc(x * R, y * R, R * 0.1, 0, TAU);
          g.fill();
        });
        g.fillStyle = 'rgba(255,255,255,0.18)';
        g.beginPath();
        g.arc(-R * 0.35, -R * 0.4, R * 0.25, 0, TAU);
        g.fill();
        break;
      }
      case 'rod': {
        g.rotate(ang);
        g.fillStyle = '#c4c9cf';
        g.fillRect(-R * 1.6, -R * 0.12, R * 3.2, R * 0.24);
        g.fillStyle = '#e8ecf0';
        g.fillRect(-R * 1.6, -R * 0.12, R * 3.2, R * 0.07);
        break;
      }
      case 'iss': {
        g.rotate(t * 0.8);
        g.fillStyle = '#d4d8dd';
        g.fillRect(-R * 0.5, -R * 0.14, R, R * 0.28);
        g.fillStyle = '#2b4c7e';
        for (const sx of [-1, 1]) {
          g.fillRect(sx * R * 0.55 - (sx < 0 ? R * 0.5 : 0), -R * 0.5, R * 0.5, R * 0.3);
          g.fillRect(sx * R * 0.55 - (sx < 0 ? R * 0.5 : 0), R * 0.2, R * 0.5, R * 0.3);
        }
        break;
      }
      case 'cube': {
        g.rotate(t * 0.9);
        g.fillStyle = '#7d858f';
        g.fillRect(-R * 0.75, -R * 0.75, R * 1.5, R * 1.5);
        g.strokeStyle = '#a9b2bc';
        g.lineWidth = R * 0.08;
        g.strokeRect(-R * 0.6, -R * 0.6, R * 1.2, R * 1.2);
        break;
      }
      case 'whale': {
        g.rotate(Math.sin(t * 2) * 0.3);
        g.fillStyle = '#4a6c8c';
        g.beginPath();
        g.ellipse(0, 0, R, R * 0.45, 0, 0, TAU);
        g.fill();
        g.beginPath();
        g.moveTo(-R * 0.9, 0); g.lineTo(-R * 1.5, -R * 0.4); g.lineTo(-R * 1.35, 0); g.lineTo(-R * 1.5, R * 0.4); g.closePath();
        g.fill();
        g.fillStyle = '#9bb4c9';
        g.beginPath();
        g.ellipse(R * 0.1, R * 0.2, R * 0.7, R * 0.18, 0, 0, TAU);
        g.fill();
        g.fillStyle = '#0d1520';
        g.beginPath();
        g.arc(R * 0.6, -R * 0.08, R * 0.06, 0, TAU);
        g.fill();
        break;
      }
      case 'duck': {
        g.rotate(Math.sin(t * 3) * 0.25);
        g.fillStyle = '#ffd60a';
        g.beginPath();
        g.ellipse(0, R * 0.2, R, R * 0.6, 0, 0, TAU);
        g.arc(R * 0.45, -R * 0.45, R * 0.45, 0, TAU);
        g.fill();
        g.fillStyle = '#ff8c1a';
        g.beginPath();
        g.ellipse(R * 0.95, -R * 0.38, R * 0.25, R * 0.12, 0, 0, TAU);
        g.fill();
        g.fillStyle = '#111111';
        g.beginPath();
        g.arc(R * 0.6, -R * 0.58, R * 0.07, 0, TAU);
        g.fill();
        break;
      }
    }
    g.restore();
  }

  S.impact = {
    duration: 30,
    build(s, p) {
      const I = WI.IMPACTORS[p.obj];
      const r = s.rng;
      const TI = 11.6; // world-time of impact
      const hx = W / 2 + r.range(-60, 60);
      const hy = I.air ? GY - 760 : GY - 10;
      const start = [W + 420 + I.R, -700 - I.R];
      s.crowd(26);
      const me = hero(s, r.pick([260, 820]));
      me.mode = 'wander';
      s.music(0.2);

      let impacted = false;
      const obj = s.add({
        layer: 'bld', x: start[0], y: start[1], k: 0,
        update(dt, s) {
          if (impacted) return;
          this.k = clamp(s.wt / TI, 0, 1);
          const e = Math.pow(this.k, 2.4);
          const nx = lerp(start[0], hx, e), ny = lerp(start[1], hy, e);
          this.vx = (nx - this.x) / Math.max(dt, 1e-4);
          this.vy = (ny - this.y) / Math.max(dt, 1e-4);
          this.x = nx;
          this.y = ny;
          this.R = lerp(I.look === 'moon' ? 60 : 6, I.R, Math.pow(this.k, 1.4));
          const heat = I.look === 'moon' ? this.k * this.k : 1;
          if (s.rng() < dt * 70 * heat && this.k > 0.05) {
            const a = Math.atan2(start[1] - hy, start[0] - hx);
            s.part('fire', this.x + Math.cos(a) * this.R * 0.6, this.y + Math.sin(a) * this.R * 0.6, { size: this.R * 0.7, vx: Math.cos(a) * 300, vy: Math.sin(a) * 300, life: 0.7 });
            if (s.rng() < 0.4) s.part('smoke', this.x + Math.cos(a) * this.R * 1.4, this.y + Math.sin(a) * this.R * 1.4, { size: this.R * 0.8, c: '#5a5450', life: 2.4 });
          }
          if (this.k >= 1) impact();
        },
        glow(g) {
          if (impacted || this.k < 0.05) return;
          const gr = this.R * 2.2;
          g.globalAlpha = I.look === 'moon' ? this.k : 0.9;
          g.drawImage(WI.soft(I.look === 'ice' ? '#9fe3ff' : '#ff9a3d'), this.x - gr, this.y - gr, gr * 2, gr * 2);
        },
        draw(g, s) {
          if (impacted) return;
          g.save();
          g.translate(this.x, this.y);
          g.globalCompositeOperation = 'lighter';
          g.globalAlpha = 0.7;
          const gr = this.R * 3.2;
          g.drawImage(WI.soft(I.look === 'ice' ? '#9fe3ff' : '#ff8a2e'), -gr, -gr, gr * 2, gr * 2);
          g.globalAlpha = 1;
          g.globalCompositeOperation = 'source-over';
          drawImpactor(g, I.look, this.R, r, s.wt, Math.atan2(hy - start[1], hx - start[0]));
          g.restore();
        },
      });

      s.at(2.5, () => s.say(`Just a normal day in *${P(s)}*...`));
      s.at(5.0, () => {
        s.say('Then someone looks *up*');
        s.counter('t', 'IMPACT IN', 0, { color: '#ff6b6b', fmt: (v) => v.toFixed(1) + 's' });
        lookAt(s, obj.x);
        me.mode = 'still';
        me.state = 'lookup';
        me.face = Math.sign(obj.x - me.x) || 1;
        s.closeup(me, 2.2, { r: 125 });
        s.music(0.42);
        s.sfx('alarm', 5.5);
      });
      s.at(7.6, () => {
        s.say(I.speed);
        flee(s, hx);
        s.music(0.7);
        s.sfx('riser', TI - s.wt - 0.1);
      });
      s.at(9.9, () => s.camTo({ zoom: 1.12, y: H / 2 + 60 }, 1.8, 'in'));
      s.onUpdate = (dt, t) => {
        const c = s.counters.find((c) => c.id === 't');
        if (c) c.value = Math.max(0, TI - s.wt);
        if (s.ash) weather(s, s.ash, s.ashRate || 40, dt);
      };

      function impact() {
        impacted = true;
        obj.dead = true;
        const T = s.t, pw = I.power;
        s.clearCounters();
        s.music(1);
        s.slowmo(0.25, 0.6, 0.05, 0.6);
        s.camTo({ zoom: 0.92, y: H / 2 - 40 }, 1.2, 'out');
        if (I.air) {
          s.explode(hx, hy, pw, { buildings: false, kill: false });
          for (const f of s.figs) if (!f.air && !f.immune) s.launch(f, Math.sign(f.x - hx) * r.range(300, 700), -r.range(300, 600), { kill: false });
          s.burst('debris', hx, hy, 60, 900, { p: { c: '#9fd3ff', size: 6 } });
          s.wave(hx, hy, { v: 3000, life: 1.4, w: 60 });
          s.skyTo('#3a5c8f', '#f7c8a0', 1.5);
          s.shake(1);
        } else if (I.soft) {
          s.explode(hx, GY - 40, pw, { kill: false, flash: '#ffffff' });
          s.add({
            layer: 'bld', x: hx, y: GY - I.R * 0.55, vy: I.bounce ? -1500 : 0, bounces: I.bounce ? 2 : 0,
            update(dt, s) {
              if (!this.bounces) return;
              this.vy += 2400 * dt;
              this.y += this.vy * dt;
              if (this.y > GY - I.R * 0.55) {
                this.y = GY - I.R * 0.55;
                this.vy = -this.vy * 0.55;
                this.bounces--;
                s.shake(0.5);
                s.sfx('thud', 1);
                s.burst('dust', this.x, GY - 20, 16, 700, { angle: -Math.PI / 2, spread: 1.4, p: { size: 90 } });
              }
            },
            draw(g, s) {
              g.save();
              g.translate(this.x, this.y);
              drawImpactor(g, I.look, I.R, r, 0, 0);
              g.restore();
            },
          });
        } else {
          s.explode(hx, GY - 30, Math.min(pw, 2.6), { flash: '#fff6e0' });
          fireball(s, hx, GY - 40, 160 * pw, 3 + pw);
          crater(s, hx, 110 + 90 * pw);
          if (pw >= 2.2) {
            s.flash(1);
            for (const b of s.buildings) s.collapse(b, Math.abs(b.x - hx) / 2200, Math.sign(b.x - hx) || 1, 1300 + 300 * pw);
            for (const f of s.figs) if (!f.air && !f.immune) s.launch(f, Math.sign(f.x - hx || 1) * r.range(1500, 2600), -r.range(900, 1600), { kill: true });
            for (const pr of s.props) pr.tilt = Math.sign(pr.x - hx) * 0.6;
          }
          s.skyTo(I.look === 'ice' ? '#2b3036' : '#2a0b08', I.look === 'ice' ? '#a9a39b' : '#ff6a2a', 1.2);
          s.tintTo('#ff5a1f', 0.18, 1);
          s.ash = 'ember';
          s.ashRate = 30 + pw * 15;
          if (I.molten) s.groundTo('#5a1a08', 2);
        }
        me.immune = false;
        s.at(T + 3.2, () => {
          s.stamp(I.later[0][0]);
          s.say(I.later[0][1]);
          s.music(0.55);
          if (!I.air && !I.soft) {
            s.skyTo('#1a0d0b', '#7a2a12', 3);
            s.lights = 0;
          }
          if (I.look === 'iss') for (let i = 0; i < 6; i++) s.at(T + 3.4 + i * 0.5, () => s.explode(r.range(100, 1000), GY - 20, 0.35, { buildings: false, kill: false }));
        });
        s.at(T + 8.4, () => {
          s.stamp(I.later[1][0]);
          s.say(I.later[1][1]);
          s.music(0.3);
          if (I.winter) {
            s.skyTo('#3b4048', '#9a9fa6', 2.5);
            s.tintTo('#9fb4c8', 0.18, 2);
            s.ash = 'snow';
            s.ashRate = 60;
            s.groundTo('#d5dbe2', 3);
          } else if (I.molten) {
            s.skyTo('#120606', '#3a0d06', 2);
            s.stars = 0.6;
            s.ash = 'ember';
          } else {
            s.ash = null;
            s.skyTo(WI.ENVS[s.place.env].sky[0], WI.ENVS[s.place.env].sky[1], 2.5);
            s.tintTo('#000000', 0, 2);
            for (const f of s.figs) {
              if (f.alive || I.air || I.soft) {
                f.alive = true;
                f.state = 'idle';
                f.lie = 0;
                f.dieOnLand = false;
                f.mode = 'wander';
              }
            }
            s.danger = null;
          }
          me.alive = true;
          me.state = 'idle';
          me.lie = 0;
          me.mode = 'still';
          me.air = false;
          me.y = GY;
          me.x = clamp(me.x, 120, W - 120);
          s.camTo({ x: me.x, zoom: 1.25, y: H / 2 + 180 }, 3);
          if (!I.air && !I.soft) me.emo = 'sad';
          s.at(s.t + 1.2, () => s.closeup(me, 2.2, { r: 105, push: 0.2 }));
        });
      }
    },
  };

  /* ================================================================= GIANT */
  WI.GIANT_SIZES = { '100': { label: '100-foot', scale: 5.5, zoom: 0.8 }, '500': { label: '500-foot', scale: 11, zoom: 0.58 }, '1000': { label: '1,000-foot', scale: 16, zoom: 0.45 } };
  S.giant = {
    duration: 30,
    build(s, p) {
      const Z = WI.GIANT_SIZES[p.size], mood = p.mood, r = s.rng;
      const col = { angry: '#c1121f', confused: '#7b2cbf', friendly: '#168aad' }[mood];
      s.crowd(26);
      const me = hero(s, 360);
      me.immune = false;
      const G = new Fig(W + 260 + 40 * Z.scale, { scale: Z.scale, color: col, face: -1, mode: 'still', state: 'idle', immune: true, manualLie: true, eyes: mood === 'angry' ? '#ffd60a' : '#ffffff' });
      s.figs.push(G);
      let walking = false, lastS = 0, attackT = -1, stopX = W / 2 + 160;
      const foot = () => G.x + G.face * 22 * Z.scale * Math.sin(G.phase);
      G.ai = (f, dt) => {
        if (attackT >= 0) {
          attackT += dt;
          f.atk = clamp(attackT / 0.5, 0, 1);
          f.state = 'attack';
          if (attackT > 0.9) {
            attackT = -1;
            f.state = 'idle';
          }
          return;
        }
        if (!walking) return;
        f.state = 'walk';
        const sp = 46 * Math.sqrt(Z.scale);
        f.x += f.face * sp * dt;
        f.phase += dt * 1.9;
        const sn = Math.sin(f.phase);
        if (Math.sign(sn) !== Math.sign(lastS)) stomp(foot());
        lastS = sn;
        if (mood !== 'friendly' || f.face > 0)
          for (const b of s.buildings) if (b.state === 'ok' && Math.abs(b.x - f.x) < b.w / 2 + 16 * Z.scale && (mood !== 'friendly')) s.collapse(b, 0, f.face, 500);
        if (f.face < 0 && f.x < stopX) {
          walking = false;
          f.state = 'idle';
        }
      };
      function stomp(x) {
        s.shake(0.18 + Z.scale * 0.02);
        s.sfx('thud', 1);
        s.sfx('boom', 0.25);
        s.burst('dust', x, GY - 10, 10, 120 * Math.sqrt(Z.scale), { angle: -Math.PI / 2, spread: 1.5, p: { size: 30 + 6 * Z.scale, c: '#8f8270' } });
        for (const f of s.figs) if (f !== G && !f.air && f.alive && Math.abs(f.x - x) < 30 * Z.scale) s.launch(f, Math.sign(f.x - x) * r.range(300, 800), -r.range(400, 900), { kill: mood === 'angry' });
      }
      const fit = { zoom: Z.zoom, y: GY - (1460 - H / 2) / Z.zoom, x: W / 2 + 120 };
      s.music(0.25);
      s.every(1.3, 0.8, 5.2, () => {
        s.shake(0.22);
        s.sfx('boom', 0.3);
      });
      s.at(1.5, () => lookAt(s, W * 2));
      s.at(2.5, () => s.say('*BOOM*... *BOOM*...'));
      s.at(5.0, () => {
        s.say('Something *huge* is coming');
        me.mode = 'still';
        me.state = 'lookup';
        me.face = 1;
        s.closeup(me, 1.5, { r: 125 });
        s.camTo(fit, 2.6);
        walking = true;
        s.music(0.5);
        s.bx0 = fit.x - W / 2 / Z.zoom + 60;
        s.bx1 = fit.x + W / 2 / Z.zoom - 60;
        s.at(6.5, () => flee(s, G.x));
      });
      s.at(8.4, () => {
        s.stamp('DAY 1');
        s.say(`A *${Z.label}* stickman just walked into *${P(s)}*`);
        s.sfx('growl', 2, 0.35);
      });
      s.onUpdate = () => {
        if (s.danger) s.danger.x = G.x;
      };
      s.at(12, () => {
        if (mood === 'angry') {
          s.say('And it is *ANGRY*');
          G.emo = 'angry';
          s.closeup(G, 1.3, { r: 170, push: 0.25 });
          attackT = 0;
          s.at(12.3, () => {
            const b = s.buildings.filter((b) => b.state === 'ok').sort((a, c) => Math.abs(a.x - G.x) - Math.abs(c.x - G.x))[0];
            if (b) {
              s.collapse(b, 0, -1, 1500);
              s.burst('debris', b.x, GY - b.h * 0.6, 70, 1600, { angle: Math.PI, spread: 0.8 });
              s.shake(0.6);
              s.sfx('boom', 0.9);
            }
          });
          s.sfx('growl', 2.2, 0.5);
        } else if (mood === 'confused') {
          s.say('It has *no idea* where it is');
          G.state = 'lookup';
        } else {
          s.say('It just wants to *say hi*');
          G.state = 'cheer';
          s.closeup(G, 1.4, { r: 160 });
        }
      });
      s.at(15, () => {
        s.stamp('10 MINUTES LATER');
        s.say('The *army* shows up');
        s.music(0.85);
        const headY = GY - 100 * Z.scale;
        for (let i = 0; i < 3; i++) {
          s.at(15.2 + i * 1.1, () => {
            const j = jet(s, fit.x - W / Z.zoom, headY - 120 + i * 90, 900, { size: 1.6 / Math.sqrt(Z.zoom) });
            s.sfx('whoosh', 1.4, true, 0.35);
            s.at(s.t + 0.7, () =>
              missile(s, j.x, j.y, G.x + r.range(-20, 20) * Z.scale, headY + r.range(10, 40) * Z.scale, (x, y) => {
                s.explode(x, y, 0.8, { buildings: false, kill: false });
              })
            );
          });
        }
      });
      s.at(19.5, () => {
        if (mood === 'angry') {
          s.say("Missiles *don't even scratch it*");
          attackT = 0;
          const j = jet(s, fit.x - W / Z.zoom, GY - 85 * Z.scale, 1000, { size: 1.6 / Math.sqrt(Z.zoom) });
          s.at(20.1, () => {
            j.falling = true;
            j.big = 1.2;
            j.vx = 600;
            s.explode(j.x, j.y, 0.7, { buildings: false, kill: false });
          });
        } else if (mood === 'confused') {
          s.say('Then it *trips*...');
          walking = false;
          G.state = 'dead';
          G.lieDir = 1;
          s.to(G, 'lie', 1, 1.1, 'in');
          s.at(20.6, () => {
            s.explode(G.x - 50 * Z.scale, GY - 20, 2.4, { kill: true });
            for (const b of s.buildings) if (b.x < G.x && b.x > G.x - 120 * Z.scale) s.collapse(b, r.range(0, 0.3), -1, 900);
            s.flash(0.6);
          });
        } else {
          s.say('But the army *keeps firing*');
          G.state = 'idle';
          G.emo = 'sad';
          s.closeup(G, 1.6, { r: 160 });
          s.to(G, 'squash', 0.9, 1);
        }
      });
      s.at(24, () => {
        s.stamp('1 DAY LATER');
        if (mood === 'angry') {
          s.say('Nothing can *stop it*');
          s.skyTo('#2a0b08', '#d94f2a', 2);
          s.tintTo('#ff4d2a', 0.12, 2);
          walking = true;
        } else if (mood === 'confused') {
          s.say('It just... *takes a nap*');
          s.skyTo('#0b1026', '#3a3f7a', 2);
          s.stars = 0.7;
          s.lights = 0.7;
          for (let i = 0; i < 4; i++) s.at(24.5 + i * 0.6, () => s.part('puff', G.x + 40 * Z.scale, GY - 60 * Z.scale - i * 60, { c: '#ffffff', size: 40, life: 2, vy: -60 }));
        } else {
          s.say('It never *came back*');
          G.face = 1;
          walking = true;
          s.skyTo('#3b2a5c', '#f2a65a', 2.5);
          s.sun.y = 900;
          s.sun.x = 900;
          calm(s);
        }
      });
    },
  };

  /* ================================================================ ZOMBIE */
  WI.ZTYPES = {
    zombie: { name: 'zombie', speed: 150, scale: 1 },
    fast: { name: 'fast zombie', speed: 270, scale: 1 },
    giant: { name: 'giant zombie', speed: 120, scale: 2.6, reach: 70 },
    immortal: { name: 'zombie that can\'t die', speed: 160, scale: 1, immortal: true },
  };
  S.zombie = {
    duration: 30,
    build(s, p) {
      const Z = WI.ZTYPES[p.z], r = s.rng;
      const n = p.n;
      frameWide(s, n > 120 ? 0.5 : 0.62);
      const humans = s.crowd(n);
      const zombies = [];
      const ZC = '#57cc4d';
      humans.forEach((h) => {
        h.y = GY + r.range(0, 150); // depth lanes keep a crowd of 200 readable
        h.speed = r.range(0.85, 1.15);
        h.stamina = 1;
        if (r() < 0.08) {
          h.fighter = true;
          h.gear = 'knight';
        }
      });
      s.counter('h', 'HUMANS', n, { color: '#4cc9f0' });
      s.counter('z', 'ZOMBIES', 0, { color: '#80ed99' });
      let started = false;
      // Pacing director: survivors should follow a slow-start, mid-video
      // collapse curve. Zombie speed is nudged toward it; who gets caught
      // is still decided by the simulation.
      const floor = Z.immortal || Z.speed > 200 ? 0 : r.pick([0, 0.04, 0.12, 0.25]);
      const want = (t) => n * (floor + (1 - floor) * (1 - 1 / (1 + Math.exp(-(t - 15) / 2.2))));
      let pace = 1;

      function makeZombie(f, sc = 1) {
        f.color = ZC;
        f.eyes = '#ff2d2d';
        f.gear = null;
        f.zombie = true;
        f.scale = sc * WI.FS;
        f.retarget = 0;
        f.ai = zombieAI;
        f.state = 'zombie';
        zombies.push(f);
        s.part('puff', f.x, f.y - 60 * sc, { c: '#80ed99', size: 50 * sc });
      }
      function zombieAI(f, dt) {
        if (f.infect > 0) return;
        if (f.feed > 0) {
          f.feed -= dt;
          f.state = 'zombie';
          f.phase += dt * 1.5;
          return;
        }
        f.retarget -= dt;
        if (f.retarget <= 0 || !f.target || !f.target.alive || f.target.zombie || f.target.infect > 0) {
          f.target = nearest(f, humans.filter((h) => !h.zombie && !(h.infect > 0)))[0];
          f.retarget = 0.3;
        }
        const tg = f.target;
        let sp = Z.speed * (f.boss ? 1 : 0.95) * pace;
        if (!tg) {
          f.state = 'zombie';
          f.phase += dt * 3;
          return;
        }
        const dx = tg.x - f.x;
        f.face = Math.sign(dx) || 1;
        f.state = 'zombie';
        f.x += f.face * sp * dt;
        f.phase += sp * dt * 0.05;
        if (Math.abs(dx) < (f.boss && Z.reach ? Z.reach : 30)) {
          if (tg.fighter && r() < 0.4 && !f.boss && !Z.immortal) {
            tg.state = 'attack';
            tg.atk = 1;
            s.burst('spark', f.x, f.y - 60, 14, 600);
            s.sfx('hit', 0.3);
            f.ai = null;
            f.alive = false;
            s.launch(f, tg.face * r.range(500, 900), -r.range(400, 700), { kill: 'now' });
            zombies.splice(zombies.indexOf(f), 1);
            tg.fighter = r() < 0.7;
            return;
          }
          tg.infect = 1.0;
          f.feed = clamp(1.4 / pace, 0.5, 6);
          tg.ai = infectedAI;
          s.sfx('hit', 0.18);
          s.burst('spark', tg.x, tg.y - 60, 6, 300, { p: { c: '#80ed99' } });
          f.target = null;
        }
      }
      function infectedAI(f, dt) {
        f.infect -= dt;
        f.state = 'panic';
        f.phase += dt * 30;
        f.x += Math.sin(s.t * 60) * 2;
        if (f.infect <= 0) {
          makeZombie(f);
          s.sfx('pop', 0.6, 0.15);
        }
      }
      function humanAI(f, dt) {
        const [z, d] = nearest(f, zombies, f.fighter ? 420 : 380);
        f.breakT = (f.breakT || 0) - dt;
        if (!z && f.breakT <= 0) {
          f.mode = 'wander';
          f.ai = null;
          s.updateFig(f, dt);
          f.ai = humanAI;
          f.stamina = Math.min(1, f.stamina + dt * 0.08);
          return;
        }
        if (f.fighter && z && d < 150) {
          f.face = Math.sign(z.x - f.x) || 1;
          f.state = 'attack';
          f.atk = (s.t * 2.5) % 1;
          return;
        }
        let dir = f.breakT > 0 ? f.breakDir : Math.sign(f.x - z.x) || 1;
        // Cornered: dash back past the horde. Some make it, some don't.
        if ((dir < 0 && f.x < s.bx0) || (dir > 0 && f.x > s.bx1)) {
          dir = -dir;
          f.breakDir = dir;
          f.breakT = r.range(1.2, 2.6);
        }
        f.stamina = Math.max(0.45, f.stamina - dt * 0.05);
        const sp = 235 * f.speed * f.stamina;
        f.face = dir;
        f.state = 'panic';
        f.x += dir * sp * dt;
        f.phase += sp * dt * 0.055;
      }

      s.at(2.5, () => s.say(`*${n} people* live peacefully in *${P(s)}*`));
      s.at(5.0, () => {
        s.stamp('DAY 1');
        s.say(`Then *1 ${Z.name}* shows up`);
        const z = new Fig(s.bx0 + 10, { scale: Z.scale });
        z.y = GY + 75;
        z.boss = true;
        s.figs.push(z);
        makeZombie(z, Z.scale);
        s.sfx('growl', 1.6, 0.4);
        s.music(0.5);
        s.shake(0.3);
        humans.forEach((h) => (h.ai = humanAI));
        started = true;
        s.at(5.5, () => s.closeup(z, 1.4, { r: 120, push: 0.2 }));
      });
      s.at(9.5, () => s.say(Z.speed > 200 ? 'It runs *faster than humans*' : Z.immortal ? 'Weapons *don\'t work* on it' : 'Every bite makes *another zombie*'));
      s.at(11.6, () => {
        const prey = humans.filter((h) => !h.zombie && !(h.infect > 0) && h.state === 'panic');
        if (prey.length) s.closeup(prey[0], 1.3, { r: 115 });
      });
      s.at(13.5, () => {
        s.stamp('DAY 2');
        s.music(0.8);
        const h = humans.filter((h) => !h.zombie).length;
        s.say(h > n * 0.6 ? 'The fighters *hold the line*' : 'The infection *spreads fast*');
      });
      s.at(19.5, () => {
        s.stamp('DAY 3');
        s.music(1);
        const h = humans.filter((h) => !h.zombie).length;
        s.say(h === 0 ? 'Humanity has *fallen*' : h < n * 0.25 ? 'Only a few *are left*...' : 'Humans *fight back*!');
      });
      s.at(24.2, () => {
        const h = humans.filter((h) => !h.zombie && !(h.infect > 0)).length;
        s.stamp('THE END');
        s.music(0.4);
        if (h === 0) s.say('*Nobody* survived.');
        else if (zombies.length === 0) s.say('Humans *WIN*!');
        else s.say(`Only *${h} ${h === 1 ? 'human' : 'humans'}* survived`);
        s.endText = h === 0 ? 'WOULD *YOU* SURVIVE?' : 'WOULD *YOU* MAKE IT?';
      });
      s.onUpdate = () => {
        if (!started) return;
        s.figs.sort((a, b) => a.y - b.y);
        const h = humans.filter((h) => !h.zombie && !(h.infect > 0)).length;
        pace = clamp(1 + ((h - want(s.t)) / n) * 6, 0.25, 2.4);
        s.setCount('h', h);
        s.setCount('z', zombies.length);
      };
    },
  };

  /* ================================================================ BATTLE */
  WI.UNITS = {
    stickman: { one: 'stickman', many: 'stickmen', hp: 3, dmg: 1, speed: 190, cd: 0.7, range: 36 },
    ninja: { one: 'ninja', many: 'ninjas', hp: 2, dmg: 1.6, speed: 320, cd: 0.42, range: 36, gear: 'ninja' },
    knight: { one: 'knight', many: 'knights', hp: 7, dmg: 1.5, speed: 130, cd: 0.9, range: 46, gear: 'knight' },
    archer: { one: 'archer', many: 'archers', hp: 2, dmg: 1.2, speed: 160, cd: 1.3, range: 560, ranged: 'arrow', gear: 'archer' },
    wizard: { one: 'wizard', many: 'wizards', hp: 3, dmg: 2.4, speed: 140, cd: 1.6, range: 460, ranged: 'zap', gear: 'wizard' },
    giant: { one: 'giant', many: 'giants', hp: 420, dmg: 6, speed: 105, cd: 1.05, range: 190, scale: 3.2, cleave: 170 },
    zombie: { one: 'zombie', many: 'zombies', hp: 4, dmg: 1, speed: 140, cd: 0.8, range: 34, convert: true, color: '#57cc4d' },
  };
  S.battle = {
    duration: 31,
    build(s, p) {
      const r = s.rng;
      const T = [WI.UNITS[p.a], WI.UNITS[p.b]], N = [p.na, p.nb];
      const name = (i) => `${WI.fmt(N[i])} ${N[i] === 1 ? T[i].one : T[i].many}`;
      const total = N[0] + N[1];
      const zoom = total > 220 ? 0.42 : total > 120 ? 0.5 : 0.6;
      const fr = frameWide(s, zoom, 1380);
      const TC = ['#e63946', '#3a86ff'];
      s.groundTo(mix(s.groundBase, '#6b5b3e', 0.4), 0.01);
      const teams = [[], []];
      const half = W / 2 / zoom;
      for (let ti = 0; ti < 2; ti++) {
        const U = T[ti];
        for (let i = 0; i < N[ti]; i++) {
          const depth = r.range(0, 170);
          const side = ti === 0 ? -1 : 1;
          const x = fr.x + side * r.range(half * 0.25, half * 0.92);
          const f = new Fig(x, {
            team: ti, face: -side, mode: 'still', state: 'idle', scale: WI.FS * (U.scale || 1) * r.range(0.95, 1.05),
            color: U.color || TC[ti], gear: U.gear || null, hp: U.hp, U, cd: r.range(0, U.cd), retarget: 0, floor: GY + depth,
            eyes: U.convert ? '#ff2d2d' : null,
          });
          f.y = GY + depth;
          if (U.scale) f.y = f.floor = GY + 60 + depth * 0.3;
          s.figs.push(f);
          teams[ti].push(f);
        }
      }
      let fighting = false, firstBlood = false, winner = -1;
      const alive = (ti) => teams[ti].filter((f) => f.alive && !f.air).length + teams[ti].filter((f) => f.alive && f.air).length;
      s.counter('a', T[0].many.toUpperCase(), N[0], { color: TC[0] });
      s.counter('b', T[1].many.toUpperCase(), N[1], { color: '#7fb3ff' });
      s.music(0.35);

      function damage(t, dmg, from, kx) {
        if (!t.alive) return;
        t.hp -= dmg;
        s.burst('spark', t.x, t.y - 60 * t.scale, 6, 500);
        s.sfx('hit', 0.22);
        if (!firstBlood) {
          firstBlood = true;
          s.slowmo(0.3, 0.7, 0.1, 0.5);
          s.shake(0.4);
        }
        if (t.hp <= 0) {
          if (from.U.convert && !t.U.scale) {
            t.team = from.team;
            teams[1 - from.team].splice(teams[1 - from.team].indexOf(t), 1);
            teams[from.team].push(t);
            t.U = from.U;
            t.hp = from.U.hp;
            t.color = from.U.color;
            t.eyes = '#ff2d2d';
            t.gear = null;
            s.part('puff', t.x, t.y - 60, { c: '#80ed99', size: 40 });
            return;
          }
          t.alive = false;
          const big = t.U.scale ? 0.4 : 1;
          s.launch(t, kx * r.range(400, 1000) * big, -r.range(500, 1000) * big, { kill: 'now' });
          if (t.U.scale) {
            s.shake(0.8);
            s.sfx('boom', 0.7);
            s.slowmo(0.25, 1, 0.05, 0.6);
          }
        } else if (!t.U.scale) t.x += kx * 14;
      }
      function unitAI(f, dt) {
        if (!fighting) {
          f.state = 'idle';
          return;
        }
        const U = f.U;
        const foes = teams[1 - f.team];
        f.retarget -= dt;
        if (f.retarget <= 0 || !f.target || !f.target.alive || f.target.team === f.team) {
          f.target = nearest(f, foes)[0];
          f.retarget = 0.35 + r() * 0.2;
        }
        const tg = f.target;
        f.cd -= dt;
        f.atk = Math.max(0, f.atk - dt * 3);
        if (!tg) {
          f.state = 'cheer';
          f.phase += dt * 6;
          return;
        }
        const dx = tg.x - f.x, dy = tg.floor - f.floor;
        f.face = Math.sign(dx) || f.face;
        const reach = U.range + (tg.U.scale ? 30 * tg.U.scale : 0);
        if (Math.abs(dx) > reach) {
          const sp = U.speed * (U.scale ? 1 : r.range(0.9, 1.1));
          f.x += f.face * sp * dt;
          f.floor += clamp(dy, -60, 60) * dt * 0.8;
          f.y = f.floor;
          f.phase += sp * dt * 0.055 / (U.scale || 1);
          f.state = U.convert ? 'zombie' : 'run';
          return;
        }
        f.state = U.convert ? 'zombie' : 'attack';
        if (f.cd <= 0) {
          f.cd = U.cd * r.range(0.85, 1.15);
          f.atk = 1;
          if (U.ranged === 'arrow') {
            arrow(f, tg);
          } else if (U.ranged === 'zap') {
            zap(f, tg);
          } else if (U.cleave) {
            s.shake(0.25);
            s.sfx('thud', 0.8);
            for (const o of foes) if (o.alive && Math.abs(o.x - (f.x + f.face * U.range * 0.6)) < U.cleave) damage(o, U.dmg, f, f.face);
          } else damage(tg, U.dmg, f, f.face);
        }
      }
      function arrow(f, tg) {
        const sx = f.x, sy = f.y - 70, tx = tg.x + r.range(-20, 20), ty = tg.y - 60 * tg.scale;
        const dur = 0.5 + Math.abs(tx - sx) / 1400;
        let k = 0;
        s.sfx('whoosh', 0.25, false, 0.12);
        s.add({
          layer: 'front',
          update(dt) {
            k += dt / dur;
            if (k >= 1) {
              this.dead = true;
              if (tg.alive && Math.abs(tg.x - tx) < 50 + 30 * tg.scale) damage(tg, f.U.dmg, f, Math.sign(tx - sx));
            }
          },
          draw(g) {
            const x = lerp(sx, tx, k), y = lerp(sy, ty, k) - Math.sin(k * Math.PI) * 160;
            const x2 = lerp(sx, tx, k - 0.04), y2 = lerp(sy, ty, k - 0.04) - Math.sin((k - 0.04) * Math.PI) * 160;
            g.strokeStyle = '#3d2817';
            g.lineWidth = 4;
            g.beginPath();
            g.moveTo(x, y);
            g.lineTo(x + (x2 - x) * 1.6, y + (y2 - y) * 1.6);
            g.stroke();
          },
        });
      }
      function zap(f, tg) {
        const sx = f.x + f.face * 30, sy = f.y - 80, tx = tg.x, ty = tg.y - 60 * tg.scale;
        s.sfx('zap', 0.1);
        let a = 0.25;
        const pts = [];
        for (let i = 0; i <= 8; i++) pts.push([lerp(sx, tx, i / 8) + (i % 8 ? r.range(-24, 24) : 0), lerp(sy, ty, i / 8) + (i % 8 ? r.range(-24, 24) : 0)]);
        s.add({
          layer: 'front',
          update(dt) {
            a -= dt;
            if (a <= 0) this.dead = true;
          },
          draw(g) {
            g.globalCompositeOperation = 'lighter';
            g.strokeStyle = rgba('#b388ff', a * 4);
            g.lineWidth = 7;
            g.beginPath();
            pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
            g.stroke();
            g.globalCompositeOperation = 'source-over';
          },
        });
        s.part('glow', tx, ty, { c: '#b388ff', size: 80 });
        damage(tg, f.U.dmg, f, f.face);
      }
      for (const f of s.figs) f.ai = unitAI;

      s.at(2.5, () => s.say(`*${name(0)}* vs *${name(1)}*`));
      s.at(4.6, () => {
        s.say('Who *wins*?');
        s.sfx('heartbeat');
        const champ = (ti) => teams[ti].slice().sort((a, b) => Math.abs(a.x - fr.x) - Math.abs(b.x - fr.x))[0];
        const a = champ(0), b = champ(1);
        a.emo = b.emo = 'angry';
        s.closeup(a, 0.85, { r: 120 });
        s.at(5.45, () => {
          s.closeup(b, 0.85, { r: 120 });
          s.sfx('heartbeat');
        });
        s.at(6.4, () => (a.emo = b.emo = null));
      });
      s.at(6.4, () => {
        s.stamp('FIGHT!');
        s.caption = null;
        fighting = true;
        s.sfx('boom', 0.6);
        s.shake(0.4);
        s.music(0.9);
        s.sfx('growl', 1, 0.2);
      });
      s.onUpdate = (dt, t) => {
        s.figs.sort((a, b) => (a.floor || GY) - (b.floor || GY));
        s.setCount('a', alive(0));
        s.setCount('b', alive(1));
        if (fighting && winner < 0) {
          const a = alive(0), b = alive(1);
          if (a === 0 || b === 0 || t > 24.5) {
            winner = a === b ? -2 : a > b ? 0 : 1;
            declare();
          }
        }
      };
      function declare() {
        const t = s.t;
        s.music(0.4);
        s.sfx('boom', 0.5);
        if (winner === -2) s.say("It's a *DRAW*!");
        else {
          s.say(`*${T[winner].many.toUpperCase()}* WIN!`);
          for (const f of teams[winner]) if (f.alive) {
            f.ai = null;
            f.mode = 'still';
            f.state = 'cheer';
          }
          const left = teams[winner].filter((f) => f.alive).length;
          s.at(t + 1.6, () => s.say(`With *${left}* ${left === 1 ? 'fighter' : 'fighters'} left`));
        }
        s.duration = Math.min(s.duration, t + 6.5);
      }
    },
  };

  /* =============================================================== GRAVITY */
  S.gravity = {
    duration: 30,
    build(s, p) {
      const r = s.rng;
      s.crowd(22);
      const me = hero(s, 420);
      me.immune = false;
      const cars = [car(s, 200, 1), car(s, 700, -1), car(s, -200, 1), car(s, 1300, -1)];
      const mult = p.mult || 1;
      s.music(0.2);
      const label = p.kind === 'heavy' ? (mult === 2 ? '*doubled*' : `got *${mult}x stronger*`) : p.kind === 'off' ? `switched *off* for *${p.label}*` : `*reversed* for *${p.label}*`;
      s.at(2.5, () => s.say(`Gravity is about to get *weird*...`));
      if (p.kind !== 'heavy') {
        const secs = p.secs;
        s.at(4.6, () => {
          s.stamp('0:00');
          s.say(p.kind === 'off' ? 'Gravity: *OFF*' : 'Gravity: *REVERSED*');
          s.flash(0.7, '#cfe8ff');
          s.sfx('shimmer', false, 0.15);
          s.sfx('whoosh', 1.2, true, 0.4);
          s.music(0.6);
          s.grav = p.kind === 'off' ? 0 : -700;
          for (const f of s.figs) {
            s.launch(f, r.range(-60, 60), -r.range(60, 190), { av: r.range(-1.5, 1.5) });
            f.state = 'float';
            f.drag = 0;
          }
          for (const c of cars) {
            c.air = true;
            c.vy = -r.range(40, 120);
            c.av = r.range(-0.5, 0.5);
          }
          for (const pr of s.props) pr.tilt = r.range(-0.2, 0.2);
          s.counter('g', 'GRAVITY RETURNS IN', secs, { color: '#4cc9f0', fmt: (v) => (v >= 60 ? '1:00' : '0:' + String(Math.ceil(v)).padStart(2, '0')) });
          s.countTo('g', 0, 9.6, 'linear');
          s.camTo({ y: H / 2 - (p.kind === 'off' ? 520 : 1300), zoom: 0.85 }, 9.5, 'inOut');
          if (p.kind === 'reverse') {
            s.skyTo('#0a1030', '#4a6aa8', 9);
            s.to(s, 'stars', 0.8, 9);
          }
        });
        s.at(7.2, () => {
          s.say(p.kind === 'off' ? 'Everyone starts to *float*' : 'Everyone falls... *UP*');
          s.closeup(me, 1.8, { r: 115 });
        });
        s.at(10.5, () => s.say(p.kind === 'off' ? 'Anything not tied down *drifts away*' : 'Up here the air is *freezing*'));
        s.at(14.2, () => {
          s.clearCounters();
          s.stamp(secs >= 30 ? `${secs} SECONDS LATER` : 'GRAVITY IS BACK');
          s.say('What goes up... *must come down*');
          s.grav = 2400;
          s.sfx('whoosh', 1.0, false, 0.5);
          s.music(1);
          for (const f of s.figs) {
            f.state = 'air';
            f.av = r.range(-6, 6);
            f.drag = 0.2;
          }
          s.follow = () => {
            const air = s.figs.filter((f) => f.air);
            const y = air.length ? air.reduce((a, f) => a + f.y, 0) / air.length : GY - 540;
            return { x: W / 2, y: Math.min(H / 2, y - 100) };
          };
          s.skyTo(WI.ENVS[s.place.env].sky[0], WI.ENVS[s.place.env].sky[1], 2.5);
          s.to(s, 'stars', 0, 2);
        });
        s.at(18.5, () => {
          s.follow = null;
          s.camTo({ y: H / 2, zoom: 1, x: W / 2 }, 1);
        });
        s.at(20.5, () => {
          s.stamp('1 MINUTE LATER');
          const dead = s.figs.filter((f) => !f.alive).length;
          s.say(dead > 4 ? 'Not everyone *landed safely*' : 'Nobody will *trust gravity* again');
          s.music(0.35);
          calm(s);
        });
      } else {
        s.at(4.6, () => {
          s.stamp('0:00');
          s.say(`Gravity just ${label}`);
          s.flash(0.6, '#ffb3b3');
          s.sfx('boom', 0.8);
          s.shake(0.8);
          s.music(0.7);
          s.grav = 2400 * mult;
          s.counter('w', 'YOUR WEIGHT', 70, { color: '#ffd60a', fmt: (v) => WI.fmt(v) + ' KG' });
          s.countTo('w', 70 * mult, 1.2);
          for (const f of s.figs) {
            s.to(f, 'squash', mult >= 10 ? 0.55 : 0.85, 0.5, 'out');
            f.speed *= mult >= 10 ? 0.15 : 0.55;
            if (mult >= 10) {
              f.mode = 'still';
              f.state = 'sit';
              s.at(5.6 + r() * 2, () => {
                f.state = 'dead';
                f.lieDir = r.sign();
              });
            }
          }
          for (const c of cars) {
            c.vx *= 0.2;
            if (mult >= 10) c.squish = true;
          }
        });
        s.at(8, () => {
          s.say(mult >= 10 ? "You *can't even stand up*" : 'Every step feels like *climbing stairs*');
          me.emo = 'scared';
          s.closeup(me, 1.8, { r: 110 });
        });
        s.at(11.5, () => {
          s.say(mult >= 10 ? "Buildings *can't hold their own weight*" : 'Planes *fall out of the sky*');
          const pl = jet(s, -200, GY - 1100, 700, { size: 1.6 });
          s.at(12.5, () => {
            pl.falling = true;
            s.sfx('whoosh', 1.5, false, 0.4);
          });
          if (mult >= 10) for (const b of s.buildings) s.collapse(b, r.range(0, 5), r.sign());
          else s.collapse(s.buildings.filter((b) => b.state === 'ok').sort((a, b) => b.h - a.h)[0], 2.5);
          s.music(1);
        });
        s.at(17, () => {
          s.stamp('1 HOUR LATER');
          s.say(mult >= 10 ? 'The atmosphere *crushes down*' : 'Trees *snap* under their own weight');
          for (const pr of s.props) pr.tilt = r.sign() * 1.4;
          s.skyTo('#5a6c80', '#c5ccd3', 3);
        });
        s.at(22, () => {
          s.stamp('1 YEAR LATER');
          s.say(mult >= 10 ? 'Earth is *flattened*' : 'Humans evolve to be *short and strong*');
          s.music(0.3);
        });
      }
    },
  };

  /* ================================================================== SPIN */
  S.spin = {
    duration: 30,
    build(s, p) {
      const r = s.rng;
      s.crowd(24);
      const me = hero(s, W / 2 - 200);
      const cars = [car(s, 100, 1), car(s, 900, -1)];
      s.music(0.2);
      const dir = p.kind === 'reverse' ? -1 : 1;
      s.at(2.5, () => s.say('Earth spins at *1,000 mph*'));
      s.at(5.0, () => {
        s.say(p.kind === 'stop' ? 'What if it *suddenly stopped*?' : p.kind === 'reverse' ? 'What if it *spun backwards*?' : `What if it spun *${p.x}x faster*?`);
        s.sfx('riser', 2);
        me.mode = 'still';
        me.state = 'lookup';
        s.closeup(me, 1.7, { r: 120 });
        s.music(0.5);
      });
      if (p.kind === 'stop' || p.kind === 'reverse') {
        let wind = 0;
        s.at(7.0, () => {
          s.stamp('0:00');
          s.flash(1);
          s.shake(1.2);
          s.sfx('boom', 1.4);
          s.sfx('rumble', 6, 0.6);
          s.music(1);
          wind = 1;
          s.counter('w', 'WIND SPEED', 1000, { color: '#ff6b6b', fmt: (v) => WI.fmt(v) + ' MPH' });
          for (const f of s.figs) s.launch(f, dir * r.range(1600, 2600), -r.range(300, 900), { kill: !f.hero, av: r.range(4, 12) * dir });
          me.dieOnLand = false;
          for (const c of cars) {
            c.air = true;
            c.vx = dir * 2200;
            c.vy = -400;
            c.av = dir * 3;
          }
          for (const b of s.buildings) s.collapse(b, r.range(0, 1.4), dir, 2200);
          for (const pr of s.props) pr.tilt = dir * 1.2;
          s.camTo({ rot: -dir * 0.06 }, 1, 'out');
          s.impactT = 0;
          s.zblur = 1.2;
        });
        s.onUpdate = (dt) => {
          if (wind > 0) {
            for (let i = 0; i < 6 * wind; i++) s.part('streak', s.cam.x - dir * 900, s.cam.y + r.range(-900, 700), { vx: dir * r.range(2500, 4000), vy: r.range(-60, 60), life: 0.6 });
            if (r() < 0.5) s.part('dust', s.cam.x - dir * 700, GY - r.range(0, 400), { vx: dir * 2000, size: 80 });
            if (r() < 0.3) s.part('debris', s.cam.x - dir * 700, GY - r.range(0, 600), { vx: dir * r.range(1500, 2600), vy: -r.range(0, 300), g: 300 });
          }
        };
        s.at(10, () => s.say('Everything flies *east* at *1,000 mph*'.replace('east', dir > 0 ? 'east' : 'west')));
        s.at(13.5, () => {
          s.stamp('1 HOUR LATER');
          s.say('Oceans *rush* toward the poles');
          wind = 0.25;
          s.countTo('w', 120, 2);
          s.camTo({ rot: 0 }, 2);
          s.skyTo('#2c2f45', '#c7845a', 3);
        });
        s.at(18.5, () => {
          s.stamp('1 YEAR LATER');
          wind = 0;
          s.clearCounters();
          s.say(p.kind === 'stop' ? 'One day now lasts *a whole year*' : 'The Sun now rises in the *west*');
          s.sun.y = 1150;
          s.skyTo('#3a1c3c', '#ff9b54', 3);
          me.mode = 'still';
          me.state = 'lookup';
          me.face = 1;
          me.lie = 0;
          me.emo = 'sad';
          s.closeup(me, 2.2, { r: 110, push: 0.2 });
        });
        s.at(23, () => {
          s.say('Half the planet *bakes*. The other half *freezes*.');
          s.music(0.3);
        });
      } else {
        let spin = 0, ang = 0;
        const fast = p.x >= 10;
        s.at(7.0, () => {
          s.stamp('0:00');
          s.sfx('whoosh', 1.5, true, 0.5);
          s.music(0.8);
          s.anim(5, (k) => (spin = k * (fast ? 2.6 : 1.1)), 'in');
          s.counter('d', 'ONE DAY LASTS', 24, { color: '#ffd60a', fmt: (v) => (v < 2 ? Math.round(v * 60) + ' MIN' : v.toFixed(v < 10 ? 1 : 0) + ' HRS') });
          s.countTo('d', 24 / p.x, 4);
        });
        const daySky = WI.ENVS[s.place.env].sky;
        s.onUpdate = (dt) => {
          if (!spin) return;
          ang += dt * spin * 2.2;
          const day = (Math.cos(ang) + 1) / 2;
          s.sky.top = mix('#05070f', daySky[0], day);
          s.sky.bot = mix('#1a2140', daySky[1], day);
          s.sun.x = W / 2 + Math.sin(ang) * 620;
          s.sun.y = 1200 - Math.cos(ang) * 800;
          s.stars = 1 - day;
          s.lights = 1 - day;
          for (let i = 0; i < spin * 3; i++) s.part('streak', s.cam.x - 900, r.range(200, GY), { vx: r.range(1500, 2500), life: 0.6, a: 0.3 });
          if (fast && s.t > 10 && s.grav > 0) s.grav = Math.max(0, s.grav - dt * 600);
        };
        s.at(10, () => {
          s.say(fast ? '...you would become *weightless*' : 'Days last only *12 hours*');
          if (fast)
            for (const f of s.figs) {
              s.launch(f, r.range(-40, 40), -r.range(40, 140), { av: r.range(-1, 1) });
              f.state = 'float';
              f.drag = 0;
              f.dieOnLand = false;
            }
          if (fast) s.camTo({ y: H / 2 - 500, zoom: 0.85 }, 8);
        });
        s.at(14.5, () => {
          s.stamp(fast ? '1 HOUR LATER' : '1 WEEK LATER');
          s.say(fast ? 'People at the equator *float into space*' : 'Hurricanes get *much stronger*');
          s.music(1);
        });
        s.at(20, () => {
          s.stamp('1 YEAR LATER');
          s.say(fast ? 'Earth starts to *tear itself apart*' : 'Your body clock is *broken*');
          if (fast) {
            s.shake(0.8);
            s.sfx('rumble', 4, 0.6);
            for (const b of s.buildings) s.collapse(b, r.range(0, 3), r.sign());
          }
          s.music(0.4);
        });
      }
    },
  };

  /* =================================================================== SUN */
  S.sun = {
    duration: 30,
    build(s, p) {
      const r = s.rng;
      s.crowd(22);
      const me = hero(s, 330);
      s.sun.x = 760;
      s.sun.y = 520;
      s.sun.r = 70;
      s.music(0.2);
      const temp = (o) => s.counter('c', 'TEMPERATURE', 15, { color: '#ffd60a', fmt: (v) => Math.round(v) + '°C', ...o });
      if (p.kind === 'vanish' || p.kind === 'blackhole') {
        s.at(2.5, () => s.say(p.kind === 'vanish' ? 'The Sun just *vanished*' : 'The Sun just turned into a *black hole*'));
        s.at(5.0, () => {
          s.say('But nobody *notices*...');
          s.counter('l', 'LAST LIGHT ARRIVES IN', 500, { color: '#ffd60a', fmt: (v) => Math.floor(v / 60) + ':' + String(Math.floor(v % 60)).padStart(2, '0') });
          s.countTo('l', 0, 6, 'inOut');
          s.music(0.45);
          s.every(0.5, 5, 11, () => s.sfx('tick', 0.15));
        });
        s.at(8, () => s.say('Light takes *8 minutes 20 seconds* to reach us'));
        s.at(11.1, () => {
          s.clearCounters();
          s.to(s.sun, 'a', 0, 0.3);
          s.skyTo('#020309', '#0a0f22', 0.6);
          s.to(s, 'stars', 1, 1);
          s.to(s, 'lights', 1, 0.8, 'inOut', 0.4);
          s.sfx('shimmer', true, 0.18);
          s.sfx('boom', 0.5);
          s.say('Then... *darkness*');
          lookAt(s, s.sun.x);
          me.mode = 'still';
          me.state = 'lookup';
          me.face = 1;
          s.closeup(me, 2.2, { r: 125, push: 0.2 });
          s.music(0.7);
          if (p.kind === 'blackhole')
            s.add({
              layer: 'sky',
              draw(g, s) {
                const x = s.sun.x, y = s.sun.y;
                g.strokeStyle = 'rgba(255,190,120,0.55)';
                g.lineWidth = 4;
                g.beginPath();
                g.ellipse(x, y, 60, 14, -0.3, 0, TAU);
                g.stroke();
                g.fillStyle = '#000000';
                g.beginPath();
                g.arc(x, y, 18, 0, TAU);
                g.fill();
              },
            });
        });
        s.at(14.5, () => {
          s.stamp('1 WEEK LATER');
          s.say(p.kind === 'blackhole' ? 'Earth keeps *orbiting*... in the dark' : 'Temperatures *crash*');
          temp();
          s.countTo('c', -17, 3);
          s.tintTo('#7fb2ff', 0.2, 2);
          s.groundTo('#c9d6e3', 3);
          me.emo = 'sad';
          s.at(17.4, () => s.closeup(me, 1.8, { r: 110 }));
          s.snow = 30;
          campfire(s, W / 2);
          let i = 0;
          for (const f of s.figs) {
            if (!f.alive) continue;
            const side = i++ % 2 ? 1 : -1;
            f.mode = 'goto';
            f.tx = W / 2 + side * r.range(60, 260);
            f.arrive = 'sit';
            f.gotoState = 'walk';
            f.gotoSpeed = 120;
            s.at(s.t + 3, () => (f.face = -side));
          }
        });
        s.at(19.5, () => {
          s.stamp('1 YEAR LATER');
          s.countTo('c', -73, 3);
          s.say('The oceans *freeze over*');
          s.to(s, 'lights', 0, 1);
          s.snow = 70;
          s.music(0.9);
        });
        s.at(24, () => s.say('Life survives only near *deep-sea volcanoes*'));
      } else if (p.kind === 'double') {
        s.at(2.5, () => s.say('The Sun just *doubled in size*'));
        s.at(5.0, () => {
          s.to(s.sun, 'r', 150, 3);
          s.skyTo('#ffb347', '#fff1c1', 3);
          s.tintTo('#ff8c1a', 0.15, 3);
          temp();
          s.countTo('c', 48, 6);
          s.say('That\'s *8 times* more volume');
          s.music(0.5);
          s.sfx('riser', 3);
        });
        s.at(9, () => {
          s.say('Temperatures *skyrocket*');
          s.danger = { x: s.sun.x };
          for (const f of s.figs) if (f.alive) {
            f.mode = 'goto';
            f.tx = r.range(-100, 300);
            f.gotoState = 'run';
            f.arrive = 'sit';
          }
        });
        s.onUpdate = (dt) => {
          if (s.t > 9 && r() < dt * 20) s.part('ember', r.range(0, W), GY - r.range(0, 100), { vy: -r.range(40, 120) });
          if (s.t > 14 && r() < dt * 12) s.part('smoke', r.range(0, W), GY, { c: '#ffffff', a: 0.25, vy: -r.range(60, 160), size: 70 });
          if (s.snow) weather(s, 'snow', s.snow, dt);
        };
        s.at(14, () => {
          s.stamp('1 WEEK LATER');
          s.countTo('c', 95, 4);
          s.say('Oceans begin to *evaporate*');
          s.groundTo('#7a5a3a', 3);
          for (const pr of s.props) pr.dry = true;
          s.music(0.85);
        });
        s.at(19.5, () => {
          s.stamp('1 YEAR LATER');
          s.countTo('c', 300, 4);
          s.say('Earth becomes *another Venus*');
          s.skyTo('#7a3b10', '#e0a25a', 3);
          s.tintTo('#ff6a00', 0.25, 3);
          for (const f of s.figs) s.to(f, 'alpha', 0, 2, 'inOut', r() * 2);
        });
        s.at(24, () => s.say('Humans would have to *leave Earth*'));
      } else {
        s.at(2.5, () => s.say("The Sun *can't* actually go supernova..."));
        s.at(5.0, () => {
          s.say('*But what if it did?*');
          me.mode = 'still';
          me.state = 'lookup';
          me.face = 1;
          s.closeup(me, 1.8, { r: 120 });
          s.music(0.5);
          s.sfx('rumble', 4, 0.4);
          s.anim(5, (k) => {
            s.sun.r = 70 + k * 40 + Math.sin(s.t * 20) * 6 * k;
            s.sun.c = mix('#fff4c8', '#cfe6ff', k);
          });
          s.counter('l', 'LIGHT ARRIVES IN', 500, { color: '#ffd60a', fmt: (v) => Math.floor(v / 60) + ':' + String(Math.floor(v % 60)).padStart(2, '0') });
          s.countTo('l', 0, 7, 'inOut');
          lookAt(s, s.sun.x);
        });
        s.at(8.5, () => {
          s.say('You\'d have *8 minutes* left');
          s.sfx('riser', 3.6, 0.4);
          s.music(0.8);
          s.every(0.5, 8.5, 12, () => s.sfx('heartbeat'));
        });
        s.at(12.2, () => {
          s.clearCounters();
          s.flash(1, '#ffffff');
          s.to(s.sun, 'r', 1500, 1.6, 'in');
          s.skyTo('#ffffff', '#fff2c4', 0.4);
          s.sfx('boom', 1.5);
          s.shake(1.2);
          s.music(1);
          s.say('*BOOM*');
          for (const f of s.figs) s.launch(f, -r.range(1500, 2600), -r.range(300, 900), { kill: true });
          for (const b of s.buildings) s.collapse(b, r.range(0, 0.6), -1, 2000);
          for (const pr of s.props) pr.tilt = -1.2;
          s.wind = 1;
          s.impactT = 0;
          s.zblur = 1.2;
          s.zfocus = s.toScreen(s.sun.x, s.sun.y);
        });
        s.onUpdate = (dt) => {
          if (s.wind) for (let i = 0; i < 8; i++) s.part('fire', W + 200, r.range(0, GY), { vx: -r.range(2000, 3500), size: r.range(40, 90), life: 1 });
        };
        s.at(16, () => {
          s.wind = 0;
          s.stamp('1 SECOND LATER');
          s.say('Earth is *vaporized*');
          s.clouds = [];
          s.skyTo('#14020a', '#5a0a0a', 1.5);
          s.groundTo('#1a0505', 1.5);
          s.tintTo('#ff3300', 0.2, 1);
          s.to(s.sun, 'a', 0, 2);
          s.to(s, 'stars', 0.6, 3);
        });
        s.at(21, () => {
          s.stamp('1,000 YEARS LATER');
          s.say('A beautiful *nebula* remains');
          s.tintTo('#000000', 0, 2);
          s.skyTo('#05020f', '#120a2a', 2);
          s.groundTo('#05020f', 2);
          s.music(0.3);
          s.add({
            layer: 'sky', a: 0,
            update(dt) {
              this.a = Math.min(1, this.a + dt * 0.4);
            },
            draw(g, s) {
              g.globalCompositeOperation = 'lighter';
              const R = WI.RNG(3);
              for (let i = 0; i < 26; i++) {
                const x = W / 2 + R.range(-450, 450) + Math.sin(s.t * 0.3 + i) * 20, y = 900 + R.range(-500, 400), sz = R.range(200, 460);
                g.globalAlpha = this.a * 0.35;
                g.drawImage(WI.soft(R.pick(['#ff4d8d', '#7b5cff', '#3dd6d0', '#ff9a3d'])), x - sz, y - sz, sz * 2, sz * 2);
              }
              g.globalAlpha = 1;
              g.globalCompositeOperation = 'source-over';
            },
          });
        });
      }
      const prevUpdate = s.onUpdate;
      s.onUpdate = (dt, t) => {
        if (prevUpdate) prevUpdate(dt, t);
        if (s.snow && p.kind !== 'double') weather(s, 'snow', s.snow, dt);
      };
    },
  };

  /* ============================================================ BLACK HOLE */
  S.blackhole = {
    duration: 30,
    build(s, p) {
      const r = s.rng;
      s.crowd(26);
      const me = hero(s, 300);
      s.music(0.2);
      const bx = W / 2, by = GY - 420;
      let pull = 0, coreR = 0, appear = false;
      const hole = s.add({
        layer: 'front', spin: 0,
        update(dt, s) {
          this.spin += dt * 2;
          if (!appear || pull <= 0) return;
          for (const f of s.figs) {
            if (!f.visible || f.immune) continue;
            const dx = bx - f.x, dy = by - (f.y - 50), d = Math.hypot(dx, dy);
            const a = (pull * 9e6) / Math.max(d * d, 4000) + pull * 40;
            if (!f.air && a > 900) {
              s.launch(f, 0, -200, { kill: 'now' });
              f.drag = 0.4;
            }
            if (f.air) {
              f.vx += (dx / d) * a * dt;
              f.vy += (dy / d) * a * dt - s.grav * dt * 0.9;
              f.vx += (-dy / d) * a * 0.25 * dt;
              f.vy += (dx / d) * a * 0.25 * dt;
              if (d < coreR + 30) {
                f.visible = false;
                s.burst('spark', bx, by, 6, 400);
                s.sfx('zap', 0.08);
              }
            }
          }
          for (const b of s.buildings) {
            if (b.state === 'gone') continue;
            const d = Math.abs(b.x - bx);
            const k = (pull * 600) / Math.max(d, 200);
            if (b.state === 'ok') {
              b.tilt = clamp(Math.sign(bx - b.x) * k * 0.08, -0.35, 0.35);
              if (k > 3) s.collapse(b, 0, Math.sign(bx - b.x), 350);
            }
            if (b.state === 'fall' && r() < dt * 12) {
              s.part('debris', b.x + r.range(-b.w / 2, b.w / 2), GY - r.range(0, b.h - b.sink), { g: 0, pull: true, size: r.range(8, 22), c: s.bldColor, life: 4 });
            }
          }
          for (const c of s.chunks) {
            const dx = bx - c.x, dy = by - c.y, d = Math.hypot(dx, dy) + 1;
            const a = (pull * 9e6) / Math.max(d * d, 4000) + pull * 60;
            c.rest = false;
            c.vx += ((dx / d) * a + (-dy / d) * a * 0.3) * dt;
            c.vy += ((dy / d) * a + (dx / d) * a * 0.3) * dt - s.grav * dt * 0.95;
            c.va += dt * 2;
            if (d < coreR + 30) c.gone = true;
          }
          for (const pt of s.parts) {
            if (!pt.pull) continue;
            const dx = bx - pt.x, dy = by - pt.y, d = Math.hypot(dx, dy) + 1;
            const a = (pull * 9e6) / Math.max(d * d, 4000) + pull * 60;
            pt.vx += ((dx / d) * a + (-dy / d) * a * 0.4) * dt;
            pt.vy += ((dy / d) * a + (dx / d) * a * 0.4) * dt;
            if (d < coreR + 10) pt.age = pt.life;
          }
          if (r() < dt * 30 * pull) {
            const a = r() * TAU, d = r.range(500, 900);
            s.part('dust', bx + Math.cos(a) * d, by + Math.sin(a) * d, { pull: true, size: 50, c: '#6b5b4b', life: 3, drag: 0 });
          }
        },
        glow(g) {
          if (!appear) return;
          const R = Math.max(coreR, 4);
          g.globalAlpha = Math.min(1, R / 30);
          g.drawImage(WI.soft('#ff9a3d'), bx - R * 3, by - R * 3, R * 6, R * 6);
        },
        draw(g, s) {
          if (!appear) return;
          g.save();
          g.translate(bx, by);
          const R = coreR;
          g.globalCompositeOperation = 'lighter';
          g.globalAlpha = Math.min(1, R / 40);
          g.drawImage(WI.soft('#ff9a3d'), -R * 6, -R * 6, R * 12, R * 12);
          for (let i = 0; i < 40; i++) {
            const a = this.spin * (1 + (i % 5) * 0.2) + i * 0.7, rr = R * (1.6 + (i % 7) * 0.25);
            g.drawImage(WI.soft(i % 2 ? '#ffd27a' : '#ff6a2a'), Math.cos(a) * rr - R * 0.5, Math.sin(a) * rr * 0.28 - R * 0.5, R, R);
          }
          g.globalAlpha = 1;
          g.globalCompositeOperation = 'source-over';
          g.fillStyle = '#000000';
          g.beginPath();
          g.arc(0, 0, R, 0, TAU);
          g.fill();
          g.strokeStyle = 'rgba(255,240,220,0.8)';
          g.lineWidth = Math.max(2, R * 0.08);
          g.beginPath();
          g.arc(0, 0, R * 1.12, 0, TAU);
          g.stroke();
          g.restore();
        },
      });
      s.at(2.5, () => s.say(`A black hole appears in *${P(s)}*`));
      s.at(4.5, () => {
        appear = true;
        s.flash(0.5, '#ffd9b3');
        s.sfx('shimmer', true, 0.2);
        s.sfx('boom', 0.4);
        s.anim(1.2, (k) => (coreR = k * (p.kind === 'car' ? 8 : 22)), 'outBack');
        lookAt(s, bx);
        me.mode = 'still';
        me.state = 'lookup';
        me.face = 1;
        s.at(5.6, () => s.closeup(me, 1.6, { r: 120 }));
        s.music(0.45);
      });
      if (p.kind === 'car') {
        s.at(6.5, () => s.say('It has the mass of *a car*'));
        s.at(9.5, () => {
          s.say("It's so small it *evaporates*...");
          s.sfx('riser', 2.5, 0.4);
          s.anim(2.5, (k) => (coreR = 8 + Math.sin(s.t * 40) * 3 * k));
          s.music(0.8);
        });
        s.at(12.2, () => {
          appear = false;
          s.flash(1);
          s.explode(bx, by, 2.6, { flash: '#ffffff' });
          for (const b of s.buildings) s.collapse(b, Math.abs(b.x - bx) / 2400, Math.sign(b.x - bx) || 1, 1800);
          for (const f of s.figs) if (!f.air) s.launch(f, Math.sign(f.x - bx || 1) * r.range(1400, 2400), -r.range(800, 1500), { kill: true });
          fireball(s, bx, by, 520, 5);
          s.skyTo('#2a0b08', '#ff6a2a', 1);
          s.tintTo('#ff5a1f', 0.2, 1);
          s.music(1);
          s.say('*E = mc²*');
        });
        s.at(15.6, () => {
          s.stamp('1 SECOND LATER');
          s.say('Over *a million* Hiroshimas of energy');
        });
        s.at(20.5, () => {
          s.stamp('1 YEAR LATER');
          s.say(`*${P(s)}* is just a crater`);
          s.skyTo('#3b4048', '#9a9fa6', 2.5);
          s.tintTo('#000000', 0, 2);
          s.snow = 40;
        });
        s.onUpdate = (dt) => s.snow && weather(s, 'ash', s.snow, dt);
      } else {
        const earth = p.kind === 'earth';
        s.at(6.5, () => s.say(earth ? 'Only *2 cm* wide... with the mass of *Earth*' : 'Smaller than *a grain of sand*... with the mass of *the Moon*'));
        s.at(9.5, () => {
          s.say('Its pull is *unstoppable*');
          s.anim(5, (k) => (pull = k * (earth ? 1.2 : 0.7)), 'in');
          s.sfx('rumble', 8, 0.6);
          s.music(0.8);
          me.immune = false;
          flee(s, bx);
        });
        s.onUpdate = (dt) => {
          if (pull > 0.2) s.shake(dt * pull * 0.8);
        };
        s.at(14.5, () => {
          s.stamp('10 SECONDS LATER');
          s.say(`*${P(s)}* is being *swallowed*`);
          s.anim(4, (k) => (coreR = 22 + k * (earth ? 120 : 60)));
          s.music(1);
        });
        s.at(19.5, () => {
          s.stamp(earth ? '1 MINUTE LATER' : '1 HOUR LATER');
          s.say(earth ? 'The whole planet *falls in*' : "Earth's crust *caves in*");
          s.camTo({ zoom: 1.6, rot: 0.6, x: bx, y: by }, 5, 'in');
          s.skyTo('#05020a', '#2a0d1a', 3);
          s.to(s, 'stars', 1, 3);
          s.groundTo('#05020a', 3);
          if (earth) s.anim(4, (k) => (coreR = 140 + k * 260), 'in');
        });
        s.at(23.4, () => {
          s.flash(1, '#ffffff');
          s.sfx('boom', 1.2);
          pull = 0;
          s.cam.zoom = 1;
          s.cam.rot = 0;
          s.cam.x = W / 2;
          s.cam.y = H / 2;
          for (const b of s.buildings) b.state = 'gone';
          for (const pr of s.props) pr.gone = true;
          for (const f of s.figs) f.visible = false;
          s.parts.length = 0;
          s.chunks.length = 0;
          s.clouds = [];
          s.sky.top = '#020208';
          s.sky.bot = '#07071a';
          s.groundBase = '#020208';
          s.stars = 1;
          s.sun.a = 0;
          s.anim(1.5, (k) => (coreR = lerp(earth ? 400 : 120, earth ? 7 : 30, k)), 'out');
          s.say(earth ? 'Earth is now *2 centimeters* wide' : 'Nothing *escapes*. Not even light.');
        });
      }
    },
  };

  /* ================================================================ VANISH */
  S.vanish = {
    duration: 30,
    build(s, p) {
      const r = s.rng;
      const crowd = s.crowd(26);
      const heroes = [];
      if (p.kind !== 'all') heroes.push(hero(s, W / 2 - 120));
      if (p.kind === 'friend') heroes.push(hero(s, W / 2 + 80, { color: '#ffd60a' }));
      const cars = [car(s, -100, 1), car(s, 600, 1, { wrap: true }), car(s, 1100, -1)];
      const plane = jet(s, -300, GY - 1200, 420, { size: 2, color: '#e6e9ee' });
      s.music(0.2);
      const freeze = p.kind === 'freeze';
      s.at(2.5, () => s.say(`A normal busy day in *${P(s)}*...`));
      s.at(5.0, () => {
        s.flash(0.8, freeze ? '#cfe2ff' : '#ffffff');
        s.sfx('shimmer', true, 0.2);
        s.sfx('boom', 0.3);
        s.music(0.45);
        if (freeze) {
          for (const f of crowd) {
            f.ai = () => {};
            f.frozenPose = true;
          }
          for (const c of cars) c.frozen = true;
          plane.frozen = true;
          s.tintTo('#3a6fd8', 0.32, 0.6);
          s.say('Time just *stopped*. For everyone *but you*.');
        } else {
          for (const f of crowd) {
            f.visible = false;
            s.part('puff', f.x, f.y - 60, { size: 50 });
          }
          for (const c of cars) {
            c.wrap = false;
            c.driverless = true;
          }
          s.say(p.kind === 'all' ? 'Every human on Earth *vanished*' : p.kind === 'friend' ? 'Everyone is gone. Except *you two*.' : 'Everyone is *gone*. Except *you*.');
          s.at(7.5, () => {
            plane.falling = true;
            plane.big = 1.4;
          });
        }
        for (const h of heroes) {
          h.mode = 'still';
          h.state = 'lookup';
          s.every(0.8, 5.5, 9, () => (h.face = -h.face));
        }
        if (heroes.length) s.at(6.4, () => s.closeup(heroes[0], 2, { r: 120 }));
      });
      s.onUpdate = (dt) => {
        if (!freeze) {
          for (let i = 0; i < cars.length; i++)
            for (let j = i + 1; j < cars.length; j++) {
              const a = cars[i], b = cars[j];
              if (!a.wreck && !b.wreck && a.driverless && Math.abs(a.x - b.x) < 120 && !a.air && !b.air) {
                a.wreck = b.wreck = true;
                s.explode((a.x + b.x) / 2, GY - 40, 0.6, { buildings: false, kill: false });
              }
            }
          for (const c of cars) if (c.driverless && !c.wreck && (c.x < s.bx0 - 100 || c.x > s.bx1 + 100)) c.dead = true;
        }
        if (s.smokes) for (const x of s.smokes) if (r() < dt * 8) s.part('smoke', x, GY - 30, { vy: -r.range(80, 160), size: 70, c: '#2b2b2e', life: 5 });
      };
      if (freeze) {
        s.at(8.5, () => {
          s.say('Nobody can *see* you. Nobody can *stop* you.');
          heroes[0].mode = 'wander';
          s.music(0.6);
        });
        s.at(12.5, () => {
          s.stamp('1 MONTH LATER');
          s.say('You can go *anywhere*. Take *anything*.');
          heroes[0].state = 'cheer';
          heroes[0].mode = 'still';
        });
        s.at(16.5, () => {
          s.stamp('10 YEARS LATER');
          s.say("You get older. *They don't.*");
          heroes[0].mode = 'still';
          heroes[0].state = 'sit';
          s.music(0.3);
          s.to(heroes[0], 'squash', 0.93, 3);
          heroes[0].color = '#d98b8b';
        });
        s.at(21, () => {
          s.say('You feel completely *alone*');
          heroes[0].emo = 'sad';
          s.closeup(heroes[0], 3.3, { r: 120, push: 0.3 });
          s.sfx('heartbeat');
        });
        s.at(24.5, () => {
          s.stamp('THEN...');
          s.say('Time *starts again*');
          s.flash(0.8, '#ffffff');
          s.tintTo('#000000', 0, 0.3);
          for (const f of crowd) {
            f.ai = null;
            f.mode = 'wander';
          }
          for (const c of cars) c.frozen = false;
          plane.frozen = false;
          s.music(0.7);
        });
      } else {
        s.at(9.5, () => {
          s.stamp('1 HOUR LATER');
          s.say('Cars crash. Planes *fall from the sky*.');
          s.smokes = [r.range(100, 400), r.range(600, 1000)];
          s.music(0.6);
        });
        s.at(13.5, () => {
          s.stamp('1 WEEK LATER');
          s.say('The power grid *shuts down*');
          s.skyTo('#05070f', '#1a2140', 1.2);
          s.lights = 1;
          s.to(s, 'stars', 1, 1);
          s.at(15.5, () => {
            s.lights = 0;
            s.sfx('zap', 0.2);
            s.sfx('boom', 0.25);
          });
          if (heroes.length) campfire(s, heroes[0].x + 70);
          for (const h of heroes) {
            h.state = 'sit';
            h.emo = 'sad';
          }
          if (heroes.length) s.at(16.3, () => s.closeup(heroes[0], 1.8, { r: 110 }));
        });
        s.at(18.5, () => {
          s.stamp('1 YEAR LATER');
          s.say('Nature *takes back* the city');
          s.smokes = null;
          s.skyTo(WI.ENVS[s.place.env].sky[0], WI.ENVS[s.place.env].sky[1], 1.5);
          s.to(s, 'stars', 0, 1);
          s.music(0.4);
          for (const b of s.buildings) b.vine = 0;
          s.anim(8, (k) => {
            for (const b of s.buildings) b.vine = k;
          });
          for (let i = 0; i < 8; i++) s.props.push({ x: r.range(-300, W + 300), y: GY, s: 0.01, grow: r.range(0.8, 1.4) });
          s.anim(9, (k) => {
            for (const pr of s.props) if (pr.grow) pr.s = pr.grow * k;
          });
        });
        s.at(23.5, () => {
          s.stamp('100 YEARS LATER');
          s.say('Only *nature* remains');
          for (const b of s.buildings) s.collapse(b, r.range(0, 3), r.sign());
          for (const h of heroes) s.to(h, 'alpha', 0, 2);
        });
        s.add({
          layer: 'bld',
          draw(g, s) {
            g.strokeStyle = '#3f8f3a';
            g.lineWidth = 7;
            for (const b of s.buildings) {
              if (!b.vine || b.state === 'gone') continue;
              const R = WI.RNG(b.seed || 9);
              for (let i = 0; i < 4; i++) {
                const x = b.x - b.w / 2 + R() * b.w, h = (b.h - b.sink) * b.vine * R.range(0.3, 0.9);
                g.beginPath();
                g.moveTo(x, GY);
                for (let y = 0; y < h; y += 20) g.lineTo(x + Math.sin(y * 0.05 + i) * 10, GY - y);
                g.stroke();
              }
            }
          },
        });
      }
    },
  };

  /* ================================================================= FLOOD */
  WI.LIQUIDS = {
    water: { name: 'water', color: '#1d5fa8', top: '#5fb4ff', glow: false },
    lava: { name: 'lava', color: '#8a1a00', top: '#ff7b1f', glow: true },
    slime: { name: 'toxic slime', color: '#2f7a1a', top: '#9cff57', glow: false },
  };
  WI.LEVELS = { '10': { label: '10 meters', px: 150 }, '100': { label: '100 meters', px: 820 }, '1000': { label: '1 kilometer', px: 2600 } };
  S.flood = {
    duration: 30,
    build(s, p) {
      const r = s.rng, L = WI.LIQUIDS[p.liquid], LV = WI.LEVELS[p.level];
      s.crowd(28);
      const me = hero(s, W / 2);
      const liq = liquid(s, { level: GY + 60, color: L.color, top: L.top, hot: L.glow });
      s.music(0.2);
      const maxM = parseInt(p.level, 10);
      s.at(2.5, () => s.say(`*${P(s)}* on a sunny day...`));
      s.at(4.8, () => {
        s.stamp('0:00');
        s.say(p.liquid === 'water' ? 'Then the sea starts to *rise*' : `Then *${L.name}* starts pouring in`);
        s.counter('m', p.liquid === 'water' ? 'SEA LEVEL' : `${L.name.toUpperCase()} LEVEL`, 0, { color: L.top, fmt: (v) => '+' + Math.round(v) + ' M' });
        s.sfx('rumble', 4, 0.5);
        s.sfx('splash', 0.4);
        s.music(0.5);
        s.anim(16, (k) => {
          liq.level = GY + 60 - (LV.px + 60) * k;
          const c = s.counters.find((c) => c.id === 'm');
          if (c) c.value = maxM * k;
        }, 'inOut');
        const roofs = s.buildings.filter((b) => b.kind !== 'landmark' && b.state === 'ok');
        for (const f of s.figs) {
          const b = roofs.sort((a, c) => Math.abs(a.x - f.x) - Math.abs(c.x - f.x))[0];
          if (!b) continue;
          const edge = b.x + (f.x < b.x ? -b.w / 2 + 10 : b.w / 2 - 10);
          f.climb = { b, edge, stage: 0 };
          f.ai = climbAI;
          f.delay = r.range(0, 1.5);
        }
      });
      function climbAI(f, dt) {
        const c = f.climb;
        if (f.delay > 0) {
          f.delay -= dt;
          f.state = 'lookup';
          return;
        }
        const wet = liq.level < f.y - 20;
        if (wet && c.stage < 3) {
          if (L.glow) {
            f.visible = false;
            s.burst('smoke', f.x, liq.level, 4, 100, { p: { c: '#cccccc', size: 40 } });
            s.sfx('splash', 0.2);
            return;
          }
          f.state = 'panic';
          f.y = liq.level + 40 + Math.sin(s.t * 3 + f.x) * 6;
          f.x += Math.sin(s.t + f.phase) * 20 * dt;
          f.phase += dt * 6;
          return;
        }
        if (c.stage === 0) {
          const d = c.edge - f.x;
          if (Math.abs(d) < 8) c.stage = 1;
          else {
            f.face = Math.sign(d);
            f.x += f.face * 240 * f.speed * dt;
            f.state = 'panic';
            f.phase += 240 * dt * 0.055;
          }
        } else if (c.stage === 1) {
          f.noShadow = true;
          f.state = 'climb';
          f.phase += dt * 7;
          f.y -= 110 * f.speed * dt;
          if (f.y <= GY - c.b.h) {
            f.y = GY - c.b.h;
            c.stage = 2;
            f.x = c.b.x + (f.x < c.b.x ? -1 : 1) * r.range(5, c.b.w / 2 - 15);
          }
        } else {
          f.state = c.b.h < (GY - liq.level) ? 'panic' : 'lookup';
          if (c.b.state !== 'ok') c.stage = 3;
          f.phase += dt * 5;
          if (liq.level < f.y - 20) c.stage = 3;
        }
      }
      s.follow = () => ({ x: W / 2, y: Math.min(H / 2, liq.level - 260), zoom: LV.px > 1000 ? 0.8 : 1 });
      s.onUpdate = (dt) => {
        if (s.t > 5 && r() < dt * 20) s.part(L.glow ? 'ember' : 'drop', r.range(s.cam.x - 600, s.cam.x + 600), liq.level, { vy: -r.range(200, 500), vx: r.range(-100, 100), c: L.top, front: true });
        if (L.glow) for (const b of s.buildings) if (b.state === 'ok' && GY - liq.level > b.h * 0.55) s.collapse(b, 0);
      };
      s.at(9, () => {
        s.say('Everyone runs for the *rooftops*');
        s.music(0.75);
        s.closeup(me, 1.6, { r: 115 });
      });
      s.at(13, () => {
        s.stamp('1 HOUR LATER');
        if (L.glow) s.say(maxM >= 100 ? 'Skyscrapers *melt* like candles' : 'Streets turn into *rivers of fire*');
        else s.say(maxM >= 1000 ? 'Even skyscrapers *disappear*' : maxM >= 100 ? 'Most buildings are *underwater*' : 'Streets turn into *rivers*');
        s.music(1);
      });
      s.at(19.5, () => {
        s.stamp('1 DAY LATER');
        s.say(L.glow ? `${P(s)} is *buried in lava*` : maxM >= 1000 ? 'Only *mountain peaks* stay dry' : maxM >= 100 ? 'Millions of people *move inland*' : 'The water *finally stops*');
        s.music(0.45);
        if (!L.glow && maxM >= 100) {
          me.ai = null;
          me.visible = true;
          me.mode = 'still';
          me.state = 'lookup';
          s.add({
            layer: 'front',
            draw(g, s) {
              const y = liq.level + Math.sin(s.t * 2) * 6;
              me.x = W / 2 + Math.sin(s.t * 0.4) * 60;
              me.y = y - 8;
              g.fillStyle = '#8b5a2b';
              g.fillRect(me.x - 90, y - 10, 180, 22);
              me.draw(g, s.t, s.figColor);
            },
          });
        }
      });
      s.at(24, () => s.say(L.glow ? 'It will take *centuries* to cool' : p.liquid === 'slime' ? 'Nobody knows *where it came from*' : 'A whole new *coastline*'));
    },
  };

  /* ================================================================ CLONES */
  WI.INTERVALS = { '1': 'second', '10': '10 seconds', '60': 'minute', '3600': 'hour', '86400': 'day', '604800': 'week' };
  function dur(sec) {
    const u = [[31536000, 'YEAR'], [86400, 'DAY'], [3600, 'HOUR'], [60, 'MINUTE'], [1, 'SECOND']];
    for (const [v, n] of u) {
      if (sec >= v * (v === 1 ? 1 : 2) || v === 1) {
        const q = sec / v;
        const s = q >= 10 ? Math.round(q) : Math.round(q * 10) / 10;
        return `${WI.fmt(s)} ${n}${s === 1 ? '' : 'S'}`;
      }
    }
  }
  WI.durText = dur;
  S.clones = {
    duration: 30,
    build(s, p) {
      const r = s.rng, T = p.every;
      const me = hero(s, W / 2);
      me.mode = 'still';
      me.state = 'idle';
      s.music(0.25);
      const clones = [me];
      let n = 1;
      s.at(2.5, () => {
        s.say(`Every *${WI.INTERVALS[T]}*, you make *a clone*`);
        me.emo = 'happy';
        s.closeup(me, 1.6, { r: 120 });
      });
      s.at(4.2, () => s.counter('c', 'CLONES', 1, { color: '#ff6b6b', fmt: (v) => (v < 1e6 ? WI.fmt(v) : WI.big(v).toUpperCase()) }));
      for (let i = 1; i <= 8; i++) {
        s.at(4.2 + i * 1.15, () => {
          n *= 2;
          s.setCount('c', n);
          s.stamp(dur(i * T));
          s.sfx('pop', 0.8 + i * 0.12, 0.25);
          const cur = clones.slice();
          for (const c of cur) {
            if (clones.length > 300) break;
            const f = new Fig(c.x + r.range(-90, 90), { color: HERO, face: r.sign(), mode: 'wander', speed: r.range(0.8, 1.2), wait: r.range(0, 1) });
            f.tx = f.x;
            s.figs.push(f);
            clones.push(f);
            s.part('puff', f.x, GY - 60, { size: 40 });
          }
          const z = Math.max(0.45, 1 - i * 0.07);
          s.camTo({ zoom: z, y: GY - (1500 - H / 2) / z }, 1, 'out');
          s.bx0 = W / 2 - W / 2 / z;
          s.bx1 = W / 2 + W / 2 / z;
          if (i === 3) s.say('*Double* every time');
          if (i === 6) s.music(0.6);
        });
      }
      s.at(14.4, () => {
        s.stamp(dur(20 * T));
        s.say('*1 million* of you');
        s.setCount('c', 1048576);
        s.music(0.8);
        s.sfx('boom', 0.5);
        for (let i = 0; i < 140; i++) {
          const f = new Fig(r.range(-500, W + 500), { color: HERO, face: r.sign(), mode: 'wander', state: 'cheer', speed: r.range(0.8, 1.2) });
          f.y = GY + r.range(0, 120);
          s.figs.push(f);
        }
        s.camTo({ zoom: 0.4, y: GY - (1500 - H / 2) / 0.4 }, 1.5, 'out');
      });
      s.at(18.6, () => {
        s.stamp(dur(33 * T));
        s.setCount('c', 8589934592);
        s.say('More of *you* than all *humans on Earth*');
        s.music(1);
        for (const f of s.figs) if (r() < 0.6) f.state = 'cheer';
      });
      s.at(22.8, () => {
        s.stamp(dur(77 * T));
        s.setCount('c', 1.5e23);
        s.say('Your clones now outweigh *the entire planet*');
        s.flash(0.7);
        s.sfx('boom', 1);
        s.camTo({ zoom: 0.08, y: GY + 2000 }, 2.5, 'inOut');
        s.add({
          layer: 'screen', a: 0,
          update(dt) {
            this.a = Math.min(1, this.a + dt * 0.8);
          },
          draw(g, s) {
            g.globalAlpha = this.a;
            g.fillStyle = '#05070f';
            g.fillRect(0, 0, W, H);
            const R = WI.RNG(5);
            g.fillStyle = '#ffffff';
            for (let i = 0; i < 120; i++) g.fillRect(R() * W, R() * H, 2, 2);
            g.fillStyle = '#2a6fdb';
            g.beginPath();
            g.arc(W / 2, 1100, 360, 0, TAU);
            g.fill();
            g.fillStyle = HERO;
            for (let i = 0; i < 1600; i++) {
              const a = R() * TAU, d = Math.sqrt(R()) * 360;
              g.fillRect(W / 2 + Math.cos(a) * d - 2, 1100 + Math.sin(a) * d - 2, 4, 4);
            }
            g.globalAlpha = 1;
          },
        });
      });
    },
  };
})();
