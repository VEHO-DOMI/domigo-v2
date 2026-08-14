// PK-R6 · C · THE TIMER POLICY, asserted (doc 44 §2.9, Koki's Decision ④).
//
// The policy is a MAP now precisely so it can be stated and checked in one
// place — but a map with no test is still a rule with one reader. These lock
// the four sentences the decision actually contains, so a future „just add a
// clock here" has to argue with a red test rather than with a comment.
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { CALM_DE, CALM_KINDS, TIMED_USES, URGENCY_DE, armedClockMs, clockMsFor, timerClassFor, windowMsFor } from "./timer.ts";
import { tierOfAsker } from "./serving.ts";
import { PAINT } from "../paint.ts";
import type { PaintLevel } from "../level.ts";
import type { GameTaskV2 } from "@domigo/content-schema";
import { MACHINES } from "./machines.ts";

const RING = 45_000;

describe("the timer policy (doc 44 §2.9)", () => {
  it("times the two pools where urgency IS the fiction, and nothing else", () => {
    expect([...TIMED_USES].sort()).toEqual(["boss", "quickfire"]);
    expect(timerClassFor("quickfire", "choice")).toBe("timed");
    expect(timerClassFor("boss", "mistake")).toBe("timed");
    for (const calm of ["encounter", "door", "rescue", "finale", "bonus", "bonuspay"]) {
      expect(timerClassFor(calm, "choice"), `${calm} must be calm`).toBe("calm");
    }
  });

  it("a calm KIND stays calm in a timed pool (restore is the named one)", () => {
    // §2.9's calm classes: restore · rescue · door · ceremony · story. Three of
    // those are pools; `restore` is the one that is a card kind, so it is the
    // one the map has to carry explicitly — a swarm being asking a two-step
    // colour card must not put a 45-second clock on it.
    expect([...CALM_KINDS]).toEqual(["restore"]);
    expect(timerClassFor("quickfire", "restore")).toBe("calm");
    expect(clockMsFor("quickfire", "restore", false, RING)).toBe(0);
  });

  it("reduced motion removes the clock everywhere — an invisible countdown is unfair", () => {
    expect(clockMsFor("quickfire", "choice", false, RING)).toBe(RING);
    expect(clockMsFor("quickfire", "choice", true, RING)).toBe(0);
    expect(clockMsFor("boss", "order", true, RING)).toBe(0);
  });

  it("reads the SERVED pool, which is what makes the fallback safe", () => {
    // the unbound quickfire cards are the shell's universal fallback: a cage
    // rescue answered out of that pool is still a rescue, and a chalk clock
    // over a cage ceremony is exactly the mismatch this argument prevents
    expect(timerClassFor("rescue", "choice")).toBe("calm");
    expect(timerClassFor("quickfire", "choice")).toBe("timed");
  });

  it("the copy patterns catch a hurry that has nothing to hurry against", () => {
    expect(URGENCY_DE.test("Schnell, sag es ihm!")).toBe(true);
    expect(URGENCY_DE.test("Beeil dich!")).toBe(true);
    expect(URGENCY_DE.test("Sag, was er ist — dann macht er Platz!")).toBe(false);
    expect(CALM_DE.test("Lass dir Zeit.")).toBe(true);
    expect(CALM_DE.test("Dreh das Rad auf seine Zahl!")).toBe(false);
  });
});

// ── R5-W2 · H1 · DIE TIER-UHREN UND DIE STEH-UHR (Kokis Ruling, 14.08.2026) ──
describe("R5-W2 · H1 · die Uhr kommt vom Wesen, nicht von der Karte", () => {
  const LEVEL = JSON.parse(
    readFileSync(
      resolve(__dirname, "../../../../content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json"),
      "utf8",
    ),
  ) as PaintLevel;

  it("die deklarierte Tabelle wird endlich GELESEN — E 6 s · M 5 s · S 4 s", () => {
    // `PAINT.quickfireSeconds` stand im Repo, war von paint.test.ts
    // festgeschrieben und hatte in game-paint NULL Leser: jede getaktete Karte
    // lief auf der einen CSS-Rückfallzahl (45 s). Das hier ist der Leser.
    expect(windowMsFor("boss", "order", "E", false)).toBe(PAINT.quickfireSeconds.E * 1000);
    expect(windowMsFor("boss", "order", "M", false)).toBe(PAINT.quickfireSeconds.M * 1000);
    expect(windowMsFor("boss", "order", "S", false)).toBe(PAINT.quickfireSeconds.S * 1000);
    // …und härter wird es mit der Stufe, nicht weicher
    expect(windowMsFor("boss", "order", "S", false)).toBeLessThan(windowMsFor("boss", "order", "E", false));
  });

  it("die Politik bleibt die Politik: ruhige Klassen bekommen auch mit Stufe keine Uhr", () => {
    expect(windowMsFor("rescue", "choice", "S", false)).toBe(0);
    expect(windowMsFor("quickfire", "restore", "S", false)).toBe(0);
    expect(windowMsFor("boss", "order", "E", true)).toBe(0); // reduzierte Bewegung
  });

  it("die Stufe steht am WESEN der Arena und wird von dort gelesen", () => {
    const g = LEVEL.arena!.entities.find((e) => e.role === "guardian")!;
    expect(tierOfAsker(LEVEL, "p4", g.id)).toBe(g.tier);
    // die Arena hängt an `level.arena`, nicht an `phases` — wer nur `phases`
    // liest, findet den Boss nie (genau die Blindheit, die allPhasesOf schliesst)
    expect(LEVEL.phases.some((p) => p.id === "p4")).toBe(false);
  });

  it("ein unbekanntes Wesen bekommt die LÄNGSTE Uhr, nie die kürzeste", () => {
    // zwei der sieben ctx-Arten haben gar kein Wesen. Eine unklare Herkunft darf
    // ein Kind nie härter treffen als eine bekannte.
    const longest = Math.max(...(["E", "M", "S"] as const).map((t) => PAINT.quickfireSeconds[t]));
    expect(PAINT.quickfireSeconds[tierOfAsker(LEVEL, "p4", null)]).toBe(longest);
    expect(tierOfAsker(LEVEL, "p4", "gibt-es-nicht")).toBe("E");
    expect(tierOfAsker(LEVEL, "gibt-es-nicht", "tafel")).toBe("E");
  });

  it("F-A · die Klimax-Karte ist RUHIG — sie ritt auf der Boss-Uhr", () => {
    // `fin.t1` ist die Karte, auf der ein Erstleser h-e-l-l-o TIPPT. Sie wurde
    // aus dem finale-Pool gezogen, aber auf einer BOSS-Anfrage geöffnet, und die
    // Uhr liest den servierten Pool: 45 s echt, „ruhig" laut Test und laut Tor.
    // Nach der Reparatur fährt sie ihren eigenen Pool.
    expect(timerClassFor("finale", "typed")).toBe("calm");
    expect(windowMsFor("finale", "typed", "E", false)).toBe(0);
    // und die Gegenprobe: unter dem alten Pool wäre sie getaktet gewesen
    expect(windowMsFor("boss", "typed", "E", false)).toBeGreaterThan(0);
  });
});

describe("R5-W2 · H1 · die Steh-Uhr ist TRAGEND, nicht Zierde", () => {
  const TASKS = JSON.parse(
    readFileSync(
      resolve(__dirname, "../../../../content/corpus/stories/g1.st.lost-pages/paint/ch01.tasks.v2.json"),
      "utf8",
    ),
  ) as { items: GameTaskV2[] };
  const byId = (suffix: string): GameTaskV2 => TASKS.items.find((t) => t.id.endsWith(suffix))!;

  it("ungestartet steht sie still — Lesen ist gratis", () => {
    expect(armedClockMs(6000, 0)).toBe(0);
  });

  it("jede Berührung lässt sie von vorn laufen", () => {
    expect(armedClockMs(6000, 1)).toBe(6000);
    expect(armedClockMs(6000, 7)).toBe(6000); // der Zähler ist ein Neustart, kein Verbrauch
  });

  it("eine ruhige Karte bleibt ruhig, egal wie oft man sie anfasst", () => {
    expect(armedClockMs(0, 12)).toBe(0);
  });

  it("ohne sie wäre die Memory-Karte des Bosses per Konstruktion unlösbar", () => {
    // Die Zahl kommt aus der AUSGELIEFERTEN Maschine, nicht aus einer Schätzung:
    // `solve()` deckt bei perfektem Gedächtnis auf, ein Kind braucht mehr.
    const me1 = byId("boss.me1");
    const moves = MACHINES.memory.solve(MACHINES.memory.init(me1) as never).length;
    expect(moves, "die Memory-Karte ist der Grund für das Ruling").toBeGreaterThan(4);

    const window = windowMsFor("boss", "memory", "E", false);
    // Karten-Uhr (die Lesart VOR dem Ruling): das Budget wird geteilt
    const wholeCardPerMove = window / moves;
    // Steh-Uhr (Kokis Lesart): jeder Zug bekommt das ganze Fenster
    const armedPerMove = armedClockMs(window, 1);

    expect(wholeCardPerMove, "unter einer Karten-Uhr blieben je Zug Millisekunden").toBeLessThan(1000);
    expect(armedPerMove, "unter der Steh-Uhr bekommt jeder Zug das volle Fenster").toBe(window);
    expect(armedPerMove).toBeGreaterThan(wholeCardPerMove * moves - 1);
  });

  it("und die drei Karten, die ein sauberer Kampf wirklich stellt, sind Zug-Karten", () => {
    // Ein sauberer Kampf auf Stufe E öffnet drei Fenster und bedient sie in
    // Dateireihenfolge. Jede dieser Karten wird in EINZELNEN Zügen gespielt,
    // also greift die Steh-Uhr für jeden davon.
    for (const id of ["boss.m1", "boss.m2", "boss.o1"]) {
      const t = byId(id);
      const m = MACHINES[t.kind];
      const moves = m.solve(m.init(t) as never).length;
      expect(moves, `${id} hat gar keinen Zug`).toBeGreaterThan(0);
      expect(windowMsFor("boss", t.kind, "E", false), `${id} muesste getaktet sein`).toBeGreaterThan(0);
    }
  });
});
