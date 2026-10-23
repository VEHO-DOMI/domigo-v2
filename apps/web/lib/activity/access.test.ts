import assert from "node:assert/strict";
import { it } from "node:test";
import * as jsx from "react/jsx-runtime";
import { readFileSync } from "node:fs";
import { listApprovedUnits, loadUnit } from "@domigo/content-loader";
import { activityDeck } from "./catalog.ts";
import { loadTestModule, source } from "../arena/test-loader.ts";
const trainerGrade = (view: { kind: string; grades: number[] }) => view.kind === "student" && view.grades.length !== 1 ? null : view.grades[0] ?? null;
it("A11 classifications join all four current years without crossing a year or duplicating a headword", () => {
  const items = listApprovedUnits().flatMap(slug => loadUnit(slug).vocab);
  const counts = [];
  for (const grade of [1, 2, 3, 4]) {
    const deck = activityDeck(items, grade);counts.push(deck.length);assert.ok(deck.length > 400);
    assert.ok(deck.every(w => w.id.startsWith(`g${grade}u`)));assert.equal(new Set(deck.map(w => `${w.chapter}:${w.word.toLowerCase()}`)).size, deck.length);
    const first = items.find(x => x.id === deck[0]!.id)!;
    assert.equal(activityDeck([{ ...first, w: "new unclassified wording" }], grade).length, 0);
    assert.equal(activityDeck(items.filter(x => x.id !== first.id), grade).some(x => x.id === first.id), false);
  }
  assert.deepEqual(counts, [777, 603, 599, 442]);
});
it("A12 preview uses only the approved local corpus; reserve/content failure closes student activity", async () => {
  let reads = 0;
  const load = loadTestModule("apps/web/lib/activity/server.ts", { "server-only": {}, "@domigo/content-loader": { listApprovedUnits, loadUnit }, "@/app/practice/load-practice": { loadPracticeWords: async () => { reads++; throw Error("reserve unavailable"); } }, "@/lib/student-view": { trainerGrade }, "./catalog": { activityDeck } }).loadActivity as (v: unknown) => Promise<{ words: unknown[]; unavailable: boolean }>;
  for (const grade of [1, 2, 3, 4]) assert.ok((await load({ kind: "preview", grades: [grade] })).words.length > 400);
  assert.equal(reads, 0);assert.deepEqual(await load({ kind: "student", grades: [1], player: {} }), { words: [], unavailable: true });assert.equal(reads, 1);
  assert.deepEqual(await load({ kind: "student", grades: [1, 2, 3, 4], player: {} }), { words: [], unavailable: true });assert.equal(reads, 1);
});
it("A13 actual practice loader passes exact class scope to reserve lookup and excludes its reserved item", async () => {
  const item = loadUnit("g1-u01").vocab[0]!;let scope: unknown[] = [];
  const loader = loadTestModule("apps/web/app/practice/load-practice.ts", { "server-only": {}, "@domigo/content-loader": { listApprovedUnits: () => ["g1-u01", "g2-u01"], assignPool: (id: string, reserved: Set<string>) => reserved.has(id) ? "mock" : "practice" }, "@domigo/db": { getDb: () => "synthetic-db", listReservedForClass: async (...args: unknown[]) => { scope = args;return new Set([item.id]); } }, "@/lib/content-service": { loadUnitWithOverrides: async (slug: string) => loadUnit(slug) }, "@/lib/daily-challenge": {}, "@/lib/wort-des-tages": {} });
  const practice = loader.loadPracticeWords as (v: unknown, g: number) => Promise<{ vocab: typeof item[] }>;
  const result = await practice({ kind: "student", player: { classScope: "scope-example", classId: "class-example" } }, 1);
  assert.deepEqual(scope, ["synthetic-db", "scope-example", "class-example"]);assert.equal(result.vocab.some(x => x.id === item.id), false);assert.ok(result.vocab.every(x => x.id.startsWith("g1u")));
});
it("A14 actual page redirects before loading and binds each game to resolved owner/year", async () => {
  let view: unknown = null, loads = 0, raw: unknown;
  const page = loadTestModule("apps/web/app/activity/page.tsx", { "react/jsx-runtime": jsx, "next/navigation": { redirect: (to: string) => { throw Error(`redirect:${to}`); } }, "@/lib/student-view": { resolveStudentView: async (value: unknown) => { raw = value;return view; }, trainerGrade }, "@/lib/activity/server": { loadActivity: async (v: unknown) => { assert.equal(v, view);loads++;return { words: [], unavailable: false }; } }, "./ActivityScreen": { default: "activity-screen" }, "../home/TrainerShell": { default: "trainer-shell" }, "./activity.css": {} }).default as (props: unknown) => Promise<{ props: { grade: number; preview: boolean; children: { key: string; props: { grade: number; preview: boolean } } } }>;
  const query = { searchParams: Promise.resolve({ jahrgang: "4" }) };
  await assert.rejects(page(query), /redirect:\/signin/);assert.equal(loads, 0);
  view = { kind: "student", grades: [], player: { userId: "example-owner" } };await assert.rejects(page(query), /redirect:\/home/);assert.equal(loads, 0);
  view = { kind: "student", grades: [1], player: { userId: "example-owner" } };const rendered = await page(query);assert.equal(raw, "4");assert.equal(rendered.props.grade, 1);assert.equal(rendered.props.children.props.grade, 1);assert.equal(rendered.props.children.key, "example-owner-1");assert.equal(rendered.props.preview, false);assert.equal(loads, 1);
  view = { kind: "preview", grades: [4] };const preview = await page(query);assert.equal(preview.props.grade, 4);assert.equal(preview.props.children.key, "preview-4");assert.equal(preview.props.preview, true);
  assert.match(source("apps/web/middleware.ts"), /"\/activity"/);assert.match(source("apps/web/app/home/page.tsx"), /href=\{`\/activity\$\{suffix\}`\}/);
});
it("A15 Activity client/model have no persistence, network or XP-writing path", () => {
  for (const file of ["apps/web/app/activity/ActivityScreen.tsx", "apps/web/lib/activity/game.ts"]) {
    const code = source(file).replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
    assert.doesNotMatch(code, /localStorage|sessionStorage|indexedDB|document\.cookie|\bfetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon|sendAttempt|recordAttempt|xpAwarded/);
  }
  const src = readFileSync(new URL("../../app/activity/ActivityScreen.tsx", import.meta.url), "utf8");assert.match(src, /performance.now\(\)/);assert.match(src, /showModal\(\)/);
});
