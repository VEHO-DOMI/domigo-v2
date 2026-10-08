/** cgo-077: source contracts and deliberately broken twins. No live data. */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  createSourceFile, forEachChild, isArrowFunction, isBinaryExpression, isCallExpression,
  isIdentifier, isImportDeclaration, isJsxAttribute, isJsxText, isNamedImports,
  isPropertyAccessExpression, isStringLiteralLike, isTemplateExpression, isTypeNode,
  ScriptKind, ScriptTarget, SyntaxKind, type Node,
} from "typescript";

const page = readFileSync(new URL("../app/admin/page.tsx", import.meta.url), "utf8");
const cards = readFileSync(new URL("../app/admin/KlassenKarten.tsx", import.meta.url), "utf8");
const code = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
const hash = (s: string) => createHash("md5").update(s).digest("hex");

const DB_READERS = new Set(["getDb", "listClassesForTeacher", "listClassRegistrationCountsForTeacher", "listAssignmentsByCreator"]);
// Type-only imports do not read data; keep their names explicit too.
const DB_TYPES = new Set(["ClassSummary", "AssignmentRow"]);
const PAGE_CALLS = new Set([...DB_READERS, "getTeacherForPage", "redirect", "readStart", "isGrandmaster", "kontoBaseUrl", "listPaintChapters", "abmelden", "Number", "summarizeAssignments", "deadlineLabel"]);
const METHODS = new Set(["all", "map", "get", "slice", "toISOString"]);
const PERSON_FIELDS = /^(?:displayName|firstName|givenName|lastName|surname|nickname|display_name|first_name|given_name|last_name|identity_users|v2IdentityUsers)$/i;

/** Fail closed on unknown imports AND calls (including unimported reader g2).
 * Parsing syntax, rather than matching import text, also sees renamed imports. */
function onlySummaryReaders(src: string): boolean {
  const tree = createSourceFile("admin.tsx", src, ScriptTarget.Latest, true, ScriptKind.TSX);
  const calls = new Set(PAGE_CALLS);
  let ok = true;
  const visit = (node: Node) => {
    if (isImportDeclaration(node) && isStringLiteralLike(node.moduleSpecifier)) {
      const importPath = node.moduleSpecifier.text;
      if (importPath === "@domigo/db" || importPath.startsWith("@domigo/db/")) {
        const clause = node.importClause;
        const bindings = clause?.namedBindings;
        if (importPath !== "@domigo/db" || !clause || clause.name || !bindings || !isNamedImports(bindings)) ok = false;
        else for (const spec of bindings.elements) {
          const original = (spec.propertyName ?? spec.name).text;
          if (clause.isTypeOnly || spec.isTypeOnly) {
            if (!DB_TYPES.has(original)) ok = false;
          } else if (!DB_READERS.has(original)) ok = false;
          else calls.add(spec.name.text);
        }
      }
    }
    if (isIdentifier(node) && (/^listRoster|Students|StudentNames/i.test(node.text) || PERSON_FIELDS.test(node.text))) ok = false;
    if (isStringLiteralLike(node) && PERSON_FIELDS.test(node.text)) ok = false;
    if (isCallExpression(node)) {
      const callee = node.expression;
      if (isIdentifier(callee)) {
        if (!calls.has(callee.text)) ok = false;
      } else if (isPropertyAccessExpression(callee)) {
        if (!METHODS.has(callee.name.text)) ok = false;
      } else ok = false; // dynamic imports, require/element access and indirect calls
    }
    forEachChild(node, visit);
  };
  visit(tree);
  return ok;
}

/** Only the class label may be rendered as a name: cls must be bound by
 * classes.map, not by a pupils/roster loop with a convenient variable name. */
function noPersonNames(src: string): boolean {
  const tree = createSourceFile("admin.tsx", src, ScriptTarget.Latest, true, ScriptKind.TSX);
  let ok = true;
  const visit = (node: Node) => {
    if (isTypeNode(node)) return;
    if ((isIdentifier(node) || isStringLiteralLike(node)) && PERSON_FIELDS.test(node.text)) ok = false;
    if ((isIdentifier(node) || isStringLiteralLike(node)) && node.text === "name") {
      const access = node.parent;
      let classLabel = false;
      if (isPropertyAccessExpression(access) && access.name === node && access.expression.getText(tree) === "cls") {
        for (let p: Node | undefined = access.parent; p; p = p.parent) {
          if (!isArrowFunction(p) || !p.parameters.some(param => param.name.getText(tree) === "cls")) continue;
          const call = p.parent;
          classLabel = isCallExpression(call) && call.expression.getText(tree) === "classes.map";
          break;
        }
      }
      if (!classLabel) ok = false;
    }
    forEachChild(node, visit);
  };
  visit(tree);
  return ok;
}

/** Reviewed literal inventory, not a heuristic for what a person's name looks
 * like. Covers JSX text, expressions, templates and indirect string constants;
 * comments are ignored. Copy changes need an explicit review and a new pin. */
function literalPin(src: string): string {
  const tree = createSourceFile("admin.tsx", src, ScriptTarget.Latest, true, ScriptKind.TSX);
  const literals: string[] = [];
  const add = (s: string) => { const text = s.replace(/\s+/g, " ").trim(); if (text) literals.push(text); };
  const visit = (node: Node) => {
    if (isStringLiteralLike(node) || isJsxText(node)) add(node.text);
    if (isTemplateExpression(node)) {
      add(node.head.text);
      for (const span of node.templateSpans) add(span.literal.text);
    }
    forEachChild(node, visit);
  };
  visit(tree);
  return hash(JSON.stringify(literals.sort()));
}

/** Inspect the actual link's ancestors; a stray isGrandmaster elsewhere is no guard. */
function guardedGrandmaster(src: string): boolean {
  const tree = createSourceFile("page.tsx", src, ScriptTarget.Latest, true, ScriptKind.TSX);
  let links = 0;
  let guarded = 0;
  const visit = (node: Node) => {
    if (isJsxAttribute(node) && node.name.getText(tree) === "href" && node.initializer?.getText(tree) === '"/admin/grandmaster"') {
      links++;
      for (let p: Node | undefined = node.parent; p; p = p.parent) {
        if (isBinaryExpression(p) && p.operatorToken.kind === SyntaxKind.AmpersandAmpersandToken
          && p.left.getText(tree) === "isGrandmaster(teacher.userId)" && node.pos >= p.right.pos) {
          guarded++;
          break;
        }
      }
    }
    forEachChild(node, visit);
  };
  visit(tree);
  return links === 1 && guarded === 1;
}

type Law = { name: string; source: string; passes: (s: string) => boolean; break: (s: string) => string };
const laws: Law[] = [
  { name: "teacher gate before database reads", source: page,
    passes: s => /const teacher = await getTeacherForPage\(\);\s*if \(!teacher\) redirect\("\/admin\/signin"\);/.test(code(s)) && s.indexOf('if (!teacher)') < s.indexOf('readStart(() =>'),
    break: s => s.replace('if (!teacher)', 'if (false)') },
  ...["listClassesForTeacher", "listClassRegistrationCountsForTeacher", "listAssignmentsByCreator"].flatMap(name => [
    { name: `${name}: session scope`, source: page,
      passes: (s: string) => code(s).includes(`${name}(getDb(), teacher.classScope, teacher.userId)`),
      break: (s: string) => s.replace(`${name}(getDb(), teacher.classScope, teacher.userId)`, `${name}(getDb(), [], teacher.userId)`) },
    { name: `${name}: ownership`, source: page,
      passes: (s: string) => code(s).includes(`${name}(getDb(), teacher.classScope, teacher.userId)`),
      break: (s: string) => s.replace(`${name}(getDb(), teacher.classScope, teacher.userId)`, `${name}(getDb(), teacher.classScope, "foreign")`) },
  ]),
  ...[page, cards].flatMap((source, i) => [
    { name: `${i === 0 ? "page" : "cards"}: only approved summary readers`, source,
      passes: onlySummaryReaders, break: (s: string) => s + '\nlistStudentNames(getDb());' },
    { name: `${i === 0 ? "page" : "cards"}: no pupil name fields`, source,
      passes: noPersonNames, break: (s: string) => s.replace(i === 0 ? "</h1>" : "</h2>", (i === 0 ? "</h1>" : "</h2>") + '<span>{student.name}</span>') },
    { name: `${i === 0 ? "page" : "cards"}: reviewed literals contain no fixed pupil names`, source,
      passes: (s: string) => literalPin(s) === (i === 0 ? "ca83f96f191bfcb7a350982b820a9951" : "8b16a9c08961b53097dae62247495007"),
      break: (s: string) => s.replace(i === 0 ? "</h1>" : "</h2>", (i === 0 ? "</h1>" : "</h2>") + '<span>Max Mustermann</span>') },
  ]),
  { name: "grandmaster link under its own rank guard", source: page,
    passes: guardedGrandmaster, break: s => s.replace('isGrandmaster(teacher.userId) &&', 'true &&') },
  { name: "no sunset game links", source: page + cards,
    passes: s => !/\/play\/[^"'`\s]*\/(?:world|run)\b/.test(code(s)),
    break: s => s + '\nconst bad = "/play/1/world";' },
  { name: "all three class doors use supported routes", source: cards,
    passes: s => code(s).includes('href={`/admin/classes/${cls.id}`}') && code(s).includes('href="/admin/assignments/new"') && code(s).includes('href={`/practice?jahrgang=${cls.grade}`}'),
    break: s => s.replace('/practice?jahrgang=${cls.grade}', '/practice?jahrgang=1') },
  { name: "account is the class-creation door", source: page,
    passes: s => code(s).includes('`${kontoBaseUrl()}/lehrerraum/lehrgruppen`') && code(s).includes('href={lehrerraumUrl}') && !/Klasse anlegen|createClass\(/.test(code(s)),
    break: s => s.replace('`${kontoBaseUrl()}/lehrerraum/lehrgruppen`', '"/admin/classes/new"') },
  { name: "classes before further doors, no global mastery table", source: page,
    passes: s => s.indexOf('<KlassenKarten ') > 0 && s.indexOf('<KlassenKarten ') < s.indexOf('Weitere Wege</h2>') && !/getUnitMastery|<table\b/.test(code(s)),
    break: s => s + '\ngetUnitMastery(getDb(), teacher.classScope, 1);' },
  { name: "dashboard adds no write or API path", source: page + cards,
    passes: s => !/\b(?:fetch|createAssignment|recordAttempt|useEffect)\s*\(|["'`]\/api\/|"use client"/.test(code(s)) && (code(s).match(/"use server"/g) ?? []).length === 1 && /await abmelden\(\);/.test(code(s)),
    break: s => s + '\nfetch("/api/attempts", { method: "POST" });' },
  { name: "failed classes are distinct from no classes", source: page,
    passes: s => /!classes.ok \?/.test(code(s)) && code(s).includes('Klassen gerade nicht verfügbar') && code(s).includes('classes.value.length === 0'),
    break: s => s.replace('!classes.ok ?', 'false ?') },
  { name: "existing teacher doors all remain", source: page,
    passes: s => ["explorer", "assignments", "studio", "hilfe", "settings"].every(route => code(s).includes(`href: "/admin/${route}"`)) && code(s).includes('href={`/play/1/buch/${ch}`}'),
    break: s => s.replace('href: "/admin/explorer"', 'href: "/admin"') },
];

const privacyVariants: Law[] = [
  ...["listStudentNames", "futureReader", "listRosterDetails", "listStudents"].map(reader => ({
    name: `renamed DB import: ${reader}`, source: page, passes: onlySummaryReaders,
    break: (s: string) => s.replace("{ getDb,", `{ ${reader} as hiddenRead, getDb,`),
  })),
  ...[
    'import * as db from "@domigo/db";',
    'import { futureReader } from "@domigo/db/roster-service";',
    'const db = await import("@domigo/db");',
    'import { readIdentity as hiddenRead } from "@/lib/identity"; hiddenRead();',
  ].map((extra, i) => ({
    name: `indirect reader ${i + 1}`, source: page, passes: onlySummaryReaders,
    break: (s: string) => `${s}\n${extra}`,
  })),
  ...["student.displayName", "student.firstName", "identity_users.display_name"].map(field => ({
    name: `pupil field: ${field}`, source: cards, passes: noPersonNames,
    break: (s: string) => s.replace("{cls.name}</h2>", `{${field}}</h2>`),
  })),
  { name: "a pupil loop cannot masquerade as the class label", source: cards, passes: noPersonNames,
    break: s => s.replace("classes.map((cls)", "students.map((cls)") },
  ...['{"Max Mustermann"}', '{`Max Mustermann`}'].map(expression => ({
    name: `fixed pupil name in expression: ${expression}`, source: cards,
    passes: (s: string) => literalPin(s) === "8b16a9c08961b53097dae62247495007",
    break: (s: string) => s.replace("{cls.name}</h2>", `${expression}</h2>`),
  })),
];

describe("teacher start source contracts", () => {
  for (const law of [...laws, ...privacyVariants]) {
    it(law.name, () => assert.equal(law.passes(law.source), true));
    it(`tamper is red: ${law.name}`, () => {
      const before = hash(law.source);
      const mutant = law.break(law.source);
      assert.notEqual(hash(mutant), before, "tamper must change bytes");
      assert.equal(law.passes(mutant), false);
      assert.equal(hash(law.source), before, "original remains intact");
      console.log(`TAMPER ${law.name} md5-before=${before} mutant=${hash(mutant)} after=${hash(law.source)} RED`);
    });
  }
});
