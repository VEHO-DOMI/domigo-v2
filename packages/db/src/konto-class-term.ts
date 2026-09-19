/**
 * dach-018 · THE ACCOUNT SERVICE OWNS THE CLASS — this is where it says so.
 *
 * After the switch-over exactly one writer touches `classes.name`,
 * `classes.grade`, `classes.teacher_id` and `classes.archived_at`: konto,
 * through the two endpoints this module serves (SPEC §4.7 creates one, §10.2
 * pulls changes through). Every DomiGo-side writer of those columns is gone.
 *
 * NO TERMS HERE, declared. srdp models a class year by year in `class_terms`;
 * DomiGo has no such table (measured: `class_terms` appears nowhere in this
 * repo) because it never needed one — a class keeps its row and its id across
 * years. So `school_year` and `term_started_at` arrive, are read, and change
 * nothing: there is no row for them to land in, and inventing one would be a
 * migration this card may not write. What they WOULD change — name, grade,
 * owner, archive — is applied.
 *
 * IDEMPOTENT BY COMPARISON, not by luck. Neon HTTP has no multi-statement
 * transactions, so the function reads the row, compares, and only writes when
 * something actually differs. A push delivered twice does nothing the second
 * time — and, just as important, writes NO second journal row, so the history
 * does not fill up with changes that never happened.
 */
import { and, eq } from "drizzle-orm";
import type { Db } from "./index.ts";
import { writeRosterEvent } from "./roster-events.ts";
import { v2Classes, v2IdentityUsers } from "./schema.ts";

export type KontoKlassenEingang = {
  /** DomiGo's own class id, when konto already knows the bridge. */
  app_class_id?: string | null;
  /** The class code children type and teachers print. Our `inviteCode`. */
  join_code?: string | null;
  name: string;
  /** 1–4 for this app, or null when the group has no year (SPEC §5). */
  jahrgang: number | null;
  /** konto's own user id for the owner; must map to a local user. */
  owner_app_user_id: string;
  archived_at?: string | null;
  /** Read, and deliberately without effect here — see the header. */
  school_year?: string | null;
  term_started_at?: string | null;
};

export type Ergebnis =
  | { ok: true; app_class_id: string; geaendert: boolean }
  | { ok: false; grund: "kein-jahrgang" | "kein-besitzer" | "unbekannte-klasse" };

/** DomiGo stores `grade` as smallint NOT NULL, so a group without a year has no row. */
function jahrgangOk(j: number | null): j is number {
  return typeof j === "number" && Number.isInteger(j) && j >= 1 && j <= 4;
}

async function lokaleLehrkraft(db: Db, appUserId: string): Promise<string | null> {
  const rows = await db
    .select({ id: v2IdentityUsers.id })
    .from(v2IdentityUsers)
    .where(and(eq(v2IdentityUsers.id, appUserId), eq(v2IdentityUsers.role, "teacher")))
    .limit(1);
  return rows[0]?.id ?? null;
}

/**
 * Create the class konto just created (SPEC §4.7). Idempotent through the class
 * code: `classes_invite_code_unique` (schema.ts:418) is the key, so a second
 * delivery of the same push answers with the same id and writes nothing.
 *
 * `jahrgang = null` is a REFUSAL, not a default. `classes.grade` is
 * `smallint NOT NULL` (schema.ts:411) and the app reads it everywhere a child
 * sees content; a made-up year would put a ten-year-old in front of the wrong
 * material. konto learns this as a 422 and can fix the group.
 */
export async function createKontoClass(db: Db, eingang: KontoKlassenEingang): Promise<Ergebnis> {
  const joinCode = (eingang.join_code ?? "").trim();
  if (!jahrgangOk(eingang.jahrgang)) return { ok: false, grund: "kein-jahrgang" };

  if (joinCode) {
    const vorhanden = await db
      .select({ id: v2Classes.id })
      .from(v2Classes)
      .where(eq(v2Classes.inviteCode, joinCode))
      .limit(1);
    if (vorhanden[0]) return { ok: true, app_class_id: vorhanden[0].id, geaendert: false };
  }

  const teacherId = await lokaleLehrkraft(db, eingang.owner_app_user_id);
  // The owner has never signed in to DomiGo, so there is no local row to own the
  // class. Refusing is right: konto retries after the first sign-in, and the
  // alternative — inventing a teacher — would put a class under a person who
  // does not exist here.
  if (!teacherId) return { ok: false, grund: "kein-besitzer" };

  const rows = await db
    .insert(v2Classes)
    .values({
      name: eingang.name.trim(),
      inviteCode: joinCode,
      grade: eingang.jahrgang,
      teacherId,
      archivedAt: eingang.archived_at ? new Date(eingang.archived_at) : null,
    })
    .returning({ id: v2Classes.id });
  return { ok: true, app_class_id: rows[0]!.id, geaendert: true };
}

/**
 * Pull a change through (SPEC §10.2): a rename, a new year, a handover, an
 * archive or an un-archive. Reads first, writes only the difference, journals
 * only a real change — with the class NAME never in the payload, only its
 * length, like every other row in this journal (P-R8).
 */
export async function applyKontoClassTerm(db: Db, eingang: KontoKlassenEingang): Promise<Ergebnis> {
  const id = (eingang.app_class_id ?? "").trim();
  if (!id) return { ok: false, grund: "unbekannte-klasse" };
  if (!jahrgangOk(eingang.jahrgang)) return { ok: false, grund: "kein-jahrgang" };

  const vorher = await db
    .select({
      id: v2Classes.id,
      name: v2Classes.name,
      grade: v2Classes.grade,
      teacherId: v2Classes.teacherId,
      archivedAt: v2Classes.archivedAt,
    })
    .from(v2Classes)
    .where(eq(v2Classes.id, id))
    .limit(1);
  const alt = vorher[0];
  if (!alt) return { ok: false, grund: "unbekannte-klasse" };

  const name = eingang.name.trim();
  const archivedAt = eingang.archived_at ? new Date(eingang.archived_at) : null;
  // An unknown owner leaves the owner alone rather than orphaning the class: a
  // handover konto has not finished is not a reason to break the class here.
  const teacherId = (await lokaleLehrkraft(db, eingang.owner_app_user_id)) ?? alt.teacherId;

  const gleich =
    alt.name === name &&
    alt.grade === eingang.jahrgang &&
    alt.teacherId === teacherId &&
    (alt.archivedAt?.getTime() ?? null) === (archivedAt?.getTime() ?? null);
  if (gleich) return { ok: true, app_class_id: id, geaendert: false };

  // Journal first, then the flip — the house order for a database without
  // transactions: a crash between the two leaves a harmless orphan journal row,
  // never an unhistoried change.
  await writeRosterEvent(db, {
    classId: id,
    kind: "konto_sync",
    actorId: null,
    payload: { classId: id, displayNameLength: name.length, grade: eingang.jahrgang, archived: archivedAt !== null },
  });

  await db
    .update(v2Classes)
    .set({ name, grade: eingang.jahrgang, teacherId, archivedAt })
    .where(eq(v2Classes.id, id));
  return { ok: true, app_class_id: id, geaendert: true };
}
