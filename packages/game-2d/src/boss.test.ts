import { describe, expect, it } from "vitest";
import type { GrammarItem, VocabItem } from "@domigo/content-schema";
import type { ResolvedItem } from "@domigo/game-core";
import { parseArcadeLevel, type ArcadeHeader } from "./arcade.ts";
import { BOSS_TIMING, bossPlan, LANES, stepBoss, windowResolved, type BossPhase, type BossScript } from "./boss.ts";

const SCRIPT: BossScript = {
  id: "test-boss",
  name: "Der Test-Schlinger",
  intro: "Hallo.",
  outro: "Tschüss.",
  knots: 3,
  pattern: [0, 2, 1],
  telegraphMs: { E: 900, M: 750, S: 600 },
  attackMs: 420,
  windowSeconds: { E: 25, M: 20, S: 15 },
  taunts: ["Na?"],
};

function runUntil(phase: BossPhase, kind: BossPhase["kind"], startNow: number, lane: number, attackIdx: number): { phase: BossPhase; now: number } {
  let now = startNow;
  let p = phase;
  for (let i = 0; i < 500; i += 1) {
    if (p.kind === kind) return { phase: p, now };
    const r = stepBoss(p, now, lane, SCRIPT, "E", attackIdx);
    p = r.next;
    now += 50;
  }
  throw new Error(`never reached ${kind}, stuck at ${p.kind}`);
}

describe("boss FSM (bible 27 §3 / doc 25 §5.4)", () => {
  it("enter → idle → telegraph follows the scripted lane pattern", () => {
    let p: BossPhase = { kind: "enter", untilMs: 100 };
    const a = runUntil(p, "telegraph", 0, 1, 0);
    expect((a.phase as { lane: number }).lane).toBe(0); // pattern[0]
    const b = runUntil({ kind: "idle", untilMs: 0 }, "telegraph", 0, 1, 1);
    expect((b.phase as { lane: number }).lane).toBe(2); // pattern[1]
  });

  it("standing in the lane at impact = hit, no window", () => {
    const atk: BossPhase = { kind: "attack", lane: 1, untilMs: 100 };
    const r = stepBoss(atk, 100, 1, SCRIPT, "E", 0);
    expect(r.events.hit).toBe(true);
    expect(r.events.openWindow).toBe(false);
    expect(r.next.kind).toBe("idle");
  });

  it("dodging opens the counter window with the tier's deadline", () => {
    const atk: BossPhase = { kind: "attack", lane: 1, untilMs: 100 };
    const r = stepBoss(atk, 100, 0, SCRIPT, "E", 0);
    expect(r.events.hit).toBe(false);
    expect(r.events.openWindow).toBe(true);
    expect(r.next.kind).toBe("window");
    expect((r.next as { deadlineMs: number }).deadlineMs).toBe(100 + 25_000);
  });

  it("window timeout closes without a heart (idle, no events)", () => {
    const w: BossPhase = { kind: "window", deadlineMs: 100 };
    const r = stepBoss(w, 101, 0, SCRIPT, "E", 0);
    expect(r.next.kind).toBe("idle");
    expect(r.events.hit).toBe(false);
  });

  it("correct answers unravel knots; the last one beats the guardian", () => {
    const a = windowResolved(true, 3, 0);
    expect(a.knotsLeft).toBe(2);
    expect(a.next.kind).toBe("knot");
    const b = windowResolved(true, 1, 0);
    expect(b.knotsLeft).toBe(0);
    expect(b.next.kind).toBe("beaten");
  });

  it("wrong-in-window only closes the window — knots stay, pattern repeats (§2b)", () => {
    const r = windowResolved(false, 2, 0);
    expect(r.knotsLeft).toBe(2);
    expect(r.next.kind).toBe("idle");
  });

  it("INVERSION mode: standing in the lane never registers a hit", () => {
    const atk: BossPhase = { kind: "attack", lane: 1, untilMs: 100 };
    const r = stepBoss(atk, 100, 1, { ...SCRIPT, inversion: true }, "E", 0);
    expect(r.events.hit).toBe(false);
    expect(r.events.openWindow).toBe(true); // being brave still opens the window
  });

  it("telegraph is always readable (≥500ms every tier) and lanes stay in range", () => {
    for (const t of ["E", "M", "S"] as const) expect(SCRIPT.telegraphMs[t]).toBeGreaterThanOrEqual(500);
    for (const lane of SCRIPT.pattern) expect(lane).toBeGreaterThanOrEqual(0), expect(lane).toBeLessThan(LANES);
  });
});

// ---------------------------------------------------------------------------
// bossPlan — production tasks on the rescue machinery
// ---------------------------------------------------------------------------
const vocab = (id: string, en: string, de: string): ResolvedItem => ({
  kind: "vocab",
  item: {
    id, w: en, g: de, d: `meaning of ${en}`, s: `The ___ is here.`,
    sAnswers: [{ text: en, tier: "full" }],
    dAnswers: [{ text: en, tier: "full" }],
    translation: { deToEn: [{ text: en, tier: "full" }], enToDe: [{ text: de, tier: "full" }] },
  } as unknown as VocabItem,
});
const grammar = (id: string): ResolvedItem => ({
  kind: "grammar",
  item: { id, format: "multiple-choice", prompt: { text: "He ___ a pencil." }, answers: [{ text: "has", tier: "full" }], distractors: ["have", "haves", "am"] } as unknown as GrammarItem,
});

describe("bossPlan", () => {
  it("draws 2× knots tasks (a spare per knot) alternating vocab/grammar", () => {
    const items = [vocab("v1", "pencil", "der Bleistift"), vocab("v2", "door", "die Tür"), grammar("g1"), grammar("g2")];
    const plan = bossPlan(items, 3, 7);
    expect(plan.length).toBe(6);
    expect(plan[0]!.presentation).toBe("typed"); // production first
    expect(plan.some((t) => t.kind === "grammar")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// v2.1 level format: boss door + Glühwörter glyphs
// ---------------------------------------------------------------------------
const HEADER: ArcadeHeader = { id: "t", name: "T", fragment: "f", placements: [], seals: [], helpers: [], theme: "schoolhouse", chapter: "ch01" };

describe("level format v2.1", () => {
  it("parses B (boss door) and G (Glühwort); exactly one exit enforced", () => {
    const lvl = parseArcadeLevel(HEADER, [
      "........",
      ".S..G..B",
      "########",
    ]);
    expect(lvl.bossDoor).toEqual({ c: 7, r: 1 });
    expect(lvl.gluehwoerter).toEqual([{ c: 4, r: 1 }]);
    expect(() => parseArcadeLevel(HEADER, ["S.A.B.", "######"])).toThrow(/one exit/);
    expect(() => parseArcadeLevel(HEADER, ["S.....", "######"])).toThrow(/one exit/);
  });

  it("legacy 'A' levels still parse (pedestal, no boss door)", () => {
    const lvl = parseArcadeLevel(HEADER, ["S....A", "######"]);
    expect(lvl.bossDoor).toBeNull();
    expect(lvl.pedestal).toEqual({ c: 5, r: 0 });
  });
});

// ---------------------------------------------------------------------------
// v2.2: poles, in-level door pairs, movers (the calibration round)
// ---------------------------------------------------------------------------
import { checkLevelLaws } from "./arcade.ts";

describe("level format v2.2", () => {
  it("parses poles and door pairs; a door glyph needs exactly two cells", () => {
    const lvl = parseArcadeLevel(HEADER, [
      ".1..|...1.B.",
      "....|.......",
      "S...|.......",
      "############",
    ]);
    expect(lvl.poles.length).toBe(3);
    expect(lvl.doors).toEqual([{ id: "1", a: { c: 1, r: 0 }, b: { c: 8, r: 0 } }]);
    expect(() => parseArcadeLevel(HEADER, ["S.1..B", "######"])).toThrow(/door '1'/);
  });

  it("laws: poles, doors and movers extend reachability", () => {
    // the letter sits on an island reachable ONLY through the door pair;
    // the Glühwort only via the mover ride; the high checkpoint via the pole
    const header = { ...HEADER, movers: [{ c1: 2, r1: 6, c2: 8, r2: 6, w: 2, periodMs: 2600 }] };
    const lvl = parseArcadeLevel(header, [
      "............##L#",
      "............#..#",
      "..C.........#1.#",
      "..|.........####",
      "..|....G........",
      "..|.............",
      "................",
      "S..1........B...",
      "################",
    ]);
    const report = checkLevelLaws(lvl);
    expect(report.errors).toEqual([]);
    // tamper: remove the door pair → the island letter becomes unreachable
    const cut = parseArcadeLevel(HEADER, [
      "............##L#",
      "............#..#",
      "............#..#",
      "............####",
      "................",
      "................",
      "................",
      "S...........B...",
      "################",
    ]);
    expect(checkLevelLaws(cut).errors.some((e) => e.includes("letter"))).toBe(true);
  });
});
