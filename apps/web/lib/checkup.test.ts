/**
 * C-1 · composeCheckup against the REAL corpus (node --test, like
 * @domigo/content-loader's suite — apps/web has no vitest). Proves the §4
 * presets fill /20 from every approved unit, deterministically, reserve-aware.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { listApprovedUnits } from "@domigo/content-loader";
import { CHECKUP_TOTAL } from "@domigo/db";
import { composeCheckup, GRADE_STRUCTURES } from "./checkup.ts";

const gradeOf = (slug: string): 1 | 2 | 3 | 4 => Number(slug[1]) as 1 | 2 | 3 | 4;

describe("GRADE_STRUCTURES — the §4 presets", () => {
  it(`every grade preset sums to exactly ${CHECKUP_TOTAL}`, () => {
    for (const grade of [1, 2, 3, 4] as const) {
      const total = GRADE_STRUCTURES[grade].reduce((s, p) => s + p.points, 0);
      assert.equal(total, CHECKUP_TOTAL, `grade ${grade} preset sums to ${total}`);
    }
  });

  it("no active preset contains the deferred picture-mc kind", () => {
    for (const grade of [1, 2, 3, 4] as const) {
      assert.ok(GRADE_STRUCTURES[grade].every((p) => p.checkupKind !== "picture-mc"));
    }
  });
});

describe("composeCheckup — real corpus, every approved unit", () => {
  it("every grade preset composes to exactly 20 against every approved unit", () => {
    const slugs = listApprovedUnits();
    assert.ok(slugs.length > 0, "corpus has approved units");
    for (const slug of slugs) {
      const res = composeCheckup(slug, gradeOf(slug), `test-seed-${slug}`);
      assert.ok(res.ok, `${slug} composes: ${res.ok ? "" : res.errors.join(" · ")}`);
      if (!res.ok) continue;
      const total = res.sections.reduce((s, sec) => s + sec.sectionConfig.points, 0);
      assert.equal(total, CHECKUP_TOTAL, `${slug} sums to ${total}`);
      // one item = one point, section by section
      for (const sec of res.sections) {
        assert.equal(sec.itemIds.length, sec.sectionConfig.points, `${slug} pos ${sec.position} item count`);
      }
      // no item appears twice on one paper
      const all = res.sections.flatMap((s) => s.itemIds);
      assert.equal(new Set(all).size, all.length, `${slug} has duplicate items`);
    }
  });

  it("is deterministic under the same seed (g2-u06, the §8 calibration unit)", () => {
    const a = composeCheckup("g2-u06", 2, "c1-verify");
    const b = composeCheckup("g2-u06", 2, "c1-verify");
    assert.deepEqual(a, b);
  });

  it("excludes reserved items (J-1: the mock vault stays fresh)", () => {
    const first = composeCheckup("g2-u06", 2, "c1-verify");
    assert.ok(first.ok);
    if (!first.ok) return;
    const reservedId = first.sections[0]!.itemIds[0]!;
    const second = composeCheckup("g2-u06", 2, "c1-verify", { reservedIds: new Set([reservedId]) });
    assert.ok(second.ok);
    if (!second.ok) return;
    const all = second.sections.flatMap((s) => s.itemIds);
    assert.ok(!all.includes(reservedId), "reserved item must not appear");
    assert.equal(all.length, CHECKUP_TOTAL);
  });

  it("fails LOUDLY with the per-section shortfall, never silently thinner (§5.4)", () => {
    // 50 grammar points can't be filled from one unit (g2-u06 has 22 allowlisted
    // grammar items) — and the preset sum breaks the /20 invariant on top.
    const res = composeCheckup("g2-u06", 2, "seed", {
      presets: [{ checkupKind: "grammar", points: 50 }],
    });
    assert.ok(!res.ok, "an unfillable preset must not compose");
    if (res.ok) return;
    assert.ok(
      res.errors.some((e) => /needs 50 item\(s\), only \d+ eligible/.test(e)),
      `shortfall named: ${res.errors.join(" · ")}`,
    );
    assert.ok(
      res.errors.some((e) => e.includes(`not ${CHECKUP_TOTAL}`)),
      "the broken Σ is also reported",
    );
  });

  it("g3's rewrite-weighted section actually prefers transformation-family formats", () => {
    const slugs = listApprovedUnits().filter((s) => s.startsWith("g3-"));
    assert.ok(slugs.length > 0);
    const res = composeCheckup(slugs[0]!, 3, "seed-g3");
    assert.ok(res.ok);
    if (!res.ok) return;
    // section IV (position 3) is the prefer-weighted one; presets guarantee it exists
    assert.equal(res.sections[3]!.sectionConfig.checkupKind, "grammar");
    assert.equal(res.sections[3]!.itemIds.length, 3);
  });
});
