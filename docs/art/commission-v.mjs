// THE CODEX COMMISSION — BATCH V (game v4: THE UNIT-MAGIC LIBRARY, doc 30).
// Koki: "no quota — the more, the merrier." 15 cards → ~121 stems: the world
// map as ONE artwork, the ch01 bespoke cast (school things, ghost-student,
// digits, the midnight classroom, the alphabet), hero v2 with the Keen
// animation grammar, two-state buildings, portraits v2, slopes.
// References MANDATORY (rule 0a; the cp command is §0 step 2b).
import { EGA, STYLE_CUTSCENE, STYLE_PIXEL_V2 } from "./commission-t.mjs";

export { EGA, STYLE_CUTSCENE, STYLE_PIXEL_V2 };

const SHEET = "FORMAT: PNG pose-sheet on SOLID magenta #FF00FF (no transparency — chroma-keyed later). Clean grid, equal cells, nothing touching cell borders.";
const HERO = "THE HERO (identical design every cell): schoolkid ~10, mid-brown messy hair, mustard-yellow shirt, dark trousers, brown cross-body satchel, red scarf, giant white quill pen (gold nib) on the back.";

const px = (o) => ({ batch: "V", cls: "pixel", ...o });

export const cardsV = [
  // ── V·1 THE WORLD MAP AS ONE ARTWORK (Koki: "the map IS the book") ─────────
  px({
    stem: "worldmap_book", file: "worldmap_book.png", folder: "map", size: "2048×1536", format: "fullbleed",
    usage: "The ENTIRE world map as one coherent Keen-4-style map artwork. The engine overlays walkability, buildings (on the clearings), NPCs and sparkles — so the artwork shows the LAND, with empty building plots.",
    prompt: `${STYLE_PIXEL_V2}\n\nSUBJECT: one continuous top-down-ish (3/4 view) WORLD MAP of the book-world, in the exact manner of Commander Keen 4's Shadowlands world map (study the refs): an ENORMOUS OPEN BOOK seen from above fills the frame — its two cream paper pages are the land. On the pages: warm paper-meadows with faint ruled lines and paper grain, winding dark INK PATHS connecting FIFTEEN round CLEARINGS (leave the clearings EMPTY — buildings are composited later; make each clearing a soft trampled-paper circle ~180px), page-leaf trees and ink bushes scattered between paths, a calm dark ink-river crossing the right page with two small ink bridges, letter-fossils half-buried near path bends, the page edges CURLING UP at the frame borders (the world's edge), the book's spine running down the middle as a gentle valley with a rope bridge. Clearing placement, roughly: lower-center-left (the first, largest), center-right, upper-center-left, upper-right, mid-left, and ten more spread over both pages toward the top (those ten in slightly grayer, quieter paper — not yet awake). Warm, alive, dense with texture — NO flat areas. 2048×1536, full-bleed.`,
  }),

  // ── V·2 the duel-arena painted backdrop ────────────────────────────────────
  {
    stem: "bgp_schoolhouse_arena", file: "bgp_schoolhouse_arena.png", folder: "ch01", batch: "V", cls: "backdrop",
    size: "2048×1024", format: "fullbleed",
    usage: "The Schlinger duel arena — painted backdrop behind the boss fight (class BACKDROP).",
    prompt: `${STYLE_CUTSCENE}\n\nSUBJECT: a PAINTED wide interior backdrop for the chapter-1 boss duel: the school attic at dusk — timber beams, stacked old desks and rolled maps in shadow, one round window spilling warm evening light, chalk dust in the air, a huge timetable grid faintly chalked on the back wall (empty cells, no readable text), knotted ink threads creeping along the beams. Atmospheric, warm-tense, never scary. NO characters, NO foreground objects below the lower third (the fight happens there). 2048×1024, full-bleed.`,
  },

  // ── V·3 hero v2 — the Keen animation grammar (16 poses, redrawn at the bar) ─
  px({
    stem: "hero2_sheet", file: "hero2_sheet.png", folder: "hero", size: "1024×1024 (4×4 grid, 256px cells)", format: "sheet", gen: "hero2",
    usage: "Hero pose set v2 — sliced into hero2_stand/run1-4/jump/fall/pogo1-2/climb1-2/hang/idle/lookup/lookdown/sit. Replaces the Batch S set (below the craft bar). CLIMB IS DRAWN ON THE POLE.",
    prompt: `${STYLE_PIXEL_V2}\n\nSUBJECT: a 4×4 pose sheet. ${HERO} Side view facing RIGHT unless stated, ~200px tall per 256px cell. Reading order: 1 stand · 2-5 run cycle (contact, pass, contact-other, pass; scarf trailing) · 6 jump (knees tucked) · 7 fall (arms out) · 8 pogo compressed (riding the quill nib-down) · 9 pogo extended · 10-11 CLIMB: facing CAMERA, both hands gripping a vertical yellow PENCIL-POLE that runs through the FULL cell height at the cell's exact horizontal CENTER, the body's centerline ON the pole (hands alternate between the two frames) · 12 hang (facing camera, arms up on a ledge) · 13 idle blink (eyes closed, relaxed) · 14 look UP (head and eyes up, hand shading brow) · 15 look DOWN (leaning forward, peering below) · 16 sitting and reading a small open book (Keen's idle). ${SHEET}`,
  }),

  // ── V·4/5 the 11 bewitched school things (2 poses each: wild / freed) ──────
  px({
    stem: "st_a_sheet", file: "st_a_sheet.png", folder: "ch01", size: "1024×768 (4×3 grid, 256px cells)", format: "sheet", gen: "st_a",
    usage: "School-thing characters A (6 things × 2 poses) — sliced into st_pencil_wild/free, st_pen_wild/free, st_rubber_wild/free, st_ruler_wild/free, st_scissors_wild/free, st_glue_stick_wild/free.",
    prompt: `${STYLE_PIXEL_V2}\n\nSUBJECT: a 4×3 sheet (12 cells) of SCHOOL-THING CHARACTERS in the manner of MORE! 1's "Midnight in the classroom" (living school supplies with googly eyes and stick limbs), each ~180px, centered: pairs of WILD (tangled in fine ink knot-threads, brows angry-comic, mid-lunge) and FREED (threads gone, smiling, relaxed) for: 1-2 PENCIL · 3-4 PEN (ballpoint) · 5-6 RUBBER (eraser block) · 7-8 RULER · 9-10 SCISSORS · 11-12 GLUE STICK. Wild versions read mischievous, never menacing. ${SHEET}`,
  }),
  px({
    stem: "st_b_sheet", file: "st_b_sheet.png", folder: "ch01", size: "1280×512 (5×2 grid, 256px cells)", format: "sheet", gen: "st_b",
    usage: "School-thing characters B (5 things × 2 poses) — sliced into st_pencil_case_wild/free, st_exercise_book_wild/free, st_watercolours_wild/free, st_paintbrush_wild/free, st_pencil_sharpener_wild/free.",
    prompt: `${STYLE_PIXEL_V2}\n\nSUBJECT: a 5×2 sheet (10 cells), SAME character language as the first school-things sheet (living supplies, googly eyes, stick limbs, ~180px): wild/freed pairs for: 1-2 PENCIL CASE (zipper mouth, like the book's "I hate pink!" case) · 3-4 EXERCISE BOOK (flapping covers) · 5-6 WATERCOLOURS (paint box, rainbow pans) · 7-8 PAINTBRUSH · 9-10 PENCIL SHARPENER (two-hole nose). ${SHEET}`,
  }),

  // ── V·6 the ghost-student (the command duel) ───────────────────────────────
  px({
    stem: "ghost_student_sheet", file: "ghost_student_sheet.png", folder: "ch01", size: "1024×512 (4×2 grid, 256px cells)", format: "sheet", gen: "ghost",
    usage: "The ghost-student — sliced into gs_sing/gs_stand/gs_write/gs_window/gs_speak/gs_books/gs_friendly/gs_sad. Each antic must be READABLE in half a second (the imperative duel's prompt IS this art).",
    prompt: `${STYLE_PIXEL_V2}\n\nSUBJECT: a 4×2 sheet (8 cells) of ONE ghostly schoolkid — a translucent pale-blue child sketched in wobbly ink lines, big sad-mischievous eyes, a faint knot-thread around one ankle (~190px, centered). One clear ACTION per cell: 1 SINGING loudly (head back, music notes) · 2 STANDING ON a school desk, arms up · 3 SCRIBBLING on a desktop with a crayon · 4 FLINGING a window open (cold-air squiggles) · 5 CHATTERING (speech-squiggle bubbles, hands waving) · 6 BOOKS scattered on the floor around crossed arms · 7 FRIENDLY (warm smile, small wave, knot-thread gone, slightly more solid/colored) · 8 SAD-DRAINED (hunched, grey, the 'before' portrait). Comic, gentle, never scary. ${SHEET}`,
  }),

  // ── V·7 the number swarm ───────────────────────────────────────────────────
  px({
    stem: "digits_sheet", file: "digits_sheet.png", folder: "ch01", size: "1024×768 (4×3 grid, 256px cells)", format: "sheet", gen: "digits",
    usage: "Digit orbs 0-9 + 2 swirl puffs — sliced into digit_0..digit_9, swirl_a, swirl_b (the number-swarm barrier).",
    prompt: `${STYLE_PIXEL_V2}\n\nSUBJECT: a 4×3 sheet (12 cells): cells 1-10 are DIGIT ORBS 0,1,2,3,4,5,6,7,8,9 — each one big bold ink-drawn digit (~150px tall) inside a round glowing paper token with tiny wing-flutters and worried dot-eyes (the bewitched numbers swarm — mid-air, slightly tilted, each a different tilt) · cells 11-12: two SWIRL PUFFS of tiny scrambled digits and ink-wisps (the swarm's body, ~200px round). ${SHEET}`,
  }),

  // ── V·8 the midnight classroom (drained + colored pairs) ───────────────────
  px({
    stem: "classroom_room_sheet", file: "classroom_room_sheet.png", folder: "ch01", size: "1024×768 (4×3 grid, 256px cells)", format: "sheet", gen: "room",
    usage: "The restoration room's objects — sliced into cr_chair_grey/cr_chair_color, cr_desk_grey/color, cr_board_grey/color, cr_door_grey/color, cr_window_grey/color, cr_school_bag_grey/color.",
    prompt: `${STYLE_PIXEL_V2}\n\nSUBJECT: a 4×3 sheet (12 cells) of CLASSROOM OBJECTS in two states, pairs side by side (~190px each, centered): DRAINED (all greys/white, faint pencil-sketch outlines, small sleepy dot-eyes — the midnight-classroom look from MORE! 1) and COLORED (fully alive in its color, eyes bright): 1-2 CHAIR (colored = warm brown) · 3-4 DESK (green) · 5-6 BOARD on a stand (white board, dark frame) · 7-8 DOOR (blue) · 9-10 WINDOW with frame (yellow frame, night sky inside on the drained one, sunny sky on the colored one) · 11-12 SCHOOL BAG (red). ${SHEET}`,
  }),

  // ── V·9 the scattered alphabet ─────────────────────────────────────────────
  px({
    stem: "alphabet_sheet", file: "alphabet_sheet.png", folder: "ch01", size: "1792×1024 (7×4 grid, 256px cells)", format: "sheet", gen: "alphabet",
    usage: "The 26 alphabet pickups — sliced into alpha_a..alpha_z (cells 27/28 empty magenta). Replaces the generic letter discs; ch01's collectible IS the alphabet (doc 30 §1.3).",
    prompt: `${STYLE_PIXEL_V2}\n\nSUBJECT: a 7×4 sheet: cells 1-26 are the CAPITAL LETTERS A through Z in reading order, one per cell — each a chunky ink-drawn capital (~140px tall) on a small round GREEN-glow paper chip (Unit 1's color), with a soft sparkle and a tiny fluttering paper-wing pair (a scattered alphabet trying to fly home). SAME design language every cell, only the glyph changes. Cells 27-28: leave PURE magenta (empty padding). ${SHEET}`,
  }),

  // ── V·10 slope tile skins (the last procedural terrain) ────────────────────
  px({
    stem: "slopes_sheet", file: "slopes_sheet.png", folder: "ch01", size: "512×256 (2×1 grid, 256px cells)", format: "sheet", gen: "slopes",
    usage: "Sliced into slope_up ('/' rising left→right) and slope_down ('\\\\'). Must butt seamlessly against the tile_sh_m* terrain skins (same earth, same grass lip).",
    prompt: `${STYLE_PIXEL_V2}\n\nSUBJECT: a 2×1 sheet of two TRIANGULAR terrain wedges matching the existing schoolhouse tiles EXACTLY (same warm brown paper-earth with pebbles, ruled lines and letter-fossils; same bright green overhanging grass lip): cell 1 a wedge rising from the BOTTOM-LEFT corner to the TOP-RIGHT corner (the '/' slope — grass lip along the hypotenuse, earth filling below it, the area above the hypotenuse PURE magenta) · cell 2 the mirror wedge falling top-left to bottom-right ('\\\\'). The earth must run clean to the bottom and side edges so the wedge butts seamlessly onto neighboring full tiles. ${SHEET}`,
  }),

  // ── V·11/12 map cast v2 ────────────────────────────────────────────────────
  px({
    stem: "maphero2_sheet", file: "maphero2_sheet.png", folder: "map", size: "768×512 (3×2 grid, 256px cells)", format: "sheet", gen: "maphero2",
    usage: "Map hero v2 with the missing UP direction — sliced into mh_down1/down2/up1/up2/side1/side2 (side mirrors for left). Bigger presence than v1 (Koki: proportions).",
    prompt: `${STYLE_PIXEL_V2}\n\nSUBJECT: a 3×2 sheet of the SAME hero for the top-down world map, chibi proportion, ~170px tall per cell (bigger presence than a standard sprite): 1-2 walking TOWARD camera (step A/B) · 3-4 walking AWAY from camera — back view, satchel and quill visible (step A/B) · 5-6 walking RIGHT (step A/B). ${HERO} ${SHEET}`,
  }),
  px({
    stem: "mapnpc2_sheet", file: "mapnpc2_sheet.png", folder: "map", size: "1024×256 (4×1 grid, 256px cells)", format: "sheet", gen: "mapnpc2",
    usage: "Map NPCs v2 — sliced into finn_map2, pixel_map2, flag2, note2.",
    prompt: `${STYLE_PIXEL_V2}\n\nSUBJECT: a 4×1 sheet (~170px each, centered): 1 FINN the book-person for the map (floating open paper book with friendly dot-eyes on the left page, ink spine, small bounce pose) · 2 PIXEL the small black cat, sitting, huge amber eyes, tail curled · 3 a small CELEBRATION FLAG on a pole (green pennant with a tiny gold letter shape) · 4 a pinned PAPER NOTE on a wooden post (child's squiggle handwriting, no readable text, one corner lifting). ${SHEET}`,
  }),

  // ── V·13 the ALIVE building states (drained versions = Batch U bld_*) ──────
  px({
    stem: "buildings_alive_sheet", file: "buildings_alive_sheet.png", folder: "map", size: "1536×512 (3×2 grid, 512×256 cells)", format: "sheet", gen: "alive",
    usage: "Restored-state buildings — sliced into bldx_ch01..bldx_ch05 + bldx_spare. The engine crossfades drained→alive + sparkles on restoration (doc 30 §1.6).",
    prompt: `${STYLE_PIXEL_V2}\n\nSUBJECT: a 3×2 sheet of the five Act-1 map buildings in their RESTORED, ALIVE state (~380×200px each, on cream paper ground with soft shadow) — same silhouettes as their drained versions but bursting with life: 1 SCHOOLHOUSE: warm-lit windows, open door, smoke curl, kids' drawings pinned by the door, the flag flying · 2 ZOO GATE: banner up, warm lanterns, a parrot on the arch, open gates · 3 PIRATE SHIP: sail patched and full, lanterns lit, a cheerful flag, gangway down · 4 FEELINGS GARDEN: hedges blooming, heart-topiary green, fountain sparkling · 5 BAND STAGE: bunting bright, drum kit shining, spotlights warm. Cell 6: PURE magenta (padding). ${SHEET}`,
  }),

  // ── V·14 portraits v2 (+ the ghost-student for the finale dialogue) ────────
  px({
    stem: "portraits2_sheet", file: "portraits2_sheet.png", folder: "cast", size: "1536×1024 (3×2 grid, 512px cells)", format: "sheet", gen: "portraits2",
    usage: "Dialogue portraits v2 at the craft bar — sliced into p2_finn, p2_pixel, p2_berger, p2_tintengeist, p2_jona, p2_ghost.",
    prompt: `${STYLE_PIXEL_V2}\n\nSUBJECT: a 3×2 sheet of bust PORTRAITS for dialogue boxes (each ~420px tall in its 512px cell, centered, facing slightly left, readable at 40×40): 1 FINN (open paper book as a person, cream pages, ink spine, big friendly dot-eyes, tiny ink eyebrows) · 2 PIXEL (black cat, huge amber eyes, one ear tipped) · 3 FRAU BERGER (warm teacher, cardigan, reading glasses on a cord) · 4 DER TINTENGEIST (soft rounded ink-spirit, calm white eyes, tiny warm smile) · 5 JONA (tired kid ~11, uncombed hair, oversized sweater, pencil stub, hopeful eyes) · 6 THE GHOST-STUDENT friendly (translucent pale-blue kid, warm smile). ${SHEET}`,
  }),
];

export const futureSectionsV = [
  { title: "Batch W — Act 1 chapters (ch02–ch05) unit-magic sets", note: "Nach dem Template-Freeze: je Kapitel der eigene verhexte Kosmos aus SEINEN Unit-Seiten (Blätter v3 entstehen je Kapitel; Tiere/Plurale im Zoo, Piraten-Zahlen, Gefühle-Farben, Band-Instrumente) — CUTSCENE-Beats + Backdrops + Terrain + Kreaturen-Kader je Unit." },
];
