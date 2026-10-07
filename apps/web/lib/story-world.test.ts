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
