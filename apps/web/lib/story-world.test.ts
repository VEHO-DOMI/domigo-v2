import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { child, fixture, reset, teacher } from "../app/admin/story-world.harness.test.mjs";
const { readStoryWorlds, listOpenStories, openStoryIdForGrade } = await import("./story-world.ts");
const { POST } = await import("../app/admin/story-world/route.ts");
const { default: AdminPage } = await import("../app/admin/page.tsx");
const { default: HomePage } = await import("../app/home/page.tsx");
const { default: PlayPage } = await import("../app/(game)/play/page.tsx");
const { default: HubPage } = await import("../app/(game)/play/[grade]/page.tsx");
const { default: ZonePage } = await import("../app/(game)/play/[grade]/[zone]/page.tsx");
const { default: BookIndexPage } = await import("../app/(game)/play/[grade]/buch/page.tsx");
const { default: BookPage } = await import("../app/(game)/play/[grade]/buch/[chapter]/page.tsx");
const { default: middleware } = await import("../middleware.ts");
const { NextRequest } = await import("next/server.js");
const gate = async (path: string, method = "GET") => {
  const request = Object.assign(new NextRequest(`https://fixture.invalid${path}`, { method }), { auth: fixture.session });
  // The test auth boundary calls the real middleware callback directly.
  const response = await middleware(request, { params: Promise.resolve({}) });
  assert.ok(response);
  return response;
};
const book = (chapter = "ch01") => BookPage({
  params: Promise.resolve({ grade: "1", chapter }),
  searchParams: Promise.resolve({ phase: "p2", perf: "1", grid: "1", warm: "0" }),
});
const post = (body: unknown, extra: Record<string, string> = {}) => new Request("https://fixture.invalid/admin/story-world", {
  method: "POST", headers: { origin: "https://fixture.invalid", "content-type": "application/json", ...extra }, body: JSON.stringify(body),
});
const hub = (grade = "1") => HubPage({ params: Promise.resolve({ grade }) });
const chooser = () => PlayPage({ searchParams: Promise.resolve({}) });
beforeEach(reset);

describe("runtime story world", () => {
  it("uses the actual release defaults, including parked year 1", async () => {
    const state = await readStoryWorlds();
    assert.equal(state.available, true);
    assert.deepEqual(state.grades, [1, 2, 3, 4].map((grade) => ({ grade, isOpen: grade !== 1 })));
    assert.equal(await openStoryIdForGrade(1), null);
    assert.equal(await openStoryIdForGrade(3), "g3.st.fourteen");
  });
  it("falls back to release files on missing migration/outage and reports unavailable", async () => {
    fixture.settings.set(1, true);
    fixture.readFailure = true;
    const state = await readStoryWorlds();
    assert.equal(state.available, false);
    assert.deepEqual(state.grades, [1, 2, 3, 4].map((grade) => ({ grade, isOpen: grade !== 1 })));
    assert.match(renderToStaticMarkup(await AdminPage()), /Settings are unavailable/);
  });
  it("open → parked → open reaches home, chooser, hub and mastery without process restart", async () => {
    for (const isOpen of [true, false, true]) {
      fixture.session = teacher;
      assert.equal((await POST(post({ grade: 1, isOpen }))).status, 200);
      const admin = renderToStaticMarkup(await AdminPage());
      assert.equal(admin.includes('data-grade="1"'), isOpen, "the mastery section follows the setting");
      assert.equal(fixture.masteryGrades.includes(1), isOpen, "parked mastery is not even queried");
      fixture.masteryGrades = [];
      fixture.session = child;
      const home = renderToStaticMarkup(await HomePage());
      assert.equal(home.includes('href="/play/1"'), isOpen, "the home story tile follows the setting");
      assert.equal(home.includes('href="/play"'), false, "parked has no generic story tile either");
      await assert.rejects(hub(), { message: `REDIRECT:${isOpen ? "/play/1/buch" : "/play"}` });
      if (isOpen) await assert.rejects(chooser(), { message: "REDIRECT:/play/1" });
      else assert.doesNotMatch(renderToStaticMarkup(await chooser()), /data-grade="1"/);
    }
    assert.equal(fixture.storageCalls, 3);
  });
  it("parking year 2 removes its index tile and rejects its hub and zone", async () => {
    fixture.settings.set(2, false);
    assert.ok(!(await listOpenStories()).some((s) => s.grade === 2));
    const index = renderToStaticMarkup(await chooser());
    assert.doesNotMatch(index, /data-grade="2"/);
    fixture.session = child;
    fixture.grade = 2;
    await assert.rejects(hub("2"), { message: "REDIRECT:/play" });
    await assert.rejects(ZonePage({ params: Promise.resolve({ grade: "2", zone: "ch01" }), searchParams: Promise.resolve({}) }), { message: "REDIRECT:/home" });
  });
  it("opening year 1 does not let another school year enter it", async () => {
    fixture.settings.set(1, true);
    fixture.session = child;
    fixture.grade = 2;
    await assert.rejects(hub(), { message: "REDIRECT:/play/2" });
  });
});

describe("POST /admin/story-world", () => {
  it("rejects a child or anonymous request with 403 before calling storage", async () => {
    for (const session of [child, null]) {
      fixture.session = session;
      assert.equal((await POST(post({ grade: 1, isOpen: true }, { "x-dev-teacher-id": "forged" }))).status, 403);
    }
    assert.equal(fixture.storageCalls, 0);
  });
  it("rejects a foreign year or empty scope with 403 despite forged request scope", async () => {
    assert.equal((await POST(post({ grade: 4, isOpen: true, scope: ["forged"] }))).status, 403);
    fixture.session = { user: { ...teacher.user, scope: [] } };
    assert.equal((await POST(post({ grade: 1, isOpen: true, scope: ["fixture-class"] }))).status, 403);
    assert.equal(fixture.settings.size, 0);
  });
  it("rejects cross-origin writes and form posts", async () => {
    assert.equal((await POST(post({ grade: 1, isOpen: true }, { origin: "https://foreign.invalid" }))).status, 403);
    assert.equal((await POST(post({ grade: 1, isOpen: true }, { "content-type": "text/plain" }))).status, 400);
    assert.equal(fixture.storageCalls, 0);
  });
  it("rejects malformed input before writing", async () => {
    for (const body of [null, {}, { grade: 0, isOpen: true }, { grade: "1", isOpen: true }, { grade: 1, isOpen: "open" }]) {
      assert.equal((await POST(post(body))).status, 400);
    }
    assert.equal(fixture.storageCalls, 0);
  });
  it("returns 503 and keeps the old state when saving fails", async () => {
    fixture.settings.set(1, false);
    fixture.writeFailure = true;
    assert.equal((await POST(post({ grade: 1, isOpen: true }))).status, 503);
    assert.equal(fixture.settings.get(1), false);
  });
});

// Exercise the real server pages: only the browser game component is replaced.
describe("painted book runtime door", () => {
  it("open child follows hub and index into ch01; parking closes direct entry", async () => {
    const previousNodeEnv = process.env.NODE_ENV;
    Object.assign(process.env, { NODE_ENV: "production" });
    try {
      fixture.session = child;
      for (const isOpen of [true, false, true]) {
        fixture.settings.set(1, isOpen);
        if (!isOpen) {
          await assert.rejects(book(), { message: "REDIRECT:/play" });
          continue;
        }
        await assert.rejects(hub(), { message: "REDIRECT:/play/1/buch" });
        await assert.rejects(BookIndexPage({ params: Promise.resolve({ grade: "1" }), searchParams: Promise.resolve({ phase: "p2", perf: "1" }) }),
          { message: "REDIRECT:/play/1/buch/ch01?phase=p2&perf=1" });
        const page = await book();
        assert.equal(page.type, "main");
        const game = page.props.children;
        assert.equal(game.props.startPhase, undefined);
        assert.equal(game.props.debugPerf, false);
        assert.equal(game.props.debugGrid, false);
        assert.equal(game.props.noWarm, false);
      }
    } finally {
      if (previousNodeEnv === undefined) Reflect.deleteProperty(process.env, "NODE_ENV");
      else Object.assign(process.env, { NODE_ENV: previousNodeEnv });
    }
  });
  it("open does not admit a child to a draft chapter", async () => {
    fixture.session = child;
    fixture.settings.set(1, true);
    await assert.rejects(book("ch02"), { message: "REDIRECT:/play/1" });
  });
  it("direct book entry keeps the school-year wall and the signed-in door", async () => {
    fixture.settings.set(1, true);
    fixture.session = child;
    fixture.grade = 2;
    await assert.rejects(book(), { message: "REDIRECT:/play/2" });
    fixture.session = null;
    await assert.rejects(book(), { message: "REDIRECT:/signin" });
  });
  it("teacher preview remains available while the year is parked, including drafts", async () => {
    const previousNodeEnv = process.env.NODE_ENV;
    Object.assign(process.env, { NODE_ENV: "production" });
    try {
      fixture.settings.set(1, false);
      for (const chapter of ["ch01", "ch02"]) {
        const page = await book(chapter);
        assert.equal(page.type, "main");
        assert.equal(page.props.children.props.debugPerf, true);
      }
    } finally {
      if (previousNodeEnv === undefined) Reflect.deleteProperty(process.env, "NODE_ENV");
      else Object.assign(process.env, { NODE_ENV: previousNodeEnv });
    }
  });
});

describe("story-world outer HTTP wall", () => {
  it("returns 403 for child and anonymous writes before the endpoint", async () => {
    for (const session of [child, null]) {
      fixture.session = session;
      const response = await gate("/admin/story-world", "POST");
      assert.equal(response.status, 403);
      assert.deepEqual(await response.json(), { ok: false, error: "forbidden" });
    }
    assert.equal(fixture.storageCalls, 0);
  });
  it("admits a teacher write and preserves child/anonymous page redirects", async () => {
    assert.equal((await gate("/admin/story-world", "POST")).headers.get("x-middleware-next"), "1");
    fixture.session = child;
    for (const path of ["/admin/story-world", "/admin/classes"]) {
      const response = await gate(path);
      assert.equal(response.status, 307);
      assert.equal(new URL(response.headers.get("location")!).pathname, "/home");
    }
    fixture.session = null;
    const response = await gate("/admin/story-world");
    assert.equal(response.status, 307);
    assert.equal(new URL(response.headers.get("location")!).pathname, "/admin/signin");
  });
  it("keeps the dev teacher page doors while requiring a session for the write", async () => {
    fixture.session = null;
    process.env.VERCEL_ENV = "development";
    process.env.DEV_TEACHER_ID = "fixture-dev-teacher";
    for (const path of ["/admin", "/admin/classes", "/play/1", "/play/4"]) {
      assert.equal((await gate(path)).headers.get("x-middleware-next"), "1", path);
    }
    assert.equal((await gate("/admin/story-world", "POST")).status, 403);
    process.env.VERCEL_ENV = "production";
    for (const path of ["/admin", "/play/1"]) assert.equal((await gate(path)).status, 307, path);
  });
  it("keeps the existing teacher area gate", async () => {
    const withoutArea = { user: { ...teacher.user, via: "konto-handoff", goTeacher: false } };
    fixture.session = withoutArea;
    const response = await gate("/admin/story-world", "POST");
    assert.equal(response.status, 307);
    assert.equal(new URL(response.headers.get("location")!).pathname, "/zugriff-fehlt");
  });
});
