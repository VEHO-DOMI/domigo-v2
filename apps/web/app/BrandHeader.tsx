"use client";
/**
 * The persistent DomiGo wordmark header (every screen, like the trainers). It's
 * grade-aware: on a /play/[grade] route it sets data-grade on itself so the
 * wordmark gradient + glow theme to that grade's trainer (g1 green · g2 red ·
 * g3 blue→gold · g4 purple→gold); elsewhere it's the default blue→gold app brand.
 */
import { usePathname } from "next/navigation";

export default function BrandHeader() {
  const pathname = usePathname() ?? "";
  const m = pathname.match(/^\/play\/([1-4])(?:\/|$)/);
  const grade = m ? m[1] : undefined;
  return (
    <header className="dg-app-header" data-grade={grade} style={{ background: "var(--bg)" }}>
      <div className="dg-glow" aria-hidden="true" />
      <a href="/home" className="brand-wordmark" style={{ fontSize: 30, position: "relative", lineHeight: 1 }}>DomiGo</a>
      <div className="dg-tagline">English · Vocabulary &amp; Grammar</div>
    </header>
  );
}
