/* Shorts Studio — the idea catalogue.
   Every idea is a real combination of an archetype (a distinct animation)
   and its parameters. Ids are stable so "already recorded" survives reloads. */
(function () {
  const PLACES = (WI.PLACES = [
    { name: 'your city', env: 'city' },
    { name: 'New York', env: 'city', lm: 'empire' },
    { name: 'Tokyo', env: 'city', lm: 'tokyo' },
    { name: 'Paris', env: 'city', lm: 'eiffel' },
    { name: 'London', env: 'city', lm: 'bigben' },
    { name: 'Dubai', env: 'desert', lm: 'burj' },
    { name: 'Toronto', env: 'city', lm: 'cn' },
    { name: 'Cairo', env: 'desert', lm: 'pyramids' },
    { name: 'Chicago', env: 'city' },
    { name: 'Los Angeles', env: 'city' },
    { name: 'Hong Kong', env: 'city' },
    { name: 'Sydney', env: 'city' },
    { name: 'Seoul', env: 'city' },
    { name: 'Mexico City', env: 'city' },
    { name: 'Mumbai', env: 'city' },
    { name: 'Las Vegas', env: 'desert' },
    { name: 'Rio de Janeiro', env: 'city' },
    { name: 'Singapore', env: 'city' },
    { name: 'Berlin', env: 'city' },
    { name: 'your town', env: 'town' },
    { name: 'a small village', env: 'town' },
    { name: 'Antarctica', env: 'arctic' },
    { name: 'Alaska', env: 'arctic' },
  ]);
  // Global events don't happen "in" a city; these only change the backdrop.
  const SETTINGS = ['your city', 'New York', 'Tokyo', 'Paris', 'Dubai', 'your town'].map((n) => PLACES.find((p) => p.name === n));
  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  WI.ARCHES = {
    impact: { label: 'Impacts', tags: ['asteroid', 'space', 'disaster'] },
    giant: { label: 'Giants', tags: ['giant', 'monster', 'kaiju'] },
    zombie: { label: 'Zombies', tags: ['zombie', 'zombieapocalypse', 'simulation'] },
    battle: { label: 'Battles', tags: ['whowins', 'battle', 'simulation'] },
    gravity: { label: 'Gravity', tags: ['gravity', 'physics', 'science'] },
    spin: { label: 'Earth spin', tags: ['earth', 'science', 'physics'] },
    sun: { label: 'The Sun', tags: ['sun', 'space', 'science'] },
    blackhole: { label: 'Black holes', tags: ['blackhole', 'space', 'physics'] },
    vanish: { label: 'Alone', tags: ['lastmanonearth', 'alone', 'mystery'] },
    flood: { label: 'Floods', tags: ['flood', 'disaster', 'lava'] },
    clones: { label: 'Clones', tags: ['clones', 'math', 'exponential'] },
  };

  const ideas = [];
  const add = (arche, key, title, params, place, o = {}) =>
    ideas.push({ id: `${arche}-${key}-${slug(place.name)}`, arche, title, params, place, setting: o.setting || null, pre: o.pre || 'WHAT IF' });

  for (const [k, I] of Object.entries(WI.IMPACTORS))
    for (const pl of PLACES) add('impact', k, `${I.name} hit ${pl.name}?`, { obj: k }, pl);

  for (const [k, Z] of Object.entries(WI.GIANT_SIZES))
    for (const mood of ['angry', 'confused', 'friendly'])
      for (const pl of PLACES) {
        const t = mood === 'angry' ? `an angry ${Z.label} stickman attacked ${pl.name}?` : mood === 'confused' ? `a ${Z.label} stickman got lost in ${pl.name}?` : `a friendly ${Z.label} stickman visited ${pl.name}?`;
        add('giant', `${k}-${mood}`, t, { size: k, mood }, pl);
      }

  for (const n of [30, 50, 100, 150, 200])
    for (const [k, Z] of Object.entries(WI.ZTYPES))
      for (const pl of PLACES) add('zombie', `${k}-${n}`, `1 ${Z.name} got loose among ${n} people in ${pl.name}?`, { z: k, n }, pl);

  const units = Object.keys(WI.UNITS).filter((u) => u !== 'giant');
  const arenas = [PLACES.find((p) => p.env === 'town'), PLACES.find((p) => p.env === 'desert' && !p.lm), PLACES.find((p) => p.env === 'arctic')];
  const vs = (a, na, b, nb) => `${WI.fmt(na)} ${na === 1 ? WI.UNITS[a].one : WI.UNITS[a].many} vs ${WI.fmt(nb)} ${nb === 1 ? WI.UNITS[b].one : WI.UNITS[b].many}`;
  const combos = [[10, 10], [50, 50], [100, 100], [20, 60], [60, 20], [100, 30], [30, 100], [1, 15]];
  for (let i = 0; i < units.length; i++)
    for (let j = i + 1; j < units.length; j++)
      for (const [na, nb] of combos) {
        const a = units[i], b = units[j];
        const arena = arenas[WI.hash(a + b + na) % arenas.length];
        add('battle', `${a}${na}-${b}${nb}`, vs(a, na, b, nb), { a, b, na, nb }, arena, { pre: 'WHO WINS?' });
      }
  for (const u of units)
    for (const [ng, nu] of [[1, 50], [1, 100], [1, 200], [3, 150], [5, 200]]) {
      const arena = arenas[WI.hash(u + ng + nu) % arenas.length];
      add('battle', `giant${ng}-${u}${nu}`, vs('giant', ng, u, nu), { a: 'giant', b: u, na: ng, nb: nu }, arena, { pre: 'WHO WINS?' });
    }

  const gmodes = [
    ...[5, 10, 30, 60].map((secs) => ({ key: `off${secs}`, kind: 'off', secs, label: secs === 60 ? '1 minute' : `${secs} seconds` })),
    ...[5, 10, 30].map((secs) => ({ key: `rev${secs}`, kind: 'reverse', secs, label: `${secs} seconds` })),
    { key: 'x2', kind: 'heavy', mult: 2 },
    { key: 'x10', kind: 'heavy', mult: 10 },
  ];
  for (const g of gmodes)
    for (const pl of PLACES) {
      const t = g.kind === 'off' ? `gravity switched off for ${g.label} in ${pl.name}?` : g.kind === 'reverse' ? `gravity reversed for ${g.label} in ${pl.name}?` : g.mult === 2 ? `gravity doubled in ${pl.name}?` : `gravity got 10x stronger in ${pl.name}?`;
      add('gravity', g.key, t, g, pl);
    }

  const spins = [
    { key: 'stop', kind: 'stop', t: 'Earth suddenly stopped spinning?' },
    { key: 'reverse', kind: 'reverse', t: 'Earth started spinning backwards?' },
    { key: 'x2', kind: 'fast', x: 2, t: 'Earth spun twice as fast?' },
    { key: 'x17', kind: 'fast', x: 17, t: 'Earth spun 17 times faster?' },
  ];
  for (const sp of spins) for (const pl of SETTINGS) add('spin', sp.key, sp.t, sp, pl, { setting: pl.name });

  const suns = [
    { kind: 'vanish', t: 'the Sun disappeared?' },
    { kind: 'double', t: 'the Sun doubled in size?' },
    { kind: 'supernova', t: 'the Sun went supernova?' },
    { kind: 'blackhole', t: 'the Sun turned into a black hole?' },
  ];
  for (const su of suns) for (const pl of SETTINGS) add('sun', su.kind, su.t, su, pl, { setting: pl.name });

  const holes = { car: 'a tiny black hole', moon: 'a Moon-mass black hole', earth: 'a marble-sized black hole' };
  for (const [k, n] of Object.entries(holes)) for (const pl of PLACES) add('blackhole', k, `${n} appeared in ${pl.name}?`, { kind: k }, pl);

  for (const pl of PLACES) {
    add('vanish', 'you', `everyone in ${pl.name} disappeared except you?`, { kind: 'you' }, pl);
    add('vanish', 'friend', `everyone in ${pl.name} vanished except you and your best friend?`, { kind: 'friend' }, pl);
  }
  for (const pl of SETTINGS) {
    add('vanish', 'all', 'every human on Earth vanished?', { kind: 'all' }, pl, { setting: pl.name });
    add('vanish', 'freeze', 'time stopped for everyone but you?', { kind: 'freeze' }, pl, { setting: pl.name });
  }

  const floods = [['water', '10'], ['water', '100'], ['water', '1000'], ['lava', '10'], ['lava', '100'], ['slime', '10'], ['slime', '100']];
  for (const [liq, lv] of floods)
    for (const pl of PLACES) {
      if (pl.env === 'arctic') continue;
      const L = WI.LEVELS[lv].label;
      const t = liq === 'water' ? `the sea rose ${L} in ${pl.name}?` : liq === 'lava' ? `${pl.name} flooded with ${L} of lava?` : `toxic slime flooded ${pl.name} ${L} deep?`;
      add('flood', `${liq}${lv}`, t, { liquid: liq, level: lv }, pl);
    }

  for (const [sec, name] of Object.entries(WI.INTERVALS))
    for (const pl of SETTINGS) add('clones', `every${sec}`, `you cloned yourself every ${name}?`, { every: +sec }, pl, { setting: pl.name });

  ideas.forEach((i) => (i.title = cap(i.title)));
  WI.IDEAS = ideas;

  // Copy for the YouTube upload form.
  WI.meta = function (idea) {
    const base = idea.pre === 'WHO WINS?' ? `${idea.title}: who wins?` : `What if ${idea.title.charAt(0).toLowerCase() + idea.title.slice(1)}`;
    const tags = ['whatif', 'shorts', 'animation', 'stickman', ...WI.ARCHES[idea.arche].tags];
    const title = (base.length > 88 ? base.slice(0, 87) + '…' : base) + ' #shorts';
    const description = [
      base,
      '',
      'An animated what-if simulation. Numbers are rough, for entertainment — tell me what you would do in the comments!',
      '',
      tags.map((t) => '#' + t).join(' '),
    ].join('\n');
    return { title, description, tags: tags.join(', ') };
  };
})();
