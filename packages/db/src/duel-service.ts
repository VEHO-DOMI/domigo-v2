/** cgo-112 · Class-only asynchronous duels. No XP writer: recordAttempt remains
 * the sole ledger/XP entry point. Mutations run inside runDuelTransaction;
 * the locked duel row serializes turns and closes the double-answer race. */
import { and, asc, desc, eq, inArray, isNotNull, isNull, or, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { Client } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import type { VocabItem } from "@domigo/content-schema";
import { canonical, gradeVocab, vocabAnswers } from "@domigo/engine";
import type { Db } from "./index.ts";
import * as schema from "./schema.ts";
import { classSettings, duels, practiceAttempts, studentProfile, v2Classes, v2IdentityUsers, type DuelRound } from "./schema.ts";
import { assertWritableScope, type ClassScope } from "./scope.ts";
import { listReservedForClass } from "./assignment-service.ts";
import { leaderboardName } from "./leaderboard-service.ts";
import { recordAttempt, type RecordAttemptInput, type RecordAttemptResult } from "./persist.ts";

export const DUEL_ROUNDS = 5;
export const DUEL_QUESTIONS = 3;
export const DUEL_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;
export const DUEL_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
export type DuelStatus = "active" | "complete" | "expired";
export class DuelError extends Error {
  readonly status: 400 | 403 | 409 | 410 | 503;
  readonly code: string;
  constructor(status: 400 | 403 | 409 | 410 | 503, code: string) { super(code); this.status = status; this.code = code; }
}
export interface DuelContext { duelId: string; round: number; question: number }
export function duelContext(mode: string, context: unknown): DuelContext {
  const c = context as Partial<DuelContext> | null;
  if (!c || typeof c.duelId !== "string" || !DUEL_ID.test(c.duelId) || mode !== `duel:${c.duelId}`
    || !Number.isInteger(c.round) || !Number.isInteger(c.question) || c.round! < 0 || c.round! >= DUEL_ROUNDS || c.question! < 0 || c.question! >= DUEL_QUESTIONS) {
    throw new DuelError(409, "duel_question_closed");
  }
  return { duelId: c.duelId, round: c.round!, question: c.question! };
}

/** Request-scoped connection, closed even on rollback. Uses the already installed
 * Neon driver and Node 24's WebSocket; no new service, table or credentials.
 * HTTP getDb() cannot offer an interactive transaction. Never use this in Edge. */
export async function runDuelTransaction<T>(work: (tx: Db) => Promise<T>): Promise<T> {
  const connectionString = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
  if (!connectionString) throw new DuelError(503, "arena_unavailable");
  const client = new Client({ connectionString, connectionTimeoutMillis: 10000 });
  client.on("error", () => { console.warn("[arena] connection_error"); });
  try {
    await client.connect();
    return await drizzle(client, { schema }).transaction(async tx => {
      await tx.execute(sql`set local statement_timeout = '10s'`);
      return work(tx as unknown as Db);
    });
  } finally { await client.end().catch(() => {}); }
}

type Duel = typeof duels.$inferSelect;
type Seat = "p1" | "p2";
type Gate = { classId: string; grade: number };
type Peer = { id: string; givenName: string | null; nickname: string; avatar: number | null };
export interface ArenaPeer { number: number; name: string; avatar: number }
export interface DuelSummary {
  id: string; opponent: string; avatar: number; mode: "vocab" | "grammar";
  status: DuelStatus; myTurn: boolean; myScore: number; theirScore: number;
  result: "win" | "loss" | "draw" | null; date: string; xp: number;
  rounds: { chapter: number; mine: boolean[]; theirs: boolean[] }[];
}
export interface ArenaData {
  enabled: boolean; unavailable: boolean; peers: ArenaPeer[]; rosterVersion: string;
  active: DuelSummary[]; history: DuelSummary[]; waiting: number;
  stats: { played: number; won: number; winRate: number; xp: number };
}
export interface DuelView extends DuelSummary {
  me: string; myAvatar: number; grade: number; canOpen: boolean;
  next: { round: number; question: number; prompt: string; options: string[] } | null;
}
export type DuelPrompt = (itemId: string) => Promise<string>;
export const emptyArena = (unavailable = false): ArenaData => ({ enabled: false, unavailable, peers: [], rosterVersion: "", active: [], history: [], waiting: 0, stats: { played: 0, won: 0, winRate: 0, xp: 0 } });

async function arenaGate(db: Db, classScope: ClassScope, userId: string): Promise<Gate> {
  if (!userId || classScope.length === 0) throw new DuelError(403, "arena_disabled");
  const [row] = await db.select({ classId: v2Classes.id, grade: v2Classes.grade }).from(v2IdentityUsers)
    .innerJoin(v2Classes, eq(v2Classes.id, v2IdentityUsers.classId))
    .innerJoin(classSettings, eq(classSettings.classId, v2Classes.id))
    .where(and(inArray(v2Classes.id, [...classScope]), eq(v2IdentityUsers.id, userId), eq(v2IdentityUsers.role, "student"),
      isNotNull(v2IdentityUsers.claimedAt), isNull(v2Classes.archivedAt), eq(classSettings.purpose, "regular"), eq(classSettings.leaderboard, true),
      sql`${v2Classes.grade} between 1 and 4`)).for("share");
  if (!row) throw new DuelError(403, "arena_disabled");
  return row;
}
async function arenaRoster(db: Db, classScope: ClassScope, classId: string): Promise<Peer[]> {
  const member = alias(v2IdentityUsers, "arena_member");
  return db.select({ id: member.id, givenName: member.givenName, nickname: member.displayName, avatar: studentProfile.avatar })
    .from(member).leftJoin(studentProfile, eq(studentProfile.userId, member.id))
    .where(and(inArray(member.classId, [...classScope]), eq(member.classId, classId), eq(member.role, "student"), isNotNull(member.claimedAt)))
    .orderBy(asc(member.createdAt), asc(member.id)).for("share", { of: member });
}
/** Home reads access only, never other children's names or results. */
export async function arenaEnabled(db: Db, classScope: ClassScope, userId: string): Promise<boolean> {
  try { return (await arenaGate(db, classScope, userId)).grade > 0; }
  catch (error) { if (!(error instanceof DuelError && error.status === 403)) console.warn("[arena] read_failed"); return false; }
}
const avatarOf = (peer: Peer) => peer.avatar && peer.avatar >= 1 && peer.avatar <= 50 ? peer.avatar : 1;
const nameOf = (peer: Peer) => leaderboardName(peer.givenName, peer.nickname);
async function rosterFingerprint(peers: Peer[]): Promise<string> {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(peers.map(p => p.id).join("|")));
  return Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2, "0")).join("");
}
function statusAt(duel: Duel, at: Date): DuelStatus {
  return duel.status === "active" && at.getTime() - duel.updatedAt.getTime() >= DUEL_EXPIRY_MS ? "expired" : duel.status as DuelStatus;
}
/** New round owner answers all three first. The other child then answers it
 * and chooses the next Chapter. No parallel/question-skipping write is legal. */
export function whoseTurn(rounds: readonly DuelRound[]): Seat | "complete" {
  for (let i = 0; i < rounds.length; i++) {
    const picker = i % 2 === 0 ? "p1" : "p2", other = picker === "p1" ? "p2" : "p1";
    if (rounds[i]![`${picker}Answers`].length < DUEL_QUESTIONS) return picker;
    if (rounds[i]![`${other}Answers`].length < DUEL_QUESTIONS) return other;
  }
  return rounds.length === DUEL_ROUNDS ? "complete" : rounds.length % 2 === 0 ? "p1" : "p2";
}
const seatOf = (duel: Duel, userId: string): Seat => duel.p1 === userId ? "p1" : "p2";
const vocabularyInGrade = (itemId: string, grade: number) => new RegExp(`^g${grade}u\\d{2}\\.w\\.`).test(itemId);
function nextQuestion(duel: Duel, seat: Seat): { round: number; question: number; itemId: string; options: string[] } | null {
  const round = duel.rounds.findIndex(r => r[`${seat}Answers`].length < DUEL_QUESTIONS);
  if (round < 0) return null;
  const question = duel.rounds[round]![`${seat}Answers`].length;
  return { round, question, ...duel.rounds[round]!.questions[question]! };
}

/** Both participants must STILL belong to the current claimed roster. A moved,
 * unclaimed or removed child never exposes old names/results to a former class. */
async function ownDuels(db: Db, classScope: ClassScope, userId: string, gate: Gate, duelId?: string, lock = false): Promise<Duel[]> {
  const entry = alias(duels, "own_duel");
  const p1 = alias(v2IdentityUsers, "duel_p1"), p2 = alias(v2IdentityUsers, "duel_p2");
  const query = db.select({ duel: entry }).from(entry)
    .innerJoin(p1, and(eq(p1.id, entry.p1), eq(p1.classId, entry.classId), eq(p1.role, "student"), isNotNull(p1.claimedAt)))
    .innerJoin(p2, and(eq(p2.id, entry.p2), eq(p2.classId, entry.classId), eq(p2.role, "student"), isNotNull(p2.claimedAt)))
    .where(and(inArray(entry.classId, [...classScope]), eq(entry.classId, gate.classId), eq(entry.grade, gate.grade),
      or(eq(entry.p1, userId), eq(entry.p2, userId)), duelId ? eq(entry.id, duelId) : undefined)).orderBy(desc(entry.updatedAt), asc(entry.id)).limit(duelId ? 1 : 50);
  return (await (lock ? query.for("update", { of: entry }) : query)).map(row => row.duel);
}
/** Correlated to the already scoped duel, without returning identity fields. */
function missingParticipant() {
  return sql`not exists (select 1 from ${v2IdentityUsers} where ${v2IdentityUsers.id} = ${duels.p1}
    and ${v2IdentityUsers.classId} = ${duels.classId} and ${v2IdentityUsers.role} = 'student' and ${v2IdentityUsers.claimedAt} is not null)
    or not exists (select 1 from ${v2IdentityUsers} where ${v2IdentityUsers.id} = ${duels.p2}
    and ${v2IdentityUsers.classId} = ${duels.classId} and ${v2IdentityUsers.role} = 'student' and ${v2IdentityUsers.claimedAt} is not null)`;
}
/** Aggregate all eligible history in SQL; the fifty-row detail cap must not
 * truncate Played/Won/XP. No copied counters and no result bonus. */
async function arenaStats(db: Db, classScope: ClassScope, userId: string, gate: Gate): Promise<ArenaData["stats"]> {
  const [row] = await db.select({
    played: sql<number>`count(distinct ${duels.id}) filter (where ${duels.status} = 'complete')::int`,
    won: sql<number>`count(distinct ${duels.id}) filter (where ${duels.status} = 'complete' and ${duels.winner} = ${userId})::int`,
    xp: sql<number>`coalesce(sum(${practiceAttempts.xpAwarded}), 0)::int`,
  }).from(duels).leftJoin(practiceAttempts, and(eq(practiceAttempts.classId, duels.classId), eq(practiceAttempts.userId, userId),
    eq(practiceAttempts.mode, sql`'duel:' || ${duels.id}::text`)))
    .where(and(inArray(duels.classId, [...classScope]), eq(duels.classId, gate.classId), eq(duels.grade, gate.grade),
    or(eq(duels.p1, userId), eq(duels.p2, userId)), sql`not (${missingParticipant()})`));
  const played = Number(row?.played ?? 0), won = Number(row?.won ?? 0);
  return { played, won, winRate: played ? Math.round(won / played * 100) : 0, xp: Number(row?.xp ?? 0) };
}
async function duelXp(db: Db, classScope: ClassScope, userId: string, classId: string, rows: Duel[]): Promise<Map<string, number>> {
  if (rows.length === 0) return new Map();
  const result = await db.select({ mode: practiceAttempts.mode, xp: sql<number>`coalesce(sum(${practiceAttempts.xpAwarded}), 0)::int` })
    .from(practiceAttempts).where(and(inArray(practiceAttempts.classId, [...classScope]), eq(practiceAttempts.classId, classId), eq(practiceAttempts.userId, userId),
      inArray(practiceAttempts.mode, rows.map(d => `duel:${d.id}`))))
    .groupBy(practiceAttempts.mode);
  return new Map(result.map(r => [r.mode.slice(5), Number(r.xp)]));
}
function summary(duel: Duel, userId: string, peer: Peer, xp: number, at: Date): DuelSummary {
  const seat = seatOf(duel, userId), other = seat === "p1" ? "p2" : "p1", status = statusAt(duel, at);
  const myScore = duel[`${seat}Score`], theirScore = duel[`${other}Score`];
  return { id: duel.id, opponent: nameOf(peer), avatar: avatarOf(peer), mode: duel.mode as "vocab" | "grammar", status,
    myTurn: status === "active" && whoseTurn(duel.rounds) === seat, myScore, theirScore,
    result: status !== "complete" ? null : myScore > theirScore ? "win" : myScore < theirScore ? "loss" : "draw",
    date: duel.updatedAt.toISOString(), xp,
    rounds: duel.rounds.map(r => ({ chapter: Number(r.unitKey.slice(-2)), mine: r[`${seat}Answers`], theirs: r[`${other}Answers`] })) };
}
export async function listDuels(db: Db, classScope: ClassScope, userId: string, at = new Date()): Promise<ArenaData> {
  try {
    const gate = await arenaGate(db, classScope, userId);
    await expire(db, classScope, userId, at);
    const rows = await ownDuels(db, classScope, userId, gate);
    const roster = await arenaRoster(db, classScope, gate.classId);
    const peers = roster.filter(r => r.id !== userId);
    const xp = await duelXp(db, classScope, userId, gate.classId, rows);
    const summaries = rows.map(d => summary(d, userId, roster.find(r => r.id === (d.p1 === userId ? d.p2 : d.p1))!, xp.get(d.id) ?? 0, at));
    const active = summaries.filter(d => d.status === "active");
    return { enabled: true, unavailable: false, rosterVersion: await rosterFingerprint(peers),
      peers: peers.map((p, i) => ({ number: i + 1, name: nameOf(p), avatar: avatarOf(p) })), active,
      history: summaries.filter(d => d.status !== "active").slice(0, 20), waiting: active.filter(d => d.myTurn).length,
      stats: await arenaStats(db, classScope, userId, gate) };
  } catch (error) {
    if (!(error instanceof DuelError && error.status === 403)) console.warn("[arena] read_failed");
    return emptyArena(!(error instanceof DuelError && error.status === 403));
  }
}
export async function getDuel(db: Db, classScope: ClassScope, userId: string, id: string, promptFor: DuelPrompt, at = new Date()): Promise<DuelView> {
  if (!DUEL_ID.test(id)) throw new DuelError(403, "duel_forbidden");
  const gate = await arenaGate(db, classScope, userId);
  await expire(db, classScope, userId, at);
  const [duel] = await ownDuels(db, classScope, userId, gate, id);
  if (!duel) throw new DuelError(403, "duel_forbidden");
  const roster = await arenaRoster(db, classScope, gate.classId);
  const seat = seatOf(duel, userId), me = roster.find(r => r.id === userId)!;
  const peer = roster.find(r => r.id === (seat === "p1" ? duel.p2 : duel.p1))!;
  const xp = await duelXp(db, classScope, userId, gate.classId, [duel]);
  const s = summary(duel, userId, peer, xp.get(id) ?? 0, at);
  const next = s.myTurn ? nextQuestion(duel, seat) : null;
  if (next && !vocabularyInGrade(next.itemId, gate.grade)) throw new DuelError(409, "duel_question_closed");
  // A newly reserved question is never exposed, even if it was drawn earlier.
  if (next && (await listReservedForClass(db, classScope, gate.classId)).has(next.itemId)) throw new DuelError(409, "duel_question_reserved");
  return { ...s, me: nameOf(me), myAvatar: avatarOf(me), grade: gate.grade,
    canOpen: s.myTurn && !next && duel.rounds.length < DUEL_ROUNDS,
    next: next ? { round: next.round, question: next.question, prompt: await promptFor(next.itemId), options: next.options } : null };
}

/** Expiry never sets a winner or changes updated_at (reads cannot revive a duel). */
export async function expire(db: Db, classScope: ClassScope, userId: string, at = new Date()): Promise<void> {
  assertWritableScope(classScope, "expire");
  const gate = await arenaGate(db, classScope, userId);
  await db.update(duels).set({ status: "expired", winner: null }).where(and(inArray(duels.classId, [...classScope]), eq(duels.classId, gate.classId),
    or(eq(duels.p1, userId), eq(duels.p2, userId)), sql`${duels.status} <> 'expired'`,
    or(and(eq(duels.status, "active"), sql`${duels.updatedAt} <= ${new Date(at.getTime() - DUEL_EXPIRY_MS)}`), sql`(${missingParticipant()})`)));
}
export async function createDuel(db: Db, classScope: ClassScope, userId: string, peerNumber: number, rosterVersion: string, at = new Date()): Promise<string> {
  assertWritableScope(classScope, "createDuel");
  const gate = await arenaGate(db, classScope, userId);
  const peers = (await arenaRoster(db, classScope, gate.classId)).filter(r => r.id !== userId);
  if (!Number.isInteger(peerNumber) || peerNumber < 1 || !peers[peerNumber - 1]) throw new DuelError(403, "duel_forbidden");
  if (await rosterFingerprint(peers) !== rosterVersion) throw new DuelError(409, "roster_changed");
  await expire(db, classScope, userId, at);
  // Unique constraint, not a preflight read: reverse-direction concurrent invites
  // cannot create two active rows. Error details (including identities) stay private.
  try {
    const [row] = await db.insert(duels).values({ classId: gate.classId, grade: gate.grade, p1: userId, p2: peers[peerNumber - 1]!.id,
      mode: "vocab", status: "active", rounds: [], createdAt: at, updatedAt: at }).returning({ id: duels.id });
    return row!.id;
  } catch (error) {
    const e = error as { code?: string; cause?: { code?: string } };
    if ((e.code ?? e.cause?.code) === "23505") throw new DuelError(409, "duel_already_active");
    throw error;
  }
}

function hash(value: string): number {
  let n = 2166136261;
  for (const c of value) n = Math.imul(n ^ c.charCodeAt(0), 16777619);
  return n >>> 0;
}
/** Deterministic selection of authored questions/options. No answer key is copied
 * into rounds; each candidate is checked by the same vocabulary grader. */
export function selectDuelQuestions(pool: readonly VocabItem[], grade: number, unitKey: string, seed: string, reserved: ReadonlySet<string>): DuelRound["questions"] {
  if (!new RegExp(`^g${grade}-u\\d{2}$`).test(unitKey)) throw new DuelError(403, "duel_wrong_grade");
  const allowed = pool.filter(item => item.id.startsWith(`g${grade}u`) && !reserved.has(item.id));
  const candidates = allowed.filter(item => item.id.startsWith(`${unitKey.replace("-", "")}.w.`)).sort((a, b) => hash(`${seed}:${a.id}`) - hash(`${seed}:${b.id}`) || a.id.localeCompare(b.id));
  const questions: DuelRound["questions"] = [], prompts = new Set<string>();
  for (const item of candidates) {
    if (prompts.has(canonical(item.g))) continue;
    const answer = vocabAnswers(item, "deToEn").find(a => a.tier === "full")?.text;
    if (!answer) continue;
    const seen = new Set([canonical(answer)]);
    const distractors = [...item.mc, ...allowed.map(w => w.w)].filter(option => {
      const key = canonical(option);
      if (!key || seen.has(key) || gradeVocab(item, option, "deToEn").tier !== "wrong") return false;
      seen.add(key); return true;
    }).slice(0, 3);
    if (distractors.length !== 3) continue;
    const options = [answer, ...distractors].sort((a, b) => hash(`${seed}:${item.id}:${a}`) - hash(`${seed}:${item.id}:${b}`) || a.localeCompare(b));
    questions.push({ itemId: item.id, options }); prompts.add(canonical(item.g));
    if (questions.length === DUEL_QUESTIONS) return questions;
  }
  throw new DuelError(409, "duel_chapter_empty");
}
async function activeDuel(db: Db, classScope: ClassScope, userId: string, id: string, at: Date, lock: boolean): Promise<Duel> {
  if (!DUEL_ID.test(id)) throw new DuelError(403, "duel_forbidden");
  const gate = await arenaGate(db, classScope, userId);
  const [duel] = await ownDuels(db, classScope, userId, gate, id, lock);
  if (!duel) throw new DuelError(403, "duel_forbidden");
  const status = statusAt(duel, at);
  if (status === "expired") throw new DuelError(410, "duel_expired");
  if (status !== "active") throw new DuelError(409, "duel_question_closed");
  return duel;
}
export async function openRound(db: Db, classScope: ClassScope, userId: string, id: string, unitKey: string, pool: readonly VocabItem[], at = new Date()): Promise<void> {
  assertWritableScope(classScope, "openRound");
  const duel = await activeDuel(db, classScope, userId, id, at, true), seat = seatOf(duel, userId);
  if (duel.mode !== "vocab" || whoseTurn(duel.rounds) !== seat || nextQuestion(duel, seat) || duel.rounds.length >= DUEL_ROUNDS
    || duel.rounds.some(r => r.unitKey === unitKey)) throw new DuelError(409, "duel_round_closed");
  const reserved = await listReservedForClass(db, classScope, duel.classId);
  const questions = selectDuelQuestions(pool, duel.grade, unitKey, `${id}:${duel.rounds.length}`, reserved);
  await db.update(duels).set({ rounds: [...duel.rounds, { unitKey, questions, p1Answers: [], p2Answers: [] }], updatedAt: at })
    .where(and(inArray(duels.classId, [...classScope]), eq(duels.id, id), eq(duels.classId, duel.classId)));
}
export async function validateDuelAnswer(db: Db, classScope: ClassScope, userId: string, context: DuelContext, choice: string, at = new Date(), lock = false): Promise<{ duel: Duel; itemId: string }> {
  const duel = await activeDuel(db, classScope, userId, context.duelId, at, lock), seat = seatOf(duel, userId);
  const next = nextQuestion(duel, seat);
  if (duel.mode !== "vocab" || whoseTurn(duel.rounds) !== seat || !next || next.round !== context.round || next.question !== context.question
    || !vocabularyInGrade(next.itemId, duel.grade) || !next.options.includes(choice)) throw new DuelError(409, "duel_question_closed");
  if ((await listReservedForClass(db, classScope, duel.classId)).has(next.itemId)) throw new DuelError(409, "duel_question_reserved");
  return { duel, itemId: next.itemId };
}
/** Pure completion, derived only from the fifteen recorded correctness flags. */
export function completeDuel(rounds: readonly DuelRound[], p1: string, p2: string): { p1Score: number; p2Score: number; status: "active" | "complete"; winner: string | null } {
  const p1Score = rounds.reduce((n, r) => n + r.p1Answers.filter(Boolean).length, 0);
  const p2Score = rounds.reduce((n, r) => n + r.p2Answers.filter(Boolean).length, 0);
  const complete = rounds.length === DUEL_ROUNDS && rounds.every(r => r.p1Answers.length === DUEL_QUESTIONS && r.p2Answers.length === DUEL_QUESTIONS);
  return { p1Score, p2Score, status: complete ? "complete" : "active", winner: !complete || p1Score === p2Score ? null : p1Score > p2Score ? p1 : p2 };
}
/** Called only by /api/attempts AFTER engine grading, inside the same transaction
 * as the lock/recheck, ordinary recordAttempt and duel update. A reused attempt
 * id is a conflict, never a free duel answer. Any failure rolls ALL writes back. */
export async function recordAnswer(db: Db, classScope: ClassScope, attempt: RecordAttemptInput, context: DuelContext, choice: string, at = new Date()): Promise<RecordAttemptResult> {
  assertWritableScope(classScope, "recordAnswer");
  const { duel, itemId } = await validateDuelAnswer(db, classScope, attempt.userId, context, choice, at, true);
  if (attempt.itemId !== itemId) throw new DuelError(409, "duel_question_closed");
  if (attempt.classId !== duel.classId || attempt.grade !== duel.grade || attempt.mode !== `duel:${duel.id}` || attempt.kind !== duel.mode) throw new DuelError(403, "duel_forbidden");
  const recorded = await recordAttempt(db, classScope, { ...attempt, context });
  if (recorded.duplicate) throw new DuelError(409, "duel_question_closed");
  const rounds = structuredClone(duel.rounds), seat = seatOf(duel, attempt.userId);
  rounds[context.round]![`${seat}Answers`].push(attempt.tier === "correct");
  await db.update(duels).set({ rounds, ...completeDuel(rounds, duel.p1, duel.p2), updatedAt: at })
    .where(and(inArray(duels.classId, [...classScope]), eq(duels.id, duel.id), eq(duels.classId, duel.classId)));
  return recorded;
}
