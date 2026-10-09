/** Nachzug 2: execute the real renderer/reader; all examples are invented. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { it } from "node:test";
import * as ts from "typescript";
import * as React from "react";
import * as jsx from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";
import * as levels from "./levels.ts";
import * as model from "./leaderboard-model.ts";
const read = (file: string) => readFileSync(new URL(`../../../${file}`, import.meta.url), "utf8");
const UI = "apps/web/app/bestenliste/LeaderboardScreen.tsx";
function load(file: string, deps: Record<string, unknown>) {
  const compiled = ts.transpileModule(read(file), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 } }).outputText;
  const m = { exports: {} as Record<string, (...args: never[]) => unknown> };
  new Function("require", "module", "exports", compiled)((id: string) => { assert.ok(id in deps, id); return deps[id]; }, m, m.exports);
  return m.exports;
}
const row = { id: 1, name: "Anna (Fuchs)", avatar: 1, className: "Synthetic A", ownClass: true, me: true, vocabXp: 40, totalXp: 30040, weeklyXp: 20, streak: 2, dailyCorrect: 0, dailyTotal: 0 };
const board = { enabled: true, unavailable: false, gradeOptIn: true, className: "Synthetic A", week: "2026-10-05", weeklyXp: 20, totalXp: 30040, target: 5000, rows: [row, { ...row, id: 2, me: false, name: "Peer (Eule)" }] };
function render(b = board, grade = 1, tab = "class", order = "week") {
  const deps: Record<string, unknown> = { react: { ...React, useState: (initial: string) => [initial === "class" ? tab : order, () => {}] }, "react/jsx-runtime": jsx, "next/link": { default: "a" }, "@/lib/levels": levels, "@/lib/leaderboard-model": model };
  deps["./WeeklyGoal"] = load("apps/web/app/bestenliste/WeeklyGoal.tsx", deps);
  const Screen = load(UI, deps).default as React.ComponentType<Record<string, unknown>>;
  return renderToStaticMarkup(React.createElement(Screen, { board: b, grade, preview: false }));
}

it("F10 two own rows have exactly one me marker and one arrow", () => {
  const html = render();
  assert.equal((html.match(/class="lb-row/g) ?? []).length, 2);
  assert.equal((html.match(/class="lb-row me"/g) ?? []).length, 1);
  assert.equal((html.match(/← du/g) ?? []).length, 1);
  assert.match(html, /Peer \(Eule\)/);
  assert.doesNotMatch(html, /[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}/i);
});
it("F10 foreign rows remain hidden even if an all-tab state survives loss of opt-in", () => {
  const b = { ...board, gradeOptIn: false, rows: [...board.rows, { ...row, id: 3, me: false, ownClass: false, name: "Forbidden synthetic peer", className: "Synthetic B" }] };
  const html = render(b, 1, "all");
  assert.doesNotMatch(html, /Forbidden synthetic peer|Synthetic B|Alle Klassen/);
  assert.equal((html.match(/class="lb-row/g) ?? []).length, 2);
});
it("F11 title follows vocabulary XP, while points keep the combined total", () => {
  const html = render(board, 1, "class", "total");
  const level = levels.levelFor(row.vocabXp);
  const title = levels.vocabTitle(level.level, level.prestige, levels.registerFor(1));
  assert.match(html, new RegExp(`title="Level ${level.level}"`));
  assert.ok(html.includes(title.name));
  assert.match(html, /30,040 XP/);
  assert.notEqual(level.level, levels.levelFor(row.totalXp).level);
});
for (const grade of [1, 2, 3, 4]) {
  it(`F12 grade ${grade} total label and unavailable message use its language`, () => {
    const html = render(board, grade, "class", "total");
    assert.ok(html.includes(grade === 1 ? "Wortschatz + Grammatik XP" : "Vocabulary + Grammar XP"));
    if (grade === 1) assert.doesNotMatch(html, /Vocabulary|Grammar XP|All time|Today's|My Class/);
    const failure = render({ ...board, enabled: false, unavailable: true }, grade);
    assert.ok(failure.includes(grade === 1 ? "Die Bestenliste ist gerade nicht erreichbar." : "The leaderboard is currently unavailable."));
    assert.doesNotMatch(failure, /nicht eingeschaltet|not switched on|Anna|Peer/);
  });
  it(`F12 preview grade ${grade} has five localized placeholders and zero reads`, async () => {
    let reads = 0;
    const m = load("apps/web/lib/leaderboard.ts", { "server-only": {}, "@domigo/db": { getDb: () => { reads++; throw Error("must not read"); } },
      "../../../packages/db/src/leaderboard-service.ts": { getLeaderboard: () => { reads++; throw Error("must not read children"); } } });
    const b = await m.readLeaderboard!({ kind: "preview", grades: [grade] } as never) as { rows: { id: number; name: string }[] };
    assert.equal(reads, 0);
    assert.deepEqual(b.rows.map(r => r.name), Array.from({ length: 5 }, (_, i) => `${grade === 1 ? "Beispiel" : "Example"} ${i + 1}`));
    assert.deepEqual(b.rows.map(r => r.id), [1, 2, 3, 4, 5]);
  });
}
it("F13 all-classes tab requires an actual other class as well as opt-in", () => {
  assert.doesNotMatch(render(), /Alle Klassen/);
  const b = { ...board, rows: [...board.rows, { ...row, id: 3, ownClass: false, me: false, name: "Beta", className: "Synthetic B" }] };
  assert.match(render(b), /Alle Klassen/);
  assert.match(render(b, 1, "all"), /Synthetic B/);
});
it("F6 consent dialog names series and class name as shared fields", () => {
  const Settings = load("apps/web/app/admin/classes/[id]/LeaderboardSettings.tsx", { react: React, "react/jsx-runtime": jsx, "next/navigation": { useRouter: () => ({}) }, "./leaderboard-settings.css": {} }).default as React.ComponentType<Record<string, unknown>>;
  const html = renderToStaticMarkup(React.createElement(Settings, { classId: "synthetic", initial: { leaderboard: true, gradeBoardOptIn: false }, testClass: false }));
  assert.match(html, /Avatare, Level, Lern-Serie, bestätigten Lernpunkte und den Klassennamen/);
});
it("F9 a failure to acquire a database handle also returns unavailable", async () => {
  let failed = 0;
  const m = load("apps/web/lib/leaderboard.ts", { "server-only": {}, "@domigo/db": { getDb: () => { throw Error("synthetic private detail"); } },
    "../../../packages/db/src/leaderboard-service.ts": { unavailableLeaderboard: () => { failed++; return { unavailable: true, enabled: false }; } } });
  assert.deepEqual(await m.readLeaderboard!({ kind: "student", grades: [1], player: {} } as never), { unavailable: true, enabled: false });
  assert.equal(failed, 1);
});
it("F13 home renders all three established action links in a three-column row", async () => {
  const m = load("apps/web/app/home/page.tsx", { "react/jsx-runtime": jsx, "next/link": { default: "a" }, "next/navigation": {},
    "@/lib/story-world": { listOpenStories: async () => [] }, "@domigo/db": {},
    "@/lib/student-view": { resolveStudentView: async () => ({ kind: "preview", grades: [1] }), trainerGrade: () => 1 },
    "@/lib/wort-des-tages": { wortDesTages: async () => null, viennaDateKey: () => "2026-10-09" },
    "@/lib/stories": { STORY_UI: {}, DEFAULT_STORY_UI: {} }, "../practice/load-practice": { loadDailyChallenge: async () => null },
    "./TrainerShell": { default: ({ children }: { children: React.ReactNode }) => children }, "./PlayerCard": { default: () => null },
    "./trainer-data": { readTrainerProfile: async () => ({}) }, "./ModeSwitch": { ModeStart: () => null } });
  const html = renderToStaticMarkup(await m.default!() as React.ReactNode);
  assert.equal((html.match(/class="og-action-card"/g) ?? []).length, 3);
  for (const path of ["fortschritt", "bestenliste", "profil"]) assert.ok(html.includes(`href="/${path}?jahrgang=1"`));
  assert.match(html, /grid-template-columns:repeat\(3, minmax\(0, 1fr\)\)/);
});
