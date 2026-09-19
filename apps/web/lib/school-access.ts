import "server-only";
import { getActingUser, getActingUserForPage, getTeacherForPage } from "./identity";
import { resolveVisibleGrades } from "./grade-scope";
import { schoolReleased } from "./school-content";
/** The page and endpoint share the draft and grade boundary. */
export async function schoolAccess(req?: Request) {
  const student = req ? await getActingUser(req) : await getActingUserForPage();
  if (student) {
    if (!schoolReleased() || !(await resolveVisibleGrades(student.classId)).includes(2)) return null;
    return { preview: false as const, player: student };
  }
  const teacher = await getTeacherForPage();
  return teacher ? { preview: true as const, player: teacher } : null;
}
