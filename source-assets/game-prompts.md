---
type: project-reference
project: MrFrog
created: 2026-04-19
updated: 2026-04-19
---

# Game Sprite Pack Prompts — Doodle-Jump-in-Mr-Frog-World

Copy-paste prompts for generating the 5 asset packs the waterfall-jump game (task 1841) needs. Same pattern as the D1–D8 prompts in `brain2/Projects/MrFrog/gemini-prompts.md` — each block is fully standalone. Paste one at a time into Gemini, attach the locked Mr Frog character sheet (and optionally the existing element PNGs under `elements/nature/` and `elements/everyday/`) as references.

**World framing:** the game is Doodle-Jump mechanic themed as Mr Frog ascending a waterfall, BUT his world isn't a swamp — it's a child's imagination where platforms are lily pads mixed with random household objects (chairs, books, radios, frying pans), and powers/obstacles are similarly household-flavoured. Every pack must reinforce this "her world of strange household-nature-mix" tone.

**Output destinations** (after `process-sprites.py`):

```
clawd-main/repos/mr-frog/elements/game/
├── platforms/    ← from G1
├── powerups/     ← from G2
├── hazards/      ← from G3
├── backdrop/     ← from G4
└── ui/           ← from G5
```

Processing commands for each grid live alongside the others in `brain2/Projects/MrFrog/gemini-prompts.md` under "Processing the generated grids".

---

## G1 — Jumpable platforms (lily pads + household surfaces)

**Attach: the locked Mr Frog character sheet.**

```
Create a sprite sheet of hand-drawn jumpable platforms from the world of 'Mr
Frog' — an original character drawn by an 11-year-old child in her notebook
with pencil and coloured pencils. This is her imagination: a Doodle-Jump-style
world where Mr Frog springs up a waterfall, and the platforms he lands on are
a mix of lily pads AND random household surfaces from her home — nature and
household squished together. Use the attached Mr Frog character sheet as the
style anchor: match its line weight, pencil stroke texture, colour temperature,
and paper feel EXACTLY.

Output: 12 platforms in a 4×3 grid on pure white background. Each platform
cleanly isolated with even padding around it (for downstream cutout and
transparent-background use). Each one must read instantly as "jumpable" — a
clearly flat top surface, drawn in roughly side-on or 3/4 perspective so the
landing plane is visible.

Style rules:
- Hand-drawn pencil/ink outline with visible stroke texture and slight wobble
- Pencil-scribble shading, not flat digital fill
- Child-like imperfection — lines wobble, shapes aren't perfectly symmetrical
- Warm, soft, notebook-friendly palette
- Visually consistent with the attached Mr Frog sheet — same hand, same world

Avoid: 3D rendering, photorealism, smooth vector art, glossy highlights,
gradients, dramatic shadows, textured backgrounds, overly clean detail.

Platforms (one per grid cell):

1.  Large lily pad, top-down-ish, flat green landing surface
2.  Small lily pad, narrow, same style but clearly tighter
3.  Lily pad with a single pink flower sprouting from it
4.  Wooden chair, side view, flat seat visible as the landing top
5.  Stack of 3 books, flat top cover, slightly wobbly pile
6.  Upside-down wooden bucket, flat base facing up
7.  Red frying pan held flat-side-up, handle sticking to the side
8.  Fluffy pillow, plump, with a flat-enough top to jump on
9.  Wooden stool, top-down-ish round seat, 3–4 legs visible
10. Washing machine with round window, flat top
11. Cracked lily pad — visible jagged cracks across the surface, "about to break"
12. Red-with-white-spots spring mushroom, bouncy and slightly squashed
```

---

## G2 — Power-ups & collectibles

**Attach: the locked Mr Frog character sheet.**

```
Create a sprite sheet of hand-drawn power-ups and collectibles from the world
of 'Mr Frog' — an original character drawn by an 11-year-old child in her
notebook with pencil and coloured pencils. This is her imagination: a Doodle-
Jump-style world where Mr Frog springs up a waterfall and collects small
pickups as he climbs — a mix of classic game items and household-flavoured
charm. Use the attached Mr Frog character sheet as the style anchor: match
its line weight, pencil stroke texture, colour temperature, and paper feel
EXACTLY.

Output: 12 pickups in a 4×3 grid on pure white background. Each item cleanly
isolated with even padding around it (for downstream cutout and transparent-
background use). Each one must read instantly as a "collectible" — small,
front-facing, cheerful silhouette.

Style rules:
- Hand-drawn pencil/ink outline with visible stroke texture and slight wobble
- Pencil-scribble shading, not flat digital fill
- Child-like imperfection — lines wobble, shapes aren't perfectly symmetrical
- Warm, soft, notebook-friendly palette
- Visually consistent with the attached Mr Frog sheet — same hand, same world

Avoid: 3D rendering, photorealism, smooth vector art, glossy highlights,
gradients, dramatic shadows, textured backgrounds, overly clean detail.

Pickups (one per grid cell):

1.  Bronze coin, circular, simple marking on the face
2.  Silver coin, circular, slightly brighter edge
3.  Gold coin with a hand-drawn "★" on the face
4.  Red heart (extra life), plump and simple
5.  Blue star (bonus), 5-pointed, hand-drawn
6.  Glowing Nutella-style peanut-butter jar (power-up) with a small sparkle
7.  Small rainbow arc (slow-fall item), semi-circle, 5 colour bands
8.  Old-fashioned round clock face (slow-time item), visible hands
9.  Horseshoe magnet (coin-attract), red with silver tips
10. Key, old-fashioned loop-top shape (unlock)
11. Speech bubble with the word "BOING!" hand-lettered inside (super bounce)
12. Green leaf shield (protection), simple leaf with a sturdy vein
```

---

## G3 — Hazards & enemies

**Attach: the locked Mr Frog character sheet.**

```
Create a sprite sheet of hand-drawn hazards and enemies from the world of
'Mr Frog' — an original character drawn by an 11-year-old child in her
notebook with pencil and coloured pencils. This is her imagination: a Doodle-
Jump-style world where Mr Frog springs up a waterfall and has to dodge things
that want to knock him off — a mix of weather, critters, and household items
gone wrong. Use the attached Mr Frog character sheet as the style anchor:
match its line weight, pencil stroke texture, colour temperature, and paper
feel EXACTLY.

Output: 12 hazards in a 4×3 grid on pure white background. Each item cleanly
isolated with even padding around it (for downstream cutout and transparent-
background use). Each one must read instantly as "this will hurt Mr Frog" —
cross expressions, jagged shapes, or warning colouring.

Style rules:
- Hand-drawn pencil/ink outline with visible stroke texture and slight wobble
- Pencil-scribble shading, not flat digital fill
- Child-like imperfection — lines wobble, shapes aren't perfectly symmetrical
- Warm, soft, notebook-friendly palette (can lean slightly more punchy for
  danger — reds, purples — but still soft pencil)
- Visually consistent with the attached Mr Frog sheet — same hand, same world

Avoid: 3D rendering, photorealism, smooth vector art, glossy highlights,
gradients, dramatic shadows, textured backgrounds, overly clean detail,
genuinely scary/dark imagery (this is a child's notebook — hazards are
comedy-threatening, not horror).

Hazards (one per grid cell):

1.  Angry grey rain cloud with a cross face
2.  Yellow jagged lightning bolt
3.  Falling pinecone, side view, light brown scales
4.  Rotten tomato, purple-green, queasy sick face
5.  Angry wasp, side view, yellow and black stripes, cross expression
6.  Sticky cobweb (corner decoration, triangular web shape)
7.  Swirling washing-machine-water vortex (round, with spiral lines)
8.  Puddle with outward ripples (splash hazard, top-down)
9.  Thorny bramble tangle, dark green with visible thorns
10. Falling piano (comedy hazard), side view, legs in the air
11. Triangular hand-drawn warning sign with a bold "!"
12. Falling hairbrush, side view, spiky bristles
```

---

## G4 — Parallax background layers

**Attach: the locked Mr Frog character sheet.**

```
Create a sprite sheet of hand-drawn parallax background elements from the
world of 'Mr Frog' — an original character drawn by an 11-year-old child in
her notebook with pencil and coloured pencils. These are the quiet layers
that sit BEHIND the Doodle-Jump play area and give the waterfall scene depth
— her imagined sky and distant landscape, still touched by her household-
nature-mix world. Use the attached Mr Frog character sheet as the style
anchor: match its line weight, pencil stroke texture, colour temperature,
and paper feel EXACTLY.

Output: 12 background elements in a 4×3 grid on pure white background. Each
element cleanly isolated with even padding around it (for downstream cutout
and transparent-background use). These sit at partial opacity behind the
action so keep them readable but slightly softer — simpler shapes, fewer
internal details.

Style rules:
- Hand-drawn pencil/ink outline with visible stroke texture and slight wobble
- Pencil-scribble shading, not flat digital fill
- Simpler silhouettes than foreground sprites — these are distance elements
- Child-like imperfection — lines wobble, shapes aren't perfectly symmetrical
- Warm, soft, notebook-friendly palette (slightly muted for distance feel)
- Visually consistent with the attached Mr Frog sheet — same hand, same world

Avoid: 3D rendering, photorealism, smooth vector art, glossy highlights,
gradients, dramatic shadows, textured backgrounds, overly clean detail,
foreground-level rendering (these are meant to recede).

Elements (one per grid cell):

1.  Far mountain silhouette, simple triangular shape with light shade
2.  Distant small fluffy cloud
3.  Big near-range fluffy cloud
4.  Tall reed silhouette, vertical bunch of slender blades
5.  Mid-distance tree, round green canopy, short brown trunk
6.  Rainbow fragment, partial arc of 4–5 colour bands
7.  Far-off flying bird, simple V-shape in the sky
8.  Tiny twinkling single 4-pointed star
9.  Small decorative sun (corner element, partial rays)
10. Crescent moon (night variant), simple curve
11. Long thin vertical waterfall splash cascade
12. Distant Mrs Frog silhouette waving from afar (Easter-egg detail — tiny
    green figure with her pink bow)
```

---

## G5 — Game UI doodles

**Attach: the locked Mr Frog character sheet.**

```
Create a sprite sheet of hand-drawn game UI doodles — HUD and menu icons —
in the style of the world of 'Mr Frog', an original character drawn by an
11-year-old child in her notebook with pencil and coloured pencils. These
sit in the corners of the Doodle-Jump-style game (score, lives, pause) and
must feel drawn by the same hand as everything else in her world. Use the
attached Mr Frog character sheet as the style anchor: match its line weight,
pencil stroke texture, colour temperature, and paper feel EXACTLY.

Output: 12 icons in a 4×3 grid on pure white background. Each icon cleanly
isolated with even padding around it (for downstream cutout and transparent-
background use). Icons must remain instantly readable at ~40px (small in-game
HUD) — no fiddly internal detail, bold silhouettes only.

Style rules:
- Hand-drawn pencil/ink outline with visible stroke texture and slight wobble
- Simple, bold, readable silhouettes at small sizes
- Child-like imperfection — lines wobble, shapes aren't perfectly symmetrical
- Warm, soft, notebook-friendly palette
- Visually consistent with the attached Mr Frog sheet — same hand, same world
- All 10 digits must feel like the same artist drew them in one sitting —
  consistent weight and wobble across the set

Avoid: 3D rendering, photorealism, smooth vector art, glossy highlights,
gradients, dramatic shadows, textured backgrounds, multi-line tiny detail
that won't survive at small sizes, digital typography / system fonts.

Icons (one per grid cell):

1.  Hand-drawn digit "0"
2.  Hand-drawn digit "1"
3.  Hand-drawn digit "2"
4.  Hand-drawn digit "3"
5.  Hand-drawn digit "4"
6.  Hand-drawn digit "5"
7.  Hand-drawn digit "6"
8.  Hand-drawn digit "7"
9.  Hand-drawn digit "8"
10. Hand-drawn digit "9"
11. Small red heart (HUD life icon, readable at ~24px)
12. Pause symbol — two vertical bars, hand-drawn
```

---

# Cartoon Backgrounds & Everyday-Life Packs (H1–H5)

Step away from game/platform framing. These 5 packs are for the storybook site (1832), scene compositions, and general illustrated content — typical cartoon backgrounds and everyday-life assets from Mr Frog's world. Same standalone, copy-paste-one-at-a-time structure as D1–D8 and G1–G5.

**Output destinations:**

```
clawd-main/repos/mr-frog/elements/
├── scenes/
│   ├── house/        ← from H1 (12 room backdrops)
│   └── shops/        ← from H2 (12 shop interiors)
├── household/        ← from H3 (12 more everyday items)
├── furniture/        ← from H4 (12 furniture pieces)
└── dress-up/         ← from H5 (clothes + birthday extras)
```

---

## H1 — Inside the house (room backdrops)

**Attach: the locked Mr Frog character sheet.**

```
Create a sprite sheet of hand-drawn interior room backgrounds from the world
of 'Mr Frog' — an original character drawn by an 11-year-old child in her
notebook with pencil and coloured pencils. These are the rooms of Mr Frog
and Mrs Frog's home — warm, cosy, notebook-style scenes for placing
characters inside. Use the attached Mr Frog character sheet as the style
anchor: match its line weight, pencil stroke texture, colour temperature,
and paper feel EXACTLY.

Output: 12 room scenes in a 4×3 grid. Each cell contains ONE complete
rectangular interior scene filling the cell edge-to-edge (not a cutout —
these are full backdrops). Thin white gutters between cells so the grid
can be split by a downstream script. No characters in the scenes — they
are empty rooms ready for Mr/Mrs Frog to be placed into.

Style rules:
- Hand-drawn pencil/ink outline with visible stroke texture and slight wobble
- Pencil-scribble shading, not flat digital fill
- Simple cartoon perspective (slightly wonky, child-style — not technical)
- Child-like imperfection — lines wobble, shapes aren't perfectly symmetrical
- Warm, soft, notebook-friendly palette — rooms feel inviting and homely
- Visually consistent with the attached Mr Frog sheet — same hand, same world

Avoid: 3D rendering, photorealism, smooth vector art, glossy highlights,
gradients, dramatic shadows, overly clean detail, realistic architectural
perspective, clutter that fights the readability.

Rooms (one per grid cell):

1.  Kitchen — counters, stove, window over a sink, checkered floor
2.  Living room — sofa, rug, coffee table, lamp, picture on the wall
3.  Bedroom — single bed with blanket, bedside table, small window
4.  Bathroom — bathtub, sink, mirror, little rug
5.  Dining room — table with 2 chairs, hanging light, patterned wall
6.  Hallway with front door, coat rack, welcome mat
7.  Staircase view — steps going up, banister, framed pictures on wall
8.  Study / reading nook — bookshelf, armchair, small desk with lamp
9.  Attic — sloped ceiling, old trunk, single round window
10. Toilet — small, tiled, little window, roll of paper
11. Kitchen-dining combo — cosy open-plan view with both counter and table
12. Garden porch seen from inside — French doors open to greenery beyond
```

---

## H2 — Inside the shop (shop interiors)

**Attach: the locked Mr Frog character sheet.**

```
Create a sprite sheet of hand-drawn shop interiors from the world of
'Mr Frog' — an original character drawn by an 11-year-old child in her
notebook with pencil and coloured pencils. These are the little high-street
shops Mr Frog and Mrs Frog visit — each one a warm, friendly cartoon
interior you could drop a character into. Use the attached Mr Frog
character sheet as the style anchor: match its line weight, pencil stroke
texture, colour temperature, and paper feel EXACTLY.

Output: 12 shop interiors in a 4×3 grid. Each cell contains ONE complete
rectangular shop scene filling the cell edge-to-edge (not a cutout —
these are full backdrops). Thin white gutters between cells so the grid
can be split by a downstream script. No characters in the scenes — the
shops are empty, ready for characters to be placed inside.

Style rules:
- Hand-drawn pencil/ink outline with visible stroke texture and slight wobble
- Pencil-scribble shading, not flat digital fill
- Simple cartoon perspective (slightly wonky, child-style)
- Each shop has a clear identifying feature — a viewer must instantly
  know what shop it is (pile of cakes in the window = bakery, etc.)
- Child-like imperfection — lines wobble, shapes aren't perfectly symmetrical
- Warm, soft, notebook-friendly palette
- Visually consistent with the attached Mr Frog sheet — same hand, same world

Avoid: 3D rendering, photorealism, smooth vector art, glossy highlights,
gradients, dramatic shadows, overly clean detail, realistic architectural
perspective, heavy signage/branding text, clutter.

Shops (one per grid cell):

1.  Bakery — counter with cakes and bread loaves in a glass case
2.  Toy shop — shelves of soft toys, a train set, a bouncing ball display
3.  Sweet shop — jars of sweets in rows, a weighing scale on the counter
4.  Bookshop — tall bookshelves, a reading armchair, stacks on the floor
5.  Flower shop — buckets of flowers, hanging baskets, a watering can
6.  Ice cream parlour — tub-style freezer, cone stack, pink/blue walls
7.  Café — round tables, chairs, a coffee machine, a chalkboard menu
8.  Post office — counter with a grill, stamps on a spinner, letters
9.  Clothes shop — a small rack, a mannequin, a fitting curtain
10. Supermarket aisle — shelves of tins and packets, a trolley
11. Art supplies shop — paintbrushes in jars, paper rolls, easel display
12. Pet shop — a goldfish bowl, a birdcage, a basket of puppies
```

---

## H3 — Household objects (everyday items, pack 2)

**Attach: the locked Mr Frog character sheet.**

```
Create a sprite sheet of hand-drawn household objects from the world of
'Mr Frog' — an original character drawn by an 11-year-old child in her
notebook with pencil and coloured pencils. These are the everyday things
that fill Mr Frog's home — a second pack extending D1, filling the gaps
with the stuff a room actually has in it. Use the attached Mr Frog
character sheet as the style anchor: match its line weight, pencil stroke
texture, colour temperature, and paper feel EXACTLY.

Output: 12 items in a 4×3 grid on pure white background. Each item cleanly
isolated with even padding around it (for downstream cutout and
transparent-background use).

Style rules:
- Hand-drawn pencil/ink outline with visible stroke texture and slight wobble
- Pencil-scribble shading, not flat digital fill
- Child-like imperfection — lines wobble, shapes aren't perfectly symmetrical
- Warm, soft, notebook-friendly palette
- Visually consistent with the attached Mr Frog sheet — same hand, same world

Avoid: 3D rendering, photorealism, smooth vector art, glossy highlights,
gradients, dramatic shadows, textured backgrounds, overly clean detail.

Items (one per grid cell):

1.  Kettle (whistle-top, handle, simple spout)
2.  Teapot (round body, lid, curved spout)
3.  Mug with steam rising
4.  Toaster with 2 slices popping up
5.  Microwave (front view, visible dial)
6.  Fridge (tall, with a little magnet/note on the door)
7.  Kitchen sink with taps
8.  Broom (straw bristles, wooden handle)
9.  Vacuum cleaner (upright, with a cord loop)
10. Light bulb (round, filament visible)
11. Round wall clock (Roman numerals or simple numbers, two hands)
12. Dustbin (kitchen pedal-bin style, lid closed)
```

---

## H4 — Furniture pack

**Attach: the locked Mr Frog character sheet.**

```
Create a sprite sheet of hand-drawn furniture from the world of 'Mr Frog' —
an original character drawn by an 11-year-old child in her notebook with
pencil and coloured pencils. These are the big pieces that make up a
cartoon room — useful as standalone props OR dropped into a scene. Use
the attached Mr Frog character sheet as the style anchor: match its line
weight, pencil stroke texture, colour temperature, and paper feel EXACTLY.

Output: 12 furniture pieces in a 4×3 grid on pure white background. Each
piece cleanly isolated with even padding around it (for downstream cutout
and transparent-background use). Draw each piece in side-on or simple 3/4
view so its identity is instantly readable.

Style rules:
- Hand-drawn pencil/ink outline with visible stroke texture and slight wobble
- Pencil-scribble shading, not flat digital fill
- Child-like imperfection — lines wobble, shapes aren't perfectly symmetrical
- Warm, soft, notebook-friendly palette — wood-warm browns, soft fabric tones
- Visually consistent with the attached Mr Frog sheet — same hand, same world

Avoid: 3D rendering, photorealism, smooth vector art, glossy highlights,
gradients, dramatic shadows, textured backgrounds, overly clean detail,
IKEA-catalogue look.

Furniture (one per grid cell):

1.  Two-seater sofa (plump cushions, small legs)
2.  Armchair (single, cosy, patterned cushion)
3.  Dining table with 2 chairs tucked in
4.  Single bed with blanket and pillow
5.  Double bed with patterned quilt
6.  Wardrobe (tall, double-door, small knobs)
7.  Chest of drawers (3 drawers, small round handles)
8.  Bookshelf (3 shelves, a few books and a small trinket)
9.  Coffee table (low, wooden, rectangular)
10. Floor lamp (tall, with a shade and a gentle curve)
11. Round rug (patterned — simple swirl or stripes)
12. TV on a small stand (boxy, friendly, slightly retro)
```

---

## H5 — Dress-up: clothes & birthday extras

**Attach: the locked Mr Frog character sheet.**

```
Create a sprite sheet of hand-drawn clothes and birthday extras from the
world of 'Mr Frog' — an original character drawn by an 11-year-old child
in her notebook with pencil and coloured pencils. These are outfits and
party extras for dressing up Mr Frog and Mrs Frog, and filling out the
birthday celebration beyond D8. Use the attached Mr Frog character sheet
as the style anchor: match its line weight, pencil stroke texture, colour
temperature, and paper feel EXACTLY.

Output: 12 items in a 4×3 grid on pure white background. Each item cleanly
isolated with even padding around it (for downstream cutout and
transparent-background use). Clothes should be drawn flat / hanging so
they can be composited onto the characters; party items stand alone.

Style rules:
- Hand-drawn pencil/ink outline with visible stroke texture and slight wobble
- Pencil-scribble shading, not flat digital fill
- Child-like imperfection — lines wobble, shapes aren't perfectly symmetrical
- Warm, soft, notebook-friendly palette — colourful but not garish
- Visually consistent with the attached Mr Frog sheet — same hand, same world

Avoid: 3D rendering, photorealism, smooth vector art, glossy highlights,
gradients, dramatic shadows, textured backgrounds, overly clean detail,
fashion-illustration styling.

Items (one per grid cell):

1.  Striped t-shirt (short-sleeved, flat view)
2.  Dress (A-line, simple pattern, hanging view)
3.  Chunky jumper (long-sleeved, knitted texture hinted)
4.  Paper party crown (jagged top, patterned)
5.  Sparkly tiara (simple, with 3 little gems)
6.  Long scarf (wavy, striped)
7.  Bow tie (small, polka-dotted)
8.  Big hand-drawn "11" in party colours (Amelia's 11th)
9.  Party blower (unrolled, with a tassel)
10. Multi-colour balloon bundle (5 balloons, different colours, tied)
11. Paper streamer (squiggly length of decorative paper)
12. Cupcake stand with 3 cupcakes (tiered, tied with a bow)
```
