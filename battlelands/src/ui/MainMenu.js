/* The menu shell: profile + coins on top, the active tab in the middle,
   five-tab navigation at the bottom. HOME is the big character and the
   PLAY button — the brightest, largest thing on the screen. */
import { icon } from './Icons.js';
import { el, $, $$, press, esc, fmt, coinPill, modal, toast, sfx } from './dom.js';
import { t } from './i18n.js';
import { drawPortrait } from '../player/PlayerAnimation.js';
import { characterById, PROFILE_ICONS } from '../progression/Cosmetics.js';
import { xpForLevel } from '../progression/XPManager.js';
import { rarityTag } from './Cards.js';
import { renderCollection } from './Collection.js';
import { renderShop } from './Shop.js';
import { renderMissions, claimableCount } from './Missions.js';
import { renderSettings } from './Settings.js';

const TABS = [
  ['home', 'home', 'HOME'], ['collection', 'collection', 'COLLECTION'], ['shop', 'shop', 'SHOP'],
  ['missions', 'missions', 'MISSIONS'], ['settings', 'gear', 'SETTINGS'],
];

export class MainMenu {
  constructor(root, app) {
    this.root = root;
    this.app = app;
    this.node = null;
    this.tab = 'home';
    this.raf = 0;
  }

  mount(tab = 'home') {
    this.unmount();
    const n = el(`<div class="screen menu">
      <div class="menu-bg">${Array.from({ length: 14 }, (_, i) => `<span class="float" style="left:${(i * 37) % 100}%;bottom:-20px;width:${6 + (i % 4) * 4}px;height:${6 + (i % 4) * 4}px;animation-duration:${9 + (i % 5) * 3}s;animation-delay:-${i * 1.7}s"></span>`).join('')}<div class="ground"></div></div>
      <div class="menu-top">
        <button class="profile card" id="profileBtn" aria-label="Profile"></button>
        <div class="menu-right"><button id="coinsBtn" aria-label="${t('COINS')}"></button></div>
      </div>
      <div class="panel" id="panel"></div>
      <nav class="nav" id="nav">${TABS.map(([id, ic, label]) => `<button data-tab="${id}" aria-label="${t(label)}">${icon(ic, { size: 26 })}<span>${t(label)}</span></button>`).join('')}</nav>
    </div>`);
    this.root.appendChild(n);
    this.node = n;
    $$('#nav button', n).forEach(b => press(b, () => this.show(b.dataset.tab), { sound: 'click', vibrate: 6 }));
    press($('#profileBtn', n), () => this.profileModal());
    press($('#coinsBtn', n), () => this.show('shop'));
    this.refreshTop();
    this.show(tab);
  }

  unmount() {
    cancelAnimationFrame(this.raf);
    this.node?.remove();
    this.node = null;
  }

  refreshTop() {
    if (!this.node) return;
    const s = this.app.save;
    const pi = PROFILE_ICONS.find(i => i.id === s.equipped.icon) || PROFILE_ICONS[0];
    const need = xpForLevel(s.level);
    $('#profileBtn', this.node).innerHTML = `
      <span class="avatar">${icon(pi.glyph, { size: 30, color: pi.color })}<span class="lvl num">${s.level}</span></span>
      <span class="who"><div class="name">${esc(s.name)}</div>
        <div class="xpbar"><i style="width:${Math.min(100, (s.xp / need) * 100)}%"></i></div>
        <div class="xpnum num">${t('LEVEL')} ${s.level} · ${fmt(s.xp)} / ${fmt(need)} XP</div></span>`;
    $('#coinsBtn', this.node).innerHTML = coinPill(s.coins);
    const dot = claimableCount(s);
    const mb = $('#nav button[data-tab="missions"]', this.node);
    mb.querySelector('.dot')?.remove();
    if (dot) mb.insertAdjacentHTML('beforeend', '<span class="dot"></span>');
  }

  bumpCoins() {
    this.refreshTop();
    const p = $('#coinsBtn .pill', this.node);
    p?.classList.add('bump');
  }

  show(tab) {
    if (!this.node) return;
    this.tab = tab;
    cancelAnimationFrame(this.raf);
    $$('#nav button', this.node).forEach(b => { b.classList.toggle('active', b.dataset.tab === tab); b.setAttribute('aria-current', b.dataset.tab === tab ? 'page' : 'false'); });
    const panel = $('#panel', this.node);
    panel.innerHTML = '';
    panel.style.animation = 'none'; void panel.offsetWidth; panel.style.animation = '';
    const ctx = { app: this.app, menu: this, panel };
    if (tab === 'home') this.renderHome(panel);
    else if (tab === 'collection') renderCollection(ctx);
    else if (tab === 'shop') renderShop(ctx);
    else if (tab === 'missions') renderMissions(ctx);
    else if (tab === 'settings') renderSettings(ctx);
    this.refreshTop();
  }

  renderHome(panel) {
    const s = this.app.save;
    const ch = characterById(s.equipped.character);
    const claim = claimableCount(s);
    panel.innerHTML = `
      <div class="menu-stage">
        <button class="mission-teaser glass ${claim ? 'has-claim' : ''}" id="mTeaser">${icon('missions', { size: 26, color: '#FFD43B' })}<span class="num">${s.missions.list.filter(m => m.claimed).length}/${s.missions.list.length}</span><span>${t('MISSIONS')}</span></button>
        <div class="stats-teaser glass"><div>${t('WINS')}<b class="num">${s.stats.wins}</b></div><div>${t('KILLS')}<b class="num">${s.stats.kills}</b></div></div>
        <canvas id="hero" aria-label="${esc(ch.name)}"></canvas>
        <div class="char-name"><span class="h3">${esc(ch.name)}</span>${rarityTag(ch.rarity)}<button class="btn btn-secondary btn-sm" id="change">${icon('collection', { size: 18 })}<span>${t('CHANGE')}</span></button></div>
      </div>
      <div class="menu-play">
        <div class="mode">${icon('users', { size: 16 })}${t('SOLO • 32 PLAYERS')}</div>
        <button class="btn btn-play" id="playBtn">${icon('play', { size: 32 })}<span>${t('PLAY')}</span></button>
      </div>`;
    press($('#playBtn', panel), () => this.app.play(), { sound: 'play', vibrate: 25 });
    press($('#change', panel), () => this.show('collection'));
    press($('#mTeaser', panel), () => this.show('missions'));
    const hero = $('#hero', panel);
    let pose = null, poseT = 0;
    press(hero, () => { pose = 'wave'; poseT = 1.4; sfx('emote'); }, { sound: null });
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const t0 = performance.now();
    let prev = t0;
    const frame = now => {
      if (!hero.isConnected) return;
      const w = hero.clientWidth, h = hero.clientHeight;
      if (hero.width !== Math.round(w * dpr)) { hero.width = Math.round(w * dpr); hero.height = Math.round(h * dpr); }
      const ctx = hero.getContext('2d');
      const tt = (now - t0) / 1000;
      poseT -= (now - prev) / 1000; prev = now;
      if (poseT <= 0) pose = null;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, hero.width, hero.height);
      // soft spotlight + pedestal
      const g = ctx.createRadialGradient(hero.width / 2, hero.height * 0.86, 4, hero.width / 2, hero.height * 0.86, hero.width * 0.45);
      g.addColorStop(0, 'rgba(125,211,252,0.35)'); g.addColorStop(1, 'rgba(125,211,252,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, hero.width, hero.height);
      drawPortrait(ctx, s.equipped.character, hero.width / 2, hero.height * 0.56, Math.min(hero.width / 120, hero.height / 175), this.app.settings.reducedMotion ? 0 : tt, { pose, still: this.app.settings.reducedMotion });
      this.raf = requestAnimationFrame(frame);
    };
    this.raf = requestAnimationFrame(frame);
  }

  profileModal() {
    const s = this.app.save;
    const st = s.stats;
    const body = el(`<div>
      <div class="res-stats" style="margin:0 auto 14px">
        <div class="res-stat card in">${icon('play', { size: 22 })}<b class="num">${st.matches}</b><span>${t('MATCHES')}</span></div>
        <div class="res-stat card in">${icon('crown', { size: 22 })}<b class="num">${st.wins}</b><span>${t('WINS')}</span></div>
        <div class="res-stat card in">${icon('target', { size: 22 })}<b class="num">${st.kills}</b><span>${t('KILLS')}</span></div>
      </div>
      <div class="row" style="border:0"><label for="nm">${t('Player name')}</label><input id="nm" class="text-input" maxlength="12" value="${esc(s.name)}"></div>
      <div class="small" style="margin-top:8px">${t('BEST')}: #${st.bestPlace || '-'} · ${this.app.saveAvailable() ? t('Progress is saved on this device only.') : t('Storage is blocked: progress will not be kept.')}</div>
    </div>`);
    modal({
      title: s.name, body,
      actions: [{ label: t('SAVE'), cls: 'btn-primary', icon: 'check', onClick: () => {
        const v = $('#nm', body).value.trim().toUpperCase().replace(/[^A-Z0-9 _-]/g, '').slice(0, 12);
        if (v) { s.name = v; this.app.persist(); this.refreshTop(); toast(t('Saved.'), 'success'); }
      } }],
    });
  }
}
