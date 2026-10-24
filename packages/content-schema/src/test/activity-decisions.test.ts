import { test } from "node:test";
import assert from "node:assert/strict";
import { ActivityTeacherDecisions } from "../activity-decisions.ts";
const decision = { taskId: "g2u03.w.picnic", word: "picnic", german: "Picknick", mode: "draw", decidedBy: "Koki", decidedAt: "2026-10-24", source: "cgo-172", note: "Reviewed ruling." };
test("reviewed decisions preserve exact strings and refuse missing, invented or duplicate authority", () => {
  assert.deepEqual(ActivityTeacherDecisions.parse([decision]), [decision]);
  const spaced = { ...decision, word: " picnic ", german: " Picknick ", note: " Ruling. " };
  assert.deepEqual(ActivityTeacherDecisions.parse([spaced]), [spaced]);
  for (const key of Object.keys(decision)) {
    const missing: Record<string, unknown> = { ...decision };delete missing[key];
    assert.equal(ActivityTeacherDecisions.safeParse([missing]).success, false, key);
  }
  for (const patch of [{ decidedBy: "Automatic audit" }, { decidedAt: "2026-10-25" }, { source: "source-high-confidence" }, { mode: "all" }, { word: " " }, { german: " " }, { note: " " }, { taskId: "picnic" }, { verifiedMeaning: true }])
    assert.equal(ActivityTeacherDecisions.safeParse([{ ...decision, ...patch }]).success, false);
  assert.equal(ActivityTeacherDecisions.safeParse([decision, decision]).success, false);
});
