// PK-R6 · H1 · THE CEREMONY STAGE (round-1 critique, ceremonies findings 4+6).
//
// „A chapter-completion moment rendered as a static ‚0 von X' checklist with no
// count-up, no particles, no character reaction — the emotional payoff
// Rayman-tier games always sell with a fanfare beat is simply absent."
//
// This file is the three things that were missing, and nothing else: the child
// himself, staged large and mid-cheer; the burst thrown around him; and the
// clock the tallies count against. The arithmetic behind all three is pure and
// tested (cards/ceremony.ts) — what lives here is only the drawing of it.
import React from "react";
import { burstMotes, heroParts, runCompletion } from "./ceremony.ts";
import { prefersReducedMotion } from "./motion.ts";
import type { PlayerPose } from "../player.ts";

/**
 * A ceremony clock in milliseconds since the beat started, stopping at
 * `untilMs` — and starting AT Infinity when the child asked for reduced motion,
 * so every counter is already on its final number and every beat is already
 * finished (the end-states law, in JS rather than CSS).
 */
export const useCeremonyClock = (untilMs: number): number => {
  const [ms, setMs] = React.useState<number>(() => (prefersReducedMotion() ? Number.POSITIVE_INFINITY : 0));
  React.useEffect(() => {
    if (prefersReducedMotion()) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number): void => {
      const e = t - t0;
      if (e >= untilMs) { setMs(Number.POSITIVE_INFINITY); return; } // done: stop the loop
      setMs(e);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [untilMs]);
  return ms;
};

/**
 * THE CHILD, PAINTED, LARGE (finding 6: „consistently tiny and pushed to a
 * frame corner in ceremony screens").
 *
 * Composed from the SHIPPED rig cells — the same registration, mirroring and
 * hand scale the scene uses — so this is the boy the child has been playing,
 * not a ceremony illustration of him. He is drawn only when his art has landed;
 * a level whose hero batch is still ungenerated simply gets no figure, exactly
 * as the keen-art law says (the game never breaks on a missing file).
 */
export function PaintedHero({
  art, height, pose = "jump", facing = 1, className,
}: {
  art: Record<string, string>;
  height: number;
  /** which shipped pose to strike — the leap IS the cheer (rigSpec's flare) */
  pose?: PlayerPose;
  /** −1 turns him around (he walks INTO the door on the way out) */
  facing?: 1 | -1;
  className?: string;
}): React.ReactElement | null {
  const parts = heroParts(height, pose).filter((p) => art[p.stem] !== undefined);
  // a hero without a body or a face is not a graceful fallback, it is a bug
  // wearing one — draw nobody rather than a floating pair of mittens
  if (!parts.some((p) => p.part === "body") || !parts.some((p) => p.part === "head")) return null;

  const minX = Math.min(...parts.map((p) => p.x - p.size / 2));
  const maxX = Math.max(...parts.map((p) => p.x + p.size / 2));
  const minY = Math.min(...parts.map((p) => p.y - p.size / 2));
  const maxY = Math.max(...parts.map((p) => p.y + p.size / 2));

  return (
    <div
      className={className}
      aria-hidden
      style={{
        position: "relative",
        width: maxX - minX,
        height: maxY - minY,
        transform: facing === -1 ? "scaleX(-1)" : undefined,
        // the scene gives him a cast shadow so he carries his own dark edge
        // against any wall; on parchment one soft drop does the same work
        filter: "drop-shadow(0 7px 12px rgba(30,20,10,0.32))",
      }}
    >
      {parts.map((p) => (
        <img
          key={p.part}
          src={art[p.stem]}
          alt=""
          style={{
            position: "absolute",
            left: p.x - p.size / 2 - minX,
            top: p.y - p.size / 2 - minY,
            width: p.size,
            height: p.size,
            transform: `rotate(${p.rot}rad)${p.flip ? " scaleX(-1)" : ""}`,
            // the far hand sits a step darker — it welds to the body's light
            filter: p.dim ? "brightness(0.86)" : undefined,
          }}
        />
      ))}
    </div>
  );
}

/**
 * THE BURST (finding 4: „no burst of sparkle/confetti particles on chapter
 * completion"). Chalk-and-amber motes thrown outward on the book's own dust
 * colours, as many as the run earned — and every one of them placed by its own
 * index, so the celebration a replayed tape plays is the celebration the child
 * saw. It rides the `pb-spark` rule the card's own cheer already uses, which is
 * also what keeps the reduced-motion kill list covering it.
 */
export function CeremonyBurst({ completion }: { completion: number }): React.ReactElement {
  return (
    <>
      {burstMotes(completion).map((m, i) => (
        <span
          key={i}
          className="pb-spark"
          aria-hidden
          style={{
            left: "50%",
            top: "50%",
            width: m.size * 2,
            height: m.size * 2,
            marginLeft: -m.size,
            marginTop: -m.size,
            background: m.chalk ? "#f6f2e8" : "#e8c07a",
            boxShadow: m.chalk ? "0 0 8px rgba(246,242,232,0.9)" : "0 0 10px rgba(232,192,122,0.85)",
            animationDelay: `${m.delayMs}ms`,
            animationDuration: "900ms",
            ["--pb-dx" as string]: `${m.dx}px`,
            ["--pb-dy" as string]: `${m.dy}px`,
          } as React.CSSProperties}
        />
      ))}
    </>
  );
}

/** The completion the burst is sized against — re-exported so the score page
 *  reads the run from ONE place rather than computing a second opinion. */
export { runCompletion };
