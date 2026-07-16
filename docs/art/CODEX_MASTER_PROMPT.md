# MISSION: produce the complete image set for "DomiGo — Batch S" (25 images)

You are a senior pixel artist executing a fixed commission for a children's
English-learning game. Work AUTONOMOUSLY through the numbered cards below, in
order, one image per card. Do not skip, reorder, merge, or reinterpret cards.

## THE STYLE CONTRACT (re-read this before EVERY single image)
STYLE (strict): 1991 EGA pixel art in the exact visual language of Commander Keen 4. Use ONLY these 16 colors: #000000 #0000a8 #00a800 #00a8a8 #a80000 #a800a8 #a85400 #a8a8a8 #545454 #5454fc #54fc54 #54fcfc #fc5454 #fc54fc #fcfc54 #fcfcfc. Chunky pixels on a 16px-tile logical grid (render large, but every "pixel" is a crisp square — no anti-aliasing, no smooth gradients, no soft shading). Texture and gradients ONLY as 1-pixel checkerboard dithering between two palette colors. Foreground objects get bold black contour outlines and black interior detail lines; background surfaces stay outline-free. Two tones per material (base + bright of the same hue) with black as the dark shade. Friendly storybook mood — this is a children's English-learning game set INSIDE a book: ink, paper, letters. Never scary: no monsters, no horror, big readable eyes on creatures, melancholy-comic not menacing.

## WORKING RULES
0. YOUR ONE AND ONLY WRITE LOCATION IS THE SANDBOX FOLDER:
   `~/Code/codex-art-lab/batch-s/`  — create it (and its subfolders) if missing.
   Save every image there under the exact SAVE TO path its card names.
   NEVER write, modify, move, or delete ANYTHING anywhere else — no git
   repository, no other folder, no existing file. Everywhere else you are
   strictly read-only. A separate pipeline (not you) later QA-checks, slices,
   and imports your images into the game.
1. CARD 1 IS THE STYLE KEY. Generate it first. Every later image must match it
   in palette, pixel density, outline weight and mood — treat it as the anchor
   and compare your result to it before moving on.
2. Before each image, print exactly: `NOW GENERATING: <filename>` — then
   generate, then SAVE it yourself to the card's SAVE TO path (rule 0) and
   print `SAVED: <full path>` as confirmation.
3. AFTER each image, run this self-check and print PASS/FAIL per line — if any
   line fails, regenerate the image ONCE with the failure named in the prompt,
   before moving to the next card:
   - PALETTE: only the 16 contract colors (no off-palette hues, no gradients)
   - PIXELS: crisp squares, zero anti-aliasing or soft blur
   - FORMAT: matches the card (true-alpha transparent / solid #FF00FF magenta
     sheet with a clean grid / full-bleed) — for transparent cards: REAL alpha,
     never a painted checkerboard
   - SUBJECT: every element the card names is present and readable at game size
   - MOOD: friendly storybook, big readable eyes, nothing scary
4. SHEETS: equal-sized grid cells, nothing touching cell borders, the SAME
   character/design in every cell (only the pose changes).
5. If you hit a session or generation limit, print exactly:
   `CONTINUE AT CARD <n>` — the user will restart you with this same document
   plus the instruction "continue at card <n>", and you resume from there.
6. Never invent extra images, text watermarks, signatures, or borders.

## THE CARDS
---
CARD 1 · filename: _style_key.png
SAVE TO: ~/Code/codex-art-lab/batch-s/_style_key.png
SIZE: 1024×640
FORMAT: full-bleed PNG
USED FOR: The cohesion reference — synced but never rendered. Every later generation should be checked against it by eye.
SUBJECT BRIEF:
SUBJECT: a single wide reference scene that establishes this game's world: the inside of an open storybook as a side-view platformer place. Left third: rolling meadow ground in brown #a85400 earth with a bright green #00a800/#54fc54 grass lip, gentle hills, one climbing pole with a small flag. Middle: a small friendly schoolhouse (white #fcfcfc walls, gray roof, black outlines). Right third: the ground curls up like a PAGE OF PAPER, faint ruled notebook lines inside the earth, two or three large printed letters half-buried like fossils. Sky: flat bright cyan #54fcfc with two black-outlined white clouds. One small ink-blob creature with big worried eyes stands on the meadow. 1024×640.

---
CARD 2 · filename: prologue_classroom.png
SAVE TO: ~/Code/codex-art-lab/batch-s/beats/prologue_classroom.png
SIZE: 1536×864
FORMAT: full-bleed PNG
USED FOR: Prologue s001 — the classroom, the new English book glowing at the seams.
SUBJECT BRIEF:
SUBJECT: a warm Austrian classroom from a student's seat: wooden desks, a blackboard with "ENGLISH" chalked on it, afternoon light. On the front desk lies a large closed English textbook — and warm golden #fcfc54 light leaks from between its pages, a few letter-shapes floating out of the gap like dust. Kids' hands and pencil cases at the edges of frame, no faces in focus. Cozy, curious, zero menace. 1536×864, full-bleed.

---
CARD 3 · filename: prologue_pull.png
SAVE TO: ~/Code/codex-art-lab/batch-s/beats/prologue_pull.png
SIZE: 1536×864
FORMAT: full-bleed PNG
USED FOR: Prologue s002 — the book bursts open and pulls the player in.
SUBJECT BRIEF:
SUBJECT: the same textbook now WIDE OPEN, pages fanning, a swirling vortex of white #fcfcfc and yellow #fcfc54 LETTERS (real latin letters, various sizes) spiraling up out of the pages and wrapping around the view — we are being pulled INTO the book, motion lines, a school bag tumbling along. Exciting like a rollercoaster drop, never frightening: bright cyan #54fcfc light at the vortex center (a sky waits inside). 1536×864, full-bleed.

---
CARD 4 · filename: prologue_landing.png
SAVE TO: ~/Code/codex-art-lab/batch-s/beats/prologue_landing.png
SIZE: 1536×864
FORMAT: full-bleed PNG
USED FOR: Prologue s003 — first sight of the book's world; Finn and Pixel greet you.
SUBJECT BRIEF:
SUBJECT: looking out over the book's world from a gentle rise: a walkable storybook land drawn ON an open book page (faint ruled lines and a page-curl at the horizon), fifteen tiny chapter-lands in the distance — most drained to gray #a8a8a8/#545454, only the nearest meadow still in color. In the foreground, greeting us: FINN — a floating open paper book with two friendly black dot-eyes (a person, not furniture; cream #fcfcfc pages, ink spine) — and PIXEL, a small black #000000 cat with amber #fcfc54 eyes, tail curled mid-swish. Hopeful, quiet, a little sad at the edges (the gray lands), warm where the characters stand. 1536×864, full-bleed.

---
CARD 5 · filename: portrait_finn.png
SAVE TO: ~/Code/codex-art-lab/batch-s/cast/portrait_finn.png
SIZE: 512×512
FORMAT: PNG with TRUE alpha transparency
USED FOR: Speech-bubble portrait for finn (dialogue beats).
SUBJECT BRIEF:
SUBJECT: a bust/head-and-shoulders PORTRAIT for a dialogue box: FINN, the book-guide: a floating open paper book AS a person — cream white pages like wings, a dark ink spine, two big friendly black dot-eyes on the left page, tiny ink eyebrows. Kind, eager, slightly guilty around the edges. Centered, facing slightly left, readable at 40×40 px. 512×512. FORMAT: PNG with a fully TRANSPARENT background (true alpha — do not paint a checkerboard).

---
CARD 6 · filename: portrait_pixel.png
SAVE TO: ~/Code/codex-art-lab/batch-s/cast/portrait_pixel.png
SIZE: 512×512
FORMAT: PNG with TRUE alpha transparency
USED FOR: Speech-bubble portrait for pixel (dialogue beats).
SUBJECT BRIEF:
SUBJECT: a bust/head-and-shoulders PORTRAIT for a dialogue box: PIXEL, the book-cat: a small black cat, round face, huge amber-yellow eyes, one ear tipped. Curious and unimpressed at the same time. Centered, facing slightly left, readable at 40×40 px. 512×512. FORMAT: PNG with a fully TRANSPARENT background (true alpha — do not paint a checkerboard).

---
CARD 7 · filename: portrait_berger.png
SAVE TO: ~/Code/codex-art-lab/batch-s/cast/portrait_berger.png
SIZE: 512×512
FORMAT: PNG with TRUE alpha transparency
USED FOR: Speech-bubble portrait for berger (dialogue beats).
SUBJECT BRIEF:
SUBJECT: a bust/head-and-shoulders PORTRAIT for a dialogue box: FRAU BERGER, the teacher: a warm Austrian primary-school teacher, cardigan, reading glasses on a cord, gentle smile. Grandmotherly-competent. Centered, facing slightly left, readable at 40×40 px. 512×512. FORMAT: PNG with a fully TRANSPARENT background (true alpha — do not paint a checkerboard).

---
CARD 8 · filename: portrait_tintengeist.png
SAVE TO: ~/Code/codex-art-lab/batch-s/cast/portrait_tintengeist.png
SIZE: 512×512
FORMAT: PNG with TRUE alpha transparency
USED FOR: Speech-bubble portrait for tintengeist (dialogue beats).
SUBJECT BRIEF:
SUBJECT: a bust/head-and-shoulders PORTRAIT for a dialogue box: DER TINTENGEIST, the gentle ink-spirit: a soft rounded ghost-shape made of dark blue-black ink with two calm white eyes and a tiny warm smile — a HELPER who catches falling children, never a threat. Round, pillowy, kind. Centered, facing slightly left, readable at 40×40 px. 512×512. FORMAT: PNG with a fully TRANSPARENT background (true alpha — do not paint a checkerboard).

---
CARD 9 · filename: portrait_jona.png
SAVE TO: ~/Code/codex-art-lab/batch-s/cast/portrait_jona.png
SIZE: 512×512
FORMAT: PNG with TRUE alpha transparency
USED FOR: Speech-bubble portrait for jona (dialogue beats).
SUBJECT BRIEF:
SUBJECT: a bust/head-and-shoulders PORTRAIT for a dialogue box: JONA: a tired boy of about 11, hair uncombed, oversized sweater, holding a pencil stub, eyes down but hopeful when seen. NEVER a shadow or villain — a hurt kid. Gentle, quiet colors. Centered, facing slightly left, readable at 40×40 px. 512×512. FORMAT: PNG with a fully TRANSPARENT background (true alpha — do not paint a checkerboard).

---
CARD 10 · filename: hero_sheet.png
SAVE TO: ~/Code/codex-art-lab/batch-s/hero/hero_sheet.png
SIZE: 1024×768 (4×3 grid, 256px cells)
FORMAT: pose-sheet on SOLID magenta #FF00FF (no transparency)
USED FOR: THE HERO (doc 28 §4): sliced into hero_stand/run1-4/jump/fall/pogo1-2/climb1-2/hang.
SUBJECT BRIEF:
SUBJECT: a 4×3 pose sheet of THE SAME child hero, identical design in every cell — a schoolkid adventurer, about 10: mid-brown messy hair, mustard-yellow #fcfc54 shirt, dark trousers, a small brown satchel worn cross-body, a red scarf, and a giant WHITE QUILL PEN (gold nib) strapped on the back. Side view facing RIGHT unless stated. Cells in reading order: 1 stand (relaxed) · 2-5 run cycle (contact, pass, contact-other, pass — arm swing, scarf trailing) · 6 jump (knees tucked, rising) · 7 fall (arms out, hair up) · 8 pogo COMPRESSED (riding the quill nib-down like a pogo stick, knees bent, spring squashed) · 9 pogo EXTENDED (stretched tall on the quill mid-bounce) · 10-11 climb (facing CAMERA, gripping a pole, hands alternating) · 12 hang (facing camera, both arms up gripping a ledge). Each character ~200px tall inside its 256px cell, nothing touching cell borders. FORMAT: PNG pose-sheet on a SOLID magenta #FF00FF background (no transparency — the magenta is chroma-keyed later). Lay the poses in a clean grid, equal cell sizes, nothing touching cell borders.

---
CARD 11 · filename: acc_sheet.png
SAVE TO: ~/Code/codex-art-lab/batch-s/hero/acc_sheet.png
SIZE: 512×256 (2×1 grid)
FORMAT: pose-sheet on SOLID magenta #FF00FF (no transparency)
USED FOR: Unlockable accessory overlays: acc_scarf (a blue variant scarf) + acc_cap (a green cap). Drawn to overlay the hero's stand pose alignment.
SUBJECT BRIEF:
SUBJECT: a 2×1 sheet of ACCESSORY OVERLAYS for the hero above (same proportions, same anchor): cell 1 — a bright blue #5454fc scarf only, positioned where the hero's neck/shoulder is, flowing right; cell 2 — a green #00a800 cap only, positioned where the hero's head is. NOTHING else in the cells (they are transparent overlays to be layered onto the character). FORMAT: PNG pose-sheet on a SOLID magenta #FF00FF background (no transparency — the magenta is chroma-keyed later). Lay the poses in a clean grid, equal cell sizes, nothing touching cell borders.

---
CARD 12 · filename: page_underlay.png
SAVE TO: ~/Code/codex-art-lab/batch-s/map/page_underlay.png
SIZE: 1024×1024, tileable
FORMAT: full-bleed PNG
USED FOR: The open book page BENEATH the world map (tiled).
SUBJECT BRIEF:
SUBJECT: a seamless TILEABLE texture of aged storybook paper seen from above: warm off-white #fcfcfc with the faintest gray #a8a8a8 ruled lines, a few tiny ink specks, extremely low contrast (game terrain renders on top — it must never compete). 1024×1024, edges must tile perfectly.

---
CARD 13 · filename: building_ch01.png
SAVE TO: ~/Code/codex-art-lab/batch-s/map/building_ch01.png
SIZE: 256×256
FORMAT: PNG with TRUE alpha transparency
USED FOR: Chapter 1's map building: the little schoolhouse (Zeit für die Schule).
SUBJECT BRIEF:
SUBJECT: a small friendly one-room schoolhouse for a world map, 3/4 front view: white #fcfcfc walls with black outlines, gray #a8a8a8 shingle roof, a little bell tower, red #a80000 door, two windows with warm yellow light, a tiny flagpole holder on the gable (empty). Sits on a small grass patch. Readable at 64px. 256×256. FORMAT: PNG with a fully TRANSPARENT background (true alpha — do not paint a checkerboard).

---
CARD 14 · filename: finn_map.png
SAVE TO: ~/Code/codex-art-lab/batch-s/map/finn_map.png
SIZE: 128×128
FORMAT: PNG with TRUE alpha transparency
USED FOR: Finn's world-map sprite (floating book person).
SUBJECT BRIEF:
SUBJECT: FINN as a tiny map sprite: a floating open paper book with two black dot-eyes, pages slightly lifted like wings, small ink shadow beneath. Readable at 44px. 128×128. FORMAT: PNG with a fully TRANSPARENT background (true alpha — do not paint a checkerboard).

---
CARD 15 · filename: pixel_map.png
SAVE TO: ~/Code/codex-art-lab/batch-s/map/pixel_map.png
SIZE: 128×128
FORMAT: PNG with TRUE alpha transparency
USED FOR: Pixel's world-map sprite (the book-cat).
SUBJECT BRIEF:
SUBJECT: PIXEL as a tiny map sprite: a small black cat sitting, tail curled around the feet, amber #fcfc54 eyes, one ear tipped. Readable at 40px. 128×128. FORMAT: PNG with a fully TRANSPARENT background (true alpha — do not paint a checkerboard).

---
CARD 16 · filename: flag.png
SAVE TO: ~/Code/codex-art-lab/batch-s/map/flag.png
SIZE: 128×128
FORMAT: PNG with TRUE alpha transparency
USED FOR: The restoration flag planted on beaten chapters (thrown-flag ceremony).
SUBJECT BRIEF:
SUBJECT: a small triumphant pennant flag on a short wooden pole with a gold finial: warm violet-blue banner with a tiny white book emblem, mid-wave. Readable at 32px. 128×128. FORMAT: PNG with a fully TRANSPARENT background (true alpha — do not paint a checkerboard).

---
CARD 17 · filename: bg_far.png
SAVE TO: ~/Code/codex-art-lab/batch-s/ch01/bg_far.png
SIZE: 1536×512, horizontally loopable
FORMAT: full-bleed PNG
USED FOR: ch01 far background layer (parallax) — the meadow horizon.
SUBJECT BRIEF:
SUBJECT: a wide side-view BACKGROUND for a platformer level set on a storybook meadow at dusk-in-a-book: deep ink-navy upper sky dithering down (1px checkerboard) into teal #00a8a8, a far horizon of rolling page-hills as flat #545454/dark silhouettes, among them two or three BOOK-SPINE towers (books standing upright, silhouetted) and one distant tiny schoolhouse silhouette. A few floating letters drift like fireflies (small, faint). NO foreground elements, NO ground line at the bottom edge (the game draws terrain over it). MUST loop horizontally (left edge continues the right edge). 1536×512.

---
CARD 18 · filename: bg_mid.png
SAVE TO: ~/Code/codex-art-lab/batch-s/ch01/bg_mid.png
SIZE: 1536×256
FORMAT: PNG with TRUE alpha transparency
USED FOR: ch01 mid background strip (nearer silhouettes over bg_far).
SUBJECT BRIEF:
SUBJECT: a TRANSPARENT horizontal strip of nearer background silhouettes for the same meadow level: a picket fence run, two leaning trees, a mailbox, tall grass tufts — all as slightly-lit dark shapes (one tone + black), bottom-aligned, top 60% of the image fully transparent. Loops horizontally. 1536×256. FORMAT: PNG with a fully TRANSPARENT background (true alpha — do not paint a checkerboard).

---
CARD 19 · filename: walker_sheet.png
SAVE TO: ~/Code/codex-art-lab/batch-s/ch01/walker_sheet.png
SIZE: 512×256 (2×1 grid)
FORMAT: pose-sheet on SOLID magenta #FF00FF (no transparency)
USED FOR: Level creature walker → sliced to walker-0.png / walker-1.png.
SUBJECT BRIEF:
SUBJECT: a 2×1 animation sheet (two cells, same creature): TINTENKLECKS the walker: a knee-high blob of dark ink with two stubby feet, big worried white eyes with black pupils, a drip standing up on its head like a cowlick. Cell 1: mid-step left foot forward. Cell 2: mid-step right foot forward, body squashed 10% lower. Side view facing LEFT, ~180px tall in 256px cells, big readable eyes, black outline, readable at 48px. FORMAT: PNG pose-sheet on a SOLID magenta #FF00FF background (no transparency — the magenta is chroma-keyed later). Lay the poses in a clean grid, equal cell sizes, nothing touching cell borders.

---
CARD 20 · filename: hopper_sheet.png
SAVE TO: ~/Code/codex-art-lab/batch-s/ch01/hopper_sheet.png
SIZE: 512×256 (2×1 grid)
FORMAT: pose-sheet on SOLID magenta #FF00FF (no transparency)
USED FOR: Level creature hopper → sliced to hopper-0.png / hopper-1.png.
SUBJECT BRIEF:
SUBJECT: a 2×1 animation sheet (two cells, same creature): HÜPFER the spring-hopper: a round ink blob riding a visible violet zigzag SPRING. Cell 1: spring coiled, blob squashed. Cell 2: spring extended, blob stretched tall. Side view facing LEFT, ~180px tall in 256px cells, big readable eyes, black outline, readable at 48px. FORMAT: PNG pose-sheet on a SOLID magenta #FF00FF background (no transparency — the magenta is chroma-keyed later). Lay the poses in a clean grid, equal cell sizes, nothing touching cell borders.

---
CARD 21 · filename: flyer_sheet.png
SAVE TO: ~/Code/codex-art-lab/batch-s/ch01/flyer_sheet.png
SIZE: 512×256 (2×1 grid)
FORMAT: pose-sheet on SOLID magenta #FF00FF (no transparency)
USED FOR: Level creature flyer → sliced to flyer-0.png / flyer-1.png.
SUBJECT BRIEF:
SUBJECT: a 2×1 animation sheet (two cells, same creature): FLATTERER the possessed book: a small hardcover book flying with its covers as flapping wings, cream pages, two angry-worried eyes on the spine, a drop of ink falling from a page. Cell 1: wings up. Cell 2: wings down. Side view facing LEFT, ~180px tall in 256px cells, big readable eyes, black outline, readable at 48px. FORMAT: PNG pose-sheet on a SOLID magenta #FF00FF background (no transparency — the magenta is chroma-keyed later). Lay the poses in a clean grid, equal cell sizes, nothing touching cell borders.

---
CARD 22 · filename: thief_sheet.png
SAVE TO: ~/Code/codex-art-lab/batch-s/ch01/thief_sheet.png
SIZE: 512×256 (2×1 grid)
FORMAT: pose-sheet on SOLID magenta #FF00FF (no transparency)
USED FOR: Level creature thief → sliced to thief-0.png / thief-1.png.
SUBJECT BRIEF:
SUBJECT: a 2×1 animation sheet (two cells, same creature): WORTDIEB the word-thief: a hunched imp made of smudged ink with a bulging paper sack over its shoulder (a letter 'a' peeking out), sneaky sideways eyes, mid-scurry. Cell 1: legs in scurry pose A. Cell 2: legs in scurry pose B, sack bouncing. Side view facing LEFT, ~180px tall in 256px cells, big readable eyes, black outline, readable at 48px. FORMAT: PNG pose-sheet on a SOLID magenta #FF00FF background (no transparency — the magenta is chroma-keyed later). Lay the poses in a clean grid, equal cell sizes, nothing touching cell borders.

---
CARD 23 · filename: cushion_sheet.png
SAVE TO: ~/Code/codex-art-lab/batch-s/ch01/cushion_sheet.png
SIZE: 512×256 (2×1 grid)
FORMAT: pose-sheet on SOLID magenta #FF00FF (no transparency)
USED FOR: Level creature cushion → sliced to cushion-0.png / cushion-1.png.
SUBJECT BRIEF:
SUBJECT: a 2×1 animation sheet (two cells, same creature): SPRUNGKISSEN the bounce-pouf: a friendly wide cushion creature, stitched seams, closed happy eyes and a small smile (it is harmless — kids bounce on it). Cell 1: at rest. Cell 2: squashed flat mid-bounce. Side view facing LEFT, ~180px tall in 256px cells, big readable eyes, black outline, readable at 48px. FORMAT: PNG pose-sheet on a SOLID magenta #FF00FF background (no transparency — the magenta is chroma-keyed later). Lay the poses in a clean grid, equal cell sizes, nothing touching cell borders.

---
CARD 24 · filename: cloud_sheet.png
SAVE TO: ~/Code/codex-art-lab/batch-s/ch01/cloud_sheet.png
SIZE: 512×256 (2×1 grid)
FORMAT: pose-sheet on SOLID magenta #FF00FF (no transparency)
USED FOR: Level creature cloud → sliced to cloud-0.png / cloud-1.png.
SUBJECT BRIEF:
SUBJECT: a 2×1 animation sheet (two cells, same creature): SCHATTENWOLKE the ink cloud: a small dark storm cloud with worried eyes and a faintly glowing violet underside. Cell 1: calm. Cell 2: underside charged bright, one tiny ink bolt forming. Side view facing LEFT, ~180px tall in 256px cells, big readable eyes, black outline, readable at 48px. FORMAT: PNG pose-sheet on a SOLID magenta #FF00FF background (no transparency — the magenta is chroma-keyed later). Lay the poses in a clean grid, equal cell sizes, nothing touching cell borders.

---
CARD 25 · filename: boss_sheet.png
SAVE TO: ~/Code/codex-art-lab/batch-s/ch01/boss_sheet.png
SIZE: 1024×512 (2×2 grid... 4 cells)
FORMAT: pose-sheet on SOLID magenta #FF00FF (no transparency)
USED FOR: Der Stundenplan-Schlinger → boss_head_idle / boss_head_tell / boss_card / boss_burst.
SUBJECT BRIEF:
SUBJECT: a 2×2 sheet for the chapter-1 guardian DER STUNDENPLAN-SCHLINGER — a school timetable tangled into a knot-serpent. Cell 1 (head, idle): a round tangled-paper knot head with two big googly worried eyes and a clenched-card mouth, loose paper strips like hair. Cell 2 (head, telegraph): the SAME head rearing back, eyes wide, strips flaring — clearly about to strike (readable in half a second). Cell 3 (card segment): one timetable card — cream paper, ruled lines, a subject word area left BLANK (the game prints text on it), slightly bent, black outline. Cell 4 (burst): a soft violet #fc54fc/#a800a8 puff-of-ink star (the stun poof). Each element centered in its cell. FORMAT: PNG pose-sheet on a SOLID magenta #FF00FF background (no transparency — the magenta is chroma-keyed later). Lay the poses in a clean grid, equal cell sizes, nothing touching cell borders.

---
END OF COMMISSION. After the final card, print a manifest of every filename you
produced, in order, marked DONE or REGENERATED.
