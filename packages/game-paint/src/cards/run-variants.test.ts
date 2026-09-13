import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import type { GameTaskV2 } from "@domigo/content-schema";
import { initRoute, nextTask, orderedTask, requestedTask, resolvePool } from "./routing.ts";
import { numberWheelForEncounter, numberWheelVariant, RUN_NUMBER_WORDS, runNumberAt, type RunWheelTask } from "./run-variants.ts";
const tasks: GameTaskV2[] = JSON.parse(readFileSync(new URL("../../../../content/corpus/stories/g1.st.lost-pages/paint/ch01.tasks.v2.json", import.meta.url), "utf8")).items;
const wheel = tasks.find((t): t is RunWheelTask => t.kind === "wheel")!;
const sequence = (seed: string | undefined, use = "boss", phase = "p4", skin = "tafel", n = 30) => {
  let st = initRoute(seed);
  return Array.from({ length: n }, () => {
    const r = nextTask(tasks, use, { phase, skin }, st);
    st = r.next;
    return r.task?.id;
  });
};
describe("explicit run-seeded card decks", () => {
  it("keeps identical seeded runs reproducible and makes different runs vary", () => {
    expect(sequence("a")).toEqual(sequence("a"));
    const openings = new Set(Array.from({ length: 24 }, (_, i) => sequence(String(i), "boss", "p4", "tafel", 3).join("|")));
    expect(openings.size).toBeGreaterThan(8);
  });
  it("serves every boss and moth card exactly once in every complete cycle", () => {
    for (const [use, phase, skin] of [["boss", "p4", "tafel"], ["quickfire", "p2", "moths"]]) {
      const ids = resolvePool(tasks, use!, { phase: phase!, skin }).pool.map(t => t.id).sort();
      const actual = sequence("fair", use, phase, skin, ids.length * 4);
      for (let cycle = 0; cycle < 4; cycle++) expect(actual.slice(cycle * ids.length, (cycle + 1) * ids.length).sort()).toEqual(ids);
    }
  });
  it("keeps other field routing and legacy states unchanged", () => {
    for (const [use, phase, skin] of [["encounter", "p1", "pencil"], ["door", "p2", "door"], ["rescue", "p2", "merle"]]) {
      expect(sequence("new", use, phase, skin)).toEqual(sequence(undefined, use, phase, skin));
    }
    expect(initRoute()).toEqual({ cursors: {} });
    expect(sequence(undefined)).toEqual(sequence(undefined));
  });
  it("isolates pool cursors and never mutates the held card or input state", () => {
    const st = initRoute("run");
    const first = nextTask(tasks, "boss", { phase: "p4", skin: "tafel" }, st);
    const unrelated = nextTask(tasks, "quickfire", { phase: "p2", skin: "moths" }, st);
    expect(nextTask(tasks, "boss", { phase: "p4", skin: "tafel" }, unrelated.next).task).toEqual(first.task);
    expect(st).toEqual({ cursors: {}, seed: "run" });
    // A retry uses the already-held task; neither pure selection nor inspection mutates it.
    const held = structuredClone(first.task);
    nextTask(tasks, "boss", { phase: "p4", skin: "tafel" }, first.next);
    expect(first.task).toEqual(held);
    expect(nextTask(tasks, "boss", { phase: "p4", skin: "tafel" }, st)).toEqual(first);
  });
  it("does not reorder explicit Merle rounds or replace a bound requested identity", () => {
    const rescue = resolvePool(tasks, "rescue", { phase: "p2", skin: "merle" }).pool;
    rescue.forEach((task, i) => expect(orderedTask(tasks, "rescue", { phase: "p2", skin: "merle" }, i)).toBe(task));
    const t = rescue[0]!;
    expect(requestedTask(tasks, { use: t.use, ctx: { type: "entity", id: "merle", skin: "merle", taskId: t.id } }, "p2")).toBe(t);
    expect(() => requestedTask(tasks, { use: t.use, ctx: { type: "entity", id: "other", skin: "moths", taskId: t.id } }, "p2")).toThrow();
  });
});
describe("number wheel families", () => {
  it("covers all 25 number-word pairs in both directions without stale hints", () => {
    const untouched = structuredClone(wheel);
    RUN_NUMBER_WORDS.forEach((word, i) => {
      for (const variant of ["digit-to-word", "word-to-digit"] as const) {
        const t = numberWheelVariant({ ...wheel, variant }, i + 1);
        expect(t.answer).toBe(variant === "digit-to-word" ? word : String(i + 1));
        expect(t.shown).toBe(variant === "digit-to-word" ? String(i + 1) : word);
        expect(t.values).toContain(t.answer);
        expect(new Set(t.values).size).toBe(25);
        expect(t.hints?.deWord).toBeUndefined();
        expect(t.hints?.deDesc).not.toMatch(/dreizehn|zwölf|vierzehn/);
      }
    });
    expect(wheel).toEqual(untouched);
  });
  it("gives three encounters different numbers and preserves retries across remounts", () => {
    for (let s = 0; s < 30; s++) {
      const numbers = Array.from({ length: 25 }, (_, i) => runNumberAt(String(s), "ch01:p2:moths", i));
      expect(new Set(numbers.slice(0, 3)).size).toBe(3);
      expect([...numbers].sort((a, b) => a - b)).toEqual(Array.from({ length: 25 }, (_, i) => i + 1));
    }
    const t = numberWheelForEncounter(wheel, "retry", "ch01:p2:moths", 1);
    expect(numberWheelForEncounter(wheel, "retry", "ch01:p2:moths", 1)).toEqual(t);
    expect(new Set(Array.from({ length: 20 }, (_, i) => runNumberAt(String(i), "ch01:p2:moths", 0))).size).toBeGreaterThan(5);
    expect(Array.from({ length: 10 }, (_, i) => runNumberAt("s", "other-corridor", i))).not.toEqual(Array.from({ length: 10 }, (_, i) => runNumberAt("s", "ch01:p2:moths", i)));
  });
  it("rejects invalid values and ordinals rather than inventing an answer", () => {
    for (const n of [0, 26, -1, 1.5, NaN]) expect(() => numberWheelVariant(wheel, n)).toThrow(RangeError);
    for (const n of [-1, 1.5, NaN, Infinity]) expect(() => runNumberAt("s", "room", n)).toThrow(RangeError);
  });
});
