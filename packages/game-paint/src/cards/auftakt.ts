// R5-W2 · J1-B · THE OPENING IS A LINE, NOT A GRAPH.
//
// Koki, on the shipped chapter opening: „der level start sollte ein bisschen
// mehr story mode like eingeführt werden mit mehreren visuellen cards und
// teasern und konkreter story beschreibung und expliziter aufgaben (nicht nur
// eine simple karte mit allen listungen)."
//
// Four beats replace one card. The ORDER of them lives here — once — for three
// reasons, and the third is the one that earns the file:
//
//   · »weiter« and »zurück« cannot disagree about what comes next, because
//     both read the same array from opposite directions;
//   · a test can walk the chain from both ends with no DOM, which PaintGame.tsx
//     cannot offer (it imports Phaser, so this package cannot render it — the
//     emphasis and icon tests already scan it as TEXT for exactly that reason);
//   · the shell gets ONE answer to the only question that actually matters —
//     does putting THIS beat down give the world back? Stated as arithmetic, it
//     is a property a test can assert. Stated as a comment in a 480-line switch,
//     it is a promise, and the promise this replaces was already broken once
//     (pickups.test.ts: „a Regel-Seite FREEZES the world").

/** The four beats of a chapter opening. */
export type AuftaktCard = "goal" | "schatten" | "aufgaben" | "los";

/** The beats in order.
 *
 *  `goal` keeps its name deliberately, and it is not sentiment: it is the value
 *  the boot state writes, the ceremony beat `sim.ts` already carries, and the
 *  address the card bench is photographed at (`?karten=goal`). Renaming it for
 *  tidiness would rename all three and buy a label. */
export const AUFTAKT: readonly AuftaktCard[] = ["goal", "schatten", "aufgaben", "los"];

const isAuftakt = (card: string): card is AuftaktCard =>
  (AUFTAKT as readonly string[]).includes(card);

/** One step along the chain, or null at its ends.
 *
 *  Null for any card that is not IN the chain, so a task card can never be
 *  walked into the opening by a stray call. */
export const auftaktStep = (card: string, d: 1 | -1): AuftaktCard | null => {
  if (!isAuftakt(card)) return null;
  return AUFTAKT[AUFTAKT.indexOf(card) + d] ?? null;
};

/** Which beat a child is on, 1-based — and how many there are. The foot prints
 *  these, and like every other number the book shows they are COUNTED, never
 *  typed (doc 41 §7, the letter-honesty law). */
export const auftaktPosition = (card: string): { at: number; of: number } | null =>
  isAuftakt(card) ? { at: AUFTAKT.indexOf(card) + 1, of: AUFTAKT.length } : null;

/** What the shell must DO when a beat is put down.
 *
 *  `unfreeze` is true for exactly one of the four, and it is the same one that
 *  raises the world. That is the whole law of this packet in one boolean:
 *  three hand-overs that must NOT give the world back, and one exit that must.
 *  The opening's freeze is stricter than the reading card's, because the world
 *  has never been un-frozen at all — the boot ceremony is the first thing
 *  rendered, so the freeze exists before the first tick. Un-freezing between
 *  beat 2 and beat 3 would start the chapter running underneath a card a child
 *  is still reading. */
export interface AuftaktExit {
  /** the next beat, or null if this was the last */
  next: AuftaktCard | null;
  /** may the shell give the world back here? */
  unfreeze: boolean;
  /** does the chapter start here? (the world fades up, the flag is remembered) */
  boot: boolean;
}

export const auftaktExit = (card: string): AuftaktExit => {
  if (!isAuftakt(card)) return { next: null, unfreeze: false, boot: false };
  const next = auftaktStep(card, 1);
  const last = next === null;
  return { next, unfreeze: last, boot: last };
};

// ── BEAT 3'S TASK LINES ──────────────────────────────────────────────────────
//
// The lines live here rather than in the renderer for one reason: German has a
// singular. A line built as `Nimm {n} Bonus-Bücher mit` is correct for every n
// the chapter happens to ship and wrong the day one of them is 1 — which is the
// SAME defect the old objective card carried in the other direction („3
// Klassenkinder STECKT fest"), found then by a critic rather than by a check.
// Out here it is five pure strings a test can walk at n = 0, 1 and 2.

/** What the opening counts. Structural on purpose — the renderer hands it the
 *  live Bilanz, the test hands it a literal. */
export interface AuftaktCounts {
  letters: number;
  collectNounDe: string;
  drained: number;
  cages: number;
  kids: number;
  tips: number;
  books: number;
}

export interface AuftaktTask {
  key: string;
  /** the painted mark AQ8 delivered for this row, if it has one */
  mark?: string;
  /** the code-drawn icon that stands in when it has none */
  icon: "spark" | "palette" | "cage" | "rule" | "book";
  askDe: string;
  whyDe: string;
}

/** The chapter's contract with the child, one line per task.
 *
 *  EVERY NUMBER IS PASSED IN, never typed (doc 41 §7): this page is the promise
 *  the chapter makes, and a promise with a typed number in it is the one thing
 *  it may not be. A category the chapter does not have draws no line at all. */
export const auftaktTasks = (c: AuftaktCounts): AuftaktTask[] => {
  const out: AuftaktTask[] = [];
  if (c.letters > 0) {
    // ⚠ `collectNounDe` is AUTHORED AND PLURAL („Buchstaben"), and its singular
    // is not derivable: the article and the ending depend on the noun's gender,
    // which the level never declares — and the next chapter's collectible may be
    // feminine or neuter. So at one, this line does not invent a singular; it
    // drops the number instead and lets the quiet line carry it with the
    // gender-free indefinite pronoun. A chapter that really ships ONE
    // collectible should declare a singular noun of its own; until one does,
    // guessing would be worse than not counting out loud.
    out.push({
      key: "letters", mark: "auftakt_mark_letters", icon: "spark",
      askDe: c.letters === 1 ? `Sammle ${c.collectNounDe}.` : `Sammle ${c.letters} ${c.collectNounDe}.`,
      whyDe: c.letters === 1 ? "Es fehlt nur noch eines." : "Sie liegen überall verstreut.",
    });
  }
  if (c.drained > 0) {
    out.push({
      key: "drained", icon: "palette",
      askDe: c.drained === 1
        ? "Gib einer entfärbten Schulsache die Farbe zurück."
        : `Gib ${c.drained} entfärbten Schulsachen die Farbe zurück.`,
      whyDe: c.drained === 1 ? "Sag, was sie ist." : "Sag, was sie sind.",
    });
  }
  if (c.cages > 0) {
    // the classmate is this row's SUBLINE and not a sixth row: „ein Klassenkind"
    // plus „fünf Käfige" is six things to a six-year-old when the child is one
    // OF the five (the old objective card made that argument; it still holds)
    out.push({
      key: "cages", mark: "auftakt_mark_cages", icon: "cage",
      askDe: c.cages === 1 ? "Mach den Käfig auf." : `Mach ${c.cages} Käfige auf.`,
      whyDe: c.kids === 0
        ? (c.cages === 1 ? "Er ist zu." : "Sie sind alle zu.")
        : c.kids === 1
          ? (c.cages === 1 ? "Darin steckt ein Klassenkind." : "In einem steckt ein Klassenkind.")
          : `In ${c.kids} davon stecken Klassenkinder.`,
    });
  }
  if (c.tips > 0) {
    // named rather than „er": the antecedent would sit two beats back with four
    // other nouns in between — a long hunt for a first-grader tracking a pronoun
    out.push({
      key: "tips", mark: "auftakt_mark_tips", icon: "rule",
      askDe: c.tips === 1 ? "Finde die Regel-Seite." : `Finde ${c.tips} Regel-Seiten.`,
      // „sie" carries both numbers here (die Seite / die Seiten), so this line
      // needs no branch — and a branch whose two arms are identical is a lie
      // about where the variation is.
      whyDe: "Der Tinten-Schatten hat sie herausgerissen.",
    });
  }
  if (c.books > 0) {
    out.push({
      key: "books", icon: "book",
      askDe: c.books === 1 ? "Nimm das Bonus-Buch mit." : `Nimm ${c.books} Bonus-Bücher mit.`,
      whyDe: c.books === 1 ? "Es liegt versteckt." : "Sie liegen versteckt.",
    });
  }
  return out;
};
