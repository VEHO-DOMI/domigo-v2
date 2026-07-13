/**
 * @domigo/game-feel — pure core (no React, no DOM). The juice kit's data +
 * math: the settings model, the SFX recipe table, seeded randomness for
 * deterministic celebration (Law 9: no Math.random anywhere in game surfaces),
 * and the word-diff used by the G3 script desk's teaching contrast.
 *
 * Design laws this package encodes (BLUEPRINT Part VII.0):
 *  - sound + haptics are OPT-IN, default OFF (classroom reality);
 *  - OS prefers-reduced-motion ALWAYS wins — the user toggle only reduces
 *    further (there is deliberately no "force motion on" state);
 *  - the wrong-answer sound is a neutral low "thud" — no buzzer and no
 *    descending "sad" pattern exists in the bank (Law 3 as tone);
 *  - correct/partial/close are DIFFERENT ascending chimes: the tier is audible.
 */

// ---------------------------------------------------------------------------
// settings
// ---------------------------------------------------------------------------

export interface FeelSettings {
  sound: boolean;
  haptics: boolean;
  /** "auto" = follow the OS; "reduce" = force-reduce even if the OS allows motion. */
  motion: "auto" | "reduce";
  /** L-1 story language: "auto" = grade decides (grade 1 → German-first). */
  lang: "auto" | LangMode;
}

export const DEFAULT_SETTINGS: FeelSettings = { sound: false, haptics: false, motion: "auto", lang: "auto" };

/** Parse a persisted settings blob defensively (never throw on junk). */
export function parseSettings(raw: string | null): FeelSettings {
  if (raw === null) return DEFAULT_SETTINGS;
  try {
    const p = JSON.parse(raw) as Partial<FeelSettings>;
    return {
      sound: p.sound === true,
      haptics: p.haptics === true,
      motion: p.motion === "reduce" ? "reduce" : "auto",
      lang: p.lang === "de-first" || p.lang === "en-first" ? p.lang : "auto",
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

// ---------------------------------------------------------------------------
// L-1 · story language mode (Koki 2026-07-10: German-first for the youngest —
// meaning first, English on demand; the device toggle always wins)
// ---------------------------------------------------------------------------

/** Which language leads the story dialogue. Graded tasks are NEVER affected. */
export type LangMode = "de-first" | "en-first";

/** "auto" resolves by grade: grade 1 reads German-first, everyone else English-first. */
export function resolveLangMode(lang: FeelSettings["lang"], grade: number): LangMode {
  if (lang === "de-first" || lang === "en-first") return lang;
  return grade === 1 ? "de-first" : "en-first";
}

/** The line the student reads first. de-first falls back to English when a
 *  scene has no German scaffold — never a blank bubble. */
export function primaryLine(mode: LangMode, textEn: string, scaffoldDe: string | null | undefined): string {
  return mode === "de-first" ? (scaffoldDe ?? textEn) : textEn;
}

/** The other language, behind the reveal chip; null when there is nothing to reveal. */
export function secondaryLine(mode: LangMode, textEn: string, scaffoldDe: string | null | undefined): string | null {
  if (mode === "de-first") return scaffoldDe ? textEn : null;
  return scaffoldDe ?? null;
}

/** Chip labels for the secondary-language reveal (the established "Auf Deutsch?" affordance, mirrored). */
export function revealLabels(mode: LangMode): { show: string; hide: string } {
  return mode === "de-first"
    ? { show: "Auf Englisch?", hide: "Englisch ausblenden" }
    : { show: "Auf Deutsch?", hide: "Deutsch ausblenden" };
}

/** Word-help chip labels follow the leading language. */
export function glossLabels(mode: LangMode): { show: string; hide: string } {
  return mode === "de-first"
    ? { show: "Wort-Hilfe zeigen", hide: "Wort-Hilfe ausblenden" }
    : { show: "Show word help", hide: "Hide word help" };
}

/** The one motion rule: OS reduce always wins; our toggle can only reduce further. */
export function motionOK(settings: FeelSettings, osReduced: boolean): boolean {
  return settings.motion !== "reduce" && !osReduced;
}

// ---------------------------------------------------------------------------
// seeded randomness (FNV-1a + mulberry32 — the repo-wide determinism pair)
// ---------------------------------------------------------------------------

export function fnv1a32(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** One confetti particle's trajectory, deterministic per (seed, index). */
export interface ConfettiPiece {
  /** Horizontal drift in % of the container width (-40..40). */
  dx: number;
  /** Total rotation in degrees (-260..260). */
  rot: number;
  /** Animation delay in ms (0..120). */
  delay: number;
  /** Palette slot 0..2 (mapped to accent/correct/partial tokens by the renderer). */
  hue: 0 | 1 | 2;
}

export function confettiPieces(seed: string, count: number): ConfettiPiece[] {
  const rng = mulberry32(fnv1a32(seed));
  const out: ConfettiPiece[] = [];
  for (let i = 0; i < count; i++) {
    out.push({
      dx: Math.round((rng() - 0.5) * 80),
      rot: Math.round((rng() - 0.5) * 520),
      delay: Math.round(rng() * 120),
      hue: Math.floor(rng() * 3) as 0 | 1 | 2,
    });
  }
  return out;
}

// ---------------------------------------------------------------------------
// SFX recipes (interpreted by the WebAudio synth in index.tsx)
// ---------------------------------------------------------------------------

export type SfxName =
  | "pop"
  | "tick"
  | "thud"
  | "whoosh"
  | "chime-close"
  | "chime-partial"
  | "chime-correct"
  | "stamp"
  | "streak"
  | "ink-swirl"
  | "spark-burst"
  | "letters-return"
  | "smudge-pop";

export interface ToneStep {
  /** Oscillator frequency in Hz at note start (ramps to `to` when set). */
  freq: number;
  to?: number;
  /** Start offset within the recipe, ms. */
  at: number;
  /** Note duration, ms. */
  dur: number;
  /** Peak gain 0..1 (pre master). */
  peak: number;
  wave: OscillatorType;
}

export interface NoiseStep {
  noise: true;
  at: number;
  dur: number;
  peak: number;
  /** Bandpass center start/end in Hz; omit for highpass burst. */
  band?: [number, number];
  highpass?: number;
}

export type SfxStep = ToneStep | NoiseStep;

const C5 = 523.25;
const E5 = 659.25;
const G5 = 783.99;
const C6 = 1046.5;

/** The whole sound identity of the app, as data. The tier is audible: more
 *  ascending steps = better tier. `thud` is the ONLY wrong/neutral sound. */
export const SFX_RECIPES: Record<SfxName, SfxStep[]> = {
  pop: [{ wave: "sine", freq: 440, to: 660, at: 0, dur: 80, peak: 0.3 }],
  tick: [{ wave: "sine", freq: 1800, at: 0, dur: 15, peak: 0.12 }],
  thud: [{ wave: "sine", freq: 160, to: 90, at: 0, dur: 120, peak: 0.22 }],
  whoosh: [{ noise: true, at: 0, dur: 250, peak: 0.18, band: [400, 1400] }],
  "chime-close": [
    { wave: "triangle", freq: C5, at: 0, dur: 120, peak: 0.22 },
    { wave: "triangle", freq: E5, at: 100, dur: 120, peak: 0.22 },
  ],
  "chime-partial": [
    { wave: "triangle", freq: C5, at: 0, dur: 120, peak: 0.22 },
    { wave: "triangle", freq: E5, at: 100, dur: 120, peak: 0.22 },
    { wave: "triangle", freq: G5, at: 200, dur: 120, peak: 0.22 },
  ],
  "chime-correct": [
    { wave: "triangle", freq: C5, at: 0, dur: 120, peak: 0.22 },
    { wave: "triangle", freq: E5, at: 100, dur: 120, peak: 0.22 },
    { wave: "triangle", freq: G5, at: 200, dur: 120, peak: 0.22 },
    { wave: "triangle", freq: C6, at: 300, dur: 160, peak: 0.22 },
  ],
  stamp: [
    { wave: "sine", freq: 90, to: 60, at: 0, dur: 150, peak: 0.35 },
    { noise: true, at: 10, dur: 30, peak: 0.2, highpass: 2000 },
  ],
  streak: [
    { wave: "sine", freq: 440, to: 660, at: 0, dur: 80, peak: 0.3 },
    { wave: "triangle", freq: C5, at: 60, dur: 120, peak: 0.2 },
    { wave: "triangle", freq: E5, at: 160, dur: 120, peak: 0.2 },
    { wave: "triangle", freq: G5, at: 260, dur: 140, peak: 0.2 },
  ],
  // ---- G-A1 Word-Battle stingers. These cover only the moments the tier
  // chime doesn't (transition, burst, victory theater) — the graded verdict
  // stays FeedbackCard's chime/thud, so nothing ever plays twice.
  /** The ink wipe: a dark noise sweep falling through the band — liquid, not windy. */
  "ink-swirl": [
    { noise: true, at: 0, dur: 420, peak: 0.2, band: [900, 220] },
    { wave: "sine", freq: 220, to: 110, at: 60, dur: 320, peak: 0.1 },
  ],
  /** The ✦ bursting: one bright rising ping + a glittery high hiss. */
  "spark-burst": [
    { wave: "triangle", freq: G5, to: C6 * 1.5, at: 0, dur: 140, peak: 0.2 },
    { noise: true, at: 20, dur: 120, peak: 0.12, highpass: 4000 },
  ],
  /** The stolen word flying home: a quick ascending sparkle run (distinct from
   *  chime-correct: faster, higher, sine — a glissando, not a verdict). */
  "letters-return": [
    { wave: "sine", freq: E5, at: 0, dur: 70, peak: 0.16 },
    { wave: "sine", freq: G5, at: 60, dur: 70, peak: 0.16 },
    { wave: "sine", freq: C6, at: 120, dur: 70, peak: 0.16 },
    { wave: "sine", freq: E5 * 2, at: 180, dur: 110, peak: 0.16 },
  ],
  /** The Schluckwort popping into harmless dots: a soft pop + a puff. */
  "smudge-pop": [
    { wave: "sine", freq: 300, to: 520, at: 0, dur: 90, peak: 0.24 },
    { noise: true, at: 30, dur: 90, peak: 0.1, band: [600, 1600] },
  ],
};

export type Tier = "correct" | "partial" | "close" | "wrong";

/** The tier→sound map. Wrong is a neutral settle, never a buzzer. */
export function sfxForTier(tier: Tier): SfxName {
  return tier === "wrong" ? "thud" : (`chime-${tier}` as SfxName);
}

/** The tier→vibration map (ms patterns). Wrong deliberately gets NOTHING. */
export const HAPTIC_PATTERNS: Record<string, number[]> = {
  correct: [30],
  partial: [20],
  close: [12],
  stamp: [40, 60, 40],
  found: [15],
};

// ---------------------------------------------------------------------------
// word diff (LCS) — the script desk's computed teaching contrast
// ---------------------------------------------------------------------------

export interface DiffToken {
  type: "same" | "del" | "ins";
  text: string;
}

/**
 * Word-level LCS diff from `from` → `to` ("She write songs." → "She writes
 * songs." ⇒ same:She del:write ins:writes same:songs.). Punctuation stays
 * attached to its word — this is a display diff, not a grader.
 */
export function diffWords(from: string, to: string): DiffToken[] {
  const a = from.split(/\s+/).filter(Boolean);
  const b = to.split(/\s+/).filter(Boolean);
  const m = a.length;
  const n = b.length;
  const lcs: number[][] = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      lcs[i]![j] = a[i] === b[j] ? lcs[i + 1]![j + 1]! + 1 : Math.max(lcs[i + 1]![j]!, lcs[i]![j + 1]!);
    }
  }
  const out: DiffToken[] = [];
  let i = 0;
  let j = 0;
  while (i < m && j < n) {
    if (a[i] === b[j]) {
      out.push({ type: "same", text: a[i]! });
      i++;
      j++;
    } else if (lcs[i + 1]![j]! >= lcs[i]![j + 1]!) {
      out.push({ type: "del", text: a[i]! });
      i++;
    } else {
      out.push({ type: "ins", text: b[j]! });
      j++;
    }
  }
  while (i < m) out.push({ type: "del", text: a[i++]! });
  while (j < n) out.push({ type: "ins", text: b[j++]! });
  return out;
}

/** Split text into grapheme clusters (emoji/umlaut-safe) for the typewriter. */
export function graphemes(text: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const seg = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    return Array.from(seg.segment(text), (s) => s.segment);
  }
  return Array.from(text);
}
