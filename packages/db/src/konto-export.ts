/**
 * dach-018 · WHAT THE SWITCH-OVER HANDS OVER — the read half of the export.
 *
 * Lives here and not in the script, because it is a read over BOTH registers and
 * the precedence must be the house one: the v2-native row first, the v1 mirror
 * second (`pickIdentity`). A person who exists in both is exported ONCE, as
 * their v2 self — otherwise the account service would receive two accounts for
 * one child and the class list would double on the switch-over morning.
 *
 * Deliberately raw SQL: the v1 mirrors are declared read-only and are not in
 * drizzle's schema beyond the few columns auth needs (v1.ts), and this read
 * wants exactly the five fields the import takes. No e-mail column is named in
 * either half — not as a filter, not as a projection.
 */
import { sql } from "drizzle-orm";
import type { Db } from "./index.ts";

export type ExportKlasse = {
  id: string;
  name: string;
  inviteCode: string;
  grade: number;
  teacherId: string | null;
  archivedAt: string | Date | null;
};

export type ExportPerson = {
  id: string;
  displayName: string;
  role: string;
  classId: string | null;
  pinHash: string;
};

export type ExportStand = { klassen: ExportKlasse[]; leute: ExportPerson[]; nurV1: { klassen: number; leute: number } };

export async function readKontoExport(db: Db): Promise<ExportStand> {
  const klassen = new Map<string, ExportKlasse>();
  const leute = new Map<string, ExportPerson>();

  const v2k = await db.execute(
    sql`select id, name, invite_code as "inviteCode", grade, teacher_id as "teacherId", archived_at as "archivedAt" from domigo_v2.classes`,
  );
  for (const r of v2k.rows as unknown as ExportKlasse[]) klassen.set(r.id, r);
  const v2u = await db.execute(
    sql`select id, display_name as "displayName", role, class_id as "classId", pin_hash as "pinHash" from domigo_v2.users`,
  );
  for (const r of v2u.rows as unknown as ExportPerson[]) leute.set(r.id, r);

  const v2Klassen = klassen.size;
  const v2Leute = leute.size;

  const v1k = await db.execute(
    sql`select id, name, invite_code as "inviteCode", grade, null as "teacherId", archived_at as "archivedAt" from public.classes`,
  );
  for (const r of v1k.rows as unknown as ExportKlasse[]) if (!klassen.has(r.id)) klassen.set(r.id, r);
  const v1u = await db.execute(
    sql`select id, display_name as "displayName", role, class_id as "classId", pin_hash as "pinHash" from public.users`,
  );
  for (const r of v1u.rows as unknown as ExportPerson[]) if (!leute.has(r.id)) leute.set(r.id, r);

  return {
    klassen: [...klassen.values()],
    leute: [...leute.values()],
    nurV1: { klassen: klassen.size - v2Klassen, leute: leute.size - v2Leute },
  };
}
