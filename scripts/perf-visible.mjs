#!/usr/bin/env node
/**
 * perf-visible — DIE Perf-Tabelle, aus SICHTBAREM Chrome, mit Kontrollmessung
 * (R5-W5 · E6, Ruling R115).
 *
 * WARUM ES DAS GIBT. `PERF_WAECHTER.md` §1 verlangt die Zahlen für alle fünf
 * Phasen vorher/nachher in jedem PR, der das Spiel anfasst — aber jede Session
 * hat bisher anders gemessen, und zwei Sessions der Welle 4b lieferten leere
 * ms-Spalten. R115 macht Schluss damit: die Tabelle kommt aus EINEM Rezept, und
 * dieses Rezept ist dieses Skript. Wer nach E6 misst, ruft es auf.
 *
 * DIE EINE REGEL, DIE ALLES TRÄGT (P-61, E5 2026-08-14). Vor jeder Zahl über das
 * Spiel wird eine Zahl gemessen, deren richtiger Wert schon feststeht: eine LEERE
 * Seite im selben Browser muss 60 Bilder je Sekunde zeigen. Tut sie das nicht,
 * sind »das Spiel läuft mit 9 fps« und »mein Instrument sieht keine 60« dieselbe
 * Beobachtung — und dann bricht dieser Lauf ab, statt eine Zahl zu drucken, die
 * niemand einordnen kann. `harvest-perf.mjs` hatte dafür nur eine weiche Marke
 * (> 50, sonst »n/b« in einer Spalte); R115 verlangt den ABBRUCH, und genau das
 * ist der Unterschied zwischen den beiden Skripten.
 *
 * WARUM DIE SEITE ÜBERHAUPT SICHTBAR IST. Nicht, weil `--headless=new` fehlt —
 * sondern weil dieser Lauf seinen EIGENEN Chrome mit eigenem Profil startet und
 * sich an ein FRISCH erzeugtes Ziel hängt (`Target.createTarget`). Dort meldet
 * die Seite `document.hidden === false`, und die Bilduhr läuft. Für die
 * eingebauten Browser-Flächen gilt das NICHT (P-56/P-57). Deshalb wird
 * `visibilityState` in jedem Lauf gemessen und in den Beipackzettel geschrieben,
 * nie behauptet.
 *
 * WAS GEMESSEN WIRD, UND WO ES HERKOMMT:
 *   bau      der Szenen-Konstruktor (Sim + Kunst-Umfang) — in Node, weil kein
 *            Browser hineinsehen kann. Ohne diese Spalte ist `aufbau` manipulierbar:
 *            Arbeit eine Funktion früher schieben senkt die Zahl und nichts sonst
 *            (P-77). Berichtet wird deshalb immer `bau+aufbau`.
 *   laden    Wanduhr des Laders — eine Eigenschaft DIESES Laufs, nie des Builds.
 *   aufbau   `create()`, vom mitgelieferten Instrument gelesen — samt der
 *            Aufschlüsselung je Bauschritt (`PaintScene#buildReport()`).
 *   Erstbild GPU · eingeschwungen · fps · Zeichenaufrufe · Texturen.
 *
 * LÜCKEN SIND KEINE NULLEN (D-118). Der Erstbild-Rekorder verpasst je Lauf etwa
 * eine von fünf Phasen — ein Wettlauf zwischen Sonde und `create()`. Eine Phase
 * mit fehlenden Zahlen wird deshalb bis zu dreimal neu geladen; bleibt die Lücke,
 * steht in der Zelle »—«, niemals eine Zahl.
 *
 * Benutzung (der Server läuft bereits, PRODUKTIONS-Build, eigener Port — P-65):
 *   node --experimental-strip-types scripts/perf-visible.mjs --port 4056
 *        [--phases p1,p2,p3,p4,p9] [--warm 0] [--runs 1] [--settle 900]
 *        [--json out.json] [--baseline vorher.json] [--floor 58]
 *   node scripts/perf-visible.mjs --selftest      # ohne Browser, ohne Server
 *
 * `?perf=1` ist eine Lehrer-Tür: ohne Lehrer-Sitzung bzw. `DEV_TEACHER_ID` in
 * `apps/web/.env.local` gibt es kein Instrument zu lesen (D-117).
 */
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const ALL_PHASES = ["p1", "p2", "p3", "p4", "p9"];
const LEVEL_PATH = "content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json";
const ART_DIR = "apps/web/public/art/g1/paint";
/** Wie oft eine Phase mit Lücken neu geladen wird, bevor »—« stehen bleibt (D-118). */
const GAP_ATTEMPTS = 3;
/** Die Untergrenze der Kontrollmessung. 58 statt 60: die Bilduhr eines echten
 *  Bildschirms trifft die 60 nie exakt (E5 maß 60,2 — eine Sekunde Fenster hat
 *  Rundungsluft), 58 lässt genau diese Luft und nichts weiter. */
const CONTROL_FLOOR_FPS = 58;

// ─────────────────────────────────────────────────────────────────────────────
// REINE FUNKTIONEN — hier liegt alles, was der Selbsttest ohne Browser prüfen kann
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Das Urteil über die Kontrollmessung: darf dieser Lauf Zahlen drucken?
 *
 * Getrennt von der Messung, damit der Selbsttest BEIDE Richtungen sehen kann —
 * eine Schwelle, die nie rot wird, ist Dekoration (P-56).
 */
export const controlVerdict = (controlFps, floor = CONTROL_FLOOR_FPS) => {
  const fps = typeof controlFps === "number" && Number.isFinite(controlFps) ? controlFps : null;
  if (fps === null) {
    return { ok: false, fps: null, floor, message: "die Kontrollseite hat gar keine Bildrate geliefert" };
  }
  if (fps < floor) {
    return {
      ok: false,
      fps,
      floor,
      message:
        `die Kontrollseite (leere Seite, derselbe Chrome) zeigt ${fps.toFixed(1)} fps, verlangt sind ${floor}. `
        + "Damit beschreibt jede Zahl dieses Laufs das WERKZEUG und nicht das Spiel (P-61) — Abbruch.",
    };
  }
  return {
    ok: true,
    fps,
    floor,
    message: `Kontrollseite ${fps.toFixed(1)} fps (Schwelle ${floor}) — Bildraten dieses Laufs sind belastbar.`,
  };
};

/** Welche Zahlen einer Phase fehlen (D-118: eine Lücke sieht aus wie eine Null). */
export const gapsIn = (row) => {
  const wanted = ["loadMs", "createMs", "firstGpuMs", "settledGpuMs"];
  return wanted.filter((k) => row?.[k] === null || row?.[k] === undefined);
};

const num = (v, digits = 1) =>
  v === null || v === undefined || !Number.isFinite(Number(v)) ? "—" : String(+Number(v).toFixed(digits));

/**
 * Eine Zeile der Wächter-Tabelle. Mit `after === null` steht nur die eine
 * Messung da; mit beiden Seiten »vorher / nachher«, wie es die PR-Vorlage will.
 */
export const mdRow = (phase, before, after = null) => {
  const pair = (pick) => (after === null ? num(pick(before)) : `${num(pick(before))} / ${num(pick(after))}`);
  const bauAufbau = (r) => {
    if (r === null || r === undefined) return null;
    if (r.createMs === null || r.createMs === undefined) return null;
    return (r.bauMs ?? 0) + r.createMs;
  };
  const label = after === null ? phase : `${phase} vorher / nachher`;
  return `| ${label} | ${pair((r) => r?.loadMs)} | ${pair(bauAufbau)} | ${pair((r) => r?.firstGpuMs)} `
    + `| ${pair((r) => r?.settledGpuMs)} | ${pair((r) => r?.fps)} |`;
};

export const MD_HEAD = [
  "| Phase | laden (ms) | bau+aufbau (ms) | Erstbild GPU (ms) | eingeschwungen (ms) | fps |",
  "|---|---|---|---|---|---|",
];

export const mdTable = (rows, baseline = null) => {
  const byPhase = new Map(rows.map((r) => [r.phase, r]));
  const basePhase = new Map((baseline?.rows ?? []).map((r) => [r.phase, r]));
  const phases = rows.map((r) => r.phase);
  const body = phases.map((p) =>
    baseline === null ? mdRow(p, byPhase.get(p)) : mdRow(p, basePhase.get(p) ?? null, byPhase.get(p)),
  );
  return [...MD_HEAD, ...body].join("\n");
};

/** Die Bauschritt-Tabelle je Phase — die Aufschlüsselung, um die es E6 geht. */
export const mdBuildSteps = (rows) => {
  const steps = [...new Set(rows.flatMap((r) => (r.build ?? []).map((s) => s.step)))];
  if (steps.length === 0) return "";
  const head = `| Phase | ${steps.join(" | ")} | Summe |`;
  const sep = `|---|${steps.map(() => "---").join("|")}|---|`;
  const body = rows.map((r) => {
    const by = new Map((r.build ?? []).map((s) => [s.step, s.ms]));
    const sum = (r.build ?? []).reduce((a, s) => a + s.ms, 0);
    return `| ${r.phase} | ${steps.map((s) => num(by.get(s))).join(" | ")} | ${num(sum)} |`;
  });
  return [head, sep, ...body].join("\n");
};

// ─────────────────────────────────────────────────────────────────────────────
// SELBSTTEST — vor jedem Browser, denn die CI-Maschine hat keinen Chrome
// ─────────────────────────────────────────────────────────────────────────────

if (process.argv.includes("--selftest")) {
  const seen = [];
  const say = (ok, what) => {
    console.log(`${ok ? "✓" : "✗"} ${what}`);
    if (!ok) seen.push(what);
  };

  // 1 · Die Kontrollschwelle muss rot werden können — und zwar GEGEN DEN
  //     MESSWERT gebogen, nie gegen die Konfiguration (P-71): die Schwelle wird
  //     erst NACH der (hier simulierten) Messung über den gemessenen Wert
  //     gehoben, damit der rote Zweig bei JEDEM denkbaren Messwert feuert.
  const measured = 60.2; // was E5 an einer leeren Seite gemessen hat
  const green = controlVerdict(measured, CONTROL_FLOOR_FPS);
  say(green.ok === true, `eine Kontrolle mit ${measured} fps wird angenommen`);
  const bent = controlVerdict(measured, measured + 1);
  say(bent.ok === false, "dieselbe Messung, Schwelle über den Messwert gebogen ⇒ ABBRUCH (der rote Zweig ist erreichbar)");
  say(/werkzeug/i.test(bent.message), "die Abbruch-Meldung nennt den Grund (Werkzeug statt Spiel)");
  say(controlVerdict(null).ok === false, "eine fehlende Kontrollmessung ist kein Freibrief");
  say(controlVerdict(30).ok === false, "eine gedrosselte Kontrolle (30 fps) bricht ab");

  // 2 · Lücken (D-118) müssen als Lücken erkannt werden, nicht als Nullen.
  say(gapsIn({ loadMs: 1, createMs: null, firstGpuMs: 2, settledGpuMs: 3 }).includes("createMs"),
    "eine fehlende create()-Zahl wird als Lücke erkannt");
  say(gapsIn({ loadMs: 1, createMs: 2, firstGpuMs: 3, settledGpuMs: 4 }).length === 0,
    "eine vollständige Messung meldet keine Lücke");

  // 3 · Die Tabelle muss das Tor `check-perf-table.mjs` bestehen — und eine
  //     LEERE Tabelle muss es NICHT bestehen (sonst ist die Pflicht zahnlos).
  const full = ALL_PHASES.map((p, i) => ({
    phase: p, loadMs: 100 + i, bauMs: 10, createMs: 200 + i, firstGpuMs: 30, settledGpuMs: 3, fps: 60,
  }));
  const table = mdTable(full);
  const passesGate = (body) => {
    const lines = body.split("\n").filter((l) => l.trim().startsWith("|"));
    return ALL_PHASES.every((p) => {
      const row = lines.find((l) => new RegExp(`\\|\\s*${p}\\b`).test(l));
      return row !== undefined && /\d/.test(row.replace(new RegExp(p, "g"), ""));
    });
  };
  say(passesGate(table), "die erzeugte Tabelle erfüllt check-perf-table (alle fünf Phasen mit Ziffern)");
  const empty = mdTable(ALL_PHASES.map((p) => ({ phase: p })));
  say(!passesGate(empty), "eine Tabelle ganz ohne Messwerte fällt durch dasselbe Tor");
  say(mdRow("p1", full[0]).includes("210"), "bau+aufbau wird addiert, nicht nur aufbau berichtet (P-77)");

  if (seen.length === 0) {
    console.log("\nperf-visible SELBSTTEST: OK — die Kontrollschwelle hat ihr rotes Licht gesehen.");
    process.exit(0);
  }
  console.error(`\n✗ SELBSTTEST FEHLGESCHLAGEN: ${seen.length} Erwartung(en) nicht erfüllt.`);
  process.exit(1);
}

// ─────────────────────────────────────────────────────────────────────────────
// AB HIER: der echte Lauf
// ─────────────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const arg = (name, dflt) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 || args[i + 1] === undefined ? dflt : args[i + 1];
};

// --port ist PFLICHT. `harvest-perf.mjs` trug B4bs Port 3272 als Standard — ein
// Standard-Port ist in einem Haus mit sieben parallelen Sessions ein
// Fehler-Generator (P-65): man misst den Server des Nachbarn und merkt es nicht.
const portArg = arg("port", null);
if (portArg === null || !Number.isInteger(Number(portArg))) {
  console.error("perf-visible: --port <n> ist Pflicht (P-65: eigener Port je Session, nie der des Nachbarn).");
  process.exit(2);
}
const PORT = Number(portArg);
const CDP = Number(arg("cdp-port", "0")); // 0 = das Betriebssystem sucht einen freien (D-207)
const PHASES = String(arg("phases", ALL_PHASES.join(","))).split(",").filter(Boolean);
const WARM_OFF = arg("warm", null) === "0";
const RUNS = Number(arg("runs", "1"));
const SETTLE = Number(arg("settle", "900"));
const JSON_OUT = arg("json", null);
const BASELINE = arg("baseline", null);
const FLOOR = Number(arg("floor", String(CONTROL_FLOOR_FPS)));
const LABEL = arg("label", WARM_OFF ? "warm=0" : "warm=1");
// Nur für den Tamper-Beweis im Report: biegt die GEMESSENE Kontrollzahl nach
// unten, nachdem sie gemessen wurde. Das Skript muss danach abbrechen.
const TAMPER_CONTROL = args.includes("--tamper-control");

if (!existsSync(CHROME)) {
  console.error(`perf-visible: kein Chrome unter ${CHROME}`);
  process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

// ── bau: der Konstruktor, in Node gemessen (kein Browser sieht hinein, P-77) ──
const { Sim } = await import("../packages/game-paint/src/sim.ts");
const { phaseArtScope } = await import("../packages/game-paint/src/artScope.ts");
const level = JSON.parse(readFileSync(path.resolve(LEVEL_PATH), "utf8"));
const present = readdirSync(path.resolve(ART_DIR), { withFileTypes: true })
  .flatMap((d) => (d.isDirectory()
    ? readdirSync(path.join(path.resolve(ART_DIR), d.name)).filter((f) => f.endsWith(".png"))
    : []))
  .map((f) => f.replace(/\.png$/, ""));

const constructorMs = (phaseId, iterations = 7) => {
  const xs = [];
  for (let i = 0; i < iterations; i++) {
    const t0 = performance.now();
    phaseArtScope(level, phaseId, present);
    new Sim({ level, phaseId, grantedAbilities: () => [], freedCageIds: () => [] });
    xs.push(performance.now() - t0);
  }
  return median(xs);
};

// ── der eigene Browser ───────────────────────────────────────────────────────
const profile = mkdtempSync(path.join(tmpdir(), "perf-visible-chrome-"));
const chrome = spawn(CHROME, [
  "--headless=new",
  "--hide-scrollbars",
  "--no-first-run",
  "--force-device-scale-factor=1",
  "--window-size=1200,900",
  "--autoplay-policy=no-user-gesture-required",
  // Die Bilduhr wach halten: ein in den Hintergrund gestellter Renderer drosselt
  // genau die Zeitgeber, auf denen diese Messung reitet (aus measure-create.mjs).
  "--disable-renderer-backgrounding",
  "--disable-backgrounding-occluded-windows",
  "--disable-background-timer-throttling",
  `--user-data-dir=${profile}`,
  `--remote-debugging-port=${CDP}`,
  "about:blank",
], { stdio: ["ignore", "ignore", "ignore"] });

let chromeGone = null;
chrome.on("error", (e) => { chromeGone = `konnte nicht starten: ${e.message}`; });
chrome.on("exit", (code, signal) => {
  if (chromeGone === null) chromeGone = `ist ausgestiegen (Code ${code ?? "—"}, Signal ${signal ?? "—"})`;
});

// D-207: die Adresse wird aus `DevToolsActivePort` im EIGENEN Profil GELESEN —
// diese Datei kann nur der Browser geschrieben haben, den dieser Lauf gestartet
// hat. Freiheit (Port 0) und Identität in einem Griff. Das funktioniert hier,
// weil kein `--disable-gpu` übergeben wird — mit dem schreibt Chrome die Datei
// nicht (gemessen in shoot-card-bench.mjs), und für eine GPU-Messung wäre es
// ohnehin das Falsche.
const endpoint = async () => {
  const portFile = path.join(profile, "DevToolsActivePort");
  for (let i = 0; i < 80; i++) {
    if (chromeGone !== null) throw new Error(`Chrome ${chromeGone}`);
    if (existsSync(portFile)) {
      const [portLine, wsPath] = readFileSync(portFile, "utf8").split("\n");
      const bound = Number(portLine);
      if (Number.isInteger(bound) && bound > 0 && wsPath?.trim().startsWith("/devtools/")) {
        return `ws://127.0.0.1:${bound}${wsPath.trim()}`;
      }
    }
    await sleep(250);
  }
  throw new Error(`Chrome hat in 20 s keinen DevToolsActivePort geschrieben (Profil ${profile})`);
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
    id += 1;
    waiting.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params, sessionId }));
  });
};

/** Echte Bilder über eine Wanduhr-Sekunde zählen. */
const FPS_PROBE = `new Promise((res) => { let n = 0; const t0 = performance.now();
  const tick = () => { n++; if (performance.now() - t0 < 1000) requestAnimationFrame(tick);
    else res({ frames: n, ms: performance.now() - t0, hidden: document.hidden, vis: document.visibilityState }); };
  requestAnimationFrame(tick); })`;

const ws = new WebSocket(await endpoint());
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
const send = client(ws);

const withPage = async (fn) => {
  const { targetId } = await send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
  const page = (m, p) => send(m, p, sessionId);
  const evalIn = async (expression, awaitPromise = false) => {
    const r = await page("Runtime.evaluate", { expression, returnByValue: true, awaitPromise });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? "eval fehlgeschlagen");
    return r.result.value;
  };
  try {
    await page("Page.enable");
    await page("Runtime.enable");
    return await fn({ page, evalIn });
  } finally {
    await send("Target.closeTarget", { targetId }).catch(() => {});
  }
};

const die = async (code, message) => {
  console.error(message);
  try { ws.close(); } catch { /* egal */ }
  chrome.kill();
  process.exit(code);
};

// ── 1 · DIE KONTROLLE ────────────────────────────────────────────────────────
const control = await withPage(async ({ page, evalIn }) => {
  await page("Page.navigate", { url: "about:blank" });
  await sleep(600);
  return evalIn(FPS_PROBE, true);
});
let controlFps = (control.frames / control.ms) * 1000;
if (TAMPER_CONTROL) {
  // TAMPER gegen den MESSWERT (P-71), angewandt NACH der Messung: die gemessene
  // Zahl wird unter die Schwelle gebogen. Der Abbruch muss danach feuern, ganz
  // gleich, was der Browser gerade wirklich geliefert hat.
  const bent = FLOOR - 1;
  console.log(`--tamper-control: gemessen ${controlFps.toFixed(1)} fps → gebogen auf ${bent.toFixed(1)} (Beweis, dass der Abbruch erreichbar ist)`);
  controlFps = bent;
}
const verdict = controlVerdict(controlFps, FLOOR);
console.log(`\nKontrollmessung: ${verdict.message}`);
console.log(`Bedingungen: hidden=${control.hidden} · visibilityState=${control.vis}`);
if (!verdict.ok) await die(1, "\n✗ perf-visible bricht ab — ohne belastbare Kontrolle wird hier keine Zahl gedruckt (R115/P-61).");

// ── 2 · die fünf Phasen ──────────────────────────────────────────────────────
const measureOnce = async (phase) => withPage(async ({ page, evalIn }) => {
  const url = `http://localhost:${PORT}/play/1/buch?phase=${phase}&perf=1${WARM_OFF ? "&warm=0" : ""}`;
  await page("Page.navigate", { url });

  let ready = false;
  for (let i = 0; i < 240 && !ready; i++) {
    await sleep(250);
    const st = await evalIn(`(() => {
      const p = window.__domigoPaintPerf;
      if (!p) return null;
      p.pump();
      return p.status().find((s) => s.key === "paint") ?? p.status()[0] ?? null;
    })()`).catch(() => null);
    if (st && st.progress >= 1 && st.children > 0) ready = true;
  }
  if (!ready) return { phase, error: "die Szene wurde nie fertig geladen (Lehrer-Tür zu? falscher Port?)" };

  // ein Bild von Hand, damit es überhaupt ein Erstbild zu berichten gibt
  await evalIn(`window.__domigoPaintPerf.drive(2, 1000/60)`, true).catch(() => null);

  const ff = await evalIn(`(async () => {
    const p = window.__domigoPaintPerf;
    const r = await p.firstFrame(1600);
    return {
      loadMs: r.loadMs, createMs: r.createMs, filesQueued: r.filesQueued,
      firstGpuMs: r.firstGpuMs, settledGpuMs: r.settledGpuMs,
      firstCpuMs: r.firstCpuMs, firstDrawCalls: r.firstDrawCalls,
      build: r.build, warmed: r.warmed,
    };
  })()`, true);

  await sleep(SETTLE); // das Bildfenster füllen lassen
  const fpsProbe = await evalIn(FPS_PROBE, true);
  const rep = await evalIn(`JSON.stringify(window.__domigoPaintPerf.read())`)
    .then((s) => (s ? JSON.parse(s) : null)).catch(() => null);

  return {
    phase,
    loadMs: ff.loadMs, createMs: ff.createMs, filesQueued: ff.filesQueued,
    firstGpuMs: ff.firstGpuMs, settledGpuMs: ff.settledGpuMs,
    firstCpuMs: ff.firstCpuMs, firstDrawCalls: ff.firstDrawCalls,
    build: Array.isArray(ff.build) ? ff.build : null,
    fps: (fpsProbe.frames / fpsProbe.ms) * 1000,
    hidden: fpsProbe.hidden, visibility: fpsProbe.vis,
    cpuP50: rep?.frame?.cpu?.p50 ?? null,
    cpuP95: rep?.frame?.cpu?.p95 ?? null,
    drawCalls: rep?.gpu?.drawCallsPerFrame ?? null,
    glTextures: rep?.gpu?.glTextures ?? null,
    texMb: rep?.gpu?.textureBytesEst != null ? +(rep.gpu.textureBytesEst / 1048576).toFixed(1) : null,
  };
});

const rows = [];
for (const phase of PHASES) {
  const bauMs = constructorMs(phase);
  const takes = [];
  let attempts = 0;
  // D-118: eine Lücke wird NEU GELADEN, nicht gedruckt.
  while (takes.length < RUNS && attempts < RUNS + GAP_ATTEMPTS) {
    attempts += 1;
    const r = await measureOnce(phase);
    if (r.error) { console.error(`  ${phase}: ${r.error}`); break; }
    const gaps = gapsIn(r);
    if (gaps.length > 0 && attempts < RUNS + GAP_ATTEMPTS) {
      console.error(`  ${phase}: Lücke in ${gaps.join(", ")} (D-118) — Versuch ${attempts}, neu laden`);
      continue;
    }
    takes.push(r);
  }
  if (takes.length === 0) { rows.push({ phase, bauMs, error: "keine vollständige Messung" }); continue; }
  const pick = (k) => {
    const xs = takes.map((t) => t[k]).filter((v) => typeof v === "number" && Number.isFinite(v));
    return xs.length ? median(xs) : null;
  };
  // Die Bauschritte werden GENAUSO gemittelt wie `createMs` darüber. Sonst steht
  // in der Zeile ein Median über drei Läufe und in der Tabelle darunter der
  // ERSTE, kalte Lauf — und die Summe der Schritte ist größer als die Zahl, die
  // sie aufschlüsseln soll. (Beim ersten Lauf dieses Skripts war p1 genau so:
  // 425 ms Median über 749 ms Schritt-Summe.) Eine Aufschlüsselung, die eine
  // andere Messung aufschlüsselt als die daneben, ist keine.
  const stepNames = [...new Set(takes.flatMap((t) => (t.build ?? []).map((s) => s.step)))];
  const build = stepNames.map((step) => {
    const xs = takes
      .map((t) => (t.build ?? []).find((s) => s.step === step)?.ms)
      .filter((v) => typeof v === "number" && Number.isFinite(v));
    return { step, ms: xs.length ? median(xs) : null };
  });
  const row = {
    phase, bauMs, runs: takes.length, attempts,
    loadMs: pick("loadMs"), createMs: pick("createMs"), firstGpuMs: pick("firstGpuMs"),
    settledGpuMs: pick("settledGpuMs"), firstCpuMs: pick("firstCpuMs"),
    firstDrawCalls: takes[0].firstDrawCalls, filesQueued: takes[0].filesQueued,
    fps: pick("fps"), cpuP50: pick("cpuP50"), cpuP95: pick("cpuP95"),
    drawCalls: pick("drawCalls"), glTextures: pick("glTextures"), texMb: pick("texMb"),
    build: build.length > 0 ? build : null,
    buildFirstRun: takes[0].build,
    hidden: takes[0].hidden, visibility: takes[0].visibility,
    gaps: gapsIn(takes[0]),
  };
  rows.push(row);
  console.log(`  ${phase}: bau ${num(row.bauMs)} + aufbau ${num(row.createMs)} ms · laden ${num(row.loadMs)} ms · ${num(row.fps)} fps${row.gaps.length ? `  ⚠ Lücken: ${row.gaps.join(", ")}` : ""}`);
}

// ── 3 · Ausgabe ──────────────────────────────────────────────────────────────
const baseline = BASELINE && existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, "utf8")) : null;
console.log(`\n## PERF-WÄCHTER (${LABEL})\n`);
console.log(mdTable(rows, baseline));
const steps = mdBuildSteps(rows);
if (steps) {
  console.log(`\nBauschritte je Phase (ms, Median über ${RUNS} Lauf/Läufe — dieselbe Mittelung wie »aufbau« oben):\n\n${steps}`);
}
console.log(`\nGemessen mit: scripts/perf-visible.mjs · eigener Chrome --headless=new · `
  + `sichtbarer Tab (visibilityState=${control.vis}, hidden=${control.hidden}) · Kontrollseite ${verdict.fps.toFixed(1)} fps · Port ${PORT}`);
for (const r of rows) {
  if (r.gaps?.length) console.log(`⚠ ${r.phase}: ${r.gaps.join(", ")} blieb auch nach ${GAP_ATTEMPTS} Anläufen leer (D-118) — »—« ist die ehrliche Zelle.`);
  if (r.error) console.log(`⚠ ${r.phase}: ${r.error}`);
}

let commit = null;
try {
  const { execFileSync } = await import("node:child_process");
  commit = execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
} catch { /* kein git — dann steht null da, und das ist die Wahrheit */ }

const sidecar = {
  script: "scripts/perf-visible.mjs",
  label: LABEL,
  port: PORT,
  commit,
  controlFps: verdict.fps,
  controlFloor: FLOOR,
  visibilityState: control.vis,
  hidden: control.hidden,
  warm: WARM_OFF ? "0" : "1",
  runsPerPhase: RUNS,
  rows,
};
if (JSON_OUT) {
  writeFileSync(JSON_OUT, JSON.stringify(sidecar, null, 1));
  console.log(`\n→ Beipackzettel: ${JSON_OUT}`);
}

ws.close();
chrome.kill();
process.exit(rows.some((r) => r.error) ? 1 : 0);
