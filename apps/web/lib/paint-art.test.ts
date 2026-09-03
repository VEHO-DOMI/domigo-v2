/**
 * L0d · R263 · DER SPIEGEL-BEWEIS: DER HELD GEHOERT ALLEN KAPITELN.
 *
 * `scripts/check-paint-art.mjs` prueft dasselbe Gesetz in CI, muss dafuer aber
 * die Ordner-Regel des Aufloesers NACHBAUEN. Genau solche Nachbauten driften —
 * und ein Tor, das eine veraltete Regel spiegelt, leuchtet gruen ueber einem
 * kaputten Produkt. Dieser Test fragt deshalb nicht den Nachbau, sondern den
 * AUSGELIEFERTEN Aufloeser selbst.
 *
 * Der Befund, den er festhaelt (gemessen 03.09., vor dem Fix):
 *   resolvePaintArt("ch01") → 347 Stems, davon 14 hero2-Zellen
 *   resolvePaintArt("ch02") →  19 Stems, davon  0 hero2-Zellen
 * ch02 bekam also nur die 19 Teile des alten Baukastens, zeichnete den alten
 * Jungen, und kein Tor sagte etwas.
 *
 * `node --test`, wie die Nachbarn hier: apps/web hat kein vitest.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { register } from "node:module";
import { describe, it } from "node:test";

// Zwei Haken, beide bewusst eng — die Begruendungen stehen in den Dateien:
// `server-only` ist ein Bau-Waechter ohne Laufzeit-Inhalt, und `paint-art.ts`
// importiert einen Nachbarn ohne Datei-Endung (Next loest das auf, node nicht).
register(new URL("./testing/server-only-shim.mjs", import.meta.url));
register(new URL("./testing/ts-extension-shim.mjs", import.meta.url));
const { resolvePaintArt } = await import("./paint-art.ts");
const { ALWAYS_STEMS } = await import("../../../packages/game-paint/src/artScope.ts");

const STORY = "g1.st.lost-pages";
const LEVELS = path.join(process.cwd(), "..", "..", "content", "corpus", "stories", STORY, "paint");

/** Jedes Kapitel auf der Platte — Entwuerfe eingeschlossen. Die Liste wird
 *  GELESEN, nie getippt: ein Kapitel, das dazukommt, ist sofort unter Aufsicht. */
const kapitel = fs.readdirSync(LEVELS)
  .filter((f) => f.endsWith(".level.json"))
  .map((f) => JSON.parse(fs.readFileSync(path.join(LEVELS, f), "utf8")).chapter as string)
  .filter((c) => typeof c === "string")
  .sort();

describe("L0d · resolvePaintArt — der Held gehoert allen Kapiteln", () => {
  it("findet ueberhaupt mehr als ein Kapitel (sonst beweist der Rest nichts)", () => {
    assert.ok(kapitel.length >= 2, `nur ${kapitel.length} Kapitel: [${kapitel.join(", ")}]`);
  });

  it("jedes Kapitel loest JEDEN Helden-Stem auf — auch ein Entwurf", () => {
    for (const ch of kapitel) {
      const karte = resolvePaintArt(ch);
      const fehlt = ALWAYS_STEMS.filter((stem: string) => karte[stem] === undefined);
      assert.deepEqual(fehlt, [], `${ch} loest ${fehlt.length} von ${ALWAYS_STEMS.length} Helden-Blaettern nicht auf: ${fehlt.join(", ")}`);
    }
  });

  it("und zwar aus dem GETEILTEN Helden-Ordner, in jedem Kapitel derselbe", () => {
    for (const ch of kapitel) {
      const karte = resolvePaintArt(ch);
      for (const stem of ALWAYS_STEMS) {
        assert.ok(
          String(karte[stem]).startsWith("/art/g1/paint/hero/"),
          `${ch}: ${stem} kommt aus ${karte[stem]} statt aus art/g1/paint/hero/ — ein Kapitel-Ordner gehoert dem Kapitel allein`,
        );
      }
    }
  });

  it("dieselbe Figur, Bild fuer Bild: die Helden-Adressen sind in allen Kapiteln identisch", () => {
    const ersteKarte = resolvePaintArt(kapitel[0]);
    const erste = ALWAYS_STEMS.map((s: string) => `${s}=${ersteKarte[s]}`);
    for (const ch of kapitel.slice(1)) {
      const karte = resolvePaintArt(ch);
      assert.deepEqual(
        ALWAYS_STEMS.map((s: string) => `${s}=${karte[s]}`), erste,
        `${ch} zeigt eine andere Figur als ${kapitel[0]} — die Adresse traegt den Inhalts-Fingerabdruck, also ist das ein anderes BILD`,
      );
    }
  });
});
