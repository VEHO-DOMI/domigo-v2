/**
 * /play/[grade]/buch/[chapter] — THE PAINTED BOOK (doc 31). PR ④ "first light":
 * the movement toy on the draft ch01 level. TEACHER-PREVIEW ONLY in production
 * (the ACCESS-MAP row landed with doc 31; students never see this until the
 * M-gates pass). The level runs the FULL law gate at request time — a level
 * that breaks its own laws fails the page, never serves.
 *
 * L0 · D1 · DAS KAPITEL STEHT IN DER ADRESSE.
 *
 * Bis zur Level-Welle lud diese Seite `"ch01"` als festen Text — zweimal, für
 * das Level und für die Karten — und `[grade]` war die Klassenstufe, nicht das
 * Kapitel. Es gab also genau ein spielbares Kapitel, und kein Tor hätte je
 * bemerkt, dass ein zweites existiert. Das Kapitel ist jetzt ein eigenes
 * Adress-Segment; `/play/1/buch` leitet auf `/play/1/buch/ch01` um, damit jeder
 * bestehende Link (Lesezeichen, Admin-Karte, Kokis Rundgänge) weiter trägt.
 *
 * DREI SCHLÖSSER, in dieser Reihenfolge:
 *   1. Form — `CHAPTER_ID` (`chNN`), sonst 404 ohne Datei-Zugriff.
 *   2. Bestand — `listPaintChapters()` liest, was WIRKLICH auf der Platte liegt;
 *      ein Kapitel, das es nicht gibt, ist ein 404 und kein Serverfehler.
 *   3. Reife — ein Kapitel mit `draft: true` wird noch gebaut und ist in JEDER
 *      Umgebung nur hinter der Lehrer-Tür sichtbar, auch lokal. Das Kapitel,
 *      das fertig ist, behält die alte Regel (Lehrer-Tür nur in Produktion).
 */
import { notFound, redirect } from "next/navigation";
import { allPhases, checkLevelLaws, parsePaintLevel, type PaintLevel } from "@domigo/game-paint/level";
import { getPlayerForPage, getTeacherForPage } from "@/lib/identity";
import { CHAPTER_ID, chapterHasTasks, listPaintChapters, loadPaintLevel, loadPaintTasksV2 } from "@/lib/paint-content";
import { resolvePaintArt } from "@/lib/paint-art";
import BuchClient from "./BuchClient";

/** Die eine Geschichte, die das gemalte Buch heute trägt. */
const STORY = "g1.st.lost-pages";

export default async function BuchPage({
  params,
  searchParams,
}: {
  params: Promise<{ grade: string; chapter: string }>;
  searchParams: Promise<{ phase?: string; grid?: string; perf?: string; karten?: string; karte?: string; warm?: string }>;
}) {
  const { grade: gradeStr, chapter } = await params;
  const { phase, grid, perf, karten, karte, warm } = await searchParams;
  if (gradeStr !== "1") redirect("/home");
  // Lock 1+2: the shape, then the shelf. Both before any file is opened, so a
  // stray URL is a plain 404 and never a stack trace.
  if (!CHAPTER_ID.test(chapter) || !listPaintChapters(STORY).includes(chapter)) notFound();
  // pre-release gate with the teacher door (the run/world posture)
  const teacher = await getTeacherForPage();
  if (process.env.VERCEL_ENV === "production" && teacher === null) redirect(`/play/${gradeStr}`);
  const acting = await getPlayerForPage();
  if (!acting) redirect("/signin");

  const raw = loadPaintLevel(STORY, chapter);
  // Lock 3: a chapter still being built is a teacher surface EVERYWHERE. The
  // check reads the file rather than a list of chapter names, so a chapter
  // leaves the workshop by dropping ONE field and nothing else.
  if (raw.draft === true && teacher === null) redirect(`/play/${gradeStr}`);
  // The schema parse stays on every request — it is 3 ms and it is what turns
  // raw JSON into a typed level.
  const level = parsePaintLevel(raw as PaintLevel);
  // R5-W1 · E1 · THE LAWS ARE AN AUTHORING GUARD, NOT A REQUEST-TIME ONE.
  // Measured on this machine: checkLevelLaws takes ~3 s on the shipped chapter
  // (the trap-pocket law runs one reachability search per reachable cell —
  // 114 of them in p2 alone), and it ran on EVERY page render. Every child
  // waited ~2–5 s for the server to re-prove a level that had not changed since
  // the commit that shipped it. The proof belongs where the level changes:
  // content-levels.test.ts runs these same laws on every shipped level in CI,
  // and the proof tapes replay them through the real engine. So authors keep
  // the instant feedback, and production trusts the gate that already ran.
  // NODE_ENV, not VERCEL_ENV: the guard belongs where levels are EDITED (the
  // dev server), and a preview deployment is a place Koki reviews, not a place
  // anyone authors — it should be as fast as production.
  if (process.env.NODE_ENV !== "production") {
    const failures = checkLevelLaws(level);
    if (failures.length > 0) {
      throw new Error(`paint level laws violated: ${failures.map((f) => `${f.phase}/${f.law}`).join(", ")}`);
    }
  }
  // L0 · D2: der Kunst-Auflöser bekommt das Kapitel. Vorher waren die Ordner
  // fest `["hero", "ch01"]` — jedes andere Kapitel hätte die Bilder von Kapitel
  // 1 bekommen, was schlimmer ist als gar keine.
  const art = resolvePaintArt(chapter);
  // Ein Kapitel im Bau hat noch keine Karten. Das ist kein Fehler, sondern der
  // Normalzustand einer Kapitel-Bahn zwischen Gitter und Aufgaben — die Welt
  // läuft, die Karten kommen später.
  const tasks = chapterHasTasks(STORY, chapter) ? loadPaintTasksV2(STORY, chapter) : []; // PB-T8: the card-kit v2 set
  // teacher debug door — VALIDATED against the level's own phase ids. An
  // unknown value used to reach the Sim constructor and throw ("unknown phase
  // p1\""), white-screening the page: a stray character in a pasted URL took
  // the whole game down instead of just starting at phase one.
  const known = new Set(allPhases(level).map((p) => p.id));
  const startPhase = teacher !== null && phase !== undefined && known.has(phase) ? phase : undefined;
  // R5-A6: the picture-vs-grid instrument, gated exactly like the phase door
  const debugGrid = teacher !== null && grid === "1";
  // R5-W1 · E1: the measuring instrument, gated exactly like the grid door
  const debugPerf = teacher !== null && perf === "1";
  // R5-N3 · E4: the pre-warmer's OFF switch, gated exactly like the two above.
  // It exists so the fix can be measured against itself on ONE build — a
  // before/after taken from two different builds compares two machines' moods
  // as much as it compares the change.
  const noWarm = teacher !== null && warm === "0";
  // R5-W1 · D1: the card bench — a measuring instrument, not a surface of the
  // game. Two locks, not one: the teacher door AND the build. It cannot be
  // opened in a production build even by a teacher, because a bench that
  // renders cards out of their fiction is exactly the thing a child must never
  // be handed a link to.
  const cardBench = teacher !== null && process.env.NODE_ENV !== "production" && karten !== undefined ? karten : undefined;
  // R5-W6b · W5 · C5s Befund: eine Farb-Flaeche der Bank zeigt die ERSTE Karte
  // ihrer Art — beim Umfaerben also immer den Radiergummi. Ein Schirmbild der
  // Buch-Karte war damit nicht herstellbar, und die C-Bahn hat ihre eigene
  // Lieferung nie in der Karte sehen koennen, in der das Kind sie sieht.
  // `?karte=<id>` waehlt sie namentlich. Es haengt an denselben zwei Schloessern
  // wie die Bank selbst (Lehrer-Tuer UND Nicht-Produktionsbau) — ohne Bank
  // bedeutet es nichts.
  const cardBenchTask = cardBench !== undefined ? karte : undefined;

  return (
    <main style={{ padding: "12px 8px", background: "#f3ead6", minHeight: "100vh" }}>
      <BuchClient
        level={level}
        art={art}
        tasks={tasks}
        hubHref={`/play/${gradeStr}`}
        buildSha={process.env.VERCEL_GIT_COMMIT_SHA}
        startPhase={startPhase}
        debugGrid={debugGrid}
        debugPerf={debugPerf}
        noWarm={noWarm}
        cardBench={cardBench}
        cardBenchTask={cardBenchTask}
      />
    </main>
  );
}
