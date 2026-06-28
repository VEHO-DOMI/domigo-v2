/**
 * /play/[grade] — the story hub. For a grade with a map@1 (g1) it lists overworld
 * ZONES; otherwise (g2 detective) it lists released CHAPTERS as case files. A stop
 * unlocks once its chapter is released (chapter N requires units ≤ N). Locked
 * stops show "coming soon". Simple server-rendered cards.
 */
/* eslint-disable @next/next/no-img-element -- decorative ligne-claire banners served from synced public/art assets; next/image adds no value for these */
import { redirect } from "next/navigation";
import { loadGameMap, loadReleasedChapters, loadStory } from "@domigo/content-loader";
import { getDb, getSolvedGameItemIds } from "@domigo/db";
import { EvidenceGallery, EVIDENCE, type EvidencePiece } from "@domigo/game-detective";
import { getActingUserForPage } from "@/lib/identity";
import { resolveHubArt, resolveEvidenceArt } from "@/lib/story-art";

export const dynamic = "force-dynamic";

const STORY_BY_GRADE: Record<number, string> = { 1: "g1.st.lost-pages", 2: "g2.st.wrong-name" };

export default async function HubPage({ params }: { params: Promise<{ grade: string }> }) {
  const { grade: gradeStr } = await params;
  const grade = Number(gradeStr);
  if (![1, 2, 3, 4].includes(grade)) redirect("/home");

  const acting = await getActingUserForPage();
  if (!acting) redirect("/signin");

  const storyId = STORY_BY_GRADE[grade];
  const map = storyId ? loadGameMap(storyId) : null;
  const story = storyId ? loadStory(storyId) : null;
  const released = storyId ? loadReleasedChapters(storyId) : [];

  const hubArt = storyId && !map ? resolveHubArt(storyId, grade) : null;

  // Persistent Evidence Board (g2 detective only): each chapter's piece unlocks
  // once every one of its clue tasks is solved (tier <> 'wrong') — derived from
  // the authoritative attempts ledger, never the wipeable cosmetic save (Law 2).
  const solvedItemIds =
    story && !map
      ? await getSolvedGameItemIds(getDb(), acting.userId, grade).catch(() => new Set<string>())
      : new Set<string>();
  const evidenceArt: Record<string, string> = story && storyId && !map ? resolveEvidenceArt(storyId, grade, story) : {};
  const pieces: EvidencePiece[] =
    story && !map
      ? story.chapters.map((c, i): EvidencePiece => {
          const refs = c.scenes.flatMap((s) => s.taskSlots).map((ts) => ts.itemId);
          const unlocked = refs.length > 0 && refs.every((ref) => solvedItemIds.has(ref));
          return { chapterId: c.id, caseNo: i + 1, label: EVIDENCE[c.id] ?? "a clue", img: evidenceArt[c.id], unlocked };
        })
      : [];

  const noun = map ? "Zone" : "Case";
  const stops = map
    ? map.zones.map((z) => ({
        id: "",
        short: z.id.split(".").pop() ?? "",
        title: z.titleEn,
        sub: z.titleDe,
        n: z.unit,
        unlocked: story?.chapters.some((c) => c.unit === z.unit && released.includes(c.id)) ?? false,
      }))
    : (story?.chapters ?? []).map((c, i) => ({
        id: c.id,
        short: c.id.split(".").pop() ?? "",
        title: c.titleEn,
        sub: c.titleDe,
        n: i + 1,
        unlocked: released.includes(c.id),
      }));

  const tagline = map ? "Choose a page to bring back. New pages open as you learn more." : "Open a case file to investigate. New cases open as you learn more.";

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <h1 style={{ fontSize: 24, margin: 0 }}>{story?.title.en ?? "Play"}</h1>
        <a href="/home" style={{ fontSize: 14, color: "#2563eb" }}>← Home</a>
      </div>
      <p style={{ color: "#475569", marginTop: 0 }}>{tagline}</p>
      {hubArt?.cover && <img src={hubArt.cover} alt="" style={{ display: "block", width: "100%", height: 180, objectFit: "cover", borderRadius: 14, margin: "4px 0 8px" }} />}

      {stops.length === 0 ? (
        <p style={{ color: "#64748b" }}>Nothing here yet for this grade.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14, marginTop: 16 }}>
          {stops.map((s) => {
            const cardImg = hubArt?.cards[s.id];
            return s.unlocked ? (
              <a
                key={s.short}
                href={`/play/${grade}/${s.short}`}
                style={{ display: "block", padding: "16px 18px", borderRadius: 12, border: "1px solid #cbd5e1", background: "#fff", textDecoration: "none", color: "#0f172a", boxShadow: "0 1px 2px rgba(0,0,0,.04)", overflow: "hidden" }}
              >
                {cardImg && <img src={cardImg} alt="" style={{ display: "block", width: "calc(100% + 36px)", margin: "-16px -18px 12px", height: 120, objectFit: "cover" }} />}
                <div style={{ fontSize: 12, color: "#64748b" }}>{noun} {s.n}</div>
                <div style={{ fontSize: 17, fontWeight: 600 }}>{s.title}</div>
                {s.sub && <div style={{ fontSize: 13, color: "#64748b" }}>{s.sub}</div>}
                <div style={{ fontSize: 13, color: "#2563eb", marginTop: 8 }}>{map ? "Play →" : "Open →"}</div>
              </a>
            ) : (
              <div key={s.short} style={{ padding: "16px 18px", borderRadius: 12, border: "1px dashed #cbd5e1", background: "#f8fafc", color: "#94a3b8" }}>
                <div style={{ fontSize: 12 }}>{noun} {s.n}</div>
                <div style={{ fontSize: 17, fontWeight: 600 }}>{s.title}</div>
                <div style={{ fontSize: 13, marginTop: 8 }}>🔒 Coming soon</div>
              </div>
            );
          })}
        </div>
      )}

      {pieces.length > 0 && (
        <section style={{ marginTop: 28 }}>
          <EvidenceGallery pieces={pieces} label="Evidence board (= Beweis)" />
        </section>
      )}
    </main>
  );
}
