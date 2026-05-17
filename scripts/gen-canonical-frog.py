#!/usr/bin/env python3
"""Generate crisp canonical Mr Frog candidates for the Collection (task 2295).

Step one of the incremental rebuild: one good, high-resolution frog to build
everything else on. Edits the locked happy.png character up to a clean native
1024² render at high quality, so it stays *her* Mr Frog but is crisp enough
to zoom into.

Run from the agent-sherwood repo root with the parent venv:
    .venv/bin/python clawd-main/repos/mrfrog-mvp/scripts/gen-canonical-frog.py
    .venv/bin/python .../gen-canonical-frog.py --count 3
"""

from __future__ import annotations

import argparse
import base64
import os
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI

REPO = Path(__file__).resolve().parent.parent
REF_FROG = REPO / "public" / "character-ref" / "mr-frog" / "happy.png"
OUT_DIR = REPO / "source-assets" / "collection-base" / "candidates"

PROMPT = (
    "This is Mr Frog, a friendly cartoon frog hand-drawn by a 12-year-old "
    "child with coloured pencils. Redraw him as one clean, crisp character: "
    "the exact same frog — a big rounded yellow-green body, two round eyes "
    "sitting as bumps on top, a simple cheerful closed smile, thin dark "
    "stick arms and thin stick legs with little feet. He stands front-on, "
    "large and centred, filling most of the frame. Keep the genuine "
    "hand-drawn coloured-pencil notebook style — wobbly pencil outlines, "
    "soft scribbly coloured-pencil shading, visible pencil texture, a little "
    "imperfect and charming. NOT smooth vector art, NOT a 3D render, NOT a "
    "photo. The background must be fully transparent — nothing behind him."
)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--count", type=int, default=3)
    ap.add_argument("--quality", default="high", choices=["low", "medium", "high"])
    args = ap.parse_args()

    load_dotenv(REPO / ".env", override=False)
    key = os.environ.get("OPENAI_APIKEY") or os.environ.get("OPENAI_API_KEY")
    if not key:
        raise SystemExit("OPENAI_APIKEY not found in mrfrog-mvp/.env")
    client = OpenAI(api_key=key)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    print(f"Generating {args.count} canonical frog candidates (quality={args.quality})")
    for i in range(1, args.count + 1):
        target = OUT_DIR / f"frog-{i}.png"
        print(f"[{i}/{args.count}] {target.relative_to(REPO)}", flush=True)
        try:
            with REF_FROG.open("rb") as fh:
                resp = client.images.edit(
                    model="gpt-image-1", image=fh, prompt=PROMPT,
                    size="1024x1024", quality=args.quality, n=1,
                    background="transparent")
            data = resp.data[0].b64_json
            if not data:
                raise RuntimeError("no image bytes")
            target.write_bytes(base64.b64decode(data))
        except Exception as exc:  # noqa: BLE001
            print(f"   FAILED: {exc}")
    print("Done. Review candidates and copy the best to ../frog-base.png")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
