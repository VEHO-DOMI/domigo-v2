/**
 * /admin/classes — the teacher's own classes. Server resolves the class list
 * (each with its invite code + roster count); the interactive create / rename /
 * archive UI runs client-side and calls /api/admin/classes[/id]. Teacher-only
 * (getTeacherForPage — a real session or the non-prod dev fallback).
 */
import { redirect } from "next/navigation";
import { getDb, listClassesForTeacher } from "@domigo/db";
import { getTeacherForPage } from "@/lib/identity";
import ClassesManager from "./ClassesManager";

export const dynamic = "force-dynamic";

export default async function ClassesPage() {
  const teacher = await getTeacherForPage();
  if (!teacher) redirect("/admin/signin");

  const classes = await listClassesForTeacher(getDb(), teacher.userId).catch(() => []);
  return <ClassesManager initialClasses={classes} />;
}
