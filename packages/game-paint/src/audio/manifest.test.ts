/**
 * R5 · S1 · MANIFEST GEGEN PLATTE — in BEIDE Richtungen.
 *
 * „Tote Klänge = 0" heisst zweierlei, und nur eine Hälfte davon fällt einem
 * beim Schreiben ein: keine Datei ohne Manifest-Eintrag (Bytes, die niemand
 * lädt) UND kein Manifest-Eintrag ohne Datei (ein Klang, der still ausbleibt).
 * Die zweite Hälfte ist die gefährlichere: sie ist im Spiel nicht zu sehen,
 * nur zu überhören.
 *
 * Dazu die Messungen aus `docs/audio/audio.measured.json` als Test — vor allem
 * die Regel, die dieses Kapitel regiert: ein Klang an einem Fehl-Ereignis fällt
 * nicht (BLUEPRINT `:371`).
 */

import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { AUDIO_FILES } from "./audioFiles.ts";
import { AUDIO_DECODED_MB, AUDIO_DISK_MB, AUDIO_SFX_DISK_MB, decodedBytes } from "./audioBudget.ts";
import { STEMS, audioUrl, filesOf, manifestFiles, stemSpec } from "./audioManifest.ts";

const HERE = path.dirname(new URL(import.meta.url).pathname);
const ROOT = path.resolve(HERE, "../../../..");
const MEASURED = path.join(ROOT, "docs/audio/audio.measured.json");

const measured = (): Record<string, Record<string, unknown>> =>
  JSON.parse(fs.readFileSync(MEASURED, "utf8")).files;

describe("Manifest ↔ Platte", () => {
  it("jede Datei, die das Manifest verspricht, ist gemastert", () => {
    const missing = manifestFiles().map((m) => m.file).filter((f) => AUDIO_FILES[f] === undefined);
    expect(missing, `versprochen, aber nicht gemastert: ${missing.join(", ")}`).toEqual([]);
  });

  it("jede gemasterte Datei gehört zu einem Stem — keine Bytes ohne Auftrag", () => {
    const promised = new Set(manifestFiles().map((m) => m.file));
    const orphans = Object.keys(AUDIO_FILES).filter((f) => !promised.has(f));
    expect(orphans, `gemastert, aber von niemandem beansprucht: ${orphans.join(", ")}`).toEqual([]);
  });

  it("audioFiles.ts und audio.measured.json sagen dasselbe", () => {
    const m = measured();
    for (const [file, info] of Object.entries(AUDIO_FILES)) {
      expect(m[file], `${file} fehlt in audio.measured.json`).toBeDefined();
      expect(info.bytes, `${file}: Bytes`).toBe(m[file]?.bytes);
      expect(info.durationSec, `${file}: Dauer`).toBe(m[file]?.durationSec);
      expect(String(m[file]?.sha1).startsWith(info.v), `${file}: Fingerabdruck`).toBe(true);
    }
  });

  it("jede Adresse trägt den Fingerabdruck ihrer eigenen Datei", () => {
    for (const [file, info] of Object.entries(AUDIO_FILES)) {
      const url = audioUrl(file);
      expect(url).toContain(`/audio/g1/paint/ch01/${info.kind}/${file}.mp3`);
      expect(url).toContain(`?v=${info.v}`);
    }
  });
});

describe("Budgets", () => {
  it("die Platte bleibt unter der Decke — gesamt und für die Effekt-Bank", () => {
    const MB = 1024 * 1024;
    let total = 0;
    let sfx = 0;
    for (const [, info] of Object.entries(AUDIO_FILES)) {
      total += info.bytes;
      if (info.kind === "sfx") sfx += info.bytes;
    }
    expect(total / MB, `Audio gesamt ${(total / MB).toFixed(2)} MB`).toBeLessThanOrEqual(AUDIO_DISK_MB);
    expect(sfx / MB, `Effekte ${(sfx / MB).toFixed(2)} MB`).toBeLessThanOrEqual(AUDIO_SFX_DISK_MB);
  });

  it("decodiert bleibt die Spitze unter 16 MB: ganze Bank plus EINE Phase", () => {
    const MB = 1024 * 1024;
    const bank = Object.entries(AUDIO_FILES)
      .filter(([, i]) => i.kind === "sfx")
      .reduce((a, [, i]) => a + decodedBytes(i.durationSec), 0);
    const worstMusic = Object.entries(AUDIO_FILES)
      .filter(([, i]) => i.kind === "music")
      .reduce((a, [, i]) => Math.max(a, decodedBytes(i.durationSec)), 0);
    const peak = (bank + worstMusic) / MB;
    expect(peak, `Spitze ${peak.toFixed(2)} MB (Bank ${(bank / MB).toFixed(2)} + grösste Phase ${(worstMusic / MB).toFixed(2)})`)
      .toBeLessThanOrEqual(AUDIO_DECODED_MB);
  });
});

describe("die Regel :371 als Messung", () => {
  const neutral = STEMS.filter((s) => s.pedagogy === "neutral");

  it("es gibt überhaupt neutrale Stems (sonst prüft der Rest nichts)", () => {
    expect(neutral.length).toBeGreaterThanOrEqual(4);
  });

  it("kein neutraler Klang fällt: c3 ≥ 0,9·c1 und kein durchgehendes Absinken", () => {
    const m = measured();
    for (const spec of neutral) {
      for (const file of filesOf(spec)) {
        const row = m[file];
        if (row === undefined) continue; // die andere Prüfung meldet das
        const [c1, c2, c3] = row.centroidsHz as [number, number, number];
        expect(c3, `${file}: Schwerpunkt fällt von ${c1} auf ${c3} Hz`).toBeGreaterThanOrEqual(c1 * 0.9);
        expect(c1 > c2 && c2 > c3, `${file}: durchgehendes Absinken ${c1} → ${c2} → ${c3} Hz`).toBe(false);
      }
    }
  });

  it("kein neutraler Klang dauert länger als 0,4 s", () => {
    for (const spec of neutral) expect(spec.durationSec, spec.stem).toBeLessThanOrEqual(0.4);
  });

  it("kein neutraler Klang ist lauter als die positive Familie plus 2 LU", () => {
    const m = measured();
    const loud = (stems: typeof STEMS): number[] => stems
      .flatMap((s) => filesOf(s))
      .map((f) => m[f]?.loudnessDb)
      .filter((x): x is number => typeof x === "number");
    const positives = loud(STEMS.filter((s) => s.pedagogy === "positive"));
    if (positives.length === 0) return; // vor der Serie noch nichts zu vergleichen
    const mean = positives.reduce((a, b) => a + b, 0) / positives.length;
    for (const v of loud(neutral)) expect(v, `neutral ${v} dB gegen positiv ⌀ ${mean.toFixed(1)} dB`).toBeLessThanOrEqual(mean + 2);
  });
});

describe("Musik", () => {
  it("die Datei IST die Schleife: loopStart 0, loopEnd = Dauer", () => {
    const m = measured();
    for (const spec of STEMS.filter((s) => s.bus === "music")) {
      const row = m[spec.stem];
      if (row === undefined) continue;
      if (row.loopStartSec === null) continue; // Auftakt und Sieg laufen einmal
      expect(row.loopStartSec).toBe(0);
      expect(row.loopEndSec).toBe(row.durationSec);
    }
  });

  it("die Naht ist kein Ausreisser gegen die Datei selbst", () => {
    const m = measured();
    for (const spec of STEMS.filter((s) => s.bus === "music")) {
      const row = m[spec.stem];
      if (row === undefined || row.seamRatio === null || row.seamRatio === undefined) continue;
      expect(row.seamRatio as number, `${spec.stem}: Naht-Verhältnis`).toBeLessThanOrEqual(1.5);
    }
  });
});

describe("Manifest-Form", () => {
  it("jeder Stem hat eine Dauer, mindestens eine Variante und einen bekannten Bus", () => {
    for (const s of STEMS) {
      expect(s.durationSec, s.stem).toBeGreaterThan(0);
      expect(s.variants, s.stem).toBeGreaterThanOrEqual(1);
      expect(["sfx", "music"], s.stem).toContain(s.bus);
    }
  });

  it("kein Stem-Name kommt zweimal vor", () => {
    const names = STEMS.map((s) => s.stem);
    expect(new Set(names).size).toBe(names.length);
  });

  it("stemSpec findet, was das Manifest verspricht, und sonst nichts", () => {
    expect(stemSpec("step-paper")?.family).toBe("foot");
    expect(stemSpec("gibt-es-nicht")).toBeUndefined();
  });
});
