"use client";
import { useSyncExternalStore, type ReactNode } from "react";
import { defaultTrainerLanguage, defaultTrainerTheme, trainerLanguage, type TrainerLanguage, type TrainerTheme } from "./register";

// Only in-memory presentation choices. A preview and Activity must not touch
// device storage; preferences therefore last through navigation, not a reload.
let language: TrainerLanguage = "de";
const themes = new Map<number, TrainerTheme>();
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
const notify = () => listeners.forEach(listener => listener());
export function chooseTrainerLanguage(value: TrainerLanguage) { if (value === "de" || value === "en") { language = value; notify(); } }
export function chooseTrainerTheme(grade: number, value: TrainerTheme) { if (value === "light" || value === "dark") { themes.set(grade,value); notify(); } }
export function useTrainerLanguage(grade: number): TrainerLanguage {
  return useSyncExternalStore(subscribe, () => trainerLanguage(grade,language), () => defaultTrainerLanguage(grade));
}
export function useTrainerTheme(grade: number): TrainerTheme {
  return useSyncExternalStore(subscribe, () => themes.get(grade) ?? defaultTrainerTheme(grade), () => defaultTrainerTheme(grade));
}
export function TrainerText({ grade, de, en }: { grade: number; de: ReactNode; en: ReactNode }) {
  return <>{useTrainerLanguage(grade) === "de" ? de : en}</>;
}
