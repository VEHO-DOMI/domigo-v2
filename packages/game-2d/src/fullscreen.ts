"use client";
/**
 * v4 W0 · fullscreen — Phaser-FREE (P-29b: DOM surfaces import this subpath;
 * the barrel would drag Phaser into SSR). Best-effort: needs a user gesture,
 * silently no-ops on engines without the API.
 */
export function requestGameFullscreen(): void {
  try {
    if (typeof document !== "undefined" && document.fullscreenElement === null) {
      void document.documentElement.requestFullscreen?.().catch(() => {});
    }
  } catch { /* the game simply stays windowed */ }
}

export function toggleGameFullscreen(): void {
  try {
    if (typeof document === "undefined") return;
    if (document.fullscreenElement !== null) void document.exitFullscreen?.().catch(() => {});
    else void document.documentElement.requestFullscreen?.().catch(() => {});
  } catch { /* no-op */ }
}
