/** A preview acknowledgement lets the story continue; it is never a receipt. */
export type SaveState = "saving" | "saved" | "queued" | "failed" | "unknown" | "preview";
export function answerState(preview: boolean, reply: { ok: boolean; queued: boolean }): SaveState {
  if (preview) return "preview";
  return reply.ok ? "saved" : reply.queued ? "queued" : "failed";
}
export function restoredAnswerState(preview: boolean, status?: string): SaveState {
  if (preview) return "preview";
  return status === "saved" || status === "queued" ? status : "unknown";
}
export const SAVE_COPY: Record<SaveState, string> = {
  saving: "Saving… (= Deine Antwort wird gespeichert …)",
  saved: "Saved. (= Antwort gespeichert und online bestätigt.)",
  queued: "Waiting. (= Wartet auf Online-Bestätigung. Die Antwort liegt auf diesem Gerät.)",
  failed: "Saving failed. (= Speichern fehlgeschlagen. Versuche es noch einmal.)",
  unknown: "Earlier answer. (= Frühere Antwort. Eine Speicherbestätigung fehlt.)",
  preview: "Preview (= Vorschau). Deine Antwort bleibt nur in dieser Ansicht.",
};
