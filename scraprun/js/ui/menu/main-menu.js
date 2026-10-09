/* The main menu and the screens behind it.

   Main menu → Play (mode select) → Practice / Survival
             → Garage
             → Settings
             → Quit (confirm) → Goodbye

   Practice, Survival and the Garage are placeholders: the game behind them
   is not built yet, and each says so plainly instead of pretending. */

import { ICONS } from '../icons.js';
import { Navigator } from './navigator.js';
import { settings, progress } from '../../core/store.js';
import { audio } from '../../core/audio.js';
import { VERSION } from '../../version.js';

const h = (html) => {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
};

const button = (action, icon, label, { cls = '', extra = '' } = {}) =>
  `<button type="button" class="mbtn ${cls}" data-nav data-action="${action}" ${extra}>
     <span class="mbtn__icon">${ICONS[icon]}</span><span class="mbtn__label">${label}</span><span class="mbtn__chev" aria-hidden="true"></span>
   </button>`;

const backButton = (label = 'BACK') =>
  `<button type="button" class="mbtn mbtn--back" data-nav data-action="back" data-sound="back">
     <span class="mbtn__icon">${ICONS.back}</span><span class="mbtn__label">${label}</span><span class="mbtn__key" aria-hidden="true">ESC</span>
   </button>`;

const panel = (title, body, { cls = '' } = {}) =>
  `<div class="panel ${cls}">
     <h2 class="panel__title">${title}</h2>
     ${body}
   </div>`;

export class MainMenu {
  constructor(stage) {
    this.el = h(`<div class="menu" aria-label="Main menu"></div>`);
    stage.append(this.el);
    this.nav = new Navigator(this.el);

    this.#hud();
    this.#footer();
    const screens = h(`<div class="menu__screens"></div>`);
    this.el.append(screens);

    const add = (id, html, opts = {}) => {
      const el = h(html);
      screens.append(el);
      this.nav.add(id, { el, ...opts });
      return el;
    };

    /* ---------- main ---------- */
    add('main', `<section class="mscreen--main" aria-label="Main menu">
      <nav class="mainnav">
        ${button('play', 'play', 'PLAY', { cls: 'mbtn--primary', extra: 'data-default' })}
        ${button('garage', 'wrench', 'GARAGE')}
        ${button('settings', 'gear', 'SETTINGS')}
        ${button('quit', 'exit', 'QUIT')}
      </nav>
    </section>`, { back: false });

    /* ---------- play: mode select ---------- */
    add('modes', `<section aria-label="Select mode">${panel('SELECT MODE', `
      <div class="modes">
        <button type="button" class="mcard" data-nav data-default data-action="practice">
          <span class="mcard__icon">${ICONS.target}</span>
          <span class="mcard__text"><span class="mcard__title">PRACTICE</span>
          <span class="mcard__desc">Fight AI machines in a simple arena.</span></span>
          <span class="mcard__tag">NOT BUILT YET</span>
        </button>
        <button type="button" class="mcard" data-nav data-action="survival">
          <span class="mcard__icon">${ICONS.skull}</span>
          <span class="mcard__text"><span class="mcard__title">SURVIVAL</span>
          <span class="mcard__desc">Hold out against endless waves.</span></span>
          <span class="mcard__tag">COMING SOON</span>
        </button>
      </div>
      ${backButton()}`, { cls: 'panel--wide' })}</section>`);

    add('practice', `<section aria-label="Practice">${panel('PRACTICE', `
      <p class="panel__lead">The practice arena isn't playable yet.</p>
      <p class="panel__text">When it's ready, this starts a match against AI machines in the Junkyard Arena.</p>
      ${backButton()}`)}</section>`);

    add('survival', `<section aria-label="Survival">${panel('SURVIVAL', `
      <p class="panel__lead">Survival mode is planned for a later build.</p>
      <p class="panel__text">Waves of scrap machines, rising difficulty, and scrap to earn for every wave you last.</p>
      ${backButton()}`)}</section>`);

    /* ---------- garage ---------- */
    const slots = ['CHASSIS', 'WHEELS', 'WEAPON', 'ARMOR', 'ENGINE', 'EXTRAS'];
    add('garage', `<section aria-label="Garage">${panel('GARAGE', `
      <p class="panel__lead">Machine building arrives in a later build.</p>
      <p class="panel__text">You'll fit parts to these slots and pay for them with scrap.</p>
      <ul class="slots">${slots.map((s) => `<li class="slot"><span class="slot__lock">${ICONS.lock}</span><span class="slot__name">${s}</span><span class="slot__state">LOCKED</span></li>`).join('')}</ul>
      ${backButton()}`, { cls: 'panel--wide' })}</section>`);

    /* ---------- settings ---------- */
    const slider = (key, label) => `
      <label class="setting" for="set-${key}">
        <span class="setting__name">${label}</span>
        <input type="range" id="set-${key}" data-nav data-key="${key}" min="0" max="100" step="5">
        <output class="setting__value" for="set-${key}"></output>
      </label>`;
    const settingsEl = add('settings', `<section aria-label="Settings">${panel('SETTINGS', `
      <h3 class="panel__section">AUDIO</h3>
      ${slider('masterVolume', 'MASTER VOLUME')}
      ${slider('musicVolume', 'MUSIC VOLUME')}
      ${slider('sfxVolume', 'SOUND EFFECTS')}
      <p class="panel__note">No music is in this build yet; the music volume applies to it once it is.</p>
      <h3 class="panel__section">DISPLAY</h3>
      <div class="setting">
        <span class="setting__name">DISPLAY MODE</span>
        <button type="button" class="toggle" id="set-display" data-nav data-action="display">
          <span class="toggle__opt" data-mode="windowed">WINDOWED</span><span class="toggle__opt" data-mode="fullscreen">FULLSCREEN</span>
        </button>
      </div>
      <p class="panel__note" data-display-note hidden>Fullscreen isn't available in this window.</p>
      ${backButton()}`, { cls: 'panel--wide' })}</section>`);
    this.#wireSettings(settingsEl);

    /* ---------- quit ---------- */
    add('quit', `<section class="mscreen--modal" aria-label="Quit">${panel('QUIT SCRAPRUN?', `
      <p class="panel__text">Your settings and scrap are saved on this device.</p>
      <div class="row">
        ${button('confirm-quit', 'exit', 'QUIT', { cls: 'mbtn--danger' })}
        ${backButton('CANCEL').replace('data-action="back"', 'data-action="back" data-default')}
      </div>`, { cls: 'panel--modal' })}</section>`);

    add('goodbye', `<section class="mscreen--modal" aria-label="Goodbye">${panel('THANKS FOR PLAYING', `
      <p class="panel__lead">You can close this tab now.</p>
      <p class="panel__text">A browser tab can only be closed by you, so SCRAPRUN stops here instead of closing it.</p>
      ${button('menu', 'back', 'BACK TO MENU', { extra: 'data-default' })}`, { cls: 'panel--modal' })}</section>`, { back: false });

    this.el.addEventListener('click', (e) => {
      const el = e.target.closest('[data-action]');
      if (el && !el.disabled) this.#act(el.dataset.action);
    });
  }

  #act(action) {
    const nav = this.nav;
    switch (action) {
      case 'play': nav.open('modes'); break;
      case 'garage': nav.open('garage'); break;
      case 'settings': nav.open('settings'); break;
      case 'quit': nav.open('quit'); break;
      case 'practice': nav.open('practice'); break;
      case 'survival': nav.open('survival'); break;
      case 'back': nav.back(); break;
      case 'display': this.#toggleFullscreen(); break;
      case 'menu': nav.reset('main'); break;
      case 'confirm-quit': this.#quit(); break;
    }
  }

  /** A desktop build can provide `window.scraprunHost.quit()` to close the
      app. In a browser there is no clean way to close a tab the script did
      not open, so we say goodbye instead. */
  #quit() {
    const host = window.scraprunHost;
    if (host && typeof host.quit === 'function') { host.quit(); return; }
    this.nav.reset('goodbye');
  }

  #hud() {
    const hud = h(`<div class="hud" role="status" aria-label="Scrap">
      <span class="hud__icon">${ICONS.scrap}</span>
      <span class="hud__value">0</span>
      <span class="hud__label">SCRAP</span>
    </div>`);
    const value = hud.querySelector('.hud__value');
    progress.subscribe((p) => { value.textContent = p.scrap.toLocaleString('en-US'); });
    this.el.append(hud);
  }

  #footer() {
    this.el.append(h(`<div class="menu__version">v${VERSION}</div>`));
    this.el.append(h(`<div class="menu__slogan">SMALL PARTS. BIG DREAMS.</div>`));
  }

  #wireSettings(root) {
    for (const input of root.querySelectorAll('input[type="range"]')) {
      const key = input.dataset.key;
      const out = input.parentElement.querySelector('output');
      const paint = (v) => {
        input.value = Math.round(v * 100);
        input.style.setProperty('--fill', `${Math.round(v * 100)}%`);
        out.textContent = `${Math.round(v * 100)}%`;
      };
      settings.subscribe((s) => paint(s[key]));
      input.addEventListener('input', () => {
        audio.unlock();
        settings.set({ [key]: Number(input.value) / 100 });
        audio.tick();
      });
    }

    const toggle = root.querySelector('#set-display');
    const note = root.querySelector('[data-display-note]');
    const supported = !!(document.fullscreenEnabled && document.documentElement.requestFullscreen);
    toggle.disabled = !supported;
    note.hidden = supported;
    const sync = () => toggle.dataset.mode = document.fullscreenElement ? 'fullscreen' : 'windowed';
    document.addEventListener('fullscreenchange', sync);
    sync();
  }

  async #toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen({ navigationUI: 'hide' });
    } catch {
      const note = this.el.querySelector('[data-display-note]');
      note.textContent = 'Fullscreen was refused by the browser in this window.';
      note.hidden = false;
    }
  }

  /** Shows the menu and hands it the keyboard. */
  open() {
    this.el.classList.add('is-open');
    this.nav.enabled = true;
    this.nav.reset('main');
  }
}
