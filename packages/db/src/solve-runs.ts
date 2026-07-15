/**
 * @domigo/db · S-2b async blind-solve runs (migration 0011). One row per
 * publish attempt through the sandbox gate: created 'running' before the Vercel
 * Sandbox spins up, flipped to a terminal state by the poll once the sandbox
 * produces an answer (the platform grades it) or dies. Pure data access — the
 * sandbox orchestration + grading live in apps/web (studio-solve-sandbox.ts).
 */
import { desc, eq } from "drizzle-orm";
import type { Db } from "./index.ts";
import { v2ContentSolveRuns } from "./schema.ts";

export type SolveRunStatus = "running" | "passed" | "blocked" | "failed";

export interface SolveRunRow {
  id: string;
  itemId: string;
  unitSlug: string;
  kind: string;
  model: string;
  status: string;
  sandboxId: string | null;
  answer: unknown;
  gradedTier: string | null;
  errorMessage: string | null;
  numTurns: number | null;
  createdAt: Date;
  completedAt: Date | null;
}

/** Create the run row (status='running') BEFORE the sandbox is spun up, so the
 *  runId exists before the long-running work starts (SRDP pattern). */
export async function createSolveRun(
  db: Db,
  args: { itemId: string; unitSlug: string; kind: string; model: string; triggeredBy: string | null },
): Promise<string> {
  const rows = await db
    .insert(v2ContentSolveRuns)
    .values({ itemId: args.itemId, unitSlug: args.unitSlug, kind: args.kind, model: args.model, status: "running", triggeredBy: args.triggeredBy })
    .returning({ id: v2ContentSolveRuns.id });
  return rows[0]!.id;
}

export async function loadSolveRun(db: Db, runId: string): Promise<SolveRunRow | null> {
  const rows = await db.select().from(v2ContentSolveRuns).where(eq(v2ContentSolveRuns.id, runId)).limit(1);
  return (rows[0] as SolveRunRow) ?? null;
}

export async function latestSolveRunForItem(db: Db, itemId: string): Promise<SolveRunRow | null> {
  const rows = await db
    .select()
    .from(v2ContentSolveRuns)
    .where(eq(v2ContentSolveRuns.itemId, itemId))
    .orderBy(desc(v2ContentSolveRuns.createdAt))
    .limit(1);
  return (rows[0] as SolveRunRow) ?? null;
}

/** Persist the sandbox id (for reconnect + the Vercel dashboard link). */
export async function setSolveRunSandbox(db: Db, runId: string, sandboxId: string): Promise<void> {
  await db.update(v2ContentSolveRuns).set({ sandboxId }).where(eq(v2ContentSolveRuns.id, runId));
}

/** Terminal success/blocked update after the platform grades the AI's answer.
 *  status='passed' (top candidate graded correct) or 'blocked' (not correct). */
export async function completeSolveRun(
  db: Db,
  runId: string,
  args: {
    status: "passed" | "blocked";
    answer: unknown;
    gradedTier: string | null;
    costUsd: number | null;
    inputTokens: number | null;
    outputTokens: number | null;
    numTurns: number | null;
  },
): Promise<void> {
  await db
    .update(v2ContentSolveRuns)
    .set({
      status: args.status,
      answer: args.answer,
      gradedTier: args.gradedTier,
      costUsd: args.costUsd != null ? args.costUsd.toFixed(6) : null,
      inputTokens: args.inputTokens,
      outputTokens: args.outputTokens,
      numTurns: args.numTurns,
      completedAt: new Date(),
    })
    .where(eq(v2ContentSolveRuns.id, runId));
}

/** Terminal failure (sandbox error, timeout, unreachable). */
export async function failSolveRun(db: Db, runId: string, errorMessage: string): Promise<void> {
  await db
    .update(v2ContentSolveRuns)
    .set({ status: "failed", errorMessage: errorMessage.slice(0, 8000), completedAt: new Date() })
    .where(eq(v2ContentSolveRuns.id, runId));
}
