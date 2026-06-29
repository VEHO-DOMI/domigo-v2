"use client";
/**
 * The FOURTEEN "season" board on the g3 hub — the channel's episode log + the
 * cumulative reward surface (the G3 analog of the g2 detective Evidence Board).
 * An episode is "wrapped" once every one of its taskSlot items has been solved
 * (tier <> 'wrong'), derived from the authoritative attempts ledger upstream —
 * never the wipeable cosmetic save (Law 2). Brand-styled (g3 blue), not the
 * detective corkboard. Server passes the derived progress; this only renders.
 */
import type { CSSProperties } from "react";

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

export function SeasonBoard({ episodes, label }: { episodes: EpisodeProgress[]; label: string }) {
  const done = episodes.filter((e) => e.finished).length;
  const complete = done === episodes.length && episodes.length > 0;
  return (
    <div style={card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12, gap: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)", fontFamily: "var(--font-label)", letterSpacing: "0.03em" }}>📺 {label}</span>
        <span style={{ fontSize: 12, color: "var(--text-secondary)", whiteSpace: "nowrap", fontWeight: 600 }}>{done} / {episodes.length} wrapped</span>
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
      {complete && (
        <p style={{ marginTop: 12, fontSize: 13, fontWeight: 700, color: "var(--accent-deep)" }}>
          🎬 Season complete — you saw Ben&apos;s whole story through.
        </p>
      )}
    </div>
  );
}
