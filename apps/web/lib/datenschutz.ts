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
export const DATENSCHUTZ_STAND = "2026-09-17";

/** The controller as recorded in the processing register (S2, 2026-09-13,
 *  section A: Koki as a private person). */
export const VERANTWORTLICHER = "Orhan Vehabovic, Lehrkraft";

/** Koki's work address at the school, named by him on card gomarke-007
 *  (2026-09-17) and published on the school's own website. It replaces
 *  datenschutz@lautereinser.at, which accepts no mail: an SMTP probe at the MX
 *  mail.lautereinser.at answered `550 relay not permitted` on 2026-09-14, so a
 *  parent writing there would have been answered by a bounce. */
export const DATENSCHUTZ_KONTAKT = "orhan.vehabovic@pgrg13.at";

/** Must equal `regions` in apps/web/vercel.json — the test enforces it. Proven
 *  live by the second segment of `x-vercel-id` on a dynamic route (`fra1::fra1::…`). */
export const FUNKTIONS_REGION = "fra1";

/** Region of DomiGo's Neon project, read in the Neon console on 2026-09-15
 *  (card gomarke-005): project `domigo-db` / `round-queen-35804068`, region
 *  "AWS Europe Central 1 (Frankfurt)" = aws-eu-central-1, Postgres 17.
 *  `null` would mean not yet measured; the page then names no database
 *  location, and the test stays red so the page cannot ship without it. */
export const DATENBANK_REGION: string | null = "Frankfurt (AWS eu-central-1)";

/** Neon's restore window for that project, read in the same console session
 *  (6 h, the maximum of the free plan). It belongs on the page because the page
 *  promises deletion on request: for that long, a backup still reaches back to
 *  the deleted rows. `null` = not measured, and the page then says nothing
 *  about backups. */
export const RUECKHOLFENSTER: string | null = "6 Stunden";
