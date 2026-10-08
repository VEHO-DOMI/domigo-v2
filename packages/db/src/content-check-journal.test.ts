import { describe, expect, it } from "vitest";
import { PgDialect } from "drizzle-orm/pg-core";
import type { SQL } from "drizzle-orm";
import type { Db } from "./index.ts";
import { classScope, EMPTY_SCOPE } from "./scope.ts";
import {
  appendContentCheck, claimContentCheck, beginCheckupWorkflow,
  readCheckupComposition, readContentCheck, recordCheckupComposition,
  loadCheckedStudioDraft, saveCheckedStudioDraft, setCheckedStudioStatus,
  loadCheckedStudioDraftsForUnit, deleteCheckedStudioDraft,
  type ContentCheckAccess,
} from "./content-check-journal.ts";

const KEY = "10000000-0000-4000-8000-000000000001";
const EVENT = "10000000-0000-4000-8000-000000000002";
const CLASS = "10000000-0000-4000-8000-000000000003";
const TEACHER = "10000000-0000-4000-8000-000000000004";
const ACCESS: ContentCheckAccess = { scope: classScope([CLASS]), classId: CLASS, teacherId: TEACHER };
const TASK = { itemId: "g2-u03-modal-mc-001", revision: "revision-a", unitSlug: "g2-u03", kind: "grammar" as const };
const COMPOSITION = { unitSlug: "g2-u03", seed: "fixed-seed", itemIds: [TASK.itemId] };

type Row = { id: string; draftId: string; checkKind: string; verdict: string; evidence: unknown; createdAt: Date };
type Insert = Omit<Row, "createdAt">;

/** Models the existing PK's first-writer rule without opening a database. The
 * predicates are compiled using the real Drizzle PostgreSQL dialect below. */
function journalDb(initial: Row[] = [], failure?: Error, readBatches?: Row[][]) {
  const rows = [...initial];
  const predicates: SQL[] = [];
  const projections: unknown[] = [];
  const inserts: Insert[] = [];
  const conflicts: unknown[] = [];
  let reads = 0;
  const db = {
    insert: () => ({ values: (row: Insert) => ({
      onConflictDoNothing: (target: unknown) => {
        conflicts.push(target);
        let result: Promise<{ id: string }[]> | undefined;
        const execute = () => result ??= Promise.resolve().then(() => {
          if (failure) throw failure;
          inserts.push(row);
          if (rows.some((existing) => existing.id === row.id)) return [];
          rows.push({ ...row, createdAt: new Date() });
          return [{ id: row.id }];
        });
        return {
          returning: execute,
          then: (yes: (value: unknown) => unknown, no: (error: unknown) => unknown) => execute().then(yes, no),
        };
      },
    }) }),
    select: (projection: unknown) => {
      projections.push(projection);
      return { from: () => ({ where: (predicate: SQL) => {
        reads += 1;
        predicates.push(predicate);
        const selectedRows = readBatches?.shift() ?? rows;
        const answer = () => failure ? Promise.reject(failure) : Promise.resolve(selectedRows);
        return {
          limit: (limit: number) => answer().then((result) => result.slice(0, limit)),
          orderBy: () => {
            const ordered = failure ? Promise.reject(failure) : Promise.resolve([...selectedRows].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime() || b.id.localeCompare(a.id)));
            return Object.assign(ordered, { limit: (limit: number) => ordered.then((result) => result.slice(0, limit)) });
          },
          then: (yes: (value: unknown) => unknown, no: (error: unknown) => unknown) => answer().then(yes, no),
        };
      } }) };
    },
  };
  return { db: db as unknown as Db, rows, inserts, conflicts, predicates, projections, reads: () => reads };
}

function row(checkKind: string, verdict: string, evidence: unknown = {}, second = 0): Row {
  return { id: checkKind === "checkup_claim" ? KEY : crypto.randomUUID(), draftId: KEY,
    checkKind, verdict, evidence, createdAt: new Date(2026, 0, 1, 0, 0, second) };
}
const claim = () => row("checkup_claim", "checking", { ...TASK, teacherId: TEACHER, classId: CLASS });
const dialect = new PgDialect();

describe("content-check journal class wall", () => {
  const calls = [
    ["claim", (db: Db, access: ContentCheckAccess) => claimContentCheck(db, access, KEY, TASK)],
    ["retry claim", (db: Db, access: ContentCheckAccess) => claimContentCheck(db, access, KEY, TASK, KEY)],
    ["read", (db: Db, access: ContentCheckAccess) => readContentCheck(db, access, KEY)],
    ["append", (db: Db, access: ContentCheckAccess) => appendContentCheck(db, access, KEY, { status: "passed" })],
    ["record composition", (db: Db, access: ContentCheckAccess) => recordCheckupComposition(db, access, KEY, COMPOSITION)],
    ["read composition", (db: Db, access: ContentCheckAccess) => readCheckupComposition(db, access, KEY)],
    ["begin workflow", (db: Db, access: ContentCheckAccess) => beginCheckupWorkflow(db, access)],
  ] as const;
  for (const [name, call] of calls) {
    it.each([
      ["empty scope", { ...ACCESS, scope: EMPTY_SCOPE }],
      ["foreign class", { ...ACCESS, classId: "foreign-class" }],
      ["missing teacher", { ...ACCESS, teacherId: " " }],
    ] as const)(`${name} refuses %s before issuing SQL`, async (_name, access) => {
      const mock = journalDb();
      await expect(call(mock.db, access)).rejects.toThrow(_name === "empty scope" ? /no class scope/ : /refused/);
      expect(mock.inserts).toHaveLength(0);
      expect(mock.reads()).toBe(0);
    });
  }
});

/** Records the real service's SQL conditions without evaluating them or opening
 * PostgreSQL. Returned rows simulate the database's affected-row result. */
function studioDraftDb(rows: unknown[] = [], writeBatches?: unknown[][]) {
  const reads: SQL[] = [];
  const updates: SQL[] = [];
  const deletes: SQL[] = [];
  const inserted: Record<string, unknown>[] = [];
  const updated: Record<string, unknown>[] = [];
  const conflicts: Array<{ target: unknown }> = [];
  const affectedRows = () => Promise.resolve(writeBatches?.shift() ?? rows);
  let calls = 0;
  const db = {
    select: () => {
      calls++;
      return { from: () => ({ where: (predicate: SQL) => {
        reads.push(predicate);
        return {
          limit: () => Promise.resolve(rows),
          then: (yes: (value: unknown) => unknown, no: (error: unknown) => unknown) => Promise.resolve(rows).then(yes, no),
        };
      } }) };
    },
    insert: () => {
      calls++;
      return { values: (values: Record<string, unknown>) => {
        inserted.push(values);
        return { onConflictDoNothing: (config: { target: unknown }) => {
          conflicts.push(config);
          return { returning: affectedRows };
        } };
      } };
    },
    update: () => {
      calls++;
      return { set: (values: Record<string, unknown>) => {
        updated.push(values);
        return { where: (predicate: SQL) => {
          updates.push(predicate);
          return { returning: affectedRows };
        } };
      } };
    },
    delete: () => {
      calls++;
      return { where: (predicate: SQL) => {
        deletes.push(predicate);
        return { returning: affectedRows };
      } };
    },
  };
  return { db: db as unknown as Db, reads, updates, deletes, inserted, updated, conflicts, calls: () => calls };
}

const STUDIO_ITEM = { id: TASK.itemId, rev: 1, prompt: { lang: "en", text: "Synthetic question's first version." } };
const STUDIO_DRAFT = { itemId: TASK.itemId, unitSlug: TASK.unitSlug, kind: "grammar", item: STUDIO_ITEM, action: "create" as const };

describe("checked Studio drafts — scope before every SQL operation", () => {
  const calls = [
    ["load", (db: Db, access: ContentCheckAccess) => loadCheckedStudioDraft(db, access, TASK.itemId)],
    ["save", (db: Db, access: ContentCheckAccess) => saveCheckedStudioDraft(db, access, STUDIO_DRAFT)],
    ["status", (db: Db, access: ContentCheckAccess) => setCheckedStudioStatus(db, access, TASK.itemId, STUDIO_ITEM, "published")],
    ["list unit drafts", (db: Db, access: ContentCheckAccess) => loadCheckedStudioDraftsForUnit(db, access, TASK.unitSlug)],
    ["delete", (db: Db, access: ContentCheckAccess) => deleteCheckedStudioDraft(db, access, TASK.itemId, KEY)],
  ] as const;
  for (const [operation, call] of calls) {
    it.each([
      ["empty scope", { ...ACCESS, scope: EMPTY_SCOPE }],
      ["foreign class", { ...ACCESS, classId: "foreign-class" }],
      ["missing teacher", { ...ACCESS, teacherId: " " }],
    ] as const)(`${operation} refuses %s without touching the database`, async (reason, access) => {
      const mock = studioDraftDb();
      await expect(call(mock.db, access)).rejects.toThrow(reason === "empty scope" ? /no class scope/ : /refused/);
      expect(mock.calls()).toBe(0);
    });
  }
});

describe("checked Studio drafts — owned reads", () => {
  it("loads only the requested item owned by this teacher", async () => {
    const stored = { id: KEY, ...STUDIO_DRAFT, updatedBy: TEACHER, status: "draft", updatedAt: new Date() };
    const mock = studioDraftDb([stored]);
    await expect(loadCheckedStudioDraft(mock.db, ACCESS, TASK.itemId)).resolves.toEqual(stored);
    const query = dialect.sqlToQuery(mock.reads[0]!);
    expect(query.params).toEqual([TASK.itemId, TEACHER]);
    expect(query.sql).toMatch(/"item_id" = \$1 and .*"updated_by" = \$2/);
    expect(mock.calls()).toBe(1);
  });

  it("returns null when the owned read finds no row", async () => {
    const mock = studioDraftDb();
    await expect(loadCheckedStudioDraft(mock.db, ACCESS, TASK.itemId)).resolves.toBeNull();
  });

  it("lists only this unit's drafts owned by the current teacher", async () => {
    const mock = studioDraftDb([{ id: KEY, ...STUDIO_DRAFT }]);
    await expect(loadCheckedStudioDraftsForUnit(mock.db, ACCESS, TASK.unitSlug)).resolves.toHaveLength(1);
    const query = dialect.sqlToQuery(mock.reads[0]!);
    expect(query.params).toEqual([TASK.unitSlug, TEACHER]);
    expect(query.sql).toMatch(/"unit_slug" = \$1 and .*"updated_by" = \$2/);
  });
});

describe("checked Studio drafts — atomic save ownership and in-flight wall", () => {
  it("new-form saves only insert an owned draft and never update a collision", async () => {
    const mock = studioDraftDb([{ id: KEY }]);
    await expect(saveCheckedStudioDraft(mock.db, ACCESS, STUDIO_DRAFT)).resolves.toBe(true);
    expect(mock.inserted).toEqual([{ ...STUDIO_DRAFT, updatedBy: TEACHER, updatedAt: expect.any(Date), status: "draft" }]);
    expect(mock.conflicts[0]!.target).toMatchObject({ name: "item_id" });
    expect(mock.updates).toHaveLength(0);
    expect(mock.reads).toHaveLength(0);
    expect(mock.calls()).toBe(1);
  });

  it("sequential stale new forms cannot overwrite an existing item", async () => {
    const mock = studioDraftDb([], [[{ id: KEY }], []]);
    await expect(saveCheckedStudioDraft(mock.db, ACCESS, STUDIO_DRAFT)).resolves.toBe(true);
    await expect(saveCheckedStudioDraft(mock.db, ACCESS, { ...STUDIO_DRAFT, item: { ...STUDIO_ITEM, rev: 2 } })).resolves.toBe(false);
    expect(mock.conflicts).toHaveLength(2);
    expect(mock.updates).toHaveLength(0);
  });

  it("existing-form saves require draft id, item id, same owner AND status unequal to checking", async () => {
    const mock = studioDraftDb([{ id: KEY }]);
    await expect(saveCheckedStudioDraft(mock.db, ACCESS, STUDIO_DRAFT, KEY)).resolves.toBe(true);
    const query = dialect.sqlToQuery(mock.updates[0]!);
    expect(query.params).toEqual([KEY, TASK.itemId, TEACHER, "checking"]);
    expect(query.sql).toMatch(/"id" = \$1 and .*"item_id" = \$2 and .*"updated_by" = \$3 and .*"status" <> \$4/);
    expect(mock.updated).toEqual([{ ...STUDIO_DRAFT, updatedBy: TEACHER, updatedAt: expect.any(Date), status: "draft" }]);
    expect(mock.inserted).toHaveLength(0);
    expect(mock.reads).toHaveLength(0);
  });

  it("existing-form save reports false on replaced/deleted/foreign/checking rows without inserting", async () => {
    const mock = studioDraftDb();
    await expect(saveCheckedStudioDraft(mock.db, ACCESS, STUDIO_DRAFT, KEY)).resolves.toBe(false);
    expect(mock.inserted).toHaveLength(0);
    expect(mock.calls()).toBe(1);
  });

  it("normalizes a remove draft's null item to the required empty JSON object", async () => {
    const mock = studioDraftDb([{ id: KEY }]);
    await saveCheckedStudioDraft(mock.db, ACCESS, { ...STUDIO_DRAFT, item: null, action: "remove" });
    expect(mock.inserted[0]!.item).toEqual({});
  });
});

describe("checked Studio drafts — conditional deletion", () => {
  it("deletes only the exact draft and item owned by this teacher while not checking", async () => {
    const mock = studioDraftDb([{ id: KEY }]);
    await expect(deleteCheckedStudioDraft(mock.db, ACCESS, TASK.itemId, KEY)).resolves.toBe(true);
    const query = dialect.sqlToQuery(mock.deletes[0]!);
    expect(query.params).toEqual([TASK.itemId, KEY, TEACHER, "checking"]);
    expect(query.sql).toMatch(/"item_id" = \$1 and .*"id" = \$2 and .*"updated_by" = \$3 and .*"status" <> \$4/);
    expect(mock.reads).toHaveLength(0);
    expect(mock.calls()).toBe(1);
  });

  it("a deletion racing the checking state reports false when the conditional DELETE affects zero rows", async () => {
    const mock = studioDraftDb();
    await expect(deleteCheckedStudioDraft(mock.db, ACCESS, TASK.itemId, KEY)).resolves.toBe(false);
    expect(dialect.sqlToQuery(mock.deletes[0]!).params).toContain("checking");
    expect(mock.calls()).toBe(1);
  });
});

describe("checked Studio drafts — publish the exact checked bytes", () => {
  it.each(["checking", "check_failed", "published"] as const)("sets %s only for the owned item with unchanged JSON", async (status) => {
    const mock = studioDraftDb([{ id: KEY }]);
    await expect(setCheckedStudioStatus(mock.db, ACCESS, TASK.itemId, STUDIO_ITEM, status)).resolves.toBe(true);
    expect(mock.updated).toEqual([{ status, updatedAt: expect.any(Date) }]);
    const query = dialect.sqlToQuery(mock.updates[0]!);
    expect(query.params).toEqual([TASK.itemId, TEACHER, JSON.stringify(STUDIO_ITEM)]);
    expect(query.sql).toMatch(/"item_id" = \$1 and .*"updated_by" = \$2 and .*"item" = \$3::jsonb/);
    expect(query.sql).not.toContain(STUDIO_ITEM.prompt.text); // bound data, never SQL text
    expect(mock.reads).toHaveLength(0);
    expect(mock.calls()).toBe(1);
  });

  it("a new expected snapshot changes the conditional bytes, never silently re-reads latest", async () => {
    const first = studioDraftDb([{ id: KEY }]);
    const second = studioDraftDb([{ id: KEY }]);
    const changed = { ...STUDIO_ITEM, rev: 2, prompt: { ...STUDIO_ITEM.prompt, text: "Another synthetic question." } };
    await setCheckedStudioStatus(first.db, ACCESS, TASK.itemId, STUDIO_ITEM, "published");
    await setCheckedStudioStatus(second.db, ACCESS, TASK.itemId, changed, "published");
    expect(dialect.sqlToQuery(first.updates[0]!).params[2]).toBe(JSON.stringify(STUDIO_ITEM));
    expect(dialect.sqlToQuery(second.updates[0]!).params[2]).toBe(JSON.stringify(changed));
    expect(first.reads).toHaveLength(0);
    expect(second.reads).toHaveLength(0);
  });

  it.each(["checking", "check_failed", "published"] as const)("returns false for %s when bytes/owner changed or the row disappeared", async (status) => {
    const mock = studioDraftDb();
    await expect(setCheckedStudioStatus(mock.db, ACCESS, TASK.itemId, STUDIO_ITEM, status)).resolves.toBe(false);
  });
});

describe("one durable claim per exact revision", () => {
  it("uses the content UUID as the primary key and records actor, class and task", async () => {
    const mock = journalDb();
    await expect(claimContentCheck(mock.db, ACCESS, KEY, TASK)).resolves.toBe(true);
    expect(mock.inserts).toEqual([{ id: KEY, draftId: KEY, checkKind: "checkup_claim", verdict: "checking",
      evidence: { ...TASK, teacherId: TEACHER, classId: CLASS, attemptNumber: 1 } }]);
    expect(mock.conflicts).toHaveLength(1);
    expect(mock.reads()).toBe(0); // no read-then-insert race
  });

  it("parallel teachers cannot both acquire permission to start a paid run", async () => {
    const mock = journalDb();
    const attempts = await Promise.all([
      claimContentCheck(mock.db, ACCESS, KEY, TASK),
      claimContentCheck(mock.db, { ...ACCESS, teacherId: "another-authorized-teacher" }, KEY, TASK),
    ]);
    expect(attempts.filter(Boolean)).toHaveLength(1);
    expect(mock.rows).toHaveLength(1);
  });

  it("a blocked or crashed old claim is never silently reacquired", async () => {
    const mock = journalDb([claim(), row("checkup_sandbox", "blocked", { path: "sandbox/blind-solve" }, 1)]);
    await expect(claimContentCheck(mock.db, ACCESS, KEY, TASK)).resolves.toBe(false);
  });
});

describe("sandbox verdict reads", () => {
  it("without the exact primary-key claim, even a passing event is no hit", async () => {
    const mock = journalDb([row("checkup_sandbox", "passed", { path: "sandbox/blind-solve" })]);
    await expect(readContentCheck(mock.db, ACCESS, KEY)).resolves.toBeNull();
  });

  it("a claim's forged passed verdict, polling handle and note are never trusted", async () => {
    const mock = journalDb([row("checkup_claim", "passed", { sandboxId: "not-a-run", note: "not-a-verdict" })]);
    await expect(readContentCheck(mock.db, ACCESS, KEY)).resolves.toEqual({ status: "checking", attemptId: KEY, attemptNumber: 1, createdAt: mock.rows[0]!.createdAt });
  });

  it("deterministic/legacy checks cannot stand in for a sandbox pass", async () => {
    const mock = journalDb([claim(), row("checkup_deterministic", "passed", { path: "deterministic" }, 1),
      row("checkup_sandbox", "passed", { path: "deterministic" }, 2), row("blind_solve", "correct", {}, 3)]);
    await expect(readContentCheck(mock.db, ACCESS, KEY)).resolves.toMatchObject({ status: "checking" });
  });

  it("returns sanitized content verdicts across authorized teachers and classes", async () => {
    const passed = row("checkup_sandbox", "passed", { path: "sandbox/blind-solve", sandboxId: "sandbox-handle", note: "Correct.", actor: TEACHER, classId: CLASS, detail: { private: "hidden" } }, 1);
    const mock = journalDb([claim(), passed]);
    const other = { scope: classScope(["authorized-other-class"]), classId: "authorized-other-class", teacherId: "authorized-other-teacher" };
    await expect(readContentCheck(mock.db, other, KEY)).resolves.toEqual({ status: "passed", sandboxId: "sandbox-handle", note: "Correct.", attemptId: KEY, attemptNumber: 1, createdAt: mock.rows[0]!.createdAt });
    expect(dialect.sqlToQuery(mock.predicates[0]!).params).toEqual([KEY]);
  });

  it("keeps the polling handle while a real sandbox event is checking", async () => {
    const mock = journalDb([claim(), row("checkup_sandbox", "checking", { path: "sandbox/blind-solve", sandboxId: "poll-this" }, 1)]);
    await expect(readContentCheck(mock.db, ACCESS, KEY)).resolves.toMatchObject({ status: "checking", sandboxId: "poll-this" });
  });

  it("accepts JSON-string evidence from drivers that serialize JSONB columns", async () => {
    const mock = journalDb([claim(), row("checkup_sandbox", "passed", JSON.stringify({ path: "sandbox/blind-solve", note: "Correct." }), 1)]);
    await expect(readContentCheck(mock.db, ACCESS, KEY)).resolves.toMatchObject({ status: "passed", note: "Correct." });
  });

  it.each(["not JSON", "null", "[]", '"nested string"'])("malformed/non-object serialized evidence cannot grant a pass: %s", async (evidence) => {
    const mock = journalDb([claim(), row("checkup_sandbox", "passed", evidence, 1)]);
    await expect(readContentCheck(mock.db, ACCESS, KEY)).resolves.toMatchObject({ status: "checking" });
  });

  it("latest terminal verdict wins, and a late checking event cannot erase it", async () => {
    const mock = journalDb([claim(), row("checkup_sandbox", "passed", { path: "sandbox/blind-solve" }, 1),
      row("checkup_sandbox", "blocked", { path: "sandbox/blind-solve", note: "Key mismatch." }, 2),
      row("checkup_sandbox", "checking", { path: "sandbox/blind-solve" }, 3)]);
    await expect(readContentCheck(mock.db, ACCESS, KEY)).resolves.toMatchObject({ status: "blocked", note: "Key mismatch." });
  });

  it("legacy failed maps to retryable error; unknown verdicts never grant a pass", async () => {
    const mock = journalDb([claim(), row("checkup_sandbox", "failed", { path: "sandbox/blind-solve" }, 1),
      row("checkup_sandbox", "made-up", { path: "sandbox/blind-solve" }, 2)]);
    await expect(readContentCheck(mock.db, ACCESS, KEY)).resolves.toMatchObject({ status: "error" });
  });
});

describe("append-only check events", () => {
  it("fixes sandbox path and actor outside untrusted detail, and never updates", async () => {
    const mock = journalDb();
    await appendContentCheck(mock.db, ACCESS, KEY, { status: "blocked", eventId: EVENT, sandboxId: "run-handle", note: "Wrong key.", evidence: { path: "forged", actor: "forged" } });
    expect(mock.inserts).toEqual([{ id: EVENT, draftId: KEY, checkKind: "checkup_sandbox", verdict: "blocked",
      evidence: { path: "sandbox/blind-solve", actor: TEACHER, classId: CLASS, attemptId: KEY, sandboxId: "run-handle", note: "Wrong key.", detail: { path: "forged", actor: "forged" } } }]);
  });

  it("deduplicates repeated completion polls with a deterministic event id", async () => {
    const mock = journalDb();
    await appendContentCheck(mock.db, ACCESS, KEY, { status: "passed", eventId: EVENT });
    await appendContentCheck(mock.db, ACCESS, KEY, { status: "blocked", eventId: EVENT });
    expect(mock.rows).toHaveLength(1);
    expect(mock.rows[0]!.verdict).toBe("passed");
  });

  it("database failures propagate; no successful publication without a journal", async () => {
    const mock = journalDb([], new Error("offline"));
    await expect(claimContentCheck(mock.db, ACCESS, KEY, TASK)).rejects.toThrow("offline");
    await expect(appendContentCheck(mock.db, ACCESS, KEY, { status: "passed" })).rejects.toThrow("offline");
    await expect(readContentCheck(mock.db, ACCESS, KEY)).rejects.toThrow("offline");
  });
});

describe("retryable infrastructure errors with one claim per attempt", () => {
  const failed = (status = "error") => row("checkup_sandbox", status,
    { path: "sandbox/blind-solve", attemptId: KEY, note: "No verdict available." }, 1);

  it.each(["error", "failed"])("an explicit retry of %s creates a new attributed claim under the unchanged content key", async (status) => {
    const mock = journalDb([claim(), failed(status)]);
    await expect(claimContentCheck(mock.db, ACCESS, KEY, TASK, KEY)).resolves.toBe(true);
    const next = mock.inserts[0]!;
    expect(next.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-8[0-9a-f]{3}-[0-9a-f]{12}$/);
    expect(next.id).not.toBe(KEY);
    expect(next).toMatchObject({ draftId: KEY, checkKind: "checkup_claim", verdict: "checking",
      evidence: { ...TASK, teacherId: TEACHER, classId: CLASS, attemptNumber: 2, parentAttemptId: KEY } });
    await expect(readContentCheck(mock.db, ACCESS, KEY)).resolves.toEqual({
      status: "checking", attemptId: next.id, attemptNumber: 2, createdAt: mock.rows[2]!.createdAt,
    });
  });

  it("an infrastructure error cannot start another run without an explicit retry attempt", async () => {
    const mock = journalDb([claim(), failed()]);
    await expect(claimContentCheck(mock.db, ACCESS, KEY, TASK)).resolves.toBe(false);
    expect(mock.rows).toHaveLength(2);
  });

  it("concurrent teachers can claim only one retry of the same failed attempt", async () => {
    const mock = journalDb([claim(), failed()]);
    const other = { ...ACCESS, teacherId: "synthetic-second-teacher" };
    const attempts = await Promise.all([
      claimContentCheck(mock.db, ACCESS, KEY, TASK, KEY),
      claimContentCheck(mock.db, other, KEY, TASK, KEY),
      claimContentCheck(mock.db, ACCESS, KEY, TASK, KEY),
    ]);
    expect(attempts.filter(Boolean)).toHaveLength(1);
    expect(new Set(mock.inserts.map((entry) => entry.id)).size).toBe(1);
    expect(mock.rows.filter((entry) => entry.checkKind === "checkup_claim")).toHaveLength(2);
    expect(mock.conflicts.every((entry) => (entry as { target: { name: string } }).target.name === "id")).toBe(true);
  });

  it.each(["checking", "passed", "blocked"])("%s cannot be retried even with the right attempt identifier", async (status) => {
    const mock = journalDb([claim(), failed(status)]);
    await expect(claimContentCheck(mock.db, ACCESS, KEY, TASK, KEY)).resolves.toBe(false);
    expect(mock.inserts).toHaveLength(0);
  });

  it("a missing claim or wrong failed-attempt identifier cannot grant a retry", async () => {
    const missing = journalDb([failed()]);
    await expect(claimContentCheck(missing.db, ACCESS, KEY, TASK, KEY)).resolves.toBe(false);
    const wrong = journalDb([claim(), failed()]);
    await expect(claimContentCheck(wrong.db, ACCESS, KEY, TASK, EVENT)).resolves.toBe(false);
    expect(missing.inserts).toHaveLength(0);
    expect(wrong.inserts).toHaveLength(0);
  });

  it("an old retry request cannot acquire a later failed attempt", async () => {
    const mock = journalDb([claim(), failed()]);
    await claimContentCheck(mock.db, ACCESS, KEY, TASK, KEY);
    const secondId = mock.inserts[0]!.id;
    await appendContentCheck(mock.db, ACCESS, KEY, { status: "error", attemptId: secondId });
    await expect(claimContentCheck(mock.db, ACCESS, KEY, TASK, KEY)).resolves.toBe(false);
    await expect(claimContentCheck(mock.db, ACCESS, KEY, TASK, secondId)).resolves.toBe(true);
    const thirdId = mock.inserts.at(-1)!.id;
    expect(thirdId).not.toBe(secondId);
    expect(thirdId).not.toBe(KEY);
    await expect(readContentCheck(mock.db, ACCESS, KEY)).resolves.toMatchObject({ status: "checking", attemptId: thirdId, attemptNumber: 3 });
  });

  it("late original and legacy events cannot complete or poison the active retry", async () => {
    const mock = journalDb([claim(), failed()]);
    await claimContentCheck(mock.db, ACCESS, KEY, TASK, KEY);
    const retryId = mock.inserts[0]!.id;
    await appendContentCheck(mock.db, ACCESS, KEY, { status: "passed", attemptId: KEY });
    mock.rows.push(row("checkup_sandbox", "blocked", { path: "sandbox/blind-solve" }, 59));
    await appendContentCheck(mock.db, ACCESS, KEY, { status: "error", attemptId: "unrelated-attempt" });
    await expect(readContentCheck(mock.db, ACCESS, KEY)).resolves.toMatchObject({ status: "checking", attemptId: retryId });
    await appendContentCheck(mock.db, ACCESS, KEY, { status: "passed", attemptId: retryId });
    await appendContentCheck(mock.db, ACCESS, KEY, { status: "blocked", attemptId: KEY });
    await expect(readContentCheck(mock.db, ACCESS, KEY)).resolves.toMatchObject({ status: "passed", attemptId: retryId });
  });

  it("an unrelated or malformed successor claim cannot suppress an existing model verdict", async () => {
    const mock = journalDb([claim(), row("checkup_sandbox", "passed", { path: "sandbox/blind-solve" }, 1)]);
    mock.rows.push({ ...row("checkup_claim", "checking", { attemptNumber: 2, parentAttemptId: KEY }, 2), id: EVENT });
    await expect(readContentCheck(mock.db, ACCESS, KEY)).resolves.toMatchObject({ status: "passed", attemptId: KEY, attemptNumber: 1 });
  });

  it.each(["wrong parent", "wrong sequence"])("a deterministic successor with %s is ignored", async (defect) => {
    const mock = journalDb([claim(), failed()]);
    await claimContentCheck(mock.db, ACCESS, KEY, TASK, KEY);
    const retry = mock.rows[2]!;
    retry.evidence = { ...retry.evidence as object,
      ...(defect === "wrong parent" ? { parentAttemptId: EVENT } : { attemptNumber: 8 }) };
    await expect(readContentCheck(mock.db, ACCESS, KEY)).resolves.toMatchObject({ status: "error", attemptId: KEY, attemptNumber: 1 });
  });

  it("claim creation time controls timeout even after newer checking events", async () => {
    const mock = journalDb([claim()]);
    await appendContentCheck(mock.db, ACCESS, KEY, { status: "checking", sandboxId: "batch-handle", batch: true });
    await expect(readContentCheck(mock.db, ACCESS, KEY)).resolves.toMatchObject({
      status: "checking", sandboxId: "batch-handle", batch: true, createdAt: mock.rows[0]!.createdAt,
    });
    expect(mock.rows[1]!.createdAt.getTime()).toBeGreaterThan(mock.rows[0]!.createdAt.getTime());
  });

  it("a late infrastructure error cannot erase a recorded model verdict", async () => {
    const mock = journalDb([claim(), row("checkup_sandbox", "passed", { path: "sandbox/blind-solve" }, 1), failed()]);
    await appendContentCheck(mock.db, ACCESS, KEY, { status: "error" });
    await expect(readContentCheck(mock.db, ACCESS, KEY)).resolves.toMatchObject({ status: "passed" });
    await expect(claimContentCheck(mock.db, ACCESS, KEY, TASK, KEY)).resolves.toBe(false);
  });

  it("retry metadata survives serialized JSONB driver evidence", async () => {
    const mock = journalDb([claim(), failed()]);
    await claimContentCheck(mock.db, ACCESS, KEY, TASK, KEY);
    const retryId = mock.inserts[0]!.id;
    await appendContentCheck(mock.db, ACCESS, KEY, { status: "passed", attemptId: retryId, batch: true });
    for (const entry of mock.rows) entry.evidence = JSON.stringify(entry.evidence);
    await expect(readContentCheck(mock.db, ACCESS, KEY)).resolves.toMatchObject({ status: "passed", attemptId: retryId, attemptNumber: 2, batch: true });
  });

  it("nested evidence cannot replace attempt, batch, actor or content attribution", async () => {
    const mock = journalDb();
    await appendContentCheck(mock.db, ACCESS, KEY, { status: "error", attemptId: EVENT, batch: false,
      evidence: { attemptId: KEY, batch: true, actor: "forged", classId: "forged" } });
    expect(mock.inserts[0]).toMatchObject({ draftId: KEY, verdict: "error", evidence: {
      path: "sandbox/blind-solve", attemptId: EVENT, batch: false, actor: TEACHER, classId: CLASS,
      detail: { attemptId: KEY, batch: true, actor: "forged", classId: "forged" },
    } });
  });
});

describe("shared batch lifetime membership", () => {
  const members = [{ key: KEY, attemptId: KEY }, { key: CLASS, attemptId: EVENT }];

  it("persists protected shared members and returns only their content and attempt identifiers", async () => {
    const mock = journalDb([claim()]);
    await appendContentCheck(mock.db, ACCESS, KEY, { status: "checking", batch: true, sandboxId: "shared-handle",
      batchMembers: members, evidence: { batchMembers: [{ key: "forged", attemptId: "forged" }] } });
    expect(mock.inserts[0]!.evidence).toMatchObject({ batchMembers: members,
      detail: { batchMembers: [{ key: "forged", attemptId: "forged" }] } });
    const event = mock.rows[1]!;
    event.evidence = JSON.stringify({ ...event.evidence as object,
      batchMembers: members.map((member) => ({ ...member, actor: "private", studentName: "must-not-leave-journal" })) });
    const result = await readContentCheck(mock.db, ACCESS, KEY);
    expect(result?.batchMembers).toEqual(members);
    expect(JSON.stringify(result)).not.toContain("private");
    expect(JSON.stringify(result)).not.toContain("studentName");
  });

  it.each([
    ["missing", undefined], ["null", null], ["not array", {}], ["empty", []],
    ["too many", Array.from({ length: 21 }, () => ({ key: KEY, attemptId: KEY }))],
    ["null member", [null]], ["array member", [[]]], ["string member", [JSON.stringify(members[0])]],
    ["missing key", [{ attemptId: KEY }]], ["non-string key", [{ key: 5, attemptId: KEY }]],
    ["invalid key", [{ key: "not-a-uuid", attemptId: KEY }]],
    ["missing attempt", [{ key: KEY }]], ["non-string attempt", [{ key: KEY, attemptId: 5 }]],
    ["invalid attempt", [{ key: KEY, attemptId: "not-a-uuid" }]],
  ])("ignores %s shared-member metadata instead of authorizing early batch shutdown", async (_reason, batchMembers) => {
    const mock = journalDb([claim(), row("checkup_sandbox", "checking", { path: "sandbox/blind-solve", batch: true, batchMembers }, 1)]);
    const result = await readContentCheck(mock.db, ACCESS, KEY);
    expect(result).toMatchObject({ status: "checking", batch: true });
    expect(result).not.toHaveProperty("batchMembers");
  });

  it("accepts exactly twenty UUID members and never exposes membership from a claim or terminal event", async () => {
    const twenty = Array.from({ length: 20 }, () => ({ key: KEY, attemptId: KEY }));
    const mock = journalDb([claim(), row("checkup_sandbox", "checking", { path: "sandbox/blind-solve", batchMembers: twenty }, 1)]);
    await expect(readContentCheck(mock.db, ACCESS, KEY)).resolves.toMatchObject({ batchMembers: twenty });
    await appendContentCheck(mock.db, ACCESS, KEY, { status: "passed", batchMembers: members });
    expect(await readContentCheck(mock.db, ACCESS, KEY)).not.toHaveProperty("batchMembers");
    const forgedClaim = journalDb([row("checkup_claim", "checking", { batchMembers: members })]);
    expect(await readContentCheck(forgedClaim.db, ACCESS, KEY)).not.toHaveProperty("batchMembers");
  });

  it("old attempt membership cannot replace the shared membership of an active retry", async () => {
    const mock = journalDb([claim()]);
    await appendContentCheck(mock.db, ACCESS, KEY, { status: "error" });
    await claimContentCheck(mock.db, ACCESS, KEY, TASK, KEY);
    const retryId = (await readContentCheck(mock.db, ACCESS, KEY))!.attemptId!;
    const retryMembers = [{ key: KEY, attemptId: retryId }];
    await appendContentCheck(mock.db, ACCESS, KEY, { status: "checking", attemptId: retryId, batchMembers: retryMembers });
    await appendContentCheck(mock.db, ACCESS, KEY, { status: "checking", attemptId: KEY, batchMembers: members });
    await expect(readContentCheck(mock.db, ACCESS, KEY)).resolves.toMatchObject({ batchMembers: retryMembers, attemptId: retryId });
  });
});

describe("private server-issued checkup workflow origin", () => {
  const workflow = (evidence: unknown = { actor: TEACHER, classId: CLASS }): Row => ({
    ...row("checkup_workflow", "manual", evidence), id: KEY, draftId: KEY,
  });
  const automatic = (composition = COMPOSITION, second = 1) => row("checkup_composition", "composed",
    { ...composition, actor: TEACHER, classId: CLASS }, second);
  const workflowRead = (events: Row[]) => journalDb([], undefined, [[workflow()], events]);

  it("starts each new manual workflow with its own server UUID and attribution", async () => {
    const mock = journalDb();
    const first = await beginCheckupWorkflow(mock.db, ACCESS);
    const second = await beginCheckupWorkflow(mock.db, ACCESS);
    expect(first).toMatch(/^[0-9a-f-]{36}$/);
    expect(second).not.toBe(first);
    expect(mock.rows).toHaveLength(2);
    expect(mock.rows[0]).toMatchObject({ id: first, draftId: first, checkKind: "checkup_workflow", verdict: "manual",
      evidence: { actor: TEACHER, classId: CLASS } });
    expect(mock.reads()).toBe(0);
  });

  it("a new manual workflow has no automatic gate even if those items were used before", async () => {
    const mock = workflowRead([]);
    await expect(readCheckupComposition(mock.db, ACCESS, KEY)).resolves.toEqual({ unitSlug: "", seed: "", itemIds: [], automatic: false });
    const query = dialect.sqlToQuery(mock.predicates[1]!);
    expect(query.params).toEqual([KEY, "checkup_composition", "composed", TEACHER, CLASS]);
    expect(query.sql).toContain('"draft_id"');
    expect(query.sql).not.toContain("itemIds");
  });

  it("records append-only automatic events under the owned workflow, never resets it", async () => {
    const initial = workflow();
    const mock = journalDb([initial]);
    await recordCheckupComposition(mock.db, ACCESS, KEY, COMPOSITION);
    await recordCheckupComposition(mock.db, ACCESS, KEY, { ...COMPOSITION, seed: "changed" });
    expect(mock.rows).toHaveLength(3);
    expect(mock.rows[0]).toEqual(initial);
    expect(new Set(mock.rows.map((entry) => entry.id)).size).toBe(3);
    expect(mock.rows[1]).toMatchObject({ draftId: KEY, checkKind: "checkup_composition", verdict: "composed",
      evidence: { ...COMPOSITION, actor: TEACHER, classId: CLASS } });
    expect(mock.rows[2]).toMatchObject({ draftId: KEY, checkKind: "checkup_composition", verdict: "composed",
      evidence: { ...COMPOSITION, seed: "changed", actor: TEACHER, classId: CLASS } });
  });

  it("requires workflow id, workflow kind, teacher AND class before reading automatic events", async () => {
    const mock = workflowRead([automatic()]);
    await expect(readCheckupComposition(mock.db, ACCESS, KEY)).resolves.toEqual({ ...COMPOSITION, automatic: true });
    const query = dialect.sqlToQuery(mock.predicates[0]!);
    expect(query.params).toEqual([KEY, KEY, "checkup_workflow", "manual", TEACHER, CLASS]);
    expect(query.sql).toContain("->>'actor'");
    expect(query.sql).toContain("->>'classId'");
    expect(dialect.sqlToQuery(mock.predicates[1]!).params).toEqual([KEY, "checkup_composition", "composed", TEACHER, CLASS]);
  });

  it("returns the latest automatic composition without exposing actor/class", async () => {
    const latest = { ...COMPOSITION, seed: "latest", itemIds: ["changed-item"] };
    const mock = workflowRead([automatic(COMPOSITION, 1), automatic(latest, 2)]);
    await expect(readCheckupComposition(mock.db, ACCESS, KEY)).resolves.toEqual({ ...latest, automatic: true });
  });

  it("reads owned workflow and automatic events when both JSONB values arrive as strings", async () => {
    const mock = journalDb([], undefined, [[workflow(JSON.stringify({ actor: TEACHER, classId: CLASS }))], [
      row("checkup_composition", "composed", JSON.stringify({ ...COMPOSITION, actor: TEACHER, classId: CLASS })),
    ]]);
    await expect(readCheckupComposition(mock.db, ACCESS, KEY)).resolves.toEqual({ ...COMPOSITION, automatic: true });
  });

  it("unknown or stripped workflow ids cannot create automatic provenance", async () => {
    const mock = journalDb();
    await expect(recordCheckupComposition(mock.db, ACCESS, KEY, COMPOSITION)).rejects.toThrow(/workflow not owned/);
    expect(mock.inserts).toHaveLength(0);
    await expect(readCheckupComposition(mock.db, ACCESS, KEY)).resolves.toBeNull();
    expect(mock.reads()).toBe(2); // each stops after its missing workflow lookup
  });

  it.each([
    { actor: "other-teacher", classId: CLASS },
    { actor: TEACHER, classId: "other-class" },
    {},
  ])("foreign/malformed workflow ownership fails closed %#", async (evidence) => {
    const mock = journalDb([workflow(evidence)]);
    await expect(recordCheckupComposition(mock.db, ACCESS, KEY, COMPOSITION)).rejects.toThrow(/workflow not owned/);
    await expect(readCheckupComposition(mock.db, ACCESS, KEY)).resolves.toBeNull();
    expect(mock.inserts).toHaveLength(0);
    expect(mock.reads()).toBe(2);
  });

  it.each([
    { ...COMPOSITION, actor: "other-teacher", classId: CLASS },
    { ...COMPOSITION, actor: TEACHER, classId: "other-class" },
    { ...COMPOSITION, actor: TEACHER, classId: CLASS, itemIds: [1] },
    { ...COMPOSITION, actor: TEACHER, classId: CLASS, seed: null },
  ])("malformed automatic evidence blocks instead of downgrading to manual %#", async (evidence) => {
    const mock = workflowRead([row("checkup_composition", "composed", evidence)]);
    await expect(readCheckupComposition(mock.db, ACCESS, KEY)).resolves.toBeNull();
  });
});
