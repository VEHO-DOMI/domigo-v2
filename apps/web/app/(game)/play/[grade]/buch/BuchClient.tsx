"use client";
// The ssr:false seam: Phaser only ever loads in the browser (the ArcadeClient
// pattern; keeps the bundle guard's one-lazy-chunk law intact).
import { useState } from "react";
import dynamic from "next/dynamic";
import type { PaintLevel } from "@domigo/game-paint/level";
import type { GameTaskV2 } from "@domigo/content-schema";
import { rememberRegelSeite } from "@/lib/regelbuch";
import { auftaktSeen, rememberAuftakt } from "@/lib/auftakt";

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
  // R5-W2 · J1-B: resolved once, at first render — an effect would mount the
  // opening and tear it down a frame later, and a card that flashes is worse
  // than a card that stays. The SSR pass answers `false` (show it), which is
  // the safe direction in both senses.
  // It sits ABOVE the bench's early return on purpose — a hook behind a
  // branch is a hook that runs in one render and not the next.
  const [openingSeen] = useState(() => auftaktSeen(props.level.chapter));

  if (cardBench !== undefined) {
    return <PaintDevGallery level={props.level} art={props.art} tasks={props.tasks} which={cardBench} />;
  }
  // R5-W2 · I1 · THE SEAM. This file is the only place the painted book meets
  // the app, so it is where a found rule page becomes something that outlives
  // the run. The game itself stays network- and storage-free (its proof tapes
  // replay the whole chapter in CI on exactly that property).
  return (
    <PaintGame
      {...game}
      // R5-W2 · J1-B · THE OPENING'S OWN SEAM. Read ONCE, at first render,
      // through a state initialiser (the GameClient idiom): localStorage is
      // client-only, and this component still gets a server pass. No hydration
      // mismatch is possible either way — PaintGame is dynamic(ssr:false), so
      // the flag is never consumed during that pass.
      openingSeen={openingSeen}
      onOpeningRead={() => { rememberAuftakt(props.level.chapter); }}
      onTipCollected={(tip) => {
        rememberRegelSeite({
          chapter: props.level.chapter,
          topicDe: tip.topicDe,
          erklaerungDe: tip.erklaerungDe,
          merksatzDe: tip.merksatzDe,
          schluesselDe: tip.schluesselDe,
          beispieleEn: [...tip.beispieleEn],
          // R5-W4 · I2: the chapter's own count rides along, so the hub can draw
          // a torn stub for every page still missing without knowing the level.
          // Read from the level here rather than from the payload — this is the
          // one side of the seam that HAS the level, and the alternative was a
          // literal on the board.
          total: props.level.tipsTotal ?? 0,
          belegDe: tip.belegDe,
        });
      }}
    />
  );
}
