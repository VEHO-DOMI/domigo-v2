# MISSION: produce the complete image set for "DomiGo — Batch V" (14 images, TWO style classes)

You are a senior illustrator AND pixel artist executing a fixed commission for a
children's English-learning game. Work AUTONOMOUSLY through the numbered cards
below, in order, one image per card. Do not skip, reorder, merge, or reinterpret.

## THE TWO STYLE CONTRACTS (each card names its class — re-read the right one before EVERY image)

### CLASS CUTSCENE / BACKDROP (painted)
STYLE (strict, class CUTSCENE): a warmly PAINTED children's storybook illustration — NOT pixel art. Soft painterly brushwork, gentle gradients, clean shapes, professional picture-book quality (think modern illustrated children's novels). PALETTE: build every scene from the mood of this EGA-derived family — deep ink blues/blacks, warm paper cream, mustard yellow #fcfc54, warm brown #a85400, fresh green #00a800, sky cyan #54fcfc, accent red #fc5454 — painted freely (shades and gradients allowed), so the painted scenes and the in-game pixel world read as ONE world. RECURRING CAST (identical design every time they appear): THE HERO — a schoolkid of about 10, mid-brown messy hair, mustard-yellow shirt, dark trousers, small brown cross-body satchel, red scarf, a giant white quill pen (gold nib) strapped on the back. FINN — a floating open paper book AS a person: cream pages like wings, dark ink spine, two big friendly black dot-eyes on the left page, tiny ink eyebrows. PIXEL — a small black cat with huge amber-yellow eyes, one ear tipped. FRAU BERGER — a warm Austrian primary-school teacher, cardigan, reading glasses on a cord. DER TINTENGEIST — a soft rounded spirit of dark blue-black ink, calm white eyes, never menacing. Mood: warm, curious, a little wistful where the world is grey — NEVER scary (no horror, no sharp teeth, no darkness-as-threat; this is for 10-year-olds learning English). No text, no watermarks, no borders.

### CLASS GAMEPLAY (pixel — the Keen 4 craft bar)
STYLE (strict, class GAMEPLAY — the Commander Keen 4 craft bar): 1991 EGA pixel art AT THE CRAFT LEVEL OF COMMANDER KEEN 4. Study the provided reference crops FIRST — your output must sit next to them without looking simpler. Use ONLY these 16 colors: #000000 #0000a8 #00a800 #00a8a8 #a80000 #a800a8 #a85400 #a8a8a8 #545454 #5454fc #54fc54 #54fcfc #fc5454 #fc54fc #fcfc54 #fcfcfc. Crisp square pixels, zero anti-aliasing, zero smooth gradients. THE ANTI-FLAT LAW: no large flat single-color area anywhere — every surface carries pixel-level texture the way Keen 4's do: dense 1-pixel dithering (checkerboard AND irregular scatter) between neighboring tones, plus material patterns drawn INTO the surface (rock strata and pebble clusters, wood-grain strokes, leaf veins, paper fibre and faint ruled lines for our book-world earth). TONE RAMPS: 3-4 tones per material (dark shade — often black or the hue's dark EGA partner — then base, bright, and a small highlight), light from the top-left, shade to the bottom-right. SILHOUETTES: rounded and ORGANIC — grass lips overhang their earth band with irregular tufts, rock edges chip, trunks bulge at the roots; ruler-straight edges belong only to man-made objects (planks, doors, rulers). Background-wall areas inside a tile read as darker, lower-contrast dithered masses so the walk surface pops. SPRITES: bold black contour with interior detail lines, a real light source (specular dot on round forms), big readable eyes, poses readable in half a second. Friendly storybook mood — this is a children's English-learning game set INSIDE a book: ink, paper, letters. Never scary: no monsters, no horror; melancholy-comic, not menacing.

## WORKING RULES
0b. READ THE METHOD FIRST: `~/Code/codex-art-lab/CODEX_METHOD.md` is the
   standing working method of this lab (ground truth, calibration, hostile
   self-review, the sandbox law, the pitfall registry CP-1..CP-7). Read it
   fully before card 1. If it is missing, say so and continue.
0a. STUDY THE REFERENCES FIRST: the user has placed reference images at
   `~/Code/codex-art-lab/refs-t/` — open and study EVERY one before card 1.
   The `ref_keen_*` crops are the CRAFT BAR for all GAMEPLAY cards: match
   their dithering density, 3-4-tone material ramps, organic silhouettes and
   zero-flat-surface texture — an output that looks simpler than these crops
   is a FAIL. `hero-v1.png` fixes the hero's canonical DESIGN (costume,
   proportions) — render it at the Keen craft level, not at its simpler v1
   rendering. If the folder is missing, say so, then continue on the written
   contract alone.
0. YOUR ONE AND ONLY WRITE LOCATION IS THE SANDBOX FOLDER:
   `~/Code/codex-art-lab/batch-v/` — create it (and its subfolders) if missing.
   Save every image there under the exact SAVE TO path its card names.
   NEVER write, modify, move, or delete ANYTHING anywhere else — no git
   repository, no other folder, no existing file. Everywhere else you are
   strictly read-only. A separate pipeline (not you) later QA-checks, slices,
   and imports your images into the game.
1. CARD 1 IS THE PAINTED STYLE KEY — generate it first; every later CUTSCENE/
   BACKDROP image must match it in palette-mood, brushwork and cast design.
   The GAMEPLAY cards must match the established Batch S pixel look instead
   (same hero, same palette, same outline weight).
2. Before each image, print exactly: `NOW GENERATING: <filename>` — then
   generate, then SAVE it yourself to the card's SAVE TO path (rule 0) and
   print `SAVED: <full path>`.
3. AFTER each image, run the class-matched self-check, print PASS/FAIL per
   line — on any FAIL, regenerate ONCE with the failure named in the prompt:
   CUTSCENE/BACKDROP cards:
   - PAINTED: soft painterly rendering, ZERO chunky pixels, zero dithering
   - RESOLUTION: exactly the card's size, sharp at full-screen
   - CAST: every named character matches the cast descriptions exactly
   - MOOD: warm storybook, nothing scary, no text/watermarks/borders
   - TILING (only where the card demands it): left/right edges join seamlessly
   GAMEPLAY cards:
   - PALETTE: only the 16 contract colors (no off-palette hues, no gradients)
   - PIXELS: crisp squares, zero anti-aliasing
   - CRAFT: no flat single-color areas — dithered texture + 3-4-tone ramps +
     organic silhouettes at the density of the ref_keen_* crops
   - FORMAT: as carded — solid #FF00FF magenta pose-sheet with clean grid /
     TRUE-alpha transparency / grid-cut sheet filled edge-to-edge with NO magenta
   - SUBJECT: every element present and readable at game size
4. SHEETS: equal cells, SAME character/design in every cell (only pose changes);
   grid-cut sheets are filled completely, chroma sheets keep clear magenta gaps.
5. If you hit a session or generation limit, print exactly:
   `CONTINUE AT CARD <n>` — you will be restarted with this same document and
   "continue at card <n>", and you resume from there.
6. Never invent extra images, text, watermarks, signatures, or borders.

## THE CARDS
---
CARD 1 · filename: worldmap_book.png · CLASS: GAMEPLAY (pixel)
SAVE TO: ~/Code/codex-art-lab/batch-v/map/worldmap_book.png
SIZE: 2048×1536
FORMAT: full-bleed PNG
USED FOR: The ENTIRE world map as one coherent Keen-4-style map artwork. The engine overlays walkability, buildings (on the clearings), NPCs and sparkles — so the artwork shows the LAND, with empty building plots.
SUBJECT BRIEF:
SUBJECT: one continuous top-down-ish (3/4 view) WORLD MAP of the book-world, in the exact manner of Commander Keen 4's Shadowlands world map (study the refs): an ENORMOUS OPEN BOOK seen from above fills the frame — its two cream paper pages are the land. On the pages: warm paper-meadows with faint ruled lines and paper grain, winding dark INK PATHS connecting FIFTEEN round CLEARINGS (leave the clearings EMPTY — buildings are composited later; make each clearing a soft trampled-paper circle ~180px), page-leaf trees and ink bushes scattered between paths, a calm dark ink-river crossing the right page with two small ink bridges, letter-fossils half-buried near path bends, the page edges CURLING UP at the frame borders (the world's edge), the book's spine running down the middle as a gentle valley with a rope bridge. Clearing placement, roughly: lower-center-left (the first, largest), center-right, upper-center-left, upper-right, mid-left, and ten more spread over both pages toward the top (those ten in slightly grayer, quieter paper — not yet awake). Warm, alive, dense with texture — NO flat areas. 2048×1536, full-bleed.

---
CARD 2 · filename: bgp_schoolhouse_arena.png · CLASS: CUTSCENE/BACKDROP (painted)
SAVE TO: ~/Code/codex-art-lab/batch-v/ch01/bgp_schoolhouse_arena.png
SIZE: 2048×1024
FORMAT: full-bleed PNG
USED FOR: The Schlinger duel arena — painted backdrop behind the boss fight (class BACKDROP).
SUBJECT BRIEF:
SUBJECT: a PAINTED wide interior backdrop for the chapter-1 boss duel: the school attic at dusk — timber beams, stacked old desks and rolled maps in shadow, one round window spilling warm evening light, chalk dust in the air, a huge timetable grid faintly chalked on the back wall (empty cells, no readable text), knotted ink threads creeping along the beams. Atmospheric, warm-tense, never scary. NO characters, NO foreground objects below the lower third (the fight happens there). 2048×1024, full-bleed.

---
CARD 3 · filename: hero2_sheet.png · CLASS: GAMEPLAY (pixel)
SAVE TO: ~/Code/codex-art-lab/batch-v/hero/hero2_sheet.png
SIZE: 1024×1024 (4×4 grid, 256px cells)
FORMAT: pose-sheet on SOLID magenta #FF00FF (no transparency)
USED FOR: Hero pose set v2 — sliced into hero2_stand/run1-4/jump/fall/pogo1-2/climb1-2/hang/idle/lookup/lookdown/sit. Replaces the Batch S set (below the craft bar). CLIMB IS DRAWN ON THE POLE.
SUBJECT BRIEF:
SUBJECT: a 4×4 pose sheet. THE HERO (identical design every cell): schoolkid ~10, mid-brown messy hair, mustard-yellow shirt, dark trousers, brown cross-body satchel, red scarf, giant white quill pen (gold nib) on the back. Side view facing RIGHT unless stated, ~200px tall per 256px cell. Reading order: 1 stand · 2-5 run cycle (contact, pass, contact-other, pass; scarf trailing) · 6 jump (knees tucked) · 7 fall (arms out) · 8 pogo compressed (riding the quill nib-down) · 9 pogo extended · 10-11 CLIMB: facing CAMERA, both hands gripping a vertical yellow PENCIL-POLE that runs through the FULL cell height at the cell's exact horizontal CENTER, the body's centerline ON the pole (hands alternate between the two frames) · 12 hang (facing camera, arms up on a ledge) · 13 idle blink (eyes closed, relaxed) · 14 look UP (head and eyes up, hand shading brow) · 15 look DOWN (leaning forward, peering below) · 16 sitting and reading a small open book (Keen's idle). FORMAT: PNG pose-sheet on SOLID magenta #FF00FF (no transparency — chroma-keyed later). Clean grid, equal cells, nothing touching cell borders.

---
CARD 4 · filename: st_a_sheet.png · CLASS: GAMEPLAY (pixel)
SAVE TO: ~/Code/codex-art-lab/batch-v/ch01/st_a_sheet.png
SIZE: 1024×768 (4×3 grid, 256px cells)
FORMAT: pose-sheet on SOLID magenta #FF00FF (no transparency)
USED FOR: School-thing characters A (6 things × 2 poses) — sliced into st_pencil_wild/free, st_pen_wild/free, st_rubber_wild/free, st_ruler_wild/free, st_scissors_wild/free, st_glue_stick_wild/free.
SUBJECT BRIEF:
SUBJECT: a 4×3 sheet (12 cells) of SCHOOL-THING CHARACTERS in the manner of MORE! 1's "Midnight in the classroom" (living school supplies with googly eyes and stick limbs), each ~180px, centered: pairs of WILD (tangled in fine ink knot-threads, brows angry-comic, mid-lunge) and FREED (threads gone, smiling, relaxed) for: 1-2 PENCIL · 3-4 PEN (ballpoint) · 5-6 RUBBER (eraser block) · 7-8 RULER · 9-10 SCISSORS · 11-12 GLUE STICK. Wild versions read mischievous, never menacing. FORMAT: PNG pose-sheet on SOLID magenta #FF00FF (no transparency — chroma-keyed later). Clean grid, equal cells, nothing touching cell borders.

---
CARD 5 · filename: st_b_sheet.png · CLASS: GAMEPLAY (pixel)
SAVE TO: ~/Code/codex-art-lab/batch-v/ch01/st_b_sheet.png
SIZE: 1280×512 (5×2 grid, 256px cells)
FORMAT: pose-sheet on SOLID magenta #FF00FF (no transparency)
USED FOR: School-thing characters B (5 things × 2 poses) — sliced into st_pencil_case_wild/free, st_exercise_book_wild/free, st_watercolours_wild/free, st_paintbrush_wild/free, st_pencil_sharpener_wild/free.
SUBJECT BRIEF:
SUBJECT: a 5×2 sheet (10 cells), SAME character language as the first school-things sheet (living supplies, googly eyes, stick limbs, ~180px): wild/freed pairs for: 1-2 PENCIL CASE (zipper mouth, like the book's "I hate pink!" case) · 3-4 EXERCISE BOOK (flapping covers) · 5-6 WATERCOLOURS (paint box, rainbow pans) · 7-8 PAINTBRUSH · 9-10 PENCIL SHARPENER (two-hole nose). FORMAT: PNG pose-sheet on SOLID magenta #FF00FF (no transparency — chroma-keyed later). Clean grid, equal cells, nothing touching cell borders.

---
CARD 6 · filename: ghost_student_sheet.png · CLASS: GAMEPLAY (pixel)
SAVE TO: ~/Code/codex-art-lab/batch-v/ch01/ghost_student_sheet.png
SIZE: 1024×512 (4×2 grid, 256px cells)
FORMAT: pose-sheet on SOLID magenta #FF00FF (no transparency)
USED FOR: The ghost-student — sliced into gs_sing/gs_stand/gs_write/gs_window/gs_speak/gs_books/gs_friendly/gs_sad. Each antic must be READABLE in half a second (the imperative duel's prompt IS this art).
SUBJECT BRIEF:
SUBJECT: a 4×2 sheet (8 cells) of ONE ghostly schoolkid — a translucent pale-blue child sketched in wobbly ink lines, big sad-mischievous eyes, a faint knot-thread around one ankle (~190px, centered). One clear ACTION per cell: 1 SINGING loudly (head back, music notes) · 2 STANDING ON a school desk, arms up · 3 SCRIBBLING on a desktop with a crayon · 4 FLINGING a window open (cold-air squiggles) · 5 CHATTERING (speech-squiggle bubbles, hands waving) · 6 BOOKS scattered on the floor around crossed arms · 7 FRIENDLY (warm smile, small wave, knot-thread gone, slightly more solid/colored) · 8 SAD-DRAINED (hunched, grey, the 'before' portrait). Comic, gentle, never scary. FORMAT: PNG pose-sheet on SOLID magenta #FF00FF (no transparency — chroma-keyed later). Clean grid, equal cells, nothing touching cell borders.

---
CARD 7 · filename: digits_sheet.png · CLASS: GAMEPLAY (pixel)
SAVE TO: ~/Code/codex-art-lab/batch-v/ch01/digits_sheet.png
SIZE: 1024×768 (4×3 grid, 256px cells)
FORMAT: pose-sheet on SOLID magenta #FF00FF (no transparency)
USED FOR: Digit orbs 0-9 + 2 swirl puffs — sliced into digit_0..digit_9, swirl_a, swirl_b (the number-swarm barrier).
SUBJECT BRIEF:
SUBJECT: a 4×3 sheet (12 cells): cells 1-10 are DIGIT ORBS 0,1,2,3,4,5,6,7,8,9 — each one big bold ink-drawn digit (~150px tall) inside a round glowing paper token with tiny wing-flutters and worried dot-eyes (the bewitched numbers swarm — mid-air, slightly tilted, each a different tilt) · cells 11-12: two SWIRL PUFFS of tiny scrambled digits and ink-wisps (the swarm's body, ~200px round). FORMAT: PNG pose-sheet on SOLID magenta #FF00FF (no transparency — chroma-keyed later). Clean grid, equal cells, nothing touching cell borders.

---
CARD 8 · filename: classroom_room_sheet.png · CLASS: GAMEPLAY (pixel)
SAVE TO: ~/Code/codex-art-lab/batch-v/ch01/classroom_room_sheet.png
SIZE: 1024×768 (4×3 grid, 256px cells)
FORMAT: pose-sheet on SOLID magenta #FF00FF (no transparency)
USED FOR: The restoration room's objects — sliced into cr_chair_grey/cr_chair_color, cr_desk_grey/color, cr_board_grey/color, cr_door_grey/color, cr_window_grey/color, cr_school_bag_grey/color.
SUBJECT BRIEF:
SUBJECT: a 4×3 sheet (12 cells) of CLASSROOM OBJECTS in two states, pairs side by side (~190px each, centered): DRAINED (all greys/white, faint pencil-sketch outlines, small sleepy dot-eyes — the midnight-classroom look from MORE! 1) and COLORED (fully alive in its color, eyes bright): 1-2 CHAIR (colored = warm brown) · 3-4 DESK (green) · 5-6 BOARD on a stand (white board, dark frame) · 7-8 DOOR (blue) · 9-10 WINDOW with frame (yellow frame, night sky inside on the drained one, sunny sky on the colored one) · 11-12 SCHOOL BAG (red). FORMAT: PNG pose-sheet on SOLID magenta #FF00FF (no transparency — chroma-keyed later). Clean grid, equal cells, nothing touching cell borders.

---
CARD 9 · filename: alphabet_sheet.png · CLASS: GAMEPLAY (pixel)
SAVE TO: ~/Code/codex-art-lab/batch-v/ch01/alphabet_sheet.png
SIZE: 1792×1024 (7×4 grid, 256px cells)
FORMAT: pose-sheet on SOLID magenta #FF00FF (no transparency)
USED FOR: The 26 alphabet pickups — sliced into alpha_a..alpha_z (cells 27/28 empty magenta). Replaces the generic letter discs; ch01's collectible IS the alphabet (doc 30 §1.3).
SUBJECT BRIEF:
SUBJECT: a 7×4 sheet: cells 1-26 are the CAPITAL LETTERS A through Z in reading order, one per cell — each a chunky ink-drawn capital (~140px tall) on a small round GREEN-glow paper chip (Unit 1's color), with a soft sparkle and a tiny fluttering paper-wing pair (a scattered alphabet trying to fly home). SAME design language every cell, only the glyph changes. Cells 27-28: leave PURE magenta (empty padding). FORMAT: PNG pose-sheet on SOLID magenta #FF00FF (no transparency — chroma-keyed later). Clean grid, equal cells, nothing touching cell borders.

---
CARD 10 · filename: slopes_sheet.png · CLASS: GAMEPLAY (pixel)
SAVE TO: ~/Code/codex-art-lab/batch-v/ch01/slopes_sheet.png
SIZE: 512×256 (2×1 grid, 256px cells)
FORMAT: pose-sheet on SOLID magenta #FF00FF (no transparency)
USED FOR: Sliced into slope_up ('/' rising left→right) and slope_down ('\\'). Must butt seamlessly against the tile_sh_m* terrain skins (same earth, same grass lip).
SUBJECT BRIEF:
SUBJECT: a 2×1 sheet of two TRIANGULAR terrain wedges matching the existing schoolhouse tiles EXACTLY (same warm brown paper-earth with pebbles, ruled lines and letter-fossils; same bright green overhanging grass lip): cell 1 a wedge rising from the BOTTOM-LEFT corner to the TOP-RIGHT corner (the '/' slope — grass lip along the hypotenuse, earth filling below it, the area above the hypotenuse PURE magenta) · cell 2 the mirror wedge falling top-left to bottom-right ('\\'). The earth must run clean to the bottom and side edges so the wedge butts seamlessly onto neighboring full tiles. FORMAT: PNG pose-sheet on SOLID magenta #FF00FF (no transparency — chroma-keyed later). Clean grid, equal cells, nothing touching cell borders.

---
CARD 11 · filename: maphero2_sheet.png · CLASS: GAMEPLAY (pixel)
SAVE TO: ~/Code/codex-art-lab/batch-v/map/maphero2_sheet.png
SIZE: 768×512 (3×2 grid, 256px cells)
FORMAT: pose-sheet on SOLID magenta #FF00FF (no transparency)
USED FOR: Map hero v2 with the missing UP direction — sliced into mh_down1/down2/up1/up2/side1/side2 (side mirrors for left). Bigger presence than v1 (Koki: proportions).
SUBJECT BRIEF:
SUBJECT: a 3×2 sheet of the SAME hero for the top-down world map, chibi proportion, ~170px tall per cell (bigger presence than a standard sprite): 1-2 walking TOWARD camera (step A/B) · 3-4 walking AWAY from camera — back view, satchel and quill visible (step A/B) · 5-6 walking RIGHT (step A/B). THE HERO (identical design every cell): schoolkid ~10, mid-brown messy hair, mustard-yellow shirt, dark trousers, brown cross-body satchel, red scarf, giant white quill pen (gold nib) on the back. FORMAT: PNG pose-sheet on SOLID magenta #FF00FF (no transparency — chroma-keyed later). Clean grid, equal cells, nothing touching cell borders.

---
CARD 12 · filename: mapnpc2_sheet.png · CLASS: GAMEPLAY (pixel)
SAVE TO: ~/Code/codex-art-lab/batch-v/map/mapnpc2_sheet.png
SIZE: 1024×256 (4×1 grid, 256px cells)
FORMAT: pose-sheet on SOLID magenta #FF00FF (no transparency)
USED FOR: Map NPCs v2 — sliced into finn_map2, pixel_map2, flag2, note2.
SUBJECT BRIEF:
SUBJECT: a 4×1 sheet (~170px each, centered): 1 FINN the book-person for the map (floating open paper book with friendly dot-eyes on the left page, ink spine, small bounce pose) · 2 PIXEL the small black cat, sitting, huge amber eyes, tail curled · 3 a small CELEBRATION FLAG on a pole (green pennant with a tiny gold letter shape) · 4 a pinned PAPER NOTE on a wooden post (child's squiggle handwriting, no readable text, one corner lifting). FORMAT: PNG pose-sheet on SOLID magenta #FF00FF (no transparency — chroma-keyed later). Clean grid, equal cells, nothing touching cell borders.

---
CARD 13 · filename: buildings_alive_sheet.png · CLASS: GAMEPLAY (pixel)
SAVE TO: ~/Code/codex-art-lab/batch-v/map/buildings_alive_sheet.png
SIZE: 1536×512 (3×2 grid, 512×256 cells)
FORMAT: pose-sheet on SOLID magenta #FF00FF (no transparency)
USED FOR: Restored-state buildings — sliced into bldx_ch01..bldx_ch05 + bldx_spare. The engine crossfades drained→alive + sparkles on restoration (doc 30 §1.6).
SUBJECT BRIEF:
SUBJECT: a 3×2 sheet of the five Act-1 map buildings in their RESTORED, ALIVE state (~380×200px each, on cream paper ground with soft shadow) — same silhouettes as their drained versions but bursting with life: 1 SCHOOLHOUSE: warm-lit windows, open door, smoke curl, kids' drawings pinned by the door, the flag flying · 2 ZOO GATE: banner up, warm lanterns, a parrot on the arch, open gates · 3 PIRATE SHIP: sail patched and full, lanterns lit, a cheerful flag, gangway down · 4 FEELINGS GARDEN: hedges blooming, heart-topiary green, fountain sparkling · 5 BAND STAGE: bunting bright, drum kit shining, spotlights warm. Cell 6: PURE magenta (padding). FORMAT: PNG pose-sheet on SOLID magenta #FF00FF (no transparency — chroma-keyed later). Clean grid, equal cells, nothing touching cell borders.

---
CARD 14 · filename: portraits2_sheet.png · CLASS: GAMEPLAY (pixel)
SAVE TO: ~/Code/codex-art-lab/batch-v/cast/portraits2_sheet.png
SIZE: 1536×1024 (3×2 grid, 512px cells)
FORMAT: pose-sheet on SOLID magenta #FF00FF (no transparency)
USED FOR: Dialogue portraits v2 at the craft bar — sliced into p2_finn, p2_pixel, p2_berger, p2_tintengeist, p2_jona, p2_ghost.
SUBJECT BRIEF:
SUBJECT: a 3×2 sheet of bust PORTRAITS for dialogue boxes (each ~420px tall in its 512px cell, centered, facing slightly left, readable at 40×40): 1 FINN (open paper book as a person, cream pages, ink spine, big friendly dot-eyes, tiny ink eyebrows) · 2 PIXEL (black cat, huge amber eyes, one ear tipped) · 3 FRAU BERGER (warm teacher, cardigan, reading glasses on a cord) · 4 DER TINTENGEIST (soft rounded ink-spirit, calm white eyes, tiny warm smile) · 5 JONA (tired kid ~11, uncombed hair, oversized sweater, pencil stub, hopeful eyes) · 6 THE GHOST-STUDENT friendly (translucent pale-blue kid, warm smile). FORMAT: PNG pose-sheet on SOLID magenta #FF00FF (no transparency — chroma-keyed later). Clean grid, equal cells, nothing touching cell borders.

---
END OF COMMISSION. After the final card, print a manifest of every filename you
produced, in order, marked DONE or REGENERATED.
