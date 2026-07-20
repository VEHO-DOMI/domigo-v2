"use client";
// The ssr:false seam: Phaser only ever loads in the browser (the ArcadeClient
// pattern; keeps the bundle guard's one-lazy-chunk law intact).
import dynamic from "next/dynamic";
import type { PaintLevel } from "@domigo/game-paint/level";

const PaintGame = dynamic(() => import("@domigo/game-paint/game"), {
  ssr: false,
  loading: () => <p style={{ textAlign: "center", fontSize: 15 }}>🖌 Das Buch malt sich …</p>,
});

export default function BuchClient(props: {
  level: PaintLevel;
  art: Record<string, string>;
  tasks: Array<{
    id: string; use: string; kind: "choice" | "typed"; storyDe: string; promptEn: string;
    options?: string[]; answer: string;
    hints: { deDesc?: string; deWord?: string; firstLetter?: string; length?: number };
    grounding?: string;
  }>;
  hubHref: string;
  buildSha?: string;
  startPhase?: string;
}) {
  return <PaintGame {...props} />;
}
