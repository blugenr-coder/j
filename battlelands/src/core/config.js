/* Every tunable number in one place. Gameplay feel lives here: change a value,
   reload, play. Nothing else in the codebase should hard-code these. */

export const CONFIG = {
  map: {
    size: 2800,          // world units, square
    border: 110,         // ocean ring nobody can walk into
  },

  camera: {
    cameraZoom: 1,            // 1 = default framing; >1 zooms in
    viewUnits: 780,           // sqrt(visible area) in world units at zoom 1
    cameraHeight: 0.00042,    // perspective strength: how far tall things lean away from centre
    cameraFollowSpeed: 9,     // exponential follow rate (1/s)
    cameraSmoothing: 0.14,    // 0 = rigid, 1 = very floaty look-ahead
    cameraBoundary: 260,      // how far past the map edge the camera may show
    lookAhead: 70,            // units the camera leads in the aim direction
    deployZoom: 0.38,         // zoom while parachuting
  },

  player: {
    moveSpeed: 275,
    acceleration: 3200,
    deceleration: 4200,
    rotationSpeed: 22,        // rad/s the body turns towards the aim
    collisionRadius: 18,
    maxHealth: 100,
    maxArmor: 100,
    waterSpeedFactor: 0.55,
    healMoveFactor: 0.6,
    pickupRadius: 56,
  },

  match: {
    combatants: 32,
    deployChooseTime: 9,      // seconds on the landing map
    descentTime: 2.6,
    resultsDelay: 1.6,        // pause on "ELIMINATED" before results
  },

  /* Safe-zone phases. wait → warning → shrink. Times in seconds, dps applies
     outside the zone and ignores armor. targetAlive is what the pacing
     controller expects to be alive when the phase's wait starts. */
  zone: {
    startRadius: 1500,
    phases: [
      { wait: 38, warning: 14, shrink: 26, radius: 900, dps: 2,  targetAlive: 30 },
      { wait: 22, warning: 10, shrink: 24, radius: 560, dps: 4,  targetAlive: 20 },
      { wait: 16, warning: 9,  shrink: 22, radius: 330, dps: 7,  targetAlive: 13 },
      { wait: 12, warning: 8,  shrink: 20, radius: 170, dps: 11, targetAlive: 8 },
      { wait: 9,  warning: 6,  shrink: 20, radius: 60,  dps: 16, targetAlive: 4 },
      { wait: 6,  warning: 5,  shrink: 30, radius: 0,   dps: 24, targetAlive: 2 },
    ],
    pressureMin: 0.6,         // most a phase wait can be shortened (×)
    pressureMax: 1.25,        // most it can be extended (×)
  },

  bots: {
    thinkInterval: 0.16,      // seconds between brain updates (staggered)
    pathsPerFrame: 3,         // A* budget
    viewRange: 640,
    hearRange: 900,
    damageMult: 0.7,      // bot → human
    botVsBotMult: 0.3,    // bot → bot: longer fights, so the lobby thins at a BR pace
  },

  perf: {
    maxParticles: 260,
    maxFloaters: 40,
    maxProjectiles: 220,
  },
};
