import assert from "node:assert/strict";
import { test } from "node:test";
import { parseTables, parseVerdicts, renderTable } from "../mdtable.ts";

test("table round-trip survives pipes, newlines and editor re-spacing", () => {
  const headers = ["ref", "en", "de"];
  const rows = [
    ["tradition", "tradition", "Tradition ; Brauch"],
    ["pipe", "a|b", "x\ny"],
  ];
  const md = renderTable(headers, rows);
  // editor reflow: re-spaces around UNESCAPED pipes (formatters respect \|)
  const mangled = md
    .split("\n")
    .map((l) => l.replace(/ \| /g, "    |  ").replace(/^\| /, "|   ").replace(/ \|$/, "   |"))
    .join("\n");
  const parsed = parseTables(mangled);
  assert.equal(parsed.length, 1);
  const t = parsed[0]!;
  assert.deepEqual(t.headers, headers);
  assert.equal(t.rows[0]?.["de"], "Tradition ; Brauch");
  assert.equal(t.rows[1]?.["en"], "a|b");
  assert.equal(t.rows[1]?.["de"], "x\ny");
});

test("verdict lexer: flag blocks + unit verdict + notes", () => {
  const md = [
    "### F1 · duplicate-headword · `g2u03.w.trick-or-treat-2`",
    "stuff",
    "> verdict: ok",
    "> note: keep both, the list teaches both",
    "",
    "### F2 · v1-missing · `picnic`",
    "> verdict: _",
    "> note:",
    "",
    "## Unit verdict",
    "> unit: changes",
    "> note: see F2",
  ].join("\n");
  const v = parseVerdicts(md);
  assert.equal(v.flags.length, 2);
  assert.deepEqual(
    v.flags.map((f) => [f.kind, f.ref, f.verdict]),
    [
      ["duplicate-headword", "g2u03.w.trick-or-treat-2", "ok"],
      ["v1-missing", "picnic", null],
    ],
  );
  assert.equal(v.flags[0]?.note, "keep both, the list teaches both");
  assert.equal(v.unit?.verdict, "changes");
  assert.equal(v.unit?.note, "see F2");
});

test("verdict lexer: trailing commentary after the verdict word is ignored", () => {
  const v = parseVerdicts(["### F1 · not-in-transcript · `x`", "> verdict: ok — list-only vocab"].join("\n"));
  assert.equal(v.flags[0]?.verdict, "ok");
});
