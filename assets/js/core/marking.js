/* WorksheetHub — answer marking.
   One module owns "is this answer right?" for every question type, so the
   online player, the answer key and any future auto-marked assignment all
   agree. Marking is intentionally forgiving about formatting and strict
   about meaning. */

/** Normalise a free-text answer: case, whitespace, common maths spellings. */
export function normalise(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[−–—]/g, '-')     // unicode minus / dashes → hyphen
    .replace(/[×]/g, '*').replace(/[÷]/g, '/')
    .replace(/\s+/g, ' ')
    .replace(/\s*([=+\-*/^])\s*/g, '$1')       // 2 x + 1 → 2x+1
    .replace(/^[a-z]\s*=\s*/, '')              // "x = 5" → "5"
    .replace(/[$,]/g, '')                      // $1,200 → 1200
    .replace(/\s*(degrees|deg|°)$/, '')
    .replace(/²/g, '^2').replace(/³/g, '^3')
    .replace(/\*\*/g, '^')
    .replace(/±/g, '+-')
    .replace(/√/g, 'sqrt')
    .replace(/\.$/, '');
}

/** Compare two numbers if both parse cleanly, allowing simple fractions. */
function numeric(value) {
  const v = normalise(value);
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
  const frac = v.match(/^(-?\d+)\/(\d+)$/);
  if (frac && Number(frac[2]) !== 0) return Number(frac[1]) / Number(frac[2]);
  const pctm = v.match(/^(-?\d+(?:\.\d+)?)%$/);
  if (pctm) return Number(pctm[1]);
  return null;
}

function textMatches(given, question) {
  const candidates = [question.answer, ...(question.accept ?? [])];
  const g = normalise(given);
  if (!g) return false;
  for (const c of candidates) {
    if (normalise(c) === g) return true;
    const a = numeric(c), b = numeric(given);
    /* Numeric equality catches 0.5 vs 1/2 vs 50% — same value, different ink. */
    if (a !== null && b !== null && Math.abs(a - b) < 1e-9) return true;
  }
  return false;
}

const sameSet = (a, b) => {
  const x = [...new Set(a)].sort(), y = [...new Set(b)].sort();
  return x.length === y.length && x.every((v, i) => v === y[i]);
};

/**
 * Mark one answer.
 * @returns {{correct:boolean|null, detail?:object}} correct === null means
 *          "not auto-markable" (written responses are self-assessed).
 */
export function mark(question, given) {
  switch (question.type) {
    case 'choice':
      return { correct: given === question.answer };

    case 'multi':
      return {
        correct: Array.isArray(given) && sameSet(given, question.answer),
        detail: { missed: (question.answer ?? []).filter(i => !(given ?? []).includes(i)) }
      };

    case 'blank':
    case 'math':
      return { correct: textMatches(given, question) };

    case 'graph': {
      const tol = question.tolerance ?? 0;
      const ok = given && Math.abs(given.x - question.answer.x) <= tol
                       && Math.abs(given.y - question.answer.y) <= tol;
      return { correct: Boolean(ok) };
    }

    case 'match': {
      /* `given` maps left index -> right index. Correct when every left item
         points at the right item that was authored beside it. */
      if (!given || typeof given !== 'object') return { correct: false };
      const wrong = question.pairs
        .map((_, i) => i)
        .filter(i => given[i] !== i);
      return { correct: wrong.length === 0, detail: { wrong } };
    }

    case 'order': {
      /* `given` is the list of item indexes in the learner's chosen order.
         The authored array is already in the correct order. */
      const target = question.items.map((_, i) => i);
      const ok = Array.isArray(given) && given.length === target.length
                 && given.every((v, i) => v === target[i]);
      return {
        correct: ok,
        detail: { misplaced: (given ?? []).map((v, i) => v !== i ? i : -1).filter(i => i >= 0) }
      };
    }

    case 'written':
      /* Extended writing is not something a browser should pretend to grade.
         The learner compares against a sample answer and marks themselves;
         the teacher view shows the response verbatim. */
      return { correct: null };

    default:
      return { correct: null };
  }
}

/** Human-readable correct answer, used by feedback panels and the answer key. */
export function answerText(question) {
  switch (question.type) {
    case 'choice': return question.options[question.answer];
    case 'multi':  return question.answer.map(i => question.options[i]).join(', ');
    case 'blank':
    case 'math':   return question.answer;
    case 'graph':  return `(${question.answer.x}, ${question.answer.y})`;
    case 'match':  return question.pairs.map(p => `${p.left} → ${p.right}`).join('; ');
    case 'order':  return question.items.join(' → ');
    case 'written': return question.sample ?? 'Open response — compare with the sample answer.';
    default: return '';
  }
}

/** Does this question type produce a mark the app can trust? */
export const isAutoMarked = question => question.type !== 'written';
