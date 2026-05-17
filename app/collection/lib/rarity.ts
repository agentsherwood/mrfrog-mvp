// Tier presentation + per-trait rarity helpers for the Collection UI.

import {
  CATEGORY_BY_ID,
  TRAIT_CATEGORIES,
  traitProbability,
  traitValue,
  type TierKey,
  type TraitCategoryId,
} from "../../data/collection-traits";
import type { Frog } from "../../lib/collection/types";

export interface TierStyle {
  label: string;
  /** Strong accent — badges, rings, glow. */
  accent: string;
  /** Soft tint — card wash. */
  soft: string;
  /** Readable text on the soft tint. */
  ink: string;
}

/** Notebook-palette styling per tier, common → 1-of-1. */
export const TIER_STYLE: Record<TierKey, TierStyle> = {
  common: { label: "Common", accent: "#a9a290", soft: "#eef0e6", ink: "#5c564a" },
  uncommon: { label: "Uncommon", accent: "#7bb47e", soft: "#e3f0df", ink: "#3f6f44" },
  rare: { label: "Rare", accent: "#6fb6cc", soft: "#dcecf2", ink: "#356c80" },
  epic: { label: "Epic", accent: "#cf8fc4", soft: "#f0e2f1", ink: "#7c4a72" },
  legendary: { label: "Legendary", accent: "#e6b53e", soft: "#f8eecb", ink: "#9a7416" },
  "one-of-one": { label: "1-of-1", accent: "#e57368", soft: "#fbe2de", ink: "#bd4034" },
};

/** Order rarest → commonest, for stats breakdowns. */
export const TIER_ORDER: TierKey[] = [
  "one-of-one",
  "legendary",
  "epic",
  "rare",
  "uncommon",
  "common",
];

/** A frog's display name — the 1-of-1 has a real one; others get a trait name. */
export function frogName(frog: Frog): string {
  if (frog.name) return frog.name;
  const outfit = traitValue("outfit", frog.traits.outfit);
  if (outfit && outfit.key !== "none") return `${outfit.label} Frog`;
  const colour = traitValue("frogColour", frog.traits.frogColour);
  return `${colour?.label ?? "Mr"} Frog`;
}

/** A trait value's label + how rare it is, as a percentage of the pool. */
export function traitRarity(
  category: TraitCategoryId,
  key: string,
): { label: string; percent: number } {
  const value = traitValue(category, key);
  return {
    label: value?.label ?? key,
    percent: Math.round(traitProbability(category, key) * 1000) / 10,
  };
}

/** The trait categories worth showing on the detail card, in order. */
export function visibleTraits(
  frog: Frog,
): { category: TraitCategoryId; label: string; valueLabel: string; percent: number }[] {
  return TRAIT_CATEGORIES.filter((c) => {
    const v = frog.traits[c.id];
    // Always show background + frog colour; show others only when set.
    return c.id === "background" || c.id === "frogColour" || (v && v !== "none" && v !== "matte");
  }).map((c) => {
    const r = traitRarity(c.id, frog.traits[c.id]);
    return {
      category: c.id,
      label: CATEGORY_BY_ID[c.id].label,
      valueLabel: r.label,
      percent: r.percent,
    };
  });
}
