/**
 * Side-view platformer art (the Keen-shape level layer) — 48px IndexedImages,
 * deterministic, DOM-free. This is a SEPARATE vocabulary from tileset.ts (which
 * paints the top-down GBA look): side-view terrain is lit from above, its depth
 * cues are edge exposure (lip/underside), not cast-onto-floor shadows.
 *
 * Identity: the world is a page of a book. Terrain is parchment earth with a
 * living ink-grass lip; deep inside the ground, faint RULED LINES and letter
 * fossils show through — you are literally standing on the text.
 *
 * Auto-tiling: `paintTerrain` returns one tile per TBLR edge-exposure mask
 * (16 variants) so scenes pick by neighbor lookup — no hand-authored variants.
 */
import { TILE, disc, grid, hline, line, outline, put, rect, roundRect, type IndexedImage } from "./image.ts";
import { darken, lighten, mix } from "./color.ts";
import { mulberry32, pick } from "./rng.ts";

// ── themes ────────────────────────────────────────────────────────────────────

export interface PlatformTheme {
  /** terrain body (parchment earth) */
  earth: string;
  /** the living top lip (ink-grass) */
  lip: string;
  /** wood for ledges/props */
  wood: string;
  /** the chapter's accent (doors, banners, glow) */
  accent: string;
  /** background sky, far→near */
  sky: [string, string, string];
  /** distant silhouette hills (far parallax) */
  silhouette: string;
}

/** Per-chapter platform themes (bible §3 grounds). Key = level header.theme. */
export const PLATFORM_THEMES: Record<string, PlatformTheme> = {
  schoolhouse: {
    earth: "#8a6f4f", lip: "#6f9a58", wood: "#a8763e", accent: "#8b7cf5",
    sky: ["#232136", "#1b1930", "#141221"], silhouette: "#2c2849",
  },
  zoo: {
    earth: "#96784a", lip: "#8aa353", wood: "#9c6b35", accent: "#e0a030",
    sky: ["#26243a", "#1c1a30", "#141221"], silhouette: "#302b4e",
  },
  ship: {
    earth: "#6f6046", lip: "#7a8f9a", wood: "#8a5a32", accent: "#5fd4c4",
    sky: ["#1f2440", "#181c33", "#111425"], silhouette: "#28304e",
  },
};

export function resolvePlatformTheme(name: string | null | undefined): PlatformTheme {
  return PLATFORM_THEMES[name ?? ""] ?? PLATFORM_THEMES["schoolhouse"]!;
}

// ── shared palette build ──────────────────────────────────────────────────────

interface Pal {
  palette: string[];
  k: Record<string, number>;
}

function buildPal(t: PlatformTheme): Pal {
  const entries: Array<[string, string]> = [
    ["ink", "#191624"],
    ["earth", t.earth], ["earthHi", lighten(t.earth, 0.12)], ["earthLo", darken(t.earth, 0.16)],
    ["earthDeep", darken(t.earth, 0.30)], ["rule", darken(t.earth, 0.24)],
    ["lip", t.lip], ["lipHi", lighten(t.lip, 0.20)], ["lipLo", darken(t.lip, 0.18)],
    ["wood", t.wood], ["woodHi", lighten(t.wood, 0.18)], ["woodLo", darken(t.wood, 0.22)],
    ["woodDark", darken(t.wood, 0.42)],
    ["accent", t.accent], ["accentHi", mix(t.accent, "#ffffff", 0.45)], ["accentLo", darken(t.accent, 0.25)],
    ["paper", "#e8dfc8"], ["paperLo", "#c9bda0"],
    ["white", "#f6f5ff"], ["gold", "#ffd75e"], ["goldLo", "#c9a23f"],
    ["thorn", "#2a2438"], ["thornHi", "#4a3f66"], ["thornGloss", "#8b7cf5"],
    ["shadow", "#00000040"],
  ];
  const palette = ["#00000000", ...entries.map((e) => e[1])];
  const k: Record<string, number> = {};
  entries.forEach(([name], i) => { k[name] = i + 1; });
  return { palette, k };
}

// ── terrain (auto-tiled) ──────────────────────────────────────────────────────

/** Exposure mask bit order: 1=top 2=bottom 4=left 8=right (set = NO solid there). */
export function terrainMask(top: boolean, bottom: boolean, left: boolean, right: boolean): number {
  return (top ? 1 : 0) | (bottom ? 2 : 0) | (left ? 4 : 0) | (right ? 8 : 0);
}

function paintEarth(mask: number, seed: number, p: Pal): IndexedImage {
  const { k } = p;
  const rng = mulberry32(seed);
  const px = grid(TILE, TILE, k.earth!);
  const T = (mask & 1) !== 0, B = (mask & 2) !== 0, L = (mask & 4) !== 0, R = (mask & 8) !== 0;

  // body texture: soft strata + the book's ruled lines deep inside
  for (let y = 0; y < TILE; y += 1) {
    for (let x = 0; x < TILE; x += 1) {
      if (rng() < 0.045) put(px, TILE, TILE, x, y, rng() < 0.5 ? k.earthHi! : k.earthLo!);
    }
  }
  for (const ry of [14, 30, 46]) {
    if (T && ry < 18) continue; // no ruling right under a grass lip
    for (let x = 0; x < TILE; x += 1) if (rng() < 0.85) put(px, TILE, TILE, x, ry, k.rule!);
  }
  // a letter fossil, rarely — the ground is made of text
  if (!T && rng() < 0.3) {
    const gx = 8 + Math.floor(rng() * 26);
    const gy = 8 + Math.floor(rng() * 26);
    const glyph = pick(rng, ["E", "a", "t", "s"] as const);
    paintTinyGlyph(px, gx, gy, glyph, k.rule!);
  }

  // edges (exposure = light or dark seam + rounded silhouette)
  if (T) {
    // the living lip: rows 0-2 are SKY with blade bumps (organic skyline),
    // the grass band proper sits at rows 3-8
    rect(px, TILE, TILE, 0, 0, TILE, 3, 0);
    rect(px, TILE, TILE, 0, 3, TILE, 6, k.lip!);
    hline(px, TILE, TILE, 0, 3, TILE, k.lipHi!);
    hline(px, TILE, TILE, 0, 8, TILE, k.lipLo!);
    hline(px, TILE, TILE, 0, 9, TILE, k.earthLo!);
    for (let x = 0; x < TILE; x += 1) {
      const r = rng();
      if (r < 0.30) {
        // a blade rising above the lip (1-3px, sometimes 2 wide)
        const h = 1 + Math.floor(rng() * 3);
        rect(px, TILE, TILE, x, 3 - h, 1, h, rng() < 0.35 ? k.lipHi! : k.lip!);
        if (rng() < 0.3) rect(px, TILE, TILE, x + 1, 3 - Math.max(1, h - 1), 1, Math.max(1, h - 1), k.lipLo!);
      }
    }
  }
  if (B) {
    rect(px, TILE, TILE, 0, TILE - 4, TILE, 4, k.earthDeep!);
    hline(px, TILE, TILE, 0, TILE - 5, TILE, k.earthLo!);
  }
  if (L) {
    for (let y = 0; y < TILE; y += 1) { put(px, TILE, TILE, 0, y, k.earthHi!); put(px, TILE, TILE, 1, y, y % 5 === 0 ? k.earthLo! : k.earth!); }
    if (T) { put(px, TILE, TILE, 0, 0, k.lipHi!); put(px, TILE, TILE, 0, 1, k.lip!); }
  }
  if (R) {
    for (let y = 0; y < TILE; y += 1) { put(px, TILE, TILE, TILE - 1, y, k.earthDeep!); put(px, TILE, TILE, TILE - 2, y, y % 4 === 0 ? k.earthLo! : k.earth!); }
    if (T) put(px, TILE, TILE, TILE - 1, 0, k.lipLo!);
  }
  // rounded open corners (both faces exposed) — soften the silhouette
  const corner = (cx: number, cy: number): void => { put(px, TILE, TILE, cx, cy, 0); };
  if (T && L) { corner(0, 0); }
  if (T && R) { corner(TILE - 1, 0); }
  if (B && L) { corner(0, TILE - 1); }
  if (B && R) { corner(TILE - 1, TILE - 1); }

  return { width: TILE, height: TILE, palette: p.palette, pixels: px };
}

/** 5×6 pixel letter fossils (just enough to read as print). */
function paintTinyGlyph(px: number[], x0: number, y0: number, glyph: "E" | "a" | "t" | "s", idx: number): void {
  const P = (x: number, y: number): void => put(px, TILE, TILE, x0 + x, y0 + y, idx);
  if (glyph === "E") {
    for (let y = 0; y < 6; y += 1) P(0, y);
    for (const y of [0, 3, 5]) { P(1, y); P(2, y); P(3, y); }
  } else if (glyph === "a") {
    for (const [x, y] of [[1, 2], [2, 2], [3, 3], [3, 4], [3, 5], [2, 5], [1, 5], [0, 4], [1, 3], [2, 3], [3, 2]] as const) P(x, y);
  } else if (glyph === "t") {
    for (let y = 0; y < 6; y += 1) P(1, y);
    for (const x of [0, 1, 2]) P(x, 1);
  } else {
    for (const [x, y] of [[3, 1], [2, 0], [1, 0], [0, 1], [1, 2], [2, 3], [3, 4], [2, 5], [1, 5], [0, 4]] as const) P(x, y);
  }
}

export interface TerrainSet {
  palette: string[];
  /** key: `earth-<mask>` (16 variants) + `oneway` + `spikes`. */
  tiles: Record<string, IndexedImage>;
}

export function paintTerrain(seed: number, theme: PlatformTheme): TerrainSet {
  const p = buildPal(theme);
  const tiles: Record<string, IndexedImage> = {};
  for (let mask = 0; mask < 16; mask += 1) {
    tiles[`earth-${mask}`] = paintEarth(mask, seed * 977 + mask * 31 + 5, p);
  }
  tiles["oneway"] = paintOneWay(seed, p);
  tiles["spikes"] = paintSpikes(seed, p);
  tiles["slope-1"] = paintSlope(1, seed, p);
  tiles["slope--1"] = paintSlope(-1, seed, p);
  return { palette: p.palette, tiles };
}

/** One-way ledge: a wooden plank shelf (48×20 — matches the physics body). */
function paintOneWay(seed: number, p: Pal): IndexedImage {
  const { k } = p;
  const H = 20;
  const rng = mulberry32(seed * 7 + 3);
  const px = grid(TILE, H, 0);
  rect(px, TILE, H, 0, 2, TILE, 12, k.wood!);
  hline(px, TILE, H, 0, 2, TILE, k.woodHi!);
  hline(px, TILE, H, 0, 3, TILE, k.woodHi!);
  hline(px, TILE, H, 0, 12, TILE, k.woodLo!);
  hline(px, TILE, H, 0, 13, TILE, k.woodDark!);
  for (let x = 0; x < TILE; x += 1) if (rng() < 0.12) put(px, TILE, H, x, 5 + Math.floor(rng() * 6), k.woodLo!);
  // iron nails at the ends
  for (const x of [3, TILE - 4]) { put(px, TILE, H, x, 6, k.ink!); put(px, TILE, H, x, 9, k.ink!); }
  return { width: TILE, height: H, palette: p.palette, pixels: px };
}

/** Slope tiles ('/' dir 1 rises rightward, '\' dir -1 falls rightward):
 *  diagonal earth wedge with the grass lip running along the surface. */
function paintSlope(dir: 1 | -1, seed: number, p: Pal): IndexedImage {
  const { k } = p;
  const rng = mulberry32(seed * 17 + dir + 9);
  const px = grid(TILE, TILE, 0);
  for (let x = 0; x < TILE; x += 1) {
    const fx = (x + 0.5) / TILE;
    const surf = Math.round(TILE - (dir === 1 ? fx : 1 - fx) * TILE);
    for (let y = surf; y < TILE; y += 1) {
      put(px, TILE, TILE, x, y, rng() < 0.045 ? k.earthLo! : k.earth!);
    }
    // the lip hugs the diagonal
    for (let d = 0; d < 6 && surf + d < TILE; d += 1) {
      put(px, TILE, TILE, x, surf + d, d === 0 ? k.lipHi! : d < 5 ? k.lip! : k.lipLo!);
    }
    if (rng() < 0.25 && surf > 2) put(px, TILE, TILE, x, surf - 1, k.lip!); // blade
  }
  return { width: TILE, height: TILE, palette: p.palette, pixels: px };
}

/** Far skyline silhouette (tiles horizontally): rolling page-hills + book-spine
 *  towers — the depth layer behind the play field. */
export function paintSkyline(seed: number, theme: PlatformTheme): IndexedImage {
  const W = 240;
  const H = 120;
  const rng = mulberry32(seed * 53 + 11);
  const entries: Array<[string, string]> = [["sil", theme.silhouette], ["silHi", lighten(theme.silhouette, 0.10)]];
  const palette = ["#00000000", ...entries.map((e) => e[1])];
  const px = grid(W, H, 0);
  // rolling hills: layered sine humps
  for (let x = 0; x < W; x += 1) {
    const t = (x / W) * Math.PI * 2;
    const ridge = 62 - Math.round(14 * Math.sin(t * 2 + 1.3) + 9 * Math.sin(t * 5 + 0.4));
    for (let y = ridge; y < H; y += 1) put(px, W, H, x, y, y < ridge + 3 ? 2 : 1);
  }
  // book-spine towers on the ridge
  for (const [bx, bw, bh] of [[26, 14, 34], [92, 10, 26], [168, 16, 42], [214, 9, 22]] as const) {
    let baseY = H;
    for (let y = 0; y < H; y += 1) { if (px[y * W + bx] !== 0) { baseY = y; break; } }
    rect(px, W, H, bx, baseY - bh, bw, bh + 4, 1);
    rect(px, W, H, bx, baseY - bh, bw, 2, 2); // lit top edge
    if (rng() < 0.8) rect(px, W, H, bx + 2, baseY - bh + 5, bw - 4, 2, 2); // spine band
  }
  return { width: W, height: H, palette, pixels: px };
}

// ── the hero (side-view platformer sprite) ────────────────────────────────────

export type HeroPose =
  | "stand" | "run1" | "run2" | "run3" | "run4"
  | "jump" | "fall" | "pogo1" | "pogo2" | "climb1" | "climb2" | "hang";
export const HERO_POSES: HeroPose[] = ["stand", "run1", "run2", "run3", "run4", "jump", "fall", "pogo1", "pogo2", "climb1", "climb2", "hang"];

export interface HeroSprite {
  palette: string[];
  frames: Record<HeroPose, IndexedImage>;
}

// same option pools as the top-down avatar → the SAME kid on every surface
const HERO_HAIR = ["#3b2f2f", "#6b4423", "#1f2937", "#8d5524", "#4a2f1a"] as const;
const HERO_SHIRT = ["#2563eb", "#dc2626", "#059669", "#7c3aed", "#d97706", "#0891b2"] as const;

type Pt = [number, number];
interface PoseSpec {
  dy: number; // whole-body rise (negative = up)
  lean: number; // torso/head forward lean
  backLeg: [Pt, Pt]; // knee, foot
  frontLeg: [Pt, Pt];
  backArm: [Pt, Pt]; // elbow, hand
  frontArm: [Pt, Pt];
  face: "side" | "front" | "up";
  quill?: "ride" | "squash"; // the Federstab pogo
}

const POSES: Record<HeroPose, PoseSpec> = {
  stand: { dy: 0, lean: 0, backLeg: [[20, 38], [20, 44]], frontLeg: [[26, 38], [26, 44]], backArm: [[18, 27], [18, 32]], frontArm: [[28, 27], [28, 32]], face: "side" },
  run1: { dy: 0, lean: 2, backLeg: [[18, 37], [13, 41]], frontLeg: [[29, 38], [33, 44]], backArm: [[28, 25], [31, 28]], frontArm: [[19, 29], [16, 31]], face: "side" },
  run2: { dy: -1, lean: 2, backLeg: [[20, 37], [19, 41]], frontLeg: [[27, 38], [26, 43]], backArm: [[27, 27], [28, 30]], frontArm: [[20, 28], [19, 31]], face: "side" },
  run3: { dy: 0, lean: 2, backLeg: [[19, 38], [15, 44]], frontLeg: [[28, 37], [31, 41]], backArm: [[19, 29], [16, 31]], frontArm: [[28, 25], [31, 28]], face: "side" },
  run4: { dy: -1, lean: 2, backLeg: [[20, 38], [21, 42]], frontLeg: [[26, 37], [28, 42]], backArm: [[26, 28], [27, 31]], frontArm: [[20, 27], [19, 30]], face: "side" },
  jump: { dy: -2, lean: 1, backLeg: [[19, 34], [17, 39]], frontLeg: [[27, 35], [25, 40]], backArm: [[17, 14], [15, 8]], frontArm: [[29, 26], [31, 30]], face: "side" },
  fall: { dy: 0, lean: -1, backLeg: [[19, 35], [15, 38]], frontLeg: [[28, 38], [31, 43]], backArm: [[17, 20], [14, 16]], frontArm: [[30, 20], [33, 16]], face: "side" },
  pogo1: { dy: -4, lean: 0, backLeg: [[21, 34], [21, 37]], frontLeg: [[26, 34], [26, 37]], backArm: [[21, 27], [24, 29]], frontArm: [[27, 27], [25, 29]], face: "side", quill: "ride" },
  pogo2: { dy: -1, lean: 0, backLeg: [[19, 35], [21, 39]], frontLeg: [[28, 35], [26, 39]], backArm: [[21, 28], [24, 31]], frontArm: [[28, 28], [25, 31]], face: "side", quill: "squash" },
  climb1: { dy: 0, lean: 0, backLeg: [[18, 37], [17, 42]], frontLeg: [[29, 36], [30, 40]], backArm: [[20, 14], [21, 8]], frontArm: [[28, 20], [28, 15]], face: "front" },
  climb2: { dy: 0, lean: 0, backLeg: [[18, 36], [18, 40]], frontLeg: [[29, 37], [31, 42]], backArm: [[20, 20], [20, 15]], frontArm: [[28, 14], [27, 8]], face: "front" },
  hang: { dy: 0, lean: 0, backLeg: [[21, 38], [21, 43]], frontLeg: [[25, 38], [25, 43]], backArm: [[18, 12], [19, 6]], frontArm: [[31, 13], [31, 6]], face: "front" },
};

function paintHeroPose(pose: PoseSpec, hair: string, shirt: string): IndexedImage {
  const entries: Array<[string, string]> = [
    ["ink", "#191624"],
    ["skin", "#f2c690"], ["skinLo", "#d8a566"],
    ["hair", hair], ["hairLo", darken(hair, 0.28)],
    ["shirt", shirt], ["shirtLo", darken(shirt, 0.26)],
    ["pants", "#3a4252"], ["pantsLo", "#2a3040"],
    ["shoe", "#4a3626"], ["shoeHi", "#6b4f34"],
    ["bag", "#a8763e"], ["bagLo", darken("#a8763e", 0.3)],
    ["quill", "#e8dfc8"], ["quillLo", "#c9bda0"], ["gold", "#ffd75e"], ["goldLo", "#c9a23f"],
    ["eye", "#141221"], ["white", "#f6f5ff"],
  ];
  const palette = ["#00000000", ...entries.map((e) => e[1])];
  const k: Record<string, number> = {};
  entries.forEach(([name], i) => { k[name] = i + 1; });

  const px = grid(TILE, TILE, 0);
  const dy = pose.dy;
  const lx = pose.lean; // head/shoulder lean
  const hipY = 31 + dy;
  const shoulderY = 20 + dy;
  const cx = 23;
  const P = (pt: Pt): Pt => [pt[0], pt[1] + dy];

  // the Federstab (a giant quill, nib down) BEHIND the rider
  if (pose.quill) {
    const squash = pose.quill === "squash";
    const qx = 27; // in front of the rider so the feather reads
    const topY = squash ? 18 + dy : 12 + dy;
    const nibY = 44;
    line(px, TILE, TILE, qx, topY, qx, nibY - 4, 3, k.quill!);
    for (let y = topY; y < nibY - 12; y += 2) put(px, TILE, TILE, qx + 1, y, k.quillLo!);
    // feather barbs at the top, leaning like a plume
    for (let y = topY; y < topY + 8; y += 2) {
      line(px, TILE, TILE, qx, y, qx + 4, y + 2, 1, k.quillLo!);
      line(px, TILE, TILE, qx, y, qx - 3, y + 2, 1, k.quill!);
    }
    put(px, TILE, TILE, qx, topY - 1, k.white!);
    // the nib
    line(px, TILE, TILE, qx, nibY - 4, qx, nibY, 3, k.gold!);
    put(px, TILE, TILE, qx, nibY + 1, k.goldLo!);
    if (squash) { put(px, TILE, TILE, qx - 3, nibY, k.goldLo!); put(px, TILE, TILE, qx + 3, nibY, k.goldLo!); } // splayed under load
    // the little footrest (the quill's clip)
    rect(px, TILE, TILE, 20, (squash ? 39 : 37) + dy + 1, 10, 2, k.gold!);
  }

  // back limbs first (pre-shaded)
  const [bk, bf] = pose.backLeg.map(P) as [Pt, Pt];
  line(px, TILE, TILE, cx - 1, hipY, bk[0], bk[1], 4, k.pantsLo!);
  line(px, TILE, TILE, bk[0], bk[1], bf[0], bf[1], 4, k.pantsLo!);
  rect(px, TILE, TILE, bf[0] - 2, bf[1] - 1, 5, 3, k.shoe!);
  const [bae, bah] = pose.backArm.map(P) as [Pt, Pt];
  line(px, TILE, TILE, cx - 2 + lx, shoulderY + 1, bae[0], bae[1], 3, k.shirtLo!);
  line(px, TILE, TILE, bae[0], bae[1], bah[0], bah[1], 3, k.shirtLo!);
  rect(px, TILE, TILE, bah[0] - 1, bah[1] - 1, 3, 3, k.skinLo!);

  // satchel behind the hip (side poses only)
  if (pose.face === "side") {
    roundRect(px, TILE, TILE, 13, hipY - 6, 8, 8, k.bag!, 2);
    hline(px, TILE, TILE, 13, hipY - 6, 8, k.bagLo!);
    rect(px, TILE, TILE, 13, hipY - 3, 8, 1, k.bagLo!);
  }

  // torso (leans forward at the shoulders)
  const torsoW = pose.face === "side" ? 13 : 12;
  for (let y = shoulderY - 2; y <= hipY + 1; y += 1) {
    const t = (y - (shoulderY - 2)) / Math.max(hipY + 1 - (shoulderY - 2), 1);
    const xoff = Math.round(lx * (1 - t));
    rect(px, TILE, TILE, cx - (torsoW >> 1) + xoff, y, torsoW, 1, k.shirt!);
    put(px, TILE, TILE, cx - (torsoW >> 1) + xoff + torsoW - 1, y, k.shirtLo!);
  }
  // strap across the chest
  if (pose.face === "side") line(px, TILE, TILE, cx + 5 + lx, shoulderY, 15, hipY - 4, 2, k.bagLo!);
  // pants waist
  rect(px, TILE, TILE, cx - 6, hipY, 12, 3, k.pants!);

  // front limbs
  const [fk, ff] = pose.frontLeg.map(P) as [Pt, Pt];
  line(px, TILE, TILE, cx + 2, hipY, fk[0], fk[1], 4, k.pants!);
  line(px, TILE, TILE, fk[0], fk[1], ff[0], ff[1], 4, k.pants!);
  rect(px, TILE, TILE, ff[0] - 2, ff[1] - 1, 6, 3, k.shoe!);
  hline(px, TILE, TILE, ff[0] - 2, ff[1] - 1, 6, k.shoeHi!);

  // head + hair
  const hx = 16 + lx;
  const hy = 5 + dy;
  if (pose.face === "side") {
    roundRect(px, TILE, TILE, hx, hy, 16, 14, k.skin!, 3);
    roundRect(px, TILE, TILE, hx - 1, hy - 2, 15, 8, k.hair!, 2); // crown
    rect(px, TILE, TILE, hx - 2, hy + 2, 5, 7, k.hair!); // swept back
    put(px, TILE, TILE, hx - 3, hy + 4, k.hairLo!);
    rect(px, TILE, TILE, hx + 12, hy - 1, 4, 4, k.hair!); // front tuft
    rect(px, TILE, TILE, hx + 12, hy + 6, 2, 3, k.eye!); // the eye
    put(px, TILE, TILE, hx + 14, hy + 9, k.skinLo!); // nose hint
    put(px, TILE, TILE, hx + 13, hy + 11, k.ink!); // mouth
  } else if (pose.face === "front") {
    roundRect(px, TILE, TILE, hx + 1, hy, 15, 14, k.skin!, 3);
    roundRect(px, TILE, TILE, hx, hy - 2, 17, 7, k.hair!, 2);
    rect(px, TILE, TILE, hx, hy + 4, 2, 5, k.hair!);
    rect(px, TILE, TILE, hx + 15, hy + 4, 2, 5, k.hair!);
    rect(px, TILE, TILE, hx + 4, hy + 7, 2, 3, k.eye!);
    rect(px, TILE, TILE, hx + 11, hy + 7, 2, 3, k.eye!);
    put(px, TILE, TILE, hx + 8, hy + 11, k.ink!);
  } else {
    // looking up (hanging): head tilted back
    roundRect(px, TILE, TILE, hx, hy + 1, 16, 13, k.skin!, 3);
    roundRect(px, TILE, TILE, hx - 1, hy + 3, 14, 8, k.hair!, 2); // crown rolls back
    rect(px, TILE, TILE, hx + 12, hy + 3, 2, 3, k.eye!); // eye looking up
    put(px, TILE, TILE, hx + 13, hy + 7, k.ink!);
  }

  // front arm LAST (over everything)
  const [fae, fah] = pose.frontArm.map(P) as [Pt, Pt];
  line(px, TILE, TILE, cx + 3 + lx, shoulderY + 1, fae[0], fae[1], 3, k.shirt!);
  line(px, TILE, TILE, fae[0], fae[1], fah[0], fah[1], 3, k.shirt!);
  rect(px, TILE, TILE, fah[0] - 1, fah[1] - 1, 3, 3, k.skin!);

  outline(px, TILE, TILE, k.ink!);
  return { width: TILE, height: TILE, palette, pixels: px };
}

export function paintHero(seed: number): HeroSprite {
  const rng = mulberry32(seed);
  const hair = pick(rng, HERO_HAIR);
  const shirt = pick(rng, HERO_SHIRT);
  const frames = Object.fromEntries(
    HERO_POSES.map((p) => [p, paintHeroPose(POSES[p], hair, shirt)]),
  ) as Record<HeroPose, IndexedImage>;
  return { palette: frames.stand.palette, frames };
}

// ── creatures (Jona's sendings — cute-hostile, 2 frames each) ─────────────────

export type PlatformCreature = "walker" | "hopper" | "flyer" | "thief" | "cushion" | "cloud";

function creaturePal(theme: PlatformTheme): Pal {
  const body = "#37325c";
  const entries: Array<[string, string]> = [
    ["ink", "#191624"],
    ["body", body], ["bodyHi", lighten(body, 0.16)], ["bodyLo", darken(body, 0.22)],
    ["belly", "#4a4374"], ["glow", "#8b7cf5"], ["glowHi", "#cfc7ff"],
    ["paper", "#e8dfc8"], ["paperLo", "#c9bda0"], ["paperDark", "#a89a7a"],
    ["white", "#f6f5ff"], ["eye", "#141221"], ["red", "#e05555"],
    ["cushion", "#2f4a6b"], ["cushionHi", "#48678c"], ["accent", theme.accent],
    ["shadow", "#00000040"],
  ];
  const palette = ["#00000000", ...entries.map((e) => e[1])];
  const k: Record<string, number> = {};
  entries.forEach(([name], i) => { k[name] = i + 1; });
  return { palette, k };
}

/** Big expressive eyes — the whole cast shares them (they're WORDS gone feral,
 *  not monsters; the bible's no-kill law needs faces kids can forgive). */
function eyes(px: number[], k: Record<string, number>, x1: number, x2: number, y: number, angry: boolean, look = 0): void {
  for (const x of [x1, x2]) {
    rect(px, TILE, TILE, x, y, 5, 6, k.white!);
    rect(px, TILE, TILE, x + 1 + look, y + 2, 3, 3, k.eye!);
    if (angry) { rect(px, TILE, TILE, x, y - 1, 5, 1, k.ink!); put(px, TILE, TILE, x + (look >= 0 ? 4 : 0), y, k.ink!); }
  }
}

function paintCreatureFrame(kind: PlatformCreature, frame: 0 | 1, p: Pal): IndexedImage {
  const { k } = p;
  const px = grid(TILE, TILE, 0);
  const f = frame === 1;
  if (kind === "walker") {
    // Tintenklecks: a dollop of ink on stubby feet, drips along the crown
    disc(px, TILE, TILE, 24, 27 + (f ? 1 : 0), 16, 12 - (f ? 1 : 0), k.body!);
    disc(px, TILE, TILE, 18, 20, 6, 5, k.body!); // crown blob
    rect(px, TILE, TILE, 30, 14, 3, 8, k.body!); // a drip standing up
    put(px, TILE, TILE, 31, 13, k.bodyHi!);
    disc(px, TILE, TILE, 20, 22, 5, 4, k.bodyHi!); // sheen
    // feet (alternate)
    rect(px, TILE, TILE, f ? 13 : 15, 38, 7, 4, k.bodyLo!);
    rect(px, TILE, TILE, f ? 29 : 27, 38, 7, 4, k.bodyLo!);
    eyes(px, k, 18, 27, 24, true);
    put(px, TILE, TILE, 24, 33, k.ink!); // grumpy mouth
    put(px, TILE, TILE, 25, 33, k.ink!);
  } else if (kind === "hopper") {
    // Hüpfer: a blob riding an EXPLICIT zigzag spring — coiled vs extended
    const squash = !f;
    const cy = squash ? 22 : 14;
    disc(px, TILE, TILE, 24, cy, 12, 9, k.body!);
    disc(px, TILE, TILE, 20, cy - 3, 4, 3, k.bodyHi!);
    // the spring: a fat zigzag from under the body to the ground
    const top = cy + 7;
    const bot = 41;
    const segs = squash ? 3 : 5;
    let prevX = 18;
    for (let i = 1; i <= segs; i += 1) {
      const y0 = top + Math.round(((bot - top) * (i - 1)) / segs);
      const y1 = top + Math.round(((bot - top) * i) / segs);
      const xx = i % 2 === 0 ? 18 : 30;
      line(px, TILE, TILE, prevX, y0, xx, y1, 3, k.glow!);
      prevX = xx;
    }
    rect(px, TILE, TILE, 16, 42, 16, 3, k.bodyLo!); // ground foot
    eyes(px, k, 18, 27, cy - 5, true);
    rect(px, TILE, TILE, 22, cy + 4, 5, 2, k.ink!);
  } else if (kind === "flyer") {
    // Flatterer: a POSSESSED BOOK — covers flap like wings
    const wingUp = f;
    const wy = wingUp ? 10 : 22;
    // left + right covers (paper pages fanned)
    line(px, TILE, TILE, 22, 24, 8, wy, 5, k.paper!);
    line(px, TILE, TILE, 26, 24, 40, wy, 5, k.paper!);
    line(px, TILE, TILE, 22, 26, 9, wy + 3, 2, k.paperLo!);
    line(px, TILE, TILE, 26, 26, 39, wy + 3, 2, k.paperLo!);
    // the spine body
    roundRect(px, TILE, TILE, 18, 20, 12, 12, k.paperDark!, 2);
    rect(px, TILE, TILE, 18, 20, 12, 2, k.paperLo!);
    eyes(px, k, 19, 25, 23, true);
    // ink dripping from the pages
    put(px, TILE, TILE, 16, 33, k.body!);
    rect(px, TILE, TILE, 30, 32, 2, 4, k.body!);
  } else if (kind === "thief") {
    // Dieb: a hunched shadow-imp with a letter sack
    disc(px, TILE, TILE, 22, 26, 11, 10, k.body!);
    disc(px, TILE, TILE, 27, 17, 6, 5, k.body!); // hood/head
    rect(px, TILE, TILE, 31, 13, 4, 4, k.bodyLo!); // ear tuft
    disc(px, TILE, TILE, 19, 23, 4, 3, k.bodyHi!);
    // the sack (bulging with letters)
    disc(px, TILE, TILE, 11, 29 + (f ? 1 : 0), 7, 8, k.paperDark!);
    disc(px, TILE, TILE, 10, 27 + (f ? 1 : 0), 3, 3, k.paperLo!);
    paintTinyGlyph(px, 9, 27 + (f ? 1 : 0), "a", k.ink!);
    // sneaky eyes (pupils pushed sideways — mid-heist)
    eyes(px, k, 23, 29, 15, false, 1);
    // legs mid-scurry
    rect(px, TILE, TILE, f ? 17 : 21, 36, 5, 3, k.bodyLo!);
    rect(px, TILE, TILE, f ? 26 : 23, 37, 5, 3, k.bodyLo!);
  } else if (kind === "cushion") {
    // Sprungkissen: a friendly pouf — the ONE harmless one reads soft + happy
    const squash = f;
    roundRect(px, TILE, TILE, 8, squash ? 26 : 22, 32, squash ? 14 : 18, k.cushion!, 4);
    roundRect(px, TILE, TILE, 8, squash ? 26 : 22, 32, 5, k.cushionHi!, 3);
    for (let x = 12; x < 38; x += 6) put(px, TILE, TILE, x, squash ? 32 : 30, k.cushionHi!); // stitching
    // gentle closed eyes + smile
    rect(px, TILE, TILE, 17, squash ? 30 : 27, 4, 2, k.eye!);
    rect(px, TILE, TILE, 27, squash ? 30 : 27, 4, 2, k.eye!);
    hline(px, TILE, TILE, 21, squash ? 34 : 32, 6, k.ink!);
    put(px, TILE, TILE, 20, squash ? 33 : 31, k.ink!);
    put(px, TILE, TILE, 27, squash ? 33 : 31, k.ink!);
  } else {
    // Tintenwolke: a storm cloud with a charged belly
    disc(px, TILE, TILE, 24, 20, 17, 9, k.body!);
    disc(px, TILE, TILE, 13, 17, 7, 6, k.body!);
    disc(px, TILE, TILE, 34, 16, 8, 7, k.body!);
    disc(px, TILE, TILE, 24, 13, 9, 7, k.body!);
    disc(px, TILE, TILE, 15, 13, 5, 4, k.bodyHi!);
    // charged underside
    hline(px, TILE, TILE, 10, 27, 28, k.glow!);
    for (let x = 12; x < 38; x += 4) put(px, TILE, TILE, x, 28, f ? k.glowHi! : k.glow!);
    eyes(px, k, 18, 27, 16, true);
    if (f) {
      // a spark forming
      line(px, TILE, TILE, 24, 29, 22, 34, 1, k.glowHi!);
      line(px, TILE, TILE, 22, 34, 25, 38, 1, k.glowHi!);
    }
  }
  outline(px, TILE, TILE, k.ink!);
  return { width: TILE, height: TILE, palette: p.palette, pixels: px };
}

export interface CreatureSet {
  palette: string[];
  /** key: `<kind>-0` / `<kind>-1` */
  frames: Record<string, IndexedImage>;
}

export function paintCreatures(theme: PlatformTheme): CreatureSet {
  const p = creaturePal(theme);
  const frames: Record<string, IndexedImage> = {};
  for (const kind of ["walker", "hopper", "flyer", "thief", "cushion", "cloud"] as PlatformCreature[]) {
    frames[`${kind}-0`] = paintCreatureFrame(kind, 0, p);
    frames[`${kind}-1`] = paintCreatureFrame(kind, 1, p);
  }
  return { palette: p.palette, frames };
}

// ── props ─────────────────────────────────────────────────────────────────────

export type PlatformProp =
  | "pole" | "mover" | "bossdoor" | "bossdoor-open" | "seal" | "gluehwort"
  | "checkpoint" | "checkpoint-lit" | "pedestal" | "pedestal-lit";

/** Door pair gems stay color-coded by id. */
export const DOOR_GEMS: Record<string, string> = { "1": "#ffc857", "2": "#5fd4c4", "3": "#f28ab2", "4": "#a88bfa" };

export function paintPlatformProp(prop: PlatformProp, theme: PlatformTheme, seed = 7): IndexedImage {
  const p = buildPal(theme);
  const { k } = p;
  const rng = mulberry32(seed * 31 + 9);
  const px = grid(TILE, TILE, 0);
  switch (prop) {
    case "pole": {
      // a bronze banner-pole segment: shaft + ring + wall bracket
      rect(px, TILE, TILE, 21, 0, 6, TILE, k.woodDark!);
      rect(px, TILE, TILE, 22, 0, 2, TILE, k.woodHi!);
      rect(px, TILE, TILE, 25, 0, 1, TILE, k.ink!);
      rect(px, TILE, TILE, 19, 22, 10, 4, k.gold!); // climbing ring
      hline(px, TILE, TILE, 19, 22, 10, k.white!);
      hline(px, TILE, TILE, 19, 25, 10, k.goldLo!);
      break;
    }
    case "mover": {
      // handled by paintMoverBook (width-parameterized) — placeholder single tile
      return paintMoverBook(1, theme);
    }
    case "bossdoor":
    case "bossdoor-open": {
      const open = prop === "bossdoor-open";
      // a grand double door, 48×96 drawn in one 48×96 image
      const H = 96;
      const dpx = grid(TILE, H, 0);
      const kk = k;
      // stone arch
      for (let y = 6; y < H; y += 1) {
        rect(dpx, TILE, H, 2, y, 44, 1, kk.earthDeep!);
      }
      roundRect(dpx, TILE, H, 4, 8, 40, H - 10, open ? kk.paper! : kk.woodDark!, 6);
      // plank lines
      for (const x of [15, 24, 33]) rect(dpx, TILE, H, x, 12, 1, H - 16, open ? kk.paperLo! : kk.ink!);
      // the knot-rune seal in the middle (fades when open)
      const runeC = open ? kk.gold! : kk.accent!;
      disc(dpx, TILE, H, 24, 44, 10, 10, runeC);
      disc(dpx, TILE, H, 24, 44, 6, 6, open ? kk.white! : kk.accentLo!);
      for (let a = 0; a < 8; a += 1) {
        const ang = (a / 8) * Math.PI * 2;
        put(dpx, TILE, H, 24 + Math.round(Math.cos(ang) * 13), 44 + Math.round(Math.sin(ang) * 13), runeC);
      }
      if (open) {
        // light spilling from the gap
        rect(dpx, TILE, H, 23, 12, 2, H - 16, kk.white!);
        rect(dpx, TILE, H, 21, 20, 6, 4, kk.gold!);
      }
      outline(dpx, TILE, H, kk.ink!);
      return { width: TILE, height: H, palette: p.palette, pixels: dpx };
    }
    case "seal": {
      // a wax-seal medallion with a shine sweep
      disc(px, TILE, TILE, 24, 24, 13, 13, k.accent!);
      disc(px, TILE, TILE, 24, 24, 10, 10, k.accentLo!);
      disc(px, TILE, TILE, 24, 24, 6, 6, k.accent!);
      // the pressed rune
      rect(px, TILE, TILE, 21, 19, 2, 11, k.accentHi!);
      rect(px, TILE, TILE, 25, 19, 2, 11, k.accentHi!);
      hline(px, TILE, TILE, 21, 24, 6, k.accentHi!);
      put(px, TILE, TILE, 18, 17, k.white!);
      put(px, TILE, TILE, 19, 16, k.white!);
      outline(px, TILE, TILE, k.ink!);
      break;
    }
    case "gluehwort": {
      // a glowing scrap of page with a shining word
      disc(px, TILE, TILE, 24, 24, 15, 13, k.accent!); // halo (soft)
      for (let i = 0; i < px.length; i += 1) if (px[i] === k.accent!) { if ((i % 3) !== 0) px[i] = 0; }
      const sway = Math.floor(rng() * 2);
      roundRect(px, TILE, TILE, 13, 17 + sway, 22, 15, k.paper!, 2);
      rect(px, TILE, TILE, 13, 29 + sway, 22, 2, k.paperLo!);
      hline(px, TILE, TILE, 16, 22 + sway, 15, k.goldLo!);
      hline(px, TILE, TILE, 16, 26 + sway, 10, k.goldLo!);
      put(px, TILE, TILE, 33, 15 + sway, k.gold!);
      put(px, TILE, TILE, 11, 30 + sway, k.gold!);
      outline(px, TILE, TILE, k.goldLo!);
      break;
    }
    case "checkpoint":
    case "checkpoint-lit": {
      const lit = prop === "checkpoint-lit";
      rect(px, TILE, TILE, 12, 4, 3, 40, k.woodDark!);
      rect(px, TILE, TILE, 13, 4, 1, 40, k.woodHi!);
      disc(px, TILE, TILE, 13, 3, 2, 2, k.gold!);
      // the banner
      const bc = lit ? k.accent! : k.earthLo!;
      for (let y = 0; y < 12; y += 1) {
        const w = 20 - Math.floor(y / 2);
        rect(px, TILE, TILE, 16, 7 + y, w, 1, bc);
      }
      if (lit) {
        rect(px, TILE, TILE, 18, 10, 3, 3, k.white!); // a lit rune on the cloth
        put(px, TILE, TILE, 26, 13, k.accentHi!);
      }
      outline(px, TILE, TILE, k.ink!);
      break;
    }
    case "pedestal":
    case "pedestal-lit": {
      const lit = prop === "pedestal-lit";
      rect(px, TILE, TILE, 14, 20, 20, 24, k.earthDeep!);
      rect(px, TILE, TILE, 10, 40, 28, 6, k.earthLo!);
      rect(px, TILE, TILE, 12, 16, 24, 6, k.earthLo!);
      disc(px, TILE, TILE, 24, 12, 6, 5, lit ? k.gold! : k.earthHi!);
      if (lit) { put(px, TILE, TILE, 22, 9, k.white!); disc(px, TILE, TILE, 24, 12, 9, 7, k.accent!); disc(px, TILE, TILE, 24, 12, 6, 5, k.gold!); }
      outline(px, TILE, TILE, k.ink!);
      break;
    }
  }
  return { width: TILE, height: TILE, palette: p.palette, pixels: px };
}

/** The mover platform: a FLYING BOOK, open face-down — the deck is its cover. */
export function paintMoverBook(wTiles: number, theme: PlatformTheme): IndexedImage {
  const p = buildPal(theme);
  const { k } = p;
  const W = wTiles * TILE;
  const H = 26;
  const px = grid(W, H, 0);
  // fanned pages hanging beneath
  for (let i = 0; i < 3; i += 1) {
    roundRect(px, W, H, 4 + i * 2, 10 + i * 3, W - 8 - i * 4, 6, i % 2 === 0 ? k.paper! : k.paperLo!, 2);
  }
  // the cover (deck)
  roundRect(px, W, H, 0, 2, W, 10, k.accentLo!, 3);
  hline(px, W, H, 2, 2, W - 4, k.accent!);
  hline(px, W, H, 0, 10, W, k.ink!);
  // spine ridge + title blob
  rect(px, W, H, (W >> 1) - 6, 4, 12, 3, k.gold!);
  for (const x of [6, W - 8]) put(px, W, H, x, 6, k.gold!);
  outline(px, W, H, k.ink!);
  return { width: W, height: H, palette: p.palette, pixels: px };
}

/** Ink thorns — fat, glossy, unmistakably hostile; a puddle of ink at the base. */
function paintSpikes(seed: number, p: Pal): IndexedImage {
  const { k } = p;
  const rng = mulberry32(seed * 13 + 1);
  const px = grid(TILE, TILE, 0);
  // ink puddle base (lit so it reads against the dark backdrop)
  rect(px, TILE, TILE, 0, TILE - 6, TILE, 6, k.thornHi!);
  hline(px, TILE, TILE, 0, TILE - 6, TILE, k.thornGloss!);
  rect(px, TILE, TILE, 0, TILE - 2, TILE, 2, k.thorn!);
  // three fat thorns: LIT violet body, dark core, glowing gloss flank
  const spec: Array<[number, number, number]> = [[8, 26, -1], [24, 34, 0], [39, 24, 1]];
  for (const [cx, h, lean] of spec) {
    const half = 7;
    for (let i = 0; i <= h; i += 1) {
      const y = TILE - 6 - i;
      const w = Math.max(1, Math.round(half * (1 - i / h)));
      const x0 = cx - w + Math.round((i / h) * lean * 3);
      rect(px, TILE, TILE, x0, y, w * 2, 1, k.thornHi!);
      // dark core down the middle, glowing left flank
      if (w > 2) rect(px, TILE, TILE, x0 + w - 1, y, 2, 1, k.thorn!);
      put(px, TILE, TILE, x0, y, k.thornGloss!);
    }
    put(px, TILE, TILE, cx + Math.round(lean * 3) - 1, TILE - 6 - h, k.white!);
    if (rng() < 0.8) put(px, TILE, TILE, cx - 3, TILE - 12, k.thornGloss!);
  }
  outline(px, TILE, TILE, k.ink!);
  return { width: TILE, height: TILE, palette: p.palette, pixels: px };
}
