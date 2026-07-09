import { describe, expect, it } from "vitest";
import {
  assignmentItemIds,
  canRecordAssignAttempt,
  isSessionLive,
  scoreSubmittedSession,
  sessionExpiry,
  type SectionSpec,
} from "./assignment-session.ts";
import type { ScorableAttempt } from "./assignments.ts";

const T0 = new Date(2026, 0, 10, 9, 0, 0);
const at = (min: number) => new Date(T0.getTime() + min * 60_000);

describe("sessionExpiry", () => {
  it("adds the duration in minutes, or null when untimed", () => {
    expect(sessionExpiry(T0, 50)?.getTime()).toBe(at(50).getTime());
    expect(sessionExpiry(T0, null)).toBeNull();
  });
});

describe("isSessionLive", () => {
  it("untimed + unsubmitted is always live", () => {
    expect(isSessionLive({ expiresAt: null, submittedAt: null }, at(9999))).toBe(true);
  });
  it("timed is live before the wall, dead at/after it", () => {
    expect(isSessionLive({ expiresAt: at(50), submittedAt: null }, at(49))).toBe(true);
    expect(isSessionLive({ expiresAt: at(50), submittedAt: null }, at(50))).toBe(false);
  });
  it("a submitted sitting is never live", () => {
    expect(isSessionLive({ expiresAt: at(50), submittedAt: at(10) }, at(5))).toBe(false);
  });
});

describe("assignmentItemIds", () => {
  it("collects the union of section item ids", () => {
    const ids = assignmentItemIds([{ itemIds: ["a", "b"] }, { itemIds: ["b", "c"] }]);
    expect([...ids].sort()).toEqual(["a", "b", "c"]);
  });
});

describe("canRecordAssignAttempt — the server timing wall", () => {
  const allowed = new Set(["g2u01.w.along", "g2u01.gi.x"]);
  const base = { allowedItemIds: allowed, itemId: "g2u01.w.along", now: at(10) };

  it("allows a live, in-assignment attempt", () => {
    expect(canRecordAssignAttempt({ ...base, session: { expiresAt: at(50), submittedAt: null } })).toEqual({ ok: true });
    expect(canRecordAssignAttempt({ ...base, session: { expiresAt: null, submittedAt: null } })).toEqual({ ok: true });
  });

  it("rejects when there is no session", () => {
    expect(canRecordAssignAttempt({ ...base, session: null })).toEqual({ ok: false, reason: "no_session" });
  });

  it("rejects after submit and after the wall (no post-time credit)", () => {
    expect(canRecordAssignAttempt({ ...base, session: { expiresAt: at(50), submittedAt: at(5) } })).toEqual({ ok: false, reason: "submitted" });
    expect(canRecordAssignAttempt({ ...base, now: at(50), session: { expiresAt: at(50), submittedAt: null } })).toEqual({ ok: false, reason: "expired" });
  });

  it("rejects an item that isn't on this assignment (no smuggling)", () => {
    expect(canRecordAssignAttempt({ ...base, itemId: "g9u09.w.nope", session: { expiresAt: at(50), submittedAt: null } })).toEqual({ ok: false, reason: "not_in_assignment" });
  });
});

describe("scoreSubmittedSession — raw attempts → Note", () => {
  const sections: SectionSpec[] = [
    { position: 0, kind: "vocab", itemIds: ["v1", "v2", "v3", "v4", "v5"], weightPct: 60 },
    { position: 1, kind: "grammar", itemIds: ["g1", "g2", "g3", "g4"], weightPct: 40 },
  ];
  const attempt = (itemId: string, tier: ScorableAttempt["tier"], min = 0): ScorableAttempt => ({ itemId, tier, createdAt: at(min) });

  it("weights a mock test and computes the Note from the exact percent", () => {
    // vocab 4/5 = 80%; grammar 2/4 = 50% → 0.6*80 + 0.4*50 = 68 → Note 3
    const attempts = [
      attempt("v1", "correct"), attempt("v2", "correct"), attempt("v3", "correct"), attempt("v4", "correct"), attempt("v5", "wrong"),
      attempt("g1", "correct"), attempt("g2", "correct"), attempt("g3", "wrong"), attempt("g4", "wrong"),
    ];
    const r = scoreSubmittedSession({ mode: "mock_test", sections, attempts });
    expect(r.perSection[0]!.pct).toBe(80);
    expect(r.perSection[1]!.pct).toBe(50);
    expect(r.overallPct).toBeCloseTo(68, 10);
    expect(r.note).toBe(3);
  });

  it("counts unanswered items as 0 against the full section (Schularbeit honesty)", () => {
    // only 2 of 5 vocab answered correct, grammar untouched
    const attempts = [attempt("v1", "correct"), attempt("v2", "correct")];
    const r = scoreSubmittedSession({ mode: "mock_test", sections, attempts });
    expect(r.perSection[0]!.pct).toBe(40); // 2/5
    expect(r.perSection[1]!.pct).toBe(0); // 0/4
    expect(r.overallPct).toBeCloseTo(24, 10); // 0.6*40 + 0.4*0
    expect(r.note).toBe(5);
  });

  it("takes the FIRST attempt per item (no retry credit)", () => {
    const attempts = [
      attempt("v1", "wrong", 1), attempt("v1", "correct", 2), // retry ignored
      attempt("v2", "correct", 1), attempt("v3", "correct", 1), attempt("v4", "correct", 1), attempt("v5", "correct", 1),
      attempt("g1", "correct", 1), attempt("g2", "correct", 1), attempt("g3", "correct", 1), attempt("g4", "correct", 1),
    ];
    const r = scoreSubmittedSession({ mode: "mock_test", sections, attempts });
    expect(r.perSection[0]!.pct).toBe(80); // v1 stays wrong
  });

  it("practice mode is an unweighted mean over all items (weights ignored)", () => {
    // 9 items, all correct → 100% regardless of weights
    const attempts = ["v1", "v2", "v3", "v4", "v5", "g1", "g2", "g3", "g4"].map((id) => attempt(id, "correct"));
    const practiceSections = sections.map((s) => ({ ...s, weightPct: 0 }));
    const r = scoreSubmittedSession({ mode: "practice", sections: practiceSections, attempts });
    expect(r.overallPct).toBe(100);
    expect(r.note).toBe(1);
  });

  it("practice mean weights every item equally, not every section", () => {
    // vocab(5) all correct, grammar(4) all wrong → 5/9 = 55.55% (NOT 50% section-mean)
    const attempts = [
      ...["v1", "v2", "v3", "v4", "v5"].map((id) => attempt(id, "correct")),
      ...["g1", "g2", "g3", "g4"].map((id) => attempt(id, "wrong")),
    ];
    const r = scoreSubmittedSession({ mode: "practice", sections: sections.map((s) => ({ ...s, weightPct: 0 })), attempts });
    expect(r.overallPct).toBeCloseTo((5 / 9) * 100, 10);
  });
});
