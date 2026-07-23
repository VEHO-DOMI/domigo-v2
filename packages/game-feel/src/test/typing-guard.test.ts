import { describe, expect, it } from "vitest";
import { applyTyping, isEditableTarget, type TypingGuardGame } from "../typing-guard.ts";

function stubGame(): { game: TypingGuardGame; kb: { enabled: boolean; resets: number }; mgr: { enabled: boolean } } {
  const kb = { enabled: true, resets: 0, resetKeys() { this.resets += 1; } };
  const mgr = { enabled: true };
  const game: TypingGuardGame = {
    scene: { getScenes: () => [{ input: { keyboard: kb } }, { input: { keyboard: null } }] },
    input: { keyboard: mgr },
  };
  return { game, kb, mgr };
}

describe("typing-mode law", () => {
  it("recognizes editable targets only", () => {
    expect(isEditableTarget({ tagName: "INPUT" })).toBe(true);
    expect(isEditableTarget({ tagName: "TEXTAREA" })).toBe(true);
    expect(isEditableTarget({ tagName: "DIV", isContentEditable: true })).toBe(true);
    expect(isEditableTarget({ tagName: "BUTTON" })).toBe(false);
    expect(isEditableTarget({ tagName: "CANVAS", isContentEditable: false })).toBe(false);
    expect(isEditableTarget(null)).toBe(false);
    expect(isEditableTarget(undefined)).toBe(false);
  });

  it("disables the keyboard and clears latched keys while typing, restores on blur", () => {
    const { game, kb, mgr } = stubGame();
    applyTyping(game, true);
    expect(kb.enabled).toBe(false);
    expect(mgr.enabled).toBe(false); // global manager: stops window-level preventDefault
    expect(kb.resets).toBe(1); // held W/A/S/D must not keep the hero running
    applyTyping(game, false);
    expect(kb.enabled).toBe(true);
    expect(mgr.enabled).toBe(true);
    expect(kb.resets).toBe(2); // cleared on release too (stuck-run bug)
  });

  it("survives scenes without a keyboard plugin", () => {
    const { game } = stubGame();
    expect(() => applyTyping(game, true)).not.toThrow();
  });
});
