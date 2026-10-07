import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { GameTasksFileV2, ItemRef } from "@domigo/content-schema";
import { paintAttemptBody } from "./attempt.ts";

const file = JSON.parse(fs.readFileSync(path.join(__dirname, "../../../../content/corpus/stories/g1.st.lost-pages/paint/ch01.tasks.v2.json"), "utf8"));
const tasks = GameTasksFileV2.parse(file).items;
const door = tasks.find(t => t.id === "g1.paint.ch01.door.p1.d1")!;
const context = { clientAttemptId: "22222222-2222-4222-8222-222222222222", openedAt: 1000, now: 2500, hintUsed: false };

describe("Paint raw attempt boundary", () => {
  it("keeps exactly six authored mappings through schema parsing", () => {
    expect(tasks.filter(t => t.corpusItem).map(t => [t.id, t.corpusItem]).sort()).toEqual([
      ["g1.paint.ch01.enc.pen.k1", "g1u01.gi.questions-personal-info.cp.001"],
      ["g1.paint.ch01.door.p1.d1", "g1u01.gi.imperatives.mc.001"],
      ["g1.paint.ch01.door.p1.d3", "g1u01.gi.questions-personal-info.mc.001"],
      ["g1.paint.ch01.door.p2.d3", "g1u01.gi.questions-personal-info.cp.001"],
      ["g1.paint.ch01.awk.merle.r4", "g1u01.gi.imperatives.cp.002"],
      ["g1.paint.ch01.boss.k3", "g1u01.gi.questions-personal-info.mc.001"],
    ].sort());
    expect(tasks.filter(t => !t.corpusItem)).toHaveLength(55);
  });
  it.each(["g1.paint.ch01.door.p1.d1", "g1u01.gi.imperatives.xx.001", "g5u01.w.book", "g1u01.gi.imperatives.mc.1"])("rejects a non-ItemRef corpusItem: %s", corpusItem => {
    expect(ItemRef.safeParse(corpusItem).success).toBe(false);
    expect(GameTasksFileV2.safeParse({ ...file, items: [{ ...door, corpusItem }] }).success).toBe(false);
  });
  it("sends the raw chosen answer, corpus id and wall time; no local tier, XP or owner", () => {
    expect(paintAttemptBody(door, { picked: "Open!" }, context)).toEqual({
      clientAttemptId: context.clientAttemptId, itemId: "g1u01.gi.imperatives.mc.001",
      mode: "game:g1", input: { kind: "choice", value: "Open!" }, latencyMs: 1500, hintUsed: false,
    });
  });
  it("preserves a wrong choice as evidence instead of substituting the answer", () => {
    if (door.kind !== "choice") throw new Error("choice fixture changed");
    const wrong = door.options.find(v => v !== door.answer)!;
    expect(paintAttemptBody(door, { picked: wrong }, context)?.input).toEqual({ kind: "choice", value: wrong });
  });
  it("keeps reference use and elapsed reading time", () => {
    if (door.kind !== "choice") throw new Error("choice fixture changed");
    const body = paintAttemptBody(door, { picked: door.answer }, { ...context, now: 30000, hintUsed: true });
    expect(body?.hintUsed).toBe(true);
    expect(body?.latencyMs).toBe(29000);
  });
  it("clamps a backwards wall clock to zero", () => {
    if (door.kind !== "choice") throw new Error("choice fixture changed");
    expect(paintAttemptBody(door, { picked: door.answer }, { ...context, now: 500 })?.latencyMs).toBe(0);
  });
  it.each([null, undefined, {}, { picked: null }, { picked: 1 }, { picked: "not an offered option" }])("does not invent an attempt before a real selection: %j", state => {
    expect(paintAttemptBody(door, state, context)).toBeNull();
  });
  it("leaves all 55 unmapped cards world-only", () => {
    for (const task of tasks.filter(t => !t.corpusItem)) {
      expect(paintAttemptBody(task, { picked: task.kind === "choice" ? task.options[0] : "a book" }, context), task.id).toBeNull();
    }
  });
  it("does not book other card kinds even if a corpus id is supplied", () => {
    for (const task of tasks.filter(t => t.kind !== "choice")) {
      expect(paintAttemptBody({ ...task, corpusItem: door.corpusItem }, { picked: "a book" }, context), task.id).toBeNull();
    }
  });
});

// The package has no browser test dependency. These guards police placement;
// actual click/retry/reference/offline behaviour is exercised in the browser proof.
const host = fs.readFileSync(path.join(__dirname, "CardHost.tsx"), "utf8");
const hostErrors = (src: string): string[] => {
  const out: string[] = [];
  const dispatch = src.slice(src.indexOf("const dispatch:"), src.indexOf("const dismiss ="));
  const call = dispatch.indexOf("onAttempt?.(");
  const book = dispatch.indexOf("bookedRef.current = true;");
  const correct = dispatch.indexOf('if (g === "correct") {');
  if ((src.match(/onAttempt\?\.\(/g) ?? []).length !== 1) out.push("one-call");
  if (!dispatch.includes('g !== "pending" && !bookedRef.current') || book < 0 || call <= book || correct <= call) out.push("first-before-world");
  if (/\bawait\b/.test(dispatch) || !dispatch.includes("void onAttempt?.(b).catch(() => {});")) out.push("nonblocking");
  if (!src.includes("useState(() => crypto.randomUUID())")) out.push("opening-id");
  if (!src.includes("if (suspended) hintUsedRef.current = true;") || !dispatch.includes("hintUsed: hintUsedRef.current")) out.push("reference-used");
  return out;
};
const networkErrors = (src: string): boolean => /\bfetch\s*\(|\bindexedDB\b/.test(src);

describe("Paint attempt source guards and their red-light probes", () => {
  it("books once behind the latch before either outcome, with no wait", () => {
    expect(hostErrors(host)).toEqual([]);
  });
  it.each([
    ["one-call", (s: string) => s.replace("onAttempt?.(b)", "onAttempt?.(b); onAttempt?.(b)")],
    ["first-before-world", (s: string) => s.replace('g !== "pending" && !bookedRef.current', 'g === "correct"')],
    ["first-before-world", (s: string) => s.replace("bookedRef.current = true;", "bookedRef.current = false;")],
    ["nonblocking", (s: string) => s.replace("void onAttempt?.(b)", "await onAttempt?.(b)")],
    ["opening-id", (s: string) => s.replace("useState(() => crypto.randomUUID())", 'useState(() => "same-for-every-opening")')],
    ["reference-used", (s: string) => s.replace("if (suspended) hintUsedRef.current = true;", "hintUsedRef.current = false;")],
  ] as const)("tamper is red: %s", (law, mutate) => {
    const damaged = mutate(host);
    expect(damaged).not.toBe(host);
    expect(hostErrors(damaged)).toContain(law);
  });
  it("keeps every production card module free of network and outbox storage", () => {
    const sources = fs.readdirSync(__dirname, { recursive: true }).map(String)
      .filter(name => /\.tsx?$/.test(name) && !name.includes(".test."));
    expect(sources.length).toBeGreaterThan(10);
    for (const name of sources) expect(networkErrors(fs.readFileSync(path.join(__dirname, name), "utf8")), name).toBe(false);
  });
  it.each(['fetch("/api/attempts")', 'indexedDB.open("attempts")'])("network tamper is red: %s", src => {
    expect(networkErrors(src)).toBe(true);
  });
});
