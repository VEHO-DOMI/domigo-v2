/**
 * cgo-047 · DIE KLASSENWAND DER AUFGABEN-AUSWAHL.
 *
 * Befund 02.10. (GG sah »Klassenübersicht und Aufgabenauswahl widersprechen sich«):
 * `listClasses` (packages/db/src/assignment-service.ts) hängt hinter die eigenen
 * Klassen der Lehrkraft die GANZE v1-Klassenliste der Plattform, ohne Ausschnitt.
 * Jede Lehrkraft las damit die Namen fremder Klassen — ein Datenschutz-Fund —, und
 * wählte sie eine davon, scheiterte `createAssignment` an der Klassenwand mit 500.
 *
 * Die Wurzel liegt in einer DB-Datei unter dem cgo-029-Zaun; dort repariert sie der
 * Zaun-Inhaber (GG-Entscheid 02.10., Nachtrag 4). Bis dahin filtert die App jede
 * Auswahl auf den Ausschnitt der Sitzung — dieselbe Wand, gegen die
 * `createAssignment` ohnehin schreibt. Für den Plattformbetreiber ist der Filter
 * wirkungslos: sein Ausschnitt ist jede Klasse (lib/identity.ts#scopeAus).
 *
 * Ein Weg für Seite UND Endpunkt, damit Auswahl und Tür nie auseinanderlaufen.
 */
import { getDb, inScope, listClasses, listClassesInScope, type ClassScope } from "@domigo/db";
import { isGrandmaster } from "./grandmaster.ts";

/** Nur Klassen im Ausschnitt der Sitzung — rein, ohne Datenbank. */
export function pickableClasses<T extends { id: string }>(rows: readonly T[], scope: ClassScope): T[] {
  return rows.filter((row) => inScope(scope, row.id));
}

/**
 * Die Klassen, die DIESE Lehrkraft in der Aufgaben-Auswahl sieht und beschreiben
 * darf. Wirft, wenn die Liste nicht lesbar ist — der Aufrufer entscheidet, ob das
 * eine leere Auswahl (Seite) oder ein 503 (Endpunkt) ist.
 */
export async function assignableClasses(teacher: { userId: string; classScope: ClassScope }) {
  const rows = await (isGrandmaster(teacher.userId)
    ? listClassesInScope(getDb(), teacher.classScope)
    : listClasses(getDb(), teacher.classScope, teacher.userId));
  return pickableClasses(rows, teacher.classScope);
}
