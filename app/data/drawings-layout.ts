import type { Original } from "./originals";

export type TileSize = "s" | "m" | "t" | "l";

export type Tile = { original: Original; span: string };

/**
 * Per-arc bespoke layouts. Each arc is its own mini-grid sized to
 * its narrative: the wedding dominates the sleepover arc, sweet-rain
 * is the full-width hero for rainbow-rain, etc.
 */
export const arcLayouts: Record<
  string,
  { gridCols: string; rowHeight: string; tiles: Record<string, string> }
> = {
  eggs: {
    gridCols: "grid-cols-3",
    rowHeight: "auto-rows-[180px] sm:auto-rows-[220px]",
    tiles: {
      "egg-in-the-eye-part-1": "",
      "egg-in-the-eye-part-3": "",
      "egg-in-the-eye": "",
    },
  },
  bacon: {
    gridCols: "grid-cols-2",
    rowHeight: "auto-rows-[200px] sm:auto-rows-[260px]",
    tiles: {
      "where-does-bacon-come-from": "",
      "which-dream": "",
    },
  },
  table: {
    gridCols: "grid-cols-2",
    rowHeight: "auto-rows-[200px] sm:auto-rows-[260px]",
    tiles: {
      "table-dancing": "",
      "table-dancing-part-2": "",
    },
  },
  sleepover: {
    gridCols: "grid-cols-2 sm:grid-cols-3",
    rowHeight: "auto-rows-[180px] sm:auto-rows-[200px]",
    tiles: {
      "lovely-children": "col-span-2 row-span-2 sm:col-span-2",
      "play-with-the-kids": "col-span-1",
      "kids-sleepover": "col-span-1",
    },
  },
  "rainbow-rain": {
    gridCols: "grid-cols-1",
    rowHeight: "auto-rows-[280px] sm:auto-rows-[360px]",
    tiles: {
      "sweet-rain-dancing": "",
    },
  },
};

/**
 * Standalones (the "More from Mr Frog's world" pool) laid out as a
 * dense Pinterest masonry. Size mix intentionally varied.
 */
export const standaloneSizes: Record<string, TileSize> = {
  Balloons: "m",
  "space-frog": "l",
  "tomato-teddy-bob": "l",
  "audience-musical": "m",
  painter: "m",
  "butterfly-catcher": "t",
  "washing-machine": "t",
  "hungry-pie": "m",
  "icecream-sick": "m",
  "dissapointed-dancing": "m",
  "plop-diamond": "m",
  "lost-at-sea": "m",
  "happy-balloon-floor": "s",
  "dancing-waves": "s",
  "chair-sauce": "s",
  "peanut-butter": "s",
  "strong-frog": "s",
  "sitting-in-the-rain": "s",
  "jail-tomato": "s",
  "inside-and-among-us": "s",
};

export const sizeToSpan: Record<TileSize, string> = {
  s: "col-span-1 row-span-1",
  m: "col-span-2 row-span-1",
  t: "col-span-1 row-span-2",
  l: "col-span-2 row-span-2",
};

export const arcIcon: Record<string, { src: string; alt: string }> = {
  eggs: { src: "/elements/emotion/quest.png", alt: "question" },
  bacon: { src: "/elements/everyday/rainbow-drops.png", alt: "rainbow drops" },
  table: { src: "/elements/everyday/radio.png", alt: "radio" },
  sleepover: { src: "/elements/emotion/heart-burst.png", alt: "heart" },
  "rainbow-rain": { src: "/elements/nature/rainbow.png", alt: "rainbow" },
  more: { src: "/elements/emotion/sparkle.png", alt: "sparkle" },
};
