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
