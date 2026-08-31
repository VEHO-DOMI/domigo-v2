// R5-W9 · N1 · DIE DREI TEXT-ENTSCHEIDUNGEN EINER REGEL-SEITE, GEPRÜFT.
//
// `splitKey` trug seit R5-W2 den Satz »Pure and exported because it is the one
// piece of this card with an opinion, and an opinion belongs in a test rather
// than in JSX« — und hatte keinen Test. Der Kommentar war ein Vorsatz, kein
// Wächter. Er bekommt ihn hier, zusammen mit den zwei Entscheidungen, die
// diese Runde dazugestellt hat.
//
// Die letzte Gruppe misst NICHT die Funktionen, sondern das ausgelieferte
// Kapitel: sie beweist, dass jede der fünf Regel-Seiten unter dieser Mechanik
// wirklich Marken bekommt. Ein Markierer, der auf dem echten Inhalt nichts
// findet, wäre grün und nutzlos.
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { BEISPIEL_MUSTER, markEn, paarTeile, splitKey } from "./rule-text.ts";

const markiert = (zeile: string, formen: readonly string[]): string[] =>
  markEn(zeile, formen).filter((s) => s.markiert).map((s) => s.text);
const ganzerText = (zeile: string, formen: readonly string[]): string =>
  markEn(zeile, formen).map((s) => s.text).join("");

describe("splitKey — der Merksatz um seine Schlüsselstelle", () => {
  it("teilt in davor · Schlüssel · danach", () => {
    expect(splitKey("Soll jemand etwas nicht tun, stellst du Don't vor das Verb.", "stellst du Don't vor das Verb"))
      .toEqual(["Soll jemand etwas nicht tun, ", "stellst du Don't vor das Verb", "."]);
  });

  it("gibt den Satz GANZ zurück, wenn der Schlüssel nicht darin steht", () => {
    // die Karte verstümmelt nie eine Zeile, nur damit eine Marke sitzt
    expect(splitKey("Erst twenty, dann three.", "steht hier nicht")).toEqual(["Erst twenty, dann three.", "", ""]);
  });

  it("markiert bei leerem Schlüssel gar nichts", () => {
    expect(splitKey("Ein Satz.", "")).toEqual(["Ein Satz.", "", ""]);
  });
});

describe("markEn — die Marke für Schlüssel-Englisch", () => {
  it("markiert eine gelehrte Form und lässt den Rest stehen", () => {
    expect(markiert("I am here. – I'm here.", ["I'm"])).toEqual(["I'm"]);
    expect(ganzerText("I am here. – I'm here.", ["I'm"])).toBe("I am here. – I'm here.");
  });

  it("sucht ohne Rücksicht auf Gross/Klein, behält aber die Schreibweise der ZEILE", () => {
    // das Kind liest das Englisch so, wie es auf der Seite steht
    expect(markiert("Don't sit down!", ["don't"])).toEqual(["Don't"]);
  });

  it("nimmt an derselben Stelle die LÄNGERE Form", () => {
    // sonst schluckt »It« das »It's« und die Marke sitzt auf der halben Form
    expect(markiert("It's my school bag.", ["It", "It's"])).toEqual(["It's"]);
  });

  it("verschachtelt keine Marken — zwei ineinander sind ein Fleck, keine Auszeichnung", () => {
    const stuecke = markEn("How are you?", ["How are you", "are"]);
    expect(stuecke.filter((s) => s.markiert).map((s) => s.text)).toEqual(["How are you"]);
    expect(stuecke.map((s) => s.text).join("")).toBe("How are you?");
  });

  it("markiert jedes Vorkommen, nicht nur das erste", () => {
    expect(markiert("one book – two books", ["book"])).toEqual(["book", "book"]);
  });

  it("verschmilzt zwei Treffer, zwischen denen nur Leerraum steht", () => {
    // die Befehls-Seite lehrt »Sit down« UND »Don't«; ohne das Verschmelzen
    // bekam »Don't sit down!« zwei Wische mit einer Lücke dazwischen — am
    // Standbild gefunden, und es sah aus wie ein Fleck, nicht wie eine Marke
    expect(markiert("Don't sit down!", ["Sit down", "Don't"])).toEqual(["Don't sit down"]);
  });

  it("verschmilzt NICHT über Text hinweg, der dazwischen steht", () => {
    // sonst schluckte eine Marke die halbe Zeile mit
    expect(markiert("I'm here and it's late.", ["I'm", "it's"])).toEqual(["I'm", "it's"]);
  });

  it("gibt die Zeile als EIN unmarkiertes Stück zurück, wenn nichts passt", () => {
    expect(markEn("There are twenty-three books.", ["I'm"])).toEqual([{ text: "There are twenty-three books.", markiert: false }]);
  });

  it("überspringt leere und nicht-textliche Formen, statt überall zu markieren", () => {
    // eine leere Nadel findet sich an JEDER Stelle — das wäre die ganze Zeile
    // markiert, also gar keine Auszeichnung
    expect(markEn("Close the door!", ["", "   "])).toEqual([{ text: "Close the door!", markiert: false }]);
  });
});

describe("paarTeile — die zwei Hälften eines Beispiels", () => {
  it("trennt am Halbgeviertstrich mit Leerzeichen", () => {
    expect(paarTeile("one baby – three babies")).toEqual(["one baby", "three babies"]);
  });

  it("hält den Bindestrich IM WORT für keine Trennung", () => {
    // »twenty-five« ist der Grund, warum die Leerzeichen zur Marke gehören
    expect(paarTeile("I can count to twenty-five.")).toBeNull();
  });

  it("gibt null bei zwei Trennern und bei einer leeren Hälfte", () => {
    expect(paarTeile("a – b – c")).toBeNull();
    expect(paarTeile("a –  ")).toBeNull();
  });
});

// ── das ausgelieferte Kapitel, gegen die Mechanik gehalten ───────────────────
describe("die fünf Regel-Seiten des Kapitels laufen unter dieser Mechanik", () => {
  const level = JSON.parse(readFileSync(
    path.resolve(__dirname, "../../../content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json"),
    "utf8",
  )) as { phases: { entities: { role?: string; id: string; params?: Record<string, unknown> }[] }[] };
  const tips = level.phases.flatMap((p) => p.entities).filter((e) => e.role === "tip");

  it("findet die fünf Seiten überhaupt (die Prüfung ist nicht leer)", () => {
    expect(tips).toHaveLength(5);
  });

  it("jede Seite nennt eine der vier Lese-Formen", () => {
    for (const t of tips) {
      expect([...BEISPIEL_MUSTER], `${t.id}`).toContain(t.params?.beispielMuster);
    }
  });

  it("JEDES Beispiel bekommt mindestens eine Marke — sonst wäre die Hervorhebung Theorie", () => {
    for (const t of tips) {
      const bsp = t.params?.beispieleEn as string[];
      const lehrt = t.params?.lehrtEn as string[];
      for (const zeile of bsp) {
        expect(markiert(zeile, lehrt).length, `${t.id}: „${zeile}" bleibt ohne Marke`).toBeGreaterThan(0);
      }
    }
  });

  it("keine Marke verändert den Text der Zeile", () => {
    for (const t of tips) {
      for (const zeile of t.params?.beispieleEn as string[]) {
        expect(ganzerText(zeile, t.params?.lehrtEn as string[])).toBe(zeile);
      }
    }
  });

  it("die Paar-Seiten liefern wirklich Paare, die Einzel-Seite wirklich keine", () => {
    for (const t of tips) {
      const muster = t.params?.beispielMuster as string;
      for (const zeile of t.params?.beispieleEn as string[]) {
        const paar = paarTeile(zeile);
        if (muster === "wandel" || muster === "dialog") {
          expect(paar, `${t.id}: „${zeile}" ist als ${muster} erklärt`).not.toBeNull();
        } else if (muster === "einzeln") {
          expect(paar, `${t.id}: „${zeile}" ist als einzeln erklärt`).toBeNull();
        }
      }
    }
  });
});
