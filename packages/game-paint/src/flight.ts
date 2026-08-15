// THE PAINTED BOOK — PK-R6 · E · THE FLYING TAFEL'S PATHS (doc 44 §4 ch01 C4:
// „she hovers above the arena tracing readable paths — spirals, figure-eights,
// zigzags").
//
// WHY A MODULE OF ITS OWN. A path is the one part of a boss that a child has to
// LEARN — the passover asks for readable, child-fair flight, and readable means
// the same shape every time. So the paths are pure closed-form functions of one
// normalised phase u ∈ [0,1): no integration, no accumulated drift, no state to
// desync. Tick n always yields the same point, which is what lets the proof tape
// replay byte-identically and what lets the shapes be asserted as a TABLE in a
// unit test rather than eyeballed in a playtest.
//
// Every path is CLOSED (offset at u=1 equals offset at u=0) so she can trace it
// forever without a seam, and every path is expressed as a fraction of two
// amplitudes so the arena — not the maths — decides how big the shape is.

/** The shapes, gentlest first. Index = the knot the child is on. */
export type FlightPath = "spiral" | "eight" | "zigzag" | "clover" | "bolt";

/**
 * doc 44 §4 ch01 C4 names the first three, in this order of escalation. Knot 1
 * is the gentlest: one slow circle that breathes in and out. Knot 2 crosses
 * itself. Knot 3 is the only one with corners.
 *
 * ── R5-W4 · H2 · WARUM ES JETZT FÜNF SIND (D-83) ────────────────────────────
 * Diese Liste war DREI Einträge lang, und `knotIndex` klemmte auf 2. Für ch01
 * (Stufe E, drei Schichten) war das folgenlos — für die Stufen M und S nicht:
 * ihre vierte und fünfte Schicht bekamen die Bahn, die Spannweite, die Periode
 * und die Wurfrate der DRITTEN, also eine Eskalation, die genau dort aufhört,
 * wo sie am nötigsten wäre. Ein Kapitel, das M oder S stellt, hätte einen Boss
 * geliefert, der ab der Mitte nicht mehr härter wird, und niemand hätte es
 * gemerkt, weil kein Gesetz danach fragte.
 *
 * Die beiden neuen Bahnen setzen die Reihe fort, statt sie zu wiederholen:
 * `clover` nimmt dem Achter seine EINE Kreuzung und macht vier daraus (mehr
 * Durchgänge durch die Mitte = weniger sichere Standplätze), `bolt` nimmt dem
 * Zickzack seine gleichmäßigen Zähne (die Höhe wechselt, also lässt sich der
 * nächste Zahn nicht mehr aus dem letzten ablesen). Beide sind geschlossen,
 * beide bleiben in ihren Amplituden — dieselben zwei Eigenschaften, die die
 * ersten drei prüfbar machen.
 */
export const KNOT_PATHS: readonly FlightPath[] = ["spiral", "eight", "zigzag", "clover", "bolt"] as const;

const TAU = Math.PI * 2;

/** 0 → 1 → 0 across one phase. The zigzag's building block, and the spiral's
 *  breath. Linear on purpose: constant speed with a sharp reversal is what makes
 *  a corner read AS a corner. */
const tri = (u: number): number => 1 - Math.abs(2 * (u - Math.floor(u)) - 1);

/** How far the spiral pulls in at its tightest, as a fraction of full radius.
 *  0.55 leaves a visibly smaller loop at the middle of the pass without ever
 *  collapsing to a point — a spiral that reaches zero reads as a stall. */
export const SPIRAL_PINCH = 0.55;
/** How many vertical teeth the zigzag cuts per horizontal sweep. Four is the
 *  most a 60-px band can hold and still read at 1× (six turns the sweep into a
 *  vibration). */
export const ZIG_TEETH = 4;
/** R5-W4 · H2 (D-83): wie hoch der KURZE Zahn des `bolt` ausfällt, als Anteil
 *  am vollen. 0.45 ist knapp unter der Hälfte — deutlich genug, dass ein Kind
 *  den Unterschied im Vorbeifliegen sieht, hoch genug, dass der kurze Zahn nicht
 *  als »sie hat ausgesetzt« gelesen wird. */
export const BOLT_SHORT = 0.45;

/**
 * Where the guardian sits relative to her flight centre, at phase `u`, as
 * FRACTIONS of the two amplitudes (−1 … 1). Pure, closed-form, closed-loop.
 *
 *  · spiral — one full turn (θ = 2πu) whose radius breathes 1 → 1−PINCH → 1, so
 *    she winds in and back out again over the pass.
 *  · eight  — the 1:2 Lissajous (x = sin θ, y = sin 2θ): the figure-eight lying
 *    on its side, crossing itself at the centre.
 *  · zigzag — a linear sweep right across the band and back (x = 2·tri(u) − 1)
 *    with ZIG_TEETH sharp climbs and dives stacked on it.
 *  · clover — the 1:3 Lissajous (x = sin θ, y = sin 3θ): the eight with a second
 *    lobe, so she passes through the centre four times per pass instead of two.
 *  · bolt   — the zigzag with alternating tooth height (BOLT_SHORT on every
 *    other tooth), so the next tooth can no longer be read off the last one.
 */
export const flightUnitAt = (path: FlightPath, u: number): { fx: number; fy: number } => {
  const p = u - Math.floor(u); // phase, always in [0,1)
  if (path === "spiral") {
    const th = TAU * p;
    const k = 1 - SPIRAL_PINCH * tri(p);
    return { fx: Math.cos(th) * k, fy: Math.sin(th) * k };
  }
  if (path === "eight") {
    const th = TAU * p;
    return { fx: Math.sin(th), fy: Math.sin(2 * th) };
  }
  if (path === "clover") {
    const th = TAU * p;
    return { fx: Math.sin(th), fy: Math.sin(3 * th) };
  }
  if (path === "bolt") {
    // Dieselbe Säge wie der Zickzack, aber jeder zweite Zahn bleibt kurz. Die
    // Zahn-NUMMER entscheidet, nicht die Zeit, damit die Form geschlossen
    // bleibt: bei einer geraden Zähnezahl steht am Ende derselbe Zahn wie am
    // Anfang. (ZIG_TEETH ist 4 — deshalb ist das hier keine Annahme, sondern
    // eine Bedingung, die `flight.test.ts` als Geschlossenheit mitprüft.)
    const tooth = Math.floor(ZIG_TEETH * p);
    const height = tooth % 2 === 0 ? 1 : BOLT_SHORT;
    return { fx: 2 * tri(p) - 1, fy: (2 * tri(ZIG_TEETH * p) - 1) * height };
  }
  return { fx: 2 * tri(p) - 1, fy: 2 * tri(ZIG_TEETH * p) - 1 };
};

/** Which path this knot flies. `hp` counts DOWN (full hp = the first knot), so
 *  the index is derived rather than tracked — one number, no second counter to
 *  drift out of step with the knots the HUD is showing. */
export const pathForKnot = (hp: number, knots: number): FlightPath => {
  const idx = Math.min(Math.max(knots - hp, 0), KNOT_PATHS.length - 1);
  return KNOT_PATHS[idx] ?? "spiral";
};

/** The same index, for every other per-knot dial (period, throw rate, telegraph).
 *  0 = the first knot. */
export const knotIndex = (hp: number, knots: number): number =>
  Math.min(Math.max(knots - hp, 0), KNOT_PATHS.length - 1);
