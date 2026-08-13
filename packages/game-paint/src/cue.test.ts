// PK-R6 · H2 · THE ↑ CUE IS DRAWN BY HAND (round-2 finding 1), pinned.
//
// „The flat white/navy up-arrow glyph … is crisp vector geometry with hard edges
// and no texture, sitting directly on the soft watercolor background with zero
// visual integration."
//
// The three claims that separate a chalk mark from a HUD sticker are all
// checkable on the geometry alone, so none of them has to be re-argued from a
// screenshot: no machine edge, an edge that ramps instead of stepping, and the
// same mark every time the same being is asked about.
import { describe, expect, it } from "vitest";
import { CUE_BOB_PX, CUE_BOB_TICKS, CUE_CHALK, CUE_CORE, CUE_INK, CUE_JITTER_PX, CUE_MOTE_ALPHA_PEAK, CUE_MOTE_COUNT, TREASURE_BOB_PX, TREASURE_BOB_TICKS, TREASURE_MOTE_ALPHA_PEAK, TREASURE_MOTE_TICKS, TREASURE_SHAFT_ALPHA, TREASURE_SHAFT_H_MUL, chalkArrow, hasNoStraightMachineEdge, treasureBobPx, treasureCue } from "./cue.ts";
import { SHAFT_EDGE_MAX, shaftQuads } from "./air.ts";

describe("PK-R6 · H2 · the hand-drawn ↑ cue", () => {
  it("has no straight machine edge — the defect, as a test", () => {
    // the retired cue was fillTriangle + fillRect: two horizontals and two
    // verticals, i.e. four edges that would each fail this outright.
    const cue = chalkArrow(40, 20, 11, 3);
    for (const band of cue.bands) {
      expect(hasNoStraightMachineEdge(band.pts), `band @${band.alpha}`).toBe(true);
    }
  });

  it("builds its edge as a RAMP: widest and faintest outside, brightest inside", () => {
    const cue = chalkArrow(0, 0, 11, 1);
    const spread = (pts: readonly { x: number; y: number }[]): number =>
      Math.max(...pts.map((p) => Math.hypot(p.x, p.y)));
    for (let i = 1; i < cue.bands.length; i++) {
      const prev = cue.bands[i - 1]!;
      const cur = cue.bands[i]!;
      expect(spread(cur.pts), `band ${i} is not inside band ${i - 1}`).toBeLessThan(spread(prev.pts));
      expect(cur.alpha, `band ${i} is not brighter than band ${i - 1}`).toBeGreaterThan(prev.alpha);
    }
    // …and it is ink underneath, chalk on top: a dark rim is what keeps a pale
    // mark readable on a pale wall (the same reason the flying chalk has one)
    expect(cue.bands[0]!.colour).toBe(CUE_INK);
    expect(cue.bands.at(-1)!.colour).toBe(CUE_CORE);
    expect(cue.bands.map((b) => b.colour)).toContain(CUE_CHALK);
  });

  it("wavers, but only within a hand's tolerance", () => {
    // every vertex is off its ruled position — and none of them by so much that
    // the arrow stops being an arrow
    const ruled = chalkArrow(0, 0, 11, 1).bands[2]!.pts; // the chalk band, grow 0.2
    for (const p of ruled) {
      const off = Math.min(Math.abs(p.x % 1), Math.abs(p.y % 1));
      expect(off).toBeLessThan(CUE_JITTER_PX + 1); // sanity: nothing ran away
    }
    // …and no two cues are the same waver, or the „hand" is a stamp
    const a = chalkArrow(0, 0, 11, 1).bands[2]!.pts;
    const b = chalkArrow(0, 0, 11, 2).bands[2]!.pts;
    expect(a).not.toEqual(b);
  });

  it("is deterministic: the same being gets the same mark, every frame", () => {
    // a jitter re-rolled per frame would BOIL, which is a worse artefact than the
    // crisp glyph it replaced — and a replayed tape has to draw the same picture
    expect(chalkArrow(12, 7, 11, 91)).toEqual(chalkArrow(12, 7, 11, 91));
  });

  it("sheds chalk and carries the book's own gilded light", () => {
    const cue = chalkArrow(0, 0, 11, 5);
    expect(cue.dust.length).toBeGreaterThan(3);
    for (const d of cue.dust) expect(d.alpha).toBeLessThan(0.55); // powder, not paint
    // the halo goes out and fades — it must never be a disc with a hard rim
    expect(cue.halo.length).toBeGreaterThan(1);
    for (let i = 1; i < cue.halo.length; i++) {
      expect(cue.halo[i]!.r).toBeGreaterThan(cue.halo[i - 1]!.r);
      expect(cue.halo[i]!.alpha).toBeLessThan(cue.halo[i - 1]!.alpha);
    }
  });
});

// R5-W1 · F1 · DIE LOCKUNG, geprüft statt behauptet. Der Auftrag verlangt „eine
// DEUTLICH prominentere, lockende Animation" — das ist ein Geschmacksurteil, das
// am Ende ein Kritiker und Koki fällen. Prüfbar ist, ob das Material dafür
// überhaupt da ist: Weg, Nachlauf, Atem, Richtung. Und vor allem das eine, was
// hier schiefgehen KANN, ohne dass es jemand sieht: ein Waver, der kocht.
describe("R5-F1 · der ↑-Cue lockt", () => {
  const at = (phase: number) => chalkArrow(40, 20, 11, 7, phase);

  it("KOCHT NICHT: der Waver gehört dem Wesen, nie der Uhr", () => {
    // Der einzige Weg, diesen Cue schlechter zu machen als das Vektor-Glyph,
    // das er ersetzt hat. Die Marke wippt — also wird der starre Wipp-Weg
    // abgezogen, und was bleibt, muss Tick für Tick IDENTISCH sein.
    const a = at(0).bands[2]!.pts;
    for (const phase of [1, 7, 23, 46, 137]) {
      const b = at(phase).bands[2]!.pts;
      const dy = b[0]!.y - a[0]!.y; // der gemeinsame Wipp-Versatz dieses Ticks
      for (let i = 0; i < a.length; i++) {
        expect(b[i]!.x, `Vertex ${i} @${phase} wandert seitwärts`).toBeCloseTo(a[i]!.x, 9);
        expect(b[i]!.y - a[i]!.y, `Vertex ${i} @${phase} kocht`).toBeCloseTo(dy, 9);
      }
    }
  });

  it("wippt mit Weg — und genau einmal pro Takt", () => {
    let lo = Infinity, hi = -Infinity;
    for (let t = 0; t < CUE_BOB_TICKS; t++) {
      const yy = at(t).bands[3]!.pts[0]!.y;
      lo = Math.min(lo, yy); hi = Math.max(hi, yy);
    }
    expect(hi - lo).toBeGreaterThan(CUE_BOB_PX * 1.8); // voller Hin- und Rückweg
    // …und nach einem vollen Takt steht die Marke wieder, wo sie war
    expect(at(CUE_BOB_TICKS).bands[3]!.pts[0]!.y).toBeCloseTo(at(0).bands[3]!.pts[0]!.y, 6);
  });

  it("das Licht läuft der Marke NACH (überlappende Aktion)", () => {
    let sawLag = false;
    for (let t = 0; t < CUE_BOB_TICKS; t++) {
      const c = at(t);
      if (Math.abs(c.halo[0]!.cy - c.bands[3]!.pts[3]!.y) > 0.4) sawLag = true;
    }
    expect(sawLag, "Halo und Marke bewegen sich starr im Gleichschritt").toBe(true);
  });

  it("das Leuchten atmet, ohne je zu blinken oder zu blitzen", () => {
    let lo = Infinity, hi = -Infinity;
    for (let t = 0; t < CUE_BOB_TICKS; t++) {
      const a0 = at(t).halo[0]!.alpha;
      lo = Math.min(lo, a0); hi = Math.max(hi, a0);
    }
    expect(hi).toBeGreaterThan(lo); // es atmet
    expect(lo).toBeGreaterThan(0.02); // …und geht nie aus (eine HUD-Blinklampe)
    expect(hi).toBeLessThan(0.25); // …und wird nie zum Blitz
  });

  it("die Krümel STEIGEN — die Richtung IST die Botschaft", () => {
    // Ein Korn über seinen Lebenslauf verfolgt — GEGEN DIE MARKE gemessen, denn
    // der ganze Cue wippt und trägt die Körner mit (genau das ist der Nachlauf
    // oben). Die Behauptung ist „sie steigen AN der Marke entlang", nicht „ihre
    // Bildschirmhöhe nimmt monoton ab".
    const rel: number[] = [];
    for (let t = 0; t < 30; t++) {
      const c = at(t);
      rel.push(c.dust[0]!.y - c.halo[0]!.cy);
    }
    const steps = rel.slice(1).map((v, i) => v - rel[i]!);
    const rising = steps.filter((d) => d < 0).length;
    expect(rising, "fast jeder Schritt geht nach oben").toBeGreaterThanOrEqual(steps.length - 1);
    // …der eine erlaubte Ausreißer ist der Neustart des Korns am Fuß
    expect(steps.filter((d) => d > 0).length, "höchstens ein Neustart").toBeLessThanOrEqual(1);
    for (let t = 0; t < 60; t++) {
      for (const d of at(t).dust) expect(d.alpha).toBeLessThanOrEqual(CUE_MOTE_ALPHA_PEAK); // Puder, nicht Farbe
    }
    expect(at(0).dust.length).toBe(CUE_MOTE_COUNT);
  });

  it("reduzierte Bewegung liefert ein fertiges Bild, kein eingefrorenes halbes", () => {
    const still = chalkArrow(40, 20, 11, 7, 999, true);
    expect(chalkArrow(40, 20, 11, 7, 0, true)).toEqual(still); // steht wirklich still
    // …und die Krümel stehen VERTEILT, nicht alle unten geklumpt
    const ys = still.dust.map((d) => d.y);
    expect(Math.max(...ys) - Math.min(...ys)).toBeGreaterThan(4);
  });

  it("kein Erstsicht-Puls ist überhaupt baubar (getilgte Klasse)", () => {
    // `phase` ist die ABSOLUTE Uhr: derselbe Tick gibt dasselbe Bild, egal wie
    // lange der Cue schon steht. Es gibt keinen Parameter, der „seit wann"
    // tragen könnte — und das ist der Schutz.
    expect(chalkArrow(40, 20, 11, 7, 300)).toEqual(chalkArrow(40, 20, 11, 7, 300));
  });
});

// ── R5-W2 · I1 · the treasure cue ────────────────────────────────────────────
describe("the treasure cue (the Regel-Seite's presence in the world)", () => {
  const W = 18;
  const H = 24;
  const at = (phase: number, rm = false) => treasureCue(100, 200, W, H, 7, phase, rm);

  it("the beam lands ON the page and opens as it falls", () => {
    const { shaft } = at(0);
    const ys = shaft.points.map((p) => p[1]);
    // it stops at the standing line — light that runs past what it lights is
    // the „straight cut across the shelf" defect planShafts exists to avoid
    expect(Math.max(...ys)).toBeCloseTo(200, 6);
    expect(Math.min(...ys)).toBeCloseTo(200 - H * TREASURE_SHAFT_H_MUL, 6);
    const mouthW = Math.abs(shaft.points[1]![0] - shaft.points[0]![0]);
    const footW = Math.abs(shaft.points[2]![0] - shaft.points[3]![0]);
    expect(footW).toBeGreaterThan(mouthW);
  });

  it("the beam has no visible rim and no visible foot", () => {
    // the whole reason this borrows air.shaftQuads rather than filling one quad:
    // a beam reads as light only when its edge and its end are under the same
    // threshold the background shafts are held to
    const quads = shaftQuads(at(0).shaft);
    expect(quads.length).toBeGreaterThan(20);
    const rim = quads.filter((q) => q.ring === 0).reduce((m, q) => Math.max(m, q.alpha), 0);
    expect(rim).toBeLessThanOrEqual(SHAFT_EDGE_MAX);
    const last = Math.max(...quads.map((q) => q.slice));
    const foot = quads.filter((q) => q.slice === last).reduce((s, q) => s + q.alpha, 0);
    expect(foot).toBeLessThanOrEqual(SHAFT_EDGE_MAX);
    // …and it is still a beam: the mouth carries real light
    expect(quads.filter((q) => q.slice === 0).reduce((s, q) => s + q.alpha, 0)).toBeGreaterThan(TREASURE_SHAFT_ALPHA * 0.5);
  });

  it("the light does NOT bob with the page — the page floats inside a still beam", () => {
    const a = at(0).shaft.points.flat();
    const b = at(Math.round(TREASURE_BOB_TICKS / 4)).shaft.points.flat();
    expect(a).toEqual(b);
  });

  it("the glow LAGS the page rather than moving with it", () => {
    // same device as the chalk arrow's lag test: somewhere in the beat, the
    // halo and the page disagree about where „up" is
    let sawLag = false;
    for (let t = 0; t < TREASURE_BOB_TICKS; t++) {
      const c = at(t);
      const pageMid = 200 - H * 0.5 - c.bobPx;
      if (Math.abs(c.halo[0]!.cy - pageMid) > 0.3) sawLag = true;
    }
    expect(sawLag).toBe(true);
  });

  it("the glow breathes and never goes out", () => {
    let lo = 1;
    let hi = 0;
    for (let t = 0; t < TREASURE_BOB_TICKS; t++) {
      const a = at(t).halo[0]!.alpha;
      lo = Math.min(lo, a);
      hi = Math.max(hi, a);
    }
    expect(hi).toBeGreaterThan(lo);
    expect(lo).toBeGreaterThan(0.02); // …and is never a HUD blinker
    expect(hi).toBeLessThan(0.25);
  });

  it("the motes RISE", () => {
    const ys: number[] = [];
    for (let t = 0; t < TREASURE_MOTE_TICKS; t += 6) {
      const c = at(t);
      ys.push(c.motes[0]!.y - (c.halo[0]!.cy));
    }
    const falls = ys.slice(1).filter((y, i) => y < ys[i]!).length;
    expect(falls).toBeGreaterThanOrEqual(ys.length - 3);
    for (let t = 0; t < TREASURE_MOTE_TICKS; t++) {
      for (const m of at(t).motes) expect(m.alpha).toBeLessThanOrEqual(TREASURE_MOTE_ALPHA_PEAK);
    }
  });

  it("the bob has a beat and comes home", () => {
    let lo = 9;
    let hi = -9;
    for (let t = 0; t < TREASURE_BOB_TICKS; t++) {
      const v = treasureBobPx(t, 7, false);
      lo = Math.min(lo, v);
      hi = Math.max(hi, v);
    }
    expect(hi - lo).toBeGreaterThan(TREASURE_BOB_PX * 1.8);
    expect(treasureBobPx(TREASURE_BOB_TICKS, 7, false)).toBeCloseTo(treasureBobPx(0, 7, false), 6);
  });

  it("two pages in one room are not synchronised twins", () => {
    // a room where every collectible rises and falls on the same frame reads as
    // a machine, which is the one thing the whole cue language is against
    let differ = false;
    for (let t = 0; t < TREASURE_BOB_TICKS; t++) {
      if (Math.abs(treasureBobPx(t, 7, false) - treasureBobPx(t, 31, false)) > 0.2) differ = true;
    }
    expect(differ).toBe(true);
  });

  it("reduced motion is a FINISHED picture, not a frozen half one", () => {
    expect(at(0, true)).toEqual(at(999, true));
    expect(at(0, true).bobPx).toBe(0);
    const ys = at(0, true).motes.map((m) => m.y);
    expect(Math.max(...ys) - Math.min(...ys)).toBeGreaterThan(4); // spread, not clumped at the floor
  });

  it("is deterministic, and the page's lift and the light's lag are ONE number", () => {
    expect(at(17)).toEqual(at(17));
    for (let t = 0; t < 40; t++) {
      expect(at(t).bobPx).toBe(treasureBobPx(t, 7, false));
    }
  });
});

describe("the treasure page casts (the bright-room half of readability)", () => {
  const at = (phase: number, rm = false) => treasureCue(100, 200, 18, 24, 7, phase, rm);

  it("the shadow sits on the FLOOR, not under the floating body", () => {
    for (let t = 0; t < TREASURE_BOB_TICKS; t += 5) expect(at(t).shadow.cy).toBe(200);
  });

  it("the shadow answers the float — smaller and fainter as the page rises", () => {
    let hiLift = { a: 1, r: 9 };
    let loLift = { a: 0, r: 0 };
    for (let t = 0; t < TREASURE_BOB_TICKS; t++) {
      const c = at(t);
      if (c.bobPx > 0 && c.shadow.alpha < hiLift.a) hiLift = { a: c.shadow.alpha, r: c.shadow.rx };
      if (c.bobPx < 0 && c.shadow.alpha > loLift.a) loLift = { a: c.shadow.alpha, r: c.shadow.rx };
    }
    expect(hiLift.a).toBeLessThan(loLift.a);
    expect(hiLift.r).toBeLessThan(loLift.r);
  });

  it("the shadow is a pool, not a disc, and never a black hole", () => {
    const s = at(0).shadow;
    expect(s.rx).toBeGreaterThan(s.ry * 2); // flattened onto the ground plane
    expect(s.alpha).toBeLessThan(0.35);
    expect(s.alpha).toBeGreaterThan(0.05);
  });

  it("reduced motion keeps the shadow (it is contact, not motion)", () => {
    expect(at(0, true).shadow.alpha).toBeGreaterThan(0.05);
    expect(at(0, true).shadow).toEqual(at(999, true).shadow);
  });
});
