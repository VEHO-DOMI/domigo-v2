"use client";
/**
 * Offline attempt outbox. `POST /api/attempts` is best-effort; when the server is
 * unreachable (offline / network error / transient 5xx / a 200 "persist_failed"),
 * the payload is kept in IndexedDB under its owner/attempt key and replayed on
 * reconnect (see useOutboxFlush). The endpoint is idempotent on
 * (userId, clientAttemptId), so replaying a payload that actually landed is
 * harmless — it comes back as a duplicate. Dependency-free (raw IndexedDB).
 */

export interface AttemptBody {
  clientAttemptId: string;
  itemId: string;
  mode: string;
  input: unknown;
  latencyMs: number | null;
  hintUsed: boolean;
}

export interface AttemptResult {
  /** Confirmed by the shared server grader, absent while offline. */
  tier?: "correct" | "partial" | "close" | "wrong";
  xpAwarded?: number;
  /** Server accepted + persisted (or an idempotent duplicate). */
  ok: boolean;
  /** Stored in the outbox for a later retry. */
  queued: boolean;
  /** The user's daily streak after this attempt, when the server answered. */
  streak?: number;
}

interface AttemptResponse {
  tier?: AttemptResult["tier"];
  xpAwarded?: number;
  duplicate?: boolean;
  ok?: boolean;
  error?: string;
  streak?: number;
}

/** New rows carry the original sender; legacy ownerless rows are never replayed. */
interface OwnedAttempt extends AttemptBody { ownerId: string }
interface QueuedAttempt {
  /** Keep the existing store/keyPath, but namespace new keys by owner. */
  clientAttemptId: string;
  attempt: OwnedAttempt;
}

const DB_NAME = "domigo";
const STORE = "attempt-outbox";
// Older open tabs request v1 and would delete unknown envelopes after a 4xx.
// Upgrading without recreating the store preserves old rows and fences those writers.
const DB_VERSION = 2;
const hasIDB = (): boolean => typeof indexedDB !== "undefined";
const storageKey = (body: OwnedAttempt): string => JSON.stringify([body.ownerId, body.clientAttemptId]);

type OwnerBinding = { ownerId: string | null };
let activeBinding: OwnerBinding | undefined;
const drains = new WeakMap<OwnerBinding, Promise<number>>();

/** A page lifetime, not an authority: the server still verifies the live session. */
export function bindOutboxOwner(ownerId: string | null): () => void {
  const binding = { ownerId };
  activeBinding = binding;
  return () => { if (activeBinding === binding) activeBinding = undefined; };
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: "clientAttemptId" });
    };
    req.onsuccess = () => {
      req.result.onversionchange = () => req.result.close();
      resolve(req.result);
    };
    req.onerror = () => reject(req.error);
  });
}

function runTx<T>(mode: IDBTransactionMode, op: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const t = db.transaction(STORE, mode);
        const req = op(t.objectStore(STORE));
        req.onerror = () => reject(req.error);
        t.oncomplete = () => { db.close(); resolve(req.result); };
        t.onabort = () => { db.close(); reject(t.error ?? new Error("Attempt storage aborted")); };
        t.onerror = () => { db.close(); reject(t.error); };
      }),
  );
}

/** Persist BEFORE sending; add (not put) makes an attempt's first payload immutable. */
async function remember(body: OwnedAttempt): Promise<{ body: OwnedAttempt; queued: boolean }> {
  if (!hasIDB()) return { body, queued: false };
  const key = storageKey(body);
  try {
    await runTx("readwrite", (s) => s.add({ clientAttemptId: key, attempt: body }));
    return { body, queued: true };
  } catch {
    // A concurrent retry may already have committed this same owner/attempt.
    try {
      const existing = await runTx<QueuedAttempt | undefined>("readonly", (s) => s.get(key));
      if (existing?.attempt?.ownerId === body.ownerId && existing.attempt.clientAttemptId === body.clientAttemptId) {
        return { body: existing.attempt, queued: true };
      }
    } catch { /* unavailable storage: never claim a durable save */ }
    return { body, queued: false };
  }
}

async function dequeue(body: OwnedAttempt): Promise<void> {
  if (!hasIDB()) return;
  try { await runTx("readwrite", (s) => s.delete(storageKey(body))); } catch { /* replay is idempotent */ }
}

async function allQueued(): Promise<QueuedAttempt[]> {
  if (!hasIDB()) return [];
  try { return (await runTx<QueuedAttempt[]>("readonly", (s) => s.getAll())) ?? []; }
  catch { return []; }
}

async function postAttempt(body: OwnedAttempt): Promise<{ res: Response | null; data: AttemptResponse | null }> {
  try {
    const res = await fetch("/api/attempts", {
      method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => null) as AttemptResponse | null;
    return { res, data };
  } catch { return { res: null, data: null }; }
}

/** Only a successful, explicit receipt can remove a stored answer. */
function confirmed(res: Response | null, data: AttemptResponse | null): boolean {
  return res?.ok === true && data?.ok === true;
}

/**
 * The owner comes from the server-rendered page, never from the game payload.
 * A delayed callback retains that owner and cannot send through a newer page.
 * A durable pending answer is not a confirmed booking (and earns no reward).
 */
export async function sendAttempt(body: AttemptBody, ownerId: string | null): Promise<AttemptResult> {
  if (!ownerId) return { ok: false, queued: false };
  const binding = activeBinding;
  const isCurrent = (): boolean => binding !== undefined && binding === activeBinding && binding.ownerId === ownerId;
  let owned: OwnedAttempt;
  try { owned = structuredClone({ ...body, ownerId }); }
  catch { return { ok: false, queued: false }; }
  const saved = await remember(owned);
  if (!isCurrent()) return { ok: false, queued: saved.queued };
  const { res, data } = await postAttempt(saved.body);
  if (!confirmed(res, data)) return { ok: false, queued: saved.queued };
  await dequeue(saved.body);
  // A receipt from a previous page must not update the new child's reward UI.
  if (!isCurrent()) return { ok: false, queued: false };
  void flushOutbox(ownerId);
  const tier = ["correct", "partial", "close", "wrong"].includes(data?.tier ?? "") ? data?.tier : undefined;
  const xpAwarded = Number.isFinite(data?.xpAwarded) && data!.xpAwarded! >= 0
    ? (data?.duplicate ? 0 : data?.xpAwarded) : undefined;
  return { ok: true, queued: false, streak: data?.streak, tier, xpAwarded };
}

/** Drain only this mounted child's rows; switching/unmounting invalidates the whole run. */
export function flushOutbox(ownerId: string | null): Promise<number> {
  const binding = activeBinding;
  if (!ownerId || !binding || binding.ownerId !== ownerId) return Promise.resolve(0);
  const running = drains.get(binding);
  if (running) return running;
  const run = (async () => {
    const items = await allQueued();
    let flushed = 0;
    for (const entry of items) {
      if (activeBinding !== binding) break;
      // A legacy row has no owned envelope. Leave its bytes and key untouched.
      const body = entry.attempt;
      if (!body || body.ownerId !== ownerId || entry.clientAttemptId !== storageKey(body)) continue;
      const { res, data } = await postAttempt(body);
      if (confirmed(res, data)) {
        await dequeue(body);
        flushed++;
      }
      // Lost session / another tab's account switch: preserve this and every remaining row.
      if (!res || [401, 403, 409].includes(res.status)) break;
    }
    return flushed;
  })();
  drains.set(binding, run);
  void run.finally(() => drains.delete(binding));
  return run;
}
