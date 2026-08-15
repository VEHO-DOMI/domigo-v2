// R5-W4 · B4 · R44 — DER STILLE ANKER, in beide Richtungen bewiesen.
//
// Koki, 15.08.2026, über die Krakel-Staffeleien: »so wie sie platziert sind,
// machen sie keinen Sinn, gequetscht neben die Gegner. Jetzt komplett raus,
// später besprechen wir, wo sie hingehören.«
//
// »Komplett raus« heißt hier NICHT »ausgebaut«: der `C`-Glyph bleibt, das
// Warp-Ziel bleibt, alle vier `checkpoint-*`-Gesetze bleiben. Nur SEHEN soll man
// nichts. Ein Test, der bloß beweist, dass nichts passiert, wäre wertlos — er
// wäre auch grün, wenn die Checkpoints ganz kaputt wären. Deshalb misst jeder
// Block hier ein A/B: dieselbe Welt, einmal `silent`, einmal `krakel`, und die
// Zahl MUSS sich bewegen. Ein Tamper, der nichts verändert, beweist nichts.
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { Sim, type SimEvent } from "./sim.ts";
import { IDLE_PAD, type Pad } from "./player.ts";
import { checkLevelLaws, type PaintLevel, parsePaintLevel } from "./level.ts";
import { SUBS, TILE } from "./paint.ts";

const WIDE = 40;
const row = (fill: string): string => fill.repeat(WIDE);
const put = (base: string, at: number, glyph: string): string => base.slice(0, at) + glyph + base.slice(at + 1);

const STAND_R = 17; // the walking row; the floor sits at 18/19
const SPAWN_C = 3;
const ANCHOR_C = 8;
const INK_C = 12;

/** A flat corridor with a checkpoint at c8 and an ink pool at c12–13. */
const corridorRows = (): string[] => {
  let air = row(".");
  air = put(air, SPAWN_C, "S");
  air = put(air, ANCHOR_C, "C");
  air = put(air, INK_C, "w");
  air = put(air, INK_C + 1, "w");
  air = put(air, WIDE - 4, "X");
  return [row("#"), ...Array.from({ length: 16 }, () => row(".")), air, row("#"), row("#")];
};

const level = (style: PaintLevel["checkpointStyle"], rows = corridorRows()): PaintLevel => ({
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
  ...(style === undefined ? {} : { checkpointStyle: style }),
  phases: [{ id: "p1", nameDe: "Test", surface: "normal", plates: {}, rows, entities: [], links: [], exit: { to: "done" } }],
});

const simFor = (style: PaintLevel["checkpointStyle"]): Sim =>
  new Sim({ level: level(style), phaseId: "p1", grantedAbilities: () => [], freedCageIds: () => [] });

/** Walk right for `ticks` and keep every event. */
const walk = (sim: Sim, ticks: number): SimEvent[] => {
  const pad: Pad = { ...IDLE_PAD, right: true };
  const all: SimEvent[] = [];
  for (let i = 0; i < ticks; i++) all.push(...sim.step(pad));
  return all;
};

const krakelToasts = (evs: SimEvent[]): SimEvent[] => evs.filter((e) => e.type === "toast" && /Krakel/.test(e.msg));
const colOf = (sim: Sim): number => Math.floor(sim.player.x / SUBS / TILE);

describe("R44 · der stille Anker sagt nichts …", () => {
  it("TAMPER-PAAR: dieselbe Welt sagt 0-mal »Krakel« still und 1-mal laut", () => {
    // This is the whole proof. If the silent run alone were asserted, the test
    // would also pass on a build where checkpoints never fire at all.
    const silent = krakelToasts(walk(simFor("silent"), 200)).length;
    const loud = krakelToasts(walk(simFor("krakel"), 200)).length;

    expect(silent, "eine stille Kammer feiert nichts").toBe(0);
    expect(loud, "…und dieselbe Welt mit Zeremonie feiert genau einmal").toBe(1);
    expect(loud).toBeGreaterThan(silent); // the number MOVED
  });

  it("ein Kapitel ohne Erklärung behält die Zeremonie, die es immer hatte", () => {
    // ch02–ch04 declare nothing yet and must not go quiet behind Koki's back.
    expect(krakelToasts(walk(simFor(undefined), 200)).length).toBe(1);
  });
});

describe("… und ankert trotzdem", () => {
  it("der Anker wandert auf die Checkpoint-Spalte, ob still oder laut", () => {
    for (const style of ["silent", "krakel"] as const) {
      const sim = simFor(style);
      expect(sim.respawnCell?.c, `${style}: Startanker`).toBe(SPAWN_C);
      walk(sim, 90); // far enough to pass c8, not far enough to reach the ink
      expect(sim.respawnCell?.c, `${style}: der Anker hat gefasst`).toBe(ANCHOR_C);
    }
  });

  it("die Rückkehr aus der Tinte landet am stillen Anker, nicht am Start", () => {
    const sim = simFor("silent");
    const pad: Pad = { ...IDLE_PAD, right: true };
    // Measured ON the splash tick, not at the end of the walk: the warp hands
    // out iframes, so a child that keeps holding right simply wades through the
    // pool the second time and ends up east of it. Reading the column 400 ticks
    // later would have measured that, not the return.
    let splashed = false;
    for (let i = 0; i < 400 && !splashed; i++) {
      splashed = sim.step(pad).some((e) => e.type === "toast" && e.msg === "Platsch!");
    }
    expect(splashed, "die Tinte spricht weiter").toBe(true);
    // R44 changed how the anchor SHOWS itself, not what it catches.
    expect(colOf(sim)).toBe(ANCHOR_C);
    expect(colOf(sim)).not.toBe(SPAWN_C);
  });
});

// ── Das Gesetz: Stille muss ERKLÄRT sein ────────────────────────────────────
describe("R44 · checkpoint-silent", () => {
  const lawsOf = (lvl: PaintLevel): string[] => checkLevelLaws(parsePaintLevel(lvl)).map((f) => f.law);
  const shipped = (style: PaintLevel["checkpointStyle"]): PaintLevel =>
    parsePaintLevel({ ...level(style), draft: false });

  it("ein Kapitel mit `C` und ohne Erklärung fällt durch", () => {
    const f = checkLevelLaws(shipped(undefined)).find((x) => x.law === "checkpoint-silent");
    expect(f, "die offene Frage ist der Verstoß").toBeDefined();
    expect(f!.detail).toMatch(/p1.*declares no checkpointStyle/);
  });

  it("beide Antworten sind gültige Antworten", () => {
    for (const style of ["silent", "krakel"] as const) {
      expect(lawsOf(shipped(style)), style).not.toContain("checkpoint-silent");
    }
  });

  it("ein Kapitel ganz ohne Checkpoint muss nichts erklären", () => {
    const noC = corridorRows().map((r) => r.replace("C", "."));
    expect(lawsOf(parsePaintLevel({ ...level(undefined, noC), draft: false }))).not.toContain("checkpoint-silent");
  });

  it("ein getippter Stil ist ein lauter Fehler, keine stille Zeremonie", () => {
    // The failure mode this guards: `"quiet"` would fall through the enum and the
    // easels would come back, with the level file looking configured.
    expect(() => parsePaintLevel(level("quiet" as PaintLevel["checkpointStyle"]))).toThrow(/checkpointStyle/);
  });

  it("das ausgelieferte ch01 erklärt sich", () => {
    const shippedLevel = JSON.parse(
      fs.readFileSync(
        path.resolve(__dirname, "../../../content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json"),
        "utf8",
      ),
    ) as PaintLevel;
    expect(shippedLevel.checkpointStyle).toBe("silent");
  });
});

// ── Die Render-Hälfte ───────────────────────────────────────────────────────
// A grid law cannot see a GameObject, and this repo has no headless Phaser. So
// the scene's half is policed the way the other untestable surfaces are
// (treasure-render.test.ts, ent-size.test.ts): read the source, and — the part
// that matters — assert the drawing code is still THERE. A silence achieved by
// deleting the art would make every check above vacuous and would throw away
// the one-word road back that R44 explicitly keeps open.
describe("R44 · die Szene fragt den Stil, statt ihn zu erraten", () => {
  const src = fs.readFileSync(path.resolve(__dirname, "PaintScene.ts"), "utf8");

  /** The `C` arm of buildProps' glyph chain, up to the next `else if`/close. */
  const checkpointArm = (): string => {
    const at = src.indexOf('} else if (g === "C"');
    if (at < 0) throw new Error("der C-Zweig ist weg — dieser Test ist blind, nicht grün");
    const end = src.indexOf("\n        }\n      }\n    }", at);
    if (end < 0) throw new Error("der C-Zweig schließt nicht — Test blind");
    return src.slice(at, end);
  };

  it("VAKUITÄT: alle drei Zeichen-Arme stehen noch da", () => {
    const arm = checkpointArm();
    expect(arm).toContain("pb-krakel_a"); // the painted body
    expect(arm).toContain("pb-checkpoint_easel"); // the legacy fallback
    expect(arm).toContain("add.graphics()"); // …and the procedural pole-and-pennant
    expect(arm.length).toBeGreaterThan(600);
  });

  it("der Zeichen-Zweig hängt am Stil", () => {
    expect(src).toContain('} else if (g === "C" && this.checkpointsDrawn) {');
  });

  it("…und das Aktiv-Licht ebenso", () => {
    expect(src).toContain("if (this.checkpointsDrawn && this.checkpointImgs.size > 0");
  });

  it("der Schalter liest das Level und entscheidet nichts selbst", () => {
    expect(src).toContain('return this.cfg.level.checkpointStyle !== "silent";');
    // exactly one place decides it, so a second opinion cannot drift from the first
    expect([...src.matchAll(/checkpointStyle/g)].length).toBe(1);
  });
});
