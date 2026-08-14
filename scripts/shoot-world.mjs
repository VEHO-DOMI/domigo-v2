#!/usr/bin/env node
/**
 * shoot-world — eine BILDREIHE aus der laufenden Welt, die ihren eigenen Beweis
 * mitbringt (R5-W3 · W1).
 *
 * `shoot-card-bench.mjs` fotografiert die Kartenbank; das ist gewöhnliches DOM
 * und war nie das Problem. Das Problem ist die WELT: ein WebGL-Canvas, den ein
 * normaler Screenshot schwarz zurückgibt — und dessen Ausweg (`renderer.snapshot`)
 * am 14.08. dreimal denselben Puffer lieferte, ohne dass es jemandem auffiel
 * (P-66). Eine Bildreihe, die still steht, sieht aus wie eine Bildreihe.
 *
 * ── WAS AN P-66 WIRKLICH KAPUTT WAR (gemessen, 14.08.) ─────────────────────
 * Nicht `renderer.snapshot()`. Der VERBORGENE TAB. Dieses Skript startet ein
 * eigenes Chrome und hängt sich an einen frisch erzeugten Tab — der meldet
 * `document.visibilityState === "visible"`, auch headless. Dort liefert
 * dieselbe Snapshot-Kette einwandfrei verschiedene Bilder und besteht den
 * Handschlag. Der Beipackzettel jeder Aufnahme trägt `visibility` und `hidden`
 * mit, damit diese Unterscheidung nie wieder Auslegungssache ist.
 *
 * Welcher Weg trägt, entscheidet nicht die Meinung, sondern der Handschlag:
 * zwei Probeaufnahmen mit einem step() dazwischen, deren Prüfsummen sich
 * unterscheiden müssen. Besteht er ihn nicht, endet der Lauf mit Exit 1 und
 * einer Meldung, die die drei bekannten Ursachen nennt.
 *
 * ── --pure, und warum es für Messreihen Pflicht ist ────────────────────────
 * Der Schuss KOSTET Ticks: `rafStep()` treibt die Uhr mit. Gemessen kostete er
 * hier 5–8 Ticks pro Bild — eine Reihe „alle 6 Ticks" rückte in Wahrheit 25–28
 * Ticks weiter. Bei einem Käfig, dessen Rüttel-Periode 11 Ticks ist, ist das
 * kein Detail, sondern Aliasing: die Reihe zeigt beliebige Phasen und behauptet
 * eine Kadenz. `--pure` deaktiviert die Szene für die beiden Render-Frames —
 * gezeichnet wird, gerechnet nicht. `shotCostTicks` steht im Zettel, gemessen.
 *
 * Benutzung (der Dev-Server muss schon laufen — die Lehrer-Tür ist dev-only):
 *   node scripts/shoot-world.mjs <outDir> --phase p1 --port 3021 \
 *        [--visible] [--sink-port 3921] [--cdp-port 9341] \
 *        [--warp c,r] [--settle 240] [--shots 14] [--every 6] [--pure] \
 *        [--press left|right|jump] [--name uns_kaefig]
 *
 * ⚠ EIGENER PORT, IMMER (P-65): am 14.08. sprach ein Live-Lauf mit einem fremden
 *   Dev-Server auf 3000 und hätte jede „live geprüft"-Aussage zur Lüge gemacht.
 *   Deshalb prüft dieses Skript zuerst, ob die laufende Klasse den NEUEN Code
 *   kennt (`state().tick` muss eine Zahl sein), und bricht sonst ab.
 */
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import http from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";
import { CLIENT_SRC, createSink } from "./frame-sink.mjs";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Argumente ───────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i === -1 ? fallback : argv[i + 1];
};
const has = (name) => argv.includes(name);
const outDir = argv.find((a) => !a.startsWith("--") && argv[argv.indexOf(a) - 1]?.startsWith("--") !== true);
if (!outDir) {
  console.error("usage: node scripts/shoot-world.mjs <outDir> --phase p1 --port 3021 [...]");
  process.exit(1);
}
const phase = flag("--phase", "p1");
const port = Number(flag("--port", 3021));
const sinkPort = Number(flag("--sink-port", 3921));
const cdpPort = Number(flag("--cdp-port", 9341));
const shots = Number(flag("--shots", 8));
const every = Number(flag("--every", 6));
const settle = Number(flag("--settle", 240));
const warp = flag("--warp", null);
const press = flag("--press", null);
const stem = flag("--name", "frame");
const pure = has("--pure");
const visible = has("--visible");

if (!existsSync(CHROME)) { console.error(`kein Chrome unter ${CHROME}`); process.exit(1); }
mkdirSync(outDir, { recursive: true });

// ── die Senke, im selben Prozess: EIN Verdikt, EIN Exit-Code ────────────────
const sink = createSink(outDir);
const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") { res.writeHead(204); return res.end(); }
  if (req.method !== "POST") { res.writeHead(200); return res.end("shoot-world sink"); }
  const chunks = [];
  req.on("data", (c) => chunks.push(c));
  req.on("end", () => {
    let meta = null;
    try { meta = JSON.parse(decodeURIComponent(String(req.headers["x-domigo-meta"] ?? ""))); } catch { meta = null; }
    const r = sink.offer(decodeURIComponent((req.url ?? "/f").slice(1)), Buffer.concat(chunks).toString("utf8"), meta);
    if (r.code !== 200) console.error(`\n✗ ${r.body}\n`);
    res.writeHead(r.code);
    res.end(r.body);
  });
});
await new Promise((r) => server.listen(sinkPort, r));

// ── Chrome ──────────────────────────────────────────────────────────────────
const profile = mkdtempSync(path.join(tmpdir(), "shoot-world-chrome-"));
const chrome = spawn(CHROME, [
  ...(visible ? [] : ["--headless=new"]),
  "--hide-scrollbars",
  "--no-first-run",
  "--force-device-scale-factor=1",
  "--window-size=1200,900",
  "--autoplay-policy=no-user-gesture-required",
  `--user-data-dir=${profile}`,
  `--remote-debugging-port=${cdpPort}`,
  "about:blank",
], { stdio: ["ignore", "ignore", "ignore"] });

async function endpoint() {
  for (let i = 0; i < 80; i++) {
    try {
      const j = await (await fetch(`http://127.0.0.1:${cdpPort}/json/version`)).json();
      if (j.webSocketDebuggerUrl) return j.webSocketDebuggerUrl;
    } catch { /* noch nicht oben */ }
    await sleep(250);
  }
  throw new Error("Chrome hat seinen Debug-Port nie geöffnet");
}

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
  return (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    id += 1;
    waiting.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params, sessionId }));
  });
}

const ws = new WebSocket(await endpoint());
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
const send = client(ws);
const { targetId } = await send("Target.createTarget", { url: "about:blank" });
const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
const page = (m, p) => send(m, p, sessionId);
await page("Page.enable");
await page("Runtime.enable");

/** JS in der Seite, Ergebnis als Wert. Wirft, wenn die Seite wirft. */
const evalIn = async (expression, awaitPromise = false) => {
  const r = await page("Runtime.evaluate", { expression, returnByValue: true, awaitPromise });
  if (r.exceptionDetails) {
    throw new Error(r.exceptionDetails.exception?.description ?? JSON.stringify(r.exceptionDetails));
  }
  return r.result.value;
};

const fail = async (msg) => {
  console.error(`\n✗ ${msg}`);
  await bail(1);
};

const bail = async (code) => {
  const v = sink.verdict();
  writeFileSync(path.join(outDir, "_verdict.json"), `${JSON.stringify(v, null, 2)}\n`);
  console.log(`\nshoot-world · Verdikt für ${path.resolve(outDir)}`);
  console.log(`  Weg: snapshot${pure ? " (pure)" : ""} · Tab: ${visible ? "sichtbar" : "headless"}`);
  console.log(`  Handschlag: ${v.armed ? "bestanden" : v.deadCamera ? "TOTE KAMERA" : "nie gefahren"}`);
  console.log(`  angenommen: ${v.accepted} · abgewiesen: ${v.rejected.length}`);
  for (const r of v.rejected) console.log(`    ✗ ${r.name} — ${r.reason}`);
  const bad = code !== 0 || !v.armed || v.tainted;
  console.log(bad ? "  ⇒ DIESE REIHE IST KEIN BEWEIS." : "  ⇒ Reihe brauchbar.");
  try { ws.close(); } catch { /* egal */ }
  chrome.kill();
  server.close();
  process.exit(bad ? 1 : 0);
};

try {
  // ── 1 · die Lehrer-Tür ────────────────────────────────────────────────────
  const url = `http://localhost:${port}/play/1/buch?phase=${phase}`;
  await page("Page.navigate", { url });

  // ── 2 · warten, bis das SPIEL da ist (der Loader hängt gern bei ~96 %) ────
  let ready = false;
  for (let i = 0; i < 160; i++) {
    await sleep(250);
    await evalIn(`(() => { const g = window.__domigoPaint?.game;
      g?.scene?.scenes?.forEach((s) => s.load?.checkLoadQueue?.()); return true; })()`);
    const st = await evalIn(`(() => { const s = window.__domigoPaint?.state?.(); return s ? {tick: s.tick, overlay: s.overlay, phase: s.phase} : null; })()`);
    if (st !== null) { ready = true; console.log(`  Spiel da nach ${((i + 1) * 250) / 1000}s · Phase ${st.phase} · Tick ${st.tick}`); break; }
  }
  if (!ready) await fail(`kein __domigoPaint auf ${url} — läuft der Dev-Server auf ${port}?`);

  // ── 3 · P-65: kennt die laufende Klasse den NEUEN Code? ──────────────────
  const tickType = await evalIn(`typeof window.__domigoPaint.state().tick`);
  if (tickType !== "number") {
    await fail(`Der Server auf ${port} liefert einen state() OHNE tick — das ist ALTER Code`
      + " (fremder Dev-Server? P-65). Eigener Port, eigener Worktree, dann noch einmal.");
  }

  // ── 4 · der Ceremony-Freeze, und warum ein Blick auf `overlay` zu wenig ist
  //
  // Erster Versuch dieses Skripts fragte einmal „ist eine Karte offen?", bekam
  // NEIN (die Auftakt-Karte war noch nicht montiert), steppte 240-mal ins Leere
  // und schoss dann zwei Proben auf Tick 0. Der Handschlag hat es gefangen —
  // aber die Lehre ist allgemeiner: nicht den Zustand fragen, sondern die WELT
  // laufen sehen. Geprüft wird, dass der Tick sich wirklich bewegt.
  const runs = async () => {
    const before = await evalIn(`window.__domigoPaint.state().tick`);
    await evalIn(`(() => { for (let i = 0; i < 5; i++) window.__domigoPaint.step(); return true; })()`);
    return (await evalIn(`window.__domigoPaint.state().tick`)) > before;
  };
  let alive = false;
  for (let i = 0; i < 24; i++) {
    if (await evalIn(`window.__domigoPaint.state().overlay === true`)) {
      await evalIn(`window.__domigoPaint.solveTask()`);
      await sleep(180);
      continue;
    }
    if (await runs()) { alive = true; break; }
    await sleep(180);
  }
  if (!alive) {
    await fail("die Welt läuft nicht: der Tick bewegt sich nicht, obwohl keine Karte offen ist"
      + " — jede Reihe wäre N-mal dasselbe Bild (Falle 2)");
  }

  // ── 5 · reduzierte Bewegung ──────────────────────────────────────────────
  if (await evalIn(`window.matchMedia("(prefers-reduced-motion: reduce)").matches`)) {
    await fail("prefers-reduced-motion ist AN — gemessen würde das Standbild, nicht die Bewegung (Falle 3)");
  }

  // ── 6 · Stellung beziehen ────────────────────────────────────────────────
  if (warp !== null) {
    const [c, r] = warp.split(",").map(Number);
    await evalIn(`window.__domigoPaint.warp(${c}, ${r})`);
  }
  if (press !== null) await evalIn(`window.__domigoPaint.press({ ${press}: true })`);
  await evalIn(`(() => { for (let i = 0; i < ${settle}; i++) window.__domigoPaint.step(); return true; })()`);
  // …und noch einmal: das Beziehen der Stellung schlägt gern eine Karte auf
  // (Käfig-Hinweis!), und dann steht die Welt wieder.
  for (let i = 0; i < 8; i++) {
    if (!(await evalIn(`window.__domigoPaint.state().overlay === true`))) break;
    await evalIn(`window.__domigoPaint.solveTask()`);
    await sleep(180);
  }
  if (!(await runs())) {
    await fail("nach dem Stellungsbeziehen läuft die Welt nicht mehr (Karte offen?) — Reihe abgebrochen");
  }

  // ── 7 · der Aufnahmeweg ──────────────────────────────────────────────────
  await evalIn(CLIENT_SRC.replace("__SINK_URL__", `http://localhost:${sinkPort}`));

  const shoot = async (name, extra) => {
    const opts = JSON.stringify({ pure, extra: { via: "snapshot", ...(extra ?? {}) } });
    return evalIn(`window.__frameSink.shoot(${JSON.stringify(name)}, ${opts})`, true);
  };

  // ── 8 · DER HANDSCHLAG, bevor irgendein Bild geschrieben wird ────────────
  // Zuerst die Uhr übernehmen: ab hier rückt die Welt nur noch, wenn WIR es
  // sagen (siehe `freeze` im Client — sonst läuft Phasers Schleife zwischen den
  // Fernsteuer-Aufrufen weiter und die Kadenz der Reihe ist erfunden).
  await evalIn(`window.__frameSink.freeze()`);
  await shoot("__probe_a", { probe: "a" });
  await evalIn(`window.__frameSink.drive(1)`);
  try {
    await shoot("__probe_b", { probe: "b" });
  } catch (e) {
    await fail(`Handschlag nicht bestanden (Weg »snapshot«):\n${e.message}`);
  }
  if (!sink.verdict().armed) await fail(`Handschlag nicht bestanden (Weg »snapshot«)`);
  console.log(`  Handschlag bestanden (Weg »snapshot«) — die Kamera lebt.`);

  // ── 9 · die Reihe ────────────────────────────────────────────────────────
  for (let i = 1; i <= shots; i++) {
    const tick = await evalIn(`window.__domigoPaint.state().tick`);
    await shoot(`${stem}_${String(i).padStart(3, "0")}`, { serie: stem, nr: i, tickBefore: tick });
    if (i < shots) await evalIn(`window.__frameSink.drive(${every})`);
  }
  console.log(`  ${shots} Aufnahmen · alle ${every} Ticks · ${path.resolve(outDir)}`);
  await bail(0);
} catch (err) {
  console.error(`\n✗ ${err.message}`);
  await bail(1);
}
