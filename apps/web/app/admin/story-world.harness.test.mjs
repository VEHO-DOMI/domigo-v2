// Test-only boundaries for the real pages, runtime reader and POST route.
// Every identity and row here is synthetic; no database URL is read.
import { registerHooks } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import { transpileModule, ModuleKind, JsxEmit } from "typescript";
/** @type {{session: {user: {id:string,role:string,classId:string|null,scope:string[],name:string}}|null,grade:number|null,settings:Map<number,boolean>,readFailure:boolean,writeFailure:boolean,storageCalls:number,masteryGrades:number[]}} */
export const fixture = {
    session: null,
    grade: 1,
    settings: new Map(),
    readFailure: false,
    writeFailure: false,
    storageCalls: 0,
    masteryGrades: [],
};
export const teacher = { user: { id: "fixture-teacher", role: "teacher", classId: null, scope: ["fixture-class"], name: "TEST" } };
export const child = { user: { id: "fixture-child", role: "student", classId: "fixture-class", scope: ["fixture-class"], name: "TEST" } };
export function reset() {
    fixture.session = teacher;
    fixture.grade = 1;
    fixture.settings.clear();
    fixture.readFailure = false;
    fixture.writeFailure = false;
    fixture.storageCalls = 0;
    fixture.masteryGrades = [];
    process.env.VERCEL_ENV = "production";
    delete process.env.DEV_TEACHER_ID;
    delete process.env.DEV_USER_ID;
    delete process.env.DEV_CLASS_ID;
    delete process.env.GRANDMASTER_TEACHER_IDS;
}
const shared = globalThis;
shared.__storyWorldFixture = fixture;
const state = "const f = globalThis.__storyWorldFixture;";
const dbURL = import.meta.resolve("@domigo/db");
const reactURL = import.meta.resolve("react");
const empty = "export default function FixtureComponent() { return null; }";
const modules = new Map([
    ["server-only", "export {};"],
    ["@/auth", `${state} export const auth = async () => f.session;`],
    ["next/navigation", `export const redirect = (href) => { throw new Error('REDIRECT:' + href); };
    export const notFound = () => { throw new Error('NOT_FOUND'); };
    export const useRouter = () => ({ refresh() {} });`],
    ["next/link", `import { createElement } from ${JSON.stringify(reactURL)};
    export default function Link({children, ...props}) { return createElement('a', props, children); }`],
    ["@domigo/db", `${state}
    export * from ${JSON.stringify(dbURL)};
    import { StoryWorldForbiddenError } from ${JSON.stringify(dbURL)};
    export const getDb = () => ({});
    export const getClassGrade = async () => f.grade;
    export const getDueCounts = async () => ({total: 0});
    export const getUserProgress = async () => null;
    export const getUnitMastery = async (_db, scope, grade) => {
      f.masteryGrades.push(grade);
      if (!scope.includes('fixture-class')) throw new Error('scope');
      return [{unitSlug:'fixture-unit', attempts:1, itemsSolved:1, correctRate:1}];
    };
    export const listStoryWorldGrades = async (_db, scope) => scope.includes('fixture-class') ? [1, 2] : [];
    export const listStoryWorldSettings = async () => {
      if (f.readFailure) throw new Error('synthetic read failure');
      return [...f.settings].map(([grade,isOpen]) => ({grade,isOpen}));
    };
    export const setStoryWorld = async (_db, scope, role, grade, isOpen) => {
      f.storageCalls++;
      if (role !== 'teacher' || !scope.includes('fixture-class') || ![1,2].includes(grade)) throw new StoryWorldForbiddenError();
      if (f.writeFailure) throw new Error('synthetic write failure');
      f.settings.set(grade, isOpen);
    };`],
    ["@domigo/game-detective", "export const EVIDENCE = {}; export const EvidenceGallery = () => null;"],
    ["@domigo/game-novel", "export const SeasonBoard = () => null;"],
    ["@domigo/game-trip", "export const JournalBoard = () => null; export const tripCopyFor = () => null;"],
    ["@domigo/game-2d/board", "export const ZoneBoard = () => null;"],
    ["@/lib/content-service", "export const loadUnitWithOverrides = async () => null;"],
    ["@/app/PreviewBanner", empty],
    ["./BuchClient", empty],
    ["./ProfileCard", empty],
    ["./RegelbuchBoard", empty],
    ["../GameClient", empty],
    ["../DetectiveClient", empty],
    ["../NovelClient", empty],
    ["../TripClient", empty],
    ["../le/konto-aktion", "export const abmelden = async () => {};"],
]);
const web = new URL("../../", import.meta.url);
registerHooks({
    resolve(specifier, context, nextResolve) {
        if (modules.has(specifier))
            return { url: `data:text/javascript,${encodeURIComponent(modules.get(specifier))}`, shortCircuit: true };
        if (specifier.startsWith("@/")) {
            const base = new URL(specifier.slice(2), web);
            for (const ext of ["", ".ts", ".tsx"])
                if (existsSync(new URL(`${base.href}${ext}`)))
                    return nextResolve(`${base.href}${ext}`, context);
        }
        if (specifier.startsWith(".") && context.parentURL?.startsWith("file:")) {
            const base = new URL(specifier, context.parentURL);
            for (const ext of [".ts", ".tsx"])
                if (existsSync(new URL(`${base.href}${ext}`)))
                    return nextResolve(`${base.href}${ext}`, context);
        }
        return nextResolve(specifier, context);
    },
    load(url, context, nextLoad) {
        if (url.startsWith("file:") && url.endsWith(".tsx")) {
            const source = transpileModule(readFileSync(new URL(url), "utf8"), {
                compilerOptions: { module: ModuleKind.ESNext, jsx: JsxEmit.ReactJSX }, fileName: url,
            }).outputText;
            return { format: "module", source, shortCircuit: true };
        }
        return nextLoad(url, context);
    },
});
