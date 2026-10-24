import "server-only";
import { listApprovedUnits } from "@domigo/content-loader";
import type { RecordAttemptInput } from "@domigo/db";
import { auth } from "@/auth";
import { getActingUser, getTeacherForPage, type ActingUser } from "@/lib/identity";
import { loadUnitWithOverrides } from "@/lib/content-service";
import { runDuelTransaction } from "../../../../packages/db/src/duel-service.ts";
import { actOnLiveRoom, checkLiveAnswer, createLiveRoom, getLiveRoom, joinLiveQuiz, liveContext, liveLobby, recordLiveAnswer, type LiveActor, type LiveContext, type LiveSelection } from "../../../../packages/db/src/live-service.ts";
import { LiveError, liveContentFingerprint } from "../../../../packages/db/src/live-rules.ts";
export type { LiveView, LiveSelection } from "../../../../packages/db/src/live-service.ts";
export type LiveLobby = Awaited<ReturnType<typeof liveLobby>>;
/** GG enables this only after migration + measured cycle cost below USD 20.
 * No default-on rollout; clearing the switch immediately leaves Word Duel. */
export function liveEnabled(): boolean { return process.env.DOMIGO_LIVE_ARENA === "approved-under-20-usd"; }
export function requireLive(): void { if (!liveEnabled())
    throw new LiveError(503, "live_unavailable"); }
export function liveError(error: unknown): Response {
    console.warn("[live-arena] request_failed");
    return Response.json({ ok: false, error: error instanceof LiveError ? error.code : "live_unavailable" }, {
        status: error instanceof LiveError ? error.status : 503, headers: { "Cache-Control": "no-store" },
    });
}
export async function liveIdentity(req: Request, classId?: string) {
    requireLive();
    const session = await auth();
    if (!session?.user?.id)
        throw new LiveError(403, "live_forbidden");
    if (session.user.role === "student") {
        const player = await getActingUser(req);
        if (!player || player.userId !== session.user.id || classId && classId !== player.classId)
            throw new LiveError(403, "live_forbidden");
        return { actor: { userId: player.userId, classId: player.classId, teacher: false } satisfies LiveActor, scope: player.classScope };
    }
    if (session.user.role !== "teacher" || !classId)
        throw new LiveError(403, "live_forbidden");
    const teacher = await getTeacherForPage();
    if (!teacher || teacher.userId !== session.user.id)
        throw new LiveError(403, "live_forbidden");
    return { actor: { userId: teacher.userId, classId, teacher: true } satisfies LiveActor, scope: teacher.classScope };
}
export async function readLive(req: Request, classId?: string, id?: string) {
    const { actor, scope } = await liveIdentity(req, classId);
    if (id)
        return { room: await runDuelTransaction(tx => getLiveRoom(tx, scope, actor, id)) };
    const lobby = await runDuelTransaction(tx => liveLobby(tx, scope, actor));
    return { lobby, chapters: listApprovedUnits().filter(key => key.startsWith(`g${lobby.grade}-`)).map(key => ({ key, chapter: Number(key.slice(-2)) })) };
}
export async function createLive(req: Request, selection: LiveSelection, classId?: string) {
    const { actor, scope } = await liveIdentity(req, classId);
    const approved = new Set(listApprovedUnits());
    if (!selection.units.length || selection.units.some(key => !approved.has(key)))
        throw new LiveError(400, "live_bad_selection");
    const items = (await Promise.all(selection.units.map(loadUnitWithOverrides))).flatMap(unit => unit.vocab);
    return runDuelTransaction(tx => createLiveRoom(tx, scope, actor, selection, items));
}
export async function joinLive(req: Request, code: string, classId?: string) {
    const { actor, scope } = await liveIdentity(req, classId);
    return runDuelTransaction(tx => joinLiveQuiz(tx, scope, actor, code));
}
export async function actLive(req: Request, id: string, action: "accept" | "decline" | "start" | "next" | "close", classId?: string) {
    const { actor, scope } = await liveIdentity(req, classId);
    return runDuelTransaction(tx => actOnLiveRoom(tx, scope, actor, id, action));
}
export async function checkLiveAttempt(req: Request, player: ActingUser, mode: string, context: unknown, value: string, receivedAt = new Date()) {
    if (req.headers.get("origin") !== new URL(req.url).origin)
        throw new LiveError(403, "live_forbidden");
    const { actor, scope } = await liveIdentity(req);
    if (actor.teacher || actor.userId !== player.userId || actor.classId !== player.classId)
        throw new LiveError(403, "live_forbidden");
    const coordinates = liveContext(mode, context);
    const resolved = await runDuelTransaction(tx => checkLiveAnswer(tx, scope, actor, mode, coordinates, value, receivedAt));
    const ref = resolved.itemId.match(/^g([1-4])u(\d{2})\.w\./);
    if (!ref)
        throw new LiveError(409, "live_question_closed");
    const unit = await loadUnitWithOverrides(`g${ref[1]}-u${ref[2]}`);
    const item = unit.vocab.find(value => value.id === resolved.itemId);
    if (!item || liveContentFingerprint(item, resolved.pool) !== resolved.fingerprint)
        throw new LiveError(409, "live_content_changed");
    // This item stays server-only and is the same immutable input the route grades.
    return { coordinates, ...resolved, item };
}
export async function writeLiveAnswer(player: ActingUser, attempt: RecordAttemptInput, coordinates: LiveContext, value: string, receivedAt = new Date()) {
    requireLive();
    return runDuelTransaction(tx => recordLiveAnswer(tx, player.classScope, { userId: player.userId, classId: player.classId, teacher: false }, attempt, coordinates, value, receivedAt));
}
