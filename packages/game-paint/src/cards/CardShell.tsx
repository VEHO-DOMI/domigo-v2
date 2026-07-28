// THE CARD SHELL (PB-T8 / Build-B-skins) — the painted overlay frame every
// task card lives in: stimulus + story line + prompt, the child interaction
// (the skin, passed as children), the F18 hint ladder, and the „Später"
// dismiss (the anti-softlock law). Pure presentation; the machine lives in
// CardHost.
//
// PK-R3a · R3-8 — the frame is now GAME UI rather than a dialog box: an ink-wash
// veil, an ink bloom that wipes the world, a card that springs in a beat later,
// the chalk-erase countdown on quickfire cards, and a verdict beat before the
// world comes back (doc 42 §1, re-skinned). The animations live in overlay-css;
// every base style here is the finished picture, so a reduced-motion child sees
// a complete card (the end-states law).
import React from "react";
import type { GameTaskV2 } from "@domigo/content-schema";
import { gapLevelFor, renderGapHint } from "./hint.ts";
import { QUICKFIRE_MS } from "./overlay-css.ts";

/** Which side of the canvas a card sits on. PB-F1/F2-20: a card is always put
 *  DOWN AWAY from the being it talks about, because the boss card says „schau
 *  auf ihre Tafel" and the centred panel used to cover exactly that. */
export type CardAlign = "left" | "center" | "right";

export const alignedWrap = (align: CardAlign): React.CSSProperties => ({
  position: "absolute", inset: 0, display: "flex", alignItems: "center",
  justifyContent: align === "center" ? "center" : align === "left" ? "flex-start" : "flex-end",
  padding: align === "center" ? 0 : "0 14px",
  background: "rgba(30, 24, 12, 0.35)", zIndex: 10,
});

export const cardWrap: React.CSSProperties = alignedWrap("center");
export const cardBox: React.CSSProperties = {
  background: "#fdf7e6", border: "2px solid #c9a36a", borderRadius: 14, padding: "18px 22px",
  maxWidth: 460, width: "90%", boxShadow: "0 6px 30px rgba(30,20,10,0.35)", textAlign: "center",
  // doc 42 §5: the three faces are already loaded app-wide — the overlays
  // simply start using them (prompts → body, headlines → display, chips → label)
  fontFamily: "var(--font-body, system-ui, sans-serif)",
  position: "relative",
};
export const cardBtn: React.CSSProperties = {
  fontSize: 16, padding: "9px 16px", borderRadius: 9, border: "1px solid #c9a36a",
  background: "#fffdf6", color: "#243048", cursor: "pointer",
  fontFamily: "var(--font-label, inherit)", fontWeight: 600,
};

/** The ink bloom that wipes the world before a card lands (doc 42 §1). One per
 *  card open; it animates itself away and leaves nothing behind. */
export const InkWipe = (): React.ReactElement => <div className="pb-wipe" aria-hidden />;

/** The chalk-erase countdown — quickfire only, and only when it has a real
 *  clock behind it (CardHost owns the timer; see QUICKFIRE_MS). */
export const ChalkClock = ({ ms }: { ms: number }): React.ReactElement => (
  <div className="pb-ring-track" aria-hidden>
    <div className="pb-ring" style={{ ["--pb-ring-s" as string]: `${ms}ms` } as React.CSSProperties} />
  </div>
);

const hasAnswer = (t: GameTaskV2): t is Extract<GameTaskV2, { kind: "typed" | "spell" }> =>
  t.kind === "typed" || t.kind === "spell";

export function CardShell({
  task, attempts, onDismiss, align = "center", clockMs, verdict = false, children,
}: {
  task: GameTaskV2;
  attempts: number;
  onDismiss: () => void;
  align?: CardAlign;
  /** ms the chalk clock has to run, or 0 for no clock at all */
  clockMs?: number;
  /** the solved beat is playing — the world comes back when it ends */
  verdict?: boolean;
  children: React.ReactNode;
}): React.ReactElement {
  const showDesc = attempts >= 1 && task.hints?.deDesc;
  const showWord = attempts >= 2 && task.hints?.deWord;
  // F18 gap ladder — only for single-string gap kinds, and only as high as the
  // kind's own face leaves room for (R3-10: a spell card already draws its
  // letter row; see gapLevelFor).
  const gap = hasAnswer(task) ? renderGapHint(task.answer, gapLevelFor(task.kind, attempts)) : "";

  return (
    <div className="pb-veil" style={alignedWrap(align)}>
      <InkWipe />
      <div className="pb-card" style={{ ...cardBox, width: align === "center" ? "90%" : "46%", minWidth: 300 }}>
        {(clockMs ?? 0) > 0 && <ChalkClock ms={clockMs ?? QUICKFIRE_MS} />}

        {task.stimulus.type === "image" && (
          <p style={{ fontSize: 13, color: "#8a7a58", margin: "0 0 6px", fontStyle: "italic" }}>🖼 {task.stimulus.altDe}</p>
        )}
        {task.stimulus.type === "entity" && (
          <p style={{ fontSize: 13, color: "#8a7a58", margin: "0 0 6px", fontStyle: "italic" }}>✨ {task.stimulus.showsDe}</p>
        )}
        <p style={{ fontSize: 14, color: "#6b6250", margin: "0 0 6px" }}>{task.storyDe}</p>
        {task.promptEn && (
          <p style={{ fontSize: 20, fontWeight: 700, margin: "0 0 14px", fontFamily: "var(--font-display, inherit)" }}>
            {task.promptEn}
          </p>
        )}

        {children}

        {(gap || showDesc || showWord) && (
          <p style={{ fontSize: 13, color: "#8a5a2b", margin: "12px 0 0", lineHeight: 1.5, fontFamily: "var(--font-label, inherit)" }}>
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

        {/* the verdict beat: the card answers back before the world resumes */}
        {verdict && (
          <div
            className="pb-verdict"
            style={{
              position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(253, 247, 230, 0.86)", borderRadius: 14, pointerEvents: "none",
            }}
          >
            <span style={{ fontSize: 44, color: "#4f7a34" }} role="img" aria-label="richtig">✓</span>
          </div>
        )}
      </div>
    </div>
  );
}
