// cgo-047 · the SERVER half of "the teacher preview stores nothing" (GG ruling
// 02.10., Nachtrag 4): /api/game-save refuses a PUT without a child session, no
// matter what a client sends. The real route and identity; session and storage
// replaced (school harness).
import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
import { fixture, resetSchoolFixture } from "../scripts/lib/school-test-harness.mjs";
const { PUT } = await import("../app/api/game-save/route.ts");

const put = (headers: Record<string, string> = {}) =>
  new Request("https://save.invalid/api/game-save", {
    method: "PUT",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify({ gameMode: "game:g3", schemaVersion: 1, clientRev: 7, state: { at: "ep01" } }),
  });

beforeEach(() => resetSchoolFixture());

describe("PUT /api/game-save — only a child writes", () => {
  it("stores a child's save under the child's own class", async () => {
    fixture.session = { user: { id: "child-own", classId: "class-own", role: "student", scope: ["class-own"] } };
    const res = await PUT(put());
    assert.equal(res.status, 200);
    assert.equal(fixture.writes.length, 1);
    assert.equal(fixture.writes[0]!.data.userId, "child-own");
    assert.equal(fixture.writes[0]!.data.classId, "class-own");
  });
  it("refuses a teacher session with 403 and touches no storage", async () => {
    fixture.session = { user: { id: "teacher-own", classId: null, role: "teacher", scope: ["class-own"] } };
    const res = await PUT(put());
    assert.equal(res.status, 403);
    assert.equal((await res.json()).error, "preview_read_only");
    assert.equal(fixture.storageCalls, 0);
    assert.equal(fixture.writes.length, 0);
  });
  it("refuses no session with 401, even with forged development headers in production", async () => {
    const res = await PUT(put({ "x-dev-user-id": "child-forged", "x-dev-class-id": "class-forged", "x-dev-teacher-id": "teacher-forged" }));
    assert.equal(res.status, 401);
    assert.equal(fixture.storageCalls, 0);
  });
});
