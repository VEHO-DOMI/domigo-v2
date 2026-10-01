/** Synthetic component evidence only; no login, browser, database or persistence claim. */
import "../app/admin/_lib/render-test-register.mjs";
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { TeacherClass, TeacherClassLists } from "../app/admin/_lib/teacher-classes.ts";

// Load TSX only after the dedicated test loader has registered. It uses the
// installed TypeScript/React/Next versions, not a copied markup implementation.
const { default: ClassDirectory } = await import("../app/admin/_components/ClassDirectory.tsx");
const { default: TeacherManagement } = await import("../app/admin/_components/TeacherManagement.tsx");
const { ClassesLoading, TeacherShell } = await import("../app/admin/_components/TeacherShell.tsx");
const { default: TeacherAccessError } = await import("../app/admin/_components/TeacherAccessError.tsx");

const classRow = (grade = 1): TeacherClass => ({
  id: `synthetic-class-${grade}`, name: `${grade}A`, grade, inviteCode: `SYNTH-${grade}`,
  archivedAt: null, schoolYear: null, testStatus: "unknown",
});
const ready = (rows: TeacherClass[]): TeacherClassLists["active"] => ({ status: "ready", value: rows });
function render(lists: TeacherClassLists, mode: "home" | "manage" | "writing" = "home") {
  return renderToStaticMarkup(createElement(ClassDirectory, { lists, mode, lehrerraumUrl: "https://synthetic.invalid/lehrerraum/lehrgruppen" }));
}

describe("teacher directory: synthetic rendered state coverage", () => {
  for (const count of [0, 1, 4]) {
    it(`renders ${count} own classes with the correct grades and all real destinations`, () => {
      const rows = Array.from({ length: count }, (_, index) => classRow(index + 1));
      const html = render({ active: ready(rows), archived: ready([]) });
      assert.equal(html.includes("Keine aktive Klasse"), count === 0);
      assert.equal(html.includes("Schuljahr"), false);
      assert.equal(html.includes("Testklasse"), false);
      for (const cls of rows) {
        assert.ok(html.includes(`Jahrgang ${cls.grade}`));
        assert.ok(html.includes(`>${cls.name}</a>`));
        for (const suffix of ["", "/schreiben", "/hoeren", "/roster"]) assert.ok(html.includes(`href="/admin/classes/${cls.id}${suffix}"`));
      }
    });
  }
  for (const failure of ["active", "archived", "both"]) {
    it(`renders ${failure} failure without a false empty or zero state`, () => {
      const lists: TeacherClassLists = {
        active: failure === "archived" ? ready([classRow()]) : { status: "error" },
        archived: failure === "active" ? ready([{ ...classRow(4), archivedAt: "2025-07-01T00:00:00Z" }]) : { status: "error" },
      };
      const html = render(lists);
      assert.equal(html.includes("Aktive Klassen konnten nicht geladen werden"), failure !== "archived");
      assert.equal(html.includes("Archivierte Klassen konnten nicht geladen werden"), failure !== "active");
      assert.equal(html.includes("Keine aktive Klasse"), false);
      assert.equal(html.includes("Keine archivierte Klasse vorhanden"), false);
      assert.ok(html.includes('role="alert"'));
      assert.ok(html.includes('href="/admin"'));
      if (failure === "archived") assert.ok(html.includes(">1A</a>"));
      if (failure === "active") assert.ok(html.includes(">4A</a>"));
    });
  }
  it("separates a confirmed synthetic test class, preserves archive links and a supplied year", () => {
    const html = render({
      active: ready([classRow(), { ...classRow(2), testStatus: "test", schoolYear: "2026/27" }]),
      archived: ready([{ ...classRow(3), archivedAt: "2025-07-01T00:00:00Z", testStatus: "test" }]),
    });
    assert.ok(html.includes('id="testklassen"'));
    assert.ok(html.indexOf('id="testklassen"') < html.indexOf(">2A</a>"));
    assert.ok(html.includes("Schuljahr 2026/27"));
    assert.ok(html.includes('href="/admin/classes/synthetic-class-3"'));
    assert.ok(html.includes("Archiviert am"));
  });
  it("does not classify a named Test class with unknown status or leak a profile count", () => {
    const html = render({ active: ready([{ ...classRow(), name: "Test 1A", studentCount: 999 } as TeacherClass]), archived: ready([]) });
    assert.ok(html.includes(">Test 1A</a>"));
    assert.equal(html.includes('id="testklassen"'), false);
    assert.equal(html.includes("999"), false);
    assert.equal(html.includes("reguläre Klasse"), false);
    assert.equal(html.includes("Schuljahr"), false);
  });
  it("does not claim there is no active class when a confirmed active test class exists", () => {
    const html = render({ active: ready([{ ...classRow(), testStatus: "test" }]), archived: ready([]) });
    assert.equal(html.includes("Keine aktive Klasse"), false);
    assert.ok(html.includes('id="testklassen"'));
    assert.match(html, /<h3><a[^>]*>1A<\/a><\/h3>/);
  });
  it("shows codes only in management and never shows speculative role-switch actions", () => {
    const lists = { active: ready([classRow()]), archived: ready([]) };
    assert.equal(render(lists).includes("SYNTH-1"), false);
    assert.ok(render(lists, "manage").includes("SYNTH-1"));
    for (const mode of ["home", "manage", "writing"] as const) {
      const html = render(lists, mode);
      assert.doesNotMatch(html, /\/wechsel|Als Schüler ansehen|Mein Klassenzugang|view-as/);
    }
    assert.match(render(lists, "writing"), /Schreibabgaben: 1A/);
  });
  it("renders an announced loading state and the real primary navigation", () => {
    assert.match(renderToStaticMarkup(createElement(ClassesLoading)), /role="status".*Klassen werden geladen/);
    const html = renderToStaticMarkup(createElement(TeacherShell, { area: "classes", children: "Synthetische Komponente" }));
    for (const label of ["Meine Klassen", "Aufgaben", "Schreiben", "Verwaltung", "Hilfe"]) assert.ok(html.includes(label));
    assert.ok(html.includes('lang="de"'));
    assert.ok(html.includes('aria-current="page"'));
  });
  it("keeps the grandmaster door unavailable for a normal teacher", () => {
    const props = { lehrerraumUrl: "https://synthetic.invalid/lehrerraum", grandmaster: false };
    assert.equal(renderToStaticMarkup(createElement(TeacherManagement, props)).includes("/admin/grandmaster"), false);
    assert.equal(renderToStaticMarkup(createElement(TeacherManagement, { ...props, grandmaster: true })).includes("/admin/grandmaster"), true);
  });
  it("shows a thrown identity error as unavailable access, never as no classes", () => {
    const html = renderToStaticMarkup(createElement(TeacherAccessError, { retryHref: "/admin/classes" }));
    assert.ok(html.includes('role="alert"'));
    assert.ok(html.includes("Dein Lehrerzugang konnte nicht geladen werden."));
    assert.ok(html.includes('href="/admin/classes"'));
    assert.equal(html.includes("Keine aktive Klasse"), false);
  });
});
