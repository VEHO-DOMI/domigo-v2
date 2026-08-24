import { describe, expect, it } from "vitest";
import {
  MAX_FEEDBACK_LENGTH,
  WRITING_GRADED_KIND,
  gradeSubmission,
  listSubmissionsForClass,
} from "./writing-review.ts";
import { v2RosterEvents, writingSubmissions } from "./schema.ts";
import type { Db } from "./index.ts";

// ─────────────────────────────────────────────────────────────────────────────
// K6a · the teacher's view of the children's writing, and her mark on it.
//
// What is worth proving here is not that an UPDATE updates, but the five
// properties that would let this module do quiet damage while every gate stayed
// green: that a foreign teacher cannot reach a row AT ALL (the ownership lives
// in the statement, not in an `if`), that a mark outside 0-100 never reaches the
// database, that the history is written BEFORE the change and names the hand,
// that neither the child's text nor anyone's name is ever copied into that
// history, and that a missing column is reported as a STATE rather than as a
// 500. Four of those are negative claims, so they are asserted negatively —
// against the statement's own atoms and keys, never against a returned value.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The atoms of one drizzle node — its own SQL fragments, bound values and column
 * references — walked with the house rule: **stop at a column** (a Column
 * back-references its TABLE, and a table lists every column, so a naive deep walk
 * would make every negative assertion below a vacuous statement about the table).
 *
 * Two inherited defects are repaired here rather than re-paid for. The depth cap is
 * a CYCLE guard, not a filter: 16, the K1a size, because these WHERE clauses nest an
 * `sql` subquery inside an `and(...)` and the older cap of 8 silently truncated
 * exactly that innermost text. And NUMBERS are walked explicitly (K1b): drizzle
 * embeds a number interpolated into an `sql` template as a RAW number chunk, not a
 * Param object, so a walker that returns early on non-objects reports its absence as
 * proof. General law: a walker that cannot SEE an atom reports its absence as proof.
 */
function atomsOf(node: unknown): string[] {
  const out: string[] = [];
  const walk = (o: unknown, depth = 0): void => {
    if (o == null || depth > 16) return;
    if (typeof o === "string") { out.push(o); return; }
    if (typeof o === "number") { out.push(String(o)); return; }
    if (Array.isArray(o)) { for (const x of o) walk(x, depth + 1); return; }
    if (typeof o !== "object") return;
    const rec = o as Record<string, unknown>;
    if (typeof rec.name === "string" && "table" in rec) { out.push(`col:${rec.name}`); return; }
    if (Array.isArray(rec.queryChunks)) { walk(rec.queryChunks, depth + 1); return; }
    if (Array.isArray(rec.value)) { walk(rec.value, depth + 1); return; }
    if ("value" in rec && (typeof rec.value === "string" || typeof rec.value === "number")) out.push(String(rec.value));
  };
  walk(node);
  return [...new Set(out)];
}

interface Statement {
  art: "select" | "insert" | "update";
  table?: unknown;
  where?: unknown;
  selection?: unknown;
  values?: unknown;
  set?: unknown;
  joined?: boolean;
}

/**
 * Recording chain-mock over all three statement kinds. Every statement lands in ONE
 * ordered list, because the ORDER is half of what journal-then-apply means: a test
 * that only inspected the values could not tell a journal written first from one
 * written after the fact.
 *
 * `selectResults` is consumed in order, so a test can make the resolving read find a
 * row, find nothing, or fail — which is the only lever the three interesting paths
 * (own row · foreign row · missing column) differ by.
 */
function recDb(opts: {
  selectResults?: (unknown[] | Error)[];
  updateResult?: unknown[] | Error;
} = {}) {
  const statements: Statement[] = [];
  const selectResults = opts.selectResults ?? [];
  let selectN = 0;

  const db = {
    select: (selection?: unknown) => {
      const st: Statement = { art: "select", selection, joined: false };
      statements.push(st);
      const r = selectResults[selectN++];
      const p = r instanceof Error ? Promise.reject(r) : Promise.resolve(r ?? []);
      p.catch(() => {}); // an unawaited rejection must not surface as unhandled
      const node: Record<string, unknown> = {
        from: (t: unknown) => { st.table = t; return node; },
        innerJoin: () => { st.joined = true; return node; },
        leftJoin: () => { st.joined = true; return node; },
        where: (c: unknown) => { st.where = c; return node; },
        orderBy: () => node,
        limit: () => node,
        then: (a: never, b: never) => p.then(a, b),
        catch: (a: never) => p.catch(a),
      };
      return node;
    },
    insert: (table: unknown) => {
      const st: Statement = { art: "insert", table };
      const node: Record<string, unknown> = {
        values: (v: unknown) => { st.values = v; statements.push(st); return node; },
        onConflictDoUpdate: () => node,
        then: (a: never, b: never) => Promise.resolve(undefined).then(a, b),
        catch: (a: never) => Promise.resolve(undefined).catch(a),
      };
      return node;
    },
    update: (table: unknown) => {
      const st: Statement = { art: "update", table };
      statements.push(st);
      const node: Record<string, unknown> = {
        set: (s: unknown) => { st.set = s; return node; },
        where: (c: unknown) => { st.where = c; return node; },
        returning: () => {
          const r = opts.updateResult ?? [{ classId: CLASS }];
          return r instanceof Error ? Promise.reject(r) : Promise.resolve(r);
        },
      };
      return node;
    },
  };
  return { db: db as unknown as Db, statements };
}

const CLASS = "klasse-2b";
const SUB = "abgabe-1";
const EIGEN = "lehrkraft-eigen";
const FREMD = "lehrkraft-fremd";
const GM = "grossmeister";

/** The resolving read finds the row (it belongs to this teacher). */
const gefunden = () => recDb({ selectResults: [[{ classId: CLASS }]] });
/** The resolving read finds nothing — foreign, or gone. Same answer, by design. */
const nichtGefunden = () => recDb({ selectResults: [[]] });

/** Postgres speaks of a missing column/table in codes, and the driver may only say it in prose. */
const fehlendeSpalte = Object.assign(new Error('column "score" does not exist'), { code: "42703" });
const fehlendeTabelle = Object.assign(new Error('relation "domigo_v2.writing_submissions" does not exist'), { code: "42P01" });

// ═══ 1 · Die Punkte-Grenzen ══════════════════════════════════════════════════
//
// The bounds are written OUT here, digit by digit, and never read from the module
// under test. A boundary test that imports its own thresholds from the tested file
// stays green when a threshold shifts — it proves self-consistency, not correctness
// (the K7a law, found by that lane's own tamper).

describe("gradeSubmission — die Punkte-Grenzen", () => {
  const versuch = (score: number) => {
    const m = gefunden();
    return { m, lauf: gradeSubmission(m.db, { submissionId: SUB, score, feedback: null, teacherId: EIGEN, actorId: EIGEN }) };
  };

  it("weist -1 ab — und schreibt nichts, auch nicht ins Journal", async () => {
    const { m, lauf } = versuch(-1);
    await expect(lauf).rejects.toThrow(/between 0 and 100/i);
    expect(m.statements).toHaveLength(0);
  });

  it("weist 101 ab", async () => {
    const { m, lauf } = versuch(101);
    await expect(lauf).rejects.toThrow(/between 0 and 100/i);
    expect(m.statements).toHaveLength(0);
  });

  it("weist eine Kommazahl ab (Punkte sind ganze Punkte)", async () => {
    const { m, lauf } = versuch(66.5);
    await expect(lauf).rejects.toThrow(/whole number/i);
    expect(m.statements).toHaveLength(0);
  });

  it("nimmt 0 an — »gelesen und null Punkte« ist etwas anderes als »ungelesen«", async () => {
    const { lauf } = versuch(0);
    await expect(lauf).resolves.toEqual({ ok: true, classId: CLASS });
  });

  it("nimmt 100 an", async () => {
    const { lauf } = versuch(100);
    await expect(lauf).resolves.toEqual({ ok: true, classId: CLASS });
  });

  it("weist einen zu langen Kommentar ab, und zwar bei 2001 Zeichen", async () => {
    const m = gefunden();
    await expect(
      gradeSubmission(m.db, { submissionId: SUB, score: 50, feedback: "x".repeat(2001), teacherId: EIGEN, actorId: EIGEN }),
    ).rejects.toThrow(/at most 2000/i);
    expect(m.statements).toHaveLength(0);
    // …und die Konstante des Moduls stimmt mit der hier ausgeschriebenen Zahl überein.
    // Umgekehrt herum wäre der Test wertlos: er läse seine Erwartung aus dem Prüfling.
    expect(MAX_FEEDBACK_LENGTH).toBe(2000);
  });

  it("nimmt genau 2000 Zeichen an", async () => {
    const m = gefunden();
    await expect(
      gradeSubmission(m.db, { submissionId: SUB, score: 50, feedback: "x".repeat(2000), teacherId: EIGEN, actorId: EIGEN }),
    ).resolves.toEqual({ ok: true, classId: CLASS });
  });
});

// ═══ 2 · Die Autorisierung IST die WHERE-Klausel ═════════════════════════════

describe("gradeSubmission — die Autorisierung steht in der Anweisung, nicht in einem if", () => {
  it("trägt die Eigentums-Bedingung in BEIDEN Anweisungen (Auflösung UND Schreiben)", async () => {
    const m = gefunden();
    await gradeSubmission(m.db, { submissionId: SUB, score: 78, feedback: null, teacherId: EIGEN, actorId: EIGEN });
    const lese = m.statements.find((s) => s.art === "select")!;
    const schreib = m.statements.find((s) => s.art === "update")!;
    for (const st of [lese, schreib]) {
      const atome = atomsOf(st.where);
      expect(atome).toContain("col:teacher_id"); // die Klasse wird an ihrer Lehrkraft gemessen …
      expect(atome).toContain(EIGEN); //             … und zwar an DIESER
      expect(atome).toContain("col:class_id");
      expect(atome.join(" ")).toMatch(/in \(select/); // als Unterabfrage, weil ein UPDATE keinen Join hat
    }
  });

  it("eine fremde Abgabe trifft NULL Zeilen — kein Journal, kein Schreiben", async () => {
    const m = nichtGefunden();
    const res = await gradeSubmission(m.db, { submissionId: SUB, score: 78, feedback: "egal", teacherId: FREMD, actorId: FREMD });
    expect(res).toEqual({ ok: false, reason: "not_found" });
    expect(m.statements.filter((s) => s.art === "insert")).toHaveLength(0);
    expect(m.statements.filter((s) => s.art === "update")).toHaveLength(0);
  });

  it("»gibt es nicht« und »gehört dir nicht« sind DIESELBE Antwort", async () => {
    // Sonst wäre die Route ein Orakel: wer Ids durchprobiert, erführe, welche
    // Abgaben es bei anderen Lehrkräften gibt.
    const fremd = await gradeSubmission(nichtGefunden().db, { submissionId: SUB, score: 1, feedback: null, teacherId: FREMD, actorId: FREMD });
    const weg = await gradeSubmission(nichtGefunden().db, { submissionId: "gibt-es-nicht", score: 1, feedback: null, teacherId: EIGEN, actorId: EIGEN });
    expect(fremd).toEqual(weg);
  });

  it("verliert das Rennen ehrlich: die Auflösung fand die Zeile, das UPDATE trifft nichts mehr", async () => {
    // Zwischen Auflösung und Schreiben kann die Zeile verschwinden. Die ZEILENZAHL
    // des UPDATE ist das Urteil, nicht die Vorab-Lese.
    const m = recDb({ selectResults: [[{ classId: CLASS }]], updateResult: [] });
    const res = await gradeSubmission(m.db, { submissionId: SUB, score: 78, feedback: null, teacherId: EIGEN, actorId: EIGEN });
    expect(res).toEqual({ ok: false, reason: "not_found" });
  });
});

// ═══ 3 · Journal-vor-Anwendung, und was NICHT drinsteht ══════════════════════

describe("gradeSubmission — die Geschichte steht vor der Änderung", () => {
  it("schreibt das Journal ZUERST und die Note danach", async () => {
    const m = gefunden();
    await gradeSubmission(m.db, { submissionId: SUB, score: 78, feedback: "Zwei Sätze.", teacherId: EIGEN, actorId: EIGEN });
    const schreibende = m.statements.filter((s) => s.art !== "select");
    expect(schreibende.map((s) => s.art)).toEqual(["insert", "update"]);
    expect(schreibende[0]!.table).toBe(v2RosterEvents);
    expect(schreibende[1]!.table).toBe(writingSubmissions);
  });

  it("nennt Klasse, Art und HAND — und trägt weder den Text des Kindes noch einen Namen", async () => {
    const KINDERTEXT = "My favourite subject is English because our teacher is funny.";
    const m = gefunden();
    await gradeSubmission(m.db, { submissionId: SUB, score: 78, feedback: KINDERTEXT, teacherId: EIGEN, actorId: EIGEN });
    const journal = m.statements.find((s) => s.art === "insert")!.values as Record<string, unknown>;
    expect(journal.classId).toBe(CLASS);
    expect(journal.kind).toBe(WRITING_GRADED_KIND);
    expect(journal.actorId).toBe(EIGEN);
    // Die Nutzlast wird als GANZES gegen den Text geprüft, nicht Feld für Feld:
    // eine Feld-für-Feld-Prüfung übersieht genau das Feld, das jemand später ergänzt.
    const nutzlast = JSON.stringify(journal.payload);
    expect(nutzlast).not.toContain(KINDERTEXT);
    expect(nutzlast).not.toContain("favourite");
    expect(JSON.parse(nutzlast)).toEqual({
      op: "grade",
      submissionId: SUB,
      score: 78,
      feedbackLength: KINDERTEXT.length,
      onBehalfOf: null,
    });
  });

  it("unterscheidet die Hand von der Vollmacht, wenn der Großmeister in fremder Klasse arbeitet", async () => {
    const m = gefunden();
    await gradeSubmission(m.db, { submissionId: SUB, score: 78, feedback: null, teacherId: EIGEN, actorId: GM });
    const journal = m.statements.find((s) => s.art === "insert")!.values as Record<string, unknown>;
    expect(journal.actorId).toBe(GM); // wessen HAND
    expect((journal.payload as Record<string, unknown>).onBehalfOf).toBe(EIGEN); // wessen VOLLMACHT
  });

  it("darf überschreiben — jede Korrektur bekommt ihre eigene Journal-Zeile", async () => {
    const erst = gefunden();
    await gradeSubmission(erst.db, { submissionId: SUB, score: 87, feedback: null, teacherId: EIGEN, actorId: EIGEN });
    const dann = gefunden();
    await gradeSubmission(dann.db, { submissionId: SUB, score: 78, feedback: null, teacherId: EIGEN, actorId: EIGEN });
    expect((erst.statements.find((s) => s.art === "insert")!.values as { payload: { score: number } }).payload.score).toBe(87);
    expect((dann.statements.find((s) => s.art === "insert")!.values as { payload: { score: number } }).payload.score).toBe(78);
  });

  it("rührt beim Benoten NUR die vier Noten-Spalten an — nie den Text, nie die Klasse", async () => {
    const m = gefunden();
    await gradeSubmission(m.db, { submissionId: SUB, score: 78, feedback: "gut", teacherId: EIGEN, actorId: EIGEN });
    const gesetzt = m.statements.find((s) => s.art === "update")!.set as Record<string, unknown>;
    expect(Object.keys(gesetzt).sort()).toEqual(["feedback", "gradedAt", "gradedBy", "score"]);
    expect(gesetzt.gradedBy).toBe(EIGEN);
    expect(gesetzt.score).toBe(78);
  });

  it("macht aus einem leeren Kommentar ein null, nicht ein leeres Feld", async () => {
    const m = gefunden();
    await gradeSubmission(m.db, { submissionId: SUB, score: 78, feedback: "   ", teacherId: EIGEN, actorId: EIGEN });
    const gesetzt = m.statements.find((s) => s.art === "update")!.set as Record<string, unknown>;
    expect(gesetzt.feedback).toBeNull();
  });
});

// ═══ 4 · Die Projektion der Liste ════════════════════════════════════════════

describe("listSubmissionsForClass — die Liste holt keine Personen-Spalte", () => {
  it("liest ausschließlich writing_submissions, ohne jeden Join", async () => {
    const m = recDb({ selectResults: [[]] });
    await listSubmissionsForClass(m.db, CLASS);
    const st = m.statements.find((s) => s.art === "select")!;
    expect(st.table).toBe(writingSubmissions);
    expect(st.joined).toBe(false); // ein Join auf ein Namensregister ist die Art, wie Namen leaken
  });

  it("wählt exakt die Spalten der Abgabe — keine, die es woanders gibt", async () => {
    const m = recDb({ selectResults: [[]] });
    await listSubmissionsForClass(m.db, CLASS);
    const felder = Object.keys(m.statements.find((s) => s.art === "select")!.selection as object);
    expect(felder.sort()).toEqual(
      ["feedback", "gradedAt", "gradedBy", "id", "promptId", "score", "submittedAt", "testId", "text", "unitSlug", "userId", "wordCount"],
    );
    // Negativ, gegen die Namen, die eine spätere Hand versucht wäre mitzunehmen:
    for (const verboten of ["displayName", "givenName", "name", "pinHash", "email"]) {
      expect(felder).not.toContain(verboten);
    }
  });

  it("ist auf EINE Klasse verengt", async () => {
    const m = recDb({ selectResults: [[]] });
    await listSubmissionsForClass(m.db, CLASS);
    const atome = atomsOf(m.statements.find((s) => s.art === "select")!.where);
    expect(atome).toContain("col:class_id");
    expect(atome).toContain(CLASS);
  });

  it("gibt die neueste Abgabe zuerst", async () => {
    const jung = new Date("2026-08-24T10:00:00Z");
    const alt = new Date("2026-08-01T10:00:00Z");
    const zeile = (id: string, at: Date) => ({
      id, userId: "kind", unitSlug: "g2-u01", testId: "t", promptId: "p", text: "…", wordCount: 42,
      submittedAt: at, score: null, feedback: null, gradedAt: null, gradedBy: null,
    });
    const m = recDb({ selectResults: [[zeile("neu", jung), zeile("alt", alt)]] });
    const res = await listSubmissionsForClass(m.db, CLASS);
    expect(res.rows.map((r) => r.id)).toEqual(["neu", "alt"]);
  });
});

// ═══ 5 · Die fehlende Spalte ist ein ZUSTAND, kein Ausfall ═══════════════════

describe("das Fenster zwischen Merge und Migration", () => {
  it("zeigt die Texte weiter, nur ohne Benotung, wenn 0018 noch nicht liegt", async () => {
    const schmal = {
      id: "a", userId: "kind", unitSlug: "g2-u01", testId: "t", promptId: "p",
      text: "Mein Schultag", wordCount: 2, submittedAt: new Date("2026-08-24T10:00:00Z"),
    };
    const m = recDb({ selectResults: [fehlendeSpalte, [schmal]] });
    const res = await listSubmissionsForClass(m.db, CLASS);
    expect(res.gradingAvailable).toBe(false);
    expect(res.rows).toHaveLength(1);
    expect(res.rows[0]!.text).toBe("Mein Schultag"); // die Arbeit des Kindes ist weiter da …
    expect(res.rows[0]!.score).toBeNull(); //            … und ist unbenotet, nicht null Punkte
    // Der zweite Versuch fragt die vier Spalten gar nicht erst an.
    const zweite = Object.keys(m.statements.filter((s) => s.art === "select")[1]!.selection as object);
    expect(zweite).not.toContain("score");
    expect(zweite).toContain("text");
  });

  it("überlebt sogar eine fehlende TABELLE (42P01) auf demselben Weg", async () => {
    const m = recDb({ selectResults: [fehlendeTabelle, []] });
    await expect(listSubmissionsForClass(m.db, CLASS)).resolves.toEqual({ gradingAvailable: false, rows: [] });
  });

  it("meldet beim Benoten den Zustand statt eines 500", async () => {
    const m = recDb({ selectResults: [fehlendeSpalte] });
    await expect(
      gradeSubmission(m.db, { submissionId: SUB, score: 78, feedback: null, teacherId: EIGEN, actorId: EIGEN }),
    ).resolves.toEqual({ ok: false, reason: "no_grading_columns" });
    expect(m.statements.filter((s) => s.art === "insert")).toHaveLength(0);
  });

  it("verschluckt aber KEINEN echten Ausfall — der fliegt weiter", async () => {
    // Das ist die Hälfte, die zählt: ein Rettungsnetz, das jeden Fehler auffängt,
    // verwandelt einen Datenbank-Ausfall in eine leere, plausible Seite.
    const echt = Object.assign(new Error("connection terminated"), { code: "08006" });
    await expect(listSubmissionsForClass(recDb({ selectResults: [echt] }).db, CLASS)).rejects.toThrow(/connection terminated/);
    await expect(
      gradeSubmission(recDb({ selectResults: [echt] }).db, { submissionId: SUB, score: 78, feedback: null, teacherId: EIGEN, actorId: EIGEN }),
    ).rejects.toThrow(/connection terminated/);
  });
});
