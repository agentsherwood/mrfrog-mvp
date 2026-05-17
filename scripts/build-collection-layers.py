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
PHASE = ["background", "frog", "headwear", "shoes"]

# --- canonical anchors (derived from the candidate-1 base plate) -----------
# The raw canonical PNG fills the canvas right to y=0 — eye bumps touch the
# top edge — so there's no room to stack a hat above. The build inserts a
# top pad of FROG_TOP_PAD by scaling the canonical down to (CANVAS - PAD)
# tall and centring horizontally. Every accessory layer references the
# *post-pad* frog coordinates so anchors line up.
FROG_TOP_PAD = 220
FROG_INNER_H = CANVAS - FROG_TOP_PAD  # the height the canonical lives in

EYE_BOX = (286, FROG_TOP_PAD + 100, 738, FROG_TOP_PAD + 270)
HAND_BOX = (96, FROG_TOP_PAD + 380, 452, FROG_TOP_PAD + 680)
SHOE_BOX = (250, FROG_TOP_PAD + 680, 776, CANVAS - 8)

# Per-piece headwear placement, after a lot of visual iteration.
# Frog anatomy after FROG_TOP_PAD=220:
#   y=0..220   clear sky (the hat zone)
#   y=220..360 eye bumps (front face has the smile-crescent eye drawings)
#   y=360..540 head face / mouth
#   y=540..760 body
# Rules:
#   - max_w / max_h are the largest the trimmed art may be (aspect preserved)
#   - anchor_y is an offset FROM FROG_TOP_PAD: hat bottom sits at
#     FROG_TOP_PAD + anchor_y, so anchor_y=40 puts the brim at canvas y=260
#     (just above the eye bumps' front face)
#   - dx is a horizontal nudge from canvas centre
# Default intent: hat brim rests on the head crown, just above the eye
# crescent drawings, with the hat extending UP. Exceptions: headphones
# wrap around the head with the cups at "ear" level on the sides of the
# face; the astronaut helmet swallows the whole head.
# Foot line (canvas y where the shoe sole rests on the ground). The scaled
# canonical's feet bottom land at canvas y ≈ 1023 — so the sole-to-ground
# line sits just above that.
FOOT_LINE_Y = 1018

# Per-piece shoe placement. Shoes are now drawn top-down with toes
# pointing toward the viewer (a pair side-by-side, foot openings at the
# top of the image). Sized so the pair covers the frog's feet zone
# without extending up into the body: width sits inside the foot-splay
# span, height stays in the leg / feet region. max_w / max_h preserve
# aspect; bottom anchors at FOOT_LINE_Y.
SHOES_PLACEMENT: dict[str, dict] = {
    "wellies":        {"max_w": 380, "max_h": 320, "dx": 0},
    "trainers":       {"max_w": 420, "max_h": 320, "dx": 0},
    "sandals":        {"max_w": 420, "max_h": 320, "dx": 0},
    "bunny-slippers": {"max_w": 420, "max_h": 320, "dx": 0},
    "football-boots": {"max_w": 420, "max_h": 320, "dx": 0},
    "roller-skates":  {"max_w": 420, "max_h": 320, "dx": 0},
    "cowboy-boots":   {"max_w": 360, "max_h": 320, "dx": 0},
}

HEADWEAR_PLACEMENT: dict[str, dict] = {
    "party-hat":        {"max_w": 320, "max_h": 240, "anchor_y":  40, "dx": 0},
    "beanie":           {"max_w": 420, "max_h": 240, "anchor_y":  40, "dx": 0},
    "flower-crown":     {"max_w": 540, "max_h": 200, "anchor_y":  50, "dx": 0},
    "chef-hat":         {"max_w": 360, "max_h": 280, "anchor_y":  40, "dx": 0},
    "sailor-cap":       {"max_w": 460, "max_h": 220, "anchor_y":  70, "dx": 0},
    "top-hat":          {"max_w": 440, "max_h": 300, "anchor_y":  40, "dx": 0},
    "pirate-hat":       {"max_w": 620, "max_h": 260, "anchor_y":  60, "dx": 0},
    "birthday-12":      {"max_w": 360, "max_h": 280, "anchor_y":  40, "dx": 0},
    "astronaut-helmet": {"max_w": 720, "max_h": 700, "anchor_y": 480, "dx": 0},
    "crown":            {"max_w": 420, "max_h": 220, "anchor_y":  60, "dx": 0},
}

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
            "top-hat", "pirate-hat", "birthday-12",
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


def _make_helmet_bubble_translucent(art: Image.Image) -> Image.Image:
    """Reduce alpha on the top portion of an astronaut-helmet trim so the
    bubble becomes a glass dome — the frog's face shows through. The
    collar (bottom portion of the trim) stays opaque.
    """
    bb = art.getbbox()
    if not bb:
        return art
    # The bubble is ~ the top 62% of the helmet trim; collar is the rest.
    split_y = bb[1] + int((bb[3] - bb[1]) * 0.62)
    bubble = art.crop((0, 0, art.width, split_y))
    collar = art.crop((0, split_y, art.width, art.height))
    r, g, b, a = bubble.split()
    # Drop bubble alpha to ~40% — still tinted, but the face reads through.
    a = a.point(lambda p: int(p * 0.40))
    bubble = Image.merge("RGBA", (r, g, b, a))
    out = Image.new("RGBA", art.size, (0, 0, 0, 0))
    out.paste(bubble, (0, 0))
    out.paste(collar, (0, split_y))
    return out


# Headwear pieces that get post-trim alpha tweaks before placement.
HEADWEAR_TRIM_TRANSFORMS = {
    "astronaut-helmet": _make_helmet_bubble_translucent,
}


def place_on_feet(src: Path, key: str) -> Image.Image:
    """Place a shoe-pair so its BOTTOM sits at FOOT_LINE_Y, extending up.

    max_w/max_h are the largest the trimmed art may be (aspect preserved).
    dx shifts horizontally from canvas centre.
    """
    spec = SHOES_PLACEMENT[key]
    art = trimmed(src)
    scale = min(spec["max_w"] / art.width, spec["max_h"] / art.height)
    new_w = max(1, round(art.width * scale))
    new_h = max(1, round(art.height * scale))
    art = art.resize((new_w, new_h), Image.LANCZOS)
    canvas = blank()
    x = (CANVAS - new_w) // 2 + spec.get("dx", 0)
    y = FOOT_LINE_Y - new_h
    canvas.alpha_composite(art, (x, y))
    return canvas


def place_on_head(src: Path, key: str) -> Image.Image:
    """Place a hat by its per-piece spec in HEADWEAR_PLACEMENT.

    Each hat sits with its BOTTOM at FROG_TOP_PAD + anchor_y, extending up.
    max_w/max_h are the largest the trimmed art may be (aspect preserved).
    dx shifts the hat horizontally from centre.
    """
    spec = HEADWEAR_PLACEMENT[key]
    art = trimmed(src)
    transform = HEADWEAR_TRIM_TRANSFORMS.get(key)
    if transform is not None:
        art = transform(art)
    scale = min(spec["max_w"] / art.width, spec["max_h"] / art.height)
    new_w = max(1, round(art.width * scale))
    new_h = max(1, round(art.height * scale))
    art = art.resize((new_w, new_h), Image.LANCZOS)
    canvas = blank()
    x = (CANVAS - new_w) // 2 + spec.get("dx", 0)
    y = FROG_TOP_PAD + spec["anchor_y"] - new_h
    canvas.alpha_composite(art, (x, y))
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
    """Place the canonical (or any outfit variant) below the FROG_TOP_PAD line.

    The raw plate is scaled so its full height fits in CANVAS - FROG_TOP_PAD,
    then centred horizontally and offset down by FROG_TOP_PAD. That gives
    the accessory zone above the frog the room to hold a hat without
    clipping at the canvas top edge.
    """
    img = Image.open(src).convert("RGBA")
    if img.size != (CANVAS, CANVAS):
        img = img.resize((CANVAS, CANVAS), Image.LANCZOS)
    scale = FROG_INNER_H / CANVAS
    new_w = max(1, round(CANVAS * scale))
    new_h = max(1, round(CANVAS * scale))
    inner = img.resize((new_w, new_h), Image.LANCZOS)
    canvas = blank()
    x = (CANVAS - new_w) // 2
    y = FROG_TOP_PAD
    canvas.alpha_composite(inner, (x, y))
    return canvas


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
                save(place_on_head(src, key), "headwear", key)
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
                save(place_on_feet(src, key), "shoes", key)
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
