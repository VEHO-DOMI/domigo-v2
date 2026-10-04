/**
 * cgo-047 · Die Schreibseite der Lehrer-Vorschau (lib/student-view.ts).
 *
 * Jede Kinderfläche schickt ihre Antworten über die Outbox an /api/attempts.
 * In der Vorschau darf davon nichts geschehen:
 *
 *   · keine Antwort geht ans Versuchsbuch (die Klassenstatistik zählt nur Kinder);
 *   · die Outbox wird NICHT geleert — /api/attempts antwortet einer Lehrkraft mit
 *     401; die vorgemerkten Antworten des vorherigen Kindes bleiben erhalten.
 *
 * Die Antwort der Vorschau ist `{ ok: true, queued: false }` ohne Netz: so läuft
 * jedes Spiel weiter, auch eines, das auf die Antwort wartet (FOURTEEN), und
 * kein Spiel zeigt »konnte nicht gespeichert werden«. Dass nichts gespeichert
 * wird, sagt das Vorschau-Band (app/PreviewBanner.tsx), nicht das Spiel.
 */
import { sendAttempt, type AttemptBody, type AttemptResult } from "./attempt-outbox.ts";

export const PREVIEW_REPLY: Readonly<AttemptResult> = Object.freeze({ ok: true, queued: false });

/** Der Absender einer Kinderfläche: in der Vorschau ein Stummschalter, sonst die Outbox. */
export function attemptSender(preview: boolean, ownerId: string | null): (body: AttemptBody) => Promise<AttemptResult> {
  if (preview) return () => Promise.resolve({ ...PREVIEW_REPLY });
  return (body) => sendAttempt(body, ownerId);
}
