import assert from "node:assert/strict";
import { it } from "node:test";
import { createHash } from "node:crypto";
import type { ResultDetail } from "@domigo/task-ui";
import { sendCompletedAttempt, withVocabularyHistory } from "./vocabulary-history-client.ts";
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
