"use client";
/**
 * Offline attempt outbox. `POST /api/attempts` is best-effort; when the server is
 * unreachable (offline / network error / transient 5xx / a 200 "persist_failed"),
 * the payload is queued in IndexedDB keyed by `clientAttemptId` and replayed on
 * reconnect (see useOutboxFlush). The endpoint is idempotent on
 * (userId, clientAttemptId), so replaying a payload that actually landed is
 * harmless — it comes back as a duplicate. Dependency-free (raw IndexedDB).
 */

import type { ProjectedWorldState } from "@domigo/game-core";

export interface AttemptBody {
  clientAttemptId: string;
  itemId: string;
  mode: string;
  input: unknown;
  latencyMs: number | null;
  hintUsed: boolean;
  worldContext?: { worldId: string; encounterId: string };
  previewToken?: string;
}

export interface AttemptResult {
  /** Server accepted + persisted (or an idempotent duplicate). */
  ok: boolean;
  /** Stored in the outbox for a later retry. */
  queued: boolean;
  /** The user's daily streak after this attempt, when the server answered. */
  streak?: number;
  worldState?: ProjectedWorldState;
  xpAwarded?: number;
}

interface AttemptResponse {
  ok?: boolean;
  error?: string;
  streak?: number;
  worldState?: ProjectedWorldState;
  xpAwarded?: number;
}

const DB_NAME = "domigo";
const STORE = "attempt-outbox";
const DB_VERSION = 1;

const hasIDB = (): boolean => typeof indexedDB !== "undefined";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: "clientAttemptId" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function runTx<T>(mode: IDBTransactionMode, op: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const t = db.transaction(STORE, mode);
        const req = op(t.objectStore(STORE));
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
        t.oncomplete = () => db.close();
      }),
  );
}

async function enqueue(body: AttemptBody): Promise<void> {
  if (!hasIDB()) return;
  try {
    await runTx("readwrite", (s) => s.put(body));
  } catch {
    /* IndexedDB blocked (private mode, quota) — drop silently; feedback already shown. */
  }
}

async function dequeue(clientAttemptId: string): Promise<void> {
  if (!hasIDB()) return;
  try {
    await runTx("readwrite", (s) => s.delete(clientAttemptId));
  } catch {
    /* ignore */
  }
}

async function allQueued(): Promise<AttemptBody[]> {
  if (!hasIDB()) return [];
  try {
    return (await runTx<AttemptBody[]>("readonly", (s) => s.getAll() as IDBRequest<AttemptBody[]>)) ?? [];
  } catch {
    return [];
  }
}

function postAttempt(body: AttemptBody): Promise<Response> {
  const { previewToken, ...payload } = body;
  return fetch("/api/attempts", {
    method: "POST",
    headers: { "content-type": "application/json", ...(previewToken ? { "x-domigo-preview-token": previewToken } : {}) },
    body: JSON.stringify(payload),
  });
}

/** A failure worth retrying later — vs. a permanent 4xx client rejection that would loop forever. */
function isTransient(res: Response | null, data: AttemptResponse | null): boolean {
  if (!res) return true; // fetch threw → offline/network
  if (res.status >= 500) return true; // server error
  if (res.ok && data?.ok === false && data?.error === "persist_failed") return true; // graded ok, DB write failed
  return false;
}

/**
 * Send one attempt. On a transient failure it's queued for retry and
 * `{ ok:false, queued:true }` is returned; the caller has already shown optimistic
 * feedback, so this never throws.
 */
export async function sendAttempt(body: AttemptBody): Promise<AttemptResult> {
  let res: Response | null = null;
  try {
    res = await postAttempt(body);
  } catch {
    res = null;
  }
  const data = res ? ((await res.json().catch(() => null)) as AttemptResponse | null) : null;

  if (isTransient(res, data)) {
    await enqueue(body);
    return { ok: false, queued: true };
  }
  if (data?.ok) {
    void flushOutbox(); // a live response means we're online — opportunistically drain any backlog
    return { ok: true, queued: false, streak: data.streak, worldState: data.worldState, xpAwarded: data.xpAwarded };
  }
  return { ok: false, queued: false }; // permanent 4xx — nothing to retry
}

/** Replay every queued attempt. Stops on the first network failure (still offline). */
export async function flushOutbox(): Promise<number> {
  const items = await allQueued();
  let flushed = 0;
  for (const body of items) {
    let res: Response | null = null;
    try {
      res = await postAttempt(body);
    } catch {
      res = null;
    }
    if (!res) break; // still offline — keep the remaining items for next time
    const data = (await res.json().catch(() => null)) as AttemptResponse | null;
    if (isTransient(res, data)) continue; // transient — leave queued, try the rest
    await dequeue(body.clientAttemptId); // success OR permanent 4xx → remove (a 4xx never succeeds)
    if (data?.ok) flushed++;
  }
  return flushed;
}
