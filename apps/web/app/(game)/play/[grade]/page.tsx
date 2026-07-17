/**
 * /play/[grade] — the story hub. BUNDLE-DERIVED (B-2): a grade whose canonical
 * story ships a map@1 lists overworld ZONES (g1 book-rooms; g2 school floor
 * plan); otherwise it lists released CHAPTERS in the grade's DOM-game skin
 * (g2 detective case files / g3 episodes / g4 journal days). A stop unlocks
 * once its chapter is released (chapter N requires units ≤ N). Locked stops
 * show "coming soon" — except the ink skin, where they render half-erased
 * (the Blank took them; the board itself tells the story).
 */
/* eslint-disable @next/next/no-img-element -- decorative ligne-claire banners served from synced public/art assets; next/image adds no value for these */
import Link from "next/link";
import { redirect } from "next/navigation";
import { loadGameMap, loadReleasedChapters, loadStory, storyIdForGrade } from "@domigo/content-loader";
import { getDb, getSolvedGameItemIds } from "@domigo/db";
import { EvidenceGallery, EVIDENCE, type EvidencePiece } from "@domigo/game-detective";
import { SeasonBoard, type EpisodeProgress } from "@domigo/game-novel";
import { JournalBoard, tripCopyFor, type DayProgress } from "@domigo/game-trip";
import { ZoneBoard, type ZoneProgress } from "@domigo/game-2d/board";
import { FLOOR_PLANS } from "@/lib/floor-plan";
import { getActingUserForPage, getTeacherForPage } from "@/lib/identity";
import { DEFAULT_STORY_UI, HUB_SKIN, STORY_UI } from "@/lib/stories";
import { resolveHubArt, resolveEvidenceArt } from "@/lib/story-art";
import { devReleasedChapters, devStoryOverride } from "@/lib/story-dev";

export const dynamic = "force-dynamic";

export default async function HubPage({ params }: { params: Promise<{ grade: string }> }) {
  const { grade: gradeStr } = await params;
  const grade = Number(gradeStr);
  if (![1, 2, 3, 4].includes(grade)) redirect("/home");

  const acting = await getActingUserForPage();
  if (!acting) redirect("/signin");
  // the Keen story-mode preview is teacher-only until the year-1 release —
  // this card is its ONLY navigation entry (students never see it)
  const teacher = grade === 1 ? await getTeacherForPage() : null;

  // One released story per grade, derived from the corpus (no stale hand-maintained
  // maps). Non-prod: DEV_STORY_G<grade> previews an unreleased bundle (story-dev.ts).
  const devStory = devStoryOverride(grade);
  const storyId = devStory?.storyId ?? storyIdForGrade(grade);
  const map = storyId ? loadGameMap(storyId) : null;
  const story = storyId ? loadStory(storyId) : null;
  const released = devStory
    ? devReleasedChapters(devStory, story?.chapters.map((c) => c.id) ?? [])
    : storyId
      ? loadReleasedChapters(storyId)
      : [];
  // B-2 bundle-derived dispatch: a map@1 story is an overworld; the detective
  // Evidence Board is the g2 DOM-game (chapter-list) skin only.
  const isDetective = grade === 2 && map === null;

  // Hub cover + cards art (only-present discipline: resolves only stems that exist on
  // disk, else null → procedural fallback). g1 keys its cards by ZONE id (= the stop id).
  const hubArt = storyId ? resolveHubArt(storyId, grade) : null;

  // Persistent progress surfaces (g2 Evidence Board + g3 Season board): a chapter's
  // piece/episode completes once every one of its taskSlot items is solved (tier <>
  // 'wrong') — derived from the authoritative attempts ledger, never the wipeable
  // cosmetic save (Law 2).
  const tracksProgress = isDetective || grade === 3 || grade === 4 || map !== null;
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

  // Map-story progress (g1 "Lost Pages" board / g2 floor-plan fill-in): a zone is
  // "restored" once every taskSlot item in its chapter is solved.
  const zones: ZoneProgress[] =
    map && story
      ? map.zones.map((z): ZoneProgress => {
          const chapter = story.chapters.find((c) => c.unit === z.unit && released.includes(c.id));
          const refs = chapter ? chapter.scenes.flatMap((s) => s.taskSlots).map((ts) => ts.itemId) : [];
          const restored = refs.length > 0 && refs.every((ref) => solvedItemIds.has(ref));
          return { zoneId: z.id, pageNo: z.unit, titleEn: z.titleEn, titleDe: z.titleDe, restored, unlocked: !!chapter };
        })
      : [];

  // HUB_THEME doctrine: a story may claim its own card skin ("ink" for The Spill).
  const skin = (storyId ? HUB_SKIN[storyId] : undefined) ?? `g${grade}`;
  const inkHub = skin === "ink";
  // L-1: grade-1 chrome is German (the story-language toggle governs lines only);
  // the ink hub (g2 school campaign) is German-first too (doc 22 §2.6).
  const deChrome = grade === 1 || inkHub;
  // B-3: the g4 trip skin (noun/tagline/board copy) is per-story.
  const tripCopy = grade === 4 && storyId ? tripCopyFor(storyId) : null;
  const noun = inkHub ? "Raum" : deChrome ? "Seite" : map ? "Zone" : grade === 3 ? "Episode" : grade === 4 ? (tripCopy?.hubNoun ?? "Day") : "Case";
  // L-1: at grade 1 the German title leads and English becomes the subtitle.
  const stops = map
    ? map.zones.map((z) => ({
        id: z.id,
        short: z.id.split(".").pop() ?? "",
        title: deChrome ? (z.titleDe ?? z.titleEn) : z.titleEn,
        sub: deChrome ? z.titleEn : z.titleDe,
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

  const tagline = inkHub
    ? "Geh in einen Raum und hol die Wörter zurück. Neue Räume öffnen sich, wenn du mehr lernst."
    : deChrome
    ? "Wähl eine Seite und hol sie zurück. Neue Seiten öffnen sich, wenn du mehr lernst."
    : map
      ? "Choose a page to bring back. New pages open as you learn more."
      : grade === 3
        ? "Write the next episode of FOURTEEN. New episodes open as you learn more."
        : grade === 4
          ? (tripCopy?.hubTagline ?? "New chapters open as you learn more.")
          : "Open a case file to investigate. New cases open as you learn more.";

  // Level-select "cleared" state per stop, derived from the attempts ledger
  // (never the cosmetic save): a stop is done once every taskSlot item in its
  // chapter is solved. Map grades key stops by zone id; chapter grades by chapter id.
  const doneStopIds = new Set<string>();
  if (story) {
    for (const c of story.chapters) {
      const refs = c.scenes.flatMap((sc) => sc.taskSlots).map((ts) => ts.itemId);
      if (refs.length === 0 || !refs.every((ref) => solvedItemIds.has(ref))) continue;
      if (map) {
        const z = map.zones.find((mz) => mz.unit === c.unit);
        if (z) doneStopIds.add(z.id);
      } else {
        doneStopIds.add(c.id);
      }
    }
  }
  const doneLabel = inkHub ? "✨ Wieder da!" : grade === 1 ? "✨ Zurück!" : grade === 2 ? "CLOSED" : grade === 3 ? "✓ uploaded" : "✓ stamped";
  const emblem = inkHub ? "🖋" : (STORY_UI[grade] ?? DEFAULT_STORY_UI).icon;

  // Doc 22 §1 — the ink hub's level select is the school FLOOR PLAN: three
  // labelled bands (Draußen / Erdgeschoss / Oben-Hinten); excursion zones sit
  // "outside the fence" (dashed). Presentation only — unlock stays the linear
  // spine; any zone the plan misses falls back to the flat grid below.
  const floorPlan = inkHub && storyId ? FLOOR_PLANS[storyId] ?? null : null;
  const stopByShort = new Map(stops.map((s) => [s.short, s]));
  const plannedShorts = new Set((floorPlan ?? []).flatMap((b) => b.zones.map((z) => z.short)));

  return (
    <main className="dgh-hub" style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <h1 style={{ fontSize: 26, margin: 0, fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--ink)", display: "flex", alignItems: "center" }}>
          <span className="dgh-emblem" aria-hidden="true">{emblem}</span>
          {(deChrome ? story?.title.de : story?.title.en) ?? story?.title.en ?? "Play"}
        </h1>
        <a href="/home" style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>← Home</a>
      </div>
      <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>{tagline}</p>
      {hubArt?.cover && <img src={hubArt.cover} alt="" style={{ display: "block", width: "100%", height: 180, objectFit: "cover", borderRadius: 16, margin: "4px 0 8px", border: "1px solid var(--card-border)" }} />}

      {(() => {
        if (stops.length === 0) return <p style={{ color: "var(--muted)" }}>Nothing here yet for this grade.</p>;

        const stopCard = (s: (typeof stops)[number], excursion = false) => {
          const cardImg = hubArt?.cards[s.id];
          const done = doneStopIds.has(s.id);
          const themed = `dgh-card dgh-${skin}${excursion ? " dgh-card--excursion" : ""}`;
          const inner = (
            <>
              {(cardImg || grade === 3) && (
                <div className="dgh-thumbwrap">{cardImg && <img src={cardImg} alt="" />}</div>
              )}
              <div className="dgh-label">{noun} {s.n}{excursion ? " · Ausflug" : ""}</div>
              <div className="dgh-title">{s.title}</div>
              {s.sub && <div className="dgh-sub">{s.sub}</div>}
              <div className="dgh-num" aria-hidden="true">{s.n}</div>
            </>
          );
          return s.unlocked ? (
            <a key={s.short} href={`/play/${grade}/${s.short}`} className={`${themed}${done ? " dgh-card--done" : ""}`}>
              {inner}
              <div className="dgh-cta">{deChrome ? "Spielen →" : map ? "Play →" : "Open →"}</div>
              {done && <div className="dgh-done">{doneLabel}</div>}
            </a>
          ) : (
            <div key={s.short} className={`${themed} dgh-card--locked`}>
              {inner}
              <div className="dgh-cta" style={{ color: "var(--muted)" }}>{deChrome ? "🔒 Bald!" : "🔒 Coming soon"}</div>
            </div>
          );
        };

        // Doc 22 §1: the ink hub renders the school floor plan (three bands);
        // every other hub keeps the flat grid. A zone the plan misses falls
        // back to the flat grid below the plan (drift-safe).
        if (floorPlan) {
          const unplanned = stops.filter((s) => !plannedShorts.has(s.short));
          return (
            <div className="dgh-fp">
              {floorPlan.map((band) => (
                <section key={band.label} className="dgh-fp-band">
                  <h2 className="dgh-fp-bandlabel">{band.label}</h2>
                  <div className="dgh-grid dgh-grid--fp">
                    {band.zones.map((ref) => {
                      const s = stopByShort.get(ref.short);
                      return s ? stopCard(s, ref.excursion === true) : null;
                    })}
                  </div>
                </section>
              ))}
              {unplanned.length > 0 && <div className="dgh-grid">{unplanned.map((s) => stopCard(s))}</div>}
            </div>
          );
        }
        return <div className="dgh-grid">{stops.map((s) => stopCard(s))}</div>;
      })()}

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

      {days.length > 0 && tripCopy && (
        <section style={{ marginTop: 28 }}>
          <JournalBoard days={days} label={tripCopy.boardLabel} dayNoun={tripCopy.hubNoun} stampedWord={tripCopy.boardStampedWord} />
        </section>
      )}

      {teacher !== null && (
        <section style={{ marginTop: 20 }}>
          <Link
            href="/play/1/world"
            style={{ display: "block", background: "linear-gradient(135deg, #1b1930, #2c2a44)", color: "#f3f1ff", borderRadius: 16, padding: "16px 20px", textDecoration: "none", border: "2px solid #8b7cf5" }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8b7cf5" }}>Nur für dich sichtbar · Lehrer-Vorschau</div>
            <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "var(--font-display)", margin: "4px 0 2px" }}>🖋 Story-Modus — Die verlorenen Seiten (Keen)</div>
            <div style={{ fontSize: 14, color: "#c9c4e4" }}>Prolog → Weltkarte → Kapitel 1 in voller Grafik. Spielen →</div>
          </Link>
        </section>
      )}

      {zones.length > 0 && grade === 1 && (
        <section style={{ marginTop: 28 }}>
          {/* B-2: board copy via props — these are G1's exact former strings
              (the ink hub needs no board: its floor plan IS the progress surface). */}
          <ZoneBoard
            zones={zones}
            label="Die verlorenen Seiten"
            copy={{
              noun: "Seite",
              countLabel: `${zones.filter((z) => z.restored).length} / ${zones.length} Seiten zurückgeholt`,
              completeLabel: "Das Buch ist wieder ganz — alle Seiten sind zurück!",
            }}
          />
        </section>
      )}
    </main>
  );
}
