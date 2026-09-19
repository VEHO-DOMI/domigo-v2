/**
 * POST /api/admin/progress-adjust — the grandmaster adjusts one child's progress
 * by hand (K1b, Koki's ruling P-R5: the replacement for the struck import).
 *
 * THE GATE IS HERE, not in the UI. `isGrandmaster` is checked SERVER-SIDE and
 * BEFORE the database is touched at all: hiding the form on the class page is
 * convenience, this 403 is the security. (A rank check that runs after a read has
 * happened is not a gate — it is a disclosure with a redirect on the end.)
 *
 * NOTHING THE CLIENT SAYS ABOUT WHO BELONGS WHERE IS BELIEVED. The body names a
 * class and a student; the server resolves the class itself, reads its roster under
 * the OWNER's id (the ordinary owner-scoped service, unchanged), and refuses unless
 * the named student is actually on that roster. So the worst a tampered request can
 * do is name a pair that does not exist.
 *
 * The unit's node graph is built HERE and passed down, because @domigo/db has no
 * dependency on the content loader — the same split as /api/study-path, which is
 * the ordinary write path for exactly these rows.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { UnitSlug } from "@domigo/content-schema";
import { listApprovedUnits, loadUnit } from "@domigo/content-loader";
import {
  buildUnitNodes,
  getClassForGrandmaster,
  getDb,
  grantXp,
  listRoster,
  markUnitDone,
} from "@domigo/db";
import { getTeacher } from "@/lib/teacher";
import { isGrandmaster } from "@/lib/grandmaster";
import { gradeOfSlug } from "@/lib/grade-scope";

export const runtime = "nodejs"; // content-loader uses node:fs → not edge
export const dynamic = "force-dynamic";

/** Upper bound on ONE grant. Not a policy — a typo guard (a slipped extra zero). */
export const MAX_XP_PER_GRANT = 100_000;

const Body = z.object({
  studentId: z.string().min(1),
  classId: z.string().min(1),
  vocabXp: z.number().int().min(0).max(MAX_XP_PER_GRANT).optional(),
  grammarXp: z.number().int().min(0).max(MAX_XP_PER_GRANT).optional(),
  unitSlug: UnitSlug.optional(),
});

export async function POST(req: Request): Promise<Response> {
  const teacher = await getTeacher(req);
  if (!teacher) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  // Fail closed, before any query.
  if (!isGrandmaster(teacher.userId)) return NextResponse.json({ ok: false, error: "not_grandmaster" }, { status: 403 });

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  const { studentId, classId, unitSlug } = parsed.data;
  const vocabXp = parsed.data.vocabXp ?? 0;
  const grammarXp = parsed.data.grammarXp ?? 0;
  if (vocabXp + grammarXp <= 0 && !unitSlug) {
    return NextResponse.json({ ok: false, error: "nothing_to_do" }, { status: 400 });
  }

  // Who this class really is, and who owns it — read from the database, not the body.
  const cls = await getClassForGrandmaster(getDb(), classId).catch(() => null);
  if (!cls) return NextResponse.json({ ok: false, error: "class_not_found" }, { status: 404 });

  // Membership, under the OWNER's authorization: listRoster is owner-scoped, so a
  // class that does not belong to `cls.teacherId` yields an empty list by construction.
  const roster = await listRoster(getDb(), classId, cls.teacherId).catch(() => []);
  if (!roster.some((r) => r.id === studentId)) {
    return NextResponse.json({ ok: false, error: "not_in_class" }, { status: 404 });
  }

  // A unit from another school year would write rows the child's own pages never
  // show — dead data that looks like progress on the teacher's screen.
  let nodes: ReturnType<typeof buildUnitNodes> = [];
  if (unitSlug) {
    if (gradeOfSlug(unitSlug) !== cls.grade) {
      return NextResponse.json({ ok: false, error: "wrong_grade" }, { status: 400 });
    }
    if (!listApprovedUnits().includes(unitSlug)) {
      return NextResponse.json({ ok: false, error: "unit_not_published" }, { status: 400 });
    }
    try {
      const unit = loadUnit(unitSlug);
      nodes = buildUnitNodes(unit.vocab, unit.grammar);
    } catch {
      return NextResponse.json({ ok: false, error: "unit_not_readable" }, { status: 400 });
    }
    if (nodes.length === 0) return NextResponse.json({ ok: false, error: "unit_has_no_nodes" }, { status: 400 });
  }

  try {
    if (vocabXp + grammarXp > 0) {
      await grantXp(getDb(), { studentId, classId, vocabXp, grammarXp, actorId: teacher.userId });
    }
    let nodesMarked = 0;
    if (unitSlug) {
      const res = await markUnitDone(getDb(), {
        studentId,
        classId,
        unitSlug,
        nodes: nodes.map((n) => ({ id: n.id, kind: n.kind, graded: n.graded })),
        actorId: teacher.userId,
      });
      nodesMarked = res.nodesMarked;
    }
    return NextResponse.json({ ok: true, vocabXp, grammarXp, unitSlug: unitSlug ?? null, nodesMarked });
  } catch (e) {
    console.error("[progress-adjust] failed:", e instanceof Error ? e.message : String(e));
    return NextResponse.json({ ok: false, error: "persist_failed" }, { status: 500 });
  }
}
