/** cgo-041: errors have no rows. An unread list cannot masquerade as an empty one. */
import type { ClassSummary, ArchivedClassSummary } from "@domigo/db";

export type ReadResult<T> =
  | { status: "ready"; value: T }
  | { status: "error" };

export interface TeacherClass {
  id: string;
  name: string;
  inviteCode: string;
  grade: number;
  archivedAt: string | null;
  schoolYear: string | null;
  testStatus: "unknown" | "test" | "regular";
}

export interface TeacherClassLists {
  active: ReadResult<TeacherClass[]>;
  archived: ReadResult<TeacherClass[]>;
}

/** Takes a callback so a synchronous connection failure is caught as well. */
export async function readResult<T>(read: () => Promise<T>): Promise<ReadResult<T>> {
  try {
    return { status: "ready", value: await read() };
  } catch {
    // Never serialize raw database errors, SQL, parameters or personal data.
    return { status: "error" };
  }
}

export async function readTeacherClassLists(readers: {
  active: () => Promise<ClassSummary[]>;
  archived: () => Promise<ArchivedClassSummary[]>;
}): Promise<TeacherClassLists> {
  const [active, archived] = await Promise.all([
    readResult(async () => (await readers.active()).map(projectTeacherClass)),
    readResult(async () => (await readers.archived()).map(projectTeacherClass)),
  ]);
  return { active, archived };
}

export function classPath(id: string, action: "open" | "roster" | "writing" | "listening" = "open"): string {
  const suffix = { open: "", roster: "/roster", writing: "/schreiben", listening: "/hoeren" }[action];
  if (suffix === undefined) throw new Error("Unknown teacher class action");
  return `/admin/classes/${encodeURIComponent(id)}${suffix}`;
}

/** N2: drop unfiltered profile counts. Never infer missing metadata. */
export function projectTeacherClass(row: ClassSummary | ArchivedClassSummary): TeacherClass {
  return {
    id: row.id,
    name: row.name,
    inviteCode: row.inviteCode,
    grade: row.grade,
    archivedAt: "archivedAt" in row ? row.archivedAt.toISOString() : null,
    schoolYear: null,
    testStatus: "unknown",
  };
}

export function gradeLabel(grade: number | null | undefined): string {
  return Number.isInteger(grade) && grade != null && grade >= 1 && grade <= 4
    ? `Jahrgang ${grade}`
    : "Jahrgang nicht verfügbar";
}
