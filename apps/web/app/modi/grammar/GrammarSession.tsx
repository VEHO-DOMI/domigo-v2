"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type { GrammarFormat, GrammarItem } from "@domigo/content-schema";
import { gradeGrammar, type GrammarInput } from "@domigo/engine";
import { attemptSender } from "@/lib/preview-attempt";
import { useOutboxFlush } from "@/lib/useOutboxFlush";
import { subscribeOutboxReplies, type AttemptResult } from "@/lib/attempt-outbox";
import { FORMAT_NAMES, grammarRound, type GrammarTopic } from "@/lib/modi/grammar";
import { rememberTrainerArea } from "@/lib/modi/preference";
import GrammarExercise from "./GrammarExercise";

export default function GrammarSession({ grade, preview, ownerId, items, topics, initialMemory = false, playerCard }: {
  grade: number; preview: boolean; ownerId: string | null; items: GrammarItem[]; topics: GrammarTopic[]; initialMemory?: boolean; playerCard?: ReactNode;
}) {
  const de = grade === 1;
  const suffix = preview ? `?jahrgang=${grade}` : "";
  const [memory, setMemory] = useState(grade === 1 && initialMemory);
  const [topicId, setTopicId] = useState("");
  const [format, setFormat] = useState<GrammarFormat | "mix">("mix");
  const [deck, setDeck] = useState<GrammarItem[] | null>(null);
  const [index, setIndex] = useState(0);
  const [receipts, setReceipts] = useState<Record<string, AttemptResult>>({});
  const ids = useRef(new Set<string>());
  const focusPanel = useRef<HTMLElement | null>(null);
  useOutboxFlush(!preview, ownerId);
  useEffect(() => { rememberTrainerArea(grade, "grammar", preview); }, [grade, preview]);
  useEffect(() => { if (topicId) focusPanel.current?.scrollIntoView({ block: "start" }); }, [topicId]);
  useEffect(() => {
    if (preview || !ownerId) return;
    return subscribeOutboxReplies(ownerId, (id, receipt) => {
      if (ids.current.has(id)) setReceipts((old) => ({ ...old, [id]: receipt }));
    });
  }, [preview, ownerId]);
  const submit = useCallback(async (item: GrammarItem, input: GrammarInput, hintUsed: boolean) => {
    const id = crypto.randomUUID(); ids.current.add(id);
    setReceipts((old) => ({ ...old, [id]: { ok: false, queued: false } }));
    const body = { clientAttemptId: id, itemId: item.id, mode: "grammar", input, latencyMs: null, hintUsed };
    const reply = await attemptSender(preview, ownerId)(body);
    const receipt = preview ? { ...reply, tier: gradeGrammar(item, input).tier } : reply;
    if (ids.current.has(id)) setReceipts((old) => ({ ...old, [id]: receipt }));
    return receipt;
  }, [preview, ownerId]);
  const topic = topics.find((entry) => entry.id === topicId);
  const visible = topics.filter((entry) => !memory || entry.memoryCount > 0);
  const all = Object.values(receipts);
  const confirmed = all.filter((receipt) => receipt.ok);
  const total = confirmed.map((receipt) => receipt.xpAwarded ?? 0).reduce((sum, award) => sum + award, 0);
  const pending = all.length - confirmed.length;
  function reset() { ids.current.clear(); setReceipts({}); setDeck(null); setIndex(0); setTopicId(""); }
  function start() {
    if (!topic) return;
    const round = grammarRound(items, topic.id, format, memory);
    if (round.length) { setDeck(round); setIndex(0); }
  }
  const done = deck !== null && index >= deck.length;
  return <main className="og-game og-grammar" lang={de ? "de" : "en"}>
    <header className="og-game-header"><Link className="og-game-back" href={`/home${suffix}`}>← {de ? "Zurück" : "Back"}</Link><h1>🧠 Grammar Mode</h1></header>
    {!deck ? <>
      {playerCard}
      {grade === 1 && <div className="og-grammar-tabs" role="group" aria-label="Grammatik üben"><button aria-pressed={!memory} onClick={() => { setMemory(false); setTopicId(""); }}>Grammatik üben</button><button aria-pressed={memory} onClick={() => { setMemory(true); setTopicId(""); }}>🧩 Grammar Memory Match</button></div>}
      <div className="og-grammar-heading"><h2>{de ? "Thema wählen" : "Choose a topic"}</h2><p>{memory ? "Decke die Karten auf und ordne A und B zu. Prüfe dann alle Paare gemeinsam." : de ? "Wähle ein Chapter und eine Struktur." : "Choose a Chapter and a structure."}</p></div>
      <div className="og-grammar-chapters">{[...new Set(visible.map((entry) => entry.chapter))].map((chapter) => <details key={chapter} open={visible.length < 8 || topic?.chapter === chapter}>
        <summary>Chapter {chapter}</summary><div>{visible.filter((entry) => entry.chapter === chapter).map((entry) => <button className="og-grammar-topic" aria-pressed={topicId === entry.id} key={entry.id} onClick={() => { setTopicId(entry.id); setFormat("mix"); }}><strong>{de ? entry.nameDe : entry.name}</strong><small>{memory ? `Kartensätze: ${entry.memoryCount}` : `${de ? "Aufgaben" : "Items"}: ${entry.count}`}</small><span>→</span></button>)}</div>
      </details>)}</div>
      {visible.length === 0 && <p>{de ? "Hier sind gerade keine Aufgaben verfügbar." : "No exercises are available here yet."}</p>}
      {topic && <section ref={focusPanel} className="og-grammar-focus"><h2>{de ? topic.nameDe : topic.name}</h2>{!memory && <fieldset><legend>{de ? "Übungsformat" : "Exercise type"}</legend><div className="og-grammar-formats">{(["mix", ...topic.formats] as const).map((entry) => <button type="button" key={entry} aria-pressed={format === entry} onClick={() => setFormat(entry)}>{entry === "mix" ? (de ? "Mix · bis zu 10 Aufgaben" : "Mix · up to 10 items") : FORMAT_NAMES[entry][de ? "de" : "en"]}</button>)}</div></fieldset>}<button className="og-primary" onClick={start}>{de ? "Starten" : "Start"} →</button></section>}
      <Link className="og-game-back" href={`/modi${suffix}`}>{de ? "Alle Modi" : "All modes"}</Link>
    </> : done ? <section className="og-game-result" aria-label={de ? "Ergebnis" : "Results"}><div className="og-game-icon">{memory ? "🧩" : "🧠"}</div><h2>{de ? "Geschafft!" : "Round complete!"}</h2><div className="og-game-totals"><div><strong>{all.length}</strong><span>{de ? "Antworten" : "Answers"}</span></div><div><strong>{confirmed.filter((r) => r.tier === "correct").length}</strong><span>{de ? "Richtig" : "Correct"}</span></div>{!preview && <div><strong>{total}</strong><span>Grammar XP</span></div>}</div>{pending > 0 && <p role="status">{pending} {de ? "Antworten noch nicht bestätigt." : "answers not yet confirmed."}</p>}<button className="og-primary" onClick={reset}>{de ? "Thema wählen" : "Choose a topic"}</button><Link href={`/home${suffix}`}>{de ? "Dein Grammatik-Level →" : "Your grammar level →"}</Link><Link href={`/review${suffix}`}>🔄 Smart Review</Link></section> : <><div className="og-game-stats"><span>{index + 1}/{deck.length}</span><span>{topic ? de ? topic.nameDe : topic.name : ""}</span></div><GrammarExercise key={deck[index]!.id} item={deck[index]!} grade={grade} memory={memory} submit={submit} next={() => setIndex((n) => n + 1)} /></>}
  </main>;
}
