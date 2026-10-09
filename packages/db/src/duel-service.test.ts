import { describe, expect, it } from "vitest";
import type { Db } from "./index.ts";
import { classScope } from "./scope.ts";
import { completeDuel, createDuel, duelContext, emptyArena, getDuel, listDuels, openRound, selectDuelQuestions, whoseTurn } from "./duel-service.ts";
import { listApprovedUnits, loadUnit } from "../../content-loader/src/index.ts";
import { gradeVocab } from "@domigo/engine";
import type { DuelRound } from "./schema.ts";
const id = "00000000-0000-4000-8000-000000000001";
const round = (a: boolean[] = [], b: boolean[] = []): DuelRound => ({ unitKey: "g1-u01", questions: [], p1Answers: a, p2Answers: b });

describe("duel fake boundaries and pure rules", () => {
  it("D01 empty scope performs no database reads or writes", async () => {
    const db = new Proxy({}, { get() { throw Error("unexpected database access"); } }) as Db;
    expect(await listDuels(db, classScope([]), id)).toEqual(emptyArena());
    await expect(createDuel(db, classScope([]), id, 1, "")).rejects.toThrow("no class scope");
    await expect(openRound(db, classScope([]), id, id, "g1-u01", [])).rejects.toThrow("no class scope");
  });
  it("D02 unavailable storage returns anonymous empty arena", async () => {
    const db = { select: () => { throw Error("synthetic private identity"); } } as unknown as Db;
    expect(await listDuels(db, classScope([id]), id)).toEqual(emptyArena(true));
    await expect(getDuel(db, classScope([id]), id, "not-a-duel")).rejects.toMatchObject({ status: 403 });
  });
  it("D03 coordinates bind mode, duel, round and question; reject malformed or out-of-range", () => {
    const valid = { duelId: id, round: 0, question: 0 };
    expect(duelContext(`duel:${id}`, valid)).toEqual(valid);
    for (const c of [null, {}, { ...valid, duelId: "no" }, { ...valid, round: -1 }, { ...valid, round: 5 }, { ...valid, question: 3 }, { ...valid, question: .5 }]) expect(() => duelContext(`duel:${id}`, c)).toThrow();
    expect(() => duelContext("practice", valid)).toThrow();
  });
  it("D04 picker answers first, catch-up follows, then the picker alternates", () => {
    expect(whoseTurn([])).toBe("p1");
    expect(whoseTurn([round()])).toBe("p1");
    expect(whoseTurn([round([true, false])])).toBe("p1");
    expect(whoseTurn([round([true, false, true])])).toBe("p2");
    expect(whoseTurn([round([true, false, true], [true, true, true])])).toBe("p2");
    expect(whoseTurn([round([true, true, true], [true, true, true]), round([], [true, true, true])])).toBe("p1");
    expect(whoseTurn(Array.from({ length: 5 }, () => round([true, false, true], [true, true, false])))).toBe("complete");
  });
  it("D05 five complete rounds derive max fifteen, winner and draw without bonus fields", () => {
    const rounds = Array.from({ length: 5 }, () => round([true, true, true], [true, false, false]));
    expect(completeDuel(rounds, "a", "b")).toEqual({ p1Score: 15, p2Score: 5, status: "complete", winner: "a" });
    expect(completeDuel(rounds.map(r => ({ ...r, p1Answers: r.p2Answers })), "a", "b").winner).toBe(null);
    expect(completeDuel(rounds.map(r => ({ ...r, p1Answers: [false, false, false] })), "a", "b").winner).toBe("b");
    expect(completeDuel(rounds.slice(0, 4), "a", "b")).toMatchObject({ status: "active", winner: null });
    expect(completeDuel([...rounds.slice(0, 4), round([true, true], [true, true, true])], "a", "b").status).toBe("active");
  });
  it("D06 all four grades draw three unique questions/four choices deterministically; one accepted answer, no keys", () => {
    for (const grade of [1, 2, 3, 4]) {
      const slug = `g${grade}-u01`, pool = loadUnit(slug).vocab;
      const questions = selectDuelQuestions(pool, grade, slug, "synthetic-seed", new Set());
      expect(questions).toHaveLength(3);
      expect(selectDuelQuestions(pool, grade, slug, "synthetic-seed", new Set())).toEqual(questions);
      expect(new Set(questions.map(q => q.itemId)).size).toBe(3);
      for (const question of questions) {
        expect(Object.keys(question).sort()).toEqual(["itemId", "options"]);
        expect(new Set(question.options).size).toBe(4);
        const item = pool.find(i => i.id === question.itemId)!;
        expect(question.options.filter(o => gradeVocab(item, o, "deToEn").tier === "correct")).toHaveLength(1);
        expect(question.options.filter(o => gradeVocab(item, o, "deToEn").tier === "wrong")).toHaveLength(3);
      }
    }
  });
  it("D07 selection excludes other grades/reserved questions and refuses fewer than three", () => {
    const own = loadUnit("g1-u01").vocab, foreign = loadUnit("g2-u01").vocab;
    const all = [...foreign, ...own], reserved = new Set(own.slice(0, -2).map(i => i.id));
    expect(() => selectDuelQuestions(all, 1, "g2-u01", "seed", new Set())).toThrow("duel_wrong_grade");
    expect(() => selectDuelQuestions(all, 1, "g1-u01", "seed", reserved)).toThrow("duel_chapter_empty");
    const selected = selectDuelQuestions(all, 1, "g1-u01", "seed", new Set());
    const blocked = new Set(selected.map(q => q.itemId));
    expect(selectDuelQuestions(all, 1, "g1-u01", "seed", blocked).every(q => q.itemId.startsWith("g1u01.w.") && !blocked.has(q.itemId))).toBe(true);
  });
  it("D08 corpus sweep: every offered Chapter has fifteen safe questions over five seeds", () => {
    let offered = 0;
    for (const slug of listApprovedUnits()) {
      const pool = loadUnit(slug).vocab, grade = Number(slug[1]);
      if (pool.length < 3) continue;
      for (let seed = 0; seed < 5; seed++) {
        const questions = selectDuelQuestions(pool, grade, slug, `duel:${seed}`, new Set());
        expect(questions).toHaveLength(3);
        for (const q of questions) {
          const item = pool.find(i => i.id === q.itemId)!;
          expect(q.options.map(o => gradeVocab(item, o, "deToEn").tier).sort()).toEqual(["correct", "wrong", "wrong", "wrong"]);
        }
      }
      offered++;
    }
    expect(offered).toBeGreaterThanOrEqual(20);
  });
});
