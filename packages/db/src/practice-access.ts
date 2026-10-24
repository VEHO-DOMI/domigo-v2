/** One eligibility rule for practice feeds and the XP-awarding answer route.
 * The caller supplies the authenticated class grade and its current scoped
 * reserve. This is pure: no filesystem import through content-loader's barrel.
 * Mock/checkup assignments have their own authorized endpoint, never a mode
 * exemption here. Preview feeds supply their selected grade and an empty set.
 */
import { assignPool } from "@domigo/content-loader/pools";

export type PracticeDenial = "grade_unavailable" | "wrong_grade" | "item_reserved";
export function practiceItemDenial(itemId: string, classGrade: number | null, reserved: ReadonlySet<string>): PracticeDenial | null {
  if (classGrade === null || !Number.isInteger(classGrade) || classGrade < 1 || classGrade > 4) return "grade_unavailable";
  if (!itemId.startsWith(`g${classGrade}u`)) return "wrong_grade";
  if (assignPool(itemId, reserved) === "mock") return "item_reserved";
  return null;
}
