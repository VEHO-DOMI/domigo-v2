import "server-only";
import { getClassGrade, getDb, inScope } from "@domigo/db";
import { getActingUser, getActingUserForPage, getTeacherForPage } from "./identity";
import { schoolReleased } from "./school-content";
/** The page and endpoint share the draft and grade boundary. */
export async function schoolAccess(req?: Request) {
  const student = req ? await getActingUser(req) : await getActingUserForPage();
  if (student) {
    if (!schoolReleased() || !inScope(student.classScope, student.classId)) return null;
    // This chapter needs a confirmed year 2, not the general browser's
    // all-years fallback for missing classes or unavailable storage.
    if (await getClassGrade(getDb(), student.classId) !== 2) return null;
    return { preview: false as const, player: student };
  }
  const teacher = await getTeacherForPage();
  return teacher ? { preview: true as const, player: teacher } : null;
}
