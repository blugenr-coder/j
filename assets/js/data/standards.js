/* Curriculum alignment.
   Schools index their schemes of work against a standards framework, so every
   topic here carries the framework domains it belongs to. These are DOMAIN
   codes — the stable top level of each framework — not individual statements:
   a domain can be stated accurately for a topic, whereas pinning a generated
   worksheet to one lettered sub-statement would be a claim this library cannot
   actually check. The UI labels them as indicative alignment for that reason.

   Frameworks referenced:
     CCSS.MATH – Common Core State Standards for Mathematics (domain codes)
     CCSS.ELA  – Common Core State Standards for English Language Arts (strands)
     NGSS      – Next Generation Science Standards (disciplinary core ideas)
     CEFR      – Common European Framework of Reference, for modern languages
     ISTE / CSTA – computing frameworks, at strand level
*/

const M = (name, codes) => ({ framework: 'CCSS.MATH', name, codes });
const E = (name, codes) => ({ framework: 'CCSS.ELA', name, codes });
const N = (name, codes) => ({ framework: 'NGSS', name, codes });
const C = (name, codes) => ({ framework: 'CEFR', name, codes });
const K = (name, codes) => ({ framework: 'CSTA', name, codes });

/** topic → the framework domains a worksheet on it sits in. */
export const STANDARDS = {
  /* ---- mathematics: Common Core domain codes ---- */
  arithmetic:   M('Operations and Algebraic Thinking · Number and Operations in Base Ten', ['K.CC', '1.OA', '3.OA', '4.NBT', '5.NBT']),
  fractions:    M('Number and Operations — Fractions', ['3.NF', '4.NF', '5.NF', '6.NS']),
  decimals:     M('Number and Operations in Base Ten', ['4.NBT', '5.NBT', '6.NS', '7.NS']),
  percentages:  M('Ratios and Proportional Relationships', ['6.RP', '7.RP']),
  algebra:      M('Expressions and Equations · Algebra', ['6.EE', '7.EE', '8.EE', 'A-SSE', 'A-REI']),
  geometry:     M('Geometry', ['2.G', '4.G', '5.G', '7.G', '8.G', 'G-CO', 'G-SRT']),
  trigonometry: M('Similarity, Right Triangles and Trigonometry', ['G-SRT', 'F-TF']),
  statistics:   M('Statistics and Probability', ['6.SP', '7.SP', '8.SP', 'S-ID', 'S-CP']),
  calculus:     M('Functions · Calculus', ['F-IF', 'F-BF']),
  measurement:  M('Measurement and Data', ['2.MD', '3.MD', '4.MD', '5.MD', 'N-Q']),
  discrete:     M('The Number System · Counting', ['7.NS', '8.NS', 'S-CP']),

  /* ---- science: NGSS disciplinary core ideas ---- */
  biology:      N('Life Science — from molecules to ecosystems', ['MS-LS1', 'MS-LS2', 'MS-LS3', 'MS-LS4', 'HS-LS1', 'HS-LS3']),
  chemistry:    N('Physical Science — matter and its interactions', ['MS-PS1', 'HS-PS1']),
  physics:      N('Physical Science — motion, energy and waves', ['MS-PS2', 'MS-PS3', 'MS-PS4', 'HS-PS2', 'HS-PS3', 'HS-PS4']),
  earth:        N('Earth and Space Science — Earth’s systems', ['MS-ESS2', 'MS-ESS3', 'HS-ESS2']),
  astronomy:    N('Earth and Space Science — Earth’s place in the universe', ['5-ESS1', 'MS-ESS1', 'HS-ESS1']),
  climate:      N('Earth and Human Activity', ['MS-ESS3', 'HS-ESS3']),
  conservation: N('Ecosystems and Biodiversity', ['MS-LS2', 'HS-LS2', 'MS-ESS3']),
  anatomy:      N('Structure, Function and Information Processing', ['MS-LS1', 'HS-LS1']),

  /* ---- English language arts: Common Core strands ---- */
  reading:      E('Reading: Literature and Informational Text', ['RL', 'RI']),
  literature:   E('Reading: Literature', ['RL']),
  writing:      E('Writing', ['W']),
  grammar:      E('Language: conventions of standard English', ['L.1', 'L.2']),
  vocabulary:   E('Language: vocabulary acquisition and use', ['L.4', 'L.5', 'L.6']),
  spelling:     E('Reading: Foundational Skills · Language', ['RF.3', 'L.2']),

  /* ---- social studies ---- */
  history:      { framework: 'C3', name: 'History — change, continuity and context', codes: ['D2.His'] },
  geography:    { framework: 'C3', name: 'Geography — spatial views of the world', codes: ['D2.Geo'] },
  civics:       { framework: 'C3', name: 'Civics — participation and deliberation', codes: ['D2.Civ'] },
  economics:    { framework: 'C3', name: 'Economics — decision making and markets', codes: ['D2.Eco'] },
  psychology:   { framework: 'APA', name: 'Psychology — scientific inquiry and content domains', codes: ['APA.SI', 'APA.BB', 'APA.DL'] },
  sociology:    { framework: 'C3', name: 'Sociology — social structures and institutions', codes: ['D2.Soc'] },
  philosophy:   { framework: 'C3', name: 'Reasoning, evidence and argument', codes: ['D3', 'D4'] },
  religions:    { framework: 'C3', name: 'Cultures, beliefs and perspectives', codes: ['D2.His', 'D2.Geo'] },

  /* ---- modern languages: CEFR levels ---- */
  spanish:      C('Modern language — communicative competence', ['A1', 'A2', 'B1', 'B2']),
  french:       C('Modern language — communicative competence', ['A1', 'A2', 'B1', 'B2']),
  german:       C('Modern language — communicative competence', ['A1', 'A2', 'B1', 'B2']),
  esl:          C('English as an additional language', ['A1', 'A2', 'B1', 'B2', 'C1']),

  /* ---- computing ---- */
  programming:  K('Algorithms and Programming', ['2-AP', '3A-AP']),
  algorithms:   K('Algorithms and Programming', ['3A-AP', '3B-AP']),
  data:         K('Data and Analysis', ['2-DA', '3A-DA']),
  web:          K('Computing Systems and Networks', ['2-NI', '3A-NI']),
  cyber:        K('Networks and the Internet — cybersecurity', ['2-NI', '3A-NI']),

  /* ---- other subjects ---- */
  nutrition:    { framework: 'NHES', name: 'Health education — nutrition and health promotion', codes: ['NHES.1', 'NHES.7'] },
  fitness:      { framework: 'SHAPE', name: 'Physical education — fitness and physical literacy', codes: ['S3', 'S4'] },
  finance:      { framework: 'JumpStart', name: 'Personal finance — spending, saving, credit and risk', codes: ['PF.1', 'PF.2', 'PF.4'] },
  accounting:   { framework: 'NBEA', name: 'Accounting — the accounting cycle and analysis', codes: ['NBEA.ACC'] },
  marketing:    { framework: 'NBEA', name: 'Marketing — the marketing mix and research', codes: ['NBEA.MKT'] },
  design:       { framework: 'NGSS/ITEEA', name: 'Engineering design and technological literacy', codes: ['MS-ETS1', 'HS-ETS1'] },
  electronics:  { framework: 'NGSS/ITEEA', name: 'Engineering design — electrical systems', codes: ['MS-ETS1', 'HS-PS3'] },
  robotics:     { framework: 'NGSS/ITEEA', name: 'Engineering design — control systems', codes: ['MS-ETS1', 'HS-ETS1'] },
  media:        E('Reading informational texts and media literacy', ['RI.7', 'SL.2']),
  'art-history':{ framework: 'NCAS', name: 'Visual arts — responding and connecting', codes: ['VA:Re', 'VA:Cn'] },
  'music-theory': { framework: 'NCAS', name: 'Music — responding and creating', codes: ['MU:Re', 'MU:Cr'] },
  drama:        { framework: 'NCAS', name: 'Theatre — creating and performing', codes: ['TH:Cr', 'TH:Pr'] },
  notes:        E('Speaking, listening and research skills', ['SL', 'W.7']),
  revision:     E('Study and research practices', ['W.7', 'SL.1']),
  exams:        E('Comprehension, argument and written response', ['RI', 'W.1'])
};

/* Which grade band a code belongs to, where the framework encodes one.
   NGSS prefixes its codes (5-ESS1, MS-LS1, HS-PS2); Common Core maths leads
   with a grade for K–8 and with a conceptual category for high school; CSTA
   uses levels 1A/1B, 2 and 3A/3B. Everything else — ELA strands, C3, CEFR — is
   written without a grade, so it applies throughout. */
const BAND_ORDER = ['early', 'elementary', 'middle', 'high', 'advanced'];

function bandOfCode(code) {
  if (/^HS-/.test(code)) return 'high';
  if (/^MS-/.test(code)) return 'middle';
  if (/^\d-/.test(code)) return 'elementary';                    // NGSS 5-ESS1
  if (/^K\./.test(code)) return 'early';                         // CCSS K.CC
  const grade = code.match(/^(\d+)\./);                          // CCSS 6.RP
  if (grade) {
    const g = Number(grade[1]);
    return g <= 5 ? 'elementary' : g <= 8 ? 'middle' : 'high';
  }
  if (/^[A-Z]-[A-Z]{2,3}$/.test(code)) return 'high';            // CCSS A-SSE, G-CO
  if (/^3[AB]-/.test(code)) return 'high';                       // CSTA 3A-AP
  if (/^2-/.test(code)) return 'middle';                         // CSTA 2-DA
  if (/^1[AB]-/.test(code)) return 'elementary';
  return null;                                                    // applies throughout
}

/**
 * The codes worth showing on a worksheet at a given band.
 * A Grade 8 quiz listing HS-LS1 alongside MS-LS1 is not alignment, it is a
 * list of everything the topic ever touches — so codes that carry a band are
 * filtered to the neighbouring ones, and codes that carry none always show.
 */
export function codesFor(topic, band) {
  const s = STANDARDS[topic];
  if (!s) return [];
  const want = BAND_ORDER.indexOf(band === 'advanced' ? 'high' : band);

  /* Codes written without a band apply throughout and always show. */
  const general = s.codes.filter(c => bandOfCode(c) === null);
  const banded = s.codes.filter(c => bandOfCode(c) !== null);
  if (want < 0 || !banded.length) return s.codes;

  /* Prefer the codes written for this band; fall back to the nearest band the
     framework actually covers, so a Grade 4 unit still shows something. */
  const exact = banded.filter(c => BAND_ORDER.indexOf(bandOfCode(c)) === want);
  if (exact.length) return [...general, ...exact];

  let best = banded[0], bestGap = Infinity;
  for (const c of banded) {
    const gap = Math.abs(BAND_ORDER.indexOf(bandOfCode(c)) - want);
    if (gap < bestGap) { bestGap = gap; best = c; }
  }
  const nearest = BAND_ORDER.indexOf(bandOfCode(best));
  return [...general, ...banded.filter(c => BAND_ORDER.indexOf(bandOfCode(c)) === nearest)];
}

/** A short label for a worksheet card or page, or null if none is mapped. */
export function alignmentFor(topic, band) {
  const s = STANDARDS[topic];
  return s ? `${s.framework} · ${codesFor(topic, band).join(', ')}` : null;
}
