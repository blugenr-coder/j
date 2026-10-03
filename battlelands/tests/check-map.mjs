/* Map sanity: buildings stay on dry land and don't overlap each other or
   solid props; every loot spot is standable and reachable from the centre. */
import { getMap, circleHitsObstacle } from '../src/world/MapManager.js';
import { NavGrid } from '../src/bots/BotNavigation.js';

const map = getMap();
let fail = 0;
const bad = (m) => { console.log('✗', m); fail++; };

for (const b of map.buildings) {
  for (const [x, y] of [[b.x, b.y], [b.x + b.w, b.y], [b.x, b.y + b.h], [b.x + b.w, b.y + b.h], [b.x + b.w / 2, b.y + b.h / 2]])
    if (map.isWater(x, y, 10)) bad(`building ${b.id} (${b.poi}) at ${b.x},${b.y} touches water`);
  for (const o of map.buildings) if (o !== b && b.x < o.x + o.w + 20 && b.x + b.w + 20 > o.x && b.y < o.y + o.h + 20 && b.y + b.h + 20 > o.y)
    if (b.id < o.id) bad(`buildings ${b.id} and ${o.id} overlap`);
  for (const ob of map.obstacles) {
    if (ob.building || !ob.blocksMove || ob.kind === 'fortwall' || ob.kind === 'tower') continue;
    const [ox0, oy0, ox1, oy1] = ob.type === 'circle' ? [ob.x - ob.r, ob.y - ob.r, ob.x + ob.r, ob.y + ob.r] : [ob.x, ob.y, ob.x + ob.w, ob.y + ob.h];
    const cx = (ox0 + ox1) / 2, cy = (oy0 + oy1) / 2;
    if (ox1 > b.x - 10 && ox0 < b.x + b.w + 10 && oy1 > b.y - 10 && oy0 < b.y + b.h + 10) bad(`${ob.kind} at ${Math.round(cx)},${Math.round(cy)} inside building ${b.id}`);
  }
}
for (const ob of map.obstacles) if (ob.kind !== 'pier' && ob.kind !== 'tree' && ob.kind !== 'rock') {
  const cx = ob.type === 'circle' ? ob.x : ob.x + ob.w / 2, cy = ob.type === 'circle' ? ob.y : ob.y + ob.h / 2;
  if (map.isWater(cx, cy)) bad(`${ob.kind} at ${Math.round(cx)},${Math.round(cy)} is in water`);
}

const nav = new NavGrid(map);
const reach = nav.flood(map.size / 2, map.size / 2);
let unreachable = 0;
for (const s of map.lootSpots) {
  if (map.circleBlocked(s.x, s.y, 14)) bad(`loot spot ${Math.round(s.x)},${Math.round(s.y)} is inside an obstacle`);
  if (!reach.has(nav.nearestOpen(nav.cellOf(s.x, s.y)))) { unreachable++; bad(`loot spot ${Math.round(s.x)},${Math.round(s.y)} unreachable`); }
}
console.log(`buildings ${map.buildings.length}, obstacles ${map.obstacles.length}, bushes ${map.bushes.length}, loot spots ${map.lootSpots.length}, pois ${map.pois.length}`);
console.log(fail ? `${fail} map problems` : 'map OK');
process.exit(fail ? 1 : 0);
