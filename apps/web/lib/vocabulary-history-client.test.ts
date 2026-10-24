import assert from "node:assert/strict";
import { it } from "node:test";
import { createHash } from "node:crypto";
import type { ResultDetail } from "@domigo/task-ui";
import { sendCompletedAttempt, sendVocabularyCheck, withVocabularyHistory } from "./vocabulary-history-client.ts";
const body = { clientAttemptId: "synthetic-id", itemId: "g1u01.w.synthetic", mode: "practice", input: { kind: "vocab", value: "answer", pool: "carrier" }, latencyMs: null, hintUsed: false };
const detail: ResultDetail = { kind: "vocab", itemId: body.itemId, input: { kind: "vocab", value: "answer", pool: "carrier" }, history: {
  schema: "vocabulary-completion@1", itemRevision: 2, contentSnapshot: "synthetic content, no learner data", maxChecks: 3,
  checks: [{ reportedTier: "wrong", helpShown: [] }, { reportedTier: "correct", helpShown: ["hint"] }],
} };
it("hashes displayed content before sending and excludes the snapshot and prior raw answers", async () => {
  const packed = await withVocabularyHistory(body, detail);
  assert.equal(packed.vocabularyHistory!.displayedContentSha256, createHash("sha256").update(detail.history!.contentSnapshot).digest("hex"));
  assert.equal(packed.hintUsed, true); assert.deepEqual(packed.vocabularyHistory!.checks, detail.history!.checks);
  assert.equal(JSON.stringify(packed).includes("contentSnapshot"), false); assert.equal(body.hintUsed, false);
});
it("a digest failure stays unknown and still dispatches the completion", async () => {
  const original = globalThis.crypto;
  Object.defineProperty(globalThis, "crypto", { configurable: true, value: { subtle: { digest() { throw Error("synthetic unavailable digest"); } } } });
  try { const packed = await withVocabularyHistory(body, detail); assert.equal(packed.vocabularyHistory!.displayedContentSha256, null); assert.equal(packed.hintUsed, true); }
  finally { Object.defineProperty(globalThis, "crypto", { configurable: true, value: original }); }
});
it("unmodified grammar/legacy callers retain immediate dispatch and their exact payload", async () => {
  let calls = 0;
  const result = sendCompletedAttempt(async passed => { calls++; assert.equal(passed, body); return { ok: false, queued: true }; }, body, { kind: "grammar", itemId: "synthetic", input: { kind: "text", value: "x" } });
  assert.equal(calls, 1); assert.deepEqual(await result, { ok: false, queued: true });
});

it("freezes the answer and observations before the digest yields", async () => {
  const mutableBody = structuredClone(body), mutableDetail = structuredClone(detail);
  const pending = withVocabularyHistory(mutableBody, mutableDetail);
  mutableBody.input.value = "changed after submit";
  mutableDetail.history!.checks[0]!.helpShown.push("hint");
  const saved = await pending;
  assert.equal((saved.input as { value: string }).value, "answer");
  assert.deepEqual(saved.vocabularyHistory!.checks[0]!.helpShown, []);
});

const checkedDetail = (): Extract<ResultDetail, {kind: "vocab"}> => ({ ...structuredClone(detail),
  check: { id:"00000000-0000-4000-8000-000000000020", checkedAt:"2026-10-24T07:30:00.000Z" },
  history: { ...structuredClone(detail.history!), visitId:"00000000-0000-4000-8000-000000000010" },
});
it("dispatches an individual check synchronously through the original sender with no completion metadata", async () => {
  const d = checkedDetail(); let dispatched = false;
  const result = sendVocabularyCheck(async (b, prepare) => {
    dispatched = true; assert.equal(b.clientAttemptId,d.check!.id); assert.equal(b.mode,"vocabulary-check");
    assert.equal(prepare,undefined); const packed = structuredClone(b);
    assert.equal(packed.vocabularyHistory,undefined);
    assert.equal(packed.vocabularyCheck!.visitId,d.history!.visitId); assert.equal(packed.vocabularyCheck!.checkNumber,2);
    assert.equal(packed.vocabularyCheck!.reportedTier,"correct"); assert.deepEqual(packed.vocabularyCheck!.helpShown,["hint"]);
    assert.equal(packed.vocabularyCheck!.checkedAt,d.check!.checkedAt); assert.equal(packed.vocabularyCheck!.sourceMode,"review");
    assert.equal(JSON.stringify(packed).includes("contentSnapshot"),false); return {ok:false,queued:true};
  },d,"review");
  assert.equal(dispatched,true); assert.deepEqual(await result,{ok:false,queued:true});
});
it("check snapshot and help are frozen before sender yields", async () => {
  const d = checkedDetail(); let saved: unknown;
  const pending = sendVocabularyCheck(async (b, prepare) => { assert.equal(prepare,undefined); saved = structuredClone(b); await Promise.resolve(); return {ok:true,queued:false}; },d,"practice");
  d.input.value = "changed later"; d.history!.checks.at(-1)!.helpShown.length=0; d.check!.checkedAt="changed later";
  await pending;
  const packed = saved as import("./attempt-outbox.ts").AttemptBody;
  assert.equal((packed.input as {value:string}).value,"answer"); assert.deepEqual(packed.vocabularyCheck!.helpShown,["hint"]);
  assert.equal(packed.vocabularyCheck!.checkedAt,"2026-10-24T07:30:00.000Z");
});
it("legacy detail without a visit and check creates no invented event", async () => {
  let calls=0; assert.deepEqual(await sendVocabularyCheck(async () => {calls++; return {ok:true,queued:false};},detail,"practice"),{ok:false,queued:false}); assert.equal(calls,0);
});
