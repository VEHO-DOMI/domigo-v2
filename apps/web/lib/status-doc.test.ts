/** cgo-097: readable snapshot contract. Content truth is reviewed against its
 * dated sources; this check deliberately has no clock, network or HEAD equality. */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import * as ts from "typescript";

const source = readFileSync(new URL("../../../docs/STATUS_AND_ROADMAP.md", import.meta.url), "utf8");
const archive = readFileSync(new URL("../../../docs/handover/STATUS_ARCHIV_2026-08.md", import.meta.url));
const archivePin = "4b62b91fafac4863d8ed62a7e0faabec";
const classWall = readFileSync(new URL("../app/admin/classes/[id]/page.tsx", import.meta.url), "utf8");
const sections = ["Was LIVE ist", "Was offen ist", "Entscheide seit 07.10.", "Bei Koki offen", "So wird hier gearbeitet"];
const areas = ["Schülerseite", "Spiele Y1–Y4", "Lehrerseite", "Identität/Konto", "Inhalte", "Betrieb/Qualität"];
const headFields: [string, RegExp][] = [
  ["Datum", /^- \*\*Datum:\*\* \d{4}-\d{2}-\d{2}\b/m],
  ["main-sha", /^- \*\*main-sha:\*\* `[a-f0-9]{40}`/m],
  ["PR-Zahl", /^- \*\*Gemergte PRs:\*\* [1-9]\d* insgesamt;/m],
  ["Letzter Merge", /\*\*Letzter Merge:\*\* PR [1-9]\d*\./],
  ["LIVE-Adresse", /^- \*\*LIVE:\*\* https:\/\/eng-unterstufe\.lautereinser\.at\b/m],
  ["CI-Einzeiler", /^- \*\*CI-Einzeiler:\*\* [1-9]\d* `- run:`-Zeilen/m],
  ["Migrationen", /^- \*\*Migrationen:\*\* Repository-Journal \d{4}–\d{4};/m],
];
const md5 = (text: string | Uint8Array) => createHash("md5").update(text).digest("hex");
const cells = (line: string) => line.trim().slice(1, -1).split("|").map((s) => s.trim());
const plain = (cell: string) => cell.replace(/\*\*/g, "");

function block(text: string, heading: string, depth: number): string | undefined {
  const lines = text.split("\n");
  const start = lines.indexOf(`${"#".repeat(depth)} ${heading}`);
  if (start === -1) return undefined;
  let end = start + 1;
  while (end < lines.length && !new RegExp(`^#{1,${depth}} `).test(lines[end])) end++;
  return lines.slice(start + 1, end).join("\n").trim();
}

function tableErrors(text: string, label: string, statusTable = false): string[] {
  const rows = text.split("\n").filter((line) => line.trim().startsWith("|"));
  const fail = (why: string) => [`Tabelle ${label}: ${why}`];
  if (rows.length < 3 || rows.some((line) => !line.trim().endsWith("|") || cells(line).length !== 3)) return fail("drei Spalten und mindestens ein Posten nötig");
  if (!cells(rows[1]).every((cell) => /^:?-{3,}:?$/.test(cell))) return fail("Trennzeile fehlt");
  if (rows.slice(2).some((row) => cells(row).some((cell) => !cell || /^[-–—]$/.test(cell)))) return fail("leerer Posten, Stand oder Beleg");
  if (statusTable) {
    if (cells(rows[0]).join("/") !== "Posten/Stand/Beleg") return fail("Kopf muss Posten / Stand / Beleg heißen");
    if (rows.slice(2).some((row) => !/^(LIVE\b|IN REVIEW PR \d+\b|GEBAUT nicht freigegeben\b|PAUSIERT\b|VERWORFEN\b)/.test(plain(cells(row)[1])))) return fail("unbekannter Stand");
  }
  return [];
}

function statusErrors(raw: string): string[] {
  const errors: string[] = [];
  if (/CODEX\s+DRAFT/i.test(raw)) errors.push("Entwurfsbanner im STATUS");
  // Comments and fenced examples must not supply otherwise missing visible text.
  const text = raw.replace(/<!--[\s\S]*?-->/g, "").replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1\s*$/gm, "");
  const header = text.split(/^## /m)[0];
  for (const [name, pattern] of headFields) if (!pattern.test(header)) errors.push(`Kopf: ${name}`);
  if (!/\[[^\]]+\]\(handover\/STATUS_ARCHIV_2026-08\.md\)/.test(header)) errors.push("Archiv-Verweis fehlt");
  for (const heading of sections) {
    const body = block(text, heading, 2);
    if (!body) errors.push(`Abschnitt: ${heading}`);
    else if (!["Was LIVE ist", "So wird hier gearbeitet"].includes(heading)) errors.push(...tableErrors(body, heading));
  }
  const live = block(text, "Was LIVE ist", 2) ?? "";
  for (const area of areas) {
    const body = block(live, area, 3);
    if (!body) errors.push(`Bereich: ${area}`);
    else errors.push(...tableErrors(body, area, true));
  }
  return errors;
}

test("STATUS on disk has a measured header, required sections and evidenced state tables", () => {
  assert.deepEqual(statusErrors(source), []);
});

test("STATUS selftest: each broken contract is rejected, valid old snapshots stay valid", (t) => {
  assert.deepEqual(statusErrors(source), []);
  const probes: [string, string, string][] = [
    ...headFields.map(([name]) => [name, source.replace(name === "PR-Zahl" ? "Gemergte PRs" : name === "LIVE-Adresse" ? "**LIVE:" : name, "REMOVED"), `Kopf: ${name}`] as [string, string, string]),
    ...sections.map((name) => [name, source.replace(`## ${name}`, `## REMOVED ${name}`), `Abschnitt: ${name}`] as [string, string, string]),
    ...areas.map((name) => [name, source.replace(`### ${name}`, `### REMOVED ${name}`), `Bereich: ${name}`] as [string, string, string]),
    ["archive", source.replace("(handover/STATUS_ARCHIV_2026-08.md)", "(missing.md)"), "Archiv-Verweis"],
    ["draft banner", `> CODEX DRAFT — NOT CANON\n${source}`, "Entwurfsbanner"],
    ["table shape", source.replace("| Posten | Stand | Beleg |", "| Posten | Stand |"), "Tabelle Schülerseite"],
    ["table separator", source.replace("|---|---|---|", "|x|x|x|"), "Tabelle Schülerseite"],
    ["state", source.replace("| LIVE |", "| FERTIG |"), "unbekannter Stand"],
    ["evidence", source.replace(/\| LIVE \|[^\n]+/, "| LIVE | |"), "leerer Posten, Stand oder Beleg"],
    ["commented heading", source.replace("## Bei Koki offen", "<!-- ## Bei Koki offen -->"), "Abschnitt: Bei Koki offen"],
    ["fenced heading", source.replace("## Bei Koki offen", "```md\n## Bei Koki offen\n```"), "Abschnitt: Bei Koki offen"],
  ];
  for (const [name, mutant, expected] of probes) {
    assert.notEqual(md5(mutant), md5(source), `${name}: probe must change bytes`);
    assert.ok(statusErrors(mutant).some((message) => message.includes(expected)), `${name}: expected ${expected}`);
    t.diagnostic(`${name}: red; md5 ${md5(source)} -> ${md5(mutant)}`);
  }
  const oldSnapshot = source.replace(/(\*\*Datum:\*\* )\d{4}-\d{2}-\d{2}/, (_match, prefix: string) => `${prefix}2000-01-01`);
  assert.match(oldSnapshot, /\*\*Datum:\*\* 2000-01-01/);
  assert.deepEqual(statusErrors(oldSnapshot), [], "no calendar expiry");
  assert.deepEqual(statusErrors(source.replace("| LIVE |", "| **LIVE** |")), [], "Markdown emphasis is valid");
});

test("STATUS archive stays byte-identical to the pinned historical document", () => {
  assert.equal(md5(archive), archivePin, "STATUS archive bytes changed");
});

test("STATUS archive selftest rejects one removed line", (t) => {
  const shortened = archive.subarray(0, archive.lastIndexOf("\n", archive.length - 2) + 1);
  assert.notEqual(shortened.length, archive.length);
  assert.notEqual(md5(shortened), md5(archive));
  assert.throws(() => assert.equal(md5(shortened), archivePin), assert.AssertionError);
  t.diagnostic(`archive line removed: red; md5 ${md5(archive)} -> ${md5(shortened)}`);
});

/** Inspect the actual JSX elements, not incidental text or another wrapping div.
 * These are the measures proved at 390/1440 px; this source guard does not replace
 * that browser evidence or introduce a second layout implementation. */
function classWallLayoutErrors(raw: string): string[] {
  const tree = ts.createSourceFile("page.tsx", raw, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const elements: ts.JsxElement[] = [];
  const visit = (node: ts.Node) => {
    if (ts.isJsxElement(node)) elements.push(node);
    ts.forEachChild(node, visit);
  };
  visit(tree);
  const tag = (element: ts.JsxElement) => element.openingElement.tagName.getText(tree);
  const children = (element?: ts.JsxElement) => element?.children.filter(ts.isJsxElement) ?? [];
  const style = (element?: ts.JsxElement): Record<string, string> => {
    const attribute = element?.openingElement.attributes.properties.find(
      (a): a is ts.JsxAttribute => ts.isJsxAttribute(a) && a.name.getText(tree) === "style",
    );
    const expression = attribute?.initializer && ts.isJsxExpression(attribute.initializer) ? attribute.initializer.expression : undefined;
    if (!expression || !ts.isObjectLiteralExpression(expression)) return {};
    return Object.fromEntries(expression.properties.flatMap((property) => {
      if (!ts.isPropertyAssignment(property)) return [];
      const value = property.initializer;
      return ts.isStringLiteral(value) || ts.isNumericLiteral(value)
        ? [[property.name.getText(tree).replace(/["']/g, ""), value.text]] : [];
    }));
  };
  const main = elements.find((element) => tag(element) === "main");
  const header = children(main).find((element) => tag(element) === "div");
  const heading = children(header).find((element) => tag(element) === "h1");
  const links = children(header).find((element) => tag(element) === "div");
  const errors: string[] = [];
  const expect = (element: ts.JsxElement | undefined, label: string, required: Record<string, string>) => {
    const actual = style(element);
    for (const [property, value] of Object.entries(required)) {
      if (actual[property] !== value) errors.push(`${label}: ${property} must be ${value}`);
    }
  };
  expect(main, "main", { width: "100%", maxWidth: "980", minWidth: "0" });
  expect(header, "header", { display: "flex", flexWrap: "wrap" });
  expect(heading, "heading", { minWidth: "0", overflowWrap: "anywhere" });
  expect(links, "links", { display: "flex", flexWrap: "wrap", minWidth: "0" });
  const tables = elements.filter((element) => tag(element) === "table");
  if (tables.length === 0) errors.push("tables: no scrollable tables found");
  for (const table of tables) {
    const parent = ts.isJsxElement(table.parent) && tag(table.parent) === "div" ? table.parent : undefined;
    expect(parent, "table wrapper", { overflowX: "auto" });
  }
  return errors;
}

test("class wall source retains the measures proved at 390 px", () => {
  assert.deepEqual(classWallLayoutErrors(classWall), []);
});

test("class wall selftest rejects removed header flexWrap despite other wrapping divs", (t) => {
  const noWrap = classWall.replace('flexWrap: "wrap", ', "");
  assert.notEqual(md5(noWrap), md5(classWall));
  assert.deepEqual(classWallLayoutErrors(noWrap), ["header: flexWrap must be wrap"]);
  t.diagnostic(`header flexWrap removed: red; md5 ${md5(classWall)} -> ${md5(noWrap)}`);
});
