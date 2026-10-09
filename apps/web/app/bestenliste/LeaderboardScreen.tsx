"use client";
import { useState } from "react";
import Link from "next/link";
import type { Leaderboard, LeaderboardRow } from "@/lib/leaderboard";
import { formatXp, levelFor, prestigeStars, registerFor, vocabTitle } from "@/lib/levels";
import WeeklyGoal from "./WeeklyGoal";

function RankRow({ row, rank, grade, all, order }: { row: LeaderboardRow; rank: number; grade: number; all: boolean; order: "week" | "total" }) {
  const level = levelFor(row.vocabXp);
  const title = vocabTitle(level.level, level.prestige, registerFor(grade));
  return <li className={`lb-row${row.me ? " me" : ""}`}>
    <span className="lb-rank">{["🥇", "🥈", "🥉"][rank - 1] ?? `${rank}.`}</span>
    {/* Fixed local avatar files, no remote image or identity lookup. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img className="lb-avatar" src={`/avatars/${String(row.avatar).padStart(2, "0")}.png`} width={34} height={34} alt="" />
    <span className="lb-person"><span className="lb-name">{row.name}</span><span className={`lb-pill zone-${level.zone}`} title={`Level ${level.level}`}>{prestigeStars(level.prestige)}{title.name}</span>
      {all && <span className="lb-class-chip">{row.className}</span>}{row.me && <span className="lb-you">← {grade === 1 ? "du" : "you"}</span>}
      {row.streak > 0 && <span className="lb-streak" aria-label={`${grade === 1 ? "Serie" : "Streak"}: ${row.streak}`}>🔥 {row.streak}</span>}
    </span><strong className="lb-xp">{formatXp(order === "week" ? row.weeklyXp : row.totalXp)} XP</strong>
  </li>;
}

export default function LeaderboardScreen({ board, grade, preview }: { board: Leaderboard; grade: number; preview: boolean }) {
  const [tab, setTab] = useState<"class" | "all" | "goal">("class");
  const [order, setOrder] = useState<"week" | "total">("week");
  const de = grade === 1;
  const hasOtherClass = board.gradeOptIn && board.rows.some((row) => !row.ownClass);
  const all = tab === "all" && hasOtherClass;
  const key = order === "week" ? "weeklyXp" : "totalXp";
  const rows = board.rows.filter((r) => all || r.ownClass).sort((a, b) => b[key] - a[key] || a.name.localeCompare(b.name, "de") || a.id - b.id);
  const daily = board.rows.filter((r) => r.ownClass && r.dailyTotal > 0).sort((a, b) => b.dailyCorrect - a.dailyCorrect || a.name.localeCompare(b.name, "de"));
  return <main className="og-screen lb-screen" lang={de ? "de" : "en"}>
    <div className="lb-heading"><Link className="og-back" href={`/home${preview ? `?jahrgang=${grade}` : ""}`}>← {de ? "Zurück" : "Back"}</Link><h1>🏆 {de ? "Bestenliste" : "Leaderboard"}</h1></div>
    {!board.enabled ? <p className="og-card lb-disabled">{board.unavailable
      ? de ? "Die Bestenliste ist gerade nicht erreichbar." : "The leaderboard is currently unavailable."
      : de ? "Deine Lehrkraft hat die Bestenliste für deine Klasse nicht eingeschaltet." : "Your teacher has not switched on the leaderboard for your class."}</p> : <>
      <nav className="lb-tabs" aria-label={de ? "Bestenlisten" : "Leaderboards"}>
        <button type="button" aria-pressed={tab === "class" || (tab === "all" && !hasOtherClass)} onClick={() => setTab("class")}>{de ? "Meine Klasse" : "My Class"}</button>
        {hasOtherClass && <button type="button" aria-pressed={all} onClick={() => setTab("all")}>{de ? "Alle Klassen" : "All Classes"}</button>}
        <button type="button" aria-pressed={tab === "goal"} onClick={() => setTab("goal")}>{de ? "Wochenziel" : "Weekly goal"}</button>
      </nav>
      {tab === "goal" ? <WeeklyGoal weeklyXp={board.weeklyXp} totalXp={board.totalXp} target={board.target} grade={grade} /> : <section aria-label={all ? de ? "Alle Klassen" : "All Classes" : de ? "Meine Klasse" : "My Class"}>
        <div className="lb-list-heading"><h2>{all ? de ? "Alle Klassen" : "All Classes" : `${de ? "Meine Klasse" : "My Class"} (${board.className})`}</h2>
          <div className="lb-period" aria-label={de ? "Zeitraum" : "Period"}><button type="button" aria-pressed={order === "week"} onClick={() => setOrder("week")}>{de ? "Woche" : "Week"}</button><button type="button" aria-pressed={order === "total"} onClick={() => setOrder("total")}>{de ? "Gesamt" : "All time"}</button></div>
        </div>
        {rows.length ? <ol className="lb-list">{rows.map((row, i) => <RankRow key={row.id} row={row} rank={i + 1} grade={grade} all={all} order={order} />)}</ol> : <p className="lb-empty">{de ? "Hier sind noch keine Einträge." : "There are no entries yet."}</p>}
        <p className="lb-period-note">{order === "week" ? de ? "Seit Montag · Wiener Zeit" : "Since Monday · Vienna time" : de ? "Wortschatz + Grammatik XP" : "Vocabulary + Grammar XP"}</p>
      </section>}
      <section className="lb-daily"><h2>⚡ {de ? "Heutige Challenge" : "Today's Challenge"}</h2>
        {daily.length ? <ol className="lb-list">{daily.map((row, i) => <li key={row.id} className={`lb-row${row.me ? " me" : ""}`}><span className="lb-rank">{i + 1}.</span><span className="lb-name">{row.name}{row.me && <span className="lb-you"> ← {de ? "du" : "you"}</span>}</span><strong className="lb-score">{row.dailyCorrect}/{row.dailyTotal}</strong></li>)}</ol> : <p className="lb-empty">{de ? "Heute hat noch niemand die Challenge gespielt." : "No one has done today's challenge yet."}</p>}
      </section>
    </>}
  </main>;
}
