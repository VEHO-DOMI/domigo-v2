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
 *
 * welle-076 · EINE AUSNAHME FÜR DEN ERFOLG, UND NUR AUS EINER LISTE. Die
 * Startseite verlinkt die vier Jahrgänge direkt auf /play/1 … /play/4. Ein Kind
 * ohne Sitzung wird von der Middleware mit `from=/play/<n>` zur Anmeldung
 * geschickt, /signin hängt `from` an die Rückkehr-Adresse, und konto gibt sie
 * unverändert zurück. Hier wird `from` gelesen — aber nie übernommen, was
 * irgendwer hineinschreibt: ein `//fremd.example` wäre für den Browser ein
 * anderer Host (Open Redirect). Also zwei Stufen:
 *   · genau EIN führender Schrägstrich, kein zweiter und kein Rückstrich dahinter,
 *     keine Steuerzeichen;
 *   · und dann nur, was auf der Liste steht: /play/1 bis /play/4, ohne Anhang.
 * Alles andere fällt still auf /home. Eine Abweisung liest `from` gar nicht —
 * sie bleibt dieselbe Karte, egal woher das Kind kam.
 */
export const ZIEL_NACH_ANMELDUNG = "/home";
export const ZIEL_ABGEWIESEN = "/zugriff-fehlt";

/** 303, weil der Browser der Weiterleitung mit GET folgen muss, wie er auch kam. */
export const RUECKKEHR_STATUS = 303;

/** Die einzigen Ziele, die `from` benennen darf: ein Jahrgang des Spiels. */
export const ERLAUBTE_ZIELE = /^\/play\/[1-4]$/;

/**
 * `from` → ein erlaubter Pfad, oder `null`. Stufe eins ist schon von der Liste
 * gedeckt; sie steht trotzdem da, damit eine spätere, weitere Liste nie einen
 * Pfad mit zwei Schrägstrichen durchlässt.
 */
export function zielAusFrom(from: string | null | undefined): string | null {
  if (typeof from !== "string") return null;
  if (!from.startsWith("/") || from[1] === "/" || from[1] === "\\") return null;
  if (/\p{Cc}/u.test(from)) return null;
  return ERLAUBTE_ZIELE.test(from) ? from : null;
}

export function zielNachRueckkehr(angemeldet: boolean, from?: string | null): string {
  if (!angemeldet) return ZIEL_ABGEWIESEN;
  return zielAusFrom(from) ?? ZIEL_NACH_ANMELDUNG;
}
