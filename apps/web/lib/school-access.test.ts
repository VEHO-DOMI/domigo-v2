import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
import { fixture, resetSchoolFixture } from "../scripts/lib/school-test-harness.mjs";
const { schoolAccess } = await import("./school-access.ts");

beforeEach(() => {
  resetSchoolFixture();
  fixture.session = { user: { id: "child-own", classId: "class-own", role: "student", scope: ["class-own"] } };
});
const request = () => new Request("https://school.invalid/api/school", {
  headers: { "x-dev-user-id": "child-foreign", "x-dev-class-id": "class-foreign", "x-dev-teacher-id": "teacher-forged" },
});
describe("school access through the real session identity", () => {
  it("allows the released year 2 chapter on page and request paths", async () => {
    for (const req of [undefined, request()]) {
      const access = await schoolAccess(req);
      assert.equal(access?.preview, false);
      assert.equal(access?.player.userId, "child-own");
      assert.deepEqual(access?.player.classScope, ["class-own"]);
    }
  });
  it("denies a child outside year 2 on page and request paths", async () => {
    fixture.grade = 1;
    assert.equal(await schoolAccess(), null);
    assert.equal(await schoolAccess(request()), null);
  });
  it("denies an unreleased chapter to a year 2 child", async () => {
    fixture.released = false;
    assert.equal(await schoolAccess(), null);
    assert.equal(await schoolAccess(request()), null);
  });
  it("denies an unknown class year instead of falling back to all years", async () => {
    fixture.grade = null;
    assert.equal(await schoolAccess(), null);
    assert.equal(await schoolAccess(request()), null);
  });
  it("never grants access when the class year cannot be loaded", async () => {
    fixture.gradeError = new Error("class storage unavailable");
    await assert.rejects(schoolAccess(), /class storage unavailable/);
    await assert.rejects(schoolAccess(request()), /class storage unavailable/);
  });
  for (const scope of [[], ["class-foreign"]]) {
    it(`denies page and request access for ${scope.length ? "foreign" : "empty"} class scope`, async () => {
      fixture.session!.user.scope = scope;
      assert.equal(await schoolAccess(), null);
      assert.equal(await schoolAccess(request()), null);
    });
  }
  it("lets a teacher preview an unreleased chapter without student identity", async () => {
    fixture.released = false;
    fixture.session = { user: { id: "teacher-own", classId: null, role: "teacher", scope: [] } };
    for (const req of [undefined, request()]) {
      const access = await schoolAccess(req);
      assert.equal(access?.preview, true);
      assert.equal(access?.player.userId, "teacher-own");
    }
  });
  it("denies an unrelated session and no session, even with forged development headers", async () => {
    fixture.session = { user: { id: "foreign", classId: null, role: "student", scope: [] } };
    assert.equal(await schoolAccess(request()), null);
    assert.equal(await schoolAccess(), null);
    fixture.session = null;
    assert.equal(await schoolAccess(request()), null);
    assert.equal(await schoolAccess(), null);
  });
});
