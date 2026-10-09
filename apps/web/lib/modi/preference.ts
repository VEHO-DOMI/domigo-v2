"use client";
import { useSyncExternalStore } from "react";
export type TrainerArea = "vocab" | "grammar";
const key = (grade: number) => `domigo-trainer-mode-g${grade}`;
export function rememberTrainerArea(grade: number, area: TrainerArea, preview: boolean): void {
  if (preview) return;
  try { localStorage.setItem(key(grade), area); window.dispatchEvent(new Event("trainer-mode")); } catch { /* Device preferences are optional. */ }
}
function subscribe(notify: () => void) {
  window.addEventListener("storage", notify); window.addEventListener("trainer-mode", notify);
  return () => { window.removeEventListener("storage", notify); window.removeEventListener("trainer-mode", notify); };
}
export function useTrainerArea(grade: number, preview: boolean): TrainerArea {
  return useSyncExternalStore(subscribe, () => {
    if (preview) return "vocab";
    try { return localStorage.getItem(key(grade)) === "grammar" ? "grammar" : "vocab"; } catch { return "vocab"; }
  }, () => "vocab");
}
