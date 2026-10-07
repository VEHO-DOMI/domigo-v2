// THE CODEX COMMISSION — BATCH T (refoundation v3, doc 29 + doc 28 two-class law).
// Two image classes, two style contracts:
//   CUTSCENE — hi-res PAINTERLY (Koki's verdict: gameplay-resolution pixels shown
//              full-screen "look broken"); Keen-inspired palette/mood, painted.
//   GAMEPLAY — crisp EGA pixel art at native sprite resolution (the Batch S
//              contract, unchanged), shown at integer scales only.
// Rendered by build-commission-t.mjs into CODEX_COMMISSION_T.html + CODEX_MASTER_PROMPT_T.md.
import { EGA, STYLE } from "./commission-data.mjs";

export { EGA, STYLE };

// The GAMEPLAY contract v2 (Koki 2026-07-17: "the pixel art is much more
// sophisticated in the keen art and that should be reflected"). Supersedes the
// Batch S STYLE paragraph for every Batch T pixel card — extracted from the
// real Keen 4 maps (Perilous Pit terrain, Border Village walls): dense
// dithering, 3-4-tone ramps, organic silhouettes, zero flat surfaces.
export const STYLE_PIXEL_V2 = `STYLE (strict, class GAMEPLAY — the Commander Keen 4 craft bar): 1991 EGA pixel art AT THE CRAFT LEVEL OF COMMANDER KEEN 4. Study the provided reference crops FIRST — your output must sit next to them without looking simpler. Use ONLY these 16 colors: ${EGA.join(" ")}. Crisp square pixels, zero anti-aliasing, zero smooth gradients. THE ANTI-FLAT LAW: no large flat single-color area anywhere — every surface carries pixel-level texture the way Keen 4's do: dense 1-pixel dithering (checkerboard AND irregular scatter) between neighboring tones, plus material patterns drawn INTO the surface (rock strata and pebble clusters, wood-grain strokes, leaf veins, paper fibre and faint ruled lines for our book-world earth). TONE RAMPS: 3-4 tones per material (dark shade — often black or the hue's dark EGA partner — then base, bright, and a small highlight), light from the top-left, shade to the bottom-right. SILHOUETTES: rounded and ORGANIC — grass lips overhang their earth band with irregular tufts, rock edges chip, trunks bulge at the roots; ruler-straight edges belong only to man-made objects (planks, doors, rulers). Background-wall areas inside a tile read as darker, lower-contrast dithered masses so the walk surface pops. SPRITES: bold black contour with interior detail lines, a real light source (specular dot on round forms), big readable eyes, poses readable in half a second. Friendly storybook mood — this is a children's English-learning game set INSIDE a book: ink, paper, letters. Never scary: no monsters, no horror; melancholy-comic, not menacing.`;

// The painterly contract (class CUTSCENE). Same world, same cast, same mood —
// different rendering: painted, not pixeled.
export const STYLE_CUTSCENE = `STYLE (strict, class CUTSCENE): a warmly PAINTED children's storybook illustration — NOT pixel art. Soft painterly brushwork, gentle gradients, clean shapes, professional picture-book quality (think modern illustrated children's novels). PALETTE: build every scene from the mood of this EGA-derived family — deep ink blues/blacks, warm paper cream, mustard yellow ${"#fcfc54"}, warm brown ${"#a85400"}, fresh green ${"#00a800"}, sky cyan ${"#54fcfc"}, accent red ${"#fc5454"} — painted freely (shades and gradients allowed), so the painted scenes and the in-game pixel world read as ONE world. RECURRING CAST (identical design every time they appear): THE HERO — a schoolkid of about 10, mid-brown messy hair, mustard-yellow shirt, dark trousers, small brown cross-body satchel, red scarf, a giant white quill pen (gold nib) strapped on the back. FINN — a floating open paper book AS a person: cream pages like wings, dark ink spine, two big friendly black dot-eyes on the left page, tiny ink eyebrows. PIXEL — a small black cat with huge amber-yellow eyes, one ear tipped. FRAU BERGER — a warm Austrian primary-school teacher, cardigan, reading glasses on a cord. DER TINTENGEIST — a soft rounded spirit of dark blue-black ink, calm white eyes, never menacing. Mood: warm, curious, a little wistful where the world is grey — NEVER scary (no horror, no sharp teeth, no darkness-as-threat; this is for 10-year-olds learning English). No text, no watermarks, no borders.`;

const T = {
  transparent: "FORMAT: PNG with a fully TRANSPARENT background (true alpha — do not paint a checkerboard).",
  fullbleed: "FORMAT: PNG, full-bleed (no transparency needed).",
  sheet: "FORMAT: PNG pose-sheet on a SOLID magenta #FF00FF background (no transparency — the magenta is chroma-keyed later). Lay the cells in a clean grid, equal cell sizes, nothing touching cell borders.",
};

const cut = (stem, size, usage, subject) => ({
  stem, file: `${stem}.png`, folder: "beats", batch: "T", cls: "cutscene",
  size, format: "fullbleed", usage,
  prompt: `${STYLE_CUTSCENE}\n\nSUBJECT: ${subject} ${size.split(" ")[0]}, full-bleed.`,
});

export const cardsT = [
  // ── T·0 — the CUTSCENE style key (ALWAYS FIRST; Koki gates it) ─────────────
  {
    stem: "_style_key_cutscene", file: "_style_key_cutscene.png", folder: "root", batch: "T", cls: "cutscene",
    size: "1920×1080", format: "fullbleed",
    usage: "The painted-class cohesion reference — synced but never rendered. Every cutscene image is checked against it by eye.",
    prompt: `${STYLE_CUTSCENE}\n\nSUBJECT: the anchor scene of the whole story: the child hero, Finn (the book-person) and Pixel (the cat) stand on a rise inside the book's world — a storybook land drawn ON an open book page, faint ruled lines in the earth, a page curling at the horizon. The nearest meadow glows in warm color; the lands behind fade to soft grey. Warm late light. All three characters exactly as the cast descriptions. 1920×1080, full-bleed.`,
  },

  // ── T·1 — PROLOGUE v2, the 13 shots (doc 29 §3 — one painted image per shot) ──
  cut("pv_classroom", "1920×1080",
    "Prologue shot 1 — first English day.",
    "a warm Austrian classroom on the first day of English class, seen from a student's seat: wooden desks, morning light through tall windows, a friendly teacher (FRAU BERGER) smiling at the front, a blackboard with a small chalk 'ENGLISH' and a doodled sun. Kids' backs and pencil cases in the foreground, no student faces in focus. Cozy anticipation."),
  cut("pv_book_cover", "1920×1080",
    "Prologue shot 2 — the special book (BOTH flags on the cover).",
    "close on the teacher's desk: a beautiful, slightly old-fashioned English textbook lying closed — its cover carries BOTH a British Union Jack AND an American stars-and-stripes flag side by side, plus warm gold lettering-shapes (no readable text). A faint warm glow leaks from between the pages. Frau Berger's hands rest proudly beside it."),
  cut("pv_book_glow", "1920×1080",
    "Prologue shot 3 — the book glows.",
    "the same book now half-open on the desk, golden light pouring UP out of it like a lantern, single letter-shapes floating in the light like dust motes, the class leaning in from the edges of frame in silhouette, wide curious eyes catching the glow."),
  cut("pv_spill", "1920×1080",
    "Prologue shot 4 — the accident: the words spill.",
    "the book bursts fully open: pages fan violently, and streams of LETTERS pour out and up like startled birds scattering through the classroom, desks rattling, a pencil case tipping over. Dynamic but exciting-not-frightening: the light stays warm gold and cyan."),
  cut("pv_pull", "1920×1080",
    "Prologue shot 5 — the pull.",
    "looking down INTO the open book from above: its pages have become a swirling paper-and-letter vortex with bright cyan sky visible at the very center; the child hero's hands grip the desk edge at the bottom of frame, scarf flying forward, school bag tumbling ahead into the swirl. A rollercoaster drop, not a horror fall."),
  cut("pv_landing", "1920×1080",
    "Prologue shot 6 — landing inside the book.",
    "the hero sits up dazed on a huge soft meadow that is clearly a BOOK PAGE — grass growing in gentle ruled lines, giant printed letters half-buried in the earth like friendly fossils, an ink-blue evening sky above with paper-white clouds. The hero small in the wide frame, wonder on their face."),
  cut("pv_meet_finn", "1920×1080",
    "Prologue shot 7 — Finn introduces himself.",
    "FINN the book-person floats down to eye level with the seated hero, pages spread like a gentle bow, big friendly dot-eyes bright; warm light between them. First-meeting warmth, a touch of guilt in Finn's eyebrows."),
  cut("pv_meet_pixel", "1920×1080",
    "Prologue shot 8 — Pixel.",
    "PIXEL the small black cat winds around the hero's legs, tail curled like a brush-stroke question mark, huge amber eyes looking up — half affection, half assessment. The hero reaches down to pet her. Close, warm, funny."),
  cut("pv_grey_world", "1920×1080",
    "Prologue shot 9 — the stakes: the world loses its words.",
    "a wide vista of the book's world where COLOR IS DRAINING: the near meadow still warm and green, but the middle distance fading to soft greys — trees, a village, a zoo, a little harbor all turning pale like an unfinished drawing; single letters lift off distant pages and drift away like ash. Wistful, quiet, still beautiful — melancholy, never horror."),
  cut("pv_tintengeist", "1920×1080",
    "Prologue shot 10 — the Tintengeist appears (introduced BEFORE it ever holds anyone).",
    "high above the grey lands, DER TINTENGEIST drifts across the sky: a huge, soft, rounded ink-spirit, calm white eyes, a long trail of collected letters following it like a scarf. Finn and the hero watch from behind a page-fold, hushed — awe, not terror. The spirit looks lonely rather than evil."),
  cut("pv_jona_note", "1920×1080",
    "Prologue shot 11 — Jona's note.",
    "close on a handwritten note pinned to a wooden signpost at the meadow's edge: child's handwriting lines (unreadable squiggles, no real text), a small pencil doodle of a smiling sun in the corner, one corner fluttering. Finn's page-wing points at it; Pixel sniffs the post. Soft mystery."),
  cut("pv_mission", "1920×1080",
    "Prologue shot 12 — the mission.",
    "FINN hovers before the hero holding out a page like an open hand; the hero, standing now, reaches toward it with new resolve, scarf lifting in the breeze; PIXEL's tail curls into an arrow pointing toward the grey horizon. Warm rally-the-party energy."),
  cut("pv_map_reveal", "1920×1080",
    "Prologue shot 13 — the world map reveal.",
    "a breathtaking high view of the whole book-world: an enormous OPEN BOOK seen from above at a gentle angle, its two pages forming lands — meadows, a schoolhouse glowing warm and inviting in the nearest corner, paths of ink connecting fifteen small chapter-places, most still soft grey, the nearest few in color. The hero, Finn and Pixel tiny at the bottom edge, looking out over it."),

  // ── T·2 — ch01 beat cutscenes ──────────────────────────────────────────────
  cut("bt_ch01_door", "1920×1080",
    "Chapter 1 door beat — the knotted school.",
    "the little schoolhouse from the world map, now close: a friendly two-story schoolhouse ON a book page — but its outline is tangled with thick ink THREADS tied into soft knots, windows dim grey; two faint warm glows pulse inside (the two seals): one in a ground-floor classroom window, one in the attic gable window. Finn and the hero stand at the gate looking up. Determined, warm."),
  cut("bt_ch01_restore", "1920×1080",
    "Chapter 1 restore beat — the page comes back.",
    "the same schoolhouse UNKNOTTED and radiant: ink threads dissolving into drifting letters, color flooding back across the page like watercolor spreading — green grass, red roof, warm windows; a small flag rising on the flagpole; Finn spinning happily, Pixel on a fence post, the hero mid-cheer. Pure warm victory."),

  // ── T·3 — painted level backdrops (HD-2D: painted scenery, pixel gameplay) ──
  {
    stem: "bgp_schoolhouse_far", file: "bgp_schoolhouse_far.png", folder: "ch01", batch: "T", cls: "backdrop",
    size: "2048×1024", format: "fullbleed",
    usage: "Chapter 1 FAR backdrop layer (parallax 0.35) — replaces the dither bands. Must tile horizontally.",
    prompt: `${STYLE_CUTSCENE}\n\nSUBJECT: a PAINTED side-view background for a platformer level set inside a book: a deep ink-blue evening sky fading to warm teal at the horizon, soft paper-white clouds, distant grey-blue paper hills with faint ruled notebook lines, far-away tiny page-curls on the skyline. NO foreground objects, NO characters, nothing closer than the far hills — this sits far behind the action. Muted, atmospheric, uncluttered. CRITICAL: the LEFT and RIGHT edges must match perfectly so the image tiles horizontally without a seam. 2048×1024, full-bleed.`,
  },
  {
    stem: "bgp_schoolhouse_mid", file: "bgp_schoolhouse_mid.png", folder: "ch01", batch: "T", cls: "backdrop",
    size: "2048×640", format: "transparent",
    usage: "Chapter 1 MID backdrop band (parallax 0.6) — sits over the far layer, under the gameplay.",
    prompt: `${STYLE_CUTSCENE}\n\nSUBJECT: a PAINTED mid-distance band for the same book-world level: a soft skyline of schoolyard silhouettes — a fence, a tree with page-leaves, a distant swing set, a low wall with big faded printed letters leaning against it — all in muted blue-grey-green tones, slightly darker than a far sky would be. The TOP HALF of the image is fully TRANSPARENT (true alpha) so the far layer shows through; the silhouettes rise from the bottom edge. LEFT and RIGHT edges must tile horizontally without a seam. 2048×640. ${T.transparent}`,
  },

  // ── T·4 — GAMEPLAY pixel sheets (class GAMEPLAY, the Batch S contract) ─────
  {
    stem: "hero_swing_sheet", file: "hero_swing_sheet.png", folder: "hero", batch: "T", cls: "pixel", gen: "hero_swing",
    size: "512×256 (2×1 grid, 256px cells)", format: "sheet",
    usage: "The Federstab swing (doc 29 combat verb) — sliced into hero_swing1/hero_swing2. MUST match the Batch S hero exactly.",
    prompt: `${STYLE_PIXEL_V2}\n\nSUBJECT: a 2×1 pose sheet of THE SAME child hero as the established set — schoolkid ~10, mid-brown messy hair, mustard-yellow ${"#fcfc54"} shirt, dark trousers, brown cross-body satchel, red scarf, giant white quill pen (gold nib) — side view facing RIGHT, ~200px tall in each 256px cell. Cell 1: SWING WIND-UP — the quill pulled off the back, held two-handed over the shoulder like a soft baseball bat, knees bent. Cell 2: SWING FOLLOW-THROUGH — the quill swept forward in a wide arc, a trail of 3-4 small sparkle-letters along the arc path, scarf whipped forward. Friendly energy, zero violence (it frees knotted words, never hurts). ${T.sheet}`,
  },
  {
    stem: "maphero_sheet", file: "maphero_sheet.png", folder: "map", batch: "T", cls: "pixel", gen: "maphero",
    size: "512×512 (2×2 grid, 256px cells)", format: "sheet",
    usage: "World-map hero walk poses — sliced into maphero_down1/down2/side1/side2 (side mirrors for left).",
    prompt: `${STYLE_PIXEL_V2}\n\nSUBJECT: a 2×2 pose sheet of the SAME hero for a top-down world map, chibi proportion (big head, ~140px tall in each 256px cell): Cell 1 walking TOWARD CAMERA step A (left foot forward) · Cell 2 walking toward camera step B (right foot forward) · Cell 3 walking RIGHT step A · Cell 4 walking right step B. Same costume: mustard shirt, red scarf, satchel, quill on back visible over the shoulder. ${T.sheet}`,
  },
  {
    stem: "tiles_schoolhouse_sheet", file: "tiles_schoolhouse_sheet.png", folder: "ch01", batch: "T", cls: "pixel", gen: "tiles",
    size: "1024×1024 (4×4 grid, 256px cells)", format: "gridcut",
    usage: "Chapter 1 terrain SKIN — the 16 auto-tile masks (sliced tile_sh_m0…m15). What you stand on becomes art that MATCHES the collision.",
    prompt: `${STYLE_PIXEL_V2}\n\nSUBJECT: a 4×4 sheet of 16 TERRAIN TILES for a side-view platformer, each cell one FULL-BLEED 256×256 square tile of book-world earth: warm brown ${"#a85400"} paper-earth with faint ruled notebook lines and occasional tiny letter-fossils, and a bright green ${"#00a800"}/${"#54fc54"} GRASS LIP exactly on the edges named below (the lip is the walkable surface read — ~24px thick, slightly rounded like Keen 4 grass). Reading order, which edges carry the grass lip: cell 1: NONE (solid interior) · 2: TOP · 3: RIGHT · 4: TOP+RIGHT · 5: BOTTOM · 6: TOP+BOTTOM · 7: RIGHT+BOTTOM · 8: TOP+RIGHT+BOTTOM · 9: LEFT · 10: TOP+LEFT · 11: LEFT+RIGHT · 12: TOP+LEFT+RIGHT · 13: BOTTOM+LEFT · 14: TOP+BOTTOM+LEFT · 15: LEFT+RIGHT+BOTTOM · 16: ALL FOUR EDGES. Edges WITHOUT a lip must run clean to the cell border so tiles butt seamlessly. Fill the full 1024×1024 with the 16 tiles edge to edge — NO magenta, NO gaps (this sheet is grid-cut, not chroma-keyed). FORMAT: full-bleed PNG.`,
  },
  {
    stem: "props_level_sheet", file: "props_level_sheet.png", folder: "ch01", batch: "T", cls: "pixel", gen: "props",
    size: "1280×512 (5×2 grid, 256px cells)", format: "sheet",
    usage: "Level furniture — sliced into prop_plank/prop_oneway/prop_spikes/prop_pole/prop_flag/prop_sealpost/prop_sealpost_free/prop_door_sealed/prop_door_open/prop_gluehwort.",
    prompt: `${STYLE_PIXEL_V2}\n\nSUBJECT: a 5×2 sheet of platformer objects for the book world, one per cell, centered, nothing touching cell borders. Row 1: 1 SOLID WOODEN PLANK platform (a horizontal ruler-like wooden beam with measurement ticks, clearly walkable, 220×60px) · 2 ONE-WAY platform (a thinner floating paper strip with a folded edge, visibly lighter/airier than the plank) · 3 SPIKES (a strip of upward pen-nib points, ink-blue steel, clearly dangerous, 220×80px) · 4 CLIMBING POLE segment (a vertical wooden pencil, tileable vertically, 60×256px) · 5 small FLAG on a short pole (cyan pennant). Row 2: 6 SEAL POST (a stone inkwell pedestal with a glowing ink-knot hovering above it, warm yellow ${"#fcfc54"} glow) · 7 SEAL POST FREED (same pedestal, the knot dissolved into 3 rising sparkle-letters) · 8 DOOR SEALED (an arched classroom door wrapped in ink threads with a soft knot, dim) · 9 DOOR OPEN (same arch, threads gone, warm light inside) · 10 GLÜHWORT (a single glowing round word-orb: warm yellow core, tiny letter shapes inside, soft glow ring). ${T.sheet}`,
  },
  {
    stem: "maptiles_sheet", file: "maptiles_sheet.png", folder: "map", batch: "T", cls: "pixel", gen: "maptiles",
    size: "1024×256 (4×1 grid, 256px cells)", format: "gridcut",
    usage: "World-map ground set — sliced into mtile_page/mtile_path/mtile_grass/mtile_edge.",
    prompt: `${STYLE_PIXEL_V2}\n\nSUBJECT: a 4×1 sheet of top-down WORLD MAP ground tiles, each cell one full-bleed 256×256 seamlessly tileable square: 1 PAGE GROUND — warm cream ${"#fcfcfc"} paper with the faintest ruled lines and paper grain · 2 INK PATH — the same paper with a walked ink-line path running vertically through the middle (tileable top-bottom) · 3 GRASS PATCH — the paper with soft green ${"#54fc54"} meadow tufts growing out of the ruled lines · 4 PAGE EDGE — the paper curling up at the right side of the cell into a rolled page edge (world border tile, tileable top-bottom). Fill the full 1024×256 with the 4 tiles edge to edge — NO magenta, NO gaps (grid-cut, not chroma-keyed). FORMAT: full-bleed PNG.`,
  },
  {
    stem: "buildings_sheet", file: "buildings_sheet.png", folder: "map", batch: "T", cls: "pixel", gen: "buildings",
    size: "1536×512 (3×2 grid, 512×256 cells)", format: "sheet",
    usage: "World-map chapter buildings (Act 1 + the locked-generic) — sliced into bld_ch01/bld_ch02/bld_ch03/bld_ch04/bld_ch05/bld_locked. Grey-tinting for unrestored states happens in-engine.",
    prompt: `${STYLE_PIXEL_V2}\n\nSUBJECT: a 3×2 sheet of small top-down-ish (3/4 view) WORLD MAP buildings for the book world, one per cell (each cell 512×256), centered, nothing touching borders, each ~380×200px: 1 SCHOOLHOUSE (friendly two-story, white walls, grey roof, tiny flagpole, a bell) · 2 ZOO GATE (an arched entrance with animal silhouettes — a gorilla and a crocodile shape — on the arch, cheerful) · 3 PIRATE COVE (a beached little pirate ship with a paper sail and a rope ladder) · 4 FEELINGS GARDEN (a round hedge garden with an open gate and heart-shaped topiary, warm) · 5 BAND STAGE (a small open-air stage with a drum and a microphone stand, bunting) · 6 LOCKED PLACE (a generic small building wrapped in gentle ink threads with a soft knot on top — the 'not yet' state). All standing ON cream paper ground with a soft shadow. ${T.sheet}`,
  },
];

export const futureSectionsT = [
  { title: "Batch U — Act 1 chapters (ch02–ch05)", note: "Nach dem Template-Freeze: je Kapitel bt_door/bt_restore (CUTSCENE), bgp_far/mid (backdrop), tiles-Sheet + props-Delta + Kreaturen (GAMEPLAY) — Prompts entstehen aus den Produktions-Blättern v2." },
  { title: "Batch V — Act 2/3 + Jahr-2-Vorschau", note: "Wie U, plus die Finale-Cutscenes (ch15 Rettungs-Duell) in Klasse CUTSCENE." },
];
