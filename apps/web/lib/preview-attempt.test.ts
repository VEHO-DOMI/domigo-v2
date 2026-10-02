// cgo-047 · lib/preview-attempt.ts — the preview's answer never reaches the network.
import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { sendAttempt } from "./attempt-outbox.ts";
import { PREVIEW_REPLY, attemptSender } from "./preview-attempt.ts";

const body = { clientAttemptId: "c1", itemId: "g3-u01.v.001", mode: "game:g3", input: { kind: "choice", value: "a" }, latencyMs: null, hintUsed: false };
const realFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = realFetch; });

describe("attemptSender", () => {
  it("in the preview answers locally and calls no endpoint", async () => {
    let calls = 0;
    globalThis.fetch = (async () => { calls++; return new Response("{}"); }) as typeof fetch;
    const reply = await attemptSender(true)(body);
    assert.deepEqual(reply, { ok: true, queued: false });
    assert.equal(calls, 0);
  });
  it("hands out a fresh object so a game cannot bend the shared reply", async () => {
    const reply = await attemptSender(true)(body);
    (reply as { ok: boolean }).ok = false;
    assert.equal(PREVIEW_REPLY.ok, true);
  });
  it("for a child is exactly the outbox", () => {
    assert.equal(attemptSender(false), sendAttempt);
  });
});
