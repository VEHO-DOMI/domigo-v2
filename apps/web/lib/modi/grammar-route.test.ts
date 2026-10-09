import assert from "node:assert/strict";
import { beforeEach, it } from "node:test";
import { fixture, resetSchoolFixture } from "../../scripts/lib/school-test-harness.mjs";
import { loadUnit } from "@domigo/content-loader";
import { gradeGrammar } from "@domigo/engine";
const { POST } = await import("../../app/api/attempts/route.ts");
const item = loadUnit("g1-u01").grammar.find((i) => i.format === "gap-fill")!;
const owner = "child-synthetic";
const request = (value: string, itemId = item.id, kind = "text") => new Request("https://fixture.invalid/api/attempts", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ownerId: owner, clientAttemptId: crypto.randomUUID(), itemId, mode: "grammar", input: { kind, value }, hintUsed: true }) });
beforeEach(() => {
  resetSchoolFixture(); fixture.grade = 1;
  fixture.session = { user: { id: owner, classId: "class-synthetic", role: "student", scope: ["class-synthetic"] } };
  fixture.recordReturn = { duplicate: false, box: 1, dueAt: new Date(), streak: 1 };
});
it("G11 real grammar endpoint records both wrong and correct through the grammar pool", async () => {
  for (const value of ["zzzzzzzzzz", item.answers.find((a) => a.tier === "full")!.text]) {
    const response = await POST(request(value)); const result = await response.json();
    assert.equal(response.status, 200); assert.equal(result.ok, true);
    assert.equal(result.tier, gradeGrammar(item, { kind: "text", value }).tier);
    const write = fixture.writes.at(-1)!.data;
    assert.equal(write.kind, "grammar"); assert.equal(write.mode, "grammar"); assert.equal(write.hintUsed, true);
    assert.equal(write.xpAwarded, result.tier === "correct" ? item.difficulty * 10 : 0);
  }
});
it("G12 teacher and invalid grammar tags never write", async () => {
  assert.equal((await POST(request("x", loadUnit("g1-u01").vocab[0]!.id))).status, 400);
  assert.equal((await POST(request("x", item.id, "vocab"))).status, 400);
  fixture.session = { user: { id: "teacher-synthetic", classId: null, role: "teacher", scope: [] } };
  assert.equal((await POST(request("x"))).status, 401);
  assert.equal(fixture.writes.length, 0);
});
