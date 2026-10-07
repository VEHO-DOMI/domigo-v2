# MISSION: produce the image set for "DomiGo — Batch Y" (the book-colour classroom, 1 image)

You are a senior HD pixel artist executing a fixed commission for a children's
English-learning game. ONE sheet only.

## WHY THIS EXISTS
The colour-room mini-game asks "what colour is the desk?" and the answers come
from the TEXTBOOK's colour key. The previous sheet's restored objects wore the
wrong colours (brown door, green board) — this sheet repaints the six restored
objects EXACTLY onto the book key: chair BROWN · desk GREEN · board WHITE ·
door BLUE · window YELLOW · school bag RED. Silhouettes stay as in batch W;
ONLY palettes (and the friendly face) change between the pair variants.

## THE STYLE CONTRACT
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
0a. STUDY `~/Code/codex-art-lab/batch-w/ch01/classroom3_sheet.png` — the
   silhouette/craft reference this sheet replaces (keep the shapes, fix the colours).
0. YOUR ONE AND ONLY WRITE LOCATION: `~/Code/codex-art-lab/batch-y/` (create it).
   NEVER write anywhere else.
1. Before the image print `NOW GENERATING: <filename>`; save to the card's
   SAVE TO path; print `SAVED: <full path>`.
2. AFTER the image, self-check (PASS/FAIL per line; one retry on FAIL):
   - COLOUR KEY: chair=brown · desk=green · board=white · door=blue ·
     window=yellow · school bag=red — each restored object answers "what
     colour?" in ONE look
   - PAIRS: grey twin and colour twin share the same silhouette
   - SMOOTHNESS: clean tonal bands, no speckle noise
   - FORMAT: solid #FF00FF magenta sheet, clean 4×3 grid, nothing touching borders
3. Never invent extra images, text, watermarks, or borders.

## THE CARD
---
CARD 1 · filename: classroom4_sheet.png
SAVE TO: ~/Code/codex-art-lab/batch-y/ch01/classroom4_sheet.png
SIZE: 1024×768 (4×3, 256px cells)
FORMAT: pose-sheet on SOLID magenta #FF00FF
USED FOR: Replaces the 12 cr_* classroom stems. Row-major pairs: chair grey/colour, desk grey/colour, board grey/colour, door grey/colour, window grey/colour, school_bag grey/colour — colour variants EXACTLY on the book key (chair BROWN, desk GREEN, board WHITE, door BLUE, window YELLOW, school bag RED).
SUBJECT BRIEF:
SUBJECT: a 4×3 sheet (12 cells, row-major) of SIX classroom things, each as a PAIR — first the DRAINED variant (all greys, sad sleepy face), then the RESTORED variant (full colour, gentle happy face), each object ~190px, softly grounded with a small contact shadow:
(1-2) CHAIR — restored variant painted warm wood BROWN.
(3-4) DESK — restored variant painted friendly GREEN (green tabletop and frame, the book's green desk).
(5-6) BOARD on a stand — restored variant a clean WHITE board (white writing surface, light frame).
(7-8) DOOR in its frame — restored variant painted BLUE (clearly blue panels).
(9-10) WINDOW with frame — restored variant with a warm YELLOW frame and sunny glass.
(11-12) SCHOOL BAG — restored variant bright RED.
THE COLOUR LAW: these six restored colours are a TEACHING KEY from the textbook — the dominant colour of each restored object MUST be unmistakably the named colour (a child asked "what colour is it?" answers it in one look). Same object silhouette within each pair — only palette and face change. FORMAT: PNG pose-sheet on SOLID magenta #FF00FF (no transparency — chroma-keyed later). Clean grid, equal cells, generous margins, nothing touching cell borders.

---
END OF COMMISSION. After the card, print a manifest: the filename, marked DONE
or REGENERATED, plus a line per object confirming its restored colour.
