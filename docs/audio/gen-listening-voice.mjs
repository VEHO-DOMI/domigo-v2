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
// Aufruf:
//   node docs/audio/gen-listening-voice.mjs --list-voices
//   node docs/audio/gen-listening-voice.mjs --plan
//   node docs/audio/gen-listening-voice.mjs --all
//   node docs/audio/gen-listening-voice.mjs --only alice
//   node docs/audio/gen-listening-voice.mjs --measure     (nichts erzeugen, nur neu messen)

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { SR, decodeMono, loudnormMeasure, measureFile, rms } from "./measure.mjs";

const ROOT = process.cwd();
const ORDER = path.join(ROOT, "docs/audio/listening-voices.json");
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

// ── Argumente ────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const flag = (n) => argv.includes(`--${n}`);
const value = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 && argv[i + 1] !== undefined ? argv[i + 1] : d; };
const LIST_VOICES = flag("list-voices");
const PLAN_ONLY = flag("plan");
const MEASURE_ONLY = flag("measure");
const ALL = flag("all");
const ONLY = value("only", "").split(",").map((s) => s.trim()).filter(Boolean);

// ── Der Schlüssel ────────────────────────────────────────────────────────────
const readKey = () => {
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
const master = (src, dst) => {
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

const sha8 = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex").slice(0, 8);

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

  const jobs = [];
  for (const piece of order.pieces) {
    const script = scriptOf(piece.unit, piece.taskKey);
    for (const v of order.voices) {
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

  for (const { piece, voice, script } of jobs) {
    const label = `${piece.unit}/${piece.taskKey}·${voice.slug}`;
    const body = {
      text: script,
      model_id: voice.modelId ?? order.modelId ?? "eleven_multilingual_v2",
      voice_settings: {
        stability: voice.stability ?? order.stability ?? 0.5,
        similarity_boost: voice.similarityBoost ?? order.similarityBoost ?? 0.75,
        style: voice.style ?? order.style ?? 0,
        use_speaker_boost: true,
        ...(voice.speed ?? order.speed ? { speed: voice.speed ?? order.speed } : {}),
      },
    };
    const { buf, credits: c, ms } = await post(key, `${API}/text-to-speech/${voice.voiceId}?output_format=${OUTPUT_FORMAT}`, body, label);
    credits += c;

    const take = path.join(RAW, `${piece.unit}--${piece.taskKey}--${voice.slug}.mp3`);
    fs.writeFileSync(take, buf);

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
      modelId: body.model_id, voiceSettings: body.voice_settings,
      scriptChars: script.length, creditsCharged: c, generatedMs: ms,
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

main().catch((e) => { console.error(`✗ ${e.message}`); process.exit(1); });
