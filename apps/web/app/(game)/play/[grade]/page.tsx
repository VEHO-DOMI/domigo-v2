/**
 * /play/[grade] — the zone hub (world map). Lists a grade's map@1 zones; a zone
 * is unlocked once a released story chapter exists for its gate unit (zone N
 * requires units ≤ N released). Locked zones show "coming soon". Kept a simple
 * server-rendered card list — the fancy Phaser hub is later polish.
 */
import { redirect } from "next/navigation";
import { loadGameMap, loadReleasedChapters, loadStory } from "@domigo/content-loader";
import { getActingUserForPage } from "@/lib/identity";

export const dynamic = "force-dynamic";

const STORY_BY_GRADE: Record<number, string> = { 1: "g1.st.lost-pages" };

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

  const zones = (map?.zones ?? []).map((z) => {
    const chapter = story?.chapters.find((c) => c.unit === z.unit && released.includes(c.id));
    return { short: z.id.split(".").pop() ?? "", titleEn: z.titleEn, titleDe: z.titleDe, unit: z.unit, unlocked: chapter !== undefined };
  });

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <h1 style={{ fontSize: 24, margin: 0 }}>The Lost Pages</h1>
        <a href="/home" style={{ fontSize: 14, color: "#2563eb" }}>← Home</a>
      </div>
      <p style={{ color: "#475569", marginTop: 0 }}>Choose a page to bring back. New pages open as you learn more.</p>

      {zones.length === 0 ? (
        <p style={{ color: "#64748b" }}>No zones yet for this grade.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14, marginTop: 16 }}>
          {zones.map((z) =>
            z.unlocked ? (
              <a
                key={z.short}
                href={`/play/${grade}/${z.short}`}
                style={{ display: "block", padding: "16px 18px", borderRadius: 12, border: "1px solid #cbd5e1", background: "#fff", textDecoration: "none", color: "#0f172a", boxShadow: "0 1px 2px rgba(0,0,0,.04)" }}
              >
                <div style={{ fontSize: 12, color: "#64748b" }}>Zone {z.unit}</div>
                <div style={{ fontSize: 17, fontWeight: 600 }}>{z.titleEn}</div>
                {z.titleDe && <div style={{ fontSize: 13, color: "#64748b" }}>{z.titleDe}</div>}
                <div style={{ fontSize: 13, color: "#2563eb", marginTop: 8 }}>Play →</div>
              </a>
            ) : (
              <div
                key={z.short}
                style={{ padding: "16px 18px", borderRadius: 12, border: "1px dashed #cbd5e1", background: "#f8fafc", color: "#94a3b8" }}
              >
                <div style={{ fontSize: 12 }}>Zone {z.unit}</div>
                <div style={{ fontSize: 17, fontWeight: 600 }}>{z.titleEn}</div>
                <div style={{ fontSize: 13, marginTop: 8 }}>🔒 Coming soon</div>
              </div>
            ),
          )}
        </div>
      )}
    </main>
  );
}
