import LearningShell, { LearningText } from "@/lib/trainer/LearningShell";
import Link from "next/link";
import { redirect } from "next/navigation";
import { listApprovedUnits, loadUnit, loadStory, loadReleasedChapters, loadStoryComprehension, loadStoryEconomy } from "@domigo/content-loader";
import { resolveStudentView } from "@/lib/student-view";
import { isSlugAllowed } from "@/lib/grade-scope";
import PreviewBanner from "@/app/PreviewBanner";
import { getDb, getDueCounts, getDueStoryCount, getDueStoryRefs, listStudentTraps } from "@domigo/db";
import FallenKarte from "./FallenKarte";

export const dynamic = "force-dynamic";

export default async function ReviewPage({ searchParams }: {
  searchParams: Promise<{ jahrgang?: string | string[] }>;
}) {
  const query = await searchParams;
  const view = await resolveStudentView(query.jahrgang);
  if (!view) redirect("/signin");
  const acting = view.kind === "student" ? view.player : null;
  const preview = view.kind === "preview";
  // Preview has no personal queue: no due-count query is made for the teacher.
  const counts = acting ? await getDueCounts(getDb(), acting.userId, acting.classId) : null;
  // An unavailable optional summary must not prevent the due items from opening.
  const traps = acting ? await listStudentTraps(getDb(), acting.classScope, acting.classId, acting.userId, { sinceDays: 30, limit: 3 }).catch(() => []) : [];
  const chapters = preview ? listApprovedUnits().filter((slug) => isSlugAllowed(slug, view.grades)) : [];

  // Story work has its own door, never a standalone card in unit review.
  const storyId = "g3.st.fourteen";
  const story = view.grades.includes(3) ? loadStory(storyId) : null;
  const released = story ? loadReleasedChapters(storyId) : [];
  const storyChapters = story?.chapters.filter((c) => released.includes(c.id)) ?? [];
  const structures = Object.fromEntries(storyChapters.map((c) => [c.unit,
    loadUnit(`g3-u${String(c.unit).padStart(2, "0")}`).grammar.map((g) => g.structureId)]));
  const candidates = story ? (await import("@domigo/game-novel")).storyReviewItems(storyChapters, loadStoryComprehension(storyId)?.items ?? [], structures, loadStoryEconomy(storyId)?.episodes ?? []) : [];
  const scope = { storyId, itemIds: candidates.map((r) => r.item.id) };
  const storyDue = acting ? await getDueStoryCount(getDb(), acting.userId, acting.classId, scope).catch(() => null) : null;
  const firstDue = acting ? await getDueStoryRefs(getDb(), acting.userId, acting.classId, scope, 1).catch(() => []) : [];
  const doorChapter = candidates.find((r) => r.item.id === firstDue[0]?.itemId)?.chapterId ?? storyChapters[0]?.id;
  const storyHref = doorChapter ? `/play/3/${doorChapter.split(".").at(-1)}` : null;

  return (
    <LearningShell preview={preview} grade={view.grades.length === 1 ? view.grades[0] : null}>
      {preview && <PreviewBanner grade={view.grades.length === 1 ? view.grades[0] : undefined} note="Beispielaufgaben ohne persönlichen Wiederholungsstand" />}
    <main style={{ maxWidth: 520, margin: "0 auto", padding: "28px 20px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8 }}>
        <h1 style={{ fontSize: 28, margin: "0 0 4px", fontFamily: "var(--font-display)", color: "var(--ink)" }}><LearningText de="Wiederholen" en="Review" /></h1>
        <Link href={preview ? "/admin/explorer" : "/home"} style={{ fontSize: 14, color: "var(--ink)", fontWeight: 600 }}><LearningText de={preview ? "← Zur Schüleransicht" : "← Startseite"} en={preview ? "← Student preview" : "← Home"} /></Link>
      </div>

      <FallenKarte traps={traps} />

      {storyHref && <section aria-labelledby="story-review-title" style={{ marginTop: 24, marginBottom: 24 }}>
        <h2 id="story-review-title" style={{ fontSize: 20 }}><LearningText de="Wiederholung in der Geschichte" en="Story review" /></h2>
        <p><LearningText de={preview ? "FOURTEEN · Vorschau ohne persönlichen Wiederholungsstand." : storyDue === null ? "Der Wiederholungsstand konnte gerade nicht geladen werden." : `FOURTEEN · ${storyDue} Fragen fällig.`} en={preview ? "FOURTEEN · Preview without personal review progress." : storyDue === null ? "Your review progress could not be loaded." : `FOURTEEN · ${storyDue} items due.`} /></p>
        <Link className="dg-tile" href={storyHref} style={{ display: "block", padding: "16px 18px" }}><LearningText de="Zur Folge in FOURTEEN →" en="Open the FOURTEEN episode →" /></Link>
      </section>}

      {preview ? (
        <div style={{ marginTop: 16 }}>
          <p style={{ color: "var(--text-secondary)" }}><LearningText de="Wähle ein Chapter für eine Wiederholung mit bis zu 20 Beispielaufgaben." en="Choose a Chapter to preview up to 20 review items." /></p>
          {view.grades.map((grade) => {
            const inGrade = chapters.filter((slug) => slug.startsWith(`g${grade}-`));
            if (inGrade.length === 0) return null;
            return (
              <section key={grade} data-grade={grade} style={{ marginTop: 24 }}>
                <h2 style={{ fontSize: 16, fontFamily: "var(--font-label)", color: "var(--ink)" }}><LearningText de="Jahrgang" en="Grade" /> {grade}</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {inGrade.map((slug) => (
                    <Link key={slug} href={`/review/session?jahrgang=${grade}&chapter=${slug}`} className="dg-chip" style={{ padding: "8px 14px" }}>Chapter {Number(slug.match(/-u(\d+)/)?.[1])}</Link>
                  ))}
                </div>
              </section>
            );
          })}
          {chapters.length === 0 && <p><LearningText de="Für diesen Jahrgang gibt es noch keine Wiederholung." en="No review tasks for this school year yet." /></p>}
        </div>
      ) : counts && counts.total === 0 && (!storyHref || storyDue === 0) ? (
        <div style={{ marginTop: 16 }}>
          <p style={{ fontSize: 18, color: "var(--ink)", marginBottom: 4 }}><LearningText de="Alles wiederholt! 🎉" en="You're all caught up! 🎉" /></p>
          <p style={{ color: "var(--text-secondary)", marginTop: 0 }}><LearningText de="Beim Üben sammelst du Wörter und Sätze für deine Wiederholung." en="Practice more to add items to your review." /></p>
          <Link href="/practice" className="dg-tile" style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", marginTop: 12 }}>
            <span aria-hidden="true" style={{ fontSize: 26, lineHeight: 1 }}>📚</span>
            <span style={{ flex: 1 }}>
              <span style={{ display: "block", fontSize: 17, fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--ink)" }}><LearningText de="Üben" en="Practice" /></span>
              <span style={{ display: "block", fontSize: 14, color: "var(--text-secondary)" }}><LearningText de="Wörter und Grammatik nach Chapter" en="Vocabulary & grammar by Chapter" /></span>
            </span>
            <span aria-hidden="true" style={{ color: "var(--ink)", fontSize: 18, fontWeight: 700 }}>→</span>
          </Link>
        </div>
      ) : counts && counts.total > 0 ? (
        <div style={{ marginTop: 16 }}>
          <p style={{ fontSize: 18, color: "var(--ink)", marginBottom: 2 }}>
            <LearningText de={`${counts.total} Fragen fällig`} en={`${counts.total} item${counts.total === 1 ? "" : "s"} due`} />
          </p>
          <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>
            <LearningText de={`${counts.vocab} Wörter · ${counts.grammar} Grammatik`} en={`${counts.vocab} vocabulary · ${counts.grammar} grammar`} />
          </p>
          <Link href="/review/session" className="dg-tile" style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", marginTop: 12 }}>
            <span aria-hidden="true" style={{ fontSize: 26, lineHeight: 1 }}>🔁</span>
            <span style={{ flex: 1 }}>
              <span style={{ display: "block", fontSize: 17, fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--ink)" }}><LearningText de="Wiederholung starten" en="Start review" /></span>
              <span style={{ display: "block", fontSize: 14, color: "var(--text-secondary)" }}><LearningText de="Deine fälligen Wörter und Sätze" en="Answer your due items" /></span>
            </span>
            <span aria-hidden="true" style={{ color: "var(--ink)", fontSize: 18, fontWeight: 700 }}>→</span>
          </Link>
        </div>
      ) : null}
    </main>
    </LearningShell>
  );
}
