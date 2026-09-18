/**
 * P-R8 · Die eine Tuer zum Klassen-Journal — was sie durchlaesst, was sie
 * redigiert, und der Beweis, dass die Pruefung ueberhaupt sehen kann, was sie
 * behauptet zu verhindern.
 *
 * Der Auftrag dieser Batterie ist eng und hart: eine Nutzlast, die einen Namen
 * traegt, darf die Tabelle NICHT erreichen — und die elf echten Nutzlasten des
 * Repos muessen unveraendert durchgehen. Beides wird an der TATSAECHLICH
 * eingefuegten Zeile geprueft, nie am Rueckgabewert.
 */
import { describe, expect, it, vi } from "vitest";
import type { Db } from "./index.ts";
import { REDIGIERT, VOKABULAR_UMFANG, scrubRosterPayload, writeRosterEvent } from "./roster-events.ts";
import { v2RosterEvents } from "./schema.ts";

/** Schreib-Attrappe: merkt sich jede eingefuegte Zeile samt Tabelle. */
function insertDb(fail?: Error) {
  const written: { table: unknown; values: Record<string, unknown> }[] = [];
  const db = {
    insert: (table: unknown) => ({
      values: (v: Record<string, unknown>) => {
        if (fail) return Promise.reject(fail);
        written.push({ table, values: v });
        return Promise.resolve(undefined);
      },
    }),
  };
  return { db: db as unknown as Db, written };
}

const KLASSE = "0a1b2c3d-0000-4000-8000-000000000001";
const KIND = "0a1b2c3d-0000-4000-8000-000000000002";
const LEHRKRAFT = "0a1b2c3d-0000-4000-8000-000000000003";
const ABGABE = "0a1b2c3d-0000-4000-8000-000000000004";

/**
 * DIE ELF ECHTEN NUTZLASTEN, in der Form, die die fuenf Dienst-Module nach P-R8
 * bauen. Sie stehen hier AUSGESCHRIEBEN und nicht aus dem Pruefling abgeleitet:
 * eine Erwartung, die sich aus dem Geprueften speist, prueft nichts (K7a-Gesetz).
 * Waechst das Vokabular, ohne dass diese Liste waechst, faellt die Zaehlung unten.
 */
const ECHTE_NUTZLASTEN: { stelle: string; payload: Record<string, unknown> }[] = [
  { stelle: "roster-service · import", payload: { count: 23 } },
  { stelle: "roster-service · claim", payload: { studentId: KIND, displayNameLength: 11 } },
  { stelle: "roster-service · reset_pin", payload: { studentId: KIND } },
  { stelle: "roster-service · rename", payload: { studentId: KIND, givenNameLength: 14 } },
  { stelle: "roster-service · remove", payload: { studentId: KIND } },
  { stelle: "class-service · archive", payload: { classId: KLASSE } },
  { stelle: "class-service · unarchive", payload: { classId: KLASSE } },
  { stelle: "teacher-claim · teacher_claim", payload: { classId: KLASSE, fromTeacherId: LEHRKRAFT, toTeacherId: KIND } },
  { stelle: "progress-adjust · xp", payload: { op: "xp", studentId: KIND, vocabXp: 50, grammarXp: 7 } },
  {
    stelle: "progress-adjust · unit",
    payload: { op: "unit", studentId: KIND, unitSlug: "g2-u03", nodeIds: ["vocab-intro", "vocab-practice-2", "checkpoint"], stars: 1 },
  },
  {
    stelle: "writing-review · writing_graded",
    payload: { op: "grade", submissionId: ABGABE, score: 78, feedbackLength: 61, onBehalfOf: null },
  },
];

describe("das Vokabular laesst die echte Arbeit durch", () => {
  for (const { stelle, payload } of ECHTE_NUTZLASTEN) {
    it(`unveraendert: ${stelle}`, () => {
      expect(scrubRosterPayload(payload)).toEqual(payload);
    });
  }

  it("kennt genau 17 Schluessel — ein neuer wird hier bewusst eingetragen, nie nebenbei", () => {
    expect(VOKABULAR_UMFANG).toBe(17);
  });

  it("laesst auch die lesbaren Bezeichner der Testbatterie durch (kleingeschrieben, mit Trenner)", () => {
    const p = { studentId: "kind-1", classId: "klasse-2b", submissionId: "abgabe-1" };
    expect(scrubRosterPayload(p)).toEqual(p);
  });
});

describe("das Vokabular haelt Namen und Freitext auf", () => {
  it("ein Schluessel, den niemand deklariert hat, kommt nicht durch — und die Stelle schreit", () => {
    const schrei = vi.spyOn(console, "error").mockImplementation(() => {});
    const raus = scrubRosterPayload({ names: ["Piet Wacholder", "Marisa Dohlenfeld"] });
    expect(raus).toEqual({ names: REDIGIERT });
    expect(JSON.stringify(raus)).not.toContain("Wacholder");
    expect(schrei).toHaveBeenCalledTimes(1);
    expect(String(schrei.mock.calls[0]![0])).toContain("names");
    schrei.mockRestore();
  });

  it("ein Name IM Id-Feld wird redigiert — daran scheitert jede Heuristik, die nur auf Feldnamen schaut", () => {
    const schrei = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(scrubRosterPayload({ studentId: "Anna Mueller" })).toEqual({ studentId: REDIGIERT });
    // Und die Form, die die Zeichensatz-Regel allein durchliesse: ein einzelnes
    // grossgeschriebenes Wort. Ein echter Bezeichner sieht nie so aus.
    expect(scrubRosterPayload({ studentId: "Anna" })).toEqual({ studentId: REDIGIERT });
    expect(scrubRosterPayload({ classId: "Müller" })).toEqual({ classId: REDIGIERT });
    schrei.mockRestore();
  });

  it("ein Freitext in einem Laengen-Feld wird redigiert — die Form gehoert zum Schluessel", () => {
    const schrei = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(scrubRosterPayload({ givenNameLength: "Piet Wacholder" })).toEqual({ givenNameLength: REDIGIERT });
    expect(scrubRosterPayload({ op: "loeschen" })).toEqual({ op: REDIGIERT });
    schrei.mockRestore();
  });

  it("prueft JEDES Element einer Liste, nicht nur das erste", () => {
    const schrei = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(scrubRosterPayload({ nodeIds: ["vocab-intro", "Piet Wacholder"] })).toEqual({ nodeIds: REDIGIERT });
    schrei.mockRestore();
  });
});

describe("writeRosterEvent — die Zeile, die wirklich geschrieben wird", () => {
  it("traegt Klasse, Art und Hand und schickt die Nutzlast durch den Waechter", async () => {
    const { db, written } = insertDb();
    await writeRosterEvent(db, { classId: KLASSE, kind: "rename", actorId: LEHRKRAFT, payload: { studentId: KIND, givenNameLength: 14 } });
    expect(written).toHaveLength(1);
    expect(written[0]!.table).toBe(v2RosterEvents);
    expect(written[0]!.values).toEqual({
      classId: KLASSE,
      kind: "rename",
      actorId: LEHRKRAFT,
      payload: { studentId: KIND, givenNameLength: 14 },
    });
  });

  it("nimmt eine Hand von `null` an — die Selbstbedienung des Kindes auf /join", async () => {
    const { db, written } = insertDb();
    await writeRosterEvent(db, { classId: KLASSE, kind: "claim", actorId: null, payload: { studentId: KIND, displayNameLength: 11 } });
    expect(written[0]!.values.actorId).toBeNull();
  });

  it("verschluckt KEINEN Datenbankfehler — journal-then-flip verlaesst sich darauf", async () => {
    const { db } = insertDb(Object.assign(new Error('relation "domigo_v2.roster_events" does not exist'), { code: "42P01" }));
    await expect(
      writeRosterEvent(db, { classId: KLASSE, kind: "remove", actorId: LEHRKRAFT, payload: { studentId: KIND } }),
    ).rejects.toBeTruthy();
  });
});

describe("TAMPER · das rote Licht muss erreichbar sein", () => {
  it("die ALTE Import-Nutzlast durch die Tuer: redigiert, und die Stelle schreit", async () => {
    const schrei = vi.spyOn(console, "error").mockImplementation(() => {});
    const { db, written } = insertDb();
    // Genau das, was vor P-R8 in der Tabelle stand.
    await writeRosterEvent(db, { classId: KLASSE, kind: "import", actorId: LEHRKRAFT, payload: { names: ["Piet Wacholder"] } });
    expect(JSON.stringify(written[0]!.values)).not.toContain("Piet Wacholder");
    expect(written[0]!.values.payload).toEqual({ names: REDIGIERT });
    expect(schrei).toHaveBeenCalled();
    schrei.mockRestore();
  });

  it("… und dieselbe Nutzlast AM Waechter vorbei ist sichtbar — sonst bewiese der Fall oben nichts", async () => {
    const { db, written } = insertDb();
    // Bewusst an writeRosterEvent vorbei: der Gegenbeweis, dass die Attrappe den
    // Namen ueberhaupt zeigen WUERDE (Muster teacher-events.test.ts).
    await db.insert!(null as never).values({ payload: { names: ["Piet Wacholder"] } } as never);
    expect(JSON.stringify(written[0]!.values)).toContain("Piet Wacholder");
  });
});
