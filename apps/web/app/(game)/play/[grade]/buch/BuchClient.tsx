"use client";
// The ssr:false seam: Phaser only ever loads in the browser (the ArcadeClient
// pattern; keeps the bundle guard's one-lazy-chunk law intact).
import dynamic from "next/dynamic";
import type { PaintLevel } from "@domigo/game-paint/level";
import type { GameTaskV2 } from "@domigo/content-schema";

const PaintGame = dynamic(() => import("@domigo/game-paint/game"), {
  ssr: false,
  loading: () => <p style={{ textAlign: "center", fontSize: 15 }}>🖌 Das Buch malt sich …</p>,
});

/** R5-W1 · D1: the dev-only card bench. SAME module as the game, deliberately —
 *  Phaser may live in exactly one chunk (scripts/check-game-bundle.mjs), and a
 *  second entry point would put it in two. */
const PaintDevGallery = dynamic(() => import("@domigo/game-paint/game").then((m) => m.PaintDevGallery), {
  ssr: false,
  loading: () => <p style={{ textAlign: "center", fontSize: 15 }}>Bench lädt …</p>,
});

export default function BuchClient(props: {
  level: PaintLevel;
  art: Record<string, string>;
  tasks: GameTaskV2[];
  hubHref: string;
  buildSha?: string;
  startPhase?: string;
  /** R5-A6: draw the collision grid over the world (teacher door, ?grid=1). */
  debugGrid?: boolean;
  noWarm?: boolean;
  /** R5-W1 · E1: attach the measuring instrument (teacher door, ?perf=1). */
  debugPerf?: boolean;
  /** R5-W1 · D1: which card bench surface to render (dev-only, `?karten=`). */
  cardBench?: string;
}) {
  const { cardBench, ...game } = props;
  if (cardBench !== undefined) {
    return <PaintDevGallery level={props.level} art={props.art} tasks={props.tasks} which={cardBench} />;
  }
  return <PaintGame {...game} />;
}
