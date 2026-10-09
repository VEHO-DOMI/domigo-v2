/** cgo-111: execute the actual route and middleware with synthetic session/storage. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { beforeEach, describe, it } from "node:test";
import { transpileModule, ModuleKind, ScriptTarget } from "typescript";
import { ClassSettingsForbiddenError } from "@domigo/db";

const CLASS_ID = "00000000-0000-4000-8000-000000000001";
const FOREIGN_ID = "00000000-0000-4000-8000-000000000002";
type Session = { user: { id: string; role: string; via?: string; goTeacher?: boolean } } | null;
let session: Session;
let scope: string[];
let grandmaster: boolean;
let writes: unknown[][];
let writeError: Error | null;

function loadTs(url: URL, dependencies: Record<string, unknown>) {
  const source = readFileSync(url, "utf8");
  const compiled = transpileModule(source, { compilerOptions: { module: ModuleKind.CommonJS, target: ScriptTarget.ES2022 } }).outputText;
  const loadedModule = { exports: {} as Record<string, (...args: never[]) => unknown> };
  const require = (id: string) => {
    if (!(id in dependencies)) throw new Error(`Unexpected dependency: ${id}`);
    return dependencies[id];
  };
  new Function("require", "module", "exports", compiled)(require, loadedModule, loadedModule.exports);
  return loadedModule.exports;
}
const { POST } = loadTs(new URL("./route.ts", import.meta.url), {
  "@/auth": { auth: async () => session, KONTO_PROVIDER: "konto" },
  "@/lib/identity": { scopedClassIds: async () => scope },
  "@/lib/grandmaster": { isGrandmaster: () => grandmaster },
  "@domigo/db": {
    ClassSettingsForbiddenError, getDb: () => "synthetic-db", inScope: (s: string[], id: string) => s.includes(id),
  },
  "@/lib/leaderboard": {
    setClassLeaderboardSettings: async (...args: unknown[]) => { writes.push(args); if (writeError) throw writeError; },
  },
});
const middleware = loadTs(new URL("../../../../middleware.ts", import.meta.url), {
  "@/auth": { auth: (fn: unknown) => fn, KONTO_PROVIDER: "konto" },
  "@/lib/dev-durchlass": { devDurchlass: () => true },
  "next/server": { NextResponse: { json: Response.json, next: () => new Response(null, { status: 200 }), redirect: () => new Response(null, { status: 307 }) } },
});
const body = { classId: CLASS_ID, leaderboard: true, gradeBoardOptIn: true };
const request = (value: unknown = body, headers: Record<string, string> = {}) => new Request("https://fixture.invalid/api/admin/class-leaderboard", {
  method: "POST", headers: { origin: "https://fixture.invalid", "content-type": "application/json", ...headers }, body: JSON.stringify(value),
});
const post = (req = request()) => POST!(req as never) as Promise<Response>;
const outer = () => middleware.default!({ auth: session, method: "POST", nextUrl: new URL("https://fixture.invalid/api/admin/class-leaderboard") } as never) as Response;

beforeEach(() => {
  session = { user: { id: "synthetic-teacher", role: "teacher", via: "konto", goTeacher: true } };
  scope = [CLASS_ID]; grandmaster = false; writes = []; writeError = null;
});

describe("class-leaderboard route", () => {
  it("teacher writes only server-derived scope, actor and grandmaster status", async () => {
    const res = await post(request({ ...body, teacherId: "forged", grandmaster: true, classScope: [FOREIGN_ID] }));
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { ok: true });
    assert.equal(res.headers.get("Cache-Control"), "no-store");
    assert.deepEqual(writes, [["synthetic-db", [CLASS_ID], CLASS_ID, "synthetic-teacher", { leaderboard: true, gradeBoardOptIn: true }, false]]);
  });
  it("foreign scope is 403 before storage", async () => {
    assert.equal((await post(request({ ...body, classId: FOREIGN_ID }))).status, 403);
    assert.deepEqual(writes, []);
  });
  it("foreign owner within scope is 403 from the guarded database statement", async () => {
    writeError = new ClassSettingsForbiddenError();
    assert.equal((await post()).status, 403);
  });
  it("grandmaster status comes from the server and still respects scope", async () => {
    grandmaster = true;
    assert.equal((await post()).status, 200);
    assert.equal(writes[0]![5], true);
    assert.equal((await post(request({ ...body, classId: FOREIGN_ID }))).status, 403);
    assert.equal(writes.length, 1);
  });
  for (const identity of [null, { user: { id: "synthetic-child", role: "student" } }, { user: { id: "", role: "teacher" } }]) {
    it(`anonymous/child/blank identity ${JSON.stringify(identity)} is 401`, async () => {
      session = identity;
      assert.equal((await post()).status, 401);
      assert.equal(outer().status, 401);
      assert.deepEqual(writes, []);
    });
  }
  it("withdrawn teacher entitlement is 403 at both walls", async () => {
    session!.user.goTeacher = false;
    assert.equal((await post()).status, 403);
    assert.equal(outer().status, 403);
    assert.deepEqual(writes, []);
  });
  it("foreign or absent Origin is refused", async () => {
    assert.equal((await post(request(body, { origin: "https://foreign.invalid" }))).status, 403);
    const req = request(); req.headers.delete("origin");
    assert.equal((await post(req)).status, 403);
    assert.deepEqual(writes, []);
  });
  it("non-JSON and malformed JSON are refused", async () => {
    assert.equal((await post(request(body, { "content-type": "text/plain" }))).status, 400);
    assert.equal((await post(new Request("https://fixture.invalid/api/admin/class-leaderboard", { method: "POST", headers: { origin: "https://fixture.invalid", "content-type": "application/json" }, body: "{" }))).status, 400);
    assert.deepEqual(writes, []);
  });
  for (const value of [null, {}, { ...body, leaderboard: false, gradeBoardOptIn: true }, { ...body, leaderboard: "yes" }, { ...body, gradeBoardOptIn: "yes" }, { ...body, classId: "bad" }]) {
    it(`invalid payload ${JSON.stringify(value)} cannot write`, async () => {
      assert.equal((await post(request(value))).status, 400);
      assert.deepEqual(writes, []);
    });
  }
  it("write outage is 503 without exception details or fake success", async () => {
    writeError = new Error("synthetic private diagnostic");
    const res = await post();
    assert.equal(res.status, 503);
    assert.deepEqual(await res.json(), { ok: false, error: "unavailable" });
  });
  it("middleware matches the API explicitly and admits an entitled teacher", () => {
    assert.ok((middleware.config as unknown as { matcher: string[] }).matcher.includes("/api/admin/class-leaderboard"));
    assert.equal(outer().status, 200);
  });
});
