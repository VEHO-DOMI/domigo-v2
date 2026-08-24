// ── R5-T5 · R227 · DER FARBTON-INTERIM DER KREIDE, AN DEN BLAETTERN GEPRUEFT ─
//
// WARUM ES DIESE BATTERIE GIBT. `SCRIBBLE_TINTS` ist eine Eichung: drei Zahlen,
// die behaupten, die Kreide aus dem Farb-Fenster des GESICHTS zu tragen. Eine
// Eichung ohne Attrappen ist eine Behauptung (D-693 — T4s teuerster Fund: wer
// eine Grenze bewegt, ohne ihre Attrappen mitzubewegen, macht den Selbsttest
// still blind). Also stehen die Attrappen hier, und sie stehen auf ZAHLEN aus
// den echten Blaettern, nicht auf Worten.
//
// WARUM UEBER DEN QUELLTEXT UND NICHT UEBER EINEN IMPORT. `PaintScene.ts` zieht
// Phaser herein; keine Batterie dieses Pakets importiert sie deshalb. Denselben
// Weg geht `fight-drive.test.ts` seit R209d: eine reine Funktion ueber den TEXT,
// damit der Tamper an einer KOPIE laufen kann.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const SRC = path.dirname(fileURLToPath(import.meta.url));

/** Die zwei Formeln des Gesichts — WOERTLICH aus `docs/art/import-batch-aq13.mjs`
 *  (Z. 492/526/527). Sie sind hier kopiert, weil dieses Paket das Importeur-
 *  Skript nicht laden kann; jede Abweichung waere ein zweites Lineal fuer
 *  dieselbe Zahl (R216 — dreimal bezahlt). */
const lum = (r: number, g: number, b: number): number => 0.2126 * r + 0.7152 * g + 0.0722 * b;
const satS = (r: number, g: number, b: number): number => {
  const mx = Math.max(r, g, b) / 255, mn = Math.min(r, g, b) / 255;
  if (mx === mn) return 0;
  const l = (mx + mn) / 2, d = mx - mn;
  return l < 0.5 ? d / (mx + mn) : d / (2 - mx - mn);
};
const FACE_L = 240, FACE_S = 0.10;
/** »so weiss wie das Gesicht« — BEIDE Bedingungen, wie im Importeur. */
const gesichtsWeiss = (r: number, g: number, b: number): boolean =>
  lum(r, g, b) > FACE_L && satS(r, g, b) < FACE_S;
/** Phasers `setTint` MULTIPLIZIERT (anim.ts Z. 48). */
const getoent = ([r, g, b]: readonly [number, number, number], t: number): [number, number, number] => [
  Math.round((r * ((t >> 16) & 255)) / 255),
  Math.round((g * ((t >> 8) & 255)) / 255),
  Math.round((b * (t & 255)) / 255),
];

/** Die Toene aus dem QUELLTEXT lesen — als reine Funktion, damit der Tamper
 *  an einer Kopie laufen kann. */
export const tintsAus = (src: string): number[] => {
  const m = /const SCRIBBLE_TINTS: readonly number\[\] = \[([^\]]*)\];/.exec(src);
  if (m === null) return [];
  return m[1]!.split(",").map((s) => Number(s.trim())).filter((n) => Number.isFinite(n));
};

/** …und ob der Ton ueberhaupt AUFGETRAGEN wird. Eine Konstante, die niemand
 *  liest, ist eine tote Zahl, und eine tote Zahl besteht jede Attrappe. */
export const wirdAufgetragen = (src: string): boolean =>
  /s\.setTint\(SCRIBBLE_TINTS\[i\]/.test(src.replace(/^\s*\/\/.*$/gm, ""));

/**
 * DIE ATTRAPPEN: die schlimmsten gesichts-weissen Kreide-Pixel, je Blatt am
 * gelieferten Bild gemessen (T5; die Werte sind aus dem Blatt GELESEN, nicht
 * gewaehlt). Die Anzahl dahinter ist ihre Haeufigkeit auf diesem Blatt.
 */
const ATTRAPPEN: ReadonlyArray<{ schicht: number; blatt: string; px: readonly [number, number, number]; n: number }> = [
  { schicht: 0, blatt: "tafel_scribble1", px: [255, 255, 255], n: 17 },
  { schicht: 0, blatt: "tafel_scribble1", px: [249, 250, 249], n: 5 },
  { schicht: 1, blatt: "tafel_scribble2", px: [252, 252, 252], n: 388 },
  { schicht: 1, blatt: "tafel_scribble2", px: [251, 251, 251], n: 144 },
  { schicht: 2, blatt: "tafel_scribble3", px: [246, 246, 246], n: 88 },
  { schicht: 2, blatt: "tafel_scribble3", px: [247, 247, 247], n: 83 },
];

describe("R227 · der Farbton-Interim traegt die Kreide aus dem Gesichts-Fenster", () => {
  const file = path.join(SRC, "PaintScene.ts");
  const src = fs.readFileSync(file, "utf8");
  const tints = tintsAus(src);

  it("es sind drei Toene, alle verschieden, keiner ist »kein Ton«", () => {
    expect(tints.length, "SCRIBBLE_TINTS nicht gefunden oder falsch lang").toBe(3);
    expect(new Set(tints).size, "zwei Schichten teilen sich einen Ton — dann faerbt kein Wisch um").toBe(3);
    for (const t of tints) expect(t, "0xffffff ist kein Ton, sondern seine Abwesenheit").not.toBe(0xffffff);
  });

  it("…und er wird auch wirklich aufgetragen (eine tote Zahl besteht jede Attrappe)", () => {
    expect(wirdAufgetragen(src)).toBe(true);
  });

  it("VAKUITAET: jede Attrappe ist OHNE Ton wirklich gesichts-weiss", () => {
    for (const a of ATTRAPPEN) {
      expect(gesichtsWeiss(...a.px), `${a.blatt} (${a.px.join(",")}) war schon ohne Ton nicht gesichts-weiss`).toBe(true);
    }
  });

  it("…und MIT dem Ton ihrer Schicht ist keine davon mehr gesichts-weiss", () => {
    for (const a of ATTRAPPEN) {
      const [r, g, b] = getoent(a.px, tints[a.schicht]!);
      expect(gesichtsWeiss(r, g, b),
        `${a.blatt} (${a.px.join(",")}) × Ton der Schicht ${a.schicht} = (${r},${g},${b}) — immer noch gesichts-weiss`,
      ).toBe(false);
    }
  });

  it("…und das rote Licht ist erreichbar (Tamper an einer KOPIE des Quelltexts)", () => {
    const manipuliert = src.replace(
      "const SCRIBBLE_TINTS: readonly number[] = [0xfff2b0, 0xaffaf5, 0xffb8d9];",
      "const SCRIBBLE_TINTS: readonly number[] = [0xffffff, 0xaffaf5, 0xffb8d9];",
    );
    expect(manipuliert, "der Tamper hat nichts veraendert — er beweist dann auch nichts").not.toBe(src);
    const kaputt = tintsAus(manipuliert);
    const schicht0 = ATTRAPPEN.filter((a) => a.schicht === 0);
    expect(schicht0.length).toBeGreaterThan(0);
    const durchgerutscht = schicht0.filter((a) => gesichtsWeiss(...getoent(a.px, kaputt[0]!)));
    expect(durchgerutscht.length,
      "mit 0xffffff muessten die Attrappen der Schicht 0 wieder gesichts-weiss sein",
    ).toBe(schicht0.length);
  });

  // ⚠ EHRLICH GESAGT, WEIL ES SPAETER JEMAND MESSEN WIRD: bei (255,255,255)
  //   × 0xfff2b0 liegt die Helligkeit hinterher bei 239,998 — 0,002 unter der
  //   240er-Linie. Das Fenster faellt hier also NICHT an der Helligkeit,
  //   sondern an der SAETTIGUNG (1,00 gegen die Decke 0,10), und das ist die
  //   belastbare Haelfte: genau sie ist der Unterschied zwischen bunter Kreide
  //   und einem farblosen Gesicht.
  it("die Trennung haengt an der SAETTIGUNG, nicht an einer Haaresbreite Helligkeit", () => {
    const [r, g, b] = getoent([255, 255, 255], tints[0]!);
    expect(satS(r, g, b)).toBeGreaterThan(FACE_S * 5);
  });
});
