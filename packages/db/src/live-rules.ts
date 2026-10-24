/** cgo-123: server-owned room rules, independent of storage and browser clocks. */
import { createHash } from "node:crypto";
import type { VocabItem } from "@domigo/content-schema";
import { canonical, gradeVocab, vocabAnswers } from "@domigo/engine";
export const LIVE_POLL_MS = 2000;
export const LIVE_INVITE_MS = 30000;
export const LIVE_COUNTDOWN_MS = 4000;
export const LIVE_RESULT_MS = 3000;
export const LIVE_QUESTION_MS = 15000;
export const LIVE_ROOM_MS = 60 * 60 * 1000;
export const LIVE_MAX_PLAYERS = 40;
export const LIVE_MODES = ["translation", "definition", "context"] as const;
export type LiveMode = typeof LIVE_MODES[number];
export type LiveKind = "battle" | "quiz";
export type LivePhase = "pending" | "lobby" | "countdown" | "active" | "result" | "complete" | "cancelled";
export type LivePool = "deToEn" | "definition" | "carrier";
export interface LiveQuestion {
    itemId: string;
    unitKey: string;
    pool: LivePool;
    prompt: string;
    options: string[];
    fingerprint: string;
}
/** No raw answer text. Normal answer XP and the room receipt share a transaction. */
export interface LiveReceipt {
    attemptId: string;
    correct: boolean;
    elapsedMs: number;
    xp: number;
}
export interface LiveClock {
    kind: LiveKind;
    phase: LivePhase;
    round: number;
    questionCount: number;
    phaseAt: number;
    expiresAt: number;
}
export interface LivePlayerAnswers {
    answers: (LiveReceipt | null)[];
}
export class LiveError extends Error {
    readonly status: 400 | 403 | 409 | 410 | 503;
    readonly code: string;
    constructor(status: 400 | 403 | 409 | 410 | 503, code: string) { super(code); this.status = status; this.code = code; this.name = "LiveError"; }
}
export const livePool = (mode: LiveMode): LivePool => mode === "translation" ? "deToEn" : mode === "definition" ? "definition" : "carrier";
export const livePrompt = (item: VocabItem, mode: LiveMode): string => mode === "translation" ? item.g : mode === "definition" ? item.d : item.s;
/** A published edit during a room must not grade an old prompt with new keys. */
export function liveContentFingerprint(item: VocabItem, pool: LivePool): string {
    return createHash("sha256").update(JSON.stringify([item.id, pool, item.g, item.d, item.s, vocabAnswers(item, pool), item.difficulty])).digest("hex");
}
export function quizPoints(correct: boolean, elapsedMs: number): number {
    if (!Number.isFinite(elapsedMs) || elapsedMs < 0)
        throw new LiveError(409, "live_question_closed");
    return correct ? Math.max(500, Math.floor(1000 - elapsedMs / LIVE_QUESTION_MS * 500)) : 0;
}
/** The server's receive time is the only clock accepted for an answer. */
export function answerElapsed(clock: LiveClock, now: number): number {
    if (clock.phase !== "active" || !Number.isFinite(now) || now < clock.phaseAt
        || now >= clock.phaseAt + LIVE_QUESTION_MS || now >= clock.expiresAt)
        throw new LiveError(410, "live_question_closed");
    return now - clock.phaseAt;
}
export function battleRoundWinner(a: LiveReceipt | null | undefined, b: LiveReceipt | null | undefined): 0 | 1 | null {
    if (!a?.correct && !b?.correct)
        return null;
    if (!a?.correct)
        return 1;
    if (!b?.correct)
        return 0;
    return a.elapsedMs === b.elapsedMs ? null : a.elapsedMs < b.elapsedMs ? 0 : 1;
}
export function liveScores(kind: LiveKind, players: readonly LivePlayerAnswers[], through: number): number[] {
    if (kind === "quiz")
        return players.map(p => p.answers.slice(0, through + 1).reduce((n, a) => n + (a ? quizPoints(a.correct, a.elapsedMs) : 0), 0));
    const scores = [0, 0];
    for (let i = 0; i <= through; i++) {
        const winner = battleRoundWinner(players[0]?.answers[i], players[1]?.answers[i]);
        if (winner !== null)
            scores[winner]!++;
    }
    return scores;
}
export function battleComplete(clock: LiveClock, players: readonly LivePlayerAnswers[]): boolean {
    const scores = liveScores("battle", players, clock.round), remaining = clock.questionCount - clock.round - 1;
    return remaining <= 0 || Math.abs(scores[0]! - scores[1]!) > remaining;
}
/** Polls may advance a deadline, never fabricate a missing student's attempt. */
export function advanceLive(clock: LiveClock, players: readonly LivePlayerAnswers[], now: number): LiveClock {
    const next = { ...clock };
    if (["complete", "cancelled"].includes(next.phase))
        return next;
    if (now >= next.expiresAt || next.phase === "pending" && now >= next.phaseAt + LIVE_INVITE_MS)
        return { ...next, phase: "cancelled" };
    if (next.phase === "countdown" && now >= next.phaseAt)
        next.phase = "active";
    if (next.phase === "active" && (now >= next.phaseAt + LIVE_QUESTION_MS || players.length > 0 && players.every(p => p.answers[next.round]))) {
        next.phase = "result";
        next.phaseAt = now;
    }
    else if (next.kind === "battle" && next.phase === "result" && now >= next.phaseAt + LIVE_RESULT_MS) {
        if (battleComplete(next, players))
            next.phase = "complete";
        else {
            next.round++;
            next.phase = "countdown";
            next.phaseAt = now + LIVE_COUNTDOWN_MS;
        }
    }
    return next;
}
export function startLive(clock: LiveClock, playerCount: number, now: number): LiveClock {
    if (!["pending", "lobby"].includes(clock.phase) || now >= clock.expiresAt || playerCount < (clock.kind === "battle" ? 2 : 1)
        || playerCount > LIVE_MAX_PLAYERS || clock.kind === "battle" && playerCount !== 2
        || clock.phase === "pending" && now >= clock.phaseAt + LIVE_INVITE_MS)
        throw new LiveError(409, "live_cannot_start");
    return { ...clock, phase: "countdown", round: 0, phaseAt: now + LIVE_COUNTDOWN_MS };
}
export function nextQuiz(clock: LiveClock, now: number): LiveClock {
    if (clock.kind !== "quiz" || clock.phase !== "result" || now >= clock.expiresAt)
        throw new LiveError(409, "live_cannot_advance");
    return clock.round + 1 >= clock.questionCount ? { ...clock, phase: "complete" }
        : { ...clock, round: clock.round + 1, phase: "countdown", phaseAt: now + LIVE_COUNTDOWN_MS };
}
function hash(value: string): number {
    let n = 2166136261;
    for (const c of value)
        n = Math.imul(n ^ c.charCodeAt(0), 16777619);
    return n >>> 0;
}
/** Select authored material only; the engine rejects ambiguous or duplicate MC
 * options. Future questions and internal item references stay on the server. */
export function selectLiveQuestions(items: readonly VocabItem[], grade: number, units: readonly string[], mode: LiveMode, count: number, seed: string, reserved: ReadonlySet<string>): LiveQuestion[] {
    if (![1, 2, 3, 4].includes(grade) || !LIVE_MODES.includes(mode) || ![5, 10, 15].includes(count)
        || !units.length || units.length > 15 || new Set(units).size !== units.length
        || units.some(u => !new RegExp(`^g${grade}-u\\d{2}$`).test(u)))
        throw new LiveError(400, "live_bad_selection");
    const pool = livePool(mode), prefixes = units.map(u => `${u.replace("-", "")}.w.`);
    const candidates = items.filter(i => !reserved.has(i.id) && prefixes.some(prefix => i.id.startsWith(prefix)))
        .sort((a, b) => hash(`${seed}:${a.id}`) - hash(`${seed}:${b.id}`) || a.id.localeCompare(b.id));
    const result: LiveQuestion[] = [], prompts = new Set<string>();
    for (const item of candidates) {
        const prompt = livePrompt(item, mode), key = canonical(prompt);
        if (!key || prompts.has(key))
            continue;
        const answer = vocabAnswers(item, pool).find(a => a.tier === "full")?.text;
        if (!answer)
            continue;
        const options = [answer, ...item.mc];
        if (new Set(options.map(canonical)).size !== 4 || options.filter(o => gradeVocab(item, o, pool).tier === "correct").length !== 1
            || item.mc.some(o => gradeVocab(item, o, pool).tier !== "wrong"))
            continue;
        options.sort((a, b) => hash(`${seed}:${item.id}:${a}`) - hash(`${seed}:${item.id}:${b}`) || a.localeCompare(b));
        const unitKey = `g${grade}-u${item.id.slice(3, 5)}`;
        result.push({ itemId: item.id, unitKey, pool, prompt, options, fingerprint: liveContentFingerprint(item, pool) });
        prompts.add(key);
        if (result.length === count)
            return result;
    }
    throw new LiveError(409, "live_not_enough_questions");
}
