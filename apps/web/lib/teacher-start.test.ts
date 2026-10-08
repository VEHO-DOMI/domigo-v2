import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { AssignmentRow } from "@domigo/db";
import { deadlineLabel, readStart, summarizeAssignments } from "./teacher-start.ts";

const now = new Date("2026-10-08T08:00:00Z");
const assignment = (classId: string, dueAt: Date | null, archivedAt: Date | null = null): AssignmentRow => ({
  id: "fixture-task", title: "Synthetic task", mode: "practice", createdAt: now, classId, dueAt, archivedAt,
});

describe("teacher start summaries", () => {
  it("counts only this class's unarchived assignments; deadline equality remains open", () => {
    const rows = [
      assignment("a", null), assignment("a", now), assignment("a", new Date("2026-10-09T08:00:00Z")),
      assignment("a", new Date("2026-10-07T08:00:00Z")), assignment("a", null, now), assignment("b", null),
    ];
    assert.deepEqual(summarizeAssignments(rows, "a", now), { open: 3, overdue: 1, nextDue: now });
    assert.deepEqual(summarizeAssignments(rows, "b", now), { open: 1, overdue: 0, nextDue: null });
    assert.deepEqual(summarizeAssignments(rows, "missing", now), { open: 0, overdue: 0, nextDue: null });
  });
  it("nearest deadline is chronological even when rows arrive newest-first", () => {
    const soon = new Date("2026-10-09T08:00:00Z");
    assert.deepEqual(summarizeAssignments([assignment("a", new Date("2026-10-20T08:00:00Z")), assignment("a", soon)], "a", now), { open: 2, overdue: 0, nextDue: soon });
  });
  it("Vienna date is stable across server timezones", () => {
    assert.equal(deadlineLabel(new Date("2026-10-08T22:30:00Z")), "09.10.2026, 00:30");
  });
  it("empty is success; synchronous and asynchronous database failures are unavailable", async () => {
    assert.deepEqual(await readStart(async () => []), { ok: true, value: [] });
    assert.deepEqual(await readStart(() => { throw new Error("synthetic sync failure"); }), { ok: false });
    assert.deepEqual(await readStart(async () => { throw new Error("synthetic async failure"); }), { ok: false });
  });
});
