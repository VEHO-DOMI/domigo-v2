/** cgo-094: execute the actual route and middleware with synthetic session/storage. */
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
    setClassPurpose: async (...args: unknown[]) => { writes.push(args); if (writeError) throw writeError; },
  },
});
const middleware = loadTs(new URL("../../../../middleware.ts", import.meta.url), {
  "@/auth": { auth: (fn: unknown) => fn, KONTO_PROVIDER: "konto" },
  "@/lib/dev-durchlass": { devDurchlass: () => true },
  "next/server": { NextResponse: { json: Response.json, next: () => new Response(null, { status: 200 }), redirect: () => new Response(null, { status: 307 }) } },
});
const body = { classId: CLASS_ID, purpose: "test" };
const request = (value: unknown = body, headers: Record<string, string> = {}) => new Request("https://fixture.invalid/api/admin/class-settings", {
  method: "POST", headers: { origin: "https://fixture.invalid", "content-type": "application/json", ...headers }, body: JSON.stringify(value),
});
const post = (req = request()) => POST!(req as never) as Promise<Response>;
const outer = () => middleware.default!({ auth: session, method: "POST", nextUrl: new URL("https://fixture.invalid/api/admin/class-settings") } as never) as Response;

beforeEach(() => {
  session = { user: { id: "synthetic-teacher", role: "teacher", via: "konto", goTeacher: true } };
  scope = [CLASS_ID]; grandmaster = false; writes = []; writeError = null;
});

describe("class-settings route", () => {
  it("teacher writes only server-derived scope, actor and grandmaster status", async () => {
    const res = await post(request({ ...body, teacherId: "forged", grandmaster: true, classScope: [FOREIGN_ID] }));
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { ok: true });
    assert.equal(res.headers.get("Cache-Control"), "no-store");
    assert.deepEqual(writes, [["synthetic-db", [CLASS_ID], CLASS_ID, "synthetic-teacher", "test", false]]);
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
    assert.equal((await post(new Request("https://fixture.invalid/api/admin/class-settings", { method: "POST", headers: { origin: "https://fixture.invalid", "content-type": "application/json" }, body: "{" }))).status, 400);
    assert.deepEqual(writes, []);
  });
  for (const value of [null, {}, { ...body, purpose: "other" }, { ...body, classId: "bad" }]) {
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
    assert.ok((middleware.config as unknown as { matcher: string[] }).matcher.includes("/api/admin/class-settings"));
    assert.equal(outer().status, 200);
  });
});

// Source contracts supplement behaviour tests at the exact aggregation boundaries.
// Every new guard proves its red light with a changed in-memory source + MD5 pins.
import { createHash } from "node:crypto";
const root = new URL("../../../../../../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");
const strip = (src: string) => src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
const md5 = (src: string) => createHash("md5").update(src).digest("hex");
type Guard = { name: string; path: string; passes: (s: string) => boolean; break: (s: string) => string };
const guards: Guard[] = [
  { name: "class wall reads scoped purpose and labels only test classes in the heading", path: "apps/web/app/admin/classes/[id]/page.tsx",
    passes: s => s.includes('const purposes = await getClassPurposes(getDb(), teacher.classScope, [cls.id]);')
      && /<h1\b[\s\S]*?\{purposes\.get\(cls\.id\) === "test" && <span className="dg-chip">Testklasse<\/span>\}[\s\S]*?<\/h1>/.test(s),
    break: s => s.replace('{purposes.get(cls.id) === "test" && <span className="dg-chip">Testklasse</span>}', ''),
  },
  { name: "dashboard purpose read uses trusted scope", path: "apps/web/app/admin/page.tsx",
    passes: s => s.includes('getClassPurposes(getDb(), teacher.classScope, classes.value.map((cls) => cls.id))'),
    break: s => s.replace('getClassPurposes(getDb(), teacher.classScope,', 'getClassPurposes(getDb(), [],') },
  { name: "dashboard retains per-class counts, no cross-class sum", path: "apps/web/app/admin/KlassenKarten.tsx",
    passes: s => s.includes('purposes?.get(cls.id) === "test"') && s.includes('>Testklasse</span>') && !s.includes('.reduce('),
    break: s => s.replace('purposes?.get(cls.id) === "test"', 'false') },
  { name: "class list receives persisted purposes", path: "apps/web/app/admin/classes/page.tsx",
    passes: s => s.includes('getClassPurposes(getDb(), teacher.classScope, [...classes, ...archived]') && s.includes('initialPurposes={Object.fromEntries(purposes)}'),
    break: s => s.replace('initialPurposes={Object.fromEntries(purposes)}', 'initialPurposes={{}}') },
  { name: "class list labels test classes in both active and archived rows", path: "apps/web/app/admin/classes/ClassesManager.tsx",
    passes: s => ['initialClasses', 'initialArchived'].every(list => {
      const rows = s.split(`${list}.map((c) => (`)[1]?.split('{purposeControl(c.id)}')[0] ?? '';
      return rows.includes('{c.name} {purposes[c.id] === "test" && <span className="dg-chip">Testklasse</span>}');
    }),
    break: s => s.replaceAll('{purposes[c.id] === "test" && <span className="dg-chip">Testklasse</span>}', '') },
  { name: "failed purpose writes show Nicht gespeichert in the class status", path: "apps/web/app/admin/classes/ClassesManager.tsx",
    passes: s => {
      const toggle = s.split('const togglePurpose = async (id: string) => {')[1]?.split('const purposeControl')[0] ?? '';
      return /\} catch \{\s*setNotice\(\{ id, text: "Nicht gespeichert\. Bitte versuche es später erneut\." \}\);\s*\} finally/.test(toggle)
        && /\{notice\?\.id === id && <p role="status"[^>]*>\{notice\.text\}<\/p>\}/.test(s);
    },
    break: s => s.replace('text: "Nicht gespeichert. Bitte versuche es später erneut."', 'text: "Gespeichert."') },
  { name: "toggle confirms actual JSON save before updating", path: "apps/web/app/admin/classes/ClassesManager.tsx",
    passes: s => /if \(!response.ok \|\| response.redirected \|\| result\?\.ok !== true\) throw/.test(s) && s.indexOf('if (!response.ok') < s.indexOf('setOverrides((previous)'),
    break: s => s.replace('!response.ok || response.redirected || result?.ok !== true', '!response.ok') },
  { name: "toggle accessibility and exact explanation", path: "apps/web/app/admin/classes/ClassesManager.tsx",
    passes: s => s.includes('role="switch" aria-checked={purposes[id] === "test"}') && s.includes('Zählt nicht in Statistiken, Großmeister-Übersicht und Klassenaggregaten — für deinen eigenen Lehrertest'),
    break: s => s.replace('role="switch"', 'role="button"') },
  { name: "grandmaster partitions tests before returning regular rows", path: "packages/db/src/class-service.ts",
    passes: s => s.includes('const purposes = await getClassPurposes(db, classScope, [...v2, ...legacy]') && s.includes('v2 = v2.filter((c) => purposes.get(c.id) !== "test")') && s.includes('legacy = legacy.filter((c) => purposes.get(c.id) !== "test")') && s.includes('const testClasses = v2.filter((c) => purposes.get(c.id) === "test")'),
    break: s => s.replace('v2 = v2.filter((c) => purposes.get(c.id) !== "test");', '') },
  { name: "grandmaster sums only regular rows and lists tests separately", path: "apps/web/app/admin/grandmaster/page.tsx",
    passes: s => s.includes('const { v2, legacy, testClasses, v2Failed, legacyFailed }') && s.includes('const students = v2.reduce(') && s.includes('const claimed = v2.reduce(') && s.includes('Testklassen: {testClasses.length}') && !/testClasses\.reduce\(/.test(s),
    break: s => s.replace('const students = v2.reduce(', 'const students = [...v2, ...testClasses].reduce(') },
  { name: "public mastery cannot resolve to the unfiltered internal reader", path: "packages/db/src/index.ts",
    passes: s => s.includes('export { getUnitMastery } from "./class-progress.ts";'),
    break: s => s.replace('export { getUnitMastery } from "./class-progress.ts";', '') },
  { name: "cohort mastery SQL uses purpose filter after scope", path: "packages/db/src/class-progress.ts",
    passes: s => s.includes('const purposes = await getClassPurposes(db, classScope, classScope)') && s.includes('purpose === "regular"') && s.includes('and(inArray(practiceAttempts.classId, [...classScope]), inArray(practiceAttempts.classId, regularIds),'),
    break: s => s.replace('inArray(practiceAttempts.classId, regularIds),', '') },
  ...["listStudentProgress", "listStudentPathSummary", "listClassUnitProgress", "listClassTraps"].map(name => ({
    name: `${name} stays confined to one class (including tests)`, path: "packages/db/src/class-progress.ts",
    passes: (s: string) => {
      const block = s.split(`export async function ${name}(`)[1]?.split(/\nexport (?:async )?(?:function|interface)/)[0] ?? "";
      return /classId: string/.test(block) && /eq\((?:practiceAttempts|studyPathProgress)\.classId, classId\)/.test(block) && !/getClassPurposes|regularIds/.test(block);
    },
    break: (s: string) => s.replaceAll('eq(practiceAttempts.classId, classId)', 'sql`true`').replaceAll('eq(studyPathProgress.classId, classId)', 'sql`true`'),
  })),
  { name: "metadata reader stays per user instead of combining classes", path: "packages/db/src/class-progress.ts",
    passes: s => { const b = s.split('export async function listStudentMeta(')[1]?.split('export interface ClassUnitProgress')[0] ?? ''; return b.includes('inArray(v2IdentityUsers.classId, [...classScope])') && b.includes('out.set(r.userId,') && !/getClassPurposes|regularIds/.test(b); },
    break: s => s.replaceAll('out.set(r.userId,', 'out.set("all",') },
  { name: "missing settings returns scoped regular defaults", path: "packages/db/src/class-settings-service.ts",
    passes: s => s.includes('new Map<string, ClassPurpose>(ids.map((id) => [id, "regular"]))') && /\} catch \{\s*\}\s*return purposes;/.test(s),
    break: s => s.replace('} catch {', '} catch { throw new Error("missing");') },
  { name: "SQL migration only adds the separate settings table", path: "packages/db/drizzle/0021_class_settings.sql",
    passes: s => s.includes('CREATE TABLE IF NOT EXISTS "domigo_v2"."class_settings"') && s.includes("CHECK (\"purpose\" IN ('regular', 'test'))") && !/\b(?:ALTER|DROP|DELETE|UPDATE|INSERT)\b/i.test(s),
    break: s => s.replace("CHECK (\"purpose\" IN ('regular', 'test'))", 'CHECK (true)') },
  { name: "journal reserves 21 without colliding with 20", path: "packages/db/drizzle/meta/_journal.json",
    passes: s => { const j = JSON.parse(s).entries as {idx: number; tag: string; when: number}[]; return new Set(j.map(e => e.idx)).size === j.length && j.some(e => e.idx === 21 && e.tag === '0021_class_settings' && e.when > 1791399857865); },
    break: s => s.replace('"idx": 21', '"idx": 20') },
  { name: "middleware protects this exact API before the development bypass", path: "apps/web/middleware.ts",
    passes: s => s.includes('matcher: ["/api/admin/class-settings"') && s.indexOf('pathname === "/api/admin/class-settings"') < s.indexOf('if (devDurchlass('),
    break: s => s.replace('matcher: ["/api/admin/class-settings", ', 'matcher: [') },
];

describe("cgo-094 aggregation and deployment source contracts", () => {
  for (const guard of guards) {
    it(guard.name, () => assert.equal(guard.passes(strip(read(guard.path))), true));
    it(`tamper red: ${guard.name}`, () => {
      const source = strip(read(guard.path)); const before = md5(source);
      const mutant = guard.break(source);
      assert.notEqual(md5(mutant), before);
      assert.equal(guard.passes(mutant), false);
      assert.equal(md5(strip(read(guard.path))), before);
      console.log(`TAMPER ${guard.name} md5-before=${before} mutant=${md5(mutant)} after=${md5(source)} RED`);
    });
  }
  it("Neon sheet includes the migration verbatim; snapshot describes only the new table delta", () => {
    assert.ok(read('docs/CGO-094_NEON_BLATT_0021.md').includes(read('packages/db/drizzle/0021_class_settings.sql')));
    const before = JSON.parse(read('packages/db/drizzle/meta/0019_snapshot.json'));
    const after = JSON.parse(read('packages/db/drizzle/meta/0021_snapshot.json'));
    assert.equal(after.prevId, before.id);
    const settings = after.tables['domigo_v2.class_settings'];
    assert.deepEqual(Object.keys(settings.columns), ['class_id', 'purpose', 'updated_at']);
    assert.equal(settings.columns.class_id.primaryKey, true);
    assert.equal(settings.columns.purpose.default, "'regular'");
    assert.ok(settings.checkConstraints.class_settings_purpose_check.value.includes("'test'"));
    delete after.tables['domigo_v2.class_settings'];
    assert.deepEqual(after.tables, before.tables);
  });
});
