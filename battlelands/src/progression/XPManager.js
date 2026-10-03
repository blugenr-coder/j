/* XP, levels and match rewards. The curve is gentle at first (a new player
   levels after a match or two) and flattens into a steady ~4 matches/level. */

export const xpForLevel = level => 250 + (level - 1) * 125;

export function addXP(save, amount) {
  save.xp += amount;
  let gained = 0;
  while (save.xp >= xpForLevel(save.level)) {
    save.xp -= xpForLevel(save.level);
    save.level++;
    gained++;
  }
  return gained;
}

/* Breakdown shown on the results screen, line by line. */
export function matchRewards(r) {
  const placeXP = Math.max(0, (r.total + 1 - r.place) * 6);
  const xp = {
    match: 60,
    survival: Math.round(r.survival * 0.6),
    elimination: r.kills * 40,
    placement: placeXP + (r.won ? 150 : 0),
  };
  const coins = 25 + r.kills * 12 + (r.place <= 10 ? 20 : 0) + (r.place <= 3 ? 40 : 0) + (r.won ? 120 : 0);
  return { xp, totalXP: xp.match + xp.survival + xp.elimination + xp.placement, coins };
}

export function recordStats(save, r) {
  const s = save.stats;
  s.matches++;
  s.kills += r.kills;
  s.damage += r.damage;
  s.survival += Math.round(r.survival);
  if (r.won) s.wins++;
  if (r.place <= 10) s.top10++;
  if (r.place <= 3) s.top3++;
  if (!s.bestPlace || r.place < s.bestPlace) s.bestPlace = r.place;
}
