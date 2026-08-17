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
import { execFileSync } from "node:child_process";
// Das Messgerät steht in EINER Datei, und `scripts/check-audio.mjs` benutzt
// genau dasselbe. Zwei Implementierungen wären die Sorte Drift, gegen die das
// Tor existiert: das Mastering hielte seine Zahl für richtig und das Tor seine.
import { SR, db, decodeMono, loudnormMeasure, measureFile, peak, probe, rms } from "./measure.mjs";

const ROOT = process.cwd();
const PROMPTS = path.join(ROOT, "docs/audio/prompts.ch01.json");
const CHOICES = path.join(ROOT, "docs/audio/choices.json");
const TAKES = path.join(ROOT, "docs/audio/takes");
const OUT_ROOT = path.join(ROOT, "apps/web/public/audio/g1/paint/ch01");
const MEASURED = path.join(ROOT, "docs/audio/audio.measured.json");

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
const SURVEY = flag("survey");
const SURVEY_ROOT = path.join(ROOT, "docs/audio/survey");

// ── ffmpeg-Hilfen, die nur das Mastering braucht ─────────────────────────────
const run = (bin, args) => execFileSync(bin, args, { maxBuffer: 256 * 1024 * 1024 });
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
 * Die Schleifenlänge wird GEMESSEN, nicht geglaubt.
 *
 * Der naheliegende Weg wäre, aus dem bestellten Tempo eine Taktlänge zu rechnen
 * und auf ganze Takte zu schneiden. Genau das ist die Falle: ElevenLabs bekommt
 * „about 92 BPM" als Wunsch, nicht als Vorgabe. Liefert es 88, sitzt jeder
 * Schnitt daneben — die Naht ist auf Abtastwert-Ebene sauber (der Crossfade
 * sorgt dafür), und die Schleife stolpert trotzdem bei jedem Durchlauf
 * musikalisch. Das wäre ein Fehler, den die Messung bestätigt und das Ohr
 * hört: die schlimmste Sorte.
 *
 * Stattdessen wird die Länge gesucht, bei der sich das Stück selbst am
 * ähnlichsten ist: Für Kandidaten L wird verglichen, wie sehr das Material AB L
 * dem Material AB 0 gleicht. Das ist genau die Bedingung, die eine Schleife
 * braucht — und sie kommt ohne jede Annahme über Tempo oder Taktart aus.
 *
 * Zwei Stufen, damit es bezahlbar bleibt: grob auf einer 10-ms-Energiehüllkurve
 * (findet die Periode), fein auf den Abtastwerten (findet den Nulldurchgang der
 * Phase). Danach IST die Datei die Schleife: `loopStart = 0`, `loopEnd = Dauer`.
 */
const findLoopLength = (s, hintSec) => {
  const HOP = Math.floor(SR / 100); // 10 ms
  const frames = Math.floor(s.length / HOP);
  const env = new Float64Array(frames);
  for (let f = 0; f < frames; f++) env[f] = rms(s, f * HOP, (f + 1) * HOP);

  const winF = Math.min(Math.floor(frames / 4), 200); // ~2 s Vergleichsfenster
  const corr = (lagF) => {
    let num = 0; let a = 0; let b = 0;
    for (let i = 0; i < winF; i++) {
      const x = env[i]; const y = env[lagF + i] ?? 0;
      num += x * y; a += x * x; b += y * y;
    }
    return a === 0 || b === 0 ? 0 : num / Math.sqrt(a * b);
  };

  const minF = Math.floor(frames * 0.5);
  const maxF = frames - winF - 1;
  let bestF = -1; let bestScore = -1;
  for (let lagF = minF; lagF <= maxF; lagF++) {
    const c = corr(lagF);
    if (c > bestScore) { bestScore = c; bestF = lagF; }
  }
  if (bestF < 0) return null;

  // Feinsuche auf den Abtastwerten, ±15 ms um den groben Treffer
  const coarse = bestF * HOP;
  const span = Math.floor(0.015 * SR);
  const fineWin = Math.floor(0.25 * SR);
  let bestN = coarse; let bestFine = -Infinity;
  for (let L = Math.max(1, coarse - span); L <= Math.min(s.length - fineWin - 1, coarse + span); L++) {
    let num = 0; let a = 0; let b = 0;
    for (let i = 0; i < fineWin; i += 4) {
      const x = s[i]; const y = s[L + i];
      num += x * y; a += x * x; b += y * y;
    }
    const c = a === 0 || b === 0 ? 0 : num / Math.sqrt(a * b);
    if (c > bestFine) { bestFine = c; bestN = L; }
  }
  return { lengthSamples: bestN, envScore: bestScore, waveScore: bestFine, hintSec };
};

/** Musik auf die gemessene Schleifenlänge schneiden und die Naht einbacken. */
const cutLoop = (s, bpm, beatsPerBar) => {
  const xf = Math.floor((XFADE_MS / 1000) * SR);
  const found = findLoopLength(s);
  if (found === null || found.lengthSamples + xf > s.length) {
    return { samples: s, note: "keine Schleifenlaenge messbar — ungeschnitten", loop: null };
  }
  const L = found.lengthSamples;
  const out = new Float32Array(L);
  out.set(s.subarray(0, L));
  // Equal-Power-Crossfade: der Anfang bekommt das Material, das im nächsten
  // Durchlauf davor läge (die Abtastwerte ab L) — dadurch ist der Übergang
  // vom Dateiende zum Dateianfang stetig.
  for (let i = 0; i < xf; i++) {
    const t = i / xf;
    out[i] = s[i] * Math.sqrt(t) + s[L + i] * Math.sqrt(1 - t);
  }
  // Zum Vergleich: was der bestellte Takt vorhergesagt hätte. Weichen beide
  // stark ab, hat der Dienst ein anderes Tempo geliefert als gewünscht — das
  // steht dann im Protokoll, statt still falsch zu sein.
  const barSec = (60 / bpm) * beatsPerBar;
  const bars = L / SR / barSec;
  return {
    samples: out,
    loop: { seconds: L / SR, envScore: found.envScore, waveScore: found.waveScore, barsAtRequestedBpm: Number(bars.toFixed(2)) },
    note: `Schleife gemessen: ${(L / SR).toFixed(2)} s (Selbstaehnlichkeit ${found.envScore.toFixed(3)} Huellkurve / `
      + `${found.waveScore.toFixed(3)} Wellenform) ≙ ${bars.toFixed(2)} Takte bei bestellten ${bpm} BPM`,
  };
};

// ── Hauptlauf ────────────────────────────────────────────────────────────────
const spec = JSON.parse(fs.readFileSync(PROMPTS, "utf8"));
const byStem = new Map([...(spec.sfx ?? []), ...(spec.music ?? [])].map((i) => [i.stem, i]));
const choices = fs.existsSync(CHOICES) ? JSON.parse(fs.readFileSync(CHOICES, "utf8")) : {};

const measured = {};
const rejects = [];

/**
 * Alle zu bauenden Ausgabedateien.
 *
 * Normal: was `choices.json` sagt — je Stem der gewählte Take (oder eine Liste
 * für die Varianten), nach `apps/web/public/audio/…`.
 *
 * `--survey`: JEDER vorhandene Take jedes Stems, durch dieselbe Kette, nach
 * `docs/audio/survey/` (gitignored). Das ist das Instrument, mit dem gewählt
 * wird: „nimm Take 1" ist keine Wahl, sondern die Abwesenheit einer. Erst wenn
 * alle Takes durch dieselbe Nachbearbeitung gelaufen sind, vergleicht man
 * Klänge und nicht Zufälle der Lautheit.
 */
const targets = [];
if (SURVEY) {
  const stems = ONLY.length > 0 ? ONLY : [...byStem.keys()];
  for (const stem of stems) {
    const item = byStem.get(stem);
    if (item === undefined || item.reserved === true) continue;
    const dir = path.join(TAKES, stem);
    if (!fs.existsSync(dir)) continue;
    const kind = item.kind ?? (stem.startsWith("music-") ? "music" : "sfx");
    for (const f of fs.readdirSync(dir).filter((x) => /^take-\d+\.mp3$/.test(x)).sort()) {
      const take = Number(/take-(\d+)/.exec(f)?.[1]);
      targets.push({ stem, item, kind, take, out: path.join(SURVEY_ROOT, stem, `take-${take}.mp3`), name: `${stem}#${take}` });
    }
  }
} else {
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
}

if (MEASURE_ONLY) {
  for (const t of targets) {
    if (!fs.existsSync(t.out)) { rejects.push(`${t.name}: ${path.relative(ROOT, t.out)} fehlt`); continue; }
    measured[t.name] = { ...measureFile(t.out, t.kind), family: t.item.family, kind: t.kind, pedagogy: t.item.pedagogy ?? "info", take: t.take };
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

    // ── 3 · Musik: Lautheit über loudnorm, dann die Schleife schneiden ───────
    // Reihenfolge: Der Loop-Schnitt entfernt ein Stück eines 45-Sekunden-Stücks;
    // die integrierte Lautheit von 38 s desselben Materials weicht davon nur um
    // Zehntel ab (gemessen: −18,4 statt −18,5). Bei Effekten ist es umgekehrt,
    // siehe unten.
    let samples;
    let loopNote = null;
    let loopFit = null;
    const aInfo = probe(stageA);

    if (t.kind === "music") {
      const m = loudnormMeasure(stageA, MUSIC_TARGET_LUFS, TARGET_TP_DB);
      const stageB = path.join(tmp, `${t.name}-b.wav`);
      run("ffmpeg", ["-hide_banner", "-v", "error", "-y", "-i", stageA, "-af",
        `loudnorm=I=${MUSIC_TARGET_LUFS}:TP=${TARGET_TP_DB}:LRA=11:`
        + `measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:`
        + `measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`,
        "-ac", "1", "-ar", String(SR), "-c:a", "pcm_f32le", stageB]);
      samples = decodeMono(stageB);
      if (t.item.loop === true) {
        const cut = cutLoop(samples, t.item.bpm ?? 96, t.item.beatsPerBar ?? 4);
        samples = cut.samples;
        loopNote = cut.note;
        loopFit = cut.loop;
      } else {
        applyFades(samples); // Auftakt und Sieg laufen einmal und dürfen ausblenden
      }
    } else {
      // ── Effekte: ERST kappen und ausblenden, DANN normalisieren ────────────
      //
      // Die Effekt-API von ElevenLabs kann minimal 0,5 s; ein Schritt soll aber
      // 0,25 s dauern. Bestellt wird also länger und hier gekappt.
      //
      // ⚠ Die Reihenfolge ist der ganze Punkt. Die erste Fassung normalisierte
      // ZUERST und kappte danach — die Normalisierung maß also eine halbe
      // Sekunde, ausgeliefert wurde eine Drittelsekunde, und die gemessenen
      // Lautheiten streuten über fünf Dezibel (−17,9 bis −22,9 dB bei einem Ziel
      // von −20). Aufgefallen ist das erst in der Musterung des
      // Kalibrierungs-Exemplars: genau dafür kommt das Exemplar vor der Serie.
      samples = decodeMono(stageA);
      if (typeof t.item.targetSeconds === "number") {
        const maxN = Math.floor(t.item.targetSeconds * SR);
        if (samples.length > maxN) samples = samples.slice(0, maxN);
      }
      applyFades(samples);
      const cur = db(rms(samples));
      const gain = 10 ** ((SFX_TARGET_RMS_DB - cur) / 20);
      for (let i = 0; i < samples.length; i++) samples[i] *= gain;
    }

    // 4 · Spitze begrenzen und schreiben
    limitTruePeak(samples, TARGET_TP_DB);
    encodeMp3(samples, t.out);

    measured[t.name] = {
      ...measureFile(t.out, t.kind),
      family: t.item.family, kind: t.kind, pedagogy: t.item.pedagogy ?? "info", take: t.take,
      ...(loopNote ? { loopNote } : {}),
      ...(loopFit ? { loopFit } : {}),
    };
    console.log(`  ✓ ${t.name} — ${(measured[t.name].bytes / 1024).toFixed(0)} KB, `
      + `${measured[t.name].loudnessDb} (${measured[t.name].method}), TP ${measured[t.name].truePeakDb} dB`
      + (loopNote ? `, ${loopNote}` : ""));
  }
  fs.rmSync(tmp, { recursive: true, force: true });
}

// ── Musterung: eine Tabelle zum Wählen, und SONST nichts anfassen ───────────
// Die Musterung schreibt weder audio.measured.json noch audioFiles.ts — sie
// entscheidet nichts, sie legt nur nebeneinander.
if (SURVEY) {
  fs.writeFileSync(path.join(SURVEY_ROOT, "survey.json"), `${JSON.stringify(measured, null, 2)}\n`);
  const byStemRows = new Map();
  for (const [name, m] of Object.entries(measured)) {
    const stem = name.split("#")[0];
    if (!byStemRows.has(stem)) byStemRows.set(stem, []);
    byStemRows.get(stem).push({ take: m.take, ...m });
  }
  console.log("\nMusterung — je Stem alle Takes durch dieselbe Kette:\n");
  for (const [stem, rows] of byStemRows) {
    console.log(`  ${stem}`);
    for (const r of rows.sort((a, b) => a.take - b.take)) {
      console.log(`    take-${r.take}  ${String(r.durationSec).padStart(6)} s  `
        + `${String(r.loudnessDb).padStart(7)} ${r.method === "rms" ? "dB " : "LUFS"}  `
        + `TP ${String(r.truePeakDb).padStart(6)}  `
        + `Zentroide ${r.centroidsHz.join(" → ").padEnd(22)}  `
        + `${r.tailSilenceMs} ms Schwanz${r.seamRatio !== null && r.seamRatio !== undefined ? `  Naht ${r.seamRatio}` : ""}`);
    }
  }
  console.log(`\n${Object.keys(measured).length} Takes gemustert → docs/audio/survey/ (gitignored). `
    + "Wahl in docs/audio/choices.json eintragen, dann ohne --survey laufen lassen.");
  if (rejects.length > 0) for (const r of rejects) console.error(`  ✗ ${r}`);
  process.exit(0);
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

// ── audioFiles.ts erzeugen ───────────────────────────────────────────────────
// Der Cache-Schlüssel MUSS mit der Datei wandern: `next.config.ts` liefert alles
// unter /audio/* mit `immutable` aus, und dieses Versprechen ist nur haltbar,
// wenn eine neu gemasterte Datei unter einer NEUEN Adresse ankommt. Für Bilder
// erledigt das `stamped()` — das liest die Datei aber mit `node:fs` und ist
// damit Server-Code. Der Klang-Lader läuft im Browser, also wandert der sha1
// beim MASTERN in ein generiertes Modul statt bei jeder Anfrage neu berechnet
// zu werden.
const FILES_TS = path.join(ROOT, "packages/game-paint/src/audio/audioFiles.ts");
const rows = Object.entries(sorted).map(([name, m]) =>
  `  ${JSON.stringify(name)}: { v: ${JSON.stringify(m.sha1.slice(0, 8))}, bytes: ${m.bytes}, `
  + `durationSec: ${m.durationSec}, kind: ${JSON.stringify(m.kind)} },`);
fs.writeFileSync(FILES_TS, `/**
 * ERZEUGT von \`docs/audio/master.mjs\` — nicht von Hand ändern.
 *
 * Je Klang-Datei ihr Inhalts-Fingerabdruck (\`v\`, die ersten acht Stellen des
 * sha1), ihre Grösse und ihre Dauer. \`audioManifest.ts#audioUrl()\` hängt \`v\`
 * an die Adresse, damit die \`immutable\`-Kopfzeile aus \`next.config.ts\` halten
 * kann: eine neu gemasterte Datei kommt unter einer neuen Adresse an, eine
 * unveränderte behält ihre zwischengespeicherte Kopie.
 *
 * \`scripts/check-audio.mjs\` prüft, dass diese Zahlen mit
 * \`docs/audio/audio.measured.json\` und mit dem, was wirklich auf der Platte
 * liegt, übereinstimmen.
 */

export interface AudioFileInfo {
  readonly v: string;
  readonly bytes: number;
  readonly durationSec: number;
  readonly kind: "music" | "sfx";
}

export const AUDIO_FILES: Readonly<Record<string, AudioFileInfo>> = {
${rows.join("\n")}
};
`);

console.log(`\naudio.measured.json: ${Object.keys(sorted).length} Dateien. audioFiles.ts erzeugt.`);
if (rejects.length > 0) {
  for (const r of rejects) console.error(`  ✗ ${r}`);
  console.error(`\nmaster: ${rejects.length} Rueckgabe(n).`);
  process.exit(1);
}
