/** cgo-123. Every live operation runs in runDuelTransaction. Room row locks
 * serialize transitions and final answer + existing recordAttempt writes. */
import { and, asc, eq, inArray, isNotNull, isNull, or, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import type { VocabItem } from "@domigo/content-schema";
import type { Db } from "./index.ts";
import { classSettings, liveMembers, liveRooms, studentProfile, v2Classes, v2IdentityUsers } from "./schema.ts";
import { assertWritableScope, type ClassScope } from "./scope.ts";
import { leaderboardName } from "./leaderboard-service.ts";
import { listReservedForClass } from "./assignment-service.ts";
import { recordAttempt, type RecordAttemptInput } from "./persist.ts";
import { advanceLive, answerElapsed, liveScores, nextQuiz, selectLiveQuestions, startLive, LiveError, LIVE_INVITE_MS, LIVE_MAX_PLAYERS, LIVE_ROOM_MS, LIVE_PROCESSING_MS, type LiveClock, type LiveKind, type LiveMode, type LivePool, type LivePhase } from "./live-rules.ts";
export interface LiveActor {
    userId: string;
    classId: string;
    teacher: boolean;
}
type Room = typeof liveRooms.$inferSelect;
type Gate = {
    classId: string;
    grade: number;
    teacherId: string;
};
export interface LiveContext {
    roomId: string;
    round: number;
}
const ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
export function liveContext(mode: string, value: unknown): LiveContext {
    const c = value as Partial<LiveContext> | null;
    if (!c || typeof c.roomId !== "string" || !ID.test(c.roomId) || !Number.isInteger(c.round) || c.round! < 0 || c.round! >= 15
        || !([`live:${c.roomId}`, `quiz:${c.roomId}`].includes(mode)))
        throw new LiveError(409, "live_question_closed");
    return { roomId: c.roomId, round: c.round! };
}
async function liveGate(db: Db, classScope: ClassScope, actor: LiveActor): Promise<Gate> {
    const [row] = await db.select({ classId: v2Classes.id, grade: v2Classes.grade, teacherId: v2Classes.teacherId }).from(v2Classes)
        .innerJoin(classSettings, eq(classSettings.classId, v2Classes.id))
        .innerJoin(v2IdentityUsers, and(eq(v2IdentityUsers.id, actor.userId), actor.teacher ? eq(v2IdentityUsers.role, "teacher")
        : and(eq(v2IdentityUsers.role, "student"), eq(v2IdentityUsers.classId, v2Classes.id), isNotNull(v2IdentityUsers.claimedAt))))
        .where(and(inArray(v2Classes.id, [...classScope]), eq(v2Classes.id, actor.classId), isNull(v2Classes.archivedAt), eq(classSettings.purpose, "regular"), eq(classSettings.leaderboard, true), actor.teacher ? eq(v2Classes.teacherId, actor.userId) : undefined, sql `${v2Classes.grade} between 1 and 4`)).for("share");
    if (!row)
        throw new LiveError(403, "live_forbidden");
    return row;
}
async function liveRoster(db: Db, classScope: ClassScope, classId: string) {
    const member = alias(v2IdentityUsers, "live_roster_member");
    return db.select({ id: member.id, givenName: member.givenName, nickname: member.displayName, avatar: studentProfile.avatar })
        .from(member).leftJoin(studentProfile, eq(studentProfile.userId, member.id))
        .where(and(inArray(member.classId, [...classScope]), eq(member.classId, classId), eq(member.role, "student"), isNotNull(member.claimedAt)))
        .orderBy(asc(member.createdAt), asc(member.id)).for("share", { of: member });
}
async function fingerprint(ids: readonly string[]) {
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ids.join("|")));
    return Array.from(new Uint8Array(digest), n => n.toString(16).padStart(2, "0")).join("");
}
function clock(room: Room): LiveClock { return { kind: room.kind as LiveKind, phase: room.phase as LivePhase, round: room.round, questionCount: room.questions.length, phaseAt: room.phaseAt.getTime(), expiresAt: room.expiresAt.getTime() }; }
async function saveClock(db: Db, classScope: ClassScope, room: Room, next: LiveClock) {
    assertWritableScope(classScope, "saveClock");
    await db.update(liveRooms).set({ phase: next.phase, round: next.round, phaseAt: new Date(next.phaseAt) })
        .where(and(inArray(liveRooms.classId, [...classScope]), eq(liveRooms.classId, room.classId), eq(liveRooms.id, room.id)));
    return { ...room, phase: next.phase, round: next.round, phaseAt: new Date(next.phaseAt) };
}
async function expireRooms(db: Db, classScope: ClassScope, classId: string, at: Date) {
    assertWritableScope(classScope, "expireRooms");
    await db.update(liveRooms).set({ phase: "cancelled" }).where(and(inArray(liveRooms.classId, [...classScope]), eq(liveRooms.classId, classId), sql `${liveRooms.phase} not in ('complete','cancelled')`, or(sql `(${liveRooms.expiresAt} + case when ${liveRooms.phase} in ('active','countdown') then ${LIVE_PROCESSING_MS} * interval '1 millisecond' else interval '0 milliseconds' end) <= ${at.toISOString()}::timestamptz`, and(eq(liveRooms.phase, "pending"), sql `${liveRooms.phaseAt} <= ${new Date(at.getTime() - LIVE_INVITE_MS).toISOString()}::timestamptz`))));
}
async function roomMembers(db: Db, classScope: ClassScope, room: Room) {
    return db.select().from(liveMembers).where(and(inArray(liveMembers.classId, [...classScope]), eq(liveMembers.classId, room.classId), eq(liveMembers.roomId, room.id))).orderBy(asc(liveMembers.seat));
}
async function lockedRoom(db: Db, classScope: ClassScope, actor: LiveActor, id: string, at: Date) {
    if (!ID.test(id))
        throw new LiveError(403, "live_forbidden");
    const gate = await liveGate(db, classScope, actor);
    const [found] = await db.select().from(liveRooms).where(and(inArray(liveRooms.classId, [...classScope]), eq(liveRooms.classId, gate.classId), eq(liveRooms.id, id))).for("update");
    if (!found || found.grade !== gate.grade)
        throw new LiveError(403, "live_forbidden");
    const members = await roomMembers(db, classScope, found);
    if (actor.teacher ? (found.kind !== "quiz" || found.hostId !== actor.userId) : (!members.some(m => m.userId === actor.userId) && found.guestId !== actor.userId))
        throw new LiveError(403, "live_forbidden");
    const roster = await liveRoster(db, classScope, gate.classId), ids = new Set(roster.map(r => r.id));
    const invalid = members.some(m => !ids.has(m.userId)) || (found.kind === "battle" ? (!ids.has(found.hostId) || !ids.has(found.guestId!)) : found.hostId !== gate.teacherId);
    const next = invalid ? { ...clock(found), phase: "cancelled" as const } : advanceLive(clock(found), members, at.getTime());
    const changed = next.phase !== found.phase || next.round !== found.round || next.phaseAt !== found.phaseAt.getTime();
    const room = changed ? await saveClock(db, classScope, found, next) : found;
    return { room, members, roster, gate, invalid };
}
export async function liveLobby(db: Db, classScope: ClassScope, actor: LiveActor, at = new Date()) {
    const gate = await liveGate(db, classScope, actor), roster = await liveRoster(db, classScope, gate.classId);
    const peers = roster.filter(p => p.id !== actor.userId);
    const rows = await db.select({ id: liveRooms.id, kind: liveRooms.kind, mode: liveRooms.mode, phase: liveRooms.phase, hostId: liveRooms.hostId, guestId: liveRooms.guestId, phaseAt: liveRooms.phaseAt, expiresAt: liveRooms.expiresAt })
        .from(liveRooms).where(and(inArray(liveRooms.classId, [...classScope]), eq(liveRooms.classId, gate.classId), eq(liveRooms.grade, gate.grade), sql `${liveRooms.phase} not in ('complete','cancelled')`, sql `${liveRooms.expiresAt} > ${at.toISOString()}::timestamptz`, or(eq(liveRooms.hostId, actor.userId), eq(liveRooms.guestId, actor.userId), actor.teacher ? undefined : sql `exists(select 1 from ${liveMembers} where ${liveMembers.roomId} = ${liveRooms.id} and ${liveMembers.userId} = ${actor.userId} and ${liveMembers.classId} = ${liveRooms.classId})`)))
        .orderBy(asc(liveRooms.phaseAt)).limit(20);
    return { grade: gate.grade, peers: peers.map((p, i) => ({ number: i + 1, name: leaderboardName(p.givenName, p.nickname), avatar: p.avatar ?? 1 })), rosterVersion: await fingerprint(peers.map(p => p.id)),
        rooms: rows.filter(r => r.phase !== "pending" || r.phaseAt.getTime() + LIVE_INVITE_MS > at.getTime()).map(r => ({ id: r.id, kind: r.kind, mode: r.mode, phase: r.phase,
            invited: r.phase === "pending" && r.guestId === actor.userId, expiresAt: (r.phase === "pending" ? r.phaseAt.getTime() + LIVE_INVITE_MS : r.expiresAt.getTime()),
            opponent: roster.find(p => p.id === (r.hostId === actor.userId ? r.guestId : r.hostId)) ? leaderboardName(roster.find(p => p.id === (r.hostId === actor.userId ? r.guestId : r.hostId))!.givenName, roster.find(p => p.id === (r.hostId === actor.userId ? r.guestId : r.hostId))!.nickname) : null })) };
}
export interface LiveSelection {
    kind: LiveKind;
    mode: LiveMode;
    units: string[];
    count: 5 | 10 | 15;
    peer?: number;
    rosterVersion?: string;
}
export async function createLiveRoom(db: Db, classScope: ClassScope, actor: LiveActor, selection: LiveSelection, items: readonly VocabItem[], at = new Date()) {
    assertWritableScope(classScope, "createLiveRoom");
    const gate = await liveGate(db, classScope, actor);
    if ((selection.kind === "quiz") !== actor.teacher)
        throw new LiveError(403, "live_forbidden");
    const roster = await liveRoster(db, classScope, gate.classId), peers = roster.filter(p => p.id !== actor.userId);
    let guestId: string | null = null;
    if (selection.kind === "battle") {
        if (!Number.isInteger(selection.peer) || !peers[selection.peer! - 1] || selection.rosterVersion !== await fingerprint(peers.map(p => p.id)))
            throw new LiveError(409, "live_roster_changed");
        guestId = peers[selection.peer! - 1]!.id;
    }
    const reserved = await listReservedForClass(db, classScope, gate.classId), id = crypto.randomUUID();
    const questions = selectLiveQuestions(items, gate.grade, selection.units, selection.mode, selection.kind === "battle" ? 5 : selection.count, id, reserved);
    await expireRooms(db, classScope, gate.classId, at);
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const code = Array.from(crypto.getRandomValues(new Uint8Array(6)), n => alphabet[n % alphabet.length]).join("");
    try {
        await db.insert(liveRooms).values({ id, classId: gate.classId, grade: gate.grade, kind: selection.kind, hostId: actor.userId, guestId, code, mode: selection.mode,
            phase: selection.kind === "battle" ? "pending" : "lobby", questions, round: 0, phaseAt: at, createdAt: at, expiresAt: new Date(at.getTime() + LIVE_ROOM_MS) });
        if (selection.kind === "battle")
            await db.insert(liveMembers).values({ roomId: id, classId: gate.classId, userId: actor.userId, seat: 0, answers: [] });
        return id;
    }
    catch (error) {
        const e = error as {
            code?: string;
            cause?: {
                code?: string;
            };
        };
        if ((e.code ?? e.cause?.code) === "23505")
            throw new LiveError(409, "live_already_active");
        throw error;
    }
}
export async function joinLiveQuiz(db: Db, classScope: ClassScope, actor: LiveActor, code: string, at = new Date()) {
    assertWritableScope(classScope, "joinLiveQuiz");
    if (actor.teacher || !/^[A-Z2-9]{6}$/.test(code))
        throw new LiveError(403, "live_forbidden");
    const gate = await liveGate(db, classScope, actor);
    const [room] = await db.select().from(liveRooms).where(and(inArray(liveRooms.classId, [...classScope]), eq(liveRooms.classId, gate.classId), eq(liveRooms.grade, gate.grade), eq(liveRooms.code, code), eq(liveRooms.kind, "quiz"))).for("update");
    if (!room || room.phase !== "lobby" || room.expiresAt <= at || room.hostId !== gate.teacherId)
        throw new LiveError(410, "live_room_closed");
    const members = await roomMembers(db, classScope, room);
    if (members.some(m => m.userId === actor.userId))
        return room.id;
    if (members.length >= LIVE_MAX_PLAYERS)
        throw new LiveError(409, "live_room_full");
    await db.insert(liveMembers).values({ roomId: room.id, classId: gate.classId, userId: actor.userId, seat: Array.from({ length: LIVE_MAX_PLAYERS }, (_, i) => i).find(i => !members.some(m => m.seat === i))!, answers: [] });
    return room.id;
}
export async function actOnLiveRoom(db: Db, classScope: ClassScope, actor: LiveActor, id: string, action: "accept" | "decline" | "start" | "next" | "close", at = new Date()) {
    assertWritableScope(classScope, "actOnLiveRoom");
    const { room, members } = await lockedRoom(db, classScope, actor, id, at);
    if (["complete", "cancelled"].includes(room.phase))
        throw new LiveError(410, "live_room_closed");
    let next: LiveClock;
    if (action === "accept" || action === "decline") {
        if (actor.teacher || room.kind !== "battle" || room.guestId !== actor.userId || room.phase !== "pending")
            throw new LiveError(403, "live_forbidden");
        if (action === "decline")
            next = { ...clock(room), phase: "cancelled" };
        else {
            await db.insert(liveMembers).values({ roomId: room.id, classId: room.classId, userId: actor.userId, seat: 1, answers: [] });
            next = startLive(clock(room), 2, at.getTime());
        }
    }
    else {
        if (room.hostId !== actor.userId || action !== "close" && (!actor.teacher || room.kind !== "quiz"))
            throw new LiveError(403, "live_forbidden");
        next = action === "close" ? { ...clock(room), phase: "cancelled" } : action === "start" ? startLive(clock(room), members.length, at.getTime()) : nextQuiz(clock(room), at.getTime());
    }
    await saveClock(db, classScope, room, next);
}
export interface LiveView {
    id: string;
    kind: LiveKind;
    mode: LiveMode;
    phase: LivePhase;
    grade: number;
    round: number;
    total: number;
    serverNow: number;
    phaseAt: number;
    expiresAt: number;
    code: string | null;
    teacher: boolean;
    invited: boolean;
    canStart: boolean;
    canNext: boolean;
    canClose: boolean;
    answered: boolean;
    answerCount: number;
    xp: number;
    question: {
        prompt: string;
        options: string[];
        chapter: number;
    } | null;
    players: {
        seat: number;
        name: string;
        avatar: number;
        me: boolean;
        score: number;
        correct: boolean | null;
    }[];
}
export async function getLiveRoom(db: Db, classScope: ClassScope, actor: LiveActor, id: string, at = new Date()): Promise<LiveView> {
    const state = await lockedRoom(db, classScope, actor, id, at);
    let { room } = state;
    const { members, roster, invalid } = state;
    const question = room.questions[room.round];
    if (question && ["countdown", "active"].includes(room.phase)) {
        const reserved = await listReservedForClass(db, classScope, room.classId);
        if (reserved.has(question.itemId) || !question.itemId.startsWith(`g${room.grade}u`))
            room = await saveClock(db, classScope, room, { ...clock(room), phase: "cancelled" });
    }
    const finished = ["result", "complete"].includes(room.phase), closed = room.phase === "cancelled", mine = members.find(m => m.userId === actor.userId);
    const scores = liveScores(room.kind as LiveKind, members, finished ? room.round : room.round - 1);
    return { id: room.id, kind: room.kind as LiveKind, mode: room.mode as LiveMode, phase: room.phase as LivePhase, grade: room.grade,
        round: room.round, total: room.questions.length, serverNow: at.getTime(), phaseAt: room.phaseAt.getTime(), expiresAt: room.expiresAt.getTime(),
        code: actor.teacher && room.phase === "lobby" ? room.code : null, teacher: actor.teacher, invited: room.phase === "pending" && room.guestId === actor.userId,
        canStart: actor.teacher && room.phase === "lobby" && members.length > 0, canNext: actor.teacher && room.phase === "result",
        canClose: room.hostId === actor.userId && !["complete", "cancelled"].includes(room.phase),
        answered: !!mine?.answers[room.round], answerCount: members.filter(m => m.answers[room.round]).length, xp: mine?.answers.reduce((n, a) => n + (a?.xp ?? 0), 0) ?? 0,
        question: !invalid && !closed && question && ["countdown", "active"].includes(room.phase) && !mine?.answers[room.round]
            ? { prompt: question.prompt, options: room.kind === "quiz" ? [...question.options] : [], chapter: Number(question.unitKey.slice(-2)) } : null,
        players: invalid || closed ? [] : members.map((m, i) => {
            const peer = roster.find(p => p.id === m.userId)!;
            return { seat: m.seat, name: leaderboardName(peer.givenName, peer.nickname), avatar: peer.avatar ?? 1, me: m.userId === actor.userId,
                score: scores[i] ?? 0, correct: finished ? (m.answers[room.round]?.correct ?? false) : m.userId === actor.userId ? (m.answers[room.round]?.correct ?? null) : null };
        }) };
}
async function answerable(db: Db, classScope: ClassScope, actor: LiveActor, context: LiveContext, choice: string, at: Date, processingNow: () => Date) {
    if (actor.teacher || !Number.isInteger(context.round))
        throw new LiveError(403, "live_forbidden");
    const state = await lockedRoom(db, classScope, actor, context.roomId, at), { room, members } = state;
    // Evaluate the processing clock AFTER the row lock, so queuing is included.
    // A late processing failure is a retryable server failure, never an invented
    // late student answer. No round can advance while an eligible request is pending.
    const processingMs = processingNow().getTime() - at.getTime();
    if (!Number.isFinite(processingMs) || processingMs < 0 || processingMs >= LIVE_PROCESSING_MS)
        throw new LiveError(503, "live_processing_timeout");
    const member = members.find(m => m.userId === actor.userId), question = room.questions[room.round];
    if (!member || state.invalid || !question || room.round !== context.round || member.answers[room.round])
        throw new LiveError(409, "live_question_closed");
    const elapsed = answerElapsed(clock(room), at.getTime());
    if (typeof choice !== "string" || !choice.trim() || choice.length > 300 || room.kind === "quiz" && !question.options.includes(choice))
        throw new LiveError(400, "live_bad_answer");
    if (!new RegExp(`^g${room.grade}u\\d{2}\\.w\\.`).test(question.itemId) || question.pool !== (room.mode === "translation" ? "deToEn" : room.mode === "definition" ? "definition" : "carrier"))
        throw new LiveError(409, "live_question_closed");
    if ((await listReservedForClass(db, classScope, room.classId)).has(question.itemId))
        throw new LiveError(409, "live_question_reserved");
    return { ...state, member, question, elapsed };
}
/** Internal reference only: never serialize this result to a browser. */
export async function checkLiveAnswer(db: Db, classScope: ClassScope, actor: LiveActor, mode: string, context: LiveContext, choice: string, at = new Date(), processingNow: () => Date = () => at): Promise<{
    itemId: string;
    pool: LivePool;
    fingerprint: string;
}> {
    const { room, question } = await answerable(db, classScope, actor, context, choice, at, processingNow);
    if (mode !== `${room.kind === "battle" ? "live" : "quiz"}:${room.id}`)
        throw new LiveError(403, "live_forbidden");
    return { itemId: question.itemId, pool: question.pool, fingerprint: question.fingerprint };
}
/** Ordinary recordAttempt remains the only XP writer. Both its insert and the
 * server-time room receipt commit together; a duplicate receipt rolls back. */
export async function recordLiveAnswer(db: Db, classScope: ClassScope, actor: LiveActor, attempt: RecordAttemptInput, context: LiveContext, choice: string, at = new Date(), processingNow: () => Date = () => at) {
    assertWritableScope(classScope, "recordLiveAnswer");
    const state = await answerable(db, classScope, actor, context, choice, at, processingNow), { room, member, question, elapsed } = state;
    if (attempt.userId !== actor.userId || attempt.classId !== room.classId || attempt.grade !== room.grade || attempt.kind !== "vocab" || attempt.itemId !== question.itemId
        || attempt.unitSlug !== question.unitKey || attempt.mode !== `${room.kind === "battle" ? "live" : "quiz"}:${room.id}`)
        throw new LiveError(403, "live_forbidden");
    const answers = [...member.answers];
    answers[room.round] = { attemptId: attempt.clientAttemptId, correct: attempt.tier === "correct", elapsedMs: elapsed, xp: attempt.xpAwarded };
    await db.update(liveMembers).set({ answers }).where(and(inArray(liveMembers.classId, [...classScope]), eq(liveMembers.classId, room.classId), eq(liveMembers.roomId, room.id), eq(liveMembers.userId, actor.userId)));
    const result = await recordAttempt(db, classScope, { ...attempt, latencyMs: elapsed, context: { roomId: room.id, round: room.round } });
    if (result.duplicate)
        throw new LiveError(409, "live_question_closed");
    const updated = state.members.map(m => m.userId === actor.userId ? { ...m, answers } : m), next = advanceLive(clock(room), updated, at.getTime());
    if (next.phase !== room.phase)
        await saveClock(db, classScope, room, next);
    return result;
}
