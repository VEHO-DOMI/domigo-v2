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
  it("ArcadeClient: no Funken banked", () => {
    assert.match(read(`${PLAY}/run/ArcadeClient.tsx`), /if \(!preview && stats\.gluehwoerter > 0\)/);
  });
});

describe("server pages — who is a preview is decided on the server", () => {
  const zone = read(`${PLAY}/[zone]/page.tsx`);
  it("the zone page resolves the viewer through student-view and walls the child's year", () => {
    assert.match(zone, /const view = await resolveStudentView\(\);/);
    assert.doesNotMatch(code(zone), /getActingUserForPage|getPlayerForPage/);
    assert.match(zone, /if \(view\.kind === "student" && !view\.grades\.includes\(grade\)\)/);
    assert.match(zone, /const preview = view\.kind === "preview";/);
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
