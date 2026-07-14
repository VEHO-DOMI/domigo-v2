import "server-only";
/**
 * S-2b · the sandbox blind-solve gate orchestrator. Adapts SRDP's proven
 * writing-correction runner (~/Code/srdp-practice/lib/correction-runner.ts) to
 * the DomiGo publish gate.
 *
 * A capable model (Sonnet 5 by default) solves the teacher's task BLIND inside a
 * Vercel Sandbox, authed by the operator's CLAUDE_CODE_OAUTH_TOKEN (Claude
 * subscription — NOT a per-token API key). The sandbox writes the AI's answer;
 * THE PLATFORM grades it through @domigo/engine (the sandbox never sees the
 * key). The draft publishes IFF the answer the AI would submit grades "correct".
 *
 * Decoupled fire-and-poll (a run outlives a serverless function):
 *   startSolveRun(runId) — POST handler: preGate → payload → spawn sandbox →
 *     write skill + payload + runner → npm install → run DETACHED → return.
 *   pollSolveRun(runId)  — poll handler: reconnect → read the answer → grade →
 *     journal-then-flip (record the check, then publish or block the draft).
 *
 * server-only: the OAuth token + @vercel/sandbox never reach a client bundle.
 */
import { Sandbox } from "@vercel/sandbox";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { Writable } from "node:stream";
import {
  completeSolveRun,
  failSolveRun,
  getDb,
  loadDraft,
  loadSolveRun,
  recordCheck,
  setDraftStatus,
  setSolveRunSandbox,
} from "@domigo/db";
import { buildSolvePrompt, type Frame } from "@domigo/content-pipeline/blind-solve";
import { normalizePatchColumn, type ItemKind } from "@domigo/content-loader";
import type { GrammarItem, VocabItem } from "@domigo/content-schema";
import { gradeAnswer, preGate } from "./studio-gate.ts";

const SANDBOX_ROOT = "/vercel/sandbox";
// A blind-solve of ONE item is far lighter than an essay correction; 6 min
// comfortably covers sandbox boot + npm install + a Sonnet 5 solve with room
// to spare. Must stay under the poll's stale threshold.
const SANDBOX_TIMEOUT_MS = 6 * 60 * 1000;
const RUN_STALE_MS = SANDBOX_TIMEOUT_MS + 60_000;
const SANDBOX_VCPUS = 2;
const SANDBOX_PACKAGE_JSON = {
  name: "blindsolve-sandbox-runner",
  version: "1.0.0",
  private: true,
  type: "module",
  dependencies: { "@anthropic-ai/claude-agent-sdk": "^0.3.142" },
};
const SKILL_REL = "skills/domigo-blind-solve/SKILL.md";
const RUNNER_REL = "scripts/sandbox/run-blindsolve.mjs";

/** Strip all internal whitespace from an auth token (a terminal word-wrap can
 *  paste a real \n, which HTTP headers reject). SRDP lesson, 2026-05-16. */
function sanitizeToken(raw: string | undefined): string | null {
  if (!raw) return null;
  const cleaned = raw.replace(/\s+/g, "");
  return cleaned.length > 0 ? cleaned : null;
}

function captureWritable(capture: { content: string }): Writable {
  return new Writable({
    write(chunk, _enc, cb) {
      capture.content = (capture.content + String(chunk)).slice(-16_384);
      cb();
    },
  });
}

/** The student-view payload the sandbox solves — frontmatter + the exact
 *  task-ui projection (buildSolvePrompt). No key, by construction. */
function buildSolvePayload(kind: ItemKind, frame: Frame, unitSlug: string): string {
  const grade = /^(g[1-4])/.exec(unitSlug)?.[1] ?? "g2";
  return `---\ngrade: ${grade}\nkind: ${kind}\nformat: ${frame.format}\n---\n\n${buildSolvePrompt(frame)}\n`;
}

type SandboxMeta = {
  status: "ok" | "error";
  error?: string;
  candidates?: Array<{ answer: string; confidence: number }>;
  totalCostUsd?: number | null;
  inputTokens?: number | null;
  outputTokens?: number | null;
  numTurns?: number | null;
};

// ─── Phase 1 · start (POST) ────────────────────────────────────────────────

/**
 * Setup + kick off the detached runner. The run row already exists
 * (status='running'). Throws on unrecoverable setup failure AFTER marking the
 * run failed. The sandbox keeps executing independently once this returns.
 */
export async function startSolveRun(runId: string): Promise<void> {
  const db = getDb();
  const run = await loadSolveRun(db, runId);
  if (!run) throw new Error(`solve run ${runId} not found`);
  if (run.status !== "running") throw new Error(`solve run ${runId} is "${run.status}", expected "running"`);

  const draft = await loadDraft(db, run.itemId);
  if (!draft) {
    await failSolveRun(db, runId, `draft ${run.itemId} not found`);
    return;
  }
  const kind = run.kind as ItemKind;
  const item = normalizePatchColumn(draft.item) as VocabItem | GrammarItem;

  // Re-run the free pre-gate to get the frame (and re-assert solvability).
  const pre = preGate(kind, item);
  if (!pre.ok || !pre.frame) {
    await failSolveRun(db, runId, `pre-gate failed at start: ${pre.stage} — ${pre.errors.join("; ")}`);
    return;
  }
  const payload = buildSolvePayload(kind, pre.frame, run.unitSlug);

  const oauthToken = sanitizeToken(process.env.CLAUDE_CODE_OAUTH_TOKEN);
  const apiKey = sanitizeToken(process.env.ANTHROPIC_API_KEY);
  if (!oauthToken && !apiKey) {
    await failSolveRun(db, runId, "No auth configured: set CLAUDE_CODE_OAUTH_TOKEN (subscription, via `claude setup-token`) in the Vercel environment");
    return;
  }

  const repoRoot = process.cwd();
  const skillBuf = await readFile(path.join(repoRoot, SKILL_REL));
  const runnerBuf = await readFile(path.join(repoRoot, RUNNER_REL));

  let sandbox: Sandbox | null = null;
  try {
    sandbox = await Sandbox.create({ runtime: "node22", resources: { vcpus: SANDBOX_VCPUS }, timeout: SANDBOX_TIMEOUT_MS });
    await setSolveRunSandbox(db, runId, sandbox.sandboxId);

    // The Agent SDK discovers skills at `${cwd}/.claude/skills/<name>/` — write
    // the committed skill source into the sandbox's ephemeral .claude tree.
    await sandbox.fs.mkdir(`${SANDBOX_ROOT}/.claude/skills/domigo-blind-solve`, { recursive: true });
    await sandbox.fs.mkdir(`${SANDBOX_ROOT}/output`, { recursive: true });
    await sandbox.fs.writeFile(`${SANDBOX_ROOT}/.claude/skills/domigo-blind-solve/SKILL.md`, skillBuf);
    await sandbox.fs.writeFile(`${SANDBOX_ROOT}/runner.mjs`, runnerBuf);
    await sandbox.fs.writeFile(`${SANDBOX_ROOT}/payload.md`, Buffer.from(payload, "utf8"));
    await sandbox.fs.writeFile(`${SANDBOX_ROOT}/package.json`, Buffer.from(JSON.stringify(SANDBOX_PACKAGE_JSON, null, 2), "utf8"));

    const install = { content: "" };
    const installResult = await sandbox.runCommand({
      cmd: "npm",
      args: ["install", "--no-audit", "--no-fund", "--loglevel=error"],
      cwd: SANDBOX_ROOT,
      stdout: captureWritable(install),
      stderr: captureWritable(install),
    });
    if (installResult.exitCode !== 0) {
      throw new Error(`npm install failed (exit ${installResult.exitCode})\n${install.content.slice(-2000)}`);
    }

    const env: Record<string, string> = { MODEL: run.model, THINKING: process.env.STUDIO_SOLVER_THINKING || "adaptive" };
    if (oauthToken) env.CLAUDE_CODE_OAUTH_TOKEN = oauthToken;
    if (apiKey) env.ANTHROPIC_API_KEY = apiKey;

    // Detached: resolves immediately; the sandbox keeps running independently.
    await sandbox.runCommand({ cmd: "node", args: ["runner.mjs"], cwd: SANDBOX_ROOT, env, detached: true });
  } catch (err) {
    await failSolveRun(db, runId, err instanceof Error ? err.message : String(err));
    if (sandbox) await sandbox.stop().catch(() => {});
    throw err;
  }
  // No finally-stop: the sandbox must keep running for pollSolveRun to read it.
}

// ─── Phase 2 · poll (grade + flip) ─────────────────────────────────────────

export type PollResult = { kind: "running" | "passed" | "blocked" | "failed"; note?: string };

/** Reconnect to the sandbox, and once the runner has produced its answer, grade
 *  it through @domigo/engine and journal-then-flip the draft. Idempotent. */
export async function pollSolveRun(runId: string): Promise<PollResult> {
  const db = getDb();
  const run = await loadSolveRun(db, runId);
  if (!run) return { kind: "failed", note: "run not found" };
  if (run.status !== "running") return { kind: run.status as PollResult["kind"] };
  if (!run.sandboxId) return { kind: "running" };

  let sandbox: Sandbox;
  try {
    sandbox = await Sandbox.get({ sandboxId: run.sandboxId });
  } catch (err) {
    const elapsed = Date.now() - run.createdAt.getTime();
    if (elapsed < 60_000) return { kind: "running" }; // transient just after startup
    await failSolveRun(db, runId, `sandbox unreachable after ${Math.round(elapsed / 1000)}s: ${err instanceof Error ? err.message : String(err)}`);
    await setDraftStatus(db, run.itemId, "check_failed").catch(() => {});
    return { kind: "failed" };
  }

  // meta.json is written LAST by the runner — its presence = "runner finished".
  let metaStr: string;
  try {
    metaStr = await sandbox.fs.readFile(`${SANDBOX_ROOT}/output/meta.json`, "utf8");
  } catch {
    if (Date.now() - run.createdAt.getTime() > RUN_STALE_MS) {
      await failSolveRun(db, runId, `sandbox reached its ${Math.round(SANDBOX_TIMEOUT_MS / 60_000)}-min timeout without producing an answer`);
      await setDraftStatus(db, run.itemId, "check_failed").catch(() => {});
      return { kind: "failed" };
    }
    return { kind: "running" };
  }

  let meta: SandboxMeta;
  try {
    meta = JSON.parse(metaStr) as SandboxMeta;
  } catch (err) {
    await failSolveRun(db, runId, `meta.json is not valid JSON: ${err instanceof Error ? err.message : String(err)}`);
    await setDraftStatus(db, run.itemId, "check_failed").catch(() => {});
    return { kind: "failed" };
  }
  await sandbox.stop().catch(() => {}); // extracted what we need; free the box

  if (meta.status === "error" || !Array.isArray(meta.candidates) || meta.candidates.length === 0) {
    await failSolveRun(db, runId, meta.error?.slice(0, 8000) ?? "runner produced no candidates");
    await setDraftStatus(db, run.itemId, "check_failed").catch(() => {});
    return { kind: "failed", note: meta.error ?? undefined };
  }

  // ── grade the AI's answer through the engine (the platform, one brain) ──
  const draft = await loadDraft(db, run.itemId);
  if (!draft) {
    await failSolveRun(db, runId, "draft vanished before grading");
    return { kind: "failed" };
  }
  const kind = run.kind as ItemKind;
  const item = normalizePatchColumn(draft.item) as VocabItem | GrammarItem;
  const pre = preGate(kind, item);
  if (!pre.ok || !pre.frame) {
    await failSolveRun(db, runId, `pre-gate failed at grade time: ${pre.stage}`);
    await setDraftStatus(db, run.itemId, "check_failed").catch(() => {});
    return { kind: "failed" };
  }
  const graded = meta.candidates
    .map((c) => ({ answer: String(c.answer), confidence: Math.min(1, Math.max(0, Number(c.confidence))), tier: gradeAnswer(kind, item, pre.frame!, String(c.answer)) }))
    .sort((a, b) => b.confidence - a.confidence);
  const top = graded[0]!;
  const passed = top.tier === "correct";

  const evidence = { model: run.model, candidates: graded, top, cost: meta.totalCostUsd ?? null, inputTokens: meta.inputTokens ?? null, outputTokens: meta.outputTokens ?? null };
  // journal-then-flip: record the check FIRST, then move the draft.
  await recordCheck(db, { draftId: draft.id, checkKind: "blind_solve", verdict: passed ? "pass" : "fail", evidence });
  await completeSolveRun(db, runId, {
    status: passed ? "passed" : "blocked",
    answer: graded,
    gradedTier: top.tier,
    costUsd: meta.totalCostUsd ?? null,
    inputTokens: meta.inputTokens ?? null,
    outputTokens: meta.outputTokens ?? null,
    numTurns: meta.numTurns ?? null,
  });
  await setDraftStatus(db, run.itemId, passed ? "published" : "check_failed");
  return { kind: passed ? "passed" : "blocked", note: passed ? undefined : `the solver's answer "${top.answer}" graded "${top.tier}"` };
}
