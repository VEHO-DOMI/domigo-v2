/**
 * dach-018 · SIGNING IN THROUGH konto — turning a handoff into a local person.
 *
 * The order is the whole design, and each step can only refuse:
 *   1. trade the one-time token for the claims (server to server, §4.4);
 *   2. decide whether this person may be here at all (L2 for teachers, a class
 *      bridge for children) — BEFORE creating anything, so a refusal never
 *      leaves a half-made user behind;
 *   3. find the local user konto points at, dual-read v2 then v1;
 *   4. or make one, and tell konto which id it got (§4.5).
 *
 * Runs inside the Credentials `authorize`, which NextAuth serves from
 * /api/auth/[...nextauth] with `runtime = "nodejs"` — so bcrypt is reachable
 * here even though this file's neighbours must stay Edge-safe.
 */
import { createKontoStudent, createKontoTeacher, findKontoIdentity, getDb, klasseExistiert, syncKontoStudentClass } from "@domigo/db";
import { hashPin } from "../pin.ts";
import { appClassIds, exchangeHandoff, istLehrkraftFuerGo, type Claims } from "./claims.ts";

export type KontoAnmeldung = {
  id: string;
  name: string;
  role: "student" | "teacher";
  classId: string | null;
  kontoSid: string;
  appUserId: string;
  scope: string[];
  /** Passed L2 at sign-in; re-asked every minute by the session callback. */
  goTeacher: boolean;
};

/**
 * A hash of something nobody knows. The column is NOT NULL and after the
 * switch-over DomiGo verifies no PIN at all — the PIN lives at konto. A random
 * bcrypt hash is the honest filler: it cannot be guessed, and it cannot
 * accidentally match an empty input the way a blank string might.
 */
async function unbrauchbarerPinHash(): Promise<string> {
  return hashPin(`${crypto.randomUUID()}${crypto.randomUUID()}`);
}

/** The display name DomiGo shows. Children are a nickname, teachers a short code. */
function anzeigeName(claims: Claims): string {
  return claims.kind === "student" ? claims.nick : claims["kürzel"];
}

export type Abweisung = "kein-handoff" | "keine-rolle" | "keine-klasse" | "unbekannt";

export type Ergebnis = { ok: true; nutzer: KontoAnmeldung } | { ok: false; grund: Abweisung };

export async function handoffAnmelden(
  handoff: string,
  melde: (sub: string, appUserId: string) => Promise<boolean>,
): Promise<Ergebnis> {
  const claims = await exchangeHandoff(handoff);
  if (!claims) return { ok: false, grund: "kein-handoff" };

  const scope = appClassIds(claims);

  // L2 and L3 decided BEFORE anything is written.
  if (claims.kind === "teacher" && !istLehrkraftFuerGo(claims)) {
    return { ok: false, grund: "keine-rolle" };
  }
  // A child is exactly one class (SPEC §5, Schülerfall F6). No bridge, no child:
  // the group exists at konto but has never been created in DomiGo.
  const kindKlasse = claims.kind === "student" ? (scope[0] ?? null) : null;
  if (claims.kind === "student" && !kindKlasse) {
    return { ok: false, grund: "keine-klasse" };
  }
  if (kindKlasse && !(await klasseExistiert(getDb(), kindKlasse))) {
    // konto believes in a bridge this database does not have — treat it as no
    // class rather than creating a child into a class that is not there.
    console.error("[konto] class bridge points at a class DomiGo does not have");
    return { ok: false, grund: "keine-klasse" };
  }

  const db = getDb();
  const name = anzeigeName(claims);

  if (claims.app_user_id) {
    const vorhanden = await findKontoIdentity(db, claims.app_user_id);
    if (vorhanden) {
      // Follow a child who changed class at konto, or the register loses them.
      if (vorhanden.role === "student" && kindKlasse && vorhanden.classId !== kindKlasse && vorhanden.quelle === "v2") {
        await syncKontoStudentClass(db, vorhanden.id, kindKlasse);
      }
      return {
        ok: true,
        nutzer: {
          id: vorhanden.id,
          name: vorhanden.displayName,
          role: vorhanden.role,
          classId: vorhanden.role === "student" ? (kindKlasse ?? vorhanden.classId) : null,
          kontoSid: claims.sid,
          appUserId: vorhanden.id,
          scope,
          goTeacher: claims.kind === "teacher",
        },
      };
    }
    // konto names a user this database has never had. Falling through to create
    // one would mint a SECOND user for the same person the moment the stale link
    // is repaired, so refuse and let the link be fixed at konto.
    console.error("[konto] app_user_id names a user DomiGo does not have — stale app_link");
    return { ok: false, grund: "unbekannt" };
  }

  const pinHash = await unbrauchbarerPinHash();
  const id =
    claims.kind === "student"
      ? await createKontoStudent(db, { displayName: name, classId: kindKlasse!, pinHash })
      : await createKontoTeacher(db, { displayName: name, pinHash });

  // Report the bridge back. If konto does not take it, the next sign-in would
  // create a SECOND user for the same person — so a refused link refuses the
  // sign-in too.
  if (!(await melde(claims.sub, id))) {
    console.error("[konto] app-link not accepted — refusing the sign-in rather than risking a second user");
    return { ok: false, grund: "unbekannt" };
  }

  return {
    ok: true,
    nutzer: {
      id,
      name,
      role: claims.kind,
      classId: claims.kind === "student" ? kindKlasse : null,
      kontoSid: claims.sid,
      appUserId: id,
      scope,
      goTeacher: claims.kind === "teacher",
    },
  };
}
