// cgo-047 Welle 2 · N6 (GG-DomiGo): the POSITIVE child case next to the teacher
// refusal — a child's answer is graded on the server and booked under the
// child's own class; a teacher session (the preview) books nothing. The real
// route, identity, grader and content; session and storage replaced (harness).
import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
import { fixture, resetSchoolFixture } from "../scripts/lib/school-test-harness.mjs";
import { loadUnit } from "@domigo/content-loader";
import { vocabAnswers } from "@domigo/engine";
const { POST } = await import("../app/api/attempts/route.ts");

const item = loadUnit("g2-u01").vocab[0]!;
const answer = vocabAnswers(item, "carrier").find((a) => a.tier === "full")!.text;
const attempt = (value: string) => new Request("https://attempts.invalid/api/attempts", {
  method: "POST", headers: { "content-type": "application/json" },
  body: JSON.stringify({ clientAttemptId: "22222222-2222-4222-8222-222222222222", itemId: item.id, mode: "practice", input: { kind: "vocab", value, pool: "carrier" }, latencyMs: null, hintUsed: false }),
});

beforeEach(() => {
  resetSchoolFixture();
  fixture.recordReturn = { duplicate: false, box: 1, dueAt: new Date("2026-10-03T00:00:00Z"), streak: 1 };
});

describe("POST /api/attempts — a child books, a teacher does not", () => {
  it("grades a child's right answer on the server and books it under the child's class", async () => {
    fixture.session = { user: { id: "child-own", classId: "class-own", role: "student", scope: ["class-own"] } };
    const res = await POST(attempt(answer));
    const body = await res.json();
    assert.equal(res.status, 200, JSON.stringify({ body, itemId: item.id, answer }));
    assert.equal(body.ok, true, JSON.stringify(body));
    assert.equal(body.tier, "correct");
    assert.equal(fixture.writes.length, 1);
    assert.equal(fixture.writes[0]!.data.userId, "child-own");
    assert.equal(fixture.writes[0]!.data.classId, "class-own");
    assert.deepEqual(fixture.writes[0]!.scope, ["class-own"]);
  });
  it("refuses a teacher session (the preview) with 401 and books nothing", async () => {
    fixture.session = { user: { id: "teacher-own", classId: null, role: "teacher", scope: ["class-own"] } };
    const res = await POST(attempt(answer));
    assert.equal(res.status, 401);
    assert.equal(fixture.storageCalls, 0);
  });
});
