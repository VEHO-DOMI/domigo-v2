/**
 * welle-076 · WELCHE ENTWICKLUNGS-IDENTITÄT DIE MIDDLEWARE OHNE SITZUNG DURCHLÄSST —
 * pur, damit es prüfbar ist (middleware.ts selbst lädt unter `node --test` nicht:
 * es importiert @/auth und damit next-auth).
 *
 * Die dokumentierten Rückfälle aus lib/identity.ts gelten nur außerhalb der
 * Produktion, und die Middleware muss sie genauso sehen wie die Seite dahinter:
 *   · /admin öffnet nur DEV_TEACHER_ID — der einzige Weg ohne Sitzung dorthin;
 *   · der Hub /play/<n> lässt eine Lehrkraft spielen (getPlayerForPage fällt auf
 *     getTeacherForPage zurück), also öffnet ihn DEV_USER_ID ODER DEV_TEACHER_ID.
 *     Seit /play/:grade im Matcher steht, würde die Lehrer-Tür sonst hier schon
 *     zufallen (PB-60, docs/handover/12_g2_passover.md);
 *   · alles andere Schülerseiten: DEV_USER_ID.
 * Edge-safe: nur Strings.
 */
/** Liest nur VERCEL_ENV, DEV_USER_ID, DEV_TEACHER_ID — `process.env` passt direkt hinein. */
export type DevUmgebung = Readonly<Record<string, string | undefined>>;

export function devDurchlass(pathname: string, env: DevUmgebung): boolean {
  if (env.VERCEL_ENV === "production") return false;
  if (pathname.startsWith("/admin")) return !!env.DEV_TEACHER_ID;
  if (pathname.startsWith("/play/")) return !!env.DEV_USER_ID || !!env.DEV_TEACHER_ID;
  return !!env.DEV_USER_ID;
}
