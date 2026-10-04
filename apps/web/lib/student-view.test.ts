// cgo-047 · lib/student-view.ts through the REAL identity (auth + dev fallback),
// with only the session, the class year and storage replaced (school harness).
import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
import { fixture, resetSchoolFixture } from "../scripts/lib/school-test-harness.mjs";
const { isPreview, previewGradesFrom, resolveStudentView, yearRedirect } = await import("./student-view.ts");

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
    // The dev fallback must stay dead behind its guard: the harness runs as
    // VERCEL_ENV === "production", so forged dev ids below resolve nobody.
    assert.equal(process.env.VERCEL_ENV === "production", true);
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

// cgo-047 Welle 2 · Minor 3: the year wall and the preview flag of the game
// pages (hub, chapter, world, arcade) as behaviour, through the real identity.
describe("yearRedirect + isPreview — what the game pages do with a viewer", () => {
  it("a year-2 child stays on year 2 and is sent home from year 3", async () => {
    fixture.session = child();
    const view = await resolveStudentView();
    assert.equal(yearRedirect(view, 2), null);
    assert.equal(yearRedirect(view, 3), "/play/2");
    assert.equal(isPreview(view), false);
  });
  it("a child whose class year is unknown gets no year at all", async () => {
    fixture.session = child();
    fixture.grade = null;
    const view = await resolveStudentView();
    for (const g of [1, 2, 3, 4]) assert.equal(yearRedirect(view, g), "/home");
  });
  it("a teacher previews every year and is a preview", async () => {
    fixture.session = teacher();
    const view = await resolveStudentView();
    for (const g of [1, 2, 3, 4]) assert.equal(yearRedirect(view, g), null);
    assert.equal(isPreview(view), true);
  });
  it("a teacher's narrowed preview (?jahrgang=3) is never walled out of another year", async () => {
    fixture.session = teacher();
    const narrowed = await resolveStudentView("3");
    assert.deepEqual(narrowed?.grades, [3]);
    for (const g of [1, 2, 4]) assert.equal(yearRedirect(narrowed, g), null);
  });
  it("nobody is sent to sign in and is never a preview", async () => {
    const view = await resolveStudentView();
    assert.equal(yearRedirect(view, 1), "/signin");
    assert.equal(isPreview(view), false);
  });
});
