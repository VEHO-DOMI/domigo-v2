import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getTeacherForPage, type ActingTeacher } from "@/lib/identity";
import { kontoBaseUrl } from "@/lib/konto/basis";
import { loadTeacherClasses } from "../_lib/teacher-queries";
import { readResult } from "../_lib/teacher-classes";
import { ClassesLoading, TeacherHeading, TeacherShell } from "../_components/TeacherShell";
import ClassesManager from "./ClassesManager";
import TeacherAccessError from "../_components/TeacherAccessError";
import "../lehrerbereich.css";

export const dynamic = "force-dynamic";

async function Classes({ teacher }: { teacher: ActingTeacher }) {
  const lists = await loadTeacherClasses(teacher);
  return <ClassesManager lists={lists} lehrerraumUrl={`${kontoBaseUrl()}/lehrerraum/lehrgruppen`} />;
}

export default async function ClassesPage() {
  const identity = await readResult(getTeacherForPage);
  if (identity.status === "error") {
    return <TeacherShell area="classes"><TeacherAccessError retryHref="/admin/classes" /></TeacherShell>;
  }
  const teacher = identity.value;
  if (!teacher) redirect("/admin/signin");
  return (
    <TeacherShell area="classes">
      <TeacherHeading title="Klassen verwalten">Öffne eine Klassenliste oder kopiere den Beitrittscode deiner Klasse.</TeacherHeading>
      <Suspense fallback={<ClassesLoading />}><Classes teacher={teacher} /></Suspense>
    </TeacherShell>
  );
}
