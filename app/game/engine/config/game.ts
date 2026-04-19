export const GAME_WIDTH = 400;
export const GAME_HEIGHT = 640;

export const PHYSICS = {
  gravity: 1400,
  jumpVelocity: -780,
  // Flower pads SHOOT him up. Previous value got capped by maxFallSpeed, so
  // also raise the vertical max below to let it actually fly.
  springVelocity: -2400,
  horizontalSpeed: 320,
  maxFallSpeed: 900,
  // Upper bound on upward velocity. Needs to be larger (abs) than
  // springVelocity so the flower boost isn't clipped.
  maxRiseSpeed: 2600,
} as const;

export const PLATFORM = {
  width: 72,
  height: 18,
  minGapY: 70,
  maxGapY: 120,
  marginX: 24,
} as const;

export const SCENES = {
  boot: "BootScene",
  splash: "SplashScene",
  game: "GameScene",
  gameOver: "GameOverScene",
} as const;

export const STORAGE_KEY = "mrfrog-waterfall-highscore";
