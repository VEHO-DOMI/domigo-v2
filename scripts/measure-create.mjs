#!/usr/bin/env node
/**
 * measure-create — what the child waits for at a level start (R5-W3 · E5).
 *
 * WHY THIS EXISTS. E4 left one number behind: `create()` costs 320–960 ms, and
 * it runs in the SAME step that draws the first frame (P-54), so every one of
 * those milliseconds is a still picture on the screen. That number was taken
 * before twelve further PRs landed, and E4's own handover says in writing:
 * measure again, do not carry it over. This is that instrument.
 *
 * ★ THE TRAP THIS INSTRUMENT IS BUILT AROUND. `?perf=1` reports `createMs`,
 * which is the wall-clock of `PaintScene.create()` alone (the create wrapper in
 * perf.ts). But the Sim, the grid scan and the art scope are built in the scene
 * CONSTRUCTOR — outside that window. Move work out of create() into the
 * constructor and the reported number improves while the child waits exactly as
 * long. So this script reports the wait in the three parts it is actually made
 * of, each measured where it can honestly be measured:
 *
 *   bau      the scene constructor — Sim + grid + art scope. Pure computation,
 *            no browser needed, so it is timed here in Node.
 *   laden    the loader. Wall-clock and network-dependent; a record of THIS
 *            run's conditions, never a property of the build.
 *   aufbau   create() itself, read off the shipped instrument in a real browser.
 *
 * A repair counts only if `bau + aufbau` falls. `aufbau` alone can be gamed by
 * moving work one function earlier; the pair cannot.
 *
 * WHAT IT DOES NOT MEASURE. Frames per second. An automated browser keeps its
 * tab hidden and a hidden tab draws nothing on its own (P-56/P-57), so frames
 * are driven by hand through `__domigoPaintPerf` and only CPU work is reported.
 * Every run prints `hidden`, `visibilityState` and the GL renderer, so the
 * conditions of a measurement are never guesswork.
 *
 * Usage:
 *   node scripts/measure-create.mjs --port 4056 [--phases p1,p2,p3,p4,p9]
 *                                   [--runs 3] [--json out.json] [--warm 0]
 *   node scripts/measure-create.mjs --port 4056 --selftest
 *
 * The server must already be running on --port, and it must be a PRODUCTION
 * build — a dev build measures unminified React, which is the wrong question.
 * `?perf=1` is a teacher door, so a teacher session or DEV_TEACHER_ID is needed.
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { Sim } from "../packages/game-paint/src/sim.ts";
import { phaseArtScope } from "../packages/game-paint/src/artScope.ts";
import { CREATE_MS, SETTLED_GPU_MS } from "../packages/game-paint/src/perfBudget.ts";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
/** own debug port — P-65: one session, one port, never a neighbour's */
const CDP_PORT = 9355;
const ALL_PHASES = ["p1", "p2", "p3", "p4", "p9"];
const LEVEL_PATH = "content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json";
const ART_DIR = "apps/web/public/art/g1/paint";

const args = process.argv.slice(2);
const arg = (name, dflt) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? dflt : args[i + 1];
};
const port = Number(arg("port", 4056));
const runs = Number(arg("runs", 3));
const warmOffDefault = arg("warm", null) === "0";
const jsonOut = arg("json", null);
const selftest = args.includes("--selftest");
const phases = String(arg("phases", ALL_PHASES.join(","))).split(",").filter(Boolean);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const fmt = (n) => (n === null || n === undefined ? "—" : Number(n).toFixed(1));

// ─────────────────────────────────────────────────────────────────────────────
// PART ONE · the constructor, timed in Node (no browser can see inside it)
// ─────────────────────────────────────────────────────────────────────────────

const level = JSON.parse(fs.readFileSync(path.resolve(LEVEL_PATH), "utf8"));
const present = fs
  .readdirSync(path.resolve(ART_DIR), { withFileTypes: true })
  .flatMap((d) =>
    d.isDirectory()
      ? fs.readdirSync(path.join(path.resolve(ART_DIR), d.name)).filter((f) => f.endsWith(".png"))
      : [],
  )
  .map((f) => f.replace(/\.png$/, ""));

/** median cost of everything PaintScene's constructor does, per phase */
function constructorMs(phaseId, iterations = 7) {
  const xs = [];
  for (let i = 0; i < iterations; i++) {
    const t0 = performance.now();
    phaseArtScope(level, phaseId, present);
    new Sim({ level, phaseId, grantedAbilities: () => [], freedCageIds: () => [] });
    xs.push(performance.now() - t0);
  }
  return median(xs);
}

// ─────────────────────────────────────────────────────────────────────────────
// PART TWO · create(), read off the shipped instrument in a real browser
// ─────────────────────────────────────────────────────────────────────────────

if (!fs.existsSync(CHROME)) {
  console.error(`measure-create: no Chrome at ${CHROME}`);
  process.exit(1);
}

const profile = mkdtempSync(path.join(tmpdir(), "e5-perf-chrome-"));
const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    "--hide-scrollbars",
    "--no-first-run",
    "--window-size=1120,760",
    // keep the renderer awake: a backgrounded renderer throttles the very
    // timers this measurement rides on
    "--disable-renderer-backgrounding",
    "--disable-backgrounding-occluded-windows",
    "--disable-background-timer-throttling",
    `--user-data-dir=${profile}`,
    `--remote-debugging-port=${CDP_PORT}`,
    "about:blank",
  ],
  { stdio: ["ignore", "ignore", "ignore"] },
);

async function endpoint() {
  for (let i = 0; i < 80; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`);
      const j = await r.json();
      if (j.webSocketDebuggerUrl) return j.webSocketDebuggerUrl;
    } catch {
      /* not up yet */
    }
    await sleep(250);
  }
  throw new Error("Chrome never opened its debugging port");
}

/** minimal CDP client: send(method, params) → result (pattern: shoot-card-bench) */
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

/** One cold run: fresh target, fresh page, one phase. */
async function browserRun(phase, warmOff) {
  const { targetId } = await send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
  const page = (method, params) => send(method, params, sessionId);
  try {
    await page("Page.enable");
    await page("Runtime.enable");
    // Tell the renderer this page is focused. A hidden tab is why three earlier
    // sessions could not measure a first frame; whether this works or not, the
    // answer is printed with every run instead of assumed.
    try {
      await page("Emulation.setFocusEmulationEnabled", { enabled: true });
    } catch {
      /* older Chrome — the run stays valid, it is simply the hidden case */
    }

    const url =
      `http://localhost:${port}/play/1/buch?perf=1&phase=${phase}` + (warmOff ? "&warm=0" : "");
    await page("Page.navigate", { url });

    // wait for the instrument, keeping the loader moving by hand — a hidden tab
    // has no frame clock to advance Phaser's queue for us
    let ready = false;
    for (let i = 0; i < 240; i++) {
      await sleep(250);
      const { result } = await page("Runtime.evaluate", {
        expression: `(() => {
          const p = window.__domigoPaintPerf;
          if (!p) return null;
          p.pump();
          return p.status().find((s) => s.key === "paint") ?? p.status()[0] ?? null;
        })()`,
        returnByValue: true,
      });
      const st = result.value;
      if (st && st.progress >= 1 && st.children > 0) {
        ready = true;
        break;
      }
    }
    if (!ready) throw new Error(`${phase}: the scene never finished loading`);

    // drive real frames by hand, so a first frame exists to be reported at all
    await page("Runtime.evaluate", {
      expression: `window.__domigoPaintPerf.drive(2, 1000/60)`,
      awaitPromise: true,
      returnByValue: true,
    });

    const { result } = await page("Runtime.evaluate", {
      expression: `(async () => {
        const p = window.__domigoPaintPerf;
        const ff = await p.firstFrame(1200);
        const gl = (() => {
          try {
            const c = document.querySelector("canvas");
            const g = c && (c.getContext("webgl2") || c.getContext("webgl"));
            if (!g) return null;
            const d = g.getExtension("WEBGL_debug_renderer_info");
            return d ? g.getParameter(d.UNMASKED_RENDERER_WEBGL) : g.getParameter(g.RENDERER);
          } catch { return null; }
        })();
        return {
          createMs: ff.createMs, loadMs: ff.loadMs, filesQueued: ff.filesQueued,
          firstCpuMs: ff.firstCpuMs, firstGpuMs: ff.firstGpuMs,
          settledGpuMs: ff.settledGpuMs, firstDrawCalls: ff.firstDrawCalls,
          hidden: document.hidden, visibility: document.visibilityState, gl,
        };
      })()`,
      awaitPromise: true,
      returnByValue: true,
    });
    return result.value;
  } finally {
    await send("Target.closeTarget", { targetId });
  }
}

/** N cold runs of one phase → the medians that go in a report */
async function measure(phase, warmOff) {
  const rows = [];
  for (let i = 0; i < runs; i++) rows.push(await browserRun(phase, warmOff));
  const create = rows.map((r) => r.createMs).filter((n) => typeof n === "number");
  return {
    rows,
    createMedian: create.length ? median(create) : null,
    createMin: create.length ? Math.min(...create) : null,
    createMax: create.length ? Math.max(...create) : null,
  };
}

const report = { port, runs, warmer: warmOffDefault ? "off" : "on", phases: {} };

try {
  console.log(`phase   bau      aufbau (create)          laden`);
  for (const phase of phases) {
    const bau = constructorMs(phase);
    const m = await measure(phase, warmOffDefault);
    report.phases[phase] = { constructorMs: bau, ...m };
    const r0 = m.rows[0];
    // the ceilings come from perfBudget.ts, so a measurement never has to be
    // read against a number somebody remembers
    const overCreate = m.createMedian !== null && bau + m.createMedian > CREATE_MS;
    const overSettled = r0.settledGpuMs !== null && r0.settledGpuMs > SETTLED_GPU_MS;
    console.log(
      `${phase.padEnd(6)} ${fmt(bau).padStart(6)} ms  ` +
        `${fmt(m.createMedian).padStart(7)} ms (${fmt(m.createMin)}–${fmt(m.createMax)})  ` +
        `${fmt(r0.loadMs).padStart(8)} ms · ${r0.filesQueued} Bilder` +
        `${overCreate ? `  ⚠ bau+aufbau über ${CREATE_MS} ms` : ""}` +
        `${overSettled ? `  ⚠ eingeschwungen über ${SETTLED_GPU_MS} ms GPU` : ""}`,
    );
  }
  const first = report.phases[phases[0]]?.rows[0];
  if (first) {
    console.log(
      `\nBedingungen: hidden=${first.hidden} · visibility=${first.visibility} · GL=${first.gl ?? "?"}`,
    );
  }

  if (selftest) {
    // THE INSTRUMENT MUST RESPOND TO ITS OWN CAUSE. `finishWarming()` is the
    // last statement of create(): it compiles two shader programmes and walks
    // the entire display list. `&warm=0` removes exactly that work and nothing
    // else. If createMs does not fall when the warmer is switched off, this
    // number is not measuring the inside of create() and no verdict may rest on
    // it — a check that cannot go red has proven nothing (E1's GPU number in a
    // hidden tab was exactly this failure, and it took removing 306 MB of
    // textures to expose it).
    const phase = phases[0];
    console.log(`\n--- Selbsttest: dieselbe Phase (${phase}) mit abgeschaltetem Vorwärmer ---`);
    const off = await measure(phase, true);
    const on = report.phases[phase].createMedian;
    const delta = on - off.createMedian;
    report.selftest = { phase, warmOn: on, warmOff: off.createMedian, delta };
    console.log(
      `create(): Vorwärmer an ${fmt(on)} ms · aus ${fmt(off.createMedian)} ms · Δ ${fmt(delta)} ms`,
    );
    if (!(delta > 1)) {
      console.error(
        "✗ Selbsttest: das Abschalten des Vorwärmers senkt create() nicht — dieses Instrument misst nicht den Inhalt von create().",
      );
      process.exitCode = 1;
    } else {
      console.log("✓ Selbsttest: die Zahl bewegt sich mit einer bekannten Ursache INNERHALB von create().");
    }
  }

  if (jsonOut) {
    fs.writeFileSync(jsonOut, JSON.stringify(report, null, 2));
    console.log(`\n→ ${jsonOut}`);
  }
} finally {
  ws.close();
  chrome.kill();
}
