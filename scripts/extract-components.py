#!/usr/bin/env python3
"""Extract individual sprites from a sheet via connected alpha components.

Runs rembg on the whole image, then finds each connected blob of non-transparent
pixels (with some padding tolerance to merge near-touching parts of one sprite),
and writes each as its own PNG.

Usage:
    extract-components.py <input> <out-dir> [--names a,b,c,...] [--min-area N]
                          [--padding N] [--merge-gap N]
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from PIL import Image, ImageFilter


def extract(
    input_path: Path,
    out_dir: Path,
    names: list[str] | None = None,
    min_area: int = 8000,
    padding: int = 30,
    merge_gap: int = 20,
) -> None:
    from rembg import remove

    src = Image.open(input_path).convert("RGBA")
    cleaned = remove(src)

    alpha = cleaned.split()[-1]
    mask = alpha.point(lambda v: 255 if v > 10 else 0)
    if merge_gap > 0:
        mask = mask.filter(ImageFilter.MaxFilter(2 * merge_gap + 1))

    import numpy as np
    from scipy import ndimage

    arr = np.array(mask) > 0
    labelled, n = ndimage.label(arr)

    boxes = []
    for i in range(1, n + 1):
        ys, xs = np.where(labelled == i)
        if ys.size < min_area:
            continue
        boxes.append((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))

    boxes.sort(key=lambda b: (b[1] // 300, b[0]))

    out_dir.mkdir(parents=True, exist_ok=True)
    for idx, (l, t, r, b) in enumerate(boxes):
        crop = cleaned.crop((l, t, r, b))
        if padding > 0:
            new = Image.new("RGBA", (crop.width + 2 * padding, crop.height + 2 * padding), (0, 0, 0, 0))
            new.paste(crop, (padding, padding))
            crop = new
        name = names[idx] if names and idx < len(names) else f"sprite_{idx:02d}"
        path = out_dir / f"{name}.png"
        crop.save(path, "PNG", optimize=True)
        print(f"  → {path}")
    print(f"\nDone: {len(boxes)} sprites → {out_dir}")


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("input", type=Path)
    p.add_argument("out_dir", type=Path)
    p.add_argument("--names")
    p.add_argument("--min-area", type=int, default=8000)
    p.add_argument("--padding", type=int, default=30)
    p.add_argument("--merge-gap", type=int, default=20)
    args = p.parse_args()
    names = args.names.split(",") if args.names else None
    extract(args.input, args.out_dir, names, args.min_area, args.padding, args.merge_gap)
    return 0


if __name__ == "__main__":
    sys.exit(main())
