// apps/web/lib/studio-solver-models.ts — pure constants for the S-2b sandbox
// blind-solve gate. Split from the orchestrator so a client component (the
// create form's model picker) can import the enum + labels WITHOUT pulling in
// @vercel/sandbox / @domigo/db (server-only).
//
// The model runs INSIDE the sandbox via @anthropic-ai/claude-agent-sdk, authed
// by the operator's CLAUDE_CODE_OAUTH_TOKEN (subscription). Sonnet 5 is the
// default (Koki, 2026-07-14: "Sonnet 5, high thinking").

export const STUDIO_SOLVER_MODELS = ["claude-sonnet-5", "claude-opus-4-8", "claude-haiku-4-5-20251001"] as const;
export type StudioSolverModel = (typeof STUDIO_SOLVER_MODELS)[number];

export const DEFAULT_STUDIO_SOLVER_MODEL: StudioSolverModel = "claude-sonnet-5";

export const STUDIO_SOLVER_MODEL_LABELS: Record<StudioSolverModel, string> = {
  "claude-sonnet-5": "Sonnet 5",
  "claude-opus-4-8": "Opus 4.8",
  "claude-haiku-4-5-20251001": "Haiku 4.5",
};

/** Per-model hint for the picker. The gate solves ONE small item, so runs are
 *  cheap + fast relative to a full writing correction. Rough estimates. */
export const STUDIO_SOLVER_MODEL_HINTS: Record<StudioSolverModel, string> = {
  "claude-sonnet-5": "~90s · balanced, the default gate",
  "claude-opus-4-8": "~2 min · strictest solver",
  "claude-haiku-4-5-20251001": "~60s · fastest",
};

export function isStudioSolverModel(s: unknown): s is StudioSolverModel {
  return typeof s === "string" && (STUDIO_SOLVER_MODELS as readonly string[]).includes(s);
}
