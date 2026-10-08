// cgo-047 · THE PREVIEW WRITES NOTHING — the source contract of every student
// surface a teacher can open (lib/student-view.ts, lib/preview-attempt.ts).
//
// The server half is behavioural (lib/game-save-route.test.ts; /api/attempts
// answers only a child). This half pins the page wiring and the client
// guards, which have no DOM test runner in this repo: every attempt goes through
// attemptSender(preview), the outbox is never flushed in a preview, no save is
// read from or written to the device or the server, and the server decides
// `preview` — a child can never be handed it.
import assert from "node:assert/strict";
import fs from "node:fs";
import { describe, it } from "node:test";
import { createSourceFile, forEachChild, isJsxSelfClosingElement, ScriptKind, ScriptTarget, type Node } from "typescript";

const read = (rel: string) => fs.readFileSync(new URL(`../app/${rel}`, import.meta.url), "utf8");
/** The source without comments — a header may NAME what the code must not call. */
const code = (src: string) => src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
const PLAY = "(game)/play/[grade]";

const STORY_CLIENTS = [
  { file: `${PLAY}/GameClient.tsx`, save: "GameSaveState" },
  { file: `${PLAY}/DetectiveClient.tsx`, save: "DetectiveSave" },
  { file: `${PLAY}/NovelClient.tsx`, save: "NovelSave" },
  { file: `${PLAY}/TripClient.tsx`, save: "TripSave" },
];
const PREVIEW_PAGES = ["learn/page.tsx", "learn/[slug]/page.tsx", "learn/[slug]/[node]/page.tsx", "listening/page.tsx", "listening/[slug]/page.tsx", "tests/page.tsx", "tests/[slug]/page.tsx", "review/page.tsx", "review/session/page.tsx", "assignments/page.tsx", "assignments/[id]/page.tsx"];
const MODALITY_CLIENTS = ["learn/[slug]/[node]/PathPracticeNode.tsx", "review/session/ReviewSession.tsx", "tests/[slug]/TestSession.tsx", "listening/[slug]/ListeningSession.tsx"];
const ALL_CLIENTS = [...STORY_CLIENTS.map((c) => c.file), "practice/[slug]/PracticeSession.tsx", ...MODALITY_CLIENTS];

describe("client guards — nothing leaves a preview", () => {
  for (const file of ALL_CLIENTS) {
    it(`${file}: attempts and the outbox`, () => {
      const src = read(file);
      assert.doesNotMatch(src, /\bsendAttempt\b/, "attempts go through attemptSender(preview), never sendAttempt directly");
      assert.match(src, /useOutboxFlush\(!preview, (?:props\.)?ownerId\)/, "the outbox is not flushed in a preview");
      for (const m of src.matchAll(/[^\n]*\bflushOutbox\([^)]*\)[^\n]*/g)) {
        assert.match(m[0], /if \(!preview\) void flushOutbox\(props\.ownerId\)/, `unguarded flush: ${m[0].trim()}`);
      }
      for (const m of src.matchAll(/[^\n]*\battemptSender\(([^)]*)\)/g)) assert.match(m[1]!, /^preview, (?:props\.)?ownerId$/);
    });
  }
  for (const { file, save } of STORY_CLIENTS) {
    it(`${file}: no save read or written`, () => {
      const src = read(file);
      assert.match(src, /const preview = props\.preview === true;/);
      assert.match(src, /\{\n\s*if \(preview\) return null;[^\n]*\n\s*if \(typeof window === "undefined"\) return serverSave;/, "the device save is not read");
      assert.match(src, new RegExp(`const onSave = \\(state: ${save}\\) => \\{\\n\\s*if \\(preview\\) return;`), "nothing is saved");
    });
  }
  it("explorer names both teacher doors that retain device progress", () => {
    assert.match(read("admin/explorer/page.tsx"), /Die Lehrer-Türen \(gemaltes Buch Klasse 1, Schulhaus Klasse 2\) merken sich deinen Stand auf diesem Gerät\./);
  });
  it("the year-1 overworld is parked and a child never lands on an empty hub (Koki 02.10.)", () => {
    const release = JSON.parse(fs.readFileSync(new URL("../../../content/corpus/stories/g1.st.lost-pages/release.json", import.meta.url), "utf8"));
    assert.deepEqual(release.releasedChapters, [], "Die verlorenen Seiten stays parked: the painted book is the year-1 game");
    const hub = code(read(`${PLAY}/page.tsx`));
    assert.match(hub, /if \(student && storyId === null\) redirect\("\/play"\);/);
    assert.match(hub, /const paintStory = grade === 1 \? loadStory\(PAINT_STORY\) : null;/);
    assert.match(read("admin/explorer/page.tsx"), /Gemaltes Buch — das Spiel für Klasse 1/);
  });
  // cgo-086 (Koki 07.10.): the Keen routes are deleted, not only unlinked — and
  // the teacher dashboard, which still carried the story-mode card and the boss
  // doors until then, is held to the same rule as the explorer and the hub.
  it("no navigation entry leads to the sunset Keen story mode (Koki 02.10., admin since cgo-086)", () => {
    for (const file of ["admin/explorer/page.tsx", `${PLAY}/page.tsx`, "admin/page.tsx"]) {
      assert.doesNotMatch(code(read(file)), /\/play\/[^"'`\s]*\/(?:world|run)\b|Keen|keen-content|keen-art/, `${file} still offers Keen`);
    }
    // The entry files, not the folders: a stray .DS_Store must not turn this red.
    for (const gone of [`${PLAY}/world/page.tsx`, `${PLAY}/run/page.tsx`, "api/funken/route.ts"]) {
      assert.equal(fs.existsSync(new URL(`../app/${gone}`, import.meta.url)), false, `${gone} is sunset and stays deleted`);
    }
  });
  it("no page or component anywhere links the deleted Keen routes (cgo-086)", () => {
    const hits: string[] = [];
    const walk = (dir: URL): void => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        if (e.isDirectory()) walk(new URL(`${e.name}/`, dir));
        else if (/\.tsx?$/.test(e.name) && !/\.test\.tsx?$/.test(e.name)) {
          const src = code(fs.readFileSync(new URL(e.name, dir), "utf8"));
          if (/\/play\/[^"'`\s]*\/(?:world|run)\b/.test(src)) hits.push(new URL(e.name, dir).pathname);
        }
      }
    };
    for (const root of ["../app/", "../components/"]) {
      const u = new URL(root, import.meta.url);
      if (fs.existsSync(u)) walk(u);
    }
    assert.deepEqual(hits, [], "a link to /play/<n>/world or /run is back");
  });
  it("@domigo/game-2d exports no Keen module and every export exists (cgo-086)", () => {
    const pkgUrl = new URL("../../../packages/game-2d/package.json", import.meta.url);
    const exportsMap = JSON.parse(fs.readFileSync(pkgUrl, "utf8")).exports as Record<string, string>;
    for (const [key, target] of Object.entries(exportsMap)) {
      assert.doesNotMatch(key, /arcade|boss|cutscene|fullscreen|map|levels/i, `${key} is a Keen export`);
      assert.ok(fs.existsSync(new URL(target, pkgUrl)), `${key} points at a missing file ${target}`);
    }
  });
});

describe("server pages — who is a preview is decided on the server", () => {
  const zone = read(`${PLAY}/[zone]/page.tsx`);
  it("the zone page resolves the viewer through student-view and walls the child's year", () => {
    assert.match(zone, /const view = await resolveStudentView\(\);/);
    assert.doesNotMatch(code(zone), /getActingUserForPage|getPlayerForPage/);
    assert.match(zone, /const away = yearRedirect\(view, grade\);\n\s*if \(away\) redirect\(away\);/);
    assert.match(zone, /const preview = isPreview\(view\);/);
    assert.match(zone, /const acting = view\.kind === "student" \? view\.player : null;/);
  });
  it("every game client gets the server's preview flag", () => {
    const clients = [...zone.matchAll(/<(GameClient|DetectiveClient|NovelClient|TripClient)\n\s*([^\n]*)/g)];
    assert.equal(clients.length, 4);
    for (const c of clients) assert.equal(c[2], "preview={preview}", `${c[1]} without preview`);
  });
  it("the preview reads no save, review queue or solved ledger", () => {
    for (const call of ["getGameSave", "getDueRefs", "getDueStoryRefs", "getSolvedGameItemIds"]) {
      for (const m of zone.matchAll(new RegExp(`[^\\n]*\\b${call}\\(`, "g"))) {
        assert.match(m[0], /acting \? await /, `${call} without the child guard: ${m[0].trim()}`);
      }
    }
  });
  for (const file of ["(game)/play/page.tsx", "practice/page.tsx", "practice/[slug]/page.tsx"]) {
    it(`${file} resolves the viewer through student-view`, () => {
      const src = code(read(file));
      assert.match(src, /resolveStudentView\(/);
      assert.doesNotMatch(src, /resolveVisibleGrades|getActingUserForPage|getPlayerForPage/);
    });
  }
  it("the year hub walls a child by the same rule as the zone page", () => {
    const hub = code(read(`${PLAY}/page.tsx`));
    assert.doesNotMatch(hub, /resolveVisibleGrades/);
    assert.match(hub, /const away = yearRedirect\(await resolveStudentView\(\), grade\);\n\s*if \(away\) redirect\(away\);/);
  });
  it("practice hands the client the server's preview flag", () => {
    assert.match(read("practice/[slug]/page.tsx"), /<PracticeSession [^\n]*preview=\{preview\} \/>/);
  });
  it("the painted book keeps its teacher-only production gate", () => {
    assert.match(read(`${PLAY}/buch/[chapter]/page.tsx`), /process\.env\.VERCEL_ENV === "production" && teacher === null/);
  });
});

describe("server write walls — a teacher session records nothing", () => {
  for (const file of ["api/attempts/route.ts", "api/study-path/route.ts", "api/writing-submission/route.ts", "api/assignments/attempt/route.ts", "api/assignments/submit/route.ts"]) {
    it(`${file} answers only a child`, () => {
      const src = read(file);
      assert.match(src, /const acting = await getActingUser\(req\);\n\s*if \(!acting\) return NextResponse\.json\(\{ ok: false, error: "no_identity" \}, \{ status: 401 \}\);/);
      assert.doesNotMatch(src, /getActingPlayer|getTeacher/);
    });
  }
});

// cgo-062: a refreshed server page must reset local answer state when its child changes.
describe("answer owners travel from the trusted page into every client", () => {
  const pages = [
    { file: `${PLAY}/[zone]/page.tsx`, clients: ["GameClient", "DetectiveClient", "NovelClient", "TripClient"], owner: "acting?.userId ?? null", key: 'acting?.userId ?? "preview"' },
    { file: "practice/[slug]/page.tsx", clients: ["PracticeSession"], owner: "acting?.userId ?? null", key: 'acting?.userId ?? "preview"' },
    { file: "learn/[slug]/[node]/page.tsx", clients: ["PathPracticeNode", "PathPracticeNode"], owner: "acting?.userId ?? null", key: 'acting?.userId ?? "preview"' },
    { file: "review/session/page.tsx", clients: ["ReviewSession"], owner: "acting?.userId ?? null", key: 'acting?.userId ?? "preview"' },
    { file: "tests/[slug]/page.tsx", clients: ["TestSession"], owner: "acting?.userId ?? null", key: 'acting?.userId ?? "preview"' },
    { file: "listening/[slug]/page.tsx", clients: ["ListeningSession"], owner: "acting?.userId ?? null", key: 'acting?.userId ?? "preview"' },
  ];
  for (const p of pages) {
    it(p.file, () => {
      const source = createSourceFile(p.file, read(p.file), ScriptTarget.Latest, true, ScriptKind.TSX);
      const tags: string[] = [];
      const visit = (node: Node): void => {
        if (isJsxSelfClosingElement(node) && p.clients.includes(node.tagName.getText(source))) tags.push(node.getText(source));
        forEachChild(node, visit);
      };
      visit(source);
      assert.equal(tags.length, p.clients.length, "every call, including both journey paths, is checked");
      for (const tag of tags) {
        assert.ok(tag.includes(`ownerId={${p.owner}}`), `${p.file} must receive the trusted child`);
        assert.ok(tag.includes(`key={${p.key}}`), `${p.file} must reset drafts on account change`);
      }
    });
  }
  for (const file of ["learn/[slug]/[node]/PathPracticeNode.tsx", "review/session/ReviewSession.tsx", "tests/[slug]/TestSession.tsx", "listening/[slug]/ListeningSession.tsx"]) {
    it(`${file}: both immediate sends and background retries carry the same owner`, () => {
      const src = code(read(file));
      assert.match(src, /useOutboxFlush\(!preview, ownerId\)/);
      assert.match(src, /attemptSender\(preview, ownerId\)\(/);
    });
  }
});


describe("cgo-092 every modality uses the shared viewer", () => {
  for (const file of PREVIEW_PAGES) it(file, () => {
    const src = code(read(file));
    assert.match(src, /await resolveStudentView\([^)]*jahrgang/);
    assert.doesNotMatch(src, /resolveVisibleGrades|getActingUserForPage|\.role\s*===?/);
    assert.match(src, /PreviewBanner/);
    const tree = createSourceFile(file, src, ScriptTarget.Latest, true, ScriptKind.TSX);
    const visit = (node: Node): void => {
      if (isJsxSelfClosingElement(node) && /^(PathPracticeNode|TeachingNode|ListeningSession|TestSession|ReviewSession|AssignmentRunner|CheckupRunner)$/.test(node.tagName.getText(tree))) {
        assert.match(node.getText(tree), /preview=\{preview\}/);
      }
      forEachChild(node, visit);
    };
    visit(tree);
  });
  it("all child-specific learn and review reads require an actual child", () => {
    for (const file of PREVIEW_PAGES.filter((p) => /^(learn|review)\//.test(p))) {
      const src = code(read(file));
      for (const call of ["getPathSummary", "getUnitPathProgress", "getJourneyAttempts", "getDueRefs", "getDueCounts", "getDueStoryRefs", "getDueStoryCount", "listReservedForClass"]) {
        for (const hit of src.matchAll(new RegExp(`[^\\n]*\\b${call}\\(`, "g"))) assert.match(hit[0], /acting \? await /, `${file}: ${call} lacks child guard`);
      }
    }
  });
  it("legacy practice completion never sends study-path in preview", () => {
    assert.match(code(read("learn/[slug]/[node]/PathPracticeNode.tsx")), /if \(preview \|\| isJourney\) return;[\s\S]*?fetch\("\/api\/study-path"/);
    assert.match(code(read("learn/[slug]/[node]/TeachingNode.tsx")), /if \(preview\) \{[^\n]*return; \}[\s\S]*?fetch\("\/api\/study-path"/);
  });
  it("writing and both assignment writes return locally in preview", () => {
    assert.match(code(read("tests/[slug]/TestSession.tsx")), /if \(preview\) return;[\s\S]*?fetch\("\/api\/writing-submission"/);
    for (const file of ["assignments/[id]/AssignmentRunner.tsx", "assignments/[id]/CheckupRunner.tsx"]) {
      const src = code(read(file));
      assert.equal((src.match(/if \(preview\)/g) ?? []).length, 2);
      assert.match(src, /Vorschau — nichts gespeichert/);
    }
  });
  it("assignment preview never opens a sitting or reads a child's view", () => {
    const src = code(read("assignments/[id]/page.tsx"));
    assert.match(src, /studentView\.kind === "preview"\s*\? await getPreviewAssignment[\s\S]*?: await getStudentAssignmentView/);
    assert.match(src, /if \(preview \|\| current\?\.kind !== "student"\) redirect\([^;]+;[\s\S]*?startOrResumeSession\(/);
    assert.match(src, /if \(preview \|\| live\)/);
    assert.equal((src.match(/startOrResumeSession\(/g) ?? []).length, 1, "only the guarded begin action may create a session");
    assert.match(read("assignments/preview.ts"), /sessions: \[\]/);
    assert.doesNotMatch(code(read("assignments/preview.ts")), /getStudentAssignmentView|startOrResumeSession|getSessionAttempts/);
  });
  it("preview unlocks both learn maps and bypasses both server locks", () => {
    const map = code(read("learn/[slug]/page.tsx"));
    assert.equal((map.match(/preview \? \{ \.\.\.node, status: "available"/g) ?? []).length, 2);
    const runner = code(read("learn/[slug]/[node]/page.tsx"));
    assert.equal((runner.match(/if \(!preview && (?:jview|nodeView)\?\.status === "locked"\)/g) ?? []).length, 2);
    assert.match(runner, /!preview && !isSlugAllowed\(slug, view\.grades\)/);
  });
  it("explorer uses live corpus counts and own-class assignment definitions", () => {
    const src = code(read("admin/explorer/page.tsx"));
    for (const name of ["listApprovedUnits", "listListeningUnits", "listTestUnits", "listPreviewAssignments"]) assert.match(src, new RegExp(`${name}\\(`));
    for (const route of ["learn", "listening", "tests", "review"]) assert.ok(src.includes(`/${route}?jahrgang=`));
    assert.doesNotMatch(src, /Noch nicht in der Schüleransicht/);
    assert.match(src, /Chapter-Übungen ansehen und zuweisen/);
  });
  it("assignment list preview calls the teacher definitions helper, never the child list", () => {
    const src = code(read("assignments/page.tsx"));
    assert.match(src, /const rows = view\.kind === "preview"\s*\? await listPreviewAssignments\(view\.teacher, view\.grades\)\s*: await listAssignmentsForStudent\(/);
  });
});

// G-2: the painted book has a deliberate extra outbox wall for the card bench.
const BOOK = `${PLAY}/buch/[chapter]`;
const bookClient = code(read(`${BOOK}/BuchClient.tsx`));
const bookPage = code(read(`${BOOK}/page.tsx`));
const bookLaws = [
  ["client: no direct sendAttempt", bookClient, (s: string) => !/\bsendAttempt\b/.test(s),
    (s: string) => s + "\nsendAttempt(body, ownerId);"],
  ["client: neither preview nor bench flushes", bookClient,
    (s: string) => /useOutboxFlush\(!preview && cardBench === undefined, ownerId\)/.test(s)
      && (s.match(/useOutboxFlush\(/g) ?? []).length === 1 && !/\bflushOutbox\(/.test(s),
    (s: string) => s.replace("!preview && cardBench === undefined", "true")],
  ["client: sender uses server preview and owner", bookClient,
    (s: string) => /const send = useMemo\(\(\) => attemptSender\(preview, ownerId\)/.test(s)
      && (s.match(/attemptSender\(/g) ?? []).length === 1,
    (s: string) => s.replace("attemptSender(preview, ownerId)", "attemptSender(false, ownerId)")],
  ["client: exactly one onAttempt uses that sender", bookClient,
    (s: string) => (s.match(/onAttempt=\{send\}/g) ?? []).length === 1
      && (s.match(/onAttempt=/g) ?? []).length === 1,
    (s: string) => s.replace("onAttempt={send}", "onAttempt={body => sendAttempt(body, ownerId)}")],
  ["page: only teacher without student is preview", bookPage,
    (s: string) => /const preview = student === null && teacher !== null;/.test(s)
      && (s.match(/preview=/g) ?? []).length === 1 && /preview=\{preview\}/.test(s),
    (s: string) => s.replace("student === null && teacher !== null", "false")],
] as const;

describe("painted book preview wiring and tamper proofs", () => {
  for (const [law, src, passes, mutate] of bookLaws) {
    it(`${BOOK}: ${law}`, () => assert.equal(passes(src), true));
    it(`${BOOK}: tamper is red: ${law}`, () => {
      const broken = mutate(src);
      assert.notEqual(broken, src);
      assert.equal(passes(broken), false);
    });
  }
  it("the bench condition, duplicate sender and server-to-client flag cannot disappear", () => {
    for (const [index, before, after] of [
      [1, "!preview && cardBench === undefined", "!preview"],
      [3, "onAttempt={send}", "onAttempt={send} onAttempt={send}"],
      [4, "preview={preview}", "preview={false}"],
    ] as const) {
      const law = bookLaws[index]!;
      const broken = law[1].replace(before, after);
      assert.notEqual(broken, law[1]);
      assert.equal(law[2](broken), false);
    }
  });
});

// cgo-095: execute the real review page with synthetic identity/storage only.
it("story review door renders counts/deep links for a child and never reads a preview queue", async () => {
  const ts = await import("typescript");
  const content = await import("@domigo/content-loader");
  const { storyReviewItems } = await import("../../../packages/game-novel/src/episode-state.ts");
  const compiled = ts.transpileModule(read("review/page.tsx"), { compilerOptions: {
    module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022,
  } }).outputText;
  const dueId = "g3u13.ci.listen-if-he-asks.gf.001";
  for (const preview of [false, true]) {
    const calls: string[] = [];
    let scopeIds: string[] = [];
    const modules: Record<string, unknown> = {
      "react/jsx-runtime": { jsx: (type: unknown, props: unknown) => ({ type, props }), jsxs: (type: unknown, props: unknown) => ({ type, props }) },
      "next/link": { default: "Link" }, "next/navigation": { redirect: () => assert.fail("unexpected redirect") },
      "@domigo/content-loader": content, "@domigo/game-novel": { storyReviewItems },
      "@/lib/student-view": { resolveStudentView: async () => preview ? { kind: "preview", grades: [3] } : { kind: "student", grades: [3], player: { userId: "fixture-child", classId: "fixture-class" } } },
      "@/lib/grade-scope": { isSlugAllowed: (slug: string, grades: number[]) => grades.includes(Number(slug[1])) },
      "@/app/PreviewBanner": { default: "PreviewBanner" },
      "@domigo/db": {
        getDb: () => { calls.push("db"); return {}; },
        getDueCounts: async () => ({ total: 0, vocab: 0, grammar: 0 }),
        getDueStoryCount: async (_db: unknown, userId: string, classId: string, scope: { itemIds: string[] }) => {
          assert.equal(userId, "fixture-child"); assert.equal(classId, "fixture-class"); scopeIds = scope.itemIds; calls.push("count"); return 3;
        },
        getDueStoryRefs: async () => { calls.push("refs"); return [{ itemId: dueId }]; },
      },
    };
    const loaded: { exports: { default?: (props: unknown) => Promise<unknown> } } = { exports: {} };
    new Function("require", "exports", "module", compiled)((id: string) => {
      assert.ok(id in modules, id); return modules[id];
    }, loaded.exports, loaded);
    const tree = await loaded.exports.default!({ searchParams: Promise.resolve({ jahrgang: "3" }) });
    const serialized = JSON.stringify(tree);
    assert.match(serialized, /Wiederholung in der Geschichte/);
    assert.doesNotMatch(serialized, /GrammarItemView|listen-if-he-asks|Your words:/, "the door cannot render a task outside its scene");
    if (preview) {
      assert.deepEqual(calls, []);
      assert.match(serialized, /ohne persönlichen Wiederholungsstand/);
    } else {
      assert.equal(scopeIds.length, 15);
      assert.ok(scopeIds.includes(dueId));
      assert.match(serialized, /3 Aufgaben fällig/);
      assert.match(serialized, /\/play\/3\/ch13/);
      assert.doesNotMatch(serialized, /caught up|Start review/);
      assert.ok(calls.includes("refs") && calls.includes("count"));
    }
  }
});
