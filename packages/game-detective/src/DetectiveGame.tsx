"use client";
/**
 * @domigo/game-detective — the G2 "Watson rework" surface (DOM + SVG, no Phaser).
 * Walks a story@1 chapter as an investigation: speaker dialogue (EN, with the
 * German + word-glosses revealed on tap — G2 is A1+/A2), embedded taskSlots
 * rendered by the ONE task renderer (@domigo/task-ui), narrative choices, and a
 * case-file EVIDENCE BOARD that fills as clue-tasks are solved ("tasks ARE clues").
 * Rewards are themed as the detective economy — Clues (the hidden XP), Case
 * Progress, Hot Trail, and an Evidence Piece per Case File — never bare "+XP".
 * The app injects `onAttempt` (mode:"game:g2") + `onSave`; this layer never grades.
 */
import { useState, type CSSProperties } from "react";
import type { Chapter, GrammarItem, Scene, VocabItem } from "@domigo/content-schema";
import { xpForTier, type Tier } from "@domigo/engine";
import { ChoiceContent, DialogueReveal, GlossReveal, LangToggle, primaryLine, useLangMode } from "@domigo/game-feel";
import { storyItemKey, type ResolvedItem } from "@domigo/game-core";
import { GrammarItemView, VocabItemView, type ResultDetail } from "@domigo/task-ui";
import { CharacterChip, EvidenceBoard, EvidenceGallery, characterPalette } from "./art.tsx";
import type { EvidencePiece } from "./art.tsx";
import { COPY, EVIDENCE, resultLine, trailLabel } from "./detective-copy.ts";

export interface GameAttempt {
  clientAttemptId: string;
  itemId: string;
  mode: string;
  input: unknown;
  latencyMs: number | null;
  hintUsed: boolean;
}
export type AttemptFn = (a: GameAttempt) => Promise<{ ok: boolean; queued: boolean; streak?: number }>;

/** Cosmetic save — where in the chapter + which clues are on the board. */
export interface DetectiveSave {
  chapterId: string;
  sceneId: string;
  clues: string[];
}

/**
 * Server-resolved art URLs for this chapter — ONLY images that exist on disk are
 * present (the app resolves stems → files against the synced public/art dir), so
 * any missing slot simply falls back to the procedural art. Optional throughout.
 */
export interface DetectiveArt {
  base: string;
  backdrop: string | null;
  endCard: string | null;
  portraits: Record<string, string>; // sceneId → url
  beats: Record<string, string>; // sceneId → url
  clues: Record<string, string>; // taskSlot → url
}

export interface DetectiveGameProps {
  caseTitle: string;
  /** L-1: drives the story-language default (defaults to 2 — today's only case game). */
  grade?: number;
  chapter: Chapter;
  castNames: Record<string, string>;
  storyItems: Record<string, ResolvedItem>;
  /** Due-item "re-interview" beat (Phase 4 spaced retrieval) — shown before the chapter on a fresh start. */
  reviewItems?: ResolvedItem[];
  /** Collected Evidence Pieces for the "Solve the Case" finale (last chapter only; Phase 6). */
  finalePieces?: EvidencePiece[];
  onAttempt: AttemptFn;
  initialSave?: DetectiveSave | null;
  onSave?: (s: DetectiveSave) => void;
  art?: DetectiveArt | null;
}

const wrap: CSSProperties = { maxWidth: 640, margin: "0 auto", fontFamily: "var(--font-body)", color: "var(--text)" };
const scenePanel: CSSProperties = { background: "var(--card)", borderWidth: 1, borderStyle: "solid", borderColor: "var(--card-border)", borderRadius: 20, padding: "18px 20px", boxShadow: "var(--shadow-card)", backdropFilter: "blur(20px)" };

function humanize(slot: string): string {
  const s = slot.replace(/[-_]/g, " ");
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Phase 7 (read-aloud): speak a line via the browser voice (A1–A2 pace). No TTS provider needed. */
function speak(text: string): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-GB";
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
}

function TaskClue({ item, onAttempt, onSolved, onContinue, onScored, hideHint }: {
  item: ResolvedItem; onAttempt: AttemptFn; onSolved: () => void; onContinue: () => void; onScored: (tier: Tier) => void; hideHint?: boolean;
}) {
  const [res, setRes] = useState<{ tier: Tier; clues: number } | null>(null);
  const onResult = (tier: Tier, detail: ResultDetail) => {
    const clues = xpForTier((item.item.difficulty ?? 1) * 10, tier);
    setRes({ tier, clues });
    void onAttempt({ clientAttemptId: crypto.randomUUID(), itemId: detail.itemId, mode: "game:g2", input: detail.input, latencyMs: null, hintUsed: false });
    onScored(tier);
    onSolved(); // pin the clue to the case file immediately
  };
  const line = res ? resultLine(item.kind, res.tier, res.clues) : null;
  return (
    <div style={{ marginTop: 14, borderTop: "1px solid var(--card-border)", paddingTop: 12 }}>
      <div style={{ fontSize: 12, color: "var(--accent)", fontWeight: 700, marginBottom: 6, fontFamily: "var(--font-label)", letterSpacing: "0.02em" }}>{COPY.cluePrompt}</div>
      {item.kind === "grammar"
        ? <GrammarItemView key={item.item.id} item={item.item as GrammarItem} onResult={onResult} hideXp hideHint={hideHint} />
        : <VocabItemView key={item.item.id} item={item.item as VocabItem} onResult={onResult} hideXp hideHint={hideHint} />}
      {line && <div style={{ marginTop: 10, fontWeight: 700, fontSize: 14, color: line.good ? "var(--correct)" : "var(--incorrect)" }}>{line.text}</div>}
      {res && <button className="dg-btn" style={{ marginTop: 14 }} onClick={onContinue}>{COPY.continue}</button>}
    </div>
  );
}

export function DetectiveGame(props: DetectiveGameProps) {
  const { chapter, castNames, storyItems, onAttempt, onSave, caseTitle, art } = props;
  // L-1: story-language mode (device toggle; grade 2 defaults English-first).
  const mode = useLangMode(props.grade ?? 2);
  const byId = new Map(chapter.scenes.map((s) => [s.id, s]));
  const resume = props.initialSave && props.initialSave.chapterId === chapter.id ? props.initialSave : null;
  const first = chapter.scenes[0]?.id ?? "";

  const [sceneId, setSceneId] = useState(resume && byId.has(resume.sceneId) ? resume.sceneId : first);
  const [clues, setClues] = useState<string[]>(resume?.clues ?? []);
  const [taskDone, setTaskDone] = useState(false);
  // "Hot Trail" = consecutive non-combo-breaking answers (correct/partial); close/wrong reset.
  // Persisted in sessionStorage so the streak spans Case Files within one sitting.
  const [trail, setTrail] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    return Number(sessionStorage.getItem("domigo:g2:trail")) || 0;
  });
  const [done, setDone] = useState(false);
  // Phase 4: a due-item "re-interview" beat before the chapter (fresh start only).
  const reviewItems = props.reviewItems ?? [];
  const [reviewIdx, setReviewIdx] = useState(0);
  const inReview = resume === null && reviewIdx < reviewItems.length;
  const fadeHints = chapter.unit >= 10; // Phase 5: scaffold fade — drop the Tipp from ~ch10

  const onScored = (tier: Tier): void => setTrail((t) => {
    const next = tier === "correct" || tier === "partial" ? t + 1 : 0;
    try { sessionStorage.setItem("domigo:g2:trail", String(next)); } catch { /* private mode */ }
    return next;
  });

  const scene: Scene | undefined = byId.get(sceneId);

  const save = (over: Partial<DetectiveSave>) => onSave?.({ chapterId: chapter.id, sceneId, clues, ...over });

  const addClue = (slot: string): void => {
    setClues((prev) => {
      if (prev.includes(slot)) return prev;
      const next = [...prev, slot];
      save({ clues: next });
      return next;
    });
  };

  const go = (nextId: string | null): void => {
    setTaskDone(false);
    if (nextId === null) { setDone(true); return; }
    setSceneId(nextId);
    save({ sceneId: nextId });
  };

  const clueList = <EvidenceBoard label="Case file" clues={clues.map((c) => ({ key: c, text: humanize(c) }))} images={art?.clues} />;

  // Phase 4 — "re-interview": a due clue resurfaces before the new case (Law 6).
  if (inReview) {
    const rItem = reviewItems[reviewIdx]!;
    return (
      <main style={{ ...wrap, padding: "16px 12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
          <h1 style={{ fontSize: 21, margin: 0, fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--ink)" }}>{caseTitle} <span style={{ color: "var(--muted)", fontSize: 14, fontWeight: 400, fontFamily: "var(--font-body)" }}>· re-check the notes</span></h1>
          <a href="/play/2" style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>← Cases</a>
        </div>
        <section style={{ ...scenePanel, boxShadow: "inset 5px 0 0 var(--accent), var(--shadow-card)" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--accent)", marginBottom: 2, fontFamily: "var(--font-display)" }}>🔍 Mina &amp; Theo</div>
          <p style={{ fontSize: 18, margin: "6px 0 4px", lineHeight: 1.4, color: "var(--text)" }}>
            Before the new case — one more look at an old clue.{reviewItems.length > 1 ? ` (${reviewIdx + 1}/${reviewItems.length})` : ""}
          </p>
          <TaskClue item={rItem} onAttempt={onAttempt} onSolved={() => {}} onContinue={() => setReviewIdx((i) => i + 1)} onScored={onScored} hideHint={fadeHints} />
        </section>
        <div style={{ marginTop: 14 }}>{clueList}</div>
      </main>
    );
  }

  // Phase 6 — "Solve the Case": the last chapter's completion recaps the collected
  // Evidence Pieces (derived from the ledger), framed by how complete the case is.
  const finalePieces = props.finalePieces ?? [];
  if (done && finalePieces.length > 0) {
    const found = finalePieces.filter((p) => p.unlocked).length;
    const total = finalePieces.length;
    const verdict = found === total
      ? "Airtight — you found every piece. The case is solved."
      : found >= total - 3
        ? "A strong case. The truth is clear."
        : "We got there — but the case had gaps. Re-open a case to find more clues.";
    return (
      <main style={{ ...wrap, padding: "28px 16px" }}>
        {art?.endCard && <img src={art.endCard} alt="" style={{ width: "100%", maxHeight: 260, objectFit: "cover", borderRadius: 16, marginBottom: 14, border: "1px solid var(--card-border)" }} />}
        <h1 style={{ fontSize: 26, margin: "0 0 6px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Case Closed! 🗂️</h1>
        <p style={{ fontSize: 18, color: "var(--text)", marginTop: 0 }}>You solved <strong>{caseTitle}</strong>. Lena&apos;s name is on the medal now — the truth is out, thanks to the clues you found.</p>
        <p style={{ fontSize: 15, color: "var(--accent)", fontWeight: 700 }}>{verdict} ({found}/{total} pieces)</p>
        <div style={{ marginTop: 14 }}>
          <EvidenceGallery pieces={finalePieces} label="Your evidence (= Beweis)" />
        </div>
        <a href="/play/2" style={{ color: "var(--accent)", fontSize: 14, fontWeight: 700, display: "inline-block", marginTop: 16 }}>← Back to your cases</a>
      </main>
    );
  }

  if (done || !scene) {
    return (
      <main style={{ ...wrap, padding: "28px 16px" }}>
        {art?.endCard && <img src={art.endCard} alt="" style={{ width: "100%", maxHeight: 260, objectFit: "cover", borderRadius: 16, marginBottom: 14, border: "1px solid var(--card-border)" }} />}
        <h1 style={{ fontSize: 22, fontFamily: "var(--font-display)", color: "var(--ink)" }}>Case File complete! 🗂️</h1>
        <p style={{ color: "var(--text)", fontSize: 17 }}>New <strong>evidence</strong> (= Beweis) found: <strong>{EVIDENCE[chapter.id] ?? "a new clue"}</strong>.</p>
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>You found {clues.length} clue{clues.length === 1 ? "" : "s"} in this case file. It goes on your evidence board.</p>
        <a href="/play/2" style={{ color: "var(--accent)", fontSize: 14, fontWeight: 700 }}>← Back to your cases</a>
      </main>
    );
  }

  const slot = scene.taskSlots[0];
  const slotItem = slot ? storyItems[storyItemKey(slot.itemId, slot.variantKey)] : undefined;
  const taskBlocks = slot !== undefined && slotItem !== undefined && !taskDone;
  // FlagGate resolves to its `else` path here (the authored neutral default —
  // wiped-save doctrine); the flag-aware runtime arrives with the G4 package.
  const rawNext = scene.next;
  const sNext = rawNext !== null && typeof rawNext === "object" && !Array.isArray(rawNext) ? rawNext.else : rawNext;
  const speakerName = castNames[scene.speaker] ?? scene.speaker;
  const palette = characterPalette(scene.speaker);
  const portraitUrl = art?.portraits[scene.id];
  const topImg = art?.beats[scene.id] ?? art?.backdrop ?? null;
  const totalTasks = chapter.scenes.reduce((n, s) => n + s.taskSlots.length, 0);
  const pct = totalTasks ? Math.round((clues.length / totalTasks) * 100) : 0;
  const trailMsg = trailLabel(trail);

  return (
    <main style={{ ...wrap, padding: "16px 12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
        <h1 style={{ fontSize: 21, margin: 0, fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--ink)" }}>{caseTitle} <span style={{ color: "var(--muted)", fontSize: 14, fontWeight: 400, fontFamily: "var(--font-body)" }}>· {chapter.titleEn}</span></h1>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <LangToggle grade={props.grade ?? 2} />
          <a href="/play/2" style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>← Cases</a>
        </span>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
          <span style={{ color: "var(--muted)", fontFamily: "var(--font-label)", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>{COPY.caseProgress}</span>
          <span style={{ fontWeight: 700, color: trailMsg ? "var(--accent)" : "var(--text-secondary)" }}>{trailMsg ?? `${clues.length}/${totalTasks} clues`}</span>
        </div>
        <div className="xp-track">
          <div className="xp-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {topImg && <img src={topImg} alt="" style={{ width: "100%", maxHeight: 220, objectFit: "cover", borderRadius: 16, marginBottom: 12, border: "1px solid var(--card-border)" }} />}

      <section style={{ ...scenePanel, boxShadow: `inset 5px 0 0 ${palette.shirt}, var(--shadow-card)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 2 }}>
          {portraitUrl
            ? <img src={portraitUrl} alt={speakerName} width={46} height={46} style={{ borderRadius: "50%", objectFit: "cover", flex: "0 0 auto", border: `2px solid ${palette.shirt}` }} />
            : <CharacterChip charKey={scene.speaker} name={speakerName} />}
          <div style={{ fontSize: 15, fontWeight: 700, color: palette.shirt, fontFamily: "var(--font-display)" }}>{speakerName}</div>
          <button onClick={() => speak(scene.textEn)} aria-label="Read the line aloud" title="Read aloud" style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", fontSize: 18, lineHeight: 1, padding: 2 }}>🔊</button>
        </div>
        <div style={{ background: "var(--bg-sunken)", border: "1px solid var(--card-border)", borderRadius: 14, padding: "11px 15px", marginTop: 4 }}>
          <p style={{ fontSize: 19, margin: 0, lineHeight: 1.4, color: "var(--text)" }}>{primaryLine(mode, scene.textEn, scene.scaffoldDe)}</p>
        </div>
        <DialogueReveal key={`de-${scene.id}`} mode={mode} textEn={scene.textEn} scaffoldDe={scene.scaffoldDe} />
        <GlossReveal key={`gl-${scene.id}`} mode={mode} glosses={scene.glosses} />

        {taskBlocks ? (
          <TaskClue item={slotItem} onAttempt={onAttempt} onSolved={() => addClue(slot.slot)} onContinue={() => setTaskDone(true)} onScored={onScored} hideHint={fadeHints} />
        ) : Array.isArray(sNext) ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }}>
            {sNext.map((c) => (
              <button key={c.id} className="dg-btn-secondary" style={{ textAlign: "left", justifyContent: "flex-start", display: "block" }} onClick={() => go(c.next)}>
                <ChoiceContent mode={mode} textEn={c.textEn} scaffoldDe={c.scaffoldDe} />
              </button>
            ))}
          </div>
        ) : (
          <button className="dg-btn" style={{ marginTop: 14 }} onClick={() => go(sNext)}>{sNext === null ? "Finish chapter →" : "Next →"}</button>
        )}
      </section>

      <div style={{ marginTop: 14 }}>{clueList}</div>
    </main>
  );
}
