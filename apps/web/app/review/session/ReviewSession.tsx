"use client";
import Link from "next/link";
import { useLearningText } from "@/lib/trainer/LearningShell";
import { useState } from "react";
import type { GrammarItem, VocabItem } from "@domigo/content-schema";
import type { Tier } from "@domigo/engine";
import { vocabularyContentSnapshot } from "@domigo/engine";
import { GrammarItemView, VocabItemView, type ResultDetail } from "@domigo/task-ui";
import { sendCompletedAttempt, sendVocabularyCheck } from "@/lib/vocabulary-history-client";
import { attemptSender } from "@/lib/preview-attempt";
import { useBookedRound } from "@/lib/use-booked-round";

type QueueItem = { kind: "vocab" | "grammar"; item: VocabItem | GrammarItem };

type Props = { preview?: boolean; ownerId: string | null; today: string; items: QueueItem[] };
export default function ReviewSession(props: Props) {
  const round = [props.ownerId, props.preview, props.today, props.items.map(({ kind, item }) =>
    kind === "vocab" ? vocabularyContentSnapshot(item as VocabItem) : item.id)];
  return <ReviewRound key={JSON.stringify(round)} {...props} />;
}
function ReviewRound({ preview = false, ownerId, items }: Props) {
  const t = useLearningText();
  const [i, setI] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [done, setDone] = useState(false);
  const { results, streak, begin, receive, nextQuestion } = useBookedRound(preview, ownerId);

  const current = items[i];

  const onCheck = (_tier: Tier, detail: ResultDetail) => {
    void sendVocabularyCheck(attemptSender(preview, ownerId), detail, "review").catch(() => { /* unconfirmed history */ });
  };
  const onResult = (tier: Tier, detail: ResultDetail) => {
    if (!current) return;
    const id = begin(tier);
    if (!id) return;
    setAnswered(true);

    // Best-effort persistence via the offline outbox (queues + retries when offline);
    // the POST re-grades + reschedules the item (mode:"review") and returns the daily streak.
    void sendCompletedAttempt(attemptSender(preview, ownerId), {
      clientAttemptId: id,
      itemId: detail.itemId,
      mode: "review",
      input: detail.input,
      latencyMs: null,
      hintUsed: false,
    }, detail).then(reply => receive(id, reply)).catch(() => { /* no booking, no points */ });
  };

  const isLast = i >= items.length - 1;
  const next = () => {
    nextQuestion();
    if (isLast) { setDone(true); return; }
    setAnswered(false);
    setI((x) => x + 1);
  };

  const xpTotal = results.reduce((s, r) => s + r.xp, 0);
  const counts = results.reduce<Record<string, number>>((m, r) => ({ ...m, [r.tier]: (m[r.tier] ?? 0) + 1 }), {});
  const tierSummary = (["correct", "partial", "close", "wrong"] as Tier[])
    .filter((t) => counts[t])
    .map((tier) => `· ${counts[tier]} ${{ correct: t("richtig", "correct"), partial: t("fast", "partial"), close: t("knapp", "close"), wrong: t("noch offen", "to revisit") }[tier]}`)
    .join(" ");

  if (done || !current) {
    return (
      <main style={{ maxWidth: 640, margin: "0 auto", padding: "28px 20px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
        <h1 style={{ fontSize: 24, fontFamily: "var(--font-display)", color: "var(--ink)" }}>{t(`${results.length} wiederholt — bis morgen 👋`, `Reviewed ${results.length} — see you tomorrow 👋`)}</h1>
        {preview && <p role="status">{t("Vorschau — nichts gespeichert", "Preview — nothing saved")}</p>}
        <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>{xpTotal} XP {tierSummary}</p>
        {streak ? <p style={{ fontSize: 15, color: "#ea580c", fontWeight: 700 }}>🔥 {t(`${streak} Tage in Folge`, `${streak}-day streak`)}</p> : null}
        <Link href={preview ? "/review" : "/home"} style={{ fontSize: 14, color: "var(--ink)", fontWeight: 600 }}>{preview ? t("← Wiederholen", "← Review") : t("← Startseite", "← Home")}</Link>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "28px 20px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
        <h1 style={{ fontSize: 22, margin: 0, fontFamily: "var(--font-display)", color: "var(--ink)" }}>{t("Wiederholen", "Review")}</h1>
        <Link href={preview ? "/review" : "/home"} style={{ fontSize: 14, color: "var(--ink)", fontWeight: 600 }}>{preview ? t("← Wiederholen", "← Review") : t("← Startseite", "← Home")}</Link>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--text-secondary)", marginBottom: 10 }}>
        <span>{t("Frage", "Item")} {Math.min(i + 1, items.length)} / {items.length}</span>
        <span>{xpTotal} XP {tierSummary}</span>
      </div>

      {current.kind === "grammar" ? (
        <GrammarItemView key={current.item.id} item={current.item as GrammarItem} onResult={onResult} tactile hideXp hideMeta />
      ) : (
        <VocabItemView key={current.item.id} item={current.item as VocabItem} onResult={onResult} onCheck={onCheck} hideXp hideMeta />
      )}

      {answered && (
        <button className="dg-btn" onClick={next} style={{ marginTop: 14 }}>
          {isLast ? t("Fertig →", "Finish →") : t("Weiter →", "Next →")}
        </button>
      )}
    </main>
  );
}
