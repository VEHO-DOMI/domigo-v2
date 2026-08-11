#!/usr/bin/env node
/**
 * shoot-naive-samples — three colour/look VARIANTS of one card, as pictures
 * only (R5-W1 · D1, for Koki's open gate doc 45 §G2 „naives Design").
 *
 * Nothing here is built into the game. Each variant is a stylesheet injected
 * into the bench page for the length of one screenshot, so Koki can rule the
 * look on evidence instead of on adjectives — and whatever he picks is then
 * built once, deliberately, by whoever owns that round.
 *
 * Usage: node scripts/shoot-naive-samples.mjs <outDir> [--port 3007] [--surface restore]
 */
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const CDP_PORT = 9335;

/** each variant is ONE stylesheet over the shipped card — no code, no assets */
export const VARIANTS = [
  {
    id: "0-wie-gebaut",
    label: "wie gebaut (Vergleichsbild)",
    css: "",
  },
  {
    id: "1-kraeftiger",
    label: "kräftiger: sattere Farben, dickere Tinte",
    // the same painted materials, turned up: more saturated paper, a fatter
    // ink edge, warmer chips. Nothing childish about the SHAPES yet.
    css: `
      .pb-card { background-color: #ffeec4; border-width: 3.5px; border-color: #8a5a2b;
                 box-shadow: 5px 6px 0 -2px rgba(255,238,196,0.95), 6px 7px 0 -1px rgba(138,90,43,0.55),
                             0 12px 30px rgba(26,17,8,0.42), inset 0 0 0 1px rgba(255,251,238,0.7); }
      .pb-card::before { border-color: rgba(138,90,43,0.55); border-width: 2px; }
      .pb-card button, .pb-card .pb-chip { background-color: #fff6d8; border-width: 2.5px; border-color: #8a5a2b;
                 box-shadow: 0 3px 0 rgba(138,90,43,0.55), 0 4px 10px rgba(40,28,12,0.18); }
      .pb-key { color: #2a2114; }
      .pb-key::after { height: 5px; background: linear-gradient(90deg, rgba(200,110,40,0), #c86e28 25%, #8a5a2b 60%, rgba(138,90,43,0)); }
      .pb-key-en { color: #a8541a; }
      .pb-stamp { background-color: #ffe1a4; box-shadow: inset 0 0 0 2.5px rgba(138,90,43,0.9), 0 3px 7px rgba(40,28,12,0.3); }
    `,
  },
  {
    id: "2-naiv",
    label: "naiv: schief gesetzt, Wachsmalstift-Kanten",
    // Koki's own words for the open gate: „it can be a bit messy — think of
    // naive design". Nothing is quite square: the card leans, every chip leans
    // its own way, the ink is crayon-thick.
    css: `
      .pb-card { background-color: #fff2cd; border: 4px solid #6b3f18; transform: rotate(-1.1deg);
                 border-radius: 26px 14px 30px 16px / 16px 30px 14px 26px;
                 box-shadow: 7px 9px 0 -1px rgba(107,63,24,0.85), 0 14px 30px rgba(26,17,8,0.4); }
      .pb-card::before { border: 2.5px dashed rgba(107,63,24,0.45); border-radius: 22px 12px 26px 14px / 14px 26px 12px 22px; }
      .pb-card button, .pb-card .pb-chip { background-color: #fffaea; border: 3px solid #6b3f18;
                 border-radius: 18px 9px 20px 11px / 11px 20px 9px 18px;
                 box-shadow: 0 4px 0 rgba(107,63,24,0.9); font-size: 18px; }
      .pb-card button:nth-child(odd) { transform: rotate(-1.4deg); }
      .pb-card button:nth-child(even) { transform: rotate(1.2deg); }
      .pb-key { color: #3a2410; letter-spacing: 0.2px; }
      .pb-key::after { height: 6px; border-radius: 6px; transform: rotate(-1.6deg);
                 background: linear-gradient(90deg, rgba(214,106,42,0), #d66a2a 20%, #b0461a 55%, rgba(176,70,26,0)); }
      .pb-key-en { color: #b0461a; }
      .pb-plate { border: 4px solid #6b3f18; transform: rotate(1deg); }
      .pb-stamp { background-color: #ffd98a; transform: rotate(-11deg);
                 box-shadow: inset 0 0 0 3px rgba(107,63,24,0.95), 0 3px 8px rgba(40,28,12,0.35); }
      .pb-quiet { color: #7a5c33; }
    `,
  },
];

const args = process.argv.slice(2);
const outDir = args[0];
if (!outDir) { console.error("usage: node scripts/shoot-naive-samples.mjs <outDir> [--port N] [--surface id]"); process.exit(1); }
const port = args.indexOf("--port") === -1 ? 3007 : Number(args[args.indexOf("--port") + 1]);
const surface = args.indexOf("--surface") === -1 ? "restore" : args[args.indexOf("--surface") + 1];
if (!existsSync(CHROME)) { console.error(`no Chrome at ${CHROME}`); process.exit(1); }
mkdirSync(outDir, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const profile = mkdtempSync(path.join(tmpdir(), "naive-chrome-"));
const chrome = spawn(CHROME, [
  "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
  "--force-device-scale-factor=2", "--window-size=1120,760",
  `--user-data-dir=${profile}`, `--remote-debugging-port=${CDP_PORT}`, "about:blank",
], { stdio: ["ignore", "ignore", "ignore"] });

async function endpoint() {
  for (let i = 0; i < 60; i++) {
    try {
      const j = await (await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).json();
      if (j.webSocketDebuggerUrl) return j.webSocketDebuggerUrl;
    } catch { /* not up yet */ }
    await sleep(250);
  }
  throw new Error("Chrome never opened its debugging port");
}

const ws = new WebSocket(await endpoint());
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
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
const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
  id += 1; waiting.set(id, { resolve, reject });
  ws.send(JSON.stringify({ id, method, params, sessionId }));
});

const { targetId } = await send("Target.createTarget", { url: "about:blank" });
const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
const page = (m, p) => send(m, p, sessionId);
await page("Page.enable");
await page("Runtime.enable");

try {
  for (const v of VARIANTS) {
    await page("Page.navigate", { url: `http://localhost:${port}/play/1/buch?karten=${surface}` });
    let ready = false;
    for (let i = 0; i < 120; i++) {
      await sleep(250);
      const { result } = await page("Runtime.evaluate", {
        expression: `(() => { const s = document.querySelector('[data-testid="gallery-stage"]');
          return s !== null && s.getBoundingClientRect().height > 100; })()`,
        returnByValue: true,
      });
      if (result.value === true) { ready = true; break; }
    }
    if (!ready) throw new Error(`${v.id}: the stage never painted`);
    await page("Runtime.evaluate", {
      expression: `(() => { /* appended to BODY, not head: the overlay stylesheet is rendered
           inside the component tree, so a head rule of equal specificity loses
           on document order — found in the render */
        const s = document.createElement("style"); s.textContent = ${JSON.stringify(v.css)}; document.body.appendChild(s); return true; })()`,
      returnByValue: true,
    });
    await sleep(900);
    const { data } = await page("Page.captureScreenshot", { format: "png" });
    writeFileSync(path.join(outDir, `${surface}--${v.id}.png`), Buffer.from(data, "base64"));
    console.log(`  ✓ ${v.id} — ${v.label}`);
  }
  console.log(`shoot-naive-samples: ${VARIANTS.length} Muster von „${surface}" → ${outDir}`);
} finally {
  ws.close();
  chrome.kill();
}
