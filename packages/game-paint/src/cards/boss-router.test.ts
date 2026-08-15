// ── R5-W4 · H2 · DIE BOSS-BATTERIE, ALS GESETZ (Ruling R50 / Kokis F-36) ─────
//
// Kokis Befund vom 15.08.: „die Aufgaben-Auswahl größer". Die Arena hatte sechs
// Boss-Karten für drei Fenster — ein Kind, das den Kampf zweimal spielt, sah
// beim zweiten Mal dieselben drei Fragen.
//
// Die Batterie ist jetzt dreizehn Karten stark, und dieses Gesetz hält die drei
// Eigenschaften fest, die diese Zahl überhaupt erst wertvoll machen. Sie werden
// nicht MODELLIERT, sondern am ECHTEN Router gefahren (`nextTask`, dieselbe
// Funktion, die die Laufzeit ruft) — das ist die Lehre aus Schicht 15 des
// Karten-Tores: eine nachgebaute Serviervorschrift prüft die Nachbildung.
//
// Was hier ABSICHTLICH nicht steht: eine Behauptung, dass ein Kind bei jedem
// frischen Laden andere Fragen bekommt. Der Cursor läuft in DATEIREIHENFOLGE
// und wird pro Mount einmal frisch gesetzt, also sieht ein sauberer erster
// Durchgang immer dieselben ersten Karten. Variation entsteht durch »Später«,
// durch Treffer und durch den zweiten Anlauf in derselben Sitzung. Wer daran
// etwas ändern will, ändert `cards/routing.ts` — und damit jedes Proof-Band.

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { initRoute, nextTask } from "./routing.ts";
import { askerUsesOf, serveModeOf } from "./serving.ts";
import { GUARDIAN_SCRIPT } from "../entities.ts";
import type { PaintLevel } from "../level.ts";
import type { GameTaskV2 } from "@domigo/content-schema";

const TIERS = ["E", "M", "S"] as const;

const tasks = (): GameTaskV2[] =>
  JSON.parse(
    readFileSync(
      resolve(__dirname, "../../../../content/corpus/stories/g1.st.lost-pages/paint/ch01.tasks.v2.json"),
      "utf8",
    ),
  ).items as GameTaskV2[];

const shipped = (): PaintLevel =>
  JSON.parse(
    readFileSync(
      resolve(__dirname, "../../../../content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json"),
      "utf8",
    ),
  ) as PaintLevel;

/** Was ein Kampf dieser Stufe wirklich serviert — der echte Router, `knots`-mal
 *  ab einem frischen Cursor, genau wie eine frische Seite es täte. */
const servedInAFight = (items: GameTaskV2[], knots: number): string[] => {
  let st = initRoute();
  const out: string[] = [];
  for (let i = 0; i < knots; i++) {
    const { task, next } = nextTask(items, "boss", { phase: "p4", skin: "tafel" }, st);
    if (!task) break;
    out.push(task.id);
    st = next;
  }
  return out;
};

describe("R5-W4 · H2 · die Boss-Batterie", () => {
  it("ist gross genug für die LÄNGSTE Stufe, nicht nur für ch01", () => {
    // Die Zahl, die zählt, ist nicht „mehr als vorher", sondern „mehr als die
    // härteste Stufe Fenster öffnet" — sonst wiederholt sich eine Frage
    // innerhalb EINES Kampfes, und das ist der Fall, den ein Kind bemerkt.
    const boss = tasks().filter((t) => t.use === "boss");
    expect(boss.length, "die Batterie ist geschrumpft").toBeGreaterThanOrEqual(12);
    for (const tier of TIERS) {
      expect(boss.length, `Stufe ${tier} öffnet ${GUARDIAN_SCRIPT[tier].knots} Fenster`)
        .toBeGreaterThan(GUARDIAN_SCRIPT[tier].knots);
    }
  });

  it("kein Fenster fragt zweimal dasselbe — auf JEDER Stufe", () => {
    const items = tasks();
    for (const tier of TIERS) {
      const served = servedInAFight(items, GUARDIAN_SCRIPT[tier].knots);
      expect(served.length, `Stufe ${tier}: der Router lief leer`).toBe(GUARDIAN_SCRIPT[tier].knots);
      expect(new Set(served).size, `Stufe ${tier} serviert ${served.join(", ")}`).toBe(served.length);
    }
  });

  it("…und auch über einen ganzen Durchlauf der Batterie nicht", () => {
    // Der Cursor läuft weiter, wenn ein Kind »Später« sagt oder getroffen wird.
    // Erst nach EINER vollen Runde darf sich etwas wiederholen.
    const items = tasks();
    const boss = items.filter((t) => t.use === "boss");
    const served = servedInAFight(items, boss.length);
    expect(new Set(served).size, "eine Karte kam zweimal, bevor alle einmal dran waren").toBe(boss.length);
  });

  it("die Zahlen-Zusage der Arena hält, ohne dass ein Fenster verschenkt wird", () => {
    // p3 legt eine Regel-Seite „Zahlen 1–25", und die Arena hat versprochen,
    // sie abzufragen. Das Tor prüft das für Stufe E; hier steht die Bedingung,
    // die das ERMÖGLICHT: eine Zahl-Karte muss unter den ersten `knots` Karten
    // der DATEIREIHENFOLGE stehen. Genau daran wäre das Einfügen neuer Karten
    // an der falschen Stelle gescheitert — und still, denn die Batterie wäre ja
    // grösser geworden.
    const items = tasks();
    const zahlen = new Set(["one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
      "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen",
      "eighteen", "nineteen", "twenty"]);
    const served = servedInAFight(items, GUARDIAN_SCRIPT.E.knots);
    const carriesNumber = served.some((id) => {
      const t = items.find((x) => x.id === id)!;
      const surface = JSON.stringify([
        (t as { options?: string[] }).options ?? [],
        (t as { orderedChips?: string[] }).orderedChips ?? [],
        (t as { pairs?: { b: string }[] }).pairs?.map((p) => p.b) ?? [],
      ]).toLowerCase();
      return [...zahlen].some((n) => new RegExp(`"${n}"|\\b${n}\\b`).test(surface));
    });
    expect(carriesNumber, `die ersten ${GUARDIAN_SCRIPT.E.knots} Karten sind ${served.join(", ")} — keine Zahl dabei`).toBe(true);
  });

  it("die Wächterin ist die Einzige, die diese Karten heben kann", () => {
    // Eine Batterie, die niemand stellt, ist Papier. `askerUsesOf` ist die eine
    // Tabelle, die Wesen und Kartenpool verbindet — sie wird hier gefahren, nicht
    // zitiert.
    const arena = shipped().arena!;
    const guardian = arena.entities.find((e) => e.role === "guardian")!;
    expect(askerUsesOf(guardian)).toContain("boss");
    expect(serveModeOf(guardian), "eine Playlist, keine Zeremonie").toBe("playlist");
    for (const e of arena.entities) {
      if (e.role === "guardian") continue;
      expect(askerUsesOf(e), `${e.role} darf keine Boss-Karte stellen`).not.toContain("boss");
    }
  });
});
