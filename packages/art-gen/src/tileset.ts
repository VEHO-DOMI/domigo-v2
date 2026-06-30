/**
 * Procedural overworld tileset. Deterministic from a seed; emits IndexedImages
 * (no canvas). The 6 base tiles (floor/wall/path/accent/accent2/encounter) plus
 * optional decor PROPS (board/plant/barrel/rug/stage/note) used by per-zone themes.
 * Colours are NAMED palette slots so a theme can recolour by name; `paintTileset(seed)`
 * with no opts reproduces the original "School & Classroom" output (rendered) verbatim.
 */
import { TILE, border, grid, put, rect, type IndexedImage } from "./image.ts";
import { mulberry32 } from "./rng.ts";

export type TileKind =
  | "floor" | "wall" | "path" | "accent" | "accent2" | "encounter"
  | "board" | "plant" | "barrel" | "rug" | "stage" | "note";
/** The base tileset (what `paintTileset(seed)` paints by default). Props are opt-in via a theme. */
export const TILE_KINDS: TileKind[] = ["floor", "wall", "path", "accent", "accent2", "encounter"];

/** Named palette slots — a theme overrides by name; the painter reads them as indices. */
export type PaletteSlot =
  | "floorBase" | "floorSpeckle" | "wallBase" | "wallBorder" | "pathBase" | "accentLight"
  | "propWood" | "encounterGlow" | "encounterRing" | "propLeaf" | "propDark" | "propMetal" | "propWarm";

/** Slot order == palette index (offset by 1; index 0 is always transparent). */
const SLOTS: PaletteSlot[] = [
  "floorBase", "floorSpeckle", "wallBase", "wallBorder", "pathBase", "accentLight",
  "propWood", "encounterGlow", "encounterRing", "propLeaf", "propDark", "propMetal", "propWarm",
];
const IDX = Object.fromEntries(SLOTS.map((s, i) => [s, i + 1])) as Record<PaletteSlot, number>;

/** Default colours — slots 1-9 reproduce the original PALETTE exactly; 10-13 are prop colours. */
const DEFAULT_COLORS: Record<PaletteSlot, string> = {
  floorBase: "#cdb89a", floorSpeckle: "#b9a079", wallBase: "#6b7280", wallBorder: "#434a55",
  pathBase: "#9ca3af", accentLight: "#d6c7a8", propWood: "#b45309", encounterGlow: "#22c55e",
  encounterRing: "#166534", propLeaf: "#16a34a", propDark: "#27272a", propMetal: "#cbd5e1", propWarm: "#f59e0b",
};

export interface TilesetOptions {
  /** Per-slot colour overrides (theme palette). */
  palette?: Partial<Record<PaletteSlot, string>>;
  /** Brand accent for the encounter-node glow (kept legible by a dark ring). */
  accent?: string;
  /** Which tiles to paint (default = the 6 base kinds). Themes add their props. */
  kinds?: TileKind[];
}

function buildPalette(opts?: TilesetOptions): string[] {
  const colors = { ...DEFAULT_COLORS, ...(opts?.palette ?? {}) };
  if (opts?.accent) colors.encounterGlow = opts.accent; // ring stays dark → green node pops on any floor
  return ["#00000000", ...SLOTS.map((s) => colors[s])];
}

function speckle(px: number[], rng: () => number, baseIdx: number, speckleIdx: number, p: number): void {
  for (let i = 0; i < px.length; i++) if (px[i] === baseIdx && rng() < p) px[i] = speckleIdx;
}

/** Pixels for one tile kind (palette-index grid). Determinism: speckle positions are seed-stable. */
function paintTile(kind: TileKind, seed: number): number[] {
  const rng = mulberry32(seed);
  const px = grid(TILE, TILE, IDX.floorBase);
  switch (kind) {
    case "floor":
      speckle(px, rng, IDX.floorBase, IDX.floorSpeckle, 0.12);
      break;
    case "wall":
      rect(px, TILE, TILE, 0, 0, TILE, TILE, IDX.wallBase);
      speckle(px, rng, IDX.wallBase, IDX.wallBorder, 0.1);
      border(px, TILE, TILE, IDX.wallBorder);
      break;
    case "path":
      rect(px, TILE, TILE, 0, 0, TILE, TILE, IDX.pathBase);
      speckle(px, rng, IDX.pathBase, IDX.accentLight, 0.14);
      break;
    case "accent":
      speckle(px, rng, IDX.floorBase, IDX.accentLight, 0.2);
      break;
    case "accent2": // a desk block on floor
      rect(px, TILE, TILE, 2, 4, 12, 8, IDX.propWood);
      speckle(px, rng, IDX.propWood, IDX.accentLight, 0.1);
      break;
    case "encounter": { // a glowing node marker: filled diamond + ring
      const c = TILE / 2;
      for (let y = 0; y < TILE; y++) for (let x = 0; x < TILE; x++) {
        const d = Math.abs(x - c + 0.5) + Math.abs(y - c + 0.5);
        if (d < 4) put(px, TILE, TILE, x, y, IDX.encounterGlow);
        else if (d < 5.5) put(px, TILE, TILE, x, y, IDX.encounterRing);
      }
      break;
    }
    case "board": // blackboard: dark panel with a wood frame
      rect(px, TILE, TILE, 1, 1, 14, 11, IDX.propWood);
      rect(px, TILE, TILE, 2, 2, 12, 9, IDX.propDark);
      speckle(px, rng, IDX.propDark, IDX.propMetal, 0.04);
      break;
    case "plant": { // leafy bush: a wood pot + a green diamond canopy
      rect(px, TILE, TILE, 5, 11, 6, 4, IDX.propWood);
      const cx = TILE / 2;
      for (let y = 0; y < 11; y++) for (let x = 0; x < TILE; x++) {
        if (Math.abs(x - cx + 0.5) + Math.abs(y - 5) < 5) put(px, TILE, TILE, x, y, IDX.propLeaf);
      }
      speckle(px, rng, IDX.propLeaf, IDX.encounterRing, 0.18);
      break;
    }
    case "barrel": // wooden barrel with two dark bands
      rect(px, TILE, TILE, 3, 2, 10, 12, IDX.propWood);
      rect(px, TILE, TILE, 3, 5, 10, 1, IDX.propDark);
      rect(px, TILE, TILE, 3, 10, 10, 1, IDX.propDark);
      speckle(px, rng, IDX.propWood, IDX.propDark, 0.06);
      break;
    case "rug": // a soft walkable rug: warm field + dark border
      rect(px, TILE, TILE, 1, 3, 14, 10, IDX.propWarm);
      border(px, TILE, TILE, IDX.floorBase); // blend the edge into the floor
      rect(px, TILE, TILE, 3, 5, 10, 6, IDX.propMetal);
      break;
    case "stage": // a raised platform: warm top edge over a wood body
      rect(px, TILE, TILE, 0, 4, TILE, 12, IDX.propWood);
      rect(px, TILE, TILE, 0, 4, TILE, 2, IDX.propWarm);
      speckle(px, rng, IDX.propWood, IDX.propDark, 0.08);
      break;
    case "note": // a single music note shape (decor)
      rect(px, TILE, TILE, 9, 2, 2, 9, IDX.propDark); // stem
      rect(px, TILE, TILE, 5, 9, 5, 4, IDX.propDark); // head
      put(px, TILE, TILE, 11, 2, IDX.propWarm);
      break;
  }
  return px;
}

export interface Tileset {
  palette: string[];
  tiles: Record<string, IndexedImage>;
}

/**
 * Deterministic tileset for a zone seed. With no opts → the original 6-tile output
 * (rendered) verbatim. A theme passes a palette, the brand accent, and its prop kinds.
 */
export function paintTileset(seed: number, opts?: TilesetOptions): Tileset {
  const palette = buildPalette(opts);
  const kinds = opts?.kinds ?? TILE_KINDS;
  const tiles: Record<string, IndexedImage> = {};
  kinds.forEach((k, i) => {
    tiles[k] = { width: TILE, height: TILE, palette, pixels: paintTile(k, seed * 131 + i * 17 + 1) };
  });
  return { palette, tiles };
}
