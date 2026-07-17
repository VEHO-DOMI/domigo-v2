/**
 * THE TYPING-MODE LAW (refoundation W0, Koki 2026-07-17): Phaser polls
 * window-level keys every frame with no idea a DOM text field above the
 * canvas has focus — so W/A/S/D/X steered the hero while a student tried to
 * type "pencil". While any editable element has focus, every scene's
 * keyboard is disabled and its key state cleared; released on blur.
 *
 * Bound once per Phaser.Game by the React mounts (ArcadeGame / MapGame /
 * PhaserGame). Pure helpers are exported for unit tests (no DOM needed).
 */

/** Minimal structural slice of Phaser.Game the guard touches (testable). */
export interface TypingGuardGame {
  scene: { getScenes(isActive?: boolean): Array<{ input: { keyboard: { enabled: boolean; resetKeys(): void } | null } }> };
  /** The GLOBAL KeyboardManager — it preventDefaults captured codes (W/A/S/D,
   *  arrows, space) at the window level, which is what actually swallows the
   *  letters before a text field can receive them. Must be disabled too. */
  input: { keyboard: { enabled: boolean } | null };
}

export function isEditableTarget(el: unknown): boolean {
  if (el === null || typeof el !== "object") return false;
  const node = el as { tagName?: string; isContentEditable?: boolean };
  return node.tagName === "INPUT" || node.tagName === "TEXTAREA" || node.isContentEditable === true;
}

/** Apply/lift typing mode: the global manager (stops window-level
 *  preventDefault so characters reach the field) + every active scene. */
export function applyTyping(game: TypingGuardGame, typing: boolean): void {
  if (game.input.keyboard) game.input.keyboard.enabled = !typing;
  for (const s of game.scene.getScenes(true)) {
    const kb = s.input.keyboard;
    if (!kb) continue;
    kb.enabled = !typing;
    // clear latched isDown state either way — a key held when focus moved
    // must never leave the hero running (the stuck-run-animation bug)
    kb.resetKeys();
  }
}

/** Attach the document focus listeners; returns the unbind function. */
export function bindTypingGuard(game: TypingGuardGame): () => void {
  if (typeof document === "undefined") return () => {};
  const onFocusIn = (e: FocusEvent) => { if (isEditableTarget(e.target)) applyTyping(game, true); };
  const onFocusOut = () => applyTyping(game, false);
  document.addEventListener("focusin", onFocusIn);
  document.addEventListener("focusout", onFocusOut);
  // an input may already hold focus when the game mounts (e.g. remount under an open task)
  if (isEditableTarget(document.activeElement)) applyTyping(game, true);
  return () => {
    document.removeEventListener("focusin", onFocusIn);
    document.removeEventListener("focusout", onFocusOut);
    applyTyping(game, false);
  };
}
