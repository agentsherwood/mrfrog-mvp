// Shared types for the Mr Frog Collection — used by the manifest generator
// (scripts/generate-collection.ts) and the UI (app/collection/**).

import type { TierKey } from "../../data/collection-traits";

export type { TierKey };

/** One value per trait category — the genome of a frog. */
export interface FrogTraits {
  background: string;
  bodyColour: string;
  expression: string;
  outfit: string;
  heldItem: string;
  headwear: string;
  effect: string;
}

/** One minted frog, as stored in collection.json. */
export interface Frog {
  /** 1-based catalogue number (#N / 10000). */
  id: number;
  traits: FrogTraits;
  /** Σ 1/pᵢ across the 7 traits, 2 dp. */
  rarityScore: number;
  /** 1 = rarest. */
  rarityRank: number;
  tier: TierKey;
  /** Only the 1-of-1 carries a name. */
  name?: string;
}
