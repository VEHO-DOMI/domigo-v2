import { describe, expect, it } from "vitest";
import {
  claimLabel,
  claimStudent,
  importRoster,
  isUniqueViolation,
  parseRoster,
  removeStudent,
  renameStudentGiven,
  resetStudentPin,
} from "./roster-service.ts";
import type { Db } from "./index.ts";

// Minimal stateful mock of the drizzle Db chain used by claimStudent:
//   select().from().where().limit() → 1st call = the student lookup, 2nd = the clash check;
//   insert().values() resolves; update().set().where() resolves or rejects with `updateError`.
type ClaimDb = Parameters<typeof claimStudent>[0];
function raceDb(opts: { updateError?: unknown; student?: unknown[]; clash?: unknown[] } = {}): ClaimDb {
  let selectN = 0;
  const student = opts.student ?? [{ classId: "c1", claimedAt: null }];
  const clash = opts.clash ?? [];
  return {
    select: () => ({ from: () => ({ where: () => ({ limit: () => { selectN += 1; return Promise.resolve(selectN === 1 ? student : clash); } }) }) }),
    insert: () => ({ values: () => Promise.resolve(undefined) }),
    update: () => ({ set: () => ({ where: () => (opts.updateError ? Promise.reject(opts.updateError) : Promise.resolve(undefined)) }) }),
  } as unknown as ClaimDb;
}
const claimInput = { studentId: "s1", displayName: "Anna", pinHash: "h" };

describe("isUniqueViolation — Postgres 23505 across driver error shapes", () => {
  it("detects the code on the error or its cause", () => {
    expect(isUniqueViolation({ code: "23505" })).toBe(true);
    expect(isUniqueViolation({ cause: { code: "23505" } })).toBe(true);
  });
  it("detects via the message fallback", () => {
    expect(isUniqueViolation(new Error('duplicate key value violates unique constraint "users_class_claimed_nickname_unique"'))).toBe(true);
    expect(isUniqueViolation({ message: "postgres error 23505" })).toBe(true);
  });
  it("is false for other errors and nullish input", () => {
    expect(isUniqueViolation({ code: "23503" })).toBe(false); // FK violation, not unique
    expect(isUniqueViolation(new Error("connection reset"))).toBe(false);
    expect(isUniqueViolation(null)).toBe(false);
    expect(isUniqueViolation(undefined)).toBe(false);
    expect(isUniqueViolation({})).toBe(false);
  });
});

describe("claimStudent — the duplicate-claim (TOCTOU race) path", () => {
  it("returns 'taken' when the flip UPDATE raises a unique violation (a concurrent claim won the nickname)", async () => {
    expect(await claimStudent(raceDb({ updateError: { code: "23505" } }), claimInput)).toBe("taken");
  });
  it("returns 'ok' when the flip succeeds", async () => {
    expect(await claimStudent(raceDb({ updateError: null }), claimInput)).toBe("ok");
  });
  it("rethrows a non-unique DB error (never swallows a real failure)", async () => {
    await expect(claimStudent(raceDb({ updateError: { code: "08006" } }), claimInput)).rejects.toBeTruthy();
  });
  it("returns 'gone' when the student is missing or already claimed", async () => {
    expect(await claimStudent(raceDb({ student: [] }), claimInput)).toBe("gone");
    expect(await claimStudent(raceDb({ student: [{ classId: "c1", claimedAt: new Date() }] }), claimInput)).toBe("gone");
  });
  it("returns 'taken' on the app-code clash (fast path, before any write)", async () => {
    expect(await claimStudent(raceDb({ clash: [{ id: "other" }] }), claimInput)).toBe("taken");
  });
});

describe("parseRoster — one name per line, forgiving of a pasted list", () => {
  it("splits on newlines and trims each name", () => {
    expect(parseRoster("Anna\nBen\nClara")).toEqual(["Anna", "Ben", "Clara"]);
    expect(parseRoster("  Anna  \n\tBen\t")).toEqual(["Anna", "Ben"]);
  });

  it("handles Windows CRLF line endings", () => {
    expect(parseRoster("Anna\r\nBen\r\nClara")).toEqual(["Anna", "Ben", "Clara"]);
  });

  it("drops blank and whitespace-only lines", () => {
    expect(parseRoster("Anna\n\n   \nBen\n\t\n")).toEqual(["Anna", "Ben"]);
    expect(parseRoster("")).toEqual([]);
    expect(parseRoster("\n\n")).toEqual([]);
  });

  it("dedupes case-insensitively, preserving the FIRST casing seen", () => {
    expect(parseRoster("Anna\nanna\nANNA\nBen")).toEqual(["Anna", "Ben"]);
    expect(parseRoster("ben\nBen")).toEqual(["ben"]);
  });

  it("is CSV-ish: strips a one-column trailing comma and surrounding quotes", () => {
    expect(parseRoster("Anna,\nBen,")).toEqual(["Anna", "Ben"]);
    expect(parseRoster('"Anna"\n"Ben"')).toEqual(["Anna", "Ben"]);
    expect(parseRoster('"Clara",')).toEqual(["Clara"]);
  });

  it("keeps a name with an internal space or comma (only ONE name per line)", () => {
    expect(parseRoster("Anna Müller\nBen Ostrowski")).toEqual(["Anna Müller", "Ben Ostrowski"]);
    // a quoted "Last, First" cell keeps its internal comma (quotes stripped, comma kept)
    expect(parseRoster('"Müller, Anna"')).toEqual(["Müller, Anna"]);
  });
});

/**
 * ── THE SHARED FIXTURE LIST (K9b) ────────────────────────────────────────────
 * This block is BYTE-IDENTICAL in two files, on purpose:
 *   • packages/db/src/roster-service.test.ts        (server: parseRoster)
 *   • apps/web/lib/roster-parse.test.ts             (client: previewRoster)
 * The two parsers are deliberate twins — @domigo/db is server-only and cannot enter
 * the browser bundle — so the only thing that can keep them honest is one list of
 * cases run against both. Add a case here and it must be added there, unchanged.
 *
 * To prove the pinning works, break ONE side's rule and this list goes red on that
 * side alone; a change made to both stays green. A twin nobody compares is just a
 * copy waiting to drift.
 */
const TWIN_FIXTURES: { label: string; input: string; expect: string[] }[] = [
  { label: "plain list, one name per line", input: "Anna Mueller\nBen Ostrowski\nClara Nowak", expect: ["Anna Mueller", "Ben Ostrowski", "Clara Nowak"] },
  { label: "Windows CRLF line endings", input: "Anna\r\nBen\r\nClara", expect: ["Anna", "Ben", "Clara"] },
  { label: "blank and whitespace-only lines are dropped", input: "Anna\n\n   \nBen\n\t\n", expect: ["Anna", "Ben"] },
  { label: "nothing at all", input: "", expect: [] },
  { label: "dedupe is case-insensitive and keeps the FIRST casing", input: "Anna\nanna\nANNA\nBen", expect: ["Anna", "Ben"] },
  { label: "one-column CSV: trailing comma stripped", input: "Anna,\nBen,", expect: ["Anna", "Ben"] },
  { label: "one-column CSV: surrounding quotes stripped", input: "\"Anna\"\n\"Ben\"\n\"Clara\",", expect: ["Anna", "Ben", "Clara"] },
  { label: "multi-column, semicolon separated: first cell wins", input: "Anna Mueller;5B;anna@example.at\nBen Ostrowski;5B;ben@example.at", expect: ["Anna Mueller", "Ben Ostrowski"] },
  { label: "multi-column, TAB separated: first cell wins", input: "Anna Mueller\t5B\nBen Ostrowski\t5B", expect: ["Anna Mueller", "Ben Ostrowski"] },
  { label: "quoted cell keeps its internal comma, the semicolon tail is dropped", input: "\"Mueller, Anna\";5B\n\"Ostrowski, Ben\";5B", expect: ["Mueller, Anna", "Ostrowski, Ben"] },
  { label: "quoted cell followed by a COMMA separator", input: "\"Mueller, Anna\",5B,anna@example.at", expect: ["Mueller, Anna"] },
  { label: "DECLARED BOUNDARY: an UNQUOTED comma keeps the whole line (surname-first is one name)", input: "Mueller, Anna\nOstrowski, Ben", expect: ["Mueller, Anna", "Ostrowski, Ben"] },
  { label: "a header row is just another name — the teacher removes it in the review list", input: "Name;Klasse\nAnna Mueller;5B", expect: ["Name", "Anna Mueller"] },
  { label: "everything at once, the way a real export arrives", input: "\"Mueller, Anna\";5B\nBen Ostrowski\t5B\n\n  Clara Nowak  ,\nben ostrowski\t5B\n", expect: ["Mueller, Anna", "Ben Ostrowski", "Clara Nowak"] },
];

describe("parseRoster — the shared twin fixtures (server half)", () => {
  for (const f of TWIN_FIXTURES) {
    it(f.label, () => {
      expect(parseRoster(f.input)).toEqual(f.expect);
    });
  }
});

describe("parseRoster — first cell wins, but never at a name's expense", () => {
  it("drops every column after the first, whatever the separator", () => {
    expect(parseRoster("Anna;5B")).toEqual(["Anna"]);
    expect(parseRoster("Anna\t5B")).toEqual(["Anna"]);
    expect(parseRoster('"Anna";5B')).toEqual(["Anna"]);
  });

  it("a BARE comma is NOT a separator — that is the declared boundary", () => {
    // The one case the rule refuses to guess: "Mueller, Anna" is surname-first, and a
    // parser that split there would silently import half of every Austrian roster.
    expect(parseRoster("Mueller, Anna")).toEqual(["Mueller, Anna"]);
    expect(parseRoster("Mueller, Anna;5B")).toEqual(["Mueller, Anna"]);
  });

  it("an unclosed quote is left alone rather than swallowing the line", () => {
    expect(parseRoster('"Anna')).toEqual(['"Anna']);
  });

  it("dedupes AFTER the columns are cut, so two rows of the same child collapse", () => {
    expect(parseRoster("Anna;5B\nanna;5C")).toEqual(["Anna"]);
  });
});

describe("claimLabel — privacy: first name + last initial", () => {
  it("reduces a two-part name to first name + last initial", () => {
    expect(claimLabel("Anna Müller")).toBe("Anna M.");
    expect(claimLabel("Ben Ostrowski")).toBe("Ben O.");
  });

  it("returns a single-word name unchanged", () => {
    expect(claimLabel("Anna")).toBe("Anna");
    expect(claimLabel("Cher")).toBe("Cher");
  });

  it("uses the LAST token's initial when there is a middle name", () => {
    expect(claimLabel("Anna Maria Müller")).toBe("Anna M.");
    expect(claimLabel("Jean Luc Picard")).toBe("Jean P.");
  });

  it("uppercases the surname initial even when the source is lowercase", () => {
    expect(claimLabel("anna müller")).toBe("anna M.");
  });

  it("collapses extra whitespace and trims", () => {
    expect(claimLabel("   Anna    Müller   ")).toBe("Anna M.");
  });

  it("returns an empty string for an empty or whitespace-only name (never throws)", () => {
    expect(claimLabel("")).toBe("");
    expect(claimLabel("   ")).toBe("");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// P3 · actorId — WHO acted vs WHOSE authorization was used.
//
// When the platform operator (grandmaster) manages a class he does not own, the
// services run with the OWNER's id, so the WHERE clause stays the one and only
// authorization; the journal, however, has to record HIM. Two properties matter,
// and they pull in opposite directions:
//   1. roster_events.actor_id carries the ACTOR (the journal must not be able to
//      lie about whose hand pulled the lever), and
//   2. actorId reaches NO WHERE clause — it may name an actor, never widen an
//      authorization. A leak in that direction would be the whole rank escaping
//      into every teacher call.
// ─────────────────────────────────────────────────────────────────────────────

const OWNER = "owner-teacher-id";
const GRANDMASTER = "grandmaster-id";

/**
 * Records what the service WROTE and what it FILTERED on. select() serves the
 * owner lookups (first the ownedStudent/class check, then any follow-up read);
 * insert().values() banks each written row, so `events[0]` is the journal row that
 * journal-then-flip demands be written first.
 */
function journalDb(selectResults: unknown[][] = [[{ classId: "c1", claimedAt: null }]]) {
  let n = 0;
  const conditions: unknown[][] = [];
  const written: unknown[] = [];
  const db = {
    select: () => {
      const rows = selectResults[n++] ?? [];
      const here: unknown[] = [];
      conditions.push(here);
      const node: Record<string, unknown> = {
        from: () => node,
        innerJoin: () => node,
        where: (c: unknown) => { here.push(c); return node; },
        orderBy: () => node,
        groupBy: () => node,
        limit: () => node,
        then: (a: never, b: never) => Promise.resolve(rows).then(a, b),
      };
      return node;
    },
    insert: () => ({ values: (v: unknown) => { written.push(v); return Promise.resolve(undefined); } }),
    update: () => ({ set: () => ({ where: () => Promise.resolve(undefined) }) }),
    delete: () => ({ where: () => Promise.resolve(undefined) }),
  };
  return { db: db as unknown as Db, conditions, written };
}

/**
 * The atoms of one drizzle condition tree — bound values, SQL fragments and column
 * names — walked with a hard STOP AT COLUMN rule (a column back-references its
 * table, and walking that would surface every sibling column, making the negative
 * assertions below vacuous). Cf. class-service.test.ts.
 */
function atomsOf(node: unknown): string[] {
  const out: string[] = [];
  const walk = (o: unknown, depth = 0): void => {
    if (o == null || depth > 8) return;
    if (typeof o === "string") { out.push(o); return; }
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

/** Every value the service filtered on, across all its queries. */
function allFilteredValues(conditions: unknown[][]): string[] {
  return [...new Set(conditions.flat().flatMap((c) => atomsOf(c)))];
}

const journalRow = (written: unknown[]) => written[0] as { actorId?: string | null; kind?: string };

describe("actorId — the journal names the actor, the WHERE clause keeps the owner", () => {
  it("renameStudentGiven: journal = grandmaster, authorization = owner", async () => {
    const { db, conditions, written } = journalDb();
    await renameStudentGiven(db, "s1", OWNER, "Piet Wacholder", GRANDMASTER);
    expect(journalRow(written).kind).toBe("rename");
    expect(journalRow(written).actorId).toBe(GRANDMASTER);
    expect(allFilteredValues(conditions)).toContain(OWNER);
    expect(allFilteredValues(conditions)).not.toContain(GRANDMASTER);
  });

  it("resetStudentPin: journal = grandmaster, authorization = owner", async () => {
    const { db, conditions, written } = journalDb();
    await resetStudentPin(db, "s1", OWNER, GRANDMASTER);
    expect(journalRow(written).kind).toBe("reset_pin");
    expect(journalRow(written).actorId).toBe(GRANDMASTER);
    expect(allFilteredValues(conditions)).toContain(OWNER);
    expect(allFilteredValues(conditions)).not.toContain(GRANDMASTER);
  });

  it("removeStudent: journal = grandmaster, authorization = owner", async () => {
    const { db, conditions, written } = journalDb();
    await removeStudent(db, "s1", OWNER, GRANDMASTER);
    expect(journalRow(written).kind).toBe("remove");
    expect(journalRow(written).actorId).toBe(GRANDMASTER);
    expect(allFilteredValues(conditions)).toContain(OWNER);
    expect(allFilteredValues(conditions)).not.toContain(GRANDMASTER);
  });

  it("importRoster: journal = grandmaster, authorization = owner", async () => {
    // 1st select = the class-ownership check, 2nd = the already-present names.
    const { db, conditions, written } = journalDb([[{ id: "c1" }], []]);
    const imported = await importRoster(db, { classId: "c1", teacherId: OWNER, names: ["Piet Wacholder"], actorId: GRANDMASTER });
    expect(imported).toBe(1);
    expect(journalRow(written).kind).toBe("import");
    expect(journalRow(written).actorId).toBe(GRANDMASTER);
    expect(allFilteredValues(conditions)).toContain(OWNER);
    expect(allFilteredValues(conditions)).not.toContain(GRANDMASTER);
  });

  it("leaves the ordinary teacher case untouched: no actorId ⇒ the teacher IS the actor", async () => {
    for (const run of [
      async () => { const m = journalDb(); await renameStudentGiven(m.db, "s1", OWNER, "Piet Wacholder"); return m; },
      async () => { const m = journalDb(); await resetStudentPin(m.db, "s1", OWNER); return m; },
      async () => { const m = journalDb(); await removeStudent(m.db, "s1", OWNER); return m; },
      async () => { const m = journalDb([[{ id: "c1" }], []]); await importRoster(m.db, { classId: "c1", teacherId: OWNER, names: ["Piet Wacholder"] }); return m; },
    ]) {
      const { written } = await run();
      expect(journalRow(written).actorId).toBe(OWNER);
    }
  });

  it("writes the journal row BEFORE the live change, actor and all (journal-then-flip)", async () => {
    const { db, written } = journalDb([[{ id: "c1" }], []]);
    await importRoster(db, { classId: "c1", teacherId: OWNER, names: ["Piet Wacholder"], actorId: GRANDMASTER });
    expect(written).toHaveLength(2); // [0] the event, [1] the student rows
    expect(journalRow(written).actorId).toBe(GRANDMASTER);
    expect(Array.isArray(written[1])).toBe(true); // the flip came second
  });

  it("never lets the actor stand in for the owner: a foreign class still updates nothing", async () => {
    // ownedStudent finds no row (the class is not the owner's) ⇒ silent no-op,
    // and crucially NO journal row — an unauthorized action leaves no trace of
    // having been authorized.
    const { db, written } = journalDb([[]]);
    await renameStudentGiven(db, "s1", "some-other-teacher", "Piet Wacholder", GRANDMASTER);
    expect(written).toHaveLength(0);
  });
});
