#!/usr/bin/env node
// R5 · S1 · DAS KLANG-TOR.
//
// Klang hat eine unangenehme Eigenschaft: er ist im Repository unsichtbar. Ein
// stilles Blatt, ein übersteuerter Effekt, eine Schleife, die bei jedem
// Durchlauf klickt — nichts davon sieht man in einem Diff, und keiner der
// bestehenden Wächter hat je eine MP3 geöffnet. Also wird gemessen.
//
// Neun Gesetze, jedes einzeln rot:
//   1. Kanon ↔ Prompts ↔ Manifest ↔ Platte nennen dieselben Stems
//   2. jede versprochene Datei liegt da — und keine Datei ohne Auftrag
//   3. sha1 exakt gegen audio.measured.json UND gegen audioFiles.ts
//   4. Bytes: gesamt · Effekt-Bank · je Musikstück · decodierte Spitze
//   5. Dauer im Familienfenster
//   6. Lautheit im Fenster, True Peak unter der Decke
//   7. kein stilles Blatt, kein abgeschnittenes Signal, kein Stille-Schwanz
//   8. BLUEPRINT `:371`: ein neutraler Klang FÄLLT NICHT
//   9. Schleifen-Naht kein Ausreisser · Toast-Bindungen passen noch auf sim.ts
//   + die zwei PERF_WAECHTER-Zeilen stehen im Aushang
//
// ── Warum mit Toleranz und nicht auf Gleichheit ────────────────────────────
// Der sha1 wird EXAKT verglichen — er sagt, ob es dieselbe Datei ist. Die
// Signalwerte werden mit Toleranz verglichen, weil CI auf `ubuntu-latest` ein
// anderes ffmpeg fährt als der Mac, auf dem gemastert wurde, und `ebur128` in
// der letzten Nachkommastelle abweicht. Ein Tor, das daran flackert, wird
// abgeschaltet und schützt dann gar nichts.
//
// ── Der Selbsttest tampert gegen den MESSWERT (P-71) ───────────────────────
// Er verstellt keine Konfiguration, sondern ERZEUGT fünf echte Klangdateien mit
// je einem echten Defekt und schickt sie durch dieselbe Messstrecke. Und er
// prüft die andere Hälfte mit: eine AUFSTEIGENDE Datei muss GRÜN bleiben. Ein
// Tor, das bei allem anschlägt, hat nichts bewiesen — genau daran wäre die
// erste Fassung der `:371`-Regel gestorben, deren Ungleichung verkehrt herum
// stand und jedes Fallen durchliess.
//
// Run: node scripts/check-audio.mjs            (exit 1 bei jedem Verstoss)
//      node scripts/check-audio.mjs --selftest (fünf rote Lichter, eines grün)

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { measureFile } from "../docs/audio/measure.mjs";

const R = process.cwd();
const SPINE = path.join(R, "docs/design/g1/paint/AUDIO_SPINE_CH01.md");
const PROMPTS = path.join(R, "docs/audio/prompts.ch01.json");
const MEASURED = path.join(R, "docs/audio/audio.measured.json");
const FILES_TS = path.join(R, "packages/game-paint/src/audio/audioFiles.ts");
const MANIFEST_TS = path.join(R, "packages/game-paint/src/audio/audioManifest.ts");
const SIM_TS = path.join(R, "packages/game-paint/src/sim.ts");
const AUDIO_ROOT = path.join(R, "apps/web/public/audio/g1/paint/ch01");
const GUARD_DOC = path.join(R, "docs/PERF_WAECHTER.md");

const MB = 1024 * 1024;

// ── Grenzwerte (Kanon: AUDIO_SPINE §4, Budgets: audioBudget.ts) ──────────────
const LIMITS = {
  diskMb: 6,
  sfxDiskMb: 1.5,
  musicPhaseMb: 1,
  decodedMb: 16,
  musicLufs: -18, musicLufsTol: 2,
  sfxRmsDb: -20, sfxRmsTol: 2,
  truePeakDb: -1, truePeakTol: 0.2,
  durationTol: 0.3,          // ±30 % um das Zielfenster
  musicDurationTolSec: 20,   // die Schleifenlänge wird gemessen, nicht bestellt
  minRmsDb: -40,             // darunter ist es ein stilles Blatt
  minPeakDb: -20,
  maxFlatFactor: 0,
  maxTailSilenceMs: 80,
  maxSeamRatio: 1.5,
  neutralMaxSec: 0.4,
  neutralFallTol: 0.9,       // c3 ≥ 0,9 · c1 — der Klang darf nicht fallen
  neutralLouderThanPositiveLu: 2,
  // Vergleich gemessen ↔ gespeichert
  cmpLoudness: 0.5, cmpTruePeak: 0.2, cmpCentroidRel: 0.05, cmpDurationSec: 0.02,
};

const selftest = process.argv.includes("--selftest");
let failures = 0;
const reported = [];
const fail = (law, msg) => {
  failures++;
  reported.push({ law, msg });
  console.error(`✗ [${law}] ${msg}`);
};

// ── Das Manifest lesen, ohne TypeScript auszuführen ──────────────────────────
// Das Tor läuft als plain Node. Statt eine TS-Laufzeit zu verlangen, werden die
// drei Angaben, die es braucht, aus dem Quelltext gelesen — und wenn sich die
// Form ändert, MELDET es das, statt still nichts zu finden.
const readManifestStems = () => {
  const src = fs.readFileSync(MANIFEST_TS, "utf8");
  const rows = [...src.matchAll(
    /\{\s*stem:\s*"([a-z0-9-]+)",\s*family:\s*"([a-z]+)",\s*pedagogy:\s*"([a-z]+)",\s*bus:\s*"([a-z]+)",\s*durationSec:\s*([0-9.]+),\s*variants:\s*(\d+),\s*tap:\s*"([a-z]+)"/g,
  )].map((m) => ({
    stem: m[1], family: m[2], pedagogy: m[3], bus: m[4],
    durationSec: Number(m[5]), variants: Number(m[6]), tap: m[7],
  }));
  if (rows.length === 0) throw new Error("audioManifest.ts: keine STEMS-Zeile erkannt — die Form hat sich geaendert, das Tor muesste angepasst werden");
  return rows;
};

const readAudioFilesTs = () => {
  const src = fs.readFileSync(FILES_TS, "utf8");
  const out = {};
  for (const m of src.matchAll(/"([a-z0-9-]+)":\s*\{\s*v:\s*"([0-9a-f]+)",\s*bytes:\s*(\d+),\s*durationSec:\s*([0-9.]+),\s*kind:\s*"(music|sfx)"/g)) {
    out[m[1]] = { v: m[2], bytes: Number(m[3]), durationSec: Number(m[4]), kind: m[5] };
  }
  return out;
};

const readToastMatches = () => {
  const src = fs.readFileSync(MANIFEST_TS, "utf8");
  return [...src.matchAll(/\{\s*stem:\s*"([a-z0-9-]+)",\s*pattern:\s*\/(.+?)\/\s*\}/g)]
    .map((m) => ({ stem: m[1], pattern: m[2] }));
};

const filesOf = (spec) =>
  spec.variants <= 1 ? [spec.stem] : Array.from({ length: spec.variants }, (_, i) => `${spec.stem}-${i + 1}`);

const filePath = (file, kind) => path.join(AUDIO_ROOT, kind, `${file}.mp3`);

// ── SELBSTTEST ───────────────────────────────────────────────────────────────
// Fünf echte Defekte, eine echte Kontrolle. Erzeugt mit ffmpeg, gemessen mit
// DERSELBEN Messstrecke wie die echten Dateien.
if (selftest) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "domigo-audio-selftest-"));
  const mk = (name, args) => {
    const out = path.join(dir, `${name}.mp3`);
    execFileSync("ffmpeg", ["-hide_banner", "-v", "error", "-y", ...args, "-c:a", "libmp3lame", "-b:a", "96k", "-ac", "1", "-ar", "44100", out]);
    return out;
  };

  const cases = [];

  // 1 · STILLE — eine Datei, in der nichts ist. Der Fehler, den niemand hört.
  cases.push({
    name: "Stille",
    file: mk("silence", ["-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono", "-t", "0.4"]),
    kind: "sfx",
    expect: (m) => m.rmsDb <= LIMITS.minRmsDb || m.peakDb <= LIMITS.minPeakDb,
    law: "kein stilles Blatt",
  });

  // 2 · CLIPPING — voll ausgesteuert und digital abgeschnitten.
  cases.push({
    name: "Clipping",
    file: mk("clipped", ["-f", "lavfi", "-i", "sine=frequency=440:r=44100:d=0.5", "-af", "volume=20dB"]),
    kind: "sfx",
    expect: (m) => m.truePeakDb > LIMITS.truePeakDb + LIMITS.truePeakTol || m.flatFactor > LIMITS.maxFlatFactor,
    law: "True Peak / flat_factor",
  });

  // 3 · FALSCHE LAUTHEIT — viel zu leise für sein Fenster.
  cases.push({
    name: "falsche Lautheit",
    file: mk("quiet", ["-f", "lavfi", "-i", "sine=frequency=440:r=44100:d=0.5", "-af", "volume=-45dB"]),
    kind: "sfx",
    expect: (m) => Math.abs(m.rmsDb - LIMITS.sfxRmsDb) > LIMITS.sfxRmsTol,
    law: "Lautheit im Fenster",
  });

  // 4 · GEBROCHENE SCHLEIFE — hart geschnitten, ohne Crossfade: der letzte
  //     Abtastwert steht weit vom ersten weg, und der Sprung ist ein Ausreisser
  //     gegen die eigenen Sprünge der Datei.
  cases.push({
    name: "gebrochene Schleife",
    file: mk("badloop", ["-f", "lavfi", "-i", "sine=frequency=110:r=44100:d=2.005"]),
    kind: "music",
    expect: (m) => (m.seamRatio ?? 0) > LIMITS.maxSeamRatio,
    law: "Schleifen-Naht",
  });

  // 5 · ABSTEIGENDER KLANG — der Fall, für den BLUEPRINT `:371` existiert. Ein
  //     Sweep von 4000 auf 300 Hz: genau das „descending audio", das ein Kind
  //     als Urteil hört. MUSS rot werden.
  cases.push({
    name: "absteigender Klang",
    file: mk("down", ["-f", "lavfi", "-i", "aevalsrc=0.5*sin(2*PI*t*(4000-4625*t)):s=44100:d=0.4"]),
    kind: "sfx",
    expect: (m) => {
      const [c1, c2, c3] = m.centroidsHz;
      return c3 < c1 * LIMITS.neutralFallTol || (c1 > c2 && c2 > c3);
    },
    law: "`:371` — kein Absteigen",
  });

  // KONTROLLE · AUFSTEIGENDER KLANG — muss GRÜN bleiben. Ohne diese Hälfte
  //     wäre ein Tor, das bei jedem Klang anschlägt, ununterscheidbar von einem,
  //     das funktioniert.
  const control = {
    name: "aufsteigender Klang (Kontrolle)",
    file: mk("up", ["-f", "lavfi", "-i", "aevalsrc=0.5*sin(2*PI*t*(300+4625*t)):s=44100:d=0.4"]),
    kind: "sfx",
    law: "`:371` — kein Absteigen",
  };

  let ok = true;
  for (const c of cases) {
    const m = measureFile(c.file, c.kind);
    const fired = c.expect(m);
    if (!fired) {
      console.error(`✗ SELBSTTEST: »${c.name}« ist ein echter Defekt und das Gesetz „${c.law}" hat geschwiegen `
        + `(gemessen: RMS ${m.rmsDb} dB, Peak ${m.peakDb} dB, TP ${m.truePeakDb} dB, flat ${m.flatFactor}, `
        + `Zentroide ${m.centroidsHz.join("/")}, Naht ${m.seamRatio})`);
      ok = false;
    } else {
      console.log(`  ✓ »${c.name}« → rotes Licht bei „${c.law}"`);
    }
  }

  const cm = measureFile(control.file, control.kind);
  const [c1, c2, c3] = cm.centroidsHz;
  const controlFired = c3 < c1 * LIMITS.neutralFallTol || (c1 > c2 && c2 > c3);
  if (controlFired) {
    console.error(`✗ SELBSTTEST: die Kontrolle »${control.name}« STEIGT und wurde trotzdem beanstandet `
      + `(Zentroide ${cm.centroidsHz.join(" → ")}) — ein Tor, das bei allem anschlaegt, beweist nichts`);
    ok = false;
  } else {
    console.log(`  ✓ »${control.name}« → bleibt gruen (Zentroide ${cm.centroidsHz.join(" → ")})`);
  }

  fs.rmSync(dir, { recursive: true, force: true });
  if (ok) {
    console.log(`check-audio SELBSTTEST: OK — fuenf rote Lichter brennen, die Kontrolle bleibt gruen.`);
    process.exit(0);
  }
  process.exit(1);
}

// ── ECHTER LAUF ──────────────────────────────────────────────────────────────

const stems = readManifestStems();
const filesTs = readAudioFilesTs();
const measuredDoc = JSON.parse(fs.readFileSync(MEASURED, "utf8")).files;
const prompts = JSON.parse(fs.readFileSync(PROMPTS, "utf8"));
const spine = fs.readFileSync(SPINE, "utf8");

// ── Gesetz 1 · Kanon ↔ Prompts ↔ Manifest ───────────────────────────────────
{
  const promptStems = new Set([...(prompts.sfx ?? []), ...(prompts.music ?? [])]
    .filter((i) => i.reserved !== true).map((i) => i.stem));
  const manifestStems = new Set(stems.map((s) => s.stem));

  for (const s of manifestStems) {
    if (!promptStems.has(s)) fail("Kanon", `\`${s}\` steht im Manifest, aber nicht (unreserviert) in prompts.ch01.json`);
    if (!spine.includes(`\`${s}\``)) fail("Kanon", `\`${s}\` steht im Manifest, wird aber im AUDIO_SPINE nirgends genannt`);
  }
  for (const s of promptStems) {
    if (!manifestStems.has(s)) fail("Kanon", `\`${s}\` steht in prompts.ch01.json, aber nicht im Manifest`);
  }
}

// ── Gesetz 2 + 3 · Platte, Fingerabdrücke ───────────────────────────────────
const promised = [];
for (const spec of stems) {
  const kind = spec.bus === "music" ? "music" : "sfx";
  for (const file of filesOf(spec)) promised.push({ file, kind, spec });
}

const onDisk = new Set();
for (const kind of ["music", "sfx"]) {
  const dir = path.join(AUDIO_ROOT, kind);
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir)) if (f.endsWith(".mp3")) onDisk.add(f.replace(/\.mp3$/, ""));
}

const promisedNames = new Set(promised.map((p) => p.file));
for (const f of onDisk) {
  if (!promisedNames.has(f)) fail("tote Klaenge", `${f}.mp3 liegt auf der Platte, aber kein Stem beansprucht sie — Decke ist 0`);
}

// ── Gesetze 4–9 je Datei ────────────────────────────────────────────────────
let totalBytes = 0;
let sfxBytes = 0;
let bankDecoded = 0;
let worstMusicDecoded = 0;
const loudnessByPedagogy = { positive: [], neutral: [], info: [] };
const haveFfmpeg = (() => {
  try { execFileSync("ffprobe", ["-version"], { stdio: "ignore" }); return true; } catch { return false; }
})();

for (const { file, kind, spec } of promised) {
  const abs = filePath(file, kind);
  if (!fs.existsSync(abs)) {
    fail("Platte", `\`${spec.stem}\` verspricht ${path.relative(R, abs)} — die Datei fehlt`);
    continue;
  }
  const stored = measuredDoc[file];
  if (stored === undefined) {
    fail("Messdatei", `${file} ist gemastert, steht aber nicht in audio.measured.json`);
    continue;
  }
  const ts = filesTs[file];
  if (ts === undefined) {
    fail("Messdatei", `${file} steht nicht in audioFiles.ts — audioUrl() wuerde ohne Fingerabdruck ausliefern`);
  }

  // Gesetz 3 · sha1 EXAKT — er sagt, ob es dieselbe Datei ist
  const sha = crypto.createHash("sha1").update(fs.readFileSync(abs)).digest("hex");
  if (sha !== stored.sha1) {
    fail("Fingerabdruck", `${file}: die Datei auf der Platte ist nicht die gemessene (sha1 ${sha.slice(0, 8)} ≠ ${String(stored.sha1).slice(0, 8)}) — \`node docs/audio/master.mjs --measure\``);
  }
  if (ts !== undefined && !sha.startsWith(ts.v)) {
    fail("Fingerabdruck", `${file}: audioFiles.ts traegt v=${ts.v}, die Datei hat ${sha.slice(0, 8)} — der Cache-Schluessel zeigt auf eine andere Datei`);
  }

  const bytes = fs.statSync(abs).size;
  totalBytes += bytes;
  if (kind === "sfx") { sfxBytes += bytes; bankDecoded += stored.durationSec * 48_000 * 4; }
  else {
    worstMusicDecoded = Math.max(worstMusicDecoded, stored.durationSec * 48_000 * 4);
    if (bytes / MB > LIMITS.musicPhaseMb) fail("Budget", `${file}: ${(bytes / MB).toFixed(2)} MB ueber der Decke von ${LIMITS.musicPhaseMb} MB je Phase`);
  }

  // Gesetz 5 · Dauer im Fenster
  const wantSec = spec.durationSec;
  const okDuration = kind === "music"
    ? Math.abs(stored.durationSec - wantSec) <= LIMITS.musicDurationTolSec
    : Math.abs(stored.durationSec - wantSec) <= wantSec * LIMITS.durationTol + 0.05;
  if (!okDuration) fail("Dauer", `${file}: ${stored.durationSec} s, erwartet ${wantSec} s ± ${kind === "music" ? `${LIMITS.musicDurationTolSec} s` : `${Math.round(LIMITS.durationTol * 100)} %`}`);

  // Gesetz 6 · Lautheit und True Peak
  if (kind === "music") {
    if (Math.abs(stored.loudnessDb - LIMITS.musicLufs) > LIMITS.musicLufsTol) {
      fail("Lautheit", `${file}: ${stored.loudnessDb} LUFS, Fenster ${LIMITS.musicLufs} ± ${LIMITS.musicLufsTol} LU`);
    }
  } else if (Math.abs(stored.loudnessDb - LIMITS.sfxRmsDb) > LIMITS.sfxRmsTol) {
    fail("Lautheit", `${file}: ${stored.loudnessDb} dB RMS, Fenster ${LIMITS.sfxRmsDb} ± ${LIMITS.sfxRmsTol} dB`);
  }
  if (stored.truePeakDb > LIMITS.truePeakDb + LIMITS.truePeakTol) {
    fail("True Peak", `${file}: ${stored.truePeakDb} dBTP ueber der Decke von ${LIMITS.truePeakDb} dBTP`);
  }

  // Gesetz 7 · kein stilles Blatt, kein abgeschnittenes Signal, kein Schwanz
  if (stored.rmsDb <= LIMITS.minRmsDb || stored.peakDb <= LIMITS.minPeakDb) {
    fail("stilles Blatt", `${file}: RMS ${stored.rmsDb} dB / Peak ${stored.peakDb} dB — da ist nichts drin`);
  }
  if (stored.flatFactor > LIMITS.maxFlatFactor) {
    fail("Clipping", `${file}: flat_factor ${stored.flatFactor} — digital abgeschnitten`);
  }
  if (stored.tailSilenceMs > LIMITS.maxTailSilenceMs) {
    fail("Stille-Schwanz", `${file}: ${stored.tailSilenceMs} ms Stille am Ende (Grenze ${LIMITS.maxTailSilenceMs} ms) — das fuehlt sich wie Latenz an`);
  }

  // Gesetz 8 · BLUEPRINT `:371`
  if (spec.pedagogy === "neutral") {
    const [c1, c2, c3] = stored.centroidsHz;
    if (c3 < c1 * LIMITS.neutralFallTol) {
      fail(":371", `${file}: der Klang FAELLT (Schwerpunkt ${c1} → ${c3} Hz). „wrong = a soft neutral thud … never descending audio"`);
    }
    if (c1 > c2 && c2 > c3) {
      fail(":371", `${file}: durchgehendes Absinken ${c1} → ${c2} → ${c3} Hz`);
    }
    if (stored.durationSec > LIMITS.neutralMaxSec + 0.05) {
      fail(":371", `${file}: ${stored.durationSec} s — ein neutraler Klang bleibt unter ${LIMITS.neutralMaxSec} s`);
    }
  }
  loudnessByPedagogy[spec.pedagogy]?.push(stored.loudnessDb);

  // Gesetz 9 · Schleifen-Naht
  if (kind === "music" && stored.seamRatio !== null && stored.seamRatio !== undefined) {
    if (stored.seamRatio > LIMITS.maxSeamRatio) {
      fail("Naht", `${file}: Naht-Verhaeltnis ${stored.seamRatio} (Grenze ${LIMITS.maxSeamRatio}) — die Schleife klickt`);
    }
    if (stored.loopStartSec !== 0 || Math.abs(stored.loopEndSec - stored.durationSec) > 0.01) {
      fail("Naht", `${file}: die Datei soll SELBST die Schleife sein (loopStart 0, loopEnd = Dauer), steht aber auf ${stored.loopStartSec}/${stored.loopEndSec}`);
    }
  }

  // Nachmessen, wo ffmpeg da ist — sonst prüft das Tor nur seine eigene Buchhaltung
  if (haveFfmpeg) {
    const now = measureFile(abs, kind);
    const cmp = [
      ["Lautheit", now.loudnessDb, stored.loudnessDb, LIMITS.cmpLoudness],
      ["True Peak", now.truePeakDb, stored.truePeakDb, LIMITS.cmpTruePeak],
      ["Dauer", now.durationSec, stored.durationSec, LIMITS.cmpDurationSec],
    ];
    for (const [what, a, b, tol] of cmp) {
      if (typeof a === "number" && typeof b === "number" && Math.abs(a - b) > tol) {
        fail("Messdatei", `${file}: ${what} gemessen ${a}, gespeichert ${b} (Toleranz ${tol}) — audio.measured.json ist veraltet`);
      }
    }
    for (let i = 0; i < 3; i++) {
      const a = now.centroidsHz[i]; const b = stored.centroidsHz[i];
      if (b > 0 && Math.abs(a - b) / b > LIMITS.cmpCentroidRel) {
        fail("Messdatei", `${file}: Zentroid ${i + 1} gemessen ${a} Hz, gespeichert ${b} Hz (>${Math.round(LIMITS.cmpCentroidRel * 100)} %)`);
      }
    }
  }
}

// ── Gesetz 4 · die Summen ───────────────────────────────────────────────────
if (totalBytes / MB > LIMITS.diskMb) fail("Budget", `Audio gesamt ${(totalBytes / MB).toFixed(2)} MB ueber der Decke von ${LIMITS.diskMb} MB`);
if (sfxBytes / MB > LIMITS.sfxDiskMb) fail("Budget", `Effekt-Bank ${(sfxBytes / MB).toFixed(2)} MB ueber der Decke von ${LIMITS.sfxDiskMb} MB`);
const peakDecoded = (bankDecoded + worstMusicDecoded) / MB;
if (peakDecoded > LIMITS.decodedMb) {
  fail("Budget", `decodierte Spitze ${peakDecoded.toFixed(2)} MB ueber der Decke von ${LIMITS.decodedMb} MB `
    + `(Bank ${(bankDecoded / MB).toFixed(2)} + groesste Phase ${(worstMusicDecoded / MB).toFixed(2)})`);
}

// ── Gesetz 8b · neutral nie lauter als die positive Familie ─────────────────
if (loudnessByPedagogy.positive.length > 0 && loudnessByPedagogy.neutral.length > 0) {
  const mean = loudnessByPedagogy.positive.reduce((a, b) => a + b, 0) / loudnessByPedagogy.positive.length;
  const loudest = Math.max(...loudnessByPedagogy.neutral);
  if (loudest > mean + LIMITS.neutralLouderThanPositiveLu) {
    fail(":371", `der lauteste neutrale Klang liegt bei ${loudest.toFixed(1)} dB, die positive Familie im Mittel bei ${mean.toFixed(1)} dB — ein Fehlklang stellt sich nie ueber das Lob`);
  }
}

// ── Gesetz 9b · die Toast-Bindungen passen noch auf sim.ts ──────────────────
{
  const sim = fs.readFileSync(SIM_TS, "utf8");
  const literals = [...sim.matchAll(/msg:\s*(?:`([^`]*)`|"([^"]*)")/g)].map((m) => m[1] ?? m[2] ?? "");
  for (const { stem, pattern } of readToastMatches()) {
    let re;
    try { re = new RegExp(pattern); } catch { fail("Toast-Bindung", `\`${stem}\`: /${pattern}/ ist kein gueltiger Ausdruck`); continue; }
    if (!literals.some((l) => re.test(l))) {
      fail("Toast-Bindung", `\`${stem}\`: /${pattern}/ passt auf KEINE Toast-Zeile in sim.ts mehr. `
        + `Wurde die Copy umformuliert? Dann waere der Klang still verschwunden — deshalb steht hier ein rotes Licht.`);
    }
  }
}

// ── Der Aushang trägt die zwei Zeilen ───────────────────────────────────────
{
  const doc = fs.readFileSync(GUARD_DOC, "utf8");
  for (const [what, n] of [["Platte", LIMITS.diskMb], ["decodiert", LIMITS.decodedMb]]) {
    if (!new RegExp(`≤\\s*${n}\\s*MB`).test(doc)) {
      fail("Aushang", `docs/PERF_WAECHTER.md nennt „≤ ${n} MB" (Audio ${what}) nicht als Grenzwert — Dokument und Tor sagen Verschiedenes`);
    }
  }
}

// ── Bilanz ───────────────────────────────────────────────────────────────────
console.log(
  `check-audio: ${promised.length} Dateien · ${(totalBytes / MB).toFixed(2)} MB auf der Platte `
  + `(Effekte ${(sfxBytes / MB).toFixed(2)} MB) · decodierte Spitze ${peakDecoded.toFixed(2)} MB `
  + `von ${LIMITS.decodedMb} MB · ffmpeg ${haveFfmpeg ? "vorhanden, nachgemessen" : "FEHLT — nur Buchhaltung geprueft"}`,
);
if (failures > 0) {
  console.error(`\ncheck-audio: ${failures} Verstoss/Verstoesse.`);
  process.exit(1);
}
console.log("check-audio: OK");
