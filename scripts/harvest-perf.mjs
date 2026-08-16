#!/usr/bin/env node
/**
 * harvest-perf — die `?perf=1`-Tabelle für ALLE fünf Phasen, aus einem laufenden
 * Dev-Server, mit Kontrollmessung (R5-W4 · B4).
 *
 * WARUM ES DAS GIBT. `PERF_WAECHTER.md` §1 verlangt die Zahlen vorher/nachher in
 * jedem PR, der `packages/game-paint/**` anfasst, und `check-perf-table.mjs`
 * erzwingt sie im PR-Text. Bis heute war das Sammeln Handarbeit an Kokis Schirm —
 * für ein Vorher/Nachher über zwei Bäume ist das zu langsam, und eine
 * Handabschrift ist genau die Stelle, an der eine Zahl still falsch wird.
 *
 * WAS ES MISST UND WAS NICHT (§3 desselben Dokuments, wörtlich befolgt):
 *  · CPU je Bild, GPU-Zeit, Zeichenaufrufe, Texturspeicher, `create()` — alles
 *    aus `window.__domigoPaintPerf`, dem Instrument, das E1 gebaut hat.
 *  · Die BILDRATE nur mit KONTROLLMESSUNG: eine leere Seite im selben Chrome
 *    muss ~60 zeigen. Tut sie das nicht, ist die Zahl über das WERKZEUG, nicht
 *    über das Spiel, und der Lauf sagt das laut (P-56/P-57, E5-Korrektur).
 *  · Das ERSTBILD gehört laut §3 auf einen echten Schirm (36–236 ms Streuung in
 *    derselben Bedingung) — es wird mitgeschrieben und als „nicht belastbar"
 *    markiert, statt weggelassen zu werden. Eine fehlende Zahl ist Information.
 *
 * Benutzung (Dev-Server läuft bereits, eigener Port — P-65):
 *   node scripts/harvest-perf.mjs --port 3272 [--cdp-port 4272] [--warm 0]
 *        [--phases p1,p2,p3,p4,p9] [--settle 900] [--json out.json]
 */
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const arg = (name, dflt) => {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : dflt;
};
const PORT = Number(arg("port", "3272"));
const CDP = Number(arg("cdp-port", "0")); // D-207: 0 = Chrome sucht sich einen freien
const WARM = arg("warm", "1");
const PHASES = arg("phases", "p1,p2,p3,p4,p9").split(",");
const SETTLE = Number(arg("settle", "900"));
const JSON_OUT = arg("json", "");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const profile = mkdtempSync(path.join(tmpdir(), "harvest-perf-chrome-"));
const chrome = spawn(CHROME, [
  "--headless=new", "--hide-scrollbars", "--no-first-run",
  "--force-device-scale-factor=1", "--window-size=1200,900",
  "--autoplay-policy=no-user-gesture-required",
  `--user-data-dir=${profile}`, `--remote-debugging-port=${CDP}`, "about:blank",
], { stdio: ["ignore", "ignore", "ignore"] });

// R5-W4b · W3 · D-207-KLASSE, hier live erwischt. Dieses Skript leitete seinen
// Fernsteuer-Port aus dem Dev-Port ab (PORT + 1000) und fragte dann, ob dort JEMAND
// antwortet. In dieser Sitzung hat genau das zugeschlagen: ein Chrome aus dem
// VORIGEN Lauf hielt 4270 noch offen, der zweite Lauf starb mit »Chrome hat seinen
// Debug-Port nie geöffnet« — eine Meldung über den falschen Prozess. Zwei Läufe
// hintereinander reichen also schon; es braucht keine zehn parallelen Sessions.
//
// Gleiche Reparatur wie in `shoot-card-bench.mjs`: Standard 0 heißt »such dir einen
// freien«, und die Adresse wird aus `DevToolsActivePort` im EIGENEN Profilordner
// GELESEN. Wer diese Datei geschrieben hat, ist der Browser, den dieser Lauf
// gestartet hat — Freiheit und Identität in einem Griff.
const endpoint = async () => {
  const portFile = path.join(profile, "DevToolsActivePort");
  for (let i = 0; i < 80; i++) {
    if (existsSync(portFile)) {
      const [portLine, wsPath] = readFileSync(portFile, "utf8").split("\n");
      const bound = Number(portLine);
      if (Number.isInteger(bound) && bound > 0 && wsPath?.trim().startsWith("/devtools/")) {
        return `ws://127.0.0.1:${bound}${wsPath.trim()}`;
      }
    }
    await sleep(250);
  }
  throw new Error("Chrome hat in 20 s keinen DevToolsActivePort geschrieben "
    + `(Profil ${profile}) — bei fest gewähltem --cdp-port ${CDP} ist das meist ein belegter Port`);
};
const client = (ws) => {
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
    id += 1; waiting.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params, sessionId }));
  });
};

const ws = new WebSocket(await endpoint());
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
const send = client(ws);
const { targetId } = await send("Target.createTarget", { url: "about:blank" });
const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
const page = (m, p) => send(m, p, sessionId);
await page("Page.enable");
await page("Runtime.enable");
const evalIn = async (expression, awaitPromise = false) => {
  const r = await page("Runtime.evaluate", { expression, returnByValue: true, awaitPromise });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? "eval failed");
  return r.result.value;
};
const goto = async (url) => {
  await page("Page.navigate", { url });
  await sleep(1200);
};

/** Count real animation frames over a wall-clock second. */
const FPS_PROBE = `new Promise((res) => { let n = 0; const t0 = performance.now();
  const tick = () => { n++; if (performance.now() - t0 < 1000) requestAnimationFrame(tick);
    else res({ frames: n, ms: performance.now() - t0, hidden: document.hidden, vis: document.visibilityState }); };
  requestAnimationFrame(tick); })`;

// ── 1 · THE CONTROL. An empty page in THIS Chrome must reach ~60, or every fps
//        number below describes the tool and not the game (E5's own rule).
await goto("about:blank");
const control = await evalIn(FPS_PROBE, true);
const controlFps = (control.frames / control.ms) * 1000;
const fpsTrustworthy = controlFps > 50;

const rows = [];
for (const phase of PHASES) {
  const url = `http://localhost:${PORT}/play/1/buch?phase=${phase}&perf=1${WARM === "0" ? "&warm=0" : ""}`;
  await goto(url);
  // wait for the instrument, not for a stopwatch
  let ready = false;
  for (let i = 0; i < 60 && !ready; i++) {
    ready = await evalIn(`typeof window.__domigoPaintPerf?.read === "function"`).catch(() => false);
    if (!ready) await sleep(500);
  }
  if (!ready) { rows.push({ phase, error: "kein __domigoPaintPerf — Lehrer-Tür zu?" }); continue; }
  await sleep(SETTLE); // let the frame window fill
  const rep = await evalIn(`JSON.stringify(window.__domigoPaintPerf.read())`).then((s) => (s ? JSON.parse(s) : null));
  const status = await evalIn(`JSON.stringify(window.__domigoPaintPerf.status?.() ?? null)`)
    .then((s) => (s && s !== "null" ? JSON.parse(s) : null)).catch(() => null);
  rows.push({
    phase,
    cpuP50: rep?.frame?.cpu?.p50 ?? null,
    cpuP95: rep?.frame?.cpu?.p95 ?? null,
    fps: rep?.frame?.actualFps ?? null,
    over16: rep?.frame?.over16 ?? null,
    over33: rep?.frame?.over33 ?? null,
    glTextures: rep?.gpu?.glTextures ?? null,
    texMb: rep?.gpu?.textureBytesEst != null ? +(rep.gpu.textureBytesEst / 1048576).toFixed(1) : null,
    heapMb: rep?.heap?.usedMB ?? null,
    frames: rep?.window?.frames ?? null,
    raw: rep, status,
  });
}

const n = (v) => (v === null || v === undefined ? "?" : typeof v === "number" ? String(+v.toFixed(2)) : String(v));
console.log(`\nKontrollmessung (leere Seite, derselbe Chrome): ${controlFps.toFixed(1)} fps · hidden=${control.hidden} · ${control.vis}`);
console.log(fpsTrustworthy
  ? "⇒ Bildraten sind in diesem Lauf belastbar (E5-Korrektur zu P-56/57)."
  : "⇒ ⚠ die Kontrolle erreicht keine 60 — die fps-Spalte beschreibt das WERKZEUG, nicht das Spiel. Nicht zitieren.");
console.log(`\n| Phase | CPU/Bild p50 ms | p95 ms | fps (Instrument) | >16 ms | >33 ms | GL-Texturen | Texturen MB | Heap MB |`);
console.log(`|---|---|---|---|---|---|---|---|---|`);
for (const r of rows) {
  if (r.error) { console.log(`| ${r.phase} | — | — | — | — | — | — | — | ${r.error} |`); continue; }
  console.log(`| ${r.phase} | ${n(r.cpuP50)} | ${n(r.cpuP95)} | ${fpsTrustworthy ? n(r.fps) : "n/b"} | ${n(r.over16)} | ${n(r.over33)} | ${n(r.glTextures)} | ${n(r.texMb)} | ${n(r.heapMb)} |`);
}
console.log(`\nNICHT in dieser Tabelle, mit Absicht: create() und das ERSTBILD. PERF_WAECHTER §3
sagt, das Erstbild streut in derselben Bedingung 36–236 ms und gehört auf einen echten
Schirm; und ein DEV-Server misst ohnehin die falsche Sache (unminifiziertes React).
Beide Zahlen holt Kokis ?perf=1/&warm=0-Lauf — im Report angefordert.`);
if (JSON_OUT) writeFileSync(JSON_OUT, JSON.stringify({ controlFps, fpsTrustworthy, rows }, null, 1));

ws.close();
chrome.kill();
process.exit(0);
