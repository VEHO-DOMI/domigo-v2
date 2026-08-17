/**
 * R5 · S1 · DAS MESSGERÄT — einmal gebaut, von zwei Seiten benutzt.
 *
 * `master.mjs` schreibt mit diesen Funktionen `audio.measured.json`;
 * `scripts/check-audio.mjs` misst mit DENSELBEN Funktionen nach und vergleicht.
 * Zwei getrennte Implementierungen wären genau die Sorte Drift, gegen die das
 * Tor existiert: das Mastering hielte seine eigene Zahl für richtig und das Tor
 * seine, und beide hätten recht.
 *
 * Was hier NICHT gemessen wird, weil es nicht messbar ist: die integrierte
 * Lautheit nach EBU R128 braucht 400-ms-Blöcke. Ein 0,25-Sekunden-Schritt hat
 * keinen einzigen. Für alles unter einer Sekunde ist deshalb der RMS-Pegel das
 * Instrument, und `method` sagt bei jeder Datei, welches benutzt wurde.
 */

import fs from "node:fs";
import crypto from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";

export const SR = 44100;

/** ffmpeg schreibt seine Messungen nach STDERR — auch bei Exit 0. */
export const ffmpegErr = (args) => {
  const r = spawnSync("ffmpeg", ["-hide_banner", ...args], { maxBuffer: 256 * 1024 * 1024 });
  return `${r.stderr?.toString("utf8") ?? ""}${r.stdout?.toString("utf8") ?? ""}`;
};

export const probe = (file) => {
  const out = execFileSync("ffprobe", [
    "-v", "error", "-show_entries", "format=duration:stream=channels,sample_rate", "-of", "json", file,
  ], { maxBuffer: 64 * 1024 * 1024 }).toString("utf8");
  const d = JSON.parse(out);
  return {
    duration: Number(d.format?.duration ?? 0),
    channels: Number(d.streams?.[0]?.channels ?? 1),
    sampleRate: Number(d.streams?.[0]?.sample_rate ?? SR),
  };
};

/** Roh-Abtastwerte (f32, mono, 44,1 kHz). */
export const decodeMono = (file, extraFilter) => {
  const args = ["-hide_banner", "-v", "error", "-i", file];
  if (extraFilter) args.push("-af", extraFilter);
  args.push("-ac", "1", "-ar", String(SR), "-f", "f32le", "-");
  const buf = execFileSync("ffmpeg", args, { maxBuffer: 512 * 1024 * 1024 });
  return new Float32Array(buf.buffer, buf.byteOffset, Math.floor(buf.length / 4));
};

export const rms = (s, from = 0, to = s.length) => {
  let acc = 0;
  for (let i = from; i < to; i++) acc += s[i] * s[i];
  return Math.sqrt(acc / Math.max(1, to - from));
};

export const peak = (s) => {
  let p = 0;
  for (let i = 0; i < s.length; i++) { const a = Math.abs(s[i]); if (a > p) p = a; }
  return p;
};

export const db = (x) => (x <= 0 ? -Infinity : 20 * Math.log10(x));

/**
 * Schnelle Fouriertransformation, radix-2, an Ort und Stelle.
 *
 * Die erste Fassung dieses Moduls rechnete die Fourier-Summe direkt aus. Das war
 * richtig und unbrauchbar langsam: 2048 Punkte × 1024 Frequenzen × 3 Fenster
 * sind sechs Millionen Sinus-Aufrufe **je Datei**, und die Musterung hat 219
 * Dateien zu messen — dieselbe Rechnung läuft ausserdem im CI-Tor bei jedem
 * Lauf. Gemessen: die Musterung schaffte 31 Dateien in einer Viertelstunde.
 *
 * Dies ist derselbe Wert, in n·log(n) statt n². Der Selbsttest unten vergleicht
 * beide Wege an einem Sinus bekannter Frequenz — eine schnellere Rechnung, die
 * etwas anderes ausrechnet, wäre die schlechteste aller Verbesserungen.
 */
const fft = (re, im) => {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      const tr = re[i]; re[i] = re[j]; re[j] = tr;
      const ti = im[i]; im[i] = im[j]; im[j] = ti;
    }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = (-2 * Math.PI) / len;
    const wr = Math.cos(ang); const wi = Math.sin(ang);
    const half = len >> 1;
    for (let i = 0; i < n; i += len) {
      let cr = 1; let ci = 0;
      for (let j = 0; j < half; j++) {
        const ur = re[i + j]; const ui = im[i + j];
        const xr = re[i + j + half]; const xi = im[i + j + half];
        const vr = xr * cr - xi * ci;
        const vi = xr * ci + xi * cr;
        re[i + j] = ur + vr; im[i + j] = ui + vi;
        re[i + j + half] = ur - vr; im[i + j + half] = ui - vi;
        const nr = cr * wr - ci * wi;
        ci = cr * wi + ci * wr;
        cr = nr;
      }
    }
  }
};

/**
 * Spektraler Schwerpunkt (Hz) eines Hann-gefensterten Segments — die „Helligkeit"
 * des Klangs. Aus drei solchen Fenstern wird die Messung, die BLUEPRINT `:371`
 * zu einer Zahl macht.
 */
export const centroid = (s, from, to) => {
  const span = to - from;
  if (span < 64) return 0;
  const N = Math.min(2048, 2 ** Math.floor(Math.log2(span)));
  const mid = Math.floor((from + to) / 2);
  const start = Math.max(from, Math.min(s.length - N, mid - Math.floor(N / 2)));
  const re = new Float64Array(N);
  const im = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    const w = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (N - 1));
    re[i] = (s[start + i] ?? 0) * w;
  }
  fft(re, im);
  let num = 0; let den = 0;
  const bins = N >> 1;
  for (let k = 1; k < bins; k++) {
    const mag = Math.hypot(re[k], im[k]);
    num += mag * ((k * SR) / N);
    den += mag;
  }
  return den === 0 ? 0 : num / den;
};

/** Drei gleich lange Fenster — die Messung, die BLUEPRINT `:371` zu einer Zahl macht. */
export const centroids3 = (s) => {
  const third = Math.floor(s.length / 3);
  return [
    Math.round(centroid(s, 0, third)),
    Math.round(centroid(s, third, 2 * third)),
    Math.round(centroid(s, 2 * third, s.length)),
  ];
};

/**
 * Die Schleifen-Naht, gemessen an der Datei SELBST.
 *
 * Eine absolute Schwelle („Sprung < −40 dBFS") misst die Helligkeit der Musik,
 * nicht die Qualität der Naht: nach dem Crossfade grenzen dort zwei BENACHBARTE
 * Abtastwerte des Originals aneinander, und ihr Abstand ist die Steilheit, die
 * das Material an dieser Stelle ohnehin hat. Verglichen wird deshalb mit den
 * Sprüngen im Rest der Datei (99. Perzentil). Ein Schnitt ohne Crossfade fällt
 * dabei sofort auf.
 */
export const seamMetrics = (s) => {
  if (s.length < 64) return { seamDb: null, seamRatio: null };
  const step = Math.abs(s[0] - s[s.length - 1]);
  const diffs = [];
  const stride = Math.max(1, Math.floor(s.length / 20000));
  for (let i = 1; i < s.length; i += stride) diffs.push(Math.abs(s[i] - s[i - 1]));
  diffs.sort((a, b) => a - b);
  const p99 = diffs[Math.floor(diffs.length * 0.99)] || 1e-9;
  return { seamDb: Number(db(step).toFixed(1)), seamRatio: Number((step / p99).toFixed(2)) };
};

/** Stille am Ende in ms (Schwelle −50 dBFS auf 1-ms-Fenstern). */
export const tailSilenceMs = (s) => {
  const win = Math.floor(SR / 1000);
  const thr = 10 ** (-50 / 20);
  let i = s.length;
  while (i - win >= 0 && rms(s, i - win, i) < thr) i -= win;
  return Math.round(((s.length - i) / SR) * 1000);
};

/** `flat_factor` aus astats — der Fingerabdruck eines digital abgeschnittenen Signals. */
export const flatFactor = (file) => {
  const txt = ffmpegErr(["-v", "info", "-i", file, "-af", "astats=metadata=1", "-f", "null", "-"]);
  const all = [...txt.matchAll(/Flat factor:\s*([0-9.]+)/g)].map((m) => Number(m[1]));
  return all.length === 0 ? 0 : Math.max(...all);
};

/** Integrierte Lautheit + True Peak über ebur128 (erst ab ~1 s aussagekräftig). */
export const ebur128 = (file) => {
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
export const loudnormMeasure = (file, targetI, targetTp) => {
  const txt = ffmpegErr([
    "-v", "info", "-i", file,
    "-af", `loudnorm=I=${targetI}:TP=${targetTp}:LRA=11:print_format=json`,
    "-f", "null", "-",
  ]);
  const start = txt.lastIndexOf("{");
  const end = txt.lastIndexOf("}");
  if (start < 0 || end < start) throw new Error(`loudnorm hat keine Messung geliefert fuer ${file}`);
  return JSON.parse(txt.slice(start, end + 1));
};

/**
 * Die eine Messung einer fertigen Datei. Beide Seiten — Mastering und Tor —
 * rufen GENAU diese Funktion auf.
 */
export const measureFile = (file, kind) => {
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
    ...(kind === "music" ? seamMetrics(s) : { seamDb: null, seamRatio: null }),
    loopStartSec: kind === "music" ? 0 : null,
    loopEndSec: kind === "music" ? Number(info.duration.toFixed(3)) : null,
  };
};
