/* Applied drills: the calculations the other subjects keep coming back to.

   Music theory, map skills, economics, health and engineering each have a
   handful of sums a course returns to every week, and none of them had a
   sheet. These are those sums, computed from the numbers that render the
   question so tools/check-drill.mjs can work them out again.             */

import { int, pick, blankQ, choice, num, PEOPLE } from './gen-core.js';

/* "an octave", not "a octave". */
const an = w => `${/^[aeiou]/i.test(w) ? 'an' : 'a'} ${w}`;

/* ============================== MUSIC THEORY ============================== */
/* Note, and how many crotchet beats it lasts. */
const NOTES = [['semibreve', 4], ['minim', 2], ['crotchet', 1],
               ['quaver', 0.5], ['semiquaver', 0.25]];
const KEY_SHARPS = [['G major', 1], ['D major', 2], ['A major', 3],
                    ['E major', 4], ['B major', 5]];
const KEY_FLATS = [['F major', 1], ['B flat major', 2], ['E flat major', 3],
                   ['A flat major', 4], ['D flat major', 5]];
/* Unison is left out: it is nought semitones, and "an unison" is wrong while
   "a unison" breaks the vowel rule the rest of the list follows. */
const INTERVALS = [['major second', 2], ['major third', 4],
                   ['perfect fourth', 5], ['perfect fifth', 7],
                   ['major sixth', 9], ['major seventh', 11], ['octave', 12]];

export const readingmusic = [
  (r) => { const [big, bigBeats] = pick(r, NOTES.slice(0, 3));
    const [small, smallBeats] = pick(r, NOTES.filter(n => n[1] < bigBeats));
    return blankQ(`How many ${small}s last as long as one ${big}?`, bigBeats / smallBeats,
      { hint: 'Count in crotchet beats and divide.',
        explanation: `A ${big} is ${bigBeats} beat${bigBeats === 1 ? '' : 's'} and a ${small} is ${num(smallBeats)}, so ${bigBeats} ÷ ${num(smallBeats)} = ${bigBeats / smallBeats}.` }); },

  (r) => { const top = pick(r, [2, 3, 4, 6]);
    return blankQ(`How many crotchet beats are there in one bar of ${top}/4 time?`, top,
      { hint: 'The top number counts the beats in a bar.',
        explanation: `${top}/4 has ${top} crotchet beats in a bar.` }); },

  (r) => { const top = pick(r, [2, 3, 4]), bars = int(r, 2, 16);
    return blankQ(`How many crotchet beats are there in ${bars} bars of ${top}/4 time?`, top * bars,
      { hint: 'Beats in a bar, times the number of bars.',
        explanation: `${top} × ${bars} = ${top * bars} beats.` }); },

  (r) => { const [note, beats] = pick(r, NOTES.slice(0, 4));
    return blankQ(`A dotted ${note} lasts half as long again. How many crotchet beats is that?`,
      num(beats * 1.5),
      { hint: 'A dot adds half the note’s own value.',
        explanation: `${num(beats)} + ${num(beats / 2)} = ${num(beats * 1.5)} beats.` }); },

  (r) => { const [name, semis] = pick(r, INTERVALS);
    return blankQ(`How many semitones are there in ${an(name)}?`, semis,
      { hint: 'Count the steps on a keyboard, black notes included.',
        explanation: `${an(name)[0].toUpperCase()}${an(name).slice(1)} is ${semis} semitone${semis === 1 ? '' : 's'}.` }); },

  (r) => { const [name, semis] = pick(r, INTERVALS.filter(i => i[1] > 0));
    return choice(r, {
      prompt: `Which interval is ${semis} semitones?`,
      correct: name,
      distractors: INTERVALS.filter(i => i[0] !== name && i[1] !== semis).map(i => i[0]).slice(0, 3),
      hint: 'Count the steps up a keyboard, black notes included, and name what you land on.',
      explanation: `${semis} semitones is ${an(name)}.`
    }); },

  (r) => { const [key, sharps] = pick(r, KEY_SHARPS);
    return blankQ(`How many sharps are in the key signature of ${key}?`, sharps,
      { hint: 'Each step round the circle of fifths adds one sharp.',
        explanation: `${key} has ${sharps} sharp${sharps === 1 ? '' : 's'}.` }); },

  (r) => { const [key, flats] = pick(r, KEY_FLATS);
    return blankQ(`How many flats are in the key signature of ${key}?`, flats,
      { hint: 'Each step round the circle of fourths adds one flat.',
        explanation: `${key} has ${flats} flat${flats === 1 ? '' : 's'}.` }); },

  (r) => { const bpm = pick(r, [60, 80, 90, 100, 120, 150]), secs = int(r, 2, 40);
    return blankQ(`At ${bpm} beats a minute, how many beats are there in ${secs} seconds? Give the answer to the nearest beat.`,
      Math.round(bpm * secs / 60),
      { hint: 'Beats a minute divided by 60 gives beats a second.',
        explanation: `${bpm} ÷ 60 × ${secs} is about ${num(Math.round(bpm * secs / 60))} beats.` }); },

  (r) => { const bpm = pick(r, [60, 120]), bars = int(r, 4, 40), top = pick(r, [2, 3, 4]);
    const beats = bars * top, secs = beats * 60 / bpm;
    return blankQ(`A piece is ${bars} bars of ${top}/4 at ${bpm} beats a minute. How long does it last, in seconds?`,
      num(secs),
      { hint: 'Count the beats first, then turn beats into seconds.',
        explanation: `${bars} × ${top} = ${beats} beats, and ${beats} × 60 ÷ ${bpm} = ${num(secs)} seconds.` }); },

  (r) => { const [note, beats] = pick(r, NOTES);
    return blankQ(`How many crotchet beats does a ${note} last?`, num(beats),
      { hint: 'A crotchet is one beat; work out from there.',
        explanation: `A ${note} lasts ${num(beats)} beat${beats === 1 ? '' : 's'}.` }); },

  (r) => { const top = pick(r, [3, 4]), used = int(r, 1, top - 1);
    return blankQ(`A bar of ${top}/4 already holds ${used} crotchet beat${used === 1 ? '' : 's'}. How many beats are left?`,
      top - used,
      { hint: 'Take what is there from the beats a bar holds.',
        explanation: `${top} − ${used} = ${top - used}.` }); }
];

/* =============================== MAP SKILLS =============================== */
export const mapskills = [
  (r) => { const scale = pick(r, [25000, 50000, 10000, 100000]), cm = int(r, 2, 20);
    return blankQ(`A map has a scale of 1:${scale}. How many metres on the ground does ${cm} cm represent?`,
      cm * scale / 100,
      { hint: 'One centimetre on the map is the scale number in centimetres on the ground.',
        explanation: `${cm} × ${scale} = ${cm * scale} cm, which is ${cm * scale / 100} m.` }); },

  (r) => { const scale = pick(r, [25000, 50000, 100000]), cm = int(r, 2, 20);
    return blankQ(`A map has a scale of 1:${scale}. How many kilometres on the ground does ${cm} cm represent?`,
      num(cm * scale / 100000),
      { hint: 'Work it out in metres first, then divide by 1000.',
        explanation: `${cm} × ${scale} ÷ 100000 = ${num(cm * scale / 100000)} km.` }); },

  (r) => { const scale = pick(r, [25000, 50000]), km = int(r, 1, 12);
    return blankQ(`A map has a scale of 1:${scale}. How many centimetres on the map is ${km} km on the ground?`,
      num(km * 100000 / scale),
      { hint: 'Turn the kilometres into centimetres, then divide by the scale.',
        explanation: `${km} km is ${km * 100000} cm, and ${km * 100000} ÷ ${scale} = ${num(km * 100000 / scale)} cm.` }); },

  (r) => { const interval = pick(r, [5, 10, 25]), lines = int(r, 2, 12);
    return blankQ(`Contour lines are drawn every ${interval} m. What is the height difference across ${lines} lines?`,
      interval * lines,
      { hint: 'Each line is one interval of height.',
        explanation: `${interval} × ${lines} = ${interval * lines} m.` }); },

  (r) => { const bearing = int(r, 0, 179);
    return blankQ(`A bearing is ${String(bearing).padStart(3, '0')}°. What is the back bearing?`,
      bearing + 180,
      { hint: 'A back bearing is 180° away.',
        explanation: `${bearing} + 180 = ${bearing + 180}°.` }); },

  (r) => { const bearing = int(r, 180, 359);
    return blankQ(`A bearing is ${bearing}°. What is the back bearing?`, bearing - 180,
      { hint: 'Over 180°, take 180 away instead of adding it.',
        explanation: `${bearing} − 180 = ${bearing - 180}°.` }); },

  (r) => { const points = [['north', 0], ['north-east', 45], ['east', 90], ['south-east', 135],
      ['south', 180], ['south-west', 225], ['west', 270], ['north-west', 315]];
    const [name, deg] = pick(r, points);
    return blankQ(`What is the bearing of ${name}?`, deg,
      { hint: 'North is zero and the bearings run clockwise.',
        explanation: `${name[0].toUpperCase()}${name.slice(1)} is ${deg}°.` }); },

  (r) => { const offset = pick(r, [-8, -5, -3, 1, 2, 3, 5, 8, 9]), hour = int(r, 0, 15);
    const local = (hour + offset + 24) % 24;
    return blankQ(`It is ${String(hour).padStart(2, '0')}:00 GMT. What is the local time in a place ${offset > 0 ? `${offset} hours ahead` : `${-offset} hours behind`}? Use the 24-hour clock.`,
      `${String(local).padStart(2, '0')}:00`,
      { hint: offset > 0 ? 'Add the hours on.' : 'Take the hours off.',
        /* Not written as a sum: clock arithmetic wraps at 24, so "6 − 8 = 22"
           is true on a clock and false on paper. */
        explanation: `Going ${offset > 0 ? 'forward' : 'back'} ${Math.abs(offset)} hours from ${String(hour).padStart(2, '0')}:00 ${(hour + offset < 0 || hour + offset >= 24) ? 'crosses midnight and ' : ''}gives ${String(local).padStart(2, '0')}:00.` }); },

  (r) => { const rise = int(r, 2, 40), run = rise * int(r, 5, 50);
    return blankQ(`A slope rises ${rise} m over ${run} m. Write the gradient in the form 1 in n, giving n.`,
      run / rise,
      { hint: 'Divide the horizontal distance by the height.',
        explanation: `${run} ÷ ${rise} = ${run / rise}, so the gradient is 1 in ${run / rise}.` }); },

  /* The density and the area are chosen first, so the division comes out. */
  (r) => { const density = int(r, 2, 80) * 25, area = int(r, 2, 40), people = density * area;
    return blankQ(`A district has ${people} people and covers ${area} square kilometres. What is its population density, in people per square kilometre?`,
      density,
      { hint: 'Divide the people by the area.',
        explanation: `${people} ÷ ${area} = ${density} per km².` }); },

  (r) => { const squares = int(r, 2, 30), side = pick(r, [1, 2]);
    return blankQ(`A shape covers ${squares} grid squares, each ${side} km across. What is its area, in square kilometres?`,
      squares * side * side,
      { hint: 'Work out the area of one square first.',
        explanation: `One square is ${side * side} km², so ${squares} × ${side * side} = ${squares * side * side} km².` }); },

  (r) => { const deg = int(r, 1, 89), min = pick(r, [15, 30, 45]);
    return blankQ(`A latitude is ${deg}° ${min}′. How many minutes is that altogether?`, deg * 60 + min,
      { hint: 'A degree is 60 minutes.',
        explanation: `${deg} × 60 + ${min} = ${deg * 60 + min} minutes.` }); }
];

/* ========================== ECONOMICS CALCULATIONS ========================== */
export const econcalcs = [
  (r) => { const price = int(r, 2, 40), qty = int(r, 10, 400);
    return blankQ(`A good sells for $${price} and ${qty} are sold. What is the total revenue, in dollars?`,
      price * qty,
      { hint: 'Revenue is price times quantity.',
        explanation: `${price} × ${qty} = ${price * qty}.` }); },

  (r) => { const dq = pick(r, [10, 20, 25, 40, 50]), dp = pick(r, [5, 10, 20, 25]);
    return blankQ(`Quantity demanded falls ${dq}% when price rises ${dp}%. What is the price elasticity of demand? Ignore the minus sign.`,
      num(dq / dp),
      { hint: 'Divide the percentage change in quantity by the percentage change in price.',
        explanation: `${dq} ÷ ${dp} = ${num(dq / dp)}.` }); },

  (r) => { const c = int(r, 2, 40) * 100, i = int(r, 1, 20) * 100, g = int(r, 1, 20) * 100;
    const x = int(r, 1, 20) * 100, m = int(r, 1, 20) * 100;
    return blankQ(`Consumption is $${c}bn, investment $${i}bn, government spending $${g}bn, exports $${x}bn and imports $${m}bn. What is GDP, in billions?`,
      c + i + g + x - m,
      { hint: 'GDP is C + I + G plus exports less imports.',
        explanation: `${c} + ${i} + ${g} + ${x} − ${m} = ${c + i + g + x - m}.` }); },

  /* The two figures are chosen from a realistic income per person, so the
     answer is a wage rather than $1.6 million each. */
  (r) => { const people = pick(r, [5, 8, 10, 20, 25, 40, 50]), perPerson = int(r, 4, 12) * 5000;
    const gdp = people * perPerson / 1000;
    return blankQ(`GDP is $${gdp}bn and the population is ${people}m. What is GDP per person, in dollars?`,
      perPerson,
      { hint: 'Divide the total by the number of people, keeping the units straight.',
        explanation: `$${gdp}bn ÷ ${people}m = $${perPerson} per person.` }); },

  (r) => { const base = 100, now = base + int(r, 1, 40);
    return blankQ(`A price index was ${base} in the base year and is ${now} now. What is the inflation since the base year, as a percentage?`,
      `${now - base}%`,
      { accept: [String(now - base)],
        hint: 'The index is already out of 100.',
        explanation: `${now} − ${base} = ${now - base}%.` }); },

  (r) => { const workforce = int(r, 2, 40) * 500, rate = pick(r, [2, 4, 5, 10, 20]);
    const jobless = workforce * rate / 100;
    return blankQ(`A workforce of ${workforce} has ${jobless} people unemployed. What is the unemployment rate, as a percentage?`,
      `${rate}%`,
      { accept: [String(rate)],
        hint: 'Divide the unemployed by the whole workforce.',
        explanation: `${jobless} ÷ ${workforce} × 100 = ${rate}%.` }); },

  (r) => { const mpc = pick(r, [0.5, 0.75, 0.8, 0.9]);
    return blankQ(`The marginal propensity to consume is ${mpc}. What is the multiplier?`,
      num(1 / (1 - mpc)),
      { hint: 'The multiplier is one divided by one minus the propensity to consume.',
        explanation: `1 ÷ (1 − ${mpc}) = ${num(1 / (1 - mpc))}.` }); },

  (r) => { const old = int(r, 2, 40) * 5, pct = pick(r, [10, 20, 25, 50]);
    return blankQ(`A price rises from $${old} to $${old + old * pct / 100}. What is the percentage increase?`,
      `${pct}%`,
      { accept: [String(pct)],
        hint: 'Divide the rise by the old price.',
        explanation: `${old * pct / 100} ÷ ${old} × 100 = ${pct}%.` }); },

  (r) => { const base = int(r, 2, 40) * 10, now = base * pick(r, [1.1, 1.2, 1.25, 1.5]);
    return blankQ(`A price was $${base} in the base year and is $${num(now)} now. What is the price index now, taking the base year as 100?`,
      num(Math.round(now / base * 100)),
      { hint: 'Divide by the base price and multiply by 100.',
        explanation: `${num(now)} ÷ ${base} × 100 = ${num(Math.round(now / base * 100))}.` }); },

  (r) => { const chosen = int(r, 2, 40) * 10, given = int(r, 2, 40) * 10;
    return blankQ(`${pick(r, PEOPLE)} can earn $${chosen} at one job or $${given} at another, and takes the first. What is the opportunity cost, in dollars?`,
      given,
      { hint: 'The opportunity cost is the best thing given up.',
        explanation: `Taking the first job gives up $${given}.` }); },

  (r) => { const nominal = int(r, 2, 40) * 1000, inflation = pick(r, [2, 5, 10, 25]);
    return blankQ(`A wage of $${nominal} rises with ${inflation}% inflation. What wage keeps the same buying power, in dollars?`,
      nominal + nominal * inflation / 100,
      { hint: 'The wage has to rise by the rate of inflation.',
        explanation: `${inflation}% of ${nominal} is ${nominal * inflation / 100}, giving ${nominal + nominal * inflation / 100}.` }); },

  /* Half the time the two quantities differ, or the answer is always yes and
     the question teaches nothing but the word. */
  (r) => { const price = int(r, 2, 20), supply = int(r, 10, 100);
    const balanced = r() < 0.5, demand = balanced ? supply : supply + int(r, 5, 40);
    return blankQ(`At $${price} the quantity demanded is ${demand} and the quantity supplied is ${supply}. Is the market in equilibrium? Write yes or no.`,
      balanced ? 'yes' : 'no',
      { hint: 'Equilibrium is where the two quantities match.',
        explanation: balanced ? `Both are ${supply}, so the market clears.`
          : `Demand is ${demand} and supply is ${supply}, so there is a shortage of ${demand - supply}.` }); }
];

/* ======================= HEALTH AND FITNESS FIGURES ======================= */
export const healthcalcs = [
  (r) => { const height = pick(r, [1.5, 1.6, 1.7, 1.8, 2]), bmi = int(r, 18, 30);
    const mass = Math.round(bmi * height * height);
    return blankQ(`Body mass index is mass in kilograms divided by height in metres squared. What is the BMI of someone ${mass} kg and ${height} m tall? Round to the nearest whole number.`,
      Math.round(mass / (height * height)),
      { hint: 'Square the height first.',
        explanation: `${height}² = ${num(height * height)}, and ${mass} ÷ ${num(height * height)} is about ${Math.round(mass / (height * height))}.` }); },

  (r) => { const age = int(r, 12, 70);
    return blankQ(`Maximum heart rate is estimated as 220 minus age. What is it for someone aged ${age}, in beats per minute?`,
      220 - age,
      { hint: 'Take the age from 220.',
        explanation: `220 − ${age} = ${220 - age} bpm.` }); },

  (r) => { const age = int(r, 12, 70), pct = pick(r, [50, 60, 70, 80]);
    const max = 220 - age;
    return blankQ(`Someone aged ${age} trains at ${pct}% of their maximum heart rate, estimated as 220 minus age. What is that, in beats per minute? Round to the nearest beat.`,
      Math.round(max * pct / 100),
      { hint: 'Work out the maximum first, then take the percentage.',
        explanation: `220 − ${age} = ${max}, and ${pct}% of ${max} is ${Math.round(max * pct / 100)} bpm.` }); },

  (r) => { const carbs = int(r, 20, 120), protein = int(r, 10, 80), fat = int(r, 5, 50);
    return blankQ(`Carbohydrate and protein give 4 calories a gram and fat gives 9. How many calories are there in ${carbs} g of carbohydrate, ${protein} g of protein and ${fat} g of fat?`,
      carbs * 4 + protein * 4 + fat * 9,
      { hint: 'Work out each one, then add them.',
        explanation: `${carbs * 4} + ${protein * 4} + ${fat * 9} = ${carbs * 4 + protein * 4 + fat * 9} calories.` }); },

  (r) => { const grams = int(r, 10, 200);
    return blankQ(`Protein gives 4 calories a gram. How many calories are there in ${grams} g of protein?`,
      grams * 4,
      { hint: 'Four calories for every gram.',
        explanation: `${grams} × 4 = ${grams * 4} calories.` }); },

  (r) => { const grams = int(r, 10, 100);
    return blankQ(`Fat gives 9 calories a gram. How many calories are there in ${grams} g of fat?`, grams * 9,
      { hint: 'Nine calories for every gram.',
        explanation: `${grams} × 9 = ${grams * 9} calories.` }); },

  (r) => { const deficit = pick(r, [250, 500, 1000]), days = pick(r, [7, 14, 28]);
    return blankQ(`Someone runs a ${deficit} calorie daily deficit for ${days} days. What is the total deficit, in calories?`,
      deficit * days,
      { hint: 'Multiply the daily figure by the days.',
        explanation: `${deficit} × ${days} = ${deficit * days} calories.` }); },

  (r) => { const daily = pick(r, [1800, 2000, 2200, 2500]), meal = int(r, 2, 10) * 50;
    return blankQ(`A meal of ${meal} calories is eaten on a ${daily} calorie day. What percentage of the day’s calories is that? Round to the nearest whole number.`,
      `${Math.round(meal / daily * 100)}%`,
      { accept: [String(Math.round(meal / daily * 100))],
        hint: 'Divide the meal by the daily total.',
        explanation: `${meal} ÷ ${daily} × 100 = ${Math.round(meal / daily * 100)}%.` }); },

  (r) => { const mass = int(r, 30, 100), perKg = pick(r, [30, 35, 40]);
    return blankQ(`A guide suggests ${perKg} ml of water for every kilogram of body mass. How much is that for someone ${mass} kg, in millilitres?`,
      mass * perKg,
      { hint: 'Multiply the mass by the millilitres per kilogram.',
        explanation: `${mass} × ${perKg} = ${mass * perKg} ml.` }); },

  (r) => { const steps = int(r, 2, 20) * 1000, perKm = pick(r, [1250, 1000]);
    return blankQ(`${perKm} steps make a kilometre. How far is ${steps} steps, in kilometres?`,
      num(steps / perKm),
      { hint: 'Divide the steps by the steps in a kilometre.',
        explanation: `${steps} ÷ ${perKm} = ${num(steps / perKm)} km.` }); },

  (r) => { const met = pick(r, [3, 5, 8, 10]), mass = int(r, 40, 100), hours = pick(r, [0.5, 1, 1.5, 2]);
    return blankQ(`Calories burned are about MET × body mass in kilograms × hours. How many calories does a MET of ${met} burn for someone ${mass} kg over ${num(hours)} hour${hours === 1 ? '' : 's'}?`,
      num(met * mass * hours),
      { hint: 'Multiply the three numbers together.',
        explanation: `${met} × ${mass} × ${num(hours)} = ${num(met * mass * hours)} calories.` }); },

  (r) => { const resting = int(r, 45, 75), after = resting + int(r, 30, 90);
    return blankQ(`A resting heart rate is ${resting} bpm and after exercise it is ${after} bpm. What is the rise, in beats per minute?`,
      after - resting,
      { hint: 'Take the resting rate from the rate after exercise.',
        explanation: `${after} − ${resting} = ${after - resting} bpm.` }); }
];

/* ====================== ENGINEERING CALCULATIONS ====================== */
export const engcalcs = [
  (r) => { const area = int(r, 2, 20), stress = int(r, 2, 50);
    return blankQ(`A force of ${stress * area} N acts on an area of ${area} mm². What is the stress, in newtons per square millimetre?`,
      stress,
      { hint: 'Stress is force divided by area.',
        explanation: `${stress * area} ÷ ${area} = ${stress} N/mm².` }); },

  /* The original length and the extension are chosen so the strain comes out
     as a short decimal; a drill answer of 0.008667 is a calculator exercise. */
  (r) => { const original = pick(r, [100, 200, 500, 1000, 2000]), ext = pick(r, [1, 2, 4, 5, 10, 20]);
    return blankQ(`A bar ${original} mm long stretches by ${ext} mm. What is the strain? Give the answer as a decimal.`,
      num(ext / original),
      { hint: 'Strain is extension divided by original length.',
        explanation: `${ext} ÷ ${original} = ${num(ext / original)}.` }); },

  (r) => { const driver = int(r, 10, 40), k = int(r, 2, 5);
    return blankQ(`A driver gear has ${driver} teeth and the driven gear has ${driver * k} teeth. What is the gear ratio? Write it as a number.`,
      k,
      { hint: 'Divide the driven teeth by the driver teeth.',
        explanation: `${driver * k} ÷ ${driver} = ${k}.` }); },

  (r) => { const ratio = int(r, 2, 5), speed = int(r, 2, 40) * 50;
    return blankQ(`A gear train has a ratio of ${ratio}:1 and the input turns at ${speed} rpm. What is the output speed, in rpm?`,
      speed / ratio,
      { hint: 'A ratio above one slows the output down.',
        explanation: `${speed} ÷ ${ratio} = ${speed / ratio} rpm.` }); },

  (r) => { const effort = int(r, 2, 40), ma = int(r, 2, 8);
    return blankQ(`A machine lifts a load of ${effort * ma} N with an effort of ${effort} N. What is the mechanical advantage?`,
      ma,
      { hint: 'Divide the load by the effort.',
        explanation: `${effort * ma} ÷ ${effort} = ${ma}.` }); },

  (r) => { const useful = int(r, 1, 9) * 100, total = useful * pick(r, [2, 4, 5, 10]);
    return blankQ(`A machine takes in ${total} J and usefully delivers ${useful} J. What is its efficiency, as a percentage?`,
      `${useful * 100 / total}%`,
      { accept: [String(useful * 100 / total)],
        hint: 'Useful out over total in, times 100.',
        explanation: `${useful} ÷ ${total} × 100 = ${useful * 100 / total}%.` }); },

  (r) => { const force = int(r, 2, 60), v = int(r, 2, 20);
    return blankQ(`A force of ${force} N moves something at ${v} m/s. What is the power, in watts?`,
      force * v,
      { hint: 'Power is force times velocity.',
        explanation: `${force} × ${v} = ${force * v} W.` }); },

  (r) => { const force = int(r, 2, 60), radius = int(r, 2, 20);
    return blankQ(`A force of ${force} N acts at a radius of ${radius} m. What is the torque, in newton metres?`,
      force * radius,
      { hint: 'Torque is force times radius.',
        explanation: `${force} × ${radius} = ${force * radius} Nm.` }); },

  (r) => { const load = int(r, 2, 40) * 10, pulleys = pick(r, [2, 4, 5]);
    return blankQ(`A pulley system with ${pulleys} supporting ropes lifts a load of ${load} N. What effort is needed, ignoring friction, in newtons?`,
      load / pulleys,
      { hint: 'The ropes share the load.',
        explanation: `${load} ÷ ${pulleys} = ${load / pulleys} N.` }); },

  (r) => { const load = int(r, 2, 40) * 10;
    return blankQ(`A beam carries a load of ${load} N at its centre and rests on two supports. What force does each support carry, in newtons?`,
      load / 2,
      { hint: 'A central load shares equally.',
        explanation: `${load} ÷ 2 = ${load / 2} N.` }); },

  (r) => { const l = int(r, 2, 30), w = int(r, 2, 30);
    return blankQ(`A rectangular plate is ${l} mm by ${w} mm. What is its cross-sectional area, in square millimetres?`,
      l * w,
      { hint: 'Length times width.',
        explanation: `${l} × ${w} = ${l * w} mm².` }); },

  (r) => { const effort = int(r, 2, 20), vr = int(r, 2, 8);
    return blankQ(`An effort moves ${effort * vr} mm while the load moves ${effort} mm. What is the velocity ratio?`,
      vr,
      { hint: 'Divide the effort distance by the load distance.',
        explanation: `${effort * vr} ÷ ${effort} = ${vr}.` }); }
];

/* Every applied drill family, keyed the way the generator table expects. */
export const APPLIED_DRILL_GENERATORS = {
  readingmusic, mapskills, econcalcs, healthcalcs, engcalcs
};
