import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getTeacherForPage, type ActingTeacher } from "@/lib/identity";
import { kontoBaseUrl } from "@/lib/konto/basis";
import { isGrandmaster } from "@/lib/grandmaster";
import { loadTeacherClasses } from "./_lib/teacher-queries";
import { teacherArea } from "./_lib/navigation";
import { readResult } from "./_lib/teacher-classes";
import ClassDirectory from "./_components/ClassDirectory";
import { ClassesLoading, TeacherHeading, TeacherShell } from "./_components/TeacherShell";
import TeacherManagement from "./_components/TeacherManagement";
import StoryMastery from "./_components/StoryMastery";
import GameExploration from "./_components/GameExploration";
import TeacherAccessError from "./_components/TeacherAccessError";
import "./lehrerbereich.css";

export const dynamic = "force-dynamic";

async function Classes({ teacher, writing }: { teacher: ActingTeacher; writing: boolean }) {
  const lists = await loadTeacherClasses(teacher);
  return <ClassDirectory lists={lists} mode={writing ? "writing" : "home"} lehrerraumUrl={`${kontoBaseUrl()}/lehrerraum/lehrgruppen`} />;
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ bereich?: string | string[] }> }) {
  // Preserve /admin's explicit student redirect. No new authentication path.
  const session = await auth();
  if (!session) redirect("/admin/signin");
  if (session.user.role !== "teacher") redirect("/home");
  const identity = await readResult(getTeacherForPage);
  if (identity.status === "error") {
    return <TeacherShell area="classes"><TeacherAccessError retryHref="/admin" /></TeacherShell>;
  }
  const teacher = identity.value;
  if (!teacher) redirect("/admin/signin");
  const area = teacherArea((await searchParams).bereich);

  return (
    <TeacherShell area={area}>
      {area === "classes" || area === "writing" ? (
        <>
          <TeacherHeading title={area === "writing" ? "Schreibabgaben" : "Meine Klassen"}>
            {area === "writing" ? "Wähle eine Klasse, um ihre Schreibabgaben zu lesen und zu bearbeiten." : "Öffne eine Klasse, um Fortschritt und Abgaben anzusehen."}
          </TeacherHeading>
          <Suspense fallback={<ClassesLoading />}><Classes teacher={teacher} writing={area === "writing"} /></Suspense>
        </>
      ) : area === "management" ? (
        <TeacherManagement grandmaster={isGrandmaster(teacher.userId)} lehrerraumUrl={`${kontoBaseUrl()}/lehrerraum/lehrgruppen`} />
      ) : area === "mastery" ? (
        <Suspense fallback={<p role="status">Spielstände werden geladen …</p>}><StoryMastery teacher={teacher} /></Suspense>
      ) : <GameExploration />}
    </TeacherShell>
  );
}
