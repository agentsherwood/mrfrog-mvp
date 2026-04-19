# mr-frog

Asset library + processing tooling for Toby's goddaughter Amelia's MrFrog project.

Documentation, vision, and task tracking live in `clawd-main/brain2/Projects/MrFrog/` (see [[MrFrog-index]] in Obsidian). This repo is **assets and scripts only**.

## Layout

```
mr-frog/
├── originals/         Amelia's original scanned drawings (31 JPEGs, named scenes)
├── extracts/          Zoomed-in crops of Mr Frog used as Gemini references
├── generated/         Raw Gemini outputs (grid JPEGs, 3×2 / 4×3 / etc)
├── character-ref/     Processed character sprites (individual PNGs, bg-removed)
│   ├── mr-frog/
│   │   ├── front-neutral.png
│   │   └── poses/
│   └── mrs-frog/
├── elements/          Processed element sprites (individual PNGs, bg-removed)
│   ├── nature/
│   ├── everyday/
│   ├── emotion/
│   └── celebration/
├── videos/            Existing video renders (pre-sprite-era; may be replaced)
└── scripts/
    └── process-sprites.py   Split + bg-remove + trim Gemini grid outputs
```

## Processing a new Gemini output

1. Drop the JPEG into `generated/`.
2. Run:
   ```
   .venv/bin/python3 clawd-main/repos/mr-frog/scripts/process-sprites.py \
     clawd-main/repos/mr-frog/generated/<file>.jpeg <rows>x<cols> \
     clawd-main/repos/mr-frog/<target-dir> \
     [--names a,b,c,...] [--label-height N] [--top-offset N]
   ```
3. Output lands in `character-ref/` or `elements/` as individual PNGs with transparent backgrounds.

Full per-file commands for the current batch: see `clawd-main/brain2/Projects/MrFrog/gemini-prompts.md` → "Processing the generated grids" section.

## Dependencies

Installed in the repo's `.venv`:

```
.venv/bin/pip3 install pillow rembg onnxruntime
```

First `rembg` run downloads a ~170MB ML model (one-time).

## Consumers

These processed sprites are consumed by:

- **mrfrog-site** (to exist at `clawd-main/repos/mrfrog-site/`) — the storybook website
- **mrfrog-waterfall-jump** (to exist at `clawd-main/repos/mrfrog-waterfall-jump/`) — Doodle-Jump clone game

Each consumer imports from this repo via a typed asset manifest (keeps code decoupled from exact paths).
