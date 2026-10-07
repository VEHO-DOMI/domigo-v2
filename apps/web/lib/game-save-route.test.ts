// cgo-047 · the SERVER half of "the teacher preview stores nothing" (GG ruling
// 02.10., Nachtrag 4): /api/game-save refuses a PUT without a child session, no
// matter what a client sends. The real route and identity; session and storage
// replaced (school harness).
import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
import { fixture, resetSchoolFixture } from "../scripts/lib/school-test-harness.mjs";
const { GET, PUT } = await import("../app/api/game-save/route.ts");

const put = (headers: Record<string, string> = {}, gameMode = "game:g3") =>
  new Request("https://save.invalid/api/game-save", {
    method: "PUT",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify({ gameMode, schemaVersion: 1, clientRev: 7, state: { at: "ep01" } }),
  });
const child = { user: { id: "child-own", classId: "class-own", role: "student", scope: ["class-own"] } };

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

// cgo-086 (Koki 07.10.): the Keen build is gone, so is its save slot. A child's
// PUT to `game:g1:keen` is a bad request and reaches no storage; the slots the
// live games use (`game:g<n>`, the detective's `:bonus`) still store.
describe("PUT /api/game-save — the save slots that exist", () => {
  for (const mode of ["game:g1:keen", "game:g2:keen", "game:g5", "game:g1:other"]) {
    it(`refuses ${mode} with 400 and touches no storage`, async () => {
      fixture.session = child;
      const res = await PUT(put({}, mode));
      assert.equal(res.status, 400);
      assert.equal((await res.json()).error, "bad_request");
      assert.equal(fixture.writes.length, 0);
    });
  }
  for (const mode of ["game:g1", "game:g2:bonus", "game:g4"]) {
    it(`stores ${mode}`, async () => {
      fixture.session = child;
      const res = await PUT(put({}, mode));
      assert.equal(res.status, 200);
      assert.equal(fixture.writes.length, 1);
      assert.equal(fixture.writes[0]!.data.gameMode, mode);
    });
  }
});

describe("GET /api/game-save — the Keen slot is not read either (cgo-086)", () => {
  it("answers game:g1:keen with 400 before any storage call", async () => {
    fixture.session = child;
    const res = await GET(new Request("https://save.invalid/api/game-save?mode=game:g1:keen"));
    assert.equal(res.status, 400);
    assert.equal((await res.json()).error, "bad_request");
    assert.equal(fixture.storageCalls, 0);
  });
});
