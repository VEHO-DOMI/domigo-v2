/**
 * The facts the privacy page (app/datenschutz/page.tsx) states that are MEASURED
 * rather than read off the code. Each one is a claim about production, so each
 * one lives here, once, next to where it was measured — and
 * lib/datenschutz-page.test.ts holds the page and vercel.json to them.
 *
 * gomarke-004 (2026-09-14), after the DSFA of daten-008 measured DomiGo's
 * functions in iad1 (Washington, USA) and /datenschutz answering 404.
 */

/** Fixed date of this text. Never computed: a `Stand:` that rewrites itself
 *  daily claims a review that did not happen (srdp DS-0 found exactly that). */
export const DATENSCHUTZ_STAND = "2026-09-14";

/** The controller as recorded in the processing register (S2, 2026-09-13,
 *  section A: Koki as a private person) plus the address Koki chose on
 *  2026-09-14. */
export const VERANTWORTLICHER = "Orhan Vehabovic, Lehrkraft";
export const DATENSCHUTZ_KONTAKT = "datenschutz@lautereinser.at";

/** Must equal `regions` in apps/web/vercel.json — the test enforces it. Proven
 *  live by the second segment of `x-vercel-id` on a dynamic route (`fra1::fra1::…`). */
export const FUNKTIONS_REGION = "fra1";

/** Region of DomiGo's Neon project, read in the Neon console. `null` = not yet
 *  measured; the page then names no database location, and the test stays red
 *  so the page cannot ship without it. */
export const DATENBANK_REGION: string | null = null;
