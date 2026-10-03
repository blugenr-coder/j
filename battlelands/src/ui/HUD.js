/* In-match HUD. Minimal by design: status top-left, players-left top-centre,
   minimap top-right, joystick bottom-left, attack bottom-right, weapons
   bottom-centre. Contextual buttons (heal, utility, reload, pick up) only
   appear when they can do something. */
import { icon } from './Icons.js';
import { el, $, press, esc, sfx, buzz, formatTime } from './dom.js';
import { t } from './i18n.js';
import { Minimap, drawFullMap } from './Minimap.js';
import { slotsHTML, updateSlots, lootCardHTML, fillLootCard } from './Inventory.js';
import { ITEMS } from '../world/LootManager.js';
import { activeWeapon } from '../player/PlayerStats.js';
import { EMOTES, isOwned } from '../progression/Cosmetics.js';
import { SaveManager } from '../core/SaveManager.js';
import { CONFIG } from '../core/config.js';

const RING = 2 * Math.PI * 46;

export class HUD {
  constructor(root, { input, onPause, settings }) {
    this.root = root;
    this.input = input;
    this.onPause = onPause;
    this.settings = settings;
    this.node = null;
    this.cache = {};
    this.focus = null;
    this.bannerT = 0;
    this.feed = [];
    this.fpsAcc = 0; this.fpsN = 0;
  }

  mount(match, canvas) {
    this.unmount();
    this.match = match;
    const n = el(`<div class="hud" id="hud">
      <div class="tl glass" aria-label="Status">
        <div class="bar-row">${icon('heart', { size: 20, color: '#FF6B6B' })}<div class="bar hp"><i class="ghost"></i><i class="fill"></i></div><span class="v num" id="hpV">100</span></div>
        <div class="bar-row">${icon('armor', { size: 20, color: '#60A5FA' })}<div class="bar ar"><i class="ghost"></i><i class="fill"></i></div><span class="v num" id="arV">0</span></div>
      </div>
      <div class="tc">
        <div class="pills">
          <div class="pill alive" title="${t('ALIVE')}">${icon('users', { size: 20, color: '#7DD3FC' })}<b class="num" id="aliveV">32</b></div>
          <div class="pill kills" title="${t('KILLS')}">${icon('target', { size: 20, color: '#FFD43B' })}<b class="num" id="killsV">0</b></div>
        </div>
        <div class="zone-pill" id="zonePill">${icon('clock', { size: 16 })}<span id="zoneT">--</span></div>
        <div class="killfeed" id="feed"></div>
      </div>
      <div class="tr">
        <canvas class="minimap" id="mini" aria-label="${t('MAP')}" role="button" tabindex="0"></canvas>
        <div class="row-btns">
          <button class="icon-btn" id="emoteBtn" aria-label="Emote">${icon('smile', { size: 24 })}</button>
          <button class="icon-btn" id="pauseBtn" aria-label="${t('PAUSED')}">${icon('pause', { size: 24 })}</button>
        </div>
      </div>
      <div class="emote-wheel glass" id="emoteWheel"></div>
      <div class="zone-banner" id="banner">${icon('warning', { size: 24 })}<span></span></div>
      <div class="joy-zone ${this.settings.joystickMode}" id="joyZone"><div class="joy idle" id="joy"><div class="thumb" id="thumb"></div></div></div>
      ${slotsHTML()}
      ${lootCardHTML()}
      <div class="actions" id="actions">
        <button class="ctx-btn btn-reload" id="reloadBtn" aria-label="${t('RELOAD')}">${icon('reload', { size: 24 })}</button>
        <button class="ctx-btn btn-util" id="utilBtn" aria-label="Utility"><span class="ic"></span><span class="cnt num"></span></button>
        <button class="ctx-btn btn-heal" id="healBtn" aria-label="${t('HEAL')}"><svg class="ring" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" stroke-dasharray="${RING}" stroke-dashoffset="${RING}"/></svg><span class="ic"></span><span class="cnt num"></span></button>
        <button class="fire" id="fireBtn" aria-label="Attack"><svg class="ring" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" stroke-dasharray="${RING}" stroke-dashoffset="${RING}"/></svg><span class="core">${icon('target', { size: 40 })}</span></button>
      </div>
      <div class="dmg-dir" id="dmgDir"></div>
      ${this.settings.showFps ? '<div class="fps" id="fps"></div>' : ''}
    </div>`);
    this.root.appendChild(n);
    this.node = n;
    this.mini = new Minimap($('#mini', n));

    this.input.bind({ joyZone: $('#joyZone', n), joyEl: $('#joy', n), thumbEl: $('#thumb', n), fireEl: $('#fireBtn', n), canvas });
    this.input.onAction = (a, arg) => this.action(a, arg);

    n.querySelectorAll('.slot').forEach(s => s.addEventListener('pointerdown', e => { e.preventDefault(); this.action('switch', Number(s.dataset.slot)); }));
    const tapBtn = (sel, a) => $(sel, n).addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); this.action(a); });
    tapBtn('#healBtn', 'heal'); tapBtn('#utilBtn', 'util'); tapBtn('#reloadBtn', 'reload');
    $('#lootCard .take', n).addEventListener('pointerdown', e => { e.preventDefault(); this.action('pickup'); });
    press($('#pauseBtn', n), () => this.onPause(), { sound: 'click' });
    press($('#emoteBtn', n), () => this.toggleEmotes());
    press($('#mini', n), () => this.showMap());

    // Emote wheel: only owned emotes.
    const wheel = $('#emoteWheel', n);
    for (const e of EMOTES) {
      if (!isOwned(SaveManager.data, 'emotes', e.id)) continue;
      const b = el(`<button aria-label="${esc(e.name)}">${icon(e.glyph, { size: 28, color: e.id === 'heart' ? '#F472B6' : e.id === 'fire' ? '#FF9F43' : '#FFFFFF' })}</button>`);
      press(b, () => { match.playerAction('emote', e.id); sfx('emote'); this.toggleEmotes(false); }, { sound: null });
      wheel.appendChild(b);
    }

    // Damage direction markers
    const dd = $('#dmgDir', n);
    this.dirs = Array.from({ length: 4 }, () => { const i = document.createElement('i'); dd.appendChild(i); return i; });
    this.dirIdx = 0;

    // Match events → HUD
    const b = match.bus;
    this.offs = [
      b.on('zoneWarning', e => this.banner(e.phase === CONFIG.zone.phases.length - 1 ? t('FINAL ZONE') : t('NEW SAFE ZONE'), 'warn')),
      b.on('zoneShrink', () => this.banner(t('ZONE SHRINKING'), '')),
      b.on('elimination', e => this.killfeed(e)),
      b.on('damage', e => { if (e.target === match.player && e.source && e.source !== match.player) this.hitFrom(e.source); }),
    ];
  }

  unmount() {
    this.input.unbind();
    for (const off of this.offs || []) off();
    this.offs = [];
    this.node?.remove();
    this.node = null;
    this.cache = {};
    this.feed = [];
  }

  action(a, arg) {
    const m = this.match;
    if (!m) return;
    switch (a) {
      case 'pause': this.onPause(); return;
      case 'map': this.showMap(); return;
      case 'emote': this.toggleEmotes(); return;
      case 'fireDown': buzz(6); return;
    }
    if (a === 'emote') return;
    const ok = m.playerAction(a, arg);
    if (ok) {
      buzz(10);
      if (a === 'switch') sfx('switch');
      if (a === 'reload') sfx('reload');
    }
  }

  toggleEmotes(force) {
    const w = $('#emoteWheel', this.node);
    w.classList.toggle('show', force ?? !w.classList.contains('show'));
  }

  showMap() {
    const m = this.match;
    const size = Math.min(window.innerWidth - 32, window.innerHeight - 110, 640);
    const ov = el(`<div class="bigmap" role="dialog" aria-label="${t('MAP')}"><canvas style="width:${size}px;height:${size}px"></canvas><button class="icon-btn" aria-label="${t('CLOSE')}">${icon('close', { size: 24 })}</button></div>`);
    this.node.appendChild(ov);
    drawFullMap($('canvas', ov), m);
    const close = () => { ov.remove(); };
    press($('.icon-btn', ov), close, { sound: 'back' });
    ov.addEventListener('pointerdown', e => { if (e.target === ov) close(); });
  }

  banner(text, kind) {
    const b = $('#banner', this.node);
    if (!b) return;
    b.querySelector('span').textContent = text;
    b.classList.remove('warn');
    if (kind) b.classList.add(kind);
    b.classList.add('show');
    this.bannerT = 2.6;
    sfx('zone_warn'); buzz([30, 60, 30]);
  }

  killfeed(e) {
    const feed = $('#feed', this.node);
    if (!feed) return;
    const p = this.match.player;
    const me = e.killer === p || e.target === p;
    const who = e.killer ? (e.killer === p ? t('YOU') : e.killer.name) : 'ZONE';
    const victim = e.target === p ? t('YOU') : e.target.name;
    const ic = e.kind === 'zone' ? 'warning' : e.kind === 'blast' ? 'fire' : 'target';
    const d = el(`<div class="${me ? 'me' : ''}">${esc(who)} ${icon(ic, { size: 12 })} ${esc(victim)}</div>`);
    feed.prepend(d);
    while (feed.children.length > 3) feed.lastChild.remove();
    setTimeout(() => { d.classList.add('out'); setTimeout(() => d.remove(), 400); }, 3200);
  }

  hitFrom(src) {
    const p = this.match.player;
    // border-top of a circle is an arc centred on "up"; rotate it to face the shooter.
    const a = Math.atan2(src.y - p.y, src.x - p.x) + Math.PI / 2;
    const i = this.dirs[this.dirIdx++ % this.dirs.length];
    i.style.transform = `rotate(${a}rad)`;
    i.style.transition = 'none'; i.style.opacity = '1';
    void i.offsetWidth;
    i.style.transition = 'opacity 700ms ease-in 150ms'; i.style.opacity = '0';
  }

  set(id, value, fn) {
    if (this.cache[id] === value) return;
    this.cache[id] = value;
    fn(value);
  }

  update(dt, match, fps) {
    const n = this.node;
    if (!n) return;
    const p = match.player;
    const c = this.cache;

    // health / armor
    const hp = Math.ceil(p.hp), ar = Math.ceil(p.armor);
    this.set('hp', hp, v => {
      const bar = n.querySelector('.bar.hp');
      bar.querySelector('.fill').style.width = v + '%';
      bar.querySelector('.ghost').style.width = v + '%';
      bar.classList.toggle('mid', v <= 60 && v > 30); bar.classList.toggle('low', v <= 30);
      n.querySelector('#hpV').textContent = v;
      n.classList.toggle('low-hp', v <= 30 && v > 0);
    });
    this.set('ar', ar, v => {
      const bar = n.querySelector('.bar.ar');
      bar.querySelector('.fill').style.width = (v / p.maxArmor) * 100 + '%';
      bar.querySelector('.ghost').style.width = (v / p.maxArmor) * 100 + '%';
      n.querySelector('#arV').textContent = v;
    });
    this.set('alive', match.aliveCount(), v => { const e = n.querySelector('#aliveV'); e.textContent = v; e.parentElement.classList.remove('bump'); void e.offsetWidth; e.parentElement.classList.add('bump'); });
    this.set('kills', p.kills, v => { const e = n.querySelector('#killsV'); e.textContent = v; if (v) { e.parentElement.classList.remove('bump'); void e.offsetWidth; e.parentElement.classList.add('bump'); } });

    // zone timer
    const z = match.zone;
    let zt = '--', zcls = '';
    if (match.phase === 'live') {
      if (z.stage === 'wait') zt = `${formatTime(z.countdown())}`;
      else if (z.stage === 'warning') { zt = `${t('SHRINKING')} ${formatTime(z.timer)}`; zcls = 'warn'; }
      else if (z.stage === 'shrinking') { zt = t('ZONE SHRINKING'); zcls = 'shrink'; }
      else if (z.stage === 'final') { zt = t('FINAL ZONE'); zcls = 'shrink'; }
      if (p.outsideZone && p.alive) { zt = t('GET TO THE ZONE'); zcls = 'shrink'; }
    }
    this.set('zt', zt + zcls, () => {
      n.querySelector('#zoneT').textContent = zt;
      const zp = n.querySelector('#zonePill');
      zp.classList.toggle('warn', zcls === 'warn'); zp.classList.toggle('shrink', zcls === 'shrink');
    });

    if (this.bannerT > 0) { this.bannerT -= dt; if (this.bannerT <= 0) n.querySelector('#banner').classList.remove('show'); }

    // weapons
    updateSlots(n, p);
    const w = activeWeapon(p);
    const fire = n.querySelector('#fireBtn');
    const reloading = w.reloadT > 0;
    this.set('fireIcon', w.def.icon + reloading, () => {
      fire.querySelector('.core').innerHTML = icon(reloading ? 'reload' : w.def.melee ? 'fist' : 'target', { size: 40 });
    });
    this.set('fireUn', reloading || p.healing ? 1 : 0, v => fire.classList.toggle('unavailable', !!v));
    const ring = fire.querySelector('circle');
    const rk = reloading ? 1 - w.reloadT / w.reloadTime : 0;
    this.set('fireRing', Math.round(rk * 40), () => { ring.style.strokeDashoffset = reloading ? RING * (1 - rk) : RING; });

    // contextual buttons
    const healBtn = n.querySelector('#healBtn');
    const canHeal = !!p.heal && p.alive;
    this.set('healShow', canHeal ? `${p.heal.key}|${p.heal.count}` : '', v => {
      healBtn.classList.toggle('show', !!v);
      if (v) {
        healBtn.querySelector('.ic').innerHTML = icon(ITEMS[p.heal.key].icon, { size: 28, color: p.heal.key === 'shieldcell' ? '#60A5FA' : '#4ADE80' });
        healBtn.querySelector('.cnt').textContent = p.heal.count;
      }
    });
    const hk = p.healing ? p.healing.t / p.healing.total : 0;
    this.set('healRing', Math.round(hk * 40), () => { healBtn.querySelector('circle').style.strokeDashoffset = RING * (1 - hk); });

    const utilBtn = n.querySelector('#utilBtn');
    this.set('util', p.util ? `${p.util.key}|${p.util.count}` : '', v => {
      utilBtn.classList.toggle('show', !!v);
      if (v) {
        utilBtn.querySelector('.ic').innerHTML = icon(ITEMS[p.util.key].icon, { size: 28, color: p.util.key === 'frag' ? '#FF9F43' : p.util.key === 'soda' ? '#FFD43B' : '#E2E8F0' });
        utilBtn.querySelector('.cnt').textContent = p.util.count;
      }
    });
    const showReload = !w.def.melee && !reloading && w.ammo < w.magazine;
    this.set('reload', showReload, v => n.querySelector('#reloadBtn').classList.toggle('show', v));

    // loot card for the nearest item
    const it = match.focusItem();
    const card = n.querySelector('#lootCard');
    const key = it ? `${it.id}|${it.count}|${p.weapons.map(x => x && x.id + x.rarity).join()}|${p.activeSlot}|${p.heal?.key}${p.heal?.count}|${p.util?.key}|${Math.round(p.armor)}` : '';
    this.set('loot', key, () => {
      if (it) fillLootCard(card, match, it);
      card.classList.toggle('show', !!it);
    });

    this.mini.update(dt, match);

    if (this.settings.showFps) {
      this.fpsAcc += dt; this.fpsN++;
      if (this.fpsAcc > 0.5) { const f = n.querySelector('#fps'); if (f) f.textContent = `${Math.round(this.fpsN / this.fpsAcc)} ${t('FPS')}`; this.fpsAcc = 0; this.fpsN = 0; }
    }
    void c; void fps;
  }

  /* Big centred message (eliminated / victory / GO). */
  centerBanner(title, sub, kind) {
    const b = el(`<div class="center-banner ${kind}"><div class="h1">${esc(title)}</div>${sub ? `<div class="sub">${esc(sub)}</div>` : ''}</div>`);
    this.node?.appendChild(b);
    return b;
  }

  setControlsVisible(v) {
    if (!this.node) return;
    for (const sel of ['#actions', '#slots', '#joyZone', '#lootCard']) { const e = $(sel, this.node); if (e) e.style.visibility = v ? '' : 'hidden'; }
  }
}
