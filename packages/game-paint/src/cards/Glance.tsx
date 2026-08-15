// GLANCE · the painted parts of a card that can be read at a glance
// (R5-W1 · D1). The decisions are in glance.ts (pure, tested); this file only
// draws them, and it is the ONE place the overlay is allowed to emphasise
// anything — cards/emphasis.test.ts fails any hand-built bold elsewhere.
//
// Four parts, in the order a child meets them:
//   Plate  — the picture the card leads with
//   Key    — the one marked line (the ask)
//   Quiet  — everything that is not the ask, one step back
//   ActRow — the painted mark that says what to DO, over the controls
//   HelpFold — the hint ladder, folded until it is earned
import React from "react";
import { ACT_LABEL_DE, type ActMark } from "./glance.ts";

/** The picture a card leads with: the asker's portrait, the image stimulus, or
 *  nothing at all (a card with neither draws its act mark large instead — see
 *  ActPlate). `wash` keeps the portrait exactly as drained as the being in the
 *  world (the desaturation law, doc 41 §2): a full-colour face over a grey desk
 *  would hand a restore card's own answer away. */
export const Plate = ({ url, behindUrl, altDe, wash = 0, height = 132, mark }: {
  url: string; behindUrl?: string; altDe: string; wash?: number; height?: number; mark?: ActMark;
}): React.ReactElement => (
  <div className="pb-plate-wrap">
    <div className="pb-plate">
      {/* R5-W4 · D3 · F-14 · R54 · WHAT IS INSIDE, DRAWN INSIDE. The cage shell
          is one picture for four different captives, so the occupant is its own
          layer BEHIND it — the same stacking the world already uses (the bars
          belong in front of the captive: PaintScene depth 6.99 behind 7, both
          anchored bottom-centre). Absolute so it cannot change the plate's box,
          and it wears the SAME wash as the shell: a full-colour thing behind
          grey bars would hand the restore law's own answer away. */}
      {behindUrl !== undefined && (
        <img
          src={behindUrl}
          alt=""
          aria-hidden
          style={{
            // The occupant sheets are painted in register with the cage's
            // resting cell (both 347 x 480), but a cage that is SHAKING shows a
            // wider cell (385 x 479) — so the layer is fitted into the shell's
            // own box rather than assumed to match it, anchored bottom-centre
            // like every being in the world (origin 0.5, 1).
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "contain", objectPosition: "50% 100%",
            filter: wash > 0 ? `grayscale(${wash})` : undefined,
            pointerEvents: "none",
          }}
        />
      )}
      {/* bounded on BOTH axes: the cells are painted at whatever aspect their
          being needs, and a wide one sized by height alone grew until it was
          the whole card (found in the render, first exemplar round) */}
      <img
        src={url}
        alt={altDe}
        style={{
          position: "relative",
          maxHeight: height, maxWidth: "100%", height: "auto", width: "auto",
          filter: wash > 0 ? `grayscale(${wash})` : undefined,
        }}
      />
    </div>
    {/* THE VERB, STAMPED ON THE PICTURE (second exemplar round). Beside the ask
        it floated at the card's left edge and read as a stray control; pressed
        into the corner of the thing it acts on, it is a seal — and it says what
        to do about THAT, which is the whole sentence a child needs. */}
    {mark !== undefined && <span className="pb-stamp"><ActIcon mark={mark} size={26} /></span>}
  </div>
);

/** THE ONE EMPHASIS DEVICE. `en` marks the English ask, which gets the book's
 *  accent ink — on Koki's own screenshot the English was the smallest type on
 *  the card, inside the buttons, while three lines of German outranked it.
 *
 *  IT DEGRADES BY LENGTH, and that is the point. A blind critic on the first
 *  full round caught the failure exactly: on a ceremony whose sentence runs
 *  long, marking the whole line „bolds the whole paragraph indiscriminately",
 *  which is emphasis that emphasises nothing. The threshold is the card law's
 *  own number — MAX_LINE_DE, 56 characters, „one short clause and the ask,
 *  read-aloud-able by a six-year-old in about five seconds" — so a line short
 *  enough to BE the ask is marked, and a longer one leads without shouting. */
export const KEY_MAX_CHARS = 56;

const textLengthOf = (node: React.ReactNode): number => {
  if (typeof node === "string") return node.length;
  if (typeof node === "number") return String(node).length;
  if (Array.isArray(node)) return node.reduce<number>((n, c) => n + textLengthOf(c), 0);
  if (React.isValidElement(node)) return textLengthOf((node.props as { children?: React.ReactNode }).children);
  return 0;
};

export const Key = ({ children, en = false }: { children: React.ReactNode; en?: boolean }): React.ReactElement => {
  const long = textLengthOf(children) > KEY_MAX_CHARS;
  const cls = `${long ? "pb-key pb-key-long" : "pb-key"}${en ? " pb-key-en" : ""}`;
  return <p className={cls}>{children}</p>;
};

/** The inline half of the same device: the ONE word or number inside a line
 *  that carries it („27 Buchstaben", „PERFEKT!"). Same ink and same face as the
 *  Key, without the stroke — a stroke under a fragment mid-sentence reads as a
 *  correction mark. Everything that used to be a hand-built <strong> is one of
 *  these now, so „what is emphasised" is a decision with one home. */
export const KeyBit = ({ children }: { children: React.ReactNode }): React.ReactElement => (
  <span className="pb-key-bit">{children}</span>
);

/** everything that is not the ask */
export const Quiet = ({ children, italic = false }: { children: React.ReactNode; italic?: boolean }): React.ReactElement => (
  <p className={italic ? "pb-quiet pb-quiet-i" : "pb-quiet"}>{children}</p>
);

// ── THE ACT MARKS ────────────────────────────────────────────────────────────
// Nine painted verbs, one per act a card can ask for. Drawn in code (no asset,
// no font glyph) under doc 44 B14's full-code clause, in ONE stroke weight so
// they read as one family, and with NO gradient <defs>: an icon that repeats
// many times per document may not carry ids (the PaintedIcons house rule).
//
// They are PICTURES ONLY. Their German names ride in aria-label, never on the
// card — this packet moves layout, and new visible German would be C1's copy
// lane, not this one.
// They are drawn to be read at 26 px on a painted plate — which means FEW,
// FAT strokes. The first round drew them at icon-set detail (a hand with
// fingers, three chips with an arrow over them) and the render turned every one
// of them into a squiggle; what survives here is the shape a child could draw.
const ACT_PATHS: Record<ActMark, React.ReactElement> = {
  // tap the right one: a finger pressing, with the press ringing out
  tap: (
    <>
      <path d="M12 20.4c-3.4-1.2-5-3.6-5-7 0-.6.5-1.1 1.1-1.1.9 0 1.7.4 2.3 1.2V6.2c0-1 .7-1.7 1.6-1.7s1.6.7 1.6 1.7v5.2c2.9.2 4.4 1.8 4.4 4.6 0 1.9-.7 3.3-2 4.4z" />
      <path d="M4.6 6.4L3 4.6M19.4 6.4L21 4.6" />
    </>
  ),
  // which one does not belong: two of a kind and one struck out
  odd: (
    <>
      <circle cx="5.4" cy="12" r="3" />
      <circle cx="12" cy="12" r="3" />
      <path d="M15.4 8.4l5.6 7.2M21 8.4l-5.6 7.2" />
    </>
  ),
  // put them in order: three bars, shortest first
  order: (
    <>
      <path d="M4.4 20V15M12 20V10.4M19.6 20V5.2" />
      <path d="M3 20h18" />
    </>
  ),
  // build it out of letters: a tile dropping onto the slots
  letters: (
    <>
      <rect x="8.4" y="3" width="7.2" height="7.2" rx="2" />
      <path d="M12 12.6v3.6M9.6 14.2L12 16.6l2.4-2.4" />
      <path d="M3.4 20.4h4.4M9.8 20.4h4.4M16.2 20.4h4.4" />
    </>
  ),
  // turn the wheel: a dial coming round to a mark
  wheel: (
    <>
      <path d="M19.4 8.2A8.4 8.4 0 1 0 20.4 12" />
      <path d="M14.6 8.6h5.8V2.8" />
      <path d="M12 8.4v3.6l2.6 2.2" />
    </>
  ),
  // find the wrong word: a line of words with one struck out
  fix: (
    <>
      <path d="M3.4 8h6.2M14.4 8h6.2M3.4 15.6h17.2" />
      <path d="M10.6 4.6l3 6.8M13.6 4.6l-3 6.8" />
    </>
  ),
  // find the pairs: two cards turned over together
  pairs: (
    <>
      <rect x="2.8" y="4.4" width="8.2" height="11" rx="2.2" />
      <rect x="13" y="8.6" width="8.2" height="11" rx="2.2" />
      <path d="M11.4 10.6l1.2-1.2" />
    </>
  ),
  // write it: a nib on a ruled line
  write: (
    <>
      <path d="M3.4 20.4h17.2" />
      <path d="M7.6 16.4L17.4 6.6c.9-.9 2.2-.9 3 0 .9.9.9 2.2 0 3l-9.8 9.8-4.4.8z" />
    </>
  ),
  // give the colour back: a brush laying a blob
  colour: (
    <>
      <path d="M7.4 13.6L14.6 5c.9-1.1 2.4-1.2 3.4-.3 1 .9 1 2.4.1 3.4l-8 7.8z" />
      <path d="M7.4 13.6l3 2.6" />
      <circle cx="6" cy="19.4" r="3" />
    </>
  ),
};

/** The painted verb of a card.
 *
 *  DRAWN TWICE, and that is the whole trick: a blind critic on the full round
 *  called the marks „generic flat vector icons clashing with the painted
 *  illustrations". A nib does not lay one even line — it goes over, doubles
 *  slightly, and leaves the second pass a hair off the first. So the same
 *  paths are stroked once fat and soft underneath and once crisp on top,
 *  nudged a fraction. No asset, no filter, and it reads as ink rather than as
 *  an icon set. */
export const ActIcon = ({ mark, size = 22 }: { mark: ActMark; size?: number }): React.ReactElement => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    role="img"
    aria-label={ACT_LABEL_DE[mark]}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "inline-block", flex: "0 0 auto" }}
  >
    {/* the wet pass: wider, softer, laid down first and slightly off */}
    <g strokeWidth={3.1} opacity={0.28} transform="translate(0.45 0.5) rotate(-0.8 12 12)">
      {ACT_PATHS[mark]}
    </g>
    {/* the pass that carries the shape */}
    <g strokeWidth={2}>{ACT_PATHS[mark]}</g>
  </svg>
);

/** A card with no picture of its own leads with its verb instead, drawn large:
 *  doc 44 §3.1 — a bare text card is not a legitimate surface. */
export const ActPlate = ({ mark }: { mark: ActMark }): React.ReactElement => (
  <div className="pb-plate" style={{ padding: "14px 22px", color: "#7d6740", lineHeight: 0 }}>
    <ActIcon mark={mark} size={62} />
  </div>
);

/** THE HELP FOLD (glance.ts owns when it opens). Each rung is one short line
 *  with its own painted mark — the emoji that used to carry them (💡 📖) were
 *  the reader's own operating-system font sitting on painted paper. */
export const HelpFold = ({ open, onToggle, rows }: {
  open: boolean;
  onToggle: () => void;
  rows: { key: string; mark: React.ReactNode; text: React.ReactNode }[];
}): React.ReactElement | null => {
  if (rows.length === 0) return null;
  return (
    <div className="pb-help" data-open={open ? "1" : "0"}>
      <button className="pb-help-tab" onClick={onToggle} aria-expanded={open}>
        <HintMark />
        {open ? "Hilfe zu" : "Hilfe"}
      </button>
      <div className="pb-help-body" aria-hidden={!open}>
        {rows.map((r) => (
          <p key={r.key} className="pb-help-row">
            <span style={{ marginTop: 1, display: "flex" }}>{r.mark}</span>
            <span>{r.text}</span>
          </p>
        ))}
      </div>
    </div>
  );
};

/** the help mark itself: a painted chalk lamp, not 💡 */
export const HintMark = ({ size = 16 }: { size?: number }): React.ReactElement => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden focusable="false"
    fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round"
    style={{ display: "inline-block", flex: "0 0 auto" }}>
    <path d="M12 3.2c3.4 0 5.8 2.5 5.8 5.6 0 2.3-1.3 3.5-2.2 4.6-.6.7-.9 1.3-.9 2.2H9.3c0-.9-.3-1.5-.9-2.2-.9-1.1-2.2-2.3-2.2-4.6C6.2 5.7 8.6 3.2 12 3.2z" />
    <path d="M9.8 18.4h4.4M10.6 21h2.8" />
  </svg>
);

/** the word-hint mark: a page of the book, not 📖 */
export const WordMark = ({ size = 16 }: { size?: number }): React.ReactElement => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden focusable="false"
    fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round"
    style={{ display: "inline-block", flex: "0 0 auto" }}>
    <path d="M12 6.6C10.2 5.2 7.8 4.6 4.4 4.8v13c3.4-.2 5.8.4 7.6 1.8 1.8-1.4 4.2-2 7.6-1.8v-13c-3.4-.2-5.8.4-7.6 1.8z" />
    <path d="M12 6.6v13" />
  </svg>
);

/** THE FACE-DOWN CARD (the memory kind). It was „❓" — the reader's own font,
 *  eight times on one card, which the blind critic called the worst surface in
 *  the set: eight identical system glyphs say „error", not „turn me over".
 *  This is the book's own back: ruled paper with an ink flourish. */
export const CardBack = ({ size = 30, n }: { size?: number; n?: number }): React.ReactElement => (
  <svg width={size} height={size} viewBox="0 0 24 24" role="img"
    aria-label={n === undefined ? "umgedrehte Karte" : `umgedrehte Karte ${n}`}
    style={{ display: "inline-block", flex: "0 0 auto" }}>
    <rect x="2.6" y="2.6" width="18.8" height="18.8" rx="3.4" fill="#e2cfa2" stroke="#8a6f3c" strokeWidth="1.6" />
    <g stroke="#b79a63" strokeWidth="1" opacity="0.85">
      <path d="M5.4 7.2h13.2M5.4 10.4h13.2M5.4 13.6h13.2M5.4 16.8h13.2" />
    </g>
    {/* R5-W1 · D2 (blind critic, critical): the back carried only a flourish, so
        eight of them were eight identical unnameable things — „fails the
        3-second test outright". A NUMBER makes each card a card: a child can
        say „drei", point at it, and remember where the pair was. It says
        nothing about what is under it. */}
    {n === undefined ? (
      <path d="M9 15.4c-1.6-1-1.9-3-.6-4.3 1.2-1.2 3.2-1 4.2.4.8 1.2.4 2.6-.7 3.2-.9.5-1.9.1-2.2-.7-.2-.6.1-1.2.7-1.4"
        fill="none" stroke="#5e4a24" strokeWidth="1.7" strokeLinecap="round" />
    ) : (
      <text x="12" y="16.6" textAnchor="middle" fontSize="11" fontWeight="800"
        fontFamily="var(--font-display, inherit)" fill="#5e4a24">{n}</text>
    )}
  </svg>
);

/** the picture-stimulus mark: a painted frame, not 🖼 */
export const PictureMark = ({ size = 16 }: { size?: number }): React.ReactElement => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden focusable="false"
    fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round"
    style={{ display: "inline-block", flex: "0 0 auto" }}>
    <rect x="3.2" y="4.6" width="17.6" height="14.8" rx="2.2" />
    <path d="M3.2 15.4l4.6-4.2 3.6 3.2 3.8-4.4 5.6 5.6" />
  </svg>
);

/** R5-W2 · J1-D · THE STRUCK-THROUGH WRONG FORM — the book's third sanctioned
 *  emphasis device, and the only one that means „NOT this".
 *
 *  From the teacher's critique: one wrong form struck through beats three right
 *  ones when the mistake is about placement. „I'am" is not a different rule; it
 *  is this rule with the apostrophe in the wrong place, and that is the shape
 *  the page has to name.
 *
 *  WHY IT IS A DEVICE AND NOT AN `<s>`. The browser's own strike draws a hairline
 *  through the middle of the glyphs in whatever colour the text is, which on
 *  painted paper reads as a rendering fault — and an inline one in RulePage.tsx
 *  is exactly the drift cards/emphasis.test.ts exists to stop, even though
 *  neither tag is on its ban list today. That guard only works if the devices
 *  live HERE, where it can see them. So this is one INK STROKE: hand-laid, not
 *  quite level, thinning at both ends, in the correction ink.
 *
 *  It carries no aria trickery on purpose. The line around it reads „Nicht: … —
 *  richtig: …", so a screen reader gets the whole sentence right without the
 *  stroke; a struck word HIDDEN from a reader is a word that reader is never
 *  warned about. */
export const Struck = ({ children }: { children: React.ReactNode }): React.ReactElement => (
  <span className="pb-struck">{children}</span>
);
