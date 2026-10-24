"use client";
import { createContext, useContext, type ReactNode } from "react";

// Presentation only: no item, grading, progress or persistence changes.
export type TaskLanguage = "de" | "en";
const TaskLanguageContext = createContext<TaskLanguage>("en");
const TaskSoundContext = createContext(true);
export function useTaskSoundEnabled() { return useContext(TaskSoundContext); }
export function TaskLanguageProvider({ language, children, soundEnabled = true }: { language: TaskLanguage; children: ReactNode; soundEnabled?: boolean }) {
  return <TaskLanguageContext.Provider value={language}><TaskSoundContext.Provider value={soundEnabled}>{children}</TaskSoundContext.Provider></TaskLanguageContext.Provider>;
}
export function useTaskLanguage() { return useContext(TaskLanguageContext); }
export function useTaskText() {
  const language = useTaskLanguage();
  return (de: string, en: string) => language === "de" ? de : en;
}
export function TaskText({ de, en }: { de: ReactNode; en: ReactNode }) {
  return <>{useTaskLanguage() === "de" ? de : en}</>;
}
