/**
 * L2-M-a · M0 · R235 — DIE KLECKSKAMMER HAT GENAU EINEN LAUF.
 *
 * Kokis Ruling R235 („wiederholbar" ist tot): der Bonusraum wird EINMAL
 * betreten. Gebaut war bisher das Gegenteil — `sim.ts#isBonusRoom` bestückt die
 * Kammer bei JEDEM Besuch neu (D-5 Option A, absichtlich), und nichts hinderte
 * ein Kind daran, ein zweites Mal zu bezahlen und denselben Raum leerzuräumen.
 *
 * WO DIE SPERRE SITZT, UND WARUM DORT. Der Zustand kann nicht in der Sim
 * wohnen: eine Sim lebt EINE Phase lang, der Lauf liegt eine Phase früher. Das
 * Urteil kann aber auch nicht in der Hülle wohnen: der Satz, den das Kind liest,
 * ist ein Toast, und einen Toast erzeugt ausschliesslich die Sim
 * (`SimEvent{type:"toast"}` — `PaintScene#toast` ist privat und steht in keiner
 * öffentlichen Schnittstelle). Also dieselbe Paarung wie beim Käfig-Hinweis:
 * der Shell erinnert sich (`bonusRunDoneRef`), die Sim entscheidet
 * (`cfg.bonusRunDone`).
 *
 * Beide Richtungen stehen hier. Ein Gesetz, das nur „zu" prüft, wäre auch grün,
 * wenn die Tür NIE öffnete — und dann hätte kein Kind je eine Kleckskammer
 * gesehen.
 */
import { describe, expect, it } from "vitest";
import { Sim } from "./sim.ts";
import { IDLE_PAD } from "./player.ts";
import type { PaintLevel, PhaseSpec, SimEvent } from "./index.ts";

// Boden auf der vorletzten Zeile, S und die Klecks-Tür auf DERSELBEN Spalte:
// `overlapsPlayer(e, inp, 12, 26)` greift damit im ersten Takt.
const ROWS = [
  "############",
  ...Array.from({ length: 16 }, () => "............"),
  "..S.......X.",
  "############",
  "############",
];

const feld = (): PhaseSpec => ({
  id: "p1",
  nameDe: "Feld",
  surface: "normal",
  plates: {},
  rows: ROWS,
  entities: [
    { id: "klecks", role: "door.trigger", skin: "klecksdoor", c: 2, r: 17, tier: "E", params: { kind: "bonus", price: 2 } },
  ],
  links: [],
  exit: { to: "done" },
});

const kammer = (): PhaseSpec => ({
  id: "p9",
  nameDe: "Kleckskammer",
  surface: "normal",
  plates: {},
  rows: ROWS,
  entities: [],
  links: [],
  exit: { to: "p1" },
  budgetSec: 1,
});

const level = (): PaintLevel => ({
  schema: "paintLevel@1",
  id: "g1-ch99",
  chapter: "ch99",
  draft: true,
  name: "Test",
  goalDe: "x",
  whyDe: "x",
  hintsDe: [],
  collectNounDe: "x",
  abilities: ["jump", "run"],
  phases: [feld()],
  bonus: kammer(),
});

/** Ein paar Takte an der Tür, alle Ereignisse eingesammelt. */
const anDerTuer = (bonusRunDone?: () => boolean): SimEvent[] => {
  const sim = new Sim({
    level: level(),
    phaseId: "p1",
    grantedAbilities: () => ["jump", "run"],
    freedCageIds: () => [],
    bonusRunDone,
  });
  const evs: SimEvent[] = [];
  for (let t = 0; t < 8; t++) evs.push(...sim.step(IDLE_PAD));
  return evs;
};

const bezahlKarten = (evs: SimEvent[]): SimEvent[] =>
  evs.filter((e) => e.type === "task" && e.req.use === "bonuspay");
const zuSaetze = (evs: SimEvent[]): string[] =>
  evs.filter((e): e is Extract<SimEvent, { type: "toast" }> => e.type === "toast")
    .map((e) => e.msg)
    .filter((m) => m.includes("Kleckskammer"));

describe("R235 · die Kleckskammer schliesst nach ihrem Lauf", () => {
  it("VOR dem Lauf öffnet die Klecks-Tür ihre Bezahl-Karte", () => {
    const evs = anDerTuer(() => false);
    expect(bezahlKarten(evs).length, "die Tür muss vor dem Lauf bezahlbar sein").toBe(1);
    expect(zuSaetze(evs)).toEqual([]);
  });

  it("NACH dem Lauf sagt sie einen Satz statt einer Rechnung", () => {
    const evs = anDerTuer(() => true);
    expect(bezahlKarten(evs), "ein zweiter Lauf darf nicht verkauft werden").toEqual([]);
    expect(zuSaetze(evs)).toEqual(["Die Kleckskammer ist zu — du warst schon drin."]);
  });

  it("ohne den Rückruf bleibt alles wie vorher — ch01 merkt nichts", () => {
    // Die Sperre ist ausdrücklich OPT-IN (`bonusRunDone?`), damit ein Kapitel
    // ohne Hülle (Tape-Rekorder, Piloten, Tests) unverändert läuft.
    expect(bezahlKarten(anDerTuer()).length).toBe(1);
  });

  it("die Uhr beendet den Lauf WIRKLICH — genau ein exit, und der Riegel fällt", () => {
    // Der Fund am Rande von R235: der Timeout schob sein `exit`, setzte aber
    // `exitFired` nicht. `checkExit` blieb damit scharf — ein Kind, das beim
    // Ablauf der Uhr auf dem Ausgang steht, konnte ein ZWEITES exit auslösen.
    const sim = new Sim({
      level: level(),
      phaseId: "p9",
      grantedAbilities: () => ["jump", "run"],
      freedCageIds: () => [],
    });
    expect(sim.bonusLeftTicks, "1 s Budget + 2 s Gnade").toBe(1 * 60 + 120);
    const evs: SimEvent[] = [];
    for (let t = 0; t < 400; t++) evs.push(...sim.step(IDLE_PAD));
    const ausgaenge = evs.filter((e) => e.type === "exit");
    expect(ausgaenge.length, "genau EIN Ausgang").toBe(1);
    expect(ausgaenge[0]).toEqual({ type: "exit", to: "bonus-timeout" });
    expect(sim.exitFired, "der Riegel muss nach dem Timeout liegen").toBe(true);
  });
});
