import assert from "node:assert/strict";
import { it } from "node:test";
import { runInNewContext } from "node:vm";
import { BATCH_RUNNER_SOURCE } from "./studio-batch-runner.ts";

async function exercise(options: { missing?: number; throws?: boolean; unsuccessful?: boolean; noAuth?: boolean } = {}) {
  const tasks = Array.from({ length: 20 }, (_, i) => ({ key: `00000000-0000-4000-8000-${String(i).padStart(12, "0")}`, prompt: `Synthetic question ${i}` }));
  const files = new Map<string, string>();
  files.set("/vercel/sandbox/payload.json", JSON.stringify(tasks));
  let queries = 0;
  const query = async function* (request: { prompt: string; options: Record<string, unknown> }) {
    queries++;
    assert.ok(tasks.every((task) => request.prompt.includes(task.prompt) && request.prompt.includes(task.key)));
    assert.match(request.prompt, /one after another/);
    assert.equal(JSON.stringify(request.options.thinking), '{"type":"adaptive"}');
    assert.equal(JSON.stringify(request.options.allowedTools), '["Read","Write"]');
    assert.equal(request.options.model, "synthetic-model");
    if (options.throws) throw new Error("private SDK failure must never reach meta");
    for (const [i, task] of tasks.entries()) if (i !== options.missing) files.set(`/vercel/sandbox/output/${task.key}.json`, JSON.stringify({ candidates: [{ answer: `Answer ${i}`, confidence: .99 }] }));
    yield { type: "result", subtype: options.unsuccessful ? "error" : "success", is_error: !!options.unsuccessful, total_cost_usd: .1, usage: { input_tokens: 500, output_tokens: 100 } };
  };
  // Execute the exact embedded runner with only SDK/filesystem boundaries replaced.
  const executable = BATCH_RUNNER_SOURCE.replace(/^import .*;$/gm, "").replace("await main();", "main();");
  await runInNewContext(executable, {
    query, process: { env: options.noAuth ? {} : { CLAUDE_CODE_OAUTH_TOKEN: "synthetic", MODEL: "synthetic-model" } },
    mkdir: async () => {},
    readFile: async (path: string) => { if (!files.has(path)) throw new Error("missing"); return files.get(path); },
    writeFile: async (path: string, content: string) => { files.set(path, content); },
  });
  return { queries, tasks, meta: JSON.parse(files.get("/vercel/sandbox/output/meta.json")!) };
}

it("twenty tasks execute exactly one model query and retain twenty keyed answers", async () => {
  const result = await exercise(); assert.equal(result.queries, 1); assert.equal(result.meta.status, "ok");
  assert.equal(result.meta.results.length, 20);
  for (const [i, task] of result.tasks.entries()) assert.deepEqual(result.meta.results[i], { key: task.key, status: "ok", candidates: [{ answer: `Answer ${i}`, confidence: .99 }] });
});
it("one missing answer is an item error while the nineteen other answers survive", async () => {
  const result = await exercise({ missing: 7 }); assert.equal(result.queries, 1); assert.equal(result.meta.status, "ok");
  assert.equal(result.meta.results.filter((r: { status: string }) => r.status === "ok").length, 19);
  assert.deepEqual(result.meta.results[7], { key: result.tasks[7]!.key, status: "error" });
});
for (const option of ["throws", "unsuccessful", "noAuth"] as const) it(`runner ${option} produces a sanitized error without a content judgment`, async () => {
  const result = await exercise({ [option]: true }); assert.deepEqual(result.meta, { status: "error" });
  assert.equal(result.queries, option === "noAuth" ? 0 : 1);
});
