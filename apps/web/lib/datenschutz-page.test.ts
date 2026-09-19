/**
 * gomarke-004 · the privacy page is a claim about production, so a machine holds
 * it to production (node --test, like the other lib tests — apps/web has no vitest).
 *
 * Four couplings, each one a way the page could silently start lying:
 *   1. the region the page names IS the region vercel.json pins (DSFA measured iad1);
 *   2. no "EU only" wording — the providers are US companies (srdp DS-0 found it);
 *   3. while schema.ts carries a personal-data column, the page names that data;
 *   4. every door a child walks through (start, sign-in, join) links the page,
 *      and middleware.ts never puts the page behind a login.
 * Plus the two measured facts the reader must actually see: the database region
 * and — because the page promises deletion — how far a backup still reaches back.
 *
 * gomarke-008 (2026-09-17) · coupling 3 TURNED AROUND, and three claims that had
 * no machine at all now have one.
 *
 * Coupling 3 used to be a hand-written positive list of ten column names: while
 * `display_name` existed, the page had to say "Spitzname". It could only ever
 * notice a column that DISAPPEARED — a NEW personal-data column, which is what
 * actually happens when a feature ships, was invisible to it, and the page went
 * on presenting a complete list. Now lib/datenschutz-spalten.ts classifies EVERY
 * column and this file reads the schema at RUNTIME, through drizzle's own column
 * metadata rather than a regex over the source, and compares both directions:
 * unclassified column ⇒ red; classification pointing at nothing ⇒ red (STALE).
 *
 * The three new couplings:
 *   5. the sentence "keine Werbung, keine Analyse- oder Tracking-Dienste, und die
 *      Schriften kommen vom eigenen Server" may not outlive the gate that proves
 *      it — scripts/check-datenschutz-claims.mjs must exist AND be really run by
 *      ci.yml. Same for "keine E-Mail-Adressen von Kindern", which rests on that
 *      gate's second law (one writer for users.email) and NOT on a database
 *      constraint — the page is worded accordingly.
 *   6. the page says WHO has the administration access, so it must name the
 *      controller in its visible text, as long as lib/grandmaster.ts still gives
 *      somebody that reach.
 *   7. the page promises an answer within a month (Art. 12 (3) GDPR), so the
 *      sentence has to be there. It is the one claim on this page that no code
 *      can prove: a legal duty, not a measurement.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as schemaTabellen from "../../../packages/db/src/schema.ts";
import {
  DATENBANK_REGION,
  DATENSCHUTZ_KONTAKT,
  DATENSCHUTZ_STAND,
  FUNKTIONS_REGION,
  RUECKHOLFENSTER,
} from "./datenschutz.ts";
import { SPALTEN } from "./datenschutz-spalten.ts";

const read = (rel: string): string => readFileSync(new URL(rel, import.meta.url), "utf8");

const page = read("../app/datenschutz/page.tsx");
/**
 * The page without its comment header — only what a reader can see counts. Runs of
 * whitespace collapse to one space, because JSX line breaks are arbitrary: a reader
 * sees one space where the source has a newline plus eight spaces of indentation.
 * Found the hard way (gomarke-008, 2026-09-17): re-wrapping a paragraph split
 * »deinem Konto zugeordnet« across two lines and turned eight couplings red on a
 * page whose visible text had not changed at all.
 */
const visible = page.replace(/^\s*\/\/.*$/gm, "").replace(/\s+/g, " ");

/**
 * Every table of domigo_v2 as the RUNNING code defines it, read through drizzle's
 * own well-known symbols. Not a regex over schema.ts: a regex has to be taught
 * every way a column can be written (two `table()` forms, trailing comments,
 * `sql`lower(x)`` inside an index), and the one it has not been taught is the one
 * that ships. And not `import { getTableColumns } from "drizzle-orm"` either —
 * apps/web does not depend on drizzle-orm, only on @domigo/db; the symbols are
 * reachable without it.
 */
const COLUMNS = Symbol.for("drizzle:Columns");
const TABLE_NAME = Symbol.for("drizzle:Name");
const IS_TABLE = Symbol.for("drizzle:IsDrizzleTable");

const tabellenImCode = (): Map<string, string[]> => {
  const out = new Map<string, string[]>();
  for (const wert of Object.values(schemaTabellen as Record<string, unknown>)) {
    if (wert === null || typeof wert !== "object") continue;
    const t = wert as Record<symbol, unknown>;
    if (t[IS_TABLE] !== true) continue; // the pgSchema object itself, for one
    const name = t[TABLE_NAME] as string;
    const spalten = Object.values(t[COLUMNS] as Record<string, { name: string }>).map((c) => c.name);
    out.set(name, spalten);
  }
  return out;
};

describe("Datenschutzseite ↔ Produktion", () => {
  it("vercel.json pins exactly the region the page names, and it is Frankfurt", () => {
    const cfg = JSON.parse(read("../vercel.json")) as { regions?: string[] };
    assert.deepEqual(cfg.regions, [FUNKTIONS_REGION]);
    assert.equal(FUNKTIONS_REGION, "fra1");
    assert.match(visible, /\{FUNKTIONS_REGION\}/);
    assert.match(visible, /Frankfurt/);
  });

  it("never claims processing happens only in the EU", () => {
    assert.doesNotMatch(visible, /ausschlie(ß|ss)lich\s+(in\s+der\s+)?(EU|Europ)/i);
    assert.doesNotMatch(visible, /nur\s+in\s+der\s+(EU|Europ)/i);
  });

  it("classifies EVERY column the schema has — a new one cannot ship unnoticed", () => {
    const imCode = tabellenImCode();
    assert.ok(imCode.size > 0, "no drizzle table found — this coupling would pass vacuously");

    const unklassifiziert: string[] = [];
    for (const [tabelle, spalten] of imCode) {
      const klassifikation = SPALTEN[tabelle];
      if (klassifikation === undefined) {
        unklassifiziert.push(`the whole table ${tabelle} (${spalten.length} columns)`);
        continue;
      }
      for (const spalte of spalten) {
        if (klassifikation[spalte] === undefined) unklassifiziert.push(`${tabelle}.${spalte}`);
      }
    }
    assert.deepEqual(
      unklassifiziert,
      [],
      "lib/datenschutz-spalten.ts does not classify these, so nobody has decided whether the privacy " +
        "page must name them: " +
        unklassifiziert.join(", "),
    );
  });

  it("keeps no classification for a column that is gone (the ratchet)", () => {
    const imCode = tabellenImCode();
    const veraltet: string[] = [];
    for (const [tabelle, klassifikation] of Object.entries(SPALTEN)) {
      const spalten = imCode.get(tabelle);
      if (spalten === undefined) {
        veraltet.push(`the whole table ${tabelle}`);
        continue;
      }
      for (const spalte of Object.keys(klassifikation)) {
        if (!spalten.includes(spalte)) veraltet.push(`${tabelle}.${spalte}`);
      }
    }
    assert.deepEqual(
      veraltet,
      [],
      "lib/datenschutz-spalten.ts classifies columns the schema no longer has — an exception may " +
        "tolerate a gap, never outlive it: " +
        veraltet.join(", "),
    );
  });

  it("names every kind of personal data the schema stores", () => {
    const fehlt: string[] = [];
    let geprueft = 0;
    for (const [tabelle, klassifikation] of Object.entries(SPALTEN)) {
      for (const [spalte, eintrag] of Object.entries(klassifikation)) {
        if (eintrag.marke === "sachlich") continue;
        assert.ok(
          eintrag.wendung instanceof RegExp,
          `${tabelle}.${spalte} is ${eintrag.marke}, so it owes the German wording that names it`,
        );
        geprueft++;
        if (!eintrag.wendung.test(visible)) fehlt.push(`${tabelle}.${spalte} → ${String(eintrag.wendung)}`);
      }
    }
    assert.ok(geprueft >= 50, `only ${geprueft} personal columns — did a classification turn to sachlich wholesale?`);
    assert.deepEqual(
      fehlt,
      [],
      "the schema stores this, the page does not say it: " + fehlt.join(" · "),
    );
  });

  it("names the controller's contact, the complaint authority and a fixed date", () => {
    assert.match(DATENSCHUTZ_KONTAKT, /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/);
    assert.match(visible, /\{DATENSCHUTZ_KONTAKT\}/);
    assert.match(visible, /Datenschutzbehörde/);
    assert.match(DATENSCHUTZ_STAND, /^\d{4}-\d{2}-\d{2}$/);
    assert.doesNotMatch(page, /new Date\(/, "the Stand date must not compute itself");
  });

  it("is linked from every door a reader can stand at, and stays public", () => {
    // dach-018 / dach-108 · /join/<code> used to be one of those doors; it is a
    // fixed 307 to the account service and renders nothing. The access card took its place:
    // it is where a refused sign-in lands, so it is exactly where someone is most
    // likely to want to know what is stored about them.
    for (const door of ["../app/page.tsx", "../app/signin/page.tsx", "../app/zugriff-fehlt/page.tsx"]) {
      assert.match(read(door), /href="\/datenschutz"/, `${door} must link the privacy page`);
    }
    assert.doesNotMatch(read("../middleware.ts"), /["']\/datenschutz/);
  });

  it("names the database region — measured in the Neon console before this ships", () => {
    assert.ok(
      DATENBANK_REGION,
      "DATENBANK_REGION in lib/datenschutz.ts is still null: read the region of DomiGo's Neon project and enter it",
    );
    assert.match(visible, /\{DATENBANK_REGION\}/, "the measured region must reach the reader, not just the file");
  });

  it("tells the reader how far a backup still reaches back, once that is measured", () => {
    if (!RUECKHOLFENSTER) return; // not measured → the page says nothing about backups
    assert.match(
      visible,
      /\{RUECKHOLFENSTER\}/,
      "the page promises deletion on request, so it must say how long a backup still holds the deleted rows",
    );
  });

  // gomarke-008 · the three claims PR #437 listed as unguarded.

  it("does not let the 'no third parties' sentence outlive the gate that proves it", () => {
    for (const satzteil of [
      /keine Werbung/,
      /keine Analyse- oder Tracking-Dienste/,
      /Schriften kommen\s+vom eigenen Server/,
      /E-Mail-Adressen von Kindern/,
    ]) {
      assert.match(visible, satzteil, `the page lost ${String(satzteil)} — then this coupling guards nothing`);
    }

    const tor = read("../../../scripts/check-datenschutz-claims.mjs");
    assert.match(tor, /GESETZ 1/, "law 1 (no third parties) must still be in that gate");
    assert.match(tor, /GESETZ 2/, "law 2 (one writer for users.email) must still be in that gate");
    // Named as plain strings, not escaped regexes: this file is the declared
    // exception in that gate's law 1, and an exception that matches nothing goes
    // STALE and turns the gate red. So the two names have to be really here.
    assert.ok(tor.includes("@vercel/analytics"), "the gate must still name the packages it forbids");
    assert.ok(tor.includes("fonts.googleapis.com"), "the gate must still name the font services it forbids");
    assert.ok(tor.includes("teacher-identity.ts"), "the gate must still name the ONE door to users.email");

    // A gate CI does not really run is a comment. check-ci-gates.mjs polices this
    // too, from the other side; here it is what keeps the SENTENCE honest.
    const ci = read("../../../.github/workflows/ci.yml");
    const echterLauf = ci
      .split("\n")
      .filter((zeile) => zeile.includes("scripts/check-datenschutz-claims.mjs"))
      .filter((zeile) => !zeile.includes("--self" + "test"));
    assert.equal(
      echterLauf.length,
      1,
      "ci.yml must run scripts/check-datenschutz-claims.mjs on the real tree exactly once, " +
        "not only as its own instrument check",
    );
  });

  it("does not claim the DATABASE forbids a child's e-mail — only the app does", () => {
    // The CHECK constraint (role <> 'student' OR email IS NULL) is possible and is
    // PROPOSED as a Neon sheet (Koki's decision, card gomarke-008); until somebody
    // has run it, the page may say who can enter an address, never that the
    // database refuses one.
    assert.doesNotMatch(visible, /Datenbank\s+(verbietet|verhindert|lässt\s+keine)/);
  });

  it("names WHO has the administration access, as long as the code grants it to somebody", () => {
    const grandmaster = read("./grandmaster.ts");
    if (!grandmaster.includes("GRANDMASTER_ENV_VAR")) return; // the rank is gone → the sentence may go
    assert.match(visible, /Verwaltungszugang/, "the reach exists in the code, so the page must name it");
    assert.match(
      visible,
      /\{VERANTWORTLICHER\}/,
      "the page says the administration access belongs to the controller, so it must name the controller " +
        "(Koki's statement of 2026-09-17 — the allowlist lives in Vercel and no test can read it)",
    );
  });

  it("promises an answer to a request within a month", () => {
    assert.match(
      visible,
      /spätestens innerhalb eines Monats/,
      "Art. 12 (3) GDPR — the blind parent reader of gomarke-007 missed exactly this",
    );
  });
});
