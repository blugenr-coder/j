/* Curriculum coverage.

   A library can be large and still be missing the thing a teacher types in.
   Searching for "mitosis", "apostrophe", "Roman numerals" or "the Tudors" once
   returned nothing here, while worksheets covering all of them sat in the
   catalogue — the index could not see inside a unit, and a whole strand of
   school history had never been written.

   This is the list of terms a search has to answer. It is not a test of the
   search engine; it is a test of whether the content exists. When a term here
   returns nothing, the fix is usually to write the unit.

   Runs against the modules directly, so it needs no server:
     node tools/check-coverage.mjs
*/

import { searchExercises } from '../assets/js/core/search.js';
import { FAMILIES, TOTAL } from '../assets/js/data/exercises.js';
import { UNITS } from '../assets/js/data/units.js';
import { GRADES, SUBJECTS } from '../assets/js/data/catalog.js';

/* Terms taken from published curricula, grouped the way a teacher would think
   of them. Every one of these should find something. */
const TERMS = {
  'Number and algebra': ['place value', 'roman numerals', 'fractions', 'decimals', 'percentages',
    'ratio', 'indices', 'surds', 'standard form', 'inequalities', 'quadratic', 'simultaneous equations',
    'sequences', 'logarithm', 'exponential', 'vectors', 'matrices', 'times tables'],
  'Geometry and measure': ['angles', 'triangles', 'circle theorems', 'pythagoras', 'trigonometry',
    'bearings', 'transformations', 'similar triangles', 'area and perimeter', 'volume', 'symmetry',
    'loci', 'nets'],
  'Statistics': ['mean', 'median', 'mode', 'range', 'standard deviation', 'histogram', 'box plot',
    'scatter graph', 'correlation', 'probability', 'venn diagram', 'sampling'],
  'Biology': ['cells', 'mitosis', 'osmosis', 'diffusion', 'photosynthesis', 'respiration', 'krebs',
    'enzyme', 'dna', 'genetics', 'natural selection', 'variation', 'adaptation', 'food web',
    'homeostasis', 'immune system', 'hormone', 'nervous system', 'digestion', 'kidney',
    'vaccination', 'herd immunity', 'food chain', 'habitat'],
  'Chemistry': ['atomic structure', 'isotope', 'periodic table', 'ionic bonding', 'covalent bonding',
    'mole', 'electrolysis', 'titration', 'catalyst', 'equilibrium', 'alkane', 'polymer', 'alloy',
    'chromatography', 'acids and bases', 'allotrope', 'graphene', 'nanoparticle'],
  'Physics': ['forces', 'newton', 'momentum', 'energy', 'specific heat', 'density', 'pressure',
    'moments', 'waves', 'refraction', 'lens', 'circuits', 'electromagnet', 'transformer',
    'radioactivity', 'half life', 'nuclear fission', 'solar system', 'red shift',
    'doppler effect', 'spring constant', 'boyle law', 'shadows', 'magnets'],
  'English language': ['noun', 'verb', 'adjective', 'adverb', 'apostrophe', 'semicolon',
    'relative clause', 'subordinate clause', 'fronted adverbial', 'subjunctive', 'modal verb',
    'active voice', 'passive voice', 'prefix', 'suffix', 'homophone', 'spelling rules'],
  'English literature': ['metaphor', 'simile', 'alliteration', 'onomatopoeia', 'sonnet',
    'iambic pentameter', 'shakespeare', 'soliloquy', 'dramatic irony', 'narrator', 'myth', 'fable'],
  'History': ['ancient egypt', 'ancient greece', 'romans', 'anglo saxons', 'vikings', 'normans',
    'tudors', 'victorian', 'industrial revolution', 'slavery', 'american revolution', 'civil war',
    'suffragette', 'world war', 'cold war', 'civil rights', 'sources and evidence',
    'maya', 'aztec', 'inca', 'songhai', 'mali empire', 'trans-atlantic slave trade',
    'vietnam war', 'suez', 'irish famine', 'gold rush', 'harlem renaissance',
    'persian empire', 'opium wars', 'boxer rebellion', 'arab spring'],
  'Geography': ['maps', 'contour lines', 'rivers', 'coastal erosion', 'plate boundary', 'volcano',
    'earthquake', 'weather', 'climate', 'water cycle', 'settlements', 'urbanisation', 'population',
    'development', 'tourism', 'globalisation', 'glaciation', 'moraine', 'corrie'],
  'Computing': ['algorithm', 'flowchart', 'pseudocode', 'iteration', 'variable scope', 'binary',
    'hexadecimal', 'binary search', 'sorting', 'network', 'protocol', 'encryption', 'sql',
    'database query', 'phishing', 'object oriented', 'compiler', 'von neumann',
    'packet switching', 'cloud computing', 'machine learning', 'gdpr'],
  'Wider curriculum': ['balanced diet', 'skeleton', 'exercise', 'budgeting', 'interest rate',
    'supply and demand', 'marketing mix', 'colour wheel', 'cadence', 'perspective', 'first aid',
    'note-taking', 'revision', 'exam technique'],
  'Media and film': ['film language', 'establishing shot', 'mise-en-scene', 'genre', 'narrative',
    'news values', 'representation', 'algorithms and misinformation', 'deepfake', 'diegetic sound',
    'documentary', 'video games'],
  'Psychology and sociology': ['attachment', 'conformity', 'obedience', 'classical conditioning',
    'operant conditioning', 'stress', 'circadian rhythm', 'perception', 'research methods',
    'social class', 'crime and deviance', 'moral panic'],
  'Environment': ['greenhouse effect', 'ice core', 'life cycle assessment', 'air pollution',
    'biodiversity', 'deforestation', 'circular economy', 'water scarcity', 'eutrophication'],
  'Philosophy and religion': ['utilitarianism', 'categorical imperative', 'virtue ethics',
    'cosmological argument', 'problem of evil', 'epistemology', 'free will', 'christianity',
    'islam', 'judaism', 'buddhism', 'sikhism'],
  'Engineering and business': ['tensile strength', 'design process', 'orthographic projection',
    'series and parallel', 'sensors', 'feedback', 'gears', 'compound interest', 'apr',
    'insurance', 'balance sheet', 'break-even', 'market research', 'marketing mix',
    'limited liability'],
  'Life skills and the arts': ['cv', 'interview', 'employment contract', 'online safety',
    'stopping distance', 'food hygiene', 'tenancy', 'presentation', 'active listening',
    'colour theory', 'tone and proportion', 'cubism', 'key signature', 'triad', 'baroque',
    'stagecraft', 'characterisation'],
  'Health and computing': ['cardiac output', 'alveoli', 'components of fitness', 'fitt',
    'doping', 'basal metabolic rate', 'scope', 'debugging', 'big o', 'binary tree',
    'sql joins', 'http', 'accessibility', 'social engineering', 'encryption'],
  'Early years': ['rhyming', 'syllables', 'counting to 20', 'sorting and patterns',
    'seasons', 'days of the week', 'taking turns'],
  'Named topics': ['times tables', 'telling the time', 'money and change',
    'food groups', 'skeleton and muscles', 'the impressionists', 'renaissance art',
    'reading music', 'the orchestra', 'logical fallacies', 'world festivals',
    'memory', 'advertising', 'payslips', 'bridges', 'renewable energy', 'first aid',
    'anaphora', 'discursive essay', 'story writing', 'maps and continents']
};

let missing = 0, checked = 0;
for (const [group, terms] of Object.entries(TERMS)) {
  const gaps = [];
  for (const term of terms) {
    checked++;
    if (!searchExercises({ text: term }).total) { gaps.push(term); missing++; }
  }
  console.log(gaps.length
    ? `✗ ${group}: nothing found for ${gaps.join(', ')}`
    : `✓ ${group} (${terms.length})`);
}

/* A subject with no worksheets at a level a real course covers is the other
   shape this failure takes, and it is invisible from a search. */
const levels = GRADES.flatMap(g => g.levels);
const grid = {};
for (const f of FAMILIES) {
  (grid[f.subject] ??= {})[f.level] = (grid[f.subject][f.level] ?? 0) + f.sets;
}
console.log('\nWorksheets by level');
const width = Math.max(...SUBJECTS.map(s => s.id.length)) + 2;
const short = l => l.replace('Grade ', 'G').replace('Kindergarten', 'K')
                    .replace('Pre-K', 'PK').replace('College', 'Col');
console.log(' '.repeat(width) + levels.map(l => short(l).padStart(8)).join(''));
for (const s of SUBJECTS) {
  console.log(s.id.padEnd(width) +
    levels.map(l => String(grid[s.id]?.[l] ?? 0).padStart(8)).join(''));
}

const units = Object.values(UNITS).reduce((n, list) => n + list.length, 0);
console.log(`\n${TOTAL.toLocaleString()} worksheets · ${FAMILIES.length.toLocaleString()} families · ${units} micro-units`);
console.log(missing
  ? `\n${missing} of ${checked} curriculum terms find nothing.`
  : `\nAll ${checked} curriculum terms find worksheets.`);
process.exit(missing ? 1 : 0);
