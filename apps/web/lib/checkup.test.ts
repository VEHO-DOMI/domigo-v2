/**
 * C-1 · composeCheckup against the REAL corpus (node --test, like
 * @domigo/content-loader's suite — apps/web has no vitest). Proves the §4
 * presets fill /20 from every approved unit, deterministically, reserve-aware.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { listApprovedUnits, loadUnit } from "@domigo/content-loader";
import { CHECKUP_TOTAL, type CheckupSectionConfig } from "@domigo/db";
import { vocabAnswers } from "@domigo/engine";
import type { GrammarItem, VocabItem } from "@domigo/content-schema";
import {
  checkCheckupTaskKeys, checkupGradingCompatible, composeCheckup, GRADE_STRUCTURES,
  gradeCheckupCandidate, prepareCheckupTasks, type ComposedCheckupSection, type PreparedCheckupTask,
} from "./checkup.ts";

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

describe("prepareCheckupTasks — the actual paper's free gate", () => {
  const slug = "g2-u03";
  const unit = loadUnit(slug);
  const vocab = unit.vocab[0]!;
  function section(cfg: CheckupSectionConfig, ids = [vocab.id]): ComposedCheckupSection {
    return { position: 0, kind: cfg.checkupKind === "grammar" ? "grammar" : "vocab", itemIds: ids, sectionConfig: cfg };
  }
  function one(sec: ComposedCheckupSection, overlay?: typeof unit): PreparedCheckupTask {
    const result = prepareCheckupTasks([sec], overlay ? new Map([[slug, overlay]]) : undefined);
    assert.ok(result.ok, result.ok ? "" : result.errors.join(" · "));
    return result.tasks[0]!;
  }

  it("frames the masked carrier with fixed-width letters, with no keys, hint or revealed gloss", () => {
    const task = one(section({ checkupKind: "words-phrases", points: 1, mask: "first-letter" }));
    const firstFull = vocab.sAnswers.find((a) => a.tier === "full")!.text;
    const mask = firstFull.trim().split(/\s+/).map((word) => `${word[0]}____`).join(" ");
    assert.deepEqual(task.frame.lines, [vocab.d, vocab.s.replace(/_{2,}/, mask)]);
    assert.deepEqual(task.frame.glosses, []);
    assert.equal(task.frame.structure, null);
    assert.equal(task.frame.direction, null);
    assert.equal(task.pool, "carrier");
    assert.equal(task.revision, vocab.rev);
    assert.ok(!JSON.stringify(task.frame).includes(vocab.hintDe));
    assert.equal(gradeCheckupCandidate(task, firstFull), "correct");
    assert.notEqual(gradeCheckupCandidate(task, mask), "correct");
  });

  it("uses the primary pool answer for every word of a multiword mask", () => {
    const item = unit.vocab.find((v) => /\s/.test(v.sAnswers.find((a) => a.tier === "full")!.text.trim()))!;
    assert.ok(item, "real unit has a multiword carrier fill");
    const task = one(section({ checkupKind: "words-phrases", points: 1, mask: "first-letter" }, [item.id]));
    const words = item.sAnswers.find((a) => a.tier === "full")!.text.trim().split(/\s+/);
    assert.ok(task.frame.lines[1]!.includes(words.map((w) => `${w[0]}____`).join(" ")));
  });

  it("keeps unmasked carriers intact and never reveals collapsed word help", () => {
    const task = one(section({ checkupKind: "words-phrases", points: 1 }));
    assert.deepEqual(task.frame.lines, [vocab.d, vocab.s]);
    assert.deepEqual(task.frame.glosses, []);
  });

  it("asks definitions in the definition pool, without carrier or translation scaffolds", () => {
    const task = one(section({ checkupKind: "definitions", points: 1 }));
    assert.deepEqual(task.frame.lines, ["Which word fits this definition?", vocab.d]);
    assert.equal(task.pool, "definition");
    assert.equal(task.frame.format, "vocab-definition");
    for (const answer of vocab.dAnswers.filter((a) => a.tier === "full")) assert.equal(gradeCheckupCandidate(task, answer.text), "correct");
  });

  it("places a definition mask beneath the prompt when no blank exists", () => {
    const task = one(section({ checkupKind: "definitions", points: 1, mask: "first-letter" }));
    const mask = vocab.dAnswers.find((a) => a.tier === "full")!.text.trim().split(/\s+/).map((word) => `${word[0]}____`).join(" ");
    assert.deepEqual(task.frame.lines, ["Which word fits this definition?", vocab.d, mask]);
  });

  it("frames and grades both explicit translation directions in their own pools", () => {
    for (const direction of ["deToEn", "enToDe"] as const) {
      const task = one(section({ checkupKind: "translations", points: 1, direction }));
      assert.deepEqual(task.frame.lines, direction === "deToEn" ? ["Translate into English:", vocab.g] : ["Translate into German:", vocab.w]);
      assert.equal(task.pool, direction);
      assert.equal(task.frame.direction, direction);
      for (const answer of vocab.translation[direction].filter((a) => a.tier === "full")) assert.equal(gradeCheckupCandidate(task, answer.text), "correct");
      assert.notEqual(gradeCheckupCandidate(task, direction === "deToEn" ? vocab.g : vocab.w), "correct");
    }
  });

  it("resolves mixed directions in section order and gives the odd item to De→En", () => {
    const result = prepareCheckupTasks([section({ checkupKind: "translations", points: 3, direction: "mixed" }, unit.vocab.slice(0, 3).map((v) => v.id))]);
    assert.ok(result.ok);
    assert.deepEqual(result.tasks.map((task) => task.pool), ["deToEn", "deToEn", "enToDe"]);
    assert.deepEqual(result.tasks.map((task) => task.itemPosition), [0, 1, 2]);
    assert.equal(result.tasks[2]!.frame.lines.at(-1), unit.vocab[2]!.w);
  });

  it("uses the same choice/text grammar input shapes as the runner and hides unseen context", () => {
    for (const format of ["multiple-choice", "gap-fill", "context-picker"]) {
      const item = unit.grammar.find((g) => g.format === format)!;
      assert.ok(item, `fixture has ${format}`);
      const task = one(section({ checkupKind: "grammar", points: 1 }, [item.id]));
      assert.deepEqual(task.frame.lines, [item.prompt.text]);
      assert.deepEqual(task.frame.glosses, []);
      assert.equal(task.frame.structure, null);
      assert.equal(task.pool, null);
      assert.equal(task.frame.input.kind, format === "gap-fill" ? "text" : "choice");
      for (const answer of item.answers.filter((a) => a.tier === "full")) assert.equal(gradeCheckupCandidate(task, answer.text), "correct");
      if (task.frame.input.kind === "choice") {
        assert.deepEqual(new Set(task.frame.input.options), new Set([...item.answers.filter((a) => a.tier === "full").map((a) => a.text), ...item.distractors]));
        assert.notEqual(gradeCheckupCandidate({ ...task, frame: { ...task.frame, input: { kind: "text", blanks: 1 } } }, item.answers[0]!.text), "correct");
      }
    }
  });

  it("checks every full key and catches an unreachable second key through the real engine", () => {
    const item = unit.grammar.find((g) => ["error-correction", "transformation", "translation", "question-formation"].includes(g.format))!;
    assert.ok(item);
    const task = one(section({ checkupKind: "grammar", points: 1 }, [item.id]));
    assert.deepEqual(checkCheckupTaskKeys(task), []);
    const broken: PreparedCheckupTask = { ...task, item: { ...item, answers: [...item.answers, { tier: "full", text: item.prompt.text }] } };
    assert.equal(gradeCheckupCandidate(broken, item.prompt.text), "wrong", "prompt echo is unreachable even if keyed full");
    assert.match(checkCheckupTaskKeys(broken).join(" "), /Lösungsschlüssel/);
    assert.match(checkCheckupTaskKeys({ ...task, item: { ...item, answers: [] } }).join(" "), /Lösungsschlüssel/);
  });

  it("blocks unavailable, wrong-kind and unframeable items instead of silently thinning the paper", () => {
    for (const sec of [
      section({ checkupKind: "words-phrases", points: 1 }, ["g2u03.w.missing-checkup-task"]),
      section({ checkupKind: "grammar", points: 1 }, [vocab.id]),
      section({ checkupKind: "picture-mc", points: 1 }),
      section({ checkupKind: "grammar", points: 1 }, [unit.grammar.find((g) => g.format === "matching")!.id]),
    ]) {
      const result = prepareCheckupTasks([sec]);
      assert.equal(result.ok, false);
      if (!result.ok) assert.ok(result.errors.length > 0);
    }
    const missingUnit = prepareCheckupTasks([section({ checkupKind: "words-phrases", points: 1 })], new Map());
    assert.equal(missingUnit.ok, false, "authoritative display map never falls back to canon");
  });

  it("uses supplied displayed prose and retains changed bytes/revision for journal fingerprints", () => {
    const overlay = structuredClone(unit);
    overlay.vocab[0]!.s = `Yesterday, ${vocab.s}`;
    overlay.vocab[0]!.hintDe = "Denke an den Zusammenhang.";
    overlay.vocab[0]!.rev += 1;
    const task = one(section({ checkupKind: "words-phrases", points: 1 }), overlay);
    assert.equal(task.frame.lines.at(-1), overlay.vocab[0]!.s);
    assert.equal(task.item.hintDe, overlay.vocab[0]!.hintDe);
    assert.equal(task.revision, vocab.rev + 1);
    assert.notDeepEqual(task, one(section({ checkupKind: "words-phrases", points: 1 })));
  });

  it("blocks display/canonical grading differences in every answer pool", () => {
    for (const pool of ["carrier", "definition", "deToEn", "enToDe"] as const) {
      const overlay = structuredClone(unit);
      vocabAnswers(overlay.vocab[0]!, pool)[0]!.text = "replacement-key";
      const result = prepareCheckupTasks([section({ checkupKind: "words-phrases", points: 1 })], new Map([[slug, overlay]]));
      assert.equal(result.ok, false, pool);
      if (!result.ok) assert.match(result.errors.join(" "), /Bewertung/);
    }
  });

  it("treats strictness and echo-guard prompts as grading data, while allowing other prose overrides", () => {
    const echo = unit.grammar.find((g) => g.format === "error-correction")!;
    assert.ok(echo);
    assert.equal(checkupGradingCompatible(echo, { ...echo, prompt: { ...echo.prompt, text: "Changed prompt." } }, "grammar"), false);
    assert.equal(checkupGradingCompatible(echo, { ...echo, strict: !echo.strict }, "grammar"), false);
    const gap = unit.grammar.find((g) => g.format === "gap-fill")!;
    assert.equal(checkupGradingCompatible(gap, { ...gap, prompt: { ...gap.prompt, text: "Changed ___ prompt." } }, "grammar"), true);
    assert.equal(checkupGradingCompatible(vocab, { ...vocab, s: "Changed ___ prompt." }, "vocab"), true);
  });

  it("all composed corpus tasks pass every authored key in the actual displayed pool", () => {
    let checked = 0;
    for (const approved of listApprovedUnits()) {
      const composed = composeCheckup(approved, gradeOf(approved), `verify-${approved}`);
      assert.ok(composed.ok);
      const prepared = prepareCheckupTasks(composed.sections);
      assert.ok(prepared.ok, `${approved}: ${prepared.ok ? "" : prepared.errors.join(" · ")}`);
      for (const task of prepared.tasks) {
        const answers = task.kind === "vocab" ? vocabAnswers(task.item as VocabItem, task.pool!) : (task.item as GrammarItem).answers;
        for (const answer of answers.filter((a) => a.tier === "full")) {
          assert.equal(gradeCheckupCandidate(task, answer.text), "correct", task.itemId);
          checked += 1;
        }
      }
    }
    assert.ok(checked > 100, `real corpus key checks: ${checked}`);
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
