// apps/web/scripts/sandbox/run-blindsolve.mjs — the S-2b blind-solve entrypoint.
//
// Runs INSIDE a Vercel Sandbox. The orchestrator (apps/web/lib/studio-solve-
// sandbox.ts) writes this file + the domigo-blind-solve skill + payload.md into
// the sandbox, `npm install`s @anthropic-ai/claude-agent-sdk, then runs this via
// `node /vercel/sandbox/runner.mjs`.
//
// Adapted from srdp-practice/scripts/sandbox/run-correction.mjs (the proven
// writing-correction pattern). Differences: the skill emits a tiny JSON answer
// (not markdown), and the PLATFORM grades it through @domigo/engine afterwards —
// the sandbox never sees the key and never grades. That keeps the one grading
// brain on the platform side.
//
// Auth (provide ONE — subscription preferred): CLAUDE_CODE_OAUTH_TOKEN
// (`claude setup-token`, bills to the Claude.ai subscription) or
// ANTHROPIC_API_KEY. The bundled Claude Code checks the OAuth token first.
//
// Env: MODEL (required), THINKING (optional; "adaptive" default).
//
// Outputs under /vercel/sandbox/output/:
//   - answer.json  ← { candidates: [{ answer, confidence }] } — the AI's answer
//   - meta.json    ← { status, totalCostUsd, inputTokens, outputTokens, numTurns,
//                      candidates?, error? }
//
// Exit 0 = success (answer.json valid); 1 = failure (meta.json.status="error").

import { query } from "@anthropic-ai/claude-agent-sdk";
import { readFile, writeFile, mkdir, stat } from "node:fs/promises";

const SANDBOX_ROOT = "/vercel/sandbox";
const PAYLOAD_PATH = `${SANDBOX_ROOT}/payload.md`;
const OUTPUT_DIR = `${SANDBOX_ROOT}/output`;
const ANSWER_JSON = `${OUTPUT_DIR}/answer.json`;
const META_JSON = `${OUTPUT_DIR}/meta.json`;

const MODEL = process.env.MODEL;
const THINKING = process.env.THINKING || "adaptive";
const CLAUDE_CODE_OAUTH_TOKEN = process.env.CLAUDE_CODE_OAUTH_TOKEN;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// Kept in sync with apps/web/lib/studio-solver-models.ts.
const SUPPORTED_MODELS = new Set(["claude-sonnet-5", "claude-opus-4-8", "claude-haiku-4-5-20251001"]);

async function fileExists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function writeMeta(meta) {
  try {
    await mkdir(OUTPUT_DIR, { recursive: true });
    await writeFile(META_JSON, JSON.stringify(meta, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to write meta.json:", err);
  }
}

/** A candidates payload is valid iff it parses and has ≥1 {answer:string} entry. */
function parseCandidates(raw) {
  const obj = JSON.parse(raw);
  if (!obj || !Array.isArray(obj.candidates) || obj.candidates.length === 0) {
    throw new Error("answer.json has no non-empty `candidates` array");
  }
  const candidates = obj.candidates
    .slice(0, 3)
    .map((c) => ({
      answer: String(c?.answer ?? ""),
      confidence: Math.min(1, Math.max(0, Number(c?.confidence ?? 0.5))),
    }))
    .filter((c) => c.answer.length > 0);
  if (candidates.length === 0) throw new Error("answer.json candidates all had empty `answer`");
  return candidates;
}

function buildPrompt(payload) {
  return `Run the \`domigo-blind-solve\` skill on the ONE English exercise below.

The exercise is also at \`/vercel/sandbox/payload.md\`. It is exactly what a
student sees in the app — there is NO answer key anywhere in it, by design.
Solve it BLIND, as a diligent Austrian AHS student at the payload's grade would,
and write your answer(s) to this EXACT path as the skill specifies:

  \`/vercel/sandbox/output/answer.json\`  →  { "candidates": [ { "answer": "…", "confidence": 0.0 } ] }

Think hard about the grammar/vocabulary before you commit. Output ONLY
answer.json — no other files, no prose. The sandbox is unattended: make your
best attempt and write the file; never pause to ask.

---

${payload}`;
}

const SYSTEM_APPEND = `
You are operating UNATTENDED in a sandbox, running the domigo-blind-solve skill. Rules that override any tendency toward brevity or cleverness:

1. SOLVE BLIND. There is no answer key in your input — never invent, assume, or search for one. Your job is to produce the answer a real, competent student at the target grade would submit, so the platform can check the teacher's key against it.

2. ANSWER AS THE STUDENT, NOT THE EXAMINER. Give the natural correct answer a target-level student would write. Do NOT produce obscure "technically valid" answers a student would never use — that defeats the check.

3. EXACT OUTPUT SHAPE. Write ONLY \`/vercel/sandbox/output/answer.json\`, a single JSON object: { "candidates": [ { "answer": "<exact text to type>", "confidence": <0..1> } ] }. candidates[0] is the answer you would actually submit. For a choice exercise, "answer" is the exact text of one option. For multiple boxes, join the fills with " | " in order. Include a 2nd/3rd candidate ONLY if it is genuinely defensible as also correct.

4. NOTHING ELSE. No other files. No prose or markdown inside answer.json. No WebFetch/WebSearch.

Use extended thinking to reason the item through before writing the file.`;

async function main() {
  if (!CLAUDE_CODE_OAUTH_TOKEN && !ANTHROPIC_API_KEY) {
    await writeMeta({ status: "error", error: "No auth: set CLAUDE_CODE_OAUTH_TOKEN (subscription, preferred) or ANTHROPIC_API_KEY" });
    process.exit(1);
  }
  if (!MODEL || !SUPPORTED_MODELS.has(MODEL)) {
    await writeMeta({ status: "error", error: `MODEL "${MODEL}" not in supported set` });
    process.exit(1);
  }
  if (!(await fileExists(PAYLOAD_PATH))) {
    await writeMeta({ status: "error", error: `payload.md not found at ${PAYLOAD_PATH}` });
    process.exit(1);
  }
  await mkdir(OUTPUT_DIR, { recursive: true });

  const payload = await readFile(PAYLOAD_PATH, "utf8");
  const prompt = buildPrompt(payload);

  let totalCostUsd = null;
  let inputTokens = null;
  let outputTokens = null;
  let numTurns = null;
  let stopReason = null;
  let isError = false;
  let errorMessage = null;
  const writtenFiles = [];
  const assistantTextChunks = [];

  try {
    for await (const message of query({
      prompt,
      options: {
        model: MODEL,
        skills: ["domigo-blind-solve"],
        cwd: SANDBOX_ROOT,
        settingSources: ["user", "project"],
        permissionMode: "acceptEdits",
        allowedTools: ["Read", "Write", "Glob", "Skill"],
        // Adaptive lets Claude reason as deeply as the item needs, capped by the
        // model ceiling — the "high thinking" behaviour for a solve task.
        thinking: { type: THINKING },
        systemPrompt: { append: SYSTEM_APPEND },
        hooks: {
          PostToolUse: [
            {
              hooks: [
                async (input) => {
                  if (input.tool_name === "Write") {
                    const p = input.tool_input?.file_path ?? input.tool_input?.path;
                    if (typeof p === "string") writtenFiles.push(p);
                  }
                  return {};
                },
              ],
            },
          ],
        },
      },
    })) {
      if (message.type === "assistant") {
        const usage = message.message?.usage;
        if (usage) {
          inputTokens = usage.input_tokens ?? inputTokens;
          outputTokens = usage.output_tokens ?? outputTokens;
        }
        const content = message.message?.content;
        if (Array.isArray(content)) {
          for (const block of content) {
            if (block.type === "text" && typeof block.text === "string") {
              assistantTextChunks.push(block.text);
              console.log(`[runner] ${block.text.slice(0, 300)}${block.text.length > 300 ? "…" : ""}`);
            }
          }
        }
      }
      if (message.type === "result") {
        stopReason = message.stop_reason ?? null;
        numTurns = message.num_turns ?? null;
        isError = message.is_error === true;
        if (message.subtype === "success") {
          totalCostUsd = message.total_cost_usd ?? null;
          if (message.usage) {
            inputTokens = message.usage.input_tokens ?? inputTokens;
            outputTokens = message.usage.output_tokens ?? outputTokens;
          }
        } else {
          errorMessage = message.errors ? JSON.stringify(message.errors).slice(0, 1000) : `non-success result: ${message.subtype ?? "unknown"}`;
        }
        break;
      }
    }
  } catch (err) {
    isError = true;
    errorMessage = err instanceof Error ? err.message : String(err);
    console.error("Agent SDK threw:", err);
  }

  // ─── Read + validate the answer ───────────────────────────────────────────
  let candidates = null;
  let parseError = null;
  if (await fileExists(ANSWER_JSON)) {
    try {
      candidates = parseCandidates(await readFile(ANSWER_JSON, "utf8"));
    } catch (err) {
      parseError = err instanceof Error ? err.message : String(err);
    }
  }

  if (isError || candidates === null) {
    const ctx = `(stopReason=${stopReason ?? "?"} · turns=${numTurns ?? "?"} · writtenFiles=[${writtenFiles.join(", ")}]${parseError ? ` · parseError=${parseError}` : ""}${assistantTextChunks.length ? ` · assistant="${assistantTextChunks.join(" ").slice(0, 300)}"` : ""})`;
    await writeMeta({
      status: "error",
      error: isError ? `${errorMessage ?? "Agent SDK is_error"} ${ctx}` : `answer.json missing or invalid ${ctx}`,
      totalCostUsd,
      inputTokens,
      outputTokens,
      numTurns,
      stopReason,
    });
    process.exit(1);
  }

  await writeMeta({ status: "ok", candidates, totalCostUsd, inputTokens, outputTokens, numTurns, stopReason });
  console.log(`Done. candidates=${candidates.length} cost=$${(totalCostUsd ?? 0).toFixed(4)} in=${inputTokens} out=${outputTokens} turns=${numTurns}`);
  process.exit(0);
}

main().catch(async (err) => {
  console.error("Fatal error in runner:", err);
  await writeMeta({ status: "error", error: err instanceof Error ? err.message : String(err) });
  process.exit(1);
});
