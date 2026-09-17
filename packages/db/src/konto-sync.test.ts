/**
 * dach-018 · test:class-sync — was der Konto-Dienst hereinreicht.
 *
 * Gefahren wird der aufzeichnende Klient aus claim-filter-laufzeit.test.ts:
 * echter Treiber, echter SQL-Text, Zeilen nach Drehbuch. Was hier zaehlt, sind
 * drei Eigenschaften, die man einer Funktion nicht ansieht: dass ein zweites
 * Mal nichts tut, dass ein fehlender Jahrgang eine Absage ist und kein
 * Vorgabewert, und dass eine Loeschung wirklich alles mitnimmt.
 */
import { describe, expect, it } from "vitest";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema.ts";
import type { Db } from "./index.ts";
import { applyKontoClassTerm, createKontoClass } from "./konto-class-term.ts";
import { deleteUserData } from "./konto-loeschung.ts";

/**
 * Die Zeilen kommen bei neon-http als WERTE-LISTEN in der Reihenfolge des
 * SELECT, nicht als Objekte — deshalb stehen die Drehbuecher unten so da.
 */
function schreiber(zeilen: unknown[][] = []) {
  const log: { sql: string; params: unknown[] }[] = [];
  let n = 0;
  const client = (sql: string, params: unknown[]) => {
    log.push({ sql, params });
    return Promise.resolve({ rows: zeilen[n++] ?? [], rowCount: 0, fields: [] });
  };
  return { log, db: drizzle(client as never, { schema }) as unknown as Db };
}

const KLASSE = "cccccccc-0000-4000-8000-000000000001";
const LEHRKRAFT = "dddddddd-0000-4000-8000-000000000002";

const EINGANG = {
  app_class_id: KLASSE,
  join_code: "ABC123",
  name: "2B",
  jahrgang: 2,
  owner_app_user_id: LEHRKRAFT,
  archived_at: null,
  school_year: "2026/27",
  term_started_at: "2026-09-01T00:00:00+02:00",
};

/** select({id, name, grade, teacherId, archivedAt}) — in genau dieser Folge. */
const BESTAND = [KLASSE, "2B", 2, LEHRKRAFT, null];
const BESTAND_ARCHIVIERT = [KLASSE, "2B", 2, LEHRKRAFT, "2026-11-01T00:00:00Z"];
/** select({id}) der Lehrkraft. */
const LEHRKRAFT_ZEILE = [LEHRKRAFT];

describe("POST /api/konto/classes — anlegen", () => {
  it("ein zweiter Ruf mit demselben Klassencode legt NICHTS an und antwortet mit derselben Kennung", async () => {
    const { log, db } = schreiber([[[KLASSE]]]);
    const r = await createKontoClass(db, EINGANG);
    expect(r).toEqual({ ok: true, app_class_id: KLASSE, geaendert: false });
    expect(log.filter((e) => e.sql.startsWith("insert"))).toHaveLength(0);
  });

  it("ohne Jahrgang wird abgelehnt — grade ist smallint NOT NULL, ein erfundener Wert waere Inhalt fuer das falsche Alter", async () => {
    const { log, db } = schreiber();
    expect(await createKontoClass(db, { ...EINGANG, jahrgang: null })).toEqual({ ok: false, grund: "kein-jahrgang" });
    expect(log).toHaveLength(0); // abgelehnt, BEVOR die Datenbank etwas davon erfaehrt
  });

  it("ein Jahrgang ausserhalb 1..4 ist derselbe Fall", async () => {
    const { db } = schreiber();
    expect(await createKontoClass(db, { ...EINGANG, jahrgang: 7 })).toEqual({ ok: false, grund: "kein-jahrgang" });
  });

  it("eine Besitzerin, die DomiGo nicht kennt, ist eine Absage — keine erfundene Lehrkraft", async () => {
    const { db } = schreiber([[], []]); // kein Klassencode-Treffer, keine Lehrkraft
    expect(await createKontoClass(db, EINGANG)).toEqual({ ok: false, grund: "kein-besitzer" });
  });
});

describe("POST /api/konto/class-term — nachziehen", () => {
  it("derselbe Stand wirkt NICHT — kein Schreiben, und vor allem keine zweite Journal-Zeile", async () => {
    const { log, db } = schreiber([[BESTAND], [LEHRKRAFT_ZEILE]]);
    const r = await applyKontoClassTerm(db, EINGANG);
    expect(r).toEqual({ ok: true, app_class_id: KLASSE, geaendert: false });
    expect(log.filter((e) => e.sql.startsWith("insert") || e.sql.startsWith("update"))).toHaveLength(0);
  });

  it("eine Umbenennung journalisiert VOR dem Schreiben, und die Nutzlast traegt die LAENGE, nie den Namen", async () => {
    const { log, db } = schreiber([[BESTAND], [LEHRKRAFT_ZEILE]]);
    await applyKontoClassTerm(db, { ...EINGANG, name: "2B Englisch" });
    const insert = log.find((e) => e.sql.startsWith("insert"))!;
    const update = log.find((e) => e.sql.startsWith("update"))!;
    expect(log.indexOf(insert)).toBeLessThan(log.indexOf(update)); // journal-then-flip
    expect(JSON.stringify(insert.params)).toContain("displayNameLength");
    expect(JSON.stringify(insert.params)).not.toContain("2B Englisch");
  });

  it("archived_at sperrt und entsperrt dieselbe Klasse", async () => {
    const zu = schreiber([[BESTAND], [LEHRKRAFT_ZEILE]]);
    await applyKontoClassTerm(zu.db, { ...EINGANG, archived_at: "2026-11-01T00:00:00Z" });
    expect(zu.log.find((e) => e.sql.startsWith("update"))!.sql).toContain("archived_at");

    const auf = schreiber([[BESTAND_ARCHIVIERT], [LEHRKRAFT_ZEILE]]);
    const r = await applyKontoClassTerm(auf.db, { ...EINGANG, archived_at: null });
    expect(r).toEqual({ ok: true, app_class_id: KLASSE, geaendert: true });
  });

  it("eine Klasse, die es hier nicht gibt, ist 404 und kein stilles Anlegen", async () => {
    const { db } = schreiber([[]]);
    expect(await applyKontoClassTerm(db, EINGANG)).toEqual({ ok: false, grund: "unbekannte-klasse" });
  });

  it("eine unbekannte Besitzerin laesst die bisherige stehen, statt die Klasse zu verwaisen", async () => {
    const { log, db } = schreiber([[BESTAND], []]); // Lehrkraft nicht gefunden
    await applyKontoClassTerm(db, { ...EINGANG, name: "2C", owner_app_user_id: "fremd" });
    const update = log.find((e) => e.sql.startsWith("update"))!;
    expect(update.params).toContain(LEHRKRAFT); // die alte Besitzerin bleibt
  });
});

describe("POST /api/konto/account-deleted — loeschen", () => {
  it("nimmt jede Tabelle mit, die eine Person kennt — und die Identitaet ZULETZT", async () => {
    const { log, db } = schreiber();
    const bericht = await deleteUserData(db, "kind-1");
    const tabellen = log.filter((e) => e.sql.startsWith("delete")).map((e) => /from "domigo_v2"\."([a-z_]+)"/.exec(e.sql)?.[1]);
    for (const t of [
      "practice_attempts",
      "review_queue",
      "user_progress",
      "study_path_progress",
      "writing_submissions",
      "game_saves",
      "assignment_sessions",
      "ops_link_uses",
      "rollover_snapshots",
      "teacher_events",
      "teacher_reset_tokens",
      "users",
    ]) {
      expect(tabellen, `${t} wird nicht geloescht`).toContain(t);
    }
    // Die Person zuletzt: schlaegt etwas davor fehl, findet der naechste Versuch
    // dieselbe Person wieder und nicht eine verwaiste Spur.
    expect(tabellen[tabellen.length - 1]).toBe("users");
    expect(bericht.gefunden).toBe(false); // Drehbuch liefert nichts ⇒ unbekannt
  });

  it("ein Unbekannter ist kein Fehler — dieselbe Nachricht darf beliebig oft kommen", async () => {
    const { db } = schreiber();
    expect((await deleteUserData(db, "gibt-es-nicht")).gefunden).toBe(false);
  });

  it("was NICHT geloescht wird, wird auch nicht angefasst", async () => {
    const { log, db } = schreiber();
    await deleteUserData(db, "kind-1");
    const sql = log.map((e) => e.sql).join(" ");
    // Die Klasse, ihre Aufgaben und das Journal ueberleben die Person.
    expect(sql).not.toMatch(/delete from "domigo_v2"\."classes"/);
    expect(sql).not.toMatch(/delete from "domigo_v2"\."assignments"/);
    expect(sql).not.toMatch(/delete from "domigo_v2"\."roster_events"/);
  });
});
