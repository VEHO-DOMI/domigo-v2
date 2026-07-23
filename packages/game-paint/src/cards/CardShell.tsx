// THE CARD SHELL (PB-T8 / Build-B-skins) — the painted overlay frame every
// task card lives in: stimulus + story line + prompt, the child interaction
// (the skin, passed as children), the F18 hint ladder, and the „Später"
// dismiss (the anti-softlock law). Pure presentation; the machine lives in
// CardHost.
import React from "react";
import type { GameTaskV2 } from "@domigo/content-schema";
import { renderGapHint } from "./hint.ts";

export const cardWrap: React.CSSProperties = {
  position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
  background: "rgba(30, 24, 12, 0.35)", zIndex: 10,
};
export const cardBox: React.CSSProperties = {
  background: "#fdf7e6", border: "2px solid #c9a36a", borderRadius: 14, padding: "18px 22px",
  maxWidth: 460, width: "90%", boxShadow: "0 6px 30px rgba(30,20,10,0.35)", textAlign: "center",
};
export const cardBtn: React.CSSProperties = {
  fontSize: 16, padding: "9px 16px", borderRadius: 9, border: "1px solid #c9a36a",
  background: "#fffdf6", color: "#243048", cursor: "pointer",
};

const hasAnswer = (t: GameTaskV2): t is Extract<GameTaskV2, { kind: "typed" | "spell" }> =>
  t.kind === "typed" || t.kind === "spell";

export function CardShell({
  task, attempts, onDismiss, children,
}: {
  task: GameTaskV2;
  attempts: number;
  onDismiss: () => void;
  children: React.ReactNode;
}): React.ReactElement {
  const showDesc = attempts >= 1 && task.hints?.deDesc;
  const showWord = attempts >= 2 && task.hints?.deWord;
  // F18 gap ladder — only for single-string gap kinds
  const gap = hasAnswer(task) ? renderGapHint(task.answer, attempts) : "";

  return (
    <div style={cardWrap}>
      <div style={cardBox}>
        {task.stimulus.type === "image" && (
          <p style={{ fontSize: 13, color: "#8a7a58", margin: "0 0 6px", fontStyle: "italic" }}>🖼 {task.stimulus.altDe}</p>
        )}
        {task.stimulus.type === "entity" && (
          <p style={{ fontSize: 13, color: "#8a7a58", margin: "0 0 6px", fontStyle: "italic" }}>✨ {task.stimulus.showsDe}</p>
        )}
        <p style={{ fontSize: 14, color: "#6b6250", margin: "0 0 6px" }}>{task.storyDe}</p>
        {task.promptEn && <p style={{ fontSize: 19, fontWeight: 700, margin: "0 0 14px" }}>{task.promptEn}</p>}

        {children}

        {(gap || showDesc || showWord) && (
          <p style={{ fontSize: 13, color: "#8a5a2b", margin: "12px 0 0", lineHeight: 1.5 }}>
            {gap && <><b style={{ letterSpacing: 1 }}>{gap}</b><br /></>}
            {showDesc && <>💡 {task.hints!.deDesc}<br /></>}
            {showWord && <>📖 {task.hints!.deWord}</>}
          </p>
        )}

        <button
          style={{ ...cardBtn, marginTop: 16, fontSize: 13, background: "transparent", border: "1px solid #d8c9a0", color: "#8a7a58" }}
          onClick={onDismiss}
        >
          Später ↩
        </button>
      </div>
    </div>
  );
}
