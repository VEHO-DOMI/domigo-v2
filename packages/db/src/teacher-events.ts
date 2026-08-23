/**
 * K2a · THE TEACHER JOURNAL — who changed what on a teacher's own account.
 *
 * WHY A SECOND JOURNAL. `roster_events.class_id` is NOT NULL and a teacher belongs
 * to no class, so nothing that happens to a teacher's ACCOUNT has ever been
 * recorded: not her PIN change under Einstellungen, not the transitional PIN the
 * grandmaster sets for a locked-out colleague (K1b, whose route header defers
 * explicitly to this lane). The alternative — making `class_id` nullable — would
 * have punched a permanent hole in the roster journal's strongest guarantee to buy
 * a feature that belongs to a different subject. So: a second table, teacher-scoped.
 *
 * TWO IDS, AND THE DIFFERENCE IS THE POINT. `teacherId` is whose account changed;
 * `actorId` is whose hand did it. On self-service they are equal; when the operator
 * rescues a colleague they are not. A journal that cannot tell those two apart is
 * not an audit trail, and this is the one thing it must never get wrong.
 *
 * THE PAYLOAD IS FRUGAL BY CONSTRUCTION, NOT BY CARE. Ids, numbers and flags only —
 * never a name, never a PIN or its hash, never the address itself (`emailSet: true`
 * carries everything the journal needs). `scrubPayload` below enforces that at the
 * door rather than trusting five call sites to remember it.
 *
 * DEGRADATION IS DELIBERATE AND NARROW. Raw migrations are applied by hand AFTER a
 * merge, so production always has a window where this code is deployed and
 * `teacher_events` is not. In that window a PIN change must not die for want of a
 * journal — the gap is simply today's state, restored. Therefore: a MISSING TABLE
 * degrades (logged, `false` returned); every other database error is a real outage
 * and is re-thrown, so a caller doing journal-then-apply never applies unhistoried.
 */
import type { Db } from "./index.ts";
import { v2TeacherEvents } from "./schema.ts";

/** The kinds this journal records. App-validated, like every other `kind` in v2. */
export type TeacherEventKind =
  | "pin_change" // she changed her own PIN under Einstellungen
  | "pin_reset_by_grandmaster" // the operator set a transitional PIN for her (K1b)
  | "email_set" // she stored or replaced her recovery address
  | "reset_requested" // a recovery link was minted and mailed
  | "reset_consumed"; // that link was spent and a new PIN set

export interface TeacherEventInput {
  /** Whose ACCOUNT this happened to. */
  teacherId: string;
  kind: TeacherEventKind;
  /** Whose HAND did it. Pass the acting session's id — equal to teacherId on self-service. */
  actorId: string | null;
  /** Ids, numbers and flags only. See scrubPayload. */
  payload: Record<string, unknown>;
}

/** Short, bounded error text for a degradation log (house shape, cf. class-service.ts). */
function errText(err: unknown): string {
  return err instanceof Error ? err.message.slice(0, 200) : String(err).slice(0, 200);
}

/**
 * "This database has not had migration 0016 applied yet" — the ONE class of error
 * this lane treats as a state rather than a fault.
 *
 * TWO CODES, ONE MEANING. 42P01 is a missing TABLE (teacher_events, reset tokens,
 * the throttle) and 42703 is a missing COLUMN (users.email). Raw migrations here are
 * applied BY HAND after a merge, so production always has a window in which the code
 * knows about all four and the database knows about none — and a surface that cannot
 * tell that window apart from a real outage will either lie or fall over.
 *
 * Same three-step shape as `isUniqueViolation` (roster-service.ts): the driver's own
 * code, a wrapped cause's code, then the message text — because Neon's HTTP driver
 * does not always surface the code field.
 */
export function isMissingDbObject(err: unknown): boolean {
  const e = err as { code?: unknown; cause?: { code?: unknown }; message?: unknown } | null | undefined;
  if (!e) return false;
  for (const code of ["42P01", "42703"]) {
    if (e.code === code || e.cause?.code === code) return true;
  }
  if (typeof e.message !== "string") return false;
  return (
    /\b42P01\b|\b42703\b/.test(e.message) ||
    /relation .* does not exist/i.test(e.message) ||
    /column .* does not exist/i.test(e.message)
  );
}

/**
 * Does this string look like something the journal must never hold?
 *
 * Three shapes, each one an actual secret in this codebase: a bcrypt hash (every
 * `pinHash` starts `$2a$`/`$2b$`/`$2y$`), an address (anything with an `@`), and a
 * bare PIN (4–6 digits and nothing else — no legitimate payload value is that, and
 * numbers are passed as numbers, so `ttlMinutes: 60` is untouched).
 */
function looksSensitive(value: string): boolean {
  if (/^\$2[aby]\$/.test(value)) return true;
  if (value.includes("@")) return true;
  return /^[0-9]{4,6}$/.test(value);
}

/**
 * Redact-and-shout rather than throw: a leaked secret must not reach the table, and
 * a PIN change must not die because someone wrote a careless payload. The loud log
 * is what turns a silent leak into a bug report.
 */
export function scrubPayload(payload: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(payload)) {
    if (typeof v === "string" && looksSensitive(v)) {
      console.error(`[teacher-events] payload field "${k}" looked like a secret and was redacted — fix the call site`);
      out[k] = "[redacted]";
      continue;
    }
    out[k] = v;
  }
  return out;
}

/**
 * Append one journal row. Returns true when it landed, false when the table is not
 * there yet (the declared production window). Any OTHER failure throws.
 */
export async function writeTeacherEvent(db: Db, input: TeacherEventInput): Promise<boolean> {
  try {
    await db.insert(v2TeacherEvents).values({
      teacherId: input.teacherId,
      kind: input.kind,
      actorId: input.actorId,
      payload: scrubPayload(input.payload),
    });
    return true;
  } catch (err) {
    if (isMissingDbObject(err)) {
      console.error(
        `[teacher-events] domigo_v2.teacher_events is missing — "${input.kind}" went unjournalled (migration 0016 not applied yet):`,
        errText(err),
      );
      return false;
    }
    throw err;
  }
}
