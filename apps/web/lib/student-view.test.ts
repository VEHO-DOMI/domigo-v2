// cgo-047 · lib/student-view.ts through the REAL identity (auth + dev fallback),
// with only the session, the class year and storage replaced (school harness).
import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
import { fixture, resetSchoolFixture } from "../scripts/lib/school-test-harness.mjs";
const { previewGradesFrom, resolveStudentView } = await import("./student-view.ts");

const child = () => ({ user: { id: "child-own", classId: "class-own", role: "student", scope: ["class-own"] } });
const teacher = () => ({ user: { id: "teacher-own", classId: null, role: "teacher", scope: ["class-own"] } });

beforeEach(() => {
  resetSchoolFixture();
  delete process.env.DEV_USER_ID;
  delete process.env.DEV_CLASS_ID;
  delete process.env.DEV_TEACHER_ID;
});

describe("previewGradesFrom — the teacher's ?jahrgang=", () => {
  it("opens all four years without a value", () => {
    assert.deepEqual(previewGradesFrom(undefined), [1, 2, 3, 4]);
  });
  it("narrows to exactly one valid year", () => {
    assert.deepEqual(previewGradesFrom("3"), [3]);
    assert.deepEqual(previewGradesFrom(["2", "4"]), [2]);
  });
  it("never opens an invented year and never empties the view", () => {
    for (const raw of ["7", "0", "", "1,2", "g3", 3, null]) assert.deepEqual(previewGradesFrom(raw), [1, 2, 3, 4]);
  });
});

describe("resolveStudentView — who sees the student side, as what", () => {
  it("a child sees exactly its own class's year, as a student", async () => {
    fixture.session = child();
    const view = await resolveStudentView();
    assert.equal(view?.kind, "student");
    assert.deepEqual(view?.grades, [2]);
  });
  it("a child can never switch years or become a preview through ?jahrgang=", async () => {
    fixture.session = child();
    const view = await resolveStudentView("3");
    assert.equal(view?.kind, "student");
    assert.deepEqual(view?.grades, [2]);
  });
  it("fails closed for a known class whose year is unknown", async () => {
    fixture.session = child();
    fixture.grade = null;
    const view = await resolveStudentView();
    assert.equal(view?.kind, "student");
    assert.deepEqual(view?.grades, []);
  });
  it("keeps the documented all-years degrade only for a storage hiccup", async () => {
    fixture.session = child();
    fixture.gradeError = new Error("class storage unavailable");
    assert.deepEqual((await resolveStudentView())?.grades, [1, 2, 3, 4]);
  });
  it("a teacher previews all four years, or the one she asks for", async () => {
    fixture.session = teacher();
    const all = await resolveStudentView();
    assert.equal(all?.kind, "preview");
    assert.deepEqual(all?.grades, [1, 2, 3, 4]);
    assert.deepEqual((await resolveStudentView("4"))?.grades, [4]);
    assert.deepEqual((await resolveStudentView("9"))?.grades, [1, 2, 3, 4]);
  });
  it("nobody signed in sees nothing, and dev identities stay dead in production", async () => {
    assert.equal(await resolveStudentView(), null);
    process.env.DEV_TEACHER_ID = "teacher-forged";
    process.env.DEV_USER_ID = "child-forged";
    process.env.DEV_CLASS_ID = "class-forged";
    assert.equal(await resolveStudentView(), null);
  });
  it("a session that is neither child nor teacher sees nothing", async () => {
    fixture.session = { user: { id: "someone", classId: null, role: "student", scope: [] } };
    assert.equal(await resolveStudentView(), null);
  });
});
