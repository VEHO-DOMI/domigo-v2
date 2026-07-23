# MISSION: produce the image set for "DomiGo — Batch W" (v5, the HD-pixel shift)

You are a senior HD pixel artist AND illustrator executing a fixed commission for
a children's English-learning game. Work AUTONOMOUSLY through the numbered cards
below, IN ORDER, one image per card. Do not skip, reorder, merge, or reinterpret.

## ★ THE GATE (read before anything): this batch is CALIBRATE-FIRST.
Generate ONLY cards 1–5 (the 🚦 GATE cluster: the style key, the
terrain, the hero preview, one school-thing, and the painted map), then STOP and
print exactly: `GATE CLUSTER DONE — awaiting look approval before cards 6+`.
Do NOT generate the rest until you are restarted with "look approved, continue".
A wrong style key caught at 5 images costs 5, not ~90.

## THE TWO STYLE CONTRACTS (each card names its class — re-read the right one before EVERY image)

### CLASS GAMEPLAY (HD pixel — v3, the Owlboy/Eastward bar, ANTI-NOISE)
STYLE (strict, class GAMEPLAY — MODERN HD PIXEL ART, the bar of Owlboy / Eastward / Sea of Stars): high-definition pixel art, NOT retro 8-bit, NOT NES-era. Study the provided reference crops FIRST; your output must sit beside them as clearly the same craft tier.

RESOLUTION & GRID: crisp square pixels on a consistent grid — sprites authored ~40px tall, terrain tiles 48×48, rendered ONLY at integer scale. One pixel size across the whole image; never mix pixel scales; no blurry upscaling.

PALETTE (FREED — the EGA-16 limit is RETIRED): use a rich, deliberately-chosen, harmonious palette. Many tones are allowed and wanted — 5-7 tones per material (deep shadow → shadow → base → light → highlight → rim) — but stay a CURATED palette, never photographic: colors are picked and reused across the scene so everything reads as one world. Warm storybook key: paper cream, ink blue-black, mustard yellow, warm earth browns, fresh greens, sky cyan, a single warm accent per unit (chapter 1 = fresh GREEN).

★ THE ANTI-NOISE LAW (this is the whole point of v3 — it REPLACES v2's dithering-scatter rule): NO speckle, NO random 1-pixel scatter, NO checkerboard noise fills. That grain is exactly what made the old ground ugly. Instead: shade with CLEAN, smooth tonal BANDS and soft selective dithering used sparingly ONLY at the boundary between two tones to ease the transition (a few graded pixels, deliberate, never a field of them). Material reads through hand-placed, intentional detail — a few embedded pebbles, a root, a wood-grain stroke, a paper fibre line — with generous smooth space between them, not a busy texture everywhere.

FORM & LIGHT: one consistent light source from the top-left; soft ambient occlusion where forms meet (a darker band under a grass lip, in a corner, where a sprite meets the ground). Round forms get a smooth 5-tone rounded shade and a small specular highlight. Selective interior anti-aliasing is ALLOWED on curves and diagonals to keep them smooth — but the OUTER silhouette stays a clean, crisp, readable edge (hard contour, often a dark ink line).

SILHOUETTES: organic and generous — grass lips overhang their earth in soft irregular tufts, rocks are rounded and chipped, trunks bulge at the roots; straight machine edges belong only to man-made objects. VARIETY: never a single flat repeated texture — give ground, walls and foliage 2-3 gentle variants so a tiled surface never reads as an obvious repeat.

SPRITES: bold clean silhouette, smooth interior rendering, expressive big readable eyes, a real specular light, poses readable in half a second, a subtle rim-light where it helps them pop from the backdrop. Friendly storybook mood — this is a children's English game set INSIDE a book (ink, paper, letters). NEVER scary: melancholy-comic, never menacing, no horror.

### CLASS CUTSCENE / BACKDROP (painted)
STYLE (strict, class CUTSCENE): a warmly PAINTED children's storybook illustration — NOT pixel art. Soft painterly brushwork, gentle gradients, clean shapes, professional picture-book quality (think modern illustrated children's novels). PALETTE: build every scene from the mood of this EGA-derived family — deep ink blues/blacks, warm paper cream, mustard yellow #fcfc54, warm brown #a85400, fresh green #00a800, sky cyan #54fcfc, accent red #fc5454 — painted freely (shades and gradients allowed), so the painted scenes and the in-game pixel world read as ONE world. RECURRING CAST (identical design every time they appear): THE HERO — a schoolkid of about 10, mid-brown messy hair, mustard-yellow shirt, dark trousers, small brown cross-body satchel, red scarf, a giant white quill pen (gold nib) strapped on the back. FINN — a floating open paper book AS a person: cream pages like wings, dark ink spine, two big friendly black dot-eyes on the left page, tiny ink eyebrows. PIXEL — a small black cat with huge amber-yellow eyes, one ear tipped. FRAU BERGER — a warm Austrian primary-school teacher, cardigan, reading glasses on a cord. DER TINTENGEIST — a soft rounded spirit of dark blue-black ink, calm white eyes, never menacing. Mood: warm, curious, a little wistful where the world is grey — NEVER scary (no horror, no sharp teeth, no darkness-as-threat; this is for 10-year-olds learning English). No text, no watermarks, no borders.

## WORKING RULES
0b. READ THE METHOD FIRST: `~/Code/codex-art-lab/CODEX_METHOD.md` is the
   standing working method of this lab (ground truth, calibration, hostile
   self-review, the sandbox law, the CP-registry). Read it fully before card 1.
   If missing, say so and continue.
0a. STUDY THE REFERENCES: `~/Code/codex-art-lab/refs-t/`. NOTE for v3: the
   `ref_keen_*` crops show the OLD grainy bar — your new contract is SMOOTHER
   and sharper than them (modern HD pixel, the anti-noise law). Use them only
   for silhouette/craft discipline, NOT for dithering density. `hero-v1.png`
   fixes the hero's canonical DESIGN. If the folder is missing, say so, continue.
0. YOUR ONE AND ONLY WRITE LOCATION IS THE SANDBOX FOLDER:
   `~/Code/codex-art-lab/batch-w/` — create it (and subfolders) if missing.
   Save every image there under the exact SAVE TO path its card names. NEVER
   write, modify, move, or delete ANYTHING anywhere else. A separate pipeline
   (not you) later QA-checks, slices, and imports your images.
1. CARD 1 IS THE HD-PIXEL STYLE KEY — generate it first; every later GAMEPLAY
   image must match it (palette, smoothness, anti-noise). CUTSCENE/BACKDROP
   cards match the painted contract and the painted map's mood.
2. Before each image print exactly: `NOW GENERATING: <filename>` — then
   generate, SAVE it yourself to the card's SAVE TO path, print `SAVED: <path>`.
3. AFTER each image run the class-matched self-check, print PASS/FAIL per line —
   on any FAIL regenerate ONCE with the failure named:
   GAMEPLAY (HD pixel) cards:
   - SMOOTHNESS: clean tonal bands, NO speckle/scatter noise, NO checkerboard fill
   - PALETTE: a curated harmonious palette (not photographic), 5-7 tones/material
   - PIXELS: one consistent pixel grid, crisp silhouette; selective interior AA OK
   - VARIETY: no single flat repeated texture — 2-3 gentle variants where carded
   - FORMAT: solid #FF00FF magenta sheet with a clean grid / true-alpha as carded
   - SUBJECT: every element present and readable at game size, top-left light
   CUTSCENE/BACKDROP cards:
   - PAINTED: soft painterly rendering, ZERO chunky pixels
   - RESOLUTION: exactly the card's size, sharp at full-screen
   - CAST/MOOD: characters match the descriptions; warm, never scary; no text
4. SHEETS: equal cells, SAME design in every cell (only pose/state changes);
   tile-sheets keep 48px cells edge-tileable where noted.
5. If you hit a session or generation limit, print exactly:
   `CONTINUE AT CARD <n>` — you will be restarted and resume there.
6. Never invent extra images, text, watermarks, signatures, or borders.

## THE CARDS
---
CARD 1 · filename: _style_key_pixel3.png · CLASS: GAMEPLAY (HD pixel) · 🚦 GATE CLUSTER
SAVE TO: ~/Code/codex-art-lab/batch-w/_style_key_pixel3.png
SIZE: 1024×640
FORMAT: full-bleed PNG
USED FOR: The v3 cohesion anchor — judged by eye, NEVER sliced or shipped; every gameplay image is checked against it.
SUBJECT BRIEF:
SUBJECT: one wide reference vignette of the book-world at the full v3 craft bar: a rolling paper-earth meadow with a CLEAN smooth-shaded soil bank (soft tonal bands, a couple of hand-placed pebbles and a half-buried letter — NOT a field of noise), an overhanging irregular grass lip with soft tufts and gentle ambient shadow beneath, one climbing pencil-pole with a small cyan flag, a small white schoolhouse with softly-shaded roof, a friendly round ink-blob creature with big readable eyes standing on the meadow, and a darker low-contrast dithered rock-wall mass behind. Warm late light from the top-left. This single image must SELL the shift from the old grainy look to smooth HD pixel. 1024×640, full-bleed.

---
CARD 2 · filename: terrain3_sheet.png · CLASS: GAMEPLAY (HD pixel)
SAVE TO: ~/Code/codex-art-lab/batch-w/ch01/terrain3_sheet.png
SIZE: 1024×768 (labelled 48px grid)
FORMAT: tile-sheet on SOLID magenta #FF00FF, 48px grid, 4px gutter, tiles edge-tileable where noted
USED FOR: The ch01 terrain set at the v3 bar — sliced into earth/grass/edge/slope tiles that replace the procedural terrain. The 'beautiful ground' calibration.
SUBJECT BRIEF:
SUBJECT: a labelled tile-sheet of book-world earth for chapter 1 (GREEN accent), each cell 48×48, edge-tileable: (1-3) EARTH FILL ×3 gentle variants — smooth warm-brown soil in soft horizontal strata, each variant with ONE or TWO hand-placed accents (a pebble, a small root, a faint buried letter) and lots of clean space between; (4) GRASS TOP — a fresh-green grass band with an organic overhanging lip and soft tufts, tiles left↔right, gentle shadow where it meets earth; (5) GRASS TOP-LEFT CORNER, (6) GRASS TOP-RIGHT CORNER; (7) LEFT EARTH EDGE, (8) RIGHT EARTH EDGE (soil face with a clean vertical shade); (9) SLOPE UP 45° (grass-topped), (10) SLOPE DOWN 45° (grass-topped); (11) INNER/UNDERGROUND EARTH (darker, lower-contrast, for deep fill); (12) a small ROCK-LEDGE tile. Smooth HD shading, ZERO speckle noise, top-left light. FORMAT: PNG tile-sheet on SOLID magenta #FF00FF, a clean labelled grid of 48×48 cells with a 4px gutter, each tile self-contained and edge-tileable where noted (grass tops tile left↔right; earth tiles all four ways).

---
CARD 3 · filename: hero3_calib_sheet.png · CLASS: GAMEPLAY (HD pixel) · 🚦 GATE CLUSTER
SAVE TO: ~/Code/codex-art-lab/batch-w/hero/hero3_calib_sheet.png
SIZE: 768×256 (3×1, 256px cells)
FORMAT: pose-sheet on SOLID magenta #FF00FF (no transparency)
USED FOR: Hero stand + two run frames at the v3 bar — a GATE PREVIEW: Koki judges whether the whole cast is regenerated to match (the real hero comes from card hero3_sheet). Not sliced.
SUBJECT BRIEF:
THE HERO (identical design every cell): schoolkid ~10, mid-brown messy hair, mustard-yellow shirt, dark trousers, brown cross-body satchel, red scarf, giant white quill pen with a gold nib strapped on the back.

SUBJECT: 3 cells, the hero side-on facing RIGHT at the HD bar, ~180px tall centered in each 256px cell: (1) STAND — relaxed idle, quill visible over the shoulder; (2) RUN A — mid-stride, scarf trailing; (3) RUN B — opposite stride. Smooth rounded shading, expressive face, clean silhouette, subtle rim-light. FORMAT: PNG pose-sheet on SOLID magenta #FF00FF (no transparency — chroma-keyed later). Clean grid, equal cells, generous margins, nothing touching cell borders.

---
CARD 4 · filename: st_calib_sheet.png · CLASS: GAMEPLAY (HD pixel) · 🚦 GATE CLUSTER
SAVE TO: ~/Code/codex-art-lab/batch-w/ch01/st_calib_sheet.png
SIZE: 512×256 (2×1, 256px cells)
FORMAT: pose-sheet on SOLID magenta #FF00FF (no transparency)
USED FOR: The pencil school-thing WILD + FREED at the v3 bar — a GATE PREVIEW of the two-skin law at the new craft (the real cast comes from st_a3/st_b3). Not sliced.
SUBJECT BRIEF:
SUBJECT: 2 cells of a living PENCIL character (a yellow-and-wood pencil with a face, little arms/legs, big readable eyes), ~170px in each cell: (1) WILD — bewitched: tangled in a couple of soft ink-knot threads, cross expression, a faint grey drain over its colour; (2) FREED — bright, happy, threads gone, full warm colour, a little hop. Melancholy-comic when wild, joyful when free; smooth HD shading, never scary. FORMAT: PNG pose-sheet on SOLID magenta #FF00FF (no transparency — chroma-keyed later). Clean grid, equal cells, generous margins, nothing touching cell borders.

---
CARD 5 · filename: worldmap_painted.png · CLASS: CUTSCENE/BACKDROP (painted)
SAVE TO: ~/Code/codex-art-lab/batch-w/map/worldmap_painted.png
SIZE: 2048×1536
FORMAT: full-bleed PNG
USED FOR: The ENTIRE world map as one PAINTED artwork (class CUTSCENE) — replaces the pixel worldmap_book. The engine composites pixel buildings/hero/NPCs ON the painted clearings; the painting shows the LAND with empty building plots.
SUBJECT BRIEF:
SUBJECT: one continuous PAINTED (not pixel) top-down-ish (3/4 view) WORLD MAP of the book-world — a beautiful storybook map. An ENORMOUS OPEN BOOK seen from above fills the frame; its two cream pages are the land, with faint ruled lines and soft paper grain. On the pages: warm painted meadows, winding dark INK PATHS connecting FIFTEEN round CLEARINGS (leave the clearings EMPTY and softly trampled ~180px — buildings composite later), painted page-leaf trees and ink bushes between paths, a calm ink-river across the right page with two little bridges, letter-fossils half-buried at path bends, the page edges curling up at the frame (the world's edge), the spine a gentle central valley with a rope bridge. Roughly: the first/largest clearing lower-center-left, then center-right, upper-center-left, upper-right, mid-left, and ten more toward the top in quieter, paler paper (not yet awake). Warm late light, painterly, dense with texture, professional picture-book quality. 2048×1536, full-bleed.

---
CARD 6 · filename: hero3_sheet.png · CLASS: GAMEPLAY (HD pixel)
SAVE TO: ~/Code/codex-art-lab/batch-w/hero/hero3_sheet.png
SIZE: 1024×1024 (4×4, 256px cells)
FORMAT: pose-sheet on SOLID magenta #FF00FF (no transparency)
USED FOR: The full hero at the v3 bar. Slices → hero3_stand, run1-4, jump, fall, pogo1-2, climb1-2 (drawn ON a pole, centered), hang, idle, lookup, lookdown.
SUBJECT BRIEF:
THE HERO (identical design every cell): schoolkid ~10, mid-brown messy hair, mustard-yellow shirt, dark trousers, brown cross-body satchel, red scarf, giant white quill pen with a gold nib strapped on the back.

SUBJECT: a 4×4 sheet (16 cells, reading order), the hero side-on facing RIGHT unless noted, ~180px tall centered in each 256px cell: 1 STAND · 2-5 RUN cycle (4 frames) · 6 JUMP (rising, knees up) · 7 FALL (arms out) · 8-9 POGO (compressed on the stick / extended) · 10-11 CLIMB (both hands on a vertical pencil-pole, the pole drawn THROUGH the hero's center so it reads as climbing ON it, two alternating frames) · 12 HANG (gripping a ledge from below) · 13 IDLE (relaxed, blinking) · 14 LOOK-UP (head tilted up) · 15 LOOK-DOWN (peering down) · 16 SIT. Consistent design, smooth HD shading, clean silhouettes. FORMAT: PNG pose-sheet on SOLID magenta #FF00FF (no transparency — chroma-keyed later). Clean grid, equal cells, generous margins, nothing touching cell borders.

---
CARD 7 · filename: st_a3_sheet.png · CLASS: GAMEPLAY (HD pixel)
SAVE TO: ~/Code/codex-art-lab/batch-w/ch01/st_a3_sheet.png
SIZE: 1024×768 (4×3, 256px cells)
FORMAT: pose-sheet on SOLID magenta #FF00FF (no transparency)
USED FOR: Six school-things ×2 skins at the v3 bar. Slices → st_pencil3_wild/free, st_pen3_wild/free, st_rubber3_wild/free, st_ruler3_wild/free, st_scissors3_wild/free, st_glue_stick3_wild/free.
SUBJECT BRIEF:
SUBJECT: a 4×3 sheet (12 cells) of living SCHOOL-THING characters, each ~170px, WILD then FREED for six objects (reading order, two cells each): PENCIL, PEN, RUBBER (eraser), RULER, SCISSORS, GLUE STICK. WILD = bewitched (tangled in a soft ink-knot thread, cross expression, a grey drain over its colour); FREED = bright, happy, full colour, threads gone. Each a clear, recognisable object with a face, little limbs, big readable eyes. Melancholy-comic wild, joyful free; smooth HD shading, never scary. FORMAT: PNG pose-sheet on SOLID magenta #FF00FF (no transparency — chroma-keyed later). Clean grid, equal cells, generous margins, nothing touching cell borders.

---
CARD 8 · filename: st_b3_sheet.png · CLASS: GAMEPLAY (HD pixel)
SAVE TO: ~/Code/codex-art-lab/batch-w/ch01/st_b3_sheet.png
SIZE: 1024×768 (4×3, 256px cells)
FORMAT: pose-sheet on SOLID magenta #FF00FF (no transparency)
USED FOR: Five more school-things ×2 skins + a spare. Slices → st_pencil_case3_wild/free, st_exercise_book3_wild/free, st_watercolours3_wild/free, st_paintbrush3_wild/free, st_pencil_sharpener3_wild/free, st_book3_wild/free.
SUBJECT BRIEF:
SUBJECT: a 4×3 sheet (12 cells) of living SCHOOL-THING characters, each ~170px, WILD then FREED for six objects (reading order, two cells each): PENCIL CASE, EXERCISE BOOK, WATERCOLOURS (paint set), PAINTBRUSH, PENCIL SHARPENER, BOOK. WILD = bewitched (soft ink-knot thread, cross, grey drain); FREED = bright, happy, full colour. Faces, little limbs, big readable eyes; smooth HD shading, never scary. FORMAT: PNG pose-sheet on SOLID magenta #FF00FF (no transparency — chroma-keyed later). Clean grid, equal cells, generous margins, nothing touching cell borders.

---
CARD 9 · filename: boss3_sheet.png · CLASS: GAMEPLAY (HD pixel)
SAVE TO: ~/Code/codex-art-lab/batch-w/ch01/boss3_sheet.png
SIZE: 1024×512 (2×2, 512×256 cells)
FORMAT: pose-sheet on SOLID magenta #FF00FF (no transparency)
USED FOR: The Schlinger at the v3 bar. Slices → boss3_head_idle, boss3_head_tell, boss3_card, boss3_burst.
SUBJECT BRIEF:
SUBJECT: a 2×2 sheet for the chapter-1 guardian, DER STUNDENPLAN-SCHLINGER — a school TIMETABLE grid come alive, knotted into a grumpy-lonely creature: a big ruled-paper body, tangled ink-thread limbs, a wide mouth that swallows lesson-cards, heavy sleepy eyes (grumpy, never scary — it hoards the first lesson because it is lonely). Cell 1: HEAD/BODY IDLE (~440×220px, breathing). Cell 2: TELEGRAPH (rearing, mouth open, threads taut, eyes wide — a half-second-readable dodge cue). Cell 3: LESSON CARD (~200×140px, ruled paper, a knot-seal corner). Cell 4: BURST (the unknot poof — freed letters + thread-bits, ~300×220px, magenta-keyed, nothing touching borders). Smooth HD shading. FORMAT: PNG pose-sheet on SOLID magenta #FF00FF (no transparency — chroma-keyed later). Clean grid, equal cells, generous margins, nothing touching cell borders.

---
CARD 10 · filename: ghost3_sheet.png · CLASS: GAMEPLAY (HD pixel)
SAVE TO: ~/Code/codex-art-lab/batch-w/ch01/ghost3_sheet.png
SIZE: 1024×512 (4×2, 256px cells)
FORMAT: pose-sheet on SOLID magenta #FF00FF (no transparency)
USED FOR: The verzauberter Schüler at the v3 bar. Slices → gs3_sing, gs3_stand, gs3_write, gs3_window, gs3_speak, gs3_books, gs3_friendly, gs3_sad.
SUBJECT BRIEF:
SUBJECT: a 4×2 sheet (8 cells) of a bewitched SCHOOLCHILD — a soft translucent ink-blue ghost-kid (still clearly a child, never scary), ~170px each, one action per cell for a 'give the right command' duel: 1 SINGING (mouth wide, music notes) · 2 STANDING UP (mid-rise from a chair) · 3 WRITING (scribbling on a desk) · 4 AT THE WINDOW (reaching to open it) · 5 SPEAKING (loud, hand cupped) · 6 with BOOKS (arms full) · 7 FRIENDLY (calm, smiling, full soft colour — the freed state) · 8 SAD (slumped, grey, the start state). Expressive, melancholy-comic; smooth HD shading. FORMAT: PNG pose-sheet on SOLID magenta #FF00FF (no transparency — chroma-keyed later). Clean grid, equal cells, generous margins, nothing touching cell borders.

---
CARD 11 · filename: swarm3_sheet.png · CLASS: GAMEPLAY (HD pixel)
SAVE TO: ~/Code/codex-art-lab/batch-w/ch01/swarm3_sheet.png
SIZE: 1024×512 (4×2, 256px cells)
FORMAT: pose-sheet on SOLID magenta #FF00FF (no transparency)
USED FOR: The number-swarm cloud at the v3 bar. Slices → digit3_orb, digit3_glow, cloud3_a, cloud3_b, cloud3_c, cloud3_d, swirl3_a, swirl3_b (the engine tints/labels digit orbs per number and drifts the wisps into a cloud).
SUBJECT BRIEF:
SUBJECT: a 4×2 sheet (8 cells) for a drifting NUMBER-SWARM cloud, each ~170px: (1) DIGIT ORB — a soft glowing ink-paper bubble sized to hold one big number, blank centre (the engine draws the digit), gentle rim-glow; (2) DIGIT ORB GLOW — brighter variant; (3-6) CLOUD WISP ×4 — soft translucent ink-cloud puffs of varied shape that mass together into a swirling barrier; (7-8) SWIRL ×2 — curling motion streaks. Airy, alive, a little mischievous, never scary; smooth HD shading. FORMAT: PNG pose-sheet on SOLID magenta #FF00FF (no transparency — chroma-keyed later). Clean grid, equal cells, generous margins, nothing touching cell borders.

---
CARD 12 · filename: classroom3_sheet.png · CLASS: GAMEPLAY (HD pixel)
SAVE TO: ~/Code/codex-art-lab/batch-w/ch01/classroom3_sheet.png
SIZE: 1024×768 (4×3, 256px cells)
FORMAT: pose-sheet on SOLID magenta #FF00FF (no transparency)
USED FOR: The six restoration-room objects, GREY + COLOUR, at the v3 bar. Slices → cr_chair3_grey/color, cr_desk3_grey/color, cr_board3_grey/color, cr_door3_grey/color, cr_window3_grey/color, cr_school_bag3_grey/color.
SUBJECT BRIEF:
SUBJECT: a 4×3 sheet (12 cells) of classroom objects, each ~180px, GREY (drained, colourless, still — the bewitched night state) then full COLOUR (warm, lit, alive) for six objects (reading order, two cells each): CHAIR, DESK, BOARD (blackboard), DOOR, WINDOW, SCHOOL BAG. Each object with a gentle sleepy face (the book's 'Midnight in the classroom' fiction). GREY = desaturated with soft shading intact; COLOUR = each its natural warm colour. Smooth HD shading, never scary. FORMAT: PNG pose-sheet on SOLID magenta #FF00FF (no transparency — chroma-keyed later). Clean grid, equal cells, generous margins, nothing touching cell borders.

---
CARD 13 · filename: buildings3_sheet.png · CLASS: GAMEPLAY (HD pixel)
SAVE TO: ~/Code/codex-art-lab/batch-w/map/buildings3_sheet.png
SIZE: 1024×768 (4×3, 256px cells)
FORMAT: pose-sheet on SOLID magenta #FF00FF (no transparency)
USED FOR: Five Act-1 chapter buildings, DRAINED + ALIVE, for the painted map. Slices → bld3_ch01_sad/alive, bld3_ch02_sad/alive, bld3_ch03_sad/alive, bld3_ch04_sad/alive, bld3_ch05_sad/alive, bld3_locked.
SUBJECT BRIEF:
SUBJECT: a 4×3 sheet (12 cells) of storybook chapter-buildings for the world map, each ~200px, DRAINED (grey, dim, still) then ALIVE (warm, lit windows, a little sparkle) for five places (reading order, two cells each): 1 SCHOOLHOUSE (ch01), 2 ZOO GATE (ch02), 3 PIRATE SHIP / harbour (ch03), 4 a FEELINGS/heart cottage (ch04), 5 a BAND/music hall (ch05); plus cell 11 a LOCKED-generic building (grey, a soft knot over the door) and cell 12 spare. Each sits on a small trampled-paper plot. Smooth HD shading; the ALIVE versions clearly, joyfully awake. FORMAT: PNG pose-sheet on SOLID magenta #FF00FF (no transparency — chroma-keyed later). Clean grid, equal cells, generous margins, nothing touching cell borders.

---
CARD 14 · filename: decor3_sheet.png · CLASS: GAMEPLAY (HD pixel)
SAVE TO: ~/Code/codex-art-lab/batch-w/ch01/decor3_sheet.png
SIZE: 1024×512 (4×2, 256px cells)
FORMAT: pose-sheet on SOLID magenta #FF00FF (no transparency)
USED FOR: Level decor + the readable hazard at the v3 bar. Slices → prop_pole3, prop_gluehwort3, prop_seal3, prop_spikes3, dec_fence3, dec_tree3, dec_bush3, prop_door3.
SUBJECT BRIEF:
SUBJECT: a 4×2 sheet (8 cells), each ~180px: (1) PENCIL-POLE — a tall climbable pencil (the pole), vertical, tileable; (2) GLÜHBUCHSTABE — a single glowing golden letter with a warm halo (the free-hint pickup, must read as 'glowing'); (3) STUNDENSEITE SEAL — a knotted lesson-page medallion, warm glow; (4) INK-NIB SPIKES — a low row of sharp dark ink-nib points, clearly a DANGER (readable as 'do not touch'), sitting on the ground; (5) FENCE — a low wooden picket segment, tileable; (6) PAGE-LEAF TREE; (7) INK BUSH; (8) CLASSROOM DOOR — a friendly framed wooden door for the restoration-room entrance. Smooth HD shading, storybook, top-left light. FORMAT: PNG pose-sheet on SOLID magenta #FF00FF (no transparency — chroma-keyed later). Clean grid, equal cells, generous margins, nothing touching cell borders.

---
CARD 15 · filename: portraits3_sheet.png · CLASS: GAMEPLAY (HD pixel)
SAVE TO: ~/Code/codex-art-lab/batch-w/cast/portraits3_sheet.png
SIZE: 1024×512 (4×2, 256px cells)
FORMAT: pose-sheet on SOLID magenta #FF00FF (no transparency)
USED FOR: Six cast portraits at the v3 bar for cards/finale. Slices → p3_finn, p3_pixel, p3_berger, p3_tintengeist, p3_jona, p3_ghost.
SUBJECT BRIEF:
SUBJECT: a 4×2 sheet (6 used cells, 2 blank) of head-and-shoulders PORTRAITS, each ~200px, warm and friendly: 1 FINN (a floating open paper book with two big friendly dot-eyes on the left page, ink spine) · 2 PIXEL (a small black cat, huge amber eyes, one ear tipped) · 3 FRAU BERGER (warm Austrian teacher, cardigan, glasses on a cord) · 4 DER TINTENGEIST (a soft rounded dark-ink spirit, calm white eyes, lonely-not-evil) · 5 JONA (a friendly schoolkid, the note-writer) · 6 THE FREED GHOST-STUDENT (soft ink-blue child, smiling). Smooth HD shading, expressive, never scary. FORMAT: PNG pose-sheet on SOLID magenta #FF00FF (no transparency — chroma-keyed later). Clean grid, equal cells, generous margins, nothing touching cell borders.

---
END OF COMMISSION. After the final card, print a manifest of every filename you
produced, in order, marked DONE or REGENERATED.
