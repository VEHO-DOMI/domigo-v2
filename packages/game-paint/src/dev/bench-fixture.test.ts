// R5-W4 · W2 · DIE ZAHLEN DER BANK GEGEN DAS KAPITEL (D-103).
//
// Die Bilanz der Kartenbank stand als getippte Literale in der Galerie und war
// an zwei von fünf Stellen falsch: 6 Käfige gegen 5 im Kapitel, 1 Bonusbuch
// gegen 3. Ein blinder Kritiker hat damit eine Punkte-Seite beurteilt, die es
// im Spiel nie gab. Dieser Test hält jede Zahl gegen `ch01.level.json` und
// verbietet, dass die Klasse zurückkehrt.
//
// Die Gegenrechnung ist ABSICHTLICH anders geschrieben als `bench-counts.ts`:
// sie liest das rohe JSON und zählt selbst. Ein Test, der dieselbe Funktion
// zweimal aufruft, prüft nur, dass sie sich selbst gleicht.
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { benchBilanz } from "./bench-counts.ts";
import type { PaintLevel } from "../level.ts";

const root = path.resolve(__dirname, "../../../..");
const levelPath = path.join(root, "content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json");
const raw = JSON.parse(fs.readFileSync(levelPath, "utf8")) as PaintLevel;
const gallery = fs.readFileSync(path.join(root, "packages/game-paint/src/dev/CardGallery.tsx"), "utf8");

/** die Räume, die das Kind spielt — Phasen + Arena, Bonusräume draußen */
const rooms = [...raw.phases, ...(raw.arena ? [raw.arena] : [])];
/** unabhängig nachgezählt, aus dem rohen JSON */
const count = (role: string): number =>
  rooms.reduce((n, p) => n + p.entities.filter((e) => e.role === role).length, 0);
const stars = rooms.reduce((n, p) => n + [...p.rows.join("")].filter((c) => c === "*").length, 0);
const classmates = rooms.reduce(
  (n, p) => n + p.entities.filter((e) => e.role === "cage" && e.params?.classmate !== undefined).length,
  0,
);

describe("die Bilanz der Kartenbank stimmt mit dem Kapitel überein", () => {
  it("findet überhaupt etwas zu prüfen (Vakuität)", () => {
    // Eine Gegenrechnung, die 0 zählt, würde jede Behauptung unten wahr machen
    expect(rooms.length).toBeGreaterThan(2);
    expect(count("cage")).toBeGreaterThan(0);
    expect(stars).toBeGreaterThan(0);
  });

  it("leitet jede der fünf Summen aus dem Level ab", () => {
    const b = benchBilanz(raw);
    expect({
      kidsTotal: b.kidsTotal,
      freedTotal: b.freedTotal,
      tipsTotal: b.tipsTotal,
      lettersTotal: b.lettersTotal,
      booksTotal: b.booksTotal,
    }).toEqual({
      kidsTotal: classmates,
      freedTotal: count("cage"),
      tipsTotal: raw.tipsTotal ?? count("tip"),
      lettersTotal: stars,
      booksTotal: count("book"),
    });
  });

  it("hält jeden Fortschritt innerhalb seiner Summe", () => {
    const b = benchBilanz(raw);
    for (const [got, total] of [
      [b.kids, b.kidsTotal], [b.freed, b.freedTotal], [b.tips, b.tipsTotal],
      [b.letters, b.lettersTotal], [b.books, b.booksTotal],
    ] as const) {
      expect(got).toBeGreaterThanOrEqual(0);
      expect(got).toBeLessThanOrEqual(total);
    }
    // die Punkte-Seite rechnet „Schulsachen = freed − kids"; das darf nie negativ werden
    expect(b.freed).toBeGreaterThanOrEqual(b.kids);
  });

  it("die Galerie benutzt die Ableitung — und tippt keine Summe mehr", () => {
    const block = /const bilanz\s*=\s*([\s\S]*?);\n/.exec(gallery);
    expect(block, "der bilanz-Ausdruck der Galerie wurde nicht gefunden — der Test wäre blind").not.toBeNull();
    const expr = block![1]!;
    // Getippte Summen sind die Drift-Klasse, um die es hier geht. Die Meldung
    // stellt jede getippte Zahl neben die des Kapitels, damit das rote Licht
    // gleich sagt, WAS auseinanderläuft (6 Käfige getippt, 5 gesetzt).
    const imKapitel: Record<string, number> = {
      kidsTotal: classmates, freedTotal: count("cage"), tipsTotal: raw.tipsTotal ?? count("tip"),
      lettersTotal: stars, booksTotal: count("book"),
    };
    const typed = [...expr.matchAll(/(\w*Total)\s*:\s*(\d+)/g)]
      .map((m) => `${m[1]}: getippt ${m[2]} · im Kapitel ${imKapitel[m[1]!] ?? "?"}`);
    expect(typed, "getippte Summen in der Bank — sie driften, sobald das Kapitel sich ändert").toEqual([]);
    expect(expr).toContain("benchBilanz");
  });
});
