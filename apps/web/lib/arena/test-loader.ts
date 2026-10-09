/** Test-only: execute the actual route/render source with explicit external seams. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as ts from "typescript";
export const source = (file: string) => readFileSync(new URL(`../../../../${file}`, import.meta.url), "utf8");
export function loadTestModule(file: string, dependencies: Record<string, unknown>): Record<string, (...args: never[]) => unknown> {
  const js = ts.transpileModule(source(file), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 } }).outputText;
  const loaded = { exports: {} };
  new Function("require", "module", "exports", js)((id: string) => { assert.ok(id in dependencies, `Missing boundary: ${id}`); return dependencies[id]; }, loaded, loaded.exports);
  return loaded.exports;
}
