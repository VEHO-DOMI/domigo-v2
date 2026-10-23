"use client";
import { useTrainerLanguage } from "@/lib/trainer/preferences";
import Link from "next/link";
import { rememberTrainerArea, useTrainerArea, type TrainerArea } from "@/lib/modi/preference";
export default function ModeSwitch({ grade, preview, mode }: { grade: number; preview: boolean; mode?: TrainerArea }) {
  const de = useTrainerLanguage(grade) === "de";
  const remembered = useTrainerArea(grade, preview);
  const current = mode ?? remembered;
  const suffix = preview ? `?jahrgang=${grade}` : "";
  return <Link className="og-switch" data-mode={current} href={`${current === "grammar" ? "/modi" : "/modi/grammar"}${suffix}`}
    onClick={() => rememberTrainerArea(grade, current === "grammar" ? "vocab" : "grammar", preview)}>
    🔄 {current === "grammar" ? (de ? "Zu Vokabeln oder Story Mode" : "Switch to Vocab or Story Mode") : (de ? "Zu Grammatik oder Story Mode" : "Switch to Grammar or Story Mode")}
  </Link>;
}
export function ModeStart({ grade, preview }: { grade: number; preview: boolean }) {
  const de = useTrainerLanguage(grade) === "de";
  const area = useTrainerArea(grade, preview);
  const suffix = preview ? `?jahrgang=${grade}` : "";
  return <Link href={`${area === "grammar" ? "/modi/grammar" : "/modi"}${suffix}`} className="og-primary og-start"><span>{area === "grammar" ? (de ? "🧠 Grammatik üben" : "🧠 Start Grammar Practice") : (de ? "🎯 Übung starten" : "🎯 Start Practice")}</span><span className="og-start-sub">{de ? "Chapter und Übungsformat auswählen" : "Choose Chapters and exercise type"}</span></Link>;
}
