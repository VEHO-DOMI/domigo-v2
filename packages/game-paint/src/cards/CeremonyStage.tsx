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
import { burstMotes, heroArtPresent, heroParts, runCompletion } from "./ceremony.ts";
import { heroFullCell } from "../rigSpec.ts";
import { prefersReducedMotion } from "./motion.ts";
import type { PlayerPose } from "../player.ts";

/**
 * R5-W1 · D2 · THE SCENE CUT — a ceremony happens somewhere.
 *
 * Every blind critic of the D1 round landed on the same sentence in different
 * words: „kein einziges Panel stellt die Spielfigur oder eine NPC live in der
 * gemalten Szene dar" · „static single-pose character art versus Rayman's
 * full-body in-scene animation" · „floating text cards". Six ceremony panels
 * were a code-drawn glyph on parchment — a symbol ABOUT a moment instead of the
 * moment.
 *
 * This is a window cut into the card: the room the child is standing in, the
 * boy himself out of the shipped rig striking a pose, and whatever the ceremony
 * is about beside him. Three rules keep it honest rather than decorative:
 *
 *  · THE ROOM IS THE ROOM. The backdrop is the CURRENT phase's own painted
 *    layer, not a stock picture — a ceremony in the hall shows the hall.
 *  · HE IS THE BOY THEY PLAY. The same rig, the same registration, the same
 *    poses the sim uses (F1's lane) — not a ceremony illustration of him.
 *  · IT DEGRADES TO NOTHING. No backdrop, no window; no rig, no boy. The panel
 *    falls back to what it drew before (the keen-art law), because art lands
 *    batch by batch and a card may never break on a missing file.
 */
export function SceneCut({
  art, backdrop, pose = "stand", facing = 1, heroHeight = 96, subject, height = 152,
}: {
  art: Record<string, string>;
  /** the stem of the room's own painted layer, or undefined for no window */
  backdrop?: string;
  pose?: PlayerPose;
  facing?: 1 | -1;
  heroHeight?: number;
  /** what the ceremony is about, standing in the scene beside him */
  subject?: React.ReactNode;
  height?: number;
}): React.ReactElement | null {
  const bg = backdrop !== undefined ? art[backdrop] : undefined;
  const hero = <PaintedHero art={art} height={heroHeight} pose={pose} facing={facing} />;
  // R5-W4 · D3: this guard used to read `hero === null`, which is never true —
  // `hero` is a JSX ELEMENT, and an element is an object whatever the component
  // returns when React later calls it. So the „no rig, no boy" half of the
  // degrade rule three lines up was written down and never wired: a chapter
  // with no hero art still got an empty 152 px panel. It asks the art directly
  // now, which is the question it always meant to ask.
  if (bg === undefined && !heroCellPresent(art, pose)) return null;
  return (
    // the wrapper is fit-content everywhere else (a plate is as wide as its
    // picture); a WINDOW is as wide as the card it is cut into
    <div className="pb-plate-wrap" style={{ width: "100%", display: "block" }}>
      <div className="pb-plate pb-scene" style={{ height, width: "100%" }}>
        {bg !== undefined && (
          <img
            src={bg}
            alt=""
            aria-hidden
            // the LOWER band of the room, where the floor and the props are: a
            // phase layer is a tall painting (1024×1260), and a centred crop of
            // it into a letterbox window is the blank wall above the furniture
            // — found in the render, and it looked like a missing image
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 72%" }}
          />
        )}
        {/* the figures stand ON the floor of the window, not in the middle of
            it — a boy floating in the centre of a room is a sticker, not a
            scene */}
        <div style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "flex-end",
          justifyContent: "center", gap: 14, padding: "0 16px 8px",
        }}>
          {hero}
          {subject}
        </div>
      </div>
    </div>
  );
}

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
/**
 * R5-W4 · D3 · R55 · WHICH CELL OF THE NEW HERO A CEREMONY STRIKES.
 *
 * Koki, replay of 15 August: „auf den Karten ist der ALTE Charakter — hier soll
 * der neue sein."
 *
 * The world has run on the painted `hero2_*` cells since H3; only the ceremony
 * panels still assembled the old modular rig, so the boy on the cards was a
 * different boy from the one the child had just been playing. The mapping is
 * NOT re-decided here — `heroFullCell` is the world's own pose→cell function
 * and it is asked the same question, so the two can never drift apart:
 *
 *   · a ceremony that LEAPS is the celebration    → hero2_cheer
 *   · a ceremony that STANDS is a standing moment → hero2_idle
 *     („er steht vor dem geschlossenen Käfig", „er steht an ihrer Tafel")
 *
 * That is a change of expression as well as of figure: the old rig hard-coded
 * `head_celebrate` onto every ceremony pose, so the boy grinned in front of a
 * cage he had not opened yet. He does not any more.
 */
export const heroCellFor = (pose: PlayerPose): string | null =>
  heroFullCell(pose, 0, 0, 999, pose === "jump");

/** Is there a painted hero for this beat at all? The keen-art law, asked once:
 *  the new cell if it has landed, the old rig if the chapter has only that, and
 *  honestly `false` if it has neither — a card then lays itself out without a
 *  hole where a child should be. */
export const heroCellPresent = (art: Record<string, string>, pose: PlayerPose = "jump"): boolean => {
  const cell = heroCellFor(pose);
  if (cell !== null && art[cell] !== undefined) return true;
  return heroArtPresent(art, pose);
};

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
  // THE NEW HERO FIRST. One painted cell, drawn at the height the beat asks
  // for: the cells carry their own generous transparent margin, so the figure
  // is sized by height and lets its width follow rather than being boxed.
  const cell = heroCellFor(pose);
  const cellUrl = cell !== null ? art[cell] : undefined;
  if (cellUrl !== undefined) {
    return (
      <img
        className={className}
        src={cellUrl}
        alt=""
        aria-hidden
        style={{
          display: "block",
          height,
          width: "auto",
          transform: facing === -1 ? "scaleX(-1)" : undefined,
          // the scene gives him a cast shadow so he carries his own dark edge
          // against any wall; on parchment one soft drop does the same work
          filter: "drop-shadow(0 7px 12px rgba(30,20,10,0.32))",
        }}
      />
    );
  }

  // …and the old modular rig only if this chapter's hero2 batch has not landed.
  // It is a fallback, not a second look: no card may hang on one file.
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
