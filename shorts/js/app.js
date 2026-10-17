/* Shorts Studio — the page: idea browser, preview, recorder. */
(function () {
  const $ = (id) => document.getElementById(id);
  const canvas = $('cv');
  const scene = new WI.Scene(canvas);
  const audio = new WI.AudioEngine();
  WI.scene = scene;

  const store = {
    get(k, d) {
      try {
        const v = localStorage.getItem('wi.' + k);
        return v == null ? d : JSON.parse(v);
      } catch (e) {
        return d;
      }
    },
    set(k, v) {
      try {
        localStorage.setItem('wi.' + k, JSON.stringify(v));
      } catch (e) {}
    },
  };
  const done = new Set(store.get('done', []));
  const settings = Object.assign({ handle: '', cta: 'FOLLOW FOR PART 2', music: 0.55, vol: 0.8, grain: true, hideDone: true, arche: 'all' }, store.get('settings', {}));

  let current = null;
  let filtered = [];
  let mode = 'idle'; // idle | play | rec
  let raf = 0;

  /* ------------------------------------------------------------ ideas list */
  const chips = $('chips');
  const archeKeys = ['all', ...Object.keys(WI.ARCHES)];
  chips.innerHTML = archeKeys
    .map((k) => `<button class="chip" data-k="${k}" aria-pressed="${k === settings.arche}">${k === 'all' ? 'All' : WI.ARCHES[k].label}</button>`)
    .join('');
  chips.addEventListener('click', (e) => {
    const b = e.target.closest('.chip');
    if (!b) return;
    settings.arche = b.dataset.k;
    chips.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', c === b));
    save();
    refresh();
  });
  $('hideDone').checked = settings.hideDone;
  $('hideDone').addEventListener('change', (e) => {
    settings.hideDone = e.target.checked;
    save();
    refresh();
  });
  $('q').addEventListener('input', refresh);

  function refresh() {
    const q = $('q').value.trim().toLowerCase();
    filtered = WI.IDEAS.filter((i) => {
      if (settings.arche !== 'all' && i.arche !== settings.arche) return false;
      if (settings.hideDone && done.has(i.id) && i !== current) return false;
      if (q && !(i.title + ' ' + (i.setting || '') + ' ' + i.arche).toLowerCase().includes(q)) return false;
      return true;
    });
    const shown = filtered.slice(0, 400);
    $('count').textContent = `${WI.fmt(filtered.length)} ${filtered.length === 1 ? 'idea matches' : 'ideas match'}` + (filtered.length > shown.length ? ` · showing first ${shown.length}` : '');
    $('list').innerHTML = shown
      .map((i) => `<li data-id="${i.id}" aria-selected="${i === current}"><span class="t">${esc(i.pre === 'WHO WINS?' ? i.title + ' — who wins?' : 'What if ' + lc(i.title))}</span>${done.has(i.id) ? '<span class="done">✓</span>' : ''}<span class="k">${WI.ARCHES[i.arche].label}${i.setting ? ' · set in ' + esc(i.setting) : ''}</span></li>`)
      .join('');
    const n = WI.IDEAS.length;
    $('stats').innerHTML = `<b>${WI.fmt(n)}</b> ideas · <b>${Object.keys(WI.ARCHES).length}</b> animation types · <b>${WI.fmt(done.size)}</b> recorded`;
  }
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const lc = (s) => s.charAt(0).toLowerCase() + s.slice(1);

  $('list').addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (!li || mode === 'rec') return;
    select(WI.IDEAS.find((i) => i.id === li.dataset.id));
  });
  $('rand').addEventListener('click', () => {
    if (mode === 'rec' || !filtered.length) return;
    select(filtered[Math.floor(Math.random() * filtered.length)]);
  });
  $('next').addEventListener('click', () => {
    if (mode === 'rec') return;
    const n = nextNew();
    if (n) select(n);
  });
  function nextNew() {
    const pool = WI.IDEAS.filter((i) => (settings.arche === 'all' || i.arche === settings.arche) && !done.has(i.id) && i !== current);
    if (!pool.length) return null;
    // Spread picks across archetypes and places instead of walking the list in order.
    return pool[(WI.hash(String(done.size) + (current ? current.id : '')) % pool.length)];
  }

  function select(idea) {
    stop();
    current = idea;
    seek(3.2); // a poster frame with the hook already on screen
    const m = WI.meta(idea);
    $('mTitle').value = m.title;
    $('mDesc').value = m.description;
    refresh();
    const li = $('list').querySelector(`[aria-selected="true"]`);
    if (li) li.scrollIntoView({ block: 'nearest' });
  }
  function load(withAudio) {
    applySettings();
    scene.load(current, withAudio ? audio : null);
    $('seek').max = scene.duration.toFixed(1);
    $('seek').value = 0;
    tick();
  }

  /* -------------------------------------------------------------- settings */
  ['handle', 'cta'].forEach((k) => {
    $(k).value = settings[k];
    $(k).addEventListener('input', (e) => {
      settings[k] = e.target.value;
      save();
      applySettings();
      if (mode === 'idle') scene.render();
    });
  });
  ['music', 'vol'].forEach((k) => {
    $(k).value = settings[k];
    $(k).addEventListener('input', (e) => {
      settings[k] = +e.target.value;
      save();
      applySettings();
    });
  });
  $('grain').checked = settings.grain;
  $('grain').addEventListener('change', (e) => {
    settings.grain = e.target.checked;
    save();
    applySettings();
  });
  $('batchN').addEventListener('input', (e) => ($('batchLbl').textContent = e.target.value));
  function applySettings() {
    scene.opts.handle = settings.handle.trim();
    scene.opts.cta = settings.cta.trim().toUpperCase();
    scene.opts.grain = settings.grain;
    scene.opts.bloom = true;
    audio.setMusicVolume(settings.music);
    audio.setVolume(settings.vol);
  }
  function save() {
    store.set('settings', settings);
  }
  document.querySelectorAll('.copy').forEach((b) =>
    b.addEventListener('click', async () => {
      const el = $(b.dataset.copy);
      try {
        await navigator.clipboard.writeText(el.value);
      } catch (e) {
        el.select();
        document.execCommand('copy');
      }
      b.textContent = 'Copied';
      setTimeout(() => (b.textContent = 'Copy'), 1200);
    })
  );

  /* ------------------------------------------------------------- playback */
  function tick() {
    $('time').textContent = scene.t.toFixed(1) + 's';
    if (mode !== 'idle') $('seek').value = scene.t;
  }
  // Frame pacing: count frames and, while recording, lighten the costliest
  // effects if this computer can't keep up, so the video stays smooth.
  const pace = { frames: 0, slow: 0, ema: 1 / 60 };
  function loop(onDone) {
    let last = performance.now();
    Object.assign(pace, { frames: 0, slow: 0, ema: 1 / 60, t0: last });
    const frame = (now) => {
      const real = (now - last) / 1000;
      const dt = Math.min(0.05, real);
      last = now;
      pace.frames++;
      pace.ema += (real - pace.ema) * 0.08;
      if (mode === 'rec' && pace.frames > 20 && pace.ema > 1 / 48) {
        if (scene.opts.grain) scene.opts.grain = false;
        else if (scene.opts.bloom && pace.ema > 1 / 44) scene.opts.bloom = false;
        pace.ema = 1 / 60;
        pace.slow++;
      }
      scene.step(dt);
      scene.render();
      tick();
      if (scene.t >= scene.duration) return onDone();
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    cancelAnimationFrame(raf);
    if (audio.ctx) audio.stopMusic(0.2);
    if (mode === 'play') mode = 'idle';
    $('play').textContent = '▶ Preview';
  }
  async function startAudio() {
    audio.init();
    applySettings();
    if (audio.ctx.state !== 'running') await audio.ctx.resume();
  }
  $('play').addEventListener('click', async () => {
    if (!current || mode === 'rec') return;
    if (mode === 'play') return stop();
    await startAudio();
    load(true);
    mode = 'play';
    $('play').textContent = '■ Stop';
    loop(() => {
      stop();
    });
  });
  // Jumping simulates silently from the start at a fixed step, so what you
  // see at 14s is exactly what the recording will show at 14s.
  $('seek').addEventListener('change', (e) => {
    if (!current || mode === 'rec') return;
    stop();
    seek(+e.target.value);
  });
  function seek(t) {
    applySettings();
    scene.load(current, null);
    $('seek').max = scene.duration.toFixed(1);
    const n = Math.round(t * 60);
    for (let i = 0; i < n && scene.t < scene.duration; i++) scene.step(1 / 60);
    scene.render();
    tick();
    $('seek').value = scene.t;
  }
  WI.seek = (t) => seek(t);

  /* ------------------------------------------------------------- recording */
  const MIMES = ['video/mp4;codecs=avc1.640028,mp4a.40.2', 'video/mp4;codecs=avc1,mp4a.40.2', 'video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'];
  const mime = window.MediaRecorder ? MIMES.find((m) => MediaRecorder.isTypeSupported(m)) : null;
  $('fmt').textContent = mime
    ? `Saving as ${mime.startsWith('video/mp4') ? 'MP4' : 'WebM'} (1080×1920, 60 fps). YouTube accepts both.`
    : 'This browser cannot record video. Use Chrome or Edge on a computer.';
  if (!mime) $('rec').disabled = $('batch').disabled = true;

  // Inside a claude.ai artifact, files reach the viewer through the
  // `downloads` capability (they confirm each save). Opened from disk, a
  // plain download link does the job.
  const framed = !!(window.claude && window.claude.use);
  const dlReady = framed ? window.claude.use('downloads').catch(() => null) : Promise.resolve(null);
  async function saveFile(blob, name) {
    const dl = await dlReady;
    if (dl) {
      try {
        await dl.save({ filename: name, data: blob });
        return 'saved';
      } catch (e) {
        return (e && e.code) || 'unavailable';
      }
    }
    if (framed) return 'unavailable';
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 60000);
    return 'saved';
  }
  const SAVE_MSG = {
    saved: 'Saved.',
    declined: 'Not saved. Use the Save button in “This session” when you want it.',
    rate_limited: 'Another save prompt is open. Finish it, then press Save again.',
    unavailable: 'Saving isn’t available in this view. Open the artifact in claude.ai to save videos.',
  };
  const clips = [];

  // Frame-by-frame rendering when the browser can encode video itself;
  // real-time recording otherwise.
  let offline = null;
  WI.offlineSupport().then((s) => {
    offline = s;
    if (s) {
      $('fmt').textContent = `Renders frame by frame: a smooth 60 fps MP4 (${s.v.mux === 'avc' ? 'H.264' : 'VP9'}) on any computer, and you can switch tabs while it works.`;
      $('rec').disabled = $('batch').disabled = false;
      $('hint').textContent = $('hint').textContent.replace(' Keep this tab visible while it records.', '');
    }
  });

  async function record(idea, opts = {}) {
    if (offline) {
      current = idea;
      await startAudio();
      refresh();
      showMeta(idea);
      mode = 'rec';
      setRecUI(true);
      let res = null;
      try {
        res = await WI.renderOffline(scene, audio, idea, (p) => {
          $('rec').textContent = `Rendering ${Math.round(p * 100)}%`;
          tick();
        });
      } catch (e) {
        console.error('Frame-by-frame render failed, falling back to live recording', e);
        offline = null;
        audio.build(audio.live, true);
      } finally {
        mode = 'idle';
        setRecUI(false);
      }
      if (res) return finish({ name: `whatif-${idea.id}.mp4`, blob: res.blob, idea, fps: 60, lightened: false, codec: res.codec }, opts);
    }
    return recordLive(idea, opts);
  }
  function showMeta(idea) {
    const m = WI.meta(idea);
    $('mTitle').value = m.title;
    $('mDesc').value = m.description;
  }
  async function finish(clip, { offer = true } = {}) {
    clips.unshift(clip);
    done.add(clip.idea.id);
    store.set('done', [...done]);
    renderClips();
    refresh();
    if (offer) await offerSave(clip);
    return clip;
  }

  async function recordLive(idea, opts) {
    current = idea;
    await startAudio();
    load(true);
    refresh();
    showMeta(idea);
    const stream = new MediaStream([...canvas.captureStream(60).getVideoTracks(), ...audio.dest.stream.getAudioTracks()]);
    const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 14e6, audioBitsPerSecond: 192e3 });
    const chunks = [];
    rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    const stopped = new Promise((res) => (rec.onstop = res));
    mode = 'rec';
    setRecUI(true);
    rec.start(250);
    await new Promise((res) => loop(res));
    const fps = pace.frames / ((performance.now() - pace.t0) / 1000);
    await new Promise((r) => setTimeout(r, 150));
    rec.stop();
    await stopped;
    stream.getVideoTracks().forEach((t) => t.stop());
    audio.stopMusic(0.1);
    mode = 'idle';
    setRecUI(false);
    applySettings(); // restore effects the pacing guard may have switched off
    const blob = new Blob(chunks, { type: mime.split(';')[0] });
    const ext = mime.startsWith('video/mp4') ? 'mp4' : 'webm';
    return finish({ name: `whatif-${idea.id}.${ext}`, blob, idea, fps, lightened: pace.slow > 0 }, opts);
  }
  async function offerSave(clip) {
    const r = await saveFile(clip.blob, clip.name);
    clip.status = r;
    renderClips();
    $('hint').textContent = SAVE_MSG[r] || SAVE_MSG.unavailable;
  }
  function setRecUI(on) {
    $('recBadge').hidden = !on;
    $('rec').classList.toggle('on', on);
    $('rec').textContent = on ? 'Recording…' : '● RECORD';
    for (const id of ['rec', 'play', 'batch', 'rand', 'next', 'seek']) $(id).disabled = on;
  }
  function renderClips() {
    const ul = $('clips');
    if (!clips.length) return void (ul.innerHTML = '<li class="small">Nothing recorded yet.</li>');
    ul.innerHTML = clips
      .map((c, i) => {
        const fps = Math.round(Math.min(60, c.fps));
        const note = fps < 55 ? ` · ${fps} fps, your computer struggled: close other tabs and re-record` : c.lightened ? ` · ${fps} fps, effects lightened` : ` · ${fps} fps`;
        return `<li><div class="clip-row"><span class="clip-name">${esc(c.name)}</span><button class="copy" data-clip="${i}">${c.status === 'saved' ? 'Save again' : 'Save'}</button></div><span class="small">${(c.blob.size / 1048576).toFixed(1)} MB${note}</span></li>`;
      })
      .join('');
    if (clips.length > 1) ul.insertAdjacentHTML('beforeend', `<li><button class="btn" id="saveAll">Save all ${clips.length} as one .zip</button></li>`);
  }
  $('clips').addEventListener('click', async (e) => {
    const b = e.target.closest('button');
    if (!b || mode === 'rec') return;
    if (b.id === 'saveAll') {
      b.disabled = true;
      b.textContent = 'Packing…';
      const zip = await WI.zip(clips.map((c) => ({ name: c.name, blob: c.blob })));
      const r = await saveFile(zip, `whatif-batch-${clips.length}-videos.zip`);
      $('hint').textContent = SAVE_MSG[r] || SAVE_MSG.unavailable;
      renderClips();
    } else if (b.dataset.clip) await offerSave(clips[+b.dataset.clip]);
  });
  $('rec').addEventListener('click', async () => {
    if (!current || mode === 'rec') return;
    stop();
    await record(current);
  });
  $('batch').addEventListener('click', async () => {
    if (mode === 'rec') return;
    stop();
    const n = Math.max(1, Math.min(framed ? 20 : 50, +$('batchN').value || 1));
    const made = [];
    for (let i = 0; i < n; i++) {
      const idea = !done.has(current && current.id) && i === 0 && current ? current : nextNew();
      if (!idea) break;
      $('hint').textContent = `Batch: video ${i + 1} of ${n}…` + (offline ? '' : ' Keep this tab visible.');
      // From disk each file downloads as it finishes; in an artifact the
      // whole batch is offered once, as a single .zip.
      made.push(await record(idea, { offer: !framed }));
      await new Promise((r) => setTimeout(r, 600));
    }
    if (framed && made.length) {
      $('hint').textContent = 'Batch finished. Packing the videos into one .zip…';
      const zip = await WI.zip(made.map((c) => ({ name: c.name, blob: c.blob })));
      const r = await saveFile(zip, `whatif-batch-${made.length}-videos.zip`);
      for (const c of made) c.status = r;
      renderClips();
      $('hint').textContent = SAVE_MSG[r] || SAVE_MSG.unavailable;
    } else $('hint').textContent = 'Batch finished. Files are in your Downloads folder.';
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && mode === 'rec' && !offline) $('hint').textContent = '⚠ The tab was hidden while recording — that video may stutter. Re-record it if so.';
  });

  if (!framed) $('hint').textContent = 'Pick an idea, preview it, then hit RECORD. The video saves to your Downloads automatically. Keep this tab visible while it records.';

  /* ------------------------------------------------------------------ boot */
  (document.fonts ? document.fonts.load('100px Anton').catch(() => {}) : Promise.resolve()).then(() => {
    refresh();
    const start = WI.IDEAS.find((i) => i.id === store.get('last')) || filtered[0] || WI.IDEAS[0];
    select(start);
  });
  window.addEventListener('beforeunload', () => current && store.set('last', current.id));
})();
