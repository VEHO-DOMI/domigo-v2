"use client";
/**
 * G-A1 · The Word-Battle stage. Stepping on a ✦ no longer opens a bare task
 * card — it opens THIS: a full-screen themed scene where a Schluckwort (a
 * small ink-smudge stray of the Blank) holds the stolen word, and the task is
 * the spell that frees it. The task itself renders through the UNCHANGED
 * @domigo/task-ui views — one grading brain (Law 5); everything here is
 * theater around it.
 *
 * Two skins, one stage (WorldCopy.stageSkin): "ink" is the G2 school campaign
 * (the room blurred behind ink and dark glass, drips framing the top); "book"
 * is the G1 book world (warm paper, drifting pages). The stage is shared by
 * both grades — that deliberately supersedes B-2 stage 1's G1 byte-identity
 * (documented in the G-A1 PR).
 *
 * Motion honesty: `reducedMotion` (OS ∨ ?motion=reduce ∨ FeelGear) skips the
 * ink-swirl entirely and stamps `dg-bs-still` on the stage, which kills every
 * decorative animation inside — base styles are authored as END states, so a
 * motionless battle is complete, never stuck mid-wipe.
 */
import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { GrammarItem, VocabItem } from "@domigo/content-schema";
import type { Tier } from "@domigo/engine";
import { playSfx } from "@domigo/game-feel";
import type { ResolvedItem } from "@domigo/game-core";
import { GrammarItemView, VocabItemView, type ResultDetail } from "@domigo/task-ui";
import { hash32, lettersFor, primaryAnswer, type BattlePresentation } from "./battle.ts";
import type { AttemptFn } from "./PhaserGame.tsx";

export interface BattleStageProps {
  item: ResolvedItem;
  presentation: BattlePresentation;
  skin: "ink" | "book";
  /** The campaign's encounter header ("Die leere Stelle hat ein Wort genommen …"). */
  label: string;
  continueLabel: string;
  /** Caption over the recovered word ("Zurückgeholt!"). */
  victoryLabel: string;
  mode: string;
  reducedMotion: boolean;
  onAttempt: AttemptFn;
  /** Weiter → PhaserGame clears the node + steps the zone color. */
  onDone: () => void;
}

type Phase = "enter" | "fight" | "won" | "lost";

/** Per-skin theater palette (the task card inside keeps the app's own tokens). */
const SKIN = {
  ink: {
    stageBg: "radial-gradient(120% 100% at 50% 0%, rgba(24, 21, 40, 0.88) 0%, rgba(10, 9, 18, 0.95) 78%)",
    text: "#e8e6f5",
    accent: "#8b7cf5",
    frameGlow: "rgba(139, 124, 245, 0.35)",
    smudgeBody: "#1c1b2e",
    smudgeEdge: "#2f2b4a",
    eye: "#f6f5ff",
    swirl: "#14121f",
  },
  book: {
    stageBg: "radial-gradient(120% 100% at 50% 0%, rgba(250, 244, 229, 0.94) 0%, rgba(233, 219, 190, 0.97) 80%)",
    text: "#3b2f1c",
    accent: "#b8860b",
    frameGlow: "rgba(201, 163, 78, 0.4)",
    smudgeBody: "#2e2317",
    smudgeEdge: "#463625",
    eye: "#fdf8ec",
    swirl: "#3a2f1c",
  },
} as const;

/** The Schluckwort's three body shapes — blobby ink, deliberately asymmetric. */
const BLOBS = [
  "M60 8 C84 6 104 22 106 46 C108 68 96 88 66 92 C38 96 14 84 12 58 C10 34 24 12 60 8 Z",
  "M58 4 C80 2 98 16 102 38 C106 62 100 84 72 92 C46 99 18 90 14 64 C10 38 22 8 58 4 Z",
  "M62 10 C90 8 110 28 106 50 C102 74 86 92 58 92 C30 92 8 76 10 50 C12 26 32 12 62 10 Z",
] as const;

/** Deterministic dot-scatter directions for the victory pop (seeded, no RNG). */
function dotFlights(seed: number): Array<{ dx: number; dy: number; delay: number }> {
  return Array.from({ length: 7 }, (_, i) => {
    const a = ((seed >> (i % 5)) % 360) * (Math.PI / 180) + i * 0.9;
    const r = 46 + ((seed >> (i + 3)) % 40);
    return { dx: Math.round(Math.cos(a) * r), dy: Math.round(Math.sin(a) * r) - 12, delay: i * 40 };
  });
}

/** The Schluckwort: a procedural ink smudge with big worried eyes, seeded by
 *  the item id so every stolen word has its own little thief. */
function Schluckwort({ seed, skin, phase, holding }: { seed: number; skin: keyof typeof SKIN; phase: Phase; holding: ReactNode }) {
  const s = SKIN[skin];
  const blob = BLOBS[seed % BLOBS.length]!;
  const tilt = (seed % 9) - 4;
  const eyeGap = 17 + ((seed >> 3) % 7);
  const eyeY = 40 + ((seed >> 5) % 6);
  const pupilX = (((seed >> 7) % 3) - 1) * 2;
  const cls = phase === "won" ? " dg-bs-pop" : phase === "lost" ? " dg-bs-defeat" : "";
  return (
    <div className={`dg-bs-smudge${cls}`} style={{ position: "relative", width: 132, height: 118, transform: `rotate(${tilt}deg)` }} aria-hidden="true">
      <svg viewBox="0 0 120 100" style={{ width: 120, height: 100, display: "block", margin: "0 auto" }}>
        <path d={blob} fill={s.smudgeBody} stroke={s.smudgeEdge} strokeWidth="3" />
        {/* stray ink satellites */}
        <circle cx={14 + (seed % 8)} cy={20} r="3.4" fill={s.smudgeBody} />
        <circle cx={104 - (seed % 6)} cy={30 + (seed % 10)} r="2.6" fill={s.smudgeBody} />
        <circle cx={96} cy={12} r="1.8" fill={s.smudgeBody} />
        {/* eyes — big, worried, watching the spell card */}
        <ellipse cx={60 - eyeGap} cy={eyeY} rx="9.5" ry="11" fill={s.eye} />
        <ellipse cx={60 + eyeGap} cy={eyeY} rx="9.5" ry="11" fill={s.eye} />
        <circle cx={60 - eyeGap + pupilX} cy={eyeY + 3} r="4.2" fill="#0c0b14" />
        <circle cx={60 + eyeGap + pupilX} cy={eyeY + 3} r="4.2" fill="#0c0b14" />
        <circle cx={60 - eyeGap + pupilX + 1.5} cy={eyeY + 1} r="1.3" fill="#ffffff" />
        <circle cx={60 + eyeGap + pupilX + 1.5} cy={eyeY + 1} r="1.3" fill="#ffffff" />
        {/* a tiny uncertain mouth */}
        <path d={`M ${54} ${eyeY + 20} q 6 ${phase === "lost" ? -4 : 4} 12 0`} stroke={s.eye} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      </svg>
      {/* the stolen word, held tight — an illegible blot (constant size: never
          leaks the word or its length), released on victory */}
      <div style={{ position: "absolute", left: "50%", bottom: 0, transform: "translateX(-50%) rotate(-3deg)" }}>{holding}</div>
    </div>
  );
}

/** The illegible blot the Schluckwort clutches until the word is won back. */
function WordBlot({ skin, faded }: { skin: keyof typeof SKIN; faded: boolean }) {
  const s = SKIN[skin];
  return (
    <svg viewBox="0 0 64 20" style={{ width: 64, height: 20, opacity: faded ? 0.35 : 1, transition: "opacity 400ms" }} aria-hidden="true">
      <rect x="1" y="2" width="62" height="16" rx="8" fill={s.smudgeBody} stroke={s.smudgeEdge} strokeWidth="1.6" />
      <path d="M8 10 q 5 -5 10 0 t 10 0 t 10 0 t 10 0 t 8 0" stroke={s.eye} strokeWidth="1.6" fill="none" opacity="0.5" />
    </svg>
  );
}

export function BattleStage(props: BattleStageProps) {
  const s = SKIN[props.skin];
  const seed = hash32(props.item.item.id);
  const [phase, setPhase] = useState<Phase>(props.reducedMotion ? "fight" : "enter");
  const [answered, setAnswered] = useState(false);
  const [pulse, setPulse] = useState(0); // keyed absorb-pulse restarts per wrong attempt
  const timers = useRef<number[]>([]);
  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)); };

  const answerText = useMemo(() => primaryAnswer(props.item, props.presentation.pool), [props.item, props.presentation.pool]);
  const letters = useMemo(() => lettersFor(answerText), [answerText]);
  const dots = useMemo(() => dotFlights(seed), [seed]);

  // Full-screen stage: lock the page scroll behind it (restored on unmount).
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
      timers.current.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  // The ink-swirl entrance: cover → retract (~700ms), then the fight is on.
  useEffect(() => {
    if (phase !== "enter") return;
    playSfx("ink-swirl");
    later(() => setPhase("fight"), 700);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onTier = (tier: Tier, _wrongCount: number) => {
    // Non-terminal wrongs: the smudge absorbs the attempt (keyed pulse). The
    // verdict SOUND stays FeedbackCard's — nothing plays twice.
    if (tier === "wrong") setPulse((n) => n + 1);
  };

  const onResult = (tier: Tier, detail: ResultDetail) => {
    setAnswered(true);
    // Same optimistic post as every game surface; the server re-grades.
    void props.onAttempt({ clientAttemptId: crypto.randomUUID(), itemId: detail.itemId, mode: props.mode, input: detail.input, latencyMs: null, hintUsed: false });
    if (tier !== "wrong") {
      setPhase("won");
      playSfx("letters-return");
      later(() => playSfx("smudge-pop"), 420);
    } else {
      setPhase("lost");
    }
  };

  const taskProps = { onResult, onTier, bank: props.presentation.bank } as const;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={props.label}
      className={`dg-bs-stage${props.reducedMotion ? " dg-bs-still" : ""}`}
      style={{
        position: "fixed", inset: 0, zIndex: 100, overflowY: "auto",
        display: "flex", flexDirection: "column", alignItems: "center",
        background: s.stageBg, color: s.text,
        backdropFilter: "blur(10px) saturate(0.72)", WebkitBackdropFilter: "blur(10px) saturate(0.72)",
        padding: "max(14px, env(safe-area-inset-top)) 16px max(24px, env(safe-area-inset-bottom))",
      }}
    >
      {props.skin === "ink" ? <InkDrips /> : <BookPages />}

      <div className="dg-bs-card" style={{ width: "min(560px, 100%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, position: "relative" }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: s.accent, fontFamily: "var(--font-label)", textAlign: "center", marginTop: 4 }}>
          {props.label}
        </div>

        {/* the thief + its trophy; keyed wrapper replays the absorb pulse per wrong */}
        <div key={`p${pulse}`} className={pulse > 0 && phase === "fight" ? "dg-bs-absorb" : undefined} style={{ position: "relative" }}>
          <div aria-hidden="true" style={{ position: "absolute", inset: -18, borderRadius: "50%", background: `radial-gradient(circle, ${s.frameGlow} 0%, transparent 68%)` }} />
          <Schluckwort seed={seed} skin={props.skin} phase={phase} holding={phase === "won" ? null : <WordBlot skin={props.skin} faded={phase === "lost"} />} />
          {/* victory pop: the smudge bursts into harmless dots */}
          {phase === "won" && dots.map((d, i) => (
            <span
              key={i}
              className="dg-bs-dot"
              aria-hidden="true"
              style={{
                position: "absolute", left: "50%", top: "45%", width: 8, height: 8, borderRadius: "50%",
                background: s.smudgeBody,
                ["--dx" as string]: `${d.dx}px`, ["--dy" as string]: `${d.dy}px`,
                animationDelay: `${d.delay}ms`,
              }}
            />
          ))}
        </div>

        {/* the recovered word flies home, letter by letter */}
        {phase === "won" && (
          <div role="status" style={{ textAlign: "center", minHeight: 54 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: s.accent }}>{props.victoryLabel}</div>
            <div style={{ fontSize: 30, fontWeight: 800, fontFamily: "var(--font-display)", letterSpacing: "0.02em" }}>
              {letters.kind === "letters"
                ? letters.chars.map((ch, i) => (
                    <span key={i} className="dg-bs-letter" style={{ display: "inline-block", animationDelay: `${120 + i * 55}ms` }}>
                      {ch === " " ? " " : ch}
                    </span>
                  ))
                : <span className="dg-bs-word-whole" style={{ display: "inline-block" }}>{letters.text}</span>}
            </div>
          </div>
        )}

        {/* the spell card: the one task renderer, framed as the spell that frees the word */}
        <div
          style={{
            width: "100%", borderRadius: 20, padding: 4, marginTop: phase === "won" ? 2 : 10,
            border: `2px solid ${s.accent}`, boxShadow: `0 0 0 4px ${s.frameGlow}, 0 18px 50px rgba(0,0,0,${props.skin === "ink" ? 0.5 : 0.18})`,
            background: "var(--card)",
          }}
        >
          <div style={{ borderRadius: 16, padding: "14px 16px", background: "var(--card)", color: "var(--text)" }}>
            {props.item.kind === "grammar" ? (
              <GrammarItemView
                key={props.item.item.id}
                item={props.item.item as GrammarItem}
                tactile
                choiceRender={props.presentation.dropdown ? "dropdown" : "buttons"}
                {...taskProps}
              />
            ) : (
              <VocabItemView
                key={props.item.item.id}
                item={props.item.item as VocabItem}
                pool={props.presentation.pool ?? "carrier"}
                {...taskProps}
              />
            )}
          </div>
        </div>

        {answered && (
          <button className="dg-btn" style={{ marginTop: 12, minWidth: 160 }} onClick={props.onDone}>
            {props.continueLabel}
          </button>
        )}
      </div>

      {/* the ink-swirl wipe — mounted only during the entrance, never under reduced motion */}
      {phase === "enter" && (
        <div aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 110, overflow: "hidden", pointerEvents: "none" }}>
          <div className="dg-bs-swirl-blob" style={{ background: s.swirl }} />
          <div className="dg-bs-swirl-blob dg-bs-swirl-blob-b" style={{ background: s.swirl, opacity: 0.85 }} />
        </div>
      )}
    </div>
  );
}

/** Ink skin: drips framing the top of the stage (static shapes, no animation). */
function InkDrips() {
  return (
    <svg aria-hidden="true" viewBox="0 0 400 46" preserveAspectRatio="none" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 46, opacity: 0.9 }}>
      <path
        d="M0 0 H400 V12 q -12 0 -14 14 q -2 16 -10 16 q -8 0 -9 -14 q -1 -12 -12 -12 q -30 0 -60 4 q -14 2 -15 18 q -1 14 -9 14 q -9 0 -10 -16 q -1 -14 -16 -16 q -50 -6 -100 -2 q -16 1 -18 20 q -2 15 -10 15 q -9 0 -10 -18 q -1 -15 -16 -16 q -40 -3 -71 0 q -14 1 -16 12 Z"
        fill="#0c0b14"
      />
    </svg>
  );
}

/** Book skin: pages drifting in the depth of the stage. */
function BookPages() {
  const page: CSSProperties = {
    position: "absolute", width: 88, height: 116, borderRadius: 6,
    background: "repeating-linear-gradient(rgba(255,252,242,0.9) 0 14px, rgba(214,196,158,0.55) 14px 15px)",
    border: "1px solid rgba(180,155,110,0.5)", boxShadow: "0 6px 18px rgba(90,70,30,0.18)",
  };
  return (
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <div className="dg-bs-page" style={{ ...page, left: "8%", top: "16%", transform: "rotate(-14deg)" }} />
      <div className="dg-bs-page dg-bs-page-b" style={{ ...page, right: "6%", top: "30%", transform: "rotate(11deg)", width: 72, height: 96 }} />
      <div className="dg-bs-page dg-bs-page-c" style={{ ...page, left: "14%", bottom: "8%", transform: "rotate(7deg)", width: 64, height: 84, opacity: 0.7 }} />
    </div>
  );
}
