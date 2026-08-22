// ── R5-W8 · S4 · R209d · DIE LEBENSANZEIGE MUSS FALLEN KÖNNEN ────────────────
//
// Drei Zusicherungen, in dieser Reihenfolge:
//   1. DIE KETTE — das ausgelieferte Arena-Band wischt wirklich Schicht für
//      Schicht (2 → 1 → 0). Bis hierher sagte nur `guardianDown: true`, dass
//      der Kampf gewonnen wurde; ein einziger Sprung von 3 auf 0 wäre davon
//      ununterscheidbar gewesen — und genau der WEG ist das, was die
//      Lebensanzeige zeigt (D-551/D-558).
//   2. DER TREIBER — `createFightDriver` fährt dieselbe Kette und hält BEI
//      jedem Wisch an, damit ein stehender Augenblick fotografierbar ist.
//   3. DIE GRENZE — der Treiber kommt an die Schichtzahl gar nicht heran.
//      Als Quelltext-Wächter, mit Tamper-Beweis an einer KOPIE.

import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { Sim, type SimEvent, type TaskRequest } from "./sim.ts";
import { replayPhaseTape } from "./tape.ts";
import { createFightDriver, type FightSurfaces } from "./fight-drive.ts";
import type { PaintLevel } from "./level.ts";
import { IDLE_PAD, type Pad } from "./player.ts";
import { GUARDIAN_SCRIPT } from "./entities.ts";
import { SUBS } from "./paint.ts";

const SRC = path.dirname(new URL(import.meta.url).pathname);
const CORPUS = path.join(SRC, "../../../content/corpus/stories/g1.st.lost-pages/paint");
const level = JSON.parse(fs.readFileSync(path.join(CORPUS, "ch01.level.json"), "utf8")) as PaintLevel;
const proof = JSON.parse(fs.readFileSync(path.join(CORPUS, "ch01.proof.json"), "utf8")) as {
  phases: Record<string, { abilities: string[]; pads: Array<[number, number]> }>;
};
const ARENA = "p4";

/** Die Reihe muss Schicht für Schicht fallen und bei 0 enden. Als eigene
 *  Funktion, damit beide Zusicherungen (Kette und Treiber) DIESELBE Regel
 *  benutzen und nicht zwei Meinungen über »fällt« entstehen. */
export const faellendeReihe = (wipes: readonly number[]): string[] => {
  const errs: string[] = [];
  if (wipes.length === 0) return ["kein einziger Wisch — der Kampf ist nicht erreichbar (D-558)"];
  if (wipes[wipes.length - 1] !== 0) errs.push(`die letzte Schicht bleibt stehen: ${String(wipes[wipes.length - 1])}`);
  for (let i = 1; i < wipes.length; i++) {
    const vor = wipes[i - 1] as number;
    const jetzt = wipes[i] as number;
    if (jetzt !== vor - 1) errs.push(`Sprung statt Schritt: ${vor} → ${jetzt} (Wisch ${i + 1})`);
  }
  return errs;
};

describe("R209d · die Kette: das Arena-Band wischt Schicht für Schicht", () => {
  it("das ausgelieferte p4-Band lässt die Leiste 2 → 1 → 0 fallen", () => {
    const tape = proof.phases[ARENA];
    expect(tape, "ch01.proof.json hat kein p4-Band mehr").toBeDefined();
    const res = replayPhaseTape(level, ARENA, tape as never);
    expect(res.world.guardianDown, "das Band gewinnt den Kampf nicht mehr").toBe(true);
    expect(faellendeReihe(res.wipes).join(" · ")).toBe("");
    // Die Zahl selbst ist Teil des Vertrags: verliert die Tafel eine Schicht,
    // will jemand eine Entscheidung treffen, und diese Zeile ist die Stelle.
    expect(res.wipes, `gefahrene Reihe: ${res.wipes.join(" → ")}`).toEqual([2, 1, 0]);
  });

  it("die Zusicherung selbst hat ein rotes Licht", () => {
    expect(faellendeReihe([]).length).toBeGreaterThan(0);          // gar kein Wisch
    expect(faellendeReihe([2, 1]).length).toBeGreaterThan(0);      // hört vor 0 auf
    expect(faellendeReihe([2, 0]).length).toBeGreaterThan(0);      // Sprung statt Schritt
    expect(faellendeReihe([2, 1, 0]).length).toBe(0);              // …und grün bleibt grün
  });
});

/** Ein Mini-Shell um den echten Sim: genau die fünf Griffe, die der Treiber
 *  bekommt, und sonst nichts. Er modelliert PaintGame nur in dem einen Punkt,
 *  auf den der Treiber angewiesen ist — »eine Karte liegt oben, bis jemand sie
 *  beantwortet«. Alles Zeremonielle wird abgeräumt wie im Band-Shell. */
const arenaShell = (): { tape: { abilities: string[]; pads: Array<[number, number]> }; surfaces: FightSurfaces } => {
  const tape = proof.phases[ARENA] as { abilities: string[]; pads: Array<[number, number]> };
  const abilities = [...tape.abilities];
  const freed: string[] = [];
  const picked: string[] = [];
  let cageHintShown = false;
  let arenaBriefShown = false;
  const sim = new Sim({
    level, phaseId: ARENA,
    grantedAbilities: () => abilities,
    freedCageIds: () => freed,
    cageHintShown: () => cageHintShown,
    arenaBriefShown: () => arenaBriefShown,
    collectedPickupIds: () => picked,
  });
  let pending: TaskRequest | null = null;
  let pad: Pad = { ...IDLE_PAD };
  const handle = (evs: SimEvent[]): void => {
    for (const ev of evs) {
      if (ev.type === "task") pending = ev.req;
      else if (ev.type === "powerup") { if (!abilities.includes(ev.grants)) abilities.push(ev.grants); sim.setOverlay(false); }
      else if (ev.type === "cageFreed") { freed.push(ev.id); sim.setOverlay(false); }
      else if (ev.type === "arenaBrief") { if (!arenaBriefShown) { arenaBriefShown = true; sim.setOverlay(false); } }
      else if (ev.type === "cageHint") { if (!cageHintShown) { cageHintShown = true; sim.setOverlay(false); } }
      else if (ev.type === "tip" || ev.type === "book") { if (!picked.includes(ev.id)) picked.push(ev.id); sim.setOverlay(false); }
    }
  };
  return {
    tape,
    surfaces: {
      press: (p) => { pad = { ...IDLE_PAD, ...p }; },
      step: () => {
        handle(sim.step(pad));
        // der Band-Shell räumt jede Zeremonie ab, sobald ihre Haltezeit
        // abgelaufen ist — ohne das bliebe die Welt nach der Landung stehen
        if (sim.holdTicks === 0 && pending === null) sim.setOverlay(false);
      },
      cardOpen: () => pending !== null,
      solveCard: () => { const p = pending; pending = null; if (p) handle(sim.solveTask(p.ctx)); return true; },
      read: () => {
        const g = sim.world.entities.find((e) => e.role === "guardian");
        return {
          // der kopflose Sim führt keinen Szenen-Takt; der Treiber liest ihn nur
          // für seinen Bericht, nie für eine Entscheidung
          tick: 0,
          knots: sim.world.guardianKnots,
          knotsTotal: GUARDIAN_SCRIPT.E.knots,
          wipeTeil: 0,
          overlay: pending !== null,
          guardian: g ? { state: g.state, x: g.x / SUBS, y: g.y / SUBS } : null,
          hero: { x: sim.player.x / SUBS, y: sim.player.y / SUBS },
        };
      },
    },
  };
};

describe("R209d · der Treiber fährt dieselbe Kette und hält bei jedem Wisch", () => {
  it("meldet Wisch für Wisch, bis die Tafel sauber ist", async () => {
    const shell = arenaShell();
    const driver = createFightDriver(shell.surfaces);
    const ticks = driver.load(shell.tape.pads);
    expect(ticks, "das Band ist leer").toBeGreaterThan(1000);
    const gesehen: number[] = [];
    for (let leg = 0; leg < 8; leg++) {
      const halt = await driver.advance();
      gesehen.push(...halt.wipes);
      if (halt.done) break;
      expect(halt.reason, `Abschnitt ${leg + 1} hielt bei Takt ${String(halt.played)}`).toBe("wisch");
    }
    expect(faellendeReihe(gesehen).join(" · ")).toBe("");
    expect(gesehen).toEqual([2, 1, 0]);
  }, 60_000);
});

// ── 3 · DIE GRENZE ───────────────────────────────────────────────────────────
//
// Ein Treiber, der `hp` setzt, beweist nichts. Diese Prüfung liest den
// QUELLTEXT — dasselbe Netz, das `audio/coverage.test.ts` über `sim.ts` legt —
// und hält fest, dass der Treiber die Schichtzahl gar nicht anfassen kann.

/** Verbotene Griffe im Treiber-Quelltext, als reine Funktion über den Text,
 *  damit der Tamper-Beweis an einer KOPIE laufen kann. */
export const cheatFunde = (src: string): string[] => {
  const code = src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
  const verboten: Array<[RegExp, string]> = [
    [/\.hp\s*(=[^=]|-=|\+=|--|\+\+)/, "schreibt an `hp`"],
    [/guardianKnots\s*(=[^=]|-=|\+=|--|\+\+)/, "schreibt an `guardianKnots`"],
    [/\.knots\s*(=[^=]|-=|\+=|--|\+\+)/, "schreibt an `knots`"],
    [/\bnew Sim\b/, "baut sich einen eigenen Sim"],
    [/\.world\b/, "greift in die Welt"],
    [/\.entities\b/, "greift auf Entitäten zu"],
  ];
  return verboten.filter(([re]) => re.test(code)).map(([, was]) => was);
};

describe("R209d · der Treiber kann nicht schummeln", () => {
  const file = path.join(SRC, "fight-drive.ts");
  const src = fs.readFileSync(file, "utf8");

  it("fasst weder Welt noch Schichtzahl an", () => {
    expect(cheatFunde(src).join(" · ")).toBe("");
  });

  it("…und das rote Licht ist erreichbar (Tamper an einer Kopie)", () => {
    const manipuliert = src.replace(
      "s.step();",
      "s.step(); (s as unknown as { world: { guardianKnots: number } }).world.guardianKnots = 0;",
    );
    expect(manipuliert, "der Tamper hat nichts verändert — er beweist dann auch nichts").not.toBe(src);
    expect(cheatFunde(manipuliert).length).toBeGreaterThan(0);
  });
});
