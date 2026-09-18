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
  parseCheckupSectionConfig,
  scoreCheckup,
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

  const isCheckup = view.assignment.mode === "checkup";

  // C-1: a checkup's sections carry their /20 points in section_config; the
  // per-item worth is points / item count (= 1 under the one-item-one-point
  // publish gate). Fallback for a malformed row: item count = points.
  const checkupSections = view.sections.map((s) => {
    const itemIds = (s.itemIds as string[] | null) ?? [];
    const cfg = parseCheckupSectionConfig(s.sectionConfig);
    return { position: s.position, itemIds, points: cfg?.points ?? itemIds.length };
  });
  const checkupOutOf = checkupSections.reduce((n, s) => n + s.points, 0);

  // Idempotent: already scored → return the stored result. A checkup stores
  // points-only (note stays null, doc 21 §8-③), so its marker is scorePct.
  if (session.submittedAt !== null && (isCheckup ? session.scorePct !== null : session.note !== null)) {
    const displayPct = Number(session.scorePct);
    if (isCheckup) {
      const points = Math.round((displayPct / 100) * checkupOutOf * 100) / 100;
      return NextResponse.json({ ok: true, checkup: { points, outOf: checkupOutOf }, displayPct, alreadySubmitted: true });
    }
    return NextResponse.json({ ok: true, note: session.note, displayPct, alreadySubmitted: true });
  }

  const attempts = await getSessionAttempts(getDb(), acting.userId, assignmentId, sessionId).catch(() => []);

  if (isCheckup) {
    const score = scoreCheckup(checkupSections, attempts);
    const exactPct = score.outOf > 0 ? (score.points / score.outOf) * 100 : 0;
    const displayPct = Math.round(exactPct * 100) / 100;
    try {
      // Points-only: note is null by decision — never a Note on a checkup.
      await submitSession(getDb(), sessionId, { displayPct, note: null }, new Date());
      return NextResponse.json({
        ok: true,
        checkup: { points: score.points, outOf: score.outOf },
        displayPct,
        perSection: score.perSection,
      });
    } catch {
      return NextResponse.json({ ok: false, error: "persist_failed", checkup: { points: score.points, outOf: score.outOf }, displayPct });
    }
  }

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
