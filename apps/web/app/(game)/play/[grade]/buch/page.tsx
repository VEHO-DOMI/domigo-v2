/**
 * /play/[grade]/buch — THE PAINTED BOOK (doc 31). PR ④ "first light": the
 * movement toy on the draft ch01 level. TEACHER-PREVIEW ONLY in production
 * (the ACCESS-MAP row landed with doc 31; students never see this until the
 * M-gates pass). The level runs the FULL law gate at request time — a level
 * that breaks its own laws fails the page, never serves.
 */
import { redirect } from "next/navigation";
import { checkLevelLaws, parsePaintLevel, type PaintLevel } from "@domigo/game-paint/level";
import { getPlayerForPage, getTeacherForPage } from "@/lib/identity";
import { loadPaintLevel } from "@/lib/paint-content";
import { resolvePaintArt } from "@/lib/paint-art";
import BuchClient from "./BuchClient";

export default async function BuchPage({
  params,
  searchParams,
}: {
  params: Promise<{ grade: string }>;
  searchParams: Promise<{ phase?: string }>;
}) {
  const { grade: gradeStr } = await params;
  const { phase } = await searchParams;
  if (gradeStr !== "1") redirect("/home");
  // pre-release gate with the teacher door (the run/world posture)
  const teacher = await getTeacherForPage();
  if (process.env.VERCEL_ENV === "production" && teacher === null) redirect(`/play/${gradeStr}`);
  const acting = await getPlayerForPage();
  if (!acting) redirect("/signin");

  const raw = loadPaintLevel("g1.st.lost-pages", "ch01");
  const level = parsePaintLevel(raw as PaintLevel);
  const failures = checkLevelLaws(level);
  if (failures.length > 0) {
    throw new Error(`paint level laws violated: ${failures.map((f) => `${f.phase}/${f.law}`).join(", ")}`);
  }
  const art = resolvePaintArt();
  const startPhase = teacher !== null && phase !== undefined ? phase : undefined; // teacher debug door

  return (
    <main style={{ padding: "12px 8px", background: "#f3ead6", minHeight: "100vh" }}>
      <BuchClient
        level={level}
        art={art}
        hubHref={`/play/${gradeStr}`}
        buildSha={process.env.VERCEL_GIT_COMMIT_SHA}
        startPhase={startPhase}
      />
    </main>
  );
}
