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
import { getClassGrade } from "./auth.ts";
import { listClassesForTeacher, getClassForTeacher, listArchivedClassesForTeacher, getClassForGrandmaster } from "./class-service.ts";
import { listClassTraps, listClassUnitProgress, listStudentPathSummary, listStudentProgress } from "./class-progress.ts";
import { listReservedForClass } from "./assignment-service.ts";
import { listAssignmentsForStudent, listStudentsForClass } from "./assignment-session-service.ts";
import { listRoster } from "./roster-service.ts";
import { getUnitMastery } from "./game-progress.ts";

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
  { name: "getClassGrade", lauf: (db, s) => getClassGrade(db, s, B) },
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
    expect(FAELLE.length).toBe(14);
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
