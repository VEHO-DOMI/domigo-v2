import assert from "node:assert/strict";
import { inScope, practiceItemDenial } from "@domigo/db";
import { beforeEach, it } from "node:test";
import { z } from "zod";
import * as refs from "@domigo/content-schema";
import * as loader from "@domigo/content-loader";
import * as engine from "@domigo/engine";
import * as policy from "../modi/attempt-policy.ts";
import * as itemRef from "../itemRef.ts";
import * as listeningRef from "../listeningRef.ts";
import * as testRef from "../testRef.ts";
import * as comprehensionRef from "../comprehensionRef.ts";
import * as rules from "../../../../packages/db/src/live-rules.ts";
import * as service from "../../../../packages/db/src/live-service.ts";
import { loadTestModule } from "./test-loader.ts";
const ID = "00000000-0000-4000-8000-000000000201", CLASS = "00000000-0000-4000-8000-000000000101";
let role = "student", user = "synthetic-own", writes = 0, transactions = 0, checked = 0, failure: Error | null = null, writeFailure = false, gradeFailure = false, changedContent = false;
let arrival: Date | undefined, bookedAt: Date | undefined, checkedNow: Date | undefined, writtenNow: Date | undefined;
let simulateQueue = false;
let pool: "deToEn" | "definition" | "carrier" = "deToEn", item = loader.loadUnit("g1-u01").vocab[0]!, last: Record<string, unknown> | null = null;
const player = () => ({ userId: user, classId: CLASS, classScope: [CLASS] });
const identity = { getActingUser: async () => player(), getTeacherForPage: async () => ({ userId: user, classScope: [CLASS] }) };
const content = { loadUnitWithOverrides: async (slug: string) => { if (gradeFailure)
        throw Error('private content'); return loader.loadUnit(slug); } };
const oldEnv = process.env.DOMIGO_LIVE_ARENA;
const server = loadTestModule("apps/web/lib/arena/live-server.ts", {
    "server-only": {}, "@domigo/content-loader": loader, "@/auth": { auth: async () => ({ user: { id: user, role } }) }, "@/lib/identity": identity, "@/lib/content-service": content,
    "../../../../packages/db/src/live-rules.ts": rules,
    "../../../../packages/db/src/duel-service.ts": { runDuelTransaction: async (f: (db: unknown) => unknown) => { transactions++; return f({}); } },
    "../../../../packages/db/src/live-service.ts": { ...service,
        checkLiveAnswer: async (_d: unknown, _s: unknown, _a: unknown, _m: string, _c: unknown, _v: string, at: Date, processingNow: () => Date) => { if(simulateQueue) await new Promise(resolve=>setTimeout(resolve,5)); checkedNow = processingNow(); arrival = at; checked++; if (failure)
            throw failure; return { itemId: item.id, pool, fingerprint: changedContent ? "obsolete" : rules.liveContentFingerprint(item, pool) }; },
        recordLiveAnswer: async (_d: unknown, _s: unknown, _a: unknown, attempt: Record<string, unknown>, _c: unknown, _v: string, at: Date, processingNow: () => Date) => { if(simulateQueue) await new Promise(resolve=>setTimeout(resolve,5)); writtenNow = processingNow(); bookedAt = at; if (writeFailure)
            throw Error('private sql'); writes++; last = attempt; return { duplicate: false, box: 2, dueAt: new Date(), streak: 1 }; },
        liveLobby: async () => { if (failure)
            throw failure; return { grade: 1, peers: [], rooms: [], rosterVersion: 'a'.repeat(64) }; }, getLiveRoom: async () => { if (failure)
            throw failure; return { phase: 'active' }; },
        createLiveRoom: async () => { writes++; return ID; }, joinLiveQuiz: async () => { writes++; return ID; }, actOnLiveRoom: async () => { writes++; },
    },
});
const api = loadTestModule('apps/web/lib/arena/live-api.ts', { 'server-only': {}, zod: { z }, './live-server': server });
const route = loadTestModule('apps/web/app/api/attempts/route.ts', {
    'next/server': { NextResponse: Response }, zod: { z }, '@domigo/content-schema': refs, '@domigo/content-loader': loader, '@domigo/engine': engine,
    '@/lib/content-service': content, '@domigo/db': { getDb: () => ({}), inScope, practiceItemDenial, getClassGrade: async () => 1, listReservedForClass: async () => new Set(), recordAttempt: () => { throw Error('live bypass'); } }, '@/lib/identity': identity,
    '@/lib/itemRef': itemRef, '@/lib/listeningRef': listeningRef, '@/lib/testRef': testRef, '@/lib/comprehensionRef': comprehensionRef,
    '@/lib/modi/speed-session': { speedSessionValid: () => true }, '@/lib/modi/attempt-policy': policy, '@/lib/arena/server': {}, '@/lib/arena/live-server': server,
});
const post = route.POST as (req: Request) => Promise<Response>, get = api.liveGet as (req: Request) => Promise<Response>, action = api.livePost as (req: Request) => Promise<Response>;
const req = (body: unknown, origin = 'https://synthetic.invalid') => new Request('https://synthetic.invalid/api/attempts', { method: 'POST', headers: { origin, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
const body = (kind = 'live') => ({ ownerId: user, clientAttemptId: crypto.randomUUID(), mode: `${kind}:${ID}`, input: { kind: kind === 'live' ? 'vocab' : 'choice', value: engine.vocabAnswers(item, pool).find(a => a.tier === 'full')!.text }, context: { roomId: ID, round: 0 } });
beforeEach(() => { role = 'student'; user = 'synthetic-own'; process.env.DOMIGO_LIVE_ARENA = 'approved-under-20-usd'; writes = transactions = checked = 0; failure = null; writeFailure = gradeFailure = false; changedContent = false; pool = 'deToEn'; item = loader.loadUnit('g1-u01').vocab[0]!; last = null; arrival = bookedAt = checkedNow = writtenNow = undefined; simulateQueue = false; });
process.on('exit', () => { if (oldEnv === undefined)
    delete process.env.DOMIGO_LIVE_ARENA;
else
    process.env.DOMIGO_LIVE_ARENA = oldEnv; });
it('A01 live/quiz only resolve server items and do not accept a client pool', async () => {
    for (const mode of ['live', 'quiz']) {
        const b = body(mode);
        assert.equal(b.mode.length, 41);
        assert.equal((await post(req({ ...b, itemId: item.id }))).status, 400);
    }
    assert.equal((await post(req({ ...body(), input: { ...body().input, pool: 'enToDe' } }))).status, 400);
    for (const mode of ['live', 'quiz'])
        assert.equal((await post(req(body(mode)))).status, 200);
    assert.equal(writes, 2);
    assert.equal(last!.itemId, item.id);
    assert.equal(transactions, 4);
});
it('A02 real engine grades all three server-selected answer pools', async () => {
    for (const p of ['deToEn', 'definition', 'carrier'] as const) {
        pool = p;
        const response = await post(req(body()));
        const result = await response.json();
        assert.equal(response.status, 200);
        assert.equal(result.tier, 'correct');
        assert.equal(result.xpAwarded, item.difficulty * 10);
    }
    assert.equal(writes, 3);
});
it('A03 disabled, preview, teacher, wrong owner and foreign origin fail before grading', async () => {
    delete process.env.DOMIGO_LIVE_ARENA;
    assert.equal((await post(req(body()))).status, 503);
    process.env.DOMIGO_LIVE_ARENA = 'approved-under-20-usd';
    for (const value of ['teacher', 'preview']) {
        role = value;
        assert.equal((await post(req(body()))).status, 403);
    }
    role = 'student';
    assert.equal((await post(req({ ...body(), ownerId: 'foreign' }))).status, 409);
    assert.equal((await post(req(body(), 'https://foreign.invalid'))).status, 403);
    assert.equal(checked, 0);
    assert.equal(writes, 0);
});
it('A04 forged context, reserved task and expired room cannot earn XP', async () => {
    for (const context of [{}, { roomId: ID, round: 15 }, { roomId: ID, round: -1 }, { roomId: ID, round: 0.5 }])
        assert.equal((await post(req({ ...body(), context }))).status, 409);
    for (const status of [403, 409, 410] as const) {
        failure = new rules.LiveError(status, 'live_question_closed');
        assert.equal((await post(req(body()))).status, status);
    }
    assert.equal(writes, 0);
});
it('A05 missing tables, grading failure or persistence failure return anonymous 503 without XP', async () => {
    for (const stage of ['check', 'grade', 'write']) {
        failure = stage === 'check' ? Error('private SQL') : null;
        gradeFailure = stage === 'grade';
        writeFailure = stage === 'write';
        const response = await post(req(body()));
        assert.equal(response.status, 503);
        assert.deepEqual(await response.json(), { ok: false, error: 'live_unavailable' });
    }
    assert.equal(writes, 0);
});
it('A06 read/action schemas reject raw identities, bad selection and foreign Origin', async () => {
    assert.equal((await get(new Request('https://synthetic.invalid/api/arena/live?userId=foreign'))).status, 400);
    assert.equal((await get(new Request('https://synthetic.invalid/api/arena/live', { headers: { 'sec-fetch-site': 'cross-site' } }))).status, 403);
    for (const b of [{ action: 'join', code: 'ABC234', userId: 'foreign' }, { action: 'create', selection: { kind: 'quiz', count: 2, units: [], mode: 'bad' } }, { action: 'next', id: 'bad' }])
        assert.equal((await action(req(b))).status, 400);
    assert.equal((await action(req({ action: 'join', code: 'ABC234' }, 'https://foreign.invalid'))).status, 403);
    assert.equal(writes, 0);
});
it('A07 lobby/callable teacher controls use real session plus scope and no-store', async () => {
    let response = await get(new Request('https://synthetic.invalid/api/arena/live'));
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    role = 'teacher';
    response = await get(new Request('https://synthetic.invalid/api/arena/live'));
    assert.equal(response.status, 403);
    response = await get(new Request(`https://synthetic.invalid/api/arena/live?classId=${CLASS}`));
    assert.equal(response.status, 200);
    response = await action(req({ action: 'start', id: ID, classId: CLASS }));
    assert.equal(response.status, 200);
    assert.equal(writes, 1);
});
it('A08 new read path with missing migration is stopped by 503 and exposes no SQL', async () => {
    failure = Error('private identity + sql');
    const response = await get(new Request(`https://synthetic.invalid/api/arena/live?id=${ID}`));
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), { ok: false, error: 'live_unavailable' });
});
it('A09 a published content change cannot grade the stale room prompt', async () => {
    changedContent = true;
    const response = await post(req(body()));
    assert.equal(response.status, 409);
    assert.deepEqual(await response.json(), { ok: false, error: 'live_content_changed' });
    assert.equal(writes, 0);
});

it('A10 a single trusted arrival timestamp survives identity, grading and transaction delay', async () => {
  const before = Date.now();
  const response = await post(req({...body(),latencyMs:0,context:{...body().context,receivedAt:'2000-01-01',latencyMs:0}}));
  assert.equal(response.status,200);assert(arrival instanceof Date);assert.equal(bookedAt,arrival);
  assert(arrival.getTime()>=before && arrival.getTime()<=Date.now());
});

it('A11 both SQL checks receive a fresh server clock while scoring retains ingress', async () => {
  simulateQueue = true;
  const response = await post(req(body()));
  assert.equal(response.status,200);
  assert(arrival && checkedNow && writtenNow);
  assert(checkedNow.getTime()>arrival.getTime());
  assert(writtenNow.getTime()>checkedNow.getTime());
  assert.equal(bookedAt,arrival);
});

it("reserve detected by the live resolver has the shared anonymous 403 contract", async()=>{
  failure=new rules.LiveError(409,"live_question_reserved");
  const response=await post(req(body()));assert.equal(response.status,403);assert.deepEqual(await response.json(),{ok:false,error:"item_reserved"});assert.equal(writes,0);
});
