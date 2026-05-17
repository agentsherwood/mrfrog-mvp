// FrogImage — renders any collection frog by compositing its trait layers.
//
// Every frog is Mr Frog stacked from full-canvas 1024² PNG layers:
//   background · frog-base (the frog drawn wearing its outfit, tinted by
//   frog colour) · shoes · held object · eyewear · headwear · finish overlay.
// The outfit is baked into the frog-base art so it always aligns; every
// other accessory sits in its own clear zone at a fixed anchor.
//
// Background + finish fill the full tile. The character stack sits inside
// a smaller inner "character zone" so there's headroom above for hats and
// footroom below for shoes. All character layers share that zone so their
// anchors stay aligned to each other.
//
// Layers are plain <img> — never next/image — so a 10k grid can mount and
// unmount hundreds of these cheaply. Sizing comes from the parent.

import { traitValue } from "../data/collection-traits";
import type { FrogTraits } from "../lib/collection/types";

interface FrogImageProps {
  traits: FrogTraits;
  /** Extra classes on the square wrapper (sizing, rounding, etc.). */
  className?: string;
  /** Eager-load layers (detail view); grid thumbnails stay lazy. */
  priority?: boolean;
  /** Render the animated finish overlay (default true). */
  showFinish?: boolean;
}

function Layer({
  src,
  filter,
  priority,
}: {
  src: string;
  filter?: string;
  priority?: boolean;
}) {
  return (
    <img
      src={src}
      alt=""
      draggable={false}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className="pointer-events-none absolute inset-0 h-full w-full select-none object-contain"
      style={filter ? { filter } : undefined}
    />
  );
}

// Character zone — where the frog body and every accessory live, expressed
// as inset percentages of the surrounding tile. Background paints the scene
// behind this zone; finish glints in front of the whole tile.
export const CHARACTER_ZONE = {
  top: "13%", // headroom for hats / crowns / antennae
  bottom: "5%", // footroom for shoes / boots
  left: "8%",
  right: "8%",
} as const;

// Mystery silhouette — the un-owned placeholder. Renders the canonical frog
// shape inside the same character zone so when it flips to owned there's no
// jump in position or scale. The "?" overlay is the caller's job so each
// surface can size it to its own tile.
export function MysteryFrog() {
  return (
    <div className="pointer-events-none absolute" style={CHARACTER_ZONE} aria-hidden>
      <img
        src="/collection/layers/frog/none.png"
        alt=""
        draggable={false}
        decoding="async"
        className="pointer-events-none absolute inset-0 h-full w-full select-none object-contain"
        style={{ filter: "grayscale(1) brightness(0)", opacity: 0.12 }}
      />
    </div>
  );
}

export default function FrogImage({
  traits,
  className = "",
  priority = false,
  showFinish = true,
}: FrogImageProps) {
  const background = traitValue("background", traits.background);
  const outfit = traitValue("outfit", traits.outfit); // the frog-base layer
  const frogColour = traitValue("frogColour", traits.frogColour);
  const shoes = traitValue("shoes", traits.shoes);
  const heldItem = traitValue("heldItem", traits.heldItem);
  const eyewear = traitValue("eyewear", traits.eyewear);
  const headwear = traitValue("headwear", traits.headwear);
  const borderTrait = traitValue("border", traits.border);
  const finish = traitValue("finish", traits.finish);

  return (
    <div
      className={`relative aspect-square overflow-hidden ${className}`}
      aria-hidden
    >
      {background?.layer && <Layer src={background.layer} priority={priority} />}
      <div className="pointer-events-none absolute" style={CHARACTER_ZONE}>
        {outfit?.layer && (
          <Layer
            src={outfit.layer}
            filter={frogColour?.filter}
            priority={priority}
          />
        )}
        {shoes?.layer && <Layer src={shoes.layer} priority={priority} />}
        {heldItem?.layer && <Layer src={heldItem.layer} priority={priority} />}
        {eyewear?.layer && <Layer src={eyewear.layer} priority={priority} />}
        {headwear?.layer && <Layer src={headwear.layer} priority={priority} />}
      </div>
      {borderTrait?.layer && <Layer src={borderTrait.layer} priority={priority} />}
      {showFinish && finish?.finishClass && (
        <div className={`fx-layer ${finish.finishClass}`} />
      )}
    </div>
  );
}
