import { describe, expect, it } from "vitest";
import { pickRosterSession, rosterStatus, summarizeRoster, type RosterRow } from "./assignment-results.ts";

describe("pickRosterSession", () => {
  it("takes the latest submitted attempt, ignoring unsubmitted ones", () => {
    const s = [
      { attemptNumber: 1, submittedAt: new Date(2026, 0, 1) },
      { attemptNumber: 2, submittedAt: new Date(2026, 0, 2) },
      { attemptNumber: 3, submittedAt: null }, // in-progress retake — ignored
    ];
    expect(pickRosterSession(s)?.attemptNumber).toBe(2);
  });
  it("is null when nothing is submitted", () => {
    expect(pickRosterSession([{ attemptNumber: 1, submittedAt: null }])).toBeNull();
  });
});

describe("rosterStatus", () => {
  it("done > in_progress > not_started", () => {
    expect(rosterStatus([{ submittedAt: new Date() }], false)).toBe("done");
    expect(rosterStatus([{ submittedAt: null }], true)).toBe("in_progress");
    expect(rosterStatus([], false)).toBe("not_started");
    // a submitted sitting wins even if another is live
    expect(rosterStatus([{ submittedAt: new Date() }, { submittedAt: null }], true)).toBe("done");
  });
});

describe("summarizeRoster", () => {
  const row = (over: Partial<RosterRow>): RosterRow => ({
    userId: "u", name: "S", status: "done", attempts: 1, overallPct: 80, note: 2, perSection: [{ position: 0, pct: 90 }, { position: 1, pct: 70 }], ...over,
  });

  it("counts states, class average, Note histogram and per-section averages", () => {
    const rows: RosterRow[] = [
      row({ userId: "a", overallPct: 90, note: 1, perSection: [{ position: 0, pct: 100 }, { position: 1, pct: 80 }] }),
      row({ userId: "b", overallPct: 70, note: 3, perSection: [{ position: 0, pct: 60 }, { position: 1, pct: 80 }] }),
      row({ userId: "c", status: "in_progress", attempts: 0, overallPct: null, note: null, perSection: [] }),
      row({ userId: "d", status: "not_started", attempts: 0, overallPct: null, note: null, perSection: [] }),
    ];
    const s = summarizeRoster(rows, [0, 1]);
    expect(s.students).toBe(4);
    expect(s.done).toBe(2);
    expect(s.inProgress).toBe(1);
    expect(s.notStarted).toBe(1);
    expect(s.classAvgPct).toBe(80); // (90 + 70) / 2
    expect(s.noteHistogram).toEqual({ 1: 1, 2: 0, 3: 1, 4: 0, 5: 0 });
    // section 0: (100 + 60)/2 = 80 ; section 1: (80 + 80)/2 = 80
    expect(s.sectionAvgPct).toEqual([{ position: 0, avgPct: 80 }, { position: 1, avgPct: 80 }]);
  });

  it("class average is null when nobody has finished", () => {
    const s = summarizeRoster([row({ status: "not_started", overallPct: null, note: null, perSection: [] })], [0]);
    expect(s.classAvgPct).toBeNull();
    expect(s.done).toBe(0);
    expect(s.noteHistogram).toEqual({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
  });

  it("surfaces the hardest section (lowest class average)", () => {
    const rows = [
      row({ userId: "a", perSection: [{ position: 0, pct: 100 }, { position: 1, pct: 40 }] }),
      row({ userId: "b", perSection: [{ position: 0, pct: 90 }, { position: 1, pct: 50 }] }),
    ];
    const s = summarizeRoster(rows, [0, 1]);
    const hardest = [...s.sectionAvgPct].sort((x, y) => x.avgPct - y.avgPct)[0];
    expect(hardest!.position).toBe(1); // 45% vs 95%
  });
});
