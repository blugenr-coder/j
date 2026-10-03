/* Settings, grouped into cards. Every control applies immediately and saves.
   Also used inside the pause menu (compact = true). */
import { icon } from './Icons.js';
import { el, $, $$, press, toast, modal, esc } from './dom.js';
import { t, LANGUAGES } from './i18n.js';

function toggle(key, label, on) {
  return `<div class="row"><span class="lbl" id="l-${key}">${t(label)}</span><button class="toggle" role="switch" aria-labelledby="l-${key}" aria-checked="${on}" data-toggle="${key}"><span class="st">${on ? t('ON') : t('OFF')}</span></button></div>`;
}
function slider(key, label, v, min, max, step) {
  const p = ((v - min) / (max - min)) * 100;
  return `<div class="row"><label for="s-${key}">${t(label)}</label><input type="range" id="s-${key}" data-slider="${key}" min="${min}" max="${max}" step="${step}" value="${v}" style="--p:${p}%"></div>`;
}
function seg(key, label, v, opts) {
  return `<div class="row"><span class="lbl">${t(label)}</span><div class="seg" role="radiogroup" aria-label="${t(label)}">${opts.map(([val, txt]) => `<button role="radio" aria-checked="${v === val}" class="${v === val ? 'on' : ''}" data-seg="${key}" data-val="${val}">${t(txt)}</button>`).join('')}</div></div>`;
}

export function settingsHTML(st, compact = false) {
  return `
    <div class="set-card card"><h3>${icon('gamepad', { size: 18 })}${t('GAMEPLAY')}</h3>
      ${slider('aimAssist', 'Aim assist', st.aimAssist, 0, 1, 0.05)}
    </div>
    <div class="set-card card"><h3>${icon('sound', { size: 18 })}${t('AUDIO')}</h3>
      ${slider('sound', 'Sound', st.sound, 0, 1, 0.05)}
      ${slider('music', 'Music', st.music, 0, 1, 0.05)}
      ${toggle('vibration', 'Vibration', st.vibration)}
    </div>
    <div class="set-card card"><h3>${icon('sliders', { size: 18 })}${t('CONTROLS')}</h3>
      ${slider('sensitivity', 'Sensitivity', st.sensitivity, 0.6, 1.6, 0.05)}
      ${slider('joystickSize', 'Joystick size', st.joystickSize, 0.8, 1.3, 0.05)}
      ${seg('joystickMode', 'Joystick', st.joystickMode, [['floating', 'FLOATING'], ['fixed', 'FIXED']])}
      ${slider('buttonSize', 'Button size', st.buttonSize, 0.8, 1.3, 0.05)}
    </div>
    <div class="set-card card"><h3>${icon('eye', { size: 18 })}${t('GRAPHICS')}</h3>
      ${seg('graphics', 'Quality', st.graphics, [['high', 'HIGH'], ['low', 'LOW']])}
      ${toggle('showFps', 'Show FPS', st.showFps)}
    </div>
    <div class="set-card card"><h3>${icon('info', { size: 18 })}${t('ACCESSIBILITY')}</h3>
      ${toggle('highContrast', 'High contrast', st.highContrast)}
      ${toggle('largeUi', 'Large UI', st.largeUi)}
      ${toggle('reducedMotion', 'Reduced motion', st.reducedMotion)}
    </div>
    ${compact ? '' : `<div class="set-card card"><h3>${icon('user', { size: 18 })}${t('ACCOUNT')}</h3>
      <div class="row"><label for="lang">${t('Language')}</label><select id="lang" class="select">${LANGUAGES.map(([v, n]) => `<option value="${v}" ${st.language === v ? 'selected' : ''}>${n}</option>`).join('')}</select></div>
      <div class="row"><label for="pname">${t('Player name')}</label><input id="pname" class="text-input" maxlength="12"></div>
      <div class="row"><span class="lbl">${t('Replay tutorial')}</span><button class="btn btn-secondary btn-sm" id="tut">${icon('play', { size: 16 })}</button></div>
    </div>`}`;
}

/* Wire all controls inside `root`. onChange(key) after every change. */
export function bindSettings(root, app, onChange = () => {}) {
  const st = app.settings;
  const commit = key => { app.applySettings(); app.persist(); onChange(key); };
  $$('[data-toggle]', root).forEach(b => press(b, () => {
    const k = b.dataset.toggle;
    st[k] = !st[k];
    b.setAttribute('aria-checked', st[k]);
    b.querySelector('.st').textContent = st[k] ? t('ON') : t('OFF');
    if (k === 'vibration' && st[k]) app.audio.vibrate(30);
    commit(k);
  }, { sound: 'click' }));
  $$('[data-slider]', root).forEach(inp => {
    const k = inp.dataset.slider;
    const upd = () => {
      st[k] = Number(inp.value);
      inp.style.setProperty('--p', `${((st[k] - inp.min) / (inp.max - inp.min)) * 100}%`);
      app.applySettings();
    };
    inp.addEventListener('input', upd);
    inp.addEventListener('change', () => { upd(); app.persist(); if (k === 'sound') app.audio.play('pickup'); onChange(k); });
  });
  $$('[data-seg]', root).forEach(b => press(b, () => {
    const k = b.dataset.seg;
    st[k] = b.dataset.val;
    $$(`[data-seg="${k}"]`, root).forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-checked', x === b); });
    commit(k);
  }));
  const lang = $('#lang', root);
  if (lang) lang.addEventListener('change', () => { st.language = lang.value; commit('language'); });
  const nm = $('#pname', root);
  if (nm) {
    nm.value = app.save.name;
    nm.addEventListener('change', () => {
      const v = nm.value.trim().toUpperCase().replace(/[^A-Z0-9 _-]/g, '').slice(0, 12);
      if (v) { app.save.name = v; app.persist(); toast(t('Saved.'), 'success', 1000); onChange('name'); }
    });
  }
  const tut = $('#tut', root);
  if (tut) press(tut, () => { app.save.tutorialDone = false; app.persist(); toast(t('Replay tutorial') + ' ✓', 'success', 1200); });
}

export function renderSettings({ app, menu, panel }) {
  const draw = () => {
    panel.innerHTML = `<div class="panel-head"><h1 class="h2">${t('SETTINGS')}</h1></div>
      <div class="scroll">${settingsHTML(app.settings)}
        <div class="settings-actions">
          <button class="btn btn-secondary" id="resetS">${icon('reload', { size: 20 })}<span>${t('RESET SETTINGS')}</span></button>
          <button class="btn btn-danger" id="resetP">${icon('warning', { size: 20 })}<span>${t('RESET PROGRESS')}</span></button>
        </div>
        <p class="small disclaimer">Battlelands Remake · ${app.saveAvailable() ? t('Progress is saved on this device only.') : t('Storage is blocked: progress will not be kept.')}</p>
      </div>`;
    bindSettings(panel, app, k => { if (k === 'language') { menu.mount('settings'); } else if (k === 'name') menu.refreshTop(); });
    press($('#resetS', panel), () => {
      app.resetSettings();
      toast(t('Settings restored.'), 'success');
      menu.mount('settings');
    });
    press($('#resetP', panel), () => {
      modal({
        title: t('RESET PROGRESS'), body: `<p>${esc(t('Reset all progress? Level, coins and items will be lost.'))}</p>`,
        actions: [
          { label: t('RESET PROGRESS'), cls: 'btn-danger', icon: 'warning', onClick: () => { app.resetProgress(); toast(t('Progress reset.'), 'success'); menu.mount('settings'); } },
          { label: t('CANCEL'), cls: 'btn-secondary', sound: 'back' },
        ],
      });
    });
  };
  draw();
  void el;
}
