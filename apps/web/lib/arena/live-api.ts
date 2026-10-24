import "server-only";
import { z } from "zod";
import { actLive, createLive, joinLive, liveError, readLive } from "./live-server";
const ID = z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
const classId = ID.optional();
const Body = z.discriminatedUnion("action", [
    z.object({ action: z.literal("create"), classId, selection: z.object({ kind: z.enum(["battle", "quiz"]), mode: z.enum(["translation", "definition", "context"]), units: z.array(z.string().regex(/^g[1-4]-u\d{2}$/)).min(1).max(15), count: z.union([z.literal(5), z.literal(10), z.literal(15)]), peer: z.number().int().positive().optional(), rosterVersion: z.string().regex(/^[0-9a-f]{64}$/).optional() }).strict() }).strict(),
    z.object({ action: z.literal("join"), classId, code: z.string().regex(/^[A-Z2-9]{6}$/) }).strict(),
    z.object({ action: z.enum(["accept", "decline", "start", "next", "close"]), classId, id: ID }).strict(),
]);
const Query = z.object({ classId, id: ID.optional() }).strict();
const json = (data: unknown, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
export async function liveGet(req: Request): Promise<Response> {
    if (req.headers.get("sec-fetch-site") === "cross-site" || req.headers.has("origin") && req.headers.get("origin") !== new URL(req.url).origin)
        return json({ ok: false, error: "forbidden" }, 403);
    const parsed = Query.safeParse(Object.fromEntries(new URL(req.url).searchParams));
    if (!parsed.success)
        return json({ ok: false, error: "bad_request" }, 400);
    // Countable, anonymous request marker: no identity, room, content or answer.
    console.info("[live-arena] poll");
    try {
        return json({ ok: true, ...await readLive(req, parsed.data.classId, parsed.data.id) });
    }
    catch (error) {
        return liveError(error);
    }
}
export async function livePost(req: Request): Promise<Response> {
    if (req.headers.get("origin") !== new URL(req.url).origin)
        return json({ ok: false, error: "forbidden" }, 403);
    if (req.headers.get("content-type")?.split(";")[0]?.trim() !== "application/json")
        return json({ ok: false, error: "bad_request" }, 400);
    const parsed = Body.safeParse(await req.json().catch(() => null));
    if (!parsed.success)
        return json({ ok: false, error: "bad_request" }, 400);
    console.info("[live-arena] action");
    const body = parsed.data;
    try {
        if (body.action === "create")
            return json({ ok: true, id: await createLive(req, body.selection, body.classId) });
        if (body.action === "join")
            return json({ ok: true, id: await joinLive(req, body.code, body.classId) });
        await actLive(req, body.id, body.action, body.classId);
        return json({ ok: true });
    }
    catch (error) {
        return liveError(error);
    }
}
