/**
 * THE TYPING-MODE LAW (refoundation W0, Koki 2026-07-17): Phaser polls
 * window-level keys every frame with no idea a DOM text field above the
 * canvas has focus — so W/A/S/D/X steered the hero while a student tried to
 * type "pencil". While any editable element has focus, every scene's
 * keyboard is disabled and its key state cleared; released on blur.
 *
 * Bound once per Phaser.Game by every game's React mount (ArcadeGame /
 * MapGame / PhaserGame / PaintGame). Pure helpers are exported for unit
 * tests (no DOM needed).
 *
 * SHARED HOME (PB-T1, 2026-07-23): lifted from game-2d into game-feel so the
 * paint game inherits the law instead of re-learning the bug — game-feel is
 * the browser-glue leaf both game packages already depend on (game-core is
 * DOM-free by its own header, so the guard cannot live there).
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

/** Attach the document focus listeners; returns the unbind function.
 *
 *  PB-T1 removal gap: when a focused input is REMOVED from the DOM (a task
 *  card unmounting on solve/dismiss), Chrome fires NO focusout — the guard
 *  would stay engaged and the game keyboard would stay dead. A MutationObserver
 *  watches the focused editable and releases typing mode the moment it leaves
 *  the document. */
export function bindTypingGuard(game: TypingGuardGame): () => void {
  if (typeof document === "undefined") return () => {};
  let observer: MutationObserver | null = null;
  const stopWatching = () => { observer?.disconnect(); observer = null; };
  const watchRemoval = (el: Node) => {
    stopWatching();
    if (typeof MutationObserver === "undefined") return;
    observer = new MutationObserver(() => {
      if (!document.contains(el)) {
        stopWatching();
        applyTyping(game, false);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  };
  const onFocusIn = (e: FocusEvent) => {
    if (isEditableTarget(e.target)) {
      applyTyping(game, true);
      watchRemoval(e.target as Node);
    }
  };
  const onFocusOut = () => { stopWatching(); applyTyping(game, false); };
  document.addEventListener("focusin", onFocusIn);
  document.addEventListener("focusout", onFocusOut);
  // an input may already hold focus when the game mounts (e.g. remount under an open task)
  if (isEditableTarget(document.activeElement)) {
    applyTyping(game, true);
    if (document.activeElement) watchRemoval(document.activeElement);
  }
  return () => {
    document.removeEventListener("focusin", onFocusIn);
    document.removeEventListener("focusout", onFocusOut);
    stopWatching();
    applyTyping(game, false);
  };
}
