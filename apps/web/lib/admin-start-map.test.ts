/** cgo-077: source contracts and deliberately broken twins. No live data. */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { createSourceFile, forEachChild, isBinaryExpression, isJsxAttribute, ScriptKind, ScriptTarget, SyntaxKind, type Node } from "typescript";

const page = readFileSync(new URL("../app/admin/page.tsx", import.meta.url), "utf8");
const cards = readFileSync(new URL("../app/admin/KlassenKarten.tsx", import.meta.url), "utf8");
const code = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
const hash = (s: string) => createHash("md5").update(s).digest("hex");

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
  { name: "no platform-wide or pupil-level readers", source: page + cards,
    passes: s => !/\b(?:listClassesInScope|listAllClassIds|listAllClassesForGrandmaster|assignableClasses|listRoster|listStudentProgress|listStudentMeta|holeKlassenliste)\b/.test(code(s)),
    break: s => s + '\nlistClassesInScope(getDb(), teacher.classScope);' },
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

describe("teacher start source contracts", () => {
  for (const law of laws) {
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
