// Mr Frog Collection — manifest generator.
//
// Reads app/data/collection-traits.ts and writes the 10,000-frog manifest to
// public/collection/collection.json. Deterministic: a fixed PRNG seed means
// frog #N is the same frog on every run. See the trait spec for the model:
// brain2/Projects/MrFrog/MrFrog-Collection-spec.md
//
//   npm run collection:gen
//
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  AMELIA_FROG,
  CATEGORY_BY_ID,
  COLLECTION_SEED,
  COLLECTION_SIZE,
  ROLL_ORDER,
  TIERS,
  tierForRank,
  traitProbability,
} from "../app/data/collection-traits";
import type { Frog, FrogTraits } from "../app/lib/collection/types";

// --- deterministic PRNG (mulberry32) -------------------------------------
// Tiny, fast, fully deterministic. Seeded once; consumed in a fixed order.
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

// --- weighted pick within a category -------------------------------------
function pickValue(categoryId: keyof FrogTraits, rng: () => number): string {
  const values = CATEGORY_BY_ID[categoryId].values;
  const total = values.reduce((s, v) => s + v.weight, 0);
  let roll = rng() * total;
  for (const v of values) {
    roll -= v.weight;
    if (roll < 0) return v.key;
  }
  return values[values.length - 1].key; // float-safety fallback
}

function traitKey(traits: FrogTraits): string {
  return ROLL_ORDER.map((c) => traits[c]).join("|");
}

// --- rarity score: Σ 1/pᵢ across the 7 traits ----------------------------
function rarityScore(traits: FrogTraits): number {
  let score = 0;
  for (const category of ROLL_ORDER) {
    const p = traitProbability(category, traits[category]);
    score += p > 0 ? 1 / p : 0;
  }
  return Math.round(score * 100) / 100;
}

// --- generate ------------------------------------------------------------
function generate(): { frogs: Frog[]; rerolls: number } {
  const rng = mulberry32(COLLECTION_SEED);
  const seen = new Set<string>();

  // The hand-defined 1-of-1 is injected first as id 1.
  const ameliaTraits = AMELIA_FROG.traits as FrogTraits;
  const frogs: Frog[] = [
    {
      id: AMELIA_FROG.id,
      traits: ameliaTraits,
      rarityScore: rarityScore(ameliaTraits),
      rarityRank: 0,
      tier: "common",
      name: AMELIA_FROG.name,
    },
  ];
  seen.add(traitKey(ameliaTraits));

  let rerolls = 0;
  while (frogs.length < COLLECTION_SIZE) {
    const traits = {} as FrogTraits;
    for (const category of ROLL_ORDER) {
      traits[category] = pickValue(category, rng);
    }
    const key = traitKey(traits);
    if (seen.has(key)) {
      rerolls += 1; // collision — re-roll, no id burned
      continue;
    }
    seen.add(key);
    frogs.push({
      id: frogs.length + 1,
      traits,
      rarityScore: rarityScore(traits),
      rarityRank: 0,
      tier: "common",
    });
  }

  // Rank by score desc, id asc. Then force Amelia (id 1) to rank 1 so the
  // 1-of-1 slot always belongs to her, whatever the random rolls produced.
  frogs.sort((a, b) =>
    b.rarityScore !== a.rarityScore
      ? b.rarityScore - a.rarityScore
      : a.id - b.id,
  );
  const ameliaIdx = frogs.findIndex((f) => f.id === AMELIA_FROG.id);
  if (ameliaIdx > 0) {
    const [amelia] = frogs.splice(ameliaIdx, 1);
    frogs.unshift(amelia);
  }
  frogs.forEach((frog, i) => {
    frog.rarityRank = i + 1;
    frog.tier = tierForRank(i + 1);
  });

  // Re-sort to id order for a stable, browseable manifest.
  frogs.sort((a, b) => a.id - b.id);
  return { frogs, rerolls };
}

// --- run -----------------------------------------------------------------
function main(): void {
  const { frogs, rerolls } = generate();

  // Validate before writing.
  if (frogs.length !== COLLECTION_SIZE) {
    throw new Error(`Expected ${COLLECTION_SIZE} frogs, got ${frogs.length}`);
  }
  const keys = new Set(frogs.map((f) => traitKey(f.traits)));
  if (keys.size !== COLLECTION_SIZE) {
    throw new Error(`Duplicate frogs: ${COLLECTION_SIZE - keys.size} collisions slipped through`);
  }
  const tierCounts = new Map<string, number>();
  for (const f of frogs) tierCounts.set(f.tier, (tierCounts.get(f.tier) ?? 0) + 1);
  for (const t of TIERS) {
    const got = tierCounts.get(t.key) ?? 0;
    if (got !== t.count) {
      throw new Error(`Tier ${t.key}: expected ${t.count}, got ${got}`);
    }
  }

  const here = dirname(fileURLToPath(import.meta.url));
  const outPath = resolve(here, "../public/collection/collection.json");
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(frogs));

  // Summary.
  const scores = frogs.map((f) => f.rarityScore);
  const amelia = frogs.find((f) => f.id === 1)!;
  console.log(`✓ ${frogs.length} unique frogs → public/collection/collection.json`);
  console.log(`  dedup re-rolls: ${rerolls}`);
  console.log(`  rarity score range: ${Math.min(...scores).toFixed(2)} – ${Math.max(...scores).toFixed(2)}`);
  console.log(`  tiers:`);
  for (const t of TIERS) {
    console.log(`    ${t.label.padEnd(10)} ${tierCounts.get(t.key)}`);
  }
  console.log(`  #1 ${amelia.name} — rank ${amelia.rarityRank}, ${amelia.tier}, score ${amelia.rarityScore}`);
}

main();
