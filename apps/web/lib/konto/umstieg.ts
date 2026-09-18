/**
 * dach-018 · THE ONE DATE.
 *
 * The switch-over day is the day DomiGo stops signing anyone in itself and the
 * account service at konto takes over. Three things are counted from it — the
 * 14-day notice on the two sign-in pages, the expiry of the declared leftovers
 * in konto-local-login-allowlist.json (+90 days), and the day the privacy
 * paragraphs start being true. Each of them is DERIVED here and typed nowhere
 * else: a date entered twice is a date that will disagree with itself.
 *
 * Koki set the day on 2026-09-17 (board card steu-013, point 2A): Monday
 * 13 October 2026, a week after the Matura tool, because two switch-overs in
 * one week is one too many. The grand architect confirms or corrects this one
 * line before merging — nothing else moves with it.
 *
 * Deliberately free of `@/…` path aliases: apps/web's suite runs under plain
 * `node --test` without a bundler (cf. lib/grade-scope.ts).
 */

/** ISO date, Europe/Vienna. Changed ONLY here. */
export const UMSTIEGSTAG = "2026-10-13";

/** Days the sign-in pages keep explaining where the sign-in went (SPEC §6, F10). */
export const HINWEIS_TAGE = 14;

/** Days a declared leftover provider stays admissible (SPEC §6, R-F10). */
export const REST_TAGE = 90;

function plusTage(iso: string, tage: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) throw new Error(`[konto] UMSTIEGSTAG is not a date: ${iso}`);
  d.setUTCDate(d.getUTCDate() + tage);
  return d.toISOString().slice(0, 10);
}

/** The calendar day in Vienna, as YYYY-MM-DD — the school's day, not UTC's. */
export function wienerTag(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Vienna" }).format(now);
}

/** Last day the 14-day notice is shown (inclusive). */
export const HINWEIS_BIS = plusTage(UMSTIEGSTAG, HINWEIS_TAGE);

/** Last day a declared leftover is admissible (inclusive). */
export const REST_ABLAUF = plusTage(UMSTIEGSTAG, REST_TAGE);

/** Has the switch-over happened? Drives the privacy paragraphs (DATEN-7 §4). */
export function umgestiegen(now: Date = new Date()): boolean {
  return wienerTag(now) >= UMSTIEGSTAG;
}

/** Is the "where the sign-in went" notice still owed? */
export function hinweisFaellig(now: Date = new Date()): boolean {
  return wienerTag(now) <= HINWEIS_BIS;
}
