/**
 * Procedural overworld tileset — 48px, deterministic from a seed, DOM-free.
 * The 6 base tiles (floor/wall/path/accent/accent2/encounter) plus per-zone decor
 * props. One CRAFTED painter recoloured per zone: a theme supplies base colours
 * (named slots) and the painter DERIVES highlights/shadows/outlines from them via
 * color.ts, so every zone gets walls-with-height, grounded props and a glowing ✦
 * without hand-listing shade colours per zone. `paintTileset(seed)` with no opts
 * paints the default classroom.
 */
import { TILE, disc, grid, hline, put, rect, roundRect, type IndexedImage } from "./image.ts";
import { darken, lighten, mix } from "./color.ts";
import { mulberry32 } from "./rng.ts";

export type TileKind =
  | "floor" | "wall" | "path" | "accent" | "accent2" | "encounter"
  | "board" | "plant" | "barrel" | "rug" | "stage" | "note"
  // W-1 WORLD-ALIVE: the connected-world vocabulary (doors, outdoor fabric,
  // corridor props, encounter-node families). Procedural placeholders — Koki's
  // generated sheets replace any of these per kind via the image-first path.
  | "door" | "door-sealed" | "grass" | "tree" | "fence" | "gate" | "locker";
/** The base tileset (what `paintTileset(seed)` paints by default). Props are opt-in via a theme. */
export const TILE_KINDS: TileKind[] = ["floor", "wall", "path", "accent", "accent2", "encounter"];

/** Named palette slots a theme overrides by name. */
export type PaletteSlot =
  | "floorBase" | "floorSpeckle" | "wallBase" | "wallBorder" | "pathBase" | "accentLight"
  | "propWood" | "encounterGlow" | "encounterRing" | "propLeaf" | "propDark" | "propMetal" | "propWarm";

const SLOTS: PaletteSlot[] = [
  "floorBase", "floorSpeckle", "wallBase", "wallBorder", "pathBase", "accentLight",
  "propWood", "encounterGlow", "encounterRing", "propLeaf", "propDark", "propMetal", "propWarm",
];

/** Default colours — the classroom. */
const DEFAULT_COLORS: Record<PaletteSlot, string> = {
  floorBase: "#cdb89a", floorSpeckle: "#b9a079", wallBase: "#6b7280", wallBorder: "#434a55",
  pathBase: "#9ca3af", accentLight: "#d6c7a8", propWood: "#b45309", encounterGlow: "#22c55e",
  encounterRing: "#166534", propLeaf: "#16a34a", propDark: "#27272a", propMetal: "#cbd5e1", propWarm: "#f59e0b",
};

export interface TilesetOptions {
  palette?: Partial<Record<PaletteSlot, string>>;
  /** Brand accent for the ✦ glow (kept legible by its own bright core). */
  accent?: string;
  kinds?: TileKind[];
}

/** The full palette (base + DERIVED shades) and a name→index map. Index 0 = transparent. */
function buildPalette(opts?: TilesetOptions): { palette: string[]; k: Record<string, number> } {
  const c = { ...DEFAULT_COLORS, ...(opts?.palette ?? {}) };
  if (opts?.accent) c.encounterGlow = opts.accent;

  // name → colour, in order; the index is the position (+1 for the transparent slot).
  const entries: Array<[string, string]> = [
    // base
    ["floorBase", c.floorBase], ["floorSpeckle", c.floorSpeckle], ["wallBase", c.wallBase],
    ["wallBorder", c.wallBorder], ["pathBase", c.pathBase], ["accentLight", c.accentLight],
    ["propWood", c.propWood], ["encounterGlow", c.encounterGlow], ["encounterRing", c.encounterRing],
    ["propLeaf", c.propLeaf], ["propDark", c.propDark], ["propMetal", c.propMetal], ["propWarm", c.propWarm],
    // derived — floor
    ["floorHi", lighten(c.floorBase, 0.05)], ["floorLo", darken(c.floorBase, 0.06)],
    ["floorSeam", darken(c.floorBase, 0.12)],
    // derived — wall (top-lit face + cast shadow onto the floor)
    ["wallTop", lighten(c.wallBase, 0.22)], ["wallTopLip", lighten(c.wallBase, 0.34)],
    ["wallHi", lighten(c.wallBase, 0.08)], ["wallLo", darken(c.wallBase, 0.16)],
    ["wallDark", darken(c.wallBase, 0.34)], ["wallCast", darken(c.floorBase, 0.30)],
    // derived — path
    ["pathHi", lighten(c.pathBase, 0.06)], ["pathLo", darken(c.pathBase, 0.10)],
    // derived — wood props (desk/frames)
    ["woodHi", lighten(c.propWood, 0.18)], ["woodLo", darken(c.propWood, 0.20)], ["woodDark", darken(c.propWood, 0.40)],
    // derived — leaf / metal / warm
    ["leafHi", lighten(c.propLeaf, 0.16)], ["leafLo", darken(c.propLeaf, 0.18)],
    ["metalHi", lighten(c.propMetal, 0.18)], ["metalLo", darken(c.propMetal, 0.18)],
    ["warmHi", lighten(c.propWarm, 0.18)], ["warmLo", darken(c.propWarm, 0.20)],
    // derived — the ✦
    ["encCore", mix(c.encounterGlow, "#ffffff", 0.55)], ["encHalo", `${c.encounterGlow}44`],
    // shared
    ["shadow", "#0000002e"], ["shadowSoft", "#00000018"], ["ink", "#20242e"], ["white", "#ffffff"],
  ];
  const palette = ["#00000000", ...entries.map((e) => e[1])];
  const k: Record<string, number> = {};
  entries.forEach(([name], i) => { k[name] = i + 1; });
  return { palette, k };
}

/** Sparse seed-stable texture flecks so different seeds differ (determinism test). */
function fleck(px: number[], rng: () => number, baseIdx: number, fleckIdx: number, p: number): void {
  for (let i = 0; i < px.length; i++) if (px[i] === baseIdx && rng() < p) px[i] = fleckIdx;
}

/** A soft grounding shadow at the base of a standing prop (soft outer, then core). */
function groundShadow(px: number[], k: Record<string, number>, cx: number, cy: number, rx: number, ry: number): void {
  disc(px, TILE, TILE, cx, cy, rx * 1.35, ry * 1.25, k.shadowSoft!); // soft falloff (behind)
  disc(px, TILE, TILE, cx, cy, rx, ry, k.shadow!);                   // core shadow (on top)
}

function paintTile(kind: TileKind, seed: number, k: Record<string, number>): number[] {
  const rng = mulberry32(seed);
  // Props start TRANSPARENT so the real floor tile (and the alpha ground shadows)
  // show through; the ground tiles fill their base explicitly below.
  const px = grid(TILE, TILE, 0);

  switch (kind) {
    case "floor": {
      // Calm, designed ground: a faint tile seam (darker bottom+right, lit top+left)
      // that lines up into a subtle grid when tiled, plus a few soft flecks.
      rect(px, TILE, TILE, 0, 0, TILE, TILE, k.floorBase!);
      hline(px, TILE, TILE, 0, 0, TILE, k.floorHi!);
      for (let y = 0; y < TILE; y++) put(px, TILE, TILE, 0, y, k.floorHi!);
      hline(px, TILE, TILE, 0, TILE - 1, TILE, k.floorSeam!);
      for (let y = 0; y < TILE; y++) put(px, TILE, TILE, TILE - 1, y, k.floorSeam!);
      fleck(px, rng, k.floorBase!, k.floorLo!, 0.03);
      fleck(px, rng, k.floorBase!, k.floorHi!, 0.02);
      break;
    }
    case "path": {
      rect(px, TILE, TILE, 0, 0, TILE, TILE, k.pathBase!);
      hline(px, TILE, TILE, 0, 0, TILE, k.pathHi!);
      hline(px, TILE, TILE, 0, TILE - 1, TILE, k.pathLo!);
      fleck(px, rng, k.pathBase!, k.pathLo!, 0.05);
      break;
    }
    case "accent": {
      // a lighter ground patch (a highlight cell)
      rect(px, TILE, TILE, 0, 0, TILE, TILE, k.floorBase!);
      fleck(px, rng, k.floorBase!, k.floorHi!, 0.22);
      fleck(px, rng, k.floorBase!, k.accentLight!, 0.10);
      break;
    }
    case "wall": {
      // Top-down wall with HEIGHT: a lit top surface, a textured front face, and a
      // soft shadow cast onto the floor at its base — the classic GBA depth cue.
      rect(px, TILE, TILE, 0, 0, TILE, TILE, k.wallBase!);
      rect(px, TILE, TILE, 0, 0, TILE, 12, k.wallTop!);   // top surface (catches light)
      hline(px, TILE, TILE, 0, 0, TILE, k.wallTopLip!);   // bright top lip
      hline(px, TILE, TILE, 0, 12, TILE, k.wallDark!);    // shelf edge under the top
      // brick mortar on the front face (subtle, offset rows)
      for (let y = 20; y < 40; y += 10) hline(px, TILE, TILE, 0, y, TILE, k.wallLo!);
      for (let y = 13; y < 40; y += 10) {
        const off = ((y / 10) | 0) % 2 === 0 ? 0 : 24;
        for (let x = off; x < TILE; x += 48) rect(px, TILE, TILE, x + 22, y, 1, 7, k.wallLo!);
      }
      rect(px, TILE, TILE, 0, 40, TILE, 3, k.wallLo!);    // base of the wall (darker)
      rect(px, TILE, TILE, 0, 43, TILE, 5, k.wallCast!);  // cast shadow onto the floor below
      for (let y = 0; y < 43; y++) put(px, TILE, TILE, 0, y, k.wallHi!);  // left catch light
      for (let y = 12; y < 43; y++) put(px, TILE, TILE, TILE - 1, y, k.wallDark!); // right shade
      break;
    }
    case "accent2": {
      // A wooden classroom desk, grounded by a shadow. Sits on the floor cell.
      groundShadow(px, k, 24, 41, 17, 5);
      rect(px, TILE, TILE, 8, 26, 32, 12, k.propWood!);       // front face
      rect(px, TILE, TILE, 8, 36, 32, 2, k.woodLo!);          // bottom edge
      roundRect(px, TILE, TILE, 6, 16, 36, 12, k.woodHi!, 2); // desk top (lit)
      rect(px, TILE, TILE, 6, 26, 36, 1, k.woodLo!);          // top/front seam
      rect(px, TILE, TILE, 11, 38, 3, 5, k.woodLo!);          // legs
      rect(px, TILE, TILE, 34, 38, 3, 5, k.woodLo!);
      // outline
      for (let x = 6; x < 42; x++) { put(px, TILE, TILE, x, 15, k.ink!); }
      break;
    }
    case "encounter": {
      // A glowing collectible ✦ — a soft halo, a bright four-point star, a core
      // highlight, and a ground shadow. Reads as "practise here / bring it back".
      groundShadow(px, k, 24, 40, 11, 4);
      disc(px, TILE, TILE, 24, 22, 15, 15, k.encHalo!);        // soft glow halo
      // four-point star
      rect(px, TILE, TILE, 22, 8, 4, 28, k.encounterGlow!);    // vertical
      rect(px, TILE, TILE, 10, 20, 28, 4, k.encounterGlow!);   // horizontal
      disc(px, TILE, TILE, 24, 22, 7, 7, k.encounterGlow!);    // body
      disc(px, TILE, TILE, 24, 22, 4, 4, k.encCore!);          // bright core
      put(px, TILE, TILE, 22, 20, k.white!);                   // sparkle highlight
      put(px, TILE, TILE, 23, 19, k.white!);
      break;
    }
    case "board": {
      // Blackboard on the back wall: wood frame + dark slate + faint chalk.
      rect(px, TILE, TILE, 2, 2, 44, 34, k.propWood!);        // frame
      hline(px, TILE, TILE, 2, 2, 44, k.woodHi!);             // lit top of frame
      rect(px, TILE, TILE, 5, 5, 38, 28, k.propDark!);        // slate
      hline(px, TILE, TILE, 8, 13, 20, k.propMetal!);         // chalk line
      hline(px, TILE, TILE, 8, 20, 27, k.propMetal!);
      rect(px, TILE, TILE, 2, 35, 44, 4, k.shadow!);          // shadow under the frame
      break;
    }
    case "plant": {
      // A leafy bush in a pot.
      groundShadow(px, k, 24, 42, 13, 4);
      rect(px, TILE, TILE, 17, 33, 14, 10, k.propWood!);      // pot
      rect(px, TILE, TILE, 17, 33, 14, 2, k.woodHi!);
      rect(px, TILE, TILE, 17, 41, 14, 2, k.woodLo!);
      disc(px, TILE, TILE, 24, 20, 15, 14, k.propLeaf!);      // canopy
      disc(px, TILE, TILE, 18, 16, 7, 7, k.leafHi!);          // lit lobe
      disc(px, TILE, TILE, 30, 24, 6, 6, k.leafLo!);          // shade lobe
      fleck(px, rng, k.propLeaf!, k.leafLo!, 0.12);
      break;
    }
    case "barrel": {
      groundShadow(px, k, 24, 42, 12, 4);
      roundRect(px, TILE, TILE, 12, 8, 24, 34, k.propWood!, 3);
      rect(px, TILE, TILE, 13, 8, 4, 34, k.woodHi!);          // left highlight
      rect(px, TILE, TILE, 31, 8, 4, 34, k.woodLo!);          // right shade
      for (const y of [8, 22, 41]) rect(px, TILE, TILE, 12, y, 24, 2, k.woodDark!); // bands
      break;
    }
    case "rug": {
      // A soft walkable rug that blends into the floor at the edges.
      roundRect(px, TILE, TILE, 4, 6, 40, 36, k.propWarm!, 3);
      roundRect(px, TILE, TILE, 8, 10, 32, 28, k.warmHi!, 2);
      roundRect(px, TILE, TILE, 12, 14, 24, 20, k.propWarm!, 2);
      for (let x = 6; x < 42; x += 3) { put(px, TILE, TILE, x, 6, k.warmLo!); put(px, TILE, TILE, x, 41, k.warmLo!); } // fringe
      break;
    }
    case "stage": {
      // A raised platform edge.
      rect(px, TILE, TILE, 0, 10, TILE, 38, k.propWood!);
      rect(px, TILE, TILE, 0, 10, TILE, 4, k.warmHi!);        // lit front lip
      rect(px, TILE, TILE, 0, 14, TILE, 2, k.woodLo!);
      for (let x = 4; x < TILE; x += 12) rect(px, TILE, TILE, x, 16, 1, 30, k.woodLo!); // plank seams
      break;
    }
    case "note": {
      // A floating music note (decor).
      groundShadow(px, k, 24, 42, 8, 3);
      rect(px, TILE, TILE, 27, 8, 3, 26, k.propDark!);        // stem
      disc(px, TILE, TILE, 20, 33, 8, 6, k.propDark!);        // head
      disc(px, TILE, TILE, 18, 31, 3, 2, k.propMetal!);       // gloss
      rect(px, TILE, TILE, 27, 8, 9, 3, k.propDark!);         // flag
      break;
    }
    case "door": {
      // W-1: a walkable doorway — stepping on it walks you into the next zone.
      // Wooden frame + lit panel + handle, dark threshold gap at the base so it
      // reads as an opening, not furniture. Sits in a wall row.
      rect(px, TILE, TILE, 4, 2, 40, 44, k.woodDark!);        // frame
      rect(px, TILE, TILE, 8, 5, 32, 39, k.propWood!);        // door panel
      rect(px, TILE, TILE, 8, 5, 32, 3, k.woodHi!);           // lit top rail
      rect(px, TILE, TILE, 12, 10, 24, 14, k.woodHi!);        // upper inset panel
      rect(px, TILE, TILE, 12, 27, 24, 13, k.woodHi!);        // lower inset panel
      rect(px, TILE, TILE, 13, 11, 22, 12, k.propWood!);
      rect(px, TILE, TILE, 13, 28, 22, 11, k.propWood!);
      disc(px, TILE, TILE, 33, 25, 2, 2, k.propMetal!);       // handle
      rect(px, TILE, TILE, 8, 44, 32, 2, k.ink!);             // threshold gap
      break;
    }
    case "door-sealed": {
      // The Blank has sealed this door — an ink splat swallows the frame.
      // Solid (bump), un-inks when the chapter releases.
      rect(px, TILE, TILE, 4, 2, 40, 44, k.woodDark!);
      rect(px, TILE, TILE, 8, 5, 32, 39, k.propWood!);
      // the ink seal: a blobby splat + runners + stray dots
      disc(px, TILE, TILE, 24, 24, 15, 13, k.ink!);
      disc(px, TILE, TILE, 15, 16, 6, 5, k.ink!);
      disc(px, TILE, TILE, 33, 33, 7, 6, k.ink!);
      rect(px, TILE, TILE, 21, 34, 3, 10, k.ink!);            // drip
      rect(px, TILE, TILE, 30, 38, 2, 7, k.ink!);
      disc(px, TILE, TILE, 10, 36, 2, 2, k.ink!);
      disc(px, TILE, TILE, 38, 14, 2, 2, k.ink!);
      disc(px, TILE, TILE, 21, 20, 2, 2, k.white!);           // a wary glint in the ink
      break;
    }
    case "grass": {
      // WALKABLE tall grass (the FireRed tall-grass analog) — some tufts hide a
      // stolen word. Triangular blade clusters over the ground.
      for (const [bx, by] of [[6, 14], [24, 10], [38, 16], [12, 30], [30, 28], [20, 40], [40, 38]] as const) {
        // each cluster: three blades (left shade, center lit, right base)
        rect(px, TILE, TILE, bx, by + 4, 2, 6, k.leafLo!);
        rect(px, TILE, TILE, bx + 3, by, 2, 10, k.propLeaf!);
        rect(px, TILE, TILE, bx + 4, by, 1, 4, k.leafHi!);
        rect(px, TILE, TILE, bx + 6, by + 3, 2, 7, k.propLeaf!);
      }
      break;
    }
    case "tree": {
      // A full tree: big canopy + trunk + ground shadow. Solid.
      groundShadow(px, k, 24, 43, 14, 4);
      rect(px, TILE, TILE, 21, 32, 6, 11, k.propWood!);       // trunk
      rect(px, TILE, TILE, 21, 32, 2, 11, k.woodHi!);
      disc(px, TILE, TILE, 24, 18, 17, 15, k.leafLo!);        // canopy base (shade)
      disc(px, TILE, TILE, 23, 16, 15, 13, k.propLeaf!);      // canopy
      disc(px, TILE, TILE, 17, 11, 8, 7, k.leafHi!);          // lit crown lobe
      disc(px, TILE, TILE, 30, 14, 6, 5, k.leafHi!);
      fleck(px, rng, k.propLeaf!, k.leafLo!, 0.10);
      break;
    }
    case "fence": {
      // A wooden fence run: two rails + posts. Solid; floor shows through gaps.
      groundShadow(px, k, 24, 44, 20, 3);
      rect(px, TILE, TILE, 0, 18, TILE, 5, k.propWood!);      // top rail
      hline(px, TILE, TILE, 0, 18, TILE, k.woodHi!);
      rect(px, TILE, TILE, 0, 32, TILE, 5, k.propWood!);      // bottom rail
      hline(px, TILE, TILE, 0, 32, TILE, k.woodHi!);
      for (const x of [6, 38]) {                              // posts
        rect(px, TILE, TILE, x, 10, 5, 33, k.propWood!);
        rect(px, TILE, TILE, x, 10, 2, 33, k.woodHi!);
        rect(px, TILE, TILE, x, 41, 5, 2, k.woodDark!);
      }
      break;
    }
    case "gate": {
      // A fence OPENING (walkable): the two flanking posts, nothing between.
      for (const x of [2, 41]) {
        rect(px, TILE, TILE, x, 8, 5, 36, k.propWood!);
        rect(px, TILE, TILE, x, 8, 2, 36, k.woodHi!);
        rect(px, TILE, TILE, x - 1, 8, 7, 3, k.woodDark!);    // post cap
        rect(px, TILE, TILE, x, 42, 5, 2, k.woodDark!);
      }
      break;
    }
    case "locker": {
      // A tall metal school locker (corridor prop). Solid.
      groundShadow(px, k, 24, 44, 15, 3);
      rect(px, TILE, TILE, 8, 3, 32, 41, k.propMetal!);       // body
      rect(px, TILE, TILE, 8, 3, 32, 2, k.metalHi!);          // lit top
      rect(px, TILE, TILE, 23, 3, 2, 41, k.metalLo!);         // door split
      for (const y of [8, 12] as const) {                     // vents
        rect(px, TILE, TILE, 11, y, 10, 2, k.metalLo!);
        rect(px, TILE, TILE, 27, y, 10, 2, k.metalLo!);
      }
      rect(px, TILE, TILE, 19, 22, 2, 5, k.propDark!);        // handles
      rect(px, TILE, TILE, 27, 22, 2, 5, k.propDark!);
      rect(px, TILE, TILE, 8, 42, 32, 2, k.metalLo!);         // base
      break;
    }
  }
  return px;
}

export interface Tileset {
  palette: string[];
  tiles: Record<string, IndexedImage>;
}

export function paintTileset(seed: number, opts?: TilesetOptions): Tileset {
  const { palette, k } = buildPalette(opts);
  const kinds = opts?.kinds ?? TILE_KINDS;
  const tiles: Record<string, IndexedImage> = {};
  kinds.forEach((kind, i) => {
    tiles[kind] = { width: TILE, height: TILE, palette, pixels: paintTile(kind, seed * 131 + i * 17 + 1, k) };
  });
  return { palette, tiles };
}
