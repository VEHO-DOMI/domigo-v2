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

describe("cgo-109 five mode access walls", () => {
  it("C17 every mode resolves the real student view and uses the shared page", () => {
    for (const mode of ["flashcards", "memory", "spelling", "wordhunt", "speed"]) {
      assert.match(code(read(`modi/${mode}/page.tsx`)), /await resolveStudentView\(query\.jahrgang\)/);
      assert.match(code(read(`modi/${mode}/page.tsx`)), /renderModePage\(view, query\.chapters,/);
    }
    const page = read("modi/ModePage.tsx");
    assert.match(page, /trainerGrade\(view\)/);
    assert.match(page, /const preview = view\.kind === "preview"/);
    assert.match(page, /ownerId=\{acting\?\.userId \?\? null\}/);
    assert.match(page, /key=\{acting\?\.userId \?\? `preview-\$\{grade\}`\}/);
    assert.match(fs.readFileSync(new URL("../middleware.ts", import.meta.url), "utf8"), /"\/modi\/:path\*"/);
  });
  it("C18 shared mode sender mutes preview, isolates owners and never calls storage directly", () => {
    const source = code(read("modi/ModeSession.tsx"));
    assert.match(source, /useOutboxFlush\(!preview, ownerId\)/);
    assert.match(source, /attemptSender\(preview, ownerId\)\(body\)/);
    assert.match(source, /if \(preview \|\| !ownerId\) return/);
    assert.doesNotMatch(source, /\bsendAttempt\b|localStorage|sessionStorage|indexedDB|method:\s*["']POST/);
  });
});

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
  for (const file of ["(game)/play/page.tsx", "practice/page.tsx", "practice/[slug]/page.tsx", "woerterbuch/page.tsx"]) {
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
  it("the painted book keeps the draft gate and uses runtime visibility plus the year wall", () => {
    const book = code(read(`${PLAY}/buch/[chapter]/page.tsx`));
    assert.match(book, /if \(teacher === null\) \{/);
    assert.match(book, /yearRedirect\(await resolveStudentView\(\), 1\)/);
    assert.match(book, /if \(await openStoryIdForGrade\(1\) === null\) redirect\("\/play"\)/);
    assert.match(book, /if \(raw\.draft === true && teacher === null\)/);
  });
});

describe("cgo-099 dictionary is a read-only child surface", () => {
  it("uses the resolved year for data and the teacher's daily word preview", () => {
    const src = code(read("woerterbuch/page.tsx"));
    assert.match(src, /await resolveStudentView\(\(await searchParams\)\.jahrgang\)/);
    assert.match(src, /if \(!view\) redirect\("\/signin"\)/);
    assert.match(src, /const grades = view\.kind === "student" && view\.grades\.length !== 1 \? \[\] : view\.grades/);
    assert.match(src, /await loadDictionary\(grades\)/);
    assert.match(src, /preview && <PreviewBanner/);
    assert.match(src, /preview && grades\.map/);
    assert.match(src, /selectDailyWord\(entries, grade, dateKey\)/);
  });
  it("has no learner-state, attempt or browser storage/network path", () => {
    const folder = new URL("../app/woerterbuch/", import.meta.url);
    const files = fs.readdirSync(folder).filter((name) => /\.(ts|tsx)$/.test(name) && !name.includes(".test."));
    const sources = files.map((name) => fs.readFileSync(new URL(name, folder), "utf8"));
    for (const name of ["woerterbuch.ts", "wort-des-tages.ts"]) sources.push(fs.readFileSync(new URL(name, import.meta.url), "utf8"));
    for (const src of sources.map(code)) {
      assert.doesNotMatch(src, /@domigo\/db|attempt-outbox|preview-attempt|\b(?:fetch|XMLHttpRequest|WebSocket|sendBeacon|localStorage|sessionStorage|indexedDB|getUserProgress|getDueCounts|recordAttempt)\b|["']use server["']/);
    }
    assert.doesNotMatch(code(read("woerterbuch/Dictionary.tsx")), /content-service/);
    assert.doesNotMatch(code(read("woerterbuch/page.tsx")), /view\.player/);
  });
  it("home and explorer expose the dictionary and share the daily card", () => {
    const home = code(read("home/page.tsx"));
    assert.match(home, /wortDesTages\(grade, day\)/);
    assert.match(home, /word && <div className="og-today-section"/);
    assert.match(read("admin/explorer/page.tsx"), /\/woerterbuch\?jahrgang=\$\{grade\}/);
    const card = read("woerterbuch/WordOfTheDay.tsx");
    assert.match(card, /Im Wörterbuch/);
    assert.match(card, /#wort-\$\{entry.id\}/);
  });
  it("dictionary loads approved Chapters and links each word to existing practice", () => {
    const data = code(fs.readFileSync(new URL("woerterbuch.ts", import.meta.url), "utf8"));
    assert.match(data, /const slugs = listApprovedUnits\(\)\.filter/);
    assert.match(data, /await Promise\.all\(slugs\.map\(\(slug\) => loadUnitWithOverrides\(slug\)\)\)/);
    assert.doesNotMatch(data, /readdir|loadWordbank/);
    const client = code(read("woerterbuch/Dictionary.tsx"));
    assert.match(client, /dictionaryResults\(entries, query\)/);
    assert.match(client, /href=\{`\/practice\/\$\{entry.slug\}`\}/);
    assert.match(client, /id=\{`wort-\$\{entry.id\}`\}/);
    assert.match(client, /prefetch=\{false\}/);
  });
  it("dictionary is in the sign-in matcher and preview has exactly one return door", () => {
    const middleware = code(fs.readFileSync(new URL("../middleware.ts", import.meta.url), "utf8"));
    assert.match(middleware, /matcher:\s*\[[^\]]*"\/woerterbuch"/);
    const page = code(read("woerterbuch/page.tsx"));
    assert.match(page, /!preview && <Link href="\/home"/);
    assert.doesNotMatch(page, /\/admin\/explorer/);
    assert.equal((read("PreviewBanner.tsx").match(/href="\/admin\/explorer"/g) ?? []).length, 1);
  });
  it("explorer counts the current dictionary words in each year alongside Chapters", () => {
    const explorer = code(read("admin/explorer/page.tsx"));
    assert.match(explorer, /const dictionary = await loadDictionary\(GRADES\)/);
    assert.match(explorer, /const gradeWords = dictionary\.filter\(\(entry\) => entry\.grade === grade\)\.length/);
    assert.match(explorer, /\{gradeWords\} Wörter · \{gradeUnits\} Chapters/);
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
      for (const call of ["getPathSummary", "getUnitPathProgress", "getJourneyAttempts", "getDueRefs", "getDueCounts", "getDueStoryRefs", "getDueStoryCount", "listStudentTraps", "listReservedForClass"]) {
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
  ["client: reply subscription excludes preview, bench and absent owner", bookClient,
    (s: string) => /const attemptReplies = useMemo\(\(\) => !preview && cardBench === undefined && ownerId\s*\? \(listener: OutboxReplyListener\) => subscribeOutboxReplies\(ownerId, listener\)\s*: undefined, \[preview, cardBench, ownerId\]\)/.test(s)
      && (s.match(/subscribeOutboxReplies\(/g) ?? []).length === 1,
    (s: string) => s.replace("!preview && cardBench === undefined && ownerId", "ownerId")],
  ["client: optional subscription reaches only the game", bookClient,
    (s: string) => (s.match(/attemptReplies=\{attemptReplies\}/g) ?? []).length === 1
      && !/<PaintDevGallery[^>]*attemptReplies/.test(s),
    (s: string) => s.replace("attemptReplies={attemptReplies}", "attemptReplies={undefined}")],
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
      [6, "preview={preview}", "preview={false}"],
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
      "./FallenKarte": { default: "FallenKarte" },
      "@domigo/db": {
        getDb: () => { calls.push("db"); return {}; },
        getDueCounts: async () => ({ total: 0, vocab: 0, grammar: 0 }),
        listStudentTraps: async () => { calls.push("traps"); return []; },
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

// cgo-105: render the real page and card; replace only identity and storage.
async function trapReviewHarness() {
  const ts = await import("typescript");
  const jsx = await import("react/jsx-runtime");
  const { createElement } = await import("react");
  const { renderToStaticMarkup } = await import("react-dom/server");
  const content = await import("@domigo/content-loader");
  const { trapLabel } = await import("../../../packages/db/src/class-progress.ts");
  const modules: Record<string, unknown> = {
    "react/jsx-runtime": jsx,
    "next/link": { default: ({ children, ...props }: Record<string, unknown>) => createElement("a", props, children as never) },
    "next/navigation": { redirect: () => assert.fail("unexpected redirect") },
    "@domigo/content-loader": content,
    "@/lib/grade-scope": { isSlugAllowed: (slug: string, grades: number[]) => grades.includes(Number(slug[1])) },
    "@/app/PreviewBanner": { default: () => createElement("p", {}, "Vorschau") },
    "@domigo/db": { trapLabel },
  };
  const compile = (file: string) => {
    const compiled = ts.transpileModule(read(file), { compilerOptions: {
      module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022,
    } }).outputText;
    const loaded = { exports: {} as { default: (props: never) => unknown } };
    new Function("require", "exports", "module", compiled)((id: string) => {
      assert.ok(id in modules, id); return modules[id];
    }, loaded.exports, loaded);
    return loaded.exports.default;
  };
  const card = compile("review/FallenKarte.tsx");
  const render = (tree: unknown) => renderToStaticMarkup(tree as Parameters<typeof renderToStaticMarkup>[0]);
  const registry = content.loadTrapRegistry()!.traps;
  const traps = registry.slice(0, 3).map((trap, i) => ({ trapId: trap.id, count: 4 - i, unitSlug: `g1-u0${i + 1}`, itemId: `fixture-item-${i}` }));
  return { modules, compile, card, render, registry, traps };
}

it("student traps: the source and render both hide fewer than two occurrences", async () => {
  const { card, render, traps } = await trapReviewHarness();
  const src = code(read("review/FallenKarte.tsx"));
  assert.match(src, /traps\.filter\(\(trap\) => trap\.count >= 2\)\.slice\(0, 3\)/);
  assert.match(src, /if \(recurring\.length === 0\) return null;/);
  for (const rows of [[], [{ ...traps[0], count: 1 }], [{ ...traps[0], count: 0 }]]) {
    assert.equal(render(card({ traps: rows } as never)), "");
  }
});

it("student traps: three register explanations, frequencies and Chapter doors", async () => {
  const { card, render, registry, traps } = await trapReviewHarness();
  const html = render(card({ traps: [...traps, { ...traps[0], trapId: "fourth-trap", count: 2 }] } as never));
  assert.match(html, /Deine häufigsten Fallen/);
  assert.equal((html.match(/<li /g) ?? []).length, 3);
  const escape = (text: string) => text.replaceAll("&", "&amp;").replaceAll("'", "&#x27;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  for (let i = 0; i < 3; i++) {
    for (const field of ["nameDe", "icon", "oneLinerDe"] as const) assert.ok(html.includes(escape(registry[i]![field])), field);
    assert.ok(html.includes(`${4 - i}-mal in den letzten 30 Tagen`));
    assert.ok(html.includes(`href="/practice/g1-u0${i + 1}"`));
    assert.ok(html.includes(`Chapter ${i + 1} üben`));
  }
  assert.doesNotMatch(html, /fourth-trap|\bUnit\b|Du schaffst das|Super|Weiter so|Gut gemacht/);
});

it("student traps: a slug without a Chapter number renders Chapter without NaN", async () => {
  const { card, render, traps } = await trapReviewHarness();
  for (const unitSlug of ["legacy-story", "g1-u", "g1-u03-extra", ""]) {
    const html = render(card({ traps: [{ ...traps[0], unitSlug }] } as never));
    assert.match(html, />Chapter üben →<\/a>/);
    assert.doesNotMatch(html, /Chapter NaN/);
  }
});

it("student traps: an unknown id keeps its name and door without invented explanation", async () => {
  const { card, render, traps } = await trapReviewHarness();
  const html = render(card({ traps: [{ ...traps[0], trapId: "future-trap" }] } as never));
  assert.match(html, /<h3[^>]*>future-trap<\/h3>/);
  assert.match(html, /4-mal in den letzten 30 Tagen/);
  assert.match(html, /href="\/practice\/g1-u01"/);
  assert.equal((html.match(/<p /g) ?? []).length, 1);
});

it("student traps: actual child scope only; preview makes zero personal reads", async () => {
  const { modules, compile, card, render, traps } = await trapReviewHarness();
  for (const kind of ["child", "empty", "unavailable", "preview"]) {
    const calls: string[] = [];
    const db = {};
    const scope = ["fixture-class"];
    modules["@/lib/student-view"] = { resolveStudentView: async () => kind === "preview"
      ? { kind: "preview", grades: [1] }
      : { kind: "student", grades: [1], player: { userId: "fixture-child", classId: "fixture-class", classScope: scope } } };
    modules["./FallenKarte"] = { default: card };
    modules["@domigo/db"] = {
      getDb: () => { calls.push("db"); return db; },
      getDueCounts: async () => { calls.push("due"); return { total: 1, vocab: 1, grammar: 0 }; },
      getDueStoryCount: async () => { calls.push("story-count"); return 0; },
      getDueStoryRefs: async () => { calls.push("story-refs"); return []; },
      listStudentTraps: async (...args: unknown[]) => {
        calls.push("traps");
        assert.deepEqual(args, [db, scope, "fixture-class", "fixture-child", { sinceDays: 30, limit: 3 }]);
        if (kind === "unavailable") throw new Error("synthetic storage outage");
        return kind === "empty" ? [] : traps;
      },
    };
    const html = render(await compile("review/page.tsx")({ searchParams: Promise.resolve({}) } as never));
    if (kind === "preview") assert.deepEqual(calls, []);
    else assert.equal(calls.filter((call) => call === "traps").length, 1);
    if (kind === "child") {
      assert.ok(html.indexOf("Deine häufigsten Fallen") < html.indexOf("Start review"));
      assert.match(html, /4-mal in den letzten 30 Tagen/);
    } else assert.doesNotMatch(html, /Deine häufigsten Fallen|student-traps-title/);
  }
});

// cgo-108: the new trainer surfaces inherit the existing preview and year wall.
describe("OG W1 surfaces", () => {
  for (const route of ["home", "modi", "profil", "fortschritt"]) it(`${route}: pinned sign-in matcher`, () => {
    const middleware = fs.readFileSync(new URL("../middleware.ts", import.meta.url), "utf8");
    const matcher = code(middleware).match(/matcher:\s*\[([^\]]+)\]/)?.[1] ?? "";
    assert.ok([...matcher.matchAll(/"([^"]+)"/g)].some((m) => m[1] === `/${route}`), `${route} requires sign-in`);
  });
  for (const route of ["home", "modi"]) it(`${route}: no motivational formulas in source`, () => {
    const directory = new URL(`../app/${route}/`, import.meta.url);
    for (const file of fs.readdirSync(directory, { recursive: true, encoding: "utf8" }).filter((f) => /\.tsx?$/.test(f) && !/\.test\./.test(f))) {
      assert.doesNotMatch(code(fs.readFileSync(new URL(file, directory), "utf8")), /\bSuper\b|Weiter so|Gut gemacht|Du schaffst das/i, `${route}/${file}`);
    }
  });
  it("dictionary names only the available library until W2", () => {
    const home = code(read("home/page.tsx"));
    assert.match(home, /<strong>Dictionary<\/strong><small>Browse your full vocabulary library<\/small>/);
    assert.doesNotMatch(home, /Flashcards/i);
  });
  it("daily reserve stays after selection and is visible without replacing words", () => {
    const loader = code(read("practice/load-practice.ts")).split("export async function loadDailyChallenge")[1]!;
    assert.doesNotMatch(loader, /loadPracticeWords/);
    assert.ok(loader.indexOf("selectDailyChallenge(") < loader.indexOf("listReservedForClass("));
    const runner = code(read("practice/page.tsx"));
    assert.match(runner, /vocab: challenge.availableWords/);
    for (const page of [runner, code(read("home/page.tsx"))]) assert.match(page, /Heute gesperrt: \{challenge.blockedCount\}\/10/);
    assert.match(code(read("home/page.tsx")), /challenge.availableWords.length > 0/);
  });
  it("home and modes honor the merged runtime story opening", () => {
    for (const file of ["home/page.tsx", "modi/page.tsx"]) {
      const src = code(read(file));
      assert.match(src, /await listOpenStories\(\)/);
      assert.doesNotMatch(src, /listReleasedStories/);
    }
  });
  for (const route of ["home", "modi", "profil", "fortschritt"]) it(`${route}: server-resolved year and preview`, () => {
    const src = code(read(`${route}/page.tsx`));
    assert.match(src, /await resolveStudentView\(/);
    assert.match(src, /trainerGrade\(view\)/);
    assert.match(src, /view\.kind === "student" \? view\.player : null/);
    assert.match(src, /preview=\{preview\}/);
    assert.doesNotMatch(src, /\b(fetch|localStorage|sessionStorage|recordAttempt|setStudentAvatar)\(/);
  });
  it("personal readers require a child; profile preview returns before auth/storage", () => {
    const profile = code(read("home/trainer-data.ts"));
    const previewReturn = profile.indexOf('if (view.kind === "preview") return');
    assert.ok(previewReturn >= 0 && previewReturn < profile.indexOf("await auth()"));
    for (const [file, call] of [["home/page.tsx", "getDailyChallengeCount"], ["modi/page.tsx", "getDueCounts"], ["fortschritt/page.tsx", "getStudentChapterProgress"]]) {
      const line = code(read(file!)).split("\n").find((l) => l.includes(`await ${call}(`));
      assert.ok(line); assert.match(line, /acting (?:&& challenge )?\? await/);
    }
    const picker = code(read("profil/AvatarPicker.tsx"));
    assert.ok(picker.indexOf('if (preview)') < picker.indexOf('await fetch('));
    assert.match(picker, /if \(preview\) \{[^}]+return; \}/);
    assert.equal([...picker.matchAll(/\bfetch\(/g)].length, 1);
    assert.match(picker, /fetch\("\/api\/profil", \{ method: "POST"/);
    assert.doesNotMatch(picker, /localStorage|sessionStorage|indexedDB/);
  });
  it("all declared tile destinations are real routes; unavailable games are absent", () => {
    const tiles = ["home/page.tsx", "home/PlayerCard.tsx", "modi/ModePicker.tsx"];
    const known = new Set<string>();
    for (const f of tiles) {
      const src = code(read(f));
      assert.doesNotMatch(src, /Activity Game|Battle Arena|Bestenliste|Speed Round|Memory Match|Spelling Bee|Word Hunt/);
      for (const match of src.matchAll(/(?:href=\{?[`"]|path:\s*")(\/[a-z][a-z/-]*)/g)) known.add(match[1]!);
    }
    for (const path of ["/home", "/modi", "/profil", "/fortschritt", "/practice", "/woerterbuch", "/review"]) known.add(path);
    assert.ok(known.size >= 7);
    for (const path of known) {
      const route = path === "/play/" ? "(game)/play/[grade]" : path.slice(1).replace(/\/$/, "");
      assert.ok(fs.existsSync(new URL(`../app/${route}/page.tsx`, import.meta.url)), `dead tile: ${path}`);
    }
  });
  it("daily parameter uses the existing attempt writer; reservations remain fail closed", () => {
    const runner = code(read("practice/[slug]/PracticeSession.tsx"));
    assert.match(runner, /mode: runMode === "daily" \? "daily" : "practice"/);
    assert.match(runner, /attemptSender\(preview, (?:props\.)?ownerId\)/);
    const loader = code(read("practice/load-practice.ts"));
    assert.match(loader, /acting \? await listReservedForClass\(getDb\(\), acting.classScope, acting.classId\) : new Set/);
    assert.doesNotMatch(loader, /\.catch\(/);
    assert.match(loader, /assignPool\(item.id, reserved\) !== "mock"/);
    const theme = code(read("home/TrainerShell.tsx"));
    assert.doesNotMatch(theme, /localStorage|sessionStorage|fetch\(/);
  });
});

it("OG grade palettes use the study's literal light/dark values", () => {
  const study = fs.readFileSync(new URL("../../../docs/handover/design-study-og-trainers.md", import.meta.url), "utf8");
  const css = read("globals.css");
  for (const [theme, start, end] of [["light", "### Light theme", "### Dark theme"], ["dark", "### Dark theme", "### Dark-mode body"]]) {
    const section = study.slice(study.indexOf(start!), study.indexOf(end!));
    for (const row of section.split("\n").filter((l) => l.startsWith("| `--"))) {
      const cells = row.split("|").slice(1, -1).map((s) => s.trim());
      const token = cells[0]!.match(/`([^`]+)`/)![1]!;
      for (let grade = 1; grade <= 4; grade++) {
        const value = cells[grade]!.match(/^`([^`]+)`/); if (!value) continue; // prose shorthand in the source's shadow rows
        const selector = `.og-root[data-grade="${grade}"]${theme === "dark" ? '[data-theme="dark"]' : ""} {`;
        const block = css.slice(css.indexOf(selector) + selector.length).split("}")[0]!;
        assert.ok(block.includes(`${token}: ${value[1]};`), `${theme} year ${grade}: ${token} must equal ${value[1]}`);
      }
    }
  }
  assert.match(css, /@media \(prefers-color-scheme: dark\)/);
});

// Nachzug 1: render the shipped components with synthetic identity only.
async function renderTrainer(file: string, props: Record<string, unknown>): Promise<string> {
  const ts = await import("typescript");
  const React = await import("react");
  const jsx = await import("react/jsx-runtime");
  const { renderToStaticMarkup } = await import("react-dom/server");
  const levels = await import("./levels.ts");
  const avatar = await import("./avatar.ts");
  const modeCatalog = await import("./modi/catalog.ts");
  const modules: Record<string, unknown> = {
    react: React, "react/jsx-runtime": jsx,
    "next/link": { default: "a" }, "next/image": { default: "img" },
    "../le/konto-aktion": { abmelden: async () => {} },
    "@/lib/levels": levels, "@/lib/avatar": avatar,
    "@/lib/modi/catalog": modeCatalog,
  };
  const compiled = ts.transpileModule(read(file), { compilerOptions: {
    module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022,
  } }).outputText;
  const loaded: { exports: { default?: React.ComponentType<Record<string, unknown>> } } = { exports: {} };
  new Function("require", "exports", "module", compiled)((id: string) => {
    assert.ok(id in modules, id); return modules[id];
  }, loaded.exports, loaded);
  return renderToStaticMarkup(React.createElement(loaded.exports.default!, props));
}

it("Nachzug 1 modes render original subtitles and honest XP for every existing mode", async () => {
  const { xpForTier } = await import("@domigo/engine");
  const complete = [1, 2, 3].map((difficulty) => xpForTier(difficulty * 10, "correct"));
  assert.deepEqual(complete, [10, 20, 30]);
  assert.match(read("api/attempts/route.ts"), /xpForTier\(item\.difficulty \* 10, tier\)/);
  for (const grade of [1, 2, 3, 4]) {
    const html = await renderTrainer("modi/ModePicker.tsx", { grade, preview: true, chapters: [`g${grade}-u01`], due: null, story: { title: "Test Story", href: `/play/${grade}` }, areas: false });
    assert.equal((html.match(/class="og-mode-xp"/g) ?? []).length, 10);
    const word = grade === 1 ? "Wort" : "word";
    assert.equal((html.match(new RegExp(`10–30 XP / ${word}`, "g")) ?? []).length, 5);
    assert.ok(html.includes(grade === 1 ? "10–30 XP / Aufgabe" : "10–30 XP / question"));
    for (const text of grade === 1
      ? ["Alle gewählten Wörter, gemischte Aufgaben", "10 zufällige Wörter, schnelle Runde", "Wähle aus 4 Möglichkeiten", "XP für bewertete Antworten", "XP für eine richtige Antwort · je nach Schwierigkeit"]
      : ["All selected words, mixed types", "10 random words, quick round", "Choose from 4 options", "XP for graded answers", "XP for a correct answer · based on difficulty"])
      assert.ok(html.includes(text), `year ${grade}: ${text}`);
  }
});

it("Nachzug 1 player grammar line is only level/title and right-aligned XP", async () => {
  const { levelFor, grammarTitle, registerFor } = await import("./levels.ts");
  for (const grade of [1, 2, 3, 4]) {
    const grammarXp = 20;
    const grammar = levelFor(grammarXp);
    const title = grammarTitle(grammar.level, grammar.prestige, registerFor(grade)).name;
    const html = await renderTrainer("home/PlayerCard.tsx", { grade, preview: true, profile: { name: "Test", avatar: 1, xp: 184, grammarXp, streak: 3 } });
    assert.ok(html.includes(`<div class="og-grammar-bar"><div><span>Lv ${grammar.level} · ${title}</span><span>20 XP</span></div>`));
  }
});

it("Nachzug 1 grades 3/4 start dark and theme selection never persists", async () => {
  for (const grade of [1, 2, 3, 4]) {
    const html = await renderTrainer("home/TrainerShell.tsx", { grade, preview: true, children: "Test" });
    assert.ok(html.includes(`data-theme="${grade >= 3 ? "dark" : "system"}"`));
  }
  assert.doesNotMatch(code(read("home/TrainerShell.tsx")), /localStorage|sessionStorage|indexedDB|fetch\(/);
});

it("Nachzug 1 literal mockup geometry, bronze and subtitle recipes", () => {
  const css = read("globals.css");
  // Values from mockup.css + its original-2nd.css import; scoped selector names differ.
  for (const recipe of [
    "padding:28px 24px 20px;", "margin:8px 0 0;", "--radius:16px; --radius-lg:24px;",
    "background:linear-gradient(90deg, rgb(212, 135, 74), rgba(212, 135, 74, 0.8));",
    "box-shadow:0 0 8px var(--accent-glow);", "padding:6px 14px; border-radius:var(--radius); font-size:0.72rem;",
    "padding:0.9rem 1rem; margin-bottom:0.6rem; border-radius:var(--radius);",
    "font-size:0.72rem; color:var(--muted); margin-top:1px;", "padding:0.9rem 0.5rem; min-height:68px;",
    ".og-today { background:var(--card); }", "font:10px var(--font-body); color:var(--muted); padding:10px 0 15px;",
    ".og-rank { font-family:var(--font-display); }", ".og-mode strong,.og-mode small { font-family:Arial,sans-serif; }",
    ".og-wordmark { font-size:52px; }",
    "linear-gradient(140deg, #16A34A, #22C55E 40%, #15803D 80%)",
    "linear-gradient(140deg, #d43a2a, #e8654a 40%, #b82e1e 80%)",
    "linear-gradient(140deg, #3b82f6, #8ba4cc 50%, #d4943a 90%)",
    "linear-gradient(140deg, #9b6dff, #c4a8f0 50%, #d4943a 90%)",
    "background: rgba(22,163,74,0.06); border-color: rgba(22,163,74,0.15);",
    "background: rgba(220,38,38,0.05); border-color: rgba(220,38,38,0.14);",
    "background: rgba(37,99,235,0.06); border-color: rgba(37,99,235,0.15);",
    "background: rgba(124,58,237,0.06); border-color: rgba(124,58,237,0.15);",
    '.og-root[data-grade="4"] .og-action-card { background:var(--card); }',
    ".og-primary { text-shadow:0 1px 2px rgba(0,0,0,0.2); }",

  ]) assert.ok(css.includes(recipe), recipe);
  assert.doesNotMatch(css, /\.og-rank \{ padding:6px 10px; \}|\.og-switch \{ font-size:\.65rem/);
});

it("Nachzug 1 year 1 original drawing field, star, bulb and underline stay scoped", async () => {
  const { createHash } = await import("node:crypto");
  const css = read("globals.css");
  const decorations = css.slice(css.indexOf('/* Y1 drawing field'));
  for (const selector of ['.og-root[data-grade="1"]::before', '.og-root[data-grade="1"] .og-brand::before', '.og-root[data-grade="1"] .og-brand::after', '.og-root[data-grade="1"] .og-grade::after']) assert.ok(decorations.includes(selector), selector);
  const images = [...decorations.matchAll(/url\("(data:image\/svg\+xml,[^"]+)"\)/g)].map((m) => createHash("sha256").update(m[1]!).digest("hex"));
  assert.deepEqual(images, ['3f6276924696489d0dea0f0dc50c3c9d29ce54cf8307b7a09cd7ecf3d53f7bb5', '8ef8ab5fd150d6ca8f17cde855e49ee07761a727adff4fa9c9cfd88a37943418', '3ec7f87e36fb3f8d60c22dea792b2768abdc4d0a5039bebabde0a9d4d3af193f', '9e5ec67b1a285c973e75640fa4e7eb65694e068edb897f66cacace7349dc215b']);
});

it("Nachzug 1 original button metrics and year 1 mode backdrop", () => {
  const css = read("globals.css");
  for (const recipe of [
    '.og-nav-card { font-family:Arial,sans-serif; line-height:normal; }',
    '.og-primary { line-height:normal; }',
    '.og-today .og-primary { padding:0.5rem 0.9rem; font-size:0.8rem; }',
    '.og-root[data-screen="modi"] { background:var(--bg); }',
    '.og-root[data-grade="1"] .og-setup { background:var(--bg); }',
    '.og-root[data-grade="1"][data-screen="modi"]::before { display:none; }',
    '.og-root[data-grade="1"] .og-directions legend { font-size:0.72rem; font-weight:800; text-transform:uppercase; letter-spacing:0.1em; color:var(--muted); margin-bottom:0.5rem; }',
  ]) assert.ok(css.includes(recipe), recipe);
});
