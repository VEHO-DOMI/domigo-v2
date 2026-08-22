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
 * ── R5-W4 · W2 · DREI ERWEITERUNGEN ─────────────────────────────────────────
 *
 * 1 · AUSSCHNITTE (D-102). Zwei Kritiker-Runden sind daran verbrannt, dass eine
 *     Karten-KANTE auf einem Vollbild rund 6 % der Fläche einnimmt. Ein Kritiker
 *     kann nur beurteilen, was das Bild in beurteilbarer Größe zeigt. `--crop`
 *     liefert deshalb einen formatfüllenden Ausschnitt: das Motiv muss ≥ 40 %
 *     der Ausgabefläche belegen, sonst bricht der Lauf ab (`--selftest` beweist
 *     das rote Licht). Ein Selektor, der nichts trifft, ist ein HARTER Fehler —
 *     nie stillschweigend ein Vollbild statt eines Ausschnitts.
 *
 * 2 · FLÄCHENLISTE MERGEBAR. `SURFACES` ist ein schlichtes id-Array mit EINER
 *     id je Zeile und Schluss-Komma, damit eine andere Lane Flächen anhängen
 *     kann, ohne dass zwei Branches auf dieselbe Zeile schreiben. Die
 *     Ausschnitt-Daten liegen getrennt davon in `CROPS`.
 *
 * 3 · STUMME FEHLER GIBT ES NICHT MEHR. W1 meldete einen Abbruch nach ~15
 *     Flächen und musste in vier Teilmengen fotografieren. Die Ursache war nicht
 *     zu benennen, weil dieses Skript für sie BLIND war: kein `error`- und kein
 *     `close`-Listener auf der Verbindung, keine Behandlung eines abgestürzten
 *     Tabs. Ein Renderer-Absturz sah aus wie ein Hänger. Beides ist jetzt
 *     verdrahtet, samt Zeitlimit je Aufruf, und `--from/--to` ist ein erklärter
 *     Modus mit Selbsttest statt eines Umwegs von Hand.
 *
 * Usage:
 *   node scripts/shoot-card-bench.mjs <outDir> [--port 3007] [--only a,b]
 *                                     [--from N --to M] [--crop <name|selector>]
 *                                     [--card <task-id>]
 *                                     [--cdp-port N]   (Standard: Chrome sucht sich einen freien)
 *
 * ── --card, und warum die Bank es brauchte (R5-W6b · W5 · C5) ───────────────
 * Die Flaechen der Bank suchen ihre Karte per ART (`byKind`) und bekommen damit
 * immer die ERSTE ihrer Art: bei `restore` den Radiergummi. Eine C-Bahn, die
 * ein umgefaerbtes BUCH abnimmt, konnte es also in der Karte, in der das Kind
 * es sieht, nie fotografieren — und genau dort entscheidet sich, ob die Farbe
 * traegt. `--card obj-book.r1` waehlt sie namentlich (volle id oder ihr Ende);
 * eine unbekannte oder mehrdeutige id malt eine sichtbare Fehlzeile statt
 * stillschweigend die erste Karte. Der Dateiname traegt die id mit, damit ein
 * Ausschnitt spaeter nicht der falschen Karte zugeschrieben wird.
 *   node scripts/shoot-card-bench.mjs --selftest      (ohne Dev-Server)
 * The dev server must already be running (the bench is dev-only by law), and its
 * teacher door needs `apps/web/.env.local` with `DEV_TEACHER_ID=<irgendwas>` —
 * ohne die leitet `?karten=` auf /signin um (307) und die Bühne malt nie.
 */
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

/**
 * R5-W4b · W3 · D-207 — DER PORT, DER NICHT MEHR KOLLIDIEREN KANN.
 *
 * Der Fern-Steuer-Port stand hier als feste 9333. Gemeldet war das als
 * »Kollisionsrisiko bei zehn parallelen Sessions«; nachgesehen ist es schlimmer als
 * ein Absturz, weil es KEINER ist:
 *
 *   – Chrome startet mit `stdio: ignore` und hatte keinen `error`/`exit`-Horcher.
 *     Konnte er den Port nicht binden, sagte er das nach /dev/null.
 *   – `endpoint()` fragte nur, ob IRGENDWER auf 9333 antwortet — nicht, ob es der
 *     eigene Browser ist. Ein fremder Chrome antwortet beim ersten Versuch.
 *   – Der Lauf fotografierte dann durch den FREMDEN Browser, mit dessen
 *     `--window-size` und `--force-device-scale-factor`. `clipOf` rechnet aber gegen
 *     WINDOW/DSF unten — die Ausschnitte waeren gegen eine Fenstergeometrie
 *     gerechnet, die der Browser gar nicht hat, und das 40-%-Fuellgesetz gegen den
 *     falschen Nenner. Falsche Bilder, kein Fehler.
 *
 * Beides ist jetzt geloest, und zwar DURCH KONSTRUKTION statt durch Wachsamkeit:
 *
 *   FREIHEIT — der Port wird nicht mehr geraten, sondern vor dem Start beim
 *   Betriebssystem geholt (Lauschen auf 0, Nummer merken, wieder schliessen). Eine
 *   feste Zahl bleibt fuer den Notfall waehlbar (`--cdp-port N`), wie
 *   `shoot-world.mjs` es tut.
 *
 *   IDENTITAET — der Browser wird gefragt, WAS er offen hat. Dieser Lauf legt ein
 *   frisches, leeres Profil an; ein solcher Browser hat genau eine leere Seite. Wer
 *   auf dem Port mit fremden Tabs antwortet, ist nicht meiner, und der Lauf bricht
 *   MIT NAMEN ab, statt durch ihn zu fotografieren.
 *
 * ⚠ Gemessen und verworfen: `--remote-debugging-port=0` + `DevToolsActivePort` aus
 * dem eigenen Profil zu lesen waere der elegantere Weg (`harvest-perf.mjs` macht es
 * so). Mit den Flaggen DIESES Skripts schreibt Chrome die Datei aber nicht — 18 s
 * gewartet, Profil enthaelt `SingletonLock` und keine Portdatei; der Unterschied ist
 * `--disable-gpu`. Ein eleganter Weg, der bei uns nicht funktioniert, ist kein Weg.
 */
const CDP_PORT_DEFAULT = null; // null = beim Betriebssystem einen freien holen

/** Eine Portnummer, die JETZT frei ist — vom Betriebssystem vergeben, nicht geraten. */
const freePort = async () => {
  const net = await import("node:net");
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.on("error", reject);
    srv.listen(0, "127.0.0.1", () => {
      const { port } = srv.address();
      srv.close(() => resolve(port));
    });
  });
};

/**
 * Ist das der Browser, den ich gestartet habe? Ein frisches Profil hat genau die
 * eine leere Seite, mit der es gestartet wurde. Alles andere gehoert jemand anderem.
 */
export const looksLikeMyFreshBrowser = (targets) => {
  const seiten = (targets ?? []).filter((t) => t.type === "page");
  return seiten.every((t) => t.url === "about:blank" || t.url === "");
};

/** Das Fenster, in dem die Bank fotografiert wird (CSS-Pixel), und die
 *  Geräteskalierung — ein Ausschnitt wird auf dieses Format hochgezogen. */
const WINDOW = { w: 1120, h: 760 };
const DSF = 2;

/** every surface the bench declares — kept in step with dev/CardGallery.tsx.
 *  EINE id je Zeile, Schluss-Komma: so hängt eine andere Lane an, ohne mit
 *  dieser Zeile zu kollidieren. */
export const SURFACES = [
  "choice",
  "oddone",
  "restore",
  "wheel",
  "order",
  "mistake",
  "memory",
  "typed",
  "spell",
  "choice-hints",
  "kaefig",
  "goal",
  "auftakt-schatten",
  "auftakt-aufgaben",
  "auftakt-sammeln",
  "auftakt-los",
  "tip",
  "tip-regel",
  "score",
  "out",
  "grant",
  "cagehint",
  "bonuspay",
  "ceremony-merle",
  "ceremony-wisp",
  "console",
  "bonusend-perfect",
  "bonusend-timeout",
];

/**
 * Das Ausschnitt-Vokabular: Name → was gemeint ist.
 *
 * `sel`  CSS-Selektor des Motivs (der erste Treffer zählt).
 * `band` optional: nur ein Streifen entlang einer Kante des Treffers, in CSS-px.
 *        Für „Kante" ist genau das der Punkt — die gemalte Deckle-Kante ist ein
 *        Band, nicht die ganze Karte.
 * `pad`  Kontext ringsum in CSS-px. Ohne Kontext ist ein Ausschnitt nicht
 *        beurteilbar; zu viel Kontext macht ihn wieder zur Briefmarke — deshalb
 *        die 40-%-Regel unten.
 */
export const CROP_TARGETS = {
  kante: { sel: ".pb-card", band: { side: "left", px: 96 }, pad: 40 },
  "kante-unten": { sel: ".pb-card", band: { side: "bottom", px: 96 }, pad: 40 },
  karte: { sel: ".pb-card", pad: 24 },
  chip: { sel: ".pb-chip", pad: 44 },
  schluessel: { sel: ".pb-key", pad: 44 },
  portrait: { sel: ".pb-portrait", pad: 40 },
  siegel: { sel: ".pb-verdict", pad: 48 },
  plakette: { sel: ".pb-plate", pad: 40 },
};

/**
 * Flächenbezogene Abweichungen, NACH id geschlüsselt — bewusst getrennt von
 * `SURFACES`, damit Anhänge an die Flächenliste und Anhänge an die Ausschnitte
 * nie dieselbe Textstelle berühren. Leer heißt: das Vokabular oben gilt.
 * Form: `"<flaeche>": { "<ausschnitt>": { sel?, band?, pad? } }`.
 */
export const CROPS = {};

/** Was für Fläche + Ausschnitt wirklich gilt (Fläche schlägt Vokabular). */
export const cropSpec = (surface, name) => {
  const base = CROP_TARGETS[name];
  const over = CROPS[surface]?.[name];
  if (base === undefined && over === undefined) return null;
  return { ...(base ?? {}), ...(over ?? {}) };
};

// ── Geometrie: rein, prüfbar, ohne Browser ──────────────────────────────────

/** Der Anteil, den ein Ausschnitt mindestens füllen muss. Darunter ist er
 *  wieder das, was er ersetzen sollte: ein Motiv auf einer Briefmarke. */
export const MIN_FILL = 0.40;

/**
 * Aus dem Rechteck des Treffers wird das MOTIV (ggf. nur ein Kantenband) …
 * @param {{x:number,y:number,width:number,height:number}} rect
 */
export const roiOf = (rect, band) => {
  if (!band) return { ...rect };
  const px = Math.min(band.px, band.side === "left" || band.side === "right" ? rect.width : rect.height);
  switch (band.side) {
    case "left": return { x: rect.x, y: rect.y, width: px, height: rect.height };
    case "right": return { x: rect.x + rect.width - px, y: rect.y, width: px, height: rect.height };
    case "top": return { x: rect.x, y: rect.y, width: rect.width, height: px };
    case "bottom": return { x: rect.x, y: rect.y + rect.height - px, width: rect.width, height: px };
    default: throw new Error(`unbekannte Bandseite: ${band.side}`);
  }
};

/**
 * … und daraus der Bildausschnitt samt Vergrößerung.
 * Rückgabe: { clip: {x,y,width,height,scale}, fill } — `fill` ist der Anteil,
 * den das Motiv an der Ausgabefläche hat.
 */
export const clipOf = (roi, pad = 0, win = WINDOW, dsf = DSF) => {
  const x = roi.x - pad;
  const y = roi.y - pad;
  const width = roi.width + 2 * pad;
  const height = roi.height + 2 * pad;
  const scale = Math.min(win.w / width, win.h / height) * dsf;
  return {
    clip: { x, y, width, height, scale },
    fill: (roi.width * roi.height) / (width * height),
  };
};

/** Der Lauf-Plan bei `--from/--to` — als eigene Funktion, damit der Selbsttest
 *  beweisen kann, dass Teilmengen die Liste lückenlos decken. */
export const planOf = (surfaces, { only = null, from = null, to = null } = {}) => {
  let list = only === null ? surfaces : surfaces.filter((s) => only.has(s));
  if (from !== null || to !== null) list = list.slice(from ?? 0, to ?? list.length);
  return list;
};

// ── Selbsttest: ohne Dev-Server, ohne Chrome ────────────────────────────────
const selftest = () => {
  const assert = (ok, msg) => { if (!ok) { console.error(`✗ ${msg}`); process.exitCode = 1; } else console.log(`✓ ${msg}`); };
  const rect = { x: 200, y: 120, width: 480, height: 360 };

  // 1 · das Kantenband ist wirklich ein Band, nicht die ganze Karte
  const band = roiOf(rect, { side: "left", px: 96 });
  assert(band.width === 96 && band.height === 360 && band.x === 200, "Kantenband: 96 px breit, volle Höhe, am linken Rand");
  const unten = roiOf(rect, { side: "bottom", px: 96 });
  assert(unten.height === 96 && unten.y === 120 + 360 - 96, "Kantenband unten sitzt am unteren Rand");

  // 2 · ein formatfüllender Ausschnitt füllt wirklich
  const gut = clipOf(rect, 24);
  assert(gut.fill >= MIN_FILL, `Karte + 24 px Rand füllt ${(gut.fill * 100).toFixed(0)} % (≥ ${MIN_FILL * 100} %)`);
  assert(gut.clip.scale > 1, `und wird vergrößert (Faktor ${gut.clip.scale.toFixed(2)})`);

  // 3 · DAS ROTE LICHT: zu viel Rand ⇒ das Motiv verschwindet ⇒ muss durchfallen.
  //     Der Tamper setzt den Rand per WERT (nicht per Textsuche) und erzwingt
  //     mit einer Zusicherung, dass er wirklich etwas verändert hat — ein
  //     Tamper, der nichts verändert, beweist nichts.
  const schlecht = clipOf(rect, 300);
  if (schlecht.fill >= gut.fill) { console.error("✗ Tamper hat nichts verändert — er beweist nichts"); process.exit(1); }
  assert(schlecht.fill < MIN_FILL, `Karte + 300 px Rand füllt nur ${(schlecht.fill * 100).toFixed(0)} % ⇒ ROT`);

  // 4 · ein schmales Motiv in einem breiten Fenster: die 40-%-Regel greift auch da
  const schmal = clipOf(roiOf(rect, { side: "left", px: 96 }), 40);
  assert(schmal.fill >= MIN_FILL, `Kantenband + 40 px Rand füllt ${(schmal.fill * 100).toFixed(0)} %`);
  const zuViel = clipOf(roiOf(rect, { side: "left", px: 96 }), 90);
  assert(zuViel.fill < MIN_FILL, `Kantenband + 90 px Rand füllt nur ${(zuViel.fill * 100).toFixed(0)} % ⇒ ROT`);

  // 5 · das Vokabular trifft nur erklärte Namen
  assert(cropSpec("choice", "kante") !== null, "»kante« ist ein erklaerter Ausschnitt");
  assert(cropSpec("choice", "gibtsnicht") === null, "ein unbekannter Name ist KEIN Ausschnitt (harter Fehler)");

  // 6 · Teilmengen decken die Flächenliste lückenlos und überschneidungsfrei
  const alle = planOf(SURFACES);
  assert(alle.length === SURFACES.length, `voller Lauf = ${SURFACES.length} Flächen`);
  const teile = [];
  for (let i = 0; i < SURFACES.length; i += 10) teile.push(planOf(SURFACES, { from: i, to: i + 10 }));
  const vereint = teile.flat();
  assert(vereint.join(",") === SURFACES.join(","),
    `Teilmengen à 10 ergeben die Liste wieder (${teile.map((t) => t.length).join("+")} = ${SURFACES.length})`);
  assert(new Set(vereint).size === vereint.length, "und keine Fläche kommt doppelt vor");

  // 7 · D-207: die Adresse des EIGENEN Browsers wird gelesen, nicht geraten.
  //     Der gefährliche Fall ist nicht die kaputte Datei, sondern die HALBE: Chrome
  //     legt `DevToolsActivePort` an und füllt sie erst. Wer die Portnummer schon
  //     akzeptiert, bevor der Pfad da steht, baut sich eine Adresse ohne Ziel — und
  //     genau das sähe aus wie „Chrome antwortet nicht", der Fehler, den D-207
  //     dreimal als Hänger gemeldet bekam.
  assert(looksLikeMyFreshBrowser([{ type: "page", url: "about:blank" }]),
    "ein frisch gestarteter Browser mit einer leeren Seite gilt als meiner");
  assert(looksLikeMyFreshBrowser([]), "ein Browser ohne Seiten gilt als meiner");
  assert(!looksLikeMyFreshBrowser([{ type: "page", url: "http://localhost:3007/play/1/buch?karten=choice" }]),
    "ein Browser mit einer FREMDEN offenen Seite gilt NICHT als meiner (das ist der stille Fall)");
  assert(looksLikeMyFreshBrowser([{ type: "service_worker", url: "http://x/sw.js" }, { type: "page", url: "about:blank" }]),
    "was keine Seite ist, zaehlt nicht gegen die Identitaet");
  assert(CDP_PORT_DEFAULT === null, "ohne Angabe wird der Port beim Betriebssystem geholt, nie geraten");

  if (process.exitCode) console.error("✗ selftest: die Ausschnitt-Rechnung unterscheidet NICHT.");
  else console.log("✓ selftest: formatfüllend wird angenommen, zu klein wird rot, Teilmengen decken die Liste, "
    + "und ein fremder Browser wird als fremd erkannt.");
  process.exit(process.exitCode ?? 0);
};

const args = process.argv.slice(2);
if (args.includes("--selftest")) selftest();

const outDir = args[0];
if (!outDir) {
  console.error("usage: node scripts/shoot-card-bench.mjs <outDir> [--port N] [--only a,b] [--from N --to M] [--crop name] [--cdp-port N]");
  process.exit(1);
}
const num = (name) => (args.indexOf(name) === -1 ? null : Number(args[args.indexOf(name) + 1]));
const port = args.indexOf("--port") === -1 ? 3007 : Number(args[args.indexOf("--port") + 1]);
const only = args.indexOf("--only") === -1 ? null : new Set(args[args.indexOf("--only") + 1].split(","));
const cropName = args.indexOf("--crop") === -1 ? null : args[args.indexOf("--crop") + 1];
// R5-W6b · W5 · C5s Befund: eine Karten-Flaeche zeigt die ERSTE Karte ihrer
// Art — bei `restore` immer den Radiergummi. `--card <id>` sagt, WELCHE.
const cardId = args.indexOf("--card") === -1 ? null : args[args.indexOf("--card") + 1];
// D-207: ohne Angabe holt sich der Lauf VOR dem Start einen freien Port.
const cdpPort = num("--cdp-port") ?? CDP_PORT_DEFAULT ?? await freePort();
const wanted = planOf(SURFACES, { only, from: num("--from"), to: num("--to") });

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
  `--force-device-scale-factor=${DSF}`,
  `--window-size=${WINDOW.w},${WINDOW.h}`,
  `--user-data-dir=${profile}`,
  `--remote-debugging-port=${cdpPort}`,
  "about:blank",
], { stdio: ["ignore", "ignore", "ignore"] });

// D-207: ohne diese zwei Horcher stirbt ein misslungener Start lautlos.
let chromeGone = null;
chrome.on("error", (e) => { chromeGone = `konnte nicht starten: ${e.message}`; });
chrome.on("exit", (code, signal) => {
  if (chromeGone === null) chromeGone = `ist ausgestiegen (Code ${code ?? "—"}, Signal ${signal ?? "—"})`;
});

/**
 * Die Adresse MEINES Browsers — gelesen, nicht geraten.
 *
 * Vorher fragte diese Funktion `http://127.0.0.1:9333/json/version` und nahm die
 * erste Antwort. Wer immer da lauschte, wurde damit zum Messgeraet. Jetzt kommt die
 * Adresse aus `DevToolsActivePort` im frisch angelegten Profilordner: diese Datei
 * kann nur der Prozess geschrieben haben, den dieser Lauf gestartet hat.
 */
async function endpoint() {
  // 160 x 250 ms = 40 s. Vorher waren es 15 s, und das ist auf einer Maschine, die
  // gleichzeitig einen Dev-Server uebersetzt, ZU KNAPP: gemessen in dieser Sitzung
  // hat Chrome den Port geoeffnet (lsof zeigte ihn LISTEN), waehrend das Skript
  // schon mit »nie geoeffnet« gestorben war — und dabei seinen Browser stehen liess,
  // der dann den naechsten Lauf blockierte. Ein zu kurzer Atem erzeugt genau die
  // Port-Leichen, gegen die D-207 gebaut ist.
  for (let i = 0; i < 160; i++) {
    if (chromeGone !== null) {
      throw new Error(`Chrome ${chromeGone}. Bei fest gewaehltem --cdp-port ${cdpPort} ist das `
        + "meist ein belegter Port — ohne die Angabe holt sich der Lauf selbst einen freien (D-207).");
    }
    try {
      const r = await fetch(`http://127.0.0.1:${cdpPort}/json/version`);
      const j = await r.json();
      if (j.webSocketDebuggerUrl) {
        // …und erst JETZT die Identitaetsfrage, vor dem ersten Bild.
        const liste = await (await fetch(`http://127.0.0.1:${cdpPort}/json/list`)).json();
        if (!looksLikeMyFreshBrowser(liste)) {
          const fremd = liste.filter((t) => t.type === "page").map((t) => t.url).slice(0, 3);
          throw new Error(`auf Port ${cdpPort} antwortet ein FREMDER Browser (offene Seiten: `
            + `${fremd.join(", ")}). Durch den zu fotografieren hiesse, gegen dessen Fenstergroesse `
            + "zu rechnen — die Ausschnitte waeren falsch, ohne dass etwas fehlschlaegt (D-207). "
            + "Ohne --cdp-port sucht sich dieser Lauf einen freien Port.");
        }
        console.log(`  Fernsteuerung: Port ${cdpPort} (eigener Browser, Profil ${path.basename(profile)})`);
        return j.webSocketDebuggerUrl;
      }
    } catch (e) {
      if (String(e.message).includes("FREMDER Browser")) throw e;
      /* noch nicht oben */
    }
    await sleep(250);
  }
  chrome.kill(); // keine Port-Leiche hinterlassen, die den naechsten Lauf blockiert
  throw new Error(`Chrome hat in 40 s den Port ${cdpPort} nicht geoeffnet`);
}

/**
 * minimal CDP client: send(method, params) → result.
 *
 * W2: die Verbindung sagt jetzt Bescheid, wenn sie stirbt. Vorher gab es weder
 * `error`- noch `close`-Listener: brach die Verbindung ab, blieb jedes offene
 * Versprechen für immer offen, und der Lauf sah aus wie ein Hänger statt wie
 * ein Fehler. Dazu ein Zeitlimit je Aufruf, damit ein verlorenes Paket den Lauf
 * nicht aufhängt, und ein Abbruchgrund, den man in einen Report schreiben kann.
 */
function client(ws) {
  let id = 0;
  const waiting = new Map();
  let dead = null;
  const kill = (why) => {
    dead = why;
    for (const { reject } of waiting.values()) reject(new Error(`CDP-Verbindung tot: ${why}`));
    waiting.clear();
  };
  ws.addEventListener("message", (e) => {
    const m = JSON.parse(e.data);
    if (m.method === "Inspector.targetCrashed" || m.method === "Target.targetCrashed") {
      kill(`der Tab ist abgestürzt (${m.method}) — typischerweise Renderer-Speicher`);
      return;
    }
    if (m.id !== undefined && waiting.has(m.id)) {
      const { resolve, reject } = waiting.get(m.id);
      waiting.delete(m.id);
      m.error ? reject(new Error(m.error.message)) : resolve(m.result);
    }
  });
  ws.addEventListener("error", () => kill("Websocket-Fehler"));
  ws.addEventListener("close", (e) => kill(`Websocket geschlossen (Code ${e.code}${e.reason ? `, ${e.reason}` : ""})`));
  return (method, params = {}, sessionId, timeoutMs = 60_000) =>
    new Promise((resolve, reject) => {
      if (dead) { reject(new Error(`CDP-Verbindung tot: ${dead}`)); return; }
      id += 1;
      const mine = id;
      const timer = setTimeout(() => {
        waiting.delete(mine);
        reject(new Error(`${method} hat nach ${timeoutMs} ms nicht geantwortet`));
      }, timeoutMs);
      waiting.set(mine, {
        resolve: (v) => { clearTimeout(timer); resolve(v); },
        reject: (e) => { clearTimeout(timer); reject(e); },
      });
      ws.send(JSON.stringify({ id: mine, method, params, sessionId }));
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

/** Das Rechteck des Motivs auf der Seite — oder ein harter Fehler.
 *  Ein Selektor, der nichts trifft, darf NIE stillschweigend zum Vollbild
 *  werden: genau so entstünde wieder das Bild, das der Kritiker nicht
 *  beurteilen kann, diesmal ohne dass es jemand merkt. */
async function rectOf(id, sel) {
  const { result } = await page("Runtime.evaluate", {
    expression: `(() => { const e = document.querySelector(${JSON.stringify(sel)});
      if (!e) return null;
      const r = e.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height }; })()`,
    returnByValue: true,
  });
  if (result.value === null || result.value === undefined) {
    throw new Error(`${id}: der Selektor »${sel}« trifft auf dieser Flaeche nichts — kein Ausschnitt möglich`);
  }
  const r = result.value;
  if (r.width < 1 || r.height < 1) throw new Error(`${id}: »${sel}« ist ${r.width}×${r.height} gross — nichts zu fotografieren`);
  return r;
}

/** navigate and wait until the bench has actually PAINTED the stage — not until
 *  the network is quiet: the bench is a lazy chunk behind a dev compile, and a
 *  fallback („Bench lädt …") photographed as the card is the one failure this
 *  whole instrument exists to prevent. */
async function shoot(id) {
  const suffix = (cardId === null ? "" : `__${cardId.replace(/[^A-Za-z0-9._-]/g, "-")}`)
    + (cropName === null ? "" : `__${cropName}`);
  const out = path.join(outDir, `${id}${suffix}.png`);
  const adresse = `http://localhost:${port}/play/1/buch?karten=${id}`
    + (cardId === null ? "" : `&karte=${encodeURIComponent(cardId)}`);
  await page("Page.navigate", { url: adresse });
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
  // R5-W6b · W5: gemalt heisst nicht, dass die BESTELLTE Karte gemalt wurde.
  // Ohne diese Frage haette ein Tippfehler in `--card` 27 Fehlzeilen
  // fotografiert und Exit 0 gemeldet — genau die stille Sorte Fehler, die
  // dieses Skript laut seinem eigenen Kopf nicht mehr macht.
  if (cardId !== null) {
    const { result } = await page("Runtime.evaluate", {
      expression: `(document.querySelector('[data-testid="gallery-stage"]')?.dataset.karte ?? "")`,
      returnByValue: true,
    });
    const gezeigt = String(result.value ?? "");
    if (gezeigt === "" || !(gezeigt === cardId || gezeigt.endsWith(`.${cardId}`))) {
      throw new Error(`${id}: --card »${cardId}« wurde NICHT gezeigt (die Buehne zeigt `
        + `${gezeigt === "" ? "keine namentlich gewaehlte Karte" : `»${gezeigt}«`}). `
        + "Unbekannte, mehrdeutige oder artfremde id — nichts fotografiert, damit kein Ausschnitt "
        + "spaeter der falschen Karte zugeschrieben wird.");
    }
  }
  // one more beat so the card's own entrance animation has finished (420 ms
  // after a 260 ms delay) — a card photographed mid-spring is not the card
  await sleep(1100);

  let params = { format: "png" };
  let note = "";
  if (cropName !== null) {
    const spec = cropName.startsWith(".") || cropName.startsWith("#") || cropName.startsWith("[")
      ? { sel: cropName, pad: 40 }
      : cropSpec(id, cropName);
    if (spec === null) {
      throw new Error(`unbekannter Ausschnitt »${cropName}« — erklaert sind: ${Object.keys(CROP_TARGETS).join(", ")}`);
    }
    const { clip, fill } = clipOf(roiOf(await rectOf(id, spec.sel), spec.band), spec.pad ?? 0);
    if (fill < MIN_FILL) {
      throw new Error(`${id}: der Ausschnitt »${cropName}« fuellt nur ${(fill * 100).toFixed(0)} % des Bildes `
        + `(gefordert ≥ ${MIN_FILL * 100} %) — so ist die Stelle nicht beurteilbar`);
    }
    params = { format: "png", clip, captureBeyondViewport: true };
    note = `  Ausschnitt »${cropName}«: ${Math.round(clip.width)}×${Math.round(clip.height)} px `
      + `× ${clip.scale.toFixed(2)}, Motiv füllt ${(fill * 100).toFixed(0)} %`;
  }
  const { data } = await page("Page.captureScreenshot", params);
  writeFileSync(out, Buffer.from(data, "base64"));
  console.log(`  ✓ ${id}${note}`);
}

try {
  for (const id of wanted) await shoot(id);
  const wie = cropName === null ? "Vollbild" : `Ausschnitt »${cropName}«`;
  console.log(`shoot-card-bench: ${wanted.length} surface(s), ${wie} → ${outDir}`);
} catch (err) {
  // Ein Abbruch nennt ab jetzt seinen Grund UND wie weit der Lauf kam — W1
  // hatte beides nicht und musste raten.
  console.error(`\n✗ shoot-card-bench abgebrochen: ${err.message}`);
  console.error(`  geplant waren ${wanted.length} Flächen: ${wanted.join(", ")}`);
  console.error(`  Weitermachen ab der abgebrochenen Stelle: --from <n> --to <m> (erklärter Modus, vom Selbsttest gedeckt).`);
  process.exitCode = 1;
} finally {
  ws.close();
  chrome.kill();
}
