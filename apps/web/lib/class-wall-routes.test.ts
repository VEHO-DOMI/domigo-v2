// cgo-047 Welle 2 · N6 (GG-DomiGo) + Minor 3 (GG-Plattform): the class wall as
// BEHAVIOUR, with one authorised and one foreign synthetic class, on all three
// places that list or write a class for an assignment — the picker
// (assignableClasses, what /admin/assignments/new renders), the create door
// (POST /api/admin/assignments) and compose-checkup. The trusted source of the
// allowed classes is the SESSION's scope (auth → lib/teacher.ts#getTeacher →
// lib/identity.ts#scopedClassIdsForRequest), never a class id the caller sends.
// The class lists themselves are replaced by the harness and return the foreign
// v1 class too — the leak this wall has to close.
import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
import { fixture, resetSchoolFixture } from "../scripts/lib/school-test-harness.mjs";
import { loadUnit } from "@domigo/content-loader";
const { assignableClasses } = await import("./class-wall.ts");
const { POST: createAssignmentRoute } = await import("../app/api/admin/assignments/route.ts");
const { POST: composeCheckupRoute } = await import("../app/api/admin/assignments/compose-checkup/route.ts");

const OWN = { id: "class-own", name: "Testklasse A", grade: 2 };
const FOREIGN = { id: "class-foreign-v1", name: "Fremde Testklasse (alt)", grade: 2 };

const draft = (classId: string) => ({
  submissionId: "00000000-0000-4000-8000-000000000001", title: "Probe", mode: "practice", classId, attemptsPerTest: 1,
  sections: [{ position: 0, kind: "vocab", itemIds: [loadUnit("g2-u01").vocab[0]!.id], weightPct: 100 }],
});
const post = (body: unknown, extraHeaders: Record<string, string> = {}) =>
  new Request("https://wall.invalid/api/admin/assignments", {
    method: "POST", headers: { "content-type": "application/json", ...extraHeaders }, body: JSON.stringify(body),
  });

beforeEach(() => {
  resetSchoolFixture();
  fixture.classRows = [OWN, FOREIGN];
  fixture.session = { user: { id: "teacher-own", classId: null, role: "teacher", scope: [OWN.id] } };
});

describe("the picker (assignableClasses)", () => {
  it("lists the teacher's own class and hides the foreign one", async () => {
    const rows = await assignableClasses({ userId: "teacher-own", classScope: [OWN.id] as never });
    assert.deepEqual(rows.map((r) => r.id), [OWN.id]);
  });
});

describe("POST /api/admin/assignments — the create door", () => {
  it("creates work in the own class", async () => {
    const res = await createAssignmentRoute(post(draft(OWN.id)));
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { ok: true, id: "assignment-1" });
    assert.equal(fixture.writes.length, 1);
  });
  it("refuses the foreign class with 403 before any write — never a 500", async () => {
    const res = await createAssignmentRoute(post(draft(FOREIGN.id)));
    assert.equal(res.status, 403);
    assert.equal((await res.json()).error, "not_your_class");
    assert.equal(fixture.storageCalls, 0);
  });
  it("a forged development header cannot widen the scope in production", async () => {
    const res = await createAssignmentRoute(post(draft(FOREIGN.id), { "x-dev-class-id": FOREIGN.id, "x-dev-teacher-id": "teacher-forged" }));
    assert.equal(res.status, 403);
  });
  it("a child session gets no door at all", async () => {
    fixture.session = { user: { id: "child-own", classId: OWN.id, role: "student", scope: [OWN.id] } };
    const res = await createAssignmentRoute(post(draft(OWN.id)));
    assert.equal(res.status, 403);
    assert.equal(fixture.storageCalls, 0);
  });
});

describe("POST compose-checkup", () => {
  const compose = (classId: string) => new Request("https://wall.invalid/api/admin/assignments/compose-checkup", {
    method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ classId, unitSlug: "g2-u01", seed: "probe" }),
  });
  it("composes for the own class (past the wall)", async () => {
    const res = await composeCheckupRoute(compose(OWN.id));
    const body = await res.json();
    assert.notEqual(res.status, 403);
    assert.notEqual(body.error, "not_your_class");
  });
  it("refuses the foreign class with 403", async () => {
    const res = await composeCheckupRoute(compose(FOREIGN.id));
    assert.equal(res.status, 403);
    assert.equal((await res.json()).error, "not_your_class");
  });
});
