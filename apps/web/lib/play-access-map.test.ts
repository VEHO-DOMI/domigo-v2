// cgo-047 · THE PREVIEW WRITES NOTHING — the source contract of every student
// surface a teacher can open (lib/student-view.ts, lib/preview-attempt.ts).
//
// The server half is behavioural (lib/game-save-route.test.ts; /api/attempts and
// /api/funken answer only a child). This half pins the page wiring and the client
// guards, which have no DOM test runner in this repo: every attempt goes through
// attemptSender(preview), the outbox is never flushed in a preview, no save is
// read from or written to the device or the server, and the server decides
// `preview` — a child can never be handed it.
import assert from "node:assert/strict";
import fs from "node:fs";
import { describe, it } from "node:test";
import { transpileModule } from "typescript";

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
const ALL_CLIENTS = [...STORY_CLIENTS.map((c) => c.file), `${PLAY}/run/ArcadeClient.tsx`, `${PLAY}/world/WorldClient.tsx`, "practice/[slug]/PracticeSession.tsx"];

describe("client guards — nothing leaves a preview", () => {
  for (const file of ALL_CLIENTS) {
    it(`${file}: attempts and the outbox`, () => {
      const src = read(file);
      assert.doesNotMatch(src, /\bsendAttempt\b/, "attempts go through attemptSender(preview), never sendAttempt directly");
      assert.match(src, /useOutboxFlush\(!preview\)/, "the outbox is not flushed in a preview");
      for (const m of src.matchAll(/[^\n]*\bflushOutbox\(\)[^\n]*/g)) {
        assert.match(m[0], /if \(!preview\) void flushOutbox\(\)/, `unguarded flush: ${m[0].trim()}`);
      }
      for (const m of src.matchAll(/[^\n]*\battemptSender\(([^)]*)\)/g)) assert.equal(m[1], "preview");
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
  it("WorldClient: no server save", () => {
    assert.match(read(`${PLAY}/world/WorldClient.tsx`), /const put = \(payload: SavePayload\) => \{\n\s*if \(preview\) return;\n\s*void fetch\("\/api\/game-save"/);
  });
  for (const preview of [true, false]) {
    it(`WorldClient: ${preview ? "preview never reads or writes device storage" : "normal play still loads and persists"}`, () => {
      // Execute the real save-sync block, including its page-hide effect. Only
      // React hooks and browser services are substituted; no copied guard logic.
      const src = read(`${PLAY}/world/WorldClient.tsx`);
      const definitions = src.match(/const GAME_MODE = [\s\S]*?(?=\/\*\* Slice the chapter)/);
      const sync = src.match(/const \[initial\] = [\s\S]*?(?=  \/\/ ── the restoration flow)/);
      assert.ok(definitions && sync, "WorldClient save-sync source must be found");
      const saved = { clientRev: 7, state: { v: 3, chapters: { ch01: { done: true } }, beats: {}, pos: { c: 2, r: 3 } } };
      const serverSave = { ...saved, clientRev: 4 };
      let stored = JSON.stringify(saved);
      let reads = 0;
      let writes = 0;
      let requests = 0;
      const timers = new Set<() => void>();
      const listeners = new Map<string, () => void>();
      const cleanups: Array<() => void> = [];
      const target = {
        addEventListener: (event: string, fn: () => void) => listeners.set(event, fn),
        removeEventListener: (event: string) => listeners.delete(event),
      };
      const env = {
        window: target,
        document: { ...target, visibilityState: "hidden" },
        localStorage: {
          getItem: () => { reads++; return stored; },
          setItem: (_key: string, value: string) => { writes++; stored = value; },
        },
        fetch: async () => { requests++; },
        setTimeout: (fn: () => void) => { timers.add(fn); return fn; },
        clearTimeout: (fn: () => void) => { timers.delete(fn); },
        useState: (init: () => unknown) => [init()],
        useRef: (current: unknown) => ({ current }),
        useMemo: (init: () => unknown) => init(),
        useEffect: (effect: () => () => void) => cleanups.push(effect()),
      };
      const executable = transpileModule(`
        function exercise(preview, serverSave, env) {
          const { window, document, localStorage, fetch, setTimeout, clearTimeout,
            useState, useRef, useMemo, useEffect } = env;
          ${definitions[0]}
          ${sync[0]}
          return { initial, at, saveRef, persist };
        }
      `, {}).outputText;
      const state = new Function(`${executable}\nreturn exercise;`)()(preview, serverSave, env);
      assert.deepEqual(state.initial, preview ? null : saved);
      assert.deepEqual(state.at, preview ? { v: 3, chapters: {}, beats: {} } : saved.state);
      assert.equal(reads, preview ? 0 : 1, "preview must not read localStorage at startup");
      state.saveRef.current.pos = { c: 5, r: 6 };
      state.persist();
      assert.equal(writes, preview ? 0 : 1, "preview must not write localStorage in persist()");
      assert.equal(timers.size, preview ? 0 : 1);
      listeners.get("pagehide")?.();
      listeners.get("visibilitychange")?.();
      assert.equal(reads, preview ? 0 : 2, "preview must not read localStorage on page hide");
      assert.equal(requests, preview ? 0 : 1);
      assert.equal(timers.size, 0);
      assert.deepEqual(JSON.parse(stored), preview ? saved : {
        clientRev: 8, state: { ...saved.state, pos: { c: 5, r: 6 } },
      });
      for (const cleanup of cleanups) cleanup();
      assert.equal(listeners.size, 0);
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
  it("no navigation entry leads to the sunset Keen story mode (Koki 02.10.)", () => {
    for (const file of ["admin/explorer/page.tsx", `${PLAY}/page.tsx`]) {
      assert.doesNotMatch(code(read(file)), /\/play\/1\/world|Keen/, `${file} still offers Keen`);
    }
  });
  it("ArcadeClient: no Funken banked", () => {
    assert.match(read(`${PLAY}/run/ArcadeClient.tsx`), /if \(!preview && stats\.gluehwoerter > 0\)/);
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
  for (const file of [`${PLAY}/world/page.tsx`, `${PLAY}/run/page.tsx`]) {
    it(`${file}: a teacher is a preview, the production gate stays`, () => {
      const src = read(file);
      assert.match(src, /const preview = \(await getActingUserForPage\(\)\) === null;/);
      assert.match(src, /preview=\{preview\}/);
      assert.match(src, /process\.env\.VERCEL_ENV === "production" && \(await getTeacherForPage\(\)\) === null/);
    });
  }
  it("the painted book keeps its teacher-only production gate", () => {
    assert.match(read(`${PLAY}/buch/[chapter]/page.tsx`), /process\.env\.VERCEL_ENV === "production" && teacher === null/);
  });
});

describe("server write walls — a teacher session records nothing", () => {
  for (const file of ["api/attempts/route.ts", "api/funken/route.ts"]) {
    it(`${file} answers only a child`, () => {
      const src = read(file);
      assert.match(src, /const acting = await getActingUser\(req\);\n\s*if \(!acting\) return NextResponse\.json\(\{ ok: false, error: "no_identity" \}, \{ status: 401 \}\);/);
      assert.doesNotMatch(src, /getActingPlayer|getTeacher/);
    });
  }
});
