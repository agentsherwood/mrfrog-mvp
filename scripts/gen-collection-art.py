#!/usr/bin/env python3
"""Generate real trait-layer art for the Mr Frog Collection (task 2295).

A precise, controlled pipeline so every layer aligns on the canonical frog:

  - base plate   one canonical Mr Frog re-canvased to a fixed 1024² position,
                 plus a feathered torso mask. Built locally from happy.png.
  - frog-base    each outfit is image-edited ONTO the base plate through the
                 torso mask, so the outfit always sits right and the frog's
                 face / eyes / feet never move. "none" = the bare base plate.
  - objects      headwear, eyewear, shoes and the held-item gaps are
                 generated as transparent objects (gpt-image-1).
  - scenes       the 10 themed backgrounds (opaque).

Raw output → source-assets/collection-raw/<group>/<key>.png (not deployed).
build-collection-layers.py then composes raw art onto the deployed layers.

OpenAI key: read from mrfrog-mvp/.env as OPENAI_APIKEY. Never commit .env.

Run from the agent-sherwood repo root with the parent venv:
    .venv/bin/python clawd-main/repos/mrfrog-mvp/scripts/gen-collection-art.py
    .venv/bin/python .../gen-collection-art.py --only outfits,eyewear,shoes
    .venv/bin/python .../gen-collection-art.py --smoke
"""

from __future__ import annotations

import argparse
import base64
import io
import os
import sys
import time
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI
from PIL import Image, ImageDraw, ImageFilter

REPO = Path(__file__).resolve().parent.parent
RAW = REPO / "source-assets" / "collection-raw"
BASE_DIR = REPO / "source-assets" / "collection-base"
REF_FROG = REPO / "public" / "character-ref" / "mr-frog" / "happy.png"

# --- canonical frog geometry (shared with build-collection-layers.py) ------
CANVAS = 1024
FROG_H = 884
FROG_BOTTOM = 1004
# Torso mask: the rounded region an outfit is painted into — clear of the
# eyes (above) and feet (below) so those never move.
TORSO_MASK_BOX = (250, 312, 778, 754)

# --- style -----------------------------------------------------------------
STYLE = (
    "Hand-drawn by a 12-year-old child with coloured pencils. Visible "
    "pencil-stroke texture, lines that wobble slightly with uneven thickness, "
    "soft coloured-pencil scribble shading (never smooth digital fill, never "
    "gradients, never 3D). Warm, simple, charming and a little imperfect."
)

OBJECT_TEMPLATE = (
    "A flat hand-drawn doodle of {desc}, drawn with coloured pencils — wobbly "
    "pencil outlines, scribbly coloured-pencil shading, simple and childlike. "
    "{style} It must look DRAWN and flat — NOT a realistic object, NOT a 3D "
    "render, NOT a product photo, NOT smooth or glossy. Just the {short} on "
    "its own — no frog, no body, no character. A single simple object, "
    "centred, drawn at a generous size. The background must be FULLY "
    "TRANSPARENT — no paper, no page, no background of any kind. No text, no "
    "labels. Square 1:1."
)
BG_TEMPLATE = (
    "A hand-drawn children's notebook drawing of {desc}. {style} A calm "
    "background scene that fills the whole square. No characters, no people, "
    "no animals, no text. Keep the middle of the picture calm and "
    "uncluttered — a character will be placed there later. Square 1:1."
)
OUTFIT_TEMPLATE = (
    "This is Mr Frog — a simple round hand-drawn coloured-pencil cartoon "
    "frog. Dress his body in {desc}, drawn in the exact same wobbly "
    "coloured-pencil notebook style as the frog, fitted neatly over his "
    "round body. Do NOT change his face, eyes, hands or feet. Keep the "
    "background fully transparent."
)
BORDER_TEMPLATE = (
    "A SQUARE PICTURE FRAME — only the four EDGES of the square are drawn; "
    "the CENTRE of the square is fully transparent and empty. {desc}. "
    "{style} The frame should be roughly 1/10 of the canvas thick on each "
    "edge. It must look DRAWN and flat — NOT a realistic object, NOT a 3D "
    "render, NOT a photo. Absolutely NO content in the middle — just empty "
    "transparent space (a character will be placed there later). The "
    "background must be FULLY TRANSPARENT. No text, no labels. Square 1:1."
)

# --- catalogues (keys mirror app/data/collection-traits.ts) ----------------
BACKGROUNDS = {
    "notebook": "a plain cream sheet of notebook paper with faint blue horizontal ruled lines",
    "pond": "a calm green lily pond with a few lily pads and reeds along the lower edge and soft sky above",
    "farmyard": "a sunny farmyard with a low wooden fence and gentle rolling green hills under a soft blue sky",
    "sunset": "a warm sunset sky in soft bands of orange, pink and yellow above a low quiet horizon",
    "kitchen": "a cosy little kitchen corner with a small window, a shelf and warm wooden tones",
    "stage": "a small theatre stage with a soft warm spotlight glow and curtains drawn back at the sides",
    "night-sky": "a deep blue starry night sky with a friendly crescent moon and scattered little stars",
    "rainbow-rain": "a soft dreamy sky with gentle rainbow-coloured raindrops falling, pale and pretty",
    "underwater": "a calm underwater scene in soft blue-green water with little bubbles and wavy seaweed along the bottom",
    "outer-space": "calm deep space, dark with scattered stars and one or two small simple planets",
}
OUTFITS = {
    "raincoat": "a bright-yellow hooded raincoat",
    "painter-smock": "a painter's apron smock with a few small colourful paint smudges",
    "chef-apron": "a simple white chef's apron",
    "pyjamas": "cosy pale-blue pyjamas with a simple little star pattern",
    "tutu": "a fluffy pink ballet tutu",
    "sailor": "a navy-and-white sailor outfit with a sailor collar",
    "strongman": "a bold red strongman singlet",
    "wedding-suit": "a smart little black wedding suit with a small bow tie",
    "superhero": "a bright superhero outfit with a star emblem on the chest",
    "astronaut-suit": "a chunky white astronaut spacesuit",
    "among-us": "a rounded red space-crewmate suit",
}
HEADWEAR = {
    "party-hat": ("a striped cone-shaped party hat with a little pom-pom on top", "party hat"),
    "beanie": ("a cosy knitted bobble beanie hat", "beanie"),
    "flower-crown": ("a circlet crown of little white and yellow daisies", "flower crown"),
    "chef-hat": ("a tall puffy white chef's hat", "chef hat"),
    "sailor-cap": ("a small white sailor's cap", "sailor cap"),
    "top-hat": ("a tall smart black top hat", "top hat"),
    "headphones": ("a pair of chunky friendly headphones", "headphones"),
    "pirate-hat": ("a black pirate captain's hat with a small skull badge", "pirate hat"),
    "birthday-12": ("a cone party hat with a big bold number 12 drawn on it", "party hat"),
    "astronaut-helmet": ("a round clear-domed astronaut helmet", "helmet"),
    "crown": ("a golden royal crown with a few little jewels", "crown"),
}
EYEWEAR = {
    "round-glasses": ("a pair of round wire spectacles", "glasses"),
    "sunglasses": ("a pair of cool dark sunglasses", "sunglasses"),
    "nerd-glasses": ("a pair of chunky thick black-framed nerdy glasses", "glasses"),
    "swim-goggles": ("a pair of swimming goggles", "goggles"),
    "heart-glasses": ("a pair of heart-shaped novelty glasses", "glasses"),
    "star-glasses": ("a pair of star-shaped novelty glasses", "glasses"),
    "monocle": ("a single round monocle on a little chain", "monocle"),
}
SHOES = {
    # All shoes are TOP-DOWN with toes pointing toward the viewer — the foot
    # opening visible at the heel (top of image), toe at the bottom. Two
    # shoes side by side, symmetrical pair. Reads as 'worn by a frog facing
    # the camera' rather than 'placed on a shelf side-on'.
    "wellies":        ("a pair of bright-yellow rain wellington boots seen from above with toes pointing toward the viewer, foot openings visible at the heel, two boots side by side and symmetrical", "boots"),
    "trainers":       ("a pair of sporty trainers seen from above with toes pointing toward the viewer, laces visible on the tongue, two trainers side by side and symmetrical", "trainers"),
    "sandals":        ("a pair of simple summer sandals seen from above with toes pointing toward the viewer, straps visible across the top, two sandals side by side and symmetrical", "sandals"),
    "bunny-slippers": ("a pair of fluffy white bunny slippers seen from above with toes pointing toward the viewer, the bunny ears and faces visible on the toe-fronts, two slippers side by side and symmetrical", "slippers"),
    "football-boots": ("a pair of football boots seen from above with toes pointing toward the viewer, laces visible on the tongue, two boots side by side and symmetrical", "boots"),
    "roller-skates":  ("a pair of roller skates seen from above with toes pointing toward the viewer, laces visible on top and a hint of the wheels beneath, two skates side by side and symmetrical", "skates"),
    "cowboy-boots":   ("a pair of tan cowboy boots seen from above with toes pointing toward the viewer, foot openings visible at the heel, two boots side by side and symmetrical", "boots"),
}
ITEMS = {
    "butterfly-net": ("a butterfly-catching net on a wooden stick", "net"),
    "barbell": ("a small chunky barbell weight", "barbell"),
    "frog-plush": ("a tiny cuddly frog soft-toy plushie", "plushie"),
    "magic-wand": ("a magic wand with a star on the tip and a few sparkles", "wand"),
    "diamond": ("a big sparkly blue diamond gem", "diamond"),
    "golden-acorn": ("a shiny golden acorn", "acorn"),
}
BORDERS = {
    # Picture-frame borders that wrap the four edges of the tile. Centre
    # stays fully transparent so the frog and scene read through.
    "daisy-wreath":  "a thin chain of small white-and-yellow daisies running all the way around the four edges, like a daisy chain wreath border",
    "leafy-vine":    "a green leafy vine with small leaves winding all the way around the four edges, like a botanical frame",
    "stars":         "scattered small five-point yellow and golden stars decorating all four edges, like a starry frame",
    "rainbow-stripe": "a thin band of rainbow-coloured pencil stripes running all the way around the four edges as a frame",
}

GROUPS = ("backgrounds", "outfits", "headwear", "eyewear", "shoes", "items", "borders")


# --- base plate ------------------------------------------------------------
def ensure_base_plate() -> tuple[Path, Path]:
    """Build the canonical frog plate + feathered torso mask if missing."""
    BASE_DIR.mkdir(parents=True, exist_ok=True)
    plate = BASE_DIR / "frog-base.png"
    mask = BASE_DIR / "body-mask.png"
    if plate.exists() and mask.exists():
        return plate, mask

    src = Image.open(REF_FROG).convert("RGBA")
    bbox = src.getbbox()
    if bbox:
        src = src.crop(bbox)
    scale = FROG_H / src.height
    src = src.resize((round(src.width * scale), FROG_H), Image.LANCZOS)
    canvas = Image.new("RGBA", (CANVAS, CANVAS), (0, 0, 0, 0))
    canvas.alpha_composite(src, ((CANVAS - src.width) // 2, FROG_BOTTOM - src.height))
    canvas.save(plate)

    # Mask: opaque (keep) everywhere, a feathered transparent (edit) torso.
    m = Image.new("L", (CANVAS, CANVAS), 255)
    hole = Image.new("L", (CANVAS, CANVAS), 255)
    ImageDraw.Draw(hole).rounded_rectangle(TORSO_MASK_BOX, radius=120, fill=0)
    hole = hole.filter(ImageFilter.GaussianBlur(26))
    mask_img = Image.merge("RGBA", (m, m, m, hole))
    mask_img.save(mask)
    print(f"  built base plate + torso mask → {BASE_DIR.relative_to(REPO)}/")
    return plate, mask


# --- openai ----------------------------------------------------------------
def client_from_env() -> OpenAI:
    load_dotenv(REPO / ".env", override=False)
    key = os.environ.get("OPENAI_APIKEY") or os.environ.get("OPENAI_API_KEY")
    if not key:
        raise SystemExit("OPENAI_APIKEY not found in mrfrog-mvp/.env")
    return OpenAI(api_key=key)


def b64_of(resp) -> str:
    data = resp.data[0].b64_json
    if not data:
        raise RuntimeError("no image bytes returned")
    return data


def gen_object(client: OpenAI, prompt: str, quality: str) -> str:
    return b64_of(client.images.generate(
        model="gpt-image-1", prompt=prompt, size="1024x1024",
        quality=quality, n=1, background="transparent"))


def gen_scene(client: OpenAI, prompt: str, quality: str) -> str:
    return b64_of(client.images.generate(
        model="gpt-image-1", prompt=prompt, size="1024x1024", quality=quality, n=1))


def gen_outfit(client: OpenAI, plate: Path, mask: Path, prompt: str, quality: str) -> bytes:
    """Edit an outfit onto the base plate through the torso mask, then hard-
    composite the unmasked area back from the plate so the face never drifts."""
    with plate.open("rb") as img_fh, mask.open("rb") as mask_fh:
        resp = client.images.edit(model="gpt-image-1", image=img_fh, mask=mask_fh,
                                   prompt=prompt, size="1024x1024", quality=quality, n=1)
    edited = Image.open(io.BytesIO(base64.b64decode(b64_of(resp)))).convert("RGBA")
    if edited.size != (CANVAS, CANVAS):
        edited = edited.resize((CANVAS, CANVAS), Image.LANCZOS)
    plate_img = Image.open(plate).convert("RGBA")
    # body-mask alpha: 0 = editable (use edit), 255 = keep (use plate)
    keep = Image.open(mask).convert("RGBA").getchannel("A")
    final = Image.composite(plate_img, edited, keep)
    out = io.BytesIO()
    final.save(out, format="PNG")
    return out.getvalue()


def save_bytes(data: bytes, target: Path) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(data)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", default=",".join(GROUPS),
                    help=f"comma-separated groups: {', '.join(GROUPS)}")
    ap.add_argument("--quality", default="low", choices=["low", "medium", "high"])
    ap.add_argument("--regenerate", action="store_true")
    ap.add_argument("--smoke", action="store_true", help="2 images as a sanity check")
    ap.add_argument("--limit", type=int, default=0)
    args = ap.parse_args()

    groups = [g.strip() for g in args.only.split(",") if g.strip()]
    for g in groups:
        if g not in GROUPS:
            raise SystemExit(f"unknown group {g!r}")

    plate, mask = ensure_base_plate()
    # "none" frog-base is just the bare plate.
    none_base = RAW / "frog" / "none.png"
    if not none_base.exists() or args.regenerate:
        save_bytes(plate.read_bytes(), none_base)

    # (group, key, kind, target) — kind drives which generator runs.
    targets: list[tuple[str, str, str, Path]] = []
    if "backgrounds" in groups:
        for k in BACKGROUNDS:
            targets.append(("backgrounds", k, "scene", RAW / "background" / f"{k}.png"))
    if "outfits" in groups:
        for k in OUTFITS:
            targets.append(("outfits", k, "outfit", RAW / "frog" / f"{k}.png"))
    if "headwear" in groups:
        for k in HEADWEAR:
            targets.append(("headwear", k, "object", RAW / "headwear" / f"{k}.png"))
    if "eyewear" in groups:
        for k in EYEWEAR:
            targets.append(("eyewear", k, "object", RAW / "eyewear" / f"{k}.png"))
    if "shoes" in groups:
        for k in SHOES:
            targets.append(("shoes", k, "object", RAW / "shoes" / f"{k}.png"))
    if "items" in groups:
        for k in ITEMS:
            targets.append(("items", k, "object", RAW / "held-item" / f"{k}.png"))
    if "borders" in groups:
        for k in BORDERS:
            targets.append(("borders", k, "border", RAW / "border" / f"{k}.png"))

    if args.smoke:
        targets = [t for t in targets if t[1] in ("chef-apron", "star-glasses", "wellies")][:3]
    if args.limit:
        targets = targets[: args.limit]

    pending = [t for t in targets if args.regenerate or not t[3].exists()]
    print(f"Generating {len(pending)} / {len(targets)} images (quality={args.quality})")
    if not pending:
        print("Nothing to do — all raw art already present.")
        return 0

    client = client_from_env()
    failures: list[tuple[str, str, str]] = []
    for i, (group, key, kind, target) in enumerate(pending, 1):
        print(f"[{i}/{len(pending)}] {kind:6} {group}/{key}", flush=True)
        try:
            if kind == "scene":
                data = base64.b64decode(gen_scene(
                    client, BG_TEMPLATE.format(desc=BACKGROUNDS[key], style=STYLE), args.quality))
            elif kind == "outfit":
                data = gen_outfit(client, plate, mask,
                                  OUTFIT_TEMPLATE.format(desc=OUTFITS[key]), args.quality)
            elif kind == "border":
                data = base64.b64decode(gen_object(
                    client, BORDER_TEMPLATE.format(desc=BORDERS[key], style=STYLE),
                    args.quality))
            else:  # object
                cat = {"headwear": HEADWEAR, "eyewear": EYEWEAR,
                       "shoes": SHOES, "items": ITEMS}[group]
                desc, short = cat[key]
                data = base64.b64decode(gen_object(
                    client, OBJECT_TEMPLATE.format(desc=desc, short=short, style=STYLE),
                    args.quality))
            save_bytes(data, target)
        except Exception as exc:  # noqa: BLE001
            print(f"   FAILED: {exc}", flush=True)
            failures.append((group, key, str(exc)))
            continue
        time.sleep(0.4)

    done = len(pending) - len(failures)
    print(f"\nDone. {done}/{len(pending)} generated.")
    if failures:
        print("Failures (re-run to retry — skip-existing keeps successes):")
        for group, key, err in failures:
            print(f"  {group}/{key}: {err[:160]}")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
