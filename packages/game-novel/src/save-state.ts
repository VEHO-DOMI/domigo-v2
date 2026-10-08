/** A preview acknowledgement lets the story continue; it is never a receipt. */
export type SaveState = "saving" | "saved" | "queued" | "failed" | "unknown" | "preview";
export function answerState(preview: boolean, reply: { ok: boolean; queued: boolean }): SaveState {
  if (preview) return "preview";
  return reply.ok ? "saved" : reply.queued ? "queued" : "failed";
}
export function restoredAnswerState(preview: boolean, status?: string): SaveState {
  if (preview) return "preview";
  // A queued snapshot has no live receipt: the shared outbox may have sent it since.
  return status === "saved" ? status : "unknown";
}
export const SAVE_COPY: Record<SaveState, string> = {
  saving: "Saving… (= Deine Antwort wird gespeichert …)",
  saved: "Saved. (= Antwort gespeichert und online bestätigt.)",
  queued: "Added to the queue. (= Auf diesem Gerät zum Senden vorgemerkt. Hier fehlt noch die Online-Bestätigung.)",
  failed: "Saving failed. (= Speichern fehlgeschlagen. Versuche es noch einmal.)",
  unknown: "Earlier answer. (= Frühere Antwort. Eine Speicherbestätigung fehlt.)",
  preview: "Preview (= Vorschau). Deine Antwort bleibt nur in dieser Ansicht.",
};
