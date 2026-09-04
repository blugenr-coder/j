/* Every micro-unit in the curriculum, in one index.
   A unit is the grain a subject is actually taught and assessed at — "Cell
   Structure", not "Biology" — and it is the grain a worksheet should be at
   too. Each one carries its own item bank and its own level range. */

import { SCIENCE_UNITS } from './units-science.js';
import { HUMANITIES_UNITS } from './units-humanities.js';
import { ELA_UNITS } from './units-ela.js';
import { LANGUAGE_UNITS } from './units-langs.js';
import { APPLIED_UNITS } from './units-applied.js';
import { ELECTIVE_UNITS } from './units-electives.js';
import { EARLY_UNITS } from './units-early.js';
import { MORE_UNITS } from './units-more.js';
import { BIO_UNITS } from './units-bio.js';
import { CHEM_UNITS } from './units-chem.js';
import { MATHS_UNITS } from './units-maths.js';
import { MATHS2_UNITS } from './units-maths2.js';
import { WIDER_UNITS } from './units-wider.js';
import { EARLY2_UNITS } from './units-early2.js';
import { ELA2_UNITS } from './units-ela2.js';
import { HIST_UNITS } from './units-hist.js';
import { LANG2_UNITS } from './units-lang2.js';
import { MORE2_UNITS } from './units-more2.js';
import { ELEM_UNITS } from './units-elem.js';
import { ELEM2_UNITS } from './units-elem2.js';
import { NATION_UNITS } from './units-nations.js';
import { WORLD_UNITS } from './units-world.js';
import { SCI2_UNITS } from './units-sci2.js';
import { PRIMARY_UNITS } from './units-primary.js';
import { CULTURE_UNITS } from './units-culture.js';
import { HIST2_UNITS } from './units-hist2.js';
import { GAP_UNITS } from './units-gaps.js';

/* Merged per topic: several files may contribute units to the same topic. */
export const UNITS = (() => {
  const out = {};
  for (const src of [EARLY_UNITS, SCIENCE_UNITS, HUMANITIES_UNITS, ELA_UNITS, LANGUAGE_UNITS,
                     APPLIED_UNITS, ELECTIVE_UNITS, MORE_UNITS, BIO_UNITS, CHEM_UNITS, MATHS_UNITS, MATHS2_UNITS, WIDER_UNITS, EARLY2_UNITS, ELA2_UNITS, HIST_UNITS, LANG2_UNITS, MORE2_UNITS, ELEM_UNITS, ELEM2_UNITS, NATION_UNITS, WORLD_UNITS, SCI2_UNITS, PRIMARY_UNITS, CULTURE_UNITS, HIST2_UNITS, GAP_UNITS]) {
    for (const [topic, units] of Object.entries(src)) {
      (out[topic] ??= []).push(...units);
    }
  }
  return out;
})();

export const UNIT_COUNT = Object.values(UNITS).reduce((n, u) => n + u.length, 0);
