/**
 * /admin/classes/[id]/roster — the teacher's roster for ONE class. Server resolves
 * the class (owner-scoped: a class this teacher doesn't own redirects back to the
 * class list) and its students; the interactive import / rename / reset-PIN / remove
 * UI runs client-side and calls /api/admin/classes/[id]/roster and
 * /api/admin/roster/[studentId]. Teacher-only (getTeacherForPage — a real session
 * or the non-prod dev fallback).
 */
import { redirect } from "next/navigation";
import { getClassForTeacher, getDb, listRoster } from "@domigo/db";
import { getTeacherForPage } from "@/lib/identity";
import RosterManager from "./RosterManager";

export const dynamic = "force-dynamic";

export default async function RosterPage({ params }: { params: Promise<{ id: string }> }) {
  const teacher = await getTeacherForPage();
  if (!teacher) redirect("/admin/signin");

  const { id } = await params;
  const cls = await getClassForTeacher(getDb(), id, teacher.userId).catch(() => null);
  if (!cls) redirect("/admin/classes"); // not this teacher's class (or doesn't exist)

  const roster = await listRoster(getDb(), id, teacher.userId).catch(() => []);

  return (
    <RosterManager
      classId={cls.id}
      className={cls.name}
      grade={cls.grade}
      inviteCode={cls.inviteCode}
      archived={cls.archivedAt != null}
      joinPath={`/join/${cls.inviteCode}`}
      initialRoster={roster}
    />
  );
}
