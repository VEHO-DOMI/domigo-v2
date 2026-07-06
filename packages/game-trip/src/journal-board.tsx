"use client";
/**
 * The Trip Journal on the g4 hub — the week's stamped days (the G4 analog of the
 * g2 Evidence Board / g3 Season board). A day is "stamped" once every one of its
 * taskSlot items has been solved (tier <> 'wrong'), derived from the
 * authoritative attempts ledger upstream — never the wipeable cosmetic save
 * (Law 2). Server passes the derived progress; this only renders.
 */
import type { CSSProperties } from "react";

export interface DayProgress {
  chapterId: string;
  dayNo: number;
  titleEn: string;
  /** every taskSlot item in the chapter is solved */
  stamped: boolean;
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

export function JournalBoard({ days, label }: { days: DayProgress[]; label: string }) {
  const done = days.filter((d) => d.stamped).length;
  const complete = done === days.length && days.length > 0;
  return (
    <div style={card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12, gap: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)", fontFamily: "var(--font-label)", letterSpacing: "0.03em" }}>📓 {label}</span>
        <span style={{ fontSize: 12, color: "var(--text-secondary)", whiteSpace: "nowrap", fontWeight: 600 }}>{done} / {days.length} stamped</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(138px, 1fr))", gap: 10 }}>
        {days.map((d) => (
          <div
            key={d.chapterId}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              padding: "9px 12px",
              borderRadius: 12,
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: d.stamped ? "var(--accent)" : "var(--card-border)",
              background: d.stamped ? "var(--accent-soft)" : "var(--bg-sunken)",
              opacity: d.released ? 1 : 0.5,
            }}
          >
            <span aria-hidden="true" style={{ fontSize: 15, lineHeight: 1 }}>{d.stamped ? "🖋️" : d.released ? "○" : "🔒"}</span>
            <span style={{ minWidth: 0 }}>
              <span style={{ display: "block", fontSize: 10, fontFamily: "var(--font-label)", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: d.stamped ? "var(--accent-deep)" : "var(--muted)" }}>Day {d.dayNo}</span>
              <span style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: d.stamped ? "var(--ink)" : "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.titleEn}</span>
            </span>
          </div>
        ))}
      </div>
      {complete && (
        <p style={{ marginTop: 12, fontSize: 13, fontWeight: 700, color: "var(--accent-deep)" }}>
          🖋️ Every page of the week is written.
        </p>
      )}
    </div>
  );
}
