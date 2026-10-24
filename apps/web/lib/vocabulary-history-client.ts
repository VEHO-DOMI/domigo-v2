import type { ResultDetail } from "@domigo/task-ui";
import type { AttemptBody, AttemptResult, AttemptSender } from "./attempt-outbox.ts";

/** Hash before entering the outbox: no item text, keys or earlier raw answers are retained.
 * A failed digest remains unknown; it must not discard the answer. */
export async function withVocabularyHistory(body: AttemptBody, detail: ResultDetail): Promise<AttemptBody> {
  if (detail.kind !== "vocab" || !detail.history) return body;
  // Freeze before the asynchronous digest, including callers outside the card UI.
  const savedBody = structuredClone(body);
  const { contentSnapshot, ...observation } = structuredClone(detail.history);
  let displayedContentSha256: string | null = null;
  try {
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(contentSnapshot));
    displayedContentSha256 = Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, "0")).join("");
  } catch { /* old/insecure environments: explicitly unknown, still save */ }
  return {
    ...savedBody,
    hintUsed: observation.checks.some(check => check.helpShown.length > 0),
    vocabularyHistory: { ...observation, displayedContentSha256 },
  };
}

/** Legacy/grammar detail keeps the existing synchronous dispatch boundary. */
export function sendCompletedAttempt(send: AttemptSender, body: AttemptBody, detail: ResultDetail): Promise<AttemptResult> {
  // Start the sender now so it captures its page before hashing yields.
  return detail.kind === "vocab" && detail.history
    ? send(body, snapshot => withVocabularyHistory(snapshot, detail))
    : send(body);
}

/** Dispatch before any async work: the outbox can synchronously stage the check.
 * A precomputed displayed fingerprint may be unknown, never guessed or upgraded. */
export function sendVocabularyCheck(send: AttemptSender, detail: ResultDetail, sourceMode: string): Promise<AttemptResult> {
  if (detail.kind !== "vocab" || !detail.history?.visitId || !detail.check) return Promise.resolve({ ok: false, queued: false });
  const { check, history: h, input, itemId } = structuredClone(detail);
  const last = h!.checks.at(-1)!;
  return send({ clientAttemptId: check!.id, itemId, mode: "vocabulary-check",
    input, latencyMs: null, hintUsed: last.helpShown.length > 0,
    vocabularyCheck: { schema: "vocabulary-check@1", visitId: h!.visitId!,
      checkNumber: h!.checks.length, maxChecks: h!.maxChecks, checkedAt: check!.checkedAt,
      itemRevision: h!.itemRevision, displayedContentSha256: check!.displayedContentSha256 ?? null,
      reportedTier: last.reportedTier, helpShown: last.helpShown, sourceMode,
    },
  });
}
