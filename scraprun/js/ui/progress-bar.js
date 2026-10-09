/* The loading bar.

   It shows real progress, smoothed: the displayed value eases toward what
   the loader has actually finished and never runs ahead of it, so the bar
   cannot reach the end before the work has. 100% appears only when the
   loader says it is complete. */

export class ProgressBar {
  constructor({ tip }) {
    this.target = 0;
    this.shown = 0;
    this.complete = false;
    this.el = document.createElement('div');
    this.el.className = 'loader';
    this.el.innerHTML = `
      <div class="loader__row">
        <span class="loader__label"><span class="loader__word">LOADING</span><span class="loader__dots" aria-hidden="true"><i>.</i><i>.</i><i>.</i></span></span>
        <span class="loader__pct" aria-hidden="true">0%</span>
      </div>
      <div class="bar" role="progressbar" aria-label="Loading SCRAPRUN" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
        <div class="bar__track"></div>
        <div class="bar__fill"><div class="bar__shine"></div></div>
        <div class="bar__glass"></div>
      </div>
      <p class="tip"><span class="tip__key">TIP:</span> <span class="tip__text"></span></p>`;
    this.el.querySelector('.tip__text').textContent = tip;
    this.fill = this.el.querySelector('.bar__fill');
    this.bar = this.el.querySelector('.bar');
    this.pct = this.el.querySelector('.loader__pct');
    this.word = this.el.querySelector('.loader__word');
    this.lastPct = -1;
    this.render();
  }

  set(progress) { this.target = Math.max(this.target, Math.min(1, progress)); }

  finish() { this.complete = true; this.target = 1; }

  fail(message) {
    this.el.classList.add('is-error');
    this.word.textContent = 'LOAD FAILED';
    this.el.querySelector('.tip__key').textContent = 'ERROR:';
    this.el.querySelector('.tip__text').textContent = message;
  }

  /** Called every frame. Exponential ease toward the target, with a minimum
      speed so the last few percent do not crawl. */
  update(dt) {
    const gap = this.target - this.shown;
    if (gap > 0) {
      const step = Math.max(gap * (1 - Math.exp(-dt * 6)), Math.min(gap, dt * 0.08));
      this.shown = Math.min(this.target, this.shown + step);
    }
    /* Hold just short of full until the loader has declared completion. */
    if (!this.complete) this.shown = Math.min(this.shown, 0.995);
    this.render();
    return this.complete && this.shown >= 0.9999;
  }

  render() {
    const p = this.shown;
    this.fill.style.clipPath = `inset(0 ${((1 - p) * 100).toFixed(3)}% 0 0 round 999px)`;
    const pct = this.complete && p >= 0.9999 ? 100 : Math.min(99, Math.floor(p * 100));
    if (pct !== this.lastPct) {
      this.lastPct = pct;
      this.pct.textContent = `${pct}%`;
      this.bar.setAttribute('aria-valuenow', String(pct));
    }
  }

  showReady() {
    this.el.classList.add('is-ready');
    this.word.textContent = 'READY';
  }
}
