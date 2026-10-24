"use client";
import { type ReactNode } from "react";
import { TaskLanguageProvider, TaskText, useTaskText } from "@domigo/task-ui";
import TrainerShell from "@/app/home/TrainerShell";
import { useTrainerLanguage } from "./preferences";
import "./learning.css";

export const LearningText = TaskText;
export const useLearningText = useTaskText;

/** Older learning routes share the already calibrated year palette and the
 * in-memory language choice. Their own PreviewBanner stays intact (including
 * teacher navigation and route-specific notes). No new storage or authority. */
export default function LearningShell({ grade, children, preview = false }: { grade: number | null; children: ReactNode; preview?: boolean }) {
  const language = useTrainerLanguage(grade ?? 0);
  const content = <div className="og-learning">{children}</div>;
  return <TaskLanguageProvider language={language} soundEnabled={!preview}>
    {grade === null ? <div lang={language}>{content}</div> :
      <TrainerShell grade={grade} preview={false} wordmark={false} screen="learning">{content}</TrainerShell>}
  </TaskLanguageProvider>;
}
