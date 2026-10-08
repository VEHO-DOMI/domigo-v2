import assert from "node:assert/strict";
// @ts-expect-error registerHooks is available in the test runtime (Node 24); app types still target Node 20.
import { registerHooks } from "node:module";
import type { ResolveHookContext, ResolveFnOutput } from "node:module";
import { beforeEach, test } from "node:test";

const fixture = {
  classes: [{ id: "own", name: "Synthetic class", grade: 2 }],
  calls: [] as string[],
  classesFail: false,
  contentClassId: "own",
};
const key = "__assignmentPreviewContentTest";
(globalThis as unknown as Record<string, unknown>)[key] = fixture;
const state = `const f = globalThis[${JSON.stringify(key)}];`;
const stubs = new Map([
  ["server-only", "export {};"],
  ["@/lib/class-wall", `${state} export async function assignableClasses() { f.calls.push("classes"); if(f.classesFail) throw Error("offline"); return f.classes; }`],
  ["@domigo/db", `${state}
    export const getDb = () => ({});
    export async function listAssignmentsForStudent(_db, _scope, classId) {
      f.calls.push("definitions:" + classId);
      return [{ id: "own-task", classId, title: "Synthetic assignment", createdAt: new Date(0) }, { id: "foreign-task", classId: "foreign", createdAt: new Date(1) }];
    }
    export async function getAssignmentWithSections() {
      f.calls.push("definition");
      return { assignment: { id: "own-task", classId: f.contentClassId }, sections: [{ itemIds: ["g2.u01.v001"] }] };
    }
    export const getStudentAssignmentView = () => { throw Error("preview read child state"); };
    export const startOrResumeSession = () => { throw Error("preview started a session"); };
  `],
]);
registerHooks({
  resolve(specifier: string, context: ResolveHookContext, nextResolve: (specifier: string, context: ResolveHookContext) => ResolveFnOutput) {
    const body = stubs.get(specifier);
    return body === undefined ? nextResolve(specifier, context) : { url: `data:text/javascript,${encodeURIComponent(body)}`, shortCircuit: true };
  },
});
const { listPreviewAssignments, getPreviewAssignment } = await import("./preview.ts");
const teacher = { userId: "teacher", classScope: ["own"] } as unknown as Parameters<typeof listPreviewAssignments>[0];

beforeEach(() => {
  fixture.calls.length = 0;
  fixture.classesFail = false;
  fixture.contentClassId = "own";
});

test("preview lists only definitions for authorized classes in the selected grade", async () => {
  const rows = await listPreviewAssignments(teacher, [2]);
  assert.deepEqual(rows.map((r) => r.id), ["own-task"]);
  assert.deepEqual(fixture.calls, ["classes", "definitions:own"]);
  fixture.calls.length = 0;
  assert.deepEqual(await listPreviewAssignments(teacher, [1]), []);
  assert.deepEqual(fixture.calls, ["classes"]);
});

test("preview creates empty sitting data from content only, and rejects a foreign class", async () => {
  const view = await getPreviewAssignment(teacher, "own-task", [2]);
  assert.deepEqual(view?.sessions, []);
  assert.deepEqual(fixture.calls, ["classes", "definition"]);
  fixture.contentClassId = "foreign";
  assert.equal(await getPreviewAssignment(teacher, "foreign-task", [2]), null);
});

test("unknown or unavailable classes fail closed before reading assignment content", async () => {
  assert.equal(await getPreviewAssignment(teacher, "own-task", [1]), null);
  assert.deepEqual(fixture.calls, ["classes"]);
  fixture.calls.length = 0;
  fixture.classesFail = true;
  assert.deepEqual(await listPreviewAssignments(teacher, [2]), []);
  assert.equal(await getPreviewAssignment(teacher, "own-task", [2]), null);
  assert.deepEqual(fixture.calls, ["classes", "classes"]);
});
