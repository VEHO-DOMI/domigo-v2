/**
 * POST /api/assignments/submit — finalize a sitting. Reads the sitting's own
 * attempts (scoped by sessionId), scores them with the pure scorer (first
 * attempt per item, blanks = 0, weighted → Note), and writes the exact
 * score + Note. Idempotent: a re-submit of an already-submitted sitting just
 * returns its stored result.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getDb,
  getSessionAttempts,
  getStudentAssignmentView,
  scoreSubmittedSession,
  submitSession,
  type AssignmentMode,
  type NotenSchluessel,
  type SectionSpec,
} from "@domigo/db";
import { getActingUser } from "@/lib/identity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const Body = z.object({ assignmentId: z.string().regex(UUID), sessionId: z.string().regex(UUID) });

export async function POST(req: Request): Promise<Response> {
  const acting = await getActingUser(req);
  if (!acting) return NextResponse.json({ ok: false, error: "no_identity" }, { status: 401 });

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  const { assignmentId, sessionId } = parsed.data;

  const view = await getStudentAssignmentView(getDb(), assignmentId, acting.userId).catch(() => null);
  if (!view || view.assignment.classId !== acting.classId) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }
  const session = view.sessions.find((s) => s.id === sessionId);
  if (!session) return NextResponse.json({ ok: false, error: "no_session" }, { status: 404 });

  // Idempotent: already scored → return the stored result.
  if (session.submittedAt !== null && session.note !== null) {
    return NextResponse.json({ ok: true, note: session.note, displayPct: Number(session.scorePct), alreadySubmitted: true });
  }

  const attempts = await getSessionAttempts(getDb(), acting.userId, assignmentId, sessionId).catch(() => []);
  const specs: SectionSpec[] = view.sections.map((s) => ({
    position: s.position,
    kind: s.kind as SectionSpec["kind"],
    itemIds: (s.itemIds as string[] | null) ?? [],
    weightPct: s.weightPct,
  }));
  const score = scoreSubmittedSession({
    mode: view.assignment.mode as AssignmentMode,
    sections: specs,
    attempts,
    notenSchluessel: (view.assignment.notenSchluessel as NotenSchluessel | null) ?? null,
  });

  try {
    await submitSession(getDb(), sessionId, score, new Date());
    return NextResponse.json({ ok: true, note: score.note, displayPct: score.displayPct, perSection: score.perSection });
  } catch {
    return NextResponse.json({ ok: false, error: "persist_failed", note: score.note, displayPct: score.displayPct });
  }
}
