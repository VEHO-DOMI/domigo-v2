/**
 * /admin/assignments/new — the mock-test / practice / checkup builder. Server
 * resolves the class list (each carries its grade → drives the catalog fetch)
 * and the C-1 checkup grade presets; the interactive composer runs client-side
 * and posts the finished draft to /api/admin/assignments.
 */
import { redirect } from "next/navigation";
import { getDb, listClasses, listClassesForGrandmaster } from "@domigo/db";
import { GRADE_STRUCTURES } from "@/lib/checkup";
import { getTeacherForPage } from "@/lib/identity";
import { isGrandmaster } from "@/lib/grandmaster";
import AssignmentBuilder, { type CheckupPreset } from "./AssignmentBuilder";

export const dynamic = "force-dynamic";

export default async function NewAssignmentPage() {
  const teacher = await getTeacherForPage();
  if (!teacher) redirect("/admin/signin");

  // P3: WHICH class list this page shows is an explicit branch, never a default
  // parameter — the grandmaster (platform operator) picks from every active class
  // on the platform, each labelled with its owner; every other teacher picks from
  // her own. A default would silently rebind future callers, which is exactly the
  // defect P1 had to repair in listClasses.
  const classes = await (isGrandmaster(teacher.userId)
    ? listClassesForGrandmaster(getDb())
    : listClasses(getDb(), teacher.userId)
  ).catch(() => []);
  // C-1: the §4 grade presets travel as plain DATA — the builder is a client
  // component and never imports @domigo/db or the server-only lib (P-29b).
  const checkupPresets: Record<number, CheckupPreset[]> = Object.fromEntries(
    Object.entries(GRADE_STRUCTURES).map(([g, sections]) => [
      Number(g),
      sections.map((s) => ({
        checkupKind: s.checkupKind as CheckupPreset["checkupKind"],
        points: s.points,
        mask: s.mask ?? null,
        direction: s.direction,
        note: s.note,
      })),
    ]),
  );
  return <AssignmentBuilder classes={classes} checkupPresets={checkupPresets} />;
}
