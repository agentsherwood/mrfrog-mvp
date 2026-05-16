#!/usr/bin/env python3
"""Generate placeholder trait-layer art for the Mr Frog Collection (task 2291).

Every trait value gets a 1024x1024 transparent PNG under
public/collection/layers/<category>/<key>.png. The compositor just stacks
these — no positioning maths — so each layer has its art pre-placed on the
canvas. Real OpenAI art (task 2295) is a drop-in replacement: same paths.

Placeholders reuse the existing 124-sprite library for the frog body and
many held items (so the test build already shows real frogs), and draw
simple labelled shapes for outfits / headwear / themed backgrounds.

Run from the mrfrog-mvp repo root:
    npm run collection:layers
    ../../../.venv/bin/python3 scripts/gen-placeholder-layers.py
"""

from __future__ import annotations

import hashlib
import colorsys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

REPO = Path(__file__).resolve().parent.parent
PUBLIC = REPO / "public"
OUT = PUBLIC / "collection" / "layers"
CANVAS = 1024

# --- canonical layout anchors (see brain2 MrFrog-Collection-spec.md §7) -----
FROG_H = 880          # frog target height
FROG_BOTTOM = 1000    # frog feet baseline
HEAD_BOX = (372, 95, 652, 335)     # headwear anchor
TORSO_BOX = (320, 470, 704, 880)   # outfit anchor
HAND_BOX = (140, 560, 470, 910)    # held-item anchor

# --- trait values, mirrored from app/data/collection-traits.ts -------------
BACKGROUNDS = {
    "notebook": "#faf6ec", "pond": "#bfe0c8", "farmyard": "#d4e3a4",
    "sunset": "#f6c79a", "kitchen": "#f0d8b6", "stage": "#6d5d8c",
    "night-sky": "#2e3a5c", "rainbow-rain": "#dbe9f2", "underwater": "#8fc7d6",
    "outer-space": "#191730",
}
EXPRESSIONS = {
    "happy": "character-ref/mr-frog/happy.png",
    "calm": "character-ref/mr-frog/front-neutral.png",
    "cheeky": "character-ref/mr-frog/front-34.png",
    "surprised": "character-ref/mr-frog/surprised.png",
    "excited": "character-ref/mr-frog/poses/jump.png",
    "sad": "character-ref/mr-frog/sad.png",
    "sleepy": "character-ref/mr-frog/poses/sleep.png",
    "crying": "character-ref/mr-frog/poses/cry.png",
}
OUTFITS = [
    "raincoat", "painter-smock", "chef-apron", "pyjamas", "tutu", "sailor",
    "strongman", "wedding-suit", "superhero", "astronaut-suit", "among-us",
]
HEADWEAR_SPRITE = {
    "party-hat": "elements/celebration/hat-striped.png",
    "birthday-12": "elements/celebration/number-12.png",
}
HEADWEAR = [
    "party-hat", "beanie", "flower-crown", "chef-hat", "sailor-cap",
    "top-hat", "headphones", "pirate-hat", "birthday-12",
    "astronaut-helmet", "crown",
]
HELD_SPRITE = {
    "balloon": "elements/everyday/balloon.png",
    "flower": "elements/nature/daisy-yellow.png",
    "ice-cream": "elements/everyday/ice-cream.png",
    "radio": "elements/everyday/radio.png",
    "paintbrush": "elements/everyday/paintbrush.png",
    "cake": "elements/celebration/cake.png",
    "tomato-bob": "elements/everyday/tomato-bob.png",
    "peanut-butter": "elements/everyday/peanut-butter.png",
    "gift": "elements/celebration/gift-pink.png",
}
HELD = list(HELD_SPRITE) + [
    "butterfly-net", "barbell", "frog-plush", "magic-wand", "diamond",
    "golden-acorn",
]


def hashed_colour(key: str) -> tuple[int, int, int]:
    """Stable, well-spread placeholder colour from a trait key."""
    h = int(hashlib.md5(key.encode()).hexdigest(), 16)
    hue = (h % 360) / 360
    r, g, b = colorsys.hls_to_rgb(hue, 0.62, 0.58)
    return int(r * 255), int(g * 255), int(b * 255)


def hex_rgb(value: str) -> tuple[int, int, int]:
    value = value.lstrip("#")
    return tuple(int(value[i : i + 2], 16) for i in (0, 2, 4))  # type: ignore


def load_font(size: int) -> ImageFont.ImageFont:
    for path in (
        "/System/Library/Fonts/Supplemental/Comic Sans MS.ttf",
        "/System/Library/Fonts/Supplemental/Arial Rounded Bold.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
    ):
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def fit_sprite(src: Path, max_w: int, max_h: int) -> Image.Image:
    """Open a sprite, trim transparent margin, scale to fit a box."""
    img = Image.open(src).convert("RGBA")
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
    scale = min(max_w / img.width, max_h / img.height)
    return img.resize(
        (max(1, round(img.width * scale)), max(1, round(img.height * scale))),
        Image.LANCZOS,
    )


def blank() -> Image.Image:
    return Image.new("RGBA", (CANVAS, CANVAS), (0, 0, 0, 0))


def save(img: Image.Image, category: str, key: str) -> None:
    folder = OUT / category
    folder.mkdir(parents=True, exist_ok=True)
    img.save(folder / f"{key}.png")


def label(draw: ImageDraw.ImageDraw, box, text: str, fill=(255, 255, 255, 235)) -> None:
    font = load_font(46)
    cx = (box[0] + box[2]) // 2
    cy = (box[1] + box[3]) // 2
    tb = draw.textbbox((0, 0), text, font=font)
    draw.text((cx - (tb[2] - tb[0]) // 2, cy - (tb[3] - tb[1]) // 2),
              text, font=font, fill=fill)


# --- background: flat themed fill + soft highlight -------------------------
def gen_background(key: str, colour: str) -> None:
    base = hex_rgb(colour)
    img = Image.new("RGBA", (CANVAS, CANVAS), (*base, 255))
    glow = blank()
    gd = ImageDraw.Draw(glow)
    light = tuple(min(255, c + 40) for c in base)
    gd.ellipse([-220, -360, CANVAS + 220, CANVAS - 120], fill=(*light, 90))
    img = Image.alpha_composite(img, glow)
    save(img, "background", key)


# --- frog: re-canvas a real Mr Frog sprite ---------------------------------
def gen_frog(key: str, sprite_rel: str) -> None:
    img = blank()
    sprite = fit_sprite(PUBLIC / sprite_rel, 760, FROG_H)
    x = (CANVAS - sprite.width) // 2
    y = FROG_BOTTOM - sprite.height
    img.alpha_composite(sprite, (x, y))
    save(img, "frog", key)


# --- outfit: translucent torso tabard --------------------------------------
def gen_outfit(key: str) -> None:
    img = blank()
    d = ImageDraw.Draw(img)
    r, g, b = hashed_colour(key)
    d.rounded_rectangle(TORSO_BOX, radius=70, fill=(r, g, b, 205),
                        outline=(40, 38, 32, 230), width=8)
    label(d, TORSO_BOX, key)
    save(img, "outfit", key)


# --- headwear: cap shape, or a reused celebration sprite -------------------
def gen_headwear(key: str) -> None:
    img = blank()
    if key in HEADWEAR_SPRITE:
        sprite = fit_sprite(PUBLIC / HEADWEAR_SPRITE[key], 300, 280)
        cx = (HEAD_BOX[0] + HEAD_BOX[2]) // 2
        img.alpha_composite(sprite, (cx - sprite.width // 2,
                                     HEAD_BOX[3] - sprite.height))
        save(img, "headwear", key)
        return
    d = ImageDraw.Draw(img)
    r, g, b = hashed_colour(key)
    x0, y0, x1, y1 = HEAD_BOX
    d.rounded_rectangle([x0, y0 + 90, x1, y1], radius=60, fill=(r, g, b, 225),
                        outline=(40, 38, 32, 235), width=8)
    d.ellipse([x0 - 30, y1 - 70, x1 + 30, y1 + 20], fill=(r, g, b, 225),
              outline=(40, 38, 32, 235), width=8)
    label(d, (x0, y0 + 90, x1, y1), key)
    save(img, "headwear", key)


# --- held item: re-canvas a real sprite, or a labelled disc ----------------
def gen_held(key: str) -> None:
    img = blank()
    if key in HELD_SPRITE:
        sprite = fit_sprite(PUBLIC / HELD_SPRITE[key], 330, 350)
        cx = (HAND_BOX[0] + HAND_BOX[2]) // 2
        img.alpha_composite(sprite, (cx - sprite.width // 2,
                                     HAND_BOX[3] - sprite.height))
        save(img, "held-item", key)
        return
    d = ImageDraw.Draw(img)
    r, g, b = hashed_colour(key)
    d.ellipse(HAND_BOX, fill=(r, g, b, 225), outline=(40, 38, 32, 235), width=8)
    label(d, HAND_BOX, key.replace("-", " "))
    save(img, "held-item", key)


def main() -> None:
    for key, colour in BACKGROUNDS.items():
        gen_background(key, colour)
    for key, sprite in EXPRESSIONS.items():
        gen_frog(key, sprite)
    for key in OUTFITS:
        gen_outfit(key)
    for key in HEADWEAR:
        gen_headwear(key)
    for key in HELD:
        gen_held(key)
    total = (len(BACKGROUNDS) + len(EXPRESSIONS) + len(OUTFITS)
             + len(HEADWEAR) + len(HELD))
    print(f"✓ {total} placeholder layers → public/collection/layers/")


if __name__ == "__main__":
    main()
