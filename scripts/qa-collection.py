#!/usr/bin/env python3
"""QA contact sheets for the Mr Frog Collection build (task 2295).

Composites the canonical frog over the real backgrounds and applies the real
frog-colour filters (the exact CSS hue-rotate / saturate / brightness matrix,
so the preview matches the browser). Two sheets land in /tmp for review:

    /tmp/qa-backgrounds.png   the frog on every background
    /tmp/qa-colours.png       the frog in every colour

Run from the mrfrog-mvp repo root:
    ../../../.venv/bin/python3 scripts/qa-collection.py
"""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

REPO = Path(__file__).resolve().parent.parent
RAW_BG = REPO / "source-assets" / "collection-raw" / "background"
PLATE = REPO / "source-assets" / "collection-base" / "frog-base.png"
CANVAS = 1024

BACKGROUNDS = ["notebook", "pond", "farmyard", "sunset", "kitchen", "stage",
               "night-sky", "rainbow-rain", "underwater", "outer-space"]

# (label, hue-rotate deg, saturate, brightness) — mirrors collection-traits.ts
COLOURS = [
    ("classic-green", 0, 1.0, 1.0),
    ("sky-blue", 90, 1.1, 1.0),
    ("bubblegum", 215, 1.2, 1.02),
    ("sunshine", -55, 1.5, 1.1),
    ("mint", 25, 0.75, 1.12),
    ("lavender", 165, 0.85, 1.05),
    ("tangerine", -75, 1.55, 1.05),
    ("cherry", -130, 1.6, 0.98),
]


def matmul(a: list[float], b: list[float]) -> list[float]:
    """3x3 * 3x3, row-major flat lists."""
    out = [0.0] * 9
    for r in range(3):
        for c in range(3):
            out[r * 3 + c] = sum(a[r * 3 + k] * b[k * 3 + c] for k in range(3))
    return out


def hue_matrix(deg: float) -> list[float]:
    a = math.radians(deg)
    c, s = math.cos(a), math.sin(a)
    return [
        0.213 + c * 0.787 - s * 0.213, 0.715 - c * 0.715 - s * 0.715, 0.072 - c * 0.072 + s * 0.928,
        0.213 - c * 0.213 + s * 0.143, 0.715 + c * 0.285 + s * 0.140, 0.072 - c * 0.072 - s * 0.283,
        0.213 - c * 0.213 - s * 0.787, 0.715 - c * 0.715 + s * 0.715, 0.072 + c * 0.928 + s * 0.072,
    ]


def sat_matrix(sat: float) -> list[float]:
    return [
        0.213 + 0.787 * sat, 0.715 - 0.715 * sat, 0.072 - 0.072 * sat,
        0.213 - 0.213 * sat, 0.715 + 0.285 * sat, 0.072 - 0.072 * sat,
        0.213 - 0.213 * sat, 0.715 - 0.715 * sat, 0.072 + 0.928 * sat,
    ]


def apply_colour(img: Image.Image, deg: float, sat: float, bright: float) -> Image.Image:
    """Apply the CSS filter chain hue-rotate -> saturate -> brightness."""
    if deg == 0 and sat == 1.0 and bright == 1.0:
        return img
    m = matmul(hue_matrix(deg), sat_matrix(sat))
    m = [v * bright for v in m]
    twelve = (m[0], m[1], m[2], 0, m[3], m[4], m[5], 0, m[6], m[7], m[8], 0)
    r, g, b, alpha = img.split()
    rgb = Image.merge("RGB", (r, g, b)).convert("RGB", twelve)
    rgb.putalpha(alpha)
    return rgb


def cover(src: Path) -> Image.Image:
    img = Image.open(src).convert("RGBA")
    scale = max(CANVAS / img.width, CANVAS / img.height)
    img = img.resize((round(img.width * scale), round(img.height * scale)), Image.LANCZOS)
    left = (img.width - CANVAS) // 2
    top = (img.height - CANVAS) // 2
    return img.crop((left, top, left + CANVAS, top + CANVAS))


def font(size: int) -> ImageFont.ImageFont:
    for p in ("/System/Library/Fonts/Supplemental/Comic Sans MS.ttf",
              "/System/Library/Fonts/Helvetica.ttc"):
        if Path(p).exists():
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def contact_sheet(tiles: list[tuple[str, Image.Image]], cols: int, out: Path) -> None:
    cell, pad, cap = 300, 16, 34
    rows = (len(tiles) + cols - 1) // cols
    w = cols * cell + (cols + 1) * pad
    h = rows * (cell + cap) + (rows + 1) * pad
    sheet = Image.new("RGB", (w, h), (250, 246, 236))
    draw = ImageDraw.Draw(sheet)
    f = font(26)
    for i, (label, tile) in enumerate(tiles):
        r, c = divmod(i, cols)
        x = pad + c * (cell + pad)
        y = pad + r * (cell + cap + pad)
        sheet.paste(tile.convert("RGB").resize((cell, cell)), (x, y))
        tb = draw.textbbox((0, 0), label, font=f)
        draw.text((x + (cell - (tb[2] - tb[0])) // 2, y + cell + 4), label,
                  font=f, fill=(42, 39, 32))
    sheet.save(out)
    print(f"  {out} ({len(tiles)} tiles)")


def main() -> int:
    plate = Image.open(PLATE).convert("RGBA")

    bg_tiles = []
    for key in BACKGROUNDS:
        scene = cover(RAW_BG / f"{key}.png")
        scene.alpha_composite(plate)
        bg_tiles.append((key, scene))
    contact_sheet(bg_tiles, 5, Path("/tmp/qa-backgrounds.png"))

    neutral = cover(RAW_BG / "notebook.png")
    colour_tiles = []
    for label, deg, sat, bright in COLOURS:
        tile = neutral.copy()
        tile.alpha_composite(apply_colour(plate, deg, sat, bright))
        colour_tiles.append((label, tile))
    contact_sheet(colour_tiles, 4, Path("/tmp/qa-colours.png"))
    print("QA sheets written to /tmp/")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
