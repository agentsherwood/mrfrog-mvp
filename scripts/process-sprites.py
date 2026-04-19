#!/usr/bin/env python3
"""Split a Gemini grid image into isolated, bg-removed sprite PNGs.

Usage:
    process-sprites.py <input> <rows>x<cols> <out-dir> [options]

Options:
    --names a,b,c,...     Comma-separated names per cell (row-major).
    --top-offset N        Pixels to crop from the top before splitting (for title banners).
    --bottom-offset N     Pixels to crop from the bottom before splitting.
    --label-height N      Pixels to skip at the top of EACH cell (for per-cell labels).
    --padding N           Transparent padding around each sprite. Default 30.
    --no-rembg            Skip bg removal (just split + save as PNG).

Examples:
    # Mr Frog character sheet (2 rows x 3 cols, labels above each pose)
    process-sprites.py generated/char-sheet-1.jpeg 2x3 out/mr-frog \\
        --label-height 130 \\
        --names front-neutral,front-34,side-walking,happy,sad,surprised

    # Emotes with title banner at top, no per-cell labels
    process-sprites.py generated/emotes.jpeg 3x4 out/emotion \\
        --top-offset 220 \\
        --names excl,quest,sweat,zzz,motion,dust,crack,starburst,sparkle,heart,anger,bulb
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from PIL import Image


def process_grid(
    input_path: Path,
    rows: int,
    cols: int,
    out_dir: Path,
    names: list[str] | None = None,
    top_offset: int = 0,
    bottom_offset: int = 0,
    label_height: int = 0,
    padding: int = 30,
    use_rembg: bool = True,
) -> None:
    img = Image.open(input_path).convert("RGBA")
    w, h = img.size

    work = img.crop((0, top_offset, w, h - bottom_offset))
    work_w, work_h = work.size

    cell_w = work_w // cols
    cell_h = work_h // rows

    out_dir.mkdir(parents=True, exist_ok=True)
    total = rows * cols

    if names and len(names) != total:
        print(f"[warn] {len(names)} names provided but grid has {total} cells; extras numbered")

    remove_fn = None
    if use_rembg:
        try:
            from rembg import remove as _remove

            remove_fn = _remove
        except ImportError:
            print("[warn] rembg not installed — saving raw splits. Install: pip install rembg onnxruntime")

    for r in range(rows):
        for c in range(cols):
            idx = r * cols + c
            left = c * cell_w
            top = r * cell_h + label_height
            right = left + cell_w
            bottom = (r + 1) * cell_h
            cell = work.crop((left, top, right, bottom))

            if remove_fn:
                cell = remove_fn(cell)

            bbox = cell.getbbox()
            if bbox:
                cell = cell.crop(bbox)

            if padding > 0:
                new_w = cell.width + 2 * padding
                new_h = cell.height + 2 * padding
                padded = Image.new("RGBA", (new_w, new_h), (0, 0, 0, 0))
                padded.paste(cell, (padding, padding))
                cell = padded

            name = names[idx] if names and idx < len(names) else f"cell_{idx:02d}"
            out_path = out_dir / f"{name}.png"
            cell.save(out_path, "PNG", optimize=True)
            print(f"  → {out_path}")

    print(f"\nDone: {total} sprites → {out_dir}")


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    p.add_argument("input", type=Path)
    p.add_argument("grid", help="rows x cols, e.g. 3x4")
    p.add_argument("out_dir", type=Path)
    p.add_argument("--names")
    p.add_argument("--top-offset", type=int, default=0)
    p.add_argument("--bottom-offset", type=int, default=0)
    p.add_argument("--label-height", type=int, default=0)
    p.add_argument("--padding", type=int, default=30)
    p.add_argument("--no-rembg", action="store_true")
    args = p.parse_args()

    try:
        rows, cols = map(int, args.grid.lower().split("x"))
    except ValueError:
        print(f"[err] bad grid '{args.grid}', expected 'rows x cols' e.g. '3x4'")
        return 1

    names = args.names.split(",") if args.names else None

    process_grid(
        input_path=args.input,
        rows=rows,
        cols=cols,
        out_dir=args.out_dir,
        names=names,
        top_offset=args.top_offset,
        bottom_offset=args.bottom_offset,
        label_height=args.label_height,
        padding=args.padding,
        use_rembg=not args.no_rembg,
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
