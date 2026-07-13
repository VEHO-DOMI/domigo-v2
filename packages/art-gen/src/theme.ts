/**
 * Per-zone visual themes for the overworld grades (G1 "Lost Pages" + the G2
 * "The Spill" school family), keyed by a map@1 zone's `render.generator`. A theme recolours the tileset (named palette slots), adds
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

// ─── G2 "The Spill" school family (docs/handover/22_g2_overworld_design.md) ───
// Generator names are BARE (no `-room` suffix — G2's naming rule; art dirs are
// per-grade so they can never collide with G1's). Palette is plot (§2.5): Act 1
// saturates ABOVE the G1 school family, Act 2 drains stepwise toward grey-blue
// (#9aa3b2), Act 3 brings the warmth back plus one colour no G1 zone has —
// Klecks-ink black with the white patch (propDark + propMetal white).

// z01 `classroom` (u01, Act-1 opener) — warm chalk-yellow saturated above G1's
// school default; the leak-ink desk (`L`, walkable) sits in the back corner.
const g2Classroom: ZoneTheme = {
  palette: {
    floorBase: "#e3c98f", floorSpeckle: "#d0b268", wallBase: "#8a7a52", wallBorder: "#5c4f2f",
    pathBase: "#c2ab7a", accentLight: "#f1e0ac", propWood: "#b06a1f", propWarm: "#f0a11c",
    propDark: "#191b26", propMetal: "#e9e6da",
  },
  extraKinds: ["board", "note"],
  layout: [
    "###############",
    "#W.W.......B..#",
    "#.............#",
    "#.DDD.DDD.DDD.#",
    "#.............#",
    "#.DDD.DDD.EDD.#",
    "#.....E.......#",
    "#.DDD.DDD.DDD.#",
    "#..E......L...#",
    "#F....P....E..#",
    "###############",
  ],
  props: {
    W: { tile: "board", solid: true }, // window
    B: { tile: "board", solid: true }, // blackboard
    D: { tile: "accent2", solid: true }, // desk rows
    L: { tile: "note", solid: false }, // the leak-ink desk (walkable — the ink crawls)
  },
};

// z07 `schoolyard` (u07, Act-2 midpoint) — the first drain: floorSpeckle/accentLight
// step to grey-blue #9aa3b2; the calendar board's slate (propDark) is PALE (taken).
const g2Schoolyard: ZoneTheme = {
  palette: {
    floorBase: "#b7c0aa", floorSpeckle: "#9aa3b2", wallBase: "#7e8794", wallBorder: "#525a66",
    pathBase: "#a5abb4", accentLight: "#9aa3b2", propLeaf: "#6f8f60", propWood: "#8a6a44",
    propWarm: "#a7aeb9", propDark: "#c2c7d1", propMetal: "#e6e9ee",
  },
  extraKinds: ["plant", "board", "barrel", "rug"],
  layout: [
    "###############",
    "#..T......C.C.#",
    "#.....E.......#",
    "#.............#",
    "#...K....E....#",
    "#P............#",
    "#....F........#",
    "#..E......B...#",
    "#.....R.R.....#",
    "#.........E...#",
    "###############",
  ],
  props: {
    T: { tile: "plant", solid: true }, // tree
    C: { tile: "board", solid: true }, // the emptied calendar board (pale slate)
    K: { tile: "barrel", solid: true }, // kiosk
    B: { tile: "accent2", solid: true }, // bench
    R: { tile: "rug", solid: false }, // rain drains (walkable, drained grey)
  },
};

// z12 `quiet-room` (u12, Act-3 pivot) — grey with ONE warm slot (propWarm stays:
// the lamp); the smallest furniture count in the game — negative space IS the design.
const g2QuietRoom: ZoneTheme = {
  palette: {
    floorBase: "#c9cdd6", floorSpeckle: "#b7bcc8", wallBase: "#79808d", wallBorder: "#535a67",
    pathBase: "#a7acb8", accentLight: "#d8dbe2", propLeaf: "#8b9299", propWood: "#8f959f",
    propWarm: "#f2b13d", propDark: "#b6bbc6", propMetal: "#e2e5ea",
  },
  extraKinds: ["rug", "stage", "note"],
  layout: [
    "###############",
    "#.............#",
    "#....R.R......#",
    "#..E.......E..#",
    "#.............#",
    "#.....LL......#",
    "#P....LL...F..#",
    "#.............#",
    "#..E.......E..#",
    "#......N......#",
    "###############",
  ],
  props: {
    R: { tile: "rug", solid: false }, // rain windows (light pooling under them)
    L: { tile: "stage", solid: true }, // the one warm lamp (glow kind)
    N: { tile: "note", solid: true }, // the Blank's corner (pale; presence, not the NPC)
  },
};

// z15 `book-nook` (finale) — the fullest, warmest room; plus the NEW colour:
// Klecks-ink black with the white patch (propDark #12121a + propMetal #ffffff).
const g2BookNook: ZoneTheme = {
  palette: {
    floorBase: "#ecd7ac", floorSpeckle: "#dcc183", wallBase: "#a87c42", wallBorder: "#6f4f22",
    pathBase: "#cdb384", accentLight: "#f7e9c2", propWood: "#8f5c26", propWarm: "#f0ad3c",
    propLeaf: "#3f9b4f", propDark: "#12121a", propMetal: "#ffffff",
  },
  extraKinds: ["board", "note", "rug", "plant"],
  layout: [
    "###############",
    "#.B.B.....W.W.#",
    "#..E....E.....#",
    "#.....RRR.....#",
    "#..S..RRR..S..#",
    "#.....RFR.....#",
    "#..S..RRR..S..#",
    "#....E....E...#",
    "#.L..........K#",
    "#......P......#",
    "###############",
  ],
  props: {
    B: { tile: "board", solid: true }, // bookshelves
    W: { tile: "note", solid: true }, // the class's word-wall
    R: { tile: "rug", solid: false }, // the big reading rug
    S: { tile: "accent2", solid: true }, // sitting cushions
    L: { tile: "plant", solid: true },
    K: { tile: "note", solid: true }, // Klecks's cushion (ink black + white patch)
  },
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
  // G2 "The Spill" school family (bare names — the G2 naming rule). APPEND-ONLY:
  // the 15 G1 `*-room` entries above stay byte-identical (snapshots frozen).
  "classroom": g2Classroom,
  "schoolyard": g2Schoolyard,
  "quiet-room": g2QuietRoom,
  "book-nook": g2BookNook,
};

/** Resolve a zone's theme by its `render.generator`, falling back to the classroom. */
export function resolveZoneTheme(generator: string | null | undefined): ZoneTheme {
  return (generator && THEMES[generator]) || school;
}
