#!/usr/bin/env python3
"""Adjust saturation / brightness / contrast of PNG (or JPEG) images while
preserving alpha. Supports single files or whole directory trees.

Usage:
    adjust-colour.py <input> <output> [options]
    adjust-colour.py <dir> --in-place [options]

Options:
    --saturation N   Default 1.0 (no change). >1 boosts colour; <1 desaturates.
    --brightness N   Default 1.0. >1 brighter; <1 darker.
    --contrast N     Default 1.0. >1 more contrast.
    --in-place       Overwrite the source file(s). Required when input is a dir
                     and no output is given.
    --recursive      When input is a dir, process subdirectories too. Default on.

Examples:
    # Test on one sprite
    adjust-colour.py in.png /tmp/out.png --saturation 1.35 --brightness 1.10

    # Batch in-place on a directory (preserves subfolder structure)
    adjust-colour.py clawd-main/repos/mr-frog/character-ref/mr-frog --in-place \\
        --saturation 1.35 --brightness 1.10 --contrast 1.05
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from PIL import Image, ImageEnhance


def adjust_image(
    src: Path,
    dst: Path,
    saturation: float,
    brightness: float,
    contrast: float,
) -> None:
    img = Image.open(src)
    has_alpha = img.mode in ("RGBA", "LA") or "transparency" in img.info
    img = img.convert("RGBA") if has_alpha else img.convert("RGB")

    if has_alpha:
        rgb = img.convert("RGB")
        alpha = img.getchannel("A")
    else:
        rgb = img
        alpha = None

    if saturation != 1.0:
        rgb = ImageEnhance.Color(rgb).enhance(saturation)
    if brightness != 1.0:
        rgb = ImageEnhance.Brightness(rgb).enhance(brightness)
    if contrast != 1.0:
        rgb = ImageEnhance.Contrast(rgb).enhance(contrast)

    if alpha is not None:
        out = Image.merge("RGBA", (*rgb.split(), alpha))
    else:
        out = rgb

    dst.parent.mkdir(parents=True, exist_ok=True)
    fmt = "PNG" if dst.suffix.lower() == ".png" else None
    out.save(dst, format=fmt, optimize=True)


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    p.add_argument("input", type=Path)
    p.add_argument("output", type=Path, nargs="?")
    p.add_argument("--saturation", type=float, default=1.0)
    p.add_argument("--brightness", type=float, default=1.0)
    p.add_argument("--contrast", type=float, default=1.0)
    p.add_argument("--in-place", action="store_true")
    p.add_argument("--recursive", action="store_true", default=True)
    args = p.parse_args()

    inp: Path = args.input
    if not inp.exists():
        print(f"[err] input not found: {inp}")
        return 1

    is_dir = inp.is_dir()

    if args.in_place and args.output:
        print("[err] --in-place conflicts with explicit output")
        return 1

    if is_dir and not args.in_place and not args.output:
        print("[err] directory input requires either --in-place or an output dir")
        return 1

    files: list[tuple[Path, Path]] = []
    if is_dir:
        pattern = "**/*" if args.recursive else "*"
        for f in sorted(inp.glob(pattern)):
            if not f.is_file() or f.suffix.lower() not in (".png", ".jpg", ".jpeg"):
                continue
            if args.in_place:
                files.append((f, f))
            else:
                rel = f.relative_to(inp)
                files.append((f, args.output / rel))
    else:
        dst = inp if args.in_place else (args.output or inp)
        files.append((inp, dst))

    if not files:
        print(f"[warn] no PNG/JPEG files found in {inp}")
        return 0

    print(f"adjusting {len(files)} file(s): " f"sat={args.saturation} bri={args.brightness} con={args.contrast}")
    for src, dst in files:
        adjust_image(src, dst, args.saturation, args.brightness, args.contrast)
        print(f"  → {dst}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
