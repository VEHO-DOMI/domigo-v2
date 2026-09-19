/**
 * /admin/classes — the teacher's own classes, active AND archived. Server resolves
 * both lists (each class with its invite code + roster count); the interactive
 * create / rename / archive / un-archive UI runs client-side and calls
 * /api/admin/classes[/id]. Teacher-only
 * (getTeacherForPage — a real session or the non-prod dev fallback).
 */
import { redirect } from "next/navigation";
import { getDb, listArchivedClassesForTeacher, listClassesForTeacher } from "@domigo/db";
import { getTeacherForPage } from "@/lib/identity";
import ClassesManager from "./ClassesManager";

export const dynamic = "force-dynamic";

export default async function ClassesPage() {
  const teacher = await getTeacherForPage();
  if (!teacher) redirect("/admin/signin");

  // K9b · the archived half is read here too, because a class the working list filters
  // out is a class with nothing to click — which is exactly why un-archiving was
  // unreachable. Each read degrades on its own: a failing archive read must not be able
  // to take the working list down with it.
  const [classes, archived] = await Promise.all([
    listClassesForTeacher(getDb(), teacher.userId).catch(() => []),
    listArchivedClassesForTeacher(getDb(), teacher.userId).catch(() => []),
  ]);
  return <ClassesManager initialClasses={classes} initialArchived={archived} />;
}
