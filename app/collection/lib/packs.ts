// Pack draw logic — a pack is PACK_SIZE frogs pulled from the unowned pool,
// rarity-weighted, with a floor of at least one Uncommon-or-better.

import type { Frog, TierKey } from "../../lib/collection/types";
import { PACK_SIZE } from "./store";

/** Relative draw weight per tier — common is the floor, a 1-of-1 a thrill. */
const TIER_DRAW_WEIGHT: Record<TierKey, number> = {
  common: 100,
  uncommon: 38,
  rare: 12,
  epic: 4,
  legendary: 1.2,
  "one-of-one": 0.4,
};

const BETTER_THAN_COMMON: TierKey[] = [
  "uncommon",
  "rare",
  "epic",
  "legendary",
  "one-of-one",
];

function weightedPick(pool: Frog[]): number {
  const total = pool.reduce((s, f) => s + TIER_DRAW_WEIGHT[f.tier], 0);
  let r = Math.random() * total;
  for (let i = 0; i < pool.length; i += 1) {
    r -= TIER_DRAW_WEIGHT[pool[i].tier];
    if (r < 0) return i;
  }
  return pool.length - 1;
}

/**
 * Draw a pack from the not-yet-owned frogs. Each frog is unique, so a pack
 * never repeats. Returns fewer than PACK_SIZE only if the pool is near empty.
 */
export function drawPack(frogs: Frog[], owned: Set<number>): Frog[] {
  const remaining = frogs.filter((f) => !owned.has(f.id));
  const picks: Frog[] = [];
  const take = Math.min(PACK_SIZE, remaining.length);
  for (let i = 0; i < take; i += 1) {
    const idx = weightedPick(remaining);
    picks.push(remaining[idx]);
    remaining.splice(idx, 1);
  }

  // Floor: guarantee at least one Uncommon-or-better when the pool still has one.
  if (picks.length > 0 && !picks.some((f) => BETTER_THAN_COMMON.includes(f.tier))) {
    const better = remaining.filter((f) => BETTER_THAN_COMMON.includes(f.tier));
    const commonIdx = picks.findIndex((f) => f.tier === "common");
    if (better.length > 0 && commonIdx >= 0) {
      picks[commonIdx] = better[Math.floor(Math.random() * better.length)];
    }
  }

  // Reveal commonest-first so the rarity escalates as cards flip.
  const order: TierKey[] = ["common", "uncommon", "rare", "epic", "legendary", "one-of-one"];
  picks.sort((a, b) => order.indexOf(a.tier) - order.indexOf(b.tier));
  return picks;
}
