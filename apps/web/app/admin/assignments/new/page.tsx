/**
 * /admin/assignments/new — the mock-test / practice / checkup builder. Server
 * resolves the class list (each carries its grade → drives the catalog fetch)
 * and the C-1 checkup grade presets; the interactive composer runs client-side
 * and posts the finished draft to /api/admin/assignments.
 */
import { redirect } from "next/navigation";
import { GRADE_STRUCTURES } from "@/lib/checkup";
import { getTeacherForPage } from "@/lib/identity";
import { assignableClasses } from "@/lib/class-wall";
import AssignmentBuilder, { type CheckupPreset } from "./AssignmentBuilder";
import Link from "next/link";
import { resolveAssignmentPrefill } from "@/lib/assignment-prefill";

export const dynamic = "force-dynamic";

export default async function NewAssignmentPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const teacher = await getTeacherForPage();
  if (!teacher) redirect("/admin/signin");
  const query = await searchParams;
  const hasSource = "source" in query;
  const prefill = hasSource ? resolveAssignmentPrefill(query) : null;
  if (hasSource && !prefill) return <main className="dg-card" style={{ maxWidth: 760, margin: "28px auto", padding: 20 }}>
    <h1>Inhalt nicht zuweisbar</h1>
    <p>Dieser Inhalt oder dieser Chapter ist nicht für Aufgaben freigegeben. Es wurde nichts gespeichert.</p>
    <Link href="/admin/explorer">Zur Schüleransicht</Link>
  </main>;

  // P3: WHICH class list this page shows is an explicit branch, never a default
  // parameter — the grandmaster (platform operator) picks from every active class
  // on the platform, each labelled with its owner; every other teacher picks from
  // her own. A default would silently rebind future callers, which is exactly the
  // defect P1 had to repair in listClasses. cgo-047: both branches pass the
  // session's class wall (lib/class-wall.ts) — no foreign class names.
  const classes = await assignableClasses(teacher).catch(() => []);
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
  return <AssignmentBuilder classes={prefill ? classes.filter((c) => c.grade === prefill.source.grade) : classes} checkupPresets={checkupPresets} prefill={prefill} ownerId={teacher.userId} />;
}
