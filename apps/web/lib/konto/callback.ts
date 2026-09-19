/**
 * dach-018 · WOHIN DIE RÜCKKEHR VON konto FÜHRT — pur, damit es prüfbar ist.
 *
 * Die Route selbst (app/api/auth/callback-konto/route.ts) kann unter plain
 * `node --test` nicht geladen werden: sie importiert `next-auth`, und das
 * findet in pnpms isolierter Ablage sein eigenes `next/server` nicht. Also
 * wohnt die Entscheidung hier, wo sie gemessen werden kann, und die Route ist
 * die Verdrahtung.
 *
 * Es sind genau zwei Ziele, und beide sind Aussagen:
 *   · JEDE Abweisung landet auf derselben Karte. Ein abgelaufenes Ticket, ein
 *     zweimal eingelöstes, eine Lehrkraft ohne die Rolle, ein Kind ohne Klasse —
 *     die Adresse verrät nicht, welche Prüfung nein gesagt hat.
 *   · Ein Erfolg landet auf /home; eine Lehrkraft schickt /home weiter nach
 *     /admin, das entscheidet nicht diese Route.
 */
export const ZIEL_NACH_ANMELDUNG = "/home";
export const ZIEL_ABGEWIESEN = "/zugriff-fehlt";

/** 303, weil der Browser der Weiterleitung mit GET folgen muss, wie er auch kam. */
export const RUECKKEHR_STATUS = 303;

export function zielNachRueckkehr(angemeldet: boolean): string {
  return angemeldet ? ZIEL_NACH_ANMELDUNG : ZIEL_ABGEWIESEN;
}
