import assert from "node:assert/strict";
import { beforeEach, it } from "node:test";
import { fixture, resetSchoolFixture } from "../../scripts/lib/school-test-harness.mjs";
import { loadUnit } from "@domigo/content-loader";
import { vocabAnswers, spellingAnswer, spellingLayout } from "@domigo/engine";
import { startSpeedSession, speedSessionValid } from "./speed-session.ts";
const { POST } = await import("../../app/api/attempts/route.ts");
const { GET } = await import("../../app/modi/speed/start/route.ts");
const item = loadUnit("g2-u01").vocab[0]!;
const answer = vocabAnswers(item, "deToEn").find((a) => a.tier === "full")!.text;
const owner = "child-own";
function request(mode: string, input: unknown, context?: unknown, hintUsed = false) {
  return new Request("https://fixture.invalid/api/attempts", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ clientAttemptId: crypto.randomUUID(), ownerId: owner, itemId: item.id, mode, input, context, hintUsed }) });
}
beforeEach(() => {
  resetSchoolFixture();
  fixture.session = { user: { id: owner, classId: "class-own", role: "student", scope: ["class-own"] } };
  fixture.recordReturn = { duplicate: false, box: 1, dueAt: new Date("2026-10-09T00:10:00Z"), streak: 1 };
  process.env.AUTH_SECRET = "synthetic-cgo-109-test-only";
});
it("C11 flashcards correct and Again reach shared recording with zero points", async () => {
  for (const [value, tier] of [[answer, "correct"], ["", "wrong"]]) {
    const response = await POST(request("flashcards", { kind: "vocab", value, pool: "deToEn" }));
    const body = await response.json();
    assert.equal(body.tier, tier); assert.equal(body.xpAwarded, 0); assert.equal(body.ok, true);
    assert.equal(fixture.writes.at(-1)!.data.mode, "flashcards");
    assert.equal(fixture.writes.at(-1)!.data.tier, tier);
  }
});
it("C12 signed speed starts expire exactly at sixty seconds and reject forgery/owner/future", async () => {
  const token = startSpeedSession(owner, 100_000);
  assert.equal(speedSessionValid({ speedSession: token }, owner, 159_999), true);
  assert.equal(speedSessionValid({ speedSession: token }, owner, 160_000), false);
  assert.equal(speedSessionValid({ speedSession: token }, owner, 99_999), false);
  assert.equal(speedSessionValid({ speedSession: token }, "other", 100_001), false);
  assert.equal(speedSessionValid({ speedSession: { ...token, sessionStartedAt: 100_001 } }, owner, 100_002), false);
  const response = await POST(request("speed", { kind: "vocab", value: answer, pool: "deToEn" }, { speedSession: startSpeedSession(owner, Date.now() - 60_001) }));
  assert.equal(response.status, 410); assert.equal(fixture.writes.length, 0);
});
it("C13 real speed start and in-time answer succeed; missing token fails", async () => {
  const response = await GET(new Request("https://fixture.invalid/modi/speed/start"));
  assert.equal(response.status, 200); assert.equal(response.headers.get("cache-control"), "no-store");
  const context = await response.json();
  assert.equal((await POST(request("speed", { kind: "vocab", value: answer, pool: "deToEn" }, context))).status, 200);
  assert.equal(fixture.writes.length, 1);
  assert.equal((await POST(request("speed", { kind: "vocab", value: answer, pool: "deToEn" }))).status, 410);
  assert.equal(fixture.writes.length, 1);
});
it("C14 teacher cannot start or write any of the five modes", async () => {
  fixture.session = { user: { id: "teacher-synthetic", classId: null, role: "teacher", scope: [] } };
  assert.equal((await GET(new Request("https://fixture.invalid/modi/speed/start"))).status, 401);
  for (const mode of ["flashcards", "memory", "spelling", "wordhunt", "speed"]) assert.equal((await POST(request(mode, { kind: "vocab", value: answer, pool: "deToEn" }))).status, 401);
  assert.equal(fixture.writes.length, 0);
});
it("C15 spelling letter input goes through real server grader; hint is recorded, not locally discounted", async () => {
  const layout = spellingLayout(answer);
  const letters = layout.filter((slot) => !slot.fixed).map((slot) => slot.text).join("");
  for (const hint of [false, true]) {
    const response = await POST(request("spelling", { kind: "vocab", value: spellingAnswer(layout, letters), pool: "deToEn" }, undefined, hint));
    const body = await response.json();
    assert.equal(body.tier, "correct"); assert.equal(body.xpAwarded, item.difficulty * 10);
    assert.equal(fixture.writes.at(-1)!.data.hintUsed, hint);
  }
});
it("C16 route rejects invalid mode/input combinations before storage", async () => {
  const response = await POST(request("memory", { kind: "vocab", value: answer, pool: "deToEn" }));
  assert.equal(response.status, 400); assert.equal(fixture.writes.length, 0);
});
