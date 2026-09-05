/**
 * L2-M-a · M5 — DIE GABE NENNT SICH SELBST.
 *
 * Der Gabe-Beat tippte seinen Satz hart: „Das Buch schenkt dir die FAUST!"
 * (`PaintGame.tsx`). Das Feld, das es besser weiss, gibt es seit R5-W8 · S4 —
 * `params.gabeDe`, die deutsche Nominalphrase MIT Artikel, aus derselben Familie
 * wie `captiveDe` am Käfig. Es erreichte bisher aber nur den Tor-Toast
 * (`sim.ts`, „… die Faust liegt noch in diesem Raum!"), nie die Karte.
 *
 * Warum das mehr als Kosmetik ist: ch03 deklariert „der Ring-Schwung", ch04
 * „der Feder-Rotor". Die harte Zeile hätte in beiden Kapiteln die Unwahrheit
 * gesagt — und zwar auf der EINEN Karte, deren ganze Aufgabe es ist, die neue
 * Fähigkeit zu benennen.
 *
 * Zwei Fälle, wie bei den Tor-Sätzen: mit Namen und ohne. Der zweite ist der,
 * an dem eine Hülle sonst still „undefined" ausliefert.
 */
import { describe, expect, it } from "vitest";
import { Sim } from "./sim.ts";
import { IDLE_PAD } from "./player.ts";
import type { SimEvent } from "./sim.ts";
import type { EntitySpec, PaintLevel, PhaseSpec } from "./level.ts";

const ROWS = [
  "############",
  ...Array.from({ length: 16 }, () => "............"),
  "..S.......X.",
  "############",
  "############",
];

const level = (params: Record<string, unknown>): PaintLevel => {
  const gabe: EntitySpec = { id: "gabe", role: "powerup", skin: "fibel_faust", c: 2, r: 17, tier: "E", params };
  const p1: PhaseSpec = {
    id: "p1", nameDe: "Feld", surface: "normal", plates: {}, rows: ROWS,
    entities: [gabe], links: [], exit: { to: "done" },
  };
  return {
    schema: "paintLevel@1", id: "g1-ch99", chapter: "ch99", draft: true, name: "Test",
    goalDe: "x", whyDe: "x", hintsDe: [], collectNounDe: "x",
    abilities: ["jump", "run", "punch"], phases: [p1],
  };
};

/** Das Kind steht auf der Gabe — `overlapsPlayer(e, inp, 14, 20)` greift sofort. */
const nimm = (params: Record<string, unknown>): Extract<SimEvent, { type: "powerup" }> | undefined => {
  const sim = new Sim({
    level: level(params), phaseId: "p1",
    grantedAbilities: () => ["jump", "run"], freedCageIds: () => [],
  });
  const evs: SimEvent[] = [];
  for (let t = 0; t < 6; t++) evs.push(...sim.step(IDLE_PAD));
  return evs.find((e): e is Extract<SimEvent, { type: "powerup" }> => e.type === "powerup");
};

describe("M5 · der Gabe-Beat liest gabeDe", () => {
  it("trägt den Namen der Gabe bis zur Hülle, sobald das Level ihn nennt", () => {
    const ev = nimm({ grants: "punch", gabeDe: "die Faust" });
    expect(ev, "die Gabe muss überhaupt genommen werden").toBeDefined();
    expect(ev?.grants).toBe("punch");
    expect(ev?.gabeDe).toBe("die Faust");
  });

  it("trägt ihn auch, wenn er ein anderer ist — die Zeile war für ch03/ch04 falsch", () => {
    expect(nimm({ grants: "swing", gabeDe: "der Ring-Schwung" })?.gabeDe).toBe("der Ring-Schwung");
  });

  it("und lässt ihn DEKLARIERT weg, wenn das Level keinen nennt", () => {
    // Die Karte fällt dann sichtbar auf „die Faust" zurück (PaintGame.tsx);
    // das Ereignis erfindet nichts.
    const ev = nimm({ grants: "punch" });
    expect(ev?.gabeDe).toBeUndefined();
  });
});
