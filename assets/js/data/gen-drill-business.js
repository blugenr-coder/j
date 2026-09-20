/* Business drills: the eight calculations a course keeps coming back to.

   Finance and accounting were two broad topics with eleven and nine question
   shapes between them. A teacher wanting twenty break-even calculations, or
   twenty gross profit margins, had nowhere to go.

   Every answer here is computed from the numbers that render the question, so
   tools/check-drill.mjs re-evaluates it. Money comes out to the cent and the
   percentages divide cleanly, because a business drill is about the method,
   not about long division.                                                */

import { int, pick, blankQ, money, num, PEOPLE } from './gen-core.js';

/* A business, the thing it sells, and what that thing plausibly costs. The
   price band matters: picking a firm and a good separately gave "a stationery
   supplier sells a loaf", and a flat price range gave "a bicycle for $8". */
const TRADES = [
  ['a bakery', 'a loaf', 3, 8], ['a bike shop', 'a bicycle', 150, 600],
  ['a print works', 'a poster', 5, 25], ['a garden centre', 'a plant', 4, 20],
  ['a bookshop', 'a book', 8, 25], ['a café', 'a coffee', 3, 7],
  ['a tool hire firm', 'a drill hire', 20, 60], ['a sandwich bar', 'a sandwich', 4, 9],
  ['a florist', 'a bouquet', 15, 45], ['a phone repair shop', 'a screen repair', 40, 120],
  ['a stationery supplier', 'a notebook', 2, 8], ['a coffee roastery', 'a bag of beans', 8, 20],
  ['a shoe shop', 'a pair of boots', 40, 120], ['a toy maker', 'a wooden train', 10, 35],
  ['a car wash', 'a wash', 5, 15]
];
const cap = w => `${w[0].toUpperCase()}${w.slice(1)}`;
const trade = r => TRADES[int(r, 0, TRADES.length - 1)];
/* Money that may be negative reads better with the sign outside the symbol. */
const cash = v => (v < 0 ? `−$${Math.abs(v)}` : `$${v}`);

/* ==================== SIMPLE AND COMPOUND INTEREST ==================== */
export const interest = [
  (r) => { const p = int(r, 2, 40) * 500, rate = pick(r, [2, 4, 5, 10]), years = int(r, 2, 8);
    return blankQ(`$${p} is invested at ${rate}% simple interest for ${years} years. How much interest is earned, in dollars?`,
      p * rate * years / 100,
      { hint: 'Work out one year, then multiply by the number of years.',
        explanation: `${rate}% of ${p} is ${p * rate / 100}, and over ${years} years that is ${p * rate * years / 100}.` }); },

  (r) => { const p = int(r, 2, 40) * 500, rate = pick(r, [2, 4, 5, 10]), years = int(r, 2, 8);
    return blankQ(`$${p} is invested at ${rate}% simple interest for ${years} years. What is the total at the end, in dollars?`,
      p + p * rate * years / 100,
      { hint: 'Add the interest to what was put in.',
        explanation: `${p} + ${p * rate * years / 100} = ${p + p * rate * years / 100}.` }); },

  (r) => { const p = int(r, 2, 20) * 1000, rate = pick(r, [5, 10, 20, 25]), years = 2;
    const total = p * Math.pow(1 + rate / 100, years);
    return blankQ(`$${p} is invested at ${rate}% compound interest for ${years} years. What is it worth at the end, in dollars?`,
      money(total),
      { hint: 'The second year earns interest on the first year’s interest too.',
        explanation: `${p} × ${num(1 + rate / 100)}² = ${money(total)}.` }); },

  (r) => { const p = int(r, 2, 20) * 1000, rate = pick(r, [5, 10, 20, 25]);
    const after = p * (1 + rate / 100);
    return blankQ(`$${p} grows by ${rate}% in a year. How much is it worth after one year, in dollars?`,
      money(after),
      { hint: 'Work out the growth, then add it on.',
        explanation: `${rate}% of ${p} is ${p * rate / 100}, giving ${money(after)}.` }); },

  (r) => { const p = int(r, 2, 40) * 500, rate = pick(r, [2, 4, 5, 10]);
    return blankQ(`A loan of $${p} charges ${rate}% simple interest a year. How much interest is owed after one year, in dollars?`,
      p * rate / 100,
      { hint: 'One year of interest is the rate applied once.',
        explanation: `${rate}% of ${p} = ${p * rate / 100}.` }); },

  (r) => { const interestPaid = int(r, 1, 40) * 25, rate = pick(r, [2, 4, 5, 10]);
    const p = interestPaid * 100 / rate;
    return blankQ(`One year of simple interest at ${rate}% came to $${interestPaid}. How much was invested, in dollars?`,
      p,
      { hint: 'Work backwards from the percentage.',
        explanation: `${interestPaid} ÷ ${num(rate / 100)} = ${p}.` }); },

  (r) => { const p = int(r, 2, 20) * 1000, rate = pick(r, [10, 20, 25, 50]);
    const lost = p * rate / 100;
    return blankQ(`An asset worth $${p} falls in value by ${rate}%. What is it worth now, in dollars?`,
      p - lost,
      { hint: 'Work out the fall, then take it off.',
        explanation: `${rate}% of ${p} is ${lost}, leaving ${p - lost}.` }); },

  (r) => { const p = int(r, 2, 20) * 1000, rate = pick(r, [5, 10, 20]), years = 3;
    const total = p * Math.pow(1 + rate / 100, years);
    return blankQ(`$${p} is invested at ${rate}% compound interest for ${years} years. What is it worth at the end, in dollars?`,
      money(total),
      { hint: 'Multiply by the growth factor once for each year.',
        explanation: `${p} × ${num(1 + rate / 100)}³ = ${money(total)}.` }); },

  (r) => { const p = int(r, 2, 20) * 1000, rate = pick(r, [5, 10, 20, 25]);
    const simple = p * rate * 2 / 100, compound = p * Math.pow(1 + rate / 100, 2) - p;
    return blankQ(`Over two years, how much more does $${p} earn at ${rate}% compound interest than at ${rate}% simple interest? Give the answer in dollars.`,
      money(compound - simple),
      { hint: 'Work out both totals and take one from the other.',
        explanation: `Compound earns ${money(compound)} and simple earns ${money(simple)}, a difference of ${money(compound - simple)}.` }); },

  (r) => { const monthly = int(r, 2, 40) * 25, months = int(r, 3, 24);
    return blankQ(`${pick(r, PEOPLE)} saves $${monthly} a month for ${months} months with no interest. How much is saved, in dollars?`,
      monthly * months,
      { hint: 'Multiply the monthly amount by the number of months.',
        explanation: `${monthly} × ${months} = ${monthly * months}.` }); }
];

/* ========================== BREAK-EVEN ANALYSIS ========================== */
export const breakeven = [
  (r) => { const [, good, lo, hi] = trade(r);
    const price = int(r, lo, hi), varCost = int(r, Math.max(1, Math.round(price * 0.3)), Math.round(price * 0.8));
    return blankQ(`${cap(good)} sells for $${price} and costs $${varCost} to make. What is the contribution per unit, in dollars?`,
      price - varCost,
      { hint: 'Contribution is the selling price less the variable cost.',
        explanation: `${price} − ${varCost} = ${price - varCost}.` }); },

  (r) => { const contribution = int(r, 2, 20), units = int(r, 10, 400);
    const fixed = contribution * units;
    return blankQ(`Fixed costs are $${fixed} and each unit contributes $${contribution}. How many units must be sold to break even?`,
      units,
      { hint: 'Divide the fixed costs by the contribution per unit.',
        explanation: `${fixed} ÷ ${contribution} = ${units} units.` }); },

  (r) => { const [firm, good, lo, hi] = trade(r);
    const price = int(r, lo, hi), varCost = int(r, Math.max(1, Math.round(price * 0.3)), Math.round(price * 0.8));
    const units = int(r, 10, 300), fixed = (price - varCost) * units;
    return blankQ(`${cap(firm)} has fixed costs of $${fixed}. It sells ${good} for $${price} which costs $${varCost} to make. How many must it sell to break even?`,
      units,
      { hint: 'Find the contribution per unit first.',
        explanation: `Contribution is ${price} − ${varCost} = ${price - varCost}, and ${fixed} ÷ ${price - varCost} = ${units}.` }); },

  (r) => { const price = int(r, 5, 40), varCost = int(r, 1, price - 2), units = int(r, 10, 300);
    const fixed = (price - varCost) * units;
    return blankQ(`Fixed costs are $${fixed}, the selling price is $${price} and the variable cost is $${varCost}. What is the revenue at the break-even point, in dollars?`,
      units * price,
      { hint: 'Find the break-even units first, then multiply by the price.',
        explanation: `Break-even is ${units} units, and ${units} × ${price} = ${units * price}.` }); },

  (r) => { const contribution = int(r, 2, 20), beUnits = int(r, 10, 200), actual = beUnits + int(r, 5, 200);
    return blankQ(`A firm breaks even at ${beUnits} units and expects to sell ${actual}. What is its margin of safety, in units?`,
      actual - beUnits,
      { hint: 'The margin of safety is how far sales can fall before a loss.',
        explanation: `${actual} − ${beUnits} = ${actual - beUnits} units.` }); },

  (r) => { const contribution = int(r, 2, 20), units = int(r, 20, 400), fixed = contribution * int(r, 5, 100);
    const profit = contribution * units - fixed;
    return blankQ(`Each unit contributes $${contribution}, fixed costs are $${fixed}, and ${units} units are sold. What is the profit, in dollars?`,
      profit,
      { hint: 'Total contribution less fixed costs.',
        explanation: `${contribution} × ${units} = ${contribution * units}, less ${fixed} leaves ${profit}.` }); },

  (r) => { const price = int(r, 5, 40), units = int(r, 20, 400);
    return blankQ(`A firm sells ${units} units at $${price} each. What is its total revenue, in dollars?`,
      price * units,
      { hint: 'Revenue is price times quantity.',
        explanation: `${price} × ${units} = ${price * units}.` }); },

  (r) => { const fixed = int(r, 4, 60) * 100, varCost = int(r, 2, 20), units = int(r, 20, 300);
    return blankQ(`Fixed costs are $${fixed} and each unit costs $${varCost} to make. What is the total cost of making ${units} units, in dollars?`,
      fixed + varCost * units,
      { hint: 'Fixed costs plus the variable cost of every unit.',
        explanation: `${fixed} + ${varCost} × ${units} = ${fixed + varCost * units}.` }); },

  (r) => { const contribution = int(r, 2, 20), units = int(r, 10, 200);
    /* The target is a whole number of units' worth, so the answer is too. */
    const target = contribution * int(r, 10, 200), fixed = contribution * units;
    return blankQ(`Fixed costs are $${fixed} and each unit contributes $${contribution}. How many units must be sold to make a profit of $${target}?`,
      (fixed + target) / contribution,
      { hint: 'Treat the target profit as an extra fixed cost.',
        explanation: `(${fixed} + ${target}) ÷ ${contribution} = ${num((fixed + target) / contribution)} units.` }); },

  (r) => { const price = int(r, 10, 50), varCost = int(r, 2, price - 5);
    return blankQ(`The selling price is $${price} and the variable cost is $${varCost}. What percentage of the price is contribution?`,
      `${num(Math.round((price - varCost) / price * 1000) / 10)}%`,
      { accept: [String(num(Math.round((price - varCost) / price * 1000) / 10))],
        hint: 'Divide the contribution by the price.',
        explanation: `(${price} − ${varCost}) ÷ ${price} × 100 = ${num(Math.round((price - varCost) / price * 1000) / 10)}%.` }); }
];

/* =========================== PROFIT AND LOSS =========================== */
export const profitloss = [
  (r) => { const revenue = int(r, 10, 200) * 100, costs = int(r, 5, 150) * 100;
    return blankQ(`Revenue is $${revenue} and total costs are $${costs}. What is the profit, in dollars? A loss is a negative number.`,
      revenue - costs,
      { hint: 'Take the costs from the revenue.',
        explanation: `${revenue} − ${costs} = ${revenue - costs}.` }); },

  (r) => { const revenue = int(r, 20, 200) * 100, cogs = int(r, 5, 15) * 100;
    return blankQ(`Revenue is $${revenue} and the cost of sales is $${cogs}. What is the gross profit, in dollars?`,
      revenue - cogs,
      { hint: 'Gross profit is revenue less the cost of what was sold.',
        explanation: `${revenue} − ${cogs} = ${revenue - cogs}.` }); },

  (r) => { const gross = int(r, 20, 200) * 100, expenses = int(r, 5, 15) * 100;
    return blankQ(`Gross profit is $${gross} and expenses are $${expenses}. What is the net profit, in dollars?`,
      gross - expenses,
      { hint: 'Net profit is gross profit less the running costs.',
        explanation: `${gross} − ${expenses} = ${gross - expenses}.` }); },

  (r) => { const revenue = int(r, 2, 40) * 500, pct = pick(r, [10, 20, 25, 40, 50]);
    const gross = revenue * pct / 100;
    return blankQ(`Revenue is $${revenue} and gross profit is $${gross}. What is the gross profit margin, as a percentage?`,
      `${pct}%`,
      { accept: [String(pct)],
        hint: 'Divide the gross profit by the revenue.',
        explanation: `${gross} ÷ ${revenue} × 100 = ${pct}%.` }); },

  (r) => { const revenue = int(r, 2, 40) * 500, pct = pick(r, [5, 10, 20, 25]);
    const net = revenue * pct / 100;
    return blankQ(`Revenue is $${revenue} and net profit is $${net}. What is the net profit margin, as a percentage?`,
      `${pct}%`,
      { accept: [String(pct)],
        hint: 'Divide the net profit by the revenue.',
        explanation: `${net} ÷ ${revenue} × 100 = ${pct}%.` }); },

  (r) => { const cost = int(r, 2, 60) * 10, pct = pick(r, [10, 20, 25, 50, 100]);
    return blankQ(`An item costs $${cost} and is marked up by ${pct}%. What is the selling price, in dollars?`,
      cost + cost * pct / 100,
      { hint: 'Work out the mark-up, then add it to the cost.',
        explanation: `${pct}% of ${cost} is ${cost * pct / 100}, giving ${cost + cost * pct / 100}.` }); },

  (r) => { const cost = int(r, 2, 60) * 10, pct = pick(r, [10, 20, 25, 50, 100]);
    return blankQ(`An item costs $${cost} to buy and sells for $${cost + cost * pct / 100}. What is the mark-up, as a percentage of cost?`,
      `${pct}%`,
      { accept: [String(pct)],
        hint: 'Divide the profit by the cost, not by the price.',
        explanation: `${cost * pct / 100} ÷ ${cost} × 100 = ${pct}%.` }); },

  (r) => { const price = int(r, 5, 60), units = int(r, 20, 400), cost = int(r, 1, 4) * 100;
    return blankQ(`${cap(trade(r)[0])} sells ${units} items at $${price} each and has total costs of $${cost}. What is its profit, in dollars?`,
      price * units - cost,
      { hint: 'Revenue first, then take the costs off.',
        explanation: `${price} × ${units} = ${price * units}, less ${cost} leaves ${price * units - cost}.` }); },

  (r) => { const last = int(r, 4, 40) * 1000, pct = pick(r, [10, 20, 25, 50]);
    return blankQ(`Revenue was $${last} last year and rose by ${pct}%. What is it this year, in dollars?`,
      last + last * pct / 100,
      { hint: 'Work out the rise, then add it.',
        explanation: `${pct}% of ${last} is ${last * pct / 100}, giving ${last + last * pct / 100}.` }); },

  (r) => { const revenue = int(r, 4, 40) * 1000, pct = pick(r, [10, 20, 25, 50]);
    const gross = revenue * pct / 100;
    return blankQ(`A firm has a gross profit margin of ${pct}% on revenue of $${revenue}. What is its gross profit, in dollars?`,
      gross,
      { hint: 'Apply the margin to the revenue.',
        explanation: `${pct}% of ${revenue} = ${gross}.` }); }
];

/* ========================== FINANCIAL RATIOS ========================== */
export const ratios = [
  (r) => { const current = int(r, 2, 6), liabilities = int(r, 2, 40) * 500;
    return blankQ(`${cap(trade(r)[0])} has current assets of $${current * liabilities} and current liabilities of $${liabilities}. What is the current ratio? Write it as a number.`,
      current,
      { hint: 'Divide the assets by the liabilities.',
        explanation: `${current * liabilities} ÷ ${liabilities} = ${current}.` }); },

  (r) => { const stock = int(r, 2, 20) * 100, liabilities = int(r, 2, 20) * 100, k = int(r, 2, 5);
    const assets = liabilities * k + stock;
    return blankQ(`Current assets are $${assets}, of which $${stock} is stock. Current liabilities are $${liabilities}. What is the acid test ratio? Write it as a number.`,
      k,
      { hint: 'The acid test leaves stock out of the assets.',
        explanation: `(${assets} − ${stock}) ÷ ${liabilities} = ${k}.` }); },

  (r) => { const profit = int(r, 2, 40) * 500, capital = profit * pick(r, [4, 5, 10, 20]);
    return blankQ(`${cap(trade(r)[0])} has an operating profit of $${profit} on capital employed of $${capital}. What is the return on capital employed, as a percentage?`,
      `${num(profit / capital * 100)}%`,
      { accept: [String(num(profit / capital * 100))],
        hint: 'Divide the profit by the capital and turn it into a percentage.',
        explanation: `${profit} ÷ ${capital} × 100 = ${num(profit / capital * 100)}%.` }); },

  (r) => { const cogs = int(r, 4, 40) * 1000, stock = cogs / pick(r, [4, 5, 8, 10]);
    return blankQ(`${cap(trade(r)[0])} has a cost of sales of $${cogs} and average stock of $${stock}. How many times a year does the stock turn over?`,
      cogs / stock,
      { hint: 'Divide the cost of sales by the average stock.',
        explanation: `${cogs} ÷ ${stock} = ${cogs / stock} times.` }); },

  (r) => { const debtors = int(r, 2, 30) * 1000, revenue = debtors * pick(r, [4, 5, 10, 12]);
    const days = Math.round(debtors / revenue * 365);
    return blankQ(`${cap(trade(r)[0])} has debtors of $${debtors} and annual revenue of $${revenue}. How many days on average do customers take to pay? Round to the nearest day.`,
      days,
      { hint: 'Divide debtors by revenue, then multiply by 365.',
        explanation: `${debtors} ÷ ${revenue} of a year is about ${days} days.` }); },

  (r) => { const debt = int(r, 2, 40) * 1000, equity = debt / pick(r, [1, 2, 4, 5]);
    return blankQ(`${cap(trade(r)[0])} has long-term debt of $${debt} and equity of $${equity}. What is the gearing ratio, as a percentage of debt to equity?`,
      `${num(debt / equity * 100)}%`,
      { accept: [String(num(debt / equity * 100))],
        hint: 'Divide the debt by the equity.',
        explanation: `${debt} ÷ ${equity} × 100 = ${num(debt / equity * 100)}%.` }); },

  (r) => { const assets = int(r, 4, 40) * 1000, liabilities = int(r, 1, 3) * 1000;
    return blankQ(`${cap(trade(r)[0])} has total assets of $${assets} and total liabilities of $${liabilities}. What is the capital, in dollars?`,
      assets - liabilities,
      { hint: 'Capital is what is left after the debts.',
        explanation: `${assets} − ${liabilities} = ${assets - liabilities}.` }); },

  (r) => { const revenue = int(r, 4, 40) * 1000, pct = pick(r, [10, 20, 25, 50]);
    return blankQ(`A firm keeps ${pct} cents of every dollar of revenue as profit. What is its profit on revenue of $${revenue}, in dollars?`,
      revenue * pct / 100,
      { hint: 'Cents in the dollar are a percentage in disguise.',
        explanation: `${pct}% of ${revenue} = ${revenue * pct / 100}.` }); },

  (r) => { const ratio = pick(r, [1, 2, 3]), liabilities = int(r, 2, 30) * 500;
    return blankQ(`A firm wants a current ratio of ${ratio}. Its current liabilities are $${liabilities}. What current assets does it need, in dollars?`,
      ratio * liabilities,
      { hint: 'Multiply the liabilities by the ratio you want.',
        explanation: `${ratio} × ${liabilities} = ${ratio * liabilities}.` }); },

  (r) => { const profit = int(r, 2, 40) * 500, shares = pick(r, [1000, 2000, 5000, 10000]);
    return blankQ(`${cap(trade(r)[0])} made a profit after tax of $${profit} and has ${shares} shares. What are the earnings per share, in dollars?`,
      money(profit / shares),
      { hint: 'Divide the profit by the number of shares.',
        explanation: `${profit} ÷ ${shares} = ${money(profit / shares)}.` }); }
];

/* ====================== DEPRECIATION AND ASSETS ====================== */
export const depreciation = [
  (r) => { const cost = int(r, 4, 40) * 1000, life = pick(r, [2, 4, 5, 8, 10]);
    return blankQ(`${cap(trade(r)[0])} buys an asset for $${cost} and writes it off in equal amounts over ${life} years with no residual value. What is the annual depreciation, in dollars?`,
      cost / life,
      { hint: 'Spread the cost evenly over the years.',
        explanation: `${cost} ÷ ${life} = ${cost / life} a year.` }); },

  (r) => { const cost = int(r, 4, 40) * 1000, life = pick(r, [2, 4, 5, 8, 10]), residual = int(r, 1, 5) * 100;
    return blankQ(`An asset costs $${cost}, will be worth $${residual} after ${life} years, and is depreciated in equal amounts. What is the annual charge, in dollars?`,
      num((cost - residual) / life),
      { hint: 'Depreciate only the part of the cost that is used up.',
        explanation: `(${cost} − ${residual}) ÷ ${life} = ${num((cost - residual) / life)}.` }); },

  (r) => { const cost = int(r, 4, 40) * 1000, life = pick(r, [4, 5, 8, 10]), years = int(r, 1, 3);
    return blankQ(`${cap(trade(r)[0])} buys an asset for $${cost} and writes it off evenly over ${life} years. What is its book value after ${years} year${years === 1 ? '' : 's'}, in dollars?`,
      cost - (cost / life) * years,
      { hint: 'Take off one year of depreciation for each year gone.',
        explanation: `${cost / life} a year × ${years} = ${(cost / life) * years}, leaving ${cost - (cost / life) * years}.` }); },

  (r) => { const cost = int(r, 2, 20) * 1000, rate = pick(r, [10, 20, 25, 50]);
    return blankQ(`${cap(trade(r)[0])} buys an asset for $${cost}. It loses ${rate}% of its value each year. What is it worth after one year, in dollars?`,
      cost - cost * rate / 100,
      { hint: 'Take the percentage off the starting value.',
        explanation: `${rate}% of ${cost} is ${cost * rate / 100}, leaving ${cost - cost * rate / 100}.` }); },

  (r) => { const cost = int(r, 2, 20) * 1000, rate = pick(r, [10, 20, 25, 50]);
    const after = cost * Math.pow(1 - rate / 100, 2);
    return blankQ(`An asset costs $${cost} and loses ${rate}% of its remaining value each year. What is it worth after two years, in dollars?`,
      money(after),
      { hint: 'The second year’s loss is taken from what is left, not from the original cost.',
        explanation: `${cost} × ${num(1 - rate / 100)}² = ${money(after)}.` }); },

  (r) => { const cost = int(r, 4, 40) * 1000, life = pick(r, [4, 5, 8, 10]);
    return blankQ(`An asset costs $${cost} and is written off evenly over ${life} years. What percentage of the cost is written off each year?`,
      `${num(100 / life)}%`,
      { accept: [String(num(100 / life))],
        hint: 'One year out of the whole life.',
        explanation: `100 ÷ ${life} = ${num(100 / life)}%.` }); },

  (r) => { const cost = int(r, 4, 40) * 1000, life = pick(r, [4, 5, 8, 10]);
    return blankQ(`An asset costs $${cost} and is written off evenly over ${life} years. What is its book value at the end, in dollars?`,
      0,
      { hint: 'With no residual value, the whole cost is written off.',
        explanation: `After ${life} years the whole ${cost} has been depreciated.` }); },

  (r) => { const cost = int(r, 4, 40) * 1000, sold = int(r, 1, 3) * 1000, life = pick(r, [4, 5]), years = 2;
    const book = cost - (cost / life) * years;
    return blankQ(`An asset costing $${cost} is depreciated evenly over ${life} years and sold after ${years} years for $${sold}. What is the profit or loss on sale, in dollars? A loss is a negative number.`,
      sold - book,
      { hint: 'Compare the sale price with the book value.',
        explanation: `Book value is ${book}, so the sale gives ${sold - book}.` }); },

  (r) => { const annual = int(r, 2, 40) * 100, years = int(r, 2, 6);
    return blankQ(`Annual depreciation is $${annual}. What is the accumulated depreciation after ${years} years, in dollars?`,
      annual * years,
      { hint: 'Add up one year at a time.',
        explanation: `${annual} × ${years} = ${annual * years}.` }); },

  (r) => { const cost = int(r, 4, 40) * 1000, accumulated = int(r, 1, 3) * 1000;
    return blankQ(`${cap(trade(r)[0])} has an asset that cost $${cost}, with accumulated depreciation of $${accumulated}. What is its book value, in dollars?`,
      cost - accumulated,
      { hint: 'Take the depreciation so far off the cost.',
        explanation: `${cost} − ${accumulated} = ${cost - accumulated}.` }); }
];

/* ======================= TAX, WAGES AND CASH FLOW ======================= */
export const payroll = [
  (r) => { const hours = int(r, 10, 40), rate = int(r, 10, 30);
    return blankQ(`${pick(r, PEOPLE)} works ${hours} hours at $${rate} an hour. What is the gross pay, in dollars?`,
      hours * rate,
      { hint: 'Hours times the hourly rate.',
        explanation: `${hours} × ${rate} = ${hours * rate}.` }); },

  (r) => { const hours = int(r, 35, 40), rate = int(r, 10, 30), overtime = int(r, 2, 10);
    return blankQ(`${pick(r, PEOPLE)} works ${hours} hours at $${rate} an hour, plus ${overtime} hours at time and a half. What is the gross pay, in dollars?`,
      hours * rate + overtime * rate * 1.5,
      { hint: 'Time and a half is the hourly rate multiplied by 1.5.',
        explanation: `${hours * rate} + ${overtime} × ${num(rate * 1.5)} = ${hours * rate + overtime * rate * 1.5}.` }); },

  (r) => { const gross = int(r, 4, 60) * 100, rate = pick(r, [10, 20, 25]);
    return blankQ(`Gross pay is $${gross} and ${rate}% is deducted in tax. What is the take-home pay, in dollars?`,
      gross - gross * rate / 100,
      { hint: 'Work out the tax, then take it off.',
        explanation: `${rate}% of ${gross} is ${gross * rate / 100}, leaving ${gross - gross * rate / 100}.` }); },

  (r) => { const annual = int(r, 20, 60) * 1000;
    return blankQ(`An annual salary is $${annual}. What is the monthly pay before deductions, in dollars?`,
      money(annual / 12),
      { hint: 'Twelve months in a year.',
        explanation: `${annual} ÷ 12 = ${money(annual / 12)}.` }); },

  (r) => { const price = int(r, 2, 60) * 10, rate = pick(r, [5, 10, 20]);
    return blankQ(`An item costs $${price} before tax. Tax is charged at ${rate}%. What is the price including tax, in dollars?`,
      price + price * rate / 100,
      { hint: 'Add the tax to the price before tax.',
        explanation: `${rate}% of ${price} is ${price * rate / 100}, giving ${price + price * rate / 100}.` }); },

  (r) => { const net = int(r, 2, 60) * 10, rate = pick(r, [10, 20, 25]);
    const gross = net * (100 + rate) / 100;
    return blankQ(`A price including ${rate}% tax is $${gross}. What was the price before tax, in dollars?`,
      net,
      { hint: `The price you see is ${100 + rate}% of the price before tax.`,
        explanation: `${gross} ÷ ${num((100 + rate) / 100)} = ${net}.` }); },

  (r) => { const inflow = int(r, 10, 200) * 100, outflow = int(r, 10, 200) * 100;
    return blankQ(`Cash in for the month is $${inflow} and cash out is $${outflow}. What is the net cash flow, in dollars? A negative answer means cash went out.`,
      inflow - outflow,
      { hint: 'Take what went out from what came in.',
        explanation: `${inflow} − ${outflow} = ${inflow - outflow}.` }); },

  (r) => { const opening = int(r, 10, 100) * 100, net = int(r, -50, 80) * 100;
    return blankQ(`The opening cash balance is $${opening} and the net cash flow for the month is ${cash(net)}. What is the closing balance, in dollars?`,
      opening + net,
      { hint: 'Add the month’s net flow to what was there at the start. A negative flow takes money away.',
        explanation: `${opening} ${net < 0 ? '−' : '+'} ${Math.abs(net)} = ${opening + net}.` }); },

  (r) => { const weekly = int(r, 2, 12) * 50, weeks = int(r, 4, 52);
    return blankQ(`A wage of $${weekly} is paid every week for ${weeks} weeks. What is the total, in dollars?`,
      weekly * weeks,
      { hint: 'Multiply the weekly wage by the number of weeks.',
        explanation: `${weekly} × ${weeks} = ${weekly * weeks}.` }); },

  (r) => { const sales = int(r, 4, 60) * 500, rate = pick(r, [2, 5, 10]);
    return blankQ(`A salesperson earns ${rate}% commission on sales of $${sales}. What is the commission, in dollars?`,
      sales * rate / 100,
      { hint: 'Apply the percentage to the sales.',
        explanation: `${rate}% of ${sales} = ${sales * rate / 100}.` }); }
];

/* Every business drill family, keyed the way the generator table expects. */
export const BUSINESS_DRILL_GENERATORS = {
  interest, breakeven, profitloss, ratios, depreciation, payroll
};
