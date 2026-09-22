/**
 * /admin/classes/[id]/roster — the teacher's roster for ONE class. Server resolves
 * the class (owner-scoped: a class this teacher doesn't own redirects back to the
 * class list) and its students; the rename / remove UI runs client-side and calls
 * /api/admin/roster/[studentId]. dach-108 · lists are imported at Lauter Einser: the
 * page shows the fixed sentence and the Lehrer-Raum link where the import box stood. Teacher-only (getTeacherForPage — a real session
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
import { holeKlassenliste } from "@/lib/konto/claims";
import { mergeKlassenliste } from "@/lib/konto/klassenliste-merge";
import { isGrandmaster } from "@/lib/grandmaster";
import { kontoBaseUrl, kontoBeitrittUrl } from "@/lib/konto/basis";
import { GESCHLOSSEN_SATZ } from "@/lib/konto/regeln";
import RosterManager, { type Zustand } from "./RosterManager";

export const dynamic = "force-dynamic";

export default async function RosterPage({ params }: { params: Promise<{ id: string }> }) {
  const teacher = await getTeacherForPage();
  if (!teacher) redirect("/admin/signin");

  const { id } = await params;
  let cls: OwnedClass | null = await getClassForTeacher(getDb(), teacher.classScope, id, teacher.userId).catch(() => null);
  // Whose authorization the roster reads/writes run under. Identical to the caller
  // for every ordinary teacher, and also for a grandmaster in his OWN class.
  let authorizingTeacherId = teacher.userId;
  let heading = cls?.name ?? "";

  if (!cls && isGrandmaster(teacher.userId)) {
    const foreign = await getClassForGrandmaster(getDb(), teacher.classScope, id).catch(() => null);
    if (foreign) {
      cls = foreign;
      authorizingTeacherId = foreign.teacherId;
      const names = await resolveTeacherNames(getDb(), [foreign.teacherId]).catch(() => new Map<string, string>());
      const owner = names.get(foreign.teacherId) ?? UNKNOWN_TEACHER_LABEL;
      heading = `${foreign.name} · ${owner} · Großmeister-Zugriff`;
    }
  }

  if (!cls) redirect("/admin/classes"); // not this teacher's class (or doesn't exist)

  // dach-123 · E1. The two reads are deliberately authorized by DIFFERENT people:
  // listRoster runs under the OWNER (that is what lets a grandmaster read a
  // foreign roster at all), while the class list is asked for in the name of
  // whoever is LOOKING — konto decides for itself who may see a list (owner,
  // head teacher, co-teacher, grant) and writes the true caller into its own log.
  // Asking with the owner's id would be lying to the roof. Both run at once so
  // the page is never slower than the slower of the two.
  const [roster, liste] = await Promise.all([
    listRoster(getDb(), teacher.classScope, id, authorizingTeacherId).catch(() => []),
    holeKlassenliste(teacher, cls.id),
  ]);

  // A withheld name would be a hole in the shape of a name, so a locked list
  // builds NO rows — only a count and one sentence (E5). Every state without a
  // list merges with none: then every local row is `local-only` and the table
  // looks exactly like it does today.
  const gesperrt = liste.ok && liste.namenGesperrt;
  const { rows, joinedCount, listCount } = mergeKlassenliste(roster, liste.ok && !gesperrt ? liste.kinder : []);
  const zustand: Zustand = !liste.ok
    ? liste.grund === "unknown-class"
      ? "keine-liste"
      : liste.grund
    : gesperrt
      ? "gesperrt"
      : "liste";

  return (
    <RosterManager
      classId={cls.id}
      className={heading}
      grade={cls.grade}
      inviteCode={cls.inviteCode}
      archived={cls.archivedAt != null}
      joinUrl={kontoBeitrittUrl(cls.inviteCode)}
      lehrerraumUrl={`${kontoBaseUrl()}/lehrerraum/lehrgruppen`}
      satz={GESCHLOSSEN_SATZ}
      rows={rows}
      joinedCount={joinedCount}
      listCount={listCount}
      lockedCount={liste.ok && liste.namenGesperrt ? liste.kinder.length : 0}
      zustand={zustand}
    />
  );
}
