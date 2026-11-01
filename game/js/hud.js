// In-game HUD: bars, weapon slots, counters, minimap, full map, killfeed,
// banners, toasts, hit markers, damage direction, pickup prompt, crosshair.
import { WEAPONS, RARITY, AMMO, ITEMS } from './config.js';
import { drawWeaponIcon } from './models.js';
import { itemLabel, itemColor } from './loot.js';
import { islandRadius, POIS } from './world.js';
import { fmtTime } from './util.js';

const $ = (id) => document.getElementById(id);

export class HUD {
  constructor(world) {
    this.world = world;
    this.el = $('hud');
    this.cache = {};
    this.slotCanvases = [...document.querySelectorAll('.slot canvas')];
    this.slotEls = [...document.querySelectorAll('.slot')];
    this.mini = $('minimap');
    this.miniCtx = this.mini.getContext('2d');
    this.bigMap = $('bigmap-canvas');
    this.base = this.renderBaseMap(512);
    this.crosshair = $('crosshair');
    this.bannerT = null;
    this.feed = $('killfeed');
  }

  set(id, value, prop = 'textContent') {
    const key = id + prop;
    if (this.cache[key] === value) return;
    this.cache[key] = value;
    const el = $(id);
    if (el) el[prop] = value;
  }

  show(on) { this.el.classList.toggle('hidden', !on); }

  renderBaseMap(size) {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const g = c.getContext('2d');
    const s = size / 400;
    g.fillStyle = '#2aa9da';
    g.fillRect(0, 0, size, size);
    const step = 2;
    for (let z = -200; z < 200; z += step) {
      for (let x = -200; x < 200; x += step) {
        const d = islandRadius(Math.atan2(z, x)) - Math.hypot(x, z);
        if (d < 1) continue;
        const col = this.world.groundColor(x + 1, z + 1);
        if (!this.world.isWalkable(x + 1, z + 1) && d > 2) { g.fillStyle = '#3cc0ea'; }
        else g.fillStyle = `rgb(${col[0] * 255 | 0},${col[1] * 255 | 0},${col[2] * 255 | 0})`;
        g.fillRect((x + 200) * s, (z + 200) * s, step * s + 0.6, step * s + 0.6);
      }
    }
    g.fillStyle = '#5a5d68';
    for (const [x0, z0, x1, z1, w] of this.world.roads) {
      const minX = Math.min(x0, x1) - w / 2, maxX = Math.max(x0, x1) + w / 2, minZ = Math.min(z0, z1) - w / 2, maxZ = Math.max(z0, z1) + w / 2;
      g.fillRect((minX + 200) * s, (minZ + 200) * s, (maxX - minX) * s, (maxZ - minZ) * s);
    }
    for (const [x0, z0, x1, z1, color] of this.world.minimapRects) {
      g.fillStyle = color;
      g.fillRect((x0 + 200) * s, (z0 + 200) * s, (x1 - x0) * s, (z1 - z0) * s);
      g.strokeStyle = 'rgba(0,0,0,0.35)';
      g.strokeRect((x0 + 200) * s, (z0 + 200) * s, (x1 - x0) * s, (z1 - z0) * s);
    }
    return c;
  }

  // ---------------------------------------------------------------- per-frame
  update(match, input) {
    const p = match.player;
    this.set('hp-text', Math.ceil(Math.max(0, p.health)));
    this.lastPlayer = p;
    $('hp-fill').style.width = Math.max(0, p.health) + '%';
    $('hp-fill').classList.toggle('low', p.health < 35);
    $('ar-fill').style.width = (p.armor / 80) * 100 + '%';
    this.set('ar-text', Math.ceil(p.armor));
    this.set('alive-count', match.aliveCount);
    this.set('kill-count', p.kills);

    // weapon slots
    p.slots.forEach((s, i) => {
      const key = s ? `${s.id}:${s.rarity}` : 'empty';
      const el = this.slotEls[i];
      if (el.dataset.key !== key) {
        el.dataset.key = key;
        const cv = this.slotCanvases[i];
        const g = cv.getContext('2d');
        g.clearRect(0, 0, cv.width, cv.height);
        if (s) drawWeaponIcon(g, s.id, 6, 6, cv.width - 12, cv.height - 12, '#ffffff');
        el.style.setProperty('--rar', s ? RARITY[s.rarity].color : 'rgba(255,255,255,0.15)');
        el.querySelector('.slot-name').textContent = s ? WEAPONS[s.id].name : '—';
      }
      el.classList.toggle('active', i === p.active);
      el.querySelector('.slot-ammo').textContent = s ? s.mag : '';
    });
    const w = p.weapon();
    if (w.melee) { this.set('ammo-main', '—'); this.set('ammo-reserve', 'Fists'); }
    else {
      this.set('ammo-main', p.reloading > 0 ? '…' : String(w.slot.mag));
      this.set('ammo-reserve', `/ ${p.ammo[w.ammo]} ${AMMO[w.ammo].name.split(' ')[0]}`);
    }
    $('ammo-box').style.setProperty('--rar', w.slot ? RARITY[w.slot.rarity].color : '#ffffff');
    this.set('weapon-name', w.melee ? 'Fists' : `${RARITY[w.slot.rarity].name} ${w.name}`);
    $('reload-bar').style.width = p.reloading > 0 ? (1 - p.reloading / w.reload) * 100 + '%' : '0%';
    $('reload-wrap').classList.toggle('on', p.reloading > 0 || p.healing > 0);
    if (p.healing > 0) { $('reload-bar').style.width = (1 - p.healing / ITEMS.medkit.time) * 100 + '%'; this.set('reload-label', 'Healing'); }
    else this.set('reload-label', 'Reloading');

    this.set('cnt-medkit', p.medkit);
    this.set('cnt-grenade', p.grenade);
    this.set('cnt-soda', p.soda);
    $('boost-ind').classList.toggle('on', p.boost > 0);

    // storm
    const z = match.zone;
    if (!z.active) this.set('zone-text', p.state === 'plane' ? (input.touchMode ? 'Tap JUMP to drop' : 'Jump: SPACE / click') : 'Storm forming');
    else if (z.state === 'wait') this.set('zone-text', `Storm shrinks in ${fmtTime(z.timeLeft())}`);
    else if (z.state === 'shrink') this.set('zone-text', `Storm closing ${fmtTime(z.timeLeft())}`);
    else this.set('zone-text', 'Final circle');
    const outside = p.state === 'alive' && z.active && z.outside(p.x, p.z);
    $('storm-vignette').classList.toggle('on', outside);
    $('zone-pill').classList.toggle('danger', outside);

    // pickup prompt
    const it = match.playerPrompt();
    if (it) {
      const k = input.touchMode ? 'Tap' : 'E';
      this.set('prompt-text', `${itemLabel(it)}`);
      this.set('prompt-key', k);
      $('prompt').style.setProperty('--rar', itemColor(it));
      $('prompt').classList.add('on');
    } else $('prompt').classList.remove('on');
    $('btn-pickup').classList.toggle('hidden', !it);

    // plane / spectate
    $('jump-hint').classList.toggle('on', p.state === 'plane');
    $('btn-jump').classList.toggle('hidden', p.state !== 'plane');
    const t = match.cameraTarget();
    if (t.spect) { this.set('spect-name', t.spect.name); $('spectate').classList.add('on'); }
    else $('spectate').classList.remove('on');
    $('low-hp').classList.toggle('on', p.state === 'alive' && p.health < 30);
  }

  // ---------------------------------------------------------------- map
  drawMinimap(match) {
    const c = this.mini, g = this.miniCtx;
    const W = c.width, H = c.height;
    const t = match.cameraTarget();
    const span = 110; // world units across
    const scale = W / span;
    const bs = this.base.width / 400;
    g.save();
    g.clearRect(0, 0, W, H);
    g.fillStyle = '#2aa9da';
    g.fillRect(0, 0, W, H);
    const sx = (t.x - span / 2 + 200) * bs, sz = (t.z - span / 2 + 200) * bs;
    g.drawImage(this.base, sx, sz, span * bs, span * bs, 0, 0, W, H);
    const toS = (x, z) => [(x - t.x) * scale + W / 2, (z - t.z) * scale + H / 2];
    this.drawZone(g, match, toS, scale);
    // plane path
    if (match.plane.progress < 1) this.drawPlane(g, match, toS);
    // player arrow
    this.drawPlayer(g, match.player, toS, 7);
    g.restore();
  }

  drawZone(g, match, toS, scale) {
    const z = match.zone;
    if (!z.active && match.plane.progress < 1) return;
    // storm outside the circle
    const [cx, cz] = toS(z.cx, z.cz);
    g.save();
    g.fillStyle = 'rgba(140,60,230,0.38)';
    g.beginPath();
    g.rect(-5000, -5000, 10000, 10000);
    g.arc(cx, cz, Math.max(0, z.r * scale), 0, Math.PI * 2, true);
    g.fill('evenodd');
    g.strokeStyle = '#c78bff'; g.lineWidth = 2;
    g.beginPath(); g.arc(cx, cz, Math.max(0, z.r * scale), 0, Math.PI * 2); g.stroke();
    if (z.state !== 'done' && z.nr > 0) {
      const [nx, nz] = toS(z.nx, z.nz);
      g.strokeStyle = '#ffffff'; g.lineWidth = 1.5; g.setLineDash([5, 4]);
      g.beginPath(); g.arc(nx, nz, z.nr * scale, 0, Math.PI * 2); g.stroke();
      g.setLineDash([]);
    }
    g.restore();
  }

  drawPlane(g, match, toS) {
    const p = match.plane;
    const [ax, az] = toS(p.sx, p.sz);
    const [bx, bz] = toS(p.sx + p.dx * p.len, p.sz + p.dz * p.len);
    g.strokeStyle = 'rgba(255,255,255,0.8)'; g.lineWidth = 2; g.setLineDash([6, 5]);
    g.beginPath(); g.moveTo(ax, az); g.lineTo(bx, bz); g.stroke(); g.setLineDash([]);
    const [px, pz] = toS(p.x, p.z);
    g.fillStyle = '#ffd23f';
    g.beginPath(); g.arc(px, pz, 5, 0, Math.PI * 2); g.fill();
  }

  drawPlayer(g, f, toS, size) {
    if (f.state === 'dead') return;
    const [x, z] = toS(f.x, f.z);
    g.save();
    g.translate(x, z);
    g.rotate(-f.angle + Math.PI);
    g.fillStyle = '#ffd23f'; g.strokeStyle = '#1d1b4c'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(0, -size); g.lineTo(size * 0.75, size * 0.8); g.lineTo(0, size * 0.35); g.lineTo(-size * 0.75, size * 0.8); g.closePath();
    g.fill(); g.stroke();
    g.restore();
  }

  drawBigMap(match) {
    const c = this.bigMap, g = c.getContext('2d');
    const W = c.width;
    const scale = W / 400;
    g.clearRect(0, 0, W, W);
    g.drawImage(this.base, 0, 0, W, W);
    const toS = (x, z) => [(x + 200) * scale, (z + 200) * scale];
    this.drawZone(g, match, toS, scale);
    this.drawPlane(g, match, toS);
    g.font = '700 13px Nunito, system-ui, sans-serif';
    g.textAlign = 'center';
    for (const p of POIS) {
      const [x, z] = toS(p.x, p.z);
      g.lineWidth = 4; g.strokeStyle = 'rgba(29,27,76,0.85)'; g.strokeText(p.name, x, z);
      g.fillStyle = '#ffffff'; g.fillText(p.name, x, z);
    }
    this.drawPlayer(g, match.player, toS, 9);
  }

  // ---------------------------------------------------------------- events
  banner(title, sub = '') {
    const b = $('banner');
    b.querySelector('.b-title').textContent = title;
    b.querySelector('.b-sub').textContent = sub;
    b.classList.remove('on');
    void b.offsetWidth;
    b.classList.add('on');
    clearTimeout(this.bannerT);
    this.bannerT = setTimeout(() => b.classList.remove('on'), 2800);
  }

  toast(text) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = text;
    $('toasts').appendChild(t);
    setTimeout(() => t.remove(), 1700);
    const all = $('toasts').children;
    if (all.length > 4) all[0].remove();
  }

  killfeed(killer, victim, weapon, byPlayer, ofPlayer) {
    const row = document.createElement('div');
    row.className = 'kf-row' + (byPlayer ? ' mine' : '') + (ofPlayer ? ' me-dead' : '');
    const how = weapon === 'storm' ? '🌀' : weapon === 'grenade' ? '💥' : '';
    if (how) row.innerHTML = `<b></b><span class="kf-how">${how}</span><i></i>`;
    else row.innerHTML = `<b></b><canvas width="54" height="22"></canvas><i></i>`;
    row.querySelector('b').textContent = killer || (weapon === 'storm' ? 'Storm' : '');
    row.querySelector('i').textContent = victim;
    const cv = row.querySelector('canvas');
    if (cv) drawWeaponIcon(cv.getContext('2d'), weapon, 2, 2, 50, 18, '#ffffff');
    this.feed.prepend(row);
    while (this.feed.children.length > 5) this.feed.lastChild.remove();
    setTimeout(() => row.classList.add('fade'), 5000);
    setTimeout(() => row.remove(), 5600);
  }

  eliminated(name, kills) {
    const e = $('elim');
    e.querySelector('.e-name').textContent = name;
    e.querySelector('.e-count').textContent = kills + (kills === 1 ? ' elimination' : ' eliminations');
    e.classList.remove('on'); void e.offsetWidth; e.classList.add('on');
  }

  hitMarker(kill) {
    const h = this.crosshair;
    h.classList.remove('hit', 'kill'); void h.offsetWidth;
    h.classList.add(kill ? 'kill' : 'hit');
  }

  damageFrom(x, z) {
    const v = $('vignette');
    v.classList.remove('on'); void v.offsetWidth; v.classList.add('on');
    if (x === null || !this.lastPlayer) return;
    const ang = Math.atan2(x - this.lastPlayer.x, z - this.lastPlayer.z);
    const ind = document.createElement('div');
    ind.className = 'dmg-dir';
    // screen up = world -z, so rotate accordingly
    ind.style.transform = `translate(-50%,-50%) rotate(${Math.PI - ang}rad)`;
    $('dmg-dirs').appendChild(ind);
    setTimeout(() => ind.remove(), 900);
  }

  zoneDamage() {
    const v = $('vignette');
    v.classList.remove('on', 'storm'); void v.offsetWidth; v.classList.add('on', 'storm');
  }

  // crosshair follows mouse; size reflects current spread
  updateCrosshair(input, player, visible) {
    const c = this.crosshair;
    c.style.display = visible && !input.touchMode ? 'block' : 'none';
    if (!visible) return;
    const w = player.weapon();
    const spread = w.melee ? 0.05 : w.spread + player.bloom;
    const size = 18 + spread * 260;
    c.style.transform = `translate(${input.mouse.x}px, ${input.mouse.y}px)`;
    c.style.setProperty('--s', size + 'px');
  }
}
