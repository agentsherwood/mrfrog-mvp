import { TEXTURE_KEYS } from "./textures";

// High-score badges. A badge is earned the moment the all-time high score
// crosses its threshold — they only ever unlock, never reset. The medal
// texture is tinted per tier; locked badges render with LOCKED_TINT.

export type BadgeTier = {
  score: number;
  label: string;
  name: string;
  tint: number;
};

export const BADGE_TEXTURE = TEXTURE_KEYS.badge;
export const BADGE_LOCKED_TINT = 0x2a1f14;

export const BADGE_TIERS: readonly BadgeTier[] = [
  { score: 1000, label: "1,000", name: "Bronze", tint: 0xd79a5b },
  { score: 2000, label: "2,000", name: "Silver", tint: 0xcdd2d8 },
  { score: 5000, label: "5,000", name: "Gold", tint: 0xf2cf5e },
];
