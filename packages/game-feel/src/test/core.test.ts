import { describe, expect, it } from "vitest";
import {
  confettiPieces,
  DEFAULT_SETTINGS,
  diffWords,
  glossLabels,
  graphemes,
  HAPTIC_PATTERNS,
  motionOK,
  parseSettings,
  primaryLine,
  resolveLangMode,
  revealLabels,
  secondaryLine,
  SFX_RECIPES,
  sfxForTier,
  type ToneStep,
} from "../core.ts";

describe("settings", () => {
  it("defaults are classroom-safe: silent, still-hands, motion follows the OS, language by grade", () => {
    expect(DEFAULT_SETTINGS).toEqual({ sound: false, haptics: false, motion: "auto", lang: "auto" });
    expect(parseSettings(null)).toEqual(DEFAULT_SETTINGS);
    expect(parseSettings("{not json")).toEqual(DEFAULT_SETTINGS);
    expect(parseSettings(JSON.stringify({ sound: "yes", motion: "party", lang: "klingon" }))).toEqual(DEFAULT_SETTINGS);
  });
  it("persisted lang round-trips; junk lang falls back to auto", () => {
    expect(parseSettings(JSON.stringify({ lang: "de-first" })).lang).toBe("de-first");
    expect(parseSettings(JSON.stringify({ lang: "en-first" })).lang).toBe("en-first");
    expect(parseSettings(JSON.stringify({ lang: 42 })).lang).toBe("auto");
  });
  it("OS reduced-motion ALWAYS wins; the user toggle only reduces further", () => {
    expect(motionOK({ ...DEFAULT_SETTINGS, motion: "auto" }, false)).toBe(true);
    expect(motionOK({ ...DEFAULT_SETTINGS, motion: "auto" }, true)).toBe(false); // no force-on exists
    expect(motionOK({ ...DEFAULT_SETTINGS, motion: "reduce" }, false)).toBe(false);
    expect(motionOK({ ...DEFAULT_SETTINGS, motion: "reduce" }, true)).toBe(false);
  });
});

describe("L-1 story language mode (German-first for the youngest)", () => {
  it("auto resolves by grade: grade 1 German-first, everyone else English-first", () => {
    expect(resolveLangMode("auto", 1)).toBe("de-first");
    expect(resolveLangMode("auto", 2)).toBe("en-first");
    expect(resolveLangMode("auto", 3)).toBe("en-first");
    expect(resolveLangMode("auto", 4)).toBe("en-first");
  });
  it("an explicit device choice always wins over the grade default", () => {
    expect(resolveLangMode("en-first", 1)).toBe("en-first");
    expect(resolveLangMode("de-first", 4)).toBe("de-first");
  });
  it("de-first leads German and reveals English; en-first is the mirror", () => {
    expect(primaryLine("de-first", "Hello!", "Hallo!")).toBe("Hallo!");
    expect(secondaryLine("de-first", "Hello!", "Hallo!")).toBe("Hello!");
    expect(primaryLine("en-first", "Hello!", "Hallo!")).toBe("Hello!");
    expect(secondaryLine("en-first", "Hello!", "Hallo!")).toBe("Hallo!");
  });
  it("a missing scaffold NEVER leaves a blank bubble: de-first falls back to English, nothing to reveal", () => {
    expect(primaryLine("de-first", "Hello!", null)).toBe("Hello!");
    expect(secondaryLine("de-first", "Hello!", null)).toBeNull();
    expect(secondaryLine("en-first", "Hello!", undefined)).toBeNull();
  });
  it("chip labels mirror the established Auf-Deutsch affordance", () => {
    expect(revealLabels("de-first").show).toBe("Auf Englisch?");
    expect(revealLabels("en-first").show).toBe("Auf Deutsch?");
    expect(glossLabels("de-first").show).toBe("Wort-Hilfe zeigen");
    expect(glossLabels("en-first").show).toBe("Show word help");
  });
});

describe("seeded confetti (Law 9: deterministic celebration)", () => {
  it("same seed → identical trajectories; different seed → different", () => {
    expect(confettiPieces("ep01", 5)).toEqual(confettiPieces("ep01", 5));
    expect(confettiPieces("ep01", 5)).not.toEqual(confettiPieces("ep02", 5));
  });
  it("stays within the render contract (drift, rotation, delay, hue, count)", () => {
    for (const p of confettiPieces("x", 5)) {
      expect(Math.abs(p.dx)).toBeLessThanOrEqual(40);
      expect(Math.abs(p.rot)).toBeLessThanOrEqual(260);
      expect(p.delay).toBeGreaterThanOrEqual(0);
      expect(p.delay).toBeLessThanOrEqual(120);
      expect([0, 1, 2]).toContain(p.hue);
    }
  });
});

describe("the sound identity (recipes as data)", () => {
  it("the tier is audible: close ⊂ partial ⊂ correct as ascending note ladders", () => {
    const notes = (name: "chime-close" | "chime-partial" | "chime-correct"): number[] =>
      (SFX_RECIPES[name] as ToneStep[]).map((s) => s.freq);
    const close = notes("chime-close");
    const partial = notes("chime-partial");
    const correct = notes("chime-correct");
    expect(partial.slice(0, close.length)).toEqual(close);
    expect(correct.slice(0, partial.length)).toEqual(partial);
    for (const seq of [close, partial, correct]) {
      for (let i = 1; i < seq.length; i++) expect(seq[i]!).toBeGreaterThan(seq[i - 1]!);
    }
  });
  it("wrong maps to the neutral thud — and no multi-note recipe descends (no 'sad trombone' exists)", () => {
    expect(sfxForTier("wrong")).toBe("thud");
    expect(sfxForTier("correct")).toBe("chime-correct");
    for (const [name, steps] of Object.entries(SFX_RECIPES)) {
      const tones = steps.filter((s): s is ToneStep => !("noise" in s));
      if (tones.length < 2) continue; // single settle-tones (thud/stamp) may ramp down
      for (let i = 1; i < tones.length; i++) {
        expect(tones[i]!.freq, `${name} must not descend across notes`).toBeGreaterThanOrEqual(tones[i - 1]!.freq * 0.99);
      }
    }
  });
  it("wrong answers vibrate NOTHING (Law 3 as tone)", () => {
    expect(HAPTIC_PATTERNS["wrong"]).toBeUndefined();
    expect(HAPTIC_PATTERNS["correct"]).toEqual([30]);
  });
});

describe("diffWords (the script desk's computed teaching contrast)", () => {
  it("marks the single corrected word (the fix-Bens-line case)", () => {
    expect(diffWords("She write some great lyrics.", "She writes some great lyrics.")).toEqual([
      { type: "same", text: "She" },
      { type: "del", text: "write" },
      { type: "ins", text: "writes" },
      { type: "same", text: "some" },
      { type: "same", text: "great" },
      { type: "same", text: "lyrics." },
    ]);
  });
  it("handles insertion-only and reorder-ish edits without losing words", () => {
    const d = diffWords("I play football today", "I play football very well today");
    expect(d.filter((t) => t.type === "ins").map((t) => t.text)).toEqual(["very", "well"]);
    expect(d.filter((t) => t.type === "del")).toEqual([]);
    const all = diffWords("a b c", "c b a");
    expect(all.filter((t) => t.type !== "ins").map((t) => t.text).join(" ")).toContain("b");
  });
});

describe("graphemes (typewriter safety)", () => {
  it("keeps umlauts and emoji whole", () => {
    expect(graphemes("Größe")).toEqual(["G", "r", "ö", "ß", "e"]);
    expect(graphemes("a🔥b").length).toBe(3);
  });
});
