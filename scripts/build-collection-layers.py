#!/usr/bin/env python3
"""Compose the Mr Frog Collection trait layers (task 2295).

Builds the deployed layers under public/collection/layers/ from generated raw
art + the existing sprite library, normalising everything onto one 1024²
canvas so the FrogImage compositor just stacks them.

The collection is built up a layer at a time — PHASE lists which layer groups
are switched on right now. Extend it as each layer is proven and added.

Run from the mrfrog-mvp repo root:
    ../../../.venv/bin/python3 scripts/build-collection-layers.py
"""

from __future__ import annotations

import shutil
from pathlib import Path

from PIL import Image

REPO = Path(__file__).resolve().parent.parent
PUBLIC = REPO / "public"
RAW = REPO / "source-assets" / "collection-raw"
BASE_PLATE = REPO / "source-assets" / "collection-base" / "frog-base.png"
OUT = PUBLIC / "collection" / "layers"
CANVAS = 1024

# --- which layer groups are switched on (incremental build) ----------------
PHASE = ["background", "frog"]

# --- canonical anchors (derived from the base plate) -----------------------
HEAD_BOX = (300, 2, 724, 322)
EYE_BOX = (286, 150, 738, 356)
HAND_BOX = (96, 486, 452, 862)
SHOE_BOX = (250, 836, 776, 1014)

FROG_KEYS = ["none", "raincoat", "painter-smock", "chef-apron", "pyjamas",
             "tutu", "sailor", "strongman", "wedding-suit", "superhero",
             "astronaut-suit", "among-us"]
HELD_SPRITE = {
    "balloon": PUBLIC / "elements/everyday/balloon.png",
    "flower": PUBLIC / "elements/nature/daisy-yellow.png",
    "ice-cream": PUBLIC / "elements/everyday/ice-cream.png",
    "radio": PUBLIC / "elements/everyday/radio.png",
    "paintbrush": PUBLIC / "elements/everyday/paintbrush.png",
    "cake": PUBLIC / "elements/celebration/cake.png",
    "tomato-bob": PUBLIC / "elements/everyday/tomato-bob.png",
    "peanut-butter": PUBLIC / "elements/everyday/peanut-butter.png",
    "gift": PUBLIC / "elements/celebration/gift-pink.png",
}
HELD_GENERATED = ["butterfly-net", "barbell", "frog-plush", "magic-wand",
                  "diamond", "golden-acorn"]
BACKGROUNDS = ["notebook", "pond", "farmyard", "sunset", "kitchen", "stage",
               "night-sky", "rainbow-rain", "underwater", "outer-space"]
HEADWEAR = ["party-hat", "beanie", "flower-crown", "chef-hat", "sailor-cap",
            "top-hat", "headphones", "pirate-hat", "birthday-12",
            "astronaut-helmet", "crown"]
EYEWEAR = ["round-glasses", "sunglasses", "nerd-glasses", "swim-goggles",
           "heart-glasses", "star-glasses", "monocle"]
SHOES = ["wellies", "trainers", "sandals", "bunny-slippers", "football-boots",
         "roller-skates", "cowboy-boots"]


def trimmed(src: Path) -> Image.Image:
    img = Image.open(src).convert("RGBA")
    bbox = img.getbbox()
    return img.crop(bbox) if bbox else img


def blank() -> Image.Image:
    return Image.new("RGBA", (CANVAS, CANVAS), (0, 0, 0, 0))


def save(img: Image.Image, category: str, key: str) -> None:
    folder = OUT / category
    folder.mkdir(parents=True, exist_ok=True)
    img.save(folder / f"{key}.png")


def place_in_box(src: Path, box: tuple[int, int, int, int]) -> Image.Image:
    art = trimmed(src)
    bw, bh = box[2] - box[0], box[3] - box[1]
    scale = min(bw / art.width, bh / art.height)
    art = art.resize((max(1, round(art.width * scale)),
                      max(1, round(art.height * scale))), Image.LANCZOS)
    canvas = blank()
    canvas.alpha_composite(art, (box[0] + (bw - art.width) // 2,
                                 box[1] + (bh - art.height) // 2))
    return canvas


def place_background(src: Path) -> Image.Image:
    img = Image.open(src).convert("RGBA")
    scale = max(CANVAS / img.width, CANVAS / img.height)
    img = img.resize((round(img.width * scale), round(img.height * scale)),
                     Image.LANCZOS)
    left, top = (img.width - CANVAS) // 2, (img.height - CANVAS) // 2
    img = img.crop((left, top, left + CANVAS, top + CANVAS))
    flat = Image.new("RGBA", (CANVAS, CANVAS), (250, 246, 236, 255))
    flat.alpha_composite(img)
    return flat


def canonical_copy(src: Path) -> Image.Image:
    img = Image.open(src).convert("RGBA")
    return img if img.size == (CANVAS, CANVAS) else img.resize((CANVAS, CANVAS), Image.LANCZOS)


def main() -> int:
    if OUT.exists():
        shutil.rmtree(OUT)
    built, missing = 0, []

    if "background" in PHASE:
        for key in BACKGROUNDS:
            src = RAW / "background" / f"{key}.png"
            if not src.exists():
                missing.append(f"background/{key}")
                continue
            save(place_background(src), "background", key)
            built += 1

    if "frog" in PHASE:
        # none = the canonical base plate; outfits = edited plates (when present)
        if BASE_PLATE.exists():
            save(canonical_copy(BASE_PLATE), "frog", "none")
            built += 1
        else:
            missing.append("frog/none")
        for key in FROG_KEYS[1:]:
            src = RAW / "frog" / f"{key}.png"
            if src.exists():
                save(canonical_copy(src), "frog", key)
                built += 1

    if "headwear" in PHASE:
        for key in HEADWEAR:
            src = RAW / "headwear" / f"{key}.png"
            if src.exists():
                save(place_in_box(src, HEAD_BOX), "headwear", key)
                built += 1
            else:
                missing.append(f"headwear/{key}")

    if "eyewear" in PHASE:
        for key in EYEWEAR:
            src = RAW / "eyewear" / f"{key}.png"
            if src.exists():
                save(place_in_box(src, EYE_BOX), "eyewear", key)
                built += 1
            else:
                missing.append(f"eyewear/{key}")

    if "shoes" in PHASE:
        for key in SHOES:
            src = RAW / "shoes" / f"{key}.png"
            if src.exists():
                save(place_in_box(src, SHOE_BOX), "shoes", key)
                built += 1
            else:
                missing.append(f"shoes/{key}")

    if "held-item" in PHASE:
        for key, src in HELD_SPRITE.items():
            save(place_in_box(src, HAND_BOX), "held-item", key)
            built += 1
        for key in HELD_GENERATED:
            src = RAW / "held-item" / f"{key}.png"
            if src.exists():
                save(place_in_box(src, HAND_BOX), "held-item", key)
                built += 1
            else:
                missing.append(f"held-item/{key}")

    print(f"✓ built {built} layers → public/collection/layers/  (phase: {', '.join(PHASE)})")
    if missing:
        print(f"  not yet generated ({len(missing)}): {', '.join(missing)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
