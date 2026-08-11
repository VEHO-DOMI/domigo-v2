// PK-R6 · H1 · THE PAINTED ICON SET (round-1 critique, ceremonies findings 1+2)
//
// WHAT THE BLIND CRITIC SAW: „stock Unicode emoji as bullet icons, sitting
// directly on top of gorgeous watercolor backgrounds — no AAA team would ship a
// hand-painted storybook with default web-app chrome layered over it."
//
// He was right, and the count made it worse than one screenshot showed: ✨ 🎨 🔓
// 📜 📕 🕊️ 🚪 🪢 ⏱ 🖤 🖌 🖼 🏵 — thirteen platform glyphs, drawn by the READER's
// operating system in the reader's own emoji font, across every ceremony the
// chapter has. They are the one class of picture in this game that no painter
// ever touched: on Koki's Mac 🚪 renders as a flat brown slab that a child reads
// as a book, and on a school Windows machine the same card shows an entirely
// different drawing. A book cannot have thirteen pictures it does not own.
//
// So every one of them is drawn here instead, in the book's own materials:
// warm parchment, amber contours, leaf-green ink, the gouache sheen the light
// leaves in every top-left, and outlines that are never quite symmetrical
// (a painted thing is not a rounded rectangle — the same law the card's deckled
// edge obeys). One inline SVG each, no assets, no font glyphs — doc 44 B14's
// „full-code animation is legitimate" clause, the same one the painted seal and
// the painted cage already ride.
//
// TWO CONSTRUCTION RULES, both deliberate:
//  · NO <defs>/gradient ids. These icons appear many times on one page (five
//    score rows, six HUD chips), and duplicated ids in one document are how an
//    icon silently starts wearing another icon's fill. Flat painted fills plus
//    a sheen stroke carry the style without a single id.
//  · aria-hidden throughout. Every line these mark already SAYS what it counts
//    („📜 Regel-Seiten gefunden" → „Regel-Seiten gefunden"), which is F2-33's
//    law; an icon that re-announces it would make a screen reader say it twice.
import React from "react";

/** The book's light, top-left, on every painted surface it owns. */
const SHEEN = "rgba(255,253,244,0.62)";

export type PaintedIconName =
  | "spark" // the collectible (✨) — Buchstaben in ch01, per-unit elsewhere
  | "cage" // a cage standing OPEN, its captive gone (🔓)
  | "wisp" // a freed letter-being (🕊️ / 🔤)
  | "rule" // a Regel-Seite torn out of the book (📜)
  | "book" // a Bonus-Buch / Fibel herself (📕 / 📖)
  | "palette" // colour coming back to a drained thing (🎨)
  | "door" // the door out of the chapter (🚪)
  | "knot" // a knot in the way (🪢)
  | "inkwell" // Klecks' ink clock (⏱)
  | "blot" // Klecks himself (🖤)
  | "brush" // the chapter's own mark, in the HUD (🖌)
  | "slate" // the Tafel (🖼)
  | "rosette"; // a perfect bonus run (🏵)

const paths: Record<PaintedIconName, React.ReactElement> = {
  spark: (
    <>
      <path
        d="M12 2.2 C13.4 7 14.8 9.3 19.6 10.7 C15 12.4 13.4 14.4 12 19.6 C10.8 14.5 9 12.3 4.4 10.8 C9.2 9.4 10.7 7 12 2.2 Z"
        fill="#f2c34a" stroke="#a2560f" strokeWidth="1.1" strokeLinejoin="round"
      />
      <path d="M18.4 15.6 C19.2 16.4 19.9 16.8 21 17.1 C19.8 17.6 19.2 18.2 18.5 19.6 C18.1 18.3 17.6 17.7 16.4 17.2 C17.5 16.9 18 16.5 18.4 15.6 Z" fill="#f7d873" stroke="#a2560f" strokeWidth="0.7" strokeLinejoin="round" />
      <circle cx="4.6" cy="18.2" r="1.1" fill="#f7d873" opacity="0.9" />
      <path d="M9.9 6.6 C10.5 5.2 11.1 4.1 11.8 3.2" fill="none" stroke={SHEEN} strokeWidth="1.1" strokeLinecap="round" />
    </>
  ),
  cage: (
    <>
      {/* THE READ AT 19 PX is the whole design problem here, and the first pass
          failed it: pale bars on a green vessel turned into a garden bin the
          moment it shrank. What makes a cage a cage is DARK BARS OVER LIGHT, so
          the interior is lit and the bars are the ink — legible at any size. */}
      <ellipse cx="12" cy="13.8" rx="8" ry="7" fill="#ffdd93" opacity="0.45" />
      <path
        d="M4.8 10.8 C4.6 9.4 6.2 8.8 8.2 8.6 C11 8.3 13.8 8.3 16.2 8.7 C17.9 9 19.1 9.5 18.9 10.8 L18 17.9 C17.8 19.6 16.1 20.5 13.9 20.6 L9.6 20.6 C7.4 20.5 6 19.6 5.8 17.9 Z"
        fill="#ffe9bd" stroke="#3d5220" strokeWidth="1.4" strokeLinejoin="round"
      />
      {/* somebody is in there — a warm hollow with a head and shoulders in it */}
      <path d="M12 11.4 C13.5 11.4 14.5 12.5 14.5 13.9 C14.5 14.8 14 15.5 13.3 15.9 C15.2 16.5 16.4 17.9 16.7 19.7 L16.9 20.6 L7.1 20.6 L7.3 19.7 C7.6 17.9 8.8 16.5 10.7 15.9 C10 15.5 9.5 14.8 9.5 13.9 C9.5 12.5 10.5 11.4 12 11.4 Z" fill="#c99a5a" opacity="0.75" />
      {/* THE BARS — dark ink, and the only thing that has to survive at 19 px */}
      <g stroke="#33481d" strokeWidth="1.7" strokeLinecap="round">
        <path d="M8.6 9.2 L8.2 20.4" />
        <path d="M12 8.9 L12 20.6" />
        <path d="M15.4 9.2 L15.8 20.4" />
      </g>
      <path d="M5.2 12.4 C9.4 11.8 14.6 11.8 18.6 12.4" fill="none" stroke="#33481d" strokeWidth="1.3" strokeLinecap="round" />
      {/* R5-W1 · D1 (blind critic, exemplar round): the open hoop that used to
          arc over the top gave the whole icon a PADLOCK silhouette — body plus
          shackle — and the critic read the objective line „a classmate is
          stuck" as being marked with a lock. A cage's lid is a LID: hinged at
          the left rim, thrown back and up, with its own bars. Same message
          (this cage stands open), a shape no lock has. */}
      <g transform="rotate(-38 5.6 8.4)">
        <path d="M5.2 6.6 C9.4 5.6 14.4 5.6 18.4 6.7 L18.4 8.6 C14.4 7.5 9.4 7.5 5.2 8.5 Z"
          fill="#ffe9bd" stroke="#3d5220" strokeWidth="1.3" strokeLinejoin="round" />
        <g stroke="#33481d" strokeWidth="1.2" strokeLinecap="round">
          <path d="M9.4 6 L9.4 8.2" />
          <path d="M13.4 5.8 L13.4 8.1" />
        </g>
      </g>
      {/* the hinge it swung on */}
      <circle cx="5.4" cy="8.6" r="1.1" fill="#3d5220" />
      <path d="M6.4 10 C8.6 9.4 11 9.2 13.4 9.3" fill="none" stroke={SHEEN} strokeWidth="1" strokeLinecap="round" />
    </>
  ),
  wisp: (
    <>
      {/* wings first: the being is a letter that got its flight back */}
      <path d="M8.4 10.6 C5.8 7.8 3.4 7.2 2.2 8.2 C1.4 9.6 3.2 12.2 7.6 13.4 Z" fill="#f6e3ae" stroke="#a2560f" strokeWidth="1" strokeLinejoin="round" />
      <path d="M15.6 10.6 C18.2 7.8 20.6 7.2 21.8 8.2 C22.6 9.6 20.8 12.2 16.4 13.4 Z" fill="#f6e3ae" stroke="#a2560f" strokeWidth="1" strokeLinejoin="round" />
      <path
        d="M12 4.6 C15 4.5 16.9 6.6 17 10.2 C17.1 14.6 14.8 17.4 12 17.4 C9.2 17.4 6.9 14.8 7 10.4 C7.1 6.8 9 4.7 12 4.6 Z"
        fill="#f2c34a" stroke="#a2560f" strokeWidth="1.1" strokeLinejoin="round"
      />
      <circle cx="10.2" cy="10.4" r="1.05" fill="#2a2216" />
      <circle cx="14" cy="10.4" r="1.05" fill="#2a2216" />
      <path d="M10.4 13.6 C11.4 14.4 12.8 14.4 13.8 13.5" fill="none" stroke="#8a5f1f" strokeWidth="1" strokeLinecap="round" />
      <path d="M9.4 7.4 C10.2 6.2 11 5.7 12 5.5" fill="none" stroke={SHEEN} strokeWidth="1.1" strokeLinecap="round" />
    </>
  ),
  rule: (
    <>
      <path
        d="M5.6 3.6 C9.4 2.7 14.6 2.7 18.4 3.8 L17.9 17.9 C17.8 19.4 16.2 20.1 14.1 19.5 C12 18.9 9.3 19.2 7 20.4 C5.9 20.9 5.5 20.1 5.6 18.6 Z"
        fill="#f7edd5" stroke="#b78d51" strokeWidth="1.2" strokeLinejoin="round"
      />
      {/* the rule itself, in the book's ink — three lines, none of them straight */}
      <path d="M8 7.4 C10.4 6.9 13.4 6.9 16 7.3" fill="none" stroke="#8a6534" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M8.1 10.6 C10.2 10.2 13.8 10.2 15.8 10.6" fill="none" stroke="#8a6534" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
      <path d="M8.2 13.8 C9.8 13.4 12 13.4 13.6 13.7" fill="none" stroke="#8a6534" strokeWidth="1" strokeLinecap="round" opacity="0.66" />
      {/* the torn edge along the spine side — this page was RIPPED out */}
      <path d="M5.7 4.6 L7 6 L5.7 7.6 L7 9.2 L5.7 10.8 L7 12.4 L5.7 14" fill="none" stroke="#b78d51" strokeWidth="0.9" strokeLinejoin="round" />
      <path d="M7.6 5.2 C10 4.5 13.4 4.4 16.2 4.8" fill="none" stroke={SHEEN} strokeWidth="1.1" strokeLinecap="round" />
    </>
  ),
  book: (
    <>
      <path
        d="M4.4 5.4 C8 3.9 12.4 3.4 16.8 3.9 C18.7 4.1 19.6 5 19.5 6.4 L18.9 17.6 C18.8 19 17.7 19.6 15.8 19.4 C11.9 19 8.2 19.5 5.2 20.6 C4.3 20.9 4 20.2 4.1 18.8 Z"
        fill="#b4483c" stroke="#6d2a22" strokeWidth="1.2" strokeLinejoin="round"
      />
      {/* the page block, warm, slightly proud of the cover */}
      <path d="M6 6.6 C9 5.6 12.4 5.2 15.8 5.6 L15.4 17.4 C12.2 17.2 9 17.7 6.2 18.6 Z" fill="#f7edd5" stroke="#b78d51" strokeWidth="0.9" strokeLinejoin="round" />
      <path d="M7.6 9 C9.8 8.4 12 8.2 14 8.4" fill="none" stroke="#8a6534" strokeWidth="0.95" strokeLinecap="round" opacity="0.75" />
      <path d="M7.7 11.8 C9.6 11.3 11.6 11.1 13.4 11.3" fill="none" stroke="#8a6534" strokeWidth="0.9" strokeLinecap="round" opacity="0.6" />
      <path d="M5.6 6.4 C8.6 5.2 12.4 4.8 16 5.2" fill="none" stroke={SHEEN} strokeWidth="1.1" strokeLinecap="round" />
    </>
  ),
  palette: (
    <>
      <path
        d="M11.4 3.4 C16.6 3.2 20.6 6.4 20.5 10.6 C20.4 13.6 18.3 14.9 16.3 15.1 C14.6 15.3 13.8 16.2 13.9 17.5 C14 19.3 12.6 20.6 10.4 20.3 C6.3 19.8 3.4 16.2 3.5 11.9 C3.6 7 7 3.6 11.4 3.4 Z"
        fill="#f7edd5" stroke="#b78d51" strokeWidth="1.2" strokeLinejoin="round"
      />
      <circle cx="8.4" cy="8" r="1.9" fill="#c8503f" />
      <circle cx="13.6" cy="6.9" r="1.7" fill="#4a7fb0" />
      <circle cx="16.8" cy="10.8" r="1.6" fill="#7d9f4a" />
      <circle cx="7.7" cy="13.6" r="1.6" fill="#e7b357" />
      <path d="M5.6 8.4 C6.6 6.4 8.2 5.1 10.2 4.5" fill="none" stroke={SHEEN} strokeWidth="1.2" strokeLinecap="round" />
    </>
  ),
  door: (
    <>
      {/* the light that is already coming through — the point of this door */}
      <path d="M12.6 3.2 C15.6 3.4 17.6 3.9 18.8 4.6 L18.4 20.6 L12.4 20.6 Z" fill="#ffe6a8" />
      <path
        d="M5.4 4.6 C9.2 3.1 14.6 3 18.8 4.6 L18.3 20.6 L5.2 20.6 Z"
        fill="#8a6534" stroke="#4a3419" strokeWidth="1.2" strokeLinejoin="round"
      />
      {/* it stands AJAR: the leaf swung back, the gap full of warm light */}
      <path d="M12.5 3.4 C14.6 3.5 16.4 3.9 17.8 4.5 L17.4 20.6 L12.3 20.6 Z" fill="#f5d489" stroke="#4a3419" strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M7 7.4 C8.4 7 10 6.9 11.2 7.1" fill="none" stroke="#4a3419" strokeWidth="0.95" strokeLinecap="round" opacity="0.7" />
      <path d="M7.1 12.4 C8.4 12.1 10 12 11.2 12.2" fill="none" stroke="#4a3419" strokeWidth="0.95" strokeLinecap="round" opacity="0.55" />
      <circle cx="10.7" cy="14.4" r="1" fill="#e7b357" stroke="#4a3419" strokeWidth="0.8" />
      <path d="M6.4 5.8 C8.4 5 10.4 4.6 12.2 4.5" fill="none" stroke={SHEEN} strokeWidth="1.1" strokeLinecap="round" />
    </>
  ),
  knot: (
    <>
      <path d="M7.6 5.4 C13.4 5 16.8 8.2 16.4 12 C16 15.6 12.6 17.2 10.2 15.8 C8.2 14.6 8.6 11.6 11 11.2" fill="none" stroke="#c8a86a" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M16.6 5.6 C10.8 5.2 7.2 8.4 7.6 12.2 C8 15.8 11.4 17.4 13.8 16 C15.8 14.8 15.4 11.8 13 11.4" fill="none" stroke="#a9854a" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M9 19.6 C10.6 18.4 13.4 18.4 15 19.6" fill="none" stroke="#c8a86a" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M9.2 6.6 C11 6.1 13 6.1 14.6 6.5" fill="none" stroke={SHEEN} strokeWidth="1" strokeLinecap="round" />
    </>
  ),
  inkwell: (
    <>
      <path
        d="M6.4 10.2 C6.4 8.8 8.8 8.1 12 8.1 C15.2 8.1 17.6 8.8 17.6 10.2 L18.2 17.6 C18.3 19.4 15.6 20.6 12 20.6 C8.4 20.6 5.7 19.4 5.8 17.6 Z"
        fill="#3e4a6b" stroke="#232b41" strokeWidth="1.2" strokeLinejoin="round"
      />
      <ellipse cx="12" cy="10.2" rx="5.6" ry="1.9" fill="#1d2436" />
      <ellipse cx="12" cy="10.1" rx="4" ry="1.2" fill="#2f3d5c" />
      {/* the nib dipped in it — the clock in this book is ink drying */}
      <path d="M14.8 2.6 L17.8 5.4 L12.6 9.9 L11.2 7.4 Z" fill="#e7b357" stroke="#8a5f1f" strokeWidth="1" strokeLinejoin="round" />
      <path d="M12.6 7.2 L14.2 8.6" fill="none" stroke="#8a5f1f" strokeWidth="0.9" strokeLinecap="round" />
      <path d="M7.4 12 C7.2 14.4 7.4 16.4 8 18.2" fill="none" stroke={SHEEN} strokeWidth="1.1" strokeLinecap="round" opacity="0.5" />
    </>
  ),
  blot: (
    <>
      <path
        d="M11.4 3.4 C15 3 18.4 5 19.6 8.2 C20.8 11.4 19.6 14.8 17.4 16.6 C15.8 17.9 15.6 19 14 19.6 C11.8 20.4 9.4 19.4 8.6 17.6 C7.9 16 6 16.2 4.8 14.6 C3 12.2 3.4 8 5.8 5.8 C7.4 4.3 9.4 3.6 11.4 3.4 Z"
        fill="#2b2b3d" stroke="#17161f" strokeWidth="1.1" strokeLinejoin="round"
      />
      {/* the drops it always leaves — an ink imp is never tidy */}
      <circle cx="19.8" cy="17.6" r="1.5" fill="#2b2b3d" />
      <circle cx="5.2" cy="18.8" r="1" fill="#2b2b3d" opacity="0.85" />
      <ellipse cx="10" cy="10.4" rx="1.9" ry="2.2" fill="#f3ead2" />
      <ellipse cx="14.8" cy="10.2" rx="1.7" ry="2" fill="#f3ead2" />
      <circle cx="10.4" cy="10.8" r="0.95" fill="#17161f" />
      <circle cx="15.1" cy="10.6" r="0.9" fill="#17161f" />
      <path d="M7.4 6.4 C8.8 5.2 10.4 4.7 12 4.6" fill="none" stroke="rgba(255,253,244,0.28)" strokeWidth="1.2" strokeLinecap="round" />
    </>
  ),
  brush: (
    <>
      {/* the first pass drew this as a shaft with a point on it and it read as a
          PENCIL — the one thing a painted book's own mark must not be. A brush
          is three parts and it needs all three at this size: a soft splayed
          tuft, a metal ferrule with its ridges, and a handle that tapers. */}
      {/* the paint it just laid down */}
      <path d="M2.4 21.2 C3.4 19.6 5 19 6.8 19.4" fill="none" stroke="#c8503f" strokeWidth="1.6" strokeLinecap="round" opacity="0.85" />
      {/* the tuft: wide at the ferrule, splayed and rounded at the tip */}
      <path
        d="M8.9 13.2 C7.2 14 5.4 15.4 4.2 17.2 C3.4 18.4 3.6 19.4 4.7 19.9 C6.1 20.5 8.2 19.4 9.4 18 C10.2 17 10.7 16.2 11 15.3 Z"
        fill="#b4483c" stroke="#6d2a22" strokeWidth="1.1" strokeLinejoin="round"
      />
      {/* the ferrule */}
      <path d="M9.6 11.6 L13 15 L11.4 16.6 L8 13.2 Z" fill="#d9cfc2" stroke="#6b5c40" strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M9.4 13.4 L11.2 15.2" fill="none" stroke="#6b5c40" strokeWidth="0.8" strokeLinecap="round" />
      {/* the handle */}
      <path d="M11.2 10 L14.6 13.4 L20 8.6 C21 7.7 21 6.4 20.2 5.5 C19.3 4.6 18 4.6 17.1 5.6 Z" fill="#c8a86a" stroke="#8a5f1f" strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M13.4 8.4 C14.6 7.2 16 6 17.6 5.4" fill="none" stroke={SHEEN} strokeWidth="1" strokeLinecap="round" />
    </>
  ),
  slate: (
    <>
      <path
        d="M2.8 5.2 C2.7 4.1 3.5 3.5 4.8 3.5 L19.4 3.6 C20.6 3.6 21.3 4.2 21.2 5.3 L20.6 17.4 C20.5 18.5 19.8 19.1 18.6 19.1 L4.6 19 C3.4 19 2.8 18.4 2.9 17.3 Z"
        fill="#8a6534" stroke="#4a3419" strokeWidth="1.2" strokeLinejoin="round"
      />
      <path d="M5 6.2 C9.6 5.6 14.6 5.6 19 6.2 L18.5 16.4 C14.2 15.9 9.4 15.9 5.4 16.4 Z" fill="#3f6b4a" stroke="#2b4a33" strokeWidth="1" strokeLinejoin="round" />
      {/* chalk on it: a word half-written, which is what this board is for */}
      <path d="M7.4 9.6 C8.6 8.6 9.6 10.6 10.8 9.6 C11.8 8.8 12.8 10.6 14 9.8" fill="none" stroke="#f3ead2" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M7.5 12.6 C9.4 12.1 12 12.1 14.6 12.5" fill="none" stroke="#f3ead2" strokeWidth="1.1" strokeLinecap="round" opacity="0.75" />
      <path d="M4.6 4.8 C9.4 4.2 15 4.2 19 4.7" fill="none" stroke={SHEEN} strokeWidth="1.1" strokeLinecap="round" />
    </>
  ),
  rosette: (
    <>
      {/* the ribbons, behind — hand-cut, so they are not the same length */}
      <path d="M9.2 14.4 L7.2 21.4 L10.4 19.9 L12.2 21.6 L13.2 14.6 Z" fill="#c8503f" stroke="#7d2a22" strokeWidth="1" strokeLinejoin="round" />
      {/* the petals: eight, none of them a true circle */}
      <path
        d="M12 2.6 C13.6 4 14.8 4.3 16.6 3.9 C16.6 5.7 17.2 6.7 18.7 7.6 C17.8 9.1 17.8 10.3 18.6 11.9 C17.1 12.7 16.5 13.7 16.4 15.5 C14.7 15.1 13.5 15.5 12.2 16.8 C10.8 15.4 9.6 15 7.9 15.4 C7.8 13.6 7.2 12.6 5.7 11.7 C6.5 10.2 6.5 9 5.6 7.4 C7.2 6.6 7.8 5.6 7.9 3.8 C9.6 4.2 10.7 3.9 12 2.6 Z"
        fill="#e7b357" stroke="#a2560f" strokeWidth="1.1" strokeLinejoin="round"
      />
      <circle cx="12.1" cy="9.7" r="3.4" fill="#f7edd5" stroke="#a2560f" strokeWidth="1.1" />
      <path d="M9.8 5.4 C10.5 4.6 11.2 4.2 12 4" fill="none" stroke={SHEEN} strokeWidth="1.1" strokeLinecap="round" />
    </>
  ),
};

/** Every icon this book owns — the runtime list, so a caller's typo is a test
 *  failure rather than an invisible empty square on a ceremony screen. */
export const PAINTED_ICON_NAMES = Object.keys(paths) as PaintedIconName[];

/**
 * One painted icon, sized in ems by default so it sits on the text baseline of
 * whatever line it marks (the score rows and the goal legend are body copy, and
 * an icon that does not scale with the copy is the emoji problem in a second
 * costume).
 */
export function PaintedIcon({ name, size = "1.25em", art }: {
  name: PaintedIconName;
  size?: number | string;
  /** PK-R6 · H2 (round-2, ceremonies finding 5): the round-2 critic still read
   *  these code-drawn icons as „clip-art" next to the real paint. The REAL
   *  painted miniatures exist as a commissioned sheet (batch-ap
   *  `hud_painted_set.png`); once imported they land in the art map under
   *  `hud_<name>` and every icon wears its painted self. Until that stem
   *  exists, the code drawing below stays the fallback — the same
   *  buildable-before-the-art-lands rule the boss fight shipped under. */
  art?: Record<string, string>;
}): React.ReactElement {
  const painted = art?.[`hud_${name}`];
  if (painted !== undefined) {
    return (
      <img
        src={painted}
        alt=""
        aria-hidden
        width={size}
        height={size}
        style={{ display: "inline-block", verticalAlign: "-0.22em", flex: "0 0 auto", objectFit: "contain" }}
      />
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden
      focusable="false"
      style={{ display: "inline-block", verticalAlign: "-0.22em", flex: "0 0 auto" }}
    >
      {paths[name]}
    </svg>
  );
}
