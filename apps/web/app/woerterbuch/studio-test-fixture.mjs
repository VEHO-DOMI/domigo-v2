// Test-only boundaries. The real content-service, overlay rules and corpus loader
// stay in the call chain; database reads are synthetic and no DB module is loaded.
import { registerHooks } from "node:module";

const loaderURL = import.meta.resolve("@domigo/content-loader");

/** @type {{approved: string[] | null,
 * units: Map<string, import('@domigo/content-loader').UnitContent>,
 * prose: Map<string, Array<{itemId: string, kind: string, patch: unknown}>>,
 * drafts: Map<string, Array<{itemId: string, kind: string, action: string, item: unknown}>>,
 * fail: string, reads: string[], unitsRead: string[]}} */
export const studioFixture = { approved: null, units: new Map(), prose: new Map(), drafts: new Map(), fail: "", reads: [], unitsRead: [] };

export function resetStudioFixture() {
  studioFixture.approved = null;
  studioFixture.units.clear();
  studioFixture.prose.clear();
  studioFixture.drafts.clear();
  studioFixture.fail = "";
  studioFixture.reads.length = 0;
  studioFixture.unitsRead.length = 0;
}

globalThis.__dictionaryStudioFixture = studioFixture;
const state = "const f = globalThis.__dictionaryStudioFixture;";
const modules = new Map([
  ["server-only", "export {};"],
  ["@domigo/db", `${state}
    export const getDb = () => ({});
    export const loadPublishedOverrides = async (_db, slug) => {
      f.reads.push('prose:' + slug);
      if (f.fail === 'prose') throw new Error('synthetic correction read failure');
      return f.prose.get(slug) ?? [];
    };
    export const loadPublishedDrafts = async (_db, slug) => {
      f.reads.push('drafts:' + slug);
      if (f.fail === 'drafts') throw new Error('synthetic draft read failure');
      return f.drafts.get(slug) ?? [];
    };
  `],
  ["@domigo/content-loader", `${state}
    export * from ${JSON.stringify(loaderURL)};
    import { loadUnit as realLoadUnit, listApprovedUnits as realApproved } from ${JSON.stringify(loaderURL)};
    export const listApprovedUnits = () => f.approved ?? realApproved();
    export const loadUnit = (slug) => {
      f.unitsRead.push(slug);
      return f.units.get(slug) ?? realLoadUnit(slug);
    };
  `],
]);

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (modules.has(specifier)) return { url: `data:text/javascript,${encodeURIComponent(modules.get(specifier))}`, shortCircuit: true };
    return nextResolve(specifier, context);
  },
});
