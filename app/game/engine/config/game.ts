export const GAME_WIDTH = 400;
export const GAME_HEIGHT = 640;

export const PHYSICS = {
  gravity: 1400,
  jumpVelocity: -780,
  // Flower pads give a boost — softened from -2400 so the launch is fun, not
  // disorienting. Still well above a normal hop.
  springVelocity: -1600,
  horizontalSpeed: 320,
  maxFallSpeed: 900,
  // Upper bound on upward velocity. Needs to be larger (abs) than
  // springVelocity so the flower boost isn't clipped.
  maxRiseSpeed: 1800,
} as const;

export const PLATFORM = {
  width: 72,
  height: 18,
  minGapY: 92,
  maxGapY: 138,
  marginX: 24,
  // Max horizontal shift from one platform to the next. Keeps every gap
  // inside a comfortable hop instead of random full-width placement.
  maxStepX: 132,
} as const;

// Player starts with this many lives; a hazard hit costs one. Falling off
// the bottom is always terminal regardless of lives.
export const STARTING_LIVES = 3;

// Invulnerability window (ms) after a survivable hazard hit, so a cluster
// of falling hazards can't chain-kill.
export const INVULN_MS = 1500;

export const SCENES = {
  boot: "BootScene",
  splash: "SplashScene",
  game: "GameScene",
  gameOver: "GameOverScene",
} as const;

export const STORAGE_KEY = "mrfrog-waterfall-highscore";
