# mrfrog-mvp

Single-repo birthday site for Amelia (12 on 2026-04-19) — Next.js 16 App Router, TypeScript strict, Tailwind v4, Phaser 3 game at `/game`. No backend, no database, no auth. Deployed to Vercel.

As of 2026-04-19 this is **the only MrFrog repo** — the old `mr-frog` asset library, standalone `mrfrog-waterfall-jump` game, and `mrfrog-creator` HTML experiment have all been folded in (see task 1849).

## Run locally

```bash
cd clawd-main/repos/mrfrog-mvp
npm install
npm run dev
```

Opens at http://localhost:3000. `/game` serves the Phaser build.

## Project layout

```
mrfrog-mvp/
├── app/
│   ├── layout.tsx           Kalam font + notebook theme
│   ├── page.tsx             Homepage
│   ├── globals.css          Paper background, blue ruled lines, keyframes
│   ├── drawings/            Originals gallery route
│   ├── videos/              Videos route
│   ├── mr-frog/             Character + world sprites route
│   ├── game/                Phaser waterfall-jump game
│   │   ├── page.tsx         Route shell
│   │   └── engine/          Phaser source (scenes, entities, lib, config)
│   ├── components/          Shared UI (Cover, PageNav, Lightbox, Game, …)
│   └── data/                Arcs, sprites, videos manifests
├── public/                  Served assets (originals, character-ref, elements, videos)
├── source-assets/           Raw inputs for sprite processing — NOT deployed
│   ├── extracts/            Zoom crops used as Gemini references
│   ├── generated/           Raw Gemini grid outputs awaiting processing
│   └── game-prompts.md      Prompt notes for sprite packs
├── scripts/                 Python helpers — NOT deployed
│   ├── process-sprites.py   Split + bg-remove + trim Gemini grids
│   └── adjust-colour.py     Saturation/brightness tweaks
├── legacy-creator/          Archived HTML sketchbook experiment — NOT deployed
└── .vercelignore            Excludes legacy-creator, source-assets, scripts from deploys
```

## Refreshing assets

1. Drop a new Gemini grid into `source-assets/generated/`.
2. Run the Python processor (uses the repo's `.venv`):
   ```
   .venv/bin/python3 scripts/process-sprites.py \
     source-assets/generated/<file>.jpeg <rows>x<cols> \
     public/<target-dir> \
     [--names a,b,c,...] [--label-height N] [--top-offset N]
   ```
3. Output lands directly in `public/character-ref/` or `public/elements/`.
4. Update the matching manifest in `app/data/` if you added new assets.

## Aesthetic notes

- Paper background `#faf6ec` with faint blue ruled lines every 32px
- Handwritten headings via Google's Kalam font (self-hosted by `next/font`)
- Accent palette pulled from the notebook: sage, pink, warm red, sky blue, sun yellow
- Gallery and sprite tiles are rotated `±1.2°` for that sticker-in-a-notebook feel
- Respects `prefers-reduced-motion` — the bounce, fade-ins, and video autoplay all stop

## Deploying later (Toby's step)

This task ships a local-dev site only. Whenever you're ready to put it on a real URL:

```bash
npm install -g vercel
vercel login
vercel link
vercel --prod
```

That's the whole deploy. Video files (~few MB total) ship inside `/public/` so there is no external storage to wire up.

## Scope (what this site is NOT)

This is the **safety-net** build for task 1844, parallel to the ambitious interactive site (task 1832). It deliberately does **not** include:

- Doodle-Jump-style interactivity, drag trails, tap-to-jiggle, easter eggs
- Individual scene pages or multi-route navigation
- A contribute form or upload flow
- Sound, music, or voice
- A game embed

All of those belong to 1832 / 1835 / 1836 / 1837. This one is a beautiful gallery, and stops.
