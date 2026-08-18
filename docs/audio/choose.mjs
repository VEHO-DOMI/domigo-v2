#!/usr/bin/env node
// R5 · S1 · DIE VORWAHL — nach einer aufgeschriebenen Regel, nicht nach Gefühl.
//
// 31 Stems à 6–8 Takes sind über 200 Urteile. Sie fallen hier nach Messwerten
// und Kanon, und JEDES trägt seinen Grund mit — die Hörbank zeigt ihn neben dem
// Abspielknopf, damit Koki nicht raten muss, warum ein Take ein Sternchen hat.
//
// **Diese Wahl ist vorläufig.** Messwerte sind die Vorbedingung, nie der Ersatz:
// Kokis Ohr ist das Tor (R128). Was hier entsteht, ist eine begründete Vorlage,
// keine Entscheidung.
//
// Die Regel, in der Reihenfolge, in der sie greift:
//   1. AUSSCHLUSS — was messbar kaputt ist, kommt gar nicht in die Auswahl:
//      Stille-Schwanz > 80 ms · Lautheit ausserhalb ± 2 · Phasenauslöschung
//      (die fehlt schon in der Musterung, weil master.mjs sie zurückgibt).
//   2. FAMILIEN-FILTER — `neutral` darf nicht fallen (BLUEPRINT `:371`);
//      `positive` soll steigen. Wer das reisst, fliegt raus, nicht ans Ende.
//   3. RANG — innerhalb der Übriggebliebenen nach dem, was die Familie will.
//   4. VIELFALT — braucht ein Stem mehrere Varianten, werden sie so gewählt,
//      dass sie sich im Klangbild UNTERSCHEIDEN; vier identische Schritte sind
//      vier Chancen, dass ein Ohr „Sample" denkt.
//   5. STUFEN — die drei aufsteigenden Familien (`letter-take`, `solve-ok`,
//      `merle-round`) bekommen ihre Varianten nach STEIGENDER Helligkeit
//      geordnet: Stufe 1 dunkel, Stufe 3 hell.
//
// Aufruf: node docs/audio/choose.mjs   → schreibt choices.json + choices.reasons.json

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SURVEY = path.join(ROOT, "docs/audio/survey/survey.json");
const PROMPTS = path.join(ROOT, "docs/audio/prompts.ch01.json");
const CHOICES = path.join(ROOT, "docs/audio/choices.json");
const REASONS = path.join(ROOT, "docs/audio/choices.reasons.json");

const MAX_TAIL_MS = 80;
const SFX_TARGET_RMS = -20;
const SFX_LONG_TARGET_LUFS = -16;
const SFX_TOL = 2;
const MUSIC_TARGET_LUFS = -18;
const MUSIC_TOL = 2;
/** Stems, deren Varianten aufsteigende Stufen sind, keine Alternativen. */
const LADDERS = new Set(["letter-take", "solve-ok", "merle-round"]);

const survey = JSON.parse(fs.readFileSync(SURVEY, "utf8"));
const prompts = JSON.parse(fs.readFileSync(PROMPTS, "utf8"));
const byStem = new Map([...(prompts.sfx ?? []), ...(prompts.music ?? [])].map((i) => [i.stem, i]));

/** alle gemusterten Takes je Stem */
const takes = new Map();
for (const [name, m] of Object.entries(survey)) {
  const stem = name.split("#")[0];
  if (!takes.has(stem)) takes.set(stem, []);
  takes.get(stem).push({ take: m.take, ...m });
}

const meanCentroid = (t) => t.centroidsHz.reduce((a, b) => a + b, 0) / 3;
const rises = (t) => t.centroidsHz[2] > t.centroidsHz[0];
const falls = (t) => t.centroidsHz[2] < t.centroidsHz[0] * 0.9 || (t.centroidsHz[0] > t.centroidsHz[1] && t.centroidsHz[1] > t.centroidsHz[2]);
const flatness = (t) => Math.abs(t.centroidsHz[2] - t.centroidsHz[0]) / Math.max(1, t.centroidsHz[0]);

const choices = {};
const reasons = {};

for (const [stem, all] of [...takes.entries()].sort()) {
  const item = byStem.get(stem);
  if (item === undefined) continue;
  const kind = item.kind ?? (stem.startsWith("music-") ? "music" : "sfx");
  const wantVariants = kind === "music" ? 1 : (item.variants ?? 1);

  // ── 1 · Ausschluss ────────────────────────────────────────────────────────
  const rejected = [];
  let pool = all.filter((t) => {
    if (t.tailSilenceMs > MAX_TAIL_MS) { rejected.push([t.take, `${t.tailSilenceMs} ms Stille am Ende (Grenze ${MAX_TAIL_MS})`]); return false; }
    // Nach dem Instrument vergleichen, mit dem gemessen wurde — unter einer
    // Sekunde RMS, darüber LUFS (EBU R128 braucht 400-ms-Blöcke).
    const [target, tol, unit] = kind === "music"
      ? [MUSIC_TARGET_LUFS, MUSIC_TOL, "LUFS"]
      : t.method === "lufs-i"
        ? [SFX_LONG_TARGET_LUFS, SFX_TOL, "LUFS"]
        : [SFX_TARGET_RMS, SFX_TOL, "dB"];
    if (Math.abs(t.loudnessDb - target) > tol) {
      rejected.push([t.take, `${t.loudnessDb} ${unit} — ausserhalb ${target} ± ${tol}`]);
      return false;
    }
    // Eine Schleife, deren Naht ein Ausreisser gegen die eigene Datei ist,
    // klickt bei jedem Durchlauf — und ein Kind hört sie zwanzigmal je Phase.
    if (kind === "music" && typeof t.seamRatio === "number" && t.seamRatio > 1.5) {
      rejected.push([t.take, `Naht-Verhaeltnis ${t.seamRatio} — die Schleife klickt bei jedem Durchlauf`]);
      return false;
    }
    return true;
  });

  // ── 2 · Familien-Filter ───────────────────────────────────────────────────
  if (item.pedagogy === "neutral") {
    const before = pool.length;
    pool = pool.filter((t) => {
      if (falls(t)) { rejected.push([t.take, `Klangfarbe faellt ${t.centroidsHz[0]} → ${t.centroidsHz[2]} Hz — BLUEPRINT :371 verbietet genau das`]); return false; }
      return true;
    });
    if (pool.length === 0 && before > 0) {
      reasons[stem] = { note: "KEIN Take erfuellt die :371-Regel — neu wuerfeln", rejected };
      continue;
    }
  }

  // ── 3 · Rang ──────────────────────────────────────────────────────────────
  const rank = (t) => {
    if (item.pedagogy === "positive") return rises(t) ? -meanCentroid(t) : 1e9 - meanCentroid(t); // steigend zuerst, dann hell
    if (item.pedagogy === "neutral") return flatness(t);                                          // je flacher, desto besser
    return flatness(t);                                                                            // info: ruhige Kontur
  };
  pool.sort((a, b) => rank(a) - rank(b));

  if (pool.length === 0) { reasons[stem] = { note: "alle Takes ausgeschlossen", rejected }; continue; }

  // ── 4/5 · Varianten wählen ────────────────────────────────────────────────
  let picked;
  let why;
  if (wantVariants <= 1) {
    picked = [pool[0]];
    why = [`einziger bzw. bester Take: ${describe(pool[0], item)}`];
  } else if (LADDERS.has(stem)) {
    // Stufen: die N mit der weitesten Helligkeits-Spanne, dann AUFSTEIGEND sortiert
    const bright = [...pool].sort((a, b) => meanCentroid(a) - meanCentroid(b));
    const step = Math.max(1, Math.floor((bright.length - 1) / (wantVariants - 1)));
    picked = [];
    for (let i = 0; i < wantVariants; i++) picked.push(bright[Math.min(bright.length - 1, i * step)]);
    picked = [...new Set(picked)];
    while (picked.length < wantVariants && bright.length >= wantVariants) {
      picked.push(bright.find((t) => !picked.includes(t)));
    }
    picked.sort((a, b) => meanCentroid(a) - meanCentroid(b));
    why = picked.map((t, i) => `Stufe ${i + 1} von ${wantVariants}: Klangfarbe ⌀ ${Math.round(meanCentroid(t))} Hz — die Stufen steigen`);
  } else {
    // Vielfalt: die N mit den am weitesten auseinanderliegenden Klangbildern
    const bright = [...pool].sort((a, b) => meanCentroid(a) - meanCentroid(b));
    const step = Math.max(1, Math.floor((bright.length - 1) / Math.max(1, wantVariants - 1)));
    picked = [];
    for (let i = 0; i < wantVariants; i++) picked.push(bright[Math.min(bright.length - 1, i * step)]);
    picked = [...new Set(picked)];
    for (const t of bright) { if (picked.length >= wantVariants) break; if (!picked.includes(t)) picked.push(t); }
    why = picked.map((t) => `Variante mit Klangfarbe ⌀ ${Math.round(meanCentroid(t))} Hz — die ${wantVariants} Varianten sollen sich unterscheiden`);
  }

  choices[stem] = picked.length === 1 ? picked[0].take : picked.map((t) => t.take);
  reasons[stem] = {
    picked: picked.map((t, i) => ({ take: t.take, why: why[i], measured: brief(t) })),
    rejected,
    considered: pool.length,
    of: all.length,
  };
}

function describe(t, item) {
  const c = t.centroidsHz;
  const dir = c[2] > c[0] * 1.1 ? "steigend" : c[2] < c[0] * 0.9 ? "fallend" : "gleichbleibend";
  return `${t.durationSec} s, ${t.loudnessDb} ${item.kind === "music" || t.method === "lufs-i" ? "LUFS" : "dB"}, Klangfarbe ${dir} (${c.join(" → ")} Hz)`;
}
function brief(t) {
  return {
    durationSec: t.durationSec, loudnessDb: t.loudnessDb, truePeakDb: t.truePeakDb,
    centroidsHz: t.centroidsHz, tailSilenceMs: t.tailSilenceMs,
    ...(t.seamRatio !== null && t.seamRatio !== undefined ? { seamRatio: t.seamRatio } : {}),
    ...(t.loopNote ? { loopNote: t.loopNote } : {}),
  };
}

fs.writeFileSync(CHOICES, `${JSON.stringify(choices, null, 2)}\n`);
fs.writeFileSync(REASONS, `${JSON.stringify(reasons, null, 2)}\n`);

const missing = [...byStem.keys()].filter((s) => byStem.get(s).reserved !== true && choices[s] === undefined);
console.log(`choose: ${Object.keys(choices).length} Stems vorgewaehlt.`);
for (const [stem, r] of Object.entries(reasons)) {
  if (r.rejected?.length > 0) {
    console.log(`  ${stem}: ${r.considered ?? 0}/${r.of ?? 0} in der Auswahl — zurueck: ${r.rejected.map(([t, w]) => `take-${t} (${w})`).join(" · ")}`);
  }
}
if (missing.length > 0) {
  console.error(`\n✗ ohne Wahl: ${missing.join(", ")}`);
  process.exit(1);
}
