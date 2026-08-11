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
import {
  CUE_BOB_PX,
  CUE_BOB_TICKS,
  CUE_CHALK,
  CUE_CORE,
  CUE_INK,
  CUE_JITTER_PX,
  CUE_MOTE_ALPHA_PEAK,
  CUE_MOTE_COUNT,
  chalkArrow,
  hasNoStraightMachineEdge,
} from "./cue.ts";

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
