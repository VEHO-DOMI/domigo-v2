// THE CODEX COMMISSION — data (doc 28 §5). Every image asset as one card:
// Koki pastes a card's prompt into Codex, saves the result under the card's
// exact filename into docs/art/drop/<folder>/. build-commission.mjs renders
// this into the self-contained CODEX_COMMISSION.html.
//
// Style ground truth: doc 28 §2 (machine-extracted from the six real Keen 4
// level maps). Every prompt is SELF-CONTAINED: palette + laws + subject.

export const EGA = [
  "#000000", "#0000a8", "#00a800", "#00a8a8", "#a80000", "#a800a8", "#a85400",
  "#a8a8a8", "#545454", "#5454fc", "#54fc54", "#54fcfc", "#fc5454", "#fc54fc",
  "#fcfc54", "#fcfcfc",
];

// The one paragraph every prompt carries (the style contract).
export const STYLE = `STYLE (strict): 1991 EGA pixel art in the exact visual language of Commander Keen 4. Use ONLY these 16 colors: ${EGA.join(" ")}. Chunky pixels on a 16px-tile logical grid (render large, but every "pixel" is a crisp square — no anti-aliasing, no smooth gradients, no soft shading). Texture and gradients ONLY as 1-pixel checkerboard dithering between two palette colors. Foreground objects get bold black contour outlines and black interior detail lines; background surfaces stay outline-free. Two tones per material (base + bright of the same hue) with black as the dark shade. Friendly storybook mood — this is a children's English-learning game set INSIDE a book: ink, paper, letters. Never scary: no monsters, no horror, big readable eyes on creatures, melancholy-comic not menacing.`;

const T = {
  transparent: "FORMAT: PNG with a fully TRANSPARENT background (true alpha — do not paint a checkerboard).",
  fullbleed: "FORMAT: PNG, full-bleed (no transparency needed).",
  sheet: "FORMAT: PNG pose-sheet on a SOLID magenta #FF00FF background (no transparency — the magenta is chroma-keyed later). Lay the poses in a clean grid, equal cell sizes, nothing touching cell borders.",
};

/** @typedef {{stem:string,file:string,folder:string,batch:string,size:string,format:keyof T|string,usage:string,prompt:string,gen?:string}} Card */

/** One Codex generation can yield several stems (sheets) — `gen` groups them. */
export const cards = [
  // ── BATCH S · 0 — the style key (ALWAYS FIRST; Koki gates it) ──────────────
  {
    stem: "_style_key", file: "_style_key.png", folder: "root", batch: "S",
    size: "1024×640", format: "fullbleed",
    usage: "The cohesion reference — synced but never rendered. Every later generation should be checked against it by eye.",
    prompt: `${STYLE}\n\nSUBJECT: a single wide reference scene that establishes this game's world: the inside of an open storybook as a side-view platformer place. Left third: rolling meadow ground in brown ${"#a85400"} earth with a bright green ${"#00a800"}/${"#54fc54"} grass lip, gentle hills, one climbing pole with a small flag. Middle: a small friendly schoolhouse (white ${"#fcfcfc"} walls, gray roof, black outlines). Right third: the ground curls up like a PAGE OF PAPER, faint ruled notebook lines inside the earth, two or three large printed letters half-buried like fossils. Sky: flat bright cyan ${"#54fcfc"} with two black-outlined white clouds. One small ink-blob creature with big worried eyes stands on the meadow. 1024×640.`,
  },

  // ── BATCH S · 1 — prologue illustrations (full-bleed beats) ────────────────
  {
    stem: "prologue_classroom", file: "prologue_classroom.png", folder: "beats", batch: "S",
    size: "1536×864", format: "fullbleed",
    usage: "Prologue s001 — the classroom, the new English book glowing at the seams.",
    prompt: `${STYLE}\n\nSUBJECT: a warm Austrian classroom from a student's seat: wooden desks, a blackboard with "ENGLISH" chalked on it, afternoon light. On the front desk lies a large closed English textbook — and warm golden ${"#fcfc54"} light leaks from between its pages, a few letter-shapes floating out of the gap like dust. Kids' hands and pencil cases at the edges of frame, no faces in focus. Cozy, curious, zero menace. 1536×864, full-bleed.`,
  },
  {
    stem: "prologue_pull", file: "prologue_pull.png", folder: "beats", batch: "S",
    size: "1536×864", format: "fullbleed",
    usage: "Prologue s002 — the book bursts open and pulls the player in.",
    prompt: `${STYLE}\n\nSUBJECT: the same textbook now WIDE OPEN, pages fanning, a swirling vortex of white ${"#fcfcfc"} and yellow ${"#fcfc54"} LETTERS (real latin letters, various sizes) spiraling up out of the pages and wrapping around the view — we are being pulled INTO the book, motion lines, a school bag tumbling along. Exciting like a rollercoaster drop, never frightening: bright cyan ${"#54fcfc"} light at the vortex center (a sky waits inside). 1536×864, full-bleed.`,
  },
  {
    stem: "prologue_landing", file: "prologue_landing.png", folder: "beats", batch: "S",
    size: "1536×864", format: "fullbleed",
    usage: "Prologue s003 — first sight of the book's world; Finn and Pixel greet you.",
    prompt: `${STYLE}\n\nSUBJECT: looking out over the book's world from a gentle rise: a walkable storybook land drawn ON an open book page (faint ruled lines and a page-curl at the horizon), fifteen tiny chapter-lands in the distance — most drained to gray ${"#a8a8a8"}/${"#545454"}, only the nearest meadow still in color. In the foreground, greeting us: FINN — a floating open paper book with two friendly black dot-eyes (a person, not furniture; cream ${"#fcfcfc"} pages, ink spine) — and PIXEL, a small black ${"#000000"} cat with amber ${"#fcfc54"} eyes, tail curled mid-swish. Hopeful, quiet, a little sad at the edges (the gray lands), warm where the characters stand. 1536×864, full-bleed.`,
  },

  // ── BATCH S · 2 — portraits (transparent busts for speech bubbles) ─────────
  ...[
    ["finn", "FINN, the book-guide: a floating open paper book AS a person — cream white pages like wings, a dark ink spine, two big friendly black dot-eyes on the left page, tiny ink eyebrows. Kind, eager, slightly guilty around the edges."],
    ["pixel", "PIXEL, the book-cat: a small black cat, round face, huge amber-yellow eyes, one ear tipped. Curious and unimpressed at the same time."],
    ["berger", "FRAU BERGER, the teacher: a warm Austrian primary-school teacher, cardigan, reading glasses on a cord, gentle smile. Grandmotherly-competent."],
    ["tintengeist", "DER TINTENGEIST, the gentle ink-spirit: a soft rounded ghost-shape made of dark blue-black ink with two calm white eyes and a tiny warm smile — a HELPER who catches falling children, never a threat. Round, pillowy, kind."],
    ["jona", "JONA: a tired boy of about 11, hair uncombed, oversized sweater, holding a pencil stub, eyes down but hopeful when seen. NEVER a shadow or villain — a hurt kid. Gentle, quiet colors."],
  ].map(([id, desc]) => ({
    stem: `portrait_${id}`, file: `portrait_${id}.png`, folder: "cast", batch: "S",
    size: "512×512", format: "transparent",
    usage: `Speech-bubble portrait for ${id} (dialogue beats).`,
    prompt: `${STYLE}\n\nSUBJECT: a bust/head-and-shoulders PORTRAIT for a dialogue box: ${desc} Centered, facing slightly left, readable at 40×40 px. 512×512. ${T.transparent}`,
  })),

  // ── BATCH S · 3 — the hero (12-pose sheet + accessories) ───────────────────
  {
    stem: "hero_sheet", file: "hero_sheet.png", folder: "hero", batch: "S", gen: "hero",
    size: "1024×768 (4×3 grid, 256px cells)", format: "sheet",
    usage: "THE HERO (doc 28 §4): sliced into hero_stand/run1-4/jump/fall/pogo1-2/climb1-2/hang.",
    prompt: `${STYLE}\n\nSUBJECT: a 4×3 pose sheet of THE SAME child hero, identical design in every cell — a schoolkid adventurer, about 10: mid-brown messy hair, mustard-yellow ${"#fcfc54"} shirt, dark trousers, a small brown satchel worn cross-body, a red scarf, and a giant WHITE QUILL PEN (gold nib) strapped on the back. Side view facing RIGHT unless stated. Cells in reading order: 1 stand (relaxed) · 2-5 run cycle (contact, pass, contact-other, pass — arm swing, scarf trailing) · 6 jump (knees tucked, rising) · 7 fall (arms out, hair up) · 8 pogo COMPRESSED (riding the quill nib-down like a pogo stick, knees bent, spring squashed) · 9 pogo EXTENDED (stretched tall on the quill mid-bounce) · 10-11 climb (facing CAMERA, gripping a pole, hands alternating) · 12 hang (facing camera, both arms up gripping a ledge). Each character ~200px tall inside its 256px cell, nothing touching cell borders. ${T.sheet}`,
  },
  {
    stem: "acc_sheet", file: "acc_sheet.png", folder: "hero", batch: "S", gen: "acc",
    size: "512×256 (2×1 grid)", format: "sheet",
    usage: "Unlockable accessory overlays: acc_scarf (a blue variant scarf) + acc_cap (a green cap). Drawn to overlay the hero's stand pose alignment.",
    prompt: `${STYLE}\n\nSUBJECT: a 2×1 sheet of ACCESSORY OVERLAYS for the hero above (same proportions, same anchor): cell 1 — a bright blue ${"#5454fc"} scarf only, positioned where the hero's neck/shoulder is, flowing right; cell 2 — a green ${"#00a800"} cap only, positioned where the hero's head is. NOTHING else in the cells (they are transparent overlays to be layered onto the character). ${T.sheet}`,
  },

  // ── BATCH S · 4 — the world map set ────────────────────────────────────────
  {
    stem: "page_underlay", file: "page_underlay.png", folder: "map", batch: "S",
    size: "1024×1024, tileable", format: "fullbleed",
    usage: "The open book page BENEATH the world map (tiled).",
    prompt: `${STYLE}\n\nSUBJECT: a seamless TILEABLE texture of aged storybook paper seen from above: warm off-white ${"#fcfcfc"} with the faintest gray ${"#a8a8a8"} ruled lines, a few tiny ink specks, extremely low contrast (game terrain renders on top — it must never compete). 1024×1024, edges must tile perfectly.`,
  },
  {
    stem: "building_ch01", file: "building_ch01.png", folder: "map", batch: "S",
    size: "256×256", format: "transparent",
    usage: "Chapter 1's map building: the little schoolhouse (Zeit für die Schule).",
    prompt: `${STYLE}\n\nSUBJECT: a small friendly one-room schoolhouse for a world map, 3/4 front view: white ${"#fcfcfc"} walls with black outlines, gray ${"#a8a8a8"} shingle roof, a little bell tower, red ${"#a80000"} door, two windows with warm yellow light, a tiny flagpole holder on the gable (empty). Sits on a small grass patch. Readable at 64px. 256×256. ${T.transparent}`,
  },
  {
    stem: "finn_map", file: "finn_map.png", folder: "map", batch: "S",
    size: "128×128", format: "transparent",
    usage: "Finn's world-map sprite (floating book person).",
    prompt: `${STYLE}\n\nSUBJECT: FINN as a tiny map sprite: a floating open paper book with two black dot-eyes, pages slightly lifted like wings, small ink shadow beneath. Readable at 44px. 128×128. ${T.transparent}`,
  },
  {
    stem: "pixel_map", file: "pixel_map.png", folder: "map", batch: "S",
    size: "128×128", format: "transparent",
    usage: "Pixel's world-map sprite (the book-cat).",
    prompt: `${STYLE}\n\nSUBJECT: PIXEL as a tiny map sprite: a small black cat sitting, tail curled around the feet, amber ${"#fcfc54"} eyes, one ear tipped. Readable at 40px. 128×128. ${T.transparent}`,
  },
  {
    stem: "flag", file: "flag.png", folder: "map", batch: "S",
    size: "128×128", format: "transparent",
    usage: "The restoration flag planted on beaten chapters (thrown-flag ceremony).",
    prompt: `${STYLE}\n\nSUBJECT: a small triumphant pennant flag on a short wooden pole with a gold finial: warm violet-blue banner with a tiny white book emblem, mid-wave. Readable at 32px. 128×128. ${T.transparent}`,
  },

  // ── BATCH S · 5 — chapter 1's level set ────────────────────────────────────
  {
    stem: "bg_far", file: "bg_far.png", folder: "ch01", batch: "S",
    size: "1536×512, horizontally loopable", format: "fullbleed",
    usage: "ch01 far background layer (parallax) — the meadow horizon.",
    prompt: `${STYLE}\n\nSUBJECT: a wide side-view BACKGROUND for a platformer level set on a storybook meadow at dusk-in-a-book: deep ink-navy upper sky dithering down (1px checkerboard) into teal ${"#00a8a8"}, a far horizon of rolling page-hills as flat ${"#545454"}/dark silhouettes, among them two or three BOOK-SPINE towers (books standing upright, silhouetted) and one distant tiny schoolhouse silhouette. A few floating letters drift like fireflies (small, faint). NO foreground elements, NO ground line at the bottom edge (the game draws terrain over it). MUST loop horizontally (left edge continues the right edge). 1536×512.`,
  },
  {
    stem: "bg_mid", file: "bg_mid.png", folder: "ch01", batch: "S",
    size: "1536×256", format: "transparent",
    usage: "ch01 mid background strip (nearer silhouettes over bg_far).",
    prompt: `${STYLE}\n\nSUBJECT: a TRANSPARENT horizontal strip of nearer background silhouettes for the same meadow level: a picket fence run, two leaning trees, a mailbox, tall grass tufts — all as slightly-lit dark shapes (one tone + black), bottom-aligned, top 60% of the image fully transparent. Loops horizontally. 1536×256. ${T.transparent}`,
  },
  ...[
    ["walker", "TINTENKLECKS the walker: a knee-high blob of dark ink with two stubby feet, big worried white eyes with black pupils, a drip standing up on its head like a cowlick. Cell 1: mid-step left foot forward. Cell 2: mid-step right foot forward, body squashed 10% lower."],
    ["hopper", "HÜPFER the spring-hopper: a round ink blob riding a visible violet zigzag SPRING. Cell 1: spring coiled, blob squashed. Cell 2: spring extended, blob stretched tall."],
    ["flyer", "FLATTERER the possessed book: a small hardcover book flying with its covers as flapping wings, cream pages, two angry-worried eyes on the spine, a drop of ink falling from a page. Cell 1: wings up. Cell 2: wings down."],
    ["thief", "WORTDIEB the word-thief: a hunched imp made of smudged ink with a bulging paper sack over its shoulder (a letter 'a' peeking out), sneaky sideways eyes, mid-scurry. Cell 1: legs in scurry pose A. Cell 2: legs in scurry pose B, sack bouncing."],
    ["cushion", "SPRUNGKISSEN the bounce-pouf: a friendly wide cushion creature, stitched seams, closed happy eyes and a small smile (it is harmless — kids bounce on it). Cell 1: at rest. Cell 2: squashed flat mid-bounce."],
    ["cloud", "SCHATTENWOLKE the ink cloud: a small dark storm cloud with worried eyes and a faintly glowing violet underside. Cell 1: calm. Cell 2: underside charged bright, one tiny ink bolt forming."],
  ].map(([kind, desc]) => ({
    stem: `${kind}_sheet`, file: `${kind}_sheet.png`, folder: "ch01", batch: "S", gen: kind,
    size: "512×256 (2×1 grid)", format: "sheet",
    usage: `Level creature ${kind} → sliced to ${kind}-0.png / ${kind}-1.png.`,
    prompt: `${STYLE}\n\nSUBJECT: a 2×1 animation sheet (two cells, same creature): ${desc} Side view facing LEFT, ~180px tall in 256px cells, big readable eyes, black outline, readable at 48px. ${T.sheet}`,
  })),
  {
    stem: "boss_sheet", file: "boss_sheet.png", folder: "ch01", batch: "S", gen: "boss",
    size: "1024×512 (2×2 grid... 4 cells)", format: "sheet",
    usage: "Der Stundenplan-Schlinger → boss_head_idle / boss_head_tell / boss_card / boss_burst.",
    prompt: `${STYLE}\n\nSUBJECT: a 2×2 sheet for the chapter-1 guardian DER STUNDENPLAN-SCHLINGER — a school timetable tangled into a knot-serpent. Cell 1 (head, idle): a round tangled-paper knot head with two big googly worried eyes and a clenched-card mouth, loose paper strips like hair. Cell 2 (head, telegraph): the SAME head rearing back, eyes wide, strips flaring — clearly about to strike (readable in half a second). Cell 3 (card segment): one timetable card — cream paper, ruled lines, a subject word area left BLANK (the game prints text on it), slightly bent, black outline. Cell 4 (burst): a soft violet ${"#fc54fc"}/${"#a800a8"} puff-of-ink star (the stun poof). Each element centered in its cell. ${T.sheet}`,
  },
];

/** Per-act future sections (cards generated per-chapter at wave time — the
 *  commission lists them as scoped placeholders so the doc IS the full list). */
export const futureSections = [
  { title: "Act 1 — ch02 · ch03 · ch04 · ch05", note: "Per chapter: bg_far + bg_mid pair (themed per its sheet §1 signature) · guardian 2×2 sheet · building_chNN · 1 beat illustration · NPC portraits: captain (ch03), robo (ch04), anna (ch05). Prompts authored from docs/design/g1/chNN.md §6 when the act wave opens." },
  { title: "Act 2 — ch06 … ch11", note: "As Act 1, plus the canon creatures: creature_radierer (ch06), creature_flatterbuchstaben (ch07), creature_verdreher (ch08), Rotstift (ch10) · NPC portraits mo, luca, mila, tim, apple, tik · ch11's fading-platform tile set." },
  { title: "Act 3 — ch12 … ch15", note: "As Act 1 · NPC portraits rosa, sam, peppi · ch14 colorwave strip · ch15: boss_ch15_jona set (idle/tell-as-turning-away/note/door-light) + ch15_beat_door (the campaign's final image)." },
  { title: "Year 2 — The Spill", note: "Commissioned when year-1 Act 2 is in build (doc 28 §7)." },
];
