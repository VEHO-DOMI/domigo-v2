#!/usr/bin/env node
// K5a · DER SPRECHER — echte Stimmen für das Hörverstehen.
//
// Der Abspieler (`packages/task-ui/src/index.tsx#AudioClip`) nimmt ZUERST eine
// fertige Tondatei und fällt nur mangels Datei auf die Browser-Roboterstimme
// zurück. Bis heute lag keine einzige Datei da. Dieses Skript erzeugt sie.
//
// Zwilling von `docs/audio/gen-elevenlabs.mjs` (Spiel-Klänge): derselbe
// Schlüsselpfad, dieselbe Kostenmessung, dieselbe Backoff-Schleife — aber gegen
// `POST /v1/text-to-speech/{voice_id}` statt der Effekt-API.
//
// ── Der Text wird NICHT abgeschrieben ────────────────────────────────────────
// Der Sprechtext kommt zur Laufzeit aus `content/corpus/units/<unit>/
// listening.json` (`tasks[].audio.script`). Es gibt keine zweite Abschrift,
// also kann sie auch nicht driften — die Klasse von Fehlern, die der Bestand
// schon einmal bezahlt hat (wertbasiertes Ersetzen über Prosa).
//
// ── Der Schlüssel ────────────────────────────────────────────────────────────
// Er steht AUSSCHLIESSLICH in ~/.config/domigo/elevenlabs.env (R125). Er wird
// nie als Argument übergeben, nie ausgegeben, nie ins Protokoll geschrieben.
// `scripts/check-secrets.mjs` hält die andere Hälfte des Versprechens.
//
// ── Warum überhaupt nachbearbeitet wird ──────────────────────────────────────
// Ein A/B-Vergleich, bei dem die Kandidaten verschieden laut sind, vergleicht
// Lautheit und nicht Stimmen — das lauteste gewinnt fast immer. Also läuft
// jeder Take durch dieselbe kurze Kette: mono 44,1 kHz · Stille vorn/hinten
// auf ≤150 ms gekappt · Lautheit in zwei Durchgängen auf −16 LUFS (True Peak
// −1,5 dBFS) · mp3 mono 96 kbit/s. Gemessen wird danach mit `measure.mjs` —
// demselben Messgerät, das auch das Spiel-Klangtor benutzt.
//
// ── Der Dateiname trägt seinen Fingerabdruck ─────────────────────────────────
// `apps/web/public/audio/listening/<unit>/<taskKey>--<stimme>--<sha8>.mp3`.
// Produktion liefert `/audio/*` mit `immutable, max-age=1 Jahr` aus
// (apps/web/next.config.ts). Ohne Fingerabdruck im Namen bliebe eine neu
// aufgenommene Datei bei jedem Kind ein Jahr lang die alte.
//
// ── Die ATEMPAUSEN (K4c, P-R13 Punkt 2+3) ───────────────────────────────────
// An vier echten Verlags-Hoeruebungen (MORE! 2 Extra LC practice) gemessen:
// die Sprecher sind NICHT langsam (187 Woerter/Minute Artikulation, schneller
// als unsere 152) — aber **35 % der Spielzeit ist Stille**. Eine Pause etwa
// alle fuenf Woerter, fast alle im Band 250–1200 ms. Genau das ist die "Zeit
// zum Verdauen", die Kokis Ohr vermisst hat.
// Nachgebaut wird sie mit `<break time="…"/>`-Marken, die `speakify()` aus der
// INTERPUNKTION ableitet — nicht von Hand gesetzt. Der Bestand traegt also
// weiter genau EINEN sauberen Text (V-LC7: `audio.script` === `transcript`),
// und `stripBreaks(speakify(t))` muss wortgleich `t` ergeben, sonst bricht der
// Lauf ab. Eine zweite, handgepflegte "Sprech-Fassung" waere genau die Drift,
// gegen die V-LC7 existiert.
//
// ── Ein Stueck mit ZWEI Rollen (K4b) → jetzt mit CAST (K4c) ─────────────────
// Ein Auftragszettel-Stueck darf `voicesByTurn` tragen: je ZEILE des Skripts
// eine Stimme. Das Skript bleibt die einzige Textquelle — der Zettel nennt nur
// Stimmen, nie Text. Stimmen die Zahlen nicht ueberein (Zeilen vs. Angaben),
// bricht der Lauf HART ab; ein stiller Versatz waere die schlimmste Variante.
// K4c: statt roher Stimm-Slugs darf ein Stueck `castByTurn` tragen — FIGUREN
// (leonie, david, …), aufgeloest ueber `docs/audio/cast.json`. Damit spricht
// dieselbe Figur im ganzen Bau dieselbe Stimme (P-R13 Punkt 8), und eine Figur,
// die der Cast nicht kennt, bricht den Lauf ab statt still ersetzt zu werden.
// Die Teil-Takes werden mit einer kurzen Pause zusammengefuegt und danach EIN
// Mal durch dieselbe Master-Kette geschickt — eine zweite Kette waere genau die
// Drift, gegen die das Klang-Tor existiert.
//
// Aufruf:
//   node docs/audio/gen-listening-voice.mjs --list-voices
//   node docs/audio/gen-listening-voice.mjs --plan
//   node docs/audio/gen-listening-voice.mjs --all
//   node docs/audio/gen-listening-voice.mjs --only alice
//   node docs/audio/gen-listening-voice.mjs --unit g2-u04,g2-u07   (nur diese Einheiten)
//   node docs/audio/gen-listening-voice.mjs --measure     (nichts erzeugen, nur neu messen)

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { SR, decodeMono, loudnormMeasure, measureFile, rms } from "./measure.mjs";

const ROOT = process.cwd();
const ORDER = path.join(ROOT, "docs/audio/listening-voices.json");
const CAST = path.join(ROOT, "docs/audio/cast.json");
const MEASURED = path.join(ROOT, "docs/audio/listening-measured.json");
const UNITS = path.join(ROOT, "content/corpus/units");
const PUBLIC = path.join(ROOT, "apps/web/public/audio/listening");
const KEYFILE = path.join(os.homedir(), ".config/domigo/elevenlabs.env");
const RAW = process.env.DOMIGO_TAKES_DIR || path.join(os.tmpdir(), "domigo-listening-takes");

const API = "https://api.elevenlabs.io/v1";
const OUTPUT_FORMAT = "mp3_44100_128"; // Rohformat; gemastert wird danach auf mono 96k
const TARGET_I = -16;                  // LUFS — Sprache im selben Fenster wie die Spiel-Bank
const TARGET_TP = -1.5;                // dBFS True-Peak-Decke
const MAX_EDGE_SILENCE_MS = 150;
// Pausen-Vorgaben. Alle drei an den vier Verlags-Hoeruebungen geeicht (K4c):
// Median der Pause zwischen zwei Sprecher-Zuegen 600–720 ms, Gros aller Pausen
// im Band 250–1200 ms, keine ueber 2 s ausser an Aufgaben-Grenzen.
// ⚠ Die Sprachmaschine legt auf eine angeforderte Marke noch etwas drauf
// (gemessen: 0,35 s → 0,66 s · 0,70 s → 0,94 s) — die Werte hier sind darum
// BESTELLWERTE, nicht Zielwerte. Gemessen wird am fertigen Ton.
const TURN_GAP_MS = 500;               // Stille zwischen zwei Sprech-Rollen (Stitching)
const CLAUSE_GAP_MS = 300;             // nach , ; :  — die Atempause im Satz
const SENTENCE_GAP_MS = 550;           // nach . ! ?  — die Zaesur zwischen Saetzen
const PARA_GAP_MS = 700;               // an einem Zeilenumbruch innerhalb eines Stuecks

// ── Argumente ────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const flag = (n) => argv.includes(`--${n}`);
const value = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 && argv[i + 1] !== undefined ? argv[i + 1] : d; };
const LIST_VOICES = flag("list-voices");
const PLAN_ONLY = flag("plan");
const MEASURE_ONLY = flag("measure");
const ALL = flag("all");
const ONLY = value("only", "").split(",").map((s) => s.trim()).filter(Boolean);
// K4b: eine Einheit gezielt neu einsprechen, ohne die anderen anzufassen —
// eine geaenderte Zeile im Skript soll nicht sechs fremde Aufnahmen ersetzen.
const UNIT = value("unit", "").split(",").map((s) => s.trim()).filter(Boolean);

// ── Der Schlüssel ────────────────────────────────────────────────────────────
export const readKey = () => {
  let raw;
  try { raw = fs.readFileSync(KEYFILE, "utf8"); }
  catch { console.error(`✗ ${KEYFILE} ist nicht lesbar. Der Schluessel steht NUR dort (R125).`); process.exit(2); }
  for (const line of raw.split(/\r\n|\r|\n/)) {
    const m = /^\s*(?:export\s+)?ELEVENLABS_API_KEY\s*=\s*(.*)$/.exec(line);
    if (m) return m[1].trim().replace(/^["']|["']$/g, "");
  }
  console.error(`✗ ${KEYFILE} enthaelt keine Zeile ELEVENLABS_API_KEY=…`);
  process.exit(2);
};

// ── HTTP ─────────────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** POST mit Backoff auf 429/5xx. Gibt {buf, credits, ms} zurueck. */
const post = async (key, url, body, label) => {
  let wait = 2000;
  for (let attempt = 1; attempt <= 6; attempt++) {
    const t0 = Date.now();
    let res;
    try {
      res = await fetch(url, { method: "POST", headers: { "xi-api-key": key, "content-type": "application/json" }, body: JSON.stringify(body) });
    } catch (e) {
      if (attempt === 6) throw new Error(`${label}: Netzwerkfehler nach 6 Versuchen — ${e.message}`);
      await sleep(wait); wait *= 2; continue;
    }
    if (res.status === 429 || res.status >= 500) {
      const text = await res.text().catch(() => "");
      if (attempt === 6) throw new Error(`${label}: HTTP ${res.status} nach 6 Versuchen — ${text.slice(0, 300)}`);
      console.warn(`  … ${label}: HTTP ${res.status}, warte ${wait} ms (Versuch ${attempt}/6)`);
      await sleep(wait); wait *= 2; continue;
    }
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`${label}: HTTP ${res.status} — ${text.slice(0, 500)}`);
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const credits = Number(res.headers.get("character-cost") ?? res.headers.get("x-character-cost") ?? 0);
    return { buf, credits, ms: Date.now() - t0 };
  }
  throw new Error(`${label}: unerreichbar`);
};

const getJson = async (key, url) => {
  const res = await fetch(url, { headers: { "xi-api-key": key } });
  if (!res.ok) return null;
  return res.json();
};

const subscription = async (key) => {
  const d = await getJson(key, `${API}/user/subscription`);
  return d ? { tier: d.tier, status: d.status, used: d.character_count, limit: d.character_limit } : null;
};

// ── Die Atempausen: aus der INTERPUNKTION abgeleitet, nie von Hand ───────────
/** Alle `<break …/>`-Marken wieder entfernen. Gegenstueck zu `speakify`. */
export const stripBreaks = (t) => t.replace(/<break\s+time="[^"]*"\s*\/>/g, " ");

const words = (t) => t.replace(/\s+/g, " ").trim();

/**
 * Setzt Pausen-Marken hinter die Satzzeichen. Der EINE saubere Text aus dem
 * Bestand bleibt die Quelle — hier entsteht nur seine Sprech-Fassung.
 * Die Umkehrprobe laeuft bei JEDEM Aufruf: entfernt man die Marken wieder,
 * muss wortgleich der Eingabetext dastehen. Sonst bricht der Lauf ab —
 * eine Sprech-Fassung, die vom Bestand abweicht, waere genau die Drift,
 * gegen die V-LC7 gebaut wurde.
 */
export const speakify = (text, { clauseMs = CLAUSE_GAP_MS, sentenceMs = SENTENCE_GAP_MS, paraMs = PARA_GAP_MS } = {}) => {
  // Der Eingabetext wird HIER festgehalten. Die Umkehrprobe unten vergleicht
  // gegen DIESE Kopie und nicht gegen `text` — sonst koennte eine Zuweisung an
  // `text` die Probe gegen sich selbst laufen lassen und alles waere immer
  // gruen (beim Tamper-Versuch dieser Bahn genau so passiert).
  const source = text;
  const mark = (ms) => (ms > 0 ? ` <break time="${(ms / 1000).toFixed(2)}s" />` : "");
  const out = source
    // Zeilenumbruch = Absatz-Zaesur (bei mehrstimmigen Stuecken kommt hier
    // ohnehin der Schnitt, dann sieht speakify die Zeile schon einzeln).
    .replace(/\n+/g, (m) => `${mark(paraMs)}\n`)
    // Satzende — auch mit schliessendem Anfuehrungszeichen dahinter.
    .replace(/([.!?]["\u201d]?)(\s+)(?=\S)/g, (m, punct, ws) => `${punct}${mark(sentenceMs)}${ws}`)
    // Teilsatz.
    .replace(/([,;:])(\s+)(?=\S)/g, (m, punct, ws) => `${punct}${mark(clauseMs)}${ws}`)
    // Zwei Marken direkt hintereinander (Satzende UND Absatzende) waeren eine
    // doppelte Pause — es gilt die laengere.
    .replace(/(?:<break\s+time="([\d.]+)s"\s*\/>\s*){2,}/g, (m) => {
      const all = [...m.matchAll(/time="([\d.]+)s"/g)].map((x) => Number(x[1]));
      return `<break time="${Math.max(...all).toFixed(2)}s" /> `;
    });
  if (words(stripBreaks(out)) !== words(source)) {
    throw new Error("speakify: die Umkehrprobe schlaegt fehl — die Sprech-Fassung ist nicht mehr wortgleich mit dem Bestand");
  }
  return out;
};

// ── Der Bestand ist die Quelle des Textes ────────────────────────────────────
/** Liest `tasks[].audio.script` aus der Einheit — die EINZIGE Textquelle. */
const scriptOf = (unit, taskKey) => {
  const file = path.join(UNITS, unit, "listening.json");
  if (!fs.existsSync(file)) throw new Error(`${unit}: ${file} fehlt`);
  const j = JSON.parse(fs.readFileSync(file, "utf8"));
  const task = (j.tasks ?? []).find((t) => t.key === taskKey);
  if (!task) throw new Error(`${unit}: keine Aufgabe mit key "${taskKey}" (vorhanden: ${(j.tasks ?? []).map((t) => t.key).join(", ")})`);
  const script = task.audio?.script;
  if (!script) throw new Error(`${unit}/${taskKey}: audio.script ist leer`);
  return script;
};

// ── Nachbearbeitung ──────────────────────────────────────────────────────────
const ff = (args) => execFileSync("ffmpeg", ["-hide_banner", "-v", "error", "-y", ...args], { maxBuffer: 256 * 1024 * 1024 });

/** Stille am Anfang in ms (Schwelle −50 dBFS auf 1-ms-Fenstern) — Gegenstueck zu tailSilenceMs. */
const headSilenceMs = (s) => {
  const win = Math.floor(SR / 1000);
  const thr = 10 ** (-50 / 20);
  let i = 0;
  while (i + win <= s.length && rms(s, i, i + win) < thr) i += win;
  return Math.round((i / SR) * 1000);
};

/**
 * take.mp3 → gemasterte mp3. Zwei loudnorm-Durchgaenge: der erste MISST, der
 * zweite normalisiert mit den gemessenen Werten. Ein einzelner Durchgang waere
 * eine Schaetzung ueber ein gleitendes Fenster und traefe das Ziel nicht.
 */
export const master = (src, dst) => {
  const trimmed = `${dst}.trim.wav`;
  ff(["-i", src, "-af",
    `highpass=f=70,silenceremove=start_periods=1:start_silence=${MAX_EDGE_SILENCE_MS / 1000}:start_threshold=-50dB:detection=peak,areverse,` +
    `silenceremove=start_periods=1:start_silence=${MAX_EDGE_SILENCE_MS / 1000}:start_threshold=-50dB:detection=peak,areverse`,
    "-ac", "1", "-ar", String(SR), trimmed]);

  // Erster Durchgang: MESSEN. `loudnormMeasure` steht in measure.mjs — dasselbe
  // Messgeraet, das auch das Spiel-Klangtor benutzt (zwei Implementierungen
  // waeren genau die Drift, gegen die ein Tor existiert).
  const m = loudnormMeasure(trimmed, TARGET_I, TARGET_TP);

  ff(["-i", trimmed, "-af",
    `loudnorm=I=${TARGET_I}:TP=${TARGET_TP}:LRA=11:measured_I=${m.input_i}:measured_TP=${m.input_tp}:` +
    `measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`,
    "-ac", "1", "-ar", String(SR), "-c:a", "libmp3lame", "-b:a", "96k", dst]);
  fs.rmSync(trimmed, { force: true });
};

/**
 * Mehrere Teil-Takes zu EINER Datei fuegen, mit TURN_GAP_MS Pause dazwischen.
 * Ueber wav und den concat-Demuxer, damit nichts zweimal durch mp3 laeuft.
 */
export const concatTurns = (parts, dst, gapMs = TURN_GAP_MS) => {
  // ABSOLUT, nicht relativ (K4c, einmal bezahlt): der concat-Demuxer von ffmpeg
  // loest die Pfade IN der Liste relativ zum Verzeichnis DER LISTE auf. Mit
  // relativen Pfaden verdoppelt sich der Pfad ("a/b/a/b/.turn-0.wav") und der
  // Lauf stirbt mit "Impossible to open". Hier lief es nur deshalb nie auf,
  // weil die Rohtakes im absoluten os.tmpdir() liegen.
  const dir = path.resolve(path.dirname(dst));
  const wavs = parts.map((src0, i) => {
    const src = path.resolve(src0);
    const w = path.join(dir, `.turn-${i}.wav`);
    ff(["-i", src, "-ac", "1", "-ar", String(SR), w]);
    return w;
  });
  const gap = path.join(dir, ".gap.wav");
  ff(["-f", "lavfi", "-i", `anullsrc=r=${SR}:cl=mono`, "-t", String(gapMs / 1000), gap]);
  const list = path.join(dir, ".concat.txt");
  const lines = [];
  wavs.forEach((w, i) => {
    if (i > 0) lines.push(`file '${gap}'`);
    lines.push(`file '${w}'`);
  });
  fs.writeFileSync(list, `${lines.join("\n")}\n`);
  ff(["-f", "concat", "-safe", "0", "-i", list, "-ac", "1", "-ar", String(SR), dst]);
  for (const f of [...wavs, gap, list]) fs.rmSync(f, { force: true });
};

export const sha8 = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex").slice(0, 8);

// ── Lauf ─────────────────────────────────────────────────────────────────────
const main = async () => {
  if (LIST_VOICES) {
    const key = readKey();
    const d = await getJson(key, `${API}/voices`);
    if (!d) { console.error("✗ /v1/voices nicht erreichbar"); process.exit(1); }
    for (const v of d.voices ?? []) {
      const lab = Object.entries(v.labels ?? {}).map(([k, x]) => `${k}=${x}`).join(" · ");
      console.log(`${v.voice_id}  ${String(v.name).padEnd(22)}  ${v.category ?? ""}  ${lab}`);
    }
    console.log(`\n${(d.voices ?? []).length} Stimme(n) im Konto.`);
    return;
  }

  if (!fs.existsSync(ORDER)) { console.error(`✗ ${ORDER} fehlt — erst der Auftragszettel, dann erzeugen.`); process.exit(2); }
  const order = JSON.parse(fs.readFileSync(ORDER, "utf8"));

  const voiceBySlug = new Map(order.voices.map((v) => [v.slug, v]));
  const needVoice = (slug, where) => {
    const v = voiceBySlug.get(slug);
    if (!v) throw new Error(`${where}: der Auftragszettel kennt keine Stimme "${slug}"`);
    return v;
  };

  // ── DER CAST (K4c, P-R13 Punkt 8) ────────────────────────────────────────
  // Wiederkehrende FIGUREN mit fest gepinnter Stimme. Der Cast ist optional —
  // Stuecke aus Staffel 1 nennen weiter rohe Stimm-Slugs und laufen unveraendert.
  const cast = fs.existsSync(CAST) ? JSON.parse(fs.readFileSync(CAST, "utf8")) : { figures: [] };
  const figureByKey = new Map((cast.figures ?? []).map((f) => [f.key, f]));
  /** Eine Figur → ihre Stimme. Unbekannte Figur = HARTER Abbruch: eine still
   *  eingesetzte Ersatzstimme waere die schlimmste Variante (K4b-Gesetz). */
  const needFigure = (key, where) => {
    const f = figureByKey.get(key);
    if (!f) {
      throw new Error(`${where}: der Cast kennt keine Figur "${key}" (vorhanden: ${[...figureByKey.keys()].join(", ") || "keine"}) — docs/audio/cast.json`);
    }
    return f;
  };

  const jobs = [];
  for (const piece of order.pieces) {
    if (UNIT.length > 0 && !UNIT.includes(piece.unit)) continue;
    const script = scriptOf(piece.unit, piece.taskKey);
    const where = `${piece.unit}/${piece.taskKey}`;

    // (a) MEHRERE ROLLEN: je Zeile des Skripts eine Stimme.
    //     `castByTurn` nennt FIGUREN (K4c), `voicesByTurn` rohe Stimm-Slugs
    //     (Staffel 1, unveraendert lauffaehig). Beides zugleich waere zweideutig.
    if (Array.isArray(piece.castByTurn) && Array.isArray(piece.voicesByTurn)) {
      throw new Error(`${where}: castByTurn UND voicesByTurn gesetzt — genau eines von beiden`);
    }
    const byTurn = piece.castByTurn ?? piece.voicesByTurn;
    if (Array.isArray(byTurn)) {
      const fromCast = Array.isArray(piece.castByTurn);
      const turns = script.split(/\r\n|\r|\n/).map((t) => t.trim()).filter(Boolean);
      if (turns.length !== byTurn.length) {
        throw new Error(`${where}: ${turns.length} Sprech-Zeile(n) im Bestand, aber ${byTurn.length} ${fromCast ? "Figuren" : "Stimm"}-Angabe(n) im Auftragszettel — der Zettel schreibt den Text nicht ab, also muss die ZAHL stimmen`);
      }
      const segments = turns.map((text, i) => {
        if (!fromCast) return { text, figure: null, voice: needVoice(byTurn[i], where) };
        const fig = needFigure(byTurn[i], where);
        return { text, figure: fig, voice: { slug: fig.key, name: fig.voiceName, voiceId: fig.voiceId, speed: fig.speed } };
      });
      const slug = piece.voiceSlug ?? [...new Set(byTurn)].join("-");
      if (ONLY.length > 0 && !byTurn.some((v) => ONLY.includes(v))) continue;
      jobs.push({ piece, voice: { slug, name: segments.map((g) => g.voice.name).filter((n, i, a) => a.indexOf(n) === i).join(" + "), voiceId: null }, script, segments });
      continue;
    }

    // (a2) EINE Figur aus dem Cast — der Normalfall fuer Erzaehl-Stuecke ab K4c.
    if (piece.cast) {
      const fig = needFigure(piece.cast, where);
      const v = { slug: fig.key, name: fig.voiceName, voiceId: fig.voiceId, speed: fig.speed };
      if (ONLY.length === 0 || ONLY.includes(fig.key)) jobs.push({ piece, voice: v, script });
      continue;
    }

    // (b) EINE Stimme, wenn das Stueck eine nennt — sonst alle (Rauchtest-Weg).
    const wanted = piece.voice ? [needVoice(piece.voice, where)] : order.voices;
    for (const v of wanted) {
      if (ONLY.length > 0 && !ONLY.includes(v.slug)) continue;
      jobs.push({ piece, voice: v, script });
    }
  }
  if (jobs.length === 0) { console.error("Nichts zu tun — --all oder --only <stimme>."); process.exit(2); }

  const chars = jobs.reduce((a, j) => a + j.script.length, 0);
  console.log(`Plan: ${jobs.length} Aufnahme(n), ${chars} Zeichen gesamt (${jobs.map((j) => `${j.piece.unit}/${j.piece.taskKey}·${j.voice.slug}`).join(", ")})`);
  if (PLAN_ONLY) return;

  const measured = fs.existsSync(MEASURED) ? JSON.parse(fs.readFileSync(MEASURED, "utf8")) : { schema: "listening-measured@1", files: {} };

  if (MEASURE_ONLY) {
    // K4c: auch der Nur-Messen-Weg raeumt verwaiste Eintraege ab. Vorher tat das
    // nur der Erzeugungsweg — eine geloeschte Datei blieb im Messblatt stehen
    // und das naechste Werkzeug stolperte darueber.
    for (const rel of Object.keys(measured.files)) {
      if (!fs.existsSync(path.join(ROOT, "apps/web/public", rel.replace(/^\//, "")))) {
        delete measured.files[rel];
        console.log(`− ${rel} — Datei gibt es nicht mehr, Eintrag entfernt.`);
      }
    }
    for (const [rel, rec] of Object.entries(measured.files)) {
      const abs = path.join(ROOT, "apps/web/public", rel.replace(/^\//, ""));
      const s = decodeMono(abs);
      measured.files[rel] = { ...rec, ...measureFile(abs, "speech"), headSilenceMs: headSilenceMs(s) };
    }
    fs.writeFileSync(MEASURED, `${JSON.stringify(measured, null, 2)}\n`);
    console.log(`↻ ${Object.keys(measured.files).length} Datei(en) neu gemessen.`);
    return;
  }

  if (!ALL && ONLY.length === 0) { console.error("Nichts zu tun — --all oder --only <stimme>."); process.exit(2); }

  const key = readKey();
  const before = await subscription(key);
  if (before) console.log(`Konto vor dem Lauf: ${before.tier}/${before.status} — ${before.used}/${before.limit} Zeichen verbraucht.`);

  fs.mkdirSync(RAW, { recursive: true });
  let credits = 0;

  /**
   * Der Auftrag an die Sprachmaschine.
   * TEMPO-Vorrang (K4c, P-R13 Punkt 2): Figur/Stimme → Stueck → Auftragszettel.
   *   Die Figur gewinnt, weil das Tempo eine Eigenschaft der SPRECHENDEN ist
   *   (ein Kind haspelt, eine Lehrerin nicht); das Stueck darf sie ueberstimmen,
   *   wenn ein einzelner Text ruhiger laufen soll.
   * PAUSEN: `speakify` leitet sie aus der Interpunktion ab, mit Umkehrprobe.
   */
  const bodyFor = (v, text, piece) => ({
    text: speakify(text, {
      clauseMs: piece?.clauseGapMs ?? order.clauseGapMs ?? CLAUSE_GAP_MS,
      sentenceMs: piece?.sentenceGapMs ?? order.sentenceGapMs ?? SENTENCE_GAP_MS,
      paraMs: piece?.paraGapMs ?? order.paraGapMs ?? PARA_GAP_MS,
    }),
    model_id: v.modelId ?? order.modelId ?? "eleven_multilingual_v2",
    voice_settings: {
      stability: v.stability ?? order.stability ?? 0.5,
      similarity_boost: v.similarityBoost ?? order.similarityBoost ?? 0.75,
      style: v.style ?? order.style ?? 0,
      use_speaker_boost: true,
      ...(v.speed ?? piece?.speed ?? order.speed ? { speed: v.speed ?? piece?.speed ?? order.speed } : {}),
    },
  });

  for (const { piece, voice, script, segments } of jobs) {
    const label = `${piece.unit}/${piece.taskKey}·${voice.slug}`;
    const take = path.join(RAW, `${piece.unit}--${piece.taskKey}--${voice.slug}.mp3`);
    const body = bodyFor(segments ? segments[0].voice : voice, script, piece);
    let c = 0;
    let ms = 0;

    if (segments) {
      const parts = [];
      for (const [i, seg] of segments.entries()) {
        const r = await post(key, `${API}/text-to-speech/${seg.voice.voiceId}?output_format=${OUTPUT_FORMAT}`, bodyFor(seg.voice, seg.text, piece), `${label}#${i + 1}`);
        c += r.credits; ms += r.ms;
        const f = path.join(RAW, `${piece.unit}--${piece.taskKey}--turn-${String(i).padStart(2, "0")}.mp3`);
        fs.writeFileSync(f, r.buf);
        parts.push(f);
      }
      concatTurns(parts, take, piece.turnGapMs ?? order.turnGapMs ?? TURN_GAP_MS);
    } else {
      const r = await post(key, `${API}/text-to-speech/${voice.voiceId}?output_format=${OUTPUT_FORMAT}`, body, label);
      c = r.credits; ms = r.ms;
      fs.writeFileSync(take, r.buf);
    }
    credits += c;

    const dir = path.join(PUBLIC, piece.unit);
    fs.mkdirSync(dir, { recursive: true });
    const tmp = path.join(dir, `.${piece.taskKey}--${voice.slug}.tmp.mp3`);
    master(take, tmp);
    const stamp = sha8(tmp);
    const name = `${piece.taskKey}--${voice.slug}--${stamp}.mp3`;
    const dst = path.join(dir, name);
    // Ältere Fassungen derselben Stimme weichen — der Fingerabdruck im Namen
    // sorgt dafür, dass eine neue Datei auch eine neue Adresse hat.
    for (const old of fs.readdirSync(dir)) {
      if (old.startsWith(`${piece.taskKey}--${voice.slug}--`) && old !== name) fs.rmSync(path.join(dir, old));
    }
    fs.renameSync(tmp, dst);

    const rel = `/audio/listening/${piece.unit}/${name}`;
    const s = decodeMono(dst);
    measured.files[rel] = {
      unit: piece.unit, taskKey: piece.taskKey,
      voiceSlug: voice.slug, voiceName: voice.name, voiceId: voice.voiceId,
      // Die DISTINKTEN Stimmen des Stuecks — bei einem Dialog eine je Rolle.
      // Die DISTINKTEN Stimmen kommen aus den SEGMENTEN selbst — bei Cast-Stuecken
      // kennt der Auftragszettel die Figur gar nicht (K4c).
      voices: segments
        ? [...new Map(segments.map((g) => [g.voice.slug, g])).values()].map((g) => ({
            role: g.figure ? `${g.figure.name} — ${g.figure.role}` : (piece.roles?.[g.voice.slug] ?? null),
            slug: g.voice.slug, name: g.voice.name, voiceId: g.voice.voiceId,
          }))
        : [{ role: piece.cast ? `${figureByKey.get(piece.cast)?.name} — ${figureByKey.get(piece.cast)?.role}` : null, slug: voice.slug, name: voice.name, voiceId: voice.voiceId }],
      modelId: body.model_id, voiceSettings: body.voice_settings,
      // Die Pausen-Bestellung dieses Stuecks — damit im Nachhinein nachvollziehbar
      // bleibt, WOMIT diese Aufnahme ihren Rhythmus bekommen hat.
      gaps: {
        clauseMs: piece.clauseGapMs ?? order.clauseGapMs ?? CLAUSE_GAP_MS,
        sentenceMs: piece.sentenceGapMs ?? order.sentenceGapMs ?? SENTENCE_GAP_MS,
        paraMs: piece.paraGapMs ?? order.paraGapMs ?? PARA_GAP_MS,
        turnMs: segments ? (piece.turnGapMs ?? order.turnGapMs ?? TURN_GAP_MS) : null,
      },
      scriptChars: script.length, spokenChars: body.text.length, creditsCharged: c, generatedMs: ms,
      // Der Fingerabdruck des GESPROCHENEN Textes. V-LC6 prueft, ob die DATEI zu
      // ihrem Namen passt — nicht, ob sie zum heutigen Skript passt. Ein Text, der
      // nach der Aufnahme geaendert wird, laesst jedes Struktur-Tor gruen und das
      // Kind hoert etwas anderes, als die Aufgaben zitieren. Mit dieser Zahl ist
      // dieser Vergleich eine Zeile weit entfernt (abgelegt fuer die naechste Bahn).
      scriptSha8: crypto.createHash("sha256").update(script).digest("hex").slice(0, 8),
      sha256Prefix: stamp,
      ...measureFile(dst, "speech"),
      headSilenceMs: headSilenceMs(s),
    };
    const rec = measured.files[rel];
    console.log(`✓ ${label} → ${name}  ${rec.durationSec}s · ${rec.loudnessDb} LUFS · TP ${rec.truePeakDb} dBFS · Stille ${rec.headSilenceMs}/${rec.tailSilenceMs} ms · ${c} Zeichen`);
  }

  // Verwaiste Einträge (Dateien, die es nicht mehr gibt) fallen raus.
  for (const rel of Object.keys(measured.files)) {
    if (!fs.existsSync(path.join(ROOT, "apps/web/public", rel.replace(/^\//, "")))) delete measured.files[rel];
  }
  measured.targetLufs = TARGET_I;
  measured.targetTruePeakDb = TARGET_TP;
  fs.writeFileSync(MEASURED, `${JSON.stringify(measured, null, 2)}\n`);

  const after = await subscription(key);
  console.log(`\nZeichen laut Antwort-Kopfzeilen: ${credits}`);
  if (before && after) console.log(`Zeichen laut Konto: ${after.used - before.used} (${after.used}/${after.limit} nach dem Lauf)`);
  console.log(`Rohe Takes (nicht im Repo): ${RAW}`);
  console.log(`Messungen: ${path.relative(ROOT, MEASURED)}`);
};

// ── Die Wache (K4c) ──────────────────────────────────────────────────────────
// Ein `import` dieser Datei darf den Hauptlauf NICHT starten. Die Hoerprobe
// importiert `master`/`speakify`, damit sie DIESELBE Kette benutzt statt einer
// zweiten Abschrift — ohne diese Wache wuerde jeder solche Import einen echten
// Erzeugungslauf ausloesen (die Falle ist auf der Spielbahn schon einmal
// zugeschnappt: `import-batch-aq17.mjs` fuhr beim blossen Import ihren Import).
const runDirectly = process.argv[1] !== undefined
  && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname);
if (runDirectly) main().catch((e) => { console.error(`✗ ${e.message}`); process.exit(1); });
