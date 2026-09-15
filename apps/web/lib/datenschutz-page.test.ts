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
 * Plus the one fact still open: the database region must be measured before ship.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  DATENBANK_REGION,
  DATENSCHUTZ_KONTAKT,
  DATENSCHUTZ_STAND,
  FUNKTIONS_REGION,
} from "./datenschutz.ts";

const read = (rel: string): string => readFileSync(new URL(rel, import.meta.url), "utf8");

const page = read("../app/datenschutz/page.tsx");
/** The page without its comment header — only what a reader can see counts. */
const visible = page.replace(/^\s*\/\/.*$/gm, "");
const schema = read("../../../packages/db/src/schema.ts");

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

  it("names every kind of personal data the schema stores", () => {
    const coupling: Array<[column: string, phrase: RegExp]> = [
      ['display_name', /Spitzname/],
      ['given_name', /Echter Name/],
      ['pin_hash', /PIN/],
      ['"text"', /Texte/], // writing_submissions.text
      ['"note"', /Note von 1 bis 5/], // assignment_sessions.note
      ['"latency_ms"', /wie lange du gebraucht hast/],
      ['"game_mode"', /Spielstand/],
      ['"real_name"', /Jahres-Stand/], // rollover_snapshots
      ['"email"', /E-Mail-Adresse/],
      ['"auth_throttle"', /Fehlversuche/],
    ];
    for (const [column, phrase] of coupling) {
      if (!schema.includes(column)) continue; // column gone → the sentence may go too
      assert.match(visible, phrase, `schema.ts stores ${column}, the page must say so (${phrase})`);
    }
  });

  it("names the controller's contact, the complaint authority and a fixed date", () => {
    assert.match(DATENSCHUTZ_KONTAKT, /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/);
    assert.match(visible, /\{DATENSCHUTZ_KONTAKT\}/);
    assert.match(visible, /Datenschutzbehörde/);
    assert.match(DATENSCHUTZ_STAND, /^\d{4}-\d{2}-\d{2}$/);
    assert.doesNotMatch(page, /new Date\(/, "the Stand date must not compute itself");
  });

  it("is linked from start, sign-in and join, and stays public", () => {
    for (const door of ["../app/page.tsx", "../app/signin/page.tsx", "../app/join/[code]/page.tsx"]) {
      assert.match(read(door), /href="\/datenschutz"/, `${door} must link the privacy page`);
    }
    assert.doesNotMatch(read("../middleware.ts"), /["']\/datenschutz/);
  });

  it("names the database region — measured in the Neon console before this ships", () => {
    assert.ok(
      DATENBANK_REGION,
      "DATENBANK_REGION in lib/datenschutz.ts is still null: read the region of DomiGo's Neon project and enter it",
    );
  });
});
