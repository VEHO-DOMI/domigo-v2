// Real routes and identity; only session and persistence are synthetic.
import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
// @ts-expect-error Node 24 runtime supports registerHooks; app declarations target Node 20.
import { registerHooks } from "node:module";
import type { ResolveHookContext, ResolveFnOutput } from "node:module";
import { existsSync } from "node:fs";
const dbURL = import.meta.resolve("@domigo/db");
const f = { session: null as null | { user: { id: string; role: string; classId: string | null; scope: string[] } }, reads: 0, writes: [] as Array<{ scope: string[]; data: Record<string, unknown> }>, assignment: null as unknown };
Object.assign(globalThis, { __cgo092Walls: f });
const boundary = 'const f = globalThis.__cgo092Walls;';
const modules = new Map([
  ["server-only", "export {};"],
  ["@/auth", `${boundary} export const auth = async () => f.session;`],
  ["@domigo/db", `${boundary}
    export * from ${JSON.stringify(dbURL)};
    export const getDb = () => ({});
    export const recordNodeCompletion = async (_db, scope, data) => { f.writes.push({scope, data}); return {stars:data.stars}; };
    export const recordWritingSubmission = async (_db, scope, data) => { f.writes.push({scope, data}); };
    export const recordAttempt = async (_db, scope, data) => { f.writes.push({scope, data}); };
    export const getStudentAssignmentView = async () => { f.reads++; return f.assignment; };
    export const getSessionAttempts = async () => { f.reads++; return []; };
    export const submitSession = async (_db, id, data) => { f.writes.push({scope:[], data:{id,...data}}); };
  `],
]);
registerHooks({ resolve(specifier: string, context: ResolveHookContext, next: (specifier: string, context: ResolveHookContext) => ResolveFnOutput) {
  if (modules.has(specifier)) return { url: `data:text/javascript,${encodeURIComponent(modules.get(specifier)!)}`, shortCircuit: true };
  if (specifier === "next/server") return next("next/server.js", context);
  if (specifier.startsWith(".") && context.parentURL?.startsWith("file:")) {
    const url = new URL(`${specifier}.ts`, context.parentURL);
    if (existsSync(url)) return next(url.href, context);
  }
  return next(specifier, context);
} });
const { loadUnit, loadTest, listTestUnits } = await import("@domigo/content-loader");
const { buildUnitNodes } = await import("@domigo/db");
const routes = await Promise.all([
  import("./route.ts"), import("../writing-submission/route.ts"),
  import("../assignments/attempt/route.ts"), import("../assignments/submit/route.ts"),
]);
const names = ["study-path", "writing-submission", "assignments/attempt", "assignments/submit"];
const assignmentId = "11111111-1111-4111-8111-111111111111";
const sessionId = "22222222-2222-4222-8222-222222222222";
const unit = loadUnit("g2-u01");
const node = buildUnitNodes(unit.vocab, unit.grammar)[0]!;
const writingSlug = listTestUnits().find((slug) => loadTest(slug)?.test.sections.some((s) => s.kind === "writing"))!;
const test = loadTest(writingSlug)!.test;
const writing = test.sections.find((s) => s.kind === "writing")!;
const bodies = [
  { unitSlug: "g2-u01", nodeId: node.id, stars: 3, accuracy: 1 },
  { unitSlug: writingSlug, testId: test.id, promptId: writing.kind === "writing" ? writing.promptId : "", text: "This is a synthetic answer." },
  { assignmentId, sessionId, clientAttemptId: "33333333-3333-4333-8333-333333333333", itemId: unit.vocab[0]!.id, input: { kind: "vocab", value: "fixture" } },
  { assignmentId, sessionId },
];
const request = (i: number) => new Request(`https://fixture.invalid/api/${names[i]}`, { method: "POST", body: JSON.stringify(bodies[i]), headers: { "content-type": "application/json", "x-dev-user-id": "forged", "x-dev-class-id": "forged" } });
beforeEach(() => {
  process.env.VERCEL_ENV = "production";
  f.session = null; f.reads = 0; f.writes = [];
  f.assignment = { assignment: { id: assignmentId, classId: "synthetic-class", mode: "practice", notenSchluessel: null },
    sections: [{ position: 0, kind: "vocab", itemIds: [unit.vocab[0]!.id], weightPct: 100 }],
    sessions: [{ id: sessionId, submittedAt: null, expiresAt: null, note: null, scorePct: null }] };
});
describe("cgo-092 four real server write walls", () => {
  names.forEach((name, i) => {
    it(`${name}: teacher is 401 before reads or writes`, async () => {
      f.session = { user: { id: "synthetic-teacher", role: "teacher", classId: null, scope: ["synthetic-class"] } };
      const response = await routes[i]!.POST(request(i));
      assert.equal(response.status, 401);
      assert.equal((await response.json()).error, "no_identity");
      assert.equal(f.reads, 0); assert.deepEqual(f.writes, []);
    });
    it(`${name}: anonymous is 401 despite forged dev headers`, async () => {
      assert.equal((await routes[i]!.POST(request(i))).status, 401);
      assert.equal(f.reads, 0); assert.deepEqual(f.writes, []);
    });
    it(`${name}: a child reaches the unchanged writer`, async () => {
      f.session = { user: { id: "synthetic-child", role: "student", classId: "synthetic-class", scope: ["synthetic-class"] } };
      const response = await routes[i]!.POST(request(i));
      assert.equal(response.status, 200);
      assert.equal((await response.json()).ok, true);
      assert.equal(f.writes.length, 1);
      if (i < 3) {
        assert.equal(f.writes[0]!.data.userId, "synthetic-child");
        assert.equal(f.writes[0]!.data.classId, "synthetic-class");
        assert.deepEqual(f.writes[0]!.scope, ["synthetic-class"]);
      }
    });
  });
});
