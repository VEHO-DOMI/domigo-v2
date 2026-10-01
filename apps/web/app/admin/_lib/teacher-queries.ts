import { getDb, listArchivedClassesForTeacher, listClassesForTeacher } from "@domigo/db";
import type { ActingTeacher } from "@/lib/identity";
import { readTeacherClassLists } from "./teacher-classes";

/** Same scope AND owner for both halves, including for a grandmaster. */
export function loadTeacherClasses(teacher: ActingTeacher) {
  return readTeacherClassLists({
    active: () => listClassesForTeacher(getDb(), teacher.classScope, teacher.userId),
    archived: () => listArchivedClassesForTeacher(getDb(), teacher.classScope, teacher.userId),
  });
}
