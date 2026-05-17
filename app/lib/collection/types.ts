// Shared types for the Mr Frog Collection — used by the manifest generator
// (scripts/generate-collection.ts) and the UI (app/collection/**).

import type { StatName, TierKey } from "../../data/collection-traits";

export type { TierKey, StatName };

/** One value per trait category — the genome of a frog. */
export interface FrogTraits {
  background: string;
  frogColour: string;
  outfit: string;
  headwear: string;
  eyewear: string;
  heldItem: string;
  shoes: string;
  finish: string;
}

/** The five playful stats, each 1–100. */
export type FrogStats = Record<StatName, number>;

/** One minted frog, as stored in collection.json. */
export interface Frog {
  /** 1-based catalogue number (#N / 10000). */
  id: number;
  traits: FrogTraits;
  stats: FrogStats;
  /** Σ 1/pᵢ across the 8 traits, 2 dp. */
  rarityScore: number;
  /** 1 = rarest. */
  rarityRank: number;
  tier: TierKey;
  /** Only the 1-of-1 carries a name. */
  name?: string;
}
