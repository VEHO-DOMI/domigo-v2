// cgo-047 · lib/class-wall.ts — the assignment picker shows only classes in the
// session's scope (no foreign v1 class names), and picker and door share it.
import assert from "node:assert/strict";
import fs from "node:fs";
import { describe, it } from "node:test";
import { classScope } from "@domigo/db";
import { pickableClasses } from "./class-wall.ts";

const rows = [
  { id: "v2-own", name: "2A", grade: 2 },
  { id: "v1-foreign", name: "4C (alt)", grade: 4 },
  { id: "v1-own", name: "1B (alt)", grade: 1 },
];

describe("pickableClasses", () => {
  it("keeps only classes inside the scope", () => {
    assert.deepEqual(pickableClasses(rows, classScope(["v2-own", "v1-own"])).map((r) => r.id), ["v2-own", "v1-own"]);
  });
  it("shows nothing under an empty scope", () => {
    assert.deepEqual(pickableClasses(rows, classScope([])), []);
  });
});

describe("every assignment class list goes through the wall", () => {
  for (const file of ["../app/admin/assignments/new/page.tsx", "../app/admin/assignments/page.tsx", "../app/api/admin/assignments/route.ts"]) {
    it(file.replace("../", ""), () => {
      const src = fs.readFileSync(new URL(file, import.meta.url), "utf8");
      assert.match(src, /assignableClasses\(teacher\)/);
      assert.doesNotMatch(src, /\blistClasses(InScope)?\(/, "no unfiltered class list");
    });
  }
  it("a foreign class at the door is a 403, never a 500", () => {
    const src = fs.readFileSync(new URL("../app/api/admin/assignments/route.ts", import.meta.url), "utf8");
    assert.match(src, /error: "not_your_class" \}, \{ status: 403 \}/);
  });
});
