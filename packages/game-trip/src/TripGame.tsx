"use client";
/**
 * @domigo/game-trip — the G4 "Lost for Words" surface (DOM + SVG, no Phaser).
 * Walks a story@1 chapter as one day of the Sprachwoche in Leicester, and is the
 * app's FIRST flag-aware story runtime (BLUEPRINT III.4):
 *   - Choice.sets writes narrative flags into the cosmetic save (story-scoped —
 *     they survive chapter changes, unlike position);
 *   - Scene.next FlagGate resolves then/else against the save's flags (a wiped
 *     save = no flags = the authored neutral `else`, per the wiped-save doctrine);
 *   - Scene.flagLines swap a line's textEn/scaffoldDe/glosses when their flag is
 *     set (choice callbacks — the story remembering what you did).
 * Flags gate flavor and scene selection only — never items, tiers or XP (Law 2).
 * Tasks render through the ONE task renderer (@domigo/task-ui); the app injects
 * onAttempt (mode:"game:g4"). Rewards are the journal economy — "+N lines",
 * "the words are coming", a stamped day per chapter — never bare "+XP" (Law 5).
 */
import { useState, type CSSProperties, type ReactNode } from "react";
import type { Chapter, Choice, GrammarItem, Scene, VocabItem } from "@domigo/content-schema";
import { xpForTier, type Tier } from "@domigo/engine";
import type { ResolvedItem } from "@domigo/game-core";
import { GrammarItemView, VocabItemView, type ResultDetail } from "@domigo/task-ui";
import { CastAvatar, castLook } from "./art.tsx";
import { COPY, DAY_STAMP, resultLine, slotPrompt, trailLabel } from "./trip-copy.ts";

export interface GameAttempt {
  clientAttemptId: string;
  itemId: string;
  mode: string;
  input: unknown;
  latencyMs: number | null;
  hintUsed: boolean;
}
export type AttemptFn = (a: GameAttempt) => Promise<{ ok: boolean; queued: boolean; streak?: number }>;

/**
 * Cosmetic save. Position + entries are chapter-scoped (a new chapter starts
 * fresh); `flags` are STORY-scoped — they must travel from ch04's choice to
 * ch05's dinner line and beyond, so they are kept on every save regardless of
 * which chapter wrote them. Losing this save loses nothing real (Law 2): a
 * wiped save replays with the neutral defaults.
 */
export interface TripSave {
  chapterId: string;
  sceneId: string;
  /** solved task slot names this chapter (journal lines in the can) */
  entries: string[];
  /** set narrative flags, story-scoped (e.g. "w04.said") */
  flags: string[];
}

/** Server-resolved art URLs (only stems present on disk; missing → procedural fallback). */
export interface TripArt {
  base: string;
  backdrop: string | null;
  endCard: string | null;
  portraits: Record<string, string>; // sceneId → url
  beats: Record<string, string>; // sceneId → url
  panels: Record<string, string>; // slot → url
}

export interface TripGameProps {
  dayTitle: string;
  chapter: Chapter;
  castNames: Record<string, string>;
  storyItems: Record<string, ResolvedItem>;
  /** Due-item review beat (Phase 4 spaced retrieval) — lands in a later PR; optional. */
  reviewItems?: ResolvedItem[];
  onAttempt: AttemptFn;
  initialSave?: TripSave | null;
  onSave?: (s: TripSave) => void;
  art?: TripArt | null;
}

const wrap: CSSProperties = { maxWidth: 640, margin: "0 auto", fontFamily: "var(--font-body)", color: "var(--text)" };
const panel: CSSProperties = { background: "var(--card)", borderWidth: 1, borderStyle: "solid", borderColor: "var(--card-border)", borderRadius: 20, padding: "16px 18px", boxShadow: "var(--shadow-card)", backdropFilter: "blur(20px)" };

/** Read a line aloud via the browser voice (A2+ pace). No TTS provider needed. */
function speak(text: string): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-GB";
  u.rate = 0.92;
  window.speechSynthesis.speak(u);
}

function TaskLine({ item, prompt, onAttempt, onContinue, onScored, hideHint }: {
  item: ResolvedItem; prompt: string; onAttempt: AttemptFn; onContinue: () => void; onScored: (tier: Tier) => void; hideHint?: boolean;
}) {
  const [res, setRes] = useState<{ tier: Tier; lines: number } | null>(null);
  const onResult = (tier: Tier, detail: ResultDetail) => {
    const lines = xpForTier((item.item.difficulty ?? 1) * 10, tier);
    setRes({ tier, lines });
    void onAttempt({ clientAttemptId: crypto.randomUUID(), itemId: detail.itemId, mode: "game:g4", input: detail.input, latencyMs: null, hintUsed: false });
    onScored(tier);
  };
  const line = res ? resultLine(res.tier, res.lines) : null;
  return (
    <div style={{ marginTop: 14, borderTop: "1px dashed var(--card-border)", paddingTop: 12 }}>
      <div style={{ fontSize: 12, color: "var(--accent)", fontWeight: 700, marginBottom: 6, fontFamily: "var(--font-label)", letterSpacing: "0.02em" }}>{prompt}</div>
      {item.kind === "grammar"
        ? <GrammarItemView key={item.item.id} item={item.item as GrammarItem} onResult={onResult} hideXp hideHint={hideHint} />
        : <VocabItemView key={item.item.id} item={item.item as VocabItem} onResult={onResult} hideXp hideHint={hideHint} />}
      {line && <div style={{ marginTop: 10, fontWeight: 700, fontSize: 14, color: line.good ? "var(--correct)" : "var(--ink-soft)" }}>{line.text}</div>}
      {res && <button className="dg-btn" style={{ marginTop: 14 }} onClick={onContinue}>{COPY.continue}</button>}
    </div>
  );
}

export function TripGame(props: TripGameProps) {
  const { chapter, castNames, storyItems, onAttempt, onSave, dayTitle, art } = props;
  const byId = new Map(chapter.scenes.map((s) => [s.id, s]));
  // Position/entries resume only within the same chapter; flags ALWAYS carry.
  const resume = props.initialSave && props.initialSave.chapterId === chapter.id ? props.initialSave : null;
  const first = chapter.scenes[0]?.id ?? "";

  const [sceneId, setSceneId] = useState(resume && byId.has(resume.sceneId) ? resume.sceneId : first);
  const [entries, setEntries] = useState<string[]>(resume?.entries ?? []);
  const [flags, setFlags] = useState<string[]>(props.initialSave?.flags ?? []);
  const [taskDone, setTaskDone] = useState(false);
  const [showGloss, setShowGloss] = useState(false);
  const [showDe, setShowDe] = useState(false);
  const [trail, setTrail] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    return Number(sessionStorage.getItem("domigo:g4:trail")) || 0;
  });
  const [done, setDone] = useState(false);
  const fadeHints = chapter.unit >= 8; // scaffold fade — "by now you live in English"

  const onScored = (tier: Tier): void => setTrail((t) => {
    const next = tier === "correct" || tier === "partial" ? t + 1 : 0;
    try { sessionStorage.setItem("domigo:g4:trail", String(next)); } catch { /* private mode */ }
    return next;
  });

  const scene: Scene | undefined = byId.get(sceneId);
  const save = (over: Partial<TripSave>) => onSave?.({ chapterId: chapter.id, sceneId, entries, flags, ...over });

  const addEntry = (slot: string): void => {
    setEntries((prev) => (prev.includes(slot) ? prev : (() => { const n = [...prev, slot]; save({ entries: n }); return n; })()));
  };

  const go = (nextId: string | null, withFlags?: string[]): void => {
    setTaskDone(false);
    setShowGloss(false);
    setShowDe(false);
    if (nextId === null) { setDone(true); save({ flags: withFlags ?? flags }); return; }
    setSceneId(nextId);
    save({ sceneId: nextId, flags: withFlags ?? flags });
  };

  /** A choice may set flags — merge them BEFORE the save that moves the scene,
   *  so a mid-choice tab-kill can never lose the consequence (Law 9). */
  const choose = (c: Choice): void => {
    let nextFlags = flags;
    if (c.sets !== undefined && c.sets.length > 0) {
      nextFlags = [...new Set([...flags, ...c.sets])];
      setFlags(nextFlags);
    }
    go(c.next, nextFlags);
  };

  if (done) {
    const stamp = DAY_STAMP[chapter.id];
    return (
      <main style={{ ...wrap, padding: "28px 16px" }}>
        {art?.endCard && <img src={art.endCard} alt="" style={{ width: "100%", maxHeight: 260, objectFit: "cover", borderRadius: 16, marginBottom: 14, border: "1px solid var(--card-border)" }} />}
        <h1 style={{ fontSize: 26, margin: "0 0 6px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Day stamped! 🖋️</h1>
        <p style={{ fontSize: 18, color: "var(--text)", marginTop: 0 }}>
          <strong>{dayTitle}</strong> is in your journal.
        </p>
        {stamp && <p style={{ fontSize: 15, color: "var(--text-secondary)", fontStyle: "italic", borderLeft: "3px solid var(--accent)", paddingLeft: 12 }}>{stamp}</p>}
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>You wrote {entries.length} line{entries.length === 1 ? "" : "s"} today.</p>
        <a href="/play/4" style={{ color: "var(--accent)", fontSize: 14, fontWeight: 700 }}>{COPY.backToJournal}</a>
      </main>
    );
  }

  if (!scene) {
    return (
      <main style={{ ...wrap, padding: "28px 16px" }}>
        <h1 style={{ fontSize: 22, fontFamily: "var(--font-display)", color: "var(--ink)" }}>Day complete! 🖋️</h1>
        <a href="/play/4" style={{ color: "var(--accent)", fontSize: 14, fontWeight: 700 }}>{COPY.backToJournal}</a>
      </main>
    );
  }

  // Flag-conditioned line: the first flagLine whose flag is set replaces the
  // scene's base line (base = the authored neutral, shown on a wiped save).
  const flagLine = scene.flagLines?.find((l) => flags.includes(l.flag));
  const lineText = flagLine?.textEn ?? scene.textEn;
  const lineScaffold = flagLine !== undefined ? flagLine.scaffoldDe : scene.scaffoldDe;
  const lineGlosses = flagLine !== undefined ? flagLine.glosses : scene.glosses;

  const slot = scene.taskSlots[0];
  const slotItem = slot ? storyItems[slot.itemId] : undefined;
  const taskBlocks = slot !== undefined && slotItem !== undefined && !taskDone;
  // The flag-aware next: a FlagGate routes then/else against the save's flags.
  const rawNext = scene.next;
  const sNext = rawNext !== null && typeof rawNext === "object" && !Array.isArray(rawNext)
    ? (flags.includes(rawNext.flag) ? rawNext.then : rawNext.else)
    : rawNext;
  const isNarrator = scene.speaker === "narrator";
  const speakerName = castNames[scene.speaker] ?? scene.speaker;
  const look = castLook(scene.speaker);
  const portraitUrl = art?.portraits[scene.id];
  const topImg = art?.beats[scene.id] ?? art?.backdrop ?? null;
  const totalTasks = chapter.scenes.reduce((n, s) => n + s.taskSlots.length, 0);
  const pct = totalTasks ? Math.round((entries.length / totalTasks) * 100) : 0;
  const trailMsg = trailLabel(trail);

  const scaffoldNode = (
    <>
      {lineScaffold && (
        <div style={{ fontSize: 13, margin: "10px 0 2px" }}>
          <button className="dg-chip" aria-expanded={showDe} onClick={() => setShowDe((d) => !d)}>
            {showDe ? COPY.deHide : COPY.deShow}
          </button>
          {showDe && <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: "6px 0 0" }}>{lineScaffold}</p>}
        </div>
      )}
      {lineGlosses.length > 0 && (
        <div style={{ fontSize: 13, marginTop: 6 }}>
          <button className="dg-chip" aria-expanded={showGloss} onClick={() => setShowGloss((g) => !g)}>
            {showGloss ? "Hide word help" : "Show word help"}
          </button>
          {showGloss && <ul style={{ margin: "8px 0 0", paddingLeft: 18, color: "var(--text-secondary)" }}>{lineGlosses.map((g) => <li key={g.word}>{g.word} = {g.de}</li>)}</ul>}
        </div>
      )}
    </>
  );

  let taskOrNav: ReactNode;
  if (taskBlocks && slot && slotItem) {
    taskOrNav = (
      <TaskLine
        item={slotItem}
        prompt={slotPrompt(slot.slot)}
        onAttempt={onAttempt}
        onScored={onScored}
        onContinue={() => { addEntry(slot.slot); setTaskDone(true); }}
        hideHint={fadeHints}
      />
    );
  } else if (Array.isArray(sNext)) {
    // The fork. Choices carry their own scaffoldDe (weighty moments deserve the
    // German anchor); never graded, never labeled right/wrong (Law 3 as tone).
    taskOrNav = (
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }}>
        {sNext.map((c) => (
          <button key={c.id} className="dg-btn-secondary" style={{ textAlign: "left", justifyContent: "flex-start", display: "block" }} onClick={() => choose(c)}>
            <span style={{ display: "block" }}>{c.textEn}</span>
            {c.scaffoldDe && <span style={{ display: "block", fontSize: 12, fontWeight: 400, color: "var(--text-secondary)", marginTop: 3 }}>{c.scaffoldDe}</span>}
          </button>
        ))}
      </div>
    );
  } else {
    taskOrNav = <button className="dg-btn" style={{ marginTop: 14 }} onClick={() => go(sNext)}>{sNext === null ? COPY.finishChapter : COPY.next}</button>;
  }

  return (
    <main style={{ ...wrap, padding: "16px 12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
        <h1 style={{ fontSize: 21, margin: 0, fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--ink)" }}>LOST FOR WORDS <span style={{ color: "var(--muted)", fontSize: 14, fontWeight: 400, fontFamily: "var(--font-body)" }}>· {chapter.titleEn}</span></h1>
        <a href="/play/4" style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>← Journal</a>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
          <span style={{ color: "var(--muted)", fontFamily: "var(--font-label)", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>{COPY.journalProgress}</span>
          <span style={{ fontWeight: 700, color: trailMsg ? "var(--accent)" : "var(--text-secondary)" }}>{trailMsg ?? `${entries.length}/${totalTasks} lines`}</span>
        </div>
        <div className="xp-track">
          <div className="xp-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {topImg && <img src={topImg} alt="" style={{ width: "100%", maxHeight: 220, objectFit: "cover", borderRadius: 16, marginBottom: 12, border: "1px solid var(--card-border)" }} />}

      {isNarrator ? (
        <section style={{ ...panel, background: "var(--accent-soft)", color: "var(--ink-soft)" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
            <p style={{ fontSize: 16, margin: 0, lineHeight: 1.45, flex: 1, fontStyle: "italic" }}>{lineText}</p>
            <button onClick={() => speak(lineText)} aria-label="Read aloud" title="Read aloud" style={{ background: "none", border: "none", cursor: "pointer", fontSize: 17, padding: 2 }}>🔊</button>
          </div>
          {scaffoldNode}
          {taskOrNav}
        </section>
      ) : (
        <section style={{ ...panel, boxShadow: `inset 5px 0 0 ${look.shirt}, var(--shadow-card)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            {portraitUrl
              ? <img src={portraitUrl} alt={speakerName} width={46} height={46} style={{ borderRadius: "50%", objectFit: "cover", flex: "0 0 auto", border: `2px solid ${look.shirt}` }} />
              : <CastAvatar charKey={scene.speaker} name={speakerName} />}
            <div style={{ fontSize: 15, fontWeight: 700, color: look.shirt, fontFamily: "var(--font-display)" }}>{speakerName}</div>
            <button onClick={() => speak(lineText)} aria-label="Read the line aloud" title="Read aloud" style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", fontSize: 18, lineHeight: 1, padding: 2 }}>🔊</button>
          </div>
          <div style={{ background: "var(--bg-sunken)", border: "1px solid var(--card-border)", borderRadius: 14, padding: "11px 15px" }}>
            <p style={{ fontSize: 19, margin: 0, lineHeight: 1.4, color: "var(--text)" }}>{lineText}</p>
          </div>
          {scaffoldNode}
          {taskOrNav}
        </section>
      )}
    </main>
  );
}
