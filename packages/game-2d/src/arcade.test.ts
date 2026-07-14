import { describe, expect, it } from "vitest";
import type { GrammarItem, VocabItem } from "@domigo/content-schema";
import type { ResolvedItem } from "@domigo/game-core";
import { ARCADE, canJump, comboPoints, flyerOffset, groundAt, jumpCut, parseArcadeLevel, quickfireFor, TINTENLAUF_ROWS, walkerShouldTurn } from "./arcade.ts";

// ── the physics feel is pinned (numbers may tune; behaviors must hold) ──────

describe("jump feel", () => {
  it("variable height: releasing jump clamps a fast ascent, never a slow one", () => {
    expect(jumpCut(ARCADE.jumpVelocity)).toBe(ARCADE.jumpCutVelocity);
    expect(jumpCut(-100)).toBe(-100); // already slower than the cut → untouched
    expect(jumpCut(200)).toBe(200); // falling → untouched
  });

  it("coyote time + jump buffering both open the jump window", () => {
    expect(canJump(1000, 1000, 1000)).toBe(true); // grounded, fresh press
    expect(canJump(1000, 1000 - ARCADE.coyoteMs, 1000)).toBe(true); // late jump at a ledge
    expect(canJump(1000, 1000 - ARCADE.coyoteMs - 1, 1000)).toBe(false); // too late
    expect(canJump(1000, 1000, 1000 - ARCADE.bufferMs)).toBe(true); // early press, buffered
    expect(canJump(1000, 1000, 1000 - ARCADE.bufferMs - 1)).toBe(false); // press too stale
  });
});

// ── level parsing + the authored level validates itself ─────────────────────

describe("parseArcadeLevel", () => {
  it("throws loudly on authoring mistakes (this is code-side content)", () => {
    expect(() => parseArcadeLevel(["##", "#"])).toThrow(/rectangular/);
    expect(() => parseArcadeLevel(["S?", "##"])).toThrow(/unknown glyph/);
    expect(() => parseArcadeLevel(["..", "##"])).toThrow(/one S and one X/);
  });

  const level = parseArcadeLevel(TINTENLAUF_ROWS);

  it("Tintenlauf parses: rectangular, start, exit, all entity classes present", () => {
    expect(level.w).toBe(64);
    expect(level.h).toBe(15);
    expect(level.enemies.length).toBeGreaterThanOrEqual(5);
    expect(new Set(level.enemies.map((e) => e.kind)).size).toBe(3); // all three kinds
    expect(level.letters.length).toBeGreaterThanOrEqual(8);
    expect(level.oneWays.length).toBeGreaterThan(0);
  });

  it("every enemy spawn is sane: walkers/hoppers stand on ground, flyers float", () => {
    for (const e of level.enemies) {
      if (e.kind === "flyer") continue;
      expect(groundAt(level, e.c, e.r + 1)).toBe(true);
    }
  });

  it("no letter or the start/exit is buried inside a solid", () => {
    const solid = new Set(level.solids.map((s) => `${s.c},${s.r}`));
    for (const l of level.letters) expect(solid.has(`${l.c},${l.r}`)).toBe(false);
    expect(solid.has(`${level.start.c},${level.start.r}`)).toBe(false);
    expect(solid.has(`${level.exit.c},${level.exit.r}`)).toBe(false);
  });

  it("the start stands on ground (the run begins on footing, not in the air)", () => {
    expect(groundAt(level, level.start.c, level.start.r + 1)).toBe(true);
  });
});

describe("walker edge-turn (the Keen slug rule)", () => {
  const lvl = parseArcadeLevel([
    "S..X",
    "##..",
  ]);
  it("turns at a cliff and at a wall, keeps going on solid footing", () => {
    expect(walkerShouldTurn(lvl, 0, 0, 1)).toBe(false); // ground ahead-below
    expect(walkerShouldTurn(lvl, 1, 0, 1)).toBe(true); // cliff ahead
    const walled = parseArcadeLevel(["S#.X", "####"]);
    expect(walkerShouldTurn(walled, 0, 0, 1)).toBe(true); // wall ahead
  });
});

describe("flyer bob", () => {
  it("is bounded by the amplitude and deterministic per seed", () => {
    for (const t of [0, 250, 700, 1600]) {
      expect(Math.abs(flyerOffset(t, 3))).toBeLessThanOrEqual(ARCADE.flyerAmp);
    }
    expect(flyerOffset(333, 5)).toBe(flyerOffset(333, 5));
  });
});

// ── quickfire chips: one brain, language-consistent, always 3 ───────────────

const vocab = (id: string, en: string, de: string, d = `meaning of ${en}`): ResolvedItem => ({
  kind: "vocab",
  item: {
    id, w: en, g: de, d, s: `The ___ is here.`,
    sAnswers: [{ text: en, tier: "full" }],
    dAnswers: [{ text: en, tier: "full" }],
    translation: { deToEn: [{ text: en, tier: "full" }], enToDe: [{ text: de, tier: "full" }] },
  } as unknown as VocabItem,
});
const mc = (id: string, answer: string, distractors: string[]): ResolvedItem => ({
  kind: "grammar",
  item: { id, format: "multiple-choice", prompt: { text: "She ___ to school." }, answers: [{ text: answer, tier: "full" }], distractors } as unknown as GrammarItem,
});
const ITEMS: ResolvedItem[] = [
  vocab("v.time", "timetable", "der Stundenplan"),
  vocab("v.sub", "subject", "das Fach"),
  vocab("v.break", "break", "die Pause"),
  mc("g.mc", "goes", ["go", "going", "gone"]),
];

describe("quickfireFor", () => {
  it("vocab: 3 chips, contains the pool's answer, decoys stay in the answer's language", () => {
    const qf = quickfireFor(ITEMS, 1)!; // idx 1 → enToDe (German answers)
    expect(qf.kind).toBe("vocab");
    expect(qf.pool).toBe("enToDe");
    expect(qf.chips).toHaveLength(3);
    expect(qf.chips).toContain(qf.answer);
    expect(qf.answer).toBe("das Fach");
    for (const chip of qf.chips) expect(["das Fach", "der Stundenplan", "die Pause"]).toContain(chip);
  });

  it("grammar: chips come from the authored distractors", () => {
    const qf = quickfireFor(ITEMS, 3)!;
    expect(qf.kind).toBe("grammar");
    expect(qf.chips).toHaveLength(3);
    expect(qf.chips).toContain("goes");
    expect(qf.prompt).toContain("___");
  });

  it("is deterministic and never throws on thin pools (returns null instead)", () => {
    expect(quickfireFor(ITEMS, 1)).toEqual(quickfireFor(ITEMS, 1));
    expect(quickfireFor([vocab("v.solo", "alone", "allein")], 0)).toBeNull(); // no decoys
    expect(quickfireFor([], 0)).toBeNull();
  });

  it("rotates pools by contact index (no two consecutive identical directions)", () => {
    const a = quickfireFor(ITEMS, 0)!;
    const b = quickfireFor(ITEMS, 1)!;
    expect(a.pool).not.toBe(b.pool);
  });
});

describe("comboPoints", () => {
  it("escalates with the streak and caps (Keen point ladders)", () => {
    expect(comboPoints(1)).toBe(100);
    expect(comboPoints(4)).toBe(400);
    expect(comboPoints(99)).toBe(800); // capped
    expect(comboPoints(0)).toBe(100); // floor
  });
});
