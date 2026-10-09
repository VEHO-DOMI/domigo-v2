import assert from "node:assert/strict";
import { it } from "node:test";
import { readdirSync } from "node:fs";
import * as React from "react";
import * as jsx from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";
import { listApprovedUnits, loadUnit } from "@domigo/content-loader";
import * as copy from "./copy.ts";
import { loadTestModule, source } from "./test-loader.ts";
import { emptyArena } from "../../../../packages/db/src/duel-service.ts";
let reads = 0;
const server = loadTestModule("apps/web/lib/arena/server.ts", { "server-only": {}, "@domigo/content-loader": {}, "@domigo/db": { getDb: () => { reads++; throw Error("preview read child database"); } },
  "@/auth": {}, "@/lib/content-service": {}, "@/lib/student-view": { trainerGrade: (v: { grades: number[] }) => v.grades[0] },
  "../../../../packages/db/src/duel-service.ts": { emptyArena } });
const readArena = server.readArena as (view: unknown) => Promise<Record<string, unknown>>;
const readDuel = server.readDuel as (view: unknown, id: string) => Promise<Record<string, unknown>>;
const showArenaCard = server.showArenaCard as (view: unknown) => Promise<boolean>;
const deps: Record<string, unknown> = { react: React, "react/jsx-runtime": jsx, "next/link": { default: "a" }, "next/navigation": { useRouter: () => ({}) }, "@/lib/arena/copy": copy };
const screen = loadTestModule("apps/web/app/arena/ArenaScreen.tsx", deps);
const duelScreen = loadTestModule("apps/web/app/arena/DuelScreen.tsx", { ...deps, "./ArenaScreen": screen });
function render(module: typeof screen, props: Record<string, unknown>) { return renderToStaticMarkup(React.createElement(module.default as React.ComponentType<Record<string, unknown>>, props)); }

it("W09 four grades preview: example peers/duels, zero child reads, zero playable question", async () => {
  for (const grade of [1, 2, 3, 4]) {
    reads = 0; const view = { kind: "preview", grades: [grade] };
    const arena = await readArena(view), data = await readDuel(view, "foreign-request-id");
    assert.equal(await showArenaCard(view), true); assert.equal(reads, 0);
    const hub = render(screen, { arena, grade, preview: true });
    assert.ok(hub.includes(grade === 1 ? "Beispiel 2" : "Example 2"));
    assert.match(hub, /0%/); assert.doesNotMatch(hub, /Live Battle|Class Quiz/);
    const detail = render(duelScreen, { data, grade, preview: true, ownerId: null });
    assert.ok(detail.includes(copy.arenaCopy(grade).preview)); assert.doesNotMatch(detail, /class="arena-option/);
  }
});
it("W10 off/unavailable states contain no child data, duel cards or challenge controls", () => {
  for (const grade of [1, 2, 3, 4]) for (const unavailable of [false, true]) {
    const html = render(screen, { arena: { ...emptyArena(unavailable), peers: [{ name: "Synthetic private", number: 1, avatar: 1 }] }, grade, preview: false });
    assert.ok(html.includes(unavailable ? copy.arenaCopy(grade).unavailable : copy.arenaCopy(grade).off));
    assert.doesNotMatch(html, /Synthetic private|arena-duel-card|aria-expanded=/);
  }
});
it("W11 question renderer shows four authored choices and no answer key; scoreboard has fifteen cells per side", async () => {
  const example = (await readDuel({ kind: "preview", grades: [1] }, "example")) as { duel: Record<string, unknown> };
  const next = { round: 0, question: 0, prompt: "synthetic prompt", options: ["option A", "option B", "option C", "option D"] };
  const html = render(duelScreen, { data: { ...example, chapters: [], duel: { ...example.duel, next } }, grade: 1, preview: false, ownerId: "synthetic" });
  assert.equal((html.match(/class="arena-option"/g) ?? []).length, 4); assert.match(html, /Chapter 1/); assert.match(html, /Frage 1 von 3/);
  assert.doesNotMatch(html, /correctIdx|"answers"|sAnswers|dAnswers|translation|Live Battle|Class Quiz/);
  const score = render(duelScreen, { data: example, grade: 1, preview: true, ownerId: null });
  assert.equal((score.match(/class="arena-block empty"/g) ?? []).length, 30);
});
it("W12 client source: preview guards before POST; receipts alone supply XP and correctness", () => {
  const hub = source("apps/web/app/arena/ArenaScreen.tsx"), client = source("apps/web/app/arena/DuelScreen.tsx");
  assert.match(hub, /if \(preview \|\| busy\) return/);
  assert.match(client, /if \(preview \|\| !ownerId \|\| inFlight.current \|\| receipt\) return/);
  assert.match(client, /setReceipt\(\{ tier: reply.tier, xpAwarded: reply.xpAwarded \}\)/);
  assert.doesNotMatch(client, /\bitemId\b/);
  assert.match(client, /context: \{ duelId: duel.id, round: next.round, question: next.question \}/);
  for (const code of [hub, client]) assert.doesNotMatch(code, /xpForTier|gradeVocab|correctIdx|localStorage|sessionStorage|indexedDB|xp\s*\+=|xpAwarded\s*:\s*\d|\bbonus\b/i);
});
it("W13 arena pages use server identity/year and preview, and are covered by middleware", () => {
  for (const file of ["apps/web/app/arena/page.tsx", "apps/web/app/arena/duel/[id]/page.tsx"]) {
    const src = source(file); assert.match(src, /await resolveStudentView\(/); assert.match(src, /trainerGrade\(view\)/); assert.match(src, /view.kind === "preview"/); assert.match(src, /<TrainerShell/);
  }
  const middleware = source("apps/web/middleware.ts"); assert.match(middleware, /"\/arena"/); assert.match(middleware, /"\/arena\/:path\*"/);
});
it("W14 home shows full-width Arena after Story/Dictionary only with consent or preview; teacher gets no new switch", () => {
  const home = source("apps/web/app/home/page.tsx");
  assert.match(home, /showArenaCard\(view\)/); assert.match(home, /\{arena && <Link className="og-nav-card" href=\{`\/arena/);
  assert.ok(home.indexOf("Word Duel und Verlauf") > home.indexOf("Story Mode"));
  const teacher = source("apps/web/app/admin/classes/[id]/page.tsx"); assert.match(teacher, /Battle Arena: .*folgt der Bestenliste/);
});
it("W15 result uses original win/draw/loss emojis; history displays confirmed scores and XP", async () => {
  const example = (await readDuel({ kind: "preview", grades: [2] }, "example")) as { duel: Record<string, unknown> };
  for (const [result, emoji] of [["win", "🏆"], ["draw", "🤝"], ["loss", "💪"]]) {
    const d = { ...example.duel, status: "complete", result, myScore: 3, theirScore: 2, date: "2026-10-09T08:00:00Z", xp: 40 };
    const html = render(screen, { arena: { ...emptyArena(), enabled: true, history: [d] }, grade: 2, preview: false });
    const label = result === "win" ? "Victory!" : result === "draw" ? "Draw" : "Defeat";
    assert.ok(html.includes(`${emoji} ${label}`)); assert.match(html, /3–2/); assert.match(html, /\+40 XP/); assert.match(html, /Battle history/);
  }
});
it("W16 every Arena transaction route explicitly selects the Node runtime", () => {
  const arenaRoutes = readdirSync(new URL("../../app/api/arena/", import.meta.url), { recursive: true, encoding: "utf8" })
    .filter(file => file.endsWith("/route.ts"));
  assert.ok(arenaRoutes.length >= 2, "Arena routes must actually be discovered");
  for (const file of ["apps/web/app/api/attempts/route.ts", ...arenaRoutes.map(file => `apps/web/app/api/arena/${file}`)]) {
    assert.match(source(file), /^export const runtime = ["']nodejs["'];/m, `${file}: interactive transactions require Node`);
  }
});
it("W20 Chapter picker uses explicit plural in every grade", async () => {
  for (const grade of [1, 2, 3, 4]) {
    const data = await readDuel({ kind: "preview", grades: [grade] }, "example") as { duel: Record<string, unknown> };
    const html = render(duelScreen, { data: { ...data, duel: { ...data.duel, canOpen: true }, chapters: [{ key: `g${grade}-u01`, chapter: 1 }] }, grade, preview: false, ownerId: "synthetic" });
    assert.ok(html.includes(grade === 1 ? "3 Fragen" : "3 questions"));
    assert.doesNotMatch(html, /3 frage(?:<|\s)|3 question(?:<|\s)/);
  }
});
it("W21 question guidance is German in grade one and English in grades two to four", async () => {
  for (const grade of [1, 2, 3, 4]) {
    const data = await readDuel({ kind: "preview", grades: [grade] }, "example") as { duel: Record<string, unknown> };
    const html = render(duelScreen, { data: { ...data, duel: { ...data.duel, next: { round: 0, question: 0, prompt: "synthetisch", options: ["a", "b", "c", "d"] } } }, grade, preview: false, ownerId: "synthetic" });
    assert.ok(html.includes(grade === 1 ? 'lang="de"' : 'lang="en"'));
    assert.ok(html.includes(grade === 1 ? "Übersetze ins Englische" : "Translate to English"));
    assert.ok(html.includes(grade === 1 ? "Frage 1 von 3" : "Question 1 of 3"));
    assert.ok(html.includes(grade === 1 ? "Runde 1" : "Round 1"));
  }
});
it("W22 completed duel displays only recorded XP for victory, draw and defeat", async () => {
  for (const grade of [1, 2, 3, 4]) for (const result of ["win", "draw", "loss"]) {
    const data = await readDuel({ kind: "preview", grades: [grade] }, "example") as { duel: Record<string, unknown> };
    const html = render(duelScreen, { data: { ...data, duel: { ...data.duel, status: "complete", result, xp: 37, myScore: 7 } }, grade, preview: false, ownerId: "synthetic" });
    assert.match(html, /7\/15 [^<]+ · \+37 XP/); assert.equal((html.match(/\+\d+ XP/g) ?? []).join(), "+37 XP");
  }
});
it("W23 actual Home page and access helper hide Arena when A is off; preview reads no children", async () => {
  let enabled = false, calls = 0, view: Record<string, unknown> = { kind: "student", player: { userId: "synthetic", classScope: ["synthetic"], classId: "synthetic" } };
  const access = loadTestModule("apps/web/lib/arena/server.ts", { "server-only": {}, "@domigo/content-loader": {}, "@domigo/db": { getDb: () => { calls++; return {}; } }, "@/auth": {}, "@/lib/content-service": {}, "@/lib/student-view": {}, "../../../../packages/db/src/duel-service.ts": { arenaEnabled: async () => enabled } });
  const home = loadTestModule("apps/web/app/home/page.tsx", {
    "react/jsx-runtime": jsx, "next/link": { default: "a" }, "next/navigation": { redirect: () => { throw Error("unexpected redirect"); } },
    "@/lib/story-world": { listOpenStories: async () => [] }, "@domigo/db": {},
    "@/lib/student-view": { resolveStudentView: async () => view, trainerGrade: () => 1 },
    "@/lib/wort-des-tages": { wortDesTages: async () => null, viennaDateKey: () => "synthetic-day" }, "@/lib/stories": { STORY_UI: {}, DEFAULT_STORY_UI: {} },
    "../practice/load-practice": { loadDailyChallenge: async () => null }, "./TrainerShell": { default: ({ children }: { children: React.ReactNode }) => children }, "./PlayerCard": { default: () => null },
    "./trainer-data": { readTrainerProfile: async () => ({}) }, "./ModeSwitch": { ModeStart: () => null }, "@/lib/arena/server": access, "./home.css": {},
  });
  const html = async () => renderToStaticMarkup(await home.default!() as React.ReactNode);
  assert.doesNotMatch(await html(), /href="\/arena/); assert.equal(calls, 1);
  enabled = true; assert.match(await html(), /href="\/arena"/); assert.equal(calls, 2);
  view = { kind: "preview", grades: [1] }; enabled = false;
  assert.match(await html(), /href="\/arena\?jahrgang=1"/); assert.equal(calls, 2);
});
it("W24 read boundaries emit only anonymous read_failed for failed storage", async () => {
  const calls: unknown[][] = [], original = console.warn; console.warn = (...args) => { calls.push(args); };
  const student = { kind: "student", player: { userId: "synthetic-private", classScope: [] } };
  try {
    assert.equal(await showArenaCard(student), false);
    assert.equal((await readArena(student)).unavailable, true);
    await assert.rejects(readDuel(student, "synthetic-private"));
    assert.deepEqual(calls, [["[arena] read_failed"], ["[arena] read_failed"], ["[arena] read_failed"]]);
  } finally { console.warn = original; }
});

it("W25 all 57 units: actual page props and key carry only prompt/options/coordinates for every word", async () => {
  let current = loadUnit("g1-u01").vocab[0]!, grade = 1, captured: Record<string, unknown> | null = null;
  const safeService = {
    exampleDuel: server.exampleDuel,
    getDuel: async (_db: unknown, _scope: unknown, _user: unknown, _id: unknown, promptFor: (id: string) => Promise<string>) => ({
      ...(server.exampleDuel as (grade: number) => object)(grade), canOpen: false,
      next: { round: 0, question: 0, prompt: await promptFor(current.id), options: [current.w, ...current.mc.slice(0, 3)] },
    }),
  };
  const actualServer = loadTestModule("apps/web/lib/arena/server.ts", { "server-only": {}, "@domigo/content-loader": { listApprovedUnits }, "@domigo/db": { getDb: () => ({}) },
    "@/auth": {}, "@/lib/content-service": { loadUnitWithOverrides: async (slug: string) => loadUnit(slug) }, "@/lib/student-view": {}, "../../../../packages/db/src/duel-service.ts": safeService });
  const page = loadTestModule("apps/web/app/arena/duel/[id]/page.tsx", {
    "react/jsx-runtime": jsx, "next/link": { default: "a" }, "next/navigation": { redirect: () => { throw Error("unexpected redirect"); } },
    "@/lib/student-view": { resolveStudentView: async () => ({ kind: "student", player: { userId: "synthetic", classScope: [] } }), trainerGrade: () => grade },
    "@/lib/arena/server": actualServer, "@/lib/arena/copy": copy, "../../../home/TrainerShell": { default: ({ children }: { children: React.ReactNode }) => children },
    "../../DuelScreen": { default: (props: Record<string, unknown>) => { captured = props; return React.createElement(duelScreen.default as React.ComponentType<Record<string, unknown>>, props); } }, "../../arena.css": {},
  });
  let checked = 0; assert.equal(listApprovedUnits().length, 57);
  for (const slug of listApprovedUnits()) for (const item of loadUnit(slug).vocab) {
    current = item; grade = Number(slug[1]);
    const tree = await (page.default as (p: unknown) => Promise<React.ReactElement<{ children: React.ReactElement }>>)({ params: Promise.resolve({ id: "synthetic-duel" }), searchParams: Promise.resolve({}) });
    const html = renderToStaticMarkup(tree);
    assert.doesNotMatch(JSON.stringify(captured), /itemId|g[1-4]u\d{2}\.w\./);
    assert.doesNotMatch(String(tree.props.children.key), /g[1-4]u\d{2}\.w\./);
    assert.doesNotMatch(html, /g[1-4]u\d{2}\.w\./);
    const data = captured!.data as { duel: { next: Record<string, unknown> } };
    assert.deepEqual(Object.keys(data).sort(), ["chapters", "duel"]);
    assert.deepEqual(Object.keys(data.duel).sort(), ["avatar", "canOpen", "date", "grade", "id", "me", "mode", "myAvatar", "myScore", "myTurn", "next", "opponent", "result", "rounds", "status", "theirScore", "xp"]);
    const metadata = Object.fromEntries(Object.entries(data.duel).filter(([key]) => key !== "next"));
    const expectedMetadata = Object.fromEntries(Object.entries((server.exampleDuel as (g: number) => Record<string, unknown>)(grade)).filter(([key]) => key !== "next"));
    assert.deepEqual(metadata, expectedMetadata);
    const { options, ...outsideOptions } = data.duel.next;
    assert.deepEqual(outsideOptions, { round: 0, question: 0, prompt: item.g });
    assert.deepEqual(options, [item.w, ...item.mc.slice(0, 3)]); checked++;
  }
  assert.equal(checked, 2446);
});
