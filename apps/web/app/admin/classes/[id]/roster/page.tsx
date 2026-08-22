/**
 * /admin/classes/[id]/roster — the teacher's roster for ONE class. Server resolves
 * the class (owner-scoped: a class this teacher doesn't own redirects back to the
 * class list) and its students; the interactive import / rename / reset-PIN / remove
 * UI runs client-side and calls /api/admin/classes/[id]/roster and
 * /api/admin/roster/[studentId]. Teacher-only (getTeacherForPage — a real session
 * or the non-prod dev fallback).
 *
 * P3 · GOD MODE. The platform operator (isGrandmaster — an env allowlist, checked
 * server-side) may open the roster of ANY active class, reached from
 * /admin/grandmaster. The owner scope is NOT widened: when the owner-scoped lookup
 * comes back empty AND the caller is the grandmaster, the class is resolved
 * unscoped, its OWNER's id is read off it, and the ordinary owner-scoped services
 * run with HER id. The heading carries the owner's name so a foreign roster can
 * never be mistaken for one's own — RosterManager already renders `className`, so
 * this needs no change to the client component.
 *
 * Archiving stays owner-only and is NOT reachable here at all (the archive control
 * lives on /admin/classes, which is owner-scoped) — see archiveClass in
 * packages/db/src/class-service.ts for why that door stays shut.
 */
import { redirect } from "next/navigation";
import {
  UNKNOWN_TEACHER_LABEL,
  getClassForGrandmaster,
  getClassForTeacher,
  getDb,
  listRoster,
  resolveTeacherNames,
  type OwnedClass,
} from "@domigo/db";
import { getTeacherForPage } from "@/lib/identity";
import { isGrandmaster } from "@/lib/grandmaster";
import RosterManager from "./RosterManager";

export const dynamic = "force-dynamic";

export default async function RosterPage({ params }: { params: Promise<{ id: string }> }) {
  const teacher = await getTeacherForPage();
  if (!teacher) redirect("/admin/signin");

  const { id } = await params;
  let cls: OwnedClass | null = await getClassForTeacher(getDb(), id, teacher.userId).catch(() => null);
  // Whose authorization the roster reads/writes run under. Identical to the caller
  // for every ordinary teacher, and also for a grandmaster in his OWN class.
  let authorizingTeacherId = teacher.userId;
  let heading = cls?.name ?? "";

  if (!cls && isGrandmaster(teacher.userId)) {
    const foreign = await getClassForGrandmaster(getDb(), id).catch(() => null);
    if (foreign) {
      cls = foreign;
      authorizingTeacherId = foreign.teacherId;
      const names = await resolveTeacherNames(getDb(), [foreign.teacherId]).catch(() => new Map<string, string>());
      const owner = names.get(foreign.teacherId) ?? UNKNOWN_TEACHER_LABEL;
      heading = `${foreign.name} · ${owner} · Großmeister-Zugriff`;
    }
  }

  if (!cls) redirect("/admin/classes"); // not this teacher's class (or doesn't exist)

  const roster = await listRoster(getDb(), id, authorizingTeacherId).catch(() => []);

  return (
    <RosterManager
      classId={cls.id}
      className={heading}
      grade={cls.grade}
      inviteCode={cls.inviteCode}
      archived={cls.archivedAt != null}
      joinPath={`/join/${cls.inviteCode}`}
      initialRoster={roster}
    />
  );
}
