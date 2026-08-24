/**
 * K9b · Die CLIENT-Hälfte des Roster-Parsers — der Zwilling von
 * `packages/db/src/roster-service.ts`.
 *
 * Warum überhaupt zweimal: `@domigo/db` ist server-only (sein Index öffnet einen
 * Neon-Client) und darf nie ins Browser-Bündel — aber die Prüfliste, die die
 * Lehrkraft bestätigt, und die Zahl auf dem Knopf müssen EXAKT das sein, was der
 * Server anlegt. Also lebt die Regel zweimal, byte-gleich, und zwei Dinge halten
 * sie zusammen: `pnpm check:roster-twins` (vergleicht den Block maschinell, läuft
 * in CI) und eine gemeinsame Fixture-Liste in beiden Testdateien.
 *
 * Kein React, kein "use client" — ein schlichtes Modul, damit `node --test` es fährt.
 */

/**
 * Obergrenze für eine hochgeladene Datei. Eine Klassenliste ist ein paar Kilobyte;
 * zwei Megabyte sind bereits absurd weit jenseits davon. Der Deckel greift VOR dem
 * Lesen (`file.size`), damit ein versehentlich gewähltes Video nicht erst
 * vollständig in den Speicher wandert. Rein clientseitig — der Server bekommt nie
 * eine Datei zu sehen, nur die geprüfte Namensliste.
 */
export const MAX_ROSTER_FILE_BYTES = 2 * 1024 * 1024;

// ─── TWIN BLOCK START · geprüft von scripts/check-roster-twins.mjs ───────────
// Alles zwischen den beiden Markern ist BYTE-GLEICH in:
//   • packages/db/src/roster-service.ts   (Server, autoritativ)
//   • apps/web/lib/roster-parse.ts        (Client, Prüfliste + Zähler)
// Der Zwilling existiert, weil @domigo/db server-only ist und nicht ins
// Browser-Bündel darf — die Zahl auf dem Knopf muss aber exakt die sein, die der
// Server anlegt. `pnpm check:roster-twins` hält beide Hälften zusammen.

/** Längster erlaubter Schülername (ein Listen-Eintrag, keine Prosa). */
export const MAX_STUDENT_NAME_LENGTH = 80;

/** Obergrenze für einen Import-Vorgang — eine Klassenliste, kein Datensatz-Dump. */
export const MAX_ROSTER_NAMES = 500;

/**
 * Zerlegt einen Text in Zeilen. Deckt ALLE drei Zeilenenden ab: \r\n (Windows),
 * \n (Unix) und \r ALLEIN — letzteres liefern alte Mac-Exporte und einzelne
 * Tabellenprogramme, und ein reiner \r\n?-Ausdruck macht daraus EINE Zeile, also
 * einen einzigen Riesen-"Namen".
 */
function splitLines(text: string): string[] {
  return text.split(/\r\n|\r|\n/);
}

/**
 * ERSTE ZELLE GEWINNT. Ein echter Export trägt mehr als den Namen — `Anna;5B`,
 * `Anna\tanna@example.at`, `"Mueller, Anna";5B`. Jede Zeile wird auf ihre erste
 * Zelle reduziert, damit der Rest der Kette sieht, was er immer sah: einen Namen.
 *
 * Bewusst eng, denn das eine, was die Regel nicht brechen darf, ist ein Name MIT
 * Komma:
 *   • ein führendes Anführungszeichen ÖFFNET eine geschützte Zelle — alles bis
 *     zum schließenden Zeichen ist der Name, internes Komma inklusive, der Rest
 *     der Zeile fällt weg;
 *   • sonst beendet ein `;` oder ein TABULATOR die erste Zelle (nie ein blankes
 *     Komma);
 *   • eine Zeile ohne beides bleibt GANZ — `Mueller, Anna` ist ein Name, nicht
 *     zwei Zellen. Das ist die deklarierte Grenze: ein nacktes Komma lässt sich
 *     nicht von der Nachname-zuerst-Schreibweise unterscheiden, also gewinnt die
 *     nachsichtige Lesart.
 *
 * ⚠ Das `.trim()` auf dem Schnitt ist NICHT Kosmetik (K9b-Review, Blocker): ohne
 * es überlebt `Anna ;5B` als `"Anna "`, und die beiden Hälften normalisieren
 * danach VERSCHIEDEN — der Client trimmt beim Senden, der Server lässt
 * zusätzlich `cleanCell` darüberlaufen. Gemessen: die Prüfliste zeigte
 * »Add 2 students« OHNE Duplikat-Abzeichen, angelegt wurde 1. Genau die Zahl,
 * für die der Prüfschritt gebaut ist.
 */
function firstCell(raw: string): string {
  const s = raw.trim();
  if (s.startsWith('"')) {
    const close = s.indexOf('"', 1);
    if (close > 0) return s.slice(0, close + 1); // Paar bleibt; cleanCell streift es
  }
  const sep = s.search(/[;\t]/);
  return sep === -1 ? s : s.slice(0, sep).trim();
}

/**
 * Eine Zeile zu einem sauberen Namen normalisieren: erste Zelle, dann ein
 * einspaltiges CSV-Schlusskomma weg, dann ein umschließendes
 * Anführungszeichen-Paar weg (eine Tabellen-Einfügung liefert oft `"Anna",`).
 * Leere Zeile ⇒ "" , der Aufrufer wirft sie weg.
 *
 * INVARIANTE: die Ausgabe trägt nie äußeren Leerraum — jeder Zweig hier trimmt,
 * und `firstCell` tut es ebenfalls. Ein Test hält das über alle Fixtures fest,
 * damit ein künftiger Zweig die Invariante nicht unbemerkt aufreißt.
 */
function cleanCell(raw: string): string {
  let s = firstCell(raw);
  if (s.endsWith(",")) s = s.slice(0, -1).trim();
  if (s.length >= 2 && s.startsWith('"') && s.endsWith('"')) s = s.slice(1, -1).trim();
  return s;
}

/**
 * Eine Liste von Zellen säubern: Leere fallen weg, Duplikate fallen weg
 * (schreibungs-unabhängig), und die ZUERST gesehene Schreibung bleibt stehen
 * ("Anna" dann "anna" ⇒ nur "Anna").
 */
function dedupeClean(cells: readonly string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const cell of cells) {
    const name = cleanCell(cell);
    if (name === "") continue;
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(name);
  }
  return out;
}

/** Ein Name, den der Server annehmen wird: nicht leer und nicht zu lang. */
export function isImportableName(name: string): boolean {
  const trimmed = name.trim();
  return trimmed !== "" && trimmed.length <= MAX_STUDENT_NAME_LENGTH;
}
// ─── TWIN BLOCK END ─────────────────────────────────────────────────────────

/**
 * Vorschau auf das, was der Server anlegen wird — der Zwilling von `parseRoster`.
 * Ein Kind je ZEILE, erste Zelle, entdoppelt.
 */
export function previewRoster(text: string): string[] {
  return dedupeClean(splitLines(text));
}
