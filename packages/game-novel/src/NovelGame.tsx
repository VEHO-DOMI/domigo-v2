"use client";
/** FOURTEEN: authored audience, confirmed learning rewards, one shared grader. */
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Chapter, GrammarItem, VocabItem } from "@domigo/content-schema";
import type { Tier } from "@domigo/engine";
import { ChoiceContent, DialogueReveal, GlossReveal, LangToggle, primaryLine, useLangMode } from "@domigo/game-feel";
import { storyItemKey, type ResolvedItem } from "@domigo/game-core";
import { GrammarItemView, VocabItemView, type ResultDetail } from "@domigo/task-ui";
import { CastAvatar, CommentSection } from "./art.tsx";
import { COPY, episodeComments, fillChapterStats, resultLine, slotHelp, slotPrompt, type EpisodeStats } from "./novel-copy.ts";
import { audienceAt, bandForUnit, commentsAfter, episodeEnding, isFixSlot, restoredTakes, validTakes, type SavedTake } from "./episode-state.ts";
import { Audience } from "./audience.tsx";
import { answerState, restoredAnswerState, SAVE_COPY, type SaveState } from "./save-state.ts";
import "./novel.css";

export interface GameAttempt {
  clientAttemptId: string; itemId: string; mode: string; input: unknown; latencyMs: number | null; hintUsed: boolean;
}
export type AttemptFn = (a: GameAttempt) => Promise<{ ok: boolean; queued: boolean; streak?: number; tier?: Tier; xpAwarded?: number }>;
/** Cosmetic only. The season board still derives completion from the server ledger. */
export interface NovelSave {
  chapterId: string; sceneId: string; takes: string[];
  results?: Record<string, SavedTake>;
  stage?: "scene" | "comments" | "finished";
}
export interface NovelArt {
  base: string; backdrop: string | null; endCard: string | null;
  portraits: Record<string, string>; beats: Record<string, string>; panels: Record<string, string>;
}
export interface NovelGameProps {
  /** The teacher's acknowledgement is not a durable answer receipt. */
  preview?: boolean;
  episodeTitle: string; grade?: number; chapter: Chapter; castNames: Record<string, string>;
  storyItems: Record<string, ResolvedItem>; reviewItems?: ResolvedItem[]; onAttempt: AttemptFn;
  initialSave?: NovelSave | null; onSave?: (s: NovelSave) => void; art?: NovelArt | null;
  economy: readonly EpisodeStats[];
  /** Resolved against the release list on the server, never inferred from the URL. */
  nextEpisode?: { href: string; title: string } | null;
}

function speak(text: string): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text); u.lang = "en-GB"; u.rate = 0.9;
  window.speechSynthesis.speak(u);
}

type TakeResult = { tier: Tier; status: SaveState; points?: number };
function TaskTake({ item, prompt, promptHelp, preview, onAttempt, onContinue, onScored, initialResult }: {
  item: ResolvedItem; prompt: string; promptHelp: string; onAttempt: AttemptFn; onContinue: () => void;
  preview: boolean; onScored: (tier: Tier, status: "saved" | "queued" | "preview") => void; initialResult?: SavedTake;
}) {
  const [res, setRes] = useState<TakeResult | null>(initialResult ? { tier: initialResult.tier, status: restoredAnswerState(preview, initialResult.status) } : null);
  const [restoredAtMount] = useState(initialResult !== undefined);
  const [replaying, setReplaying] = useState(false);
  const [round, setRound] = useState(0);
  const attempt = useRef<GameAttempt | null>(null);
  const busy = useRef(false);
  const active = useRef(true);
  useEffect(() => { active.current = true; return () => { active.current = false; }; }, []);
  const submit = async (body: GameAttempt, localTier: Tier) => {
    if (busy.current) return;
    busy.current = true;
    setRes({ tier: localTier, status: preview ? "preview" : "saving" });
    try {
      const reply = await onAttempt(body);
      if (!active.current) return;
      const tier = preview ? localTier : reply.tier ?? localTier;
      const status = answerState(preview, reply);
      setRes({ tier, status, points: status === "saved" ? reply.xpAwarded : undefined });
      if (status === "saved" || status === "queued" || status === "preview") onScored(tier, status);
    } catch { if (active.current) setRes({ tier: localTier, status: "failed" }); }
    finally { busy.current = false; }
  };
  const onResult = (tier: Tier, detail: ResultDetail) => {
    const body = { clientAttemptId: crypto.randomUUID(), itemId: detail.itemId, mode: "game:g3", input: detail.input, latencyMs: null, hintUsed: false };
    attempt.current = body;
    void submit(body, tier);
  };
  const line = res ? resultLine(item.kind, res.tier, res.points) : null;
  const restored = restoredAtMount && !replaying;
  return <div className="fourteen-task" data-task-id={item.item.id} data-phase={res ? "response" : "draft"}>
    <div className="fourteen-task-step">{res ? "Your line (= Dein Text)" : "Your turn (= Du bist dran)"}</div>
    <div className="fourteen-task-label">{prompt}<details className="fourteen-end-help"><summary>Auf Deutsch?</summary><p>{promptHelp}</p></details></div>
    {restored ? <div><p>You have already worked on this line. (= Du hast diese Zeile schon bearbeitet.)</p></div> : item.kind === "grammar"
      ? <GrammarItemView key={`${item.item.id}:${round}`} item={item.item as GrammarItem} onResult={onResult} hideXp hideMeta hideExplanation retryMessage="Du kannst diese Zeile noch einmal versuchen." submitLabel="Send this line (= Abgeben)" singleAttempt tactile />
      : <VocabItemView key={`${item.item.id}:${round}`} item={item.item as VocabItem} onResult={onResult} hideXp hideMeta singleAttempt />}
    {res && line && <div className="fourteen-result" role="status" aria-live="polite">
      <strong>{res.tier === "correct" ? "Das ist dir gelungen" : res.tier === "wrong" ? "So passt der Text" : "Das passt schon teilweise"}</strong>
      <p>{item.kind === "grammar" ? (item.item as GrammarItem).explainDe : (item.item as VocabItem).g}</p>
      <p>{line.text}</p>
      {res.points !== undefined && <p className="fourteen-caption">Writing = deine Lernpunkte. Views = Aufrufe des Kanals.</p>}
      <p className="fourteen-save-state" data-save-state={res.status}>{SAVE_COPY[res.status]}</p>
      {res.status === "failed" && <button className="dg-btn-secondary" onClick={() => { if (attempt.current) void submit(attempt.current, res.tier); }}>Try saving again (= Noch einmal speichern)</button>}
    </div>}
    {res && (res.status === "saved" || res.status === "queued" || res.status === "unknown" || res.status === "preview") && <div className="fourteen-actions">
      <button className="dg-btn" onClick={onContinue}>{COPY.continue}</button>
      <button className="dg-btn-secondary" onClick={() => { setRes(null); setReplaying(true); setRound((r) => r + 1); }}>Try this line again (= Noch einmal versuchen)</button>
    </div>}
  </div>;
}

export function NovelGame(props: NovelGameProps) {
  const { castNames, storyItems, onAttempt, onSave, art, economy } = props;
  const chapter = useMemo(() => fillChapterStats(props.chapter, economy), [props.chapter, economy]);
  const mode = useLangMode(props.grade ?? 3);
  const byId = new Map(chapter.scenes.map((s) => [s.id, s]));
  const resume = !props.preview && props.initialSave?.chapterId === chapter.id ? props.initialSave : null;
  const first = chapter.scenes[0]?.id ?? "";
  const allSlots = chapter.scenes.flatMap((s) => s.taskSlots.map((t) => t.slot));
  const [sceneId, setSceneId] = useState(resume && byId.has(resume.sceneId) ? resume.sceneId : first);
  const [results, setResults] = useState<Record<string, SavedTake>>(() => validTakes(chapter, resume?.results));
  const [takes, setTakes] = useState<string[]>(() => restoredTakes(chapter, resume?.takes, results, resume?.results));
  const [counterUpdated] = useState(() => Array.isArray(resume?.takes) && resume.takes.some((slot) => allSlots.includes(slot) && !takes.includes(slot)));
  const resumeScene = byId.get(sceneId);
  const resumeComments = resume?.stage === "comments" && resumeScene?.taskSlots.some((slot) => commentsAfter(chapter.unit, slot.slot)) === true;
  const resumeStage = resume?.stage === "finished" ? "finished" : resumeComments ? "comments" : "scene";
  const [stage, setStage] = useState<"scene" | "comments" | "finished">(resumeStage);
  const [taskDone, setTaskDone] = useState(resumeComments);
  const [taskOpen, setTaskOpen] = useState(false);
  const scene = byId.get(sceneId);
  const sceneIndex = chapter.scenes.findIndex((s) => s.id === sceneId);
  const done = stage === "finished";
  const ending = episodeEnding(chapter.unit);
  const audience = audienceAt(props.chapter, sceneId, done, economy);
  const audienceIndex = audience ? economy.findIndex((e) => e.chapterId === audience.chapterId) : -1;
  const previousAudience = economy[audienceIndex - 1] ?? null;
  const save = (over: Partial<NovelSave>) => { if (!props.preview) onSave?.({ chapterId: chapter.id, sceneId, takes, results, stage, ...over }); };
  const go = (nextId: string | null, over: Partial<NovelSave> = {}): void => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    setTaskDone(false);
    setTaskOpen(false);
    if (nextId === null) { setStage("finished"); save({ ...over, stage: "finished" }); return; }
    setStage("scene"); setSceneId(nextId); save({ ...over, sceneId: nextId, stage: "scene" });
  };
  const counterNote = counterUpdated ? <p className="fourteen-caption">Einige Aufgaben sind neu. Dein Platz in der Geschichte bleibt erhalten; der Zähler zählt die neuen Aufgaben erst nach dem Bearbeiten.</p> : null;
  const header = <header className="fourteen-header"><span className="fourteen-brand"><span aria-hidden="true">14</span> FOURTEEN</span><nav><LangToggle grade={props.grade ?? 3} /><a href="/play/3">← Channel (= Kanal)</a></nav></header>;

  if (done || !scene) return <main className="fourteen" data-episode={chapter.unit} data-scene={sceneId} data-card="ending" data-band={bandForUnit(chapter.unit)}>
    {header}<div className="fourteen-ending">
    <div className="fourteen-eyebrow">Chapter {chapter.unit} · {chapter.titleEn}</div>
    <h1>{ending.title}</h1>
    {(art?.beats[chapter.scenes.at(-1)?.id ?? ""] ?? art?.backdrop) && <img className="fourteen-beat" src={art?.beats[chapter.scenes.at(-1)?.id ?? ""] ?? art?.backdrop ?? undefined} alt="" />}
    <blockquote className="fourteen-end-quote">{primaryLine(mode, chapter.scenes.at(-1)?.textEn ?? "", chapter.scenes.at(-1)?.scaffoldDe ?? null)}</blockquote>
    <p>{ending.note}</p>
    <details className="fourteen-end-help"><summary>Auf Deutsch?</summary><p>{ending.de}</p></details>
    </div><p className="fourteen-caption">{takes.length} / {allSlots.length} parts worked on (= bearbeitet).</p>
    {counterNote}<Audience current={audience} previous={previousAudience} quiet={chapter.unit >= 9} />
    <div className="fourteen-actions">
      {props.nextEpisode && <a className="dg-btn" href={props.nextEpisode.href}>Next episode → {props.nextEpisode.title}</a>}
      <a className="dg-btn-secondary" href="/play/3">Back to the channel</a>
      <button className="dg-btn-secondary" onClick={() => {
        setSceneId(first); setStage("scene"); setTakes([]); setResults({}); setTaskDone(false); setTaskOpen(false);
        save({ sceneId: first, stage: "scene", takes: [], results: {} });
      }}>Read this episode again (= Noch einmal spielen)</button>
    </div>
  </main>;

  const slot = scene.taskSlots[0];
  const slotItem = slot ? storyItems[storyItemKey(slot.itemId, slot.variantKey)] : undefined;
  const rawNext = scene.next;
  const next = rawNext !== null && typeof rawNext === "object" && !Array.isArray(rawNext) ? rawNext.else : rawNext;
  const commentsHere = slot !== undefined && commentsAfter(chapter.unit, slot.slot);
  const commentBeat = commentsHere && stage === "comments";
  const fixResults = Object.entries(results).filter(([name]) => isFixSlot(name)).map(([, r]) => r.tier);
  const comments = commentBeat ? episodeComments(fixResults.filter((t) => t === "correct").length, fixResults.length, bandForUnit(chapter.unit)) : null;
  let taskOrNav: ReactNode;
  if (comments) taskOrNav = <div className="fourteen-task"><CommentSection comments={comments.comments} line={comments.line} lineHelp={chapter.unit === 11 ? "Die Ausschnitte stammen aus früheren Videos. Ein Satz heute kann nicht ändern, was die Gruppe Ben angetan hat." : undefined} label="Under the video (= Unter dem Video)" />
    <div className="fourteen-actions"><button className="dg-btn" onClick={() => go(typeof next === "string" ? next : null)}>{COPY.continue}</button></div></div>;
  else if (slot && !slotItem) taskOrNav = <p role="alert">This part could not load. Open the channel and try again. (= Dieser Teil konnte nicht geladen werden. Öffne den Kanal und versuche es noch einmal.)</p>;
  else if (slot && slotItem && !taskDone && !taskOpen) taskOrNav = <div className="fourteen-actions"><button className="dg-btn" onClick={() => setTaskOpen(true)}>Your turn (= Du bist dran) →</button></div>;
  else if (slot && slotItem && !taskDone) taskOrNav = <TaskTake key={`${scene.id}:${slot.itemId}`} item={slotItem} prompt={slotPrompt(slot.slot, chapter.unit)} promptHelp={slotHelp(slot.slot, chapter.unit)} preview={props.preview === true}
    onAttempt={onAttempt} initialResult={results[slot.slot]}
    onScored={(tier, status) => {
      const updated = { ...results, [slot.slot]: { tier, status, itemKey: storyItemKey(slot.itemId, slot.variantKey) } };
      const worked = takes.includes(slot.slot) ? takes : [...takes, slot.slot];
      setResults(updated); setTakes(worked); save({ results: updated, takes: worked });
    }}
    onContinue={() => {
      const updated = takes.includes(slot.slot) ? takes : [...takes, slot.slot];
      setTakes(updated);
      if (!commentsHere && !Array.isArray(next)) { go(next, { takes: updated }); return; }
      const phase = commentsHere ? "comments" : "scene";
      setTaskDone(true); setStage(phase); save({ takes: updated, stage: phase });
    }} />;
  else if (Array.isArray(next)) taskOrNav = <div className="fourteen-actions">{next.map((c) => <button key={c.id} className="dg-btn-secondary" onClick={() => go(c.next)}><ChoiceContent mode={mode} textEn={c.textEn} scaffoldDe={c.scaffoldDe} /></button>)}</div>;
  else taskOrNav = <div className="fourteen-actions"><button className="dg-btn" onClick={() => go(next)}>{next === null ? ending.action : COPY.next}</button></div>;

  const narrator = scene.speaker === "narrator";
  const name = castNames[scene.speaker] ?? scene.speaker;
  const topImg = art?.panels[slot?.slot ?? ""] ?? art?.beats[scene.id] ?? (sceneIndex === 0 || narrator ? art?.backdrop : null);
  return <main className="fourteen" data-episode={chapter.unit} data-scene={sceneId} data-card={commentBeat ? "comments" : taskOpen ? "task" : "story"} data-band={bandForUnit(chapter.unit)}>
    {header}<div className="fourteen-title"><div><div className="fourteen-eyebrow">Chapter {chapter.unit}</div><h1>{chapter.titleEn}</h1></div>{chapter.titleDe && <span className="fourteen-caption">{chapter.titleDe}</span>}</div>
    <div className="fourteen-progress"><div className="fourteen-progress-label"><span>Scene {sceneIndex + 1} / {chapter.scenes.length}</span><span>{takes.length} / {allSlots.length} parts worked on (= bearbeitet)</span></div>
      <progress max={chapter.scenes.length} value={sceneIndex + 1} aria-label="Position in this episode" /></div>
    <article key={scene.id} className={`fourteen-scene${narrator ? " fourteen-narrator" : ""}${topImg ? " fourteen-illustrated" : " fourteen-text-card"}`}>
      {topImg && <img className="fourteen-beat" src={topImg} alt="" />}
      <div className="fourteen-dialogue">
        <div className="fourteen-speaker">{!narrator && (art?.portraits[scene.id] ? <img src={art.portraits[scene.id]} alt="" width={44} height={44} /> : <CastAvatar charKey={scene.speaker} name={name} />)}
          <span>{narrator ? "FOURTEEN" : name}</span><button className="fourteen-voice" onClick={() => speak(scene.textEn)} aria-label="Read aloud">▷</button></div>
        <p className="fourteen-line">{primaryLine(mode, scene.textEn, scene.scaffoldDe)}</p>
        <DialogueReveal key={`de-${scene.id}`} mode={mode} textEn={scene.textEn} scaffoldDe={scene.scaffoldDe} />
        <GlossReveal key={`gl-${scene.id}`} mode={mode} glosses={scene.glosses} />
        {taskOrNav}
      </div>
    </article>
    {counterNote}<details className="fourteen-channel-peek"><summary>FOURTEEN · Channel (= Kanalstand)</summary><Audience current={audience} previous={previousAudience} quiet={chapter.unit >= 9} /></details>
  </main>;
}
