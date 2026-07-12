import { describe, expect, it } from "vitest";
import { claimLabel, claimStudent, isUniqueViolation, parseRoster } from "./roster-service.ts";

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
