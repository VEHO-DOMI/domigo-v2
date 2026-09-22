/**
 * dach-123 · K6-Go — der reine Abgleich zwischen DomiGos eigenen Zeilen und der
 * Klassenliste der Schule.
 *
 * Diese Datei holt sich NICHTS von aussen — keine Einfuhr-Zeile, auch nicht
 * für Typen: eine reine Funktion, die sich ohne Datenbank, ohne Netz und ohne
 * Anwendungsgerüst prüfen lässt — gleiche Eingabe, gleiche Ausgabe. Die Formen
 * der beiden Eingaben werden darum strukturell wiederholt (dasselbe Vorgehen
 * wie in lib/grandmaster.ts und aus demselben Grund). Das Tor darf deshalb den
 * ROHEN Quelltext prüfen, Kommentare eingeschlossen: in dieser Datei kommen
 * die beiden verbotenen Wörter an KEINER Stelle vor, auch nicht in Prosa.
 *
 * Abgeglichen wird AUSSCHLIESSLICH über die Kennung, nie über den Namen (E3).
 * Zwei Kinder namens »WEISS Anna« sind zwei Kinder; dasselbe Kind darf zweimal
 * dastehen, wenn aus der Zeit vor Lauter Einser noch eine lokale Platzhalter-
 * Zeile übrig ist (E9). Raten wäre hier ein Fehler mit Namen darauf.
 *
 * Der Name aus der Klassenliste ist ein EIGENES Feld (`kontoName`) und fliesst
 * nirgends zurück (E4) — nicht in `givenName`, in keinen Anfrage-Körper, in
 * kein Journal. DomiGo zeigt ihn an und speichert ihn nicht.
 */

/** Eine lokale Zeile, so wie `listRoster` sie liefert. */
export type LokaleZeile = {
  id: string;
  givenName: string | null;
  displayName: string;
  claimed: boolean;
};

/** Ein Kind der Klassenliste, so wie die Abruf-Funktion es projiziert. */
export type ListenKind = {
  platz: number | null;
  last_name: string;
  first_name: string;
  status: "offen" | "name_gewaehlt" | "angekommen";
  app_user_id: string | null;
};

/**
 * Vier Zeilen-Arten, englisch benannt wie im Vorbild der Matura-Plattform,
 * damit beide Apps dieselbe Sprache sprechen. Dass `not-joined` und
 * `joined-elsewhere` weder id noch Spitznamen noch Knöpfe tragen, entscheidet
 * der TYP — nicht ein `if` in der Anzeige, das man vergessen kann.
 */
export type Listenzeile =
  | {
      art: "joined";
      id: string;
      givenName: string | null;
      displayName: string;
      claimed: boolean;
      kontoName: string;
      platz: number | null;
    }
  | { art: "not-joined"; kontoName: string; platz: number | null; status: "offen" | "name_gewaehlt" }
  | { art: "joined-elsewhere"; kontoName: string; platz: number | null }
  | {
      art: "local-only";
      id: string;
      givenName: string | null;
      displayName: string;
      claimed: boolean;
      kontoName: null;
    };

export type Abgleich = {
  rows: Listenzeile[];
  /** Nur die Art `joined`. */
  joinedCount: number;
  /** Wie viele Kinder die Klassenliste nennt. */
  listCount: number;
};

/** »NACHNAME Vorname«. Leere Teile fallen weg, damit nie ein Leerzeichen allein steht. */
export function listenName(kind: { last_name: string; first_name: string }): string {
  const nach = kind.last_name.trim().toLocaleUpperCase("de");
  const vor = kind.first_name.trim();
  return [nach, vor].filter((t) => t.length > 0).join(" ");
}

/**
 * Die Liste in IHRER Reihenfolge (konto sortiert), danach die Zeilen, die nur
 * DomiGo kennt, in ihrer heutigen Reihenfolge.
 */
export function mergeKlassenliste(lokal: LokaleZeile[], kinder: ListenKind[]): Abgleich {
  const nachId = new Map<string, LokaleZeile>();
  for (const z of lokal) nachId.set(z.id, z);

  const rows: Listenzeile[] = [];
  const verbraucht = new Set<string>();
  let joinedCount = 0;

  for (const k of kinder) {
    const name = listenName(k);
    if (k.status === "offen" || k.status === "name_gewaehlt") {
      rows.push({ art: "not-joined", kontoName: name, platz: k.platz, status: k.status });
      continue;
    }
    // angekommen: nur eine lokale Zeile DIESER Klasse macht daraus ein `joined`.
    const treffer = k.app_user_id != null ? nachId.get(k.app_user_id) : undefined;
    if (!treffer) {
      rows.push({ art: "joined-elsewhere", kontoName: name, platz: k.platz });
      continue;
    }
    verbraucht.add(treffer.id);
    joinedCount += 1;
    rows.push({
      art: "joined",
      id: treffer.id,
      givenName: treffer.givenName,
      displayName: treffer.displayName,
      claimed: treffer.claimed,
      kontoName: name,
      platz: k.platz,
    });
  }

  for (const z of lokal) {
    if (verbraucht.has(z.id)) continue;
    rows.push({
      art: "local-only",
      id: z.id,
      givenName: z.givenName,
      displayName: z.displayName,
      claimed: z.claimed,
      kontoName: null,
    });
  }

  return { rows, joinedCount, listCount: kinder.length };
}
