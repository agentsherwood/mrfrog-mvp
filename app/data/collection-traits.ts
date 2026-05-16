// The Mr Frog Collection — trait spec & rarity model (machine-readable).
// Twin of brain2/Projects/MrFrog/MrFrog-Collection-spec.md. Single source of
// truth for the compositor (2291), the art pipeline (2295), the pages (2292)
// and the packs (2293). See the spec doc for the reasoning behind every number.

export type TraitCategoryId =
  | "background"
  | "bodyColour"
  | "expression"
  | "outfit"
  | "heldItem"
  | "headwear"
  | "effect";

export type TierKey =
  | "one-of-one"
  | "legendary"
  | "epic"
  | "rare"
  | "uncommon"
  | "common";

/** How a category turns into pixels. */
export type RenderKind = "image" | "filter" | "overlay";

export interface TraitValue {
  /** Stable kebab-case id — never changes once minted. */
  key: string;
  /** Display name. */
  label: string;
  /** Drop weight; probability = weight / Σ weights of the category. */
  weight: number;
  /** Public URL of the 1024² PNG layer (image categories; omitted for "none"). */
  layer?: string;
  /** CSS `filter` string (bodyColour category only; omitted = no filter). */
  filter?: string;
  /** CSS class applied for the effect overlay (effect category only). */
  effectClass?: string;
  /** Slug of the Amelia drawing this value derives from, if any. */
  source?: string;
}

export interface TraitCategory {
  id: TraitCategoryId;
  label: string;
  render: RenderKind;
  /** Composite stacking order — low draws first (behind). */
  z: number;
  /** Folder under public/collection/layers (image categories only). */
  layerDir?: string;
  values: TraitValue[];
}

/** Where every image layer lives — the real-art swap (2295) is drop-in here. */
export const LAYER_BASE = "/collection/layers";

const bg = (k: string) => `${LAYER_BASE}/background/${k}.png`;
const frog = (k: string) => `${LAYER_BASE}/frog/${k}.png`;
const outfit = (k: string) => `${LAYER_BASE}/outfit/${k}.png`;
const item = (k: string) => `${LAYER_BASE}/held-item/${k}.png`;
const hat = (k: string) => `${LAYER_BASE}/headwear/${k}.png`;

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
    id: "bodyColour",
    label: "Body Colour",
    render: "filter",
    z: 1, // applied to the frog layer; not a layer of its own
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
    id: "expression",
    label: "Expression",
    render: "image",
    z: 1,
    layerDir: "frog",
    values: [
      { key: "happy", label: "Happy", weight: 330, layer: frog("happy"), source: "happy" },
      { key: "calm", label: "Calm", weight: 250, layer: frog("calm"), source: "front-neutral" },
      { key: "cheeky", label: "Cheeky", weight: 150, layer: frog("cheeky"), source: "table-dancing" },
      { key: "surprised", label: "Surprised", weight: 110, layer: frog("surprised"), source: "surprised" },
      { key: "excited", label: "Excited", weight: 85, layer: frog("excited"), source: "sweet-rain-dancing" },
      { key: "sad", label: "Sad", weight: 45, layer: frog("sad"), source: "sitting-in-the-rain" },
      { key: "sleepy", label: "Sleepy", weight: 20, layer: frog("sleepy"), source: "which-dream" },
      { key: "crying", label: "Crying", weight: 10, layer: frog("crying"), source: "egg-in-the-eye" },
    ],
  },
  {
    id: "outfit",
    label: "Outfit",
    render: "image",
    z: 2,
    layerDir: "outfit",
    values: [
      { key: "none", label: "No Outfit", weight: 560 },
      { key: "raincoat", label: "Yellow Raincoat", weight: 95, layer: outfit("raincoat"), source: "sitting-in-the-rain" },
      { key: "painter-smock", label: "Painter's Smock", weight: 80, layer: outfit("painter-smock"), source: "painter" },
      { key: "chef-apron", label: "Chef's Apron", weight: 70, layer: outfit("chef-apron"), source: "hungry-pie" },
      { key: "pyjamas", label: "Cosy Pyjamas", weight: 55, layer: outfit("pyjamas"), source: "kids-sleepover" },
      { key: "tutu", label: "Ballet Tutu", weight: 45, layer: outfit("tutu"), source: "dancing-waves" },
      { key: "sailor", label: "Sailor Suit", weight: 35, layer: outfit("sailor"), source: "lost-at-sea" },
      { key: "strongman", label: "Strongman Singlet", weight: 25, layer: outfit("strongman"), source: "strong-frog" },
      { key: "wedding-suit", label: "Wedding Suit", weight: 18, layer: outfit("wedding-suit"), source: "lovely-children" },
      { key: "superhero", label: "Superhero Cape", weight: 10, layer: outfit("superhero") },
      { key: "astronaut-suit", label: "Astronaut Suit", weight: 6, layer: outfit("astronaut-suit"), source: "space-frog" },
      { key: "among-us", label: "Among Us Suit", weight: 1, layer: outfit("among-us"), source: "inside-and-among-us" },
    ],
  },
  {
    id: "heldItem",
    label: "Held Item",
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
    id: "headwear",
    label: "Headwear",
    render: "image",
    z: 4,
    layerDir: "headwear",
    values: [
      { key: "none", label: "Bare Head", weight: 540 },
      { key: "party-hat", label: "Party Hat", weight: 105, layer: hat("party-hat") },
      { key: "beanie", label: "Bobble Beanie", weight: 90, layer: hat("beanie") },
      { key: "flower-crown", label: "Flower Crown", weight: 70, layer: hat("flower-crown") },
      { key: "chef-hat", label: "Chef's Hat", weight: 55, layer: hat("chef-hat"), source: "hungry-pie" },
      { key: "sailor-cap", label: "Sailor Cap", weight: 45, layer: hat("sailor-cap"), source: "lost-at-sea" },
      { key: "top-hat", label: "Top Hat", weight: 35, layer: hat("top-hat"), source: "lovely-children" },
      { key: "headphones", label: "Headphones", weight: 25, layer: hat("headphones"), source: "table-dancing" },
      { key: "pirate-hat", label: "Pirate Hat", weight: 16, layer: hat("pirate-hat") },
      { key: "birthday-12", label: "Birthday “12” Hat", weight: 12, layer: hat("birthday-12") },
      { key: "astronaut-helmet", label: "Astronaut Helmet", weight: 8, layer: hat("astronaut-helmet"), source: "space-frog" },
      { key: "crown", label: "Golden Crown", weight: 4, layer: hat("crown") },
    ],
  },
  {
    id: "effect",
    label: "Effect",
    render: "overlay",
    z: 5,
    values: [
      { key: "none", label: "No Effect", weight: 880 },
      { key: "sparkle", label: "Sparkle", weight: 60, effectClass: "fx-sparkle" },
      { key: "glimmer", label: "Glimmer", weight: 30, effectClass: "fx-glimmer" },
      { key: "foil", label: "Foil", weight: 18, effectClass: "fx-foil" },
      { key: "holo", label: "Holo", weight: 9, effectClass: "fx-holo" },
      { key: "rainbow", label: "Rainbow Rain", weight: 3, effectClass: "fx-rainbow", source: "sweet-rain-dancing" },
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

/** Number of frogs minted. */
export const COLLECTION_SIZE = 10_000;

export interface TierDef {
  key: TierKey;
  label: string;
  /** Inclusive rank range [from, to]; 1 = rarest. */
  from: number;
  to: number;
  count: number;
}

/** Tiers as rank slices — target counts are hit exactly by construction. */
export const TIERS: TierDef[] = [
  { key: "one-of-one", label: "1-of-1", from: 1, to: 1, count: 1 },
  { key: "legendary", label: "Legendary", from: 2, to: 100, count: 99 },
  { key: "epic", label: "Epic", from: 101, to: 500, count: 400 },
  { key: "rare", label: "Rare", from: 501, to: 1_500, count: 1_000 },
  { key: "uncommon", label: "Uncommon", from: 1_501, to: 4_000, count: 2_500 },
  { key: "common", label: "Common", from: 4_001, to: 10_000, count: 6_000 },
];

/** The tier a 1-based rarity rank falls into. */
export function tierForRank(rank: number): TierKey {
  for (const t of TIERS) {
    if (rank >= t.from && rank <= t.to) return t.key;
  }
  return "common";
}

export const TIER_BY_KEY: Record<TierKey, TierDef> = Object.fromEntries(
  TIERS.map((t) => [t.key, t]),
) as Record<TierKey, TierDef>;

/**
 * The hand-defined 1-of-1: Amelia the creator. Injected as id 1 and forced
 * to rank 1 by the generator. Her traits already use top-rarity values.
 */
export const AMELIA_FROG = {
  id: 1,
  name: "Amelia Frog",
  traits: {
    background: "rainbow-rain",
    bodyColour: "classic-green",
    expression: "excited",
    outfit: "none",
    heldItem: "paintbrush",
    headwear: "flower-crown",
    effect: "rainbow",
  },
} as const;

/** Fixed category roll order — part of the determinism contract. */
export const ROLL_ORDER: TraitCategoryId[] = [
  "background",
  "bodyColour",
  "expression",
  "outfit",
  "heldItem",
  "headwear",
  "effect",
];
