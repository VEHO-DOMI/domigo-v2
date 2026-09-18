/**
 * P-R8 · DIE EINE TUER ZUM KLASSEN-JOURNAL (`domigo_v2.roster_events`).
 *
 * WARUM ES DIESE DATEI GIBT. Das Journal trug volle Klarnamen echter Kinder: der
 * `import`-Eintrag schrieb die ganze Namensliste in seine Nutzlast, `claim` den
 * Spitznamen, `rename` den Vornamen, `teacher_claim` den Namen der Lehrkraft.
 * Hausregel: Schuelernamen erscheinen nie in Dateien — und ein Journal IST eine
 * Datei. Ruling P-R8 (RAHMEN_P1 §J) entscheidet die Klasse, nicht den Einzelfall:
 * Nutzlasten tragen nur noch Ids, Zahlen und Laengen, und die Regel wohnt AN DER
 * TUER statt in elf Aufrufstellen, die sie sich merken muessen.
 *
 * FRUGAL BY CONSTRUCTION. Vorbild ist writing-review.ts (K6a): Ids, Zahlen und
 * Laengen sagen alles, was eine Geschichte braucht — »eine Umbenennung auf einen
 * 14 Zeichen langen Namen« ist als Historie vollstaendig, ohne den Namen selbst.
 * Der lebende Zustand steht ohnehin in `users`; das Journal muss ihn nicht
 * verdoppeln.
 *
 * EIN VOKABULAR, KEINE VERBOTSLISTE. Der Wachter kennt die 17 erlaubten
 * Schluessel samt erwarteter Wertform. Das ist der Unterschied, der zaehlt: eine
 * Heuristik auf »sieht wie ein Name aus« faellt bei `Anna` um, waehrend
 * `{ studentId: "Anna Mueller" }` hier scheitert, weil `studentId` id-foermig
 * sein MUSS. Und ein Schluessel, den niemand deklariert hat (`names`), kommt gar
 * nicht erst durch — ein kuenftiges Feld muss hier eingetragen werden, und genau
 * das ist gewollt.
 *
 * REDIGIEREN UND SCHREIEN, NICHT WERFEN (K2a-Muster, teacher-events.ts). Eine
 * Umbenennung darf nicht daran sterben, dass jemand eine schludrige Nutzlast
 * geschrieben hat — aber der Wert darf die Tabelle nie erreichen. Der laute Log
 * ist es, was aus einem stillen Leck einen Fehlerbericht macht.
 *
 * NICHT in index.ts re-exportiert: das Modul wird von den fuenf Dienst-Modulen
 * relativ importiert. (K2a-Gesetz: jeder neue index-Re-Export braucht eine
 * App-Start-Probe, weil index.ts ueber auth.ts in der Edge-Middleware landet.
 * Hier ist kein `node:crypto` im Spiel — die Regel bleibt trotzdem unangetastet.)
 */
import type { Db } from "./index.ts";
import { v2RosterEvents } from "./schema.ts";

/** Die Arten, die dieses Journal kennt. App-validiert wie jedes `kind` in v2. */
export type RosterEventKind =
  | "import" // eine Klassenliste wurde eingelesen
  | "claim" // ein Kind hat seine Zeile beansprucht (Spitzname + PIN)
  | "rename" // eine Lehrkraft hat einen Vornamen korrigiert
  | "remove" // eine Zeile wurde vom Verzeichnis genommen
  | "reset_pin" // eine PIN wurde auf provisorisch zurueckgesetzt
  | "teacher_claim" // eine Lehrkraft hat eine vorangelegte Klasse uebernommen
  | "progress_adjust" // Grossmeister-Hand: XP-Gutschrift oder Lernweg-Einheit
  | "writing_graded" // eine Schreib-Abgabe wurde benotet
  | "archive" // eine Klasse wurde stillgelegt
  | "unarchive"; // … und wieder geweckt

export interface RosterEventInput {
  /** Zu WELCHER Klasse gehoert der Vorgang. NOT NULL in der Tabelle. */
  classId: string;
  kind: RosterEventKind;
  /** Wessen HAND. `null` bei einer Selbstbedienung des Kindes (/join). */
  actorId: string | null;
  /** Nur Ids, Zahlen und Laengen. Siehe scrubRosterPayload. */
  payload: Record<string, unknown>;
}

// ── Wertformen ───────────────────────────────────────────────────────────────

/**
 * EIN GROSSGESCHRIEBENES EINZELWORT IST KEIN BEZEICHNER, SONDERN EIN NAME.
 * `Anna`, `Piet`, `Mueller` — die einzige Namensform, die die Zeichensatz-Regel
 * unten allein durchliesse (kein Leerzeichen, kein Sonderzeichen). Echte
 * Bezeichner dieses Repos sehen anders aus: `vocab-practice-2`, `g2-u03`,
 * `checkpoint`, eine uuid, `klasse-2b` — alle klein, alle mit Ziffer oder
 * Trennzeichen.
 */
function istEinzelnesGrossWort(value: string): boolean {
  return /^[A-ZÄÖÜ][a-zäöüß]+$/.test(value);
}

/**
 * Id-foermig: ASCII-Bezeichner-Zeichensatz, hoechstens 64 Zeichen, und kein
 * grossgeschriebenes Einzelwort. Deckt uuids, Einheiten-Kuerzel (`g2-u03`),
 * Knoten-Ids (`vocab-practice-2`) und die lesbaren Test-Bezeichner der Batterie
 * (`kind-1`, `klasse-2b`) ab — und schliesst jeden Namen aus, der ein
 * Leerzeichen, einen Umlaut oder einen Grossbuchstaben-Anfang traegt.
 */
function istIdFoermig(value: unknown): boolean {
  return typeof value === "string" && value.length <= 64 && /^[A-Za-z0-9._:-]+$/.test(value) && !istEinzelnesGrossWort(value);
}

/** Eine echte, endliche Zahl — Laengen, Punkte, Zaehlungen. */
function istZahl(value: unknown): boolean {
  return typeof value === "number" && Number.isFinite(value);
}

/** Id-foermig ODER ausdruecklich `null` (»in eigener Vollmacht«, writing-review). */
function istIdOderNull(value: unknown): boolean {
  return value === null || istIdFoermig(value);
}

/** Eine Liste von Knoten-Ids — jedes Element einzeln geprueft, nie stichprobenartig. */
function istIdListe(value: unknown): boolean {
  return Array.isArray(value) && value.every(istIdFoermig);
}

/** Eine der drei Marken, die den Zweig einer Nutzlast benennen. */
function istMarke(value: unknown): boolean {
  return value === "xp" || value === "unit" || value === "grade";
}

/**
 * DAS VOKABULAR. Jeder Schluessel, den irgendeine der elf Schreibstellen
 * schreibt, mit der Form, die sein Wert haben muss. Ein Schluessel, der hier
 * fehlt, kommt nicht durch — auch nicht mit einem harmlosen Wert. Das ist der
 * Punkt: ein neues Feld wird hier deklariert, oder es wird redigiert und
 * gemeldet.
 */
const VOKABULAR: Record<string, (value: unknown) => boolean> = {
  // Ids
  studentId: istIdFoermig,
  classId: istIdFoermig,
  fromTeacherId: istIdFoermig,
  toTeacherId: istIdFoermig,
  submissionId: istIdFoermig,
  onBehalfOf: istIdOderNull, // uuid ODER null — die Vollmacht, unter der gehandelt wurde
  unitSlug: istIdFoermig, // g2-u03
  nodeIds: istIdListe, // ["vocab-intro", "vocab-practice-2", …]
  op: istMarke, // "xp" | "unit" | "grade"
  // Zahlen und Laengen
  count: istZahl, // wie viele Zeilen ein Import angelegt hat
  displayNameLength: istZahl, // wie lang der gewaehlte Spitzname war
  givenNameLength: istZahl, // wie lang der korrigierte Vorname war
  feedbackLength: istZahl, // wie lang die Rueckmeldung der Lehrkraft war
  score: istZahl,
  vocabXp: istZahl,
  grammarXp: istZahl,
  stars: istZahl,
};

/** Die Zahl der deklarierten Schluessel — die Batterie haelt sie fest. */
export const VOKABULAR_UMFANG = Object.keys(VOKABULAR).length;

/** Was anstelle eines abgelehnten Wertes in der Tabelle landet. */
export const REDIGIERT = "[redacted]";

/**
 * Eine Nutzlast gegen das Vokabular pruefen: unbekannter Schluessel ODER falsche
 * Wertform ⇒ der Wert wird durch `[redacted]` ersetzt und die Stelle schreit.
 * Der Schluessel selbst bleibt stehen — eine Zeile, die sagt »hier stand etwas,
 * das nicht hierher gehoerte«, ist ehrlicher als eine, die schweigt.
 */
export function scrubRosterPayload(payload: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(payload)) {
    const erlaubt = VOKABULAR[k];
    if (!erlaubt) {
      console.error(`[roster-events] Nutzlast-Feld "${k}" steht in keinem Vokabular und wurde redigiert — Aufrufstelle reparieren oder das Feld in roster-events.ts deklarieren`);
      out[k] = REDIGIERT;
      continue;
    }
    if (!erlaubt(v)) {
      console.error(`[roster-events] Nutzlast-Feld "${k}" hat nicht die erwartete Form (Id/Zahl/Laenge) und wurde redigiert — Aufrufstelle reparieren`);
      out[k] = REDIGIERT;
      continue;
    }
    out[k] = v;
  }
  return out;
}

/**
 * Eine Journal-Zeile anhaengen — die EINZIGE Stelle im Repo, die das darf
 * (`scripts/check-journal-door.mjs` haelt das fest).
 *
 * Bewusst OHNE die Degradations-Klausel von teacher-events.ts: `roster_events`
 * liegt seit Migration 0006 auf jeder Datenbank, es gibt also kein Fenster »Code
 * ist da, Tabelle nicht«. Ein Datenbankfehler hier ist ein echter Ausfall und
 * fliegt weiter — genau wie bisher, denn journal-then-flip verlaesst sich
 * darauf: wer nach einem stillen Fehlschlag weiterflippt, aendert unprotokolliert.
 */
export async function writeRosterEvent(db: Db, input: RosterEventInput): Promise<void> {
  await db.insert(v2RosterEvents).values({
    classId: input.classId,
    kind: input.kind,
    actorId: input.actorId,
    payload: scrubRosterPayload(input.payload),
  });
}
