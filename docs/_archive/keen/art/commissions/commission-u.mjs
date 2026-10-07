// THE CODEX COMMISSION — BATCH U (round 2: the craft-bar cohesion pass).
// Koki's review directive after Batch T landed: the batch ran WITHOUT the
// reference folder (the written contract carried it — well), so round 2 is
// the COHESION pass: everything still at Batch-S-era simplicity gets redone
// at the Keen-4 craft bar, plus the world-map decor the map still lacks.
// References are MANDATORY this round (rule 0a; Koki copies refs-t first).
import { EGA, STYLE_CUTSCENE, STYLE_PIXEL_V2 } from "./commission-t.mjs";

export { EGA, STYLE_CUTSCENE, STYLE_PIXEL_V2 };

const T = {
  sheet: "FORMAT: PNG pose-sheet on a SOLID magenta #FF00FF background (no transparency — chroma-keyed later). Clean grid, equal cells, nothing touching cell borders.",
};

export const cardsU = [
  // ── U·0 — the PIXEL style key v2 (the new craft anchor; Koki gates it) ─────
  {
    stem: "_style_key_pixel2", file: "_style_key_pixel2.png", folder: "root", batch: "U", cls: "pixel",
    size: "1024×640", format: "fullbleed",
    usage: "The pixel-class cohesion anchor at the v2 craft bar — synced, never rendered; every pixel image is compared to it.",
    prompt: `${STYLE_PIXEL_V2}\n\nSUBJECT: one wide reference scene of the book world at full craft: rolling paper-earth meadow (dense dithered brown strata, faint ruled lines, a half-buried letter fossil), an overhanging irregular grass lip, one climbing pencil-pole with a small cyan flag, a small white schoolhouse with dithered roof shading, an ink-blob creature with big readable eyes on the meadow, and behind everything a darker low-contrast dithered rock-wall mass in the Keen 4 manner (study ref_keen_terrain_door.png and ref_keen_trees_grass.png). 1024×640, full-bleed.`,
  },

  // ── U·1 — creatures v2 (the touch-enemies; Batch S versions are below the bar) ──
  {
    stem: "creatures2_sheet", file: "creatures2_sheet.png", folder: "ch01", batch: "U", cls: "pixel", gen: "creatures2",
    size: "1024×768 (4×3 grid, 256px cells)", format: "sheet",
    usage: "The six verknotete-Wörter creatures, 2 poses each — sliced into walker2-0/1, hopper2-0/1, flyer2-0/1, thief2-0/1, cushion2-0/1, cloud2-0/1. These replace the Batch S creatures in-engine.",
    prompt: `${STYLE_PIXEL_V2}\n\nSUBJECT: a 4×3 sheet (12 cells, reading order) of SIX friendly ink-creature designs, 2 poses each, every creature ~170px in its 256px cell, side view facing LEFT, bold black contours, 3-4 tone ramps, big readable eyes: cells 1-2 WALKER (a round ink-blob with stubby feet and a knotted thread tangled around its middle; pose A step, pose B other step) · 3-4 HOPPER (a taller ink-drop with a coiled spring-like tail; pose A crouched, pose B stretched mid-hop) · 5-6 FLYER (a possessed open BOOK flapping its covers like wings, dot-eyes on the page; pose A covers up, pose B covers down) · 7-8 THIEF (a quick fox-like ink-wisp with a little satchel, sly big eyes; pose A running, pose B looking back) · 9-10 CUSHION (a soft pillow-shaped ink-blob, sleepy eyes; pose A idle, pose B squashed flat) · 11-12 CLOUD (a small hovering ink-cloud with a letter dangling from it on a thread; pose A drifting, pose B letter swinging). Every one melancholy-comic, tangled in fine knot-threads — words that WANT to be freed, never menacing. ${T.sheet}`,
  },

  // ── U·2 — the guardian v2 (Der Stundenplan-Schlinger at the bar) ───────────
  {
    stem: "boss2_sheet", file: "boss2_sheet.png", folder: "ch01", batch: "U", cls: "pixel", gen: "boss2",
    size: "1024×512 (2×2 grid, 512×256 cells)", format: "sheet",
    usage: "Der Stundenplan-Schlinger duel set — sliced into boss2_head_idle / boss2_head_tell / boss2_card / boss2_burst.",
    prompt: `${STYLE_PIXEL_V2}\n\nSUBJECT: a 2×2 sheet for the chapter-1 guardian, DER STUNDENPLAN-SCHLINGER — a school TIMETABLE GRID come alive, knotted into a grumpy creature: a big rectangular paper body ruled into timetable cells, tangled ink-thread limbs, a wide mouth that swallows lesson-cards, heavy sleepy eyes (grumpy, never scary — it hoards the first lesson because it is lonely). Cell 1 (512×256): HEAD/BODY IDLE — centered, ~440×220px, breathing posture. Cell 2: HEAD/BODY TELEGRAPH — rearing back, mouth opening, threads taut, eyes wide (the dodge cue, readable in half a second). Cell 3: LESSON CARD — a single timetable card ~200×140px (ruled paper, a knot-seal in the corner) it spits during attacks. Cell 4: BURST — the unknot poof: a puff of freed letters and thread-bits, ~300×220px, on the magenta (this cell IS chroma-keyed — no letters touching cell borders). ${T.sheet}`,
  },

  // ── U·3 — world-map decor (the map still reads empty between buildings) ────
  {
    stem: "mapdecor_sheet", file: "mapdecor_sheet.png", folder: "map", batch: "U", cls: "pixel", gen: "mapdecor",
    size: "1024×512 (4×2 grid, 256px cells)", format: "sheet",
    usage: "World-map furniture — sliced into mdec_tree/mdec_bush/mdec_fence/mdec_sign/mdec_bridge/mdec_rock/mdec_flowers/mdec_inkpool. Placed by the map's prop glyphs.",
    prompt: `${STYLE_PIXEL_V2}\n\nSUBJECT: a 4×2 sheet of top-down-ish (3/4 view) WORLD MAP decor for the book world, one per cell, centered, ~180px each, each standing on the cream paper ground with a soft ink shadow: 1 PAGE-LEAF TREE (trunk of rolled paper, crown of small page-leaves) · 2 INK BUSH (round, a few letter-shapes hidden in it) · 3 FENCE segment (three wooden pickets, horizontal, tileable left-right) · 4 SIGNPOST (a wooden post with a blank paper note pinned to it) · 5 INK BRIDGE (a small arched bridge of dark ink planks, horizontal) · 6 ROCK (a paper-boulder with dithered strata) · 7 FLOWER PATCH (small ink-line flowers with one colored blossom each) · 8 INK POOL (a calm dark ink puddle with a quill floating in it). ${T.sheet}`,
  },
];

export const futureSectionsU = [
  { title: "Batch V — Act 1 chapters (ch02–ch05)", note: "Nach dem Template-Freeze: je Kapitel bt_door/bt_restore (CUTSCENE) + bgp far/mid (BACKDROP) + Terrain-Sheet + Kreaturen-Delta (GAMEPLAY) — Prompts aus den Produktions-Blättern v2." },
];
