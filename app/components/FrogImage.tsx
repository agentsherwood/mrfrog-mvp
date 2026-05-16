// FrogImage — renders any collection frog by compositing its trait layers.
//
// Every frog is Mr Frog stacked from full-canvas 1024² PNG layers:
//   background · frog body (tinted by body colour) · outfit · held item ·
//   headwear · effect overlay (animated CSS, see globals.css `.fx-*`).
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
  /** Render the animated effect overlay (default true). */
  showEffect?: boolean;
}

function Layer({
  src,
  alt,
  filter,
  priority,
}: {
  src: string;
  alt: string;
  filter?: string;
  priority?: boolean;
}) {
  return (
    <img
      src={src}
      alt={alt}
      draggable={false}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className="pointer-events-none absolute inset-0 h-full w-full select-none object-contain"
      style={filter ? { filter } : undefined}
    />
  );
}

export default function FrogImage({
  traits,
  className = "",
  priority = false,
  showEffect = true,
}: FrogImageProps) {
  const background = traitValue("background", traits.background);
  const frog = traitValue("expression", traits.expression);
  const bodyColour = traitValue("bodyColour", traits.bodyColour);
  const outfit = traitValue("outfit", traits.outfit);
  const heldItem = traitValue("heldItem", traits.heldItem);
  const headwear = traitValue("headwear", traits.headwear);
  const effect = traitValue("effect", traits.effect);

  return (
    <div
      className={`relative aspect-square overflow-hidden ${className}`}
      aria-hidden
    >
      {background?.layer && (
        <Layer src={background.layer} alt="" priority={priority} />
      )}
      {frog?.layer && (
        <Layer
          src={frog.layer}
          alt=""
          filter={bodyColour?.filter}
          priority={priority}
        />
      )}
      {outfit?.layer && (
        <Layer src={outfit.layer} alt="" priority={priority} />
      )}
      {heldItem?.layer && (
        <Layer src={heldItem.layer} alt="" priority={priority} />
      )}
      {headwear?.layer && (
        <Layer src={headwear.layer} alt="" priority={priority} />
      )}
      {showEffect && effect?.effectClass && (
        <div className={`fx-layer ${effect.effectClass}`} />
      )}
    </div>
  );
}
