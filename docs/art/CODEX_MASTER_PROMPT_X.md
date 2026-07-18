# MISSION: produce the image set for "DomiGo — Batch X" (v5.1 surgical fixes, 6 images)

You are a senior HD pixel artist executing a fixed commission for a children's
English-learning game. Work AUTONOMOUSLY through the cards IN ORDER.

## ★ THE GATE: generate ONLY CARD 1 (the pole-free climb pair) first, then STOP
and print exactly: `GATE CARD DONE — awaiting look approval before cards 2+`.
Card 1 replaces frames that live INSIDE the game's climbing system — it must
match Batch W's hero exactly before the rest runs.

## THE STYLE CONTRACT (every card)
STYLE (strict, class GAMEPLAY — MODERN HD PIXEL ART, the bar of Owlboy / Eastward / Sea of Stars): high-definition pixel art, NOT retro 8-bit, NOT NES-era. Study the provided reference crops FIRST; your output must sit beside them as clearly the same craft tier.

RESOLUTION & GRID: crisp square pixels on a consistent grid — sprites authored ~40px tall, terrain tiles 48×48, rendered ONLY at integer scale. One pixel size across the whole image; never mix pixel scales; no blurry upscaling.

PALETTE (FREED — the EGA-16 limit is RETIRED): use a rich, deliberately-chosen, harmonious palette. Many tones are allowed and wanted — 5-7 tones per material (deep shadow → shadow → base → light → highlight → rim) — but stay a CURATED palette, never photographic: colors are picked and reused across the scene so everything reads as one world. Warm storybook key: paper cream, ink blue-black, mustard yellow, warm earth browns, fresh greens, sky cyan, a single warm accent per unit (chapter 1 = fresh GREEN).

★ THE ANTI-NOISE LAW (this is the whole point of v3 — it REPLACES v2's dithering-scatter rule): NO speckle, NO random 1-pixel scatter, NO checkerboard noise fills. That grain is exactly what made the old ground ugly. Instead: shade with CLEAN, smooth tonal BANDS and soft selective dithering used sparingly ONLY at the boundary between two tones to ease the transition (a few graded pixels, deliberate, never a field of them). Material reads through hand-placed, intentional detail — a few embedded pebbles, a root, a wood-grain stroke, a paper fibre line — with generous smooth space between them, not a busy texture everywhere.

FORM & LIGHT: one consistent light source from the top-left; soft ambient occlusion where forms meet (a darker band under a grass lip, in a corner, where a sprite meets the ground). Round forms get a smooth 5-tone rounded shade and a small specular highlight. Selective interior anti-aliasing is ALLOWED on curves and diagonals to keep them smooth — but the OUTER silhouette stays a clean, crisp, readable edge (hard contour, often a dark ink line).

SILHOUETTES: organic and generous — grass lips overhang their earth in soft irregular tufts, rocks are rounded and chipped, trunks bulge at the roots; straight machine edges belong only to man-made objects. VARIETY: never a single flat repeated texture — give ground, walls and foliage 2-3 gentle variants so a tiled surface never reads as an obvious repeat.

SPRITES: bold clean silhouette, smooth interior rendering, expressive big readable eyes, a real specular light, poses readable in half a second, a subtle rim-light where it helps them pop from the backdrop. Friendly storybook mood — this is a children's English game set INSIDE a book (ink, paper, letters). NEVER scary: melancholy-comic, never menacing, no horror.

## WORKING RULES
0b. READ THE METHOD FIRST: `~/Code/codex-art-lab/CODEX_METHOD.md` (sandbox law,
   CP-registry). If missing, say so and continue.
0a. STUDY `~/Code/codex-art-lab/batch-w/hero/hero3_sheet.png` — the canonical
   hero these cards must match EXACTLY (costume, proportions, rendering).
0. YOUR ONE AND ONLY WRITE LOCATION: `~/Code/codex-art-lab/batch-x/` (create it).
   NEVER write anywhere else.
1. Before each image print `NOW GENERATING: <filename>`; save to the card's
   SAVE TO path; print `SAVED: <full path>`.
2. AFTER each image, self-check (PASS/FAIL per line; one retry on FAIL):
   - MATCH: the hero/props sit beside batch-w art as the same craft tier
   - SMOOTHNESS: clean tonal bands, no speckle noise
   - FORMAT: solid #FF00FF magenta sheet, clean grid, nothing touching borders
   - SUBJECT: every element present; card 1 contains NO pole/pencil anywhere
3. If you hit a limit, print `CONTINUE AT CARD <n>` and resume when restarted.
4. Never invent extra images, text, watermarks, or borders.

## THE CARDS
---
CARD 1 · filename: climb_nopole_sheet.png · 🚦 GATE
SAVE TO: ~/Code/codex-art-lab/batch-x/hero/climb_nopole_sheet.png
SIZE: 512×256 (2×1, 256px cells)
FORMAT: pose-sheet on SOLID magenta #FF00FF
USED FOR: Replaces hero2_climb1/2. Batch W baked a pencil INTO the climb frames — in-game it doubled with the level's own pole. These frames show the hero's grip only.
SUBJECT BRIEF:
THE HERO (identical to Batch W's hero3): schoolkid ~10, mid-brown messy hair, mustard-yellow shirt, dark trousers, brown cross-body satchel, red scarf, giant white quill pen with a gold nib on the back.

SUBJECT: 2 cells of the hero CLIMBING, ~180px tall, facing RIGHT, drawn WITHOUT any pole or pencil in the frame: both hands gripping an INVISIBLE vertical bar at the sprite's center line (fists closed one above the other on the center axis, body hanging slightly left of the fists, knees bent), two alternating leg positions. The game draws the pole; these frames must composite ON it. Nothing but the hero in the cell. FORMAT: PNG pose-sheet on SOLID magenta #FF00FF (no transparency — chroma-keyed later). Clean grid, equal cells, generous margins, nothing touching cell borders.

---
CARD 2 · filename: acc3_sheet.png
SAVE TO: ~/Code/codex-art-lab/batch-x/hero/acc3_sheet.png
SIZE: 512×256 (2×1, 256px cells)
FORMAT: pose-sheet on SOLID magenta #FF00FF
USED FOR: Per-student accessories redrawn for the HD hero (the old ones rendered as a blob over his face). Slices → acc_cap, acc_scarf.
SUBJECT BRIEF:
SUBJECT: 2 cells of ACCESSORY OVERLAYS sized for Batch W's hero3 (~180px hero in a 256px cell): (1) a friendly GREEN CAP drawn exactly where the hero3 head sits (upper-center of the cell, crown ~y70-110, brim right) — nothing else in the cell; (2) a BLUE SCARF drawn at the hero3 neck position (~y115-140), tail flying left. These are transparent overlays composited onto every pose — align to the hero3_stand proportions. FORMAT: PNG pose-sheet on SOLID magenta #FF00FF (no transparency — chroma-keyed later). Clean grid, equal cells, generous margins, nothing touching cell borders.

---
CARD 3 · filename: maphero3_sheet.png
SAVE TO: ~/Code/codex-art-lab/batch-x/map/maphero3_sheet.png
SIZE: 768×512 (3×2, 256px cells)
FORMAT: pose-sheet on SOLID magenta #FF00FF
USED FOR: The world-map hero at the v3 bar (the old one reads tiny+crunchy on the painting). Slices → mh_down1, mh_down2, mh_up1, mh_up2, mh_side1, mh_side2.
SUBJECT BRIEF:
THE HERO (identical to Batch W's hero3): schoolkid ~10, mid-brown messy hair, mustard-yellow shirt, dark trousers, brown cross-body satchel, red scarf, giant white quill pen with a gold nib on the back.

SUBJECT: a 3×2 sheet of the hero as a TOP-DOWN-ish (3/4 view) map walker, ~190px tall, chibi-proportioned (big head), quill on back visible: cells 1-2 WALKING TOWARD the viewer (down), two alternating steps · 3-4 WALKING AWAY (up, backpack view) · 5-6 WALKING RIGHT (side), two steps. Warm, readable at small size, clean silhouette. FORMAT: PNG pose-sheet on SOLID magenta #FF00FF (no transparency — chroma-keyed later). Clean grid, equal cells, generous margins, nothing touching cell borders.

---
CARD 4 · filename: alphabet3_sheet.png
SAVE TO: ~/Code/codex-art-lab/batch-x/ch01/alphabet3_sheet.png
SIZE: 1024×768 (7×4 grid, ~146px cells)
FORMAT: pose-sheet on SOLID magenta #FF00FF
USED FOR: The 26 collectible letters (the white orbs read scruffy next to the HD art). Slices → alpha_a … alpha_z; two spare cells empty.
SUBJECT BRIEF:
SUBJECT: a 7×4 sheet (26 used cells, last two EMPTY magenta) of collectible LETTER TOKENS A to Z in reading order, each ~110px: a warm cream PAPER DISC with a soft golden rim-glow and one bold friendly serif CAPITAL letter (ink blue-black), tiny sparkle. Same disc design every cell, only the letter changes — readable at 30px. FORMAT: PNG pose-sheet on SOLID magenta #FF00FF (no transparency — chroma-keyed later). Clean grid, equal cells, generous margins, nothing touching cell borders.

---
CARD 5 · filename: hazard3_strip.png
SAVE TO: ~/Code/codex-art-lab/batch-x/ch01/hazard3_strip.png
SIZE: 256×128
FORMAT: pose-sheet on SOLID magenta #FF00FF
USED FOR: Replaces prop_spikes: ONE tile-wide danger strip, bigger nibs, unmistakably 'do not touch'. Sliced whole (chroma-keyed).
SUBJECT BRIEF:
SUBJECT: one 256×128 cell: a row of FIVE sharp dark-steel INK NIBS standing upright on a small dark ink-puddle base, tips catching light with a warning glint, tileable left↔right when repeated. Clearly dangerous at 48px width, still storybook (no gore, no faces). FORMAT: PNG pose-sheet on SOLID magenta #FF00FF (no transparency — chroma-keyed later). Clean grid, equal cells, generous margins, nothing touching cell borders.

---
CARD 6 · filename: levelprops3_sheet.png
SAVE TO: ~/Code/codex-art-lab/batch-x/ch01/levelprops3_sheet.png
SIZE: 512×256 (2×1, 256px cells)
FORMAT: pose-sheet on SOLID magenta #FF00FF
USED FOR: Slices → prop_flag (checkpoint banner, planted), prop_door_open (in-level door arch, grounded).
SUBJECT BRIEF:
SUBJECT: 2 cells, each ~200px tall, standing ON the cell's bottom edge region (base at the bottom of the drawn area): (1) CHECKPOINT BANNER — a wooden pole with a cyan pennant flag and a small gold cap, a little grass tuft at its base; (2) LEVEL DOOR ARCH — a friendly wooden door in a stone arch frame, slightly open with warm light in the gap, for in-level room doors. Smooth HD shading. FORMAT: PNG pose-sheet on SOLID magenta #FF00FF (no transparency — chroma-keyed later). Clean grid, equal cells, generous margins, nothing touching cell borders.

---
END OF COMMISSION. After the final card, print a manifest of every filename,
in order, marked DONE or REGENERATED.
