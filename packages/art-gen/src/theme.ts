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

export const THEMES: Record<string, ZoneTheme> = {
  "school-room": school,
  "zoo-room": zoo,
  "ship-room": ship,
  "feelings-room": feelings,
  "band-room": band,
};

/** Resolve a zone's theme by its `render.generator`, falling back to the classroom. */
export function resolveZoneTheme(generator: string | null | undefined): ZoneTheme {
  return (generator && THEMES[generator]) || school;
}
