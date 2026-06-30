/**
 * Per-zone visual themes for the G1 overworld, keyed by a map@1 zone's
 * `render.generator`. A theme recolours the tileset (named palette slots), adds
 * decor PROP tiles, and supplies a bespoke 15×11 room layout — all on the DomiGo
 * green brand. The grid is FROZEN 15×11 (save-compat: the cosmetic save stores the
 * player's pixel position); the save-stable SKELETON — one `P` (player start), four
 * `E` (encounter nodes, in row-major order), one `F` (NPC) — sits at identical cells
 * in every theme, so only decor + colour change between zones.
 */
import type { PaletteSlot, TileKind } from "./tileset.ts";

/** DomiGo grade-1 accent (matches `[data-grade="1"]` --accent). Baked in for determinism. */
export const DOMIGO_GREEN = "#16a34a";

export interface PropSpec {
  tile: TileKind;
  /** true → a collision body (like a wall); false → walkable decor. */
  solid: boolean;
}

export interface ZoneTheme {
  palette: Partial<Record<PaletteSlot, string>>;
  /** Prop tiles this zone paints beyond the 6 base kinds. */
  extraKinds: TileKind[];
  /** Exactly 11 rows × 15 cols. `#` wall · `.` floor · `E` node · `F` NPC · `P` start · others = props. */
  layout: string[];
  /** Layout glyph → prop tile + collision. */
  props: Record<string, PropSpec>;
}

// School (z01) — warm classroom: a blackboard along the back, desks in rows.
const school: ZoneTheme = {
  palette: {}, // the default palette IS the classroom
  extraKinds: ["board"],
  layout: [
    "###############",
    "#......F......#",
    "#.BBBBBBBBBBB.#",
    "#..D.......D..#",
    "#...E.....E...#",
    "#......P......#",
    "#..D.......D..#",
    "#...E.....E...#",
    "#..D.......D..#",
    "#.............#",
    "###############",
  ],
  props: { B: { tile: "board", solid: true }, D: { tile: "accent2", solid: true } },
};

// Zoo (z02) — green: leafy enclosures, hedge-toned walls.
const zoo: ZoneTheme = {
  palette: { floorBase: "#a7c98a", floorSpeckle: "#8fb56f", wallBase: "#3f6b3a", wallBorder: "#2c4d29", accentLight: "#c7e0b0" },
  extraKinds: ["plant"],
  layout: [
    "###############",
    "#......F......#",
    "#.LL.......LL.#",
    "#..L.......L..#",
    "#...E.....E...#",
    "#......P......#",
    "#..L.......L..#",
    "#...E.....E...#",
    "#.LL.......LL.#",
    "#.............#",
    "###############",
  ],
  props: { L: { tile: "plant", solid: true } },
};

// Pirates (z03) — plank deck + barrels, sea-grey hull walls.
const ship: ZoneTheme = {
  palette: { floorBase: "#a9763f", floorSpeckle: "#8a5d2e", wallBase: "#4b5b6b", wallBorder: "#2f3a45", pathBase: "#7c8a99", propWood: "#7a4a1e" },
  extraKinds: ["barrel"],
  layout: [
    "###############",
    "#......F......#",
    "#.K.........K.#",
    "#..K.......K..#",
    "#...E.....E...#",
    "#......P......#",
    "#..K.......K..#",
    "#...E.....E...#",
    "#.K.........K.#",
    "#.............#",
    "###############",
  ],
  props: { K: { tile: "barrel", solid: true } },
};

// Feelings (z04) — cozy warm room: soft rugs (walkable), gentle walls.
const feelings: ZoneTheme = {
  palette: { floorBase: "#efd9c7", floorSpeckle: "#e3c4ad", wallBase: "#b08968", wallBorder: "#7f5f47", propWarm: "#e8a0a0", propMetal: "#f3d9d9" },
  extraKinds: ["rug"],
  layout: [
    "###############",
    "#......F......#",
    "#.RR.......RR.#",
    "#.RR.......RR.#",
    "#...E.....E...#",
    "#......P......#",
    "#.............#",
    "#...E.....E...#",
    "#.RR.......RR.#",
    "#.RR.......RR.#",
    "###############",
  ],
  props: { R: { tile: "rug", solid: false } },
};

// Our Band (z05) — cool stage room: a stage platform + floating notes (decor).
const band: ZoneTheme = {
  palette: { floorBase: "#3f3f5e", floorSpeckle: "#34344e", wallBase: "#5b4b8a", wallBorder: "#3a2f5a", propWarm: "#f0c040", propWood: "#8a6d3a" },
  extraKinds: ["stage", "note"],
  layout: [
    "###############",
    "#......F......#",
    "#.N.........N.#",
    "#.............#",
    "#...E.....E...#",
    "#......P......#",
    "#.N.........N.#",
    "#...E.....E...#",
    "#..SSSSSSSSS..#",
    "#.............#",
    "###############",
  ],
  props: { S: { tile: "stage", solid: true }, N: { tile: "note", solid: false } },
};

// Detective (z06) — a dim study: a case board + scattered desks, dark wood.
const detective: ZoneTheme = {
  palette: { floorBase: "#5e5240", floorSpeckle: "#4d4334", wallBase: "#3a3340", wallBorder: "#262130", accentLight: "#7a6c52", propWood: "#7a5a32", propDark: "#1c1c22" },
  extraKinds: ["board"],
  layout: [
    "###############",
    "#......F......#",
    "#.BBBBBBBBBBB.#",
    "#.D.........D.#",
    "#...E.....E...#",
    "#......P......#",
    "#.D.........D.#",
    "#...E.....E...#",
    "#.D.........D.#",
    "#.............#",
    "###############",
  ],
  props: { B: { tile: "board", solid: true }, D: { tile: "accent2", solid: true } },
};

// Noodles (z07) — a warm kitchen: a counter along the back, pots in the corners.
const kitchen: ZoneTheme = {
  palette: { floorBase: "#e6ddc8", floorSpeckle: "#d8cbb0", wallBase: "#b5764a", wallBorder: "#7d5230", propWood: "#8a5a3a", propWarm: "#e0a030" },
  extraKinds: ["stage", "barrel"],
  layout: [
    "###############",
    "#......F......#",
    "#.K.........K.#",
    "#.K.........K.#",
    "#...E.....E...#",
    "#......P......#",
    "#.K.........K.#",
    "#...E.....E...#",
    "#.CCCCCCCCCCC.#",
    "#.............#",
    "###############",
  ],
  props: { C: { tile: "stage", solid: true }, K: { tile: "barrel", solid: true } },
};

// Clothes (z08) — a pastel dressing room: wardrobes + baskets.
const wardrobe: ZoneTheme = {
  palette: { floorBase: "#efe2ef", floorSpeckle: "#e2cfe2", wallBase: "#b483b4", wallBorder: "#7d567d", propWood: "#9a6b9a", propDark: "#6b4f6b", propWarm: "#e89bc4" },
  extraKinds: ["board", "barrel"],
  layout: [
    "###############",
    "#......F......#",
    "#.WW.......WW.#",
    "#.WW.......WW.#",
    "#...E.....E...#",
    "#......P......#",
    "#.K.........K.#",
    "#...E.....E...#",
    "#.WW.......WW.#",
    "#.WW.......WW.#",
    "###############",
  ],
  props: { W: { tile: "board", solid: true }, K: { tile: "barrel", solid: true } },
};

// Unusual Pets (z09) — a green pet room: plants + cages.
const pet: ZoneTheme = {
  palette: { floorBase: "#d6dec0", floorSpeckle: "#c4cfa8", wallBase: "#7d9a5a", wallBorder: "#566b3a", propLeaf: "#3a8a3a", propWood: "#8a6d3a" },
  extraKinds: ["plant", "barrel"],
  layout: [
    "###############",
    "#......F......#",
    "#.L.K.....K.L.#",
    "#.K.........K.#",
    "#...E.....E...#",
    "#......P......#",
    "#.K.........K.#",
    "#...E.....E...#",
    "#.L.K.....K.L.#",
    "#.............#",
    "###############",
  ],
  props: { L: { tile: "plant", solid: true }, K: { tile: "barrel", solid: true } },
};

// In a Shop (z10) — a bright shop: shelves + boxes.
const shop: ZoneTheme = {
  palette: { floorBase: "#dfe7f0", floorSpeckle: "#cdd8e6", wallBase: "#5a8ac0", wallBorder: "#3a5e8a", propWood: "#a07840", propWarm: "#e0b040" },
  extraKinds: ["stage", "barrel"],
  layout: [
    "###############",
    "#......F......#",
    "#.SSSSS.SSSSS.#",
    "#.............#",
    "#...E.....E...#",
    "#......P......#",
    "#.K.........K.#",
    "#...E.....E...#",
    "#.K.K.....K.K.#",
    "#.............#",
    "###############",
  ],
  props: { S: { tile: "stage", solid: true }, K: { tile: "barrel", solid: true } },
};

// What's the Time (z11) — a cosy evening bedroom: wall clocks + nightstands + a rug.
const clock: ZoneTheme = {
  palette: { floorBase: "#cfd6e8", floorSpeckle: "#bcc4dc", wallBase: "#5a6a9a", wallBorder: "#3a4570", propWood: "#9a7a4a", propDark: "#2a2f4a", propWarm: "#e0c060" },
  extraKinds: ["board", "rug"],
  layout: [
    "###############",
    "#......F......#",
    "#.B.........B.#",
    "#.D.........D.#",
    "#...E.....E...#",
    "#......P......#",
    "#.D.........D.#",
    "#...E.....E...#",
    "#..RRRRRRRRR..#",
    "#.............#",
    "###############",
  ],
  props: { B: { tile: "board", solid: true }, D: { tile: "accent2", solid: true }, R: { tile: "rug", solid: false } },
};

// Birthday Cake (z12) — a festive party: a long table + gift boxes.
const party: ZoneTheme = {
  palette: { floorBase: "#f5e0e8", floorSpeckle: "#ecc8d8", wallBase: "#d86a9a", wallBorder: "#a03a6a", propWood: "#c08040", propWarm: "#f0c040", propDark: "#7a3a5a" },
  extraKinds: ["stage", "barrel"],
  layout: [
    "###############",
    "#......F......#",
    "#.K.........K.#",
    "#.K.........K.#",
    "#...E.....E...#",
    "#......P......#",
    "#..TTTTTTTTT..#",
    "#...E.....E...#",
    "#.K.........K.#",
    "#.............#",
    "###############",
  ],
  props: { T: { tile: "stage", solid: true }, K: { tile: "barrel", solid: true } },
};

// Help! (z13) — an emergency station: a notice board + desks + buckets, alert palette.
const emergency: ZoneTheme = {
  palette: { floorBase: "#e8d8c8", floorSpeckle: "#d8c4b0", wallBase: "#c04a3a", wallBorder: "#8a2a1a", propWood: "#a05030", propDark: "#3a2a2a", propMetal: "#d0d0d8" },
  extraKinds: ["board", "barrel"],
  layout: [
    "###############",
    "#......F......#",
    "#.BBBB...BBBB.#",
    "#.............#",
    "#...E.....E...#",
    "#......P......#",
    "#.K.........K.#",
    "#...E.....E...#",
    "#.D.K...K.D...#",
    "#.............#",
    "###############",
  ],
  props: { B: { tile: "board", solid: true }, D: { tile: "accent2", solid: true }, K: { tile: "barrel", solid: true } },
};

// Favourite (z14) — a neon disco: a DJ booth + speakers + floating notes, dark palette.
const disco: ZoneTheme = {
  palette: { floorBase: "#2a2440", floorSpeckle: "#3a3458", wallBase: "#5a3a8a", wallBorder: "#2a1a4a", propWood: "#7a4a9a", propWarm: "#e85aa8", propDark: "#5ad0e0", propMetal: "#40e0d0" },
  extraKinds: ["stage", "note", "barrel"],
  layout: [
    "###############",
    "#......F......#",
    "#.SSSSSSSSSSS.#",
    "#.N.N.N.N.N.N.#",
    "#...E.....E...#",
    "#......P......#",
    "#.K.........K.#",
    "#...E.....E...#",
    "#.N.N.N.N.N.N.#",
    "#.............#",
    "###############",
  ],
  props: { S: { tile: "stage", solid: true }, N: { tile: "note", solid: false }, K: { tile: "barrel", solid: true } },
};

// What Are You Going to Do? (z15) — the EPILOGUE: a grand warm library framed in bookshelves.
const library: ZoneTheme = {
  palette: { floorBase: "#e8dcc0", floorSpeckle: "#d8c8a8", wallBase: "#a07840", wallBorder: "#6a4a20", propWood: "#8a5a2a", propDark: "#3a2a1a", propWarm: "#e0b050" },
  extraKinds: ["board", "rug"],
  layout: [
    "###############",
    "#......F......#",
    "#.BBBBB.BBBBB.#",
    "#.B.........B.#",
    "#.B.E.....E.B.#",
    "#.B....P....B.#",
    "#.B.........B.#",
    "#.B.E.....E.B.#",
    "#.B..RRRRR..B.#",
    "#.BBBBBBBBBBB.#",
    "###############",
  ],
  props: { B: { tile: "board", solid: true }, R: { tile: "rug", solid: false } },
};

export const THEMES: Record<string, ZoneTheme> = {
  "school-room": school,
  "zoo-room": zoo,
  "ship-room": ship,
  "feelings-room": feelings,
  "band-room": band,
  "detective-room": detective,
  "kitchen-room": kitchen,
  "wardrobe-room": wardrobe,
  "pet-room": pet,
  "shop-room": shop,
  "clock-room": clock,
  "party-room": party,
  "emergency-room": emergency,
  "disco-room": disco,
  "library-room": library,
};

/** Resolve a zone's theme by its `render.generator`, falling back to the classroom. */
export function resolveZoneTheme(generator: string | null | undefined): ZoneTheme {
  return (generator && THEMES[generator]) || school;
}
