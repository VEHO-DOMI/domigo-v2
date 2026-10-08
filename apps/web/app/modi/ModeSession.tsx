"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { VocabItem } from "@domigo/content-schema";
import { gradeVocab } from "@domigo/engine";
import { attemptSender } from "@/lib/preview-attempt";
import { useOutboxFlush } from "@/lib/useOutboxFlush";
import { subscribeOutboxReplies, type AttemptBody, type AttemptResult } from "@/lib/attempt-outbox";
import { modeDetails, type TrainerMode } from "@/lib/modi/catalog";
import { shuffle, type HuntRound } from "@/lib/modi/decks";
import type { ModeInput, ModeSummary } from "@/lib/modi/types";
import type { SpeedSession } from "@/lib/modi/speed-session";
import Flashcards from "./flashcards/Flashcards";
import Memory from "./memory/Memory";
import Spelling from "./spelling/Spelling";
import WordHunt from "./wordhunt/WordHunt";
import Speed from "./speed/Speed";

export default function ModeSession({ ownerId, preview, grade, mode, words, rounds }: {
  ownerId: string | null; preview: boolean; grade: number; mode: TrainerMode; words: VocabItem[]; rounds: HuntRound[];
}) {
  const [deck, setDeck] = useState<VocabItem[] | null>(null);
  const [done, setDone] = useState(false);
  const [summary, setSummary] = useState<ModeSummary[]>([]);
  const [receipts, setReceipts] = useState<Record<string, AttemptResult>>({});
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");
  const [speedSession, setSpeedSession] = useState<SpeedSession | null>(null);
  const [duration, setDuration] = useState(60_000);
  const mounted = useRef(true);
  const startingRef = useRef(false);
  const ids = useRef(new Set<string>());
  useOutboxFlush(!preview, ownerId);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  useEffect(() => {
    if (preview || !ownerId) return;
    return subscribeOutboxReplies(ownerId, (id, receipt) => {
      if (ids.current.has(id)) setReceipts((old) => ({ ...old, [id]: receipt }));
    });
  }, [preview, ownerId]);
  const detail = modeDetails(grade)[mode];
  const de = grade === 1;
  const suffix = preview ? `?jahrgang=${grade}` : "";
  const submit = useCallback(async (item: VocabItem, input: ModeInput, hintUsed = false) => {
    const id = crypto.randomUUID();
    ids.current.add(id);
    setReceipts((old) => ({ ...old, [id]: { ok: false, queued: false } }));
    const body: AttemptBody & { context?: unknown } = {
      clientAttemptId: id, itemId: item.id, mode, input, latencyMs: null, hintUsed,
      ...(mode === "speed" ? { context: { speedSession } } : {}),
    };
    const result = await attemptSender(preview, ownerId)(body);
    // Preview uses the same pure grader, without a request or a reward.
    const receipt = preview ? { ...result, tier: gradeVocab(item, input.value, input.kind === "vocab" ? input.pool : "carrier").tier } : result;
    if (mounted.current && ids.current.has(id)) setReceipts((old) => ({ ...old, [id]: receipt }));
    return receipt;
  }, [preview, ownerId, mode, speedSession]);
  async function start() {
    if (startingRef.current) return;
    startingRef.current = true; setStarting(true); setError("");
    try {
      if (mode === "speed" && !preview) {
        const before = performance.now();
        const res = await fetch("/modi/speed/start", { cache: "no-store" });
        if (!res.ok) throw new Error("start");
        const data = await res.json() as { speedSession: SpeedSession; serverNow: number };
        setSpeedSession(data.speedSession);
        setDuration(Math.max(0, data.speedSession.sessionStartedAt + 60_000 - data.serverNow - (performance.now() - before)));
      }
      if (mounted.current) setDeck(shuffle(words));
    } catch { setError(de ? "Der Timer konnte nicht starten. Bitte versuche es erneut." : "The timer could not start. Please try again."); }
    finally { startingRef.current = false; setStarting(false); }
  }
  const all = Object.values(receipts);
  const confirmed = all.filter((receipt) => receipt.ok);
  // Display only the sum of server receipts, never locally computed rewards.
  const total = confirmed.map((receipt) => receipt.xpAwarded ?? 0).reduce((sum, award) => sum + award, 0);
  const pending = all.length - confirmed.length;
  const finish = (details: ModeSummary[] = []) => { setSummary(details); setDone(true); };
  const props = { words: deck ?? [], grade, submit, finish };
  const available = words.length > 0 && (mode !== "wordhunt" || rounds.length === 8);
  return <main className={`og-game og-game-${mode}`} lang={de ? "de" : "en"}>
    <header className="og-game-header"><Link className="og-game-back" href={`/modi${suffix}`}>← {de ? "Zurück" : "Done"}</Link><h1>{detail.icon} {detail.title}</h1></header>
    {!deck ? <section className="og-game-intro">
      <div className="og-game-icon" aria-hidden="true">{detail.icon}</div><h2>{detail.title}</h2><p>{detail.sub}</p><small>{detail.reward}</small>
      {available ? <button className="og-primary" disabled={starting} onClick={() => void start()}>{starting ? "…" : de ? "Starten" : "Start"} →</button> : <p>{mode === "wordhunt" ? (de ? "Wähle mindestens zwei Chapters mit genügend Wörtern." : "Choose at least two Chapters with enough words.") : (de ? "Hier sind gerade keine Wörter verfügbar." : "No words are available here yet.")}</p>}
      {error && <p role="alert">{error}</p>}
    </section> : done ? <section className="og-game-result" aria-label={de ? "Ergebnis" : "Results"}>
      <div className="og-game-icon" aria-hidden="true">{detail.icon}</div><h2>{de ? "Geschafft!" : "Round complete!"}</h2>
      <div className="og-game-totals"><div><strong>{all.length}</strong><span>{de ? "Antworten" : "Answers"}</span></div><div><strong>{confirmed.filter((receipt) => receipt.tier === "correct").length}</strong><span>{de ? "Richtig" : "Correct"}</span></div>{!preview && <div><strong>{total}</strong><span>XP</span></div>}</div>
      {summary.length > 0 && <div className="og-game-totals">{summary.map((entry) => <div key={entry.label}><strong>{entry.value}</strong><span>{entry.label}</span></div>)}</div>}
      {pending > 0 && <p role="status">{de ? `${pending} Antworten noch nicht bestätigt.` : `${pending} answers not yet confirmed.`}</p>}
      {mode === "flashcards" && <Link className="og-game-back" href={`/review${suffix}`}>🔄 Smart Review</Link>}
      <button className="og-primary" onClick={() => { ids.current.clear(); setReceipts({}); setSummary([]); setDone(false); setDeck(null); setSpeedSession(null); }}>{de ? "Noch einmal" : "Play Again"}</button><Link href={`/modi${suffix}`}>{de ? "Modus wählen" : "Choose Mode"}</Link>
    </section> : <>
      {mode === "flashcards" && <Flashcards {...props} />}
      {mode === "memory" && <Memory {...props} />}
      {mode === "spelling" && <Spelling {...props} />}
      {mode === "wordhunt" && <WordHunt {...props} rounds={rounds} />}
      {mode === "speed" && <Speed {...props} duration={duration} />}
    </>}
  </main>;
}
