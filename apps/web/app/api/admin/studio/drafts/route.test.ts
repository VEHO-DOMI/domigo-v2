/** cgo-100 · Real Studio route + identity + schema/pre-gate + durable gate.
 * Only auth/storage and the external Sandbox transport are synthetic. No
 * account, real database, environment-file loading or provider SDK runs here. */
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import * as nodeModule from "node:module";
import { beforeEach, describe, it } from "node:test";
import type { GrammarItem, VocabItem } from "@domigo/content-schema";
import type { ContentCheckAccess, ContentCheckEvent, ContentCheckResult, ContentCheckTaskMeta } from "../../../../../../../packages/db/src/content-check-journal.ts";

// The repo runs a Node version with synchronous hooks; web still pins the
// older Node type package. Keep the compatibility declaration local to tests.
type HookContext = { parentURL?: string };
type HookResolution = { url: string; shortCircuit?: boolean };
type ResolveHook = (specifier: string, context: HookContext, next: (specifier: string, context: HookContext) => HookResolution) => HookResolution;
const { registerHooks } = nodeModule as unknown as { registerHooks(hooks: { resolve: ResolveHook }): void };

interface SyntheticDraft {
  id: string; itemId: string; unitSlug: string; kind: string; item: unknown;
  action: string; status: string; updatedBy: string; updatedAt: Date;
}
interface SyntheticClaim extends ContentCheckResult {
  task: ContentCheckTaskMeta;
  access: ContentCheckAccess;
}
interface SyntheticTask {
  itemId: string; item: GrammarItem | VocabItem; kind: "vocab" | "grammar";
  frame: unknown; model: string;
}
type SyntheticPoll = { status: "checking" } | { status: "failed"; note: string } | {
  status: "complete"; candidates: Array<{ answer: string; confidence: number }>;
  costUsd: null; inputTokens: null; outputTokens: null;
};
const fixture = {
  session: null as { user: { id: string; role: string; classId: null; scope: string[] } } | null,
  drafts: new Map<string, SyntheticDraft>(), claims: new Map<string, SyntheticClaim>(),
  events: [] as Array<{ key: string; access: ContentCheckAccess; event: ContentCheckEvent }>,
  eventIds: new Set<string>(), starts: [] as SyntheticTask[], polls: [] as string[], stops: [] as string[],
  writes: [] as Array<{ itemId: string; status: string }>, draftReads: [] as string[],
  checks: [] as unknown[], journalReads: [] as string[],
  result: { status: "checking" } as SyntheticPoll,
  startFailure: false, appendFailure: false,
  beforeStatus: null as (() => void) | null,
  beforeDelete: null as (() => void) | null,
};

function own(access: ContentCheckAccess) {
  assert.ok(access.teacherId && access.scope.includes(access.classId), "storage rejects unauthorized class scope");
}
const boundary = {
  fixture,
  async claim(access: ContentCheckAccess, key: string, task: ContentCheckTaskMeta) {
    own(access);
    if (fixture.claims.has(key)) return false;
    fixture.claims.set(key, { status: "checking", createdAt: new Date(), task, access: structuredClone(access) });
    return true;
  },
  async read(access: ContentCheckAccess, key: string) {
    own(access);
    fixture.journalReads.push(key);
    const row = fixture.claims.get(key);
    if (!row) return null;
    return structuredClone({ status: row.status, createdAt: row.createdAt,
      ...(row.sandboxId ? { sandboxId: row.sandboxId } : {}), ...(row.note ? { note: row.note } : {}) });
  },
  async append(access: ContentCheckAccess, key: string, event: ContentCheckEvent) {
    own(access);
    if (fixture.appendFailure) throw new Error("synthetic journal unavailable");
    if (event.eventId && fixture.eventIds.has(event.eventId)) return;
    if (event.eventId) fixture.eventIds.add(event.eventId);
    const row = fixture.claims.get(key);
    assert.ok(row, "append follows durable claim");
    fixture.events.push({ key, access: structuredClone(access), event: structuredClone(event) });
    if (row.status === "checking") fixture.claims.set(key, { ...row, ...event });
  },
  async load(itemId: string) {
    fixture.draftReads.push(itemId);
    const row = fixture.drafts.get(itemId);
    return row ? structuredClone(row) : null;
  },
  async save(args: Omit<SyntheticDraft, "id" | "status" | "updatedAt">, id = crypto.randomUUID()) {
    const row = { ...structuredClone(args), id, status: "draft", updatedAt: new Date() };
    fixture.drafts.set(args.itemId, row);
    fixture.writes.push({ itemId: args.itemId, status: "draft" });
    return row.id;
  },
  async loadOwned(access: ContentCheckAccess, itemId: string) {
    own(access);
    const row = await boundary.load(itemId);
    return row?.updatedBy === access.teacherId ? row : null;
  },
  async saveOwned(access: ContentCheckAccess, args: Omit<SyntheticDraft, "id" | "status" | "updatedAt" | "updatedBy">, expectedDraftId?: string) {
    own(access);
    const old = fixture.drafts.get(args.itemId);
    if (expectedDraftId) {
      if (!old || old.id !== expectedDraftId || old.updatedBy !== access.teacherId || old.status === "checking") return false;
    } else if (old) return false;
    await boundary.save({ ...args, updatedBy: access.teacherId }, expectedDraftId);
    return true;
  },
  async setStatus(itemId: string, status: string) {
    const row = fixture.drafts.get(itemId);
    assert.ok(row);
    fixture.drafts.set(itemId, { ...row, status });
    fixture.writes.push({ itemId, status });
  },
  async setOwnedStatus(access: ContentCheckAccess, itemId: string, expected: unknown, status: string) {
    own(access);
    fixture.beforeStatus?.();
    const row = fixture.drafts.get(itemId);
    if (!row || row.updatedBy !== access.teacherId || JSON.stringify(row.item) !== JSON.stringify(expected)) return false;
    await boundary.setStatus(itemId, status);
    return true;
  },
  async deleteOwned(access: ContentCheckAccess, itemId: string, draftId: string) {
    own(access);
    fixture.beforeDelete?.();
    const row = fixture.drafts.get(itemId);
    if (!row || row.id !== draftId || row.updatedBy !== access.teacherId || row.status === "checking") return false;
    fixture.drafts.delete(itemId);
    return true;
  },
};
const globalKey = "__cgo100StudioRouteBoundary";
(globalThis as Record<string, unknown>)[globalKey] = boundary;
const state = `const b = globalThis[${JSON.stringify(globalKey)}]; const f = b.fixture;`;
const dbURL = import.meta.resolve("@domigo/db");
const journalURL = new URL("../../../../../../../packages/db/src/content-check-journal.ts", import.meta.url).href;
const sandboxURL = new URL("../../../../../lib/studio-solve-sandbox.ts", import.meta.url).href;
const modules = new Map([
  ["server-only", "export {};"],
  ["@/auth", `${state} export const auth = async () => f.session;`],
  ["@/lib/grandmaster", "export const isGrandmaster = () => false;"],
  ["@domigo/db", `${state}
    export * from ${JSON.stringify(dbURL)};
    export const getDb = () => ({});
    export const loadDraft = async (_db, itemId) => b.load(itemId);
    export const saveDraft = async (_db, args) => b.save(args);
    export const setDraftStatus = async (_db, itemId, status) => b.setStatus(itemId, status);
    export const recordCheck = async (_db, args) => { f.checks.push(args); };
    export const deleteDraft = async (_db, itemId) => { f.drafts.delete(itemId); };
  `],
  [journalURL, `${state}
    export const claimContentCheck = async (_db, access, key, meta) => b.claim(access, key, meta);
    export const readContentCheck = async (_db, access, key) => b.read(access, key);
    export const appendContentCheck = async (_db, access, key, event) => b.append(access, key, event);
    export const loadCheckedStudioDraft = async (_db, access, itemId) => b.loadOwned(access, itemId);
    export const saveCheckedStudioDraft = async (_db, access, args, draftId) => b.saveOwned(access, args, draftId);
    export const setCheckedStudioStatus = async (_db, access, itemId, item, status) => b.setOwnedStatus(access, itemId, item, status);
    export const deleteCheckedStudioDraft = async (_db, access, itemId, draftId) => b.deleteOwned(access, itemId, draftId);
  `],
  [sandboxURL, `${state}
    export const startSandboxFrame = async (task, remember) => {
      f.starts.push(structuredClone(task));
      if (f.startFailure) throw new Error("synthetic sandbox unavailable");
      await remember("synthetic-sandbox-" + f.starts.length);
    };
    export const pollSandboxFrame = async (id) => { f.polls.push(id); return structuredClone(f.result); };
    export const stopSandboxFrame = async (id) => { f.stops.push(id); };
  `],
]);
registerHooks({
  resolve(specifier, context, nextResolve) {
    const resolvedURL = specifier.startsWith(".") && context.parentURL?.startsWith("file:")
      ? new URL(specifier, context.parentURL).href : specifier;
    const replacement = modules.get(specifier) ?? modules.get(resolvedURL);
    if (replacement !== undefined) return { url: `data:text/javascript,${encodeURIComponent(replacement)}`, shortCircuit: true };
    if (specifier === "next/server") return nextResolve("next/server.js", context);
    if (specifier.startsWith(".") && context.parentURL?.startsWith("file:")) {
      const url = new URL(`${specifier}.ts`, context.parentURL);
      if (existsSync(url)) return nextResolve(url.href, context);
    }
    return nextResolve(specifier, context);
  },
});

const { POST } = await import("./route.ts");
const { checkStudioContent } = await import("../../../../../lib/studio-content-check.ts");
const { buildGrammarItem, buildVocabItem } = await import("../../../../../lib/studio-new-item.ts");
const { loadUnit } = await import("@domigo/content-loader");
const { classScope } = await import("@domigo/db");
const unitSlug = "g2-u03";
const grammar = buildGrammarItem({
  unitSlug, structureId: "g2u03.s.should", format: "multiple-choice", occupiedIds: loadUnit(unitSlug).grammar.map((item) => item.id),
  prompt: "You ___ drink some water.", lang: "en", answers: [{ text: "should", tier: "full" }],
  distractors: ["shoulds", "musts", "coulds"], hintDe: "Denk an einen Ratschlag.",
  explainDe: "Mit should gibst du einen Ratschlag.", difficulty: 2,
}).item;
const vocab = buildVocabItem({
  unitSlug, slug: "synthetic-studio-lantern", w: "lantern", g: "Laterne", d: "A light you can carry.",
  s: "I carry a ___ after dark.", sAnswer: "lantern", distractors: ["cat", "dog", "desk", "shoe"],
  hintDe: "Du kannst damit im Dunkeln sehen.", difficulty: 2, gloss: [],
}).item as VocabItem;
const access = { teacherId: "synthetic-teacher-own", classId: "synthetic-class-own", scope: classScope(["synthetic-class-own"]) };
function request(body: Record<string, unknown>) {
  return new Request("https://studio.invalid/api/admin/studio/drafts", { method: "POST",
    headers: { "content-type": "application/json", "x-dev-teacher-id": "synthetic-forged", "x-dev-class-id": "synthetic-foreign" }, body: JSON.stringify(body) });
}
async function send(body: Record<string, unknown>) {
  const response = await POST(request(body));
  return { status: response.status, body: await response.json() as Record<string, unknown> };
}
function saveBody(kind: "grammar" | "vocab" = "grammar", item: GrammarItem | VocabItem = kind === "grammar" ? grammar : vocab, draftId?: string) {
  return { action: "save", itemId: item.id, unitSlug, kind, draftAction: "create", item, ...(draftId ? { draftId } : {}) };
}
async function begin(kind: "grammar" | "vocab" = "grammar") {
  const item = kind === "grammar" ? grammar : vocab;
  assert.equal((await send(saveBody(kind, item))).status, 200);
  const started = await send({ action: "publish", itemId: item.id });
  assert.equal(started.status, 200);
  assert.equal(started.body.status, "checking");
  assert.equal(typeof started.body.runId, "string");
  return { item, runId: started.body.runId as string };
}
function complete(answer: string) {
  fixture.result = { status: "complete", candidates: [{ answer, confidence: 0.96 }], costUsd: null, inputTokens: null, outputTokens: null };
}
beforeEach(() => {
  fixture.session = { user: { id: access.teacherId, role: "teacher", classId: null, scope: [...access.scope] } };
  fixture.drafts.clear(); fixture.claims.clear(); fixture.eventIds.clear();
  for (const list of [fixture.events, fixture.starts, fixture.polls, fixture.stops, fixture.writes, fixture.draftReads, fixture.checks, fixture.journalReads]) list.length = 0;
  fixture.result = { status: "checking" }; fixture.startFailure = false; fixture.appendFailure = false; fixture.beforeStatus = null; fixture.beforeDelete = null;
  process.env.VERCEL_ENV = "production";
});

describe("real Studio draft route · grammar and vocabulary intelligence gate", () => {
  for (const kind of ["grammar", "vocab"] as const) {
    it(`${kind}: pre-gate → save → checking → persisted passed verdict → live`, async () => {
      const item = kind === "grammar" ? grammar : vocab;
      const pre = await send({ action: "pregate", kind, item });
      assert.equal(pre.status, 200); assert.equal(pre.body.ok, true);
      assert.equal(fixture.starts.length, 0); assert.equal(fixture.writes.length, 0);
      const { runId } = await begin(kind);
      assert.equal(fixture.drafts.get(item.id)!.status, "checking");
      assert.equal(fixture.starts.length, 1);
      assert.equal(fixture.starts[0]!.kind, kind);
      assert.ok(!JSON.stringify(fixture.starts[0]!.frame).includes('"answers"'), "Sandbox frame carries no answer key");
      complete(kind === "grammar" ? "should" : "lantern");
      const polled = await send({ action: "poll", runId });
      assert.equal(polled.status, 200); assert.equal(polled.body.kind, "passed");
      assert.equal(fixture.drafts.get(item.id)!.status, "published");
      assert.equal(fixture.events.filter((row) => row.event.status === "passed").length, 1);
      assert.equal(fixture.events.at(-1)!.access.teacherId, access.teacherId);
      assert.deepEqual(fixture.stops, ["synthetic-sandbox-1"]);
      const repeated = await send({ action: "publish", itemId: item.id, model: "claude-haiku-4-5-20251001" });
      assert.equal(repeated.body.status, "published");
      assert.equal(fixture.starts.length, 1, "a journal hit costs no second Sandbox run");
      assert.equal(fixture.starts[0]!.model, "claude-sonnet-5", "client cannot weaken the prescribed model");
      assert.equal((await send(saveBody(kind, item, fixture.drafts.get(item.id)!.id))).status, 200);
      assert.equal((await send({ action: "publish", itemId: item.id })).body.status, "published");
      assert.equal(fixture.starts.length, 1, "saving identical bytes does not invalidate the verdict");
    });
    it(`${kind}: the solver gets the first student view without hidden structure/gloss hints`, async () => {
      const base = kind === "grammar" ? grammar : vocab;
      const item = { ...base, gloss: [{ word: "water", de: "Wasser", scope: null }] };
      await checkStudioContent(access, kind, item, unitSlug);
      assert.equal(fixture.starts.length, 1);
      const frame = fixture.starts[0]!.frame as { structure: string | null; glosses: string[] };
      assert.equal(frame.structure, null);
      assert.deepEqual(frame.glosses, []);
    });
  }
  it("a wrong blind answer blocks publication with a reason and cannot restart", async () => {
    const { item, runId } = await begin();
    complete("coulds");
    const result = await send({ action: "poll", runId });
    assert.equal(result.body.kind, "blocked");
    assert.match(String(result.body.note), /Lösungsschlüssel|Item tauschen/);
    assert.equal(fixture.drafts.get(item.id)!.status, "check_failed");
    const again = await send({ action: "publish", itemId: item.id });
    assert.equal(again.status, 422); assert.equal(again.body.ok, false);
    assert.ok(Array.isArray(again.body.errors) && again.body.errors.length > 0);
    assert.equal(fixture.starts.length, 1);
    assert.ok(!fixture.writes.some((row) => row.status === "published"));
  });
  it("six concurrent and repeated publications reserve only one run for the exact bytes", async () => {
    assert.equal((await send(saveBody())).status, 200);
    const results = await Promise.all(Array.from({ length: 6 }, () => send({ action: "publish", itemId: grammar.id })));
    assert.ok(results.every((result) => result.status === 200 && result.body.status === "checking"));
    assert.equal(new Set(results.map((result) => result.body.runId)).size, 1);
    assert.equal(fixture.starts.length, 1);
    assert.equal(fixture.drafts.get(grammar.id)!.status, "checking");
  });
  it("save cannot edit a checking draft; changed stored bytes cannot pass an old poll token", async () => {
    const { item, runId } = await begin();
    const changed = { ...grammar, prompt: { ...grammar.prompt, text: "We ___ drink some water." } };
    assert.equal((await send(saveBody("grammar", changed, fixture.drafts.get(item.id)!.id))).status, 409);
    assert.deepEqual(fixture.drafts.get(item.id)!.item, grammar);
    fixture.drafts.get(item.id)!.item = changed; // storage fault, bypasses route deliberately
    complete("should");
    const polled = await send({ action: "poll", runId });
    assert.equal(polled.body.kind, "blocked");
    assert.match(String(polled.body.note), /geändert|Fassung/);
    assert.equal(fixture.drafts.get(item.id)!.status, "check_failed");
    assert.equal(fixture.starts.length, 1);
    assert.ok(!fixture.writes.some((row) => row.status === "published"));
  });
  it("an old poll token cannot adopt a different already-passed revision", async () => {
    const { item, runId } = await begin();
    const changed = { ...grammar, rev: grammar.rev + 1, prompt: { ...grammar.prompt, text: "We ___ drink some water." } };
    complete("should");
    assert.equal((await checkStudioContent(access, "grammar", changed, unitSlug)).status, "passed");
    fixture.drafts.get(item.id)!.item = changed;
    const polled = await send({ action: "poll", runId });
    assert.equal(polled.body.kind, "blocked");
    assert.equal(fixture.drafts.get(item.id)!.status, "check_failed");
    assert.equal(fixture.starts.length, 2);
  });
  it("a forged poll token cannot launch a first run", async () => {
    assert.equal((await send(saveBody())).status, 200);
    const forged = await send({ action: "poll", runId: `studio:11111111-1111-4111-8111-111111111111:${grammar.id}` });
    assert.equal(forged.body.kind, "blocked");
    assert.equal(fixture.starts.length, 0);
    const malformed = await send({ action: "poll", runId: "another-run-shape" });
    assert.equal(malformed.status, 422);
  });
  it("a correctly bound poll token with no persisted journal cannot start another run", async () => {
    const { runId } = await begin();
    fixture.claims.clear(); // persistence fault: even a genuine token is not a journal verdict
    const polled = await send({ action: "poll", runId });
    assert.equal(polled.body.kind, "blocked");
    assert.match(String(polled.body.note), /Kein gespeicherter Prüflauf/);
    assert.equal(fixture.starts.length, 1);
    assert.ok(!fixture.writes.some((row) => row.status === "published"));
  });
  it("sandbox setup failure is terminal for the revision and has no API fallback", async () => {
    assert.equal((await send(saveBody())).status, 200);
    fixture.startFailure = true;
    assert.equal((await send({ action: "publish", itemId: grammar.id })).status, 422);
    fixture.startFailure = false;
    assert.equal((await send({ action: "publish", itemId: grammar.id })).status, 422);
    assert.equal(fixture.starts.length, 1);
    assert.equal(fixture.drafts.get(grammar.id)!.status, "check_failed");
    const routeSource = readFileSync(new URL("./route.ts", import.meta.url), "utf8");
    const helperSource = readFileSync(new URL("../../../../../lib/studio-content-check.ts", import.meta.url), "utf8");
    assert.doesNotMatch(routeSource + helperSource, /ANTHROPIC_API_KEY|OPENAI_API_KEY|from ["'][^"']*studio-solve["']|solveGate\(/);
  });
  it("a failed journal append cannot make the draft live", async () => {
    const { item, runId } = await begin();
    complete("should"); fixture.appendFailure = true;
    const result = await send({ action: "poll", runId });
    assert.equal(result.status, 503);
    assert.notEqual(fixture.drafts.get(item.id)!.status, "published");
    assert.equal(fixture.events.filter((entry) => entry.event.status === "passed").length, 0);
  });
  it("an edit racing the initial checking transition prevents the Sandbox start", async () => {
    assert.equal((await send(saveBody())).status, 200);
    fixture.beforeStatus = () => {
      fixture.drafts.get(grammar.id)!.item = { ...grammar, rev: grammar.rev + 1 };
      fixture.beforeStatus = null;
    };
    const result = await send({ action: "publish", itemId: grammar.id });
    assert.equal(result.status, 409);
    assert.equal(fixture.starts.length, 0);
    assert.equal(fixture.drafts.get(grammar.id)!.status, "draft");
  });
  it("an edit racing a passing poll cannot publish untested replacement bytes", async () => {
    const { runId } = await begin();
    complete("should");
    fixture.beforeStatus = () => {
      fixture.drafts.get(grammar.id)!.item = { ...grammar, rev: grammar.rev + 1 };
      fixture.beforeStatus = null;
    };
    const result = await send({ action: "poll", runId });
    assert.equal(result.status, 409);
    assert.equal(fixture.events.filter((entry) => entry.event.status === "passed").length, 1, "old bytes have a verdict");
    assert.ok(!fixture.writes.some((row) => row.status === "published"), "changed bytes have no publication");
    assert.equal(fixture.starts.length, 1);
  });
});

describe("Studio route authorization and immutable identity", () => {
  it("production rejects anonymous and non-teacher sessions, including forged headers", async () => {
    fixture.session = null;
    assert.equal((await send(saveBody())).status, 403);
    fixture.session = { user: { id: "synthetic-nonteacher", role: "student", classId: null, scope: [...access.scope] } };
    assert.equal((await send({ action: "pregate", kind: "grammar", item: grammar })).status, 403);
    assert.equal(fixture.writes.length, 0); assert.equal(fixture.starts.length, 0);
  });
  it("a teacher without an authorized class cannot save, publish or poll", async () => {
    fixture.session!.user.scope = [];
    for (const body of [saveBody(), { action: "publish", itemId: grammar.id }, { action: "poll", runId: "synthetic" }]) {
      assert.equal((await send(body)).status, 403);
    }
    assert.equal(fixture.draftReads.length, 0); assert.equal(fixture.writes.length, 0); assert.equal(fixture.starts.length, 0);
  });
  it("another teacher cannot poll, overwrite, publish or delete the owned draft", async () => {
    const { item, runId } = await begin();
    const writes = fixture.writes.length;
    fixture.session!.user.id = "synthetic-teacher-foreign";
    fixture.session!.user.scope = ["synthetic-class-foreign"];
    for (const body of [saveBody(), { action: "publish", itemId: item.id }, { action: "poll", runId }, { action: "revert", itemId: item.id }]) {
      const result = await send(body);
      assert.ok(result.status === 403 || result.status === 409, `foreign access rejected: ${JSON.stringify(result)}`);
      assert.ok(!JSON.stringify(result.body).includes(grammar.prompt.text), "foreign response reveals no draft wording");
    }
    assert.equal(fixture.writes.length, writes); assert.equal(fixture.starts.length, 1);
    assert.equal(fixture.drafts.get(item.id)!.updatedBy, access.teacherId);
  });
  it("caller claims cannot change the journal actor/class; the real session wins", async () => {
    const result = await send({ ...saveBody(), teacherId: "forged", classId: "synthetic-foreign", scope: ["synthetic-foreign"] });
    assert.equal(result.status, 200);
    assert.equal(fixture.claims.size, 0, "saving does not reserve a permanent content-check claim");
    assert.equal((await send({ action: "publish", itemId: grammar.id })).status, 200);
    const claim = [...fixture.claims.values()][0]!;
    assert.equal(claim.access.teacherId, access.teacherId);
    assert.equal(claim.access.classId, access.classId);
    assert.deepEqual(claim.access.scope, [...access.scope]);
  });
  it("checkStudioContent rejects a class outside scope without starting Sandbox", async () => {
    await assert.rejects(checkStudioContent({ ...access, classId: "synthetic-class-foreign" }, "grammar", grammar, unitSlug), /unauthorized class scope/);
    assert.equal(fixture.starts.length, 0);
  });
});

describe("Studio schema, content revision and request guards", () => {
  for (const [label, body] of [
    ["wrong unit", { ...saveBody(), unitSlug: "g2-u04" }],
    ["own ID mismatch", { ...saveBody(), item: { ...grammar, id: "g2u03.gi.should.mc.999" } }],
    ["format coherence", { ...saveBody(), item: { ...grammar, format: "gap-fill" } }],
    ["missing full answer", { ...saveBody(), item: { ...grammar, answers: [{ text: "should", tier: "partial" }] } }],
  ] as const) {
    it(`rejects ${label} before storage and paid checks`, async () => {
      const result = await send(body);
      assert.equal(result.status, 400);
      assert.equal(result.body.ok, false);
      assert.equal(fixture.writes.length, 0); assert.equal(fixture.starts.length, 0);
    });
  }
  it("a duplicate ID allocation cannot overwrite another opening form", async () => {
    const results = await Promise.all([send(saveBody()), send(saveBody())]);
    assert.deepEqual(results.map((result) => result.status).sort(), [200, 409]);
    assert.equal(fixture.writes.length, 1);
    assert.equal(fixture.drafts.size, 1);
  });
  it("two fresh forms saving sequentially cannot overwrite the same task ID", async () => {
    const first = await send(saveBody());
    assert.equal(first.status, 200);
    assert.match(String(first.body.draftId), /^[0-9a-f-]{36}$/);
    const changed = { ...grammar, prompt: { ...grammar.prompt, text: "We ___ drink some water." } };
    const second = await send(saveBody("grammar", changed));
    assert.equal(second.status, 409);
    assert.deepEqual(fixture.drafts.get(grammar.id)!.item, grammar);
    assert.equal(fixture.writes.length, 1);
  });
  it("editing an existing draft requires its exact saved row ID", async () => {
    const created = await send(saveBody());
    const draftId = String(created.body.draftId);
    const changed = { ...grammar, prompt: { ...grammar.prompt, text: "We ___ drink some water." } };
    assert.equal((await send(saveBody("grammar", changed))).status, 409);
    assert.equal((await send(saveBody("grammar", changed, "11111111-1111-4111-8111-111111111111"))).status, 409);
    const edited = await send(saveBody("grammar", changed, draftId));
    assert.equal(edited.status, 200);
    assert.equal(edited.body.draftId, draftId);
    assert.deepEqual(fixture.drafts.get(grammar.id)!.item, changed);
    assert.equal(fixture.starts.length, 0);
  });
  it("save → revert → fresh create can reuse the ID without a permanent allocation claim", async () => {
    const first = await send(saveBody());
    assert.equal(first.status, 200);
    assert.equal((await send({ action: "revert", itemId: grammar.id })).status, 200);
    assert.equal(fixture.drafts.has(grammar.id), false);
    const next = await send(saveBody());
    assert.equal(next.status, 200);
    assert.notEqual(next.body.draftId, first.body.draftId);
    assert.equal(fixture.claims.size, 0);
    assert.equal(fixture.starts.length, 0);
  });
  for (const race of ["checking", "replacement"] as const) {
    it(`revert cannot delete a draft that races into ${race}`, async () => {
      assert.equal((await send(saveBody())).status, 200);
      fixture.beforeDelete = () => {
        const row = fixture.drafts.get(grammar.id)!;
        fixture.drafts.set(grammar.id, race === "checking" ? { ...row, status: "checking" } : { ...row, id: crypto.randomUUID() });
        fixture.beforeDelete = null;
      };
      const result = await send({ action: "revert", itemId: grammar.id });
      assert.equal(result.status, 409);
      assert.equal(fixture.drafts.has(grammar.id), true);
    });
  }
  it("publication checks the current saved item again", async () => {
    assert.equal((await send(saveBody())).status, 200);
    fixture.drafts.get(grammar.id)!.item = { ...grammar, answers: [] };
    const result = await send({ action: "publish", itemId: grammar.id });
    assert.equal(result.status, 400); assert.equal(result.body.stage, "schema");
    assert.equal(fixture.starts.length, 0);
    assert.equal(fixture.drafts.get(grammar.id)!.status, "check_failed");
  });
  it("a schema-coherent but unknown grammar structure is not a unit-catalog entry", async () => {
    const item = { ...grammar, id: "g2u03.gi.not-in-catalog.mc.001", structureId: "g2u03.s.not-in-catalog" };
    const result = await send(saveBody("grammar", item));
    assert.equal(result.status, 400);
    assert.match(JSON.stringify(result.body.errors), /Struktur/);
    assert.equal(fixture.writes.length, 0); assert.equal(fixture.starts.length, 0);
  });
  it("the journal import resolves to the existing repo package, not a phantom path", () => {
    assert.equal(existsSync(new URL(journalURL)), true);
    const source = readFileSync(new URL("./route.ts", import.meta.url), "utf8");
    const path = /from "([^"]+content-check-journal\.ts)"/.exec(source)?.[1];
    assert.ok(path);
    assert.equal(new URL(path, new URL("./route.ts", import.meta.url)).href, journalURL);
  });
});
