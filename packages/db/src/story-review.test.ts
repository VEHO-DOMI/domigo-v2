import { describe, expect, it } from "vitest";
import { drizzle } from "drizzle-orm/neon-http";
import type { Db } from "./index.ts";
import * as schema from "./schema.ts";
import { recordAttempt, type RecordAttemptInput } from "./persist.ts";
import {
  getDueCounts,
  getDueRefs,
  getDueStoryCount,
  getDueStoryRefs,
  type DueScope,
  type StoryReviewScope,
} from "./review.ts";
import { classScope } from "./scope.ts";

type Query = { sql: string; params: unknown[] };

/** Real Drizzle SQL compilation, fake transport: these tests never open a DB. */
function recorder(options: { duplicate?: boolean; reserved?: string[]; count?: number } = {}) {
  const log: Query[] = [];
  const client = (sql: string, params: unknown[]) => {
    log.push({ sql, params });
    let rows: unknown[][] = [];
    if (sql.startsWith("insert") && sql.includes('"practice_attempts"') && !options.duplicate) rows = [["attempt"]];
    if (sql.startsWith("insert") && sql.includes('"review_queue"')) rows = [["queue", params[5]]];
    if (sql.startsWith("select") && sql.includes('"reserved_items"')) rows = (options.reserved ?? []).map((id) => [id]);
    if (sql.startsWith("select count(*)")) rows = [[options.count ?? 0]];
    return Promise.resolve({ rows, rowCount: rows.length, fields: [] });
  };
  return { log, db: drizzle(client as never, { schema }) as unknown as Db };
}

const now = new Date("2026-10-08T12:00:00.000Z");
const userId = "00000000-0000-4000-8000-000000000001";
const classId = "00000000-0000-4000-8000-000000000002";
const itemId = "g3u02.ci.reading-for-camera.gf.001";
const otherItemId = "g3u12.ci.stop-the-camera.gf.001";
const unitItemId = "g3u02.gi.past-continuous.ec.001";
const storyScope: StoryReviewScope = { storyId: "g3.st.fourteen", itemIds: [itemId, otherItemId] };
const attempt: RecordAttemptInput = {
  userId, classId, itemId, kind: "grammar", unitSlug: "g3-u02", grade: 3,
  mode: "game:g3", tier: "correct", xpAwarded: 10,
  clientAttemptId: "00000000-0000-4000-8000-000000000003", reviewContext: "story",
};

function insert(log: Query[], table: string): Query | undefined {
  return log.find((q) => q.sql.startsWith("insert") && q.sql.includes(`"${table}"`));
}

/** Map INSERT placeholders back to column names, avoiding brittle param offsets. */
function insertedValues(query: Query): Record<string, unknown> {
  const match = /\(([^)]+)\) values \(([^)]+)\)/.exec(query.sql);
  if (!match) throw new Error("Expected a compiled INSERT with named columns");
  const columns = match[1]!.split(",").map((s) => s.trim().replaceAll('"', ""));
  const values = match[2]!.split(",").map((s) => s.trim());
  return Object.fromEntries(columns.map((column, index) => {
    const parameter = /^\$(\d+)$/.exec(values[index]!);
    return [column, parameter ? query.params[Number(parameter[1]) - 1] : values[index]];
  }));
}

function queueSelect(log: Query[]): Query {
  const query = log.find((q) => q.sql.startsWith("select") && q.sql.includes('"review_queue"'));
  if (!query) throw new Error("Expected a review queue query");
  return query;
}

describe("story grammar persistence uses the shared queue and XP pool", () => {
  it("queues a correct .ci. attempt and advances its due time using normal Leitner policy", async () => {
    const { db, log } = recorder();
    await recordAttempt(db, classScope([classId]), attempt);
    const queued = insertedValues(insert(log, "review_queue")!);
    expect(queued).toMatchObject({ item_id: itemId, kind: "grammar", unit_slug: "g3-u02", grade: 3, box: 2 });
    const progress = insertedValues(insert(log, "user_progress")!);
    expect(progress).toMatchObject({ xp: 0, grammar_xp: 10 });
    expect(log.some((q) => q.sql.startsWith('update "domigo_v2"."review_queue"'))).toBe(true);
  });

  it("queues wrong .ci. grammar with zero XP, deriving its story context from ID", async () => {
    const { db, log } = recorder();
    await recordAttempt(db, classScope([classId]), { ...attempt, reviewContext: undefined, tier: "wrong", xpAwarded: 0 });
    expect(insertedValues(insert(log, "review_queue")!)).toMatchObject({ item_id: itemId, box: 1, last_tier: "wrong", lapses: 1 });
    expect(insertedValues(insert(log, "user_progress")!)).toMatchObject({ xp: 0, grammar_xp: 0 });
  });

  it("keeps reading and legacy scene-only items out of the queue", async () => {
    for (const change of [{ kind: "reading" as const }, { itemId: "g2.st.ink-ghost-goes-to-school.ch01.verdacht" }]) {
      const { db, log } = recorder();
      await recordAttempt(db, classScope([classId]), { ...attempt, ...change });
      expect(insert(log, "review_queue")).toBeUndefined();
    }
  });

  it("does not update queue, XP or streak on a duplicate client attempt ID", async () => {
    const { db, log } = recorder({ duplicate: true });
    const result = await recordAttempt(db, classScope([classId]), attempt);
    expect(result.duplicate).toBe(true);
    expect(log.filter((q) => q.sql.startsWith("insert"))).toHaveLength(1);
    expect(log.some((q) => q.sql.startsWith("update"))).toBe(false);
  });
});

describe("unit review excludes story cards in SQL before LIMIT", () => {
  it.each<DueScope>([{ kind: "unit", slug: "g3-u02" }, { kind: "grade", grade: 3 }, { kind: "all" }])("filters $kind scope without consuming its page", async (scope) => {
    const { db, log } = recorder({ reserved: [unitItemId] });
    await getDueRefs(db, userId, classId, scope, 1, now);
    const query = queueSelect(log);
    expect(query.sql).toMatch(/"item_id" not like \$\d+.*order by.*limit/s);
    expect(query.sql).toContain('"user_id" =');
    expect(query.sql).toContain('"due_at" <=');
    expect(query.sql).toContain('"item_id" not in');
    expect(query.params).toContain("%.ci.%");
    expect(query.params).toContain(userId);
    expect(query.params).toContain(now.toISOString());
    expect(query.params).toContain(unitItemId);
    expect(query.params.at(-1)).toBe(1);
    if (scope.kind === "unit") expect(query.params).toContain(scope.slug);
    if (scope.kind === "grade") expect(query.params).toContain(scope.grade);
    expect(log[0]!.params).toEqual([classId, true]);
  });

  it("excludes .ci. from unit counts too, so the review door cannot overpromise", async () => {
    const { db, log } = recorder({ reserved: [unitItemId] });
    expect(await getDueCounts(db, userId, classId, now)).toEqual({ total: 0, vocab: 0, grammar: 0, byGrade: {} });
    const query = queueSelect(log);
    expect(query.sql).toContain('"item_id" not like');
    expect(query.sql).toContain('"item_id" not in');
    expect(query.params).toContain("%.ci.%");
    expect(query.params).toContain(unitItemId);
  });
});

describe("story due readers use exact story membership", () => {
  it("restricts refs to due grammar, exact story IDs, user and the class reservation filter", async () => {
    const { db, log } = recorder({ reserved: [otherItemId] });
    await getDueStoryRefs(db, userId, classId, { ...storyScope, itemIds: [...storyScope.itemIds, itemId, unitItemId] }, 7, now);
    const query = queueSelect(log);
    expect(query.sql).toContain('"user_id" =');
    expect(query.sql).toContain('"due_at" <=');
    expect(query.sql).toContain('"kind" =');
    expect(query.sql).toContain('"item_id" in');
    expect(query.sql).toContain('"item_id" not in');
    expect(query.sql).toMatch(/order by .*"due_at" asc, .*"item_id" asc limit/);
    expect(query.params).toEqual([userId, now.toISOString(), "grammar", itemId, otherItemId, otherItemId, 7]);
    expect(log[0]!.params).toEqual([classId, true]);
    expect(query.params).not.toContain(unitItemId);
  });

  it("uses an uncapped count with exactly the same eligibility as the refs", async () => {
    const refs = recorder({ reserved: [otherItemId] });
    const counts = recorder({ reserved: [otherItemId], count: 137 });
    await getDueStoryRefs(refs.db, userId, classId, storyScope, 20, now);
    expect(await getDueStoryCount(counts.db, userId, classId, storyScope, now)).toBe(137);
    const refQuery = queueSelect(refs.log);
    const countQuery = queueSelect(counts.log);
    expect(countQuery.sql).not.toContain("limit");
    expect(countQuery.sql.split(" where ")[1]).toBe(refQuery.sql.split(" where ")[1]!.split(" order by ")[0]);
    expect(countQuery.params).toEqual(refQuery.params.slice(0, -1));
  });

  it("returns empty without querying when there is no story or eligible source scene", async () => {
    for (const scope of [{ storyId: "", itemIds: [itemId] }, { ...storyScope, itemIds: [] }, { ...storyScope, itemIds: [unitItemId] }]) {
      const { db, log } = recorder();
      expect(await getDueStoryRefs(db, userId, classId, scope)).toEqual([]);
      expect(await getDueStoryCount(db, userId, classId, scope)).toBe(0);
      expect(log).toHaveLength(0);
    }
  });
});
