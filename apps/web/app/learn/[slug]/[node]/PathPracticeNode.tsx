"use client";
import Link from "next/link";
import { useLearningText } from "@/lib/trainer/LearningShell";
import { useState } from "react";
import type { GrammarItem, VocabItem } from "@domigo/content-schema";
import type { Tier } from "@domigo/engine";
import { vocabularyContentSnapshot, XP_WEIGHT } from "@domigo/engine";
import { GrammarItemView, VocabItemView, type ResultDetail } from "@domigo/task-ui";
import { sendCompletedAttempt, sendVocabularyCheck } from "@/lib/vocabulary-history-client";
import { attemptSender } from "@/lib/preview-attempt";
import { useBookedRound } from "@/lib/use-booked-round";

type QueueItem = { kind: "vocab" | "grammar"; item: VocabItem | GrammarItem };

/** Client-side stars (server re-derives authoritatively); mirrors studypath.starsFor. */
function starsFor(correctEquiv: number, total: number): number {
  if (total <= 0) return 0;
  const acc = correctEquiv / total;
  return acc >= 1 ? 3 : acc >= 0.8 ? 2 : 1;
}

type Props = { preview?: boolean; ownerId: string | null; today: string;
  unitSlug: string;
  nodeId: string;
  isCheckpoint: boolean;
  items: QueueItem[];
  /** the attempt `mode` — legacy Study Path (default `study:<node>`) or, for a
   *  J-1 journey node, `journey:<unit>:<node>`. A journey node DERIVES its progress
   *  from these attempts, so it does NOT write the study_path_progress table (F3). */
  attemptMode?: string;
};
export default function PathPracticeNode(props: Props) {
  const round = [props.ownerId, props.preview, props.today, props.unitSlug, props.nodeId, props.isCheckpoint, props.attemptMode,
    props.items.map(({ kind, item }) => kind === "vocab" ? vocabularyContentSnapshot(item as VocabItem) : item.id)];
  return <PathPracticeRound key={JSON.stringify(round)} {...props} />;
}
function PathPracticeRound({ preview = false, ownerId, unitSlug, nodeId, isCheckpoint, items, attemptMode }: Props) {
  const t = useLearningText();
  const mode = attemptMode ?? `study:${nodeId}`;
  const isJourney = mode.startsWith("journey:");
  const [i, setI] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [done, setDone] = useState(false);
  const { results, streak, begin, receive, nextQuestion } = useBookedRound(preview, ownerId);
  const [stars, setStars] = useState(0);

  const current = items[i];
  const title = isCheckpoint ? t("Zeig, was du kannst", "Checkpoint") : t("Üben", "Practice");

  const onCheck = (_tier: Tier, detail: ResultDetail) => {
    void sendVocabularyCheck(attemptSender(preview, ownerId), detail, mode).catch(() => { /* unconfirmed history */ });
  };
  const onResult = (tier: Tier, detail: ResultDetail) => {
    if (!current) return;
    const id = begin(tier);
    if (!id) return;
    setAnswered(true);

    // Per-item attempt → the existing graded/idempotent path (feeds review_queue + streak + XP).
    void sendCompletedAttempt(attemptSender(preview, ownerId), {
      clientAttemptId: id,
      itemId: detail.itemId,
      mode,
      input: detail.input,
      latencyMs: null,
      hintUsed: false,
    }, detail).then(reply => receive(id, reply)).catch(() => { /* no booking, no points */ });
  };

  const finish = (all: Array<{ tier: Tier; xp: number }>) => {
    setDone(true);
    const correctEquiv = all.reduce((s, r) => s + XP_WEIGHT[r.tier], 0);
    const total = all.length;
    const accuracy = total > 0 ? correctEquiv / total : 0;
    setStars(starsFor(correctEquiv, total));
    // A journey node's progress is DERIVED from the attempts just posted — it must
    // NOT write study_path_progress (F3: no separate path-state table for journeys).
    if (preview || isJourney) return;
    // Legacy Study Path: best-effort node-completion (no outbox — cosmetic + keep-best heals a lost write).
    void fetch("/api/study-path", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ unitSlug, nodeId, stars: starsFor(correctEquiv, total), accuracy }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (typeof d?.stars === "number") setStars(d.stars);
      })
      .catch(() => {});
  };

  const isLast = i >= items.length - 1;
  const next = () => {
    nextQuestion();
    if (isLast) {
      finish(results);
      return;
    }
    setAnswered(false);
    setI((x) => x + 1);
  };

  const xpTotal = results.reduce((s, r) => s + r.xp, 0);
  const grade = unitSlug.match(/^g(\d)/)?.[1];

  if (done || !current) {
    return (
      <main data-grade={grade} style={{ maxWidth: 640, margin: "0 auto", padding: "28px 20px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
        {preview && <p role="status">{t("Vorschau — nichts gespeichert", "Preview — nothing saved")}</p>}
        <h1 style={{ fontSize: 24, fontFamily: "var(--font-display)", color: "var(--ink)" }}>{title} · {t("geschafft", "complete")}</h1>
        <p style={{ fontSize: 28, margin: "4px 0", color: "#e6a700", letterSpacing: 2 }}>
          {"★".repeat(stars)}
          {"☆".repeat(3 - stars)}
        </p>
        <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>
          {xpTotal} XP{streak ? t(` · 🔥 ${streak} Tage in Folge`, ` · 🔥 ${streak}-day streak`) : ""}
        </p>
        <Link href={`/learn/${unitSlug}`} style={{ fontSize: 14, color: "var(--ink)", fontWeight: 600 }}>{t("← Zurück zum Lernpfad", "← Back to path")}</Link>
      </main>
    );
  }

  return (
    <main data-grade={grade} style={{ maxWidth: 640, margin: "0 auto", padding: "28px 20px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
        <h1 style={{ fontSize: 22, margin: 0, fontFamily: "var(--font-display)", color: "var(--ink)" }}>{title}</h1>
        <Link href={`/learn/${unitSlug}`} style={{ fontSize: 14, color: "var(--ink)", fontWeight: 600 }}>{t("← Lernpfad", "← Path")}</Link>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--text-secondary)", marginBottom: 10 }}>
        <span>{t("Frage", "Item")} {Math.min(i + 1, items.length)} / {items.length}</span>
        <span>{xpTotal} XP{streak ? ` · 🔥 ${streak}` : ""}</span>
      </div>

      {current.kind === "grammar" ? (
        <GrammarItemView key={current.item.id} item={current.item as GrammarItem} onResult={onResult} hideHint={isCheckpoint} hideXp hideMeta />
      ) : (
        <VocabItemView key={current.item.id} item={current.item as VocabItem} onResult={onResult} onCheck={onCheck} hideHint={isCheckpoint} hideXp hideMeta />
      )}

      {answered && (
        <button className="dg-btn" onClick={next} style={{ marginTop: 14 }}>
          {isLast ? t("Fertig →", "Finish →") : t("Weiter →", "Next →")}
        </button>
      )}
    </main>
  );
}
