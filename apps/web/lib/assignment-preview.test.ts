import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { runInNewContext } from "node:vm";
import type { ReactElement } from "react";
import * as jsxRuntime from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import { resolveAssignmentPrefill, type AssignmentPrefill } from "./assignment-prefill.ts";

// Execute the actual TSX in Node's existing test runner. Only framework/session
// boundaries are substitutes; the link logic, page and content resolver are real.
function loadComponent<T>(path: string, modules: Record<string, unknown>): T {
  const file = new URL(path, import.meta.url);
  const { outputText } = ts.transpileModule(readFileSync(file, "utf8"), {
    fileName: file.pathname,
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  });
  const exports: { default?: T } = {};
  const dependencies: Record<string, unknown> = {
    "react/jsx-runtime": jsxRuntime,
    "next/link": { __esModule: true, default: "a" },
    ...modules,
  };
  runInNewContext(outputText, {
    exports, URLSearchParams,
    require: (name: string) => {
      assert.ok(Object.hasOwn(dependencies, name), `Unexpected component dependency: ${name}`);
      return dependencies[name];
    },
  }, { filename: file.pathname });
  assert.ok(exports.default);
  return exports.default;
}

function previewLink(path: string) {
  const Component = loadComponent<() => ReactElement<{ href: string }> | null>("../app/PreviewAssignmentLink.tsx", {
    "next/navigation": { usePathname: () => path },
  });
  return Component();
}

type Page = (props: { searchParams: Promise<Record<string, string>> }) => Promise<ReactElement<{ prefill?: AssignmentPrefill | null }>>;
const newAssignmentPage = loadComponent<Page>("../app/admin/assignments/new/page.tsx", {
  "next/navigation": { redirect: () => { throw new Error("Unexpected redirect"); } },
  "@/lib/checkup": { GRADE_STRUCTURES: {} },
  "@/lib/identity": { getTeacherForPage: async () => ({ userId: "synthetic-teacher" }) },
  "@/lib/class-wall": { assignableClasses: async () => [] },
  "./AssignmentBuilder": { __esModule: true, default: "assignment-builder" },
  "@/lib/assignment-prefill": { resolveAssignmentPrefill },
});

describe("preview assignment links", () => {
  for (const [path, expected] of [
    ["/practice/g2-u01", { source: "unit", grade: "2", unit: "g2-u01" }],
    ["/play/3/ch02", { source: "story", grade: "3", chapter: "ch02" }],
  ] as const) {
    it(`carries only the content coordinates from ${path}`, () => {
      const link = previewLink(path);
      assert.ok(link);
      const url = new URL(link.props.href, "https://synthetic.invalid");
      assert.equal(url.pathname, "/admin/assignments/new");
      assert.deepEqual([...url.searchParams.keys()].sort(), Object.keys(expected).sort());
      assert.deepEqual(Object.fromEntries(url.searchParams), expected);
      assert.equal(url.hash, "");
      assert.match(renderToStaticMarkup(link), /Chapter-Übungen zuweisen/);
    });
  }
  it("returns no assignment link on other paths", () => {
    for (const path of ["/admin/explorer", "/practice", "/practice/g5-u01", "/practice/g2-u01/extra", "/play/3", "/play/3/ch02/extra", "/play/0/ch02", "/play/3/unknown"]) {
      assert.equal(previewLink(path), null, path);
    }
  });
});

describe("assignment page query handling", () => {
  it("opens the normal builder for unrelated parameters without source", async () => {
    const page = await newAssignmentPage({ searchParams: Promise.resolve({ utm_source: "synthetic", classId: "foreign" }) });
    assert.equal(page.type, "assignment-builder");
    assert.equal(page.props.prefill, null);
  });
  it("prefills the builder for an approved source", async () => {
    const page = await newAssignmentPage({ searchParams: Promise.resolve({ source: "unit", grade: "2", unit: "g2-u01" }) });
    assert.equal(page.type, "assignment-builder");
    assert.deepEqual(page.props.prefill?.source, { source: "unit", grade: 2, unit: "g2-u01" });
  });
  it("refuses unknown parameters alongside a source", async () => {
    const page = await newAssignmentPage({ searchParams: Promise.resolve({ source: "unit", grade: "2", unit: "g2-u01", classId: "foreign" }) });
    assert.equal(page.type, "main");
    assert.match(renderToStaticMarkup(page), /Inhalt nicht zuweisbar/);
  });
  it("treats even an empty source as a preview request to validate", async () => {
    const page = await newAssignmentPage({ searchParams: Promise.resolve({ source: "" }) });
    assert.equal(page.type, "main");
    assert.match(renderToStaticMarkup(page), /Inhalt nicht zuweisbar/);
  });
});
