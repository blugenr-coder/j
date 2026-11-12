// Game state, economy and persistence.
import { PART, PARTS, getLevel } from './data.js';

const KEY = 'rocketyard.save.v1';
let uid = Date.now() % 100000;
const newUid = () => 'p' + (uid++).toString(36);

export const S = {
  level: 0, cash: 0, attempt: 1,
  inventory: [],          // {uid,id,cond}  every part you own (on the floor or on the pad)
  pad: [],                // uids on the pad, bottom -> top
  blueprints: [],         // {name, ids top->bottom}
  plan: null,             // index of active blueprint
  used: [],               // used-market listings {uid,id,cond,price}
  partMods: {},           // permanent price multipliers per part id
  flags: {},              // engineer, insured, loan, sponsorDebt, cat...
  stats: { launches: 0, wins: 0, crashes: 0, spent: 0, earned: 0, best: 0 },
  visit: null,            // transient per hangar visit
  history: [],
  started: false,
  listeners: new Set(),

  grant() { return getLevel(this.level).grant; },
  lvl() { return getLevel(this.level); },
  resetVisit() { this.visit = { mult: {}, out: null, craneOff: false, windy: false, hype: false, dark: 0, quake: 0, spawn: [] }; },
  price(id) {
    const d = PART[id];
    return Math.round(d.price * (this.partMods[id] || 1) * (this.visit?.mult[d.cat] || 1));
  },
  addPart(id, cond = 1, deliver = false) {
    const p = { uid: newUid(), id, cond };
    this.inventory.push(p);
    if (deliver && this.visit) this.visit.spawn.push(p.uid);
    this.emit(); return p;
  },
  buy(id) {
    const c = this.price(id);
    if (this.cash < c) return null;
    if (this.visit?.out === PART[id].cat) return null;
    this.cash -= c; this.stats.spent += c;
    return this.addPart(id, 1, true);
  },
  buyUsed(uidL) {
    const i = this.used.findIndex(u => u.uid === uidL); if (i < 0) return null;
    const u = this.used[i]; if (this.cash < u.price) return null;
    this.cash -= u.price; this.stats.spent += u.price; this.used.splice(i, 1);
    const p = { uid: u.uid, id: u.id, cond: u.cond }; this.inventory.push(p);
    this.visit?.spawn.push(p.uid); this.emit(); return p;
  },
  sellValue(p) { return Math.round(PART[p.id].price * (0.15 + 0.5 * p.cond)); },
  sell(uidS) {
    const p = this.inventory.find(q => q.uid === uidS); if (!p || this.pad.includes(uidS)) return 0;
    const v = this.sellValue(p); this.cash += v; this.stats.earned += v;
    this.removePart(uidS); return v;
  },
  removePart(uidR) {
    this.inventory = this.inventory.filter(p => p.uid !== uidR);
    this.pad = this.pad.filter(u => u !== uidR);
    this.emit();
  },
  refreshPart() { this.emit(); },
  get(uidG) { return this.inventory.find(p => p.uid === uidG); },
  randomInventory() { const f = this.inventory.filter(p => !this.pad.includes(p.uid)); return f.length ? f[Math.floor(Math.random() * f.length)] : (this.inventory[Math.floor(Math.random() * this.inventory.length)] || null); },
  worstInventory() { return [...this.inventory].sort((a, b) => a.cond - b.cond)[0] || null; },
  refreshUsed(n = 8, discount = 0) {
    const g = this.grant();
    const pool = PARTS.filter(p => p.price < g * 0.9);
    this.used = [];
    for (let i = 0; i < n; i++) {
      const d = pool[Math.floor(Math.random() * pool.length)];
      const cond = Math.round((0.2 + Math.random() * 0.6) * 100) / 100;
      const price = Math.round(d.price * (0.25 + cond * 0.55) * (1 - discount) / 50) * 50;
      this.used.push({ uid: newUid(), id: d.id, cond, price });
    }
    this.emit();
  },
  padStack() { return this.pad.map(u => this.get(u)).filter(Boolean); },   // bottom -> top
  // stack in sim order: top -> bottom
  flightStack() { return this.padStack().slice().reverse().map(p => ({ uid: p.uid, id: p.id, cond: p.cond })); },
  padValue() { return this.padStack().reduce((a, p) => a + this.sellValue(p), 0); },

  // ---------- mission outcome ----------
  // result: {success, landed, crashed, survivors:[{uid,newCond}], bonusCash, bonusDone:[reward], reason}
  applyResult(r) {
    this.stats.launches++;
    const lvl = this.lvl();
    const flown = new Set(this.pad);
    const out = { lines: [], cashDelta: 0 };
    // every part that flew is gone unless it landed with the vessel
    const keep = new Map((r.survivors || []).map(s => [s.uid, s.cond]));
    this.inventory = this.inventory.filter(p => !flown.has(p.uid) || keep.has(p.uid));
    this.inventory.forEach(p => { if (keep.has(p.uid)) p.cond = keep.get(p.uid); });
    this.pad = [];
    if (r.bonusCash) { this.cash += r.bonusCash; out.lines.push(['In-flight extras', r.bonusCash]); }
    for (const b of r.bonusDone || []) { this.cash += b; out.lines.push(['Bonus objective', b]); }
    if (this.flags.sponsorDebt) {
      if (!(r.bonusDone || []).length) { this.cash -= this.flags.sponsorDebt; out.lines.push(['Sponsor clawback', -this.flags.sponsorDebt]); }
      this.flags.sponsorDebt = 0;
    }
    if (r.crashed && this.flags.insured) { const v = Math.round(r.rocketValue * 0.5); this.cash += v; out.lines.push(['Insurance payout', v]); }
    this.flags.insured = false;
    if (r.crashed) this.stats.crashes++;
    if (r.success) {
      this.stats.wins++;
      this.level++; this.attempt = 1;
      let g = this.grant();
      if (this.flags.loan) { g -= this.flags.loan; out.lines.push(['Loan repayment', -this.flags.loan]); this.flags.loan = 0; }
      this.cash += g; out.lines.push([`Grant for level ${this.level + 1}`, getLevel(this.level).grant]);
      this.stats.best = Math.max(this.stats.best, this.level);
    } else {
      this.attempt++;
      // trust drops: a reduced re-try grant, more so if you boasted to the press
      const frac = (r.crashed ? 0.45 : 0.6) - (this.visit?.hype ? 0.15 : 0);
      const g = Math.round(lvl.grant * frac / 500) * 500;
      this.cash += g; out.lines.push(['Re-try grant (reduced trust)', g]);
      // bailout so the game can never soft-lock
      const worth = this.cash + this.inventory.reduce((a, p) => a + this.sellValue(p), 0);
      if (worth < 9000) { const b = 9000 - Math.max(0, worth); this.cash += b; out.lines.push(['Emergency bailout', b]); }
    }
    this.history.unshift({ level: lvl.n, name: lvl.name, success: r.success, reason: r.reason, t: Date.now() });
    this.history = this.history.slice(0, 20);
    this.refreshUsed();
    this.save(); this.emit();
    return out;
  },

  newGame() {
    Object.assign(this, { level: 0, cash: getLevel(0).grant, attempt: 1, inventory: [], pad: [], blueprints: [], plan: null, partMods: {}, flags: {}, stats: { launches: 0, wins: 0, crashes: 0, spent: 0, earned: 0, best: 0 }, history: [], started: true });
    this.blueprints.push({ name: 'Starter hopper (example)', ids: ['core_probe', 'chute_s', 'tank_s', 'fins', 'eng_sparrow'] });
    this.plan = 0;
    this.refreshUsed();
    this.save(); this.emit();
  },
  save() {
    try {
      const { level, cash, attempt, inventory, pad, blueprints, plan, used, partMods, flags, stats, history, started } = this;
      localStorage.setItem(KEY, JSON.stringify({ level, cash, attempt, inventory, pad, blueprints, plan, used, partMods, flags, stats, history, started }));
    } catch { /* storage unavailable: play continues unsaved */ }
  },
  load() {
    try { const d = JSON.parse(localStorage.getItem(KEY)); if (d && d.started) {
        Object.assign(this, d); this.inventory = this.inventory.filter(p => PART[p.id]);
        // saves from before the physics update: the starter design needs fins to fly straight
        for (const bp of this.blueprints) if (bp.name.startsWith('Starter hopper') && !bp.ids.includes('fins')) { const i = bp.ids.lastIndexOf('eng_sparrow'); if (i >= 0) bp.ids.splice(i, 0, 'fins'); }
        return true;
      } } catch { }
    return false;
  },
  wipe() { try { localStorage.removeItem(KEY); } catch { } },
  on(fn) { this.listeners.add(fn); },
  emit() { for (const f of this.listeners) f(); },
};
