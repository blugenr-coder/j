# Padworks

A first-person rocket-building game for phone and desktop browsers. You run a small
space program on a government budget: design a rocket, buy the parts, carry them
onto the pad with your own hands, fly the contract, and land what's left.

Open `rocket/index.html` from any static web server (it is plain ES modules, with no
build step). Example:

```bash
cd rocket && python3 -m http.server 8765
```

Then visit <http://localhost:8765>. It does not work from `file://`, because browsers
block module imports there.

## The loop

1. **Contract.** Each level gives you a budget (grant), required objectives and one bonus.
2. **Blueprint.** Design a stack top-to-bottom in the terminal. The engineering panel
   shows ΔV and thrust-to-weight per stage, and a build review that flags flaws.
3. **Buy.** New parts, or cheaper worn parts on the used market. Deliveries fall into
   the yellow bay.
4. **Build.** Walk, grab parts and stack them on the pad bottom-first. A hologram shows
   the next part of the active blueprint. The crane can auto-assemble (unless a hangar
   event has knocked it out).
5. **Fly.** Stage, throttle, steer, run experiments, deploy payloads, and handle failures.
6. **Land.** Parachutes (below 300 m/s), legs, or a powered landing. A damaged landing
   still counts. A crash does not.
7. **Outcome.** Success gives you the next contract and a bigger grant. Failure means
   repeating the contract on a reduced grant. Landed parts come back worn: fly them
   again or resell them.

## What makes a build fail (all simulated, not just warnings)

| Flaw | Effect in flight |
|---|---|
| Engine with parts below it in its stage | Exhaust scorches those parts, thrust drops 25% |
| Fins in the upper half | They flip the rocket instead of stabilising it |
| No fins | Aerodynamically unstable when coasting; tumbling at speed causes stress damage |
| Wide part on a narrow part | Weak joint: wobble and cracking under dynamic pressure |
| Very tall and thin stack | Flexes and wobbles; resonance failures become likely |
| Top-heavy without low fins | Tries to tumble whenever the engines stop |
| Parachute buried more than 3 parts deep | Lines snag: only 40% of the drag |
| Heat shield not at the bottom of its stage | No protection on re-entry |
| Landing legs not at the bottom | Never touch the ground: no landing bonus |
| Payload with parts above it | The satellite cannot be deployed |
| Separator narrower than the part above | Separation jams half the time |
| Nose cone not on top | No drag reduction |
| Thrust-to-weight below 1 | Never leaves the pad (launch is blocked) |
| Worn parts | Fail more often and absorb less damage |

## Events

- **44 in-flight events** (failures and a few opportunities): flameouts, leaks, bird
  strikes, wind shear, lightning, solar flares, debris, tangled chutes, heat-shield
  cracks, thruster stuck open, landing-leg failures and more. Each needs a quick
  action: tap, mash, hold, hit a timing window, steer, or choose. Repair kits fix them
  automatically. Electrical events can be absorbed by an Avionics Hub or Battery Bank.
- **33 hangar events**, delivered as memos: sales, price spikes, inspectors, sponsors,
  strikes, scams, grey-market deals, recalls, insurance, loans, earthquakes (loose
  parts really get thrown around), power cuts and more.

## Physics model

2D trajectory around a round planet (radius 300 km, so orbit fits a mobile session),
with inverse-square gravity, an exponential atmosphere, drag, Isp that varies with air
pressure, mass that drops as fuel burns, staging, re-entry heating with an ablative
shield, and a part-by-part damage model.

Attitude is torque-based: the centre of mass and moment of inertia are computed from
the actual parts and remaining fuel, so long, heavy rockets turn slowly. Steering
comes from engine gimbal (only while thrusting), reaction wheels in command parts, and
grid fins. Aerodynamic normal force acts on the nose (destabilising) and on the fins
(stabilising, if they sit below the centre of mass), so stability emerges from the
build. The weather changes on every flight: surface wind, a jet stream at altitude,
gusts and turbulence. Every engine is slightly misaligned (worn ones more so), engines
spool up and lag the throttle, can fail to ignite, and the rocket rotates about its
centre of mass. Parachutes are drawn at their real size and pull the top of the
rocket along the airflow, so it swings underneath them like a pendulum. The 3D view uses a
floating origin, so rendering stays precise at orbital distances.

`js/sim.js` contains no rendering code and can be run headless in Node for balance testing.

## Files

```
index.html  style.css          page + interface styling
js/data.js                     parts catalogue, contracts, quest text
js/sim.js                      flight physics + build-flaw analysis (pure)
js/events.js                   flight events + hangar events
js/state.js                    economy, inventory, save/load (localStorage)
js/hangar.js                   first-person hangar, hands, grabbing, crane
js/flight.js                   flight rendering, quests, mission outcome
js/ui.js                       HUDs, terminal, blueprint editor, reports
js/models.js                   procedural part meshes, hands, particles
js/input.js  js/audio.js       touch/keyboard/mouse, synthesised sound
vendor/three.module.min.js     three.js r160 (MIT, see THREE-LICENSE.txt)
```
