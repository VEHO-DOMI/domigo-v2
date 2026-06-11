/**
 * Calibration: the item validators MUST catch the documented defects of the
 * v1 g2-u03 vocab JSON (the unit whose bad content motivated the rebuild) —
 * and must NOT flag what is actually taught (the cumulative property).
 * Committed inputs only (v1 snapshot + approved banks).
 */
import assert from "node:assert/strict";
import path from "node:path";
import { test } from "node:test";
import type { VocabItem } from "@domigo/content-schema";
import { buildAllowedMatcher } from "../cumulative-bank.ts";
import { readJsonIfExists } from "../json.ts";
import { UNITS_DIR } from "../paths.ts";
import { entryMatchesWord } from "../review-wordbank.ts";
import { distractorErrors, levelGateErrors } from "../validate-items.ts";
import { vocabItem } from "./item-fixtures.ts";

interface V1Entry {
  w: string;
  g?: string;
  d?: string;
  s?: string;
  a?: string[];
  mc?: string[];
}
interface BankFile {
  entries: Array<{ id: string; en: string; forms: string[] }>;
}

function loadCalibrationItems(): VocabItem[] {
  const v1 = readJsonIfExists<{ entries: V1Entry[] }>(
    path.resolve(UNITS_DIR, "..", "..", "build", "v1", "vocab", "g2", "unit-03.json"),
  );
  const bank = readJsonIfExists<BankFile>(path.join(UNITS_DIR, "g2-u03", "wordbank.json"));
  assert.ok(v1 !== null && bank !== null, "calibration inputs missing — run content v1-snapshot");
  let synthetic = 0;
  return v1.entries.map((ve) => {
    const match = bank.entries.find((e) => entryMatchesWord(e as never, ve.w));
    const id = match?.id ?? `g2u03.w.v1-only-${++synthetic}`;
    return vocabItem({
      id,
      w: ve.w,
      g: ve.g ?? "—",
      d: ve.d ?? "(no definition)",
      s: ve.s ?? "(no ___ sentence)",
      sAnswers: [{ text: ve.w, tier: "full" }],
      dAnswers: [{ text: ve.w, tier: "full" }],
      mc: (ve.mc ?? ["x", "y", "z"]).slice(0, 3) as [string, string, string] & string[],
      gloss: [],
    });
  });
}

test("calibration: v1 unit-03 defects fire V-5 and V-9; taught words stay green", () => {
  const items = { vocab: loadCalibrationItems(), grammar: [] };
  const matcher = buildAllowedMatcher("g2-u03");

  const v5 = levelGateErrors("g2-u03", items, matcher);
  // THE documented defect: the invented "carols" carrier on `tradition`
  assert.ok(
    v5.some((e) => e.includes('"carols"') && e.includes("tradition")),
    `V-5 must flag the invented carols carrier; got:\n${v5.join("\n")}`,
  );
  // negative control — "21st" and "hundred" are taught in g1 (cumulative gate)
  assert.ok(!v5.some((e) => e.includes('"21st"')), "21st is taught (g1-u12) — must not flag");
  assert.ok(!v5.some((e) => e.includes('"hundred"')), "hundred is taught (g1) — must not flag");

  const v9 = distractorErrors("g2-u03", items, matcher);
  assert.ok(v9.some((e) => e.includes('"millennium"')), "millennium (century mc) is out-of-bank");
  assert.ok(v9.some((e) => e.includes('"decade"')), "decade (century mc) is out-of-bank");
  assert.ok(v9.some((e) => e.includes('"wizard"')), "wizard (witch mc) is out-of-bank");
});
