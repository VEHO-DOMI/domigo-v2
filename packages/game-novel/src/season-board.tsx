"use client";
/**
 * The FOURTEEN "season" board on the g3 hub — the channel's episode log + the
 * cumulative reward surface (the G3 analog of the g2 detective Evidence Board).
 * An episode is "wrapped" once every one of its taskSlot items has been solved
 * (tier <> 'wrong'), derived from the authoritative attempts ledger upstream —
 * never the wipeable cosmetic save (Law 2). Brand-styled (g3 blue), not the
 * detective corkboard. Server passes the derived progress; this only renders.
 */
import { useId, useState, type CSSProperties } from "react";
import { Audience } from "./audience.tsx";
import { formatCount, type EpisodeStats } from "./novel-copy.ts";
import "./novel.css";

export interface EpisodeProgress {
  chapterId: string;
  epNo: number;
  titleEn: string;
  /** every taskSlot item in the chapter is solved */
  finished: boolean;
  /** the chapter is released (unlocked) */
  released: boolean;
}

const card: CSSProperties = {
  background: "var(--card)",
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "var(--card-border)",
  borderRadius: 20,
  padding: "16px 18px",
  boxShadow: "var(--shadow-card)",
};

export function SeasonBoard({ episodes, label, economy = [] }: { episodes: EpisodeProgress[]; label: string; economy?: readonly EpisodeStats[] }) {
  const comparisonId = useId();
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const last = episodes.filter((e) => e.finished && e.released).at(-1);
  const rowIndex = economy.findIndex((e) => e.chapterId === last?.chapterId);
  const history = rowIndex < 0 ? [] : economy.slice(0, rowIndex + 1);
  const selectedIndex = history.findIndex((row) => row.chapterId === selectedChapter);
  const shownIndex = selectedIndex < 0 ? history.length - 1 : selectedIndex;
  const peak = Math.max(1, ...history.map((e) => e.views));
  const done = episodes.filter((e) => e.finished).length;
  const complete = done === episodes.length && episodes.length > 0;
  return (
    <div style={card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12, gap: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)", fontFamily: "var(--font-label)", letterSpacing: "0.03em" }}>📺 {label}</span>
        <span style={{ fontSize: 12, color: "var(--text-secondary)", whiteSpace: "nowrap", fontWeight: 600 }}>{done} / {episodes.length} complete</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(138px, 1fr))", gap: 10 }}>
        {episodes.map((e) => (
          <div
            key={e.chapterId}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              padding: "9px 12px",
              borderRadius: 12,
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: e.finished ? "var(--accent)" : "var(--card-border)",
              background: e.finished ? "var(--accent-soft)" : "var(--bg-sunken)",
              opacity: e.released ? 1 : 0.5,
            }}
          >
            <span aria-hidden="true" style={{ fontSize: 15, lineHeight: 1 }}>{e.finished ? "✅" : e.released ? "○" : "🔒"}</span>
            <span style={{ minWidth: 0 }}>
              <span style={{ display: "block", fontSize: 10, fontFamily: "var(--font-label)", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: e.finished ? "var(--accent-deep)" : "var(--muted)" }}>Ep {e.epNo}</span>
              <span style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: e.finished ? "var(--ink)" : "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.titleEn}</span>
            </span>
          </div>
        ))}
      </div>
      {history.length > 0 && <>
        <div className="fourteen-compare-control">
          <label htmlFor={comparisonId}>Kanalstand vergleichen</label>
          <select id={comparisonId} className="dg-input" value={history[shownIndex]?.chapterId} onChange={(event) => setSelectedChapter(event.target.value)}>
            {history.map((row) => <option key={row.chapterId} value={row.chapterId}>Nach Folge {Number(row.chapterId.slice(-2))}</option>)}
          </select>
        </div>
        <Audience current={history[shownIndex] ?? null} previous={history[shownIndex - 1]} quiet={(last?.epNo ?? 0) >= 9} />
        <details style={{ marginTop: 12 }}>
          <summary style={{ cursor: "pointer", minHeight: 44, paddingTop: 12 }}>Views by episode (= Aufrufe je Folge)</summary>
          <ol style={{ padding: 0, listStyle: "none" }}>
            {history.map((row) => <li key={row.chapterId} style={{ display: "grid", gridTemplateColumns: "45px 1fr 75px", gap: 10, alignItems: "center", margin: "10px 0", fontSize: 12 }}>
              <span>Ep {Number(row.chapterId.slice(-2))}</span>
              <span aria-hidden="true" style={{ height: 6, background: "var(--card-border)", borderRadius: 3 }}><span style={{ display: "block", height: 6, width: `${row.views / peak * 100}%`, background: "var(--accent)", borderRadius: 3 }} /></span>
              <span style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{formatCount(row.views, "en")}</span>
            </li>)}
          </ol>
        </details>
      </>}
      {complete && (
        <p style={{ marginTop: 12, fontSize: 13, fontWeight: 700, color: "var(--accent-deep)" }}>
          🎬 Season complete — you saw Ben&apos;s whole story through.
        </p>
      )}
    </div>
  );
}
