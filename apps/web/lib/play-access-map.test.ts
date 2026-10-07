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
const ALL_CLIENTS = [...STORY_CLIENTS.map((c) => c.file), "practice/[slug]/PracticeSession.tsx"];

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
    for (const call of ["getGameSave", "getDueRefs", "getSolvedGameItemIds"]) {
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
  it("the painted book keeps the draft gate and uses runtime visibility plus the year wall", () => {
    const book = code(read(`${PLAY}/buch/[chapter]/page.tsx`));
    assert.match(book, /if \(teacher === null\) \{/);
    assert.match(book, /yearRedirect\(await resolveStudentView\(\), 1\)/);
    assert.match(book, /if \(await openStoryIdForGrade\(1\) === null\) redirect\("\/play"\)/);
    assert.match(book, /if \(raw\.draft === true && teacher === null\)/);
  });
});

describe("server write walls — a teacher session records nothing", () => {
  for (const file of ["api/attempts/route.ts"]) {
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
    { file: "learn/[slug]/[node]/page.tsx", clients: ["PathPracticeNode", "PathPracticeNode"], owner: "acting.userId", key: "acting.userId" },
    { file: "review/session/page.tsx", clients: ["ReviewSession"], owner: "session.user.id", key: "session.user.id" },
    { file: "tests/[slug]/page.tsx", clients: ["TestSession"], owner: "session.user.id", key: "session.user.id" },
    { file: "listening/[slug]/page.tsx", clients: ["ListeningSession"], owner: "session.user.id", key: "session.user.id" },
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
      assert.match(src, /useOutboxFlush\(true, ownerId\)/);
      assert.match(src, /sendAttempt\(\{[\s\S]*?\}, ownerId\)/);
    });
  }
});
