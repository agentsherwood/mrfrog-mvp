// Asset manifest: every image loaded from disk. BootScene iterates this.
// Paths are served by Next from mrfrog-mvp/public/, which sync-assets.sh
// populates from clawd-main/repos/mr-frog/ on predev/prebuild.

export type AssetEntry = { key: string; path: string };

const MRFROG = "";

export const PLAYER_ASSETS: Record<
  "idle" | "jump" | "fall" | "sad" | "surprised" | "dance",
  AssetEntry
> = {
  idle: { key: "player-idle", path: `${MRFROG}/character-ref/mr-frog/front-neutral.png` },
  jump: { key: "player-jump", path: `${MRFROG}/character-ref/mr-frog/poses/jump.png` },
  fall: { key: "player-fall", path: `${MRFROG}/character-ref/mr-frog/poses/fall.png` },
  sad: { key: "player-sad", path: `${MRFROG}/character-ref/mr-frog/sad.png` },
  surprised: { key: "player-surprised", path: `${MRFROG}/character-ref/mr-frog/surprised.png` },
  dance: { key: "player-dance", path: `${MRFROG}/character-ref/mr-frog/poses/dance.png` },
};

export const MRS_FROG_ASSETS: Record<"happy" | "cross", AssetEntry> = {
  happy: { key: "mrsfrog-happy", path: `${MRFROG}/character-ref/mrs-frog/happy.png` },
  cross: { key: "mrsfrog-cross", path: `${MRFROG}/character-ref/mrs-frog/cross.png` },
};

export const PLATFORM_ASSETS: Record<
  "lilyPad" | "lilyPadFlower" | "mushroom" | "rainCloud",
  AssetEntry
> = {
  lilyPad: { key: "plat-lily", path: `${MRFROG}/elements/nature/lily-pad.png` },
  lilyPadFlower: { key: "plat-lily-flower", path: `${MRFROG}/elements/nature/lily-pad-flower.png` },
  mushroom: { key: "plat-mushroom", path: `${MRFROG}/elements/nature/mushroom.png` },
  rainCloud: { key: "plat-cloud", path: `${MRFROG}/elements/everyday/rain-cloud.png` },
};

// Pool of household items used as breakable platforms. Each has a distinct
// image; the platform picks one at random on spawn. No label needed — the
// art speaks.
export const BREAKABLE_ASSETS: AssetEntry[] = [
  { key: "break-radio", path: `${MRFROG}/elements/everyday/radio.png` },
  { key: "break-washing", path: `${MRFROG}/elements/everyday/washing-machine.png` },
  { key: "break-tomato", path: `${MRFROG}/elements/everyday/tomato-bob.png` },
  { key: "break-peanut", path: `${MRFROG}/elements/everyday/peanut-butter.png` },
  { key: "break-easel", path: `${MRFROG}/elements/everyday/easel.png` },
];

export const ENV_ASSETS: Record<
  | "reeds"
  | "tree"
  | "sun"
  | "rainbow"
  | "splash"
  | "raindrops"
  | "droplet"
  | "pebbles"
  | "daisyWhite"
  | "daisyYellow",
  AssetEntry
> = {
  reeds: { key: "env-reeds", path: `${MRFROG}/elements/nature/reeds.png` },
  tree: { key: "env-tree", path: `${MRFROG}/elements/nature/tree.png` },
  sun: { key: "env-sun", path: `${MRFROG}/elements/nature/sun.png` },
  rainbow: { key: "env-rainbow", path: `${MRFROG}/elements/nature/rainbow.png` },
  splash: { key: "env-splash", path: `${MRFROG}/elements/nature/splash.png` },
  raindrops: { key: "env-raindrops", path: `${MRFROG}/elements/everyday/raindrops.png` },
  droplet: { key: "env-droplet", path: `${MRFROG}/elements/nature/droplet.png` },
  pebbles: { key: "env-pebbles", path: `${MRFROG}/elements/nature/pebbles.png` },
  daisyWhite: { key: "env-daisy-white", path: `${MRFROG}/elements/nature/daisy-white.png` },
  daisyYellow: { key: "env-daisy-yellow", path: `${MRFROG}/elements/nature/daisy-yellow.png` },
};

export const EMOTION_ASSETS: Record<
  | "sparkle"
  | "starburst"
  | "heartBurst"
  | "motion"
  | "excl"
  | "sweat",
  AssetEntry
> = {
  sparkle: { key: "emo-sparkle", path: `${MRFROG}/elements/emotion/sparkle.png` },
  starburst: { key: "emo-starburst", path: `${MRFROG}/elements/emotion/starburst.png` },
  heartBurst: { key: "emo-heart-burst", path: `${MRFROG}/elements/emotion/heart-burst.png` },
  motion: { key: "emo-motion", path: `${MRFROG}/elements/emotion/motion.png` },
  excl: { key: "emo-excl", path: `${MRFROG}/elements/emotion/excl.png` },
  sweat: { key: "emo-sweat", path: `${MRFROG}/elements/emotion/sweat.png` },
};

export const BIRTHDAY_ASSETS: Record<
  | "cake"
  | "candle"
  | "giftPink"
  | "giftBlue"
  | "balloons"
  | "balloon"
  | "popper"
  | "number12"
  | "hatStriped"
  | "hatPink"
  | "bunting"
  | "buntingFlag"
  | "banner",
  AssetEntry
> = {
  cake: { key: "bd-cake", path: `${MRFROG}/elements/celebration/cake.png` },
  candle: { key: "bd-candle", path: `${MRFROG}/elements/celebration/candle.png` },
  giftPink: { key: "bd-gift-pink", path: `${MRFROG}/elements/celebration/gift-pink.png` },
  giftBlue: { key: "bd-gift-blue", path: `${MRFROG}/elements/celebration/gift-blue.png` },
  balloons: { key: "bd-balloons", path: `${MRFROG}/elements/celebration/balloons.png` },
  balloon: { key: "bd-balloon", path: `${MRFROG}/elements/everyday/balloon.png` },
  popper: { key: "bd-popper", path: `${MRFROG}/elements/celebration/popper.png` },
  number12: { key: "bd-number-12", path: `${MRFROG}/elements/celebration/number-12.png` },
  hatStriped: { key: "bd-hat-striped", path: `${MRFROG}/elements/celebration/hat-striped.png` },
  hatPink: { key: "bd-hat-pink", path: `${MRFROG}/elements/celebration/hat-pink.png` },
  bunting: { key: "bd-bunting", path: `${MRFROG}/elements/celebration/bunting.png` },
  buntingFlag: { key: "bd-bunting-flag", path: `${MRFROG}/elements/celebration/bunting-flag.png` },
  banner: { key: "bd-banner", path: `${MRFROG}/elements/celebration/banner.png` },
};

/** All asset entries, used by BootScene to preload. */
export const ALL_ASSETS: AssetEntry[] = [
  ...Object.values(PLAYER_ASSETS),
  ...Object.values(MRS_FROG_ASSETS),
  ...Object.values(PLATFORM_ASSETS),
  ...BREAKABLE_ASSETS,
  ...Object.values(ENV_ASSETS),
  ...Object.values(EMOTION_ASSETS),
  ...Object.values(BIRTHDAY_ASSETS),
];
