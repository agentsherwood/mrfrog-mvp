// Mr Frog Collection — manifest generator.
//
// Reads app/data/collection-traits.ts and writes the frog manifest to
// public/collection/collection.json. Deterministic (fixed PRNG seed).
//
// The collection is built up a layer at a time: only ACTIVE_CATEGORIES vary
// between frogs; every other category is pinned to its default ("none" /
// "matte" / "classic-green"). COLLECTION_SIZE grows with the phases.
//
//   npm run collection:gen
//
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  ACTIVE_CATEGORIES,
  AMELIA_FROG,
  CATEGORY_BY_ID,
  COLLECTION_SEED,
  COLLECTION_SIZE,
  ROLL_ORDER,
  STAT_NAMES,
  TIERS,
  tierCounts,
  tierForRank,
  traitProbability,
} from "../app/data/collection-traits";
import type { Frog, FrogStats, FrogTraits } from "../app/lib/collection/types";
import type { StatName, TierKey } from "../app/data/collection-traits";

// --- deterministic PRNG (mulberry32) -------------------------------------
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickValue(categoryId: keyof FrogTraits, rng: () => number): string {
  const values = CATEGORY_BY_ID[categoryId].values;
  const total = values.reduce((s, v) => s + v.weight, 0);
  let roll = rng() * total;
  for (const v of values) {
    roll -= v.weight;
    if (roll < 0) return v.key;
  }
  return values[values.length - 1].key;
}

/** Default (pinned) value for an inactive category — its first value. */
function defaultValue(categoryId: keyof FrogTraits): string {
  return CATEGORY_BY_ID[categoryId].values[0].key;
}

const isActive = (c: keyof FrogTraits) => ACTIVE_CATEGORIES.includes(c);

function traitKey(traits: FrogTraits): string {
  return ROLL_ORDER.map((c) => traits[c]).join("|");
}

// --- rarity score: Σ 1/pᵢ across the ACTIVE traits -----------------------
function rarityScore(traits: FrogTraits): number {
  let score = 0;
  for (const category of ACTIVE_CATEGORIES) {
    const p = traitProbability(category, traits[category]);
    score += p > 0 ? 1 / p : 0;
  }
  return Math.round(score * 100) / 100;
}

// --- playful stats -------------------------------------------------------
const TIER_BONUS: Record<TierKey, number> = {
  "one-of-one": 18,
  legendary: 14,
  epic: 10,
  rare: 6,
  uncommon: 3,
  common: 0,
};

const has = (value: string, set: string[]) => (set.includes(value) ? 1 : 0);

function thematicNudge(stat: StatName, t: FrogTraits): number {
  switch (stat) {
    case "hop":
      return 14 * has(t.shoes, ["trainers", "football-boots", "roller-skates"]) +
        8 * has(t.outfit, ["strongman"]);
    case "splash":
      return 14 * has(t.background, ["pond", "underwater", "rainbow-rain"]) +
        6 * has(t.outfit, ["raincoat", "sailor"]);
    case "charm":
      return 12 * has(t.finish, ["shiny", "foil", "holo", "rainbow"]) +
        8 * has(t.headwear, ["crown", "flower-crown"]);
    case "brains":
      return 14 * has(t.eyewear, ["nerd-glasses", "round-glasses", "monocle"]) +
        6 * has(t.outfit, ["painter-smock"]);
    case "luck":
      return 16 * has(t.finish, ["rainbow"]) +
        12 * has(t.heldItem, ["golden-acorn", "diamond", "magic-wand"]);
  }
}

function computeStats(id: number, traits: FrogTraits, tier: TierKey): FrogStats {
  const stats = {} as FrogStats;
  STAT_NAMES.forEach((stat, i) => {
    const rng = mulberry32(COLLECTION_SEED + id * 131 + i * 977);
    const base = 25 + Math.floor(rng() * 56);
    const value = base + TIER_BONUS[tier] + thematicNudge(stat, traits);
    stats[stat] = Math.max(1, Math.min(100, value));
  });
  return stats;
}

// --- generate ------------------------------------------------------------
function rollTraits(rng: () => number): FrogTraits {
  const traits = {} as FrogTraits;
  for (const category of ROLL_ORDER) {
    traits[category] = isActive(category)
      ? pickValue(category, rng)
      : defaultValue(category);
  }
  return traits;
}

function ameliaTraits(): FrogTraits {
  const src = AMELIA_FROG.traits as Record<string, string>;
  const traits = {} as FrogTraits;
  for (const category of ROLL_ORDER) {
    traits[category] = isActive(category)
      ? src[category]
      : defaultValue(category);
  }
  return traits;
}

function generate(): { frogs: Frog[]; rerolls: number } {
  const rng = mulberry32(COLLECTION_SEED);
  const seen = new Set<string>();

  const amelia = ameliaTraits();
  const frogs: Frog[] = [
    {
      id: AMELIA_FROG.id,
      traits: amelia,
      stats: {} as FrogStats,
      rarityScore: rarityScore(amelia),
      rarityRank: 0,
      tier: "common",
      name: AMELIA_FROG.name,
    },
  ];
  seen.add(traitKey(amelia));

  let rerolls = 0;
  let guard = 0;
  while (frogs.length < COLLECTION_SIZE) {
    if (guard++ > COLLECTION_SIZE * 5000) {
      throw new Error("ran out of unique combinations — too few active traits");
    }
    const traits = rollTraits(rng);
    const key = traitKey(traits);
    if (seen.has(key)) {
      rerolls += 1;
      continue;
    }
    seen.add(key);
    frogs.push({
      id: frogs.length + 1,
      traits,
      stats: {} as FrogStats,
      rarityScore: rarityScore(traits),
      rarityRank: 0,
      tier: "common",
    });
  }

  frogs.sort((a, b) =>
    b.rarityScore !== a.rarityScore
      ? b.rarityScore - a.rarityScore
      : a.id - b.id,
  );
  const ameliaIdx = frogs.findIndex((f) => f.id === AMELIA_FROG.id);
  if (ameliaIdx > 0) {
    const [a] = frogs.splice(ameliaIdx, 1);
    frogs.unshift(a);
  }
  frogs.forEach((frog, i) => {
    frog.rarityRank = i + 1;
    frog.tier = tierForRank(i + 1, COLLECTION_SIZE);
  });
  for (const frog of frogs) {
    frog.stats = computeStats(frog.id, frog.traits, frog.tier);
  }

  frogs.sort((a, b) => a.id - b.id);
  return { frogs, rerolls };
}

// --- run -----------------------------------------------------------------
function main(): void {
  const { frogs, rerolls } = generate();

  if (frogs.length !== COLLECTION_SIZE) {
    throw new Error(`Expected ${COLLECTION_SIZE} frogs, got ${frogs.length}`);
  }
  const keys = new Set(frogs.map((f) => traitKey(f.traits)));
  if (keys.size !== COLLECTION_SIZE) {
    throw new Error(`Duplicate frogs: ${COLLECTION_SIZE - keys.size} collisions`);
  }
  const counts = new Map<string, number>();
  for (const f of frogs) counts.set(f.tier, (counts.get(f.tier) ?? 0) + 1);
  const expected = tierCounts(COLLECTION_SIZE);
  for (const t of TIERS) {
    if ((counts.get(t.key) ?? 0) !== expected[t.key]) {
      throw new Error(`Tier ${t.key}: expected ${expected[t.key]}, got ${counts.get(t.key) ?? 0}`);
    }
  }

  const here = dirname(fileURLToPath(import.meta.url));
  const outPath = resolve(here, "../public/collection/collection.json");
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(frogs));

  const amelia = frogs.find((f) => f.id === 1)!;
  console.log(`✓ ${frogs.length} unique frogs → public/collection/collection.json`);
  console.log(`  active traits: ${ACTIVE_CATEGORIES.join(", ")}`);
  console.log(`  dedup re-rolls: ${rerolls}`);
  console.log(`  tiers:`);
  for (const t of TIERS) {
    console.log(`    ${t.label.padEnd(10)} ${counts.get(t.key)}`);
  }
  console.log(`  #1 ${amelia.name} — ${amelia.tier}, stats ${JSON.stringify(amelia.stats)}`);
}

main();
