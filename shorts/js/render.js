/* Shorts Studio — frame-by-frame rendering to MP4.
   Real-time recording inherits every hiccup of the computer it runs on.
   Here each frame is simulated at exactly 1/60 s, drawn, and handed to the
   browser's own video encoder (WebCodecs); the soundtrack is rendered
   offline on the same clock and muxed in. The result is a perfect 60 fps
   file whether the machine draws 200 frames a second or 20. */
(function () {
  const { W, H } = WI;
  const FPS = 60;
  // Yields to the page without timer throttling, so a render keeps going
  // (more slowly) if the tab is in the background.
  const yieldNow = () =>
    new Promise((r) => {
      const ch = new MessageChannel();
      ch.port1.onmessage = () => r();
      ch.port2.postMessage(0);
    });

  async function pickVideo() {
    if (!window.VideoEncoder || !window.VideoFrame || !window.Mp4Muxer) return null;
    const tries = [['avc1.640033', 'avc'], ['avc1.64002A', 'avc'], ['avc1.4D402A', 'avc'], ['vp09.00.41.08', 'vp9'], ['vp09.00.40.08', 'vp9']];
    for (const [codec, mux] of tries) {
      const cfg = { codec, width: W, height: H, bitrate: 12e6, framerate: FPS, latencyMode: 'quality' };
      if (mux === 'avc') cfg.avc = { format: 'avc' };
      try {
        if ((await VideoEncoder.isConfigSupported(cfg)).supported) return { cfg, mux };
      } catch (e) {}
    }
    return null;
  }
  async function pickAudio() {
    if (!window.AudioEncoder || !window.AudioData || !window.OfflineAudioContext) return null;
    for (const [codec, mux] of [['mp4a.40.2', 'aac'], ['opus', 'opus']]) {
      const cfg = { codec, sampleRate: 48000, numberOfChannels: 2, bitrate: 192000 };
      try {
        if ((await AudioEncoder.isConfigSupported(cfg)).supported) return { cfg, mux };
      } catch (e) {}
    }
    return null;
  }
  let support;
  WI.offlineSupport = () =>
    (support =
      support ||
      (async () => {
        // Both or neither: a silent video is worse than a real-time recording.
        const v = await pickVideo(), a = v && (await pickAudio());
        return v && a ? { v, a } : null;
      })());

  WI.renderOffline = async function (scene, audio, idea, onProgress) {
    const sup = await WI.offlineSupport();
    if (!sup) throw new Error('offline rendering unsupported');
    // Dry run without sound to learn the final length: a battle can end early.
    scene.load(idea, null);
    while (scene.t < scene.duration) scene.step(1 / FPS);
    const dur = scene.duration, frames = Math.ceil(dur * FPS);

    if (sup.a) audio.beginOffline(dur + 0.5);
    scene.load(idea, sup.a ? audio : null);
    const target = new Mp4Muxer.ArrayBufferTarget();
    const muxer = new Mp4Muxer.Muxer({
      target,
      video: { codec: sup.v.mux, width: W, height: H, frameRate: FPS },
      audio: sup.a ? { codec: sup.a.mux, numberOfChannels: 2, sampleRate: 48000 } : undefined,
      fastStart: 'in-memory',
      firstTimestampBehavior: 'offset',
    });
    let failure = null;
    const venc = new VideoEncoder({ output: (c, m) => muxer.addVideoChunk(c, m), error: (e) => (failure = e) });
    venc.configure(sup.v.cfg);
    try {
      for (let i = 0; i < frames; i++) {
        if (failure) throw failure;
        scene.step(1 / FPS);
        scene.render();
        const frame = new VideoFrame(scene.canvas, { timestamp: Math.round((i * 1e6) / FPS), duration: Math.round(1e6 / FPS) });
        venc.encode(frame, { keyFrame: i % (FPS * 2) === 0 });
        frame.close();
        while (venc.encodeQueueSize > 4) await yieldNow();
        if (i % 2 === 0) {
          if (onProgress) onProgress(i / frames);
          await yieldNow();
        }
      }
      await venc.flush();
    } finally {
      if (venc.state !== 'closed') venc.close();
    }
    if (sup.a) {
      const buf = await audio.endOffline();
      await encodeAudio(buf, sup.a.cfg, muxer, dur);
    }
    muxer.finalize();
    return { blob: new Blob([target.buffer], { type: 'video/mp4' }), codec: sup.v.mux + (sup.a ? ' + ' + sup.a.mux : ', no sound') };
  };

  async function encodeAudio(buf, cfg, muxer, dur) {
    let failure = null;
    const enc = new AudioEncoder({ output: (c, m) => muxer.addAudioChunk(c, m), error: (e) => (failure = e) });
    enc.configure(cfg);
    const n = Math.min(buf.length, Math.ceil(dur * buf.sampleRate)), step = 4800;
    const L = buf.getChannelData(0), R = buf.getChannelData(1);
    for (let off = 0; off < n; off += step) {
      if (failure) throw failure;
      const len = Math.min(step, n - off);
      const data = new Float32Array(len * 2);
      data.set(L.subarray(off, off + len), 0);
      data.set(R.subarray(off, off + len), len);
      const ad = new AudioData({ format: 'f32-planar', sampleRate: buf.sampleRate, numberOfFrames: len, numberOfChannels: 2, timestamp: Math.round((off / buf.sampleRate) * 1e6), data });
      enc.encode(ad);
      ad.close();
      if (enc.encodeQueueSize > 20) await yieldNow();
    }
    await enc.flush();
    enc.close();
    if (failure) throw failure;
  }
})();
