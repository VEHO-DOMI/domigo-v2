import assert from "node:assert/strict";
import fs from "node:fs";
import { transpileModule } from "typescript";
import { acknowledgeAttempt, emptyAttemptAck } from "../../../packages/game-paint/src/ack.ts";
import type { PaintAttemptSender } from "../../../packages/game-paint/src/cards/attempt.ts";
import { afterEach, beforeEach, test } from "node:test";
import { bindOutboxOwner, flushOutbox, sendAttempt, subscribeOutboxReplies, type AttemptResult, type AttemptBody } from "./attempt-outbox.ts";
import { sendCompletedAttempt } from "./vocabulary-history-client.ts";
import type { ResultDetail } from "@domigo/task-ui";
import { attemptSender } from "./preview-attempt.ts";
import { startOutboxFlush, type OnlineTarget } from "./useOutboxFlush.ts";

const originalFetch = globalThis.fetch;
const originalIDB = globalThis.indexedDB;
const originalLocalDescriptor = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
let localRows = new Map<string, string>();
function localStore(fail = false): Storage {
  return {get length() {return localRows.size;}, key: i => [...localRows.keys()][i] ?? null,
    getItem: key => localRows.get(key) ?? null,
    setItem: (key,value) => {if(fail) throw Error("synthetic quota"); localRows.set(key,value);},
    removeItem: key => {localRows.delete(key);}, clear: () => localRows.clear(),
  };
}
const A = "fixture-child-a", B = "fixture-child-b";
const body = { clientAttemptId: "00000000-0000-4000-8000-000000000062", itemId: "g2-u01.v.001", mode: "practice", input: { kind: "vocab", value: "fixture" }, latencyMs: null, hintUsed: false };
const tick = () => new Promise<void>((resolve) => setTimeout(resolve, 0));
const receipt = () => Response.json({ ok: true, tier: "correct", xpAwarded: 20, streak: 2 });

/** Only the IndexedDB boundary is replaced; writes become visible at transaction completion. */
function memoryIDB(abort = false) {
  const rows = new Map<string, unknown>();
  let version = 0, storeCreated = false;
  const factory = { open(_name: string, requestedVersion = version || 1) {
    const request: Record<string, unknown> = {};
    const db = {
      get version() { return version; },
      objectStoreNames: { contains: (name: string) => name === "attempt-outbox" && storeCreated },
      createObjectStore() {
        if (storeCreated) throw new DOMException("Store already exists", "ConstraintError");
        storeCreated = true;
      },
      close() {}, transaction() {
      const transaction: Record<string, unknown> = { error: new Error("storage unavailable") };
      transaction.objectStore = () => {
        const operation = (read: () => unknown, write?: () => void) => {
          const req: Record<string, unknown> = {};
          setTimeout(() => {
            try {
              if (abort && write) throw new Error("storage unavailable");
              req.result = structuredClone(read());
              write?.();
              (req.onsuccess as (() => void) | undefined)?.();
              (transaction.oncomplete as (() => void) | undefined)?.();
            } catch (error) {
              req.error = error;
              (req.onerror as (() => void) | undefined)?.();
              (transaction.onabort as (() => void) | undefined)?.();
            }
          }, 0);
          return req;
        };
        return {
          add: (value: { clientAttemptId: string }) => operation(() => {
            if (rows.has(value.clientAttemptId)) throw new Error("ConstraintError");
            return value.clientAttemptId;
          }, () => { rows.set(value.clientAttemptId, structuredClone(value)); }),
          get: (key: string) => operation(() => rows.get(key)),
          getAll: () => operation(() => [...rows.values()]),
          delete: (key: string) => operation(() => undefined, () => { rows.delete(key); }),
        };
      };
      return transaction;
    } };
    request.result = db;
    setTimeout(() => {
      if (requestedVersion < version) {
        request.error = new DOMException("Cannot open an older database version", "VersionError");
        (request.onerror as (() => void) | undefined)?.();
        return;
      }
      if (requestedVersion > version) {
        version = requestedVersion;
        (request.onupgradeneeded as (() => void) | undefined)?.();
      }
      (request.onsuccess as (() => void) | undefined)?.();
    }, 0);
    return request;
  } } as unknown as IDBFactory;
  return { rows, factory, get version() { return version; } };
}
let store: ReturnType<typeof memoryIDB>;
let release = () => {};
const listeners = new Set<() => void>();
const target: OnlineTarget = { addEventListener: (_t, f) => { listeners.add(f); }, removeEventListener: (_t, f) => { listeners.delete(f); } };
beforeEach(() => { localRows = new Map(); Object.defineProperty(globalThis,"localStorage",{configurable:true,value:localStore()}); store = memoryIDB(); globalThis.indexedDB = store.factory; release = bindOutboxOwner(A); });
afterEach(async () => {
  release(); bindOutboxOwner(null)(); listeners.clear();
  await tick(); await tick(); // let any already-started IDB read finish before restoring boundaries
  globalThis.fetch = originalFetch; globalThis.indexedDB = originalIDB;
  if(originalLocalDescriptor) Object.defineProperty(globalThis,"localStorage",originalLocalDescriptor);
  else Reflect.deleteProperty(globalThis,"localStorage");
});
async function offline(owner = A, attempt = body) {
  globalThis.fetch = async () => { throw new Error("offline"); };
  const r = await sendAttempt(attempt, owner);
  assert.deepEqual(r, { ok: false, queued: true });
}

test("A offline / B online / A returns: only A can replay A's durable answer", async () => {
  await offline();
  const original = structuredClone([...store.rows]);
  release(); release = bindOutboxOwner(B);
  const sent: unknown[] = [];
  globalThis.fetch = async (_url, init) => { sent.push(JSON.parse(String(init?.body))); return receipt(); };
  assert.equal(await flushOutbox(B), 0);
  assert.deepEqual([...store.rows], original);
  assert.equal(sent.length, 0);
  release(); release = bindOutboxOwner(A);
  assert.equal(await flushOutbox(A), 1);
  assert.deepEqual(sent, [{ ...body, ownerId: A }]);
  assert.equal(store.rows.size, 0);
});

test("A / teacher / A: preview writes and sends nothing, reconnect is safe", async () => {
  await offline();
  const original = structuredClone([...store.rows]);
  release(); release = startOutboxFlush(false, A, undefined, flushOutbox, target);
  let sends = 0;
  globalThis.fetch = async () => { sends++; return receipt(); };
  assert.deepEqual(await attemptSender(true, A)(body), { ok: true, queued: false });
  assert.equal(await flushOutbox(A), 0);
  assert.equal(listeners.size, 0);
  assert.equal(sends, 0);
  assert.deepEqual([...store.rows], original);
  release(); release = startOutboxFlush(true, A, undefined, flushOutbox, target);
  await flushOutbox(A);
  assert.equal(sends, 1);
  assert.equal(store.rows.size, 0);
});

test("ownerless legacy records survive byte-for-byte while owned records drain", async () => {
  store.rows.set(body.clientAttemptId, structuredClone(body));
  await offline();
  globalThis.fetch = async () => receipt();
  assert.equal(await flushOutbox(A), 1);
  assert.deepEqual([...store.rows], [[body.clientAttemptId, body]]);
});

test("identical attempt UUIDs for two owners cannot overwrite or delete each other", async () => {
  await offline();
  release(); release = bindOutboxOwner(B);
  await offline(B, { ...body, input: { kind: "vocab", value: "B" } });
  assert.equal(store.rows.size, 2);
  const sent: Array<{ ownerId: string; input: unknown }> = [];
  globalThis.fetch = async (_url, init) => { sent.push(JSON.parse(String(init?.body))); return receipt(); };
  assert.equal(await flushOutbox(B), 1);
  assert.equal(store.rows.size, 1);
  assert.deepEqual(sent.map(x => x.ownerId), [B]);
  release(); release = bindOutboxOwner(A);
  assert.equal(await flushOutbox(A), 1);
  assert.deepEqual(sent.map(x => x.ownerId), [B, A]);
  assert.deepEqual(sent[1]!.input, body.input);
});

for (const status of [401, 403, 409, 400, 429, 500]) {
  test(`HTTP ${status} preserves unconfirmed rows (even a misleading ok:true body)`, async () => {
    await offline();
    const original = structuredClone([...store.rows]);
    globalThis.fetch = async () => Response.json({ ok: true }, { status });
    assert.equal(await flushOutbox(A), 0);
    assert.deepEqual([...store.rows], original);
    assert.deepEqual(await sendAttempt(body, A), { ok: false, queued: true });
    assert.deepEqual([...store.rows], original);
  });
}

test("persist_failed and an unreadable receipt never mean confirmed or remove the row", async () => {
  for (const response of [() => Response.json({ ok: false, error: "persist_failed", tier: "correct", xpAwarded: 20 }), () => new Response("broken"), () => Response.json({})]) {
    globalThis.fetch = async () => response();
    assert.deepEqual(await sendAttempt(body, A), { ok: false, queued: true });
    assert.equal(await flushOutbox(A), 0);
    assert.equal(store.rows.size, 1);
  }
  globalThis.fetch = async () => receipt();
  assert.equal(await flushOutbox(A), 1);
});

test("a lost receipt and concurrent retries book one ledger entry with the original UUID", async () => {
  const ledger = new Set<string>();
  let rewards = 0, calls = 0;
  globalThis.fetch = async (_url, init) => {
    const b = JSON.parse(String(init?.body));
    const key = `${b.ownerId}/${b.clientAttemptId}`;
    const duplicate = ledger.has(key);
    ledger.add(key);
    if (!duplicate) rewards++;
    if (++calls === 1) throw new Error("receipt lost after commit");
    return Response.json({ ok: true, duplicate, tier: "correct", xpAwarded: 20 });
  };
  assert.deepEqual(await sendAttempt(body, A), { ok: false, queued: true });
  const [first, second] = await Promise.all([sendAttempt(body, A), sendAttempt(body, A), flushOutbox(A), flushOutbox(A)]);
  assert.equal(first.xpAwarded, 0);
  assert.equal(second.xpAwarded, 0);
  await flushOutbox(A);
  assert.equal(ledger.size, 1);
  assert.equal(rewards, 1);
  assert.equal(store.rows.size, 0);
});

test("switch during a delayed flush: do not send the next old-owner row", async () => {
  await offline(); await offline(A, { ...body, clientAttemptId: "second" });
  let started!: () => void, answer!: (r: Response) => void;
  const entered = new Promise<void>((resolve) => { started = resolve; });
  let sends = 0;
  globalThis.fetch = async () => { sends++; started(); if (sends > 1) return receipt(); return new Promise<Response>((resolve) => { answer = resolve; }); };
  const pending = flushOutbox(A);
  await entered;
  release(); release = bindOutboxOwner(B);
  answer(receipt());
  assert.equal(await pending, 1);
  assert.equal(sends, 1);
  assert.equal(store.rows.size, 1);
  assert.equal(await flushOutbox(B), 0);
  release(); release = bindOutboxOwner(A);
  globalThis.fetch = async () => receipt();
  assert.equal(await flushOutbox(A), 1);
});

test("unmount and same-owner remount invalidate the earlier flush lifetime", async () => {
  await offline(); await offline(A, { ...body, clientAttemptId: "second" });
  let entered!: () => void, answer!: (r: Response) => void;
  const started = new Promise<void>(r => { entered = r; });
  let calls = 0;
  globalThis.fetch = async () => { calls++; entered(); if (calls > 1) return receipt(); return new Promise<Response>(r => { answer = r; }); };
  const pending = flushOutbox(A); await started;
  release(); release = bindOutboxOwner(A);
  answer(receipt()); await pending;
  assert.equal(calls, 1);
  assert.equal(store.rows.size, 1);
});

test("late answer callback retains A and cannot send as the now-mounted B", async () => {
  const senderA = attemptSender(false, A);
  release(); release = bindOutboxOwner(B);
  let requests = 0;
  globalThis.fetch = async () => { requests++; return receipt(); };
  assert.deepEqual(await senderA(body), { ok: false, queued: true });
  assert.equal(requests, 0);
  assert.equal(await flushOutbox(B), 0);
  release(); release = bindOutboxOwner(A);
  assert.equal(await flushOutbox(A), 1);
});

test("a late direct receipt cannot publish a reward after the account changes", async () => {
  let entered!: () => void, answer!: (r: Response) => void;
  const started = new Promise<void>(r => { entered = r; });
  globalThis.fetch = async () => { entered(); return new Promise<Response>(r => { answer = r; }); };
  const pending = sendAttempt(body, A); await started;
  release(); release = bindOutboxOwner(B); answer(receipt());
  assert.deepEqual(await pending, { ok: false, queued: false });
  assert.equal(store.rows.size, 0); // A's confirmed answer was booked; no pending claim for B
});

test("answer input is snapshotted before the first await; retries keep the first payload", async () => {
  globalThis.fetch = async () => { throw new Error("offline"); };
  const mutable = structuredClone(body);
  const pending = sendAttempt(mutable, A);
  mutable.input.value = "changed";
  await pending;
  await sendAttempt(mutable, A);
  const sent: Array<{ input: unknown }> = [];
  globalThis.fetch = async (_url, init) => { sent.push(JSON.parse(String(init?.body))); return receipt(); };
  await flushOutbox(A);
  assert.deepEqual(sent.map(x => x.input), [body.input]);
});

test("no claimed saving or reward when the offline storage is missing or aborts", async () => {
  globalThis.fetch = async () => { throw new Error("offline"); };
  for (const idb of [undefined, memoryIDB(true).factory]) {
    globalThis.indexedDB = idb as IDBFactory;
    assert.deepEqual(await sendAttempt(body, A), { ok: false, queued: false });
  }
});

test("server-confirmed reward survives unavailable device storage; duplicate reward is zero", async () => {
  globalThis.indexedDB = undefined as unknown as IDBFactory;
  globalThis.fetch = async () => Response.json({ ok: true, tier: "partial", xpAwarded: 7, streak: 2 });
  assert.deepEqual(await sendAttempt(body, A), { ok: true, queued: false, tier: "partial", xpAwarded: 7, streak: 2 });
  globalThis.fetch = async () => Response.json({ ok: true, tier: "correct", xpAwarded: 20, duplicate: true });
  assert.equal((await sendAttempt(body, A)).xpAwarded, 0);
});

test("missing owner cannot send or create a new ownerless row", async () => {
  let calls = 0;
  globalThis.fetch = async () => { calls++; return receipt(); };
  assert.deepEqual(await sendAttempt(body, null), { ok: false, queued: false });
  assert.equal(store.rows.size, 0);
  assert.equal(calls, 0);
});

test("v1 upgrade preserves the legacy bytes, never sends them, and fences v1 writers", async () => {
  const legacy = await new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open("domigo", 1);
    req.onupgradeneeded = () => req.result.createObjectStore("attempt-outbox", { keyPath: "clientAttemptId" });
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
  });
  await new Promise<void>((resolve, reject) => {
    const tx = legacy.transaction("attempt-outbox", "readwrite");
    tx.objectStore("attempt-outbox").add(body);
    tx.oncomplete = () => resolve();
    tx.onabort = () => reject(tx.error);
  });
  assert.equal(legacy.version, 1);
  legacy.close();
  const bytes = JSON.stringify([...store.rows]);
  const sent: unknown[] = [];
  globalThis.fetch = async (_url, init) => { sent.push(JSON.parse(String(init?.body))); return receipt(); };
  assert.equal(await flushOutbox(A), 0); // the production open performs the upgrade
  assert.equal(store.version, 2);
  assert.equal(JSON.stringify([...store.rows]), bytes);
  assert.equal(sent.length, 0);
  await assert.rejects(new Promise((resolve, reject) => {
    const req = indexedDB.open("domigo", 1);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => { req.result.close(); resolve(req.result); };
  }), { name: "VersionError" });
  await offline();
  globalThis.fetch = async (_url, init) => { sent.push(JSON.parse(String(init?.body))); return receipt(); };
  assert.equal(await flushOutbox(A), 1);
  assert.deepEqual(sent, [{ ...body, ownerId: A }]);
  assert.equal(JSON.stringify([...store.rows]), bytes);
});

test("hook unmount releases its binding without needing a replacement mount", async () => {
  await offline(); await offline(A, { ...body, clientAttemptId: "second" });
  release();
  let entered!: () => void, answer!: (r: Response) => void;
  const started = new Promise<void>(resolve => { entered = resolve; });
  let sends = 0, pending!: Promise<number>;
  globalThis.fetch = async () => {
    sends++; entered();
    if (sends > 1) return receipt();
    return new Promise<Response>(resolve => { answer = resolve; });
  };
  // Exercise the exact cleanup returned to useEffect, with the real outbox.
  const cleanup = startOutboxFlush(true, A, undefined, owner => (pending = flushOutbox(owner)), target);
  release = cleanup;
  await started;
  cleanup();
  assert.equal(listeners.size, 0);
  answer(receipt());
  assert.equal(await pending, 1);
  assert.equal(sends, 1);
  assert.equal(store.rows.size, 1);
  assert.equal(await flushOutbox(A), 0);
  assert.equal(sends, 1);
  // Returning to the same account starts a fresh lifetime and drains the remainder.
  release = startOutboxFlush(true, A, undefined, flushOutbox, target);
  assert.equal(await flushOutbox(A), 1);
  assert.equal(sends, 2);
  assert.equal(store.rows.size, 0);
});

for (const failure of ["timeout", "blocked"] as const) {
  test(`IDB ${failure}: online send proceeds without a false save; late opens are abandoned`, async (t) => {
    t.mock.timers.enable({ apis: ["setTimeout"] });
    try {
      const requests: Array<Record<string, unknown>> = [];
      globalThis.indexedDB = { open() {
        const request: Record<string, unknown> = {};
        requests.push(request);
        return request;
      } } as unknown as IDBFactory;
      let sends = 0, closed = 0, transactions = 0, upgrades = 0, aborted = 0;
      globalThis.fetch = async () => { sends++; return Response.json({ ok: false }, { status: 500 }); };
      let result: Awaited<ReturnType<typeof sendAttempt>> | undefined;
      void sendAttempt(body, A).then(value => { result = value; });
      assert.equal(requests.length, 1);
      const request = requests[0]!;
      if (failure === "timeout") {
        t.mock.timers.tick(2999);
        await new Promise<void>(resolve => setImmediate(resolve));
        assert.equal(sends, 0);
        assert.equal(result, undefined);
        t.mock.timers.tick(1);
      } else {
        (request.onblocked as (() => void) | undefined)?.();
      }
      // setImmediate lets promises settle without advancing the simulated clock.
      await new Promise<void>(resolve => setImmediate(resolve));
      assert.equal(sends, 1);
      assert.deepEqual(result, { ok: false, queued: false });
      assert.equal(requests.length, 1, "do not repeat a failed open before sending online");
      request.result = {
        close() { closed++; },
        transaction() { transactions++; throw new Error("late writes are forbidden"); },
        objectStoreNames: { contains: () => false },
        createObjectStore() { upgrades++; },
      };
      request.transaction = { abort() { aborted++; } };
      (request.onupgradeneeded as (() => void) | undefined)?.();
      assert.equal(aborted, 1);
      assert.equal(upgrades, 0);
      (request.onsuccess as (() => void) | undefined)?.();
      await new Promise<void>(resolve => setImmediate(resolve));
      assert.equal(closed, 1);
      assert.equal(transactions, 0);
      assert.equal(sends, 1);
      assert.equal(store.rows.size, 0);
    } finally { t.mock.timers.reset(); }
  });
}

test("a blocked drain keeps saved rows and a later unblocked open can replay them", async () => {
  await offline();
  const original = JSON.stringify([...store.rows]);
  let sends = 0;
  globalThis.fetch = async () => { sends++; return receipt(); };
  globalThis.indexedDB = { open() {
    const request: Record<string, unknown> = {};
    setTimeout(() => { (request.onblocked as (() => void) | undefined)?.(); }, 0);
    return request;
  } } as unknown as IDBFactory;
  assert.equal(await flushOutbox(A), 0);
  assert.equal(sends, 0);
  assert.equal(JSON.stringify([...store.rows]), original);
  globalThis.indexedDB = store.factory;
  assert.equal(await flushOutbox(A), 1);
  assert.equal(sends, 1);
  assert.equal(store.rows.size, 0);
});


test("replay delivers the original id and exact normalized server receipt only to its owner", async () => {
  await offline();
  const own: unknown[] = [], foreign: unknown[] = [];
  const stopA = subscribeOutboxReplies(A, (id, reply) => own.push([id, reply]));
  const stopB = subscribeOutboxReplies(B, (id, reply) => foreign.push([id, reply]));
  globalThis.fetch = async () => Response.json({ ok: true, tier: "partial", xpAwarded: 3, streak: 4 });
  assert.equal(await flushOutbox(A), 1);
  assert.deepEqual(own, [[body.clientAttemptId, { ok: true, queued: false, tier: "partial", xpAwarded: 3, streak: 4 }]]);
  assert.deepEqual(foreign, []);
  assert.equal(store.rows.size, 0);
  stopA(); stopB();
});

for (const [label, data, points, tier] of [
  ["duplicate", { duplicate: true, tier: "correct", xpAwarded: 20 }, 0, "correct"],
  ["missing points", { tier: "wrong" }, undefined, "wrong"],
  ["invalid points and tier", { tier: "invented", xpAwarded: -1 }, undefined, undefined],
] as const) {
  test(`replay normalization matches direct send: ${label}`, async () => {
    await offline();
    const replies: AttemptResult[] = [];
    const stop = subscribeOutboxReplies(A, (_id, reply) => replies.push(reply));
    globalThis.fetch = async () => Response.json({ ok: true, ...data });
    assert.equal(await flushOutbox(A), 1);
    const direct = await sendAttempt({ ...body, clientAttemptId: "direct" }, A);
    assert.deepEqual(replies, [direct]);
    assert.equal(replies[0]?.xpAwarded, points);
    assert.equal(replies[0]?.tier, tier);
    stop();
  });
}

test("unconfirmed replay never publishes a reply", async () => {
  await offline();
  let calls = 0;
  const stop = subscribeOutboxReplies(A, () => { calls++; });
  for (const response of [() => Response.json({ ok: false, xpAwarded: 20 }), () => Response.json({ ok: true, xpAwarded: 20 }, { status: 500 }), () => new Response("broken")]) {
    globalThis.fetch = async () => response();
    assert.equal(await flushOutbox(A), 0);
    assert.equal(calls, 0);
    assert.equal(store.rows.size, 1);
  }
  stop();
});

for (const next of [A, B, null]) {
  test(`late replay cannot publish across a replaced binding (${next})`, async () => {
    await offline();
    const seen: unknown[] = [];
    const stop = subscribeOutboxReplies(A, (id, r) => seen.push([id, r]));
    let entered!: () => void, answer!: (r: Response) => void;
    const started = new Promise<void>(r => { entered = r; });
    globalThis.fetch = async () => { entered(); return new Promise<Response>(r => { answer = r; }); };
    const pending = flushOutbox(A); await started;
    release = bindOutboxOwner(next);
    const stopNext = next ? subscribeOutboxReplies(next, (id, r) => seen.push([id, r])) : () => {};
    answer(receipt());
    assert.equal(await pending, 1);
    assert.deepEqual(seen, []);
    stop(); stopNext();
  });
}

test("switching away and back never revives old subscribers", async () => {
  await offline();
  let old = 0, current = 0;
  const stopOld = subscribeOutboxReplies(A, () => { old++; });
  bindOutboxOwner(B);
  release = bindOutboxOwner(A);
  const stopCurrent = subscribeOutboxReplies(A, () => { current++; });
  globalThis.fetch = async () => receipt();
  await flushOutbox(A);
  assert.equal(old, 0); assert.equal(current, 1);
  stopOld(); stopCurrent();
});

test("unsubscription is independent, idempotent and leaves replay without listeners unchanged", async () => {
  await offline();
  let calls = 0;
  const listener = () => { calls++; };
  const first = subscribeOutboxReplies(A, listener), second = subscribeOutboxReplies(A, listener);
  first(); first();
  globalThis.fetch = async () => receipt();
  assert.equal(await flushOutbox(A), 1);
  assert.equal(calls, 1);
  second();
  await offline(A, { ...body, clientAttemptId: "without-listener" });
  globalThis.fetch = async () => receipt();
  assert.equal(await flushOutbox(A), 1);
  assert.equal(calls, 1); assert.equal(store.rows.size, 0);
});

test("binding release removes old subscriptions before same-owner remount", async () => {
  await offline();
  let old = 0, current = 0;
  subscribeOutboxReplies(A, () => { old++; });
  release(); release = bindOutboxOwner(A);
  const stop = subscribeOutboxReplies(A, () => { current++; });
  globalThis.fetch = async () => receipt();
  await flushOutbox(A);
  assert.equal(old, 0); assert.equal(current, 1);
  stop();
});

test("a subscriber changing owner prevents delivery to the next subscriber", async () => {
  await offline();
  let calls = 0;
  const first = subscribeOutboxReplies(A, () => { release = bindOutboxOwner(B); });
  const second = subscribeOutboxReplies(A, () => { calls++; });
  globalThis.fetch = async () => receipt();
  await flushOutbox(A);
  assert.equal(calls, 0);
  first(); second();
});

test("a broken subscriber cannot stop the other subscriber or the next durable row", async () => {
  await offline(); await offline(A, { ...body, clientAttemptId: "second" });
  const bad = subscribeOutboxReplies(A, () => { throw new Error("view failure"); });
  const ids: string[] = [];
  const good = subscribeOutboxReplies(A, id => ids.push(id));
  globalThis.fetch = async () => receipt();
  assert.equal(await flushOutbox(A), 2);
  assert.deepEqual(ids, [body.clientAttemptId, "second"]);
  assert.equal(store.rows.size, 0);
  bad(); good();
});


// Execute the actual BuchClient wiring and PaintGame hook, with only React's
// mounting boundary recorded. Owner binding, send, replay, subscription and
// reducer remain production code; the existing IDB fixture supplies storage.
function mountBookOwner(ownerId: string) {
  const src = fs.readFileSync(new URL("../app/(game)/play/[grade]/buch/[chapter]/BuchClient.tsx", import.meta.url), "utf8");
  const from = src.indexOf("  const { cardBench, cardBenchTask, playerKey, preview, ownerId, ...game } = props;");
  const to = src.indexOf("  // R5-W2 · J1-B:", from);
  assert.ok(from >= 0 && to > from, "the real BuchClient wiring must be present");
  const js = transpileModule(`function wiring(props) { ${src.slice(from, to)}; return { send, attemptReplies }; }`, {}).outputText;
  let releaseOwner = () => {};
  let initialDrain = Promise.resolve(0);
  const mount = new Function("useMemo", "useOutboxFlush", "subscribeOutboxReplies", "attemptSender", `${js}; return wiring;`)(
    (fn: () => unknown) => fn(),
    (enabled: boolean, owner: string | null) => {
      releaseOwner = startOutboxFlush(enabled, owner, undefined, id => (initialDrain = flushOutbox(id)), target);
    }, subscribeOutboxReplies, attemptSender,
  ) as (props: { preview: boolean; ownerId: string }) => {
    send: PaintAttemptSender;
    attemptReplies: (listener: (id: string, reply: AttemptResult) => void) => () => void;
  };
  const wiring = mount({ preview: false, ownerId });
  return { ...wiring, initialDrain, release: releaseOwner };
}

function mountBookGame(book: ReturnType<typeof mountBookOwner>) {
  const src = fs.readFileSync(new URL("../../../packages/game-paint/src/PaintGame.tsx", import.meta.url), "utf8");
  const from = src.indexOf("function useAttemptAck("), to = src.indexOf("export default function PaintGame(");
  assert.ok(from >= 0 && to > from, "the real PaintGame hook must be present");
  const js = transpileModule(src.slice(from, to), {}).outputText;
  const effects: Array<() => (() => void) | undefined> = [];
  let state = emptyAttemptAck(), writes = 0, deliveries = 0;
  const mount = new Function("React", "useRef", "useEffect", "useState", "acknowledgeAttempt", "emptyAttemptAck", `${js}; return useAttemptAck;`)(
    { useReducer: (reducer: typeof acknowledgeAttempt) => [state, (action: Parameters<typeof acknowledgeAttempt>[1]) => {
      writes++; state = reducer(state, action);
    }], useMemo: (fn: () => unknown) => fn() },
    (current: unknown) => ({ current }), (effect: () => (() => void) | undefined) => effects.push(effect),
    (initial: boolean) => [initial, () => {}], acknowledgeAttempt, emptyAttemptAck,
  ) as (sender: PaintAttemptSender, replies: typeof book.attemptReplies) => { send: PaintAttemptSender };
  const hook = mount(book.send, listener => book.attemptReplies((id, reply) => { deliveries++; listener(id, reply); }));
  const cleanup = effects.map(effect => effect());
  return { ...hook, state: () => state, writes: () => writes, deliveries: () => deliveries, unmount: () => cleanup.forEach(fn => fn?.()) };
}

const paintBody = { ...body, mode: "game:g1", input: { kind: "choice", value: "Open!" }, latencyMs: 1 } as const;

test("book parent release kills its child subscription before same-owner remount", async () => {
  release();
  const parent = mountBookOwner(A); release = parent.release;
  await parent.initialDrain; // dynamic child mounts after its parent's binding
  const child = mountBookGame(parent);
  globalThis.fetch = async () => { throw new Error("offline"); };
  await child.send(paintBody);
  const state = child.state(), writes = child.writes();
  assert.equal(state.pending.has(paintBody.clientAttemptId), true);
  parent.release(); // deliberately keep the old child alive: isolate the parent's responsibility
  const nextParent = mountBookOwner(A); release = nextParent.release;
  await nextParent.initialDrain; // still offline; row remains for the new child
  const nextChild = mountBookGame(nextParent);
  try {
    globalThis.fetch = async () => receipt();
    assert.equal(await flushOutbox(A), 1);
    assert.equal(child.deliveries(), 0, "parent release must remove the old child's listener");
    assert.equal(child.writes(), writes); assert.equal(child.state(), state);
    assert.equal(nextChild.deliveries(), 1, "the newly mounted child has a live subscription");
    assert.equal(nextChild.writes(), 0, "a new book ignores the earlier book's id");
    assert.equal(nextChild.state().total, 0);
    assert.equal(store.rows.size, 0);
  } finally { child.unmount(); nextChild.unmount(); nextParent.release(); }
});

test("book account switch couples owner release with both PaintGame subscriptions", async () => {
  release();
  const parentA = mountBookOwner(A); release = parentA.release;
  await parentA.initialDrain;
  const childA = mountBookGame(parentA);
  globalThis.fetch = async () => { throw new Error("offline"); };
  await childA.send(paintBody);
  const stateA = childA.state(), writesA = childA.writes(), savedA = structuredClone([...store.rows]);
  parentA.release();
  const parentB = mountBookOwner(B); release = parentB.release;
  await parentB.initialDrain;
  const childB = mountBookGame(parentB);
  try {
    globalThis.fetch = async () => receipt();
    assert.equal(await flushOutbox(B), 0);
    assert.deepEqual([...store.rows], savedA);
    assert.equal(childA.deliveries(), 0); assert.equal(childB.deliveries(), 0);
    globalThis.fetch = async () => { throw new Error("offline"); };
    await childB.send(paintBody); // same id in both accounts: a leaked reply would be countable
    globalThis.fetch = async () => receipt();
    assert.equal(await flushOutbox(B), 1);
    assert.equal(childB.deliveries(), 1); assert.equal(childB.state().total, 20);
    assert.equal(childB.state().pending.size, 0);
    assert.equal(childA.deliveries(), 0); assert.equal(childA.writes(), writesA); assert.equal(childA.state(), stateA);
    assert.deepEqual([...store.rows], savedA);
    const stateB = childB.state(), writesB = childB.writes();
    parentB.release();
    const returning = mountBookOwner(A); release = returning.release;
    assert.equal(await returning.initialDrain, 1);
    assert.equal(store.rows.size, 0);
    assert.equal(childA.deliveries(), 0, "returning to A must not revive its old child");
    assert.equal(childA.writes(), writesA); assert.equal(childA.state(), stateA);
    assert.equal(childB.deliveries(), 1); assert.equal(childB.writes(), writesB); assert.equal(childB.state(), stateB);
  } finally { childA.unmount(); childB.unmount(); release(); }
});

test("replay notifies only after its successful local dequeue has completed", async () => {
  await offline();
  const observed: Array<{ id: string; queuedRows: number }> = [];
  const stop = subscribeOutboxReplies(A, id => { observed.push({ id, queuedRows: store.rows.size }); });
  try {
    globalThis.fetch = async () => receipt();
    assert.equal(await flushOutbox(A), 1);
    // Check outside the listener: the outbox intentionally catches listener errors.
    assert.deepEqual(observed, [{ id: body.clientAttemptId, queuedRows: 0 }]);
  } finally { stop(); }
});

test("lost first acknowledgement replays the original receipt without a second incremental reward", async () => {
  const store = memoryIDB(); globalThis.indexedDB = store.factory;
  bindOutboxOwner(A);
  let booked = false, bookings = 0;
  const original = { tier: "partial" as const, xpAwarded: 7 };
  globalThis.fetch = async () => {
    if (!booked) { booked = true; bookings++; throw new Error("first response lost after booking"); }
    return Response.json({ ok: true, duplicate: true, tier: "correct", xpAwarded: 20, receipt: original });
  };
  assert.deepEqual(await sendAttempt(body, A), { ok: false, queued: true });
  const replies: AttemptResult[] = [];
  const stop = subscribeOutboxReplies(A, (_id, reply) => replies.push(reply));
  assert.equal(await flushOutbox(A), 1);
  assert.equal(bookings, 1); assert.equal(store.rows.size, 0);
  assert.equal(replies[0]?.xpAwarded, 0); assert.deepEqual(replies[0]?.receipt, original);
  stop();
});
test("duplicate acknowledgement overtakes first response with the same original receipt", async () => {
  const store = memoryIDB(); globalThis.indexedDB = store.factory;
  bindOutboxOwner(A);
  const original = { tier: "correct" as const, xpAwarded: 20 };
  let release: (() => void) | undefined;
  globalThis.fetch = async () => {
    if (release) return Response.json({ ok: true, duplicate: true, ...original, receipt: original });
    return new Promise<Response>(resolve => { release = () => resolve(Response.json({ ok: true, ...original, receipt: original })); });
  };
  const first = sendAttempt(body, A);
  while (!release) await tick();
  const replies: AttemptResult[] = [];
  const stop = subscribeOutboxReplies(A, (_id, reply) => replies.push(reply));
  assert.equal(await flushOutbox(A), 1);
  assert.equal(replies[0]?.xpAwarded, 0); assert.deepEqual(replies[0]?.receipt, original);
  release(); assert.deepEqual((await first).receipt, original); stop();
});
for (const receipt of [{tier:"invented",xpAwarded:20},{tier:"correct",xpAwarded:-1},{tier:"correct",xpAwarded:"20"},null]) {
  test(`malformed stored receipt is not forwarded: ${JSON.stringify(receipt)}`, async () => {
    bindOutboxOwner(A); globalThis.indexedDB = undefined as unknown as IDBFactory;
    globalThis.fetch = async () => Response.json({ ok: true, duplicate: true, receipt });
    assert.equal((await sendAttempt(body, A)).receipt, undefined);
  });
}


test("completion observations survive offline replay unchanged under the original attempt identity", async () => {
  const observed = { schema: "vocabulary-completion@1" as const, itemRevision: 2, displayedContentSha256: "a".repeat(64), maxChecks: 3 as const,
    checks: [{ reportedTier: "wrong" as const, helpShown: [] }, { reportedTier: "correct" as const, helpShown: ["hint" as const] }] };
  const payload = { ...body, vocabularyHistory: observed, hintUsed: true };
  globalThis.fetch = async () => { throw Error("offline"); };
  assert.deepEqual(await sendAttempt(payload, A), { ok: false, queued: true });
  observed.checks[0]!.helpShown = ["hint"];
  const received: AttemptBody[] = [];
  globalThis.fetch = async (_url, init) => { received.push(JSON.parse(String(init!.body))); return receipt(); };
  assert.equal(await flushOutbox(A), 1);
  assert.equal(received[0]!.clientAttemptId, body.clientAttemptId);
  assert.deepEqual(received[0]!.vocabularyHistory!.checks, [{ reportedTier: "wrong", helpShown: [] }, { reportedTier: "correct", helpShown: ["hint"] }]);
});

for (const replacement of ["different owner", "same owner", "away and back"] as const) test(`hash preparation cannot adopt ${replacement} page; original bytes remain replayable`, async () => {
  const originalCrypto = globalThis.crypto;
  let finishDigest!: () => void;
  Object.defineProperty(globalThis, "crypto", { configurable: true, value: { subtle: { digest: () => new Promise<ArrayBuffer>(resolve => {
    finishDigest = () => resolve(new Uint8Array(32).buffer);
  }) } } });
  const detail: ResultDetail = { kind: "vocab", itemId: body.itemId, input: { kind: "vocab", value: "fixture", pool: "carrier" }, history: {
    schema: "vocabulary-completion@1", itemRevision: 1, contentSnapshot: "synthetic snapshot", maxChecks: 3,
    checks: [{ reportedTier: "wrong", helpShown: [] }, { reportedTier: "correct", helpShown: ["hint"] }],
  } };
  let sends = 0;
  globalThis.fetch = async () => { sends++; return receipt(); };
  try {
    const pending = sendCompletedAttempt(attemptSender(false, A), body, detail);
    assert.equal(typeof finishDigest, "function");
    release(); release = bindOutboxOwner(replacement === "same owner" ? A : B);
    if (replacement === "away and back") { release(); release = bindOutboxOwner(A); }
    finishDigest();
    assert.deepEqual(await pending, { ok: false, queued: true });
    assert.equal(sends, 0, "no direct request through the replacement page");
    if (replacement === "different owner") { assert.equal(await flushOutbox(B), 0); release(); release = bindOutboxOwner(A); }
    assert.equal(await flushOutbox(A), 1, "a separate owner-authorized drain can replay the saved body");
    assert.equal(sends, 1);
  } finally { Object.defineProperty(globalThis, "crypto", { configurable: true, value: originalCrypto }); }
});

const historyBody = (): AttemptBody => ({ ...structuredClone(body), mode:"vocabulary-check",
  vocabularyCheck:{schema:"vocabulary-check@1",visitId:"00000000-0000-4000-8000-000000000010",checkNumber:1,maxChecks:3,
    itemRevision:1,displayedContentSha256:null,sourceMode:"practice",checkedAt:null,reportedTier:"wrong",helpShown:[]},
});
test("history stage is durable synchronously before IndexedDB commits", async () => {
  globalThis.fetch = async () => {throw Error("offline");};
  const pending = sendAttempt(historyBody(),A);
  assert.equal(localRows.size,1); assert.equal(store.rows.size,0);
  const first = JSON.parse([...localRows.values()][0]!); assert.equal(first.attempt.ownerId,A); assert.equal(first.attempt.vocabularyCheck.checkNumber,1);
  assert.deepEqual(await pending,{ok:false,queued:true}); assert.equal(store.rows.size,1);
});
test("history staging alone survives missing IndexedDB and replays only for its owner", async () => {
  globalThis.indexedDB = undefined as unknown as IDBFactory;
  globalThis.fetch = async () => {throw Error("offline");};
  assert.deepEqual(await sendAttempt(historyBody(),A),{ok:false,queued:true});
  let posted=0; globalThis.fetch=async () => {posted++;return Response.json({ok:true,kind:"vocabulary-check"});};
  bindOutboxOwner(B); assert.equal(await flushOutbox(B),0); assert.equal(posted,0); assert.equal(localRows.size,1);
  bindOutboxOwner(A); assert.equal(await flushOutbox(A),1); assert.equal(posted,1); assert.equal(localRows.size,0);
});
test("both pending copies are removed only after confirmed history acknowledgement", async () => {
  globalThis.fetch=async () => Response.json({ok:false,error:"persistence_unavailable"},{status:503});
  assert.deepEqual(await sendAttempt(historyBody(),A),{ok:false,queued:true}); assert.equal(localRows.size,1); assert.equal(store.rows.size,1);
  globalThis.fetch=async () => Response.json({ok:true,kind:"vocabulary-check"});
  assert.equal(await flushOutbox(A),1); assert.equal(localRows.size,0); assert.equal(store.rows.size,0);
});
test("history staged duplicate keeps its first payload before either asynchronous write", async () => {
  globalThis.fetch=async () => {throw Error("offline");};
  const first=sendAttempt(historyBody(),A); const altered=historyBody(); altered.input={kind:"vocab",value:"changed",pool:"carrier"};
  const second=sendAttempt(altered,A); await Promise.all([first,second]);
  const staged=JSON.parse([...localRows.values()][0]!); assert.deepEqual(staged.attempt.input,body.input);
  assert.deepEqual((([...store.rows.values()][0]) as {attempt:AttemptBody}).attempt.input,body.input);
});
test("unavailable synchronous staging still uses IndexedDB without claiming missing storage", async () => {
  Object.defineProperty(globalThis,"localStorage",{configurable:true,value:localStore(true)});
  globalThis.fetch=async () => {throw Error("offline");};
  assert.deepEqual(await sendAttempt(historyBody(),A),{ok:false,queued:true}); assert.equal(localRows.size,0); assert.equal(store.rows.size,1);
  globalThis.indexedDB=undefined as unknown as IDBFactory;
  assert.deepEqual(await sendAttempt({...historyBody(),clientAttemptId:crypto.randomUUID()},A),{ok:false,queued:false});
});
test("existing completion payloads never enter the synchronous history stage", async () => {
  await offline(); assert.equal(localRows.size,0); assert.equal(store.rows.size,1);
});
