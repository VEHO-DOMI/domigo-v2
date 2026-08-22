// R5-W8 · F9 · G4 · EINE AUFLAGE WIRD AUF DIE ANZEIGEHÖHE IHRES KÖRPERS GEZOGEN.
//
// Der Defekt war unsichtbar, und das ist der Grund, warum er eine eigene Datei
// bekommt. `PaintScene#syncOverlay` hat den VERGRÖSSERUNGSFAKTOR des Körpers auf
// die Auflage kopiert. Für alle drei Auflagen, die es heute gibt, ist das
// dasselbe Ergebnis wie die Anzeigegröße — weil jede unmittelbar vorher die
// Textur des Körpers (oder deren graue Kopie) übernimmt und die vier
// Ding-Käfige ihre `captive_*`-Blätter auf die Leinwand der Hülle geschnitten
// bekommen haben. Kein Bild, kein Tor und kein Test konnte den Unterschied
// sehen.
//
// Sichtbar wird er an dem einen Fall, für den die Insassen-Schicht gebaut
// wurde: der PERSONEN-Käfig. `pencilcase_a` ist 480×275 (breit, liegend),
// `merle_caged0` ist 268×383 (hoch). Der Faktor der Hülle zieht Merle 39 %
// höher als ihren eigenen Käfig — die Rechnung steht seit C3 in `PaintScene`
// (`:1743-1752`), aber sie stand dort als PROSA, und Prosa hält nichts auf.
//
// Diese Datei hält beide Hälften fest: dass der Wechsel für gleiche Blattmaße
// arithmetisch NICHTS tut (sonst wäre er ein stiller Bildwechsel), und dass er
// für ungleiche Blattmaße genau die Zahl liefert, die der Vorfall verlangt.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { CAGE_DISPLAY_H, overlayFit } from "./anim.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("overlayFit · gleiche Blattmaße = das alte Verhalten, Ziffer für Ziffer", () => {
  it("gibt den Faktor des Körpers unverändert zurück", () => {
    const fit = overlayFit(
      { frameW: 347, frameH: 480, scaleX: 0.0708, scaleY: 0.0708 },
      { frameW: 347, frameH: 480 },
    );
    expect(fit.scaleX).toBeCloseTo(0.0708, 12);
    expect(fit.scaleY).toBeCloseTo(0.0708, 12);
  });

  it("überträgt auch eine UNGLEICHE Skalierung unverändert — die Rolle des Bosses", () => {
    // guardianRollScaleX staucht nur waagrecht; ein Schleier, der die Stauchung
    // nicht mitmacht, läge als Doppelbild neben seinem Körper.
    const fit = overlayFit(
      { frameW: 397, frameH: 440, scaleX: 0.11 * 0.62, scaleY: 0.11 },
      { frameW: 397, frameH: 440 },
    );
    expect(fit.scaleY).toBeCloseTo(0.11, 12);
    expect(fit.scaleX).toBeCloseTo(0.11 * 0.62, 12);
  });
});

describe("overlayFit · der Personen-Käfig (G4, der Fall aus PaintScene :1743-1752)", () => {
  // Die Zahlen sind die der Platte, nicht erfunden: pencilcase_a 480×275,
  // merle_caged0 268×383, CAGE_DISPLAY_H aus anim.ts.
  const shell = { w: 480, h: 275 };
  const occupant = { w: 268, h: 383 };
  const k = CAGE_DISPLAY_H / shell.h; // der Faktor, den die Hülle fährt

  it("zeichnet den Insassen so hoch wie seinen Käfig, nicht 39 % höher", () => {
    const alt = occupant.h * k; // was der kopierte FAKTOR ergäbe
    expect(alt).toBeCloseTo(47.35, 2); // die Prosa rundet auf 47,4
    expect(alt / CAGE_DISPLAY_H - 1).toBeGreaterThan(0.39);

    const fit = overlayFit(
      { frameW: shell.w, frameH: shell.h, scaleX: k, scaleY: k },
      { frameW: occupant.w, frameH: occupant.h },
    );
    expect(occupant.h * fit.scaleY).toBeCloseTo(CAGE_DISPLAY_H, 6);
  });

  it("lässt dem Insassen seine eigenen Proportionen (er wird nicht in den Kasten gezerrt)", () => {
    const fit = overlayFit(
      { frameW: shell.w, frameH: shell.h, scaleX: k, scaleY: k },
      { frameW: occupant.w, frameH: occupant.h },
    );
    expect(fit.scaleX).toBeCloseTo(fit.scaleY, 12);
    // die Anzeigebreite der Hülle wäre 59,3 px — der Insasse ist schmäler,
    // weil er hochkant gemalt ist
    expect(occupant.w * fit.scaleX).toBeCloseTo(23.8, 1);
    expect(occupant.w * fit.scaleX).toBeLessThan(shell.w * k);
  });
});

describe("overlayFit · das Nur-was-da-ist-Gesetz", () => {
  it("fällt auf den Faktor zurück, statt ein Wesen auf null zu zeichnen", () => {
    for (const copy of [{ frameW: 0, frameH: 0 }, { frameW: 10, frameH: 0 }]) {
      const fit = overlayFit({ frameW: 100, frameH: 200, scaleX: 0.5, scaleY: 0.5 }, copy);
      expect(fit.scaleY).toBe(0.5);
      expect(fit.scaleX).toBe(0.5);
    }
    const tot = overlayFit({ frameW: 100, frameH: 200, scaleX: 0.5, scaleY: 0 }, { frameW: 10, frameH: 10 });
    expect(tot.scaleY).toBe(0);
  });
});

describe("syncOverlay ruft die geprüfte Rechnung auf — und nicht wieder den Faktor", () => {
  // Nach dem Muster von cards/portrait.test.ts: die Regel wird am QUELLTEXT
  // gehalten, weil ein Rückfall hier von keinem Bild und keinem Tor gesehen
  // würde — genau die Eigenschaft, die den Defekt so lange am Leben hielt.
  const src = fs.readFileSync(path.join(__dirname, "PaintScene.ts"), "utf8");
  const body = src.slice(src.indexOf("private syncOverlay("));
  const method = body.slice(0, body.indexOf("\n  }"));

  it("die Methode nimmt overlayFit", () => {
    expect(method).toMatch(/overlayFit\(/);
  });

  it("und kopiert die Skalierung des Körpers nicht mehr roh", () => {
    expect(method).not.toMatch(/setScale\(\s*img\.scaleX/);
  });

  it("…und die Spiegelung bleibt ihre eigene Zeile (Phaser trägt sie im Vorzeichen)", () => {
    expect(method).toMatch(/setFlipX\(img\.flipX\)/);
  });
});
