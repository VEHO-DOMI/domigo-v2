# MISSION: produce the complete image set for "DomiGo — Batch U" (4 images, TWO style classes)

You are a senior illustrator AND pixel artist executing a fixed commission for a
children's English-learning game. Work AUTONOMOUSLY through the numbered cards
below, in order, one image per card. Do not skip, reorder, merge, or reinterpret.

## THE TWO STYLE CONTRACTS (each card names its class — re-read the right one before EVERY image)

### CLASS CUTSCENE / BACKDROP (painted)
STYLE (strict, class CUTSCENE): a warmly PAINTED children's storybook illustration — NOT pixel art. Soft painterly brushwork, gentle gradients, clean shapes, professional picture-book quality (think modern illustrated children's novels). PALETTE: build every scene from the mood of this EGA-derived family — deep ink blues/blacks, warm paper cream, mustard yellow #fcfc54, warm brown #a85400, fresh green #00a800, sky cyan #54fcfc, accent red #fc5454 — painted freely (shades and gradients allowed), so the painted scenes and the in-game pixel world read as ONE world. RECURRING CAST (identical design every time they appear): THE HERO — a schoolkid of about 10, mid-brown messy hair, mustard-yellow shirt, dark trousers, small brown cross-body satchel, red scarf, a giant white quill pen (gold nib) strapped on the back. FINN — a floating open paper book AS a person: cream pages like wings, dark ink spine, two big friendly black dot-eyes on the left page, tiny ink eyebrows. PIXEL — a small black cat with huge amber-yellow eyes, one ear tipped. FRAU BERGER — a warm Austrian primary-school teacher, cardigan, reading glasses on a cord. DER TINTENGEIST — a soft rounded spirit of dark blue-black ink, calm white eyes, never menacing. Mood: warm, curious, a little wistful where the world is grey — NEVER scary (no horror, no sharp teeth, no darkness-as-threat; this is for 10-year-olds learning English). No text, no watermarks, no borders.

### CLASS GAMEPLAY (pixel — the Keen 4 craft bar)
STYLE (strict, class GAMEPLAY — the Commander Keen 4 craft bar): 1991 EGA pixel art AT THE CRAFT LEVEL OF COMMANDER KEEN 4. Study the provided reference crops FIRST — your output must sit next to them without looking simpler. Use ONLY these 16 colors: #000000 #0000a8 #00a800 #00a8a8 #a80000 #a800a8 #a85400 #a8a8a8 #545454 #5454fc #54fc54 #54fcfc #fc5454 #fc54fc #fcfc54 #fcfcfc. Crisp square pixels, zero anti-aliasing, zero smooth gradients. THE ANTI-FLAT LAW: no large flat single-color area anywhere — every surface carries pixel-level texture the way Keen 4's do: dense 1-pixel dithering (checkerboard AND irregular scatter) between neighboring tones, plus material patterns drawn INTO the surface (rock strata and pebble clusters, wood-grain strokes, leaf veins, paper fibre and faint ruled lines for our book-world earth). TONE RAMPS: 3-4 tones per material (dark shade — often black or the hue's dark EGA partner — then base, bright, and a small highlight), light from the top-left, shade to the bottom-right. SILHOUETTES: rounded and ORGANIC — grass lips overhang their earth band with irregular tufts, rock edges chip, trunks bulge at the roots; ruler-straight edges belong only to man-made objects (planks, doors, rulers). Background-wall areas inside a tile read as darker, lower-contrast dithered masses so the walk surface pops. SPRITES: bold black contour with interior detail lines, a real light source (specular dot on round forms), big readable eyes, poses readable in half a second. Friendly storybook mood — this is a children's English-learning game set INSIDE a book: ink, paper, letters. Never scary: no monsters, no horror; melancholy-comic, not menacing.

## WORKING RULES
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
   `~/Code/codex-art-lab/batch-u/` — create it (and its subfolders) if missing.
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
CARD 1 · filename: _style_key_pixel2.png · CLASS: GAMEPLAY (pixel)
SAVE TO: ~/Code/codex-art-lab/batch-u/_style_key_pixel2.png
SIZE: 1024×640
FORMAT: full-bleed PNG
USED FOR: The pixel-class cohesion anchor at the v2 craft bar — synced, never rendered; every pixel image is compared to it.
SUBJECT BRIEF:
SUBJECT: one wide reference scene of the book world at full craft: rolling paper-earth meadow (dense dithered brown strata, faint ruled lines, a half-buried letter fossil), an overhanging irregular grass lip, one climbing pencil-pole with a small cyan flag, a small white schoolhouse with dithered roof shading, an ink-blob creature with big readable eyes on the meadow, and behind everything a darker low-contrast dithered rock-wall mass in the Keen 4 manner (study ref_keen_terrain_door.png and ref_keen_trees_grass.png). 1024×640, full-bleed.

---
CARD 2 · filename: creatures2_sheet.png · CLASS: GAMEPLAY (pixel)
SAVE TO: ~/Code/codex-art-lab/batch-u/ch01/creatures2_sheet.png
SIZE: 1024×768 (4×3 grid, 256px cells)
FORMAT: pose-sheet on SOLID magenta #FF00FF (no transparency)
USED FOR: The six verknotete-Wörter creatures, 2 poses each — sliced into walker2-0/1, hopper2-0/1, flyer2-0/1, thief2-0/1, cushion2-0/1, cloud2-0/1. These replace the Batch S creatures in-engine.
SUBJECT BRIEF:
SUBJECT: a 4×3 sheet (12 cells, reading order) of SIX friendly ink-creature designs, 2 poses each, every creature ~170px in its 256px cell, side view facing LEFT, bold black contours, 3-4 tone ramps, big readable eyes: cells 1-2 WALKER (a round ink-blob with stubby feet and a knotted thread tangled around its middle; pose A step, pose B other step) · 3-4 HOPPER (a taller ink-drop with a coiled spring-like tail; pose A crouched, pose B stretched mid-hop) · 5-6 FLYER (a possessed open BOOK flapping its covers like wings, dot-eyes on the page; pose A covers up, pose B covers down) · 7-8 THIEF (a quick fox-like ink-wisp with a little satchel, sly big eyes; pose A running, pose B looking back) · 9-10 CUSHION (a soft pillow-shaped ink-blob, sleepy eyes; pose A idle, pose B squashed flat) · 11-12 CLOUD (a small hovering ink-cloud with a letter dangling from it on a thread; pose A drifting, pose B letter swinging). Every one melancholy-comic, tangled in fine knot-threads — words that WANT to be freed, never menacing. FORMAT: PNG pose-sheet on a SOLID magenta #FF00FF background (no transparency — chroma-keyed later). Clean grid, equal cells, nothing touching cell borders.

---
CARD 3 · filename: boss2_sheet.png · CLASS: GAMEPLAY (pixel)
SAVE TO: ~/Code/codex-art-lab/batch-u/ch01/boss2_sheet.png
SIZE: 1024×512 (2×2 grid, 512×256 cells)
FORMAT: pose-sheet on SOLID magenta #FF00FF (no transparency)
USED FOR: Der Stundenplan-Schlinger duel set — sliced into boss2_head_idle / boss2_head_tell / boss2_card / boss2_burst.
SUBJECT BRIEF:
SUBJECT: a 2×2 sheet for the chapter-1 guardian, DER STUNDENPLAN-SCHLINGER — a school TIMETABLE GRID come alive, knotted into a grumpy creature: a big rectangular paper body ruled into timetable cells, tangled ink-thread limbs, a wide mouth that swallows lesson-cards, heavy sleepy eyes (grumpy, never scary — it hoards the first lesson because it is lonely). Cell 1 (512×256): HEAD/BODY IDLE — centered, ~440×220px, breathing posture. Cell 2: HEAD/BODY TELEGRAPH — rearing back, mouth opening, threads taut, eyes wide (the dodge cue, readable in half a second). Cell 3: LESSON CARD — a single timetable card ~200×140px (ruled paper, a knot-seal in the corner) it spits during attacks. Cell 4: BURST — the unknot poof: a puff of freed letters and thread-bits, ~300×220px, on the magenta (this cell IS chroma-keyed — no letters touching cell borders). FORMAT: PNG pose-sheet on a SOLID magenta #FF00FF background (no transparency — chroma-keyed later). Clean grid, equal cells, nothing touching cell borders.

---
CARD 4 · filename: mapdecor_sheet.png · CLASS: GAMEPLAY (pixel)
SAVE TO: ~/Code/codex-art-lab/batch-u/map/mapdecor_sheet.png
SIZE: 1024×512 (4×2 grid, 256px cells)
FORMAT: pose-sheet on SOLID magenta #FF00FF (no transparency)
USED FOR: World-map furniture — sliced into mdec_tree/mdec_bush/mdec_fence/mdec_sign/mdec_bridge/mdec_rock/mdec_flowers/mdec_inkpool. Placed by the map's prop glyphs.
SUBJECT BRIEF:
SUBJECT: a 4×2 sheet of top-down-ish (3/4 view) WORLD MAP decor for the book world, one per cell, centered, ~180px each, each standing on the cream paper ground with a soft ink shadow: 1 PAGE-LEAF TREE (trunk of rolled paper, crown of small page-leaves) · 2 INK BUSH (round, a few letter-shapes hidden in it) · 3 FENCE segment (three wooden pickets, horizontal, tileable left-right) · 4 SIGNPOST (a wooden post with a blank paper note pinned to it) · 5 INK BRIDGE (a small arched bridge of dark ink planks, horizontal) · 6 ROCK (a paper-boulder with dithered strata) · 7 FLOWER PATCH (small ink-line flowers with one colored blossom each) · 8 INK POOL (a calm dark ink puddle with a quill floating in it). FORMAT: PNG pose-sheet on a SOLID magenta #FF00FF background (no transparency — chroma-keyed later). Clean grid, equal cells, nothing touching cell borders.

---
END OF COMMISSION. After the final card, print a manifest of every filename you
produced, in order, marked DONE or REGENERATED.
