/**
 * POST /api/study-path — record a Study Path node completion (B1).
 *
 * Thin + additive: the authoritative learning record (grading, XP, the Leitner
 * review queue, streak) already persisted through /api/attempts as the student
 * answered. This only stores node state. Server authority: the nodeId must be one
 * the unit's graph actually produces, and stars are re-derived from the reported
 * accuracy (never the client's star integer). Idempotent + keep-best in the DB.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { UnitSlug } from "@domigo/content-schema";
import { loadUnit } from "@domigo/content-loader";
import { buildUnitNodes, getDb, recordNodeCompletion, starsFor, STUDY_PATH_MAX_NODE_ID_LEN } from "@domigo/db";
import type { NodeKind } from "@domigo/db";
import { getActingUser } from "@/lib/identity";

export const runtime = "nodejs"; // content-loader uses node:fs → not edge
export const dynamic = "force-dynamic";

const Body = z.object({
  unitSlug: UnitSlug,
  nodeId: z.string().min(1).max(STUDY_PATH_MAX_NODE_ID_LEN),
  stars: z.number().int().min(0).max(3),
  accuracy: z.number().min(0).max(1),
});

export async function POST(req: Request): Promise<Response> {
  const acting = await getActingUser(req);
  if (!acting) return NextResponse.json({ ok: false, error: "no_identity" }, { status: 401 });

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  const { unitSlug, nodeId, accuracy } = parsed.data;

  let stars: number;
  let kind: NodeKind;
  try {
    const unit = loadUnit(unitSlug);
    const node = buildUnitNodes(unit.vocab, unit.grammar).find((n) => n.id === nodeId);
    if (!node) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
    kind = node.kind;
    stars = node.graded ? starsFor(Math.round(accuracy * node.itemCount), node.itemCount) : 0;
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  try {
    const res = await recordNodeCompletion(getDb(), {
      userId: acting.userId,
      classId: acting.classId,
      unitSlug,
      grade: Number(unitSlug.charAt(1)),
      nodeId,
      kind,
      stars,
    });
    return NextResponse.json({ ok: true, stars: res.stars });
  } catch {
    return NextResponse.json({ ok: false, error: "persist_failed", stars });
  }
}
