import { describe, expect, it } from "vitest";
import { validateAssignmentDraft, type AssignmentDraft, type DraftSection } from "./assignment-draft.ts";

function section(over: Partial<DraftSection> = {}): DraftSection {
  return { position: 0, kind: "vocab", itemIds: ["g2u01.w.along"], weightPct: 100, ...over };
}

function draft(over: Partial<AssignmentDraft> = {}): AssignmentDraft {
  return {
    title: "Schularbeit 1",
    mode: "mock_test",
    classId: "class-1",
    attemptsPerTest: 1,
    sections: [section()],
    ...over,
  };
}

describe("validateAssignmentDraft", () => {
  it("accepts a well-formed single-section mock test", () => {
    expect(validateAssignmentDraft(draft())).toEqual([]);
  });

  it("accepts a well-formed practice assignment ignoring weights", () => {
    const d = draft({ mode: "practice", sections: [section({ weightPct: 0 })] });
    expect(validateAssignmentDraft(d)).toEqual([]);
  });

  it("requires a title, a class, and 1..3 attempts", () => {
    expect(validateAssignmentDraft(draft({ title: "  " }))).toContain("Give the assignment a title.");
    expect(validateAssignmentDraft(draft({ classId: "" }))).toContain("Choose a class.");
    expect(validateAssignmentDraft(draft({ attemptsPerTest: 4 }))).toContain("Attempts per test must be between 1 and 3.");
    expect(validateAssignmentDraft(draft({ attemptsPerTest: 0 }))).toContain("Attempts per test must be between 1 and 3.");
  });

  it("requires at least one section", () => {
    expect(validateAssignmentDraft(draft({ sections: [] }))).toContain("Add at least one section.");
  });

  it("requires a mock test's weights to sum to exactly 100 with no zero-weight section", () => {
    const two = draft({
      sections: [section({ position: 0, weightPct: 60 }), section({ position: 1, itemIds: ["g2u01.w.busy"], weightPct: 30 })],
    });
    expect(validateAssignmentDraft(two)).toContain("Mock-test section weights must add up to exactly 100%.");

    const zero = draft({
      sections: [section({ position: 0, weightPct: 100 }), section({ position: 1, kind: "grammar", itemIds: ["g2u01.gi.x"], weightPct: 0 })],
    });
    const errs = validateAssignmentDraft(zero);
    expect(errs).toContain("Every mock-test section needs a weight above 0%.");
  });

  it("requires item sections to have items and rejects reserved / duplicate items", () => {
    expect(validateAssignmentDraft(draft({ sections: [section({ itemIds: [] })] }))).toContain("Section 1: pick at least one item.");

    const reserved = validateAssignmentDraft(draft(), { reservedIds: new Set(["g2u01.w.along"]) });
    expect(reserved.some((e) => e.includes("reserved"))).toBe(true);

    const dup = draft({
      sections: [
        section({ position: 0, itemIds: ["g2u01.w.along"], weightPct: 50 }),
        section({ position: 1, kind: "grammar", itemIds: ["g2u01.w.along"], weightPct: 50 }),
      ],
    });
    expect(validateAssignmentDraft(dup).some((e) => e.includes("used more than once"))).toBe(true);
  });

  it("flags non-contiguous section positions", () => {
    const d = draft({
      sections: [section({ position: 0, weightPct: 50 }), section({ position: 5, kind: "grammar", itemIds: ["g2u01.gi.x"], weightPct: 50 })],
    });
    expect(validateAssignmentDraft(d)).toContain("Section positions are not contiguous.");
  });

  it("requires reference kinds to name their authored source", () => {
    const listening = draft({ mode: "practice", sections: [section({ kind: "listening", itemIds: [], listeningTaskId: null, weightPct: 0 })] });
    expect(validateAssignmentDraft(listening)).toContain("Section 1: choose a listening task.");
    const writing = draft({ mode: "practice", sections: [section({ kind: "writing", itemIds: [], writingPromptId: null, weightPct: 0 })] });
    expect(validateAssignmentDraft(writing)).toContain("Section 1: choose a writing prompt.");
  });

  it("rejects a malformed custom Notenschlüssel on a mock test", () => {
    const d = draft({ notenSchluessel: { 1: 80, 2: 90, 3: 65, 4: 50 } }); // not descending
    expect(validateAssignmentDraft(d).some((e) => e.includes("Notenschlüssel"))).toBe(true);
  });
});

// ── C-1 · checkup mode (doc 21 §3: Σ=20, one item = one point) ───────────────

function checkupSection(over: Partial<DraftSection> & { points: number; checkupKind?: "words-phrases" | "translations" | "definitions" | "grammar" | "picture-mc" }): DraftSection {
  const { points, checkupKind = "words-phrases", ...rest } = over;
  const kind = checkupKind === "grammar" ? "grammar" : "vocab";
  return {
    position: 0,
    kind,
    itemIds: Array.from({ length: points }, (_, i) => `g2u01.${kind === "grammar" ? "gi" : "w"}.${checkupKind}-${i}`),
    weightPct: 0,
    sectionConfig: { checkupKind, points },
    ...rest,
  };
}

describe("validateAssignmentDraft — checkup mode (C-1)", () => {
  const checkupDraft = (over: Partial<AssignmentDraft> = {}): AssignmentDraft =>
    draft({
      mode: "checkup",
      sections: [
        checkupSection({ position: 0, points: 8 }),
        checkupSection({ position: 1, points: 6, checkupKind: "grammar" }),
        checkupSection({ position: 2, points: 6, checkupKind: "translations" }),
      ],
      ...over,
    });

  it("accepts a well-formed /20 checkup (weights ignored)", () => {
    expect(validateAssignmentDraft(checkupDraft())).toEqual([]);
  });

  it("rejects a checkup whose sections do not sum to exactly 20", () => {
    const d = checkupDraft({
      sections: [checkupSection({ position: 0, points: 8 }), checkupSection({ position: 1, points: 6, checkupKind: "grammar" })],
    });
    expect(validateAssignmentDraft(d).some((e) => e.includes("/20") && e.includes("14"))).toBe(true);
  });

  it("rejects a section whose item count does not match its points", () => {
    const short = checkupSection({ position: 0, points: 8 });
    short.itemIds = short.itemIds.slice(0, 5);
    const d = checkupDraft({
      sections: [short, checkupSection({ position: 1, points: 6, checkupKind: "grammar" }), checkupSection({ position: 2, points: 6, checkupKind: "translations" })],
    });
    expect(validateAssignmentDraft(d).some((e) => e.includes("one item = one point"))).toBe(true);
  });

  it("rejects a checkup section without a config, and the deferred picture-mc kind", () => {
    const bare = checkupDraft({
      sections: [{ position: 0, kind: "vocab", itemIds: ["g2u01.w.along"], weightPct: 0 }],
    });
    expect(validateAssignmentDraft(bare).some((e) => e.includes("section config"))).toBe(true);

    const pic = checkupDraft({ sections: [checkupSection({ position: 0, points: 20, checkupKind: "picture-mc" })] });
    expect(validateAssignmentDraft(pic).some((e) => e.includes("deferred"))).toBe(true);
  });

  it("rejects a kind mismatch (grammar config on a vocab section)", () => {
    const wrong = checkupSection({ position: 0, points: 20, checkupKind: "grammar" });
    wrong.kind = "vocab";
    const d = checkupDraft({ sections: [wrong] });
    expect(validateAssignmentDraft(d).some((e) => e.includes("must be a grammar section"))).toBe(true);
  });

  it("still rejects reserved items inside a checkup (J-1)", () => {
    const d = checkupDraft();
    const someId = d.sections[0]!.itemIds[0]!;
    expect(validateAssignmentDraft(d, { reservedIds: new Set([someId]) }).some((e) => e.includes("reserved"))).toBe(true);
  });

  it("validates displayConfig on any mode", () => {
    expect(validateAssignmentDraft(checkupDraft({ displayConfig: { feedback: "on-submit", showScore: "on-submit" } }))).toEqual([]);
    expect(
      validateAssignmentDraft(checkupDraft({ displayConfig: { feedback: "whenever" } as never })).some((e) =>
        e.includes("feedback setting"),
      ),
    ).toBe(true);
  });
});
