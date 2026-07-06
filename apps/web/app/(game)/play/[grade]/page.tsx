/**
 * /play/[grade] — the story hub. For a grade with a map@1 (g1) it lists overworld
 * ZONES; otherwise (g2 detective) it lists released CHAPTERS as case files. A stop
 * unlocks once its chapter is released (chapter N requires units ≤ N). Locked
 * stops show "coming soon". Simple server-rendered cards.
 */
/* eslint-disable @next/next/no-img-element -- decorative ligne-claire banners served from synced public/art assets; next/image adds no value for these */
import { redirect } from "next/navigation";
import { loadGameMap, loadReleasedChapters, loadStory, storyIdForGrade } from "@domigo/content-loader";
import { getDb, getSolvedGameItemIds } from "@domigo/db";
import { EvidenceGallery, EVIDENCE, type EvidencePiece } from "@domigo/game-detective";
import { SeasonBoard, type EpisodeProgress } from "@domigo/game-novel";
import { JournalBoard, type DayProgress } from "@domigo/game-trip";
import { ZoneBoard, type ZoneProgress } from "@domigo/game-2d/board";
import { getActingUserForPage } from "@/lib/identity";
import { resolveHubArt, resolveEvidenceArt } from "@/lib/story-art";

export const dynamic = "force-dynamic";

export default async function HubPage({ params }: { params: Promise<{ grade: string }> }) {
  const { grade: gradeStr } = await params;
  const grade = Number(gradeStr);
  if (![1, 2, 3, 4].includes(grade)) redirect("/home");

  const acting = await getActingUserForPage();
  if (!acting) redirect("/signin");

  // One released story per grade, derived from the corpus (no stale hand-maintained maps).
  const storyId = storyIdForGrade(grade);
  const map = storyId ? loadGameMap(storyId) : null;
  const story = storyId ? loadStory(storyId) : null;
  const released = storyId ? loadReleasedChapters(storyId) : [];
  const isDetective = grade === 2; // the Evidence Board is the g2 detective skin only

  // Hub cover + cards art (only-present discipline: resolves only stems that exist on
  // disk, else null → procedural fallback). g1 keys its cards by ZONE id (= the stop id).
  const hubArt = storyId ? resolveHubArt(storyId, grade) : null;

  // Persistent progress surfaces (g2 Evidence Board + g3 Season board): a chapter's
  // piece/episode completes once every one of its taskSlot items is solved (tier <>
  // 'wrong') — derived from the authoritative attempts ledger, never the wipeable
  // cosmetic save (Law 2).
  const tracksProgress = isDetective || grade === 3 || grade === 1 || grade === 4;
  const solvedItemIds =
    tracksProgress && story
      ? await getSolvedGameItemIds(getDb(), acting.userId, grade).catch(() => new Set<string>())
      : new Set<string>();
  const evidenceArt: Record<string, string> = isDetective && story && storyId ? resolveEvidenceArt(storyId, grade, story) : {};
  const pieces: EvidencePiece[] =
    isDetective && story
      ? story.chapters.map((c, i): EvidencePiece => {
          const refs = c.scenes.flatMap((s) => s.taskSlots).map((ts) => ts.itemId);
          const unlocked = refs.length > 0 && refs.every((ref) => solvedItemIds.has(ref));
          return { chapterId: c.id, caseNo: i + 1, label: EVIDENCE[c.id] ?? "a clue", img: evidenceArt[c.id], unlocked };
        })
      : [];

  // g3 FOURTEEN season board: each episode "wraps" once all its taskSlot items are solved.
  const episodes: EpisodeProgress[] =
    grade === 3 && story
      ? story.chapters.map((c, i): EpisodeProgress => {
          const refs = c.scenes.flatMap((s) => s.taskSlots).map((ts) => ts.itemId);
          const finished = refs.length > 0 && refs.every((ref) => solvedItemIds.has(ref));
          return { chapterId: c.id, epNo: i + 1, titleEn: c.titleEn, finished, released: released.includes(c.id) };
        })
      : [];

  // g4 "Lost for Words" trip journal: a day is "stamped" once all its taskSlot items are solved.
  const days: DayProgress[] =
    grade === 4 && story
      ? story.chapters.map((c, i): DayProgress => {
          const refs = c.scenes.flatMap((s) => s.taskSlots).map((ts) => ts.itemId);
          const stamped = refs.length > 0 && refs.every((ref) => solvedItemIds.has(ref));
          return { chapterId: c.id, dayNo: i + 1, titleEn: c.titleEn, stamped, released: released.includes(c.id) };
        })
      : [];

  // g1 "Lost Pages" board: a zone's page is "restored" once every taskSlot item in its chapter is solved.
  const zones: ZoneProgress[] =
    grade === 1 && map && story
      ? map.zones.map((z): ZoneProgress => {
          const chapter = story.chapters.find((c) => c.unit === z.unit && released.includes(c.id));
          const refs = chapter ? chapter.scenes.flatMap((s) => s.taskSlots).map((ts) => ts.itemId) : [];
          const restored = refs.length > 0 && refs.every((ref) => solvedItemIds.has(ref));
          return { zoneId: z.id, pageNo: z.unit, titleEn: z.titleEn, restored, unlocked: !!chapter };
        })
      : [];

  const noun = map ? "Zone" : grade === 3 ? "Episode" : grade === 4 ? "Day" : "Case";
  const stops = map
    ? map.zones.map((z) => ({
        id: z.id,
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

  const tagline = map
    ? "Choose a page to bring back. New pages open as you learn more."
    : grade === 3
      ? "Write the next episode of FOURTEEN. New episodes open as you learn more."
      : grade === 4
        ? "One week in England — write it down as it happens. New days open as you learn more."
        : "Open a case file to investigate. New cases open as you learn more.";

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <h1 style={{ fontSize: 26, margin: 0, fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--ink)" }}>{story?.title.en ?? "Play"}</h1>
        <a href="/home" style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>← Home</a>
      </div>
      <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>{tagline}</p>
      {hubArt?.cover && <img src={hubArt.cover} alt="" style={{ display: "block", width: "100%", height: 180, objectFit: "cover", borderRadius: 16, margin: "4px 0 8px", border: "1px solid var(--card-border)" }} />}

      {stops.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>Nothing here yet for this grade.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14, marginTop: 16 }}>
          {stops.map((s) => {
            const cardImg = hubArt?.cards[s.id];
            return s.unlocked ? (
              <a key={s.short} href={`/play/${grade}/${s.short}`} className="dg-tile" style={{ padding: "16px 18px" }}>
                {cardImg && <img src={cardImg} alt="" style={{ display: "block", width: "calc(100% + 36px)", margin: "-16px -18px 12px", height: 120, objectFit: "cover" }} />}
                <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "var(--font-label)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>{noun} {s.n}</div>
                <div style={{ fontSize: 17, fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--ink)" }}>{s.title}</div>
                {s.sub && <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{s.sub}</div>}
                <div style={{ fontSize: 13, color: "var(--accent)", marginTop: 8, fontWeight: 600 }}>{map ? "Play →" : "Open →"}</div>
              </a>
            ) : (
              <div key={s.short} className="dg-tile--locked" style={{ padding: "16px 18px" }}>
                <div style={{ fontSize: 11, fontFamily: "var(--font-label)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>{noun} {s.n}</div>
                <div style={{ fontSize: 17, fontWeight: 700, fontFamily: "var(--font-display)" }}>{s.title}</div>
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

      {episodes.length > 0 && (
        <section style={{ marginTop: 28 }}>
          <SeasonBoard episodes={episodes} label="The season so far" />
        </section>
      )}

      {days.length > 0 && (
        <section style={{ marginTop: 28 }}>
          <JournalBoard days={days} label="Your trip journal (= Reisetagebuch)" />
        </section>
      )}

      {zones.length > 0 && (
        <section style={{ marginTop: 28 }}>
          <ZoneBoard zones={zones} label="The Lost Pages" />
        </section>
      )}
    </main>
  );
}
