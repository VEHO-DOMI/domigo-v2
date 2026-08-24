// R5-T6 · DER AUGEN-BODEN, GERECHNET STATT GEGLAUBT.
//
// Warum diese Datei existiert: die Geometrie des Bodens stand bis T6 NUR im
// Rumpf von `PaintScene#renderFaceFloor` — nicht prüfbar, und jedes
// Sitzungs-Lineal musste sie abschreiben. Genau daran ist die Prämisse von R229
// zerbrochen: aus »der Boden räumt 37–47 % der KREIDE weg« wurde über drei
// Blätter hinweg »der Boden verdeckt 37–47 % des GESICHTS«, und niemand konnte
// es an einer Zeile nachschlagen.
//
// ⚠ WAS DIESE DATEI NICHT BEHAUPTET: sie prüft die ZAHLEN, nicht das Bild. Ob
//   ein Kind ein Gesicht sieht, entscheidet das blinde Panel — nicht ein Test.
import { describe, expect, it } from "vitest";
import { faceFloorHalbachsen, faceFloorOeffnung } from "./face-floor.ts";

describe("R5-T6 · die Öffnung des Augen-Bodens", () => {
  it("steht bei Betreten der Arena (nichts gewischt) auf null", () => {
    expect(faceFloorOeffnung(0)).toBe(0);
  });

  it("ist bei ganz gewischter Tafel voll offen", () => {
    expect(faceFloorOeffnung(1)).toBe(1);
  });

  it("ist VORDERLASTIG: der erste Wisch gibt mehr frei als sein Drittel", () => {
    // das ist die zweite Stellgröße des T6-Interims (»früher öffnen«).
    // Linear wären es 1/3 = 0,333; √(1/3) = 0,577.
    expect(faceFloorOeffnung(1 / 3)).toBeGreaterThan(1 / 3);
    expect(faceFloorOeffnung(1 / 3)).toBeCloseTo(0.5774, 4);
    expect(faceFloorOeffnung(2 / 3)).toBeCloseTo(0.8165, 4);
  });

  it("wächst überall, springt nirgends", () => {
    let vorher = -1;
    for (let i = 0; i <= 100; i++) {
      const o = faceFloorOeffnung(i / 100);
      expect(o).toBeGreaterThan(vorher);
      vorher = o;
    }
  });

  it("fängt Werte außerhalb 0…1 ab, statt eine Wurzel aus Minus zu ziehen", () => {
    expect(faceFloorOeffnung(-4)).toBe(0);
    expect(faceFloorOeffnung(9)).toBe(1);
    expect(Number.isNaN(faceFloorOeffnung(-1))).toBe(false);
  });
});

describe("R5-T6 · die Halbachsen des Augen-Bodens", () => {
  it("stehen bei voller Lebensanzeige auf dem T6-Maß 0,52 × 0,38", () => {
    // Das ist der Arena-Moment: er hängt am MASS, nicht an der Kurve.
    const { rx, ry } = faceFloorHalbachsen(0);
    expect(rx).toBeCloseTo(0.52, 10);
    expect(ry).toBeCloseTo(0.38, 10);
  });

  it("stehen bei sauberer Tafel auf der ganzen Fläche", () => {
    const { rx, ry } = faceFloorHalbachsen(1);
    expect(rx).toBeCloseTo(0.75, 10);
    expect(ry).toBeCloseTo(0.75, 10);
  });

  it("decken den Arena-Moment über beide Augen-Gipfel des gemessenen Profils", () => {
    // Profil aus dem Kommentarblock: Spalten-Gipfel 0,35–0,45 und 0,60–0,70,
    // Zeilen-Gipfel der Augen 0,40–0,55, Mund 0,65–0,75 — Mitte (0,52 / 0,45).
    const { rx, ry } = faceFloorHalbachsen(0);
    const links = 0.52 - rx, rechts = 0.52 + rx;
    const oben = 0.45 - ry, unten = 0.45 + ry;
    expect(links).toBeLessThan(0.35);
    expect(rechts).toBeGreaterThan(0.70);
    expect(oben).toBeLessThan(0.40);
    expect(unten).toBeGreaterThan(0.75);
  });

  it("ist an JEDEM Halt mindestens so gross wie der ausgelieferte Stand vor T6", () => {
    // Der ausgelieferte Stand war 0,42 / 0,34 mit LINEARER Öffnung. Das Interim
    // darf an keinem Moment dahinter zurückfallen — sonst stünde wieder Kreide
    // über der Augenpartie, und genau das war der umgedrehte Weg.
    for (const frei of [0, 1 / 3, 0.5, 2 / 3, 1]) {
      const alt = { rx: 0.42 + (0.75 - 0.42) * frei, ry: 0.34 + (0.75 - 0.34) * frei };
      const neu = faceFloorHalbachsen(frei);
      expect(neu.rx).toBeGreaterThanOrEqual(alt.rx);
      expect(neu.ry).toBeGreaterThanOrEqual(alt.ry);
    }
  });
});
