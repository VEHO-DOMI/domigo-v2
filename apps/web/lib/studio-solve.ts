import "server-only";
/**
 * S-2 · the Studio publish SOLVE-GATE — the live blind-solve half. A capable
 * model sees the framed item EXACTLY as the student does (never the keys — the
 * blind-solve doctrine, doc 17), answers it, and its answer is graded through
 * the SAME engine the pre-gate uses. PUBLISH IFF the answer it would actually
 * submit (highest-confidence candidate) grades "correct". If a competent
 * solver's best answer is wrong, the authored key doesn't match what a diligent
 * student produces (too narrow / ambiguous) and the item is blocked until fixed.
 *
 * server-only: the Anthropic SDK + ANTHROPIC_API_KEY must never enter a client
 * bundle (`pnpm check:bundle` proves it); the import above hard-fails any client
 * import, and the SDK is loaded via dynamic import only when a solve runs.
 *
 * systemPrompt + the JSON schema are replicated verbatim from the audit CLI
 * (scripts/audit/blind-solve.ts) and pinned to it by this comment; the frame
 * builder and grade mapping are shared, not re-implemented (./studio-gate.ts).
 */
import { buildSolvePrompt, type Frame, type GradedCandidate, type SolveCandidate } from "@domigo/content-pipeline/blind-solve";
import type { ItemKind } from "@domigo/content-loader";
import type { GrammarItem, VocabItem } from "@domigo/content-schema";
import { gradeAnswer, type GateStage } from "./studio-gate.ts";

const CANDIDATES_SCHEMA = {
  type: "object",
  properties: {
    candidates: {
      type: "array",
      items: {
        type: "object",
        properties: { answer: { type: "string" }, confidence: { type: "number" } },
        required: ["answer", "confidence"],
        additionalProperties: false,
      },
    },
  },
  required: ["candidates"],
  additionalProperties: false,
} as const;

const LEVEL: Record<string, string> = { g1: "A1", g2: "A1+", g3: "A2", g4: "A2+/B1" };

/** Replicated verbatim from scripts/audit/blind-solve.ts `systemPrompt`. */
function systemPrompt(grade: string): string {
  return [
    `You are simulating a diligent Austrian AHS student (grade ${grade.slice(1)}, MORE! coursebook, CEFR ~${LEVEL[grade] ?? "A2"}) solving ONE English exercise blind — you see exactly what the student sees, nothing else.`,
    "Return your best 1–3 candidate answers:",
    "- candidates[0] is what you would actually submit.",
    "- Add a 2nd/3rd candidate ONLY if it is genuinely defensible as also correct for this exercise.",
    "- confidence = your probability (0–1) that the candidate is an accepted correct answer.",
    "- Each answer is the exact text to type into the box(es), or the exact text of one option for choice exercises.",
    '- For multiple boxes, join the fills with " | " in order.',
  ].join("\n");
}

export interface SolveGateResult {
  ok: boolean;
  stage: GateStage; // "passed" | "blind-solve" (failed) | "no-solver"
  model: string | null;
  effort: string | null;
  /** every candidate the solver returned, graded through the engine. */
  candidates: GradedCandidate[];
  /** the candidate the solver would actually submit (highest confidence). */
  top: GradedCandidate | null;
  usage: { input: number; output: number } | null;
  note: string | null;
}

export interface SolveGateArgs {
  kind: ItemKind;
  item: VocabItem | GrammarItem;
  frame: Frame;
  /** grade token from the unit slug, e.g. "g2-u03" or "g2". */
  grade: string;
  model?: string;
  effort?: "low" | "medium" | "high";
}

/**
 * The live gate. Requires ANTHROPIC_API_KEY. A single blind solve of the item;
 * publishes IFF the solver's submitted answer grades "correct" through the
 * engine. NEVER throws for a normal solve — network/parse failures return a
 * BLOCKING result with a note (a publish must never proceed on a silent error).
 */
export async function solveGate(args: SolveGateArgs): Promise<SolveGateResult> {
  const model = args.model ?? process.env.STUDIO_SOLVER_MODEL ?? "claude-opus-4-8";
  const effort = args.effort ?? (process.env.STUDIO_SOLVER_EFFORT as SolveGateArgs["effort"]) ?? "medium";

  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      ok: false,
      stage: "no-solver",
      model: null,
      effort: null,
      candidates: [],
      top: null,
      usage: null,
      note: "ANTHROPIC_API_KEY is not set — the solvability gate cannot run, so publish is blocked.",
    };
  }

  const grade = normalizeGrade(args.grade);
  const prompt = buildSolvePrompt(args.frame);
  let candidates: SolveCandidate[] = [];
  let usage: { input: number; output: number } | null = null;
  try {
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    const client = new Anthropic();
    // Newer request shape (adaptive thinking + structured output + effort),
    // identical to the audit's live solver. Cast because these fields are ahead
    // of the SDK's stable param types; the runtime API accepts them.
    const res = await client.messages.create({
      model,
      max_tokens: 8192,
      thinking: { type: "adaptive" },
      output_config: { effort, format: { type: "json_schema", schema: CANDIDATES_SCHEMA } },
      system: systemPrompt(grade),
      messages: [{ role: "user", content: prompt }],
    } as unknown as Parameters<typeof client.messages.create>[0]);
    const message = res as unknown as {
      content: Array<{ type: string; text?: string }>;
      stop_reason: string | null;
      usage: { input_tokens: number; output_tokens: number };
    };
    usage = { input: message.usage.input_tokens, output: message.usage.output_tokens };
    if (message.stop_reason !== "end_turn") {
      return blockedSolve(model, effort, usage, `solver stopped early (stop_reason=${message.stop_reason})`);
    }
    const text = message.content.find((b) => b.type === "text")?.text ?? "";
    const parsed = JSON.parse(text) as { candidates: SolveCandidate[] };
    candidates = parsed.candidates
      .slice(0, 3)
      .map((c) => ({ answer: String(c.answer), confidence: Math.min(1, Math.max(0, Number(c.confidence))) }));
  } catch (err) {
    return blockedSolve(model, effort, usage, `solver error: ${err instanceof Error ? err.message : String(err)}`);
  }

  const graded: GradedCandidate[] = candidates.map((c) => ({ ...c, tier: gradeAnswer(args.kind, args.item, args.frame, c.answer) }));
  const top = [...graded].sort((a, b) => b.confidence - a.confidence)[0] ?? null;
  const ok = top !== null && top.tier === "correct";
  return {
    ok,
    stage: ok ? "passed" : "blind-solve",
    model,
    effort,
    candidates: graded,
    top,
    usage,
    note: ok
      ? null
      : top === null
        ? "the solver returned no usable answer"
        : `the solver's submitted answer "${top.answer}" grades "${top.tier}", not "correct" — the key may be too narrow or the item ambiguous`,
  };
}

function blockedSolve(model: string, effort: string, usage: { input: number; output: number } | null, note: string): SolveGateResult {
  return { ok: false, stage: "blind-solve", model, effort, candidates: [], top: null, usage, note };
}

/** normalize a grade token (e.g. "g2-u03" or "g2") to the g1..g4 systemPrompt key. */
function normalizeGrade(raw: string): string {
  const m = /^(g[1-4])/.exec(raw);
  return m?.[1] ?? "g2";
}
