// THE CODEX COMMISSION — BATCH X (v5.1: the leftovers Koki's 18-Jul round named).
// Small, surgical batch at STYLE_PIXEL_V3. GATE-FIRST like Batch W: Codex
// renders card 1 (the pole-free climb — the ONLY risky redraw) and pauses.
import { STYLE_PIXEL_V3 } from "./commission-w.mjs";

export { STYLE_PIXEL_V3 };

const SHEET = "FORMAT: PNG pose-sheet on SOLID magenta #FF00FF (no transparency — chroma-keyed later). Clean grid, equal cells, generous margins, nothing touching cell borders.";
const HERO = "THE HERO (identical to Batch W's hero3): schoolkid ~10, mid-brown messy hair, mustard-yellow shirt, dark trousers, brown cross-body satchel, red scarf, giant white quill pen with a gold nib on the back.";

export const cardsX = [
  // ── X·1 🚦 GATE — climb pair WITHOUT the pole ──────────────────────────────
  {
    stem: "climb_nopole_sheet", file: "climb_nopole_sheet.png", folder: "hero", batch: "X", cls: "pixel", gateOnly: false,
    size: "512×256 (2×1, 256px cells)", format: "sheet", gen: "climbnp",
    usage: "Replaces hero2_climb1/2. Batch W baked a pencil INTO the climb frames — in-game it doubled with the level's own pole. These frames show the hero's grip only.",
    prompt: `${STYLE_PIXEL_V3}\n\n${HERO}\n\nSUBJECT: 2 cells of the hero CLIMBING, ~180px tall, facing RIGHT, drawn WITHOUT any pole or pencil in the frame: both hands gripping an INVISIBLE vertical bar at the sprite's center line (fists closed one above the other on the center axis, body hanging slightly left of the fists, knees bent), two alternating leg positions. The game draws the pole; these frames must composite ON it. Nothing but the hero in the cell. ${SHEET}`,
  },

  // ── X·2 — accessories v3 on the hero3 rig ─────────────────────────────────
  {
    stem: "acc3_sheet", file: "acc3_sheet.png", folder: "hero", batch: "X", cls: "pixel", gen: "acc3",
    size: "512×256 (2×1, 256px cells)", format: "sheet",
    usage: "Per-student accessories redrawn for the HD hero (the old ones rendered as a blob over his face). Slices → acc_cap, acc_scarf.",
    prompt: `${STYLE_PIXEL_V3}\n\nSUBJECT: 2 cells of ACCESSORY OVERLAYS sized for Batch W's hero3 (~180px hero in a 256px cell): (1) a friendly GREEN CAP drawn exactly where the hero3 head sits (upper-center of the cell, crown ~y70-110, brim right) — nothing else in the cell; (2) a BLUE SCARF drawn at the hero3 neck position (~y115-140), tail flying left. These are transparent overlays composited onto every pose — align to the hero3_stand proportions. ${SHEET}`,
  },

  // ── X·3 — the HD map hero ─────────────────────────────────────────────────
  {
    stem: "maphero3_sheet", file: "maphero3_sheet.png", folder: "map", batch: "X", cls: "pixel", gen: "mh3",
    size: "768×512 (3×2, 256px cells)", format: "sheet",
    usage: "The world-map hero at the v3 bar (the old one reads tiny+crunchy on the painting). Slices → mh_down1, mh_down2, mh_up1, mh_up2, mh_side1, mh_side2.",
    prompt: `${STYLE_PIXEL_V3}\n\n${HERO}\n\nSUBJECT: a 3×2 sheet of the hero as a TOP-DOWN-ish (3/4 view) map walker, ~190px tall, chibi-proportioned (big head), quill on back visible: cells 1-2 WALKING TOWARD the viewer (down), two alternating steps · 3-4 WALKING AWAY (up, backpack view) · 5-6 WALKING RIGHT (side), two steps. Warm, readable at small size, clean silhouette. ${SHEET}`,
  },

  // ── X·4 — the alphabet at the HD bar ──────────────────────────────────────
  {
    stem: "alphabet3_sheet", file: "alphabet3_sheet.png", folder: "ch01", batch: "X", cls: "pixel", gen: "abc3",
    size: "1024×768 (7×4 grid, ~146px cells)", format: "sheet",
    usage: "The 26 collectible letters (the white orbs read scruffy next to the HD art). Slices → alpha_a … alpha_z; two spare cells empty.",
    prompt: `${STYLE_PIXEL_V3}\n\nSUBJECT: a 7×4 sheet (26 used cells, last two EMPTY magenta) of collectible LETTER TOKENS A to Z in reading order, each ~110px: a warm cream PAPER DISC with a soft golden rim-glow and one bold friendly serif CAPITAL letter (ink blue-black), tiny sparkle. Same disc design every cell, only the letter changes — readable at 30px. ${SHEET}`,
  },

  // ── X·5 — the readable hazard strip ───────────────────────────────────────
  {
    stem: "hazard3_strip", file: "hazard3_strip.png", folder: "ch01", batch: "X", cls: "pixel",
    size: "256×128", format: "sheet",
    usage: "Replaces prop_spikes: ONE tile-wide danger strip, bigger nibs, unmistakably 'do not touch'. Sliced whole (chroma-keyed).",
    prompt: `${STYLE_PIXEL_V3}\n\nSUBJECT: one 256×128 cell: a row of FIVE sharp dark-steel INK NIBS standing upright on a small dark ink-puddle base, tips catching light with a warning glint, tileable left↔right when repeated. Clearly dangerous at 48px width, still storybook (no gore, no faces). ${SHEET}`,
  },

  // ── X·6 — checkpoint flag + level door arch ───────────────────────────────
  {
    stem: "levelprops3_sheet", file: "levelprops3_sheet.png", folder: "ch01", batch: "X", cls: "pixel", gen: "props3",
    size: "512×256 (2×1, 256px cells)", format: "sheet",
    usage: "Slices → prop_flag (checkpoint banner, planted), prop_door_open (in-level door arch, grounded).",
    prompt: `${STYLE_PIXEL_V3}\n\nSUBJECT: 2 cells, each ~200px tall, standing ON the cell's bottom edge region (base at the bottom of the drawn area): (1) CHECKPOINT BANNER — a wooden pole with a cyan pennant flag and a small gold cap, a little grass tuft at its base; (2) LEVEL DOOR ARCH — a friendly wooden door in a stone arch frame, slightly open with warm light in the gap, for in-level room doors. Smooth HD shading. ${SHEET}`,
  },
];

export const futureSectionsX = [
  { title: "Act-1 per-chapter sets (ch02–ch05)", note: "Nach dem Template-Freeze: pro Kapitel Terrain-Delta + Kreaturen-Cast + bt/bgp am v3-Balken, aus den doc-30-Blättern." },
];
