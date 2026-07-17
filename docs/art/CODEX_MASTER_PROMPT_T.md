# MISSION: produce the complete image set for "DomiGo — Batch T" (24 images, TWO style classes)

You are a senior illustrator AND pixel artist executing a fixed commission for a
children's English-learning game. Work AUTONOMOUSLY through the numbered cards
below, in order, one image per card. Do not skip, reorder, merge, or reinterpret.

## THE TWO STYLE CONTRACTS (each card names its class — re-read the right one before EVERY image)

### CLASS CUTSCENE / BACKDROP (painted)
STYLE (strict, class CUTSCENE): a warmly PAINTED children's storybook illustration — NOT pixel art. Soft painterly brushwork, gentle gradients, clean shapes, professional picture-book quality (think modern illustrated children's novels). PALETTE: build every scene from the mood of this EGA-derived family — deep ink blues/blacks, warm paper cream, mustard yellow #fcfc54, warm brown #a85400, fresh green #00a800, sky cyan #54fcfc, accent red #fc5454 — painted freely (shades and gradients allowed), so the painted scenes and the in-game pixel world read as ONE world. RECURRING CAST (identical design every time they appear): THE HERO — a schoolkid of about 10, mid-brown messy hair, mustard-yellow shirt, dark trousers, small brown cross-body satchel, red scarf, a giant white quill pen (gold nib) strapped on the back. FINN — a floating open paper book AS a person: cream pages like wings, dark ink spine, two big friendly black dot-eyes on the left page, tiny ink eyebrows. PIXEL — a small black cat with huge amber-yellow eyes, one ear tipped. FRAU BERGER — a warm Austrian primary-school teacher, cardigan, reading glasses on a cord. DER TINTENGEIST — a soft rounded spirit of dark blue-black ink, calm white eyes, never menacing. Mood: warm, curious, a little wistful where the world is grey — NEVER scary (no horror, no sharp teeth, no darkness-as-threat; this is for 10-year-olds learning English). No text, no watermarks, no borders.

### CLASS GAMEPLAY (pixel)
STYLE (strict): 1991 EGA pixel art in the exact visual language of Commander Keen 4. Use ONLY these 16 colors: #000000 #0000a8 #00a800 #00a8a8 #a80000 #a800a8 #a85400 #a8a8a8 #545454 #5454fc #54fc54 #54fcfc #fc5454 #fc54fc #fcfc54 #fcfcfc. Chunky pixels on a 16px-tile logical grid (render large, but every "pixel" is a crisp square — no anti-aliasing, no smooth gradients, no soft shading). Texture and gradients ONLY as 1-pixel checkerboard dithering between two palette colors. Foreground objects get bold black contour outlines and black interior detail lines; background surfaces stay outline-free. Two tones per material (base + bright of the same hue) with black as the dark shade. Friendly storybook mood — this is a children's English-learning game set INSIDE a book: ink, paper, letters. Never scary: no monsters, no horror, big readable eyes on creatures, melancholy-comic not menacing.

## WORKING RULES
0. YOUR ONE AND ONLY WRITE LOCATION IS THE SANDBOX FOLDER:
   `~/Code/codex-art-lab/batch-t/` — create it (and its subfolders) if missing.
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
CARD 1 · filename: _style_key_cutscene.png · CLASS: CUTSCENE/BACKDROP (painted)
SAVE TO: ~/Code/codex-art-lab/batch-t/_style_key_cutscene.png
SIZE: 1920×1080
FORMAT: full-bleed PNG
USED FOR: The painted-class cohesion reference — synced but never rendered. Every cutscene image is checked against it by eye.
SUBJECT BRIEF:
SUBJECT: the anchor scene of the whole story: the child hero, Finn (the book-person) and Pixel (the cat) stand on a rise inside the book's world — a storybook land drawn ON an open book page, faint ruled lines in the earth, a page curling at the horizon. The nearest meadow glows in warm color; the lands behind fade to soft grey. Warm late light. All three characters exactly as the cast descriptions. 1920×1080, full-bleed.

---
CARD 2 · filename: pv_classroom.png · CLASS: CUTSCENE/BACKDROP (painted)
SAVE TO: ~/Code/codex-art-lab/batch-t/beats/pv_classroom.png
SIZE: 1920×1080
FORMAT: full-bleed PNG
USED FOR: Prologue shot 1 — first English day.
SUBJECT BRIEF:
SUBJECT: a warm Austrian classroom on the first day of English class, seen from a student's seat: wooden desks, morning light through tall windows, a friendly teacher (FRAU BERGER) smiling at the front, a blackboard with a small chalk 'ENGLISH' and a doodled sun. Kids' backs and pencil cases in the foreground, no student faces in focus. Cozy anticipation. 1920×1080, full-bleed.

---
CARD 3 · filename: pv_book_cover.png · CLASS: CUTSCENE/BACKDROP (painted)
SAVE TO: ~/Code/codex-art-lab/batch-t/beats/pv_book_cover.png
SIZE: 1920×1080
FORMAT: full-bleed PNG
USED FOR: Prologue shot 2 — the special book (BOTH flags on the cover).
SUBJECT BRIEF:
SUBJECT: close on the teacher's desk: a beautiful, slightly old-fashioned English textbook lying closed — its cover carries BOTH a British Union Jack AND an American stars-and-stripes flag side by side, plus warm gold lettering-shapes (no readable text). A faint warm glow leaks from between the pages. Frau Berger's hands rest proudly beside it. 1920×1080, full-bleed.

---
CARD 4 · filename: pv_book_glow.png · CLASS: CUTSCENE/BACKDROP (painted)
SAVE TO: ~/Code/codex-art-lab/batch-t/beats/pv_book_glow.png
SIZE: 1920×1080
FORMAT: full-bleed PNG
USED FOR: Prologue shot 3 — the book glows.
SUBJECT BRIEF:
SUBJECT: the same book now half-open on the desk, golden light pouring UP out of it like a lantern, single letter-shapes floating in the light like dust motes, the class leaning in from the edges of frame in silhouette, wide curious eyes catching the glow. 1920×1080, full-bleed.

---
CARD 5 · filename: pv_spill.png · CLASS: CUTSCENE/BACKDROP (painted)
SAVE TO: ~/Code/codex-art-lab/batch-t/beats/pv_spill.png
SIZE: 1920×1080
FORMAT: full-bleed PNG
USED FOR: Prologue shot 4 — the accident: the words spill.
SUBJECT BRIEF:
SUBJECT: the book bursts fully open: pages fan violently, and streams of LETTERS pour out and up like startled birds scattering through the classroom, desks rattling, a pencil case tipping over. Dynamic but exciting-not-frightening: the light stays warm gold and cyan. 1920×1080, full-bleed.

---
CARD 6 · filename: pv_pull.png · CLASS: CUTSCENE/BACKDROP (painted)
SAVE TO: ~/Code/codex-art-lab/batch-t/beats/pv_pull.png
SIZE: 1920×1080
FORMAT: full-bleed PNG
USED FOR: Prologue shot 5 — the pull.
SUBJECT BRIEF:
SUBJECT: looking down INTO the open book from above: its pages have become a swirling paper-and-letter vortex with bright cyan sky visible at the very center; the child hero's hands grip the desk edge at the bottom of frame, scarf flying forward, school bag tumbling ahead into the swirl. A rollercoaster drop, not a horror fall. 1920×1080, full-bleed.

---
CARD 7 · filename: pv_landing.png · CLASS: CUTSCENE/BACKDROP (painted)
SAVE TO: ~/Code/codex-art-lab/batch-t/beats/pv_landing.png
SIZE: 1920×1080
FORMAT: full-bleed PNG
USED FOR: Prologue shot 6 — landing inside the book.
SUBJECT BRIEF:
SUBJECT: the hero sits up dazed on a huge soft meadow that is clearly a BOOK PAGE — grass growing in gentle ruled lines, giant printed letters half-buried in the earth like friendly fossils, an ink-blue evening sky above with paper-white clouds. The hero small in the wide frame, wonder on their face. 1920×1080, full-bleed.

---
CARD 8 · filename: pv_meet_finn.png · CLASS: CUTSCENE/BACKDROP (painted)
SAVE TO: ~/Code/codex-art-lab/batch-t/beats/pv_meet_finn.png
SIZE: 1920×1080
FORMAT: full-bleed PNG
USED FOR: Prologue shot 7 — Finn introduces himself.
SUBJECT BRIEF:
SUBJECT: FINN the book-person floats down to eye level with the seated hero, pages spread like a gentle bow, big friendly dot-eyes bright; warm light between them. First-meeting warmth, a touch of guilt in Finn's eyebrows. 1920×1080, full-bleed.

---
CARD 9 · filename: pv_meet_pixel.png · CLASS: CUTSCENE/BACKDROP (painted)
SAVE TO: ~/Code/codex-art-lab/batch-t/beats/pv_meet_pixel.png
SIZE: 1920×1080
FORMAT: full-bleed PNG
USED FOR: Prologue shot 8 — Pixel.
SUBJECT BRIEF:
SUBJECT: PIXEL the small black cat winds around the hero's legs, tail curled like a brush-stroke question mark, huge amber eyes looking up — half affection, half assessment. The hero reaches down to pet her. Close, warm, funny. 1920×1080, full-bleed.

---
CARD 10 · filename: pv_grey_world.png · CLASS: CUTSCENE/BACKDROP (painted)
SAVE TO: ~/Code/codex-art-lab/batch-t/beats/pv_grey_world.png
SIZE: 1920×1080
FORMAT: full-bleed PNG
USED FOR: Prologue shot 9 — the stakes: the world loses its words.
SUBJECT BRIEF:
SUBJECT: a wide vista of the book's world where COLOR IS DRAINING: the near meadow still warm and green, but the middle distance fading to soft greys — trees, a village, a zoo, a little harbor all turning pale like an unfinished drawing; single letters lift off distant pages and drift away like ash. Wistful, quiet, still beautiful — melancholy, never horror. 1920×1080, full-bleed.

---
CARD 11 · filename: pv_tintengeist.png · CLASS: CUTSCENE/BACKDROP (painted)
SAVE TO: ~/Code/codex-art-lab/batch-t/beats/pv_tintengeist.png
SIZE: 1920×1080
FORMAT: full-bleed PNG
USED FOR: Prologue shot 10 — the Tintengeist appears (introduced BEFORE it ever holds anyone).
SUBJECT BRIEF:
SUBJECT: high above the grey lands, DER TINTENGEIST drifts across the sky: a huge, soft, rounded ink-spirit, calm white eyes, a long trail of collected letters following it like a scarf. Finn and the hero watch from behind a page-fold, hushed — awe, not terror. The spirit looks lonely rather than evil. 1920×1080, full-bleed.

---
CARD 12 · filename: pv_jona_note.png · CLASS: CUTSCENE/BACKDROP (painted)
SAVE TO: ~/Code/codex-art-lab/batch-t/beats/pv_jona_note.png
SIZE: 1920×1080
FORMAT: full-bleed PNG
USED FOR: Prologue shot 11 — Jona's note.
SUBJECT BRIEF:
SUBJECT: close on a handwritten note pinned to a wooden signpost at the meadow's edge: child's handwriting lines (unreadable squiggles, no real text), a small pencil doodle of a smiling sun in the corner, one corner fluttering. Finn's page-wing points at it; Pixel sniffs the post. Soft mystery. 1920×1080, full-bleed.

---
CARD 13 · filename: pv_mission.png · CLASS: CUTSCENE/BACKDROP (painted)
SAVE TO: ~/Code/codex-art-lab/batch-t/beats/pv_mission.png
SIZE: 1920×1080
FORMAT: full-bleed PNG
USED FOR: Prologue shot 12 — the mission.
SUBJECT BRIEF:
SUBJECT: FINN hovers before the hero holding out a page like an open hand; the hero, standing now, reaches toward it with new resolve, scarf lifting in the breeze; PIXEL's tail curls into an arrow pointing toward the grey horizon. Warm rally-the-party energy. 1920×1080, full-bleed.

---
CARD 14 · filename: pv_map_reveal.png · CLASS: CUTSCENE/BACKDROP (painted)
SAVE TO: ~/Code/codex-art-lab/batch-t/beats/pv_map_reveal.png
SIZE: 1920×1080
FORMAT: full-bleed PNG
USED FOR: Prologue shot 13 — the world map reveal.
SUBJECT BRIEF:
SUBJECT: a breathtaking high view of the whole book-world: an enormous OPEN BOOK seen from above at a gentle angle, its two pages forming lands — meadows, a schoolhouse glowing warm and inviting in the nearest corner, paths of ink connecting fifteen small chapter-places, most still soft grey, the nearest few in color. The hero, Finn and Pixel tiny at the bottom edge, looking out over it. 1920×1080, full-bleed.

---
CARD 15 · filename: bt_ch01_door.png · CLASS: CUTSCENE/BACKDROP (painted)
SAVE TO: ~/Code/codex-art-lab/batch-t/beats/bt_ch01_door.png
SIZE: 1920×1080
FORMAT: full-bleed PNG
USED FOR: Chapter 1 door beat — the knotted school.
SUBJECT BRIEF:
SUBJECT: the little schoolhouse from the world map, now close: a friendly two-story schoolhouse ON a book page — but its outline is tangled with thick ink THREADS tied into soft knots, windows dim grey; two faint warm glows pulse inside (the two seals): one in a ground-floor classroom window, one in the attic gable window. Finn and the hero stand at the gate looking up. Determined, warm. 1920×1080, full-bleed.

---
CARD 16 · filename: bt_ch01_restore.png · CLASS: CUTSCENE/BACKDROP (painted)
SAVE TO: ~/Code/codex-art-lab/batch-t/beats/bt_ch01_restore.png
SIZE: 1920×1080
FORMAT: full-bleed PNG
USED FOR: Chapter 1 restore beat — the page comes back.
SUBJECT BRIEF:
SUBJECT: the same schoolhouse UNKNOTTED and radiant: ink threads dissolving into drifting letters, color flooding back across the page like watercolor spreading — green grass, red roof, warm windows; a small flag rising on the flagpole; Finn spinning happily, Pixel on a fence post, the hero mid-cheer. Pure warm victory. 1920×1080, full-bleed.

---
CARD 17 · filename: bgp_schoolhouse_far.png · CLASS: CUTSCENE/BACKDROP (painted)
SAVE TO: ~/Code/codex-art-lab/batch-t/ch01/bgp_schoolhouse_far.png
SIZE: 2048×1024
FORMAT: full-bleed PNG
USED FOR: Chapter 1 FAR backdrop layer (parallax 0.35) — replaces the dither bands. Must tile horizontally.
SUBJECT BRIEF:
SUBJECT: a PAINTED side-view background for a platformer level set inside a book: a deep ink-blue evening sky fading to warm teal at the horizon, soft paper-white clouds, distant grey-blue paper hills with faint ruled notebook lines, far-away tiny page-curls on the skyline. NO foreground objects, NO characters, nothing closer than the far hills — this sits far behind the action. Muted, atmospheric, uncluttered. CRITICAL: the LEFT and RIGHT edges must match perfectly so the image tiles horizontally without a seam. 2048×1024, full-bleed.

---
CARD 18 · filename: bgp_schoolhouse_mid.png · CLASS: CUTSCENE/BACKDROP (painted)
SAVE TO: ~/Code/codex-art-lab/batch-t/ch01/bgp_schoolhouse_mid.png
SIZE: 2048×640
FORMAT: PNG with TRUE alpha transparency
USED FOR: Chapter 1 MID backdrop band (parallax 0.6) — sits over the far layer, under the gameplay.
SUBJECT BRIEF:
SUBJECT: a PAINTED mid-distance band for the same book-world level: a soft skyline of schoolyard silhouettes — a fence, a tree with page-leaves, a distant swing set, a low wall with big faded printed letters leaning against it — all in muted blue-grey-green tones, slightly darker than a far sky would be. The TOP HALF of the image is fully TRANSPARENT (true alpha) so the far layer shows through; the silhouettes rise from the bottom edge. LEFT and RIGHT edges must tile horizontally without a seam. 2048×640. FORMAT: PNG with a fully TRANSPARENT background (true alpha — do not paint a checkerboard).

---
CARD 19 · filename: hero_swing_sheet.png · CLASS: GAMEPLAY (pixel)
SAVE TO: ~/Code/codex-art-lab/batch-t/hero/hero_swing_sheet.png
SIZE: 512×256 (2×1 grid, 256px cells)
FORMAT: pose-sheet on SOLID magenta #FF00FF (no transparency)
USED FOR: The Federstab swing (doc 29 combat verb) — sliced into hero_swing1/hero_swing2. MUST match the Batch S hero exactly.
SUBJECT BRIEF:
SUBJECT: a 2×1 pose sheet of THE SAME child hero as the established set — schoolkid ~10, mid-brown messy hair, mustard-yellow #fcfc54 shirt, dark trousers, brown cross-body satchel, red scarf, giant white quill pen (gold nib) — side view facing RIGHT, ~200px tall in each 256px cell. Cell 1: SWING WIND-UP — the quill pulled off the back, held two-handed over the shoulder like a soft baseball bat, knees bent. Cell 2: SWING FOLLOW-THROUGH — the quill swept forward in a wide arc, a trail of 3-4 small sparkle-letters along the arc path, scarf whipped forward. Friendly energy, zero violence (it frees knotted words, never hurts). FORMAT: PNG pose-sheet on a SOLID magenta #FF00FF background (no transparency — the magenta is chroma-keyed later). Lay the cells in a clean grid, equal cell sizes, nothing touching cell borders.

---
CARD 20 · filename: maphero_sheet.png · CLASS: GAMEPLAY (pixel)
SAVE TO: ~/Code/codex-art-lab/batch-t/map/maphero_sheet.png
SIZE: 512×512 (2×2 grid, 256px cells)
FORMAT: pose-sheet on SOLID magenta #FF00FF (no transparency)
USED FOR: World-map hero walk poses — sliced into maphero_down1/down2/side1/side2 (side mirrors for left).
SUBJECT BRIEF:
SUBJECT: a 2×2 pose sheet of the SAME hero for a top-down world map, chibi proportion (big head, ~140px tall in each 256px cell): Cell 1 walking TOWARD CAMERA step A (left foot forward) · Cell 2 walking toward camera step B (right foot forward) · Cell 3 walking RIGHT step A · Cell 4 walking right step B. Same costume: mustard shirt, red scarf, satchel, quill on back visible over the shoulder. FORMAT: PNG pose-sheet on a SOLID magenta #FF00FF background (no transparency — the magenta is chroma-keyed later). Lay the cells in a clean grid, equal cell sizes, nothing touching cell borders.

---
CARD 21 · filename: tiles_schoolhouse_sheet.png · CLASS: GAMEPLAY (pixel)
SAVE TO: ~/Code/codex-art-lab/batch-t/ch01/tiles_schoolhouse_sheet.png
SIZE: 1024×1024 (4×4 grid, 256px cells)
FORMAT: grid-cut sheet — cells filled edge-to-edge, NO magenta, NO gaps
USED FOR: Chapter 1 terrain SKIN — the 16 auto-tile masks (sliced tile_sh_m0…m15). What you stand on becomes art that MATCHES the collision.
SUBJECT BRIEF:
SUBJECT: a 4×4 sheet of 16 TERRAIN TILES for a side-view platformer, each cell one FULL-BLEED 256×256 square tile of book-world earth: warm brown #a85400 paper-earth with faint ruled notebook lines and occasional tiny letter-fossils, and a bright green #00a800/#54fc54 GRASS LIP exactly on the edges named below (the lip is the walkable surface read — ~24px thick, slightly rounded like Keen 4 grass). Reading order, which edges carry the grass lip: cell 1: NONE (solid interior) · 2: TOP · 3: RIGHT · 4: TOP+RIGHT · 5: BOTTOM · 6: TOP+BOTTOM · 7: RIGHT+BOTTOM · 8: TOP+RIGHT+BOTTOM · 9: LEFT · 10: TOP+LEFT · 11: LEFT+RIGHT · 12: TOP+LEFT+RIGHT · 13: BOTTOM+LEFT · 14: TOP+BOTTOM+LEFT · 15: LEFT+RIGHT+BOTTOM · 16: ALL FOUR EDGES. Edges WITHOUT a lip must run clean to the cell border so tiles butt seamlessly. Fill the full 1024×1024 with the 16 tiles edge to edge — NO magenta, NO gaps (this sheet is grid-cut, not chroma-keyed). FORMAT: full-bleed PNG.

---
CARD 22 · filename: props_level_sheet.png · CLASS: GAMEPLAY (pixel)
SAVE TO: ~/Code/codex-art-lab/batch-t/ch01/props_level_sheet.png
SIZE: 1280×512 (5×2 grid, 256px cells)
FORMAT: pose-sheet on SOLID magenta #FF00FF (no transparency)
USED FOR: Level furniture — sliced into prop_plank/prop_oneway/prop_spikes/prop_pole/prop_flag/prop_sealpost/prop_sealpost_free/prop_door_sealed/prop_door_open/prop_gluehwort.
SUBJECT BRIEF:
SUBJECT: a 5×2 sheet of platformer objects for the book world, one per cell, centered, nothing touching cell borders. Row 1: 1 SOLID WOODEN PLANK platform (a horizontal ruler-like wooden beam with measurement ticks, clearly walkable, 220×60px) · 2 ONE-WAY platform (a thinner floating paper strip with a folded edge, visibly lighter/airier than the plank) · 3 SPIKES (a strip of upward pen-nib points, ink-blue steel, clearly dangerous, 220×80px) · 4 CLIMBING POLE segment (a vertical wooden pencil, tileable vertically, 60×256px) · 5 small FLAG on a short pole (cyan pennant). Row 2: 6 SEAL POST (a stone inkwell pedestal with a glowing ink-knot hovering above it, warm yellow #fcfc54 glow) · 7 SEAL POST FREED (same pedestal, the knot dissolved into 3 rising sparkle-letters) · 8 DOOR SEALED (an arched classroom door wrapped in ink threads with a soft knot, dim) · 9 DOOR OPEN (same arch, threads gone, warm light inside) · 10 GLÜHWORT (a single glowing round word-orb: warm yellow core, tiny letter shapes inside, soft glow ring). FORMAT: PNG pose-sheet on a SOLID magenta #FF00FF background (no transparency — the magenta is chroma-keyed later). Lay the cells in a clean grid, equal cell sizes, nothing touching cell borders.

---
CARD 23 · filename: maptiles_sheet.png · CLASS: GAMEPLAY (pixel)
SAVE TO: ~/Code/codex-art-lab/batch-t/map/maptiles_sheet.png
SIZE: 1024×256 (4×1 grid, 256px cells)
FORMAT: grid-cut sheet — cells filled edge-to-edge, NO magenta, NO gaps
USED FOR: World-map ground set — sliced into mtile_page/mtile_path/mtile_grass/mtile_edge.
SUBJECT BRIEF:
SUBJECT: a 4×1 sheet of top-down WORLD MAP ground tiles, each cell one full-bleed 256×256 seamlessly tileable square: 1 PAGE GROUND — warm cream #fcfcfc paper with the faintest ruled lines and paper grain · 2 INK PATH — the same paper with a walked ink-line path running vertically through the middle (tileable top-bottom) · 3 GRASS PATCH — the paper with soft green #54fc54 meadow tufts growing out of the ruled lines · 4 PAGE EDGE — the paper curling up at the right side of the cell into a rolled page edge (world border tile, tileable top-bottom). Fill the full 1024×256 with the 4 tiles edge to edge — NO magenta, NO gaps (grid-cut, not chroma-keyed). FORMAT: full-bleed PNG.

---
CARD 24 · filename: buildings_sheet.png · CLASS: GAMEPLAY (pixel)
SAVE TO: ~/Code/codex-art-lab/batch-t/map/buildings_sheet.png
SIZE: 1536×512 (3×2 grid, 512×256 cells)
FORMAT: pose-sheet on SOLID magenta #FF00FF (no transparency)
USED FOR: World-map chapter buildings (Act 1 + the locked-generic) — sliced into bld_ch01/bld_ch02/bld_ch03/bld_ch04/bld_ch05/bld_locked. Grey-tinting for unrestored states happens in-engine.
SUBJECT BRIEF:
SUBJECT: a 3×2 sheet of small top-down-ish (3/4 view) WORLD MAP buildings for the book world, one per cell (each cell 512×256), centered, nothing touching borders, each ~380×200px: 1 SCHOOLHOUSE (friendly two-story, white walls, grey roof, tiny flagpole, a bell) · 2 ZOO GATE (an arched entrance with animal silhouettes — a gorilla and a crocodile shape — on the arch, cheerful) · 3 PIRATE COVE (a beached little pirate ship with a paper sail and a rope ladder) · 4 FEELINGS GARDEN (a round hedge garden with an open gate and heart-shaped topiary, warm) · 5 BAND STAGE (a small open-air stage with a drum and a microphone stand, bunting) · 6 LOCKED PLACE (a generic small building wrapped in gentle ink threads with a soft knot on top — the 'not yet' state). All standing ON cream paper ground with a soft shadow. FORMAT: PNG pose-sheet on a SOLID magenta #FF00FF background (no transparency — the magenta is chroma-keyed later). Lay the cells in a clean grid, equal cell sizes, nothing touching cell borders.

---
END OF COMMISSION. After the final card, print a manifest of every filename you
produced, in order, marked DONE or REGENERATED.
