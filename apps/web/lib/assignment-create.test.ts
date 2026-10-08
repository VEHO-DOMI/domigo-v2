import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
import * as nodeModule from "node:module";
import { fixture, resetSchoolFixture } from "../scripts/lib/school-test-harness.mjs";
import { loadUnit } from "@domigo/content-loader";

const dbBoundary = import.meta.resolve("@domigo/db");
// The repository runs Node 24; the web package still declares @types/node 20.
type NextResolver = (specifier: string, context: { parentURL?: string }) => { url: string; shortCircuit?: boolean };
type Resolver = (specifier: string, context: { parentURL?: string }, next: NextResolver) => ReturnType<NextResolver>;
const { registerHooks } = nodeModule as unknown as { registerHooks: (hooks: { resolve: Resolver }) => void };
const boundary = { reserved: new Set<string>(), reserveFailure: false, writeFailure: false, ids: [] as string[] };
Object.assign(globalThis, { __assignmentCreateBoundary: boundary });
registerHooks({ resolve(specifier, context, next) {
  if (specifier === "@domigo/db") return { shortCircuit: true, url: `data:text/javascript,${encodeURIComponent(`
    export * from ${JSON.stringify(dbBoundary)};
    const b = globalThis.__assignmentCreateBoundary;
    export const listReservedForClass = async () => { if (b.reserveFailure) throw new Error('unavailable'); return b.reserved; };
    export const createAssignment = async (_db, _scope, _draft, _teacher, submissionId) => {
      if (b.writeFailure) throw new Error('write refused'); b.ids.push(submissionId); return 'synthetic-assignment';
    };
  `)}` };
  return next(specifier, context);
} });
const { POST } = await import("../app/api/admin/assignments/route.ts");
const vocab = loadUnit("g2-u01").vocab[0]!.id;
const draft = () => ({ submissionId: "00000000-0000-4000-8000-000000000001", title: "Synthetic assignment", mode: "practice", classId: "own", attemptsPerTest: 1,
  source: { source: "unit", grade: 2, unit: "g2-u01" },
  sections: [{ position: 0, kind: "vocab", itemIds: [vocab], weightPct: 0 }] });
const send = (body: unknown) => POST(new Request("https://synthetic.invalid/api/admin/assignments", { method: "POST", body: JSON.stringify(body) }));
beforeEach(() => {
  resetSchoolFixture();
  fixture.session = { user: { id: "teacher-a", role: "teacher", classId: null, scope: ["own"] } };
  fixture.classRows = [{ id: "own", name: "Synthetic own", grade: 2 }, { id: "foreign", name: "Synthetic foreign", grade: 2 }];
  boundary.reserved.clear(); boundary.reserveFailure = false; boundary.writeFailure = false; boundary.ids.length = 0;
});

describe("assignment creation checks the selected class and released content", () => {
  it("uses the existing create operation and retains retry identity", async () => {
    const response = await send(draft());
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true, id: "synthetic-assignment" });
    assert.deepEqual(boundary.ids, [draft().submissionId]);
  });
  it("refuses a foreign class before saving", async () => {
    assert.equal((await send({ ...draft(), classId: "foreign" })).status, 403);
    assert.equal(boundary.ids.length, 0);
  });
  it("refuses a student and an empty teacher scope", async () => {
    fixture.session!.user.role = "student";
    assert.equal((await send(draft())).status, 403);
    fixture.session!.user.role = "teacher"; fixture.session!.user.scope = [];
    assert.equal((await send(draft())).status, 403);
    assert.equal(boundary.ids.length, 0);
  });
  for (const [name, body] of [
    ["invented item", { ...draft(), sections: [{ ...draft().sections[0], itemIds: ["g2u99.w.fake"] }] }],
    ["other year's item", { ...draft(), sections: [{ ...draft().sections[0], itemIds: [loadUnit("g3-u01").vocab[0]!.id] }] }],
    ["wrong item kind", { ...draft(), sections: [{ ...draft().sections[0], kind: "grammar" }] }],
    ["locked source", { ...draft(), source: { source: "story", grade: 2, unit: "g2-u01", chapter: "ch99" } }],
    ["source/class year mismatch", { ...draft(), source: { source: "unit", grade: 3, unit: "g3-u01" } }],
    ["unreleased modality", { ...draft(), sections: [{ ...draft().sections[0], kind: "reading" }] }],
  ] as const) it(`refuses ${name}`, async () => {
    assert.equal((await send(body)).status, 422);
    assert.equal(boundary.ids.length, 0);
  });
  it("refuses an unavailable mode and invalid retry identity", async () => {
    assert.equal((await send({ ...draft(), mode: "story" })).status, 400);
    assert.equal((await send({ ...draft(), submissionId: "forged" })).status, 400);
    assert.equal(boundary.ids.length, 0);
  });
  it("requires submissionId before saving", async () => {
    const body: Partial<ReturnType<typeof draft>> = draft();
    delete body.submissionId;
    const response = await send(body);
    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), { ok: false, error: "bad_request" });
    assert.equal(boundary.ids.length, 0);
  });
  it("accepts the builder's date-only dueAt", async () => {
    const response = await send({ ...draft(), dueAt: "2026-10-10" });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true, id: "synthetic-assignment" });
    assert.deepEqual(boundary.ids, [draft().submissionId]);
  });
  for (const field of ["startsAt", "dueAt"] as const) {
    it(`accepts an offset datetime for ${field}`, async () => {
      const response = await send({ ...draft(), [field]: "2026-10-10T12:00:00+02:00" });
      assert.equal(response.status, 200);
      assert.deepEqual(await response.json(), { ok: true, id: "synthetic-assignment" });
      assert.deepEqual(boundary.ids, [draft().submissionId]);
    });
    it(`refuses a datetime without a zone for ${field} before saving`, async () => {
      const response = await send({ ...draft(), [field]: "2026-10-10T12:00" });
      assert.equal(response.status, 400);
      assert.deepEqual(await response.json(), { ok: false, error: "bad_request" });
      assert.equal(boundary.ids.length, 0);
    });
  }
  it("refuses reserved content and reservation lookup failure", async () => {
    boundary.reserved.add(vocab);
    assert.equal((await send(draft())).status, 422);
    boundary.reserved.clear(); boundary.reserveFailure = true;
    assert.equal((await send(draft())).status, 503);
    assert.equal(boundary.ids.length, 0);
  });
  it("reports failed storage, and permits retry with the same identity", async () => {
    boundary.writeFailure = true;
    const result = await send(draft());
    assert.equal(result.status, 500);
    assert.equal((await result.json()).error, "persist_failed");
    boundary.writeFailure = false;
    assert.equal((await send(draft())).status, 200);
    assert.deepEqual(boundary.ids, [draft().submissionId]);
  });
});
