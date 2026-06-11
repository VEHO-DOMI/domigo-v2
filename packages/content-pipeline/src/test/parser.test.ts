import assert from "node:assert/strict";
import { test } from "node:test";
import { filterRealDocx } from "../extract.ts";
import { shapeEntry, splitDe } from "../wordbank.ts";

test("filterRealDocx: ' N' suffix is junk only when the sibling exists", () => {
  const kept = filterRealDocx([
    "More 2 SB Unit 1.docx",
    "More 2 SB Unit 2.docx", // real file — previously wrongly dropped
    "More 2 SB Unit 12.docx", // real file ending in digits
    "More 2 SB Unit 1 2.docx", // iCloud dup of Unit 1
    "More 2 SB Unit 1 3.docx", // iCloud dup of Unit 1
    "~$More 2 SB Unit 1.docx", // Word lock
    ".hidden.docx",
    "notes.txt",
  ]);
  assert.deepEqual(kept, ["More 2 SB Unit 1.docx", "More 2 SB Unit 12.docx", "More 2 SB Unit 2.docx"]);
});

test("splitDe: top-level alternatives split, parenthesised commas stay whole", () => {
  assert.deepEqual(splitDe("Sport, Leibeserziehung"), ["Sport", "Leibeserziehung"]);
  assert.deepEqual(splitDe("besuchen (Universität, Veranstaltung)"), ["besuchen (Universität, Veranstaltung)"]);
  assert.deepEqual(splitDe("froh; glücklich"), ["froh", "glücklich"]);
  assert.deepEqual(splitDe("Süßes oder Saures"), ["Süßes oder Saures"]);
  assert.deepEqual(splitDe("Hexe\nZauberin"), ["Hexe", "Zauberin"]);
});

test("shapeEntry: lowercase particles combine with the base, never appear bare", () => {
  const e = shapeEntry(
    { kind: "phrase", theme: null, en: "to be proud (of)", deRaw: "stolz sein (auf)", exampleSb: "I was very proud." },
    "g2u03.w.to-be-proud",
  );
  assert.equal(e.cf, "be proud");
  assert.ok(e.forms.includes("to be proud"));
  assert.ok(e.forms.includes("be proud of"));
  assert.ok(e.forms.includes("to be proud of"));
  assert.ok(!e.forms.includes("of"), "bare particle must not become a taught form");
});

test("shapeEntry: uppercase parentheticals are abbreviations, kept standalone", () => {
  const e = shapeEntry(
    { kind: "wordfile", theme: "School Subjects", en: "physical education (PE)", deRaw: "Sport, Leibeserziehung", exampleSb: null },
    "g2u01.w.physical-education",
  );
  assert.ok(e.forms.includes("physical education"));
  assert.ok(e.forms.includes("PE"));
});

test("shapeEntry: (pl …) parentheticals add the plural form", () => {
  const e = shapeEntry(
    { kind: "wordfile", theme: null, en: "knife (pl knives)", deRaw: "Messer", exampleSb: null },
    "g1u05.w.knife",
  );
  assert.ok(e.forms.includes("knife"));
  assert.ok(e.forms.includes("knives"));
});
