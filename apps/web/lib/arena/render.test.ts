import assert from "node:assert/strict";
import { it } from "node:test";
import * as React from "react";
import * as jsx from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";
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
  const next = { round: 0, question: 0, itemId: "g1u01.w.fixture", options: ["option A", "option B", "option C", "option D"] };
  const html = render(duelScreen, { data: { ...example, prompt: "synthetic prompt", chapters: [], duel: { ...example.duel, next } }, grade: 1, preview: false, ownerId: "synthetic" });
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
