import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { classPath, gradeLabel, projectTeacherClass, readResult, readTeacherClassLists } from "../app/admin/_lib/teacher-classes.ts";
import { additionalNavigation, grandmasterNavigation, helpNavigation, managementNavigation, teacherArea, teacherNavigation } from "../app/admin/_lib/navigation.ts";

const web = fileURLToPath(new URL("../", import.meta.url));
const source = (relative: string) => readFileSync(path.join(web, relative), "utf8");
const row = (grade = 1) => ({ id: `synthetic-${grade}`, name: `${grade}A`, grade, inviteCode: `SYNTH-${grade}`, studentCount: 99, createdAt: new Date("2024-02-01T00:00:00Z") });

describe("teacher class reads: empty, success and failure are different results", () => {
  for (const count of [0, 1, 4]) {
    it(`keeps exactly ${count} real input classes; no demonstration fallback`, async () => {
      const rows = Array.from({ length: count }, (_, i) => row(i + 1));
      const lists = await readTeacherClassLists({ active: async () => rows, archived: async () => [] });
      assert.equal(lists.active.status, "ready");
      if (lists.active.status !== "ready") assert.fail("Expected successful class read");
      assert.deepEqual(lists.active.value.map((c) => [c.name, c.grade]), rows.map((c) => [c.name, c.grade]));
      assert.deepEqual(lists.archived, { status: "ready", value: [] });
    });
  }
  for (const failed of ["active", "archived", "both"]) {
    it(`reports ${failed} read failure without suppressing the healthy half`, async () => {
      const archived = { ...row(3), archivedAt: new Date("2025-07-01T00:00:00Z") };
      const lists = await readTeacherClassLists({
        active: async () => { if (failed !== "archived") throw new Error("synthetic read failure"); return [row()]; },
        archived: async () => { if (failed !== "active") throw new Error("synthetic read failure"); return [archived]; },
      });
      assert.deepEqual(lists.active, failed !== "archived" ? { status: "error" } : { status: "ready", value: [projectTeacherClass(row())] });
      assert.deepEqual(lists.archived, failed !== "active" ? { status: "error" } : { status: "ready", value: [projectTeacherClass(archived)] });
    });
  }
  it("catches a synchronous connection error without exposing the exception", async () => {
    const result = await readResult(() => { throw new Error("synthetic private query details"); });
    assert.deepEqual(result, { status: "error" });
    assert.equal(JSON.stringify(result).includes("private"), false);
  });
});

describe("GG N2: unknown metadata stays unknown and unfiltered counts leave the view", () => {
  it("does not infer test status from a class name, or a school year from its date", () => {
    const projected = projectTeacherClass({ ...row(2), name: "Testklasse 2A" });
    assert.equal(projected.name, "Testklasse 2A");
    assert.equal(projected.testStatus, "unknown");
    assert.equal(projected.schoolYear, null);
    assert.equal("studentCount" in projected, false);
    assert.equal("createdAt" in projected, false);
  });
  it("does not accept unapproved metadata merely because a reader has extra properties", () => {
    const input = { ...row(), schoolYear: "2026/27", isTest: true, testStatus: "regular" };
    const projected = projectTeacherClass(input);
    assert.equal(projected.schoolYear, null);
    assert.equal(projected.testStatus, "unknown");
  });
  it("retains a real archive date and each correct grade, never guesses a missing grade", () => {
    assert.equal(projectTeacherClass({ ...row(), archivedAt: new Date("2025-07-01Z") }).archivedAt, "2025-07-01T00:00:00.000Z");
    assert.deepEqual([1, 2, 3, 4].map(gradeLabel), ["Jahrgang 1", "Jahrgang 2", "Jahrgang 3", "Jahrgang 4"]);
    for (const missing of [null, undefined, 0, 5, 1.5, NaN]) assert.equal(gradeLabel(missing), "Jahrgang nicht verfügbar");
  });
});

describe("retained routes and closed action vocabulary", () => {
  it("keeps every existing general teacher destination and its actual route file", () => {
    const links = [...teacherNavigation, ...managementNavigation, ...additionalNavigation, helpNavigation, grandmasterNavigation];
    const destinations = new Set(links.map((l) => l.href));
    for (const oldRoute of ["/admin", "/admin/classes", "/admin/assignments", "/admin/assignments/new", "/admin/studio", "/admin/settings", "/admin/hilfe", "/admin/grandmaster"]) {
      assert.ok(destinations.has(oldRoute as typeof links[number]["href"]), `Lost teacher door: ${oldRoute}`);
      assert.ok(existsSync(path.join(web, "app", oldRoute, "page.tsx")), `Missing target: ${oldRoute}`);
    }
    for (const extra of ["/admin?bereich=schreiben", "/admin?bereich=spielstand", "/admin?bereich=erproben"]) assert.ok(destinations.has(extra as typeof links[number]["href"]));
    assert.deepEqual(links.filter((l) => /wechsel|preview|view-as/.test(l.href)), []);
  });
  it("links each existing class action without accepting an unknown capability", () => {
    for (const [action, suffix] of [["open", ""], ["roster", "/roster"], ["writing", "/schreiben"], ["listening", "/hoeren"]] as const) {
      assert.equal(classPath("a/b?x", action), `/admin/classes/a%2Fb%3Fx${suffix}`);
      assert.ok(existsSync(path.join(web, "app/admin/classes/[id]", suffix, "page.tsx")));
    }
    // Deliberately malformed runtime input: TypeScript alone is not this test.
    assert.throws(() => classPath("synthetic", "preview" as "open"), /Unknown teacher class action/);
    assert.equal(teacherArea("unbekannt"), "classes");
    assert.equal(teacherArea(["schreiben", "verwaltung"]), "classes");
  });
  it("wires the navigation, same scope/owner and safe loading states into the real pages", () => {
    const shell = source("app/admin/_components/TeacherShell.tsx");
    const management = source("app/admin/_components/TeacherManagement.tsx");
    const queries = source("app/admin/_lib/teacher-queries.ts");
    assert.match(shell, /teacherNavigation\.map/);
    assert.match(shell, /helpNavigation\.href/);
    assert.match(management, /managementNavigation\.map/);
    assert.match(management, /additionalNavigation\.map/);
    assert.match(management, /grandmaster\s*&&/);
    assert.match(queries, /listClassesForTeacher\(getDb\(\), teacher\.classScope, teacher\.userId\)/);
    assert.match(queries, /listArchivedClassesForTeacher\(getDb\(\), teacher\.classScope, teacher\.userId\)/);
    for (const page of ["app/admin/page.tsx", "app/admin/classes/page.tsx"]) {
      const text = source(page);
      assert.match(text, /readResult\(getTeacherForPage\)/);
      assert.match(text, /identity\.status === "error"/);
      assert.match(text, /TeacherAccessError retryHref=/);
      assert.match(text, /if \(!teacher\) redirect\("\/admin\/signin"\)/);
      assert.match(text, /Suspense fallback/);
      assert.match(text, /loadTeacherClasses\(teacher\)/);
      assert.doesNotMatch(text, /catch\(\(\) => \[\]/);
    }
    assert.equal(existsSync(path.join(web, "app/admin/layout.tsx")), false);
  });
  it("keeps the dynamic game doors and their existing corpus predicates", () => {
    const text = source("app/admin/_components/GameExploration.tsx");
    for (const call of ["loadKeenLevel", "loadKeenBoss", "listPaintChapters"]) assert.match(text, new RegExp(`${call}\\("g1.st.lost-pages"`));
    for (const door of ["/play/1/world", "/play/1/run?level=g1-${ch}&boss=1", "/play/1/buch/${ch}"]) assert.ok(text.includes(door), `Lost game door: ${door}`);
    assert.match(text, /keine Schüleransicht ohne Speicherung/);
    assert.doesNotMatch(source("app/admin/page.tsx"), /doSignOut|abmelden|Next for teachers|Teacher view/);
  });
});
