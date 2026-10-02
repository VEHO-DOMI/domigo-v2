// Only external boundaries are replaced. Tests import the real school access,
// identity, grade scope, content projection, attempt service and POST route.
import { registerHooks } from "node:module";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const dbURL = import.meta.resolve("@domigo/db");
const loaderURL = import.meta.resolve("@domigo/content-loader");
const root = fileURLToPath(new URL("../../../../", import.meta.url));
/** @type {{session: {user: {id: string, classId: string|null, role: string, scope: string[], name?: string}}|null,
 * grade: number|null, gradeError: Error|null, released: boolean, writeError: Error|null, forcePreviewSave: boolean, storageCalls: number,
 * solved: Set<string>, writes: Array<{scope: readonly string[], data: Record<string, any>}>, reads: string[],
 * classRows: Array<{id: string, name: string, grade: number}>, recordReturn: any}} */
export const fixture = {
  session: null, grade: 2, gradeError: null, released: true, writeError: null, forcePreviewSave: false, storageCalls: 0,
  solved: new Set(), writes: [], reads: [], classRows: [], recordReturn: undefined,
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
  fixture.classRows = [];
  fixture.recordReturn = undefined;
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
    export * from ${JSON.stringify(loaderURL)};
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
    // cgo-047: the game-save PUT wall (lib/game-save-route.test.ts).
    export const upsertGameSave = async (_db, scope, data) => {
      f.storageCalls++;
      if (!scope.includes(data.classId)) throw new Error("class scope denied");
      f.writes.push({ scope, data });
      return { clientRev: data.clientRev, state: data.state };
    };
    export const recordAttempt = async (_db, scope, data) => {
      f.storageCalls++;
      if (!scope.includes(data.classId)) throw new Error("class scope denied");
      if (f.writeError) throw f.writeError;
      f.writes.push({ scope, data });
      if (data.tier === "correct") f.solved.add(data.itemId);
      return f.recordReturn;
    };
    // cgo-047 Welle 2: the class picker and the assignment doors. Both lists
    // return EVERY row they are given, scope or not — exactly the v1 leak the
    // class wall (lib/class-wall.ts) has to close.
    export const listClasses = async () => f.classRows.map((r) => ({ ...r }));
    export const listClassesInScope = async () => f.classRows.map((r) => ({ ...r }));
    export const listReservedForClass = async () => new Set();
    export const createAssignment = async (_db, scope, draft) => {
      f.storageCalls++;
      if (!scope.includes(draft.classId)) throw new Error("class scope denied");
      f.writes.push({ scope, data: { assignmentFor: draft.classId } });
      return "assignment-1";
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
