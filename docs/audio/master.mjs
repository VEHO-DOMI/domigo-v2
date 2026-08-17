#!/usr/bin/env node
// R5 · S1 · DIE NACHBEARBEITUNG — aus rohen Takes wird EIN Raum.
//
// „Derselbe Raum" ist ein Ergebnis der Pipeline, nicht des Prompts: ElevenLabs
// liefert jeden Take mit eigener Lautheit, eigenem Rauschteppich und eigenem
// Vorlauf. Erst diese Kette macht daraus eine Hand.
//
// Eingabe:  docs/audio/takes/<stem>/take-<n>.mp3   (Airlock, gitignored)
//           docs/audio/prompts.ch01.json           (Familie, Dauer, Loop-Absicht)
//           docs/audio/choices.json                (welcher Take je Stem/Variante gilt)
// Ausgabe:  apps/web/public/audio/g1/paint/ch01/{music,sfx}/<stem>[-<v>].mp3
//           docs/audio/audio.measured.json         (jede Datei, jede Zahl)
//
// Kette je Datei:
//   1. Korrelationsprüfung (nur bei Stereo): Mono-RMS ≥ Stereo-RMS − 3 dB,
//      sonst hat das Zusammenlegen etwas ausgelöscht → Take zurück.
//   2. Hochpass 80 Hz · Stille vorn/hinten trimmen · mono 44,1 kHz
//   3. Lautheit angleichen — ZWEI Instrumente, je nach Länge:
//        ≥ 1 s  → `loudnorm` in ZWEI Durchgängen (erst messen, dann normalisieren)
//        < 1 s  → RMS-Normalisierung
//      WARUM: EBU R128 misst über 400-ms-Blöcke. Ein 0,25-Sekunden-Schritt hat
//      keinen einzigen vollständigen Block — „−16 LUFS" ist dort keine strengere
//      Messung, sondern gar keine. Also wird gemessen, was messbar ist, und die
//      Messdatei sagt bei JEDER Datei, mit welchem Instrument (`method`).
//   4. 5 ms Fades an beiden Enden (in Node, auf den Abtastwerten)
//   5. Musik: auf ganze Takte schneiden + 20 ms Equal-Power-Crossfade, sodass
//      die DATEI SELBST die Schleife ist (loopStart = 0, loopEnd = Dauer) —
//      der Phaser-Marker braucht dann keine Innengrenzen, und MP3-Encoder-
//      Lücken sind gegenstandslos.
//   6. MP3 mono 96 kbps 44,1 kHz
//   7. messen und nach audio.measured.json schreiben
//
// Aufruf:
//   node docs/audio/master.mjs                 (alles aus choices.json mastern)
//   node docs/audio/master.mjs --only step-paper
//   node docs/audio/master.mjs --measure       (NICHTS neu bauen, nur neu messen)

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();
const PROMPTS = path.join(ROOT, "docs/audio/prompts.ch01.json");
const CHOICES = path.join(ROOT, "docs/audio/choices.json");
const TAKES = path.join(ROOT, "docs/audio/takes");
const OUT_ROOT = path.join(ROOT, "apps/web/public/audio/g1/paint/ch01");
const MEASURED = path.join(ROOT, "docs/audio/audio.measured.json");

const SR = 44100;
const FADE_MS = 5;
const XFADE_MS = 20;
/** Ziel-RMS für kurze Effekte (< 1 s), in dBFS. Empirisch die Lage, in der ein
 *  dichter One-Shot neben einem −18-LUFS-Musikbett sitzt, ohne ihn zu decken. */
const SFX_TARGET_RMS_DB = -20;
const MUSIC_TARGET_LUFS = -18;
const TARGET_TP_DB = -1;

const argv = process.argv.slice(2);
const flag = (n) => argv.includes(`--${n}`);
const value = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 && argv[i + 1] !== undefined ? argv[i + 1] : d; };
const ONLY = value("only", "").split(",").map((s) => s.trim()).filter(Boolean);
const MEASURE_ONLY = flag("measure");

// ── ffmpeg-Hilfen ────────────────────────────────────────────────────────────
const run = (bin, args) => execFileSync(bin, args, { maxBuffer: 256 * 1024 * 1024 });
/**
 * ffmpeg schreibt seine Messungen (ebur128, astats, loudnorm) nach STDERR —
 * auch bei Exit 0. `execFileSync` gibt bei Erfolg aber nur stdout zurück, also
 * käme jede Messung als leerer String an und JEDE Zahl wäre still falsch.
 * Deshalb `spawnSync`: es liefert beide Ströme, unabhängig vom Exit-Code.
 */
const ffmpegErr = (args) => {
  const r = spawnSync("ffmpeg", ["-hide_banner", ...args], { maxBuffer: 256 * 1024 * 1024 });
  return `${r.stderr?.toString("utf8") ?? ""}${r.stdout?.toString("utf8") ?? ""}`;
};
const probe = (file) => {
  const out = run("ffprobe", [
    "-v", "error", "-show_entries", "format=duration:stream=channels,sample_rate",
    "-of", "json", file,
  ]).toString("utf8");
  const d = JSON.parse(out);
  return {
    duration: Number(d.format?.duration ?? 0),
    channels: Number(d.streams?.[0]?.channels ?? 1),
    sampleRate: Number(d.streams?.[0]?.sample_rate ?? SR),
  };
};

/** Roh-Abtastwerte (f32, mono, 44,1 kHz) eines beliebigen Eingangs. */
const decodeMono = (file, extraFilter) => {
  const args = ["-hide_banner", "-v", "error", "-i", file];
  if (extraFilter) args.push("-af", extraFilter);
  args.push("-ac", "1", "-ar", String(SR), "-f", "f32le", "-");
  const buf = execFileSync("ffmpeg", args, { maxBuffer: 512 * 1024 * 1024 });
  return new Float32Array(buf.buffer, buf.byteOffset, Math.floor(buf.length / 4));
};

/** Roh-Abtastwerte beider Kanäle getrennt (für die Korrelationsprüfung). */
const decodeStereo = (file) => {
  const buf = execFileSync("ffmpeg", [
    "-hide_banner", "-v", "error", "-i", file, "-ac", "2", "-ar", String(SR), "-f", "f32le", "-",
  ], { maxBuffer: 512 * 1024 * 1024 });
  const inter = new Float32Array(buf.buffer, buf.byteOffset, Math.floor(buf.length / 4));
  const n = Math.floor(inter.length / 2);
  const L = new Float32Array(n); const R = new Float32Array(n);
  for (let i = 0; i < n; i++) { L[i] = inter[2 * i]; R[i] = inter[2 * i + 1]; }
  return { L, R };
};

const encodeMp3 = (samples, outFile) => {
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  const raw = Buffer.from(samples.buffer, samples.byteOffset, samples.length * 4);
  execFileSync("ffmpeg", [
    "-hide_banner", "-v", "error", "-y",
    "-f", "f32le", "-ar", String(SR), "-ac", "1", "-i", "pipe:0",
    "-c:a", "libmp3lame", "-b:a", "96k", "-ac", "1", "-ar", String(SR),
    outFile,
  ], { input: raw, maxBuffer: 256 * 1024 * 1024 });
};

// ── Zahlen auf Abtastwerten ──────────────────────────────────────────────────
const rms = (s, from = 0, to = s.length) => {
  let acc = 0;
  for (let i = from; i < to; i++) acc += s[i] * s[i];
  const n = Math.max(1, to - from);
  return Math.sqrt(acc / n);
};
const peak = (s) => {
  let p = 0;
  for (let i = 0; i < s.length; i++) { const a = Math.abs(s[i]); if (a > p) p = a; }
  return p;
};
const db = (x) => (x <= 0 ? -Infinity : 20 * Math.log10(x));

/** Spektraler Schwerpunkt (Hz) eines Fensters — eine direkte DFT über ein
 *  Hann-gefenstertes Segment. Kein FFT-Paket: das Fenster ist klein, die Zahl
 *  wird einmal je Datei gebraucht, und eine Abhängigkeit für 20 Zeilen Mathe
 *  wäre teurer als die Zeilen. */
const centroid = (s, from, to) => {
  const N = Math.min(2048, to - from);
  if (N < 64) return 0;
  const mid = Math.floor((from + to) / 2);
  const start = Math.max(from, mid - Math.floor(N / 2));
  const x = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    const w = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (N - 1)); // Hann
    x[i] = (s[start + i] ?? 0) * w;
  }
  let num = 0; let den = 0;
  const bins = Math.floor(N / 2);
  for (let k = 1; k < bins; k++) {
    let re = 0; let im = 0;
    const w = (-2 * Math.PI * k) / N;
    for (let i = 0; i < N; i++) { const a = w * i; re += x[i] * Math.cos(a); im += x[i] * Math.sin(a); }
    const mag = Math.sqrt(re * re + im * im);
    num += mag * ((k * SR) / N);
    den += mag;
  }
  return den === 0 ? 0 : num / den;
};

/** Drei gleich lange Fenster — die Messung, die BLUEPRINT `:371` zu einer Zahl macht. */
const centroids3 = (s) => {
  const n = s.length;
  const third = Math.floor(n / 3);
  return [
    Math.round(centroid(s, 0, third)),
    Math.round(centroid(s, third, 2 * third)),
    Math.round(centroid(s, 2 * third, n)),
  ];
};

/** Der Sprung an der Schleifen-Naht, in dBFS: wenn die Datei SELBST die
 *  Schleife ist, folgt auf das letzte Abtastwert-Paar das erste. Ein hörbarer
 *  Klick ist genau dieser Sprung. */
const seamDb = (s) => (s.length < 2 ? -Infinity : db(Math.abs(s[0] - s[s.length - 1])));

/** Länge der Stille am Ende, in ms (Schwelle −50 dBFS auf 1-ms-Fenstern). */
const tailSilenceMs = (s) => {
  const win = Math.floor(SR / 1000);
  const thr = Math.pow(10, -50 / 20);
  let i = s.length;
  while (i - win >= 0 && rms(s, i - win, i) < thr) i -= win;
  return Math.round(((s.length - i) / SR) * 1000);
};

/** `flat_factor` aus astats — ein digital abgeschnittenes Signal. */
const flatFactor = (file) => {
  const txt = ffmpegErr(["-v", "info", "-i", file, "-af", "astats=metadata=1", "-f", "null", "-"]);
  const m = /Flat factor:\s*([0-9.]+)/.exec(txt);
  return m ? Number(m[1]) : 0;
};

/** Integrierte Lautheit + True Peak über ebur128 (nur sinnvoll ab ~1 s). */
const ebur128 = (file) => {
  const txt = ffmpegErr(["-v", "info", "-i", file, "-af", "ebur128=peak=true", "-f", "null", "-"]);
  const tail = txt.slice(txt.lastIndexOf("Summary:"));
  const i = /I:\s*(-?[0-9.]+)\s*LUFS/.exec(tail);
  const p = /Peak:\s*(-?[0-9.]+|-inf)\s*dBFS/.exec(tail);
  return {
    lufs: i ? Number(i[1]) : null,
    truePeakDb: p ? (p[1] === "-inf" ? -Infinity : Number(p[1])) : null,
  };
};

/** loudnorm, erster Durchgang: die gemessenen Werte der Datei. */
const loudnormMeasure = (file, targetI) => {
  const txt = ffmpegErr([
    "-v", "info", "-i", file,
    "-af", `loudnorm=I=${targetI}:TP=${TARGET_TP_DB}:LRA=11:print_format=json`,
    "-f", "null", "-",
  ]);
  const start = txt.lastIndexOf("{");
  const end = txt.lastIndexOf("}");
  if (start < 0 || end < start) throw new Error(`loudnorm hat keine Messung geliefert fuer ${file}`);
  return JSON.parse(txt.slice(start, end + 1));
};

// ── Die Kette ────────────────────────────────────────────────────────────────
const TRIM = "silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.01:detection=peak,"
  + "areverse,silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.01:detection=peak,areverse";

const applyFades = (s) => {
  const n = Math.min(Math.floor((FADE_MS / 1000) * SR), Math.floor(s.length / 2));
  for (let i = 0; i < n; i++) {
    const g = i / n;
    s[i] *= g;
    s[s.length - 1 - i] *= g;
  }
  return s;
};

const limitTruePeak = (s, targetDb) => {
  const target = Math.pow(10, targetDb / 20);
  const p = peak(s);
  if (p > target && p > 0) {
    const g = target / p;
    for (let i = 0; i < s.length; i++) s[i] *= g;
  }
  return s;
};

/**
 * Musik auf ganze Takte schneiden und die Naht einbacken.
 * Die Datei danach IST die Schleife: `loopStart = 0`, `loopEnd = Dauer`.
 */
const cutLoop = (s, bpm, beatsPerBar) => {
  const barSec = (60 / bpm) * beatsPerBar;
  const barN = Math.floor(barSec * SR);
  const xf = Math.floor((XFADE_MS / 1000) * SR);
  const bars = Math.max(1, Math.floor((s.length - xf) / barN));
  const L = bars * barN;
  if (L + xf > s.length) return { samples: s, bars: 0, note: "zu kurz fuer einen Takt-Schnitt — ungeschnitten" };
  const out = new Float32Array(L);
  out.set(s.subarray(0, L));
  // Equal-Power-Crossfade: der Anfang bekommt das Material, das im nächsten
  // Durchlauf davor läge (die Abtastwerte ab L) — dadurch ist der Übergang
  // vom Dateiende zum Dateianfang stetig.
  for (let i = 0; i < xf; i++) {
    const t = i / xf;
    out[i] = s[i] * Math.sqrt(t) + s[L + i] * Math.sqrt(1 - t);
  }
  return { samples: out, bars, note: `${bars} Takte à ${beatsPerBar}/4 bei ${bpm} BPM` };
};

// ── Messen einer fertigen Datei ──────────────────────────────────────────────
const measureFinal = (file, kind) => {
  const s = decodeMono(file);
  const info = probe(file);
  const long = info.duration >= 1.0;
  const eb = long ? ebur128(file) : { lufs: null, truePeakDb: null };
  const pk = peak(s);
  return {
    sha1: crypto.createHash("sha1").update(fs.readFileSync(file)).digest("hex"),
    bytes: fs.statSync(file).size,
    durationSec: Number(info.duration.toFixed(3)),
    method: long ? "lufs-i" : "rms",
    loudnessDb: long ? eb.lufs : Number(db(rms(s)).toFixed(2)),
    truePeakDb: Number((long && eb.truePeakDb !== null ? eb.truePeakDb : db(pk)).toFixed(2)),
    rmsDb: Number(db(rms(s)).toFixed(2)),
    peakDb: Number(db(pk).toFixed(2)),
    flatFactor: flatFactor(file),
    centroidsHz: centroids3(s),
    tailSilenceMs: tailSilenceMs(s),
    seamDb: kind === "music" ? Number(seamDb(s).toFixed(1)) : null,
    loopStartSec: kind === "music" ? 0 : null,
    loopEndSec: kind === "music" ? Number(info.duration.toFixed(3)) : null,
  };
};

// ── Hauptlauf ────────────────────────────────────────────────────────────────
const spec = JSON.parse(fs.readFileSync(PROMPTS, "utf8"));
const byStem = new Map([...(spec.sfx ?? []), ...(spec.music ?? [])].map((i) => [i.stem, i]));
const choices = fs.existsSync(CHOICES) ? JSON.parse(fs.readFileSync(CHOICES, "utf8")) : {};

const measured = {};
const rejects = [];

/** Alle zu bauenden Ausgabedateien: je Stem eine Liste {out, take}. */
const targets = [];
for (const [stem, picks] of Object.entries(choices)) {
  if (ONLY.length > 0 && !ONLY.includes(stem)) continue;
  const item = byStem.get(stem);
  if (item === undefined) { rejects.push(`${stem}: steht in choices.json, aber nicht in prompts.ch01.json`); continue; }
  const kind = item.kind ?? (stem.startsWith("music-") ? "music" : "sfx");
  const list = Array.isArray(picks) ? picks : [picks];
  list.forEach((take, idx) => {
    const name = list.length > 1 ? `${stem}-${idx + 1}` : stem;
    targets.push({ stem, item, kind, take, out: path.join(OUT_ROOT, kind, `${name}.mp3`), name });
  });
}

if (MEASURE_ONLY) {
  for (const t of targets) {
    if (!fs.existsSync(t.out)) { rejects.push(`${t.name}: ${path.relative(ROOT, t.out)} fehlt`); continue; }
    measured[t.name] = { ...measureFinal(t.out, t.kind), family: t.item.family, kind: t.kind, pedagogy: t.item.pedagogy ?? "info", take: t.take };
    console.log(`  · gemessen ${t.name}`);
  }
} else {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "domigo-master-"));
  for (const t of targets) {
    const src = path.join(TAKES, t.stem, `take-${t.take}.mp3`);
    if (!fs.existsSync(src)) { rejects.push(`${t.name}: Roh-Take fehlt (${path.relative(ROOT, src)})`); continue; }

    // 1 · Korrelationsprüfung
    const info = probe(src);
    if (info.channels === 2) {
      const { L, R } = decodeStereo(src);
      const stereoRms = Math.sqrt((rms(L) ** 2 + rms(R) ** 2) / 2);
      const mono = new Float32Array(L.length);
      for (let i = 0; i < L.length; i++) mono[i] = (L[i] + R[i]) / 2;
      const monoRms = rms(mono);
      const lossDb = db(monoRms) - db(stereoRms);
      if (lossDb < -3) {
        rejects.push(`${t.name}: Mono-Zusammenlegung verliert ${lossDb.toFixed(1)} dB (Grenze −3 dB) — Phasenausloeschung, Take zurueck`);
        continue;
      }
    }

    // 2 · Hochpass + Trimmen + mono 44,1 kHz  → Zwischen-WAV (verlustfrei)
    const stageA = path.join(tmp, `${t.name}-a.wav`);
    run("ffmpeg", ["-hide_banner", "-v", "error", "-y", "-i", src,
      "-af", `highpass=f=80,${TRIM}`, "-ac", "1", "-ar", String(SR), "-c:a", "pcm_f32le", stageA]);

    // 3 · Lautheit
    let samples;
    const aInfo = probe(stageA);
    if (aInfo.duration >= 1.0) {
      const m = loudnormMeasure(stageA, MUSIC_TARGET_LUFS);
      const stageB = path.join(tmp, `${t.name}-b.wav`);
      run("ffmpeg", ["-hide_banner", "-v", "error", "-y", "-i", stageA, "-af",
        `loudnorm=I=${MUSIC_TARGET_LUFS}:TP=${TARGET_TP_DB}:LRA=11:`
        + `measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:`
        + `measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`,
        "-ac", "1", "-ar", String(SR), "-c:a", "pcm_f32le", stageB]);
      samples = decodeMono(stageB);
    } else {
      samples = decodeMono(stageA);
      const cur = db(rms(samples));
      const gain = Math.pow(10, (SFX_TARGET_RMS_DB - cur) / 20);
      for (let i = 0; i < samples.length; i++) samples[i] *= gain;
    }

    // 4 · Musik-Schleife schneiden (vor den Fades — die Datei IST die Schleife,
    //     also darf sie am Anfang und Ende NICHT ausgeblendet werden)
    let loopNote = null;
    if (t.kind === "music" && t.item.loop === true) {
      const cut = cutLoop(samples, t.item.bpm ?? 96, t.item.beatsPerBar ?? 4);
      samples = cut.samples;
      loopNote = cut.note;
    } else {
      applyFades(samples);
    }

    // 5 · Spitze begrenzen und schreiben
    limitTruePeak(samples, TARGET_TP_DB);
    encodeMp3(samples, t.out);

    measured[t.name] = {
      ...measureFinal(t.out, t.kind),
      family: t.item.family, kind: t.kind, pedagogy: t.item.pedagogy ?? "info", take: t.take,
      ...(loopNote ? { loopNote } : {}),
    };
    console.log(`  ✓ ${t.name} — ${(measured[t.name].bytes / 1024).toFixed(0)} KB, `
      + `${measured[t.name].loudnessDb} (${measured[t.name].method}), TP ${measured[t.name].truePeakDb} dB`
      + (loopNote ? `, ${loopNote}` : ""));
  }
  fs.rmSync(tmp, { recursive: true, force: true });
}

// ── audio.measured.json schreiben ────────────────────────────────────────────
// Beim Teil-Lauf (`--only`) bleiben die anderen Einträge stehen, sonst wäre
// jeder Einzel-Lauf ein Datenverlust.
const previous = fs.existsSync(MEASURED) ? JSON.parse(fs.readFileSync(MEASURED, "utf8")) : { files: {} };
const merged = ONLY.length > 0 ? { ...previous.files, ...measured } : measured;
const sorted = Object.fromEntries(Object.keys(merged).sort().map((k) => [k, merged[k]]));
fs.writeFileSync(MEASURED, `${JSON.stringify({
  note: "Erzeugt von docs/audio/master.mjs. `method` sagt, womit gemessen wurde: "
    + "`lufs-i` (EBU R128, ab 1 s) oder `rms` (kuerzer — R128 braucht 400-ms-Bloecke). "
    + "Reproduzierbar auf DERSELBEN Maschine mit demselben ffmpeg: `node docs/audio/master.mjs --measure` "
    + "muss einen leeren Diff ergeben.",
  files: sorted,
}, null, 2)}\n`);

console.log(`\naudio.measured.json: ${Object.keys(sorted).length} Dateien.`);
if (rejects.length > 0) {
  for (const r of rejects) console.error(`  ✗ ${r}`);
  console.error(`\nmaster: ${rejects.length} Rueckgabe(n).`);
  process.exit(1);
}
