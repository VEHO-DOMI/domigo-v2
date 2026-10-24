/** Local PostgreSQL only. All identities, classes and answers are synthetic. */
import { beforeAll, beforeEach, afterAll, describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { eq } from "drizzle-orm";
import type { Db } from "./index.ts";
import * as schema from "./schema.ts";
import { classScope } from "./scope.ts";
import { gradeVocab, vocabAnswers, xpForTier } from "@domigo/engine";
import { loadUnit } from "../../content-loader/src/index.ts";
import { actOnLiveRoom, checkLiveAnswer, createLiveRoom, getLiveRoom, joinLiveQuiz, liveLobby, recordLiveAnswer, type LiveActor, type LiveContext } from "./live-service.ts";
const uuid = (n: number) => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
const A = uuid(101), B = uuid(102), ME = uuid(1), PEER = uuid(2), OTHER = uuid(3), OUTSIDE = uuid(4), TEACHER = uuid(99);
const base = Date.parse("2026-10-24T08:00:00Z"), date = (offset = 0) => new Date(base + offset), scope = classScope([A]);
const actor = (userId = ME): LiveActor => ({ userId, classId: userId === OUTSIDE ? B : A, teacher: userId === TEACHER });
const pg = new PGlite(), database = drizzle(pg, { schema }), db = database as unknown as Db;
const tx = <T>(f: (d: Db) => Promise<T>) => database.transaction(d => f(d as unknown as Db));
const items = loadUnit("g1-u01").vocab;
const selection = { kind: "quiz" as const, mode: "translation" as const, units: ["g1-u01"], count: 5 as const };
async function battle() { const lobby = await tx(d => liveLobby(d, scope, actor(), date())); const id = await tx(d => createLiveRoom(d, scope, actor(), { ...selection, kind: "battle", peer: 1, rosterVersion: lobby.rosterVersion }, items, date())); await tx(d => actOnLiveRoom(d, scope, actor(PEER), id, "accept", date())); return id; }
async function quiz() { const id = await tx(d => createLiveRoom(d, scope, actor(TEACHER), selection, items, date())); const [r] = await db.select().from(schema.liveRooms).where(eq(schema.liveRooms.id, id)); await tx(d => joinLiveQuiz(d, scope, actor(), r!.code, date())); await tx(d => joinLiveQuiz(d, scope, actor(PEER), r!.code, date())); await tx(d => actOnLiveRoom(d, scope, actor(TEACHER), id, "start", date())); return id; }
async function answer(id: string, user = ME, offset = 5000, right = true, clientAttemptId = crypto.randomUUID(), processingOffset = offset) {
    const [room] = await db.select().from(schema.liveRooms).where(eq(schema.liveRooms.id, id)), q = room!.questions[room!.round]!, item = items.find(i => i.id === q.itemId)!;
    const value = right ? vocabAnswers(item, q.pool).find(a => a.tier === "full")!.text : q.options.find(a => gradeVocab(item, a, q.pool).tier === "wrong")!;
    const tier = gradeVocab(item, value, q.pool).tier, mode = `${room!.kind === "quiz" ? "quiz" : "live"}:${id}`, context = { roomId: id, round: room!.round };
    const attempt = { userId: user, classId: A, grade: 1, kind: "vocab" as const, itemId: item.id, unitSlug: "g1-u01", mode, tier, xpAwarded: xpForTier(item.difficulty * 10, tier), clientAttemptId, latencyMs: 0 };
    await tx(d => recordLiveAnswer(d, scope, actor(user), attempt, context, value, date(offset), () => date(processingOffset)));
    return { attempt, context, value };
}
beforeAll(async () => {
    await pg.exec('CREATE SCHEMA domigo_v2');
    const snapshot = JSON.parse(readFileSync(new URL('../drizzle/meta/0023_snapshot.json', import.meta.url), 'utf8'));
    type Col = {
        name: string;
        type: string;
        primaryKey: boolean;
        notNull: boolean;
        default?: unknown;
    };
    type Idx = {
        name: string;
        isUnique: boolean;
        where?: string;
        columns: {
            expression: string;
            isExpression: boolean;
            asc: boolean;
        }[];
    };
    for (const table of Object.values(snapshot.tables) as {
        name: string;
        columns: Record<string, Col>;
        checkConstraints: Record<string, {
            name: string;
            value: string;
        }>;
        indexes: Record<string, Idx>;
    }[]) {
        const columns = Object.values(table.columns).map(c => `"${c.name}" ${c.type}${c.primaryKey ? ' PRIMARY KEY' : ''}${c.notNull ? ' NOT NULL' : ''}${'default' in c ? ` DEFAULT ${c.default}` : ''}`);
        const checks = Object.values(table.checkConstraints).map(c => `CONSTRAINT "${c.name}" CHECK (${c.value})`);
        await pg.exec(`CREATE TABLE domigo_v2."${table.name}" (${[...columns, ...checks].join(',')})`);
        for (const i of Object.values(table.indexes))
            await pg.exec(`CREATE ${i.isUnique ? 'UNIQUE ' : ''}INDEX "${i.name}" ON domigo_v2."${table.name}" (${i.columns.map(c => `${c.isExpression ? c.expression : `"${c.expression}"`}${c.asc ? '' : ' DESC'}`).join(',')})${i.where ? ` WHERE ${i.where}` : ''}`);
    }
    for (const migration of ['0024_word_duels.sql', '0025_live_arena.sql', '0025_live_arena.sql', '0027_atomic_attempt_booking.sql'])
        await pg.exec(readFileSync(new URL('../drizzle/' + migration, import.meta.url), 'utf8'));
    for (const id of [A, B]) {
        await db.insert(schema.v2Classes).values({ id, name: 'Synthetic class', grade: 1, teacherId: TEACHER, inviteCode: id });
        await db.insert(schema.classSettings).values({ classId: id, purpose: 'regular', leaderboard: true });
    }
    for (const id of [ME, PEER, OTHER, OUTSIDE, TEACHER])
        await db.insert(schema.v2IdentityUsers).values({ id, role: id === TEACHER ? 'teacher' : 'student', classId: id === TEACHER ? null : id === OUTSIDE ? B : A, displayName: `Synthetic ${id.slice(-2)}`, givenName: 'Invented Example', pinHash: 'synthetic-unused', claimedAt: date(), createdAt: date() });
}, 30000);
beforeEach(async () => { await pg.exec('TRUNCATE domigo_v2.live_rooms CASCADE; TRUNCATE domigo_v2.practice_attempts,domigo_v2.user_progress,domigo_v2.review_queue,domigo_v2.reserved_items'); await pg.query('UPDATE domigo_v2.users SET class_id=$1,claimed_at=$2 WHERE id IN ($3,$4,$5)', [A, date().toISOString(), ME, PEER, OTHER]); await pg.exec("UPDATE domigo_v2.class_settings SET leaderboard=true,purpose='regular'; UPDATE domigo_v2.classes SET archived_at=null,grade=1"); });
afterAll(() => pg.close());
describe('live room PostgreSQL contracts', () => {
    it('R01 authentic class/role gate and stale peer version prevent writes', async () => {
        const lobby = await tx(d => liveLobby(d, scope, actor(), date()));
        expect(lobby.peers).toHaveLength(2);
        expect(JSON.stringify(lobby)).not.toContain(PEER);
        await expect(tx(d => createLiveRoom(d, scope, actor(), { ...selection, kind: 'battle', peer: 1, rosterVersion: 'bad' }, items, date()))).rejects.toMatchObject({ status: 409 });
        await expect(tx(d => createLiveRoom(d, scope, actor(), selection, items, date()))).rejects.toMatchObject({ status: 403 });
        await expect(tx(d => liveLobby(d, scope, actor(OUTSIDE), date()))).rejects.toMatchObject({ status: 403 });
        await expect(tx(d => liveLobby(d, scope, { ...actor(), teacher: true }, date()))).rejects.toMatchObject({ status: 403 });
        expect(await db.select().from(schema.liveRooms)).toHaveLength(0);
    });
    it('R02 invite accepts only its guest; deadline and distinct active pair are enforced', async () => {
        const l = await tx(d => liveLobby(d, scope, actor(), date()));
        const request = { ...selection, kind: 'battle' as const, peer: 1, rosterVersion: l.rosterVersion };
        const id = await tx(d => createLiveRoom(d, scope, actor(), request, items, date()));
        await expect(tx(d => actOnLiveRoom(d, scope, actor(OTHER), id, 'accept', date()))).rejects.toMatchObject({ status: 403 });
        await expect(tx(d => createLiveRoom(d, scope, actor(), request, items, date()))).rejects.toMatchObject({ status: 409 });
        await expect(tx(d => actOnLiveRoom(d, scope, actor(PEER), id, 'accept', date(30000)))).rejects.toMatchObject({ status: 410 });
        expect((await tx(d => getLiveRoom(d, scope, actor(), id, date(30000)))).phase).toBe('cancelled');
        expect(await tx(d => createLiveRoom(d, scope, actor(), request, items, date(31000)))).not.toBe(id);
    });
    it('R03 real battle answers are graded before ordinary XP, score uses server time', async () => {
        const id = await battle();
        const first = await answer(id, ME, 5000), second = await answer(id, PEER, 6000);
        const view = await tx(d => getLiveRoom(d, scope, actor(), id, date(6000)));
        expect(view.phase).toBe('result');
        expect(view.players.map(p => p.score)).toEqual([1, 0]);
        expect(view.xp).toBe(first.attempt.xpAwarded);
        const attempts = await db.select().from(schema.practiceAttempts);
        expect(attempts).toHaveLength(2);
        expect(attempts.map(a => a.latencyMs)).toEqual([1000, 2000]);
        expect((await db.select().from(schema.userProgress)).map(p => p.xp)).toEqual([first.attempt.xpAwarded, second.attempt.xpAwarded]);
    });
    it('R04 quiz code stays in class, only its teacher starts and advances', async () => {
        const id = await tx(d => createLiveRoom(d, scope, actor(TEACHER), selection, items, date()));
        const [r] = await db.select().from(schema.liveRooms);
        await expect(tx(d => joinLiveQuiz(d, classScope([B]), actor(OUTSIDE), r!.code, date()))).rejects.toMatchObject({ status: 410 });
        await tx(d => joinLiveQuiz(d, scope, actor(), r!.code, date()));
        expect(await tx(d => joinLiveQuiz(d, scope, actor(), r!.code, date()))).toBe(id);
        await expect(tx(d => actOnLiveRoom(d, scope, actor(), id, 'start', date()))).rejects.toMatchObject({ status: 403 });
        await tx(d => actOnLiveRoom(d, scope, actor(TEACHER), id, 'start', date()));
        await answer(id, ME, 11500);
        const view = await tx(d => getLiveRoom(d, scope, actor(), id, date(11500)));
        expect(view.phase).toBe('result');
        expect(view.players[0]!.score).toBe(750);
        expect(view.code).toBe(null);
        await expect(tx(d => actOnLiveRoom(d, scope, actor(), id, 'next', date(12000)))).rejects.toMatchObject({ status: 403 });
        await tx(d => actOnLiveRoom(d, scope, actor(TEACHER), id, 'next', date(12000)));
        expect((await tx(d => getLiveRoom(d, scope, actor(), id, date(12000)))).round).toBe(1);
    });
    it('R05 replay and reused attempt id cannot advance or grant points twice', async () => {
        const id = await battle(), f = await answer(id);
        const before = await db.select().from(schema.userProgress);
        await expect(tx(d => recordLiveAnswer(d, scope, actor(), f.attempt, f.context, f.value, date(5100)))).rejects.toMatchObject({ status: 409 });
        expect(await db.select().from(schema.userProgress)).toEqual(before);
        expect(await db.select().from(schema.practiceAttempts)).toHaveLength(1);
        await answer(id, PEER, 6000);
        await tx(d => getLiveRoom(d, scope, actor(), id, date(9000)));
        await expect(answer(id, ME, 14000, true, f.attempt.clientAttemptId)).rejects.toMatchObject({ status: 409 });
        const [member] = await db.select().from(schema.liveMembers).where(eq(schema.liveMembers.userId, ME));
        expect(member!.answers).toHaveLength(1);
    });
    it('R06 deadline and wrong room coordinates reject before any attempt', async () => {
        const id = await battle();
        await expect(answer(id, ME, 19000)).rejects.toMatchObject({ status: 410 });
        expect(await db.select().from(schema.practiceAttempts)).toHaveLength(0);
        const c: LiveContext = { roomId: id, round: 4 };
        await expect(tx(d => checkLiveAnswer(d, scope, actor(), `live:${id}`, c, 'x', date(5000)))).rejects.toMatchObject({ status: 409 });
    });
    it('R07 player view contains no future keys and hides another answer until result', async () => {
        const id = await battle(), before = await tx(d => getLiveRoom(d, scope, actor(), id, date(4000)));
        expect(Object.keys(before.question!).sort()).toEqual(['chapter', 'options', 'prompt']);
        expect(before.question!.options).toEqual([]);
        expect(JSON.stringify(before)).not.toMatch(/itemId|sAnswers|dAnswers|"translation"\s*:|questions|clientAttemptId/);
        await answer(id, PEER, 5000);
        const after = await tx(d => getLiveRoom(d, scope, actor(), id, date(5100)));
        expect(after.players[1]!.correct).toBe(null);
        expect(after.players.map(p => p.score)).toEqual([0, 0]);
    });
    it('R08 ordinary write failure rolls back room answer and points together', async () => {
        const id = await battle();
        await pg.exec("CREATE FUNCTION domigo_v2.synthetic_live_reject() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic failure'; END; $$; CREATE TRIGGER synthetic_live_reject BEFORE INSERT ON domigo_v2.user_progress FOR EACH ROW EXECUTE FUNCTION domigo_v2.synthetic_live_reject()");
        try {
            await expect(answer(id)).rejects.toThrow();
        }
        finally {
            await pg.exec('DROP TRIGGER synthetic_live_reject ON domigo_v2.user_progress; DROP FUNCTION domigo_v2.synthetic_live_reject()');
        }
        expect(await db.select().from(schema.practiceAttempts)).toHaveLength(0);
        expect(await db.select().from(schema.userProgress)).toHaveLength(0);
        expect((await db.select().from(schema.liveMembers)).every(m => m.answers.length === 0)).toBe(true);
    });
    it('R09 full five-round battle and early unbeatable lead close with ordinary XP only', async () => {
        for (const early of [false, true]) {
            if (early)
                await pg.exec('TRUNCATE domigo_v2.live_rooms CASCADE; TRUNCATE domigo_v2.practice_attempts,domigo_v2.user_progress,domigo_v2.review_queue');
            const id = await battle();
            let offset = 5000;
            for (let round = 0; round < (early ? 3 : 5); round++) {
                await answer(id, ME, offset, early || round % 2 === 0);
                await answer(id, PEER, offset + 1000, !early && round % 2 !== 0);
                const result = await tx(d => getLiveRoom(d, scope, actor(), id, date(offset + 1000)));
                expect(result.phase).toBe('result');
                const next = await tx(d => getLiveRoom(d, scope, actor(), id, date(offset + 4000)));
                expect(next.phase).toBe(round === (early ? 2 : 4) ? 'complete' : 'countdown');
                offset += 9000;
            }
            const attempts = await db.select().from(schema.practiceAttempts);
            expect(attempts).toHaveLength(early ? 6 : 10);
            const xp = (await db.select().from(schema.userProgress)).reduce((n, p) => n + p.xp, 0);
            expect(xp).toBe(attempts.reduce((n, a) => n + a.xpAwarded, 0));
        }
    });
    it('R10 complete quiz waits for its teacher between every question and ends after five', async () => {
        const id = await quiz();
        let offset = 5000;
        for (let round = 0; round < 5; round++) {
            await answer(id, ME, offset, true);
            await answer(id, PEER, offset + 1000, false);
            expect((await tx(d => getLiveRoom(d, scope, actor(), id, date(offset + 15000)))).phase).toBe('result');
            await tx(d => actOnLiveRoom(d, scope, actor(TEACHER), id, 'next', date(offset + 15000)));
            offset += 20000;
        }
        const view = await tx(d => getLiveRoom(d, scope, actor(), id, date(offset)));
        expect(view.phase).toBe('complete');
        expect(view.players.map(p => p.score)).toEqual([4830, 0]);
        expect(await db.select().from(schema.practiceAttempts)).toHaveLength(10);
    });
    it('R11 changed claims, class grade or reserved item fail closed without leaking players or XP', async () => {
        const id = await battle();
        await pg.query('UPDATE domigo_v2.users SET claimed_at=null WHERE id=$1', [PEER]);
        const view = await tx(d => getLiveRoom(d, scope, actor(), id, date(5000)));
        expect(view.phase).toBe('cancelled');
        expect(view.players).toEqual([]);
        expect(view.question).toBe(null);
        await expect(answer(id)).rejects.toMatchObject({ status: 409 });
        await pg.query('UPDATE domigo_v2.users SET claimed_at=$1 WHERE id=$2', [date().toISOString(), PEER]);
        const second = await battle();
        const [room] = await db.select().from(schema.liveRooms).where(eq(schema.liveRooms.id, second));
        await db.insert(schema.reservedItems).values({ classId: A, itemId: room!.questions[0]!.itemId });
        await expect(answer(second)).rejects.toMatchObject({ status: 409 });
        expect((await tx(d => getLiveRoom(d, scope, actor(), second, date(5000)))).phase).toBe('cancelled');
        await pg.query('UPDATE domigo_v2.classes SET grade=2 WHERE id=$1', [A]);
        await expect(tx(d => getLiveRoom(d, scope, actor(), second, date(5000)))).rejects.toMatchObject({ status: 403 });
        expect(await db.select().from(schema.practiceAttempts)).toHaveLength(0);
    });
    it('R12 lobby lists member quiz and own invitation, never foreign games', async () => {
        const id = await quiz();
        const mine = await tx(d => liveLobby(d, scope, actor(), date(5000))), other = await tx(d => liveLobby(d, scope, actor(OTHER), date(5000)));
        expect(mine.rooms.map(r => r.id)).toEqual([id]);
        expect(other.rooms).toEqual([]);
        const battleId = await battle();
        expect((await tx(d => liveLobby(d, scope, actor(PEER), date(5000)))).rooms.map(r => r.id).sort()).toEqual([id, battleId].sort());
    });
    it('R13 deleting a player cascades only their membership, with vacant seats reusable', async () => {
        const id = await tx(d => createLiveRoom(d, scope, actor(TEACHER), selection, items, date()));
        const [room] = await db.select().from(schema.liveRooms);
        await tx(d => joinLiveQuiz(d, scope, actor(), room!.code, date()));
        await tx(d => joinLiveQuiz(d, scope, actor(PEER), room!.code, date()));
        await db.delete(schema.liveMembers).where(eq(schema.liveMembers.userId, ME));
        await tx(d => joinLiveQuiz(d, scope, actor(OTHER), room!.code, date()));
        const members = await db.select().from(schema.liveMembers);
        expect(members.map(m => m.seat).sort()).toEqual([0, 1]);
        await db.delete(schema.v2IdentityUsers).where(eq(schema.v2IdentityUsers.id, OTHER));
        expect(await db.select().from(schema.liveMembers)).toHaveLength(1);
        expect(await db.select().from(schema.liveRooms)).toHaveLength(1);
        await db.insert(schema.v2IdentityUsers).values({ id: OTHER, role: 'student', classId: A, displayName: 'Synthetic 3', givenName: 'Invented Example', pinHash: 'synthetic-unused', claimedAt: date(), createdAt: date() });
        await tx(d => actOnLiveRoom(d, scope, actor(TEACHER), id, 'close', date()));
    });
    it('R14 wrong mode, teacher answers and pre-start answers never write', async () => {
        const id = await battle(), context = { roomId: id, round: 0 };
        await expect(tx(d => checkLiveAnswer(d, scope, actor(), `quiz:${id}`, context, 'x', date(5000)))).rejects.toMatchObject({ status: 403 });
        await expect(tx(d => checkLiveAnswer(d, scope, actor(TEACHER), `live:${id}`, context, 'x', date(5000)))).rejects.toMatchObject({ status: 403 });
        await expect(answer(id, ME, 3999)).rejects.toMatchObject({ status: 410 });
        expect(await db.select().from(schema.practiceAttempts)).toHaveLength(0);
    });
    it('R15 forty seats are enforced, with no forty-first membership', async () => {
        const added = Array.from({ length: 41 }, (_, i) => uuid(1000 + i));
        for (const id of added)
            await db.insert(schema.v2IdentityUsers).values({ id, role: 'student', classId: A, displayName: `Synthetic extra ${id.slice(-4)}`, givenName: null, pinHash: 'synthetic-unused', claimedAt: date(), createdAt: date() });
        try {
            const id = await tx(d => createLiveRoom(d, scope, actor(TEACHER), selection, items, date()));
            const [room] = await db.select().from(schema.liveRooms);
            for (const user of added.slice(0, 40))
                await tx(d => joinLiveQuiz(d, scope, actor(user), room!.code, date()));
            await expect(tx(d => joinLiveQuiz(d, scope, actor(added[40]), room!.code, date()))).rejects.toMatchObject({ status: 409, code: 'live_room_full' });
            const view = await tx(d => getLiveRoom(d, scope, actor(TEACHER), id, date()));
            expect(view.players).toHaveLength(40);
            expect(new Set(view.players.map(p => p.seat)).size).toBe(40);
        }
        finally {
            for (const id of added)
                await db.delete(schema.v2IdentityUsers).where(eq(schema.v2IdentityUsers.id, id));
        }
    });
    it('R16 repeatable SQL has every snapshot column, named constraint and index', async () => {
        const snapshot = JSON.parse(readFileSync(new URL('../drizzle/meta/0025_snapshot.json', import.meta.url), 'utf8'));
        for (const table of ['live_rooms', 'live_members']) {
            const expected = snapshot.tables['domigo_v2.' + table];
            const columns = await pg.query<{
                column_name: string;
            }>('SELECT column_name FROM information_schema.columns WHERE table_schema=$1 AND table_name=$2', ['domigo_v2', table]);
            expect(columns.rows.map(c => c.column_name).sort()).toEqual(Object.keys(expected.columns).sort());
            const constraints = await pg.query<{
                conname: string;
            }>('SELECT conname FROM pg_constraint WHERE conrelid=($1)::regclass', ['domigo_v2.' + table]);
            const names = new Set(constraints.rows.map(c => c.conname));
            for (const name of [...Object.keys(expected.foreignKeys), ...Object.keys(expected.checkConstraints)])
                expect(names.has(name)).toBe(true);
            const indexes = await pg.query<{
                indexname: string;
            }>('SELECT indexname FROM pg_indexes WHERE schemaname=$1 AND tablename=$2', ['domigo_v2', table]);
            for (const name of Object.keys(expected.indexes))
                expect(indexes.rows.some(i => i.indexname === name)).toBe(true);
        }
    });
});

// A request has eight seconds of server processing; its score still uses its
// original, strictly-before-deadline ingress. Polls must not consume that budget.
describe('live answer settlement under reordered requests', () => {
    it.each([false, true])('R17 deadline poll before booking preserves eligible ingress (prechecked=%s)', async (prechecked) => {
        const id = await battle();
        if (prechecked) await tx(d => checkLiveAnswer(d, scope, actor(), `live:${id}`, {roomId:id,round:0}, 'synthetic', date(18999), () => date(18999)));
        const waiting = await tx(d => getLiveRoom(d, scope, actor(PEER), id, date(19000)));
        expect(waiting.phase).toBe('active');
        await answer(id, ME, 18999, true, crypto.randomUUID(), 20000);
        const [receipt] = await db.select().from(schema.practiceAttempts);
        expect(receipt!.latencyMs).toBe(14999);
        const result = await tx(d => getLiveRoom(d, scope, actor(PEER), id, date(27000)));
        expect(result.phase).toBe('result');
        expect(result.players.map(p => p.score)).toEqual([1, 0]);
    });
    it('R18 settlement never admits a late ingress or a stalled server request', async () => {
        const id = await battle();
        await tx(d => getLiveRoom(d, scope, actor(PEER), id, date(19000)));
        await expect(answer(id, ME, 19000, true, crypto.randomUUID(), 20000)).rejects.toMatchObject({status:410});
        await expect(answer(id, ME, 18999, true, crypto.randomUUID(), 26999)).rejects.toMatchObject({status:503,code:'live_processing_timeout'});
        expect(await db.select().from(schema.practiceAttempts)).toHaveLength(0);
        await answer(id, ME, 18999, true, crypto.randomUUID(), 26998);
        expect(await db.select().from(schema.practiceAttempts)).toHaveLength(1);
    });
    it('R19 a later round implies that the old request exceeded processing budget, without retroactive scores', async () => {
        const id = await battle();
        await tx(d => getLiveRoom(d, scope, actor(PEER), id, date(27000)));
        const next = await tx(d => getLiveRoom(d, scope, actor(PEER), id, date(30000)));
        expect(next.round).toBe(1);
        await expect(tx(d => checkLiveAnswer(d, scope, actor(), `live:${id}`, {roomId:id,round:0}, 'synthetic', date(18999), () => date(30000)))).rejects.toMatchObject({status:503,code:'live_processing_timeout'});
        expect(await db.select().from(schema.practiceAttempts)).toHaveLength(0);
    });
});

it('R20 room expiry and lobby cleanup preserve the same bounded ingress contract', async () => {
    const id = await battle();
    await db.update(schema.liveRooms).set({expiresAt:date(18000)}).where(eq(schema.liveRooms.id,id));
    expect((await tx(d=>getLiveRoom(d,scope,actor(PEER),id,date(18000)))).phase).toBe('active');
    // Creating another room invokes bulk expiry cleanup, which must honor the same grace.
    await tx(d=>createLiveRoom(d,scope,actor(TEACHER),selection,items,date(18000)));
    await expect(answer(id,ME,18000,true,crypto.randomUUID(),19000)).rejects.toMatchObject({status:410});
    await answer(id,ME,17999,true,crypto.randomUUID(),19000);
    expect((await db.select().from(schema.practiceAttempts))[0]!.latencyMs).toBe(13999);
    expect((await tx(d=>getLiveRoom(d,scope,actor(PEER),id,date(26000)))).phase).toBe('cancelled');
});
