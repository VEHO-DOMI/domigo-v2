import { describe, expect, it } from "vitest";
import type { GrammarFormat, GrammarItem, VocabItem } from "@domigo/content-schema";
import type { ResolvedItem } from "@domigo/game-core";
import { battleBank, battlePlan, DRAIN_MAX, drainAlpha, lettersFor, primaryAnswer } from "./battle.ts";

// Minimal casts — battle logic reads id, format, answers, distractors, and the
// four vocab answer pools (all schema-guaranteed on approved items).
const vocab = (id: string, en: string, de: string): ResolvedItem => ({
  kind: "vocab",
  item: {
    id,
    sAnswers: [{ text: en, tier: "full" }],
    dAnswers: [{ text: en, tier: "full" }],
    translation: { deToEn: [{ text: en, tier: "full" }], enToDe: [{ text: de, tier: "full" }] },
  } as unknown as VocabItem,
});
const grammar = (id: string, format: GrammarFormat, answer: string, distractors: string[] = []): ResolvedItem => ({
  kind: "grammar",
  item: { id, format, answers: [{ text: answer, tier: "full" }], distractors } as unknown as GrammarItem,
});

const ITEMS: ResolvedItem[] = [
  vocab("g2u01.w.timetable", "timetable", "der Stundenplan"),
  grammar("g2u01.gi.ps.gf.001", "gap-fill", "goes", ["go", "going", "gone"]),
  vocab("g2u01.w.subject", "subject", "das Fach"),
  grammar("g2u01.gi.ps.mc.001", "multiple-choice", "does", ["do", "doing", "done"]),
];

describe("battlePlan — deterministic per-node variety", () => {
  it("rotates vocab pools by node order (carrier opens the zone)", () => {
    const plan = battlePlan(ITEMS);
    expect(plan[0]!.pool).toBe("carrier");
    expect(plan[2]!.pool).toBe("enToDe"); // node idx 2 → third rotation slot
    expect(plan[1]!.pool).toBeNull(); // grammar nodes have no vocab pool
    expect(plan[3]!.pool).toBeNull();
  });

  it("gives every second node a word bank (when the item is bank-friendly)", () => {
    const plan = battlePlan(ITEMS);
    expect(plan[0]!.bank).toBeNull(); // even node: no bank
    expect(plan[1]!.bank).not.toBeNull(); // odd gap-fill node: bank
    expect(plan[1]!.bank).toContain("goes");
  });

  it("alternates multiple-choice between buttons and dropdown cloze", () => {
    const mcAt = (idx: number) => {
      const items = ITEMS.map((r, i) => (i === idx ? grammar("g.mc", "multiple-choice", "does", ["do", "doing", "done"]) : r));
      return battlePlan(items)[idx]!;
    };
    expect(mcAt(0).dropdown).toBe(false);
    expect(mcAt(1).dropdown).toBe(true);
    expect(mcAt(1).bank).toBeNull(); // choice nodes never get a bank on top
  });

  it("is deterministic — same items, same plan", () => {
    expect(battlePlan(ITEMS)).toEqual(battlePlan(ITEMS));
  });
});

describe("battleBank — the stolen word among decoys", () => {
  const RICH = [...ITEMS, vocab("g2u01.w.break", "break", "die Pause")];

  it("always contains the correct answer for the asked pool", () => {
    const bank = battleBank(RICH, 2, "enToDe");
    expect(bank).toContain("das Fach");
  });

  it("keeps German banks German: enToDe decoys come only from sibling enToDe answers", () => {
    const bank = battleBank(RICH, 2, "enToDe")!;
    expect(bank).toEqual(expect.arrayContaining(["das Fach", "der Stundenplan", "die Pause"]));
    expect(bank).not.toContain("goes"); // English grammar words never pad a German bank
    // …and a thin German pool (one sibling = one decoy) yields NO bank at all:
    expect(battleBank(ITEMS, 2, "enToDe")).toBeNull();
  });

  it("English-answer pools may borrow cross-kind English decoys", () => {
    const bank = battleBank(ITEMS, 2, "carrier")!; // vocab "subject", English answers
    expect(bank).toContain("subject");
    expect(bank).toContain("timetable"); // vocab sibling first
    expect(bank!.some((w) => ["goes", "go", "going", "gone", "does"].includes(w))).toBe(true); // grammar padding
  });

  it("prefers authored distractors for grammar items", () => {
    const bank = battleBank(ITEMS, 1, null)!;
    expect(bank).toEqual(expect.arrayContaining(["goes", "go", "going", "gone"]));
    expect(bank.length).toBeLessThanOrEqual(5);
  });

  it("returns null for multi-blank answers and thin decoy pools", () => {
    const multi = [grammar("g.multi", "gap-fill", "was | were"), ...ITEMS.slice(1)];
    expect(battleBank(multi, 0, null)).toBeNull();
    const thin = [vocab("v.solo", "alone", "allein")];
    expect(battleBank(thin, 0, "carrier")).toBeNull();
  });

  it("shuffles deterministically by item id (no RNG)", () => {
    expect(battleBank(ITEMS, 1, null)).toEqual(battleBank(ITEMS, 1, null));
  });

  it("excludes non-bank formats (sentence-building keeps its tactile tray)", () => {
    const sb = [grammar("g.sb", "sentence-building", "I like school"), ...ITEMS.slice(1)];
    expect(battleBank(sb, 0, null)).toBeNull();
  });
});

describe("lettersFor — how the word flies home", () => {
  it("short answers fly letter by letter", () => {
    const r = lettersFor("timetable");
    expect(r).toEqual({ kind: "letters", chars: [..."timetable"] });
  });

  it("long or multi-blank answers glide back whole", () => {
    expect(lettersFor("She goes to school every day").kind).toBe("whole");
    const multi = lettersFor("was | were");
    expect(multi).toEqual({ kind: "whole", text: "was, were" });
  });

  it("empty answers degrade to a whole (empty) glide", () => {
    expect(lettersFor("").kind).toBe("whole");
  });
});

describe("drainAlpha — the color-return veil", () => {
  it("is strongest before the first win and zero when the zone is cleared", () => {
    expect(drainAlpha(0, 4)).toBe(DRAIN_MAX);
    expect(drainAlpha(4, 4)).toBe(0);
  });

  it("steps down monotonically per solved node", () => {
    const steps = [0, 1, 2, 3, 4].map((n) => drainAlpha(n, 4));
    for (let i = 1; i < steps.length; i += 1) expect(steps[i]!).toBeLessThan(steps[i - 1]!);
  });

  it("clamps stale saves and guards empty zones (never NaN, never negative)", () => {
    expect(drainAlpha(7, 4)).toBe(0); // stale cleared indices beyond today's count
    expect(drainAlpha(0, 0)).toBe(0); // empty zone: no veil, no division
    expect(drainAlpha(-1, 4)).toBe(DRAIN_MAX);
    expect(drainAlpha(Number.NaN, 4)).toBe(0);
  });
});

describe("primaryAnswer", () => {
  it("resolves the full-tier answer for the asked pool", () => {
    expect(primaryAnswer(ITEMS[0]!, "enToDe")).toBe("der Stundenplan");
    expect(primaryAnswer(ITEMS[0]!, null)).toBe("timetable"); // null → carrier
    expect(primaryAnswer(ITEMS[1]!, null)).toBe("goes");
  });
});
