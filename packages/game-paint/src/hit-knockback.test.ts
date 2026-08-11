// R5-W1 · F1 · DER TREFFER-PFAD (Auftrag F1, Item 1: „prüfe auch den
// Treffer-/iframes-Pfad").
//
// Gefunden beim Prüfen: `applyKnockback` ist eine REINE Funktion — sie gibt
// einen neuen Zustand zurück. Der Gefahren-Pfad (Stacheln, Tinte) weist ihn
// korrekt zu; der WESEN-Pfad warf ihn weg und setzte nur `iframes`. Ein
// Kreide-Wesen, das das Kind berührt, hat es also nie zurückgestoßen: kein
// Rückstoß, kein Stolpern, keine „hit"-Pose — entgegen dem Kanon (doc 41/44:
// „a chalk hit = knockback + a boss-window task") und entgegen Schuld D-17,
// die genau danach fragt.
//
// Und darunter, nur sichtbar, sobald der Rückstoß überhaupt ankommt: das
// VORZEICHEN war verkehrt. `fromDir` heißt „in dieser Richtung liegt die
// Gefahr" (player.test.ts pinnt die Konvention), der Ausdruck lieferte das
// Gegenteil — der naive Fix hätte das Kind IN das Wesen hinein gestoßen.
// Deshalb prüft C2 beide Seiten.
//
// ─────────────────────────────────────────────────────────────────────────
// ⏸ GEPARKT — WARTET AUF EINE ENTSCHEIDUNG (R5-W1 · F1, 11.08.2026)
//
// Der Fix ist geschrieben, getestet und war grün: C1–C5 liefen mit ihm durch
// und ohne ihn rot. Er liegt NICHT im PR, weil die Messung danach etwas
// zeigte, das vorher niemand wusste:
//
//   Phase p2 löst in einem Durchlauf ZWÖLF Begegnungen aus — die Schwärme auf
//   dem Weg sind als Durchlauf-Stationen gebaut („Schwarm 1 zahlt unterwegs").
//   Solange ein Treffer körperlich folgenlos war, konnte das Kind mitten
//   hindurchgehen. Mit echtem Rückstoß wird es zwölfmal zurückgeworfen; der
//   aufgezeichnete Pilot erreicht den Ausgang nicht mehr (2361 Ticks statt
//   965, Endstand Spalte 68,6). BEWIESEN, nicht vermutet: ohne den Fix nimmt
//   derselbe Recorder p2 sauber auf (✓ exit → p3, 965 Ticks, 12 Aufgaben).
//
// Das ist keine Bug-Frage mehr, sondern eine Spielgefühl-Frage für Koki: soll
// JEDE Wesen-Berührung zurückstoßen (dann wird p2 spürbar härter und die
// Route muss neu gedacht werden), oder nur die Kreide des Bosses — was der
// Kanon-Satz „a chalk hit = knockback + a boss-window task" (doc 44 §4 ch01
// C4) wörtlich genommen auch hergibt? Diese Session redesignt p2 nicht im
// Vorbeigehen.
//
// Was hier bleibt: C3 (der Gefahren-Zweig war IMMER richtig — der Zaun, der
// beweist, dass die beiden Pfade sich unterscheiden) und die Vektor-Probe.
// C1/C2/C4/C5 stehen fertig und übersprungen bereit; wer die Entscheidung
// umsetzt, macht `describe.skip` zu `describe` und setzt in sim.ts
// onEntityEvent »encounter« die drei Zeilen, die im Report stehen.
// ─────────────────────────────────────────────────────────────────────────

import { describe, expect, it } from "vitest";
import { Sim } from "./sim.ts";
import { IDLE_PAD } from "./player.ts";
import { type EntitySpec, type PaintLevel } from "./level.ts";
import { PAINT, SUBS, TILE } from "./paint.ts";

const W = 40;
const row = (fill: string): string => fill.repeat(W);
const put = (base: string, at: number, glyph: string): string =>
  base.slice(0, at) + glyph + base.slice(at + 1);

/** Ein flacher Raum: Boden in Zeile 15, der Held startet auf Spalte 20. */
const FLOOR = [
  ...Array.from({ length: 14 }, () => row(".")),
  put(row("."), 20, "S"),
  row("#"),
  row("#"),
];

const level = (entities: EntitySpec[], rows: readonly string[] = FLOOR): PaintLevel => ({
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
  phases: [{
    id: "p1",
    nameDe: "Test",
    surface: "normal",
    plates: {},
    rows: [...rows],
    entities,
    links: [],
    exit: { to: "done" },
  }],
});

const chaser = (c: number): EntitySpec => ({
  id: "beast", role: "chaser", skin: "pencil", c, r: 14, tier: "E", params: {},
});

const make = (entities: EntitySpec[]): Sim =>
  new Sim({ level: level(entities), phaseId: "p1", grantedAbilities: () => [], freedCageIds: () => [] });

/** Läuft, bis das Wesen das Kind berührt (die Begegnungs-Karte aufgeht). */
const untilHit = (sim: Sim, ticks = 400): boolean => {
  for (let t = 0; t < ticks; t++) {
    for (const ev of sim.step(IDLE_PAD)) {
      if (ev.type === "task" && ev.req.ctx.type === "entity") return true;
    }
  }
  return false;
};

describe.skip("R5-F1 · ein Kreide-Wesen, das trifft, stößt auch zurück (D-17) — GEPARKT", () => {
  it("C1 · der Treffer wirkt am Körper, nicht nur an der Unverwundbarkeit", () => {
    const sim = make([chaser(24)]);
    expect(untilHit(sim), "das Wesen muss das Kind erreichen").toBe(true);
    expect(sim.player.pose, "der getroffene Körper trägt die Treffer-Pose").toBe("hit");
    expect(sim.player.stun, "…und ist kurz nicht steuerbar").toBeGreaterThan(0);
    expect(sim.player.grounded, "…und ist von den Brettern gehoben").toBe(false);
    expect(sim.player.vy).toBe(PAINT.knockVy);
    expect(Math.abs(sim.player.vx)).toBe(PAINT.knockVx);
    expect(sim.player.iframes).toBe(PAINT.iframeTicks);
  });

  it("C2 · der Stoß geht WEG vom Wesen — auf beiden Seiten", () => {
    const fromRight = make([chaser(24)]);
    expect(untilHit(fromRight)).toBe(true);
    const beastR = fromRight.world.entities.find((e) => e.id === "beast");
    expect(fromRight.player.x, "das Wesen kam von rechts").toBeLessThan(beastR?.x ?? 0);
    expect(fromRight.player.vx, "…also fliegt das Kind nach links").toBeLessThan(0);

    const fromLeft = make([chaser(16)]);
    expect(untilHit(fromLeft)).toBe(true);
    const beastL = fromLeft.world.entities.find((e) => e.id === "beast");
    expect(fromLeft.player.x, "das Wesen kam von links").toBeGreaterThan(beastL?.x ?? 0);
    expect(fromLeft.player.vx, "…also fliegt das Kind nach rechts").toBeGreaterThan(0);
  });

  it("C4 · die eingefrorene Karte zeigt den Treffer, nicht die alte Pose", () => {
    const sim = make([chaser(24)]);
    expect(untilHit(sim)).toBe(true);
    expect(sim.overlayOpen, "die Begegnung friert die Welt ein").toBe(true);
    for (let t = 0; t < 30; t++) sim.step(IDLE_PAD);
    expect(sim.player.pose, "solange die Karte steht, steht auch das Bild").toBe("hit");
  });

  it("C5 · ein Treffer beim Fahren löst die Fahrt", () => {
    // Der Rückstoß hebt das Kind (vy < 0); der Ride-Vertrag lässt genau dann
    // los und darf nicht im selben Tick wieder andocken.
    const sim = new Sim({
      level: level([
        chaser(24),
        { id: "ride1", role: "platform.move", skin: "ruler", c: 20, r: 14, tier: "E", params: { dxTiles: 0, periodTicks: 400 } },
      ]),
      phaseId: "p1",
      grantedAbilities: () => [],
      freedCageIds: () => [],
    });
    expect(untilHit(sim)).toBe(true);
    expect(sim.ridingId, "die Fahrt ist gelöst").toBeNull();
    expect(sim.player.pose).toBe("hit");
  });
});

// LEBEND: der Zaun um den Zweig, der immer richtig war. Er ist der Beweis,
// dass die beiden Treffer-Pfade sich wirklich unterscheiden — und die Wache
// dafür, dass eine spätere Reparatur des Wesen-Zweigs den Gefahren-Zweig
// nicht mitnimmt.
describe("R5-F1 · der Gefahren-Pfad stößt zurück (und tat es immer)", () => {
  it("C3 · Stacheln: Rückstoß gegen den Blick, Treffer-Pose, volle i-frames", () => {
    // Stacheln direkt rechts neben dem Startfeld: derselbe Rückstoß, aber vom
    // BLICK abgeleitet (sim.ts onPlayerEvent) — dieser Zweig war immer richtig
    // und darf sich durch einen späteren Fix nicht bewegen.
    const spiked = [
      ...Array.from({ length: 14 }, () => row(".")),
      put(row("."), 20, "S"),
      put(row("#"), 22, "^"),
      row("#"),
    ];
    const sim = new Sim({ level: level([], spiked), phaseId: "p1", grantedAbilities: () => [], freedCageIds: () => [] });
    let hit = false;
    for (let t = 0; t < 200 && !hit; t++) {
      sim.step({ ...IDLE_PAD, right: true });
      if (sim.player.stun > 0) hit = true;
    }
    expect(hit, "die Stacheln müssen greifen").toBe(true);
    expect(sim.player.pose).toBe("hit");
    expect(sim.player.iframes).toBe(PAINT.iframeTicks);
    // nach rechts gelaufen ⇒ Blick nach rechts ⇒ Rückstoß nach links
    expect(sim.player.vx).toBe(-PAINT.knockVx);
  });
});

// Die Zahlen, auf die sich C1–C3 stützen, kommen aus paint.ts — hier einmal
// festgehalten, damit ein Tippfehler dort nicht still durch diese Datei geht.
describe("R5-F1 · die Rückstoß-Vektoren sind die aus dem Kanon", () => {
  it("knockVx/knockVy sind gesetzt und zeigen nach oben", () => {
    expect(PAINT.knockVx).toBe(2 * SUBS);
    expect(PAINT.knockVy).toBe(-3 * SUBS);
    expect(TILE).toBe(16);
  });
});
