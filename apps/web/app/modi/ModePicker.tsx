"use client";
import { useTrainerLanguage } from "@/lib/trainer/preferences";
import { useState } from "react";
import Link from "next/link";
import type { Direction, PracticeMode } from "../practice/options";
import { modeDetails, type TrainerMode } from "@/lib/modi/catalog";

export default function ModePicker({ grade, preview, chapters, due, story, areas }: {
  grade: number; preview: boolean; chapters: string[]; due: number | null; story: { title: string; href: string } | null; areas: boolean;
}) {
  const language = useTrainerLanguage(grade), de = language === "de";
  const [selected, setSelected] = useState(chapters);
  const [mode, setMode] = useState<PracticeMode | TrainerMode>(areas ? "grammar" : "full");
  const [direction, setDirection] = useState<Direction>("auto");
  const suffix = preview ? `?jahrgang=${grade}` : "";
  const extra = modeDetails(grade, language);
  const newMode = (id: TrainerMode) => ({ mode: id, ...extra[id], xp: extra[id].reward });
  const modes: { mode: PracticeMode | TrainerMode; icon: string; title: string; sub: string; xp: string }[] = [
    { mode: "full", icon: "📚", title: de ? "Komplett" : "Full Run", sub: de ? "Alle gewählten Wörter, gemischte Aufgaben" : "All selected words, mixed types", xp: de ? "10–30 XP / Wort" : "10–30 XP / word" },
    { mode: "sprint", icon: "🏃", title: "Sprint", sub: de ? "10 zufällige Wörter, schnelle Runde" : "10 random words, quick round", xp: de ? "10–30 XP / Wort" : "10–30 XP / word" },
    newMode("speed"),
    { mode: "mc", icon: "🎯", title: "Multiple Choice", sub: de ? "Wähle aus 4 Möglichkeiten" : "Choose from 4 options", xp: de ? "10–30 XP / Wort" : "10–30 XP / word" },
    newMode("flashcards"), newMode("memory"), newMode("spelling"), newMode("wordhunt"),
    { mode: "grammar", icon: "🧠", title: de ? "Grammatik" : "Grammar Mode", sub: de ? "Grammatik üben" : "Rules & Structures", xp: de ? "10–30 XP / Aufgabe" : "10–30 XP / question" },
  ];
  const params = new URLSearchParams({ mode, chapters: selected.join(","), direction });
  if (preview) params.set("jahrgang", String(grade));
  const modePath = mode === "grammar" || mode in extra ? `/modi/${mode}?${params.toString()}` : `/practice?${params.toString()}`;
  return <main className="og-setup">
    <header className="og-setup-header"><Link href={`/home${suffix}`}>← {de ? "Zurück" : "Back"}</Link><h1>{de ? "Modus wählen" : "Choose Mode"}</h1></header>
    <details className="og-chapters"><summary>{selected.length} Chapters · {de ? "Chapter auswählen" : "Choose Chapters"}</summary><div>
      {chapters.map((slug) => <label key={slug}><input type="checkbox" checked={selected.includes(slug)} onChange={() => setSelected((old) => old.includes(slug) ? old.filter((s) => s !== slug) : [...old, slug])} />Chapter {Number(slug.slice(-2))}</label>)}
    </div></details>
    <div className="og-mode-list" role="group" aria-label={de ? "Übungsmodus" : "Practice mode"}>
      {modes.map((entry) => <button type="button" key={entry.mode} className="og-mode" aria-pressed={mode === entry.mode} onClick={() => setMode(entry.mode)}><span className="og-mode-icon">{entry.icon}</span><span className="og-mode-info"><strong>{entry.title}</strong><small>{entry.sub}</small><span className="og-mode-xp">{entry.xp}</span></span></button>)}
      {story && <Link className="og-mode" href={`${story.href}${suffix}`}><span className="og-mode-icon">📖</span><span className="og-mode-info"><strong>Story</strong><small>{story.title}</small><span className="og-mode-xp">{de ? "XP für bewertete Antworten" : "XP for graded answers"}</span></span></Link>}
    </div>
    <p className="og-xp-note">{de ? "XP für eine richtige Antwort · je nach Schwierigkeit" : "XP for a correct answer · based on difficulty"}</p>
    {mode !== "grammar" && (!(mode in extra) || mode === "speed") && <fieldset className="og-directions"><legend>{de ? "Übungsformat" : "Exercise Type"}</legend>
      {([["auto", "🔄 Mix", de ? "Alle Übungsformate gemischt" : "Random mix of all types"], ["carrier", de ? "📝 Lückentext" : "📝 Context", de ? "Fülle die Lücke" : "Fill in the blank"], ["definition", "📖 Definition", de ? "Finde das Wort" : "Find the word"], ["deToEn", "🇩🇪 → 🇬🇧", "Deutsch → English"], ["enToDe", "🇬🇧 → 🇩🇪", "English → Deutsch"]] as const)
        .filter(([id]) => mode !== "mc" || id === "definition" || id === "deToEn").map(([id, title, sub]) => <label className="og-direction" key={id}><input type="radio" name="direction" checked={(mode === "mc" && direction !== "deToEn" ? "definition" : direction) === id} onChange={() => setDirection(id)} /><span><strong>{title}</strong><small>{sub}</small></span></label>)}
    </fieldset>}
    <Link className="og-review-chip" href={`/review${suffix}`}>🔄 {de ? "Wiederholung" : "Smart Review"}{due === null ? "" : ` (${due})`}</Link>
    <Link className="og-review-chip" href={`/woerterbuch${suffix}`}>📖 {de ? "Wörterbuch & Karteikarten" : "Dictionary & Flashcards"}</Link>
    <div className="og-setup-footer">{selected.length > 0 ? <Link className="og-primary" href={modePath}>{de ? "Starten" : "Go!"} 🚀</Link> : <p>{de ? "Wähle mindestens ein Chapter." : "Choose at least one Chapter."}</p>}</div>
  </main>;
}
