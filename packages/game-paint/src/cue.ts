// PK-R6 · H2 · THE ↑ CUE, HAND-DRAWN (round-2 finding 1).
//
// „The flat white/navy up-arrow glyph hovering over the boy's head is crisp
// vector geometry with hard edges and no texture, sitting directly on the soft
// watercolor background with zero visual integration."
//
// The old cue called itself a chalk arrow in its own comment and was drawn as
// `fillTriangle` + `fillRect` + a 1-px stroke: four straight machine edges, one
// flat fill, no falloff. Everything else in this book has a soft boundary,
// because everything else in it was painted — so the one shape the engine drew
// by hand was the one shape that read as a HUD sticker pasted over the page.
//
// Nothing here is new art. The arrow is still engine-drawn (doc 44 B14) and is
// still the same silhouette; what changed is HOW it is put down, in the three
// moves that separate chalk on paper from a vector glyph:
//
//  · ITS EDGE IS BUILT, NOT STROKED. The shape is filled four times — an ink
//    bleed widest and faintest underneath, then chalk, then a bright core — so
//    the boundary falls off over about a pixel and a half instead of ending at
//    a mathematically exact line. It is the same stacking `renderHostiles` uses
//    for the hazard halo, aimed at a silhouette instead of a disc.
//  · NO EDGE IS STRAIGHT. Every vertex carries a fixed sub-pixel offset taken
//    from a hash, so the shaft leans a hair and the head sits a hair off-square,
//    the way a hand puts a stroke down. Fixed, not per-frame: a jitter that
//    re-rolled every tick would boil, which is a different artefact and a worse
//    one.
//  · IT SHEDS. A soft warm halo behind it (the gilded light the collectible
//    letters already wear, so the affordances of this book share one glow), and
//    a few dust flecks around it, because chalk leaves powder — the same reason
//    `chalkDust` exists under the guardian's writing.
//
// Pure, deterministic and Phaser-free: the scene only fills what this returns,
// so „the cue has a soft edge and no straight line" is a unit test rather than
// a screenshot.

import { hash01 } from "./mass.ts";

export interface CuePt { x: number; y: number }
/** One fill pass of the arrow: a closed polygon at one colour and alpha. */
export interface CueBand { pts: readonly CuePt[]; colour: number; alpha: number }
/** One soft ring of the halo behind it. R5-W1 · F1: it carries its own centre
 *  now, because the light LAGS the mark (see CUE_LAG_TICKS). */
export interface CueRing { cx: number; cy: number; r: number; alpha: number }
/** One speck of shed chalk. */
export interface CueFleck { x: number; y: number; r: number; alpha: number }

export interface ChalkArrow {
  halo: readonly CueRing[];
  bands: readonly CueBand[];
  dust: readonly CueFleck[];
}

/** The book's chalk white and its ink contour — the two colours the Tafel, the
 *  projectiles and the written evidence are already drawn in. */
export const CUE_CHALK = 0xf6f2e8;
export const CUE_CORE = 0xfffdf6;
export const CUE_INK = 0x243048;
/** The gilded light the collectible letters wear (PaintScene LETTER_HALO_COLOUR
 *  is the same hue): one glow for every affordance in the book. */
export const CUE_HALO = 0xffe3a4;

/** The arrow at unit size, tip at the top — seven points, the classic
 *  shaft-and-head. y grows downward, as everywhere in this renderer. */
const UNIT: readonly CuePt[] = [
  { x: 0, y: -0.55 },
  { x: 0.45, y: -0.02 },
  { x: 0.17, y: -0.02 },
  { x: 0.17, y: 0.45 },
  { x: -0.17, y: 0.45 },
  { x: -0.17, y: -0.02 },
  { x: -0.45, y: -0.02 },
];

/** How far a vertex may wander from where a ruler would put it, in world px at
 *  the default size. Small on purpose: this is a hand's waver, not a wobble. */
export const CUE_JITTER_PX = 0.62;

/** The fill passes, outermost/faintest first: two ink bleeds, then chalk, then
 *  the core. `grow` is how far the pass sits outside the true silhouette in px —
 *  which is what makes the edge a ramp instead of a step. */
const BANDS: readonly { grow: number; colour: number; alpha: number }[] = [
  { grow: 1.5, colour: CUE_INK, alpha: 0.1 },
  { grow: 0.75, colour: CUE_INK, alpha: 0.16 },
  { grow: 0.2, colour: CUE_CHALK, alpha: 0.62 },
  { grow: -0.85, colour: CUE_CORE, alpha: 0.94 },
];

// ── R5-W1 · F1 · DIE LOCKUNG (Kokis Auftrag: „Kinder sollen hingezogen werden")
//
// Der Cue war korrekt und leise. Der Zahlengrund für „leise": das gesamte
// Leuchten gipfelte bei 6,2 % Deckkraft, und die einzige Bewegung war ein
// 1,6-px-Wippen, dessen Mathematik in der ungetesteten Renderdatei stand.
//
// Vier Züge, und der vierte ist der eigentliche:
//  1. Das Wippen bekommt Weg und einen Namen (2,9 px auf 46 Ticks ≈ 78 bpm,
//     ein ruhiger Puls). Ein benannter Tick-Takt ist prüfbar, `sin(t/9)` nicht.
//  2. Halo und Staub LAUFEN NACH. Der billigste Lebendigkeits-Trick, den es
//     gibt: die Marke wird nicht mehr verschoben, sie wird GETRAGEN.
//  3. Das Leuchten atmet — und ist endlich hell genug, um es zu bemerken.
//     Gegenphasig zum Wippen: die Marke „landet" unten, das Licht antwortet.
//     Ein Glockenschlag, nicht zwei wackelnde Dinge.
//  4. AUFSTEIGENDE KRÜMEL. Kinder lesen eine Bewegungsrichtung, lange bevor
//     sie ein Zeichen lesen. Sieben Kreidekörner, die nach oben wandern, sagen
//     „hier hoch" ohne ein Wort — aus einem Schild wird eine Strömung.
//
// Was sich NICHT ändert: der gehashte Vertex-Waver liest `phase` nie (er würde
// „kochen" — ein schlimmeres Artefakt als das Vektor-Glyph, das er ersetzt hat),
// die Band-Rampe, die Silhouette, und `phase` ist die ABSOLUTE Uhr, damit gar
// kein Erstsicht-Puls entstehen kann (getilgte Klasse).
/** Weg des Wippens (px) und seine Dauer (Ticks). */
export const CUE_BOB_PX = 2.9;
export const CUE_BOB_TICKS = 46;
/** Wie weit Licht und Staub der Marke hinterherhängen. */
export const CUE_LAG_TICKS = 5;
/** Ringe im Halo, ihre Grundhelligkeit und ihr Atem. */
export const CUE_HALO_RINGS = 4;
export const CUE_HALO_GAIN = 1.6;
export const CUE_HALO_PULSE = 0.55;
export const CUE_HALO_SWELL_PX = 1.8;
/** Die aufsteigenden Krümel. */
export const CUE_MOTE_COUNT = 7;
export const CUE_MOTE_RISE_PX = 13;
export const CUE_MOTE_TICKS = 54;
export const CUE_MOTE_ALPHA_PEAK = 0.46;

/** Der Weg des Wippens zu einem Zeitpunkt — ausgelagert, weil Halo und Staub
 *  denselben Weg um CUE_LAG_TICKS versetzt brauchen. */
const bobAt = (phase: number, reducedMotion: boolean): number =>
  reducedMotion ? 0 : Math.sin((phase / CUE_BOB_TICKS) * Math.PI * 2) * CUE_BOB_PX;

/**
 * The whole cue, in world px, centred on (x, y).
 *
 * `size` is the arrow's height; `seed` fixes the waver, so two cues on screen
 * are not identical twins and the same cue never changes between frames.
 * `phase` is the sim's ABSOLUTE tick count (never „ticks since seen").
 */
export const chalkArrow = (
  x: number,
  y: number,
  size = 11,
  seed = 1,
  phase = 0,
  reducedMotion = false,
): ChalkArrow => {
  // …und `phase` kommt hier NICHT vor: ein pro Bild neu gewürfelter Waver
  // würde kochen (siehe Kopf der Datei). Der Waver gehört dem Wesen, nicht der
  // Uhr.
  const jit = (i: number, salt: number): number =>
    (hash01(seed * 7919 + i * 131 + salt) - 0.5) * 2 * CUE_JITTER_PX * (size / 11);
  const bob = bobAt(phase, reducedMotion);
  const lagBob = bobAt(phase - CUE_LAG_TICKS, reducedMotion);
  const ay = y + bob;
  // the silhouette, once, with its waver baked in
  const base = UNIT.map((p, i) => ({
    x: x + p.x * size + jit(i, 0),
    y: ay + p.y * size + jit(i, 977),
  }));
  // …grown outward from the shape's own centre, one copy per pass
  const cx = base.reduce((s, p) => s + p.x, 0) / base.length;
  const cy = base.reduce((s, p) => s + p.y, 0) / base.length;
  const bands = BANDS.map((b) => ({
    colour: b.colour,
    alpha: b.alpha,
    pts: base.map((p) => {
      const dx = p.x - cx;
      const dy = p.y - cy;
      const d = Math.hypot(dx, dy) || 1;
      return { x: p.x + (dx / d) * b.grow, y: p.y + (dy / d) * b.grow };
    }),
  }));
  // das Licht: heller als vorher (das ganze Leuchten gipfelte bei 6,2 %), und
  // es ATMET gegenphasig zum Wippen — die Marke landet, das Licht antwortet
  const breath = reducedMotion ? 0 : -Math.sin(((phase - CUE_LAG_TICKS) / CUE_BOB_TICKS) * Math.PI * 2);
  const haloY = y + lagBob;
  const halo: CueRing[] = [];
  for (let i = 0; i < CUE_HALO_RINGS; i++) {
    halo.push({
      cx: x,
      cy: haloY,
      r: size * (0.85 + i * 0.42) + CUE_HALO_SWELL_PX * breath * (i / CUE_HALO_RINGS),
      alpha: (0.05 * (1 - i / CUE_HALO_RINGS) ** 1.2 + 0.012) * CUE_HALO_GAIN * (1 + CUE_HALO_PULSE * breath),
    });
  }
  // …und die Krümel STEIGEN. Das ist die eigentliche Lockung: ein Kind liest
  // eine Richtung, bevor es ein Zeichen liest. Seitwärts-Ort und Größe bleiben
  // am Samen — nur Höhe und Deckkraft laufen, sonst wird aus Puder ein Regen.
  const dust: CueFleck[] = [];
  for (let i = 0; i < CUE_MOTE_COUNT; i++) {
    const a = hash01(seed * 331 + i * 71) * Math.PI * 2;
    const d = size * (0.5 + hash01(seed * 53 + i * 17) * 0.55);
    const own = hash01(seed * 641 + i * 53); // jedes Korn hat seine eigene Zeit
    const u = reducedMotion
      ? (i + 0.5) / CUE_MOTE_COUNT // Endzustand: gleichmäßig verteilt, nicht unten geklumpt
      : (((phase - CUE_LAG_TICKS) / CUE_MOTE_TICKS + own) % 1 + 1) % 1;
    dust.push({
      x: x + Math.cos(a) * d,
      y: haloY + Math.sin(a) * d * 0.9 - u * CUE_MOTE_RISE_PX,
      r: 0.28 + hash01(seed * 13 + i * 29) * 0.42,
      // ein- und ausblenden, damit ein Korn auftaucht und vergeht statt zu
      // springen: Sinus über den Steigweg, gedeckelt bei „Puder, nicht Farbe"
      alpha: CUE_MOTE_ALPHA_PEAK * Math.sin(u * Math.PI) * (0.55 + 0.45 * hash01(seed * 97 + i * 41)),
    });
  }
  return { halo, bands, dust };
};

/** True when no two consecutive edges of a band are exactly axis-aligned or
 *  exactly mirrored — the machine-edge test the old cue would have failed on
 *  every one of its four edges. Exported for the test, and for any future cue
 *  that wants to prove the same thing about itself. */
export const hasNoStraightMachineEdge = (pts: readonly CuePt[]): boolean =>
  pts.every((p, i) => {
    const q = pts[(i + 1) % pts.length] as CuePt;
    return Math.abs(p.x - q.x) > 1e-6 && Math.abs(p.y - q.y) > 1e-6;
  });

// ── R5-W2 · I1 · THE TREASURE CUE ────────────────────────────────────────────
//
// Koki's replay: the Regel-Seite is „lackluster" — in the world it was an 18 px
// image with no tween, no glow and no shadow, and `ENGAGEABLE_ROLES` does not
// contain `tip`, so not even the chalk arrow above ever reached it. It sat there
// exactly as inert as the floor it sat on.
//
// This is the same instrument as `chalkArrow`, pointed at a different job, and
// it obeys the same four moves: a bob with a NAMED beat, light that LAGS the
// thing it lights, a glow that breathes counter-phase, and motes that RISE.
// What differs is the register. A cue beckons — it is a chalk arrow that says
// „press up here". A treasure does not beckon; it waits, and it is lit. So the
// beat is slower (58 ticks against 46), the halo is wider and softer, and the
// beam does not move at all: the page rises and falls INSIDE a still shaft of
// light, which is the strongest reading of the lag rule this file has.
//
// Canon: doc 41 §5 (the Regel-Seite is the chapter's prestige collectible) and
// the Rayman cookbook §6, whose readability law reserves the engine's glow
// channel for exactly one thing — „glow = collectible/hint ONLY". A rule page is
// that case, so this is the glow spending its budget where the law put it.
//
// It stays OUT of the engage path on purpose. Widening ENGAGEABLE_ROLES would
// make ↑ open a card on a page the child is supposed to simply walk into
// (serving.ts routes that set), so this is a render-layer treatment keyed on the
// role — the letters' treatment, not the cue's plumbing.

/** Travel of the page's float (px) and its beat (ticks) — slower than the
 *  cue's: a treasure breathes where a cue knocks. */
export const TREASURE_BOB_PX = 2.2;
export const TREASURE_BOB_TICKS = 58;
/** How far the light and the motes hang behind the page. */
export const TREASURE_LAG_TICKS = 6;
/** The pool of light around it. */
export const TREASURE_HALO_RINGS = 5;
export const TREASURE_HALO_GAIN = 1.5;
export const TREASURE_HALO_PULSE = 0.45;
export const TREASURE_HALO_SWELL_PX = 2.4;
/** The beam: height in page-heights, mouth and foot half-widths in page-widths,
 *  and its lean off vertical (the light in this book comes from the top left). */
export const TREASURE_SHAFT_H_MUL = 3.2;
export const TREASURE_SHAFT_MOUTH_MUL = 0.30;
export const TREASURE_SHAFT_FOOT_MUL = 0.78;
export const TREASURE_SHAFT_TILT = 0.13;
export const TREASURE_SHAFT_ALPHA = 0.13;
/** THE BACKING — a soft dark disc behind the page.
 *
 *  Prescribed by the blind look critic, which judged our sunlit hall against the
 *  reference frames and lost DECISIVELY: „gold pickups in a gold room is the base
 *  error… the highest-contrast element in the composition is a hazard, not the
 *  prize". Its fix, verbatim: „darken behind, blow out inside" — manufacture the
 *  missing value and hue separation LOCALLY instead of repainting the level.
 *
 *  It is cool (the room is warm) and it sits under the halo, so on a bright
 *  ground it cuts a hole for the page to sit in. On a DARK ground the same fill
 *  is lighter than what it covers, so it turns into a faint violet bloom instead
 *  of a black blob — which is why this is a disc behind the object and not a
 *  brightness dial: one device that cannot be wrong in either room.
 *
 *  The strength is set from the critics' own measurement, not from taste. They
 *  measured our page at mean luminance 204 against a 207 local background — the
 *  prize was DARKER than the wall — and set the target A hits: the pickup must
 *  beat its local ground, not sink into it. */
export const TREASURE_BACK_COLOUR = 0x3a3260;
export const TREASURE_BACK_ALPHA = 0.34;
export const TREASURE_BACK_RINGS = 4;
export const TREASURE_BACK_R_MUL = 0.95;

/** The contact shadow under the page.
 *
 *  MEASURED REASON, not decoration. Added light is invisible on a bright ground:
 *  in p1 (a sunlit hall) the halo below draws 905 commands a frame and cannot be
 *  seen, while in p2 (a night classroom) the same numbers read beautifully. The
 *  cookbook's readability law (§6) says what to do about that — the play plane
 *  separates by CONTRAST, not by luminosity budget — so the page also casts.
 *  A shadow subtracts, which works on any ground, and it grounds the float:
 *  without it a bobbing page reads as sliding rather than as hovering. */
export const TREASURE_SHADOW_ALPHA = 0.22;
export const TREASURE_SHADOW_RX_MUL = 0.62;
export const TREASURE_SHADOW_RY_MUL = 0.14;
/** How much the shadow tightens as the page rises — a shadow that does not
 *  answer the float is a sticker under a moving object. */
export const TREASURE_SHADOW_LIFT_GAIN = 0.16;

/** The dust standing in the beam. */
export const TREASURE_MOTE_COUNT = 9;
export const TREASURE_MOTE_RISE_PX = 20;
export const TREASURE_MOTE_TICKS = 76;
export const TREASURE_MOTE_ALPHA_PEAK = 0.40;

export interface TreasureCue {
  /** how far the PAGE is lifted this tick (px, positive = up). */
  bobPx: number;
  /** the beam as one quad, mouth first — handed to air.shaftQuads, which owns
   *  the subdivision that gives a beam no visible rim and no visible foot. */
  shaft: { points: readonly [number, number][]; alphaTop: number };
  halo: readonly CueRing[];
  /** the cool dark pool the page sits in, drawn UNDER the halo. */
  backing: readonly CueRing[];
  motes: readonly CueFleck[];
  /** the contact shadow on the floor the page stands on. */
  shadow: { cx: number; cy: number; rx: number; ry: number; alpha: number };
}

/** The page's own lift at one tick.
 *
 *  Exported separately because TWO readers need the same number — the sprite
 *  that is lifted and the light that lags it — and two derivations of one motion
 *  is how a lag silently becomes a jitter. */
export const treasureBobPx = (phase: number, seed: number, reducedMotion: boolean): number =>
  reducedMotion
    ? 0
    : Math.sin((phase / TREASURE_BOB_TICKS) * Math.PI * 2 + hash01(seed * 7919) * Math.PI * 2) * TREASURE_BOB_PX;

/**
 * The whole treasure presence, in world px.
 *
 * `x` is the page's centre and `yFoot` its UNBOBBED standing line (entities are
 * drawn origin 0.5,1); `wPx`/`hPx` are its rendered size. `phase` is the sim's
 * ABSOLUTE tick count — never „ticks since seen", or the page would pulse the
 * moment it came on screen (a retired class, see the head of this file).
 */
export const treasureCue = (
  x: number,
  yFoot: number,
  wPx: number,
  hPx: number,
  seed = 1,
  phase = 0,
  reducedMotion = false,
): TreasureCue => {
  const bob = treasureBobPx(phase, seed, reducedMotion);
  const lagBob = treasureBobPx(phase - TREASURE_LAG_TICKS, seed, reducedMotion);
  const midY = yFoot - hPx * 0.5;

  // THE BEAM. It is anchored to the FLOOR the page stands on and does not bob:
  // light does not wobble with the thing it falls on, and a still beam is what
  // makes the page's own float legible. It also STOPS at yFoot — a beam that
  // runs past the object it lights is the „straight cut across the shelf" defect
  // planShafts was written to avoid.
  const mouthHalf = (wPx * TREASURE_SHAFT_MOUTH_MUL) / 2;
  const footHalf = (wPx * TREASURE_SHAFT_FOOT_MUL) / 2;
  const len = hPx * TREASURE_SHAFT_H_MUL;
  const drop = Math.tan(TREASURE_SHAFT_TILT) * len;
  const shaft = {
    points: [
      [x - drop - mouthHalf, yFoot - len],
      [x - drop + mouthHalf, yFoot - len],
      [x + footHalf, yFoot],
      [x - footHalf, yFoot],
    ] as readonly [number, number][],
    alphaTop: TREASURE_SHAFT_ALPHA,
  };

  // THE GLOW, breathing against the float — one bell-strike, not two wobbles.
  const breath = reducedMotion ? 0 : -Math.sin(((phase - TREASURE_LAG_TICKS) / TREASURE_BOB_TICKS) * Math.PI * 2);
  const haloY = midY + lagBob;
  const halo: CueRing[] = [];
  for (let i = 0; i < TREASURE_HALO_RINGS; i++) {
    halo.push({
      cx: x,
      cy: haloY,
      r: hPx * (0.5 + i * 0.30) + TREASURE_HALO_SWELL_PX * breath * (i / TREASURE_HALO_RINGS),
      alpha: (0.048 * (1 - i / TREASURE_HALO_RINGS) ** 1.2 + 0.010) * TREASURE_HALO_GAIN * (1 + TREASURE_HALO_PULSE * breath),
    });
  }

  // THE BACKING, feathered outward from the page's middle. Same lagged anchor as
  // the halo: light and shade belong to each other.
  const backing: CueRing[] = [];
  for (let i = 0; i < TREASURE_BACK_RINGS; i++) {
    backing.push({
      cx: x,
      cy: haloY,
      r: hPx * TREASURE_BACK_R_MUL * (1 + i * 0.30),
      alpha: (TREASURE_BACK_ALPHA / TREASURE_BACK_RINGS) * (1 - i / TREASURE_BACK_RINGS) ** 0.8,
    });
  }

  // THE DUST standing in the beam. Sideways place and size belong to the seed;
  // only height and alpha run, or powder becomes rain.
  const motes: CueFleck[] = [];
  for (let i = 0; i < TREASURE_MOTE_COUNT; i++) {
    const own = hash01(seed * 641 + i * 53);
    const u = reducedMotion
      ? (i + 0.5) / TREASURE_MOTE_COUNT
      : (((phase - TREASURE_LAG_TICKS) / TREASURE_MOTE_TICKS + own) % 1 + 1) % 1;
    const spread = (hash01(seed * 331 + i * 71) - 0.5) * wPx * 1.15;
    motes.push({
      x: x + spread,
      y: haloY + hPx * 0.35 - u * TREASURE_MOTE_RISE_PX,
      r: 0.30 + hash01(seed * 13 + i * 29) * 0.45,
      alpha: TREASURE_MOTE_ALPHA_PEAK * Math.sin(u * Math.PI) * (0.55 + 0.45 * hash01(seed * 97 + i * 41)),
    });
  }
  // THE CONTACT SHADOW, answering the float: higher page → smaller, fainter
  // pool. Anchored to yFoot, never to the bobbed body, or the shadow would
  // float too and the page would read as sliding.
  const rise = bob / TREASURE_BOB_PX; // −1…1 (0 under reduced motion, where bob is 0)
  const tighten = 1 - TREASURE_SHADOW_LIFT_GAIN * rise;
  const shadow = {
    cx: x,
    cy: yFoot,
    rx: wPx * TREASURE_SHADOW_RX_MUL * tighten,
    ry: hPx * TREASURE_SHADOW_RY_MUL * tighten,
    alpha: TREASURE_SHADOW_ALPHA * tighten,
  };
  return { bobPx: bob, shaft, halo, backing, motes, shadow };
};
