/**
 * K9b · The CLIENT half of the roster parser, pinned to the SAME fixtures as the
 * server half. `apps/web/lib/roster-parse.ts` is a deliberate byte-for-byte twin of
 * `packages/db/src/roster-service.ts` (@domigo/db is server-only and must not reach
 * the browser bundle), and a twin nobody compares is a copy waiting to drift.
 *
 * Runner: node's built-in test runner, the same one the other lib tests use
 * (`node --test "lib/*.test.ts"`), so this needs no new tooling.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { MAX_STUDENT_NAME_LENGTH, isImportableName, previewRoster } from "./roster-parse.ts";

/**
 * ── THE SHARED FIXTURE LIST (K9b) ────────────────────────────────────────────
 * This block is BYTE-IDENTICAL in two files, on purpose:
 *   • packages/db/src/roster-service.test.ts        (server: parseRoster)
 *   • apps/web/lib/roster-parse.test.ts             (client: previewRoster)
 * The two parsers are deliberate twins — @domigo/db is server-only and cannot enter
 * the browser bundle — so the only thing that can keep them honest is one list of
 * cases run against both. Add a case here and it must be added there, unchanged.
 *
 * To prove the pinning works, break ONE side's rule and this list goes red on that
 * side alone; a change made to both stays green. A twin nobody compares is just a
 * copy waiting to drift.
 */
const TWIN_FIXTURES: { label: string; input: string; expect: string[] }[] = [
  { label: "plain list, one name per line", input: "Anna Mueller\nBen Ostrowski\nClara Nowak", expect: ["Anna Mueller", "Ben Ostrowski", "Clara Nowak"] },
  { label: "Windows CRLF line endings", input: "Anna\r\nBen\r\nClara", expect: ["Anna", "Ben", "Clara"] },
  { label: "blank and whitespace-only lines are dropped", input: "Anna\n\n   \nBen\n\t\n", expect: ["Anna", "Ben"] },
  { label: "nothing at all", input: "", expect: [] },
  { label: "dedupe is case-insensitive and keeps the FIRST casing", input: "Anna\nanna\nANNA\nBen", expect: ["Anna", "Ben"] },
  { label: "one-column CSV: trailing comma stripped", input: "Anna,\nBen,", expect: ["Anna", "Ben"] },
  { label: "one-column CSV: surrounding quotes stripped", input: "\"Anna\"\n\"Ben\"\n\"Clara\",", expect: ["Anna", "Ben", "Clara"] },
  { label: "multi-column, semicolon separated: first cell wins", input: "Anna Mueller;5B;anna@example.at\nBen Ostrowski;5B;ben@example.at", expect: ["Anna Mueller", "Ben Ostrowski"] },
  { label: "multi-column, TAB separated: first cell wins", input: "Anna Mueller\t5B\nBen Ostrowski\t5B", expect: ["Anna Mueller", "Ben Ostrowski"] },
  { label: "quoted cell keeps its internal comma, the semicolon tail is dropped", input: "\"Mueller, Anna\";5B\n\"Ostrowski, Ben\";5B", expect: ["Mueller, Anna", "Ostrowski, Ben"] },
  { label: "quoted cell followed by a COMMA separator", input: "\"Mueller, Anna\",5B,anna@example.at", expect: ["Mueller, Anna"] },
  { label: "DECLARED BOUNDARY: an UNQUOTED comma keeps the whole line (surname-first is one name)", input: "Mueller, Anna\nOstrowski, Ben", expect: ["Mueller, Anna", "Ostrowski, Ben"] },
  { label: "a header row is just another name — the teacher removes it in the review list", input: "Name;Klasse\nAnna Mueller;5B", expect: ["Name", "Anna Mueller"] },
  { label: "everything at once, the way a real export arrives", input: "\"Mueller, Anna\";5B\nBen Ostrowski\t5B\n\n  Clara Nowak  ,\nben ostrowski\t5B\n", expect: ["Mueller, Anna", "Ben Ostrowski", "Clara Nowak"] },
  { label: "K9b-BLOCKER: a SPACE before the separator is not part of the name", input: "Anna Muster ;5B\nBen Beispiel \t5B", expect: ["Anna Muster", "Ben Beispiel"] },
  { label: "K9b-BLOCKER: the padded line collapses into its twin instead of becoming a second student", input: "Anna Muster;5B\nAnna Muster ;5C", expect: ["Anna Muster"] },
  { label: "K9b-BLOCKER: a comma cell padded with spaces normalizes the SAME on both halves", input: "Anna Muster\nAnna Muster , ;5B", expect: ["Anna Muster"] },
  { label: "a CARRIAGE RETURN alone ends a line (old-Mac exports) — not one giant name", input: "Anna Muster\rBen Beispiel\rClara Probe", expect: ["Anna Muster", "Ben Beispiel", "Clara Probe"] },
  { label: "all three line endings mixed in one paste", input: "Anna Muster\r\nBen Beispiel\nClara Probe\rDoro Tal", expect: ["Anna Muster", "Ben Beispiel", "Clara Probe", "Doro Tal"] },
];

for (const f of TWIN_FIXTURES) {
  test(`twin fixture · ${f.label}`, () => {
    assert.deepEqual(previewRoster(f.input), f.expect);
  });
}

test("first cell wins, whatever the separator", () => {
  assert.deepEqual(previewRoster("Anna;5B"), ["Anna"]);
  assert.deepEqual(previewRoster("Anna\t5B"), ["Anna"]);
  assert.deepEqual(previewRoster('"Anna";5B'), ["Anna"]);
});

test("a BARE comma is NOT a separator — the declared boundary", () => {
  assert.deepEqual(previewRoster("Mueller, Anna"), ["Mueller, Anna"]);
  assert.deepEqual(previewRoster("Mueller, Anna;5B"), ["Mueller, Anna"]);
});

test("an unclosed quote is left alone rather than swallowing the line", () => {
  assert.deepEqual(previewRoster('"Anna'), ['"Anna']);
});

test("dedupes AFTER the columns are cut", () => {
  assert.deepEqual(previewRoster("Anna;5B\nanna;5C"), ["Anna"]);
});

test("K9b-BLOCKER · never returns a name carrying outer whitespace — the INVARIANT, over every fixture", () => {
  // The class, not the instance: one branch let a trailing space through, and the two
  // halves then normalized differently, so the review list promised a number the
  // database did not deliver. Asserting the invariant covers every future branch too.
  for (const f of TWIN_FIXTURES) {
    for (const name of previewRoster(f.input)) {
      assert.equal(name, name.trim());
    }
  }
  assert.deepEqual(previewRoster("Anna Muster ;5B"), ["Anna Muster"]);
  assert.deepEqual(previewRoster("Anna Muster\t;5B"), ["Anna Muster"]);
});

test("isImportableName pins exactly what the server will accept", () => {
  assert.equal(isImportableName("Anna Muster"), true);
  assert.equal(isImportableName("   "), false);
  assert.equal(isImportableName("x".repeat(MAX_STUDENT_NAME_LENGTH)), true);
  assert.equal(isImportableName("x".repeat(MAX_STUDENT_NAME_LENGTH + 1)), false);
  // trims first, so a padded name at the cap is still fine
  assert.equal(isImportableName("  " + "x".repeat(MAX_STUDENT_NAME_LENGTH) + "  "), true);
});
