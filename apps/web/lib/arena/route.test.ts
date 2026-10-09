import assert from "node:assert/strict";
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
import * as duel from "../../../../packages/db/src/duel-service.ts";
import { loadTestModule } from "./test-loader.ts";
const ID = "00000000-0000-4000-8000-000000000201";
let item = loader.loadUnit("g1-u01").vocab[0]!;
const answer = engine.vocabAnswers(item, "deToEn").find(a => a.tier === "full")!.text;
let user = "synthetic-own", role = "student", classId = "synthetic-class", validated = 0, writes = 0, transactions = 0, failure: Error | null = null;
let booked = false, gradingFailure = false;
let lastAttempt: Record<string, unknown> | null = null;
const player = () => ({ userId: user, classId, classScope: [classId] });
const boundaries: Record<string, unknown> = {
  "server-only": {}, "@domigo/content-loader": loader, "@domigo/db": { getDb: () => ({}), recordAttempt: () => { throw Error("duel bypassed transaction"); } },
  "@/auth": { auth: async () => ({ user: { id: user, classId, role } }) },
  "@/lib/content-service": { loadUnitWithOverrides: async (slug: string) => { if (gradingFailure) throw Error("synthetic private corpus detail"); return loader.loadUnit(slug); } }, "@/lib/student-view": { trainerGrade: () => 1 },
  "../../../../packages/db/src/duel-service.ts": { ...duel,
    validateDuelAnswer: async (_db: unknown, _scope: unknown, who: string) => { validated++; if (failure) throw failure; if (who !== "synthetic-own" || classId !== "synthetic-class") throw new duel.DuelError(403, "duel_forbidden"); if (booked) throw new duel.DuelError(409, "duel_question_closed"); return { itemId: item.id }; },
    recordAnswer: async (_db: unknown, _scope: unknown, attempt: Record<string, unknown>) => { lastAttempt = attempt; if (failure) throw failure; if (booked) throw new duel.DuelError(409, "duel_question_closed"); booked = true; writes++; return { duplicate: false, box: 2, dueAt: new Date(), streak: 1 }; },
    runDuelTransaction: async (work: (db: unknown) => unknown) => { transactions++; return work({}); },
    createDuel: async () => { if (failure) throw failure; writes++; return ID; }, getDuel: async () => ({ grade: 1 }), openRound: async () => { if (failure) throw failure; writes++; },
  },
};
const server = loadTestModule("apps/web/lib/arena/server.ts", boundaries);
const api = loadTestModule("apps/web/lib/arena/api.ts", { "server-only": {}, "@/auth": boundaries["@/auth"], "@/lib/identity": { getActingUser: async () => role === "student" ? player() : null }, zod: { z }, "./server": server });
const route = loadTestModule("apps/web/app/api/attempts/route.ts", {
  "next/server": { NextResponse: Response }, zod: { z }, "@domigo/content-schema": refs, "@domigo/content-loader": loader, "@domigo/engine": engine,
  "@/lib/content-service": boundaries["@/lib/content-service"], "@domigo/db": boundaries["@domigo/db"],
  "@/lib/identity": { getActingUser: async () => role === "student" ? player() : null },
  "@/lib/itemRef": itemRef, "@/lib/listeningRef": listeningRef, "@/lib/testRef": testRef, "@/lib/comprehensionRef": comprehensionRef,
  "@/lib/modi/speed-session": { speedSessionValid: () => true }, "@/lib/modi/attempt-policy": policy, "@/lib/arena/server": server,
});
const post = route.POST as (req: Request) => Promise<Response>;
const action = api.arenaAction as (req: Request, kind: "challenge" | "round") => Promise<Response>;
const req = (body: unknown, origin = "https://synthetic.invalid", path = "attempts") => new Request(`https://synthetic.invalid/api/${path}`, { method: "POST", headers: { "Content-Type": "application/json", origin }, body: JSON.stringify(body) });
const body = () => ({ ownerId: user, clientAttemptId: crypto.randomUUID(), mode: `duel:${ID}`, input: { kind: "choice", value: answer }, context: { duelId: ID, round: 0, question: 0 } });
beforeEach(() => { user = "synthetic-own"; role = "student"; classId = "synthetic-class"; validated = writes = transactions = 0; failure = null; booked = false; gradingFailure = false; lastAttempt = null; item = loader.loadUnit("g1-u01").vocab[0]!; });

it("W01 duel mode accepts only UUID and vocabulary choices, including all 41 characters", async () => {
  assert.equal(body().mode.length, 41); assert.equal(policy.knownAttemptMode(body().mode), true);
  for (const mode of ["duel:", "duel:bad", `${body().mode}extra`]) assert.equal(policy.knownAttemptMode(mode), false);
  for (const [itemId, input] of [[item.id, { kind: "vocab" }], ["g1u01.gi.synthetic", { kind: "choice" }], ["g5u01.w.fake", { kind: "choice" }]] as const) assert.equal(policy.validModeInput(body().mode, itemId, input), false);
  assert.equal((await post(req(body()))).status, 200);
});
it("W02 actual attempt route grades translation through engine and writes once in transaction", async () => {
  const response = await post(req(body())), result = await response.json();
  assert.equal(response.status, 200); assert.equal(result.tier, "correct"); assert.equal(result.xpAwarded, item.difficulty * 10);
  assert.equal(writes, 1); assert.equal(transactions, 1); assert.equal(validated, 1);
});
it("W03 foreign participant and foreign class are 403 before any write", async () => {
  user = "synthetic-outsider"; assert.equal((await post(req(body()))).status, 403);
  user = "synthetic-own"; classId = "synthetic-other-class"; assert.equal((await post(req(body()))).status, 403);
  assert.equal(writes, 0); assert.equal(transactions, 0);
});
it("W04 duplicate is 409 even with fresh client id; expired is 410", async () => {
  assert.equal((await post(req(body()))).status, 200);
  assert.equal((await post(req(body()))).status, 409); assert.equal(writes, 1);
  failure = new duel.DuelError(410, "duel_expired");
  assert.equal((await post(req(body()))).status, 410); assert.equal(writes, 1);
});
it("W05 missing migration/failing persistence returns 503 without points or private details", async () => {
  failure = Error("synthetic private database detail");
  const response = await post(req(body())); assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { ok: false, error: "arena_unavailable" }); assert.equal(writes, 0);
});
it("W06 teacher/preview and foreign Origin cannot post answers, invite or open round", async () => {
  role = "teacher"; assert.equal((await post(req(body()))).status, 401);
  for (const kind of ["challenge", "round"] as const) assert.equal((await action(req({}), kind)).status, 403);
  role = "student"; assert.equal((await post(req(body(), "https://foreign.invalid"))).status, 403);
  for (const kind of ["challenge", "round"] as const) assert.equal((await action(req({}, "https://foreign.invalid"), kind)).status, 403);
  assert.equal(writes, 0); assert.equal(validated, 0);
});
it("W07 duel context mismatch cannot grade/write; wrong input rejected", async () => {
  for (const context of [{}, { duelId: ID, round: 5, question: 0 }, { duelId: ID, round: 0, question: 3 }]) assert.equal((await post(req({ ...body(), context }))).status, 409);
  assert.equal((await post(req({ ...body(), input: { kind: "vocab", value: answer } }))).status, 400);
  assert.equal(writes, 0); assert.equal(validated, 0);
});
it("W08 challenge and round endpoints validate shape and use guarded transactional services", async () => {
  for (const invalid of [{}, { peer: 0, rosterVersion: "a".repeat(64) }, { peer: 1, rosterVersion: "a".repeat(64), classId: "foreign" }]) assert.equal((await action(req(invalid), "challenge")).status, 400);
  const challenge = await action(req({ peer: 1, rosterVersion: "a".repeat(64) }), "challenge");
  assert.deepEqual(await challenge.json(), { ok: true, id: ID });
  const round = await action(req({ duelId: ID, unitKey: "g1-u01" }), "round"); assert.equal(round.status, 200);
  assert.equal(transactions, 2); assert.equal(writes, 2);
});
it("W17 duel itemId must be absent; only server-resolved ID reaches grading and ledger", async () => {
  for (const itemId of [item.id, "g2u01.w.forged", "duel"]) {
    assert.equal((await post(req({ ...body(), itemId }))).status, 400);
  }
  assert.equal(validated, 0); assert.equal(writes, 0);
  assert.equal(policy.validModeInput(body().mode, undefined, { kind: "choice" }), true);
  assert.equal(policy.validModeInput("practice", undefined, { kind: "choice" }), false);
  const response = await post(req(body())); assert.equal(response.status, 200);
  assert.equal(lastAttempt!.itemId, item.id);
  assert.doesNotMatch(JSON.stringify(await response.json()), /itemId|g[1-4]u\d{2}\.w\./);
});
it("W18 duel route explicitly grades deToEn even when the carrier answer differs", async () => {
  const candidate = loader.listApprovedUnits().flatMap(slug => loader.loadUnit(slug).vocab).find(i => {
    const full = engine.vocabAnswers(i, "deToEn").find(a => a.tier === "full")?.text;
    return full && engine.gradeVocab(i, full, "deToEn").tier === "correct" && engine.gradeVocab(i, full, "carrier").tier !== "correct";
  });
  assert.ok(candidate, "must exercise a genuinely different answer pool"); item = candidate;
  const translation = engine.vocabAnswers(item, "deToEn").find(a => a.tier === "full")!.text;
  const response = await post(req({ ...body(), input: { kind: "choice", value: translation } }));
  assert.equal(response.status, 200); const result = await response.json();
  assert.equal(result.tier, "correct"); assert.equal(result.xpAwarded, item.difficulty * 10);
});
it("W19 arena errors log a fixed anonymous code without payload, SQL or identity", async () => {
  const calls: unknown[][] = [], original = console.warn; console.warn = (...args) => { calls.push(args); };
  try {
    failure = Error("synthetic-private-identity / SQL / payload");
    assert.equal((await post(req(body()))).status, 503);
    assert.equal((await action(req({ peer: 1, rosterVersion: "a".repeat(64) }), "challenge")).status, 503);
    assert.equal((await action(req({ duelId: ID, unitKey: "g1-u01" }), "round")).status, 503);
    failure = null; gradingFailure = true;
    assert.equal((await post(req(body()))).status, 503);
    assert.deepEqual(calls, Array.from({ length: 4 }, () => ["[arena] write_failed"]));
  } finally { console.warn = original; }
});
