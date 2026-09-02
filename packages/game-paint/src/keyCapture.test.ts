// N7B2 · D-788 · DAS TOR UM DIE TASTATUR.
//
// Der Befund ist gemessen, nicht vermutet (N7B-Report): an einem FOKUSSIERTEN
// Eingabefeld kommen Leertaste, A, W, D, X und Pfeil-links als »abgefangen«
// zurück, Q und E nicht — genau die Tasten, die das Spiel bei Phaser anmeldet.
// Ein Kind, das »was quer« in eine Karte tippt, verliert w, a, s und das
// Leerzeichen.
//
// Zwei Wände, zwei Prüfungen: die Regel selbst (unten, echtes Verhalten an
// einem nachgebauten Tastatur-Steckplatz) und ihre Verdrahtung (Quell-Gesetz,
// Muster `cards/resolution-instant.test.ts` — dieses Paket hat kein DOM-Testbett,
// `PaintScene.ts` lädt Phaser und ist im Node-Test nicht importierbar).
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { PAD_KEYS, applyKeyCapture, type KeyCaptureTarget } from "./keyCapture.ts";

/** Der Steckplatz, wie Phaser ihn hält — nur die zwei Methoden, die die Regel
 *  anfasst, mit einem Gedächtnis für die Prüfung. */
const stubKeyboard = (): KeyCaptureTarget & { cleared: number; captured: string[] } => {
  const k = {
    cleared: 0,
    captured: [] as string[],
    clearCaptures(): void { k.cleared++; },
    addCapture(keys: string): void { k.captured.push(keys); },
  };
  return k;
};

describe("N7B2 · solange eine Karte steht, fängt das Spiel keine Taste ab", () => {
  it("Karte offen ⇒ die Fang-Liste ist leer, und es wird KEINE neue gesetzt", () => {
    const kb = stubKeyboard();
    applyKeyCapture(kb, true);
    expect(kb.cleared, "das Abfangen muss weg").toBe(1);
    expect(kb.captured, "…und nichts darf nachrücken").toEqual([]);
  });

  it("Karte weg ⇒ das Spiel bekommt genau seine eigene Liste zurück", () => {
    const kb = stubKeyboard();
    applyKeyCapture(kb, false);
    expect(kb.captured, "dieselbe Liste, die `addKeys` anmeldet").toEqual([PAD_KEYS]);
  });

  it("zweimal rufen ist wie einmal rufen (die Hülle ruft bei jedem Karten-Wechsel)", () => {
    const kb = stubKeyboard();
    applyKeyCapture(kb, false);
    applyKeyCapture(kb, false);
    expect(kb.captured, "keine doppelte Liste — erst leeren, dann setzen").toEqual([PAD_KEYS, PAD_KEYS]);
    expect(kb.cleared).toBe(2);
  });

  it("ohne Tastatur passiert nichts (kopflose Läufe, Tape-Replays)", () => {
    expect(() => applyKeyCapture(null, true)).not.toThrow();
    expect(() => applyKeyCapture(undefined, false)).not.toThrow();
  });

  it("die Liste enthält genau die Tasten, die einem tippenden Kind wehtun", () => {
    // Vakuität: eine Liste, die das Leerzeichen nicht führt, hätte D-788 nie
    // ausgelöst — dann prüfte alles darüber nichts.
    for (const taste of ["SPACE", "A", "D", "W", "S", "X", "J", "LEFT", "RIGHT", "UP", "DOWN"]) {
      expect(PAD_KEYS.split(","), `${taste} gehört in die Liste`).toContain(taste);
    }
  });
});

/** Quelle OHNE Kommentare. Der erste Anlauf dieses Wächters hat den Tamper
 *  überlebt: ein auskommentierter Aufruf steht immer noch wörtlich in der Datei,
 *  und ein blosses »kommt vor« sah keinen Unterschied zwischen gebautem Code und
 *  einer Erinnerung daran. Ein Wächter, der eine Auskommentierung nicht sieht,
 *  ist keiner — deshalb fallen Zeilen- und Block-Kommentare vorher weg. */
const ohneKommentare = (src: string): string =>
  src.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/\/\/[^\n]*/g, " ");

describe("N7B2 · und die Regel ist auch wirklich angeschlossen", () => {
  const scene = ohneKommentare(fs.readFileSync(path.join(__dirname, "PaintScene.ts"), "utf8"));
  const skins = ohneKommentare(fs.readFileSync(path.join(__dirname, "cards/skins.tsx"), "utf8"));

  it("die Szene meldet die Tasten aus der EINEN Quelle an", () => {
    expect(scene, "`addKeys` liest die geteilte Liste").toContain("kb.addKeys(PAD_KEYS)");
    expect(
      scene.includes('addKeys("LEFT'),
      "keine zweite, getippte Tastenliste — genau der Drift, den die Konstante verhindert",
    ).toBe(false);
    // Vakuität: findet der Wächter die Anmelde-Stelle nicht mehr, prüft er nichts.
    expect(scene.indexOf("addKeys("), "die Anmelde-Stelle ist verschoben").toBeGreaterThan(0);
  });

  it("`setOverlay` schaltet das Abfangen mit — an der Stelle, durch die alle Wege laufen", () => {
    const open = scene.indexOf("setOverlay(open: boolean): void {");
    expect(open, "der Rückgabe-Ort ist nicht auffindbar — der Wächter wäre blind").toBeGreaterThan(0);
    const block = scene.slice(open, open + 900);
    expect(block).toContain("applyKeyCapture(this.input.keyboard, open)");
  });

  it("das Polling bleibt an — `enabled = false` würde die gehaltene Taste töten", () => {
    // Die Resume-Naht aus N7B lebt davon, dass `Key.isDown` weiterläuft: eine
    // über die Karte gehaltene Richtungstaste muss beim Schliessen SOFORT
    // greifen. Wer hier abschaltet, nimmt genau das zurück.
    expect(/keyboard\s*(\.|\?\.)\s*enabled\s*=\s*false/.test(scene)).toBe(false);
  });

  it("das Antwortfeld hält die Taste zusätzlich selbst auf", () => {
    const i = skins.indexOf("export function TypedCard");
    expect(i, "die getippte Karte ist nicht auffindbar").toBeGreaterThan(0);
    const block = skins.slice(i, i + 2000);
    expect(block, "die zweite Wand fehlt").toContain("e.stopPropagation()");
  });
});
