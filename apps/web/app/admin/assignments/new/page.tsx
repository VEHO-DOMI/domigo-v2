/**
 * /admin/assignments/new — the mock-test builder. Server resolves the class list
 * (each carries its grade → drives the catalog fetch); the interactive composer
 * runs client-side and posts the finished draft to /api/admin/assignments.
 */
import { redirect } from "next/navigation";
import { getDb, listClasses } from "@domigo/db";
import { getTeacherForPage } from "@/lib/identity";
import AssignmentBuilder from "./AssignmentBuilder";

export const dynamic = "force-dynamic";

export default async function NewAssignmentPage() {
  const teacher = await getTeacherForPage();
  if (!teacher) redirect("/admin/signin");

  const classes = await listClasses(getDb()).catch(() => []);
  return <AssignmentBuilder classes={classes} />;
}
