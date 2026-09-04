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

/* Merged per topic: several files may contribute units to the same topic. */
export const UNITS = (() => {
  const out = {};
  for (const src of [EARLY_UNITS, SCIENCE_UNITS, HUMANITIES_UNITS, ELA_UNITS, LANGUAGE_UNITS,
                     APPLIED_UNITS, ELECTIVE_UNITS, MORE_UNITS]) {
    for (const [topic, units] of Object.entries(src)) {
      (out[topic] ??= []).push(...units);
    }
  }
  return out;
})();

export const UNIT_COUNT = Object.values(UNITS).reduce((n, u) => n + u.length, 0);
