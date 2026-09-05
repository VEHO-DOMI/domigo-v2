// L0c · P22 · WELCHE GRENZE GILT FÜR EINEN MERKSATZ — UND WELCHE NICHT.
//
// Das Boot-Blatt dieser Bahn nahm an, `merksatzDe` sei ungedeckelt: „MAX_LINE_DE
// (56) gilt nur für showsDe/storyDe, nicht für merksatzDe" — mit dem Vorschlag,
// eine Grenze bei 72 Zeichen einzuziehen. Gemessen ist die Annahme falsch, und
// der Vorschlag wäre schädlich gewesen:
//
//   · Ein Merksatz IST gedeckelt, durch sein eigenes Gesetz: `MAX_MERKSATZ` = 78,
//     durchgesetzt in `checkLevelLaws` (Gesetz `tip-honesty`) über jedes Kapitel.
//   · Der längste ausgelieferte Merksatz hat 75 Zeichen (ch01, die -ies-Regel).
//     Eine Grenze bei 72 hätte ch01 rot gemacht — ein fertiges, ausgeliefertes
//     Kapitel, an einer Bahn, die ausdrücklich ch01-Parität schuldet.
//
// Falsch ist allein ein KOMMENTAR: der Kopf von `MAX_LINE_DE` in
// `packages/content-schema/src/game-tasks.ts` sagt „Shared with the Regel-Seiten
// Merksatz law" — geteilt wird sie mit den Kartenzeilen und mit `name`,
// `collectNounDe`, `captiveDe`, `phase.nameDe`, NICHT mit dem Merksatz. Die
// Schema-Datei ist für diese Bahn gesperrt; die Korrektur ist abgelegt.
//
// Dieser Test hält die Beziehung fest, damit der nächste Sitz sie nicht wieder
// aus einem Kommentar liest.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { MAX_LINE_DE } from "@domigo/content-schema";
import { MAX_ERKLAERUNG, MAX_MERKSATZ } from "./level.ts";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const STORIES = path.resolve(HERE, "../../..", "content", "corpus", "stories");

const merksaetze: Array<{ chapter: string; text: string }> = [];
for (const story of fs.readdirSync(STORIES)) {
  const dir = path.join(STORIES, story, "paint");
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).filter((x) => /^ch\d{2}\.level\.json$/.test(x)).sort()) {
    const roh = fs.readFileSync(path.join(dir, f), "utf8");
    const level = JSON.parse(roh) as unknown;
    const sammle = (n: unknown): void => {
      if (Array.isArray(n)) { for (const v of n) sammle(v); return; }
      if (n !== null && typeof n === "object") {
        for (const [k, v] of Object.entries(n as Record<string, unknown>)) {
          if (k === "merksatzDe" && typeof v === "string") merksaetze.push({ chapter: f.slice(0, 4), text: v });
          else sammle(v);
        }
      }
    };
    sammle(level);
  }
}

describe("L0c · P22 · die Merksatz-Grenze ist MAX_MERKSATZ, nicht MAX_LINE_DE", () => {
  it("die zwei Grenzen sind verschiedene Zahlen, und die Regel-Seite bekommt die größere", () => {
    expect(MAX_LINE_DE).toBe(56);
    expect(MAX_MERKSATZ).toBe(78);
    expect(MAX_MERKSATZ).toBeGreaterThan(MAX_LINE_DE);
    // …und die Notion ist noch einmal geräumiger als der Merksatz
    expect(MAX_ERKLAERUNG).toBeGreaterThan(MAX_MERKSATZ);
  });

  it("diese Suite misst echte Merksätze (sie kann nicht leer bestehen)", () => {
    expect(merksaetze.length).toBeGreaterThan(0);
  });

  it("jeder ausgelieferte Merksatz passt unter MAX_MERKSATZ", () => {
    for (const m of merksaetze) {
      expect(m.text.length, `${m.chapter}: „${m.text}"`).toBeLessThanOrEqual(MAX_MERKSATZ);
    }
  });

  it("…und mindestens einer ist LÄNGER als MAX_LINE_DE — eine Grenze bei 56 oder 72 wäre ein Rückschritt", () => {
    const laengster = merksaetze.reduce((a, b) => (b.text.length > a.text.length ? b : a));
    // Der gemessene Stand am 2026-09-05: 75 Zeichen in ch01. Der Test pinnt die
    // AUSSAGE, nicht die Zahl — wächst der Bestand, bleibt die Aussage wahr.
    expect(laengster.text.length, `längster: ${laengster.chapter} „${laengster.text}"`).toBeGreaterThan(MAX_LINE_DE);
    expect(laengster.text.length).toBeGreaterThan(72);
  });
});
