import assert from "node:assert/strict";
import { it } from "node:test";
import fs from "node:fs";
import { AVATAR_NAMES, avatarPath } from "./avatar.ts";
it("fifty named real PNG avatars, paths bounded to the fixed catalog", () => {
  assert.equal(AVATAR_NAMES.length, 50);
  for (let n = 1; n <= 50; n++) {
    const path = new URL(`../public${avatarPath(n)}`, import.meta.url);
    const bytes = fs.readFileSync(path);
    assert.equal(bytes.subarray(1, 4).toString(), "PNG");
    assert.ok(bytes.length > 0 && bytes.length < 100000);
  }
  assert.equal(avatarPath(0), avatarPath(1)); assert.equal(avatarPath(51), avatarPath(1));
});

// Actual identity resolver, with synthetic session/storage boundary only.
const { fixture, resetSchoolFixture } = await import("../scripts/lib/school-test-harness.mjs");
const { resolveStudentView, trainerGrade } = await import("./student-view.ts");
it("trainer year is bound to the child; an unknown or failed year never chooses another", async () => {
  resetSchoolFixture();
  fixture.session = { user: { id: "test-child", role: "student", classId: "test-class", scope: ["test-class"] } };
  fixture.grade = 2;
  assert.equal(trainerGrade((await resolveStudentView("4"))!), 2);
  fixture.gradeError = new Error("offline");
  assert.equal(trainerGrade((await resolveStudentView("4"))!), null);
  fixture.gradeError = null; fixture.grade = null;
  assert.equal(trainerGrade((await resolveStudentView("4"))!), null);
  fixture.session = { user: { id: "test-teacher", role: "teacher", classId: null, scope: [] } };
  assert.equal(trainerGrade((await resolveStudentView("4"))!), 4);
});
