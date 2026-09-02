// L0 · D3 · DIE BONUS-UHR HÄNGT AM RAUM, NICHT AM NAMEN.
//
// `sim.ts` startete die Uhr der Kleckskammer mit `cfg.phaseId === "p9"` — einem
// Vergleich gegen die Zeichenkette »p9«. Für Kapitel 1 war das richtig, denn
// dessen Bonusraum heisst p9. Der Kommentar der NACHBAR-Regel (`isBonusRoom`,
// zwölf Zeilen darüber) nannte diese Zeile aber schon als die verbliebene
// Ausnahme: »THE KEY IS THE LEVEL'S OWN BONUS PHASE, NOT THE LITERAL id p9«.
//
// Was der Defekt gekostet hätte: ein Kapitel, dessen Kleckskammer eine andere
// Id trägt, hätte einen Bonusraum OHNE UHR bekommen. Kein Absturz, kein rotes
// Tor — nur ein Raum, dessen ganzer Vertrag (35 Sekunden, dann sanft zurück)
// stillschweigend nicht mehr gilt. Und die Gegenrichtung ist genauso still: ein
// FELD-Raum, der zufällig p9 heisst, hätte eine Uhr laufen lassen, die niemand
// bestellt hat.
//
// Beide Richtungen stehen hier, weil ein Gesetz, das nur die eine prüft, mit
// einer fest verdrahteten Konstante genauso grün wäre.
import { describe, expect, it } from "vitest";
import { Sim } from "./sim.ts";
import type { PaintLevel, PhaseSpec } from "./level.ts";

const ROWS = [
  "############",
  ...Array.from({ length: 16 }, () => "............"),
  "..S....*..X.",
  "############",
  "############",
];

const phase = (id: string, exitTo: string): PhaseSpec => ({
  id,
  nameDe: "Test",
  surface: "normal",
  plates: {},
  rows: ROWS,
  entities: [],
  links: [],
  exit: { to: exitTo },
});

/** Ein Level, dessen Bonusraum FREI benannt ist. */
const levelWith = (bonusId: string, fieldId: string): PaintLevel => ({
  schema: "paintLevel@1",
  id: "g1-ch99",
  chapter: "ch99",
  draft: true,
  name: "Test",
  goalDe: "x",
  whyDe: "x",
  hintsDe: [],
  collectNounDe: "x",
  abilities: ["jump"],
  phases: [phase(fieldId, "done")],
  bonus: phase(bonusId, fieldId),
});

const ticksIn = (level: PaintLevel, phaseId: string): number =>
  new Sim({ level, phaseId, grantedAbilities: () => [...level.abilities], freedCageIds: () => [] }).bonusLeftTicks;

describe("L0 · D3 · die Bonus-Uhr", () => {
  it("läuft im Bonusraum, auch wenn er NICHT p9 heisst", () => {
    // Kleckskammer = p7, Feldraum = p1. Vor der Level-Welle wäre das eine
    // Kammer ohne Uhr gewesen — 35 s + 2 s Gnade, gemessen an der Konstante,
    // die der Motor selbst setzt.
    expect(ticksIn(levelWith("p7", "p1"), "p7")).toBe(35 * 60 + 120);
  });

  it("läuft NICHT in einem Feldraum, der zufällig p9 heisst", () => {
    // die Gegenrichtung: hier ist p9 das FELD und p7 die Kammer. Ein Vergleich
    // gegen den Namen hätte die Uhr im falschen Raum gestartet.
    const level = levelWith("p7", "p9");
    // −1 ist der Nicht-Uhr-Wert des Motors (`sim.ts:368`, »≥0 only in the
    // Kleckskammer«) — bewusst KEINE 0, denn 0 heisst »abgelaufen«.
    expect(ticksIn(level, "p9")).toBe(-1);
    expect(ticksIn(level, "p7")).toBe(35 * 60 + 120);
  });

  it("und in Kapitel 1, wo die Kammer wirklich p9 heisst, ändert sich nichts", () => {
    expect(ticksIn(levelWith("p9", "p1"), "p9")).toBe(35 * 60 + 120);
    expect(ticksIn(levelWith("p9", "p1"), "p1")).toBe(-1);
  });
});
