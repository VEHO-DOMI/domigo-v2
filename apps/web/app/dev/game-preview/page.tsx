import Link from "next/link";
import { notFound } from "next/navigation";
import { SANDBOX_PROFILES, sandboxEnabled } from "@/lib/sandbox-preview";

export const dynamic = "force-dynamic";

export default function GamePreviewIndex() {
  if (!sandboxEnabled()) notFound();
  return <main data-grade="1" style={{ minHeight: "100vh", padding: "42px 18px", background: "linear-gradient(150deg,#eef5df,#fff7dd 55%,#ead7ae)" }}>
    <section style={{ maxWidth: 760, margin: "0 auto" }}>
      <p style={{ color: "#6d5b32", fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase", fontSize: 12 }}>DomiGo · independent comparison sandbox</p>
      <h1 style={{ margin: "5px 0 10px", color: "#173525", fontFamily: "var(--font-display)", fontSize: "clamp(30px,6vw,50px)" }}>The Lost Pages</h1>
      <p style={{ maxWidth: 620, color: "#425548", fontSize: 17 }}>Choose a predictable Grade 1 test profile. Each link receives its own short-lived authorization in that browser tab, so teacher and student previews stay independent.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 14, marginTop: 25 }}>
        {Object.entries(SANDBOX_PROFILES).map(([key, profile]) => <Link key={key} className="dg-tile" href={`/dev/game-preview/${key}`} style={{ padding: 20, borderColor: "#d4bd74", background: "rgba(255,248,223,.92)" }}><strong style={{ display: "block", color: "#31583f", fontSize: 18 }}>{profile.displayName}</strong><span style={{ display: "block", marginTop: 7, color: "#6f674e" }}>{key === "fresh" ? "Starts in the Book Atrium with no progress." : key === "midway" ? "Classroom restored; the Library route is open." : "Page restored; Hidden Room collectible found."}</span></Link>)}
      </div>
      <p style={{ marginTop: 24, color: "#7c7256", fontSize: 13 }}>Local comparison only · port 3210 · unavailable in production</p>
    </section>
  </main>;
}
