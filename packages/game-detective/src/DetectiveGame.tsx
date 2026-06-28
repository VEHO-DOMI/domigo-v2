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
import type { ResolvedItem } from "@domigo/game-core";
import { GrammarItemView, VocabItemView, type ResultDetail } from "@domigo/task-ui";
import { CharacterChip, EvidenceBoard, characterPalette } from "./art.tsx";
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
  chapter: Chapter;
  castNames: Record<string, string>;
  storyItems: Record<string, ResolvedItem>;
  /** Due-item "re-interview" beat (Phase 4 spaced retrieval) — shown before the chapter on a fresh start. */
  reviewItems?: ResolvedItem[];
  onAttempt: AttemptFn;
  initialSave?: DetectiveSave | null;
  onSave?: (s: DetectiveSave) => void;
  art?: DetectiveArt | null;
}

const wrap: CSSProperties = { maxWidth: 640, margin: "0 auto", fontFamily: "system-ui, sans-serif" };
const scenePanel: CSSProperties = { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "18px 20px", boxShadow: "0 1px 3px rgba(0,0,0,.06)" };
const btn: CSSProperties = { marginTop: 14, background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 15, cursor: "pointer" };
const choiceBtn: CSSProperties = { ...btn, marginTop: 0, background: "#0ea5e9", textAlign: "left" };

function humanize(slot: string): string {
  const s = slot.replace(/[-_]/g, " ");
  return s.charAt(0).toUpperCase() + s.slice(1);
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
    <div style={{ marginTop: 14, borderTop: "1px solid #e2e8f0", paddingTop: 12 }}>
      <div style={{ fontSize: 12, color: "#b45309", fontWeight: 600, marginBottom: 6 }}>{COPY.cluePrompt}</div>
      {item.kind === "grammar"
        ? <GrammarItemView key={item.item.id} item={item.item as GrammarItem} onResult={onResult} hideXp hideHint={hideHint} />
        : <VocabItemView key={item.item.id} item={item.item as VocabItem} onResult={onResult} hideXp hideHint={hideHint} />}
      {line && <div style={{ marginTop: 10, fontWeight: 700, fontSize: 14, color: line.good ? "#15803d" : "#b91c1c" }}>{line.text}</div>}
      {res && <button style={btn} onClick={onContinue}>{COPY.continue}</button>}
    </div>
  );
}

export function DetectiveGame(props: DetectiveGameProps) {
  const { chapter, castNames, storyItems, onAttempt, onSave, caseTitle, art } = props;
  const byId = new Map(chapter.scenes.map((s) => [s.id, s]));
  const resume = props.initialSave && props.initialSave.chapterId === chapter.id ? props.initialSave : null;
  const first = chapter.scenes[0]?.id ?? "";

  const [sceneId, setSceneId] = useState(resume && byId.has(resume.sceneId) ? resume.sceneId : first);
  const [clues, setClues] = useState<string[]>(resume?.clues ?? []);
  const [taskDone, setTaskDone] = useState(false);
  const [showGloss, setShowGloss] = useState(false);
  const [showDe, setShowDe] = useState(false);
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
    setShowGloss(false);
    setShowDe(false);
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
          <h1 style={{ fontSize: 20, margin: 0 }}>{caseTitle} <span style={{ color: "#94a3b8", fontSize: 14, fontWeight: 400 }}>· re-check the notes</span></h1>
          <a href="/play/2" style={{ fontSize: 14, color: "#2563eb" }}>← Cases</a>
        </div>
        <section style={{ ...scenePanel, borderLeft: "4px solid #b45309" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#b45309", marginBottom: 2 }}>🔍 Mina &amp; Theo</div>
          <p style={{ fontSize: 18, margin: "6px 0 4px", lineHeight: 1.4 }}>
            Before the new case — one more look at an old clue.{reviewItems.length > 1 ? ` (${reviewIdx + 1}/${reviewItems.length})` : ""}
          </p>
          <TaskClue item={rItem} onAttempt={onAttempt} onSolved={() => {}} onContinue={() => setReviewIdx((i) => i + 1)} onScored={onScored} hideHint={fadeHints} />
        </section>
        <div style={{ marginTop: 14 }}>{clueList}</div>
      </main>
    );
  }

  if (done || !scene) {
    return (
      <main style={{ ...wrap, padding: "28px 16px" }}>
        {art?.endCard && <img src={art.endCard} alt="" style={{ width: "100%", maxHeight: 260, objectFit: "cover", borderRadius: 14, marginBottom: 14, border: "1px solid #e2e8f0" }} />}
        <h1 style={{ fontSize: 22 }}>Case File complete! 🗂️</h1>
        <p style={{ color: "#0f172a", fontSize: 17 }}>New <strong>evidence</strong> (= Beweis) found: <strong>{EVIDENCE[chapter.id] ?? "a new clue"}</strong>.</p>
        <p style={{ color: "#64748b", fontSize: 14 }}>You found {clues.length} clue{clues.length === 1 ? "" : "s"} in this case file. It goes on your evidence board.</p>
        <a href="/play/2" style={{ color: "#2563eb", fontSize: 14 }}>← Back to your cases</a>
      </main>
    );
  }

  const slot = scene.taskSlots[0];
  const slotItem = slot ? storyItems[slot.itemId] : undefined;
  const taskBlocks = slot !== undefined && slotItem !== undefined && !taskDone;
  const sNext = scene.next;
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
        <h1 style={{ fontSize: 20, margin: 0 }}>{caseTitle} <span style={{ color: "#94a3b8", fontSize: 14, fontWeight: 400 }}>· {chapter.titleEn}</span></h1>
        <a href="/play/2" style={{ fontSize: 14, color: "#2563eb" }}>← Cases</a>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
          <span style={{ color: "#64748b" }}>{COPY.caseProgress}</span>
          <span style={{ fontWeight: trailMsg ? 700 : 400, color: trailMsg ? "#b45309" : "#64748b" }}>{trailMsg ?? `${clues.length}/${totalTasks} clues`}</span>
        </div>
        <div style={{ height: 8, background: "#e2e8f0", borderRadius: 999, overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: "#16a34a", borderRadius: 999, transition: "width .3s" }} />
        </div>
      </div>

      {topImg && <img src={topImg} alt="" style={{ width: "100%", maxHeight: 220, objectFit: "cover", borderRadius: 14, marginBottom: 12, border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,.06)" }} />}

      <section style={{ ...scenePanel, borderLeft: `4px solid ${palette.shirt}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 2 }}>
          {portraitUrl
            ? <img src={portraitUrl} alt={speakerName} width={46} height={46} style={{ borderRadius: "50%", objectFit: "cover", flex: "0 0 auto", border: `2px solid ${palette.shirt}` }} />
            : <CharacterChip charKey={scene.speaker} name={speakerName} />}
          <div style={{ fontSize: 15, fontWeight: 700, color: palette.shirt }}>{speakerName}</div>
        </div>
        <p style={{ fontSize: 19, margin: "6px 0 4px", lineHeight: 1.4 }}>{scene.textEn}</p>
        {scene.scaffoldDe && (
          <div style={{ fontSize: 13, margin: "2px 0 4px" }}>
            <button style={{ ...btn, marginTop: 0, background: "#e2e8f0", color: "#0f172a", padding: "3px 9px", fontSize: 12 }} aria-expanded={showDe} onClick={() => setShowDe((d) => !d)}>
              {showDe ? COPY.deHide : COPY.deShow}
            </button>
            {showDe && <p style={{ fontSize: 14, color: "#64748b", margin: "6px 0 0" }}>{scene.scaffoldDe}</p>}
          </div>
        )}
        {scene.glosses.length > 0 && (
          <div style={{ fontSize: 13 }}>
            <button style={{ ...btn, marginTop: 4, background: "#e2e8f0", color: "#0f172a", padding: "4px 10px", fontSize: 13 }} onClick={() => setShowGloss((g) => !g)}>
              {showGloss ? "Hide word help" : "Show word help"}
            </button>
            {showGloss && <ul style={{ margin: "8px 0 0", paddingLeft: 18, color: "#334155" }}>{scene.glosses.map((g) => <li key={g.word}>{g.word} = {g.de}</li>)}</ul>}
          </div>
        )}

        {taskBlocks ? (
          <TaskClue item={slotItem} onAttempt={onAttempt} onSolved={() => addClue(slot.slot)} onContinue={() => setTaskDone(true)} onScored={onScored} hideHint={fadeHints} />
        ) : Array.isArray(sNext) ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }}>
            {sNext.map((c) => <button key={c.id} style={choiceBtn} onClick={() => go(c.next)}>{c.textEn}</button>)}
          </div>
        ) : (
          <button style={btn} onClick={() => go(sNext)}>{sNext === null ? "Finish chapter →" : "Next →"}</button>
        )}
      </section>

      <div style={{ marginTop: 14 }}>{clueList}</div>
    </main>
  );
}
