import assert from "node:assert/strict";
import { beforeEach, it } from "node:test";
import { createHash } from "node:crypto";
import { fixture, resetSchoolFixture } from "../scripts/lib/school-test-harness.mjs";
import { loadUnit } from "@domigo/content-loader";
import { vocabAnswers, vocabularyContentSnapshot, type VocabPool } from "@domigo/engine";
import { VocabularyHistoryInput } from "./vocabulary-history.ts";
const { POST } = await import("../app/api/attempts/route.ts");
const item = loadUnit("g2-u01").vocab[0]!;
const digest = createHash("sha256").update(vocabularyContentSnapshot(item)).digest("hex");
const observed = () => ({ schema: "vocabulary-completion@1", itemRevision: item.rev, displayedContentSha256: digest,
  maxChecks: 3, checks: [{ reportedTier: "wrong", helpShown: [] }, { reportedTier: "wrong", helpShown: ["hint"] }, { reportedTier: "correct", helpShown: ["hint", "retry-hint"] }] });
function request(pool: VocabPool = "carrier", patch: Record<string, unknown> = {}) {
  return new Request("https://attempts.invalid/api/attempts", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({
    ownerId: "synthetic-child", clientAttemptId: "77777777-7777-4777-8777-777777777777", itemId: item.id, mode: "practice",
    input: { kind: "vocab", value: vocabAnswers(item, pool).find(a => a.tier === "full")!.text, pool }, hintUsed: false,
    vocabularyHistory: observed(), ...patch,
  }) });
}
beforeEach(() => {
  resetSchoolFixture(); fixture.session = { user: { id: "synthetic-child", classId: "synthetic-class", role: "student", scope: ["synthetic-class"] } };
  fixture.recordReturn = { duplicate: false, box: 1, dueAt: new Date("2026-10-24T00:00:00Z"), streak: 1 };
});
for (const pool of ["carrier", "definition", "deToEn", "enToDe"] as const) it(`keeps ${pool}, three ordered observations and real help in one terminal write`, async () => {
  const response = await POST(request(pool)); const result = await response.json();
  assert.equal(result.ok, true); assert.equal(result.tier, "correct"); assert.equal(fixture.writes.length, 1);
  const row = fixture.writes[0]!.data; const h = row.context.vocabularyHistory;
  assert.equal(row.hintUsed, true); assert.equal(h.pool, pool); assert.equal(h.coverage, "completed-card-only");
  assert.deepEqual(h.clientObservation.checks, observed().checks); assert.equal(h.checkTierEvidence, "client-reported");
  assert.equal(h.finalServerTier, "correct"); assert.equal(h.contentMatch, true);
  assert.equal(h.gradedContent.revision, item.rev); assert.equal(h.gradedContent.sha256, digest);
  assert.deepEqual(h.helpShown, ["hint", "retry-hint"]); assert.equal(row.xpAwarded, result.xpAwarded);
  assert.equal("input" in row, false); assert.equal(JSON.stringify(h).includes("contentSnapshot"), false);
});
it("legacy details keep missing displayed content, checks and help explicitly unknown", async () => {
  await POST(request("carrier", { vocabularyHistory: undefined })); const h = fixture.writes[0]!.data.context.vocabularyHistory;
  assert.equal(h.displayedContent, null); assert.equal(h.contentMatch, null); assert.equal(h.clientObservation, null); assert.equal(h.helpShown, null);
  assert.equal(h.pool, "carrier"); assert.equal(h.gradedContent.sha256, digest);
});
it("a changed displayed version is retained as a mismatch, not silently stamped current", async () => {
  await POST(request("carrier", { vocabularyHistory: { ...observed(), itemRevision: item.rev + 1, displayedContentSha256: "a".repeat(64) } }));
  const h = fixture.writes[0]!.data.context.vocabularyHistory;
  assert.equal(h.displayedContent.revision, item.rev + 1); assert.equal(h.gradedContent.revision, item.rev); assert.equal(h.contentMatch, false);
});
it("a client cannot inject an authoritative history through arbitrary context", async () => {
  await POST(request("carrier", { context: { vocabularyHistory: { finalServerTier: "wrong", gradedContent: "forged" }, harmless: true } }));
  const context = fixture.writes[0]!.data.context;
  assert.equal(context.harmless, true); assert.equal(context.vocabularyHistory.finalServerTier, "correct"); assert.equal(context.vocabularyHistory.gradedContent.sha256, digest);
});
for (const bad of [
  { ...observed(), checks: [] }, { ...observed(), checks: [...observed().checks, observed().checks[2]] },
  { ...observed(), checks: [{ reportedTier: "correct", helpShown: [] }, { reportedTier: "correct", helpShown: [] }] },
  { ...observed(), checks: [{ reportedTier: "wrong", helpShown: [] }] },
  { ...observed(), checks: [{ reportedTier: "correct", helpShown: [], rawAnswer: "must not be retained" }] },
  { ...observed(), displayedContentSha256: "not-a-hash" }, { ...observed(), itemRevision: 0 },
]) it(`refuses malformed completion evidence before persistence ${JSON.stringify(bad)}`, async () => {
  assert.equal(VocabularyHistoryInput.safeParse(bad).success, false);
  assert.equal((await POST(request("carrier", { vocabularyHistory: bad }))).status, 400); assert.equal(fixture.writes.length, 0);
});
it("does not let observation metadata opt games into ordinary completion history", async () => {
  assert.equal((await POST(request("carrier", { mode: "game:g2" }))).status, 400); assert.equal(fixture.writes.length, 0);
});
it("storage failure remains unconfirmed, regardless of captured retry history", async () => {
  fixture.writeError = new Error("synthetic write failure");
  const reply = await (await POST(request())).json(); assert.equal(reply.ok, false); assert.equal(reply.error, "persist_failed");
});

it("an excluded game cannot forge the reserved server history through context", async () => {
  await POST(request("carrier", { mode: "game:g2", vocabularyHistory: undefined,
    input: { kind: "vocab", value: "synthetically wrong", pool: "carrier" },
    context: { vocabularyHistory: { schema: "vocabulary-learning-history@1", finalServerTier: "correct" }, coordinates: { round: 2 } },
  }));
  assert.equal(fixture.writes.length, 1);
  const row = fixture.writes[0]!.data;
  assert.equal(row.tier, "wrong"); assert.equal("vocabularyHistory" in row.context, false);
  assert.deepEqual(row.context.coordinates, { round: 2 });
});
