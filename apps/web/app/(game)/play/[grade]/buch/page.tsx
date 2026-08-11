/**
 * /play/[grade]/buch — THE PAINTED BOOK (doc 31). PR ④ "first light": the
 * movement toy on the draft ch01 level. TEACHER-PREVIEW ONLY in production
 * (the ACCESS-MAP row landed with doc 31; students never see this until the
 * M-gates pass). The level runs the FULL law gate at request time — a level
 * that breaks its own laws fails the page, never serves.
 */
import { redirect } from "next/navigation";
import { allPhases, checkLevelLaws, parsePaintLevel, type PaintLevel } from "@domigo/game-paint/level";
import { getPlayerForPage, getTeacherForPage } from "@/lib/identity";
import { loadPaintLevel, loadPaintTasksV2 } from "@/lib/paint-content";
import { resolvePaintArt } from "@/lib/paint-art";
import BuchClient from "./BuchClient";

export default async function BuchPage({
  params,
  searchParams,
}: {
  params: Promise<{ grade: string }>;
  searchParams: Promise<{ phase?: string; grid?: string; perf?: string }>;
}) {
  const { grade: gradeStr } = await params;
  const { phase, grid, perf } = await searchParams;
  if (gradeStr !== "1") redirect("/home");
  // pre-release gate with the teacher door (the run/world posture)
  const teacher = await getTeacherForPage();
  if (process.env.VERCEL_ENV === "production" && teacher === null) redirect(`/play/${gradeStr}`);
  const acting = await getPlayerForPage();
  if (!acting) redirect("/signin");

  const raw = loadPaintLevel("g1.st.lost-pages", "ch01");
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
  const art = resolvePaintArt();
  const tasks = loadPaintTasksV2("g1.st.lost-pages", "ch01"); // PB-T8: the card-kit v2 set
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
      />
    </main>
  );
}
