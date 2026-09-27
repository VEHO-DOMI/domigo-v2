import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
import { fixture, resetSchoolFixture } from "../scripts/lib/school-test-harness.mjs";
const { POST } = await import("../app/api/school/route.ts");
const { loadSchoolBattery } = await import("./school-content.ts");
const first = loadSchoolBattery().cards.find(c => c.station === "verdacht")!;
const attemptId = "11111111-1111-4111-8111-111111111111";
function request(extra: Record<string, unknown> = {}) {
  return new Request("https://school.invalid/api/school", {
    method: "POST", headers: { "content-type": "application/json", "x-dev-user-id": "child-foreign", "x-dev-class-id": "class-foreign" },
    body: JSON.stringify({ station: first.station, value: first.item.answers[0]!.text, clientAttemptId: attemptId, ...extra }),
  });
}
beforeEach(() => {
  resetSchoolFixture();
  fixture.session = { user: { id: "child-own", classId: "class-own", role: "student", scope: ["class-own"] } };
});
describe("POST /api/school — the real route and its access boundary", () => {
  it("records the child's own progress and returns the stored result", async () => {
    const res = await POST(request());
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.result.tier, "correct");
    assert.deepEqual(body.view.solved, [first.station]);
    assert.equal(fixture.writes.length, 1);
    assert.deepEqual(fixture.writes[0]!.scope, ["class-own"]);
    const data = fixture.writes[0]!.data;
    assert.equal(data.userId, "child-own");
    assert.equal(data.classId, "class-own");
    assert.equal(data.clientAttemptId, attemptId);
    assert.equal(data.itemId, first.item.id);
    assert.deepEqual(fixture.reads, ["child-own", "child-own"]);
  });
  it("cannot write for another child or forge solved progress through body or headers", async () => {
    const res = await POST(request({ userId: "child-foreign", classId: "class-foreign", classScope: ["class-foreign"], preview: true, previewSolved: ["alibi", "zettel"] }));
    assert.equal(res.status, 200);
    assert.equal(fixture.writes.length, 1);
    assert.equal(fixture.writes[0]!.data.userId, "child-own");
    assert.equal(fixture.writes[0]!.data.classId, "class-own");
    assert.deepEqual(fixture.writes[0]!.scope, ["class-own"]);
    assert.deepEqual((await res.json()).view.solved, [first.station]);
  });
  it("never reads or writes student progress in teacher preview", async () => {
    fixture.session = { user: { id: "teacher-own", classId: null, role: "teacher", scope: ["class-own"] } };
    fixture.released = false;
    const res = await POST(request());
    assert.equal(res.status, 200);
    assert.equal((await res.json()).view.preview, true);
    assert.deepEqual(fixture.writes, []);
    assert.deepEqual(fixture.reads, []);
    assert.equal(fixture.storageCalls, 0);
  });
  it("the route itself blocks a preview write even if the attempt service calls save", async () => {
    fixture.session = { user: { id: "teacher-own", classId: null, role: "teacher", scope: ["class-own"] } };
    fixture.forcePreviewSave = true;
    const res = await POST(request());
    assert.equal(res.status, 503);
    assert.equal(fixture.storageCalls, 0);
    assert.deepEqual(fixture.writes, []);
    assert.deepEqual(fixture.reads, []);
  });
  for (const scope of [[], ["class-foreign"]]) {
    it(`returns 403 before storage for ${scope.length ? "foreign" : "empty"} class scope`, async () => {
      fixture.session!.user.scope = scope;
      const res = await POST(request());
      assert.equal(res.status, 403);
      assert.deepEqual(await res.json(), { error: "not_available" });
      assert.deepEqual(fixture.writes, []);
      assert.deepEqual(fixture.reads, []);
    });
  }
  it("returns 403 without a session, even with forged identity headers", async () => {
    fixture.session = null;
    assert.equal((await POST(request())).status, 403);
    assert.deepEqual(fixture.writes, []);
    assert.deepEqual(fixture.reads, []);
  });
  it("returns 400 for invalid input without touching storage", async () => {
    assert.equal((await POST(request({ clientAttemptId: "invalid" }))).status, 400);
    assert.deepEqual(fixture.writes, []);
    assert.deepEqual(fixture.reads, []);
  });
  it("still reports a real storage failure as retryable 503", async () => {
    fixture.writeError = new Error("storage unavailable");
    const res = await POST(request());
    assert.equal(res.status, 503);
    assert.deepEqual(await res.json(), { error: "retry" });
    assert.deepEqual(fixture.writes, []);
  });
  it("returns 403 for an unknown class year and retryable 503 for a class lookup failure", async () => {
    fixture.grade = null;
    assert.equal((await POST(request())).status, 403);
    fixture.gradeError = new Error("class storage unavailable");
    const res = await POST(request());
    assert.equal(res.status, 503);
    assert.deepEqual(await res.json(), { error: "retry" });
    assert.deepEqual(fixture.writes, []);
    assert.deepEqual(fixture.reads, []);
  });
});
