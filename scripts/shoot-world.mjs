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
 *        [--press left|right|jump] [--name uns_kaefig] [--tick 900]
 *
 * ── --tick, und warum ein Vorher/Nachher es braucht (R5-W6b · W5, L1) ──────
 * Bis hierher konnte diese Reihe sagen, WANN sie entstanden ist (`state().tick`
 * steht im Beipackzettel), aber nicht, WANN sie entstehen SOLL. An etwas
 * Bewegtem — einem ruettelnden Kaefig, einer atmenden Figur — heisst das: zwei
 * Laeufe derselben Kameralage zeigen verschiedene Phasen derselben Bewegung,
 * und dieser Unterschied sieht in einem Seite-an-Seite genauso aus wie eine
 * Aenderung am Bild. `--tick n` fixiert den Takt der ERSTEN Aufnahme; die Reihe
 * laeuft danach wie gewohnt in `--every`-Schritten weiter.
 *
 * Gewartet wird auf den ZUSTAND, nicht auf die Uhr: gefahren wird mit
 * `frameSink.drive()`, und danach wird `state().tick` GELESEN. Ein Zeitgeber
 * waere hier besonders falsch — im verborgenen Tab drosselt Chrome ihn, und
 * eine Reihe, die »ungefaehr bei 900« sagt, ist keine Fixierung.
 *
 * Liegt der Takt schon ueber `n`, bricht der Lauf ab. Zurueckspulen kann
 * niemand, und ein Werkzeug, das dann still das naechstbeste Bild nimmt, macht
 * aus einer Fixierung eine Behauptung.
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

// ── R5-W5 · W4 · D-259 · `--fight`: DIE TAKTE DES KAMPFS ALS BILDREIHE ──────
//
// Zwei Gesetze, die dieser Modus braucht und die OHNE Browser prüfbar sind —
// deshalb stehen sie hier oben, vor allem, was Chrome anfasst, und deshalb kann
// `--selftest` sie in CI fahren.
//
// GESETZ 1 · DIE ABTASTRATE. Der Kampf hat zwei Takte: der Wisch dauert
// WIPE_TICKS, der Knoten-Schlag KNOT_BEAT_TICKS. Wer seltener abtastet als
// halb so oft (Nyquist), fotografiert eine Bewegung, die es nicht gibt — die
// Alias-Falle, die D-171 gemeldet hat. Die Zahlen sind hier KOPIERT, und weil
// eine Kopie driftet, liest der Selbsttest sie aus `entities.ts` nach.
const FIGHT_BEATS = { WIPE_TICKS: 36, KNOT_BEAT_TICKS: 48 };
export const maxEveryForFight = (beats = FIGHT_BEATS) =>
  Math.floor(Math.min(...Object.values(beats)) / 3); // ein Drittel, nicht die Hälfte: Nyquist ist die
                                                     // Grenze, an der ein Signal gerade noch existiert,
                                                     // nicht die, an der man es ansehen kann.

// GESETZ 2 · DER BEIPACKZETTEL. `solveTask()` ist nicht neutral: bei `task` und
// `finale` ruft es `resolveCorrect()`. Das Werkzeug BEANTWORTET die Aufgabe also
// richtig und spielt den Kampf ein Stück weit selbst. Eine Bildreihe ohne diesen
// Hinweis liest sich wie Spiel — und wäre eine Lüge über ihre eigene Herkunft.
// Also: sobald der Lauf EINE Karte gelöst hat, trägt JEDES Bild der Reihe den
// Vermerk, nicht nur das eine, an dem es passierte.
export const BEIPACKZETTEL = "Werkzeug hat die Karte gelöst (solveTask ⇒ resolveCorrect) — "
  + "diese Reihe zeigt den Kampf, NICHT das Spiel eines Kindes";
export const fightSidecar = (geloest) => (geloest.length === 0
  ? { fight: true, karten: [] }
  : { fight: true, karten: geloest, beipackzettel: BEIPACKZETTEL });

const outDir = argv.find((a) => !a.startsWith("--") && argv[argv.indexOf(a) - 1]?.startsWith("--") !== true);

if (has("--selftest")) {
  // Was hier läuft, braucht keinen Browser: die Abtast-Regel und der
  // Beipackzettel sind reine Arithmetik über zwei Konstanten und eine Liste.
  const fs = await import("node:fs");
  const url = await import("node:url");
  const hier = path.dirname(url.fileURLToPath(import.meta.url));
  let bad = 0;
  const ok = (name, got, want) => {
    if (got === want) console.log(`  ✓ ${name}`);
    else { bad++; console.error(`  ✗ ${name} — erwartet ${want}, bekommen ${got}`); }
  };

  // 1 · die kopierten Takt-Zahlen müssen die aus dem Spiel sein. Eine Kopie,
  //     die niemand nachliest, driftet — genau die Klasse, die W4 heute in
  //     key-fringe.mjs aufgeräumt hat.
  const ent = fs.readFileSync(path.join(hier, "../packages/game-paint/src/entities.ts"), "utf8");
  for (const [name, wert] of Object.entries(FIGHT_BEATS)) {
    const m = new RegExp(`export const ${name} = (\\d+)`).exec(ent);
    if (m === null) { bad++; console.error(`  ✗ ${name} steht nicht mehr in entities.ts — Takt-Kopie ungültig`); continue; }
    ok(`${name} stimmt mit entities.ts überein`, Number(m[1]), wert);
  }

  // 2 · die Abtastrate liegt unter beiden Takten (D-171, Alias-Falle)
  const maxEvery = maxEveryForFight();
  ok("die Höchst-Abtastrate liegt unter dem Wisch-Takt", maxEvery < FIGHT_BEATS.WIPE_TICKS / 2, true);
  ok("…und unter dem Knoten-Schlag", maxEvery < FIGHT_BEATS.KNOT_BEAT_TICKS / 2, true);
  ok("eine zu grobe Rate wird abgewiesen", maxEvery >= 24, false);

  // 3 · der Beipackzettel erscheint GENAU DANN, wenn eine Karte gelöst wurde —
  //     beide Richtungen, sonst prüft der Fall nur eine.
  ok("ohne gelöste Karte kein Beipackzettel", fightSidecar([]).beipackzettel, undefined);
  ok("mit gelöster Karte steht er drauf", fightSidecar(["wer"]).beipackzettel, BEIPACKZETTEL);
  ok("…und er nennt den Grund beim Namen", fightSidecar(["wer"]).beipackzettel.includes("resolveCorrect"), true);
  ok("…und die Karten stehen mit dabei", fightSidecar(["wer", "wie"]).karten.join(","), "wer,wie");

  if (bad > 0) { console.error("shoot-world --selftest: FEHLGESCHLAGEN"); process.exit(1); }
  console.log("shoot-world --selftest: OK — die Takt-Kopien stimmen mit entities.ts überein, "
    + "die Abtastrate liegt unter beiden Kampf-Takten, und der Beipackzettel erscheint genau dann, "
    + "wenn das Werkzeug mitgespielt hat.");
  process.exit(0);
}

if (!outDir) {
  console.error("usage: node scripts/shoot-world.mjs <outDir> --phase p1 --port 3021 [...]");
  console.error("       node scripts/shoot-world.mjs --selftest");
  process.exit(1);
}
const phase = flag("--phase", "p1");
const port = Number(flag("--port", 3021));
const sinkPort = Number(flag("--sink-port", 3921));
const cdpPort = Number(flag("--cdp-port", 9341));
const fight = has("--fight");
const shots = Number(flag("--shots", fight ? 24 : 8));
// D-171: im Kampf wird die Rate ERZWUNGEN, nicht dem Aufrufer überlassen.
const everyWunsch = Number(flag("--every", fight ? 8 : 6));
const every = fight ? Math.min(everyWunsch, maxEveryForFight()) : everyWunsch;
// …und p4 läuft mit 240 Setz-Schritten über sein Ende hinaus (gemessen 17.08.:
// bei 240 steht der Tick hinterher, bei 20 und 60 läuft die Welt).
const settle = Number(flag("--settle", fight ? 20 : 240));
const warp = flag("--warp", null);
const press = flag("--press", null);
const stem = flag("--name", "frame");
// R5-W6b · W5 · L1s Befund: der Tick einer Aufnahme liess sich nicht vorgeben,
// also war ein Vorher/Nachher an bewegten Dingen nur eingeschraenkt
// vergleichbar (zwei Laeufe derselben Kameralage zeigen verschiedene Phasen
// derselben Bewegung, und der Unterschied sieht aus wie eine Aenderung).
const tickWunsch = flag("--tick", null) === null ? null : Number(flag("--tick", null));
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
  // R5-W4b · W3: die Meldung darf nicht behaupten, was sie nicht geprüft hat.
  // Vorher endete JEDER Fehlschlag hier mit „obwohl keine Karte offen ist" — auch
  // dann, wenn die Schleife 24-mal an einer Karte hängen blieb und die Lauf-Prüfung
  // nie erreichte. Das ist eine Falschaussage über die eigene Ursache, und sie hat
  // eine Sitzung gekostet. Jetzt wird mitgeschrieben, was wirklich passiert ist, und
  // die Karte wird beim NAMEN genannt (`beat()` kennt ihn, `state().overlay` ist nur
  // ein Ja/Nein).
  const karte = async () => evalIn(`(() => { const b = window.__domigoPaint.beat?.(); `
    + `return b ? (b.overlay ?? "—") : "?"; })()`);
  // …und sie darf nicht zu früh aufgeben. 24 Runden sind rund sieben Sekunden; ein
  // FRISCHER kopfloser Browser hat zu dem Zeitpunkt die Szene zwar gebaut (`state()`
  // antwortet, darum meldet der Wächter oben »Spiel da«), lädt aber noch die Blätter —
  // eine Phase trägt bis 26 MB. Der Takt steht dann, ohne dass irgendetwas kaputt ist.
  // Gemessen in dieser Sitzung: mit 24 Runden schlug p1 zweimal fehl, mit 120 lief es.
  // ── R5-W5 · W4 · WELCHE QUELLE SAGT DIE WAHRHEIT ÜBER EINE OFFENE KARTE ──
  // Bisher stand hier an drei Stellen `state().overlay === true`. Das ist
  // `sim.overlayOpen` — die Sicht der SPIELSCHLEIFE darauf, ob sie angehalten
  // ist. Ob eine Karte auf dem SCHIRM liegt, ist eine andere Frage, und
  // PaintGame beantwortet sie mit `beat().overlay` (dem Namen der Karte oder
  // null). Die beiden laufen absichtlich auseinander: an drei Stellen gibt
  // PaintGame die Welt frei, ohne die Karte zu schließen (Kartenkette
  // find → Regel, der Arena-Takt „wie", der Ausgang) — dort läuft die Schleife,
  // und eine Karte liegt trotzdem oben. C3 hat das gemeldet, auf main war es
  // nicht behoben, und A6bs „der Tick bewegt sich nicht" war dieses Werkzeug.
  //
  // Also fragt dieser Lauf ab jetzt das, was er wissen will: liegt eine Karte
  // auf dem Schirm? `beat().overlay !== null`. Der Kartenname kommt gratis mit,
  // weshalb die Fehlermeldung unten die Karte beim Namen nennen kann statt zu
  // behaupten, es liege keine.
  const karteOffen = async () => evalIn(
    `(() => { const b = window.__domigoPaint.beat?.(); return b ? b.overlay !== null : false; })()`,
  );
  let alive = false;
  let runden = 0;
  let kartenRunden = 0;
  let letzteKarte = null;
  for (let i = 0; i < 120; i++) {
    runden = i + 1;
    if (await karteOffen()) {
      kartenRunden += 1;
      letzteKarte = await karte();
      await evalIn(`window.__domigoPaint.solveTask()`);
      await sleep(180);
      continue;
    }
    if (await runs()) { alive = true; break; }
    await sleep(180);
  }
  if (!alive) {
    const nochOffen = await karteOffen();
    await fail(nochOffen
      ? `die Welt steht still, weil eine KARTE sie festhält: »${letzteKarte ?? await karte()}« — `
        + `${kartenRunden} von ${runden} Runden hingen daran, und solveTask() bekam sie nicht zu. `
        + "Das ist D-198: ein Kartenfenster friert die Welt ein, und diese Reihe wäre N-mal dasselbe Bild."
      : `die Welt läuft nicht: der Tick bewegt sich in ${runden} Runden nicht, und offen ist keine Karte `
        + "— jede Reihe wäre N-mal dasselbe Bild (Falle 2)");
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
  // ── DIE press()-WAND (R5-W6b · W5 · S2-Befund) ──────────────────────────
  // `__domigoPaint.press()` bewegt das Kind NICHT, solange eine Karte oben
  // liegt: S2 hat `vx: 0` gemessen, bei Boden unter den Fuessen, und echte
  // Pfeiltasten erreichen Phaser in einem CDP-Ziel dort auch nicht. Das ist
  // eine WAND, keine Messung — und bis heute war sie still: der Lauf schoss
  // seine Reihe, das Kind stand, und wer sich auf `--press` verliess, mass die
  // Stille seiner eigenen Umgehung.
  // Also wird jetzt nachgesehen. Gelesen wird der ZUSTAND (x und vx), nicht die
  // Absicht — und wenn nichts passiert ist, endet der Lauf mit einer Meldung,
  // die die Karte beim Namen nennt, statt mit einer Bildreihe, die eine
  // Bewegung behauptet.
  // BEIDE Achsen, und das ist kein Detail: `--press jump` bewegt das Kind in y,
  // nicht in x. Eine Wand-Pruefung, die nur x liest, wuerde jeden Sprung als
  // »nicht bewegt« melden — eine Falschmeldung, die genau die Sorte Schaden
  // anrichtet, gegen die diese Pruefung gebaut ist.
  const lage = async () => evalIn("(() => { const s = window.__domigoPaint.state(); "
    + "return { x: s.x, y: s.y, vx: s.vx, vy: s.vy }; })()");
  const vorherLage = press === null ? null : await lage();
  if (press !== null) await evalIn(`window.__domigoPaint.press({ ${press}: true })`);
  await evalIn(`(() => { for (let i = 0; i < ${settle}; i++) window.__domigoPaint.step(); return true; })()`);
  if (press !== null) {
    const jetzt = await lage();
    const bewegt = Math.abs(jetzt.x - vorherLage.x) > 0.5 || Math.abs(jetzt.y - vorherLage.y) > 0.5
      || Math.abs(jetzt.vx) > 0.01 || Math.abs(jetzt.vy) > 0.01;
    if (!bewegt) {
      const wer = await karte();
      const offen = await karteOffen();
      await fail(`--press ${press} hat das Kind NICHT bewegt: x ${vorherLage.x.toFixed(1)} → ${jetzt.x.toFixed(1)}, `
        + `y ${vorherLage.y.toFixed(1)} → ${jetzt.y.toFixed(1)}, vx ${jetzt.vx.toFixed(2)}, vy ${jetzt.vy.toFixed(2)} `
        + `nach ${settle} Schritten. `
        + (offen
          ? `Die Karte »${wer}« liegt oben — das ist die bekannte Wand (S2, R5-W6): press() erreicht die `
            + "Spielfigur bei offenem Overlay nicht, und echte Pfeiltasten in einem CDP-Ziel auch nicht. "
            + "Erst die Karte schliessen (--fight loest sie), dann pressen."
          : "Keine Karte liegt oben — das Kind steht aus einem anderen Grund (Wand, Kante, kein Boden "
            + "unter den Fuessen nach --warp). Eine Reihe waere hier N-mal dasselbe Bild."));
    }
  }
  // …und noch einmal: das Beziehen der Stellung schlägt gern eine Karte auf
  // (Käfig-Hinweis!), und dann steht die Welt wieder.
  for (let i = 0; i < 8; i++) {
    if (!(await karteOffen())) break;
    await evalIn(`window.__domigoPaint.solveTask()`);
    await sleep(180);
  }
  if (!(await runs())) {
    // W4: „(Karte offen?)" war eine Vermutung in einer Fehlermeldung — dieselbe
    // Klasse, die W3 eine Zeile weiter oben ausgeräumt hat. Jetzt wird gefragt,
    // und zwar vollständig: eine Karte ist nur EINER von zwei Gründen, aus denen
    // die Welt steht. Der andere ist der HALT (`beat().hold`), mit dem die Arena
    // den Kampf-Takt festhält — genau die Stelle, an der D-198/D-259 sitzt. Eine
    // Meldung, die nur nach der Karte fragt, schickt den Leser in die Irre.
    const zettel = await evalIn(`(() => JSON.stringify(window.__domigoPaint.beat?.() ?? null))()`);
    const wer = await karte();
    await fail(await karteOffen()
      ? `nach dem Stellungsbeziehen hält die Karte »${wer}« die Welt fest, und solveTask() `
        + `bekam sie in acht Runden nicht zu — Reihe abgebrochen (D-198/D-259: der Kampf braucht --fight). `
        + `Takt: ${zettel}`
      : "nach dem Stellungsbeziehen läuft die Welt nicht mehr, und es liegt KEINE Karte oben "
        + `— der Tick steht aus einem anderen Grund. Takt: ${zettel} `
        + "(steht dort `hold: true`, hält die Arena den Kampf fest — D-198/D-259, nicht dein Code)");
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

  // ── 8b · DEN TAKT FIXIEREN (R5-W6b · W5 · L1) ────────────────────────────
  // Ab hier steht die Uhr (`freeze`), und die Welt rueckt nur noch, wenn wir es
  // sagen — genau deshalb ist DIES die Stelle, an der ein gewuenschter Takt
  // erreichbar ist: die zwei Probeaufnahmen haben ihre Ticks schon gekostet,
  // die erste ECHTE Aufnahme kommt gleich.
  if (tickWunsch !== null) {
    let ist = await evalIn(`window.__domigoPaint.state().tick`);
    if (ist > tickWunsch) {
      await fail(`--tick ${tickWunsch} liegt hinter dem Lauf: die Welt steht schon auf Tick ${ist}. `
        + "Zurueckspulen kann niemand — mit kleinerem --settle noch einmal, oder einen Takt weiter vorne waehlen. "
        + "(Still das naechstbeste Bild zu nehmen waere aus der Fixierung eine Behauptung gemacht.)");
    }
    for (let versuch = 0; versuch < 8 && ist < tickWunsch; versuch++) {
      await evalIn(`window.__frameSink.drive(${tickWunsch - ist})`);
      ist = await evalIn(`window.__domigoPaint.state().tick`);
    }
    if (ist !== tickWunsch) {
      await fail(`--tick ${tickWunsch} nicht getroffen: nach acht Anlaeufen steht die Welt auf Tick ${ist}. `
        + "Der Antrieb rueckt nicht so, wie dieser Lauf annimmt — bevor irgendein Bild geschrieben wird, "
        + "ist das ein Werkzeug-Fehler und keine Reihe.");
    }
    console.log(`  Takt fixiert: die erste Aufnahme steht auf Tick ${ist} (gelesen, nicht gewartet).`);
  }

  // ── 9 · die Reihe ────────────────────────────────────────────────────────
  // Im Kampf-Modus (D-259) kommen zwei Dinge dazu, und beide sind Ehrlichkeit,
  // nicht Bequemlichkeit: zwischen den Aufnahmen wird eine aufgehende Karte
  // weggeräumt (sonst friert sie die Welt ein und die halbe Reihe ist N-mal
  // dasselbe Bild), und JEDES Bild trägt den Vermerk, dass das Werkzeug dabei
  // mitgespielt hat.
  const geloest = [];
  for (let i = 1; i <= shots; i++) {
    if (fight) {
      for (let k = 0; k < 6 && (await karteOffen()); k++) {
        geloest.push(await karte());
        await evalIn(`window.__domigoPaint.solveTask()`);
        await sleep(140);
      }
    }
    const tick = await evalIn(`window.__domigoPaint.state().tick`);
    await shoot(`${stem}_${String(i).padStart(3, "0")}`, {
      serie: stem, nr: i, tickBefore: tick,
      ...(fight ? fightSidecar([...new Set(geloest)]) : {}),
    });
    if (i < shots) await evalIn(`window.__frameSink.drive(${every})`);
  }
  console.log(`  ${shots} Aufnahmen · alle ${every} Ticks`
    + (tickWunsch === null ? "" : ` · erste Aufnahme auf Tick ${tickWunsch} fixiert`)
    + ` · ${path.resolve(outDir)}`);
  if (fight) {
    const karten = [...new Set(geloest)];
    console.log(`  Kampf-Modus: Abtastrate ${every} Ticks (Wisch ${FIGHT_BEATS.WIPE_TICKS} · `
      + `Knoten-Schlag ${FIGHT_BEATS.KNOT_BEAT_TICKS} — D-171)`);
    console.log(karten.length === 0
      ? "  Keine Karte ging auf — die Reihe zeigt den Kampf ohne Zutun des Werkzeugs."
      : `  ⚠ BEIPACKZETTEL: ${BEIPACKZETTEL}. Gelöste Karten: ${karten.join(", ")}`);
  }
  await bail(0);
} catch (err) {
  console.error(`\n✗ ${err.message}`);
  await bail(1);
}
