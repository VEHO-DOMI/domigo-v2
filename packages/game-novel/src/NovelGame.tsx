"use client";
/**
 * @domigo/game-novel — the G3 "FOURTEEN" surface (DOM + SVG panels, no Phaser).
 * Walks a story@1 chapter as an episode of a YouTube grammar channel: comic-panel
 * dialogue (EN, German + word-glosses on tap — G3 is A2/A2+), embedded taskSlots
 * rendered by the ONE task renderer (@domigo/task-ui), and — the signature beat —
 * a COMMENT SECTION that renders after the "fix Ben's script" tasks, toned by how
 * accurately the player protected him (Law-2 derived from the in-session takes).
 * Rewards are the production economy — views (the hidden XP), trending, a Subscriber
 * milestone per episode — never bare "+XP". The app injects onAttempt (mode:"game:g3").
 */
import { useState, type CSSProperties, type ReactNode } from "react";
import type { Chapter, GrammarItem, Scene, VocabItem } from "@domigo/content-schema";
import { xpForTier, type Tier } from "@domigo/engine";
import type { ResolvedItem } from "@domigo/game-core";
import { GrammarItemView, VocabItemView, type ResultDetail } from "@domigo/task-ui";
import { CastAvatar, CommentSection, castLook } from "./art.tsx";
import { COPY, SUBSCRIBERS, episodeComments, resultLine, slotPrompt, trailLabel, type CommentBand } from "./novel-copy.ts";

export interface GameAttempt {
  clientAttemptId: string;
  itemId: string;
  mode: string;
  input: unknown;
  latencyMs: number | null;
  hintUsed: boolean;
}
export type AttemptFn = (a: GameAttempt) => Promise<{ ok: boolean; queued: boolean; streak?: number }>;

/** Cosmetic save — where in the episode + which "takes" (solved slots) are in the can. */
export interface NovelSave {
  chapterId: string;
  sceneId: string;
  takes: string[];
}

/** Server-resolved art URLs (only stems present on disk; missing → procedural fallback). */
export interface NovelArt {
  base: string;
  backdrop: string | null;
  endCard: string | null;
  portraits: Record<string, string>; // sceneId → url
  beats: Record<string, string>; // sceneId → url
  panels: Record<string, string>; // slot → url
}

export interface NovelGameProps {
  episodeTitle: string;
  chapter: Chapter;
  castNames: Record<string, string>;
  storyItems: Record<string, ResolvedItem>;
  /** Due-item review beat (Phase 4 spaced retrieval) — lands in a later PR; optional. */
  reviewItems?: ResolvedItem[];
  onAttempt: AttemptFn;
  initialSave?: NovelSave | null;
  onSave?: (s: NovelSave) => void;
  art?: NovelArt | null;
}

const wrap: CSSProperties = { maxWidth: 640, margin: "0 auto", fontFamily: "var(--font-body)", color: "var(--text)" };
const panel: CSSProperties = { background: "var(--card)", borderWidth: 1, borderStyle: "solid", borderColor: "var(--card-border)", borderRadius: 20, padding: "16px 18px", boxShadow: "var(--shadow-card)", backdropFilter: "blur(20px)" };

/** A slot whose name starts with "fix" is an on-camera "fix Ben's line" task — the
 *  ones whose accuracy drives the comment section. Lets content opt in per episode. */
function isFixSlot(slot: string): boolean {
  return /^fix(-|$)/.test(slot);
}

/** The authored emotional band of an episode (the consequence's ceiling). */
function bandForUnit(unit: number): CommentBand {
  if (unit <= 5) return "warm";
  if (unit <= 10) return "tense";
  return "reckoning";
}

/** Read a line aloud via the browser voice (A2 pace). No TTS provider needed. */
function speak(text: string): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-GB";
  u.rate = 0.9;
  window.speechSynthesis.speak(u);
}

function TaskTake({ item, prompt, onAttempt, onContinue, onScored, hideHint }: {
  item: ResolvedItem; prompt: string; onAttempt: AttemptFn; onContinue: () => void; onScored: (tier: Tier) => void; hideHint?: boolean;
}) {
  const [res, setRes] = useState<{ tier: Tier; views: number } | null>(null);
  const onResult = (tier: Tier, detail: ResultDetail) => {
    const views = xpForTier((item.item.difficulty ?? 1) * 10, tier);
    setRes({ tier, views });
    void onAttempt({ clientAttemptId: crypto.randomUUID(), itemId: detail.itemId, mode: "game:g3", input: detail.input, latencyMs: null, hintUsed: false });
    onScored(tier);
  };
  const line = res ? resultLine(item.kind, res.tier, res.views) : null;
  return (
    <div style={{ marginTop: 14, borderTop: "1px dashed var(--card-border)", paddingTop: 12 }}>
      <div style={{ fontSize: 12, color: "var(--accent)", fontWeight: 700, marginBottom: 6, fontFamily: "var(--font-label)", letterSpacing: "0.02em" }}>{prompt}</div>
      {item.kind === "grammar"
        ? <GrammarItemView key={item.item.id} item={item.item as GrammarItem} onResult={onResult} hideXp hideHint={hideHint} />
        : <VocabItemView key={item.item.id} item={item.item as VocabItem} onResult={onResult} hideXp hideHint={hideHint} />}
      {line && <div style={{ marginTop: 10, fontWeight: 700, fontSize: 14, color: line.good ? "var(--correct)" : "var(--incorrect)" }}>{line.text}</div>}
      {res && <button className="dg-btn" style={{ marginTop: 14 }} onClick={onContinue}>{COPY.continue}</button>}
    </div>
  );
}

export function NovelGame(props: NovelGameProps) {
  const { chapter, castNames, storyItems, onAttempt, onSave, episodeTitle, art } = props;
  const byId = new Map(chapter.scenes.map((s) => [s.id, s]));
  const resume = props.initialSave && props.initialSave.chapterId === chapter.id ? props.initialSave : null;
  const first = chapter.scenes[0]?.id ?? "";
  const band = bandForUnit(chapter.unit);

  const [sceneId, setSceneId] = useState(resume && byId.has(resume.sceneId) ? resume.sceneId : first);
  const [takes, setTakes] = useState<string[]>(resume?.takes ?? []);
  const [taskDone, setTaskDone] = useState(false);
  const [showGloss, setShowGloss] = useState(false);
  const [showDe, setShowDe] = useState(false);
  const [trail, setTrail] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    return Number(sessionStorage.getItem("domigo:g3:trail")) || 0;
  });
  const [done, setDone] = useState(false);
  // The signature mechanic: tiers of the on-camera "fix Ben's line" tasks this run.
  const [fixTiers, setFixTiers] = useState<Tier[]>([]);
  const [showComments, setShowComments] = useState(false);
  const fadeHints = chapter.unit >= 8; // scaffold fade for the later half of G3

  const onScored = (tier: Tier): void => setTrail((t) => {
    const next = tier === "correct" || tier === "partial" ? t + 1 : 0;
    try { sessionStorage.setItem("domigo:g3:trail", String(next)); } catch { /* private mode */ }
    return next;
  });

  const scene: Scene | undefined = byId.get(sceneId);
  const save = (over: Partial<NovelSave>) => onSave?.({ chapterId: chapter.id, sceneId, takes, ...over });

  const addTake = (slot: string): void => {
    setTakes((prev) => (prev.includes(slot) ? prev : (() => { const n = [...prev, slot]; save({ takes: n }); return n; })()));
  };

  const go = (nextId: string | null): void => {
    setTaskDone(false);
    setShowGloss(false);
    setShowDe(false);
    setShowComments(false);
    if (nextId === null) { setDone(true); return; }
    setSceneId(nextId);
    save({ sceneId: nextId });
  };

  if (done) {
    const subs = SUBSCRIBERS[chapter.id];
    return (
      <main style={{ ...wrap, padding: "28px 16px" }}>
        {art?.endCard && <img src={art.endCard} alt="" style={{ width: "100%", maxHeight: 260, objectFit: "cover", borderRadius: 16, marginBottom: 14, border: "1px solid var(--card-border)" }} />}
        <h1 style={{ fontSize: 26, margin: "0 0 6px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Episode uploaded! 🎬</h1>
        <p style={{ fontSize: 18, color: "var(--text)", marginTop: 0 }}>
          <strong>{episodeTitle}</strong> is live.{subs ? <> The channel just hit <strong>{subs} subscribers</strong>.</> : null}
        </p>
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>You wrote {takes.length} clean take{takes.length === 1 ? "" : "s"} this episode.</p>
        <a href="/play/3" style={{ color: "var(--accent)", fontSize: 14, fontWeight: 700 }}>← Back to the channel</a>
      </main>
    );
  }

  if (!scene) {
    return (
      <main style={{ ...wrap, padding: "28px 16px" }}>
        <h1 style={{ fontSize: 22, fontFamily: "var(--font-display)", color: "var(--ink)" }}>Episode complete! 🎬</h1>
        <a href="/play/3" style={{ color: "var(--accent)", fontSize: 14, fontWeight: 700 }}>← Back to the channel</a>
      </main>
    );
  }

  const slot = scene.taskSlots[0];
  const slotItem = slot ? storyItems[slot.itemId] : undefined;
  const taskBlocks = slot !== undefined && slotItem !== undefined && !taskDone;
  const sNext = scene.next;
  const isNarrator = scene.speaker === "narrator";
  const speakerName = castNames[scene.speaker] ?? scene.speaker;
  const look = castLook(scene.speaker);
  const portraitUrl = art?.portraits[scene.id];
  const topImg = art?.beats[scene.id] ?? art?.backdrop ?? null;
  const totalTasks = chapter.scenes.reduce((n, s) => n + s.taskSlots.length, 0);
  const pct = totalTasks ? Math.round((takes.length / totalTasks) * 100) : 0;
  const trailMsg = trailLabel(trail);

  // The comment beat fires once, after a finished on-camera "fix Ben" take.
  const fixHere = slot !== undefined && isFixSlot(slot.slot);
  const commentBeat = fixHere && taskDone && showComments;
  const cmt = commentBeat ? episodeComments(fixTiers.filter((t) => t === "correct").length, fixTiers.length, band) : null;

  const scaffoldNode = (
    <>
      {scene.scaffoldDe && (
        <div style={{ fontSize: 13, margin: "10px 0 2px" }}>
          <button className="dg-chip" aria-expanded={showDe} onClick={() => setShowDe((d) => !d)}>
            {showDe ? COPY.deHide : COPY.deShow}
          </button>
          {showDe && <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: "6px 0 0" }}>{scene.scaffoldDe}</p>}
        </div>
      )}
      {scene.glosses.length > 0 && (
        <div style={{ fontSize: 13, marginTop: 6 }}>
          <button className="dg-chip" aria-expanded={showGloss} onClick={() => setShowGloss((g) => !g)}>
            {showGloss ? "Hide word help" : "Show word help"}
          </button>
          {showGloss && <ul style={{ margin: "8px 0 0", paddingLeft: 18, color: "var(--text-secondary)" }}>{scene.glosses.map((g) => <li key={g.word}>{g.word} = {g.de}</li>)}</ul>}
        </div>
      )}
    </>
  );

  let taskOrNav: ReactNode;
  if (commentBeat && cmt) {
    // The consequence beat: the comment section, then continue to the next scene.
    const after = typeof sNext === "string" ? sNext : null;
    taskOrNav = (
      <div style={{ marginTop: 6 }}>
        <CommentSection comments={cmt.comments} line={cmt.line} label="The comments are in…" />
        <button className="dg-btn" style={{ marginTop: 14 }} onClick={() => go(after)}>{COPY.continue}</button>
      </div>
    );
  } else if (taskBlocks && slot && slotItem) {
    const fix = isFixSlot(slot.slot);
    taskOrNav = (
      <TaskTake
        item={slotItem}
        prompt={slotPrompt(slot.slot)}
        onAttempt={onAttempt}
        onScored={(tier) => { onScored(tier); if (fix) setFixTiers((p) => [...p, tier]); }}
        onContinue={() => { addTake(slot.slot); setTaskDone(true); if (fix) setShowComments(true); }}
        hideHint={fadeHints}
      />
    );
  } else if (Array.isArray(sNext)) {
    taskOrNav = (
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }}>
        {sNext.map((c) => <button key={c.id} className="dg-btn-secondary" style={{ textAlign: "left", justifyContent: "flex-start" }} onClick={() => go(c.next)}>{c.textEn}</button>)}
      </div>
    );
  } else {
    taskOrNav = <button className="dg-btn" style={{ marginTop: 14 }} onClick={() => go(sNext)}>{sNext === null ? COPY.finishEpisode : COPY.next}</button>;
  }

  return (
    <main style={{ ...wrap, padding: "16px 12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
        <h1 style={{ fontSize: 21, margin: 0, fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--ink)" }}>FOURTEEN <span style={{ color: "var(--muted)", fontSize: 14, fontWeight: 400, fontFamily: "var(--font-body)" }}>· {chapter.titleEn}</span></h1>
        <a href="/play/3" style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>← Channel</a>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
          <span style={{ color: "var(--muted)", fontFamily: "var(--font-label)", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>{COPY.channelProgress}</span>
          <span style={{ fontWeight: 700, color: trailMsg ? "var(--accent)" : "var(--text-secondary)" }}>{trailMsg ?? `${takes.length}/${totalTasks} takes`}</span>
        </div>
        <div className="xp-track">
          <div className="xp-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {topImg && <img src={topImg} alt="" style={{ width: "100%", maxHeight: 220, objectFit: "cover", borderRadius: 16, marginBottom: 12, border: "1px solid var(--card-border)" }} />}

      {isNarrator ? (
        <section style={{ ...panel, background: "var(--accent-soft)", color: "var(--ink-soft)" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
            <p style={{ fontSize: 16, margin: 0, lineHeight: 1.45, flex: 1, fontStyle: "italic" }}>{scene.textEn}</p>
            <button onClick={() => speak(scene.textEn)} aria-label="Read aloud" title="Read aloud" style={{ background: "none", border: "none", cursor: "pointer", fontSize: 17, padding: 2 }}>🔊</button>
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
            <button onClick={() => speak(scene.textEn)} aria-label="Read the line aloud" title="Read aloud" style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", fontSize: 18, lineHeight: 1, padding: 2 }}>🔊</button>
          </div>
          <div style={{ background: "var(--bg-sunken)", border: "1px solid var(--card-border)", borderRadius: 14, padding: "11px 15px" }}>
            <p style={{ fontSize: 19, margin: 0, lineHeight: 1.4, color: "var(--text)" }}>{scene.textEn}</p>
          </div>
          {scaffoldNode}
          {taskOrNav}
        </section>
      )}
    </main>
  );
}
