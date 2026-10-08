import type { AssignmentRow } from "@domigo/db";

/** Failed reads are not empty classes or zero assignments. Also catches getDb(). */
export type StartRead<T> = { ok: true; value: T } | { ok: false };
export async function readStart<T>(read: () => Promise<T>): Promise<StartRead<T>> {
  try {
    return { ok: true, value: await read() };
  } catch {
    return { ok: false };
  }
}

export interface AssignmentSummary {
  open: number;
  overdue: number;
  nextDue: Date | null;
}

/** "Open" follows the child assignment list: unarchived, not past its deadline.
 * Overdue is shown separately; neither number claims a child's completion state. */
export function summarizeAssignments(rows: readonly AssignmentRow[], classId: string, now: Date): AssignmentSummary {
  const active = rows.filter((row) => row.classId === classId && row.archivedAt === null);
  const open = active.filter((row) => row.dueAt === null || row.dueAt.getTime() >= now.getTime());
  const deadlines = open.flatMap((row) => row.dueAt === null ? [] : [row.dueAt.getTime()]);
  return {
    open: open.length,
    overdue: active.length - open.length,
    nextDue: deadlines.length ? new Date(Math.min(...deadlines)) : null,
  };
}

/** Fixed school timezone: a server in another timezone must show the same due date. */
export function deadlineLabel(date: Date): string {
  return new Intl.DateTimeFormat("de-AT", {
    timeZone: "Europe/Vienna", day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  }).format(date);
}
