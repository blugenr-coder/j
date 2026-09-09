/* Science drills: a quantity, a formula, and a number to write.

   The maths library had no sheet that was simply twenty subtractions. Science
   had the same hole in a different shape: physics offered four calculation
   makers in total, and every sheet called "Calculations" drew on the same
   four. A teacher wanting twenty speed-distance-time questions, or twenty
   moles, had nowhere to go.

   These generators produce nothing but computation. The same two rules hold
   as in gen-drill.js. The answer is worked out from the numbers that render
   the question, never written beside them; and the numbers are chosen so the
   answer is the kind a learner is expected to write, which in science means
   it divides out and does not need a calculator to be legible.

   Units stay in the question, because a physics answer without units is only
   half an answer. tools/check-drill.mjs knows the unit lexicon and strips it
   before re-evaluating, so the units cost nothing in checkability.          */

import {
  int, pick, mathQ, blankQ, num,
  WORK_WAYS, PEOPLE
} from './gen-core.js';

/* Said once here so a sheet of ten does not open the same way ten times. */
const FIND = ['Work it out.', 'Calculate the answer.', 'Write the value.', 'Find the value.'];

/* What the question is about, drawn from a list. Ten sheets of half-life
   questions that all begin "A source" read as one question; the arithmetic is
   identical either way, and the sheet is not. */
const SOURCES = ['A source', 'A sample', 'A rock sample', 'A tracer',
                 'A laboratory source', 'An isotope', 'A sealed source'];
const DETECTORS = ['A detector', 'A Geiger counter', 'A counter', 'A monitor'];
/* Cells, not organelles: these makers use widths of tens of micrometres, and a
   mitochondrion 37 µm across is a biology error printed on a biology sheet. */
const SPECIMENS = ['A cell', 'An onion cell', 'A plant cell', 'A cheek cell',
                   'A pollen grain', 'A specimen', 'A leaf cell', 'A root hair cell'];
const SOLUTES = ['solute', 'sodium chloride', 'potassium hydroxide', 'copper sulfate',
                 'glucose', 'the powder', 'the crystals'];
const eq = (sym, body, unit) => `${sym} = ${body} = ? ${unit}`;
/* A minus sign, not a hyphen. Marking treats them alike; a printed sheet does
   not. */
const sn = v => String(v).replace('-', '−');

/* ==================== SPEED, DISTANCE AND TIME ==================== */
export const speeddistancetime = [
  (r) => { const t = int(r, 2, 12), v = int(r, 2, 30);
    return mathQ(pick(r, FIND), eq('speed', `${v * t} m ÷ ${t} s`, 'm/s'), v,
      { hint: 'Speed is distance divided by time.',
        explanation: `${v * t} ÷ ${t} = ${v} m/s.` }); },

  (r) => { const v = int(r, 2, 30), t = int(r, 2, 20);
    return mathQ(pick(r, FIND), eq('distance', `${v} m/s × ${t} s`, 'm'), v * t,
      { hint: 'Distance is speed multiplied by time.',
        explanation: `${v} × ${t} = ${v * t} m.` }); },

  (r) => { const v = int(r, 2, 25), t = int(r, 2, 20);
    return mathQ(pick(r, FIND), eq('time', `${v * t} m ÷ ${v} m/s`, 's'), t,
      { hint: 'Time is distance divided by speed.',
        explanation: `${v * t} ÷ ${v} = ${t} s.` }); },

  (r) => { const km = int(r, 2, 40), h = int(r, 2, 8);
    return mathQ(pick(r, FIND), eq('speed', `${km * h} km ÷ ${h} h`, 'km/h'), km,
      { hint: 'Kilometres divided by hours gives kilometres per hour.',
        explanation: `${km * h} ÷ ${h} = ${km} km/h.` }); },

  (r) => { const kmh = int(r, 2, 30) * 36;
    return blankQ(`Convert ${kmh} km/h to metres per second.`, kmh / 3.6,
      { hint: 'Divide by 3.6.', explanation: `${kmh} ÷ 3.6 = ${kmh / 3.6} m/s.` }); },

  (r) => { const ms = int(r, 2, 30);
    return blankQ(`Convert ${ms} m/s to kilometres per hour.`, ms * 3.6,
      { hint: 'Multiply by 3.6.', explanation: `${ms} × 3.6 = ${num(ms * 3.6)} km/h.` }); },

  (r) => { const v = int(r, 2, 20), t = int(r, 2, 15), who = pick(r, PEOPLE);
    return blankQ(`${who} cycles at a steady ${v} m/s for ${t} seconds. How far, in metres?`, v * t,
      { hint: 'Distance is speed times time.', explanation: `${v} × ${t} = ${v * t} m.` }); },

  (r) => { const u = int(r, 0, 10), a = int(r, 1, 6), t = int(r, 2, 12);
    return mathQ(pick(r, FIND), eq('final speed', `${u} m/s + ${a} m/s² × ${t} s`, 'm/s'), u + a * t,
      { hint: 'Final speed is starting speed plus acceleration times time.',
        explanation: `${a} × ${t} = ${a * t}, and ${u} + ${a * t} = ${u + a * t} m/s.` }); },

  (r) => { const v1 = int(r, 2, 20), t1 = int(r, 2, 10), v2 = int(r, 2, 20), t2 = int(r, 2, 10);
    return blankQ(`A journey is ${v1} m/s for ${t1} s, then ${v2} m/s for ${t2} s. What is the total distance, in metres?`,
      v1 * t1 + v2 * t2,
      { hint: 'Work out each leg, then add them.',
        explanation: `${v1 * t1} + ${v2 * t2} = ${v1 * t1 + v2 * t2} m.` }); },

  (r) => { const d = int(r, 2, 40) * 60, v = int(r, 2, 30);
    return blankQ(`A train covers ${d * v} m in ${d} s. What is its average speed, in metres per second?`, v,
      { hint: 'Average speed is total distance over total time.',
        explanation: `${d * v} ÷ ${d} = ${v} m/s.` }); },

  (r) => { const v = int(r, 2, 20), t = int(r, 2, 12);
    return mathQ(pick(r, FIND), eq('acceleration', `${v * t} m/s ÷ ${t} s`, 'm/s²'), v,
      { hint: 'Acceleration is change in speed divided by time.',
        explanation: `${v * t} ÷ ${t} = ${v} m/s².` }); },

  (r) => { const km = int(r, 2, 20), min = pick(r, [15, 20, 30, 45, 60]);
    return blankQ(`A car travels ${km * (60 / min)} km in ${min} minutes. What is its speed, in kilometres per hour?`,
      km * (60 / min) * (60 / min),
      { hint: 'Turn the minutes into a fraction of an hour first.',
        explanation: `${min} minutes is ${num(min / 60)} h, so the speed is ${km * (60 / min) * (60 / min)} km/h.` }); }
];

/* ======================= FORCES AND ACCELERATION ======================= */
export const forcesmotion = [
  (r) => { const m = int(r, 2, 40), a = int(r, 2, 12);
    return mathQ(pick(r, FIND), eq('F', `${m} kg × ${a} m/s²`, 'N'), m * a,
      { hint: 'Force is mass times acceleration.',
        explanation: `${m} × ${a} = ${m * a} N.` }); },

  (r) => { const m = int(r, 2, 25), a = int(r, 2, 12);
    return mathQ(pick(r, FIND), eq('a', `${m * a} N ÷ ${m} kg`, 'm/s²'), a,
      { hint: 'Rearrange F = ma to get a = F ÷ m.',
        explanation: `${m * a} ÷ ${m} = ${a} m/s².` }); },

  (r) => { const m = int(r, 2, 25), a = int(r, 2, 12);
    return mathQ(pick(r, FIND), eq('m', `${m * a} N ÷ ${a} m/s²`, 'kg'), m,
      { hint: 'Rearrange F = ma to get m = F ÷ a.',
        explanation: `${m * a} ÷ ${a} = ${m} kg.` }); },

  (r) => { const m = int(r, 2, 80);
    return mathQ(pick(r, FIND), eq('W', `${m} kg × 10 N/kg`, 'N'), m * 10,
      { hint: 'Weight is mass times gravitational field strength.',
        explanation: `${m} × 10 = ${m * 10} N on Earth.` }); },

  (r) => { const w = int(r, 2, 80) * 10;
    return mathQ(pick(r, FIND), eq('m', `${w} N ÷ 10 N/kg`, 'kg'), w / 10,
      { hint: 'Divide the weight by 10 to get the mass on Earth.',
        explanation: `${w} ÷ 10 = ${w / 10} kg.` }); },

  (r) => { const f = int(r, 5, 60), b = int(r, 1, f - 1);
    return blankQ(`A ${f} N push acts forwards and a ${b} N friction force acts backwards. What is the resultant force, in newtons?`,
      f - b,
      { hint: 'Forces in opposite directions subtract.',
        explanation: `${f} − ${b} = ${f - b} N forwards.` }); },

  (r) => { const a = int(r, 3, 40), b = int(r, 3, 40);
    return blankQ(`Two forces of ${a} N and ${b} N act in the same direction. What is the resultant force, in newtons?`,
      a + b,
      { hint: 'Forces in the same direction add.',
        explanation: `${a} + ${b} = ${a + b} N.` }); },

  (r) => { const m = int(r, 2, 30), a = int(r, 2, 10);
    return blankQ(`A trolley of mass ${m} kg accelerates at ${a} m/s². What resultant force acts on it, in newtons?`,
      m * a,
      { hint: 'F = ma.', explanation: `${m} × ${a} = ${m * a} N.` }); },

  (r) => { const k = int(r, 2, 30), x = int(r, 2, 20);
    return mathQ(pick(r, FIND), eq('F', `${k} N/m × ${x} m`, 'N'), k * x,
      { hint: 'For a spring, force is the spring constant times the extension.',
        explanation: `${k} × ${x} = ${k * x} N.` }); },

  (r) => { const m = int(r, 2, 20), v = int(r, 2, 25);
    return mathQ(pick(r, FIND), eq('momentum', `${m} kg × ${v} m/s`, 'kg m/s'), m * v,
      { hint: 'Momentum is mass times velocity.',
        explanation: `${m} × ${v} = ${m * v} kg m/s.` }); },

  (r) => { const m = int(r, 2, 60);
    return blankQ(`What is the weight of a ${m} kg object on the Moon, where g = 1.6 N/kg? Give the answer in newtons.`,
      num(m * 1.6),
      { hint: 'Weight is mass times the field strength where it is.',
        explanation: `${m} × 1.6 = ${num(m * 1.6)} N.` }); }
];

/* ====================== ENERGY, WORK AND POWER ====================== */
export const energywork = [
  (r) => { const f = int(r, 2, 40), d = int(r, 2, 25);
    return mathQ(pick(r, FIND), eq('work', `${f} N × ${d} m`, 'J'), f * d,
      { hint: 'Work done is force times distance moved.',
        explanation: `${f} × ${d} = ${f * d} J.` }); },

  (r) => { const j = int(r, 2, 40), t = int(r, 2, 20);
    return mathQ(pick(r, FIND), eq('power', `${j * t} J ÷ ${t} s`, 'W'), j,
      { hint: 'Power is energy transferred divided by time.',
        explanation: `${j * t} ÷ ${t} = ${j} W.` }); },

  (r) => { const p = int(r, 2, 60), t = int(r, 2, 30);
    return mathQ(pick(r, FIND), eq('energy', `${p} W × ${t} s`, 'J'), p * t,
      { hint: 'Energy is power multiplied by time.',
        explanation: `${p} × ${t} = ${p * t} J.` }); },

  (r) => { const m = int(r, 2, 30), h = int(r, 2, 25);
    return mathQ(pick(r, FIND), eq('GPE', `${m} kg × 10 N/kg × ${h} m`, 'J'), m * 10 * h,
      { hint: 'Gravitational potential energy is mass times g times height.',
        explanation: `${m} × 10 × ${h} = ${m * 10 * h} J.` }); },

  (r) => { const m = int(r, 2, 20) * 2, v = int(r, 2, 12);
    return mathQ(pick(r, FIND), eq('KE', `0.5 × ${m} kg × ${v} m/s × ${v} m/s`, 'J'), m * v * v / 2,
      { hint: 'Kinetic energy is a half times mass times speed squared.',
        explanation: `${v}² = ${v * v}, and 0.5 × ${m} × ${v * v} = ${m * v * v / 2} J.` }); },

  (r) => { const useful = int(r, 1, 9) * 10, total = useful * pick(r, [2, 4, 5, 10]);
    return blankQ(`A machine takes in ${total} J and usefully transfers ${useful} J. What is its efficiency, as a percentage?`,
      `${useful * 100 / total}%`,
      { accept: [String(useful * 100 / total)],
        hint: 'Divide the useful energy by the total, then multiply by 100.',
        explanation: `${useful} ÷ ${total} = ${num(useful / total)}, which is ${useful * 100 / total}%.` }); },

  (r) => { const kw = int(r, 1, 12), h = int(r, 1, 12);
    return blankQ(`An appliance rated ${kw} kW runs for ${h} hours. How many kilowatt-hours does it use?`, kw * h,
      { hint: 'Kilowatt-hours are kilowatts times hours.',
        explanation: `${kw} × ${h} = ${kw * h} kWh.` }); },

  (r) => { const p = int(r, 2, 50), j = int(r, 2, 30);
    return mathQ(pick(r, FIND), eq('time', `${p * j} J ÷ ${p} W`, 's'), j,
      { hint: 'Time is energy divided by power.',
        explanation: `${p * j} ÷ ${p} = ${j} s.` }); },

  (r) => { const f = int(r, 2, 30), d = int(r, 2, 20), t = int(r, 2, 10);
    return blankQ(`A force of ${f} N moves an object ${d} m in ${t} s. What is the power, in watts?`,
      num(f * d / t),
      { hint: 'Work out the work done first, then divide by the time.',
        explanation: `${f} × ${d} = ${f * d} J, and ${f * d} ÷ ${t} = ${num(f * d / t)} W.` }); },

  (r) => { const total = int(r, 2, 20) * 100, wasted = int(r, 1, 9) * 10;
    return blankQ(`A lamp takes in ${total} J and wastes ${wasted} J as heat. How much energy is usefully transferred, in joules?`,
      total - wasted,
      { hint: 'Energy is conserved: what goes in comes out somewhere.',
        explanation: `${total} − ${wasted} = ${total - wasted} J.` }); },

  (r) => { const m = int(r, 2, 30), h = int(r, 2, 20);
    return blankQ(`A ${m} kg box is lifted ${h} m at a steady speed. How much work is done against gravity, in joules?`,
      m * 10 * h,
      { hint: 'The force needed equals the weight.',
        explanation: `Weight is ${m * 10} N, and ${m * 10} × ${h} = ${m * 10 * h} J.` }); }
];

/* ======================== DENSITY AND PRESSURE ======================== */
export const densitypressure = [
  (r) => { const v = int(r, 2, 20), d = int(r, 2, 15);
    return mathQ(pick(r, FIND), eq('density', `${d * v} g ÷ ${v} cm³`, 'g/cm³'), d,
      { hint: 'Density is mass divided by volume.',
        explanation: `${d * v} ÷ ${v} = ${d} g/cm³.` }); },

  (r) => { const v = int(r, 2, 20), d = int(r, 2, 15);
    return mathQ(pick(r, FIND), eq('mass', `${d} g/cm³ × ${v} cm³`, 'g'), d * v,
      { hint: 'Mass is density times volume.',
        explanation: `${d} × ${v} = ${d * v} g.` }); },

  (r) => { const v = int(r, 2, 20), d = int(r, 2, 15);
    return mathQ(pick(r, FIND), eq('volume', `${d * v} g ÷ ${d} g/cm³`, 'cm³'), v,
      { hint: 'Volume is mass divided by density.',
        explanation: `${d * v} ÷ ${d} = ${v} cm³.` }); },

  (r) => { const a = int(r, 2, 20), p = int(r, 2, 30);
    return mathQ(pick(r, FIND), eq('pressure', `${p * a} N ÷ ${a} m²`, 'Pa'), p,
      { hint: 'Pressure is force divided by area.',
        explanation: `${p * a} ÷ ${a} = ${p} Pa.` }); },

  (r) => { const a = int(r, 2, 20), p = int(r, 2, 30);
    return mathQ(pick(r, FIND), eq('force', `${p} Pa × ${a} m²`, 'N'), p * a,
      { hint: 'Force is pressure times area.',
        explanation: `${p} × ${a} = ${p * a} N.` }); },

  (r) => { const a = int(r, 2, 20), p = int(r, 2, 30);
    return mathQ(pick(r, FIND), eq('area', `${p * a} N ÷ ${p} Pa`, 'm²'), a,
      { hint: 'Area is force divided by pressure.',
        explanation: `${p * a} ÷ ${p} = ${a} m².` }); },

  (r) => { const l = int(r, 2, 10), w = int(r, 2, 10), h = int(r, 2, 10), d = int(r, 2, 9);
    return blankQ(`A block measures ${l} cm by ${w} cm by ${h} cm and has a density of ${d} g/cm³. What is its mass, in grams?`,
      l * w * h * d,
      { hint: 'Find the volume first.',
        explanation: `Volume is ${l * w * h} cm³, and ${l * w * h} × ${d} = ${l * w * h * d} g.` }); },

  (r) => { const h = int(r, 2, 30), d = pick(r, [1000, 1030]);
    return blankQ(`Find the pressure ${h} m below the surface of water of density ${d} kg/m³, using g = 10 N/kg. Give the answer in pascals.`,
      h * d * 10,
      { hint: 'Pressure in a liquid is height times density times g.',
        explanation: `${h} × ${d} × 10 = ${h * d * 10} Pa.` }); },

  (r) => { const m = int(r, 2, 20), v = int(r, 2, 20);
    return blankQ(`A liquid of mass ${m * v} g fills ${v} cm³. Will it float on water, which has a density of 1 g/cm³? Write yes or no.`,
      m < 1 ? 'yes' : 'no',
      { hint: 'Work out its density and compare with 1 g/cm³.',
        explanation: `Its density is ${m} g/cm³, so it ${m < 1 ? 'floats' : 'sinks'}.` }); },

  (r) => { const kg = int(r, 2, 90), a = pick(r, [2, 4, 5, 10]);
    return blankQ(`A ${kg} kg crate rests on ${a} m² of floor. What pressure does it exert, in pascals? Use g = 10 N/kg.`,
      kg * 10 / a,
      { hint: 'Turn the mass into a weight first.',
        explanation: `Weight is ${kg * 10} N, and ${kg * 10} ÷ ${a} = ${kg * 10 / a} Pa.` }); },

  (r) => { const d = int(r, 2, 12), v = int(r, 2, 20);
    return blankQ(`A metal has a density of ${d} g/cm³. What is the volume of a ${d * v} g sample, in cubic centimetres?`, v,
      { hint: 'Volume is mass divided by density.',
        explanation: `${d * v} ÷ ${d} = ${v} cm³.` }); }
];

/* ================== CURRENT, VOLTAGE AND RESISTANCE ================== */
export const electricity = [
  (r) => { const i = int(r, 1, 12), rr = int(r, 2, 25);
    return mathQ(pick(r, FIND), eq('V', `${i} A × ${rr} Ω`, 'V'), i * rr,
      { hint: 'Voltage is current times resistance.',
        explanation: `${i} × ${rr} = ${i * rr} V.` }); },

  (r) => { const i = int(r, 1, 12), rr = int(r, 2, 25);
    return mathQ(pick(r, FIND), eq('I', `${i * rr} V ÷ ${rr} Ω`, 'A'), i,
      { hint: 'Current is voltage divided by resistance.',
        explanation: `${i * rr} ÷ ${rr} = ${i} A.` }); },

  (r) => { const i = int(r, 1, 12), rr = int(r, 2, 25);
    return mathQ(pick(r, FIND), eq('R', `${i * rr} V ÷ ${i} A`, 'Ω'), rr,
      { hint: 'Resistance is voltage divided by current.',
        explanation: `${i * rr} ÷ ${i} = ${rr} Ω.` }); },

  (r) => { const v = int(r, 2, 24), i = int(r, 1, 10);
    return mathQ(pick(r, FIND), eq('P', `${v} V × ${i} A`, 'W'), v * i,
      { hint: 'Power is voltage times current.',
        explanation: `${v} × ${i} = ${v * i} W.` }); },

  (r) => { const q = int(r, 2, 20), t = int(r, 2, 15);
    return mathQ(pick(r, FIND), eq('I', `${q * t} C ÷ ${t} s`, 'A'), q,
      { hint: 'Current is charge divided by time.',
        explanation: `${q * t} ÷ ${t} = ${q} A.` }); },

  (r) => { const i = int(r, 1, 12), t = int(r, 2, 30);
    return mathQ(pick(r, FIND), eq('Q', `${i} A × ${t} s`, 'C'), i * t,
      { hint: 'Charge is current times time.',
        explanation: `${i} × ${t} = ${i * t} C.` }); },

  (r) => { const a = int(r, 2, 30), b = int(r, 2, 30);
    return blankQ(`Two resistors of ${a} Ω and ${b} Ω are joined in series. What is the total resistance, in ohms?`,
      a + b,
      { hint: 'In series, resistances add.',
        explanation: `${a} + ${b} = ${a + b} Ω.` }); },

  (r) => { const k = int(r, 2, 20);
    return blankQ(`Two ${k} Ω resistors are joined in parallel. What is the total resistance, in ohms?`, k / 2,
      { hint: 'Two equal resistors in parallel give half of one of them.',
        explanation: `${k} ÷ 2 = ${k / 2} Ω.` }); },

  (r) => { const a = int(r, 1, 8), b = int(r, 1, 8), c = int(r, 1, 8);
    return blankQ(`Three branches of a parallel circuit carry ${a} A, ${b} A and ${c} A. What current leaves the battery, in amperes?`,
      a + b + c,
      { hint: 'The branch currents add up to the total.',
        explanation: `${a} + ${b} + ${c} = ${a + b + c} A.` }); },

  (r) => { const v = int(r, 3, 24), a = int(r, 1, v - 1);
    return blankQ(`A ${v} V supply drives two components in series. One takes ${a} V. What does the other take, in volts?`,
      v - a,
      { hint: 'In series, the voltages share out and add to the supply.',
        explanation: `${v} − ${a} = ${v - a} V.` }); },

  (r) => { const i = int(r, 1, 10), rr = int(r, 2, 20);
    return mathQ(pick(r, FIND), eq('P', `${i} A × ${i} A × ${rr} Ω`, 'W'), i * i * rr,
      { hint: 'Power is current squared times resistance.',
        explanation: `${i}² = ${i * i}, and ${i * i} × ${rr} = ${i * i * rr} W.` }); },

  (r) => { const p = int(r, 2, 60), t = int(r, 2, 30);
    return blankQ(`A ${p} W device runs for ${t} seconds. How much energy does it transfer, in joules?`, p * t,
      { hint: 'Energy is power times time.',
        explanation: `${p} × ${t} = ${p * t} J.` }); }
];

/* =================== WAVES, FREQUENCY AND WAVELENGTH =================== */
export const waves = [
  (r) => { const f = int(r, 2, 40), w = int(r, 2, 20);
    return mathQ(pick(r, FIND), eq('v', `${f} Hz × ${w} m`, 'm/s'), f * w,
      { hint: 'Wave speed is frequency times wavelength.',
        explanation: `${f} × ${w} = ${f * w} m/s.` }); },

  (r) => { const f = int(r, 2, 40), w = int(r, 2, 20);
    return mathQ(pick(r, FIND), eq('f', `${f * w} m/s ÷ ${w} m`, 'Hz'), f,
      { hint: 'Frequency is speed divided by wavelength.',
        explanation: `${f * w} ÷ ${w} = ${f} Hz.` }); },

  (r) => { const f = int(r, 2, 40), w = int(r, 2, 20);
    return mathQ(pick(r, FIND), eq('wavelength', `${f * w} m/s ÷ ${f} Hz`, 'm'), w,
      { hint: 'Wavelength is speed divided by frequency.',
        explanation: `${f * w} ÷ ${f} = ${w} m.` }); },

  (r) => { const f = pick(r, [2, 4, 5, 8, 10, 20, 25, 50]);
    return blankQ(`A wave has a frequency of ${f} Hz. What is its period, in seconds?`, num(1 / f),
      { hint: 'Period is one divided by frequency.',
        explanation: `1 ÷ ${f} = ${num(1 / f)} s.` }); },

  (r) => { const f = pick(r, [2, 4, 5, 8, 10, 20, 25, 50]);
    return blankQ(`A wave has a period of ${num(1 / f)} s. What is its frequency, in hertz?`, f,
      { hint: 'Frequency is one divided by the period.',
        explanation: `1 ÷ ${num(1 / f)} = ${f} Hz.` }); },

  (r) => { const n = int(r, 4, 60), t = int(r, 2, 15);
    return blankQ(`${n * t} complete waves pass a point in ${t} seconds. What is the frequency, in hertz?`, n,
      { hint: 'Count the waves and divide by the time.',
        explanation: `${n * t} ÷ ${t} = ${n} Hz.` }); },

  (r) => { const t = int(r, 2, 12), v = 330;
    return blankQ(`An echo returns after ${t} s. Sound travels at ${v} m/s. How far away is the wall, in metres?`,
      v * t / 2,
      { hint: 'The sound goes there and back, so halve the total distance.',
        explanation: `${v} × ${t} = ${v * t} m there and back, so the wall is ${v * t / 2} m away.` }); },

  (r) => { const n = int(r, 2, 12), w = int(r, 2, 15);
    return blankQ(`${n} complete waves fit into ${n * w} m. What is the wavelength, in metres?`, w,
      { hint: 'Divide the length by the number of waves.',
        explanation: `${n * w} ÷ ${n} = ${w} m.` }); },

  (r) => { const t = int(r, 2, 20), v = 330;
    return blankQ(`How far does sound travel in air in ${t} seconds, at ${v} m/s? Give the answer in metres.`,
      v * t,
      { hint: 'Distance is speed times time.',
        explanation: `${v} × ${t} = ${v * t} m.` }); },

  (r) => { const f = pick(r, [2, 4, 5, 10, 20]), n = int(r, 3, 30);
    return blankQ(`How long does a wave of frequency ${f} Hz take to complete ${n} cycles? Give the answer in seconds.`,
      num(n / f),
      { hint: 'Each cycle takes one period.',
        explanation: `The period is ${num(1 / f)} s, and ${n} × ${num(1 / f)} = ${num(n / f)} s.` }); },

  (r) => { const t = int(r, 2, 9);
    return blankQ(`Light travels at 3 × 10⁸ m/s. How far does it travel in ${t} seconds? Give your answer in standard form.`,
      `${t * 3 >= 10 ? num(t * 3 / 10) : t * 3} × 10^${t * 3 >= 10 ? 9 : 8}`,
      { accept: [`${t * 3 >= 10 ? num(t * 3 / 10) : t * 3}x10^${t * 3 >= 10 ? 9 : 8}`],
        hint: 'Multiply, then check the front number is below 10.',
        explanation: `${t} × 3 = ${t * 3}, so the distance is ${t * 3 >= 10 ? num(t * 3 / 10) : t * 3} × 10^${t * 3 >= 10 ? 9 : 8} m.` }); },

  (r) => { const f = int(r, 2, 30), t = int(r, 2, 20);
    return blankQ(`How many complete waves pass a point in ${t} s if the frequency is ${f} Hz?`, f * t,
      { hint: 'Frequency is waves per second.',
        explanation: `${f} × ${t} = ${f * t} waves.` }); },

  (r) => { const v = int(r, 2, 30), t = int(r, 2, 15);
    return blankQ(`A wave front travels ${v * t} m in ${t} s. What is the wave speed, in metres per second?`, v,
      { hint: 'Speed is distance over time, for waves as for anything else.',
        explanation: `${v * t} ÷ ${t} = ${v} m/s.` }); },

  (r) => { const cm = int(r, 2, 50), f = int(r, 2, 40);
    return blankQ(`A wave has a wavelength of ${cm} cm and a frequency of ${f} Hz. What is its speed, in metres per second?`,
      num(cm / 100 * f),
      { hint: 'Change the wavelength to metres first.',
        explanation: `${cm} cm is ${num(cm / 100)} m, and ${num(cm / 100)} × ${f} = ${num(cm / 100 * f)} m/s.` }); }
];

/* ========================= MOMENTS AND LEVERS ========================= */
export const moments = [
  (r) => { const f = int(r, 2, 40), d = int(r, 2, 15);
    return mathQ(pick(r, FIND), eq('moment', `${f} N × ${d} m`, 'Nm'), f * d,
      { hint: 'A moment is force times perpendicular distance.',
        explanation: `${f} × ${d} = ${f * d} Nm.` }); },

  (r) => { const f = int(r, 2, 30), d = int(r, 2, 15);
    return mathQ(pick(r, FIND), eq('F', `${f * d} Nm ÷ ${d} m`, 'N'), f,
      { hint: 'Force is moment divided by distance.',
        explanation: `${f * d} ÷ ${d} = ${f} N.` }); },

  (r) => { const f = int(r, 2, 30), d = int(r, 2, 15);
    return mathQ(pick(r, FIND), eq('d', `${f * d} Nm ÷ ${f} N`, 'm'), d,
      { hint: 'Distance is moment divided by force.',
        explanation: `${f * d} ÷ ${f} = ${d} m.` }); },

  /* The two distances and a shared factor are chosen first, so the balancing
     force comes out whole. A drill answer of 9.142857 N is a calculator
     exercise, not a moments exercise. */
  (r) => { const d1 = int(r, 2, 9), d2 = int(r, 2, 9), k = int(r, 1, 6);
    const f1 = d2 * k, f2 = d1 * k;
    return blankQ(`A beam balances on a pivot. A ${f1} N force acts ${d1} m to the left. What force is needed ${d2} m to the right, in newtons?`,
      f2,
      { hint: 'The two moments must be equal.',
        explanation: `${f1} × ${d1} = ${f1 * d1} Nm, and ${f1 * d1} ÷ ${d2} = ${f2} N.` }); },

  (r) => { const d1 = int(r, 2, 9), d2 = int(r, 2, 9), k = int(r, 1, 6);
    const f1 = d2 * k, f2 = d1 * k;
    return blankQ(`A beam balances. A ${f1} N force acts ${d1} m from the pivot on one side, and a ${f2} N force acts on the other. How far from the pivot is it, in metres?`,
      d2,
      { hint: 'Set the two moments equal and rearrange.',
        explanation: `${f1 * d1} ÷ ${f2} = ${d2} m.` }); },

  (r) => { const a = int(r, 2, 20), b = int(r, 2, 20);
    return blankQ(`Clockwise moments total ${a + b} Nm and one anticlockwise moment of ${a} Nm already acts. What extra anticlockwise moment balances the beam, in newton metres?`,
      b,
      { hint: 'For balance, the two totals must match.',
        explanation: `${a + b} − ${a} = ${b} Nm.` }); },

  (r) => { const d1 = int(r, 1, 3), d2 = int(r, 1, 3), k = int(r, 4, 40);
    const total = d1 + d2, w = total * k;
    return blankQ(`A wheelbarrow load of ${w} N sits ${d1} m from the wheel, and the handles are ${total} m from it. What lifting force is needed, in newtons?`,
      d1 * k,
      { hint: 'Take moments about the wheel.',
        explanation: `${w} × ${d1} = ${w * d1} Nm, and ${w * d1} ÷ ${total} = ${d1 * k} N.` }); },

  (r) => { const d1 = int(r, 1, 3), d2 = int(r, 1, 3), k = int(r, 20, 60);
    const w1 = d2 * k * 10, w2 = d1 * k * 10;
    return blankQ(`Two children sit on a seesaw. One weighs ${w1} N and sits ${d1} m from the middle. The other sits ${d2} m from the middle. What is that child's weight, in newtons?`,
      w2,
      { hint: 'Balanced means equal moments about the middle.',
        explanation: `${w1} × ${d1} = ${w1 * d1} Nm, and ${w1 * d1} ÷ ${d2} = ${w2} N.` }); },

  (r) => { const f = int(r, 2, 40), cm = int(r, 10, 90);
    return blankQ(`A force of ${f} N acts ${cm} cm from a pivot. What is the moment, in newton metres?`,
      num(f * cm / 100),
      { hint: 'Change the centimetres to metres first.',
        explanation: `${cm} cm is ${num(cm / 100)} m, and ${f} × ${num(cm / 100)} = ${num(f * cm / 100)} Nm.` }); },

  (r) => { const k = int(r, 2, 4), base = int(r, 2, 25), f = base * k, d = int(r, 2, 10);
    return blankQ(`A spanner ${d} m long needs ${f} N to turn a nut. How much force is needed with a spanner ${d * k} m long, in newtons?`,
      base,
      { hint: 'The moment stays the same, so a longer arm needs less force.',
        explanation: `${f} × ${d} = ${f * d} Nm, and ${f * d} ÷ ${d * k} = ${base} N.` }); }
];

/* ==================== HEAT, TEMPERATURE AND CHANGE ==================== */
export const heatenergy = [
  (r) => { const m = int(r, 1, 10), c = pick(r, [400, 500, 900, 1000, 2000, 4200]), dt = int(r, 2, 40);
    return mathQ(pick(r, FIND), eq('E', `${m} kg × ${c} J/kg°C × ${dt} °C`, 'J'), m * c * dt,
      { hint: 'Energy is mass times specific heat capacity times temperature change.',
        explanation: `${m} × ${c} × ${dt} = ${m * c * dt} J.` }); },

  (r) => { const m = int(r, 1, 10), c = pick(r, [400, 500, 900, 1000]), dt = int(r, 2, 40);
    return mathQ(pick(r, FIND), eq('temperature rise', `${m * c * dt} J ÷ (${m} kg × ${c} J/kg°C)`, '°C'), dt,
      { hint: 'Divide the energy by mass times specific heat capacity.',
        explanation: `${m} × ${c} = ${m * c}, and ${m * c * dt} ÷ ${m * c} = ${dt} °C.` }); },

  (r) => { const m = int(r, 1, 10), c = pick(r, [400, 500, 900, 1000]), dt = int(r, 2, 30);
    return mathQ(pick(r, FIND), eq('m', `${m * c * dt} J ÷ (${c} J/kg°C × ${dt} °C)`, 'kg'), m,
      { hint: 'Rearrange to get mass on its own.',
        explanation: `${c} × ${dt} = ${c * dt}, and ${m * c * dt} ÷ ${c * dt} = ${m} kg.` }); },

  (r) => { const start = int(r, 5, 40), end = int(r, 45, 95);
    return blankQ(`Water warms from ${start} °C to ${end} °C. What is the temperature change, in degrees Celsius?`,
      end - start,
      { hint: 'Take the starting temperature from the final one.',
        explanation: `${end} − ${start} = ${end - start} °C.` }); },

  (r) => { const c = int(r, -50, 120);
    return blankQ(`Convert ${sn(c)} °C to kelvin.`, c + 273,
      { hint: 'Add 273.', explanation: `${sn(c)} + 273 = ${c + 273} K.` }); },

  (r) => { const k = int(r, 230, 400);
    return blankQ(`Convert ${k} K to degrees Celsius.`, k - 273,
      { hint: 'Subtract 273.', explanation: `${k} − 273 = ${sn(k - 273)} °C.` }); },

  (r) => { const m = int(r, 1, 12), L = pick(r, [200000, 330000, 2300000]);
    return blankQ(`How much energy is needed to change the state of ${m} kg of a substance with a latent heat of ${L} J/kg? Give the answer in joules.`,
      m * L,
      { hint: 'Energy is mass times latent heat.',
        explanation: `${m} × ${L} = ${m * L} J.` }); },

  (r) => { const m = int(r, 1, 12), L = pick(r, [200000, 330000]);
    return blankQ(`Changing the state of ${m} kg of a substance takes ${m * L} J. What is its latent heat, in joules per kilogram?`,
      L,
      { hint: 'Divide the energy by the mass.',
        explanation: `${m * L} ÷ ${m} = ${L} J/kg.` }); },

  (r) => { const p = int(r, 100, 2000), t = int(r, 10, 200);
    return blankQ(`A ${p} W heater runs for ${t} s. How much energy does it supply, in joules?`, p * t,
      { hint: 'Energy is power times time.',
        explanation: `${p} × ${t} = ${p * t} J.` }); },

  (r) => { const p = int(r, 100, 1000), e = int(r, 10, 200);
    return blankQ(`How long does a ${p} W heater take to supply ${p * e} J? Give the answer in seconds.`, e,
      { hint: 'Time is energy divided by power.',
        explanation: `${p * e} ÷ ${p} = ${e} s.` }); },

  (r) => { const m = int(r, 1, 10), dt = int(r, 5, 60);
    return blankQ(`How much energy is needed to warm ${m} kg of water by ${dt} °C? Water has a specific heat capacity of 4200 J/kg°C. Give the answer in joules.`,
      m * 4200 * dt,
      { hint: 'Energy is mass times specific heat capacity times temperature change.',
        explanation: `${m} × 4200 × ${dt} = ${m * 4200 * dt} J.` }); },

  (r) => { const start = int(r, 5, 40), rise = int(r, 5, 50);
    return blankQ(`Water at ${start} °C is warmed by ${rise} °C. What is its final temperature, in degrees Celsius?`,
      start + rise,
      { hint: 'Add the rise to the starting temperature.',
        explanation: `${start} + ${rise} = ${start + rise} °C.` }); },

  (r) => { const kwh = int(r, 2, 40), pence = pick(r, [10, 15, 20, 25, 30]);
    return blankQ(`Electricity costs ${pence} cents per kilowatt-hour. What does ${kwh} kWh cost, in cents?`,
      kwh * pence,
      { hint: 'Multiply the units used by the price of one.',
        explanation: `${kwh} × ${pence} = ${kwh * pence} cents.` }); },

  (r) => { const e = int(r, 2, 40) * 1000, t = pick(r, [10, 20, 25, 50, 100]);
    return blankQ(`A heater supplies ${e} J in ${t} s. What is its power, in watts?`, e / t,
      { hint: 'Power is energy divided by time.',
        explanation: `${e} ÷ ${t} = ${e / t} W.` }); },

  (r) => { const useful = int(r, 1, 9) * 100, total = useful * pick(r, [2, 4, 5]);
    return blankQ(`A heater takes in ${total} J and delivers ${useful} J of useful heat. What is its efficiency, as a percentage?`,
      `${useful * 100 / total}%`,
      { accept: [String(useful * 100 / total)],
        hint: 'Useful out divided by total in, times 100.',
        explanation: `${useful} ÷ ${total} × 100 = ${useful * 100 / total}%.` }); },

  (r) => { const d = int(r, 5, 80);
    return blankQ(`A temperature rises by ${d} °C. By how many kelvin does it rise?`, d,
      { hint: 'A degree Celsius and a kelvin are the same size of step.',
        explanation: `A rise of ${d} °C is a rise of ${d} K.` }); }
];

/* ============================== CHEMISTRY ==============================
   A small table of relative masses, because a mole question with no numbers
   to look up is not a mole question. These are the values a school data sheet
   carries, rounded the way a data sheet rounds them. */
const BUILD = [
  ['MgO',   [['Mg', 24, 1], ['O', 16, 1]]],
  ['H₂O',   [['H', 1, 2], ['O', 16, 1]]],
  ['CO₂',   [['C', 12, 1], ['O', 16, 2]]],
  ['NaCl',  [['Na', 23, 1], ['Cl', 35.5, 1]]],
  ['CaO',   [['Ca', 40, 1], ['O', 16, 1]]],
  ['NaOH',  [['Na', 23, 1], ['O', 16, 1], ['H', 1, 1]]],
  ['CH₄',   [['C', 12, 1], ['H', 1, 4]]],
  ['NH₃',   [['N', 14, 1], ['H', 1, 3]]],
  ['SO₂',   [['S', 32, 1], ['O', 16, 2]]],
  ['CaCO₃', [['Ca', 40, 1], ['C', 12, 1], ['O', 16, 3]]],
  ['H₂SO₄', [['H', 1, 2], ['S', 32, 1], ['O', 16, 4]]],
  ['ZnO',   [['Zn', 65, 1], ['O', 16, 1]]]
];
const COMPOUNDS = [
  ['H₂O', 18], ['CO₂', 44], ['NaCl', 58.5], ['CaCO₃', 100], ['MgO', 40],
  ['NaOH', 40], ['NH₃', 17], ['CH₄', 16], ['O₂', 32], ['N₂', 28],
  ['KOH', 56], ['CaO', 56], ['SO₂', 64], ['ZnO', 81], ['H₂SO₄', 98]
];
/* Only these are gases at room temperature. A question about "NaCl gas" is a
   chemistry mistake printed on a chemistry worksheet. */
const GASES = [['CO₂', 44], ['O₂', 32], ['N₂', 28], ['NH₃', 17], ['CH₄', 16], ['SO₂', 64]];

export const moles = [
  (r) => { const [f, mr] = pick(r, COMPOUNDS), n = int(r, 2, 12);
    return blankQ(`How many moles are there in ${num(n * mr)} g of ${f}? Its relative formula mass is ${mr}.`,
      n,
      { hint: 'Moles are mass divided by relative formula mass.',
        explanation: `${num(n * mr)} ÷ ${mr} = ${n} mol.` }); },

  (r) => { const [f, mr] = pick(r, COMPOUNDS), n = int(r, 2, 12);
    return blankQ(`What is the mass of ${n} mol of ${f}? Its relative formula mass is ${mr}. Give the answer in grams.`,
      num(n * mr),
      { hint: 'Mass is moles times relative formula mass.',
        explanation: `${n} × ${mr} = ${num(n * mr)} g.` }); },

  (r) => { const [f, mr] = pick(r, COMPOUNDS), n = int(r, 2, 12);
    return blankQ(`${n} mol of a compound has a mass of ${num(n * mr)} g. What is its relative formula mass?`,
      num(mr),
      { hint: 'Divide the mass by the number of moles.',
        explanation: `${num(n * mr)} ÷ ${n} = ${num(mr)}.` }); },

  (r) => { const [f, parts] = pick(r, BUILD);
    const mr = parts.reduce((t, [, ar, n]) => t + ar * n, 0);
    const given = parts.map(([el, ar]) => `${el} = ${ar}`).join(', ');
    const workings = parts.map(([, ar, n]) => `${ar} × ${n}`).join(' + ');
    return blankQ(`Work out the relative formula mass of ${f}. Relative atomic masses: ${given}.`,
      num(mr),
      { hint: 'Multiply each atomic mass by how many of that atom the formula has, then add.',
        explanation: `${workings} = ${num(mr)}.` }); },

  (r) => { const n = int(r, 2, 12);
    return blankQ(`What volume does ${n} mol of a gas occupy at room temperature and pressure, where one mole is 24 dm³? Give the answer in cubic decimetres.`,
      n * 24,
      { hint: 'Multiply the moles by 24.',
        explanation: `${n} × 24 = ${n * 24} dm³.` }); },

  (r) => { const n = int(r, 2, 12);
    return blankQ(`How many moles of gas occupy ${n * 24} dm³ at room temperature and pressure? One mole is 24 dm³.`,
      n,
      { hint: 'Divide the volume by 24.',
        explanation: `${n * 24} ÷ 24 = ${n} mol.` }); },

  (r) => { const [f, mr] = pick(r, COMPOUNDS), n = int(r, 2, 9);
    return blankQ(`A reaction needs ${n} mol of ${f}, whose relative formula mass is ${mr}. What mass must be weighed out, in grams?`,
      num(n * mr),
      { hint: 'Mass is moles times relative formula mass.',
        explanation: `${n} × ${mr} = ${num(n * mr)} g.` }); },

  (r) => { const el = pick(r, ['O', 'H', 'C', 'Na', 'Ca']), pairs = {
      O: ['H₂O', 18, 16], H: ['H₂O', 18, 2], C: ['CO₂', 44, 12],
      Na: ['NaCl', 58.5, 23], Ca: ['CaCO₃', 100, 40] };
    const [f, mr, part] = pairs[el];
    return blankQ(`What percentage of the mass of ${f} is ${el}? Its relative formula mass is ${mr}, and the ${el} in it accounts for ${part}.`,
      `${num(Math.round(part / mr * 1000) / 10)}%`,
      { accept: [String(num(Math.round(part / mr * 1000) / 10))],
        hint: 'Divide the part by the whole, then multiply by 100.',
        explanation: `${part} ÷ ${mr} × 100 = ${num(Math.round(part / mr * 1000) / 10)}%.` }); },

  (r) => { const n = int(r, 1, 6), ratio = pick(r, [2, 3]);
    return blankQ(`In a reaction, 1 mol of A makes ${ratio} mol of B. How many moles of B come from ${n} mol of A?`,
      n * ratio,
      { hint: 'Use the ratio in the balanced equation.',
        explanation: `${n} × ${ratio} = ${n * ratio} mol.` }); },

  (r) => { const n = int(r, 1, 6), ratio = pick(r, [2, 3]);
    return blankQ(`In a reaction, ${ratio} mol of A makes 1 mol of B. How many moles of A are needed for ${n} mol of B?`,
      n * ratio,
      { hint: 'Read the ratio the other way round.',
        explanation: `${n} × ${ratio} = ${n * ratio} mol.` }); },

  (r) => { const n = int(r, 1, 9);
    return blankQ(`How many particles are there in ${n} mol, where one mole contains 6 × 10²³ particles? Give your answer in standard form.`,
      `${n * 6 >= 10 ? num(n * 6 / 10) : n * 6} × 10^${n * 6 >= 10 ? 24 : 23}`,
      { accept: [`${n * 6 >= 10 ? num(n * 6 / 10) : n * 6}x10^${n * 6 >= 10 ? 24 : 23}`],
        hint: 'Multiply, then check the front number is below 10.',
        explanation: `${n} × 6 = ${n * 6}, so the answer is ${n * 6 >= 10 ? num(n * 6 / 10) : n * 6} × 10^${n * 6 >= 10 ? 24 : 23}.` }); },

  (r) => { const [f, mr] = pick(r, COMPOUNDS), g = int(r, 1, 9) * 10;
    const moles_ = Math.round(g / mr * 1000) / 1000;
    return blankQ(`How many moles are there in ${g} g of ${f}? Its relative formula mass is ${mr}. Give the answer as a decimal, rounded if it does not come out exactly.`,
      num(moles_),
      { hint: 'Divide the mass by the relative formula mass.',
        explanation: `${g} ÷ ${mr} = ${num(moles_)} mol.` }); }
];

/* Equations a school course actually balances, with their coefficients. */
const EQUATIONS = [
  ['H₂ + O₂ → H₂O', [2, 1, 2]],
  ['N₂ + H₂ → NH₃', [1, 3, 2]],
  ['CH₄ + O₂ → CO₂ + H₂O', [1, 2, 1, 2]],
  ['Na + Cl₂ → NaCl', [2, 1, 2]],
  ['Mg + O₂ → MgO', [2, 1, 2]],
  ['Fe + O₂ → Fe₂O₃', [4, 3, 2]],
  ['H₂ + Cl₂ → HCl', [1, 1, 2]],
  ['Al + O₂ → Al₂O₃', [4, 3, 2]],
  ['C₂H₆ + O₂ → CO₂ + H₂O', [2, 7, 4, 6]],
  ['Zn + HCl → ZnCl₂ + H₂', [1, 2, 1, 1]],
  ['CaCO₃ + HCl → CaCl₂ + H₂O + CO₂', [1, 2, 1, 1, 1]],
  ['C₃H₈ + O₂ → CO₂ + H₂O', [1, 5, 3, 4]],
  ['KOH + H₂SO₄ → K₂SO₄ + H₂O', [2, 1, 1, 2]],
  ['Cu + O₂ → CuO', [2, 1, 2]],
  ['Li + H₂O → LiOH + H₂', [2, 2, 2, 1]],
  ['Fe₂O₃ + C → Fe + CO₂', [2, 3, 4, 3]]
];
const ATOMS = [['H₂O', 3], ['CO₂', 3], ['NaCl', 2], ['CaCO₃', 5], ['H₂SO₄', 7],
               ['NH₃', 4], ['CH₄', 5], ['C₆H₁₂O₆', 24], ['Ca(OH)₂', 5], ['MgSO₄', 6]];

export const balancing = [
  (r) => { const [text, co] = pick(r, EQUATIONS);
    return blankQ(`Balance this equation and write the numbers in order: ${text}`, co.join(', '),
      { accept: [co.join(','), co.join(' ')],
        hint: 'Count each kind of atom on both sides, and change only the big numbers in front.',
        explanation: `The balanced equation needs ${co.join(', ')}.` }); },

  (r) => { const [text, co] = pick(r, EQUATIONS), i = int(r, 0, co.length - 1);
    const parts = text.split(/ \+ | → /);
    return blankQ(`In the balanced equation ${text}, what number goes in front of ${parts[i]}?`, co[i],
      { hint: 'Balance the whole equation, then read off that one number.',
        explanation: `The coefficients are ${co.join(', ')}, so ${parts[i]} takes ${co[i]}.` }); },

  (r) => { const [f, n] = pick(r, ATOMS);
    return blankQ(`How many atoms are there altogether in one formula unit of ${f}?`, n,
      { hint: 'Add up every atom, remembering the small numbers below the line.',
        explanation: `${f} contains ${n} atoms in total.` }); },

  (r) => { const [f, n] = pick(r, ATOMS), k = int(r, 2, 6);
    return blankQ(`How many atoms are there altogether in ${k} ${f}?`, n * k,
      { hint: 'The big number in front multiplies everything after it.',
        explanation: `${n} × ${k} = ${n * k} atoms.` }); },

  (r) => { const k = int(r, 2, 8);
    return blankQ(`How many oxygen atoms are there in ${k} CaCO₃?`, k * 3,
      { hint: 'There are three oxygens in each formula unit.',
        explanation: `3 × ${k} = ${k * 3}.` }); },

  (r) => { const k = int(r, 2, 8);
    return blankQ(`How many hydrogen atoms are there in ${k} H₂SO₄?`, k * 2,
      { hint: 'Two hydrogens in each formula unit.',
        explanation: `2 × ${k} = ${k * 2}.` }); },

  (r) => { const n = int(r, 1, 8);
    return blankQ(`In 2 H₂ + O₂ → 2 H₂O, how many moles of water form from ${n * 2} mol of hydrogen?`,
      n * 2,
      { hint: 'Hydrogen and water are in a one-to-one ratio here.',
        explanation: `2 mol of H₂ gives 2 mol of H₂O, so ${n * 2} mol gives ${n * 2} mol.` }); },

  (r) => { const n = int(r, 1, 8);
    return blankQ(`In 2 H₂ + O₂ → 2 H₂O, how many moles of oxygen are needed for ${n * 2} mol of hydrogen?`,
      n,
      { hint: 'The ratio of hydrogen to oxygen is two to one.',
        explanation: `${n * 2} ÷ 2 = ${n} mol.` }); },

  (r) => { const n = int(r, 1, 6);
    return blankQ(`In N₂ + 3 H₂ → 2 NH₃, how many moles of ammonia form from ${n} mol of nitrogen?`,
      n * 2,
      { hint: 'One nitrogen molecule makes two ammonia molecules.',
        explanation: `${n} × 2 = ${n * 2} mol.` }); },

  (r) => { const n = int(r, 1, 6);
    return blankQ(`In N₂ + 3 H₂ → 2 NH₃, how many moles of hydrogen react with ${n} mol of nitrogen?`,
      n * 3,
      { hint: 'Three hydrogen molecules per nitrogen molecule.',
        explanation: `${n} × 3 = ${n * 3} mol.` }); }
];

/* ========================= ATOMIC STRUCTURE ========================= */
/* Symbol, name, atomic number, mass number of the common isotope. */
const ELEMENTS = [
  ['H', 'hydrogen', 1, 1], ['He', 'helium', 2, 4], ['Li', 'lithium', 3, 7],
  ['Be', 'beryllium', 4, 9], ['B', 'boron', 5, 11], ['C', 'carbon', 6, 12],
  ['N', 'nitrogen', 7, 14], ['O', 'oxygen', 8, 16], ['F', 'fluorine', 9, 19],
  ['Ne', 'neon', 10, 20], ['Na', 'sodium', 11, 23], ['Mg', 'magnesium', 12, 24],
  ['Al', 'aluminium', 13, 27], ['Si', 'silicon', 14, 28], ['P', 'phosphorus', 15, 31],
  ['S', 'sulfur', 16, 32], ['Cl', 'chlorine', 17, 35], ['Ar', 'argon', 18, 40],
  ['K', 'potassium', 19, 39], ['Ca', 'calcium', 20, 40]
];
const shells = z => {           // 2, 8, 8, 2 for the first twenty elements
  const out = []; let left = z;
  for (const cap of [2, 8, 8, 2]) { if (left <= 0) break; out.push(Math.min(cap, left)); left -= cap; }
  return out;
};

export const atomicstructure = [
  (r) => { const [sym, name, z] = pick(r, ELEMENTS);
    return blankQ(`${name[0].toUpperCase()}${name.slice(1)} (${sym}) has an atomic number of ${z}. How many protons does one atom have?`,
      z,
      { hint: 'The atomic number is the number of protons.',
        explanation: `An atomic number of ${z} means ${z} protons.` }); },

  (r) => { const [sym, name, z] = pick(r, ELEMENTS);
    return blankQ(`A neutral atom of ${name} has ${z} protons. How many electrons does it have?`, z,
      { hint: 'A neutral atom has as many electrons as protons.',
        explanation: `${z} protons means ${z} electrons.` }); },

  (r) => { const [sym, name, z, a] = pick(r, ELEMENTS);
    return blankQ(`An atom of ${name} has an atomic number of ${z} and a mass number of ${a}. How many neutrons does it have?`,
      a - z,
      { hint: 'Neutrons are the mass number minus the atomic number.',
        explanation: `${a} − ${z} = ${a - z}.` }); },

  (r) => { const [sym, name, z, a] = pick(r, ELEMENTS);
    return blankQ(`An atom has ${z} protons and ${a - z} neutrons. What is its mass number?`, a,
      { hint: 'Mass number is protons plus neutrons.',
        explanation: `${z} + ${a - z} = ${a}.` }); },

  (r) => { const [sym, name, z, a] = pick(r, ELEMENTS);
    return blankQ(`An atom has a mass number of ${a} and ${a - z} neutrons. What is its atomic number?`, z,
      { hint: 'Take the neutrons off the mass number.',
        explanation: `${a} − ${a - z} = ${z}.` }); },

  /* The charge comes from the group, not from a hat. Sodium does not form a
     1− ion, and a worksheet that says it does teaches the wrong thing twice:
     once about ions and once about trusting the sheet. */
  (r) => { const CHARGE = { 1: 1, 2: 2, 3: 3, 6: -2, 7: -1 };
    const usable = ELEMENTS.filter(([sym, , z]) => {
      const sh = shells(z);
      /* Boron is group 3 and does not form a 3+ ion; aluminium does. */
      return sym !== 'B' && sh.length > 1 && CHARGE[sh[sh.length - 1]] !== undefined;
    });
    const [sym, name, z] = pick(r, usable);
    const sh = shells(z), charge = CHARGE[sh[sh.length - 1]];
    return blankQ(`An ion of ${name} has a charge of ${charge > 0 ? `${charge}+` : `${-charge}−`}. Its atom has ${z} electrons. How many electrons does the ion have?`,
      z - charge,
      { hint: charge > 0 ? 'A positive ion has lost electrons.' : 'A negative ion has gained electrons.',
        explanation: `${z} ${charge > 0 ? '−' : '+'} ${Math.abs(charge)} = ${z - charge}.` }); },

  (r) => { const [sym, name, z] = pick(r, ELEMENTS);
    return blankQ(`Write the electron arrangement of ${name}, which has ${z} electrons. Use commas, for example 2,8,1.`,
      shells(z).join(','),
      { accept: [shells(z).join(', ')],
        hint: 'The shells hold 2, then 8, then 8.',
        explanation: `${z} electrons fill as ${shells(z).join(',')}.` }); },

  (r) => { const [sym, name, z] = pick(r, ELEMENTS);
    const sh = shells(z);
    return blankQ(`${name[0].toUpperCase()}${name.slice(1)} has ${z} electrons. How many are in its outer shell?`,
      sh[sh.length - 1],
      { hint: 'Fill 2, then 8, then 8, and see what is left over.',
        explanation: `The arrangement is ${sh.join(',')}, so the outer shell has ${sh[sh.length - 1]}.` }); },

  (r) => { const candidates = ELEMENTS.filter(([, , z]) => shells(z).length > 1 && shells(z)[shells(z).length - 1] <= 8);
    const [sym, name, z] = pick(r, candidates);
    const sh = shells(z), outer = sh[sh.length - 1];
    return blankQ(`${name[0].toUpperCase()}${name.slice(1)} has ${outer} electron${outer === 1 ? '' : 's'} in its outer shell. Which group of the periodic table is it in?`,
      outer === 8 ? 0 : outer,
      { hint: 'The group number matches the outer electrons, except for the full shell.',
        explanation: `${outer} outer electrons puts it in group ${outer === 8 ? '0' : outer}.` }); },

  (r) => { const [sym, name, z] = pick(r, ELEMENTS);
    return blankQ(`${name[0].toUpperCase()}${name.slice(1)} has ${z} electrons. How many shells does it use?`,
      shells(z).length,
      { hint: 'Count the shells its arrangement needs.',
        explanation: `The arrangement is ${shells(z).join(',')}, which is ${shells(z).length} shell${shells(z).length === 1 ? '' : 's'}.` }); },

  (r) => { const a1 = int(r, 10, 40), a2 = a1 + int(r, 1, 4), pct = int(r, 1, 9) * 10;
    const ar = (a1 * pct + a2 * (100 - pct)) / 100;
    return blankQ(`An element has two isotopes: mass number ${a1} at ${pct}% and mass number ${a2} at ${100 - pct}%. What is its relative atomic mass?`,
      num(ar),
      { hint: 'Weight each mass number by its abundance, then divide by 100.',
        explanation: `(${a1} × ${pct} + ${a2} × ${100 - pct}) ÷ 100 = ${num(ar)}.` }); }
];

/* ==================== CONCENTRATION AND SOLUTIONS ==================== */
export const concentration = [
  (r) => { const c = int(r, 1, 12), v = int(r, 1, 10);
    return blankQ(`${c * v} mol of ${pick(r, SOLUTES)} is dissolved to make ${v} dm³ of solution. What is the concentration, in moles per cubic decimetre?`,
      c,
      { hint: 'Concentration is moles divided by volume.',
        explanation: `${c * v} ÷ ${v} = ${c} mol/dm³.` }); },

  (r) => { const c = int(r, 1, 12), v = int(r, 1, 10);
    return blankQ(`How many moles are there in ${v} dm³ of a ${c} mol/dm³ solution?`, c * v,
      { hint: 'Moles are concentration times volume.',
        explanation: `${c} × ${v} = ${c * v} mol.` }); },

  (r) => { const c = int(r, 1, 12), v = int(r, 1, 10);
    return blankQ(`What volume of a ${c} mol/dm³ solution contains ${c * v} mol? Give the answer in cubic decimetres.`,
      v,
      { hint: 'Volume is moles divided by concentration.',
        explanation: `${c * v} ÷ ${c} = ${v} dm³.` }); },

  (r) => { const cm = int(r, 1, 99) * 10;
    return blankQ(`Convert ${cm} cm³ to cubic decimetres.`, num(cm / 1000),
      { hint: 'There are 1000 cm³ in a dm³.',
        explanation: `${cm} ÷ 1000 = ${num(cm / 1000)} dm³.` }); },

  (r) => { const dm = int(r, 1, 40) / 10;
    return blankQ(`Convert ${num(dm)} dm³ to cubic centimetres.`, dm * 1000,
      { hint: 'Multiply by 1000.', explanation: `${num(dm)} × 1000 = ${dm * 1000} cm³.` }); },

  (r) => { const c = int(r, 1, 8), mr = pick(r, [40, 56, 58.5, 100, 98]);
    return blankQ(`A solution is ${c} mol/dm³ and the solute has a relative formula mass of ${mr}. What is the concentration in grams per cubic decimetre?`,
      num(c * mr),
      { hint: 'Multiply the concentration in moles by the relative formula mass.',
        explanation: `${c} × ${mr} = ${num(c * mr)} g/dm³.` }); },

  (r) => { const g = int(r, 2, 40) * 5, v = pick(r, [1, 2, 4, 5]);
    return blankQ(`${g * v} g of ${pick(r, SOLUTES)} is dissolved to make ${v} dm³ of solution. What is the concentration, in grams per cubic decimetre?`,
      g,
      { hint: 'Divide the mass by the volume.',
        explanation: `${g * v} ÷ ${v} = ${g} g/dm³.` }); },

  (r) => { const c1 = int(r, 2, 10), k = int(r, 2, 5), v1 = int(r, 1, 10);
    return blankQ(`${v1} dm³ of a ${c1} mol/dm³ solution is diluted to ${v1 * k} dm³. What is the new concentration, in moles per cubic decimetre?`,
      num(c1 / k),
      { hint: 'The moles do not change, so the concentration falls by the same factor the volume rose.',
        explanation: `${c1} ÷ ${k} = ${num(c1 / k)} mol/dm³.` }); },

  (r) => { const c = int(r, 1, 6), cm = pick(r, [100, 200, 250, 500]), mr = pick(r, [40, 56, 100]);
    const mass = c * (cm / 1000) * mr;
    return blankQ(`What mass of solute, with relative formula mass ${mr}, is needed to make ${cm} cm³ of a ${c} mol/dm³ solution? Give the answer in grams.`,
      num(mass),
      { hint: 'Change the volume to dm³, find the moles, then turn moles into mass.',
        explanation: `${cm} cm³ is ${num(cm / 1000)} dm³; ${c} × ${num(cm / 1000)} = ${num(c * cm / 1000)} mol; × ${mr} = ${num(mass)} g.` }); },

  (r) => { const c = int(r, 1, 8), cm = pick(r, [25, 50, 100, 250]);
    return blankQ(`How many moles are there in ${cm} cm³ of a ${c} mol/dm³ solution?`,
      num(c * cm / 1000),
      { hint: 'Turn the volume into cubic decimetres first.',
        explanation: `${cm} ÷ 1000 = ${num(cm / 1000)} dm³, and ${c} × ${num(cm / 1000)} = ${num(c * cm / 1000)} mol.` }); },

  (r) => { const c = int(r, 1, 5), cm = pick(r, [20, 25, 50]);
    return blankQ(`A titration uses ${cm} cm³ of a ${c} mol/dm³ acid. How many moles of acid is that?`,
      num(c * cm / 1000),
      { hint: 'Change the volume to cubic decimetres, then multiply.',
        explanation: `${cm} ÷ 1000 = ${num(cm / 1000)} dm³, and ${c} × ${num(cm / 1000)} = ${num(c * cm / 1000)} mol.` }); },

  (r) => { const n = int(r, 1, 8), cm = pick(r, [100, 200, 250, 500, 1000]);
    return blankQ(`${n} mol of ${pick(r, SOLUTES)} is dissolved in ${cm} cm³ of solution. What is the concentration, in moles per cubic decimetre?`,
      num(n / (cm / 1000)),
      { hint: 'Turn the volume into cubic decimetres before dividing.',
        explanation: `${cm} cm³ is ${num(cm / 1000)} dm³, and ${n} ÷ ${num(cm / 1000)} = ${num(n / (cm / 1000))} mol/dm³.` }); },

  (r) => { const mg = int(r, 1, 40), l = pick(r, [1, 2, 5, 10]);
    return blankQ(`${mg * l} mg of a substance is dissolved in ${l} litres of water. What is the concentration, in milligrams per litre?`,
      mg,
      { hint: 'Divide the mass by the volume.',
        explanation: `${mg * l} ÷ ${l} = ${mg} mg/l.` }); },

  (r) => { const g = int(r, 1, 20), dm = pick(r, [1, 2, 4, 5]), mr = pick(r, [40, 56, 100]);
    return blankQ(`${g * dm} g of ${pick(r, SOLUTES)}, with relative formula mass ${mr} is dissolved to make ${dm} dm³. What is the concentration, in grams per cubic decimetre?`,
      g,
      { hint: 'Grams per cubic decimetre needs only the mass and the volume.',
        explanation: `${g * dm} ÷ ${dm} = ${g} g/dm³.` }); },

  (r) => { const c = int(r, 2, 12), mr = pick(r, [40, 56, 100, 98]);
    return blankQ(`A solution is ${c * mr} g/dm³ and the solute has a relative formula mass of ${mr}. What is the concentration, in moles per cubic decimetre?`,
      c,
      { hint: 'Divide the grams per cubic decimetre by the relative formula mass.',
        explanation: `${c * mr} ÷ ${mr} = ${c} mol/dm³.` }); },

  (r) => { const v1 = int(r, 1, 5), c1 = int(r, 2, 12), k = int(r, 2, 4);
    return blankQ(`${v1} dm³ of a ${c1} mol/dm³ solution is watered down to ${num(c1 / k)} mol/dm³. What is the new total volume, in cubic decimetres?`,
      v1 * k,
      { hint: 'The moles stay the same, so the volume rises by the factor the concentration fell.',
        explanation: `The concentration fell by a factor of ${k}, so the volume is ${v1} × ${k} = ${v1 * k} dm³.` }); }
];

/* ====================== GAS LAWS AND MOLAR VOLUME ====================== */
export const gaslaws = [
  (r) => { const p1 = int(r, 2, 20), v1 = int(r, 2, 20), k = int(r, 2, 5);
    return blankQ(`A gas at ${p1 * k} kPa occupies ${v1} dm³. At constant temperature, what volume does it occupy at ${p1} kPa? Give the answer in cubic decimetres.`,
      v1 * k,
      { hint: 'Pressure times volume stays the same.',
        explanation: `${p1 * k} × ${v1} = ${p1 * k * v1}, and ${p1 * k * v1} ÷ ${p1} = ${v1 * k} dm³.` }); },

  (r) => { const p1 = int(r, 2, 20), v1 = int(r, 2, 20), k = int(r, 2, 5);
    return blankQ(`A gas at ${p1} kPa occupies ${v1 * k} dm³. At constant temperature, what pressure squeezes it into ${v1} dm³? Give the answer in kilopascals.`,
      p1 * k,
      { hint: 'Pressure times volume stays the same.',
        explanation: `${p1} × ${v1 * k} = ${p1 * v1 * k}, and ${p1 * v1 * k} ÷ ${v1} = ${p1 * k} kPa.` }); },

  (r) => { const t1 = int(r, 20, 60) * 5, v1 = int(r, 2, 12), k = int(r, 2, 3);
    return blankQ(`A gas occupies ${v1} dm³ at ${t1} K. At constant pressure, what volume does it occupy at ${t1 * k} K? Give the answer in cubic decimetres.`,
      v1 * k,
      { hint: 'Volume divided by temperature in kelvin stays the same.',
        explanation: `The temperature is ${k} times higher, so the volume is too: ${v1 * k} dm³.` }); },

  (r) => { const t1 = int(r, 20, 60) * 5, p1 = int(r, 2, 20), k = int(r, 2, 3);
    return blankQ(`A sealed gas is at ${p1} kPa and ${t1} K. What is its pressure at ${t1 * k} K? Give the answer in kilopascals.`,
      p1 * k,
      { hint: 'At constant volume, pressure is proportional to temperature in kelvin.',
        explanation: `${p1} × ${k} = ${p1 * k} kPa.` }); },

  (r) => { const c = int(r, -50, 150);
    return blankQ(`A gas is at ${sn(c)} °C. What is that in kelvin?`, c + 273,
      { hint: 'Add 273 to change Celsius to kelvin.',
        explanation: `${sn(c)} + 273 = ${c + 273} K.` }); },

  (r) => { const n = int(r, 1, 12);
    return blankQ(`What volume does ${n} mol of gas occupy at room temperature and pressure? One mole is 24 dm³. Give the answer in cubic decimetres.`,
      n * 24,
      { hint: 'Multiply by 24.', explanation: `${n} × 24 = ${n * 24} dm³.` }); },

  (r) => { const n = int(r, 1, 12);
    return blankQ(`${n * 24000} cm³ of gas is collected at room temperature and pressure. How many moles is that? One mole is 24 dm³.`,
      n,
      { hint: 'Change to dm³ first, then divide by 24.',
        explanation: `${n * 24000} cm³ is ${n * 24} dm³, and ${n * 24} ÷ 24 = ${n} mol.` }); },

  (r) => { const [f, mr] = pick(r, GASES), n = int(r, 1, 8);
    return blankQ(`What volume does ${num(n * mr)} g of ${f} gas occupy at room temperature and pressure? Its relative formula mass is ${mr} and one mole is 24 dm³. Give the answer in cubic decimetres.`,
      n * 24,
      { hint: 'Find the moles first, then multiply by 24.',
        explanation: `${num(n * mr)} ÷ ${mr} = ${n} mol, and ${n} × 24 = ${n * 24} dm³.` }); },

  (r) => { const v = int(r, 2, 20), k = int(r, 2, 4);
    return blankQ(`A gas is compressed from ${v * k} dm³ to ${v} dm³ at constant temperature. By what factor does its pressure rise?`,
      k,
      { hint: 'Pressure and volume are inversely proportional.',
        explanation: `The volume fell by a factor of ${k}, so the pressure rose by ${k}.` }); },

  (r) => { const t = int(r, 20, 90) * 5, k = int(r, 2, 3);
    return blankQ(`A gas at ${t} K is heated at constant pressure until its volume is ${k} times as large. What is its new temperature, in kelvin?`,
      t * k,
      { hint: 'At constant pressure, volume and temperature in kelvin rise together.',
        explanation: `${t} × ${k} = ${t * k} K.` }); },

  (r) => { const pa = int(r, 2, 90);
    return blankQ(`Convert ${pa} kPa to pascals.`, pa * 1000,
      { hint: 'A kilopascal is 1000 pascals.', explanation: `${pa} × 1000 = ${pa * 1000} Pa.` }); },

  (r) => { const pa = int(r, 2, 90) * 1000;
    return blankQ(`Convert ${pa} Pa to kilopascals.`, pa / 1000,
      { hint: 'Divide by 1000.', explanation: `${pa} ÷ 1000 = ${pa / 1000} kPa.` }); },

  (r) => { const [f, mr] = pick(r, GASES), n = int(r, 1, 6);
    return blankQ(`What is the mass of ${n * 24} dm³ of ${f} gas at room temperature and pressure? Its relative formula mass is ${mr} and one mole is 24 dm³. Give the answer in grams.`,
      num(n * mr),
      { hint: 'Find the moles from the volume first.',
        explanation: `${n * 24} ÷ 24 = ${n} mol, and ${n} × ${mr} = ${num(n * mr)} g.` }); },

  (r) => { const p1 = int(r, 2, 20), v1 = int(r, 2, 12), k = int(r, 2, 4);
    return blankQ(`A gas at ${p1 * k} kPa in ${v1 * k} dm³ is changed to ${p1} kPa at the same temperature. What is its new volume, in cubic decimetres?`,
      v1 * k * k,
      { hint: 'Pressure times volume is unchanged.',
        explanation: `${p1 * k} × ${v1 * k} = ${p1 * k * v1 * k}, and ${p1 * k * v1 * k} ÷ ${p1} = ${v1 * k * k} dm³.` }); }
];

/* ==================== MICROSCOPY AND MAGNIFICATION ==================== */
export const magnification = [
  (r) => { const actual = int(r, 2, 40), mag = pick(r, [10, 20, 40, 50, 100, 200, 400]);
    return blankQ(`${pick(r, SPECIMENS)} is ${actual} µm across and is drawn ${actual * mag} µm across. What is the magnification?`,
      `×${mag}`,
      { accept: [String(mag), `x${mag}`],
        hint: 'Magnification is image size divided by real size.',
        explanation: `${actual * mag} ÷ ${actual} = ${mag}.` }); },

  (r) => { const actual = int(r, 2, 40), mag = pick(r, [10, 20, 40, 50, 100]);
    return blankQ(`${pick(r, SPECIMENS)} ${actual} µm across is viewed at ×${mag}. How wide is the image, in micrometres?`,
      actual * mag,
      { hint: 'Image size is real size times magnification.',
        explanation: `${actual} × ${mag} = ${actual * mag} µm.` }); },

  (r) => { const actual = int(r, 2, 40), mag = pick(r, [10, 20, 40, 50, 100]);
    return blankQ(`An image is ${actual * mag} µm wide at a magnification of ×${mag}. How wide is the real object, in micrometres?`,
      actual,
      { hint: 'Real size is image size divided by magnification.',
        explanation: `${actual * mag} ÷ ${mag} = ${actual} µm.` }); },

  (r) => { const mm = int(r, 1, 90);
    return blankQ(`Convert ${mm} mm to micrometres.`, mm * 1000,
      { hint: 'There are 1000 micrometres in a millimetre.',
        explanation: `${mm} × 1000 = ${mm * 1000} µm.` }); },

  (r) => { const um = int(r, 1, 90) * 100;
    return blankQ(`Convert ${um} µm to millimetres.`, num(um / 1000),
      { hint: 'Divide by 1000.', explanation: `${um} ÷ 1000 = ${num(um / 1000)} mm.` }); },

  (r) => { const eye = pick(r, [5, 10, 15]), obj = pick(r, [4, 10, 40, 100]);
    return blankQ(`An eyepiece lens is ×${eye} and the objective lens is ×${obj}. What is the total magnification?`,
      `×${eye * obj}`,
      { accept: [String(eye * obj), `x${eye * obj}`],
        hint: 'Multiply the two magnifications.',
        explanation: `${eye} × ${obj} = ${eye * obj}.` }); },

  (r) => { const n = int(r, 2, 20), width = int(r, 2, 12) * 100;
    return blankQ(`${n} of them fit end to end across a field of view ${n * width} µm wide. How wide is one cell, in micrometres?`,
      width,
      { hint: 'Divide the field of view by how many cells fit.',
        explanation: `${n * width} ÷ ${n} = ${width} µm.` }); },

  (r) => { const mm = int(r, 1, 9), mag = pick(r, [100, 200, 400, 1000]);
    return blankQ(`A drawing is ${mm} mm long at a magnification of ×${mag}. How long is the real object, in micrometres?`,
      num(mm * 1000 / mag),
      { hint: 'Change the drawing to micrometres first, then divide by the magnification.',
        explanation: `${mm} mm is ${mm * 1000} µm, and ${mm * 1000} ÷ ${mag} = ${num(mm * 1000 / mag)} µm.` }); },

  (r) => { const um = int(r, 1, 90) * 10;
    return blankQ(`Convert ${um} µm to nanometres.`, um * 1000,
      { hint: 'There are 1000 nanometres in a micrometre.',
        explanation: `${um} × 1000 = ${um * 1000} nm.` }); },

  (r) => { const cells = int(r, 2, 12), hours = int(r, 1, 6);
    return blankQ(`A culture doubles every hour. Starting from ${cells} cells, how many are there after ${hours} hours?`,
      cells * Math.pow(2, hours),
      { hint: 'Double it once for every hour.',
        explanation: `${cells} × 2^${hours} = ${cells * Math.pow(2, hours)}.` }); },

  (r) => { const bar = pick(r, [10, 20, 50, 100]), mm = int(r, 10, 60);
    return blankQ(`A scale bar labelled ${bar} µm is ${mm} mm long on the page. What is the magnification?`,
      `×${num(mm * 1000 / bar)}`,
      { accept: [String(num(mm * 1000 / bar)), `x${num(mm * 1000 / bar)}`],
        hint: 'Put both lengths in the same unit first.',
        explanation: `${mm} mm is ${mm * 1000} µm, and ${mm * 1000} ÷ ${bar} = ${num(mm * 1000 / bar)}.` }); },

  (r) => { const um = int(r, 2, 50), mag = pick(r, [100, 200, 400, 500]);
    return blankQ(`An object ${um} µm across is drawn at ×${mag}. How long is the drawing, in millimetres?`,
      num(um * mag / 1000),
      { hint: 'Find the image size in micrometres, then change to millimetres.',
        explanation: `${um} × ${mag} = ${um * mag} µm, which is ${num(um * mag / 1000)} mm.` }); },

  (r) => { const cell = int(r, 2, 25), n = int(r, 3, 30);
    return blankQ(`A field of view is ${cell * n} µm across and each cell is ${cell} µm wide. How many cells fit across it?`,
      n,
      { hint: 'Divide the field of view by the cell width.',
        explanation: `${cell * n} ÷ ${cell} = ${n}.` }); },

  (r) => { const nm = int(r, 1, 90) * 1000;
    return blankQ(`Convert ${nm} nm to micrometres.`, nm / 1000,
      { hint: 'Divide by 1000.', explanation: `${nm} ÷ 1000 = ${nm / 1000} µm.` }); },

  (r) => { const small = int(r, 2, 20), k = int(r, 2, 50);
    return blankQ(`One cell is ${small} µm wide and another is ${small * k} µm wide. How many times wider is the second?`,
      k,
      { hint: 'Divide the larger by the smaller.',
        explanation: `${small * k} ÷ ${small} = ${k}.` }); },

  (r) => { const start = int(r, 2, 20), gen = int(r, 2, 6);
    return blankQ(`A bacterium divides in two every 20 minutes. Starting from ${start}, how many are there after ${gen * 20} minutes?`,
      start * Math.pow(2, gen),
      { hint: 'Work out how many divisions fit into the time, then double that many times.',
        explanation: `${gen * 20} ÷ 20 = ${gen} divisions, and ${start} × 2^${gen} = ${start * Math.pow(2, gen)}.` }); }
];

/* ==================== RADIOACTIVITY AND HALF-LIFE ==================== */
export const radioactivity = [
  (r) => { const half = pick(r, [2, 5, 10, 20, 25, 50, 100]), n = int(r, 1, 5);
    const start = 16 * int(r, 1, 40);
    return blankQ(`${pick(r, SOURCES)} has a half-life of ${half} years and a starting count of ${start} counts per minute. What is the count after ${half * n} years?`,
      num(start / Math.pow(2, n)),
      { hint: `${half * n} years is ${n} half-${n === 1 ? 'life' : 'lives'}.`,
        explanation: `Halving ${n} time${n === 1 ? '' : 's'} gives ${num(start / Math.pow(2, n))} counts per minute.` }); },

  (r) => { const half = pick(r, [2, 5, 10, 20, 25, 50]), n = int(r, 1, 6);
    return blankQ(`How many half-lives are there in ${half * n} years, if the half-life is ${half} years?`, n,
      { hint: 'Divide the time by the half-life.',
        explanation: `${half * n} ÷ ${half} = ${n}.` }); },

  (r) => { const half = pick(r, [2, 5, 10, 20, 25, 50]), n = int(r, 1, 6);
    return blankQ(`${pick(r, SOURCES)} takes ${half * n} years to fall through ${n} half-${n === 1 ? 'life' : 'lives'}. What is its half-life, in years?`,
      half,
      { hint: 'Divide the total time by the number of half-lives.',
        explanation: `${half * n} ÷ ${n} = ${half} years.` }); },

  (r) => { const n = int(r, 1, 5), start = Math.pow(2, n) * int(r, 1, 30);
    return blankQ(`${pick(r, SOURCES)} of mass ${start} g falls to ${start / Math.pow(2, n)} g. How many half-lives have passed?`, n,
      { hint: 'Count how many times you have to halve the starting mass.',
        explanation: `Halving ${start} g ${n} time${n === 1 ? '' : 's'} gives ${start / Math.pow(2, n)} g.` }); },

  (r) => { const half = pick(r, [4, 6, 8, 12, 24]), n = int(r, 1, 4), start = Math.pow(2, n) * int(r, 1, 25);
    return blankQ(`${pick(r, SOURCES)} of mass ${start} g has a half-life of ${half} hours. What mass is left after ${half * n} hours? Give the answer in grams.`,
      start / Math.pow(2, n),
      { hint: 'Work out the number of half-lives first.',
        explanation: `${half * n} ÷ ${half} = ${n} half-lives, leaving ${start / Math.pow(2, n)} g.` }); },

  (r) => { const a = int(r, 210, 240), z = int(r, 84, 92);
    return blankQ(`An atom with mass number ${a} and atomic number ${z} emits an alpha particle. What is the new mass number?`,
      a - 4,
      { hint: 'An alpha particle carries away 2 protons and 2 neutrons.',
        explanation: `${a} − 4 = ${a - 4}.` }); },

  (r) => { const a = int(r, 210, 240), z = int(r, 84, 92);
    return blankQ(`An atom with mass number ${a} and atomic number ${z} emits an alpha particle. What is the new atomic number?`,
      z - 2,
      { hint: 'An alpha particle carries away 2 protons.',
        explanation: `${z} − 2 = ${z - 2}.` }); },

  (r) => { const a = int(r, 12, 90), z = int(r, 6, 40);
    return blankQ(`An atom with mass number ${a} and atomic number ${z} emits a beta particle. What is the new atomic number?`,
      z + 1,
      { hint: 'In beta decay a neutron becomes a proton.',
        explanation: `${z} + 1 = ${z + 1}.` }); },

  (r) => { const a = int(r, 12, 90), z = int(r, 6, 40);
    return blankQ(`An atom with mass number ${a} and atomic number ${z} emits a beta particle. What is the new mass number?`,
      a,
      { hint: 'A neutron turns into a proton, so the total stays the same.',
        explanation: `The mass number is unchanged at ${a}.` }); },

  (r) => { const bg = int(r, 10, 40), reading = int(r, 100, 900);
    return blankQ(`${pick(r, DETECTORS)} reads ${reading + bg} counts per minute and the background is ${bg}. What is the corrected count rate, in counts per minute?`,
      reading,
      { hint: 'Take the background reading away.',
        explanation: `${reading + bg} − ${bg} = ${reading}.` }); },

  (r) => { const n = int(r, 1, 6);
    return blankQ(`What fraction of a radioactive sample is left after ${n} half-${n === 1 ? 'life' : 'lives'}?`,
      `1/${Math.pow(2, n)}`,
      { hint: 'Halve it once for each half-life.',
        explanation: `Halving ${n} time${n === 1 ? '' : 's'} leaves 1/${Math.pow(2, n)}.` }); },

  (r) => { const n = pick(r, [1, 2]);
    return blankQ(`What percentage of a radioactive sample is left after ${n} half-${n === 1 ? 'life' : 'lives'}?`,
      `${100 / Math.pow(2, n)}%`,
      { accept: [String(100 / Math.pow(2, n))],
        hint: 'Start at 100% and halve.',
        explanation: `100% halved ${n} time${n === 1 ? '' : 's'} is ${100 / Math.pow(2, n)}%.` }); },

  (r) => { const decays = int(r, 2, 60), t = int(r, 2, 20);
    return blankQ(`${pick(r, SOURCES)} gives ${decays * t} decays in ${t} seconds. What is its activity, in becquerels?`,
      decays,
      { hint: 'A becquerel is one decay per second.',
        explanation: `${decays * t} ÷ ${t} = ${decays} Bq.` }); },

  (r) => { const half = pick(r, [3, 6, 12, 30]), n = int(r, 1, 5), start = Math.pow(2, n) * int(r, 1, 20);
    return blankQ(`An activity of ${start} Bq falls to ${start / Math.pow(2, n)} Bq. If the half-life is ${half} days, how long did that take, in days?`,
      half * n,
      { hint: 'Count the halvings, then multiply by the half-life.',
        explanation: `${n} half-${n === 1 ? 'life' : 'lives'} × ${half} = ${half * n} days.` }); },

  (r) => { const n = int(r, 1, 5), nuclei = Math.pow(2, n) * int(r, 1, 50) * 1000;
    return blankQ(`${pick(r, SOURCES)} starts with ${nuclei} undecayed nuclei. How many are left after ${n} half-${n === 1 ? 'life' : 'lives'}?`,
      nuclei / Math.pow(2, n),
      { hint: 'Halve the count once per half-life.',
        explanation: `${nuclei} halved ${n} time${n === 1 ? '' : 's'} is ${nuclei / Math.pow(2, n)}.` }); },

  (r) => { const bg = int(r, 10, 40), n = int(r, 1, 4), corrected = Math.pow(2, n) * int(r, 10, 60);
    return blankQ(`${pick(r, DETECTORS)} reads ${corrected + bg} counts per minute with a background of ${bg}. After ${n} half-${n === 1 ? 'life' : 'lives'}, what is the corrected count rate, in counts per minute?`,
      corrected / Math.pow(2, n),
      { hint: 'Take off the background first, then halve.',
        explanation: `${corrected + bg} − ${bg} = ${corrected}, halved ${n} time${n === 1 ? '' : 's'} gives ${corrected / Math.pow(2, n)}.` }); }
];

/* Every science drill family, keyed the way the generator table expects. */
export const SCIENCE_DRILL_GENERATORS = {
  speeddistancetime, forcesmotion, energywork, densitypressure, electricity,
  waves, moments, heatenergy,
  moles, balancing, atomicstructure, concentration, gaslaws,
  magnification, radioactivity
};
