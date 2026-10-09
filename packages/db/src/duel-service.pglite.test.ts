/** cgo-112 · Real local PostgreSQL, synthetic identities only, no network. */
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { eq } from "drizzle-orm";
import type { Db } from "./index.ts";
import * as schema from "./schema.ts";
import { classScope } from "./scope.ts";
import { arenaEnabled, createDuel, expire, getDuel, listDuels, openRound, recordAnswer, runDuelTransaction, validateDuelAnswer } from "./duel-service.ts";
import { deleteUserData } from "./konto-loeschung.ts";
import { loadUnit } from "../../content-loader/src/index.ts";
import { gradeVocab, xpForTier } from "@domigo/engine";
const uuid = (n: number) => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
const A = uuid(101), B = uuid(102), ME = uuid(1), PEER = uuid(2), OTHER = uuid(3), FOURTH = uuid(4), OUTSIDE = uuid(5), PLACEHOLDER = uuid(6), TEACHER = uuid(99);
const at = new Date("2026-10-09T08:00:00Z"), scope = classScope([A]), pg = new PGlite();
const database = drizzle(pg, { schema }), db = database as unknown as Db;
const transport = vi.hoisted(() => ({ database: null as unknown, connects: 0, closes: 0 }));
vi.mock("@neondatabase/serverless", () => ({ Client: class { async connect() { transport.connects++; } async end() { transport.closes++; } } }));
vi.mock("drizzle-orm/neon-serverless", () => ({ drizzle: () => transport.database }));
const tx = <T>(work: (db: Db) => Promise<T>) => runDuelTransaction(work);
const pool = [1, 2, 3, 4, 5].flatMap(chapter => loadUnit(`g1-u0${chapter}`).vocab);
const arena = (user = ME) => listDuels(db, scope, user, at);
async function create(user = ME, peer = 1) {
  const board = await arena(user);
  return tx(d => createDuel(d, scope, user, peer, board.rosterVersion, at));
}
async function open(id: string, user = ME, chapter = "g1-u01") { return tx(d => openRound(d, scope, user, id, chapter, pool, at)); }
async function answer(id: string, user: string, right = true, clientAttemptId = crypto.randomUUID()) {
  const view = await getDuel(db, scope, user, id, at), next = view.next!;
  const item = pool.find(i => i.id === next.itemId)!;
  const choice = next.options.find(o => (gradeVocab(item, o, "deToEn").tier === "correct") === right)!;
  const tier = gradeVocab(item, choice, "deToEn").tier;
  const context = { duelId: id, round: next.round, question: next.question };
  const attempt = { userId: user, classId: A, itemId: next.itemId, kind: "vocab" as const, unitSlug: `g1-u${item.id.slice(3, 5)}`, grade: 1, mode: `duel:${id}`, tier, xpAwarded: xpForTier(item.difficulty * 10, tier), clientAttemptId };
  const result = await tx(d => recordAnswer(d, scope, attempt, context, choice, at));
  return { result, attempt, context, choice };
}
beforeAll(async () => {
  transport.database = database;
  vi.stubEnv("DATABASE_URL", "postgres://synthetic-local-only/unused");
  const snapshot = JSON.parse(readFileSync(new URL("../drizzle/meta/0023_snapshot.json", import.meta.url), "utf8"));
  await pg.exec("CREATE SCHEMA domigo_v2");
  type Col = { name: string; type: string; primaryKey: boolean; notNull: boolean; default?: unknown };
  type Index = { name: string; isUnique: boolean; where?: string; columns: { expression: string; isExpression: boolean; asc: boolean }[] };
  for (const name of Object.keys(snapshot.tables).map(name => name.replace("domigo_v2.", ""))) {
    const table = snapshot.tables[`domigo_v2.${name}`];
    const columns = Object.values(table.columns as Record<string, Col>).map(c => `"${c.name}" ${c.type}${c.primaryKey ? " PRIMARY KEY" : ""}${c.notNull ? " NOT NULL" : ""}${"default" in c ? ` DEFAULT ${c.default}` : ""}`);
    const checks = Object.values(table.checkConstraints as Record<string, { name: string; value: string }>).map(c => `CONSTRAINT "${c.name}" CHECK (${c.value})`);
    await pg.exec(`CREATE TABLE "domigo_v2"."${name}" (${[...columns, ...checks].join(",")})`);
    for (const idx of Object.values(table.indexes) as Index[]) await pg.exec(`CREATE ${idx.isUnique ? "UNIQUE " : ""}INDEX "${idx.name}" ON "domigo_v2"."${name}" (${idx.columns.map(c => `${c.isExpression ? c.expression : `"${c.expression}"`}${c.asc ? "" : " DESC"}`).join(",")})${idx.where ? ` WHERE ${idx.where}` : ""}`);
  }
  // Execute the actual additive migration only in PGlite memory, never Neon.
  await pg.exec(readFileSync(new URL("../drizzle/0024_word_duels.sql", import.meta.url), "utf8"));
  for (const id of [A, B]) {
    await db.insert(schema.v2Classes).values({ id, name: "Synthetic class", grade: 1, teacherId: TEACHER, inviteCode: id.slice(-6) });
    await db.insert(schema.classSettings).values({ classId: id, purpose: "regular", leaderboard: true, gradeBoardOptIn: true });
  }
  for (const [id, classId, claimed] of [[ME, A, true], [PEER, A, true], [OTHER, A, true], [FOURTH, A, true], [OUTSIDE, B, true], [PLACEHOLDER, A, false], [TEACHER, A, true]] as const) {
    await db.insert(schema.v2IdentityUsers).values({ id, classId, role: id === TEACHER ? "teacher" : "student", givenName: `Example ${id.slice(-1)} Invented`, displayName: `Synthetic ${id.slice(-2)}`, pinHash: "synthetic-unused", claimedAt: claimed ? at : null, createdAt: at });
    await db.insert(schema.studentProfile).values({ userId: id, avatar: 1 });
  }
}, 30000);
beforeEach(async () => {
  await db.insert(schema.v2IdentityUsers).values({ id: ME, classId: A, role: "student", displayName: "Synthetic 01", givenName: "Example Invented", pinHash: "unused", claimedAt: at, createdAt: at }).onConflictDoNothing();
  await pg.exec("TRUNCATE domigo_v2.duels, domigo_v2.practice_attempts, domigo_v2.review_queue, domigo_v2.user_progress, domigo_v2.reserved_items");
  await pg.exec("UPDATE domigo_v2.class_settings SET purpose='regular', leaderboard=true; UPDATE domigo_v2.classes SET archived_at=null, grade=1");
  await pg.query("UPDATE domigo_v2.users SET claimed_at=$1, class_id=$2 WHERE id IN ($3,$4,$5,$6)", [at.toISOString(), A, ME, PEER, OTHER, FOURTH]);
});
afterAll(async () => { await pg.close(); vi.unstubAllEnvs(); });

describe("PostgreSQL duel contracts", () => {
  it("D09 claimed own-class roster only, first-name rule, sequential numbers, no roster UUID", async () => {
    const b = await arena();
    expect(b.enabled).toBe(true); expect(b.peers.map(p => p.number)).toEqual([1, 2, 3]);
    expect(b.peers[0]!.name).toBe("Example (Synthetic 02)");
    expect(JSON.stringify(b)).not.toMatch(/[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}/);
    expect(await arena(PLACEHOLDER)).toMatchObject({ enabled: false, peers: [] });
    expect(await arena(TEACHER)).toMatchObject({ enabled: false, peers: [] });
  });
  it("D10 same pair is unique, including reversed challenge; completed pair may start again", async () => {
    const id = await create();
    await expect(create(PEER)).rejects.toMatchObject({ status: 409 });
    await expect(create()).rejects.toMatchObject({ status: 409 });
    await db.update(schema.duels).set({ status: "complete" }).where(eq(schema.duels.id, id));
    expect(await create()).not.toBe(id);
    expect(await create(ME, 2)).toBeTruthy();
  });
  it("D11 foreign class, nonparticipant, empty scope and forged peer cannot create/read/answer", async () => {
    const id = await create(); await open(id);
    for (const user of [OUTSIDE, OTHER, TEACHER, PLACEHOLDER]) {
      await expect(getDuel(db, scope, user, id, at)).rejects.toMatchObject({ status: 403 });
      await expect(validateDuelAnswer(db, scope, user, { duelId: id, round: 0, question: 0 }, "g1u01.w.any", "x", at)).rejects.toMatchObject({ status: 403 });
    }
    expect(await listDuels(db, classScope([B]), ME, at)).toMatchObject({ enabled: false, active: [] });
    await expect(create(ME, 4)).rejects.toMatchObject({ status: 403 });
    const b = await arena();
    await expect(tx(d => createDuel(d, scope, ME, 1, `${b.rosterVersion}bad`, at))).rejects.toMatchObject({ status: 409 });
  });
  it("D12 disabled, test or archived class closes read and write access", async () => {
    for (const mutation of ["UPDATE domigo_v2.class_settings SET leaderboard=false", "UPDATE domigo_v2.class_settings SET purpose='test'", "UPDATE domigo_v2.classes SET archived_at=now()"] ) {
      await pg.exec(mutation);
      expect(await arena()).toMatchObject({ enabled: false, peers: [] });
      expect(await arenaEnabled(db, scope, ME)).toBe(false);
      await expect(create()).rejects.toMatchObject({ status: 403 });
      await pg.exec("UPDATE domigo_v2.class_settings SET leaderboard=true, purpose='regular'; UPDATE domigo_v2.classes SET archived_at=null");
    }
  });
  it("D13 moved/unclaimed opponent or viewer disappears, even from existing history", async () => {
    const id = await create();
    await pg.query("UPDATE domigo_v2.users SET class_id=$1 WHERE id=$2", [B, PEER]);
    expect((await arena()).active).toHaveLength(0);
    await expect(getDuel(db, scope, ME, id, at)).rejects.toMatchObject({ status: 403 });
    await pg.query("UPDATE domigo_v2.users SET class_id=$1, claimed_at=null WHERE id=$2", [A, PEER]);
    expect((await arena()).peers).toHaveLength(2); expect((await arena()).active).toHaveLength(0);
    await pg.query("UPDATE domigo_v2.users SET claimed_at=null WHERE id=$1", [ME]);
    expect(await arena()).toMatchObject({ enabled: false });
  });
  it("D14 open-round enforces picker, pending answers, Chapter uniqueness and grade", async () => {
    const id = await create();
    await expect(open(id, PEER)).rejects.toMatchObject({ status: 409 });
    await expect(open(id, ME, "g2-u01")).rejects.toMatchObject({ status: 403 });
    await open(id);
    await expect(open(id, ME, "g1-u02")).rejects.toMatchObject({ status: 409 });
    for (const user of [ME, PEER]) for (let q = 0; q < 3; q++) await answer(id, user);
    await expect(open(id, PEER, "g1-u01")).rejects.toMatchObject({ status: 409 });
    await open(id, PEER, "g1-u02");
    expect((await getDuel(db, scope, PEER, id, at)).next?.round).toBe(1);
    expect((await arena(PEER)).waiting).toBe(1); expect((await arena(ME)).waiting).toBe(0);
  });
  it("D15 reservations are class-specific and rechecked before reveal/answer", async () => {
    const id = await create();
    const candidates = pool.filter(i => i.id.startsWith("g1u01."));
    await db.insert(schema.reservedItems).values(candidates.map(i => ({ classId: B, itemId: i.id, active: true })));
    await open(id);
    const next = (await getDuel(db, scope, ME, id, at)).next!;
    await db.insert(schema.reservedItems).values({ classId: A, itemId: next.itemId, active: true });
    await expect(getDuel(db, scope, ME, id, at)).rejects.toMatchObject({ status: 409, code: "duel_question_reserved" });
    await expect(validateDuelAnswer(db, scope, ME, { duelId: id, round: 0, question: 0 }, next.itemId, next.options[0]!, at)).rejects.toMatchObject({ status: 409 });
    await db.insert(schema.reservedItems).values(candidates.filter(i => i.id !== next.itemId).map(i => ({ classId: A, itemId: i.id, active: true })));
    const second = await create(ME, 2);
    await expect(open(second)).rejects.toMatchObject({ status: 409, code: "duel_chapter_empty" });
  });
  it("D16 pending question only, no key or participant UUID in serialized detail/rounds", async () => {
    const id = await create(); await open(id);
    const v = await getDuel(db, scope, ME, id, at);
    expect(v.next?.options).toHaveLength(4); expect(v.next?.question).toBe(0);
    expect((await getDuel(db, scope, PEER, id, at)).next).toBe(null);
    const [row] = await db.select().from(schema.duels);
    const stored = JSON.stringify(row!.rounds);
    expect(stored).not.toMatch(/correctIdx|"answer"|"correct"|"english"|"name"|"xp"/i);
    for (const p of [ME, PEER, A]) expect(JSON.stringify(v)).not.toContain(p);
    expect(JSON.stringify(v)).not.toContain(row!.rounds[0]!.questions[1]!.itemId);
  });
  it("D17 only open question/item/option is accepted; skipped/foreign round and tampered choices rejected", async () => {
    const id = await create(); await open(id); const v = (await getDuel(db, scope, ME, id, at)).next!;
    for (const [round, question, item, choice] of [[0, 1, v.itemId, v.options[0]!], [1, 0, v.itemId, v.options[0]!], [0, 0, "g1u01.w.fake", v.options[0]!], [0, 0, v.itemId, "forged"]] as const) {
      await expect(validateDuelAnswer(db, scope, ME, { duelId: id, round, question }, item, choice, at)).rejects.toMatchObject({ status: 409 });
    }
    await expect(validateDuelAnswer(db, scope, PEER, { duelId: id, round: 0, question: 0 }, v.itemId, v.options[0]!, at)).rejects.toMatchObject({ status: 409 });
    expect(await db.select().from(schema.practiceAttempts)).toHaveLength(0);
  });
  it("D18 replay with same OR different client id is 409 and books one ledger row/XP increment", async () => {
    const id = await create(); await open(id);
    const receipt = await answer(id, ME);
    for (const clientAttemptId of [receipt.attempt.clientAttemptId, crypto.randomUUID()]) await expect(tx(d => recordAnswer(d, scope, { ...receipt.attempt, clientAttemptId }, receipt.context, receipt.choice, at))).rejects.toMatchObject({ status: 409 });
    expect(await db.select().from(schema.practiceAttempts)).toHaveLength(1);
    expect((await db.select().from(schema.userProgress))[0]!.xp).toBe(receipt.attempt.xpAwarded);
    const [row] = await db.select().from(schema.duels); expect(row!.rounds[0]!.p1Answers).toEqual([true]);
  });
  it("D19 simultaneous answers serialize; exactly one succeeds and the other conflicts", async () => {
    const id = await create(); await open(id); const next = (await getDuel(db, scope, ME, id, at)).next!;
    const item = pool.find(i => i.id === next.itemId)!, choice = next.options.find(o => gradeVocab(item, o, "deToEn").tier === "correct")!;
    const a = { userId: ME, classId: A, itemId: item.id, kind: "vocab" as const, unitSlug: "g1-u01", grade: 1, mode: `duel:${id}`, tier: "correct" as const, xpAwarded: 20 };
    const results = await Promise.allSettled([1, 2].map(() => tx(d => recordAnswer(d, scope, { ...a, clientAttemptId: crypto.randomUUID() }, { duelId: id, round: 0, question: 0 }, choice, at))));
    expect(results.filter(r => r.status === "fulfilled")).toHaveLength(1); expect(results.filter(r => r.status === "rejected")).toHaveLength(1);
    expect(await db.select().from(schema.practiceAttempts)).toHaveLength(1);
  });
  it("D20 reuse of a previous question's attempt id cannot advance the duel", async () => {
    const id = await create(); await open(id); const first = await answer(id, ME);
    await expect(answer(id, ME, true, first.attempt.clientAttemptId)).rejects.toMatchObject({ status: 409 });
    expect((await getDuel(db, scope, ME, id, at)).next?.question).toBe(1);
    expect(await db.select().from(schema.practiceAttempts)).toHaveLength(1);
  });
  it("D21 failure after ledger/XP updates rolls back every write", async () => {
    const id = await create(); await open(id);
    await pg.exec("CREATE FUNCTION domigo_v2.synthetic_reject_duel() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic failure'; END; $$; CREATE TRIGGER synthetic_reject BEFORE UPDATE ON domigo_v2.duels FOR EACH ROW EXECUTE FUNCTION domigo_v2.synthetic_reject_duel()");
    try { await expect(answer(id, ME)).rejects.toThrow(); }
    finally { await pg.exec("DROP TRIGGER synthetic_reject ON domigo_v2.duels; DROP FUNCTION domigo_v2.synthetic_reject_duel()"); }
    expect(await db.select().from(schema.practiceAttempts)).toHaveLength(0);
    expect(await db.select().from(schema.userProgress)).toHaveLength(0); expect(await db.select().from(schema.reviewQueue)).toHaveLength(0);
    expect((await getDuel(db, scope, ME, id, at)).next?.question).toBe(0);
  });
  it("D22 seven days expires exactly, no winner; read doesn't extend lifetime; fresh challenge succeeds", async () => {
    const id = await create(); await open(id);
    const later = new Date(at.getTime() + 7 * 86400000);
    expect((await listDuels(db, scope, ME, new Date(later.getTime() - 1))).active).toHaveLength(1);
    const b = await listDuels(db, scope, ME, later);
    expect(b.active).toHaveLength(0); expect(b.history[0]!.status).toBe("expired"); expect(b.stats.played).toBe(0);
    await expect(validateDuelAnswer(db, scope, ME, { duelId: id, round: 0, question: 0 }, "fake", "x", later)).rejects.toMatchObject({ status: 410 });
    await tx(d => expire(d, scope, ME, later));
    const [row] = await db.select().from(schema.duels); expect(row!.winner).toBe(null); expect(row!.updatedAt).toEqual(at);
    expect(await tx(d => createDuel(d, scope, ME, 1, b.rosterVersion, later))).not.toBe(id);
  });
  it("D23 complete thirty-answer duel: scores/sides/history/XP all derived with no bonus", async () => {
    const id = await create();
    let mine = 0, theirs = 0;
    for (let r = 0; r < 5; r++) {
      const picker = r % 2 === 0 ? ME : PEER;
      await open(id, picker, `g1-u0${r + 1}`);
      for (const user of [picker, picker === ME ? PEER : ME]) for (let q = 0; q < 3; q++) {
        const receipt = await answer(id, user, user === ME || q === 0);
        if (user === ME) mine += receipt.attempt.xpAwarded; else theirs += receipt.attempt.xpAwarded;
      }
    }
    const [row] = await db.select().from(schema.duels);
    expect(row).toMatchObject({ status: "complete", p1Score: 15, p2Score: 5, winner: ME });
    expect(await db.select().from(schema.practiceAttempts)).toHaveLength(30);
    const a = await arena(), b = await arena(PEER);
    expect(a.stats).toEqual({ played: 1, won: 1, winRate: 100, xp: mine });
    expect(b.stats).toEqual({ played: 1, won: 0, winRate: 0, xp: theirs });
    expect(a.history[0]).toMatchObject({ myScore: 15, theirScore: 5, result: "win", xp: mine });
    expect(b.history[0]).toMatchObject({ myScore: 5, theirScore: 15, result: "loss", xp: theirs });
    expect((await db.select().from(schema.userProgress).where(eq(schema.userProgress.userId, ME)))[0]!.xp).toBe(mine);
    await expect(open(id, ME, "g1-u06")).rejects.toMatchObject({ status: 409 });
  });
  it("D24 history is latest twenty; totals are all completed duels, and XP is own/current-class/duel-only", async () => {
    const rows = Array.from({ length: 22 }, (_, i) => ({ id: uuid(201 + i), classId: A, grade: 1, p1: ME, p2: PEER, mode: "vocab", status: "complete", p1Score: i % 2, p2Score: 0, winner: i % 2 ? ME : null, updatedAt: new Date(at.getTime() + i * 1000) }));
    await db.insert(schema.duels).values(rows);
    for (const [userId, classId, mode, xpAwarded] of [[ME, A, `duel:${rows[21]!.id}`, 20], [PEER, A, `duel:${rows[21]!.id}`, 900], [ME, B, `duel:${rows[21]!.id}`, 800], [ME, A, "practice", 700], [ME, A, `duel:${uuid(999)}`, 600]] as const) await db.insert(schema.practiceAttempts).values({ userId, classId, mode, xpAwarded, itemId: "g1u01.w.synthetic", kind: "vocab", unitSlug: "g1-u01", grade: 1, tier: "correct", correct: true });
    // Even a broader authenticated scope must not mix the viewer's current class with another class.
    const b = await listDuels(db, classScope([A, B]), ME, at); expect(b.history).toHaveLength(20); expect(b.history[0]!.id).toBe(rows[21]!.id);
    expect(b.history.at(-1)!.id).toBe(rows[2]!.id); expect(b.stats).toEqual({ played: 22, won: 11, winRate: 50, xp: 20 });
    expect(b.history[0]!.xp).toBe(20); expect(b.history[1]!.result).toBe("draw");
  });
  it("D25 missing migration fails closed without an exception or identity output", async () => {
    await pg.exec("ALTER TABLE domigo_v2.duels RENAME TO synthetic_hidden_duels");
    try { expect(await arena()).toMatchObject({ enabled: false, unavailable: true, peers: [], active: [] }); }
    finally { await pg.exec("ALTER TABLE domigo_v2.synthetic_hidden_duels RENAME TO duels"); }
  });
  it("D26 deletion removes both participant directions and tolerates absent duels", async () => {
    const mine = await create(), others = await create(OTHER, 3);
    const report = await deleteUserData(db, ME);
    expect(report.zeilen.duels).toBe(1);
    expect((await db.select().from(schema.duels)).map(d => d.id)).toEqual([others]);
    expect((await db.select().from(schema.duels)).some(d => d.id === mine)).toBe(false);
    // Restore this entirely synthetic viewer, then exercise the pre-migration path.
    await db.insert(schema.v2IdentityUsers).values({ id: ME, classId: A, role: "student", displayName: "Synthetic 01", givenName: "Example Invented", pinHash: "unused", claimedAt: at, createdAt: at });
    await pg.exec("ALTER TABLE domigo_v2.duels RENAME TO synthetic_hidden_duels");
    try { expect((await deleteUserData(db, ME)).zeilen.duels).toBe(0); }
    finally { await pg.exec("ALTER TABLE domigo_v2.synthetic_hidden_duels RENAME TO duels"); }
  });

  it("D27 transaction transport closes after success/failure and never connects without configuration", async () => {
    const start = transport.closes;
    expect(await tx(async () => "ok")).toBe("ok");
    expect(transport.closes - start).toBe(1);
    const board = await arena();
    await expect(tx(async d => {
      await createDuel(d, scope, ME, 1, board.rosterVersion, at);
      throw Error("synthetic failure");
    })).rejects.toThrow("synthetic failure");
    expect(transport.closes - start).toBe(2);
    expect(await db.select().from(schema.duels)).toHaveLength(0);
    const connections = transport.connects;
    vi.stubEnv("DATABASE_URL", ""); vi.stubEnv("POSTGRES_URL", "");
    try { await expect(tx(async () => "never")).rejects.toMatchObject({ status: 503 }); expect(transport.connects).toBe(connections); }
    finally { vi.stubEnv("DATABASE_URL", "postgres://synthetic-local-only/unused"); }
  });
  it("D28 non-missing deletion failures retry without identity-bearing SQL in logs", async () => {
    await create();
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    await pg.exec("CREATE FUNCTION domigo_v2.synthetic_reject_delete() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic private detail'; END; $$; CREATE TRIGGER synthetic_reject_delete BEFORE DELETE ON domigo_v2.duels FOR EACH ROW EXECUTE FUNCTION domigo_v2.synthetic_reject_delete()");
    try {
      await expect(deleteUserData(db, ME)).rejects.toThrow();
      expect(log.mock.calls).toEqual([["[konto] deletion of duels failed"]]);
      expect((await db.select().from(schema.v2IdentityUsers).where(eq(schema.v2IdentityUsers.id, ME)))).toHaveLength(1);
    } finally {
      await pg.exec("DROP TRIGGER synthetic_reject_delete ON domigo_v2.duels; DROP FUNCTION domigo_v2.synthetic_reject_delete()");
      log.mockRestore();
    }
  });
  it("D30 migration statements may be repeated individually and finish a partial run without losing data", async () => {
    const columns = await pg.query("SELECT column_name FROM information_schema.columns WHERE table_schema='domigo_v2' AND table_name='duels'");
    const indexes = () => pg.query("SELECT indexname FROM pg_indexes WHERE schemaname='domigo_v2' AND tablename='duels' AND indexname <> 'duels_pkey'");
    expect(columns.rows).toHaveLength(13); expect((await indexes()).rows).toHaveLength(4);
    expect(await db.select().from(schema.duels)).toHaveLength(0);
    const id = await create();
    const before = await db.select().from(schema.duels);
    // Simulate the Chrome workflow stopping before the last CREATE INDEX.
    await pg.exec('DROP INDEX "domigo_v2"."duels_active_pair_unique"');
    const statements = readFileSync(new URL("../drizzle/0024_word_duels.sql", import.meta.url), "utf8")
      .split("--> statement-breakpoint").map(s => s.trim()).filter(Boolean);
    for (let pass = 0; pass < 2; pass++) for (const statement of statements) await pg.exec(statement);
    expect((await indexes()).rows).toHaveLength(4);
    expect(await db.select().from(schema.duels)).toEqual(before);
    expect(before[0]!.id).toBe(id);
    await expect(create(PEER)).rejects.toMatchObject({ status: 409 });
  });

});
