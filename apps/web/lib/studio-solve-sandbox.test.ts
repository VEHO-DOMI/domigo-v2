/** cgo-100 · Exercise the real Sandbox transport against an in-memory SDK
 * boundary. No provider, account, database or network call is available. */
import assert from "node:assert/strict";
import * as nodeModule from "node:module";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, describe, it } from "node:test";
import type { Writable } from "node:stream";
import type { Frame } from "@domigo/content-pipeline/blind-solve";

type HookContext = { parentURL?: string };
type HookResolution = { url: string; shortCircuit?: boolean };
type ResolveHook = (specifier: string, context: HookContext, next: (specifier: string, context: HookContext) => HookResolution) => HookResolution;
const { registerHooks } = nodeModule as unknown as { registerHooks(hooks: { resolve: ResolveHook }): void };

interface Command {
  cmd: string; args: string[]; cwd: string; detached?: boolean;
  env?: Record<string, string>; stdout?: Writable; stderr?: Writable;
}
const PRIVATE_DETAIL = "synthetic-provider-detail-never-return-to-client";
const fixture = {
  creates: [] as unknown[], gets: [] as string[], events: [] as string[], commands: [] as Command[],
  files: new Map<string, Buffer>(), readPaths: [] as string[], stopped: 0,
  installExit: 0, createFails: false, getFails: false, runFails: false, stopFails: false,
  meta: null as string | null,
};
const sandbox = {
  sandboxId: "synthetic-sandbox-handle",
  fs: {
    async mkdir(_directory: string, _options: unknown) { fixture.events.push("mkdir"); },
    async writeFile(destination: string, bytes: Buffer) { fixture.files.set(destination, Buffer.from(bytes)); fixture.events.push("write"); },
    async readFile(destination: string, encoding: string) {
      fixture.readPaths.push(destination);
      assert.equal(encoding, "utf8");
      if (fixture.meta === null) throw new Error(PRIVATE_DETAIL);
      return fixture.meta;
    },
  },
  async runCommand(command: Command) {
    fixture.commands.push(command);
    fixture.events.push(command.cmd === "npm" ? "install" : "detached-run");
    if (command.cmd === "npm") {
      if (fixture.installExit) command.stderr?.write(PRIVATE_DETAIL);
      return { exitCode: fixture.installExit };
    }
    if (fixture.runFails) throw new Error(PRIVATE_DETAIL);
    return { exitCode: 0 };
  },
  async stop() {
    fixture.events.push("stop"); fixture.stopped++;
    if (fixture.stopFails) throw new Error(PRIVATE_DETAIL);
  },
};
const boundary = {
  async create(options: unknown) {
    fixture.creates.push(options); fixture.events.push("create");
    if (fixture.createFails) throw new Error(PRIVATE_DETAIL);
    return sandbox;
  },
  async get(options: { sandboxId: string }) {
    fixture.gets.push(options.sandboxId);
    if (fixture.getFails) throw new Error(PRIVATE_DETAIL);
    return sandbox;
  },
};
const globalKey = "__cgo100SandboxTransportBoundary";
(globalThis as Record<string, unknown>)[globalKey] = boundary;
registerHooks({
  resolve(specifier, context, next) {
    if (specifier === "server-only") return { shortCircuit: true, url: "data:text/javascript,export {};" };
    if (specifier === "@vercel/sandbox") return { shortCircuit: true,
      url: `data:text/javascript,${encodeURIComponent(`const b = globalThis[${JSON.stringify(globalKey)}]; export const Sandbox = { create: b.create, get: b.get };`)}` };
    return next(specifier, context);
  },
});
const { startSandboxFrame, pollSandboxFrame, stopSandboxFrame } = await import("./studio-solve-sandbox.ts");

const frame: Frame = { itemId: "synthetic-frame", kind: "grammar", format: "gap-fill",
  lines: ["They ___ outside every day."], input: { kind: "text", blanks: 1 }, glosses: [], direction: null, structure: null };
const task = { kind: "grammar" as const, frame, unitSlug: "g2-u03", model: "claude-sonnet-5",
  item: { answers: [{ text: "synthetic-private-answer-key", tier: "full" }], hintDe: "synthetic-private-hint" } };
const remember = async (id: string) => { assert.equal(id, sandbox.sandboxId); fixture.events.push("remembered"); };
const now = () => new Date();
const environmentNames = ["CLAUDE_CODE_OAUTH_TOKEN", "ANTHROPIC_API_KEY", "OPENAI_API_KEY", "VERCEL_TOKEN", "VERCEL_OIDC_TOKEN", "VERCEL_TEAM_ID", "VERCEL_PROJECT_ID", "VERCEL_ORG_ID"] as const;
let environmentBefore: Array<readonly [string, string | undefined]> = [];
let previousCwd = "";
beforeEach(() => {
  environmentBefore = environmentNames.map((name) => [name, process.env[name]] as const);
  for (const name of environmentNames) delete process.env[name];
  process.env.CLAUDE_CODE_OAUTH_TOKEN = " synthetic \n subscription \t fixture ";
  previousCwd = process.cwd();
  process.chdir(fileURLToPath(new URL("../", import.meta.url)));
  for (const list of [fixture.creates, fixture.gets, fixture.events, fixture.commands, fixture.readPaths]) list.length = 0;
  fixture.files.clear(); fixture.stopped = 0; fixture.installExit = 0;
  fixture.createFails = false; fixture.getFails = false; fixture.runFails = false; fixture.stopFails = false; fixture.meta = null;
});
afterEach(() => {
  for (const [name, value] of environmentBefore) {
    if (value === undefined) delete process.env[name];
    else process.env[name] = value;
  }
  process.chdir(previousCwd);
});

describe("real startSandboxFrame · subscription-only blind payload", { concurrency: false, timeout: 5000 }, () => {
  it("sends only the student frame; the task's keys/hints never enter payload.md", async () => {
    await startSandboxFrame(task, remember);
    const payload = fixture.files.get("/vercel/sandbox/payload.md")?.toString("utf8");
    assert.ok(payload);
    assert.ok(payload.includes("grade: g2") && payload.includes("kind: grammar") && payload.includes(frame.lines[0]!));
    assert.ok(!payload.includes("synthetic-private-answer-key") && !payload.includes("synthetic-private-hint"));
    assert.ok(!payload.includes('"item"') && !payload.includes('"answers"'));
    assert.ok(fixture.files.has("/vercel/sandbox/runner.mjs"));
    assert.ok(fixture.files.has("/vercel/sandbox/.claude/skills/domigo-blind-solve/SKILL.md"));
  });

  it("uses the account SDK with adaptive thinking and only the subscription auth variable", async () => {
    await startSandboxFrame(task, remember);
    assert.deepEqual(fixture.creates, [{ runtime: "node22", resources: { vcpus: 2 }, timeout: 360000 }]);
    const install = fixture.commands[0]!;
    assert.equal(install.cmd, "npm");
    assert.deepEqual(install.args, ["install", "--no-audit", "--no-fund", "--loglevel=error"]);
    const run = fixture.commands[1]!;
    assert.equal(run.cmd, "node");
    assert.deepEqual(run.args, ["runner.mjs"]);
    assert.equal(run.detached, true);
    assert.equal(run.cwd, "/vercel/sandbox");
    assert.deepEqual(Object.keys(run.env ?? {}).sort(), ["CLAUDE_CODE_OAUTH_TOKEN", "MODEL", "THINKING"]);
    assert.equal(run.env?.MODEL, task.model);
    assert.equal(run.env?.THINKING, "adaptive");
    assert.ok(typeof run.env?.CLAUDE_CODE_OAUTH_TOKEN === "string" && !/\s/.test(run.env.CLAUDE_CODE_OAUTH_TOKEN), "subscription fixture is normalized without exposing its value");
    const packageJson = JSON.parse(fixture.files.get("/vercel/sandbox/package.json")!.toString("utf8")) as { dependencies: Record<string, string> };
    assert.deepEqual(Object.keys(packageJson.dependencies), ["@anthropic-ai/claude-agent-sdk"]);
    assert.equal(fixture.stopped, 0); // detached run remains alive for polling
  });

  it("awaits persistence of the sandbox handle before any detached run or installation", async () => {
    let enter!: () => void;
    let release!: () => void;
    const entered = new Promise<void>((resolve) => { enter = resolve; });
    const permitted = new Promise<void>((resolve) => { release = resolve; });
    const starting = startSandboxFrame(task, async () => {
      fixture.events.push("remember-start"); enter(); await permitted; fixture.events.push("remember-end");
    });
    await entered;
    try {
      await new Promise<void>((resolve) => setImmediate(resolve));
      assert.equal(fixture.commands.length, 0);
      assert.equal(fixture.files.size, 0);
    } finally { release(); }
    await starting;
    assert.ok(fixture.events.indexOf("remember-end") < fixture.events.indexOf("install"));
    assert.ok(fixture.events.indexOf("remember-end") < fixture.events.indexOf("detached-run"));
  });

  it("refuses a missing subscription even when an API-key fixture is present", async () => {
    delete process.env.CLAUDE_CODE_OAUTH_TOKEN;
    process.env.ANTHROPIC_API_KEY = "synthetic-forbidden-api-key-fixture";
    await assert.rejects(startSandboxFrame(task, remember), /CLAUDE_CODE_OAUTH_TOKEN/);
    assert.equal(fixture.creates.length, 0);
  });

  it("refuses a whitespace-only subscription before creating a sandbox", async () => {
    process.env.CLAUDE_CODE_OAUTH_TOKEN = " \n\t ";
    await assert.rejects(startSandboxFrame(task, remember), /CLAUDE_CODE_OAUTH_TOKEN/);
    assert.equal(fixture.creates.length, 0);
  });

  for (const failure of ["create", "installation", "detached command", "handle persistence"] as const) {
    it(`sanitizes ${failure} failures and stops an already-created sandbox`, async () => {
      fixture.createFails = failure === "create";
      fixture.installExit = failure === "installation" ? 1 : 0;
      fixture.runFails = failure === "detached command";
      const persist = failure === "handle persistence" ? async () => { throw new Error(PRIVATE_DETAIL); } : remember;
      await assert.rejects(startSandboxFrame(task, persist), (error: unknown) => {
        assert.ok(error instanceof Error);
        assert.equal(error.message, "Sandbox-Prüfung konnte nicht gestartet werden.");
        assert.ok(!error.message.includes(PRIVATE_DETAIL));
        return true;
      });
      assert.equal(fixture.stopped, failure === "create" ? 0 : 1);
      if (failure === "installation" || failure === "handle persistence") {
        assert.equal(fixture.commands.filter((command) => command.detached).length, 0);
      }
    });
  }
});

describe("real pollSandboxFrame · meta.json protocol", { concurrency: false }, () => {
  it("missing meta.json remains checking and never completes optimistically", async () => {
    assert.deepEqual(await pollSandboxFrame(sandbox.sandboxId, now()), { status: "checking" });
    assert.deepEqual(fixture.readPaths, ["/vercel/sandbox/output/meta.json"]);
    assert.equal(fixture.stopped, 0);
  });

  it("transient sandbox reconnection errors remain sanitized checking", async () => {
    fixture.getFails = true;
    assert.deepEqual(await pollSandboxFrame(sandbox.sandboxId, now()), { status: "checking" });
  });

  it("returns real candidate answers/confidence and protocol usage counters, without granting a pass", async () => {
    const candidates = [{ answer: "play", confidence: 0.92 }, { answer: "played", confidence: 0.1 }];
    fixture.meta = JSON.stringify({ status: "ok", candidates, totalCostUsd: 0.01, inputTokens: 80, outputTokens: 20, numTurns: 1 });
    assert.deepEqual(await pollSandboxFrame(sandbox.sandboxId, now()), { status: "complete", candidates, costUsd: 0.01, inputTokens: 80, outputTokens: 20 });
    assert.equal(fixture.stopped, 0); // caller journals its verdict before stopping
  });

  it("omitted usage counters normalize to null", async () => {
    fixture.meta = JSON.stringify({ status: "ok", candidates: [{ answer: "play", confidence: 0 }] });
    assert.deepEqual(await pollSandboxFrame(sandbox.sandboxId, now()), { status: "complete", candidates: [{ answer: "play", confidence: 0 }], costUsd: null, inputTokens: null, outputTokens: null });
  });

  const malformed = [
    ["malformed JSON", "{"], ["null document", "null"], ["array document", "[]"],
    ["provider error", JSON.stringify({ status: "error", error: PRIVATE_DETAIL })],
    ["missing candidates", JSON.stringify({ status: "ok" })],
    ["empty candidates", JSON.stringify({ status: "ok", candidates: [] })],
    ["null candidate", JSON.stringify({ status: "ok", candidates: [null] })],
    ["empty answer", JSON.stringify({ status: "ok", candidates: [{ answer: "", confidence: 0.9 }] })],
    ["blank answer", JSON.stringify({ status: "ok", candidates: [{ answer: "  ", confidence: 0.9 }] })],
    ["nonstrings", JSON.stringify({ status: "ok", candidates: [{ answer: 42, confidence: 0.9 }] })],
    ["oversized answer", JSON.stringify({ status: "ok", candidates: [{ answer: "x".repeat(10001), confidence: 0.9 }] })],
    ["missing confidence", JSON.stringify({ status: "ok", candidates: [{ answer: "play" }] })],
    ["string confidence", JSON.stringify({ status: "ok", candidates: [{ answer: "play", confidence: "0.9" }] })],
    ["negative confidence", JSON.stringify({ status: "ok", candidates: [{ answer: "play", confidence: -0.1 }] })],
    ["confidence above one", JSON.stringify({ status: "ok", candidates: [{ answer: "play", confidence: 1.1 }] })],
  ] as const;
  for (const [name, meta] of malformed) it(`${name} fails with a sanitized reason`, async () => {
    fixture.meta = meta;
    const result = await pollSandboxFrame(sandbox.sandboxId, now());
    assert.equal(result.status, "failed");
    assert.ok("note" in result && typeof result.note === "string" && !result.note.includes(PRIVATE_DETAIL));
    assert.equal(fixture.stopped, 0);
  });

  it("stale runs fail before reconnecting, even if valid output is available", async () => {
    fixture.meta = JSON.stringify({ status: "ok", candidates: [{ answer: "play", confidence: 0.99 }] });
    const result = await pollSandboxFrame(sandbox.sandboxId, new Date(Date.now() - 7 * 60_000 - 100));
    assert.equal(result.status, "failed");
    assert.ok("note" in result && result.note.includes("Zeitlimit"));
    assert.equal(fixture.gets.length, 0);
  });
});

describe("real stopSandboxFrame", { concurrency: false }, () => {
  it("reconnects to the recorded handle and releases the sandbox", async () => {
    await stopSandboxFrame(sandbox.sandboxId);
    assert.deepEqual(fixture.gets, [sandbox.sandboxId]);
    assert.equal(fixture.stopped, 1);
  });
  it("does not expose reconnection or stop errors", async () => {
    fixture.getFails = true;
    await stopSandboxFrame(sandbox.sandboxId);
    fixture.getFails = false; fixture.stopFails = true;
    await stopSandboxFrame(sandbox.sandboxId);
    assert.equal(fixture.stopped, 1);
  });
});
