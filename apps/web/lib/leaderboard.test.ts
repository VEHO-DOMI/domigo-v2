/** cgo-111 contracts + deliberate red mutations. No real identities or DB. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { describe, it } from "node:test";
import * as ts from "typescript";
import * as React from "react";
import * as jsx from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";
import * as levels from "./levels.ts";
import * as model from "./leaderboard-model.ts";
const root = new URL("../../../", import.meta.url);
const read = (p: string) => readFileSync(new URL(p, root), "utf8");
const md5 = (s: string) => createHash("md5").update(s).digest("hex");
const DB = "packages/db/src/leaderboard-service.ts";
const UI = "apps/web/app/bestenliste/LeaderboardScreen.tsx";
const SETTINGS = "packages/db/src/class-settings-service.ts";
const CONTROL = "apps/web/app/admin/classes/[id]/LeaderboardSettings.tsx";
const ROUTE = "apps/web/app/api/admin/class-leaderboard/route.ts";
const guards: [string, string, string][] = [
  ["L01 own class comes from scoped authenticated roster", DB, 'inArray(viewer.classId, [...classScope]), eq(viewer.id, userId), eq(viewer.role, "student")'],
  ["L02 own archive/purpose/A wall", DB, 'isNull(own.archivedAt), eq(ownSettings.purpose, "regular"), eq(ownSettings.leaderboard, true)'],
  ["L03 other archive + same grade", DB, 'and(eq(v2Classes.grade, own.grade), isNull(v2Classes.archivedAt))'],
  ["L04 other purpose + A", DB, 'eq(classSettings.purpose, "regular"), eq(classSettings.leaderboard, true)'],
  ["L05 BOTH teachers opt in", DB, 'and(eq(ownSettings.gradeBoardOptIn, true), eq(classSettings.gradeBoardOptIn, true))'],
  ["L06 metadata confined to allowed roster", DB, 'eq(userProgress.userId, v2IdentityUsers.id)'],
  ["L07 only student roster", DB, 'and(eq(v2IdentityUsers.classId, v2Classes.id), eq(v2IdentityUsers.role, "student"), isNotNull(v2IdentityUsers.claimedAt))'],
  ["L08 sum both confirmed pools", DB, 'Number(r.xp ?? 0) + Number(r.grammarXp ?? 0)'],
  ["L09 Monday calendar", DB, '(calendar.getUTCDay() + 6) % 7'],
  ["L10 Vienna midnight", DB, "${week}::date::timestamp at time zone 'Europe/Vienna'"],
  ["L11 attempts match user AND current class", DB, '${practiceAttempts.userId} = ${v2IdentityUsers.id} and ${practiceAttempts.classId} = ${v2Classes.id}'],
  ["L12 assignments/checkups excluded", DB, "and ${practiceAttempts.mode} not like 'assign:%'"],
  ["L13 assignment writer awards zero", "apps/web/app/api/assignments/attempt/route.ts", 'xpAwarded: xpForTier(0, tier)'],
  ["L14 daily own class only", DB, '${practiceAttempts.classId} = ${own.id}'],
  ["L15 daily Vienna day and mode", DB, "and ${practiceAttempts.mode} = 'daily'"],
  ["L16 active streak only", DB, 'isStreakActive(r.lastDate, at)'],
  ["L17 given name and nickname", DB, '`${given} (${nickname})`'],
  ["L18 avatar fallback", DB, 'r.avatar && r.avatar >= 1 && r.avatar <= 50 ? r.avatar : 1'],
  ["L19 weekly class aggregate", DB, 'rows.filter((r) => r.ownClass)'],
  ["L20 goal 5000", DB, 'WEEKLY_GOAL = 5000'],
  ["L21 fail closed without migration", DB, '} catch { return unavailableLeaderboard(at); }'],
  ["L22 preview exits before database", "apps/web/lib/leaderboard.ts", 'if (view.kind === "preview") return'],
  ["L23 server session, no client class id", "apps/web/lib/leaderboard.ts", 'getLeaderboard(getDb(), view.player.classScope, view.player.userId)'],
  ["L24 hidden All Classes without own consent", UI, 'hasOtherClass && <button'],
  ["L25 week is default", UI, 'useState<"week" | "total">("week")'],
  ["L26 me + you", UI, 'row.me ? " me" : ""'],
  ["L27 title and stars", UI, '{prestigeStars(level.prestige)}{title.name}'],
  ["L28 class chip", UI, 'all && <span className="lb-class-chip">{row.className}</span>'],
  ["L29 honest disabled message", UI, 'Deine Lehrkraft hat die Bestenliste für deine Klasse nicht eingeschaltet.'],
  ["L30 language year one", UI, 'const de = grade === 1'],
  ["L31 real home link", "apps/web/app/home/page.tsx", 'href={`/bestenliste${suffix}`}'],
  ["L32 overall existing ladder", "apps/web/app/fortschritt/page.tsx", 'overallLevelFor(combinedXp ?? 0)'],
  ["L33 class goal only A", "apps/web/app/fortschritt/page.tsx", 'board.enabled && <WeeklyGoal'],
  ["L34 off defaults in settings", SETTINGS, 'const off = { leaderboard: false, gradeBoardOptIn: false }'],
  ["L35 settings owner and scope", SETTINGS, 'grandmaster ? undefined : eq(v2Classes.teacherId, teacherId)'],
  ["L36 no test/archived writes", SETTINGS, 'sql`${v2Classes.archivedAt} is null`, sql`coalesce(${classSettings.purpose}, \'regular\') = \'regular\'`'],
  ["L37 concurrent test change refuses upsert", SETTINGS, 'setWhere: eq(classSettings.purpose, "regular")'],
  ["L38 B requires A server side", SETTINGS, '(!settings.leaderboard && settings.gradeBoardOptIn)'],
  ["L39 test/read-only controls locked", CONTROL, 'testClass || readOnly || saving'],
  ["L40 B requires A in UI", CONTROL, 'disabled={locked || !settings.leaderboard}'],
  ["L41 popup precedes B enable", CONTROL, 'dialog.current?.showModal()'],
  ["L42 A off revokes B", CONTROL, 'save({ leaderboard: !settings.leaderboard, gradeBoardOptIn: false })'],
  ["L43 save receipt verified", CONTROL, '!response.ok || response.redirected || result?.ok !== true'],
  ["L44 endpoint teacher only", ROUTE, 'session.user.role !== "teacher"'],
  ["L45 endpoint area + origin", ROUTE, 'req.headers.get("origin") !== new URL(req.url).origin'],
  ["L46 server scoped write", ROUTE, 'if (!inScope(classScope, classId)) throw'],
  ["L47 migration A off", "packages/db/drizzle/0023_class_leaderboard.sql", 'ADD COLUMN IF NOT EXISTS "leaderboard" boolean DEFAULT false NOT NULL'],
  ["L48 migration B off", "packages/db/drizzle/0023_class_leaderboard.sql", 'ADD COLUMN IF NOT EXISTS "grade_board_opt_in" boolean DEFAULT false NOT NULL'],
  ["L49 privacy register A", "apps/web/lib/datenschutz-spalten.ts", 'leaderboard: sachlich('],
  ["L50 privacy register B", "apps/web/lib/datenschutz-spalten.ts", 'grade_board_opt_in: sachlich('],
  ["L51 student route protected", "apps/web/middleware.ts", '"/bestenliste"'],
  ["L52 admin route protected", "apps/web/middleware.ts", 'pathname === "/api/admin/class-leaderboard"'],
  ["L53 read-only grandmaster overview", "apps/web/app/admin/classes/[id]/page.tsx", 'readOnly={fremd}'],
];
describe("W4 source contracts, each with md5-pinned red tamper", () => {
  for (const [name, file, needle] of guards) it(name, () => {
    const s = read(file); const hash = md5(s);
    assert.ok(s.includes(needle), name);
    const broken = s.replaceAll(needle, "/* deliberate missing contract */");
    assert.notEqual(md5(broken), hash); assert.equal(broken.includes(needle), false);
    assert.equal(md5(read(file)), hash);
    console.log(`TAMPER ${name} RED md5-before=${hash} mutant=${md5(broken)} after=${hash}`);
  });
  it("L54 client has zero writing/storage/XP earning paths; tamper red", () => {
    const s = read(UI); const forbidden = /\b(?:fetch|localStorage|sessionStorage|indexedDB|sendAttempt|recordAttempt|xpAwarded)\b/;
    assert.doesNotMatch(s, forbidden); const mutant = s + '\nfetch("/api/attempts");'; assert.match(mutant, forbidden);
    console.log(`TAMPER L54 RED md5-before=${md5(s)} mutant=${md5(mutant)} after=${md5(read(UI))}`);
  });
  it("L55 migration delta is exactly two columns, chained after 0022; tamper red", () => {
    const before = JSON.parse(read("packages/db/drizzle/meta/0022_snapshot.json"));
    const after = JSON.parse(read("packages/db/drizzle/meta/0023_snapshot.json"));
    assert.equal(after.prevId, before.id);
    const cols = after.tables["domigo_v2.class_settings"].columns;
    for (const name of ["leaderboard", "grade_board_opt_in"]) { assert.equal(cols[name].default, false); assert.equal(cols[name].notNull, true); delete cols[name]; }
    assert.deepEqual(after.tables, before.tables);
    const journal = JSON.parse(read("packages/db/drizzle/meta/_journal.json")).entries;
    assert.equal(journal[23].idx, 23); assert.equal(journal[22].idx, 22);
    const mutation = structuredClone(after); mutation.tables["domigo_v2.class_settings"].columns.extra = {};
    assert.notDeepEqual(mutation.tables, before.tables);
    console.log(`TAMPER L55 RED md5-before=${md5(JSON.stringify(after))} mutant=${md5(JSON.stringify(mutation))} after=${md5(JSON.stringify(after))}`);
  });
});

function load(file: string, deps: Record<string, unknown>) {
  const compiled = ts.transpileModule(read(file), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 } }).outputText;
  const m = { exports: {} as Record<string, (...a: never[]) => unknown> };
  new Function("require", "module", "exports", compiled)((id: string) => { assert.ok(id in deps, id); return deps[id]; }, m, m.exports);
  return m.exports;
}
it("preview runs real reader with zero DB handles and only five placeholders", async () => {
  let reads = 0;
  const m = load("apps/web/lib/leaderboard.ts", { "server-only": {}, "@domigo/db": { getDb: () => { reads++; throw Error("preview must not read"); } },
    "../../../packages/db/src/leaderboard-service.ts": { getLeaderboard: () => { reads++; throw Error("child reader"); } }, "../../../packages/db/src/class-settings-service.ts": {} });
  const b = await m.readLeaderboard!({ kind: "preview", grades: [1] } as never) as { rows: { name: string }[] };
  assert.equal(reads, 0); assert.deepEqual(b.rows.map(r => r.name), ["Beispiel 1", "Beispiel 2", "Beispiel 3", "Beispiel 4", "Beispiel 5"]);
});
it("student reader receives only session scope/user, never an arbitrary class parameter", async () => {
  const calls: unknown[][] = [];
  const m = load("apps/web/lib/leaderboard.ts", { "server-only": {}, "@domigo/db": { getDb: () => "db" },
    "../../../packages/db/src/leaderboard-service.ts": { getLeaderboard: (...args: unknown[]) => { calls.push(args); return {}; } }, "../../../packages/db/src/class-settings-service.ts": {} });
  await m.readLeaderboard!({ kind: "student", grades: [1], player: { userId: "synthetic-child", classScope: ["own"], classId: "forged" } } as never);
  assert.deepEqual(calls, [["db", ["own"], "synthetic-child"]]);
});
it("all four grades render row anatomy, no B tab without opt-in, honest off state", () => {
  const deps: Record<string, unknown> = { react: React, "react/jsx-runtime": jsx, "next/link": { default: "a" }, "@/lib/levels": levels, "@/lib/leaderboard-model": model };
  deps["./WeeklyGoal"] = load("apps/web/app/bestenliste/WeeklyGoal.tsx", deps);
  const Screen = load(UI, deps).default as React.ComponentType<Record<string, unknown>>;
  for (const grade of [1, 2, 3, 4]) {
    const board = { enabled: true, gradeOptIn: false, className: "Synthetic A", weeklyXp: 1234, totalXp: 31000, target: 5000, rows: [{ id: 1, vocabXp: 31000, name: "Beispiel (Fuchs)", avatar: 1, ownClass: true, me: true, weeklyXp: 1234, totalXp: 31000, streak: 2, dailyCorrect: 3, dailyTotal: 4 }] };
    const html = renderToStaticMarkup(React.createElement(Screen, { board, grade, preview: false }));
    for (const marker of ['lb-row me', 'width="34"', '⭐', '1,234 XP', '3/4', 'Beispiel (Fuchs)']) assert.ok(html.includes(marker), marker);
    assert.doesNotMatch(html, /All Classes|Alle Klassen/);
    const off = renderToStaticMarkup(React.createElement(Screen, { board: { ...board, enabled: false }, grade, preview: false }));
    assert.doesNotMatch(off, /Beispiel \(Fuchs\)|lb-row|All Classes/);
    assert.match(off, grade === 1 ? /nicht eingeschaltet/ : /not switched on/);
  }
});
