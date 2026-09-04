/* Diagrams a worksheet can ask a student to label.

   Every figure is inline SVG built from the same small vocabulary of strokes
   and fills, for three reasons that all matter here:

     - there is no build step and no asset pipeline, so a bitmap would mean a
       binary in the repo and a network request per question;
     - the colours are CSS custom properties, so a diagram inverts correctly in
       dark mode and prints as line art on white;
     - a figure is data, so the same drawing serves an online labelling
       question and a printed one with blank lines.

   A figure declares its parts with the coordinates of the thing being pointed
   at. The renderer places the numbered marker and draws the leader line; the
   figure never hard-codes a label position, so adding a part is one line.

   Coordinates are in the figure's own viewBox space. Keep viewBoxes at
   320×240 unless the subject genuinely needs another shape — the player sizes
   every figure to the same column width. */

const SW = 'stroke="var(--fig-line)" fill="none" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"';
const FILL = t => `fill="var(--fig-${t})" stroke="var(--fig-line)" stroke-width="1.4"`;
const TXT = 'fill="var(--fig-text)" font-size="9" font-family="inherit"';

/* ============================== biology ============================== */

const ANIMAL_CELL = {
  title: 'Animal cell',
  viewBox: '0 0 320 240',
  art: `
    <ellipse cx="160" cy="120" rx="132" ry="96" ${FILL('tint')}/>
    <circle cx="140" cy="104" r="34" ${FILL('accent')}/>
    <circle cx="140" cy="104" r="11" ${FILL('deep')}/>
    <ellipse cx="228" cy="86" rx="26" ry="13" transform="rotate(-18 228 86)" ${FILL('warm')}/>
    <path d="M215 92q13-9 26 0" ${SW}/>
    <ellipse cx="86" cy="160" rx="24" ry="12" transform="rotate(14 86 160)" ${FILL('warm')}/>
    <path d="M74 163q12-8 24 0" ${SW}/>
    <path d="M176 152q18-6 34 6t30 4" ${SW}/>
    <path d="M172 166q20-6 38 6t32 2" ${SW}/>
    <circle cx="104" cy="66" r="9" ${FILL('deep')}/>
    <circle cx="212" cy="168" r="8" ${FILL('deep')}/>
    <ellipse cx="160" cy="120" rx="132" ry="96" fill="none" stroke="var(--fig-line)" stroke-width="2.4"/>
  `,
  parts: [
    { id: 'nucleus',       label: 'nucleus',            x: 140, y: 76 },
    { id: 'nucleolus',     label: 'nucleolus',          x: 140, y: 104 },
    { id: 'mitochondrion', label: 'mitochondrion',      x: 228, y: 86 },
    { id: 'membrane',      label: 'cell membrane',      x: 160, y: 24 },
    { id: 'cytoplasm',     label: 'cytoplasm',          x: 96,  y: 118 },
    { id: 'er',            label: 'endoplasmic reticulum', x: 184, y: 152 },
    { id: 'ribosome',      label: 'ribosome',           x: 104, y: 66 },
    { id: 'lysosome',      label: 'lysosome',           x: 212, y: 168 }
  ]
};

const PLANT_CELL = {
  title: 'Plant cell',
  viewBox: '0 0 320 240',
  art: `
    <rect x="24" y="26" width="272" height="188" rx="10" ${FILL('tint')}/>
    <rect x="34" y="36" width="252" height="168" rx="6" fill="none" stroke="var(--fig-line)" stroke-width="1.4"/>
    <ellipse cx="176" cy="122" rx="86" ry="56" ${FILL('cool')}/>
    <circle cx="86" cy="86" r="26" ${FILL('accent')}/>
    <circle cx="86" cy="86" r="8" ${FILL('deep')}/>
    <ellipse cx="82" cy="164" rx="22" ry="12" transform="rotate(-16 82 164)" ${FILL('leaf')}/>
    <ellipse cx="238" cy="62" rx="22" ry="12" transform="rotate(12 238 62)" ${FILL('leaf')}/>
    <ellipse cx="246" cy="184" rx="19" ry="10" transform="rotate(-8 246 184)" ${FILL('warm')}/>
    <rect x="24" y="26" width="272" height="188" rx="10" fill="none" stroke="var(--fig-line)" stroke-width="2.6"/>
  `,
  parts: [
    { id: 'cell-wall',   label: 'cell wall',     x: 160, y: 26 },
    { id: 'membrane',    label: 'cell membrane', x: 160, y: 204 },
    { id: 'vacuole',     label: 'vacuole',       x: 176, y: 122 },
    { id: 'nucleus',     label: 'nucleus',       x: 86,  y: 86 },
    { id: 'chloroplast', label: 'chloroplast',   x: 238, y: 62 },
    { id: 'cytoplasm',   label: 'cytoplasm',     x: 60,  y: 130 },
    { id: 'mitochondrion', label: 'mitochondrion', x: 246, y: 184 }
  ]
};

const HEART = {
  title: 'The human heart',
  viewBox: '0 0 320 260',
  art: `
    <path d="M160 44c-46 0-74 32-74 78 0 52 40 88 74 116 34-28 74-64 74-116 0-46-28-78-74-78z" ${FILL('tint')}/>
    <path d="M160 52v186" ${SW} stroke-width="2"/>
    <path d="M96 128h128" ${SW}/>
    <path d="M124 66c-8 14-8 30 0 44" ${SW}/>
    <path d="M196 66c8 14 8 30 0 44" ${SW}/>
    <path d="M138 24v34" ${SW} stroke-width="3"/>
    <path d="M182 24v34" ${SW} stroke-width="3"/>
    <path d="M110 40q22 6 26 22" ${SW} stroke-width="3"/>
    <path d="M210 40q-22 6-26 22" ${SW} stroke-width="3"/>
    <path d="M118 150q20 10 0 26" ${SW}/>
    <path d="M202 150q-20 10 0 26" ${SW}/>
  `,
  parts: [
    { id: 'right-atrium',    label: 'right atrium',           x: 124, y: 92 },
    { id: 'left-atrium',     label: 'left atrium',            x: 198, y: 92 },
    { id: 'right-ventricle', label: 'right ventricle',        x: 126, y: 172 },
    { id: 'left-ventricle',  label: 'left ventricle',         x: 196, y: 172 },
    { id: 'septum',          label: 'septum',                 x: 160, y: 190 },
    { id: 'aorta',           label: 'aorta',                  x: 182, y: 26 },
    { id: 'vena-cava',       label: 'vena cava',              x: 110, y: 40 },
    { id: 'pulmonary-artery', label: 'pulmonary artery',      x: 138, y: 26 },
    { id: 'valve',           label: 'valve',                  x: 118, y: 152 }
  ]
};

const DIGESTIVE = {
  title: 'The digestive system',
  viewBox: '0 0 240 300',
  art: `
    <path d="M120 14v42" ${SW} stroke-width="4"/>
    <ellipse cx="120" cy="12" rx="20" ry="10" ${FILL('warm')}/>
    <path d="M120 56q34 4 40 30t-34 30" ${FILL('tint')}/>
    <path d="M60 132q-14 26 4 44" ${SW} stroke-width="3"/>
    <ellipse cx="52" cy="126" rx="22" ry="16" ${FILL('deep')}/>
    <ellipse cx="176" cy="132" rx="18" ry="12" ${FILL('warm')}/>
    <path d="M126 116q-40 8-46 44t42 40q44 4 46-30" ${SW} stroke-width="3"/>
    <path d="M78 200h96v70H78z" fill="none" stroke="var(--fig-line)" stroke-width="3"/>
    <path d="M96 214q22 12 44 0M96 234q22 12 44 0M96 254q22 12 44 0" ${SW}/>
    <path d="M126 270v20" ${SW} stroke-width="4"/>
  `,
  parts: [
    { id: 'mouth',          label: 'mouth',           x: 120, y: 12 },
    { id: 'oesophagus',     label: 'oesophagus',      x: 120, y: 40 },
    { id: 'stomach',        label: 'stomach',         x: 146, y: 84 },
    { id: 'liver',          label: 'liver',           x: 52,  y: 126 },
    { id: 'pancreas',       label: 'pancreas',        x: 176, y: 132 },
    { id: 'small-intestine', label: 'small intestine', x: 118, y: 160 },
    { id: 'large-intestine', label: 'large intestine', x: 126, y: 234 },
    { id: 'rectum',         label: 'rectum',          x: 126, y: 282 }
  ]
};

const RESPIRATORY = {
  title: 'The respiratory system',
  viewBox: '0 0 280 280',
  art: `
    <path d="M140 16v76" ${SW} stroke-width="5"/>
    <path d="M132 30h16M132 44h16M132 58h16M132 72h16" ${SW}/>
    <path d="M140 92q-30 6-30 30M140 92q30 6 30 30" ${SW} stroke-width="4"/>
    <path d="M108 122q-52 8-56 62t44 74q34 10 44-22V128z" ${FILL('tint')}/>
    <path d="M172 122q52 8 56 62t-44 74q-34 10-44-22V128z" ${FILL('tint')}/>
    <path d="M110 130q-16 26-14 54M170 130q16 26 14 54" ${SW}/>
    <path d="M40 250q100 26 200 0" ${SW} stroke-width="3"/>
    <circle cx="88" cy="196" r="7" ${FILL('accent')}/>
  `,
  parts: [
    { id: 'trachea',   label: 'trachea',      x: 140, y: 50 },
    { id: 'bronchus',  label: 'bronchus',     x: 112, y: 116 },
    { id: 'bronchiole', label: 'bronchiole',  x: 100, y: 168 },
    { id: 'alveolus',  label: 'alveolus',     x: 88,  y: 196 },
    { id: 'lung',      label: 'lung',         x: 196, y: 180 },
    { id: 'diaphragm', label: 'diaphragm',    x: 140, y: 254 },
    { id: 'ribs',      label: 'rib cage',     x: 44,  y: 176 }
  ]
};

const NEURON = {
  title: 'A neuron',
  viewBox: '0 0 340 200',
  art: `
    <circle cx="76" cy="100" r="30" ${FILL('tint')}/>
    <circle cx="76" cy="100" r="11" ${FILL('accent')}/>
    <path d="M52 78 26 54M50 96 18 92M54 118 24 134M70 72 62 38M88 76 104 46" ${SW} stroke-width="2"/>
    <path d="M106 100h150" ${SW} stroke-width="5"/>
    <ellipse cx="140" cy="100" rx="16" ry="9" ${FILL('warm')}/>
    <ellipse cx="182" cy="100" rx="16" ry="9" ${FILL('warm')}/>
    <ellipse cx="224" cy="100" rx="16" ry="9" ${FILL('warm')}/>
    <path d="M256 100 292 74M256 100h38M256 100 292 126" ${SW} stroke-width="2"/>
    <circle cx="296" cy="72" r="6" ${FILL('deep')}/>
    <circle cx="298" cy="100" r="6" ${FILL('deep')}/>
    <circle cx="296" cy="128" r="6" ${FILL('deep')}/>
  `,
  parts: [
    { id: 'dendrite',    label: 'dendrite',       x: 26,  y: 54 },
    { id: 'cell-body',   label: 'cell body',      x: 76,  y: 74 },
    { id: 'nucleus',     label: 'nucleus',        x: 76,  y: 100 },
    { id: 'axon',        label: 'axon',           x: 162, y: 100 },
    { id: 'myelin',      label: 'myelin sheath',  x: 182, y: 100 },
    { id: 'terminal',    label: 'axon terminal',  x: 296, y: 100 }
  ]
};

const FLOWER = {
  title: 'Parts of a flower',
  viewBox: '0 0 300 260',
  art: `
    <path d="M150 200V132" ${SW} stroke-width="4"/>
    <ellipse cx="150" cy="120" rx="14" ry="22" ${FILL('accent')}/>
    <path d="M150 98V60" ${SW} stroke-width="2"/>
    <circle cx="150" cy="54" r="9" ${FILL('warm')}/>
    <path d="M118 122q-14-34 6-52M182 122q14-34-6-52" ${SW} stroke-width="2"/>
    <ellipse cx="118" cy="64" rx="9" ry="6" transform="rotate(-24 118 64)" ${FILL('deep')}/>
    <ellipse cx="182" cy="64" rx="9" ry="6" transform="rotate(24 182 64)" ${FILL('deep')}/>
    <path d="M150 132q-64-6-78 26t78 22q92 10 78-22t-78-26z" ${FILL('tint')}/>
    <path d="M92 168q-30 16-24 34M208 168q30 16 24 34" ${SW}/>
    <path d="M150 200v52" ${SW} stroke-width="5"/>
    <path d="M150 226q-34-4-42 18" ${SW} stroke-width="2"/>
  `,
  parts: [
    { id: 'stigma',  label: 'stigma',  x: 150, y: 54 },
    { id: 'style',   label: 'style',   x: 150, y: 80 },
    { id: 'ovary',   label: 'ovary',   x: 150, y: 120 },
    { id: 'anther',  label: 'anther',  x: 182, y: 64 },
    { id: 'filament', label: 'filament', x: 178, y: 100 },
    { id: 'petal',   label: 'petal',   x: 96,  y: 150 },
    { id: 'sepal',   label: 'sepal',   x: 214, y: 190 },
    { id: 'stem',    label: 'stem',    x: 150, y: 240 }
  ]
};

const LEAF = {
  title: 'Cross-section of a leaf',
  viewBox: '0 0 320 200',
  art: `
    <rect x="20" y="34" width="280" height="18" ${FILL('cool')}/>
    <rect x="20" y="52" width="280" height="48" ${FILL('leaf')}/>
    <rect x="20" y="100" width="280" height="46" ${FILL('tint')}/>
    <rect x="20" y="146" width="280" height="18" ${FILL('cool')}/>
    <g stroke="var(--fig-line)" stroke-width="1.2">
      <line x1="56" y1="52" x2="56" y2="100"/><line x1="88" y1="52" x2="88" y2="100"/>
      <line x1="120" y1="52" x2="120" y2="100"/><line x1="152" y1="52" x2="152" y2="100"/>
      <line x1="184" y1="52" x2="184" y2="100"/><line x1="216" y1="52" x2="216" y2="100"/>
      <line x1="248" y1="52" x2="248" y2="100"/><line x1="280" y1="52" x2="280" y2="100"/>
    </g>
    <circle cx="70" cy="122" r="9" ${FILL('warm')}/><circle cx="112" cy="130" r="8" ${FILL('warm')}/>
    <circle cx="164" cy="120" r="9" ${FILL('warm')}/><circle cx="214" cy="132" r="8" ${FILL('warm')}/>
    <path d="M182 164q10 12 22 0" ${SW} stroke-width="2"/>
    <ellipse cx="182" cy="164" rx="7" ry="5" ${FILL('accent')}/>
    <ellipse cx="204" cy="164" rx="7" ry="5" ${FILL('accent')}/>
    <rect x="20" y="34" width="280" height="130" fill="none" stroke="var(--fig-line)" stroke-width="2"/>
  `,
  parts: [
    { id: 'cuticle',    label: 'waxy cuticle',    x: 160, y: 36 },
    { id: 'upper-epidermis', label: 'upper epidermis', x: 44, y: 44 },
    { id: 'palisade',   label: 'palisade layer',  x: 160, y: 74 },
    { id: 'spongy',     label: 'spongy mesophyll', x: 140, y: 124 },
    { id: 'lower-epidermis', label: 'lower epidermis', x: 60, y: 155 },
    { id: 'stoma',      label: 'stoma',           x: 193, y: 166 },
    { id: 'guard-cell', label: 'guard cell',      x: 204, y: 164 }
  ]
};

const DNA = {
  title: 'DNA structure',
  viewBox: '0 0 260 260',
  art: `
    <path d="M84 12q52 32 0 64t0 64 0 64 0 52" ${SW} stroke-width="3"/>
    <path d="M176 12q-52 32 0 64t0 64 0 64 0 52" ${SW} stroke-width="3"/>
    <g stroke="var(--fig-line)" stroke-width="1.6">
      <line x1="92" y1="44" x2="168" y2="44"/><line x1="96" y1="76" x2="164" y2="76"/>
      <line x1="92" y1="108" x2="168" y2="108"/><line x1="96" y1="140" x2="164" y2="140"/>
      <line x1="92" y1="172" x2="168" y2="172"/><line x1="96" y1="204" x2="164" y2="204"/>
    </g>
    <circle cx="118" cy="44" r="8" ${FILL('accent')}/><circle cx="142" cy="44" r="8" ${FILL('warm')}/>
    <circle cx="118" cy="108" r="8" ${FILL('leaf')}/><circle cx="142" cy="108" r="8" ${FILL('cool')}/>
    <circle cx="118" cy="172" r="8" ${FILL('warm')}/><circle cx="142" cy="172" r="8" ${FILL('accent')}/>
  `,
  parts: [
    { id: 'backbone',  label: 'sugar-phosphate backbone', x: 84,  y: 128 },
    { id: 'base',      label: 'base',                     x: 118, y: 108 },
    { id: 'base-pair', label: 'base pair',                x: 130, y: 172 },
    { id: 'hydrogen',  label: 'hydrogen bond',            x: 130, y: 44 },
    { id: 'helix',     label: 'double helix',             x: 176, y: 224 }
  ]
};

/* ============================== chemistry ============================== */

function shellAtom(title, protons, neutrons, shells) {
  const rings = shells.map((n, i) => {
    const r = 44 + i * 30;
    const dots = Array.from({ length: n }, (_, k) => {
      const a = (k / n) * Math.PI * 2 - Math.PI / 2;
      return `<circle cx="${(150 + r * Math.cos(a)).toFixed(1)}" cy="${(140 + r * Math.sin(a)).toFixed(1)}" r="5.5" ${FILL('accent')}/>`;
    }).join('');
    return `<circle cx="150" cy="140" r="${r}" fill="none" stroke="var(--fig-line)" stroke-width="1.2" stroke-dasharray="3 3"/>${dots}`;
  }).join('');
  return {
    title,
    viewBox: '0 0 300 280',
    art: `<circle cx="150" cy="140" r="26" ${FILL('deep')}/>
          <text x="150" y="137" ${TXT} text-anchor="middle" font-weight="700">${protons}p</text>
          <text x="150" y="150" ${TXT} text-anchor="middle" font-weight="700">${neutrons}n</text>
          ${rings}`,
    parts: [
      { id: 'nucleus',  label: 'nucleus',      x: 150, y: 140 },
      { id: 'proton',   label: 'proton',       x: 150, y: 133 },
      { id: 'neutron',  label: 'neutron',      x: 150, y: 148 },
      { id: 'electron', label: 'electron',     x: 150, y: 96 },
      { id: 'shell',    label: 'electron shell', x: 150 + 74, y: 140 }
    ]
  };
}

const IONIC_BOND = {
  title: 'Ionic bonding: sodium chloride',
  viewBox: '0 0 340 220',
  art: `
    <circle cx="90" cy="110" r="60" fill="none" stroke="var(--fig-line)" stroke-width="1.2" stroke-dasharray="3 3"/>
    <circle cx="90" cy="110" r="34" fill="none" stroke="var(--fig-line)" stroke-width="1.2" stroke-dasharray="3 3"/>
    <circle cx="90" cy="110" r="18" ${FILL('deep')}/>
    <text x="90" y="114" ${TXT} text-anchor="middle" font-weight="700">Na</text>
    <circle cx="250" cy="110" r="60" fill="none" stroke="var(--fig-line)" stroke-width="1.2" stroke-dasharray="3 3"/>
    <circle cx="250" cy="110" r="34" fill="none" stroke="var(--fig-line)" stroke-width="1.2" stroke-dasharray="3 3"/>
    <circle cx="250" cy="110" r="18" ${FILL('deep')}/>
    <text x="250" y="114" ${TXT} text-anchor="middle" font-weight="700">Cl</text>
    <circle cx="90" cy="50" r="6" ${FILL('warm')}/>
    <path d="M104 54q46-22 92 8" ${SW} stroke-width="2" marker-end="url(#fig-arrow)"/>
    <g ${FILL('accent')}>
      <circle cx="250" cy="50" r="5.5"/><circle cx="298" cy="88" r="5.5"/>
      <circle cx="288" cy="146" r="5.5"/><circle cx="238" cy="170" r="5.5"/>
      <circle cx="196" cy="130" r="5.5"/><circle cx="204" cy="74" r="5.5"/>
    </g>
    <text x="90" y="196" ${TXT} text-anchor="middle" font-weight="700">Na⁺</text>
    <text x="250" y="196" ${TXT} text-anchor="middle" font-weight="700">Cl⁻</text>
  `,
  parts: [
    { id: 'metal',        label: 'metal atom',          x: 90,  y: 110 },
    { id: 'non-metal',    label: 'non-metal atom',      x: 250, y: 110 },
    { id: 'transfer',     label: 'electron transfer',   x: 150, y: 44 },
    { id: 'cation',       label: 'positive ion',        x: 90,  y: 196 },
    { id: 'anion',        label: 'negative ion',        x: 250, y: 196 },
    { id: 'outer-shell',  label: 'outer shell',         x: 250, y: 50 }
  ]
};

const COVALENT_BOND = {
  title: 'Covalent bonding: a water molecule',
  viewBox: '0 0 320 220',
  art: `
    <circle cx="160" cy="120" r="46" ${FILL('cool')}/>
    <text x="160" y="126" ${TXT} text-anchor="middle" font-size="16" font-weight="700">O</text>
    <circle cx="72" cy="66" r="28" ${FILL('tint')}/>
    <text x="72" y="72" ${TXT} text-anchor="middle" font-size="13" font-weight="700">H</text>
    <circle cx="248" cy="66" r="28" ${FILL('tint')}/>
    <text x="248" y="72" ${TXT} text-anchor="middle" font-size="13" font-weight="700">H</text>
    <path d="M96 82l38 20M224 82l-38 20" ${SW} stroke-width="2.4"/>
    <circle cx="112" cy="94" r="5" ${FILL('accent')}/><circle cx="120" cy="86" r="5" ${FILL('warm')}/>
    <circle cx="208" cy="94" r="5" ${FILL('accent')}/><circle cx="200" cy="86" r="5" ${FILL('warm')}/>
    <circle cx="160" cy="80" r="5" ${FILL('accent')}/><circle cx="172" cy="80" r="5" ${FILL('accent')}/>
    <path d="M118 118q42 26 84 0" ${SW} stroke-dasharray="4 3"/>
    <text x="160" y="152" ${TXT} text-anchor="middle">bond angle</text>
  `,
  parts: [
    { id: 'shared-pair', label: 'shared pair of electrons', x: 116, y: 90 },
    { id: 'covalent',    label: 'covalent bond',            x: 115, y: 92 },
    { id: 'lone-pair',   label: 'lone pair',                x: 166, y: 80 },
    { id: 'oxygen',      label: 'oxygen atom',              x: 160, y: 120 },
    { id: 'hydrogen',    label: 'hydrogen atom',            x: 72,  y: 66 },
    { id: 'bond-angle',  label: 'bond angle',               x: 160, y: 134 }
  ]
};

/* ============================== physics ============================== */

const WAVE = {
  title: 'Parts of a wave',
  viewBox: '0 0 340 200',
  art: `
    <path d="M20 100h300" ${SW} stroke-dasharray="5 4"/>
    <path d="M20 100q20-60 40 0t40 0 40 0 40 0 40 0 40 0 40 0" fill="none"
      stroke="var(--fig-accent-line)" stroke-width="2.6"/>
    <path d="M60 40v60M100 100v60" ${SW} stroke-dasharray="3 3"/>
    <path d="M60 24h80" ${SW} stroke-width="2"/>
    <path d="M60 24v-8M140 24v-8" ${SW} stroke-width="2"/>
    <path d="M172 100v-38" ${SW} stroke-width="2"/>
    <path d="M168 62h8" ${SW} stroke-width="2"/>
  `,
  parts: [
    { id: 'crest',      label: 'crest',       x: 60,  y: 62 },
    { id: 'trough',     label: 'trough',      x: 100, y: 138 },
    { id: 'wavelength', label: 'wavelength',  x: 100, y: 24 },
    { id: 'amplitude',  label: 'amplitude',   x: 172, y: 80 },
    { id: 'rest',       label: 'rest position', x: 280, y: 100 }
  ]
};

const CIRCUIT = {
  title: 'A series circuit',
  viewBox: '0 0 320 200',
  art: `
    <path d="M40 50h240v100H40z" ${SW} stroke-width="2"/>
    <path d="M132 50h56" stroke="var(--fig-bg)" stroke-width="6"/>
    <path d="M144 38v24M156 44v12M168 38v24" ${SW} stroke-width="2.4"/>
    <circle cx="280" cy="100" r="16" ${FILL('warm')}/>
    <path d="M269 89l22 22M291 89l-22 22" ${SW} stroke-width="1.6"/>
    <path d="M40 88v24" stroke="var(--fig-bg)" stroke-width="6"/>
    <rect x="30" y="86" width="20" height="28" ${FILL('tint')}/>
    <path d="M96 150h48" stroke="var(--fig-bg)" stroke-width="6"/>
    <circle cx="120" cy="150" r="12" fill="none" stroke="var(--fig-line)" stroke-width="1.8"/>
    <text x="120" y="154" ${TXT} text-anchor="middle" font-weight="700">A</text>
    <path d="M196 150l24-14" ${SW} stroke-width="2.4"/>
    <circle cx="196" cy="150" r="3" fill="var(--fig-line)"/><circle cx="224" cy="150" r="3" fill="var(--fig-line)"/>
  `,
  parts: [
    { id: 'cell',     label: 'cell',      x: 156, y: 50 },
    { id: 'lamp',     label: 'lamp',      x: 280, y: 100 },
    { id: 'resistor', label: 'resistor',  x: 40,  y: 100 },
    { id: 'ammeter',  label: 'ammeter',   x: 120, y: 150 },
    { id: 'switch',   label: 'switch',    x: 210, y: 144 },
    { id: 'wire',     label: 'wire',      x: 70,  y: 50 }
  ]
};

const FORCES = {
  title: 'Forces on a moving object',
  viewBox: '0 0 320 220',
  art: `
    <rect x="120" y="90" width="80" height="46" rx="6" ${FILL('tint')}/>
    <path d="M200 113h84" ${SW} stroke-width="3"/><path d="M284 113l-12-7v14z" fill="var(--fig-line)"/>
    <path d="M120 113H44" ${SW} stroke-width="3"/><path d="M44 113l12-7v14z" fill="var(--fig-line)"/>
    <path d="M160 90V22" ${SW} stroke-width="3"/><path d="M160 22l-7 12h14z" fill="var(--fig-line)"/>
    <path d="M160 136v68" ${SW} stroke-width="3"/><path d="M160 204l-7-12h14z" fill="var(--fig-line)"/>
    <path d="M20 160h280" ${SW} stroke-dasharray="4 4"/>
  `,
  parts: [
    { id: 'thrust',    label: 'thrust',       x: 250, y: 104 },
    { id: 'drag',      label: 'drag',         x: 74,  y: 104 },
    { id: 'lift',      label: 'lift',         x: 168, y: 46 },
    { id: 'weight',    label: 'weight',       x: 168, y: 182 },
    { id: 'resultant', label: 'resultant force', x: 160, y: 113 }
  ]
};

/* ============================== earth science ============================== */

const EARTH_LAYERS = {
  title: 'The structure of the Earth',
  viewBox: '0 0 280 280',
  art: `
    <circle cx="140" cy="140" r="126" ${FILL('tint')}/>
    <circle cx="140" cy="140" r="96" ${FILL('cool')}/>
    <circle cx="140" cy="140" r="58" ${FILL('warm')}/>
    <circle cx="140" cy="140" r="28" ${FILL('accent')}/>
    <path d="M140 14v252" stroke="var(--fig-line)" stroke-width="1" stroke-dasharray="3 4"/>
  `,
  parts: [
    { id: 'crust',       label: 'crust',        x: 140, y: 24 },
    { id: 'mantle',      label: 'mantle',       x: 140, y: 62 },
    { id: 'outer-core',  label: 'outer core',   x: 140, y: 100 },
    { id: 'inner-core',  label: 'inner core',   x: 140, y: 140 }
  ]
};

const WATER_CYCLE = {
  title: 'The water cycle',
  viewBox: '0 0 340 240',
  art: `
    <path d="M0 190q60-24 120-6t120-10 100 6v60H0z" ${FILL('cool')}/>
    <path d="M180 190q40-56 92-56t68 34" ${FILL('tint')}/>
    <ellipse cx="96" cy="52" rx="46" ry="22" ${FILL('tint')}/>
    <ellipse cx="128" cy="44" rx="30" ry="18" ${FILL('tint')}/>
    <path d="M48 176q-6-52 24-92" ${SW} stroke-width="2" stroke-dasharray="5 4"/>
    <path d="M72 84l-4-12 12 3z" fill="var(--fig-line)"/>
    <path d="M84 80q30-26 62 4" ${SW} stroke-width="2"/>
    <g stroke="var(--fig-accent-line)" stroke-width="2.2" stroke-linecap="round">
      <line x1="106" y1="82" x2="100" y2="104"/><line x1="126" y1="84" x2="120" y2="106"/>
      <line x1="146" y1="82" x2="140" y2="104"/>
    </g>
    <path d="M244 158q-36 12-52 32" ${SW} stroke-width="2" stroke-dasharray="4 4"/>
    <circle cx="288" cy="120" r="4" ${FILL('accent')}/>
  `,
  parts: [
    { id: 'evaporation',   label: 'evaporation',   x: 48,  y: 140 },
    { id: 'condensation',  label: 'condensation',  x: 110, y: 46 },
    { id: 'precipitation', label: 'precipitation', x: 124, y: 96 },
    { id: 'runoff',        label: 'surface runoff', x: 220, y: 176 },
    { id: 'collection',    label: 'collection',    x: 60,  y: 210 },
    { id: 'transpiration', label: 'transpiration', x: 288, y: 120 }
  ]
};

const VOLCANO = {
  title: 'Inside a volcano',
  viewBox: '0 0 320 240',
  art: `
    <path d="M10 220 130 60h60l120 160z" ${FILL('tint')}/>
    <path d="M132 60h56l-14-22h-28z" ${FILL('warm')}/>
    <path d="M158 220V96" ${SW} stroke-width="7" stroke-linecap="butt"/>
    <path d="M158 150q-40 6-58 34" ${SW} stroke-width="4"/>
    <ellipse cx="160" cy="228" rx="72" ry="16" ${FILL('accent')}/>
    <path d="M146 38q10-22 28 0" ${SW} stroke-width="2"/>
    <g stroke="var(--fig-line)" stroke-width="1" opacity=".6">
      <line x1="30" y1="200" x2="290" y2="200"/><line x1="60" y1="180" x2="260" y2="180"/>
    </g>
  `,
  parts: [
    { id: 'crater',     label: 'crater',        x: 160, y: 44 },
    { id: 'vent',       label: 'main vent',     x: 158, y: 130 },
    { id: 'side-vent',  label: 'secondary vent', x: 116, y: 176 },
    { id: 'magma',      label: 'magma chamber', x: 160, y: 228 },
    { id: 'layers',     label: 'layers of ash and lava', x: 70, y: 190 },
    { id: 'lava',       label: 'lava flow',     x: 200, y: 100 }
  ]
};

const RIVER = {
  title: 'Features of a river',
  viewBox: '0 0 340 220',
  art: `
    <path d="M28 30q14 46 42 58t26 44 48 34 60 6 106 20" fill="none"
      stroke="var(--fig-cool-line)" stroke-width="9" stroke-linecap="round"/>
    <path d="M28 30q14 46 42 58t26 44 48 34 60 6 106 20" fill="none"
      stroke="var(--fig-line)" stroke-width="1" stroke-dasharray="2 5"/>
    <path d="M20 20l16 6-6 14z" ${FILL('accent')}/>
    <path d="M300 178q28 8 30 24l-40-4z" ${FILL('tint')}/>
    <path d="M66 74q20 6 26 22" ${SW} stroke-width="4"/>
    <path d="M170 158q26-20 52-6" ${SW} stroke-width="3"/>
  `,
  parts: [
    { id: 'source',    label: 'source',     x: 28,  y: 26 },
    { id: 'tributary', label: 'tributary',  x: 88,  y: 92 },
    { id: 'meander',   label: 'meander',    x: 196, y: 152 },
    { id: 'mouth',     label: 'mouth',      x: 292, y: 178 },
    { id: 'delta',     label: 'delta',      x: 320, y: 200 },
    { id: 'watershed', label: 'watershed',  x: 56,  y: 44 }
  ]
};

/* ============================== geometry ============================== */

const TRIANGLE = {
  title: 'A labelled triangle',
  viewBox: '0 0 320 220',
  art: `
    <path d="M50 180h220L162 34z" ${FILL('tint')}/>
    <path d="M50 180h220L162 34z" fill="none" stroke="var(--fig-line)" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M50 180a22 22 0 0 1 12-19" ${SW} stroke-width="1.8"/>
    <path d="M270 180a22 22 0 0 0-15-18" ${SW} stroke-width="1.8"/>
    <path d="M150 56a22 22 0 0 0 24 1" ${SW} stroke-width="1.8"/>
    <circle cx="50" cy="180" r="4" fill="var(--fig-line)"/>
    <circle cx="270" cy="180" r="4" fill="var(--fig-line)"/>
    <circle cx="162" cy="34" r="4" fill="var(--fig-line)"/>
  `,
  parts: [
    { id: 'vertex',   label: 'vertex',           x: 162, y: 34 },
    { id: 'base',     label: 'base',             x: 160, y: 180 },
    { id: 'side',     label: 'side',             x: 100, y: 106 },
    { id: 'interior', label: 'interior angle',   x: 66,  y: 168 },
    { id: 'apex',     label: 'apex angle',       x: 162, y: 58 }
  ]
};

const RIGHT_TRIANGLE = {
  title: 'A right-angled triangle',
  viewBox: '0 0 300 220',
  art: `
    <path d="M50 180h180V50z" ${FILL('tint')}/>
    <path d="M50 180h180V50z" fill="none" stroke="var(--fig-line)" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M212 180v-18h18" ${SW} stroke-width="1.8"/>
    <path d="M50 180a30 30 0 0 1 18-24" ${SW} stroke-width="1.8"/>
    <text x="62" y="164" ${TXT} font-weight="700">θ</text>
  `,
  parts: [
    { id: 'hypotenuse', label: 'hypotenuse',   x: 138, y: 112 },
    { id: 'opposite',   label: 'opposite',     x: 230, y: 116 },
    { id: 'adjacent',   label: 'adjacent',     x: 140, y: 180 },
    { id: 'right-angle', label: 'right angle', x: 221, y: 171 },
    { id: 'theta',      label: 'angle θ',      x: 68,  y: 168 }
  ]
};

const CIRCLE_PARTS = {
  title: 'Parts of a circle',
  viewBox: '0 0 300 300',
  art: `
    <circle cx="150" cy="150" r="112" ${FILL('tint')}/>
    <circle cx="150" cy="150" r="112" fill="none" stroke="var(--fig-line)" stroke-width="2.4"/>
    <path d="M150 150h112" ${SW} stroke-width="2.2"/>
    <path d="M38 150h224" ${SW} stroke-width="2.2"/>
    <path d="M70 79l112 112" ${SW} stroke-width="2" stroke-dasharray="5 4"/>
    <path d="M262 38v224" ${SW} stroke-width="2"/>
    <circle cx="150" cy="150" r="4" fill="var(--fig-line)"/>
    <path d="M150 150 62 82a112 112 0 0 1 60-30z" ${FILL('accent')} opacity=".55"/>
  `,
  parts: [
    { id: 'radius',    label: 'radius',        x: 206, y: 150 },
    { id: 'diameter',  label: 'diameter',      x: 96,  y: 150 },
    { id: 'chord',     label: 'chord',         x: 126, y: 135 },
    { id: 'tangent',   label: 'tangent',       x: 262, y: 210 },
    { id: 'centre',    label: 'centre',        x: 150, y: 150 },
    { id: 'circumference', label: 'circumference', x: 150, y: 38 },
    { id: 'sector',    label: 'sector',        x: 112, y: 104 },
    { id: 'arc',       label: 'arc',           x: 74,  y: 92 }
  ]
};

const PARALLEL_LINES = {
  title: 'Angles on parallel lines',
  viewBox: '0 0 320 240',
  art: `
    <path d="M20 80h280M20 176h280" ${SW} stroke-width="2.4"/>
    <path d="M92 20l124 200" ${SW} stroke-width="2.4"/>
    <path d="M150 74l4 8M150 170l4 8" ${SW}/>
    <path d="M270 74l-6 6 6 6M270 170l-6 6 6 6" ${SW} stroke-width="1.6"/>
    <circle cx="128" cy="80" r="4" fill="var(--fig-line)"/>
    <circle cx="188" cy="176" r="4" fill="var(--fig-line)"/>
  `,
  parts: [
    { id: 'corresponding', label: 'corresponding angles', x: 152, y: 64 },
    { id: 'alternate',     label: 'alternate angles',     x: 158, y: 160 },
    { id: 'co-interior',   label: 'co-interior angles',   x: 116, y: 128 },
    { id: 'vertically',    label: 'vertically opposite angles', x: 104, y: 64 },
    { id: 'transversal',   label: 'transversal',          x: 210, y: 210 },
    { id: 'parallel',      label: 'parallel lines',       x: 44,  y: 80 }
  ]
};

const CUBE = {
  title: 'A cube',
  viewBox: '0 0 300 240',
  art: `
    <path d="M70 80h120v120H70z" ${FILL('tint')}/>
    <path d="M70 80l50-42h120l-50 42M190 80l50-42v120l-50 42" ${FILL('cool')}/>
    <path d="M70 80h120v120H70zM70 80l50-42h120l-50 42M190 80l50-42v120l-50 42"
      fill="none" stroke="var(--fig-line)" stroke-width="2.2" stroke-linejoin="round"/>
    <circle cx="70" cy="80" r="4.5" fill="var(--fig-line)"/>
  `,
  parts: [
    { id: 'face',   label: 'face',   x: 130, y: 140 },
    { id: 'edge',   label: 'edge',   x: 130, y: 200 },
    { id: 'vertex', label: 'vertex', x: 70,  y: 80 }
  ]
};

/* =============================== registry =============================== */

export const FIGURES = {
  'animal-cell': ANIMAL_CELL,
  'plant-cell': PLANT_CELL,
  heart: HEART,
  digestive: DIGESTIVE,
  respiratory: RESPIRATORY,
  neuron: NEURON,
  flower: FLOWER,
  leaf: LEAF,
  dna: DNA,
  'atom-carbon': shellAtom('A carbon atom', 6, 6, [2, 4]),
  'atom-sodium': shellAtom('A sodium atom', 11, 12, [2, 8, 1]),
  'atom-oxygen': shellAtom('An oxygen atom', 8, 8, [2, 6]),
  'ionic-bond': IONIC_BOND,
  'covalent-bond': COVALENT_BOND,
  wave: WAVE,
  circuit: CIRCUIT,
  forces: FORCES,
  'earth-layers': EARTH_LAYERS,
  'water-cycle': WATER_CYCLE,
  volcano: VOLCANO,
  river: RIVER,
  triangle: TRIANGLE,
  'right-triangle': RIGHT_TRIANGLE,
  circle: CIRCLE_PARTS,
  'parallel-lines': PARALLEL_LINES,
  cube: CUBE
};

export const figure = id => FIGURES[id] ?? null;
