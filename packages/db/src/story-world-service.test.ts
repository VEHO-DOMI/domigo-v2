import { describe, expect, it } from "vitest";
import { drizzle } from "drizzle-orm/neon-http";
import type { Db } from "./index.ts";
import * as schema from "./schema.ts";
import { classScope, EMPTY_SCOPE } from "./scope.ts";
import { listStoryWorldGrades, listStoryWorldSettings, setStoryWorld, StoryWorldForbiddenError } from "./story-world-service.ts";

const OWN = "aaaaaaaa-0000-4000-8000-000000000001";
const FOREIGN = "bbbbbbbb-0000-4000-8000-000000000002";
const scope = classScope([OWN]);

/** Real Drizzle SQL, synthetic transport only: no database connection. */
function storage() {
  const log: { sql: string; params: unknown[] }[] = [];
  const settings = new Map<number, boolean>();
  let broken = false;
  const client = (sql: string, params: unknown[]) => {
    log.push({ sql, params });
    if (broken) return Promise.reject(new Error("synthetic outage"));
    let rows: unknown[][] = [];
    if (sql.startsWith("insert into")) {
      settings.set(Number(params[0]), Boolean(params[1]));
    } else if (sql.includes('"story_world_settings"')) {
      rows = [...settings];
    } else {
      // A lost SQL scope really exposes the foreign year in this transport.
      const classes = sql.includes('"domigo_v2"')
        ? [{ id: OWN, grade: 1 }, { id: FOREIGN, grade: 4 }] : [{ id: OWN, grade: 2 }];
      rows = classes.filter((c) => !sql.includes("where") || (!sql.includes("false") && params.includes(c.id)))
        .map((c) => [c.grade]);
    }
    return Promise.resolve({ rows, rowCount: rows.length, fields: [] });
  };
  return { db: drizzle(client as never, { schema }) as Db, log, settings, fail: () => { broken = true; } };
}

describe("story-world service", () => {
  it("reads only global grade/state pairs and round-trips open → parked → open", async () => {
    const { db, log } = storage();
    expect(await listStoryWorldSettings(db)).toEqual([]);
    for (const isOpen of [true, false, true]) {
      await setStoryWorld(db, scope, "teacher", 1, isOpen);
      expect(await listStoryWorldSettings(db)).toEqual([{ grade: 1, isOpen }]);
    }
    const writes = log.filter((q) => /^(insert|update|delete)/.test(q.sql));
    expect(writes).toHaveLength(3);
    for (const q of writes) {
      expect(q.sql).toMatch(/^insert into "domigo_v2"\."story_world_settings"/);
      expect(q.sql).toContain("on conflict");
      expect(q.sql).not.toMatch(/game_saves|practice_attempts|user_progress/);
    }
    expect(log.filter((q) => q.sql.startsWith("select")).every((q) => !q.sql.includes('"name"'))).toBe(true);
  });

  it("scopes both current and legacy classes before resolving editable years", async () => {
    const { db, log } = storage();
    expect(await listStoryWorldGrades(db, scope)).toEqual([1, 2]);
    expect(log).toHaveLength(2);
    for (const q of log) {
      expect(q.sql).toMatch(/where \("(?:domigo_v2"\.")?classes"\."id" in \(\$1\) and .*"archived_at" is null\)/);
      expect(q.params).toEqual([OWN]);
    }
  });

  it("an empty scope reads no years and cannot write", async () => {
    const { db, log } = storage();
    expect(await listStoryWorldGrades(db, EMPTY_SCOPE)).toEqual([]);
    expect(log.every((q) => q.sql.includes("where (false and"))).toBe(true);
    log.length = 0;
    await expect(setStoryWorld(db, EMPTY_SCOPE, "teacher", 1, true)).rejects.toThrow(StoryWorldForbiddenError);
    expect(log).toHaveLength(0);
  });

  it("a child cannot write even with the right class scope", async () => {
    const { db, log } = storage();
    await expect(setStoryWorld(db, scope, "student", 1, true)).rejects.toThrow(StoryWorldForbiddenError);
    expect(log).toHaveLength(0);
  });

  it("a teacher cannot switch a year outside their class scope", async () => {
    const { db, log } = storage();
    await expect(setStoryWorld(db, scope, "teacher", 4, true)).rejects.toThrow(StoryWorldForbiddenError);
    expect(log.some((q) => q.sql.startsWith("insert"))).toBe(false);
  });

  it("invalid grades or state never reach storage", async () => {
    const { db, log } = storage();
    for (const grade of [0, 5, 1.5, NaN]) {
      await expect(setStoryWorld(db, scope, "teacher", grade, true)).rejects.toThrow(TypeError);
    }
    await expect(setStoryWorld(db, scope, "teacher", 1, "open" as never)).rejects.toThrow(TypeError);
    expect(log).toHaveLength(0);
  });

  it("storage failure never masquerades as a saved setting", async () => {
    const f = storage();
    f.fail();
    await expect(listStoryWorldSettings(f.db)).rejects.toThrow();
    await expect(setStoryWorld(f.db, scope, "teacher", 1, true)).rejects.toThrow();
    expect(f.settings.size).toBe(0);
  });
});
