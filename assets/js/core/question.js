/* WorksheetHub — interactive question renderers (section 8).
   Each renderer returns { node, getValue, showResult } so the player can treat
   every question type identically. Renderers never mark: they collect an
   answer and hand it to marking.js. */

import { el, esc, shuffle, hashCode, clamp } from './util.js';
import { iconHtml } from './icons.js';
import { figure } from '../data/figures.js';

const LETTERS = 'ABCDEFGH';

/** Render maths that was authored as plain text: 2x + 5 = 15 */
export function mathNode(text) {
  const html = esc(text)
    .replace(/([+\-−*×÷=<>±])/g, '<span class="op">$1</span>')
    .replace(/\^(\d+)/g, '<sup>$1</sup>');
  return el('div', { class: 'math', html });
}

/**
 * @param {object} q         the question
 * @param {object} opts      { value, disabled, onInput }
 * @returns {{node:HTMLElement, getValue:Function, focus:Function, showResult:Function}}
 */
export function renderQuestion(q, { value = undefined, disabled = false, onInput = () => {} } = {}) {
  switch (q.type) {
    case 'choice':  return renderChoice(q, value, disabled, onInput, false);
    case 'multi':   return renderChoice(q, value, disabled, onInput, true);
    case 'blank':   return renderText(q, value, disabled, onInput, false);
    case 'math':    return renderText(q, value, disabled, onInput, true);
    case 'match':   return renderMatch(q, value, disabled, onInput);
    case 'order':   return renderOrder(q, value, disabled, onInput);
    case 'graph':   return renderGraph(q, value, disabled, onInput);
    case 'label':   return renderLabel(q, value, disabled, onInput);
    case 'written': return renderWritten(q, value, disabled, onInput);
    default:        return { node: el('p', { text: 'Unsupported question type.' }), getValue: () => null, focus() {}, showResult() {} };
  }
}

/* ------------------------------ choice / multi ------------------------------ */
function renderChoice(q, value, disabled, onInput, multi) {
  let selected = multi ? [...(value ?? [])] : (value ?? null);
  const list = el('div', { class: 'opt-list', role: multi ? 'group' : 'radiogroup' });
  const buttons = [];

  q.options.forEach((opt, i) => {
    const btn = el('button', {
      class: 'opt', type: 'button', disabled: disabled || null,
      'aria-pressed': String(multi ? selected.includes(i) : selected === i),
      onclick: () => {
        if (multi) {
          const at = selected.indexOf(i);
          at >= 0 ? selected.splice(at, 1) : selected.push(i);
        } else {
          selected = i;
        }
        sync();
        onInput(getValue());
      }
    },
      el('span', { class: 'opt-key', html: multi && selected.includes(i) ? iconHtml('check', { size: 14 }) : esc(LETTERS[i]) }),
      el('span', { text: opt })
    );
    buttons.push(btn);
    list.append(btn);
  });

  function sync() {
    buttons.forEach((b, i) => {
      const on = multi ? selected.includes(i) : selected === i;
      b.setAttribute('aria-pressed', String(on));
      if (multi) b.querySelector('.opt-key').innerHTML = on ? iconHtml('check', { size: 14 }) : esc(LETTERS[i]);
    });
  }

  const getValue = () => multi ? (selected.length ? [...selected] : null) : selected;

  return {
    node: list,
    getValue,
    focus: () => buttons[0]?.focus(),
    /* Every renderer is handed the whole marking result, not just the boolean:
       a question with eight markers needs to show which of the eight were
       wrong, and that lives in result.detail. */
    showResult(result) {
      const correct = result?.correct;
      buttons.forEach((b, i) => {
        b.disabled = true;
        const isAnswer = multi ? q.answer.includes(i) : q.answer === i;
        const chosen = multi ? selected.includes(i) : selected === i;
        if (isAnswer) b.classList.add('opt-correct');
        else if (chosen && !correct) b.classList.add('opt-wrong');
      });
    }
  };
}

/* ------------------------------- blank / math ------------------------------- */
const PAD_KEYS = ['x', 'y', '+', '−', '×', '÷', '=', '(', ')', '/', '^', '√', 'π', '°', '±'];

function renderText(q, value, disabled, onInput, withPad) {
  const wrap = el('div', {});
  if (q.math) wrap.append(el('div', { style: 'margin-bottom:20px' }, mathNode(q.math)));

  const input = el('input', {
    class: `input ${withPad ? 'input-blank' : ''}`,
    type: 'text', inputmode: withPad ? 'text' : undefined,
    autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false',
    placeholder: withPad ? 'Your answer' : 'Type your answer here…',
    value: value ?? '', disabled: disabled || null,
    'aria-label': 'Your answer',
    oninput: () => onInput(input.value)
  });

  wrap.append(el('label', { class: 'label', text: 'Enter your answer:' }));
  wrap.append(withPad ? el('div', { class: 'answer-inline' }, input) : input);

  if (withPad) {
    const pad = el('div', { class: 'mathpad', role: 'group', 'aria-label': 'Maths symbols' });
    for (const k of PAD_KEYS) {
      pad.append(el('button', {
        type: 'button', text: k, disabled: disabled || null,
        'aria-label': `Insert ${k}`,
        onclick: () => {
          const at = input.selectionStart ?? input.value.length;
          input.value = input.value.slice(0, at) + k + input.value.slice(input.selectionEnd ?? at);
          input.focus();
          input.setSelectionRange(at + k.length, at + k.length);
          onInput(input.value);
        }
      }));
    }
    wrap.append(pad);
  }

  return {
    node: wrap,
    getValue: () => input.value,
    focus: () => input.focus(),
    showResult() { input.disabled = true; }
  };
}

/* --------------------------------- matching --------------------------------- */
function renderMatch(q, value, disabled, onInput) {
  /* Right-hand items are shuffled with a stable seed so the layout does not
     jump around between renders of the same question. */
  const rightOrder = shuffle(q.pairs.map((_, i) => i), hashCode(q.id ?? q.prompt));
  const pairs = { ...(value ?? {}) };     // leftIndex -> rightIndex
  let picked = null;                       // currently selected left index

  const wrap = el('div', { class: 'match-grid' });
  const leftCol = el('div', { class: 'match-col' });
  const rightCol = el('div', { class: 'match-col' });
  const leftBtns = [], rightBtns = [];

  const tag = n => n === undefined ? '' : String(n + 1);

  q.pairs.forEach((p, i) => {
    const b = el('button', {
      class: 'match-item', type: 'button', disabled: disabled || null,
      onclick: () => { picked = picked === i ? null : i; sync(); }
    }, el('span', { text: p.left }), el('span', { class: 'pair-tag' }));
    leftBtns.push(b); leftCol.append(b);
  });

  rightOrder.forEach((origIdx, slot) => {
    const b = el('button', {
      class: 'match-item', type: 'button', disabled: disabled || null,
      onclick: () => {
        if (picked === null) return;
        /* One right item can only serve one left item. */
        for (const k of Object.keys(pairs)) if (pairs[k] === origIdx) delete pairs[k];
        pairs[picked] = origIdx;
        picked = null;
        sync();
        onInput({ ...pairs });
      }
    }, el('span', { text: q.pairs[origIdx].right }), el('span', { class: 'pair-tag' }));
    rightBtns.push({ btn: b, origIdx, slot });
    rightCol.append(b);
  });

  function sync() {
    leftBtns.forEach((b, i) => {
      b.classList.toggle('is-picked', picked === i);
      b.classList.toggle('is-paired', pairs[i] !== undefined);
      b.querySelector('.pair-tag').textContent = pairs[i] !== undefined ? `→ ${tag(matchSlot(pairs[i]))}` : '';
    });
    rightBtns.forEach(({ btn, origIdx }, slot) => {
      const usedBy = Object.keys(pairs).find(k => pairs[k] === origIdx);
      btn.classList.toggle('is-paired', usedBy !== undefined);
      btn.querySelector('.pair-tag').textContent = `${slot + 1}`;
    });
  }
  const matchSlot = origIdx => rightBtns.findIndex(r => r.origIdx === origIdx);

  wrap.append(
    el('div', {}, el('p', { class: 'card-title-sm', text: 'Match these…' }), leftCol),
    el('div', {}, el('p', { class: 'card-title-sm', text: '…to these' }), rightCol)
  );
  sync();

  const help = el('p', { class: 'hint', text: 'Click an item on the left, then its partner on the right.' });

  return {
    node: el('div', {}, wrap, help),
    getValue: () => Object.keys(pairs).length ? { ...pairs } : null,
    focus: () => leftBtns[0]?.focus(),
    showResult() {
      [...leftBtns, ...rightBtns.map(r => r.btn)].forEach(b => { b.disabled = true; });
      leftBtns.forEach((b, i) => {
        b.classList.remove('is-picked');
        b.classList.toggle('is-paired', pairs[i] === i);
        if (pairs[i] !== i) b.style.borderColor = 'var(--danger)';
      });
    }
  };
}

/* --------------------------------- ordering --------------------------------- */
function renderOrder(q, value, disabled, onInput) {
  /* `order` holds indexes into q.items; the authored order is the answer, so
     the starting arrangement is shuffled. */
  let order = value ?? shuffle(q.items.map((_, i) => i), hashCode((q.id ?? q.prompt) + 'o'));
  if (order.length !== q.items.length) order = q.items.map((_, i) => i);

  const list = el('div', { class: 'order-list' });

  function move(from, to) {
    if (to < 0 || to >= order.length) return;
    const [item] = order.splice(from, 1);
    order.splice(to, 0, item);
    draw();
    onInput([...order]);
  }

  function draw() {
    list.replaceChildren(...order.map((itemIdx, pos) => el('div', { class: 'order-item', dataset: { pos } },
      el('span', { class: 'order-num', text: String(pos + 1) }),
      el('span', { class: 'grow', text: q.items[itemIdx] }),
      el('span', { class: 'order-move' },
        el('button', {
          class: 'icon-btn', type: 'button', disabled: disabled || pos === 0 || null,
          'aria-label': `Move “${q.items[itemIdx]}” up`, text: '↑',
          onclick: () => move(pos, pos - 1)
        }),
        el('button', {
          class: 'icon-btn', type: 'button', disabled: disabled || pos === order.length - 1 || null,
          'aria-label': `Move “${q.items[itemIdx]}” down`, text: '↓',
          onclick: () => move(pos, pos + 1)
        })
      )
    )));
  }
  draw();

  return {
    node: el('div', {}, list, el('p', { class: 'hint', text: 'Use the arrows to put the items in the correct order.' })),
    getValue: () => [...order],
    focus: () => list.querySelector('button')?.focus(),
    showResult() {
      [...list.querySelectorAll('button')].forEach(b => { b.disabled = true; });
      [...list.children].forEach((row, pos) => {
        row.classList.add(order[pos] === pos ? 'is-correct' : 'is-wrong');
      });
    }
  };
}

/* ---------------------------------- graph ---------------------------------- */
function renderGraph(q, value, disabled, onInput) {
  const { min = -5, max = 5 } = q.grid ?? {};
  const span = max - min;
  const size = 340, pad = 26;
  const scale = (size - pad * 2) / span;
  const toPx = (v) => pad + (v - min) * scale;
  const toPy = (v) => size - pad - (v - min) * scale;

  let point = value ?? null;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
  svg.setAttribute('width', '100%');
  svg.setAttribute('role', 'application');
  svg.setAttribute('aria-label', `Coordinate grid from ${min} to ${max} on both axes`);
  svg.style.maxWidth = '360px';
  svg.style.touchAction = 'manipulation';
  svg.style.cursor = disabled ? 'default' : 'crosshair';

  function draw() {
    const parts = [];
    for (let v = min; v <= max; v++) {
      const isAxis = v === 0;
      parts.push(`<line x1="${toPx(v)}" y1="${pad}" x2="${toPx(v)}" y2="${size - pad}"
        stroke="var(${isAxis ? '--text-2' : '--border'})" stroke-width="${isAxis ? 1.6 : 1}"/>`);
      parts.push(`<line x1="${pad}" y1="${toPy(v)}" x2="${size - pad}" y2="${toPy(v)}"
        stroke="var(${isAxis ? '--text-2' : '--border'})" stroke-width="${isAxis ? 1.6 : 1}"/>`);
    }
    for (let v = min; v <= max; v += Math.max(1, Math.round(span / 5))) {
      if (v === 0) continue;
      parts.push(`<text x="${toPx(v)}" y="${toPy(0) + 14}" font-size="9" fill="var(--text-3)" text-anchor="middle">${v}</text>`);
      parts.push(`<text x="${toPx(0) - 8}" y="${toPy(v) + 3}" font-size="9" fill="var(--text-3)" text-anchor="end">${v}</text>`);
    }
    if (point) {
      parts.push(`<circle cx="${toPx(point.x)}" cy="${toPy(point.y)}" r="7" fill="var(--primary)" stroke="var(--surface)" stroke-width="2"/>`);
      parts.push(`<text x="${toPx(point.x) + 11}" y="${toPy(point.y) - 9}" font-size="11" font-weight="700" fill="var(--primary)">(${point.x}, ${point.y})</text>`);
    }
    svg.innerHTML = parts.join('');
  }
  draw();

  function place(evt) {
    if (disabled) return;
    const rect = svg.getBoundingClientRect();
    const px = ((evt.clientX - rect.left) / rect.width) * size;
    const py = ((evt.clientY - rect.top) / rect.height) * size;
    point = {
      x: clamp(Math.round((px - pad) / scale + min), min, max),
      y: clamp(Math.round((size - pad - py) / scale + min), min, max)
    };
    draw();
    readout.textContent = `Selected point: (${point.x}, ${point.y})`;
    onInput({ ...point });
  }
  svg.addEventListener('click', place);

  const readout = el('p', { class: 'hint', 'aria-live': 'polite',
    text: point ? `Selected point: (${point.x}, ${point.y})` : 'Click the grid to place your point.' });

  /* Keyboard fallback — clicking an SVG is not an option for everyone. */
  const kx = el('input', { class: 'input', type: 'number', value: point?.x ?? '', style: 'width:90px',
    'aria-label': 'x coordinate', disabled: disabled || null, oninput: fromInputs });
  const ky = el('input', { class: 'input', type: 'number', value: point?.y ?? '', style: 'width:90px',
    'aria-label': 'y coordinate', disabled: disabled || null, oninput: fromInputs });
  function fromInputs() {
    const x = Number(kx.value), y = Number(ky.value);
    if (kx.value === '' || ky.value === '' || Number.isNaN(x) || Number.isNaN(y)) return;
    point = { x: clamp(x, min, max), y: clamp(y, min, max) };
    draw();
    readout.textContent = `Selected point: (${point.x}, ${point.y})`;
    onInput({ ...point });
  }

  return {
    node: el('div', {},
      svg, readout,
      el('div', { class: 'row', style: 'gap:8px;margin-top:8px' },
        el('span', { class: 'small muted', text: 'or type it:' }),
        el('span', { class: 'row', style: 'gap:6px' }, '(', kx, ',', ky, ')')
      )
    ),
    getValue: () => point ? { ...point } : null,
    focus: () => kx.focus(),
    showResult() {
      kx.disabled = ky.disabled = true;
      svg.style.cursor = 'default';
      const parts = svg.innerHTML;
      svg.innerHTML = parts +
        `<circle cx="${toPx(q.answer.x)}" cy="${toPy(q.answer.y)}" r="9" fill="none"
                 stroke="var(--secondary)" stroke-width="2.5" stroke-dasharray="3 3"/>`;
    }
  };
}

/* ------------------------------ written response ------------------------------ */
/* ------------------------------- label ------------------------------- */
/**
 * A diagram with numbered markers and one dropdown per marker.
 *
 * A dropdown rather than drag-and-drop: dragging is the obvious idea and the
 * wrong one here, because it fails on a touch screen without a lot of custom
 * pointer code, it is invisible to a screen reader, and it cannot be printed.
 * A native select is one tap on a phone, gives the platform picker for free,
 * and degrades to a blank line on paper.
 */
function renderLabel(q, value, disabled, onInput) {
  const fig = figure(q.figure);
  const chosen = Array.isArray(value) ? [...value] : q.markers.map(() => -1);
  const rows = [];
  let markerGroup = null;
  let active = -1;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', fig?.viewBox ?? '0 0 320 240');
  svg.setAttribute('class', 'fig-svg');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', fig ? `${fig.title}, with ${q.markers.length} numbered parts to label`
                                     : 'Diagram');

  function drawMarkers() {
    const parts = q.markers.map((m, i) => {
      const on = i === active;
      const done = chosen[i] >= 0;
      const fill = on ? 'var(--primary)' : done ? 'var(--fig-accent-line)' : 'var(--fig-bg)';
      const ink = on || done ? '#fff' : 'var(--fig-text)';
      return `<g>
        <circle cx="${m.x}" cy="${m.y}" r="11" fill="${fill}"
          stroke="var(--fig-accent-line)" stroke-width="${on ? 2.6 : 1.8}"/>
        <text x="${m.x}" y="${m.y + 3.6}" text-anchor="middle" font-size="11"
          font-weight="700" fill="${ink}" font-family="inherit">${i + 1}</text>
      </g>`;
    });
    markerGroup.innerHTML = parts.join('');
  }

  svg.innerHTML = (fig?.art ?? '') + '<g class="fig-markers"></g>';
  markerGroup = svg.querySelector('.fig-markers');
  drawMarkers();

  const list = el('ol', { class: 'label-rows' });
  q.markers.forEach((_, i) => {
    const select = el('select', {
      class: 'select label-select', disabled: disabled || null,
      'aria-label': `Label for part ${i + 1}`,
      onfocus: () => { active = i; drawMarkers(); },
      onblur: () => { active = -1; drawMarkers(); },
      onchange: () => {
        chosen[i] = Number(select.value);
        drawMarkers();
        onInput(getValue());
      }
    },
      el('option', { value: '-1', text: 'Choose a label…' }),
      q.options.map((opt, oi) => el('option', { value: String(oi), text: opt })));
    select.value = String(chosen[i] ?? -1);
    const row = el('li', { class: 'label-row' },
      el('span', { class: 'label-num', text: String(i + 1) }), select);
    rows.push({ row, select });
    list.append(row);
  });

  const getValue = () => chosen.map(v => (v === undefined ? -1 : v));

  return {
    node: el('div', { class: 'label-q' },
      el('figure', { class: 'fig-frame' }, svg,
        fig ? el('figcaption', { class: 'fig-cap', text: fig.title }) : null),
      list),
    getValue,
    focus: () => rows[0]?.select.focus(),
    showResult(result) {
      for (const { select } of rows) select.disabled = true;
      const wrong = new Set(result?.detail?.wrong ?? []);
      rows.forEach(({ row }, i) => {
        row.classList.add(wrong.has(i) ? 'is-wrong' : 'is-right');
      });
      active = -1;
      drawMarkers();
    }
  };
}

function renderWritten(q, value, disabled, onInput) {
  const area = el('textarea', {
    class: 'textarea', placeholder: 'Write your answer here…',
    disabled: disabled || null, 'aria-label': 'Your written answer',
    oninput: () => { onInput(area.value); count(); }
  });
  area.value = value ?? '';

  const counter = el('p', { class: 'hint' });
  function count() {
    const words = area.value.trim() ? area.value.trim().split(/\s+/).length : 0;
    counter.textContent = `${words} word${words === 1 ? '' : 's'} · this one is marked by you against the sample answer`;
  }
  count();

  return {
    node: el('div', {}, el('label', { class: 'label', text: 'Your answer:' }), area, counter),
    getValue: () => area.value,
    focus: () => area.focus(),
    showResult() { area.disabled = true; }
  };
}
