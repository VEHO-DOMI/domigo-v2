// Only external boundaries are replaced. Tests import the real school access,
// identity, grade scope, content projection, attempt service and POST route.
import { registerHooks } from "node:module";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const dbURL = import.meta.resolve("@domigo/db");
const root = fileURLToPath(new URL("../../../../", import.meta.url));
/** @type {{session: {user: {id: string, classId: string|null, role: string, scope: string[], name?: string}}|null,
 * grade: number|null, gradeError: Error|null, released: boolean, writeError: Error|null, forcePreviewSave: boolean, storageCalls: number,
 * solved: Set<string>, writes: Array<{scope: readonly string[], data: Record<string, any>}>, reads: string[]}} */
export const fixture = {
  session: null, grade: 2, gradeError: null, released: true, writeError: null, forcePreviewSave: false, storageCalls: 0,
  solved: new Set(), writes: [], reads: [],
};
export function resetSchoolFixture() {
  fixture.session = null;
  fixture.grade = 2;
  fixture.gradeError = null;
  fixture.released = true;
  fixture.writeError = null;
  fixture.forcePreviewSave = false;
  fixture.storageCalls = 0;
  fixture.solved.clear();
  fixture.writes.length = 0;
  fixture.reads.length = 0;
  process.env.VERCEL_ENV = "production";
}

// Node isolates each test file in its own process. The key never exists in the
// application: this helper is imported only by the school tests.
const key = "__schoolTestBoundary";
globalThis[key] = fixture;
const state = `const f = globalThis[${JSON.stringify(key)}];`;
const modules = new Map([
  ["server-only", "export {};"],
  ["@/auth", `${state} export const auth = async () => f.session;`],
  // A fault-injection switch exercises the route's own preview write guard,
  // independently of the attempt service's usual refusal to call save.
  ["@/lib/school-attempt", `${state}
    import { schoolAttempt as realAttempt } from ${JSON.stringify(new URL("../../lib/school-attempt.ts", import.meta.url).href)};
    import { gradeSchoolCard } from ${JSON.stringify(new URL("../../lib/school-contract.ts", import.meta.url).href)};
    export async function schoolAttempt(battery, body, preview, ledger) {
      if (preview && f.forcePreviewSave) {
        const card = battery.cards.find(c => c.station === body.station);
        await ledger.save(card, gradeSchoolCard(card, body.value));
      }
      return realAttempt(battery, body, preview, ledger);
    }
  `],
  ["@domigo/content-loader", `${state}
    export const REPO_ROOT = ${JSON.stringify(root)};
    export const loadReleasedChapters = () => f.released ? ["g2.st.ink-ghost-goes-to-school.ch01"] : [];
  `],
  ["@domigo/db", `${state}
    export * from ${JSON.stringify(dbURL)};
    export const getDb = () => ({});
    export const getClassGrade = async () => {
      if (f.gradeError) throw f.gradeError;
      return f.grade;
    };
    export const getSolvedGameItemIds = async (_db, userId) => {
      f.reads.push(userId); return new Set(f.solved);
    };
    export const recordAttempt = async (_db, scope, data) => {
      f.storageCalls++;
      if (!scope.includes(data.classId)) throw new Error("class scope denied");
      if (f.writeError) throw f.writeError;
      f.writes.push({ scope, data });
      if (data.tier === "correct") f.solved.add(data.itemId);
    };
  `],
]);
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (modules.has(specifier)) {
      return { url: `data:text/javascript,${encodeURIComponent(modules.get(specifier))}`, shortCircuit: true };
    }
    if (specifier === "next/server") return nextResolve("next/server.js", context);
    if (specifier.startsWith(".") && context.parentURL?.startsWith("file:")) {
      const url = new URL(`${specifier}.ts`, context.parentURL);
      if (existsSync(url)) return nextResolve(url.href, context);
    }
    return nextResolve(specifier, context);
  },
});
