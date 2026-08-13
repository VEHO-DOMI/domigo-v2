#!/usr/bin/env node
/**
 * shoot-card-bench — photograph every surface of the dev card bench (R5-W1 · D1).
 *
 * Why a script and not a hand-driven browser: this packet rebuilds 9 card kinds
 * and 11 ceremony panels, and every one of them needs a BEFORE and an AFTER
 * frame for the blind critic — and the critic loop repeats. Doing that by hand
 * is dozens of manual captures whose framing drifts between them, and a
 * drifting frame is the one thing a side-by-side judgement may not have.
 *
 * It drives the Chrome already on the machine over the DevTools protocol: ONE
 * browser, one tab, navigate → wait for the bench to paint → capture. (The
 * obvious `--screenshot=` one-shot form costs a cold Chrome per surface — 90+
 * seconds each here, which is half an hour per round.) No new dependency:
 * Node 22 ships the WebSocket client this needs.
 *
 * Usage:  node scripts/shoot-card-bench.mjs <outDir> [--port 3007] [--only a,b]
 * The dev server must already be running (the bench is dev-only by law).
 */
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const CDP_PORT = 9333;

/** every surface the bench declares — kept in step with dev/CardGallery.tsx */
export const SURFACES = [
  "choice", "oddone", "restore", "wheel", "order", "mistake", "memory", "typed", "spell",
  "choice-hints",
  "goal", "tip", "tip-regel", "score", "out", "grant", "cagehint", "bonuspay",
  "ceremony-merle", "ceremony-wisp", "console", "bonusend-perfect", "bonusend-timeout",
];

const args = process.argv.slice(2);
const outDir = args[0];
if (!outDir) {
  console.error("usage: node scripts/shoot-card-bench.mjs <outDir> [--port N] [--only a,b]");
  process.exit(1);
}
const port = args.indexOf("--port") === -1 ? 3007 : Number(args[args.indexOf("--port") + 1]);
const only = args.indexOf("--only") === -1 ? null : new Set(args[args.indexOf("--only") + 1].split(","));

if (!existsSync(CHROME)) {
  console.error(`shoot-card-bench: no Chrome at ${CHROME}`);
  process.exit(1);
}
mkdirSync(outDir, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const profile = mkdtempSync(path.join(tmpdir(), "bench-chrome-"));
const chrome = spawn(CHROME, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  "--no-first-run",
  "--force-device-scale-factor=2",
  "--window-size=1120,760",
  `--user-data-dir=${profile}`,
  `--remote-debugging-port=${CDP_PORT}`,
  "about:blank",
], { stdio: ["ignore", "ignore", "ignore"] });

/** the browser's own websocket endpoint, once it is listening */
async function endpoint() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`);
      const j = await r.json();
      if (j.webSocketDebuggerUrl) return j.webSocketDebuggerUrl;
    } catch { /* not up yet */ }
    await sleep(250);
  }
  throw new Error("Chrome never opened its debugging port");
}

/** minimal CDP client: send(method, params) → result */
function client(ws) {
  let id = 0;
  const waiting = new Map();
  ws.addEventListener("message", (e) => {
    const m = JSON.parse(e.data);
    if (m.id !== undefined && waiting.has(m.id)) {
      const { resolve, reject } = waiting.get(m.id);
      waiting.delete(m.id);
      m.error ? reject(new Error(m.error.message)) : resolve(m.result);
    }
  });
  return (method, params = {}, sessionId) =>
    new Promise((resolve, reject) => {
      id += 1;
      waiting.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params, sessionId }));
    });
}

const wsUrl = await endpoint();
const ws = new WebSocket(wsUrl);
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
const send = client(ws);

const { targetId } = await send("Target.createTarget", { url: "about:blank" });
const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
const page = (method, params) => send(method, params, sessionId);
await page("Page.enable");
await page("Runtime.enable");

/** navigate and wait until the bench has actually PAINTED the stage — not until
 *  the network is quiet: the bench is a lazy chunk behind a dev compile, and a
 *  fallback („Bench lädt …") photographed as the card is the one failure this
 *  whole instrument exists to prevent. */
async function shoot(id) {
  const out = path.join(outDir, `${id}.png`);
  await page("Page.navigate", { url: `http://localhost:${port}/play/1/buch?karten=${id}` });
  let ready = false;
  for (let i = 0; i < 120; i++) {
    await sleep(250);
    const { result } = await page("Runtime.evaluate", {
      expression: `(() => { const s = document.querySelector('[data-testid="gallery-stage"]');
        return s !== null && s.getBoundingClientRect().height > 100 && document.querySelectorAll('img').length > 0; })()`,
      returnByValue: true,
    });
    if (result.value === true) { ready = true; break; }
  }
  if (!ready) throw new Error(`${id}: the stage never painted`);
  // one more beat so the card's own entrance animation has finished (420 ms
  // after a 260 ms delay) — a card photographed mid-spring is not the card
  await sleep(1100);
  const { data } = await page("Page.captureScreenshot", { format: "png" });
  writeFileSync(out, Buffer.from(data, "base64"));
  console.log(`  ✓ ${id}`);
}

const wanted = SURFACES.filter((s) => only === null || only.has(s));
try {
  for (const id of wanted) await shoot(id);
  console.log(`shoot-card-bench: ${wanted.length} surface(s) → ${outDir}`);
} finally {
  ws.close();
  chrome.kill();
}
