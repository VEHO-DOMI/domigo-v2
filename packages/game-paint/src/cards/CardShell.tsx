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
//
// PK-R6 · C · OVERLAY 2.0 (doc 44 §3.1) closes two of the gap list's items here:
//  · THE PORTRAIT (§3.1.5) — the asker's own painted art INSIDE the card, so a
//    card is a being talking to you rather than a text box quoting one. Falls
//    back to the shipped text placeholder wherever no art exists, because art
//    lands batch by batch and a card must never break on a missing file.
//  · THE RESOLUTION BEAT (§3.1.7) — the answer flies home letter by letter,
//    then the card DOFFS so the world's change can be watched (the restore-hold).
import React from "react";
import type { GameTaskV2 } from "@domigo/content-schema";
import { gapLevelFor, renderGapHint } from "./hint.ts";
import { QUICKFIRE_MS } from "./overlay-css.ts";
import { LETTER_LEAD_MS, LETTER_STAGGER_MS, lettersFor } from "./resolution.ts";

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

/** The ink iris that wipes the world before a card lands (doc 42 §1, doc 44
 *  §3.1.1). TWO blobs: one border-radius blob swelling from the centre reads as
 *  a circle, two offset ones read as ink running over the page. They animate
 *  themselves away and leave nothing behind. */
export const InkWipe = (): React.ReactElement => (
  <>
    <div className="pb-wipe" aria-hidden />
    <div className="pb-wipe pb-wipe-b" aria-hidden />
  </>
);

/** The chalk-erase countdown — only where the timer policy allows a clock at
 *  all (cards/timer.ts, doc 44 §2.9); CardHost owns the timer behind it. */
export const ChalkClock = ({ ms }: { ms: number }): React.ReactElement => (
  <div className="pb-ring-track" aria-hidden>
    <div className="pb-ring" style={{ ["--pb-ring-s" as string]: `${ms}ms` } as React.CSSProperties} />
  </div>
);

/** PK-R6 · C · THE PORTRAIT SLOT (doc 44 §3.1.5). The being that is asking,
 *  painted, inside the card at 88–130 px in the book's own frame. `stem` is the
 *  card's declared art binding and `art` the level's only-present resolver, so
 *  a stem that has not landed yet simply yields nothing and the caller draws
 *  the text placeholder instead — the keen-art law, unchanged. */
const Portrait = ({ url, altDe, wash = 0 }: { url: string; altDe: string; wash?: number }): React.ReactElement => (
  <div className="pb-portrait">
    {/* THE DESATURATION LAW, one layer up (doc 41 §2). A being OSWIN drained
        renders GREY in the world until the child gives its colour back — so its
        portrait must be exactly as grey. A full-colour face over a grey desk
        would be the very defect the law was written for, in pixels instead of
        words, and on a restore card it would hand step 2's answer away for
        free. `wash` is the being's live wash alpha, read from the scene. */}
    <img src={url} alt={altDe} style={wash > 0 ? { filter: `grayscale(${wash})` } : undefined} />
  </div>
);

/** PK-R6 · C · THE ANSWER COMES HOME (doc 44 §3.1.7). „Zurückgeholt!" over the
 *  child's own answer, flying in per character on the mined 55 ms stagger — or
 *  gliding back whole when it is too long to read as letters. */
export const AnswerHome = ({ answer }: { answer: string }): React.ReactElement => {
  const l = lettersFor(answer);
  return (
    <div
      className="pb-verdict"
      role="status"
      style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 4,
        background: "rgba(253, 247, 230, 0.92)", borderRadius: 14, pointerEvents: "none", padding: "0 14px",
      }}
    >
      <span style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "#4f7a34", fontFamily: "var(--font-label, inherit)" }}>
        Zurückgeholt!
      </span>
      <span style={{ fontSize: 26, fontWeight: 800, color: "#3a2f1c", fontFamily: "var(--font-display, inherit)", lineHeight: 1.2, textAlign: "center" }}>
        {l.kind === "letters"
          ? l.chars.map((ch, i) => (
              <span
                key={i}
                className="pb-letter"
                style={{ display: "inline-block", animationDelay: `${LETTER_LEAD_MS + i * LETTER_STAGGER_MS}ms` }}
              >
                {ch === " " ? " " : ch}
              </span>
            ))
          : <span className="pb-word" style={{ display: "inline-block" }}>{l.text}</span>}
      </span>
    </div>
  );
};

/** PK-R6 · C · beat 3 of the resolution (doc 44 §3.1.7): the celebration, held
 *  until the world has visibly finished changing — and staged OVER that changed
 *  world rather than inside the card, because the card is what just got out of
 *  its way. This is the old in-card verdict beat, moved to where the order now
 *  puts it: last. */
export const Cheer = ({ align = "center" }: { align?: CardAlign }): React.ReactElement => (
  <div style={{ ...alignedWrap(align), background: "transparent", pointerEvents: "none" }}>
    <div
      className="pb-verdict"
      style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 84, height: 84, borderRadius: "50%",
        background: "rgba(253, 247, 230, 0.94)", border: "2px solid #c9a36a",
        boxShadow: "0 4px 18px rgba(30,20,10,0.28)",
      }}
    >
      <span style={{ fontSize: 44, color: "#4f7a34" }} role="img" aria-label="richtig">✓</span>
    </div>
  </div>
);

const hasAnswer = (t: GameTaskV2): t is Extract<GameTaskV2, { kind: "typed" | "spell" }> =>
  t.kind === "typed" || t.kind === "spell";

export function CardShell({
  task, attempts, onDismiss, align = "center", clockMs, art, portraitWash, flight, doff = false, children,
}: {
  task: GameTaskV2;
  attempts: number;
  onDismiss: () => void;
  align?: CardAlign;
  /** ms the chalk clock has to run, or 0 for no clock at all */
  clockMs?: number;
  /** the level's only-present art map (stem → url), for the portrait slot */
  art?: Record<string, string>;
  /** how drained the asker is right now (0…1) — the portrait matches the world */
  portraitWash?: number;
  /** the answer flying home, or null while the card is still being played */
  flight?: string | null;
  /** the restore-hold: the card steps out of the way so the world can be seen */
  doff?: boolean;
  children: React.ReactNode;
}): React.ReactElement {
  const showDesc = attempts >= 1 && task.hints?.deDesc;
  const showWord = attempts >= 2 && task.hints?.deWord;
  // F18 gap ladder — only for single-string gap kinds, and only as high as the
  // kind's own face leaves room for (R3-10: a spell card already draws its
  // letter row; see gapLevelFor).
  const gap = hasAnswer(task) ? renderGapHint(task.answer, gapLevelFor(task.kind, attempts)) : "";
  // §3.1.5: the asker's painted face, when this card declares one AND it has
  // actually landed. Both halves matter — the declaration is the author's
  // (which cell of the being is talking), the presence is the disk's.
  const portrait = task.stimulus.type === "entity" && task.stimulus.art !== undefined
    ? art?.[task.stimulus.art]
    : undefined;

  return (
    <div className={`pb-veil${doff ? " pb-doff" : ""}`} style={alignedWrap(align)}>
      <InkWipe />
      <div className="pb-card" style={{ ...cardBox, width: align === "center" ? "90%" : "46%", minWidth: 300 }}>
        {(clockMs ?? 0) > 0 && <ChalkClock ms={clockMs ?? QUICKFIRE_MS} />}

        {task.stimulus.type === "image" && (
          <p style={{ fontSize: 13, color: "#8a7a58", margin: "0 0 6px", fontStyle: "italic" }}>🖼 {task.stimulus.altDe}</p>
        )}
        {task.stimulus.type === "entity" && (
          <>
            {portrait !== undefined && <Portrait url={portrait} altDe={task.stimulus.showsDe} wash={portraitWash} />}
            {/* the fiction line stays either way: with a portrait it is the
                caption under the face, without one it IS the face (the ✨ is
                the placeholder's own mark, so it goes when the art arrives) */}
            <p style={{ fontSize: 13, color: "#8a7a58", margin: "0 0 6px", fontStyle: "italic" }}>
              {portrait === undefined ? "✨ " : ""}{task.stimulus.showsDe}
            </p>
          </>
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

        {/* beat 1 of the resolution: the answer flies home over the card face */}
        {flight !== null && flight !== undefined && flight.length > 0 && <AnswerHome answer={flight} />}
      </div>
    </div>
  );
}
