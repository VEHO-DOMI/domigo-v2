/** Assignment content for a teacher preview: class-scoped metadata only.
 * No pupil, sitting, result or attempt query belongs in this module. */
import "server-only";
import { getAssignmentWithSections, getDb, listAssignmentsForStudent } from "@domigo/db";
import { assignableClasses } from "@/lib/class-wall";
import type { ActingTeacher } from "@/lib/identity";

export async function listPreviewAssignments(teacher: ActingTeacher, grades: readonly number[]) {
  const classes = (await assignableClasses(teacher).catch(() => [])).filter((c) => grades.includes(c.grade));
  const now = new Date();
  const rows = await Promise.all(classes.map(async (c) => {
    // This query reads open assignment definitions, never an individual child's state.
    const assignments = await listAssignmentsForStudent(getDb(), teacher.classScope, c.id, now).catch(() => []);
    return assignments.filter((a) => a.classId === c.id).map((a) => ({ ...a, className: c.name, grade: c.grade }));
  }));
  return rows.flat().sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function getPreviewAssignment(teacher: ActingTeacher, id: string, grades: readonly number[]) {
  const classes = (await assignableClasses(teacher).catch(() => [])).filter((c) => grades.includes(c.grade));
  if (classes.length === 0) return null;
  const content = await getAssignmentWithSections(getDb(), teacher.classScope, id).catch(() => null);
  if (!content || !classes.some((c) => c.id === content.assignment.classId)) return null;
  return { ...content, sessions: [] };
}
