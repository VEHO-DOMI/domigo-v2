import assert from "node:assert/strict";
import { test, afterEach } from "node:test";
import { sendAttempt } from "./attempt-outbox.ts";
const originalFetch = globalThis.fetch;
const originalIDB = globalThis.indexedDB;
afterEach(() => { globalThis.fetch = originalFetch; globalThis.indexedDB = originalIDB; });
const body = { clientAttemptId: "00000000-0000-4000-8000-000000000059", itemId: "g3u01.ci.saras-channel.gf.001", mode: "game:g3", input: { kind: "text", value: "has" }, latencyMs: null, hintUsed: false };

function memoryIDB(abort: boolean): IDBFactory {
  return { open() {
    const request: Record<string, unknown> = {};
    const db = { close() {}, transaction() {
      const transaction: Record<string, unknown> = { error: new Error("storage unavailable") };
      const result = { result: body.clientAttemptId };
      transaction.objectStore = () => ({ put: () => result });
      setTimeout(() => { const fn = transaction[abort ? "onabort" : "oncomplete"]; if (typeof fn === "function") fn(); }, 0);
      return transaction;
    } };
    request.result = db;
    setTimeout(() => { const fn = request.onsuccess; if (typeof fn === "function") fn(); }, 0);
    return request;
  } } as unknown as IDBFactory;
}

test("server-confirmed reward is forwarded, duplicate receipt adds zero", async () => {
  globalThis.indexedDB = undefined as unknown as IDBFactory;
  globalThis.fetch = async () => Response.json({ ok: true, tier: "partial", xpAwarded: 7, streak: 2 });
  assert.deepEqual(await sendAttempt(body), { ok: true, queued: false, tier: "partial", xpAwarded: 7, streak: 2 });
  globalThis.fetch = async () => Response.json({ ok: true, tier: "correct", xpAwarded: 20, duplicate: true });
  assert.equal((await sendAttempt(body)).xpAwarded, 0);
});

test("no claimed saving or reward when offline storage is unavailable", async () => {
  globalThis.indexedDB = undefined as unknown as IDBFactory;
  globalThis.fetch = async () => { throw new Error("offline"); };
  assert.deepEqual(await sendAttempt(body), { ok: false, queued: false });
});

test("queued means committed, not merely an attempted IndexedDB write", async () => {
  globalThis.fetch = async () => Response.json({ ok: false, error: "persist_failed", tier: "correct", xpAwarded: 20 });
  globalThis.indexedDB = memoryIDB(false);
  assert.deepEqual(await sendAttempt(body), { ok: false, queued: true });
  globalThis.indexedDB = memoryIDB(true);
  assert.deepEqual(await sendAttempt(body), { ok: false, queued: false });
});

test("permanent rejection cannot silently become a queued answer", async () => {
  globalThis.indexedDB = undefined as unknown as IDBFactory;
  globalThis.fetch = async () => Response.json({ ok: false, error: "bad_request" }, { status: 400 });
  assert.deepEqual(await sendAttempt(body), { ok: false, queued: false });
});
