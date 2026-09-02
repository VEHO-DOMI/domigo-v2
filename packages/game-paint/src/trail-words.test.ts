// L0 · D5 · WOHER EIN BUCHSTABEN-TRAIL SEIN WORT NIMMT.
//
// Die `*`-Kacheln eines Raums buchstabieren ein Wort, und dieses Wort stand bis
// zur Level-Welle AUSSCHLIESSLICH in `composition.ts` — dem Kunst-Manifest von
// Kapitel 1. Für ch02–ch06 bleibt dieses Register nach der Platzhalter-Doktrin
// bewusst leer. Ohne Eintrag zählt `letterGlyphs` stumm A → Z durch: der Raum
// zeigt Buchstaben, sie ergeben nur nichts. Kein Absturz, kein rotes Tor.
//
// `trailWordsFor` gibt der DEKLARATION der Phase den Vorrang und fällt sonst
// auf das Manifest zurück. Beide Richtungen stehen hier: der Vorrang UND der
// Rückfall — ein Test, der nur den Vorrang prüft, wäre auch dann grün, wenn
// Kapitel 1 seine Wörter verloren hätte.
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { trailWordsFor, type PaintLevel } from "./level.ts";
import { compositionFor } from "./composition.ts";
import { letterGlyphs } from "./letters.ts";

const CH01 = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../../../content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json"), "utf8"),
) as PaintLevel;

describe("L0 · D5 · trailWordsFor", () => {
  it("ch01 löst weiter auf das Kunst-Manifest auf — Wort für Wort dasselbe", () => {
    // die Rückfall-Richtung, an der ECHTEN Auslieferung gemessen: jede Phase,
    // die im Manifest ein Wort hat, bekommt genau dieses.
    let geprueft = 0;
    for (const ph of [...CH01.phases, CH01.arena, CH01.bonus]) {
      if (!ph) continue;
      const ausManifest = compositionFor(CH01.chapter, ph.id)?.words;
      if (ausManifest === undefined) continue;
      expect(trailWordsFor(CH01, ph.id)).toEqual(ausManifest);
      geprueft++;
    }
    // Anti-Leerlauf: fände die Schleife nichts, wäre der Fall grün und leer.
    expect(geprueft).toBeGreaterThan(0);
  });

  it("eine Deklaration der Phase schlägt das Manifest", () => {
    const p1 = CH01.phases[0]!;
    expect(compositionFor(CH01.chapter, p1.id)?.words).toBeDefined(); // die Prämisse
    const level = {
      ...CH01,
      phases: [{ ...p1, words: ["kangaroo"] as readonly string[] }, ...CH01.phases.slice(1)],
    } as PaintLevel;
    expect(trailWordsFor(level, p1.id)).toEqual(["kangaroo"]);
  });

  it("ohne beides bleibt es undefined — und der Trail zählt sichtbar A→Z", () => {
    const leer = { ...CH01, chapter: "ch99" } as PaintLevel;
    expect(trailWordsFor(leer, "p1")).toBeUndefined();
    // …und das ist der Zustand, den die Deklaration beendet: dieselben Zellen,
    // aber das Alphabet statt des Wortes.
    const rows = ["############", "..*..*..*...", "############"];
    expect(letterGlyphs(rows).map((g) => g.char).join("")).toBe("ABC");
    expect(letterGlyphs(rows, ["zoo"]).map((g) => g.char).join("")).toBe("ZOO");
  });

  it("kennt auch Arena und Bonusraum, nicht nur die drei Feldräume", () => {
    // `allPhases` schliesst beide ein; eine Auflösung, die nur `phases` liest,
    // hätte den Bonusraum stumm auf das Alphabet fallen lassen.
    expect(trailWordsFor(CH01, CH01.bonus!.id)).toEqual(compositionFor(CH01.chapter, CH01.bonus!.id)?.words);
  });
});
