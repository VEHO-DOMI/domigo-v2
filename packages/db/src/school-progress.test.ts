import { describe, expect, it } from "vitest";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema.ts";
import type { Db } from "./index.ts";
import { recordAttempt, type RecordAttemptInput } from "./persist.ts";
import { getSolvedGameItemIds } from "./game-progress.ts";
import { classScope } from "./scope.ts";
function recorder(inserted = true) {
  const log: { sql: string; params: unknown[] }[] = [];
  const client = (sql: string, params: unknown[]) => {
    log.push({ sql, params });
    return Promise.resolve({ rows: sql.startsWith('insert') && sql.includes('"practice_attempts"') && inserted ? [["attempt"]] : [], rowCount: 0, fields: [] });
  };
  return { log, db: drizzle(client as never, { schema }) as unknown as Db };
}
const input: RecordAttemptInput = { userId: "00000000-0000-4000-8000-000000000001", classId: "00000000-0000-4000-8000-000000000002", itemId: "g2.st.ink-ghost-goes-to-school.ch01.verdacht", kind: "grammar", unitSlug: "g2-u01", grade: 2, mode: "game:g2", tier: "correct", xpAwarded: 10, clientAttemptId: "00000000-0000-4000-8000-000000000003", reviewContext: "story" };
describe("school ledger integration with the actual SQL driver", () => {
  it("requires a fully correct school attempt while preserving existing game defaults", async () => {
    const a = recorder(); await getSolvedGameItemIds(a.db, input.userId, 2, true);
    expect(a.log[0]!.sql).toContain('"tier" =');
    expect(a.log[0]!.params).toEqual([input.userId, 2, "game:g2", "correct"]);
    const b = recorder(); await getSolvedGameItemIds(b.db, input.userId, 2);
    expect(b.log[0]!.sql).toContain('"tier" <>');
    expect(b.log[0]!.params).toEqual([input.userId, 2, "game:g2", "wrong"]);
  });
  it("saves story attempts and XP without enqueueing unrenderable unit-review cards", async () => {
    const a = recorder(); await recordAttempt(a.db, classScope([input.classId]), input);
    const inserts = a.log.filter(x => x.sql.startsWith("insert"));
    expect(inserts.some(x => x.sql.includes('"practice_attempts"'))).toBe(true);
    expect(inserts.some(x => x.sql.includes('"user_progress"'))).toBe(true);
    expect(inserts.some(x => x.sql.includes('"review_queue"'))).toBe(false);
    const b = recorder(); await recordAttempt(b.db, classScope([input.classId]), { ...input, reviewContext: "unit" });
    expect(b.log.some(x => x.sql.startsWith("insert") && x.sql.includes('"review_queue"'))).toBe(true);
  });
  it("does not reward duplicate requests", async () => {
    const a = recorder(false); const result = await recordAttempt(a.db, classScope([input.classId]), input);
    expect(result.duplicate).toBe(true);
    expect(a.log.filter(x => x.sql.startsWith("insert"))).toHaveLength(1);
  });
  it("rejects missing or foreign class scope before any school write", async () => {
    for (const ids of [[], ["00000000-0000-4000-8000-000000000099"]]) {
      const a = recorder();
      await expect(recordAttempt(a.db, classScope(ids), input)).rejects.toThrow(/scope/);
      expect(a.log).toHaveLength(0);
    }
  });
});
