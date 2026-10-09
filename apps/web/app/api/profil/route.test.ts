import assert from "node:assert/strict";
import { beforeEach, it } from "node:test";
import * as nodeModule from "node:module";
type Resolution = { url: string; shortCircuit?: boolean };
type Context = { parentURL?: string };
type NextResolve = (specifier: string, context: Context) => Resolution;
const { registerHooks } = nodeModule as unknown as { registerHooks: (hooks: { resolve: (specifier: string, context: Context, next: NextResolve) => Resolution }) => void };
import { existsSync } from "node:fs";
const fixture = { session: null as unknown, calls: [] as unknown[][], fail: false };
(globalThis as unknown as Record<string, unknown>).__profileTest = fixture;
const state = 'const f = globalThis.__profileTest;';
const dbURL = import.meta.resolve("@domigo/db");
const modules = new Map([
  ["server-only", "export {};"],
  ["@/auth", `${state} export const auth = async () => f.session;`],
  ["@domigo/db", `${state} export * from ${JSON.stringify(dbURL)};
    export const getDb = () => ({});
    export async function setStudentAvatar(...args) { f.calls.push(args.slice(1)); if(f.fail) throw new Error('offline'); }
  `],
]);
registerHooks({ resolve(specifier, context, next) {
  if (modules.has(specifier)) return { url: `data:text/javascript,${encodeURIComponent(modules.get(specifier)!)}`, shortCircuit: true };
  if (specifier === "next/server") return next("next/server.js", context);
  if (specifier.startsWith(".") && context.parentURL?.startsWith("file:")) {
    const url = new URL(`${specifier}.ts`, context.parentURL); if (existsSync(url)) return next(url.href, context);
  }
  return next(specifier, context);
} });
const { POST } = await import("./route.ts");
beforeEach(() => { fixture.session = null; fixture.calls.length = 0; fixture.fail = false; process.env.VERCEL_ENV = "production"; });
const child = () => { fixture.session = { user: { id: "test-child", classId: "test-class", role: "student", scope: ["test-class"] } }; };
const request = (body: unknown, origin = "https://example.test") => new Request("https://example.test/api/profil", { method: "POST", headers: { origin, "content-type": "application/json" }, body: JSON.stringify(body) });
it("anonymous and teacher preview cannot write", async () => {
  assert.equal((await POST(request({ avatar: 2, ownerId: "test-child" }))).status, 401);
  fixture.session = { user: { id: "test-teacher", classId: null, role: "teacher", scope: ["test-class"] } };
  assert.equal((await POST(request({ avatar: 2, ownerId: "test-teacher" }))).status, 401);
  assert.equal(fixture.calls.length, 0);
});
it("foreign origin, owner and invalid number never write", async () => {
  child();
  assert.equal((await POST(request({ avatar: 2, ownerId: "test-child" }, "https://foreign.test"))).status, 403);
  assert.equal((await POST(request({ avatar: 2, ownerId: "other" }))).status, 400);
  for (const avatar of [0, 51, 1.5, "2"]) assert.equal((await POST(request({ avatar, ownerId: "test-child" }))).status, 400);
  assert.equal(fixture.calls.length, 0);
});
it("one own selection writes once with trusted session class and account", async () => {
  child();
  const result = await POST(request({ avatar: 7, ownerId: "test-child", classId: "forged" }));
  assert.equal(result.status, 200); assert.deepEqual(await result.json(), { ok: true, avatar: 7 });
  assert.deepEqual(fixture.calls, [[["test-class"], "test-class", "test-child", 7]]);
});
it("storage failure never claims success", async () => {
  child(); fixture.fail = true;
  const result = await POST(request({ avatar: 7, ownerId: "test-child" }));
  assert.equal(result.status, 503); assert.equal((await result.json()).ok, false);
});
