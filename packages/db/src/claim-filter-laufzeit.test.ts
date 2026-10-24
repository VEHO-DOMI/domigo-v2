/**
 * dach-018 · test:claim-filter, die LAUFZEIT-Haelfte (Nachtrag N-10 b).
 *
 * Die Quelltext-Haelfte (scripts/check-claim-filter.mjs) prueft, dass jede
 * Funktion den Ausschnitt nimmt und ihn zuerst nennt. Hier wird gemessen, was
 * daraus WIRKLICH an die Datenbank geht.
 *
 * WARUM NICHT PGlite, und warum nicht der Haus-Mock:
 * · Der Haus-Mock (`seqDb`) liefert Ergebnisse NACH AUFRUF-REIHENFOLGE und
 *   sieht seine Argumente nie an. Ein zusaetzlicher Parameter aendert an ihm
 *   also gar nichts — die 27 bestehenden Testdateien blieben gruen, waehrend
 *   die Wand fehlte. Das ist die gefaehrlichste Eigenschaft dieses Umbaus.
 * · Eine echte Postgres im Prozess wuerde die Wand nur MITTELBAR zeigen, durch
 *   Zeilen — und Zeilen sind aus einem Dutzend langweiliger Gruende leer (eine
 *   fehlende Fixture, eine vertippte uuid, eine nicht angewandte Migration).
 *   Genau so verrottet eine Laufzeit-Probe zu einem gruenen Test, der nichts
 *   beweist; dieses Repo hat das zweimal bezahlt und beide Male aufgeschrieben
 *   (class-service.test.ts »a green test that cannot see what it denies has no
 *   evidential value«, writing-review.ts »the test for this path was green on
 *   an impossible case«).
 * · Der aufzeichnende Klient dagegen zeigt den SQL-TEXT und die gebundenen
 *   Werte. »Der Ausschnitt ist die erste Bedingung« und »ein leerer Ausschnitt
 *   liefert nichts« sind Eigenschaften genau dieses Textes.
 * Und er ist derselbe Treiber, den die Produktion faehrt (neon-http), nicht ein
 * zweiter Dialekt, den niemand ausliefert.
 */
import { describe, expect, it } from "vitest";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema.ts";
import { classScope, EMPTY_SCOPE, type ClassScope } from "./scope.ts";
import type { Db } from "./index.ts";
import { listClassesForTeacher, getClassForTeacher, listArchivedClassesForTeacher, getClassForGrandmaster } from "./class-service.ts";
import { listClassTraps, listClassUnitProgress, listStudentPathSummary, listStudentProgress } from "./class-progress.ts";
import { listReservedForClass } from "./assignment-service.ts";
import { listAssignmentsForStudent, listStudentsForClass } from "./assignment-session-service.ts";
import { listRoster } from "./roster-service.ts";
import { getSolvedGameItemIds, getUnitMastery } from "./game-progress.ts";
import { getSessionAttempts } from "./assignment-session-service.ts";
import { resolveTeacherNames } from "./class-service.ts";
import { getGameSave } from "./gamesave.ts";
import { getJourneyAttempts } from "./journey-progress.ts";
import { getPathSummary, getUnitPathProgress } from "./studypath.ts";
import { createKontoTeacher, findKontoIdentity } from "./konto-identity.ts";
import { deleteUserData } from "./konto-loeschung.ts";
import { readFileSync } from "node:fs";

/** Ein Klient, der jede Anweisung mitschreibt und Zeilen nach Drehbuch liefert. */
function schreiber(zeilen: unknown[][] = []) {
  const log: { sql: string; params: unknown[] }[] = [];
  let n = 0;
  const client = (sql: string, params: unknown[]) => {
    log.push({ sql, params });
    return Promise.resolve({ rows: zeilen[n++] ?? [], rowCount: 0, fields: [] });
  };
  return { log, db: drizzle(client as never, { schema }) as unknown as Db };
}

const A = "aaaaaaaa-0000-4000-8000-000000000001";
const B = "bbbbbbbb-0000-4000-8000-000000000002";
const NUR_A: ClassScope = classScope([A]);

/**
 * Die Funktionen, die eine Klassenabfrage mit dem Ausschnitt fuehren, je mit
 * dem kleinsten Aufruf, der sie ausloest. AUSGESCHRIEBEN und nicht aus dem
 * Pruefling abgeleitet: eine Erwartung, die sich aus dem Geprueften speist,
 * prueft nichts (Hausgesetz K7a).
 */
const FAELLE: { name: string; lauf: (db: Db, scope: ClassScope) => Promise<unknown> }[] = [
  { name: "listStudentProgress", lauf: (db, s) => listStudentProgress(db, s, B) },
  { name: "listStudentPathSummary", lauf: (db, s) => listStudentPathSummary(db, s, B) },
  { name: "listClassUnitProgress", lauf: (db, s) => listClassUnitProgress(db, s, B) },
  { name: "listClassTraps", lauf: (db, s) => listClassTraps(db, s, B) },
  { name: "listReservedForClass", lauf: (db, s) => listReservedForClass(db, s, B) },
  { name: "listAssignmentsForStudent", lauf: (db, s) => listAssignmentsForStudent(db, s, B, new Date(0)) },
  { name: "listStudentsForClass", lauf: (db, s) => listStudentsForClass(db, s, B) },
  { name: "listRoster", lauf: (db, s) => listRoster(db, s, B, "lehrkraft") },
  { name: "listClassesForTeacher", lauf: (db, s) => listClassesForTeacher(db, s, "lehrkraft") },
  { name: "listArchivedClassesForTeacher", lauf: (db, s) => listArchivedClassesForTeacher(db, s, "lehrkraft") },
  { name: "getClassForTeacher", lauf: (db, s) => getClassForTeacher(db, s, B, "lehrkraft") },
  { name: "getClassForGrandmaster", lauf: (db, s) => getClassForGrandmaster(db, s, B) },
  { name: "getUnitMastery", lauf: (db, s) => getUnitMastery(db, s, 2) },
];

describe("die Wand steht im SQL, nicht nur in der Signatur", () => {
  for (const fall of FAELLE) {
    it(`${fall.name}: der Ausschnitt ist die ERSTE Bedingung, und der gebundene Wert ist er selbst`, async () => {
      const { log, db } = schreiber();
      await fall.lauf(db, NUR_A);
      const mitWhere = log.filter((e) => / where /.test(e.sql));
      expect(mitWhere.length, "die Funktion hat gar keine Bedingung gestellt").toBeGreaterThan(0);
      const erste = mitWhere[0]!;
      // Die erste Bedingung nennt eine Klassen-Spalte …
      expect(erste.sql).toMatch(/where \("[^"]+"\."[^"]+"\."(class_id|id)" in \(\$1\)/);
      // … und der Wert, an den sie gebunden ist, ist der Ausschnitt, nicht das Ziel.
      expect(erste.params[0]).toBe(A);
      // Und der Ziel-Wert steht NACH ihm, nie davor.
      expect(erste.params.indexOf(A)).toBeLessThan(erste.params.length);
    });

    it(`${fall.name}: ein leerer Ausschnitt ergibt »false«, nie »alles«`, async () => {
      const { log, db } = schreiber();
      await fall.lauf(db, EMPTY_SCOPE);
      const mitWhere = log.filter((e) => / where /.test(e.sql));
      expect(mitWhere.length).toBeGreaterThan(0);
      for (const e of mitWhere) {
        // Jede gestellte Bedingung beginnt mit dem unerfuellbaren `false`.
        expect(e.sql).toMatch(/where \(false\b/);
        expect(e.sql).not.toMatch(/where \(true\b/);
      }
    });
  }

  it("die Liste deckt jede Datei ab, die eine Klassenabfrage fuehrt", () => {
    // Waechst die Wand um eine Datei, ohne dass diese Liste waechst, faellt es
    // hier auf — und nicht erst dem blinden Leser.
    // 13, nicht 14: getClassGrade steht mit Grund in der Ausnahme-Liste — es
    // liefert EINE Zahl zu der Klasse, die die Sitzung ohnehin aufgeloest hat.
    expect(FAELLE.length).toBe(13);
  });
});

describe("eine Lehrkraft mit Ausschnitt {A} sieht Klasse B nicht", () => {
  it("die Abfrage bindet A, obwohl der Aufruf B nennt — die Datenbank kann B gar nicht liefern", async () => {
    const { log, db } = schreiber();
    await listRoster(db, NUR_A, B, "lehrkraft");
    const erste = log[0]!;
    expect(erste.params[0]).toBe(A);
    expect(erste.sql.indexOf("in ($1)")).toBeLessThan(erste.sql.indexOf("= $2"));
  });

  it("ein Kind hat genau eine Klasse, und das ist seine", () => {
    expect([...classScope(["nur-diese"])]).toHaveLength(1);
  });
});

/**
 * dach-100 · DIE AUSNAHMEN OHNE AUSSCHNITT, gemessen statt behauptet.
 *
 * Zehn Funktionen lesen eine Klassen-Tabelle ohne Ausschnitt und stehen mit Satz in
 * scripts/claim-filter-allowlist.json: »liest nur die eigene Zeile«. Das ist eine
 * Behauptung in zwei Haelften, und jede hat ihre eigene Probe:
 *   · WOHER die Kennung kommt (Sitzung, signierter Push, gefilterte Lesung) haelt
 *     check-claim-filter.mjs · aufrufer fest — jeder Aufruf mit seinem Ausdruck.
 *   · DASS die Abfrage nur an dieser Kennung haengt, steht HIER im SQL: jede
 *     Bedingung bindet die uebergebene Kennung und keine andere, und keine Klasse.
 * Zusammen heisst das: eine fremde Lehrkraft, ein fremdes Kind kann in diese
 * Abfragen nicht hineingeraten — die Datenbank wird nach nichts anderem gefragt.
 */
const ICH = "cccccccc-0000-4000-8000-000000000003";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// dach-167 (Pruefer PR 480, S1): je Fall die SPALTE, an die die eigene Kennung gebunden
// sein muss — `"unit_slug" = $1` enthaelt auch `= $1`, und eine falsche Spalte waere so
// unsichtbar geblieben.
const NUTZER = ["user_id"];
// dach-167 (blinder Leser PR 481): `or(eq(user_id, ICH), eq(game_mode, m))` bindet die
// Kennung auch — und liest alle Spielstaende dieses Modus. Ein `or` ist darum nur erlaubt,
// wo JEDES seiner Glieder die eigene Kennung bindet (die Loeschung im Journal: als
// Lehrkraft ODER als Handelnde).
// dach-167 (GG-Pruefung PR 481, S3): gezaehlt wurden nur Glieder der Form `= $n` —
// `or(eq(user_id, ICH), isNotNull(…))` und `… or true` blieben gruen. Jetzt ist `or`
// verboten, ausser der Fall erlaubt es (`oder: true`), und dort muss JEDES Teilstueck
// die eigene Kennung an eine Spalte binden.
const EIGENE: { schluessel: string; spalten: string[]; oder?: true; lauf: (db: Db) => Promise<unknown> }[] = [
  { schluessel: "assignment-session-service.ts#getSessionAttempts", spalten: NUTZER, lauf: (db) => getSessionAttempts(db, ICH, "aufgabe-1", "sitzung-1") },
  { schluessel: "game-progress.ts#getSolvedGameItemIds", spalten: NUTZER, lauf: (db) => getSolvedGameItemIds(db, ICH, 2) },
  { schluessel: "gamesave.ts#getGameSave", spalten: NUTZER, lauf: (db) => getGameSave(db, ICH, "game:g1") },
  { schluessel: "journey-progress.ts#getJourneyAttempts", spalten: NUTZER, lauf: (db) => getJourneyAttempts(db, ICH, "g2-u03") },
  { schluessel: "studypath.ts#getPathSummary", spalten: NUTZER, lauf: (db) => getPathSummary(db, ICH) },
  { schluessel: "studypath.ts#getUnitPathProgress", spalten: NUTZER, lauf: (db) => getUnitPathProgress(db, ICH, "g2-u03") },
  { schluessel: "konto-identity.ts#findKontoIdentity", spalten: ["id"], lauf: (db) => findKontoIdentity(db, ICH) },
  // Die Loeschung nennt die Person in vier Rollen: als Lernende, im Jahresabschluss,
  // als Lehrkraft/Handelnde im Journal, und zuletzt die Zeile der Person selbst.
  { schluessel: "konto-loeschung.ts#deleteUserData", spalten: ["user_id", "v1_user_id", "teacher_id", "actor_id", "id", "p1", "p2"], oder: true, lauf: (db) => deleteUserData(db, ICH) },
];

describe("dach-100 · die Ausnahmen ohne Ausschnitt fragen nur nach der eigenen Kennung", () => {
  for (const fall of EIGENE) {
    it(`${fall.schluessel}: jede Bedingung bindet die eigene Kennung, keine fremde und keine Klasse`, async () => {
      const { log, db } = schreiber();
      await fall.lauf(db);
      expect(log.length, "die Funktion hat gar nichts gefragt").toBeGreaterThan(0);
      // dach-167 (S1): JEDE Anweisung — nicht nur die mit Bedingung. Eine zweite
      // Anweisung ohne WHERE (ein DELETE auf eine ganze Tabelle) war sonst unsichtbar.
      for (const e of log) {
        expect(e.sql, "Anweisung ohne Bedingung").toMatch(/ where /);
        const bedingung = e.sql.slice(e.sql.indexOf(" where "));
        // Die eigene Kennung ist gebunden, und zwar als Bedingung auf der erwarteten Spalte …
        const stelle = e.params.indexOf(ICH);
        expect(stelle, `${e.sql} bindet die eigene Kennung nicht`).toBeGreaterThanOrEqual(0);
        const gebunden = [...bedingung.matchAll(/"([a-z_0-9]+)" = \$(\d+)/g)].filter((m) => e.params[Number(m[2]) - 1] === ICH).map((m) => m[1]);
        expect(gebunden.length, `${e.sql}: die eigene Kennung steht in keiner Spalten-Bedingung`).toBeGreaterThan(0);
        for (const spalte of gebunden) expect(fall.spalten, `${e.sql}: die Kennung haengt an "${spalte}"`).toContain(spalte);
        if (/ or /i.test(bedingung)) {
          expect(fall.oder, `${e.sql}: ein or in einer Abfrage, die keins braucht`).toBe(true);
          for (const teil of bedingung.split(/ or /i)) {
            const bindet = [...teil.matchAll(/"[a-z_0-9]+" = \$(\d+)/g)].some((m) => e.params[Number(m[1]) - 1] === ICH);
            expect(bindet, `${e.sql}: ein Glied des or bindet die eigene Kennung nicht: ${teil}`).toBe(true);
          }
        }
        // … keine andere Person-Kennung kommt hinein …
        for (const p of e.params) if (typeof p === "string" && UUID.test(p)) expect(p).toBe(ICH);
        // … und keine Klasse entscheidet mit.
        expect(bedingung).not.toMatch(/class_id/);
      }
    });
  }

  it("class-service.ts#resolveTeacherNames: nur Lehrkraefte, nur die genannten — eine Kinder-Kennung loest zu nichts auf", async () => {
    const { log, db } = schreiber([[], []]);
    const namen = await resolveTeacherNames(db, [ICH]);
    expect(namen.size).toBe(0);
    expect(log.length).toBe(2);
    for (const e of log) {
      // Nur zwei Spalten — der Name und die Kennung, nach der gefragt wurde.
      expect(e.sql).toMatch(/^select "id", "display_name" from /);
      expect(e.sql).toMatch(/"role" = \$2/);
      expect(e.params).toEqual([ICH, "teacher"]);
    }
  });

  it("konto-identity.ts#createKontoTeacher: legt eine Lehrkraft OHNE Klasse an und liest nur die neue Kennung zurueck", async () => {
    const { log, db } = schreiber([[{ id: ICH }]]);
    await createKontoTeacher(db, { displayName: "KUE", pinHash: "x" });
    expect(log.length).toBe(1);
    const e = log[0]!;
    expect(e.sql).toMatch(/^insert into /);
    expect(e.sql).not.toMatch(/ where /);
    expect(e.sql).toMatch(/returning "id"$/);
    expect(e.params).toContain("teacher");
    for (const p of e.params) if (typeof p === "string") expect(UUID.test(p)).toBe(false);
  });

  it("die Liste deckt jede von dach-100 beurteilte, lebende Ausnahme ab", () => {
    const lies = (datei: string) => JSON.parse(readFileSync(new URL(`../../../scripts/${datei}`, import.meta.url), "utf8"));
    const fest = lies("claim-filter-aufrufer.json") as { funktionen: Record<string, string[]> };
    const saetze = (lies("claim-filter-allowlist.json") as { ausnahmen: Record<string, string> }).ausnahmen;
    const lebend = Object.entries(fest.funktionen)
      .filter(([s, a]) => a.length > 0 && saetze[s]?.startsWith("dach-100 ·"))
      .map(([s]) => s)
      .sort();
    // Drei sind nicht exportiert und hier nicht rufbar; fuer sie haelt allein die
    // Pruefung »aufrufer« fest, woher die Kennung kommt (signierter Push · Sitzung ·
    // ein SQL-Baustein, der eine schon gefilterte Abfrage nur weiter einengt).
    const intern = ["konto-class-term.ts#lokaleLehrkraft", "review.ts#reservierteFuerKlasse", "writing-review.ts#gehoertZuLehrkraft"];
    const hier = [...EIGENE.map((f) => f.schluessel), "class-service.ts#resolveTeacherNames", "konto-identity.ts#createKontoTeacher", ...intern].sort();
    expect(hier).toEqual(lebend);
  });
});
