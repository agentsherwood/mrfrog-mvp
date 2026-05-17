// The Mr Frog Collection — trait spec & rarity model (machine-readable).
// Twin of brain2/Projects/MrFrog/MrFrog-Collection-spec.md. Single source of
// truth for the compositor, the art pipeline, the pages and the packs.
//
// Render model — every frog is composited from these layers, bottom to top:
//   background · frog-base (the frog WITH its outfit, tinted by frog colour)
//   · shoes · held object · eyewear · headwear · finish overlay.
// The outfit is baked into the frog-base art (generated onto the one
// canonical frog) so it aligns perfectly; every other accessory sits in its
// own clear zone (feet / hand / eyes / head) at a fixed anchor.

export type TraitCategoryId =
  | "background"
  | "frogColour"
  | "outfit"
  | "headwear"
  | "eyewear"
  | "heldItem"
  | "shoes"
  | "finish";

export type TierKey =
  | "one-of-one"
  | "legendary"
  | "epic"
  | "rare"
  | "uncommon"
  | "common";

/** How a category turns into pixels. */
export type RenderKind = "image" | "frog-base" | "filter" | "overlay";

export interface TraitValue {
  /** Stable kebab-case id — never changes once minted. */
  key: string;
  /** Display name. */
  label: string;
  /** Drop weight; probability = weight / Σ weights of the category. */
  weight: number;
  /** Public URL of the 1024² PNG layer (image / frog-base categories). */
  layer?: string;
  /** CSS `filter` string (frogColour only; omitted = no filter). */
  filter?: string;
  /** CSS class applied for the finish overlay (finish only). */
  finishClass?: string;
  /** Slug of the Amelia drawing this value derives from, if any. */
  source?: string;
}

export interface TraitCategory {
  id: TraitCategoryId;
  label: string;
  render: RenderKind;
  /** Composite stacking order — low draws first (behind). */
  z: number;
  /** Folder under public/collection/layers (image / frog-base categories). */
  layerDir?: string;
  values: TraitValue[];
}

/** Where every image layer lives — the real-art swap is drop-in here. */
export const LAYER_BASE = "/collection/layers";

const bg = (k: string) => `${LAYER_BASE}/background/${k}.png`;
const frog = (k: string) => `${LAYER_BASE}/frog/${k}.png`;
const headwear = (k: string) => `${LAYER_BASE}/headwear/${k}.png`;
const eyewear = (k: string) => `${LAYER_BASE}/eyewear/${k}.png`;
const item = (k: string) => `${LAYER_BASE}/held-item/${k}.png`;
const shoes = (k: string) => `${LAYER_BASE}/shoes/${k}.png`;

export const TRAIT_CATEGORIES: TraitCategory[] = [
  {
    id: "background",
    label: "Background",
    render: "image",
    z: 0,
    layerDir: "background",
    values: [
      { key: "notebook", label: "Notebook Paper", weight: 360, layer: bg("notebook") },
      { key: "pond", label: "Lily Pond", weight: 170, layer: bg("pond") },
      { key: "farmyard", label: "Farmyard", weight: 120, layer: bg("farmyard") },
      { key: "sunset", label: "Sunset Sky", weight: 110, layer: bg("sunset") },
      { key: "kitchen", label: "Cosy Kitchen", weight: 90, layer: bg("kitchen"), source: "hungry-pie" },
      { key: "stage", label: "Spotlight Stage", weight: 60, layer: bg("stage"), source: "audience-musical" },
      { key: "night-sky", label: "Starry Night", weight: 45, layer: bg("night-sky"), source: "which-dream" },
      { key: "rainbow-rain", label: "Rainbow Rain", weight: 25, layer: bg("rainbow-rain"), source: "sweet-rain-dancing" },
      { key: "underwater", label: "Under the Sea", weight: 15, layer: bg("underwater"), source: "lost-at-sea" },
      { key: "outer-space", label: "Outer Space", weight: 5, layer: bg("outer-space"), source: "space-frog" },
    ],
  },
  {
    id: "frogColour",
    label: "Frog Colour",
    render: "filter",
    z: 1, // applied to the frog-base layer; not a layer of its own
    values: [
      { key: "classic-green", label: "Classic Green", weight: 600 },
      { key: "sky-blue", label: "Sky Blue", weight: 120, filter: "hue-rotate(90deg) saturate(1.1)" },
      { key: "bubblegum", label: "Bubblegum Pink", weight: 95, filter: "hue-rotate(215deg) saturate(1.2) brightness(1.02)" },
      { key: "sunshine", label: "Sunshine Yellow", weight: 75, filter: "hue-rotate(-55deg) saturate(1.5) brightness(1.1)" },
      { key: "mint", label: "Minty Fresh", weight: 55, filter: "hue-rotate(25deg) saturate(0.75) brightness(1.12)" },
      { key: "lavender", label: "Lavender", weight: 35, filter: "hue-rotate(165deg) saturate(0.85) brightness(1.05)" },
      { key: "tangerine", label: "Tangerine", weight: 15, filter: "hue-rotate(-75deg) saturate(1.55) brightness(1.05)" },
      { key: "cherry", label: "Cherry Red", weight: 5, filter: "hue-rotate(-130deg) saturate(1.6) brightness(0.98)" },
    ],
  },
  {
    // The outfit IS the frog-base layer — the frog drawn wearing it, so the
    // outfit always aligns. "none" is the plain canonical frog.
    id: "outfit",
    label: "Outfit",
    render: "frog-base",
    z: 1,
    layerDir: "frog",
    values: [
      { key: "none", label: "No Outfit", weight: 560, layer: frog("none") },
      { key: "raincoat", label: "Yellow Raincoat", weight: 95, layer: frog("raincoat"), source: "sitting-in-the-rain" },
      { key: "painter-smock", label: "Painter's Smock", weight: 80, layer: frog("painter-smock"), source: "painter" },
      { key: "chef-apron", label: "Chef's Apron", weight: 70, layer: frog("chef-apron"), source: "hungry-pie" },
      { key: "pyjamas", label: "Cosy Pyjamas", weight: 55, layer: frog("pyjamas"), source: "kids-sleepover" },
      { key: "tutu", label: "Ballet Tutu", weight: 45, layer: frog("tutu"), source: "dancing-waves" },
      { key: "sailor", label: "Sailor Suit", weight: 35, layer: frog("sailor"), source: "lost-at-sea" },
      { key: "strongman", label: "Strongman Singlet", weight: 25, layer: frog("strongman"), source: "strong-frog" },
      { key: "wedding-suit", label: "Wedding Suit", weight: 18, layer: frog("wedding-suit"), source: "lovely-children" },
      { key: "superhero", label: "Superhero Cape", weight: 10, layer: frog("superhero") },
      { key: "astronaut-suit", label: "Astronaut Suit", weight: 6, layer: frog("astronaut-suit"), source: "space-frog" },
      { key: "among-us", label: "Among Us Suit", weight: 1, layer: frog("among-us"), source: "inside-and-among-us" },
    ],
  },
  {
    id: "headwear",
    label: "Headwear",
    render: "image",
    z: 5,
    layerDir: "headwear",
    values: [
      { key: "none", label: "Bare Head", weight: 540 },
      { key: "party-hat", label: "Party Hat", weight: 105, layer: headwear("party-hat") },
      { key: "beanie", label: "Bobble Beanie", weight: 90, layer: headwear("beanie") },
      { key: "flower-crown", label: "Flower Crown", weight: 70, layer: headwear("flower-crown") },
      { key: "chef-hat", label: "Chef's Hat", weight: 55, layer: headwear("chef-hat"), source: "hungry-pie" },
      { key: "sailor-cap", label: "Sailor Cap", weight: 45, layer: headwear("sailor-cap"), source: "lost-at-sea" },
      { key: "top-hat", label: "Top Hat", weight: 35, layer: headwear("top-hat"), source: "lovely-children" },
      { key: "headphones", label: "Headphones", weight: 25, layer: headwear("headphones"), source: "table-dancing" },
      { key: "pirate-hat", label: "Pirate Hat", weight: 16, layer: headwear("pirate-hat") },
      { key: "birthday-12", label: "Birthday “12” Hat", weight: 12, layer: headwear("birthday-12") },
      { key: "astronaut-helmet", label: "Astronaut Helmet", weight: 8, layer: headwear("astronaut-helmet"), source: "space-frog" },
      { key: "crown", label: "Golden Crown", weight: 4, layer: headwear("crown") },
    ],
  },
  {
    id: "eyewear",
    label: "Eyewear",
    render: "image",
    z: 4,
    layerDir: "eyewear",
    values: [
      { key: "none", label: "No Eyewear", weight: 600 },
      { key: "round-glasses", label: "Round Glasses", weight: 110, layer: eyewear("round-glasses") },
      { key: "sunglasses", label: "Sunglasses", weight: 95, layer: eyewear("sunglasses") },
      { key: "nerd-glasses", label: "Nerdy Glasses", weight: 70, layer: eyewear("nerd-glasses") },
      { key: "swim-goggles", label: "Swim Goggles", weight: 50, layer: eyewear("swim-goggles"), source: "washing-machine" },
      { key: "heart-glasses", label: "Heart Glasses", weight: 35, layer: eyewear("heart-glasses") },
      { key: "star-glasses", label: "Star Glasses", weight: 22, layer: eyewear("star-glasses") },
      { key: "monocle", label: "Monocle", weight: 18, layer: eyewear("monocle") },
    ],
  },
  {
    id: "heldItem",
    label: "Held Object",
    render: "image",
    z: 3,
    layerDir: "held-item",
    values: [
      { key: "none", label: "Empty Hands", weight: 470 },
      { key: "balloon", label: "Pink Balloon", weight: 90, layer: item("balloon"), source: "Balloons" },
      { key: "flower", label: "Daisy", weight: 80, layer: item("flower"), source: "happy-balloon-floor" },
      { key: "ice-cream", label: "Ice Cream", weight: 70, layer: item("ice-cream"), source: "icecream-sick" },
      { key: "radio", label: "Radio", weight: 55, layer: item("radio"), source: "table-dancing" },
      { key: "paintbrush", label: "Paintbrush", weight: 45, layer: item("paintbrush"), source: "painter" },
      { key: "cake", label: "Birthday Cake", weight: 35, layer: item("cake") },
      { key: "tomato-bob", label: "Tomato Bob", weight: 30, layer: item("tomato-bob"), source: "tomato-teddy-bob" },
      { key: "peanut-butter", label: "“Peanut Butter”", weight: 24, layer: item("peanut-butter"), source: "peanut-butter" },
      { key: "gift", label: "Wrapped Gift", weight: 20, layer: item("gift") },
      { key: "butterfly-net", label: "Butterfly Net", weight: 18, layer: item("butterfly-net"), source: "butterfly-catcher" },
      { key: "barbell", label: "2-Pud Barbell", weight: 14, layer: item("barbell"), source: "strong-frog" },
      { key: "frog-plush", label: "Frog Plush", weight: 10, layer: item("frog-plush") },
      { key: "magic-wand", label: "Magic Wand", weight: 7, layer: item("magic-wand") },
      { key: "diamond", label: "Diamond", weight: 5, layer: item("diamond"), source: "plop-diamond" },
      { key: "golden-acorn", label: "Golden Acorn", weight: 2, layer: item("golden-acorn") },
    ],
  },
  {
    id: "shoes",
    label: "Shoes",
    render: "image",
    z: 2,
    layerDir: "shoes",
    values: [
      { key: "none", label: "Bare Feet", weight: 620 },
      { key: "wellies", label: "Wellies", weight: 100, layer: shoes("wellies"), source: "sitting-in-the-rain" },
      { key: "trainers", label: "Trainers", weight: 95, layer: shoes("trainers") },
      { key: "sandals", label: "Sandals", weight: 70, layer: shoes("sandals") },
      { key: "bunny-slippers", label: "Bunny Slippers", weight: 50, layer: shoes("bunny-slippers") },
      { key: "football-boots", label: "Football Boots", weight: 35, layer: shoes("football-boots") },
      { key: "roller-skates", label: "Roller Skates", weight: 22, layer: shoes("roller-skates") },
      { key: "cowboy-boots", label: "Cowboy Boots", weight: 8, layer: shoes("cowboy-boots") },
    ],
  },
  {
    id: "finish",
    label: "Finish",
    render: "overlay",
    z: 6,
    values: [
      { key: "matte", label: "Matte", weight: 820 },
      { key: "shiny", label: "Shiny", weight: 100, finishClass: "fx-shiny" },
      { key: "foil", label: "Foil", weight: 45, finishClass: "fx-foil" },
      { key: "holo", label: "Holo", weight: 22, finishClass: "fx-holo" },
      { key: "three-d", label: "3D", weight: 10, finishClass: "fx-3d" },
      { key: "rainbow", label: "Rainbow", weight: 3, finishClass: "fx-rainbow", source: "sweet-rain-dancing" },
    ],
  },
];

/** Category lookup by id. */
export const CATEGORY_BY_ID: Record<TraitCategoryId, TraitCategory> =
  Object.fromEntries(TRAIT_CATEGORIES.map((c) => [c.id, c])) as Record<
    TraitCategoryId,
    TraitCategory
  >;

/** Value lookup within a category, by value key. */
export function traitValue(
  category: TraitCategoryId,
  key: string,
): TraitValue | undefined {
  return CATEGORY_BY_ID[category].values.find((v) => v.key === key);
}

/** In-category probability of a value (weight / Σ weights). */
export function traitProbability(category: TraitCategoryId, key: string): number {
  const cat = CATEGORY_BY_ID[category];
  const total = cat.values.reduce((s, v) => s + v.weight, 0);
  const value = cat.values.find((v) => v.key === key);
  return value ? value.weight / total : 0;
}

/** Fixed PRNG seed — "MrFr". Frog #N is the same frog forever. */
export const COLLECTION_SEED = 0x4d724672;

/**
 * Build phase. The collection is built up a layer at a time: only the
 * ACTIVE_CATEGORIES vary between frogs; every other category is pinned to its
 * first value (none / matte / classic-green). COLLECTION_SIZE grows with the
 * phases — 50 while proving the loop, → 10,000 once every layer is switched on.
 */
export const ACTIVE_CATEGORIES: TraitCategoryId[] = ["background", "frogColour"];
export const COLLECTION_SIZE = 50;

/** The five playful stats every frog carries. */
export const STAT_NAMES = ["hop", "splash", "charm", "brains", "luck"] as const;
export type StatName = (typeof STAT_NAMES)[number];

export const STAT_LABELS: Record<StatName, string> = {
  hop: "Hop",
  splash: "Splash",
  charm: "Charm",
  brains: "Brains",
  luck: "Luck",
};

export interface TierDef {
  key: TierKey;
  label: string;
  /** Share of the collection — counts scale to any COLLECTION_SIZE. */
  proportion: number;
}

/** Tiers, rarest first. At size 10,000 this gives 1/99/400/1000/2500/6000. */
export const TIERS: TierDef[] = [
  { key: "one-of-one", label: "1-of-1", proportion: 0 },
  { key: "legendary", label: "Legendary", proportion: 0.0099 },
  { key: "epic", label: "Epic", proportion: 0.04 },
  { key: "rare", label: "Rare", proportion: 0.1 },
  { key: "uncommon", label: "Uncommon", proportion: 0.25 },
  { key: "common", label: "Common", proportion: 0.6 },
];

export const TIER_BY_KEY: Record<TierKey, TierDef> = Object.fromEntries(
  TIERS.map((t) => [t.key, t]),
) as Record<TierKey, TierDef>;

/** Exact per-tier counts for a collection of `size` — sums to `size`. */
export function tierCounts(size: number): Record<TierKey, number> {
  const counts = {} as Record<TierKey, number>;
  counts["one-of-one"] = size > 0 ? 1 : 0;
  let assigned = counts["one-of-one"];
  for (const t of TIERS) {
    if (t.key === "one-of-one" || t.key === "common") continue;
    const c = Math.min(
      Math.max(1, Math.round(t.proportion * size)),
      Math.max(0, size - assigned - 1),
    );
    counts[t.key] = c;
    assigned += c;
  }
  counts["common"] = Math.max(0, size - assigned);
  return counts;
}

/** The tier a 1-based rarity rank falls into, for a collection of `size`. */
export function tierForRank(rank: number, size: number): TierKey {
  const counts = tierCounts(size);
  let acc = 0;
  for (const t of TIERS) {
    acc += counts[t.key];
    if (rank <= acc) return t.key;
  }
  return "common";
}

/**
 * The hand-defined 1-of-1: Amelia the creator, as a frog. Injected as id 1
 * and forced to rank 1 by the generator. Her traits already use top-rarity
 * values, so she earns the top slot honestly.
 */
export const AMELIA_FROG = {
  id: 1,
  name: "Amelia Frog",
  traits: {
    background: "rainbow-rain",
    frogColour: "classic-green",
    outfit: "painter-smock",
    headwear: "flower-crown",
    eyewear: "star-glasses",
    heldItem: "paintbrush",
    shoes: "trainers",
    finish: "rainbow",
  },
} as const;

/** Fixed category roll order — part of the determinism contract. */
export const ROLL_ORDER: TraitCategoryId[] = [
  "background",
  "frogColour",
  "outfit",
  "headwear",
  "eyewear",
  "heldItem",
  "shoes",
  "finish",
];
