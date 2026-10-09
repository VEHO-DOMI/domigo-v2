"use client";
import Link from "next/link";
import { rememberTrainerArea, useTrainerArea, type TrainerArea } from "@/lib/modi/preference";
export default function ModeSwitch({ grade, preview, mode }: { grade: number; preview: boolean; mode?: TrainerArea }) {
  const remembered = useTrainerArea(grade, preview);
  const current = mode ?? remembered;
  const suffix = preview ? `?jahrgang=${grade}` : "";
  return <Link className="og-switch" data-mode={current} href={`${current === "grammar" ? "/modi" : "/modi/grammar"}${suffix}`}
    onClick={() => rememberTrainerArea(grade, current === "grammar" ? "vocab" : "grammar", preview)}>
    🔄 {current === "grammar" ? "Switch to Vocab or Story Mode" : "Switch to Grammar or Story Mode"}
  </Link>;
}
export function ModeStart({ grade, preview }: { grade: number; preview: boolean }) {
  const area = useTrainerArea(grade, preview);
  const suffix = preview ? `?jahrgang=${grade}` : "";
  return <Link href={`${area === "grammar" ? "/modi/grammar" : "/modi"}${suffix}`} className="og-primary og-start"><span>{area === "grammar" ? "🧠 Start Grammar Practice" : "🎯 Start Practice"}</span><span className="og-start-sub">{grade === 1 ? "Chapter und Übungsformat auswählen" : "Choose Chapters and exercise type"}</span></Link>;
}
