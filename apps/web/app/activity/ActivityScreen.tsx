"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { trainerHref } from "../home/TrainerShell";
import { activityCopy } from "@/lib/activity/copy";
import { MODES, available, defaults, endGame, markWord, newGame, nextTurn, remainingWords, resetRound, standings, startRound, tick, undoLast, undoRound, type ActivityWord, type Game, type Group } from "@/lib/activity/game";

const icons = { draw: "✏️", show: "🎭", explain: "💬" };
type Intent = "round" | "reset" | "end";
function Scoreboard({ groups, current, title }: { groups: Group[]; current?: number; title: string }) {
    return <section className="activity-panel activity-scoreboard" aria-label={title}><h2>{title}</h2><ol>{groups.map((g, i) => <li key={i} aria-current={i === current ? "true" : undefined}><span>{g.name}</span><strong>{g.score}</strong></li>)}</ol></section>;
  }

export default function ActivityScreen({ grade, preview, words, unavailable }: { grade: number; preview: boolean; words: ActivityWord[]; unavailable: boolean }) {
  const t = activityCopy(grade);
  const [settings, setSettings] = useState(() => defaults(words));
  const [names, setNames] = useState(["", ""]);
  const [game, setGame] = useState<Game | null>(null);
  const [intent, setIntent] = useState<Intent | null>(null);
  const [sound, setSound] = useState(true);
  const dialog = useRef<HTMLDialogElement>(null), heading = useRef<HTMLHeadingElement>(null), audio = useRef<AudioContext | null>(null);
  const phase = game?.phase ?? "setup";
  const selection = available(words, settings), chapters = [...new Set(words.map(w => w.chapter))];
  const update = (fn: (g: Game) => Game) => setGame(g => g ? fn(g) : g);
  function tone(frequency: number) {
    if (!sound || typeof AudioContext === "undefined") return;
    try {
      const ctx = audio.current ??= new AudioContext();
      void ctx.resume().catch(() => {});
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.frequency.value = frequency; gain.gain.setValueAtTime(.08, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .15);
      osc.connect(gain); gain.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + .16);
    } catch { /* Audio is optional; a browser restriction cannot stop the game. */ }
  }
  useEffect(() => () => { void audio.current?.close().catch(() => {}); }, []);
  useEffect(() => {
    if (phase !== "play") return;
    const timer = window.setInterval(() => setGame(g => g ? tick(g, performance.now()) : g), 100);
    return () => window.clearInterval(timer);
  }, [phase]);
  useEffect(() => { heading.current?.focus(); }, [phase]);
  useEffect(() => { if (intent) dialog.current?.showModal(); else dialog.current?.close(); }, [intent]);
  useEffect(() => {
    if (!game || game.phase === "final") return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warn); return () => window.removeEventListener("beforeunload", warn);
  }, [game]);
  // Beeps follow displayed seconds; returning from a hidden tab cannot extend time.
  const seconds = game?.remaining;
  useEffect(() => {
    if (!sound || !audio.current || phase !== "play" || seconds === undefined || seconds > 5 || seconds < 1) return;
    const ctx = audio.current, osc = ctx.createOscillator(), gain = ctx.createGain();
    osc.frequency.value = 880; gain.gain.value = .04; osc.connect(gain); gain.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + .07);
  }, [seconds, phase, sound]);
  const groupName = (index: number) => names[index]?.trim() || `${t.group} ${index + 1}`;
  function confirm() {
    if (intent === "reset") setGame(null);
    if (intent === "round") update(g => g.phase === "summary" ? undoRound(g) : resetRound(g));
    if (intent === "end") update(endGame);
    setIntent(null);
  }
  const current = game?.current;
  return <main className="activity-screen" lang={grade === 1 ? "de" : "en"} data-phase={phase}>
    <header className="activity-heading">
      <Link className="activity-button" href={trainerHref("/home", grade, preview)}>← {t.back}</Link>
      <button className="activity-button" type="button" aria-pressed={sound} onClick={() => { if (!sound) { setSound(true); } else setSound(false); }}>{t.sound}: {sound ? t.on : t.off}</button>
      <h1 ref={heading} tabIndex={-1}>{t.title}</h1><p>{t.subtitle}</p>
    </header>
    {unavailable ? <p className="activity-panel" role="status">{t.unavailable}</p> : !words.length ? <p className="activity-panel" role="status">{t.empty}</p> : !game ? <>
      <fieldset><legend>{t.groups}</legend>{names.map((name, i) => <div className="activity-group" key={i}><label className="activity-sr" htmlFor={`activity-group-${i}`}>{t.group} {i + 1}</label><input id={`activity-group-${i}`} value={name} maxLength={30} placeholder={`${t.group} ${i + 1}`} autoComplete="off" onChange={event => setNames(old => old.map((n, index) => index === i ? event.target.value : n))} /><button className="activity-button" type="button" disabled={names.length <= 2} aria-label={`${t.remove} ${i + 1}`} onClick={() => setNames(old => old.filter((_, index) => index !== i))}>×</button></div>)}<button className="activity-button activity-wide" type="button" disabled={names.length >= 8} onClick={() => setNames(old => [...old, ""])}>+ {t.add}</button></fieldset>
      <fieldset><legend>{t.seconds}</legend><div className="activity-segments">{[30, 60, 90].map(seconds => <button className="activity-button" type="button" key={seconds} aria-pressed={settings.seconds === seconds} onClick={() => setSettings(s => ({ ...s, seconds }))}>⏱ {seconds} s</button>)}</div></fieldset>
      <fieldset><legend>{t.rounds}</legend><div className="activity-segments">{[3, 5, 8, 0].map(rounds => <button className="activity-button" type="button" key={rounds} aria-label={rounds ? `${rounds} ${t.rounds}` : t.unlimited} aria-pressed={settings.rounds === rounds} onClick={() => setSettings(s => ({ ...s, rounds }))}>{rounds || "∞"}</button>)}</div></fieldset>
      <fieldset><legend>{t.modes}</legend><div className="activity-segments">{MODES.map(mode => <button className={`activity-button activity-mode ${mode}`} type="button" key={mode} aria-pressed={settings.modes.includes(mode)} onClick={() => setSettings(s => ({ ...s, modes: s.modes.includes(mode) ? s.modes.length > 1 ? s.modes.filter(m => m !== mode) : s.modes : [...s.modes, mode] }))}><span aria-hidden="true">{icons[mode]}</span>{t.mode[mode]}</button>)}</div><p className="activity-small">{t.modeHint}</p></fieldset>
      <fieldset><legend>Chapters</legend><div className="activity-actions"><button className="activity-button" type="button" onClick={() => setSettings(s => ({ ...s, chapters }))}>{t.all}</button><button className="activity-button" type="button" onClick={() => setSettings(s => ({ ...s, chapters: [] }))}>{t.none}</button></div><div className="activity-chapters">{chapters.map(chapter => <button className="activity-button" type="button" key={chapter} aria-label={`Chapter ${chapter}`} aria-pressed={settings.chapters.includes(chapter)} onClick={() => setSettings(s => ({ ...s, chapters: s.chapters.includes(chapter) ? s.chapters.filter(c => c !== chapter) : [...s.chapters, chapter] }))}>{chapter}<small>{words.filter(w => w.chapter === chapter && settings.modes.includes(w.mode)).length}</small></button>)}</div><p className="activity-small" role="status">{selection.length} {t.available}</p></fieldset>
      <label className="activity-panel activity-toggle"><input type="checkbox" checked={settings.bonus} onChange={e => setSettings(s => ({ ...s, bonus: e.target.checked }))} /><span><strong>⭐ {t.bonus}</strong><small>{t.bonusHelp}</small></span></label>
      <button className="activity-button activity-primary activity-wide" type="button" disabled={!selection.length} onClick={() => { tone(660); setGame(newGame(words, settings, names.map((_, i) => groupName(i)), Math.floor(Math.random() * 0xffffffff))); }}>{t.start}</button><p className="activity-small">{t.session}</p>
    </> : game.phase === "ready" ? <>
      <Scoreboard groups={game.groups} current={game.turn} title={t.scoreboard} /><section className="activity-turn"><h2>{game.groups[game.turn]!.name} — {t.turn}</h2><p>{t.round} {game.groups[game.turn]!.turns + 1}{game.settings.rounds ? ` ${t.of} ${game.settings.rounds}` : ""} · {game.settings.seconds} s</p><p>{remainingWords(game).length} {t.remaining}</p>{game.settings.modes.map(mode => <p key={mode}>{icons[mode]} {t.rule[mode]}</p>)}</section><button className="activity-button activity-primary activity-wide" type="button" onClick={() => { tone(660); update(g => startRound(g, performance.now())); }}>{t.startRound} →</button><div className="activity-actions"><button className="activity-button" type="button" onClick={() => setIntent("reset")}>{t.reset}</button><button className="activity-button" type="button" onClick={() => setIntent("end")}>{t.end}</button></div>
    </> : game.phase === "play" && current ? <>
      <progress className="activity-progress" max={game.settings.seconds} value={game.remaining} aria-label={t.seconds} />
      <div className="activity-timer" role="timer" aria-live="off">{game.remaining}</div><p className={`activity-cue ${current.mode}`}>{icons[current.mode]} {t.mode[current.mode]}</p><p className="activity-round-score">{t.roundScore}: <strong>{game.marks.filter(m => m.correct).length}</strong></p>
      <section className="activity-panel activity-word" aria-live="polite" aria-atomic="true"><h2>{current.word}</h2><p>Chapter {current.chapter}</p></section>
      <div className="activity-actions activity-play-actions"><button className="activity-button activity-primary" type="button" onClick={() => { tone(880); update(g => markWord(g, current.id, true, performance.now())); }}>✓ {t.correct}</button><button className="activity-button" type="button" onClick={() => update(g => markWord(g, current.id, false, performance.now()))}>{t.skip} →</button></div>
      <button className="activity-button activity-wide" type="button" disabled={!game.marks.length} onClick={() => update(g => undoLast(g, performance.now()))}>↶ {t.undo}</button><div className="activity-actions"><button className="activity-button" type="button" onClick={() => setIntent("round")}>{t.resetRound}</button><button className="activity-button" type="button" onClick={() => setIntent("reset")}>{t.reset}</button></div>
    </> : game.phase === "summary" ? <>
      <section className="activity-panel activity-summary"><h2>{game.groups[game.turn]!.name}</h2><p className="activity-big">{game.marks.filter(m => m.correct).length + game.bonus}</p><p>{t.roundScore}</p>{game.bonus > 0 && <p>⭐ +1 {t.bonus}</p>}<ul>{game.marks.map(m => <li key={m.word.id}><span><strong>{m.word.word}</strong><small>{m.word.german}</small></span><span aria-label={m.correct ? t.correct : t.skipped}>{m.correct ? "✓" : "—"}</span></li>)}</ul></section><Scoreboard groups={game.groups} current={game.turn} title={t.scoreboard} /><div className="activity-actions"><button className="activity-button" type="button" onClick={() => update(undoRound)}>↶ {t.undoRound}</button><button className="activity-button activity-primary" type="button" onClick={() => update(nextTurn)}>{t.next} →</button></div>
    </> : <>
      <h2 className="activity-final-title">{t.final}</h2><ol className="activity-final">{standings(game.groups).map((g, i, ranked) => <li className="activity-panel" key={i}><span className="activity-rank">{g.rank === 1 && g.score > 0 ? "🏆" : g.rank}</span><span><strong>{g.name}</strong>{g.rank === 1 && g.score > 0 && <small>{ranked.filter(x => x.rank === 1).length > 1 ? t.tie : t.winner}</small>}</span><strong>{g.score}</strong></li>)}</ol><button className="activity-button activity-primary activity-wide" type="button" onClick={() => setGame(null)}>{t.again}</button>
    </>}
    <dialog ref={dialog} className="activity-dialog" aria-labelledby="activity-confirm-title" aria-describedby="activity-confirm-description" onCancel={() => setIntent(null)} onClose={() => setIntent(null)}><h2 id="activity-confirm-title">{intent === "round" ? t.resetRound : intent === "end" ? t.end : t.reset}?</h2><p id="activity-confirm-description">{intent === "round" ? t.roundQuestion : intent === "end" ? t.endQuestion : t.resetQuestion}</p><div className="activity-actions"><button className="activity-button" type="button" autoFocus onClick={() => setIntent(null)}>{t.cancel}</button><button className="activity-button activity-primary" type="button" onClick={confirm}>{t.confirm}</button></div></dialog>
  </main>;
}
