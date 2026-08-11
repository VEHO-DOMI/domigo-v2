// GLANCE (R5-W1 · D1) — the pure decisions behind a card that can be read at a
// glance. Kokis Befund vom 11. August: „man hängt im Lesen fest" — vier
// gleichrangige Zeilen, keine markiert, und das Englische (der Lernstoff) war
// die kleinste Schrift auf der Karte.
//
// The fix is a HIERARCHY, not shorter sentences (the sentences are already
// capped at 56 characters by MAX_LINE_DE — the kurzweilig law, F2-2). Three
// decisions carry it, and all three live here rather than in the JSX, because
// the package has no DOM test setup: what is pure is tested, what renders is
// photographed.
//
//  1. THE ACT MARK — a painted glyph that answers „was ist zu tun?" without a
//     word. It is a PICTOGRAM ONLY; its German name lives in an aria-label, not
//     on the card. This packet moves layout, never copy (that is C1's lane), so
//     no new visible German enters the game here.
//  2. THE KEY LINE — WHICH of the strings a card already carries is the one
//     rendered big and marked. Never a new string, never a rewritten one: the
//     card's own ask, promoted out of the paragraph it was buried in.
//  3. THE HELP FOLD — the hint ladder opens by itself in the beat it is earned
//     and can be folded away again, instead of standing open forever.
import type { GameTaskV2 } from "@domigo/content-schema";

/** the nine acts a card can ask for — one per card kind, plus the colour step
 *  the restore card owns (its two halves are two different acts, and the child
 *  is told so by the mark changing under them) */
export type ActMark =
  | "tap" | "odd" | "order" | "letters" | "wheel" | "fix" | "pairs" | "write" | "colour";

/** what the mark means, for assistive technology only — never drawn */
export const ACT_LABEL_DE: Record<ActMark, string> = {
  tap: "tippe das Richtige an",
  odd: "finde, was nicht dazugehört",
  order: "bring sie in die richtige Reihenfolge",
  letters: "leg die Buchstaben",
  wheel: "dreh das Rad auf die Zahl",
  fix: "finde das falsche Wort",
  pairs: "finde die Paare",
  write: "schreib das Wort",
  colour: "gib die Farbe zurück",
};

/** The act a card asks for. `step` is the restore card's own half ("name" or
 *  "colour"); every other kind ignores it. */
export const actMarkFor = (kind: GameTaskV2["kind"], step?: string): ActMark => {
  switch (kind) {
    case "choice": return "tap";
    case "oddone": return "odd";
    case "order": return "order";
    case "spell": return "letters";
    case "wheel": return "wheel";
    case "mistake": return "fix";
    case "memory": return "pairs";
    case "typed": return "write";
    case "restore": return step === "colour" ? "colour" : "tap";
  }
};

/** Which of the card's OWN strings is the key line — the one that goes big and
 *  carries the mark. Two shapes:
 *   · "en" — the English ask (`promptEn`). It is the lesson, and it was the
 *     smallest type on the card; on a card that has one it always leads.
 *   · "de" — the German ask (`storyDe`, or the restore card's colour question).
 *     Used where a card has no English ask of its own, so the head of the card
 *     is never empty and the fiction line never has to double as the ask.
 *  The other line stays exactly where it was, one step quieter. */
export type KeyLine = { source: "en" | "de"; text: string };

export const keyLineOf = (task: GameTaskV2, colourAskDe?: string): KeyLine => {
  // the restore card's second half asks its own question — while that half is
  // open, THAT is the line the child must read, not the card's opening ask
  if (colourAskDe !== undefined && colourAskDe.trim() !== "") return { source: "de", text: colourAskDe };
  const en = (task as { promptEn?: string }).promptEn;
  if (typeof en === "string" && en.trim() !== "") return { source: "en", text: en };
  return { source: "de", text: task.storyDe };
};

/** How many rungs of the hint ladder this card is currently offering. The
 *  ladder itself lives in hint.ts; this only counts what is on show, because
 *  the fold has to know whether a NEW rung just arrived. `gap` is the letter
 *  ladder („P _ _"), which is a rung of its own and does not follow the
 *  attempt count on every kind (a spell card draws its own slots — see
 *  gapLevelFor). */
export const hintRungsAt = (task: GameTaskV2, attempts: number, gap = false): number => {
  let n = gap ? 1 : 0;
  if (attempts >= 1 && task.hints?.deDesc !== undefined) n += 1;
  if (attempts >= 2 && task.hints?.deWord !== undefined) n += 1;
  return n;
};

/** THE HELP FOLD. Rule, in one sentence: help opens itself the moment it is
 *  earned, and stays wherever the child last put it after that.
 *
 *  Why not „always open" (today's behaviour): a permanently open hint block is
 *  two more lines of German competing with the ask on every single card, which
 *  is the defect this packet exists to remove. Why not „always folded": a
 *  six-year-old who just got something wrong should not have to find the help —
 *  it is the one moment the card owes them something.
 *
 *  `shownRungs` is what the fold has already opened for; a rung count ABOVE it
 *  means a new rung just landed. */
export interface FoldState { open: boolean; shownRungs: number }

export const FOLD_START: FoldState = { open: false, shownRungs: 0 };

export const foldFor = (prev: FoldState, rungs: number): FoldState =>
  rungs > prev.shownRungs ? { open: true, shownRungs: rungs } : { ...prev, shownRungs: rungs };

export const foldToggled = (prev: FoldState): FoldState => ({ ...prev, open: !prev.open });
